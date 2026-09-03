"""Knowledge base isolation.

Same stakes as test_isolation.py: a failure here means one customer can read or
destroy another's files.
"""

from __future__ import annotations

import json

import httpx
import respx

from app.db import SessionLocal
from app.models import Document

DATASET = "ds-shared"
BASE = "http://dify.test/v1"


def _mock_upload_chain(document_id: str = "doc-1") -> None:
    respx.get(f"{BASE}/datasets/{DATASET}/metadata").mock(
        return_value=httpx.Response(200, json={"doc_metadata": [{"id": "field-1", "name": "tenant_id"}]})
    )
    respx.post(f"{BASE}/datasets/{DATASET}/document/create-by-file").mock(
        return_value=httpx.Response(200, json={"document": {"id": document_id}, "batch": "batch-1"})
    )
    respx.post(f"{BASE}/datasets/{DATASET}/documents/metadata").mock(return_value=httpx.Response(200, json={}))


def _upload(client, token, name="policy.pdf"):
    return client.post(
        "/api/documents",
        files={"file": (name, b"some content", "application/pdf")},
        headers={"Authorization": f"Bearer {token}"},
    )


@respx.mock
def test_upload_tags_the_document_with_the_callers_tenant(client, make_tenant, login):
    _mock_upload_chain()
    tag_route = respx.post(f"{BASE}/datasets/{DATASET}/documents/metadata")
    acme = make_tenant("Acme", email="a@acme.io", dataset_id=DATASET)

    resp = _upload(client, login("a@acme.io"))
    assert resp.status_code == 202, resp.text

    sent = json.loads(tag_route.calls.last.request.content)
    operation = sent["operation_data"][0]
    assert operation["document_id"] == "doc-1"
    assert operation["metadata_list"][0] == {
        "id": "field-1",
        "name": "tenant_id",
        "value": acme["tenant_id"],
    }


@respx.mock
def test_untagged_document_is_deleted_rather_than_left_readable(client, make_tenant, login):
    """If tagging fails the file has no tenant, so every tenant would see it."""
    _mock_upload_chain()
    respx.post(f"{BASE}/datasets/{DATASET}/documents/metadata").mock(return_value=httpx.Response(500))
    delete_route = respx.delete(f"{BASE}/datasets/{DATASET}/documents/doc-1").mock(
        return_value=httpx.Response(204)
    )
    make_tenant("Acme", email="a@acme.io", dataset_id=DATASET)

    resp = _upload(client, login("a@acme.io"))

    assert resp.status_code == 502
    assert delete_route.called, "an untagged document must not survive the request"
    with SessionLocal() as db:
        assert db.query(Document).count() == 0


@respx.mock
def test_listing_shows_only_your_own_documents(client, make_tenant, login):
    _mock_upload_chain(document_id="doc-acme")
    make_tenant("Acme", email="a@acme.io", dataset_id=DATASET)
    make_tenant("Globex", email="g@globex.io", dataset_id=DATASET, app_key="app-globex")

    _upload(client, login("a@acme.io"), name="acme-secret.pdf")

    listing = client.get("/api/documents", headers={"Authorization": f"Bearer {login('g@globex.io')}"})
    assert listing.status_code == 200
    assert listing.json()["total"] == 0
    assert listing.json()["documents"] == []

    own = client.get("/api/documents", headers={"Authorization": f"Bearer {login('a@acme.io')}"})
    assert own.json()["total"] == 1
    assert own.json()["documents"][0]["name"] == "acme-secret.pdf"


@respx.mock
def test_deleting_another_tenants_document_is_a_404_and_deletes_nothing(client, make_tenant, login):
    _mock_upload_chain(document_id="doc-acme")
    delete_route = respx.delete(f"{BASE}/datasets/{DATASET}/documents/doc-acme").mock(
        return_value=httpx.Response(204)
    )
    make_tenant("Acme", email="a@acme.io", dataset_id=DATASET)
    make_tenant("Globex", email="g@globex.io", dataset_id=DATASET, app_key="app-globex")

    created = _upload(client, login("a@acme.io"))
    doc_id = created.json()["id"]

    attack = client.delete(
        f"/api/documents/{doc_id}",
        headers={"Authorization": f"Bearer {login('g@globex.io')}"},
    )

    assert attack.status_code == 404
    assert not delete_route.called, "Dify must never be asked to delete another tenant's document"
    with SessionLocal() as db:
        assert db.query(Document).count() == 1


@respx.mock
def test_plan_document_limit_is_enforced(client, make_tenant, login):
    _mock_upload_chain()
    make_tenant("Acme", email="a@acme.io", dataset_id=DATASET, plan="free")
    token = login("a@acme.io")

    # The free plan allows 20 documents; fake 20 already present.
    with SessionLocal() as db:
        tenant_id = db.query(Document).first()
        from app.models import Tenant

        tid = db.query(Tenant).first().id
        for i in range(20):
            db.add(
                Document(
                    tenant_id=tid,
                    dataset_id=DATASET,
                    dify_document_id=f"d{i}",
                    name=f"f{i}.pdf",
                )
            )
        db.commit()

    resp = _upload(client, token)
    assert resp.status_code == 402


def test_upload_without_a_knowledge_base_is_refused(client, make_tenant, login):
    make_tenant("Acme", email="a@acme.io")  # no dataset_id
    resp = _upload(client, login("a@acme.io"))
    assert resp.status_code == 409


def test_empty_file_is_refused(client, make_tenant, login):
    make_tenant("Acme", email="a@acme.io", dataset_id=DATASET)
    resp = client.post(
        "/api/documents",
        files={"file": ("empty.pdf", b"", "application/pdf")},
        headers={"Authorization": f"Bearer {login('a@acme.io')}"},
    )
    assert resp.status_code == 400
