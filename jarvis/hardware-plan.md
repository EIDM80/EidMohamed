> **English** · [العربية](hardware-plan.ar.md)

# The box: RTX 4080 (16 GB) · 64 GB RAM · 1 TB

A concrete plan for this specific machine. Verified against 2026 benchmarks — see
[Sources](#sources).

## Verdict

**Good machine, one hard ceiling.** 16 GB VRAM comfortably runs everything in the local
Jarvis stack *except* frontier-class reasoning and full-quality video generation. The
64 GB of RAM is genuinely generous — it's the service layer (Docker, Postgres, vector DB)
that eats RAM, and you have room to spare. The 1 TB is the tightest resource, not the GPU.

## VRAM budget — 16 GB total

| Component | VRAM | Verdict |
|---|---|---|
| **Qwen3-8B** Q4_K_M | ~5 GB | ~79 tok/s. Fast enough for voice, leaves room for everything else |
| **Qwen3-14B** Q4_K_M | ~9 GB | ~49 tok/s, 6–7 GB headroom for 32k context + KV cache. **The sweet spot** |
| **32B models** Q4 | 18–20 GB | ❌ Does not fit. Needs a 24 GB card |
| **70B** | ~40 GB | ❌ Not on this box (CPU offload = 1–3 tok/s, useless for voice) |
| faster-whisper large-v3 (STT) | ~2–3 GB | Fine |
| Kokoro / Piper (TTS) | ~0 | Runs on CPU |
| SDXL | ~8–10 GB | Fine |
| Flux.1-dev FP8/NF4 | ~12–16 GB | Works — but not alongside a loaded LLM |
| Wan 2.2 **5B** video | ~8 GB | Works |
| Wan 2.2 **14B** / LTX-2 | 24 GB+ | ⚠️ Falls back to shared memory: a 3-minute render becomes 8+ |

### The rule that actually governs this build

**You cannot hold a 14B LLM and an image/video model in VRAM at the same time.**
9 GB + 12 GB > 16 GB. Options, in order of sanity:

1. Set Ollama's `keep_alive` low (e.g. `OLLAMA_KEEP_ALIVE=60s`) so the LLM unloads when
   ComfyUI needs the card. Costs a few seconds of reload.
2. Run generation as a **queued job**, not inline in conversation — Jarvis says "starting
   the render," and reports back when it's done.
3. Drop to Qwen3-8B (5 GB) when a session is generation-heavy.

Design for this from day one. It's the single constraint that decides the architecture.

## Storage: 1 TB is the real squeeze

| What | Realistic size |
|---|---|
| OS + apps | 150–200 GB |
| Ollama models (3–4 of them) | 30–50 GB |
| ComfyUI checkpoints, video models, LoRAs, ControlNets | 200–400 GB |
| Docker images + volumes (Dify, n8n, Postgres, Redis, vector DB) | 40–60 GB |

That's 420–710 GB before any of your own files. Workable now, tight within months if you
go deep on video. Plan an external NVMe for the model library before it becomes urgent,
and keep ~20% of the system drive free.

## What this box does NOT change

A 14B local model is not a frontier model. For the strategy, analysis, and long-form
writing that is your actual job, local Qwen3-14B is meaningfully weaker than a cloud
frontier model — no quantization trick closes that gap. So the honest architecture is
**hybrid**, not "local everything":

| Run locally (free, private, always-on) | Keep in the cloud (quality-critical) |
|---|---|
| Speech-to-text (Whisper) | Strategy, analysis, long-form drafting |
| Text-to-speech (Kokoro/Piper) | Code that has to be right the first time |
| Embeddings + RAG over your documents | Anything you'd be embarrassed to send half-baked |
| Routine classification, tagging, triage | Reasoning over long, messy context |
| Image generation | |

This is not a compromise — it's the correct split. Local handles the high-volume, private,
boring work where 14B is plenty. The cloud handles the thinking. And the local half costs
nothing per call, which is exactly where per-call costs would otherwise add up.

## Install order for this machine

1. **Ollama + Qwen3-14B Q4_K_M** — one command, immediate payoff. Confirm ~49 tok/s.
2. **Open WebUI** — chat, RAG, documents, STT/TTS in one interface.
3. **Open WebUI Computer** (`pip install cptr && cptr run`) — files, terminal, browser.

Stop there and use it for two weeks. That trio is already chat + voice + RAG + computer
control, and it will teach you which of the remaining services you actually need.

Then, only when a real need appears:

- **LangGraph** — when one agent starts losing track of multi-step state.
- **n8n** — when you want scheduled automations with a visual editor.
- **ComfyUI** — when you actually need generated images (video: expect the 8-minute renders).
- **Dify** — when you want to hand non-technical colleagues a chatbot builder.
- **LiveKit** — only for real phone calls, and remember PSTN numbers and minutes cost money.

## Sources

- [RTX 4080 LLM benchmarks](https://www.hardware-corner.net/gpu-llm-benchmarks/rtx-4080/) · [4080 Super 16 GB picks](https://modelfit.io/gpu/rtx-4080-super/) · [16 GB VRAM model comparison](https://www.glukhov.org/llm-performance/benchmarks/choosing-best-llm-for-ollama-on-16gb-vram-gpu/)
- [Video generation VRAM requirements 2026](https://willitrunai.com/blog/video-generation-gpu-guide-2026) · [Wan 2.2 vs LTX-2 vs HunyuanVideo](https://localaimaster.com/blog/local-ai-video-generation) · [ComfyUI GPU guide](https://www.serverman.co.uk/ai/comfyui/best-gpu-for-comfyui/)
