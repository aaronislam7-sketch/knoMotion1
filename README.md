# KnoMotion POC Video Engine — Knodovia Showcase

Modernised Remotion workspace that proves the JSON-first KnoMotion engine can deliver multi-scene, on-brand stories end-to-end. This refresh focuses on a cohesive "Knodovia" trilogy, a reusable style/beat/asset system, and the docs future agents need to spin up new personalised videos fast.

## ⚡ Quick Start

### GitHub Codespaces (Recommended)
Simply open this repo in Codespaces - everything is automatically configured! The devcontainer will:
- Install all npm dependencies (clean install)
- Install system dependencies for video rendering (ffmpeg, Chrome libs)

Once the container is ready:
```bash
npm run dev
```
Open the forwarded port (3000), click **Showcase Preview**, and pick any Knodovia video.

### Local Development
```bash
# 1. Install npm dependencies (clean install recommended)
rm -rf node_modules package-lock.json
npm install

# 2. Start development server
npm run dev
```
Open `http://localhost:3000`, click **Showcase Preview**, and pick any Knodovia video.

> **Note**: For local video rendering, you'll also need to install system dependencies. See [Rendering MP4 Videos](#-rendering-mp4-videos-locally) below.

## ✅ What Shipped in This POC

### Core Engine
- **Ground truth stays `docs/videoGaps.md`** – feature cut lives there; this README only reflects what is currently implemented.
- **Scene renderer + transitions** – `src/compositions/SceneRenderer.jsx` centralises slot rendering, `SceneFromConfig`, and `SceneTransitionWrapper` with `fade`, `slide`, `page-turn`, `doodle-wipe`, and `eraser` types. Transitions are now **smoother and slower** (30 frames default) for a polished feel.
- **Style + emphasis system** – `src/sdk/theme/stylePresets.ts` and `src/sdk/theme/emphasisEffects.ts` expose curated presets with doodles, motion, and emphasis loops that mid-scenes consume via a single prop.
- **Beats helper** – `src/sdk/utils/beats.ts` enforces `start/hold/exit/emphasis` timing at scene and item level.
- **Background resolver** – `src/sdk/effects/resolveBackground.tsx` unlocks notebook, gradient, spotlight, clean card looks with optional noise. *(Note: Chalkboard removed from canon videos as too dark for brand)*

### Canon Showcase Videos
- **Six showcase compositions** – 3 desktop (1920×1080) + 3 mobile (1080×1920) versions covering the complete Knodovia orientation experience.
- **Slot array pattern** – scenes can sequence multiple mid-scenes in a single slot using arrays, with beats controlling visibility timing.
- **Mobile-first adaptations** – dedicated mobile compositions with simplified layouts, 2-column grid limits, and vertical-optimised content.

### Animated Icons & Emojis
- **Animated emoji as default** – All icon cards render animated Lottie emojis by default. Falls back gracefully to static if animation unavailable.
- **Icon sizing** – Dynamic icon sizing based on card dimensions with sensible caps for visual balance.
- **Asset registry upgrades** – `src/sdk/lottie/lottieRegistry.ts` covers all inline/static Lotties with aliases for legacy keys.

### Visual Polish
- **Smoother animations** – Checklist, bubble callouts, and mid-scene reveals use gentler spring physics for cohesive feel.
- **Slower exits** – Elements fade out over 0.8 seconds (was 0.25s) preventing jarring disappearances.
- **On-brand callout bubbles** – Redesigned with gradient backgrounds, accent glows, and prominent animated icons.
- **Text emphasis** – Decorative effects use subtle glows and highlights instead of hard borders.

## 🗂️ Engine Map (Essentials)
```
/workspace
├── README.md                     ← You are here
├── SDK.md / TEMPLATES.md / CONFIGURATION.md
├── docs/
│   ├── videoGaps.md             ← Authoritative gaps + POC cut
│   ├── POC_SHOWCASE.md          ← Knodovia video breakdowns
│   └── showcaseCanon.md         ← Canon patterns, mobile guide, LLM training data
└── KnoMotion-Videos/
    ├── src/
    │   ├── compositions/        ← KnodoviaVideo*.jsx, *_Mobile.jsx, SceneRenderer.jsx
    │   ├── admin/ShowcasePreview.jsx
    │   ├── sdk/
    │   │   ├── theme/stylePresets.ts, emphasisEffects.ts
    │   │   ├── effects/resolveBackground.tsx
    │   │   ├── utils/beats.ts
    │   │   ├── layout/viewportPresets.js, mobileRenderingGuide.js
    │   │   ├── lottie/lottieRegistry.ts, lottieIntegration.tsx
    │   │   └── elements/atoms/Image.jsx, Icon.jsx (animated emoji default)
    │   └── mid-scenes/…        ← TextReveal, BubbleCallout, GridCard, Checklist, etc.
    └── package.json / vite.config.js
```
Use `rg`, `Read`, or the docs above to dive into specifics.

## 📼 Canon Showcase Videos ("Knodovia Orientation Pack")

### Desktop (1920×1080)
| Video | Duration | File | Narrative |
|-------|----------|------|-----------|
| **Accidental Arrival** | ~75s | `KnodoviaVideo1_AccidentalArrival.jsx` | Cold-open hook, world introduction, before/after infrastructure, "don't touch anything" humour. |
| **Culture Engine Room** | ~80s | `KnodoviaVideo2_Culture.jsx` | 3 core values, daily rituals with scheduled confusion, social norms, holidays, "you'll fit right in". |
| **Bonkers Economy** | ~96s | `KnodoviaVideo3_Economics.jsx` | The Scrib currency, earning through teaching, knowledge marketplace, "infinite-sum" economics. |

### Mobile (1080×1920)
| Video | Duration | File | Adaptations |
|-------|----------|------|-------------|
| **📱 Accidental Arrival** | ~60s | `KnodoviaVideo1_Mobile.jsx` | Vertical rowStack layouts, 2-col grids, larger text. |
| **📱 Culture Engine Room** | ~67s | `KnodoviaVideo2_Mobile.jsx` | Values split across scenes, simplified checklists. |
| **📱 Bonkers Economy** | ~73s | `KnodoviaVideo3_Mobile.jsx` | Earning split into parts, no side-by-side comparisons. |

Full scene-by-scene documentation lives in `docs/showcaseCanon.md`.

## 🎨 Presets, Beats & Asset Registries

### Style Presets (`src/sdk/theme/stylePresets.ts`)
| Preset | Vibe & Defaults |
|--------|-----------------|
| `educational` | Title text, notebook background, underline doodle, steady pacing. |
| `playful` | Display text, sunrise gradient, highlight doodle, bouncy motion. |
| `minimal` | Body text, clean card background, minimal animation. |
| `mentor` | Clean/soft backgrounds, circular doodles, dramatic timing. |
| `focus` | Spotlight background, muted text, subtle underline.

Mid-scenes accept `stylePreset` and inherit typography, doodles, and suggested backgrounds automatically.

### Emphasis & Beats
- `src/sdk/theme/emphasisEffects.ts` defines `high/normal/low` treatments (color, highlight, pulse/breathe loops) that TextReveal, Checklist, etc. apply per line or bullet.
- `src/sdk/utils/beats.ts` returns consistent `{ start, hold, exit, emphasis }` values so layouts, transitions, and beats never fight each other.

### Background Presets
`src/sdk/effects/resolveBackground.tsx` unlocks:
- `notebookSoft` (lined pad overlay) – **recommended for educational content**
- `sunriseGradient` – **warm, engaging, great for openings/closings**
- `cleanCard` – **neutral, professional**
- `spotlight` (with adjustable focus) – **dramatic reveals**
- optional `layerNoise` on any preset

### Animated Emoji & Icons
- All emoji icons animate by default via Google's Lottie CDN
- Falls back to static emoji if animation unavailable (no errors)
- `src/sdk/elements/atoms/Icon.jsx` respects `fontSize` from parent for dynamic sizing
- Icon cards use horizontal layout (icon beside text) for better readability

## 🧩 Creating or Editing a Video

### 1. Pick a Layout
`scene.layout` values resolve through `resolveSceneSlots`:
- `full` – single content area
- `rowStack` – vertical rows (1-3 rows) – **preferred for mobile**
- `columnSplit` – horizontal columns – **desktop only**
- `headerRowColumns` – header + row + columns
- `gridSlots` – flexible grid

### 2. Assign Mid-Scenes
Each slot config specifies a mid-scene:
```js
slots: {
  header: { midScene: 'textReveal', stylePreset: 'playful', config: { /* ... */ } },
  row1:   { midScene: 'gridCards',  stylePreset: 'educational', config: { /* ... */ } },
}
```

### 3. Sequence Multiple Mid-Scenes (Slot Arrays)
For sequential content in one slot, use arrays with staggered beats:
```js
slots: {
  row1: [
    {
      midScene: 'textReveal',
      config: { lines: [{ text: 'First message', beats: { start: 1.0, exit: 4.0 } }] }
    },
    {
      midScene: 'heroText',
      config: { text: 'Second message', beats: { entrance: 4.5, exit: 8.0 } }
    }
  ]
}
```
Each mid-scene in the array renders in the same space; beats control when each appears/disappears.

### 4. Set Beats & Emphasis
- Top-level `config.beats` controls when the slot enters/exits
- Nested `lines`, `cards`, or `callouts` can add their own `beats` object
- Use `emphasis: 'high' | 'normal' | 'low'` for pulsing highlights

### 5. Choose Backgrounds & Transitions
```js
background: { preset: 'notebookSoft', layerNoise: true },
transition: { type: 'doodle-wipe', direction: 'right', wobble: true }
```
Supported transitions: `fade`, `slide`, `page-turn`, `doodle-wipe`, `eraser`

### 6. Mobile Considerations
When creating mobile versions:
- Use `format: 'mobile'` in scene config
- Prefer `rowStack` layouts (no `columnSplit`)
- Limit grids to 2 columns max
- Avoid `sideBySide` comparisons
- Use fewer items per scene
- See `docs/showcaseCanon.md` for complete mobile guidelines

### 7. Register & Preview
Export in `src/compositions/`, add to `src/admin/ShowcasePreview.jsx`, then `npm run dev` to preview.

## 🔁 Personalisation Hooks
These fields are intentionally simple so an LLM or rules engine can swap values at runtime:
- `stylePreset`, `background.preset`, `transition.type`
- Mid-scene content arrays (`lines`, `callouts`, `cards`, `items`)
- `beats` and item-level timing
- `icon` / `emoji` strings (animated by default)
- `heroType` + `heroRef` for `HeroTextEntranceExit`

Document personalised choices in your scene JSON so future agents can follow the narrative thread.

## 📚 Docs & References
- `docs/showcaseCanon.md` – **NEW**: Canon patterns, mobile guide, LLM training data
- `docs/videoGaps.md` – authoritative backlog + POC feature cut
- `docs/POC_SHOWCASE.md` – Knodovia scene tables, transitions, beats per scene
- `SDK.md` – SDK exports, atoms, compositions
- `TEMPLATES.md` – survey of legacy and V6 templates
- `CONFIGURATION.md` – JSON schema and validation notes

## 🎬 Rendering MP4 Videos Locally

Export compositions to MP4 files using the Remotion CLI.

### Prerequisites

**Option A: Codespaces (Zero Setup)**
If using GitHub Codespaces, all dependencies are pre-installed automatically. Skip to [Render a Video](#render-a-video).

**Option B: Local Development**
Run the setup script to install ffmpeg and Chrome dependencies:
```bash
./scripts/install-render-deps.sh
```

<details>
<summary>Manual installation (if script doesn't work)</summary>

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install -y ffmpeg \
  libatk1.0-0 libatk-bridge2.0-0 libcups2 libxcomposite1 \
  libxdamage1 libxfixes3 libxrandr2 libgbm1 libxkbcommon0 \
  libpango-1.0-0 libcairo2 libasound2 libnspr4 libnss3
```
*(On newer Ubuntu 24.04+, some packages have `t64` suffix: `libatk1.0-0t64`, etc.)*

**macOS:**
```bash
brew install ffmpeg
```
</details>

### Render a Video
Use the Remotion CLI with the entry point and composition ID:

```bash
npx remotion render KnoMotion-Videos/src/remotion/index.ts <CompositionId> out/<filename>.mp4
```

**Available Composition IDs:**
| Composition ID | Description |
|----------------|-------------|
| `TikTokBrainLies` | Your Brain Lies to You Every Day (mobile) |
| `TikTokADHD` | Why ADHD Brains Are Actually Overpowered (mobile) |
| `TikTok80msDelay` | You're Not in the Present (mobile) |
| `KnodoviaAccidentalArrival` | Knodovia Intro (desktop) |
| `KnodoviaAccidentalArrivalMobile` | Knodovia Intro (mobile) |
| `KnodoviaCulture` | Knodovia Culture (desktop) |
| `KnodoviaCultureMobile` | Knodovia Culture (mobile) |
| `KnodoviaEconomics` | Knodovia Economics (desktop) |
| `KnodoviaEconomicsMobile` | Knodovia Economics (mobile) |

**Example:**
```bash
npx remotion render KnoMotion-Videos/src/remotion/index.ts TikTokBrainLies out/brain-lies.mp4
```

### NPM Scripts
Convenience scripts are available in `package.json`:
```bash
npm run render:tiktok-brain   # Renders TikTokBrainLies
npm run render:tiktok-adhd    # Renders TikTokADHD
npm run render:tiktok-80ms    # Renders TikTok80msDelay
```

### Output
Rendered videos are saved to the `out/` directory (git-ignored).

## 🛠️ Troubleshooting Cheatsheet
- **Multiple Remotion versions** – ensure `@remotion/*` dependencies share the same version
- **Missing Lottie** – check the key exists in `LOTTIE_REGISTRY`. Dev mode logs warnings.
- **Animated emoji fallback** – icons fall back to static emoji automatically; no action needed
- **Layout warnings** – slot names must match the chosen layout
- **Mobile rendering issues** – use `format: 'mobile'` and stick to `rowStack` layouts

## 📄 License
Add your license text here.

Happy creating, and welcome to Knodovia! 🌍
