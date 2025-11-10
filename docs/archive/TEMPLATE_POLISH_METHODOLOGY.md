# Template Polish Methodology & Agent Handoff Guide

## 🎯 Executive Summary

This document outlines the complete methodology used to transform PowerPoint-esque templates into broadcast-quality video templates. Use this guide to apply the same improvements to remaining V6 templates.

**Templates Completed**: 
- ✅ `Explain2AConceptBreakdown_V6` (TEST version)
- ✅ `Guide10StepSequence_V6` (TEST version)

**Templates Remaining**: All other V6 templates in `/workspace/KnoMotion-Videos/src/templates/`

---

## 📋 Table of Contents

1. [Core Problems Identified](#core-problems-identified)
2. [Design Principles](#design-principles)
3. [Technical Methodology](#technical-methodology)
4. [Step-by-Step Implementation Guide](#step-by-step-implementation-guide)
5. [Code Patterns & Examples](#code-patterns--examples)
6. [Testing Checklist](#testing-checklist)
7. [Common Pitfalls](#common-pitfalls)
8. [Integration Checklist](#integration-checklist)

---

## Core Problems Identified

### 1. **Poor Screen Real Estate Usage**
- **Problem**: Templates used only ~50% of available 1920x1080 space
- **Symptoms**: Small elements, wasted space, unimpressive visual presence
- **Root Cause**: Conservative sizing, excessive margins

### 2. **PowerPoint-esque Design**
- **Problem**: Templates looked like basic presentation slides
- **Symptoms**: 
  - Box-based layouts (rectangles with borders)
  - Flat colors
  - Minimal visual effects
  - Generic transitions
- **Root Cause**: Functional-first design without broadcast polish

### 3. **Lack of Visual Hierarchy**
- **Problem**: All elements had same visual weight
- **Symptoms**: 
  - No emphasis for VO (voice-over) narration
  - Static layouts
  - Poor guidance for viewer attention
- **Root Cause**: No dynamic state management for emphasis

### 4. **Text Overflow & Sizing Issues**
- **Problem**: Text didn't fit in containers, circles too small
- **Symptoms**: Cut-off text, cramped appearance, inconsistent sizing
- **Root Cause**: Fixed font sizes without max limits, insufficient padding

### 5. **Screen Bounds Violations**
- **Problem**: Elements overlapping top/bottom edges
- **Symptoms**: Title too close to top, elements extending beyond canvas
- **Root Cause**: Improper vertical positioning calculations

---

## Design Principles

### Principle 1: Broadcast Quality Over Simplicity
**Before**: Minimalist, clean, "safe" designs
**After**: Rich, layered, sophisticated visuals

**Key Attributes**:
- Glassmorphic effects (blur, transparency)
- Gradient backgrounds
- Particle systems
- Spotlight effects
- Film grain texture
- Shine animations

### Principle 2: Full Screen Real Estate Usage
**Before**: 50% screen usage, conservative sizing
**After**: 95%+ screen usage, confident sizing

**Implementation**:
- Larger radius/dimensions (420-500px layouts)
- Bigger cards/badges (200-260px)
- Minimal but intentional margins
- Dynamic positioning for optimal space usage

### Principle 3: Organic Over Geometric
**Before**: Boxes, rectangles, straight lines
**After**: Circles, curves, flowing elements

**Why**: 
- Circles feel modern, friendly, less corporate
- No harsh corners
- Better for animation (natural rotation)
- More visually engaging

### Principle 4: Emphasis System for VO Pacing
**Before**: Static layouts, no temporal emphasis
**After**: Dynamic emphasis tied to timing

**Features**:
- Per-element `emphasize` config with `startTime` and `duration`
- Scale + glow effects when emphasized
- Helps viewer follow VO narration
- Configurable emphasis styles

### Principle 5: Animation = Life
**Before**: Simple fade-in/fade-out
**After**: Multi-layered animations

**Animation Layers**:
1. Entrance animations (spring-bounce, slide-up)
2. Particle effects (bursts, flowing)
3. Lottie animations (arrows, checkmarks)
4. Emphasis animations (scale, glow, pulse)
5. Connection animations (line drawing, particle flow)
6. Exit animations (smooth fade)

### Principle 6: Enforced Uniformity
**Before**: Elements could vary in size based on content
**After**: Strict uniform sizing with overflow handling

**Implementation**:
```javascript
minWidth: size,
minHeight: size,
boxSizing: 'border-box',
overflow: 'hidden',
textOverflow: 'ellipsis',
WebkitLineClamp: 2  // For multi-line
```

---

## Technical Methodology

### Phase 1: Audit & Analysis
**Duration**: 30 minutes

1. **Review existing template**
   - Identify layout type (hub-spoke, sequential, grid, etc.)
   - Note all configurable elements
   - Check screen space usage
   - Identify visual style (boxes, cards, etc.)

2. **Identify core issues**
   - Screen real estate: Is it using <70% of space?
   - Visual style: Does it look like PowerPoint?
   - Layout: Are elements boxes or organic shapes?
   - Effects: Minimal or sophisticated?
   - Emphasis: Can elements be highlighted for VO?

3. **Plan improvements**
   - Sketch new layout (bigger, more dynamic)
   - Choose organic shapes (circles, curves)
   - Plan effect layers (glass, particles, shine)
   - Design emphasis system

### Phase 2: Size & Layout Optimization
**Duration**: 1 hour

#### Step 1: Increase Overall Dimensions
```javascript
// Before
radius: 350,
cardSize: 180,
centerSize: 160

// After  
radius: 420,        // +70px (20% increase)
cardSize: 260,      // +80px (44% increase)
centerSize: 220     // +60px (38% increase)
```

**Calculation Method**:
- Target 90-95% screen usage
- Work backwards from 1920x1080 bounds
- Leave 80-100px margins on all sides
- Calculate max radius: `(1080 - titleHeight - marginTop - marginBottom) / 2`

#### Step 2: Adjust Vertical Positioning
```javascript
// Title positioning - avoid top overlap
title: {
  offset: { y: 70-80 }  // Was 40-50
}

// Center positioning - better balance
centerY: height / 2 + 10-20  // Was +40

// Grid/multi-row layouts
startY: (height - totalHeight) / 2 + 20  // Was +40
```

**Key Points**:
- Title needs 70-80px from top
- Center should be within ±20px of true center
- Multi-row layouts need tighter vertical spacing

#### Step 3: Enforce Text Fitting
```javascript
// Container sizing
width: size,
height: size,
minWidth: size,      // NEW: Enforce uniform
minHeight: size,     // NEW: Enforce uniform
boxSizing: 'border-box',  // NEW: Include padding
padding: 24-28,      // Increased from 16-20

// Text constraints
fontSize: Math.min(configuredSize, maxSize),
overflow: 'hidden',
textOverflow: 'ellipsis',  // Single line
WebkitLineClamp: 2,         // Multi-line
WebkitBoxOrient: 'vertical',
display: '-webkit-box'
```

**Font Size Caps**:
- Large text (titles, numbers): 56-72px max
- Medium text (labels): 26-32px max
- Small text (descriptions): 14-18px max
- Icons: 36-48px (proportional to container)

### Phase 3: Visual Style Transformation
**Duration**: 2 hours

#### Replace Boxes with Circles
```javascript
// Before: Box design
<div style={{
  width: 200,
  height: 150,
  borderRadius: 8,
  border: '2px solid #ccc',
  backgroundColor: '#fff'
}}>

// After: Circular badge design
<div style={{
  width: 200,
  height: 200,  // Same width/height for perfect circle
  borderRadius: '50%',
  border: `4px solid ${colors.text}20`,
  background: `linear-gradient(135deg, ${color}DD 0%, ${color}AA 100%)`,
  backdropFilter: 'blur(10px)'
}}>
```

#### Add Glassmorphic Effects
```javascript
import { GlassmorphicPane } from '../sdk/broadcastEffects';

<GlassmorphicPane
  innerRadius={size / 2}
  glowOpacity={0.25}
  borderOpacity={0.5}
  backgroundColor={`${color}15`}
  style={{
    width: size,
    height: size,
    borderRadius: '50%',
    border: `3px solid ${color}`
  }}
>
  {/* Content */}
</GlassmorphicPane>
```

#### Add Particle Effects
```javascript
import { generateAmbientParticles, renderAmbientParticles } from '../sdk';

// Generate once
const particleElements = generateAmbientParticles({
  count: 20,
  seed: 142,
  style: 'ambient',
  color: colors.connection,
  bounds: { w: width, h: height }
});

// Render in background
<svg style={{ position: 'absolute', width: '100%', height: '100%' }}>
  {particleElements.map(p => p.element)}
</svg>
```

#### Add Spotlight Effects
```javascript
import { SpotlightEffect } from '../sdk/broadcastEffects';

<SpotlightEffect
  x={50}  // Percentage
  y={55}  // Percentage
  size={800}
  color={colors.primary}
  opacity={0.2}
/>
```

#### Add Film Grain Texture
```javascript
import { NoiseTexture } from '../sdk/broadcastEffects';

<NoiseTexture opacity={0.03} />
```

### Phase 4: Emphasis System Implementation
**Duration**: 1.5 hours

#### Add Emphasis Config Schema
```javascript
const DEFAULT_CONFIG = {
  // Per-element emphasis
  parts: [
    {
      label: 'Part 1',
      // ... other props
      emphasize: {
        enabled: true,
        startTime: 5.0,   // When to emphasize (seconds)
        duration: 2.0      // How long (seconds)
      }
    }
  ],
  
  // Global emphasis settings
  emphasis: {
    enabled: true,
    style: 'scale-glow',  // 'scale-glow', 'spotlight', 'pulse'
    scaleAmount: 1.15,
    glowIntensity: 30
  }
};
```

#### Check Emphasis State
```javascript
const isPartEmphasized = (part, frame, fps) => {
  if (!part.emphasize?.enabled) return false;
  
  const startFrame = toFrames(part.emphasize.startTime, fps);
  const endFrame = toFrames(part.emphasize.startTime + part.emphasize.duration, fps);
  
  return frame >= startFrame && frame < endFrame;
};
```

#### Apply Emphasis Styling
```javascript
const isEmphasized = isPartEmphasized(part, frame, fps);

const emphasisScale = isEmphasized 
  ? getScaleEmphasis(frame, {
      triggerFrame: part.emphasize.startTime,
      duration: 0.4,
      maxScale: emphasisConfig.scaleAmount
    }, fps)
  : { scale: 1 };

const emphasisGlow = isEmphasized ? {
  boxShadow: `0 0 ${emphasisConfig.glowIntensity}px ${part.color}, 
              0 0 ${emphasisConfig.glowIntensity * 1.5}px ${part.color}80`
} : {};

<div style={{
  transform: `scale(${baseScale * emphasisScale.scale})`,
  ...emphasisGlow,
  zIndex: isEmphasized ? 10 : 3,  // Bring to front when emphasized
  transition: 'all 0.3s ease'
}}>
```

### Phase 5: Lottie Integration
**Duration**: 1 hour

#### Add Lottie Imports
```javascript
import { AnimatedLottie } from '../sdk/lottieIntegration';
import { getLottieFromConfig, getLottiePreset } from '../sdk/lottiePresets';
```

#### Add Lottie Config
```javascript
const DEFAULT_CONFIG = {
  arrows: {
    enabled: true,
    type: 'lottie',
    lottiePreset: 'arrowFlow',  // From lottiePresets.js
    animated: true,
    size: 60
  },
  
  checkmarks: {
    enabled: true,
    style: 'lottie',
    lottiePreset: 'successCheck',
    color: '#10B981'
  }
};
```

#### Render Lottie Animations
```javascript
// Arrows between elements
<div style={{ width: arrows.size, height: arrows.size }}>
  <AnimatedLottie
    animationData={getLottiePreset(arrows.lottiePreset)?.data}
    loop={arrows.animated}
    autoplay
  />
</div>

// Checkmarks on completion
{isCompleted && (
  <div style={{ width: 70, height: 70 }}>
    <AnimatedLottie
      animationData={getLottiePreset(checkmarks.lottiePreset)?.data}
      loop={false}
      autoplay
    />
  </div>
)}
```

### Phase 6: Enhanced Animations
**Duration**: 1 hour

#### Card Entrance with Multiple Layers
```javascript
import { getCardEntrance, getIconPop } from '../sdk/microDelights.jsx';

// Card entrance (fade + slide + spring + glow)
const cardEntrance = getCardEntrance(frame, {
  startFrame: beats.firstElement + i * beats.interval,
  duration: 0.7,
  direction: 'up',
  distance: 60,
  withGlow: true,
  glowColor: `${color}40`
}, fps);

// Icon pop (separate timing, with bounce)
const iconPop = getIconPop(frame, {
  startFrame: beats.firstElement + i * beats.interval + 0.3,
  duration: 0.5,
  withBounce: true
}, fps);

<div style={{
  opacity: cardEntrance.opacity,
  transform: `translate(-50%, -50%) scale(${cardEntrance.scale})`
}}>
  {icon && (
    <div style={{
      opacity: iconPop.opacity,
      transform: `scale(${iconPop.scale}) rotate(${iconPop.rotation}deg)`
    }}>
      {icon}
    </div>
  )}
</div>
```

#### Flowing Particles Along Connections
```javascript
import { getPathDraw } from '../sdk/microDelights.jsx';

const pathLength = Math.sqrt(
  Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
);

const drawProgress = getPathDraw(frame, {
  startFrame: beats.connections + i * 0.15,
  duration: 0.8,
  pathLength
}, fps);

<svg>
  {/* Animated line */}
  <line
    x1={startX} y1={startY}
    x2={endX} y2={endY}
    stroke={color}
    strokeWidth={2}
    strokeDasharray={drawProgress.strokeDasharray}
    strokeDashoffset={drawProgress.strokeDashoffset}
  />
  
  {/* Flowing particle */}
  {drawProgress.strokeDashoffset === 0 && (
    <circle
      cx={startX + (endX - startX) * (Math.sin((frame - startFrame) * 0.06) * 0.5 + 0.5)}
      cy={startY + (endY - startY) * (Math.sin((frame - startFrame) * 0.06) * 0.5 + 0.5)}
      r={4}
      fill={color}
      opacity={0.6}
    />
  )}
</svg>
```

#### Particle Bursts on Key Events
```javascript
import { getParticleBurst, renderParticleBurst } from '../sdk/microDelights.jsx';

const burstParticles = getParticleBurst(frame, {
  triggerFrame: beats.centerReveal,
  particleCount: 20,
  duration: 1.5,
  color: colors.primary,
  size: 10,
  spread: 150
}, fps);

{renderParticleBurst(burstParticles, centerX, centerY)}
```

### Phase 7: CONFIG_SCHEMA Extension
**Duration**: 30 minutes

#### Add New Config Options
```javascript
export const CONFIG_SCHEMA = {
  // ... existing config
  
  // NEW: Per-element emphasis
  [elements]: {
    type: 'array',
    itemSchema: {
      // ... existing fields
      emphasize: {
        enabled: { type: 'checkbox', label: 'Enable Emphasis' },
        startTime: { 
          type: 'number', 
          label: 'Emphasis Start (s)', 
          min: 0, 
          max: 20, 
          step: 0.5 
        },
        duration: { 
          type: 'number', 
          label: 'Emphasis Duration (s)', 
          min: 0.5, 
          max: 5, 
          step: 0.5 
        }
      }
    }
  },
  
  // NEW: Global emphasis settings
  emphasis: {
    enabled: { type: 'checkbox', label: 'Enable Emphasis System' },
    style: { 
      type: 'select', 
      options: ['scale-glow', 'spotlight', 'pulse'] 
    },
    scaleAmount: { 
      type: 'slider', 
      label: 'Scale Amount', 
      min: 1.0, 
      max: 1.5, 
      step: 0.05 
    },
    glowIntensity: { 
      type: 'slider', 
      label: 'Glow Intensity', 
      min: 10, 
      max: 50, 
      step: 5 
    }
  },
  
  // NEW: Effect controls
  effects: {
    spotlight: {
      enabled: { type: 'checkbox', label: 'Spotlight Effect' },
      opacity: { type: 'slider', min: 0, max: 0.5, step: 0.05 },
      size: { type: 'slider', min: 400, max: 1000, step: 100 }
    },
    noiseTexture: {
      enabled: { type: 'checkbox', label: 'Film Grain Texture' },
      opacity: { type: 'slider', min: 0, max: 0.1, step: 0.01 }
    },
    shine: {
      enabled: { type: 'checkbox', label: 'Shine Effect' }
    }
  }
};
```

---

## Step-by-Step Implementation Guide

### Prerequisites
1. Read existing template code completely
2. Identify template type (breakdown, sequence, comparison, etc.)
3. Note existing configuration schema
4. Run template in preview to understand current state

### Step 1: Create TEST Version (30 min)

```bash
# Don't modify original template yet
# Create a new file for testing

# In TemplateGallery.jsx, add TEST entry
{
  id: 'TEST_YourTemplate_V6',
  name: '🧪 TEST: Your Template (Revised)',
  intentions: { ... },
  description: '🎬 BROADCAST QUALITY - ...',
  color: '#FF0099',
  version: 'v6.0-REVISED',
  isNew: true,
  hasConfig: true
}

# In TemplateRouter.jsx, map to original template
'TEST_YourTemplate_V6': YourTemplate_V6

# In UnifiedAdminConfig.jsx, register scene
'TEST_YourTemplate_V6': testYourTemplateScene

# In App.jsx, add to templateMap
'TEST_YourTemplate_V6': TemplateRouter
```

### Step 2: Sizing Analysis (15 min)

**Calculate optimal dimensions**:
```javascript
// 1. Determine safe canvas area
const safeWidth = 1920 - (marginLeft + marginRight);  // e.g., 1920 - 200 = 1720
const safeHeight = 1080 - (titleHeight + marginTop + marginBottom);  // e.g., 1080 - 300 = 780

// 2. For circular layouts
const maxRadius = Math.min(safeWidth, safeHeight) / 2 - elementSize;
// Example: Math.min(1720, 780) / 2 - 130 = 390 - 130 = 260... too small
// Better: Use 420px radius with smaller margins

// 3. For grid layouts
const maxElementsPerRow = Math.floor(safeWidth / (elementSize * spacing));
// Example: Math.floor(1720 / (260 * 1.4)) = Math.floor(4.7) = 4 elements

// 4. For horizontal layouts
const totalWidth = (numElements - 1) * (elementSize * spacing);
// Check: Does totalWidth < safeWidth?
```

**Document findings**:
```markdown
Current dimensions:
- Layout size: 350px radius (too small)
- Element size: 160px (too small)
- Title offset: 40px (too close to top)
- Vertical center: +40px (causes bottom overlap)

Recommended dimensions:
- Layout size: 420px radius (+70px)
- Element size: 200px (+40px)
- Title offset: 80px (+40px clearance)
- Vertical center: +20px (balanced)
```

### Step 3: Visual Style Conversion (2 hours)

#### 3a. Replace Boxes with Circles
```javascript
// Find all rectangular elements
// Search for: borderRadius: 8, width !== height

// Replace with circular design
{
  width: size,
  height: size,  // Same as width!
  minWidth: size,
  minHeight: size,
  borderRadius: '50%',  // Perfect circle
  boxSizing: 'border-box'
}
```

#### 3b. Add Gradient Backgrounds
```javascript
// Replace solid colors with gradients
// Before:
backgroundColor: color

// After:
background: `linear-gradient(135deg, ${color}DD 0%, ${color}AA 100%)`
// DD = 87% opacity, AA = 67% opacity
```

#### 3c. Integrate Glassmorphic Effects
```javascript
// Wrap important elements
import { GlassmorphicPane } from '../sdk/broadcastEffects';

<GlassmorphicPane
  innerRadius={size / 2}
  glowOpacity={0.25}
  borderOpacity={0.5}
  backgroundColor={`${color}15`}
  style={{ /* your styles */ }}
>
  {/* content */}
</GlassmorphicPane>
```

#### 3d. Add Background Effects
```javascript
// After opening <AbsoluteFill>

{/* Gradient overlay */}
{colors.bgGradient && (
  <div style={{
    position: 'absolute',
    inset: 0,
    background: `radial-gradient(circle at 50% 50%, ${colors.bg}DD 0%, ${colors.bg} 100%)`,
    zIndex: 0
  }} />
)}

{/* Noise texture */}
<NoiseTexture opacity={0.03} />

{/* Particles */}
<svg style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 1 }}>
  {particleElements.map(p => p.element)}
</svg>

{/* Spotlight */}
<SpotlightEffect x={50} y={50} size={800} color={primaryColor} opacity={0.2} />
```

### Step 4: Emphasis System Integration (1.5 hours)

#### 4a. Add Config Schema
```javascript
const DEFAULT_CONFIG = {
  [elements]: [
    {
      // ... existing props
      emphasize: {
        enabled: false,
        startTime: 5.0,
        duration: 2.0
      }
    }
  ],
  
  emphasis: {
    enabled: true,
    style: 'scale-glow',
    scaleAmount: 1.15,
    glowIntensity: 30
  }
};

export const CONFIG_SCHEMA = {
  [elements]: {
    type: 'array',
    itemSchema: {
      emphasize: {
        enabled: { type: 'checkbox', label: 'Enable Emphasis' },
        startTime: { type: 'number', label: 'Start (s)', min: 0, max: 20, step: 0.5 },
        duration: { type: 'number', label: 'Duration (s)', min: 0.5, max: 5, step: 0.5 }
      }
    }
  },
  
  emphasis: {
    enabled: { type: 'checkbox' },
    style: { type: 'select', options: ['scale-glow', 'spotlight', 'pulse'] },
    scaleAmount: { type: 'slider', min: 1.0, max: 1.5, step: 0.05 },
    glowIntensity: { type: 'slider', min: 10, max: 50, step: 5 }
  }
};
```

#### 4b. Create Helper Function
```javascript
const isElementEmphasized = (element, frame, fps) => {
  if (!element.emphasize?.enabled) return false;
  
  const startFrame = toFrames(element.emphasize.startTime, fps);
  const endFrame = toFrames(element.emphasize.startTime + element.emphasize.duration, fps);
  
  return frame >= startFrame && frame < endFrame;
};
```

#### 4c. Apply in Render
```javascript
{elements.map((element, i) => {
  // ... existing entrance logic
  
  const isEmphasized = isElementEmphasized(element, frame, fps);
  
  const emphasisScale = isEmphasized 
    ? getScaleEmphasis(frame, {
        triggerFrame: element.emphasize.startTime,
        duration: 0.4,
        maxScale: emphasisConfig.scaleAmount
      }, fps)
    : { scale: 1 };
  
  const emphasisGlow = isEmphasized ? {
    boxShadow: `0 0 ${emphasisConfig.glowIntensity}px ${element.color}, 
                0 0 ${emphasisConfig.glowIntensity * 1.5}px ${element.color}80`
  } : {};
  
  return (
    <div
      key={i}
      style={{
        transform: `scale(${baseScale * emphasisScale.scale})`,
        ...emphasisGlow,
        zIndex: isEmphasized ? 10 : 3,
        transition: 'all 0.3s ease'
      }}
    >
      {/* content */}
    </div>
  );
})}
```

### Step 5: Animation Enhancement (1 hour)

#### 5a. Layer Multiple Animation Effects
```javascript
import {
  getCardEntrance,
  getIconPop,
  getPulseGlow,
  getParticleBurst,
  renderParticleBurst
} from '../sdk/microDelights.jsx';

// 1. Card entrance (base layer)
const cardEntrance = getCardEntrance(frame, {
  startFrame: beats.start + i * beats.interval,
  duration: 0.7,
  direction: 'up',
  distance: 60,
  withGlow: true
}, fps);

// 2. Icon pop (delayed)
const iconPop = element.icon ? getIconPop(frame, {
  startFrame: beats.start + i * beats.interval + 0.3,
  duration: 0.5,
  withBounce: true
}, fps) : null;

// 3. Continuous glow
const glowEffect = getPulseGlow(frame, {
  frequency: 0.04,
  intensity: 20,
  color: `${element.color}80`,
  startFrame: beats.start + i * beats.interval
});

// 4. Particle burst on entrance
const burstParticles = getParticleBurst(frame, {
  triggerFrame: beats.start + i * beats.interval,
  particleCount: 15,
  duration: 1.2,
  color: element.color,
  size: 8,
  spread: 120
}, fps);
```

#### 5b. Apply Layered Styling
```javascript
<div style={{
  opacity: cardEntrance.opacity,
  transform: `translate(-50%, -50%) scale(${cardEntrance.scale})`,
  ...glowEffect
}}>
  {element.icon && iconPop && (
    <div style={{
      opacity: iconPop.opacity,
      transform: `scale(${iconPop.scale}) rotate(${iconPop.rotation}deg)`
    }}>
      {element.icon}
    </div>
  )}
  
  {/* Other content */}
</div>

{/* Render burst particles */}
{renderParticleBurst(burstParticles, x, y)}
```

### Step 6: Text Fitting & Overflow (45 min)

#### 6a. Add Container Constraints
```javascript
<div style={{
  width: size,
  height: size,
  minWidth: size,      // Enforce uniform
  minHeight: size,     // Enforce uniform
  borderRadius: '50%',
  boxSizing: 'border-box',  // Include padding in size
  padding: 24,         // Comfortable breathing room
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
}}>
```

#### 6b. Cap Font Sizes
```javascript
// Large elements (titles, numbers)
fontSize: Math.min(fonts.size_large, 56)

// Medium elements (labels)
fontSize: Math.min(fonts.size_medium, 28)

// Small elements (descriptions)
fontSize: Math.min(fonts.size_small, 16)

// Icons (proportional to container)
fontSize: size * 0.2  // 20% of container size
// But cap at reasonable max
fontSize: Math.min(size * 0.2, 48)
```

#### 6c. Handle Text Overflow
```javascript
// Single-line text (titles, labels)
<div style={{
  fontSize: Math.min(configSize, maxSize),
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  maxWidth: '100%'
}}>
  {text}
</div>

// Multi-line text (descriptions)
<div style={{
  fontSize: Math.min(configSize, maxSize),
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: 2,  // Max 2 lines
  WebkitBoxOrient: 'vertical',
  lineHeight: 1.3,
  maxWidth: '100%'
}}>
  {text}
</div>
```

#### 6d. Add flexShrink for Icons
```javascript
// Prevent icons from being compressed
<div style={{
  fontSize: 40,
  marginBottom: 8,
  flexShrink: 0  // Don't compress if space is tight
}}>
  {icon}
</div>
```

### Step 7: Lottie Integration (1 hour)

#### 7a. Add Lottie Config
```javascript
import { AnimatedLottie } from '../sdk/lottieIntegration';
import { getLottiePreset } from '../sdk/lottiePresets';

const DEFAULT_CONFIG = {
  // For connectors/arrows
  arrows: {
    enabled: true,
    type: 'lottie',
    lottiePreset: 'arrowFlow',  // Or 'arrowBounce', 'arrowGlow'
    animated: true,
    size: 60
  },
  
  // For completion indicators
  checkmarks: {
    enabled: true,
    style: 'lottie',
    lottiePreset: 'successCheck',  // Or 'celebrationCheck'
    color: '#10B981'
  }
};
```

#### 7b. Render Lottie Arrows
```javascript
// Between elements
{arrows.enabled && arrows.type === 'lottie' && (
  <div style={{
    position: 'absolute',
    left: midX,
    top: midY,
    width: arrows.size,
    height: arrows.size,
    transform: `translate(-50%, -50%) rotate(${angle}deg)`
  }}>
    <AnimatedLottie
      animationData={getLottiePreset(arrows.lottiePreset)?.data}
      loop={arrows.animated}
      autoplay
      style={{ width: '100%', height: '100%' }}
    />
  </div>
)}
```

#### 7c. Render Lottie Checkmarks
```javascript
// On completed items
{isCompleted && checkmarks.enabled && checkmarks.style === 'lottie' && (
  <div style={{ width: 70, height: 70 }}>
    <AnimatedLottie
      animationData={getLottiePreset(checkmarks.lottiePreset)?.data}
      loop={false}
      autoplay
    />
  </div>
)}
```

### Step 8: Example Scene Creation (30 min)

Create an example scene that showcases ALL new features:

```json
{
  "template_id": "TEST_YourTemplate_V6",
  "scene_id": "your_template_revised",
  "title": {
    "text": "Your Template Title",
    "offset": { "y": 80 }
  },
  
  "elements": [
    {
      "label": "Element 1",
      "description": "Description text",
      "color": "#FF6B35",
      "icon": "🎯",
      "emphasize": {
        "enabled": true,
        "startTime": 5.0,
        "duration": 2.0
      }
    },
    {
      "label": "Element 2",
      "description": "Description text",
      "color": "#4ECDC4",
      "icon": "🔍",
      "emphasize": {
        "enabled": true,
        "startTime": 7.5,
        "duration": 2.0
      }
    }
  ],
  
  "layout": {
    "size": 420,
    "elementSize": 200
  },
  
  "emphasis": {
    "enabled": true,
    "style": "scale-glow",
    "scaleAmount": 1.15,
    "glowIntensity": 30
  },
  
  "arrows": {
    "enabled": true,
    "type": "lottie",
    "lottiePreset": "arrowFlow",
    "animated": true
  },
  
  "effects": {
    "particles": { "enabled": true, "count": 20 },
    "glow": { "enabled": true, "intensity": 25 },
    "spotlight": { "enabled": true, "opacity": 0.2 },
    "noiseTexture": { "enabled": true, "opacity": 0.03 }
  },
  
  "beats": {
    "title": 1.0,
    "firstElement": 2.5,
    "elementInterval": 0.8,
    "hold": 14.0,
    "exit": 15.0
  }
}
```

### Step 9: Build & Test (30 min)

```bash
# 1. Build
cd KnoMotion-Videos
npm run build

# 2. Start dev server
npm run dev

# 3. Manual testing checklist:
# - [ ] Template appears in gallery with TEST prefix
# - [ ] Loads example scene when selected
# - [ ] Preview renders correctly
# - [ ] All text fits in containers
# - [ ] No overflow at screen edges
# - [ ] Emphasis system works (if applicable)
# - [ ] Animations are smooth
# - [ ] Lottie elements render
# - [ ] Config panel controls work
# - [ ] Changes in config update preview

# 4. Check console for errors
# - No red errors
# - Warnings are acceptable (bundle size, etc.)
```

### Step 10: Documentation (15 min)

Create a summary file: `TEST_YourTemplate_Summary.md`

```markdown
# TEST_YourTemplate_V6 - Revision Summary

## Changes Made

### Sizing
- Element size: [before] → [after] ([+/- X]px)
- Layout size: [before] → [after] ([+/- X]px)
- Title offset: [before] → [after] ([+/- X]px)

### Visual Style
- [ ] Replaced boxes with circles
- [ ] Added gradient backgrounds
- [ ] Added glassmorphic effects
- [ ] Added particle system
- [ ] Added spotlight effect
- [ ] Added film grain texture

### Features Added
- [ ] Emphasis system for VO pacing
- [ ] Lottie animated arrows/icons
- [ ] Enhanced entrance animations
- [ ] Text overflow handling
- [ ] Uniform size enforcement

### Config Schema Extended
- emphasis system (enabled, style, scaleAmount, glowIntensity)
- arrows (enabled, type, lottiePreset, animated, size)
- effects.spotlight (enabled, opacity, size)
- effects.noiseTexture (enabled, opacity)
- [element].emphasize (enabled, startTime, duration)

## Testing Results
- [x] Build successful
- [x] Preview renders correctly
- [x] Text fits properly
- [x] No screen overlaps
- [x] Emphasis works
- [x] Config panel functional

## Example Scene
File: `scenes/your_template_revised.json`
```

---

## Code Patterns & Examples

### Pattern 1: Enforced Uniform Circular Elements
```javascript
// ✅ GOOD: Perfect circles with enforced size
<div style={{
  width: size,
  height: size,
  minWidth: size,
  minHeight: size,
  borderRadius: '50%',
  boxSizing: 'border-box',
  padding: 24,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: `linear-gradient(135deg, ${color}DD 0%, ${color}AA 100%)`,
  border: `4px solid ${textColor}20`,
  backdropFilter: 'blur(10px)'
}}>
  {/* Content with overflow handling */}
</div>

// ❌ BAD: Boxes without size enforcement
<div style={{
  width: 200,
  height: 150,  // Different from width
  borderRadius: 8,  // Not circular
  backgroundColor: color,  // Solid, not gradient
  padding: 16  // Without boxSizing
}}>
```

### Pattern 2: Text with Overflow Protection
```javascript
// ✅ GOOD: Capped font size with overflow handling
<div style={{
  fontSize: Math.min(fonts.size_title, 28),
  fontWeight: fonts.weight,
  fontFamily: fontTokens.title.family,
  color: colors.text,
  textAlign: 'center',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  lineHeight: 1.1,
  maxWidth: '100%'
}}>
  {title}
</div>

// For multi-line
<div style={{
  fontSize: Math.min(fonts.size_desc, 16),
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  lineHeight: 1.3,
  maxWidth: '100%'
}}>
  {description}
</div>

// ❌ BAD: No caps, no overflow handling
<div style={{
  fontSize: fonts.size_title,  // Could be any size
  // No overflow handling
}}>
  {title}
</div>
```

### Pattern 3: Layered Animation System
```javascript
// ✅ GOOD: Multiple animation layers with different timing
const cardEntrance = getCardEntrance(frame, {
  startFrame: beats.start,
  duration: 0.7,
  direction: 'up',
  distance: 60,
  withGlow: true
}, fps);

const iconPop = getIconPop(frame, {
  startFrame: beats.start + 0.3,  // Delayed
  duration: 0.5,
  withBounce: true
}, fps);

const pulseGlow = getPulseGlow(frame, {
  frequency: 0.04,
  intensity: 20,
  color: `${color}80`,
  startFrame: beats.start
});

<div style={{
  opacity: cardEntrance.opacity,
  transform: `scale(${cardEntrance.scale})`,
  ...pulseGlow
}}>
  {icon && (
    <div style={{
      opacity: iconPop.opacity,
      transform: `scale(${iconPop.scale}) rotate(${iconPop.rotation}deg)`
    }}>
      {icon}
    </div>
  )}
</div>

// ❌ BAD: Simple fade-in only
const opacity = interpolate(frame, [start, end], [0, 1]);
<div style={{ opacity }}>
```

### Pattern 4: Emphasis System
```javascript
// ✅ GOOD: Dynamic emphasis with smooth transitions
const isEmphasized = isElementEmphasized(element, frame, fps);

const emphasisScale = isEmphasized 
  ? getScaleEmphasis(frame, {
      triggerFrame: element.emphasize.startTime,
      duration: 0.4,
      maxScale: 1.15
    }, fps)
  : { scale: 1 };

const emphasisGlow = isEmphasized ? {
  boxShadow: `0 0 30px ${color}, 0 0 45px ${color}80`
} : {};

<div style={{
  transform: `scale(${baseScale * emphasisScale.scale})`,
  ...emphasisGlow,
  zIndex: isEmphasized ? 10 : 3,
  transition: 'all 0.3s ease'
}}>

// ❌ BAD: No emphasis system
<div style={{ transform: `scale(${baseScale})` }}>
```

### Pattern 5: Glassmorphic Layers
```javascript
// ✅ GOOD: Layered glassmorphic design
<GlassmorphicPane
  innerRadius={size / 2}
  glowOpacity={0.25}
  borderOpacity={0.5}
  backgroundColor={`${color}15`}
  style={{
    width: size,
    height: size,
    borderRadius: '50%',
    border: `3px solid ${color}`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  }}
>
  {/* Content */}
</GlassmorphicPane>

// ❌ BAD: Flat solid background
<div style={{
  backgroundColor: color,
  border: '1px solid #ccc'
}}>
```

### Pattern 6: Particle Systems
```javascript
// ✅ GOOD: Ambient particles + burst particles
// Ambient (generated once)
const ambientParticles = generateAmbientParticles({
  count: 20,
  seed: 142,
  style: 'ambient',
  color: colors.connection,
  bounds: { w: width, h: height }
});

renderAmbientParticles(ambientParticles, frame, fps, { opacity: 0.4 });

// Burst (on events)
const burstParticles = getParticleBurst(frame, {
  triggerFrame: beats.reveal,
  particleCount: 20,
  duration: 1.5,
  color: colors.primary,
  size: 10,
  spread: 150
}, fps);

<AbsoluteFill>
  {/* Ambient particles */}
  <svg style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 1 }}>
    {ambientParticles.map(p => p.element)}
  </svg>
  
  {/* Burst particles */}
  {renderParticleBurst(burstParticles, centerX, centerY)}
</AbsoluteFill>

// ❌ BAD: No particles
```

### Pattern 7: Lottie Integration
```javascript
// ✅ GOOD: Configurable Lottie with presets
import { AnimatedLottie } from '../sdk/lottieIntegration';
import { getLottiePreset } from '../sdk/lottiePresets';

const arrows = config.arrows || DEFAULT_CONFIG.arrows;

{arrows.enabled && arrows.type === 'lottie' && (
  <div style={{
    width: arrows.size,
    height: arrows.size,
    transform: `rotate(${angle}deg)`
  }}>
    <AnimatedLottie
      animationData={getLottiePreset(arrows.lottiePreset)?.data}
      loop={arrows.animated}
      autoplay
      style={{ width: '100%', height: '100%' }}
    />
  </div>
)}

// ❌ BAD: Hardcoded SVG arrows
<svg>
  <path d="M 0 0 L 10 5 L 0 10" stroke="#000" />
</svg>
```

---

## Testing Checklist

### Visual Tests (Preview)
- [ ] Template renders without errors
- [ ] All text is readable and fits in containers
- [ ] No text overflow or cutoff
- [ ] Circles are perfect (not ovals)
- [ ] All circles are uniform size
- [ ] No elements overlap screen edges (top/bottom/left/right)
- [ ] Title has proper clearance from top (70-80px)
- [ ] Elements are vertically centered (within ±20px)
- [ ] Gradients render correctly
- [ ] Particle effects are visible
- [ ] Spotlight effect is visible (if enabled)
- [ ] Film grain texture is subtle
- [ ] Glassmorphic effects show blur/transparency

### Animation Tests
- [ ] Entrance animations are smooth
- [ ] Icons pop in after cards (delayed timing)
- [ ] Emphasis scaling works (if enabled)
- [ ] Emphasis glow appears (if enabled)
- [ ] Lottie arrows animate (if enabled)
- [ ] Lottie checkmarks play (if enabled)
- [ ] Particle bursts trigger at correct times
- [ ] Exit animations are smooth
- [ ] No janky or stuttering animations

### Interaction Tests (Config Panel)
- [ ] All config options appear in panel
- [ ] Sliders adjust values in real-time
- [ ] Checkboxes toggle features
- [ ] Color pickers update colors
- [ ] Emphasis timing controls work
- [ ] Layout size adjustments work
- [ ] Effect toggles work
- [ ] Changes persist when playing/pausing

### Emphasis System Tests (if applicable)
- [ ] Emphasis triggers at configured startTime
- [ ] Emphasis lasts for configured duration
- [ ] Multiple elements can be emphasized sequentially
- [ ] Emphasized element scales up
- [ ] Emphasized element shows glow
- [ ] Emphasized element moves to front (z-index)
- [ ] Non-emphasized elements remain normal
- [ ] Emphasis transitions are smooth

### Technical Tests
- [ ] Build succeeds without errors
- [ ] No console errors in browser
- [ ] Duration calculation is accurate
- [ ] getDuration function works
- [ ] Template registered in TemplateRouter
- [ ] Template appears in gallery
- [ ] Example scene loads correctly
- [ ] CONFIG_SCHEMA is complete

### Cross-Browser Tests (if time permits)
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if on Mac)

### Performance Tests
- [ ] Smooth 30fps playback
- [ ] No dropped frames during complex animations
- [ ] Memory usage stable (no leaks)
- [ ] Player controls responsive

---

## Common Pitfalls

### Pitfall 1: Forgetting boxSizing
```javascript
// ❌ WRONG: Padding adds to width/height
<div style={{
  width: 200,
  height: 200,
  padding: 24
}}>
// Actual size: 248x248 (200 + 24*2)

// ✅ CORRECT: Padding included in width/height
<div style={{
  width: 200,
  height: 200,
  padding: 24,
  boxSizing: 'border-box'
}}>
// Actual size: 200x200 (padding inside)
```

### Pitfall 2: Not Capping Font Sizes
```javascript
// ❌ WRONG: Font can be any size from config
<div style={{
  fontSize: fonts.size_title  // Could be 100px!
}}>

// ✅ CORRECT: Cap at reasonable max
<div style={{
  fontSize: Math.min(fonts.size_title, 28)
}}>
```

### Pitfall 3: Forgetting Text Overflow
```javascript
// ❌ WRONG: Long text breaks layout
<div style={{
  fontSize: 24,
  width: 200
}}>
  {veryLongTitle}
</div>

// ✅ CORRECT: Handle overflow
<div style={{
  fontSize: 24,
  width: 200,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'  // For single line
}}>
  {veryLongTitle}
</div>
```

### Pitfall 4: Not Testing with Long Content
```javascript
// Always test with:
"This is a very long title that might overflow"
"This is an extremely long description that will definitely need multiple lines and might overflow if not handled correctly"

// Not just:
"Title"
"Description"
```

### Pitfall 5: Hardcoding Values
```javascript
// ❌ WRONG: Hardcoded size
<div style={{ width: 200, height: 200 }}>

// ✅ CORRECT: Use config value
<div style={{ 
  width: layout.elementSize, 
  height: layout.elementSize 
}}>
```

### Pitfall 6: Missing minWidth/minHeight
```javascript
// ❌ WRONG: Size can shrink
<div style={{
  width: size,
  height: size,
  display: 'flex'
}}>

// ✅ CORRECT: Enforce minimum
<div style={{
  width: size,
  height: size,
  minWidth: size,
  minHeight: size,
  display: 'flex'
}}>
```

### Pitfall 7: Not Using flexShrink: 0 for Icons
```javascript
// ❌ WRONG: Icon can be squished
<div style={{
  fontSize: 48,
  marginBottom: 8
}}>
  {icon}
</div>

// ✅ CORRECT: Prevent shrinking
<div style={{
  fontSize: 48,
  marginBottom: 8,
  flexShrink: 0
}}>
  {icon}
</div>
```

### Pitfall 8: Incorrect Vertical Centering
```javascript
// ❌ WRONG: Can cause bottom overlap
const centerY = height / 2 + 40;

// ✅ CORRECT: Minimal offset
const centerY = height / 2 + 10;  // Or +20 max
```

### Pitfall 9: Not Testing Emphasis System
```javascript
// Always test emphasis:
// 1. Single element emphasized
// 2. Multiple elements emphasized sequentially
// 3. Overlapping emphasis times
// 4. Very short/long durations
```

### Pitfall 10: Forgetting to Update Example Scene
```javascript
// After changing default sizes, update example scene JSON:
{
  "layout": {
    "radius": 420,      // Match new default
    "elementSize": 200  // Match new default
  }
}
```

---

## Integration Checklist

After completing a template revision, integrate into the system:

### File Changes
- [ ] Template file updated (e.g., `YourTemplate_V6.jsx`)
- [ ] Example scene created (e.g., `your_template_revised.json`)
- [ ] Summary doc created (e.g., `TEST_YourTemplate_Summary.md`)

### Gallery Integration
- [ ] Added to `TemplateGallery.jsx` TEMPLATE_CATALOG
  - Use prefix: `TEST_YourTemplate_V6`
  - Color: `#FF0099` (pink)
  - Badge: `🧪 TEST`
  - Description includes "🎬 BROADCAST QUALITY"

### Router Integration
- [ ] Added to `TemplateRouter.jsx` V6_TEMPLATE_REGISTRY
  - Map `TEST_YourTemplate_V6` to template component

### App Integration
- [ ] Imported scene in `App.jsx`
- [ ] Added to `templateMap` in `App.jsx`
- [ ] Added to `sampleScenes` in `App.jsx`

### Config Integration
- [ ] Imported scene in `UnifiedAdminConfig.jsx`
- [ ] Added to `DEFAULT_SCENES` in `UnifiedAdminConfig.jsx`
- [ ] Added case to config panel switch
- [ ] Added case to getDuration switch

### Build & Test
- [ ] `npm run build` succeeds
- [ ] No console errors
- [ ] Template appears in gallery
- [ ] Preview renders correctly
- [ ] Config panel works

### Documentation
- [ ] Summary file created
- [ ] Changes documented
- [ ] Testing results recorded

### Commit & Push
```bash
git add -A
git commit -m "Add TEST_YourTemplate_V6 with broadcast quality polish

- Increased sizing for full screen usage
- Replaced boxes with circular badges
- Added emphasis system for VO pacing
- Integrated glassmorphic effects
- Added Lottie animations
- Enforced text fitting and uniform sizing
- Added particle systems and spotlight effects

All features configurable via JSON.
Build tested and passing."

git push origin <branch-name>
```

---

## Priority Order for Remaining Templates

### High Priority (Core Templates)
These are frequently used and need immediate polish:

1. **Apply3AMicroQuiz_V6** - Interactive quiz template
2. **Reflect4AKeyTakeaways_V6** - Summary/review template
3. **Hook1AQuestionBurst_V6** - Opening hook template
4. **Compare11BeforeAfter_V6** - Comparison template

### Medium Priority (Specialized)
These are used for specific content types:

5. **Challenge13PollQuiz_V6** - Poll/survey template
6. **Spotlight14SingleConcept_V6** - Deep-dive template
7. **Connect15AnalogyBridge_V6** - Analogy template
8. **Compare12MatrixGrid_V6** - Feature comparison

### Lower Priority (Niche)
These are less frequently used:

9. **Hook1EAmbientMystery_V6** - Mystery/suspense hook
10. **Explain2BAnalogy_V6** - Side-by-side explanation
11. **Apply3BScenarioChoice_V6** - Decision scenario
12. **Reflect4DForwardLink_V6** - Transition template
13. **Quote16Showcase_V6** - Inspirational quotes
14. **Progress18Path_V6** - Journey/milestone template
15. **Reveal9ProgressiveUnveil_V6** - Layer-by-layer reveal

---

## Time Estimates Per Template

Based on completed examples:

| Task | Time | Notes |
|------|------|-------|
| **Initial audit** | 30 min | Review code, identify issues |
| **Sizing optimization** | 1 hour | Calculate new dimensions, adjust positions |
| **Visual style conversion** | 2 hours | Boxes → circles, add effects |
| **Emphasis system** | 1.5 hours | Add config, helper, apply |
| **Animation enhancement** | 1 hour | Layer effects, add Lottie |
| **Text fitting** | 45 min | Caps, overflow, uniform sizing |
| **Example scene** | 30 min | Create comprehensive demo |
| **Testing** | 30 min | Build, preview, config panel |
| **Integration** | 30 min | Gallery, router, app, config |
| **Documentation** | 15 min | Summary file |
| **TOTAL** | **8-9 hours** | Per template |

**Optimization**: After 2-3 templates, time reduces to ~6 hours as patterns become familiar.

---

## Success Metrics

A successfully polished template should achieve:

### Visual Quality
- ✅ Uses 90-95% of 1920x1080 screen space
- ✅ No box-based layouts (all circles/curves)
- ✅ Gradient backgrounds throughout
- ✅ Glassmorphic effects on key elements
- ✅ Particle systems visible
- ✅ Film grain texture applied
- ✅ Looks "broadcast-quality" not "PowerPoint"

### Functionality
- ✅ Emphasis system implemented (if applicable)
- ✅ Lottie animations integrated (arrows, checkmarks, etc.)
- ✅ Multi-layered entrance animations
- ✅ Smooth exit animations
- ✅ All elements timed with beats

### Technical
- ✅ Text fits in all containers (no overflow)
- ✅ Uniform sizing enforced (minWidth/minHeight)
- ✅ No screen edge overlaps
- ✅ Build succeeds without errors
- ✅ No console warnings
- ✅ Renders at 30fps smoothly

### Configuration
- ✅ All features exposed in CONFIG_SCHEMA
- ✅ Emphasis timing configurable
- ✅ Effect toggles work
- ✅ Sizing adjustable with safe ranges
- ✅ Config panel functional
- ✅ Example scene demonstrates all features

---

## Contact & Handoff

### What's Completed
- ✅ Methodology documented
- ✅ Step-by-step guide created
- ✅ Code patterns provided
- ✅ Testing checklist established
- ✅ 2 reference implementations completed:
  - `TEST_Explain2AConceptBreakdown_V6`
  - `TEST_Guide10StepSequence_V6`

### What's Next
Pick up any remaining V6 template and follow this guide to apply the same polish. Start with high-priority templates (quiz, takeaways, hook, comparison).

### Key Files to Reference
- `/workspace/KnoMotion-Videos/src/templates/Explain2AConceptBreakdown_V6.jsx` - Reference implementation
- `/workspace/KnoMotion-Videos/src/templates/Guide10StepSequence_V6.jsx` - Reference implementation
- `/workspace/KnoMotion-Videos/src/sdk/microDelights.jsx` - Animation helpers
- `/workspace/KnoMotion-Videos/src/sdk/broadcastEffects.tsx` - Visual effects
- `/workspace/KnoMotion-Videos/src/sdk/lottiePresets.js` - Lottie configs

### Questions?
Refer to:
- `SIZING_BOUNDS_FIXES.md` - Sizing methodology
- `V6-REVISED-TEMPLATES-SUMMARY.md` - Feature overview
- `TEST_TEMPLATES_NOW_WORKING.md` - Integration guide

---

**Status**: ✅ **Methodology Complete & Documented**

This guide should enable any agent to continue the template polish work with consistent quality and approach.
