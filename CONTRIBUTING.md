# Contributing

The model is an early draft. Concrete cases and counterexamples are particularly
useful: what does the Surface contain, what is known, and what question should
someone be able to answer from its saved description?

Open an issue for a use case, modeling question, interoperability finding or
proposal. Pull requests should explain the problem, the proposed semantics and
what information remains unknown.

## Issue, branch and pull request workflow

Use one primary issue, a dedicated branch such as `docs/123-model-links`, and one
matching draft PR for each delivery task. Work in the existing checkout and
preserve unrelated changes. Link the PR with `Closes #123`, record the relevant
checks, and keep it draft until review readiness is approved. Merge, release and
deployment are separate decisions.

The [Git workflow in AGENTS.md](AGENTS.md#git-workflow) gives the full branch,
workspace and publication rules, including the prohibition on Git worktrees.

## Cleanup after a merge

After the PR is merged, run this from the repository root while still on its
completed branch:

```sh
./scripts/flow done
```

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
