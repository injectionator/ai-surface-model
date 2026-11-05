import test from 'node:test';
import assert from 'node:assert/strict';
import {PassThrough} from 'node:stream';
const activity = await import('../dist/activity.js').catch(()=>({}));
function terminal(tty=true) {
  const stream=new PassThrough(); stream.isTTY=tty;
  let output=''; stream.on('data',chunk=>{output+=chunk;});
  return {stream,read:()=>output};
}
test('pending activity animates, clears around output and stops before returning',async()=>{
  assert.equal(typeof activity.Activity,'function','pending-operation indicator exists');
  const t=terminal(), indicator=new activity.Activity(t.stream);
  let release; const pending=new Promise(resolve=>{release=resolve;});
  const work=indicator.run('Preparing note',()=>pending);
  assert.match(t.read(),/Preparing note.*0s/);
  const initial=t.read();
  await new Promise(resolve=>setTimeout(resolve,300));
  assert.notEqual(t.read(),initial,'spinner changes while operation is pending');
  indicator.log('Source evidence\n');
  assert.match(t.read(),/\x1b\[2KSource evidence\n/);
  release('draft'); assert.equal(await work,'draft');
  assert.ok(t.read().endsWith('\r\x1b[2K'));
  const finished=t.read();
  await new Promise(resolve=>setTimeout(resolve,300));
  assert.equal(t.read(),finished,'no output after returning to prompt');
});
test('failure stops activity and nonterminal output never animates',async()=>{
  assert.equal(typeof activity.Activity,'function');
  for (const tty of [true,false]) {
    const t=terminal(tty), indicator=new activity.Activity(t.stream);
    await assert.rejects(indicator.run('Waiting for Codex',async()=>{throw new Error('cancelled');}),/cancelled/);
    const stopped=t.read();
    await new Promise(resolve=>setTimeout(resolve,300));
    assert.equal(t.read(),stopped);
    if (!tty) assert.equal(stopped,'');
  }
});
