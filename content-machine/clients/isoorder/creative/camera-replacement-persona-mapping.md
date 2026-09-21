# تطبيق Cinematic Camera Replacement على الـ10 برومبتات (meta-ai-video-prompts.txt)

فكرة الاستخدام على مرحلتين:
1. **المرحلة 1** — تاخد برومبت من `meta-ai-video-prompts.txt` (رقم 1 لحد 10) وتولّد بيه الفيديو الأساسي في Runway/Pika/Luma/Veo 3/Sora — ده بيديك شخص بيتكلم بزاوية ثابتة.
2. **المرحلة 2 (الملف ده)** — تاخد **نفس الفيديو الناتج من المرحلة 1** وترفعه تاني كمصدر (video-to-video) في أداة بتدعم الرفع (مثل Runway Aleph / Luma Modify / Kling)، وتلزق برومبت حركة الكاميرا المناسب من تحت. النتيجة: نفس الأداء بالظبط + حركة كاميرا سينمائية.

كل الـ10 برومبتات مصممة أصلاً على إن الشخص بيبص في العدسة من أول ثانية وقاعد/واقف في مكان له عمق وراه — وده بالظبط الشرط اللي محتاجه تقنية **01 (Orbit Behind)**. أربعة منهم بس في أماكن واسعة كفاية لتقنية **02 (Impossible Wide)** كمان كخيار بديل أقوى بصريًا. مفيش داعي لتقنيات 03/04/06/07 هنا لأنها محتاجة سما مفتوحة أو حاجات سايبة حوالين الشخص — مش متوفرة في السيناريوهات دي.

---

## جدول المطابقة

| # | البرسونا | التقنية الافتراضية | بديل | ليه |
|---|----------|---------------------|------|-----|
| 01 | مقاولات (موقع إنشاءات) | **02 — Impossible Wide** | 01 | موقع إنشاءات مفتوح، مساحة كافية لانسحاب 15م+ |
| 02 | مطاعم (مطبخ) | **01 — Orbit Behind** | — | مطبخ مساحته محدودة، مناسب للف حوالين الشخص بس |
| 03 | شركات تقنية (مكتب زجاج) | **01 — Orbit Behind** | — | مكتب فيه عمق (سكاي الاين وراه) لكن مش ضخم |
| 04 | لوجستيات وشحن (مخزن) | **02 — Impossible Wide** | 01 | مخزن/warehouse من أماكن Impossible Wide الموصى بيها في الدليل بالظبط |
| 05 | فنادق (ريسبشن) | **01 — Orbit Behind** | — | كاونتر رخام وراه عمق كافي للف مش للانسحاب الواسع |
| 06 | صالات رياضية (جيم) | **01 — Orbit Behind** | — | مساحة جيم عادية، مرايات ممكن تعمل مشاكل انعكاس لو الكاميرا لفت بعيد أوي — الف القريب أأمن |
| 07 | ورش صيانة سيارات (جراج) | **02 — Impossible Wide** | 01 | الجراج مذكور صراحة في الدليل كمكان مثالي لتقنية Impossible Wide |
| 08 | استشارات (غرفة اجتماعات) | **01 — Orbit Behind** | — | غرفة اجتماعات مقفولة، مساحة محدودة |
| 09 | مصانع أغذية (خط إنتاج) | **02 — Impossible Wide** | 01 | خط إنتاج/مصنع من الأماكن الضخمة المناسبة لكشف الحجم الكامل |
| 10 | عام/نجاح (مكتب مع شهادة) | **01 — Orbit Behind** | — | مكتب عادي، الشهادة على الحيطة تبان كويس مع اللف من وراه |

**نصيحة:** لو معاك نفس الفيديو وعايز تجرب الاتنين، شغّل 01 و02 على نفس المصدر وقارن — التوليد فيه عشوائية زي ما الدليل بيقول، فمرة واحدة مش دليل كافي.

---

## Technique 01 — Orbit Behind (الافتراضي لمعظم البرسونات)

```
Use the attached video as the performance source. This is a camera
replacement, not a re-animation.

LOCKED — must match the source frame for frame:
The subject's identity, face, facial structure, hair, beard, skin
texture, clothing, accessories and body proportions. Every body
movement, gesture, step, head turn and facial expression. The exact
timing and speed of that movement. Dialogue and lip sync. The
environment, background elements, lighting direction, time of day and
colour grade. Nothing about the performance changes — no frames added,
removed, slowed or sped up. If the subject takes four steps in the
source, they take the same four steps at the same moments here.

CHANGED — the camera only:
This shot begins exactly where the original camera was. The opening
frame matches the source framing, position, height and lens precisely.
From that point the camera departs, and the departure is permanent. Once
it has left the original position it never returns to it, never drifts
back toward it, and never reproduces that composition again at any point
in the clip. The final frame must be radically different from the first.
Remaining at or near the original framing beyond the opening frame is a
failure.

EYELINE:
This camera is purely observational — the subject does not know it is
there. Preserve their original direction of gaze at every moment; they
keep looking at whatever held their attention in the source. They must
not turn toward, acknowledge, or make eye contact with this camera.
In the source the subject is looking into the lens. That lens position
becomes an empty point in space at 12 o'clock the instant the camera
leaves it. The subject keeps addressing that empty point for the rest of
the shot, at every stage of the move, including while the camera is
behind them.

PHYSICS:
Realistic perspective, lens behaviour, parallax, depth of field, motion
blur and camera inertia for this specific placement. Foreground and
background shift at correct relative speeds. Photoreal, 24fps, filmic.

MOVEMENT QUALITY:
The camera behaves as a single rigid body with real weight. There is no
shake, no float, no sway, no bobbing, no drift and no small corrections
mid-move — every frame sits exactly on one smooth continuous path.
That path is an arc pivoting around a single fixed point on the ground.
It curves throughout and never straightens into a direct advance or a
direct retreat. Height and horizontal travel change at the same time,
never one after the other.
Speed changes smoothly with weight behind it, without jitter or stutter.
Motion blur matches the speed at every moment.
The frame shows only the subject and their location, exactly as they
appear in the source. Nothing else enters the shot — no object,
structure or person that is not already present in the source video,
including in shadows and in reflections on any surface.

SHOT:
One continuous take. No cuts, no dissolves, no freeze frames, and no
post-production speed ramping of the footage — the subject's performance
plays at exactly its original speed from first frame to last.
The camera itself does change speed, and this is intentional: it
accelerates and decelerates with real weight behind it.
The move runs across the entire duration of the clip and is still in
motion at the last frame.

LENS:
A single prime lens for the whole shot. Do not zoom. Every change in
scale comes from the camera physically travelling through space, and the
perspective distorts accordingly as it moves — near objects change size
far faster than far ones.

Clock reference: 12 o'clock is the direction the subject faces or
travels.

OPENING — the movement starts at frame one:
The camera is already in motion at the very first frame. There is no
static opening, no held frame, and no pause before the movement begins.
Treat the clip as beginning in the middle of a move that was already
under way before the recording started — the first frame is not the
beginning of the movement, only the beginning of the recording.
The opening frame matches the source framing, but it is a moving frame,
not a still one.

MOTIVATION:
The subject is speaking to someone who is not in this frame. The camera
is not illustrating the speech — it is quietly circling a person who
does not know it exists. It leaves immediately and keeps going.

CAMERA:
Camera begins at the original position at 12 o'clock, at eye level,
holding the source framing on a 35mm lens, already orbiting.
It travels continuously in one direction around the subject, passing
through 2, 3 and 4 o'clock, then behind them through 6 o'clock, and
ending at roughly 8 o'clock. It widens gradually as it travels. The
subject stays off-centre in frame throughout, never perfectly centred.
The orbit radius stays constant; height rises by a few centimetres
across the move.

REVEAL:
As the camera passes behind the subject, the space in front of them
enters frame for the first time — the room they are speaking into, and
whatever stands there. Show it plainly and let it pass; do not linger on
it or push toward it.

TIMING — the move is front-loaded:
First third — the fastest and most aggressive part of the entire move,
at full speed from the opening frame, strongest motion blur here.
Middle third — the speed carries through with momentum, still clearly
travelling.
Final third — easing down but never stopping, still in motion at the
last frame.

FAILURE — this specific shot has failed if:
Any static or near-static frame appears at the start of the clip. If the
first half-second contains no camera movement, the shot has failed.
The subject turns their head, eyes or body toward this camera at any
point, or the orbit stops, reverses, or leaves the subject facing
directly into the new lens at the end.
```

---

## Technique 02 — Impossible Wide (للأماكن الواسعة: مقاولات، لوجستيات، جراج، مصانع)

```
Use the attached video as the performance source. This is a camera
replacement, not a re-animation.

LOCKED — must match the source frame for frame:
The subject's identity, face, facial structure, hair, beard, skin
texture, clothing, accessories and body proportions. Every body
movement, gesture, step, head turn and facial expression. The exact
timing and speed of that movement. Dialogue and lip sync. The
environment, background elements, lighting direction, time of day and
colour grade. Nothing about the performance changes — no frames added,
removed, slowed or sped up. If the subject takes four steps in the
source, they take the same four steps at the same moments here.

CHANGED — the camera only:
This shot begins exactly where the original camera was. The opening
frame matches the source framing, position, height and lens precisely.
From that point the camera departs, and the departure is permanent. Once
it has left the original position it never returns to it, never drifts
back toward it, and never reproduces that composition again at any point
in the clip. The final frame must be radically different from the first.
Remaining at or near the original framing beyond the opening frame is a
failure.

EYELINE:
This camera is purely observational — the subject does not know it is
there. Preserve their original direction of gaze at every moment; they
keep looking at whatever held their attention in the source. They must
not turn toward, acknowledge, or make eye contact with this camera.
In the source the subject is looking into the lens. That lens position
becomes an empty point in space at 12 o'clock the instant the camera
leaves it. The subject keeps addressing that empty point for the rest of
the shot, at every stage of the move, including while the camera is
behind them.

PHYSICS:
Realistic perspective, lens behaviour, parallax, depth of field, motion
blur and camera inertia for this specific placement. Foreground and
background shift at correct relative speeds. Photoreal, 24fps, filmic.

MOVEMENT QUALITY:
The camera behaves as a single rigid body with real weight. There is no
shake, no float, no sway, no bobbing, no drift and no small corrections
mid-move — every frame sits exactly on one smooth continuous path.
That path is an arc pivoting around a single fixed point on the ground.
It curves throughout and never straightens into a direct advance or a
direct retreat. Height and horizontal travel change at the same time,
never one after the other.
Speed changes smoothly with weight behind it, without jitter or stutter.
Motion blur matches the speed at every moment.
The frame shows only the subject and their location, exactly as they
appear in the source. Nothing else enters the shot — no object,
structure or person that is not already present in the source video,
including in shadows and in reflections on any surface.

SHOT:
One continuous take. No cuts, no dissolves, no freeze frames, and no
post-production speed ramping of the footage — the subject's performance
plays at exactly its original speed from first frame to last.
The camera itself does change speed, and this is intentional: it
accelerates and decelerates with real weight behind it.
The move runs across the entire duration of the clip and is still in
motion at the last frame.

LENS:
A single prime lens for the whole shot. Do not zoom. Every change in
scale comes from the camera physically travelling through space, and the
perspective distorts accordingly as it moves — near objects change size
far faster than far ones.

Clock reference: 12 o'clock is the direction the subject faces or
travels.

OPENING — the movement starts at frame one:
The camera is already in motion at the very first frame. There is no
static opening, no held frame, and no pause before the movement begins.
Treat the clip as beginning in the middle of a move that was already
under way before the recording started — the first frame is not the
beginning of the movement, only the beginning of the recording.
The opening frame matches the source framing, but it is a moving frame,
not a still one.

MOTIVATION:
The shot opens looking like ordinary footage and immediately does
something no handheld camera could do. The camera does not creep away —
it commits and goes from the first frame.

CAMERA:
Camera begins at the original position at 12 o'clock, at eye level,
holding the source framing, already pulling away.
It pulls back and arcs at the same time, swinging from 12 o'clock toward
3 o'clock while climbing to a height well above the subject's head,
tilting down to hold them in frame as it rises. The subject stays
off-centre throughout, never perfectly centred.
It ends fifteen metres or more away, high and wide, the subject a small
figure in a frame dominated by the space around them, everything in deep
focus.

REVEAL:
The scale itself is the reveal. As the camera retreats, the true size of
the location arrives in layers — first the subject's whole body, then
the ground and the objects near them, then the far walls, the ceiling
height and the empty distance on all sides. Never cut to the wide; let
it arrive.

TIMING — the move is front-loaded:
First third — the fastest and most aggressive part of the entire move,
at full speed from the opening frame, strongest motion blur here.
Middle third — the speed carries through with momentum, still clearly
travelling.
Final third — easing down but never stopping, still in motion at the
last frame.

FAILURE — this specific shot has failed if:
Any static or near-static frame appears at the start of the clip. If the
first half-second contains no camera movement, the shot has failed.
The scale change happens by zooming instead of travelling, the camera
floats or hovers, the wide frame is reached before the halfway point, or
the camera overshoots and corrects at the end.
```

---

## بعد ما تجيبلي الفيديو (المرحلة 3)
ابعتلي الفيديو الناتج من المرحلتين (الأساسي + حركة الكاميرا)، وأنا هعمل عليه:
- تعليق صوتي/كابشنز متزامنة بالعربي بنفس أسلوب باقي فيديوهات ISO Order
- الهوية البصرية (Grade/Vignette/EndCard) عبر Remotion
- نشر على المنصات الأربعة (يوتيوب، انستجرام، فيسبوك، تيك توك)
