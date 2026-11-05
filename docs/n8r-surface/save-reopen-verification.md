# Saved continuation: evidence and limits

Related to [#17](https://github.com/injectionator/n8r-surface/issues/17).
Use [the short human check](getting-started.md). This increment implements
SAVE-01 in numbered Markdown; it does not complete structured HTML/JSON/YAML,
broader host/live trials, Lab integration or registry distribution.

## Current verification

**Pass (agent rehearsal), 5 November 2026. Human acceptance remains pending.**
The prior conversation increment was user-reported Pass and PR #33 merged at
`b186050`; the new saved-continuation evidence is recorded separately here.

- Implementation: [`447f440`](https://github.com/injectionator/n8r-surface/commit/447f44058c142d3a49ed827298d922a6458fbcb1).
  Rehearsal completed while repository HEAD was `b4407aa`, which changes only the
  offline test driver's prompt matching and plan notes, not product code.
- Installed tarball SHA-256:
  `926823a95209ace0183875b2aaa2a3423f46671ad423f38e2b1fcdf885ef9b2d`.
- Environment: macOS arm64, Node 26.13.0, Codex CLI 0.166.0, existing ChatGPT
  sign-in, explicit `gpt-6-astra`. A private run under the selected vault held the
  isolated install, n8r HOME/settings and copied synthetic source. Existing Codex
  sign-in was reused through CODEX_HOME without copying credentials.
- Loaded Researcher 0.1.8, combined instruction SHA-256
  `8af29c3073df9b8210a7dd94ced9700379b0a98f76bd3a2902f9430b93c98a2a`.
- [Actual sanitized terminal transcripts](save-reopen-transcript.md) retain model
  messages and source-read activity. Findings and note prose were produced by
  real Codex, not prewritten by the developing agent.

### Exercised interaction and independent readback

Starting state: copied `lumen-guide.md`, complete configured test vault, no saved
notes and unchanged version-1 settings. The installed command performed the short
human walkthrough's source investigation and OIDC decision, `/save`, `/exit`,
explicit-note reopen with renewed transmission consent, authentication follow-up,
`/save`, `/exit`. Both processes exited **0**. The original first note remained
byte-identical after its successor was saved.

A third process tested the user's additional request: append a human edit to the
older first note, prioritizing session-expiry evidence while retaining the OIDC
non-selection, then run `reopen --source SOURCE --model gpt-6-astra` without NOTE.
It suggested the edited `research-001.md`, showed its edit time, and waited for
selection and transmission consent. The conversation retained that edit and saved
`research-003.md`, linking the edited first note. It did not overwrite 002 or edit
001 again. This process also exited **0**.

Independent file reads found all five stable IDs in every note:
`component:lumen`, `component:inference`, `component:archive`,
`component:callback`, `component:oidc`. All retained the OIDC decision separately
from source claims, cited the actual guide, preserved unknowns and included
recommended next steps. The third retained the session-expiry priority. The first
note explicitly explains that source references require the accompanying guide.
No runtime connection or alternative authentication mechanism was invented as fact.

| Readback | SHA-256 / result |
| --- | --- |
| Source before and after all processes | `98d3374c79c166b37f0debb4ffb5e457eda1385dd7847b042cbad674cac98693` |
| Original 001, preserved after saving 002 and referenced by 002 | `9910959c740959e943e7d6cf4e81b1d365468ab33576fb9c83aa9ce25dc054e7` |
| Deliberately edited 001, preserved after saving 003 and referenced by 003 | `76b6abe6d616b903f641f2b8d52f06777ad5383060701ce49a314d3ff68eca52` |
| Saved 002 | `927a6a84a810d518b5e7bc8f37df3f29916e353a3bb6817ccf21b2cc36aee265` |
| Saved 003 | `56f317af8dfd30ea76cbfe0318bf74b226cc3be0ef851e0edc67bcd120d029d6` |
| n8r settings | Unchanged bytes |

Raw transcripts, saved files and readback report remain under the selected vault's
runs/ convention. No local vault path or private infrastructure data is published.
These are agent rehearsals using supplied synthetic human input, not human acceptance.

### Automated verification and review

- 97 Node tests passed on each of Node 22.23.2, 24.22.2 and 26.13.0.
- Installed-package checks passed on all three runtimes, including 20 offline
  discovery/save/reopen terminal scenarios. They cover no premature writes,
  failed and cancelled staged drafts, source scope, latest selection/refusal,
  changed-source comparisons, preserved predecessors and process cleanup.
- Storage tests cover edit-time ranking, occupied names, changed predecessors,
  symlink/replaced-folder refusal, bounded UTF-8 and human edits after metadata.
- Fresh review found missing historical evidence and incompatible reopen-size
  limits. Regression tests failed first, then passed after preserving unavailable
  evidence and using bounded comparison summaries rather than embedded source text.
- Linux CI exposed a test-driver race: a generic `[y/N]` matcher reused the first
  prompt's suffix. The driver now waits for the complete transmission prompt.
  Product code was unchanged; the initial failed CI run remains visible.
- Python fixture/workflow suite: 24 passed. Shell syntax, Markdownlint 0.24.0,
  offline Lychee 0.24.2 with fragments, cffconvert 2.0.0 and whitespace passed.

Scripted protocol tests are not AI evidence; fixture integrity is not model
conformance. The real rehearsal used one synthetic source and unchanged source
bytes. Broader products, live observations, second-source integration, structured
HTML/JSON/YAML, named Lab consumers and npm distribution remain open in #17/#27.

## Storage and continuation boundary

`/save` authorizes one numbered Markdown output. A dynamic `research_note` call
stages a draft in memory only during that host-authorized turn. The host writes
only after successful turn completion; ordinary conversation and unsolicited tool
calls cannot write. Natural-language save requests receive `/save` guidance.
The host shows the destination, appends current source-tool evidence and identified
Researcher/model metadata, writes a temporary file, publishes by exclusive hard
link, independently reads it back and prints the saved path and byte digest.
Predecessors retain their bytes; successors link their name and exact digest.
A changed predecessor requires reopening its edited version before another save.

Notes have a 256 KiB total limit, with at most 192 KiB of model prose and 1,000
source evidence entries. They use an experimental host metadata envelope, not
an AI Surface interchange schema. Model-authored prose and IDs are checked in the
rehearsal, not mechanically validated for truth. Metadata and human-edited prose
are untrusted input on reopening; hashes identify bytes, not authenticity.

`reopen [NOTE] --source SOURCE` requires explicit current source selection and
renewed note/source transmission permission. It starts a new ephemeral Codex
thread, compares saved evidence hashes with the selected source, reports changed
or unavailable evidence, and supplies the note plus comparisons as untrusted
research context. Reopening compares the saved evidence paths, retaining unavailable prior evidence
for subsequent attempts. Compact comparisons sent to the model are bounded to
128 KiB with an explicit omitted count; full source text is read on demand through
the normal tools. Combined context is bounded to 512 KiB. Current source reads retain their normal limits;
no shell, broad filesystem write or extra execution environment is granted.

Without NOTE, the command suggests the latest filesystem-edited numbered note in
that source's research folder, showing UTC edit time and requiring acceptance.
A tied time sorts by filename; an invalid newest note is reported, not skipped.
Folder naming and edit time do not establish source identity. Explicit NOTE can
select another folder, and successors remain there. Only this command's metadata
notes are supported; generic Markdown import is later work.

Destination ancestor identities and predecessor bytes are checked again before
publishing. Existing names are never replaced. Directory topology must remain
stable during synchronous filesystem operations; this is not protection against
an adversarial concurrent directory replacement. An interrupted process can leave
an unreferenced hidden temporary file; it does not overwrite an earlier note.
Local storage does not provide backup, encryption or publication.

## Pending-operation indicator follow-up

The user reported long silent waits during `/save` and after questions. Commit
`a6d11ad` adds a terminal-only spinner with elapsed seconds for connecting,
answering, reopening and preparing a note. It clears around normal output and
stops before returning to the prompt, including errors/cancellation. It reports a
pending request, not known server-side progress; nonterminal output never animates.

An isolated installed candidate was rehearsed with real Codex 0.166.0,
`gpt-6-astra`, ChatGPT sign-in and Node 26.13.0 on macOS. The same synthetic Lumen
question/OIDC choice was followed by `/save` and `/exit`. The spinner produced
162 preparation frames over approximately 40 seconds, cleared before
**Saved and read back**, and produced no activity after the final `You>` prompt.
One note was saved, exit was 0, and source/settings bytes remained unchanged.
Raw terminal output and independent readback remain in the selected vault's runs/.
Tarball SHA-256: `d90df87bc3f1db05a5de01ee0080d88a599ca4050e63473e548907f53b6dfe3a`.

99 Node tests and the installed-package check passed. Terminal scenarios still
cover cancellation/failure; focused tests verify repeated activity, clearing around
output, timer cleanup and nonterminal silence. The six GitHub checks passed on
`a6d11ad`. The short walkthrough now names the visible labels and expected stop.
