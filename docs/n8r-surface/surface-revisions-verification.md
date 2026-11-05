# Partial Surface generation and revision evidence

This records the bounded #17 candidate, not human acceptance or completion of
all #17 scope. Follow the [short tester walkthrough](getting-started.md); the
[design](../superpowers/specs/2026-11-05-surface-revisions-design.md) and
[SURFACE-01](command-outcomes.md#surface-01-generate-save-and-revise-a-partial-surface)
define the intended outcome.

## Starting state and actual interaction

The installed baseline help on 5 November 2026 advertised Markdown-only saves.
Structured generation/persistence was an explicitly authorized known missing
capability. This was not represented as a failed live AI trial.

The rehearsal starts with the real Researcher's earlier saved Lumen note, including
five component IDs, a human decision not to select external OIDC and a later human
session-expiry priority. The source is the fictional
[Lumen guide](../../examples/researcher/sources/lumen-guide.md). The agent copied
that existing note and source into a new local rehearsal directory, recorded their
bytes and configured a separate test vault. It installed a candidate tarball into
an isolated prefix with scripts disabled, keeping the normal global installation.

Actual interactions through the installed command:

1. Reopen the note with the explicitly selected source and renew transmission
   consent. Ask the Researcher to create a partial Surface, retain all five IDs,
   the OIDC non-selection and expiry priority, and show selections and unknowns.
2. Inspect the host-generated preview; enter `/save surface`, then `/exit`.
3. Start a fresh process from the saved JSON. Select OIDC because the investigation
   now needs centralized sign-in, explicitly leaving provider identity and runtime
   behavior unknown. Request the updated Surface, save and exit.
4. Start another fresh process from the successor HTML. Ask which decision changed
   and what remains unknown, then exit without saving.

The developing agent supplied those interactions, not prewritten findings or
structured artefacts. The real Codex Researcher read sources and generated content.
Independent code read the actual saved files afterward; scripted protocol tests
are separate evidence.

## Probe and reviewed candidate

The initial installed probe used product code `f34522f`. It completed all three
Lumen processes with exit 0. Independent readback verified the five existing IDs,
OIDC rejected → selected, session-expiry context, exact research references and
successor lineage. The first definition had no selected edges; the second added
the declared Lumen → OIDC selection. This is a partial desired composition, not
runtime configuration or proof of reachability.

Review identified two preview-state bugs: an invalid replacement could retain an
earlier staged candidate, and a Markdown save turn could stage an unshown Surface.
Both were reproduced with failing tests and fixed at `62cc6d9`. The same commit
requires evidence basis for every generated entity and retains historical claims,
notes and question identities. A fresh targeted reviewer verified the fixes and
ran 19 focused tests without unresolved findings.

The probe's script originally sampled checkout HEAD at completion, while review
work had advanced it. Its local report was corrected to identify the installed
`f34522f` product code and retain the originally sampled value with an explanation.
Tarball hashes identify exact installed bytes; a later checkout revision is not
substituted for the running candidate.

## Corrected-candidate rehearsal

The complete Lumen cycle passed against product code
[`62cc6d9`](https://github.com/injectionator/n8r-surface/commit/62cc6d9131badb0a086f3bdb2e3f6bc38f0e14b9)
on 5 November 2026. All three fresh installed processes exited 0. The independent
Harbor check also passed through three fresh processes, each exiting 0.

| Environment / input | Recorded identity |
| --- | --- |
| Host | macOS; Node 26.13.0; Codex CLI 0.166.0 |
| Inference | `gpt-6-astra`, existing ChatGPT sign-in; no provider/API-key fallback |
| Shared Researcher | 0.1.8; instruction digest `sha256:8af29c3073df9b8210a7dd94ced9700379b0a98f76bd3a2902f9430b93c98a2a` |
| Host adapter | Structured tool instructions and restrictions at code `62cc6d9` |
| Installed tarball | SHA-256 `59fde46cfff0f3b9bdba198d6c637891d0102ac46da5870580aab2a620367fdb` |
| Original note | SHA-256 `76b6abe6d616b903f641f2b8d52f06777ad5383060701ce49a314d3ff68eca52` |
| Lumen source | SHA-256 `98d3374c79c166b37f0debb4ffb5e457eda1385dd7847b042cbad674cac98693` before and after |

The tarball contains the exact code at that revision plus in-progress documentation;
its hash identifies the installed package. Independent byte comparison confirmed
all installed built files match the source build. The shared instruction digest
identifies bundled Researcher instructions; the host adapter code separately
identifies its structured-output instructions.

Independent readback used `readResearchHtml`, `decode`, `verifyReferences`,
`verifySuccessor` and the host's additional preservation checks. It retained
`component:lumen`, `component:inference`, `component:archive`, `component:callback`
and `component:oidc` across both definitions. OIDC changed from rejected to selected
under the same decision ID; the selected successor adds one declared centralized
sign-in edge. Provider/model identity and runtime behavior remain unknown.

The initial record has 11 findings and one source; its successor has 14 findings
and two source observations, retaining historical claims and human notes. The
session-expiry priority survives. Original note, first pair, source and settings
bytes are unchanged. Reopening the successor HTML retained the changed decision
without creating a third pair.

| Logical object | Digest |
| --- | --- |
| Initial research | `sha256:a9cc46c071bebffe7048962971ec69d565c9418b6815d8fe0895879a930cc69b` |
| Initial Surface | `sha256:ebf4cb0e801598ed512555db9f6af03ec21cf3dc204509a78ad6d2dfab81b85c` |
| Successor research | `sha256:d6630b518b1fb655a9f2132f3ce51993013d966c666dc5b1d37091f466680b53` |
| Successor Surface | `sha256:8b3c84e590851b234be05c853ad2b5b63c1f641778995f33812151ccf96aa43d` |

Parent references match the exact initial identities, revisions and logical digests;
manifest hashes match independently read file bytes. Raw terminal logs, original
inputs, tarball and readback reports remain in the selected local vault's `runs/`
folder; no machine-specific location is published.

The independent Harbor trial used the fictional
[interface notes](../../examples/researcher/sources/harbor-api.md). The Researcher
created a Markdown note, then reopened it to generate a pair, then reopened the
pair's HTML in another fresh process. Independent readback confirmed ten findings,
three stable IDs (`urn:harbor:archive`, `urn:harbor:intake-client`,
`urn:harbor:callback-receiver`), deferred callback selection and explicit unknown
authentication/compatibility. Source, note and settings bytes remained unchanged.
This is a smaller second-product check, not a Harbor integration or deployment trial.

The [actual sanitized transcript](surface-revisions-transcript.md) preserves the
six installed conversations, prompts, source tool output, previews and save paths
with machine-specific path prefixes replaced. Spinner frames are omitted. The
complete logs and readback retain their original bytes locally.

## Automated supporting checks

At `62cc6d9`, 115 Node tests and the installed-package check passed. New tests cover
host-owned references, invalid structured input, immutable pair history, original
note/predecessor conflicts, malformed manifests, symlink ancestry, relocated pairs,
publication failure, missing historical sources, context bounds, validation repair,
failed turns and stale/unshown preview rejection. The package test uses a scripted
Codex process; it is not evidence of model reasoning.

The full 115-test suite and installed-package check also passed separately on
Node 22.23.2, 24.22.2 and 26.13.0. `npm ci` and `npm cache add yaml@2.9.1` prepared
the dependency cache; package consumer installation used offline mode with scripts
disabled. Final Markdownlint 0.24.0, offline Lychee 0.24.2, cffconvert 2.0.0,
shell syntax, 24 Python tests and whitespace checks passed. All six GitHub checks
also passed at code `62cc6d9`; later documentation commits have their own CI runs.

## Storage and remaining limits

Each numbered directory contains research HTML, Surface JSON and a host manifest
with byte hashes/provenance. The host validates and reads back all members. The
Surface pins the research logical revision/digest; successors pin their own
predecessors. The manifest is storage metadata, not a second model or authenticity
proof. Original Markdown notes and earlier pairs remain available.

Reopening requires an intact host-created pair and renewed source/transmission
consent. It supports one research record per pair, bounded to 512 KiB of transmitted
context. Arbitrary multi-record imports, automatic reconciliation of manually edited
HTML, deliberate component deletion/migration and YAML generation are outside this
increment. Directory topology must remain stable during synchronous filesystem
operations; no adversarial concurrent-filesystem guarantee is claimed.

The host checks structure, references and selected preservation rules. Interpretation
of prose, human intent and source meaning still needs review. Missing detail does
not establish absence. Declared edges do not establish reachability or exercised
behavior. These trials do not establish universal model conformance, consumer
compatibility, Lab recreation, external-host lifecycle or registry distribution.
The package remains private; npm work is last and separate. Human acceptance of
this increment is pending, and #17 remains open.
