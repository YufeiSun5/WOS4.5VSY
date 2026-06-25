param(
  [ValidateSet("Start", "Status", "Doctor", "Probe", "StopHarness", "StopChrome", "Stop")]
  [string]$Action = "Status",
  [string]$ConfigPath = "wos4-artifacts/config/wos4.local.ini",
  [string]$Session = "all",
  [string]$ChromePath = "",
  [int]$BasePort = 13222,
  [string]$HarnessPrefix = "wos4",
  [string]$StartUrl = "about:blank",
  [switch]$NoHarness
)

$ErrorActionPreference = "Stop"

function Get-RepoRoot {
  $root = (& git rev-parse --show-toplevel 2>$null)
  if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($root)) {
    throw "Not inside a Git workspace."
  }
  return $root.Trim()
}

function Get-IniValue {
  param([string]$Raw, [string]$Section, [string]$Key)
  $sectionPattern = "(?ms)^\s*\[" + [regex]::Escape($Section) + "\]\s*(.*?)(?=^\s*\[[^\]]+\]\s*|\z)"
  $match = [regex]::Match($Raw, $sectionPattern)
  if (-not $match.Success) { return $null }
  foreach ($line in ($match.Groups[1].Value -split "`r?`n")) {
    $keyPattern = "^\s*" + [regex]::Escape($Key) + "\s*=\s*(.*)\s*$"
    if ($line -match $keyPattern) { return $Matches[1].Trim() }
  }
  return $null
}

function Get-IniSections {
  param([string]$Raw, [string]$Prefix)
  return @([regex]::Matches($Raw, "(?m)^\s*\[([^\]]+)\]") |
    ForEach-Object { $_.Groups[1].Value } |
    Where-Object { $_ -like "$Prefix*" })
}

function Resolve-PathForConfig {
  param([string]$PathValue, [string]$RepoRoot)
  if ([string]::IsNullOrWhiteSpace($PathValue)) { return "" }
  if ([System.IO.Path]::IsPathRooted($PathValue)) { return $PathValue }
  return (Join-Path $RepoRoot $PathValue)
}

function Get-SafeHarnessName {
  param([string]$Name)
  $safe = ($Name -replace "[^A-Za-z0-9_-]", "_")
  if ([string]::IsNullOrWhiteSpace($safe)) { throw "Invalid harness name." }
  if ($safe.Length -gt 64) { return $safe.Substring(0, 64) }
  return $safe
}

function Find-Chrome {
  param([string]$Requested)
  $candidates = @()
  if (-not [string]::IsNullOrWhiteSpace($Requested)) { $candidates += $Requested }
  $candidates += @(
    "C:\Program Files\Google\Chrome\Application\chrome.exe",
    "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
  )
  foreach ($candidate in $candidates) {
    if (Test-Path -LiteralPath $candidate) { return $candidate }
  }
  throw "Chrome executable not found. Pass -ChromePath."
}

function Get-ConfiguredSessions {
  param([string]$RawIni, [string]$RepoRoot, [int]$BasePort, [string]$HarnessPrefix)
  $sections = Get-IniSections $RawIni "wos4.session."
  $out = @()
  $index = 0
  foreach ($section in $sections) {
    $slot = $section.Substring("wos4.session.".Length)
    $portRaw = Get-IniValue $RawIni $section "cdp_port"
    $port = if ([string]::IsNullOrWhiteSpace($portRaw)) { $BasePort + $index } else { [int]$portRaw }
    $harnessName = Get-IniValue $RawIni $section "harness_name"
    if ([string]::IsNullOrWhiteSpace($harnessName)) { $harnessName = "$HarnessPrefix`_$slot" }
    $profileDir = Resolve-PathForConfig (Get-IniValue $RawIni $section "profile_dir") $RepoRoot
    if ([string]::IsNullOrWhiteSpace($profileDir)) {
      $profileDir = Join-Path $RepoRoot "wos4-artifacts/config/chrome-profiles/$slot"
    }
    $out += [ordered]@{
      session = $slot
      account = Get-IniValue $RawIni $section "account"
      driver = Get-IniValue $RawIni $section "driver"
      profile_dir = $profileDir
      isolated_context = Get-IniValue $RawIni $section "isolated_context"
      cdp_port = $port
      cdp_url = "http://127.0.0.1:$port"
      harness_name = Get-SafeHarnessName $harnessName
    }
    $index += 1
  }
  if ($out.Count -eq 0) {
    throw "No [wos4.session.*] sections found in $ConfigPath."
  }
  return $out
}

function Select-Sessions {
  param([object[]]$Sessions, [string]$Selector)
  if ([string]::IsNullOrWhiteSpace($Selector) -or $Selector -eq "all") { return $Sessions }
  $selected = @($Sessions | Where-Object { $_.session -eq $Selector })
  if ($selected.Count -eq 0) { throw "Unknown session: $Selector" }
  return $selected
}

function Test-CdpEndpoint {
  param([int]$Port)
  try {
    $version = Invoke-RestMethod -Uri "http://127.0.0.1:$Port/json/version" -Proxy $null -TimeoutSec 3
    return [ordered]@{
      ok = $true
      browser = $version.Browser
      webSocketDebuggerUrl = (($version.webSocketDebuggerUrl) -replace "/devtools/browser/.+$", "/devtools/browser/<redacted>")
    }
  } catch {
    return [ordered]@{ ok = $false; error = $_.Exception.Message }
  }
}

function Start-ChromeSession {
  param([hashtable]$SessionInfo, [string]$ChromeExe, [string]$StartUrl)
  $status = Test-CdpEndpoint -Port $SessionInfo.cdp_port
  if ($status.ok) {
    return [ordered]@{ session = $SessionInfo.session; action = "already_running"; cdp = $status }
  }
  New-Item -ItemType Directory -Force -Path $SessionInfo.profile_dir | Out-Null
  $args = @(
    "--user-data-dir=$($SessionInfo.profile_dir)",
    "--remote-debugging-port=$($SessionInfo.cdp_port)",
    "--no-first-run",
    "--no-default-browser-check",
    "--proxy-server=direct://",
    "--proxy-bypass-list=*",
    $StartUrl
  )
  Start-Process -FilePath $ChromeExe -ArgumentList $args | Out-Null
  $deadline = (Get-Date).AddSeconds(20)
  do {
    Start-Sleep -Milliseconds 500
    $status = Test-CdpEndpoint -Port $SessionInfo.cdp_port
    if ($status.ok) {
      return [ordered]@{ session = $SessionInfo.session; action = "started"; cdp = $status }
    }
  } while ((Get-Date) -lt $deadline)
  return [ordered]@{ session = $SessionInfo.session; action = "start_failed"; cdp = $status }
}

function Invoke-HarnessProbe {
  param([hashtable]$SessionInfo)
  $oldPath = $env:Path
  $oldName = $env:BU_NAME
  $oldUrl = $env:BU_CDP_URL
  try {
    $env:Path = "C:\Users\SunYufei\.local\bin;" + $env:Path
    $env:BU_NAME = $SessionInfo.harness_name
    $env:BU_CDP_URL = $SessionInfo.cdp_url
    $tmp = Join-Path $env:TEMP "wos4_browser_session_probe.py"
    Set-Content -LiteralPath $tmp -Encoding ascii -Value @(
      "ensure_real_tab()",
      "print(page_info())"
    )
    $output = cmd /c "type %TEMP%\wos4_browser_session_probe.py | browser-harness" 2>&1
    return [ordered]@{ session = $SessionInfo.session; harness_name = $SessionInfo.harness_name; ok = ($LASTEXITCODE -eq 0); output = @($output) }
  } finally {
    $env:Path = $oldPath
    if ($null -eq $oldName) { Remove-Item Env:\BU_NAME -ErrorAction SilentlyContinue } else { $env:BU_NAME = $oldName }
    if ($null -eq $oldUrl) { Remove-Item Env:\BU_CDP_URL -ErrorAction SilentlyContinue } else { $env:BU_CDP_URL = $oldUrl }
  }
}

function Stop-Harness {
  param([hashtable]$SessionInfo)
  $oldPath = $env:Path
  $oldName = $env:BU_NAME
  try {
    $env:Path = "C:\Users\SunYufei\.local\bin;" + $env:Path
    $env:BU_NAME = $SessionInfo.harness_name
    $output = browser-harness --reload 2>&1
    return [ordered]@{ session = $SessionInfo.session; harness_name = $SessionInfo.harness_name; ok = ($LASTEXITCODE -eq 0); output = @($output) }
  } finally {
    $env:Path = $oldPath
    if ($null -eq $oldName) { Remove-Item Env:\BU_NAME -ErrorAction SilentlyContinue } else { $env:BU_NAME = $oldName }
  }
}

function Stop-ChromeByPort {
  param([hashtable]$SessionInfo)
  $pattern = "--remote-debugging-port=$($SessionInfo.cdp_port)"
  $procs = @(Get-CimInstance Win32_Process -Filter "name='chrome.exe'" | Where-Object { $_.CommandLine -like "*$pattern*" })
  foreach ($p in $procs) {
    Stop-Process -Id $p.ProcessId -Force -ErrorAction SilentlyContinue
  }
  return [ordered]@{ session = $SessionInfo.session; cdp_port = $SessionInfo.cdp_port; stopped_processes = @($procs | ForEach-Object { $_.ProcessId }) }
}

$repoRoot = Get-RepoRoot
Set-Location $repoRoot
if (-not (Test-Path -LiteralPath $ConfigPath)) { throw "Missing config: $ConfigPath" }
$rawIni = Get-Content -LiteralPath $ConfigPath -Raw -Encoding UTF8
$sessions = Select-Sessions (Get-ConfiguredSessions -RawIni $rawIni -RepoRoot $repoRoot -BasePort $BasePort -HarnessPrefix $HarnessPrefix) $Session

if ($Action -eq "Doctor") {
  $env:Path = "C:\Users\SunYufei\.local\bin;" + $env:Path
  browser-harness --doctor
  exit $LASTEXITCODE
}

$results = @()
if ($Action -eq "Status") {
  foreach ($s in $sessions) {
    $results += [ordered]@{ session = $s.session; account = $s.account; profile_dir = $s.profile_dir; cdp_port = $s.cdp_port; harness_name = $s.harness_name; cdp = (Test-CdpEndpoint -Port $s.cdp_port) }
  }
} elseif ($Action -eq "Start") {
  $chromeExe = Find-Chrome -Requested $ChromePath
  foreach ($s in $sessions) {
    $startResult = Start-ChromeSession -SessionInfo $s -ChromeExe $chromeExe -StartUrl $StartUrl
    $probeResult = if ($NoHarness) { [ordered]@{ skipped = $true } } else { Invoke-HarnessProbe -SessionInfo $s }
    $results += [ordered]@{ session = $s.session; account = $s.account; profile_dir = $s.profile_dir; cdp_port = $s.cdp_port; harness_name = $s.harness_name; chrome = $startResult; harness = $probeResult }
  }
} elseif ($Action -eq "Probe") {
  foreach ($s in $sessions) { $results += Invoke-HarnessProbe -SessionInfo $s }
} elseif ($Action -eq "StopHarness") {
  foreach ($s in $sessions) { $results += Stop-Harness -SessionInfo $s }
} elseif ($Action -eq "StopChrome") {
  foreach ($s in $sessions) { $results += Stop-ChromeByPort -SessionInfo $s }
} elseif ($Action -eq "Stop") {
  foreach ($s in $sessions) {
    $results += [ordered]@{ session = $s.session; harness = (Stop-Harness -SessionInfo $s); chrome = (Stop-ChromeByPort -SessionInfo $s) }
  }
}

[ordered]@{
  status = "ok"
  action = $Action
  configPath = $ConfigPath
  sessions = $results
} | ConvertTo-Json -Depth 8
