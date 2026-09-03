.PHONY: install dev test lint migrate revision seed check-workflows docker

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
