"""The CI check that stops an unsafe workflow from reaching production.

Isolation on a shared knowledge base lives in workflow configuration, so it can
be removed by an edit in the Dify canvas with nothing failing. These cases
describe exactly which edits the guard must catch.
"""

from __future__ import annotations

import textwrap

import pytest

from scripts.check_workflow_dsl import check_file


def _write(tmp_path, body: str):
    path = tmp_path / "app.yml"
    path.write_text(textwrap.dedent(body), encoding="utf-8")
    return path


SAFE = """
    workflow:
      graph:
        nodes:
          - id: n1
            data:
              type: knowledge-retrieval
              title: Retrieve
              metadata_filtering_mode: manual
              metadata_filtering_conditions:
                logical_operator: and
                conditions:
                  - name: tenant_id
                    comparison_operator: is
                    value: '{{#sys.user_id#}}'
"""


def test_correctly_filtered_workflow_passes(tmp_path):
    assert check_file(_write(tmp_path, SAFE), "tenant_id") == []


def test_workflow_without_knowledge_retrieval_passes(tmp_path):
    body = """
    workflow:
      graph:
        nodes:
          - id: n1
            data:
              type: llm
              title: Answer
    """
    assert check_file(_write(tmp_path, body), "tenant_id") == []


def test_disabled_filtering_is_caught(tmp_path):
    body = SAFE.replace("metadata_filtering_mode: manual", "metadata_filtering_mode: disabled")
    problems = check_file(_write(tmp_path, body), "tenant_id")
    assert problems and "every document" in problems[0]


def test_hardcoded_tenant_value_is_caught(tmp_path):
    """A literal works in testing and leaks in production — the worst failure mode."""
    body = SAFE.replace("'{{#sys.user_id#}}'", "'acme-corp'")
    problems = check_file(_write(tmp_path, body), "tenant_id")
    assert problems and "sys.user_id" in problems[0]


def test_filtering_on_the_wrong_field_is_caught(tmp_path):
    body = SAFE.replace("name: tenant_id", "name: category")
    problems = check_file(_write(tmp_path, body), "tenant_id")
    assert problems and "not applied" in problems[0]


def test_loose_comparison_operator_is_caught(tmp_path):
    """'contains' would match any tenant id sharing a prefix."""
    body = SAFE.replace("comparison_operator: is", "comparison_operator: contains")
    problems = check_file(_write(tmp_path, body), "tenant_id")
    assert problems and "Only an exact match" in problems[0]


@pytest.mark.parametrize("field", ["tenant_id", "org_id"])
def test_the_field_name_is_configurable(tmp_path, field):
    body = SAFE.replace("name: tenant_id", f"name: {field}")
    assert check_file(_write(tmp_path, body), field) == []
