# Release versioning implementation plan

**Historical implementation record:** the current distribution plan is
[`@n8r/surface` only](../../n8r-surface/versioning.md). Unscoped publication
and name reservation were removed from the plan on 5 November 2026. References
to two packages below describe the earlier implementation, not future work.

> **For agentic workers:** use superpowers:executing-plans for this approved increment.

**Goal:** enforce one package version and verify its mapping to source and release artifacts.

**Architecture:** derive runtime identity from the installed manifest; validate source
versions before packing; verify retained candidates against a clean checkout, Git tag
and GitHub Release metadata with read-only tools. Keep publication separate.

**Tech stack:** existing TypeScript, Node.js scripts/tests, Git, npm and GitHub CLI.

**Spec:** [approved issue decision](https://github.com/injectionator/n8r-surface/issues/27#issuecomment-6661015093).

## Constraints and review focus

Use this checkout, no worktrees. Preserve private guards and current development
version. No tag creation, release creation or registry writes in this increment.
Test stale lockfile versions, invalid SemVer, a bumped installed manifest, changed
tarball bytes, wrong commit/tag, missing dual artifacts and wrong release metadata.
A local metadata fixture must never be described as authenticated provenance.

## Tasks

- [x] Add failing process tests for installed CLI version drift and source-version
  validation. Implement manifest-derived CLI output and `check:version`, called
  before candidate generation and in the test command. Keep independent expected
  package identity in consumer checks.
- [x] Add failing tests for `check:release` against disposable repositories and
  synthetic GitHub metadata. Verify clean source, matching local tag/commit,
  retained hashes, package identities, distinct release asset names and metadata.
  Default live readback uses GitHub CLI and checks the remote tag too; explicit
  metadata-file mode is offline rehearsal only. Neither mode publishes.
- [x] Document compatibility policy, immutable release process, dist-tags,
  provenance/authentication prerequisites, recovery and short human verification.
  Update contributor guidance and command outcome evidence.
- [ ] Run Node 22/24/26 suites and installed-package checks, documentation checks
  and human rehearsal. Commit, push and open a draft PR related to #27. Review
  the complete diff and report exact evidence and remaining release decisions.
