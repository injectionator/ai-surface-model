# Researcher and n8r-surface design reference

This records the agreed direction and remaining choices for the standalone tool.
It consolidates [issue #13](https://github.com/injectionator/ai-surface-model/issues/13).
The [capability map](README.md) shows the intended scope;
the [critical path](critical-path.md) determines what comes next.

**Status:** proposed tooling. No CLI, Researcher package, artefact contract or
tool-specific codec is implemented by these documents. Existing JSON examples
remain illustrative, and the native model serialization is still an open design.

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
and output rules. Each host supplies source access, inference, conversation and
persistence. Extracting discovery from the n8r-labs assistant is application
work; identify the shared asset and its revision when incorporating it here.
Do not hand-maintain divergent copies or copy private application content.

## Sources and scope

Proposed commands:

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

## AI execution and continuation

Inside a chat harness, its AI follows the Researcher skill. The CLI needs a
supported installed agent or configured model connection. One verified runner
is enough for the first milestone; runtime, backend and packaging are still to
be selected. A CLI that only prints a prompt is not completed authoring.

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

## Open choices and verification

[#15](https://github.com/injectionator/ai-surface-model/issues/15) settles the
minimal HTML/data ownership and revision contract, experimental graph fields,
portable codec values, shared-instruction provenance, runtime and first runner.
Exact tool names, corpus layout and source-reader limits follow those decisions.

Use synthetic unrelated products, incomplete/conflicting evidence, human edits
and a second source. Check local integrity, safe persistence and actual AI
behaviour separately. Compare supported facts, selections and gaps across hosts,
rather than requiring identical generated wording. A live consumer trial is
separate from file parsing, fixture checks and a successful standalone run.
