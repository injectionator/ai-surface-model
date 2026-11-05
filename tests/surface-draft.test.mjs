import test from 'node:test';
import assert from 'node:assert/strict';
import {digest, verifyReferences} from '../dist/index.js';
const api = await import('../dist/surface-draft.js').catch(()=>({}));
import {content} from './surface-fixture.mjs';
const context = {createdAt:'2026-11-05T12:00:00Z'};
test('host stamps revisions and exact research links, previews selected and unknown content',()=>{
  assert.equal(typeof api.prepareSurfaceDraft,'function');
  const d=api.prepareSurfaceDraft(content(),context);
  assert.equal(d.research.revision.parent,null);
  assert.equal(d.surface.records[0].digest,digest(d.research));
  verifyReferences(d.surface,[d.research]);
  for(const text of ['urn:node:app','rejected','OIDC','Select model','Model unknown','One document']) assert.ok(api.previewSurface(d).includes(text),text);
});
test('invalid basis is rejected rather than silently dropping claims',()=>{
  assert.equal(typeof api.prepareSurfaceDraft,'function');
  const c=content();c.surface.nodes[0].basis[0].items=['urn:f:missing'];
  assert.throws(()=>api.prepareSurfaceDraft(c,context),/unresolved/);
});
test('successor retains stable identity and history but can change a decision',()=>{
  assert.equal(typeof api.prepareSurfaceDraft,'function');
  const first=api.prepareSurfaceDraft(content(),context), c=content();c.research.decisions[0].choice='selected';
  const next=api.prepareSurfaceDraft(c,{...context,previous:first});
  assert.equal(next.surface.id,first.surface.id);assert.equal(next.research.id,first.research.id);
  assert.equal(next.research.revision.parent.digest,digest(first.research));
  assert.notEqual(next.surface.revision.id,first.surface.revision.id);
  assert.equal(next.research.decisions[0].choice,'selected');
  for(const mutate of [x=>x.research.sources=[],x=>x.research.findings=[],x=>x.research.decisions=[],x=>x.surface.nodes=[],x=>x.research.extensions={}]) {
    const bad=content();mutate(bad);assert.throws(()=>api.prepareSurfaceDraft(bad,{...context,previous:first}));
  }
  const bad=content();bad.research.sources[0].digest='sha256:'+'b'.repeat(64);
  assert.throws(()=>api.prepareSurfaceDraft(bad,{...context,previous:first}),/historical source/);
});
test('conflicting source claims remain unknown in the definition and keep both evidence claims',()=>{
  const c=content();c.research.findings[0].state='conflicting';c.research.findings[0].claims.push({value:'service',evidence:[{source:'urn:source:one',locator:'line 2'}]});
  const d=api.prepareSurfaceDraft(c,context);assert.equal(d.research.findings[0].claims.length,2);assert.match(api.previewSurface(d),/conflicting/);
});
test('retained relationship endpoints cannot silently change',()=>{
  const c=content();c.surface.nodes.push({...structuredClone(c.surface.nodes[0]),id:'urn:node:two',label:'Two'});
  c.surface.relationships=[{...structuredClone(c.surface.nodes[0]),id:'urn:edge:one',from:'urn:node:app',to:'urn:node:two',claim:'declared'}];delete c.surface.relationships[0].label;
  const first=api.prepareSurfaceDraft(c,context);c.surface.relationships[0].to='urn:node:app';
  assert.throws(()=>api.prepareSurfaceDraft(c,{...context,previous:first}),/endpoints/);
});
test('generated entities require structured basis and successors cannot drop historical claims or human notes',()=>{
  const c=content();c.surface.nodes[0].basis=[];
  assert.throws(()=>api.prepareSurfaceDraft(c,context),/basis/);
  const original=content();original.research.notes=[{by:'human',at:'2026-11-05T12:00:00Z',text:'Prioritize expiry evidence'}];
  const first=api.prepareSurfaceDraft(original,context);
  const lost=structuredClone(original);lost.research.findings[0].state='unknown';lost.research.findings[0].claims=[];
  assert.throws(()=>api.prepareSurfaceDraft(lost,{...context,previous:first}),/claim/);
  const noNote=content();assert.throws(()=>api.prepareSurfaceDraft(noNote,{...context,previous:first}),/note/);
});
