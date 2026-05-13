# KnoMotion Build Status & Roadmap

> Condensed roadmap for agent-driven implementation sessions.
> Last updated: 2026-05-09 (post Chunk 7)

---

## Completion Summary

| Chunk | Scope | Status |
|-------|-------|--------|
| 1 | P1 — `@remotion/transitions` adoption | ✅ Complete |
| 2 | S2 + S3 — Generic composition + schemas | ✅ Complete |
| 3 | P4 — Audio layer (narration, music, captions) | ✅ Complete |
| 4 | S1 + S4 + P4e — Zod schemas + capability manifest + SafeAudio | ✅ Complete |
| 5 | R1 — Player integration | ⏭️ Skipped (not needed for MP4-first pipeline) |
| 6 | P2 + P3 — Spring/easing standardization + emoji verification | ✅ Complete |
| 7 | remotion-bits integration (Section 12 Tier 1) | ✅ Complete |

**Engine alignment score: 10/10.** Core architecture is complete. All remaining work is pipeline implementation and feature extension.

### Known Issues (Chunk 7)

- `charByChar` textReveal: line spacing too tight when multiple lines are used; the final word in long text strings can wrap to a second visual line. Needs layout-aware text fitting (see `@remotion/layout-utils` in outstanding work).

---

## Outstanding Work

### Engine Extension

#### Nice-to-Haves (Low Priority)

| ID | Task | Description |
|----|------|-------------|
| N1 | `@remotion/noise` backgrounds | Replace static `NoiseTexture` SVG overlay with animated `noise2D()` |
| N2 | `@remotion/shapes` decorative elements | `<Star>`, `<Circle>`, `<Heart>`, `<Pie>` with `evolvePath()` |
| N3 | Thumbnail generation | `renderStill()` for auto poster images |
| N4 | Frame-rate independence audit | Replace hard-coded `30` fps values with `useVideoConfig().fps` |
| N5 | Streaming render progress UX | Real-time progress bar using `getRenderProgress()` |
| P5 | `@remotion/paths` for hand-drawn effects | Replace manual `strokeDasharray` in `handwritingEffects.jsx` with `evolvePath()` |

#### `@remotion/layout-utils` — Text Measurement & Fitting

Install `@remotion/layout-utils` at 4.0.382. Provides `measureText()`, `fitText()`, `fitTextOnNLines()`, `fillTextBox()` for auto-sizing text in slots. Key integration points:

- `TextRevealSequence.jsx` — auto-size lines that exceed slot width (fixes `charByChar` wrapping issue)
- `ChecklistReveal.jsx` — replace placeholder `autoFitText` with real measurement
- `BigNumberReveal.jsx` — size number to fill slot
- Scene validation (S6) — detect text overflow at validation time
- Future `quoteReveal` / `flowDiagram` mid-scenes

Also install `@remotion/rounded-text-box` for TikTok-style caption word backgrounds.

#### New Mid-Scenes (Section 11)

| Mid-Scene | Description | Priority |
|-----------|-------------|----------|
| `progressTimeline` | Animated timeline with milestones | MEDIUM |
| `quoteReveal` | Dramatic quote/testimonial card | MEDIUM |
| `beforeAfterSlider` | Animated before/after comparison | MEDIUM |
| `flowDiagram` | Animated nodes + connecting arrows | MEDIUM |
| `timerCountdown` | Circular countdown timer | LOW |
| `revealStack` | Flashcard stack with flip reveal | LOW |

#### remotion-bits Tier 2 (Section 12)

| Enhancement | Target | Description |
|-------------|--------|-------------|
| Ken Burns | `heroText` | `heroAnimation: 'kenBurns'` via Scene3D |
| Mosaic Reframe | `gridCards` | `animation: 'mosaicReframe'` layout morphing |
| 3D Card Stack | `cardSequence` | `layout: '3dStack'` and `layout: 'carousel'` |
| Counter Confetti | `bigNumber` | `celebration: true` particle burst |
| Grid Stagger | `iconGrid` | Same center-ripple as gridCards |
| AnimatedCounter | `animatedCounter` | Replace internal interpolation with remotion-bits |

**New Tier 2 mid-scenes:** `cliSimulation`, `cursorDemo`, `terminal3D`, `flyingText`, `carousel3D`, `mosaicGrid`, `fractureReveal`, `presentation3D`, `scrollingGallery`

**Ambient effects:** `fireflies`, `animatedGradients`, `snowfall`, `matrixRain`, `particleFountain`, `gridParticles`

#### KnoMotion-Specific Additions (Section 11)

| ID | Feature | Description |
|----|---------|-------------|
| KM1 | Lower Third | Scene-level topic banner overlay |
| KM2 | Branded Intro/Outro | Template intro/outro sequences |
| KM3 | Watermark | Video-level branding overlay |
| KM4 | Motion Blur | `@remotion/motion-blur` on fast transitions |
| KM5 | Progress Bar | Video-level animated progress bar |
| KM6 | Particle Burst | Particle burst on emphasis beats |

### Pipeline Implementation (Section 18)

The pipeline is a staged workflow: PDF → Agent stages → Deterministic stages → MP4.

| Chunk | Scope | Stages | Status |
|-------|-------|--------|--------|
| 8 | Pipeline A — Scaffold + Render | `pipeline/` structure, orchestrator, stage 12 (render) | Pending |
| 9 | Pipeline B — Audio Pipeline | Stages 8-11: TTS, captions, beat alignment, assembly | Pending |
| 10 | Pipeline C — Content Pipeline | Stages 1-7: PDF parse, analysis, planning, generation, validation, fix, script | Pending |
| 11 | Pipeline D — Production Hardening | BSG4/6/8/9/10: series continuity, artifacts, review, i18n, assets | Pending |

**Pipeline stages in detail:**

| # | Stage | Handler | Implements |
|---|-------|---------|------------|
| 1 | PDF Upload & Parse | Deterministic | New |
| 2 | Content Analysis | Agent (LLM) | New |
| 3 | Video Planning | Agent (LLM) | BSG1 |
| 4 | Scene JSON Generation | Agent (LLM) | Existing guides |
| 5 | Validation | Deterministic | S6 |
| 6 | CI Feedback Loop | Agent (LLM) | New |
| 7 | Narration Script | Agent (LLM) | BSG2 |
| 8 | TTS Generation | Deterministic (API) | BSG3 |
| 9 | Caption Normalisation | Deterministic | BSG3 |
| 10 | Beat Alignment | Deterministic | P4d |
| 11 | Assembly | Deterministic | New |
| 12 | Render | Deterministic (Remotion) | S2 |

**Boundary rules:** `KnoMotion-Videos/` is browser-safe Remotion code. `pipeline/` is Node-only orchestration. Types flow one direction: pipeline imports from SDK, never reverse.

**Pipeline dependencies (install when building pipeline chunks):** `pdf-parse`, `openai`/`@anthropic-ai/sdk`, `elevenlabs`, `@remotion/renderer`

### Personalisation (Section 7)

| ID | Task | Description |
|----|------|-------------|
| L2 | Scene Selection Engine | `buildPersonalizedScenes()` — takes learner profile, outputs scene JSON |
| S6 | Scene Validation CLI | Automated Zod + business rules validation for JSON |

---

## Legacy Code Deletion Register

| Task | Files / Code to Delete | Status |
|------|----------------------|--------|
| P1c | `SceneTransitionWrapper` + helpers in SceneRenderer | ✅ Done |
| P2c | `SPRING_CONFIGS` duplicates in animations/ | ✅ Done |
| P2b | Legacy easing arrays in core/easing.ts | ✅ Done |
| S2 | Canon video composition rendering logic (can simplify to data files) | Pending |
| P5a | Manual `strokeDasharray` in `handwritingEffects.jsx` | Pending (after P5) |
| N1 | SVG-based `NoiseTexture` overlay | Pending (after N1) |
| General | `Archive/` directory cleanup | Pending |

---

## Architecture Decisions (Reference)

### More Mid-Scenes vs Complex Schemas (Section 13)

**Decision: FAVOR MORE MID-SCENES.** LLMs work better with distinct types. Each mid-scene has its own flat schema. Branching within a mid-scene is only appropriate when the content structure is identical (e.g., different `revealType` values with the same `lines` array).

### Overlap Resolution Matrix (Section 14)

| Capability | USE |
|-----------|-----|
| Scene transitions | Remotion Core (`@remotion/transitions`) |
| Spring physics | Remotion Core `spring()` for individual elements |
| Element entrance (groups/lists) | remotion-bits `StaggeredMotion` |
| Easing curves | Remotion Core `Easing` module |
| Particles | CHECK WITH USER (remotion-bits for new effects, KnoMotion for existing) |
| Code blocks | remotion-bits `CodeBlock` |
| 3D scenes | CHECK WITH USER (remotion-bits `Scene3D` as default, `@remotion/three` only if WebGL needed) |
| Text reveals | remotion-bits as rendering primitives inside KnoMotion's `TextRevealSequence` |
| Noise/grain | Remotion Core `@remotion/noise` |
| Gradients | Both — KnoMotion static presets + remotion-bits animated as opt-in |
| Captions | Remotion Core `@remotion/captions` |

---

## Dependency Summary

### Installed

| Package | Version | Purpose |
|---------|---------|---------|
| `remotion` | 4.0.382 | Core |
| `@remotion/player` | 4.0.382 | Available for future use |
| `@remotion/transitions` | 4.0.382 | TransitionSeries (P1) |
| `@remotion/captions` | 4.0.382 | Caption overlay (P4c) |
| `@remotion/lottie` | 4.0.382 | Lottie animations |
| `@remotion/animated-emoji` | 4.0.382 | Animated emoji (CDN-based via Google Noto) |
| `@remotion/google-fonts` | 4.0.382 | Font loading |
| `remotion-bits` | 0.2.0 | StaggeredMotion, CodeBlock, AnimatedText, TypeWriter |
| `culori` | latest | Peer dependency for remotion-bits |
| `zod` | ^3.25 | Schema validation |

### To Install (When Needed)

| Package | Version | Task |
|---------|---------|------|
| `@remotion/noise` | 4.0.382 | N1 |
| `@remotion/shapes` | 4.0.382 | N2 |
| `@remotion/paths` | 4.0.382 | P5 |
| `@remotion/layout-utils` | 4.0.382 | Text fitting |
| `@remotion/rounded-text-box` | 4.0.382 | Caption styling |
| `@remotion/openai-whisper` | 4.0.382 | Pipeline stage 9 |

> **CRITICAL:** All `@remotion/*` packages must be exact version 4.0.382. No `^` prefixes.

---

## Chunk Sequencing (Remaining)

| Chunk | Scope | Dependencies |
|-------|-------|-------------|
| 8 | Pipeline A — Scaffold + Render Stage | None |
| 9 | Pipeline B — Audio Pipeline (Stages 8-11) | Chunk 8 |
| 10 | Pipeline C — Content Pipeline (Stages 1-7) | Chunk 8 |
| 11 | Pipeline D — Production Hardening | Chunks 9, 10 |
| 12+ | New mid-scenes, Tier 2 remotion-bits, nice-to-haves, layout-utils | Any order |

---

## Implementation Kickstart Prompt

```
You are working in the KnoMotion repository — a JSON-first video engine built on Remotion.

## Your Bible

Read BUILD_STATUS.md at the repo root FIRST. It contains the remaining roadmap,
architecture decisions, overlap guidance, and chunk sequencing.
Do not deviate from it. If something isn't in the plan, ask me before implementing.

## Completed Work (Chunks 1-7)

The engine core is fully built. Key facts:

- **11 mid-scenes** (10 original + codeBlock from remotion-bits). All have JSON schemas.
- **GenericVideoPlayer** (`compositions/GenericVideoPlayer.jsx`) is THE composition.
  Registered as `KnoMotionVideo` in Root.tsx with `calculateMetadata()`.
- **Audio layer** in `sdk/audio/`: AudioLayer, CaptionOverlay, SafeAudio.
  3 caption styles: tiktok, subtitle, karaoke.
- **Transitions** via `@remotion/transitions` TransitionSeries. Layer: `sdk/transitions/index.ts`.
- **Zod schema** (`sdk/schemas/videoConfig.schema.ts`) registered on KnoMotionVideo.
- **Capability manifest** (`sdk/capability-manifest.json`) for LLM self-validation.
- **Spring presets** consolidated in `theme/animationPresets.ts` (SPRING_PRESETS).
- **Easing** uses Remotion `Easing` via EZ map in `core/easing.ts`.
- **remotion-bits@0.2.0** installed. Used by:
  - textReveal: 5 new revealTypes (blurSlide, charByChar, glitchIn, variableTypewriter, glitchCycle)
  - gridCards: centerRipple animation (StaggeredMotion)
  - checklist: listReveal animation (StaggeredMotion)
  - codeBlock: new mid-scene (CodeBlock + TypeWriter)
- **Animated emoji** uses Google Noto Emoji Lottie CDN (generic, self-maintaining).
- **Player (R1)** skipped — not needed for pre-render-to-MP4 pipeline.

## Context Files

- docs/ARCHITECTURE.md — Engine architecture
- docs/reference-llm-guide.md — JSON schemas for LLMs
- docs/instructions-llm-guide.md — LLM behavioral guidelines
- SDK.md — Full SDK reference
- KnoMotion-Videos/src/compositions/GenericVideoPlayer.jsx — Universal composition
- KnoMotion-Videos/src/compositions/SceneRenderer.jsx — Scene renderer (SceneFromConfig)
- KnoMotion-Videos/src/sdk/audio/ — Audio layer
- KnoMotion-Videos/src/sdk/transitions/index.ts — Transition layer
- KnoMotion-Videos/src/sdk/mid-scenes/index.js — Mid-scene registry
- KnoMotion-Videos/src/remotion/Root.tsx — Composition registration

## Three Sources of Truth

1. **Remotion MCP** — Canonical API for any @remotion/* package.
2. **remotion-bits** (https://remotion-bits.dev/docs/bits-catalog/) — StaggeredMotion,
   CodeBlock, Scene3D, Particles, text effects.
3. **BUILD_STATUS.md** — Architecture decisions, overlap guidance, remaining work.

## Rules

- **Overlap:** See resolution matrix in BUILD_STATUS.md. If it says CHECK WITH USER, ask.
- **Versions:** All @remotion/* must be 4.0.382. No ^ prefixes.
- **Legacy deletion:** When completing a task with a deletion entry, delete in same commit.
- **Mid-scene checklist:** component file, schema file, registry entry, MID_SCENE_COMPONENTS entry.
- **Build check:** `npx remotion bundle KnoMotion-Videos/src/remotion/index.ts`
- **Composition check:** `npx remotion compositions KnoMotion-Videos/src/remotion/index.ts`
- `npm run build` is Vite (admin UI), NOT Remotion. Use the above.

## How to Work — Iterative Chunks

Work in focused chunks with 3 sign-offs per chunk:
1. Present plan → wait for approval
2. Development complete → present summary → wait for feedback
3. Closing sign-off → update BUILD_STATUS.md

## What "Done" Looks Like

- Bundle compiles without errors
- No lint regressions
- Legacy code deleted per register
- New mid-scenes have: component, schema, registry entry, SceneRenderer entry
- Documentation updated (reference-llm-guide, SDK.md, ARCHITECTURE.md)
- BUILD_STATUS.md updated
- Commit message describes what was done
- Changes pushed
```

---

*End of Build Status Document*
