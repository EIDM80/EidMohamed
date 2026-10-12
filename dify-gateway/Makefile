.PHONY: install dev test migrate revision seed check-workflows docker prod backup secrets

VENV ?= .venv
PY   := $(VENV)/bin/python
PIP  := $(VENV)/bin/pip

install:
	python3 -m venv $(VENV)
	$(PIP) install --upgrade pip
	$(PIP) install -r requirements-dev.txt

dev:
	$(VENV)/bin/uvicorn app.main:app --reload --port 8000

test:
	$(PY) -m pytest -q

# Apply migrations. Run this on every deploy, before starting the service.
migrate:
	$(VENV)/bin/alembic upgrade head

# Create a migration after changing app/models.py. Always read the result.
revision:
	$(VENV)/bin/alembic revision --autogenerate -m "$(m)"

seed:
	$(PY) -m scripts.seed --name "$(name)" --email "$(email)" --app-key "$(key)"

# Refuse to ship a workflow that would leak one tenant's knowledge to another.
check-workflows:
	$(PY) -m scripts.check_workflow_dsl workflows/*.yml

docker:
	docker compose up -d --build

# Production overlay: Dify on an internal network, secrets as files.
prod:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

backup:
	./scripts/backup.sh $(dest)

# Generate the three secret files the production overlay mounts.
secrets:
	mkdir -p secrets
	test -s secrets/gateway_secret_key || $(PY) -c "import secrets;print(secrets.token_urlsafe(48))" > secrets/gateway_secret_key
	test -s secrets/admin_api_key || $(PY) -c "import secrets;print(secrets.token_urlsafe(32))" > secrets/admin_api_key
	test -s secrets/billing_webhook_secret || echo "paste-your-provider-webhook-secret" > secrets/billing_webhook_secret
	chmod 600 secrets/*
	@echo "secrets/ written. Keep it out of git (already in .gitignore)."
