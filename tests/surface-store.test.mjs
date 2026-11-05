import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {prepareSurfaceDraft} from '../dist/surface-draft.js';
import {content} from './surface-fixture.mjs';
import {Notes} from '../dist/notes.js';
const api=await import('../dist/surface-store.js').catch(()=>({}));
const provenance={researcher:{version:'0.1.8',digest:'sha256:'+'a'.repeat(64)},model:'fixture',evidence:[]};
function setup(t) {
  assert.equal(typeof api.SurfaceStore,'function');
  const root=fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(),'n8r-pair-')));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const vault=path.join(root,'vault'),source=path.join(root,'source');fs.mkdirSync(vault);fs.mkdirSync(source);
  return {root,vault,source};
}
test('pair saves and reopens either member with exact reference and immutable successors',t=>{
  const {vault,source}=setup(t),store=new api.SurfaceStore(vault,source);
  const first=store.save(prepareSurfaceDraft(content()),provenance);
  const original=fs.readFileSync(first.surfacePath), html=fs.readFileSync(first.researchPath);
  assert.deepEqual(api.readSurfacePair(first.surfacePath).surface,first.surface);
  assert.deepEqual(api.readSurfacePair(first.researchPath).research,first.research);
  const nextStore=new api.SurfaceStore(vault,source,api.readSurfacePair(first.researchPath));
  const input=content();input.research.decisions[0].choice='selected';
  const second=nextStore.save(prepareSurfaceDraft(input,{previous:first}),provenance);
  assert.notEqual(second.directory,first.directory);assert.equal(second.research.decisions[0].choice,'selected');
  assert.deepEqual(fs.readFileSync(first.surfacePath),original);assert.deepEqual(fs.readFileSync(first.researchPath),html);
  const moved=path.join(vault,'relocated');fs.renameSync(second.directory,moved);
  assert.equal(api.readSurfacePair(path.join(moved,'surface.json')).surface.id,first.surface.id);
  assert.ok(!fs.readFileSync(path.join(moved,'manifest.json'),'utf8').includes(vault));
});
test('edited predecessor or original note blocks successor while preserving bytes',t=>{
  const {vault,source}=setup(t),notes=new Notes(vault,source);const note=notes.save(notes.next(),'Existing research',provenance);
  const store=new api.SurfaceStore(vault,source,undefined,note);
  fs.appendFileSync(note.path,'human edit');assert.throws(()=>store.save(prepareSurfaceDraft(content()),provenance),/changed/);
  const first=new api.SurfaceStore(vault,source).save(prepareSurfaceDraft(content()),provenance);
  const successor=new api.SurfaceStore(vault,source,first);fs.appendFileSync(first.researchPath,'human edit');
  assert.throws(()=>successor.save(prepareSurfaceDraft(content(),{previous:first}),provenance),/changed/);
  assert.throws(()=>api.readSurfacePair(first.surfacePath),/hash|bytes|conflict/i);
  assert.ok(fs.readFileSync(first.researchPath,'utf8').endsWith('human edit'));
});
test('symlinked ancestry, malformed manifest and incomplete pair fail closed',t=>{
  const {root,vault,source}=setup(t);fs.symlinkSync(source,path.join(vault,'surfaces'));
  assert.throws(()=>new api.SurfaceStore(vault,source),/symbolic|symlink/i);fs.unlinkSync(path.join(vault,'surfaces'));
  const first=new api.SurfaceStore(vault,source).save(prepareSurfaceDraft(content()),provenance);
  fs.writeFileSync(path.join(first.directory,'manifest.json'),'{}');assert.throws(()=>api.readSurfacePair(first.surfacePath),/manifest/i);
  fs.unlinkSync(first.researchPath);assert.throws(()=>api.readSurfacePair(first.surfacePath));
  assert.deepEqual(fs.readdirSync(source),[]);
});
test('occupied revision directories remain untouched and invalid drafts never publish',t=>{
  const {vault,source}=setup(t);const store=new api.SurfaceStore(vault,source);
  const first=store.save(prepareSurfaceDraft(content()),provenance);
  const names=fs.readdirSync(path.dirname(first.directory));
  const bad=prepareSurfaceDraft(content(),{previous:first});bad.surface.records[0].digest='sha256:'+'0'.repeat(64);
  assert.throws(()=>store.save(bad,provenance),/digest/);
  assert.deepEqual(fs.readdirSync(path.dirname(first.directory)),names);
  assert.throws(()=>store.save(prepareSurfaceDraft(content()),provenance),/identity|parent/);
});
test('publication failure cleans staging and cannot overwrite an occupied target',t=>{
  const {vault,source}=setup(t),store=new api.SurfaceStore(vault,source);
  const rename=fs.renameSync;
  fs.renameSync=()=>{throw new Error('simulated publication failure');};
  try{assert.throws(()=>store.save(prepareSurfaceDraft(content()),provenance),/publication failure/);}finally{fs.renameSync=rename;}
  assert.deepEqual(fs.readdirSync(store.directory),[]);
});
