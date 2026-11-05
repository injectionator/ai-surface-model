# Surface generation and revision implementation plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan
> task by task. Keep the existing checkout; repository guidance prohibits worktrees.

**Goal:** Convert saved research into a validated partial Surface, then reopen and
revise it without losing identities, evidence, decisions or predecessor history.

**Architecture:** A restricted model tool stages structured data in memory. The
host owns validation, revision metadata, deterministic preview and explicit pair
persistence. Fresh reopening loads and verifies the complete pair before inference.

**Tech Stack:** Existing TypeScript, Node.js 22/24/26, npm, Codex CLI 0.166.0 and
existing experimental artefact library; no new runtime dependency planned.

**Spec:** [Saved research to partial Surface revisions](../specs/2026-11-05-surface-revisions-design.md).

## Global constraints

- Existing `n8r.research/0.1` and `n8r.surface/0.1` contracts; JSON first.
- Preserve `/save` Markdown behavior; `/save surface` saves the current preview.
- No filesystem writes by the model, no provider fallback, no implicit save.
- Preserve sources, predecessor bytes and opaque extensions; fail closed on conflict.
- Branch `feat/17-surface-revisions` from `c7781bc`; Related to #17, not Closes.
- npm distribution, Lab integration and broad external-host acceptance are deferred.

## Review focus

1. Failed/cancelled turns must not leave a stale preview eligible for saving.
2. A changed predecessor or manually edited HTML must prevent saving/reopening.
3. A missing historical source must retain evidence without claiming a fresh read.
4. Reopening a relocated pair must work without absolute path metadata or broad scans.
5. Partial publication, symlink ancestry and oversized context must fail clearly
   without replacing history or reporting success.

## Task 1: validated structured drafts and readable previews

Files: create `src/surface-draft.ts`, `tests/surface-draft.test.mjs`; update
`docs/n8r-surface/command-outcomes.md` before implementing the new behavior.

Interfaces: export `prepareSurfaceDraft(input, context): SurfaceDraft` and
`previewSurface(draft): string`. `SurfaceDraft` contains `research: ResearchRecord`
and `surface: SurfaceDefinition`. Context supplies host revision metadata,
optional accepted predecessor pair and original-note provenance. Input is untrusted.

- [x] Specify the command inventory and SURFACE-01 Given / When / Then / Verify
  outcome, distinguishing planned work from the recorded installed-help baseline.
- [x] Write tests asserting that valid structured content receives host-owned
  revision/reference digests, invalid references fail, and preview includes the
  nodes, declared connections, choices, requirements, coverage and gaps.
- [x] Run the focused tests and record the expected missing-capability failure.
- [x] Implement using `validateArtefact`, `verifyReferences`, `digest` and
  `verifySuccessor`; retain IDs and extensions and reject silent omission of
  predecessor sources/findings/decisions/nodes. Keep semantic prose-to-ID mapping
  an explicit model instruction and real-rehearsal check.
- [x] Add tests for dropped history, changed relationship endpoints, opaque
  extension loss, conflicting evidence and a legitimate changed decision.
- [x] Run `npm test`; commit the draft-validation increment once passing.

## Task 2: immutable pair persistence and independent reopening

Files: create `src/surface-store.ts`, `tests/surface-store.test.mjs`.

Interfaces: export `readSurfacePair(path): SavedSurfacePair` and class
`SurfaceStore` with constructor `(vault, source, predecessor?, note?)`,
`save(draft, provenance): SavedSurfacePair`. The saved pair carries both parsed
artefacts, original bytes/hashes, its directory and manifest. Input paths must name
one of the supported pair members. The manifest is versioned host data.

- [x] Write failing tests saving a pair, reopening from either member and comparing
  research references, logical digests and exact file bytes.
- [x] Add tests for immutable successor history, changed note/predecessor bytes,
  edited HTML, symlink ancestry, occupied outputs, malformed manifests, relocated
  pairs and failures during staged publication. Assert earlier files remain intact.
- [x] Implement bounded UTF-8 reads, manifest/file verification, temporary-directory
  staging, complete directory publication and independent readback. Use existing
  codec/HTML APIs. Record only portable evidence and relative predecessor locations.
- [x] Run focused tests then `npm test`; commit the persistence increment.

## Task 3: restricted conversation tool and command interaction

Files: modify `src/codex.ts`, `src/cli.ts`, `tests/codex.test.mjs`,
`tests/discovery-pty.py`, `scripts/check-package.mjs`; add a focused host instruction
reference if needed rather than embedding the full schema in unrelated guidance.

Interfaces: conversation exposes the completed `surfaceDraft`, provides
`reopenSurface(pair)` and offers `surface_draft` as a bounded dynamic tool.
A fresh turn clears the old draft; only successful completion promotes a candidate.
The CLI prints the host preview and calls `SurfaceStore.save` only for literal
`/save surface`. It never regenerates during saving.

- [x] Write failing protocol tests for tool argument validation, model retry after
  validation feedback, promotion only on success, cancellation and stale-preview
  invalidation. Assert no storage operation occurs during model turns.
- [x] Implement the tool schema and host instructions using the existing contracts.
  Host assigns envelopes and exact research references; the model supplies content.
- [x] Write failing reopen tests for retained unavailable evidence and bounded total
  context; implement fresh-session pair context with renewed source access.
- [x] Extend PTY tests to generate, preview, save, exit, reopen by each pair member,
  revise and save. Assert `/save` still writes Markdown and a missing preview cannot
  save. Use distinct full confirmation prompts, not generic `[y/N]` matches.
- [x] Update help, source/transmission disclosure and activity messages. Preserve
  the existing no-argument latest-edited Markdown selection behavior.
- [x] Run `npm test` and `npm run check:package`; commit and update the draft PR.

## Task 4: installed real-runner proof and handoff

Files: update `docs/n8r-surface/getting-started.md`, `host-contract.md`,
`command-outcomes.md`, `critical-path.md`, relevant README/AGENTS claims; create
`docs/n8r-surface/surface-revisions-verification.md` with sanitized evidence.
Keep raw rehearsal outputs under `runs/` in the configured local vault.

- [x] Install a candidate tarball in an isolated local location, retaining existing
  global installation and using established Codex sign-in. Record exact source and
  tarball hashes, Node/Codex/model/instruction revisions once.
- [x] Run the design's short proof through real Codex on saved Lumen research. The
  Researcher must generate the content; the developing agent supplies interactions
  and independently checks output, never prewritten findings.
- [x] Read back both revisions: validate references and parent digests, compare
  retained component/finding IDs, evidence and decisions, and prove predecessor,
  note, source and settings bytes unchanged. Capture any failure before fixing it.
- [x] Repeat a small Harbor case from its own research, retaining unknown facts;
  reopen by the other pair member. Record the actual observation and limits.
- [x] Run required Node/package and repository checks; inspect tracked and new
  files for whitespace, links, semantic consistency and sensitive material.
- [x] Request a final independent code review, address findings and rerun affected
  checks. Record which tests and real trials ran on each exact revision.
- [x] Update the single draft PR with short human tasks first, evidence links,
  remaining scope and Related to #17. Report branch, commit, pushed status and
  unproved human acceptance. Keep npm distribution last and separate.

## Execution status

Tasks 1–3 are implemented at `62cc6d9`. The 115-test suite passes on Node
22/24/26; installed-package and real-runner evidence is recorded in the
[verification record](../../n8r-surface/surface-revisions-verification.md).
Task 4 completed its agent rehearsal and independent readback on Lumen and Harbor.
Human acceptance remains separate.
The user approved the conversational outcome and selected inline implementation
after presentation of this plan. The fresh builder check found no important
unresolved questions. The storage, conversation and command interfaces are tightly
coupled. A fresh reviewer checks the completed branch.
