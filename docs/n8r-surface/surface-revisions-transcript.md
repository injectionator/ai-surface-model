# Surface revision rehearsal transcript

Actual installed Codex interactions on fictional sources. Local paths are replaced
with `<rehearsal>`; spinner frames and trailing spaces are omitted. These are agent rehearsal
interactions, not human acceptance. See [environment, readback and limits](surface-revisions-verification.md).

## generate

````text
Research source: <rehearsal>/source/lumen-guide.md (one file)
Inspected source text and your messages will be sent to OpenAI through Codex using ChatGPT sign-in.
Source access is read-only. /save saves a Markdown note; /save surface saves a previewed HTML/JSON pair.
Saved note: <rehearsal>/input/research-001.md
Last edited: 2026-11-05T11:50:56.958Z
Recorded source: lumen-guide.md (file); this is not verified identity.
The saved note, including human edits, will also be sent to OpenAI after confirmation.
Start research with OpenAI using Codex ChatGPT sign-in? [y/N] y

Connecting to Codex…

Connected: ChatGPT sign-in; model gpt-6-astra.
Researcher 0.1.8; sha256:8af29c3073df9b8210a7dd94ced9700379b0a98f76bd3a2902f9430b93c98a2a
Ask about your source or request a Surface preview. /save saves a note; /save surface saves the preview; /exit ends the chat; Ctrl-C cancels.

[reopen evidence] lumen-guide.md: unchanged sha256:98d3374c79c166b37f0debb4ffb5e457eda1385dd7847b042cbad674cac98693

I’m continuing with `n8r-surface:research 0.1.8`, prioritizing session-expiry evidence and retaining the external OIDC non-selection. I’ll re-read the selected source; I won’t save anything.

[source_list] .

[source_read] lumen-guide.md sha256:98d3374c79c166b37f0debb4ffb5e457eda1385dd7847b042cbad674cac98693

## Continued partial graph

These remain **documented capabilities, not verified deployment connections**:

| Connection | Current basis |
|---|---|
| `component:lumen` → `component:inference`: summary generation | `lumen-guide.md:8–9`; model/version unspecified |
| `component:lumen` → `component:archive`: documents and audit events through separate routes on one service | `lumen-guide.md:13–16`; optional, not a tested Harbor integration |
| `component:archive` → `component:callback`: notifications | `lumen-guide.md:20–22`; optional, disabled until selected/configured |
| `component:oidc`: supported identity option for `component:lumen` | `lumen-guide.md:9`; **human non-selection retained** |

### Source reconciliation

Freshly read all 29 lines of the explicitly selected `lumen-guide.md` at `2026-11-05T11:51:08.759Z`. Its SHA-256 matches the historical note:
`98d3374c79c166b37f0debb4ffb5e457eda1385dd7847b042cbad674cac98693`.

The listing and read reported no exclusions or truncation. The content identifies itself as **fictional fixture-1**, not a real installation (`lumen-guide.md:1–4`). This confirms matching document bytes—not deployment identity. Prior claims remain historical and are corroborated only within this fixture.

### Session-expiry priority

Your human edit is retained: **investigate session expiry next**, keeping external OIDC unselected.

The complete guide provides **no session-expiry evidence**: no idle or absolute timeout, renewal behavior, logout invalidation, or enforcement path. These remain unknown, not absent capabilities. No implementation, deployment configuration, or runtime observations are supplied (`lumen-guide.md:24–28`).

**Next useful investigation:** inspect session-management documentation or implementation and applicable nonsecret configuration, tracing expiry enforcement on summary requests. This would establish whether expired sessions actually prevent AI access without assuming OIDC provides that control.

Can you supply session-management documentation or code as the next authorized source?

Nothing was saved.

You> Create a partial Surface from these notes; show me what is selected and still unknown. Retain all five component IDs, my OIDC non-selection and the human session-expiry priority. Use surface_draft to prepare the linked structured research and definition. Do not invent selections, model identity or runtime evidence.

[source_list] .

[source_read] lumen-guide.md sha256:98d3374c79c166b37f0debb4ffb5e457eda1385dd7847b042cbad674cac98693

I’ll retain all five `component:` IDs unchanged. External OIDC will be explicitly rejected for this investigation; other deployment selections will remain unknown. Session expiry stays the next investigation priority. This prepares a preview, not a save.

Prepared the linked research and Surface definition preview. **Nothing saved.**

- **Retained:** all five original component IDs.
- **Explicitly not selected:** external OIDC, per your decision.
- **Selection unknown:** inference binding, archive delivery and callbacks. No deployment connections were invented.
- **Still unknown:** model identity/version, input data, non-OIDC access controls and runtime behavior.
- **Next priority:** session-expiry policy and enforcement, preserving your human edit.

Documented capabilities remain separate from selected composition; historical evidence remains qualified.

Can you provide session-management documentation or code as the next authorized source?

Validated partial Surface preview (declared only; not runtime proof)
Lumen Desk — partial Surface
Components:
  component:lumen | Lumen Desk
  component:inference | Inference endpoint
  component:archive | Archive service
  component:callback | Archive notification receiver
  component:oidc | External OIDC option
Declared connections:
Human decisions:
  urn:lumen:decision:no-oidc: rejected Use external OIDC — Retained human decision dated 2026-11-05: do not use external OIDC for this investigation. This does not establish disabled runtime settings or an alternative authentication mechanism. Timestamp records this retention, not an invented original decision time.
Requirements:
Coverage:
  All five component IDs retained unchanged. Nodes include documented roles/options; inclusion does not establish selection.
  Fresh full inspection of lumen-guide.md:1–29; no exclusions or truncation reported.
  No selected-composition relationships asserted: deployment selections are unknown; external OIDC is explicitly rejected in human intent.
  Documented directed capabilities remain in linked research: Lumen to inference; Lumen to shared archive through document/audit routes; archive to callback. These are not verified runtime edges.
Unknowns and gaps:
  Session-expiry policy and enforcement are the human-prioritized next investigation.
  Inference binding, model/version, summary inputs and context assembly remain unknown.
  Archive and callback selections/bindings, authentication, schemas, validation and retry behavior remain unresolved.
  Non-OIDC access controls, tool execution paths, persistence and security interception mechanisms remain unknown.
  No deployed system identity, reachability, exercised behavior or runtime evidence established.
Evidence:
  urn:lumen:f:identity: known — Document identity only; no real installation is described.; urn:lumen:source:current lumen-guide.md:1–4
  urn:lumen:f:inference: known — Guide declaration, not a selected deployment or exercised connection.; urn:lumen:source:current lumen-guide.md:8–9
  urn:lumen:f:archive: known — One shared service. Schema and authentication require separate agreement; not a tested Harbor Archive integration.; urn:lumen:source:current lumen-guide.md:13–16
  urn:lumen:f:callback: known — A documented condition, not observed runtime state; validation, retries and tested protocol unspecified.; urn:lumen:source:current lumen-guide.md:20–22
  urn:lumen:f:oidc: known — Support does not establish selection or effective enablement.; urn:lumen:source:current lumen-guide.md:9
  urn:lumen:f:model: unknown — Endpoint service identity, model and version remain unknown.;
  urn:lumen:f:session: unknown — No session timeout, renewal, invalidation or enforcement evidence in the complete guide; absence of documentation is not absence of controls.;
  urn:lumen:f:selection: unknown — No deployment selections are established beyond the human decision not to use external OIDC.;
  urn:lumen:f:scope: known — Source-only investigation; reachability and exercise not established.; urn:lumen:source:current lumen-guide.md:24–28
  urn:lumen:f:inputs: unknown — Summary input sources, context assembly and inference payload details remain unknown.;
  urn:lumen:f:auth: unknown — Authentication and access controls without external OIDC remain unknown.;
Not saved. Enter /save surface to save exactly this preview.
You> /save surface

Saved and read back: <rehearsal>/vault/surfaces/lumen-guide-md/surface-001/research.html
Saved and read back: <rehearsal>/vault/surfaces/lumen-guide-md/surface-001/surface.json
You> /exit
````

## revise

````text
Research source: <rehearsal>/source/lumen-guide.md (one file)
Inspected source text and your messages will be sent to OpenAI through Codex using ChatGPT sign-in.
Source access is read-only. /save saves a Markdown note; /save surface saves a previewed HTML/JSON pair.
Saved pair: <rehearsal>/vault/surfaces/lumen-guide-md/surface-001
Both saved artefacts and host evidence will be sent to OpenAI after confirmation.
Start research with OpenAI using Codex ChatGPT sign-in? [y/N] y

Connecting to Codex…

Connected: ChatGPT sign-in; model gpt-6-astra.
Researcher 0.1.8; sha256:8af29c3073df9b8210a7dd94ced9700379b0a98f76bd3a2902f9430b93c98a2a
Ask about your source or request a Surface preview. /save saves a note; /save surface saves the preview; /exit ends the chat; Ctrl-C cancels.

[reopen evidence] lumen-guide.md: unchanged sha256:98d3374c79c166b37f0debb4ffb5e457eda1385dd7847b042cbad674cac98693

I’m continuing with `n8r-surface:research 0.1.8`, retaining the component IDs, OIDC non-selection and session-expiry priority. I’ll re-read the selected source; nothing will be saved.

[source_list] .

[source_read] lumen-guide.md sha256:98d3374c79c166b37f0debb4ffb5e457eda1385dd7847b042cbad674cac98693

### Continued partial graph

These are **documented capabilities, not selected or exercised connections**. Component IDs remain unchanged.

| Directed capability | Fresh evidence |
|---|---|
| `component:lumen` → `component:inference`: summary generation | `lumen-guide.md:8–9`; model/version unspecified |
| `component:lumen` → `component:archive`: documents and audit events via separate HTTP routes on one service | `lumen-guide.md:13–16`; maximum 10 documents per batch; schema/authentication unresolved |
| `component:archive` → `component:callback`: optional notifications | `lumen-guide.md:20–22`; disabled until selected/configured; validation and retries unspecified |
| `component:lumen` → `component:oidc`: supported identity option | `lumen-guide.md:9`; **human non-selection retained**, not proof of runtime disablement |

### Identity and historical evidence

Freshly inspected all 29 lines at `2026-11-05T11:52:51.423Z`. The selected source contains only this file; no exclusions or truncation were reported.

SHA-256: `98d3374c79c166b37f0debb4ffb5e457eda1385dd7847b042cbad674cac98693`

The bytes match the historical digest, and the guide explicitly identifies itself as **fictional fixture-1**, not a real installation (`lumen-guide.md:1–4`). This corroborates the historical document claims—not deployment identity. Prior claims remain historical; no changed source evidence was found. Deployment and runtime evidence remain unavailable (`lumen-guide.md:24–28`).

### Next useful investigation

Your retained edit prioritizes **session-expiry enforcement** at `component:lumen`. The complete guide provides no session policy or enforcement evidence; that does not establish absence of controls.

Next, inspect authorized session-management code/documentation and nonsecret configuration, tracing idle/absolute expiry, renewal and logout invalidation through summary requests. Keep external OIDC unselected and alternative authentication unresolved.

**Can you select session-management code or documentation for that next inspection?**

Nothing was saved.

You> Change my decision: select external OIDC in the desired composition, because this investigation now requires centralized sign-in. This is my selection, not proof of a configured provider. Keep the provider, model identity and runtime behavior unknown. Preserve existing IDs, evidence, other decisions and the session-expiry priority. Prepare the updated Surface with surface_draft.

[source_list] .

[source_read] lumen-guide.md sha256:98d3374c79c166b37f0debb4ffb5e457eda1385dd7847b042cbad674cac98693

I’ll retain the existing IDs and historical evidence, change the OIDC decision to selected for centralized sign-in, and add the desired OIDC relationship. Provider binding, model identity and runtime behavior will remain unknown; session expiry stays the priority. This will stage a preview, not save it.

Updated Surface preview staged—not saved.

- External OIDC is **selected for centralized sign-in** in the desired composition.
- Provider binding, model identity and runtime behavior remain unknown.
- Existing IDs, historical evidence and prior decision history are retained.
- Session-expiry investigation remains the priority.

Validated partial Surface preview (declared only; not runtime proof)
Lumen Desk — partial Surface
Components:
  component:lumen | Lumen Desk
  component:inference | Inference endpoint
  component:archive | Archive service
  component:callback | Archive notification receiver
  component:oidc | External OIDC option
Declared connections:
  urn:lumen:relationship:oidc-sign-in: component:lumen -> component:oidc (centralized-sign-in)
Human decisions:
  urn:lumen:decision:no-oidc: selected Use external OIDC — User explicitly changed the prior rejection: select external OIDC in the desired composition because this investigation now requires centralized sign-in. This is human selection, not proof of a configured provider or runtime behavior. Existing decision ID retained.
Requirements:
Coverage:
  All five component IDs and node types retained unchanged. No pre-existing relationship IDs existed.
  Fresh full inspection of lumen-guide.md:1–29; no exclusions or truncation reported. Historical sources, findings and notes retained.
  Only the user-selected desired OIDC sign-in relationship is asserted; declared human intent is not configured or exercised behavior.
  Inference, archive document/audit delivery and callback paths remain documented capabilities in research, not selected-composition relationships.
Unknowns and gaps:
  Session-expiry policy and enforcement remain the human-prioritized next investigation, including desired OIDC sign-in.
  OIDC provider, issuer, binding, effective enablement and runtime behavior remain unknown.
  Inference binding, model/version, summary inputs and context assembly remain unknown.
  Archive and callback selections/bindings, authentication, schemas, validation and retry behavior remain unresolved.
  Non-OIDC access controls, tool execution paths, persistence and security interception mechanisms remain unknown.
  No deployed system identity, reachability, exercised behavior or runtime evidence established.
Evidence:
  urn:lumen:f:identity: known — Document identity only; no real installation is described.; urn:lumen:source:current lumen-guide.md:1–4
  urn:lumen:f:inference: known — Guide declaration, not a selected deployment or exercised connection.; urn:lumen:source:current lumen-guide.md:8–9
  urn:lumen:f:archive: known — One shared service. Schema and authentication require separate agreement; not a tested Harbor Archive integration.; urn:lumen:source:current lumen-guide.md:13–16
  urn:lumen:f:callback: known — A documented condition, not observed runtime state; validation, retries and tested protocol unspecified.; urn:lumen:source:current lumen-guide.md:20–22
  urn:lumen:f:oidc: known — Support does not establish selection or effective enablement.; urn:lumen:source:current lumen-guide.md:9
  urn:lumen:f:model: unknown — Endpoint service identity, model and version remain unknown.;
  urn:lumen:f:session: unknown — No session timeout, renewal, invalidation or enforcement evidence in the complete guide; absence of documentation is not absence of controls.;
  urn:lumen:f:selection: unknown — No deployment selections are established beyond the human decision not to use external OIDC.;
  urn:lumen:f:scope: known — Source-only investigation; reachability and exercise not established.; urn:lumen:source:current lumen-guide.md:24–28
  urn:lumen:f:inputs: unknown — Summary input sources, context assembly and inference payload details remain unknown.;
  urn:lumen:f:auth: unknown — Authentication and access controls without external OIDC remain unknown.;
  urn:lumen:f:oidc-binding: unknown — User selects external OIDC in desired composition; provider identity, issuer and configuration remain unknown.;
  urn:lumen:f:oidc-runtime: unknown — Selection does not establish configured, reachable, enabled or exercised OIDC behavior.;
  urn:lumen:f:recheck: known — Fresh document evidence corroborates historical capabilities only within the fictional fixture; matching bytes do not establish deployment identity.; urn:lumen:source:20261105-115310 lumen-guide.md:1–28
Not saved. Enter /save surface to save exactly this preview.
You> /save surface

Saved and read back: <rehearsal>/vault/surfaces/lumen-guide-md/surface-002/research.html
Saved and read back: <rehearsal>/vault/surfaces/lumen-guide-md/surface-002/surface.json
You> /exit
````

## reopen-html

````text
Research source: <rehearsal>/source/lumen-guide.md (one file)
Inspected source text and your messages will be sent to OpenAI through Codex using ChatGPT sign-in.
Source access is read-only. /save saves a Markdown note; /save surface saves a previewed HTML/JSON pair.
Saved pair: <rehearsal>/vault/surfaces/lumen-guide-md/surface-002
Both saved artefacts and host evidence will be sent to OpenAI after confirmation.
Start research with OpenAI using Codex ChatGPT sign-in? [y/N] y

Connecting to Codex…

Connected: ChatGPT sign-in; model gpt-6-astra.
Researcher 0.1.8; sha256:8af29c3073df9b8210a7dd94ced9700379b0a98f76bd3a2902f9430b93c98a2a
Ask about your source or request a Surface preview. /save saves a note; /save surface saves the preview; /exit ends the chat; Ctrl-C cancels.

[reopen evidence] lumen-guide.md: unchanged sha256:98d3374c79c166b37f0debb4ffb5e457eda1385dd7847b042cbad674cac98693

n8r-surface:research 0.1.8. I’ll re-read the selected source, retain the historical claims and latest human choices, and check what evidence can advance the session-expiry investigation. Nothing will be saved.

[source_list] .

[source_read] lumen-guide.md sha256:98d3374c79c166b37f0debb4ffb5e457eda1385dd7847b042cbad674cac98693

### Continued partial graph

All five component IDs and the existing OIDC relationship ID are retained.

| Path | Current basis |
|---|---|
| `component:lumen` → `component:oidc` | Retained human selection for centralized sign-in; provider, binding and runtime behavior unknown. Source supports OIDC as an option (`lumen-guide.md:8–9`). |
| `component:lumen` → `component:inference` | Documented summary-generation capability; endpoint/model/version unresolved (`8–9`). |
| `component:lumen` → `component:archive` | Optional document and audit delivery through separate routes on **one service**; maximum 10 documents per batch (`13–16`). |
| `component:archive` → `component:callback` | Optional notifications; receiver disabled until selected and configured (`20–22`). |

The latter three paths describe capabilities, not selected or exercised connections.

### Source reconciliation

Freshly inspected all 29 lines of the sole selected file; no exclusions or truncation. Its SHA-256 is:
`98d3374c79c166b37f0debb4ffb5e457eda1385dd7847b042cbad674cac98693`

The bytes match the historical digest. The document itself identifies **fictional fixture-1**, not a real installation (`1–4`). Neither that match nor the supplied comparison establishes deployed-system identity.

Prior claims and human edits remain historical. The latest OIDC selection supersedes the earlier rejection; the older `urn:lumen:f:selection` wording reflects former intent, not the current choice. **Session-expiry investigation remains the retained priority.**

### Next useful investigation

Obtain session-management implementation or documentation and applicable nonsecret configuration. Trace idle/absolute expiry, renewal and logout invalidation through summary requests, including the intended OIDC boundary.

The selected guide provides none of that evidence; deployment and runtime observations are explicitly unavailable (`24–28`). Nothing was saved.

**Can you supply session-management code or documentation as the next authorized source?**

You> Which human decision changed between revisions, and what remains unknown? Do not save or create another draft.

The human decision changed from **rejecting external OIDC** to **selecting it for centralized sign-in in the desired composition**. The existing decision ID, `urn:lumen:decision:no-oidc`, was retained despite its historical name. Session-expiry investigation remained the priority.

Still unknown:
- OIDC provider, issuer, configuration, effective enablement and runtime behavior.
- Session-expiry policy and enforcement, renewal and logout invalidation.
- Inference endpoint, model/version, summary inputs and context assembly.
- Archive/callback selections, bindings, authentication, schemas, validation and retries.
- Deployed-system identity and whether any connection is reachable or exercised.

The selection records human intent—not a configured or verified integration. Nothing saved or drafted.

You> /exit
````

## harbor-notes

````text
Research source: <rehearsal>/harbor (directory)
Inspected source text and your messages will be sent to OpenAI through Codex using ChatGPT sign-in.
Source access is read-only. /save saves a Markdown note; /save surface saves a previewed HTML/JSON pair.
Start research with OpenAI using Codex ChatGPT sign-in? [y/N] y

Connecting to Codex…

Connected: ChatGPT sign-in; model gpt-6-astra.
Researcher 0.1.8; sha256:8af29c3073df9b8210a7dd94ced9700379b0a98f76bd3a2902f9430b93c98a2a
Ask about your source or request a Surface preview. /save saves a note; /save surface saves the preview; /exit ends the chat; Ctrl-C cancels.
You> Research this independent archive product. Keep authentication and compatibility unknown. My decision is to defer the optional callback. Assign stable namespaced component IDs and retain evidence.

I’m using `n8r-surface:research 0.1.8`. I’ll inspect the selected source, map the evidenced connections with stable namespaced IDs, keep authentication and compatibility unknown, and record your decision to defer the optional callback.

[source_list] .

[source_read] harbor-api.md sha256:b2b87be7df05374c4cc574a1f308bd3b3444f63cd95e894121b9ea1e7be3d681

## Harbor Archive — partial research graph

**Scope:** independent, synthetic archive product; source version `fixture-1`. No AI connection is established: the notes explicitly describe no built-in AI or summarization knowledge (`harbor-api.md:1–4`).

### Stable components and connections

| Component ID | Role |
|---|---|
| `urn:harbor:archive` | Harbor Archive; owns both intake routes |
| `urn:harbor:intake-client` | Unidentified caller role, not an established integration |
| `urn:harbor:callback-receiver` | Unresolved optional receiver role |

| Direction | Evidence and status |
|---|---|
| Intake client → archive: store documents via HTTP | Documented capability; JSON supported (`harbor-api.md:8–10`). |
| Intake client → archive: append audit events via HTTP | Separate route within the same product; JSON supported (`harbor-api.md:8–10`). |
| Archive → callback receiver: report archival events via HTTP | Optional capability, **deferred by your decision**; not selected composition (`harbor-api.md:14–16`). |

These are documented capabilities, not observed deployment connections.

### Unknowns and decision

- **Authentication: unknown.** Not specified (`harbor-api.md:9–10`).
- **Compatibility: unknown.** Receiver compatibility requires investigation; no Lumen Desk integration has been tested (`harbor-api.md:14–16`).
- Exact request fields, limits, callback payload, deployed endpoints and runtime behavior remain unknown.
- **Human decision, 2026-11-05:** defer the optional callback. This does not imply the capability is absent.

### Retained evidence

- Read all of `harbor-api.md`, lines **1–17**, without truncation; the directory listing contained only this file and reported no exclusions.
- Inspected: `2026-11-05T11:55:13.129Z`.
- Exact file SHA-256: `b2b87be7df05374c4cc574a1f308bd3b3444f63cd95e894121b9ea1e7be3d681`.
- No repository revision, deployment evidence or exercised request trace supplied.

**Recommended next investigation:** obtain the two intake route contracts to establish addresses, payload fields and limits. Resume from `harbor-api.md:6–10`; leave authentication and compatibility unknown and callback work deferred.

Would you like to retain this as `harbor-archive-research-001.md`? Use `/save` to request host saving; nothing has been saved yet.

You> /save

Save destination: <rehearsal>/vault/research/harbor/research-001.md

Staged the Markdown working note with stable IDs, evidence and hash, unknowns, your callback decision, and next steps. Host saving and verification are pending.

Saved and read back: <rehearsal>/vault/research/harbor/research-001.md
sha256:c66177d5217486ca275b307892c46781dff1490fda266e94d9244afa3c04abf7
You> /exit
````

## harbor-surface

````text
Research source: <rehearsal>/harbor (directory)
Inspected source text and your messages will be sent to OpenAI through Codex using ChatGPT sign-in.
Source access is read-only. /save saves a Markdown note; /save surface saves a previewed HTML/JSON pair.
Saved note: <rehearsal>/vault/research/harbor/research-001.md
Last edited: 2026-11-05T11:56:14.228Z
Recorded source: harbor (directory); this is not verified identity.
The saved note, including human edits, will also be sent to OpenAI after confirmation.
Start research with OpenAI using Codex ChatGPT sign-in? [y/N] y

Connecting to Codex…

Connected: ChatGPT sign-in; model gpt-6-astra.
Researcher 0.1.8; sha256:8af29c3073df9b8210a7dd94ced9700379b0a98f76bd3a2902f9430b93c98a2a
Ask about your source or request a Surface preview. /save saves a note; /save surface saves the preview; /exit ends the chat; Ctrl-C cancels.

[reopen evidence] harbor-api.md: unchanged sha256:b2b87be7df05374c4cc574a1f308bd3b3444f63cd95e894121b9ea1e7be3d681

I’m continuing with `n8r-surface:research 0.1.8`. I’ll inspect the selected source afresh, preserve the prior IDs and decisions, and distinguish current evidence from historical claims. I won’t save.

[source_list] .

[source_read] harbor-api.md sha256:b2b87be7df05374c4cc574a1f308bd3b3444f63cd95e894121b9ea1e7be3d681

## Continued partial graph

These remain **documented capabilities**, not selected or exercised connections.

| Retained connection ID | Direction | Current evidence |
|---|---|---|
| `urn:harbor:store-document` | `urn:harbor:intake-client` → `urn:harbor:archive` | HTTP document storage; JSON supported (`harbor-api.md:8–10`). |
| `urn:harbor:append-audit-event` | `urn:harbor:intake-client` → `urn:harbor:archive` | Separate HTTP audit-event intake; JSON supported (`harbor-api.md:8–10`). |
| `urn:harbor:archival-callback` | `urn:harbor:archive` → `urn:harbor:callback-receiver` | Optional HTTP notification capability; **human decision remains deferred**, not selected (`harbor-api.md:14–16`). |

No AI connection is established. The current document describes Harbor as synthetic and independent of Lumen Desk, without built-in AI knowledge (`harbor-api.md:3–4`).

### Source identity and comparison
- Freshly listed the selected source: only `harbor-api.md`; no reported exclusions or truncation.
- Read all 17 lines. Its title identifies fictional interface notes, `fixture-1`.
- Exact SHA-256 matches the historical record: `b2b87be7df05374c4cc574a1f308bd3b3444f63cd95e894121b9ea1e7be3d681`.
- This confirms matching **document bytes**, not repository, deployment or system identity. Repository revision and independent system identity evidence remain unavailable.
- No changed document evidence was found. Prior claims remain historical; the fresh read independently supports the capability descriptions above.

### Retained decisions and gaps
All component IDs and recorded human choices are preserved. **Authentication and compatibility remain unknown.** Callback investigation remains deferred. Route addresses, exact payload fields and limits remain unresolved; implementation and runtime evidence are unavailable.

### Next useful investigation
Obtain additional authoritative intake contracts for `urn:harbor:store-document` and `urn:harbor:append-audit-event`, starting from `harbor-api.md:6–10`. This would clarify route addresses, payload fields and limits without expanding into authentication, compatibility or callbacks.

Can you supply those intake contracts within the authorized source?

Nothing was saved.

You> Create a partial Surface from these notes using surface_draft. Retain the same component IDs, my deferred callback decision, evidence, and explicit unknown authentication and compatibility. Show what is selected and still unknown.

[source_read] harbor-api.md sha256:b2b87be7df05374c4cc574a1f308bd3b3444f63cd95e894121b9ea1e7be3d681

I’ll stage a partial Surface preview with the same component IDs. No deployment connections have been selected, so the intake routes will remain supported alternatives and the callback will remain deferred. Authentication and compatibility will be explicitly unknown.

Staged the partial Surface preview; **nothing saved**.

- All three component IDs retained.
- **Selected connections:** none established.
- Document and audit intake remain supported capabilities.
- Optional callback remains **deferred**.
- Authentication, compatibility, endpoints and exact payload contracts remain **unknown**.
- Historical evidence retained alongside the fresh source read; matching bytes do not establish system identity.

Validated partial Surface preview (declared only; not runtime proof)
Harbor Archive — partial Surface
Components:
  urn:harbor:archive | Harbor Archive
  urn:harbor:intake-client | Unidentified intake caller
  urn:harbor:callback-receiver | Unresolved callback receiver
Declared connections:
Human decisions:
  urn:harbor:d:callback: deferred Optional callback: urn:harbor:archive → urn:harbor:callback-receiver — Human explicitly deferred the optional callback in the supplied 2026-11-05 note and reaffirmed retaining that decision in this request. No receiver selected.
Requirements:
Coverage:
  Fresh full-file inspection of harbor-api.md:1–17, fixture-1; historical evidence preserved separately.
  Two intake capabilities and one optional callback retained as research alternatives, not selected relationships.
  No deployment connections selected; component roles do not imply configured bindings.
  No AI connection established in inspected scope. No runtime requests performed.
Unknowns and gaps:
  Authentication and compatibility explicitly unknown.
  Intake route addresses, payload fields and limits unknown; caller and deployment endpoints unresolved.
  Callback remains human-deferred; payload and receiver unresolved.
  Repository revision, independent system identity, implementation, reachability and exercised behavior unavailable. Matching file bytes do not establish system identity.
Evidence:
  urn:harbor:f:identity: known — Interface-document identity only; no independent deployed-system identity established.; urn:harbor:source:current harbor-api.md:1–4
  urn:harbor:f:store: known — Supported capability, not a selected connection.; urn:harbor:source:current harbor-api.md:8–10
  urn:harbor:f:audit: known — Supported capability, not a selected connection.; urn:harbor:source:current harbor-api.md:8–10
  urn:harbor:f:callback: known — Human deferred selection; receiver remains unresolved.; urn:harbor:source:current harbor-api.md:14–16
  urn:harbor:f:authentication: unknown — Unspecified in harbor-api.md:8–10; retained unknown under the human's scope decision.;
  urn:harbor:f:compatibility: unknown — Receiver compatibility and any proposed integration remain unknown; lack of tested integration does not establish incompatibility.;
  urn:harbor:f:client: unknown — Unidentified caller role, not a selected client.;
  urn:harbor:f:receiver: unknown — Unresolved receiver role; callback deferred.;
  urn:harbor:f:contracts: unknown — Exact route addresses, payload fields and request limits remain unknown.;
  urn:harbor:f:runtime-evidence: known — Statement about supplied evidence, not proof of runtime absence.; urn:harbor:source:current harbor-api.md:15–16
Not saved. Enter /save surface to save exactly this preview.
You> /save surface

Saved and read back: <rehearsal>/vault/surfaces/harbor/surface-001/research.html
Saved and read back: <rehearsal>/vault/surfaces/harbor/surface-001/surface.json
You> /exit
````

## harbor-reopen

````text
Research source: <rehearsal>/harbor (directory)
Inspected source text and your messages will be sent to OpenAI through Codex using ChatGPT sign-in.
Source access is read-only. /save saves a Markdown note; /save surface saves a previewed HTML/JSON pair.
Saved pair: <rehearsal>/vault/surfaces/harbor/surface-001
Both saved artefacts and host evidence will be sent to OpenAI after confirmation.
Start research with OpenAI using Codex ChatGPT sign-in? [y/N] y

Connecting to Codex…

Connected: ChatGPT sign-in; model gpt-6-astra.
Researcher 0.1.8; sha256:8af29c3073df9b8210a7dd94ced9700379b0a98f76bd3a2902f9430b93c98a2a
Ask about your source or request a Surface preview. /save saves a note; /save surface saves the preview; /exit ends the chat; Ctrl-C cancels.

[reopen evidence] harbor-api.md: unchanged sha256:b2b87be7df05374c4cc574a1f308bd3b3444f63cd95e894121b9ea1e7be3d681

n8r-surface:research 0.1.8. I’ll recheck the selected source, preserve the prior claims and human decisions, and identify the next useful investigation. I won’t save.

[source_list] .

[source_read] harbor-api.md sha256:b2b87be7df05374c4cc574a1f308bd3b3444f63cd95e894121b9ea1e7be3d681

### Continued partial graph

These remain **documented capabilities, not selected connections**:

| Preserved connection ID | Direction and purpose | Fresh evidence |
|---|---|---|
| `urn:harbor:store-document` | `urn:harbor:intake-client` → `urn:harbor:archive`: document storage | `harbor-api.md:8–10` |
| `urn:harbor:append-audit-event` | Same caller → archive: audit-event intake | `harbor-api.md:8–10` |
| `urn:harbor:archival-callback` | Archive → `urn:harbor:callback-receiver`: optional archival notification; **human-deferred** | `harbor-api.md:14–16` |

### Source reconciliation

Freshly read all 17 lines of the selected source’s only listed file, with no reported exclusions or truncation. It identifies itself as **fictional interface notes, fixture-1** (`harbor-api.md:1–4`).

Its SHA-256 matches the supplied historical digest:
`b2b87be7df05374c4cc574a1f308bd3b3444f63cd95e894121b9ea1e7be3d681`.

No byte changes were found. This establishes document continuity—not independent system or deployment identity. Prior claims remain historical; the fresh read separately corroborates their documented capability basis. Implementation, repository revision and runtime evidence remain unavailable.

Component IDs and recorded human edits/decisions are retained: authentication and compatibility remain unknown; callback investigation remains deferred. No AI connection is established, and no selected relationships or exercised behavior are demonstrated (`harbor-api.md:3–4,15–16`).

### Next useful investigation

Obtain intake-contract documentation identifying route addresses, payload fields and limits. This would clarify both intake capabilities without reopening deferred callback work. Resume at `harbor-api.md:6–10`.

Can you supply an authorized intake contract for either route?

Nothing saved.

You> Which callback decision and authentication unknown did you retain? Do not save or prepare a new draft.

- **Callback decision:** `urn:harbor:d:callback` retains **deferred** for `urn:harbor:archival-callback`. No receiver is selected; the callback is neither selected nor permanently rejected, and callback investigation remains deferred.
- **Authentication unknown:** `urn:harbor:f:authentication`, concerning `urn:harbor:archive`, remains **unknown**. `harbor-api.md:8–10` does not specify authentication. That does **not** mean authentication is absent.

Nothing saved or newly drafted.

You> /exit
````
