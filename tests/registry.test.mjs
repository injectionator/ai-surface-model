import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {verifyRegistryBytes, verifyStagedBytes, publishMissing} from '../scripts/publish-packages.mjs';
const bytes = Buffer.from('synthetic archive');
const sha256 = createHash('sha256').update(bytes).digest('hex');
const integrity = 'sha512-' + createHash('sha512').update(bytes).digest('base64');
const entry = {name:'@n8r/surface', sha256};
const metadata = {name:'@n8r/surface', version:'0.1.0-experimental.1', dist:{integrity}};
test('registry readback requires exact identity and retained bytes', () => {
  assert.doesNotThrow(() => verifyRegistryBytes(entry, metadata.version, metadata, bytes));
  assert.throws(() => verifyRegistryBytes(entry, metadata.version, {...metadata, name:'other'}, bytes), /identity/);
  assert.throws(() => verifyRegistryBytes(entry, '0.1.0-experimental.2', metadata, bytes), /identity/);
  assert.throws(() => verifyRegistryBytes(entry, metadata.version, metadata, Buffer.from('changed')), /bytes/);
  assert.throws(() => verifyRegistryBytes(entry, metadata.version, {...metadata, dist:{integrity:'sha512-wrong'}}, bytes), /integrity/);
});

// External registry/publish boundary is scripted; orchestration is real.
test('a mismatch in either existing package prevents all publication', async () => {
  const published = [];
  await assert.rejects(publishMissing([{name:'missing'}, {name:'mismatch'}], {
    lookup: async e => e.name === 'missing' ? null : {},
    verify: async () => { throw Error('mismatch'); },
    publish: e => published.push(e.name),
  }), /mismatch/);
  assert.deepEqual(published, []);
});
test('recovery publishes only the absent package and independently reads it back', async () => {
  const published = [], verified = [];
  let missingPublished = false;
  await publishMissing([{name:'existing'}, {name:'missing'}], {
    lookup: async e => e.name === 'existing' || missingPublished ? {name:e.name} : null,
    verify: async (e, m) => { assert.equal(e.name,m.name); verified.push(e.name); },
    publish: e => { published.push(e.name); missingPublished = true; },
  });
  assert.deepEqual(published, ['missing']);
  assert.deepEqual(verified, ['existing', 'missing']);
});
test('registry outage is not absence and stops publication', async () => {
  let writes = 0;
  await assert.rejects(publishMissing([{name:'one'}], {
    lookup: async () => { throw Error('503'); },
    verify: async () => {}, publish: () => { writes++; },
  }), /503/);
  assert.equal(writes, 0);
});

test('staged readback rejects a changed archive or wrong approval target', () => {
  const stage = {id:'12345678-1234-1234-1234-123456789abc', packageName:'@n8r/surface', version:'0.1.0-experimental.1', tag:'experimental'};
  assert.doesNotThrow(() => verifyStagedBytes(entry, stage.version, stage, bytes));
  for (const change of [{packageName:'n8r'}, {version:'0.2.0'}, {tag:'latest'}, {id:'../unsafe'}]) {
    assert.throws(() => verifyStagedBytes(entry, stage.version, {...stage,...change}, bytes), /identity/);
  }
  assert.throws(() => verifyStagedBytes(entry, stage.version, stage, Buffer.from('other')), /bytes/);
});
