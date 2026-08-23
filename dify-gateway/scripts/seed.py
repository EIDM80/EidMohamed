"""Create a demo tenant so you can exercise the gateway end to end.

    python -m scripts.seed --name "Acme" --email you@example.com --app-key app-xxxx

Prints the tenant id — use it as the metadata value on that tenant's documents
in Dify, so the retrieval filter matches only their content.
"""

from __future__ import annotations

import argparse
import secrets

from app.db import Base, SessionLocal, engine
from app.models import DifyBinding, Quota, Tenant, User
from app.security import hash_password
from app.usage import current_period


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--name", required=True)
    parser.add_argument("--email", required=True)
    parser.add_argument("--app-key", required=True, help="Dify app API key (app-...)")
    parser.add_argument("--password", default=None)
    parser.add_argument("--plan", default="pro")
    parser.add_argument("--token-limit", type=int, default=1_000_000)
    parser.add_argument("--purpose", default="default")
    args = parser.parse_args()

    password = args.password or secrets.token_urlsafe(12)

    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        tenant = Tenant(name=args.name, plan=args.plan)
        db.add(tenant)
        db.flush()

        db.add(User(tenant_id=tenant.id, email=args.email, password_hash=hash_password(password)))
        db.add(
            DifyBinding(
                tenant_id=tenant.id,
                purpose=args.purpose,
                app_key=args.app_key,
                metadata_value=tenant.id,
            )
        )
        db.add(
            Quota(
                tenant_id=tenant.id,
                monthly_token_limit=args.token_limit,
                period=current_period(),
                tokens_used=0,
            )
        )
        db.commit()
        tenant_id = tenant.id

    print(f"tenant_id : {tenant_id}")
    print(f"email     : {args.email}")
    print(f"password  : {password}")
    print()
    print("Next: tag this tenant's documents in Dify with metadata")
    print(f'  tenant_id = "{tenant_id}"')
    print("and set the knowledge retrieval filter to match {{#sys.user_id#}}.")


if __name__ == "__main__":
    main()
