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
