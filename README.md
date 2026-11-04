# AI Surface Model

An open model for describing the connected components, configuration and
relationships of an AI system, at the level of detail available or useful.

> [!NOTE]
> **Early conceptual draft.** This repository contains concepts, synthetic
> examples and research questions. There is no released schema, validator,
> exporter or deployment engine yet.

## Why this is needed

An AI model's name does not tell you which services an application calls, how
authentication is configured, or which setup produced an Experiment result.
Answering those questions can mean piecing together diagrams, configuration files
and notes, often with incomplete information.

The AI Surface Model aims to make that context explicit and shareable. Start with
the components and connections you know, record the gaps, and add detail as it
becomes available. A saved description should help someone investigate a system,
understand a result or assess what they would need to recreate a setup.

## Who it is for

| If you… | The model is intended to help you… |
| --- | --- |
| Build or operate AI applications | Describe services, integration settings and dependencies across a setup. |
| Investigate security or component changes | Find affected components while keeping unknown versions and coverage gaps visible. |
| Run experiments or maintain a Lab | Connect results to the definition revision and effective setup actually used. |
| Build inventory, provenance or analysis tools | Explore exchange of a defined subset with explicit mapping losses. |

It is usable independently of Injectionator or any particular Lab product.
Security investigation, reproducibility and configuration understanding are all
part of its scope.

## What it describes

An **AI Surface** is the connected system being described: applications, agents,
AI models, inference services, authentication, tools, data stores and supporting
infrastructure, together with their configuration and relationships.

There is one model: the **AI Surface Model**. Lab, Experiment and related
descriptions are **fragments** within it. Fragment is a working term for a focused
part of a description; its boundaries and serialization remain open.

A Lab has equipment and a shelf of reusable Surface descriptions and Experiments.
It can persist across investigations, preparing a requested setup by attaching
existing resources or deploying new ones. Source records and a bounded
[Lab context summary](models/lab-context.md) support work across sessions.

Definitions stay separate from deployments, dated observations and Experiment
Runs. A Run refers to the definition revision and effective setup used, so later
discovery does not silently change what an earlier result refers to.

## Start at the depth you need

The levels are reading paths, not prerequisites. Start at 100 for an introduction,
or jump to the examples, design questions or contribution guidance.

| Level | Start here | What you will find |
| --- | --- | --- |
| **100 · Understand** | [Model overview](models/ai-surface-model.md), then [Labs and Experiments](models/README.md) | The purpose, vocabulary and a walkthrough of one investigation. |
| **200 · Explore** | [Synthetic examples](examples/README.md) | Compare descriptions at two depths; identify known facts, gaps and recreation requirements. |
| **300 · Examine** | [Draft concepts](spec/README.md) and [interoperability research](docs/interoperability.md) | Identity, evidence, partial knowledge, open decisions and proposed mappings to other formats. |
| **400 · Contribute and extend** | [Propose a change or extension](CONTRIBUTING.md#propose-a-change-or-extension) | Turn a use case into a proposal, example or bounded mapping, then follow the contribution workflow. |

The [roadmap](docs/roadmap.md) describes the intended sequence of work and the
evidence needed before a release.

## See progressive detail

Both [LibreChat examples](examples/README.md) describe a fictional authentication
path. These JSON excerpts show the **same component** at two levels of detail.
Field names are illustrative, not a released schema.

In the [minimal description](examples/librechat/minimal.json), its role is known
but its product is not:

```json
{
  "id": "component:authentication",
  "kind": "service",
  "role": "authentication",
  "product": { "status": "unknown" }
}
```

In the [expanded description](examples/librechat/expanded.json), the same identity
has more detail:

```json
{
  "id": "component:authentication",
  "kind": "service",
  "role": "authentication",
  "product": {
    "status": "known",
    "name": "Keycloak",
    "basis": "synthetic example"
  }
}
```

The expanded file also describes an OpenID Connect relationship and a supporting
database. Some settings remain unknown or omitted; inference and other application
dependencies remain unexplored. Neither example establishes a running integration
or enough information for recreation. They are alternative synthetic descriptions,
not a revision history or evidence of a deployment change.

Detail can grow along any connection, with shared components and cycles. Depth is
relative to the starting point and has no fixed two-hop ceiling. Missing detail
does not establish absence.

## Working with existing standards and tools

We intend to exchange supported subsets through CycloneDX and SPDX, using native
constructs where suitable and reporting omitted or transformed information.
Compatibility and round-trip fidelity still need evidence from named versions and
consuming tools. See the [interoperability research](docs/interoperability.md) for
mapping questions and related work, including Prismor and sbom-tools.

## Contribute or cite

Start with an issue, use a dedicated branch and open a linked draft PR; see
[Contributing](CONTRIBUTING.md) for proposals, checks and the full workflow.

Use [CITATION.cff](CITATION.cff) for attribution and include the exact commit URL
you used when citing this evolving draft.

## Licence

Machine-readable model assets, schemas, examples, code snippets and tooling use
[Apache-2.0](LICENSE). Written specification and documentation use
[CC-BY-4.0](LICENSE-DOCS). See [LICENSING.md](LICENSING.md) for the material split
and attribution requirements.

Commercial and proprietary reuse are welcome under those terms. Users retain
control of the licensing and publication of their own Surface descriptions and
Experiment data. Third-party material retains its applicable terms.

This is an independent Injectionator project, with no claimed OWASP affiliation
or endorsement.
