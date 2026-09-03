"""Refuse a Dify workflow that would leak one tenant's knowledge to another.

Tenant isolation on a shared knowledge base is enforced by a setting inside the
workflow, not by a database constraint. One careless edit in the Dify canvas
removes it, and nothing fails loudly — retrieval simply starts returning
everyone's documents.

So treat the workflow like code: export the app's DSL, commit it, and run this
in CI.

    python -m scripts.check_workflow_dsl workflows/*.yml

Exit code 1 means do not deploy.
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path
from typing import Any

try:
    import yaml
except ModuleNotFoundError:  # pragma: no cover - dependency hint
    print("PyYAML is required: pip install pyyaml", file=sys.stderr)
    raise SystemExit(2) from None

RETRIEVAL_NODE = "knowledge-retrieval"
# The value must resolve from the request rather than being pinned to a
# literal, which is what makes one workflow safe for every tenant.
REQUIRED_VALUE = "{{#sys.user_id#}}"


def _iter_nodes(doc: Any):
    graph = (doc or {}).get("workflow", {}).get("graph", {})
    for node in graph.get("nodes") or []:
        data = node.get("data") or {}
        yield node.get("id", "?"), data


def check_file(path: Path, field_name: str) -> list[str]:
    try:
        doc = yaml.safe_load(path.read_text(encoding="utf-8"))
    except Exception as exc:
        return [f"{path}: could not be parsed ({exc})"]

    problems: list[str] = []
    retrieval_nodes = [(nid, data) for nid, data in _iter_nodes(doc) if data.get("type") == RETRIEVAL_NODE]

    if not retrieval_nodes:
        # No knowledge retrieval means no knowledge to leak.
        return []

    for node_id, data in retrieval_nodes:
        label = data.get("title") or node_id
        mode = data.get("metadata_filtering_mode", "disabled")

        if mode != "manual":
            problems.append(
                f"{path}: node '{label}' has metadata_filtering_mode='{mode}'. "
                "Every tenant would retrieve every document. Set it to 'manual'."
            )
            continue

        conditions = (data.get("metadata_filtering_conditions") or {}).get("conditions") or []
        matching = [c for c in conditions if c.get("name") == field_name]

        if not matching:
            problems.append(
                f"{path}: node '{label}' filters on {[c.get('name') for c in conditions]} "
                f"but not on '{field_name}'. Tenant isolation is not applied."
            )
            continue

        for condition in matching:
            value = condition.get("value")
            if value != REQUIRED_VALUE:
                problems.append(
                    f"{path}: node '{label}' matches '{field_name}' against {value!r}. "
                    f"It must be {REQUIRED_VALUE!r} so the tenant comes from the request."
                )
            if condition.get("comparison_operator") not in ("is", "="):
                problems.append(
                    f"{path}: node '{label}' uses comparison "
                    f"'{condition.get('comparison_operator')}' on '{field_name}'. "
                    "Only an exact match isolates tenants; 'contains' matches other tenants' ids."
                )

    return problems


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("paths", nargs="+", type=Path)
    parser.add_argument("--field", default="tenant_id", help="metadata field carrying the tenant id")
    args = parser.parse_args()

    problems: list[str] = []
    checked = 0
    for path in args.paths:
        if not path.exists():
            problems.append(f"{path}: not found")
            continue
        checked += 1
        problems.extend(check_file(path, args.field))

    if problems:
        print("Tenant isolation check FAILED:\n", file=sys.stderr)
        for problem in problems:
            print(f"  - {problem}", file=sys.stderr)
        print("\nDo not deploy this workflow.", file=sys.stderr)
        return 1

    print(f"Tenant isolation check passed for {checked} workflow file(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
