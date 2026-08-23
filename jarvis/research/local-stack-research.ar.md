> **العربية** · [English](local-stack-research.md)

# بحث: منظومة Jarvis مجانية / ذاتية الاستضافة

المصدر: جلسة بحث في ChatGPT (بحث في GitHub وعلى الويب)، منقولة كاملة أدناه.
السؤال المطروح: *أفضل مستودع لبناء وكيل Jarvis مجاناً وبلا أي دفع — شات بوتات، ووكلاء
مكالمات، ووكلاء فيديو، وغيرها.*

هذا **مشروع مختلف** عن [دليل 2.0](../README.ar.md)، لا قائمة أدوات بديلة لنفس المشروع.
انظر [مساران مختلفان](#مساران-مختلفان) أدناه.

## حالة التحقق

تحققتُ من الادعاءات مقابل GitHub والويب بتاريخ 2026-08-23، لأن الادعاءات المحورية هنا هي
تحديداً من النوع الذي يُختلق:

| الادعاء | الحالة |
|---|---|
| **Open WebUI Computer** موجود ويتحكم في الحاسوب | ✅ **صحيح.** `github.com/open-webui/computer` — "حاسوبك، في أي مكان". يقدّم الملفات والطرفية والمحرر وgit والمتصفح إلى أي متصفح؛ ويكشف `/v1/chat/completions` ليقوده Open WebUI؛ مع ضوابط موافقة لكل محادثة. التثبيت: `pip install cptr && cptr run` |
| **PanPenek/JarvisAi** — كلمة إيقاظ، رؤية شاشة، 31 أداة، محلي | ✅ **صحيح** ومطابق للوصف: Whisper STT وKokoro TTS وOllama، وتسلسل أدوات وكيلي، وذاكرة SQLite + ChromaDB |
| **Mann473/jarvis-ai-assistant** | ⚠️ **غير مؤكد** — لم يظهر في البحث |
| **134ertel/jarvis** | ⚠️ **غير مؤكد** — لم يظهر في البحث |
| Ollama وLangGraph وCrewAI وLiveKit Agents وn8n وDify وComfyUI | ✅ كلها حقيقية وقابلة للاستضافة الذاتية كما وُصفت |

بديلان موثّقان عن المستودعين غير المؤكدين، إن أردت تطبيقاً مرجعياً صغيراً تقرأه:
[`EliseyRotar/jarvis-ai`](https://github.com/EliseyRotar/jarvis-ai)
(openwakeword + faster-whisper + Piper TTS، محرك مهام وكيلي، لينكس وويندوز) و
[`TimLukaHorstmann/J.A.R.V.I.S.`](https://github.com/TimLukaHorstmann/J.A.R.V.I.S.)
(faster-whisper مع TTS قابل للتبديل، جلسات SQLite، FastAPI).

### نقطة فاتت البحث: ترخيص Open WebUI

لم يعد Open WebUI تحت **BSD-3 الخالص**. فمنذ الإصدار 0.6.6 (أبريل 2025) صار BSD-3 مضافاً
إليه شرط حماية العلامة: لا يجوز تعديل أو إزالة أو إخفاء علامة Open WebUI (الاسم، الشعار،
علامات الواجهة) إلا في إحدى هذه الحالات —

- أقل من **50 مستخدماً نهائياً** في أي 30 يوماً متتالية، **أو**
- أن تكون مساهماً رسمياً بإذن كتابي مسبق، **أو**
- أن تملك ترخيصاً للمؤسسات.

**في Jarvis شخصي لا يعنيك هذا إطلاقاً** — أنت مستخدم واحد. لكنه يصير قيداً حقيقياً لحظة
نشره على مستوى الجامعة بهوية USTF: تتجاوز الخمسين مستخدماً، فيجب إبقاء اسم Open WebUI ظاهراً
أو الحصول على ترخيص مؤسسي. من الأفضل معرفة ذلك قبل أن يصير الأمر محورياً. وقد أثار هذا
التغيير اعتراضاً في المجتمع وحديثاً عن نسخ متفرعة، فقد يكون التفرّع من إصدار BSD خياراً أيضاً.

## مساران مختلفان

البحث محقّ في مسألة **التركيب** — لا تجبر مستودع Jarvis صغيراً على أن يصير منصة، بل ركّبها
من مشاريع يتقن كل منها طبقة واحدة. لكن كن واضحاً فيما تختار بينه:

| | **دليل 2.0** (Claude + موصّلات) | **هذا البحث** (منظومة ذاتية الاستضافة) |
|---|---|---|
| ما هو | وكيل إحاطات موصول بحسابات تملكها أصلاً | منصة ذكاء اصطناعي تشغّلها بنفسك |
| الزمن حتى أول نسخة عاملة | ساعات إلى أيام | أسابيع |
| التكلفة المتكررة | ~20$ شهرياً لباقة Claude | صفر في فواتير الـAPI |
| التكلفة الحقيقية | الاشتراك | جهاز GPU يعمل دائماً، وكهرباء، ووقتك في التشغيل والصيانة |
| السقف | ما تكشفه الموصّلات | أي شيء تستطيع استضافته |
| يفشل حين | يغيّر مزوّد ما واجهته أو أسعاره | تضطر لتشخيص ست خدمات Docker منتصف الليل |

**عبارة "مجاني" تحتاج التحفّظ الذي ذكره البحث نفسه**: لا فواتير API ما دامت النماذج تعمل
محلياً، لكن أرقام الهاتف ودقائق PSTN للمكالمات الحقيقية، وبعض واجهات السوشال، والرسائل
النصية وواتساب، وبعض خدمات البحث — كلها تكلّف مالاً. اجعلها اختيارية لا اعتماديات أساسية.
كما أن البحث لا يحدّد العتاد: تشغيل Ollama وComfyUI وDify وn8n وLiveKit وOpen WebUI معاً
التزام جادّ في ذاكرة كرت الشاشة وفي وقت التشغيل. احسم الجهاز قبل المعمارية.

**توصيتي:** المساران لا يتنافسان، بل يجيبان عن سؤالين مختلفين. نفّذ الدليل أولاً: يعطيك
Jarvis عاملاً خلال أسبوع، ويعلّمك أي الموصّلات تمدّ يدك إليها فعلاً. وهذا يجيب عن السؤال
الذي لا تستطيع المنظومة المحلية إجابته مسبقاً — *ماذا أريده أن يفعل؟* ثم استضِف محلياً ما
ثبتت أهميته، واترك ما لم يثبت. البدء بتسع خدمات هو الطريق إلى مشروع تهجره.

وإن بدأت المنظومة المحلية فابدأ بـ**ثلاث** خدمات لا تسع: Ollama + Open WebUI +
Open WebUI Computer. هذه وحدها تعطيك محادثة وصوتاً وRAG وتحكماً في الحاسوب. أضف LangGraph
حين يبدأ وكيل واحد بالتخبّط في إدارة الحالة، وLiveKit فقط حين تحتاج مكالمات هاتفية فعلية،
وComfyUI فقط حين تحتاج توليد فيديو فعلياً.

---

## البحث، منقولاً حرفياً

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
