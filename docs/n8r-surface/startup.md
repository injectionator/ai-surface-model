# Bare startup increment (#16)

Implements only [STARTUP-01](command-outcomes.md#startup-01-run-the-command-and-see-what-is-here).
The branch is stacked on #15's `feat/15-researcher-contracts` at `5f67dbe`;
PR #24 and its base PR #18 were still draft and unmerged on 4 November 2026.
The user authorized this dependent increment. It does not complete #16.
[PR #25](https://github.com/injectionator/n8r-surface/pull/25) retains the work;
[installed-command evidence](startup-verification.md) records STARTUP-01 as verified.

## Settings and parser decisions

One contributing file: `~/.n8r/n8r-surface.json`. No project-file, environment
setting or command-line overrides are introduced in this increment. The process's
home directory selects `~`, which also permits an isolated verification home.

```json
{
  "version": 1,
  "artefactRoot": "~/n8r/artifacts",
  "surfaceFormat": "json"
}
```

`version` must be `1`. Optional `artefactRoot` defaults to `~/n8r/artefacts`;
optional `surfaceFormat` defaults to `json` and also accepts `yaml`. Expand `~/`
against home; resolve a relative folder against the settings file's directory,
never invocation cwd. Display the effective absolute folder and which values
defaulted. This resolves the earlier proposed default while preserving the
`artifacts` override used by STARTUP-01. Missing configuration uses defaults with
an explicit missing-file notice; invalid/unreadable configuration is retained and
prevents corpus inspection, rather than silently selecting a different folder.

Optional `runner` and `lab` objects are independent declarations reserved for
later increments. Report only whether each is configured, with connection and
availability unverified; do not print their contents, URLs or credential fields.
Unknown settings are retained on disk and not interpreted or printed. No values
are read from credential environment variables. Settings are limited to 64 KiB.

Only zero arguments launches the overview. Any arguments currently return code 2
and explain that only bare startup is implemented, without echoing supplied text
or inspecting files. `status`, help/version and discovery remain specified future
increments, not accepted parser syntax. Valid startup exits 1 because setup and
the AI conversation remain unavailable; inspection/configuration errors exit 2.
Exit 0 is reserved for a later successful informational command.

The overview always precedes any question. With terminal input/output it offers
`Show setup requirements? [y/N]`, then prints guidance on `y` and exits without
writing. This is a read-only guidance question, not setup or conversation success.
With closed/piped input it gives the unavailable-capability explanation and exits
without reading input. Invalid configuration does not offer a question.

## Local inspection boundary

List direct folder entries in filename order, one terminal-safe line each. Read
JSON/YAML definitions and HTML research records using the existing bounded
contract readers; use title/type metadata, never source or extension contents.
Unknown, invalid, oversized, unreadable, symlink and non-regular entries retain
their filename and a limitation. Do not recurse, follow entry symlinks, open
source locations or execute HTML. Reads are bounded to 2 MiB per artefact.
Control characters, line separators and bidirectional formatting characters in
labels/paths are escaped so they cannot inject terminal actions or extra rows.

The current command can reliably identify only its own live process: show its
PID and observation time. Other runner/Lab process status is unknown. Configuration
or saved PIDs are never evidence of a live process. No daemon, PID registry,
network probe, source scan or inference is added.

## Implementation and verification plan

Use TypeScript, existing codecs and Node built-ins; add no dependency.

1. Add ordinary process/output/file tests in `tests/startup.test.mjs`. Prepare the
   synthetic configuration and LibreChat Surface under a temporary home. Catch a
   missing overview, leaked private marker, incorrect location, invented process
   status, changed files and a process that waits on closed input. Run them before
   implementation to confirm the missing entry point.
2. Add `src/startup.ts` for safe local inspection and `src/cli.ts` for the zero-arg
   process/terminal boundary; register the built executable in `package.json`.
   Cover defaults, two artefacts, empty/missing/unreadable folders and entries,
   invalid configuration, spaces, controls, symlinks and unsupported files.
3. Extend `scripts/check-package.mjs` to run the same checks through the installed
   `n8r-surface` bin outside the checkout. Use a Python PTY rehearsal to observe
   output before answering the real guidance question, then independently compare
   file snapshots. Run all tests and package checks on Node 22, 24 and 26.
4. Record observed output, revision, environment and limits; update progress and
   contributor instructions. Inspect the diff, commit, push and open a draft PR.

Review focus: no raw parser errors or nested private settings in output; no
invented process liveness; no false empty-corpus result after failed inspection;
no symlink/FIFO traversal or terminal escape injection; installed execution has
no dependency on the source checkout. All are covered by the checks above.

Remaining #16 work: real setup and configuration changes, `status`, help/version,
source selection, guarded create/update storage, and unavailable-discovery
handling. Actual AI research and instruction bundles belong to #17.
