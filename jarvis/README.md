> **English** · [العربية](README.ar.md)

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

## What the demo looks like (`videos/jarvis_2.mp4`)

The video is the whole guide compressed into one morning briefing. You say *"Hey Jarvis,
wake up — so how's the app doing?"* and it answers:

> Good evening, sir. Pulling up our apps now. Over the last seven days we have **2,459 new
> downloads** and generated **$4,289 in revenue**. For organic content, I'm still posting
> **3 short-form videos** today. Throughout the week you've seen **16 customer emails**.
> Since you've already approved that direction, I handed it to Tom to develop the agent.

Every sentence in that answer is one connector from the table above. That's the whole
trick — the briefing isn't a feature you build, it's what falls out once the connectors
are attached:

| Line in the briefing | Comes from | Step |
|---|---|---|
| "Hey Jarvis, wake up…" (you, out loud) | FluidVoice / Typeless | 1 |
| "Good evening, sir." (spoken back) | ElevenLabs / Fish Audio | 3 |
| "Pulling up our apps now." | Lovable / Higgsfield dashboard | 2 |
| "2,459 new downloads … $4,289 in revenue" | RevenueCat / Stripe | 5 |
| "3 short-form videos today" | Metricool / Ayrshare | 6 |
| "16 customer emails this week" | Gmail / AgentMail | 7 |
| "I handed it to Tom to develop the agent" | Claude handing coding off to Codex / Kimi | 8 |
| The fact that it ran before you woke up | Routines `/schedule` or cron | 9 |

Full timestamped transcript: [`videos/jarvis_2.transcript.md`](videos/jarvis_2.transcript.md).

### The briefing prompt

Reconstructed from the demo — this is the thing you put in `/schedule` (or in a
`claude -p` cron job) once the connectors are attached. Trim it to whichever connectors
you actually have:

```text
Good morning briefing. Keep it under 60 seconds spoken, no preamble, no bullet lists —
one short paragraph, the way a chief of staff would say it out loud.

1. Revenue + installs: last 7 days vs the 7 before. Give me the numbers, and only flag
   the trend if it moved more than 10%.
2. Social: what's scheduled to post today, and any post from yesterday that beat its
   own average.
3. Inbox: how many customer emails came in this week, how many still need me, and draft
   replies for the ones that don't.
4. Engineering: what shipped since yesterday, what's in progress, what's blocked on me.

End with the single thing you'd do first if you were me today.
```

## Video 1 is the 1.0 (`videos/jarvis.mp4`)

Worth watching first: it's the same demo app and the same briefing, but with **one tool per
step** — that's the version the 2.0 guide is a sequel to. The delta:

| Job | 1.0 said | 2.0 says |
|---|---|---|
| Dashboard | Hand Claude a **reference image** and it one-shots it (*"took me five minutes"*) | Lovable *or* Higgsfield App Builder |
| Talk to it | Claude **Voice mode** instead of typing | FluidVoice *or* Typeless |
| The voice | ElevenLabs ("that British Jarvis voice") | ElevenLabs *or* Fish Audio |
| Browser | Claude in Chrome | Claude for Chrome *or* Playwright MCP |
| Revenue | RevenueCat MCP | RevenueCat *or* Stripe |
| Social | **Buffer MCP** — publish everywhere in one command | Metricool *or* Ayrshare |
| Inbox | Gmail MCP | Gmail *or* AgentMail |
| Schedule | Routines | Routines *or* local cron |

### Three things 1.0 has that 2.0 dropped

Don't lose these — they're the parts that make it feel like staff rather than a dashboard:

- **Meta's official Ads MCP** — run paid campaigns from the same agent. No 2.0 equivalent;
  the 2.0 social slot is analytics-only.
- **FAQs in Markdown → 90% of customer service.** Write your FAQs as plain `.md` files, point
  Claude at them, and it answers the routine customer email itself. This is the cheapest
  high-leverage step in either video and it costs nothing but the writing.
- **Custom sub-agents with their own skills and connectors**, with the main agent handing
  work off to the right one. This is what the 2.0 demo means at 0:48 by *"I handed it to Tom
  to develop the agent"* — Tom is a sub-agent. 2.0 shows the result; 1.0 shows the mechanism.

Full transcript: [`videos/jarvis.transcript.md`](videos/jarvis.transcript.md).

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
5. **Then the 1.0 extras** (see below): FAQs in Markdown for customer service, and
   sub-agents once one agent is juggling too many connectors.

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
| `README.md` / `README.ar.md` | This guide (English / Arabic) |
| `hardware-plan.md` (+ `.ar.md`) | A concrete plan for the RTX 4080 / 64 GB box: VRAM budget, model picks, install order |
| `research/local-stack-research.md` (+ `.ar.md`) | A self-hosted / free alternative stack (Open WebUI + Ollama + …), with claims verified and the two paths compared |
| `setup/` | Windows 11 install: `docker-compose.yml`, `jarvis.ps1` control script, step-by-step guide |
| `source/Build_Your_Own_Jarvis.docx` | The original document, unmodified |
| `videos/jarvis.mp4` | Walkthrough video 1 (1:22) — the 1.0, one tool per step |
| `videos/jarvis.transcript.md` (+ `.ar.md`) | Timestamped transcript of video 1, decoded step by step |
| `videos/jarvis_2.transcript.md` (+ `.ar.md`) | Timestamped transcript of video 2, decoded step by step |
| `videos/jarvis_2.mp4` | Walkthrough video 2 (1:12) — the demo briefing |

The videos are stored in the repo directly — clone it and they come with it.
Every document exists in English and Arabic; `.ar.md` is the Arabic twin of each file.

## The other path

There's a second, very different way to build this: self-host everything on your own GPU
instead of renting connectors. See [`research/local-stack-research.md`](research/local-stack-research.md)
— it's not a competing tool list, it's a different project with a different time and cost
shape. Short version: do this guide first to learn what you actually want Jarvis to *do*,
then self-host the pieces that earned it.
