# Remotion Library Template Improvements – Wave A

## Hook1AQuestionBurst_V6
- Shifted layout and typography to the new Tailwind token system (`font-display`, `safe-zone`, `badge-chalk`) while keeping positional offsets configurable.
- Wired the notebook font voice loader (`loadFontVoice`) with a new `typography` block so teams can swap handwriting styles per scene.
- Replaced ad-hoc exit math with `createTransitionProps`, letting admins pick slide/fade/wipe exits and tuning duration via config.
- Fixed ambient particles to respect canvas size and color palette, and added an optional CTA badge that reuses the shared component styles.
- Exposed richer controls in `CONFIG_SCHEMA` (transition style/direction, letter-case, CTA toggles).

## Hook1EAmbientMystery_V6
- Adopted Tailwind-driven styling for whisper/question/hint text and ambient overlays; fonts now follow the “story” voice by default.
- Channelled ambient particles through the shared generator + renderer with seeded memoisation for deterministic fog.
- Used the transitions helper to manage the global fade-out and keep all layers in sync.
- Added a configurable signature badge and typography controls, plus fog/glow intensity sliders that map into the effect engine.

## Reveal9ProgressiveUnveil_V6
- Loaded the new font voice pipeline and mapped title/stage typography to Tailwind utilities for consistent spacing and casing.
- Fed reveal overlays through `createTransitionProps`, translating curtain/fade/slide options into Remotion transitions while preserving bespoke overlay rendering.
- Normalised stage headline/description styling with alignment + transform controls so templates can lean left/right without forking code.
- Wrapped the root composition with Tailwind-safe classes (`overflow-hidden`, `text-ink`) to match the upgraded design tokens.

## Spotlight14SingleConcept_V6
- Introduced font voice + alignment controls and removed hard-coded typefaces, letting the notebook family flow through every stage.
- Powered stage entrances with `createTransitionProps`, so fade/slide/curtain/morph picks now reuse the Remotion transition engine.
- Refactored per-stage rendering to use Tailwind classes for layout and letter case while keeping hero rendering unchanged.
- Upgraded background handling and empty-state styling to align with the global Tailwind surface theme.

## Shared Utilities
- Added `sdk/fontSystem.ts` to preload curated Google font voices (notebook/story/utility) and expose reusable token builders.
- Added `sdk/transitions.ts` to provide a thin layer over `@remotion/transitions`, giving templates a consistent way to request timing + presentation presets.
- Introduced `tailwind.css`, `tailwind.config.js`, and `postcss.config.cjs` so every template can consume the shared design tokens out of the box.
