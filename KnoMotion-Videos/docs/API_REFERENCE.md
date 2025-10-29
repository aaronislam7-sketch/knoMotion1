# API Reference - KnoMotion Videos

Complete reference for the SDK, presets, and utilities.

---

## Animation Presets

Located in `src/sdk/presets.jsx`

### Entrances

#### `fadeUpIn(frame, config, easingMap, fps)`
Fade in with upward movement.

**Config:**
```javascript
{
  start: 0.6,        // Start time in seconds
  dur: 0.9,          // Duration in seconds
  dist: 50,          // Distance to travel (pixels)
  ease: 'smooth'     // Easing function name
}
```

**Returns:** `{ opacity, translateY }`

---

#### `slideInLeft(frame, config, easingMap, fps)`
Slide in from left edge.

**Config:**
```javascript
{
  start: 1.0,
  dur: 0.8,
  dist: 100,
  ease: 'smooth'
}
```

**Returns:** `{ opacity, translateX }`

---

#### `slideInRight(frame, config, easingMap, fps)`
Slide in from right edge.

**Config:** Same as `slideInLeft`  
**Returns:** `{ opacity, translateX }`

---

#### `popInSpring(frame, config, easingMap, fps)`
Pop in with spring physics (overshoot).

**Config:**
```javascript
{
  start: 2.0,
  mass: 1,           // Spring mass
  stiffness: 120,    // Spring stiffness
  damping: 10        // Spring damping
}
```

**Returns:** `{ opacity, scale }`

---

### Emphasis

#### `pulseEmphasis(frame, config, easingMap, fps)`
Scale up and back for emphasis.

**Config:**
```javascript
{
  start: 4.2,
  dur: 0.5,
  scale: 1.05,       // Max scale
  ease: 'backOut'
}
```

**Returns:** `{ scale }`

---

#### `breathe(frame, config, easingMap, fps)`
Looping subtle scale animation.

**Config:**
```javascript
{
  start: 0,
  loop: 3.0,         // Duration per cycle
  amount: 0.02       // Scale amount (±)
}
```

**Returns:** `{ scale }`

---

### Exits

#### `fadeDownOut(frame, config, easingMap, fps)`
Fade out with downward movement.

**Config:**
```javascript
{
  start: 14.0,
  dur: 0.9,
  dist: 50,
  ease: 'power3In'
}
```

**Returns:** `{ opacity, translateY }`

---

### Complex Animations

#### `drawOnPath(frame, config, easingMap, fps)`
SVG path drawing animation.

**Config:**
```javascript
{
  start: 2.0,
  dur: 1.3,
  length: 800,       // Path length
  ease: 'power3InOut'
}
```

**Returns:** `{ strokeDasharray, strokeDashoffset }`

**Usage:**
```javascript
const pathAnim = drawOnPath(frame, {...}, EZ, fps);
<path 
  strokeDasharray={pathAnim.strokeDasharray}
  strokeDashoffset={pathAnim.strokeDashoffset}
/>
```

---

#### `shrinkToCorner(frame, config, easingMap, fps)`
Shrink and move to corner.

**Config:**
```javascript
{
  start: 9.0,
  dur: 1.2,
  targetScale: 0.4,
  targetPos: { x: 600, y: -300 },
  ease: 'power2InOut'
}
```

**Returns:** `{ scale, translateX, translateY }`

---

#### `useHighlightSwipe(frame, config, easingMap, fps)`
Growing clipPath highlight effect (Hook).

**Config:**
```javascript
{
  start: 4.0,
  dur: 0.6,
  rect: { x: 0, y: 0, width: 800, height: 80 },
  ease: 'smooth'
}
```

**Returns:** `{ clipPathId, defsJSX, style, progress }`

**Usage:**
```javascript
const highlight = useHighlightSwipe(frame, {...}, EZ, fps);
<svg>
  <defs>{highlight.defsJSX}</defs>
  <text style={highlight.style}>Text</text>
</svg>
```

---

## Easing Functions

Located in `src/sdk/easing.ts`

### EZ Easing Map

```javascript
import { EZ } from './sdk';

EZ.smooth          // Default, material-style ease
EZ.power2InOut     // Balanced in-out
EZ.power3InOut     // Punchier S-curve
EZ.power3In        // Confident exits
EZ.power2Out       // Gentle landings
EZ.backOut         // Tiny overshoot for charm
```

### Usage in Presets

```javascript
const anim = fadeUpIn(frame, {
  start: 1.0,
  dur: 0.9,
  ease: 'power3InOut'  // String name
}, EZ, fps);
```

---

## Time Helpers

Located in `src/sdk/time.ts`

### `toFrames(seconds, fps)`
Convert seconds to frames.

```javascript
import { toFrames } from './sdk';

const frames = toFrames(4.5, 30);  // 135 frames
```

**FPS-Agnostic:** Automatically adjusts for any frame rate.

---

## Scene ID Context

Located in `src/sdk/SceneIdContext.jsx`

### `useSceneId()`
Get deterministic ID factory for current scene.

```javascript
import { useSceneId } from './sdk';

const MyTemplate = ({ scene }) => {
  const id = useSceneId();
  
  const clipPathId = id('highlighter-clip');  // "s-scene123-highlighter-clip"
  const maskId = id('text-mask');             // "s-scene123-text-mask"
  
  return (
    <svg>
      <defs>
        <clipPath id={clipPathId}>...</clipPath>
        <mask id={maskId}>...</mask>
      </defs>
    </svg>
  );
};
```

**Why?** Ensures unique IDs when same scene appears multiple times.

---

## Rough.js Helpers

Located in `src/sdk/rough-utils.js`

### `drawRoughRect(rc, x, y, w, h, options)`
Draw rectangle with rough.js.

```javascript
import rough from 'roughjs/bundled/rough.esm.js';

const svg = document.querySelector('svg');
const rc = rough.svg(svg);

const rect = drawRoughRect(rc, 100, 100, 400, 200, {
  stroke: '#FF6B35',
  strokeWidth: 5,
  roughness: 0,  // STRICT: Always 0 in v5
  bowing: 0,     // STRICT: Always 0 in v5
  fill: '#FF6B3512'
});

svg.appendChild(rect);
```

---

## Theme System

Located in `src/utils/theme.js`

### THEME Object

```javascript
import { THEME } from '../utils/theme';

THEME.colors.bg           // '#FFF9F0'
THEME.colors.accent       // '#FF6B35'
THEME.colors.ink          // '#1A1A1A'

THEME.fonts.marker.primary     // 'Permanent Marker'
THEME.fonts.header.primary     // 'Cabin Sketch'
THEME.fonts.structure.primary  // 'Inter'
```

---

## Template Exports

Every v5 template must export:

```javascript
export const TEMPLATE_ID = 'Hook1AQuestionBurst';
export const TEMPLATE_VERSION = '5.0.0';

export const getDuration = (scene, fps) => {
  return toFrames(scene.beats.exit + 0.5, fps);
};

export const DURATION_MIN_FRAMES = 450;   // 15s @ 30fps
export const DURATION_MAX_FRAMES = 540;   // 18s @ 30fps

export const SUPPORTED_MODES = ['notebook', 'whiteboard'];

export const CAPABILITIES = {
  usesSVG: true,
  usesLottie: false,
  usesRoughJS: true,
  requiresAudio: false,
  supportsTransitions: true
};

export const PRESETS_REQUIRED = [
  'fadeUpIn',
  'pulseEmphasis',
  'shrinkToCorner'
];

export const getPosterFrame = (scene, fps) => {
  return toFrames(scene.beats.emphasis, fps);
};
```

---

## Template Props

All templates receive:

```javascript
const MyTemplate = ({ 
  scene,        // JSON scene data
  styles,       // Global + scene style tokens
  presets,      // Animation preset functions
  easingMap,    // EZ easing map
  transitions   // Transition config
}) => {
  // ...
};
```

---

## Scene JSON Schema

```typescript
{
  schema_version: string;        // "5.0"
  scene_id: string;             // Unique ID
  template_id: string;          // Template name
  
  meta?: {
    title: string;
    description?: string;
    tags?: string[];
  };
  
  style_tokens?: {
    mode?: 'notebook' | 'whiteboard';
    colors?: {
      bg?: string;
      accent?: string;
      accent2?: string;
      ink?: string;
    };
  };
  
  beats: {
    entrance: number;           // Required
    exit: number;               // Required
    [custom: string]: number;   // Template-specific
  };
  
  fill: {
    texts?: Record<string, string>;
    images?: Record<string, string>;
    [key: string]: any;         // Template-specific
  };
}
```

---

## Style Tokens

### Mode

```json
"style_tokens": {
  "mode": "notebook"  // or "whiteboard"
}
```

**Notebook:** Warm (#FFF9F0 bg), textured, sketchy  
**Whiteboard:** Clean (#FAFBFC bg), minimal, professional

### Color Overrides

```json
"style_tokens": {
  "colors": {
    "accent": "#E74C3C",    // Override just accent
    "accent2": "#9B59B6",
    "ink": "#2C3E50"
  }
}
```

---

## Utilities

### Image Library

Located in `src/utils/imageLibrary.js`

```javascript
import { IMAGES } from '../utils/imageLibrary';

IMAGES.icons.lightbulb     // Path to lightbulb icon
IMAGES.icons.checkmark     // Path to checkmark
```

---

## Best Practices

### ✅ DO

- Use `toFrames()` to convert seconds → frames
- Use EZ easing map for all animations
- Set `roughness: 0, bowing: 0` for rough.js (strict)
- Use `useSceneId()` for deterministic IDs
- Author beats in seconds (FPS-agnostic)

### ❌ DON'T

- Use `useState` for animation triggers
- Use `Math.random()` for any values
- Hardcode frame numbers in templates
- Add wobble to rough.js (`roughness > 0`)
- Use GSAP or other animation libraries

---

## Template Development Checklist

When creating a new template:

1. ✅ Import required SDK functions
2. ✅ Use `useSceneId()` for all IDs
3. ✅ Convert beats to frames with `toFrames()`
4. ✅ Use animation presets where possible
5. ✅ Apply EZ easing functions
6. ✅ Set `roughness: 0, bowing: 0` for rough.js
7. ✅ Export all required template metadata
8. ✅ Test at 30fps and 60fps (FPS-agnostic check)
9. ✅ Verify export matches preview (determinism check)

---

**Complete reference for building with KnoMotion Videos!** 🎬

[← Back to README](../README.md) | [Blueprint v5 Spec](./BLUEPRINT_V5.md)
