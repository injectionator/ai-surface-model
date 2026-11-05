import assert from 'node:assert/strict';
import {test} from 'node:test';
import {mkdtempSync, cpSync, mkdirSync, readFileSync, writeFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {spawnSync} from 'node:child_process';

function scratch(t) {
  const dir = mkdtempSync(join(tmpdir(), 'n8r-version-'));
  t.after(() => rmSync(dir, {recursive:true, force:true}));
  return dir;
}

test('CLI reports a changed installed manifest from another cwd without setup', t => {
  const dir = scratch(t);
  cpSync('dist', join(dir, 'dist'), {recursive:true});
  // Resolve existing dependencies without installing or consulting the checkout manifest.
  cpSync('node_modules', join(dir, 'node_modules'), {recursive:true});
  writeFileSync(join(dir, 'package.json'), JSON.stringify({type:'module', version:'0.7.3-rc.2'}));
  mkdirSync(join(dir, 'home'));
  const result = spawnSync(process.execPath, [join(dir, 'dist/cli.js'), '--version'], {
    cwd:join(dir, 'home'), env:{...process.env, HOME:join(dir, 'home')}, encoding:'utf8'
  });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout.trim(), 'n8r-surface 0.7.3-rc.2');
});

test('source version check accepts matching SemVer and rejects drift or ambiguous versions', t => {
  const dir = scratch(t);
  const run = (version, lockVersion = version, rootVersion = version) => {
    writeFileSync(join(dir, 'package.json'), JSON.stringify({name:'n8r-surface', version}));
    writeFileSync(join(dir, 'package-lock.json'), JSON.stringify({name:'n8r-surface', version:lockVersion, packages:{'':{name:'n8r-surface', version:rootVersion}}}));
    return spawnSync(process.execPath, [resolve('scripts/check-version.mjs'), dir], {encoding:'utf8'});
  };
  for (const version of ['0.0.0-experimental.1', '0.1.0', '1.2.3', '2.0.0-rc.1']) {
    const result = run(version);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Version consistent:/);
  }
  for (const args of [['1.2.3','1.2.2'], ['1.2.3','1.2.3','1.2.2'], ['01.2.3'], ['1.2'], ['1.2.3-01'], ['1.2.3+build.1'], ['garbage']]) {
    const result = run(...args);
    assert.notEqual(result.status, 0, args.join(','));
  }
});
