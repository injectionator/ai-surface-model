# Saved research to partial Surface revisions

Related to [#17](https://github.com/injectionator/n8r-surface/issues/17).
This describes the next increment; it is not implementation evidence.

## Intent and approved interaction

A person with saved Markdown research should be able to ask “Create a Surface
from these notes; show me what is selected and still unknown,” inspect the result,
save it, exit, reopen in a fresh process, change a human decision and save a
successor. The user approved linked research HTML and Surface JSON, with either
saved artefact reopening the pair. npm distribution and Lab integration are later
work. Preserve the praised activity feedback during model work.

State X is an existing numbered note, source access, configured vault and supported
Codex sign-in. Input Y is that conversation followed by an explicit save and fresh
reopen. Outcome Z is two readable, validated revisions whose evidence, decisions,
identities and parent references can be independently inspected, while the original
note, predecessors, source and settings bytes remain unchanged.

## Builder decisions for this increment

These are implementation choices, not additional user requirements:

- Keep `/save` as the existing Markdown save. Add `/save surface` to persist the
  currently previewed structured pair, without asking the model to regenerate it.
  Natural-language save requests explain the explicit command. No draft means no
  save. A later conversational turn invalidates the previous preview before it
  starts, preventing an old preview from being saved after a correction or failure.
- A bounded `surface_draft` tool stages one research record and one definition in
  memory. It has no filesystem capability. The host validates them, derives exact
  research references and revision envelopes, and prints a deterministic summary
  of components, declared connections, choices, requirements, coverage and gaps
  after successful turn completion. Failed or cancelled turns discard candidates.
- Use the existing `n8r.research/0.1` and `n8r.surface/0.1` contracts and JSON codec.
  Render research HTML with the existing deterministic renderer. No parallel model
  or new general schema. Validation establishes bounded structure/reference
  integrity, not factual correctness or deployed behavior.
- Store each pair in a numbered directory under `surfaces/<source-slug>/`, with
  `research.html`, `surface.json` and a host manifest. Keeping a pair together
  permits publication as one directory and relocation without absolute links.
  The manifest contains byte hashes, portable provenance and predecessor location;
  it is a storage detail, not part of the AI Surface Model. Print both saved paths.
- `reopen FILE --source SOURCE` accepts either member of a host-created pair as
  well as existing Markdown notes. Omitted FILE continues suggesting Markdown
  notes only. No implicit vault scan for referenced records. Arbitrary imported
  multi-record graphs are outside this first pair workflow.
- On reopening a pair, validate both files, manifest hashes, HTML/data agreement
  and research references before inference; reacquire transmission consent and
  source access. Retain historical evidence when a source is unavailable. Limit
  the whole transmitted context independently of source text. Oversized pairs fail
  with a clear explanation rather than silently dropping evidence.

## Preservation and trust boundaries

The host assigns artefact IDs and revision IDs and calculates logical digests;
model text must not invent these bookkeeping values. First conversion retains
existing namespaced component IDs from the note. Nonconforming labels need an
explicitly recorded mapping, never an undisclosed rename. Semantic preservation
from prose is verified in the real rehearsal, not inferred from parsing.

Successors retain artefact identity, opaque extensions, historical sources and
stable finding/component/relationship identities. A decision can change in response
to human instruction; the new record records its reason, author and time, while
its predecessor retains the old decision. Removed selections remain documented
in research. The host checks successor lineage and rejects silent omission of
retained research findings, sources, decisions or component IDs. This bounded
increment need not support deliberate deletion or general graph migration.

The host records actual tool-read evidence and original-note byte provenance in
its manifest. Claims reference structured findings/decisions; the Surface pins the
exact research revision and digest. Preserve prior source revisions rather than
relabelling historical evidence as freshly inspected. Model-generated claims still
require human review; host hashes alone do not prove their interpretation.

Before saving, recheck all selected predecessor/input bytes, including the original
Markdown note. Publish complete files without overwriting an existing revision;
read them back independently, validate references and compare byte hashes. A failed
publication cannot replace earlier work or be reported as successful. Temporary
staging is recoverable or cleaned up; incomplete directories cannot reopen as
accepted pairs. As with the existing note writer, directory topology must stay
stable during synchronous operations; no adversarial concurrent-filesystem claim.

Keep existing Codex restrictions, sign-in, source selection and provider behavior.
Source text, saved content and model tool arguments are untrusted. No general shell,
filesystem, network or external tool access is added to the Researcher. Explicit
saving intent is required even with a configured vault. Reject symlinked output
ancestry, path traversal, unsupported versions, malformed input and manual HTML
edits. Preserve conflicted files and ask the person to resolve them; automatic
manual-HTML reconciliation is not part of this increment.

## Short human proof

Prerequisites: established installation, Codex sign-in, configured vault, a saved
research note and its permitted source. Use the existing setup guide if missing.

- [ ] Reopen the note with `n8r-surface reopen NOTE --source SOURCE`, replacing the
  placeholders with the saved note and original source paths. Accept transmission.
  Ask “Create a Surface from these notes; show me what is selected and still
  unknown.” Expect a preview with IDs, decisions, evidence and explicit gaps.
- [ ] Enter `/save surface`. Expect two saved/read-back paths. Open the research
  HTML and Surface JSON; verify that selections and unknowns match the preview.
- [ ] Enter `/exit`; start a fresh process with `n8r-surface reopen SURFACE_JSON
  --source SOURCE`. Accept transmission, change one named decision, ask for an
  updated Surface and enter `/save surface`. Expect a successor pair, retained
  component IDs and the changed decision. Earlier files remain available.
- [ ] Report Pass / Fail / Blocked with the changed decision and the two revision
  paths, omitting private source details from public reports. Failure includes a
  lost identity/evidence/decision, an overwritten predecessor or false save claim.

Paths and model wording vary; successful `/exit` returns 0. Maintainer readback
checks compare exact parent/logical/byte digests, source and settings bytes and
retained IDs. The agent repeats this through a real installed candidate for Lumen
and a smaller Harbor case. Record exact revisions/environment separately. Scripted
protocol tests are supporting evidence; the developing agent must not supply
prewritten findings as alleged Researcher output.

## Baseline and remaining limits

On 5 November 2026 the installed `n8r-surface --help` exited 0 and advertised only
Markdown saving and note reopening. Source at merged `c7781bc` likewise has no
structured staging/persistence tool. This is the explicitly authorized known
missing capability, not a failed live generation trial.

This increment does not establish universal conformance, consumer compatibility,
factual correctness, runtime reachability, Lab recreation, external-host lifecycle,
registry distribution or completion of all #17 acceptance. Keep the PR draft and
issue open until the separate human and remaining scope decisions.
