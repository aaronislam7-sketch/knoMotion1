# KnoMotion — JSON-First Video Engine

KnoMotion is a Remotion-based video engine that generates brand-aligned, personalized learning videos from programmatic JSON configurations. Built for LLM-powered video generation at runtime.

The repo has two live parts:

- **Renderer** (`KnoMotion-Videos/`) — the JSON-driven Remotion engine: 11 mid-scenes, 5 layouts, beats timing, transitions, audio/caption layer, Zod schema, capability manifest. Plus a Vite admin app for previewing and building scenes.
- **Content pipeline** (`knomotion-pipeline/`) — a standalone Node CLI that compiles source text into validated, renderable scene JSON (intake → analysis → planning → script → scene JSON → validation → repair). TTS, render and PDF intake are the next milestones — see `Sept_DevPlan.md`.

`KnoSlides/` (interactive slides) is a separate, backlogged product that is leaving this repo; `Archive/` is legacy reference only. See `RETAIN_ARTIFACTS.md` for what is live.

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
npm install                       # renderer + admin app (root)
npm run dev                       # admin app on http://localhost:3000
npm run studio                    # Remotion Studio for the compositions in Root.tsx
```

### Content pipeline (source text → scene JSON)

```bash
cd knomotion-pipeline && npm install
npm run run -- --source worldcup                    # offline, deterministic mock provider
npm run run -- --source worldcup --provider openai  # real run (needs OPENAI_API_KEY)
npm test
```

Artifacts land in `knomotion-pipeline/pipeline/artifacts/<jobId>/`; the renderable output per video is `05-knomotion-video-config.json`. Full run/handoff notes: **[pipeline_build.md](./pipeline_build.md)**.

---

## Documentation

| Document | Purpose |
|----------|---------|
| **[Sept_DevPlan.md](./Sept_DevPlan.md)** | Current plan: milestones, revised pipeline stage order, scope decisions. Start here for what happens next. |
| **[pipeline_build.md](./pipeline_build.md)** | Pipeline handoff: how to run, stage map, conventions, known failure modes |
| **[RETAIN_ARTIFACTS.md](./RETAIN_ARTIFACTS.md)** | Living keep/remove register — what in this repo is live, dead, or undecided |
| **[TECH_DEBT.md](./TECH_DEBT.md)** | Pre-investigated engine bugs (TD-001…008) with acceptance criteria |
| **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)** | How the engine works: layers, data flow, concepts |
| **[docs/reference-llm-guide.md](./docs/reference-llm-guide.md)** | Human/agent authoring guide for scene JSON. Not read by the pipeline (which uses `capability-manifest.json` + the mid-scene JSON schemas); being re-purposed in Sept plan M3. |
| **[SDK.md](./SDK.md)** | Developer SDK reference (React components, animations). Some counts are stale — see `RETAIN_ARTIFACTS.md`. |
| `July_DevPlan.md` | Superseded by the Sept plan; kept for its root-cause analysis |

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

Building blocks for content. These 11 canonical keys are the only ones `SceneRenderer` resolves; aliases are not rendered.

| Mid-Scene | Use Case |
|-----------|----------|
| `textReveal` | Animated text lines with emphasis (typewriter, fade, slide, mask, remotion-bits reveals) |
| `heroText` | Hero visual (image / Lottie / emoji / SVG) + optional title |
| `gridCards` | Icon/image cards in a grid with staggered entrance |
| `checklist` | Bullet points with pop/list animations and icon presets |
| `bubbleCallout` | Floating speech-bubble callouts with collision avoidance |
| `sideBySide` | Left vs right comparison (uses `layout: full`; makes its own columns) |
| `iconGrid` | Grid of icons with labels |
| `cardSequence` | Stacked or grid cards revealed in sequence |
| `bigNumber` | One large number with label (pop / countUp) |
| `animatedCounter` | Counting number with prefix/suffix |
| `codeBlock` | Syntax-highlighted code with line-by-line / typing / highlight reveals |

Machine-readable details: `KnoMotion-Videos/src/sdk/capability-manifest.json` and `KnoMotion-Videos/src/sdk/mid-scenes/schemas/*.json`.

---

## Canon Videos

Hand-built reference compositions registered in `Root.tsx`. They stay as-is until a pipeline-generated video is judged good enough, then convert to JSON under `KnoMotionVideo` (Sept plan D3).

| Video | Format | Duration |
|-------|--------|----------|
| KnodoviaVideo1_AccidentalArrival (+ `_Mobile`) | Desktop / Mobile | ~75s |
| KnodoviaVideo2_Culture (+ `_Mobile`) | Desktop / Mobile | ~80s |
| KnodoviaVideo3_Economics (+ `_Mobile`) | Desktop / Mobile | ~96s |
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

| Type | Status |
|------|--------|
| `fade` | Active — opacity crossfade |
| `slide` | Active — directional push (`up/down/left/right`) |
| `page-turn` | Active — 3D flip (`left/right`) |
| `clock-wipe` | Active — circular reveal |
| `iris` | Active — expanding circular mask |
| `doodle-wipe`, `eraser`, `spring` | Legacy — accepted, fall back to `slide` |

---

## File Structure

```
/workspace
├── Sept_DevPlan.md              ← Current plan
├── pipeline_build.md            ← Pipeline handoff
├── RETAIN_ARTIFACTS.md          ← Keep/remove register
├── TECH_DEBT.md                 ← Engine bug register
├── docs/
│   ├── ARCHITECTURE.md          ← Engine architecture guide
│   └── reference-llm-guide.md   ← Scene-JSON authoring guide (humans/agents)
├── KnoMotion-Videos/
│   └── src/
│       ├── remotion/Root.tsx    ← Composition registry (KnoMotionVideo + canon comps)
│       ├── compositions/
│       │   ├── GenericVideoPlayer.jsx ← THE composition: renders any VideoConfig
│       │   ├── SceneRenderer.jsx      ← Layout → slots → mid-scenes
│       │   ├── KnodoviaVideo*.jsx     ← Canon videos (hand-built)
│       │   └── TikTok_*.jsx
│       ├── sdk/
│       │   ├── mid-scenes/       ← 11 mid-scene components + schemas/*.json
│       │   ├── capability-manifest.json ← What the engine can do (read by the pipeline)
│       │   ├── schemas/videoConfig.schema.ts ← Zod schema for KnoMotionVideo props
│       │   ├── scene-layout/, layout/ ← Slot geometry, viewport padding
│       │   ├── elements/         ← UI atoms & compositions
│       │   ├── theme/, effects/, lottie/, animations/, audio/, transitions/
│       │   └── utils/            ← beats.ts, ttsToBeatAlignment.ts
│       └── admin/                ← Vite preview + scene builder
├── knomotion-pipeline/
│   └── pipeline/
│       ├── orchestrator.ts, cli.ts
│       ├── stages/               ← One handler per stage (8–12 are stubs)
│       ├── schemas/              ← Zod contract per artifact
│       ├── prompts/              ← One prompt module per LLM stage
│       ├── core/                 ← Stage runner, artifact store, LLM clients, capability bridge
│       ├── sources/              ← Source .md files (--source <name>)
│       └── __tests__/
├── KnoSlides/                    ← Backlogged, leaving the repo (Sept plan D2)
└── Archive/                      ← Legacy reference only; nothing live imports it
```

---

## Rendering Videos

### Render to MP4

`remotion.config.ts` sets the entry point, so the composition ID is enough:

```bash
npx remotion render <CompositionId> out/<filename>.mp4
# or explicitly:
npx remotion render KnoMotion-Videos/src/remotion/index.ts <CompositionId> out/<filename>.mp4
```

### Available Composition IDs (from `Root.tsx`)

| ID | Description |
|----|-------------|
| `KnoMotionVideo` | Generic composition — renders any `VideoConfig` passed as props (what the pipeline targets) |
| `TikTokBrainLies` | Brain Lies (mobile) |
| `TikTokADHDOverpowered` | ADHD Overpowered (mobile) |
| `TikTok80msDelay` | 80ms Delay (mobile) |
| `KnodoviaAccidentalArrival` / `KnodoviaAccidentalArrivalMobile` | Knodovia Intro |
| `KnodoviaCulture` / `KnodoviaCultureMobile` | Knodovia Culture |
| `KnodoviaEconomics` / `KnodoviaEconomicsMobile` | Knodovia Economics |

Render a pipeline output as a still (until the render stage lands in Sept plan M4):

```bash
CFG=$(ls knomotion-pipeline/pipeline/artifacts/*/videos/*/05-knomotion-video-config.json | head -1)
npx remotion still KnoMotionVideo out/frame.png --props="$CFG" --frame=30
```

> The `npm run render:tiktok-*` scripts in `package.json` pass `src/remotion/index.ts`, a path that does not exist at the repo root; use the commands above instead (tracked in `RETAIN_ARTIFACTS.md`).

---

## LLM Integration

The pipeline in `knomotion-pipeline/` is the supported way to generate videos with an LLM. It learns what the engine can do from two machine-readable sources, loaded at runtime:

1. `KnoMotion-Videos/src/sdk/capability-manifest.json` — canonical mid-scene keys, layouts, backgrounds, transitions, lottie keys, limits
2. `KnoMotion-Videos/src/sdk/mid-scenes/schemas/*.json` — deep per-mid-scene config schemas (validated with ajv)

`docs/reference-llm-guide.md` is the human-readable counterpart for anyone authoring scene JSON by hand or with an ad-hoc LLM. Its purpose and generation are being settled in Sept plan M3; until then treat the manifest and schemas as authoritative where they disagree.

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
