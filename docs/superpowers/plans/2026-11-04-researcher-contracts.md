# Researcher contracts implementation plan

> **For agentic workers:** Use superpowers:executing-plans to implement this
> plan task by task. The user has approved the design and requested execution.

**Goal:** Deliver issue #15's experimental artefacts and executable checks.

**Architecture:** A small, offline TypeScript library validates a bounded graph
and research record, preserves portable values in JSON/YAML, and renders an inert
HTML record from one authoritative data block. Synthetic cases exercise the
contracts without inference, storage adapters or a Lab.

**Tech stack:** TypeScript, Node.js 22/24/26, npm, Node's test runner, `yaml` 2.

**Spec:** [approved design](../../n8r-surface/design.md),
[issue #15](https://github.com/injectionator/n8r-surface/issues/15).

## Global constraints

- Use the existing checkout; no worktrees. Preserve unrelated work.
- Stack on planning PR #18 at `19b1f263b046b669093a457ebefcc37c7b4430ad`;
  target `docs/14-n8r-surface-map` until that dependency merges.
- Keep experimental contracts separate from existing illustrative examples.
- No CLI, live runner, deployment or application compatibility claim in #15.
- Publish only synthetic assets and public contract requirements.
- Built JavaScript must run without Bun, TypeScript or the source checkout.

## Review focus

- Malformed and future data: reject unsupported versions/fields without loss.
- Encoding traps: reject duplicate keys, aliases, tags and lossy numeric values.
- HTML edits and markup: refuse divergence and keep source strings inert.
- External references: distinguish missing context from verified provenance.
- Continuation: preserve identity, old revisions, conflicts and user decisions.

### Task 1: Portable artefact contracts and codecs

**Files:** `src/contracts.ts`, `src/validate.ts`, `src/codec.ts`,
`src/index.ts`, `tests/contracts.test.mjs`, `tests/helpers.mjs`,
`package.json`, `package-lock.json`, `tsconfig.json`,
`docs/n8r-surface/contracts.md`.

**Interfaces:** Produces `validateArtefact(unknown): Artefact`,
`encode(unknown, 'json' | 'yaml'): string`,
`decode(string, 'json' | 'yaml'): Artefact`,
`digest(unknown): string`, `verifyReferences(Artefact, Artefact[]): void`.

- [x] Write tests for partial records, graph cycles/shared/parallel edges,
  invalid local references, closed fields and unknown extension preservation.
- [x] Run `npm test`; expect assertions to fail against unimplemented exports.
- [x] Implement the bounded types, validation, codecs and canonical digest.
- [x] Run `npm test`; expect all contract/codec cases to pass. Include duplicate
  keys, non-string YAML keys, aliases, tags, unsafe numbers and cyclic JS values.
- [x] Document exact fields and bounds; commit the reviewable contract slice.

### Task 2: HTML ownership, revision checks and synthetic cases

**Files:** `src/html.ts`, `src/revisions.ts`, `tests/html.test.mjs`,
`tests/fixtures.test.mjs`, `examples/researcher/`.

**Interfaces:** Consumes task 1. Produces `renderResearchHtml(unknown): string`,
`readResearchHtml(string): ResearchRecord`,
`verifySuccessor(Artefact, Artefact): void` and frozen acceptance fixtures.

- [x] Write failing tests for HTML/data divergence, inert source markup,
  parent digest mismatch, reused revisions and external evidence resolution.
- [x] Run `npm test`; expect the new cases to fail.
- [x] Implement deterministic HTML and revision checks; add two fictional
  products, their records, a reviewed manual revision, rejected raw edit and
  a selected partial Surface in JSON/YAML.
- [x] Run `npm test`; expect all cases to pass, including source digests,
  selected findings/decisions, conflicts and independent old revision retention.
- [x] Commit and update the draft PR.

### Task 3: Host boundary, distribution checks and delivery documentation

**Files:** `docs/n8r-surface/host-contract.md`,
`docs/n8r-surface/implementation-decisions.md`, `scripts/check-package.mjs`,
`tests/package-smoke.mjs`, capability map, critical path, design,
`AGENTS.md`, `CONTRIBUTING.md`, root/example README files.

**Interfaces:** Consumes built exports and fixtures from tasks 1/2. Package
exports the library plus contracts/examples; no command entry point yet.

- [x] Write/run an installed-package smoke case outside the checkout; expect
  missing exports/assets to fail before packaging is configured.
- [x] Package only built code, public contracts/examples and licence material.
- [x] Verify installed tarball on Node 22, 24 and 26; document tested versions.
- [x] Record host capabilities, Lab alignment/gaps and first-runner decision.
  Keep settings/source/storage implementation in #16 and discovery in #17.
- [x] Run npm tests, shell syntax, existing Python tests, JSON/reference checks,
  changed Markdown links and `git diff --check`; inspect the publication diff.
- [ ] Obtain one independent whole-branch review, fix substantive findings with
  reproducing tests, then push/update the draft PR and hand back issue/PR/commit.
