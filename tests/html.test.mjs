import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readResearchHtml, renderResearchHtml, digest, verifySuccessor} from '../dist/index.js';
import {record, surface} from './helpers.mjs';
function successor(before) {
  const after = structuredClone(before);
  after.revision = {...before.revision, id: 'r2', parent: {id: before.id, revision: before.revision.id, digest: digest(before)}, reason: 'Reviewed correction'};
  return after;
}
test('HTML keeps source markup inert and round trips all authoritative data', () => {
  const input = record(); input.title = '<img src=x onerror=alert(1)>';
  input.notes[0].text = '</script><script>alert(1)</script> & < > "';
  input.extensions['urn:ext:x'] = {'note': 'unknown <markup>'};
  const html = renderResearchHtml(input);
  assert.deepEqual(readResearchHtml(html), input);
  assert.ok(html.includes('&lt;img src=x onerror=alert(1)&gt;'));
  assert.ok(!html.includes('<img'));
  assert.equal((html.match(/<script/g) || []).length, 1);
  assert.ok(!html.includes('</script><script>'));
});
test('manual visible, data-only and wrapper edits are conflicts, never silently repaired', () => {
  const html = renderResearchHtml(record());
  for (const edit of [html.replace('<h1>Synthetic product', '<h1>Human correction'),
    html.replace('"title": "Synthetic product"', '"title": "Changed embedded data"'),
    html.replace('</body>', '<script>alert(1)</script></body>'), html + '\n',
    html.replace('id="n8r-record"', 'id="another-record"')]) {
    assert.throws(() => readResearchHtml(edit));
  }
  assert.throws(() => renderResearchHtml(surface()));
});
test('successor pins original revision and refuses overwritten identity or lineage', () => {
  const before = record(), after = successor(before); after.notes[0].text = 'Human correction';
  assert.doesNotThrow(() => verifySuccessor(before, after));
  assert.deepEqual(readResearchHtml(renderResearchHtml(after)), after);
  for (const change of [x => x.revision.id = before.revision.id, x => x.id = 'urn:record:other',
    x => x.revision.parent.digest = `sha256:${'b'.repeat(64)}`, x => x.revision.parent = null,
    x => x.contract = 'n8r.surface/0.1']) {
    const changed = structuredClone(after); change(changed);
    assert.throws(() => verifySuccessor(before, changed));
  }
  assert.equal(before.notes[0].text, 'Incomplete and useful.');
});
test('retained edge identity cannot be retargeted while component detail can grow', () => {
  const before = surface(), after = successor(before);
  after.nodes[0].attributes.version = {state: 'known', value: 'fixture-2', note: 'New evidence'};
  assert.doesNotThrow(() => verifySuccessor(before, after));
  after.relationships[0].to = 'urn:node:app';
  assert.throws(() => verifySuccessor(before, after), /relationship/);
});
