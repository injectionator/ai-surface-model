"""Run the installed bin in a real POSIX terminal; Python is a test-only dependency."""
import errno
import json
import os
from pathlib import Path
import pty
import select
import subprocess
import sys
import tempfile
import time


def snapshot(root):
    return {str(p.relative_to(root)): (p.read_bytes(), p.stat().st_mode, p.stat().st_mtime_ns)
            for p in root.rglob('*') if p.is_file()}


with tempfile.TemporaryDirectory(prefix='n8r-pty-') as temporary:
    home = Path(temporary)
    (home / '.n8r').mkdir()
    folder = home / 'n8r/artifacts'
    folder.mkdir(parents=True)
    (home / '.n8r/n8r-surface.json').write_text(json.dumps({
        'version': 1, 'artefactRoot': '~/n8r/artifacts', 'surfaceFormat': 'json',
        'private': 'PRIVATE_VALUE_MUST_NOT_APPEAR'}))
    (folder / 'librechat-uniqueid.json').write_text(json.dumps({
        'contract': 'n8r.surface/0.1', 'id': 'urn:surface:librechat-uniqueid',
        'title': 'LibreChat', 'scope': 'Synthetic startup fixture; no research performed',
        'revision': {'id': 'r1', 'parent': None, 'createdAt': '2026-11-04T00:00:00Z',
                     'author': 'Synthetic author', 'reason': 'Startup verification'},
        'extensions': {}, 'kind': 'definition', 'records': [], 'vocabularies': [],
        'nodes': [], 'relationships': [], 'requirements': [], 'coverage': [], 'gaps': []}))
    before = snapshot(home)
    # Check both a real answer and Ctrl-D at the question. Nothing may be written.
    for answer in (b'y\n', b'\x04'):
        master, slave = pty.openpty()
        env = {'HOME': temporary, 'USERPROFILE': temporary, 'LANG': 'C',
               'PATH': os.pathsep.join([os.environ['N8R_TEST_BIN_DIR'],
                                       str(Path(sys.argv[1]).parent), os.environ['PATH']])}
        child = subprocess.Popen(['n8r-surface'], cwd=home, env=env,
                                 stdin=slave, stdout=slave, stderr=slave)
        os.close(slave)
        output = b''
        answered = False
        deadline = time.monotonic() + 10
        try:
            while True:
                assert time.monotonic() < deadline, 'interactive startup hung'
                if select.select([master], [], [], 0.1)[0]:
                    try:
                        chunk = os.read(master, 65536)
                    except OSError as error:
                        if error.errno == errno.EIO:
                            break
                        raise
                    if not chunk:
                        break
                    output += chunk
                    if b'Show setup requirements? [y/N]' in output and not answered:
                        text = output.decode()
                        assert text.index('Configuration') < text.index('Processes') < text.index('Local artefacts (1)') < text.index('Show setup requirements?')
                        assert 'LibreChat | Surface definition | ' in text
                        assert str(folder / 'librechat-uniqueid.json') in text
                        assert child.poll() is None, 'no live question to answer'
                        os.write(master, answer)
                        answered = True
                elif child.poll() is not None:
                    break
            code = child.wait(timeout=2)
            assert answered, 'guidance question never appeared'
            assert code == 1, (code, output.decode())
            assert b'PRIVATE_VALUE_MUST_NOT_APPEAR' not in output
            if answer == b'y\n':
                assert b'No settings have been changed' in output
                # Keep a publishable readback; runtime-only PID/time are labelled.
                text = output.decode().replace('\r', '').replace(temporary, '~')
                import re
                text = re.sub(r'\x1b\[[0-9;]*[A-Za-z]', '', text)
                text = re.sub(r'PID \d+', 'PID <observed PID>', text)
                text = re.sub(r'observed \d{4}-[^\n]+', 'observed <UTC timestamp>', text)
                print(text)
            assert snapshot(home) == before, 'startup changed files'
            assert sorted(str(p.relative_to(home)) for p in home.rglob('*') if p.is_dir()) == ['.n8r', 'n8r', 'n8r/artifacts']
        finally:
            if child.poll() is None:
                child.kill()
                child.wait()
            os.close(master)
    print('Installed PTY startup passed: overview before question, y and EOF, unchanged files.')
