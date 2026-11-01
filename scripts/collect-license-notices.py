"""Retain notices from installed packages without claiming rights to third-party media."""
from pathlib import Path
import json, hashlib
root=Path(__file__).resolve().parents[2]
for project in sorted(root.glob('roast-*')):
    modules=project/'frontend/node_modules'
    if not modules.exists():continue
    notices=['Roast & Reverb — installed frontend dependency notices\nGenerated: 2026-11-01. Package licenses apply to their respective code.\nThis file does not grant rights to external music, product photography, or user uploads.\n']
    packages=list(modules.glob('*/package.json'))+list(modules.glob('@*/*/package.json'))
    for metadata in sorted(packages):
        package=json.loads(metadata.read_text(encoding='utf-8'))
        license_files=[p for p in metadata.parent.iterdir() if p.is_file() and p.name.lower().startswith(('license','licence','copying','notice'))]
        notices.append('\n'+'='*70+'\n'+str(package.get('name'))+' '+str(package.get('version'))+' | declared license: '+str(package.get('license','not declared'))+'\n')
        if not license_files:notices.append('No root license text in installed package; refer to its upstream distribution.\n')
        for path in sorted(license_files):notices.append('\n'+path.name+'\n'+path.read_text(encoding='utf-8',errors='replace')+'\n')
    output=project/'frontend/public/third-party/frontend-notices.txt'
    output.parent.mkdir(parents=True,exist_ok=True)
    output.write_text('\n'.join(line.rstrip() for line in ''.join(notices).splitlines()).rstrip()+'\n',encoding='utf-8')
    assets=[]
    for p in sorted((project/'frontend/public/images').glob('*')):
        if p.is_file():assets.append({'file':p.name,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'provenance':'Project-generated editorial artwork; see docs/design-guide.md. Not an official product or album photo.'})
    audit=project/'docs/privacy-asset-inventory.json'
    audit.parent.mkdir(parents=True,exist_ok=True)
    audit.write_text(json.dumps({'date':'2026-11-01','fonts':'System fonts; Google Fonts automatic stylesheet requests removed.','images':assets,'limitations':'Project creation records are provenance evidence, not a third-party rights clearance. Uploaded photos and external media require their own rights.'},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(project.name,len(packages),'package notices',len(assets),'images')
