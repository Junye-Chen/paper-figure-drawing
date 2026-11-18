# Revision rules

| Tier | Preserve | Allowed |
|---|---|---|
| Fixed | science, links, values, sample identity, exact requested text, explicitly frozen regions | relevant user instruction or evidenced correction |
| Intent | reading order, main groups, panel count, emphasis, style, aspect | local refinement; preview material redesign |
| Flexible | small moves/resizes, spacing, alignment, wraps, routes | automatic optimization within fixed content/intent |

Object `lock: all` is for explicit freezes. `lock: semantic` protects text, role, source, asset and connection identity while allowing geometry. Unlocked geometry never authorizes altering science. User instructions update applicable constraints without repeated approval.

`--baseline accepted.json` rejects protected changes unless `--allow-protected-change` is given. Use the flag only for a user-requested change and record why. Mechanical comparison does not judge scientific meaning or infer approval.

Colors retain roles; exact values fixed only if requested. Crops retain evidence and matched conditions. Arrow semantic endpoints stay; routes can move. Check text -> box -> group -> neighbors after every wording change. Screenshot markings scope the edit. Necessary nearby routing changes are fine; whole-panel re-layout merits a preview unless explicitly requested.

New output directory per version. Reconcile manually edited PPTX/SVG before regenerating; v1 has no automatic reverse import or bidirectional sync. Preserve the user's source intact and explain any reconstruction needed.

## Stage-aware approval record

Track figure role, contribution/intuition/claim, the three-part depth boundary, visual language/core sketch, composition, reference properties and overall style separately, each with artifact version and the actual user confirmation. Preserve accepted science and intent while optimizing geometry. If a change invalidates a downstream design decision, explain that dependency and revisit only the affected stages; do not pretend earlier approval covers a different idea.

Author framework sketches are design constraints, not merely image assets to crop. Reconstruct their relationships as editable objects for production. Do not silently replace the author's framework with generic text columns.

Route feedback using workflow.md. Preserve unaffected decisions; before a necessary cross-panel change, identify what depends on it and review only that scope. Cosmetic preferences do not reopen style selection. New task-specific author instructions override prior defaults; do not treat rejection of A/B samples as acceptance of either sample.
