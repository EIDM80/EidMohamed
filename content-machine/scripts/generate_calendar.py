#!/usr/bin/env python3
"""Stage 4+6 — Content Calendar & Queue Generator.

Reads a client's config.json (topics, personas, hooks, platforms, content-type
mix) plus its learnings.json (accumulated performance scores from previous
weeks), and produces:

  clients/<client_id>/calendar/<week-id>.json   — the planning record
  clients/<client_id>/queues/<platform>.json    — appended "pending" slots,
                                                   ready for the existing
                                                   daily publishing routine
                                                   to pick up per-platform.

Usage:
    python3 generate_calendar.py <client_id> [--week YYYY-MM-DD] [--weeks N]

`--week` is any date inside the target ISO week (defaults to next Monday).
`--weeks N` generates N consecutive weeks in one run (default 1).

This script is deliberately dependency-free (stdlib only) so a future UI
backend can shell out to it directly, or port generate_week() as-is.
"""
from __future__ import annotations

import argparse
import sys
from datetime import date, timedelta
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib.common import (  # noqa: E402
    client_dir, load_client_config, load_learnings, load_routing,
    save_json, iso_week_id, week_start, weighted_choice, today_iso,
)


def generate_week(client_id: str, week_monday: date) -> dict:
    config = load_client_config(client_id)
    learnings = load_learnings(client_id)
    routing = load_routing(config)

    topics = config["topics"]
    personas = config["personas"]
    hooks = config["hooks"]
    content_mix = config["content_type_mix"]
    content_types = list(content_mix.keys())
    content_weights = list(content_mix.values())

    week_id = iso_week_id(week_monday)
    slots = []
    queue_additions: dict[str, list[dict]] = {}

    import random  # local import: keep top-level module import list minimal

    platform_items = [
        (name, pconf) for name, pconf in config["platforms"].items()
        if pconf.get("enabled")
    ]

    for day_offset in range(7):
        slot_date = week_monday + timedelta(days=day_offset)
        for platform_name, pconf in platform_items:
            posts_today = pconf.get("posts_per_day", 1)
            for n in range(posts_today):
                topic = weighted_choice(topics, learnings.get("topics", {}))
                persona = weighted_choice(personas, learnings.get("personas", {}))
                hook = weighted_choice(hooks, learnings.get("hooks", {}))
                content_type = random.choices(content_types, weights=content_weights, k=1)[0]
                engine_info = routing.get(content_type, {})

                slot_id = f"{client_id}-{week_id}-{platform_name}-{slot_date.isoformat()}-{n+1:02d}"
                slot = {
                    "slot_id": slot_id,
                    "date": slot_date.isoformat(),
                    "platform": platform_name,
                    "topic": topic["id"],
                    "persona": persona["id"],
                    "hook": hook["id"],
                    "content_type": content_type,
                    "engine": engine_info.get("engine"),
                    "status": "planned",
                    "source_video_url": None,
                    "remotion_edit_url": None,
                    "caption": None,
                    "platform_post_id": None,
                    "posted_at": None,
                }
                slots.append(slot)
                queue_additions.setdefault(platform_name, []).append({
                    "id": slot_id,
                    "status": "pending",
                    "date": slot_date.isoformat(),
                    "topic": topic["id"],
                    "persona": persona["id"],
                    "hook": hook["id"],
                    "content_type": content_type,
                    "engine": engine_info.get("engine"),
                    "notes": engine_info.get("notes_ar", ""),
                })

    calendar_doc = {
        "client_id": client_id,
        "week_id": week_id,
        "week_start": week_monday.isoformat(),
        "generated_at": today_iso(),
        "slot_count": len(slots),
        "slots": slots,
    }
    save_json(client_dir(client_id) / "calendar" / f"{week_id}.json", calendar_doc)

    cdir = client_dir(client_id)
    for platform_name, new_items in queue_additions.items():
        qpath = cdir / config["platforms"][platform_name]["queue_file"]
        existing = []
        if qpath.exists():
            from lib.common import load_json
            existing = load_json(qpath)
        existing.extend(new_items)
        save_json(qpath, existing)

    return calendar_doc


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("client_id")
    ap.add_argument("--week", type=str, default=None,
                     help="Any date (YYYY-MM-DD) inside the target ISO week. Defaults to next Monday.")
    ap.add_argument("--weeks", type=int, default=1, help="Generate N consecutive weeks.")
    args = ap.parse_args()

    if args.week:
        anchor = date.fromisoformat(args.week)
    else:
        today = date.today()
        anchor = today + timedelta(days=(7 - today.isoweekday() + 1) % 7 or 7)

    monday = week_start(anchor)
    for i in range(args.weeks):
        doc = generate_week(args.client_id, monday + timedelta(weeks=i))
        print(f"[{args.client_id}] {doc['week_id']}: {doc['slot_count']} slots -> "
              f"calendar/{doc['week_id']}.json + queues updated")


if __name__ == "__main__":
    main()
