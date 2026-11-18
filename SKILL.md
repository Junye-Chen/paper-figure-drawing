---
name: cvpr-figure
description: Collaboratively design CVPR-style teasers, method pipelines and mechanism figures, from author-selected message and depth to visual explanation, composition and editable PPTX/SVG delivery. Supports scoped figure revisions.
---

# CVPR Figure

Treat figures as collaborative visual arguments. Read [workflow](references/workflow.md) at task start and when resuming feedback. The author judges scientific emphasis, accuracy and overall preference; the assistant proposes concrete visual solutions and handles routine design decisions.

## Core principles

- **Teaser: intuition first.** Establish a quick, concrete understanding of the paper through a task, phenomenon, example or contrast.
- **Method: relationships first.** Make inputs, outputs, dependencies and interactions clear. Real examples support those relationships.
- **Agree on depth:** relationships that must appear; internal processes that may be omitted; scientific meanings that must not be distorted. Omitted computation is not automatically a missing explanation.
- **Simplicity first:** an arrow, correspondence line, bracket or highlight may be sufficient. Do not unfold algorithms or add panels to preempt every hypothetical misreading. A model block is legitimate at the agreed depth.
- **Meaningful choices only:** give a reasoned recommendation, plus an alternative only when there is a consequential tradeoff. Do not fabricate options from fonts, corner radii, line weights or tiny hue differences.

## Interactive design by default

1. Read the method and distinguish **contribution → intuition → this figure's claim**. Treat inferred author intent as tentative. Confirm the claim and depth before drawing.
2. Recommend a visual explanation. Teaser candidates differ in intuitive entry point; method candidates differ in logical organization. Show and confirm a small core sketch, with an initial visual character rather than generic prose boxes.
3. Add supporting content around the accepted core; show and confirm the full layout, hierarchy and reading order.
4. Implement a coherent overall visual treatment using the accepted reference/preferences. Show a meaningful style sample only if an important visual-direction choice remains unresolved.
5. Fix substantive defects, verify requested editable outputs and hand off for author micro-adjustments.

Pause at unresolved meaningful design decisions, not every operation. Previously explicit decisions count: do not ask again or infer approval from silence. The user may combine or skip stages. “Show a draft” alone does not bypass unresolved claim selection. Do not silently change accepted science, framework or layout to manufacture a style alternative.

## References and style

Read [composition](references/composition.md) for visual-language and reference selection. Default to one primary reference, with one supplementary reference only if useful. Show the actual reference and explain which properties to borrow and which not to borrow; do not ask the author to browse an unfiltered gallery or specify cosmetic parameters.

Consult [design cases](references/design-cases.md) for relevant relationships. Open original figures before making visual claims. Read [color accessibility](references/color-accessibility.md) before applying style: use restrained saturation, dark legible labels and redundant non-color encodings. Do not claim colorblind safety without the relevant checks.

## Production and delivery

Modes: **interactive-design** (legacy draft-first); **direct-first** only on explicit request, with provisional assumptions; **edit-existing** at the earliest affected decision. Read [revisions](references/revisions.md) for scoped feedback and manual-edit reconciliation.

Use [budgets](references/budgets.md) for scoped, uncalibrated estimates. Default final outputs are a shared scene, editable PPTX + SVG, assets and PNG previews. Drafts need only a reviewable preview and its source. Before authoring read [scene schema](references/scene-schema.md); before rendering read [export](references/export.md). Preserve original experimental assets and distinguish evidence from illustration.

Read [quality](references/quality.md) before delivery. Check meaning, legibility, actual renders and native editability. Do not stop merely because export succeeded; do not keep polishing tiny preferences once substantive issues are fixed. Deliver when author decisions are resolved and files are clean and editable. Explain schematic data, remaining source/check limitations and target-editor behavior accurately. Do not transfer scientific errors, unclear layout or broken editability to the author as “micro-tuning.” Never overwrite manually edited sources with stale scenes. See [sources](references/sources.md) for provenance.

## Publication boundary

User manuscripts, unpublished research, discussion examples, screenshots, experimental values and conversation quotations are private task inputs, not reusable skill assets. Do not place them in the skill or a public repository. Generalize lessons into domain-independent instructions without names, distinctive mechanisms, values or images. Publish only public-source analyses or wholly synthetic examples. Before any push, inspect every tracked file and binary asset, local paths, credentials and commit identity; generic authorization to publish a skill does not authorize publishing its private development examples.
