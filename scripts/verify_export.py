"""Check exported scene inventory/text/groups and SVG portability (not visual quality)."""
import json
import sys
import zipfile
from pathlib import Path
import xml.etree.ElementTree as ET

NS={'p':'http://schemas.openxmlformats.org/presentationml/2006/main','a':'http://schemas.openxmlformats.org/drawingml/2006/main','s':'http://www.w3.org/2000/svg'}
def walk(nodes):
    for n in nodes:
        yield n
        if n['type']=='group':yield from walk(n['children'])

def verify(folder):
    folder=Path(folder);scene=json.loads((folder/'scene.json').read_text(encoding='utf-8'))
    nodes=list(walk(scene['nodes'])); errors=[]; report={}
    if (folder/'figure.svg').exists():
        root=ET.parse(folder/'figure.svg').getroot();ids={e.get('id'):e for e in root.iter() if e.get('id')}
        for n in nodes:
            e=ids.get(n['id'])
            if e is None:errors.append('SVG missing '+n['id']);continue
            if n['type']=='text' and '\n'.join(t.text or '' for t in e.findall('s:tspan',NS))!=n['text']:errors.append('SVG text mismatch '+n['id'])
            if n['type']=='image' and not e.get('href','').startswith('data:image/'):errors.append('SVG external image '+n['id'])
        report['svg_objects']=len(ids)
    if (folder/'figure.pptx').exists():
        with zipfile.ZipFile(folder/'figure.pptx') as z:
            if z.testzip():errors.append('PPTX ZIP CRC failure')
            root=ET.fromstring(z.read('ppt/slides/slide1.xml'))
        ids={}
        for e in root.iter():
            if e.tag not in ['{'+NS['p']+'}'+t for t in ['sp','pic','grpSp','cxnSp']]:continue
            prop=e.find('.//p:cNvPr',NS)
            if prop is not None:
                ids[prop.get('name')]=e
                if prop.get('descr'):ids[prop.get('descr')]=e
        for n in nodes:
            e=ids.get(n['id'])
            if e is None:errors.append('PPTX missing '+n['id']);continue
            if n['type']=='text':
                paragraphs=e.findall('p:txBody/a:p',NS)
                text='\n'.join(''.join(t.text or '' for t in p.findall('.//a:t',NS)) for p in paragraphs)
                if text!=n['text']:errors.append('PPTX text mismatch '+n['id']+': '+repr(text))
            if n['type']=='group' and e.tag!='{'+NS['p']+'}grpSp':errors.append('Not native group '+n['id'])
        report['pptx_objects']=len(ids)
    report['errors']=errors
    return report

if __name__=='__main__':
    report=verify(sys.argv[1]);print(json.dumps(report,indent=2));sys.exit(bool(report['errors']))
