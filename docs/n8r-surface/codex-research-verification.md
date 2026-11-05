# Standalone Codex conversation: evidence and limits

Use [Install → run → check](getting-started.md) to try this increment. This record
is for maintainers; it is not a prerequisite for the human walkthrough.

## Scope and status

Related to [#17](https://github.com/injectionator/n8r-surface/issues/17).
RESEARCH-01 implements a source conversation and follow-up. It does not complete
E2E-01, save/reopen/continue, structured output, Lab integration or distribution.
The user prioritized standalone AI, then saved continuation, then npm distribution.

The installed development candidate completed a real two-turn synthetic Lumen
conversation on 5 November 2026: source list/read, cited findings, and the supplied
OIDC correction retained separately from guide claims. Independent readback found
identical source SHA-256, unchanged settings and no files in the research vault.
That run preceded the final root-identity and turn-correlation fixes. The final
candidate rehearsal and exact commit will be recorded here before handoff.
Human acceptance remains pending.

## Architecture

The TypeScript terminal client launches the installed Codex app-server over local
stdio. It uses the existing ChatGPT sign-in, checks account type, and requires the
configured model or explicit `--model` choice. It rejects custom providers/endpoints
and never falls back to API keys or another model. No credential bytes are read,
copied into settings or printed by this adapter. Codex retains ownership of its
authentication, caches and diagnostics.

The adapter is pinned to **Codex CLI 0.166.0**. Protocol interfaces were generated
from that exact installed executable with:

```sh
codex app-server generate-ts --experimental --out /tmp/n8r-protocol
```

It uses `initialize`/`initialized`, `account/read`, `config/read`, `thread/start`,
`turn/start`, `item/tool/call`, turn/item notifications and `turn/interrupt`.
Experimental dynamic tools and permissions require the initialization capability.
See the official [app-server protocol](https://developers.openai.com/codex/app-server)
and [permission profiles](https://learn.chatgpt.com/docs/permissions).
Future CLI versions must be checked deliberately before broadening the pin.

One ephemeral thread holds successive turns. The CLI has no reopen interface and
produces no research artefact. It prints completed agent messages as they arrive,
not token-by-token deltas. Requests have a 45-second response deadline; a turn has
a ten-minute limit. Ctrl-C requests interruption, closes the owned process and
exits 130; EOF during an answer exits 1 and marks it incomplete. EOF at the prompt
or `/exit` exits 0. Failed turns exit 2, including failure after partial output.
A stale event/callback cannot complete or read for a newer turn.

### Shared instructions

The npm tarball contains the canonical plugin manifest, Researcher `SKILL.md` and
all four reference documents without rewriting them. Version **0.1.8**, combined
SHA-256 **`8af29c3073df9b8210a7dd94ced9700379b0a98f76bd3a2902f9430b93c98a2a`**.
The digest hashes, in fixed order, each relative path, NUL, original bytes, NUL.
The adapter appends host limits: source inspection only, evidence citations,
human corrections separate from source claims, and no save capability.
Installed-package checks independently load the bundle outside the checkout and
compare this digest. This is instruction loading evidence, not universal proof
that a model follows every instruction.

### Source capability and permissions

The model chooses `source_list`, `source_search` and `source_read` calls. The host
returns real evidence, not developer-authored findings. A directory or single file
is explicitly selected and displayed before authorization. File-only access cannot
read siblings. Paths are relative; traversal, absolute paths, control characters,
backslashes, descendant symlinks and special files are rejected. The host checks
canonical root identity and ancestry on every operation, including between turns.
Directory topology must remain stable during each operation: these Node filesystem
checks are not an adversarial concurrent-filesystem transaction.

Hidden entries, `node_modules`, `vendor`, `dist`, and key/certificate containers
are excluded. This is not a general secret detector; choose sources permitted for
transmission. UTF-8 files are bounded to 256 KiB. Reads return up to 200 lines and
32 Ki characters, with full-file byte digest, timestamp and truncation status.
Search is literal and case-sensitive, bounded to 100 files, roughly 8 MiB of
source bytes (one final file may cross the threshold), 1,000 entries, depth 32 and
100 matching lines. Listings expose exclusions and truncation. Missing coverage
never proves absence. No source code is executed.

Codex receives an empty execution-environment list, no runtime workspace roots,
a read-only/no-network permission profile, and no approval escalation. The
adapter disables configured MCP servers, apps, plugins, hooks, shell, browser and
other unrelated facilities, suppresses automatic source instructions and memories,
and does not inherit API keys or desktop-internal task channels. A pre-existing
profile with the adapter's reserved name is rejected instead of merged. Unknown
server requests fail closed; source callbacks require the active thread and turn.

Codex can still describe generic native tool names in its model-visible catalogue.
A separate synthetic PNG boundary probe on 0.166.0 attempted native `view_image`
and reported **“No usable execution environment is available.”** No image read
was established. This supports the empty-environment boundary for that attempt;
it is not comprehensive OS sandbox certification or proof for every future tool.
The host source-path checks have separate deterministic regression tests.

## Baseline and prerequisite investigation

The original installed `discover` invocation exited 2 with the bare-startup-only
message. Codex 0.139.0 reported ChatGPT sign-in but rejected `gpt-6-astra` as needing
a newer client. Its model list offered `gpt-5.5`; the user explicitly selected it,
but inference rejected it for ChatGPT sign-in. Neither result proves inference.

The user then authorized a CLI update and retry of `gpt-6-astra`. `codex update`
installed 0.166.0 in the active Node 26 global prefix; the older executable in a
different prefix remains. The command checks whichever `codex` is on its PATH.
Existing sign-in was reused; the saved model setting was not changed.

`codex exec` and then app-server both completed real `gpt-6-astra` responses.
During protocol exploration, defining a named permission profile without its
required `default_permissions` caused a late workspace-requirements error.
Supplying both resolved it; the regression checks require the complete profile.
No managed requirement was disabled or bypassed.

## Automated verification

Current development run: 89 Node tests passed, including offline terminal cases
for confirmation refusal (no Codex launch), API-key rejection, same-thread turns,
out-of-scope tool calls, failed answers, stale events/callbacks, malformed identity,
authentication changes, EOF, and cancellation during connection and an active turn.
The terminal fixture is explicitly scripted and is **not real AI evidence**.
It verifies process behavior, source/settings bytes and child cleanup.

Final Node 22/24/26, installed-package, Markdown, local-link, citation and fixture
results will be recorded with the final candidate. Automated rehearsal does not
replace human acceptance of the short walkthrough.

## Remaining acceptance

- Human run of the short walkthrough and Pass / Fail / Blocked report.
- Save/readback, fresh-session continuation, preserved decisions and identities.
- Validated HTML/JSON/YAML, broader products and the complete E2E-01/E2E-02 cases.
- Live UI/API observations and later named Lab consumer verification.
- Registry distribution under #27, separately authorized.
