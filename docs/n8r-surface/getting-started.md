# Create a Surface from saved research

This candidate adds a linked research HTML record and partial Surface JSON to
the existing Markdown research workflow. Reopen either saved file to revise the pair. The package remains private and unpublished.
Use Node 22, 24 or 26, Codex CLI **0.166.0**, and an existing ChatGPT sign-in with
access to `gpt-6-astra`. No API-key billing or model fallback is used.

For isolated checks of both official npm package candidates, use the
[distribution walkthrough](npm-distribution.md). The global install below uses
the checkout tarball and replaces the command in your npm global prefix.

## 1. Install

- Open a terminal in this checkout at the reviewed candidate revision and paste:

  ```sh
  npm ci && npm pack && npm install --global ./n8r-surface-0.0.0-experimental.1.tgz
  ```

  Expect successful installation and the terminal prompt. Stay in the checkout.
  If installation fails, stop and report the error.

## 2. Create and save a Surface

Use your existing saved note and its original source. Replace `NOTE` and `SOURCE`
with their paths (keep quotes). If you have no note, use the optional steps below.

- Paste:

  ```sh
  n8r-surface reopen "NOTE" --source "SOURCE" --model gpt-6-astra
  ```

  Type **y** at the transmission prompt. Expect evidence comparisons, a fresh
  conversation and your retained choices. At `You>`, paste:

  ```text
  Create a Surface from these notes; show me what is selected and still unknown. Preserve the component IDs, source evidence and my decisions. Prepare the linked research and Surface preview.
  ```

  Expect a **Validated partial Surface preview** listing components, declared
  connections, human decisions, requirements, coverage, gaps and evidence.
- Enter `/save surface`. Expect **Saved and read back** for `research.html` and
  `surface.json`. Open both: they should match the preview. Copy the JSON path,
  then enter `/exit`; expect exit 0 and the terminal prompt.

## 3. Reopen and revise

- Paste, replacing `SURFACE_JSON` with the saved JSON path and `SOURCE` with the
  same source path:

  ```sh
  n8r-surface reopen "SURFACE_JSON" --source "SOURCE" --model gpt-6-astra
  ```

  Type **y**. Expect the same component identities and decisions. Ask to change
  one decision, with your reason, and prepare an updated Surface. For the optional
  Lumen case below, paste:

  ```text
  Select external OIDC in the desired composition because this investigation now requires centralized sign-in. This is my selection, not proof of a configured provider. Keep the provider and model unknown, preserve existing IDs and evidence, and prepare the updated Surface preview.
  ```

- Inspect the preview, enter `/save surface`, then `/exit`. Expect a new numbered
  pair, exit 0 and the original pair unchanged. Open both revisions and compare
  component IDs, evidence, the decision and parent references. The new
  `research.html` path can also be used with the same reopen command.

Report **Pass**, **Fail** or **Blocked**, with the changed decision and unexpected
message or excerpt. Wording and filenames vary. Lost evidence/IDs/decisions,
overwrites or a claimed save without files are failures. Keep test pairs or delete
only their numbered directories afterward; keep your vault, source and earlier work.

`/save` still writes Markdown. `/save surface` needs a current validated preview;
a later question invalidates the old preview, so request an updated one after a
correction. Edited HTML or mismatched pair bytes are rejected and preserved; make
changes conversationally in a new revision. Ctrl-C cancels with exit 130. The
[maintainer evidence](surface-revisions-verification.md) distinguishes agent
rehearsal from human acceptance and lists remaining limits.

## Optional: create a research note first

- Paste:

  ```sh
  n8r-surface
  n8r-surface discover examples/researcher/sources/lumen-guide.md --model gpt-6-astra
  ```

  The first command reuses your vault (or asks you to choose/create it once).
  The second names the fictional source and requests permission to send inspected
  text to OpenAI. Type **y**; expect the connected model and `You>` prompt.
- At `You>`, paste this as one line:

  ```text
  Describe the AI components and connections with stable component IDs and source citations. For this investigation I choose not to use external OIDC: retain that as my decision, not a change to the source. Keep unknowns and useful next steps clear.
  ```

  Expect a source read and cited findings. The [source](../../examples/researcher/sources/lumen-guide.md)
  describes configured inference; OIDC is an option, not proof of selected or
  exercised authentication. Your decision must stay separate from source claims.
- Enter `/save`. Expect a numbered destination followed by **Saved and read back**,
  its full path and SHA-256 digest. While waiting, a spinner shows
  **Preparing note** and elapsed seconds; answers use **Waiting for Codex**.
  It should stop when the operation finishes or you cancel. Open that file: it should retain component IDs,
  your OIDC choice, evidence and next steps. Copy its path, then enter `/exit`.
  Expect exit 0 and the terminal prompt.
