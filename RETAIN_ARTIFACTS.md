# Retain Artifacts — living keep/remove register

> Started 2026-09-10 alongside `Sept_DevPlan.md`. **Every PR that touches a directory adds or updates rows here** for the files it confirmed live, dead, or shimmed. Nothing is deleted until its row says `REMOVE`, the evidence column is filled, and any replacement is on `main`.
> This replaces the analysis-only `deletion-plan.md` (May) and July_DevPlan §8 as the single place the keep/remove decision is recorded.

## Status legend

| Status | Meaning |
|---|---|
| `KEEP` | Live and needed. Evidence: imported/executed by a live path, or a plan milestone depends on it. |
| `REMOVE` | Confirmed dead, replacement (if any) on `main`. Safe to delete in the next PR that touches the area. |
| `VERIFY` | Believed dead or duplicate; needs the stated one-line check before flipping to `REMOVE`. |
| `DECIDE` | Not a technical question — needs a product decision (recorded in `Sept_DevPlan.md` §5). |

## How to add a row

Path (or glob) · Status · Evidence (what you checked, one line) · Date · PR. Keep rows short. Flip a status rather than adding a duplicate row. When a `REMOVE` is executed, leave the row and add the PR that deleted it so history is traceable without `git log`.

---

## 1. Root

| Path | Status | Evidence | Date | PR |
|---|---|---|---|---|
| `README.md` | KEEP | Entry point; mid-scene table stale (6 of 11), no pipeline section — fix in M0. | 2026-09-10 | — |
| `Sept_DevPlan.md` | KEEP | Current plan. | 2026-09-10 | — |
| `RETAIN_ARTIFACTS.md` | KEEP | This file. | 2026-09-10 | — |
| `pipeline_build.md` | KEEP | Single pipeline handoff doc; §1 branch instructions stale — fix in M0. | 2026-09-10 | — |
| `TECH_DEBT.md` | KEEP | TD-001…TD-008 all still open; M2 consumes it. Delete items as they resolve. | 2026-09-10 | — |
| `July_DevPlan.md` | KEEP (historical) | Superseded by `Sept_DevPlan.md`; keep for the §3 root-cause analysis it contains. Add an "ARCHIVED" header in M0. Move to `Archive/docs/` during the archiving activity (D6). | 2026-09-10 | — |
| `BUILD_STATUS.md` | VERIFY | Renderer roadmap through Chunk 7 (May). Useful for the architecture-decisions section only; the "10/10 engine alignment" claim is contradicted by TD-001…004. Check: does anything other than the kickstart prompt reference it? Likely fold decisions into `docs/ARCHITECTURE.md` and archive. | 2026-09-10 | — |
| `deletion-plan.md` | REMOVE (after M0) | Analysis-only; every item is carried into this file below. | 2026-09-10 | — |
| `SDK.md` (2183 lines) | VERIFY | Developer SDK reference; counts wrong (10 mid-scenes, 23 elements); documents the `positionToCSS` ambiguity rather than fixing it. Check what `docs/ARCHITECTURE.md` already covers; likely trim to what is not duplicated. | 2026-09-10 | — |
| `TEMPLATES.md` (1606 lines) | VERIFY | "Template Guide" for the v5 template system; templates exist only in `Archive/`. Check: any live reference to a template name it documents? Expect `REMOVE`. | 2026-09-10 | — |
| `SHOWCASE.md`, `showCasePlan.md` | REMOVE | Describe `ShowcaseMain.jsx`/`ShowcaseScene*` which exist only under `Archive/` (July §2 verified). | 2026-09-10 | — |
| `auditPlan.md` | REMOVE | Superseded planning doc (May); no live references. | 2026-09-10 | — |
| `daisyExamples.txt` (62 KB) | REMOVE | daisyUI LLM dump; zero references (July §8). | 2026-09-10 | — |
| `verify-setup.sh`, `fix-remotion-deps.sh` | REMOVE | Reference `src/templates/WhiteboardTED.jsx` (does not exist) and Remotion 4.0.373 (repo pins 4.0.382). | 2026-09-10 | — |
| `audit/` (2 files, dated 2025-01) | REMOVE | Layout-engine audit results from the v5 era; layout engine has since been rewritten around `resolveSceneSlots`. | 2026-09-10 | — |
| `dist/` (7 tracked files) | REMOVE | Vite build output; already in `.gitignore`. `git rm --cached dist/`. | 2026-09-10 | — |
| `.gitignore` lines `package.json`, `package-lock.json`, `node_modules/.vite/...` | REMOVE (lines) | Nonsensical for a Node repo; currently inert because the files are tracked, but a trap for any future re-add. | 2026-09-10 | — |
| `public/` (blush video, 4 lotties) | KEEP | Static assets served to the renderer. Two gitignored runtime sub-dirs: `public/pipeline-preview/` (PR #72, staged config) and `public/pipeline-audio/<job>/<video>/` (PR #75, narration clips copied by assembly). | 2026-09-10 | #72, #75 |
| `scripts/download-animated-emojis.sh`, `scripts/install-render-deps.sh` | VERIFY | Not referenced by `.devcontainer/setup.sh` or any doc (grep 2026-09-10). Read each; `install-render-deps.sh` may be worth folding into TD-008's env setup, otherwise `REMOVE`. | 2026-09-10 | — |
| `.devcontainer/` | KEEP | Codespaces setup; installs Chrome headless deps needed for render-check (M2) and render (M4). M1 needs an `ELEVENLABS_API_KEY` secret (D1) — document in `pipeline_build.md`, not here. | 2026-09-10 | — |
| `index.html`, `vite.config.js`, `tailwind.config.js`, `postcss.config.cjs`, `remotion.config.ts`, `tsconfig.json` | KEEP | Root build config for the admin app and Remotion. | 2026-09-10 | — |

## 2. Root `package.json` dependencies

| Package | Status | Evidence | Date | PR |
|---|---|---|---|---|
| `@monaco-editor/react`, `react-syntax-highlighter`, `@types/react-syntax-highlighter`, `rough-notation` | REMOVE | Zero imports in any live tree (July §8, re-grepped 2026-09-10). | 2026-09-10 | — |
| `culori` | VERIFY | Zero direct imports, but `BUILD_STATUS.md` lists it as a remotion-bits peer dependency. Check `node_modules/remotion-bits/package.json` peerDependencies after `npm install`; remove only if absent. | 2026-09-10 | — |
| `@remotion/animated-emoji` | VERIFY | `AnimatedEmojiLottie.jsx` uses the Google Noto CDN directly per `BUILD_STATUS.md`; check for an import before removing. | 2026-09-10 | — |
| `@remotion/fonts`, `@remotion/tailwind` | VERIFY | Grep for imports; `@remotion/tailwind` may be referenced only in `remotion.config.ts`. | 2026-09-10 | — |
| `@dnd-kit/sortable` | REMOVE | Zero imports (July §8). | 2026-09-10 | — |
| `framer-motion`, `@xyflow/react`, `@tanstack/react-table`, `@dnd-kit/core`, `lottie-react` | REMOVE (with KnoSlides exit) | Used only by `KnoSlides/` (deletion-plan §9). KnoSlides is backlogged and leaving the repo (Sept plan D2). Grep each for a video-side importer in the removal PR before deleting. | 2026-09-10 | — |
| `remotion`, `@remotion/{transitions,captions,lottie,google-fonts,player,bundler,cli,renderer}` @ 4.0.382, `remotion-bits`, `zod`, `roughjs`, `daisyui`, `tailwindcss` | KEEP | Live renderer/admin dependencies. `@remotion/renderer` becomes load-bearing for M2 render-check and M4 render. | 2026-09-10 | — |
| `@remotion/layout-utils@4.0.382` | KEEP (to add) | Required by M2 text fitting. Not yet installed. | 2026-09-10 | — |

## 3. Renderer — `KnoMotion-Videos/src/`

| Path | Status | Evidence | Date | PR |
|---|---|---|---|---|
| `remotion/Root.tsx`, `remotion/index.ts` | KEEP | Composition registry. `COMPOSITION_ID_MAP` references `CanonShowerVideo` which is not registered — fix in M0 docs pass or M2 engine PR. | 2026-09-10 | — |
| `compositions/GenericVideoPlayer.jsx`, `compositions/SceneRenderer.jsx` | KEEP | The renderer. Only path pipeline output uses. | 2026-09-10 | — |
| `compositions/Knodovia*.jsx` (6), `compositions/TikTok_*.jsx` (3) | KEEP (until M4 accepted) → convert to JSON | Hand-built canon videos, registered in `Root.tsx`, referenced by README. Decision D3: leave untouched until a pipeline-created video is judged satisfactory, then convert to JSON fixtures under `GenericVideoPlayer` and remove the `.jsx` files. | 2026-09-10 | — |
| `compositions/CanonShowerVideo.jsx` | KEEP (for now) | Imported by `admin/ShowcasePreview.jsx`; unregistered in `Root.tsx`. Candidate source for a reference video. | 2026-09-10 | — |
| `sdk/mid-scenes/*.jsx` (11) + `sdk/mid-scenes/schemas/*.json` (11) + `sdk/mid-scenes/index.js` | KEEP | The visual vocabulary; schemas are loaded by the pipeline at runtime. | 2026-09-10 | — |
| `sdk/mid-scenes/README.md` | KEEP | Contains the "future mid-scene ideas" list used to choose M5 additions. | 2026-09-10 | — |
| `sdk/capability-manifest.json` | KEEP (becomes generated in M3) | Read by pipeline `renderer-capabilities.ts`. Hand-maintained today (TD-005). | 2026-09-10 | — |
| `sdk/schemas/videoConfig.schema.ts` | KEEP | Renderer Zod schema registered on `KnoMotionVideo`; `MidSceneKeys` to be tightened to 11 keys in M2. | 2026-09-10 | — |
| `sdk/schemas/videoConfig.test.ts` | VERIFY | Manual `npx tsx` script, not in any runner. Either wire into a test runner or delete once pipeline `contract-drift.test.ts` covers it. | 2026-09-10 | — |
| `sdk/scene-layout/`, `sdk/layout/layoutEngine.js`, `sdk/layout/viewportPresets.js`, `sdk/layout/positionSystem.js` | KEEP | `resolveSceneSlots` + `getViewportPadding` (60/40px) are the geometry source for M2 text budget and safe-band checks. | 2026-09-10 | — |
| `sdk/layout/mobileRenderingGuide.js` (634 lines) | VERIFY | Only importer is the `sdk/index.js` barrel (grep 2026-09-10). Likely documentation-as-code; `REMOVE` with the barrel prune unless a live path uses it. | 2026-09-10 | — |
| `sdk/layout/layout-resolver.js` | VERIFY | July §8: only importer is the dead legacy validator. Confirm with grep, then `REMOVE` with the validators below. | 2026-09-10 | — |
| `sdk/validation/collision-detection.js` | KEEP | Imported by `layoutEngine.js` and used by `bubbleCallout` collision avoidance. | 2026-09-10 | — |
| `sdk/validation/scene.schema.ts`, `scene-validator.js`, `sceneCompatibility.js` | REMOVE | v5 validation layer; only reachable via the `sdk/index.js` barrel, which nothing in `KnoMotion-Videos/src` imports (grep 2026-09-10). Replaced by `videoConfig.schema.ts` + pipeline validation. | 2026-09-10 | — |
| `sdk/index.js` (barrel) | VERIFY | No importer found inside `KnoMotion-Videos/src`. Check `KnoSlides/` and admin before pruning legacy exports or deleting. | 2026-09-10 | — |
| `sdk/animations/index.js`, `sdk/animations/microDelights.jsx` | KEEP | Canonical animation module (TD-002 fix lands here) and separately exported delights. | 2026-09-10 | — |
| `sdk/animations/{advancedEffects.jsx, continuousLife.js, sceneTransformation.jsx, broadcastAnimations.ts}` | VERIFY | Believed merged into `animations/index.js` (deletion-plan §2). One-line check: diff exported names against `index.js`; delete any file whose exports are all present. | 2026-09-10 | — |
| `sdk/animations/animations.js` | VERIFY | Imported by `sdk/components/components.jsx` for `fadeSlide`, `pulse`. Redirect that import to `animations/index.js`, then `REMOVE`. | 2026-09-10 | — |
| Shims (2-line `export *`): `sdk/fontSystem.ts`, `sdk/lottiePresets.js`, `sdk/lottieIntegration.tsx`, `sdk/SceneIdContext.jsx`, `sdk/StyleTokensProvider.tsx`, `sdk/broadcastEffects.tsx`, `sdk/microDelights.jsx` | VERIFY | All confirmed to be backward-compat shims (read 2026-09-10). Grep each shim path for importers; redirect and `REMOVE`. | 2026-09-10 | — |
| `sdk/transitions.ts` (8-line shim) + `sdk/core/transitions.ts` | KEEP | Merges both transition layers; `core/transitions.ts` defines `TransitionSeriesBridge` still in use (deletion-plan §11). Re-verify when M1 touches `sdk/transitions/index.ts`. | 2026-09-10 | — |
| `sdk/transitions/index.ts` | KEEP | Live `@remotion/transitions` layer; per-scene transition duration fixed in `calculateTransitionSeriesDuration` (PR #75, covered by `renderer-timing.test.ts`). | 2026-09-10 | #75 |
| `sdk/utils/ttsToBeatAlignment.ts` | REMOVE | Replaced: PR #75 puts word-timing → beats in `knomotion-pipeline/pipeline/core/timing.ts` (pipeline side, where the audio lives). Still zero importers in the renderer. Delete in the next renderer PR after #75 merges. | 2026-09-10 | #75 |
| `sdk/utils/beats.ts` | KEEP | `resolveBeats` defaults (0.5s start, 1.6s hold) used by every mid-scene. | 2026-09-10 | — |
| `sdk/audio/*` (AudioLayer, CaptionOverlay, SafeAudio, audioSchema, testFixtures) | KEEP | Assembly (PR #75) feeds `AudioLayer` with public-relative `src`; `SafeAudio` resolves it via `staticFile()`, `audioSchema.ts` accepts URL-or-relative-path. Captions (M5) feed `CaptionOverlay`. | 2026-09-10 | #75 |
| `sdk/elements/*` (16 atoms, 11 compositions, `index.js`) | KEEP | Powers the mid-scenes. `ELEMENT_RULES.md`, `PROP_SCHEMA.md`, `MIGRATION_GUIDE.md`, `README.md` inside — VERIFY whether the migration guide is still relevant. | 2026-09-10 | — |
| `sdk/components/mid-level/FlowDiagram.jsx` | KEEP | Basis for the M5 `processFlow` mid-scene. | 2026-09-10 | — |
| `sdk/components/heroRegistry.jsx` | KEEP | Imported by `mid-scenes/HeroTextEntranceExit.jsx` (grep 2026-09-10). | 2026-09-10 | — |
| `sdk/components/mid-level/AppMosaic.jsx`, `sdk/components/questionRenderer.js`, `sdk/components/components.jsx` | VERIFY | Grep for live importers outside the `sdk/index.js` barrel. | 2026-09-10 | — |
| `sdk/theme/*`, `sdk/effects/*`, `sdk/lottie/*`, `sdk/fonts/*`, `sdk/core/*`, `sdk/decorations/doodleEffects.jsx` | KEEP | Theme, backgrounds, lottie registry (41 keys read by the pipeline), fonts, easing/motion. Individual files inside `effects/` (`connectingLines`, `flowLines`, `handwritingEffects`) — VERIFY importers when M2 touches the area. | 2026-09-10 | — |
| `sdk/utils/{presets.jsx, rough-utils.js, useWriteOn.ts}` | VERIFY | Grep for importers. | 2026-09-10 | — |
| `sdk/test-fixtures/remotion-bits-test.json` | KEEP | Studio test fixture for the remotion-bits reveal types. | 2026-09-10 | — |
| `admin/App.jsx` routes: `ShowcasePreview`, `builder/*` (SceneBuilder) | KEEP | Wired in `App.jsx`; video-side preview and builder. | 2026-09-10 | — |
| `admin/SlidesPreview.jsx`, `admin/slides-builder/SlideBuilder.jsx`, the `dev:slides-preview` / `dev:slide-builder` / `dev:knoslides-standalone` / `build:knoslides` npm scripts | REMOVE (with KnoSlides exit) | KnoSlides-only views and scripts (D2). Remove in the same PR as `KnoSlides/`. | 2026-09-10 | — |
| `admin/ElementShowcase.jsx`, `admin/UnifiedAdminConfig.jsx`, `admin/README.md` | REMOVE | Not imported by `App.jsx`; only referenced by `admin/README.md`, which documents them. Grep 2026-09-10. | 2026-09-10 | — |
| `components/DebugOverlay.jsx` | VERIFY | Only importer is the `sdk/index.js` barrel (grep 2026-09-10). Either becomes the base for the M2 `debugSafeZones` overlay or is removed with the barrel prune. | 2026-09-10 | — |
| `main.jsx`, `App.jsx`, `global.css`, `tailwind.css` | KEEP | Admin app entry. | 2026-09-10 | — |

## 4. Renderer docs — `KnoMotion-Videos/docs/` and `docs/`

| Path | Status | Evidence | Date | PR |
|---|---|---|---|---|
| `docs/ARCHITECTURE.md` | KEEP | Engine architecture; counts inconsistent (10 vs 11 mid-scenes, 40 vs 41 lottie keys) — fix in M0/M3. | 2026-09-10 | — |
| `docs/reference-llm-guide.md` (1190 lines) | KEEP (conditional, D5) | Not read by the pipeline. Stays only with one stated purpose: the authoring guide for humans/agents working on the repo, generated from the manifest + example fixtures in M3. Retire in M3 if no reader remains that the generated sources don't already serve. | 2026-09-10 | — |
| `docs/instructions-llm-guide.md` | REMOVE (after M3) | Not read by the pipeline; its content is superseded by `prompts/scene-json-generation.ts`. | 2026-09-10 | — |
| `KnoMotion-Videos/docs/BLUEPRINT_V5.md`, `template-content-blueprints/*` (10 files) | REMOVE | Document v5 templates that exist only in `Archive/` (July §8). | 2026-09-10 | — |
| `KnoMotion-Videos/docs/agnosticTemplatePrincipals.md`, `API_REFERENCE.md`, `GETTING_STARTED.md`, `SCENE_LAYOUT_TEST_SCENARIOS.md`, `COLLISION_DETECTION.md` | VERIFY | Read each header; expect template-era docs → `REMOVE`, except `COLLISION_DETECTION.md` if it documents the live `collision-detection.js`. | 2026-09-10 | — |
| `KnoMotion-Videos/docs/videoGaps.md` | KEEP (until M5) | Catalogue of visual gaps from the canon stress test; input to choosing M5 mid-scenes. Archive after. | 2026-09-10 | — |

## 5. Pipeline — `knomotion-pipeline/`

| Path | Status | Evidence | Date | PR |
|---|---|---|---|---|
| `pipeline/orchestrator.ts`, `cli.ts`, `core/*`, `schemas/*`, `prompts/*`, `stages/*` (implemented 0–7) | KEEP | The pipeline. Write-back fix and `preview` command landed with PR #72. | 2026-09-10 | #72 |
| `core/timing.ts`, `core/fps.ts`, `core/tts/{index,provider,elevenlabs,mock}.ts`, `stages/tts/generateTTS.ts`, `stages/timing/computeTiming.ts`, `stages/assembly/buildRenderProps.ts`, `schemas/SceneTiming.ts` | KEEP | M1 (PR #75): TTS → timing → assembly. Timing is the single owner of `durationInFrames`/`beats` for pipeline output. | 2026-09-10 | #75 |
| `stages/beat-alignment/alignBeats.ts` | REMOVED | Absorbed into `core/timing.ts`; stub deleted and `'beat-alignment'` dropped from `PipelineStageSchema`. | 2026-09-10 | #75 |
| `stages/{captions,render}` stubs + `stages/_stub.ts` | KEEP | Replaced by real implementations in M4 (render) / M5 (captions). `render-check` (M2) has an enum slot but no file yet. | 2026-09-10 | #75 |
| `pipeline/cache/` (gitignored) | KEEP | TTS response cache keyed by provider\|voice\|model\|text; safe to wipe any time (only costs a re-bill). | 2026-09-10 | #75 |
| `schemas/QualityReport.ts` | KEEP | Gets its first producer in M2 render-check. | 2026-09-10 | — |
| `schemas/CaptionsManifest.ts`, `schemas/RenderManifest.ts` | KEEP | `RenderManifest` now produced by assembly (PR #75); `CaptionsManifest` waits for M5. | 2026-09-10 | #75 |
| `__tests__/*` (9 files after PR #75) | KEEP | Must stay green. `contract-drift.test.ts` and `renderer-timing.test.ts` import renderer modules by absolute path; they skip (not fail) if root deps are absent. | 2026-09-10 | #75 |
| `pipeline/sources/worldcup.md`, `sources/README.md` | KEEP | Reference source R4; second reference doc added in M4. | 2026-09-10 | — |
| `pipeline/artifacts/.gitkeep` | KEEP | Runtime output dir (gitignored). | 2026-09-10 | — |

## 6. `KnoSlides/`

| Path | Status | Evidence | Date | PR |
|---|---|---|---|---|
| `KnoSlides/**` | REMOVE (after owner snapshots locally) | Backlogged product (D2). It lived here on the assumption that slides and videos would share components; they don't. Owner keeps a local copy; then one PR removes `KnoSlides/`, the slides admin views, the slides npm scripts and the KnoSlides-only root deps. Not blocking pipeline work; any time after M0. | 2026-09-10 | — |

## 7. `Archive/` (201 tracked files)

| Path | Status | Evidence | Date | PR |
|---|---|---|---|---|
| `Archive/**` | KEEP (until archiving activity, D6) | Zero imports from any live tree (grep 2026-09-10). Stays as-is until a dedicated archiving activity after this plan's milestones; do not remove opportunistically. Root docs that point into it (`SHOWCASE.md` etc.) are still `REMOVE` above. | 2026-09-10 | — |

## 8. Remote branches

| Branch | Status | Evidence | Date | PR |
|---|---|---|---|---|
| `origin/cursor/pipeline-integration-8c94` and all other `origin/cursor/*-8c94` | REMOVE | Two-dot diff against `main` differs only in `knomotion-pipeline/package-lock.json`; no files exist on the branch that are absent from `main`. | 2026-09-10 | — |
| `origin/cursor/phase0-preview-repair-8e6a` (PR #72) | KEEP → merge | Implements July A1 + A2; M0 item 1. | 2026-09-10 | — |
| `origin/cursor/session-roadmap-todo-7cfc` (PR #70) | DECIDE | Third roadmap (`NEXT_SESSIONS.md`); recommend close in favour of `Sept_DevPlan.md`. | 2026-09-10 | — |
| `origin/cursor/july-devplan-8e6a`, `origin/cursor/pipeline-consolidated-8c94` | REMOVE | Merged (PRs #71, #69). | 2026-09-10 | — |
| `origin/Builder_And_Polish` and the remaining ~20 `origin/cursor/*` branches from Feb–Jun | VERIFY | One `git log main..origin/<branch> --oneline` each; delete any with zero unique commits or whose PR is closed/merged. | 2026-09-10 | — |

---

*Add rows above in the matching section. When a section is fully resolved, leave it — the history is the point.*
