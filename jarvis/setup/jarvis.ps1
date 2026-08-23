<#
.SYNOPSIS
    Start, stop and check the local Jarvis stack on Windows 11.
.EXAMPLE
    .\jarvis.ps1 check     # verify prerequisites before you install anything
    .\jarvis.ps1 start     # bring up Ollama + Open WebUI
    .\jarvis.ps1 status    # what is running, and how much VRAM is in use
    .\jarvis.ps1 stop      # shut the stack down and free the GPU
#>
param(
    [Parameter(Position = 0)]
    [ValidateSet('check', 'start', 'stop', 'status')]
    [string]$Command = 'status'
)

$ErrorActionPreference = 'Stop'
$OllamaUrl = 'http://127.0.0.1:11434'
$ComposeDir = $PSScriptRoot

function Write-Ok    ($m) { Write-Host "  [ OK ] $m"   -ForegroundColor Green }
function Write-Warn  ($m) { Write-Host "  [WARN] $m"   -ForegroundColor Yellow }
function Write-Fail  ($m) { Write-Host "  [FAIL] $m"   -ForegroundColor Red }
function Write-Title ($m) { Write-Host "`n$m" -ForegroundColor Cyan }

function Test-Command($name) {
    $null -ne (Get-Command $name -ErrorAction SilentlyContinue)
}

function Test-Ollama {
    try {
        $null = Invoke-RestMethod -Uri "$OllamaUrl/api/tags" -TimeoutSec 3
        return $true
    } catch {
        return $false
    }
}

function Invoke-Check {
    Write-Title 'Prerequisites'

    if (Test-Command nvidia-smi) {
        $vram = (nvidia-smi --query-gpu=name,memory.total --format=csv,noheader) -join ', '
        Write-Ok "GPU: $vram"
    } else {
        Write-Fail 'nvidia-smi not found. Install the NVIDIA driver first.'
    }

    if (Test-Command ollama) { Write-Ok "Ollama installed: $(ollama --version)" }
    else { Write-Fail 'Ollama not installed. https://ollama.com/download/windows' }

    if (Test-Command docker) {
        try {
            docker info *> $null
            Write-Ok 'Docker Desktop is running'
        } catch {
            Write-Warn 'Docker is installed but not running. Start Docker Desktop.'
        }
    } else {
        Write-Fail 'Docker Desktop not installed. https://docs.docker.com/desktop/install/windows-install/'
    }

    if (Test-Command python) {
        $pv = (python --version 2>&1).ToString()
        if ($pv -match '3\.(11|12)') { Write-Ok "Python: $pv" }
        else { Write-Warn "$pv — Open WebUI Computer (cptr) wants Python 3.11 or 3.12" }
    } else {
        Write-Warn 'Python not found. Needed only for Open WebUI Computer (cptr).'
    }

    Write-Title 'Ollama configuration'

    $host_ = [Environment]::GetEnvironmentVariable('OLLAMA_HOST', 'Machine')
    if ($host_ -eq '0.0.0.0') {
        Write-Ok 'OLLAMA_HOST=0.0.0.0 — the Open WebUI container can reach Ollama'
    } else {
        Write-Warn "OLLAMA_HOST is '$host_'. Without 0.0.0.0 the container cannot reach Ollama."
        Write-Host '         Fix (run as Administrator, then restart Ollama):' -ForegroundColor DarkGray
        Write-Host '         [Environment]::SetEnvironmentVariable("OLLAMA_HOST","0.0.0.0","Machine")' -ForegroundColor DarkGray
    }

    $keep = [Environment]::GetEnvironmentVariable('OLLAMA_KEEP_ALIVE', 'Machine')
    if ($keep) {
        Write-Ok "OLLAMA_KEEP_ALIVE=$keep — the model unloads and frees VRAM when idle"
    } else {
        Write-Warn 'OLLAMA_KEEP_ALIVE not set. On a 16 GB card the LLM will hold VRAM that'
        Write-Host '         image generation needs. Recommended: 60s' -ForegroundColor DarkGray
    }

    if (-not (Test-Path (Join-Path $ComposeDir '.env'))) {
        Write-Warn 'No .env file. Copy-Item .env.example .env, then set WEBUI_SECRET_KEY.'
    } else {
        Write-Ok '.env present'
    }
}

function Invoke-Start {
    Write-Title 'Starting Jarvis'

    if (-not (Test-Path (Join-Path $ComposeDir '.env'))) {
        Write-Fail 'No .env file. Run: Copy-Item .env.example .env  and set WEBUI_SECRET_KEY.'
        return
    }

    if (Test-Ollama) {
        Write-Ok 'Ollama already running'
    } else {
        Write-Host '  Starting Ollama...'
        Start-Process -FilePath 'ollama' -ArgumentList 'serve' -WindowStyle Hidden
        $deadline = (Get-Date).AddSeconds(30)
        while ((Get-Date) -lt $deadline -and -not (Test-Ollama)) { Start-Sleep -Seconds 2 }
        if (Test-Ollama) { Write-Ok 'Ollama is up' } else { Write-Fail 'Ollama did not come up'; return }
    }

    Push-Location $ComposeDir
    try {
        docker compose up -d
        Write-Ok 'Open WebUI starting'
    } finally {
        Pop-Location
    }

    $port = 3000
    $envFile = Join-Path $ComposeDir '.env'
    $portLine = Select-String -Path $envFile -Pattern '^OPEN_WEBUI_PORT=(\d+)' -ErrorAction SilentlyContinue
    if ($portLine) { $port = $portLine.Matches[0].Groups[1].Value }

    Write-Host ''
    Write-Host "  Open WebUI:  http://localhost:$port" -ForegroundColor Green
    Write-Host '  Give it ~30 seconds on the first run while it initialises.' -ForegroundColor DarkGray
    Write-Host '  Computer (optional, separate window):  cptr run' -ForegroundColor DarkGray
}

function Invoke-Stop {
    Write-Title 'Stopping Jarvis'

    Push-Location $ComposeDir
    try {
        docker compose down
        Write-Ok 'Open WebUI stopped'
    } finally {
        Pop-Location
    }

    # Unload models so the 16 GB of VRAM goes back to whatever you do next.
    if (Test-Ollama) {
        try {
            $running = (Invoke-RestMethod -Uri "$OllamaUrl/api/ps" -TimeoutSec 5).models
            foreach ($m in $running) {
                ollama stop $m.name
                Write-Ok "Unloaded $($m.name)"
            }
            if (-not $running) { Write-Ok 'No models were loaded' }
        } catch {
            Write-Warn 'Could not query loaded models'
        }
    }
}

function Invoke-Status {
    Write-Title 'Jarvis status'

    if (Test-Ollama) {
        Write-Ok 'Ollama: running'
        try {
            $loaded = (Invoke-RestMethod -Uri "$OllamaUrl/api/ps" -TimeoutSec 5).models
            if ($loaded) {
                foreach ($m in $loaded) {
                    $gb = [math]::Round($m.size / 1GB, 1)
                    Write-Host "         loaded: $($m.name)  (~$gb GB VRAM)"
                }
            } else {
                Write-Host '         no model loaded (VRAM free)' -ForegroundColor DarkGray
            }
        } catch { }
    } else {
        Write-Warn 'Ollama: not running'
    }

    try {
        $ps = docker compose -f (Join-Path $ComposeDir 'docker-compose.yml') ps --format json 2>$null
        if ($ps) { Write-Ok 'Open WebUI: running' } else { Write-Warn 'Open WebUI: not running' }
    } catch {
        Write-Warn 'Open WebUI: not running (or Docker Desktop is down)'
    }

    if (Test-Command nvidia-smi) {
        $used, $total = (nvidia-smi --query-gpu=memory.used,memory.total --format=csv,noheader,nounits) -split ',\s*'
        $pct = [math]::Round(100 * [int]$used / [int]$total)
        Write-Host "`n  VRAM: $used MiB / $total MiB ($pct%)" -ForegroundColor Cyan
        if ($pct -gt 70) {
            Write-Warn 'Over 70% — image generation will not fit alongside this. Run: .\jarvis.ps1 stop'
        }
    }
}

switch ($Command) {
    'check'  { Invoke-Check }
    'start'  { Invoke-Start }
    'stop'   { Invoke-Stop }
    'status' { Invoke-Status }
}
