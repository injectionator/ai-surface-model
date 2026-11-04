# Lab

A **Lab contains Experiments and owns resource configuration and local bindings**.
Each Experiment owns its desired setup and asks the Lab directly to prepare it.
The Lab also organizes shared resources, reusable definitions and ongoing work.
It can support an individual or a shared effort and need not be a physical room.

Lab and Lab Assistant name the same entity; the assistant name identifies its
active role in handling requests. These are responsibilities within the single
AI Surface Model, not a resource executor implemented by this repository.

## A Lab in practice

In the guide's synthetic sign-in investigation, an Experiment asks its Lab to
configure an application, an identity service, synthetic accounts and observation
tools. The Lab performs supported operations and records unmet requirements.
Another Experiment may request a different setup using some of the same resources.

A request does not establish readiness. The effective configuration and relevant
connections need fresh evidence, and each Run retains the setup it actually used.

## Add detail when it helps

Begin with the Lab's purpose, Experiments and available resources. Useful detail
may include:

- Resource ownership, local bindings and constraints on shared use.
- Configuration requested by each Experiment and requirements that cannot be met.
- Reusable definitions, procedures and source material kept for later work.
- Where results and supporting evidence can be found.
- Which work is active, historical or no longer reproducible.

Saved definitions remain independent of equipment allocation. Membership,
permissions, concurrency and scheduling require explicit consumer behavior;
this model does not supply an implementation or infer authority from a graph.

## Shared resources and history

Several Experiments can refer to the same service. Preserve its identity and
shared-dependency relationships; selecting it does not imply exclusive ownership
or authority to stop it. A recipient binds a reusable definition to resources
under their own Lab's authority.

The current resource list cannot establish what an earlier Run used. That belongs
with the Run's definition revision, deployment binding and dated effective setup.
Changing a service must not rewrite the meaning of earlier results.

## Common questions

### Is a Lab a physical location or a cloud account?

Either can be part of its context. A Lab organizes Experiments and resources and
handles setup requests. Physical equipment, hosted services and local applications
can all participate; concrete locations and account identities are local bindings.

### Must every Surface belong to a Lab?

No. A saved Surface description can support investigation without describing a
Lab or running an Experiment.

### Does a Lab establish isolation or comparable results?

Neither follows from the label. Isolation depends on actual resources and
connections. Comparison depends on the method and effective setup recorded for
each Run, including shared dependencies.

Continue to [Experiment](experiment.md) for desired setups and execution evidence,
or the [overview](README.md) for their relationship to Surface descriptions.
