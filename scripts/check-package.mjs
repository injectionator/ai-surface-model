// Build first. npm's local dependency cache must be populated by npm ci.
import {mkdtempSync, copyFileSync, writeFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root = resolve(import.meta.dirname, '..');
const temp = mkdtempSync(join(tmpdir(), 'n8r-package-'));
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
try {
  const packed = JSON.parse(execFileSync(npm, ['pack', '--ignore-scripts', '--json', '--pack-destination', temp], {cwd: root, encoding: 'utf8'}));
  writeFileSync(join(temp, 'package.json'), '{"private":true,"type":"module"}\n');
  execFileSync(npm, ['install', '--offline', '--ignore-scripts', '--no-audit', '--no-fund', '--package-lock=false', join(temp, packed[0].filename)], {cwd: temp, stdio: 'pipe'});
  copyFileSync(join(root, 'tests/package-smoke.mjs'), join(temp, 'smoke.mjs'));
  for (const name of ['startup.test.mjs', 'helpers.mjs', 'startup-pty.py']) {
    copyFileSync(join(root, 'tests', name), join(temp, name));
  }
  const runtimes = process.argv.slice(2);
  for (const node of runtimes.length ? runtimes : [process.execPath]) {
    execFileSync(node, ['smoke.mjs'], {cwd: temp, stdio: 'inherit'});
    const env = {...process.env, N8R_TEST_BIN_DIR: join(temp, 'node_modules/.bin')};
    execFileSync(node, ['--test', 'startup.test.mjs'], {cwd: temp, env, stdio: 'inherit'});
    if (process.platform === 'win32') {
      throw new Error('The interactive startup rehearsal requires a POSIX terminal and Python 3');
    }
    execFileSync('python3', ['startup-pty.py', node], {cwd: temp, env, stdio: 'inherit'});
  }
} finally {
  rmSync(temp, {recursive: true, force: true});
}
