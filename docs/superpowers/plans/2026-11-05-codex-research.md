# Standalone Codex research implementation plan

## Intent and human check

From a configured vault and a permitted local source, run
`n8r-surface discover [source]`, authorize sending inspected source text to OpenAI
through the existing Codex ChatGPT sign-in, ask for an AI Surface description,
and supply a correction or follow-up in the same conversation.

The tester installs the candidate tarball, starts discovery against the bundled
synthetic source, and asks a follow-up. Expect cited source evidence and retention
of the correction, with no source changes. The short getting-started guide will
contain the exact commands and expected visible results. Architecture, protocol
checks and transcripts belong in a separate maintainer evidence record.

## Scope and decisions

The user authorized step 1 of issue #17 on 5 November 2026. Work uses branch
`feat/17-codex-research`, from main `bd0ee10`. The paused SOURCE-01 checkpoint is
not incorporated. The delivery order is standalone AI, save/reopen/continue, then
npm distribution. Lab implementation remains outside this repository.

Implementation choice under investigation: Codex app-server over local stdio,
with one thread and successive turns. The adapter supplies bounded source list,
search and read tools; the model chooses its investigation. Source text is data,
not permission to run commands. Load the canonical Researcher 0.1.8 instructions
and all four references from the installed package; identify their byte digest.

No writes to source, research saves, portable continuation, HTML/JSON/YAML output,
registry publication or provider/API-key fallback in this increment. Bare startup
remains local and does not launch Codex. Keep the package private. Existing
ChatGPT credentials remain owned by Codex; do not copy or log them.

Before selecting the adapter, prove the installed protocol, authentication,
permission configuration and actual inference. Version-specific generated schemas
are the reference. Reject unsupported behavior rather than silently broadening
access. Existing custom providers, tools, hooks and source instructions must not
expand the permitted source scope.

## Baseline and prerequisite status

The installed baseline rejects `n8r-surface discover examples/researcher` with
exit 2 and the bare-startup-only message. Codex 0.139.0 initializes app-server,
reports ChatGPT authentication, accepts a custom tool and an ephemeral thread.
Its generated experimental protocol includes dynamic tools and named permissions.

Actual inference using configured `gpt-6-astra` fails: the service requires a
newer Codex. The user explicitly selected `gpt-5.5` for a second attempt; that
also fails as unsupported for ChatGPT sign-in, despite appearing in `model/list`.
The user then authorized updating Codex CLI and retrying `gpt-6-astra`.
No successful inference or research is claimed by these prerequisite checks.

## Implementation sequence

Use the executing-plans and test-driven-development skills for implementation.
Remain in the existing checkout; no Git worktree or default-branch edits.

1. Establish the live runner prerequisite and finalize the permission boundary.
   Record the exact supported CLI version, authentication type, model and a real
   tool-call round trip before presenting the architecture as settled.
2. Add `src/source-tools.ts` and `tests/source-tools.test.mjs`: canonical local
   scope, bounded listing/search/UTF-8 reads, explicit omissions, path and symlink
   rejection, byte digests and line evidence. Test escape paths, special files,
   oversized/binary files, exclusions and file-only scope before implementation.
3. Add the app-server transport and runner in `src/codex.ts` with process tests.
   Correlate responses and turn events; handle tool requests, server death,
   malformed events, timeouts and cancellation. Verify authentication and
   effective restrictions before inference; never silently change models.
4. Connect `src/cli.ts` to the terminal conversation. Specify exact discovery
   arguments, model selection, confirmation and exit behavior in the command
   inventory first. Test closed input, refusal, EOF, Ctrl-C, unavailable runner,
   partial output/error and follow-up retention. Bundle the canonical Researcher
   files in `package.json`; assert installed-package digests and no checkout
   dependency in `scripts/check-package.mjs`.
5. Rehearse the installed command with real Codex against synthetic sources.
   Independently compare cited facts and source bytes. Record actual instruction
   digest, source reads, correction, exits and unproved limits. Repeat relevant
   tests/package checks on Node 22, 24 and 26, plus repository documentation checks.
6. Review the final diff and evidence, commit, push and open one draft PR related
   to #17. Keep human acceptance, saved continuation and distribution outstanding.

## Review focus

- A selected folder is a capability boundary, not merely a prompt instruction.
- Unexpected server requests and inherited integrations cannot grant access.
- Source instructions, symlinks and terminal control characters remain untrusted.
- Streaming failure must not appear as a successful completed answer.
- Cancellation and server failure must not strand children or pending requests.
- A model list, login status or simulated tool call does not prove real research.

## Execution record

- Codex update authorized and completed: active CLI 0.166.0. Both `codex exec`
  and the app-server performed real `gpt-6-astra` inference with ChatGPT sign-in.
- A custom permission profile must also set `default_permissions`; omitting it
  caused a late workspace-requirements error. Both are now supplied and tested.
- Source tools, transport and terminal loop implemented. Early installed rehearsal
  completed source list/read and a human correction, with independent unchanged
  source/settings readback and no research save.
- Independent code review found root-replacement and stale-turn issues. Regression
  tests failed before fixes and passed afterward. Root identity/ancestry is checked
  for every operation; events and tools bind to the current thread and turn.
- 89 Node tests pass on Node 22.23.2, 24.22.2 and 26.13.0. Installed-package checks
  pass on all three, including canonical Researcher digest and 13 offline discovery
  terminal cases. The scripted runner is not counted as AI evidence.
- The final installed walkthrough and commit/environment evidence are tracked in
  [the maintainer record](../../n8r-surface/codex-research-verification.md).
