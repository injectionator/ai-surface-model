# n8r-surface critical path

The first usable outcome is a standalone Researcher that reads supplied repo/docs,
works with a human, saves an HTML research record and produces a partial AI
Surface Model description in JSON or YAML. The user can find the files, edit them
and resume safely. No running target or Lab is required.

Implement n8r-surface first, then integrate its Researcher core into n8r-labs.
Review the application requirements during contract design, without making
application implementation or prompt extraction a dependency of this path.

**Current work:** [#15](https://github.com/injectionator/n8r-surface/issues/15)
has an experimental [contract](contracts.md),
[synthetic cases](../../examples/researcher/README.md),
[host boundary and Lab review](host-contract.md), and
[implementation decisions](implementation-decisions.md) in draft
[PR #24](https://github.com/injectionator/n8r-surface/pull/24).
It is stacked on planning PR #18 and is not merged. The user has authorized
#16's first [bare-startup increment](startup.md), stacked on #15 in
[PR #25](https://github.com/injectionator/n8r-surface/pull/25). Its read-only
overview is [verified through the installed command](startup-verification.md);
the rest of #16 remains open. Source-repository
analysis and the live Researcher workflow remain #17's work.

The [command intent and verification specification](command-outcomes.md) was
approved on 4 November 2026 and governs subsequent delivery. The independent
review's array-prototype correction is implemented and verified through the public
API and installed package. See the [evidence and limits](verification.md).
The #15 implementation is available in its draft PR for human acceptance; this
does not authorize review readiness or merging. The separate authorization for
#16 covers STARTUP-01 only.

```mermaid
flowchart LR
    Map[14: Map and delivery structure] --> Contract[15: Artefact contracts and examples]
    Contract --> Local[16: Setup, sources and safe storage]
    Local --> Research[17: Researcher, one runner and portable skill]
    Requirements[Lab compatibility requirements] -.-> Contract
    Research --> Result[First standalone workflow demonstrated]
    Result -.-> Lab[Application project: host the same Researcher core]
    Lab -.-> Verified[Verify shared behaviour, import and continuation]
```

## 1. Define artefacts with concrete examples

**Issue:** [#15](https://github.com/injectionator/n8r-surface/issues/15).

Define a versioned experimental HTML research record and partial Surface graph.
Use synthetic sources for two unrelated products and show how selected findings
compose into one description. Establish which representation owns each fact in
the HTML, how manual edits are retained, and what a revision identifies.

Specify JSON/YAML preservation rules and examples with attributed nodes and
relationships, shared components, cycles, multiple connections, unknowns and
conflicting evidence. The [implementation decisions](implementation-decisions.md) select TypeScript,
Node.js 22/24/26, the `n8r-surface` npm package, npm/Node testing and an OpenAI
Responses API adapter for #17. Runner implementation and credentials are not
needed by these offline contract checks.

Review the [compatibility contract](design.md#compatibility-contract) against
n8r-labs requirements: source access, human questions, artefact persistence,
version handling and continuation. Record gaps and supported boundaries using
public, synthetic examples. This review does not implement the application.

**Advance when:** the examples and checks give #16 and #17 concrete contracts,
including a documented route for n8r-labs to consume the shared core later.
Do not relabel existing illustrative fixtures as schema-conforming without
specifying and checking them.

The [command outcome spec](command-outcomes.md) must also give each subsequent
increment a user task, initial state, actual input and independently verifiable
result. Contract fixtures alone do not pass a command's acceptance case.

## 2. Build the local foundation

**Issue:** [#16](https://github.com/injectionator/n8r-surface/issues/16).
**Depends on:** #15.

Implement startup/status, missing-setup guidance, current-directory and explicit
source selection, and the configured artefact folder. Provide bounded tools to
list, read, create and revise records. Updates check the version read earlier,
retain a recoverable previous revision and complete atomically.

Implement in TypeScript and package the built CLI and required assets for npm.
Verify the installed tarball on supported Node.js versions independently of the
source checkout. Bun may support development/builds but is not an end-user
requirement. Package tests do not require publishing a release.

STARTUP-01 selects `~/.n8r/n8r-surface.json` for settings and
`~/n8r/artefacts` as the default corpus; `artefactRoot` in that file overrides it.
The overview displays the effective path; see [settings decisions](startup.md).
Keep AI selection separate from an optional Lab destination. Preserve invalid
configuration for repair; non-interactive commands must not wait on a prompt.

**Advance when:** synthetic tests cover first run, missing/unwritable paths,
unavailable runners, interrupted saves and human edits between read and write.
The executable is a local foundation at this point; it must not present an
unconnected discovery command as working research.

Start with [STARTUP-01](command-outcomes.md#startup-01-run-the-command-and-see-what-is-here):
given a configuration file and one saved artefact, running `n8r-surface` alone
shows readable non-private settings and their locations, one line for that artefact,
and known process status or an honest unknown. Verify this simple terminal example
before the more involved research paths; it requires no AI or Lab connection.

Exercise those behaviors through the installed command as well as internal
handlers. Record the applicable SETUP, STATUS, INPUT, SCOPE, SAVE, HELP and
NONINTERACTIVE cases from [the outcome spec](command-outcomes.md#other-required-paths-and-failure-outcomes),
including actual before/after state and independent readback.

## 3. Demonstrate the Researcher workflow

**Issue:** [#17](https://github.com/injectionator/n8r-surface/issues/17).
**Depends on:** #15 and #16.

Implement and version the shared Researcher skill in this repository, connecting
one supported AI runner and the local tools. No application extraction is required.
Support a human question, source inspection, saved findings, consequential
follow-up questions, corrections, continuation and JSON/YAML model output.
Package the same core skill for ChatGPT with supplied documents, the first
external host. Host adapters provide access; they do not maintain separate
versions of discovery knowledge.

**Advance when:** a real supported-runner session completes the workflow on
permitted examples, the records survive save/reopen, and a second product works
without product-specific code. Compare facts, selections and gaps across the
CLI and external skill; generated wording need not match. Record any host
limitation and do not claim untested compatibility.

This completes the first standalone milestone. It does not establish that a Lab
importer accepts the output; that needs a separate named-consumer trial.

Use [E2E-01](command-outcomes.md#e2e-01-research-a-repository-and-produce-a-durable-record)
as the minimum complete path: locate the repo, load and follow the identified
Researcher instructions, interact with the human, save and reopen the actual
artefact. Exercise [E2E-02](command-outcomes.md#e2e-02-apply-the-same-path-to-librechat)
before claiming LibreChat research. Record actual tool/runner evidence and saved
state; do not substitute developer-authored findings or a fake runner.

## Work after the first milestone

The next application stage belongs in the n8r-labs project: use an identified
Researcher revision with the Lab's own source access, AI, conversation and
storage adapters. Use the shared examples to verify research behaviour and
import an incomplete standalone record/definition, then continue it in the Lab.
Preserve identities, evidence, gaps and user decisions; report unsupported data.
Record the tested application and contract versions before claiming compatibility.

The [capability map](README.md) also retains remote Researcher execution,
additional AI runners, MessagePack and standalone executables. Create their
delivery issues when their consumer contracts and acceptance cases are concrete.

Keep browser editing, a general database, automatic two-way synchronisation,
advanced indexing and deployment automation outside this first path. Users can
choose their own editor; safe Researcher-assisted updates are sufficient here.

## Review and evidence

Each issue uses its own branch and draft PR in this repository. Link the primary
issue with `Closes #N` only when complete; use `Related to #N` for a partial
increment and retain its remaining scope. Link the overview with `Related to #13`.
Keep draft status
until review readiness is authorised; merging and releasing are separate steps.

Run the relevant [repository checks](../../CONTRIBUTING.md)
and the issue's acceptance cases. Distinguish file syntax, reference integrity,
model behaviour and actual consumer compatibility. Update the map and this path
when scope or dependencies change so the next task remains explicit.
