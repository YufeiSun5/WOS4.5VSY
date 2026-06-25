param(
  [ValidateSet("Status", "ListAccounts", "AcquireAccount", "ReleaseAccount", "ReleaseOwnerAccounts", "ForceReleaseAccount", "MarkAccountStale", "AcquireObject", "ReleaseObject")]
  [string]$Action = "Status",
  [string]$ConfigPath = "wos4-artifacts/config/wos4.local.ini",
  [string]$LockPath = "",
  [string]$Account = "",
  [string]$Session = "",
  [string]$Owner = "",
  [string]$Task = "",
  [string]$ObjectType = "",
  [string]$Object = "",
  [string]$Reason = ""
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

function ConvertTo-Hashtable {
  param([object]$Value)
  if ($null -eq $Value) { return $null }
  if ($Value -is [System.Collections.IDictionary]) {
    $out = [ordered]@{}
    foreach ($key in $Value.Keys) { $out[$key] = ConvertTo-Hashtable $Value[$key] }
    return $out
  }
  if ($Value -is [System.Collections.IEnumerable] -and $Value -isnot [string]) {
    return @($Value | ForEach-Object { ConvertTo-Hashtable $_ })
  }
  if (($Value -is [pscustomobject]) -or ($Value.PSObject.Properties.Count -gt 0 -and $Value -isnot [string])) {
    $out = [ordered]@{}
    foreach ($prop in $Value.PSObject.Properties) { $out[$prop.Name] = ConvertTo-Hashtable $prop.Value }
    return $out
  }
  return $Value
}

function Write-JsonResult {
  param([hashtable]$Result, [int]$ExitCode = 0)
  $Result | ConvertTo-Json -Depth 12
  exit $ExitCode
}

function New-EmptyLockState {
  param([string[]]$AccountOrder, [hashtable]$Sessions)
  $accountLocks = [ordered]@{}
  foreach ($accountName in $AccountOrder) {
    $accountLocks[$accountName] = [ordered]@{
      state = "unlocked"
      session = ""
      owner = ""
      task = ""
      locked_since = ""
      last_seen = ""
      released_by = ""
      released_at = ""
      last_task = ""
      stale_reason = ""
    }
  }
  return [ordered]@{
    version = 2
    updated_at = (Get-Date).ToString("s")
    default_order = $AccountOrder
    account_locks = $accountLocks
    object_locks = [ordered]@{}
    sessions = $Sessions
    history = @()
  }
}

function Read-LockState {
  param([string]$Path, [string[]]$AccountOrder, [hashtable]$Sessions)
  if (-not (Test-Path -LiteralPath $Path)) {
    return New-EmptyLockState -AccountOrder $AccountOrder -Sessions $Sessions
  }
  $raw = Get-Content -LiteralPath $Path -Raw -Encoding UTF8
  if ([string]::IsNullOrWhiteSpace($raw)) {
    return New-EmptyLockState -AccountOrder $AccountOrder -Sessions $Sessions
  }
  $state = ConvertTo-Hashtable ($raw | ConvertFrom-Json)
  if (-not $state.Contains("version") -or [int]$state.version -lt 2) {
    $newState = New-EmptyLockState -AccountOrder $AccountOrder -Sessions $Sessions
    if ($state.Contains("sessions")) {
      foreach ($sessionName in $state.sessions.Keys) {
        $oldSession = $state.sessions[$sessionName]
        if ($newState.sessions.Contains($sessionName)) {
          foreach ($key in @("state", "owner", "object", "object_type", "since", "note")) {
            if ($oldSession.Contains($key)) { $newState.sessions[$sessionName][$key] = $oldSession[$key] }
          }
        }
      }
    }
    return $newState
  }
  foreach ($accountName in $AccountOrder) {
    if (-not $state.account_locks.Contains($accountName)) {
      $state.account_locks[$accountName] = [ordered]@{
        state = "unlocked"; session = ""; owner = ""; task = ""; locked_since = ""; last_seen = "";
        released_by = ""; released_at = ""; last_task = ""; stale_reason = ""
      }
    } else {
      foreach ($key in @("released_by", "released_at", "last_task", "stale_reason")) {
        if (-not $state.account_locks[$accountName].Contains($key)) {
          $state.account_locks[$accountName][$key] = ""
        }
      }
    }
  }
  foreach ($sessionName in $Sessions.Keys) {
    if (-not $state.sessions.Contains($sessionName)) { $state.sessions[$sessionName] = $Sessions[$sessionName] }
    foreach ($key in @("driver", "profile_dir", "isolated_context", "cdp_port", "harness_name")) {
      if ($Sessions[$sessionName].Contains($key) -and -not [string]::IsNullOrWhiteSpace($Sessions[$sessionName][$key])) {
        $state.sessions[$sessionName][$key] = $Sessions[$sessionName][$key]
      } elseif (-not $state.sessions[$sessionName].Contains($key)) {
        $state.sessions[$sessionName][$key] = ""
      }
    }
  }
  return $state
}

function Save-LockState {
  param([string]$Path, [hashtable]$State)
  $State.updated_at = (Get-Date).ToString("s")
  $dir = Split-Path -Parent $Path
  if (-not [string]::IsNullOrWhiteSpace($dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
  $tmp = "$Path.tmp"
  $State | ConvertTo-Json -Depth 12 | Set-Content -LiteralPath $tmp -Encoding UTF8
  Move-Item -LiteralPath $tmp -Destination $Path -Force
}

function Add-History {
  param([hashtable]$State, [string]$Event, [hashtable]$Data)
  $entry = [ordered]@{ t = (Get-Date).ToString("s"); event = $Event }
  foreach ($key in $Data.Keys) { $entry[$key] = $Data[$key] }
  $history = @($State.history)
  $history += $entry
  if ($history.Count -gt 100) { $history = $history[($history.Count - 100)..($history.Count - 1)] }
  $State.history = $history
}

function Get-AccountOrder {
  param([string]$RawIni)
  $orderRaw = Get-IniValue $RawIni "wos4" "account_order"
  if (-not [string]::IsNullOrWhiteSpace($orderRaw)) {
    return @($orderRaw -split "," | ForEach-Object { $_.Trim() } | Where-Object { $_ })
  }
  $defaultAccount = Get-IniValue $RawIni "wos4" "default_account"
  if (-not [string]::IsNullOrWhiteSpace($defaultAccount)) { return @($defaultAccount) }
  $sections = Get-IniSections $RawIni "wos4.account."
  if ($sections.Count -gt 0) { return @($sections | ForEach-Object { $_.Substring("wos4.account.".Length) }) }
  return @("wos4")
}

function Get-Accounts {
  param([string]$RawIni, [string[]]$AccountOrder)
  $accounts = [ordered]@{}
  foreach ($accountName in $AccountOrder) {
    $section = "wos4.account.$accountName"
    $username = Get-IniValue $RawIni $section "username"
    $displayName = Get-IniValue $RawIni $section "display_name"
    if ([string]::IsNullOrWhiteSpace($username) -and $accountName -eq "wos4") {
      $username = Get-IniValue $RawIni "wos4" "username"
      $displayName = $username
    }
    $hasPassword = -not [string]::IsNullOrWhiteSpace((Get-IniValue $RawIni $section "password"))
    if ($accountName -eq "wos4" -and -not $hasPassword) {
      $hasPassword = -not [string]::IsNullOrWhiteSpace((Get-IniValue $RawIni "wos4" "password"))
    }
    $accounts[$accountName] = [ordered]@{
      account = $accountName
      display_name = $displayName
      username = $username
      has_password = $hasPassword
      operator = Get-IniValue $RawIni $section "operator"
      name_prefix = Get-IniValue $RawIni $section "name_prefix"
    }
  }
  return $accounts
}

function Get-Sessions {
  param([string]$RawIni, [string[]]$AccountOrder)
  $sessions = [ordered]@{}
  $sessionSections = Get-IniSections $RawIni "wos4.session."
  foreach ($section in $sessionSections) {
    $slot = $section.Substring("wos4.session.".Length)
    $sessions[$slot] = [ordered]@{
      account = Get-IniValue $RawIni $section "account"
      state = "unlocked"
      owner = ""
      task = ""
      object = ""
      object_type = ""
      since = ""
      note = ""
      driver = Get-IniValue $RawIni $section "driver"
      profile_dir = Get-IniValue $RawIni $section "profile_dir"
      isolated_context = Get-IniValue $RawIni $section "isolated_context"
      cdp_port = Get-IniValue $RawIni $section "cdp_port"
      harness_name = Get-IniValue $RawIni $section "harness_name"
    }
  }
  if ($sessions.Count -eq 0) {
    $i = 1
    foreach ($accountName in $AccountOrder) {
      $sessions["slot$i"] = [ordered]@{
        account = $accountName; state = "unlocked"; owner = ""; task = ""; object = ""; object_type = "";
        since = ""; note = ""; driver = ""; profile_dir = ""; isolated_context = ""; cdp_port = ""; harness_name = ""
      }
      $i++
    }
  }
  return $sessions
}

function Resolve-SessionForAccount {
  param([hashtable]$Sessions, [string]$AccountName, [string]$PreferredSession)
  if (-not [string]::IsNullOrWhiteSpace($PreferredSession)) {
    if (-not $Sessions.Contains($PreferredSession)) { throw "Unknown session: $PreferredSession" }
    if ($Sessions[$PreferredSession].account -ne $AccountName) {
      throw "Session $PreferredSession is bound to account $($Sessions[$PreferredSession].account), not $AccountName."
    }
    return $PreferredSession
  }
  foreach ($sessionName in $Sessions.Keys) {
    if ($Sessions[$sessionName].account -eq $AccountName) { return $sessionName }
  }
  return ""
}

$repoRoot = Get-RepoRoot
Set-Location $repoRoot

if (-not (Test-Path -LiteralPath $ConfigPath)) {
  Write-JsonResult @{ status = "blocked"; reason = "missing_config"; configPath = $ConfigPath } 2
}

$rawIni = Get-Content -LiteralPath $ConfigPath -Raw -Encoding UTF8
$accountOrder = Get-AccountOrder $rawIni
$accounts = Get-Accounts -RawIni $rawIni -AccountOrder $accountOrder
$sessions = Get-Sessions -RawIni $rawIni -AccountOrder $accountOrder

if ([string]::IsNullOrWhiteSpace($LockPath)) {
  $LockPath = Get-IniValue $rawIni "wos4" "lock_file"
}
if ([string]::IsNullOrWhiteSpace($LockPath)) {
  $LockPath = "wos4-artifacts/config/wos4.session-locks.local.json"
}

$mutexName = "Global\WOS4_5_AccountLock_" + ([Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($repoRoot)) -replace "[^A-Za-z0-9]", "")
$mutex = New-Object System.Threading.Mutex($false, $mutexName)
$hasMutex = $false

try {
  $hasMutex = $mutex.WaitOne(15000)
  if (-not $hasMutex) {
    Write-JsonResult @{ status = "blocked"; reason = "lock_mutex_timeout"; message = "Cannot acquire local lock mutex." } 2
  }

  $state = Read-LockState -Path $LockPath -AccountOrder $accountOrder -Sessions $sessions

  if ($Action -eq "Status" -or $Action -eq "ListAccounts") {
    Write-JsonResult @{
      status = "ok"
      configPath = $ConfigPath
      lockPath = $LockPath
      default_order = $accountOrder
      accounts = $accounts
      account_locks = $state.account_locks
      object_locks = $state.object_locks
      sessions = $state.sessions
    }
  }

  if ($Action -eq "AcquireAccount") {
    if ([string]::IsNullOrWhiteSpace($Owner)) {
      Write-JsonResult @{ status = "blocked"; reason = "missing_owner"; message = "Owner is required." } 2
    }
    $candidates = if ([string]::IsNullOrWhiteSpace($Account)) { $accountOrder } else { @($Account) }
    $locked = @()
    foreach ($candidate in $candidates) {
      if (-not $accounts.Contains($candidate)) {
        Write-JsonResult @{ status = "blocked"; reason = "unknown_account"; account = $candidate } 2
      }
      $lock = $state.account_locks[$candidate]
      if ($lock.state -eq "locked") {
        if (-not [string]::IsNullOrWhiteSpace($Owner) -and $lock.owner -eq $Owner -and ([string]::IsNullOrWhiteSpace($Session) -or $lock.session -eq $Session)) {
          $sessionName = $lock.session
          $state.account_locks[$candidate].last_seen = (Get-Date).ToString("s")
          if (-not [string]::IsNullOrWhiteSpace($Task)) { $state.account_locks[$candidate].task = $Task }
          if (-not [string]::IsNullOrWhiteSpace($sessionName) -and $state.sessions.Contains($sessionName)) {
            $state.sessions[$sessionName].task = $(if ([string]::IsNullOrWhiteSpace($Task)) { $state.sessions[$sessionName].task } else { $Task })
          }
          Add-History $state "acquire_account_reuse" @{ account = $candidate; session = $sessionName; owner = $Owner; task = $Task }
          Save-LockState -Path $LockPath -State $state
          Write-JsonResult @{
            status = "acquired"
            already_locked = $true
            account = $candidate
            session = $sessionName
            username = $accounts[$candidate].username
            display_name = $accounts[$candidate].display_name
            driver = $(if ($sessionName) { $state.sessions[$sessionName].driver } else { "" })
            profile_dir = $(if ($sessionName) { $state.sessions[$sessionName].profile_dir } else { "" })
            isolated_context = $(if ($sessionName) { $state.sessions[$sessionName].isolated_context } else { "" })
            cdp_port = $(if ($sessionName) { $state.sessions[$sessionName].cdp_port } else { "" })
            harness_name = $(if ($sessionName) { $state.sessions[$sessionName].harness_name } else { "" })
            lockPath = $LockPath
          }
        }
        $locked += [ordered]@{ account = $candidate; session = $lock.session; owner = $lock.owner; task = $lock.task; locked_since = $lock.locked_since; last_seen = $lock.last_seen }
        continue
      }
      $sessionName = Resolve-SessionForAccount -Sessions $state.sessions -AccountName $candidate -PreferredSession $Session
      $now = (Get-Date).ToString("s")
      $state.account_locks[$candidate] = [ordered]@{
        state = "locked"
        session = $sessionName
        owner = $Owner
        task = $Task
        locked_since = $now
        last_seen = $now
        released_by = ""
        released_at = ""
        last_task = ""
        stale_reason = ""
      }
      if (-not [string]::IsNullOrWhiteSpace($sessionName)) {
        $state.sessions[$sessionName].state = "locked"
        $state.sessions[$sessionName].owner = $Owner
        $state.sessions[$sessionName].task = $Task
        $state.sessions[$sessionName].since = $now
      }
      Add-History $state "acquire_account" @{ account = $candidate; session = $sessionName; owner = $Owner; task = $Task }
      Save-LockState -Path $LockPath -State $state
      Write-JsonResult @{
        status = "acquired"
        account = $candidate
        session = $sessionName
        username = $accounts[$candidate].username
        display_name = $accounts[$candidate].display_name
        driver = $(if ($sessionName) { $state.sessions[$sessionName].driver } else { "" })
        profile_dir = $(if ($sessionName) { $state.sessions[$sessionName].profile_dir } else { "" })
        isolated_context = $(if ($sessionName) { $state.sessions[$sessionName].isolated_context } else { "" })
        cdp_port = $(if ($sessionName) { $state.sessions[$sessionName].cdp_port } else { "" })
        harness_name = $(if ($sessionName) { $state.sessions[$sessionName].harness_name } else { "" })
        lockPath = $LockPath
      }
    }
    Write-JsonResult @{
      status = "blocked"
      reason = "account_pool_exhausted"
      message = "All configured WOS4 accounts are locked. Refusing duplicate login."
      locked_accounts = $locked
    } 2
  }

  if ($Action -eq "ReleaseOwnerAccounts") {
    if ([string]::IsNullOrWhiteSpace($Owner)) {
      Write-JsonResult @{ status = "blocked"; reason = "missing_owner"; message = "Owner is required." } 2
    }
    $released = @()
    $blocked = @()
    foreach ($accountName in @($state.account_locks.Keys)) {
      $lock = $state.account_locks[$accountName]
      if ($lock.state -ne "locked" -or $lock.owner -ne $Owner) { continue }
      $heldObjects = @()
      foreach ($objectKey in $state.object_locks.Keys) {
        $objectLock = $state.object_locks[$objectKey]
        if ($objectLock.account -eq $accountName -and $objectLock.state -eq "locked") {
          $heldObjects += [ordered]@{ object_key = $objectKey; owner = $objectLock.owner; task = $objectLock.task; locked_since = $objectLock.locked_since }
        }
      }
      if ($heldObjects.Count -gt 0) {
        $blocked += [ordered]@{ account = $accountName; reason = "account_has_object_locks"; object_locks = $heldObjects }
        continue
      }
      $oldSession = $lock.session
      $oldTask = $lock.task
      $now = (Get-Date).ToString("s")
      $state.account_locks[$accountName] = [ordered]@{
        state = "unlocked"
        session = ""
        owner = ""
        task = ""
        locked_since = ""
        last_seen = $now
        released_by = $Owner
        released_at = $now
        last_task = $oldTask
        stale_reason = ""
      }
      if (-not [string]::IsNullOrWhiteSpace($oldSession) -and $state.sessions.Contains($oldSession)) {
        $state.sessions[$oldSession].state = "unlocked"
        $state.sessions[$oldSession].owner = ""
        $state.sessions[$oldSession].task = ""
        $state.sessions[$oldSession].object = ""
        $state.sessions[$oldSession].object_type = ""
        $state.sessions[$oldSession].since = ""
        $state.sessions[$oldSession].note = ""
      }
      $released += [ordered]@{ account = $accountName; session = $oldSession; last_task = $oldTask }
      Add-History $state "release_owner_account" @{ account = $accountName; session = $oldSession; owner = $Owner; reason = $Reason }
    }
    if ($released.Count -gt 0) { Save-LockState -Path $LockPath -State $state }
    Write-JsonResult @{
      status = $(if ($blocked.Count -gt 0) { "partial" } else { "released" })
      owner = $Owner
      released = $released
      blocked = $blocked
      lockPath = $LockPath
    }
  }

  if ($Action -eq "ReleaseAccount" -or $Action -eq "ForceReleaseAccount" -or $Action -eq "MarkAccountStale") {
    if ([string]::IsNullOrWhiteSpace($Account)) {
      if (-not [string]::IsNullOrWhiteSpace($Session) -and $state.sessions.Contains($Session)) { $Account = $state.sessions[$Session].account }
    }
    if ([string]::IsNullOrWhiteSpace($Account) -or -not $state.account_locks.Contains($Account)) {
      Write-JsonResult @{ status = "blocked"; reason = "unknown_account"; account = $Account } 2
    }
    $lock = $state.account_locks[$Account]
    if ($Action -eq "ReleaseAccount") {
      if ($lock.state -eq "unlocked") {
        Write-JsonResult @{ status = "ok"; message = "Account is already unlocked."; account = $Account }
      }
      if (-not [string]::IsNullOrWhiteSpace($Owner) -and $lock.owner -ne $Owner) {
        Write-JsonResult @{ status = "blocked"; reason = "owner_mismatch"; account = $Account; lock_owner = $lock.owner; requester = $Owner } 2
      }
      $heldObjects = @()
      foreach ($objectKey in $state.object_locks.Keys) {
        $objectLock = $state.object_locks[$objectKey]
        if ($objectLock.account -eq $Account -and $objectLock.state -eq "locked") {
          $heldObjects += [ordered]@{ object_key = $objectKey; owner = $objectLock.owner; task = $objectLock.task; locked_since = $objectLock.locked_since }
        }
      }
      if ($heldObjects.Count -gt 0) {
        Write-JsonResult @{
          status = "blocked"
          reason = "account_has_object_locks"
          account = $Account
          message = "Release object locks before returning the account."
          object_locks = $heldObjects
        } 2
      }
    } elseif ($Action -eq "ForceReleaseAccount") {
      if ([string]::IsNullOrWhiteSpace($Reason)) {
        Write-JsonResult @{ status = "blocked"; reason = "missing_reason"; message = "ForceReleaseAccount requires Reason." } 2
      }
    }
    $oldSession = $lock.session
    $oldTask = $lock.task
    if ($Action -eq "MarkAccountStale") {
      $state.account_locks[$Account].state = "stale"
      $state.account_locks[$Account].stale_reason = $Reason
      $state.account_locks[$Account].last_seen = (Get-Date).ToString("s")
      Add-History $state "mark_account_stale" @{ account = $Account; owner = $Owner; reason = $Reason }
      Save-LockState -Path $LockPath -State $state
      Write-JsonResult @{ status = "stale"; account = $Account; lockPath = $LockPath }
    }
    $now = (Get-Date).ToString("s")
    $state.account_locks[$Account] = [ordered]@{
      state = "unlocked"
      session = ""
      owner = ""
      task = ""
      locked_since = ""
      last_seen = $now
      released_by = $Owner
      released_at = $now
      last_task = $oldTask
      stale_reason = ""
    }
    if (-not [string]::IsNullOrWhiteSpace($oldSession) -and $state.sessions.Contains($oldSession)) {
      $state.sessions[$oldSession].state = "unlocked"
      $state.sessions[$oldSession].owner = ""
      $state.sessions[$oldSession].task = ""
      $state.sessions[$oldSession].object = ""
      $state.sessions[$oldSession].object_type = ""
      $state.sessions[$oldSession].since = ""
      $state.sessions[$oldSession].note = ""
    }
    if ($Action -eq "ForceReleaseAccount") {
      foreach ($objectKey in @($state.object_locks.Keys)) {
        if ($state.object_locks[$objectKey].account -eq $Account) {
          $state.object_locks.Remove($objectKey)
        }
      }
    }
    $event = if ($Action -eq "ForceReleaseAccount") { "force_release_account" } else { "release_account" }
    Add-History $state $event @{ account = $Account; session = $oldSession; owner = $Owner; reason = $Reason }
    Save-LockState -Path $LockPath -State $state
    Write-JsonResult @{ status = "released"; account = $Account; session = $oldSession; lockPath = $LockPath }
  }

  if ($Action -eq "AcquireObject") {
    if ([string]::IsNullOrWhiteSpace($Account) -or [string]::IsNullOrWhiteSpace($ObjectType) -or [string]::IsNullOrWhiteSpace($Object) -or [string]::IsNullOrWhiteSpace($Owner)) {
      Write-JsonResult @{ status = "blocked"; reason = "missing_object_lock_fields"; message = "Account, ObjectType, Object, and Owner are required." } 2
    }
    if (-not $state.account_locks.Contains($Account) -or $state.account_locks[$Account].state -ne "locked") {
      Write-JsonResult @{ status = "blocked"; reason = "account_not_locked"; account = $Account; message = "Acquire an account lock before object lock." } 2
    }
    if ($state.account_locks[$Account].owner -ne $Owner) {
      Write-JsonResult @{ status = "blocked"; reason = "owner_mismatch"; account = $Account; lock_owner = $state.account_locks[$Account].owner; requester = $Owner } 2
    }
    $key = "$ObjectType`:$Object"
    if ($state.object_locks.Contains($key) -and $state.object_locks[$key].state -eq "locked") {
      $existing = $state.object_locks[$key]
      if ($existing.account -ne $Account -or $existing.owner -ne $Owner) {
        Write-JsonResult @{ status = "blocked"; reason = "object_locked"; object_key = $key; lock = $existing } 2
      }
      Write-JsonResult @{ status = "ok"; message = "Object already locked by requester."; object_key = $key; lock = $existing }
    }
    $now = (Get-Date).ToString("s")
    $sessionName = $state.account_locks[$Account].session
    $state.object_locks[$key] = [ordered]@{
      state = "locked"
      account = $Account
      session = $sessionName
      owner = $Owner
      task = $Task
      object_type = $ObjectType
      object = $Object
      locked_since = $now
      last_seen = $now
    }
    if (-not [string]::IsNullOrWhiteSpace($sessionName) -and $state.sessions.Contains($sessionName)) {
      $state.sessions[$sessionName].object = $Object
      $state.sessions[$sessionName].object_type = $ObjectType
    }
    Add-History $state "acquire_object" @{ account = $Account; object_key = $key; owner = $Owner; task = $Task }
    Save-LockState -Path $LockPath -State $state
    Write-JsonResult @{ status = "acquired"; object_key = $key; account = $Account; session = $sessionName; lockPath = $LockPath }
  }

  if ($Action -eq "ReleaseObject") {
    if ([string]::IsNullOrWhiteSpace($ObjectType) -or [string]::IsNullOrWhiteSpace($Object)) {
      Write-JsonResult @{ status = "blocked"; reason = "missing_object"; message = "ObjectType and Object are required." } 2
    }
    $key = "$ObjectType`:$Object"
    if (-not $state.object_locks.Contains($key) -or $state.object_locks[$key].state -ne "locked") {
      Write-JsonResult @{ status = "ok"; message = "Object is already unlocked."; object_key = $key }
    }
    $existing = $state.object_locks[$key]
    if (-not [string]::IsNullOrWhiteSpace($Owner) -and $existing.owner -ne $Owner) {
      Write-JsonResult @{ status = "blocked"; reason = "owner_mismatch"; object_key = $key; lock_owner = $existing.owner; requester = $Owner } 2
    }
    $state.object_locks.Remove($key)
    $sessionName = $existing.session
    if (-not [string]::IsNullOrWhiteSpace($sessionName) -and $state.sessions.Contains($sessionName)) {
      $state.sessions[$sessionName].object = ""
      $state.sessions[$sessionName].object_type = ""
    }
    Add-History $state "release_object" @{ account = $existing.account; object_key = $key; owner = $Owner }
    Save-LockState -Path $LockPath -State $state
    Write-JsonResult @{ status = "released"; object_key = $key; account = $existing.account; session = $sessionName; lockPath = $LockPath }
  }
}
finally {
  if ($hasMutex) { $mutex.ReleaseMutex() | Out-Null }
  $mutex.Dispose()
}
