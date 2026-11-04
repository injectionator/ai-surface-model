# Experimental contract verification record

This record applies the [intent/outcome approach](command-outcomes.md) to the
library delivered by #15. It records observed library behavior and its limits;
this historical library record does not verify command or AI research outcomes.
The later [STARTUP-01 record](startup-verification.md) separately verifies bare startup.

- Date: 4 November 2026.
- Implementer/verifier: Codex, with a separate read-only agent review of the
  implementation at `a2dae4d`. Human product acceptance remains separate.
- Baseline for the final correction: `ee56e45`.
- Corrected implementation and test revision: `64b8c95`.
- Environment exercised: macOS ARM64 (`darwin/arm64`); Node.js 22.23.2, 24.22.2
  and 26.13.0. Other operating systems were not exercised.
- Distribution: `n8r-surface` version `0.0.0-experimental.1`, local tarball installed
  into a temporary consumer directory with no checkout-relative imports. The
  package remains private and unpublished.

## ARRAY-01: a consumer must not silently lose extension data

**State X:** a valid research record contains `['original']` in an extension,
constructed as an Array subclass with an inherited `toJSON` method returning
`['replacement']`. Additional cases use inherited `toJSON` and `map` getters on
custom array prototypes. These values violate the intended plain-data boundary.

**Input Y:** submit the record through the public validation, logical digest and
JSON/YAML encoding APIs. For encoding, reopen any returned string to inspect its
actual value. Repeat the encoding rejection check from the installed package.

**Expected Outcome Z:** reject the custom prototype before any inherited method
or getter runs, leave the caller's original value unchanged, and return no encoded
artefact or misleading digest. Ordinary arrays must still round trip normally.

**Observed baseline:**

| Operation | Input value | Reopened output | Digest agrees with input? |
| --- | --- | --- | --- |
| JSON encode/decode | `original` | `replacement` | No |
| YAML encode/decode | `original` | `replacement` | No |

The new regression failed against the baseline (22 of 23 tests passed). The
independently installed package also failed the expected-rejection assertion.
This confirms an observable data-loss bug, rather than an implementation-style
preference or an unexercised review suggestion.

**Change:** the portable-value boundary now requires an array's prototype to be
exactly the ordinary `Array.prototype`, before traversing or serializing it.
Non-array objects keep their existing plain-object rule.

**Verification and actual result:** the public APIs now report `requires a plain
array`. Regression assertions observe zero inherited-hook calls and the unchanged
`original` value. Both installed JSON/YAML encoding paths reject the subclass.
Existing normal-array, unknown-extension, HTML and graph round trips remain green.
All 23 tests and the installed consumer check pass on each of the three Node
versions above.

**Assessment:** passed for this library boundary. It is not a sandbox for arbitrary
JavaScript execution or proof that the future command can research a repository.

## CONTRACT-01: retain useful, attributable research and selected definitions

**State X:** the frozen [Lumen and Harbor fixtures](../../examples/researcher/README.md)
include supplied source documents, original and successor HTML records, a manually
edited pending file and equivalent JSON/YAML selected definitions. They are
synthetic, authored acceptance fixtures, not outputs of an AI Researcher.

**Input Y:** load the actual fixture bytes through the exported readers, verify
source hashes and exact research references, validate successor links, and reopen
both graph encodings. Repeat from assets bundled in the installed tarball.

**Expected and observed Outcome Z:**

| Required outcome | Independent check and observed result |
| --- | --- |
| Evidence is attributable to the supplied source snapshots. | Hash original source-file bytes independently; compare with record digests. All match. |
| Conflicting/unknown facts remain useful. | Read both batch-limit claims (10 and 25), the unknown model version and initial unknown Harbor authentication. All remain explicit. |
| A manual visible edit cannot silently replace or disappear behind structured data. | The pending HTML is rejected; the reviewed successor loads, records the selected callback decision and points to the intact predecessor. |
| A second source can add knowledge without losing identity. | Harbor r2 retains its authentication finding ID and original source while adding the second source and supported authentication value. |
| Selected graph meaning survives conversion. | JSON and YAML reopen to equal values with four nodes, six declared relationships, a shared identity node, a cycle, distinct parallel edges, requirements and exact research revision links. |
| Installed consumers receive the necessary code and assets. | The temporary consumer imports built exports, reads bundled fixtures/contracts and repeats reference, successor, codec and conflict checks successfully. |

**Assessment:** passed for these frozen examples and supported profile meanings.
Reference integrity does not verify that arbitrary prose is true, a consumer
understands an extension or any selected connection actually works.

## Reproduce the supporting checks

From the repository, using a supported Node version:

```sh
npm ci
npm test
npm run check:package
```

The first command obtains dependencies from npm. The tests and package consumer
check then work offline; the latter uses the populated dependency cache and removes
its temporary directory. To use already installed Node executables for the package
matrix, follow the [contributor instructions](../../CONTRIBUTING.md#researcher-contract-library).

The regression lives in [contracts.test.mjs](../../tests/contracts.test.mjs); the
independent consumer interaction is [package-smoke.mjs](../../tests/package-smoke.mjs),
invoked outside the checkout by [check-package.mjs](../../scripts/check-package.mjs).
The fixture expectations are in [fixtures.test.mjs](../../tests/fixtures.test.mjs).
These files retain the exact reproducible assertions; no private paths or raw
machine logs are needed in the public evidence record.

## Product proof still required

The command inventory and State/Input/Outcome method are approved. E2E-01 and
E2E-02 remain **not attempted**, because discovery, the Researcher instruction
bundle and runner are not implemented. The first #16 increment separately
[verifies bare startup](startup-verification.md); status/source/storage behavior
still needs installed-command evidence. #17 must demonstrate the whole real-runner path,
human decisions and actual saved/reopened outputs. LibreChat and external skill
claims need their own actual rehearsals. Lab compatibility needs a named consumer
trial. None of these claims follows from the passing library checks above.
