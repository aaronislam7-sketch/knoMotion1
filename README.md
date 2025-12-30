# KnoMotion — JSON-First Video Engine

KnoMotion is a Remotion-based video engine that generates brand-aligned, personalized learning videos from programmatic JSON configurations. Built for LLM-powered video generation at runtime.

---

## Quick Start

### GitHub Codespaces (Recommended)

Open this repo in Codespaces—everything is automatically configured. Once ready:

```bash
npm run dev
```

Open the forwarded port (3000), click **Canon Videos**, and preview any composition.

### Local Development

```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## Documentation

| Document | Purpose |
|----------|---------|
| **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)** | How the engine works: layers, data flow, concepts |
| **[docs/reference-llm-guide.md](./docs/reference-llm-guide.md)** | Strict JSON schemas, examples, and validation rules |
| **[docs/instructions-llm-guide.md](./docs/instructions-llm-guide.md)** | LLM system prompt and behavioral guidelines |
| **[SDK.md](./SDK.md)** | Developer SDK reference (React components, animations) |

---

## Core Concept

```
Scene JSON → SceneFromConfig → Mid-Scenes → SDK Elements → Rendered Video
```

Videos are defined as arrays of scene objects. Each scene specifies:
- **Layout**: How the viewport is divided into slots
- **Background**: Visual context (gradients, particles, overlays)
- **Slots**: Content areas populated by mid-scenes
- **Transitions**: How scenes connect

```javascript
{
  id: 'intro-hook',
  durationInFrames: 150,  // 5 seconds at 30fps
  transition: { type: 'slide', direction: 'up' },
  config: {
    background: { preset: 'sunriseGradient', layerNoise: true },
    layout: { type: 'rowStack', options: { rows: 2, padding: 50 } },
    slots: {
      row1: { midScene: 'textReveal', config: { lines: [...], beats: {...} } },
      row2: { midScene: 'gridCards', config: { cards: [...], beats: {...} } }
    }
  }
}
```

---

## Mid-Scenes

Building blocks for content:

| Mid-Scene | Use Case |
|-----------|----------|
| `textReveal` | Animated text lines with emphasis |
| `heroText` | Hero visual + text (supports Lottie) |
| `gridCards` | Icon/image cards in grid layout |
| `checklist` | Bullet points with pop animations |
| `bubbleCallout` | Floating speech bubbles |
| `sideBySide` | Left vs right comparisons |

---

## Canon Videos

Tested reference compositions:

| Video | Format | Duration |
|-------|--------|----------|
| KnodoviaVideo1_AccidentalArrival | Desktop | ~75s |
| KnodoviaVideo2_Culture | Desktop | ~80s |
| KnodoviaVideo3_Economics | Desktop | ~96s |
| TikTok_BrainLies | Mobile | ~20s |
| TikTok_ADHDOverpowered | Mobile | ~25s |
| TikTok_80msDelay | Mobile | ~20s |

---

## Presets

### Style Presets

| Preset | Vibe | Background |
|--------|------|------------|
| `educational` | Structured, clear | notebookSoft |
| `playful` | Energetic, fun | sunriseGradient |
| `minimal` | Clean, simple | cleanCard |
| `mentor` | Wise, dramatic | chalkboardGradient |
| `focus` | Spotlight attention | spotlight |

### Background Presets

| Preset | Effect |
|--------|--------|
| `notebookSoft` | Lined paper overlay |
| `sunriseGradient` | Warm diagonal gradient |
| `cleanCard` | Neutral white |
| `chalkboardGradient` | Dark gradient |
| `spotlight` | Vignette focus |

Add `layerNoise: true` for film grain, or `particles: { enabled: true }` for floating particles.

### Transitions

| Type | Effect |
|------|--------|
| `fade` | Simple opacity |
| `slide` | Directional slide |
| `page-turn` | 3D page flip |
| `doodle-wipe` | Hand-drawn wipe |
| `eraser` | Eraser sweep |

---

## File Structure

```
/workspace
├── docs/
│   ├── ARCHITECTURE.md         ← Engine architecture guide
│   ├── reference-llm-guide.md  ← JSON schemas for LLMs
│   └── instructions-llm-guide.md ← LLM system prompt
├── SDK.md                       ← Developer SDK reference
├── KnoMotion-Videos/
│   └── src/
│       ├── compositions/        ← Video entry points
│       │   ├── SceneRenderer.jsx ← Core renderer
│       │   ├── KnodoviaVideo*.jsx ← Canon videos
│       │   └── TikTok_*.jsx
│       ├── sdk/                 ← The SDK
│       │   ├── mid-scenes/      ← Mid-scene components
│       │   ├── elements/        ← UI atoms & compositions
│       │   ├── theme/           ← Presets, emphasis, colors
│       │   ├── effects/         ← Backgrounds, particles
│       │   ├── lottie/          ← Animation registry
│       │   └── animations/      ← Animation helpers
│       └── admin/               ← Preview tools
└── Archive/                     ← Legacy code reference
```

---

## Rendering Videos

### Render to MP4

```bash
npx remotion render KnoMotion-Videos/src/remotion/index.ts <CompositionId> out/<filename>.mp4
```

### Available Composition IDs

| ID | Description |
|----|-------------|
| `TikTokBrainLies` | Brain Lies (mobile) |
| `TikTokADHD` | ADHD Overpowered (mobile) |
| `TikTok80msDelay` | 80ms Delay (mobile) |
| `KnodoviaAccidentalArrival` | Knodovia Intro (desktop) |
| `KnodoviaCulture` | Knodovia Culture (desktop) |
| `KnodoviaEconomics` | Knodovia Economics (desktop) |

### NPM Scripts

```bash
npm run render:tiktok-brain
npm run render:tiktok-adhd
npm run render:tiktok-80ms
```

---

## LLM Integration

For LLM-powered video generation:

1. Use **[docs/reference-llm-guide.md](./docs/reference-llm-guide.md)** as the schema reference
2. Use **[docs/instructions-llm-guide.md](./docs/instructions-llm-guide.md)** as the system prompt
3. Validate generated JSON against the schemas before rendering

The LLM guides cover:
- Complete JSON schemas for all mid-scenes
- Lottie registry keys
- Beat timing guidelines
- Common patterns and anti-patterns
- Validation checklists

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Multiple Remotion versions | Ensure `@remotion/*` packages share the same version |
| Missing Lottie | Check key exists in registry (see reference guide) |
| Layout warnings | Slot names must match layout type |
| Mobile rendering | Use `rowStack` layouts, 2-column grids max |

---

## License

Add your license text here.

---

**Welcome to KnoMotion!** 🎬
