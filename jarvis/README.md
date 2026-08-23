# Build Your Own Jarvis: The Complete 2.0 Guide

Round two. Last time you got one tool per step. This time you get two, plus the exact
split: which one to pick for your situation. It's still mostly **Claude Code plugged into
apps you already use, one connector at a time**.

> An MCP (a.k.a. connector) is a direct line between Claude and one app.

## The 9 steps

| # | What you're building | Pick this... | ...or this |
|---|---|---|---|
| 1 | **Talk to it** | **FluidVoice** — free, private, fully on-device dictation (macOS). Free, open source | **Typeless** — the most seamless dictation on every device, with AI cleanup. Free 8k words/week, Pro $12/mo |
| 2 | **The Jarvis dashboard** | **Lovable** — a quick, clean website with a hosted URL today. Free 5 credits/day, Pro $25/mo | **Higgsfield App Builder** — more stunning visuals, with image/video generation built into your app. Bundled with Higgsfield plans, from $15/mo |
| 3 | **The voice** | **ElevenLabs** — instant, movie-grade replies (~75ms). Free 10k credits/mo, Starter $5/mo | **Fish Audio** — if it mostly reads briefings: #1 on TTS-Arena at roughly a tenth of the API price. Free 8k credits/mo, Plus $11/mo |
| 4 | **Let it use your browser** | **Claude for Chrome** — clicking around your own logged-in browser, right in front of you. Bundled with paid Claude plans | **Playwright MCP** — automations running in the background, exactly the same every time. Free, open source (Microsoft) |
| 5 | **Track revenue** | **RevenueCat MCP** — if your money is a mobile app with subscriptions. MCP free | **Stripe MCP** — for anything sold on the web. Restricted keys mean it can read revenue but never move money. MCP free |
| 6 | **Social analytics** | **Metricool MCP** — for solo creators: the free plan includes the MCP (IG, TikTok, YouTube, best-times, competitors). Starter $20/mo | **Ayrshare** — if you manage many accounts like a company: one clean API across 13+ networks, incl. comments + DMs. $149/mo, no free tier |
| 7 | **Handle your inbox** | **Gmail connector** — if your life is in Gmail: it drafts replies but physically cannot hit send. Included with Claude | **AgentMail** — give your agent its own dedicated address (not your inbox) that can send and reply on its own. Free 3 inboxes / 3k emails/mo, Dev $20/mo |
| 8 | **Hand off the coding** | **Claude Code alone** — one agent that plans, builds, and reviews everything. Included in Claude Pro $20/mo | **Codex or Kimi Code** — cheaper tokens for similar results: Claude plans and reviews, they write the code. Codex is free with a ChatGPT sign-in; Kimi from $19/mo, roughly 5x cheaper |
| 9 | **Run it before you wake up** | **Routines via `/schedule`** — the 6am briefing with your laptop shut: runs in Anthropic's cloud, included with Pro/Max | **Local cron/launchd + `claude -p`** — if the briefing needs your local files: $0, full control, machine must be awake |

## How to actually start

The guide's own advice, restated as an order of operations:

1. **Steps 1 + 3 first** (dictation in, voice out). That's the "Jarvis feel" — everything
   after it is plumbing.
2. **Add one connector at a time** (steps 5, 6, 7). Get each one answering real questions
   about your own data before adding the next. A broken stack of six connectors is
   impossible to debug; a broken stack of one is not.
3. **Step 9 last.** Schedule the briefing only once the connectors it reads from are
   working when you run them by hand.
4. **Step 2 (dashboard) is optional** until you have something worth putting on a screen.

### Cheapest working path

FluidVoice (free) → Gmail connector (included with Claude) → Metricool MCP (free plan) →
Stripe MCP with restricted read-only keys (free) → ElevenLabs free tier → `/schedule` on a
Claude Pro plan. That's a working Jarvis for the price of the Claude subscription.

### Safety notes carried from the guide

- The **Gmail connector cannot send** — it drafts only. If you want an agent that sends on
  its own, that's AgentMail, on its own address, not your inbox.
- **Stripe restricted keys** let it read revenue but never move money. Use restricted keys.
- **Playwright MCP** runs headless in the background; **Claude for Chrome** acts inside your
  real logged-in session, in front of you. Pick per how much you want to watch it.

## What's in this folder

| Path | What it is |
|---|---|
| `README.md` | This guide |
| `source/Build_Your_Own_Jarvis.docx` | The original document, unmodified |
| `videos/jarvis.mp4` | Walkthrough video 1 (1:22) |
| `videos/jarvis_2.mp4` | Walkthrough video 2 (1:12) |

The videos are stored in the repo directly — clone it and they come with it.
