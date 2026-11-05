# First npm release implementation plan

**Historical plan — superseded:** the scoped package was published and verified.
The maintainer removed unscoped publication and name reservation from the plan
on 5 November 2026. Any unfinished two-package tasks below are cancelled, not
backlog work. Preserve this record and the original artifacts as history. Current
scope is [scoped-only distribution](../../n8r-surface/versioning.md).

> **For agentic workers:** use superpowers:executing-plans for this authorized increment.

**Goal:** prepare and publish both official packages at `0.1.0-experimental.1`
with independently verifiable bytes and source provenance.

**Architecture:** keep source/default candidates private; opt into fresh
publishable dual archives. A manually dispatched GitHub-hosted workflow retains
artifacts before publishing and refuses mismatched existing versions. Verify
both registry routes before finalizing the immutable GitHub Release.

**Tech stack:** existing Node scripts/tests, npm, GitHub Actions and GitHub CLI.

**Spec:** [issue #27](https://github.com/injectionator/n8r-surface/issues/27),
[release policy](../../n8r-surface/versioning.md), and the maintainer's confirmed
version and publication authorization on 5 November 2026.

## Constraints and review focus

Use the existing checkout without worktrees. No merge, review-readiness change
or branch cleanup without separate authorization. Keep `latest` untouched.
Test missing opt-in, invalid options, non-equivalent payloads, changed retained
bytes, wrong source identity and partial publication. Registry errors must not
be interpreted as permission to overwrite an existing version. Credentials stay
outside source and public evidence. The first-publication authentication route
requires account access; private local tests cannot establish provenance.

## Tasks

- [x] Add failing distribution tests for explicit publishable archives and invalid
  arguments; implement `pack:candidates -- NEW_DIRECTORY --publishable`, retaining
  default private behavior and both equivalent manifests. Set approved source and
  lockfile version; include public registry/access and explicit experimental tag.
- [x] Add tested retained-artifact validation and registry comparison, then a
  manually dispatched release workflow. Retain exact archives before publishing;
  on retry download retained artifacts rather than rebuild. Fail on differing
  registry bytes. Exercise local checks with synthetic network evidence clearly
  labeled; live authentication/provenance remains a separate verification.
- Update distribution/version documentation and runnable human verification.
  Run Node 22/24/26 tests and installed package checks, lint, links and fixture
  checks. Rehearse publishable installs from a clean commit. Review and push a
  draft PR related to #27, recording exact revision/environment and limitations.
- After required account actions and review/merge decision, build from the
  reviewed release revision, publish both packages, independently inspect registry
  bytes/provenance/installations, and finalize the immutable release. Report any
  partial release without rebuilding or replacing the existing version.

## Execution record

Starting observation: npm identity E401 and both public names E404. No registry
writes. Version choice confirmed. Authenticated npm account and `n8r` owner role verified. npm offered stage-only
tokens; maintainer approved staging and its public placeholders. Submission uses
provenance and independent staged-byte download; promotion requires maintainer
2FA approval. Bootstrap secret and release immutability await account actions.

Validation: 130 tests passed on Node 22.23.2, 24.22.2 and 26.13.0; independent
installed-package/terminal suites passed for both names on all three. Markdown,
local links, citation, shell syntax and 24 Python checks passed. Actionlint
1.7.12 accepted the workflow. A review found that partial draft-asset upload
could lose runner-local bytes; complete Actions artifact retention now precedes
draft creation, with a verified restore procedure. Live CI staging, maintainer
approval and cryptographic registry provenance remain unverified.
