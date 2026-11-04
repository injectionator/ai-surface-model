# AI Surface Model meanings

The AI Surface Model describes connected components, configuration and relationships
at the detail available or useful. A language model is a component described by
it. There is one AI Surface Model; Lab, Bench and Experiment are descriptions
within it. A Lab contains Benches; a Bench contains Experiments. An Experiment
requests the setup it needs through its Bench; the Lab configures resources.
Lab / Lab Assistant and Bench / Bench Assistant each describe one entity.
Do not invent that hierarchy when it is outside the supplied investigation.

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

This condensed reference follows the repository's
[draft concepts at eabe20a](https://github.com/injectionator/n8r-surface/blob/eabe20aa642e64b6595795aed4d185f53f95cc93/spec/README.md).
The fields and serialization remain provisional. Maintainers must update this
reference with semantic changes; consumers do not need the source checkout to
read it.
