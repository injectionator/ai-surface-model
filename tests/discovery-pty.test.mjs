import {test} from 'node:test';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
test('offline discovery terminal: authorization, same-thread turns, failure, EOF and cancellation', () => {
  execFileSync('python3', ['tests/discovery-pty.py', process.execPath], {env: {...process.env, N8R_TEST_ENTRY: resolve('dist/cli.js')}, stdio: 'pipe', timeout: 60000});
});
