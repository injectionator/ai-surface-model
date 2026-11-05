# Save research and continue later

This candidate lets you research a local source, save Markdown working notes and
continue in a fresh conversation. The package remains private and unpublished.
Use Node 22, 24 or 26, Codex CLI **0.166.0**, and an existing ChatGPT sign-in with
access to `gpt-6-astra`. No API-key billing or model fallback is used.

## 1. Install

- Open a terminal in this checkout on `feat/17-save-reopen` and paste:

  ```sh
  npm ci && npm pack && npm install --global ./n8r-surface-0.0.0-experimental.1.tgz
  ```

  Expect successful installation and the terminal prompt. Stay in the checkout.
  If installation fails, stop and report the error.

## 2. Research and save

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

## 3. Reopen and continue

- Paste, replacing `NOTE` with the saved path in quotes:

  ```sh
  n8r-surface reopen "NOTE" --source examples/researcher/sources/lumen-guide.md --model gpt-6-astra
  ```

  Alternatively omit `"NOTE"` to see the latest-edited note for this source,
  with its edit time; type **y** to select it. Either route asks again before
  sending the note and source to OpenAI. Type **y** to start fresh.
- Expect saved evidence comparisons and a continuation retaining the same IDs and
  your OIDC decision. At `You>`, ask:

  ```text
  Continue the authentication investigation. What remains unknown, and what evidence would resolve it? Retain my earlier decision.
  ```

  Enter `/save`, then `/exit`. Expect exit 0, a new numbered file referencing the
  first, and the original file unchanged. Open both and compare the IDs and decision.

Report **Pass**, **Fail** or **Blocked**, with the unexpected message or note
excerpt. Wording and filenames may vary; lost decisions/IDs, invented source
facts, overwritten notes, or a claimed save without a file are failures.
If a model is unavailable, report that error. Ctrl-C cancels with exit 130.
Keep the notes or delete only these test notes when finished; do not delete your
vault or source. [Maintainer evidence and limits](save-reopen-verification.md)
are separate from these tester steps.
