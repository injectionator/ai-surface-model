# Researcher skill verification

**Candidate:** `n8r-surface:research` (**n8r-surface Researcher**) **0.1.1**, 4 November 2026.
This is a partial #17 increment. ChatGPT desktop / Work lifecycle acceptance is
**pending**, not passed. No Lab or standalone CLI research claim follows.

Skill entrypoint SHA-256:
`720afff0822a020b441f08e917304d36f6728f5e9228ec4ba505a147cd679402`.
The implementation/evidence commits are identified by the associated draft PR;
use the exact candidate commit when repeating the procedure.

## Branding update: 0.1.1

The plugin and skill now display **n8r-surface Researcher**, with the qualified
invocation `n8r-surface:research`. The renamed package installed successfully
through `codex plugin add n8r-surface@n8r-surface --json` (exit 0).
Removing the superseded `n8r-researcher@n8r-surface` package also exited 0; the
marketplace's installed list then contained exactly one enabled 0.1.1 candidate.
All ten installed files matched the source package, and the skill frontmatter
validator passed. The saved research note's digest was unchanged after removal.
Changed Markdown passed markdownlint-cli2 0.24.0 with the existing MD013/MD041
exemptions; Lychee 0.24.2 reported 37 local links OK, 0 errors and 11 excluded.
The staged whitespace check passed.

The skill differs only in name, heading, version and its identification in notes;
the investigation instructions and both references are unchanged. The original
behavioral trial below applies to 0.1.0 and was not repeated for this rename.
The old skill digest was
`8310917d4854f6ff35c1f9fe520b7d70355c868ea6972ebe48975498f16ba1f9`.
Work UI availability of the new name still needs a fresh-chat check using
[LOAD-01](researcher-skill.md#load-01-install-invoke-remove-reinstall).

## Initial local package behavior: 0.1.0

Environment: macOS ARM64, Codex CLI **0.139.0**, Python **3.13.1**.
The local CLI's supported `plugin marketplace`, `plugin add`, `plugin list` and
`plugin remove` commands were inspected before use. No credentials were read,
provider was configured or external model API was called for the package checks.

| Interaction | Actual result |
| --- | --- |
| Register this repository marketplace | Exit 0; `n8r-surface` registered. |
| Install the portable root-manifest-only candidate | Exit 1: `missing plugin.json`. The installed client did not accept the newer root manifest alone. |
| Add the documented Codex compatibility manifest and repeat installation | Exit 0; `n8r-researcher@n8r-surface`, version 0.1.0, installed and enabled. |
| Remove this exact plugin | Exit 0; its installed list became empty. |
| Reinstall the same candidate | Exit 0; exactly one installed/enabled 0.1.0 entry. |
| Read back installation | Every installed package file matched the source package bytes. |
| Read back saved research across removal/reinstall | The note's SHA-256 remained unchanged. |

The bundled skill passed the local skill-creator frontmatter validator. The
optional Agent Skills `compatibility` field was omitted because that validator
rejects it even though the open specification permits it; host requirements are
stated in the instructions instead. These checks establish bounded package and
local CLI behavior, not universal host compatibility.

## Initial behavioral trial: 0.1.0

A fresh evaluator received only the two synthetic Lumen source documents and a
request to research components/configuration, preserve evidence/gaps, ask a useful
question and save notes. It received no expected answers or previous findings.
The baseline used no supplied Researcher skill. It retained the main source facts,
conflict and uncertainty, but did not record exact source hashes or stable
component labels. This is a narrow baseline observation, not a quality benchmark.

A separate fresh evaluator then read the **installed** skill and both references,
and performed the same task against independent copies of the raw documents.
It saved Markdown notes and read them back. The developing agent independently
read the result and checked source identities and required facts:

- The note identifies `research-ai-surface 0.1.0`, both sources, line ranges and
  SHA-256 hashes. The hashes match the supplied bytes.
- It preserves the 10/25 batch-limit conflict, unknown model/version, untested
  Harbor integration and the settings document's scoped absence of an embedded
  archive database.
- It keeps one archive-service role with separate document/audit connections,
  stable component labels, optional unselected choices and an unanswered question.
- It labels the result as working notes and does not claim runtime verification,
  contract conformance, a deployment or complete repository coverage.

The underlying source digests were:

| Source | SHA-256 |
| --- | --- |
| `lumen-guide.md` | `98d3374c79c166b37f0debb4ffb5e457eda1385dd7847b042cbad674cac98693` |
| `lumen-settings.md` | `e94431bce92dc374a3aa58e31c8af78f7dfc61d7b34510ef38552d600d2489b7` |

This was a fresh agent evaluation through the current tool harness, explicitly
loading the installed file. It was **not** a Work-mode picker/discovery test,
human-answered conversation, fresh-chat continuation or LibreChat investigation.
The developer did not supply the findings or populate the evaluator's output.
No synthetic research output is represented as real LibreChat evidence.

## Initial repository checks: 0.1.0

The skill frontmatter validator passed. The two manifests agree on package
identity/version and presentation, and installed files and bundled licence texts
were independently compared with their sources. The saved note's source hashes
were checked against the original fixtures.

The Python fixture/workflow suite passed all 19 tests; `bash -n scripts/flow` and
`git diff --cached --check` passed. Markdownlint-cli2 0.24.0 checked the 13 changed
Markdown files with MD013 and MD041 disabled, matching the separate onboarding
check proposal's style. The bare no-argument lint command cannot discover a
configuration on this base revision; its repository-wide configuration is not
merged yet. Lychee 0.24.2 checked local links/anchors across repository Markdown,
excluding Git/dependency/virtualenv directories: 234 OK, 0 errors, 47 excluded.

Citation validation was attempted with cffconvert 2.0.0 but could not run because
this base has no `CITATION.cff`; that file belongs to separate onboarding work.
No CLI implementation or npm dependency changes are included in this increment,
so the paused CLI modifications and their test results are not its evidence.

## Remaining Work-mode acceptance

The computer-use tool refused access to the ChatGPT desktop application, reporting
that the app could not be used for safety reasons. No UI interaction was attempted
after that refusal. The [LOAD-01 procedure](researcher-skill.md#load-01-install-invoke-remove-reinstall)
is ready for a human rehearsal in ChatGPT desktop / Work. Record the desktop
version, visible installation/selection state, invocation evidence, saved note,
removal in a fresh chat and successful reinstall before marking it passed.

A successful test must also retain user research outside the plugin cache.
Uninstallation does not erase an old chat's instructions or content. Do not infer
unloading from an old chat's behavior, or infer Work support from CLI JSON alone.

Further #17 work: human correction and continuation, Harbor/LibreChat cases,
structured HTML and Surface outputs, n8r-labs adaptation in its own repository,
and the later installed-Codex standalone runner. Both #16 and #17 remain open.
