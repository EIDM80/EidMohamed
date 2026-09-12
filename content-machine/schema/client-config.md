# `clients/<id>/config.json` — schema

| مفتاح | نوع | ملاحظات |
|---|---|---|
| `client_id` | string | نفس اسم المجلد |
| `display_name` | string | |
| `website` | string | |
| `brand.languages` | string[] | |
| `brand.primary_language` | string | |
| `brand.voice` | string | وصف نبرة الكتابة بسطر أو اتنين — بيستخدمه أي حد بيكتب كابشن/سكريبت |
| `brand.cta` | string | |
| `platforms.<name>.enabled` | bool | |
| `platforms.<name>.handle` | string | |
| `platforms.<name>.posts_per_day` | int | يتحكم في عدد الـslots اللي بيتولدوا لكل يوم للمنصة دي |
| `platforms.<name>.queue_file` | string | مسار نسبي جوه مجلد العميل |
| `topics[]` | `{id, label_ar, label_en}` | القطاعات/المواضيع اللي هيتغطوا |
| `personas[]` | `{id, label_ar, label_en}` | الشخصيات اللي هتظهر في المحتوى |
| `hooks[]` | `{id, label_ar, pattern}` | أنماط الهوك المتاحة |
| `content_type_mix` | `{content_type: weight}` | مجموع الأوزان مش لازم يساوي 1 بالظبط — بيتحول لاحتمالات نسبية تلقائيًا |
| `routing_overrides` | `{content_type: {engine, ...}}` | بتحل محل/تضيف فوق `routing/engine-routing.json` لعميل معين بس |

`content_type` لازم يكون أحد المفاتيح الموجودة في `routing/engine-routing.json` (أو مفتاح
جديد مع `routing_overrides` بيوصف المحرك بتاعه).

`topics`/`personas`/`hooks` كل واحد فيهم عنصر واحد على الأقل، وكل `id` لازم يكون فريد جوه
القائمة بتاعته (مش لازم فريد عبر القوائم التلاتة).
