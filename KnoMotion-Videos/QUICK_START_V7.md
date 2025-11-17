# 🚀 Quick Start Guide - V7 Scene Templates

**Get started with the new V7 scene-shell templates in under 5 minutes!**

---

## 📦 What's Available

### 4 Scene Templates
1. **FullFrameScene** - Single full-screen content
2. **GridLayoutScene** - N×M grid with staggered animations
3. **StackLayoutScene** - Vertical/horizontal stack
4. **FlowLayoutScene** - Connected nodes with flow

### 2 Mid-Level Components
1. **AppMosaic** - Grid showcase with focus
2. **FlowDiagram** - Node-edge diagrams

---

## ⚡ Quick Examples

### 1. Full Frame Scene (Text Card)

```json
{
  "schema_version": "7.0",
  "scene_id": "welcome",
  "scene_template": "FullFrameScene",
  
  "content": {
    "title": { "text": "Welcome to Machine Learning" },
    "main": {
      "type": "card",
      "data": { "text": "Explore the world of AI and neural networks" }
    }
  },
  
  "style_tokens": {
    "colors": {
      "bg": "#1A1A1A",
      "primary": "#FF6B35",
      "text": "#FFFFFF"
    }
  }
}
```

**Test:** `/src/scenes/v7/fullframe_example.json`

---

### 2. Grid Layout Scene (with AppMosaic)

```json
{
  "schema_version": "7.0",
  "scene_id": "frameworks",
  "scene_template": "GridLayoutScene",
  
  "content": {
    "title": "ML Frameworks",
    "items": [
      { "label": "TensorFlow", "icon": "🔶", "description": "End-to-end platform" },
      { "label": "PyTorch", "icon": "🔥", "description": "Dynamic networks" },
      { "label": "Keras", "icon": "⚡", "description": "High-level API" }
    ]
  },
  
  "layout": {
    "columns": 3,
    "gap": 50,
    "itemSize": 260
  },
  
  "mid_level_components": {
    "appMosaic": {
      "enabled": true,
      "focusZoom": false
    }
  }
}
```

**Test:** `/src/scenes/v7/gridlayout_example.json`

---

### 3. Stack Layout Scene (Steps)

```json
{
  "schema_version": "7.0",
  "scene_id": "training-steps",
  "scene_template": "StackLayoutScene",
  
  "content": {
    "title": "Training Process",
    "items": [
      { "text": "Initialize Weights", "icon": "1️⃣", "description": "Set random values" },
      { "text": "Forward Pass", "icon": "2️⃣", "description": "Compute predictions" },
      { "text": "Calculate Loss", "icon": "3️⃣", "description": "Measure error" }
    ]
  },
  
  "layout": {
    "direction": "vertical",
    "spacing": 70,
    "alignment": "center"
  },
  
  "animations": {
    "items": {
      "entrance": "slideIn",
      "stagger": { "enabled": true, "delay": 0.35 }
    }
  }
}
```

**Test:** `/src/scenes/v7/stacklayout_example.json`

---

### 4. Flow Layout Scene (with FlowDiagram)

```json
{
  "schema_version": "7.0",
  "scene_id": "pipeline",
  "scene_template": "FlowLayoutScene",
  
  "content": {
    "title": "ML Pipeline",
    "nodes": [
      { "id": "data", "label": "Raw Data", "icon": "📊" },
      { "id": "prep", "label": "Preprocess", "icon": "🔧" },
      { "id": "train", "label": "Train", "icon": "🧠" },
      { "id": "deploy", "label": "Deploy", "icon": "🚀" }
    ],
    "edges": [
      { "from": "data", "to": "prep" },
      { "from": "prep", "to": "train" },
      { "from": "train", "to": "deploy" }
    ]
  },
  
  "layout": {
    "flowDirection": "left-to-right",
    "nodeSize": 180,
    "spacing": 220
  },
  
  "mid_level_components": {
    "flowDiagram": {
      "enabled": true,
      "autoLayout": true
    }
  }
}
```

**Test:** `/src/scenes/v7/flowlayout_example.json`

---

## 🎨 Customization Quick Reference

### Colors
```json
"style_tokens": {
  "colors": {
    "bg": "#1A1A1A",           // Background
    "primary": "#FF6B35",       // Main accent
    "secondary": "#4ECDC4",     // Secondary accent
    "text": "#FFFFFF",          // Main text
    "textSecondary": "#B0B0B0"  // Secondary text
  }
}
```

### Fonts
```json
"style_tokens": {
  "fonts": {
    "size_title": 64,
    "size_label": 28,
    "size_description": 16,
    "weight_title": 800,
    "weight_body": 600
  }
}
```

### Timing (Beats)
```json
"beats": {
  "entrance": 0.5,      // Initial fade in
  "title": 1.0,         // Title appears
  "firstItem": 2.5,     // First item/content
  "itemInterval": 0.4,  // Delay between items
  "hold": 10.0,         // Hold final state
  "exit": 12.0          // Exit animation
}
```

### Animations
```json
"animations": {
  "items": {
    "entrance": "cardEntrance",  // fadeIn, slideIn, scaleIn, cardEntrance
    "duration": 0.7,
    "stagger": {
      "enabled": true,
      "type": "index",           // index, row, column
      "delay": 0.18
    }
  }
}
```

### Effects
```json
"effects": {
  "particles": {
    "enabled": true,
    "count": 20,
    "color": "#4ECDC4",
    "opacity": 0.35
  },
  "spotlight": {
    "enabled": true,
    "position": { "x": 50, "y": 50 },
    "size": 900,
    "opacity": 0.18
  },
  "noise": {
    "enabled": true,
    "opacity": 0.03
  }
}
```

---

## 🔧 How to Load and Test

### Option 1: Import JSON Directly
```javascript
import sceneJSON from './scenes/v7/gridlayout_example.json';
import { TemplateRouter } from './templates/TemplateRouter';

<TemplateRouter scene={sceneJSON} />
```

### Option 2: Fetch JSON Dynamically
```javascript
const sceneJSON = await fetch('/scenes/v7/fullframe_example.json').then(r => r.json());

<TemplateRouter scene={sceneJSON} />
```

### Option 3: Use in Multi-Scene Video
```javascript
const scenes = [
  require('./scenes/v7/fullframe_example.json'),
  require('./scenes/v7/gridlayout_example.json'),
  require('./scenes/v7/stacklayout_example.json')
];

<MultiSceneVideo scenes={scenes} />
```

---

## 📁 File Locations

### Scene Templates
- `/src/templates/v7/FullFrameScene.jsx`
- `/src/templates/v7/GridLayoutScene.jsx`
- `/src/templates/v7/StackLayoutScene.jsx`
- `/src/templates/v7/FlowLayoutScene.jsx`

### Mid-Level Components
- `/src/sdk/components/mid-level/AppMosaic.jsx`
- `/src/sdk/components/mid-level/FlowDiagram.jsx`

### Example JSONs
- `/src/scenes/v7/fullframe_example.json`
- `/src/scenes/v7/gridlayout_example.json`
- `/src/scenes/v7/stacklayout_example.json`
- `/src/scenes/v7/flowlayout_example.json`

### Router
- `/src/templates/TemplateRouter.jsx` (✅ Updated with V7 registry)

---

## 🎯 Common Use Cases

### Use Case 1: Title Card
**Template:** FullFrameScene  
**Example:** `fullframe_example.json`  
**Best For:** Opening/closing cards, single concepts, quotes

### Use Case 2: Feature Showcase
**Template:** GridLayoutScene + AppMosaic  
**Example:** `gridlayout_example.json`  
**Best For:** Tools, frameworks, features, comparison grids

### Use Case 3: Step-by-Step Guide
**Template:** StackLayoutScene  
**Example:** `stacklayout_example.json`  
**Best For:** Tutorials, processes, checklists, instructions

### Use Case 4: Process Flow
**Template:** FlowLayoutScene + FlowDiagram  
**Example:** `flowlayout_example.json`  
**Best For:** Pipelines, workflows, sequences, data flows

---

## ⚠️ Important Notes

1. **Schema Version:** Always use `"schema_version": "7.0"` for V7 templates
2. **Template ID:** Must match exactly: `FullFrameScene`, `GridLayoutScene`, etc.
3. **Mid-Level Components:** Enable via `mid_level_components` config
4. **Timing:** All beats are in seconds, not frames
5. **Colors:** Always use hex format with `#` prefix

---

## 🚀 Next Steps

1. **Test Examples:** Load each example JSON in dev environment
2. **Customize:** Modify colors, timing, content to match your needs
3. **Create New:** Use examples as templates for new scenes
4. **Integrate:** Add to template gallery UI
5. **Document:** Add your custom scenes to library

---

## 📖 Full Documentation

- **V7_IMPLEMENTATION_SUMMARY.md** - Complete technical reference
- **MigrationPlan.md** - Architecture overview
- **SDK.md** - Animation and utility reference
- **CONFIGURATION.md** - JSON schema guide

---

**Ready to create amazing videos!** 🎬✨
