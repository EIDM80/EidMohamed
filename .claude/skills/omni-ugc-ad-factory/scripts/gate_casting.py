#!/usr/bin/env python3
"""Casting gate — validates and ASSEMBLES the actor-still prompt.

The agent never sends a hand-written casting prompt. It writes a structured
casting.json (reverse-prompted from the user's reference photo), this gate
validates every section against the lexicons, and on PASS it assembles the
approved prompt text. The generation call uses the assembled file verbatim.

Usage:
  python gate_casting.py --input casting.json --workdir ad1/

casting.json fields (all required, all plain prose):
  age                  "20s" | "40s" | "50s"
  subject              who is in the frame: build, hair, garment, expression AS MECHANICS
  physiology           skin/texture description — must satisfy the age lexicon
  framing_angle        camera angle + crop, reverse-prompted from the reference
  shoot_style          what kind of shot this is (casual self-shot, mirror, etc.)
  lighting             direction + source + hardness + how it sits on the skin
  color_grade          what the camera did to color — terms from the grading glossary
  background           the plain background, reverse-prompted
  composition_accidents  the imperfections that make it an accidental photo

Exit 0 = PASS (approved_casting.txt written). Exit 1 = FAIL with reasons.
"""
import argparse, hashlib, json, re, sys
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent / "data"

REQUIRED_FIELDS = ["age", "subject", "physiology", "framing_angle", "shoot_style",
                   "lighting", "color_grade", "background", "composition_accidents"]

LIGHT_DIRECTION = ["from the left", "from the right", "from one side", "from above",
                   "from below", "from behind", "front-on", "window", "overcast",
                   "side light", "sidelight", "off to her", "off to his"]
LIGHT_QUALITY = ["soft", "diffused", "hard", "harsh", "gentle", "flat", "even"]

ACCIDENT_MARKERS = ["canted", "off level", "off-level", "off-centre", "off-center",
                    "clipped", "dead space", "missed", "a touch soft", "not deliberate",
                    "low in the frame", "uncorrected"]

NEGATION_TOKENS = ["avoid", "don't", "do not", "never", "without any", "no "]


def load(p):
    return json.loads(Path(p).read_text())


def find_terms(text, terms):
    # Word-boundary at the start, open-ended at the tail so 'crease' matches
    # 'creases' but 'etched' does not match 'stretched'.
    t = text.lower()
    return [term for term in terms if re.search(r"\b" + re.escape(term), t)]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--input", required=True)
    ap.add_argument("--workdir", required=True)
    a = ap.parse_args()

    lex = load(DATA / "age_lexicon.json")
    grading = load(DATA / "color_grading_glossary.json")
    spec = load(a.input)
    work = Path(a.workdir); work.mkdir(parents=True, exist_ok=True)

    errors, warnings = [], []

    for f in REQUIRED_FIELDS:
        if not str(spec.get(f, "")).strip():
            errors.append(f"missing or empty field: {f}")
    if errors:
        report(errors, warnings); sys.exit(1)

    age = spec["age"]
    if age not in lex["brackets"]:
        report([f"age must be one of {list(lex['brackets'])}, got '{age}'"], warnings); sys.exit(1)
    bracket = lex["brackets"][age]

    full_text = " ".join(str(spec[f]) for f in REQUIRED_FIELDS[1:]).lower()

    # 1. Global banned vocabulary — words you never type.
    for hit in find_terms(full_text, lex["global_banned"]):
        errors.append(f"global banned term present: '{hit}'")

    # 2. Device nouns — naming the device puts it in the image.
    scrubbed = full_text
    for phrase in lex["device_allowed_phrases"]:
        scrubbed = scrubbed.replace(phrase, "")
    for hit in find_terms(scrubbed, lex["device_banned"]):
        errors.append(f"device word present (it will end up IN the image): '{hit}'")

    # 3. Age lexicon: enough right-age physiology, zero wrong-age physiology.
    phys = (spec["physiology"] + " " + spec["subject"]).lower()
    required_hits = find_terms(phys, bracket["required_any"])
    if len(required_hits) < bracket["min_required"]:
        errors.append(
            f"age {age}: only {len(required_hits)} required physiology terms found "
            f"({required_hits}); need >= {bracket['min_required']}. "
            f"Pull from: {bracket['required_any']}")
    for hit in find_terms(phys, bracket["banned"]):
        errors.append(f"age {age}: banned (wrong-age) term present: '{hit}'")

    # 4. Lighting must state direction AND quality.
    light = spec["lighting"].lower()
    if not find_terms(light, LIGHT_DIRECTION):
        errors.append("lighting: no direction stated (which side / window / overcast ...)")
    if not find_terms(light, LIGHT_QUALITY):
        errors.append("lighting: no quality stated (soft / hard / diffused ...)")

    # 5. Color grade must draw from the glossary, >= min categories.
    grade = spec["color_grade"].lower()
    cats_hit = [c for c, terms in grading["categories"].items() if find_terms(grade, terms)]
    if len(cats_hit) < grading["min_categories"]:
        errors.append(
            f"color_grade: terms from only {len(cats_hit)} glossary categories "
            f"({cats_hit}); need >= {grading['min_categories']}. Use the glossary verbatim.")

    # 6. Composition must be accidental, not composed.
    comp = spec["composition_accidents"].lower()
    acc = find_terms(comp, ACCIDENT_MARKERS)
    if len(acc) < 2:
        errors.append(
            f"composition_accidents: only {len(acc)} accidental-photo markers ({acc}); "
            "need >= 2 (canted / off-centre / clipped / dead space / missed focus ...)")

    # 7. Negations render the thing you named.
    for tok in NEGATION_TOKENS:
        if tok in full_text:
            warnings.append(f"negation '{tok.strip()}' found — omit the concept, don't negate it")

    if errors:
        report(errors, warnings); sys.exit(1)

    # ---- assemble the approved prompt ----
    prompt = " ".join([
        f"{bracket['opening']} {spec['subject'].strip().rstrip('.')}.",
        spec["physiology"].strip().rstrip(".") + ".",
        spec["framing_angle"].strip().rstrip(".") + ".",
        spec["shoot_style"].strip().rstrip(".") + ".",
        spec["lighting"].strip().rstrip(".") + ".",
        spec["color_grade"].strip().rstrip(".") + ".",
        spec["background"].strip().rstrip(".") + ".",
        spec["composition_accidents"].strip().rstrip(".") + ".",
    ])
    out = work / "approved_casting.txt"
    out.write_text(prompt)
    digest = hashlib.sha256(prompt.encode()).hexdigest()[:16]
    (work / "approved_casting.sha").write_text(digest)
    report([], warnings)
    print(f"PASS  age={age}  required-terms={required_hits}  grade-categories={cats_hit}")
    print(f"approved: {out}  sha={digest}")
    print("RULE: the maxfusion_generate_image call must use this file's content verbatim.")


def report(errors, warnings):
    for w in warnings:
        print(f"WARN  {w}")
    for e in errors:
        print(f"FAIL  {e}")


if __name__ == "__main__":
    main()
