"""Plan definitions.

The single place where "what does this plan allow" is answered. Tenant.plan
holds the key; everything else reads limits from here, so changing a plan is a
one-line edit rather than a hunt through the codebase.
"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class Plan:
    key: str
    label: str
    monthly_token_limit: int
    requests_per_minute: int
    max_documents: int
    dedicated_dataset: bool


PLANS: dict[str, Plan] = {
    "free": Plan(
        key="free",
        label="Free",
        monthly_token_limit=50_000,
        requests_per_minute=10,
        max_documents=20,
        dedicated_dataset=False,
    ),
    "pro": Plan(
        key="pro",
        label="Pro",
        monthly_token_limit=2_000_000,
        requests_per_minute=60,
        max_documents=500,
        dedicated_dataset=False,
    ),
    "enterprise": Plan(
        key="enterprise",
        label="Enterprise",
        monthly_token_limit=20_000_000,
        requests_per_minute=300,
        max_documents=10_000,
        # A knowledge base of their own: isolation at the storage layer rather
        # than in workflow configuration.
        dedicated_dataset=True,
    ),
}

DEFAULT_PLAN = "free"


def get_plan(key: str | None) -> Plan:
    return PLANS.get(key or DEFAULT_PLAN, PLANS[DEFAULT_PLAN])
