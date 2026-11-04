# Try another chat-system repository

Choose a different chat-system project and see whether Researcher can build a
useful description from its actual sources. This is an exploratory test: the
answers depend on the project you choose, so inspect the evidence it cites.

## Before you start

Download or clone a repository you are permitted to investigate into your usual
projects folder. Keep it separate from this vault. Use a local chat app with
**n8r-surface Researcher 0.1.5 already installed** and access to both that source
folder and this `n8r-surface` checkout. You do not need to install or run the
chosen application. Use public source files without credentials or private data.

Pick a short run name, such as `another-chat-001`. Choose an unused name for each
new investigation; existing runs stay available for comparison.
Follow the [fresh-context guidance](README.md#start-with-fresh-context) before
the first prompt in each test chat.

## Tasks

- [ ] **1. Introduce the project.** Start a fresh local chat in the `n8r-surface`
  repository and select **n8r-surface Researcher** (`n8r-surface:research`). Give
  it the location of the other repository by adding that folder to the chat's
  accessible sources or pasting its full path. Name it as the source. In the prompt
  below, replace `another-chat-001` with your chosen run name, then paste:

  > Investigate the other chat-system repository I supplied. Start by confirming
  > which project and source revision you can actually read. Describe how user
  > input reaches AI processing, which model or inference services are supported,
  > and how tools, stored data and authentication connect where the evidence
  > supports them. Cite the source files behind the connections and identify
  > important unknowns. Keep supported options distinct from a selected or running
  > setup. Read source files only; do not install dependencies, start services or
  > read credentials. Save a new numbered note under
  > vault/runs/another-chat-001/notes in this n8r-surface checkout, creating the
  > folder if needed, and give me a link to open it.
  > Use the installed skill and the supplied sources only. Do not consult other
  > chats, memories, projects, the web or the test walkthroughs.

  **Look for:** the correct project, a readable connection map and actual source
  references. If the chat cannot read the other folder, record **Blocked** rather
  than accepting a description based only on the project's name. A downloaded
  archive may lack a Git revision; that limitation should be stated, with the
  inspected files identified instead.

- [ ] **2. Inspect the saved findings.** Open the note from its link. Pick two or
  three connections you care about and open the files it cites. Read the cited
  sections to see whether they support the description. A Mermaid diagram may
  appear as text in some editors; its relationships should still be readable.

  **Look for:** findings about this project, not a generic chat architecture.
  Optional integrations should stay optional unless configuration selects them.
  Missing information should remain unknown. Source code alone should not become
  a claim that an endpoint is reachable or a service works. Record any claim you
  cannot verify as **Needs review**, with the claim and its cited file.

- [ ] **3. Continue in a fresh chat.** Start a new local chat in this checkout,
  select Researcher, and supply the same source folder and saved note. Paste:

  > Continue from this saved note. Trace one supported conversation path from
  > incoming user text to the model request and back to the response. Identify
  > which files support each part and where the evidence runs out. Retain the
  > earlier component identities and open questions. Save a new numbered note
  > alongside the first and leave the first unchanged.
  > Use the installed skill, this note and the supplied repository only. Do not
  > consult other chats, memories, projects, the web or the test walkthroughs.

  **Look for:** a deeper explanation grounded in actual files, a second saved
  note, and clear remaining gaps. It should build on the first investigation and
  distinguish newly learned details from changes to the source. Reopen both files.

## Record what happened

> Result: Pass / Fail / Blocked / Needs review
>
> Project and source revision, or archive/version supplied:
>
> App and Researcher version:
>
> Saved notes:
>
> Connections checked against source:
>
> Surprising findings, unsupported claims or unanswered questions:

**Pass** means the notes saved and reopened, the sampled claims matched the source,
and continuation retained earlier work. **Fail** means you found a wrong claim,
lost work or a failed save. **Blocked** means access or setup prevented the test.
**Needs review** means you could run it but cannot yet assess a substantive claim.
Wording and graph size may vary; a partial map with explicit gaps is useful.

Keep the run for review. This checks a sampled source investigation and
continuation; it does not establish complete coverage, runtime behavior or
compatibility with a Lab. See the [vault guide](README.md) for storage and cleanup.
