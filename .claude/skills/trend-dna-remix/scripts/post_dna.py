#!/usr/bin/env python3
"""Structural fingerprint of a social post, and an originality check for a remix.

Measures the parts of a post's DNA that can be counted (length, line rhythm,
hook size, whitespace, emoji, lists, hashtags, CTA shape) so the remix can match
them on purpose. Works for Arabic, English, and mixed posts. Stdlib only.

Usage:
  python3 post_dna.py original.txt                     # fingerprint one post
  python3 post_dna.py original.txt --json              # same, as JSON
  python3 post_dna.py original.txt --compare remix.txt # fingerprint both + originality check

Exit code 2 from --compare means the remix copies too much of the original
wording and must be rewritten before it ships.
"""

import argparse
import json
import re
import sys
import unicodedata

# Originality gate. Above either threshold the remix is a paraphrase, not a remix.
MAX_TRIGRAM_OVERLAP = 0.15
MAX_SHARED_RUN_WORDS = 6

ARABIC_RE = re.compile(r"[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]")
LATIN_RE = re.compile(r"[A-Za-z]")
WORD_RE = re.compile(r"[\w؀-ۿ']+", re.UNICODE)
HASHTAG_RE = re.compile(r"#[\w؀-ۿ_]+")
MENTION_RE = re.compile(r"@[\w؀-ۿ_.]+")
URL_RE = re.compile(r"https?://\S+")
LIST_RE = re.compile(r"^\s*(?:[-•▪►→✅✔☑❌➡️👉🔹🔸]|\d+[.)\-]|[٠-٩]+[.)\-])\s*")
QUESTION_RE = re.compile(r"[?؟]\s*$")
ARABIC_DIACRITICS_RE = re.compile(r"[ً-ٰٟ]")

CTA_PATTERNS = {
    "comment-keyword": r"(comment|اكتب|علّق|علق)\b.{0,40}(below|to get|to receive|لتحصل|وسأرسل|وأرسل)",
    "question": r"[?؟]\s*$",
    "follow": r"\b(follow|تابع|تابعني|تابعوني)\b",
    "repost": r"(repost|share this|♻️|شارك|أعد النشر)",
    "link": r"(link in (the )?(comments?|bio)|الرابط في (التعليق|التعليقات))",
    "dm": r"\b(dm me|message me|راسلني|رسالة خاصة)\b",
    "save": r"\b(save this|bookmark|احفظ)\b",
}


def is_emoji(ch):
    cp = ord(ch)
    return (
        0x1F300 <= cp <= 0x1FAFF
        or 0x2600 <= cp <= 0x27BF
        or 0x1F000 <= cp <= 0x1F2FF
        or cp in (0x2B50, 0x2B55, 0x203C, 0x2049, 0x2122, 0x2139, 0x3030, 0x303D)
    )


def normalize(text):
    text = unicodedata.normalize("NFKC", text)
    text = ARABIC_DIACRITICS_RE.sub("", text)
    text = re.sub("[إأآا]", "ا", text)
    text = text.replace("ة", "ه").replace("ى", "ي")
    return text.lower()


def words(text):
    return WORD_RE.findall(normalize(URL_RE.sub(" ", text)))


def language(text):
    ar = len(ARABIC_RE.findall(text))
    la = len(LATIN_RE.findall(text))
    total = ar + la
    if total == 0:
        return "unknown"
    share = ar / total
    if share > 0.8:
        return "arabic"
    if share < 0.2:
        return "english"
    return "mixed"


def fingerprint(text):
    raw_lines = text.splitlines()
    lines = [l for l in raw_lines if l.strip()]
    blank_lines = len(raw_lines) - len(lines)
    all_words = words(text)
    line_word_counts = [len(words(l)) for l in lines] or [0]

    # The hook is what shows before "...see more": roughly the first 2 non-empty lines.
    hook_lines = lines[:2]
    hook = " ".join(l.strip() for l in hook_lines)

    last = lines[-1].strip() if lines else ""
    tail = " ".join(lines[-3:]) if lines else ""
    cta = [name for name, pat in CTA_PATTERNS.items() if re.search(pat, tail, re.IGNORECASE | re.MULTILINE)]

    one_liners = sum(1 for c in line_word_counts if c <= 12)
    emoji = [c for c in text if is_emoji(c)]

    return {
        "language": language(text),
        "characters": len(text.strip()),
        "words": len(all_words),
        "lines_non_empty": len(lines),
        "blank_lines": blank_lines,
        "whitespace_ratio": round(blank_lines / max(len(raw_lines), 1), 2),
        "avg_words_per_line": round(sum(line_word_counts) / max(len(lines), 1), 1),
        "max_words_in_a_line": max(line_word_counts),
        "one_liner_share": round(one_liners / max(len(lines), 1), 2),
        "hook": hook[:220],
        "hook_words": len(words(hook)),
        "hook_is_question": bool(hook_lines and QUESTION_RE.search(hook_lines[0].strip())),
        "hook_has_number": bool(re.search(r"[\d٠-٩]", hook)),
        "list_items": sum(1 for l in lines if LIST_RE.match(l)),
        "emoji_count": len(emoji),
        "emoji_set": "".join(sorted(set(emoji)))[:30],
        "hashtags": HASHTAG_RE.findall(text),
        "mentions": len(MENTION_RE.findall(text)),
        "links_in_body": len(URL_RE.findall(text)),
        "questions": len(re.findall(r"[?؟]", text)),
        "last_line": last[:160],
        "cta_types": cta,
    }


def ngrams(tokens, n):
    return {tuple(tokens[i : i + n]) for i in range(len(tokens) - n + 1)}


def longest_shared_run(a, b):
    """Longest run of consecutive words that appears in both texts."""
    best = 0
    prev = [0] * (len(b) + 1)
    for i in range(1, len(a) + 1):
        cur = [0] * (len(b) + 1)
        for j in range(1, len(b) + 1):
            if a[i - 1] == b[j - 1]:
                cur[j] = prev[j - 1] + 1
                best = max(best, cur[j])
        prev = cur
    return best


def originality(original, remix):
    a, b = words(original), words(remix)
    ta, tb = ngrams(a, 3), ngrams(b, 3)
    overlap = len(ta & tb) / max(len(tb), 1)
    run = longest_shared_run(a, b)
    return {
        "trigram_overlap": round(overlap, 3),
        "longest_shared_run_words": run,
        "passes": overlap <= MAX_TRIGRAM_OVERLAP and run <= MAX_SHARED_RUN_WORDS,
        "limits": {"trigram_overlap_max": MAX_TRIGRAM_OVERLAP, "shared_run_max": MAX_SHARED_RUN_WORDS},
    }


def structure_match(fa, fb):
    """How closely the remix follows the original's countable shape (0-100)."""
    checks = []

    def ratio(x, y):
        if x == 0 and y == 0:
            return 1.0
        return min(x, y) / max(x, y)

    checks.append(ratio(fa["words"], fb["words"]))
    checks.append(ratio(fa["lines_non_empty"], fb["lines_non_empty"]))
    checks.append(1 - min(abs(fa["whitespace_ratio"] - fb["whitespace_ratio"]), 1))
    checks.append(1 - min(abs(fa["one_liner_share"] - fb["one_liner_share"]), 1))
    checks.append(ratio(fa["hook_words"], fb["hook_words"]))
    checks.append(1.0 if fa["hook_is_question"] == fb["hook_is_question"] else 0.0)
    checks.append(ratio(fa["list_items"], fb["list_items"]))
    checks.append(1.0 if set(fa["cta_types"]) == set(fb["cta_types"]) else 0.5 if set(fa["cta_types"]) & set(fb["cta_types"]) else 0.0)
    return round(100 * sum(checks) / len(checks))


def print_fp(title, fp):
    print(f"== {title}")
    for k, v in fp.items():
        print(f"  {k:22} {v}")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("original", help="text file with the trending post")
    ap.add_argument("--compare", metavar="REMIX", help="text file with the remix to check")
    ap.add_argument("--json", action="store_true", help="print JSON instead of a table")
    args = ap.parse_args()

    with open(args.original, encoding="utf-8") as f:
        original = f.read()
    fa = fingerprint(original)
    result = {"original": fa}

    if args.compare:
        with open(args.compare, encoding="utf-8") as f:
            remix = f.read()
        fb = fingerprint(remix)
        result["remix"] = fb
        result["structure_match"] = structure_match(fa, fb)
        result["originality"] = originality(original, remix)

    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print_fp("ORIGINAL", fa)
        if args.compare:
            print_fp("REMIX", result["remix"])
            o = result["originality"]
            print("== CHECK")
            print(f"  structure_match        {result['structure_match']}/100 (aim for 75+)")
            print(f"  trigram_overlap        {o['trigram_overlap']} (max {MAX_TRIGRAM_OVERLAP})")
            print(f"  longest_shared_run     {o['longest_shared_run_words']} words (max {MAX_SHARED_RUN_WORDS})")
            print(f"  originality            {'PASS' if o['passes'] else 'FAIL - rewrite the copied wording'}")

    if args.compare and not result["originality"]["passes"]:
        sys.exit(2)


if __name__ == "__main__":
    main()
