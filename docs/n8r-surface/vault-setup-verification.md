# Vault setup: maintainer verification record

**Installing or trying the command? Start with
[Install and choose your vault](getting-started.md).**
The procedures below are for maintainers recording isolated test evidence; they
are not prerequisites for using the command.

## Intent and expected result

Given an installed candidate, an empty isolated home and a source directory
outside the proposed vault, run `n8r-surface`, press Enter, then enter `y`.
Expect exit 0, a saved version-1 `vaultRoot`, and `research/`, `artifacts/`,
`surfaces/` under that vault. Independently open settings/folders and compare
source bytes. Run again from a second source directory: expect the same vault,
no question, exit 0 and unchanged settings/vault contents.

With another empty home and closed input, expect the setup-required message,
exit 1 promptly and no writes. No research, runner, scanning or findings are
part of this result. See [the exact contract](startup.md) and
[approved plan](../superpowers/plans/2026-11-05-standalone-vault.md).

## Baseline actually observed

On 5 November 2026, a clean tarball at
`6c88ffb8fd325df0421f9291c81776a892b2bdc1` was built and installed offline outside
the checkout. Environment: macOS 26.6.2 ARM64, Node 26.13.0. Two empty isolated
homes and a synthetic source containing `README.md` were prepared.

Both real-terminal and closed-input `n8r-surface` runs exited **2**, reported the
missing legacy `n8r/artefacts` corpus (`ENOENT`) and said setup was unimplemented.
No question appeared. Independently enumerated homes remained empty and source
bytes were unchanged. **Fail** against the new setup intent; successful baseline
observation. This supersedes the earlier missing-executable blocker, without
claiming any baseline setup success.

## Candidate observations

Product/test revision: `ebcb4b7eea1029ef013aa4a82f01195c4548a913`, stacked
on the unmerged planning PR #31 at `6c88ffb`. Agent rehearsal on 5 November 2026,
macOS 26.6.2 ARM64; no human acceptance is claimed.

| Runtime | Full suite | Installed process checks | Installed terminal interactions | Library consumer |
| --- | --- | --- | --- | --- |
| Node 22.23.2 | 74 passed | 25 passed | 18 passed | Passed |
| Node 24.22.2 | 74 passed | 25 passed | 18 passed | Passed |
| Node 26.13.0 | 74 passed | 25 passed | 18 passed | Passed |

Each `npm test` and `npm run check:package` exited 0, with no failed/skipped tests.
The package check installed a tarball outside the checkout and executed the bin.
The full suite's terminal case repeats the same 18 interactions against the build.

The human task list below was separately rehearsed through a disposable installed
candidate on Node 26.13.0, using a real terminal and manually supplied Enter/`y`:

| Task | Actual observation and independent readback | Agent result |
| --- | --- | --- |
| First use | Location then confirmation appeared; Enter/`y` printed `Vault ready:` and exited 0. | Pass |
| Open saved state | Parsed/read JSON contained exactly `version: 1` and absolute `vaultRoot`; directory listing showed `research`, `artifacts`, `surfaces`. | Pass |
| Another source directory | Same vault, no question, exit 0. Recursive before/after home comparison exited 0; both source comparisons exited 0. | Pass |
| Closed input, empty home | Exact setup-required line, exit 1 promptly; independent directory enumeration found zero entries. | Pass |

The automated interactions additionally exercised custom relative paths with
spaces, retained legacy/unknown settings, repair without settings modification,
refusal, EOF and SIGINT at both questions, and an external edit before acceptance.
The final review added installed checks for legacy-corpus overlap refusal and
safe/unsafe resolved root symlinks.
Transaction tests exercised deterministic publication conflicts/failures and a
second real process while the first held the lock. None of this is AI research
or proof of safety against writers outside the documented boundary.

Supporting repository checks: 24 Python fixture/workflow tests, Bash syntax,
Markdownlint 0.24.0 (56 files), cffconvert 2.0.0 and whitespace checks passed.
Lychee 0.24.2 passed for all tracked Markdown (zero errors). The exact
broad `**/*.md` invocation failed on 15 pre-existing links in an ignored local
evidence folder. That unrelated material was left unchanged; the broad command
is not reported as passing.

Fresh-context code review found three Important preservation/reuse failures:
legacy overlap, unknown numeric literal loss, and controls introduced by path
resolution. Each received a failing regression before the fix; the final suite
and installed matrix above were repeated after all fixes. No Critical or Minor
findings were reported, and none were deferred. The final pass retains the
approved setup-only and concurrency boundaries; it is not approval to merge.

Public output is sanitized; exact temporary paths and raw local evidence remain
outside tracked files. No real deployment data was used.

## Installation-guide rehearsal

On 5 November 2026, the documentation follow-up exercised the exact three npm
commands in [the getting-started guide](getting-started.md): `npm ci`, `npm pack`,
and global installation of the generated local tarball. All exited 0. Only npm's
global prefix was redirected to a temporary directory; the normal installation
was untouched. The installed bin then passed all 18 terminal interactions under
isolated homes on Node 26.13.0. This verifies the local-package installation route,
not npm registry publication or human acceptance.

## Maintainer preparation

Use a POSIX macOS/Linux terminal with Bash or zsh, Node 22, 24 or 26, npm and
Python 3.9+. The recorded environment is macOS; Linux and Windows are not local
acceptance claims. No account or AI credentials are needed. Start in this PR's
checkout, after preserving unrelated work. Record `git rev-parse HEAD`,
`node --version` and the operating system. Do not use a real user home as the
fixture or delete existing settings.

Build/install a disposable candidate, prepare two small sources, and define a
shell wrapper that gives only the installed command the isolated home:

```sh
npm ci && npm cache add yaml@2.9.1 && npm run build
n8r_verify=$(mktemp -d "${TMPDIR:-/tmp}/n8r-vault-review.XXXXXX")
n8r_verify=$(cd "$n8r_verify" && pwd -P)
npm pack --ignore-scripts --pack-destination "$n8r_verify"
npm install --prefix "$n8r_verify/install" --offline --ignore-scripts --no-audit --no-fund "$n8r_verify/n8r-surface-0.0.0-experimental.1.tgz"
mkdir -p "$n8r_verify/home" "$n8r_verify/closed-home" "$n8r_verify/source" "$n8r_verify/source-two"
printf 'Synthetic source bytes.\n' > "$n8r_verify/source/README.md"
printf 'Second source bytes.\n' > "$n8r_verify/source-two/README.md"
cp -R "$n8r_verify/source" "$n8r_verify/source-before"
cp -R "$n8r_verify/source-two" "$n8r_verify/source-two-before"
n8r-surface() { env HOME="$n8r_verify/home" "$n8r_verify/install/node_modules/.bin/n8r-surface" "$@"; }
cd "$n8r_verify/source"
```

Every preparation command must exit 0. npm preparation downloads dependencies;
the local tarball installation uses the prepared cache. The command's own setup
has no network activity. No vault/settings files are prepared on its behalf.

## Tester task list

- [ ] In that prepared terminal, run `n8r-surface`. Expect configuration and legacy
  corpus information, followed by `Vault directory [~/n8r/]:`. Press Enter. Expect
  the resolved path and `Create vault folders and save this location? [y/N]`.
  Enter `y`. Expect `Vault ready:` with that path. Run `echo $?`: expect **0**.
- [ ] Open the reported settings file and vault in your editor/file browser.
  Expect `version: 1`, absolute `vaultRoot`, and the three directories `research`,
  `artifacts`, `surfaces`. No legacy `artefacts` directory is promised or created.
  Open the source folder: its original `README.md` should remain the only file.
- [ ] Before reuse, the maintainer takes the readback snapshot described below.
  Run `cd "$n8r_verify/source-two"`, then `n8r-surface`. Expect the same vault,
  no question, and `echo $?` showing **0**. No research has begun.
- [ ] Run the following closed-input case. Expect prompt return (within five
  seconds), the exact setup-required line below and exit **1**. The maintainer
  verifies the second home is still empty.

```sh
env HOME="$n8r_verify/closed-home" "$n8r_verify/install/node_modules/.bin/n8r-surface" </dev/null
echo $?
```

```text
Vault setup required; run n8r-surface in an interactive terminal.
```

**Report:** Pass / Fail / Blocked for each task, candidate commit, Node/OS, the
interaction attempted, visible result and settings/folders inspected. Paths,
PID and observation timestamp vary; directory names and exit codes do not.
Missing folders, forgotten settings, changed source bytes or waiting on closed
input are failures. Human acceptance is separate from the agent rehearsal.

## Maintainer readback and cleanup

Immediately after first setup, before reuse:

```sh
cp -R "$n8r_verify/home" "$n8r_verify/home-after-setup"
cat "$n8r_verify/home/.n8r/n8r-surface.json"
ls -la "$n8r_verify/home/n8r"
```

After all tester tasks:

```sh
diff -r "$n8r_verify/home-after-setup" "$n8r_verify/home"
diff -r "$n8r_verify/source-before" "$n8r_verify/source"
diff -r "$n8r_verify/source-two-before" "$n8r_verify/source-two"
ls -A "$n8r_verify/closed-home"
```

Expect all three diffs to exit 0 with no output and the final listing to be empty.
These checks independently inspect actual command-created state. The automated
PTY harness also compares settings modification time on reuse/repair.
Keep the dedicated folder until evidence is reviewed. Optional cleanup:

```sh
cd "$n8r_verify/.."
unset -f n8r-surface
rm -r -- "${n8r_verify:?}"
unset n8r_verify
```

Only this dedicated test environment is removed. The checkout's ignored build
and dependencies remain. Never apply this cleanup to a real home or source.

## Supporting checks and limits

`npm test` includes real terminal interactions and deterministic transaction tests.
`npm run check:package` installs a tarball outside the checkout, runs the library
consumer, closed-input process checks and terminal interactions. Conflict tests
inject filesystem interleavings, including an exclusive-link race, a second real
setup process under the first process's lock, detected external edits, publication
failure and partial-folder retry. They do not establish arbitrary-writer safety.

The [concurrency boundary](startup.md#concurrency-and-recovery-boundary) requires
cooperating setup processes and no external edits during confirmed setup. Stable
path topology, local filesystem semantics and ordinary process completion are
assumed. Power loss, hostile filesystem mutation, network filesystems and Windows
are not verified. A killed process may leave a lock and empty directories.
The tarball stays private; no registry installation/release, research, continuation,
SOURCE-01, Lab integration or full #16/#30 completion is claimed.
