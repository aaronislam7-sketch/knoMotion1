# KnoMotion Architecture Guide

> Understanding how the JSON-first video engine works

---

## Overview

KnoMotion is a **JSON-driven video generation engine** built on [Remotion](https://remotion.dev). It transforms structured scene configurations into rendered videos without requiring developers (or LLMs) to write React code.

```
Scene JSON → SceneFromConfig → Mid-Scenes → SDK Elements → Rendered Video
```

---

## Architecture Layers

### Layer 1: Scene Configuration (JSON)

The top-level input is a **scene configuration object** that defines:
- Layout type and options
- Background preset
- Transition type
- Slots containing mid-scenes

```javascript
{
  background: { preset: 'sunriseGradient', layerNoise: true },
  layout: { type: 'rowStack', options: { rows: 2, padding: 50 } },
  transition: { type: 'doodle-wipe', direction: 'right' },
  slots: {
    header: { midScene: 'textReveal', stylePreset: 'playful', config: {...} },
    row1: { midScene: 'gridCards', stylePreset: 'educational', config: {...} },
  }
}
```

### Layer 2: Scene Renderer

`SceneFromConfig` (in `compositions/SceneRenderer.jsx`) is the central orchestrator:

1. **Resolves layout** → Calls `resolveSceneSlots()` to carve viewport into named slots
2. **Resolves background** → Calls `resolveBackground()` to generate styles + overlays
3. **Renders mid-scenes** → Maps each slot to its configured mid-scene component

```
SceneFromConfig
├── resolveSceneSlots(layout, viewport) → { header, row1, row2, ... }
├── resolveBackground(background) → { style, overlay }
└── For each slot:
    └── MidSceneRenderer(slot, midSceneConfig)
```

### Layer 3: Mid-Scenes

Mid-scenes are **composed components** that render specific content patterns:

| Mid-Scene | Purpose | Key Config |
|-----------|---------|------------|
| `textReveal` | Animated text lines | `lines`, `revealType`, `staggerDelay` |
| `heroText` | Hero visual + text | `text`, `heroType`, `heroRef` |
| `gridCards` | Icon/image card grid | `cards`, `columns`, `animation` |
| `checklist` | Bullet point list | `items`, `icon`, `revealType` |
| `bubbleCallout` | Floating callouts | `callouts`, `shape`, `pattern` |
| `sideBySide` | Left vs right compare | `left`, `right`, `dividerType` |
| `iconGrid` | Icon-only grid | `icons`, `columns`, `iconSize` |
| `cardSequence` | Card stack/grid | `cards`, `layout`, `animation` |
| `bigNumber` | Large stat display | `number`, `label`, `animation` |
| `animatedCounter` | Number animation | `startValue`, `endValue`, `duration` |

All 10 mid-scenes are registered in `MID_SCENE_COMPONENTS` (SceneRenderer.jsx) and exported from the barrel (`sdk/mid-scenes/index.js`).

Each mid-scene:
- Receives a **slot position** (left, top, width, height)
- Receives a **config object** with content and options
- Uses SDK elements and animations internally
- Has a corresponding JSON schema in `sdk/mid-scenes/schemas/`

### Layer 4: SDK

The SDK provides low-level building blocks:

```
sdk/
├── elements/          # UI atoms (Text, Card, Icon, Badge, Progress...)
├── animations/        # Animation helpers (getCardEntrance, getSlideIn...)
├── effects/           # Visual effects (backgrounds, particles, noise)
├── theme/             # Style presets, emphasis effects, colors
├── lottie/            # Lottie animation registry and player
├── layout/            # Position calculations
└── core/              # Easing, time, typography utilities
```

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        SCENE CONFIG (JSON)                       │
│  { layout, background, transition, slots: { header, row1... } } │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SceneFromConfig                             │
│  - Resolves viewport into named slots                           │
│  - Applies background preset                                    │
│  - Renders mid-scenes into each slot                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
         ┌─────────┐   ┌─────────┐   ┌─────────┐
         │ header  │   │  row1   │   │  row2   │
         │  slot   │   │  slot   │   │  slot   │
         └────┬────┘   └────┬────┘   └────┬────┘
              │             │             │
              ▼             ▼             ▼
         ┌─────────┐   ┌─────────┐   ┌─────────┐
         │textReveal│  │gridCards│   │checklist│
         │mid-scene │  │mid-scene│   │mid-scene│
         └────┬────┘   └────┬────┘   └────┬────┘
              │             │             │
              └──────────────┼──────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                         SDK LAYER                                │
│  Elements (Text, Card, Icon) + Animations + Effects + Theme     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Layout System

### Layout Types

| Type | Slots Generated | Use Case |
|------|-----------------|----------|
| `full` | `header`, `full` | Single content area |
| `rowStack` | `header`, `row1`, `row2`... | Vertical sections |
| `columnSplit` | `header`, `col1`, `col2`... | Side-by-side (desktop) |
| `headerRowColumns` | `header`, `row`, `col1`, `col2`... | Complex layouts |
| `gridSlots` | `header`, `cellA`, `cellB`... | Grid layouts |

### Mobile Adaptation

On mobile viewports (1080×1920):
- `columnSplit` automatically converts to `rowStack`
- Grid columns capped at 2
- Padding and title height adjusted

---

## Beats System

Beats control **when** elements appear and disappear. They're specified in **seconds**:

```javascript
{
  lines: [
    { text: 'First line', beats: { start: 1.0, exit: 4.0, emphasis: 2.0 } },
    { text: 'Second line', beats: { start: 2.0, exit: 5.0 } },
  ]
}
```

| Beat | Purpose |
|------|---------|
| `start` | When element enters |
| `exit` | When element exits |
| `hold` | Duration to stay visible (alternative to exit) |
| `emphasis` | When to trigger emphasis animation |

### Slot Arrays (Sequences)

Multiple mid-scenes in one slot using beats for timing:

```javascript
slots: {
  row1: [
    { midScene: 'textReveal', config: { beats: { start: 0, exit: 3 } } },
    { midScene: 'heroText', config: { beats: { entrance: 3.5, exit: 6 } } },
  ]
}
```

---

## Style System

### Style Presets

Applied via `stylePreset` prop on slots:

| Preset | Vibe | Default Background |
|--------|------|-------------------|
| `educational` | Structured, clear | `notebookSoft` |
| `playful` | Energetic, fun | `sunriseGradient` |
| `minimal` | Clean, simple | `cleanCard` |
| `mentor` | Wise, dramatic | `chalkboardGradient` |
| `focus` | Spotlight attention | `spotlight` |

### Emphasis Levels

Applied per-item in mid-scenes:

| Level | Effect |
|-------|--------|
| `high` | Bold, coral color, background highlight, pulse animation |
| `normal` | Semi-bold, main color, subtle breathe animation |
| `low` | Regular weight, muted color, no animation |

---

## Background Presets

| Preset | Description |
|--------|-------------|
| `notebookSoft` | Lined paper overlay |
| `sunriseGradient` | Warm diagonal gradient |
| `cleanCard` | Neutral white |
| `chalkboardGradient` | Dark blue-green gradient |
| `spotlight` | Vignette with configurable focus |

Options:
- `layerNoise: true` — Adds subtle film grain
- `particles: { enabled: true, style: 'sparkle', count: 15 }` — Floating particles

---

## Transition Types

Transitions are powered by `@remotion/transitions` using `TransitionSeries` with spring-based timing.
The `resolvePresentation()` mapper in `sdk/transitions/index.ts` converts scene transition configs to Remotion presentations.

| Type | Remotion Presentation | Effect |
|------|----------------------|--------|
| `fade` | `fade()` | Opacity crossfade |
| `slide` | `slide()` | Directional push (up/down/left/right) with spring physics |
| `page-turn` | `flip()` | 3D flip with perspective |
| `clock-wipe` | `clockWipe()` | Circular reveal like a clock hand |
| `iris` | `iris()` | Circular mask expanding from center |

---

## Generic Parameterized Composition

`GenericVideoPlayer` (`compositions/GenericVideoPlayer.jsx`) is the universal composition that accepts any scene array via input props. It eliminates the need for per-video composition files and powers the entire blue-sky pipeline.

**Key features:**
- Accepts `scenes` array and optional `format` (`'desktop'` | `'mobile'`) as input props
- Uses `TransitionSeries` with `resolvePresentation()` and `resolveTransitionTiming()` from the SDK transition layer
- Registered in `Root.tsx` as `KnoMotionVideo` with `calculateMetadata()` for dynamic duration/dimensions
- Duration computed via `calculateTransitionSeriesDuration(scenes, 20)`
- Dimensions adapt based on `format`: 1920×1080 (desktop) or 1080×1920 (mobile)

**Usage (CLI rendering):**
```bash
npx remotion render KnoMotion-Videos/src/remotion/index.ts KnoMotionVideo --props='{"scenes":[...],"format":"desktop"}'
```

**Studio preview:** The `KnoMotionVideo` composition has a 3-scene test payload as `defaultProps` in `Root.tsx`. Select it in Remotion Studio to preview immediately. A Zod schema (`VideoConfigSchema`) is registered on the composition, enabling the Studio Props panel for structured visual editing.

> **Note on audio in `defaultProps`:** The `audio` field is optional. If `defaultProps` include audio blocks with unreachable URLs, the composition will stall for up to 5 seconds per scene while `SafeAudio` waits for the `delayRender` timeout. For instant Studio preview, omit `audio` blocks when no real audio files are available.

---

## Zod Schema & Visual Editing

The `KnoMotionVideo` composition has a complete Zod schema registered via the `schema` prop on `<Composition>`. This enables Remotion Studio's visual Props editor — non-developers can build videos through the Studio UI with typed fields, dropdowns for enums, and inline validation.

**Schema file:** `sdk/schemas/videoConfig.schema.ts`

**Structure:**
- `VideoConfigSchema` — Top-level: `{ scenes, format? }`
- `SceneItemSchema` — Per scene: `{ id, durationInFrames, transition?, config, audio?, captions? }`
- Sub-schemas for transitions (8 types), backgrounds (6 presets), layouts (5 types), slots (10 mid-scene keys + aliases)
- Audio/caption schemas composed from `sdk/audio/audioSchema.ts`

**Design decision:** Mid-scene inner `config` uses `z.record(z.unknown())`. Per-mid-scene validation is handled by JSON schemas in `sdk/mid-scenes/schemas/`, which remain the source of truth.

---

## Capability Manifest

A machine-readable JSON manifest (`sdk/capability-manifest.json`) declares what the engine can and cannot do. LLM agents use this for self-validation when generating scene JSON.

**Contents:** 10 mid-scenes (required fields, config options, aliases), 5 layouts, 6 backgrounds, 8 transitions, 40 lottie keys, 3 caption styles, constraints, and explicit unsupported declarations.

> **Note:** The manifest is currently a static file, hand-curated from schemas and registry. If new mid-scenes or capabilities are added frequently, consider building a generation script to keep it in sync automatically. See BUILD_STATUS.md Section 5 — S4a for details on when to upgrade.

---

## Audio Layer

The audio layer (P4) adds narration, background music, sound effects, and animated captions to videos. It is integrated into `GenericVideoPlayer` and activated when scene JSON includes `audio` and/or `captions` fields.

### Components

| Component | File | Purpose |
|-----------|------|---------|
| `AudioLayer` | `sdk/audio/AudioLayer.jsx` | Renders three audio channels per scene |
| `CaptionOverlay` | `sdk/audio/CaptionOverlay.jsx` | Renders animated word-level captions |
| `SafeAudio` | `sdk/audio/SafeAudio.jsx` | Graceful `<Html5Audio>` wrapper (P4e) |
| `audioSchema` | `sdk/audio/audioSchema.ts` | Zod schemas for audio/caption config |
| `alignTTSToBeats` | `sdk/utils/ttsToBeatAlignment.ts` | Converts TTS timestamps to scene beats |

### Audio Channels

All audio channels use `<SafeAudio>` (a graceful wrapper around `<Html5Audio>`) which catches broken audio URLs with `onError`, a 5-second timeout, and 1 retry — logging a warning and continuing without audio instead of crashing the composition.

| Channel | Remotion Element | Config Field | Features |
|---------|-----------------|--------------|----------|
| Narration | `<SafeAudio>` in `<Sequence>` | `audio.narration` | Offset by `startFromSeconds`, static volume |
| Background Music | `<SafeAudio loop>` | `audio.music` | Fade-in/out volume curves via `interpolate()` |
| Sound Effects | `<SafeAudio>` in `<Sequence>` | `audio.sfx[]` | Each SFX at specific `atSecond` offset |

### Caption Styles

| Style | Visual | Active Word Effect |
|-------|--------|-------------------|
| `tiktok` | Bold centered text | Highlighted in coral + 1.12x scale |
| `subtitle` | Semi-transparent bar at bottom | No per-word highlighting |
| `karaoke` | Full text shown | Words change from dimmed → white → coral |

### Data Flow with Audio

```
Scene JSON (with audio + captions)
       │
       ▼
GenericVideoPlayer
├── SceneFromConfig (visual layer)
├── AudioLayer (audio layer — invisible)
│   ├── Narration <SafeAudio>
│   ├── Music <SafeAudio loop>
│   └── SFX <SafeAudio> × N
└── CaptionOverlay (caption layer — visual overlay)
    └── createTikTokStyleCaptions() → pages → active word rendering
```

---

## File Structure

```
KnoMotion-Videos/src/
├── compositions/              # Video entry points
│   ├── SceneRenderer.jsx      # Core: SceneFromConfig
│   ├── GenericVideoPlayer.jsx # Universal parameterized composition (S2)
│   ├── KnodoviaVideo*.jsx     # Canon video compositions
│   └── TikTok_*.jsx           # TikTok format videos
├── sdk/
│   ├── audio/                 # Audio layer (P4): AudioLayer, CaptionOverlay, SafeAudio, schemas
│   ├── schemas/               # Zod schemas (S1): VideoConfigSchema, tests
│   ├── mid-scenes/            # 10 mid-scene components + JSON schemas
│   ├── transitions/           # Transition resolution layer (P1)
│   ├── elements/              # UI atoms and compositions
│   ├── theme/                 # Presets, emphasis, colors
│   ├── effects/               # Backgrounds, particles
│   ├── lottie/                # Animation registry
│   ├── scene-layout/          # Slot resolution
│   ├── utils/                 # ttsToBeatAlignment, beats, etc.
│   ├── animations/            # Animation helpers
│   └── capability-manifest.json  # Machine-readable engine capabilities (S4)
├── admin/                     # Preview tools
└── remotion/                  # Remotion entry points
```

---

## Key Concepts Summary

1. **Scene JSON** defines what to render (layout, slots, content)
2. **SceneFromConfig** orchestrates rendering
3. **Mid-scenes** are the building blocks (textReveal, gridCards, etc.)
4. **Beats** control timing
5. **Style presets** provide consistent theming
6. **Backgrounds** set the visual context
7. **Transitions** connect scenes
8. **Zod schema** enables Studio visual editing and runtime validation
9. **Capability manifest** enables LLM agent self-validation
10. **SafeAudio** ensures production resilience for audio playback

For detailed JSON schemas and examples, see the [LLM Reference Guide](./reference-llm-guide.md).
