#!/usr/bin/env python3
"""Stage 7b — Optimization Loop, score + learn.

Takes a metrics-collected file (the output of prepare_weekly_metrics_request.py
with each item's "metrics" field filled in by an agent session or a UI
backend) and:

  1. Computes a normalized composite score per item (0-1).
  2. Updates clients/<client_id>/learnings.json — an exponential moving
     average per topic/persona/hook, so generate_calendar.py's weighted
     sampling gradually favors what performs and backs off what doesn't.
  3. Writes clients/<client_id>/performance/<week-id>-report.json with
     winners/losers, ready to hand to a future UI.

Usage:
    python3 record_weekly_metrics.py <client_id> --week YYYY-MM-DD
        [--in performance/2026-W34-metrics-collected.json]

Default input path: performance/<week-id>-metrics-collected.json
"""
from __future__ import annotations

import argparse
import sys
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib.common import (  # noqa: E402
    client_dir, load_json, save_json, load_learnings, save_learnings,
    iso_week_id, week_start, today_iso,
)

METRIC_WEIGHTS = {
    "views": 0.25,
    "likes": 0.15,
    "shares": 0.25,
    "saves": 0.20,
    "retention_pct": 0.15,
}
EMA_ALPHA = 0.3  # how much this week's result shifts the running score
BASELINE_SCORE = 1.0  # neutral score for topics/personas/hooks with no history yet


def normalize(values: list[float]) -> list[float]:
    lo, hi = min(values), max(values)
    if hi - lo < 1e-9:
        return [0.5 for _ in values]
    return [(v - lo) / (hi - lo) for v in values]


def score_items(items: list[dict]) -> dict[str, float]:
    present_metrics = [m for m in METRIC_WEIGHTS if any(
        (it.get("metrics") or {}).get(m) is not None for it in items)]
    if not present_metrics:
        return {it["slot_id"]: 0.5 for it in items}

    normalized_cols: dict[str, list[float]] = {}
    for m in present_metrics:
        raw = [float((it.get("metrics") or {}).get(m) or 0) for it in items]
        normalized_cols[m] = normalize(raw)

    total_weight = sum(METRIC_WEIGHTS[m] for m in present_metrics)
    scores = {}
    for i, it in enumerate(items):
        s = sum(normalized_cols[m][i] * METRIC_WEIGHTS[m] for m in present_metrics) / total_weight
        scores[it["slot_id"]] = round(s, 4)
    return scores


def update_dimension(learnings_bucket: dict, key: str, score: float) -> None:
    prev = learnings_bucket.get(key, BASELINE_SCORE)
    learnings_bucket[key] = round(prev * (1 - EMA_ALPHA) + score * EMA_ALPHA, 4)


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("client_id")
    ap.add_argument("--week", type=str, required=True, help="Any date (YYYY-MM-DD) inside the target week.")
    ap.add_argument("--in", dest="in_path", type=str, default=None,
                     help="Path to the metrics-collected JSON. Defaults to performance/<week-id>-metrics-collected.json")
    args = ap.parse_args()

    monday = week_start(date.fromisoformat(args.week))
    week_id = iso_week_id(monday)
    cdir = client_dir(args.client_id)

    in_path = Path(args.in_path) if args.in_path else cdir / "performance" / f"{week_id}-metrics-collected.json"
    if not in_path.exists():
        raise SystemExit(
            f"Missing {in_path}. Run prepare_weekly_metrics_request.py first, fill in each "
            f"item's 'metrics' field, save it as that filename, then re-run this script."
        )

    data = load_json(in_path)
    items = data["items"]
    missing = [it["slot_id"] for it in items if not it.get("metrics")]
    if missing:
        print(f"WARNING: {len(missing)} item(s) have no metrics filled in yet, scoring the rest: "
              f"{missing[:5]}{'...' if len(missing) > 5 else ''}")
        items = [it for it in items if it.get("metrics")]
    if not items:
        raise SystemExit("No scored items — nothing to learn from this week.")

    scores = score_items(items)
    for it in items:
        it["score"] = scores[it["slot_id"]]

    learnings = load_learnings(args.client_id)
    learnings.setdefault("topics", {})
    learnings.setdefault("personas", {})
    learnings.setdefault("hooks", {})
    for it in items:
        if it.get("topic"):
            update_dimension(learnings["topics"], it["topic"], it["score"])
        if it.get("persona"):
            update_dimension(learnings["personas"], it["persona"], it["score"])
        if it.get("hook"):
            update_dimension(learnings["hooks"], it["hook"], it["score"])
    learnings["updated_at"] = today_iso()
    save_learnings(args.client_id, learnings)

    ranked = sorted(items, key=lambda it: it["score"], reverse=True)
    winners = ranked[:3]
    losers = ranked[-3:] if len(ranked) > 3 else []

    report = {
        "client_id": args.client_id,
        "week_id": week_id,
        "generated_at": today_iso(),
        "scored_item_count": len(items),
        "winners": winners,
        "losers": losers,
        "learnings_snapshot": learnings,
        "recommendation": (
            "زوّد الإنتاج على المواضيع/البرسونات/الهوكس اللي درجاتها فوق 1.0 في learnings_snapshot، "
            "وقلّل أو استبدل اللي تحت 0.8 — التغيير هيبان في الأسابيع الجاية تلقائيًا لأن "
            "generate_calendar.py بيقرأ نفس الملف."
        ),
    }
    out_path = cdir / "performance" / f"{week_id}-report.json"
    save_json(out_path, report)
    print(f"[{args.client_id}] {week_id}: scored {len(items)} items -> {out_path}")
    print(f"  top: {[ (w['slot_id'], w['score']) for w in winners ]}")


if __name__ == "__main__":
    main()
