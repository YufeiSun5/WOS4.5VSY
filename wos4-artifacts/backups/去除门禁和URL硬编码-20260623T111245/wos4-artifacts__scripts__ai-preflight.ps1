param(
  [string]$ExpectedDeveloper = "SunYufei",
  [string]$TaskPath = "",
  [switch]$RequireClean,
  [switch]$Wos4
)

$ErrorActionPreference = "Stop"

function Join-Chars {
  param([int[]]$Codes)
  return -join ($Codes | ForEach-Object { [char]$_ })
}

function Add-Result {
  param(
    [object]$List,
    [string]$Name,
    [string]$Status,
    [string]$Message
  )
  $List.Add([ordered]@{
    name = $Name
    status = $Status
    message = $Message
  }) | Out-Null
}

function Get-IniValue {
  param(
    [string]$Raw,
    [string]$Section,
    [string]$Key
  )
  $sectionPattern = "(?ms)^\s*\[" + [regex]::Escape($Section) + "\]\s*(.*?)(?=^\s*\[[^\]]+\]\s*|\z)"
  $match = [regex]::Match($Raw, $sectionPattern)
  if (-not $match.Success) { return $null }
  foreach ($line in ($match.Groups[1].Value -split "`r?`n")) {
    $keyPattern = "^\s*" + [regex]::Escape($Key) + "\s*=\s*(.*)\s*$"
    if ($line -match $keyPattern) { return $Matches[1].Trim() }
  }
  return $null
}

$defaultDeveloperName = Join-Chars @(23385, 23431, 39134)
if ($ExpectedDeveloper -eq "SunYufei") {
  $ExpectedDeveloper = $defaultDeveloperName
}

$repoRoot = (& git rev-parse --show-toplevel 2>$null)
if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($repoRoot)) {
  throw "Not inside a Git workspace."
}
$repoRoot = $repoRoot.Trim()
Set-Location $repoRoot

$results = New-Object "System.Collections.Generic.List[object]"
$failed = $false

$statusLines = @(& git status --short --untracked-files=all)
$dirtyCount = $statusLines.Count
if ($dirtyCount -eq 0) {
  Add-Result $results "git.dirty" "pass" "Git workspace is clean."
} elseif ($RequireClean) {
  Add-Result $results "git.dirty" "fail" "Git workspace has $dirtyCount changed or untracked items and RequireClean is enabled."
  $failed = $true
} else {
  Add-Result $results "git.dirty" "warn" "Git workspace has $dirtyCount changed or untracked items. Confirm commit scope before staging."
}

$profilePath = "wos4-artifacts/config/browser-harness-chrome-profile/"
& git check-ignore -q $profilePath
if ($LASTEXITCODE -eq 0) {
  Add-Result $results "gitignore.browserProfile" "pass" "$profilePath is ignored by Git."
} else {
  Add-Result $results "gitignore.browserProfile" "fail" "$profilePath is not ignored by Git."
  $failed = $true
}

$trackedSensitiveRaw = @(& git ls-files "wos4-artifacts/config/browser-harness-chrome-profile/*" "wos4-artifacts/config/**/Cookies*" "wos4-artifacts/config/**/Login Data*" "wos4-artifacts/config/**/History*" "wos4-artifacts/config/**/Web Data*" "wos4-artifacts/config/*.ini")
$trackedSensitive = @($trackedSensitiveRaw | Where-Object { $_ -notlike "*.example.ini" })
if ($trackedSensitive.Count -eq 0) {
  Add-Result $results "git.trackedSensitive" "pass" "No tracked browser profile, cookie, history, login data, web data, or real ini files found."
} else {
  Add-Result $results "git.trackedSensitive" "fail" ("Tracked sensitive paths: " + ($trackedSensitive -join "; "))
  $failed = $true
}

$iniPath = "wos4-artifacts/config/wos4.local.ini"
if (Test-Path -LiteralPath $iniPath) {
  $rawIni = Get-Content -LiteralPath $iniPath -Raw -Encoding UTF8
  $developerName = Get-IniValue $rawIni "identity" "developer_name"
  $workspaceName = Get-IniValue $rawIni "identity" "workspace_name"
  $wos4Url = Get-IniValue $rawIni "wos4" "url"
  $wos4Username = Get-IniValue $rawIni "wos4" "username"
  $wos4Password = Get-IniValue $rawIni "wos4" "password"

  if ($developerName -eq $ExpectedDeveloper) {
    Add-Result $results "ini.identity" "pass" "developer_name matches expected developer."
  } else {
    Add-Result $results "ini.identity" "fail" "developer_name does not match expected developer."
    $failed = $true
  }

  if ([string]::IsNullOrWhiteSpace($workspaceName)) {
    Add-Result $results "ini.workspace" "fail" "workspace_name is empty."
    $failed = $true
  } else {
    Add-Result $results "ini.workspace" "pass" "workspace_name is present."
  }

  $missingWos4 = @()
  if ([string]::IsNullOrWhiteSpace($wos4Url)) { $missingWos4 += "url" }
  if ([string]::IsNullOrWhiteSpace($wos4Username)) { $missingWos4 += "username" }
  if ([string]::IsNullOrWhiteSpace($wos4Password)) { $missingWos4 += "password" }
  if ($missingWos4.Count -eq 0) {
    Add-Result $results "ini.wos4" "pass" "wos4 url, username, and password are present. Secret values are not printed."
  } else {
    Add-Result $results "ini.wos4" "fail" ("Missing wos4 fields: " + ($missingWos4 -join ", "))
    $failed = $true
  }
} else {
  Add-Result $results "ini.exists" "fail" "$iniPath does not exist."
  $failed = $true
}

$requiredRootFiles = @("AGENTS.md", "README.md", "MEMORY.md", "AI-INTERACTION-PANEL.md")
foreach ($file in $requiredRootFiles) {
  if (Test-Path -LiteralPath $file) {
    Add-Result $results "file.$file" "pass" "$file exists."
  } else {
    Add-Result $results "file.$file" "fail" "$file is missing."
    $failed = $true
  }
}

$requiredAgentFiles = @(
  ".ai/agents/design-ai.md",
  ".ai/agents/frontend-ai.md",
  ".ai/agents/code-ai.md",
  ".ai/agents/test-ai.md",
  ".ai/agents/review-ai.md"
)
foreach ($file in $requiredAgentFiles) {
  if (Test-Path -LiteralPath $file) {
    Add-Result $results "agent.$file" "pass" "$file exists."
  } else {
    Add-Result $results "agent.$file" "fail" "$file is missing."
    $failed = $true
  }
}

if ($Wos4) {
  $requiredSkills = @(
    ".ai/skills/wos4-login/SKILL.md",
    ".ai/skills/wos4-human-navigation/SKILL.md",
    ".ai/skills/wos4-browser-harness/SKILL.md",
    ".ai/skills/wos4-layout-devtools-skill/SKILL.md",
    ".ai/skills/wos4-component-persistence/SKILL.md",
    ".ai/skills/wos4-blue-client-publish-flow/SKILL.md"
  )
  foreach ($file in $requiredSkills) {
    if (Test-Path -LiteralPath $file) {
      Add-Result $results "skill.$file" "pass" "$file exists."
    } else {
      Add-Result $results "skill.$file" "fail" "$file is missing."
      $failed = $true
    }
  }
}

if (-not [string]::IsNullOrWhiteSpace($TaskPath)) {
  if (Test-Path -LiteralPath $TaskPath) {
    Add-Result $results "task.exists" "pass" "$TaskPath exists."
    $taskFiles = @(
      "README.md",
      ("01-" + (Join-Chars @(38656, 27714, 35828, 26126)) + ".md"),
      ("02-" + (Join-Chars @(35774, 35745, 24067, 23616)) + ".md"),
      ("03-" + (Join-Chars @(21069, 31471, 36923, 36753)) + ".md"),
      ("04-" + (Join-Chars @(21518, 31471, 25913, 21160)) + ".md"),
      ("05-" + (Join-Chars @(27979, 35797, 39564, 25910)) + ".md"),
      ((Join-Chars @(35777, 25454, 28165, 21333)) + ".md"),
      ((Join-Chars @(25191, 34892, 26085, 24535)) + ".md")
    )
    foreach ($file in $taskFiles) {
      $fullPath = Join-Path $TaskPath $file
      if (Test-Path -LiteralPath $fullPath) {
        Add-Result $results "task.$file" "pass" "$file exists."
      } else {
        Add-Result $results "task.$file" "fail" "$file is missing."
        $failed = $true
      }
    }
  } else {
    Add-Result $results "task.exists" "fail" "$TaskPath does not exist."
    $failed = $true
  }
}

$summary = [ordered]@{
  status = $(if ($failed) { "fail" } else { "pass" })
  repoRoot = $repoRoot
  dirtyCount = $dirtyCount
  expectedDeveloper = $ExpectedDeveloper
  taskPath = $TaskPath
  wos4Mode = [bool]$Wos4
  requireClean = [bool]$RequireClean
  results = $results
}

$summary | ConvertTo-Json -Depth 6

if ($failed) {
  exit 1
}
