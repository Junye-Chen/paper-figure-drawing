# Collaborative design workflow

Keep a compact design record beside the scene: figure role, claim, depth boundary, accepted core/layout/reference/style, actual author words, artifact versions and unresolved issues. Use existing decisions rather than reopening them. Confirm meaningful decisions, not every operation; silence and elapsed time are not approval.

## 1. Establish the claim and explanatory depth

Read the supplied method and figures. Separate three layers:

- Contribution: what the method claims to add; do not assert literature novelty without evidence.
- Intuition: why its approach addresses the problem.
- Figure claim: what the reader should take away from this particular image.

For substantive components, summarize their role and possible emphasis, distinguishing supplied claims from your interpretation. Propose one focus with a reason. Add one genuinely different alternative only if useful, with custom/combine options. For each give the concrete idea, reader takeaway and tradeoff, not abstract menu names. Do not default to 2–4 options or ask the author to choose routine design details.

Set depth using exactly these three categories (briefly, not a questionnaire):

1. **Must show:** relationships needed for this figure's claim.
2. **May omit:** computations/internal processes allowed to remain implicit or black-boxed.
3. **Must not distort:** scientific meanings a simplification must preserve.


Default teaser purpose is intuition first; default method purpose is relationships first. Do not make authors choose between these purposes on every task. Teaser focus candidates differ in concrete example, phenomenon or intuitive entry point. Method focus/organization candidates differ in how dependencies and logical roles become clear. Multiple figures can share context while carrying different claims and depths.

Exit: author confirms claim and depth, or earlier explicit instructions already establish them. Stop before drawing while this decision remains unresolved.

## 2. Choose visual explanation and confirm the core sketch

Recommend a concrete solution: visual protagonist, entities, key connections, what the reader sees first and the meaningful tradeoff. Offer a backup only when it provides a different useful reading path. The assistant does the design work; the author checks emphasis and scientific accuracy.

Use [composition](composition.md) and relevant [cases](design-cases.md). Establish a rough visual character through one primary reference, plus a supplementary reference only if needed. Show actual reference imagery and identify what to borrow and avoid. The core sketch should already use the chosen kind of objects—images, graphs, matrices, geometry—rather than generic text boxes awaiting decoration.

After the visual approach is selected, show a small core-only sketch. Keep supporting results and secondary branches out. Evaluate at the agreed depth: are the required relationships apparent, and are protected meanings intact? Short labels, necessary symbols and caption clarifications are legitimate. Do not demand a proof of omitted internal computations or a completely text-free picture.

If unclear, first fix endpoints, grouping, highlighting or a short label. Add internal mechanisms only if the author expands the depth or simpler faithful treatments fail. Do not expand a simple relationship into an algorithm diagram merely because it is technically possible.

Exit: author accepts core relationship and visual explanation. Correct claim with rejected visual language stays here.

## 3. Add context and confirm composition

Preserve the core and accepted framework. Inventory other content as context, supporting mechanism, evidence/application or optional detail. Allocate space according to the figure's job, not equal area per subsection. Explain one useful inclusion/omission tradeoff.

Show the complete layout at target aspect, with short labels, real thumbnails where available and key routes. Carry forward the rough visual character; do not prematurely fine-tune typography. Confirm hierarchy, reading order and content allocation. Do not dilute the core to include an exhaustive method inventory.

## 4. Implement overall visual direction

Style is a continuation of the selected visual language, not a late coat of color. Early decisions concern concrete versus abstract depiction and image/diagram balance; composition establishes density and integration; this stage unifies image treatment, line system, emphasis, typography and palette.

If references and author preferences already establish the direction, implement it without a mandatory A/B or extra confirmation. Show a sample only when a consequential overall choice is unresolved. Keep approved content/layout fixed. Variants must differ visibly at normal reading size; font swaps, slight hue shifts, borders and corner radii do not justify a selection round. If no meaningful alternative fits the constraints, recommend one direction instead of inventing two.

Read [color accessibility](color-accessibility.md). Handle font, exact colors, line widths and spacing yourself within preferences and legibility constraints. Teaser and method may share a visual vocabulary while retaining their different organizational roles. Do not silently adopt a reference's composition when only its aesthetics were approved.

Exit: an overall direction is established through current or prior author decisions. Preference-level details do not create new gates.

## 5. Resolve defects and hand off

Deliver when all of the following hold:

- Author accepts the message and visual explanation; no unresolved core disagreement remains.
- Layout and overall visual direction are established and form a coherent figure.
- Scientific content and asset status are checked; real results, illustrative values and replacement placeholders are distinguishable.
- Substantive defects are fixed: clipping, overlap, wrong connections, illegible text and critical color ambiguity.
- Requested files are editable, reasonably grouped, with replaceable assets and accurate verification/limitation notes.

Perfection of every spacing or font preference is not required. Hand off at a clean, readable, editable state; author micro-adjustments may tune fonts, spacing, wording, small positions and manuscript fit. Do not hand off scientific mistakes, confused hierarchy or broken editability under this label. Never equate successful export with successful design or claim author approval that was not given.

## Feedback routing

| Feedback | Revisit | Preserve |
|---|---|---|
| Not what I want to emphasize | Claim and depth | Valid science/assets |
| Focus right, depiction misleading | Core visual explanation | Agreed claim |
| Scattered / wrong hierarchy or order | Composition | Accepted core and meaning |
| Framework right, looks like PPT / flat / busy | Diagnose overall style and hierarchy first | Content and logic unless layout is demonstrably the cause |
| Small text / overlap / unclear arrow | Local repair | All unrelated decisions |
| Preferred font/color/spacing | Apply locally or leave for author tuning | No new option-selection round |

“I cannot understand it” is not automatic permission to add detail. Determine whether focus, correspondence, symbol meaning or requested depth is the issue. The first three usually need emphasis, routing, grouping or brief labels; only an agreed increase in depth calls for expanded explanation.

If a local change materially affects another region, state the dependency and review only that scope. Do not restart the whole process or silently redesign accepted regions. Explicit direct-first bypasses staged waits for that request; later staged review resumes at the earliest unresolved decision. Local edit requests execute directly within established constraints.
