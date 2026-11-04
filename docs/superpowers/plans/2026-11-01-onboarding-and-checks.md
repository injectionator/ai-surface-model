# Onboarding and repository checks implementation plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan
> task by task. The first PR's scope is approved; keep it draft for review.

**Goal:** Explain why the model is useful, give newcomers and experts appropriate
reading paths, and make contributions easier to prepare and check.

**Architecture:** Keep Markdown and the existing synthetic JSON as the primary
content. Add GitHub contribution templates, CFF metadata and repository checks;
these do not define a model schema or select a future implementation stack.

**Tech stack:** Markdown, JSON, YAML, Python's standard-library unittest, GitHub
Actions, markdownlint-cli2, lychee and cffconvert.

**Spec:** [Issue #11](https://github.com/injectionator/ai-surface-model/issues/11)
records the approved scope and acceptance checks.

## Global constraints

- Work in the existing checkout on `docs/11-onboarding-and-checks`.
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
- [ ] After local review, commit, push and open the matching draft PR with
  `Closes #11`, then inspect GitHub-hosted checks.

## Local review status

The approved content and checks are implemented locally. A rendered preview was
requested before publication. Local checks pass; an independent review found no
issues. Publishing the branch and verifying GitHub-hosted behavior remain pending
local review. The temporary preview is not part of the repository.
