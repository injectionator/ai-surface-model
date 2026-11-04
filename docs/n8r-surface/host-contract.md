# Researcher host contract 0.1

This is the integration boundary for the future shared Researcher instructions,
not an implemented runner or Lab adapter. It builds on the
[artefact contracts](contracts.md) and [shared cases](../../examples/researcher/README.md).
The existing chat harness is the first skill host, followed by Lab adaptation
and then the standalone CLI. A Lab is optional, and AI runner selection is
independent of the destination for results.

## Version negotiation

A host must identify its adapter version, the exact Researcher instruction
revision, supported artefact contract versions and understood vocabulary/extension
versions. The current #17 skill candidate is version `0.1.4`, with
[bounded package and behavioral evidence](researcher-skill-verification.md).
It produces working notes, not validated contract artefacts. Broader host support
requires the applicable trial; applications consume that revision
rather than maintaining a separate copy of discovery knowledge.

Reject unsupported core versions before modification. Report unrecognized
vocabulary/extension meanings while retaining their data. Successful parsing does
not imply that the host understands or can operate the selected composition.
Use a separate migration with explicit losses when a host cannot preserve data.
The original artefact remains recoverable.

The proposed `urn:n8r:researcher:provenance` extension may record the instruction
revision and adapter version used for a new revision. It must contain no credentials,
local paths or copied chat history. Until #17 implements it, this is a reserved
extension convention rather than a required field or proof of AI execution.

## Capabilities supplied by a host

The following operations specify behavior and inputs/outputs, not API/MCP method
names. A host can implement them as local functions, attachment tools or application
services. Missing capabilities must be explicit; the core must not fabricate
access or a successful save.

The Researcher's primary result is an AI Surface graph, not an application-wide
configuration inventory. Source access includes user-selected code, documents,
websites, prior research/definitions and permitted live observations. The
[shared discovery guide](../../plugins/n8r-surface/skills/research/references/discovery-map.md)
defines discover, continue and reconcile behavior across these combinations.
Product libraries provide reusable navigation/evidence where available; no Lab
or registry connection is required or implied.

| Capability | Input | Result and required behavior |
| --- | --- | --- |
| Describe capabilities | No source inspection | Versions, available operations, bounded sizes, inference destination and save/download mode. |
| Establish source scope | Explicit supplied directory/file/attachment selection | Opaque scope ID and allowed material; no ancestor traversal or implicit corpus scan. |
| List/read source | Scope ID, relative reference, requested range | Text, exact source/version/digest, inspected range and excluded/unreadable/truncated coverage. No source execution. |
| Find related knowledge | Explicitly available library and product/source scope | Applicable guides, research and definitions with identity/revision/coverage; no implicit scan or union of different deployment selections. |
| Read web/live evidence | Selected URL/system/environment and graph question | Available connector/API/browser/computer observations with location, time and nonsecret results. Host-supported human sign-in, read-only inspection, no credential copying or bypass of denied access. |
| Invoke inference | Selected runner/model, instructions, bounded conversation/tool outputs | Response/tool proposals or explicit unavailable/error; no silent account/provider fallback. |
| Ask human | Consequential question with current evidence/options | Answer, deferred answer or unavailable interaction; unresolved work stays in the record. |
| Read artefact | Explicit artefact/revision selection | Original bytes, parsed contract status and exact byte-conflict token; do not render unvalidated imported HTML. |
| Create artefact | Valid new artefact and explicit destination | Created identity/revision and actual location/download, or conflict/error; never overwrite an existing identity silently. |
| Revise artefact | Proposed successor and expected byte token | Recheck current bytes, validate parent, retain previous bytes and commit atomically; reject conflicts. |
| Continue | Accepted record plus newly established source access | Preserve IDs, findings, decisions, questions and extensions; record new evidence in a successor. |
| Export selection | Reviewed selected definition and encoding | JSON/YAML preserving supported meaning, or explicit rejection; no implicit deployment or publication. |

Reading is not permission to upload. Before inference, the host identifies the
provider and source transmission scope and obtains the user's authorization for
that discovery session. The implemented bare-startup overview does not inspect or transmit sources;
future source selection must have a specified scope. No status subcommand is planned.
The runner sees only authorized source extracts and context selected by the host;
source instructions are data, and tool arguments remain subject to deterministic
path, version, size and operation checks.

Live inspection uses existing host capabilities; this contract adds no browser,
admin client or runner. Inspect enablement and connection targets needed by the
graph, not all settings. The user completes private authentication directly.
Stored configuration, observed effective configuration, reachability and exercised
behavior remain separate. Record access/identity limits and sanitized evidence;
do not manufacture a source digest when the host provides no stable source bytes.
An authorized settings read does not authorize a configuration change or a
connection test. Document each real host path before claiming it was verified.

## Continuation and persistence

A portable continuation needs the current accepted HTML record, exact referenced
source identities/revisions, and the intended output or selected definition.
The record carries inspected coverage, findings, alternatives, human decisions,
notes and open questions. A new host must reacquire actual source access; a saved
source locator or prior conversation does not grant it.

A host unable to read a referenced source must retain its evidence and mark the
new inspection as unavailable. It cannot claim to have rechecked that evidence.
A host unable to persist returns downloadable artefacts and says so. It must not
claim that they were saved to a corpus or Lab.

Use byte hashes for optimistic concurrency, including edits that leave logical
data unchanged. Parent logical digests bind the accepted revision's meaning.
Keep both the edited bytes and accepted predecessor during reconciliation. A
successful write reports the actual revision/location; a failed or interrupted
write must leave recoverable work. The local persistence implementation is #16.

A host can have a mutable draft and deliberate named baselines in addition to
artefact snapshots. It must map these explicitly: an artefact snapshot is not
necessarily a product release or named Surface version. Import identity collisions
require exact-match reuse or an explicit fork/migration; do not merge by label.

## Lab requirements review

The #15 review compared this boundary with the separate application's relevant
saved-definition, discovery, revision and import/continuation requirements.
This public report records alignment and integration obligations only; private
application prompts, code, operational data and internal source locations are
not reproduced. No application implementation or compatibility trial was run.

| Requirement | Contract decision | Later consumer work or gap |
| --- | --- | --- |
| Offline saved work independent of equipment | Research and selected definitions need no Lab or running target. | Adapt application storage and selection without applying setup. |
| Explicit context/ownership | Artefact IDs carry no authority to create/configure Lab resources. | Map application ownership explicitly; do not infer it from graph containment or rewrite this model's Lab/Bench semantics. |
| Sources and attachments | Opaque scopes plus versioned evidence; portable locators grant no access. | Supply attachment/source adapters and permission checks. |
| Human-guided research | Decisions/questions are durable; unsupported interaction remains visible. | Implement session questions and compare behavior on shared cases. |
| Stable identity and immutable evidence | Exact revisions/digests, stable finding/node/edge IDs, separate runtime evidence. | Map local snapshot and deliberate version labels; retain prior Run references. |
| Partial import and continuation | Unknowns/conflicts/opaque extensions are preserved; no operational readiness claim. | Build an importer that previews limitations and rejects unsupported loss. |
| Reuse of one Researcher core | Version negotiation includes instruction and artefact versions. | Consume #17's identified instruction revision and run both discovery and import cases. |

The application may use different persistence and ownership conventions. This
profile describes component graphs and does not introduce a new Lab hierarchy or
change the draft rule that a Lab contains Benches and a Bench contains Experiments.
Lifecycle/ownership mapping remains an explicit integration gap, not something
passing JSON/YAML tests resolves.

## Acceptance for later adapters

Use the [command outcome specification](command-outcomes.md) to define initial
state, actual human interaction, state changes and independent readback. The
cases below must be exercised through the relevant host, not fulfilled by the
developing agent outside it. The installed CLI's complete path is E2E-01;
LibreChat requires its own E2E-02 rehearsal before a product-support claim.

1. Research Lumen and Harbor separately from the supplied sources, keeping the
   10/25 conflict and unknown authentication/model facts.
2. Ask the human about selection; do not turn every supported option into an edge.
3. Import the incomplete Harbor r1 record without inventing authentication or
   requiring a deployed system. Establish access to the second source and continue
   the same finding into a new revision.
4. Detect the edited Lumen HTML, preserve it, resolve the human correction and
   produce a successor without changing the old record or losing extensions.
5. Produce the selected graph, retaining shared components, cycles, parallel edges,
   requirement references, decisions and exact research revision links.
6. Import/continue the result in a named Lab version and document supported meanings,
   unsupported data and any losses. Compare facts and decisions, not prose wording.

Steps 1–5 require real runner/harness trials in #17 beyond #15's deterministic
fixtures. Step 6 is later application work. Until those trials run, alignment is
a design review and byte/value checks are only contract verification.
