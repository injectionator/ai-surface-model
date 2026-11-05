import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {resolve} from 'node:path';
test('real terminal setup, cancellation, reuse and repair', () => {
  const r = spawnSync('python3', ['tests/startup-pty.py', process.execPath], {encoding:'utf8', timeout:60000, env:{...process.env,N8R_TEST_ENTRY:resolve('dist/cli.js')}});
  assert.ifError(r.error);
  assert.equal(r.status,0,r.stdout+'\n'+r.stderr);
});
