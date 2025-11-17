# 🚀 Migration Plan: Content-Shell to Scene-Shell Architecture

**Purpose:** Migrate from content-shell templates (tightly coupled to specific content structures) to scene-shell templates (flexible layouts that accept any content)

**Status:** Planning Phase  
**Approach:** Clean break with new JSON structure, parallel development, staged rollout

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture Vision](#architecture-vision)
3. [10 Core Scene Templates](#10-core-scene-templates)
4. [Mid-Level Components](#mid-level-components)
5. [JSON Structure](#json-structure)
6. [Animation System](#animation-system)
7. [Compatibility Matrix](#compatibility-matrix)
8. [Implementation Phases](#implementation-phases)
9. [Migration Strategy](#migration-strategy)

---

## 🎯 Overview

### Current State (Content-Shell)
- **17 V6 templates** - Each tightly coupled to specific content structures
- **Example:** `Explain2AConceptBreakdown_V6` expects `center`, `parts`, `connections`
- **Problem:** Need new template for each content variation
- **SDK:** Rich animation/effect utilities (80% reusable)

### Target State (Scene-Shell)
- **10 abstract scene templates** - Layout patterns that accept flexible content
- **Example:** `HubSpokeScene` accepts any content structure via `content.items[]`
- **Benefit:** Reuse scenes with different content types
- **SDK:** Enhanced with new animations, same core utilities

### Key Principles
1. **Abstract layouts** - Scenes define layout patterns, not content structures
2. **Content agnostic** - Same scene works for different content types
3. **Composable** - Mid-level components can be mixed and matched
4. **Animation complete** - All scenes support all animations (with future flexibility)

---

## 🏗️ Architecture Vision

### Layer Structure

```
┌─────────────────────────────────────────┐
│   Scene Templates (10 abstract layouts) │
│   - HubSpokeScene                       │
│   - SplitLayoutScene                     │
│   - GridLayoutScene                      │
│   - etc.                                 │
└──────────────┬──────────────────────────┘
               │ uses
┌──────────────▼──────────────────────────┐
│   Mid-Level Components (3 core)         │
│   - AppMosaic                            │
│   - FlowDiagram                          │
│   - TimelineStrip                        │
└──────────────┬──────────────────────────┘
               │ uses
┌──────────────▼──────────────────────────┐
│   Primitives (Layout + Visual)          │
│   - Frames (FullFrame, SplitFrame, etc.)│
│   - Containers (Card, Panel, etc.)      │
│   - Text (TitleText, BodyText, etc.)    │
└──────────────┬──────────────────────────┘
               │ uses
┌──────────────▼──────────────────────────┐
│   Motion System (Animation Utilities)   │
│   - Entrance/Exit animations            │
│   - Emphasis animations                 │
│   - Path & Flow animations              │
│   - Camera/Composition animations       │
└─────────────────────────────────────────┘
```

---

## 🎬 10 Core Scene Templates

### Scene 1: FullFrameScene
**Differentiator:** Single full-screen canvas, one main content area

**Layout Pattern:**
- Full 1920x1080 canvas
- Single centered content area (configurable size)
- Optional title at top
- Optional background effects

**Use Cases:**
- Title cards
- Single concept focus
- Quote displays
- Hero visuals

**Content Structure:**
```json
{
  "content": {
    "main": { /* flexible content */ },
    "title": { /* optional */ }
  }
}
```

**Key Features:**
- Centered content positioning
- Responsive sizing (80-95% of screen)
- Background layer support

---

### Scene 2: SplitLayoutScene
**Differentiator:** Two-panel split (configurable ratio: 50/50, 60/40, 70/30)

**Layout Pattern:**
- Vertical or horizontal split
- Two independent content areas
- Optional divider line
- Configurable split ratio

**Use Cases:**
- Before/after comparisons
- Side-by-side concepts
- Visual + text explanations
- A/B scenarios

**Content Structure:**
```json
{
  "content": {
    "left": { /* flexible content */ },
    "right": { /* flexible content */ }
  },
  "layout": {
    "split": "vertical", // or "horizontal"
    "ratio": 0.5 // 0.0 to 1.0
  }
}
```

**Key Features:**
- Dynamic split ratio
- Independent animations per panel
- Optional divider with animation

---

### Scene 3: HubSpokeScene
**Differentiator:** Central hub with radiating spokes (circular arrangement)

**Layout Pattern:**
- Central element (hub)
- 2-8 surrounding elements (spokes)
- Circular/radial positioning
- Optional connecting lines

**Use Cases:**
- Concept breakdowns
- Central idea with supporting points
- Relationship mapping
- Feature sets

**Content Structure:**
```json
{
  "content": {
    "hub": { /* central content */ },
    "spokes": [
      { /* spoke 1 */ },
      { /* spoke 2 */ },
      // ... up to 8
    ]
  },
  "layout": {
    "radius": 400,
    "hubSize": 200,
    "spokeSize": 150
  }
}
```

**Key Features:**
- Dynamic spoke positioning
- Animated connector lines
- Staggered spoke reveals
- Hub emphasis animations

---

### Scene 4: GridLayoutScene
**Differentiator:** N×M grid arrangement (1-3 columns, 1-6 rows)

**Layout Pattern:**
- Configurable grid (columns × rows)
- Uniform item sizing
- Responsive spacing
- Optional gaps

**Use Cases:**
- App mosaics
- Feature grids
- Comparison matrices
- Card collections

**Content Structure:**
```json
{
  "content": {
    "items": [
      { /* item 1 */ },
      { /* item 2 */ },
      // ... flexible count
    ]
  },
  "layout": {
    "columns": 3,
    "itemSize": 240,
    "gap": 40
  }
}
```

**Key Features:**
- Auto-calculated grid positions
- Staggered grid reveals
- Responsive to item count
- Optional focus zoom on item

---

### Scene 5: ColumnLayoutScene
**Differentiator:** 1-3 vertical columns with stacked items

**Layout Pattern:**
- 1-3 vertical columns
- Items stacked within columns
- Independent column animations
- Configurable column widths

**Use Cases:**
- Multi-column lists
- Comparison columns
- Step sequences
- Category groupings

**Content Structure:**
```json
{
  "content": {
    "columns": [
      {
        "items": [ /* column 1 items */ ]
      },
      {
        "items": [ /* column 2 items */ ]
      }
    ]
  },
  "layout": {
    "columnCount": 2,
    "columnWidth": 400,
    "itemSpacing": 60
  }
}
```

**Key Features:**
- Variable column counts
- Independent column timing
- Vertical stacking
- Optional column headers

---

### Scene 6: StackLayoutScene
**Differentiator:** Single vertical or horizontal stack

**Layout Pattern:**
- Linear arrangement (vertical or horizontal)
- Sequential item reveals
- Uniform spacing
- Optional numbering/indicators

**Use Cases:**
- Step-by-step sequences
- Timeline displays
- List presentations
- Sequential reveals

**Content Structure:**
```json
{
  "content": {
    "items": [
      { /* item 1 */ },
      { /* item 2 */ },
      // ... sequential items
    ]
  },
  "layout": {
    "direction": "vertical", // or "horizontal"
    "spacing": 80,
    "alignment": "center"
  }
}
```

**Key Features:**
- Sequential reveal animations
- Progress indicators
- Optional numbering
- Smooth scrolling for long lists

---

### Scene 7: OverlayLayoutScene
**Differentiator:** Base layer + overlay layer (spotlight, labels, annotations)

**Layout Pattern:**
- Base content layer
- Overlay content layer (positioned absolutely)
- Optional dimming/spotlight
- Z-index management

**Use Cases:**
- UI walkthroughs
- Annotated visuals
- Spotlight focus
- Callout overlays

**Content Structure:**
```json
{
  "content": {
    "base": { /* background content */ },
    "overlay": {
      "items": [
        { /* overlay item 1 */ },
        { /* overlay item 2 */ }
      ]
    }
  },
  "layout": {
    "overlayStyle": "spotlight", // or "labels", "callouts"
    "dimBackground": true
  }
}
```

**Key Features:**
- Layered rendering
- Spotlight effects
- Animated overlays
- Background dimming

---

### Scene 8: CascadeLayoutScene
**Differentiator:** Staggered diagonal arrangement (cascading cards)

**Layout Pattern:**
- Diagonal offset positioning
- Overlapping elements
- Depth/z-index layering
- Staggered reveals

**Use Cases:**
- Card stacks
- Layered reveals
- Depth demonstrations
- Progressive unveils

**Content Structure:**
```json
{
  "content": {
    "items": [
      { /* cascade item 1 */ },
      { /* cascade item 2 */ },
      // ... cascading items
    ]
  },
  "layout": {
    "offsetX": 40,
    "offsetY": 30,
    "overlap": 0.3
  }
}
```

**Key Features:**
- Diagonal positioning
- Overlap calculations
- Z-index management
- Flip/reveal animations

---

### Scene 9: FlowLayoutScene
**Differentiator:** Connected nodes with directional flow (diagram-style)

**Layout Pattern:**
- Node-based layout
- Animated connectors
- Flow direction indicators
- Step-by-step highlighting

**Use Cases:**
- Process flows
- Data pipelines
- Decision trees
- Relationship diagrams

**Content Structure:**
```json
{
  "content": {
    "nodes": [
      { "id": "node1", "content": { /* ... */ } },
      { "id": "node2", "content": { /* ... */ } }
    ],
    "edges": [
      { "from": "node1", "to": "node2" }
    ]
  },
  "layout": {
    "flowDirection": "left-to-right", // or "top-to-bottom"
    "nodeSize": 180,
    "spacing": 200
  }
}
```

**Key Features:**
- Auto-positioned nodes
- Animated edge drawing
- Flow highlighting
- Node emphasis

---

### Scene 10: ModalLayoutScene
**Differentiator:** Full-screen modal with centered content (modal overlay)

**Layout Pattern:**
- Darkened background (85% opacity)
- Centered modal content
- Optional backdrop blur
- Entrance/exit animations

**Use Cases:**
- Focused explanations
- Detailed views
- Important announcements
- Single concept deep-dives

**Content Structure:**
```json
{
  "content": {
    "modal": { /* centered modal content */ }
  },
  "layout": {
    "modalSize": { "width": 800, "height": 600 },
    "backdropOpacity": 0.85,
    "backdropBlur": true
  }
}
```

**Key Features:**
- Modal centering
- Backdrop effects
- Entrance/exit animations
- Focus management

---

## 🧩 Mid-Level Components

### Component 1: AppMosaic
**Purpose:** Grid-based app/feature showcase with hover/focus states

**Input:**
- Array of app/feature items
- Grid configuration (columns, gap)
- Item structure (icon, label, description)

**Output:**
- Rendered grid with animations
- Focus zoom capability
- Hover states

**Compatible Scenes:**
- ✅ GridLayoutScene
- ✅ ColumnLayoutScene
- ✅ StackLayoutScene
- ✅ FullFrameScene (as single grid)

**Features:**
- Grid arrangement
- Staggered reveals
- Focus zoom on item
- Subtle hover animations
- Responsive to item count

---

### Component 2: FlowDiagram
**Purpose:** Node-based diagram with animated connectors

**Input:**
- Nodes array (with positions or auto-layout)
- Edges array (connections)
- Flow direction

**Output:**
- Rendered nodes
- Animated connector lines
- Step-wise highlighting

**Compatible Scenes:**
- ✅ FlowLayoutScene
- ✅ HubSpokeScene (as special case)
- ✅ StackLayoutScene (linear flow)
- ✅ OverlayLayoutScene (annotated flow)

**Features:**
- Auto node positioning
- Animated edge drawing
- Node-by-node highlight
- Flow particle effects
- Configurable connector styles

---

### Component 3: TimelineStrip
**Purpose:** Horizontal or vertical timeline with steps/milestones

**Input:**
- Timeline items array
- Orientation (horizontal/vertical)
- Progress marker position

**Output:**
- Rendered timeline
- Animated progress marker
- Step indicators

**Compatible Scenes:**
- ✅ StackLayoutScene (horizontal/vertical)
- ✅ FlowLayoutScene (as timeline variant)
- ✅ FullFrameScene (centered timeline)
- ✅ OverlayLayoutScene (overlay timeline)

**Features:**
- Horizontal or vertical orientation
- Animated progress marker
- Step-by-step reveals
- Date/time labels
- Milestone indicators

---

## 📄 JSON Structure

### Core Schema

```json
{
  "schema_version": "7.0",
  "scene_id": "unique-scene-id",
  "scene_template": "FullFrameScene", // or SplitLayoutScene, etc.
  
  "content": {
    // Scene-specific content structure
    // Flexible based on scene template
  },
  
  "layout": {
    // Layout configuration
    // Scene-specific layout options
  },
  
  "style_tokens": {
    "colors": { /* ... */ },
    "fonts": { /* ... */ },
    "spacing": { /* ... */ }
  },
  
  "beats": {
    // Timing configuration
    // Cumulative durations
  },
  
  "animations": {
    // Animation configuration
    // Per-element animation settings
  },
  
  "effects": {
    // Visual effects
    // Particles, glow, etc.
  },
  
  "mid_level_components": {
    // Optional mid-level component usage
    "appMosaic": { /* config */ },
    "flowDiagram": { /* config */ },
    "timelineStrip": { /* config */ }
  }
}
```

### Example: HubSpokeScene

```json
{
  "schema_version": "7.0",
  "scene_id": "deep-learning-breakdown",
  "scene_template": "HubSpokeScene",
  
  "content": {
    "hub": {
      "text": "Deep Learning",
      "visual": {
        "type": "emoji",
        "value": "🧠"
      }
    },
    "spokes": [
      {
        "label": "Neural Networks",
        "description": "Interconnected layers",
        "icon": "🔗"
      },
      {
        "label": "Training Data",
        "description": "Large datasets",
        "icon": "📊"
      }
    ]
  },
  
  "layout": {
    "radius": 400,
    "hubSize": 200,
    "spokeSize": 150,
    "showConnectors": true
  },
  
  "style_tokens": {
    "colors": {
      "bg": "#FFF9F0",
      "primary": "#FF6B35",
      "text": "#1A1A1A"
    }
  },
  
  "beats": {
    "entrance": 0.5,
    "hubReveal": 1.0,
    "firstSpoke": 2.0,
    "spokeInterval": 0.6,
    "hold": 8.0,
    "exit": 10.0
  },
  
  "animations": {
    "hub": {
      "entrance": "scaleIn",
      "emphasis": "pulse"
    },
    "spokes": {
      "entrance": "slideIn",
      "stagger": true
    }
  }
}
```

### Example: GridLayoutScene with AppMosaic

```json
{
  "schema_version": "7.0",
  "scene_id": "app-showcase",
  "scene_template": "GridLayoutScene",
  
  "content": {
    "items": [
      { "label": "App 1", "icon": "📱", "description": "..." },
      { "label": "App 2", "icon": "💻", "description": "..." }
    ]
  },
  
  "layout": {
    "columns": 3,
    "itemSize": 240,
    "gap": 40
  },
  
  "mid_level_components": {
    "appMosaic": {
      "enabled": true,
      "focusZoom": true,
      "hoverEffect": true
    }
  }
}
```

---

## 🎬 Animation System

### Existing Animations (Already in SDK)

#### Entrance/Exit
- ✅ `fadeIn`, `fadeOut`
- ✅ `slideIn(direction)`, `slideOut(direction)`
- ✅ `scaleIn`, `popIn`
- ✅ `dissolveOut`

#### Emphasis/Attention
- ✅ `pulse()` (size/opacity)
- ✅ `highlightSweep()` (glow/underline swipe)
- ✅ `breathe()` (subtle looping scale/opacity)

#### Path & Flow
- ✅ `drawLine(pathDef)` (hand-drawn connectors)
- ✅ `followNodeSequence(nodes)` (step through nodes)

#### Timing Helpers
- ✅ `stagger(children, options)`
- ✅ `withDelay(offset, animation)`
- ✅ `sequence(steps[])`

### New Animations (To Add to SDK)

#### Camera/Composition
```typescript
// Pan camera to target position
panTo(target: { x: number, y: number }, duration: number, easing?: string)

// Zoom to target element
zoomTo(target: { x: number, y: number, scale: number }, duration: number)

// Parallax effect for layered content
parallax(layerIndex: number, intensity: number, direction: 'horizontal' | 'vertical')

// Orbit around target (for ecosystem diagrams)
orbitAround(target: { x: number, y: number }, radius: number, duration: number)
```

#### Enhanced Path & Flow
```typescript
// Move element along path
moveAlongPath(pathDef: PathDefinition, duration: number, easing?: string)

// Draw line with animation
drawLine(pathDef: PathDefinition, duration: number, style?: LineStyle)
```

#### Enhanced Emphasis
```typescript
// Wiggle animation (tiny "look here" shake)
wiggle(intensity: number, duration: number, frequency: number)

// Highlight sweep (glow/underline swipe)
highlightSweep(direction: 'left' | 'right' | 'top' | 'bottom', duration: number)
```

#### Sync Helpers
```typescript
// Sync animations to beat markers
syncToBeat(timestamps: number[], animation: AnimationFunction)

// Sync to markers (for VO timing)
syncToMarkers(markers: Marker[], animation: AnimationFunction)
```

### Animation Configuration

All scenes support all animations via configuration:

```json
{
  "animations": {
    "elementId": {
      "entrance": "fadeIn" | "slideIn" | "scaleIn" | "popIn",
      "exit": "fadeOut" | "slideOut" | "dissolveOut",
      "emphasis": "pulse" | "highlightSweep" | "wiggle" | "breathe",
      "continuous": "float" | "pulse" | "breathe",
      "camera": {
        "panTo": { "x": 960, "y": 540 },
        "zoomTo": { "scale": 1.5 },
        "parallax": { "intensity": 0.1 }
      },
      "timing": {
        "delay": 0.5,
        "duration": 1.0,
        "easing": "power3Out"
      }
    }
  }
}
```

---

## 🔗 Compatibility Matrix

### Scene ↔ Mid-Level Component Compatibility

| Scene Template | AppMosaic | FlowDiagram | TimelineStrip |
|---------------|-----------|-------------|---------------|
| FullFrameScene | ✅ | ❌ | ✅ |
| SplitLayoutScene | ✅ | ✅ | ❌ |
| HubSpokeScene | ❌ | ✅ | ❌ |
| GridLayoutScene | ✅ | ❌ | ❌ |
| ColumnLayoutScene | ✅ | ❌ | ✅ |
| StackLayoutScene | ✅ | ✅ | ✅ |
| OverlayLayoutScene | ❌ | ✅ | ✅ |
| CascadeLayoutScene | ✅ | ❌ | ❌ |
| FlowLayoutScene | ❌ | ✅ | ✅ |
| ModalLayoutScene | ❌ | ❌ | ❌ |

### Legend
- ✅ **Compatible** - Component works well with this scene
- ❌ **Not Compatible** - Component doesn't fit this scene's layout pattern

### Notes
- **AppMosaic** works best with grid/column/stack layouts
- **FlowDiagram** works best with flow/hub/overlay layouts
- **TimelineStrip** works best with linear/stack layouts
- Some combinations may be added as use cases emerge

---

## 🛠️ Implementation Phases

### Phase 1: Primitives Extraction (Week 1-2)

**Goal:** Extract reusable layout and visual primitives

**Tasks:**
1. Create frame primitives
   - `FullFrame.jsx`
   - `SplitFrame.jsx`
   - `ColumnFrame.jsx`
   - `GridFrame.jsx`
   - `OverlayFrame.jsx`

2. Create container primitives
   - `Card.jsx`
   - `Panel.jsx`
   - `CalloutBox.jsx`
   - `Bubble.jsx`
   - `TagPill.jsx`

3. Create text primitives
   - `TitleText.jsx`
   - `SubtitleText.jsx`
   - `BodyText.jsx`
   - `CaptionText.jsx`
   - `AnnotationText.jsx`

4. Update SDK exports

**Deliverable:** Primitives library ready for use

---

### Phase 2: Animation System Enhancement (Week 2-3)

**Goal:** Add new camera/composition animations to SDK

**Tasks:**
1. Implement camera animations
   - `panTo()` in `sdk/animations/camera.ts`
   - `zoomTo()` in `sdk/animations/camera.ts`
   - `parallax()` in `sdk/animations/camera.ts`
   - `orbitAround()` in `sdk/animations/camera.ts`

2. Implement enhanced path animations
   - `moveAlongPath()` in `sdk/animations/path.ts`
   - Enhanced `drawLine()` in `sdk/animations/path.ts`

3. Implement enhanced emphasis
   - `wiggle()` in `sdk/animations/emphasis.ts`
   - Enhanced `highlightSweep()` in `sdk/animations/emphasis.ts`

4. Implement sync helpers
   - `syncToBeat()` in `sdk/animations/sync.ts`
   - `syncToMarkers()` in `sdk/animations/sync.ts`

5. Update SDK exports and documentation

**Deliverable:** Complete animation system with all new utilities

---

### Phase 3: Mid-Level Components (Week 3-5)

**Goal:** Build 3 core mid-level components

**Tasks:**
1. Build AppMosaic component
   - Grid arrangement logic
   - Focus zoom functionality
   - Hover states
   - Staggered reveals
   - File: `sdk/components/AppMosaic.jsx`

2. Build FlowDiagram component
   - Node positioning (auto-layout)
   - Edge drawing with animation
   - Step-wise highlighting
   - Flow particle effects
   - File: `sdk/components/FlowDiagram.jsx`

3. Build TimelineStrip component
   - Horizontal/vertical orientation
   - Progress marker animation
   - Step indicators
   - Date/time label support
   - File: `sdk/components/TimelineStrip.jsx`

4. Document compatibility matrix
   - Update compatibility table
   - Add usage examples

**Deliverable:** 3 working mid-level components with documentation

---

### Phase 4: Scene Templates - First 3 (Week 5-7)

**Goal:** Build first 3 scene templates as proof-of-concept

**Priority Scenes:**
1. **FullFrameScene** - Simplest, validates approach
2. **HubSpokeScene** - Most requested pattern
3. **GridLayoutScene** - Works with AppMosaic

**Tasks per Scene:**
1. Create scene component file
   - `src/templates/v7/FullFrameScene.jsx`
   - `src/templates/v7/HubSpokeScene.jsx`
   - `src/templates/v7/GridLayoutScene.jsx`

2. Implement layout logic
   - Use primitives for structure
   - Use layout engine for positioning

3. Implement animation system
   - Support all animation types
   - Configurable per element

4. Create example JSON
   - `src/scenes/examples/v7/fullframe_example.json`
   - `src/scenes/examples/v7/hubspoke_example.json`
   - `src/scenes/examples/v7/grid_example.json`

5. Register in TemplateRouter
   - Add to V7_TEMPLATE_REGISTRY
   - Add duration functions

6. Test with various content types
   - Validate flexibility
   - Test edge cases

**Deliverable:** 3 working scene templates with examples

---

### Phase 5: Scene Templates - Remaining 7 (Week 7-12)

**Goal:** Complete all 10 scene templates

**Remaining Scenes:**
4. SplitLayoutScene
5. ColumnLayoutScene
6. StackLayoutScene
7. OverlayLayoutScene
8. CascadeLayoutScene
9. FlowLayoutScene
10. ModalLayoutScene

**Tasks:** Same as Phase 4 for each scene

**Deliverable:** All 10 scene templates complete

---

### Phase 6: Integration & Polish (Week 12-14)

**Goal:** Integrate into app, add polish, create migration tools

**Tasks:**
1. Update TemplateRouter
   - V7 template detection
   - Schema version handling

2. Update TemplateGallery
   - Add V7 scene templates
   - Visual distinction (staging area)

3. Create migration utilities
   - V6 → V7 JSON converter (optional)
   - Validation tools

4. Documentation
   - Scene template guide
   - JSON structure reference
   - Migration guide

5. Testing
   - All scenes with various content
   - Animation system validation
   - Performance testing (60fps)

**Deliverable:** Complete V7 system ready for use

---

## 🔄 Migration Strategy

### Parallel Development
- **V6 templates** remain in production
- **V7 templates** developed in staging
- Both systems coexist during transition

### Staging Area
- Use existing staging system in TemplateGallery
- V7 templates marked with "V7" badge
- Visual distinction (different header color)

### Sunset Strategy
- Once V7 is stable and tested:
  - Option A: Move V6 to archive, V7 to production
  - Option B: Keep both, mark V6 as "legacy"
  - Decision based on usage patterns

### JSON Migration
- **No automatic migration** - Clean break approach
- **Manual migration tools** - Optional converter utilities
- **Example JSONs** - Can be migrated as reference
- **Content creators** - Use new JSON structure for new content

### Rollout Plan
1. **Week 1-2:** Primitives (internal)
2. **Week 3-5:** Mid-level components (internal)
3. **Week 5-7:** First 3 scenes (staging)
4. **Week 7-12:** Remaining scenes (staging)
5. **Week 12-14:** Integration & polish
6. **Week 15+:** Production rollout (if approved)

---

## 📊 Success Metrics

### Technical Metrics
- ✅ All 10 scenes implemented
- ✅ All animations working
- ✅ 3 mid-level components complete
- ✅ 60fps performance maintained
- ✅ JSON validation passing

### Quality Metrics
- ✅ Scenes accept flexible content structures
- ✅ Same scene works with different content types
- ✅ Compatibility matrix documented
- ✅ Examples for each scene

### Usability Metrics
- ✅ Content creators can use new JSON structure
- ✅ Scene selection is intuitive
- ✅ Documentation is clear

---

## 🎯 Next Steps

1. **Review this plan** - Validate approach and priorities
2. **Start Phase 1** - Begin primitives extraction
3. **Iterate** - Adjust based on learnings
4. **Document** - Update as implementation progresses

---

## 📝 Notes

- **Flexibility First:** All scenes support all animations (with future flexibility for specialists)
- **Clean Break:** New JSON structure, no backward compatibility required
- **No Timeline Pressure:** Can sunset old version or use staging area
- **Learn by Doing:** Focus on 3 mid-level components to learn principles
- **Compatibility Tracking:** Keep record of scene ↔ component compatibility

---

**Last Updated:** 2025-01-XX  
**Status:** Planning Phase  
**Owner:** Development Team