# KnoMotion POC Video Engine — Knodovia Showcase

Modernised Remotion workspace that proves the JSON-first KnoMotion engine can deliver multi-scene, on-brand stories end-to-end. This refresh focuses on a cohesive "Knodovia" trilogy, a reusable style/beat/asset system, and the docs future agents need to spin up new personalised videos fast.

## ⚡ Quick Start
```bash
cd /workspace/KnoMotion-Videos
npm install
npm run dev
```
Open `http://localhost:5173`, click **Showcase Preview**, and pick any Knodovia video.

## ✅ What Shipped in This POC
- **Ground truth stays `docs/videoGaps.md`** – feature cut lives there; this README only reflects what is currently implemented.
- **Three showcase compositions** (`src/compositions/KnodoviaVideo[1-3]_*.jsx`) plus registration in `src/admin/ShowcasePreview.jsx` – each is 90–120s with varied layouts, beats, transitions, and assets.
- **Scene renderer + transitions** – `src/compositions/SceneRenderer.jsx` centralises slot rendering, `SceneFromConfig`, and `SceneTransitionWrapper` with `fade`, `slide`, `page-turn`, `doodle-wipe`, and `eraser` types.
- **Style + emphasis system** – `src/sdk/theme/stylePresets.ts` and `src/sdk/theme/emphasisEffects.ts` expose curated presets with doodles, motion, and emphasis loops that mid-scenes consume via a single prop.
- **Beats helper** – `src/sdk/utils/beats.ts` enforces `start/hold/exit/emphasis` timing at scene and item level.
- **Background resolver** – `src/sdk/effects/resolveBackground.tsx` unlocks notebook, gradient, spotlight, clean card, and chalkboard looks with optional noise.
- **Asset registry upgrades** – `src/sdk/lottie/lottieRegistry.ts` + presets cover all inline/static Lotties, including aliases for legacy keys (e.g. `arrowFlow`). Icon atoms now support `@remotion/animated-emoji`, and `src/sdk/elements/atoms/Image.jsx` provides a reusable animated image primitive.
- **Documentation set** – this README, `SDK.md`, `TEMPLATES.md`, and the new `docs/POC_SHOWCASE.md` anchor everything that changed in this pass.

## 🗂️ Engine Map (Essentials)
```
/workspace
├── README.md                     ← You are here
├── SDK.md / TEMPLATES.md / CONFIGURATION.md
├── docs/
│   ├── videoGaps.md             ← Authoritative gaps + POC cut
│   └── POC_SHOWCASE.md          ← Knodovia video breakdowns
└── KnoMotion-Videos/
    ├── src/
    │   ├── compositions/        ← KnodoviaVideo*.jsx, SceneRenderer.jsx
    │   ├── admin/ShowcasePreview.jsx
    │   ├── sdk/
    │   │   ├── theme/stylePresets.ts, emphasisEffects.ts
    │   │   ├── effects/resolveBackground.tsx
    │   │   ├── utils/beats.ts
    │   │   ├── lottie/lottieRegistry.ts, lottieIntegration.tsx
    │   │   └── elements/atoms/Image.jsx, Icon.jsx (animated emoji)
    │   └── mid-scenes/…        ← TextReveal, BubbleCallout, GridCard, etc.
    └── package.json / vite.config.js
```
Use `rg`, `Read`, or the docs above to dive into specifics.

## 🎨 Presets, Beats & Asset Registries

### Style Presets (`src/sdk/theme/stylePresets.ts`)
| Preset | Vibe & Defaults |
|--------|-----------------|
| `educational` | Title text, notebook background, underline doodle, steady pacing. |
| `playful` | Display text, sunrise gradient, highlight doodle, bouncy motion. |
| `minimal` | Body text, clean card background, minimal animation. |
| `mentor` | Chalkboard gradient, circular doodles, dramatic timing. |
| `focus` | Spotlight background, muted text, subtle underline.

Mid-scenes accept `stylePreset` and inherit typography, doodles, and suggested backgrounds automatically.

### Emphasis & Beats
- `src/sdk/theme/emphasisEffects.ts` defines `high/normal/low` treatments (color, highlight, pulse/breathe loops) that TextReveal, Checklist, etc. apply per line or bullet.
- `src/sdk/utils/beats.ts` returns consistent `{ start, hold, exit, emphasis }` values so layouts, transitions, and beats never fight each other. Every Knodovia scene uses it at block level; TextReveal, Checklist, BubbleCallout, GridCard, and SideBySide also use it per item.

### Background Presets
`src/sdk/effects/resolveBackground.tsx` unlocks:
- `notebookSoft` (lined pad overlay)
- `sunriseGradient`
- `cleanCard`
- `chalkboardGradient`
- `spotlight` (with adjustable focus)
- optional `layerNoise` on any preset

### Lottie, Icons & Images
- `src/sdk/lottie/lottieRegistry.ts` + presets cover all assets (core checkmark, celebration, thermometer, snowflake, water drop, arrow flow, etc.). Legacy refs like `success`, `arrowFlow`, or raw filenames resolve through aliases; dev builds warn on unknown keys.
- `src/sdk/elements/atoms/Icon.jsx` integrates `@remotion/animated-emoji` so any emoji string becomes animated when assets exist; falls back gracefully otherwise.
- `src/sdk/elements/atoms/Image.jsx` is the new static image atom with fade/slide/zoom entrances, border radius control, and beat-aware timing. Side-by-side compare + grid cards use it for hero shots and data URI SVGs.

## 📼 Showcase Videos ("Knodovia Orientation Pack")
| Video | Scenes | File | Highlights |
|-------|--------|------|------------|
| **Accidental Arrival** | 5 | `src/compositions/KnodoviaVideo1_AccidentalArrival.jsx` | Cold-open hook, before/after infrastructure, notebook + sunrise backgrounds, overlapping callouts, animated hero Lottie. |
| **Culture Engine Room** | 5 | `src/compositions/KnodoviaVideo2_Culture.jsx` | Chalkboard + spotlight looks, animated checklist, grid cards with emoji icons, chaotic bubble overlaps, eraser + doodle-wipe transitions. |
| **Economic Playground** | 5 | `src/compositions/KnodoviaVideo3_Economics.jsx` | Stat-driven TextReveal, before/after currency market, badge grid cards, playful CTA scene, layered slide/page-turn transitions. |

Full scene-by-scene tables live in `docs/POC_SHOWCASE.md`.

## 🧩 Creating or Editing a Video
1. **Pick a layout per scene** – `scene.layout` values (`full`, `rowStack`, `columnSplit`, `headerRowColumns`, `gridSlots`) resolve through `resolveSceneSlots`. Valid slot names must match the layout.
2. **Assign mid-scenes** – each slot config looks like:
   ```js
   slots: {
     header: { midScene: 'textReveal', stylePreset: 'playful', config: { /* ... */ } },
     body:   { midScene: 'gridCards',  stylePreset: 'educational', config: { /* ... */ } },
   }
   ```
   Keep JSON concise and rely on presets instead of inline styling.
3. **Set beats + emphasis** – top-level `config.beats` controls when the slot enters/exits; nested `lines`, `cards`, or `callouts` can add their own `beats` object. Use `emphasis: 'high' | 'normal' | 'low'` when you need pulsing highlights.
4. **Choose backgrounds & transitions** – pass `background: { preset: 'notebookSoft', layerNoise: true }` and `transition: { type: 'page-turn', direction: 'right' }`. Only use the supported presets/types listed above.
5. **Register the video** – export the composition in `src/compositions/`, then add it to `src/admin/ShowcasePreview.jsx` so it appears in the admin UI.
6. **Preview & iterate** – `npm run dev` for interactive preview, `npm run build` to ensure the bundle stays clean.

## 🔁 Personalisation Hooks
These fields are intentionally simple so an LLM or rules engine can swap values at runtime:
- `stylePreset`, `background.preset`, `transition.type`
- Mid-scene content arrays (`lines`, `callouts`, `cards`, `before/after` blocks)
- `beats` and `defaultBeats` (timing tweaks per learner profile)
- `icon` / `emoji` strings, `lottieRef` keys, `image.src` (from a controlled registry)
- `heroType` + `heroRef` in `HeroTextEntranceExit`
Document personalised choices in your scene JSON so future agents can follow the narrative thread.

## 📚 Docs & References
- `docs/videoGaps.md` – authoritative backlog + POC feature cut.
- `docs/POC_SHOWCASE.md` – Knodovia scene tables, transitions, beats per scene.
- `SDK.md` – SDK exports, atoms, compositions.
- `TEMPLATES.md` – survey of legacy and V6 templates.
- `CONFIGURATION.md` – JSON schema and validation notes.
- `docs/template-content-blueprints/` – longer-form design blueprints per learning intention.

## 🛠️ Troubleshooting Cheatsheet
- **Multiple Remotion versions** – ensure `@remotion/*` dependencies share the same version (already pinned in `package.json`).
- **Missing Lottie** – check the key exists in `LOTTIE_REGISTRY`. Dev mode logs `[LottieRegistry] Unknown lottieRef` with the offending key.
- **Animated emoji fallback** – if Studio assets are missing, icons fall back to static emoji; add assets to `public/animated-emoji` for full animation.
- **Layout warnings** – slot names must match the chosen layout; see `src/sdk/scene-layout/sceneLayout.js` for valid keys.
- **Readability** – keep scene JSON short, prefer presets, and re-use `stylePreset` + `beats` defaults to stay LLM-friendly.

## 📄 License
Add your license text here.

Happy creating, and welcome to Knodovia! 🌍