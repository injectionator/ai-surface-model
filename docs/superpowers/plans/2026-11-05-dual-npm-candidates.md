# Dual npm candidates implementation plan

> **For agentic workers:** Use superpowers:executing-plans for this increment.

**Goal:** Prepare equivalent private tarballs for both official names under #27.

**Architecture:** Compile into fresh temporary output, pack the source payload once, extract that payload into temporary
staging directories and change only the package name for the scoped candidate.
Run the existing consumer checks independently for both packages.

**Tech Stack:** Node.js built-ins, npm, existing POSIX/Python terminal checks.

**Spec:** [Issue #27](https://github.com/injectionator/n8r-surface/issues/27).

## Constraints and initial evidence

- Existing checkout, branch `feat/27-dual-npm-candidates`, base `543c2b9`.
- Preserve private status, version `0.0.0-experimental.1`, both vault settings,
  existing branches and installed command. No registry publication.
- Node 22, 24 and 26; no new runtime dependencies.
- On 5 November 2026 both registry lookups returned E404; `npm whoami` returned
  E401. Identity, ownership and provenance remain release blockers.
- Given the built checkout, `npm run pack:candidates -- NEW_DIRECTORY` should
  produce two tarballs and a digest report. Independent installs should expose
  equivalent library/assets and the same read-only startup command.

## Tasks

- [x] Add a failing packaging integration test: two names, matching manifests
  apart from name, equal payload bytes, digests and safe refusal to overwrite.
- [x] Implement `packCandidates(destination)` in `scripts/pack-candidates.mjs`;
  require a new destination, build into a fresh temporary directory, retain private status,
  strip development scripts/dependencies from both generated manifests, and
  record source revision plus dirty state and tarball SHA-256 values.
- [x] Parameterize the installed smoke/asset resolution by package name and
  extend `scripts/check-package.mjs` to install each candidate independently.
- [x] Add official repository metadata and update installation, distribution
  decisions, contributor instructions and command outcome evidence.
- [x] Run full tests and both installed candidates on each supported Node major;
  run documentation checks, rehearse the human steps and inspect the diff.
- [x] Commit, push and open one draft PR related to #27, with publication,
  authenticated ownership and registry/provenance verification still outstanding.

## Review focus

- Refuse an existing output directory without deleting its contents (test).
- Preserve arbitrary packed asset bytes under both names (compare extracted files).
- No lifecycle scripts needed in consumer installations (install with scripts off).
- Scoped package resolves its own assets and command (independent consumer checks).
- Dirty candidates cannot masquerade as clean revision evidence (report dirty state).

## Execution notes

The first integration test exposed npm's identical filename for the two names;
candidates now use separate scoped/unscoped subdirectories. Independent review
then identified stale ignored `dist/` files as a source-integrity gap. A regression
assertion failed with an obsolete file present; generation now replaces packed
build output with a fresh temporary compilation, and the assertion passes.
Publication and authenticated registry/provenance checks remain outside this
increment. The final draft PR carries exact revision and verification results.
