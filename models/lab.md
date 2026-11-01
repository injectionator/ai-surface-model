# Lab

A **Lab contains Benches and is responsible for configuring the resources they
request**. It also organizes ongoing investigations, shared resources and
results. A Lab can support an individual's work or a shared effort; it need not
correspond to a physical room.

Start with the [overview](README.md) for the wider picture. Lab is described
within the single AI Surface Model. These are intended responsibilities; no
resource configuration engine or workspace product is implemented here.

## A Lab in practice

In the guide's synthetic sign-in investigation, the Lab contains a sign-in Bench.
That Bench asks the Lab to configure an application, an authentication service,
synthetic test accounts and observation tools. The Lab is responsible for making
that setup available and keeping unmet requirements visible. A later
investigation of inference behavior could use another Bench in the same Lab.

Each Bench specifies its needs; the Lab handles resource configuration across
its Benches. A request alone does not establish that the setup is ready. Each
Run retains the details of the effective setup used to interpret its results.

## Add detail when it helps

A useful Lab description might begin with its purpose, its Benches and the
resources it can configure. As needed, it could also describe:

- Shared resources and the constraints on using them.
- Configuration requested by each Bench and any requirements that cannot be met.
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

Either might be part of its context. Here, a Lab contains Benches, handles their
resource configuration requests and organizes the work. Physical equipment,
hosted services and local applications can all participate; their actual
locations and bindings need separate descriptions.

### Must every Surface belong to a Lab?

No. A person can use the AI Surface Model to describe or investigate a saved
Surface without describing a Lab or running an Experiment.

### Does a Lab make its Benches isolated or their results comparable?

The label establishes neither property. Isolation depends on the actual
resources and connections. Comparison depends on the Experiment method and
the effective setup recorded for each Run, including shared dependencies.

Continue to [Bench](bench.md) for working setups or
[Experiment](experiment.md) for investigations and results.
