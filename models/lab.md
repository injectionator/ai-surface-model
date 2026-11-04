# Lab

A **Lab organizes equipment, reusable Surface descriptions, Experiments and
their results**. It is responsible for configuring the resources an Experiment
requests. A Lab will often persist across investigations and sessions, but can
also serve a short-lived task. It need not correspond to a physical room.

Lab and Lab Assistant name the same entity in the diagram. The assistant name
identifies the Lab acting on setup requests and maintaining the context of its
work. There is no separate Bench entity.

Start with the [overview](README.md) for the wider picture. Lab is described
within the single AI Surface Model. These are intended responsibilities; no
resource configuration engine or workspace product is implemented here.

## A Lab in practice

In the guide's synthetic sign-in investigation, an Experiment asks the Lab for
an application, an authentication service, synthetic test accounts and
observation tools. The Lab prepares the requested setup and keeps unmet
requirements visible. A later investigation can select another Surface
description and Experiment from the same Lab's shelf.

A request alone does not establish that the setup is ready. Each Run retains
the details of the effective setup used to interpret its results.

## Equipment, shelf and active setup

These distinguish resources, reusable descriptions and current work within a Lab:

| Concern | What it describes |
| --- | --- |
| Equipment | Available or potentially usable hosts, services, tools and other resources, with capacity, access and management constraints. |
| Shelf | Saved Surface descriptions, independently developed fragments and Experiment definitions available for future work. |
| Active setup | The selected definition revisions, resource allocations and deployment bindings being used or prepared. |
| History | Decisions, dated observations and Runs, with references to the revisions and effective setups they concern. |

The active setup is recorded as current Lab state. It does not introduce a
separate reusable entity between the Lab and its Experiments.

The shelf is a working term for a collection of references, with no prescribed
storage format. It can hold many potential Surfaces and Experiments. Keeping
an item on the shelf does not allocate resources, establish availability or
mean it has ever been deployed. An item may remain incomplete or have unmet
requirements. Descriptions can also exist independently of any Lab.

Equipment can be shared across Surfaces or Labs; membership does not establish
exclusive ownership. A supporting tool can become part of the Surface when the
question calls for describing it. Record the chosen boundary and any gaps.

The intended initial execution policy allows **one active setup per Lab**.
That setup can contain several applications, containers and services, and the
Lab can retain any number of descriptions on its shelf. An allocation keeps a
setup active between Runs; merely ending a Run does not release its resources.
Before activating another setup, the Lab must account for the previous setup's
allocations and any resources it continues to use.

Concurrent active setups are deferred. This is an initial execution policy,
not a permanent one-Surface limit in the model. Capacity, ports, names, networks
and persistent data can still conflict within one setup or with other users of
shared equipment. Run scheduling, allocation and switching mechanisms remain
open; this repository does not enforce the policy.

## Requesting and preparing a setup

An Experiment identifies the Surface definition revisions, supporting tools,
fixtures, initial conditions and configuration it needs. It requests resource
configuration directly from the Lab. The Lab can fulfill the request by:

- **Attaching an existing system or resource**, recording its identity, binding,
  availability and the operations the Lab is allowed to perform.
- **Deploying a new system or resource**, using the required artifacts,
  configuration and locally supplied credentials.
- Combining attached and newly deployed resources within one setup.

Attachment does not itself grant permission to reconfigure or stop a service.
Record lifecycle and management authority per resource. Shelving a description
does not issue a shutdown request, and an attached service may remain running
after the Lab releases its use of it. Exact preparation and release procedures
remain open design work.

Keep requested settings distinct from what the Lab could provide: unavailable
resources, unapplied settings and other gaps remain visible. A deployment
binding maps definition entities to concrete resources. Dated observations
record their effective setup. Declared, reachable and exercised connections
remain different claims, each requiring its own evidence.

## Add detail when it helps

A useful Lab description might begin with its purpose, equipment, shelf and
current work. As needed, it could also describe:

- Shared resources and the constraints on using them.
- Configuration requested by an Experiment and any unmet requirements.
- Who maintains a setup or can explain its limitations.
- Where definitions, procedures, results and supporting evidence can be found.
- Which work is active, historical or no longer reproducible.
- Decisions, unresolved questions and a summary for resuming work later.

These are questions for organizing work, not required fields. Membership,
permissions, scheduling and resource allocation have no defined implementation
in this repository.

## Shared resources and history

Several Surface descriptions may refer to the same service or equipment. That
reuse should preserve the resource's identity and make the dependency visible;
association should not imply exclusive ownership.

A Lab's current resource list cannot establish what an earlier Run used. That
belongs with the Run's Surface revision, deployment and dated effective setup.
Changing a shared service may affect several setups, but it must not rewrite
the meaning of their past results.

## Context across sessions

A long-lived Lab needs durable records and a manageable account of its current
work. Keep definitions, evidence and decisions available outside the assistant's
conversation context. A short current-work summary can point to the selected
revisions, constraints, unresolved questions and next steps. Retrieve supporting
records for the current task and check time-sensitive facts again before use.

Summaries retain links to their sources and can be rebuilt; they do not replace
historical records or prove that a remembered resource is still available. See
[Lab context and memory](lab-context.md) for the intended responsibilities and
open mechanism choices.

## Common questions

### Is a Lab a physical location or a cloud account?

Either might be part of its context. A Lab organizes equipment, descriptions and
Experiments and handles setup requests. Physical equipment,
hosted services and local applications can all participate; their actual
locations and bindings need separate descriptions.

### Must every Surface belong to a Lab?

No. A person can use the AI Surface Model to describe or investigate a saved
Surface without describing a Lab or running an Experiment.

### Does a Lab make its Experiments isolated or their results comparable?

The label establishes neither property. Isolation depends on the actual
resources and connections. Comparison depends on the Experiment method and
the effective setup recorded for each Run, including shared dependencies.

### Can someone else recreate a setup?

They may need versioned software artifacts, configuration, deployment recipes,
data fixtures, environment prerequisites and their own credentials and resource
bindings. Record what is available and what is missing. A saved description can
be useful before it is complete enough to recreate. This repository provides
no deployment engine, and its synthetic examples do not demonstrate recreation.

Continue to [Experiment](experiment.md) for investigations and results, or
[Lab context and memory](lab-context.md) for resuming ongoing work.
