# Saved continuation: evidence and limits

Related to [#17](https://github.com/injectionator/n8r-surface/issues/17).
Use [the short human check](getting-started.md). This increment implements
SAVE-01 in numbered Markdown; it does not complete structured HTML/JSON/YAML,
broader host/live trials, Lab integration or registry distribution.

## Current verification

Real installed-Codex rehearsal pending. Human acceptance of this new increment
is pending. The prior conversation increment was user-reported Pass and PR #33
merged at `b186050`; that does not establish saved continuation.

The installed baseline advertises no saving/reopening and rejects `reopen`.
New offline tests exercise numbered saves/readback, predecessor byte conflicts,
source-write exclusion, symlink/replaced-folder refusal, human edits, latest mtime
ranking, explicit save authorization, failed draft turns, fresh reopening and
suggestion refusal. Scripted protocol responses are not real AI evidence.

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
