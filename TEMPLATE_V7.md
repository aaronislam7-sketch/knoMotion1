# 🎬 Template V7.0 - Scene-Shell Architecture

**Version:** 7.0  
**Date:** December 2025  
**Status:** ✅ Core templates implemented, debugging phase  

---

## 📋 Overview

V7 represents a fundamental architectural shift from content-specific templates to **scene-shell templates** - abstract, reusable layout engines that accept flexible content via JSON configuration.

### Core Principle: Separation of Concerns

```
Templates (Scene-Shells)
├── Positioning & layout math ONLY
├── Container structures ONLY  
└── No animations, no content rendering

Mid-Level Components
├── ALL animations
├── ALL content rendering
├── ALL styling & behavior
└── Reusable across any template
```

**Critical Design Rule:** Templates are "dumb containers," mid-levels are "smart components."

---

## ✅ Progress Tracker

### Scene Templates (4 Total)

| Template | Status | Completion | Notes |
|----------|--------|------------|-------|
| **FullFrameScene** | ✅ Working | 90% | Needs animation enhancement |
| **GridLayoutScene** | ✅ Working | 85% | Rendering fixed, needs mid-level refactor |
| **StackLayoutScene** | ✅ Working | 95% | Row-based math complete |
| **FlowLayoutScene** | ✅ Working | 85% | Needs mid-level refactor |

### Mid-Level Components (2 Created, More Needed)

| Component | Status | Integration | Notes |
|-----------|--------|-------------|-------|
| **AppMosaic** | ⚠️ Created | Disabled | Needs refactor to pure mid-level |
| **FlowDiagram** | ⚠️ Created | Disabled | Needs refactor to pure mid-level |

### Outstanding Work

**High Priority:**
- [ ] Refactor templates to remove animations/rendering
- [ ] Move all rendering logic into mid-level components
- [ ] Remove debug borders and logging from Grid
- [ ] Add animation enhancements to FullFrame
- [ ] Re-enable and fix AppMosaic mid-level component
- [ ] Re-enable and fix FlowDiagram mid-level component

**Future Templates:**
- [ ] OverlayLayoutScene (mentioned in docs)
- [ ] SplitScreenScene (potential)
- [ ] TimelineScene (potential)

**Future Mid-Levels:**
- [ ] DataVisualization component
- [ ] StackItems component
- [ ] TextReveal component
- [ ] CodeBlock component
- [ ] Timeline component

---

## 🎯 Scene Template Specifications

### 1. FullFrameScene

**Purpose:** Single full-screen canvas with centered content

**Status:** ✅ Working (90% complete)

**Capabilities:**
- Centered content (title + main)
- Multiple content types (text, card, custom)
- Background effects (particles, spotlight, noise)
- Flexible aspect ratios (16:9, 9:16, 1:1)

**Current Issues & Fixes:**
- ✅ **FIXED:** NaN error in interpolate → Disabled `getScaleEmphasis` emphasis animation
- ✅ **FIXED:** Title off-center → Implemented flexbox container centering
- ⚠️ **TODO:** Add animation variety (currently basic fadeIn/scaleIn)

**File:** `KnoMotion-Videos/src/templates/v7/FullFrameScene.jsx`

---

### 2. GridLayoutScene

**Purpose:** N×M grid arrangement with auto-positioning

**Status:** ✅ Working (85% complete)

**Capabilities:**
- Auto-positioning in grid (columns, gap, spacing)
- Staggered entrance animations
- Responsive item sizing
- Title support
- Background effects

**Current Issues & Fixes:**
- ✅ **FIXED:** Items not rendering → Simplified animation, added debug logging
- ✅ **FIXED:** Debug code removed (red borders, console logs)
- ✅ **ARCHITECTURAL FIX:** Now uses AppMosaic mid-level component exclusively
  - Template only calculates grid positions
  - AppMosaic handles all rendering and animations
  - Proper separation of concerns achieved

**File:** `KnoMotion-Videos/src/templates/v7/GridLayoutScene.jsx`

---

### 3. StackLayoutScene

**Purpose:** Linear vertical/horizontal stack with sequential reveals

**Status:** ✅ Working (95% complete)

**Capabilities:**
- Vertical or horizontal stacking
- Row-based math calculation
  - Row 0 = Title row (120px reserved, protected)
  - Rows 1-7 = Stack items (max 7 items enforced)
- Permanent Marker font for step numbers (1, 2, 3, etc.)
- Sequential/staggered animations
- Automatic centering in available space

**Current Issues & Fixes:**
- ✅ **FIXED:** Title collision with first item → Implemented row-based math with protected title row
- ✅ **FIXED:** Too many visual elements → Removed glassmorphic panes, simplified styling
- ✅ **FIXED:** Emoji number badges → Replaced with Permanent Marker font numbers
- ⚠️ **ARCHITECTURAL ISSUE:** Has rendering logic in template (should be in StackItems mid-level)
- ⚠️ **TODO:** Refactor to use StackItems mid-level component

**Design Features:**
```javascript
// Row-based calculation
const titleRowHeight = 120;  // Row 0 reserved
const maxItems = Math.min(totalItems, 7);  // Cap at 7

// Permanent Marker font for numbers
fontFamily: '"Permanent Marker", cursive'
fontSize: 38
```

**File:** `KnoMotion-Videos/src/templates/v7/StackLayoutScene.jsx`

---

### 4. FlowLayoutScene

**Purpose:** Connected node diagrams with flow relationships

**Status:** ✅ Working (85% complete)

**Capabilities:**
- Node positioning (left-to-right, top-to-bottom)
- Animated edge connectors
- Text outside nodes (title + description)
- Simple clean node shapes (circles/squares)
- 2-letter abbreviations in nodes

**Current Issues & Fixes:**
- ✅ **FIXED:** Text too small and cut off → Moved text OUTSIDE nodes, increased font sizes
- ✅ **FIXED:** Over-complex visuals → Removed glassmorphic panes, emojis, simplified nodes
- ⚠️ **ARCHITECTURAL ISSUE:** Has simplified rendering in template (should be in FlowDiagram mid-level)
- ⚠️ **TODO:** Move simplified `renderNode` logic into FlowDiagram mid-level component

**Design Features:**
```javascript
// Container sized for text
width: size * 2.5  // 2.5x wider than node for text space

// Text styling
Label: 24px (outside node)
Description: 16px (outside node)
Node abbreviation: 40% of node size
```

**File:** `KnoMotion-Videos/src/templates/v7/FlowLayoutScene.jsx`

---

## 🐛 Critical Bugs Encountered & Fixed

### Bug 1: NaN Error in interpolate (FullFrameScene)

**Symptom:**
```
Uncaught Error: inputRange must contain only finite numbers, but got [NaN,NaN]
at getScaleEmphasis
```

**Root Cause:**  
The `getScaleEmphasis` SDK function was returning NaN values. Safety checks were insufficient.

**Fix Applied:**  
Completely disabled emphasis animation:
```javascript
// DISABLED: emphasis animation causes NaN errors
let emphasisScale = 1;
// getScaleEmphasis causes NaN errors, disabled until SDK fix
```

**Status:** ✅ Fixed  
**Prevention:** Do not use `getScaleEmphasis` until SDK function is fixed

---

### Bug 2: Grid Items Not Rendering (GridLayoutScene)

**Symptom:**  
Only title visible, no grid items appearing despite correct JSON.

**Root Cause:**  
Complex animation (`getCardEntrance`) or timing issues preventing visibility.

**Fix Applied:**
1. Simplified animation to basic `fadeIn`
2. Added debug red borders for visibility
3. Added extensive console logging
4. Disabled AppMosaic mid-level component

```javascript
// Simplified animation
let animStyle = fadeIn(frame, startFrame, duration);

// Debug border
border: '2px solid red'

// Debug logging
console.log('[GridItem]', index, 'Frame:', frame, 'Opacity:', animStyle.opacity);
```

**Status:** ✅ Fixed (items now visible)  
**TODO:** Remove debug code after testing  
**Prevention:** Test basic fadeIn before complex animations; use debug borders early

---

### Bug 3: Title Collision (StackLayoutScene)

**Symptom:**  
First stack item overlaps with scene title.

**Root Cause:**  
Position calculation didn't account for title height, used fixed top margin.

**Fix Applied:**  
Implemented row-based calculation:
```javascript
// Row 0 = Title row (120px reserved)
const titleRowHeight = 120;

// Calculate item positions starting AFTER title row
const startY = titleRowHeight + ((availableHeight - totalContentHeight) / 2);
```

**Status:** ✅ Fixed  
**Prevention:** Always use row-based math for vertical layouts with titles

---

### Bug 4: Text Cut Off & Unreadable (FlowLayoutScene)

**Symptom:**  
- Text squeezed inside nodes (too small)
- Text clipped with ellipsis
- Over-complex visuals (emojis, glass panes, circles)

**Root Cause:**  
All content forced inside fixed-size circular nodes.

**Fix Applied:**  
Moved text OUTSIDE nodes:
```javascript
// Wider container for text
width: size * 2.5,  // Was: size
height: size * 2.5, // Was: size

// Node with abbreviation only
<NodeCircle>
  {node.label.substring(0, 2)}  // First 2 chars
</NodeCircle>

// Text outside node
<Label style={{ fontSize: 24 }}>{node.label}</Label>
<Description style={{ fontSize: 16 }}>{node.description}</Description>
```

**Status:** ✅ Fixed  
**Prevention:** Never force text into constrained containers; use external labels

---

### Bug 5: Duration Calculation Returns Seconds Instead of Frames

**Symptom:**  
Scenes show 0 seconds or complete instantly.

**Root Cause:**  
`getDuration` functions returned seconds, Remotion expects frames.

**Fix Applied:**
```javascript
// BEFORE (wrong)
export const getDuration = (scene) => {
  return exitTime + 1.0;  // Returns seconds
};

// AFTER (correct)
export const getDuration = (scene, fps = 30) => {
  return Math.ceil((exitTime + 1.0) * fps);  // Returns frames
};
```

**Status:** ✅ Fixed (all templates)  
**Prevention:** Always multiply by fps in getDuration functions

---

## 🏗️ Architecture Issues & Required Refactoring

### Current Problem: Hybrid Architecture

**Templates currently contain:**
- ❌ Animation logic (should be in mid-levels)
- ❌ Rendering logic (should be in mid-levels)
- ❌ Styling decisions (should be in mid-levels)
- ✅ Position calculations (correct)
- ✅ Layout containers (correct)

**This violates the V7 principle:** Templates = positioning ONLY

### Impact

**Problem:** Mid-level components not truly reusable

**Example:**
```javascript
// Current: FlowDiagram can't be used elsewhere
// because simplified rendering is in FlowLayoutScene template

// Want to use FlowDiagram in StackLayoutScene?
// ❌ Won't get the simplified rendering (it's in the wrong place)
```

### Required Refactoring

#### 1. GridLayoutScene → AppMosaic

**Move from Template to Mid-Level:**
- `renderGridItem()` function
- All animations
- All styling (GlassmorphicPane, colors, etc.)

**Template should only:**
- Calculate grid positions
- Provide container
- Pass positions to AppMosaic

#### 2. StackLayoutScene → StackItems (new)

**Create StackItems mid-level component with:**
- All rendering logic
- Permanent Marker number rendering
- Animations
- Styling

**Template should only:**
- Calculate row positions (Row 0 = title, Rows 1-7 = items)
- Provide container
- Pass positions to StackItems

#### 3. FlowLayoutScene → FlowDiagram

**Move from Template to Mid-Level:**
- `renderNode()` function (simplified version)
- Text-outside-nodes logic
- Node styling
- All animations

**Template should only:**
- Calculate node positions
- Provide container
- Pass positions to FlowDiagram

#### 4. FullFrameScene → ContentRenderer (new)

**Create ContentRenderer mid-level component with:**
- Text/card/custom rendering
- All animations
- All styling

**Template should only:**
- Provide centered container
- Pass content to ContentRenderer

---

## 📊 JSON Schema V7.0

### Core Structure

```json
{
  "schema_version": "7.0",
  "scene_id": "unique-identifier",
  "template_id": "FullFrameScene",
  
  "content": {
    "title": "Optional title",
    "items": [...],
    "nodes": [...],
    "edges": [...]
  },
  
  "layout": {
    "columns": 3,
    "gap": 50,
    "direction": "vertical",
    "spacing": 60
  },
  
  "style_tokens": {
    "colors": {
      "bg": "#000000",
      "text": "#FFFFFF",
      "primary": "#FF6B35"
    },
    "fonts": {
      "size_title": 64,
      "family": "Inter, sans-serif"
    },
    "spacing": {
      "padding": 80
    }
  },
  
  "beats": {
    "entrance": 0.5,
    "title": 1.0,
    "firstItem": 2.0,
    "exit": 10.0
  },
  
  "animations": {
    "title": {
      "entrance": "fadeIn",
      "duration": 0.8
    },
    "items": {
      "entrance": "fadeIn",
      "duration": 0.6,
      "stagger": {
        "enabled": true,
        "delay": 0.15
      }
    }
  },
  
  "effects": {
    "particles": { "enabled": false },
    "spotlight": { "enabled": false },
    "noise": { "enabled": true, "opacity": 0.03 }
  },
  
  "mid_level_components": {
    "appMosaic": {
      "enabled": false
    },
    "flowDiagram": {
      "enabled": false
    }
  }
}
```

---

## 🚀 Implementation Guide

### Creating a New Scene Template

1. **Define the layout logic ONLY**
   ```javascript
   export const MyScene = ({ scene }) => {
     const positions = calculatePositions(...);  // Layout math
     
     return (
       <AbsoluteFill>
         {/* Just containers and positioning */}
         <Title position={titlePosition} />
         <MidLevelComponent 
           items={items}
           positions={positions}  // Pass positions to mid-level
         />
       </AbsoluteFill>
     );
   };
   ```

2. **NO animations in template**
   - All animations belong in mid-level components

3. **NO content rendering in template**
   - Delegate to mid-level components

4. **Export getDuration function**
   ```javascript
   export const getDuration = (scene, fps = 30) => {
     const exitTime = scene.beats?.exit || 10;
     return Math.ceil((exitTime + 1.0) * fps);  // FRAMES not seconds!
   };
   ```

5. **Register in TemplateRouter**
   ```javascript
   const V7_TEMPLATE_REGISTRY = {
     'MyScene': MyScene
   };
   ```

### Creating a New Mid-Level Component

1. **Handle ALL rendering and animations**
   ```javascript
   export const MyMidLevel = ({ items, positions, frame, fps }) => {
     return items.map((item, index) => {
       // Animations here
       const animStyle = fadeIn(frame, startFrame, duration);
       
       // Rendering here
       return (
         <div style={{ ...positions[index], ...animStyle }}>
           {/* All styling and content here */}
         </div>
       );
     });
   };
   ```

2. **Accept positions from template**
   - Template calculates positions
   - Mid-level uses positions for rendering

3. **Keep domain-agnostic**
   - Don't assume specific content types
   - Accept generic `items`, `nodes`, etc.

4. **Export validation function (optional)**
   ```javascript
   export const validateMyMidLevel = (config) => {
     return {
       valid: config.items?.length > 0,
       errors: [],
       warnings: []
     };
   };
   ```

---

## 📁 File Organization

```
KnoMotion-Videos/src/
├── templates/v7/
│   ├── FullFrameScene.jsx      ✅ 90% complete
│   ├── GridLayoutScene.jsx     ✅ 85% complete (has debug code)
│   ├── StackLayoutScene.jsx    ✅ 95% complete
│   └── FlowLayoutScene.jsx     ✅ 85% complete
│
├── sdk/components/mid-level/
│   ├── AppMosaic.jsx           ⚠️ Needs refactor
│   └── FlowDiagram.jsx         ⚠️ Needs refactor
│
├── scenes/v7/
│   ├── fullframe_example.json   ✅ Complete
│   ├── gridlayout_example.json  ✅ Complete
│   ├── stacklayout_example.json ✅ Complete
│   └── flowlayout_example.json  ✅ Complete
│
└── components/
    ├── TemplateRouter.jsx       ✅ V7 templates registered
    ├── TemplateGallery.jsx      ✅ V7 in staging catalog
    └── UnifiedAdminConfig.jsx   ✅ V7 templates configured
```

---

## 🎨 Design Features

### Font Support

**Permanent Marker Font** (Google Font)  
- Used in StackLayoutScene for step numbers
- Already loaded in `index.html`:
  ```html
  <link href="https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap" rel="stylesheet">
  ```

### Animation Styles

**Currently Supported:**
- `fadeIn` - Opacity 0 → 1
- `slideIn` - Slide from direction with fade
- `scaleIn` - Scale 0.7 → 1.0 with fade
- `cardEntrance` - Combined slide + glow (SDK function, use carefully)

**Avoid:**
- `getScaleEmphasis` - Has NaN bug, disabled

### Effects

**Background Effects:**
- Particles (ambient floating particles)
- Spotlight (gradient spotlight effect)
- Noise texture (film grain)

**Item Effects:**
- Glassmorphic panes (use sparingly, causes visual clutter)
- Box shadows
- Borders

---

## ⚠️ Known Limitations

1. **AppMosaic mid-level component** currently disabled
   - Has rendering but needs full refactor
   - GridLayoutScene uses inline rendering instead

2. **FlowDiagram mid-level component** currently disabled
   - Has old complex rendering
   - FlowLayoutScene uses simplified inline rendering instead

3. **Emphasis animations** disabled in FullFrameScene
   - `getScaleEmphasis` causes NaN errors
   - Needs SDK fix

4. **Debug code present** in GridLayoutScene
   - Red borders: `border: '2px solid red'`
   - Console logging: `console.log('[GridItem]', ...)`
   - Remove after testing confirms stability

5. **Templates have rendering logic** (architectural debt)
   - All templates need refactoring
   - Move rendering to mid-level components
   - Templates should only do position calculations

6. **Max 7 items** in StackLayoutScene
   - Intentional design decision for readability
   - Can be increased if needed

---

## 🧪 Testing Checklist

### Before Committing Changes

- [ ] All 4 templates render without errors
- [ ] Durations are correct (12-16 seconds each)
- [ ] Titles are centered and visible
- [ ] Items render and animate properly
- [ ] No NaN errors in console
- [ ] No red debug borders (remove before commit)
- [ ] No excessive console logging (remove debug logs)
- [ ] JSON examples load correctly
- [ ] Template Gallery shows V7 templates in staging
- [ ] UnifiedAdminConfig loads V7 templates

### Testing Individual Templates

**FullFrameScene:**
- [ ] Title centered
- [ ] Main content centered
- [ ] No NaN errors
- [ ] Background effects work
- [ ] Duration ~12 seconds

**GridLayoutScene:**
- [ ] 6 items render in 3x2 grid
- [ ] Items are visible (check for red borders)
- [ ] Title appears above grid
- [ ] Staggered animations work
- [ ] Duration ~14 seconds

**StackLayoutScene:**
- [ ] Title in Row 0 (protected space)
- [ ] Max 7 items stack vertically
- [ ] Numbers use Permanent Marker font
- [ ] No emoji badges
- [ ] No collision with title
- [ ] Duration ~14 seconds

**FlowLayoutScene:**
- [ ] Nodes render with 2-letter abbreviations
- [ ] Text appears OUTSIDE nodes
- [ ] Labels are 24px, readable
- [ ] Descriptions are 16px, readable
- [ ] Edges connect nodes properly
- [ ] Duration ~16 seconds

---

## 📚 Related Documentation

- `README.md` - Project overview
- `MigrationPlan.md` - V7 architecture design
- `SDK.md` - Available SDK utilities
- `CONFIGURATION.md` - JSON configuration guide
- `TEMPLATES.md` - Template usage guide

---

## ✅ Recent Refactoring (Dec 2025)

### Completed: GridLayoutScene Architecture Refactoring

**Tasks Completed:**
1. ✅ **Removed all debug code** - Red borders, console logs eliminated
2. ✅ **Refactored to use AppMosaic exclusively** - Proper separation of concerns

**Architecture Changes:**

**Before (Hybrid - Wrong):**
- Template had rendering logic (renderGridItem function)
- Template had animation logic (fadeIn, slideIn, etc.)
- Template styled items directly (GlassmorphicPane, etc.)
- **Not reusable** - logic trapped in template

**After (Clean - Correct):**
- Template ONLY calculates grid positions ✅
- Template is flexible - works with ANY mid-level ✅
- Mid-level receives positions and renders content ✅
- **True flexibility** - Grid can use AppMosaic, FlowDiagram, or any other mid-level ✅

**Impact:**
```javascript
// Now possible: Use AppMosaic anywhere
<FullFrameScene>
  <AppMosaic items={[...]} />  // ✅ Same behavior
</FullFrameScene>

<StackLayoutScene>
  <AppMosaic items={[...]} />  // ✅ Same behavior
</StackLayoutScene>
```

**Files Modified:**
- `GridLayoutScene.jsx` - Removed 130 lines of rendering logic
- `AppMosaic.jsx` - Now accepts positions from template
- `gridlayout_example.json` - Re-enabled AppMosaic

---

## 🎯 Next Actions

### Immediate (Priority 1)
1. ✅ **Test Grid rendering** - DONE
2. ✅ **Remove debug code from Grid** - DONE
3. ✅ **Refactor GridLayoutScene** - DONE
4. 🔄 **Test all 4 templates end-to-end** - Full animation sequences

### Short Term (Priority 2 - Optional)
5. 🔄 **Refactor StackLayoutScene** - Create StackItems mid-level (same pattern as Grid)
6. 🔄 **Refactor FlowLayoutScene** - Move simplified rendering to FlowDiagram
7. 🔄 **Refactor FullFrameScene** - Create ContentRenderer mid-level
8. 🔄 **Add animation variety** - More entrance/exit options for FullFrame

### Long Term (Priority 3)
9. 🔄 **Create additional mid-levels** - DataVisualization, Timeline, CodeBlock
10. 🔄 **Create additional templates** - OverlayLayout, SplitScreen, Timeline
11. 🔄 **Fix getScaleEmphasis SDK function** - Re-enable emphasis animations
12. 🔄 **Performance optimization** - Lazy loading, code splitting
13. 🔄 **Comprehensive testing suite** - Unit tests for all templates

---

## ✅ Success Criteria

V7 templates are complete when:
- [x] All 4 core templates working without errors
- [x] All templates use consistent JSON schema
- [x] Duration calculations return frames (not seconds)
- [ ] No debug code in production
- [ ] All rendering in mid-level components (not templates)
- [ ] Mid-level components reusable across templates
- [ ] Comprehensive example JSONs for each template
- [ ] Documentation complete and accurate
- [ ] All critical bugs fixed and documented

**Current Status: 85% Complete** ✅

---

**Last Updated:** December 2025  
**Maintained By:** Development Team  
**Version:** 7.0.0
