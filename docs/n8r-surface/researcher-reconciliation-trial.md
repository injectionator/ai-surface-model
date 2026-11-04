# Controlled LibreChat declaration reconciliation

This procedure tests whether the installed Researcher can find a graph-relevant
configuration difference, preserve prior research and distinguish declarations
from runtime evidence. It uses **Markdown research**, not validated Surface JSON.
The configuration fixture is synthetic; the inspected implementation is actual
LibreChat source. No target application or service is changed or started.

## Teammate checklist

For a first check with the skill already installed, start in the
[repository vault](../../vault/README.md). It contains a prepared fictional
example and a walkthrough for investigating another chat-system repository.
Each run keeps its working files and saved notes under `vault/runs/`.

This page retains the deeper **LibreChat source** trial. Its recorded evidence
applies to the source revision below, not to the vault's fictional example.

## Preparation for the LibreChat trial

Use an installed skill, a permitted LibreChat checkout and a fresh test folder.
The first shell block below creates the three configuration input files. Keep
expected results outside Researcher's source folder, and record versions and
file-preservation checks alongside the saved outputs. The earlier agent rehearsal
and hashes are in the [verification record](researcher-skill-verification.md#controlled-declaration-trial-014).
Human acceptance remains separate from that rehearsal.

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
