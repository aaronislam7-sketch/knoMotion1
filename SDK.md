# 🛠️ SDK Reference

**Complete SDK framework reference for KnoMotion video templates**

> **Note**: This is a **developer reference** for building custom mid-scenes and React components.
> 
> For **LLM video generation**, see:
> - [docs/reference-llm-guide.md](./docs/reference-llm-guide.md) — JSON schemas and validation
> - [docs/instructions-llm-guide.md](./docs/instructions-llm-guide.md) — LLM system prompt

---

## 📚 Table of Contents

1. [Overview](#overview)
2. [Core Modules](#core-modules)
3. [Mid-Scenes](#mid-scenes)
4. [Animations](#animations)
5. [Effects](#effects)
6. [Layout](#layout)
7. [Validation](#validation)
8. [Utilities](#utilities)
9. [Usage Examples](#usage-examples)
10. [Contributing](#contributing)

---

## 🎯 Overview

The KnoMotion SDK is a **modular collection of utilities** for building video templates. It provides:

- ✅ **Mid-Scenes** - Pre-built JSON-configurable components for LLMs
- ✅ **Animation helpers** - Pre-built animation functions
- ✅ **Visual effects** - Particles, glow, glassmorphic, etc.
- ✅ **Layout engines** - Positioning, spacing, collision detection
- ✅ **Type systems** - Polymorphic rendering (images, SVG, Lottie)
- ✅ **Validation** - Schema validation, compatibility checks
- ✅ **Utilities** - Easing, timing, typography, fonts

**Location:** `/workspace/KnoMotion-Videos/src/sdk/`

---

## 📦 Core Modules

### Importing from SDK

```javascript
// Import everything
import { SDK } from '../sdk';

// Import specific modules
import { getCardEntrance, getIconPop } from '../sdk/microDelights';
import { GlassmorphicPane, SpotlightEffect } from '../sdk/broadcastEffects';
import { toFrames, toSeconds } from '../sdk/time';
import { renderHero } from '../sdk/heroRegistry';

// Import all from category
import * as animations from '../sdk/animations';
import * as lottie from '../sdk/lottie-helpers';
```

---

## 🎨 Theme System (Presets & Emphasis)

### Module: `theme/stylePresets.ts`

Curated style bundles that keep JSON configs short and brand-safe.

```javascript
import { resolveStylePreset, STYLE_PRESETS } from '../sdk/theme/stylePresets';

const preset = resolveStylePreset('playful');
// => {
//   textVariant: 'display',
//   textColor: 'primary',
//   decoration: 'highlight',
//   doodle: { type: 'circle', color: 'accentBlue', thickness: 3 },
//   animationPreset: 'bouncy',
//   background: { preset: 'sunriseGradient' }
// }
```

**Presets available:** `educational`, `playful`, `minimal`, `mentor`, `focus`.  
Each preset controls typography, doodle type, animation tone, and suggested background. Mid-scenes accept a `stylePreset` prop and merge it with their own config.

### Module: `theme/emphasisEffects.ts`

Standardised emphasis treatments (colors + looping micro-animations).

```javascript
import { resolveEmphasisEffect } from '../sdk/theme/emphasisEffects';

const { textStyle, animation } = resolveEmphasisEffect('high');
// textStyle → bold coral text w/ highlight background
// animation → { type: 'pulse', amount: 0.05 }
```

`EmphasisEffect` objects contain `textStyle`, optional `doodle` instructions, and animation metadata (`pulse` or `breathe`). Use them in mid-scenes to give per-line emphasis without custom CSS.

---

## 🎯 Mid-Scenes

**Location:** `/workspace/KnoMotion-Videos/src/sdk/mid-scenes/`

### What Are Mid-Scenes?

Mid-scenes are **composed components** that combine SDK elements, animations, effects, and layout logic into reusable, JSON-configurable patterns. They are designed for **LLM JSON generation**—enabling AI to create complete video scenes without writing code.

**NOT Layouts**: Mid-scenes are **NOT** layout systems. They are pre-built components that **use** layout systems.

### Current Mid-Scenes (4)

#### 1. HeroTextEntranceExit

**Purpose**: Hero visual + text with entrance/exit animations.

```javascript
import { HeroTextEntranceExit } from '../sdk/mid-scenes';

const config = {
  text: "Learn with KnoMotion",
  heroType: "lottie",
  heroRef: "/lotties/rocket.json",
  animationEntrance: "fadeSlide",
  animationExit: "fadeOut",
  beats: { entrance: 1.0, exit: 5.0 }
};

<HeroTextEntranceExit config={config} />
```

**Schema**: `mid-scenes/schemas/HeroTextEntranceExit.schema.json`

#### 2. CardSequence

**Purpose**: Multiple cards with stagger animations (stacked or grid).

```javascript
import { CardSequence } from '../sdk/mid-scenes';

const config = {
  cards: [
    { title: "Step 1", content: "Understand concept", variant: "default" },
    { title: "Step 2", content: "Practice skill", variant: "bordered" }
  ],
  layout: "stacked",
  animation: "fadeSlide",
  staggerDelay: 0.2,
  beats: { start: 1.0 }
};

<CardSequence config={config} />
```

**Schema**: `mid-scenes/schemas/CardSequence.schema.json`

#### 3. TextRevealSequence

**Purpose**: Multiple text lines with reveal animations and emphasis.

```javascript
import { TextRevealSequence } from '../sdk/mid-scenes';

const config = {
  lines: [
    { text: "Learning is a journey", emphasis: "high" },
    { text: "Every step matters", emphasis: "normal" }
  ],
  revealType: "typewriter",
  direction: "up",
  staggerDelay: 0.3,
  lineSpacing: "relaxed",
  beats: { start: 1.0 }
};

<TextRevealSequence config={config} />
```

**Features**:
- Reveal types: typewriter, fade, slide, mask
- Direction support: up, down, left, right
- Emphasis levels: normal, high (bold + highlight), low (muted)
- Line spacing: tight, normal, relaxed, loose (from theme)

**Schema**: `mid-scenes/schemas/TextRevealSequence.schema.json`

#### 4. IconGrid

**Purpose**: Grid of icons with entrance animations.

```javascript
import { IconGrid } from '../sdk/mid-scenes';

const config = {
  icons: [
    { iconRef: "🎯", label: "Focus", color: "primary" },
    { iconRef: "🚀", label: "Launch", color: "accentBlue" },
    { iconRef: "💡", label: "Ideas", color: "doodle" }
  ],
  columns: 3,
  animation: "cascade",
  iconSize: "lg",
  showLabels: true,
  beats: { start: 1.0 }
};

<IconGrid config={config} />
```

**Features**:
- Animations: fadeIn, slideIn, scaleIn, bounceIn, **cascade** (diagonal wave)
- Icon sizes: sm, md, lg, xl
- Per-icon color control
- Optional labels

**Schema**: `mid-scenes/schemas/IconGrid.schema.json`

---

### Mid-Scene Architecture

All mid-scenes follow this pattern:

```javascript
export const MidSceneComponent = ({ config }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  
  // 1. Extract config
  const { items, animation, beats, style } = config;
  
  // 2. Calculate positions using layout engine
  const positions = calculateItemPositions(items, {
    arrangement: ARRANGEMENT_TYPES.STACKED_VERTICAL,
    viewport: { width, height },
    spacing: 80,
  });
  
  // 3. Render with wrapper pattern (position + animation separation)
  return (
    <AbsoluteFill>
      {positions.map((pos, index) => {
        const animStyle = getAnimationStyle(...);
        const itemPosition = positionToCSS(pos);
        
        return (
          <div key={index} style={itemPosition}>  {/* Outer: Position only */}
            <div style={animStyle}>              {/* Inner: Animation only */}
              <Content />
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
```

### Key Principles

1. **100% SDK Integration** - Use only SDK functions, never custom animations
2. **Wrapper Pattern** - Separate positioning and animation into nested divs
3. **Theme Consistency** - Use `KNODE_THEME` tokens exclusively
4. **Layout Engine** - Use `calculateItemPositions()` for all positioning
5. **JSON Configurable** - Everything configurable via JSON with defaults
6. **Schema Validation** - Every mid-scene has JSON schema file

---

### Critical Issue: Two `positionToCSS` Functions

**Problem**: There are **two different** `positionToCSS` functions that handle positioning differently:

| Function | Location | Use When | Input |
|----------|----------|----------|-------|
| `positionToCSS` | `layout/positionSystem.js` | STACKED layouts | `{x, y}` only |
| `positionToCSS` | `layout/layoutEngine.js` | GRID layouts | `{x, y, width, height}` |

**Why This Matters**:

```javascript
// STACKED layouts return center coordinates WITHOUT width/height
const positions = calculateItemPositions(items, {
  arrangement: ARRANGEMENT_TYPES.STACKED_VERTICAL,
  spacing: 80
});
// Returns: [{ x: 960, y: 400 }, { x: 960, y: 500 }]

// ❌ WRONG: Using layoutEngine.positionToCSS
import { positionToCSS } from '../layout/layoutEngine';
const css = positionToCSS(positions[0]);
// Calculates: left = 960 - 0 = 960px (CENTER used as LEFT → offset to right!)

// ✅ CORRECT: Using positionSystem.positionToCSS
import { positionToCSS } from '../layout/positionSystem';
const css = positionToCSS(positions[0], 'center');
// Returns: { left: '960px', top: '400px', transform: 'translate(-50%, -50%)' }
// CSS transform centers the element correctly!
```

**Solution Pattern**:

```javascript
// Import both with aliases
import { positionToCSS as positionToCSSLayoutEngine } from '../layout/layoutEngine';
import { positionToCSS as positionToCSSWithTransform } from '../layout/positionSystem';

// Check if positions have width/height
const hasWidthHeight = 'width' in positions[0] && 'height' in positions[0];

// Use correct function
const itemPosition = hasWidthHeight
  ? positionToCSSLayoutEngine(pos)           // GRID layout
  : positionToCSSWithTransform(pos, 'center'); // STACKED layout
```

**Best Practice**: Always check what your layout returns before choosing `positionToCSS`.

---

### Wrapper Pattern (Required)

Always separate positioning and animation transforms:

```javascript
// ❌ WRONG: Both on same div (transforms conflict)
<div style={{
  left: '100px',
  transform: 'translateY(20px)'  // Conflicts with position transforms!
}}>
  <Text text="Hello" />
</div>

// ✅ CORRECT: Nested divs
<div style={{ left: '100px' }}>  {/* Outer: Position only */}
  <div style={{ transform: 'translateY(20px)' }}>  {/* Inner: Animation only */}
    <Text text="Hello" />
  </div>
</div>
```

---

### Full Documentation

See [`mid-scenes/README.md`](./src/sdk/mid-scenes/README.md) for:
- Detailed usage guide
- 15 future mid-scene ideas (learning video focused)
- Common issues & solutions
- Contributing guidelines

---

## 🎬 Animations

### Module: `animations.js`

**Basic animation utilities:**

```javascript
import { getSlideIn, getFadeIn, getScale } from '../sdk/animations';

// Slide in from direction
const slideIn = getSlideIn(frame, startFrame, duration, 'left', fps);
// Returns: { x, opacity }

// Fade in
const fadeIn = getFadeIn(frame, startFrame, duration, fps);
// Returns: { opacity }

// Scale animation
const scale = getScale(frame, startFrame, duration, fromScale, toScale, fps);
// Returns: { scale }
```

---

### Module: `microDelights.jsx`

**Sophisticated multi-layer animations:**

#### Card Entrance

```javascript
import { getCardEntrance } from '../sdk/microDelights';

const cardEntrance = getCardEntrance(frame, {
  startFrame: beats.start,
  duration: 0.7,          // Animation duration (seconds)
  direction: 'up',        // 'up', 'down', 'left', 'right'
  distance: 60,           // Slide distance (pixels)
  withGlow: true,         // Add glow effect
  glowColor: '#FF6B3540' // Glow color with opacity
}, fps);

// Returns: { opacity, scale, x, y, boxShadow }

<div style={{
  opacity: cardEntrance.opacity,
  transform: `translate(${cardEntrance.x}px, ${cardEntrance.y}px) scale(${cardEntrance.scale})`,
  boxShadow: cardEntrance.boxShadow
}}>
  {/* Content */}
</div>
```

#### Icon Pop

```javascript
import { getIconPop } from '../sdk/microDelights';

const iconPop = getIconPop(frame, {
  startFrame: beats.icon,
  duration: 0.5,
  withBounce: true,      // Add bounce effect
  rotationAmount: 15     // Degrees to rotate
}, fps);

// Returns: { opacity, scale, rotation }

<div style={{
  opacity: iconPop.opacity,
  transform: `scale(${iconPop.scale}) rotate(${iconPop.rotation}deg)`
}}>
  {icon}
</div>
```

#### Particle Burst

```javascript
import { getParticleBurst, renderParticleBurst } from '../sdk/microDelights';

const burstParticles = getParticleBurst(frame, {
  triggerFrame: beats.reveal,
  particleCount: 20,
  duration: 1.5,
  color: '#FF6B35',
  size: 10,
  spread: 150            // Spread radius (pixels)
}, fps);

// Render at position
{renderParticleBurst(burstParticles, centerX, centerY)}
```

#### Path Drawing

```javascript
import { getPathDraw } from '../sdk/microDelights';

const pathDraw = getPathDraw(frame, {
  startFrame: beats.connection,
  duration: 0.8,
  pathLength: 200        // Length of path
}, fps);

// Returns: { strokeDasharray, strokeDashoffset }

<line
  x1={x1} y1={y1} x2={x2} y2={y2}
  strokeDasharray={pathDraw.strokeDasharray}
  strokeDashoffset={pathDraw.strokeDashoffset}
/>
```

#### Pulse Glow

```javascript
import { getPulseGlow } from '../sdk/microDelights';

const glow = getPulseGlow(frame, {
  frequency: 0.04,       // Pulse speed
  intensity: 20,         // Glow size (pixels)
  color: '#FF6B3580',
  startFrame: beats.start
});

// Returns: { boxShadow }
```

---

### Module: `broadcastAnimations.ts`

**Broadcast-quality entrance/exit animations:**

```javascript
import {
  getSpringEntrance,
  getFloatIn,
  getRevealWipe,
  getTypewriterReveal
} from '../sdk/broadcastAnimations';

// Spring bounce entrance
const spring = getSpringEntrance(frame, startFrame, duration, fps);
// Returns: { opacity, scale, y }

// Float in with drift
const float = getFloatIn(frame, startFrame, duration, fps);
// Returns: { opacity, y, rotation }

// Wipe reveal (left to right)
const wipe = getRevealWipe(frame, startFrame, duration, fps);
// Returns: { clipPath, opacity }

// Typewriter text reveal
const typewriter = getTypewriterReveal(frame, startFrame, text, fps);
// Returns: { visibleText }
```

---

## ✨ Effects

### Module: `broadcastEffects.tsx`

**Professional visual effects:**

#### Glassmorphic Pane

```jsx
import { GlassmorphicPane } from '../sdk/broadcastEffects';

<GlassmorphicPane
  innerRadius={200}              // Border radius
  glowOpacity={0.25}            // Glow intensity
  borderOpacity={0.5}           // Border opacity
  backgroundColor="#FF6B3515"   // Background with opacity
  style={{
    width: 400,
    height: 400,
    borderRadius: '50%',
    border: `3px solid #FF6B35`
  }}
>
  {/* Content */}
</GlassmorphicPane>
```

#### Spotlight Effect

```jsx
import { SpotlightEffect } from '../sdk/broadcastEffects';

<SpotlightEffect
  x={50}                // X position (percentage)
  y={55}                // Y position (percentage)
  size={800}            // Spotlight size (pixels)
  color="#FF6B35"       // Spotlight color
  opacity={0.2}         // Opacity
/>
```

#### Noise Texture (Film Grain)

```jsx
import { NoiseTexture } from '../sdk/broadcastEffects';

<NoiseTexture opacity={0.03} />
```

#### Gradient Overlay

```jsx
import { GradientOverlay } from '../sdk/broadcastEffects';

<GradientOverlay
  colors={['#1A1A1ADD', '#1A1A1A']}
  direction="radial"    // "radial" or "linear"
  center={{ x: 50, y: 50 }}
/>
```

---

### Module: `effects/resolveBackground.tsx`

Central helper for scene backgrounds; turns simple JSON presets into styled fills + overlays.

```javascript
import { resolveBackground } from '../sdk/effects/resolveBackground';

const { style, overlay } = resolveBackground({
  preset: 'spotlight',
  spotlight: { x: 40, y: 60, intensity: 0.35 },
  layerNoise: true,
});
```

**Presets supported:**
- `notebookSoft` – lined paper overlay
- `sunriseGradient` – warm diagonal gradient
- `cleanCard` – neutral panel
- `chalkboardGradient` – deep green/blue gradient
- `spotlight` – animated vignette (customizable focus)
- `custom` – direct CSS style

Set `layerNoise: true` to add a subtle `NoiseTexture` on any preset. `SceneFromConfig` (see compositions) consumes this helper automatically.

---

### Module: `particleSystem.jsx`

**Ambient and burst particle effects:**

```javascript
import {
  generateAmbientParticles,
  renderAmbientParticles,
  generateBurstParticles
} from '../sdk/particleSystem';

// Generate ambient particles (once, outside render)
const ambientParticles = generateAmbientParticles({
  count: 20,
  seed: 142,              // For consistent randomness
  style: 'ambient',       // 'ambient', 'flow', 'orbit'
  color: '#4ECDC4',
  bounds: { w: 1920, h: 1080 }
});

// Render in component
<svg style={{ position: 'absolute', width: '100%', height: '100%' }}>
  {renderAmbientParticles(ambientParticles, frame, fps, { opacity: 0.4 })}
</svg>

// Burst particles (on events)
const burstParticles = generateBurstParticles({
  count: 30,
  origin: { x: 960, y: 540 },
  speed: 5,
  spread: 150,
  color: '#FF6B35'
});
```

---

### Module: `handwritingEffects.jsx`

**Hand-drawn and sketch effects:**

```javascript
import {
  getHandDrawnPath,
  getSketchEffect,
  getWriteOnAnimation
} from '../sdk/handwritingEffects';

// Animated hand-drawn line
const handDrawn = getHandDrawnPath(frame, {
  startFrame: beats.draw,
  duration: 1.0,
  roughness: 2,          // 0-5, higher = more rough
  path: 'M 0,0 L 100,100'
}, fps);

// Sketch fill effect
const sketch = getSketchEffect(color, opacity, roughness);
// Returns: { fill, stroke, strokeWidth }

// Write-on animation for text
const writeOn = getWriteOnAnimation(frame, startFrame, duration, fps);
// Returns: { clipPath }
```

---

### Module: `lottieIntegration.tsx`

**Lottie animation integration:**

```jsx
import { AnimatedLottie } from '../sdk/lottieIntegration';
import { getLottiePreset } from '../sdk/lottiePresets';

<AnimatedLottie
  animationData={getLottiePreset('arrowFlow')?.data}
  loop={true}
  autoplay={true}
  speed={1.0}
  style={{ width: 60, height: 60 }}
/>
```

**Available presets:**
- `arrowFlow` - Animated flowing arrow
- `arrowBounce` - Bouncing arrow
- `successCheck` - Checkmark animation
- `celebrationCheck` - Confetti checkmark
- `loadingDots` - Loading indicator
- `starBurst` - Star explosion

---

### Module: `lottie/registry.ts`

URL-based Lottie animation registry—single source of truth for all animations.

```javascript
import { resolveLottieRef, getAvailableLottieKeys, searchLottieByTag } from '../sdk/lottie/registry';

// Resolve a registry key to URL
const entry = resolveLottieRef('lightbulb');
// { url: 'https://...', description: 'Idea lightbulb turning on', loop: false, tags: [...] }

// Get all available keys
const keys = getAvailableLottieKeys();
// ['success', 'checkmark', 'loading', 'confetti', 'lightbulb', ...]

// Search by tag
const educationLotties = searchLottieByTag('education');
// ['lightbulb', 'thinking', 'question', 'brain', 'book']
```

Features:
- URL-based registry (no bundled JSON files)
- ~40 curated animations across categories: UI, celebrations, education, characters, science, etc.
- Tag-based search for discovery
- Dev-only warning when a key is missing

### Module: `lottie/lottiePresets.js`

Template-facing presets that map semantic names (`correctAnswer`, `insight`, `stepComplete`) to registry keys plus playback styles. Use `getLottiePreset(presetName)` to retrieve the config and pass it to `RemotionLottie` helpers.

---

## 📐 Layout

### Module: `layoutEngine.js` (Unified Layout Engine)

**The unified layout engine provides a single, consistent API for all positioning needs.**

#### Core API: `calculateItemPositions()`

**Single function for all 7 arrangement types:**

```javascript
import {
  ARRANGEMENT_TYPES,
  calculateItemPositions,
  positionToCSS,
  validateLayout,
  createLayoutAreas
} from '../sdk/layout/layoutEngine';

// Unified API - works for all arrangement types
const positions = calculateItemPositions(items, {
  arrangement: ARRANGEMENT_TYPES.GRID,  // See all types below
  viewport: { width: 1920, height: 1080 },
  area: { left: 100, top: 200, width: 1720, height: 680 }, // Optional content area
  // ... arrangement-specific options
});
```

**Returns:** Array of position objects with center coordinates:
```javascript
[
  { x: 960, y: 540, width: 500, height: 200, row: 0, column: 0 },
  { x: 1460, y: 540, width: 500, height: 200, row: 0, column: 1 },
  // ...
]
```

**Note:** Positions use **center coordinates** (x, y). Use `positionToCSS()` to convert to CSS-ready format.

---

#### All 7 Arrangement Types

##### 1. GRID - Grid layout with columns

```javascript
const positions = calculateItemPositions(items, {
  arrangement: ARRANGEMENT_TYPES.GRID,
  columns: 3,
  gap: 50,                    // Gap between items (or use columnSpacing/rowSpacing)
  itemWidth: 500,
  itemHeight: 200,
  centerGrid: true,           // Center grid in area
  viewport: { width: 1920, height: 1080 },
  area: { left: 100, top: 200, width: 1720, height: 680 } // Optional
});
// Returns: [{ x, y, width, height, row, column }, ...]
```

##### 2. STACKED_VERTICAL - Vertical stack

```javascript
const positions = calculateItemPositions(items, {
  arrangement: ARRANGEMENT_TYPES.STACKED_VERTICAL,
  spacing: 80,                // Vertical spacing between items
  basePosition: 'center',     // 'center', 'top', 'bottom'
  viewport: { width: 1920, height: 1080 }
});
// Returns: [{ x, y }, ...]
```

##### 3. STACKED_HORIZONTAL - Horizontal stack

```javascript
const positions = calculateItemPositions(items, {
  arrangement: ARRANGEMENT_TYPES.STACKED_HORIZONTAL,
  spacing: 100,               // Horizontal spacing
  basePosition: 'center',
  viewport: { width: 1920, height: 1080 }
});
// Returns: [{ x, y }, ...]
```

##### 4. CIRCULAR - Circular (hub-and-spoke) layout

```javascript
const positions = calculateItemPositions(items, {
  arrangement: ARRANGEMENT_TYPES.CIRCULAR,
  radius: 300,                // Distance from center
  startAngle: 0,              // Starting angle (degrees)
  viewport: { width: 1920, height: 1080 }
});
// Returns: [{ x, y, angle }, ...]
```

##### 5. RADIAL - Radial (spiral) layout

```javascript
const positions = calculateItemPositions(items, {
  arrangement: ARRANGEMENT_TYPES.RADIAL,
  startRadius: 100,           // Starting radius
  radiusIncrement: 150,       // Radius increase per item
  angleIncrement: 45,         // Angle increase per item (degrees)
  viewport: { width: 1920, height: 1080 }
});
// Returns: [{ x, y, radius, angle }, ...]
```

##### 6. CASCADE - Cascading diagonal layout

```javascript
const positions = calculateItemPositions(items, {
  arrangement: ARRANGEMENT_TYPES.CASCADE,
  offsetX: 50,                // Horizontal offset per item
  offsetY: 50,                // Vertical offset per item
  basePosition: 'center',
  viewport: { width: 1920, height: 1080 }
});
// Returns: [{ x, y }, ...]
```

##### 7. CENTERED - All items at same center

```javascript
const positions = calculateItemPositions(items, {
  arrangement: ARRANGEMENT_TYPES.CENTERED,
  viewport: { width: 1920, height: 1080 }
});
// Returns: [{ x, y }, ...] (all same coordinates)
```

---

#### Position Utilities

**Convert center coordinates to CSS-ready format:**

```javascript
import { positionToCSS, positionToTopLeft, positionsToTopLeft } from '../sdk/layout/layoutEngine';

// Convert single position to CSS style object
const position = { x: 960, y: 540, width: 500, height: 200 };
const cssStyle = positionToCSS(position);
// Returns: { position: 'absolute', left: '710px', top: '440px', width: '500px', height: '200px' }

// Use in JSX
<div style={positionToCSS(position)}>
  {/* Content */}
</div>

// Convert to top-left coordinates (keeps original center coords)
const topLeft = positionToTopLeft(position);
// Returns: { left: 710, top: 440, centerX: 960, centerY: 540, width: 500, height: 200 }

// Convert array of positions
const topLeftPositions = positionsToTopLeft(positions);
```

**Why center coordinates?**
- Easier to center items
- Simpler collision detection
- Consistent API across all arrangement types
- Convert to CSS when needed with `positionToCSS()`

---

#### Collision Detection & Validation

**Enable collision detection in layout calculation:**

```javascript
const result = calculateItemPositions(items, {
  arrangement: ARRANGEMENT_TYPES.GRID,
  columns: 3,
  itemWidth: 500,
  itemHeight: 200,
  enableCollisionDetection: true,  // Enable collision detection
  minSpacing: 20,                   // Minimum spacing between items
  viewport: { width: 1920, height: 1080 }
});

// Returns: { positions: [...], valid: boolean, warnings: [], errors: [] }
```

**Validate layout manually:**

```javascript
import { validateLayout } from '../sdk/layout/layoutEngine';

const validation = validateLayout(positions, viewport, {
  checkBounds: true,        // Check if items exceed viewport
  checkCollisions: true     // Check for overlapping items
});

if (!validation.valid) {
  console.error('Layout errors:', validation.errors);
  console.warn('Layout warnings:', validation.warnings);
}

// Returns: { valid: boolean, errors: [], warnings: [] }
```

**Validation errors include:**
- Bounds violations (items outside viewport)
- Collisions (overlapping items)
- Spacing violations (items too close)

---

#### Layout Areas

**Create title-safe and content areas:**

```javascript
import { createLayoutAreas } from '../sdk/layout/layoutEngine';

const areas = createLayoutAreas({
  viewport: { width: 1920, height: 1080 },
  padding: 60,              // Page padding
  titleHeight: 150,          // Space for title
  footerHeight: 100          // Space for footer
});

// Returns:
// {
//   title: { left, top, width, height },
//   content: { left, top, width, height },
//   footer: { left, top, width, height },
//   full: { left, top, width, height }
// }

// Use content area for layout
const positions = calculateItemPositions(items, {
  arrangement: ARRANGEMENT_TYPES.GRID,
  area: areas.content,      // Constrain to content area
  columns: 3
});
```

---

#### Safe Positioning Utilities

**Find safe positions avoiding collisions:**

```javascript
import { findSafePosition, calculateSafeLayout } from '../sdk/layout/layoutEngine';

// Find safe position for single element
const safePos = findSafePosition(
  { width: 200, height: 200 },
  existingElements,
  {
    viewport: { width: 1920, height: 1080 },
    preferredX: 960,
    preferredY: 540,
    minSpacing: 20
  }
);
// Returns: { x, y } - safe position avoiding collisions

// Calculate safe layout for multiple elements
const safeLayout = calculateSafeLayout(elements, {
  viewport: { width: 1920, height: 1080 },
  minSpacing: 20,
  strategy: 'spread'  // 'spread', 'compact', 'grid'
});
// Returns: Array of adjusted positions
```

---

#### Complete Example

```javascript
import { useMemo } from 'react';
import { AbsoluteFill } from 'remotion';
import {
  ARRANGEMENT_TYPES,
  calculateItemPositions,
  positionToCSS,
  validateLayout,
  createLayoutAreas
} from '../sdk/layout/layoutEngine';

export const GridScene = ({ items }) => {
  const viewport = { width: 1920, height: 1080 };
  
  // Create layout areas
  const areas = useMemo(() => createLayoutAreas({
    viewport,
    padding: 60,
    titleHeight: 150
  }), []);
  
  // Calculate positions
  const result = useMemo(() => calculateItemPositions(items, {
    arrangement: ARRANGEMENT_TYPES.GRID,
    area: areas.content,
    columns: 3,
    gap: 50,
    itemWidth: 500,
    itemHeight: 200,
    centerGrid: true,
    enableCollisionDetection: true,
    minSpacing: 20,
    viewport
  }), [items, areas.content]);
  
  const positions = result.positions || result;
  
  // Validate layout
  const validation = useMemo(() => validateLayout(positions, viewport), [positions]);
  
  return (
    <AbsoluteFill>
      {positions.map((pos, index) => (
        <div
          key={index}
          style={{
            ...positionToCSS(pos),  // Convert to CSS-ready format
            backgroundColor: '#FFF',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {items[index].label}
        </div>
      ))}
      
      {!validation.valid && (
        <div>Layout errors: {validation.errors.length}</div>
      )}
    </AbsoluteFill>
  );
};
```

---

#### Legacy Modules (Low Priority)

**`positionSystem.js`** - Legacy 9-point grid system (still used internally, low priority)

```javascript
import { resolvePosition } from '../sdk/layout/positionSystem';

const { x, y } = resolvePosition('centerRight', {
  width: 1920,
  height: 1080,
  offset: { x: 100, y: 0 }
});
// Available: topLeft, topCenter, topRight, centerLeft, center, centerRight, bottomLeft, bottomCenter, bottomRight
```

**Note:** The unified `layoutEngine.js` is the canonical layout system. All new code should use `calculateItemPositions()`.

---

## 🎞️ Scene Rendering Helpers

### Module: `compositions/SceneRenderer.jsx`

Utilities for turning JSON scene configs into rendered shots with consistent transitions.

```jsx
import {
  SceneFromConfig,
  SceneTransitionWrapper,
} from '../compositions/SceneRenderer';

const Scene = ({ config, durationInFrames }) => (
  <SceneTransitionWrapper
    durationInFrames={durationInFrames}
    transition={{ type: 'doodle-wipe' }}
  >
    <SceneFromConfig config={config} />
  </SceneTransitionWrapper>
);
```

- **`SceneFromConfig`**
  - Calls `resolveSceneSlots(layout, viewport)` to position header/body/columns.
  - Applies `resolveBackground` (including overlays/noise) if `config.background` is provided.
  - For each slot: renders the requested mid-scene with `stylePreset` + `config`.

- **`SceneTransitionWrapper`**
  - Accepts `transition.type`: `fade`, `slide`, `page-turn`, `doodle-wipe`, or `eraser`.
  - `durationInFrames` controls both enter + exit easing windows.
  - Slide/page-turn respect `transition.direction` (`left/right/up/down`).

Use these helpers for any multi-scene composition so transitions stay consistent with beats and layouts.

---

## ✅ Validation

### Module: `scene-validator.js`

**Scene JSON validation:**

```javascript
import { validateScene, validateSceneSchema } from '../sdk/scene-validator';

// Validate complete scene
const result = validateScene(sceneJSON);
if (!result.valid) {
  console.error('Validation errors:', result.errors);
}

// Returns: { valid: boolean, errors: [], warnings: [], scene: {...} }
```

---

### Module: `scene.schema.ts`

**Zod schema for type-safe validation:**

```javascript
import { SceneSchema, detectSchemaVersion } from '../sdk/scene.schema';

// Parse and validate
const scene = SceneSchema.parse(rawJSON);

// Detect version
const version = detectSchemaVersion(sceneJSON);
// Returns: "5.0", "5.1", "6.0", or "unknown"
```

---

### Module: `sceneCompatibility.js`

**Handle multiple schema versions:**

```javascript
import {
  migrateScene,
  isLegacyScene,
  normalizeScene
} from '../sdk/sceneCompatibility';

// Auto-migrate v5.0 → v6.0
const migratedScene = migrateScene(legacyScene);

// Check if legacy
if (isLegacyScene(scene)) {
  // Handle old format
}

// Normalize to current format
const normalized = normalizeScene(scene);
```

---

## 🎨 Utilities

### Module: `time.ts`

**Time conversion utilities:**

```javascript
import { toFrames, toSeconds } from '../sdk/time';

// Convert seconds to frames
const frames = toFrames(5.5, 30);  // 165 frames at 30fps

// Convert frames to seconds
const seconds = toSeconds(165, 30); // 5.5 seconds
```

---

### Module: `utils/beats.ts`

Deterministic beat resolver to keep `start`, `hold`, `exit`, and `emphasis` timings consistent across mid-scenes.

```javascript
import { resolveBeats } from '../sdk/utils/beats';

const beats = resolveBeats(
  { start: 1.2, emphasis: 1.5 },           // overrides
  { start: 0.8, holdDuration: 1.8, exitOffset: 0.4 } // defaults
);
// => { start: 1.2, hold: 3.0, exit: 3.4, emphasis: 1.5 }
```

Use the helper at both scene level and per-item level to avoid overlapping exits with transitions. Defaults favour a 0.5s delay, ~1.6s hold, and 0.3s exit buffer unless overridden.

---

### Module: `easing.ts`

**Easing functions:**

```javascript
import { EZ, getEasing } from '../sdk/easing';

// Pre-defined easings
const easeOut = EZ.easeOutCubic(progress);  // 0-1 input
const easeInOut = EZ.easeInOutQuad(progress);
const elastic = EZ.elasticOut(progress);

// Get easing by name
const easingFunc = getEasing('easeOutCubic');
```

**Available easings:**
- `linear` - No easing
- `easeInQuad`, `easeOutQuad`, `easeInOutQuad`
- `easeInCubic`, `easeOutCubic`, `easeInOutCubic`
- `easeInQuart`, `easeOutQuart`, `easeInOutQuart`
- `elasticOut`, `bounceOut`
- `spring` - Spring physics

---

### Module: `typography.ts`

**Typography tokens and utilities:**

```javascript
import { getFontTokens, getLineHeight } from '../sdk/typography';

// Get font system
const fonts = getFontTokens('modern');  // 'modern', 'classic', 'bold'

// Calculate line height
const lineHeight = getLineHeight(fontSize, style);  // 'tight', 'normal', 'relaxed'
```

---

### Module: `fontSystem.ts`

**Font loading and management:**

```javascript
import { loadFont, getFontFamily } from '../sdk/fontSystem';

// Load custom font
await loadFont('Inter', '/fonts/Inter.woff2');

// Get font family with fallbacks
const fontFamily = getFontFamily('Inter');
// Returns: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
```

---

### Module: `heroRegistry.jsx`

**Polymorphic hero visual rendering:**

```javascript
import { renderHero } from '../sdk/heroRegistry';

// Render any type of hero visual
<div style={{ width: 400, height: 400 }}>
  {renderHero({
    type: 'image',         // 'image', 'svg', 'roughSVG', 'lottie', 'custom'
    asset: 'https://...',  // URL or data
    entrance: 'fadeIn',    // Animation type
    frame,
    startFrame: beats.hero,
    duration: 1.5,
    fps
  })}
</div>
```

---

### Module: `questionRenderer.js`

**Dynamic multi-line text rendering:**

```javascript
import { renderQuestionLines } from '../sdk/questionRenderer';

renderQuestionLines({
  lines: [
    { text: 'Line 1', emphasis: 'normal' },
    { text: 'Line 2', emphasis: 'high' }
  ],
  config: {
    baseY: 400,
    spacing: 80,
    staggerDelay: 0.3
  },
  colors: { text: '#FFF', emphasis: '#FF6B35' },
  fonts: { size_question: 84, weight: 700 },
  frame,
  beats: { question: 2.0 },
  fps
})
```

---

### Module: `components.jsx`

**Reusable UI components:**

```jsx
import {
  TextBox,
  CircleBadge,
  AnimatedNumber,
  ProgressBar
} from '../sdk/components';

// Text box with styling
<TextBox
  text="Hello"
  color="#FF6B35"
  fontSize={48}
  fontWeight={700}
  maxWidth={400}
/>

// Circle badge
<CircleBadge
  size={200}
  color="#4ECDC4"
  icon="🎯"
  label="Step 1"
/>

// Animated counter
<AnimatedNumber
  value={42}
  startFrame={beats.reveal}
  duration={1.0}
  frame={frame}
  fps={fps}
/>

// Progress bar
<ProgressBar
  progress={0.75}      // 0-1
  color="#FF6B35"
  height={8}
  animated={true}
/>
```

---

## 💡 Usage Examples

### Example 1: Card with Entrance Animation

```jsx
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { getCardEntrance, toFrames } from '../sdk';

export const MyComponent = ({ config }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const cardAnim = getCardEntrance(frame, {
    startFrame: toFrames(2.0, fps),
    duration: 0.7,
    direction: 'up',
    distance: 60,
    withGlow: true,
    glowColor: '#FF6B3540'
  }, fps);
  
  return (
    <div style={{
      width: 400,
      height: 300,
      backgroundColor: '#FFF',
      borderRadius: 20,
      opacity: cardAnim.opacity,
      transform: `translateY(${cardAnim.y}px) scale(${cardAnim.scale})`,
      boxShadow: cardAnim.boxShadow
    }}>
      Content here
    </div>
  );
};
```

---

### Example 2: Hub-and-Spoke Layout with Particles

```jsx
import { calculateCircularLayout, generateAmbientParticles, renderAmbientParticles } from '../sdk';

export const ConceptBreakdown = ({ config }) => {
  const { parts } = config;
  
  // Calculate positions
  const positions = calculateCircularLayout({
    count: parts.length,
    radius: 420,
    centerX: 960,
    centerY: 540
  });
  
  // Generate particles once
  const particles = useMemo(() => 
    generateAmbientParticles({
      count: 20,
      seed: 142,
      color: '#4ECDC4',
      bounds: { w: 1920, h: 1080 }
    }), []);
  
  return (
    <AbsoluteFill>
      {/* Background particles */}
      <svg style={{ position: 'absolute', width: '100%', height: '100%' }}>
        {renderAmbientParticles(particles, frame, fps)}
      </svg>
      
      {/* Parts */}
      {parts.map((part, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: positions[i].x,
          top: positions[i].y
        }}>
          {part.label}
        </div>
      ))}
    </AbsoluteFill>
  );
};
```

---

### Example 3: Glassmorphic Card with Effects

```jsx
import { GlassmorphicPane, SpotlightEffect, NoiseTexture } from '../sdk/broadcastEffects';

export const StylizedCard = ({ config }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: config.colors.bg }}>
      {/* Background effects */}
      <SpotlightEffect
        x={50} y={50}
        size={800}
        color={config.colors.primary}
        opacity={0.2}
      />
      <NoiseTexture opacity={0.03} />
      
      {/* Card */}
      <GlassmorphicPane
        innerRadius={200}
        glowOpacity={0.25}
        backgroundColor={`${config.colors.primary}15`}
        style={{
          width: 400,
          height: 400,
          borderRadius: '50%',
          border: `3px solid ${config.colors.primary}`
        }}
      >
        <div className="flex flex-col items-center justify-center">
          {/* Content */}
        </div>
      </GlassmorphicPane>
    </AbsoluteFill>
  );
};
```

---

## 🤝 Contributing

### Adding New SDK Functions

1. **Create module file** in `/src/sdk/`
2. **Export from index.js:**
   ```javascript
   export * from './your-module';
   ```
3. **Document in SDK.md** (this file)
4. **Add tests** (when test framework available)
5. **Create usage examples**

### SDK Code Standards

**Function naming:**
- `get*` - Returns data/state (e.g., `getCardEntrance`)
- `render*` - Returns JSX (e.g., `renderHero`)
- `calculate*` - Performs calculation (e.g., `calculateLayout`)
- `validate*` - Validates input (e.g., `validateScene`)
- `generate*` - Creates new data (e.g., `generateParticles`)

**Parameter patterns:**
```javascript
// Animation functions
function getAnimation(frame, config, fps) {
  // frame: current frame number
  // config: { startFrame, duration, ...options }
  // fps: frames per second
}

// Render functions
function renderElement(props) {
  // props: { config, frame, fps, ...specifics }
}
```

**Return patterns:**
```javascript
// Animations return style objects
{ opacity, scale, x, y, rotation, boxShadow }

// Layouts return position arrays
[{ x, y, angle }, { x, y, angle }, ...]

// Validation returns result objects
{ valid: boolean, errors: [], warnings: [] }
```

---

## 🐛 Troubleshooting

**Import errors:**
- Ensure you're importing from the correct module
- Check that the function exists in `/src/sdk/index.js`
- Verify file extensions (.js, .jsx, .ts, .tsx)

**Animation not working:**
- Check `startFrame` is before current `frame`
- Verify `duration` is reasonable (0.3-2.0s typical)
- Ensure `fps` is passed correctly (usually 30)

**Layout issues:**
- Use collision detection to find overlaps
- Verify canvas bounds (1920x1080)
- Check margins leave enough space

**Performance:**
- Use `useMemo` for expensive calculations
- Generate particles once, not per frame
- Avoid complex filters on large elements

---

## 📚 Related Documentation

- **[TEMPLATES.md](./TEMPLATES.md)** - Template creation guide
- **[CONFIGURATION.md](./CONFIGURATION.md)** - Scene JSON configuration
- **[README.md](./README.md)** - Project overview

---

## 🧩 Element Library (NEW!)

### Module: `elements/`

**Location:** `/workspace/KnoMotion-Videos/src/sdk/elements/`

The Element Library provides **23 production-ready UI components** designed for Remotion with KNODE_THEME styling.

### Import Pattern

```javascript
// Import from single entry point
import { 
  Text, Button, Badge, Card, Progress,
  HeroWithText, CardWithIcon, StepCard 
} from '../sdk/elements';
```

### Atoms (14)

**Basic building blocks:**

1. **Text** - Typography with variants (display, title, body)
2. **Button** - Interactive buttons with states
3. **Badge** - Status indicators and labels
4. **Icon** - Emoji/icon display with animation support
5. **Progress** - Linear progress bars
6. **Card** - Container component with shadow
7. **Divider** - Visual separators
8. **Image** - Image display with aspect ratio control
9. **Avatar** - User avatars with status indicators
10. **Alert** - Notification boxes (success, warning, error, info)
11. **Loading** - Loading states (spinner, dots, ring)
12. **Skeleton** - Loading placeholders
13. **Rating** - Star ratings (interactive display)
14. **RadialProgress** - Circular progress indicators

**Example Usage:**

```javascript
import { Text, Button, Progress, Avatar } from '../sdk/elements';

// Text component
<Text 
  text="Hello World" 
  variant="title" 
  size="lg" 
  weight="bold"
  color="primary"
/>

// Progress bar
<Progress 
  value={75} 
  label="Loading..." 
  variant="primary" 
  size="md" 
/>

// Avatar with status
<Avatar 
  text="AB" 
  size="lg" 
  status="online" 
  ring={true}
/>
```

#### `ImageAtom` (Animated Static Images)

Location: `elements/atoms/Image.jsx`

```jsx
import { ImageAtom } from '../sdk/elements';

<ImageAtom
  src="https://cdn.knode/imgs/map.svg"
  alt="Knodovia map"
  fit="cover"              // cover | contain
  borderRadius={24}
  beats={{ start: 0.8 }}   // seconds
  animation={{ type: 'slide', duration: 0.5, direction: 'up' }}
/>
```

Supports `fade`, `slide`, and `zoom` entrances with beat-aware timing (`resolveBeats` friendly). Automatically fills its container and respects theme radius defaults—ideal for grid cards, side-by-side comparisons, or hero shots.

#### `Icon` with Animated Emoji

Location: `elements/atoms/Icon.jsx`

- Accepts emoji strings, React nodes, or registry icons.
- Detects if the emoji has an entry in `@remotion/animated-emoji`; renders animated assets automatically when available.
- Falls back to static emoji when the asset isn’t present (e.g., Remotion Player).

```jsx
import { Icon } from '../sdk/elements';

<Icon
  iconRef="🎯"
  size="lg"
  variant="primary"
  beats={{ start: 1.0 }}
/>
```

Behind the scenes it uses `getRemotionEnvironment()` to avoid Studio-only APIs in the player and caches emoji → asset lookups for performance.

### Compositions (9)

**Pre-built complex components:**

1. **HeroWithText** - Hero section with title and subtitle
2. **CardWithIcon** - Icon + title + description card
3. **CardWithBadge** - Card with badge overlay
4. **StepCard** - Numbered step display
5. **StatCard** - Statistics display with icon
6. **FeatureCard** - Feature showcase card
7. **TestimonialCard** - User testimonial display
8. **PricingCard** - Pricing tier display
9. **HeroWithCTA** - Hero section with call-to-action

**Example Usage:**

```javascript
import { HeroWithText, CardWithIcon, StepCard } from '../sdk/elements';

// Hero section
<HeroWithText
  title="Welcome to KnoMotion"
  subtitle="Create amazing videos in minutes"
  iconRef="🎓"
  variant="primary"
/>

// Feature card
<CardWithIcon
  iconRef="🚀"
  title="Fast Creation"
  text="Build professional videos in minutes"
  variant="primary"
/>

// Step card
<StepCard
  step={1}
  title="Import JSON"
  description="Load your scene configuration"
  variant="primary"
/>
```

### Standardized Prop Schema

All elements follow consistent naming:

- **Text content**: `text`, `title`, `subtitle`, `label`
- **Visual assets**: `iconRef`, `imageRef`, `lottieRef` (all use `*Ref` suffix)
- **Containers**: `children` (for complex markup)
- **Styling**: `variant`, `size`, `color`, `weight`
- **Animation**: `animation` (optional animation config)

### Theme Integration

All elements use `KNODE_THEME` tokens:

```javascript
import { KNODE_THEME } from '../sdk/theme/knodeTheme';

// Colors
theme.colors.pageBg      // #FFF9F0 (warm off-white)
theme.colors.cardBg      // #FFFFFF (pure white)
theme.colors.primary     // #FF6B35 (coral)
theme.colors.textMain    // #2C3E50 (dark)
theme.colors.textSoft    // #5D6D7E (gray)

// Fonts
theme.fonts.header       // Cabin Sketch
theme.fonts.marker       // Permanent Marker
theme.fonts.body         // Inter

// Spacing
theme.spacing.pagePadding   // 72
theme.spacing.cardPadding   // 20
theme.spacing.gapMd         // 24

// Shadows
theme.shadows.card       // 0 14px 30px rgba(0,0,0,0.08)
theme.shadows.soft       // 0 8px 18px rgba(0,0,0,0.05)
```

### Element Documentation

- **Rules**: `/src/sdk/elements/ELEMENT_RULES.md`
- **Schema**: `/src/sdk/elements/PROP_SCHEMA.md`
- **README**: `/src/sdk/elements/README.md`
- **Migration**: `/src/sdk/elements/MIGRATION_GUIDE.md`

---

## 🎨 Continuous Life Animations (ENHANCED!)

### Module: `animations/index.js`

**New continuous animation functions** for engaging visual effects:

#### 1. Breathing Animation
```javascript
import { getContinuousBreathing } from '../sdk/animations';

const breathing = getContinuousBreathing(frame, { 
  speed: 1.0,        // Animation speed multiplier
  intensity: 0.05    // Scale variance (0.95-1.05)
});
// Returns: { transform: 'scale(...)' }
```

#### 2. Floating Animation
```javascript
const floating = getContinuousFloating(frame, {
  speed: 0.8,
  distance: 15       // Vertical float distance (pixels)
});
// Returns: { transform: 'translateY(...)' }
```

#### 3. Rotation Animation
```javascript
const rotation = getContinuousRotation(frame, {
  speed: 0.5,        // Rotations per second
  direction: 'clockwise'  // or 'counterclockwise'
});
// Returns: { transform: 'rotate(...)' }
```

#### 4. Particle Trail Animation
```javascript
const particles = getParticleTrail(frame, {
  count: 5,
  speed: 1.0,
  colors: ['#FF6B35', '#F39C12'],
  path: 'circle'     // 'circle', 'spiral', 'line'
});
// Returns: Array of particle positions
```

#### 5. Shimmer Animation
```javascript
const shimmer = getContinuousShimmer(frame, {
  speed: 1.0,
  direction: 'right',  // 'left', 'right', 'up', 'down'
  color: '#FF6B35'
});
// Returns: { background: 'linear-gradient(...)' }
```

#### 6. Wobble Animation
```javascript
const wobble = getContinuousWobble(frame, {
  speed: 2.0,
  intensity: 5       // Rotation degrees
});
// Returns: { transform: 'rotate(...)' }
```

#### 7. Color Pulse Animation
```javascript
const colorPulse = getContinuousColorPulse(frame, {
  colors: ['#FF6B35', '#27AE60', '#F39C12'],
  speed: 0.5
});
// Returns: { backgroundColor: '...' }
```

#### 8. Bounce Animation
```javascript
const bounce = getContinuousBounce(frame, {
  speed: 1.5,
  height: 20         // Bounce height (pixels)
});
// Returns: { transform: 'translateY(...)' }
```

**All animations are:**
- ✅ **Deterministic** - Same frame = same result
- ✅ **Remotion-compatible** - No external dependencies
- ✅ **Performant** - Pure math, no side effects
- ✅ **Configurable** - Speed, intensity, colors customizable

---

## 🎬 KnoMotion Showcase

**Live SDK Reference**

The KnoMotion Showcase is a **3.5-minute video** demonstrating all SDK capabilities. It serves as:

1. **Canon** - Live codebase reference for all future development
2. **Discovery** - Comprehensive demonstration of all features
3. **Demo** - Professional presentation for stakeholders

### What's Showcased

- ✅ **23 Elements** (14 atoms, 9 compositions)
- ✅ **8 Continuous Animations** (breathing, floating, rotation, etc.)
- ✅ **4 Layout Types** (grid, radial, cascade, stack)
- ✅ **4-Layer Architecture** (SDK, Layout, Mid-Scene, JSON)
- ✅ **Theme System** (KNODE_THEME consistency)
- ✅ **Lottie Integration** (@remotion/lottie)

### Showcase Files

```
/src/compositions/
├── ShowcaseMain.jsx                    (Master composition)
├── ShowcaseScene1_IntroValueProp.jsx   (45s)
├── ShowcaseScene2_ArchitectureDeepDive.jsx (60s)
├── ShowcaseScene3_LayoutShowcase.jsx   (45s)
└── ShowcaseScene4_FeatureShowcaseCTA.jsx (60s)
```

### Preview Showcase

```bash
cd /workspace
npm run dev
# Open http://localhost:5173
# Click "Full Showcase (3.5 minutes)"
```

**Documentation**: `/workspace/SHOWCASE.md`

---

## 🎉 SDK Power (UPDATED!)

The SDK provides **everything you need** to build professional video templates:

- 🎬 **20+ animation functions** (8 new continuous life animations!)
- 🧩 **23 UI elements** (14 atoms + 9 compositions)
- ✨ **15+ visual effects**
- 📐 **Unified layout engine** (7 arrangement types: GRID, RADIAL, CASCADE, STACK, CIRCULAR, CENTERED)
- ✅ **Full validation suite**
- 🛠️ **30+ utilities**
- 🎨 **Complete theme system** (KNODE_THEME)
- 🎞️ **Lottie integration** (@remotion/lottie)

**Total: ~15,000 lines of production-ready code!**

### SDK Stats

| Category | Count | Status |
|----------|-------|--------|
| Elements | 23 | ✅ Production Ready |
| Animations | 20+ | ✅ Production Ready |
| Continuous Animations | 8 | ✅ NEW! |
| Layout Engine | 7 arrangement types | ✅ Unified & Production Ready |
| Visual Effects | 15+ | ✅ Production Ready |
| Utilities | 30+ | ✅ Production Ready |

**Showcase**: See `/workspace/SHOWCASE.md` for live demonstration of all capabilities!

**Happy building!** 🚀
