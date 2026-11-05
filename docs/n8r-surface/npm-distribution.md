# Dual npm distribution candidates

Issue [#27](https://github.com/injectionator/n8r-surface/issues/27) selects
`@n8r/surface` as the preferred package and library import, with `n8r-surface` as
an official alternative. Both expose the `n8r-surface` executable. Install one
route per environment because they provide the same command name.

This increment prepares **private local candidates**, not a published release.
The root manifest and generated manifests retain `private: true` and version
`0.0.0-experimental.1`. Publishing rights and registry installation are unproved.

## Build and inspect candidates

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

Both tarballs are named `n8r-surface-0.0.0-experimental.1.tgz`, so they live in
separate `scoped/` and `unscoped/` directories. `candidates.json` records their
relative paths, SHA-256 digests, version, source HEAD and dirty status. This is
local build evidence, not registry provenance. Release evidence must use a clean
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
  npm install --offline --ignore-scripts --no-audit --no-fund --package-lock=false "$candidate_run/packages/scoped/n8r-surface-0.0.0-experimental.1.tgz"
  node --input-type=module -e 'import {decode} from "@n8r/surface"; console.log(typeof decode)'
  ./node_modules/.bin/n8r-surface --version
  ```

  Expect successful installation, `function`, then
  `n8r-surface 0.0.0-experimental.1`; each exits 0.
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

## Registry routes after a separately approved release

These are planned routes; do not use them as evidence of a release today.
Replace `VERSION` with the same verified published version for either route:

```sh
npm install --global @n8r/surface@VERSION
# Alternative in a separate environment:
npm install --global n8r-surface@VERSION
# Explicit executable selection for a one-off invocation:
npm exec --package=@n8r/surface@VERSION -- n8r-surface --version
npm exec --package=n8r-surface@VERSION -- n8r-surface --version
```

Library users install the chosen exact version locally and import from
`@n8r/surface` (preferred) or `n8r-surface`. Source links must resolve to
[the official repository](https://github.com/injectionator/n8r-surface).
After publication, check each registry manifest's version, repository and
`dist.integrity`, verify its provenance against the reviewed source revision,
and repeat isolated installs and the command/asset readback for both names.
Matching repository text alone does not prove origin.

## Remaining release decisions and recovery

On 5 November 2026, public metadata lookups returned E404 for both names and
`npm whoami --registry=https://registry.npmjs.org` returned E401. This establishes
neither name availability nor publishing rights. An authorized maintainer must
establish the npm identity, `n8r` organization/team rights and unscoped ownership.
No credentials or account-security settings were changed by this increment.

Before publication, approve the release version, removal of private guards,
release workflow and authentication. Prefer trusted publishing for both packages
from the public repository on GitHub-hosted runners. npm documents Node 22.14+
and npm 11.5.1+ for trusted publishing and automatic provenance for public packages
from public repositories. Configure and verify each package's trust relationship;
local tarball tests cannot do this. See [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/)
(checked 5 November 2026). This PR adds no publishing workflow.

Use the same version and an explicit `experimental` distribution tag for both
packages; do not promote `latest` implicitly. Record each package's publication,
integrity and verification separately. If only one publishes, report the release
as incomplete and retain the exact approved build. Inspect existing registry
bytes before retrying the missing package; never replace or rebuild a published
version under an assumption of equivalence. Align tags only after both packages
pass registry readback. A mismatching published payload needs a new approved
version for both names. Publication, registry rehearsals, provenance verification
and human acceptance remain open under #27.
