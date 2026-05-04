#!/usr/bin/env python3
"""
Bakes your saved data into the deployable HTML files.

Usage:
  1. In admin.html click EXPORT — saves gold-miners-data.json to your Downloads.
  2. Move that file into this folder (next to bake.py).
  3. Run:  python3 bake.py
  4. Deploy index.html + admin.html to Vercel.
"""

import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(ROOT, 'gold-miners-data.json')

def read(p):
    with open(p) as f: return f.read()

def write(p, s):
    with open(p, 'w') as f: f.write(s)

def main():
    if not os.path.exists(DATA_FILE):
        print(f'ERROR: {DATA_FILE} not found.')
        print('In admin.html click EXPORT and move the downloaded JSON into this folder.')
        sys.exit(1)

    with open(DATA_FILE) as f:
        data = json.load(f)

    css = read(os.path.join(ROOT, 'styles.css'))
    js = read(os.path.join(ROOT, 'script.js'))
    admin_css = read(os.path.join(ROOT, 'admin.css'))
    admin_js = read(os.path.join(ROOT, 'admin.js'))

    # Strip any prior inline <style> / <script> blocks from the HTML files
    def rebuild(p):
        h = read(p)
        h = re.sub(r'<style>\s*\n.*?\n\s*</style>', '', h, flags=re.DOTALL)
        h = re.sub(r'<script>\s*\n.*?\n\s*</script>', '', h, flags=re.DOTALL)
        return h

    idx = rebuild(os.path.join(ROOT, 'index.html'))
    adm = rebuild(os.path.join(ROOT, 'admin.html'))

    # Embed the baked data as a global before the main script runs
    baked_script = f'<script>window.GOLDMINERS_BAKED = {json.dumps(data)};</script>'

    idx = idx.replace('</head>',
        f'<style>\n{css}\n</style>\n{baked_script}\n</head>'
    ).replace('</body>',
        f'<script>\n{js}\n</script>\n</body>'
    )

    adm = adm.replace('</head>',
        f'<style>\n{css}\n</style>\n<style>\n{admin_css}\n</style>\n{baked_script}\n</head>'
    ).replace('</body>',
        f'<script>\n{js}\n</script>\n<script>\n{admin_js}\n</script>\n</body>'
    )

    write(os.path.join(ROOT, 'index.html'), idx)
    write(os.path.join(ROOT, 'admin.html'), adm)

    counts = {k: len(v) for k, v in data.items() if isinstance(v, list)}
    print('Baked:')
    for k, n in counts.items():
        print(f'  {k}: {n}')
    print('Settings:')
    for k, v in (data.get('settings') or {}).items():
        print(f'  {k}: {v}')
    print('\nDone. Deploy gold-miners/ to Vercel.')

if __name__ == '__main__':
    main()
