# Contributing

The model is an early draft. Concrete cases and counterexamples are particularly
useful: what does the Surface contain, what is known, and what question should
someone be able to answer from its saved description?

Open an issue for a use case, modeling question, interoperability finding or
proposal. Pull requests should explain the problem, the proposed semantics and
what information remains unknown.

## Issue, branch and pull request workflow

Follow this sequence for each contribution, including documentation changes:

1. **Start with an issue.** Find or open the issue that describes the problem,
   intended change and how it will be checked. Agree the scope before editing.
2. **Create a branch from updated `main`.** Use a dedicated branch such as
   `docs/123-model-links`, with the issue number in its name. Work in the existing
   checkout and preserve unrelated changes.
3. **Do the work and open a draft PR.** Commit and push the branch, open one
   matching draft PR, and link it with `Closes #123`. Explain the change and record
   the relevant checks. Keep the same branch and PR updated as the work develops.
4. **Review, then merge.** Keep the PR draft until review readiness is approved.
   Merge, release and deployment are separate decisions.
5. **Return to `main` after the merge.** While still on the completed branch, use
   `./scripts/flow done` as described below. Once cleanup succeeds, start the next
   issue on a new branch from the updated `main`.

The [Git workflow in AGENTS.md](AGENTS.md#git-workflow) gives the full branch,
workspace and publication rules, including the prohibition on Git worktrees.

## Cleanup after a merge

Merging a PR on GitHub updates the remote repository; it does not switch your
local checkout back to `main`. The `flow` script is a helper for completing this
step safely, so the next contribution starts from the updated base.

After the PR is merged, run this from the repository root while still on its
completed branch. Let the helper switch branches for you:

```sh
./scripts/flow done
```

On success, you are on updated `main` and the completed local branch is removed.
If the helper refuses, read the reason and preserve or resolve the outstanding
work before retrying. Do not bypass its checks with a reset or forced deletion.
Use `./scripts/flow help` for a reminder of the command's purpose.

The [flow helper](scripts/flow) requires Bash 3.2 or later, Git and an authenticated
[GitHub CLI](https://cli.github.com/) (`gh auth login`). It reads PR metadata from
GitHub and fetches `main` from `origin`, so network access is required. Credentials
stay in your existing Git/GitHub CLI configuration.

The command verifies that the PR belongs to the current branch in `origin`, is
merged into `main`, and has the same head commit as the local branch. It checks
that the merge commit is present on the fetched `origin/main`, fast-forwards
local `main`, then deletes only the completed local branch. This also works after
a squash or rebase merge, whose history may not contain the original branch tip.

The checkout must have no uncommitted or untracked work, and local `main` must
already exist and be able to fast-forward. Ignored files are preserved if they
would be overwritten. Missing, open, draft, closed-without-merge, fork and non-main
PRs are refused, as are differing local commits. Verification failures retain the
branch. If switching succeeds but updating `main` fails, you may be left on `main`
with the feature branch retained; the error reports the current checkout.

Invoking `done` authorizes that local branch deletion. Agents should run it only
when cleanup is authorized, after the merge is confirmed. Finish other Git
operations first and avoid concurrent changes to the checkout. This helper
provides only `done` and `help`; it does not merge PRs, delete remote branches,
clean other branches, create releases or stop services.

Run the offline helper checks with Python 3.9 or later and Git:

```sh
bash -n scripts/flow
python3 -m unittest discover -s tests -v
```

The tests use disposable local repositories and a GitHub CLI stub. They do not
use GitHub credentials, access the network or change this repository's branches.

## Contribution principles

See the [Researcher library checks](#researcher-contract-library) when changing
the experimental TypeScript contracts or fixtures.

- Keep partial descriptions useful. Do not require unrelated detail for a task.
- Preserve the distinction between declared configuration and observed behavior.
- Retain identities, sources, time and uncertainty where relevant.
- Prefer existing standard meanings when they fit; explain mapping losses.
- Label examples as synthetic or identify their permitted evidence sources.
- Include only material you have the right to publish; use placeholders for
  credentials and synthetic configuration in public examples.
- Distinguish proposals from released capabilities and verified interoperability.

## Licensing

Contributions use the licence appropriate to their material type:
Apache-2.0 for model assets and software, CC-BY-4.0 for written material.
See [LICENSING.md](LICENSING.md). Contributors retain copyright and must have
the right to contribute the material under those terms. Identify any third-party
material and its licence explicitly.

There is no released conformance suite yet. For the current draft, check that
JSON examples parse, their local references resolve, Markdown links work and
the documentation does not claim unimplemented capabilities.

## Researcher contract library

Prerequisites: Node.js 22, 24 or 26 and npm. Python 3.9+ and Git remain prerequisites
for the separate workflow-helper tests above. Contributor commands:

```sh
npm ci
npm test
npm run check:package
git diff --check
```

`npm ci` uses the registry and creates `node_modules/`. `npm test` compiles strict
TypeScript into ignored `dist/` and runs Node tests offline. `npm run build` can
compile independently. The installed-package check uses `npm pack`, installs in
a temporary directory with `--offline --ignore-scripts`, imports the built library
and reads bundled assets, then removes the temporary directory. No API credentials,
Lab, source checkout at runtime or registry publication is required. Populate the
dependency cache with `npm ci` before the offline package check.

To repeat the package smoke check using already installed Node executables:

```sh
npm run build
node scripts/check-package.mjs /path/to/node22 /path/to/node24 /path/to/node26
```

Those paths are local command placeholders, not portable artefact fields. Passing
no paths uses the current Node executable. Before distribution changes, run the
full contract tests on each supported Node major too. The current package exposes
an ESM library and assets, with no CLI entry point; executable npm/npx verification
belongs to #16.

The library accepts strings/data and returns strings/data, with no network or
filesystem effects. It checks a bounded experimental profile, not all AI Surface
Model semantics or consumer compatibility. Read the
[contract and API boundaries](docs/n8r-surface/contracts.md),
[host requirements](docs/n8r-surface/host-contract.md) and
[synthetic cases](examples/researcher/README.md) before changing them.

Preserve all fixture revisions and their references when extending a case. The
pending manual-edit HTML is intentionally invalid; its rejection is an acceptance
case. Ordinary `git diff` excludes untracked files, so inspect and check new files
before committing. Check changed Markdown links/anchors and parse all JSON
examples; syntax success is not semantic validity.
