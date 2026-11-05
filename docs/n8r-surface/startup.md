# Bare startup and local vault setup (#16)

Bare `n8r-surface` displays readable non-private configuration, legacy saved
artefacts and known own-process status. It then offers first-use vault setup or
reuses the configured vault. Setup does not start research, scan source contents,
use a network, launch a runner or require an account. Bare startup is unchanged by the separate [Codex discovery increment](codex-research-verification.md).
SOURCE-01 remains paused; the new discovery path does not incorporate that checkpoint. This increment does not complete #16 or #30.

The earlier read-only overview and guidance question were delivered by
[PR #25](https://github.com/injectionator/n8r-surface/pull/25).
[Historical STARTUP-01 evidence](startup-verification.md) applies to that revision.
The setup increment replaces its guidance question and exit behavior; see the
[current setup rehearsal and human tasks](vault-setup-verification.md).

## Settings and parser decisions

One settings file: `~/.n8r/n8r-surface.json`, version 1, limited to 64 KiB.
The process home directory selects `~`, allowing an isolated verification home.
There are no project settings, command-line overrides or credential environment
reads. The repository's `.local/vault-path` remains an agent convention and is
not read by this command.

```json
{
  "version": 1,
  "vaultRoot": "~/n8r/",
  "artefactRoot": "~/n8r/artefacts",
  "surfaceFormat": "json"
}
```

`vaultRoot` is optional; absence means setup is pending. It stores the vault for
future research, containing `research/`, `artifacts/` and `surfaces/`.
`artefactRoot` remains the separate legacy structured-artefact location and defaults
to `~/n8r/artefacts`. No migration, renaming or inference from its parent occurs.
Both locations are displayed. Existing legacy content and every unknown settings
value are preserved. `surfaceFormat` defaults to `json` and also accepts `yaml`.
Optional `runner` and `lab` objects (or null) remain independent declarations;
only configuration presence is shown, never their private contents.

Expand `~/` against home. Stored relative paths resolve against the settings
folder. Newly entered relative vault paths resolve against invocation cwd;
first setup saves an absolute path. Validate the fully expanded/resolved path as
well as the input so that neither can introduce forbidden control characters.
Resolve pre-existing ancestors and an
explicitly selected vault-root symlink before showing the destination. Reject
empty custom paths, control characters, URL forms, non-directory collisions,
settings symlinks/special files and symlinked required vault children. Invalid
settings are retained for repair, never replaced with defaults.

Only zero arguments launches startup. Discovery and local help/version now have
separate paths described in [the command inventory](command-outcomes.md#research-01-first-standalone-conversation).
Unknown arguments exit 2 without echoing them or inspecting settings. No `setup`,
`--vault`, `--path` or `status` command is added.

## First use, reuse and repair

The read-only overview precedes all questions. With both input and output attached
to terminals, first use asks:

```text
Vault directory [~/n8r/]:
Vault directory: <resolved absolute path>
Create vault folders and save this location? [y/N]
```

Enter at the location question chooses `~/n8r/`. Only `y` or `yes` (case insensitive)
at confirmation permits writes. Refusal, EOF and interruption before acceptance
exit 1 without writes. Acceptance creates only missing directories, then adds
`vaultRoot` to settings and prints `Vault ready: <resolved absolute path>`.
Existing JSON member bytes are retained when inserting the new field, including
unknown numeric literals outside JavaScript precision/range.
No source files are read or written. Reject writes to settings/vault paths inside
the invocation directory, including symlink aliases and missing descendants.
Also reject vault folders inside the legacy corpus: adding directories there
would break its next inspection. Running setup from home can therefore be refused; run from a separate source
folder. Complete configured reuse is read-only even from such a directory.

A complete configured vault exits 0 without questions, locks or settings rewrites.
Missing required folders need repair confirmation; repair creates folders without
rewriting settings. An occupied child path or inaccessible vault exits 2. Existing
vault files are never removed. A failed confirmed setup may leave empty folders;
retry reuses them. Setup does not create the legacy corpus when it is absent.

| Outcome | Exit | Writes |
| --- | --- | --- |
| Successful accepted setup/repair | 0 | Missing folders; settings only on first setup |
| Complete configured reuse | 0 | None |
| Decline, EOF or interrupt before confirmation | 1 | None |
| Setup/repair needed with nonterminal input or output | 1 | None |
| Invalid settings/arguments, filesystem or conflict error | 2 | No successful setup claim; partial confirmed folders may remain |
| Legacy inspection error except absent corpus | 2 | None; takes precedence before any setup question |

Closed-input setup/repair prints exactly:

```text
Vault setup required; run n8r-surface in an interactive terminal.
```

It finishes promptly without waiting. Missing legacy corpus is reported as
unavailable/absent (`ENOENT`) and permits setup/reuse; it is not reported empty.
Other legacy errors remain visible even when a complete vault exists.

## Concurrency and recovery boundary

The user approved this cooperating-writer boundary on 5 November 2026. Other
editors must not write settings during confirmed setup. Directory/symlink topology
must stay stable while setup runs. This is not an adversarial filesystem or
power-loss durability guarantee, nor protection against arbitrary external writers.

After confirmation, exclusively create `~/.n8r/n8r-surface.json.lock`. Other setup
processes fail with exit 2 rather than wait or steal the lock. Compare the original
settings bytes under the lock before folder creation and again before publication.
Detected edits fail and retain the competing values. Write an exclusive temporary
sibling and close it only after all required folders are available. For absent
settings, publish with an exclusive hard link: a competing creator is preserved
even after the final byte check. For existing settings, atomically rename under
the lock. A writer ignoring that lock can still race the final check/rename;
no stronger guarantee is claimed.

Normal completion/failure removes only this invocation's temporary sibling and
lock. A killed process may leave these and empty folders. If a lock remains,
first establish that no setup process is active, inspect the saved settings and
vault, then remove the stale `n8r-surface.json.lock` manually and retry. Never
remove a lock while another setup may be running. Abandoned `.tmp` siblings may
be inspected and removed manually after establishing ownership; automatic setup
does not delete another invocation's files. No automatic age/PID-based lock theft.

## Local inspection boundary

List direct legacy folder entries in filename order, one terminal-safe line each.
Read JSON/YAML definitions and HTML research records with existing bounded readers;
use title/type metadata, never source or extension contents. Unsupported, invalid,
oversized, unreadable, symlink and non-regular entries remain visible as errors.
Do not recurse, open source locations or execute HTML. Reads are bounded to 2 MiB
per artefact. Terminal controls, line separators and bidi characters are escaped.

The process identifies only its own PID and observation time. Runner/Lab process
status remains unknown; configured settings do not establish a live process.
There is no daemon, PID registry, source scan, network probe or inference.

## Verification boundary

Transaction tests cover preserved values/bytes, malformed and oversized settings,
source overlap and symlinks, deterministic conflicting writes, a second real
process under a held lock, partial filesystem/publication failure and retry.
Process and PTY checks exercise the real command with independent filesystem
readback; the package check repeats them outside the checkout. See
[the verification record](vault-setup-verification.md) for exact revisions,
runtimes, human tasks and remaining limits. Automated rehearsal is not human
acceptance or proof of research, save/continue, or consumer compatibility.
