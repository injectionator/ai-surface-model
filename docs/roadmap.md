# Draft roadmap

The first milestone is an explainable model demonstrated on concrete questions.
This list is a research and design sequence, not a release commitment.

1. Develop representative cases: inference, external authentication, tools and
   downstream data, with both minimal and expanded descriptions.
2. Settle entity identity, relationships, partial knowledge and configuration
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

## Lab design work

The Lab has equipment, a shelf of reusable Surface descriptions and Experiments,
and context that can persist across sessions. Experiments request resources
directly from the Lab. Develop concrete cases for:

- Independently authored fragments later composed into an integration, retaining
  identities, selected revisions, provenance and unresolved requirements.
- Attaching existing resources, deploying new ones and combining both, including
  the authority to configure or stop each resource.
- One active setup with several components and many shelved descriptions;
  switching setups while accounting for retained allocations and shared services.
- Resuming an investigation from durable records, a source-linked summary and
  selectively retrieved context, while detecting stale assumptions and preserving
  the effective setup of earlier Runs.

The initial execution policy is one active setup per Lab. Concurrent active
setups and their scheduling are deferred. The model does not limit a Lab to one
saved Surface or require its lifetime to match a deployment. Memory storage,
retrieval and summary-management mechanisms remain to be designed; this
repository implements none of those behaviors yet.

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
