import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {readResearchHtml, decode, verifySuccessor, verifyReferences, digest} from '../dist/index.js';
const root = new URL('../examples/researcher/', import.meta.url);
const read = name => readFileSync(new URL(name, root), 'utf8');
const record = name => readResearchHtml(read(name));

test('both products have inspectable source snapshots and retained uncertainty', () => {
  const records = ['lumen-r1.research.html', 'lumen-r2.research.html', 'harbor-r1.research.html', 'harbor-r2.research.html'].map(record);
  for (const r of records) for (const source of r.sources) {
    assert.equal(source.digest, `sha256:${createHash('sha256').update(read(source.location)).digest('hex')}`);
  }
  assert.deepEqual(records[0].findings.find(x => x.property === 'batchLimit').claims.map(c => c.value), [10, 25]);
  assert.equal(records[0].findings.find(x => x.property === 'batchLimit').state, 'conflicting');
  assert.equal(records[0].findings.find(x => x.property === 'modelVersion').state, 'unknown');
  assert.equal(records[2].findings.find(x => x.property === 'authentication').state, 'unknown');
});
test('manual edit is rejected until reviewed into a new immutable revision', () => {
  const first = record('lumen-r1.research.html'), corrected = record('lumen-r2.research.html');
  assert.throws(() => record('lumen-manual-edit.pending.html'), /conflict/);
  verifySuccessor(first, corrected);
  assert.equal(corrected.id, first.id);
  assert.deepEqual(corrected.findings.map(x => x.id), first.findings.map(x => x.id));
  assert.equal(first.decisions.find(x => x.alternative.endsWith(':callback')).choice, 'deferred');
  assert.equal(corrected.decisions.find(x => x.alternative.endsWith(':callback')).choice, 'selected');
  assert.match(corrected.notes.at(-1).text, /synthetic user/);
  assert.notEqual(digest(first), digest(corrected));
});
test('continuation adds a second source without changing previously cited evidence', () => {
  const first = record('harbor-r1.research.html'), next = record('harbor-r2.research.html');
  verifySuccessor(first, next);
  assert.equal(first.sources.length, 1); assert.equal(next.sources.length, 2);
  assert.deepEqual(next.sources[0], first.sources[0]);
  const unknown = first.findings.find(x => x.property === 'authentication');
  const known = next.findings.find(x => x.id === unknown.id);
  assert.equal(unknown.state, 'unknown'); assert.equal(known.state, 'known');
  assert.equal(known.claims[0].value, 'OIDC bearer token');
});
test('selected composition preserves shared nodes, cycles, parallel edges and all gap states', () => {
  const json = decode(read('composed.surface.json'), 'json'), yaml = decode(read('composed.surface.yaml'), 'yaml');
  assert.deepEqual(yaml, json);
  verifyReferences(json, [record('lumen-r2.research.html'), record('harbor-r2.research.html')]);
  const parallel = json.relationships.filter(x => x.from === 'urn:component:lumen' && x.to === 'urn:component:harbor');
  assert.equal(parallel.length, 2); assert.notEqual(parallel[0].id, parallel[1].id);
  assert.ok(json.relationships.some(x => x.from === 'urn:component:harbor' && x.to === 'urn:component:lumen'));
  assert.equal(json.relationships.filter(x => x.to === 'urn:component:identity').length, 2);
  assert.deepEqual(new Set(json.nodes.flatMap(n => Object.values(n.attributes).map(x => x.state))), new Set(['known', 'unknown', 'omitted', 'redacted', 'absent', 'out-of-scope']));
  assert.ok(json.relationships.every(x => x.claim === 'declared'));
  assert.ok(json.gaps.some(x => /not tested/.test(x)));
});
