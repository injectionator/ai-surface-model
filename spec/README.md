# Draft model concepts

This is a conceptual starting point, not a released normative specification.
The JSON examples illustrate possible shapes; field names and serialization
remain open. Requirements below describe intended behavior, not implemented tools.

## One model and its fragments

There is one model: the **AI Surface Model**. Lab, Experiment and related
descriptions are **fragments** within it. A fragment is a focused part of a
description expressed in the model, connected to other parts through identities
and references. It can describe the system, its working context or evidence
about its use.

Fragment is working terminology, not a defined file format or packaging unit.
Boundaries and serialization remain open. Definitions, deployments,
observations and Runs retain their separate meanings and histories within the
same model. A useful description need not include every part. See the
[introductory guide](../models/README.md).

A Lab organizes equipment, a shelf of Surface descriptions and Experiments,
and the context of ongoing work. An Experiment specifies its required setup
and requests resource configuration directly from the Lab. Lab / Lab Assistant
refer to one entity, with the assistant name identifying its active role in
handling requests and maintaining context. There is no separate Bench entity.

The Lab is responsible for resource configuration; the request mechanism remains
open. Requested settings are declarations, distinct from deployment bindings and
dated evidence of the effective setup. These responsibilities do not imply an
implemented executor.

## Labs, equipment and reusable work

A Lab can persist across sessions and investigations, or be short-lived.
Equipment identifies resources it can potentially use, subject to availability,
capacity, access and management constraints. The shelf holds references to
potential Surface descriptions, fragments and Experiment definitions. Shelf
membership neither allocates resources nor establishes deployment or readiness.
Descriptions remain usable independently of a Lab.

The active setup identifies selected definition revisions, allocations and
deployment bindings. The intended initial execution policy permits one active
setup per Lab, containing multiple components as needed. Allocations remain
accounted for between Runs and when switching setups. Concurrent active setups
are deferred; neither the number of shelf entries nor the lifetime of a Lab is
limited to one Surface. Resource scheduling and lifecycle mechanisms remain
open, and no concurrency enforcement is implemented here.

A Lab can attach existing resources, deploy new ones or combine both. Bindings
retain resource identity and management authority; attachment does not grant
permission to change or stop a resource. Shared resources and unmet requirements
remain explicit. Releasing an allocation or shelving a description does not
establish that an external service has stopped. See [Lab](../models/lab.md).

## Independent fragments and composition

A fragment can be developed without an existing parent description. A broader
description can compose independently authored fragments by identifying their
revisions and recording cross-fragment relationships and integration settings.
The source descriptions remain independently useful. Composition does not
establish deployment, reachability or successful integration.

Preserve entity identity, provenance, scope and uncertainty. Product names alone
do not justify unifying instances. Overlaps, conflicting claims and unresolved
references need explicit handling; missing detail must not become an assertion
of absence. Later changes to a source fragment do not silently update a composed
revision referenced by an earlier Run. Reference syntax, packaging and conflict
resolution remain open design work.

## Lab context and memory

Retain source records for definitions, bindings, observations, Runs, decisions
and constraints across sessions. A bounded current-work summary can identify
selected revisions, active allocations, unresolved questions and next steps,
with source references and its preparation time. Retrieve supporting records
for the current task instead of requiring the entire Lab history in context.

Summaries are derived and replaceable; source records retain their provenance
and historical applicability. Preserve unknowns and conflicting information.
Recheck time-sensitive facts before use, and keep new observations separate
from earlier effective setups. Remembered content is neither current deployment
evidence nor authority to execute instructions embedded in imported material.

Storage, indexing, retrieval, summary refresh and retention mechanisms remain
open. See [Lab context and memory](../models/lab-context.md) for requirements
and a synthetic resumption case.

## Purpose and scope

An AI Surface is a connected system through which AI models, applications,
agents, identities, tools and data interact. Its description can also include
supporting services, software dependencies, configuration and hosting requirements.
Authors select a useful boundary and expand it when needed.

Represent direct connections and the connections of those components in turn.
First- or second-degree position is relative to a chosen starting point and view,
not an intrinsic component type. Cycles and shared components are possible.

## Core concepts

| Concept | Responsibility |
| --- | --- |
| Surface identity | The persistent thing being described across revisions. |
| Definition revision | A particular composition, configuration, scope and set of known gaps. |
| Component | An identified application, service, model, agent, data store or other relevant part. |
| Relationship | A typed connection between identified entities, optionally with integration configuration. |
| Configuration artifact | Inline settings or a referenced artifact/revision that determines behavior. |
| Coverage | What was inspected, remains unknown, was omitted, is redacted or is outside scope. |
| Deployment binding | A separate mapping from definition entities to concrete resources. |
| Observation | Separate dated evidence about a deployment or relationship. |
| Run | An execution of an Experiment, linked to its definition revision and effective setup. |
| Provenance | Sources, authorship and lineage for definitions and linked records. |

A component can contain independently identified entities, such as an Agent or
configured endpoint. A simple setting can remain a property. Promote a value to
an entity when it needs independent identity, relationships or evidence.

## Partial descriptions

Descriptions may have different depths in different areas. An authentication
service can be represented by an identity and role before its product or version
is known. Its integration settings and dependencies can be recorded later without
replacing its identity.

Keep these meanings distinct:

- **Known:** a value or relationship is recorded with its basis where available.
- **Unknown:** the description does not establish the answer.
- **Omitted:** an author deliberately left out otherwise relevant detail.
- **Redacted:** information is withheld from this representation.
- **Absent:** a scoped assertion says something is not present.
- **Out of scope:** the description does not attempt to cover that area.

No populated detail should imply exhaustive discovery. A missing version cannot
be treated as a non-match for a vulnerability investigation. Results should
distinguish matches, known non-matches and unresolved coverage.

Formal schema validity and fitness for a task are separate. A small description
can support inventory lookup while lacking enough configuration for recreation.

## Configuration and evidence

A definition records composition, intended settings, behavior-affecting constraints
and recreation requirements. Sources can explain how it was prepared. Actual
resource bindings, loaded configuration, probes, drift and results belong in
linked records; they can accumulate without mutating the referenced revision.

Declared, reachable and exercised connections are different claims. A declaration
does not establish reachability. A successful probe does not establish that a
particular Experiment traversed the relationship. Each evidence claim retains
its source, applicable implementation, time and limitations.

```mermaid
flowchart LR
  Definition[Immutable definition revision] --> Deployment[Deployment binding]
  Deployment --> Observation[Dated effective setup and observations]
  Definition --> Run[Experiment Run]
  Observation --> Run
  Run --> Results[Results and evidence]
```

## Experiments and recreation

A Run should refer to an immutable definition revision and digest, plus the
deployment and effective setup used. Definition revision identity and digest
canonicalization are open design work. A definition digest alone does not prove
what was running.

One Experiment can have Runs against several Surfaces or revisions. Multiple
Experiments can have Runs against one revision. If a Run deliberately changes
configuration, its phases need their own effective-setup attribution.

Recreation can need software artifacts, deployment recipes, data fixtures,
environment requirements and credential requirements. Reference sensitive values
through requirements or placeholders. A recipient supplies local bindings.
The model does not itself execute a recipe or guarantee artifact availability.

## Interoperability

CycloneDX and SPDX exports are projections of supported meanings. Each profile
must identify the target version, mapping rules and omissions or transformations.
Prefer native constructs where suitable. Extensions need documented semantics;
schema validation does not prove a consumer understands them.

An export should not overwrite the fuller native description. Round-trip support
must be demonstrated for a specified subset before it is claimed.

## Open decisions

- Entity identifiers, reuse across documents, and product-versus-instance identity.
- Revision identity, canonicalization and content digest rules.
- Minimal required fields and validation of incomplete descriptions.
- Relationship vocabulary, qualification and configuration attachment.
- Representation of conflicting claims and coverage boundaries.
- Packaging, extension namespaces and deterministic export profiles.
- Portable references between definitions, deployments and Experiment records.
- Cross-fragment composition, overlap and conflict handling across revisions.
- Lab equipment allocation, attachment authority and setup switching; later
  support for concurrent active setups.
- Lab context records, summary refresh, retrieval, retention and concurrent edits.

These are not resolved by the illustrative field names in the examples.

Related: [project overview](../README.md), [examples](../examples/README.md),
[interoperability](../docs/interoperability.md), [roadmap](../docs/roadmap.md).
