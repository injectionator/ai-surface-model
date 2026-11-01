# Draft roadmap

The first milestone is an explainable model with examples of a real n8r-labs project.
The [n8r-labs use case](n8r-labs-use-case.md) describes that consumer's approach,
with a synthetic sharing scenario and explicit limits on its current capabilities.

This list is a research and design sequence, not a release commitment.

1. Explore common, representative cases: inference, external authentication, tools and
   downstream data, with both minimal and expanded descriptions.
2. Develop entity identity, relationships, partial knowledge and configuration
   semantics before freezing field names.
3. Define a small native serialization and validation rules that accept useful
   partial descriptions.
4. Demonstrate offline component/version investigation, including unresolved
   coverage and historical versus current deployment scope.
5. Define immutable revisions and links to effective setup, provenance and Runs;
   exercise both one-to-many Experiment/Surface patterns.
6. Implement a bounded CycloneDX export with explicit loss accounting, then
   evaluate SPDX and named consumer tools using the same facts.
7. Exercise recreation from a shareable example and record required artifacts,
   local bindings and remaining gaps.

## Evidence needed before a release

- Examples have an identified schema version and validate against it.
- Queries give useful answers without hiding incomplete knowledge.
- Immutable references preserve what an Experiment result refers to.
- Exported documents validate and work with named, versioned consumers.
- Recreation claims have been attempted in an independent environment.

Current status: conceptual documentation and synthetic examples only. No released
schema, query engine, exporter, consumer trial or recreation proof is included.

Related: [draft concepts](../spec/README.md),
[interoperability](interoperability.md), [contributing](../CONTRIBUTING.md).
