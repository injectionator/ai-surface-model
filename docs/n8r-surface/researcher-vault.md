# Local AI Surface vault

The vault is a local working directory for AI Surface research. Keep research
notes, intermediate artifacts and saved Surface descriptions here. Its location
is chosen on each machine and can sit outside the `n8r-surface` repository.

## Where things go

| Folder inside the vault | Contents |
| --- | --- |
| `research/<source-slug>/` | Numbered research notes and continued investigations. |
| `artifacts/<source-slug>/` | Intermediate outputs, drafts and supporting evidence. |
| `surfaces/<source-slug>/` | Saved Surface descriptions and their revisions. |
| `examples/` | Optional local copies of the prepared test source material. |
| `runs/<run-name>/` | Disposable test inputs, saved notes and review copies. |

Use a short source name such as `example-chat`. A research note might live at
`vault/research/example-chat/graph-001.md`. Keep earlier notes and revisions;
use the next unused number when saving another. The agent should resolve and
show the actual absolute destination before writing, then reopen the saved file.

Within the `n8r-surface` checkout, [agent guidance](../../AGENTS.md#local-research-workspace)
reads `.local/vault-path`: an ignored text file containing one absolute directory
path. This is a local instruction convention, not a CLI or plugin configuration
interface. The path is not published with the repository. When the vault is moved,
update that local pointer and preserve the files; do not migrate existing research
elsewhere without a separate request.

Explicit destinations take precedence. Continue existing notes in their current
folder unless the user asks to move them. Without a selected vault or another
destination, the installed skill still defaults to
`~/Documents/n8r-surface/research/<source-slug>/`. Installation does not create
or populate a vault.

The folder layout does not validate its contents. Current Researcher 0.1.7
produces Markdown working notes; `surfaces/` holds Surface descriptions when
available, without claiming the skill generates validated definitions. Local
files are not automatically published, backed up or encrypted. If you place a
vault in a Git repository, ignore its working areas before saving private work.

## Try the installed skill

The shared material below assumes **n8r-surface Researcher 0.1.7 is already
installed**. Anyone with this checkout has the same
[prepared source pack](../../examples/researcher-vault/README.md).

Choose a walkthrough:

- [Try the prepared example](researcher-prepared-check.md): use a small fictional chat
  system, save its description, change one setting and compare the findings.
  The source material is provided in this repository.
- [Try another chat-system repository](researcher-repository-check.md): choose a real
  project Researcher has not already investigated for you, then inspect its AI
  connections and continue the investigation in a fresh chat.

Use a local chat app that can read your files and save notes. Both walkthroughs
assume you can select `n8r-surface:research`; [installation help](researcher-skill.md)
is separate. No running chat service is required.

## Start with fresh context

For an independent attempt, start a new chat rather than continuing or forking
the development chat. Before the first test prompt, use `/memories` to turn off
both using and generating memories, where those controls are available. See
[the app's memory controls](https://learn.chatgpt.com/docs/customization/memories).

Read the walkthrough yourself and paste only its task prompts into the test
chat. Supply the named inputs, not this checklist or its expected answers. For a
continuation check, add only the previous note requested by that step. Ask the
agent to use the installed skill and those sources, without consulting other
chats, projects or the web, and inspect its source references and tool activity.

This limits the intended evidence; it does not enforce isolation. A fresh chat
still has applicable instructions and the model's general knowledge. Codex
[permission profiles](https://learn.chatgpt.com/docs/permissions#file-access-limited-to-workspace)
can restrict command reads to selected folders, but connectors, browser access
and other tools have separate controls. Read-only mode alone is not a guarantee
that neighboring repositories or expected answers cannot be read. These walkthroughs
are practical manual checks, not sandboxed evaluations.

## Keep or clean up a test

Keep the repository's prepared examples unchanged so another person can start
the same test.
Keep each run until you have reviewed its findings. To start again, use a new run
name. After review, you can delete that one folder under `runs/` with your file
browser. Leave the shared examples, ongoing research, saved Surfaces and source
repositories intact.

## Standalone command setup

The experimental bare `n8r-surface` command offers a local vault once and remembers
it as `vaultRoot` in version-1 user settings. It creates `research/`, `artifacts/`
and `surfaces/` only after confirmation, and reuses that vault from other source
folders. The legacy `artefactRoot` remains separate and unchanged. This setup-only
increment does not run the Researcher or save findings. It does not read the
repository's `.local/vault-path`. See [startup behavior](startup.md) and the
[installed verification tasks](vault-setup-verification.md).
