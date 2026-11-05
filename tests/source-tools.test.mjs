import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, mkdirSync, writeFileSync, symlinkSync, rmSync, renameSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {SourceTools} from '../dist/source-tools.js';

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'n8r-source-'));
  t.after(() => rmSync(root, {recursive: true, force: true}));
  const source = join(root, 'source'); mkdirSync(source);
  writeFileSync(join(source, 'system.md'), 'Synthetic Chat\nUses an AI gateway.\nAuthentication unknown.\n');
  writeFileSync(join(root, 'outside.txt'), 'outside sentinel');
  return {root, source};
}

test('list, literal search and ranged reads retain actual byte evidence', t => {
  const {source} = fixture(t); const tools = new SourceTools(source);
  assert.deepEqual(tools.list('.').entries.map(x => x.path), ['system.md']);
  assert.deepEqual(tools.search('AI gateway').matches.map(x => [x.path, x.line]), [['system.md', 2]]);
  const read = tools.read('system.md', 2, 1);
  assert.equal(read.text, '2: Uses an AI gateway.');
  assert.equal(read.startLine, 2); assert.equal(read.endLine, 2);
  assert.equal(read.digest, 'sha256:' + createHash('sha256').update('Synthetic Chat\nUses an AI gateway.\nAuthentication unknown.\n').digest('hex'));
  assert.equal(read.truncated, true);
});

test('reject traversal, absolute paths, symlinks and special entries', t => {
  const {source, root} = fixture(t); const tools = new SourceTools(source);
  symlinkSync(join(root, 'outside.txt'), join(source, 'linked.txt'));
  symlinkSync(root, join(source, 'linked-dir'));
  for (const path of ['../outside.txt', join(root, 'outside.txt'), 'linked.txt', 'linked-dir/outside.txt', 'a/../system.md', 'system.md\u001b']) {
    assert.throws(() => tools.read(path), /scope|path|symbolic/i);
  }
  assert.throws(() => tools.read('.'), /regular file/i);
  assert.equal(tools.list('.').excluded.length, 2);
});

test('exclude hidden content and dependency trees, bound text and distinguish omissions', t => {
  const {source} = fixture(t); const tools = new SourceTools(source);
  mkdirSync(join(source, '.git')); mkdirSync(join(source, 'node_modules'));
  writeFileSync(join(source, '.env'), 'SECRET=synthetic');
  writeFileSync(join(source, 'large.txt'), 'x'.repeat(256 * 1024 + 1));
  writeFileSync(join(source, 'binary'), Buffer.from([0, 1, 2]));
  assert.throws(() => tools.read('.env'), /excluded/i);
  assert.throws(() => tools.read('large.txt'), /exceeds/i);
  assert.throws(() => tools.read('binary'), /text|binary/i);
  const search = tools.search('synthetic');
  assert.equal(search.matches.length, 0);
  assert.ok(search.excluded.some(x => x.path === '.env'));
  assert.ok(search.excluded.some(x => x.path === 'large.txt'));
  assert.ok(search.excluded.some(x => x.path === 'binary'));
});

test('file-only scope cannot read siblings and validates tool arguments', t => {
  const {source} = fixture(t); const tools = new SourceTools(join(source, 'system.md'));
  assert.equal(tools.list('.').entries.length, 1);
  assert.throws(() => tools.read('other.md'), /scope/i);
  assert.throws(() => tools.read('system.md', 0), /line/i);
  assert.throws(() => tools.read('system.md', 1, 201), /line/i);
  assert.throws(() => tools.search(''), /query/i);
  assert.throws(() => tools.call('unknown', {}), /tool/i);
  assert.throws(() => tools.call('source_read', {path: 'system.md', extra: true}), /arguments/i);
});

for (const fileOnly of [false, true]) test(`replaced scope root rejected (fileOnly=${fileOnly})`, t => {
  const {source, root} = fixture(t); const tools = new SourceTools(fileOnly ? join(source, 'system.md') : source);
  renameSync(source, join(root, 'original'));
  symlinkSync(root, source);
  assert.throws(() => tools.list('.'), /scope.*changed/i);
  assert.throws(() => tools.read(fileOnly ? 'system.md' : 'outside.txt'), /scope.*changed/i);
});
test('replaced ancestor rejected before enumeration or read', t => {
  const {source, root} = fixture(t); mkdirSync(join(source, 'nested'));
  writeFileSync(join(source, 'nested', 'file.md'), 'inside');
  const tools = new SourceTools(join(source, 'nested'));
  renameSync(source, join(root, 'original')); symlinkSync(join(root, 'original'), source);
  assert.throws(() => tools.list('.'), /scope.*changed/i);
});
