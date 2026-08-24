<#
.SYNOPSIS
    One-command install of the local Jarvis stack on Windows 11.
.DESCRIPTION
    Installs Ollama, Docker Desktop and Python (via winget) if missing, configures the
    Ollama environment variables, adds the firewall rule, pulls the models, generates
    .env, and starts Open WebUI.

    Safe to re-run: every step checks before acting.
    Requires Administrator (it sets machine-level environment variables).
.EXAMPLE
    # Right-click PowerShell > Run as Administrator, then:
    Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
    .\bootstrap.ps1
#>
[CmdletBinding()]
param(
    [switch]$SkipModels   # skip the ~14 GB download; pull later with: ollama pull qwen3:14b
)

$ErrorActionPreference = 'Stop'

function Step ($m) { Write-Host "`n>> $m" -ForegroundColor Cyan }
function Ok   ($m) { Write-Host "   [ OK ] $m" -ForegroundColor Green }
function Warn ($m) { Write-Host "   [WARN] $m" -ForegroundColor Yellow }
function Fail ($m) { Write-Host "   [FAIL] $m" -ForegroundColor Red }
function Has  ($c) { $null -ne (Get-Command $c -ErrorAction SilentlyContinue) }

# --- Administrator check -----------------------------------------------------------
$isAdmin = ([Security.Principal.WindowsPrincipal] `
            [Security.Principal.WindowsIdentity]::GetCurrent()
           ).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Fail 'This script must run as Administrator (it sets machine-level env vars).'
    Write-Host '   Close this window, right-click PowerShell, choose "Run as Administrator", and try again.'
    exit 1
}

Write-Host @'

  Jarvis - local stack installer
  Ollama (native) + Open WebUI (Docker) on Windows 11

'@ -ForegroundColor Cyan

# --- 1. GPU ------------------------------------------------------------------------
Step 'Checking the GPU'
if (Has nvidia-smi) {
    $gpu = (nvidia-smi --query-gpu=name,memory.total --format=csv,noheader) -join ', '
    Ok $gpu
    $vramMiB = [int]((nvidia-smi --query-gpu=memory.total --format=csv,noheader,nounits) -split "`n")[0].Trim()
    if ($vramMiB -lt 15000) {
        Warn "Under 16 GB of VRAM. qwen3:14b may not fit — consider qwen3:8b instead."
    }
} else {
    Fail 'nvidia-smi not found. Install the NVIDIA driver, then re-run this script.'
    exit 1
}

# --- 2. winget ---------------------------------------------------------------------
Step 'Checking winget'
if (Has winget) { Ok 'winget available' }
else {
    Fail 'winget not found. Install "App Installer" from the Microsoft Store, then re-run.'
    exit 1
}

# --- 3. Ollama ---------------------------------------------------------------------
Step 'Installing Ollama'
if (Has ollama) {
    Ok "Already installed: $(ollama --version)"
} else {
    Write-Host '   Installing via winget (this takes a minute)...'
    winget install --id Ollama.Ollama --accept-source-agreements --accept-package-agreements -h
    $env:Path = [Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' +
                [Environment]::GetEnvironmentVariable('Path', 'User')
    if (Has ollama) { Ok 'Ollama installed' }
    else { Warn 'Installed, but not on PATH yet. Reopen PowerShell after this script finishes.' }
}

# --- 4. Ollama configuration -------------------------------------------------------
Step 'Configuring Ollama'
$needsRestart = $false

if ([Environment]::GetEnvironmentVariable('OLLAMA_HOST','Machine') -ne '0.0.0.0') {
    [Environment]::SetEnvironmentVariable('OLLAMA_HOST','0.0.0.0','Machine')
    Ok 'OLLAMA_HOST=0.0.0.0  (so the Open WebUI container can reach Ollama)'
    $needsRestart = $true
} else { Ok 'OLLAMA_HOST already set' }

if ([Environment]::GetEnvironmentVariable('OLLAMA_KEEP_ALIVE','Machine') -ne '60s') {
    [Environment]::SetEnvironmentVariable('OLLAMA_KEEP_ALIVE','60s','Machine')
    Ok 'OLLAMA_KEEP_ALIVE=60s  (frees VRAM when idle - the 16 GB rule)'
    $needsRestart = $true
} else { Ok 'OLLAMA_KEEP_ALIVE already set' }

# --- 5. Firewall -------------------------------------------------------------------
Step 'Firewall rule for Ollama'
# 0.0.0.0 means Ollama listens on every interface, including Wi-Fi. Block inbound from
# the network; Docker containers still reach it over the internal interface.
$ruleName = 'Block Ollama from LAN'
if (Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue) {
    Ok 'Rule already present'
} else {
    New-NetFirewallRule -DisplayName $ruleName -Direction Inbound -LocalPort 11434 `
        -Protocol TCP -Action Block -Profile Public,Private | Out-Null
    Ok 'Port 11434 blocked from the network (Docker still reaches it)'
}

if ($needsRestart) {
    Step 'Restarting Ollama to pick up the new settings'
    Get-Process ollama*, 'ollama app' -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    Start-Process -FilePath 'ollama' -ArgumentList 'serve' -WindowStyle Hidden -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 3
    Ok 'Restarted'
}

# --- 6. Docker Desktop -------------------------------------------------------------
Step 'Installing Docker Desktop'
if (Has docker) {
    Ok 'Already installed'
    try { docker info *> $null; Ok 'Docker is running' }
    catch { Warn 'Docker is installed but not running. Start Docker Desktop, then re-run this script.' }
} else {
    Write-Host '   Installing via winget (large download)...'
    winget install --id Docker.DockerDesktop --accept-source-agreements --accept-package-agreements -h
    Warn 'Docker Desktop needs a REBOOT and one manual first launch.'
    Write-Host '   Reboot, open Docker Desktop once, wait for "Engine running", then re-run this script.'
    Write-Host '   Everything above is already done and will be skipped on the next run.' -ForegroundColor DarkGray
    exit 0
}

# --- 7. Python (for Open WebUI Computer) -------------------------------------------
Step 'Checking Python (needed only for Open WebUI Computer)'
if (Has python) {
    $pv = (python --version 2>&1).ToString()
    if ($pv -match '3\.(11|12)') { Ok $pv }
    else { Warn "$pv - cptr wants 3.11 or 3.12. Install: winget install Python.Python.3.12" }
} else {
    Warn 'Python not installed. For Open WebUI Computer: winget install Python.Python.3.12'
}

# --- 8. Models ---------------------------------------------------------------------
if ($SkipModels) {
    Step 'Skipping model download (-SkipModels)'
} else {
    Step 'Pulling models (~14 GB total - this is the slow part)'
    foreach ($m in @('qwen3:14b', 'qwen3:8b')) {
        $have = (ollama list 2>$null | Select-String -SimpleMatch $m)
        if ($have) { Ok "$m already present" }
        else {
            Write-Host "   Pulling $m ..."
            ollama pull $m
            Ok "$m ready"
        }
    }
}

# --- 9. .env -----------------------------------------------------------------------
Step 'Creating .env'
$envPath = Join-Path $PSScriptRoot '.env'
if (Test-Path $envPath) {
    Ok '.env already exists (left untouched)'
} else {
    $secret = [guid]::NewGuid().ToString() + [guid]::NewGuid().ToString()
    @"
WEBUI_SECRET_KEY=$secret
WEBUI_AUTH=true
OPEN_WEBUI_PORT=3000
"@ | Set-Content -Path $envPath -Encoding UTF8
    Ok '.env created with a generated secret key'
}

# --- 10. Start ---------------------------------------------------------------------
Step 'Starting Open WebUI'
Push-Location $PSScriptRoot
try {
    docker compose up -d
    Ok 'Container started'
} catch {
    Fail "docker compose failed: $_"
    Pop-Location
    exit 1
}
Pop-Location

Write-Host @'

  ============================================================
   Done.

   Open WebUI      http://localhost:3000
                   (first account you register becomes admin;
                    pick qwen3:14b from the model list on top)

   Daily use       .\jarvis.ps1 start | stop | status
   Computer agent  pip install cptr   then   cptr run

   Give it ~30 seconds on first run while it initialises.
  ============================================================

'@ -ForegroundColor Green
