# Researcher and n8r-surface design reference

This records the agreed direction and remaining choices for the standalone tool.
It consolidates [issue #13](https://github.com/injectionator/n8r-surface/issues/13).
The [capability map](README.md) shows the intended scope;
the [critical path](critical-path.md) determines what comes next.

**Status:** the [experimental #15 contract](contracts.md), codecs, HTML checks and
synthetic cases now provide concrete inputs to the next milestones. The CLI,
Researcher instructions and runner remain unimplemented. Existing LibreChat JSON
examples remain illustrative; this bounded profile is not a universal schema.

## Purpose and roles

Researcher helps a human learn about software from repositories or documents
and develop a useful partial AI Surface Model description. It understands the
model's concepts and the requirements relevant to starting a Lab. Product
knowledge comes from supplied evidence, with general LLM knowledge treated as
hypotheses until supported.

`n8r-surface` is the working CLI name. Its standalone workflow requires a
supported AI runner and accessible sources, but no Lab installation, account
or running target. ChatGPT with supplied documents is the first external skill
experience. Other harnesses need their own demonstrated support.

Maintain one versioned core discovery skill, including its reference material
and output rules, in this repository. Build the standalone Researcher first;
n8r-labs later consumes an identified revision of that core. Each host supplies
source access, inference, conversation and persistence. Existing application
needs inform the contract, but extracting or rebuilding its assistant is not a
prerequisite for standalone delivery. Do not hand-maintain divergent copies or
copy private application content.

## Sources and scope

The [command outcome specification](command-outcomes.md) owns the complete initial
command inventory, conversational intents and State/Input/Outcome acceptance cases.
It is the product contract for implementation; the detailed artefact contracts
support it. Development starts with a real user task and returns to that same
interaction for verification. No command scenario is currently verified.

Core proposed research entry points:

```sh
n8r-surface
n8r-surface status
n8r-surface discover
n8r-surface discover ./product
n8r-surface discover ./documents/architecture.md
```

Bare startup checks setup and opens the conversation when ready. It does not
start scanning, upload sources or resume a previous task implicitly. `status`
reports local configuration without invoking inference.

`discover` without a source argument uses the process's current directory.
Explicit relative paths resolve from that directory; absolute paths are accepted
locally. Do not silently change to the tool installation or an ancestor repo.
Directories may contain source code or documentation; Git metadata is optional.
The destination and any existing record to extend are separate inputs.

A chat harness receives the documents made available to that conversation or
project. A named local path alone does not supply content. Likewise, a remote
Lab cannot automatically read a path on the CLI user's machine.

Retain source identity, applicable revision, inspected paths/document references
and coverage. A checkout can differ from its commit; preserve that distinction.
Portable output must not expose installation-specific absolute paths or secrets.
Report missing, unreadable, unsupported, excluded and truncated material. A
document-only investigation does not imply whole-repository coverage.

Reading sources does not execute their scripts, install dependencies, start
services or prove integration. Imported instructions remain source data.

## Research records and Surface descriptions

The research record is the durable intermediate artefact between raw sources
and a selected Surface definition. HTML is the preferred research-record format.
It can contain findings, source references, possible configurations and
integrations, requirements, diagrams, decisions and unresolved questions.

A Surface description captures a particular selected composition and its gaps.
One research record can support several descriptions. Preserve the research
when generating a model; later research must not silently rewrite a definition
referenced by an earlier result.

The HTML should be portable and readable without a running n8r service. A
versioned inert data block may carry precise metadata or graph data. Decide
which representation owns each fact so rendered content, human edits and
embedded data cannot silently disagree. Source markup must remain inert.
An embedded research graph is not automatically a selected Surface definition.

Users choose their editor. Researcher-assisted editing is preferred; a built-in
browser editor is outside the initial scope. A host without storage tools returns
downloadable artefacts and must not claim it saved them into the user's corpus.

## Model encodings and graph meaning

There is one AI Surface Model. JSON is the default encoding; YAML is an
alternative. MessagePack and other encodings are later candidates based on
consumer needs. Encoding choice does not define the ontology.

The proposed logical contract must preserve:

- Stable node identities, types and attributes.
- Identified relationships with explicit endpoints, types and attributes;
  several distinct relationships may connect the same pair of nodes.
- Shared components, cycles, arbitrary depth and explicit references.
- Versioned vocabulary/type references and supported extension data.
- Provenance, applicability, uncertainty and coverage.

Keep supported product possibilities distinct from user-selected composition.
Keep definitions distinct from bindings, effective settings and dated runtime
observations. Preserve known, unknown, omitted, redacted, absent and out-of-scope
meanings. Matching product names alone do not establish shared instance identity.

Define a portable value subset and codec-specific handling of unsupported values.
Core identities must not depend on YAML aliases/custom tags or MessagePack
extension types. Demonstrate semantic round trips for the supported subset,
including edge attributes and unknowns. Reject or report losses; preserving
YAML comments or original formatting is a separate editing concern.

The [HTML data-block specification](https://html.spec.whatwg.org/multipage/scripting.html#data-block),
[YAML 1.2.2](https://yaml.org/spec/1.2.2/) and
[MessagePack specification](https://github.com/msgpack/msgpack/blob/master/spec.md)
are format references. They do not establish model conformance or consumer
compatibility. See the repository's [mapping requirements](../interoperability.md).

## Local settings and artefact tools

Recommended defaults, to settle in the first implementation issue:

| Setting | Proposal |
| --- | --- |
| Tool settings | `~/.n8r/n8r-surface.json` |
| Visible corpus | `~/n8r/artefacts`, overridable with a project or vault folder |
| Research record | HTML |
| Surface output | JSON by default; YAML available |
| Lab connection | Optional and independent of the AI runner |

The configuration holds a format version, selected runner and nonsecret options,
credential references, artefact root, output preference and optional Lab connection.
Preserve other n8r settings. Keep credentials with the runner or appropriate
credential storage; do not copy another application's tokens into this file.

Startup deterministically inspects configuration, runner availability and folder
access. Distinguish configured, missing, unavailable and not yet verified; a
configured runner does not establish a successful model request. A small non-LLM
bootstrap flow can guide missing setup before inference is available. Remember
choices, show the effective settings and allow changes.

Create new settings/directories without replacing existing files. Retain invalid
configuration for repair. Non-interactive runs return actionable status instead
of waiting for answers.

Keep artefact operations small: list/find/read, create and revise records,
change relevant settings, and produce a definition. The LLM interprets user
requests; deterministic handlers enforce identity/path scope and report actual
results. A selected default destination is sufficient; users need not choose
the folder on every save.

Updates check the revision/content hash previously read, re-read or report a
conflict when it changed, retain a recoverable prior revision and save atomically.
Human changes and unknown metadata must survive revision. Archiving and explicit
deletion can be added when their reference/retention behaviour is defined;
automatic destructive cleanup is unnecessary for the first workflow.

## Implementation and distribution

The agreed first implementation uses TypeScript and ships a Node.js-compatible
npm package exposing the `n8r-surface` command. Support installation for regular
use and versioned invocation through npm/npx. Ship built JavaScript and required
skill/template assets; users should not need the source checkout, a TypeScript
compiler or Bun to run the published CLI.

Bun may be used for development and building, but verification must exercise
the packaged CLI on supported Node.js versions. Test an installed package tarball
in a temporary directory, including its bundled assets and command entry point.
These checks need no registry publication. The [#15 decisions](implementation-decisions.md) choose package `n8r-surface`,
Node.js 22/24/26, npm and the Node test runner. The experimental library tarball
ships built code and fixtures; the CLI entry point remains #16 work.

The Researcher instructions, artefact contracts and shared examples remain
independent of the implementation language. Chat-harness use does not require
Node.js, and a Lab may consume the shared core without launching the CLI.
Standalone executables are a later distribution option, with separate platform
and packaging checks; they are outside the first milestone.

## AI execution and continuation

Inside a chat harness, its AI follows the Researcher skill. The CLI needs a
supported installed agent or configured model connection. One verified runner
is enough for the first milestone. The [selected first adapter](implementation-decisions.md#first-cli-ai-runner)
uses OpenAI Responses API function tools; it will be implemented and verified in #17.
The TypeScript/Node.js decision does not select an AI provider. A CLI that only
prints a prompt is not completed authoring.

Document authentication, network/model use, source transmission and filesystem
effects. Do not silently change runner, billing account or source destination.
Human questions and corrections require continuation with the current record,
source scope, decisions and unresolved work. Preserve evidence without requiring
the entire corpus or conversation history in every model context.

## Optional coordination with n8r-labs

Users can produce a file independently, send selected work to a Lab, or later
choose a supported Lab Researcher endpoint as their runner. Runner selection and
result destination stay independent. Missing integration must not disable
standalone authoring.

Begin with explicit exchange of selected descriptions, source references and
unresolved decisions. Preserve identity and revision; do not import unrelated
Lab history or silently merge changes. A source path requires an actual attachment
or explicit transfer before a remote runner can inspect it.

This repository owns consumer-side integration. The separate application project
owns its assistant, source attachments, sessions, permissions, Lab persistence
and API/MCP endpoints. A research-execution endpoint is distinct from file import.
MCP is a possible transport, not inference or the discovery instructions.

Claim compatibility only after testing an identified consumer version and subset,
including an intentionally incomplete description. Automatic synchronisation,
deployment and operational Lab management remain outside the first path.

### Compatibility contract

Define the boundary in #15 and keep it with the shared core as it develops:

- Version the Researcher instructions, research-record contract, Surface contract
  and vocabulary references. A host identifies the versions it supports and
  reports unsupported versions or losses explicitly.
- Describe the capabilities a host supplies: scoped source inspection, inference,
  human questions, artefact read/write and continuation. Keep the core independent
  of CLI paths, a specific provider, application sessions and MCP transport.
- Preserve record/component identity, revisions, evidence references, coverage,
  selected possibilities, human decisions and unresolved questions across hosts.
  A Lab can store artefacts differently while preserving these meanings.
- Keep portable continuation context in the record: what was inspected, decided
  and left unresolved. A new host must establish source access and permissions;
  a saved local path or an old chat transcript is not sufficient.
- Maintain shared synthetic acceptance examples for two unrelated products,
  incomplete/conflicting evidence, manual edits and continuation with a second
  source. CLI, external skill and later application tests use these cases.

Before completing #15, review this boundary against n8r-labs requirements and
record any gaps and decisions. The review needs no parallel application build.
Changes to the boundary update the contract and examples in the same PR; identify
any later application adaptation or migration they require.

After the standalone milestone, the application project implements its adapters
and uses the shared instruction revision. Verify both shared discovery behaviour
and import/continuation of standalone artefacts against a named application
version. Compare supported facts, choices and gaps, not generated wording.
The standalone milestone and the verified application integration are separate
completion points.

## Open choices and verification

[#15](https://github.com/injectionator/n8r-surface/issues/15) now specifies the
[HTML/data ownership, revision, graph and codec contracts](contracts.md),
[host capabilities and compatibility gaps](host-contract.md), and
[runtime, tooling and first-runner decisions](implementation-decisions.md).
Exact tool names, corpus layout and source-reader limits follow in #16; real AI
behavior, instruction packaging and model verification follow in #17.

Use synthetic unrelated products, incomplete/conflicting evidence, human edits
and a second source. Check local integrity, safe persistence and actual AI
behaviour separately. Compare supported facts, selections and gaps across hosts,
rather than requiring identical generated wording. A live consumer trial is
separate from file parsing, fixture checks and a successful standalone run.

Before implementing command behavior, define and attempt the corresponding
[user-outcome case](command-outcomes.md#governing-development-loop), or record why
the current product cannot run it. After implementation, repeat the actual command
and human interaction, then inspect the persisted output. Do not use the developing
agent's own research or a prewritten artefact as proof of Researcher behavior.
