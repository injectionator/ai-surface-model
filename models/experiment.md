# Experiment

An **Experiment** describes a question and a method for investigating
it within the AI Surface Model. It connects what someone wants to learn with the
inputs, actions and observations needed to investigate that question. A **Run**
is one execution of that Experiment, with its own setup, outcomes and evidence,
recorded separately within the same model.

An Experiment **owns its desired setup** and asks its Lab directly to configure
the resources needed for the investigation. The Lab contains the Experiment and
owns resource configuration and local bindings. These describe setup and
containment; each actual execution is still recorded as a Run.

Start with the [overview](README.md) for the wider picture. Record formats and
references remain open design work; the repository provides no
execution engine.

## An Experiment in practice

In the synthetic sign-in investigation, the question is whether changing an
authentication setting changes which test accounts can sign in. The method
could specify synthetic accounts, initial conditions, sign-in attempts and
which outcomes to record.

A baseline Run uses one setting. A comparison Run uses the changed setting.
Both need enough setup information to determine whether other conditions also
changed. This illustrates a possible procedure; no such Runs or findings are
included in the repository.

## Requesting a setup

The Experiment selects a Surface definition revision and specifies supporting
tools, fixtures, initial conditions and configuration requirements. It asks its
Lab directly to prepare that setup. Unavailable resources and unapplied settings
remain visible; a request or saved definition does not establish readiness.

The Lab binds the definition to local resources and performs supported operations.
Credential requirements name a need; the recipient supplies private credentials
and account/resource identities through local bindings. The request mechanism
remains open, and this repository provides no executor.

A setup description and a Surface description answer different questions: what
an investigation needs, and what connected system is being described. Their
boundaries can overlap. Components can be shared across Experiments or Surfaces
without implying exclusive ownership. Preserve each component's identity.

## Experiments and Runs

| The Experiment describes… | Each Run records or links to… |
| --- | --- |
| The question and method. | The procedure actually used and any deviations. |
| Inputs, actions and conditions to control or vary. | The inputs and effective settings used on that occasion. |
| What observations or measurements to collect. | Results, evidence, failures and collection gaps. |
| How outcomes will be interpreted or compared. | The context and limitations of the resulting conclusions. |

A Run should reference the immutable Surface definition revision and digest,
the deployment binding and the effective setup used. The exact revision and
digest rules remain [open design work](../spec/README.md#open-decisions). A
definition digest identifies a description; it does not prove what was running.

One Experiment can have Runs against several Surfaces or revisions. Several
Experiments can also have Runs against one Surface revision. Reusing a method
does not by itself make results comparable: inputs, dependencies and effective
settings may differ.

## Changes between Runs

Keep the revision used by an earlier Run available when a definition changes.
Link later discoveries as dated evidence with their applicability and limits;
do not silently edit the revision an old result refers to.

If an Experiment deliberately changes configuration within a Run, its phases
need their own effective-setup attribution. Otherwise, a reader cannot tell
which setting produced which outcome. Changes to the method should likewise
leave enough history to identify the procedure each Run used; the reference
format is still to be designed.

## Common questions

### Do I need a hypothesis or a pass/fail test?

An exploratory question is useful too. Describe what you want to observe and
how you will record it. Add expected outcomes or comparison criteria when they
serve the investigation; the model does not prescribe a single methodology.

### Does a failed or interrupted execution count as a Run?

It can still provide evidence. Record what was attempted, where it stopped and
what remains unknown. An uncollected result cannot be treated as evidence that
the system passed a check or that a behavior was absent.

### Does a successful result prove the whole Surface works?

It supports only the claim warranted by the recorded method and coverage. A
successful probe establishes something different from evidence that a
particular Run exercised a connection. Preserve sources, time, applicability
and limitations with either claim.

### Can someone else recreate the setup?

They may need versioned software artifacts, configuration, deployment recipes,
data fixtures, environment prerequisites and their own credentials and resource
bindings. Preserve the selected definition and identify missing requirements.
A recipient's effective setup and Run evidence must be established separately.
See the [recreation handoff](../docs/n8r-surface/recreation-handoff.md) for the
proposed bounded consumer contract; no deployment engine is provided here.

Continue to [AI Surface Model](ai-surface-model.md) for definitions and evidence,
or [Lab](lab.md) for resource configuration and shared work.
