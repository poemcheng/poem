"""Assemble inspectable source fragments; verify the reviewed snapshot before build.
Existing editable app.js wins after first publication. Fragment restoration is only
needed for this initial connector transfer; ordinary edits use the normal source.
"""
from pathlib import Path
import hashlib, subprocess, sys
ROOT=Path(__file__).resolve().parents[2]
APP=ROOT/'quality-collaboration-lab'
source=APP/'app.js'
if not source.exists():
    parts=[Path(__file__).parent/f'app.part{i}' for i in range(3)]
    data=b''.join(p.read_bytes() for p in parts)
    expected='adbc54b5b5a0e4240425ee61e71c975565b7ef1408dc08aa189a29276766258e'
    actual=hashlib.sha256(data).hexdigest()
    if actual!=expected: raise RuntimeError(f'UI transfer hash mismatch: {actual}')
    source.write_bytes(data)
    checks={'core.js':'e8227cd4d79e1729920ba84b2eae49e9a1e5e2dad8b6f6160ca0125b9575d52f','style.css':'0a3521e9e097dc8fea5fb7ef3eb75336888943cb7a164db69b57739819440595','build.py':'d0b5066c110a8851deefef2453148951792570635592af791dc43e4e240b3584'}
    for name, expected in checks.items():
        actual=hashlib.sha256((APP/name).read_bytes()).hexdigest()
        if actual!=expected: raise RuntimeError(f'{name} transfer hash mismatch: {actual}')
subprocess.run([sys.executable,str(APP/'build.py')],check=True)
