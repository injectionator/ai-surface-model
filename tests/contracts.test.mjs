import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validateArtefact, encode, decode, digest, verifyReferences} from '../dist/index.js';
import {record, surface} from './helpers.mjs';

test('partial records and shared cyclic multigraphs survive both codecs', () => {
  for (const input of [record(), surface()]) {
    input.extensions['https://example.test/extension/v1'] = {opaque: [null, true, 7, '7'], '__proto__': 'literal'};
    for (const format of ['json', 'yaml']) {
      assert.deepEqual(decode(encode(input, format), format), input);
    }
  }
});
test('minimal unknown research remains useful without inventing absence', () => {
  const input = record();
  input.sources = []; input.alternatives = []; input.decisions = []; input.questions = [];
  input.findings[0].claims = []; input.findings[0].state = 'unknown';
  assert.deepEqual(decode(encode(input, 'yaml'), 'yaml'), input);
});
test('rejects unsupported versions, unknown core fields and wrong shapes', () => {
  for (const change of [x => x.contract = 'n8r.research/9', x => x.typo = true,
    x => x.revision.createdAt = 'yesterday', x => x.revision.createdAt = '2026-02-30T00:00:00Z',
    x => x.findings[0].claims = {}, x => x.sources[0].digest = 'not-a-digest',
    x => x.findings[0].state = 'certain', x => x.findings[0].claims = [],
    x => x.extensions = [], x => x.extensions['unnamespaced'] = true]) {
    const input = record(); change(input); assert.throws(() => validateArtefact(input));
  }
});
test('rejects ambiguous identity and dangling local references', () => {
  for (const change of [x => x.findings.push(x.findings[0]),
    x => x.findings[0].claims[0].evidence[0].source = 'urn:missing:source',
    x => x.alternatives[0].findings = ['urn:missing:finding'],
    x => x.decisions[0].alternative = 'urn:missing:alternative',
    x => x.questions[0].findings = ['urn:missing:finding']]) {
    const input = record(); change(input); assert.throws(() => validateArtefact(input));
  }
  for (const change of [x => x.nodes.push(x.nodes[0]), x => x.relationships[0].to = 'urn:missing:node',
    x => x.relationships[0].requirements = ['urn:missing:secret'],
    x => x.nodes[0].type.vocabulary = 'urn:missing:vocabulary',
    x => x.relationships[0].claim = 'exercised',
    x => x.nodes[0].attributes.version.value = 'should-not-be-known']) {
    const input = surface(); change(input); assert.throws(() => validateArtefact(input));
  }
});
test('JSON rejects duplicates and unsupported number lexemes before precision loss', () => {
  const json = JSON.stringify(record());
  for (const text of [json.replace('"title":', '"title":"first","title":'),
    json.replace('"extensions":{}', '"extensions":{"urn:ext:x":9007199254740993}'),
    json.replace('"extensions":{}', '"extensions":{"urn:ext:x":1.000000000000000001}'),
    json.replace('"extensions":{}', '"extensions":{"urn:ext:x":-0}'),
    json.replace('"extensions":{}', '"extensions":{"urn:ext:x":1e3}')]) {
    assert.throws(() => decode(text, 'json'));
  }
});
test('YAML rejects aliases, tags, duplicate/nonstring keys, directives and documents', () => {
  const base = JSON.stringify(record());
  for (const text of ['a: &a [*a]', 'a: !!str 1', 'a: !custom value', 'a: 1\na: 2',
    '1: value', '? [a, b]\n: value', '%YAML 1.1\n---\n' + base,
    base + '\n---\n' + base, 'x: .nan', 'x: .inf', 'x: 0x10', 'x: 1.0', 'x: 01']) {
    assert.throws(() => decode(text, 'yaml'));
  }
});
test('portable values reject JS values that serializers silently lose', () => {
  const cycle = {}; cycle.self = cycle;
  const sparse = []; sparse.length = 1;
  const extra = []; extra.extra = 'lost';
  const accessor = Object.defineProperty({}, 'secret', {enumerable: true, get() { throw Error('getter executed'); }});
  for (const value of [undefined, NaN, Infinity, -0, 1.5, 9007199254740992, 1n,
    new Date(), new Map(), cycle, sparse, extra, accessor, {x: undefined}, {[Symbol('x')]: 'lost'}, '\ud800']) {
    const input = record(); input.extensions['urn:ext:x'] = value;
    assert.throws(() => encode(input, 'json'));
  }
});
test('canonical digest ignores object key order but binds extensions and array order', () => {
  assert.equal(digest({b: 2, a: 1}), 'sha256:43258cff783fe7036d8a43033f830adfc60ec037382473548ac742b888292777');
  assert.equal(digest({a: 1, b: 2}), digest({b: 2, a: 1}));
  assert.notEqual(digest([1, 2]), digest([2, 1]));
  const input = record(), before = digest(input);
  input.extensions['urn:ext:x'] = true; assert.notEqual(digest(input), before);
});
test('external references require exact research revisions, digests and finding IDs', () => {
  const r = record(), s = surface();
  s.records = [{id: r.id, revision: r.revision.id, digest: digest(r)}];
  s.nodes[0].basis = [{record: r.id, revision: r.revision.id, items: ['urn:finding:one', 'urn:decision:one']}];
  assert.doesNotThrow(() => verifyReferences(s, [r]));
  assert.throws(() => verifyReferences(s, []));
  const changed = structuredClone(r); changed.title = 'changed';
  assert.throws(() => verifyReferences(s, [changed]));
  s.nodes[0].basis[0].items = ['urn:missing:finding'];
  assert.throws(() => verifyReferences(s, [r]));
});
test('YAML traps inside an otherwise valid record are rejected by codec rules', () => {
  const yaml = encode(record(), 'yaml');
  for (const fragment of ['  urn:ext:x: &anchor value\n  urn:ext:y: *anchor',
    '  urn:ext:x: !!str value', '  urn:ext:x: !custom value',
    '  urn:ext:x: one\n  urn:ext:x: two', '  1: value',
    '  urn:ext:x: {<<: {a: 1}}', '  urn:ext:x: .nan', '  urn:ext:x: .inf',
    '  urn:ext:x: 0x10', '  urn:ext:x: 1.0', '  urn:ext:x: 01']) {
    assert.throws(() => decode(yaml.replace('extensions: {}', `extensions:\n${fragment}`), 'yaml'));
  }
});
test('opaque keys and scalar-looking strings retain their exact values', () => {
  const input = record();
  input.extensions = JSON.parse('{"urn:ext:x":{"__proto__":{"safe":true},"constructor":null,"toString":"value","data":["true","2026-11-04","01","null","1e3",9007199254740991,-9007199254740991]}}');
  for (const format of ['json', 'yaml']) assert.deepEqual(decode(encode(input, format), format), input);
});
test('conflicting evidence retains both claims without selecting an answer', () => {
  const input = record();
  input.findings[0].state = 'conflicting';
  input.findings[0].claims.push({value: 'SAML', evidence: [{source: 'urn:source:one', locator: 'Appendix'}]});
  assert.deepEqual(decode(encode(input, 'yaml'), 'yaml').findings[0].claims.map(x => x.value), ['OIDC', 'SAML']);
  input.findings[0].claims[1].value = 'OIDC';
  assert.throws(() => validateArtefact(input), /differing/);
});
test('limits and missing values fail before output is returned', () => {
  const input = record();
  input.extensions['urn:ext:x'] = 'x'.repeat(2 * 1024 * 1024);
  assert.throws(() => encode(input, 'yaml'), /limit/);
  let nested = null; for (let i = 0; i < 65; i++) nested = [nested];
  input.extensions['urn:ext:x'] = nested;
  assert.throws(() => encode(input, 'json'), /depth/);
  assert.throws(() => decode('x'.repeat(2 * 1024 * 1024 + 1), 'yaml'), /limit/);
});
