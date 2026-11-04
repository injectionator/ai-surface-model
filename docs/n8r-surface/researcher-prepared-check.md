# Try the prepared example

Test whether Researcher can describe an AI system, save its findings and notice a
small change while preserving earlier work. This uses fictional documents and a
pretend configuration; no application needs to be installed or started.

## Before you start

Open your local vault in your file browser. You need a local chat app
with **n8r-surface Researcher 0.1.6 already installed**, access to the prepared example in this repository,
and permission to save files in your vault. If access or the skill is missing, record
**Blocked** and what is missing. You do not need to diagnose the installation.
Follow the [fresh-context guidance](researcher-vault.md#start-with-fresh-context) before
the first prompt in each test chat.

## Tasks

- [ ] **1. Make your working copy.** In the `n8r-surface` repository, open
  `examples/researcher-vault/`. Copy the whole `chat-service` folder into `runs/`
  in your local vault (create `runs/` if needed) and rename the copy `check-001`. If that
  name already exists, choose the next unused number and use it throughout these
  steps. Open the copy: it should contain `scope.md`, `system.md` and `current.env`.

  **Look for:** `DOCUMENT_SEARCH_URL=` in your copy of `current.env`, with nothing
  after the equals sign. Leave the shared files in `examples/researcher-vault/` unchanged.

- [ ] **2. Start the investigation.** Open a fresh local chat in your
  vault folder and select **n8r-surface Researcher**
  (`n8r-surface:research`). Paste this, adjusting `check-001` if needed:

  > Use only scope.md, system.md and current.env in runs/check-001 as source
  > material. Describe the main AI-related components and connections. Explain
  > what the product supports, what the supplied settings say, and what is still
  > unknown about a running system. Cite the files you used. Save your findings
  > as a new numbered note under runs/check-001/notes and give me a link to
  > open it. Create the notes folder if needed.
  > Use the installed skill; do not consult other chats, memories, projects,
  > the web or the test walkthroughs.

  **Look for:** a readable map or connection table, source references, unknowns
  and an openable saved note. Open the note and confirm it matches the chat. It
  should connect the browser, chat application, model gateway and conversation
  store, and describe optional document search. The supplied settings give no
  document-search address; they do give a model-gateway address. Running services,
  the language model and authentication details remain unverified or unknown.

  Check **Recommended next steps**: each item names the next investigation, why
  it matters and a source location or missing evidence from which to resume.

  Make a copy of this first note named `first-note-backup.md` directly in your
  `check-001` folder. Keep the original in `notes/` for the next chat.

- [ ] **3. Change one setting.** Open your working copy of `current.env` in a text
  editor. Change `DOCUMENT_SEARCH_URL=` to
  `DOCUMENT_SEARCH_URL=https://search.example.test`. Save and reopen the file.
  Leave every other line and file unchanged. This is a placeholder address;
  do not visit it or run the settings file.

  **Look for:** the new address in your working copy. The shared example should
  still have the empty value.

- [ ] **4. Ask Researcher to compare.** Start another fresh local chat in your
  vault folder and select Researcher again. Give it the original saved note from
  `notes/` by attaching the file or pasting its path, then paste:

  > Read the saved recommendations and continue within these supplied sources.
  > Compare my saved findings with scope.md, system.md and current.env in
  > runs/check-001. Tell me what changed, what stayed the same and what is
  > still unknown, with references to the evidence. Save the comparison as a new
  > numbered note under runs/check-001/notes and give me a link. Keep the
  > original note unchanged.
  > Use the installed skill and these supplied sources only; do not consult
  > other chats, memories, projects, the web or the test walkthroughs.

  **Look for:** a second file with a different name. Open it: document search
  should now have a declared target of `https://search.example.test`. The model
  gateway address, other components and unresolved questions should carry forward.
  Whether any service is running or working remains unknown. A claim such as
  “document search now works” fails this check. Reopen the first note and compare
  it with `first-note-backup.md`; its contents should be unchanged. The successor
  should update **Recommended next steps**, explaining resolved items or blockers
  and where to resume. It must not silently copy recommendations made obsolete by
  the changed settings.

- [ ] **5. Check the setup explanation.** In the chat, ask:

  > In the current AI Surface Model, who owns an Experiment's desired setup,
  > and who prepares the resources it needs?

  **Look for:** the Experiment owns its desired setup and asks its Lab directly;
  the Lab configures resources and supplies local bindings. The current chain is
  **Lab → Experiment → Setup**.

## Report the result

Keep the run folder for review. Record this for yourself, or send it to the person
who assigned the test:

> Result: Pass / Fail / Blocked
>
> App used and Researcher version shown in the chat:
>
> Run folder, first note and comparison note:
>
> Task number and what happened, if anything differed:

**Pass:** every task produced the expected result. **Fail:** a task ran but gave a
wrong result, lost earlier work or failed to save a file. **Blocked:** missing
access or setup prevented a task. Different wording, supported extra findings
and different note numbers are fine. Copy the relevant response or error; you
need not diagnose it. These are chat interactions, so there are no command exit
codes to check.

This is a document-based rehearsal of the workflow. It does not establish code
discovery, a working service or Lab recreation. For real source exploration,
[try another repository](researcher-repository-check.md), or use the deeper
[LibreChat declaration trial](researcher-reconciliation-trial.md).
