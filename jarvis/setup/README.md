> **English** · [العربية](README.ar.md)

# Setup — Windows 11 on an RTX 4080

Three services only: Ollama + Open WebUI + Open WebUI Computer. Don't add a fourth until
you've used these for two weeks. Full machine plan in
[`../hardware-plan.md`](../hardware-plan.md).

**The Windows simplification:** Ollama runs **natively** on Windows and talks to the 4080
directly — no WSL2 GPU passthrough, no nvidia-container-toolkit. Open WebUI is only a web
interface and never touches the GPU, so plain Docker is enough. That deletes the step
most people get stuck on.

## Fast path: one command

To skip the manual steps, run this **as Administrator** from inside the `setup` folder:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\bootstrap.ps1
```

It installs Ollama, Docker and Python via winget if missing, sets the environment
variables, adds the firewall rule, pulls both models, generates `.env` with a secret key,
and starts Open WebUI. Safe to re-run — every step checks before acting.

**One expected stop:** if Docker Desktop isn't installed, the script installs it and then
asks you to reboot and launch it once manually, then re-run — it skips everything already
done.

To understand and do each step yourself, read on.

## Before you start

```powershell
.\jarvis.ps1 check
```

Checks the GPU, Ollama, Docker, Python and the environment variables, and tells you
exactly what's missing.

## 1. GPU driver

Install the latest NVIDIA driver, then confirm:

```powershell
nvidia-smi
```

You should see `NVIDIA GeForce RTX 4080` and roughly `16376 MiB`.

## 2. Ollama

Install from [ollama.com/download/windows](https://ollama.com/download/windows), then set
two variables — **open PowerShell as Administrator**:

```powershell
[Environment]::SetEnvironmentVariable("OLLAMA_HOST","0.0.0.0","Machine")
[Environment]::SetEnvironmentVariable("OLLAMA_KEEP_ALIVE","60s","Machine")
```

Quit Ollama from the system tray and start it again so it picks the settings up.

- `OLLAMA_HOST=0.0.0.0` — without it the Open WebUI container cannot reach Ollama at all.
- `OLLAMA_KEEP_ALIVE=60s` — unloads the model from VRAM after a minute idle. **This is the
  line that makes the 16 GB rule survivable**: without it the model squats on 9 GB and
  leaves no room for image generation.

> ⚠️ **Security note:** `0.0.0.0` means Ollama listens on **every** network, not just this
> PC — anyone on your Wi-Fi could use your model. Add a firewall rule (as Administrator):
>
> ```powershell
> New-NetFirewallRule -DisplayName "Block Ollama from LAN" -Direction Inbound `
>   -LocalPort 11434 -Protocol TCP -Action Block -Profile Public,Private
> ```
>
> Docker containers still reach it, because they come in over the internal interface.

Then pull both models:

```powershell
ollama pull qwen3:14b   # ~9 GB — your main model, ~49 tok/s
ollama pull qwen3:8b    # ~5 GB — for generation-heavy sessions when you need the VRAM
```

Test it: `ollama run qwen3:14b "write one sentence"`

## 3. Open WebUI

Install [Docker Desktop](https://docs.docker.com/desktop/install/windows-install/) with
the WSL2 backend, then from this folder:

```powershell
Copy-Item .env.example .env
```

Open `.env` and put a long random value in `WEBUI_SECRET_KEY`. Generate one with:

```powershell
[guid]::NewGuid().ToString() + [guid]::NewGuid().ToString()
```

Then:

```powershell
.\jarvis.ps1 start
```

Open <http://localhost:3000>. The first account you register becomes the admin. Pick
`qwen3:14b` from the model list at the top.

## 4. Open WebUI Computer (optional, but the important one)

This is what turns it from a chatbot into an agent that works on your computer. Needs
**Python 3.11 or 3.12**:

```powershell
pip install cptr
cptr run
```

Read the URL it prints on startup and open that (Open WebUI is on port 3000 here so it
doesn't collide with cptr's default). You get files, terminal, editor, git and a browser,
with per-chat approval controls — **leave approvals on** until you trust how it behaves.

## Daily use

| Command | What it does |
|---|---|
| `.\jarvis.ps1 start` | Starts Ollama and Open WebUI |
| `.\jarvis.ps1 status` | What's running, and how much VRAM is in use |
| `.\jarvis.ps1 stop` | Stops everything **and unloads models from VRAM** |
| `.\jarvis.ps1 check` | Verifies prerequisites and settings |

Services deliberately **do not start with Windows** — this is your daily driver, and they
shouldn't eat resources while you work. Start them when you need them, stop them before
gaming or video editing.

`status` warns you when VRAM goes over 70% — the threshold past which image generation
won't fit.

## The morning briefing

Since this is your daily machine and may well be off at 6am, schedule the daily briefing
in the **cloud** via Claude's `/schedule`, not local cron. The briefing prompt is ready in
[`../README.md`](../README.md#the-briefing-prompt).

The right division: local handles what's private, always-on and high-volume; the cloud
handles what needs real reasoning and has to run while the machine is off.

## When something breaks

| Symptom | Cause |
|---|---|
| Open WebUI shows no models | `OLLAMA_HOST` isn't `0.0.0.0`, or Ollama wasn't restarted after setting it |
| "connection refused" from the container | Ollama isn't running — `ollama serve` |
| Very slow or frozen | Model spilled past VRAM onto the CPU. Check `.\jarvis.ps1 status`, drop to `qwen3:8b` |
| Image generation fails, out of memory | An LLM is still loaded. `.\jarvis.ps1 stop`, then generate |
| `cptr` won't run | Python version — it needs 3.11 or 3.12 |
