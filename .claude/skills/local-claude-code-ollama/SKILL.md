---
name: "local-claude-code-ollama"
title: Run Claude Code on a free local model via Ollama
description: "Use this skill when the user wants to run Claude Code (or any Anthropic-API-shaped tool) against a free, local, unlimited open-weight model instead of paying for Anthropic API usage — \"connect Claude Code to Ollama\", \"run Claude Code for free locally\", \"I ran out of credits\", \"unlimited local coding model\", \"use Qwen/GLM instead of Claude API\". Documents the officially-supported path: Ollama v0.14.0+ exposes an Anthropic-compatible Messages API on localhost:11434, so pointing ANTHROPIC_BASE_URL at it makes Claude Code run entirely offline against a local model — zero token cost, zero rate limit, code never leaves the machine. Covers Windows/macOS/Linux setup, model choice by GPU tier, and how to switch back to the real Anthropic API. Does NOT cover Google Antigravity — it has no official local/BYOK model support (community proxy patches exist but violate Google's ToS and are not documented here)."
category: Reference
---

# Run Claude Code on a free local model via Ollama

Officially supported since Ollama v0.14.0 (Jan 2026): Ollama serves an Anthropic-compatible Messages API on `localhost:11434`. Pointing Claude Code's `ANTHROPIC_BASE_URL` at it routes every request to a model running on the user's own hardware — no Anthropic billing, no rate limit, fully offline, but bounded by local GPU speed and the open model's own capability (open models currently trail Claude Sonnet/Opus on the hardest tasks, per SWE-bench Verified: open-weight ceiling ~71-72% vs. frontier closed models higher).

This only works on **the user's own machine** — it is pointless inside an ephemeral cloud dev session (no persistence, usually no GPU). Confirm the target machine and its GPU before recommending a model.

## Pick a model by GPU tier

| GPU / VRAM | Model | Pull command | Notes |
|---|---|---|---|
| 16–24GB+ (RTX 3090/4090/5090, Mac 32GB+ unified) | **qwen3-coder:30b** | `ollama pull qwen3-coder:30b` | Best balance: 30B MoE (3.3B active), ~19GB at Q4_K_M, 256K context, Apache-2.0, built for agentic coding |
| 8–12GB (RTX 3060/4060/4070) | **glm-4.7-flash** | `ollama pull glm-4.7-flash` | 9GB, 128K context, fastest, most reliable tool-calling with Claude Code specifically |
| No GPU / CPU-only | smaller quant, e.g. `qwen2.5-coder:7b` | `ollama pull qwen2.5-coder:7b` | 4GB, works but slow; expect it for light tasks only |
| Server-grade (multi-GPU, 256GB+ unified/RAM) | **glm-5.2** | `ollama pull glm-5.2` | 753B MoE (39B active), MIT, strongest open coding benchmark (SWE-bench Pro 62.1) — not for a personal desktop |

If tool-calling misbehaves (Claude Code depends on well-formed tool calls), fall back to `glm-4.7-flash` or `gpt-oss:20b` — both are specifically noted for reliable tool-call formatting.

## Setup — Windows (PowerShell)

```powershell
# 1. Install Ollama
winget install Ollama.Ollama
# or download the installer from https://ollama.com/download/windows

# 2. Verify
ollama --version

# 3. Pull a model (pick from the table above)
ollama pull qwen3-coder:30b

# 4. Point Claude Code at the local Ollama server — setx persists across terminal sessions
setx ANTHROPIC_BASE_URL "http://localhost:11434"
setx ANTHROPIC_AUTH_TOKEN "ollama"
setx ANTHROPIC_DEFAULT_SONNET_MODEL "qwen3-coder:30b"

# 5. Close and reopen PowerShell (setx needs a fresh shell to take effect), then:
claude
```

Ollama installs as a background service/tray app on Windows and starts automatically — no need to manually run a server.

## Setup — macOS / Linux (bash/zsh)

```bash
# 1. Install
curl -fsSL https://ollama.com/install.sh | sh      # Linux
# macOS: brew install ollama, or download from ollama.com/download/mac

# 2. Pull a model
ollama pull qwen3-coder:30b

# 3. Export for the current shell, or add to ~/.zshrc / ~/.bashrc to persist
export ANTHROPIC_BASE_URL=http://localhost:11434
export ANTHROPIC_AUTH_TOKEN=ollama
export ANTHROPIC_DEFAULT_SONNET_MODEL=qwen3-coder:30b

claude
```

## Switching back to the real Anthropic API

These env vars override Claude Code's default endpoint globally for that shell/user — remove them to go back to Anthropic's cloud models:

- **Windows:** `setx ANTHROPIC_BASE_URL ""` (or delete the User Environment Variables in System Settings), same for the other two.
- **macOS/Linux:** remove the three `export` lines from the shell rc file, open a new terminal.

## Verifying it's actually local

- `ollama ps` shows the model currently loaded in memory while a request is running.
- Turn off Wi-Fi/network and confirm Claude Code still responds — proof nothing is leaving the machine.
- Response speed will visibly track local GPU load (check `nvidia-smi` / Task Manager GPU graph on Windows) instead of network latency.

## What this does NOT cover

**Google Antigravity has no official local-model or BYOK support** — its model list is fixed via Vertex Model Garden with no custom-endpoint option. Community "proxy patch" workarounds exist but reverse-engineer Antigravity's internal API, break on every update, and violate Google's Terms of Service — not something to set up or recommend as a stable path. For a chat-style local coding experience, prefer this Ollama+Claude Code route, or dedicated local-first tools: Continue.dev / Cline (VS Code extensions), Open WebUI, or Aider.
