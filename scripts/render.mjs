#!/usr/bin/env node
/** Shared-scene exporter. No network, credentials, or generated raster evidence. */
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';

const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const finite = n => typeof n === 'number' && Number.isFinite(n);
const box = n => ({left:n.x,top:n.y,width:n.w,height:n.h});
export function flatten(nodes, result=[]) { for(const n of nodes){result.push(n); if(n.type==='group') flatten(n.children,result);} return result; }
export function endpoint(n,side='right') {
  return ({left:[n.x,n.y+n.h/2],right:[n.x+n.w,n.y+n.h/2],top:[n.x+n.w/2,n.y],bottom:[n.x+n.w/2,n.y+n.h]})[side];
}
export function route(n, map) {
  if(n.type==='path') return n.points;
  return [endpoint(map.get(n.from.id),n.from.side),...(n.via||[]),endpoint(map.get(n.to.id),n.to.side)];
}
export function validate(scene) {
  const errors=[], warnings=[];
  if(scene.version!==1) errors.push('version must be 1');
  if(!scene.canvas || !finite(scene.canvas.width)||!finite(scene.canvas.height)||scene.canvas.width<=0||scene.canvas.height<=0) errors.push('positive canvas dimensions required');
  if(scene.canvas?.background!==undefined&&!/^#[0-9a-fA-F]{6}$/.test(scene.canvas.background)) errors.push('canvas background must be #RRGGBB');
  if(scene.style?.fontSize!==undefined&&(!finite(scene.style.fontSize)||scene.style.fontSize<=0)) errors.push('style.fontSize must be positive');
  if(!Array.isArray(scene.nodes)) return {errors:[...errors,'nodes must be an array'],warnings};
  const nodes=[];
  function walk(ns) {for(const n of ns){ if(!n||typeof n!=='object'){errors.push('node must be object');continue;} nodes.push(n);if(n.type==='group'){if(!Array.isArray(n.children)) errors.push(`${n.id}: children must be array`);else walk(n.children);}}}
  walk(scene.nodes);
  const map=new Map();
  for(const n of nodes){
    if(typeof n.id!=='string'||!/^[-A-Za-z_][\w.-]*$/.test(n.id)||n.id.includes('__')) errors.push(`invalid id: ${n.id}; use unique ASCII id without __`);
    if(map.has(n.id)) errors.push(`duplicate id: ${n.id}`); map.set(n.id,n);
    if(!['group','rect','ellipse','text','image','path','connector'].includes(n.type)) errors.push(`${n.id}: unsupported type ${n.type}`);
    if(n.lock!==undefined&&!['all','semantic'].includes(n.lock)) errors.push(`${n.id}: invalid lock`);
    if(n.type==='group') {if(!n.children?.length)errors.push(`${n.id}: group must contain objects`);continue;}
    if(!['path','connector'].includes(n.type)) {
      if(!['x','y','w','h'].every(k=>finite(n[k]))||n.w<=0||n.h<=0) errors.push(`${n.id}: invalid box`);
      else if(n.x<0||n.y<0||n.x+n.w>scene.canvas?.width||n.y+n.h>scene.canvas?.height) errors.push(`${n.id}: outside canvas`);
    }
    for(const k of ['fill','stroke','color']) if(n[k]!==undefined&&!/^(#[0-9a-fA-F]{6}|none)$/.test(n[k])) errors.push(`${n.id}: ${k} must be #RRGGBB or none`);
    if(n.strokeWidth!==undefined&&(!finite(n.strokeWidth)||n.strokeWidth<0)) errors.push(`${n.id}: invalid strokeWidth`);
    if(n.radius!==undefined&&(!finite(n.radius)||n.radius<0)) errors.push(`${n.id}: invalid radius`);
    if(n.arrowSize!==undefined&&(!finite(n.arrowSize)||n.arrowSize<=0)) errors.push(`${n.id}: invalid arrowSize`);
    if(n.type==='text') {
      if(typeof n.text!=='string') errors.push(`${n.id}: text must be string`);
      if(n.fontSize!==undefined&&(!finite(n.fontSize)||n.fontSize<=0)) errors.push(`${n.id}: invalid fontSize`);
      if(n.align&&!['left','center','right'].includes(n.align)) errors.push(`${n.id}: invalid align`);
    }
    if(n.type==='image'&&(typeof n.src!=='string'||/^[a-z]+:\/\//i.test(n.src))) errors.push(`${n.id}: local image src required`);
    if(n.type==='image'&&n.fit&&!['contain','stretch'].includes(n.fit)) errors.push(`${n.id}: fit supports contain or stretch; crop source explicitly`);
    if(n.type==='path'&&(!Array.isArray(n.points)||n.points.length<2||n.points.some(p=>!Array.isArray(p)||p.length!==2||!p.every(finite)))) errors.push(`${n.id}: path needs finite point pairs`);
    if(n.status==='needs-fix') warnings.push(`${n.id}: unresolved inventory item`);
    if(n.placeholder) warnings.push(`${n.id}: placeholder present`);
  }
  for(const n of nodes.filter(n=>n.type==='connector')) {
    for(const k of ['from','to']) {
      const ref=n[k], target=map.get(ref?.id);
      if(!target||!['rect','ellipse','text','image'].includes(target.type)) errors.push(`${n.id}: ${k} must reference boxed node`);
      if(!['left','right','top','bottom'].includes(ref?.side)) errors.push(`${n.id}: explicit ${k}.side required`);
    }
    if(n.via&&(!Array.isArray(n.via)||n.via.some(p=>!Array.isArray(p)||p.length!==2||!p.every(finite)))) errors.push(`${n.id}: invalid via points`);
  }
  if(!errors.length) for(const n of nodes.filter(n=>['path','connector'].includes(n.type))) {
    const pts=route(n,map);
    if(pts.some(([x,y])=>x<0||y<0||x>scene.canvas.width||y>scene.canvas.height)) errors.push(`${n.id}: path outside canvas`);
    if(pts.every(p=>p[0]===pts[0][0]&&p[1]===pts[0][1])) errors.push(`${n.id}: zero length path`);
  }
  return {errors,warnings};
}
export function protectedChanges(before,after) {
  const next=new Map(flatten(after.nodes).map(n=>[n.id,n])); const changed=[];
  const semantic=['type','text','src','role','source','from','to','sampleId'];
  for(const n of flatten(before.nodes)) if(n.lock) {
    const m=next.get(n.id);
    if(!m){changed.push(`${n.id}: removed`);continue;}
    if(n.lock==='all') {if(JSON.stringify(n)!==JSON.stringify(m)) changed.push(`${n.id}: locked object changed`);}
    else for(const k of semantic) if(JSON.stringify(n[k])!==JSON.stringify(m[k])) changed.push(`${n.id}: ${k} changed`);
  }
  return changed;
}
function arrowPoints(points, size=7) {
  const b=points.at(-1); let a=points.at(-2);
  for(let i=points.length-2;i>=0;i--) if(points[i][0]!==b[0]||points[i][1]!==b[1]){a=points[i];break;}
  const dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy)||1,ux=dx/len,uy=dy/len;
  return [b,[b[0]-size*ux+size*.45*uy,b[1]-size*uy-size*.45*ux],[b[0]-size*ux-size*.45*uy,b[1]-size*uy+size*.45*ux]];
}
export function svgString(scene) {
  const map=new Map(flatten(scene.nodes).map(n=>[n.id,n]));
  function node(n) {
    const id=`id="${esc(n.id)}"`, fill=n.fill??'none', stroke=n.stroke??'#334155',sw=n.strokeWidth??1;
    const style=`fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${n.dashed?' stroke-dasharray="5 4"':''}`;
    if(n.type==='group') return `<g ${id}>${n.children.map(node).join('')}</g>`;
    if(n.type==='rect') return `<rect ${id} x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="${n.radius||0}" ${style}/>`;
    if(n.type==='ellipse') return `<ellipse ${id} cx="${n.x+n.w/2}" cy="${n.y+n.h/2}" rx="${n.w/2}" ry="${n.h/2}" ${style}/>`;
    if(n.type==='text') {
      const size=n.fontSize??scene.style?.fontSize??16, align=n.align??'left';
      const x=n.x+(align==='center'?n.w/2:align==='right'?n.w:0);
      return `<text ${id} font-family="${esc(n.fontFamily??scene.style?.fontFamily??'Arial')}" font-size="${size}" font-weight="${n.bold?'700':'400'}" fill="${n.color??'#172033'}" text-anchor="${{left:'start',center:'middle',right:'end'}[align]}" xml:space="preserve">${n.text.split('\n').map((t,i)=>`<tspan x="${x}" y="${n.y+size*.82+i*size*1.2}">${esc(t)}</tspan>`).join('')}</text>`;
    }
    if(n.type==='image') return `<image ${id} x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" preserveAspectRatio="${n.fit==='stretch'?'none':'xMidYMid meet'}" href="${n.dataUri}" xlink:href="${n.dataUri}"><title>${esc(n.alt||n.id)}</title></image>`;
    const points=route(n,map);const d=points.map(([x,y],i)=>`${i?'L':'M'}${x},${y}`).join(' ')+(n.closed?' Z':'');
    const arrow=n.arrow??(n.type==='connector');
    return `<g ${id}${n.type==='connector'?` data-from="${esc(n.from.id)}" data-to="${esc(n.to.id)}"`:''}><path d="${d}" ${style}/>${arrow?`<polygon points="${arrowPoints(points,n.arrowSize??7).map(p=>p.join(',')).join(' ')}" fill="${stroke}"/>`:''}</g>`;
  }
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${scene.canvas.width}px" height="${scene.canvas.height}px" viewBox="0 0 ${scene.canvas.width} ${scene.canvas.height}"><title>${esc(scene.title||'Paper figure')}</title><rect width="100%" height="100%" fill="${scene.canvas.background??'#FFFFFF'}"/>${scene.nodes.map(node).join('')}</svg>`;
}
function getRequire(modules) {return createRequire(path.join(path.resolve(modules),'__cvpr_loader__.cjs'));}
async function runtime(modules) {
  if(!modules) throw Error('Provide --modules with bundled Node packages directory (load_workspace_dependencies).');
  const req=getRequire(modules);
  return {artifact:await import(pathToFileURL(req.resolve('@oai/artifact-tool')).href),req};
}
async function prepared(scene,sourceDir,Canvas,loadImage) {
  const s=structuredClone(scene);const metrics=new Canvas(8,8).getContext('2d');
  for(const n of flatten(s.nodes)) {
    if(n.type==='text') {
      const size=n.fontSize??s.style?.fontSize??16;
      metrics.font=`${n.bold?'bold ':''}${size}px "${n.fontFamily??s.style?.fontFamily??'Arial'}"`;
      if(n.text.split('\n').some(t=>metrics.measureText(t).width>n.w+1)) throw Error(`${n.id}: text exceeds width; widen box or insert explicit line breaks`);
      if(n.text.split('\n').length*size*1.2>n.h+1) throw Error(`${n.id}: text exceeds height`);
    }
    if(n.type==='image') {
      const p=path.resolve(sourceDir,n.src),bytes=await fs.readFile(p), ext=path.extname(p).toLowerCase();
      const mime={'.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg'}[ext];
      if(!mime) throw Error(`${n.id}: v1 image assets must be PNG or JPEG`);
      n.dataUri=`data:${mime};base64,${bytes.toString('base64')}`;n.bytes=bytes;n.mime=mime;
      const im=await loadImage(bytes);
      if((n.fit??'contain')==='contain') {const scale=Math.min(n.w/im.width,n.h/im.height),w=im.width*scale,h=im.height*scale;n.x+=(n.w-w)/2;n.y+=(n.h-h)/2;n.w=w;n.h=h;}
    }
  }
  return s;
}
async function renderPptx(scene, artifact, out, python) {
  const {Presentation,PresentationFile}=artifact;
  const pres=Presentation.create({slideSize:{width:scene.canvas.width,height:scene.canvas.height}});
  const slide=pres.slides.add();slide.background.fill=scene.canvas.background??'#FFFFFF';
  slide.speakerNotes.text=scene.caption||scene.title||'';
  const map=new Map(flatten(scene.nodes).map(n=>[n.id,n]));const groups=[];
  function shapePath(name,points,n,closed=false) {
    const minX=Math.min(...points.map(p=>p[0])),minY=Math.min(...points.map(p=>p[1]));
    const w=Math.max(.01,...points.map(p=>p[0]-minX)),h=Math.max(.01,...points.map(p=>p[1]-minY));
    const commands=points.map(([x,y],i)=>({[i?'lineTo':'moveTo']:{x:x-minX,y:y-minY}}));if(closed)commands.push({close:{}});
    slide.shapes.add({name,geometry:'custom',position:{left:minX,top:minY,width:w,height:h},fill:n.fill??'none',line:{fill:n.stroke??'#334155',width:n.strokeWidth??1,style:n.dashed?'dashed':'solid'},customPaths:[{width:w,height:h,commands}]});
  }
  for(const n of flatten(scene.nodes)) {
    if(n.type==='group'){groups.push({id:n.id,children:n.children.map(c=>c.id)});continue;}
    if(n.type==='image'){slide.images.add({name:n.id,blob:n.bytes.buffer.slice(n.bytes.byteOffset,n.bytes.byteOffset+n.bytes.byteLength),contentType:n.mime,alt:n.id,fit:'contain',position:box(n)});continue;}
    if(['path','connector'].includes(n.type)) {
      const points=route(n,map);shapePath(n.id,points,n,n.closed);
      if(n.arrow??n.type==='connector') {shapePath(n.id+'__arrow',arrowPoints(points,n.arrowSize??7),{fill:n.stroke??'#334155',stroke:'none',strokeWidth:0},true);groups.push({id:n.id+'__bundle',children:[n.id,n.id+'__arrow']});}
      continue;
    }
    const obj=slide.shapes.add({name:n.id,geometry:n.type==='text'?'textbox':n.type,position:box(n),fill:n.type==='text'?'none':n.fill??'none',line:{fill:n.type==='text'?'none':n.stroke??'#334155',width:n.type==='text'?0:n.strokeWidth??1,style:n.dashed?'dashed':'solid'},...(n.radius?{borderRadius:n.radius}:{})});
    if(n.type==='text'){obj.text=n.text;obj.text.style={fontFamily:n.fontFamily??scene.style?.fontFamily??'Arial',fontSize:n.fontSize??scene.style?.fontSize??16,color:n.color??'#172033',bold:!!n.bold,alignment:n.align??'left',verticalAlignment:'top',insets:0,wrap:false,lineSpacing:1.2};}
  }
  // Group paths with their arrowheads before nesting semantic groups.
  const bundles=new Map(groups.filter(g=>g.id.endsWith('__bundle')).map(g=>[g.children[0],g.id]));
  for(const g of groups.filter(g=>!g.id.endsWith('__bundle')))g.children=g.children.map(id=>bundles.get(id)||id);
  const file=await PresentationFile.exportPptx(pres);await file.save(path.join(out,'figure.pptx'));
  const png=await pres.export({slide,format:'png',scale:2});await fs.writeFile(path.join(out,'figure.pptx.png'),new Uint8Array(await png.arrayBuffer()));
  await fs.writeFile(path.join(out,'groups.json'),JSON.stringify({groups,images:flatten(scene.nodes).filter(n=>n.type==='image').map(n=>n.id)}));
  const result=spawnSync(python,[path.join(path.dirname(fileURLToPath(import.meta.url)),'pptx_finalize.py'),path.join(out,'figure.pptx'),path.join(out,'groups.json')],{encoding:'utf8',windowsHide:true});
  if(result.status!==0) throw Error(`PPTX grouping failed: ${result.stderr||result.stdout||result.error}`);
}
export async function run(args) {
  const opts={formats:'pptx,svg',python:'python'};
  for(let i=0;i<args.length;i++){const a=args[i];if(a==='--allow-protected-change'||a==='--validate-only')opts[a.slice(2)]=true;else if(a.startsWith('--'))opts[a.slice(2)]=args[++i];else if(!opts.scene)opts.scene=a;else throw Error(`Unexpected argument ${a}`);}
  if(!opts.scene) throw Error('Usage: node render.mjs scene.json --out NEW_DIRECTORY --modules NODE_MODULES [--formats pptx,svg] [--python python] [--baseline accepted.json] [--allow-protected-change] [--validate-only]');
  const scenePath=path.resolve(opts.scene),scene=JSON.parse(await fs.readFile(scenePath,'utf8'));const audit=validate(scene);
  if(opts.baseline) {audit.protectedChanges=protectedChanges(JSON.parse(await fs.readFile(opts.baseline,'utf8')),scene);if(audit.protectedChanges.length&&!opts['allow-protected-change'])audit.errors.push(...audit.protectedChanges);}
  if(audit.errors.length) throw Error(audit.errors.join('\n'));
  if(opts['validate-only']){console.log(JSON.stringify(audit,null,2));return audit;}
  if(!opts.out) throw Error('--out required');
  const formats=opts.formats.split(',');if(formats.some(f=>!['pptx','svg','pdf'].includes(f)))throw Error('formats: pptx,svg,pdf');
  const out=path.resolve(opts.out);try{await fs.access(out);throw Error('Output directory exists; choose a new revision directory');}catch(e){if(e.code!=='ENOENT')throw e;}
  const {artifact,req}=await runtime(opts.modules||process.env.CVPR_NODE_MODULES);
  const artifactReq=createRequire(req.resolve('@oai/artifact-tool'));
  const {Canvas,loadImage}=artifactReq('skia-canvas');
  const ready=await prepared(scene,path.dirname(scenePath),Canvas,loadImage);
  const svg=svgString(ready);
  await fs.mkdir(out,{recursive:true});
  // Keep a portable scene and immutable copies of image inputs.
  const portable=structuredClone(scene);await fs.mkdir(path.join(out,'assets'));
  for(const n of flatten(portable.nodes).filter(n=>n.type==='image')){const ext=path.extname(n.src).toLowerCase(),dest=`assets/${n.id}${ext}`;await fs.copyFile(path.resolve(path.dirname(scenePath),n.src),path.join(out,dest));n.src=dest;}
  await fs.writeFile(path.join(out,'scene.json'),JSON.stringify(portable,null,2));
  if(formats.includes('svg'))await fs.writeFile(path.join(out,'figure.svg'),svg);
  const cv=new Canvas(scene.canvas.width,scene.canvas.height),ctx=cv.getContext('2d');
  ctx.drawImage(await loadImage(Buffer.from(svg)),0,0);
  await fs.writeFile(path.join(out,'figure.svg.png'),await cv.toBuffer('png'));
  if(formats.includes('pdf'))await fs.writeFile(path.join(out,'figure.pdf'),await cv.toBuffer('pdf'));
  if(formats.includes('pptx'))await renderPptx(ready,artifact,out,opts.python);
  audit.inventory=flatten(scene.nodes).map(n=>({id:n.id,type:n.type,source:n.source??null,status:n.status??'pending',medium:n.type==='image'?'raster':'editable-vector'}));
  audit.visualReview='pending: open actual renders at paper size';audit.targetAppEditing='not tested by exporter';
  audit.formats=formats;audit.backend='@oai/artifact-tool';
  await fs.writeFile(path.join(out,'audit.json'),JSON.stringify(audit,null,2));
  console.log(JSON.stringify({output:out,formats,warnings:audit.warnings}));return audit;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) run(process.argv.slice(2)).catch(e=>{console.error(e.message);process.exitCode=1;});
