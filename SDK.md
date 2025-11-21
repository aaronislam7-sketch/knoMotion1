# 🛠️ SDK Reference

**Complete SDK framework reference for KnoMotion video templates**

---

## 📚 Table of Contents

1. [Overview](#overview)
2. [Core Modules](#core-modules)
3. [Animations](#animations)
4. [Effects](#effects)
5. [Layout](#layout)
6. [Validation](#validation)
7. [Utilities](#utilities)
8. [Usage Examples](#usage-examples)
9. [Contributing](#contributing)

---

## 🎯 Overview

The KnoMotion SDK is a **modular collection of utilities** for building video templates. It provides:

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

## 📐 Layout

### Module: `layoutEngine.js`

**Layout calculation utilities:**

```javascript
import {
  calculateCircularLayout,
  calculateGridLayout,
  calculateVerticalStack
} from '../sdk/layoutEngine';

// Circular (hub-and-spoke) layout
const positions = calculateCircularLayout({
  count: 6,              // Number of items
  radius: 420,           // Distance from center
  centerX: 960,
  centerY: 540,
  startAngle: 0,         // Start position (degrees)
  angleOffset: 60        // Degrees between items
});
// Returns: [{ x, y, angle }, ...]

// Grid layout
const grid = calculateGridLayout({
  count: 9,
  columns: 3,
  itemWidth: 240,
  itemHeight: 240,
  gap: 40,
  containerWidth: 1920,
  containerHeight: 1080
});
// Returns: [{ x, y, row, col }, ...]

// Vertical stack
const stack = calculateVerticalStack({
  count: 5,
  itemHeight: 120,
  gap: 30,
  startY: 200
});
// Returns: [{ y }, ...]
```

---

### Module: `positionSystem.js`

**9-point grid positioning system:**

```javascript
import { resolvePosition, getPositionCoordinates } from '../sdk/positionSystem';

// Resolve position token to coordinates
const { x, y } = resolvePosition('centerRight', {
  width: 1920,
  height: 1080,
  offset: { x: 100, y: 0 }
});

// Available positions:
// topLeft, topCenter, topRight
// centerLeft, center, centerRight
// bottomLeft, bottomCenter, bottomRight
```

---

### Module: `collision-detection.js`

**Layout validation and collision detection:**

```javascript
import {
  detectCollisions,
  checkBoundsViolations,
  validateLayout
} from '../sdk/collision-detection';

// Detect collisions between elements
const collisions = detectCollisions([
  { x: 100, y: 100, width: 200, height: 200, id: 'element1' },
  { x: 150, y: 150, width: 200, height: 200, id: 'element2' }
]);
// Returns: [{ element1: {...}, element2: {...}, overlap: 50 }]

// Check if elements exceed canvas bounds
const violations = checkBoundsViolations([
  { x: 1800, y: 100, width: 200, height: 100 }  // Exceeds right edge
], { width: 1920, height: 1080 });
// Returns: [{ element: {...}, violation: 'right', amount: 80 }]

// Validate entire layout
const validation = validateLayout({
  elements: [...],
  canvas: { width: 1920, height: 1080 },
  margins: { top: 80, right: 100, bottom: 60, left: 100 }
});
// Returns: { valid: boolean, errors: [], warnings: [] }
```

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
- 📐 **7 layout engines** (GRID, RADIAL, CASCADE, STACK, etc.)
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
| Layout Engines | 7 | ✅ Production Ready |
| Visual Effects | 15+ | ✅ Production Ready |
| Utilities | 30+ | ✅ Production Ready |

**Showcase**: See `/workspace/SHOWCASE.md` for live demonstration of all capabilities!

**Happy building!** 🚀
