# Contributing

The model is an early draft. Concrete cases and counterexamples are particularly
useful: what does the Surface contain, what is known, and what question should
someone be able to answer from its saved description?

Open an issue for a use case, modeling question, interoperability finding or
proposal. Pull requests should explain the problem, the proposed semantics and
what information remains unknown.

## Issue, branch and pull request workflow

Follow this sequence for each contribution, including documentation changes:

1. **Start with an issue.** Find or open the issue that describes the user task,
   initial state, actual interaction, intended state change and observable
   verification evidence. Use the [command outcome spec](docs/n8r-surface/command-outcomes.md)
   for command/Researcher work. Agree the scope before editing; attempt the current
   product path or record why it is unavailable before implementing the gap.
2. **Create a branch from updated `main`.** Use a dedicated branch such as
   `docs/123-model-links`, with the issue number in its name. Work in the existing
   checkout and preserve unrelated changes.
3. **Do the work and open a draft PR.** Commit and push the branch, open one
   matching draft PR, and link it with `Closes #123`. Explain the change and record
   the relevant checks. Repeat the original user interaction and independently
   read back the changed state; report blocked or unproved outcomes explicitly.
   Internal tests do not establish end-to-end product acceptance. Keep the same
   branch and PR updated as the work develops.
4. **Review, then merge.** Keep the PR draft until review readiness is approved.
   Merge, release and deployment are separate decisions.
5. **Return to `main` after the merge.** While still on the completed branch, use
   `./scripts/flow done` as described below. Once cleanup succeeds, start the next
   issue on a new branch from the updated `main`.

The [Git workflow in AGENTS.md](AGENTS.md#git-workflow) gives the full branch,
workspace and publication rules, including the prohibition on Git worktrees.

Write simple acceptance checks as plain-language examples: given these files,
when the user runs this command, then they see this output, verified by these
process/output/file checks. Representative terminal output is useful; a technical
DSL or a large per-check form is unnecessary. See the
[bare startup example](docs/n8r-surface/command-outcomes.md#startup-01-run-the-command-and-see-what-is-here).

Every PR includes human verification steps with an exact starting state, commands
or interactions, expected output/exit codes, readback and cleanup. Explain any
variable output and failure conditions; rehearse the steps before requesting
review. Include a runnable example in the PR, even when it also links to a longer
guide. See the [bare-startup human check](docs/n8r-surface/startup-human-check.md).
Agent execution of the procedure does not replace human acceptance.

Grow the spec and working verification one useful behavior at a time. Existing
behavior can gain a documented intent and repeatable verification without a code
change. Keep [progress and evidence](docs/n8r-surface/command-outcomes.md#grow-the-specification-with-working-verification)
current so readers can distinguish plans, implementation and verified outcomes.

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

Prerequisites: Node.js 22, 24 or 26 and npm. The installed-command terminal
rehearsal also requires Python 3.9+ and a POSIX terminal (macOS/Linux). Git and
Python remain prerequisites for the separate workflow-helper tests above.
Contributor commands:

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
and reads bundled assets. It also runs the installed `n8r-surface` executable with
closed input and in a real terminal under temporary homes, compares output to
prepared settings/files, and checks that startup leaves them unchanged. It then
removes the temporary directory. No API credentials,
Lab, source checkout at runtime or registry publication is required. Populate the
dependency cache with `npm ci` before the offline package check.

To repeat the package smoke check using already installed Node executables:

```sh
npm run build
node scripts/check-package.mjs /path/to/node22/bin/node /path/to/node24/bin/node /path/to/node26/bin/node
```

Use the executable named `node` in each runtime installation: the installed bin
uses `env node` with that directory first on PATH. These paths are local command
placeholders, not portable artefact fields. Passing
no paths uses the current Node executable. Before distribution changes, run the
full test suite on each supported Node major too. The current package exposes
an ESM library, assets and a bare-startup executable. No registry or npx-download
claim follows from these local tarball checks. See the [startup settings, exit
codes and limits](docs/n8r-surface/startup.md).

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
