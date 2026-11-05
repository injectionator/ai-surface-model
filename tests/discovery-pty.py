"""Offline terminal/protocol tests. Scripted Codex responses are NOT AI evidence."""
import errno
import json
import os
from pathlib import Path
import pty
import select
import signal
import subprocess
import sys
import tempfile
import time


def terminal(root, entry, node, mode, answers, expected):
    home = root / mode
    home.mkdir()
    (home / '.n8r').mkdir()
    vault = home / 'vault'
    for name in ['research', 'artifacts', 'surfaces']:
        (vault / name).mkdir(parents=True)
    settings = home / '.n8r/n8r-surface.json'
    settings.write_text(json.dumps({'version': 1, 'vaultRoot': str(vault)}))
    source = home / 'source'
    source.mkdir()
    source_file = source / 'case.md'
    source_file.write_text('ACTUAL_SYNTHETIC_SOURCE_BYTES\n')
    (home / 'outside.txt').write_text('OUTSIDE_SCOPE_SENTINEL')
    bin_dir = home / 'bin'
    bin_dir.mkdir()
    trace = home / 'trace.jsonl'
    program = r'''#!/usr/bin/env node
const fs=require('node:fs'), readline=require('node:readline');
const mode=MODE, trace=TRACE;
if(process.env.OPENAI_API_KEY) throw new Error('API key inherited');
fs.appendFileSync(trace,JSON.stringify({pid:process.pid,args:process.argv.slice(2)})+'\n');
if(process.argv.includes('--version')) {console.log('codex-cli 0.166.0');process.exit(0);}
let thread, count=0;
const send=x=>console.log(JSON.stringify(x));
readline.createInterface({input:process.stdin}).on('line',l=>{
 const x=JSON.parse(l);fs.appendFileSync(trace,JSON.stringify(x)+'\n');
 const result=r=>send({id:x.id,result:r});
 if(x.method==='initialize') result({});
 if(x.method==='account/read') result({account:{type:mode==='api-key'?'apiKey':'chatgpt'}});
 if(x.method==='config/read') result({config:{model:'fixture-model'}});
 if(x.method==='thread/start') {
  thread='fixture-thread';
  if(!x.params.developerInstructions.includes('Skeleton Surface')) throw new Error('instructions missing');
  if(x.params.config.default_permissions!=='n8r_source_tools') throw new Error('permissions missing');
  result({thread:{id:thread,ephemeral:true,environments:[]},model:'fixture-model',modelProvider:'openai',approvalPolicy:'never',activePermissionProfile:{id:'n8r_source_tools'},sandbox:{type:'readOnly',networkAccess:false}});
 }
 if(x.method==='turn/start') {
  count++;
  if(mode==='malformed-start'){result({turn:{}});return;}
  if(mode==='stale' && count===2){
   send({method:'turn/completed',params:{threadId:thread,turn:{id:'turn-1',status:'completed'}}});
   send({id:'stale-tool',method:'item/tool/call',params:{threadId:thread,turnId:'turn-1',tool:'source_read',arguments:{path:'case.md'}}});
  }
  result({turn:{id:'turn-'+count}});
  if(mode==='auth-change'){send({method:'account/updated',params:{authMode:'apikey'}});return;}
  if(mode==='missing-event'){send({method:'turn/completed',params:{turn:{id:'turn-'+count,status:'completed'}}});return;}
  send({method:'turn/started',params:{threadId:thread,turn:{id:'turn-'+count}}});
  if(mode==='failure') {send({method:'turn/completed',params:{threadId:thread,turn:{id:'turn-'+count,status:'failed',error:{message:'PRIVATE_VALUE_MUST_NOT_APPEAR'}}}});return;}
  if(mode==='cancel'||mode==='eof-active') {send({method:'item/completed',params:{threadId:thread,turnId:'turn-'+count,item:{type:'agentMessage',text:'TEST_TURN_ACTIVE'}}});return;}
  send({id:'tool-'+count,method:'item/tool/call',params:{threadId:thread,turnId:'turn-'+count,tool:'source_read',arguments:{path:mode==='outside'?'../outside.txt':'case.md'}}});
 }
 if(String(x.id).startsWith('tool-')) {
  const text=JSON.stringify(x.result);
  if(mode==='outside') {if(x.result.success!==false || text.includes('OUTSIDE_SCOPE_SENTINEL'))throw new Error('scope escaped');}
  else if(!text.includes('ACTUAL_SYNTHETIC_SOURCE_BYTES'))throw new Error('not actual source bytes');
  send({method:'item/completed',params:{threadId:thread,turnId:'turn-'+count,item:{type:'agentMessage',text:'TEST_RESPONSE_'+count}}});
  send({method:'turn/completed',params:{threadId:thread,turn:{id:'turn-'+count,status:'completed'}}});
 }
 if(x.method==='turn/interrupt') {result({});send({method:'turn/completed',params:{threadId:thread,turn:{id:'turn-'+count,status:'interrupted'}}});}
});
'''.replace('MODE', json.dumps(mode)).replace('TRACE', json.dumps(str(trace)))
    fake = bin_dir / 'codex'
    fake.write_text(program)
    fake.chmod(0o755)
    before = settings.read_bytes(), source_file.read_bytes()
    master, slave = pty.openpty()
    env = {**os.environ, 'HOME': str(home), 'OPENAI_API_KEY': 'PRIVATE_VALUE_MUST_NOT_APPEAR',
           'PATH': os.pathsep.join([str(bin_dir), str(Path(node).parent), os.environ['PATH']])}
    child = subprocess.Popen([node, entry, 'discover', str(source)], env=env,
                             stdin=slave, stdout=slave, stderr=slave, cwd=home)
    os.close(slave)
    output = b''
    cursor = sent = 0
    deadline = time.monotonic() + 12
    try:
        while True:
            assert time.monotonic() < deadline, ('hung', mode, output.decode())
            if select.select([master], [], [], .05)[0]:
                try:
                    chunk = os.read(master, 65536)
                except OSError as error:
                    if error.errno == errno.EIO:
                        break
                    raise
                if not chunk:
                    break
                output += chunk
                if sent < len(answers):
                    at = output.find(answers[sent][0], cursor)
                    if at >= 0:
                        cursor = at + len(answers[sent][0])
                        answer = answers[sent][1]
                        if answer == 'SIGINT':
                            child.send_signal(signal.SIGINT)
                        else:
                            os.write(master, answer)
                        sent += 1
            elif child.poll() is not None:
                break
        assert child.wait(timeout=2) == expected, (mode, child.returncode, output.decode())
        assert sent == len(answers), (mode, output.decode())
        assert b'PRIVATE_VALUE_MUST_NOT_APPEAR' not in output
        assert b'OUTSIDE_SCOPE_SENTINEL' not in output
        assert (settings.read_bytes(), source_file.read_bytes()) == before
        assert not list(vault.rglob('*.*'))
        records = [json.loads(l) for l in trace.read_text().splitlines()] if trace.exists() else []
        if mode == 'refuse':
            assert not records, 'runner launched before acceptance'
        if mode == 'api-key':
            assert not any(r.get('method') == 'thread/start' for r in records)
        if mode in ('continue', 'stale'):
            turns = [r for r in records if r.get('method') == 'turn/start']
            assert len(turns) == 2 and len({r['params']['threadId'] for r in turns}) == 1
            assert b'TEST_RESPONSE_2' in output
        if mode == 'stale':
            assert any(r.get('id') == 'stale-tool' and r.get('result', {}).get('success') is False for r in records)
        for record in records:
            if 'pid' in record:
                try:
                    os.kill(record['pid'], 0)
                except ProcessLookupError:
                    continue
                raise AssertionError(('runner still alive', record['pid']))
        print('PASS offline discovery terminal:', mode)
    finally:
        if child.poll() is None:
            child.kill()
            child.wait()
        os.close(master)


node = sys.argv[1]
entry = os.environ.get('N8R_TEST_ENTRY') or str(Path(os.environ['N8R_TEST_BIN_DIR']) / 'n8r-surface')
confirm = b'[y/N]'
prompt = b'You>'
with tempfile.TemporaryDirectory(prefix='n8r-discovery-pty-') as temporary:
    root = Path(temporary)
    cases = [
        ('refuse', [(confirm, b'n\n')], 1),
        ('api-key', [(confirm, b'y\n')], 2),
        ('continue', [(confirm, b'y\n'), (prompt, b'first\n'), (prompt, b'correction\n'), (prompt, b'/exit\n')], 0),
        ('outside', [(confirm, b'y\n'), (prompt, b'check scope\n'), (prompt, b'/exit\n')], 0),
        ('stale', [(confirm, b'y\n'), (prompt, b'first\n'), (prompt, b'second\n'), (prompt, b'/exit\n')], 0),
        ('malformed-start', [(confirm, b'y\n'), (prompt, b'question\n')], 2),
        ('auth-change', [(confirm, b'y\n'), (prompt, b'question\n')], 2),
        ('missing-event', [(confirm, b'y\n'), (prompt, b'question\n')], 2),
        ('failure', [(confirm, b'y\n'), (prompt, b'question\n')], 2),
        ('cancel', [(confirm, b'y\n'), (prompt, b'question\n'), (b'TEST_TURN_ACTIVE', 'SIGINT')], 130),
        ('eof-active', [(confirm, b'y\n'), (prompt, b'question\n'), (b'TEST_TURN_ACTIVE', b'\x04')], 1),
        ('cancel-connect', [(confirm, b'y\n'), (b'Connecting to Codex', 'SIGINT')], 130),
        ('eof-prompt', [(confirm, b'y\n'), (prompt, b'\x04')], 0),
    ]
    for mode, answers, expected in cases:
        terminal(root, entry, node, mode, answers, expected)
