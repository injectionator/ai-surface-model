import assert from 'node:assert/strict';
import {test} from 'node:test';
import {mkdtempSync, mkdirSync, writeFileSync, readFileSync, readdirSync, lstatSync, chmodSync, symlinkSync, readlinkSync, realpathSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve, dirname} from 'node:path';
import {spawnSync} from 'node:child_process';
import {surface} from './helpers.mjs';

const installed = process.env.N8R_TEST_BIN_DIR;
const command = installed ? 'n8r-surface' : process.execPath;
const prefix = installed ? [] : [resolve('dist/cli.js')];
const assets = installed ? new URL(import.meta.resolve('n8r-surface/examples/lumen-r1.research.html')) : new URL('../examples/researcher/lumen-r1.research.html', import.meta.url);
const marker = 'PRIVATE_VALUE_MUST_NOT_APPEAR';

function fixture(t, config = {version: 1, artefactRoot: '~/n8r/artifacts', surfaceFormat: 'json'}) {
  const home = realpathSync(mkdtempSync(join(tmpdir(), 'n8r startup ')));
  t.after(() => rmSync(home, {recursive: true, force: true}));
  mkdirSync(join(home, '.n8r'));
  const folder = join(home, 'n8r/artifacts');
  mkdirSync(folder, {recursive: true});
  const configFile = join(home, '.n8r/n8r-surface.json');
  if (config !== null) writeFileSync(configFile, JSON.stringify(config));
  const saved = {...surface(), title: 'LibreChat', id: 'urn:surface:librechat-uniqueid'};
  const file = join(folder, 'librechat-uniqueid.json');
  writeFileSync(file, JSON.stringify(saved));
  const env = {HOME: home, USERPROFILE: home, PATH: [installed, dirname(process.execPath), process.env.PATH].filter(Boolean).join(process.platform === 'win32' ? ';' : ':'), LANG: 'C', OPENAI_API_KEY: marker};
  const run = (args = []) => {
    const result = spawnSync(command, [...prefix, ...args], {cwd: home, env, encoding: 'utf8', input: '', timeout: 5000});
    assert.ifError(result.error);
    assert.equal(result.signal, null);
    assert.equal(result.stderr, '');
    assert.ok(!result.stdout.includes(marker), 'private marker leaked');
    return result;
  };
  return {home, folder, file, saved, configFile, env, run};
}

function snapshot(root) {
  return readdirSync(root).sort().flatMap(name => {
    const path = join(root, name);
    const stat = lstatSync(path);
    if (stat.isSymbolicLink()) return [[path, 'symlink', readlinkSync(path)]];
    return stat.isDirectory() ? [[path, 'directory', stat.mode], ...snapshot(path)] : [[path, readFileSync(path).toString('hex'), stat.mode, stat.mtimeMs]];
  });
}

// Removing any overview field, reading private settings, inventing liveness or
// writing setup files must break this user-level check.
test('STARTUP-01: bare startup matches prepared state with closed input and no writes', t => {
  const f = fixture(t, {version: 1, artefactRoot: '~/n8r/artifacts', surfaceFormat: 'json', password: marker, nested: {token: marker}, process: {pid: process.pid, state: 'running'}});
  const before = snapshot(f.home);
  const r = f.run();
  assert.equal(r.status, 1);
  assert.ok(r.stdout.includes(f.configFile));
  assert.ok(r.stdout.includes(`Artefact folder: ${f.folder}`));
  assert.match(r.stdout, /Surface output: JSON/);
  assert.match(r.stdout, /AI runner: Not configured/);
  assert.match(r.stdout, /Lab connection: Not configured/);
  assert.match(r.stdout, /Runner\/Lab processes: Status unknown/);
  assert.match(r.stdout, new RegExp(`n8r-surface overview: running \\(PID ${r.pid}\\); observed \\d{4}-`));
  assert.match(r.stdout, /Local artefacts \(1\)/);
  const rows = r.stdout.split('\n').filter(x => x.includes('librechat-uniqueid.json'));
  assert.equal(rows.length, 1);
  assert.ok(rows[0].includes(`LibreChat | Surface definition | ${f.file}`));
  assert.match(r.stdout, /Vault setup required; run n8r-surface in an interactive terminal\./);
  assert.ok(!r.stdout.includes('Show setup requirements?'));
  assert.deepEqual(snapshot(f.home), before);
});

test('two artefacts include readable HTML metadata without printing private config or body', t => {
  const f = fixture(t, {version: 1, artefactRoot: '~/n8r/artifacts', runner: {url: `https://user:${marker}@example.invalid`, token: marker}, lab: {credentials: {value: marker}}});
  writeFileSync(join(f.folder, 'research.html'), readFileSync(assets));
  const r = f.run();
  assert.equal(r.status, 1);
  assert.match(r.stdout, /Local artefacts \(2\)/);
  assert.equal(r.stdout.split('\n').filter(x => x.includes(' | ')).length, 2);
  assert.match(r.stdout, /Research record.*research.html/);
  assert.match(r.stdout, /AI runner: Configured \(unverified; details withheld\)/);
  assert.match(r.stdout, /Lab connection: Configured \(unverified; details withheld\)/);
});

test('missing settings use explicit defaults without creating a file or mistaking a missing folder for empty', t => {
  const f = fixture(t, null);
  const before = snapshot(f.home);
  const r = f.run();
  assert.equal(r.status, 1);
  assert.match(r.stdout, /Missing; using defaults/);
  assert.ok(r.stdout.includes(join(f.home, 'n8r/artefacts')));
  assert.match(r.stdout, /Folder unavailable \(ENOENT\)/);
  assert.doesNotMatch(r.stdout, /Folder is empty/);
  assert.deepEqual(snapshot(f.home), before);
});

test('omitted fields use defaults and an empty existing folder is explicitly empty', t => {
  const f = fixture(t, {version: 1});
  mkdirSync(join(f.home, 'n8r/artefacts'));
  const r = f.run();
  assert.equal(r.status, 1);
  assert.match(r.stdout, /Surface output: JSON \(default\)/);
  assert.match(r.stdout, /Local artefacts \(0\)/);
  assert.match(r.stdout, /Folder is empty/);
});

test('relative folders resolve against config directory and YAML Surface metadata is listed', t => {
  const f = fixture(t, {version: 1, artefactRoot: '../a folder', surfaceFormat: 'yaml'});
  mkdirSync(join(f.home, 'a folder'));
  // JSON is also valid YAML; it exercises the selected .yaml reader.
  writeFileSync(join(f.home, 'a folder/saved.yaml'), JSON.stringify(f.saved));
  const r = f.run();
  assert.equal(r.status, 1);
  assert.ok(r.stdout.includes(join(f.home, 'a folder')));
  assert.match(r.stdout, /Surface output: YAML/);
  assert.match(r.stdout, /LibreChat \| Surface definition .*saved.yaml/);
});

for (const [label, contents] of [
  ['malformed JSON', `{"password":"${marker}",`],
  ['unsupported version', JSON.stringify({version: 9, token: marker})],
  ['invalid format', JSON.stringify({version: 1, surfaceFormat: marker})],
  ['non-object', 'null'],
  ['null folder', JSON.stringify({version: 1, artefactRoot: null})],
  ['null format', JSON.stringify({version: 1, surfaceFormat: null})],
  ['oversized', ' '.repeat(65537)],
  ['URL folder', JSON.stringify({version: 1, artefactRoot: `https://user:${marker}@example.invalid`})]
]) test(`invalid config (${label}) is retained and prevents corpus inspection`, t => {
  const f = fixture(t);
  writeFileSync(f.configFile, contents);
  const before = snapshot(f.home);
  const r = f.run();
  assert.equal(r.status, 2);
  assert.match(r.stdout, /Configuration unavailable/);
  assert.match(r.stdout, /Not inspected: configuration unavailable/);
  assert.doesNotMatch(r.stdout, /librechat-uniqueid.json/);
  assert.deepEqual(snapshot(f.home), before);
});

test('unsupported, invalid, oversized and symlink entries stay visible with terminal-safe rows', t => {
  const f = fixture(t);
  writeFileSync(f.file, JSON.stringify({...f.saved, title: 'Libre\nChat\u001b[31m\u202e'}));
  writeFileSync(join(f.folder, 'unknown.txt'), marker);
  writeFileSync(join(f.folder, 'broken.json'), `{"token":"${marker}"`);
  writeFileSync(join(f.folder, 'big.json'), ' '.repeat(2 * 1024 * 1024 + 1));
  symlinkSync(f.configFile, join(f.folder, 'linked.json'));
  mkdirSync(join(f.folder, 'nested'));
  const r = f.run();
  assert.equal(r.status, 2);
  assert.equal(r.stdout.split('\n').filter(x => x.includes(' | ')).length, 6);
  assert.match(r.stdout, /unknown.txt.*Unsupported file type/);
  assert.match(r.stdout, /broken.json.*Invalid or unsupported artefact/);
  assert.match(r.stdout, /big.json.*File exceeds/);
  assert.match(r.stdout, /linked.json.*Symlink not followed/);
  assert.match(r.stdout, /nested.*Not a regular file/);
  assert.doesNotMatch(r.stdout, /[\u001b\u202e]/);
  assert.match(r.stdout, /Libre\\u000aChat\\u001b\[31m\\u202e/);
});

for (const target of ['configuration', 'folder', 'artefact']) test(`unreadable ${target} reports failure and preserves bytes`, t => {
  if (process.platform === 'win32' || process.getuid?.() === 0) { t.skip('requires POSIX permissions and non-root user'); return; }
  const f = fixture(t);
  const path = target === 'configuration' ? f.configFile : target === 'folder' ? f.folder : f.file;
  const before = snapshot(f.home);
  const mode = lstatSync(path).mode;
  chmodSync(path, 0);
  let r;
  try { r = f.run(); } finally { chmodSync(path, mode); }
  assert.equal(r.status, 2);
  assert.match(r.stdout, /EACCES/);
  assert.doesNotMatch(r.stdout, /Folder is empty/);
  assert.deepEqual(snapshot(f.home), before);
});

test('arguments fail before reading settings and are not echoed', t => {
  const f = fixture(t);
  const before = snapshot(f.home);
  const r = f.run([marker]);
  assert.equal(r.status, 2);
  assert.match(r.stdout, /Unsupported arguments/);
  assert.doesNotMatch(r.stdout, /Configuration/);
  assert.deepEqual(snapshot(f.home), before);
});

for (const target of ['configuration', 'artefact']) test(`FIFO ${target} does not block or get read`, t => {
  if (process.platform === 'win32') { t.skip('POSIX FIFO check'); return; }
  const f = fixture(t);
  const path = target === 'configuration' ? f.configFile : join(f.folder, 'pipe.json');
  if (target === 'configuration') rmSync(path);
  const made = spawnSync('mkfifo', [path], {encoding: 'utf8'});
  assert.equal(made.status, 0, made.stderr);
  const r = f.run();
  assert.equal(r.status, 2);
  assert.match(r.stdout, /Not a regular file/);
  assert.ok(lstatSync(path).isFIFO());
});

for (const state of ['ready', 'missing', 'occupied', 'symlink']) test(`configured vault ${state}: correct exit and no closed-input writes`, t => {
  const f = fixture(t, {version: 1, vaultRoot: '../vault'});
  const vault = join(f.home, 'vault');
  mkdirSync(vault);
  for (const child of ['research','artifacts','surfaces']) mkdirSync(join(vault,child));
  if (state !== 'ready') rmSync(join(vault,'surfaces'), {recursive:true});
  if (state === 'occupied') writeFileSync(join(vault,'surfaces'),'keep');
  if (state === 'symlink') symlinkSync(f.folder,join(vault,'surfaces'));
  const before = snapshot(f.home), r = f.run();
  assert.equal(r.status, state === 'ready' ? 0 : state === 'missing' ? 1 : 2);
  if (state === 'ready') assert.ok(r.stdout.includes(`Vault ready: ${vault}`));
  assert.deepEqual(snapshot(f.home),before);
});

test('legacy error wins over a complete vault and never offers setup', t => {
  const f = fixture(t,{version:1,vaultRoot:'../vault',artefactRoot:'~/n8r/artifacts'});
  for (const child of ['research','artifacts','surfaces']) mkdirSync(join(f.home,'vault',child),{recursive:true});
  writeFileSync(join(f.folder,'bad.json'),'invalid');
  const r=f.run(); assert.equal(r.status,2); assert.doesNotMatch(r.stdout,/Vault ready:|Vault setup required|Create vault/);
});

test('discovery help/version are local; closed-input discovery cannot launch a runner', t => {
  const f = fixture(t); const before = snapshot(f.home);
  for (const args of [['--help'], ['discover', '--help']]) {
    const r = f.run(args); assert.equal(r.status, 0); assert.match(r.stdout, /discover/); assert.match(r.stdout, /ChatGPT/);
  }
  assert.equal(f.run(['--version']).stdout.trim(), 'n8r-surface 0.0.0-experimental.1');
  const r = f.run(['discover']); assert.equal(r.status, 1); assert.match(r.stdout, /interactive terminal/);
  assert.deepEqual(snapshot(f.home), before);
});
