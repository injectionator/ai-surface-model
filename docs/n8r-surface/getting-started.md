# Install and choose your vault

Start here. You do not need to run the maintainer verification procedure.
This unreleased candidate installs from the repository checkout; it is not yet
published on npm. It supports vault setup only. AI research comes later.

## 1. Install

Use Node 22, 24 or 26 with npm. Open a terminal in the `n8r-surface` checkout
prepared on branch `feat/16-local-vault-setup`, then paste:

```sh
npm ci && npm pack && npm install --global ./n8r-surface-0.0.0-experimental.1.tgz
```

This downloads dependencies, builds the package and installs the `n8r-surface`
command for your current Node installation. Wait until it finishes and returns
to the terminal prompt. If it fails, stop and share the error.

## 2. Choose your vault

In the same terminal, run:

```sh
n8r-surface
```

At `Vault directory [~/n8r/]:`, press **Enter** to use `~/n8r/`, or type another
folder path. Check the displayed location. At
`Create vault folders and save this location? [y/N]`, type **y** and press Enter.

Expect `Vault ready:` followed by the chosen path. Setup creates the folders
`research`, `artifacts` and `surfaces` there, and remembers the location in
`~/.n8r/n8r-surface.json`. If a vault was already configured, it shows that vault
without asking again.

## 3. Check it worked

Open the reported vault in your file browser and check that the three folders
exist. Run `n8r-surface` again: expect the same vault without another question.

That's all for this increment. Tell the maintainer whether installation worked,
whether you saw the three folders, and whether the second run remembered the
vault. If anything differs, share the message you saw.

The [maintainer verification record](vault-setup-verification.md) contains isolated
test procedures and technical evidence for reviewers; it is optional reading.
