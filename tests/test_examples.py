"""Integrity checks for synthetic fixtures, not an AI Surface Model validator."""

import json
from pathlib import Path
import unittest


EXAMPLES = Path(__file__).resolve().parents[1] / "examples"


def objects(value):
    """Walk fixture objects to find the provisional secret-reference field."""
    if isinstance(value, dict):
        yield value
        for child in value.values():
            yield from objects(child)
    elif isinstance(value, list):
        for child in value:
            yield from objects(child)


class ExampleTests(unittest.TestCase):
    def librechat(self):
        paths = sorted((EXAMPLES / "librechat").glob("*.json"))
        self.assertTrue(paths, "No LibreChat fixtures found")
        for path in paths:
            yield path.name, json.loads(path.read_text(encoding="utf-8"))

    def test_all_examples_parse_as_json(self):
        paths = sorted(EXAMPLES.rglob("*.json"))
        self.assertTrue(paths, "No JSON examples found")
        for path in paths:
            with self.subTest(path=str(path.relative_to(EXAMPLES))):
                json.loads(path.read_text(encoding="utf-8"))

    def test_librechat_identifiers_are_unique_within_each_description(self):
        for name, data in self.librechat():
            with self.subTest(example=name):
                entities = [data["surface"]]
                for key in ("components", "relationships", "requirements"):
                    entities.extend(data.get(key, []))
                identifiers = [entity["id"] for entity in entities]
                self.assertEqual(len(identifiers), len(set(identifiers)),
                                 "Duplicate local entity identifier")

    def test_librechat_relationship_endpoints_resolve_to_components(self):
        for name, data in self.librechat():
            components = {item["id"] for item in data["components"]}
            for relationship in data["relationships"]:
                with self.subTest(example=name, relationship=relationship["id"]):
                    self.assertIn(relationship["from"], components)
                    self.assertIn(relationship["to"], components)

    def test_librechat_secret_references_resolve_to_secret_requirements(self):
        for name, data in self.librechat():
            secrets = {item["id"] for item in data.get("requirements", [])
                       if item["kind"] == "secret"}
            for item in objects(data):
                if "clientSecretRequirement" in item:
                    reference = item["clientSecretRequirement"]
                    with self.subTest(example=name, reference=reference):
                        self.assertIn(reference, secrets)

    def test_expansion_retains_existing_surface_and_component_identities(self):
        data = dict(self.librechat())
        minimal, expanded = data["minimal.json"], data["expanded.json"]
        self.assertEqual(minimal["surface"]["id"], expanded["surface"]["id"])
        original = {item["id"] for item in minimal["components"]}
        detailed = {item["id"] for item in expanded["components"]}
        self.assertTrue(original <= detailed,
                        "Expansion replaced an existing component identity")
