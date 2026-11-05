import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const notes = await import('../dist/notes.js').catch(() => ({}));
const meta = {researcher: {version:'0.1.8',digest:'sha256:'+'a'.repeat(64)}, model:'fixture', evidence:[]};
function fixture(t) {
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'n8r-notes-'));
  t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const vault=path.join(root,'vault'), source=path.join(root,'source');
  fs.mkdirSync(path.join(vault,'research'),{recursive:true}); fs.mkdirSync(source);
  return {root,vault,source};
}
test('numbered saves read back exact bytes and retain predecessor lineage',t=>{
  assert.equal(typeof notes.Notes,'function','bounded note storage is available');
  const {vault,source}=fixture(t), store=new notes.Notes(vault,source);
  const first=store.save(store.next(),'# Research\n\nHuman choice: no OIDC.\n',meta);
  const original=fs.readFileSync(first.path);
  const reopened=notes.readNote(first.path);
  assert.match(reopened.text,/Human choice: no OIDC/);
  const fresh=new notes.Notes(vault,source,reopened);
  const second=fresh.save(fresh.next(),'# Continued\n\nSame component app-1.\n',meta);
  assert.match(second.path,/research-002.md$/);
  assert.deepEqual(fs.readFileSync(first.path),original);
  assert.equal(second.metadata.predecessor.digest,first.digest);
  assert.equal(second.metadata.predecessor.file,path.basename(first.path));
  assert.ok(!second.text.includes(vault));
});
test('latest suggestion ranks filesystem mtime, not revision number, and never writes',t=>{
  assert.equal(typeof notes.latestNote,'function');
  const {vault,source}=fixture(t), store=new notes.Notes(vault,source);
  assert.equal(notes.latestNote(vault,source),undefined);
  const a=store.save(store.next(),'First',meta), b=store.save(store.next(),'Second',meta);
  fs.utimesSync(a.path,new Date('2030-01-01'),new Date('2030-01-01'));
  assert.equal(notes.latestNote(vault,source).path,a.path);
  fs.writeFileSync(path.join(path.dirname(a.path),'other.md'),'unrelated');
  assert.equal(notes.latestNote(vault,source).path,a.path);
  assert.equal(fs.readdirSync(path.dirname(a.path)).length,3);
  assert.notEqual(a.path,b.path);
});
test('occupied output and edited predecessor are preserved',t=>{
  assert.equal(typeof notes.Notes,'function');
  const {vault,source}=fixture(t), store=new notes.Notes(vault,source);
  const a=store.save(store.next(),'First',meta), next=store.next();
  fs.writeFileSync(next,'occupied');
  assert.throws(()=>store.save(next,'Second',meta),/exist|occupied|EEXIST/i);
  assert.equal(fs.readFileSync(next,'utf8'),'occupied');
  fs.appendFileSync(a.path,'\nHuman edit\n');
  assert.throws(()=>store.save(store.next(),'Third',meta),/changed.*reopen/i);
  assert.equal(fs.readdirSync(path.dirname(a.path)).length,2);
});
test('storage rejects symlink ancestors, replaced folders and writes within source',t=>{
  assert.equal(typeof notes.Notes,'function');
  const {root,vault,source}=fixture(t);
  assert.throws(()=>new notes.Notes(source,source),/source/i);
  const store=new notes.Notes(vault,source), target=store.next();
  const folder=path.dirname(target);
  fs.symlinkSync(source,folder);
  assert.throws(()=>store.save(target,'bad',meta),/symbolic|symlink/i);
  assert.equal(fs.readdirSync(source).length,0);
  fs.unlinkSync(folder);
  store.save(target,'good',meta);
  const second=store.next();
  fs.renameSync(folder,path.join(root,'old'));
  fs.mkdirSync(folder);
  assert.throws(()=>store.save(second,'bad',meta),/changed/i);
});
test('read rejects oversized, binary, malformed and symlink notes',t=>{
  assert.equal(typeof notes.readNote,'function');
  const {root}=fixture(t), p=path.join(root,'research-001.md');
  for (const value of [Buffer.alloc(300000,65),Buffer.from([255]),Buffer.from('ordinary markdown')]) {
    fs.writeFileSync(p,value); assert.throws(()=>notes.readNote(p));
  }
  fs.symlinkSync(p,path.join(root,'research-002.md'));
  assert.throws(()=>notes.readNote(path.join(root,'research-002.md')),/symbolic|symlink/i);
});
test('human edits appended after the footer survive reopening and successor saves',t=>{
  const {vault,source}=fixture(t), store=new notes.Notes(vault,source);
  const first=store.save(store.next(),'# app-1',meta);
  fs.appendFileSync(first.path,'\nHuman decision: retain app-1 and investigate auth next.\n');
  const edited=notes.readNote(first.path);
  assert.match(edited.text,/investigate auth next/);
  const fresh=new notes.Notes(vault,source,edited);
  const next=fresh.save(fresh.next(),'# app-1\nHuman decision retained.',meta);
  assert.equal(next.metadata.predecessor.digest,edited.digest);
});
