# Contributing

The model is an early draft. Concrete cases and counterexamples are particularly
useful: what does the Surface contain, what is known, and what question should
someone be able to answer from its saved description?

Open an issue for a use case, modeling question, interoperability finding or
proposal. Pull requests should explain the problem, the proposed semantics and
what information remains unknown.

## Propose a change or extension

This is the level 400 reading path from the [README](README.md). Familiarity with
the [draft concepts](spec/README.md) and [synthetic examples](examples/README.md)
will help you explain where a proposal fits. There is no stable extension API or
namespace mechanism yet; extensions begin as design proposals.

Choose the closest issue template: a concept proposal, interoperability question,
example submission or defect report. Before opening another issue, search for an
existing discussion of the same problem.

1. **Describe a concrete question.** Who needs to answer it, what information do
   they have, and what is difficult to express with the current concepts?
2. **Show the smallest useful example.** Use synthetic data, stable component
   identities and explicit unknowns. State the scope and what is omitted.
3. **Explain the proposed meaning.** Identify affected concepts, relationships
   and evidence. Explain how partial descriptions and historical Run references
   remain useful, and whether existing examples would need to change.
4. **For interoperability, bound the claim.** Name source and target versions,
   the supported subset, transformations and losses. Separate a proposed mapping
   from results you have actually observed with a named consumer.
5. **Set acceptance checks.** Describe an example, counterexample or question
   that would demonstrate the improvement. Agree the scope before implementing.

See [interoperability research](docs/interoperability.md) for the evidence expected
of compatibility claims. Include only material you have permission to publish;
do not submit credentials, private deployment details or personal data.

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

- Keep partial descriptions useful. Do not require unrelated detail for a task.
- Preserve the distinction between declared configuration and observed behavior.
- Retain identities, sources, time and uncertainty where relevant.
- Prefer existing standard meanings when they fit; explain mapping losses.
- Label examples as synthetic or identify their permitted evidence sources.
- Include only material you have the right to publish; use placeholders for
  credentials and synthetic configuration in public examples.
- Distinguish proposals from released capabilities and verified interoperability.

## Checks before a pull request

Run these from the repository root, including for new files. GitHub runs the
[repository checks](.github/workflows/checks.yml) on pull requests and pushes to
`main`. Tool versions and action commits are pinned in the workflows; update the
commands here when changing those pins.

### Offline fixtures and tooling

With Bash 3.2+, Git and Python 3.9+:

```sh
bash -n scripts/flow
python3 -m unittest discover -s tests -v
git diff --check
```

The tests parse every JSON file under `examples/`. For the current LibreChat
fixtures they also check unique local identifiers, relationship endpoints, secret
requirements and preserved component identities between minimal and expanded
descriptions. New example families need their own reference checks as appropriate.
These are fixture integrity checks, not a schema validator or model conformance
suite. Unknown and omitted information remains valid in these examples.

The workflow-helper tests use temporary local repositories and a stub for GitHub.
They require no credentials or network access and do not alter your checkout.
Review new, untracked files too; `git diff --check` does not include them until
they are staged. Python may create ignored `__pycache__` directories.

### Markdown and local links

With Node.js 22+ and npm, run the same Markdown linter version as CI:

```sh
npx --yes markdownlint-cli2@0.24.0
```

This downloads the checker and its dependencies from npm into the npm cache on
first use. It checks repository Markdown, including the PR template, using
[the lint configuration](.markdownlint-cli2.jsonc). It does not rewrite files.
It does not select Node.js as a runtime for future model tooling.

Install [lychee 0.24.2](https://github.com/lycheeverse/lychee/releases/tag/lychee-v0.24.2)
using the release's installation instructions, then run:

```sh
lychee --offline --include-fragments --no-progress '**/*.md'
```

This checks local Markdown links and heading anchors without network requests.
[The link configuration](lychee.toml) includes hidden GitHub templates and skips
dependency and scratch directories. A missing target or heading fails the check.

### Citation metadata

Install the checker in an isolated environment and validate CFF 1.2.0 metadata:

```sh
python3 -m venv .venv
.venv/bin/python -m pip install 'cffconvert==2.0.0'
.venv/bin/cffconvert --validate
```

Installation downloads packages from PyPI into the ignored `.venv` directory;
validation uses the checker's bundled schema. CI runs the same command with its
installed `cffconvert`. No release or DOI is needed to cite the draft. Include
the exact commit URL when citing the version you used.

### External links and manual review

The separate [external-link workflow](.github/workflows/links.yml) runs weekly or
on manual dispatch. To run its check locally with network access:

```sh
lychee --no-progress '**/*.md'
```

This sends requests to the linked public websites. It uses no credentials,
skips private addresses and reserved `.test` fixtures, and bounds retries and
timeouts. Failures remain visible; a third-party outage does not block the local
checks on a PR. External fragment anchors are not checked by this command.

Review the rendered Markdown, semantic consistency, scope and sensitive material
in the final diff. Passing checks does not establish compatibility, recreation
or the correctness of a modeling proposal. GitHub-hosted checks also download
actions and tools; none needs repository secrets or write permissions.

## Licensing

Contributions use the licence appropriate to their material type:
Apache-2.0 for model assets and software, CC-BY-4.0 for written material.
See [LICENSING.md](LICENSING.md). Contributors retain copyright and must have
the right to contribute the material under those terms. Identify any third-party
material and its licence explicitly.

There is no released conformance suite yet. For the current draft, check that
JSON examples parse, their local references resolve, Markdown links work and
the documentation does not claim unimplemented capabilities.
