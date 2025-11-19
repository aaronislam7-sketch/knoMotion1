# SDK Documentation

## Overview

The KnoMotion SDK provides a modular, consolidated set of utilities for building video templates. This refactored SDK structure minimizes duplication and provides clear, consistent APIs.

## Structure

```
src/sdk/
├── layout/              # Layout engine & positioning
│   ├── layoutEngine.js  # Main layout engine (consolidated)
│   ├── positionSystem.js # Token-based positioning
│   └── layout-resolver.js # Collision detection
├── animations/          # Animation utilities (consolidated)
│   └── index.js         # All animation helpers
├── elements/            # Low-level visual primitives
│   └── NotebookCard.jsx # Primary Knode card element
├── effects/             # Visual effects
│   ├── backgrounds.js   # SpotlightEffect, NoiseTexture, particles
│   ├── broadcastEffects.tsx # GlassmorphicPane, etc.
│   └── [other effects]  # connectingLines, flowLines, etc.
├── components/           # React components
│   └── mid-level/       # Mid-scene components
│       └── AppMosaic.jsx # Grid/mosaic layout component
├── core/                # Core utilities (easing, time, motion)
├── lottie/              # Lottie integration
├── validation/          # Scene validation
├── fonts/               # Font system
├── utils/               # Utilities
└── index.js             # Main SDK export
```

## Usage Patterns

### Layout → Animations → Element → Mid-level

The typical pattern for building scenes:

```javascript
import { 
  calculateItemPositions, 
  ARRANGEMENT_TYPES,
  fadeIn,
  slideIn,
  staggerIn,
  NotebookCard,
  AppMosaic
} from '../../sdk';

// 1. Calculate positions using layout engine
const positions = calculateItemPositions(items, {
  arrangement: ARRANGEMENT_TYPES.GRID,
  columns: 3,
  gap: 40,
  centerGrid: true,
  viewport: { width: 1920, height: 1080 }
});

// 2. Use animations for entrance effects
const animStyle = fadeIn(frame, startFrame, duration);

// 3. Use NotebookCard for visual elements
<NotebookCard
  label="Item Title"
  description="Item description"
  icon="🎯"
  color="#FF6B35"
/>

// 4. Use AppMosaic for mid-level composition
<AppMosaic
  items={items}
  positions={positions}
  layout={{ columns: 3, gap: 40 }}
  animations={{ entrance: 'fadeSlide', stagger: { enabled: true } }}
/>
```

## Module Reference

### Layout (`layout/layoutEngine.js`)

**Main Functions:**
- `calculateItemPositions(items, config)` - Calculate positions for items
- `createLayoutAreas(viewport, options)` - Create canvas areas (title, content, footer)
- `calculateBoundingBox(positions)` - Get bounding box for positions
- `scalePositionsToFit(positions, bounds)` - Scale positions to fit bounds
- `checkForOverlaps(items)` - Check for item overlaps
- `calculateStaggerDelays(itemCount, ...)` - Calculate stagger delays

**Arrangement Types:**
- `ARRANGEMENT_TYPES.STACKED_VERTICAL`
- `ARRANGEMENT_TYPES.STACKED_HORIZONTAL`
- `ARRANGEMENT_TYPES.GRID`
- `ARRANGEMENT_TYPES.CIRCULAR`
- `ARRANGEMENT_TYPES.RADIAL`
- `ARRANGEMENT_TYPES.CASCADE`
- `ARRANGEMENT_TYPES.CENTERED`

**Example:**
```javascript
import { calculateItemPositions, ARRANGEMENT_TYPES } from '../../sdk/layout/layoutEngine';

const positions = calculateItemPositions(items, {
  arrangement: ARRANGEMENT_TYPES.GRID,
  columns: 3,
  gap: 40,
  centerGrid: true
});
```

### Animations (`animations/index.js`)

**Core Animations:**
- `fadeIn(frame, startFrame, duration, delay)` - Fade in with scale
- `slideIn(frame, startFrame, duration, direction, distance)` - Slide from direction
- `scaleIn(frame, startFrame, duration, fromScale)` - Scale in
- `bounceIn(frame, startFrame, duration)` - Bounce entrance
- `fadeSlide(frame, startFrame, duration, direction, distance)` - Fade + slide
- `staggerIn(frame, startFrame, itemIndex, staggerDelay, duration)` - Staggered entrance

**Continuous Animations:**
- `getContinuousBreathing(frame, config)` - Subtle scale pulse
- `getContinuousFloating(frame, config)` - Subtle Y drift
- `getContinuousLife(frame, config)` - Combined breathing + floating

**Advanced Effects:**
- `getGlowEffect(frame, config)` - Animated glow
- `getLiquidBlob(frame, config)` - Liquid/blob animation
- `getMorphProgress(frame, config, fps)` - Shape morphing

**Example:**
```javascript
import { fadeIn, slideIn, staggerIn } from '../../sdk/animations';

// Single element
const style = fadeIn(frame, 0, 30);

// Staggered list
items.map((item, index) => {
  const progress = staggerIn(frame, 0, index, 5, 30);
  return <div style={{ opacity: progress }}>{item}</div>;
});
```

### Elements (`elements/NotebookCard.jsx`)

**NotebookCard** - Primary Knode card element with:
- Rounded corners, soft shadow
- Subtle off-white gradient background
- Optional icon, title, subtitle
- No animation logic (use animations separately)
- No layout math (use layout engine separately)

**Props:**
- `label` (string) - Card title
- `description` (string) - Card description
- `icon` (ReactNode) - Icon/emoji
- `color` (string) - Accent color override
- `styleTokens` (object) - Style token overrides
- `variant` ('default' | 'emphasis') - Card variant

**Example:**
```javascript
import { NotebookCard } from '../../sdk/elements/NotebookCard';

<NotebookCard
  label="Concept Name"
  description="Brief explanation"
  icon="🎯"
  color="#FF6B35"
  variant="default"
/>
```

### Effects (`effects/backgrounds.js`)

**Background Effects:**
- `SpotlightEffect` - Radial gradient spotlight
- `NoiseTexture` - Subtle noise overlay
- `generateAmbientParticles(count, seed, width, height)` - Generate particles
- `renderAmbientParticles(particles, frame, fps, colors)` - Render particles

**Example:**
```javascript
import { 
  SpotlightEffect, 
  NoiseTexture,
  generateAmbientParticles,
  renderAmbientParticles 
} from '../../sdk/effects/backgrounds';

// Generate particles
const particles = generateAmbientParticles(20, 42, 1920, 1080);

// In render:
<>
  <SpotlightEffect x={50} y={30} size={800} opacity={0.1} />
  <NoiseTexture opacity={0.04} />
  <svg>
    {renderAmbientParticles(particles, frame, fps, ['#FF6B35', '#9B59B6']).map(p => p.element)}
  </svg>
</>
```

### Components (`components/mid-level/AppMosaic.jsx`)

**AppMosaic** - Mid-level component for grid/mosaic layouts:
- Uses `calculateItemPositions` from layout engine
- Uses `NotebookCard` for visuals
- Uses animations SDK for entrance/stagger effects
- No duplicated layout/animation logic

**Props:**
- `items` (array) - Array of item objects
- `positions` (array) - Optional pre-calculated positions
- `layout` (object) - Layout config (columns, gap, itemSize, centerGrid)
- `animations` (object) - Animation config (entrance, duration, direction, stagger)
- `effects` (object) - Effect config (focusZoom, focusIndex)
- `startFrame` (number) - Start frame for animations
- `viewport` (object) - Viewport dimensions

**Example:**
```javascript
import { AppMosaic } from '../../sdk/components/mid-level/AppMosaic';

<AppMosaic
  items={items}
  positions={positions} // Optional - will calculate if not provided
  layout={{
    columns: 3,
    gap: 40,
    itemSize: 240,
    centerGrid: true
  }}
  animations={{
    entrance: 'fadeSlide',
    duration: 0.6,
    direction: 'up',
    stagger: { enabled: true, delay: 0.15 }
  }}
/>
```

## Migration Guide

### Old Imports → New Imports

**Animations:**
```javascript
// Old
import { fadeIn } from '../../sdk/animations/animations';
import { getContinuousLife } from '../../sdk/animations/continuousLife';

// New (all from one place)
import { fadeIn, getContinuousLife } from '../../sdk/animations';
// or
import { fadeIn, getContinuousLife } from '../../sdk';
```

**Effects:**
```javascript
// Old
import { SpotlightEffect, NoiseTexture } from '../../sdk/effects/broadcastEffects';
import { generateAmbientParticles } from '../../sdk/effects/particleSystem';

// New (consolidated)
import { 
  SpotlightEffect, 
  NoiseTexture,
  generateAmbientParticles 
} from '../../sdk/effects/backgrounds';
// or from main SDK
import { SpotlightEffect, NoiseTexture, generateAmbientParticles } from '../../sdk';
```

**Elements:**
```javascript
// Old
import { NotebookCard } from '../../sdk/elements/NotebookCard.tsx';

// New
import { NotebookCard } from '../../sdk/elements/NotebookCard';
// or
import { NotebookCard } from '../../sdk';
```

**Layout:**
```javascript
// Old
import { calculateItemPositions } from '../../sdk/layout/layoutEngineV2';

// New (layoutEngine.js is now the consolidated version)
import { calculateItemPositions } from '../../sdk/layout/layoutEngine';
// or
import { calculateItemPositions } from '../../sdk';
```

## Best Practices

1. **Use Layout Engine** - Don't duplicate layout math in components. Use `calculateItemPositions` instead.

2. **Use Centralized Animations** - Import from `animations/index.js` rather than inline animation logic.

3. **Separate Concerns** - Elements (NotebookCard) handle visuals, animations handle motion, layout handles positioning.

4. **Compose Mid-level Components** - Use AppMosaic and similar components that combine layout + animations + elements.

5. **Import from Main SDK** - For most use cases, import from `../../sdk` (the main index) for convenience.

## Legacy Files

Old/duplicate files have been moved to `sdk/legacy/`:
- `layoutEngine.js.old` - Old layout engine version
- `NotebookCard.tsx.old` - TypeScript version (now converted to JSX)

These are kept for reference but should not be imported in new code.
