# Content Machine

نظام إنتاج ونشر محتوى فيديو/إعلانات متعدد العملاء (multi-tenant) — كل عميل/مشروع/نشاط
ليه مجلد مستقل جوه `clients/`، وكل الأدوات المشتركة (تقنيات إبداعية، منطق توليد الجدول،
حلقة التحسين) موجودة مرة واحدة ومتاحة لأي عميل جديد.

بُني عشان يوصّل الخطوات اللي كانت شغالة يدويًا/متفرقة في مشروع ISO Order Portal (Drive
monitoring → توليد فيديو → Remotion → نشر متعدد المنصات → مراجعة يدوية) في نظام واحد
بمخرجات JSON ثابتة، جاهز إن واجهة (dashboard) تتبنى فوقه لاحقًا من غير ما تتعامل مع أي
تفاصيل تنفيذ.

## الطبقات الخمس

```
1. Ingestion        — مصدر الأصول الخام (Drive folder, رفع مباشر, إلخ) — خارج نطاق الكود ده حاليًا
2. Generation        — توليد الفيديو/الصورة (Higgsfield / fal.ai / Google Veo / Remotion)
3. Post-production    — Remotion (هوية بصرية، كابشنز، EndCard) — مشروع remotion-edit
4. Distribution      — نشر متعدد المنصات (Composio: YouTube/Instagram/Facebook/TikTok)
5. Optimization      — حلقة تحسين أسبوعية بترجع تغذي طبقة 2 (Generation) بقرارات أفضل
```

الكود في المجلد ده بيغطي **الجدولة (Stage 4/6) وحلقة التحسين (Stage 7)** — يعني القرار
"إيه اللي نولّده امتى ولمين ولأي منصة" وبعد النشر "إيه اللي نكرره وإيه اللي نوقفه".
التوليد الفعلي (استدعاء Higgsfield/fal.ai/Remotion) والنشر الفعلي (استدعاء Composio) لسه
بيحصلوا من جوه جلسة agent (زي الجلسات الحالية اللي بتقرأ الـqueues وتنشر) — الكود ده
بيجهزلهم شنطة العمل (queue entries) ويقرا نتائجهم (metrics) بدل ما يعيد تنفيذهم.

## البنية

```
content-machine/
  routing/
    engine-routing.json          # content_type -> engine (مشترك بين كل العملاء، قابل للتعديل لكل عميل)
  library/
    techniques/
      cinematic-camera-replacement.md   # مكتبة تقنيات إبداعية عامة، مش خاصة بعميل معين
  clients/
    <client_id>/
      config.json                # هوية العميل: منصات، مواضيع، شخصيات، هوكس، نسبة أنواع المحتوى
      learnings.json             # درجات متراكمة (EMA) لكل موضوع/شخصية/هوك — بتتحدث أسبوعيًا
      calendar/<week-id>.json    # الجدول المولّد لكل أسبوع (خطة، مش تنفيذ)
      queues/<platform>.json     # نفس شكل الـqueue اللي روتين النشر اليومي بيقرا منه
      performance/
        <week-id>-metrics-needed.json      # طلب المقاييس (تلقائي)
        <week-id>-metrics-collected.json   # نفس الملف بعد ما agent يملأ metrics فعليًا
        <week-id>-report.json              # النتيجة: فايزين/خاسرين + تحديث learnings
      creative/                  # أصول إبداعية خاصة بالعميل ده بس (برومبتات، أمثلة)
  scripts/
    new_client.py                     # عميل جديد
    generate_calendar.py              # Stage 4+6
    prepare_weekly_metrics_request.py # Stage 7a
    record_weekly_metrics.py          # Stage 7b
```

## سير العمل الأسبوعي

```bash
# 1) نهاية كل أسبوع: ولّد جدول الأسبوع الجاي (يضيف slots للـqueues تلقائيًا بحالة pending)
python3 scripts/generate_calendar.py isoorder --weeks 1

# 2) روتين النشر اليومي (زي اللي شغال حاليًا) بياخد أول entry status=pending من كل queue،
#    يولّد/يحرر/ينشر، ويحدّث الـentry لـ status=posted + platform_post_id + posted_at.
#    (الخطوة دي بتحصل جوه جلسة agent، مش سكريبت هنا.)

# 3) بعد ما أسبوع يخلص: جهّز طلب المقاييس
python3 scripts/prepare_weekly_metrics_request.py isoorder --week 2026-08-17

# 4) جلسة agent بتنادي أدوات insights (Composio Instagram/YouTube/Facebook, أو NexLev)
#    لكل platform_post_id في الملف الناتج، وتملأ حقل "metrics" لكل عنصر، وتحفظ الملف باسم
#    <week-id>-metrics-collected.json

# 5) احسب الدرجات وحدّث التعلّم (بيأثر تلقائيًا على الأسبوع الجاي عن طريق weighted_choice)
python3 scripts/record_weekly_metrics.py isoorder --week 2026-08-17
```

## عميل جديد

```bash
python3 scripts/new_client.py acme-clinic --name "Acme Clinic" --website "https://acme-clinic.com"
# بعدين املأ clients/acme-clinic/config.json: platforms enabled، topics، personas، hooks
python3 scripts/generate_calendar.py acme-clinic --weeks 1
```

مفيش أي حاجة في `config.json` أو في السكريبتات مربوطة بـISO Order تحديدًا — كل النشاط/الصناعة
بيتحدد بالكامل من `topics`/`personas`/`hooks` في ملف العميل. `routing_overrides` في نفس الملف
بتسمح لعميل معين يستخدم محرك مختلف لنوع محتوى معين (مثلاً عميل مفيش عنده Higgsfield فيحوّل
`ugc_talking_head` لـ`fal.ai` بدل الافتراضي).

## توجيه المحرك (Generation Routing)

`routing/engine-routing.json` هو مصدر الحقيقة الوحيد لأي content_type بيتولّد إزاي. إضافة
تقنية جديدة (مثلاً محرك توليد صوت، أو موديل فيديو جديد) = سطر جديد في الملف ده، مش تعديل
منطق في السكريبتات.

| content_type | المحرك الافتراضي | مناسب لـ |
|---|---|---|
| `ugc_talking_head` | Higgsfield MCP | شخص بيتكلم، الأساس لمعظم الإعلانات |
| `camera_replacement` | fal.ai (Kling/Seedance) | حركة كاميرا سينمائية فوق فيديو UGC جاهز |
| `hero_cinematic` | Google Veo (AI Studio) | محتوى قليل العدد عالي الأثر |
| `motion_graphics_static_source` | Remotion | تصميم/فيديو مصدر من العميل + هوية بصرية |
| `kinetic_typography` | Remotion | نفس السابق بمعالجة كابشنز حركية متقدمة |

## واجهة الاستخدام المستقبلية (spec لأي UI هيتبني فوق النظام)

كل حاجة محتاجاها الواجهة موجودة كـJSON قابل للقراءة/الكتابة مباشرة — مفيش داعي لأي طبقة API
وسيطة في البداية، الواجهة تقدر تتعامل مع الملفات دي مباشرة أو عبر سكريبت رفيع (thin wrapper):

| العملية | القراءة/الكتابة | الملف |
|---|---|---|
| عرض/تعديل هوية عميل | R/W | `clients/<id>/config.json` |
| عرض جدول أسبوع | R | `clients/<id>/calendar/<week>.json` |
| توليد جدول أسبوع جديد | Trigger | `python3 generate_calendar.py <id> --week ... ` |
| عرض حالة queue لكل منصة (pending/posted) | R | `clients/<id>/queues/<platform>.json` |
| تعديل يدوي لعنصر (مثلاً تغيير الهوك قبل التنفيذ) | W | نفس ملف الـqueue، عدّل الـentry بنفس الـid |
| تشغيل تحضير المقاييس الأسبوعية | Trigger | `python3 prepare_weekly_metrics_request.py <id> --week ...` |
| رفع المقاييس المجمّعة | W | `clients/<id>/performance/<week>-metrics-collected.json` |
| احتساب النتيجة + تحديث التعلّم | Trigger | `python3 record_weekly_metrics.py <id> --week ...` |
| عرض تقرير الفوز/الخسارة + درجات التعلّم | R | `clients/<id>/performance/<week>-report.json` |
| إضافة عميل جديد | Trigger | `python3 new_client.py <id> --name ...` |

كل السكريبتات stdlib بايثون بس (مفيش pip install)، وكلها بترجع exit code واضح ورسالة على
stdout — يعني أي backend (FastAPI/Express/إلخ) يقدر يشغّلها كـsubprocess مباشرة كخطوة أولى،
وبعدين نفكرها بالتدريج لموديولات Python بتتنادى مباشرة من غير subprocess لو احتجنا أداء أعلى.

## حدود معروفة (متعمدة، مش نسيان)
- التوليد الفعلي والنشر الفعلي محتاجين استدعاء أدوات (Higgsfield/fal.ai/Composio) من جوه
  جلسة agent فعلية — السكريبتات دي بتجهز/تقرا البيانات بس، مش بتنادي الأدوات دي بنفسها.
- جمع المقاييس بنفس المنطق: `prepare_weekly_metrics_request.py` بيحدد المطلوب، وagent هو
  اللي بينادي أدوات الـinsights الفعلية ويملأ النتيجة.
- الـqueues هنا (`clients/<id>/queues/*.json`) هي المكان الدائم الجديد الموصى بيه للـqueues —
  لو فيه queues شغالة حاليًا في `/tmp` scratchpad (زي مشروع ISO Order الحالي)، لازم تتنقل هنا
  عشان الحالة تفضل موجودة بين الجلسات (scratchpad بيتمسح مع نهاية الجلسة).
