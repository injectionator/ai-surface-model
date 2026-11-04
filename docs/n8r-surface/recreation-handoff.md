# From a Surface description to another user's Lab

**Status: proposed consumer contract, not an implemented Lab adapter.** A Surface
can supply a reusable structural description: component roles, connections,
interfaces, selected configuration, constraints and required bindings. A recipient
supplies their own resources, accounts and credentials. Successful research or
import does not establish that the recipient's setup works.

There is one AI Surface Model. A **Lab contains Experiments**; an **Experiment
owns its desired setup** and requests resource configuration directly from its
Lab. The Lab owns configuration authority and local bindings. See the
[concepts](../../spec/README.md) and [host contract](host-contract.md).

## What travels and what stays local

| Material | Portable content | Recipient responsibility |
| --- | --- | --- |
| Product guide | Applicable product/fork/revision, capability map, source navigation and gaps. | Check applicability; alternatives are not automatic selections. |
| Research | Evidence, scoped decisions, contradictions, coverage and lineage, where publication is permitted. | Preserve inherited evidence as inherited; recheck what the new task needs. |
| Selected definition | Exact revision, stable graph IDs, directed connections, interfaces, constraints and requirements. | Select or explicitly adapt the composition; preserve the original and record changes. |
| Recreation material | Versioned artifact/recipe references, prerequisites, clean-data initialization and supported checks. | Establish availability and adapter support before applying anything. |
| Local bindings | Requirement names can travel; secret values, original accounts, deployment addresses and resource identities do not. | Allocate local identities and resolve each requirement under the recipient Lab's authority. |
| Observations and Runs | Permitted historical evidence can travel with its original attribution. | Produce new effective-setup and Run evidence; source success is not recipient proof. |

Do not publish private research merely because a product guide would be useful.
A reusable guide can be derived from publishable product sources independently.
An unknown value stays unknown; a withheld value is redacted. Neither means absent.

## A concrete partial LibreChat composition

This table is a **synthetic planning example**, not a generated validated Surface
or a claim about a particular deployment. It describes requirements rather than
copying another user's bindings.

| Stable role | Connection or constraint to retain | Recipient input or unresolved decision |
| --- | --- | --- |
| Chat application | Identified LibreChat artifact/configuration revision; user request and response path. | Compatible artifact, host resources, private access and local application identity. |
| Account store | Selected local-account sign-in path and required authorization boundaries. | Fresh accounts and secrets; account policy; evidence of the selected path. |
| Conversation store | Application persistence through a compatible MongoDB connection. | Recipient database/resource, least required authority, private binding and clean-data policy. |
| Inference route | Application → any required connector/service → selected model; retain protocol and behavior constraints. | Identify the complete route, compatible service/model, local authorization and adapter. A product/subscription label alone is insufficient. |
| Optional RAG service | If selected, file-processing connection and required service interface. | Real endpoint, compatible service, authentication, embedding/index/storage choices and caller permissions. An example URL supplies none of these. |

The [controlled reconciliation trial](researcher-reconciliation-trial.md) changes
one RAG endpoint declaration. It cannot fill the rest of this table. Even a
nonempty URL leaves effective loading, overrides, authorization, reachability and
successful use unproved. Removing that declaration does not remove RAG from the
product's supported capabilities.

Shared services retain one resource identity with separate dependency edges.
A dependent Lab must not acquire lifecycle ownership merely by using a service.
Internal API roles need not become separate deployed processes. New recipient
instances get local identities linked to the reusable definition's stable roles.

## Proposed n8r-labs handoff

1. **Intake:** preserve the exact supplied bytes, format/version, revision and
   lineage. Identify whether the input is research, a selected definition or an
   observation. Reject unsupported interpretations; retain opaque material.
2. **Assess:** map supported meanings to the named consumer version. Report each
   requirement as satisfiable, unresolved, unsupported or deliberately adapted.
   Missing mandatory information blocks applying the affected setup, while the
   partial description remains useful for review.
3. **Bind:** the recipient chooses their own accounts, credential references,
   resource identities and compatible alternatives. Prepare an inspectable plan
   naming resources to reuse, create or configure and expected effects.
4. **Prepare:** the Experiment requests its exact saved setup revision from its
   Lab. The controller checks ownership, resource authority, concurrent work and
   revision freshness, then dispatches only supported adapter operations.
5. **Verify:** independently read back effective nonsecret configuration and
   attribute actual interactions to recipient resources and definition revision.
   Record failures and gaps without silently replacing the intended composition.

This is a requirements sequence, not a list of implemented commands. The
Researcher remains an investigator; imported prose and recipes do not grant
operational authority. No new runner, provisioning engine or credential-copying
mechanism is introduced here.

## Format and adapter decisions still needed

The current skill emits Markdown research. The separate experimental
[`n8r.surface/0.1` contract](contracts.md#selected-surface-definition) can express
selected graph nodes, declared relationships and secret/resource/configuration
requirements. Its validators check bounded structure and references, not source
truth or a consumer's understanding. Deployment bindings and Run formats are
outside that profile.

Before claiming n8r-labs support, identify the consumer revision and implement a
versioned mapping for the chosen vocabulary. Preserve unsupported nodes, edges,
attributes, requirements and evidence or report explicit losses. A consumer that
can retain JSON bytes or understand a narrow endpoint/model setting has not thereby
understood the full graph. Do not silently relabel one format as another.

Still required: shared vocabulary/profile selection; supported artifact and recipe
references; recipient binding and authority rules; configuration precedence;
missing-resource behavior; clean-data initialization; effective-setup readback;
and clear handling of substitutions. Existing helpers can satisfy individual
steps only after their actual scope is checked.

## Smallest meaningful consumer proof

For a named consumer build, begin with a permitted saved definition, an identified
recipient Lab/Experiment, suitable resources and the recipient's own authorization.
Record the exact user interaction and setup revision. Import/inspect must leave
resources unchanged, expose unsupported meanings and retain the source bytes.

Then resolve bindings and run the proposed preparation through the Lab. For the
selected chat path, obtain an actual response through the recipient application,
read back the saved conversation where persistence is required, and retain the
route, effective setup and result evidence. If RAG is selected, exercise a bounded
synthetic file-processing/retrieval case separately. Confirm the original setup
and evidence remain intact; clean up only trial-owned resources.

Wording, generated IDs and response text may vary. Wrong target attribution,
missing mandatory bindings, silent graph losses, copied source credentials or
claims based solely on successful parsing fail the proof. If prerequisites or
adapters are unavailable, record the exact blocked step. No such consumer trial
is claimed by this documentation increment.
