# Casting the actor

Turn the user's actor photo into a generated, rights-clean, photoreal still that seeds the
video. Two jobs: **reconstruct the look**, and **hit the right age**.

## Raw Camera Casting Realism

The target is an unretouched camera file — a casting test photo — not a polished AI render.
Realism comes from **physical evidence**, not from the word "photorealistic".

**Open with:** "A straight-out-of-camera close portrait photo of…" / "An unretouched
casting-style camera photo of…" / "A plain natural-light documentary close-up photo of…"
Never "A beautiful", "A cinematic", "A stunning", "An ultra-detailed".

**Include, concretely:** visible pores on cheeks and nose; fine vellus hair along jaw and
upper lip; uneven tone with mild redness around nose and eyelids; real lip surface (vertical
lines, slight dryness, muted colour, small shine); small blemishes/moles/freckles, sparingly
and varied; oil shine on the T-zone; individual eyebrow hairs, strays, imperfect hairline,
flyaways; **natural asymmetry** (one eyelid different, uneven mouth corners); ordinary light
(soft window / overcast / plain room daylight); a plain out-of-focus background; real camera
behaviour — shallow DoF, sharp eye plane, gentle falloff, slight edge softness, imperfect
white balance, faint grain in the shadows.

**Ban list:** masterpiece, best quality, 8k, ultra-detailed, stunning, flawless, gorgeous,
poreless, glass skin, porcelain, doll face, CGI, plastic, influencer face, beauty-retouched,
glamour lighting, perfect symmetry, teal-orange grade, readable text, logos, watermarks.

**Texture must attach to form.** Pores curve with the cheek. Freckles vary. Hair emerges from
believable roots. Lip lines follow lip volume. Never a uniform pore overlay stamped on a face.

---

## Age-texture decoupling — the trap

**The most important thing in this file.**

Realism vocabulary is *age-loaded*. "Fine lines", "creases", "chapped", "dryness", "sallow",
"uneven tone" all co-occur with 35–45-year-olds in captioned training data. So when you crank
texture for realism you are not asking for *more texture* — you are asking for *older*,
because that's the only place the model has seen that much described texture.

Observed: a woman described as early-20s, written with full realism vocabulary, came back
reading late-30s. The words that did it were **"chapped vertical lip lines"** (a volume-loss
marker) and **"sallower yellow-tan"** (desaturation reads aged).

**Writing "22 years old" does not fix it.** The age token carries almost no weight against a
paragraph of aging physiology. The fix is the *right kind* of texture.

Young skin is not smoother — it is **oilier, more porous, more blemished, more translucent**.
It simply has no *static* lines.

| Reads YOUNG | Reads OLD |
|---|---|
| Large visible pores, oily T-zone, hard specular shine | Matte, dry, powdery |
| Active blemish, healing spot, faint post-acne mark | Sun spots, lentigines, mottling |
| Creases that exist **only because the brow is raised**, vanishing at rest | Etched resting lines |
| Full under-eye fat pad, faint bluish vascular tint | Hollowing, crepey lid, thin skin |
| Plump wet lips, no rest lines | Vertical lip lines, thinning vermilion |
| Taut over the cheekbone, no nasolabial fold at rest | Nasolabial depth, jowl softening |
| Strong subsurface translucency, blood flush, hot pink cheeks | Grey-yellow desaturation |
| Dense pale peach fuzz | (fuzz decreases with age) |

**You never say "young". You say oily, poreful, blemished, plump, taut, dynamic-only creasing —
and the age falls out of the physiology.**

For an expressive or shocked pose, spell out that the creases are dynamic:
> *"The forehead creases are purely dynamic — they exist only because the brows are lifted and
> would disappear completely if her face relaxed; the skin between them is otherwise smooth,
> taut and unlined, with no etched resting wrinkles anywhere."*

**Second-order lever.** If it still drifts old, the *framing* words are doing it —
`casting-style`, `documentary`, `unretouched test photo` all collocate with older subjects.
Swap them for **`front-camera selfie`** / **`phone screenshot`** and the whole distribution
pulls younger before you touch a single skin descriptor.

**For older brackets,** invert the table deliberately — that's when `fine lines`, `crepey`,
`nasolabial` and `volume loss` are the *correct* vocabulary rather than an accident.

---

## Working from the supplied photo

1. Extract only **non-sensitive, visible** attributes: crop, face angle, expression, lighting
   direction, hair shape and colour, garment coverage, silhouette, background character.
2. **Do not identify the person.** Do not claim the image depicts anyone specific.
3. Preserve the pose and expression, but describe it as **physical mechanics** — sclera ring
   visible above and below the iris, three stacked forehead creases, mid-exhale open mouth —
   not as an emotion. Emotion words produce *performance*; mechanics produce a caught moment.
4. Generate: `gpt-image-2`, `aspect_ratio: "9_16"`, `quality: "high"`, `image_count: 2`. User picks.

**Identity is not preserved by text alone.** Bone structure and exact face shape are gone by
construction — usually fine, and safer, for a generated actor. If the user needs *that* face,
the photo has to go into the `references` array of the image call. Say so rather than
pretending text will get there.

---

## Addenda from production

### `references` clones the person — casting is text-to-image

The closing note above says the photo "has to go into the `references` array" if the user needs
*that* face. **Read that as a warning, not a default.** Passing the photo in `references` returns
a 1:1 likeness of a real human being — a rights problem and a casting problem. **Step 4 above
names no `references` array, and that omission is load-bearing.** The photo is a casting brief you
read with your eyes.

And **never** use `maxfusion_banana_clone` for casting: it reverse-prompts the source into text you
never see and blends yours into it, so two prompts fight and pushing harder makes it worse.

### `gpt-image-2` is not a suggestion

Four rounds of prompt tuning on `nanobanana-pro` produced plastic, evenly-poreless skin.
`gpt-image-2` fixed it on the first try with the **same prompt**. **Change the model before you
change the prompt.**

### Acne is an age lever, not free realism

Active blemishes and post-acne marks sit on the **YOUNG** side of the age-texture table. Crank
acne for "realism" and you actively pull the actor toward *teenager*. The lever is **distribution,
not amount**:

| reads TEENAGE | reads ADULT |
|---|---|
| forehead, T-zone, upper cheeks | jawline, chin, lower cheek near the mandible |
| dense, uniform, inflammatory | sparse: a few active spots, several faded flat marks |
| rounded cheek, soft jaw | defined mandible and jaw angle, lengthened lower face |

It must stay **incidental** — if it is the first thing you notice, you have made a skincare ad.
Pair it with adult bone structure explicitly, or it drags the whole face young on its own.

### Describe an ACCIDENTAL photo, not an intended one

"Texture must attach to form" has a twin: **composition must attach to circumstance.**
Too-perfect framing and too-perfect skin come from the same mistake — describing an image someone
*made* rather than one that merely *happened*. A one-handed selfie is badly taken:

> *canted several degrees off level · the subject pushed off-centre and low · dead space on one
> side · the top of the head clipped by the frame edge · the focus slightly missed, so the face is
> a touch soft while the wall behind is crisper · nothing about the composition deliberate*

**A level horizon and a centred face are things only a machine composes.**

### Emotional intensity: freshness, not amount

Stacking seven crying signals (swollen lids, puffy lower lids, reddened whites, wet film both
eyes, a full tear track, flush on nose *and* cheeks *and* eyelids) reads as a breakdown, not a
person. Overcorrecting removes it entirely. **The dial is not "how much has she cried" but "how
recently."** One tear, *now*, still moving. Eyes glassy this second, not damaged from an hour ago.

### The ban list is words you DON'T WRITE — not words you negate

Appending *"avoid: swollen eyes, puffy eyelids, weeping"* still puts those words in the prompt,
and the model resolves the tension by scrubbing the emotion entirely. **Omit them. Do not negate
them.** Keep the aesthetic ban list (masterpiece, 8k, flawless, poreless, CGI…) out of the prompt
text as well — it is a list of things *you* never type.

### Check your own output, and move one dial at a time

If the generated actor does not read as the age or the state you asked for, **regenerate before
taking them into video** — a mis-cast actor is baked into every clip downstream. And when the
operator gives a correction, **change one variable**, look, then change the next. A whole-paragraph
rewrite in response to a one-word note overshoots every time.

### Look at the photo with a tool

Crop it, enlarge it, and `view` it before you describe it. Asserting a camera angle from memory —
and then asserting a *different* one, more confidently, after being corrected — is
indistinguishable from lying. **When corrected, re-open the image. Do not re-reason.**
