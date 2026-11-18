# Quality gates

Science: verify every important link/direction, term, sample, claimed number, training/inference and frozen/trainable state when relevant. Check caption and evidence. Resolve or disclose source questions.

Visual: open current PNG and SVG, inspect at target paper width and dense details. Check emphasis, alignment, whitespace, every arrow, crossing versus junction, text and asset clipping. Font sizing is a design choice, not an invented CVPR rule. Explicit line breaks and fit checks are a backstop; inspect actual glyphs/fonts. Reserve feedback channels. Encode important distinctions beyond color alone.

Editable: PPTX contains native text, shapes, freeforms and groups, not a slide-sized screenshot. SVG text remains text; raster assets are individually embedded. Compare text/object inventories. Reopen final PPTX and render when possible. Test editor operations when available; otherwise report package-level checks accurately. Never claim PowerPoint/Illustrator testing without actually opening there.

Stop when no unresolved issue affects meaning, reading or requested editability. Script passes do not replace visual checks. Report checks blocked by tools or budget.

Core-explanation gate: check the three-part depth agreement—required relationships visible, allowed omissions respected, protected meanings intact. Do not require an internal derivation of every operation or a completely text-free explanation. A clear arrow or agreed model block may be sufficient; a missing algorithm detail is not automatically a design defect. This self-check is not evidence of measured reader comprehension. Diagnose unclear focus, correspondence, symbol meaning or requested depth before choosing a repair.

Review confirmed-stage consistency: emphasis, visual mapping, hierarchy and style must match the author's accepted choices. Inspect the rendered artifact, including at intended paper width; automated layout checks alone are insufficient.

Accessibility: use color-accessibility.md. Record contrast checks, grayscale review and CVD simulation separately; missing checks stay pending. Low saturation alone does not pass accessibility.

Simplicity pass: for every panel, intermediate symbol and explanatory sentence, ask whether removing it would change the reader’s understanding of the agreed core idea. Remove or move unnecessary details to caption/Method. If one arrow expresses the intended relation, do not replace it with a miniature algorithm. Evaluate explanation at the agreed abstraction level, not by completeness of derivation.

Handoff boundary: apply the five completion conditions in workflow.md. Author acceptance of science, core/framework and overall preference are distinct; renderer success supplies none of them. Once meaningful issues are resolved, deliver editable files without repeated cosmetic rounds. Source placeholders or unavailable editor/CVD checks must be explicit, not silently claimed complete.
