# KnoMotion Build Status & Improvement Plan

> Comprehensive technical roadmap for agent-driven implementation sessions.
> Generated: 2026-04-01

---

## Table of Contents

1. [Product Alignment Score](#1-product-alignment-score)
2. [Blue Sky Authoring Pipeline Assessment](#2-blue-sky-authoring-pipeline-assessment)
3. [Professional Polish Strategy](#3-professional-polish-strategy)
4. [Build Tasks — POLISH](#4-build-tasks--polish)
5. [Build Tasks — SPEED TO CREATE](#5-build-tasks--speed-to-create)
6. [Build Tasks — RENDERING](#6-build-tasks--rendering)
7. [Build Tasks — PERSONALISATION](#7-build-tasks--personalisation)
8. [Build Tasks — NICE TO HAVES](#8-build-tasks--nice-to-haves)
9. [Legacy Code Deletion Register](#9-legacy-code-deletion-register)
10. [Dependency Summary](#10-dependency-summary)
11. [AMAZING POLISH — New Mid-Scenes, Layouts & KnoMotion Additions](#11-amazing-polish--new-mid-scenes-layout-primitives--knomotion-specific-additions)
12. [remotion-bits Integration Plan](#12-remotion-bits-integration-plan)
13. [Architecture Decision: More Mid-Scenes vs Complex Schemas](#13-architecture-decision-more-mid-scenes-vs-complex-schemas)
14. [Overlap Guidance: Remotion MCP vs remotion-bits vs KnoMotion SDK](#14-overlap-guidance-remotion-mcp-vs-remotion-bits-vs-knomotion-sdk)
15. [`@remotion/layout-utils` — Text Measurement & Fitting](#15-remotionlayout-utils--text-measurement--fitting)
16. [Blue-Sky Pipeline Gaps — Final Sweep](#16-blue-sky-pipeline-gaps--final-sweep)

---

## 1. Product Alignment Score

### Score: 7/10

**What's strong (earning the 7):**
- The JSON-first architecture is perfectly aligned with the blue sky pipeline. Scene configs are pure data — exactly what an LLM produces.
- The mid-scene component library (10 types) covers the most common educational video patterns.
- The beats system (seconds-based timing) maps directly to TTS word-level timestamps.
- The style preset + emphasis system gives the LLM a constrained, brand-safe vocabulary.
- The `SceneFromConfig` orchestrator already separates data from rendering — the core contract for an agent-driven workflow.
- Zod is already in `package.json` and `scene.schema.ts` exists, so validation infrastructure is partially present.

**What's holding it back from 10 (the gaps):**
- **No audio layer at all.** The engine produces silent video. TTS/narration alignment is the single biggest gap to the blue sky vision. (-1)
- **No generic composition.** Every video requires a new `.jsx` file in `compositions/`. There's no single parameterised composition that accepts scene JSON as input props and dynamically adjusts duration/dimensions. This blocks the "agent creates JSON → video renders" pipeline. (-0.5)
- **No TTS-to-beats alignment tooling.** The beats system works in seconds, which is TTS-friendly, but there's no function to convert word-level timestamps (from Whisper/TTS APIs) into beat objects. (-0.5)
- **Schemas incomplete.** Missing schemas for `BigNumberReveal`, `AnimatedCounter`. Several schemas behind implementation (`SideBySide` beforeAfter, `BubbleCallout` collision). LLM validation depends on complete schemas. (-0.5)
- **Transitions are hand-rolled.** Custom `SceneTransitionWrapper` instead of `@remotion/transitions`, missing spring physics and audio transition support. (-0.25)
- **No captions/subtitles.** `@remotion/captions` is not used. Professional learning videos need subtitles. (-0.25)

### Path to 10/10

Addressing tasks P1 (transitions), P4 (audio layer), S2 (generic composition), S3 (Zod schemas), and S5 (TTS-to-beats alignment) would bring the score to 9.5+.

---

## 2. Blue Sky Authoring Pipeline Assessment

### The Proposed Pipeline

```
PDF Upload → Agent Assessment → JSON Generation → CI Feedback Loop →
Script Creation → TTS + Beat Alignment → Final Video Output
```

### Stage-by-Stage Analysis

#### Stage 1: PDF Upload & Agent Assessment
**Feasibility: HIGH**
The agent reads the PDF, extracts learning objectives, key concepts, visual opportunities. This is standard LLM document analysis.

**KnoMotion alignment:** The agent needs to know the constraints of the engine (available mid-scenes, layout types, lottie keys, beat timing rules). Your `reference-llm-guide.md` and `instructions-llm-guide.md` already serve as the system prompt — this is well architected.

**Gap:** The agent needs a machine-readable capability manifest (not just markdown) — a JSON schema of what mid-scenes exist, their configs, valid lottie keys, layout types. This enables the agent to self-validate before outputting.

#### Stage 2: Agent Creates JSON for Each Video
**Feasibility: HIGH**
This is the core use case KnoMotion was built for. The LLM generates scene JSON arrays.

**KnoMotion alignment:** Strong. The JSON schema is well-defined. The LLM guides (reference + instructions) provide clear constraints.

**Gap:** The "flagging where current implementation can't handle the ask" requires the agent to know the boundary of what's supported. This means the capability manifest must include explicit "not supported" declarations (e.g., "no video embedding", "no interactive elements", "no branching paths", "max 8 cards in a grid").

#### Stage 3: CI Feedback Loop
**Feasibility: HIGH**
Agent proposes JSON. You review. Agent either: (a) builds within constraints, or (b) extends the engine with a new mid-scene/feature.

**KnoMotion alignment:** The modular mid-scene architecture makes CI tractable. A new mid-scene is a self-contained component + schema + registry entry.

**Gap:** Need automated validation tooling — a CLI or function that takes scene JSON, runs it through Zod schemas + business rules, and outputs a structured error/warning report. `scene-validator.js` exists but needs the complete schema coverage.

#### Stage 4: Script Creation
**Feasibility: HIGH**
Agent transforms the learning content into a narration script, with timestamps/cues aligned to the scene structure.

**KnoMotion alignment:** Each scene has `durationInFrames` at 30fps, so timing is deterministic. The script can be structured as: "Scene 1 (0-5s): [narration text]. Scene 2 (5-13s): [narration text]."

**Gap:** No script schema exists. Need a `NarrationScript` type that maps scene IDs to narration text + timing windows.

#### Stage 5: TTS + Beat Alignment
**Feasibility: MEDIUM-HIGH**
Script → TTS API (ElevenLabs, Google Cloud TTS, Azure TTS) → audio file + word-level timestamps. Timestamps → beat objects in scene JSON.

**KnoMotion alignment:** The beats system uses seconds, which directly maps to TTS timestamps. Key alignment:
- `beats.start` = when the TTS word/phrase begins
- `beats.exit` = when the TTS phrase ends (+ buffer)
- `beats.emphasis` = when the key word is spoken

**Remotion support:**
- `@remotion/captions` provides `Caption` type (`startMs`, `endMs`, `text`, `confidence`), `parseSrt()`, `serializeSrt()`, `createTikTokStyleCaptions()`.
- `@remotion/openai-whisper` provides `openAiWhisperApiToCaptions()` for word-level timestamps.
- `@remotion/install-whisper-cpp` provides local `transcribe()` with `tokenLevelTimestamps: true` for offline TTS-to-caption conversion.

**Gap:** Need a `ttsToBeatAlignment()` function that takes TTS caption data and scene JSON, then injects aligned beats + adds `<Html5Audio>` narration track. This is the critical bridge function.

#### Stage 6: Final Video Output
**Feasibility: HIGH**
Scene JSON (now with audio-aligned beats) → generic composition → Remotion Player preview or Lambda render → MP4.

**KnoMotion alignment:** Once the generic composition exists (task S2), this is just `renderMediaOnLambda()` or `npx remotion render`.

### Pipeline Dependency Graph

```
[PDF Upload]
     │
     ▼
[Agent Assessment] ← needs: capability manifest (S4)
     │
     ▼
[JSON Generation] ← needs: complete schemas (S3), validation CLI (S6)
     │
     ├──→ [CI: extend engine] (optional)
     │
     ▼
[Script Creation] ← needs: narration schema (P4c)
     │
     ▼
[TTS Generation] ← needs: TTS API integration (P4b)
     │
     ▼
[Beat Alignment] ← needs: ttsToBeatAlignment() (P4d)
     │
     ▼
[Final Render] ← needs: generic composition (S2), Lambda pipeline (R1)
```

---

## 3. Professional Polish Strategy

### What Makes Videos Feel "Extremely Professional" via Remotion

#### A. Spring-Physics Transitions (`@remotion/transitions`)
Replace all hand-rolled transitions with `TransitionSeries` + `springTiming()`. Spring physics create natural, broadcast-quality motion that linear interpolation cannot match. Available presentations: `fade()`, `slide()`, `wipe()`, `flip()`, `clockWipe()`, `iris()`, `cube()`.

#### B. Audio Design
Silent video instantly feels amateur. Three audio layers:
1. **Narration** (TTS or human VO) — `<Html5Audio>` with per-scene audio tracks.
2. **Background music** — Low-level ambient track, ducked during narration.
3. **Sound effects** — Transition sounds (swoosh, page turn), element entrance sounds (pop, chime). Remotion supports audio transitions natively via `@remotion/transitions` audio.

#### C. Animated Subtitles / Captions
`@remotion/captions` + `createTikTokStyleCaptions()` for word-level animated subtitles. This is the single most impactful visual feature for TikTok/Reels format — every professional short-form video has animated captions.

#### D. Procedural Noise & Organic Motion
Replace the static `NoiseTexture` overlay with `@remotion/noise` `noise2D(seed, x, y)` where `x` and `y` vary per frame. This creates living, breathing backgrounds. Use `noise3D` with frame as the third dimension for animated grain.

#### E. SVG Path Animation
Replace `handwritingEffects.jsx` path drawing with `@remotion/paths` `evolvePath(progress, path)`. Combine with `interpolatePath()` for morphing shapes. Use `@remotion/shapes` (`<Star>`, `<Circle>`, `<Pie>`, `<Heart>`) for decorative elements that evolve into view.

#### F. Micro-Interactions & Continuous Life
Every static moment should have subtle motion: `getContinuousBreathing()` on cards, `getContinuousFloating()` on icons, animated emoji via `@remotion/animated-emoji`. The engine already has these in `animations/index.js` — they need to be applied more consistently in mid-scenes.

#### G. Consistent Easing Language
All animations should use one of 3-4 approved easing curves from Remotion's `Easing` module (e.g., `Easing.bezier(0.33, 1, 0.68, 1)` for entrances, `Easing.out(Easing.cubic)` for exits). Currently the codebase mixes custom easings with Remotion's built-in ones.

---

## 4. Build Tasks — POLISH

### P1: Adopt `@remotion/transitions` with `TransitionSeries`

**Priority:** HIGH
**Impact:** Major polish improvement + cleaner code

#### P1a: Create presentation adapters for custom transitions

**What:** Write custom `TransitionPresentation` implementations for `doodle-wipe` and `eraser` effects that currently live in `SceneTransitionWrapper`.

**Files to create/modify:**
- Create: `KnoMotion-Videos/src/sdk/transitions/doodleWipePresentation.ts`
- Create: `KnoMotion-Videos/src/sdk/transitions/eraserPresentation.ts`
- Create: `KnoMotion-Videos/src/sdk/transitions/index.ts` (barrel + `resolvePresentation()` mapper)

**Implementation detail:**
```typescript
import { TransitionPresentation } from '@remotion/transitions';

export function doodleWipe(options?: { direction?: 'left' | 'right' }): TransitionPresentation {
  return {
    component: ({ presentationDirection, presentationProgress, passedProps }) => {
      // Port the clip-path + decorative SVG edge logic from
      // SceneTransitionWrapper's 'doodle-wipe' case (lines ~85-120)
      // presentationProgress replaces manual enterProgress/exitProgress
    },
  };
}
```

**`resolvePresentation()` mapper:**
```typescript
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { flip } from '@remotion/transitions/flip';
import { clockWipe } from '@remotion/transitions/clock-wipe';
import { iris } from '@remotion/transitions/iris';
import { doodleWipe } from './doodleWipePresentation';
import { eraser } from './eraserPresentation';

export function resolvePresentation(transition, viewport) {
  switch (transition.type) {
    case 'fade': return fade();
    case 'slide': return slide({ direction: transition.direction || 'from-right' });
    case 'page-turn': return flip({ direction: transition.direction || 'from-right' });
    case 'doodle-wipe': return doodleWipe({ direction: transition.direction });
    case 'eraser': return eraser();
    case 'clock-wipe': return clockWipe({ width: viewport.width, height: viewport.height });
    case 'iris': return iris({ width: viewport.width, height: viewport.height });
    default: return fade();
  }
}
```

#### P1b: Refactor canon video compositions to use `TransitionSeries`

**What:** Replace the `Series` + negative `offset` + `SceneTransitionWrapper` pattern in all canon video files.

**Files to modify:**
- `KnoMotion-Videos/src/compositions/TikTok_BrainLies.jsx`
- `KnoMotion-Videos/src/compositions/TikTok_ADHDOverpowered.jsx`
- `KnoMotion-Videos/src/compositions/TikTok_80msDelay.jsx`
- `KnoMotion-Videos/src/compositions/KnodoviaVideo1_AccidentalArrival.jsx`
- `KnoMotion-Videos/src/compositions/KnodoviaVideo2_Culture.jsx`
- `KnoMotion-Videos/src/compositions/KnodoviaVideo3_Economics.jsx`
- All mobile variants

**Current pattern (to replace):**
```jsx
<Series>
  {scenes.map((scene, index) => (
    <Series.Sequence
      key={scene.id}
      durationInFrames={scene.durationInFrames}
      offset={index === 0 ? 0 : -TRANSITION_FRAMES}
    >
      <SceneTransitionWrapper
        durationInFrames={scene.durationInFrames}
        transition={scene.transition}
      >
        <SceneFromConfig config={scene.config} />
      </SceneTransitionWrapper>
    </Series.Sequence>
  ))}
</Series>
```

**New pattern:**
```jsx
import { TransitionSeries } from '@remotion/transitions';
import { springTiming } from '@remotion/transitions';
import { resolvePresentation } from '../sdk/transitions';

<TransitionSeries>
  {scenes.map((scene, index) => (
    <React.Fragment key={scene.id}>
      {index > 0 && scene.transition && (
        <TransitionSeries.Transition
          presentation={resolvePresentation(scene.transition, viewport)}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })}
        />
      )}
      <TransitionSeries.Sequence durationInFrames={scene.durationInFrames}>
        <SceneFromConfig config={scene.config} />
      </TransitionSeries.Sequence>
    </React.Fragment>
  ))}
</TransitionSeries>
```

#### P1c: LEGACY DELETION — Remove `SceneTransitionWrapper`

**What:** After P1b is complete, delete `SceneTransitionWrapper` from `SceneRenderer.jsx`.

**Files to modify:**
- `KnoMotion-Videos/src/compositions/SceneRenderer.jsx` — Remove the `SceneTransitionWrapper` export and all its internal functions (`SLIDE_OFFSETS`, `DEFAULT_TRANSITION`, enterProgress/exitProgress logic, overlay rendering for doodle-wipe/eraser).
- Grep for any remaining imports of `SceneTransitionWrapper` and remove them.

**Lines to delete:** Approximately lines 50-160 of `SceneRenderer.jsx` (the entire `SceneTransitionWrapper` component and its helpers).

---

### P2: Standardize on Remotion's `spring()` and `Easing`

**Priority:** MEDIUM
**Impact:** Consistent, natural motion; reduced code duplication

#### P2a: Replace custom spring configs

**What:** Remove the duplicated `SPRING_CONFIGS` / `springConfigs` objects across the codebase and use Remotion's `spring()` directly with named presets.

**Files with duplicate spring configs to consolidate:**
- `KnoMotion-Videos/src/sdk/animations/index.js` — `SPRING_CONFIGS`
- `KnoMotion-Videos/src/sdk/theme/animationPresets.ts` — `SPRING_CONFIGS`
- `KnoMotion-Videos/src/sdk/broadcastAnimations.ts` — `springConfigs`

**Target:** Single `SPRING_PRESETS` in `theme/animationPresets.ts` that maps names to Remotion `spring()` config objects:
```typescript
export const SPRING_PRESETS = {
  gentle: { damping: 20, mass: 1, stiffness: 100 },
  smooth: { damping: 15, mass: 1, stiffness: 120 },
  bouncy: { damping: 10, mass: 1, stiffness: 150 },
  snappy: { damping: 20, mass: 0.8, stiffness: 200 },
  wobbly: { damping: 8, mass: 1, stiffness: 100 },
} as const;
```

#### P2b: Replace custom easing functions

**What:** Replace `sdk/easing.ts` custom implementations with re-exports from Remotion's `Easing` module.

**Files:**
- `KnoMotion-Videos/src/sdk/easing.ts` — Rewrite to thin wrappers around `import { Easing } from 'remotion'`

#### P2c: LEGACY DELETION — Remove `broadcastAnimations.ts` spring duplication

**What:** After P2a, the `springConfigs` object in `broadcastAnimations.ts` is redundant.

**Files to modify:**
- `KnoMotion-Videos/src/sdk/broadcastAnimations.ts` — Remove the `springConfigs` object and update functions to import from `theme/animationPresets.ts`.

---

### P3: Upgrade Animated Emoji Integration

**Priority:** MEDIUM
**Impact:** Visual richness in grid cards, checklists, icons

#### P3a: Self-host animated emoji assets

**What:** Copy the video assets from `@remotion/animated-emoji`'s public folder into `public/animated-emoji/`.

**Implementation:** Download from the `remotion-dev/animated-emoji` GitHub repo. Script: `scripts/download-animated-emojis.sh` (already exists — verify it works and covers all needed emoji).

#### P3b: Expand emoji-to-animated mapping in `Icon` atom

**What:** The `Icon` atom (`elements/atoms/Icon.jsx`) already detects animated emoji. Expand the mapping table to cover all emoji used in canon videos and common learning video emoji.

**Files to modify:**
- `KnoMotion-Videos/src/sdk/elements/atoms/Icon.jsx` — Extend the emoji → `@remotion/animated-emoji` name mapping.

---

### P4: Add Audio Layer to the Engine

**Priority:** CRITICAL (required for blue sky pipeline)
**Impact:** Transforms video quality from amateur to professional

#### P4a: Add audio fields to scene JSON schema

**What:** Extend the scene config schema to support audio.

**New schema fields:**
```typescript
// Scene-level audio
{
  audio?: {
    narration?: {
      src: string;          // URL to TTS audio file
      startFromSeconds?: number;
      volume?: number;      // 0-1
    };
    music?: {
      src: string;          // URL to background music
      volume?: number;      // 0-1, typically 0.1-0.3
      fadeIn?: number;      // seconds
      fadeOut?: number;      // seconds
    };
    sfx?: Array<{
      src: string;
      atSecond: number;     // when to play
      volume?: number;
    }>;
  };
  captions?: {
    enabled?: boolean;
    style?: 'tiktok' | 'subtitle' | 'karaoke';
    data?: Caption[];       // @remotion/captions Caption objects
  };
}
```

**Files to modify:**
- `KnoMotion-Videos/src/sdk/scene.schema.ts` — Add Zod schema for audio fields
- `docs/reference-llm-guide.md` — Document audio config

#### P4b: Create `AudioLayer` component

**What:** A new component rendered by `SceneFromConfig` that handles narration, music, and SFX.

**File to create:** `KnoMotion-Videos/src/sdk/audio/AudioLayer.jsx`

**Implementation detail:**
```jsx
import { Html5Audio, Sequence, useVideoConfig } from 'remotion';

export const AudioLayer = ({ audio, durationInFrames }) => {
  const { fps } = useVideoConfig();
  return (
    <>
      {audio.narration && (
        <Sequence from={Math.round((audio.narration.startFromSeconds || 0) * fps)}>
          <Html5Audio
            src={audio.narration.src}
            volume={audio.narration.volume ?? 1}
          />
        </Sequence>
      )}
      {audio.music && (
        <Html5Audio
          src={audio.music.src}
          volume={(f) => {
            // Implement fadeIn/fadeOut volume curves
            const fadeInFrames = (audio.music.fadeIn || 0) * fps;
            const fadeOutFrames = (audio.music.fadeOut || 0) * fps;
            const base = audio.music.volume ?? 0.15;
            if (f < fadeInFrames) return base * (f / fadeInFrames);
            if (f > durationInFrames - fadeOutFrames)
              return base * ((durationInFrames - f) / fadeOutFrames);
            return base;
          }}
        />
      )}
      {audio.sfx?.map((sfx, i) => (
        <Sequence key={i} from={Math.round(sfx.atSecond * fps)}>
          <Html5Audio src={sfx.src} volume={sfx.volume ?? 0.5} />
        </Sequence>
      ))}
    </>
  );
};
```

#### P4c: Create `CaptionOverlay` component

**What:** Render animated captions over the video.

**File to create:** `KnoMotion-Videos/src/sdk/audio/CaptionOverlay.jsx`

**Uses:** `@remotion/captions` `createTikTokStyleCaptions()` for word-level animated subtitles.

#### P4d: Create `ttsToBeatAlignment()` utility

**What:** Bridge function that converts TTS word-level timestamps to KnoMotion beats.

**File to create:** `KnoMotion-Videos/src/sdk/utils/ttsToBeatAlignment.ts`

**Implementation detail:**
```typescript
import { Caption } from '@remotion/captions';

interface BeatAlignment {
  scenes: Array<{
    sceneId: string;
    beats: { start: number; exit: number };
    lines?: Array<{
      text: string;
      beats: { start: number; exit: number; emphasis?: number };
    }>;
  }>;
  totalDurationSeconds: number;
}

export function alignTTSToBeats(
  captions: Caption[],
  scenes: SceneConfig[],
  options?: { bufferSeconds?: number; emphasisWords?: string[] }
): BeatAlignment {
  // 1. Map caption timestamps (ms) to scene timelines
  // 2. For each scene, find the captions that fall within its time window
  // 3. Convert caption startMs/endMs to scene-relative seconds (beats)
  // 4. Optionally mark emphasis beats for specified keywords
}
```

---

### P5: Use `@remotion/paths` for Hand-Drawn Effects

**Priority:** LOW
**Impact:** Cleaner code, more precise path animations

#### P5a: Replace `handwritingEffects.jsx` path drawing with `evolvePath()`

**What:** The `getHandDrawnPath` and `getWriteOnAnimation` functions manually compute `strokeDasharray`/`strokeDashoffset`. `@remotion/paths` `evolvePath(progress, path)` does this in one call.

**Files to modify:**
- `KnoMotion-Videos/src/sdk/effects/handwritingEffects.jsx` — Replace internal path animation math with `evolvePath()`.

---

## 5. Build Tasks — SPEED TO CREATE

### S1: Zod Schemas for Remotion Studio Visual Editing

**Priority:** HIGH
**Impact:** Non-developers can author videos via Studio UI

#### S1a: Define Zod schema for complete video config

**What:** A Zod schema that describes the full scene array structure, attached to a `<Composition>` via the `schema` prop.

**File to create:** `KnoMotion-Videos/src/sdk/schemas/videoConfig.schema.ts`

**Implementation detail:**
```typescript
import { z } from 'zod';

const TransitionSchema = z.object({
  type: z.enum(['fade', 'slide', 'page-turn', 'doodle-wipe', 'eraser', 'clock-wipe', 'iris']),
  direction: z.enum(['up', 'down', 'left', 'right']).optional(),
});

const BackgroundSchema = z.object({
  preset: z.enum(['notebookSoft', 'sunriseGradient', 'cleanCard', 'chalkboardGradient', 'spotlight']),
  layerNoise: z.boolean().optional(),
  particles: z.object({
    enabled: z.boolean(),
    style: z.enum(['dots', 'chalk', 'snow', 'sparkle']).optional(),
    count: z.number().optional(),
    color: z.string().optional(),
    opacity: z.number().optional(),
  }).optional(),
});

// ... full schema for all mid-scene configs ...

export const VideoConfigSchema = z.object({
  format: z.enum(['desktop', 'mobile']).optional(),
  scenes: z.array(SceneSchema).min(1),
});
```

#### S1b: Register schema on compositions in `Root.tsx`

**What:** Attach the Zod schema to compositions so Remotion Studio enables visual editing.

**Files to modify:**
- `KnoMotion-Videos/src/remotion/Root.tsx` — Add `schema={VideoConfigSchema}` to `<Composition>` entries.

---

### S2: Generic Parameterized Composition

**Priority:** CRITICAL
**Impact:** Eliminates per-video composition files; enables the entire blue sky pipeline

#### S2a: Create `GenericVideoPlayer` component

**What:** A single composition that takes a scene array as input props and renders any KnoMotion video.

**File to create:** `KnoMotion-Videos/src/compositions/GenericVideoPlayer.jsx`

**Implementation detail:**
```jsx
import React from 'react';
import { AbsoluteFill, useVideoConfig } from 'remotion';
import { TransitionSeries, springTiming } from '@remotion/transitions';
import { SceneFromConfig } from './SceneRenderer';
import { resolvePresentation } from '../sdk/transitions';
import { AudioLayer } from '../sdk/audio/AudioLayer';

export const GenericVideoPlayer = ({ scenes }) => {
  const { width, height } = useVideoConfig();
  const viewport = { width, height };

  return (
    <AbsoluteFill>
      <TransitionSeries>
        {scenes.map((scene, index) => (
          <React.Fragment key={scene.id}>
            {index > 0 && scene.transition && (
              <TransitionSeries.Transition
                presentation={resolvePresentation(scene.transition, viewport)}
                timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })}
              />
            )}
            <TransitionSeries.Sequence durationInFrames={scene.durationInFrames}>
              <SceneFromConfig config={scene.config} />
              {scene.audio && (
                <AudioLayer audio={scene.audio} durationInFrames={scene.durationInFrames} />
              )}
            </TransitionSeries.Sequence>
          </React.Fragment>
        ))}
      </TransitionSeries>
    </AbsoluteFill>
  );
};
```

#### S2b: Register with `calculateMetadata()`

**What:** Dynamic composition registration in `Root.tsx`.

**Files to modify:**
- `KnoMotion-Videos/src/remotion/Root.tsx`

**Implementation detail:**
```tsx
<Composition
  id="KnoMotionVideo"
  component={GenericVideoPlayer}
  schema={VideoConfigSchema}
  fps={30}
  width={1920}
  height={1080}
  defaultProps={{ scenes: [] }}
  calculateMetadata={({ props }) => {
    const totalFrames = props.scenes.reduce((sum, s) => sum + s.durationInFrames, 0);
    const transitionOverlap = Math.max(0, (props.scenes.length - 1) * 20);
    const isMobile = props.format === 'mobile';
    return {
      durationInFrames: totalFrames - transitionOverlap,
      width: isMobile ? 1080 : 1920,
      height: isMobile ? 1920 : 1080,
    };
  }}
/>
```

---

### S3: Complete Mid-Scene Schemas

**Priority:** HIGH
**Impact:** LLM validation, Studio editing, agent self-checking

#### S3a: Add missing schemas

**Files to create:**
- `KnoMotion-Videos/src/sdk/mid-scenes/schemas/BigNumberReveal.schema.json`
- `KnoMotion-Videos/src/sdk/mid-scenes/schemas/AnimatedCounter.schema.json`

#### S3b: Update incomplete schemas

**Files to modify:**
- `SideBySideCompare.schema.json` — Add `mode`, `beforeAfter`, `slider` fields
- `BubbleCalloutSequence.schema.json` — Add `collisionDetection`, `jitter` fields
- `HeroTextEntranceExit.schema.json` — Mark `text` as optional (code allows it)

#### S3c: Add `BigNumberReveal` to mid-scenes barrel

**Files to modify:**
- `KnoMotion-Videos/src/sdk/mid-scenes/index.js` — Add `BigNumberReveal` export and `MID_SCENE_REGISTRY` entry.

---

### S4: Capability Manifest for Agents

**Priority:** HIGH
**Impact:** Enables reliable agent-driven JSON generation

#### S4a: Generate machine-readable capability manifest

**What:** A JSON file that declares everything the engine can and cannot do. Auto-generated from schemas + registry.

**File to create:** `KnoMotion-Videos/src/sdk/capability-manifest.json`

**Content structure:**
```json
{
  "version": "1.0",
  "midScenes": {
    "textReveal": { "supported": true, "maxLines": 4, "requiredFields": ["lines"] },
    "heroText": { "supported": true, "requiredFields": ["heroRef", "beats"] },
    ...
  },
  "layouts": ["full", "rowStack", "columnSplit", "gridSlots"],
  "backgrounds": ["notebookSoft", "sunriseGradient", ...],
  "transitions": ["fade", "slide", "page-turn", "doodle-wipe", "eraser"],
  "lottieKeys": ["success", "checkmark", "loading", ...],
  "constraints": {
    "maxScenesPerVideo": 20,
    "maxCardsInGrid": 8,
    "maxColumnsInGrid": 6,
    "fpsFixed": 30,
    "beatsInSeconds": true
  },
  "unsupported": [
    "embedded video playback",
    "interactive/branching elements",
    "real-time data binding",
    "3D scenes"
  ]
}
```

---

### S5: TTS-to-Beats Pipeline Tooling

**Priority:** HIGH
**Impact:** Bridges the gap between script and rendered video

(Covered in P4d above — `ttsToBeatAlignment()` utility)

---

### S6: Scene Validation CLI

**Priority:** MEDIUM
**Impact:** Agent self-checking, CI pipeline validation

#### S6a: Enhance `scene-validator.js` with complete coverage

**Files to modify:**
- `KnoMotion-Videos/src/sdk/scene-validator.js` — Add validation for all mid-scene schemas, beat timing rules, slot name matching, lottie key existence.

#### S6b: Add npm script for validation

**Files to modify:**
- `package.json` — Add `"validate": "node scripts/validate-scenes.js"`

---

## 6. Build Tasks — RENDERING

### R1: Remotion Player Integration

**Priority:** HIGH
**Impact:** Instant personalized preview in Knode's web app

#### R1a: Create Player wrapper component

**What:** A React component that wraps `@remotion/player`'s `<Player>` with KnoMotion defaults.

**File to create:** `KnoMotion-Videos/src/player/KnoMotionPlayer.jsx`

**Implementation detail:**
```jsx
import { Player } from '@remotion/player';
import { GenericVideoPlayer } from '../compositions/GenericVideoPlayer';

export const KnoMotionPlayer = ({ scenes, format = 'desktop', ...playerProps }) => {
  const isMobile = format === 'mobile';
  const totalFrames = scenes.reduce((sum, s) => sum + s.durationInFrames, 0);
  const transitionOverlap = Math.max(0, (scenes.length - 1) * 20);

  return (
    <Player
      component={GenericVideoPlayer}
      inputProps={{ scenes, format }}
      compositionWidth={isMobile ? 1080 : 1920}
      compositionHeight={isMobile ? 1920 : 1080}
      fps={30}
      durationInFrames={totalFrames - transitionOverlap}
      controls
      style={{ width: '100%' }}
      {...playerProps}
    />
  );
};
```

#### R1b: Add `@remotion/preload` for asset preloading

**What:** Preload lottie/image assets referenced in scene JSON before Player mounts.

**File to create:** `KnoMotion-Videos/src/player/preloadSceneAssets.ts`

---

### R2: Lambda Rendering Pipeline

**Priority:** MEDIUM (depends on S2)
**Impact:** Production-scale video rendering

#### R2a: Lambda setup documentation and scripts

**What:** Deploy scripts for Lambda function + S3 site.

**Files to create:**
- `scripts/deploy-lambda.sh` — `npx remotion lambda functions deploy` + `npx remotion lambda sites create`
- Document the env vars needed: `REMOTION_AWS_ACCESS_KEY_ID`, `REMOTION_AWS_SECRET_ACCESS_KEY`, `REMOTION_AWS_REGION`

#### R2b: Create render API endpoint

**What:** Node.js function that accepts scene JSON and triggers Lambda render.

**File to create:** `scripts/render-video.ts`

**Implementation detail:**
```typescript
import { renderMediaOnLambda, getRenderProgress } from '@remotion/lambda/client';

export async function renderVideo(scenes: SceneConfig[], options: RenderOptions) {
  const render = await renderMediaOnLambda({
    serveUrl: process.env.REMOTION_SERVE_URL,
    composition: 'KnoMotionVideo',
    functionName: process.env.REMOTION_FUNCTION_NAME,
    region: process.env.REMOTION_REGION,
    inputProps: { scenes, format: options.format },
    codec: 'h264',
  });

  // Poll progress
  while (true) {
    const progress = await getRenderProgress({
      renderId: render.renderId,
      bucketName: render.bucketName,
      functionName: process.env.REMOTION_FUNCTION_NAME,
      region: process.env.REMOTION_REGION,
    });
    if (progress.done) return progress.outputFile;
    if (progress.fatalErrorEncountered) throw new Error(progress.errors[0].message);
    await new Promise(r => setTimeout(r, 1000));
  }
}
```

---

### R3: Client-Side Rendering (Future / Track)

**Priority:** LOW (experimental)
**Status:** `@remotion/web-renderer` is alpha. Track `github.com/remotion-dev/remotion/issues/5913`.

**When to revisit:** When the package exits alpha and supports the CSS properties KnoMotion uses (gradients, backdrop-filter, complex SVG).

---

## 7. Build Tasks — PERSONALISATION

### L1: Parameterized Rendering Pipeline

(Covered by S2 — `GenericVideoPlayer` + `calculateMetadata()`)

### L2: Scene Selection Engine

**Priority:** MEDIUM
**Impact:** Core personalisation capability

#### L2a: Create `buildPersonalizedScenes()` function

**File to create:** `KnoMotion-Videos/src/sdk/personalisation/sceneSelector.ts`

**Implementation detail:**
```typescript
interface LearnerProfile {
  name: string;
  weakTopics: string[];
  strongTopics: string[];
  preferredStyle: 'visual' | 'textual' | 'interactive';
  pace: 'slow' | 'normal' | 'fast';
  nextModule?: string;
}

export function buildPersonalizedScenes(
  profile: LearnerProfile,
  contentLibrary: ContentLibrary
): SceneConfig[] {
  const scenes: SceneConfig[] = [];
  const paceMultiplier = { slow: 1.3, normal: 1.0, fast: 0.8 }[profile.pace];

  // 1. Hook scene personalized with name
  scenes.push(createHookScene(profile.name));

  // 2. Style-adapted content scenes
  for (const topic of profile.weakTopics) {
    const topicScenes = contentLibrary.getExplainerScenes(topic);
    scenes.push(...adaptToStyle(topicScenes, profile.preferredStyle));
  }

  // 3. Quick review of strong topics
  for (const topic of profile.strongTopics) {
    scenes.push(contentLibrary.getSummaryScene(topic));
  }

  // 4. Adjust timing by pace
  return scenes.map(s => ({
    ...s,
    durationInFrames: Math.round(s.durationInFrames * paceMultiplier),
  }));
}
```

### L3: Dynamic calculateMetadata with Learner Data

(Covered in S2b — `calculateMetadata()` can fetch learner profile and build scenes)

---

## 8. Build Tasks — NICE TO HAVES

### N1: `@remotion/noise` for Organic Backgrounds

**Priority:** LOW
**Impact:** More natural-feeling background textures

**What:** Replace the static `NoiseTexture` component (semi-transparent SVG overlay) with animated procedural noise using `noise2D(seed, x * 0.01, frame * 0.01)`.

**Files to modify:**
- `KnoMotion-Videos/src/sdk/effects/broadcastEffects.tsx` — Rewrite `NoiseTexture` component.

---

### N2: `@remotion/shapes` for Decorative Elements

**Priority:** LOW

**What:** Use `<Star>`, `<Circle>`, `<Heart>`, `<Pie>` with `evolvePath()` for animated decorative reveals in backgrounds or as mid-scene accent elements.

---

### N3: Thumbnail Generation

**Priority:** LOW

**What:** Use `renderStill()` or `renderStillOnLambda()` to auto-generate poster images for each video.

**Implementation:** Add a script `scripts/generate-thumbnail.ts` that renders frame 0 (or a specified frame) of a composition.

---

### N4: Frame-Rate Independence Audit

**Priority:** LOW

**What:** Audit all animation code for hard-coded `30` fps values. Replace with `fps` from `useVideoConfig()`.

**Known violations:**
- `TextRevealSequence.jsx` — `getMaskReveal` uses `startFrame/30`
- Various animation helpers that divide by `30` directly

---

### N5: Streaming Render Progress UX

**Priority:** LOW (depends on R2)

**What:** Real-time progress bar in Knode UI using `getRenderProgress()` polling.

---

## 9. Legacy Code Deletion Register

This section tracks code that should be deleted after specific tasks are completed to avoid duplication.

| Task | Files / Code to Delete | Depends On |
|------|----------------------|------------|
| P1c | `SceneTransitionWrapper` export + all helper functions in `SceneRenderer.jsx` (~110 lines). Remove `SLIDE_OFFSETS`, `DEFAULT_TRANSITION`, enterProgress/exitProgress logic, doodle-wipe overlay, eraser overlay. | P1a, P1b complete |
| P1c | All `import { SceneTransitionWrapper }` statements across compositions. Remove `TRANSITION_FRAMES` constants from canon videos. | P1b complete |
| P2c | `springConfigs` object in `broadcastAnimations.ts`. Update functions to import from `theme/animationPresets.ts`. | P2a complete |
| P2c | Duplicate `SPRING_CONFIGS` in `animations/index.js` — consolidate to single source in `theme/animationPresets.ts`. | P2a complete |
| P2b | Custom easing implementations in `sdk/easing.ts` that duplicate Remotion's `Easing` module. Keep as thin re-exports only. | P2b complete |
| S2 | Individual canon video composition files can be simplified — their scene arrays become `defaultProps` for the `GenericVideoPlayer` composition. The rendering logic (Series/SceneTransitionWrapper pattern) in each file becomes redundant. Consider converting each to a simple `export const scenes = [...]` data file. | S2a, S2b, P1b complete |
| S3c | After `BigNumberReveal` is added to `mid-scenes/index.js`, remove the direct import in `SceneRenderer.jsx` if it was imported outside the registry pattern. | S3c complete |
| P5a | After `@remotion/paths` `evolvePath()` replaces hand-drawn path animation, remove the manual `strokeDasharray`/`strokeDashoffset` calculation in `handwritingEffects.jsx`. | P5a complete |
| N1 | After `@remotion/noise` replaces `NoiseTexture`, remove the old SVG-based noise overlay. | N1 complete |
| General | `Archive/` directory — once all legacy patterns are confirmed replaced, this directory can be removed or moved to a separate branch. | All tasks complete |

---

## 10. Dependency Summary

### New packages to install

| Package | Version | Task | Purpose |
|---------|---------|------|---------|
| `@remotion/transitions` | Match current remotion version (4.0.382) | P1 | `TransitionSeries`, `springTiming`, `linearTiming`, presentations |
| `@remotion/noise` | Match remotion version | N1 | `noise2D()`, `noise3D()` for procedural backgrounds |
| `@remotion/shapes` | Match remotion version | N2 | `<Star>`, `<Circle>`, `<Heart>`, `<Pie>` decorative elements |
| `@remotion/paths` | Match remotion version | P5 | `evolvePath()`, `interpolatePath()`, `getLength()` |
| `@remotion/captions` | Match remotion version | P4c | `Caption` type, `parseSrt()`, `createTikTokStyleCaptions()` |
| `@remotion/openai-whisper` | Match remotion version | P4d | `openAiWhisperApiToCaptions()` |
| `@remotion/preload` | Match remotion version | R1b | `preloadVideo()`, `preloadAudio()`, `preloadImage()` |
| `@remotion/web-renderer` | Match remotion version | R3 (future) | `renderMediaOnWeb()` — track only |

### Packages already in `package.json` (verify versions aligned)

| Package | Current | Notes |
|---------|---------|-------|
| `remotion` | 4.0.382 | Core |
| `@remotion/player` | 4.0.382 | Already present |
| `@remotion/lottie` | 4.0.382 | Already present |
| `@remotion/animated-emoji` | 4.0.382 | Already present |
| `@remotion/tailwind` | 4.0.382 | Already present |
| `zod` | Present | Already present |

> **CRITICAL:** All `@remotion/*` packages must be the exact same version. No `^` prefixes.

---

## Task Priority Matrix

| Priority | Task ID | Description | Depends On |
|----------|---------|-------------|------------|
| CRITICAL | S2 | Generic parameterized composition | P1 |
| CRITICAL | P4 | Audio layer (narration, music, captions) | — |
| HIGH | P1 | `@remotion/transitions` adoption | — |
| HIGH | S1 | Zod schemas for Studio visual editing | S3 |
| HIGH | S3 | Complete mid-scene schemas | — |
| HIGH | S4 | Capability manifest for agents | S3 |
| HIGH | R1 | Player integration | S2 |
| MEDIUM | P2 | Standardize spring/easing | — |
| MEDIUM | P3 | Animated emoji upgrade | — |
| MEDIUM | R2 | Lambda rendering pipeline | S2 |
| MEDIUM | L2 | Scene selection engine | S2 |
| MEDIUM | S6 | Scene validation CLI | S3 |
| LOW | P5 | `@remotion/paths` for hand-drawn effects | — |
| LOW | N1-N5 | Nice to haves | Various |

---

## 11. AMAZING POLISH — New Mid-Scenes, Layout Primitives & KnoMotion-Specific Additions

This section covers additions that move KnoMotion from "good educational video engine" to "wow, this looks like it was made by a professional studio."

### New Mid-Scenes

#### MS1: `progressTimeline` — Animated Progress / Journey Map

**What it does:** Renders a horizontal or vertical timeline with milestones that light up sequentially. Each milestone has an icon, label, and optional description. A progress line animates between milestones.

**Why it's amazing:** Every learning journey has stages. This mid-scene lets the LLM say "you're at step 3 of 7" visually. It also works for historical timelines, process flows, and story arcs.

**JSON config shape:**
```json
{
  "midScene": "progressTimeline",
  "config": {
    "milestones": [
      { "icon": "1️⃣", "label": "Foundations", "status": "complete" },
      { "icon": "2️⃣", "label": "Core Concepts", "status": "current" },
      { "icon": "3️⃣", "label": "Application", "status": "upcoming" }
    ],
    "orientation": "horizontal",
    "lineColor": "primary",
    "animation": "drawLine",
    "beats": { "start": 0.5 }
  }
}
```

**Remotion tech:** `@remotion/paths` `evolvePath()` for the animated connecting line. `@remotion/shapes` `<Circle>` for milestones. `spring()` for milestone pop-in.

**File to create:** `KnoMotion-Videos/src/sdk/mid-scenes/ProgressTimeline.jsx`

---

#### MS2: `quoteReveal` — Dramatic Quote / Testimonial

**What it does:** A large quotation mark fades in, followed by text that types or slides in word-by-word, followed by an attribution line. Optional background dim/spotlight.

**Why it's amazing:** Quotes and testimonials are core to learning content ("Einstein said..."). This creates a broadcast-quality quote card that would take hours in After Effects.

**JSON config shape:**
```json
{
  "midScene": "quoteReveal",
  "config": {
    "quote": "The only way to do great work is to love what you do.",
    "attribution": "Steve Jobs",
    "attributionRole": "Co-founder, Apple",
    "revealType": "wordByWord",
    "quoteMarkStyle": "large",
    "emphasis": ["great work", "love"],
    "beats": { "start": 0.3, "exit": 6.0 }
  }
}
```

**Remotion tech:** `spring()` for the quote mark entrance. Word-by-word reveal using `interpolate()` with stagger. `@remotion/motion-blur` `<Trail>` on the quote mark for a cinematic entrance blur.

**File to create:** `KnoMotion-Videos/src/sdk/mid-scenes/QuoteReveal.jsx`

---

#### MS3: `beforeAfterSlider` — Interactive-Style Before/After

**What it does:** A dedicated mid-scene (not overloaded into `sideBySide`) that shows a before/after comparison with an animated divider sliding across. Supports images, text blocks, or mixed content.

**Why it's amazing:** The current `sideBySide` has a `beforeAfter` mode buried in it, but it's undocumented in the schema and overloads the component. A dedicated mid-scene is cleaner for LLMs and more visually dramatic — the slider wipes across revealing the transformation.

**JSON config shape:**
```json
{
  "midScene": "beforeAfterSlider",
  "config": {
    "before": {
      "title": "Before KnoMotion",
      "image": { "src": "...", "fit": "cover" },
      "overlay": "Problem: 3 hours to create one video"
    },
    "after": {
      "title": "After KnoMotion",
      "image": { "src": "...", "fit": "cover" },
      "overlay": "Solution: 3 minutes with JSON"
    },
    "slider": {
      "autoAnimate": true,
      "from": 0.05,
      "to": 0.95,
      "style": "gradient"
    },
    "beats": { "start": 0.5, "exit": 8.0 }
  }
}
```

**Remotion tech:** `interpolate()` for the clip-path reveal. `spring()` for bounce at the end position.

**File to create:** `KnoMotion-Videos/src/sdk/mid-scenes/BeforeAfterSlider.jsx`

---

#### MS4: `codeBlock` — Syntax-Highlighted Code Reveal

**What it does:** Renders a code block with syntax highlighting, line-by-line or character-by-character typewriter reveal. Supports highlighting specific lines, cursor blink, and "diff" mode (red/green for removed/added).

**Why it's amazing:** KnoMotion is a tech product for learning. When teaching programming, data structures, or config formats, a proper code block mid-scene is essential. No other JSON-driven video engine does this well.

**JSON config shape:**
```json
{
  "midScene": "codeBlock",
  "config": {
    "code": "const video = await render(sceneJSON);",
    "language": "javascript",
    "theme": "dark",
    "revealType": "typewriter",
    "highlightLines": [1, 3],
    "showLineNumbers": true,
    "beats": { "start": 0.5, "exit": 6.0 }
  }
}
```

**Implementation:** Use a lightweight syntax tokenizer (no heavy deps — just regex-based token coloring for JS/Python/JSON). Typewriter effect via `interpolate(frame, ...)` on character count.

**File to create:** `KnoMotion-Videos/src/sdk/mid-scenes/CodeBlock.jsx`

---

#### MS5: `flowDiagram` — Animated Flow / Mind Map

**What it does:** Renders a simple flow diagram with nodes and animated connecting arrows. Nodes appear sequentially with spring animations, then arrows draw between them using `evolvePath()`.

**Why it's amazing:** Concept maps and flow diagrams are the backbone of educational content. Currently, you'd need a `gridCards` hack to approximate this. A dedicated flow diagram mid-scene with animated connections is a massive differentiator.

**JSON config shape:**
```json
{
  "midScene": "flowDiagram",
  "config": {
    "nodes": [
      { "id": "a", "label": "Input", "icon": "📥", "position": "left" },
      { "id": "b", "label": "Process", "icon": "⚙️", "position": "center" },
      { "id": "c", "label": "Output", "icon": "📤", "position": "right" }
    ],
    "connections": [
      { "from": "a", "to": "b", "label": "transform" },
      { "from": "b", "to": "c", "label": "render" }
    ],
    "direction": "horizontal",
    "nodeStyle": "rounded",
    "connectionAnimation": "drawLine",
    "beats": { "start": 0.5 }
  }
}
```

**Remotion tech:** `@remotion/paths` `evolvePath()` for animated arrow drawing. `@remotion/shapes` for node backgrounds. `calculateItemPositions(ARRANGEMENT_TYPES.STACKED_HORIZONTAL)` for node placement. `spring()` for node entrance.

**File to create:** `KnoMotion-Videos/src/sdk/mid-scenes/FlowDiagram.jsx`

---

#### MS6: `timerCountdown` — Dramatic Countdown / Timer

**What it does:** A large circular countdown timer that ticks down (or up) with arc animation. Optional pulse at key moments. Works for "you have 10 seconds to think" pause moments in learning videos.

**Why it's amazing:** Creates tension and engagement. The `<Pie>` component from `@remotion/shapes` with `progress` driven by `interpolate()` makes this trivially elegant.

**JSON config shape:**
```json
{
  "midScene": "timerCountdown",
  "config": {
    "from": 10,
    "to": 0,
    "label": "Think about it...",
    "color": "primary",
    "pulseAtSeconds": [3, 2, 1],
    "size": "lg",
    "beats": { "start": 0.3, "exit": 11.0 }
  }
}
```

**Remotion tech:** `@remotion/shapes` `<Pie progress={...}>` driven by `interpolate(frame, ...)`. `spring()` pulse at key seconds.

**File to create:** `KnoMotion-Videos/src/sdk/mid-scenes/TimerCountdown.jsx`

---

#### MS7: `revealStack` — Stacked Card Reveal / Flashcard

**What it does:** A stack of cards where each card flips or slides away to reveal the next. Like a deck of flashcards being dealt. Each card can have front/back content for "question → answer" reveals.

**Why it's amazing:** Flashcards are the most fundamental learning primitive. A stack that reveals answers creates "aha moments" in video form. No other video engine has this as a JSON-configurable component.

**JSON config shape:**
```json
{
  "midScene": "revealStack",
  "config": {
    "cards": [
      { "front": "What is spaced repetition?", "back": "Reviewing at increasing intervals" },
      { "front": "What is active recall?", "back": "Testing yourself from memory" }
    ],
    "revealType": "flip",
    "staggerDelay": 2.0,
    "beats": { "start": 0.5 }
  }
}
```

**Remotion tech:** 3D CSS `rotateY` transform for flip, or `@remotion/transitions` `flip()` presentation applied per-card. `spring()` for natural flip physics.

**File to create:** `KnoMotion-Videos/src/sdk/mid-scenes/RevealStack.jsx`

---

### New Layout Primitives

#### LP1: `focus` Layout — Spotlight with Context

**What it does:** A layout type where one slot gets 70-80% of the viewport as the "focus" area, and a smaller "context" strip sits along one edge (like a ticker or sidebar). The context strip can hold a persistent label, progress indicator, or branding.

**Why it's amazing:** Broadcast TV always has context — a lower third, a topic label, a progress bar. Adding a persistent context strip makes videos feel professional without requiring the LLM to manually position elements.

**Layout config:**
```json
{
  "type": "focus",
  "options": {
    "contextPosition": "bottom",
    "contextHeight": 120,
    "padding": 50
  }
}
```

**Slots generated:** `focus` (main area), `context` (persistent strip)

---

#### LP2: `splitDiagonal` Layout — Diagonal Split

**What it does:** Divides the viewport along a diagonal line. Two slots are created, each occupying a triangular/trapezoidal region. The divider can be animated (drawing in via `evolvePath()`).

**Why it's amazing:** Diagonal splits are a staple of professional video editing. They create visual energy that horizontal/vertical splits cannot. A single CSS `clip-path: polygon(...)` achieves this.

**Layout config:**
```json
{
  "type": "splitDiagonal",
  "options": {
    "angle": 15,
    "bias": 0.5
  }
}
```

**Slots generated:** `topLeft`, `bottomRight`

---

#### LP3: `pip` Layout — Picture-in-Picture

**What it does:** One slot fills the viewport ("main"), and a second smaller slot is inset in a corner ("pip"). The PIP slot has a subtle border/shadow and can be positioned in any corner.

**Why it's amazing:** Picture-in-picture is standard in educational content — show a speaker bubble, a diagram inset, or a Lottie animation in the corner while the main content plays. Currently requires manual absolute positioning.

**Layout config:**
```json
{
  "type": "pip",
  "options": {
    "pipPosition": "bottomRight",
    "pipSize": 0.25,
    "pipPadding": 30,
    "pipBorderRadius": 20
  }
}
```

**Slots generated:** `main`, `pip`

---

### KnoMotion-Specific Additions

#### KM1: Scene-Level Lower Third / Topic Banner

**What it does:** A persistent, semi-transparent banner at the bottom of the scene displaying the current topic, module name, or progress. Slides in with the scene, persists, slides out at exit. Configured at the scene level (not as a mid-scene).

**Why it's amazing:** Every professional educational video has a topic banner. It orients the learner and provides context. Making it scene-level means the LLM doesn't have to waste a slot on it.

**JSON config:**
```json
{
  "id": "scene-1",
  "config": {
    "lowerThird": {
      "title": "Module 3: Neural Networks",
      "subtitle": "Lesson 2 of 8",
      "icon": "🧠",
      "position": "bottomLeft",
      "style": "glass"
    }
  }
}
```

**File to create:** `KnoMotion-Videos/src/sdk/overlays/LowerThird.jsx`

**Rendered by:** `SceneFromConfig` as an overlay layer (after slots, before transitions).

---

#### KM2: Branded Intro/Outro Sequences

**What it does:** Pre-built intro and outro scene templates that the LLM can invoke by key. The intro shows the brand logo (Lottie), title, and subtitle with a signature animation. The outro shows a CTA, social links, or "next video" prompt.

**Why it's amazing:** Every video needs bookends. Currently the LLM manually creates hook/CTA scenes. Branded templates ensure consistency across hundreds of generated videos.

**JSON config:**
```json
{
  "id": "intro",
  "template": "brandedIntro",
  "config": {
    "title": "Neural Networks Explained",
    "subtitle": "Module 3 • KnoMotion Academy",
    "logo": "lottie:success",
    "theme": "educational"
  }
}
```

**File to create:** `KnoMotion-Videos/src/sdk/templates/BrandedIntro.jsx`, `BrandedOutro.jsx`

---

#### KM3: Scene-Level Watermark / Branding Overlay

**What it does:** A subtle, persistent watermark (logo, text, or both) that appears on every scene. Configurable opacity, position, and size. Set once at the video level, not per-scene.

**JSON config (video-level):**
```json
{
  "branding": {
    "watermark": {
      "text": "KnoMotion",
      "position": "topRight",
      "opacity": 0.15,
      "fontSize": 24
    }
  },
  "scenes": [...]
}
```

---

#### KM4: Motion Blur on Fast Transitions

**What it does:** Wraps scene transitions in `@remotion/motion-blur`'s `<CameraMotionBlur>` for cinematic blur during fast slides/wipes.

**Why it's amazing:** Motion blur is the single most recognizable marker of "professional" video. A fast slide transition with blur looks like broadcast TV; without it, it looks like a PowerPoint.

**Remotion tech:** `@remotion/motion-blur` `<CameraMotionBlur samples={10} shutterAngle={180}>` wrapping the transition layer.

---

#### KM5: Animated Progress Bar (Video-Level)

**What it does:** A thin animated progress bar across the top or bottom of every scene, showing how far through the video the learner is. Fills from left to right proportional to total video time.

**Why it's amazing:** YouTube-style progress bars embedded in the video itself. Learners know how much is left. Creates a sense of momentum.

**JSON config (video-level):**
```json
{
  "progressBar": {
    "enabled": true,
    "position": "top",
    "height": 4,
    "color": "primary",
    "backgroundColor": "rgba(0,0,0,0.1)"
  }
}
```

**Implementation:** Rendered by `GenericVideoPlayer` as an overlay `AbsoluteFill` with a `div` whose width is `interpolate(frame, [0, totalFrames], ['0%', '100%'])`.

---

#### KM6: Particle Burst on Emphasis Beats

**What it does:** When a `beats.emphasis` timestamp fires on a `high` emphasis element, trigger a subtle particle burst (confetti, sparkles, or stars) around that element.

**Why it's amazing:** Emphasis is currently visual-only (bold, color, pulse). Adding particle bursts at emphasis moments creates "wow" micro-interactions that make the video feel alive. The particle system already exists in `particleSystem.jsx`.

**Implementation:** In `TextRevealSequence.jsx` and `ChecklistReveal.jsx`, detect when `frame === emphasisFrame` and render `generateBurstParticles()` at the element's position.

---

#### KM7: TikTok-Style Animated Captions

**What it does:** Word-level animated captions that pop, scale, and color-shift as each word is spoken. Uses `@remotion/captions` `createTikTokStyleCaptions()`.

**Why it's amazing:** This is the #1 feature that makes TikTok/Reels/Shorts videos feel professional and engaging. It's the most direct "this looks expensive" signal a video can have.

**Remotion tech:** `@remotion/captions` provides `createTikTokStyleCaptions()` which takes word-level timestamps and creates animated caption segments. Combine with `spring()` for word pop-in.

**File to create:** `KnoMotion-Videos/src/sdk/overlays/AnimatedCaptions.jsx`

---

### Summary: What "Amazing" Looks Like

| Category | Count | Examples |
|----------|-------|---------|
| **New Mid-Scenes** | 7 | progressTimeline, quoteReveal, beforeAfterSlider, codeBlock, flowDiagram, timerCountdown, revealStack |
| **New Layout Primitives** | 3 | focus, splitDiagonal, pip (picture-in-picture) |
| **KnoMotion Overlays** | 4 | lowerThird, watermark, progressBar, animatedCaptions |
| **KnoMotion Templates** | 2 | brandedIntro, brandedOutro |
| **Cinematic Effects** | 2 | motionBlur on transitions, particleBurst on emphasis |

**Total new components: 18**

Combined with the existing 10 mid-scenes, 5 layouts, 23 elements, and the rendering/audio/personalisation pipeline from the main build plan, this gives KnoMotion:

- **17 mid-scenes** (10 existing + 7 new)
- **8 layout types** (5 existing + 3 new)
- **4 overlay types** (all new)
- **2 template types** (all new)
- **Audio + captions** (all new)
- **Cinematic effects** (motion blur, particle bursts)

This is a comprehensive, professional-grade JSON-driven video engine with no meaningful competitor at this level of LLM-friendliness.

---

## 12. remotion-bits Integration Plan

### Overview

`remotion-bits` (npm: `remotion-bits`, v0.2.0) is an open-source component kit providing 42 reusable "bits" — text effects, particle systems, 3D scenes, motion primitives, code blocks, and more. It requires React 18+ and Remotion 4.0+, which we already satisfy.

**Installation:** `npm install remotion-bits`

### Key Primitive: `StaggeredMotion`

The single most impactful thing from remotion-bits is the `StaggeredMotion` component. It is a declarative animation wrapper providing: `x`, `y`, `z` translation; `scale`, `rotate`, `skew`; `opacity`, `blur`; `color`, `backgroundColor` keyframes; `stagger` (frames between children); `staggerDirection` (`"forward"`, `"reverse"`, `"center"`, `"random"`); configurable `easing` and `duration`.

This replaces significant hand-rolled animation code across all mid-scenes.

### Existing Mid-Scenes — Upgrade Map

| # | Your Mid-Scene | remotion-bits Upgrade | Upgrade Type | Action |
|---|---|---|---|---|
| 1 | `textReveal` | **Blur In**, **Word by Word**, **Variable Speed Typewriter**, **Glitch In**, **Glitch Cycle**, **Staggered Char Animation** | Add new `revealType` options (`'blurSlide'`, `'charByChar'`, `'glitchIn'`, `'variableTypewriter'`, `'glitchCycle'`) using remotion-bits components as rendering primitives inside `TextRevealSequence`. JSON interface stays identical. | Enhance |
| 2 | `heroText` | **Ken Burns Effect** | Add `heroAnimation: 'kenBurns'` option that wraps the hero image in a `Scene3D` Ken Burns camera move. | Enhance |
| 3 | `gridCards` | **Grid Stagger**, **Mosaic Reframe** | Replace animation layer with `StaggeredMotion`. Add `animation: 'centerRipple'` (center-outward stagger) and `animation: 'mosaicReframe'` (layout morphing). | Enhance |
| 4 | `checklist` | **List Reveal** | Use `StaggeredMotion` for item entrance (nested: outer controls Y, inner controls scale). Icon/checkbox animation stays custom. | Enhance |
| 5 | `bubbleCallout` | None | No remotion-bits equivalent. Keep as-is. | Keep |
| 6 | `sideBySide` | None | No remotion-bits equivalent. Keep as-is. | Keep |
| 7 | `iconGrid` | **Grid Stagger** | Same as `gridCards` — use center-ripple entrance via `StaggeredMotion`. | Enhance |
| 8 | `cardSequence` | **3D Card Stack**, **3D Carousel** | Add `layout: '3dStack'` (cards spread in 3D with fan effect) and `layout: 'carousel'` (rotating 3D carousel). | Enhance |
| 9 | `bigNumber` | **Counter Confetti** | Add `celebration: true` option that triggers remotion-bits Particle confetti burst when count completes. | Enhance |
| 10 | `animatedCounter` | **Basic Counter** | Replace internal interpolation with remotion-bits `AnimatedCounter`. JSON interface unchanged. | Replace internals |

### New Mid-Scenes Unlocked by remotion-bits

#### Tier 1: High-Impact for Education

| New Mid-Scene | remotion-bits Source | Description | Priority |
|---|---|---|---|
| **`codeBlock`** | `CodeBlock` + `TypingCodeBlock` | Syntax highlighting with Prism, line-by-line reveal, line highlighting, focus mode, typing effect. **Replaces the planned custom build in MS4 — use remotion-bits, don't build from scratch.** | HIGH |
| **`cliSimulation`** | `CLI Simulation` | Simulates a terminal with user typing commands and system output. Teaching CLI tools, git, npm, deployment. | HIGH |
| **`cursorDemo`** | `Cursor Flyover` | Camera flies over an app screenshot while a cursor highlights areas. Product walkthroughs, feature tours, UI tutorials. | HIGH |
| **`terminal3D`** | `3D Terminal` | Multiple terminal windows in a 3D scene executing commands. Tech education visual showcase. | MEDIUM |
| **`flyingText`** | `Flying Through Words` | Words spawning and flying past the camera in 3D. Dramatic hook scenes, key concept reveals. | MEDIUM |

#### Tier 2: Visual Wow-Factor

| New Mid-Scene | remotion-bits Source | Description | Priority |
|---|---|---|---|
| **`carousel3D`** | `3D Carousel` | Rotating card carousel in 3D space. Concept showcases, team members, option displays. | MEDIUM |
| **`mosaicGrid`** | `Mosaic Reframe` | Tiles morph between three layouts (grid → featured → diagonal). Photo galleries, concept collections. | MEDIUM |
| **`fractureReveal`** | `Fracture Reassemble` | Content shatters into tiles flying into 3D space, then reassembles. Dramatic scene transitions or reveals. | LOW |
| **`presentation3D`** | `Basic 3D Scene` | impress.js-style 3D camera flying between positioned content. Spatial explainers. | LOW |
| **`scrollingGallery`** | `Scrolling Columns` | Parallax columns scrolling at different speeds in 3D. Credits, showcases, summaries. | LOW |

#### Background & Ambient Effects

| Effect | remotion-bits Source | Usage | Priority |
|---|---|---|---|
| **`fireflies`** | `Fireflies` | Ambient wandering glow particles. Replaces/upgrades `particles: { style: 'sparkle' }`. Far more organic. | HIGH |
| **`animatedGradients`** | `Linear Gradient` + `Radial Gradient` + `Conic Gradient` | Smooth animated gradient transitions. Replaces static background presets with living gradients. | HIGH |
| **`snowfall`** | `Snow` | Falling snow particles. Seasonal or atmospheric. | LOW |
| **`matrixRain`** | `Matrix Rain` | Digital rain background. Tech/cyberpunk aesthetic. | LOW |
| **`particleFountain`** | `Fountain` | Bursting fountain particles. Celebration moments. | LOW |
| **`gridParticles`** | `Grid Particles` | Particles snapping to a grid. Structured tech aesthetic. | LOW |

### Contradictions Resolved

The following items from earlier sections are updated by the remotion-bits integration:

**1. MS4 `codeBlock` (Section 11) — NO LONGER CUSTOM BUILD**
Previously: "Use a lightweight syntax tokenizer (no heavy deps — just regex-based token coloring)."
Now: Use remotion-bits `CodeBlock` which includes Prism syntax highlighting, line reveal, focus mode, and typing effect. Production-ready, no custom build needed.

**2. MS7 `revealStack` (Section 11) — USE remotion-bits 3D CARD STACK**
Previously: "3D CSS `rotateY` transform for flip."
Now: Use remotion-bits `3D Card Stack` with `StaggeredMotion` for the card spread/fan effect. Adapt for front/back flip by composing with CSS `rotateY`.

**3. S4 Capability Manifest (Section 5) — 3D IS NOW SUPPORTED**
Previously listed `"3D scenes"` under `"unsupported"`.
Now: With remotion-bits `Scene3D`, 3D scenes are supported. Remove from unsupported list. Add `"3dScene"`, `"carousel3D"`, `"presentation3D"` to supported mid-scenes.

**4. Section 11 Mid-Scene Counts — UPDATED**
Previously: "17 mid-scenes (10 existing + 7 new)."
Now: Up to **27 mid-scenes** (10 existing + 7 originally planned + 10 remotion-bits unlocked). Not all need to be built immediately — the Tier 1 + Tier 2 items bring it to ~22 at first pass.

**5. N1 `@remotion/noise` for Backgrounds (Section 8) — COMPLEMENT, NOT REPLACE**
`@remotion/noise` (`noise2D`, `noise3D`) serves a different purpose to remotion-bits gradient components. Noise is for film grain/organic texture. remotion-bits gradients are for smooth animated color transitions. Both are valid — use noise for grain overlays, remotion-bits for background gradients.

**6. KM6 Particle Burst on Emphasis (Section 11) — CAN USE EITHER SYSTEM**
KnoMotion's existing `particleSystem.jsx` or remotion-bits `Fountain`/`Particles` engine. The agent should check with the user on which to use, per the overlap guidance in Section 14.

### Legacy Code Implications

| remotion-bits Adoption | Legacy Code to Phase Out |
|---|---|
| `StaggeredMotion` for mid-scene entrances | Custom stagger calculation in each mid-scene's `getAnimationStyle()` function. After adoption, the per-mid-scene stagger math (~20-40 lines each in 8 files) becomes redundant. |
| remotion-bits `CodeBlock` | Planned custom `CodeBlock.jsx` — never needs to be built. |
| remotion-bits animated gradients for backgrounds | Static gradient CSS in `resolveBackground.tsx` presets (`sunriseGradient`, `chalkboardGradient`) can optionally be upgraded to animated versions. Keep both — static for simplicity, animated as an opt-in via `animated: true` in background config. |
| remotion-bits `Fireflies` | KnoMotion `particleSystem.jsx` `sparkle` style. Both can coexist — `sparkle` for structured particles, `fireflies` for organic ambient. |

### Dependency Addition

Add to Section 10 dependency table:

| Package | Version | Task | Purpose |
|---|---|---|---|
| `remotion-bits` | `0.2.0` | Section 12 | `StaggeredMotion`, `CodeBlock`, `Scene3D`, `Particles`, gradient components, text effects, 3D layouts |

---

## 13. Architecture Decision: More Mid-Scenes vs Complex Schemas

### The Question

Should KnoMotion have many focused mid-scenes with simple schemas, or fewer mid-scenes with complex branching schemas (modes, variants, conditional fields)?

### Decision: FAVOR MORE MID-SCENES

**Rationale:**

1. **LLMs work better with distinct types.** `"midScene": "codeBlock"` is unambiguous. `"midScene": "textReveal", "config": { "mode": "code", "subMode": "typing", ... }` requires the LLM to discover hidden capabilities deep in a branching schema.

2. **Schema validation is simpler.** Each mid-scene has its own flat schema. No conditional validation ("if `mode` is X then field Y is required but field Z is forbidden"). The existing `sideBySide` already shows the problem — the `beforeAfter` mode is undocumented in the schema, and the agent doesn't know it exists.

3. **Implementation stays modular.** Each mid-scene is a self-contained file + schema + registry entry. Extending the engine = adding a new file, not adding branches to an existing component. This is critical for agent-driven CI where the agent proposes new mid-scenes.

4. **Discovery is explicit.** The capability manifest (S4) lists every mid-scene by name. An LLM can scan the list and pick the right one. Buried modes inside a component are invisible to the manifest.

5. **Performance and bundle size.** A mid-scene that conditionally imports 3D libraries, code syntax highlighters, AND particle systems is a monolithic bundle. Separate mid-scenes only import what they need.

### When Branching IS Appropriate

Branching within a mid-scene is acceptable for **visual variants that share the same content structure**:

- `textReveal` with different `revealType` values (`'typewriter'`, `'fade'`, `'blurSlide'`, `'glitchIn'`) — same `lines` array, different visual treatment.
- `gridCards` with different `animation` values (`'cascade'`, `'centerRipple'`, `'fade'`) — same `cards` array, different entrance.
- `cardSequence` with different `layout` values (`'stacked'`, `'grid'`, `'3dStack'`, `'carousel'`) — same `cards` array, different spatial arrangement.

Branching is NOT appropriate when the **content structure fundamentally changes**:
- `sideBySide` with `mode: 'beforeAfter'` changes the props from `left`/`right` to `before`/`after`/`slider`. This should be a separate mid-scene (which is why `beforeAfterSlider` was proposed in Section 11).

### Implementation Rule for Agents

When an agent proposes a new feature:
1. **If it shares the content schema with an existing mid-scene** (same props, different visual) → add a new variant/option to the existing mid-scene.
2. **If it requires different props or a fundamentally different content structure** → create a new mid-scene.
3. **When in doubt** → create a new mid-scene. It's easier to merge two simple mid-scenes later than to untangle a complex branching one.

---

## 14. Overlap Guidance: Remotion MCP vs remotion-bits vs KnoMotion SDK

### The Problem

With three sources of animation/component primitives — Remotion core (via MCP), remotion-bits, and KnoMotion's existing SDK — there are overlapping capabilities. An implementing agent needs clear guidance on which to use when, and when to escalate to the user.

### Resolution Matrix

| Capability | Remotion Core (MCP) | remotion-bits | KnoMotion SDK | **USE** |
|---|---|---|---|---|
| **Scene transitions** | `@remotion/transitions` (`TransitionSeries`, `fade()`, `slide()`, etc.) | — | `SceneTransitionWrapper` (legacy) | **Remotion Core.** Delete KnoMotion legacy (P1c). |
| **Element entrance animation** | `spring()`, `interpolate()`, `Easing` | `StaggeredMotion` (declarative wrapper over `interpolate`) | `fadeIn()`, `slideIn()`, `scaleIn()`, `bounceIn()` in `animations/index.js` | **CHECK WITH USER.** `StaggeredMotion` is higher-level and more composable, but Remotion's `spring()` is more precise for individual elements. Recommended default: `StaggeredMotion` for groups/lists, `spring()` for individual hero elements. |
| **Spring physics** | `spring()` with config objects | `StaggeredMotion` easing (wraps `interpolate`, not `spring`) | `SPRING_CONFIGS` (duplicate) | **Remotion Core `spring()`** for physics-based motion. remotion-bits for interpolation-based stagger. Delete KnoMotion duplicates (P2c). |
| **Easing curves** | `Easing` module (bezier, elastic, bounce, etc.) | Named easing strings (`"easeOutCubic"`, etc.) | `sdk/easing.ts` (custom) | **Remotion Core `Easing`** as canonical. remotion-bits easing names are fine within `StaggeredMotion` context. Delete KnoMotion custom easing (P2b). |
| **Particles** | — | `Particles` engine (Spawner, Behavior, physics-based) | `particleSystem.jsx` (ambient, burst) | **CHECK WITH USER.** remotion-bits has a more sophisticated physics engine. KnoMotion's is simpler and already integrated. Recommend: remotion-bits for new particle effects (fireflies, fountain), keep KnoMotion's for existing beat-triggered bursts. |
| **Code blocks** | — | `CodeBlock` (Prism, line reveal, focus, typing) | None (was planned as custom MS4) | **remotion-bits.** Don't build custom. |
| **3D scenes** | `@remotion/three` (React Three Fiber) | `Scene3D` (CSS 3D transforms, no WebGL) | None | **CHECK WITH USER.** `@remotion/three` is full WebGL (heavier, GPU-dependent). remotion-bits `Scene3D` is CSS 3D (lighter, no GPU issues on Lambda). For educational video, CSS 3D is almost always sufficient. Recommend: remotion-bits `Scene3D` as default, `@remotion/three` only if user specifically needs WebGL. |
| **Text reveals** | `interpolate()` for character/word counting | `BlurIn`, `WordByWord`, `GlitchIn`, `BasicTypewriter`, `VariableSpeedTypewriter` | `TextRevealSequence` with reveal types | **remotion-bits as rendering primitives inside KnoMotion's `TextRevealSequence`.** The JSON interface stays KnoMotion's; the visual rendering uses remotion-bits components as the inner layer. |
| **Noise/grain** | `@remotion/noise` (`noise2D`, `noise3D`) | — | `NoiseTexture` (SVG overlay) | **Remotion Core `@remotion/noise`** for animated procedural noise. Delete KnoMotion SVG overlay (N1). |
| **Shapes** | `@remotion/shapes` (`Star`, `Circle`, `Pie`, etc.) | — | None | **Remotion Core.** |
| **SVG paths** | `@remotion/paths` (`evolvePath`, `interpolatePath`) | — | `handwritingEffects.jsx` (manual dasharray) | **Remotion Core.** Replace KnoMotion manual code (P5a). |
| **Gradients** | — | `LinearGradient`, `RadialGradient`, `ConicGradient` (animated) | `resolveBackground` (static CSS) | **Both.** KnoMotion static presets for simple cases, remotion-bits animated gradients as an opt-in upgrade (`animated: true`). |
| **Captions** | `@remotion/captions` (`createTikTokStyleCaptions`) | — | None | **Remotion Core.** |

### Agent Escalation Rule

**When the agent encounters an overlapping capability between Remotion MCP, remotion-bits, and KnoMotion SDK, it MUST:**

1. Check this resolution matrix first.
2. If the matrix says "CHECK WITH USER" — pause and ask: "I have two options for [X]: [Option A] from Remotion core and [Option B] from remotion-bits. [Brief tradeoff]. Which approach do you prefer?"
3. If the matrix gives a clear answer — use it without asking.
4. Always consult the Remotion MCP documentation for the canonical API of any `@remotion/*` package before implementing.
5. For remotion-bits components, refer to https://remotion-bits.dev/docs/bits-catalog/ for API details.

---

## 15. `@remotion/layout-utils` — Text Measurement & Fitting

**Priority:** LOW
**Type:** Complement to existing layout system (not a replacement)

### What It Is

`@remotion/layout-utils` provides text measurement and fitting utilities. It does NOT replace `resolveSceneSlots` (scene-level viewport division) or `calculateItemPositions` (item-level positioning). It solves a different problem: ensuring text content fits within its allocated space.

### Functions

| Function | Purpose | KnoMotion Use Case |
|---|---|---|
| `measureText()` | Returns pixel `width`/`height` of a text string given font properties | Dynamic node sizing in `flowDiagram`; precise text positioning |
| `fitText()` | Calculates `fontSize` to fit text within a given pixel width | Auto-sizing text in `textReveal`, `bigNumber`, `quoteReveal` when LLM generates unpredictably long text |
| `fitTextOnNLines()` | Calculates `fontSize` to fit text on exactly N lines; returns line-split array | `quoteReveal` displaying long quotes across 2-3 lines at max font size |
| `fillTextBox()` | Progressively adds words, reports new lines and overflow | **Validation:** detect text overflow at JSON-validation time before rendering |

Companion package `@remotion/rounded-text-box` creates TikTok/Instagram-style rounded text box SVG paths — useful for animated captions (KM7) and lower third overlays (KM1).

### Why It Matters for the Blue-Sky Pipeline

Agent-generated text has unpredictable length. Without text fitting:
- A line might overflow its slot silently
- Font sizes are guessed, not calculated
- Validation can't catch overflow before rendering

With `@remotion/layout-utils`:
- `fitText()` in mid-scenes auto-shrinks font to fit the slot
- `fillTextBox()` in the validation CLI (S6) catches overflow before render
- `fitTextOnNLines()` gives the planned `quoteReveal` precise multi-line layout

### Integration Points

| Where | How | Impact |
|---|---|---|
| `TextRevealSequence.jsx` | Use `fitText()` to auto-size lines that exceed slot width | Eliminates text overflow |
| `ChecklistReveal.jsx` | Replace the `autoFitText` flag with real `fitText()` measurement | Proper auto-fit instead of placeholder logic |
| `BigNumberReveal.jsx` | Use `fitText()` to size the number to fill the slot | Consistent dramatic sizing |
| Scene validation (S6) | Use `fillTextBox()` to detect overflow at validation time | Agent catches problems before rendering |
| `QuoteReveal.jsx` (planned) | Use `fitTextOnNLines()` for multi-line quote layout | Precise line-splitting with max font |
| `FlowDiagram.jsx` (planned) | Use `measureText()` for dynamic node width | Nodes adapt to label length |
| Animated captions (KM7) | Use `@remotion/rounded-text-box` for word-level caption boxes | TikTok-style rounded backgrounds behind caption words |

### Dependency

| Package | Version | Purpose |
|---|---|---|
| `@remotion/layout-utils` | Match remotion version (4.0.382) | `measureText()`, `fitText()`, `fillTextBox()`, `fitTextOnNLines()` |
| `@remotion/rounded-text-box` | Match remotion version | `createRoundedTextBox()` for caption styling |

### Overlap Note

This does NOT conflict with or replace any existing KnoMotion layout code. It is purely additive — text measurement utilities that the codebase currently lacks. No legacy deletion required.

---

## 16. Blue-Sky Pipeline Gaps — Final Sweep

These are the overlooked pieces that complete the end-to-end pipeline from PDF upload to polished video output. Without these, the pipeline has seams where an agent (or human) has to improvise.

### BSG1: Video Plan Schema — "How Many Videos?"

**The gap:** When an agent receives a 40-page training guide PDF, it needs to decide: how many videos? What length each? What topics? What order? Currently there's no schema for this intermediate planning step.

**What's needed:** A `VideoPlan` schema that the agent produces before generating scene JSON.

**Schema shape:**
```json
{
  "courseName": "Introduction to Neural Networks",
  "totalVideos": 5,
  "format": "desktop",
  "targetAudience": "beginners",
  "videos": [
    {
      "videoId": "nn-01-intro",
      "title": "What Are Neural Networks?",
      "objectives": ["Define neural networks", "Explain why they matter"],
      "estimatedDurationSeconds": 60,
      "sourcePages": [1, 2, 3],
      "keyVisuals": ["brain diagram", "network graph"],
      "suggestedMidScenes": ["textReveal", "heroText", "flowDiagram"],
      "precedingVideo": null,
      "followingVideo": "nn-02-perceptron"
    }
  ],
  "seriesBranding": {
    "intro": "brandedIntro",
    "outro": "brandedOutro",
    "watermark": { "text": "KnoMotion Academy" },
    "progressBar": true,
    "colorTheme": "educational"
  }
}
```

**Why it matters:** Without this, the agent jumps straight from "here's a PDF" to "here's scene JSON" — skipping the most important creative decision: content structure. The video plan also enables series-level consistency (same intro/outro, watermark, progress tracking across videos).

**File to create:** `KnoMotion-Videos/src/sdk/schemas/videoPlan.schema.ts`

---

### BSG2: Narration Script Schema — Bridging Scenes and TTS

**The gap:** The build plan mentions TTS-to-beats alignment (P4d) but there's no schema for the intermediate script that bridges scene structure and TTS audio. The agent needs to produce a structured script that maps narration text to specific scenes and timing windows.

**What's needed:** A `NarrationScript` type.

**Schema shape:**
```json
{
  "videoId": "nn-01-intro",
  "voice": { "provider": "elevenlabs", "voiceId": "rachel", "speed": 1.0 },
  "segments": [
    {
      "sceneId": "hook",
      "narration": "Have you ever wondered how your phone recognises your face?",
      "durationSeconds": 4.5,
      "tone": "curious",
      "emphasisWords": ["wondered", "recognises"]
    },
    {
      "sceneId": "explain-concept",
      "narration": "A neural network is a system inspired by the human brain.",
      "durationSeconds": 5.0,
      "tone": "explanatory",
      "emphasisWords": ["neural network", "human brain"]
    }
  ]
}
```

**Why it matters:** This script becomes the input to TTS APIs. The `emphasisWords` drive both TTS SSML emphasis tags AND visual `beats.emphasis` in the scene JSON. The `durationSeconds` per segment validates that scene `durationInFrames` is sufficient for the narration. Without this, the agent has no structured handoff between "write words" and "generate audio."

**File to create:** `KnoMotion-Videos/src/sdk/schemas/narrationScript.schema.ts`

---

### BSG3: TTS Provider Abstraction Layer

**The gap:** The pipeline assumes TTS happens but there's no abstraction for different TTS providers. Each provider returns timestamps in different formats.

**What's needed:** A unified `TTSProvider` interface that normalises output to `@remotion/captions` `Caption[]` format.

**Interface shape:**
```typescript
interface TTSProvider {
  synthesize(text: string, options: TTSOptions): Promise<TTSResult>;
}

interface TTSResult {
  audioUrl: string;
  captions: Caption[];  // @remotion/captions format (startMs, endMs, text)
  durationMs: number;
}

interface TTSOptions {
  voiceId: string;
  speed?: number;
  emphasisWords?: string[];
}
```

**Supported providers to implement:**
- **ElevenLabs** — returns word-level timestamps via alignment API
- **Google Cloud TTS** — returns `timepoints` in response
- **OpenAI TTS** — use `@remotion/openai-whisper` `openAiWhisperApiToCaptions()` to transcribe the output audio back to word-level timestamps
- **Azure TTS** — returns viseme/word events

**File to create:** `KnoMotion-Videos/src/sdk/audio/ttsProvider.ts`

---

### BSG4: Asset Sourcing Strategy — "The Image Doesn't Exist Yet"

**The gap:** When the agent decides a scene needs a hero image of "a neural network diagram" or a specific icon that isn't in the lottie registry, what happens? Currently the agent either uses a lottie key or guesses a URL. There's no structured approach.

**What's needed:** An asset resolution strategy with fallback chain.

**Resolution order:**
1. **Lottie registry** — `resolveLottieRef('brain')` → URL
2. **Animated emoji** — `@remotion/animated-emoji` for emoji icons
3. **Static assets** — Pre-bundled images in `public/` (maps, diagrams, photos)
4. **AI generation** — Call an image generation API (DALL-E, Midjourney API) and cache the result
5. **Placeholder** — If all else fails, render a themed placeholder with icon + label

**What the agent should output in JSON:**
```json
{
  "heroType": "image",
  "heroRef": {
    "strategy": "generate",
    "prompt": "minimalist diagram of a neural network, blue nodes on white background",
    "fallback": "lottie:brain"
  }
}
```

**Why it matters:** The blue-sky pipeline will inevitably need visuals that don't exist yet. A structured asset resolution chain with a generation fallback means the pipeline doesn't stall when the agent needs a novel image. The `fallback` field ensures a valid video is always producible even if generation fails.

**File to create:** `KnoMotion-Videos/src/sdk/assets/assetResolver.ts`

---

### BSG5: Scene Duration Auto-Calculation from Narration

**The gap:** Currently `durationInFrames` is set manually. In the blue-sky pipeline, the narration script determines how long each scene should be — not the other way around. If the narration for a scene is 6.2 seconds, `durationInFrames` should be `Math.ceil(6.2 * 30) + bufferFrames`.

**What's needed:** A `calculateSceneDuration()` function that takes the narration segment and returns the correct `durationInFrames`.

**Implementation:**
```typescript
function calculateSceneDuration(
  narrationDurationSeconds: number,
  options?: { bufferSeconds?: number; minDurationSeconds?: number }
): number {
  const buffer = options?.bufferSeconds ?? 1.0;
  const min = options?.minDurationSeconds ?? 3.0;
  const totalSeconds = Math.max(min, narrationDurationSeconds + buffer);
  return Math.ceil(totalSeconds * 30);
}
```

**Why it matters:** This closes the loop. The agent writes a script → TTS returns exact timing → scene durations auto-calculate → beats align → everything fits perfectly. Without this, the agent guesses durations and risks narration being cut off or scenes having awkward silences.

**File to create:** `KnoMotion-Videos/src/sdk/utils/calculateSceneDuration.ts`

---

### BSG6: Multi-Language / i18n Support

**The gap:** The LLM guide mentions locale as a personalisation vector but there's no structured approach. For a learning platform, generating the same video in French, Spanish, or Japanese is a high-value capability.

**What's needed:** A locale-aware scene config pattern where text content is separated from structure.

**Pattern:**
```json
{
  "id": "explain-concept",
  "durationInFrames": 180,
  "config": {
    "layout": { "type": "rowStack", "options": { "rows": 2 } },
    "slots": {
      "row1": {
        "midScene": "textReveal",
        "config": {
          "lines": [
            { "textKey": "nn.intro.line1", "emphasis": "high" }
          ]
        }
      }
    }
  }
}
```

Combined with a locale file:
```json
{
  "en": { "nn.intro.line1": "Your brain has 86 billion neurons." },
  "fr": { "nn.intro.line1": "Votre cerveau possède 86 milliards de neurones." },
  "es": { "nn.intro.line1": "Tu cerebro tiene 86 mil millones de neuronas." }
}
```

**Resolution:** `SceneFromConfig` resolves `textKey` via a locale context provider. Same scene JSON, different language, different TTS voice.

**Why it matters:** Knode is a learning platform. International reach multiplies content value. If one video can serve 10 languages, that's 10x the value from the same agent effort.

---

### BSG7: Visual Regression Testing via `renderStill()`

**The gap:** As the engine grows (17 mid-scenes, 8 layouts, overlays, effects), there's no way to catch visual regressions. A change to `spring()` config could break the look of every canon video.

**What's needed:** A test harness that renders key frames of canon videos using `renderStill()` and compares against baseline screenshots.

**Implementation:**
```typescript
import { renderStill } from '@remotion/renderer';

const testCases = [
  { compositionId: 'TikTokBrainLies', frames: [0, 30, 60, 90] },
  { compositionId: 'KnodoviaAccidentalArrival', frames: [0, 45, 150, 300] },
];

for (const test of testCases) {
  for (const frame of test.frames) {
    await renderStill({
      serveUrl: bundleLocation,
      composition: test.compositionId,
      output: `test-output/${test.compositionId}-frame-${frame}.png`,
      frame,
    });
    // Compare against baseline in test-baselines/ using pixel diff
  }
}
```

**Why it matters:** The agent-driven development model means changes happen fast. Without visual regression tests, a mid-scene refactor could silently break existing videos. Remotion's `renderStill()` makes this trivially implementable.

**File to create:** `scripts/visual-regression-test.ts`

---

### BSG8: Structured Review / Feedback Format

**The gap:** After the agent generates a video and it renders, how does the human provide structured feedback that the agent can act on? Currently it's freeform text. A structured feedback format would let the agent precisely identify and fix issues.

**What's needed:** A `VideoReview` schema.

**Schema shape:**
```json
{
  "videoId": "nn-01-intro",
  "overallRating": 4,
  "sceneNotes": [
    {
      "sceneId": "hook",
      "issue": "timing",
      "note": "Text appears too fast, needs 1 more second",
      "suggestedFix": "Increase durationInFrames from 150 to 180"
    },
    {
      "sceneId": "explain-concept",
      "issue": "content",
      "note": "Missing mention of deep learning",
      "suggestedFix": "Add a line about deep learning being a subset"
    },
    {
      "sceneId": "summary",
      "issue": "visual",
      "note": "The grid cards feel cramped on mobile",
      "suggestedFix": "Reduce columns from 3 to 2"
    }
  ],
  "globalNotes": [
    { "issue": "pacing", "note": "Overall feels rushed, add 0.5s buffer between scenes" },
    { "issue": "audio", "note": "Background music too loud relative to narration" }
  ]
}
```

**Why it matters:** Closes the human-in-the-loop feedback cycle. The agent receives structured data, maps issues to specific scenes, and applies fixes programmatically. Without this, the review loop is "make it better" → agent guesses what to change.

**File to create:** `KnoMotion-Videos/src/sdk/schemas/videoReview.schema.ts`

---

### BSG9: Series Continuity Engine

**The gap:** A training guide produces multiple videos (BSG1). But those videos need continuity: "In the last video, we covered X. Today we'll explore Y." The agent needs context about what came before and what comes next.

**What's needed:** A `SeriesContext` that's passed to the agent when generating each video.

**Schema shape:**
```json
{
  "seriesId": "neural-networks-101",
  "currentVideoIndex": 2,
  "totalVideos": 5,
  "previousVideo": {
    "title": "What Are Neural Networks?",
    "keyConcepts": ["neurons", "connections", "activation"],
    "endingCTA": "Next: The Perceptron"
  },
  "nextVideo": {
    "title": "Training Your First Network",
    "preview": "backpropagation, loss functions, gradient descent"
  },
  "recurringElements": {
    "characterName": "Professor Knode",
    "catchphrase": "Let's think about this...",
    "colorTheme": "educational"
  }
}
```

**Why it matters:** Without series context, each video is an island. With it, the agent generates "Previously on..." recaps, "Coming up next..." teasers, and maintains character/theme consistency across a 5-10 video course. This is what makes a series feel professionally produced.

---

### BSG10: Render Artifact Management

**The gap:** When the pipeline renders a video, where does the MP4 go? How is it versioned? How does the system track "this is v3 of the intro video, v2 had the timing bug"?

**What's needed:** An artifact registry that tracks rendered outputs with metadata.

**Schema shape:**
```json
{
  "artifactId": "nn-01-intro-v3",
  "videoId": "nn-01-intro",
  "version": 3,
  "renderedAt": "2026-04-01T14:30:00Z",
  "renderMethod": "lambda",
  "format": "desktop",
  "duration": 62.5,
  "fileUrl": "s3://knomotion-renders/nn-01-intro-v3.mp4",
  "thumbnailUrl": "s3://knomotion-renders/nn-01-intro-v3-thumb.png",
  "inputHash": "sha256:abc123...",
  "sceneJsonSnapshot": "s3://knomotion-configs/nn-01-intro-v3.json",
  "changelog": "Fixed timing on hook scene, added narration audio"
}
```

**Why it matters:** The agent needs to know what's been rendered before, whether a re-render is needed (did the JSON change?), and how to reference previous versions for comparison. Without this, every render is fire-and-forget.

---

### Updated Blue-Sky Alignment Score

With ALL items in this document implemented:

| Component | Status | Score Contribution |
|-----------|--------|-------------------|
| JSON-first architecture | Existing | +1.5 |
| Mid-scene library (22+ types with remotion-bits) | Existing + New + remotion-bits | +1.5 |
| Beats system (seconds-based) | Existing | +1.0 |
| Style/emphasis presets | Existing | +0.5 |
| Audio layer + TTS alignment | New (P4, BSG2, BSG3) | +1.0 |
| Generic composition + calculateMetadata | New (S2) | +1.0 |
| Complete schemas + capability manifest | New (S3, S4) | +0.5 |
| @remotion/transitions | New (P1) | +0.5 |
| Video plan schema | New (BSG1) | +0.5 |
| Narration script schema | New (BSG2) | +0.25 |
| TTS provider abstraction | New (BSG3) | +0.25 |
| Auto scene duration from narration | New (BSG5) | +0.25 |
| Series continuity engine | New (BSG9) | +0.25 |
| Captions / animated subtitles | New (P4c, KM7) | +0.5 |
| Structured review format | New (BSG8) | +0.25 |
| Visual regression testing | New (BSG7) | +0.25 |

**Revised score with all items: 10/10**

---

*End of Build Status Document*
