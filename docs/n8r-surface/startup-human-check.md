# Human verification: bare startup (STARTUP-01)

Use a macOS or Linux terminal with Bash or zsh, Node.js **22, 24 or 26**, npm,
Python **3.9+**, Git and an authenticated GitHub CLI (`gh`). The recorded run used
macOS; this human procedure has not been rehearsed on Linux. No AI or Lab
credentials are needed.

Run the blocks below **in order, in the same terminal**, starting anywhere inside
an existing `injectionator/n8r-surface` checkout. Stop if a preparation command
fails. Installation downloads npm dependencies and creates ignored build files in
the checkout. The installed package, synthetic home, captured output and snapshot
all go in one temporary folder. Only the command under test receives that home.

## 1. Select PR #25 and run the automated checks

First run `git status --short`. **Expected: no output.** If it lists changes, keep
those changes and use your normal process to finish that work before switching.
Then run:

```sh
cd "$(git rev-parse --show-toplevel)"
gh pr checkout 25
git branch --show-current
git rev-parse HEAD
node --version
npm ci && npm cache add yaml@2.9.1 && npm test && npm run check:package
```

**Expected:** branch `feat/16-bare-startup`; record the printed commit for your
review. `node --version` must start with `v22.`, `v24.` or `v26.`. The final command
must exit **0**. Its output must show **43 tests passed, 0 failed, 0 skipped** for
`npm test`, then **20 tests passed, 0 failed, 0 skipped** for the installed startup
checks, plus these messages (Node's summary formatting varies by version):

```text
Installed package passed on Node v…; 4 nodes, 6 relationships, exact research references.
Installed PTY startup passed: overview before question, y and EOF, unchanged files.
```

Those checks drive a terminal automatically. Continue below to see and answer the
installed command yourself.

## 2. Install a disposable copy and prepare the starting state

```sh
n8r_verify=$(mktemp -d "${TMPDIR:-/tmp}/n8r-startup-review.XXXXXX")
n8r_verify=$(cd "$n8r_verify" && pwd -P)
npm pack --ignore-scripts --pack-destination "$n8r_verify"
npm install --prefix "$n8r_verify/install" --offline --ignore-scripts --no-audit --no-fund "$n8r_verify/n8r-surface-0.0.0-experimental.1.tgz"
mkdir -p "$n8r_verify/home/.n8r" "$n8r_verify/home/n8r/artifacts"
cat > "$n8r_verify/home/.n8r/n8r-surface.json" <<'JSON'
{
  "version": 1,
  "artefactRoot": "~/n8r/artifacts",
  "surfaceFormat": "json",
  "private": "PRIVATE_VALUE_MUST_NOT_APPEAR"
}
JSON
cat > "$n8r_verify/home/n8r/artifacts/librechat-uniqueid.json" <<'JSON'
{
  "contract": "n8r.surface/0.1",
  "id": "urn:surface:librechat-uniqueid",
  "title": "LibreChat",
  "scope": "Synthetic startup input; no research performed",
  "revision": {
    "id": "r1", "parent": null, "createdAt": "2026-11-04T00:00:00Z",
    "author": "Synthetic author", "reason": "Human startup verification"
  },
  "extensions": {}, "kind": "definition", "records": [], "vocabularies": [],
  "nodes": [], "relationships": [], "requirements": [], "coverage": [], "gaps": []
}
JSON
cp -R "$n8r_verify/home" "$n8r_verify/before"
printf 'Test home: %s\n' "$n8r_verify/home"
```

**Expected:** every preparation command exits **0**. The last line identifies the
home to expect in the overview. Your real `~/.n8r` and `~/n8r` are not used.

## 3. Run with closed input

```sh
n8r_exit=0
(cd "$n8r_verify" && env HOME="$n8r_verify/home" "$n8r_verify/install/node_modules/.bin/n8r-surface" </dev/null) >"$n8r_verify/closed.txt" 2>"$n8r_verify/stderr.txt" || n8r_exit=$?
cat "$n8r_verify/closed.txt"
printf 'Exit code: %s (expected 1)\n' "$n8r_exit"
```

**Expected:** return to the shell within **five seconds**, with no question or input
needed. If it is still waiting, press Ctrl-C and report a failed check. Output must
match the following; `<test-home>` is the path printed in step 2, and the positive
PID and UTC timestamp vary each run. Do not type the angle-bracket placeholders.

```text
Configuration
  File: <test-home>/.n8r/n8r-surface.json
  Settings version: 1
  Artefact folder: <test-home>/n8r/artifacts
  Surface output: JSON
  AI runner: Not configured
  Lab connection: Not configured

Processes
  n8r-surface overview: running (PID <number>); observed <UTC timestamp>
  Runner/Lab processes: Status unknown (no live status source)

Local artefacts (1)
  LibreChat | Surface definition | <test-home>/n8r/artifacts/librechat-uniqueid.json

Setup and AI conversation are not implemented in this build. Research needs a supported AI runner.
Run in an interactive terminal for read-only setup guidance.
Exit code: 1 (expected 1)
```

There must be exactly one artefact row. **Exit 1 is expected** because setup and
conversation are unavailable in this increment; exit 0 or 2 fails this prepared
case. Check private-value omission and stderr with:

```sh
if grep -Fq 'PRIVATE_VALUE_MUST_NOT_APPEAR' "$n8r_verify/closed.txt" "$n8r_verify/stderr.txt"; then printf 'FAIL: private value leaked\n'; else printf 'PASS: private value absent\n'; fi
if test -s "$n8r_verify/stderr.txt"; then printf 'FAIL: unexpected stderr\n'; cat "$n8r_verify/stderr.txt"; else printf 'PASS: stderr empty\n'; fi
```

**Expected:** `PASS: private value absent` and `PASS: stderr empty`.

## 4. Answer the real terminal question

Paste this block, then wait for the question. Do not pipe it through `tee` or
redirect its input/output: the command must see a terminal.

```sh
n8r_exit=0; (cd "$n8r_verify" && env HOME="$n8r_verify/home" "$n8r_verify/install/node_modules/.bin/n8r-surface") || n8r_exit=$?; printf '\nExit code: %s (expected 1)\n' "$n8r_exit"
```

**Before typing anything**, confirm that the configuration, processes and the one
LibreChat row have appeared, followed by the unavailable-setup message and then
`Show setup requirements? [y/N]`. The private marker must be absent. The closed-input
message about running in an interactive terminal must not appear here.

Type **`y` and Enter**. Expect:

```text
Research will require an explicitly selected runner, model and external credential reference. A Lab connection is optional. No settings have been changed.

Exit code: 1 (expected 1)
```

Run the same block again. This time press **Ctrl-D at the empty question**. Expect
an immediate return to the shell, `Exit code: 1 (expected 1)`, and no guidance answer
or error stack. No setup or conversation is expected to start in either case.

## 5. Confirm unchanged files and clean up

```sh
if diff -r "$n8r_verify/before" "$n8r_verify/home"; then printf 'PASS: fixture files and directory contents unchanged\n'; else printf 'FAIL: startup changed the fixture\n'; fi
```

**Expected:** only `PASS: fixture files and directory contents unchanged`, with no
diff. If any step differs from its expectation, retain the temporary folder while
you investigate and report the step, commit and Node version; do not call it a pass.
After inspection, remove only the temporary verification folder:

```sh
rm -r -- "${n8r_verify:?}"
unset n8r_verify n8r_exit
git status --short
```

**Expected:** no output. The temporary installation, synthetic home, snapshot and
captured output are gone. Ignored `node_modules/` and `dist/` from the build remain
in the checkout. This procedure verifies bare startup only; it does not complete
\#16 or verify AI-driven research.
