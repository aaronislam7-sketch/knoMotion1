# 🎨 How to View V7 Templates in the Staging Area

The V7 scene-shell templates have been added to the **Staging Area** in the Template Gallery.

---

## 🚀 Quick Access

### 1. Start the Dev Server
```bash
cd /workspace/KnoMotion-Videos
npm run dev
```

### 2. Open the Template Gallery
- Click the **"🎛️ Template Gallery & Config"** button in the UI

### 3. Switch to Staging Mode
- In the Template Gallery header, click the **"🧪 Staging"** button
- The header will turn **pink** to indicate you're in staging mode
- You should now see 6 templates (4 V7 + 2 V6 staging)

---

## 🎨 V7 Templates in Staging

### 1. **🖼️ Full Frame Scene** (v7.0)
- **Color:** Orange (#FF6B35)
- **Icon:** 🖼️
- **Intentions:** INSPIRE, REVEAL, QUESTION
- **Description:** Single full-screen canvas with centered content
- **Best For:** Title cards, hero statements, single concepts

### 2. **📱 Grid Layout Scene** (v7.0)
- **Color:** Turquoise (#4ECDC4)
- **Icon:** 📱
- **Intentions:** BREAKDOWN, COMPARE, GUIDE
- **Description:** N×M grid with auto-positioning and staggered animations
- **Best For:** Feature showcases, tool comparisons, app grids
- **Special:** Integrates with AppMosaic component

### 3. **📋 Stack Layout Scene** (v7.0)
- **Color:** Purple (#9B59B6)
- **Icon:** 📋
- **Intentions:** GUIDE, BREAKDOWN, REVEAL
- **Description:** Vertical or horizontal linear stack with sequential reveals
- **Best For:** Step-by-step guides, processes, checklists

### 4. **🔄 Flow Layout Scene** (v7.0)
- **Color:** Blue (#00BCD4)
- **Icon:** 🔄
- **Intentions:** CONNECT, GUIDE, BREAKDOWN
- **Description:** Connected nodes with directional flow and animated edges
- **Best For:** Pipelines, workflows, process diagrams
- **Special:** Integrates with FlowDiagram component

---

## 🎬 How to Test the Templates

### Method 1: Select from Gallery (Recommended)
1. Switch to **Staging Mode** (click "🧪 Staging" button)
2. Click on any V7 template card
3. The template will be selected
4. Use example JSONs to configure:
   - `src/scenes/v7/fullframe_example.json`
   - `src/scenes/v7/gridlayout_example.json`
   - `src/scenes/v7/stacklayout_example.json`
   - `src/scenes/v7/flowlayout_example.json`

### Method 2: Load JSON Directly
```javascript
import fullframeExample from './scenes/v7/fullframe_example.json';
import { TemplateRouter } from './templates/TemplateRouter';

<TemplateRouter scene={fullframeExample} />
```

### Method 3: Use in Multi-Scene Video
```javascript
const scenes = [
  require('./scenes/v7/fullframe_example.json'),
  require('./scenes/v7/gridlayout_example.json')
];

<MultiSceneVideo scenes={scenes} />
```

---

## 🎯 Visual Indicators

When in staging mode, V7 templates will display:
- ✨ **"NEW"** badge (green)
- 🧪 **"STAGING"** badge (pink)
- **v7.0-STAGING** version label
- **Features list** showing key capabilities

---

## 🔍 Filter by Intention

You can filter staging templates by learning intention:
- Click **INSPIRE** to see FullFrameScene
- Click **BREAKDOWN** to see GridLayoutScene
- Click **GUIDE** to see StackLayoutScene
- Click **CONNECT** to see FlowLayoutScene

---

## 📊 What to Look For

When testing V7 templates, verify:

### Visual Quality
- ✅ Glassmorphic effects render smoothly
- ✅ Animations run at 60fps
- ✅ No clipping or overflow
- ✅ Proper spacing and alignment

### Animations
- ✅ Entrance animations play smoothly
- ✅ Staggered reveals work correctly
- ✅ Edge drawing in FlowLayoutScene is smooth
- ✅ Particle effects (if enabled) are subtle

### Content Flexibility
- ✅ Try different item counts (3, 6, 9, 12 for grid)
- ✅ Test with long and short text
- ✅ Verify different colors from theme tokens
- ✅ Test with and without optional fields

### Mid-Level Components
- ✅ Enable AppMosaic in GridLayoutScene JSON
- ✅ Enable FlowDiagram in FlowLayoutScene JSON
- ✅ Verify components integrate seamlessly

---

## 🐛 Troubleshooting

### Templates not showing?
1. Make sure you clicked the **"🧪 Staging"** button
2. Header should be **pink** not green
3. Should see "Staging Area (6)" in the header

### Template loads but doesn't render?
1. Check browser console for errors
2. Verify JSON structure is correct
3. Ensure all required fields are present

### Animations not playing?
1. Verify beat timings are correct
2. Check that animations are enabled in JSON
3. Reload the preview

---

## 📝 Providing Feedback

When testing, note:
1. **What works well** - Smooth animations, good spacing, etc.
2. **What needs improvement** - Layout issues, timing problems, etc.
3. **Feature requests** - Additional animation types, layout options, etc.

---

## ✅ Ready to Test!

1. **Start dev server:** `npm run dev`
2. **Open Template Gallery**
3. **Click "🧪 Staging" button**
4. **Select a V7 template**
5. **Load example JSON**
6. **Watch the magic!** ✨

---

**Happy testing!** 🎬
