# Scene schema v1

UTF-8 JSON. Coordinates and fontSize are CSS pixels at 96 DPI, absolute on canvas even inside groups. Node order is back-to-front. Use separate text nodes for labels; related shapes/text can be grouped. Explicit line breaks are shared by both renderers. No automatic wrapping or silent font shrinking.

```json
{
  "version": 1,
  "title": "Method overview",
  "caption": "Source-backed caption, optional",
  "canvas": {"width": 960, "height": 360, "background": "#FFFFFF"},
  "style": {"fontFamily": "Arial", "fontSize": 20},
  "nodes": [
    {"id":"encoder", "type":"rect", "x":100,"y":100,"w":180,"h":80,"fill":"#DCEAF4"},
    {"id":"decoder", "type":"rect", "x":500,"y":100,"w":180,"h":80,"fill":"#DDEBDD"},
    {"id":"flow", "type":"connector", "from":{"id":"encoder","side":"right"}, "to":{"id":"decoder","side":"left"}, "role":"data-flow", "lock":"semantic"}
  ]
}
```

Common: unique ASCII `id` (letters/digits/dot/hyphen/underscore; no double underscore), `type`, optional `role`, `source`, `sampleId`, `status` (pending/done/needs-fix/accepted), `placeholder`, `lock` (semantic/all). Metadata is recorded, not independently verified. Colors: #RRGGBB or none. Stroke defaults #334155 at 1px; fills default none.

| Type | Required fields | Optional |
|---|---|---|
| rect / ellipse | x,y,w,h | fill,stroke,strokeWidth,dashed; radius for rect |
| text | x,y,w,h,text | fontFamily,fontSize,bold,color,align:left/center/right |
| image | x,y,w,h,src | fit:contain/stretch; alt; source and sampleId recommended |
| group | children array | metadata; children use absolute coordinates |
| path | points:[[x,y],…] | closed,fill,stroke,strokeWidth,dashed,arrow,arrowSize |
| connector | from/to:{id,side} | via:[[x,y],…],stroke,strokeWidth,dashed,arrow,arrowSize |

Connector sides: left/right/top/bottom. Endpoints must be boxed primitives, not groups. Their geometry is recalculated from boxes each generation. `via` are absolute route points; arrows default on for connectors. Paths are editable line-segment freeforms. v1 does not support Bézier paths, arbitrary SVG import, rotations, gradients, rich text or formula typesetting. Approximate simple curves with enough points only when visual quality remains adequate; otherwise disclose/extend backend rather than flattening structural content.

PNG/JPEG image paths are relative to scene JSON (absolute accepted). Export copies assets into a portable assets folder and embeds images in SVG/PPTX. Remote URLs are not fetched. Contain preserves aspect; stretch is explicit. Crop a separate copy before export, preserving original evidence. Formula paths can be supplied as geometry, but must include source and editability disclosure.

Group stacking follows tree order; do not interleave external objects among group children. For feature planes, tokens and stacks compose primitive groups; the renderer does not enforce one scientific visual style.
