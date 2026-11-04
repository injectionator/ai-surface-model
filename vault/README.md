# Researcher test vault

Start here to try the **already installed n8r-surface Researcher skill**. This
vault lives in the `n8r-surface` repository, so anyone with this checkout has the
same prepared material. The current candidate is **0.1.5**.

Choose a walkthrough:

- [Try the prepared example](try-prepared-example.md): use a small fictional chat
  system, save its description, change one setting and compare the findings.
  Everything you need is in this repository.
- [Try another chat-system repository](try-another-repository.md): choose a real
  project Researcher has not already investigated for you, then inspect its AI
  connections and continue the investigation in a fresh chat.

Use a local chat app that can read your files and save notes. Both walkthroughs
assume you can select `n8r-surface:research`; [installation help](../docs/n8r-surface/researcher-skill.md)
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
that neighboring repositories or expected answers cannot be read. The walkthroughs
below are practical manual checks, not sandboxed evaluations.

## Where things go

- `examples/` contains the shared starting files. Keep these unchanged so another
  person can start the same test.
- `runs/` holds your working copies and saved findings. Its contents are ignored
  by Git and stay on your machine; share selected results deliberately when asking
  someone to review them. Ignoring a file does not encrypt or back it up.

For now, this is a folder convention for these tests. Installing the skill does
not create or populate it. The walkthroughs explicitly choose a save location in
the vault; Researcher's usual default for other work remains unchanged.

Keep a run until you have reviewed its findings. To start again, use a new run
name. After review, you can delete that one run folder with your file browser;
leave the shared examples and any source repository intact.
