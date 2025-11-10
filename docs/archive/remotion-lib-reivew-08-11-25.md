# Remotion Library Review – 08 Nov 2025

## Context & Goals

- Tailwind CSS, Remotion Google Fonts, and Remotion Transitions are now in the stack. We want every v6 template to lean on them for consistent styling, easier configuration, and higher-end motion design.
- This plan keeps the agnostic template principles intact while trading ad-hoc inline styles for reusable utilities that the admin config can still override.
- Outcome: faster theming across templates, typography that matches the design voice, and smoother motion cues that feel intentional rather than one-off.

## Shared Integration Pillars

### Tailwind CSS Upgrade
- **What:** Use Tailwind utilities inside Remotion compositions so layout, spacing, color, and typographic rhythm come from a single design system.
- **How:** Extend `tailwind.config` with tokens that mirror our `style_tokens`, expose semantic utility classes (e.g. `layout-safe-zone`, `text-display`, `bg-panel`), and swap inline `style` blocks for `className` compositions (using `clsx` where dynamic choices are needed).
- **Why:** Promotes consistent spacing scales, lets us reuse patterns (e.g. glass cards, badges, timeline tracks), and shortens the path from admin configuration to rendered output because utilities read from the same theme variables.

### Remotion Google Fonts
- **What:** Centralise font loading with `@remotion/google-fonts` (or the new font loader) so every template draws from pre-approved display, body, and accent stacks.
- **How:** Define three curated font pairings (Display, Narrative, Utility) in a shared typography module, map them to Tailwind font families (`font-display`, `font-body`, `font-code`), and expose lightweight helpers for templates to request “voice” rather than raw font names.
- **Why:** Guarantees licensing-safe, performant font delivery, locks in consistent letterforms across templates, and keeps typography decisions in one place rather than repeated per file.

### Remotion Transitions Toolkit
- **What:** Adopt `@remotion/transitions` (TransitionSeries, Wipe, Fade, Slide, etc.) so stage changes, reveals, and exits share timing language.
- **How:** Wrap existing manual interpolations with the transition primitives, set default easing curves per intention (e.g. `power3Out` for Question bursts, `power2InOut` for Reflect scenes), and create a `useStageTransitions` helper that templates can reuse.
- **Why:** Reduces bespoke math, keeps reveal timings uniform, and unlocks richer combinations (stacked wipes, masked zooms) without rebuilding easing logic.

## Template-by-Template Plan

### Hook & Reveal Intention
- **Hook1A Question Burst**
  - Tailwind: Replace absolute positioning with utility combos (`flex`, `items-center`, `gap-12`, safe-zone padding) and add a reusable “question headline” class.
  - Fonts: Map question parts to the Display font pairing, subtitle/conclusion to Body pairing, with weights driven via Tailwind (`font-black`, `tracking-tight`).
  - Transitions: Use TransitionSeries for the two-part reveal, swapping manual interpolations for staggered `FadeIn` + `Move` primitives.
- **Hook1E Ambient Mystery**
  - Tailwind: Build a `bg-ambient` gradient utility and reusable fog overlays with Tailwind + CSS variables, removing inline rgba definitions.
  - Fonts: Apply Narrative pairing for atmosphere; expose line-height and uppercase utilities for whispers versus headline question.
  - Transitions: Use `Slide` + `BlurIn` transitions to fade whispers/question/hint, reserving `TransitionSeries` to choreograph fog density shifts.
- **Reveal9 Progressive Unveil**
  - Tailwind: Create utilities for split overlays and stage containers (`grid`, `place-items-center`, `bg-curtain`), standardising spacing around the title and stage content.
  - Fonts: Assign title to Display pairing, stage content to Body pairing; set responsive scales via Tailwind’s `text-[var(--token)]` plugin tied to config.
  - Transitions: Swap custom overlay math for `Wipe` and `Slide` transitions with shared easing; use TransitionSeries segments for each stage.
- **Spotlight14 Single Concept**
  - Tailwind: Introduce reusable stage wrappers (`stage-shell`, `stage-highlight`) and gradient backgrounds via Tailwind’s theme extensions.
  - Fonts: Give each stage type a font voice (question = Display, explanation = Body, takeaway = Accent) selected via simple enums.
  - Transitions: Use TransitionSeries to chain stage entrance, emphasis, and exit; employ `Scale` and `Spring` presets instead of hand-written interpolate blocks.

### Explain & Compare Intention
- **Explain2A Concept Breakdown**
  - Tailwind: Translate hub-and-spoke layout into CSS Grid utilities, using custom radial helpers (`grid-[radial]`) and consistent badge styling.
  - Fonts: Body pairing for part descriptions, Display for central concept; drive weights with Tailwind tokens rather than inline numbers.
  - Transitions: Use `DrawFromCenter` (via transitions toolkit) for connector lines and `Appear` presets for part reveals.
- **Explain2B Analogy**
  - Tailwind: Build reusable `card-spotlight` class for left/right panels, unify spacing/gaps with Tailwind gap utilities.
  - Fonts: Display pairing for labels, Body pairing for descriptions; use small-caps utility if selected in config.
  - Transitions: Replace manual interpolations with `Slide` + `FadeIn` transitions staggered through TransitionSeries.
- **Compare11 BeforeAfter**
  - Tailwind: Define `split-view` utilities to handle vertical/horizontal orientations, including drag-handle styling with Tailwind gradients.
  - Fonts: Display font for labels/headlines, Body font for descriptions; ensure font tokens tie to template’s `style_tokens`.
  - Transitions: Employ `MaskWipe` from transitions toolkit to animate split slider, keeping ease curves consistent across orientations.
- **Compare12 Matrix Grid**
  - Tailwind: Use CSS Grid utilities to lay out headers/cells, add `cell-emphasis` class for highlights, and reuse badge components for checkmarks.
  - Fonts: Body font for cells, Display font for section titles; align `font-semibold` and `uppercase` via Tailwind classes.
  - Transitions: Use TransitionSeries with `StaggerChildren` helper to fill grid row-by-row and `Glow` preset for winner highlight.

### Guide & Progress Intention
- **Guide10 Step Sequence**
  - Tailwind: Convert manual positioning into responsive grid/flex utilities, reuse `step-card` class for badges, and use `gap` scales for spacing.
  - Fonts: Display font for step numbers/title, Body font for descriptions; tie sizes to Tailwind theme values.
  - Transitions: Apply `Trail` transition to reveal steps sequentially and `PathDraw` for connectors instead of custom easing math.
- **Progress18 Path**
  - Tailwind: Create `path-track` and `milestone` utilities for horizontal/vertical layouts, enabling quick theming by swapping classes.
  - Fonts: Body pairing with optional italic utility for milestone descriptions; heading uses Display pairing.
  - Transitions: Use `SlideIn` presets for milestone entries and `ProgressBar` transition helper to animate the tracker fill.
- **Apply3B Scenario Choice**
  - Tailwind: Standardise option cards with `choice-card` utility (rounded, shadow, focus ring) and use Tailwind `flex` stacking with gap control.
  - Fonts: Display font for scenario prompt, Body font for options; use Tailwind weights and color classes for reveal states.
  - Transitions: Swap reveal logic for `ScaleIn` + `ColorWipe` transitions triggered through TransitionSeries when revealing outcomes.

### Challenge & Assessment Intention
- **Apply3AMicroQuiz**
  - Tailwind: Replace inline absolute layouts with `stack-center` utilities, timers with `badge-countdown`, and choice grid with tailwind `grid` classes.
  - Fonts: Display pairing for question text, Body pairing for choices and timer digits (with `tabular-nums` utility).
  - Transitions: Use `Stagger` transitions for choice reveals, `Counter` helper for timer animation, and `Highlight` preset for answer reveal.
- **Challenge13 Poll Quiz**
  - Tailwind: Define `option-tile` and `option-grid` utilities for grid/vertical/horizontal layouts, and reuse `info-panel` class for explanation block.
  - Fonts: Display for question, Body for options/explanation; integrate Tailwind `tracking` utilities for emphasis variants.
  - Transitions: Use `Appear` + `Scale` presets for options, `Pulse` preset for correct answer, and `ClockWipe` for timer arc.

### Inspire, Reflect & Connect Intention
- **Connect15 Analogy Bridge**
  - Tailwind: Introduce `bridge-lane` flex utilities to handle horizontal/vertical modes, and card shells for familiar/new concept blocks.
  - Fonts: Display font for concept headings, Body font for descriptions and mapping labels.
  - Transitions: Use `PathDraw` for bridge animation and `Slide` presets for concept entrances, orchestrated via TransitionSeries.
- **Reflect4A Key Takeaways**
  - Tailwind: Build `takeaway-list` utility with vertical rhythm, move bullets to Tailwind badges, and rely on `space-y` classes.
  - Fonts: Body pairing across bullets, Display for title; use Tailwind `font-semibold` mapping rather than inline weights.
  - Transitions: Apply `Trail` preset for list reveal and `FadeOut` for exit instead of manual interpolate calls.
- **Reflect4D Forward Link**
  - Tailwind: Create `section-panel` utility for current/next blocks, aligning content with Tailwind grid for better responsiveness.
  - Fonts: Display font for headings, Body font for summaries; use Tailwind text colors tied to tokens.
  - Transitions: Use `SlideIn` for current/next reveals and `ScaleIn` for bridge arrow, managed through TransitionSeries segments.
- **Quote16 Showcase**
  - Tailwind: Build `quote-card` utility with gradient overlays, central alignment via Tailwind, and consistent padding scales.
  - Fonts: Display pairing for quote text (with `leading-tight`), Body pairing for author line with Tailwind `uppercase` option toggled by config.
  - Transitions: Use `FadeIn` + `Scale` presets for the quote, `Glow` preset during hold, and `FadeOut` for exit.

## Additional Remotion Libraries to Leverage
- **@remotion/paths** — Simplifies drawing and animating lines. Use in Guide10 (step connectors) and Connect15 (bridge arcs) to create smooth path reveals without manual SVG math.
- **@remotion/shapes** — Generates circles, rectangles, and polygons with minimal code. Apply in Quote16 for halo backgrounds and Reflect4A for consistent icon badges.
- **@remotion/lottie** — Native Lottie playback with performance tweaks. Use for Hook1A and Spotlight14 to incorporate branded motion graphics as hero elements.
- **@remotion/three** — Integrates Three.js scenes. Ideal for Progress18 to render 3D progress markers or for Reveal9 to add dimensional overlays when needed.
- **@remotion/noise** — Procedural noise textures and animations. Use in Hook1E to enrich fog effects and in Challenge13 to add subtle animated backgrounds that reinforce energy.

## Roadmap & Execution Plan
- **Phase 1 – Foundation (1-2 days)**
  - Finalise Tailwind theme tokens mapped to `style_tokens`.
  - Set up typography module with the three curated font pairings and update Tailwind font families.
  - Create transition helper wrappers so templates can import a single `useStageTransitions`.
- **Phase 2 – Template Sweeps (3-4 days)**
  - Wave A: Hook1A, Hook1E, Reveal9, Spotlight14 (narrative-first templates).
  - Wave B: Explain/Compare set (Explain2A/B, Compare11/12).
  - Wave C: Guide/Progress/Challenge/Reflect templates, reusing the utilities built earlier.
  - After each wave, smoke-test via Admin Config to ensure overrides still flow through.
- **Phase 3 – Polish & QA (1-2 days)**
  - Standardise motion timings across intentions, document defaults in config schemas.
  - Add Storybook-like visual references or screenshot gallery to capture Tailwind utility usage.
  - Update documentation so content authors know which font voices and transition styles to pick for different storytelling goals.

## Next Steps
- Validate that Tailwind build hooks work inside Remotion renders (test against a long render).
- Prioritise template waves based on upcoming content needs.
- Schedule a design review once Wave A is refactored to confirm the new visual language before proceeding.
