"""Upload deliverables to the R2 bucket and write src/data/files.json (slug -> list of {key, name, size}).
Source folder: ../entregables/<slug>/<file>. Run after `npx wrangler login`. Re-run to add new products or new versions.
Usage: python scripts/upload-files.py [slug ...]   (no args = every folder)"""
import os, sys, json, subprocess
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
SRC = os.path.abspath(os.path.join(ROOT, '..', 'entregables'))
BUCKET = 'icemanstudio-files'
MANIFEST = os.path.join(ROOT, 'src', 'data', 'files.json')
manifest = json.load(open(MANIFEST, encoding='utf-8')) if os.path.exists(MANIFEST) else {}
slugs = sys.argv[1:] or sorted(d for d in os.listdir(SRC) if os.path.isdir(os.path.join(SRC, d)))
for slug in slugs:
    folder = os.path.join(SRC, slug)
    files = sorted(f for f in os.listdir(folder) if os.path.isfile(os.path.join(folder, f)))
    if not files:
        print('skip (empty):', slug); continue
    entries = []
    for f in files:
        path = os.path.join(folder, f); size = os.path.getsize(path); key = f'{slug}/{f}'
        print(f'upload {key} ({size/1048576:.1f} MB) ...', flush=True)
        r = subprocess.run(['npx.cmd' if os.name == 'nt' else 'npx', 'wrangler', 'r2', 'object', 'put', f'{BUCKET}/{key}', '--file', path, '--jurisdiction', 'eu', '--remote'], cwd=ROOT, capture_output=True, text=True, encoding='utf-8', errors='replace')
        if r.returncode != 0:
            print('  FAILED:', (r.stderr or r.stdout)[-400:]); continue
        entries.append({'key': key, 'name': f, 'size': size})
    if entries:
        manifest[slug] = entries
        json.dump(manifest, open(MANIFEST, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
        print('  ok', slug, len(entries), 'file(s)')
print('manifest:', {k: len(v) for k, v in manifest.items()})
