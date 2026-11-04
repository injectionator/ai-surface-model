import type {Artefact, ResearchRecord, SurfaceDefinition} from './contracts.js';
import {canonical, digest, fail, portable} from './portable.js';
type Check = (v: unknown, p: string) => void;
const text: Check = (v, p) => { if (typeof v !== 'string' || !v.trim()) fail(p, 'requires nonempty string'); };
const match = (pattern: RegExp, label: string): Check => (v, p) => { text(v, p); if (!pattern.test(v as string)) fail(p, label); };
const id = match(/^[a-z][a-z0-9+.-]*:[^\s]+$/i, 'requires namespaced identifier');
const token = match(/^[A-Za-z0-9][A-Za-z0-9._-]*$/, 'requires revision/version token');
const hash = match(/^sha256:[a-f0-9]{64}$/, 'requires SHA-256 digest');
const time: Check = (v, p) => {
  text(v, p);
  if (!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/.test(v as string) || !Number.isFinite(Date.parse(v as string)) || new Date(v as string).toISOString() !== (v as string).replace('Z', '.000Z')) fail(p, 'requires real UTC timestamp with seconds');
};
const oneOf = (...values: string[]): Check => (v, p) => { if (!values.includes(v as string)) fail(p, `expected ${values.join('|')}`); };
const array = (check: Check, min = 0): Check => (v, p) => {
  if (!Array.isArray(v) || v.length < min) fail(p, `requires array with at least ${min} entries`);
  v.forEach((x, i) => check(x, `${p}[${i}]`));
};
function object(v: unknown, p: string): Record<string, unknown> {
  if (v === null || typeof v !== 'object' || Array.isArray(v)) fail(p, 'requires object');
  return v as Record<string, unknown>;
}
const shape = (required: Record<string, Check>, optional: Record<string, Check> = {}): Check => (v, p) => {
  const data = object(v, p);
  for (const [key, check] of Object.entries(required)) {
    if (!Object.hasOwn(data, key)) fail(`${p}.${key}`, 'required');
    check(data[key], `${p}.${key}`);
  }
  for (const key of Object.keys(data)) {
    if (Object.hasOwn(required, key)) continue;
    if (!Object.hasOwn(optional, key)) fail(`${p}.${key}`, 'unsupported field; preserve additions in extensions');
    optional[key]!(data[key], `${p}.${key}`);
  }
};
const dictionary = (keyCheck: Check, valueCheck: Check): Check => (v, p) => {
  for (const [k, value] of Object.entries(object(v, p))) { keyCheck(k, `${p} key`); valueCheck(value, `${p}.${k}`); }
};
const value: Check = (v, p) => portable(v, p);
const state = oneOf('known', 'unknown', 'omitted', 'redacted', 'absent', 'out-of-scope');
const ref = shape({id, revision: token, digest: hash});
const revision = shape({id: token, parent: (v, p) => { if (v !== null) ref(v, p); }, createdAt: time, author: text, reason: text});
const common = {id, title: text, revision, scope: text, extensions: dictionary(id, value)};
const evidence = shape({source: id, locator: text});
const location: Check = (v, p) => {
  text(v, p); const s = v as string;
  if (/^https?:\/\//.test(s)) {
    const url = new URL(s); if (url.username || url.password) fail(p, 'credentials in source URL'); return;
  }
  if (s.startsWith('urn:')) { id(v, p); return; }
  if (s.startsWith('/') || /[\\:?#%]/.test(s) || s.split('/').some(part => !part || part === '.' || part === '..')) fail(p, 'requires portable relative path or http(s)/urn reference');
};
const finding: Check = (v, p) => {
  shape({id, subject: id, property: text, state: oneOf('known', 'unknown', 'omitted', 'redacted', 'absent', 'out-of-scope', 'conflicting'), note: text,
    claims: array(shape({value, evidence: array(evidence, 1)}))})(v, p);
  const f = v as ResearchRecord['findings'][number];
  const distinct = new Set(f.claims.map(c => canonical(c.value))).size;
  if ((f.state === 'known' || f.state === 'absent') && distinct !== 1) fail(p, 'known/absent requires one agreed claim value');
  if (f.state === 'conflicting' && distinct < 2) fail(p, 'conflicting requires differing sourced claims');
  if (['unknown', 'omitted', 'redacted', 'out-of-scope'].includes(f.state) && f.claims.length) fail(p, 'non-value state must not carry claims');
};
const research = shape({
  ...common, contract: oneOf('n8r.research/0.1'),
  sources: array(shape({id, location, version: text, digest: hash, inspectedAt: time,
    coverage: array(shape({path: text, status: oneOf('inspected', 'missing', 'unreadable', 'excluded', 'truncated', 'unsupported'), note: text}), 1)})),
  findings: array(finding),
  alternatives: array(shape({id, title: text, findings: array(id), requirements: array(text)})),
  decisions: array(shape({id, alternative: id, choice: oneOf('selected', 'rejected', 'deferred'), reason: text, by: text, at: time})),
  questions: array(shape({id, text, findings: array(id)})),
  notes: array(shape({by: text, at: time, text}))
});
const fact: Check = (v, p) => {
  shape({state, note: text}, {value})(v, p);
  const f = object(v, p);
  if ((f.state === 'known') !== Object.hasOwn(f, 'value')) fail(p, 'only known facts require a value');
};
const entity = {id, type: shape({vocabulary: id, term: text}), attributes: dictionary(text, fact),
  basis: array(shape({record: id, revision: token, items: array(id, 1)})), requirements: array(id)};
const surface = shape({
  ...common, contract: oneOf('n8r.surface/0.1'), kind: oneOf('definition'), records: array(ref),
  vocabularies: array(shape({id, version: token})),
  nodes: array(shape({...entity, label: text})),
  relationships: array(shape({...entity, from: id, to: id, claim: oneOf('declared')})),
  requirements: array(shape({id, kind: oneOf('secret', 'resource', 'configuration'), description: text, state})),
  coverage: array(text), gaps: array(text)
});
function unique(ids: string[], p: string): Set<string> {
  if (new Set(ids).size !== ids.length) fail(p, 'duplicate identity/reference');
  return new Set(ids);
}
function references(ids: string[], available: Set<string>, p: string): void {
  unique(ids, p);
  for (const item of ids) if (!available.has(item)) fail(p, `unresolved reference ${item}`);
}
export function validateArtefact(input: unknown): Artefact {
  canonical(input); // checks portable values, depth and logical size before field access
  const data = object(input, '$');
  if (data.contract === 'n8r.research/0.1') {
    research(input, '$'); const r = input as ResearchRecord;
    unique([r.id, ...r.sources.map(x => x.id), ...r.findings.map(x => x.id), ...r.alternatives.map(x => x.id), ...r.decisions.map(x => x.id), ...r.questions.map(x => x.id)], '$');
    const sources = new Set(r.sources.map(x => x.id)), findings = new Set(r.findings.map(x => x.id)), alternatives = new Set(r.alternatives.map(x => x.id));
    for (const f of r.findings) for (const c of f.claims) for (const e of c.evidence) references([e.source], sources, f.id);
    for (const a of [...r.alternatives, ...r.questions]) references(a.findings, findings, a.id);
    for (const d of r.decisions) references([d.alternative], alternatives, d.id);
    unique(r.decisions.map(d => d.alternative), '$.decisions'); // one current decision per option; old decisions stay in prior revisions
  } else if (data.contract === 'n8r.surface/0.1') {
    surface(input, '$'); const s = input as SurfaceDefinition;
    unique([s.id, ...s.nodes.map(x => x.id), ...s.relationships.map(x => x.id), ...s.requirements.map(x => x.id)], '$');
    const nodes = new Set(s.nodes.map(x => x.id)), vocab = unique(s.vocabularies.map(x => x.id), '$.vocabularies');
    const requirements = new Set(s.requirements.map(x => x.id));
    const records = unique(s.records.map(x => JSON.stringify([x.id, x.revision])), '$.records');
    for (const e of [...s.nodes, ...s.relationships]) {
      references([e.type.vocabulary], vocab, e.id);
      references(e.requirements, requirements, e.id);
      for (const b of e.basis) {
        references([JSON.stringify([b.record, b.revision])], records, e.id);
        unique(b.items, e.id);
      }
    }
    for (const e of s.relationships) {
      references([e.from], nodes, e.id); references([e.to], nodes, e.id);
    }
  } else fail('$.contract', 'unsupported contract/version');
  const a = input as Artefact;
  if (a.revision.parent && (a.revision.parent.id !== a.id || a.revision.parent.revision === a.revision.id)) fail('$.revision.parent', 'requires earlier revision of the same artefact');
  return a;
}
/** Explicit offline bundle verification. Missing external context is an error here. */
export function verifyReferences(input: unknown, context: unknown[]): void {
  const a = validateArtefact(input);
  const records = context.map(validateArtefact);
  unique(records.map(r => JSON.stringify([r.id, r.revision.id])), '$context');
  if (a.contract !== 'n8r.surface/0.1') return;
  for (const ref of a.records) {
    const r = records.find(x => x.id === ref.id && x.revision.id === ref.revision);
    if (!r || r.contract !== 'n8r.research/0.1') fail(ref.id, 'research revision unavailable');
    if (digest(r) !== ref.digest) fail(ref.id, 'research digest mismatch');
    const items = new Set([...r.findings, ...r.alternatives, ...r.decisions, ...r.questions].map(x => x.id));
    for (const e of [...a.nodes, ...a.relationships]) for (const b of e.basis) {
      if (b.record === ref.id && b.revision === ref.revision) references(b.items, items, e.id);
    }
  }
}
