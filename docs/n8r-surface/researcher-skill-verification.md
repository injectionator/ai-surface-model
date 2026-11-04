# Researcher skill verification

**Candidate:** `n8r-surface:research` (**n8r-surface Researcher**) **0.1.5**, 4 November 2026.
This is a partial #17 increment. ChatGPT desktop / Work lifecycle acceptance is
**pending**, not passed. No Lab or standalone CLI research claim follows.

The implementation/evidence commits are identified by the associated draft PR;
use the exact candidate commit when repeating the procedure.

## Direct Lab ownership correction: 0.1.5

The user confirmed that Bench is retired. Canonical concepts, diagrams and the
bundled model reference now use **Lab → Experiment → Setup**. Experiments request
configuration directly from their Lab; the Lab owns resources and local bindings.
Historical records retain their original meaning. The old Bench guide URL is a
retirement notice. Serialized examples contain no Bench entities, so none needed
rewriting; no artefact-contract shape changed.

Before the correction, a fresh evaluator reading only installed 0.1.4's reference
returned Lab → Bench → Experiment and said setup ownership was not explicit.
That is direct evidence of the stale guidance. Version 0.1.5 changes the bundled
meaning and version metadata; the discovery and note-storage method is unchanged.
The controlled trial below deliberately used 0.1.4 for both passes, with the user's
ownership correction supplied separately. It is not retroactively labeled 0.1.5.

The implementation checks passed: 17 changed/new Markdown files with
markdownlint-cli2 0.24.0 (MD013/MD041 disabled), 135 local links/anchors, three JSON
example parses plus identifier/endpoint/local-requirement checks, skill metadata,
manifest version/interface alignment and whitespace. Both shell blocks in the
human trial guide were executed from the source root, exited 0 and produced the
expected fixture hashes. Independent review found no actionable issue or public
material leak. The eight paused #16 files and existing private notes were unchanged.
No npm/library/CLI behavior changed or is claimed tested by this increment.

## Controlled declaration trial: 0.1.4

State X: installed 0.1.4 matched all eleven committed package files at
`ce394b1e8ddafe206e57e014285b6ef576339c4e`. Source was LibreChat
`e1dfc10449ff713faffacd60273fddcfe2c0a698`, with the existing dirty client manifest
excluded. Environment: macOS ARM64, Codex CLI 0.139.0, Python 3.13.1; actual local
host agents and filesystem tools. No hidden model or desktop version is asserted.

A fresh Researcher agent read the installed instructions, prior notes and actual
sources, then saved/read back a baseline for a task-owned partial configuration.
Only after independent baseline readback did the coordinator change
`RAG_API_URL=` to `RAG_API_URL=https://rag.example.test`. A second fresh agent
received the saved baseline and current inputs without expected findings, followed
source evidence and saved/read back a numbered successor. The coordinator kept
expected findings separately and did not write either research output.

The comparison identified the declared target change on the retained RAG role,
kept product capability unchanged and left deployed state unknown. It preserved
all twelve component labels, earlier scoped human context, authentication
uncertainties and unrelated graph claims. New focused reads described extraction
routing gates and fallback behavior; those were additional source findings, not
extra configuration changes or exercised operations.

Independent verification reopened both outputs, matched all 17 baseline and 19
successor manifest rows, checked decisive URL guards/configuration expressions
and extraction-routing source ranges, and confirmed earlier notes and source
changes were preserved. The saved-note digests are:

| Record | SHA-256 |
| --- | --- |
| Baseline research | `06a58ba6601ff1c982a4006274adf01b5aaf04fb3a6a7eeac28b2cbd74815a23` |
| Reconciliation successor | `f9a9da4dce335fd960e3c6c8f8b98d5d5b425a07a32407e440ff455267e9fd16` |

The [repeatable procedure](researcher-reconciliation-trial.md) gives commands,
prompts, exact fixture hashes, failure criteria and cleanup. Private research,
human setup details and local paths remain outside this public repository.
The retained input snapshots identify a declared fixture, not a loaded environment.
No application request, service, inference, persistence or RAG interaction ran.
This is one installed-skill agent reconciliation rehearsal, not human acceptance,
live enablement detection, full graph coverage or structured Surface validation.

The [recreation handoff](recreation-handoff.md) records proposed portable roles,
recipient binding responsibilities and a required consumer proof. The separate
application assessment remains private. No Lab adapter or recreation was executed.

## Review corrections and checks: 0.1.4

Independent review identified two corrections: check the installed version before
reuse and refresh a Git marketplace snapshot before reinstalling; and label an
edge declared only when an applicable declaration supports it. Candidate 0.1.4
narrows that instruction. It does not change the discovery method or note storage.
Current skill SHA-256:
`ed490cf27c127896ea7db0a630bfe24e784508fde2c50c34e2e2dbee8d0bc55a`.
Current discovery-reference SHA-256:
`c3fc8065e573c74791b9da04154fe9e0f6c609e3cfd98ee9b72bcccec1a1d340`.

After installing 0.1.4, a targeted instruction regression correctly kept an MCP
SDK-only clue and an unsupported proxy hypothesis out of a selected graph's
declared edges, while retaining an applicable staging OIDC configuration as
declared with its runtime state unknown. This was a synthetic interpretation
check, not new source or UI evidence. The source-backed graph and continuation
trials below identify their earlier candidate versions and exact digests.

Current checks used macOS ARM64, Codex CLI 0.139.0 and Python 3.14.7. All eleven
installed 0.1.4 files matched the local candidate; manifest identity/presentation
and skill metadata validation passed. Nine changed Markdown files passed
markdownlint-cli2 0.24.0 with MD013/MD041 disabled; Lychee 0.24.2 reported 68 local
links/anchors OK, zero errors and ten excluded. JSON examples parsed (syntax only),
the 19 existing offline Python workflow tests passed, shell syntax passed, and
whitespace checks passed. The eight paused #16 files retained their initial hashes.
No npm/library/CLI changes are included or claimed tested by this increment.

An earlier broad lint attempt inherited repository-wide globs and reported the
existing MD018 issue at `startup-human-check.md:171`. That unrelated file was left
unchanged; the final lint above targets this increment's files. Independent review
found no remaining blocking issue after the two corrections.

The implementation was pushed at
`de65eeb477c0780fffb2f700ff93d6f04ea201af`. A Git marketplace snapshot still at
`3eff6fdd710f7670d4511f83233a01444d658408` was then refreshed with
`codex plugin marketplace upgrade n8r-surface --json`, followed by
`codex plugin add n8r-surface@n8r-surface --json` and the installed-list readback.
All exited 0; upgrade reported no errors, the fetched snapshot matched `de65eeb`,
and exactly one enabled 0.1.4 was listed from the Git source. All eleven installed
files matched the committed package. The four numbered private research notes
and all eight paused #16 files retained their hashes. This rehearses the update
path without a manual clone/build; it does not establish Work UI refresh behavior.

## Graph-first discovery guidance: 0.1.3

The user expanded the scope to an AI Surface discovery map, reuse of applicable
product knowledge, reconciliation of existing descriptions, and permitted live
UI/API evidence. The graph is primary; configuration is inspected only when it
establishes or explains relevant nodes/edges. The guide distinguishes possible
connections, a declared setup and dated running-state observations; enabled is
not exercised. It remains one AI Surface Model with partial descriptions.

The installed package now contains three references. All eleven installed files
were compared byte-for-byte with the source package. Skill entrypoint SHA-256:
`79257c192dc629ebfa06722b579d61481dafa62ca4d306c2f1c0438b01f66251`.
Discovery reference SHA-256:
`2a0df014620907119d6767712f829ca1bad35119107482ea88266a2d2de5e274`.
The [human guide](researcher-discovery.md#graph-discovery-reconciliation-and-live-evidence)
contains the actual prompts and expected evidence for discover, reconcile and live
inspection; these are conversational intents, not new CLI commands or adapters.

Before the new reference, a fresh evaluator read installed 0.1.2 and considered
five synthetic starting conditions. It already distinguished possibilities,
source declarations and runtime uncertainty correctly. It reported that discovery
sequences, reconciliation intake and live-inspection procedures were inferred
from general principles, rather than explicitly supplied by the skill. This is
an observed guidance gap, not a demonstrated reasoning failure or quality benchmark.

A separate fresh evaluator read installed 0.1.3 and all three references, then
answered these supplied synthetic cases without scenario tools or saved outputs:

| Given / user task | Observed bounded response |
| --- | --- |
| Unknown folder; browser-tooling package manifest, unread Python server, unrelated theme settings; identify AI relevance. | Inspect structure/entry points; do not infer runtime or AI relevance from filenames; leave unrelated theme settings out. |
| Docs-only product describes optional OIDC/retrieval and unavailable code. | Map documented alternatives; implementation and selected composition remain unknown; missing code does not prevent useful work. |
| Code-only SDK dependency and custom inference base URL, many unrelated packages, no runtime access. | Trace caller and endpoint binding; do not infer provider identity from SDK vendor or inventory unrelated packages. |
| Older guide and two prior Surfaces select different identity providers. | Check identity/revision/scope, preserve both compositions and ask for current selection; do not union them into a deployment. |
| Staging R1 Surface claims OIDC enabled; R2 file says disabled; admin access refused. | Compare revision-scoped declarations, preserve R1, leave effective state unknown and do not bypass the refusal. |
| Supplied hypothetical stored-settings view says OIDC on, issuer at a reserved example domain, masked secret; no runtime test. | Record a dated stored-setting connection claim; do not reveal secrets, save settings or claim effective loading/login. |

This verifies one instruction-reading response per case, not a statistical
benchmark, actual reconciliation tool implementation or real computer-use trial.
Component equivalence across unfamiliar vocabularies and ambiguous UI indicators
still require evidence/judgment; unsupported meanings stay explicit. No real
admin system was selected or inspected. Live inspection remains **unverified**.

A separate fresh evaluator then loaded installed 0.1.3 and researched the actual
LibreChat checkout, reusing the saved authentication successor. Its prompt asked
for a shallow AI-relevant graph and graph-relevant settings; it supplied no
expected architecture. The agent read 12 additional source files, re-read the
server entry point and contributor guidance, then saved/read back
`graph-discovery-001.md`. Its edge table covered documented chat/API entry,
Agent orchestration/provider options, conditional MCP discovery, persistence and
MongoDB support, and file-processing/RAG calls. It retained the scoped human
authentication choice while leaving concrete model/provider, MCP and storage
instances and runtime use unknown. An initial broad search was truncated;
focused source reads supported the retained claims. The agent corrected one
README citation during readback.

The parent independently read the saved graph, verified its digest and all 14
source hash rows, and spot-checked the MongoDB connector and RAG request evidence.
Graph-note SHA-256:
`fc9b03d6b718b60c60c3e5b5bf6c74f460697abe2905aa5b0425df545bea50d5`.
This is one source-reading graph rehearsal on the same LibreChat revision/dirty
state as the 0.1.2 trial, not a deployed or exercised graph. Private deployment
configuration, credentials and infrastructure details are not published here.

The user then supplied additional setup context. The agent preserved the first
graph and saved/read back `graph-discovery-002.md`, retaining that context as a
dated human report, not source or live verification. The parent independently
reopened it and verified the retained statement, earlier human choice and digest:
`0dbd8739725e80f86a6bc9b6d3bb41bb5587bbd694e95f646f284fd05a657a53`.
The private setup statement and local paths remain outside this repository.

## Predictable notes and real-source trial: 0.1.2

The [RESEARCH-01 guide](researcher-skill.md#research-01-investigate-and-continue)
now starts with one useful investigation, followed by a human answer and
continuation. LOAD-01 remains a separate lifecycle check. The skill adds a local
default of `~/Documents/n8r-surface/research/<source-slug>/<topic>-001.md`, resolves
and shows the destination before saving, and retains numbered successors.
User-selected and predecessor folders take precedence. Temporary host storage
does not count as a persistent user-owned folder.

**Before the change:** an independent agent loaded installed 0.1.1 and investigated
authentication in an actual LibreChat checkout. It produced a useful note, with
file references, unknown selections and source/runtime limits. The existing skill
did not define a folder/naming convention: the agent chose its own timestamped
filename in a Documents research folder. The parent independently reopened the
note, checked its source manifest against all 15 files (11 source reads, three
search-only sources and contributor guidance), and spot-checked cited local/LDAP
routing and federation gates. This is a successful bounded source investigation
with a storage usability gap, not a failed research claim.

Source: upstream LibreChat revision
`e1dfc10449ff713faffacd60273fddcfe2c0a698`, with one reported tracked change in
`client/package.json`. The modified file and deployment credentials were not
read; the dirty state was unchanged after research. Ignored deployment files
were not inventoried. Private notes and machine paths are not committed here.
The saved baseline note's SHA-256 was
`13a7327e1d89024d6b2ed21c28d1a368011da13aa611bdc62de431e48f49ced5`.

**Repository installation:** on Codex CLI 0.139.0, registering
`injectionator/n8r-surface --ref feat/17-researcher-skill` and installing
`n8r-surface@n8r-surface` both exited 0. The fetched Git snapshot was
`3eff6fdd710f7670d4511f83233a01444d658408`; the installed list contained exactly
one enabled 0.1.1 from that Git marketplace. This exercised the future-user route
without a manual clone or build. Switching back to the local candidate initially
failed because the same marketplace was registered from a different source.
Removing that registration, registering the local checkout and installing again
all succeeded. All ten installed 0.1.2 files matched the source package bytes;
the manifests agreed on identity, version and presentation. No model API or
source-service startup was added. Work picker availability is still unverified.

**After the change:** a fresh agent read installed 0.1.2 and its two references,
inspected 12 actual LibreChat source files, resolved the default destination,
saved `authentication-001.md` and read it back. The user supplied a real intended
authentication choice during this chat; the note retained it as dated human
intent, separate from effective deployment state. The investigation was interrupted
when the user broadened the design discussion; the agent saved the completed
reads as a partial note without claiming deeper investigation of that choice.

A different fresh-context agent received only the installed skill, saved note
and source location. It recovered the human choice from the note, re-established
the same source commit/dirty state, re-read `api/server/routes/auth.js:67-80` and
`api/strategies/localStrategy.js:13-61`, and checked their hashes. It saved/read
back `authentication-002.md`, preserving the original, identities, evidence,
uncertainties and unanswered question. The parent independently read both saved
files, verified their digests and human-choice retention, and checked the 12
original source hashes plus the successor's two repeated evidence rows.

| Saved result | SHA-256 |
| --- | --- |
| Initial numbered note | `db1b17df17121406420253915a9ad7ff07390ad01029e05c3e4098b1441542bb` |
| Fresh-context successor | `c3a1dcb8caedddabb2589b7f57b7a3f2f0c8a9e907e8ca7ccfe273b2f12bef94` |

This establishes one separate-agent continuation on the same local filesystem,
with actual human input. It does not establish Work UI discovery, human acceptance,
a running authentication integration, cross-host continuation or the standalone CLI.

## Branding update: 0.1.1

The plugin and skill now display **n8r-surface Researcher**, with the qualified
invocation `n8r-surface:research`. The renamed package installed successfully
through `codex plugin add n8r-surface@n8r-surface --json` (exit 0).
Removing the superseded `n8r-researcher@n8r-surface` package also exited 0; the
marketplace's installed list then contained exactly one enabled 0.1.1 candidate.
All ten installed files matched the source package, and the skill frontmatter
validator passed. The saved research note's digest was unchanged after removal.
Changed Markdown passed markdownlint-cli2 0.24.0 with the existing MD013/MD041
exemptions; Lychee 0.24.2 reported 37 local links OK, 0 errors and 11 excluded.
The staged whitespace check passed.

The skill differs only in name, heading, version and its identification in notes;
the investigation instructions and both references are unchanged. The original
behavioral trial below applies to 0.1.0 and was not repeated for this rename.
The old skill digest was
`8310917d4854f6ff35c1f9fe520b7d70355c868ea6972ebe48975498f16ba1f9`.
Work UI availability of the new name still needs a fresh-chat check using
[LOAD-01](researcher-skill.md#load-01-install-invoke-remove-reinstall).

## Initial local package behavior: 0.1.0

Environment: macOS ARM64, Codex CLI **0.139.0**, Python **3.13.1**.
The local CLI's supported `plugin marketplace`, `plugin add`, `plugin list` and
`plugin remove` commands were inspected before use. No credentials were read,
provider was configured or external model API was called for the package checks.

| Interaction | Actual result |
| --- | --- |
| Register this repository marketplace | Exit 0; `n8r-surface` registered. |
| Install the portable root-manifest-only candidate | Exit 1: `missing plugin.json`. The installed client did not accept the newer root manifest alone. |
| Add the documented Codex compatibility manifest and repeat installation | Exit 0; `n8r-researcher@n8r-surface`, version 0.1.0, installed and enabled. |
| Remove this exact plugin | Exit 0; its installed list became empty. |
| Reinstall the same candidate | Exit 0; exactly one installed/enabled 0.1.0 entry. |
| Read back installation | Every installed package file matched the source package bytes. |
| Read back saved research across removal/reinstall | The note's SHA-256 remained unchanged. |

The bundled skill passed the local skill-creator frontmatter validator. The
optional Agent Skills `compatibility` field was omitted because that validator
rejects it even though the open specification permits it; host requirements are
stated in the instructions instead. These checks establish bounded package and
local CLI behavior, not universal host compatibility.

## Initial behavioral trial: 0.1.0

A fresh evaluator received only the two synthetic Lumen source documents and a
request to research components/configuration, preserve evidence/gaps, ask a useful
question and save notes. It received no expected answers or previous findings.
The baseline used no supplied Researcher skill. It retained the main source facts,
conflict and uncertainty, but did not record exact source hashes or stable
component labels. This is a narrow baseline observation, not a quality benchmark.

A separate fresh evaluator then read the **installed** skill and both references,
and performed the same task against independent copies of the raw documents.
It saved Markdown notes and read them back. The developing agent independently
read the result and checked source identities and required facts:

- The note identifies `research-ai-surface 0.1.0`, both sources, line ranges and
  SHA-256 hashes. The hashes match the supplied bytes.
- It preserves the 10/25 batch-limit conflict, unknown model/version, untested
  Harbor integration and the settings document's scoped absence of an embedded
  archive database.
- It keeps one archive-service role with separate document/audit connections,
  stable component labels, optional unselected choices and an unanswered question.
- It labels the result as working notes and does not claim runtime verification,
  contract conformance, a deployment or complete repository coverage.

The underlying source digests were:

| Source | SHA-256 |
| --- | --- |
| `lumen-guide.md` | `98d3374c79c166b37f0debb4ffb5e457eda1385dd7847b042cbad674cac98693` |
| `lumen-settings.md` | `e94431bce92dc374a3aa58e31c8af78f7dfc61d7b34510ef38552d600d2489b7` |

This was a fresh agent evaluation through the current tool harness, explicitly
loading the installed file. It was **not** a Work-mode picker/discovery test,
human-answered conversation, fresh-chat continuation or LibreChat investigation.
The developer did not supply the findings or populate the evaluator's output.
No synthetic research output is represented as real LibreChat evidence.

## Initial repository checks: 0.1.0

The skill frontmatter validator passed. The two manifests agree on package
identity/version and presentation, and installed files and bundled licence texts
were independently compared with their sources. The saved note's source hashes
were checked against the original fixtures.

The Python fixture/workflow suite passed all 19 tests; `bash -n scripts/flow` and
`git diff --cached --check` passed. Markdownlint-cli2 0.24.0 checked the 13 changed
Markdown files with MD013 and MD041 disabled, matching the separate onboarding
check proposal's style. The bare no-argument lint command cannot discover a
configuration on this base revision; its repository-wide configuration is not
merged yet. Lychee 0.24.2 checked local links/anchors across repository Markdown,
excluding Git/dependency/virtualenv directories: 234 OK, 0 errors, 47 excluded.

Citation validation was attempted with cffconvert 2.0.0 but could not run because
this base has no `CITATION.cff`; that file belongs to separate onboarding work.
No CLI implementation or npm dependency changes are included in this increment,
so the paused CLI modifications and their test results are not its evidence.

## Remaining Work-mode acceptance

The computer-use tool refused access to the ChatGPT desktop application, reporting
that the app could not be used for safety reasons. No UI interaction was attempted
after that refusal. The [LOAD-01 procedure](researcher-skill.md#load-01-install-invoke-remove-reinstall)
is ready for a human rehearsal in ChatGPT desktop / Work. Record the desktop
version, visible installation/selection state, invocation evidence, saved note,
removal in a fresh chat and successful reinstall before marking it passed.

A successful test must also retain user research outside the plugin cache.
Uninstallation does not erase an old chat's instructions or content. Do not infer
unloading from an old chat's behavior, or infer Work support from CLI JSON alone.

Further #17 work: human Work-mode acceptance, real live UI/API inspection,
broader Harbor/LibreChat and reconciliation trials, structured HTML and Surface
outputs, n8r-labs adaptation in its own repository, and the later installed-Codex
standalone runner. Both #16 and #17 remain open.
