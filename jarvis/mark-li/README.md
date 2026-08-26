> **English** · [العربية](README.ar.md)

# Mark LI — install and assessment

Repository: <https://github.com/FatihMakes/Mark-LI> — a voice assistant that controls the
computer, monitors hardware, and runs automated tasks. Source reviewed 2026-08-26.

## What it actually is

A large, real Python project (`main.py` alone is 80 KB, `ui.py` 141 KB) with a PyQt6 HUD,
22 action modules, a plugin system, and a phone dashboard. Capabilities found in the code,
not just the description:

| Module | What it does |
|---|---|
| `system_monitor.py` | CPU / RAM / GPU / temperature telemetry with voice alerts |
| `background_monitor.py` | Watches topics you configure, daily news check |
| `computer_control.py` | Keyboard shortcuts, mouse, window management |
| `computer_settings.py` | Volume, brightness, WiFi, power |
| `proactive.py` | Time- and context-aware check-ins |
| `file_controller.py` / `file_processor.py` | File operations; document reading and summarizing |
| `dev_agent.py` / `code_helper.py` | Developer tasks and code review |
| `reminder.py` | Reminders via Windows Task Scheduler |
| `dashboard/server.py` | Phone dashboard over QR pairing |

## Three things to know before installing

### 1. It does not use your GPU — it runs on Google's cloud

The engine is the **Gemini Live API**:

```
main.py:85   LIVE_MODEL = "models/gemini-2.5-flash-native-audio-preview-12-2025"
main.py:93   json.load(f)["gemini_api_key"]
```

There is a `core/llm_client.py` that supports Ollama and calls it "the default provider" —
but **no file in the project imports it**. Verified: zero importers. It's unwired code,
probably groundwork for a future version.

**Practical consequence:** the RTX 4080 plays no part here. Mark LI needs a microphone, a
free Gemini key, and internet. The local Ollama stack stays a separate, useful project —
but it is not this program's engine.

### 2. The licence forbids commercial use

**CC BY-NC 4.0** — personal and non-commercial use only.

- At home, for your own affairs: **allowed**.
- At work for USTF, or any commercial purpose: **a licence violation**.

Not a marginal legal footnote in this case, since most of what we've discussed (marketing
analytics, inbox, campaigns) is institutional work. For those capabilities at work, the
connector path carries no such restriction.

### 3. A wide trust surface

It drives keyboard, mouse and files, registers itself at startup, and opens a network
server. I checked every outbound domain in the source and they are all expected (Google,
YouTube, DuckDuckGo, Steam, ElevenLabs) — **nothing suspicious**. Still, know this:

**The phone dashboard listens on `0.0.0.0`** (`dashboard/server.py` lines 850 and 877) —
the whole network, not just this PC — with a **6-character** pairing key (uppercase +
digits) and AES-256. Fine on a trusted home network; don't enable it on public or campus
Wi-Fi, and never port-forward it.

## Requirements

| Requirement | Detail |
|---|---|
| OS | Windows 10/11 (macOS and Linux also supported) |
| Python | **3.11 or 3.12** — not 3.13 |
| Microphone | Required |
| API key | Free Gemini key from [Google AI Studio](https://aistudio.google.com/apikey) |
| GPU | Not needed |

> ⚠️ The author states `requirements.txt` is deliberately incomplete. Expect
> `ModuleNotFoundError` and install what's missing by hand. That's expected, not a fault.

## Install — the easy way

With Claude Code on your machine, don't install by hand. Open PowerShell (**normal, no
Administrator this time**), run `claude`, and paste:

```
Install the Mark LI project on this machine: https://github.com/FatihMakes/Mark-LI

Steps:
1. Check the Python version first. This project needs exactly 3.11 or 3.12.
   If it's 3.13 or newer, install 3.12 via winget and build the venv with that.
2. Clone the repo somewhere sensible.
3. Create and activate a venv — do not install these packages into global Python.
4. pip install -r requirements.txt
5. python -m playwright install
6. python main.py

Notes:
- The author says requirements.txt is deliberately incomplete. On ModuleNotFoundError,
  install the missing package and continue. That is expected.
- It will ask for a Gemini API key on first run. I'll enter that myself in the UI.
- This project controls keyboard, mouse and files. Explain what each command does
  before running it.

My machine: Windows 11, 64 GB RAM. Explain each step as you go.
```

First, get the free Gemini key at
[aistudio.google.com/apikey](https://aistudio.google.com/apikey) — sign in with Google,
click "Create API key", copy it. You'll paste it into the app's UI on first run.

## Manual install

```powershell
git clone https://github.com/FatihMakes/Mark-LI.git
cd Mark-LI
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m playwright install
python main.py
```

The `venv` matters: this installs 27 packages including `pyautogui` and `pywin32`, and you
don't want those mixed into your global Python.

## How it relates to what we built earlier

| | Mark LI | Local Ollama stack | Claude 2.0 guide |
|---|---|---|---|
| Engine | Gemini, cloud | Models on your GPU | Claude + connectors |
| Uses the GPU | No | Yes, all 16 GB | No |
| Cost | Free key (with limits) | Electricity | ~$20/mo |
| Controls the computer | **Yes, deeply** | Partly, via Computer | Browser only |
| Commercial use | **Forbidden** | Allowed | Allowed |

The three don't conflict. Mark LI is the only one that gives deep machine control and
monitoring — what you actually asked for — but for personal use only.
