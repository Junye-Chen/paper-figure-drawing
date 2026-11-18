# Export and environment

Read `scene-schema.md`. Use `load_workspace_dependencies` to locate bundled Node and Node packages. The renderer uses @oai/artifact-tool and its bundled skia-canvas; Python 3 standard library finalizes native OOXML groups. Do not hardcode this machine's runtime path into another project, install replacements silently, or require external model credentials.

```text
NODE scripts/render.mjs path/to/scene.json --out path/to/new-v1 --modules NODE_PACKAGES --python PYTHON --formats pptx,svg
NODE scripts/render.mjs path/to/scene.json --validate-only
NODE scripts/render.mjs edited.json --out new-v2 --modules NODE_PACKAGES --baseline accepted.json
PYTHON scripts/verify_export.py path/to/new-v1
```

Use absolute paths or resolve scripts relative to this installed skill. `CVPR_NODE_MODULES` may replace --modules. Selected formats: pptx,svg,pdf. PDF is optional, rendered through Skia; inspect font/vector preservation before claiming publication readiness. Export always creates SVG-derived PNG preview and portable scene/assets; PPTX adds a separate backend PNG preview, native grouped file and grouping manifest. Output directory must be new; partial failed runs stay for diagnosis and must not be delivered as finished.

`--allow-protected-change` bypasses mechanical baseline protection only for a user-requested modification; record the request. Validate-only checks structure/revisions, not fonts or assets. Full export checks local assets and measured text fit. Never interpret these checks as evidence verification.

PPTX uses native text and shapes; routed connectors are editable freeform paths with grouped arrowheads. They are NOT live PowerPoint glue connectors: manually moving a module requires adjusting the arrow or regenerating from the scene. Scientific endpoints are maintained in JSON. SVG keeps editable text/paths and independently embedded images. Both preserve named semantic groups.

Font availability and line breaking affect compatibility; use installed fonts and explicit breaks. UTF-8 labels are supported if the chosen font has the glyphs. Complex illustrations remain independently replaceable raster assets. v1 does not import manual PPTX/SVG changes into JSON, save native .ai, or perform automatic cross-format sync.

Open both backend previews; when possible reopen final grouped PPTX to render and compare. Only claim editor testing if performed. `audit.json` starts with pending visual review; update review notes after inspecting. Deliver files plus this material limitation, not a blanket promise of universal editing fidelity.

Run verify_export.py after export: it checks object IDs, native groups, matching text and embedded SVG images. It does not prove layout, scientific fidelity or target-editor compatibility.
