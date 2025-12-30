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
| `animatedCounter` | Number animation | `startValue`, `endValue`, `duration` |

Each mid-scene:
- Receives a **slot position** (left, top, width, height)
- Receives a **config object** with content and options
- Uses SDK elements and animations internally

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

| Type | Effect |
|------|--------|
| `fade` | Simple opacity transition |
| `slide` | Directional slide (up/down/left/right) |
| `page-turn` | 3D page flip |
| `doodle-wipe` | Hand-drawn wipe effect |
| `eraser` | Eraser sweep effect |

---

## File Structure

```
KnoMotion-Videos/src/
├── compositions/           # Video entry points
│   ├── SceneRenderer.jsx   # Core: SceneFromConfig, SceneTransitionWrapper
│   ├── KnodoviaVideo*.jsx  # Canon video compositions
│   └── TikTok_*.jsx        # TikTok format videos
├── sdk/
│   ├── mid-scenes/         # 10 mid-scene components + schemas
│   ├── elements/           # UI atoms and compositions
│   ├── theme/              # Presets, emphasis, colors
│   ├── effects/            # Backgrounds, particles
│   ├── lottie/             # Animation registry
│   ├── scene-layout/       # Slot resolution
│   └── animations/         # Animation helpers
├── admin/                  # Preview tools
└── remotion/               # Remotion entry points
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

For detailed JSON schemas and examples, see the [LLM Reference Guide](./reference-llm-guide.md).
