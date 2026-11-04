# Onboarding and repository checks implementation plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan
> task by task. The first PR's scope is approved; keep it draft for review.

**Goal:** Explain why the model is useful, give newcomers and experts appropriate
reading paths, and make contributions easier to prepare and check.

**Architecture:** Keep Markdown and the existing synthetic JSON as the primary
content. Add GitHub contribution templates, CFF metadata and repository checks.
The refresh also covers the existing TypeScript Researcher library and bare
startup; it adds no model schema or product behavior.

**Tech stack:** Markdown, JSON, YAML, Python's standard-library unittest, the
existing npm/Node.js tests, GitHub Actions, markdownlint-cli2, lychee and cffconvert.

**Spec:** [Issue #11](https://github.com/injectionator/n8r-surface/issues/11)
records the approved scope and acceptance checks.

## Global constraints

- Work in the existing checkout on `docs/11-onboarding-and-checks`, targeting
  `main` directly.
- Keep the change focused on model onboarding and repository checks. Preserve
  existing model pages; exclude the proposed Lab redesign and keep `n8r-labs`
  application work in its separate repository.
- Keep one AI Surface Model, provisional fields and useful partial descriptions.
- Preserve component identity and the distinction between definitions and evidence.
- Do not claim released schemas, compatibility, conformance or recreation.
- Keep the PR draft; merge, release and deployment are separate decisions.
- Defer branding, settings, reporting policies, releases, Zenodo and a docs site.

## Review focus

- A newcomer should encounter why, who and what before procedural detail.
- Experts should be able to jump directly to level 300 or 400.
- Level 400 must describe extension proposals, not an implemented extension API.
- Checks must detect broken references without treating unknown values as absent.
- Network failures must be distinguishable from local content failures.

## Task 1: Onboarding and contribution entry points

**Files:** `README.md`, `CONTRIBUTING.md`, `CITATION.cff`,
`.github/ISSUE_TEMPLATE/*.yml`, `.github/pull_request_template.md`.

**Interfaces:** Link to existing guides and fixtures. Use collective attribution
from `LICENSING.md`; keep citation metadata free of invented release information.

- [x] Rewrite the README around why, who, what and level 100–400 reading paths.
- [x] Illustrate progressive detail with excerpts from the existing JSON files.
- [x] Explain how to propose extensions and provide versioned interop evidence.
- [x] Add issue forms and a PR template with scope, checks and publication prompts.
- [x] Add CFF 1.2.0 metadata with a generic preferred citation for the draft.
- [x] Check links, semantics, form structure and citation validity.

## Task 2: Lightweight checks

**Files:** `tests/test_examples.py`, `.markdownlint-cli2.jsonc`, `lychee.toml`,
`.github/workflows/checks.yml`, `.github/workflows/links.yml`, `AGENTS.md`,
`CONTRIBUTING.md`.

**Interfaces:** Run the documented unittest discovery command alongside shell
syntax checks. All example JSON parses; the current LibreChat fixture shape gets
local identifier, endpoint and secret-requirement checks. No generic validator.

- [x] Add fixture checks and demonstrate that duplicate IDs and dangling local
  references fail using temporary, synthetic copies.
- [x] Run Markdown lint, local links/anchors, citation validation, JSON checks and
  existing helper tests on pull requests and pushes to `main`.
- [x] Put external link checking in a separate weekly/manual workflow with bounded
  timeouts, so third-party availability does not block a documentation PR.
- [x] Pin action commits and tool versions; use read-only permissions and no
  repository secrets. Document prerequisites, network use and limitations.
- [x] Run local commands and inspect the complete diff, including new files.
- [x] Obtain a fresh whole-branch review.
- [x] After local review, commit, push and open the matching draft PR with
  `Closes #11`, then inspect GitHub-hosted checks.

## Task 3: Refresh against the merged tooling and rename

The 4 November follow-up keeps the existing PR and targets `main`. It integrates
the naming branch from #23 at `4f9b045`; merge #23 before #21. This preserves the
shared README and attribution corrections without a force push or duplicate PR.

- [x] Retain the merged contracts/startup implementation and newer contributor
  rules while resolving README and agent-guidance conflicts.
- [x] Describe the current experimental tools and their remaining limits; update
  repository URLs in citation metadata, templates and this plan.
- [x] Add the existing library and installed-package checks to CI on Node.js
  22/24/26 with Python available for the terminal rehearsal.
- [x] Carry the proportional human-verification requirement into the PR template.
- [ ] Rehearse the documented checks and human inspection, inspect hosted checks
  on the refreshed head, and obtain a fresh review of both PRs.

No new production behavior is introduced. Existing fixture tests are retained;
verification uses those tests and the real package checks rather than new tests
that mirror documentation or workflow configuration.

## Publication status

The onboarding and checks work is published in
[draft PR #21](https://github.com/injectionator/n8r-surface/pull/21).
Its initial hosted run at `583c3d2` passed all three original jobs: fixtures and
tooling, Markdown, and local links. The refreshed PR must record its own checks,
including the added Researcher matrix; the old result is historical evidence.

The onboarding change targets `main` directly and excludes the separate Lab
redesign. The README and agent guidance record the boundary between this
repository and `n8r-labs`. The PR records verification of the current revision;
review readiness, merge and release remain separate decisions.
