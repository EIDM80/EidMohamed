> **English** · [العربية](START-HERE.ar.md)

# Start here — step by step

For someone who has never used a command line. Follow in order, skip nothing.
Expect **30–60 minutes**, mostly waiting on downloads.

## Step 1 — Open PowerShell as Administrator

The most important step. Open it the normal way and the install fails halfway through.

1. Press the **Start** button.
2. Type: `powershell`
3. A result called **Windows PowerShell** appears. **Don't left-click it.**
4. **Right-click** it.
5. Choose **Run as administrator**.
6. Windows asks "Do you want to allow this app to make changes?" — click **Yes**.

**How to know it worked:** a black window opens with the word **Administrator** in its
title bar. No "Administrator"? Close it and start over.

## Step 2 — Start Claude Code

In that black window, type this and press Enter:

```
claude
```

## Step 3 — Paste this message

Copy the whole block below into Claude Code and press Enter (right-click or `Ctrl+V` to
paste):

```
Read and perform the full installation of the local Jarvis stack on this machine.

Repository: https://github.com/EIDM80/EidMohamed
Branch: claude/build-own-jarvis-guide-jw6udf

What I need you to do:
1. If the repo isn't on this machine, clone it from that branch (install git via
   winget if needed).
2. Read jarvis/setup/README.md fully before starting.
3. Run jarvis/setup/bootstrap.ps1

Important: that script has never been run on a real machine. Watch every step. If
anything errors, diagnose it, fix the script, and re-run. Do not skip past a failure
or carry on as if nothing happened.

My machine: Windows 11, RTX 4080 with 16 GB VRAM, 64 GB RAM, 1 TB disk. It is my
daily work machine, not a dedicated server.

When you're done, actually verify these three — don't assume:
1. `ollama list` shows qwen3:14b
2. http://localhost:3000 opens in a browser
3. qwen3:14b appears in the model list inside the interface

Explain each step as you go, and tell me clearly if something fails.
```

## Step 4 — Approve the commands

Claude Code asks permission before each command. Choose **Yes** (or "Yes, and don't ask
again" to cut down the prompts). This is normal — it asks before changing anything.

## Step 5 — Wait

The models are ~14 GB. Expect 15 minutes to an hour. Leave the window open.

**Expected mid-way stop:** if Docker Desktop isn't installed, the script installs it and
then needs you to **reboot**, open Docker Desktop once manually, wait for **Engine
running** in green, and then repeat steps 1–3. Claude skips everything already done. This
is a Docker limitation, not an error.

## Step 6 — First run

1. Open **http://localhost:3000**
2. Register — **the first account becomes the admin account**.
3. Pick **qwen3:14b** from the model list at the top.
4. Ask it anything.

A reply means it worked: Jarvis running on your own machine, no internet, no cost.

## Daily use

Open PowerShell (normal, no Administrator needed), go to the `setup` folder:

| Command | What it does |
|---|---|
| `.\jarvis.ps1 start` | Starts Jarvis |
| `.\jarvis.ps1 stop` | Stops it **and frees the GPU memory** |
| `.\jarvis.ps1 status` | What's running, how much VRAM is used |

**Stop it before gaming or video editing** — that frees 9 GB of VRAM.

## If something fails

Don't fix it yourself. Tell Claude Code:

```
That step failed. Here's the error:
[paste the error]
Diagnose it, fix it, and try again.
```

It can see the error on your machine and fix it on the spot.
