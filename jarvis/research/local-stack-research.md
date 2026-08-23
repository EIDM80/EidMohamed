# Research: a free / self-hosted Jarvis stack

Source: a ChatGPT research session (GitHub + web search), pasted in full below.
Question asked: *the best repository to create a Jarvis agent for free, without any
payment — AI chatbots, AI call agents, AI video agents, and more.*

This is a **different project** from the [2.0 guide](../README.md), not an alternative
tool list for the same one. See [Two different paths](#two-different-paths) below.

## Verification status

Checked against GitHub and the web on 2026-08-23, because the load-bearing claims here are
exactly the sort that get invented:

| Claim | Status |
|---|---|
| **Open WebUI Computer** exists and does computer control | ✅ **Real.** `github.com/open-webui/computer` — "Your Computer. Anywhere." Serves files, terminal, editor, git, browser to any browser; exposes `/v1/chat/completions` so Open WebUI can drive it; per-chat approval controls. Install: `pip install cptr && cptr run` |
| **PanPenek/JarvisAi** — wake word, screen vision, 31 tools, local | ✅ **Real** and matches the description: Whisper STT, Kokoro TTS, Ollama, agentic tool chaining, SQLite + ChromaDB memory |
| **Mann473/jarvis-ai-assistant** | ⚠️ **Unconfirmed** — did not surface in search |
| **134ertel/jarvis** | ⚠️ **Unconfirmed** — did not surface in search |
| Ollama, LangGraph, CrewAI, LiveKit Agents, n8n, Dify, ComfyUI | ✅ All real, all self-hostable, as described |

Verified alternatives to the two unconfirmed repos, if you want a small reference
implementation to read: [`EliseyRotar/jarvis-ai`](https://github.com/EliseyRotar/jarvis-ai)
(openwakeword + faster-whisper + Piper TTS, agentic task engine, Linux/Windows) and
[`TimLukaHorstmann/J.A.R.V.I.S.`](https://github.com/TimLukaHorstmann/J.A.R.V.I.S.)
(faster-whisper + pluggable TTS, SQLite sessions, FastAPI).

### One catch the research missed: the Open WebUI license

Open WebUI is **not plain BSD-3 anymore**. Since v0.6.6 (April 2025) it's BSD-3 plus a
branding-protection clause: you may not alter, remove, or obscure Open WebUI branding
(name, logo, UI marks) unless one of these holds —

- fewer than **50 end users** in any rolling 30-day period, **or**
- you're an official contributor with written permission, **or**
- you hold an enterprise license.

**For a personal Jarvis this is a non-issue** — you're one user. It becomes a real
constraint the moment you deploy it university-wide under USTF branding: over 50 users,
the Open WebUI name has to stay visible or you need an enterprise license. Worth knowing
before it's load-bearing. The change drew community backlash and fork talk, so a
BSD-era fork may also be an option.

## Two different paths

The research is sound about *composition* — don't force a small Jarvis repo to become a
platform, assemble it from projects that each do one layer well. But be clear about what
you're choosing between:

| | **2.0 guide** (Claude + connectors) | **This research** (self-hosted stack) |
|---|---|---|
| What it is | A briefing agent wired to accounts you already have | An AI platform you run yourself |
| Time to first working version | Hours to days | Weeks |
| Recurring cost | ~$20/mo Claude plan | $0 in API fees |
| Real cost | The subscription | A GPU box that's always on, plus electricity, plus your ops time |
| Ceiling | What the connectors expose | Anything you can self-host |
| Fails when | A vendor changes its API or pricing | You have to debug six Docker services at midnight |

**"Free" needs the asterisk the research itself gives it**: no API bills when the models
run locally, but PSTN numbers and minutes for real phone calls, some social APIs,
SMS/WhatsApp, and some search services still cost money. Build those as optional, never as
core dependencies. And the research doesn't name hardware — running Ollama + ComfyUI +
Dify + n8n + LiveKit + Open WebUI at once is a serious VRAM and ops commitment. Nail down
the box before the architecture.

**Recommendation:** these aren't in competition — they answer different questions. Do the
guide first: it gets a working Jarvis this week and teaches you which connectors you
actually reach for. That answers the question the local stack can't tell you in advance —
*what do I want it to do?* Then self-host the pieces that turn out to matter, and skip the
ones that don't. Starting with nine services is how this becomes a project you abandon.

If you do start the local stack, start with **three** services, not nine: Ollama +
Open WebUI + Open WebUI Computer. That's chat, voice, RAG, and computer control. Add
LangGraph when one agent starts juggling too much state, LiveKit only when you actually
need phone calls, ComfyUI only when you actually need generated video.

---

## The research, verbatim

> بحثت في GitHub مباشرة، وبحثت كذلك في النتائج الحديثة على الويب مع التركيز على المشاريع التي تحقق أكبر قدر ممكن من هذه الشروط: Jarvis شخصي، Local-first، بدون اشتراكات/API مدفوعة، Voice + Chat + Vision + Tools + Automation + Multi-agent، وقابل للتوسع لاحقاً إلى Call Agents وVideo Agents.
>
> النتيجة المهمة: لا أنصح ببناء المشروع فوق Repository واحد فقط. أفضل نتيجة ستكون Jarvis مركّباً من عدة مشاريع مفتوحة المصدر، مع مشروع واحد يكون الـCore.
>
> ### اختياري الأول: Open WebUI + Open WebUI Computer
>
> أقوى نقطة انطلاق وجدتها ليست أحد مشاريع Jarvis الصغيرة، بل منظومة Open WebUI مع Open WebUI Computer.
> Open WebUI يدعم Ollama والنماذج المحلية، RAG، المستندات، Web Search، أدوات، Voice/Video calls وSTT/TTS. أما Computer فيحوّل المساعد من chatbot إلى Agent يستطيع العمل على الكمبيوتر نفسه: قراءة وتعديل الملفات، تشغيل الأوامر، التصفح، استخدام الأدوات، جدولة المهام وتشغيل sub-agents. كما يدعم MCP/OpenAPI.
> وهذا بالضبط أقرب أساس لما تقصده بـ Jarvis Platform وليس مجرد voice assistant.
>
> ### أفضل Architecture وجدتها
>
> بدلاً من البحث عن Repo يدّعي أنه يفعل كل شيء، أقترح هذه التركيبة:
>
> | Layer | Repository | وظيفته في Jarvis | Local/Free |
> |---|---|---|---|
> | 🧠 Local AI | Ollama | تشغيل Llama/Qwen/Gemma وغيرها محلياً | ✅ |
> | 🖥️ Main UI | Open WebUI | Chat + RAG + Voice/Video + Models | ✅ |
> | 🤖 Computer Agent | Open WebUI Computer | Computer control + files + browser + commands + subagents | ✅ |
> | 🧠 Agent Orchestration | LangGraph | Memory + stateful/multi-agent workflows | ✅ MIT |
> | 🧑‍🤝‍🧑 Agent Teams | CrewAI | فرق Agents متخصصة | ✅ MIT |
> | 🎙️ Voice/Call Agents | LiveKit Agents | realtime voice/video/call agents | ✅ |
> | 🔄 Automation | n8n | workflows / integrations | Self-host |
> | 🏭 AI App Factory | Dify | بناء Chatbots/Agents/RAG بصرياً | Self-host |
> | 🎬 Video/Image Engine | ComfyUI | Image/Video generation workflows | ✅ |
>
> ميزة هذه الطريقة أننا لا نحاول إجبار Jarvis repository صغير على أن يصبح منصة ضخمة.
>
> ### Voice & AI Call Agents: LiveKit
>
> LiveKit Agents مصمم أصلاً لبناء realtime multimodal voice agents تستطيع أن تسمع وترى وتتحدث، ويدعم WebRTC وTelephony وMCP وjob scheduling. كما أن الـtelephony stack يسمح للـAgent باستقبال وإجراء المكالمات الهاتفية. والأهم أن الـstack نفسه قابل للتشغيل self-hosted ومفتوح المصدر.
>
> لكن هناك نقطة مهمة: كون LiveKit مفتوح المصدر لا يعني أن الاتصال بشبكة الهاتف PSTN نفسها مجاني؛ SIP trunk/رقم الهاتف/الدقائق عادة خدمة خارجية مدفوعة. أما Agent الصوتي عبر الكمبيوتر/المتصفح فيمكن جعله محلياً إلى حد كبير.
>
> ### Chatbot / Business Agent Factory: Dify
>
> هذا مشروع ضخم جداً ومناسب لأن يصبح Agent Factory داخل Jarvis بدلاً من كتابة كل chatbot من الصفر. يدعم Visual workflows وRAG وAgents وFunction Calling/ReAct وعشرات الأدوات وAPI، كما يدعم النماذج self-hosted. النسخة Community يمكن تشغيلها محلياً عبر Docker.
>
> مثلاً داخل Jarvis يمكن أن تقول: `Create a customer support agent for ISO Order.` فيقوم النظام ببناء workflow عبر Dify، وإضافة Knowledge Base، وإنشاء API، ثم ربطه بالموقع.
>
> ### Brain / Multi-Agent Orchestrator: LangGraph
>
> أراه أفضل من جعل CrewAI وحده هو عقل Jarvis. LangGraph يوفر stateful agents، durable execution، human-in-the-loop، short/long-term memory، long-running workflows. وهذه خصائص أساسية لمساعد شخصي حقيقي لا ينسى حالة المهمة بمجرد انتهاء prompt.
>
> أما CrewAI فأستخدمه داخل Jarvis عندما نحتاج Crew of Specialists. المشروع MIT، وله مجتمع كبير ونشط.
>
> ```
> Jarvis
>    │
>    ├── Research Agent
>    ├── Marketing Agent
>    ├── Coding Agent
>    ├── SEO Agent
>    ├── Video Agent
>    ├── Voice Agent
>    ├── Email Agent
>    └── Browser Agent
> ```
>
> LangGraph يدير الـstate والrouting، وCrewAI يستخدم عندما نحتاج فريق Agents يتعاون على مهمة.
>
> ### Video Agent: ComfyUI
>
> بالنسبة إلى "AI Video Agent"، لا أقصد مجرد chatbot يتحدث عن الفيديو. أقصد Agent يستطيع تنفيذ:
>
> ```
> Idea → Script → Storyboard → Prompt generation → Image generation
>      → Video generation → Voice → Lip sync → Music → Editing → Export
> ```
>
> وهنا أفضل backend مفتوح المصدر هو ComfyUI، ثم نربطه بـJarvis كـtool. وبذلك تستطيع مستقبلاً إضافة نماذج الفيديو المفتوحة المتوافقة بدلاً من الارتباط بخدمة SaaS واحدة.
>
> ### ماذا عن مشاريع Jarvis الجاهزة؟
>
> وجدت عدة مشاريع مثيرة للاهتمام، لكنني لا أختار أياً منها كقاعدة نهائية للمشروع الكبير.
>
> **Mann473/jarvis-ai-assistant** — مشروع جيد جداً كبداية تعليمية: local Ollama + faster-whisper + wake word + SQLite، ويصرح بأنه لا يحتاج APIs مدفوعة، وترخيصه MIT. لكنه ما زال أقرب إلى personal voice assistant من Agent Operating System.
>
> **PanPenek/JarvisAi** — مثير جداً لأنه يحتوي بالفعل على wake word، screen vision، desktop control، web search و31 tool وagentic tool chaining، ويستخدم Whisper/Kokoro/Ollama محلياً.
>
> **134ertel/jarvis** — desktop voice-first Jarvis يعمل محلياً بدون cloud model/API key، ويستخدم Ollama مع architecture modular تسمح بتغيير الـbackend لاحقاً.
>
> لكن هذه المشاريع تصلح كمصدر أفكار وcomponents أكثر من كونها foundation لمنصة شاملة.
>
> ### النتيجة النهائية
>
> إذا كان المقصود: *"أريد Jarvis واحداً يستطيع إنشاء وتشغيل Agents أخرى، يتحدث معي، يرى الشاشة، يتحكم في الكمبيوتر، يبحث، يبرمج، يبني chatbots، يبني voice agents، يشغّل workflows، ويولد media — مع الاعتماد قدر الإمكان على RTX/local models وبدون API bills."*
>
> فترتيبي هو:
> 1. 🥇 **Open WebUI + Computer** = Jarvis Shell
> 2. 🥈 **Ollama** = Local Intelligence
> 3. 🥉 **LangGraph** = Jarvis Brain / Orchestrator
>
> ```
>                     JARVIS
>                        │
>         ┌──────────────┼──────────────┐
>         │              │              │
>     Open WebUI     LangGraph       Memory/RAG
>         │              │
>         └────── Jarvis Brain ────────┘
>                        │
>     ┌──────────┬───────┼─────────┬──────────┐
>     │          │       │         │          │
>  Computer    Voice    Apps      Media     Teams
>     │          │       │         │          │
> Open WebUI  LiveKit   Dify     ComfyUI    CrewAI
>  Computer
>     │
>  Browser / OS / Files / Shell
>                        │
>                      n8n
>                        │
>              External Automations
> ```
>
> والـLLM layer: `Ollama ├─ Qwen ├─ Llama ├─ Gemma ├─ DeepSeek └─ Vision models`
>
> بهذا لا ندفع مقابل الـLLM نفسه طالما نستخدم local models. لكن عبارة "100% free forever" تحتاج دقة: تشغيل AI محلياً يمكن أن يكون بلا API fees، بينما الخدمات الخارجية الحقيقية مثل أرقام الهاتف/PSTN، بعض social APIs، SMS/WhatsApp، وبعض خدمات search أو cloud infrastructure قد تفرض رسوماً. لذلك أبني النظام بحيث تكون هذه اختيارية وليست dependency أساسية.
>
> والأهم: بما أنك تريد Jarvis كمنصة وليس مجرد demo، فأنا لا أنصح أن نبدأ من أحد Jarvis repos الصغيرة. أبدأ من Open WebUI/Open WebUI Computer + Ollama، ثم نضيف LangGraph وLiveKit وComfyUI وDify تدريجياً. هذا يقلل كمية البرمجة التي سنعيد اختراعها، ويعطينا أسرع طريق إلى نسخة قابلة للاستخدام فعلاً.
>
> إذا أردنا تحويل هذا الآن إلى مشروع فعلي، الخطوة التالية المنطقية هي أن أبني JARVIS MASTER ARCHITECTURE v1 على مستوى repositories/services وDocker/GPU/ports/database/model routing، ثم نبدأ بأول نسخة تعمل: Jarvis Chat + Voice + Memory + Web + Computer Control + Agent Creator.

## Links

- [open-webui/computer](https://github.com/open-webui/computer) · [docs](https://docs.openwebui.com/ecosystem/computer/)
- [open-webui/open-webui](https://github.com/open-webui/open-webui) · [license terms](https://docs.openwebui.com/license/)
- [PanPenek/JarvisAi](https://github.com/PanPenek/JarvisAi)
- [EliseyRotar/jarvis-ai](https://github.com/EliseyRotar/jarvis-ai) · [TimLukaHorstmann/J.A.R.V.I.S.](https://github.com/TimLukaHorstmann/J.A.R.V.I.S.)
