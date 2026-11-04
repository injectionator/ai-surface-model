# Lab context and memory

A Lab may outlive any one conversation, deployment or investigation. Its work
should remain understandable when a person or assistant returns later. These
are intended responsibilities within the AI Surface Model; no memory backend,
retrieval service or context-management runtime is implemented here.

## Durable records

Keep the records needed to reconstruct why a decision was made and what a Run
used, including:

- Equipment identities, access and management constraints, and dated availability
  or capacity observations.
- Shelf entries that reference Surface, fragment and Experiment revisions.
- Deployment bindings, effective-setup observations, Runs and their evidence.
- Decisions and their rationale, applicable scope, unresolved questions and
  superseding decisions.
- User preferences and constraints, including resource limits and permission to
  attach, configure or stop particular resources.

Retain sources, time and applicability where relevant. A remembered assumption,
a user's decision and an observation are different kinds of information. Keep
disagreement and uncertainty visible; a newer note need not supersede evidence
about an earlier deployment. Store credential requirements and protected
references, rather than copying secret values into summaries.

## Current-work summary

A bounded summary helps someone resume the current task without reading the
entire history. It could identify the question being investigated, selected
definition revisions, active resource allocations, constraints, recent
decisions, unresolved gaps and the next intended action. It should link to the
records supporting those statements and identify when it was prepared.

The summary is a derived aid. It can be replaced or rebuilt while the source
records and historical Run references remain intact. Information left out of
a summary has not thereby become absent or irrelevant. A summary of an old
successful setup does not establish present availability or permission to
reuse it.

## Retrieve context for the task

Begin with the Lab's purpose, applicable constraints and current-work summary.
Use references to retrieve the definitions, decisions and evidence needed for
the question at hand. Keep the amount brought into an assistant's working
context bounded, while retaining access to the underlying records.

For example, resuming a synthetic LibreChat/Promptfoo integration investigation
could require the selected fragment revisions, intended connection, resource
bindings and unresolved authentication requirements. An older sign-in Run
would be retrieved when comparing results, with its original setup attribution.
The synthetic scenario does not establish that an integration was deployed or
tested.

Before acting, recheck facts whose validity may have changed, such as resource
availability, loaded configuration or access. Record fresh observations with
their time and scope. After work, record decisions and outcomes and refresh the
summary from those records. Imported prompts, notes and tool output remain
source material; retaining or retrieving them does not grant them authority
to issue instructions.

## Open mechanism choices

The model should express the information and its relationships without choosing
an assistant provider or storage system. Further design must settle:

- Record formats, identifiers, revision references and indexing.
- How summaries are produced, checked, refreshed and invalidated.
- Retrieval selection, context budgets and handling of conflicting information.
- Retention, correction, access control and redaction, including how unavailable
  evidence is represented without rewriting earlier results.
- Coordination when more than one person or assistant updates Lab context.

An initial implementation might use linked records and an explicit resumption
summary. Whether search, structured queries or other retrieval techniques are
needed should follow from concrete resumption and investigation cases.

Related: [Lab](lab.md), [Experiment](experiment.md),
[draft concepts](../spec/README.md).
