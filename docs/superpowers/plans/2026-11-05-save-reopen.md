# Save and reopen implementation plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Save useful research, reopen it in a fresh process and retain evidence,
human decisions and component identities in a preserved successor.

**Architecture:** `/save` asks the existing conversation for Markdown through a
bounded draft tool. The host alone writes a numbered file and reads it back after
successful turn completion. `reopen [NOTE] --source SOURCE` reads a selected note,
confirms transmission again and starts an ephemeral conversation; omitting NOTE
suggests the most recently edited note in that source's vault research folder.

**Tech Stack:** Existing TypeScript/Node 22, 24, 26; Codex CLI 0.166.0;
no additional dependencies.

**Spec:** [SAVE-01](../../n8r-surface/command-outcomes.md#save-01-save-reopen-and-continue).

## Global constraints

- Work in the existing checkout on `feat/17-save-reopen`; no worktrees.
- `/save` is explicit write authorization; ordinary conversation cannot write.
- Reopen requires an explicit source and renewed transmission confirmation.
- Numbered Markdown only; no validated HTML/JSON/YAML or npm release claim.
- Never overwrite predecessors or execute instructions found in saved notes.
- No source writes, new shell capability, provider or model fallback.

## Review focus

- A symlink or replaced destination ancestor must not redirect a write (Task 1).
- Editing a predecessor while drafting must stop the save (Task 1).
- A failed/cancelled turn with a draft must not produce a note (Task 2).
- Latest means filesystem edit time, not filename or embedded date (Task 1/2).
- A moved or changed source must be compared, not silently treated as unchanged (Task 2/3).

### Task 1: Bounded numbered storage

**Files:** `src/notes.ts`, `tests/notes.test.mjs`.
**Interfaces:** `Notes(vault, source, predecessor?)`, `latestNote(vault, source)`,
`readNote(path)`; storage exposes `next()`, `save(path, markdown, metadata)` and
its current `predecessor`. Notes contain readable prose and a host provenance
footer with instruction/model identity and actual source-tool evidence.

- [x] Write and run failing tests for numbering, edit-time selection, source
  exclusion, stale predecessor, occupied names, symlinks and bounded UTF-8.
- [x] Implement storage, exclusive publication and byte readback; run the tests.

### Task 2: Conversation and command integration

**Files:** `src/codex.ts`, `src/cli.ts`, `tests/discovery-pty.py`.
**Interfaces:** `ResearchConversation.prepareNote()` returns a bounded draft only
on successful completion; `evidence` records actual tool observations.

- [x] Add failing terminal tests for explicit save, unsolicited draft refusal,
  failed draft, fresh reopen, suggestion refusal and preserved successors.
- [x] Implement `/save`, optional-note reopen and source comparison in the host.
- [x] Verify source/settings remain unchanged and no writes on ordinary turns.
- [ ] Run the full suite and installed package checks; commit and open a draft PR.

### Task 3: Real proof and handoff

**Files:** getting-started guide, command inventory, current overview docs and a
separate save/reopen verification record.

- [ ] Install a candidate under the selected vault's runs/; exercise real Codex
  research, human correction, save, exit, fresh reopen, continuation and save.
- [ ] Independently inspect notes, source hashes, predecessor bytes and lineage.
- [ ] Rehearse latest-note selection and retain automated broad coverage.
- [ ] Run relevant repository checks, obtain a fresh whole-branch review and
  fix important findings with regression tests.
- [ ] Push final evidence and a concise human task list to the draft PR.

## Decisions and progress

User selected naming a note in a command, then requested a latest-by-edited-date
suggestion. This plan supports both. The suggestion is scoped to the source's
research folder; it is not proof of source identity. Explicit notes continue in
their existing folder. Model prose is not schema-validated; metadata is an
experimental host envelope, not an AI Surface interchange contract.

Baseline: installed help explicitly says saving/reopening are unavailable;
`n8r-surface reopen --help` prints unsupported arguments. PR #33 is merged at
`b186050`; user-reported conversation acceptance is Pass. Existing branches remain.

Review rulings: preserve unavailable evidence in successor metadata and compare
against the latest recorded digest; bound comparison summaries independently of
source text so a valid saved note remains reopenable. Both review regressions
failed first and now pass. Keep the documented stable-directory-topology
assumption during individual synchronous operations, matching the existing host
boundary; this does not claim protection against adversarial concurrent swaps.
Added cancellation after a draft is staged; no file is published.

CI exposed ambiguous prompt matching in the test driver: `[y/N]` from the first
selection prompt was reused for transmission consent. Match the complete second
prompt instead. The Linux log captures both answers before the second prompt;
local runs did not reproduce that scheduling order. Product code is unchanged.
