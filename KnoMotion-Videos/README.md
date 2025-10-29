# 🎬 KnoMotion Videos

**Blueprint v5.0** - JSON-driven video templates for educational content

> Deterministic, FPS-agnostic, export-safe video scenes built with Remotion

---

## 🌟 Features

- **8 Production-Ready Templates** - 2 per pedagogical pillar (Hook, Explain, Apply, Reflect)
- **JSON-Driven Content** - No code required, just edit scene JSON files
- **Blueprint v5.0 Architecture** - Fully deterministic animations, perfect preview-to-export parity
- **Remotion-Native** - Pure Remotion animations (no GSAP), broadcast-grade quality
- **Visual Wizard** - Step-by-step video creation with live preview
- **Notebook Aesthetic** - Warm, "alive notebook" style with rough.js sketches

---

## 📦 Quick Start

### Installation

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

---

## 🎨 Template Showcase

### Hook Templates (Capture Attention)
- **Hook 1A: Question Burst** - Provocative question with kinetic typography (15s)
- **Hook 1E: Ambient Mystery** - Atmospheric fog and intrigue (12s)

### Explain Templates (Teach Concepts)
- **Explain 2A: Concept Breakdown** - Break complex ideas into digestible parts (10s)
- **Explain 2B: Analogy** - Visual side-by-side comparison (12s)

### Apply Templates (Practice Skills)
- **Apply 3A: Micro Quiz** - Quick knowledge check with instant feedback (12s)
- **Apply 3B: Scenario Choice** - Real-world application scenarios (11s)

### Reflect Templates (Consolidate Learning)
- **Reflect 4A: Key Takeaways** - Summary with key points (8s)
- **Reflect 4D: Forward Link** - Learning anchor → next journey (10s)

---

## 🚀 Creating Your First Video

### Option 1: Use the Wizard (Recommended)

1. Run `npm run dev`
2. The Video Wizard opens automatically
3. Click through each pillar step:
   - **Hook** → Define & preview
   - **Explain** → Define & preview
   - **Apply** → Define & preview
   - **Reflect** → Define & preview
4. See your complete video on the final step!

### Option 2: Edit JSON Directly

1. Switch to "Scene Preview" mode
2. Select a template from the dropdown
3. Edit the JSON in the left panel
4. Click "Apply Changes" to preview
5. Export when ready!

---

## 📖 Documentation

- **[Getting Started](./docs/GETTING_STARTED.md)** - Installation, first scene, wizard walkthrough
- **[Blueprint v5.0 Specification](./docs/BLUEPRINT_V5.md)** - Complete architecture reference
- **[API Reference](./docs/API_REFERENCE.md)** - SDK functions, presets, helpers

---

## 🏗️ Project Structure

```
KnoMotion-Videos/
├── src/
│   ├── templates/       # 8 v5 templates + router
│   ├── sdk/            # Animation presets, easing, helpers
│   ├── utils/          # Theme, rough.js helpers
│   ├── components/     # VideoWizard, MultiSceneVideo
│   ├── scenes/         # v5 scene JSON files + examples
│   └── App.jsx         # Main application
├── docs/               # Documentation
└── package.json
```

---

## 🎯 Core Principles (Blueprint v5.0)

✅ **Deterministic** - Frame-driven animations, no state triggers  
✅ **FPS-Agnostic** - Author in seconds, works at any frame rate  
✅ **Zero Wobble** - Strict `roughness: 0, bowing: 0` for consistency  
✅ **Remotion-Native** - Pure interpolate/spring, no GSAP  
✅ **Export-Safe** - Perfect preview-to-export parity  
✅ **JSON-Driven** - Authors write data, templates render motion

---

## 🔧 Tech Stack

- **Remotion** - Video rendering framework
- **React** - UI components
- **Vite** - Build tooling
- **rough.js** - Hand-drawn aesthetic
- **@lottiefiles/react-lottie-player** - Lottie animations

---

## 📝 Example Scene JSON

```json
{
  "schema_version": "5.0",
  "scene_id": "hook1a",
  "template_id": "Hook1AQuestionBurst",
  
  "beats": {
    "entrance": 0.6,
    "questionPart1": 0.6,
    "questionPart2": 2.8,
    "emphasis": 4.2,
    "exit": 15.0
  },
  
  "fill": {
    "texts": {
      "questionPart1": "What if geography",
      "questionPart2": "was measured in mindsets?"
    }
  }
}
```

---

## 🤝 Contributing

This is a focused production repository. For historical context and iteration notes, see the archive repo.

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🎓 Educational Use

Perfect for:
- Online courses
- Explainer videos
- Educational content creators
- Learning platforms
- Training materials

---

**Built with ❤️ for educators who want beautiful, consistent video content**
