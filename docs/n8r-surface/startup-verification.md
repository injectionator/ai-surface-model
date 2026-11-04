# STARTUP-01 verification record

**Result:** specified, implemented and verified for the read-only bare-startup
increment. This does not complete #16 or verify setup, status, discovery or an AI
conversation. [Settings, parser decisions and limits](startup.md) define the
implemented boundary. [PR #25](https://github.com/injectionator/n8r-surface/pull/25)
is stacked on #15's draft PR #24; nothing is merged or released.

## Human verification

Follow the [copy-and-paste human check](startup-human-check.md) for prerequisites,
PR checkout, a disposable installation and synthetic home, exact expected output,
interactive `y`/EOF steps, private-value checks and cleanup. Its expected exit 1
is explained explicitly. The automated commands later in this record support
that hands-on check.

On 4 November 2026, Codex rehearsed the guide's disposable installation, closed
input, terminal `y` and Ctrl-D, private-value/stderr checks and unchanged-file
comparison on Node 22.23.2, npm 11.5.2 and macOS ARM64. The expected output and
exit codes matched; all 43 tests and 20 installed startup checks also passed.
This is an agent rehearsal, not recorded human acceptance.

## Revision and environment

- Date: 4 November 2026. Implementer/verifier: Codex; separate read-only agent
  review found no important issues in the startup implementation.
- Baseline: `5f67dbea2be93a6ee6bedb9a029bc79be4b3997d`.
- Implementation and retained test revision:
  `b90358aaf22fead155081bb00f6d837a0f8f59e7`. The matrix below was repeated from
  this committed revision with a clean working tree before writing this record.
- macOS ARM64; Node.js **22.23.2, 24.22.2 and 26.13.0**; npm **11.5.2**;
  Python **3.13.1** for the terminal rehearsal.
- Private package `n8r-surface@0.0.0-experimental.1`, built and packed locally,
  then installed outside the checkout using `--offline --ignore-scripts`.
  `npm ci` populated the dependency cache; no registry publication occurred.
  Each matrix executable was the `node` binary in its own runtime directory.

## Baseline and prepared state

At the baseline, `command -v n8r-surface` returned no path (exit 1) and the package
manifest contained no `bin` entry. The installed product interaction was therefore
**blocked by an absent executable**, not an observed failed startup. No research
or setup result was invented. After adding the process tests, 16 startup checks
failed on the missing built entry point while the existing 23 library tests passed.

The repeatable check creates a temporary home containing:

- `~/.n8r/n8r-surface.json`: version 1, `artefactRoot: "~/n8r/artifacts"`,
  `surfaceFormat: "json"`, and synthetic private markers in ignored settings.
- `~/n8r/artifacts/librechat-uniqueid.json`: a valid synthetic `n8r.surface/0.1`
  definition titled **LibreChat**. It is a prepared input, not Researcher output.
- No runner or Lab configuration. A synthetic credential marker in the process
  environment must also be absent from output. A saved PID in ignored settings
  must not imply runner liveness.

**Interaction:** invoke installed `n8r-surface` with no arguments from the
isolated home. First close stdin and capture output/exit. Then run the same
installed bin in a real POSIX terminal, wait for the guidance question, check the
already-received overview, and answer `y`. Repeat with terminal EOF (Ctrl-D).
No credentials or running Lab are required.

## Observed terminal output

This is the installed PTY readback, with only the temporary home replaced by `~`,
PID/time represented by labelled placeholders, and readline cursor escapes removed.
The assertions use the real paths, compare the child PID with its process result,
and check the timestamp is present. File contents are independently reread.

```text
Configuration
  File: ~/.n8r/n8r-surface.json
  Settings version: 1
  Artefact folder: ~/n8r/artifacts
  Surface output: JSON
  AI runner: Not configured
  Lab connection: Not configured

Processes
  n8r-surface overview: running (PID <observed PID>); observed <UTC timestamp>
  Runner/Lab processes: Status unknown (no live status source)

Local artefacts (1)
  LibreChat | Surface definition | ~/n8r/artifacts/librechat-uniqueid.json

Setup and AI conversation are not implemented in this build. Research needs a supported AI runner.
Show setup requirements? [y/N] y
Research will require an explicitly selected runner, model and external credential reference. A Lab connection is optional. No settings have been changed.
```

With closed input, the same overview appears, followed by the unavailable-capability
message and `Run in an interactive terminal for read-only setup guidance.` No
question appears and the process exits within the five-second test deadline.
Valid startup exits **1**, explicitly indicating unavailable setup/conversation;
inspection errors and arguments exit **2**. This is not research success.

## Independent readback and repeatable evidence

| Expected outcome | Observed check |
| --- | --- |
| Readable settings and actual configured location | Output matches the prepared configuration path, `artifacts` override, JSON format and unconfigured runner/Lab. Defaults separately resolve to `artefacts`; relative paths resolve against the settings directory. |
| One logical row per entry | The supplied LibreChat definition appears exactly once with its title, type and filename. Two-entry cases also list HTML research metadata; YAML definitions are read. Controls in titles are escaped. |
| Private values stay private | Markers in nested/unknown settings, URL credentials, malformed input, artefact bodies and the credential environment are absent. Parser errors never echo source content. |
| Reliable status only | The displayed live overview PID equals the spawned child PID. Runner/Lab status remains unknown, including with a saved PID or declared runner/Lab configuration. |
| Read-only startup | Before/after bytes, modes and modification times match; the snapshot also checks the directory inventory. PTY `y` and EOF preserve the files and directories. |
| Empty differs from unavailable | Empty folders say empty; missing/unreadable folders report the path/problem. Invalid or unreadable configuration prevents corpus inspection and remains intact. |
| Unsupported entries do not disappear or hang | Unsupported, invalid, oversized, unreadable, symlink and directory entries retain a row with a limitation. FIFO configuration and entries finish without blocking. |
| Overview precedes interaction | PTY checks see configuration, processes and the artefact row before the live guidance question, then supply `y` or EOF. |
| Installed consumer needs no checkout | The tarball supplies the executable, library and assets. The same startup assertions invoke `n8r-surface` from its installed bin directory under a temporary home. |

All **43 tests** (23 existing library checks plus 20 startup checks) passed with
`npm test` on each supported Node major above, with no skips. The installed-package
matrix passed the library consumer check, all **20 startup checks**, and both PTY
interactions on each runtime. A separate reviewer also exercised terminal `n`,
Ctrl-D and Ctrl-C on Node 22 without raw diagnostics or a hang.

A validation regression found during implementation treated explicit null settings
as defaults. Two new checks failed before the fix; null folder/format values now
report invalid configuration without inspecting a fallback folder.

Reproduce from the repository:

```sh
npm ci
npm test
npm run check:package
```

For the supported runtime matrix, run `npm test` with each runtime on PATH, then:

```sh
node scripts/check-package.mjs /path/to/node22/bin/node /path/to/node24/bin/node /path/to/node26/bin/node
```

The paths above are placeholders. Use binaries named `node` in separate runtime
directories: the installed shebang resolves `node` from that directory on PATH.
A custom-named executable beside a different `node` would not establish the same
matrix. Retained evidence is ordinary code in
[startup.test.mjs](../../tests/startup.test.mjs),
[startup-pty.py](../../tests/startup-pty.py) and
[check-package.mjs](../../scripts/check-package.mjs), plus the observed readback
above. The checks remove their temporary installations/homes. No raw machine
paths or private logs are retained in the repository.

## Remaining limits

Only the command's own process is directly known; there is no process registry or
proof of a live AI runner or Lab. Configured runner/Lab objects are declarations
whose contents are withheld. Missing setup is explained, not repaired.

The listing recognizes the experimental #15 profile. Older illustrative LibreChat
JSON, manually edited HTML, unknown formats and unsupported versions get a
limitation row; there is no universal Surface conformance claim. Files are bounded
per entry, but this increment does not provide a large-corpus index or total scan
time limit. Network-mounted folders were not exercised. Linux and Windows were
not exercised; PTY verification requires POSIX and Python. No inference, source
research, Lab compatibility, registry/npx download or release claim is made.

Next in #16: separately specify and verify `status`, then real setup, help/version,
source selection, guarded storage and unavailable-discovery handling. Actual
Researcher instructions and AI-driven repository research remain #17.
