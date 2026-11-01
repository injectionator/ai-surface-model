# Bench fragment

A **Bench fragment** describes a working setup for conducting investigations
within the AI Surface Model. That setup brings together the system being
investigated and the resources needed to interact with it, control relevant
conditions and collect evidence. The same Bench can support more than one
Experiment.

Start with the [fragments overview](README.md) for the wider picture. Bench is a
fragment of the single AI Surface Model; its exact boundary and representation
remain open.

## A Bench in practice

For the synthetic sign-in investigation, a Bench could bring together an AI
application, its authentication service, synthetic test accounts and a way to
record sign-in outcomes. The application and service form part of the Surface
being investigated. The test accounts and observation tools support the method.

Preparing that Bench does not establish that every connection works. A planned
connection, a successful reachability check and a connection exercised during
a Run are different claims, each requiring its own evidence.

## Bench and Surface boundaries

A Bench answers what working setup an investigation needs. A Surface description
answers what connected system is being described, including its configuration
and known gaps. The descriptions can overlap: an observation tool may be
supporting equipment for one question and part of the Surface for another.

Choose the boundary for the question and record it. Do not infer that something
outside the description is absent from the real setup. Components can be shared
across Benches or Surfaces, and a Bench need not have a one-to-one relationship
with a Surface.

Keep a reusable description of the intended setup separate from its deployment
on actual resources. A deployment binding connects definition entities to those
resources. Dated observations and Run records establish what was in use at a
particular time; the current Bench alone cannot answer that historical question.

## Add detail when it helps

Begin with the Bench's purpose, the system it makes available and any known
constraints. Further detail may include:

- References to relevant Surface definitions and their revisions.
- Supporting tools, fixtures and initial-state requirements.
- Configuration, environment requirements and shared dependencies.
- Credential requirements, with sensitive values supplied through local bindings.
- How the setup is prepared, checked and restored between Runs.

These are descriptive concerns for a Bench fragment; the AI Surface Model has
no released schema. A saved description may be useful for understanding a setup
before it is complete enough to recreate.

## Common questions

### Is a Bench a benchmark?

A Bench is the working setup in this guide. A benchmark supplies a particular
evaluation procedure, workload or scoring method, which could inform an
Experiment carried out using that setup.

### Does a Bench have to be running all the time?

No. Its description can be kept while resources are stopped or unavailable.
Availability and successful preparation need current evidence before a Run;
they do not follow from having a saved description.

### Can someone else recreate a Bench?

They may need versioned software artifacts, configuration, deployment recipes,
data fixtures, environment prerequisites and their own credentials and resource
bindings. Record what is available and what is missing. This repository provides
no deployment engine, and its synthetic examples do not demonstrate recreation.

Continue to [Experiment](experiment.md) for how a working setup is used, or
[AI Surface Model](ai-surface-model.md) for describing the system itself.
