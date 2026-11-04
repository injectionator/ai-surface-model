# n8r-surface Researcher: share and test

**First increment:** an experimental instruction-only Researcher, packaged for
ChatGPT desktop / Work and Codex. It researches supplied sources with the existing
harness and saves working notes. It does not add a CLI runner, Lab connection or
validated experimental HTML/Surface output. Related to [#17](https://github.com/injectionator/n8r-surface/issues/17).

The user selected this order on 4 November 2026: prove the skill in the existing
harness, adapt that same core to n8r-labs in its repository, then return to the
standalone `n8r-surface` command. Unfinished #16 source-overview work is paused.
There will be no separate status subcommand.

## Package and standards

The canonical source is [the plugin folder](../../plugins/n8r-surface/).
It contains one `skills/research/SKILL.md`, bundled references, optional
OpenAI skill metadata, licence files and an icon. It has no MCP server, hooks,
installer scripts, embedded credentials or separate model connection.

The [Agent Skills specification](https://agentskills.io/specification) defines
`SKILL.md`, required `name`/`description` frontmatter and relative resources.
The [OpenAI skill guide](https://learn.chatgpt.com/docs/build-skills) distinguishes
local skill folders from distributable plugins. Follow
[plugin packaging](https://developers.openai.com/plugins/build/plugins) for
repository marketplaces and host-specific metadata. Reviewed 4 November 2026.
These are packaging contracts; host behavior still needs its own rehearsal.

- [plugin.json](../../plugins/n8r-surface/plugin.json) uses Agent Plugins 1.0.0.
- [.codex-plugin/plugin.json](../../plugins/n8r-surface/.codex-plugin/plugin.json)
  is the compatibility manifest needed by the tested Codex CLI 0.139.0. Keep
  identity, version and presentation metadata aligned with the portable manifest.
  Both use the same skill files; no second instruction copy is maintained.
- [The repository marketplace](../../.agents/plugins/marketplace.json) exposes
  `n8r-surface@n8r-surface` as available, without forcing installation.
- Plugin and skill version `0.1.1` identify this experimental candidate. Increment
  them when changing distributed instructions; record the Git revision and
  installed file digest with test results. This is separate from the npm version.

Keep the skill self-contained: installation copies it away from this checkout.
Bundled references must work there. Instructions use CC-BY-4.0; metadata, icons
and tooling use Apache-2.0. The package includes the repository's licence texts
and [licensing explanation](../../LICENSING.md).

## Install from the repository

Prerequisites: a checkout of the candidate revision, Codex CLI with
`plugin marketplace`/`plugin add` support, and ChatGPT desktop / Work enabled
for the account. No API key, running Lab or `n8r-surface` npm installation is
required. CLI 0.139.0 was used for the local package test; other versions need
verification. These commands modify the user's plugin configuration/cache, not
research source files. Record `codex --version` and `git rev-parse HEAD`.

From this repository root:

```sh
codex plugin marketplace add . --json
codex plugin add n8r-surface@n8r-surface --json
codex plugin list --marketplace n8r-surface --json
```

Expected: each command exits 0. The installed list contains exactly one
`n8r-surface@n8r-surface`, version `0.1.1`, installed and enabled. The installation
path varies by computer. `alreadyAdded: true` is fine on a repeated marketplace
registration. Do not register a second copy of the skill in `.agents/skills`.

If the earlier 0.1.0 candidate is installed, remove its old package ID once:

```sh
codex plugin remove n8r-researcher@n8r-surface --json
```

The renamed package replaces that candidate; saved research stays in place.

In ChatGPT desktop, open Plugins and select the **n8r-surface** source. Verify
**n8r-surface Researcher** is installed. Refresh/restart the app if the new marketplace
or version is absent, as the packaging guide requires. Then start a fresh Work
chat. Loading instructions in this development chat is not this acceptance test.

After a reviewed branch is pushed, someone else can register it without a local
checkout using `codex plugin marketplace add injectionator/n8r-surface --ref REF`,
replacing `REF` with the reviewed commit or branch. Do not imply this candidate is
on `main` until it merges. A public Plugins Directory listing requires a separate
[submission and publication](https://developers.openai.com/plugins/deploy/submission)
decision; it is not necessary for this repository test.

## LOAD-01: install, invoke, remove, reinstall

Use the prepared installation above. Record the desktop app version and selected
Work environment. The host must have access to the two synthetic documents
[lumen-guide.md](../../examples/researcher/sources/lumen-guide.md) and
[lumen-settings.md](../../examples/researcher/sources/lumen-settings.md), through
attachments or explicitly selected local source access. A local path by itself
is not access in a cloud chat.

1. In a **fresh Work chat**, type `@` and select the plugin's
   `n8r-surface:research` skill (display name **n8r-surface Researcher**). Ask:

   > Research Lumen Desk from these two documents for an AI Surface Model
   > description. Identify the components and configuration choices, show evidence
   > and gaps, and ask the next question that would help me choose a setup.
   > Save working research notes that I can reopen.

   Expected: the skill identifies version `0.1.1`, reads the two actual documents,
   cites evidence and saves a readable note outside the plugin cache. Independently
   open that note. Both conflicting batch maxima (10 and 25) and the unknown model
   version must survive; optional features must not become user selections. The
   note is not a validated `n8r.research/0.1` artefact. A version announcement alone
   does not prove the packaged instructions or sources were used; retain the
   visible invocation/tool evidence and verify the resulting content.
2. Record the note's path/download and content digest when available. In the
   plugin browser select **Uninstall plugin**, or run:

   ```sh
   codex plugin remove n8r-surface@n8r-surface --json
   codex plugin list --marketplace n8r-surface --json
   ```

   Expected: exit 0, no installed entry for this plugin. The marketplace may still
   offer it for installation. Do not remove other skills or the saved research.
3. Start another **fresh Work chat**. Check that this skill is absent from the
   selector and installed-plugin list. Do not paste its instructions into that
   chat. Confirm the saved note still opens unchanged. Do not use an old chat's
   memory of the skill as an unload test: uninstall does not erase its history.
4. Reinstall using the same `codex plugin add` command. In a new Work chat, verify
   exactly one skill entry appears and invoke it again against the same sources.
   Supply the earlier note when testing continuation. Retain a new output file;
   do not overwrite the first note. Verify version, source identity and retained
   evidence. A prompt that never loaded the installed skill is not a pass.

Any missing selector entry after install, duplicate installation, wrong version,
fabricated source access, missing save/readback or changed user note is a failure
or blocker to investigate. Do not count a CLI list result as a Work-mode invocation
or unload result. Record the actual stage reached in [verification](researcher-skill-verification.md).

For cleanup after testing, remove this plugin using the command above. Optionally
run `codex plugin marketplace remove n8r-surface` to remove this marketplace source.
Keep user research files. Reinstallation is reversible; cleanup is separate from
publishing or deleting the source repository.

## RESEARCH-01: investigate and continue

After LOAD-01, answer the skill's question or correct a finding in the actual
chat. Save a successor and reopen it in a fresh chat with the same source access.
Check that the human choice is retained separately from source evidence and that
unresolved conflicts remain visible. Repeat on the Harbor fixtures and then a
named LibreChat revision before claiming those workflows work.

The first skill intentionally saves ordinary working notes. Structured HTML,
JSON/YAML definitions, automatic guarded revisions and Lab import remain future
increments against the [existing contracts](contracts.md). This package does not
relax their acceptance criteria or claim complete E2E-01/E2E-02 verification.

## Prepare a shareable ZIP

From a committed, reviewed candidate in the repository root:

```sh
n8r_skill_zip=$(mktemp -d)
git archive --format=zip --output="$n8r_skill_zip/n8r-surface.zip" HEAD:plugins/n8r-surface
python3 -m zipfile -l "$n8r_skill_zip/n8r-surface.zip"
```

Expected: exit 0; the archive has both manifests, one skill with its two references
and OpenAI metadata, the icon and licence files. It contains no Git history,
source-repository research data, credentials or node_modules. The output directory
varies. Archive only the committed plugin subtree so paused/untracked work cannot
enter the package. Uploading or publishing the ZIP remains a separate action.
