# KnoMotion Pipeline — Build Progress & Handoff

> Handoff for the next agent continuing the KnoMotion content pipeline.
> Read this top-to-bottom, then `TECH_DEBT.md` (engine issues) before coding.
> Last updated: 2026‑09‑16 (Sept M2 — guardrails + Stage 9 render-check).

---

## 0. TL;DR

- We built a **standalone `knomotion-pipeline/` package** that compiles source text → validated, renderable KnoMotion scene JSON. It runs as a **CLI** today (no UI yet).
- It is a **structured compiler**, not a chatbot: one orchestrator, many typed stages, LLM only where judgement is needed, a Zod contract + artifact on disk at every step, and a deterministic validation + surgical-repair safety net.
- **Stages 0–11 are implemented** (intake → content-analysis → module-planning → video-planning → script-generation → tts → timing → scene-json-generation → validation → **render-check** → repair → assembly). Only **12 render** and **captions** remain stubs.
- It runs **end-to-end** with a `mock` provider (offline, deterministic) and against **OpenAI** (`--provider openai`).
- **Quality is now guarded in four layers (Sept M2):** the prompt states per-scene allowed mid-scenes and per-slot text budgets; validation turns layout/slot, text-budget, content-shape and timing mistakes into **errors**; **Stage 9 render-check** renders stills of every scene and fails `blank_slot` / `edge_bleed` so a scene that renders nothing can never pass silently again; and the renderer bugs that made valid configs invisible (TD‑001/002/003/004a/006/009) are fixed. §7 records the history and what is still open (M3–M5).

---

## 1. Where the code lives & how to run

```
knomotion-pipeline/                 ← standalone package (own package.json, tsconfig, tests)
  pipeline/
    orchestrator.ts                 ← runPipeline(): the chain + fan-out + validate→render-check→repair loop; renderCheckJob()
    cli.ts                          ← CLI entry (--source/--input/--text/--provider/--stop-after; preview / render-check commands)
    config/models.ts                ← MODEL ROUTING (edit here to change models per stage)
    core/
      stage.ts                      ← Stage<In,Out> contract + runStage
      context.ts                    ← PipelineContext + makeMeta (ArtifactMeta envelope)
      artifact-store.ts             ← validated-on-write/read artifact I/O + job.json manifest
      config.ts, logger.ts, ids.ts, errors.ts
      llm/                          ← client.ts (interface), mock.ts, openai.ts, index.ts (factory)
      capabilities/renderer-capabilities.ts  ← loads renderer manifest + mid-scene JSON schemas (ajv)
      geometry.ts                   ← (M2) mirror of the renderer's slot carving, from manifest layoutGeometry (drift-tested)
      text-budget.ts                ← (M2) per-slot max chars / max items from geometry + manifest textMetrics
      content-shapes.ts             ← (M2) contentShape enum, synonyms, shape → allowed mid-scene subset
      timing.ts                     ← (M1) narration audio → durationInFrames + beat windows
      render/                       ← (M2) Stage 9: still-renderer.ts (bundle once + renderStill), frame-plan.ts, pixel-checks.ts
    schemas/                        ← Zod contracts for every artifact (the locked source of truth)
    prompts/                        ← one versioned prompt module per LLM stage
    stages/                         ← one handler per stage (+ _stub.ts for out-of-scope stages)
    sources/                        ← drop .md source files here; run with --source <name>
    artifacts/                      ← runtime job output (gitignored)
    __tests__/                      ← vitest suite
```

**The only coupling point to the renderer is `KnoMotionVideoConfig.json`** (Stage 7 output). The pipeline never imports renderer React code; it *reads* the renderer's capability data files at runtime (`KnoMotion-Videos/src/sdk/capability-manifest.json` + `mid-scenes/schemas/*.json`) and, for Stage 9, *bundles and renders* the renderer through `@remotion/bundler` / `@remotion/renderer` exactly as Studio does (shared `webpackOverride.ts`). Geometry the pipeline needs (slot rects, safe band, font metrics) is published in the manifest (`layoutGeometry`, `textMetrics`, `contentShapes`) and mirrored in `core/geometry.ts`; `geometry.test.ts` fails on drift against the real `resolveSceneSlots()`.

### Run it

```bash
# 1) get everything in one branch (see §6 for the branch map)
git checkout cursor/pipeline-integration-8c94 && git pull
cd knomotion-pipeline && npm install

# 2) offline, deterministic (no API key) — proves the machinery. With the renderer
#    installed at the repo root, Stage 9 renders stills of every scene as part of the run:
npm run run -- --source worldcup

# 3) real LLM run (needs OPENAI_API_KEY in env / Cloud Agents secret):
npm run run -- --source worldcup --provider openai

# 4) re-run the pixel checks on an existing job and print a per-scene table
#    (jobId optional → latest; stills land in videos/<video>/render-check/):
npm run run -- render-check <jobId>

# 5) watch a job in Studio, optionally with slot bounds + safe band drawn:
npm run run -- preview <jobId> --debug-safe-zones
npx remotion studio KnoMotion-Videos/src/remotion/index.ts      # from the repo root → "PipelinePreview"

# tests:
npm test                                   # 100 pass, 7 skip (rendered fixtures)
KNOMOTION_RENDER_TESTS=1 npm test          # + renders the M2 acceptance fixtures (~15s, needs the renderer)

# one-off still (needs one-time root `npm install` for Remotion):
CFG=$(ls knomotion-pipeline/pipeline/artifacts/*/videos/*/05-knomotion-video-config.json | head -1)
npx remotion still KnoMotion-Videos/src/remotion/index.ts KnoMotionVideo out/frame.png --props="$CFG" --frame=30
```

- Add source docs by dropping `*.md` into `knomotion-pipeline/pipeline/sources/` and running `--source <name>`.
- Model routing is in `pipeline/config/models.ts`: default `gpt-5.4-mini`; escalated to `gpt-5.5` for content-analysis, module-planning, video-planning, repair. Change the strings there if model ids differ in your account.

---

## 2. Mental model / architecture

```
source text
  → [0 intake]            SourceBundle.json        (deterministic)
  → [1 content-analysis]  ContentMap.json          (LLM)
  → [2 module-planning]   ModulePlan.json          (LLM)   → N VideoBriefs
  for each VideoBrief (fan-out):
    → [3 video-planning]  03-video-plan.json          (LLM)
    → [4 script-gen]      04-narration-script.json    (LLM)
    → [5 tts]             04a-tts-manifest.json       (provider call: elevenlabs | mock; + audio/<scene>.mp3)
    → [6 timing]          04b-scene-timing.json       (deterministic: audio → durationInFrames + line windows)
    → [7 scene-json]      05-knomotion-video-config.json (LLM "compiler"; timing injected + re-applied)  ← renderer coupling
    → [8 validation]      06-validation-report.json   (deterministic; deep ajv + business rules — M2 rules are errors)
    → [9 render-check]    09-quality-report.json      (deterministic; only when 8 passes: 3 stills/scene vs background baseline →
                          + render-check/*.png          blank_slot / edge_bleed merged into 06-… as errors)
    → [10 repair]         07-repair-<i>-<n>.json      (LLM, only on failure; ≤2 attempts → needs_review; timing re-applied to each patch;
                                                       each attempt re-runs 8 and 9)
    → [11 assembly]       08-render-manifest.json     (deterministic: narration audio wired into 05-…config.json)
  stubs: [12 render] (M4), [captions] (M5)
```

- Every stage implements the same `Stage<In,Out>` interface. The orchestrator validates input, runs, then the artifact store validates + writes the output. Stages never call each other — they only consume/produce artifacts. This is what makes runs **replayable, auditable, and repairable**.
- Artifacts land in `pipeline/artifacts/<jobId>/` with per-video nesting under `videos/<videoId>/`, plus a `job.json` run manifest (per-stage status, timing, model, promptVersion).
- **Timing is deterministic, not authored (Sept M1).** `core/timing.ts` turns the narration audio (measured by TTS, or a ~2.5 wps estimate for the mock provider) into each scene's `durationInFrames` and per-line visibility windows. Stage 7 receives that as a fixed input and its post-process overwrites whatever the LLM wrote for `durationInFrames` / `beats`; repair patches are re-timed the same way. The LLM decides *what* is on screen, never *when*.
- **"Valid" now means "renders" (Sept M2).** Stage 8 proves the JSON is well-formed against the geometry the renderer will use (slot names the layout really produces, text that fits the slot, mid-scenes allowed for the planned `contentShape`, beats that keep content on screen). Stage 9 then proves it *renders*: for each scene it renders three stills (settled / midpoint / pre-exit, chosen from the scene's own beats) plus a background-only baseline at the same frames, and diffs them — a configured slot with (almost) nothing where `resolveSlots()` put it is `blank_slot`; anything inside the outer safe band (60px desktop / 40px mobile, `getViewportPadding`) is `edge_bleed`. Both are merged into the validation report as errors and repaired like any rule failure. Stills are kept under `videos/<video>/render-check/` for human review.

---

## 3. What has been built

### Stages

| # | Stage | Handler | Status | Files |
|---|-------|---------|--------|-------|
| 0 | Intake | deterministic | ✅ text/markdown (PDF/URL slots reserved) | `stages/intake/runIntake.ts` |
| 1 | Content Analysis | LLM | ✅ | `stages/content-analysis/…`, `prompts/content-analysis.ts` |
| 2 | Module Planning | LLM | ✅ | `stages/module-planning/…`, `prompts/module-planning.ts` |
| 3 | Video Planning | LLM (per video) | ✅ (capped 3–6 scenes) | `stages/video-planning/…`, `prompts/video-planning.ts` |
| 4 | Script Generation | LLM | ✅ | `stages/script-generation/…`, `prompts/script-generation.ts` |
| 5 | TTS | provider call | ✅ ElevenLabs (`with-timestamps` → word timings) or `mock` (estimated timings, no audio); one clip per scene; content-addressed cache; a failed clip degrades to an estimate, not a failed run | `stages/tts/generateTTS.ts`, `core/tts/{index,elevenlabs,mock,provider}.ts` |
| 6 | Timing | deterministic | ✅ audio → `durationInFrames` + per-line windows; same shape from measured or estimated audio | `stages/timing/computeTiming.ts`, `core/timing.ts`, `schemas/SceneTiming.ts` |
| 7 | Scene JSON (compiler) | LLM | ✅ timing injected and re-applied; prompt states per-scene allowed mid-scenes (from `contentShape`) and per-slot text budgets (M2) | `stages/scene-json-generation/…`, `prompts/scene-json-generation.ts` (v2.1) |
| 8 | Validation | deterministic | ✅ deep per-mid-scene (ajv) + business rules; M2 added `slot_layout_reconcile`, `text_budget`, `content_shape` and a strict `beat_timing` — all errors | `stages/validation/validate.ts`, `runValidation.ts` |
| 9 | Render-check | deterministic | ✅ (M2) bundles once per process, `renderStill()` 3 frames/scene + background baseline, `blank_slot` / `edge_bleed` pixel checks → `09-quality-report.json` + stills; findings feed repair | `stages/render-check/runRenderCheck.ts`, `core/render/*` |
| 10 | Repair | LLM | ✅ repairs all failing scenes, ≤2 attempts; each patch is re-timed, re-validated and re-rendered; prompt knows the M2 rules (v1.1) | `stages/repair/runRepair.ts`, `prompts/repair.ts` |
| 11 | Assembly | deterministic | ✅ copies clips to `public/pipeline-audio/<job>/<video>/`, writes `audio.narration` (public-relative `src`, `startFromSeconds` = lead-in) back into `05-…config.json`; `08-render-manifest.json` | `stages/assembly/buildRenderProps.ts` |
| 12 | Render | deterministic | ⛔ stub (Sept M4) — `core/render/still-renderer.ts` already owns the bundle + browser it will need | `stages/render/triggerRender.ts` |
| — | Captions | deterministic | ⛔ stub (Sept M5; word timings are already stored in the TTS manifest) | `stages/captions/generateCaptions.ts` |
| — | QualityReport | — | ✅ `renderCheck` section populated by Stage 9 (per scene/frame slot coverage + edge stats, issues, `scores.blankSlotRate` / `edgeBleedRate`); creator-portal `humanEdits` still scaffold | `schemas/QualityReport.ts` |

**Validation rules (M2 additions, all errors).** `slot_layout_reconcile` — layout `options` the renderer would silently default (`rows`, `columns`) must be present; every configured slot name must be one the resolved layout produces (`col3` on 2 columns is an error); when the parse-time fold changed the layout family (`sideBySide`→`full`, recorded as `layout._coercedFrom`) and orphaned `left`/`right`, the error names the fold so repair can move content into `full`. `text_budget` — each string and item count must fit `computeTextBudget(midScene, slotRect)` (chars = slot width / (fontSize × `charWidthRatio`) × `lineCapacity`; counts from slot height / row height), computed from the same geometry the prompt was given. `content_shape` — a content-slot mid-scene must be in `allowedMidScenesFor(scene.contentShape)` (header exempt; silent without a shape map, i.e. hand-authored configs). `beat_timing` — every beat within `[0, durationSec]` (no `>20s` escape hatch), `start < exit`, visible ≥ 1.2s (reading-time *warning* above that), `textReveal` lines need per-line beats, slot items need `beats.exit` (the renderer drops them ~2.4s in otherwise), and content may not exit more than 2.5s before the scene ends. `unknown_keys` is now declared in `rulesChecked()`.

**Render-check knobs (M2).** `--render-check auto|on|off` / `KNOMOTION_RENDER_CHECK` (default `auto`: run when `@remotion/renderer` + `@remotion/bundler` resolve from the repo root, otherwise report `skipped` — `on` fails the run instead; `--stop-after validation` also skips it). `renderCheckScale` (0.5 → 960×540 stills; thresholds are scale-aware) and `renderCheckFramesPerScene` (1–3) in `core/config.ts`; `render-check <jobId> --frames 3 --scale 0.5 --video <id>` on the CLI. Thresholds live in `core/render/pixel-checks.ts` `DEFAULT_THRESHOLDS`, calibrated on real stills: `pixelTolerance 28` (per-channel diff vs the baseline; a deterministic render's noise is 0), `blankMinPixels 1500` native px (a broken `<img>`'s alt text is ~780px; the shortest real content, a 4-letter header, ~2,300px; one body line ~14,000px), `edgeBleedMaxCoverage 0.002` of a band's area (~230px on the 1920×60 top band — ignores a soft shadow, catches a clipped glyph). Severity: blank at the midpoint or in every sampled frame → error, blank in one edge frame only → warning; any edge bleed → error, attributed to the configured slot nearest that edge. Frame plan (`core/render/frame-plan.ts`): settled = earliest `beats.start` + 1.0s, pre-exit = latest `beats.exit` − 0.4s (the exit animation starts *at* `exit`), midpoint between them; margins shrink proportionally on short windows. Cost: bundling ~2–60s once per process (webpack cache), then ~0.3s per still; the mock `worldcup` run (3 scenes, 18 stills) adds ~10s.

**TTS / audio knobs (M1).** `--tts mock|elevenlabs` (default `mock`). Env: `ELEVENLABS_API_KEY` (required for `elevenlabs`), `ELEVENLABS_VOICE_ID` (default Rachel `21m00Tcm4TlvDq8ikWAM`), `ELEVENLABS_MODEL_ID` (default `eleven_multilingual_v2`), `KNOMOTION_TTS_CACHE_DIR` (default `pipeline/cache/tts`, gitignored), `KNOMOTION_PUBLIC_DIR` (default `<repo>/public`). Renderer side: `sdk/audio/SafeAudio.jsx` resolves public-relative `src` via `staticFile()`; `sdk/audio/audioSchema.ts` and the pipeline mirror accept URLs *or* public-relative paths (no leading `/`, no `..`); `calculateTransitionSeriesDuration` now honours per-scene `transition.durationInFrames`; `core/fps.ts` is the one place the pipeline's `30` lives and `fps.test.ts` asserts it equals the manifest's `constraints.fpsFixed`.

### Supporting infrastructure (all built)

- **Contracts (`schemas/`)** — Zod schema + TS type for every artifact, each wrapped in an `ArtifactMeta` envelope (jobId, stage, producedBy, model, promptVersion, inputs, createdAt). `KnoMotionVideoConfig.ts` is a faithful, standalone **mirror** of the renderer's `VideoConfigSchema` (kept in sync via comments), restricted to the **11 canonical mid-scene keys**.
- **Orchestrator** — module→video fan-out, per-stage timing/manifest, `--stop-after`, and the assess→repair loop where *assess* = validate, then (only when the rules pass and render-check is enabled) render stills and merge `blank_slot`/`edge_bleed` into the report via `mergeRenderCheck()` (repairs every failing scene per attempt; `needs_review` after the cap). When any repair patch is applied, the repaired config is **written back to `05-knomotion-video-config.json`** (and recorded in `job.json`), so `configPath` always points at the final config — including best-effort repairs on `needs_review`. `renderCheckJob()` re-runs Stage 9 on an existing job for the CLI.
- **LLM client** — provider-agnostic. `MockLLMClient` (deterministic, input-aware, used offline + in tests). `OpenAIClient` (JSON mode, Zod-parse, corrective retries with exact-path feedback, **null-property pruning**, **temperature fallback** for gpt‑5.x). Factory in `core/llm/index.ts`.
- **Capability bridge** — `renderer-capabilities.ts` loads the renderer manifest + 11 mid-scene JSON schemas at runtime and compiles them with `ajv` (Option A: one-directional data dependency, no drift). Overridable via `KNOMOTION_RENDERER_SDK_DIR`.
- **Validation engine (`validate.ts`)** — rules: `schema`, `unknown_keys`, `midscene_name`, `midscene_config` (deep ajv), `layout_type`, `transition_type`, `slot_names`, `slots_filled`, `slot_layout_reconcile` (M2), `sidebyside_layout`, `content_shape` (M2), `duration_bounds`, `beat_timing` (M2 strict), `text_length` (warning), `text_budget` (M2), `audio_url`, `lottie_key`; plus `blank_slot` / `edge_bleed` from Stage 9. Severity policy: **error** = renders broken → blocks + triggers repair; **warning** = quality/uncertain.
- **LLM-drift coercions (in the schemas)** — self-heal common model mistakes at parse time: `null`→absent, difficulty synonyms/case, key aliases (`problem`→`description`, `misconception`→`statement`, `id`→`sceneId`, …), `background:"x"`→`{preset:"x"}`, `layout:"x"`→`{type:"x"}`, background/layout **vocabulary folding** (`focus`→`spotlight`, `twoColumn`→`columnSplit`, `sideBySide`→`full`), flat-scene → `config` lifting, `durationSeconds`→`durationInFrames`, and dropping non-object junk in `scenes[]`. **M2:** a fold that changes the layout *family* records `layout._coercedFrom`, and `slot_layout_reconcile` turns any slot it orphaned into an error — coercion stays for syntactic drift only.
- **Content shapes (M2)** — `ScenePlanSchema.contentShape` (`statement | sequence | comparison | quantity | structure | code`), authored by Stage 3 and inferred deterministically from `purpose`/`suggestedMidScenes` when missing. `core/content-shapes.ts` maps each shape to its allowed mid-scene subset; the Stage 7 user message lists it per scene; `content_shape` enforces it. The manifest's `contentShapes` block is the published source.
- **CLI** — `--source <name>` (from `sources/`), `--input <path>`, `--text "…"`, `--title`, `--format`, `--provider`, `--tts`, `--render-check`, `--out`, `--stop-after`, `--log-level`; commands `preview [jobId] [--video] [--debug-safe-zones]` and `render-check [jobId] [--video] [--frames] [--scale]`.
- **Renderer-side debug (M2)** — `debugSafeZones: true` on `GenericVideoPlayer` (`compositions/SafeZoneOverlay.jsx`) draws the safe band and every layout slot with its name and size; `preview --debug-safe-zones` sets it on the staged config. Use it to read a `blank_slot` / `edge_bleed` finding against what the layout engine actually carved.
- **Tests (vitest)** — `validation.test.ts` (one broken fixture per rule + baseline, incl. M2 rules), `geometry.test.ts` (slot-carving drift vs the real renderer + text budgets), `pixel-checks.test.ts` (blank/bleed maths + frame plan on synthetic buffers), `render-check.test.ts` (`mergeRenderCheck`, the M2 acceptance fixture set — rendered half behind `KNOMOTION_RENDER_TESTS=1`), `repair-writeback.test.ts`, `timing.test.ts`, `tts.test.ts`, `renderer-timing.test.ts`, `fps.test.ts`, `artifact-store.test.ts`, `orchestrator.test.ts` (full mock run, render-check off), `contract-drift.test.ts` (pipeline‑valid ⇒ renderer‑valid guardrail). 100 pass / 7 skip offline; 107 pass with the renderer.

---

## 4. Reference documents to read

- **`TECH_DEBT.md`** (repo root) — pre-investigated engine issues, several of which directly cause video-quality problems (see §7).
- `BUILD_STATUS.md` — renderer roadmap; note the `@remotion/layout-utils` text-fitting item and the `charByChar` line-spacing known issue.
- `docs/reference-llm-guide.md` — the scene-JSON authoring contract (kept in sync via PR #62).
- `KnoMotion-Videos/src/sdk/capability-manifest.json` — machine-readable engine capabilities (reconciled with the code in PR #62; includes `knownIssues`).
- `KnoMotion-Videos/src/compositions/SceneRenderer.jsx` — how scene JSON is actually rendered (slot resolution, mid-scene dispatch).

---

## 5. How to work / conventions (learned the hard way)

- **Branch hygiene:** make edits **on the branch you intend to commit to** (uncommitted changes follow `git checkout` and cause cross-branch bleed). Verify with `git rev-parse --abbrev-ref HEAD` before editing.
- **Zod `z.input` vs `z.output`:** `.default()`/`.preprocess()` make input/output types diverge. The `Stage<In,Out>` generics use `z.infer` (output) consistently — keep it that way. Literal unions in object returns can widen to `string`; pin with `as const` or an explicit type.
- **Node ESM caveats:** run TS via `tsx`/`vitest` (extensionless imports are fine there). `npm run run -- …` passes flags through.
- **Terminal gotchas users hit:** curly/"smart" quotes break arg parsing (use straight quotes or `--source`); a fresh machine needs a **root `npm install`** for Remotion/renderer deps (see `TECH_DEBT.md` TD‑008).
- **Model ids** live only in `pipeline/config/models.ts`.

---

## 6. Branch & PR map

Stacked pipeline PRs (merge in order): **#61 → #64 → #65 → #67**, plus independent **#62** and **#63**.

| PR | Branch | Contents |
|----|--------|----------|
| #61 | `cursor/knomotion-pipeline-schemas-8c94` | Contracts / all Zod schemas (+ 11-key restriction) |
| #62 | `cursor/midscene-schema-reconciliation-8c94` | Engine: reconciled mid-scene JSON schemas + capability manifest + LLM guide |
| #63 | `cursor/tech-debt-register-8c94` | `TECH_DEBT.md` |
| #64 | `cursor/pipeline-p0-infra-8c94` | P0: orchestrator, stage interface, artifact store, LLM client, CLI (base #61) |
| #65 | `cursor/pipeline-validation-engine-8c94` | P1+P2: ajv capability bridge, Stage-6 rule engine, tests (base #64) |
| #67 | `cursor/pipeline-p3-prompts-8c94` | P3: real prompts, model routing, LLM-drift hardening (base #65) |
| #66 | `cursor/pipeline-integration-8c94` | **RUN-ONLY, DO NOT MERGE** — everything above (incl. #62) merged for running/UAT |

`cursor/pipeline-integration-8c94` is the single **"run from here"** branch. Keep it updated (merge new work into it) as the convenience run target; do the real review/merge via the stacked PRs.

---

## 7. ⭐ Output video quality — THE priority for the next agent

**Problem statement (from the user):** generated videos are low quality — *text not showing correctly, mid-scenes not rendering, etc.* — even when the pipeline reports `passed`. This has **not** been directly addressed yet and is the most important next area.

### 7.1 Why "passed validation" ≠ "good video"

Validation today is **static and structural**: it proves the JSON matches the schema + business rules. It does **not** prove the scene looks right when rendered. Nothing in the pipeline currently *renders* a frame and inspects it. So a config can be perfectly "valid" and still:

- show text that never appears, appears for 3 frames, or overflows the slot;
- have empty regions where a mid-scene silently rendered nothing;
- use a mid-scene whose config is schema-valid but visually broken.

Closing this "validation ↔ appearance" gap is the core of the quality work.

### 7.2 Concrete, known failure modes (root causes)

> **Status after the M1 acceptance run (2026-09-15, OpenAI + ElevenLabs, MP4 rendered):** items 1 and 7 are resolved by deterministic timing (PR #75) — the owner judged narration alignment and beats good. Items 2, 3, 5 and 6 were **confirmed on the real run**: some scenes rendered no visuals, and the visual vocabulary was thin enough to restrict the storytelling. Those are the M2/M3 targets. A new observation — planning/script output is loose and not very detailed — is tracked as Sept M4 item 6.
>
> **Status after Sept M2 (2026-09-16):** items 2, 3, 4 and 5 are resolved in code (see each item); item 6's *rendering* half (bad `heroRef` → nothing on screen) is now caught by Stage 9, its *vocabulary* half stays with M3/M5. Item 8 stays with M4.

1. ~~**Beat/timing mistakes that pass validation.**~~ **Resolved (M1, PR #75).** Timing is no longer authored by the LLM: `core/timing.ts` derives `durationInFrames` and every beat from the narration audio and overwrites whatever the model wrote (repairs included). The `beat_timing` rule still exists as a backstop; M2 tightened it for hand-authored configs (range, `start < exit`, ≥1.2s visible, per-line beats, `beats.exit` required, no blank tail).
2. ~~**Coercion that masks semantic breakage.**~~ **Resolved (M2).** A fold that changes the layout family (`sideBySide`→`full`, unknown→`full`) now records `layout._coercedFrom`; `slot_layout_reconcile` errors on every slot the fold orphaned and names the fold in the message so repair moves content into `full`. Purely syntactic coercions are unchanged. Had this slipped through anyway, Stage 9 would report the empty scene as `blank_slot`.
3. ~~**Slot/layout mismatch & unfilled slots.**~~ **Resolved (M2).** `slot_layout_reconcile` (missing `rows`/`columns`, slot names the layout does not produce) and `slots_filled` are errors that feed repair; Stage 9 catches the rendered symptom too.
4. ~~**Text overflow / no text-fitting.**~~ **Resolved (M2).** Two layers: `text_budget` errors before render on strings/counts that cannot fit the slot's geometry (the same budget is stated in the Stage 7 prompt), and the renderer shrinks-to-fit via `@remotion/layout-utils` in `textReveal`, `checklist` and `bigNumber` (`sdk/utils/fitFontSize.js`). What still overflows (e.g. ten checklist items in a half-height column) is caught by `edge_bleed`. The `charByChar` line-spacing bug is unchanged (`BUILD_STATUS`).
5. ~~**Engine bugs that make content invisible**~~ **Resolved (M2, engine commit).** TD‑002 mask `up`/`down` mapped to inset `top`/`bottom`; TD‑001 `heroText` uses the top-left slot contract and centres within it; TD‑003 theme colour keys resolve in `bigNumber`/`animatedCounter`; TD‑004a renderer `MidSceneKeys` is canonical-only; TD‑006 dead code removed; and a newly found TD‑009 — items in `checklist`/`bubbleCallout`/`cardSequence`/`gridCards`/`textReveal`/`iconGrid` vanished ~0.8s after entering because `resolveBeats` did not inherit the container's `exit` — fixed in `sdk/utils/beats.ts` and every mid-scene's item call. Details in `TECH_DEBT.md`.
6. **Thin, low-variety configs.** The compiler leans on `textReveal`/`checklist` with minimal styling; even when correct, videos feel flat. Mid-scenes like `heroText`, `gridCards`, `bigNumber` are under-used or mis-configured (e.g. `heroText` with a `heroRef` that isn't a real lottie key → nothing renders). *Owner feedback 2026-09-15: "visual vocabulary not polished enough (mid-scenes, elements) and restricted the storytelling aspects of the video."* → Sept M3 (manifest `useWhen`/`avoidWhen` + example fixtures) and M5 (new mid-scenes, variety rule).
7. ~~**Duration vs content.**~~ **Resolved (M1, PR #75).** Scene length is now lead-in + measured narration + tail, so content can no longer be cut off by a too-short `durationInFrames`.
8. **Shallow planning/script content.** *Owner feedback 2026-09-15:* the generated narrative was loose and not very detailed (the `worldcup.md` source is itself brief, so source thinness and prompt shallowness are confounded). Stage 7 cannot fix this — it is the depth of Stages 1–4. → Sept M4 item 6: a detailed second reference doc, then a prompt depth pass on content-analysis → script.

### 7.3 Recommended plan to raise quality (in priority order)

> Items 1–5 shipped in Sept M2 (2026-09-16); kept here as the record of what was done and why. Items 6–8 are the M3+ agenda.

1. ~~**Add a render-in-the-loop QA stage (highest leverage).**~~ **Done — Stage 9 render-check.** Deterministic pixel checks only (blank slot, edge bleed) against a background baseline; findings are repairable issues *and* populate `09-quality-report.json`. The optional LLM vision pass was **not** built: the two pixel checks caught every fixture in the acceptance set, and a vision pass would reintroduce non-determinism into a gate. Revisit only if a real run shows a class of visual failure the pixel checks cannot express.
2. ~~**Add timing-quality validation rules**~~ **Done** (`beat_timing`, all errors; reading-time is a warning).
3. ~~**Make coercions semantics-safe.**~~ **Done** (`_coercedFrom` + `slot_layout_reconcile`; option (b) — error for repair — chosen over silently moving content, so the fix is the model's and is visible in `07-repair-*.json`).
4. ~~**Fix the engine bugs in `TECH_DEBT.md`**~~ **Done** (TD‑001/002/003/004a/006 + TD‑009 found during M2).
5. ~~**Text fitting**~~ **Done** (`text_budget` before render, `fitText` in the renderer).
6. **Richer, correct mid-scene use via few-shot prompting.** Give the scene-JSON compiler 2–3 *full, correct* worked examples per common mid-scene (not just one textReveal), and validate mid-scene-specific requirements (e.g. `heroText.heroRef` must be a real lottie key or URL — already a warning; make heroType/heroRef consistency an error).
7. **Stronger LLM adherence via OpenAI structured outputs** (`response_format: json_schema`) so the model *cannot* emit invalid enums/shapes. Feasible now for the four **planning** stages (simple schemas). Scene-JSON uses **dynamic slot keys** (`full`/`row1`/`col1`…) which strict mode doesn't support as-is — either keep coercion for that stage, or refactor `slots` to a fixed-shape array `[{name, midScene, config}]` and transform back to the renderer's record. This reduces the whole "model improvises" class that currently degrades quality.
8. **Acceptance gate = renders + spot check.** Treat "MVP done" as: config validates **and** a rendered still/clip is visually correct. Build **P4 (one-click Studio preview)** so this is a button, not a manual `--props` dance (see §8).

> Guiding principle: shift quality checks from *"is it valid JSON?"* to *"does it render as a legible, complete scene?"* — via rendering + timing rules + semantics-safe coercion + fixing the engine's invisible-content bugs.

---

## 8. What is NOT built yet (next targets)

- ~~**P4 — Studio preview harness**~~ **BUILT**: `npm run run -- preview <jobId>` (from `knomotion-pipeline/`; jobId optional → latest job, `--video <id>` to pick a video) stages the job's config to `public/pipeline-preview/config.json`; the `PipelinePreview` composition (`KnoMotion-Videos/src/remotion/PipelinePreview.tsx`, registered in `Root.tsx`) fetches it at metadata time and renders via `GenericVideoPlayer`. Shows an instructional placeholder when nothing is staged.
- **Render (12), captions** — stubs throwing `NotImplementedError`; contract exists (`CaptionsManifest`). Render should reuse `core/render/still-renderer.ts` (`bundleOnce` + shared `webpackOverride`) and add `renderMedia()`. TTS, timing and assembly landed in Sept M1; render-check in Sept M2; the old `beat-alignment` stub was removed (timing owns beats).
- **Full resume** (`--resume <jobId> --from <stage>`) — the artifact store already supports validated reads; only `--stop-after` is wired (`render-check <jobId>` is a single-stage resume in all but name).
- **QualityReport** — `renderCheck` + `scores.blankSlotRate/edgeBleedRate` are populated; creator-portal edit capture (`humanEdits`), fine-tuning dataset and personalised scene variants remain scaffolded contracts.
- **Mobile render-check fixtures** — every check reads its geometry from the layout engine (`safeBandFor('mobile')` = 40px, mobile slot carving), but only desktop fixtures exist (Sept D4).
- **OpenAI structured outputs** — see §7.3 #7.

---

## 9. How to validate your changes (UAT recap)

- `npm test` (offline) — must stay green (100 pass / 7 skip). Add a fixture/test for every new rule or coercion; `KNOMOTION_RENDER_TESTS=1 npm test` also renders the M2 acceptance fixtures (all 107 must pass).
- `npm run run -- --source worldcup` (mock) — full chain, all `passed`, `render-check=passed` in the result block.
- `npm run run -- --source worldcup --provider openai` — real content; watch the `WARN … { issues: [...] }` lines (exact failing JSON paths) to spot new LLM drift, and `render-check found problems` for scenes that were valid but rendered blank/bled.
- `npm run run -- render-check <jobId>` — per-scene table of slot coverage and edge bleed; then **open the stills** in `videos/<video>/render-check/` (this is where quality regressions show up). `preview <jobId> --debug-safe-zones` overlays the slot rects the numbers refer to.
- Engine changes: rerun `render-check` on a job rendered *before* the change and compare `09-quality-report.json` coverage numbers — a mid-scene that stops rendering shows up as a coverage drop even before it crosses the blank threshold.

---

## 10. Suggested order for the next agent

1. ~~**P4 preview**~~ **DONE** — see §8 (`preview <jobId>` CLI + `PipelinePreview` composition).
2. ~~**Quality pass** per §7.3~~ **DONE (Sept M2)** — render-check → timing rules → semantics-safe coercions → TD fixes → text fitting.
3. **Sept M3 — one knowledge source**: generate the manifest from the JSON schemas, `useWhen`/`avoidWhen` per mid-scene, worked-example fixtures that must pass validation *and* render-check (`Sept_DevPlan.md` M3).
4. **Sept M4 — close the loop**: PDF intake, Stage 12 render (reuse `still-renderer.ts`), `--resume`, two reference videos; then M5 vocabulary.
5. **Structured outputs** for planning stages (adherence) when M3's schemas are the source of truth.

Keep the run branch `cursor/pipeline-integration-8c94` updated so the user always has a single command to try your work.
