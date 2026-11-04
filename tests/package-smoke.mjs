// Copied into a temporary consumer directory; no checkout-relative imports.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {readResearchHtml, decode, encode, verifyReferences, verifySuccessor} from 'n8r-surface';
const asset = name => readFileSync(new URL(import.meta.resolve(`n8r-surface/examples/${name}`)), 'utf8');
const lumen = readResearchHtml(asset('lumen-r2.research.html'));
const harbor = readResearchHtml(asset('harbor-r2.research.html'));
const surface = decode(asset('composed.surface.json'), 'json');
assert.equal(surface.nodes.length, 4);
assert.equal(surface.relationships.length, 6);
verifyReferences(surface, [lumen, harbor]);
verifySuccessor(readResearchHtml(asset('lumen-r1.research.html')), lumen);
assert.deepEqual(decode(encode(surface, 'yaml'), 'yaml'), surface);
assert.throws(() => readResearchHtml(asset('lumen-manual-edit.pending.html')), /conflict/);
assert.ok(readFileSync(new URL(import.meta.resolve('n8r-surface/contracts/contracts.md')), 'utf8').includes('n8r.research/0.1'));
// Exercise the public consumer boundary; reject before inherited hooks run.
let serializationCalls = 0;
class LossyArray extends Array {
  toJSON() { serializationCalls++; return ['replacement']; }
}
const imported = structuredClone(lumen);
imported.extensions['urn:ext:array-boundary'] = new LossyArray('original');
for (const format of ['json', 'yaml']) {
  assert.throws(() => encode(imported, format), /plain array/);
  assert.equal(serializationCalls, 0);
  assert.equal(imported.extensions['urn:ext:array-boundary'][0], 'original');
}
console.log(`Installed package passed on Node ${process.version}; 4 nodes, 6 relationships, exact research references.`);
