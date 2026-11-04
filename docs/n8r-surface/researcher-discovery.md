# Researching an AI Surface graph

The graph is the primary result: AI-relevant components, connections, evidence
and gaps. Inspect configuration to establish or explain those connections,
not to inventory every setting in an application. The shared
[skill discovery guide](../../plugins/n8r-surface/skills/research/references/discovery-map.md)
contains the navigation rules and product-knowledge approach.

Use the [short installation and first-trial route](researcher-skill.md#research-01-investigate-and-continue).
These instructions describe candidate 0.1.5; see the
[verification record](researcher-skill-verification.md) for exercised paths and
unverified live inspection. No Lab or new runner is required.

The [controlled LibreChat trial](researcher-reconciliation-trial.md) supplies a
repeatable baseline/change/readback check. The [recreation handoff](recreation-handoff.md)
explains how a selected description can guide recipient-owned Lab setup and what
still needs consumer verification.

## Three related views

There is one AI Surface Model. The Researcher distinguishes three useful views
of a system rather than treating every discovered possibility as a running edge:

| View | Question | Typical evidence |
| --- | --- | --- |
| Possible connections | What can this product/version support, and where should we look? | Product guide, applicable docs and implementation evidence; alternatives remain alternatives. |
| Declared setup | Which components/connections does this particular composition select? | Identified repository/build/configuration, intended choices and a selected Surface definition. |
| Observed running graph | Which instances and connections are actually configured/enabled here? | Dated deployment binding and applicable effective settings/observations; stored settings alone have a narrower meaning. |

For a synthetic example, a product supports 50 possibilities, a setup selects 25,
and a running deployment enables 10. The repository may still contain the code for
all 50; configuration selection is distinct from implementation support. Which
of the enabled connections were actually exercised needs its own evidence.
Do not turn an enablement read into a successful connection or usage claim.

The generic discovery guide is broader than any product: it supplies questions
and navigation, not a giant selected Surface containing every possible edge.
Reusable product knowledge narrows it to applicable capabilities. A selected
definition describes a composition; deployment observations remain linked,
dated evidence and do not rewrite that definition. These views often narrow the
possibilities, but plugins, external configuration or services may also introduce
connections outside the supplied checkout. This is not guaranteed set inheritance.

Component identity and evidence connect the views. The model's existing
[definition/observation distinction](../../spec/README.md#configuration-and-evidence)
continues to apply; no new schema or hierarchy is introduced here.

## Graph discovery, reconciliation and live evidence

Use the same installation and notes convention. These are conversational intents,
not new CLI commands. The skill supplies instructions; each host supplies actual
file, web, API and computer access. A missing capability remains a visible gap.

**DISCOVER-01: start with the available material.** In a local chat with a selected
source folder (or supplied docs), select the skill and ask:

> Map the AI-relevant components and connections in these sources. Reuse any
> applicable guides, research or Surface definitions I supplied. Start with a
> shallow graph and follow its useful gaps. Include configuration only when it
> explains the graph. Save working notes and show me the result.

Expect a graph or edge table, scope/revision, source references, separate supported
alternatives and selected connections, and missing evidence. Code-only, docs-only,
prior-model-only and mixed inputs are valid starts. A bounded finding of no AI
relevance is valid; inventing an AI node or treating a package list as the Surface
is a failure. Open the note and follow a representative edge's source reference.

**RECONCILE-01: compare a supplied Surface.** Provide the prior JSON/notes and the
current identified sources, then ask:

> Compare this Surface with the current sources. Preserve the original. For its
> AI-relevant nodes and connections, show supported agreements, differences,
> additional discoveries and unknowns with evidence. Separate capabilities,
> intended setup, declared settings and runtime observations. Save the comparison.

Expect claim-by-claim research, including unsupported format/vocabulary meanings,
without a silent rewrite or universal validation claim. For example, code that
supports OIDC does not prove it is enabled; a current staging file declaring it
disabled is not evidence that a live process loaded it. Missing model fields do
not mean absent capabilities. Open the comparison and confirm the original bytes
are unchanged. Validated generated Surface JSON remains outside this increment.

**LIVE-01: inspect an available admin page/API.** Prerequisites: a user-selected
test environment and admin location, an appropriate account, supported host tools
and permitted read access. Use the host's supported sign-in handoff if required;
enter credentials directly there, not in chat. Then ask:

> Inspect the selected environment's identity settings read-only. Establish
> whether OIDC is enabled and which identity service it connects to. Record
> nonsecret evidence for that graph edge; do not reveal credentials, change
> settings or test the connection. Save a dated observation in my working notes.

Expect the actual environment, time, page/section or API operation, nonsecret
enablement and target where visible, and explicit unknowns elsewhere. Read the
relevant view/fields again to verify the observation and open the saved note.
Distinguish stored settings from runtime-effective settings. Do not treat masked
credentials as valid credentials or a settings read as successful OIDC login.
No product is assumed to expose all settings in an admin UI. A missing tool,
blocked route or unavailable field is a blocker/limit, not permission to bypass
access or an assertion that the connection is disabled.

For these chat interactions there is no process exit code. Success is the
specified visible result plus saved-byte readback; wording and identities vary.
No target settings should change. Keep notes; no target cleanup is expected.
Inspect only graph-relevant fields, avoiding secret reveals, raw config exports
and screenshots containing credentials. Real admin UI/API acceptance must be
recorded separately from synthetic cases or source-only trials.

ChatGPT Work access depends on the actual browser/session and account permissions;
it does not inherit all sign-ins automatically. See the official
[Work browser/session boundaries](https://learn.chatgpt.com/docs/enterprise/chatgpt-work-local-security#browser-sessions-and-existing-sign-ins),
reviewed 4 November 2026. The skill cannot grant or broaden host access.
