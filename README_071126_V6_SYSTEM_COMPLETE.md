# V6 Template System - Complete Implementation Guide
**Date:** November 7, 2025  
**Status:** Production Ready ✅

---

## 🎯 What We Built

A **fully functional, agnostic template system** for creating educational video content with:

- **8 Action-Based Learning Intentions** (replacing rigid H.E.A.R. framework)
- **Visual Template Gallery** with intention filtering
- **Interactive Admin Config Tool** for zero-code template customization
- **Live Preview System** with Remotion Player integration
- **3 Production-Ready V6 Templates** demonstrating all principles
- **Complete SDK** with shared utilities, animations, and effects

---

## 🏗️ Core Architectural Principles

### 1. **Agnostic Template System (6 Principals)**

Every V6 template adheres to these non-negotiable rules:

#### Principal 1: Type-Based Polymorphism
```javascript
// Visuals use a registry system - no hardcoding
visual: {
  type: 'roughSVG' | 'image' | 'lottie' | 'emoji' | 'custom',
  // ... type-specific config
}
```

#### Principal 2: Data-Driven Structure
```javascript
// Dynamic arrays for scalable content
stages: [
  { headline: '...', description: '...', visual: {...} },
  { headline: '...', description: '...', visual: {...} }
  // 2-5 stages, fully configurable
]
```

#### Principal 3: Token-Based Positioning
```javascript
// Semantic positioning, not pixel values
position: 'top-center' | 'center' | 'bottom-left' // etc
offset: { x: 0, y: 40 } // Fine-tuning only
```

#### Principal 4: Separation of Concerns
```javascript
// Independent layers
content: { /* text, data */ }
layout: { /* position, spacing */ }
style: { /* colors, fonts */ }
animation: { /* timing, easing */ }
```

#### Principal 5: Progressive Configuration
```javascript
// Simple defaults, advanced options available
const DEFAULT_CONFIG = {
  revealStyle: 'curtain',  // Simple
  beats: { /* timing */ }, // Advanced
  animation: { /* advanced easing */ }
};
```

#### Principal 6: Registry Pattern
```javascript
// Extensible without template modifications
const HERO_TYPES = {
  'roughSVG': RoughSVGRenderer,
  'image': ImageRenderer,
  'custom': CustomRenderer
  // New types added here
};
```

---

### 2. **Learning Intentions Architecture**

**Replaced:** Rigid H.E.A.R. (Hook, Explain, Apply, Reflect) framework  
**With:** 8 flexible, action-based intentions

| Intention | Purpose | Example Templates |
|-----------|---------|-------------------|
| **QUESTION** | Spark curiosity, pose problems | Question Burst |
| **REVEAL** | Progressive disclosure, build suspense | Progressive Unveil (#9) |
| **COMPARE** | Side-by-side contrast, before/after | Before/After (#11) |
| **BREAKDOWN** | Deconstruct concepts, explain parts | Concept Breakdown |
| **GUIDE** | Step-by-step instructions, processes | Step Sequence (#10) |
| **CHALLENGE** | Interactive problems, quizzes | Micro Quiz |
| **CONNECT** | Link ideas, show relationships | Forward Link |
| **INSPIRE** | Motivation, real-world impact | Story Arc |

**Benefits:**
- ✅ Templates can serve multiple intentions
- ✅ AI-friendly categorization
- ✅ Microlearning compatible
- ✅ Reusable across domains

---

### 3. **Interactive Configuration Principal**

**Rule:** Every template parameter must be configurable through UI controls.

**Implementation:**
- Each template exports a `CONFIG_SCHEMA`
- Admin Config panels expose all parameters
- Changes update live in Remotion Player
- JSON export for programmatic use

**UI Control Types:**
- Text inputs (strings)
- Textareas (multiline)
- Sliders (numbers)
- Dropdowns (enums)
- Checkboxes (booleans)
- Color pickers
- Dynamic arrays (add/remove items)
- Position selectors

---

## 📦 What's Included

### Production-Ready Templates (3)

#### 1. **Reveal9ProgressiveUnveil** (v6.0)
- **Primary Intention:** REVEAL
- **Features:** 2-5 dynamic stages, 4 reveal styles (curtain, fade, slide, zoom)
- **Use Cases:** Mystery reveals, progressive explanations, suspense building
- **Config:** `/src/components/configs/Reveal9Config.jsx`

#### 2. **Guide10StepSequence** (v6.0)
- **Primary Intention:** GUIDE
- **Features:** 2-8 numbered steps, 3 layouts, 4 connection styles
- **Use Cases:** Tutorials, processes, instructions, workflows
- **Config:** `/src/components/configs/Guide10Config.jsx`

#### 3. **Compare11BeforeAfter** (v6.0)
- **Primary Intention:** COMPARE
- **Features:** Split-screen, vertical/horizontal, 4 transition styles
- **Use Cases:** Transformations, comparisons, contrasts
- **Config:** `/src/components/configs/Compare11Config.jsx`

### Existing V5 Templates (8)

These need config panels and intention metadata:
1. Hook1A - Question Burst
2. Hook1E - Ambient Mystery
3. Explain2A - Concept Breakdown
4. Explain2B - Visual Analogy
5. Apply3A - Micro Quiz
6. Apply3B - Scenario Choice
7. Reflect4A - Key Takeaways
8. Reflect4D - Forward Link

---

## 🚀 How to Add a New V6 Template

### Step 1: Create the Template File

**Location:** `/src/templates/YourTemplate_V6.jsx`

```javascript
import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';
import { 
  EZ, 
  toFrames, 
  renderHero,
  mergeHeroConfig,
  resolvePosition,
  positionToCSS,
  generateAmbientParticles,
  renderAmbientParticles
} from '../sdk';

/**
 * TEMPLATE #XX: YOUR TEMPLATE NAME - v6.0
 * 
 * PRIMARY INTENTION: [INTENTION]
 * SECONDARY INTENTIONS: [INTENTION], [INTENTION]
 * 
 * PURPOSE: [What this template does]
 * 
 * VISUAL PATTERN:
 * - [Key feature 1]
 * - [Key feature 2]
 * 
 * AGNOSTIC PRINCIPALS:
 * ✓ Type-Based Polymorphism (hero registry for visuals)
 * ✓ Data-Driven Structure (dynamic arrays)
 * ✓ Token-Based Positioning (semantic layout)
 * ✓ Separation of Concerns (independent layers)
 * ✓ Progressive Configuration (simple defaults)
 * ✓ Registry Pattern (extensible types)
 */

// DEFAULT CONFIGURATION - NO HARDCODING!
const DEFAULT_CONFIG = {
  title: {
    text: 'Your Template Title',
    position: 'top-center',
    offset: { x: 0, y: 40 }
  },
  
  // Your template-specific config
  items: [
    { /* item 1 */ },
    { /* item 2 */ }
  ],
  
  style_tokens: {
    colors: {
      bg: '#1A1A2E',
      accent: '#FF6B35',
      accent2: '#9B59B6',
      ink: '#EAEAEA'
    },
    fonts: {
      size_title: 64,
      size_item: 32
    }
  },
  
  beats: {
    entrance: 0.4,
    titleEntry: 0.6,
    itemInterval: 2.0,
    exit: 2.0
  },
  
  animation: {
    entrance: 'fade-up',
    easing: 'power3InOut'
  }
};

// MAIN COMPONENT
export const YourTemplate = ({ scene, styles, presets, easingMap }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  
  // Merge scene with defaults
  const config = {
    ...DEFAULT_CONFIG,
    ...scene,
    title: { ...DEFAULT_CONFIG.title, ...(scene.title || {}) },
    style_tokens: {
      colors: { ...DEFAULT_CONFIG.style_tokens.colors, ...(scene.style_tokens?.colors || {}) },
      fonts: { ...DEFAULT_CONFIG.style_tokens.fonts, ...(scene.style_tokens?.fonts || {}) }
    },
    beats: { ...DEFAULT_CONFIG.beats, ...(scene.beats || {}) },
    animation: { ...DEFAULT_CONFIG.animation, ...(scene.animation || {}) }
  };
  
  const colors = config.style_tokens.colors;
  const fonts = config.style_tokens.fonts;
  const beats = config.beats;
  
  // Ambient particles (use NUMERIC seed!)
  const particles = generateAmbientParticles(20, 12001, width, height);
  const particleElements = renderAmbientParticles(particles, frame, fps, [colors.accent, colors.accent2, colors.bg]);
  
  // Your template logic here...
  
  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      {/* Ambient particles */}
      <svg style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 0, opacity: 0.3 }} viewBox="0 0 1920 1080">
        {particleElements.map(p => p.element)}
      </svg>
      
      {/* Your template content */}
    </AbsoluteFill>
  );
};

// REQUIRED EXPORTS
export const TEMPLATE_ID = 'YourTemplate';
export const TEMPLATE_VERSION = '6.0.0';

// CRITICAL: Attach to component for TemplateRouter detection
YourTemplate.TEMPLATE_VERSION = '6.0.0';
YourTemplate.TEMPLATE_ID = 'YourTemplate';

export const LEARNING_INTENTIONS = {
  primary: ['intention'],
  secondary: ['intention2', 'intention3'],
  tags: ['tag1', 'tag2', 'tag3']
};

// Duration calculation based on content
export const getDuration = (scene, fps) => {
  const config = { ...DEFAULT_CONFIG, ...scene };
  const beats = { ...DEFAULT_CONFIG.beats, ...(scene.beats || {}) };
  const items = config.items || DEFAULT_CONFIG.items;
  
  const totalDuration = beats.titleEntry + (items.length * beats.itemInterval) + beats.exit;
  return toFrames(totalDuration, fps);
};

export const CAPABILITIES = {
  usesSVG: false,
  usesRoughJS: false,
  usesLottie: false,
  requiresAudio: false,
  dynamicItems: true,
  maxItems: 8,
  minItems: 2
};

export const CONFIG_SCHEMA = {
  title: {
    type: 'object',
    fields: {
      text: { type: 'string', required: true },
      position: { type: 'position-token', default: 'top-center' },
      offset: { type: 'offset', default: { x: 0, y: 40 } }
    }
  },
  items: {
    type: 'dynamic-array',
    min: 2,
    max: 8,
    itemSchema: {
      title: { type: 'string', required: true },
      description: { type: 'string' },
      visual: { type: 'polymorphic-hero', optional: true }
    }
  },
  style_tokens: {
    type: 'style-tokens',
    colors: ['bg', 'accent', 'accent2', 'ink'],
    fonts: ['size_title', 'size_item']
  },
  beats: {
    type: 'timeline',
    beats: ['entrance', 'titleEntry', 'itemInterval', 'exit']
  },
  animation: {
    type: 'animation-config',
    options: {
      entrance: ['fade-up', 'slide-left', 'pop', 'bounce'],
      easing: ['power3InOut', 'backOut', 'elasticOut']
    }
  }
};
```

### Step 2: Register in TemplateRouter

**File:** `/src/templates/TemplateRouter.jsx`

```javascript
// Add import
import { YourTemplate } from './YourTemplate_V6';

// Add to registry
const V6_TEMPLATE_REGISTRY = {
  'Reveal9ProgressiveUnveil': Reveal9ProgressiveUnveil,
  'Guide10StepSequence': Guide10StepSequence,
  'Compare11BeforeAfter': Compare11BeforeAfter,
  'YourTemplate': YourTemplate  // ← Add here
};
```

### Step 3: Create Config Panel

**File:** `/src/components/configs/YourTemplateConfig.jsx`

```javascript
import React from 'react';

export const YourTemplateConfig = ({ scene, onUpdate }) => {
  
  const updateField = (path, value) => {
    const newScene = { ...scene };
    // Update nested field logic
    onUpdate(newScene);
  };
  
  return (
    <div style={{ padding: 20, backgroundColor: '#FFFFFF', borderRadius: 8 }}>
      <h3>Your Template Configuration</h3>
      
      {/* Title */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ fontWeight: 700, fontSize: 14 }}>Title Text</label>
        <input 
          type="text"
          value={scene.title?.text || ''}
          onChange={(e) => updateField('title.text', e.target.value)}
          style={{ width: '100%', padding: 8, fontSize: 14 }}
        />
      </div>
      
      {/* Add more controls for all CONFIG_SCHEMA fields */}
    </div>
  );
};
```

### Step 4: Add to UnifiedAdminConfig

**File:** `/src/components/UnifiedAdminConfig.jsx`

```javascript
// Import template module
import * as YourTemplateModule from '../templates/YourTemplate_V6';

// Import config panel
import { YourTemplateConfig } from './configs/YourTemplateConfig';

// Import example scene
import yourTemplateExample from '../scenes/your_template_example.json';

// Add to DEFAULT_SCENES
const DEFAULT_SCENES = {
  'Reveal9ProgressiveUnveil': reveal9Example,
  'Guide10StepSequence': guide10Example,
  'Compare11BeforeAfter': compare11Example,
  'YourTemplate': yourTemplateExample  // ← Add here
};

// Add to getDurationInFrames
const getDurationInFrames = () => {
  // ...
  switch (selectedTemplateId) {
    case 'Reveal9ProgressiveUnveil':
      return Reveal9Module.getDuration(scene, fps);
    case 'Guide10StepSequence':
      return Guide10Module.getDuration(scene, fps);
    case 'Compare11BeforeAfter':
      return Compare11Module.getDuration(scene, fps);
    case 'YourTemplate':
      return YourTemplateModule.getDuration(scene, fps);  // ← Add here
    default:
      return 450;
  }
};

// Add to renderConfigPanel
const renderConfigPanel = () => {
  switch (selectedTemplateId) {
    case 'Reveal9ProgressiveUnveil':
      return <Reveal9Config scene={scene} onUpdate={handleSceneUpdate} />;
    case 'Guide10StepSequence':
      return <Guide10Config scene={scene} onUpdate={handleSceneUpdate} />;
    case 'Compare11BeforeAfter':
      return <Compare11Config scene={scene} onUpdate={handleSceneUpdate} />;
    case 'YourTemplate':
      return <YourTemplateConfig scene={scene} onUpdate={handleSceneUpdate} />;  // ← Add here
    default:
      return <div>Select a template</div>;
  }
};
```

### Step 5: Create Example Scene JSON

**File:** `/src/scenes/your_template_example.json`

```json
{
  "schema_version": "6.0",
  "scene_id": "your_template_example",
  "template_id": "YourTemplate",
  "learning_intentions": {
    "primary": ["intention"],
    "secondary": ["intention2"],
    "tags": ["tag1", "tag2"]
  },
  
  "title": {
    "text": "Example Title",
    "position": "top-center",
    "offset": { "x": 0, "y": 40 }
  },
  
  "items": [
    {
      "title": "Item 1",
      "description": "Description 1",
      "visual": null
    },
    {
      "title": "Item 2",
      "description": "Description 2",
      "visual": {
        "type": "emoji",
        "emoji": "✨",
        "size": 80
      }
    }
  ],
  
  "style_tokens": {
    "colors": {
      "bg": "#1A1A2E",
      "accent": "#FF6B35",
      "accent2": "#9B59B6",
      "ink": "#EAEAEA"
    },
    "fonts": {
      "size_title": 64,
      "size_item": 32
    }
  },
  
  "beats": {
    "entrance": 0.4,
    "titleEntry": 0.6,
    "itemInterval": 2.0,
    "exit": 2.0
  },
  
  "animation": {
    "entrance": "fade-up",
    "easing": "power3InOut"
  }
}
```

### Step 6: Update TemplateGallery

**File:** `/src/components/TemplateGallery.jsx`

Add your template to the `TEMPLATE_METADATA` array:

```javascript
{
  id: 'YourTemplate',
  name: 'Your Template Name',
  description: 'Brief description of what it does',
  icon: '🎨',
  version: '6.0.0',
  primary_intention: 'intention',
  secondary_intentions: ['intention2', 'intention3'],
  tags: ['tag1', 'tag2'],
  status: 'production'
}
```

---

## 📋 Template Roadmap

### ✅ Complete (3 templates)
- [x] #9: Reveal - Progressive Unveil
- [x] #10: Guide - Step Sequence  
- [x] #11: Compare - Before/After

### 🚧 Priority 1: Next 3 Templates (Est. 16-21 hours)
- [ ] **#12: Timeline Journey** (CONNECT)
  - Horizontal timeline with events, dates, milestones
  - 3-10 events, past/present/future markers
  - Connection lines, era highlighting
  - **Use Cases:** History, project phases, career paths

- [ ] **#13: Data Visualization** (BREAKDOWN)
  - Bar charts, pie charts, line graphs
  - Animated data entry, comparison modes
  - Data points: 3-8 items
  - **Use Cases:** Statistics, comparisons, trends

- [ ] **#14: Story Arc** (INSPIRE)
  - Narrative progression: setup → conflict → resolution
  - 3-5 story beats with visuals
  - Emotional arc indicators
  - **Use Cases:** Case studies, customer journeys, narratives

### 🔜 Priority 2: Next 3 Templates (Est. 16-21 hours)
- [ ] **#15: Comparison Matrix** (COMPARE)
  - 2x2 or 3x3 grid comparison
  - Feature checkmarks, ratings, highlights
  - **Use Cases:** Product comparisons, pros/cons, options

- [ ] **#16: Mind Map** (CONNECT)
  - Central concept with 3-7 branches
  - Radial layout, animated connections
  - **Use Cases:** Concept relationships, brainstorming, systems

- [ ] **#17: Flip Cards** (REVEAL/QUESTION)
  - 2-6 cards with front/back content
  - Flip animation, grid layout
  - **Use Cases:** Flashcards, definitions, Q&A

### 🎯 Priority 3: Final 3 Templates (Est. 16-21 hours)
- [ ] **#18: Progress Path** (GUIDE)
  - Journey visualization: start → checkpoints → goal
  - Progress indicators, milestone celebrations
  - **Use Cases:** Learning paths, goal tracking, journeys

- [ ] **#19: Challenge Board** (CHALLENGE)
  - Problem presentation with solution reveal
  - Think time, hint system, answer options
  - **Use Cases:** Puzzles, practice problems, assessments

- [ ] **#20: Quote Typography** (INSPIRE)
  - Large typography quote with attribution
  - Background visuals, animated text reveal
  - **Use Cases:** Motivation, expert quotes, key messages

### 📊 Total Template Suite
- **V6 Templates:** 20 total (3 complete, 17 planned)
- **V5 Templates:** 8 existing (need config panels + metadata)
- **Grand Total:** 28 templates

---

## 🔧 Critical Implementation Notes

### ⚠️ Common Pitfalls (Lessons Learned)

#### 1. **TEMPLATE_VERSION Must Be Attached to Component**
```javascript
// ❌ WRONG - Won't be detected by TemplateRouter
export const TEMPLATE_VERSION = '6.0.0';

// ✅ CORRECT - Attach to component function
export const TEMPLATE_VERSION = '6.0.0';
YourTemplate.TEMPLATE_VERSION = '6.0.0';
```

#### 2. **Particle Seeds Must Be Numeric**
```javascript
// ❌ WRONG - Causes NaN errors
const particles = generateAmbientParticles(20, 'my-seed', width, height);

// ✅ CORRECT - Use unique numbers
const particles = generateAmbientParticles(20, 12001, width, height);
```

#### 3. **Particle Rendering Requires Element Extraction**
```javascript
// ❌ WRONG - Renders {key, element} objects
{particleElements}

// ✅ CORRECT - Extract .element property
<svg viewBox="0 0 1920 1080">
  {particleElements.map(p => p.element)}
</svg>
```

#### 4. **renderHero Needs All 6 Parameters**
```javascript
// ❌ WRONG - Missing easingMap and fps
renderHero(config, frame, beats, colors)

// ✅ CORRECT - All parameters
renderHero(config, frame, beats, colors, EZ, fps)
```

#### 5. **Duration Calculation Must Account for Dynamic Content**
```javascript
// ❌ WRONG - Fixed duration
export const getDuration = (scene, fps) => toFrames(10, fps);

// ✅ CORRECT - Calculate based on content
export const getDuration = (scene, fps) => {
  const items = scene.items || DEFAULT_CONFIG.items;
  const beats = { ...DEFAULT_CONFIG.beats, ...(scene.beats || {}) };
  const totalDuration = beats.titleEntry + (items.length * beats.itemInterval) + beats.exit;
  return toFrames(totalDuration, fps);
};
```

---

## 📚 Documentation Structure

### Core Documentation
- **`README_071126_V6_SYSTEM_COMPLETE.md`** ← You are here
- **`README_CONSOLIDATED.md`** - Original 15,000-word system overview
- **`INTERACTIVE_CONFIGURATION_PRINCIPAL.md`** - UI configuration standards
- **`PEDAGOGICAL_STRUCTURE_ANALYSIS.md`** - Learning intentions analysis

### Implementation Records
- **`NEW_LEARNING_INTENTIONS_SYSTEM.md`** - 8 intentions + template mapping
- **`V6_NEW_INTENTION_SYSTEM_COMPLETE.md`** - V6 pivot completion summary
- **`ADMIN_CONFIG_V6_COMPLETE.md`** - Admin Config UI guide
- **`V6_TEMPLATES_FULLY_WORKING.md`** - Success summary + QA checklist

### Technical Fixes
- **`V6_PREVIEW_FIX.md`** - Complete debugging journey (6 critical fixes)
- **`COLLISION_DETECTION_IMPLEMENTATION.md`** - Layout validation system
- **`AGNOSTIC_TEMPLATE_SYSTEM_COMPLETE.md`** - 6 principals explained

### Quick Start Guides
- **`QUICK_START_ADMIN_CONFIG.md`** - 30-second config tool guide
- **`QUICK_START_COLLISION_DETECTION.md`** - Collision system usage
- **`ADMIN_CONFIG_GUIDE.md`** - Detailed configuration walkthrough

---

## 🎬 How to Use the System

### For End Users (Educators, Content Creators)

1. **Start the dev server:**
```bash
cd /workspace/KnoMotion-Videos
npm run dev
```

2. **Open browser** and click **"🎛️ NEW: Template Gallery & Config"**

3. **Select a template** from the visual gallery

4. **Configure** using the interactive controls:
   - Edit text, colors, fonts
   - Add/remove stages or steps
   - Adjust timing and animations
   - Upload visuals (coming soon)

5. **Preview live** in the Remotion Player

6. **Export JSON** for use in production

### For Developers

1. **Clone the repository**

2. **Install dependencies:**
```bash
npm install
```

3. **Run dev server:**
```bash
npm run dev
```

4. **Build for production:**
```bash
npm run build
```

5. **Render videos:**
```bash
npm run render -- src/scenes/your_scene.json
```

---

## 🏆 Success Metrics

✅ **System Status:**
- 3 V6 templates production-ready
- Zero hardcoded values in V6 templates
- 100% UI-JSON-JSX alignment
- Interactive config tool fully functional
- Live preview working with all templates
- Build passes with no errors
- No console warnings or errors
- All 6 Agnostic Principals implemented

✅ **Quality Assurance:**
- Templates render at 30fps smoothly
- Duration calculation accurate
- Particle systems working
- Animations smooth with proper easing
- All SDK utilities functional
- Documentation comprehensive

---

## 🚀 Next Steps

### Immediate (Week 1-2)
1. Build Priority 1 templates (#12-14)
2. Create config panels for templates #12-14
3. Add template selection to gallery

### Short-term (Week 3-4)
1. Build Priority 2 templates (#15-17)
2. Update 8 existing V5 templates with intention metadata
3. Create config panels for V5 templates

### Medium-term (Week 5-6)
1. Build Priority 3 templates (#18-20)
2. Implement preset save/load system
3. Add visual position picker
4. Drag-drop asset upload

### Long-term
1. Schema-driven control generation
2. Timeline scrubber with keyframes
3. Template marketplace
4. AI-powered scene generation

---

## 📞 Support

For questions, issues, or contributions:
- Review documentation in `/workspace/*.md`
- Check technical fix log in `V6_PREVIEW_FIX.md`
- Follow template creation guide above
- Refer to existing V6 templates as examples

---

**Built with:** React, Remotion, Vite  
**Architecture:** Agnostic Template System v6.0  
**Status:** Production Ready ✅  
**Last Updated:** November 7, 2025
