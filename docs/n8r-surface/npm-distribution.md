# npm distribution and retained candidates

The published package is **`@n8r/surface@0.1.0-experimental.2`**, exposing the
`n8r-surface` executable. The maintainer selected scoped-only publication under
[issue #27](https://github.com/injectionator/n8r-surface/issues/27).
Unscoped publication and name reservation have been removed from the plan.
The existing unscoped output is legacy tooling, not a supported registry route.
See the [verified release record](npm-release.md#verified-scoped-release).

The tooling below still generates and tests both candidates from one build.
Source and default generated manifests retain `private: true`; explicit
`--publishable` preparation creates fresh publishable archives without publishing.
Do not rebuild or restage the released version. A later release requires a new
reviewed version and updated first-release guards.

## Build and inspect candidates

These commands describe the current legacy implementation, which still generates
and tests both names. They are not a plan to publish the unscoped output.

From the checkout root, with Node 22, 24 or 26, npm, Git, POSIX `tar` and Python 3.9+:

```sh
npm ci
npm cache add yaml@2.9.1
npm test
npm run check:package
candidate_run=$(mktemp -d)
npm run pack:candidates -- "$candidate_run/packages"
cat "$candidate_run/packages/candidates.json"
```

Dependency preparation uses the network. Candidate packing and consumer checks
use local files/cache with lifecycle scripts disabled. `pack:candidates` builds
once into a fresh temporary directory (excluding stale checkout `dist/` files),
captures npm's source payload once, and generates both packages from that
payload. Development scripts/dependencies are removed from both manifests;
only `name` differs between them. Versions, engines, licenses, dependencies,
exports, executable and asset bytes match. Existing destinations are refused.
A failed run may leave an incomplete destination; use a new directory on retry.

Both tarballs are named `n8r-surface-0.1.0-experimental.2.tgz`, so they live in
separate `scoped/` and `unscoped/` directories. `candidates.json` records their
relative paths, SHA-256 digests, version, source HEAD and dirty status. This is
local build evidence, not registry provenance. Each entry also names a unique
`releaseAsset` for later GitHub upload; see the [version and release policy](versioning.md). Release evidence must use a clean
reviewed checkout; a dirty report does not identify all inputs by commit alone.

`check:package` installs each candidate in a separate temporary consumer outside
the checkout, imports its own package name, checks installed identity and assets,
and runs the startup/discovery terminal rehearsals. Temporary homes isolate
settings and vaults. Discovery uses a scripted offline fixture, not real inference.
Existing [real Codex evidence](surface-revisions-verification.md) remains separate.

## Human verification

Maintainer preparation: supply this checkout and the candidate build above.
Keep the same terminal so `candidate_run` remains set. No global installation,
Codex sign-in or existing vault is needed for this distribution check.

- [ ] Install the preferred candidate into an isolated consumer and inspect it:

  ```sh
  mkdir "$candidate_run/consumer"
  cd "$candidate_run/consumer"
  npm install --offline --ignore-scripts --no-audit --no-fund --package-lock=false "$candidate_run/packages/scoped/n8r-surface-0.1.0-experimental.2.tgz"
  node --input-type=module -e 'import {decode} from "@n8r/surface"; console.log(typeof decode)'
  ./node_modules/.bin/n8r-surface --version
  ```

  Expect successful installation, `function`, then
  `n8r-surface 0.1.0-experimental.2`; each exits 0.
- [ ] Run bare startup with a fresh isolated home and closed input:

  ```sh
  mkdir "$candidate_run/home"
  HOME="$candidate_run/home" USERPROFILE="$candidate_run/home" ./node_modules/.bin/n8r-surface </dev/null
  echo "$?"
  ls -A "$candidate_run/home"
  ```

  Expect the overview, `Vault setup required; run n8r-surface in an interactive
  terminal.`, exit **1**, and no home entries. This is the expected unconfigured
  path. No normal settings or vault should change.
- [ ] Repeat the first two tasks in a new `consumer-alternative` directory,
  using the `unscoped/` tarball, import `"n8r-surface"` and a new `home-alternative`.
  Expect identical command behavior and exit codes.
- [ ] Report **Pass / Fail / Blocked**, Node/npm versions, both installed names,
  and unexpected output. Missing imports/assets, a different version or writes
  during closed-input startup are failures. Return the candidate report too.
  After inspection, leave the consumer directory and remove only the temporary
  directory created by `mktemp`; keep any evidence you need first.

## Verified scoped registry route

```sh
npm install --global @n8r/surface@0.1.0-experimental.2
npm exec --yes --package=@n8r/surface@0.1.0-experimental.2 -- n8r-surface --version
```

Library users install the scoped exact version locally and import from
`@n8r/surface`. The [release record](npm-release.md#verified-scoped-release)
contains independent bytes, installation and signed-provenance verification.
Use the exact version or `experimental`; `latest` was not promoted.

## Remaining tooling cleanup

Remove unscoped candidate generation and dual-package assumptions from packing,
package checks, release verification and the release workflow before a future
scoped release. Preserve the existing immutable release and historical artifacts;
no unscoped publication, reservation or acquisition work is planned.

The scoped release used stage-only authentication and maintainer 2FA approval.
Future authentication and recovery follow the [version policy](versioning.md).
A new release or tag promotion still requires its own authorization.
