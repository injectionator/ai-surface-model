# AI Surface Model

This project defines one open model: the **AI Surface Model**. It describes
connected AI systems and their working context at the level of detail available
or useful.

Lab, Bench, Experiment and related descriptions are **fragments** within this
model. Each describes a focused part and can connect to other parts
through identities and references.

An **AI Surface** is the system being described: applications, agents, AI models,
services, tools, data and their connections. A **Surface description** records
what is known about that system within a chosen scope. The same model also
describes the context and evidence of its use through Labs,
Benches, Experiments and Runs.

Start with the [overview](README.md) to see how these fit together.
Boundaries and representation remain open.
The model is an early conceptual draft; the
[specification](../spec/README.md) sets out intended semantics and open decisions.

## A Surface description in practice

For the synthetic sign-in investigation, begin with an AI application connected
to an authentication service. The service's identity and role can be recorded
even when its product, version and settings are unknown.

Later, the description can identify the service as Keycloak and include its
supporting database. The authentication component keeps its identity as detail
grows. The [LibreChat examples](../examples/README.md) show these two depths;
they are alternative synthetic descriptions, not evidence of a deployment
change or a defined revision history.

## Detail and uncertainty

Expand the parts relevant to your question. One path may be detailed while
another remains unexplored. A component can connect to shared services or back
to an earlier component; the Surface is a graph and has no fixed depth limit.
First- and second-degree positions are relative to a chosen starting point.

Keep the different kinds of incomplete information visible:

| Meaning | What the reader can infer |
| --- | --- |
| Known | A value or relationship is recorded, with its basis where available. |
| Unknown | The description does not establish the answer. |
| Omitted | An author deliberately left out otherwise relevant detail. |
| Redacted | Information is withheld from this representation. |
| Absent | A scoped assertion says something is not present. |
| Out of scope | The description does not attempt to cover that area. |

Missing detail does not establish absence. A description can help locate an
authentication dependency while still lacking the information needed to assess
its version or recreate the integration.

## Definitions and evidence

A definition revision records composition, configuration, scope and known gaps.
Separate linked records describe concrete deployments, dated observations and
Experiment Runs. This lets evidence accumulate while preserving the revision
and effective setup to which an earlier result refers.

For a connection, distinguish what is **declared**, what has been shown to be
**reachable**, and what a particular Run **exercised**. Keep evidence sources,
time, applicability and limitations with those claims. Neither a diagram nor a
valid document establishes all three.

## Common questions

### Is this the AI model itself?

No. A language model or another AI model may be a component in a Surface. The
AI Surface Model describes the wider system and its relationships, including
configuration and supporting services where they fall within scope.

### Is a fragment a separate model or a file?

A fragment is a focused part of a description expressed in the one AI Surface
Model. It may refer to other fragments and does not need to describe the whole
system. The term does not prescribe one file per fragment, a particular package
layout or an executable module. Those representation choices remain open.

### Do I need a Lab or an Experiment?

No. A saved Surface can support inventory, configuration understanding or
offline investigation on its own. When used with a Bench or Experiment, its
definition and linked evidence help describe what was prepared or tested.

### How much detail is enough?

Enough to answer the current question with explicit limits. Identifying a
dependency may require only its identity and connection. Recreating a setup
usually requires much more. Fitness for a task is separate from document syntax
or future schema validity.

### Can I export it or use it to deploy a system?

There is no released exporter or deployment engine. Planned interoperability
work will examine versioned, bounded mappings and report information lost or
transformed. Successful parsing would not establish consumer compatibility,
round-trip fidelity or recreation. See the
[interoperability research](../docs/interoperability.md) and
[recreation requirements](bench.md#can-someone-else-recreate-a-bench).

For more precise meanings, read the [draft concepts](../spec/README.md).
For the intended development sequence, see the [roadmap](../docs/roadmap.md).
