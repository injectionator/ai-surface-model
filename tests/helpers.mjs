export const record = () => ({
  contract: 'n8r.research/0.1', id: 'urn:record:one', title: 'Synthetic product',
  revision: {id: 'r1', parent: null, createdAt: '2026-11-04T00:00:00Z', author: 'Synthetic researcher', reason: 'Initial inspection'},
  scope: 'Supplied document only; no runtime inspection.', extensions: {},
  sources: [{id: 'urn:source:one', location: 'sources/one.md', version: 'fixture-1', digest: `sha256:${'a'.repeat(64)}`, inspectedAt: '2026-11-04T00:00:00Z', coverage: [{path: 'one.md', status: 'inspected', note: 'Entire supplied document'}]}],
  findings: [{id: 'urn:finding:one', subject: 'urn:component:app', property: 'authentication', state: 'known', note: 'Documented possibility only', claims: [{value: 'OIDC', evidence: [{source: 'urn:source:one', locator: 'Authentication'}]}]}],
  alternatives: [{id: 'urn:option:one', title: 'Use OIDC', findings: ['urn:finding:one'], requirements: ['Supply identity service']}],
  decisions: [{id: 'urn:decision:one', alternative: 'urn:option:one', choice: 'selected', reason: 'Synthetic user choice', by: 'Synthetic author', at: '2026-11-04T00:00:00Z'}],
  questions: [{id: 'urn:question:one', text: 'Which version?', findings: ['urn:finding:one']}],
  notes: [{by: 'Synthetic author', at: '2026-11-04T00:00:00Z', text: 'Incomplete and useful.'}]
});
export const surface = () => ({
  contract: 'n8r.surface/0.1', id: 'urn:surface:one', title: 'Selected example',
  revision: {id: 'r1', parent: null, createdAt: '2026-11-04T00:00:00Z', author: 'Synthetic author', reason: 'Select composition'},
  scope: 'Definition only', extensions: {}, kind: 'definition', records: [],
  vocabularies: [{id: 'urn:vocab:example', version: '0.1'}],
  nodes: [
    {id: 'urn:node:app', type: {vocabulary: 'urn:vocab:example', term: 'application'}, label: 'App', attributes: {version: {state: 'unknown', note: 'Not inspected'}}, basis: [], requirements: []},
    {id: 'urn:node:shared', type: {vocabulary: 'urn:vocab:example', term: 'service'}, label: 'Shared', attributes: {}, basis: [], requirements: []}
  ],
  relationships: [
    {id: 'urn:edge:one', from: 'urn:node:app', to: 'urn:node:shared', type: {vocabulary: 'urn:vocab:example', term: 'uses'}, claim: 'declared', attributes: {protocol: {state: 'known', value: 'OIDC', note: 'Selected'}}, basis: [], requirements: ['urn:requirement:secret']},
    {id: 'urn:edge:two', from: 'urn:node:app', to: 'urn:node:shared', type: {vocabulary: 'urn:vocab:example', term: 'uses'}, claim: 'declared', attributes: {}, basis: [], requirements: []},
    {id: 'urn:edge:cycle', from: 'urn:node:shared', to: 'urn:node:app', type: {vocabulary: 'urn:vocab:example', term: 'calls'}, claim: 'declared', attributes: {}, basis: [], requirements: []}
  ],
  requirements: [{id: 'urn:requirement:secret', kind: 'secret', description: 'Supply locally', state: 'unknown'}],
  coverage: ['Two components described'], gaps: ['No effective setup evidence']
});
