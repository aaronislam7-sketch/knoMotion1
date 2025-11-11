# 🎨 Template Guide

**Complete guide to using and creating KnoMotion video templates**

---

## 📚 Table of Contents

1. [Template Catalog](#template-catalog)
2. [Template Selection Guide](#template-selection-guide)
3. [Using Templates](#using-templates)
4. [Creating New Templates](#creating-new-templates)
5. [Polish Standards](#polish-standards)
6. [Best Practices](#best-practices)

---

## 🎯 Template Catalog

### V6 Templates (17 Active)

#### Hook Templates (Capture Attention)

**Hook1A: Question Burst**
- **Purpose:** Provocative question with visual anchor
- **Duration:** 10-20s
- **Best for:** Lesson openers, sparking curiosity
- **Visual:** Large text question + hero visual (image/SVG/map)
- **Learning Intentions:** Hook, Apply, Micro-concept

**Hook1E: Ambient Mystery**
- **Purpose:** Atmospheric intrigue with fog effect
- **Duration:** 15-25s
- **Best for:** Building suspense, topic introduction
- **Visual:** Foggy overlay with emerging elements
- **Learning Intentions:** Hook, Story, Explore

---

#### Explain Templates (Teach Concepts)

**Explain2A: Concept Breakdown**
- **Purpose:** Hub-and-spoke concept diagram
- **Duration:** 30-60s
- **Best for:** Breaking down complex topics into parts
- **Visual:** Central concept + surrounding elements (2-8 parts)
- **Learning Intentions:** Explain, Hook, Micro-concept

**Explain2B: Analogy**
- **Purpose:** Side-by-side comparison/analogy
- **Duration:** 20-40s
- **Best for:** Making abstract concepts concrete
- **Visual:** Split-screen or sequential comparison
- **Learning Intentions:** Explain, Hook, Story

---

#### Apply Templates (Practice & Interaction)

**Apply3A: Micro Quiz**
- **Purpose:** Multiple choice knowledge check
- **Duration:** 12-30s
- **Best for:** Quick comprehension checks
- **Visual:** Question + 2-4 answer choices
- **Learning Intentions:** Apply, Hook, Challenge

**Apply3B: Scenario Choice**
- **Purpose:** Real-world decision scenario
- **Duration:** 20-40s
- **Best for:** Applying concepts to situations
- **Visual:** Scenario description + choice options
- **Learning Intentions:** Apply, Challenge, Explore

---

#### Reflect Templates (Consolidate Learning)

**Reflect4A: Key Takeaways**
- **Purpose:** Numbered summary list
- **Duration:** 15-30s
- **Best for:** Lesson conclusions, summaries
- **Visual:** 1-5 key points revealed sequentially
- **Learning Intentions:** Reflect, Explain, Micro-concept

**Reflect4D: Forward Link**
- **Purpose:** Bridge to next topic
- **Duration:** 8-15s
- **Best for:** Transitions between topics
- **Visual:** "Coming up next" preview
- **Learning Intentions:** Reflect, Transition, Motivate

---

#### Specialized Templates

**Reveal9: Progressive Unveil**
- **Purpose:** Layer-by-layer concept revelation
- **Duration:** 20-45s
- **Best for:** Complex multi-layer concepts
- **Visual:** Animated layers building on each other
- **Learning Intentions:** Explain, Hook, Explore

**Guide10: Step Sequence**
- **Purpose:** Linear step-by-step process
- **Duration:** 30-60s
- **Best for:** Procedural learning, tutorials
- **Visual:** Numbered steps with visual progression
- **Learning Intentions:** Explain, Apply, Micro-concept

**Compare11: Before/After**
- **Purpose:** Direct A vs B comparison
- **Duration:** 20-35s
- **Best for:** Showing change, contrast, transformation
- **Visual:** Split-screen or sequential reveal
- **Learning Intentions:** Explain, Hook, Story

**Compare12: Matrix Grid**
- **Purpose:** Multi-factor comparison grid
- **Duration:** 30-50s
- **Best for:** Feature comparisons, decision matrices
- **Visual:** Grid layout with multiple items/attributes
- **Learning Intentions:** Explain, Apply, Explore

**Challenge13: Poll Quiz**
- **Purpose:** Interactive poll or advanced quiz
- **Duration:** 20-60s
- **Best for:** Engagement, audience participation
- **Visual:** Poll question + live results visual
- **Learning Intentions:** Apply, Challenge, Motivate

**Spotlight14: Single Concept**
- **Purpose:** Deep dive on one idea
- **Duration:** 30-60s
- **Best for:** Focus on single important concept
- **Visual:** Centered, emphasized single element
- **Learning Intentions:** Explain, Micro-concept, Story

**Connect15: Analogy Bridge**
- **Purpose:** Connect two concepts via analogy
- **Duration:** 25-45s
- **Best for:** Making connections between ideas
- **Visual:** Two concepts connected with visual metaphor
- **Learning Intentions:** Explain, Story, Hook

**Quote16: Showcase**
- **Purpose:** Inspirational quote or key message
- **Duration:** 10-20s
- **Best for:** Motivation, emphasis, inspiration
- **Visual:** Large text with attribution
- **Learning Intentions:** Motivate, Hook, Reflect

**Progress18: Path**
- **Purpose:** Journey or milestone visualization
- **Duration:** 25-45s
- **Best for:** Showing progress, stages, timelines
- **Visual:** Path/timeline with markers
- **Learning Intentions:** Explain, Story, Motivate

---

## 🎯 Template Selection Guide

### By Learning Intention

**Want to capture attention?** → Hook1A, Hook1E, Apply3A  
**Want to teach a concept?** → Explain2A, Explain2B, Guide10, Reveal9  
**Want to check understanding?** → Apply3A, Apply3B, Challenge13  
**Want to summarize?** → Reflect4A, Reflect4D, Quote16  
**Want to compare things?** → Compare11, Compare12, Explain2B  
**Want to motivate?** → Quote16, Progress18, Reflect4D

### By Duration

**Short (10-20s):** Hook1A, Reflect4D, Quote16  
**Medium (20-40s):** Explain2B, Apply3A, Compare11  
**Long (40-60s):** Explain2A, Guide10, Compare12

### By Content Type

**Questions:** Hook1A, Apply3A, Apply3B, Challenge13  
**Concepts:** Explain2A, Spotlight14, Connect15  
**Processes:** Guide10, Reveal9, Progress18  
**Comparisons:** Compare11, Compare12, Explain2B  
**Summaries:** Reflect4A, Reflect4D, Quote16

---

## 🎬 Using Templates

### Method 1: Visual Configuration (Recommended)

1. **Start dev server:**
   ```bash
   cd KnoMotion-Videos
   npm run dev
   ```

2. **Open Template Gallery:**
   - Click "🎛️ Template Gallery & Config" button
   - Browse template cards with descriptions

3. **Select template:**
   - Click on a template card
   - Preview loads automatically

4. **Configure:**
   - Use visual controls to adjust settings
   - See changes in real-time preview
   - Load example presets for inspiration

5. **Export:**
   - Click "Download JSON" when satisfied
   - Save to `/src/scenes/` folder
   - Use in production renders

### Method 2: Direct JSON (Power Users)

1. **Copy example scene:**
   ```bash
   cp src/scenes/examples/explain2a_example.json src/scenes/my_scene.json
   ```

2. **Edit JSON:**
   - Update `scene_id`, `template_id`
   - Modify content fields
   - Adjust colors, timing, layout

3. **Load in UI:**
   - Import in `UnifiedAdminConfig.jsx`
   - Select from scene dropdown

See **[CONFIGURATION.md](./CONFIGURATION.md)** for JSON schema details.

---

## 🛠️ Creating New Templates

### Prerequisites

- Understand React and Remotion basics
- Familiar with the SDK (see [SDK.md](./SDK.md))
- Read polish standards below

### Step 1: Create Template File

**File:** `/src/templates/YourTemplate_V6.jsx`

```jsx
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { toFrames } from '../sdk';

export const YourTemplate_V6 = ({ config }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Extract config with defaults
  const {
    title = { text: 'Title', offset: { y: 80 } },
    colors = { bg: '#1a1a1a', primary: '#FF6B35', text: '#FFFFFF' },
    beats = { title: 1.0, content: 2.5, exit: 15.0 },
    // ... other config
  } = config;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      {/* Your template content */}
    </AbsoluteFill>
  );
};

// Required: Duration calculation
export const getDuration = (config, fps = 30) => {
  const beats = config?.beats || { exit: 15.0 };
  return toFrames(beats.exit + 1.0, fps); // Exit time + padding
};
```

### Step 2: Define Config Schema

```jsx
export const DEFAULT_CONFIG = {
  title: {
    text: 'Your Title',
    size: 72,
    weight: 700,
    offset: { x: 0, y: 80 }
  },
  colors: {
    bg: '#1a1a1a',
    primary: '#FF6B35',
    secondary: '#4ECDC4',
    text: '#FFFFFF'
  },
  layout: {
    size: 420,
    spacing: 1.4
  },
  beats: {
    title: 1.0,
    content: 2.5,
    hold: 14.0,
    exit: 15.0
  }
};

export const CONFIG_SCHEMA = {
  title: {
    text: { type: 'text', label: 'Title Text' },
    size: { type: 'slider', label: 'Font Size', min: 48, max: 96, step: 4 },
    weight: { type: 'select', label: 'Weight', options: [400, 600, 700, 900] },
    offset: {
      x: { type: 'number', label: 'X Offset', min: -500, max: 500, step: 10 },
      y: { type: 'number', label: 'Y Offset', min: 0, max: 200, step: 10 }
    }
  },
  // ... rest of schema
};
```

### Step 3: Register Template

**File:** `/src/components/TemplateGallery.jsx`

```jsx
export const TEMPLATE_CATALOG = [
  // ... existing templates
  {
    id: 'YourTemplate_V6',
    name: 'Your Template Name',
    intentions: {
      primary: 'explain',    // or 'hook', 'apply', 'reflect'
      secondary: ['micro-concept']
    },
    description: 'Brief description of what this template does',
    color: '#FF6B35',
    version: 'v6.0',
    isNew: true,
    hasConfig: true,
    duration: '30-60s',
    bestFor: ['concept teaching', 'comparisons']
  }
];
```

**File:** `/src/templates/TemplateRouter.jsx`

```jsx
import { YourTemplate_V6, getDuration as getYourTemplateDuration } from './YourTemplate_V6';

export const V6_TEMPLATE_REGISTRY = {
  // ... existing templates
  'YourTemplate_V6': YourTemplate_V6
};

export const DURATION_REGISTRY = {
  // ... existing durations
  'YourTemplate_V6': getYourTemplateDuration
};
```

### Step 4: Create Example Scene

**File:** `/src/scenes/examples/your_template_example.json`

```json
{
  "schema_version": "6.0",
  "scene_id": "your_template_example",
  "template_id": "YourTemplate_V6",
  "title": {
    "text": "Example Title",
    "size": 72,
    "offset": { "y": 80 }
  },
  "colors": {
    "bg": "#1a1a1a",
    "primary": "#FF6B35",
    "text": "#FFFFFF"
  },
  "beats": {
    "title": 1.0,
    "content": 2.5,
    "exit": 15.0
  }
}
```

### Step 5: Integrate into Config UI

**File:** `/src/components/UnifiedAdminConfig.jsx`

Add scene import and registration:

```jsx
import yourTemplateExample from '../scenes/examples/your_template_example.json';

const DEFAULT_SCENES = {
  // ... existing scenes
  'YourTemplate_V6': yourTemplateExample
};
```

### Step 6: Test

```bash
npm run dev
# Open browser
# Select your template from gallery
# Verify preview loads correctly
# Test all config controls
```

---

## ✨ Polish Standards

### The "Not PowerPoint" Rule

Templates must look **broadcast quality**, not presentation slides.

**Required:**
- ✅ Glassmorphic effects (blur, transparency)
- ✅ Gradient backgrounds (not flat colors)
- ✅ Particle systems or ambient effects
- ✅ Sophisticated animations (multi-layer)
- ✅ Full screen usage (90-95% of 1920x1080)
- ✅ Professional typography

**Avoid:**
- ❌ Box-based layouts (rectangles with borders)
- ❌ Flat solid colors
- ❌ Simple fade-in/fade-out only
- ❌ Small elements with wasted space
- ❌ Generic bullet points

---

### Broadcast-Grade Polish Principles

**Learned from Compare11BeforeAfter_V6 Enhancement (Template #11)**

#### 1. **Layered Background Depth**
Instead of flat colors, create depth with multiple layers:

```jsx
// ❌ BAD: Flat color
style={{ backgroundColor: '#FFE5E5' }}

// ✅ GOOD: Gradient with depth
style={{ 
  background: `linear-gradient(135deg, 
    ${color}F0 0%,   // Slightly transparent at start
    ${color}CC 50%,  // More transparent in middle
    ${color}F0 100%  // Back to slightly transparent
  )`
}}
```

**Stack for depth:**
1. Base gradient background
2. Noise texture overlay (0.03-0.05 opacity)
3. Spotlight effects (2-3 strategically placed)
4. Ambient particles (20-30 floating)
5. Content with glassmorphic panes

#### 2. **Glassmorphic Content Cards** ⚠️ USE SELECTIVELY

Wrap content in glassmorphic panes **when it adds value**, not by default.

**✅ WHEN TO USE:**
- Content cards with multiple elements (image + text + description)
- Information panels that need visual containment
- Before/After comparison states
- Multi-item grids or lists where grouping helps comprehension
- When content needs separation from busy backgrounds

**❌ WHEN NOT TO USE:**
- Large, bold headline text (looks better clean and direct)
- Single questions or statements (glassmorphic panes add unnecessary weight)
- Minimal designs (defeats the purpose of minimalism)
- Templates where simplicity is the aesthetic (Hook templates, Quote templates)
- When it creates "PowerPoint slide" feeling

**Implementation (when appropriate):**
```jsx
import { GlassmorphicPane } from '../sdk/effects/broadcastEffects';

<GlassmorphicPane
  innerRadius={30}           // Rounded corners
  glowOpacity={0.2}          // Outer glow intensity
  borderOpacity={0.4}        // Border transparency
  backgroundColor="#FF6B3515" // Tinted glass color
  padding={40}
  style={{
    maxWidth: '85%',         // Don't fill entire space
    ...animations           // Apply entrance animations
  }}
>
  {/* Your content */}
</GlassmorphicPane>
```

**Key principles:**
- Add subtle glow (0.15-0.25 opacity) when using
- Use semi-transparent backgrounds (15-20% opacity of accent color)
- Add backdrop blur for true glass effect
- Include subtle inner highlight (inset shadow)
- **Always make it configurable:** `decorations.showGlassPane: true/false`

**Example - Question Burst Template:**
```jsx
// ❌ WRONG - Unnecessary boxing of bold question
<GlassmorphicPane>
  <div style={{ fontSize: 72, fontWeight: 800 }}>
    What if geography was measured in mindsets?
  </div>
</GlassmorphicPane>

// ✅ CORRECT - Bold text stands alone
<div style={{ fontSize: 72, fontWeight: 800 }}>
  What if geography was measured in mindsets?
</div>
```

#### 3. **Multi-Layered Entrance Animations**
Combine multiple animation types for sophistication:

```jsx
// ❌ BAD: Single fade-in
const anim = fadeIn(frame, startFrame, duration, fps);

// ✅ GOOD: Multi-layered card entrance
const cardAnim = getCardEntrance(frame, {
  startFrame: beats.reveal,
  duration: 1.0,
  direction: 'left',      // Slide direction
  distance: 120,          // Slide distance
  withGlow: true,         // Add glow pulse
  glowColor: '#FF6B3540'  // Glow color with opacity
}, fps);

// Layers included:
// 1. Opacity fade (0 → 1)
// 2. Slide motion (distance → 0)
// 3. Scale spring (0.95 → 1.0)
// 4. Box shadow glow (pulsing)
```

**Stagger for impact:**
- Main container: T+0.0s
- Icon/label: T+0.3s
- Headline: T+0.5s (or simultaneous with container)
- Description: T+0.5s (or simultaneous with container)

#### 4. **Micro-Delights on Key Elements**
Add small, delightful animations to draw attention:

**Icon Pop Animation:**
```jsx
const iconAnim = getIconPop(frame, {
  startFrame: beats.reveal + 0.3,
  duration: 0.6,
  withBounce: true,  // Spring bounce effect
  rotation: 15       // Slight rotation on entry
}, fps);

// Apply to icons, emojis, badges
<span style={{
  opacity: iconAnim.opacity,
  transform: `scale(${iconAnim.scale}) rotate(${iconAnim.rotation}deg)`
}}>
  ✨
</span>
```

**Letter-by-Letter Title Reveal:**
```jsx
const letterReveal = getLetterReveal(frame, titleText, {
  startFrame: beats.title,
  duration: 0.05,      // Per-letter duration
  staggerDelay: 0.05   // Delay between letters
}, fps);

{renderLetterReveal(letterReveal.letters, letterReveal.letterOpacities)}
```

#### 5. **Particle Bursts on Key Moments**
Emphasize transitions and reveals with particle effects:

```jsx
// Burst on transition/reveal
const burstParticles = getParticleBurst(frame, {
  triggerFrame: beats.transitionStart,
  particleCount: 20,
  duration: 1.2,
  color: colors.accent,
  size: 8,
  spread: 200  // Explosion radius
}, fps);

{transitionBurstParticles.length > 0 && renderParticleBurst(
  transitionBurstParticles,
  centerX,
  centerY
)}
```

**When to use:**
- On major reveals (after state appears)
- On emphasis moments (pulse effects)
- On completion (success states)

#### 6. **Pulsing Glow for Emphasis**
Add breathing life to emphasized elements:

```jsx
const pulseGlow = getPulseGlow(frame, {
  frequency: 0.08,      // Pulse speed (lower = slower)
  intensity: 30,        // Glow size variation
  color: `${colors.accent}60`,  // Semi-transparent color
  startFrame: beats.emphasize
});

<div style={{
  ...pulseGlow,  // Applies animated box-shadow
  transform: `scale(${pulseScale})`  // Combine with scale
}}>
  {content}
</div>
```

#### 7. **Doodle/Notebook Brand Elements**
Add hand-drawn, organic elements for Knode branding:

**Hand-drawn underlines:**
```jsx
<svg width="300" height="20" style={{ margin: '10px auto 0' }}>
  <path 
    d="M 10,10 Q 75,5 150,10 T 290,10"  // Wavy line
    stroke={colors.accent} 
    strokeWidth="3" 
    fill="none" 
    strokeLinecap="round"
    opacity="0.7"
  />
</svg>
```

**Decorative elements:**
- Hand-drawn arrows (→, ←, ↑, ↓)
- Sketchy circles/stars around key text
- Wavy underlines on titles
- Doodle icons (⚠️ for before, ✨ for after)

#### 8. **Enhanced Divider/Slider Effects**
Make interactive elements feel premium:

**Before:**
```jsx
// ❌ Simple line
<div style={{
  width: 4,
  height: '100%',
  backgroundColor: colors.divider
}} />
```

**After:**
```jsx
// ✅ Gradient line with glow
<div style={{
  width: 6,
  height: '100%',
  background: `linear-gradient(to right, 
    transparent,
    ${colors.divider}40,
    ${colors.divider},
    ${colors.divider}40,
    transparent
  )`,
  boxShadow: `
    0 0 ${glowIntensity}px ${colors.divider}80,
    0 0 40px rgba(0,0,0,0.3)
  `
}} />
```

**Glassmorphic handle:**
- Backdrop blur effect
- Border with color
- Multiple shadows (drop + glow + inner highlight)
- Animated icon inside

#### 9. **Performance Optimizations**
Maintain smooth 30fps with these practices:

```jsx
// Memoize expensive calculations
const particles = useMemo(() => 
  generateAmbientParticles(30, seed, width, height),
  [width, height]
);

// Cap particle counts
const safeCount = Math.min(config.particleCount, 50);

// Use CSS transforms (GPU accelerated)
transform: `translate(${x}px, ${y}px) scale(${s})`  // ✅ Good
left: x, top: y  // ❌ Bad (triggers layout)
```

#### 10. **Typography & Text Treatment**
Professional text styling throughout:

```jsx
// Titles
style={{
  fontSize: Math.min(config.size, 72),  // Cap to prevent overflow
  fontWeight: 900,
  textShadow: '3px 3px 6px rgba(0,0,0,0.3)',  // Depth
  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',  // Extra depth
  lineHeight: 1.3  // Breathing room
}}

// Body text
style={{
  fontSize: Math.min(config.size, 22),
  lineHeight: 1.6,  // Readability
  color: `${colors.text}CC`  // Slightly transparent for hierarchy
}}
```

#### 11. **Continuous Life Animations** ⭐ NEW

Add subtle continuous movement to prevent static moments, even during "hold" states:

```jsx
// Subtle sine wave floating (5px movement)
const floatingOffset = config.animation.continuousFloat 
  ? Math.sin((frame - startFrame) * 0.02) * 5 
  : 0;

// Apply to transforms
transform: `translate(${x}px, ${y + floatingOffset}px) scale(${scale})`
```

**Key principles:**
- **Frequency:** 0.02 for subtle, gentle movement (too high = distracting)
- **Amplitude:** 3-7px maximum (barely noticeable but adds life)
- **Phase shift:** Offset different elements (`+ Math.PI`) for variety
- **Configurable:** Always allow toggling via JSON (`continuousFloat: true/false`)
- **When:** Apply to main content cards, not small UI elements

**When to use:**
- Long hold moments (2+ seconds visible)
- Background elements throughout
- Main content panes

**When NOT to use:**
- During fast transitions
- On text (causes readability issues)
- On elements with their own complex animations

**Reference:** See `Compare11BeforeAfter_V6.jsx` (before/after card floating) for implementation.

---

#### 12. **Dynamic Array Timing** ⭐ NEW

When dealing with variable-length content arrays (e.g., 2-5 stages), calculate cumulative beats dynamically:

```jsx
const calculateCumulativeBeats = (beats, stageCount) => {
  const { entrance, titleEntry, stageHold, stageTransition } = beats;
  
  let cumulative = entrance + titleEntry;
  const result = { stages: [] };
  
  for (let i = 0; i < stageCount; i++) {
    result.stages.push({
      start: cumulative,
      end: (cumulative += stageHold + stageTransition)
    });
  }
  
  result.totalDuration = cumulative;
  return result;
};

// Usage
const beats = useMemo(() => 
  calculateCumulativeBeats(rawBeats, stages.length),
  [rawBeats, stages.length]
);
```

**Key principles:**
- **Memoize calculation:** Use `useMemo` with dependencies on beats config and array length
- **Loop through array:** Calculate each item's timing cumulatively
- **Return structured object:** Organized by item index for easy access
- **Handle first/last differently:** First stage might have longer reveal, last might skip transition
- **Total duration calculation:** Sum all stages for `getDuration` export

**When to use:**
- Multi-step sequences (reveal stages, tutorial steps)
- Dynamic content lists
- Progress-based animations
- Sequential unveiling

**Reference:** See `Reveal9ProgressiveUnveil_V6.jsx` (stage timing calculation) for implementation.

---

#### 13. **Persistent Stage Indicators** ⭐ NEW

Add corner indicators to show progress through multi-stage sequences:

```jsx
const stageIndicator = {
  show: true,
  position: 'top-right', // top-left, top-right, bottom-left, bottom-right
  style: 'both', // number, emoji, both
  size: 48
};

// Render with icon pop animation
<div style={{
  position: 'absolute',
  [position.includes('top') ? 'top' : 'bottom']: 30,
  [position.includes('left') ? 'left' : 'right']: 30,
  fontSize: stageIndicator.size,
  fontWeight: 900,
  opacity: iconPopAnim.opacity,
  transform: `scale(${iconPopAnim.scale})`,
  zIndex: 150
}}>
  {stage.emoji} Stage {index + 1}
</div>
```

**Key principles:**
- **Corner positioning:** Keep out of main content area (top-left/top-right/bottom corners)
- **Configurable visibility:** Always allow toggling via `show` boolean
- **Style options:** Number only, emoji only, or both combined
- **Pop entrance:** Use `getIconPop` for engaging appearance
- **Z-index layering:** Above content (150+) but below overlays
- **Size constraints:** 36-48px typically, never exceed 60px

**When to use:**
- Multi-stage reveals
- Tutorial sequences
- Progress tracking
- Chapter/section markers

**When NOT to use:**
- Single-stage templates
- When screen real estate is limited
- With central progress bars (redundant)

**Reference:** See `Reveal9ProgressiveUnveil_V6.jsx` (stage indicator) for implementation.

---

#### 14. **Curtain/Overlay Effects** ⭐ NEW

Full-screen reveal overlays with multiple styles and dynamic effects:

```jsx
const renderCurtainOverlay = (style, progress, colors, width, height, config) => {
  const ease = EZ.power3InOut(progress);
  const glowIntensity = interpolate(progress, [0, 0.5, 1], [0, 20, 0]);
  
  // Glow effect during reveal
  const boxShadow = config.curtainGlow 
    ? `inset 0 0 ${glowIntensity}px ${colors.accent}60`
    : 'none';
  
  switch (style) {
    case 'curtain':
      return (
        <div style={{
          /* Split curtain opening from center */
          background: `linear-gradient(to left, ${colors.curtain}, ${colors.curtain}F0)`,
          transform: `translateX(${leftX}px)`,
          boxShadow
        }} />
      );
    case 'circular':
      return (
        <div style={{
          background: `radial-gradient(circle, transparent ${scale * 30}%, ${colors.curtain} ${scale * 31}%)`,
          borderRadius: '50%'
        }} />
      );
  }
};
```

**Key principles:**
- **Gradient edges:** Use gradients instead of flat colors for depth
- **Glow during transition:** Add `boxShadow` glow that peaks mid-animation
- **Z-index 100:** Above all content but below UI controls
- **Easing:** Always use `power3InOut` for smooth, dramatic reveals
- **Multiple styles:** Offer 4-6 styles (curtain, fade, slide-left/right, zoom, circular)
- **Configurable color:** Curtain color should match or contrast with `bg`

**Available styles:**
- **Curtain:** Split from center (dramatic)
- **Fade:** Simple opacity (subtle)
- **Slide-left/right:** Directional wipe (guided)
- **Zoom:** Scale explosion (energetic)
- **Circular:** Radial expand (focus)

**When to use:**
- Progressive reveals
- Before/after transitions
- Mystery/suspense moments
- Chapter transitions

**Reference:** See `Reveal9ProgressiveUnveil_V6.jsx` (renderRevealOverlay) for implementation.

---

#### 15. **Per-Item Content Stagger** ⭐ NEW

Stagger multiple elements within a single content item for sophisticated reveals:

```jsx
const config = {
  animation: {
    staggerContent: true // Enable/disable stagger
  }
};

// Define delays
const headlineDelay = config.animation.staggerContent ? 0.0 : 0;
const descriptionDelay = config.animation.staggerContent ? 0.2 : 0;
const visualDelay = config.animation.staggerContent ? 0.4 : 0;

// Apply to each element
<div style={{
  opacity: interpolate(
    contentProgress,
    [descriptionDelay, descriptionDelay + 0.3],
    [0, 1],
    { extrapolateRight: 'clamp' }
  )
}}>
  {description}
</div>
```

**Key principles:**
- **0.2s intervals:** Standard stagger delay between elements
- **Configurable toggle:** Always allow disabling via `staggerContent: false`
- **Order matters:** Headline → Description → Visual (top to bottom)
- **Smooth fade range:** 0.3s fade duration per element (not instant)
- **Extrapolate clamp:** Prevent opacity going above 1 or below 0
- **Use single progress value:** All elements reference same `contentProgress`

**Typical stagger sequence:**
1. **Headline:** 0.0s (immediate)
2. **Description:** +0.2s
3. **Visual/Image:** +0.4s
4. **Supporting elements:** +0.6s

**When to use:**
- Multi-element content cards
- Information hierarchy (title first, then details)
- Rich content reveals (text + images)
- Educational content progression

**When NOT to use:**
- Single-element displays
- Fast-paced content (< 2s hold time)
- When all elements are equally important

**Reference:** See `Reveal9ProgressiveUnveil_V6.jsx` (stage content stagger) for implementation.

---

#### 16. **Pulsing Highlight Animations** ⭐ NEW

Add continuous pulsing to highlighted/winner elements for sustained visual emphasis:

```jsx
// Calculate pulse intensity (continuous sine wave)
const highlightPulse = config.animation.continuousPulse && highlightProgress > 0
  ? Math.sin((frame - highlightStartFrame) * 0.08) * 0.3 + 0.7
  : 1;

// Apply to glow intensity
const glowIntensity = isHighlighted ? 15 + (highlightPulse * 10) : 0;

// Apply to scale
transform: `scale(${1 + (highlightPulse * 0.02)})`

// Apply to box shadow
boxShadow: `0 0 ${glowIntensity}px ${colors.highlight}80`
```

**Key principles:**
- **Frequency: 0.08** for gentle pulsing (0.06-0.10 range, slower than float)
- **Amplitude: 0.3** centered around 0.7 (range 0.4 to 1.0, never fully off)
- **Additive not multiplicative:** Add pulse to base value (15 + pulse*10, not 15*pulse)
- **Multi-property:** Apply to both glow intensity AND scale for richness
- **Configurable:** Always allow toggling via `continuousPulse: boolean`
- **Only when active:** Start pulsing only after highlight is triggered

**Use cases:**
- Winner/highlighted columns in comparison grids
- Selected items in multi-choice scenarios
- Correct answers in quizzes
- Featured/recommended options
- Active/current step indicators

**When NOT to use:**
- On all elements (overwhelming, no focus)
- During transitions (conflicts with entrance/exit)
- With very small elements (< 50px, too subtle)
- When element already has complex animation

**Difference from Continuous Float:**
- **Float:** Position-based (translateY), for ambient life
- **Pulse:** Intensity-based (opacity/glow/scale), for emphasis/attention

**Reference:** See `Compare12MatrixGrid_V6.jsx` (winner column highlight pulse) for implementation.

---

### Complete Polish Checklist

**⚠️ IMPORTANT: These are a MENU, not a MANDATE!**

The principles below are **design options** to consider, not requirements to apply blindly to every element. Use design judgment:
- **Don't over-apply** - Not every text element needs a glassmorphic pane
- **Preserve template identity** - Simple, bold text can be more impactful than boxes
- **Avoid PowerPoint feel** - Too many boxes/cards = presentation slides
- **When in doubt, less is more** - Start minimal, add effects only where they enhance

When uplifting a template to broadcast-grade, ensure:

**Visual Layers (5 available, use 3-5):**
- [ ] Gradient background (not flat)
- [ ] Noise texture overlay
- [ ] Spotlight effects (2-3)
- [ ] Ambient particles (20-30)
- [ ] Glassmorphic content panes **WHERE APPROPRIATE**

**Animation Layers (3+ required):**
- [ ] Opacity fade
- [ ] Position animation (slide/scale)
- [ ] Spring/elastic easing
- [ ] Optional: Glow pulse
- [ ] Optional: Rotation

**Micro-Delights (2+ required):**
- [ ] Icon pop animations
- [ ] Letter-by-letter reveals
- [ ] Particle bursts on key moments
- [ ] Pulsing glow on emphasis
- [ ] Staggered entrance timing

**Brand Elements:**
- [ ] Doodle-style decorations
- [ ] Hand-drawn underlines/arrows
- [ ] Organic shapes (not boxes)
- [ ] Notebook-style typography

**Polish Details:**
- [ ] Font sizes capped with Math.min()
- [ ] Text shadows for depth
- [ ] Drop shadows on elements
- [ ] Semi-transparent overlays
- [ ] Breathing room (padding/margins)
- [ ] Color with opacity for hierarchy
- [ ] Continuous life animations (subtle floating during holds)
- [ ] Dynamic array timing (for variable-length content)
- [ ] Persistent stage indicators (corner progress markers)
- [ ] Curtain/overlay effects (full-screen reveals with glow)
- [ ] Per-item content stagger (headline → description → visual)
- [ ] Pulsing highlight animations (glow/scale for emphasis) ⭐ NEW

---

### Cumulative Beats System

**NEW: Relative timing makes adjustments easy!**

Instead of absolute timestamps, beats are now **cumulative durations** that add together:

**❌ OLD (Absolute Timing):**
```json
"beats": {
  "entrance": 0.4,
  "titleEntry": 0.6,      // Must manually calculate: 0.4 + 0.2
  "beforeReveal": 1.6,    // Must manually calculate: 0.6 + 1.0
  "transitionStart": 3.6  // Must manually calculate: 1.6 + 2.0
}
```
**Problem:** Changing `entrance` requires recalculating ALL subsequent beats!

**✅ NEW (Cumulative Timing):**
```json
"beats": {
  "entrance": 0.4,       // Start at 0.4s
  "titleEntry": 0.2,     // +0.2s (appears at 0.6s)
  "titleHold": 0.8,      // +0.8s (holds until 1.4s) 
  "beforeReveal": 1.0,   // +1.0s (appears at 2.4s)
  "beforeHold": 2.0,     // +2.0s (holds until 4.4s)
  "transitionDuration": 2.0  // +2.0s (completes at 6.4s)
}
```
**Benefit:** Change `entrance` to `0.8s` and everything shifts automatically!

**Implementation:**
```jsx
// In template file
const calculateCumulativeBeats = (beats) => {
  let cumulative = 0;
  return {
    entrance: cumulative,
    title: (cumulative += beats.entrance),
    titleEnd: (cumulative += beats.titleEntry + beats.titleHold),
    beforeStart: (cumulative = cumulative - beats.titleHold + beats.beforeReveal),
    // ... etc
    totalDuration: cumulative
  };
};

// Use in component
const rawBeats = config.beats;  // From JSON
const beats = calculateCumulativeBeats(rawBeats);  // Absolute timestamps

// Apply to animations
const titleStartFrame = toFrames(beats.title, fps);
const beforeStartFrame = toFrames(beats.beforeStart, fps);
```

**Benefits:**
- ✅ Easy to adjust timing without recalculating
- ✅ Clear duration for each segment
- ✅ Automatic total duration calculation
- ✅ JSON configs are more intuitive

---

### Screen Real Estate Usage

**Target: 90-95% of 1920x1080 canvas**

```javascript
// Calculate safe area
const safeWidth = 1920 - (marginLeft + marginRight);   // e.g., 1720px
const safeHeight = 1080 - (titleHeight + margins);     // e.g., 780px

// Size elements boldly
const elementSize = 200-260px;   // Not 120-140px
const radius = 400-450px;        // Not 300-350px
```

**Margins:**
- Top: 70-80px (title clearance)
- Bottom: 40-60px
- Sides: 80-100px

### Uniform Sizing Enforcement

All elements must have enforced, uniform sizes:

```jsx
<div style={{
  width: size,
  height: size,
  minWidth: size,      // Enforce minimum
  minHeight: size,     // Enforce minimum
  borderRadius: '50%', // Circles preferred
  boxSizing: 'border-box',
  overflow: 'hidden',  // Handle overflow
  // ...
}}>
```

### Text Overflow Handling

**Always cap font sizes:**

```jsx
// Large text (titles, numbers)
fontSize: Math.min(configSize, 72),

// Medium text (labels)
fontSize: Math.min(configSize, 32),

// Small text (descriptions)
fontSize: Math.min(configSize, 18)
```

**Handle overflow:**

```jsx
// Single line
style={{
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
}}

// Multi-line (max 2 lines)
style={{
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  lineHeight: 1.3
}}
```

### Animation Layering

Templates should use **multi-layered animations**, not simple fades:

```jsx
// Layer 1: Card entrance (fade + slide + spring)
const cardEntrance = getCardEntrance(frame, {
  startFrame: beats.start,
  duration: 0.7,
  direction: 'up',
  distance: 60
}, fps);

// Layer 2: Icon pop (delayed, with bounce)
const iconPop = getIconPop(frame, {
  startFrame: beats.start + 0.3,
  duration: 0.5,
  withBounce: true
}, fps);

// Layer 3: Pulse glow (continuous)
const pulseGlow = getPulseGlow(frame, {
  frequency: 0.04,
  intensity: 20,
  color: `${color}80`
});
```

### Visual Effects Stack

Every template should include:

1. **Background gradient** (not solid color)
2. **Noise texture** (subtle film grain)
3. **Ambient particles** (20-30 floating elements)
4. **Glassmorphic elements** (blur + transparency)
5. **Spotlight effect** (optional, for emphasis)
6. **Particle bursts** (on key events)

See **[docs/methodology/TEMPLATE_POLISH.md](./docs/methodology/TEMPLATE_POLISH.md)** for detailed methodology.

---

## 🎯 Best Practices

### Configuration Design

**Make everything configurable:**
- Colors (bg, primary, secondary, text)
- Sizing (layout dimensions, font sizes)
- Timing (beat timing for all animations)
- Content (text, images, data)
- Effects (toggles for particles, glow, etc.)

**Provide sensible defaults:**
```jsx
const {
  layout = { size: 420, spacing: 1.4 },
  colors = { bg: '#1a1a1a', primary: '#FF6B35' },
  beats = { title: 1.0, exit: 15.0 }
} = config;
```

### Performance

- Use `useMemo` for expensive calculations
- Generate particles once, not per frame
- Avoid complex filters on large elements
- Test at 30fps playback

### Accessibility

- Ensure sufficient color contrast (4.5:1 minimum)
- Cap text sizes to prevent overflow
- Provide alternate text for visual elements
- Test with various content lengths

### Testing

**Always test with:**
- Very long text ("This is an extremely long title that might overflow...")
- Very short text ("OK")
- Multiple line counts (1-line, 2-line, 3-line questions)
- Different color themes (light, dark, high contrast)
- Edge cases (empty config, missing fields)

### Code Organization

```jsx
// 1. Imports
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { toFrames, getCardEntrance } from '../sdk';

// 2. Constants
const DEFAULT_CONFIG = { /* ... */ };
export const CONFIG_SCHEMA = { /* ... */ };

// 3. Helper functions
const calculateLayout = (config, dimensions) => { /* ... */ };

// 4. Main component
export const TemplateName_V6 = ({ config }) => {
  // State and hooks
  // Layout calculations
  // Animation logic
  // Render
};

// 5. Duration function
export const getDuration = (config, fps = 30) => { /* ... */ };
```

---

## 📊 Template Checklist

Before considering a template complete:

### Visual Quality
- [ ] Uses 90-95% of screen space
- [ ] Circles/organic shapes (not boxes)
- [ ] Gradient backgrounds
- [ ] Glassmorphic effects
- [ ] Particle systems visible
- [ ] Film grain texture
- [ ] Professional typography

### Functionality
- [ ] All text fits in containers
- [ ] Uniform sizing enforced
- [ ] No screen edge overlaps
- [ ] Multi-layered animations
- [ ] Smooth entrance/exit
- [ ] Timed with beats

### Configuration
- [ ] DEFAULT_CONFIG defined
- [ ] CONFIG_SCHEMA complete
- [ ] All features configurable
- [ ] Sensible defaults provided
- [ ] Example scene created

### Integration
- [ ] Registered in TemplateGallery
- [ ] Registered in TemplateRouter
- [ ] getDuration function exported
- [ ] Scene imported in UnifiedAdminConfig
- [ ] Build succeeds without errors

### Testing
- [ ] Works with long text
- [ ] Works with short text
- [ ] Color themes apply correctly
- [ ] Timing controls work
- [ ] Preview renders correctly
- [ ] No console errors

---

## ⚠️ Common Mistakes to Avoid

### 🚨 CRITICAL #1: Animation Functions Expect SECONDS Not FRAMES

**Symptom:** Template builds successfully but animations never trigger (text/elements invisible or appear instantly without animation).

**Root Cause:** ALL SDK animation functions expect timing parameters in SECONDS, but we're passing pre-converted FRAMES, causing double-conversion.

**The Problem:**
```jsx
// ❌ WRONG - Double conversion (seconds → frames → frames again)
const f = {
  q1Start: toFrames(beats.q1Start, fps)  // Convert to frames
};

const q1CardEntrance = getCardEntrance(frame, {
  startFrame: f.q1Start,  // ← FRAMES (already converted) - WRONG!
  duration: 0.8
}, fps);
// getCardEntrance internally does: toFrames(f.q1Start, fps)
// Result: 0.9s → 27f → toFrames(27, 30) → 810 frames!
// Animation never triggers (starts way in future)
```

**The Solution:**
```jsx
// ✅ CORRECT - Pass SECONDS, let functions convert internally
const q1CardEntrance = getCardEntrance(frame, {
  startFrame: beats.q1Start,  // ← SECONDS (e.g., 0.9)
  duration: 0.8
}, fps);
// getCardEntrance does: toFrames(0.9, 30) → 27 frames ✓
```

**Functions That Expect SECONDS:**
- `getCardEntrance(frame, { startFrame: SECONDS, duration: SECONDS }, fps)`
- `getIconPop(frame, { startFrame: SECONDS, duration: SECONDS }, fps)`
- `getParticleBurst(frame, { triggerFrame: SECONDS, duration: SECONDS }, fps)`
- `getLetterReveal(frame, text, { startFrame: SECONDS, duration: SECONDS }, fps)`
- `getScaleEmphasis(frame, { triggerFrame: SECONDS, duration: SECONDS }, fps)`
- `getPulseGlow(frame, { startFrame: SECONDS, ... })` (if applicable)

**The Pattern:**
```jsx
// Pre-convert beats to frames for interpolate() calls
const f = useMemo(() => ({
  titleStart: toFrames(beats.titleStart, fps),
  q1Start: toFrames(beats.q1Start, fps),
  // ...
}), [beats, fps]);

// Use FRAMES (f.xxx) for:
const titleProgress = interpolate(frame, [f.titleStart, f.titleStart + 30], ...);
if (frame >= f.q1Start) { ... }

// Use SECONDS (beats.xxx) for SDK animation functions:
const cardAnim = getCardEntrance(frame, { startFrame: beats.q1Start }, fps);
const letterReveal = getLetterReveal(frame, text, { startFrame: beats.titleStart }, fps);
```

**Quick Fix Checklist:**
```jsx
// ❌ Find and replace these patterns:
getCardEntrance(frame, { startFrame: f.xxxStart
getIconPop(frame, { startFrame: f.xxxStart
getParticleBurst(frame, { triggerFrame: f.xxxStart
getLetterReveal(frame, text, { startFrame: f.xxxStart

// ✅ With these patterns:
getCardEntrance(frame, { startFrame: beats.xxxStart
getIconPop(frame, { startFrame: beats.xxxStart
getParticleBurst(frame, { triggerFrame: beats.xxxStart
getLetterReveal(frame, text, { startFrame: beats.xxxStart
```

**Quick Check:**
```bash
# Find animation functions using FRAMES (wrong):
grep -E "get(Card|Icon|Particle|Letter).*startFrame: f\." src/templates/v6/YourTemplate_V6.jsx
grep -E "getParticleBurst.*triggerFrame: f\." src/templates/v6/YourTemplate_V6.jsx

# Should return no results! If it does, change f.xxxStart to beats.xxxStart
```

---

### 🚨 CRITICAL #2: Font System Setup (Text Rendering)

**Symptom:** Text renders but uses wrong font or doesn't match configured typography.voice.

**Root Cause:** Missing `buildFontTokens` or not applying `fontFamily` to text elements.

**The Fix:**

**Step 1: Import `buildFontTokens`**
```jsx
import { loadFontVoice, buildFontTokens, DEFAULT_FONT_VOICE } from '../../sdk/fontSystem';
```

**Step 2: Call `buildFontTokens` in component**
```jsx
export const YourTemplate = ({ scene }) => {
  const typography = { ...DEFAULT_CONFIG.typography, ...(scene.typography || {}) };
  
  useEffect(() => {
    void loadFontVoice(typography.voice || DEFAULT_FONT_VOICE);
  }, [typography.voice]);
  
  const fontTokens = buildFontTokens(typography.voice || DEFAULT_FONT_VOICE);
  
  // ... rest of component
};
```

**Step 3: Apply `fontFamily` to ALL text elements**
```jsx
<div style={{
  fontSize: fonts.size_title,
  fontWeight: fonts.weight_title,
  fontFamily: fontTokens.title.family,  // ← REQUIRED
  color: colors.text
}}>
  {config.title.text}
</div>
```

**Step 4: Do NOT use `className="font-display"`**
```jsx
// ❌ WRONG - className overrides inline fontFamily
<div className="font-display" style={{ fontFamily: fontTokens.title.family }}>

// ✅ CORRECT - Use inline style only
<div style={{ fontFamily: fontTokens.title.family }}>
```

**Font Token Types:**
- `fontTokens.title.family` - For titles, headlines, questions
- `fontTokens.body.family` - For body text, descriptions, hints
- `fontTokens.accent.family` - For labels, badges, special emphasis

**Quick Check:**
```bash
# Search for missing buildFontTokens
grep -L "buildFontTokens" src/templates/v6/YourTemplate_V6.jsx

# Search for text without fontFamily
grep -A5 "fontSize.*size_" src/templates/v6/YourTemplate_V6.jsx | grep -v "fontFamily"

# Search for problematic font-display className
grep "className.*font-display" src/templates/v6/YourTemplate_V6.jsx
# Should return nothing! Remove if found.
```

---

## 🔗 Related Documentation

- **[CONFIGURATION.md](./CONFIGURATION.md)** - JSON schema and configuration guide
- **[SDK.md](./SDK.md)** - SDK utilities and API reference
- **[docs/methodology/TEMPLATE_POLISH.md](./docs/methodology/TEMPLATE_POLISH.md)** - Detailed polish methodology

---

## 🎉 Ready to Build

With these guidelines, you're ready to create professional, configurable video templates. Remember:

1. **Start with an example** - Copy a similar template
2. **Follow polish standards** - No PowerPoint aesthetics
3. **Make everything configurable** - Zero hardcoded values
4. **Test thoroughly** - Edge cases matter
5. **Document well** - Future you will thank you

**Happy template building!** 🚀
