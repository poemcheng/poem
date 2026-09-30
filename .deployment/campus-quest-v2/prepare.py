"""Assemble Pages while preserving the existing RailSlope public root."""
from pathlib import Path
import hashlib, json, os, shutil
ROOT = Path(__file__).resolve().parents[2]
APP = ROOT / 'campus-quest-v2'
SITE = ROOT / '_site'

def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

if SITE.exists():
    shutil.rmtree(SITE)
shutil.copytree(ROOT / 'railslope-ai', SITE)
DEST = SITE / 'campus-quest-v2'
DEST.mkdir()
for name in ('index.html', 'style.css', 'assets', 'data', 'src', 'docs', 'README.md'):
    source = APP / name
    if source.is_dir():
        shutil.copytree(source, DEST / name)
    elif source.is_file():
        shutil.copy2(source, DEST / name)
(SITE / '.nojekyll').touch()
manifest = {
    'app': 'CYUT Campus Quest Realistic v2',
    'source_commit': os.environ.get('GITHUB_SHA', 'local'),
    'run_id': os.environ.get('GITHUB_RUN_ID', 'local'),
    'physicalQuest3Tested': False,
    'root_index_sha256': sha(SITE / 'index.html'),
    'files': {str(p.relative_to(DEST)): sha(p) for p in DEST.rglob('*') if p.is_file()}
}
(DEST / 'release.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')
print(f"Built {len(manifest['files'])} campus files; original root index preserved.")
