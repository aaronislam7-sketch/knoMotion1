# Knodovia Showcase Breakdown
Guided reference for the three proof-of-concept videos. Use this when extending the trilogy, swapping content, or designing new modules that should feel consistent with the current narrative arc.

## Video 1 — Accidental Arrival (Infrastructure Hook)
| Scene | Purpose | Layout | Mid-scenes & Presets | Key Beats & Visuals |
|-------|---------|--------|-----------------------|---------------------|
| 1 | Cold open: mysterious arrival | `full` | `textReveal` + `stylePreset: 'playful'` | Sunrise gradient, pulse emphasis on "accidental", `doodle-wipe` transition in. |
| 2 | Geography snapshot | `headerRowColumns` | Header `textReveal` (`educational`), body `gridCards` mixing emoji icons + `ImageAtom` | Notebook background, staggered beats, animated emoji icons. |
| 3 | Before/after infrastructure | `columnSplit` | `sideBySide` with `mode: 'beforeAfter'`, style `mentor` | Thermal + aqua Lotties, image media layers, `page-turn` transition out. |
| 4 | Citizen voices | `rowStack` | `bubbleCalloutSequence` (`playful`) with `overlap: true` | Overlapping bubbles jitter on entrance, animated emphasis for key lines. |
| 5 | Systems summary & CTA | `gridSlots` | `gridCards` (`focus`) + hero `HeroTextEntranceExit` (Lottie lightbulb) | Spotlight background, card badges w/ data-URI SVGs, `slide` transition to close. |

Approx duration: ~100s.

## Video 2 — Culture Engine Room
| Scene | Purpose | Layout | Mid-scenes & Presets | Key Beats & Visuals |
|-------|---------|--------|-----------------------|---------------------|
| 1 | Recap & stakes | `full` | `textReveal` (`mentor`) | Chalkboard gradient, breathe emphasis, slow zoom. |
| 2 | Rituals checklist | `rowStack` | `checklistReveal` (`educational`) + animated emoji icons | Notebook background, per-item beats, doodle underline when items complete. |
| 3 | Social fabric grid | `gridSlots` | `gridCards` (`playful`) + ImageAtom badges | Clean card background, data URI illustrations, `doodle-wipe` transition. |
| 4 | Chaos montage | `rowStack` | `bubbleCalloutSequence` (`playful`, overlap) | Spotlight background, offset beats for callouts, eraser transition exit. |
| 5 | Mentor reflection | `full` | `textReveal` (`focus`) + `RemotionLottie` confetti overlay | Soft gradient with noise, CTA emphasised via `high` emphasis effect. |

Approx duration: ~105s.

## Video 3 — Economic Playground
| Scene | Purpose | Layout | Mid-scenes & Presets | Key Beats & Visuals |
|-------|---------|--------|-----------------------|---------------------|
| 1 | Stat-driven hook | `headerRowColumns` | Header `textReveal` (`focus`), right `gridCards` | Sunrise gradient, `slide` transition, emphasis pulses on metrics. |
| 2 | Currency comparison | `columnSplit` | `sideBySide` (`mode: 'beforeAfter'`, style `mentor`) | Hero ImageAtom for both market states, animated emoji icons, `page-turn` exit. |
| 3 | Marketplace montage | `gridSlots` | `gridCards` (`playful`) with badge icons | Clean card background, BADGE_* image data URIs, `doodle-wipe` transition. |
| 4 | Talent flow | `rowStack` | `bubbleCalloutSequence` (`educational`) | Notebook overlay, callouts staggered w/ `resolveBeats`, water/thermometer Lotties. |
| 5 | Future pacing CTA | `full` | `textReveal` (`focus`) + hero Lottie | Spotlight background, `eraser` transition to fade to blueprint frame. |

Approx duration: ~110s.

## Shared Motifs & Guidance
- **Narrative thread** – video 1 introduces Knodovia, video 2 humanises culture, video 3 zooms into economics. Keep callbacks (thermometer/snowflake/water-drop Lotties, notebook overlays, playful doodles) consistent.
- **Transitions** – rotate through `slide`, `page-turn`, `doodle-wipe`, and `eraser` to keep motion variety. Each scene config declares its transition in JSON.
- **Assets** – all Lotties come from `LOTTIE_REGISTRY` (`nature/thermometer`, `education/lightbulb`, etc.). Emoji icons rely on `@remotion/animated-emoji` via the `Icon` atom. Image badges use `ImageAtom` with inline SVG data URIs.
- **Beats & Emphasis** – `resolveBeats` drives both scene-level pacing and per-item staggering. Emphasis levels (`high/normal/low`) loop their pulse/breathe animations so highlights never feel dead.
- **Backgrounds** – each video cycles through `notebookSoft`, `sunriseGradient`, `cleanCard`, `chalkboardGradient`, and `spotlight` for brand cohesion without monotony.

## Where to Edit
- Composition sources: `src/compositions/KnodoviaVideo*_*.jsx`
- Scene renderer + transitions: `src/compositions/SceneRenderer.jsx`
- Presets: `src/sdk/theme/stylePresets.ts`, `src/sdk/theme/emphasisEffects.ts`, `src/sdk/effects/resolveBackground.tsx`
- Beats utility: `src/sdk/utils/beats.ts`
- Asset registries: `src/sdk/lottie/lottieRegistry.ts`, `src/sdk/elements/atoms/Icon.jsx`, `src/sdk/elements/atoms/Image.jsx`

Use this document as the springboard for any future episodes or for swapping in AI-generated content while keeping the same cinematic scaffolding.
