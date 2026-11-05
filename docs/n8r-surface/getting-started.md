# Research a source with Codex

This candidate lets you ask about a local source and follow up in the same
conversation. Codex reads the source through bounded tools and cites its evidence.
Saving and reopening research come later. The package is private and unpublished.

Use Node 22, 24 or 26, **Codex CLI 0.166.0**, and your existing ChatGPT sign-in.
The selected model must work with that account. This check uses `gpt-6-astra`;
it does not use API-key billing.

## 1. Install

Open a terminal in the checkout on `feat/17-codex-research` and paste:

```sh
npm ci && npm pack && npm install --global ./n8r-surface-0.0.0-experimental.1.tgz
```

Expect installation to finish and return to the terminal prompt. If it fails,
stop and share the error. Keep this terminal in the checkout for the next step.

## 2. Run

```sh
n8r-surface
n8r-surface discover examples/researcher/sources/lumen-guide.md --model gpt-6-astra
```

The first command shows your vault. On first use, accept or choose a location,
then type **y** to create it. The discovery command shows the selected fictional
source and explains that inspected text goes to OpenAI through Codex. Type **y**
to start. Expect `Connected: ChatGPT sign-in; model gpt-6-astra`, a Researcher
version/digest, and `You>`.

## 3. Check

At `You>`, paste this as one line:

```text
Describe the AI-relevant components and connections in the supplied source, citing file lines and distinguishing selected connections from options. Keep it concise.
```

Expect a source-read message and findings citing `lumen-guide.md`. Open
[the guide](../../examples/researcher/sources/lumen-guide.md): inference is
configured in the fictional description; OIDC is an option, and callbacks are
disabled until selected. The answer should preserve those distinctions.

At the next `You>`, paste:

```text
For this investigation I choose not to use external OIDC. Retain that as my decision, not a change to the guide. Which authentication facts remain unknown?
```

Expect your choice to be retained separately from the source. Not selecting OIDC
does not establish anonymous access. Type `/exit` to finish; expect the terminal
prompt and exit 0. The source stays unchanged and no research file is saved.
Ctrl-C cancels a running answer and exits 130.

Report **Pass**, **Fail** or **Blocked**, with the message or citation that differed.
Wording can vary; invented source facts, a lost correction, changed source bytes,
or a claimed save are failures. If Codex reports an unavailable model, stop and
report it; the command does not silently choose another.

The [maintainer evidence](codex-research-verification.md) records architecture,
automated checks, real execution and limitations. It is optional reading.
