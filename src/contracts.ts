/** Experimental 0.1 contracts, not a universal AI Surface Model schema. */
export type Value = null | boolean | number | string | Value[] | {[key: string]: Value};
export type State = 'known' | 'unknown' | 'omitted' | 'redacted' | 'absent' | 'out-of-scope';
export interface RevisionRef { id: string; revision: string; digest: string }
export interface Revision {
  id: string; parent: RevisionRef | null; createdAt: string; author: string; reason: string;
}
export interface Envelope {
  id: string; title: string; revision: Revision; scope: string; extensions: {[namespace: string]: Value};
}
export interface Source {
  id: string; location: string; version: string; digest: string; inspectedAt: string;
  coverage: {path: string; status: 'inspected' | 'missing' | 'unreadable' | 'excluded' | 'truncated' | 'unsupported'; note: string}[];
}
export interface Finding {
  id: string; subject: string; property: string; state: State | 'conflicting'; note: string;
  claims: {value: Value; evidence: {source: string; locator: string}[]}[];
}
export interface ResearchRecord extends Envelope {
  contract: 'n8r.research/0.1'; sources: Source[]; findings: Finding[];
  alternatives: {id: string; title: string; findings: string[]; requirements: string[]}[];
  decisions: {id: string; alternative: string; choice: 'selected' | 'rejected' | 'deferred'; reason: string; by: string; at: string}[];
  questions: {id: string; text: string; findings: string[]}[];
  notes: {by: string; at: string; text: string}[];
}
export interface Fact { state: State; value?: Value; note: string }
export interface Basis { record: string; revision: string; items: string[] }
export interface Entity {
  id: string; type: {vocabulary: string; term: string};
  attributes: {[property: string]: Fact}; basis: Basis[]; requirements: string[];
}
export interface SurfaceDefinition extends Envelope {
  contract: 'n8r.surface/0.1'; kind: 'definition'; records: RevisionRef[];
  vocabularies: {id: string; version: string}[];
  nodes: (Entity & {label: string})[];
  relationships: (Entity & {from: string; to: string; claim: 'declared'})[];
  requirements: {id: string; kind: 'secret' | 'resource' | 'configuration'; description: string; state: State}[];
  coverage: string[]; gaps: string[];
}
export type Artefact = ResearchRecord | SurfaceDefinition;
