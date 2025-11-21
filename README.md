# 🎬 KnoMotion Video Templates

**Production-ready educational video templates powered by Remotion**

---

## 🚀 Quick Start (30 seconds)

```bash
cd /workspace/KnoMotion-Videos
npm install
npm run dev
```

**Then:** Click **"🎛️ Template Gallery & Config"** button → Select a template → Configure → Preview

---

## 📖 What Is This?

KnoMotion is a **JSON-first video engine** for creating educational content at scale. It provides:

- ✅ **100% configurable** via JSON (no code changes needed)
- ✅ **23 production-ready UI elements** (atoms + compositions)
- ✅ **8 continuous life animations** (breathing, floating, rotation, etc.)
- ✅ **4-layer architecture** (SDK, Layout, Mid-Scene, JSON)
- ✅ **Broadcast quality** visuals (not PowerPoint)
- ✅ **Learning intention-aligned** (Hook, Explain, Apply, Reflect, etc.)
- ✅ **Domain agnostic** (works for any subject matter)

**Built with:** React, Remotion, Vite, DaisyUI, Tailwind CSS

**See it in action**: 🎬 [KnoMotion Showcase](./SHOWCASE.md) - 3.5-minute demo video

---

## 📚 Documentation

### Essential Guides
- **[SHOWCASE.md](./SHOWCASE.md)** ⭐ - Complete showcase demo and guide (3.5-minute video)
- **[showCasePlan.md](./showCasePlan.md)** - Project plan and progress tracker
- **[SDK.md](./SDK.md)** - SDK framework reference (23 elements, 8 animations, layouts)
- **[CONFIGURATION.md](./CONFIGURATION.md)** - How to configure templates using JSON
- **[TEMPLATES.md](./TEMPLATES.md)** - Template catalog and usage guide

### For Developers
- **[SDK.md](./SDK.md)** - Complete SDK API documentation
- **[TEMPLATES.md](./TEMPLATES.md)** - How to create new templates
- **[docs/methodology/TEMPLATE_POLISH.md](./docs/methodology/TEMPLATE_POLISH.md)** - Polish standards

### Historical Reference
- **[docs/archive/](./docs/archive/)** - Progress logs and historical documentation

---

## 🎯 Template Library

**V6 Templates (17 active):**
- **Hook1A, Hook1E** - Attention-grabbing openers
- **Explain2A, Explain2B** - Concept teaching
- **Apply3A, Apply3B** - Interactive practice
- **Reflect4A, Reflect4D** - Summaries and takeaways
- **Reveal9** - Progressive unveil
- **Guide10** - Step-by-step sequences
- **Compare11, Compare12** - Comparisons
- **Challenge13** - Polls and quizzes
- **Spotlight14, Connect15, Quote16, Progress18** - Specialized formats

See **[TEMPLATES.md](./TEMPLATES.md)** for full details.

---

## 🏗️ Project Structure

```
/workspace/
├── README.md                    ← You are here
├── TEMPLATES.md                 ← Template guide
├── CONFIGURATION.md             ← Config guide
├── SDK.md                       ← SDK reference
├── docs/
│   ├── archive/                 ← Historical docs
│   └── methodology/             ← Best practices
└── KnoMotion-Videos/
    ├── src/
    │   ├── templates/           ← Template components
    │   │   ├── v6/              ← Active V6 templates
    │   │   └── archive_v5/      ← Archived V5 templates
    │   ├── sdk/                 ← Shared utilities
    │   │   ├── animations.ts    ← Animation helpers
    │   │   ├── effects.tsx      ← Visual effects
    │   │   ├── lottie.ts        ← Lottie integration
    │   │   ├── layout.ts        ← Layout engine
    │   │   ├── validation/      ← Schema validators
    │   │   ├── core/            ← Core utilities
    │   │   ├── components/      ← Shared components
    │   │   └── index.ts         ← SDK exports
    │   ├── scenes/              ← Scene configurations
    │   │   ├── v6/              ← Active V6 scenes
    │   │   ├── examples/        ← Example scenes
    │   │   └── archive_v5/      ← Archived V5 scenes
    │   └── components/
    │       ├── UnifiedAdminConfig.jsx  ← Config UI
    │       └── TemplateGallery.jsx     ← Template catalog
    └── package.json
```

---

## 🎨 Features

### For Content Creators
- **Visual configuration UI** - No JSON editing required
- **Template gallery** - Browse and select templates visually
- **Live preview** - See changes in real-time
- **Example presets** - Start from working examples
- **Export to JSON** - Save configurations for reuse

### For Developers
- **Modular SDK** - Reusable animation, effect, and layout utilities
- **Type-safe schemas** - Zod validation for all configurations
- **Hot reload** - Fast development iteration
- **Extensible registry** - Easy to add new template types
- **Collision detection** - Automatic layout validation

---

## 🛠️ Development

### Start Development Server
```bash
cd /workspace/KnoMotion-Videos
npm run dev
```

### Build for Production
```bash
npm run build
```

### Render a Video
```bash
npm run render -- src/scenes/your_scene.json
```

### Run Tests (when available)
```bash
npm test
```

---

## 📝 Creating Your First Video

### Method 1: Using the UI (Easiest)
1. Start dev server: `npm run dev`
2. Click **"Template Gallery & Config"**
3. Select a template (e.g., Explain2A)
4. Configure using the visual controls
5. Preview in real-time
6. Download JSON when satisfied

### Method 2: Using JSON (Power Users)
1. Copy an example scene from `/src/scenes/examples/`
2. Edit the JSON configuration
3. Load in the UI or use directly in code
4. Render with `npm run render`

See **[CONFIGURATION.md](./CONFIGURATION.md)** for JSON schema details.

---

## 🎯 Core Principles

### 1. Everything is Configurable
No hardcoded content. All text, colors, timing, and visuals are configured via JSON.

### 2. Broadcast Quality
Templates follow professional video standards, not PowerPoint aesthetics:
- Glassmorphic effects
- Particle systems
- Sophisticated animations
- Full-screen usage (90-95%)

### 3. Learning Intention Aligned
Templates map to pedagogical goals:
- **Hook** - Capture attention
- **Explain** - Teach concepts
- **Apply** - Practice skills
- **Reflect** - Consolidate learning

### 4. Domain Agnostic
Same template works for geography, sports, science, business, etc. Zero code changes.

---

## 🐛 Troubleshooting

### Common Issues

**Preview not loading?**
- Check console for errors
- Verify JSON schema is valid
- Reload player with refresh button

**Build failing?**
- Clear node_modules: `rm -rf node_modules && npm install`
- Check for missing dependencies
- Verify all imports are correct

**Template not rendering?**
- Ensure template is registered in TemplateRouter
- Check template_id in JSON matches registration
- Verify getDuration function exists

See **[SDK.md](./SDK.md)** for detailed troubleshooting.

---

## 🤝 Contributing

### Adding a New Template
See **[TEMPLATES.md](./TEMPLATES.md)** → "Creating New Templates" section

### Improving the SDK
See **[SDK.md](./SDK.md)** → "Contributing" section

### Reporting Issues
- Check existing documentation first
- Provide reproducible example
- Include error messages and screenshots

---

## 📊 System Stats

- **Templates:** 17 V6 templates (active)
- **SDK Elements:** 23 production-ready components (14 atoms, 9 compositions)
- **Animations:** 20+ animation functions (8 continuous life animations)
- **Layout Engines:** 7 types (GRID, RADIAL, CASCADE, STACK, etc.)
- **SDK Modules:** 20+ organized modules
- **Learning Intentions:** 8 core intentions
- **Scene Examples:** 25+ example configurations
- **Documentation:** 6 core docs + methodology
- **Showcase:** 3.5-minute demo video showcasing all capabilities

---

## 🔗 Quick Links

- **🎬 Showcase Demo:** [SHOWCASE.md](./SHOWCASE.md) ⭐ NEW!
- **📋 Project Plan:** [showCasePlan.md](./showCasePlan.md)
- **SDK Reference:** [SDK.md](./SDK.md) (23 elements, 8 animations)
- **Template Catalog:** [TEMPLATES.md](./TEMPLATES.md)
- **Configuration Guide:** [CONFIGURATION.md](./CONFIGURATION.md)
- **Polish Standards:** [docs/methodology/TEMPLATE_POLISH.md](./docs/methodology/TEMPLATE_POLISH.md)
- **Archive:** [docs/archive/](./docs/archive/)

---

## 📄 License

[Your License Here]

---

## 🎉 Get Started Now

```bash
cd /workspace/KnoMotion-Videos
npm install
npm run dev
```

**Happy creating!** 🚀
