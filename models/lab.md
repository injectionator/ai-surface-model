# Lab fragment

A **Lab fragment** describes the organizational context for ongoing
investigation within the AI Surface Model. It helps people keep related Benches,
Experiments, resources and results discoverable as their work grows. A Lab can
describe an individual's work or a shared effort; it need not correspond to a
physical room.

Start with the [fragments overview](README.md) for the wider picture. Lab is a
fragment of the single AI Surface Model. Its boundary and representation remain
open; no workspace product is implemented here.

## A Lab in practice

In the guide's synthetic sign-in investigation, the Lab gives the work a place
and a purpose: understanding access to an AI application. It can keep references
to a sign-in Bench, the Experiments carried out there and the resulting Runs.
A later investigation of inference behavior could use another Bench in the same
Lab.

The Lab provides continuity across those investigations. Each Bench describes
the working setup for its particular use, while each Run retains the details
needed to interpret its own results.

## Add detail when it helps

A useful Lab description might begin with its purpose and links to its Benches
and Experiments. As needed, it could also describe:

- Shared resources and the constraints on using them.
- Who maintains a setup or can explain its limitations.
- Where definitions, procedures, results and supporting evidence can be found.
- Which work is active, historical or no longer reproducible.

These are questions for organizing work, not required fields. Membership,
permissions, scheduling and resource allocation have no defined implementation
in this repository.

## Shared resources and history

Several Benches may refer to the same service or equipment. Representing that
reuse should preserve the resource's identity and make the dependency visible;
membership in one Bench should not imply exclusive ownership.

A Lab's current resource list cannot establish what an earlier Run used. That
belongs with the Run's Surface revision, deployment and dated effective setup.
Changing a shared service may affect several Benches, but it must not rewrite
the meaning of their past results.

## Common questions

### Is a Lab a physical location or a cloud account?

Either might be part of its context. Here, Lab means the organization of the
work. Physical equipment, hosted services and local applications can all
participate; their actual locations and bindings need separate descriptions.

### Must every Surface belong to a Lab?

No. A person can use the AI Surface Model to describe or investigate a saved
Surface without including a Lab fragment or running an Experiment.

### Does a Lab make its Benches isolated or their results comparable?

The label establishes neither property. Isolation depends on the actual
resources and connections. Comparison depends on the Experiment method and
the effective setup recorded for each Run, including shared dependencies.

Continue to [Bench](bench.md) for working setups or
[Experiment](experiment.md) for investigations and results.
