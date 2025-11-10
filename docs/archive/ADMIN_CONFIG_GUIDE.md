# 🎨 Admin Configuration Tool - HOOK1A Template

**Status:** ✅ Complete & Ready to Use  
**Version:** 1.0  
**Date:** 2025-11-06

---

## 🌟 Overview

The **Admin Configuration Tool** is an interactive, visual interface for configuring HOOK1A templates without touching JSON. It demonstrates the true flexibility of the agnostic template system by exposing all configurable aspects through an intuitive UI.

### What Problem Does It Solve?

- ❌ **Before:** Users edited raw JSON, unclear what's configurable
- ❌ **Result:** Templates appeared rigid, limited to initial POC settings
- ✅ **After:** Interactive UI reveals all configuration options
- ✅ **Result:** Users can rapidly test different configurations, see true flexibility

---

## 🚀 How to Access

### Option 1: From Video Wizard
1. Start the dev server: `npm run dev`
2. Navigate to `http://localhost:3000`
3. Click **"⚙️ Admin Config (HOOK1A)"** button in the top-right
4. Start configuring!

### Option 2: Direct Link
- The Admin Config is integrated into the VideoWizard component
- Toggle between "Wizard Mode" and "Admin Config" mode seamlessly

---

## 🎯 Features

### 1. **Quick Start Presets** 🎭
Load complete examples instantly to see the template's flexibility:
- **Geography (Knodovia)** - Original map-based scene with 2 lines
- **Sports (Football)** - Single line question with player image
- **Science (3 lines)** - Three-line question with atom imagery
- **Business (Minimal)** - Clean professional aesthetic

### 2. **Hero Visual Configuration** 🖼️
Polymorphic hero type selection:
- **Type Selector:** Image, SVG, RoughSVG, Lottie
- **Asset Input:** URL or local path with preview
- **Position:** Visual 9-point grid picker
- **Entrance Animation:** Dropdown (fadeIn, drawOn)
- **Duration Slider:** 0.3s to 3.0s

### 3. **Question Lines Editor** 📝
Dynamic 1-4 line management:
- **Add/Remove Lines:** Buttons to manage line count (up to 4)
- **Text Input:** Edit each line's content
- **Emphasis Toggle:** Normal or High (affects size & color)
- **Vertical Spacing:** Slider (40-120px)
- **Stagger Delay:** Slider (0-0.6s) for sequential animation
- **Base Position:** 9-point grid picker

### 4. **Color Palette** 🎨
Complete color control with presets:
- **Quick Presets:** Geography, Sports, Science, Business
- **Individual Pickers:**
  - Background color
  - Accent (primary)
  - Accent 2 (secondary)
  - Ink (text color)
- **Live Preview:** See changes instantly

### 5. **Typography Controls** ✏️
Font size sliders:
- **Question Size:** 60-120px
- **Welcome Size:** 48-96px
- **Subtitle Size:** 24-48px

### 6. **Timeline (Beats) Editor** ⏱️
Precise timing control for all animation beats:
- Entrance (0-5s)
- Question Start (0-5s)
- Move Up (0-10s)
- Emphasis (0-10s)
- Wipe Questions (0-15s)
- Map Reveal (0-15s)
- Transform Map (0-15s)
- Welcome (0-15s)
- Subtitle (0-15s)
- Exit (5-20s)

### 7. **Text Content** 💬
Edit welcome and subtitle text:
- **Welcome Text:** Single line input
- **Subtitle Text:** Multi-line textarea

### 8. **Live Preview** 🎥
Real-time video player:
- **Auto-updates:** Changes reflect immediately
- **Full Controls:** Play, pause, scrub timeline
- **Reload Button:** Force player refresh
- **Meta Info:** Duration, dimensions, FPS

### 9. **JSON Viewer** 📋
Toggle JSON visibility:
- **Show/Hide JSON:** Collapsible viewer
- **Copy to Clipboard:** One-click copy button
- **Download JSON:** Export as file (💾 button)
- **Formatted:** Pretty-printed with 2-space indent

---

## 🎨 Visual Components

### Grid Position Picker
Interactive 3x3 grid for position selection:
```
┌─────┬─────┬─────┐
│  ●  │  ○  │  ○  │  ← Click dots to select
├─────┼─────┼─────┤
│  ○  │  ○  │  ○  │  ● = selected
├─────┼─────┼─────┤
│  ○  │  ○  │  ○  │  ○ = available
└─────┴─────┴─────┘
```

### Accordion Sections
Organized, collapsible sections:
- **Hero Visual** 🎨
- **Question Lines** 📝
- **Colors** 🎨
- **Typography** ✏️
- **Timeline (Beats)** ⏱️
- **Text Content** 💬

### Slider Controls
Visual sliders with live value display:
- Gradient fill shows current value
- Purple accent color (#732282)
- Min/max labels
- Step increments

---

## 🔄 Workflow

### Typical Usage Flow:

1. **Start with a Preset**
   - Click a Quick Start Preset (e.g., "Sports (Football)")
   - See complete configuration load instantly

2. **Customize Hero**
   - Change hero type (image → roughSVG)
   - Update asset URL
   - Adjust position with grid picker

3. **Edit Question Lines**
   - Add or remove lines (1-4 supported)
   - Edit text content
   - Toggle emphasis on key lines

4. **Adjust Colors**
   - Try color presets for quick changes
   - Fine-tune individual colors with pickers

5. **Refine Timeline**
   - Adjust beat timing with sliders
   - Speed up or slow down animations

6. **Preview & Export**
   - Watch live preview as you edit
   - Click "Download JSON" when satisfied
   - Use exported JSON in production

---

## 💡 Configuration Examples

### Example 1: Single Line Question
```javascript
Question Lines:
- Line Count: 1
- Line 1: "Who was the greatest?" (High emphasis)

Result: Large, centered, impactful question
```

### Example 2: Three Line Progressive
```javascript
Question Lines:
- Line Count: 3
- Line 1: "What if we could see" (Normal)
- Line 2: "atoms dance" (High)
- Line 3: "in real time?" (Normal)

Result: Progressive reveal with emphasis on key phrase
```

### Example 3: Custom Color Palette
```javascript
Colors:
- Background: #F0F9FF (Light blue)
- Accent: #00FF00 (Bright green)
- Accent 2: #FFD700 (Gold)
- Ink: #1A1A1A (Dark gray)

Result: Vibrant sports-themed aesthetic
```

---

## 🎯 Demonstrating Template Flexibility

### Cross-Domain Testing

The Admin Config makes it easy to test the template across domains:

| Domain | Hero Type | Lines | Colors | Proof of Flexibility |
|--------|-----------|-------|--------|---------------------|
| Geography | roughSVG | 2 | Warm earth tones | ✅ Original use case |
| Sports | Image | 1 | Green/gold | ✅ Single line works |
| Science | Image | 3 | Purple/blue | ✅ Three lines works |
| Business | Image | 2 | Neutral grays | ✅ Professional aesthetic |

### Key Flexibility Points

1. **Hero Polymorphism:** Swap between 4 visual types without code changes
2. **Dynamic Lines:** Support 1-4+ lines with automatic positioning
3. **Position System:** 9-point grid with offset support
4. **Style Tokens:** Complete color/font customization
5. **Beat System:** Precise animation timing control

---

## 📦 Export & Integration

### Exporting Your Configuration

1. Click **💾 Download JSON** button
2. File saves as: `hook1a-{title}.json`
3. Use in production by:
   - Placing in `/src/scenes/` folder
   - Importing into VideoWizard
   - Passing to TemplateRouter

### Example Export
```json
{
  "schema_version": "5.1",
  "scene_id": "hook1a-sports",
  "template_id": "Hook1AQuestionBurst",
  "hero": {
    "type": "image",
    "asset": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800",
    "position": "center"
  },
  "question": {
    "lines": [
      { "text": "Who was the greatest?", "emphasis": "high" }
    ]
  },
  "style_tokens": {
    "colors": {
      "bg": "#F0F9FF",
      "accent": "#00FF00",
      "accent2": "#FFD700",
      "ink": "#1A1A1A"
    }
  }
}
```

---

## 🛠️ Technical Implementation

### Component Structure
```
AdminConfig.jsx
├── Quick Start Presets (Scene loader)
├── Accordion Sections
│   ├── Hero Visual
│   │   ├── Type selector
│   │   ├── Asset input
│   │   ├── Grid position picker
│   │   └── Animation controls
│   ├── Question Lines
│   │   ├── Add/remove buttons
│   │   ├── Line editors (text + emphasis)
│   │   └── Layout sliders
│   ├── Colors (Presets + pickers)
│   ├── Typography (Size sliders)
│   ├── Timeline (Beat sliders)
│   └── Text Content (Welcome + subtitle)
├── Live Preview Panel
│   ├── Remotion Player
│   ├── Meta info
│   └── JSON viewer (collapsible)
└── Export Controls
    ├── Download JSON
    ├── Show/Hide JSON
    └── Reload Player
```

### State Management
- **React useState:** Local state for all controls
- **Bidirectional Sync:** UI changes → State → Preview
- **Callback Updates:** `onSceneUpdate` prop for parent sync
- **Player Key:** Force reload with key increment

### Reusable Components
- `GridPositionPicker` - 9-point grid UI
- `ColorPicker` - Color input + hex field
- `Slider` - Range input with value display
- `AccordionSection` - Collapsible content sections

---

## 🚀 Future Enhancements

### Phase 2 Ideas (Not Yet Implemented)
- [ ] **Asset Browser:** Thumbnail gallery of available images
- [ ] **Upload Support:** Drag-drop image upload
- [ ] **Undo/Redo:** History stack with Ctrl+Z/Y
- [ ] **Timeline Scrubber:** Visual beat timeline with seek
- [ ] **Preset Manager:** Save/load custom presets
- [ ] **Multi-Template Support:** Extend to other templates
- [ ] **Validation Warnings:** Real-time config validation
- [ ] **Keyboard Shortcuts:** Power user features

---

## 📚 Related Documentation

- **[Agnostic Template Principals](./KnoMotion-Videos/docs/agnosticTemplatePrincipals.md)** - Core design philosophy
- **[HOOK1A Template](./KnoMotion-Videos/src/templates/Hook1AQuestionBurst_V5_Agnostic.jsx)** - Template source code
- **[Hero Registry](./KnoMotion-Videos/src/sdk/heroRegistry.jsx)** - Polymorphic hero system
- **[Position System](./KnoMotion-Videos/src/sdk/positionSystem.js)** - 9-point grid reference
- **[Question Renderer](./KnoMotion-Videos/src/sdk/questionRenderer.js)** - Dynamic line rendering

---

## 🎉 Success Metrics

The Admin Config tool successfully demonstrates:

✅ **1. Non-technical users can configure templates**  
   → Click presets, adjust sliders, see results

✅ **2. Template flexibility is immediately visible**  
   → 4 different domains in 4 clicks

✅ **3. JSON remains accessible for power users**  
   → Toggle JSON viewer, copy/download anytime

✅ **4. Rapid iteration and testing**  
   → Change settings, reload preview, iterate fast

✅ **5. Zero code changes required**  
   → All changes are JSON-based configuration

---

## 🙏 Acknowledgments

Built with:
- **React** - UI framework
- **Remotion** - Video rendering
- **Vite** - Build tooling
- **Custom Components** - GridPicker, Sliders, Accordions

Designed to showcase the power of the **Agnostic Template System** and enable rapid video creation at scale.

---

**Ready to create amazing videos? Open Admin Config and start exploring!** 🚀
