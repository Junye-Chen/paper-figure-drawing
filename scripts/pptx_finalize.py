"""Group editable OOXML objects without changing their slide coordinates."""
import json
import sys
import zipfile
from pathlib import Path
import xml.etree.ElementTree as ET

NS={'p':'http://schemas.openxmlformats.org/presentationml/2006/main','a':'http://schemas.openxmlformats.org/drawingml/2006/main'}
for prefix,uri in NS.items(): ET.register_namespace(prefix,uri)
def tag(prefix,name): return '{'+NS[prefix]+'}'+name

def group_pptx(filename, manifest):
    filename=Path(filename)
    with zipfile.ZipFile(filename) as z: contents={n:z.read(n) for n in z.namelist()}
    root=ET.fromstring(contents['ppt/slides/slide1.xml']); tree=root.find('p:cSld/p:spTree',NS)
    groups=manifest['groups']
    pictures=tree.findall('p:pic',NS)
    if len(pictures)!=len(manifest['images']):raise ValueError('Image count mismatch')
    for pic,name in zip(pictures,manifest['images']):
        prop=pic.find('p:nvPicPr/p:cNvPr',NS);prop.set('name',name);prop.set('descr',name)
    def named():
        result={}
        for el in list(tree):
            prop=el.find('.//p:cNvPr',NS)
            if prop is not None:
                result[prop.get('name')]=el
                # Artifact image names may be generated; alt carries our stable ID.
                if prop.get('descr'): result[prop.get('descr')]=el
        return result
    next_id=max(int(e.get('id','0')) for e in root.findall('.//p:cNvPr',NS))+1
    pending=list(groups)
    while pending:
        progressed=False
        for g in pending[:]:
            names=named()
            if not all(c in names for c in g['children']):continue
            members=[names[c] for c in g['children']]
            if not members: raise ValueError('Empty group: '+g['id'])
            # Child coordinates are absolute. Identity group transform preserves them.
            xs=[];ys=[];rights=[];bottoms=[]
            for member in members:
                xfrm=member.find('p:spPr/a:xfrm',NS) or member.find('p:grpSpPr/a:xfrm',NS)
                if xfrm is None: raise ValueError('Missing transform: '+g['id'])
                off=xfrm.find('a:off',NS); ext=xfrm.find('a:ext',NS)
                x,y=int(off.get('x')),int(off.get('y'));w,h=int(ext.get('cx')),int(ext.get('cy'))
                xs.append(x);ys.append(y);rights.append(x+w);bottoms.append(y+h)
            x,y=min(xs),min(ys);w,h=max(1,max(rights)-x),max(1,max(bottoms)-y)
            el=ET.Element(tag('p','grpSp')); nv=ET.SubElement(el,tag('p','nvGrpSpPr'))
            ET.SubElement(nv,tag('p','cNvPr'),id=str(next_id),name=g['id']);next_id+=1
            ET.SubElement(nv,tag('p','cNvGrpSpPr'));ET.SubElement(nv,tag('p','nvPr'))
            props=ET.SubElement(el,tag('p','grpSpPr'));tr=ET.SubElement(props,tag('a','xfrm'))
            for name,attrs in [('off',{'x':x,'y':y}),('ext',{'cx':w,'cy':h}),('chOff',{'x':x,'y':y}),('chExt',{'cx':w,'cy':h})]:
                ET.SubElement(tr,tag('a',name),{k:str(v) for k,v in attrs.items()})
            index=min(list(tree).index(m) for m in members)
            for m in members:tree.remove(m);el.append(m)
            tree.insert(index,el);pending.remove(g);progressed=True
        if not progressed:raise ValueError('Unresolved group members: '+str(pending))
    contents['ppt/slides/slide1.xml']=ET.tostring(root,encoding='utf-8',xml_declaration=True)
    temp=filename.with_suffix('.grouped.tmp')
    with zipfile.ZipFile(temp,'w',zipfile.ZIP_DEFLATED) as z:
        for name,data in contents.items():z.writestr(name,data)
    temp.replace(filename)
    return {'groups':len(groups),'text_runs':len(root.findall('.//a:t',NS))}

if __name__=='__main__':
    print(json.dumps(group_pptx(sys.argv[1],json.loads(Path(sys.argv[2]).read_text(encoding='utf-8')))))
