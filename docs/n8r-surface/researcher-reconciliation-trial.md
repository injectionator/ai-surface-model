# Controlled LibreChat declaration reconciliation

This procedure tests whether the installed Researcher can find a graph-relevant
configuration difference, preserve prior research and distinguish declarations
from runtime evidence. It uses **Markdown research**, not validated Surface JSON.
The configuration fixture is synthetic; the inspected implementation is actual
LibreChat source. No target application or service is changed or started.

## Teammate checklist

**What you are testing:** can Researcher describe an AI system, save its findings,
and notice a small change without losing earlier work or claiming more than it
knows? This check uses LibreChat source files and a pretend configuration. It does
not require a running LibreChat service. Use your chat app, file browser and text
editor.

### Before you start

The person handing over the test should give you:

- A local chat app with **n8r-surface Researcher 0.1.5** installed and available.
- The LibreChat source folder and a separate test folder containing `scope.md`,
  `baseline.env` and `current.env`. Both `.env` files should initially show
  `RAG_API_URL=` with nothing after the equals sign.
- A folder where Researcher can save your notes, and someone to contact if access
  or setup is missing.

If any of these is missing or you cannot select Researcher, record **Blocked**
and the missing item. You do not need to diagnose the installation yourself.
The `.env` files are plain-text settings. RAG is a service LibreChat can use to
process uploaded files for AI-assisted search; here we only change its stated
address in the test file.

### Tasks

- [ ] **1. Start the investigation.** Open a new local chat and select
  **n8r-surface Researcher** (`n8r-surface:research`). Give it access to the supplied
  LibreChat and test folders, and name your notes folder. Paste:

  > Use the supplied LibreChat source and the test folder's scope.md and
  > current.env to describe the main AI-related components and connections.
  > Explain what the software supports, what this test configuration says, and
  > what is still unknown about a running system. Cite the files you used. Save
  > your findings as a new note in my notes folder and give me a link to open it.

  **Look for:** a readable map or connection table, references to source files,
  open questions, and a link to a saved note.

- [ ] **2. Check the first saved note.** Open the file from its link. Confirm it
  contains the findings you saw in the chat. It should say that this test file
  gives no RAG service address, while LibreChat still supports that capability.
  Make a separate copy of the note for comparison later, outside the input folder.

  **Look for:** a real file you can reopen, with clear unknowns. Keep its original
  filename; you will supply that original to the next chat.

- [ ] **3. Make the small change.** In the supplied **test folder**, open
  `current.env` as text. Change `RAG_API_URL=` to
  `RAG_API_URL=https://rag.example.test`, save, and reopen it to confirm the line.
  Leave `baseline.env` and the LibreChat source files unchanged. The example
  address is a placeholder; do not open it in a browser or run either `.env` file.

  **Look for:** only `current.env` now contains the example address.

- [ ] **4. Ask Researcher to compare.** Start another new local chat and select
  Researcher again. Supply the same source and test folders, your original saved
  note, and your notes folder. Paste:

  > Compare my saved findings with the current source and test configuration.
  > Tell me what changed, what stayed the same, and what is still unknown, with
  > references to the evidence. Save the comparison as a new note and give me a
  > link. Keep the original note unchanged.

  **Look for:** a second saved note with a different filename, which you can open
  independently of the chat.

- [ ] **5. Check what it found.** Open the comparison. It should identify the RAG
  address changing from empty to `https://rag.example.test`. The other components
  and unresolved questions should still be recognisable. It may discover further
  source details, provided it distinguishes them from the configuration change.

  **Look for:** an explanation that the file now names a target, while whether a
  real service is running or working remains unknown. Claims such as “RAG is now
  working” fail this check. Reopen the original note and compare it with your
  saved copy; earlier findings should be unchanged.

- [ ] **6. Check the setup explanation.** In the chat, ask:

  > In the current AI Surface Model, who owns an Experiment's desired setup,
  > and who prepares the resources it needs?

  **Look for:** the Experiment owns its desired setup and asks its Lab directly;
  the Lab configures resources and supplies local bindings. The current chain is
  **Lab → Experiment → Setup**. A Bench should not be required.

### Report the result

Return this short note to the person who assigned the test:

> Result: Pass / Fail / Blocked
>
> App used and Researcher version supplied with the test:
>
> First note and comparison note:
>
> Task number and what happened, if anything differed:

**Pass** means you completed every task and saw its expected result. **Fail** means
a task ran but gave the wrong result, lost earlier work or failed to save a file.
**Blocked** means missing access or setup prevented a task. Different wording,
extra supported findings and different note numbers are fine. Copy the relevant
response or error when reporting a problem; you need not diagnose its cause.

Keep both notes and the test files for review. The test owner can remove the test
folder afterwards; no running application needs restoring. This records a human
check of the described workflow, not proof of a working RAG deployment or Lab
recreation.

## Preparation for the person handing over the test

Prepare the installed skill, source access and fresh test folder before assigning
the checklist. The commands below create the three input files; run only the
first block before handoff. The tester makes the change during task 3. Supply
folder locations directly to your teammate and keep the expected-result checklist
outside Researcher's input folder.

Retain source/host versions and file-preservation checks using the technical
procedure below. These checks remain the test owner's responsibility; the tester
reports what they can see and do. The earlier agent rehearsal and its hashes are
in the [verification record](researcher-skill-verification.md#controlled-declaration-trial-014).
This checklist is a clearer presentation of that workflow; a new teammate's
acceptance remains to be recorded.

## State X and expected outcome

Prerequisites: the [installed skill](researcher-skill.md), persistent local files,
Python 3, and a permitted LibreChat checkout. The exercised source revision was
`e1dfc10449ff713faffacd60273fddcfe2c0a698`. Identify any other revision and recheck
its semantics before using the same expectation. Existing private/dirty files
remain excluded. Prior graph research may be supplied, with its scope preserved.

The selected trial composition is `trial:librechat-rag-declaration`. Its initial
partial file explicitly sets `RAG_API_URL=`. The sole changed value becomes
`https://rag.example.test`. Both are declarations that are never loaded into a
process. Other settings and deployment overrides remain unknown.

The expected graph difference is a declared target for the existing RAG role.
Product support stays unchanged. Neither the empty value nor the example URL
establishes deployed enablement, reachability, embedding or successful retrieval.
Keep this expectation separate from the Researcher's task input.

The source documents the key in
[`.env.example`](https://github.com/LibreChat-AI/LibreChat/blob/e1dfc10449ff713faffacd60273fddcfe2c0a698/.env.example#L802-L814).
The [file-processing implementation](https://github.com/LibreChat-AI/LibreChat/blob/e1dfc10449ff713faffacd60273fddcfe2c0a698/api/server/services/Files/VectorDB/crud.js#L20-L95)
checks the URL before requests and uses it for `/embed` and `/documents` operations.
These are source claims at that revision, not observed application calls.

## Baseline, change and readback

From the **LibreChat checkout root**, record identity and prepare a disposable
input folder. Commands below do not load the environment files or contact a URL.

```sh
git rev-parse HEAD
git status --short
codex --version
codex plugin list --marketplace n8r-surface --json
trial_dir=$(mktemp -d "${TMPDIR:-/tmp}/n8r-rag-trial.XXXXXX")
python3 - "$trial_dir" <<'PY'
from pathlib import Path
import sys
root = Path(sys.argv[1])
text = '# Task-owned partial LibreChat declaration; never loaded into a process.\nRAG_API_URL=\n'
(root / 'baseline.env').write_text(text)
(root / 'current.env').write_text(text)
(root / 'scope.md').write_text(
    'Composition: trial:librechat-rag-declaration. current.env is its selected '
    'partial declaration; baseline.env retains initial bytes. Neither is loaded. '
    'Other settings, overrides and runtime state are unknown. Do not source '
    'these files or contact their targets. Prior research is separately scoped.\n'
)
print(root)
PY
```

Expected: exit 0 for each command, one enabled candidate and the printed trial
folder. Version 0.1.4 was used for both recorded passes; current 0.1.5 corrects the
model's ownership reference without changing this reconciliation method.

In a fresh local chat, select `n8r-surface:research`, supply the checkout, printed
trial folder and any applicable prior notes, then ask:

> Establish an AI Surface graph baseline for the composition in scope.md using
> current.env and this LibreChat checkout. Reuse the supplied research after
> checking applicability. Separate product possibilities, the declared trial
> setup and observed deployment. Retain identities, human choices and unknowns.
> Save the next numbered graph-reconciliation note and read back its bytes.

Open the saved note and follow its claim-bearing source references. Record its
exact filename and SHA-256. The baseline must exist **before** changing the file.
The host must show its resolved absolute save destination; do not accept a claimed
save without a readable file.

In the same terminal, change the one value and inspect the actual bytes:

```sh
python3 - "$trial_dir" <<'PY'
from pathlib import Path
import hashlib, sys
root = Path(sys.argv[1])
old = (root / 'baseline.env').read_bytes()
assert (root / 'current.env').read_bytes() == old
new = old.replace(b'RAG_API_URL=\n', b'RAG_API_URL=https://rag.example.test\n')
assert new != old
(root / 'current.env').write_bytes(new)
for name in ('baseline.env', 'current.env'):
    data = (root / name).read_bytes()
    print(name, hashlib.sha256(data).hexdigest())
    print(data.decode(), end='')
PY
```

Expected exit 0 and only that value changed. Baseline digest is
`5e060fa66a8c986f418149ff5c8aceba7f4e3b4b090456bb1a1e4bf0299c3161`;
changed digest is `facfff7d29f57690ba6bb2dc5127a2a249e581bf27f0e3bb9106f4761ab3b638`.

In another fresh local chat with the same installed skill and source access,
supply the baseline note and trial folder, then ask:

> Compare this saved graph with the current sources and supplied declaration.
> Show evidenced agreements, differences, additional discoveries, conflicts and
> unknowns for relevant nodes and connections. Preserve the original, identities,
> scoped decisions and unresolved claims. Separate capabilities, declarations
> and observations. Save a numbered successor and read back its bytes.

Independently open the successor and verify the one declared target change,
unchanged capability/identities and retained unknowns. Rehash the baseline note
and earlier notes to confirm preservation. Inspect the cited source lines and
file hashes. Check `git status --short` again; research must not change the source
checkout. Chat interactions have no process exit code.

Graph wording, next note number and additional scoped source findings may vary.
An unsupported runtime claim, lost predecessor, unrelated selection change,
unexplained identity replacement or missing saved file fails the check. Source
reading cannot demonstrate whether a process loaded this declaration; a later
live trial needs separate effective-configuration and interaction evidence.

Retain the notes and input snapshots together when preserving evidence. Otherwise
remove only the disposable trial folder after review; no application cleanup or
setting restoration is needed. Do not remove earlier research.

See [recorded evidence](researcher-skill-verification.md#controlled-declaration-trial-014)
and the proposed [Lab recreation handoff](recreation-handoff.md). An agent
rehearsal establishes the bounded recorded outcome, not human acceptance or
implemented Lab recreation.
