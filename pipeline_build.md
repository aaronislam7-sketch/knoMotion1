# KnoMotion Pipeline — Build Progress & Handoff

> Handoff for the next agent continuing the KnoMotion content pipeline.
> Read this top-to-bottom, then `TECH_DEBT.md` (engine issues) before coding.
> Last updated: 2026‑07‑20.

---

## 0. TL;DR

- We built a **standalone `knomotion-pipeline/` package** that compiles source text → validated, renderable KnoMotion scene JSON. It runs as a **CLI** today (no UI yet).
- It is a **structured compiler**, not a chatbot: one orchestrator, many typed stages, LLM only where judgement is needed, a Zod contract + artifact on disk at every step, and a deterministic validation + surgical-repair safety net.
- **Stages 0–7 are implemented** (intake → content-analysis → module-planning → video-planning → script-generation → scene-json-generation → validation → repair). **Stages 8–12** (TTS, captions, beat-alignment, assembly, render) are **scaffolded stubs**.
- It runs **end-to-end** with a `mock` provider (offline, deterministic) and against **OpenAI** (`--provider openai`).
- **The open problem to prioritise: output video QUALITY.** Configs can pass validation yet render poorly (text not showing, mid-scenes blank). See **§7 — this is the headline ask.**

---

## 1. Where the code lives & how to run

```
knomotion-pipeline/                 ← standalone package (own package.json, tsconfig, tests)
  pipeline/
    orchestrator.ts                 ← runPipeline(): the chain + fan-out + repair loop
    cli.ts                          ← CLI entry (--source/--input/--text/--provider/--stop-after)
    config/models.ts                ← MODEL ROUTING (edit here to change models per stage)
    core/
      stage.ts                      ← Stage<In,Out> contract + runStage
      context.ts                    ← PipelineContext + makeMeta (ArtifactMeta envelope)
      artifact-store.ts             ← validated-on-write/read artifact I/O + job.json manifest
      config.ts, logger.ts, ids.ts, errors.ts
      llm/                          ← client.ts (interface), mock.ts, openai.ts, index.ts (factory)
      capabilities/renderer-capabilities.ts  ← loads renderer manifest + mid-scene JSON schemas (ajv)
    schemas/                        ← Zod contracts for every artifact (the locked source of truth)
    prompts/                        ← one versioned prompt module per LLM stage
    stages/                         ← one handler per stage (+ _stub.ts for out-of-scope stages)
    sources/                        ← drop .md source files here; run with --source <name>
    artifacts/                      ← runtime job output (gitignored)
    __tests__/                      ← vitest suite
```

**The only coupling point to the renderer is `KnoMotionVideoConfig.json`** (Stage 5 output). The pipeline never imports renderer React code; it only *reads* the renderer's capability data files at runtime (`KnoMotion-Videos/src/sdk/capability-manifest.json` + `mid-scenes/schemas/*.json`).

### Run it

```bash
# 1) get everything in one branch (see §6 for the branch map)
git checkout cursor/pipeline-integration-8c94 && git pull
cd knomotion-pipeline && npm install

# 2) offline, deterministic (no API key) — proves the machinery:
npm run run -- --source worldcup

# 3) real LLM run (needs OPENAI_API_KEY in env / Cloud Agents secret):
npm run run -- --source worldcup --provider openai

# tests:
npm test                    # 17 pass, 2 skip (drift guardrail skips until renderer deps installed)

# render proof (needs one-time root `npm install` for Remotion):
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
    → [8 validation]      06-validation-report.json   (deterministic; deep ajv + business rules)
    → [10 repair]         07-repair-<i>-<n>.json      (LLM, only on failure; ≤2 attempts → needs_review; timing re-applied to each patch)
    → [11 assembly]       08-render-manifest.json     (deterministic: narration audio wired into 05-…config.json)
  stubs: [9 render-check] (M2), [12 render] (M4), [captions] (M5)
```

- Every stage implements the same `Stage<In,Out>` interface. The orchestrator validates input, runs, then the artifact store validates + writes the output. Stages never call each other — they only consume/produce artifacts. This is what makes runs **replayable, auditable, and repairable**.
- Artifacts land in `pipeline/artifacts/<jobId>/` with per-video nesting under `videos/<videoId>/`, plus a `job.json` run manifest (per-stage status, timing, model, promptVersion).
- **Timing is deterministic, not authored (Sept M1).** `core/timing.ts` turns the narration audio (measured by TTS, or a ~2.5 wps estimate for the mock provider) into each scene's `durationInFrames` and per-line visibility windows. Stage 7 receives that as a fixed input and its post-process overwrites whatever the LLM wrote for `durationInFrames` / `beats`; repair patches are re-timed the same way. The LLM decides *what* is on screen, never *when*.

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
| 7 | Scene JSON (compiler) | LLM | ✅ timing injected into the prompt and re-applied after the response | `stages/scene-json-generation/…`, `prompts/scene-json-generation.ts` (v2.0) |
| 8 | Validation | deterministic | ✅ deep per-mid-scene (ajv) + business rules | `stages/validation/validate.ts`, `runValidation.ts` |
| 9 | Render-check | deterministic | ⛔ not started (Sept M2) | — |
| 10 | Repair | LLM | ✅ repairs all failing scenes, ≤2 attempts; each patch is re-timed | `stages/repair/runRepair.ts`, `prompts/repair.ts` |
| 11 | Assembly | deterministic | ✅ copies clips to `public/pipeline-audio/<job>/<video>/`, writes `audio.narration` (public-relative `src`, `startFromSeconds` = lead-in) back into `05-…config.json`; `08-render-manifest.json` | `stages/assembly/buildRenderProps.ts` |
| 12 | Render | deterministic | ⛔ stub (Sept M4) | `stages/render/triggerRender.ts` |
| — | Captions | deterministic | ⛔ stub (Sept M5; word timings are already stored in the TTS manifest) | `stages/captions/generateCaptions.ts` |
| — | QualityReport | — | ⛔ scaffold only (contract exists) | `schemas/QualityReport.ts` |

**TTS / audio knobs (M1).** `--tts mock|elevenlabs` (default `mock`). Env: `ELEVENLABS_API_KEY` (required for `elevenlabs`), `ELEVENLABS_VOICE_ID` (default Rachel `21m00Tcm4TlvDq8ikWAM`), `ELEVENLABS_MODEL_ID` (default `eleven_multilingual_v2`), `KNOMOTION_TTS_CACHE_DIR` (default `pipeline/cache/tts`, gitignored), `KNOMOTION_PUBLIC_DIR` (default `<repo>/public`). Renderer side: `sdk/audio/SafeAudio.jsx` resolves public-relative `src` via `staticFile()`; `sdk/audio/audioSchema.ts` and the pipeline mirror accept URLs *or* public-relative paths (no leading `/`, no `..`); `calculateTransitionSeriesDuration` now honours per-scene `transition.durationInFrames`; `core/fps.ts` is the one place the pipeline's `30` lives and `fps.test.ts` asserts it equals the manifest's `constraints.fpsFixed`.

### Supporting infrastructure (all built)

- **Contracts (`schemas/`)** — Zod schema + TS type for every artifact, each wrapped in an `ArtifactMeta` envelope (jobId, stage, producedBy, model, promptVersion, inputs, createdAt). `KnoMotionVideoConfig.ts` is a faithful, standalone **mirror** of the renderer's `VideoConfigSchema` (kept in sync via comments), restricted to the **11 canonical mid-scene keys**.
- **Orchestrator** — module→video fan-out, per-stage timing/manifest, `--stop-after`, and the validate→repair→re-validate loop (repairs every failing scene per attempt; `needs_review` after the cap). When any repair patch is applied, the repaired config is **written back to `05-knomotion-video-config.json`** (and recorded in `job.json`), so `configPath` always points at the final config — including best-effort repairs on `needs_review`.
- **LLM client** — provider-agnostic. `MockLLMClient` (deterministic, input-aware, used offline + in tests). `OpenAIClient` (JSON mode, Zod-parse, corrective retries with exact-path feedback, **null-property pruning**, **temperature fallback** for gpt‑5.x). Factory in `core/llm/index.ts`.
- **Capability bridge** — `renderer-capabilities.ts` loads the renderer manifest + 11 mid-scene JSON schemas at runtime and compiles them with `ajv` (Option A: one-directional data dependency, no drift). Overridable via `KNOMOTION_RENDERER_SDK_DIR`.
- **Validation engine (`validate.ts`)** — rules: `midscene_name`, `midscene_config` (deep ajv), `layout_type`, `transition_type`, `slot_names`, `slots_filled`, `sidebyside_layout`, `duration_bounds`, `beat_timing`, `text_length`, `audio_url`, `lottie_key`. Severity policy: **error** = renders broken → blocks + triggers repair; **warning** = quality/uncertain.
- **LLM-drift coercions (in the schemas)** — self-heal common model mistakes at parse time: `null`→absent, difficulty synonyms/case, key aliases (`problem`→`description`, `misconception`→`statement`, `id`→`sceneId`, …), `background:"x"`→`{preset:"x"}`, `layout:"x"`→`{type:"x"}`, background/layout **vocabulary folding** (`focus`→`spotlight`, `twoColumn`→`columnSplit`, `sideBySide`→`full`), flat-scene → `config` lifting, `durationSeconds`→`durationInFrames`, and dropping non-object junk in `scenes[]`.
- **CLI** — `--source <name>` (from `sources/`), `--input <path>`, `--text "…"`, `--title`, `--format`, `--provider`, `--out`, `--stop-after`, `--log-level`.
- **Tests (vitest)** — `validation.test.ts` (one broken fixture per rule + baseline), `artifact-store.test.ts`, `orchestrator.test.ts` (full mock run), `contract-drift.test.ts` (pipeline‑valid ⇒ renderer‑valid guardrail). 17 pass / 2 skip.

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

1. **Beat/timing mistakes that pass validation.** Beats are in seconds and must fit the scene. The current `beat_timing` rule only checks `start < exit` and rough bounds. The LLM frequently sets beats that are technically legal but visually wrong: everything exiting at ~0.6s, `start` after most of the scene, per-line beats missing so lines collapse, or `exit` ≈ `start` so text flashes. **This is the #1 cause of "text not showing correctly."**
2. **Coercion that masks semantic breakage.** Our parse-time coercions make configs *valid* but can produce *wrong* scenes. The worst offender: `layout: "sideBySide" → "full"` while the model left `slots: { left, right }`. In a `full` layout only `full`/`header` slots resolve, so `left`/`right` **render nothing** → blank scene. Same class: coercing an unknown layout to `full` when the slots were for columns. **This is a real cause of "mid-scenes not working."** Coercions should either (a) reconcile slots when they change layout, or (b) downgrade from silent coercion to a validation error that repair must fix, so the fix is *semantic*, not cosmetic.
3. **Slot/layout mismatch & unfilled slots.** `columnSplit` with `col2` empty, or slot names that don't match the layout → missing content. `slots_filled` exists but should be an error everywhere and feed repair.
4. **Text overflow / no text-fitting.** Long strings overflow slots; the renderer has no auto-fit yet (`BUILD_STATUS` flags `@remotion/layout-utils`). The `charByChar` reveal has a known line-spacing/wrap bug. Long `lines`/`items` look broken even when "valid".
5. **Engine bugs that make content invisible** (already catalogued in `TECH_DEBT.md`):
   - **TD‑002:** `textReveal` `revealType:"mask"` + `direction: up/down` → **empty clip-path → invisible text.** Direct quality hit.
   - **TD‑001:** `heroText` position contract inconsistency → hero mis-placed/hidden.
   - **TD‑003:** `bigNumber`/`animatedCounter` ignore theme color keys → wrong/low-contrast colours.
6. **Thin, low-variety configs.** The compiler leans on `textReveal`/`checklist` with minimal styling; even when correct, videos feel flat. Mid-scenes like `heroText`, `gridCards`, `bigNumber` are under-used or mis-configured (e.g. `heroText` with a `heroRef` that isn't a real lottie key → nothing renders).
7. **Duration vs content.** `durationInFrames` too short for the beats/animation → content cut off before it reads.

### 7.3 Recommended plan to raise quality (in priority order)

1. **Add a render-in-the-loop QA stage (highest leverage).** After validation, render **stills at key frames** (`@remotion/renderer` `renderStill()` against the `KnoMotionVideo` composition) for each scene, and check them:
   - deterministic checks first: detect near-empty frames (blank slot = a mid-scene rendered nothing), detect text bounding boxes overflowing the slot;
   - optionally an LLM **vision** pass ("is the text visible and legible? is any region empty?") that feeds issues back into the repair loop.
   This directly catches "text not showing" / "mid-scene blank" — the things static validation can't. Wire findings into `QualityReport.json` (the scaffold already exists) and/or as repairable issues.
2. **Add timing-quality validation rules** (`beat_timing` upgrade): every visible element must have `beats.start` within the scene and be visible for a minimum readable duration (e.g. ≥ ~1.2s or scaled to text length); `textReveal` must have per-line beats; warn/err when content exits too early or starts too late. Make these **errors** so repair fixes them.
3. **Make coercions semantics-safe.** Stop silently coercing *layout/slot* mismatches. Specifically: if `sideBySide` appears, force `layout:{type:"full"}` **and** move it into the `full` slot (drop stray `left`/`right`), or emit a `sidebyside_layout` error for repair. When changing a layout type, reconcile/rename slots to match, or fail to repair. Keep coercion only for **purely syntactic** drift (string→object, null pruning, key aliases).
4. **Fix the engine bugs in `TECH_DEBT.md`** that cause invisible/mis-rendered content — at least **TD‑002 (mask), TD‑001 (heroText position), TD‑003 (colors).**
5. **Text fitting** — integrate `@remotion/layout-utils` (per `BUILD_STATUS`) so slots auto-fit text, and add a validator check for overflow using measured text; tighten per-slot length limits in the interim.
6. **Richer, correct mid-scene use via few-shot prompting.** Give the scene-JSON compiler 2–3 *full, correct* worked examples per common mid-scene (not just one textReveal), and validate mid-scene-specific requirements (e.g. `heroText.heroRef` must be a real lottie key or URL — already a warning; make heroType/heroRef consistency an error).
7. **Stronger LLM adherence via OpenAI structured outputs** (`response_format: json_schema`) so the model *cannot* emit invalid enums/shapes. Feasible now for the four **planning** stages (simple schemas). Scene-JSON uses **dynamic slot keys** (`full`/`row1`/`col1`…) which strict mode doesn't support as-is — either keep coercion for that stage, or refactor `slots` to a fixed-shape array `[{name, midScene, config}]` and transform back to the renderer's record. This reduces the whole "model improvises" class that currently degrades quality.
8. **Acceptance gate = renders + spot check.** Treat "MVP done" as: config validates **and** a rendered still/clip is visually correct. Build **P4 (one-click Studio preview)** so this is a button, not a manual `--props` dance (see §8).

> Guiding principle: shift quality checks from *"is it valid JSON?"* to *"does it render as a legible, complete scene?"* — via rendering + timing rules + semantics-safe coercion + fixing the engine's invisible-content bugs.

---

## 8. What is NOT built yet (next targets)

- ~~**P4 — Studio preview harness**~~ **BUILT**: `npm run run -- preview <jobId>` (from `knomotion-pipeline/`; jobId optional → latest job, `--video <id>` to pick a video) stages the job's config to `public/pipeline-preview/config.json`; the `PipelinePreview` composition (`KnoMotion-Videos/src/remotion/PipelinePreview.tsx`, registered in `Root.tsx`) fetches it at metadata time and renders via `GenericVideoPlayer`. Shows an instructional placeholder when nothing is staged.
- **Render-check (9), render (12), captions** — stubs throwing `NotImplementedError` (render-check has no file yet); contracts exist (`CaptionsManifest`, `QualityReport`). TTS, timing and assembly landed in Sept M1; the old `beat-alignment` stub was removed (timing owns beats).
- **Full resume** (`--resume <jobId> --from <stage>`) — the artifact store already supports validated reads; only `--stop-after` is wired.
- **QualityReport population** + creator-portal edit capture + fine-tuning dataset + personalised scene variants — scaffolded contracts only.
- **OpenAI structured outputs** — see §7.3 #7.

---

## 9. How to validate your changes (UAT recap)

- `npm test` (offline) — must stay green (17/2). Add a fixture/test for every new rule or coercion.
- `npm run run -- --source worldcup` (mock) — full chain, all `passed`.
- `npm run run -- --source worldcup --provider openai` — real content; watch the `WARN … { issues: [...] }` lines (exact failing JSON paths) to spot new LLM drift.
- Render proof — `npx remotion still … KnoMotionVideo --props=<05-…config.json>`; **inspect the image** (this is where quality regressions show up).

---

## 10. Suggested order for the next agent

1. ~~**P4 preview**~~ **DONE** — see §8 (`preview <jobId>` CLI + `PipelinePreview` composition).
2. **Quality pass** per §7.3: render-in-the-loop QA stage → timing rules → semantics-safe coercions → fix `TECH_DEBT` TD‑001/002/003 → text fitting.
3. **Structured outputs** for planning stages (adherence).
4. Then resume + the out-of-scope stages (TTS → captions → beat-alignment → assembly → render) as the audio/render track.

Keep the run branch `cursor/pipeline-integration-8c94` updated so the user always has a single command to try your work.
