# Command intent, outcomes and verification

This is the product acceptance specification for `n8r-surface`. It defines what a
person should be able to accomplish, what changes, what they can observe, and how
to verify those outcomes. Implementation plans and lower-level tests must serve
these tasks. A passing codec test does not establish a working research command.

**Status:** proposed command behavior for review. At the current draft
implementation revision `a2dae4d`, the package contains an experimental artefact
library and fixtures but no command entry point, Researcher instructions or AI
runner. None of the command scenarios below has been exercised successfully.
The existing library checks are supporting evidence only.

This specification applies the task-driven development approach requested by the
user: define a real task, attempt it through the product, observe the gap, develop
what is missing, then repeat the same task. It does not publish private Lab
implementation material or require that application to be running.

## Governing development loop

Before implementing a capability:

1. Name the missing user task and why it matters.
2. Define **State X**, the actual **Input Y**, and independently assessable
   **Outcome Z**. Include the expected changes, observations and evidence source.
3. Attempt Y through the current installed product in X. Record what it actually
   does. If the entry point, credentials or environment are unavailable, record
   the blocker; do not invent a baseline failure or bypass the product.
4. Compare actual behavior with Z and bound the next implementation increment.
5. Add supporting automated checks for that gap and implement the increment.
6. Repeat the original interaction through the installed product. Reopen/read back
   its outputs independently, compare them with Z, and record the result and limits.

The developing agent builds the Researcher's capabilities. It must not perform
the research itself and place prewritten answers in the output as proof that the
command works. A canned runner can test orchestration, but it is not a real-runner
research rehearsal. The same distinction applies to mocked storage and source reads.

A useful increment ends in visible, reproducible evidence or a concrete statement
of what remains unverified. Preserve the user task when implementation changes;
do not redefine success around whatever the code currently produces.

## Initial public command inventory

This is the complete proposed terminal surface for the first standalone milestone.
It consolidates the already planned startup, status and discover commands and adds
explicit help/version behavior for review. Corpus operations below are conversation
intents, not additional undocumented subcommands. Any later command or option must
be added to this inventory with its own outcome and verification case first.

| ID | Invocation | User intent and delivered outcome | Observable change and verification |
| --- | --- | --- | --- |
| CMD-01 | `n8r-surface` | Find out whether the tool is ready; configure missing setup interactively; enter a conversation when ready. | Read back effective nonsecret settings after an accepted setup change. Observe the conversation or a specific blocker. Verify no source was inspected/transmitted merely by starting. |
| CMD-02 | `n8r-surface status` | Know the effective configuration, runner availability, artefact destination and missing prerequisites. | Display their states and origins without modifying files, scanning sources or invoking inference. Compare with controlled settings/files and runner availability; distinguish configured from successfully exercised. |
| CMD-03 | `n8r-surface discover` | Research the current directory with the human. | Establish cwd as the source scope, follow the identified Researcher instructions, inspect permitted material, ask relevant questions and save an attributable HTML research record. Verify with E2E-01. |
| CMD-04 | `n8r-surface discover ./product` | Research an explicitly selected directory. | Resolve the path from invocation cwd and report the actual scope; prove the intended source was read, with no fallback to a different repo. Verify source identity/read evidence and the resulting artefact. |
| CMD-05 | `n8r-surface discover ./documents/architecture.md` | Research one supplied document. | Inspect that file and retain file-only coverage. Reopen the resulting record and confirm it does not claim repository-wide inspection. |
| CMD-06 | `n8r-surface --help` | Discover the complete supported command surface and its effects. | Display syntax, purpose, source/destination behavior and links to details; exit without setup, source access, inference or writes. Compare with this inventory. |
| CMD-07 | `n8r-surface status --help`, `n8r-surface discover --help` | Understand the selected command before invoking it. | Display that command's inputs, outputs, side effects and limitations; no operation or setup begins. |
| CMD-08 | `n8r-surface --version` | Identify the installed tool being used or verified. | Display the package/build version without inference or mutation; compare with the installed package manifest. |
| CMD-09 | Unknown command, unknown option or invalid arguments | Receive an actionable explanation without unintended work. | Report the invalid input and applicable help, return failure, and leave source/corpus/settings unchanged. Never interpret a typo as permission to research. |

`discover [source]` also accepts an explicit absolute local source path; the
resulting portable artefact uses source IDs/portable locators rather than leaking
that machine's path. A directory need not be a Git repository. Git identity and
working-copy changes are recorded when present; otherwise file identity, hashes
and inspected coverage establish the source snapshot.

This inventory does not introduce `init`, `config`, `list`, `show`, `resume`,
`export`, `deploy` or other standalone subcommands. If real task attempts show a
need for them, specify and review their intent before adding them. Effective
settings are configurable as required by the design; the exact override syntax
must be added here when #16 selects it, before implementing that syntax.

Successful noninteractive informational commands exit successfully. Invalid input,
missing required setup and unavailable capabilities return a failure with a
specific reason; they must not wait on a prompt. Bare startup or discovery with no
interactive input must explain the required interactive path and finish promptly.
A future unattended-research interface needs an explicit answer/selection policy;
it is not implied by this first interactive workflow. Exact error codes belong in
#16's parser contract and must preserve these observable distinctions.

Until #17 connects the actual Researcher, #16's `discover` reports that research
is unavailable. Printing a prompt or writing a placeholder HTML file is not CMD-03,
CMD-04 or CMD-05 success.

## Conversation intents are part of the product surface

The conversation opened by startup/discovery must support these user tasks.
Wording is illustrative; outcomes, not exact phrasing, are the contract. Each
session establishes a source scope and destination explicitly enough to prevent
an accidental source or artefact change.

| ID | Human input or intent | Required change/outcome | Independent verification |
| --- | --- | --- | --- |
| CHAT-01 | "Research this supplied repository/document." | Establish the actual source, inspect permitted material using the Researcher instructions, retain evidence/gaps, and produce a research record. | Compare source-access evidence and attributed findings with the supplied snapshot; reopen the saved HTML through the reader and in a browser. |
| CHAT-02 | "Include the archive, but leave callbacks undecided." | Record the human's choice and unresolved option; ask a useful follow-up when the choice matters. | Read the saved decisions/questions and later selected graph. An undecided possibility must not become a selected edge. |
| CHAT-03 | "Save this research." | Persist the accepted record to the selected destination and report its identity/revision and actual location. | Read the file independently after the command returns; compare identity, revision and digest. A chat statement alone is not save evidence. |
| CHAT-04 | "Find and open the research I saved for this product." | List only the relevant permitted corpus and let the human select the intended record; no implicit resume or new source upload. | Match the displayed selection to saved IDs/revisions and original bytes; verify no unrelated record changed. |
| CHAT-05 | "Continue this record with this second document." | Establish access to that document and create a successor retaining earlier identities, evidence, decisions and unresolved work. | Compare before/after records, source hashes and parent digest; reopen both. Earlier revisions remain intact. |
| CHAT-06 | "I corrected this note/choice." | Preserve the edited bytes, review ambiguity with the human and produce an agreed successor, or report a conflict. | Keep before/edited/after versions; verify the correction is in both readable HTML and data, with no lost extensions or changed historical evidence. |
| CHAT-07 | "Make a Surface for the options I selected, and save it as JSON/YAML." | Produce a separate partial selected definition with sources, requirements and gaps; preserve the research record. | Reopen the actual output, resolve exact research references, compare selected nodes/edges to the human's decisions, and check supported JSON/YAML equality. |
| CHAT-08 | "Change the output folder/runner preference." | Show the proposed effective change and apply the human's selection without moving old artefacts or transmitting sources implicitly. | Read effective settings through `status`; check old files and source-access/inference evidence. Runner and optional Lab destination remain independent. |

A host that can only supply downloads must say so and provide the real download;
it cannot claim to have saved into a local corpus. This command milestone uses
local persistence. External skill and Lab hosts have separate verification rows.

## State X, input Y, verified Z

Every acceptance case records these fields before implementation. Expected values
come from the task and controlled sources, not from the implementation under test.

| Field | Required content |
| --- | --- |
| Intent | The user's useful task and why it matters. |
| State X | Tool/build revision; instruction revision; initial settings and corpus; source snapshot/dirty state; permitted scope; runner/model and availability; interaction mode. Never include credential values. |
| Input Y | Exact command from its invocation directory, relevant user questions/answers and any supplied files. |
| Expected change | Files, records, revisions, decisions or configuration that should be created/changed, and important state that should stay unchanged. |
| Expected observations | What the terminal/conversation should show, including evidence references, questions, limitations and actual output location. |
| Verification Z | Independent source checks and persisted-state readback that establish each expected outcome. Name the evidence, not just a test command. |
| Actual result | What happened, with the exercised entry point and returned output; distinguish it from the expectation. |
| Assessment | Pass, fail, blocked or not attempted, with criterion-level results and remaining limits. |

The verification record must also identify who performed it, the date, environment,
installed package revision and retained evidence location. Redact private material
before publishing evidence; use public/synthetic fixtures for retained repository
records. A private rehearsal can retain its evidence privately and publish only
permitted conclusions and limits.

## E2E-01: research a repository and produce a durable record

**Intent:** understand a supplied product repository with Researcher and retain
findings and human choices for later continuation. This is the minimum complete
path through source access, instructions, inference, human interaction and storage.

**State X:**

- Install the built package into a temporary consumer environment, independent of
  its source checkout. Record its package/build, instruction and contract versions.
- Create a temporary Git repository containing the two tracked Lumen source
  documents from [the shared fixtures](../../examples/researcher/README.md), with
  a known commit and matching byte hashes. Copy no research HTML or answer files
  into this source repository. Run the command from a different directory.
- Start with valid explicit settings, an empty artefact folder, no Lab connection,
  a supported configured real runner/model and authorized transmission of only
  these synthetic documents. The human can answer through the real interface.
- Preserve a before snapshot of settings, source and corpus. The independently
  specified facts are: guide limit 10, settings limit 25, no known model version,
  optional archive delivery, external identity and callback choices. Do not load
  the expected research record into the runner's context.

**Input Y:**

```sh
n8r-surface discover ./case-source
```

The human asks: "Research the components and configuration choices in this repo.
Tell me where the sources disagree and ask which options I want to include."
When Researcher presents the consequential choices, the human answers: "Include
archival delivery and external identity. Leave callbacks undecided and keep the
batch-limit conflict unresolved. Save the research." Both turns go through the
command's actual conversation; do not inject the decisions directly into storage.

**Outcome and verification Z:**

| Step | What must happen or change | What we observe | How we verify it |
| --- | --- | --- | --- |
| 1. Find the repo | Establish the supplied repo as the source scope. | Selected source identity and inspected coverage; missing/unreadable material is explicit. | Match reported commit/working-copy state and inspected file hashes to the prepared repo. Check source-read events target only the permitted scope. |
| 2. Follow the Researcher instructions | Load an identified instruction revision and use it to research source evidence. | Instruction version/hash in the session evidence; claims linked to actual source reads and limitations. | Compare the loaded instruction hash with the packaged asset; inspect the actual runner request/tool trace and source-grounded behavior. A version label alone is insufficient. |
| 3. Interact with the human | Record requested selections, leave callbacks unresolved, and handle a relevant follow-up or correction. | An actual question/answer or correction exchange, with its consequence explained. | Match the transcript to saved decisions/questions. Do not count hard-coded answers or post-hoc edits by the developing agent. |
| 4. Preserve findings and uncertainty | Retain the 10/25 conflict and unknown model version without inventing a resolution. | Both attributed claims and the unknown are visible in the result. | Check them against the two frozen sources independently, including precise source locators and hashes. Exact generated wording need not match. |
| 5. Produce the artefact | Create a nonempty HTML research record at the selected destination. | The command reports the actual path, identity, revision and remaining gaps. | Read those bytes from disk after completion; parse with `readResearchHtml`, inspect readable HTML, and verify source references and decisions. A success message/file existence alone is insufficient. |
| 6. Reopen useful saved work | Exit and open the saved record through a fresh command conversation. | Previous findings, choices and questions remain available; no silent rerun or upload. | Compare reopened identity/revision/digest and retained decisions with the saved output; inspect the real read operation. |

**Pass:** all six steps are evidenced through the installed command with the real
runner and actual saved bytes. Record unsupported or failed criteria explicitly.
A fixture-library pass, fake runner, developer-authored artefact, or demonstration
that skips interaction or reopening cannot pass E2E-01.

**Current result:** not attempted; blocked by the missing CLI, Researcher instruction
bundle and runner. The supplied synthetic HTML files demonstrate the artefact
contract only. They are not outputs of this command scenario.

## E2E-02: apply the same path to LibreChat

Before claiming LibreChat research works, repeat E2E-01 on a permitted, explicitly
selected LibreChat checkout, recording its exact upstream revision and dirty state.
Use a bounded task: "Describe the authentication path and the components and
configuration it depends on. Show the evidence and unknowns; ask what I want to
include, then save the research."

Before running, identify the expected relevant source files and a small set of
checkable facts directly from that frozen checkout. Record those expectations
separately from the runner input. Verify that the command really reads those
sources, distinguishes supported options from the user's chosen setup, and does
not mistake repository documentation for a running integration. Missing optional
sources remain coverage gaps. Review unexpected findings against the source;
do not require a fixed prose answer or silently drop supported new evidence.

Apply all six verification steps above, using actual persisted outputs. Also
check that the same product-agnostic instructions work without LibreChat-specific
control flow. The source version, independent expected-fact set and real output
must be recorded when exercised; none is invented here.

**Current result:** not attempted. No real LibreChat research proof is claimed.

## Other required paths and failure outcomes

Each row becomes a concrete State/Input/Outcome record when its increment starts.
These checks accompany E2E-01; they are not a substitute for the complete path.

| Case | State X and input Y | Expected change and observable outcome | Verification |
| --- | --- | --- | --- |
| SETUP-01 | Missing settings; interactive CMD-01. | Explain missing setup; accept explicit choices; open a conversation when ready. | Read back settings through CMD-02 and inspect corpus creation. Verify no source scan or source upload from startup alone. |
| STATUS-01 | Controlled configured/missing/unavailable prerequisites; CMD-02. | Report actual effective status, including limits of runner verification; no mutation. | Compare output to prepared state and before/after settings/corpus, source-read events and inference-call records. |
| INPUT-01 | Unknown argument or nonexistent/unreadable source. | Specific error or explicit coverage limitation; no substituted repo or invented completed record. | Observe terminal/exit result; inspect source-access events and corpus changes. |
| SCOPE-01 | Explicit file source, or cwd different from installation and source. | Inspect exactly the intended scope, retaining omissions/truncation. | Compare read paths/hashes and saved coverage to prepared inputs; ensure file-only research does not claim whole-repo coverage. |
| RUNNER-01 | Missing credential, unavailable model, network failure or cancelled interaction. | Report blocked/partial progress honestly, preserve useful accepted work, and avoid fallback. | Inspect actual runner destination/results and saved state; no completed-research claim without evidence. |
| CONTINUE-01 | Saved incomplete Harbor r1 plus the authentication source; CHAT-05. | Add supported authentication evidence under the existing finding ID and a new revision. | Reopen old/new records; verify hashes, parent, retained decisions and new source evidence. |
| EDIT-01 | Accepted record changed manually after read; CHAT-06/save. | Preserve the manual edit, report conflict and reconcile only the human-reviewed intent. | Keep before/edited/after bytes and compare both data and visible HTML. Verify the old revision remains recoverable. |
| SAVE-01 | Unwritable destination or interruption during write. | Report failure accurately and retain recoverable previous work. | Read actual filesystem state after the failed operation; check no partial replacement masquerades as the accepted record. |
| SELECT-01 | Two researched products and explicit human choices; CHAT-07. | Save a separate selected graph with shared nodes, parallel edges, cycles, references, requirements and gaps. | Compare persisted graph to selections and exact research revisions, reopen both JSON/YAML outputs and verify supported meanings. |
| NONINTERACTIVE-01 | No interactive input; CMD-01 or discover needs a decision. | Explain unavailable interaction and terminate promptly; preserve unresolved work. | Exercise the installed process with closed input under a bounded harness and inspect its output/state. |
| HELP-01 | Any setup state; CMD-06/07/08. | Accurate help/version, no work begun. | Compare to the inventory/manifest and verify unchanged settings/corpus and no source/inference calls. |

Absence-of-side-effect claims need instrumented boundaries and before/after state,
not just an absence of terminal messages. Verification traces must omit secrets
and retain only permitted source excerpts. Record input/version metadata, tool
calls and returned evidence; internal model reasoning is not required. A later independent check can verify
the recorded readback; the implementer's report does not replace human acceptance.

## Milestone acceptance and evidence status

| Milestone | What its evidence can establish | Required product proof |
| --- | --- | --- |
| #15 | Experimental record/graph contracts, synthetic preservation/reference checks and this outcome specification. | Reviewable human-readable examples and concrete inputs for the command work; no successful command claim. |
| #16 | Installed startup/status, scoped source operations and safe persistence foundation. | Actual installed command rehearsals for applicable setup/status/input/scope/save/help/noninteractive paths. Discovery explicitly remains unavailable until #17. |
| #17 | The shared Researcher completes standalone discovery with a human. | E2E-01 with a real runner, continued/edited research and selected output; E2E-02 before claiming LibreChat support. External skill behavior is exercised separately. |
| Later Lab integration | A named consumer imports and continues supported standalone work. | The same facts/choices/gaps survive the named application's actual entry points, with limitations and losses recorded. |

Maintain an evidence record beside the capability being delivered. It contains the
case ID, initial state, exact interaction, expected/actual changes, evidence/readback,
revision/environment, verdict and unproved limits. Link it from the issue and PR.
Tests may automate parts of this process, but the record must explain what those
checks demonstrated in terms a person trying the feature can assess.
