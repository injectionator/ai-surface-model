# Standalone vault setup implementation plan

## Intent

A standalone user runs `n8r-surface` from a source folder, chooses a local vault
once, and can see where future research will be saved. Starting again remembers
that choice. Setup leaves the source unchanged and does not start research.

## Verify

**Given** an installed candidate, an isolated home without settings and a prepared
source folder, **when** the user runs `n8r-surface` and accepts the offered vault,
**then** settings remember it and the vault contains `research/`, `artifacts/` and
`surfaces/`. **Verify** by opening those locations independently and starting again.
The second run shows the same vault without another setup question.

With closed input and missing setup, the same command explains how to complete
setup, exits 1 promptly and creates nothing. This proves setup only. Research,
save, reopen and continuation remain pending.

## Status and scope

This is a planning increment of [#30](https://github.com/injectionator/n8r-surface/issues/30),
based on the user's approved standalone experience. The subsequent request to
plan implementation supersedes that issue's earlier prohibition on detailed
planning. The decisions below are proposed implementation choices, not verified
product behavior or approval to resume every paused CLI feature.

> **For agentic workers:** Use superpowers:executing-plans after this plan is
> reviewed. Implement the bounded setup increment, retaining the evidence gates.

**Goal:** Deliver first-use local vault selection and remembered startup.

**Architecture:** Separate settings parsing and setup writes from the read-only
overview. The terminal controller obtains acceptance, creates the vault layout,
then commits settings. Use Node built-ins and the existing TypeScript/ESM package.

**Tech Stack:** Node.js 22, 24 and 26, TypeScript, npm and Node's test runner.

**Spec:** [Issue #30](https://github.com/injectionator/n8r-surface/issues/30),
[command outcomes](../../n8r-surface/command-outcomes.md), and the existing
[startup contract](../../n8r-surface/startup.md).

### Branch and dependencies

Planning branch: `docs/30-standalone-vault-plan`, based on `origin/main` at
`988358b3cf3804e6256514721b7e8ce792cd12b2`, refreshed 5 November 2026.
The draft PR contains this plan only and uses `Related to #30` and `Related to #16`.
It does not complete either issue.

The checkout also contains eight paused SOURCE-01 files associated with
`feat/16-source-overview`: four modified tracked files and four untracked files.
They are preserved, excluded from this planning commit and not a setup dependency.
Do not build a candidate from this dirty tree and attribute its behavior to main.
Before execution, agree how to retain that work separately in the existing
checkout; do not stash, discard, silently commit it, or use a Git worktree.

Proposed implementation branch: `feat/16-local-vault-setup`, under the existing
foundation issue #16, from then-current main after planning integration. Reuse a
matching branch/PR if one exists. If planning remains unmerged, document a stacked
base rather than claiming that main contains this plan.

PR #29 is still draft and open at this snapshot. Setup needs neither its Skeleton
Surface changes nor the shared skill bundle. It need not land first. A later npm
skill increment must explicitly choose a merged or documented dependent revision.

### Baseline evidence

On 5 November 2026, `command -v n8r-surface` found no executable on the active
shell PATH. Node reported `v26.13.0`. Installed startup interaction: **Blocked**
by the missing executable; no setup attempt, prompt result or filesystem result
is claimed. Source inspection shows only read-only startup at the named main
revision; that is not an installed-product rehearsal.

Before implementation, install a baseline tarball from the named clean revision
outside the source checkout using the existing
[installation procedure](../../n8r-surface/startup-human-check.md). Use an isolated
home and record the actual terminal and closed-input results for the interaction
below. Do not substitute the paused working copy or fabricate expected failures.

## Human task list for the setup candidate

**Maintainer preparation:** supply the installed candidate and a terminal already
configured with a dedicated test home and a small source folder outside it.
Record the package commit, Node version, operating system and invocation path.
Keep a before snapshot of source bytes and test-home entries. Do not change the
tester's real home/settings. This setup-only check needs no Codex or account.

- [ ] In the prepared source terminal, run `n8r-surface`. Expect the settings
  location, `Vault directory [~/n8r/]:`, and a choice to confirm creation. Press
  Enter, then enter `y` at `Create vault folders and save this location? [y/N]`.
  Expect `Vault ready:` with the resolved path and exit 0.
- [ ] Open the reported vault in the file browser. Expect `research`, `artifacts`
  and `surfaces` folders. Open the reported settings file: expect `version: 1`
  and `vaultRoot` holding the selected absolute path. Open the source folder:
  expect no added setup files or changes to its existing files.
- [ ] Run `n8r-surface` again. Expect the same resolved vault, no setup question,
  and exit 0. No research has begun and no research outputs are promised.
- [ ] In a second maintainer-prepared empty test home, run
  `n8r-surface </dev/null`. Expect `Vault setup required; run n8r-surface in an interactive terminal.`,
  exit 1 promptly and no created settings or vault. The maintainer independently
  checks that home's contents.

**Report:** Pass / Fail / Blocked for each task, the attempted interaction and
visible result, and the settings/folder names inspected. Paths vary with the test
home; the three folder names and exit codes do not. Missing folders, forgotten
settings, source changes or waiting on closed input are failures. Agent rehearsal
does not replace human acceptance. Retain evidence until reviewed, then remove
only the dedicated test homes if desired.

## Proposed behavior and transition

- Settings remain `~/.n8r/n8r-surface.json`, with version 1. Add optional
  `vaultRoot`; its absence means vault setup is pending. Fresh setup defaults to
  `~/n8r/`. Expand `~/` against home; resolve user-entered relative paths against
  invocation cwd and store the absolute result. Reject empty custom paths,
  controls, URL forms and non-directory collisions. Show the resolved path before
  confirmation. Existing stored relative paths resolve against the settings folder.
- Prompt only with both stdin and stdout attached to terminals, after displaying
  existing non-private settings. Enter at the location prompt chooses the default;
  only `y` or `yes` confirms writes. Refusal, EOF or interruption before confirmation
  creates nothing and exits 1. No source reads, network or runner launch occurs.
- Reuse a valid configured vault. Missing required subfolders are a repair need:
  offer creation with confirmation interactively; otherwise exit 1 without writes.
  Existing non-directory entries or unreadable settings fail with exit 2. Never
  replace malformed settings or silently select a different destination.
- Keep `artefactRoot` and its existing default `~/n8r/artefacts` unchanged as the
  legacy structured-artefact location. Do not infer a vault from its parent or
  rename it to `artifacts`. Display both locations with their distinct purposes.
  Preserve its files, unknown settings, `surfaceFormat`, `runner` and `lab` values.
  First successful setup adds only `vaultRoot`; retained JSON values may be
  reformatted, but no existing setting value is removed or reinterpreted.
- Preserve pre-existing vault contents. Create only missing directories. Publish
  settings only after all required directories are available; use an exclusive
  temporary sibling and atomic rename, checking the original file bytes for
  conflicts before replacement. Concurrent modification fails without overwriting
  the other writer. An interrupted setup may leave empty folders; report/reuse
  them on retry rather than deleting potentially user-owned contents.
- Refuse settings-file symlinks and special files using existing bounded-read
  protections. Reject symlinked required vault children for this first write
  increment; report the limitation. Resolve and display an explicitly chosen
  vault-root symlink before confirmation, without silently redirecting its children.
- Successful local setup/reuse exits 0; missing/declined setup exits 1; invalid
  settings, unsupported arguments and filesystem failures exit 2. Existing
  structured-artefact errors remain visible. Missing legacy corpus alone is not
  a setup failure and does not create that legacy folder.
- Add no `--path`, `--vault`, setup, status or discovery command in this increment.
  Bare startup is the setup entry point. Later per-run overrides must leave the
  saved default intact. Default-changing UI, migration and research are later work.
  `.local/vault-path` remains an agent convention and is not read by this CLI.

## Global constraints

- Keep the package private; no registry release, merge or deployment is authorized.
- Use the existing checkout, no Git worktrees, and preserve unrelated changes.
- No account, Lab, hosted vault, new runtime dependency or inference prerequisite.
- Keep public evidence synthetic and sanitized; retain exact revision/environment.
- Setup creates top-level folders only. Later saves group files by source.

## Review focus

Pin these cases in automated process tests: existing legacy settings and content;
unknown settings and malformed JSON; changed settings between prompt and save;
partial creation failure and retry; cancellation and closed input. Also check
spaces, relative paths, control characters, symlinks and a second source cwd.

## Task 1: Settings compatibility and setup transaction

**Files:** create `src/settings.ts`, `src/setup.ts`, `tests/setup.test.mjs`;
modify `src/startup.ts` and `tests/startup.test.mjs`.

**Interfaces:** settings parsing consumes bounded bytes plus home/settings paths
and returns resolved optional vault and legacy artefact paths plus original JSON
values. Setup consumes that snapshot and an explicitly accepted absolute vault
path; it returns the actual saved path or a typed conflict/filesystem failure.
Keep writes out of `overview()` and parsing. Do not export these internal helpers
as new public library APIs.

- [ ] Run and record the installed baseline interaction first.
- [ ] Add failing tests for adding `vaultRoot` while retaining every existing JSON
  value and legacy file byte; invalid JSON creates nothing; concurrent settings
  modification is retained; occupied child paths fail; partial folder creation
  never publishes successful settings; retry preserves existing contents.
- [ ] Run `npm test` and confirm the failures describe missing setup behavior.
- [ ] Implement the bounded parser and confirmed setup transaction with Node
  built-ins. Test the path/symlink cases listed above and settings size limits.
- [ ] Run `npm test`; require all relevant assertions to pass. Commit only this
  increment's files after resolving the paused-work overlap explicitly.

## Task 2: First-use interaction and installed proof

**Files:** modify `src/cli.ts`, `src/startup.ts`, `tests/startup.test.mjs`,
`tests/startup-pty.py`, `scripts/check-package.mjs`,
`docs/n8r-surface/command-outcomes.md`, `docs/n8r-surface/startup.md` and
`docs/n8r-surface/researcher-vault.md`; add
`docs/n8r-surface/vault-setup-verification.md`.

**Interfaces:** CLI consumes Task 1's settings snapshot, collects location and
confirmation, invokes setup only after acceptance, and renders the resulting
location/exit status. The installed harness supplies isolated homes and performs
independent readback; it must not pre-create the expected setup result.

- [ ] Before code, update CMD-01, SETUP-01 and NONINTERACTIVE-01 with the exact
  interaction/exit codes above, marked specified but unimplemented. Preserve the
  historical read-only startup evidence and distinguish it from the new behavior.
- [ ] Add failing terminal/process tests for default and custom paths, refusal,
  EOF, interruption, closed input, reuse from another cwd and repair confirmation.
  Assert settings/vault/source state as well as output and exits.
- [ ] Implement terminal orchestration, replacing the old read-only guidance
  prompt. Reuse existing private-field redaction and terminal escaping.
- [ ] Run `npm test` and `npm run check:package` on Node 22, 24 and 26 after the
  documented dependency/cache preparation. Require installed terminal and
  closed-input checks, including real saved settings and unchanged source bytes.
- [ ] Rehearse the human task list against the installed candidate; independently
  open settings and folders. Record expected/observed results, commit/environment,
  Pass / Fail / Blocked and unproved limits in the verification record.
- [ ] Run the repository's applicable Markdown/link/fixture checks and
  `git diff --check`; inspect new files and the staged diff for unrelated work and
  sensitive material. Push one matching draft PR, related to #16 and #30.

## Remaining sequence and acceptance boundaries

1. **#16:** setup above, then scoped source selection and safe saved-file operations.
   Reconcile the paused SOURCE-01 increment explicitly before resuming it.
2. **#17:** bundle the canonical Researcher skill/references with an identified
   revision/digest; verify tarball contents outside the checkout. Verify the
   actual installed Codex authentication, skill-loading and permission interfaces
   before selecting a runner implementation. App-server remains a candidate.
3. **#17:** explicit research through ChatGPT sign-in, with no billing/provider
   fallback, followed by real Markdown save/readback and fresh-session successors.
   Human decisions, source evidence and stable identities must survive.
4. **#17:** separately prove validated HTML/JSON/YAML and E2E-01/E2E-02. Markdown
   evidence does not establish this milestone. **#27** retains dual distribution.

The approved planning request does not by itself settle the earlier host delivery
order or authorize n8r-labs changes. Record the user's chosen implementation
priority before resuming paused #16 work. All application work remains in its own
repository. Hosted vaults remain optional later work.

This plan covers the first setup increment. The full #30 journey still needs
research invocation, runner and continuation decisions and actual product proof;
planning completion is not product completion.
