"""Shared helpers for content-machine scripts. Stdlib only — no pip install
required, so these scripts run anywhere and a future UI backend can shell
out to them (or port this module directly) without a dependency chain.
"""
from __future__ import annotations

import json
import random
from datetime import date, datetime, timedelta
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]  # content-machine/
CLIENTS_DIR = REPO_ROOT / "clients"
ROUTING_FILE = REPO_ROOT / "routing" / "engine-routing.json"


def load_json(path: Path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def save_json(path: Path, data) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")


def client_dir(client_id: str) -> Path:
    d = CLIENTS_DIR / client_id
    if not d.exists():
        raise SystemExit(
            f"Unknown client '{client_id}'. Run new_client.py first, or check "
            f"content-machine/clients/ for the correct slug."
        )
    return d


def load_client_config(client_id: str) -> dict:
    return load_json(client_dir(client_id) / "config.json")


def load_routing(client_config: dict) -> dict:
    routing = load_json(ROUTING_FILE)
    overrides = client_config.get("routing_overrides", {})
    for content_type, override in overrides.items():
        routing.setdefault(content_type, {}).update(override)
    return routing


def load_learnings(client_id: str) -> dict:
    path = client_dir(client_id) / "learnings.json"
    if not path.exists():
        return {"topics": {}, "personas": {}, "hooks": {}, "updated_at": None}
    return load_json(path)


def save_learnings(client_id: str, learnings: dict) -> None:
    save_json(client_dir(client_id) / "learnings.json", learnings)


def iso_week_id(d: date) -> str:
    y, w, _ = d.isocalendar()
    return f"{y}-W{w:02d}"


def week_start(d: date) -> date:
    """Monday of the ISO week containing d."""
    return d - timedelta(days=d.isoweekday() - 1)


def weighted_choice(items: list[dict], score_lookup: dict, id_key: str = "id",
                     baseline: float = 1.0) -> dict:
    """Pick one item from `items`, biasing toward higher scores in
    `score_lookup` (keyed by item[id_key]). Falls back to uniform random
    when there's no score history yet — the calendar should still vary
    even before any learnings exist.
    """
    if not items:
        raise SystemExit("Cannot choose from an empty list — check client config.")
    weights = [max(score_lookup.get(it[id_key], baseline), 0.05) for it in items]
    return random.choices(items, weights=weights, k=1)[0]


def today_iso() -> str:
    return datetime.now().strftime("%Y-%m-%d")
