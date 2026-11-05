import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {CodexRpc, runnerConfiguration, researcherInstructions} from '../dist/codex.js';

function server(script) {
  return spawn(process.execPath, ['--input-type=module', '-e', script], {stdio: ['pipe', 'pipe', 'pipe']});
}
test('RPC correlates responses and handles server tool calls before a response', async () => {
  const child = server(`import readline from 'node:readline';
    readline.createInterface({input:process.stdin}).on('line', l=>{
      const x=JSON.parse(l); if(x.method==='test') {
        console.log(JSON.stringify({id:'tool-1',method:'item/tool/call',params:{tool:'source_read',arguments:{path:'a'}}}));
        console.log(JSON.stringify({id:x.id,result:{ok:true}}));
      } else if(x.id==='tool-1') console.log(JSON.stringify({method:'tool-result',params:x.result}));
    });`);
  const calls=[]; const rpc = new CodexRpc(child, (method, params) => calls.push([method,params]), async () => ({success:true}));
  try { assert.deepEqual(await rpc.request('test', {}), {ok:true});
    await new Promise(r=>setTimeout(r,30)); assert.equal(calls[0][0],'tool-result');
  } finally { await rpc.close(); }
});
test('RPC rejects pending calls when the child exits or sends malformed JSON', async () => {
  for(const script of ['process.exit(3)', 'console.log("not json")']) {
    const rpc = new CodexRpc(server(script),()=>{}, async()=>({}));
    await assert.rejects(rpc.request('test',{}), /Codex|protocol/i); await rpc.close();
  }
});
test('RPC request timeout and close cannot strand pending promises', async () => {
  const rpc = new CodexRpc(server('process.stdin.resume()'),()=>{},async()=>({}));
  await assert.rejects(rpc.request('test',{},30),/timed out/i);
  const pending=assert.rejects(rpc.request('next',{}),/closed/i); await rpc.close(); await pending;
});
test('runner config disables inherited MCPs, requires ChatGPT and a complete permission profile', () => {
  const cfg=runnerConfiguration({mcp_servers:{sample:{enabled:true}}});
  assert.equal(cfg['mcp_servers.sample.enabled'],false);
  assert.equal(cfg.default_permissions,'n8r_source_tools');
  assert.deepEqual(cfg['permissions.n8r_source_tools'],{filesystem:{},network:{enabled:false}});
  assert.equal(cfg.forced_login_method,'chatgpt');
  assert.throws(()=>runnerConfiguration({model_provider:'another'}), /provider/i);
  assert.throws(()=>runnerConfiguration({chatgpt_base_url:'https://example.test'}), /endpoint/i);
});
test('bundled Researcher contains canonical instructions and references with a digest', () => {
  const instructions=researcherInstructions();
  assert.equal(instructions.version,'0.1.8');
  assert.match(instructions.digest,/^sha256:[a-f0-9]{64}$/);
  assert.match(instructions.text,/Skeleton Surface/);
  assert.match(instructions.text,/Recommended next steps/);
});
test('a preexisting reserved permission profile cannot widen the research profile by merging', () => {
  assert.throws(()=>runnerConfiguration({permissions:{n8r_source_tools:{filesystem:{'/':'read'}}}}), /reserved.*profile/i);
});
