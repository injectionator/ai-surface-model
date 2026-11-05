import assert from 'node:assert/strict';
import {test} from 'node:test';
import fs from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
// Internal modules; intentionally not public package exports.
const settings = await import('../dist/settings.js').catch(() => ({}));
const setup = await import('../dist/setup.js').catch(() => ({}));
function fixture(t, data = {version: 1}) {
  const root = fs.realpathSync(fs.mkdtempSync(join(tmpdir(), 'n8r-setup-')));
  t.after(() => fs.rmSync(root, {recursive: true, force: true}));
  const home = join(root, 'home'), source = join(root, 'source'), vault = join(root, 'vault');
  fs.mkdirSync(join(home, '.n8r'), {recursive: true}); fs.mkdirSync(source);
  fs.writeFileSync(join(source, 'keep'), 'source bytes');
  const file = join(home, '.n8r/n8r-surface.json');
  if (data !== undefined && data !== null) fs.writeFileSync(file, JSON.stringify(data));
  assert.equal(typeof settings.loadSettings, 'function', 'settings snapshot behavior is missing');
  const snapshot = settings.loadSettings(home);
  return {root, home, source, vault, file, snapshot, save: () => setup.saveSetup(snapshot, vault, source)};
}
function read(file) {return JSON.parse(fs.readFileSync(file, 'utf8'));}
function layout(vault) {for (const child of ['research', 'artifacts', 'surfaces']) assert.ok(fs.statSync(join(vault, child)).isDirectory());}

test('accepted setup preserves every JSON value and existing vault/source bytes', t => {
  const data = {version: 1, artefactRoot: '../legacy', runner: {private: 'keep'}, lab: null, surfaceFormat: 'yaml', unknown: [1, {x: true}], __proto__: null};
  const f = fixture(t, data);
  fs.mkdirSync(f.vault); fs.writeFileSync(join(f.vault, 'keep'), 'vault bytes');
  fs.mkdirSync(join(f.home, 'legacy')); fs.writeFileSync(join(f.home, 'legacy/old'), 'legacy bytes');
  assert.equal(f.save(), f.vault); layout(f.vault);
  assert.deepEqual(read(f.file), {...data, vaultRoot: f.vault});
  assert.equal(fs.readFileSync(join(f.home, 'legacy/old'), 'utf8'), 'legacy bytes');
  assert.equal(fs.readFileSync(join(f.vault, 'keep'), 'utf8'), 'vault bytes');
  assert.equal(fs.readFileSync(join(f.source, 'keep'), 'utf8'), 'source bytes');
  assert.deepEqual(fs.readdirSync(join(f.home, '.n8r')), ['n8r-surface.json']);
});

test('fresh settings are published and repair never rewrites configured settings', t => {
  const f = fixture(t, null); f.save(); layout(f.vault);
  const before = fs.statSync(f.file), bytes = fs.readFileSync(f.file);
  fs.rmdirSync(join(f.vault, 'surfaces'));
  setup.saveSetup(settings.loadSettings(f.home), f.vault, f.source);
  layout(f.vault); assert.deepEqual(fs.readFileSync(f.file), bytes);
  assert.equal(fs.statSync(f.file).mtimeMs, before.mtimeMs);
});

for (const content of ['{broken', '{"version":2}', '{"version":1,"vaultRoot":null}', ' '.repeat(65537)]) test('invalid settings retained: '+content.slice(0,30), t => {
  const f = fixture(t); fs.writeFileSync(f.file, content);
  assert.throws(() => settings.loadSettings(f.home));
  assert.equal(fs.readFileSync(f.file, 'utf8'), content); assert.ok(!fs.existsSync(f.vault));
});

for (const initial of [null, {version: 1}]) test('changed settings since prompt retained: '+JSON.stringify(initial), t => {
  const f = fixture(t, initial); fs.writeFileSync(f.file, '{"version":1,"other":"writer"}');
  assert.throws(f.save, /changed|conflict/i);
  assert.equal(read(f.file).other, 'writer'); assert.ok(!fs.existsSync(f.vault));
});

test('exclusive creation retains a file created after final check', t => {
  const f = fixture(t, null); const original = fs.linkSync;
  t.mock.method(fs, 'linkSync', (from, to) => {fs.writeFileSync(to, '{"version":1,"winner":true}'); return original(from, to);});
  assert.throws(f.save); assert.equal(read(f.file).winner, true);
  assert.deepEqual(fs.readdirSync(join(f.home, '.n8r')), ['n8r-surface.json']);
});

test('second setup cannot publish while first holds lock; stale snapshot cannot win later', t => {
  const f = fixture(t); const original = fs.mkdirSync; let attempted = false;
  t.mock.method(fs, 'mkdirSync', (path, ...args) => {
    if (path === f.vault && !attempted) {attempted = true; assert.throws(f.save, /lock|progress/i);}
    return original(path, ...args);
  });
  f.save(); assert.ok(attempted); assert.throws(f.save, /changed|conflict/i); layout(f.vault);
});

for (const operation of ['mkdirSync','renameSync']) test('failure in '+operation+' preserves settings and retry reuses folders', t => {
  const f = fixture(t); const bytes = fs.readFileSync(f.file); const original = fs[operation];
  const mock = t.mock.method(fs, operation, (...args) => {
    if (operation !== 'mkdirSync' || args[0] === join(f.vault, 'artifacts')) throw Object.assign(new Error('injected'), {code: 'EACCES'});
    return original(...args);
  });
  assert.throws(f.save); assert.deepEqual(fs.readFileSync(f.file), bytes);
  assert.deepEqual(fs.readdirSync(join(f.home, '.n8r')), ['n8r-surface.json']);
  mock.mock.restore(); f.save(); layout(f.vault);
});

test('occupied and symlink children fail without publishing', t => {
  const f = fixture(t); fs.mkdirSync(f.vault); fs.writeFileSync(join(f.vault,'research'),'occupied');
  assert.throws(f.save); assert.equal(read(f.file).vaultRoot, undefined);
  fs.unlinkSync(join(f.vault,'research')); fs.symlinkSync(f.source,join(f.vault,'research'));
  assert.throws(f.save, /symlink/i); assert.equal(read(f.file).vaultRoot, undefined);
});

test('source overlap via missing descendants or symlink alias is refused before writes', t => {
  const f = fixture(t); fs.symlinkSync(f.source,join(f.root,'alias'));
  for (const path of [join(f.source,'new/vault'),join(f.root,'alias/new/vault')]) {
    assert.throws(() => setup.saveSetup(f.snapshot,path,f.source), /source|separate/i);
  }
  assert.deepEqual(fs.readdirSync(f.source), ['keep']);
  assert.throws(() => setup.saveSetup(f.snapshot,f.vault,f.home), /source|separate/i);
  assert.ok(!fs.existsSync(f.vault));
});

test('custom paths expand against cwd/home and root symlinks resolve before confirmation', t => {
  const f = fixture(t); fs.mkdirSync(f.vault); fs.symlinkSync(f.vault,join(f.root,'alias'));
  assert.equal(setup.chooseVault('../vault',f.home,f.source),f.vault);
  assert.equal(setup.chooseVault('~/a space',f.home,f.source),join(f.home,'a space'));
  assert.equal(setup.chooseVault('../alias',f.home,f.source),f.vault);
  for (const value of ['', '  ', 'https://example.invalid', 'bad\npath','~other']) assert.throws(() => setup.chooseVault(value,f.home,f.source));
});

test('settings symlink is refused and saved relative vault uses settings directory', t => {
  const f = fixture(t,{version:1,vaultRoot:'../vault'});
  assert.equal(f.snapshot.vault,join(f.home,'vault'));
  fs.renameSync(f.file,join(f.home,'original')); fs.symlinkSync(join(f.home,'original'),f.file);
  assert.throws(() => settings.loadSettings(f.home));
});

test('late detected external edit preserves competing values and cleans temporary siblings', t => {
  const f = fixture(t); const original = fs.openSync;
  t.mock.method(fs, 'openSync', (path,...args) => {
    const fd = original(path,...args);
    if (String(path).endsWith('.tmp')) fs.writeFileSync(f.file,'{"version":1,"late":true}');
    return fd;
  });
  assert.throws(f.save,/changed|conflict/i); assert.equal(read(f.file).late,true);
  assert.deepEqual(fs.readdirSync(join(f.home,'.n8r')),['n8r-surface.json']);
});

test('another real setup process is refused deterministically while lock is held', async t => {
  const {spawnSync} = await import('node:child_process');
  const f=fixture(t), original=fs.mkdirSync; let competitor;
  t.mock.method(fs,'mkdirSync',(path,...args) => {
    if (path === f.vault && competitor === undefined) {
      const code = `import {loadSettings} from ${JSON.stringify(new URL('../dist/settings.js',import.meta.url).href)}; import {saveSetup} from ${JSON.stringify(new URL('../dist/setup.js',import.meta.url).href)}; try {saveSetup(loadSettings(${JSON.stringify(f.home)}),${JSON.stringify(f.vault)},${JSON.stringify(f.source)});process.exitCode=0;} catch(e) {console.log(e.message);process.exitCode=2;}`;
      competitor=spawnSync(process.execPath,['--input-type=module','-e',code],{encoding:'utf8',timeout:5000});
    }
    return original(path,...args);
  });
  f.save(); assert.equal(competitor.status,2); assert.match(competitor.stdout,/lock/); layout(f.vault);
});

test('stale lock and temporary write failure cannot change settings', t => {
  const f=fixture(t), before=fs.readFileSync(f.file);
  fs.writeFileSync(f.file+'.lock','unowned lock');
  assert.throws(f.save,/lock/); assert.equal(fs.readFileSync(f.file+'.lock','utf8'),'unowned lock');
  fs.unlinkSync(f.file+'.lock');
  const original=fs.writeFileSync;
  t.mock.method(fs,'writeFileSync',(path,...args) => {
    if (typeof path === 'number') throw Object.assign(new Error('disk full'),{code:'ENOSPC'});
    return original(path,...args);
  });
  assert.throws(f.save); assert.deepEqual(fs.readFileSync(f.file),before);
  assert.deepEqual(fs.readdirSync(join(f.home,'.n8r')),['n8r-surface.json']);
});

test('repair of valid near-limit settings avoids reserialization and preserves bytes', t => {
  const f=fixture(t);
  fs.writeFileSync(f.file,JSON.stringify({version:1,vaultRoot:f.vault,unknown:Array(12000).fill(1)}));
  const before=fs.readFileSync(f.file);
  setup.saveSetup(settings.loadSettings(f.home),f.vault,f.source);
  layout(f.vault); assert.deepEqual(fs.readFileSync(f.file),before);
});

test('settings expansion beyond read limit fails before any vault writes', t => {
  const f=fixture(t,{version:1,unknown:'x'.repeat(65500)});
  const before=fs.readFileSync(f.file);
  assert.throws(f.save,/65536/); assert.ok(!fs.existsSync(f.vault));
  assert.deepEqual(fs.readFileSync(f.file),before);
});

for (const nested of [false,true]) test(`reject vault within legacy corpus before writes (nested=${nested})`,t=>{
  const f=fixture(t,{version:1,artefactRoot:'../legacy'});
  const selected=join(f.home,'legacy',...(nested?['new-vault']:[]));
  assert.throws(()=>setup.saveSetup(f.snapshot,selected,f.source),/legacy|artefact/i);
  assert.ok(!fs.existsSync(join(f.home,'legacy')));
  assert.equal(read(f.file).vaultRoot,undefined);
});

test('unknown JSON numeric values retain exact representation',t=>{
  const f=fixture(t);
  const original='{ "version":1, "big":9007199254740993, "huge":1e400, "tiny":1e-400, "negative":-0, "nested":{"__proto__":1} }\n';
  fs.writeFileSync(f.file,original);
  setup.saveSetup(settings.loadSettings(f.home),f.vault,f.source);
  const saved=fs.readFileSync(f.file,'utf8');
  for (const literal of ['9007199254740993','1e400','1e-400','"negative":-0','"__proto__":1']) assert.ok(saved.includes(literal),literal+' was changed');
  assert.equal(read(f.file).vaultRoot,f.vault);
});

test('reject controls introduced by root symlink, home or cwd expansion',t=>{
  const f=fixture(t), bad=join(f.root,'vault\nname'), alias=join(f.root,'clean-alias');
  fs.mkdirSync(bad);fs.symlinkSync(bad,alias);
  assert.throws(()=>setup.chooseVault(alias,f.home,f.source),/local path/i);
  assert.throws(()=>setup.chooseVault('~/vault',bad,f.source),/local path/i);
  assert.throws(()=>setup.chooseVault('vault',f.home,bad),/local path/i);
  assert.throws(()=>setup.saveSetup(f.snapshot,alias,f.source),/local path/i);
  assert.deepEqual(fs.readdirSync(bad),[]);assert.equal(read(f.file).vaultRoot,undefined);
});
