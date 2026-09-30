"""Restore the delivered v2 sources; never overwrite an existing editable app.
The bootstrap is hash-verified. Two identified transport errors are repaired
only when their exact incoming Git blob hashes match, then normalized on disk.
"""
from pathlib import Path, PurePosixPath
import base64, gzip, hashlib, json

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
DEST = ROOT / 'campus-quest-v2'
EXPECTED = '39d4cb30fdd4fb49877be1d46e879a144ee11306cc511caa664cbb067e02d56a'
RAW_EXPECTED = 'c50e88edb58e37339a731aa2d3456c81867a850fc189a09ccac79a08fa5bac65'

def blob_sha(data):
    return hashlib.sha1(b'blob ' + str(len(data)).encode() + b'\0' + data).hexdigest()

def main():
    parts = []
    for n in range(1, 11):
        path = HERE / f'source.part{n:02d}'
        data = path.read_bytes()
        sha = blob_sha(data)
        if sha == 'bff42407ea93976c6610d52582b46092822fee5c':
            text = base64.b64encode(data).decode().replace('MzerYY+m', 'MzerY+m') + 'A'
            data = base64.b64decode(text, validate=True)
            assert blob_sha(data) == 'd123ff3a49461b385bc86c3809586c486315a988'
        elif sha == 'ab3e2bfa25224f15d455932e832dd23df66424b9':
            text = base64.b64encode(data).decode().rstrip('=')
            text = text.replace('Pz558YIv+/APZ', 'Pz558Y+/APZ')
            text = text[:-64] + 'e7UOaMW0aNQ66owT+N0relwKx/siQSPzHasjte+U8MJtarjBh5AXsmqoMkiuiStB'
            data = base64.b64decode(text, validate=True)
            assert blob_sha(data) == '9bf58209ac7062d68761480cb8e5ee2d56a15ae3'
        parts.append((path, data))
    archive = b''.join(data for _, data in parts)
    if hashlib.sha256(archive).hexdigest() != EXPECTED:
        raise ValueError('Bootstrap integrity check failed; no source was written.')
    raw = gzip.decompress(archive)
    if hashlib.sha256(raw).hexdigest() != RAW_EXPECTED:
        raise ValueError('Source manifest integrity check failed.')
    sources = json.loads(raw)
    for name, content in sources.items():
        relative = PurePosixPath(name)
        if relative.is_absolute() or '..' in relative.parts or not isinstance(content, str):
            raise ValueError(f'Unsafe source path: {name}')
    for path, data in parts:
        path.write_bytes(data)
    existing = [(DEST / name).exists() for name in sources]
    if any(existing) and not all(existing):
        raise RuntimeError('Partial app exists; reconcile missing source files before restore.')
    if all(existing):
        print('Existing editable app preserved; bootstrap integrity verified.')
    else:
        for name, content in sources.items():
            target = DEST / name
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(content, encoding='utf-8')
        print(f'Restored {len(sources)} exact source files; SHA-256 verified.')
    for folder in ('assets/textures', 'docs'):
        (DEST / folder).mkdir(parents=True, exist_ok=True)
    if not (DEST / 'README.md').exists():
        (DEST / 'README.md').write_text((HERE / 'README.md').read_text(encoding='utf-8'), encoding='utf-8')

if __name__ == '__main__':
    main()
