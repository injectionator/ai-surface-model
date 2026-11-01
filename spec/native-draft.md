# Experimental native exchange shape

The [basic LibreChat example](../examples/librechat/basic/README.md) uses
`format: "ai-surface-model"` and `formatVersion: "0.1-draft"` so experimental
consumers can identify a bounded input shape. This is a provisional exchange
contract, not a released schema or conformance standard. Earlier authentication
examples remain illustrative and do not declare this format.

| Field | Meaning |
| --- | --- |
| `surface` | Persistent source `id`, description `revision` label and `name`. |
| `coverage` | Selected `scope`, `completeness` (`partial` or `complete` within that scope), optional `unknown`, `omitted`, `redacted`, `outOfScope` and `notConfigured` string lists. Completeness is an author's declaration. |
| `components` | Identified parts, each with `id`, open-vocabulary `kind`, `name`, optional `version`, `configuration` and requirement references. |
| `relationships` | Identified directed connections: `id`, `from`, `to`, open-vocabulary `kind` and `basis` describing the declaration's origin. |
| `requirements` | Identified `secret`, `artifact` or `access` requirements, each with a description, never a credential value. |
| `recreation` | Status (`incomplete` or `specified`) and a `missing` list. Specified means the author supplied instructions, not that recreation succeeded. |

Version knowledge uses `status: "known"` with a string `value`, or `unknown`,
`omitted`, `redacted`, `absent` or `out-of-scope` with an optional `reason`.
Configuration uses the same statuses plus `partial`, optional scalar-valued
`settings`, optional `unknown` detail strings and an optional `reason`.
A missing property remains unspecified; a consumer must not fill it with a
product default or assume absence. Configuration settings are descriptive data.

Identifiers are nonempty strings, unique across the definition's Surface,
components, relationships and requirements. Relationship endpoints resolve to
components; component requirement references resolve to requirements. Shared
dependencies and cycles are allowed, with no fixed depth limit.

## Consumer behavior

Experimental consumers should identify their accepted format version and limits,
reject unsupported fields rather than discard them, and retain the complete
accepted source. A future format change requires an explicit migration or reader
update. Neither parser acceptance nor a round trip establishes fitness for a task.

Keep source Surface and component identities distinct from recipient-local import
and resource identities. Importing the same reference into two Labs does not give
them shared deployment identity or evidence. Bindings refer to source component
IDs but remain separate local records; stale or missing resources remain unresolved.

An exact-byte fingerprint can identify the input a consumer read. This draft does
not define canonicalization or a universal revision digest. Sources and their
claimed revisions are provenance declarations until independently verified.

Import is data handling. It does not fetch references, execute configuration,
authenticate, provision or apply anything. Observations, local bindings, credentials
and Runs remain outside the definition, following the [draft concepts](README.md).
