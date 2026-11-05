# AI Surface Model meanings

The AI Surface Model describes connected components, configuration and relationships
at the detail available or useful. A language model is a component described by
it. There is one AI Surface Model; Lab and Experiment are descriptions within it.
A Lab contains Experiments. Each Experiment owns its desired setup and selected
Surface revision and requests resource configuration directly from its Lab.
The Lab owns resource configuration and local bindings. Lab / Lab Assistant
share one entity. The ownership chain is Lab → Experiment → Setup.
Bench is retired; preserve historical references as historical evidence, never
as current ownership or authority. Do not invent a hierarchy when it is outside
the supplied investigation.

Partial knowledge is useful. Preserve these distinct meanings:

| Meaning | Use |
| --- | --- |
| Known | Supported by identified evidence with a stated scope. |
| Unknown | The question is relevant but available evidence does not answer it. |
| Omitted | Deliberately left out of this description. |
| Redacted | Known detail withheld, such as sensitive values. |
| Absent | Evidence establishes absence within a specific scope. |
| Out of scope | Not part of the selected investigation. |

A missing field or uninspected directory does not establish absence. Evidence
that a product supports OIDC does not establish that this user enabled it.
Two HTTP routes can belong to the same service. Keep shared components, parallel
connections and cycles; depth is relative to a starting point, not a fixed limit.
Assign simple stable local labels such as `component:identity` when findings will
be saved or continued; add detail without silently replacing the entity.

Keep definitions separate from deployments, observations and Experiment Runs.
A declared connection, a reachable endpoint and an exercised interaction are
three different evidence claims. Source reading alone establishes none of the
runtime claims. Later findings must not silently rewrite what an earlier result
referred to. Record source, time, applicable revision and limits.

Interoperability is a bounded, versioned mapping with explicit losses. Matching
names, parsing JSON or reading a schema does not establish compatibility or
successful recreation. Distinguish a product possibility from a selected setup.

Named output profiles select content within this one model. Size, purpose and
deployment knowledge are independent. A profile version identifies output rules;
Surface definition and setup/binding revisions identify the described state.
Preserve those revisions and prior Run attribution when adding detail or bindings.
The [skeleton procedure](skeleton-surface.md) defines the provisional brief and
explicit reconciliation lifecycle. Detailed and recreation profiles remain future
directions, not implemented contracts.

This bundled reference records the draft meanings for skill 0.1.8. The repository's
[draft concepts](https://github.com/injectionator/n8r-surface/blob/main/spec/README.md)
are a moving source link; use the installed package version and digest to identify
the instructions actually used. Fields and serialization remain provisional. Maintainers must update this
reference with semantic changes; consumers do not need the source checkout to
read it.
