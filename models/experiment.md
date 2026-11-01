# Experiment

An **Experiment** describes a question and a method for investigating
it within the AI Surface Model. It connects what someone wants to learn with the
inputs, actions and observations needed to investigate that question. A **Run**
is one execution of that Experiment, with its own setup, outcomes and evidence,
recorded separately within the same model.

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

Continue to [AI Surface Model](ai-surface-model.md) for definitions and evidence,
or [Bench](bench.md) for the working setup an Experiment uses.
