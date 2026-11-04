# Skeleton Surface v0.1

This is a provisional output profile within the AI Surface Model. Produce a
compact Markdown Surface working draft, not validated JSON/HTML or a deployment
recipe. The profile version describes these rules; the skill version identifies
the instructions used. Neither is the revision of the particular Surface/setup.

## Select and bound the brief

Use this profile when asked for a skeleton or brief Surface. Broad discovery
starts shallow; a narrow question takes precedence over a general inventory.
Security is the focus of this profile, while the model supports other purposes.
The useful question is: where could a security integration inspect or intervene
in LLM and actual tool calls, with what powers, coverage and gaps?

Retain a node or distinction when removing it hides a key capability, a material
security boundary, or a place an Experiment could change or observe behavior.
Keep required supporting roles such as application persistence when they explain
the setup. Features can be capability nodes; do not turn every setting into a node.
Use a role such as MCP server or vector store when no instance is selected. Source
evidence may identify supported products/transports without identifying a binding.
An empty template field does not establish that every deployment lacks a binding.

Preserve stable node and relationship identities from supplied descriptions.
Different serialization or vocabulary requires an explicit mapping, not silent
renaming. Keep shared nodes, parallel routes and cycles. A historical claim not
re-established at the selected revision must stay qualified or move to a clearly
linked historical/gap record; it cannot become a current supported capability.

## Keep the graph small without losing meaning

Lead with a short identity/scope line and a graph or edge table. Retain source
revision, Surface revision and profile name/version. Show key nodes, directed
relationships, purposes and relevant execution/authority boundaries. Label
supported possibilities separately from selected composition and observed setup.
No source-only graph establishes reachability or exercise.

Use concise claim references to linked research or source sections. Identify the
supporting revision and locator where available. Summarize coverage and unresolved
questions once where shared; retain exceptions beside the affected edge. Avoid
repeating boilerplate unknown bindings for every node, but never make an omitted
value imply absence. No arbitrary node count, depth ceiling or file-size minimum
applies. A smaller output is not permission to discard a condition or bypass.

| In the brief | In linked records |
| --- | --- |
| Nodes, directed edges, roles, material conditions and uncertainty | Detailed source excerpts, inspected ranges and investigation narrative |
| Claim basis and usable evidence references | Full provenance, conflicts and supporting findings |
| Interception location, visibility, powers and coverage gaps | Hook signatures, configuration details and vendor compatibility research |
| Binding status and reference when relevant | Protected resource bindings, nonsecret configuration and secret requirements/references |
| Observation summary with applicability, when supplied | Dated runtime observations, traces, tests and Experiment Run results |

Use existing evidence records when they suffice. Do not create a large companion
record just to satisfy a template; direct versioned source references can suffice.
Keep links portable or state which accompanying files are needed. Never invent
records or imply their contents were read. Credential values do not belong in
the brief or research evidence.

## Map interception opportunities

For each relevant candidate, state compactly:

- **Location and stage:** node/edge, before/after model dispatch or tool execution.
- **Visible context:** messages, tool arguments/results, principal, or unknown.
- **Powers:** observe, modify, block or require approval, only as supported.
- **Coverage:** covered routes, conditions, bypasses and unresolved continuations.
- **Basis:** proposed placement, documented/implemented extension, configured
  integration, or exercised behavior; link evidence and preserve its limits.

A proxy only sees traffic routed through it. Seeing tool schemas, model-proposed
calls or returned results in model traffic does not prove mediation of the actual
tool invocation or downstream effects. Trace the tool executor separately. Keep
browser-direct routes, scheduled workers and other known alternate paths visible.

A hook's presence does not establish its timing, veto power or complete coverage.
A sidecar is placement, not an interception mechanism: identify routing, hooks or
event delivery and how a decision reaches execution. Observation-only telemetry
is not enforcement. Record failure behavior if known, or as a gap relevant to
later setup selection; a documented claim is not a runtime test.

Record potential cross-service observation points and correlation gaps without
claiming end-to-end trace coverage. Do not select a vendor or infer product
compatibility from names or protocols. If evidence supports only an opportunity,
say so. Stop once the brief answers the question with gaps visible. Do not install,
bind resources, configure proxies/hooks or run integration tests as part of it.

## Continue and reconcile

Size and deployment knowledge are independent. A bound setup can have a skeleton;
a detailed product description can remain unbound. When saving or continuing,
follow [working notes](working-notes.md), preserving predecessors and evidence.

For Lab-managed changes, the intended consumer behavior is to record a successor
setup/binding revision with the change and its evidence; an Experiment requests
resources from its Lab, which owns bindings. This skill does not implement that
automation. A request is not proof that configuration succeeded. Keep effective
setup unknown until supported by observation.

Changes outside the Lab do not automatically update saved descriptions. On an
explicit reconciliation request, read current identified evidence, compare it
with the predecessor and save an authorized successor. Preserve stable identities,
explain changed declarations/bindings and retain uncertainty about effective use.
Reference an unchanged definition when only bindings change; use a successor
definition when composition or intended settings change. Keep profile version
unchanged unless the output rules change. Do not retrospectively rebind prior Runs.
