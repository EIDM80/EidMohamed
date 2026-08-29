#!/usr/bin/env python3
"""Omni gate — validates and ASSEMBLES the video prompt for one clip.

The agent never sends a hand-written Omni prompt. It writes clipN.json, this
gate validates it (beat states, glossary behaviors, voice completeness, the
clip-2 seed-premise rules), and on PASS assembles the approved prompt text.
The generation call uses the assembled file verbatim.

Usage:
  python gate_omni.py --input clip1.json --workdir ad1/
  python gate_omni.py --input clip2.json --workdir ad1/

clipN.json fields:
  clip       1 | 2
  voice      the voice-characteristics block (written once; must be identical for clip 2)
  delivery   prose describing her state and how the chosen behaviors surface
  style      clip 1 only: the style-world paragraph (empty string for lane zero).
             clip 2: MUST be "" — the seed frame carries the look.
  beats      [{start, end, line, state, behaviors: [ids], visual}]  (visual "" for lane zero)
  closing    how the shot lands: must physically settle (hold / lock / still / settles)

Exit 0 = PASS (approved_clipN.txt written). Exit 1 = FAIL with reasons.
"""
import argparse, hashlib, json, re, sys
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent / "data"

CLIP2_PREMISE = (
    "THE REFERENCE IMAGE IS THE EXACT FIRST FRAME OF THIS VIDEO. The video opens on "
    "precisely that frame and motion continues forward from that instant, as one unbroken "
    "continuation of a shot already in progress. Every visual fact is already fixed by that "
    "frame and carries on unchanged for the entire clip."
)

CLIP1_IDENTITY = (
    "The person in the reference image is the speaker: the face, bone structure, skin "
    "texture, hair, wardrobe, framing and light stay exactly as in the reference image "
    "from the first frame to the last."
)

# Clip 2 may not re-describe what the seed pixels already carry.
VISUAL_FACT_NOUNS = ["face", "hair", "wardrobe", "outfit", "shirt", "wall", "background",
                     "camera angle", "crop", "framing", "skin", "complexion", "bone structure",
                     "lighting", "lit", "room", "her look", "appearance", "makeup"]

# Lazy identity shorthand that destroys the video.
LAZY_IDENTITY = ["same girl", "same woman", "same person", "same guy", "same man",
                 "as before", "as in clip 1", "like the previous"]

# Choreography = a behavior pinned to a word or timestamp. States only.
BEHAVIOR_WORDS = ["creak", "pause", "inhale", "exhale", "breath", "blink", "swallow",
                  "smack", "sigh", "stumble", "sniff"]
CUE_PATTERNS = [r"on the word\s+\S+", r"at 0?0:\d\d"]

# Negated visual instructions render the thing named.
NEG_TOKENS = ["no ", "avoid", "don't", "do not", "never", "without"]
NEG_VISUAL_NOUNS = ["caption", "text", "subtitle", "logo", "letter", "word on screen",
                    "graphic", "watermark", "overlay"]

TEXT_RISK = ["reading", "sign", "label", "caption", "written", "letters", "numeral", "digit"]

LANDING_WORDS = ["hold", "holds", "lock", "locked", "still", "settles", "settled", "stops"]


def load(p):
    return json.loads(Path(p).read_text())


def hits(text, terms):
    # Word-boundary at the start, open-ended tail ('mutter' matches 'muttered',
    # but 'lit' does not match 'quality').
    t = text.lower()
    return [x for x in terms if re.search(r"\b" + re.escape(x), t)]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--input", required=True)
    ap.add_argument("--workdir", required=True)
    a = ap.parse_args()

    gl = load(DATA / "delivery_glossary.json")
    vs = load(DATA / "voice_spec.json")
    spec = load(a.input)
    work = Path(a.workdir); work.mkdir(parents=True, exist_ok=True)

    errors, warnings = [], []
    clip = int(spec.get("clip", 0))
    if clip not in (1, 2):
        errors.append("clip must be 1 or 2")

    voice = str(spec.get("voice", "")).strip()
    delivery = str(spec.get("delivery", "")).strip()
    style = str(spec.get("style", "")).strip()
    framing_hold = str(spec.get("framing_hold", "")).strip()
    beats = spec.get("beats", [])
    closing = str(spec.get("closing", "")).strip()

    # Omni's prior is a centred, level talking head — it quietly "fixes" hard
    # angles over ten seconds. framing_hold states positively what STAYS TRUE
    # for the whole clip. Clip 1 only; clip 2's framing lives in the seed pixels.
    if clip == 2 and framing_hold:
        errors.append("clip 2 framing_hold must be empty — the seed frame carries the framing")
    if clip == 1 and framing_hold and not hits(framing_hold.lower(), ["stays", "keeps", "remains", "holds"]):
        errors.append("framing_hold must state what STAYS true (stays/keeps/remains/holds) — "
                      "a prohibition renders the thing you named")

    if not voice: errors.append("voice block missing — Omni defaults to monotone without it")
    if not delivery: errors.append("delivery block missing")
    if not beats: errors.append("beats missing")
    if not closing: errors.append("closing missing — the speech may trail off, the camera never does")
    if errors:
        report(errors, warnings); sys.exit(1)

    behavior_by_id = {b["id"]: b for b in gl["behaviors"]}
    states = set(gl["states"])

    # ---- voice completeness ----
    vlow = voice.lower()
    cats = [c for c, terms in vs["categories"].items() if hits(vlow, terms)]
    if len(cats) < vs["min_required"]:
        errors.append(f"voice: only {len(cats)} of {len(vs['categories'])} categories evidenced "
                      f"({cats}); need >= {vs['min_required']} — pitch, texture, pacing, volume, "
                      f"terminal pitch, accent mechanics")
    if not hits(vlow, vs["city_hint"]["cities"]):
        warnings.append("voice: no city named — a country cannot hold an accent, a city can")

    # ---- voice identical across clips ----
    vhash = hashlib.sha256(voice.encode()).hexdigest()
    lock = work / "voice.lock"
    if clip == 1:
        lock.write_text(vhash)
    else:
        if not lock.exists():
            errors.append("voice.lock not found — gate clip 1 first")
        elif lock.read_text().strip() != vhash:
            errors.append("voice block differs from clip 1 — it must be pasted verbatim, "
                          "rewriting it is how the actor changes person mid-ad")

    # ---- no emotion words in voice or delivery ----
    for hit in hits(vlow + " " + delivery.lower(), vs["banned_emotion_words"]):
        errors.append(f"emotion word '{hit}' — write the body, not the feeling")

    # ---- no choreography: behavior words pinned to cues ----
    for sent in re.split(r"[.;\n]", delivery):
        s = sent.lower()
        if any(b in s for b in BEHAVIOR_WORDS):
            for pat in CUE_PATTERNS:
                if re.search(pat, s):
                    errors.append(f"choreographed cue (behavior pinned to word/timestamp): '{sent.strip()[:80]}'")

    # ---- beats: states, behaviors, budgets, word count, timeline ----
    used, categories_used, word_count = [], set(), 0
    prev_end = 0.0
    for i, b in enumerate(beats):
        line = str(b.get("line", "")).strip()
        word_count += len(line.split())
        st = b.get("state", "")
        if st not in states:
            errors.append(f"beat {i}: state '{st}' not in glossary states {sorted(states)}")
        if float(b.get("start", -1)) != prev_end:
            errors.append(f"beat {i}: starts at {b.get('start')} but previous ended at {prev_end} — no gaps")
        prev_end = float(b.get("end", prev_end))
        for bid in b.get("behaviors", []):
            beh = behavior_by_id.get(bid)
            if not beh:
                errors.append(f"beat {i}: unknown behavior id '{bid}'"); continue
            if st in states and st not in beh["states"]:
                errors.append(f"beat {i}: behavior '{bid}' does not fit state '{st}' "
                              f"(fits: {beh['states']})")
            used.append(bid); categories_used.add(beh["category"])
            if not hits(delivery.lower() + " " + " ".join(str(x.get('visual','')) for x in beats).lower(),
                        [m.lower() for m in beh["match_any"]]):
                errors.append(f"behavior '{bid}' declared but its phrasing never appears in the "
                              f"delivery text (expected one of: {beh['match_any']})")
    if prev_end > 10.001:
        errors.append(f"timeline ends at {prev_end}s — a clip is 10s max")

    budget = gl["budget"]
    if not (budget["min_per_clip"] <= len(used) <= budget["max_per_clip"]):
        errors.append(f"{len(used)} behaviors used; budget is {budget['min_per_clip']}–{budget['max_per_clip']} per clip")
    if len(categories_used) < budget["min_categories_per_clip"]:
        errors.append(f"behaviors span only {len(categories_used)} categories; need >= {budget['min_categories_per_clip']}")
    for bid in set(used):
        cap = behavior_by_id[bid].get("max_per_clip", 99)
        if used.count(bid) > cap:
            errors.append(f"behavior '{bid}' used {used.count(bid)}x; max {cap} per clip")

    if not (16 <= word_count <= 32):
        errors.append(f"script is {word_count} words for a 10s clip; target 22–28, hard bounds 16–32")

    # ---- ad-smell: closers land, real speech doesn't ----
    last_line = str(beats[-1].get("line", "")).strip().lower()
    if re.search(r"(that's it|it works|game changer|life[- ]changing|you need this|trust me)\W*$", last_line):
        errors.append(f"last line lands like ad copy: '{last_line}' — real speech ends on something unimportant")
    full_script = " ".join(str(b.get("line", "")) for b in beats)
    if "—" in full_script or "–" in full_script:
        errors.append("em/en dash in script — Omni performs it as a theatrical pause; use periods and commas")

    # ---- clip-2 rules ----
    if clip == 2:
        if style:
            errors.append("clip 2 style must be empty — the seed frame carries the look; "
                          "a text route to a face is a route Omni takes")
        # Scan stage directions only — the SPOKEN lines may say anything
        # ("my skin looks awake" is her sentence, not a re-description).
        body = " ".join([delivery, closing] + [str(b.get("visual", "")) for b in beats]).lower()
        for hit in hits(body, LAZY_IDENTITY):
            errors.append(f"lazy identity shorthand '{hit}' — forbidden; the premise line handles identity")
        for hit in hits(body, VISUAL_FACT_NOUNS):
            errors.append(f"clip 2 re-describes a visual fact the seed already carries: '{hit}'")

    # ---- negated visual instructions ----
    everything = " ".join([voice, delivery, style, framing_hold, closing] + [str(b.get("visual", "")) for b in beats]).lower()
    for tok in NEG_TOKENS:
        for m in re.finditer(re.escape(tok), everything):
            window = everything[m.start():m.start() + 60]
            if hits(window, NEG_VISUAL_NOUNS):
                errors.append(f"negated visual instruction: '...{window.strip()[:50]}...' — state the clean frame positively")

    # ---- text-in-frame risk in visuals ----
    for i, b in enumerate(beats):
        v = str(b.get("visual", "")).lower()
        if hits(v, TEXT_RISK) or re.search(r"\d", v):
            warnings.append(f"beat {i} visual risks hallucinated lettering: '{v[:60]}' — describe it wordless/numeral-free")

    # ---- the camera lands even if the speech doesn't ----
    if not hits(closing.lower(), LANDING_WORDS):
        errors.append("closing does not land the shot (hold/lock/still/settles) — Omni will invent an ending")
    if clip == 1 and not hits(closing.lower(), ["eyes open", "mouth closed", "still"]):
        warnings.append("clip 1 closing is the seed frame — say it is clean: still, eyes open, mouth closed")

    if errors:
        report(errors, warnings); sys.exit(1)

    # ---- assemble ----
    parts = [CLIP2_PREMISE if clip == 2 else CLIP1_IDENTITY, "", voice, "", delivery, ""]
    if clip == 1 and framing_hold:
        parts += [framing_hold, ""]
    if clip == 1 and style:
        parts += [style, ""]
    parts.append("The video follows this exact timeline, beat for beat:")
    for b in beats:
        t = f"[{fmt(b['start'])}–{fmt(b['end'])}]"
        vis = f" — {b['visual'].strip()}" if str(b.get("visual", "")).strip() else ""
        parts.append(f"{t} She says: \"{b['line'].strip()}\"{vis}")
    parts += ["", closing]
    prompt = "\n".join(parts)

    out = work / f"approved_clip{clip}.txt"
    out.write_text(prompt)
    digest = hashlib.sha256(prompt.encode()).hexdigest()[:16]
    (work / f"approved_clip{clip}.sha").write_text(digest)
    report([], warnings)
    print(f"PASS  clip={clip}  words={word_count}  behaviors={used}  voice-categories={cats}")
    print(f"approved: {out}  sha={digest}")
    print("RULE: the maxfusion_generate_video call must use this file's content verbatim.")


def fmt(x):
    return f"00:{int(round(float(x))):02d}"


def report(errors, warnings):
    for w in warnings: print(f"WARN  {w}")
    for e in errors: print(f"FAIL  {e}")


if __name__ == "__main__":
    main()
