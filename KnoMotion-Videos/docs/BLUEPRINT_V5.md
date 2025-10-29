# Knode Scene Blueprint v5.0

**Last Updated:** 2025-10-28  
**Status:** Production Ready

---

## Goal

Build deterministic, export-safe video scenes with a warm "alive notebook" aesthetic.  
Achieve broadcast-grade motion using Remotion primitives (interpolate, spring, bezier).  
Enable JSON-driven authoring: copy, timing, style, and animation presets.

**Outputs:** MP4 with perfect preview-to-export parity.  
**Modes:** Notebook-first (warm, textured) + Whiteboard-lite (clean, minimal).  
**FPS Anchor:** All timing authored at 30fps baseline, auto-scales to other frame rates.

---

## 1) Philosophy

- **Start simple, enhance intentionally** — Add complexity only when it serves the narrative
- **Beats cue when, easing decides how** — Timing is declarative, motion is expressive
- **Deterministic by design** — Everything derives from `frame`, never `useState` triggers
- **Notebook as signature, Whiteboard as variant** — Dual modes, shared foundation
- **JSON controls the show** — Authors write data, templates render motion
- **Author in seconds, render in frames** — Human-readable JSON, frame-precise execution

---

## 2) Render & Motion Determinism

### Core Principles

```javascript
// ✅ Frame-driven (always)
const frame = useCurrentFrame();
const { fps } = useVideoConfig();

// ✅ Time conversion helper
const frames = (seconds) => Math.round(seconds * fps);

// ✅ ID factory for determinism (context-based)
const id = useSceneId(); // Returns (key) => `s-${sceneId}-${key}`

// ❌ Never use state-based triggers
// useState, useEffect with dependencies that change, Math.random()
```

### Animation Sources (Remotion Only)

- `interpolate()` — For all basic transforms, opacity, positions
- `spring()` — For organic, physics-based motion
- `Easing.bezier()` — For custom timing curves

**No GSAP in export path.** GSAP is preview-only in development mode (optional).

### FPS Handling

- **Author in seconds (always)** — All JSON timing values are in seconds, FPS-agnostic
- **Frame conversion** — When FPS changes, frame count adjusts but duration stays the same
  - Example: 4s @ 30fps = 120 frames, 4s @ 60fps = 240 frames (still 4 seconds)
- **toFrames() helper** — Templates convert seconds to frames: `toFrames(seconds, fps)`
- **FPS not in JSON** — Controlled globally, not per-scene

---

## 3) Style System

### Mode Support

```javascript
// Defined per-scene in JSON
scene.style_tokens.mode // 'notebook' | 'whiteboard'

// Global baseline in constants
export const STYLE = {
  colors: {
    bgNotebook: '#FFF9F0',
    bgWhiteboard: '#FAFBFC',
    ink: '#1A1A1A',
    accent: '#FF6B35',
    accent2: '#9B59B6',
    success: '#27AE60',
    info: '#2E7FE4'
  },
  text: {
    header: 'Cabin Sketch',      // Sketchy headers
    emphasis: 'Permanent Marker', // Bold statements
    body: 'Inter'                 // Clean readability
  },
  textures: {
    paperGrain: '/assets/paper-grain.png',
    vignetteOpacityNotebook: 0.06,
    vignetteOpacityWhiteboard: 0.02
  },
  strokes: { 
    width: 5, 
    cap: 'round', 
    join: 'round' 
  },
  highlighter: { 
    opacity: 0.24, 
    radius: 8 
  },
  micro: { 
    breatheScale: [0.99, 1.01], 
    nudgePx: [-4, 4], 
    tiltDeg: [-1.5, 1.5] 
  }
};
```

### Style Token Inheritance

1. **Global baseline** — Defined in `STYLE` constants (brand-wide)
2. **Per-scene overrides** — JSON can override any token via `style_tokens`
3. **Font flexibility** — Can swap fonts per-scene if needed

```json
{
  "style_tokens": {
    "mode": "notebook",
    "colors": {
      "accent": "#E74C3C"  // Override just accent color
    }
  }
}
```

### Rules

- ✅ **Strict zero wobble** — All rough.js calls MUST use `roughness: 0, bowing: 0`
  - Sketchiness comes from fonts (Cabin Sketch, Permanent Marker) and texture overlays
  - No randomness in shape rendering
- ✅ **Consistent assets** — Sticky notes, tape, arrows, callouts, doodles
- ✅ **Preload fonts** — Fonts used in `style_tokens.fonts` MUST be preloaded in BOTH:
  - Preview context (browser)
  - Render context (Remotion SSR for export)
  - Avoid layout shift and ensure consistent measurements
- ✅ **Mode mixable** — Single video can alternate notebook ↔ whiteboard per scene

---

## 4) Timeline & Beats

### Beat Structure

**Minimum Required:**
```typescript
type Beats = {
  entrance: number;  // Required - scene start
  exit: number;      // Required - scene end
  [customBeat: string]: number; // Optional - template-specific
};
```

**Example:**
```json
{
  "beats": {
    "entrance": 0.6,
    "titleReveal": 1.2,
    "emphasis": 2.5,
    "mapEntry": 4.0,
    "exit": 5.8
  }
}
```

### Beat Timing Rules

- **Authored in seconds** (e.g., `"entrance": 0.6`)
- **Absolute from scene start** (not relative to previous beat)
- **Lives in JSON** (for future audio sync, A/B testing)
- **Template-specific** (Hook1A beats differ from Explain2B beats)
- **Breathing room** — 0.8–1.5s between major visual changes

### Pattern Guidance

Typical flow: **ENTRANCE → SERVE → EXIT** with 20–40% overlap for seamless transitions.

---

## 5) Easing Map

Central easing map using Remotion's `Easing.bezier()`:

```javascript
import { Easing } from 'remotion';

export const EZ = {
  // Default for most things - natural, material-style ease
  smooth: Easing.bezier(0.4, 0, 0.2, 1),
  
  // Calm, balanced in-out - good for camera pans & big moves
  power2InOut: Easing.bezier(0.45, 0, 0.55, 1),
  
  // Punchier S-curve - hero entrances, decisive repositioning
  power3InOut: Easing.bezier(0.65, 0, 0.35, 1),
  
  // Confident exits / compressions - slide/fade outs
  power3In: Easing.bezier(0.55, 0, 1, 0.45),
  
  // Gentle landings - secondary reveals, UI settles
  power2Out: Easing.bezier(0, 0, 0.2, 1),
  
  // Tiny overshoot for charm - tick pops, lightbulb, emphasis
  backOut: Easing.bezier(0.175, 0.885, 0.32, 1.275),
};

// Optional (add later if needed)
// - elasticOut (springy overshoot for special moments)
// - linear (rare; counters/timers only)
```

### Easing Usage in Presets

Presets accept easing by name string (e.g., `"ease": "power3InOut"`).  
Internal lookup via centralized map ensures consistency.

---

## 6) Animation Presets

### Design Philosophy

- **Grab-and-go** — Callable functions, not copy-paste code
- **Declarative config** — Accept frame + config object
- **Auto-clamping** — Never animate before start or after end
- **Easing-aware** — Accept easing name string, resolve via EZ map

### Starting Preset Library (10 Core)

#### **Entrances**

1. **fadeUpIn** — Fade opacity 0→1, translateY from distance
2. **slideInLeft** — Slide from left edge
3. **slideInRight** — Slide from right edge  
4. **popInSpring** — Spring-based scale with overshoot (mass, stiffness, damping)

#### **Emphasis**

5. **pulseEmphasis** — Scale 1→1.05→1 for attention
6. **breathe** — Looping subtle scale (idle animation)

#### **Exits**

7. **fadeDownOut** — Fade out with downward drift

#### **Complex**

8. **drawOnPath** — SVG strokeDashoffset animation (decoupled from rough.js)
9. **shrinkToCorner** — Scale down + translate (e.g., 0.5x scale, move to corner)
10. **highlightSwipe** — Growing clipPath mask behind text (returns JSX with `<defs>`)

### Preset Function Signatures

**Pattern A: Config-based (most presets)**
```javascript
// Returns { opacity, transform, ... }
// Accepts seconds, converts to frames internally
export const fadeUpIn = (frame, config, easingMap, fps) => {
  const { start, dur, dist = 50, ease = 'smooth' } = config;
  const startFrame = toFrames(start, fps);
  const endFrame = toFrames(start + dur, fps);
  
  const easeFn = easingMap[ease] || easingMap.smooth;
  
  const opacity = interpolate(
    frame,
    [startFrame, endFrame],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeFn }
  );
  
  const translateY = interpolate(
    frame,
    [startFrame, endFrame],
    [dist, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeFn }
  );
  
  return { opacity, translateY };
};
```

**Pattern B: Return raw values (for special cases)**
```javascript
// For path morph, counters, dashoffsets
// Accepts seconds, converts to frames internally
export const drawOnPath = (frame, config, easingMap, fps) => {
  const { start, dur, length, ease = 'power3InOut' } = config;
  const easeFn = easingMap[ease];
  const startFrame = toFrames(start, fps);
  const endFrame = toFrames(start + dur, fps);
  
  const progress = interpolate(
    frame,
    [startFrame, endFrame],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeFn }
  );
  
  return {
    strokeDasharray: length,
    strokeDashoffset: length * (1 - progress)
  };
};
```

**Pattern C: Hooks (only when JSX/refs required)**
```javascript
// For highlightSwipe that needs <clipPath> in <defs>
// Accepts seconds, converts to frames internally
export const useHighlightSwipe = (frame, config, easingMap, fps) => {
  const clipId = useId();
  const { start, dur, rect, ease = 'smooth' } = config;
  const startFrame = toFrames(start, fps);
  const endFrame = toFrames(start + dur, fps);
  
  // ... calculate width progress
  
  return {
    clipPathId: clipId,
    defsJSX: <clipPath id={clipId}>...</clipPath>,
    style: { clipPath: `url(#${clipId})` }
  };
};
```

### Preset Usage in JSON

```json
{
  "layers": [
    {
      "id": "titleSeq1",
      "type": "header",
      "text": "Welcome to Knodovia",
      "anim": [
        {
          "preset": "fadeUpIn",
          "start": 0.6,
          "dur": 0.9,
          "dist": 50,
          "ease": "power3InOut"
        },
        {
          "preset": "pulseEmphasis",
          "start": 2.1,
          "dur": 0.5
        }
      ]
    }
  ]
}
```

---

## 7) JSON Scene Schema v5.0

### Full Example

```json
{
  "schema_version": "5.0",
  "scene_id": "hook1a",
  "template_id": "Hook1AQuestionBurst",
  
  "meta": {
    "title": "Welcome to Knodovia",
    "description": "Opening hook with provocative question",
    "tags": ["module:knodovia", "pillar:hook", "variant:1A"],
    "difficulty": "beginner",
    "tone": "thoughtful"
  },
  
  "style_tokens": {
    "mode": "notebook",
    "colors": {
      "accent": "#E74C3C",
      "accent2": "#9B59B6"
    }
  },
  
  "beats": {
    "entrance": 0.6,
    "questionPart2": 2.8,
    "emphasis": 4.2,
    "mapReveal": 6.5,
    "exit": 15.0
  },
  
  "layers": [
    {
      "id": "titleSeq1",
      "type": "header",
      "text": "What if geography",
      "pos": { "x": 960, "y": 480 },
      "style": { 
        "fontSize": 76, 
        "color": "ink",
        "font": "header"
      },
      "anim": [
        { 
          "preset": "fadeUpIn", 
          "start": 0.6, 
          "dur": 0.9, 
          "dist": 50, 
          "ease": "power3InOut" 
        }
      ]
    },
    {
      "id": "titleSeq2",
      "type": "header",
      "text": "was measured in mindsets?",
      "pos": { "x": 960, "y": 600 },
      "style": { 
        "fontSize": 92, 
        "color": "accent",
        "font": "header"
      },
      "anim": [
        { 
          "preset": "fadeUpIn", 
          "start": 2.8, 
          "dur": 1.0, 
          "dist": 40 
        },
        { 
          "preset": "pulseEmphasis", 
          "start": 4.2, 
          "dur": 0.5 
        }
      ]
    },
    {
      "id": "animationSeq1",
      "type": "map",
      "anim": [
        { 
          "preset": "fadeUpIn", 
          "start": 6.5, 
          "dur": 1.3 
        },
        { 
          "preset": "shrinkToCorner", 
          "start": 9.0, 
          "dur": 1.2, 
          "targetScale": 0.4, 
          "targetPos": { "x": 600, "y": -300 } 
        }
      ]
    },
    {
      "id": "exitGroup",
      "type": "group",
      "targets": ["titleSeq1", "titleSeq2"],
      "scope": ["transform", "opacity"],
      "anim": [
        { 
          "preset": "fadeDownOut", 
          "start": 5.5, 
          "dur": 0.9, 
          "dist": 240, 
          "ease": "power3In" 
        }
      ]
    }
  ],
  
  "lottie": [
    {
      "id": "lottieSeq1",
      "src": "/lottie/spark.json",
      "pos": { "x": 1320, "y": 280 },
      "colorize": "accent",
      "start": 2.1,
      "dur": 0.4
    }
  ]
}
```

### Layer ID Conventions

Use semantic, sequence-based IDs:
- `titleSeq1`, `titleSeq2` — Text elements
- `imageSeq1`, `imageSeq2` — Images/illustrations
- `animationSeq1` — Complex animated components (maps, charts)
- `lottieSeq1` — Lottie animations
- `annotationSeq1` — Callouts, arrows, doodles
- `exitGroup` — Grouped animations

Templates can define custom types via registry pattern.

### Schema Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `schema_version` | string | ✅ | Current: "5.0" |
| `scene_id` | string | ✅ | Unique scene identifier |
| `template_id` | string | ✅ | Template component name |
| `meta` | object | ❌ | Metadata (title, tags, etc.) |
| `style_tokens` | object | ❌ | Style overrides (mode, colors, fonts) |
| `beats` | object | ✅ | Timing markers (entrance, exit, custom) |
| `layers` | array | ✅ | Visual elements with animations |
| `lottie` | array | ❌ | Lottie animations |

---

## 8) Template Contract

### Exports (Required)

Every template MUST export:

```javascript
// 1. Template metadata
export const TEMPLATE_ID = 'Hook1AQuestionBurst';
export const TEMPLATE_VERSION = '5.0.0';

// 2. React component
export const Hook1AQuestionBurst = ({ scene, styles, presets, easingMap, transitions }) => {
  // ...
};

// 3. Duration calculator (derived from beats)
export const getDuration = (scene, fps) => {
  const tailPadding = 0.5; // Optional padding after exit
  return toFrames(scene.beats.exit + tailPadding, fps);
};

// 4. Min/max duration (frames at 30fps baseline)
export const DURATION_MIN_FRAMES = 450; // 15s @ 30fps
export const DURATION_MAX_FRAMES = 540; // 18s @ 30fps

// 5. Supported modes
export const SUPPORTED_MODES = ['notebook', 'whiteboard'];

// 6. Capabilities (boolean flags)
export const CAPABILITIES = {
  usesSVG: true,
  usesLottie: false,
  usesRoughJS: true,
  requiresAudio: false
};

// 7. Required presets (optional, for build-time validation)
export const PRESETS_REQUIRED = ['fadeUpIn', 'pulseEmphasis', 'shrinkToCorner'];

// 8. Poster frame (optional, for thumbnails)
export const getPosterFrame = (scene, fps) => {
  return Math.round(scene.beats.emphasis * fps);
};
```

### Props (Required)

Every template component MUST accept:

```javascript
const TemplateComponent = ({ 
  scene,        // JSON scene data
  styles,       // Global + scene style tokens
  presets,      // Animation preset functions
  easingMap,    // EZ easing map
  transitions   // Transition config (for multi-scene)
}) => { /* ... */ };
```

### Metadata Usage

- **Build-time linting** — Validate scene JSON against required presets
- **Wizard UX** — Grey out whiteboard toggle if not in `SUPPORTED_MODES`
- **Scene governance** — Warn if `duration_s` exceeds `DURATION_MAX`
- **Thumbnails** — Use `posterFrame` for scene picker UI

---

## 9) ID Factory Pattern

### Context-Based ID Generation

```javascript
import { createContext, useContext } from 'react';

// SceneIdContext.jsx
export const SceneIdContext = createContext('default-scene');

export const useSceneId = () => {
  const sceneId = useContext(SceneIdContext);
  return (key) => `s-${sceneId}-${key}`;
};

// Parent must wrap scene with provider:
// <SceneIdContext.Provider value={uniqueId}>
//   <TemplateComponent scene={scene} />
// </SceneIdContext.Provider>
```

### Usage in Templates

```javascript
const Hook1A = ({ scene }) => {
  const id = useSceneId();
  
  // Deterministic IDs
  const clipPathId = id('highlighter-clip');
  const maskId = id('text-mask');
  
  return (
    <svg>
      <defs>
        <clipPath id={clipPathId}>...</clipPath>
        <mask id={maskId}>...</mask>
      </defs>
      {/* ... */}
    </svg>
  );
};
```

### Rules

- ✅ **Deterministic** — Same scene always produces same IDs
- ❌ **No randomness** — No `Math.random()`, no frame-based values
- ✅ **Namespace-safe** — Multiple instances of same scene won't collide
- ✅ **Essential for** — `<defs>` (clipPath, mask, gradient, filter), imperative SVG, multi-scene compositions

---

## 10) Advanced Animation Patterns

### SVG Path Animation (Decoupled from rough.js)

**Problem:** Hook1A creates paths with rough.js, then animates strokeDashoffset.  
**Solution:** Use guidePath + clipPath to separate construction from animation.

```javascript
// Template builds path
const mapPath = "M 200 180 Q 180 120 220 100...";

// drawOnPath preset handles animation
const pathAnim = presets.drawOnPath(frame, {
  start: beats.mapReveal,
  dur: 1.3,
  length: 800,
  ease: 'power3InOut'
}, easingMap);

// Apply to SVG
<path 
  d={mapPath} 
  strokeDasharray={pathAnim.strokeDasharray}
  strokeDashoffset={pathAnim.strokeDashoffset}
/>
```

### Grouped Animations

**Use `<GroupLayer>` pattern for coordinated motion:**

```javascript
// In JSON
{
  "id": "exitGroup",
  "type": "group",
  "targets": ["titleSeq1", "titleSeq2", "annotationSeq1"],
  "scope": ["transform", "opacity"],
  "anim": [
    { "preset": "fadeDownOut", "start": 5.5, "dur": 0.9 }
  ]
}

// Template applies automatically to all targets
const GroupLayer = ({ layer, children }) => {
  const groupStyle = applyGroupAnimations(layer.anim);
  return <div style={groupStyle}>{children}</div>;
};
```

### Highlighter Swipe

**Returns JSX with `<defs>` + style object:**

```javascript
const { clipPathId, defsJSX, style } = presets.highlightSwipe(frame, {
  start: beats.emphasis,
  dur: 0.6,
  rect: { x: 560, y: 320, width: 800, height: 80 }
}, easingMap);

return (
  <svg>
    <defs>{defsJSX}</defs>
    <text style={style}>Highlighted text</text>
  </svg>
);
```

---

## 11) Quality Checklist

Before considering a template production-ready:

### ✅ Determinism
- [ ] Uses only `frame`, never `useState` triggers
- [ ] ID factory for all `<defs>` elements
- [ ] No `Math.random()` or time-based randomness

### ✅ Timing
- [ ] All beats defined in JSON (seconds)
- [ ] Animations use preset functions, not inline math
- [ ] Proper breathing room (0.8–1.5s) between major changes

### ✅ Style
- [ ] Respects `scene.style_tokens.mode` (notebook/whiteboard)
- [ ] Uses global STYLE constants with per-scene overrides
- [ ] **Strict zero wobble** — ALL rough.js calls use `roughness: 0, bowing: 0`
- [ ] Fonts preloaded in preview AND render contexts (Remotion SSR)

### ✅ Typography
- [ ] Fonts preloaded (avoid layout shift)
- [ ] Proper hierarchy (Cabin Sketch headers, Permanent Marker emphasis, Inter body)
- [ ] No text blocks >2 lines

### ✅ Motion
- [ ] Uses EZ easing map (no hardcoded beziers)
- [ ] Presets handle clamping internally
- [ ] Smooth exits (never cut abruptly)

### ✅ Performance
- [ ] SVG updates in useEffect (avoid reconciliation)
- [ ] Lottie assets preloaded
- [ ] No heavy computations in render loop

### ✅ Exports
- [ ] All required exports present (TEMPLATE_ID, getDuration, etc.)
- [ ] CAPABILITIES flags accurate
- [ ] Poster frame defined

---

## 12) Anti-Patterns

### ❌ Avoid These

- **No text walls** — Max 2 lines per element
- **No fade-only reveals** — Must justify (use entrance preset)
- **No GSAP in exports** — Remotion only
- **No state triggers** — Frame-driven only
- **No inline easings** — Use EZ map
- **No non-token colors** — Always reference STYLE constants or scene overrides
- **No wobble** — ALL rough.js MUST use `roughness: 0, bowing: 0` (strict rule)
- **No unpreloaded fonts** — Fonts must load before render in SSR context

---

## 13) Implementation Checklist

### Phase 1: Foundation (SDK)
- [ ] Update `src/sdk/easing.ts` with EZ map (6 core easings)
- [ ] Refactor `src/sdk/animations.js` with 10 preset functions
- [ ] Create `src/sdk/SceneIdContext.jsx` for ID factory
- [ ] Add `frames()` helper to `src/sdk/time.ts`

### Phase 2: Template Updates
- [ ] Add required exports to Hook1A template
- [ ] Refactor Hook1A to use presets instead of inline interpolate
- [ ] Update `hook_1a_knodovia_map.json` to v5 schema
- [ ] Test notebook ↔ whiteboard mode switching

### Phase 3: Validation
- [ ] Run Hook1A at 30fps, 60fps (verify auto-scaling)
- [ ] Export MP4, compare with preview (frame-by-frame parity)
- [ ] Render same scene 3x in composition (verify ID uniqueness)

---

## 14) Example Flow (Hook1A, 18s)

```
0.6s  → titleSeq1 fadeUpIn ("What if geography")
2.8s  → titleSeq2 fadeUpIn ("was measured in mindsets?")
4.2s  → titleSeq2 pulseEmphasis
5.5s  → exitGroup fadeDownOut (titles exit together)
6.5s  → animationSeq1 (map) fadeUpIn
9.0s  → animationSeq1 shrinkToCorner (map moves to corner)
10.0s → titleSeq3 fadeUpIn ("Welcome to Knodovia")
15.0s → Scene exit, overlap next scene at 14.5s
```

---

## 15) Future Enhancements (Not v5.0)

- Audio sync via beat markers
- A/B testing JSON variants
- Visual timeline editor
- Preset marketplace
- Template hot-reload in dev
- JSON schema validation (Zod)
- Migration tool (v3 → v5)

---

**END OF BLUEPRINT v5.0**

For questions or clarifications, see project documentation or contact the Knode team.
