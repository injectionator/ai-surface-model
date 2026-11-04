# Initial implementation decisions

These choices complete the remaining implementation decisions for
[issue #15](https://github.com/injectionator/n8r-surface/issues/15). They are
maintainer-reviewable implementation choices within the approved design, not
claims that the CLI or runner has shipped.

## Runtime and distribution

Use TypeScript compiled to ESM JavaScript, npm with a committed lockfile, and the
built-in Node test runner. The initial supported majors are **Node.js 22, 24 and
26**. Test the current patch of each supported major before a release. Odd-numbered
majors and Bun-only execution are not part of the initial support promise. Revisit
22 before its scheduled end of support. The official
[Node release schedule](https://github.com/nodejs/Release/blob/main/schedule.json)
lists 22/24/26 support windows through April 2027/2028/2029 respectively (checked
4 November 2026).

Choose **`n8r-surface`** for the npm package and future command. A registry lookup
on 4 November 2026 returned no public package; that does not reserve the name or
prove publishing rights. The package remains `private: true` and versioned
`0.0.0-experimental.1` during this work. No publication is authorized by a tarball
test. If the name is unavailable at release, explicitly select a scoped package
while preserving the command name where practical.

Issue #15 ships a library, built declarations, contracts and synthetic assets.
The first #16 increment adds a `bin` entry for bare startup only; see its
[settings, parser and inspection decisions](startup.md). It must be exercised
through the installed tarball outside the source checkout. #17 adds the versioned
Researcher instructions. Runtime consumers do not need TypeScript or Bun.

Use `yaml` 2.9.1 as the single runtime dependency; its parsed nodes allow rejection
of tags, aliases, duplicate keys and unsupported numeric forms before conversion.
See its [version 2 documentation](https://eemeli.org/yaml/) and the locked version
in [package-lock.json](../../package-lock.json). TypeScript 6.0.3 and Node typings
22.20.5 are development dependencies. The bounded field/reference checker and
HTML renderer need no framework, browser runtime or general ontology dependency.

## First CLI AI runner

Select a direct **OpenAI Responses API** adapter for #17, with explicitly supplied
function tools for scoped reading, human questions and guarded artefact operations.
This is a deliberate provider choice; TypeScript alone did not select it.
The [official function-calling guide](https://developers.openai.com/api/docs/guides/function-calling)
describes the model proposing calls and application code executing them and
returning results (reviewed 4 November 2026).

The reason is control over source and filesystem effects: the host can expose
only the small operations in the [host contract](host-contract.md), validate every
call, and return actual save results. An installed coding-agent runner could
reuse that agent's setup, but would add subprocess/session and tool-permission
mapping to this first path. Additional runners remain possible behind the same
host boundary. This choice is not a comparative quality or cost benchmark.

The future adapter must:

- Use an explicitly configured model supporting function calls. Record its exact
  identifier with verification; do not hard-code a moving "latest" model or infer
  model availability from this contract milestone.
- Read an explicitly configured API credential reference, initially
  `OPENAI_API_KEY` in the process environment. Keep values outside settings,
  artefacts and logs; do not borrow another application's credentials or silently
  select an account. API billing/authentication is separate from this Codex chat.
- Show that selected source extracts and conversation/tool outputs will be sent
  to OpenAI; obtain discovery-session authorization before transmission. Bare
  startup and status make no inference request.
- Keep source reads and corpus writes local to the host. No shell/source-script
  execution, hosted file uploads, web search or provider-managed file store is
  needed for the initial document/repository workflow.
- Request `store: false` and maintain continuation locally through accepted
  records and necessary conversation items. This is not a zero-retention promise:
  provider abuse-monitoring and account controls still apply, as described by the
  [official data controls](https://developers.openai.com/api/docs/guides/your-data)
  (reviewed 4 November 2026).
- Report unavailable credentials, model access, network errors and unsupported
  tools without fallback or a false completed-research result.

No API key was read and no inference request was made to verify #15. A live runner
trial, provider SDK/version choice and its exact model test are #17 acceptance
work. The artefacts and portable instructions remain independent of this adapter.

## HTML ownership and numeric scope

The embedded data owns the record and the whole readable HTML is its deterministic
projection. The reader rejects divergence, including benign reformatting, so human
edits cannot disappear in a later save. Reviewed corrections become successors;
a rich editor and automatic merging are deferred.

Use only safe integer numbers in the initial portable data subset. Decimal and
large quantities require explicit strings/units. This costs convenience but makes
lossy numeric conversion an explicit error instead of an undetected change to
evidence or identity. Expanding either HTML editing or numeric support requires
versioned tests and a documented migration.

## Verification boundary

`npm test` checks this profile, its source/reference fixtures and HTML/data
consistency. `npm run check:package` packs and installs into a temporary directory,
then imports built exports and bundled fixtures with no checkout-relative imports.
The installer uses the local npm dependency cache populated by `npm ci`; it runs
with `--offline --ignore-scripts`. Temporary files are removed after the check.

These checks do not prove an AI can research LibreChat, a consumer understands an
extension, a Lab can import the format, or a selected composition runs. Keep those
later tests separate and name the actual runner/consumer versions when they run.
