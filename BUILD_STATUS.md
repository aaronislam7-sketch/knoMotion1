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

*End of Build Status Document*
