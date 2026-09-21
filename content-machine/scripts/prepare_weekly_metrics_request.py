#!/usr/bin/env python3
"""Stage 7a — Optimization Loop, metrics request prep.

Platform analytics (views, retention, shares, likes) can only be pulled by
live tool calls inside an agent session (Composio's Instagram/YouTube/
Facebook insight tools, or NexLev) — a standalone script has no credentials
of its own. So this script does the part that IS deterministic: scan the
client's queues for everything posted during the target week and produce a
flat "what needs metrics" list. An agent session (or later, a UI backend
with its own API credentials) fills in the numbers and hands the result to
record_weekly_metrics.py.

Usage:
    python3 prepare_weekly_metrics_request.py <client_id> [--week YYYY-MM-DD]

Output:
    clients/<client_id>/performance/<week-id>-metrics-needed.json
"""
from __future__ import annotations

import argparse
import sys
from datetime import date, timedelta
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib.common import (  # noqa: E402
    client_dir, load_client_config, load_json, save_json,
    iso_week_id, week_start, today_iso,
)


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("client_id")
    ap.add_argument("--week", type=str, default=None,
                     help="Any date (YYYY-MM-DD) inside the target week. Defaults to last completed week.")
    args = ap.parse_args()

    if args.week:
        anchor = date.fromisoformat(args.week)
    else:
        anchor = week_start(date.today()) - timedelta(days=1)  # a day into last week

    monday = week_start(anchor)
    sunday = monday + timedelta(days=6)
    week_id = iso_week_id(monday)

    config = load_client_config(args.client_id)
    cdir = client_dir(args.client_id)

    needed = []
    for platform_name, pconf in config["platforms"].items():
        if not pconf.get("enabled"):
            continue
        qpath = cdir / pconf["queue_file"]
        if not qpath.exists():
            continue
        for entry in load_json(qpath):
            if entry.get("status") != "posted":
                continue
            posted_date = entry.get("posted_at", "")[:10]
            if not posted_date or not (monday.isoformat() <= posted_date <= sunday.isoformat()):
                continue
            needed.append({
                "slot_id": entry["id"],
                "platform": platform_name,
                "platform_post_id": entry.get("platform_post_id") or entry.get("video_id")
                                     or entry.get("media_id") or entry.get("publish_id"),
                "topic": entry.get("topic"),
                "persona": entry.get("persona"),
                "hook": entry.get("hook"),
                "posted_at": entry.get("posted_at"),
                "metrics": None,  # agent fills: {"views":.., "likes":.., "shares":.., "saves":.., "retention_pct":..}
            })

    out = {
        "client_id": args.client_id,
        "week_id": week_id,
        "week_start": monday.isoformat(),
        "week_end": sunday.isoformat(),
        "prepared_at": today_iso(),
        "item_count": len(needed),
        "items": needed,
    }
    out_path = cdir / "performance" / f"{week_id}-metrics-needed.json"
    save_json(out_path, out)
    print(f"[{args.client_id}] {week_id}: {len(needed)} posted items need metrics -> {out_path}")
    if needed:
        print("Next: an agent session pulls metrics via platform insight tools, fills in "
              "each item's 'metrics' field, saves as "
              f"performance/{week_id}-metrics-collected.json, then run record_weekly_metrics.py.")


if __name__ == "__main__":
    main()
