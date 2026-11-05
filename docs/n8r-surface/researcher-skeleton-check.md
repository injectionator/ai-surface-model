# Verify a Skeleton Surface and its successor

This tests a compact security-focused Markdown brief through the installed
Researcher. An interception point is a place to inspect or intervene in a call;
a binding maps a described role to a selected resource. No live service is needed.

## Prerequisites and preparation

Use installed Researcher **0.1.8**, a local host with file access and a writable
vault. Reuse the [installation guide](researcher-skill.md#research-01-investigate-and-continue).
Choose a fresh `runs/skeleton-check/` folder within your vault; use another name
if it exists. Copy the two files from the
[synthetic source pack](../../examples/researcher-vault/interception-service/system.md)
into its `source/` folder. Create an empty `output/` folder alongside `source/`.
Keep repository originals unchanged. No accounts, credentials, services or Lab
installation are required. The pack is documentation, not executable software.

State X: installed skill, the two revision-1 source files, an empty output folder.
Input Y: the prompts below, separated by a deliberate source declaration change.
Outcome Z: two readable briefs with stable identities, evidence and gaps; the
first is preserved and the second distinguishes declarations from runtime facts.
Only trial outputs and the disposable settings copy should change.

## Tester steps

- [ ] **SKELETON-01 — create the brief.** Open a fresh chat with the trial folder
  available and select n8r-surface Researcher. Ask:

  > Create a security-focused skeleton Surface from the supplied source folder.
  > I want to know where a security integration could intercept LLM and actual
  > tool calls, with its powers and coverage gaps. Keep the brief compact and link
  > supporting evidence. Save it in the output folder. Stop before installation
  > or configuration.

  Open the returned file. Expect **Skeleton Surface v0.1**, a particular draft
  revision, stable graph identities, source references and explicit unknown
  bindings. It should distinguish backend inference from actual MCP execution,
  the chat hook's allow/deny powers, the worker's bypass of that hook, and the
  browser-direct inference route. The audit companion must not gain blocking
  power merely because it is a companion process. No vendor compatibility or
  working interception should be claimed. A short table is sufficient; no fixed
  word/node count or detailed research appendix is required.
- [ ] **SKELETON-02 — change declarations outside the Lab.** Keep a preservation
  copy of the first output. In the disposable `source/settings.txt`, replace the
  first comment and the two indicated empty values with:

  ```text
  # Synthetic setup declaration, revision 2. No process has loaded these values.
  MONGODB_URL=mongodb://database.example.test:27017/cedar
  MODEL_BASE_URL=https://model-proxy.example.test/v1
  ```

  Leave the other fields unchanged. These reserved addresses are fictional; do
  not connect to them. Open the first output again: it should remain unchanged.
  Start a fresh chat with the trial folder and skill, supply that output and ask:

  > Reconcile this saved skeleton with the current source folder and save a
  > successor in the same output folder. Explain the changes and retain the
  > security interception view. Stop before installation or configuration.

  Open both outputs. Expect the same profile version, stable identities for the
  database/inference roles and retained interception gaps. The successor should
  identify the new database and inference target declarations with their source,
  preserving the first output. It must not claim a process loaded them, a proxy
  intercepted traffic, a specific proxy product was identified, or the database
  works. The source pack cannot establish when any real change took effect.
- [ ] Report **Pass / Fail / Blocked**, skill/app versions, links to both outputs
  and the step/evidence for any failure. Wording, IDs and unused file numbers may
  vary; identities must remain stable between outputs. Missing files/evidence,
  overwritten predecessors, lost bypasses or unsupported runtime claims fail.
  These are chat interactions with no process exit code. Keep the trial folder
  for review; optional cleanup removes only that folder after review.

## Maintainer evidence checks

Record the exact candidate commit, installed skill/package digests and host
version separately from tester steps. Independently read the saved bytes, verify
source references/hashes, compare stable IDs and confirm unchanged predecessor
bytes. Check that neither source file changed during each research interaction.
The deliberate settings edit happens between interactions, not inside research.

Record actual results in [versioned verification](researcher-skill-verification.md#skeleton-surface-018).
An agent rehearsal is not human acceptance, Work UI lifecycle validation, runtime
enforcement, a Lab recording implementation or validated structured output.
