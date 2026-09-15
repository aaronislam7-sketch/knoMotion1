# KnoMotion Pipeline — Build Progress & Handoff

> Handoff for the next agent continuing the KnoMotion content pipeline.
> Read this top-to-bottom, then `Sept_DevPlan.md` (the current plan and milestone order) and `TECH_DEBT.md` (engine issues) before coding.
> Last updated: 2026‑09‑10 (docs truth pass — Sept plan M0). The pipeline is on `main`; §6 is kept as history only.

---

## 0. TL;DR

- We built a **standalone `knomotion-pipeline/` package** that compiles source text → validated, renderable KnoMotion scene JSON. It runs as a **CLI** today (no UI yet).
- It is a **structured compiler**, not a chatbot: one orchestrator, many typed stages, LLM only where judgement is needed, a Zod contract + artifact on disk at every step, and a deterministic validation + surgical-repair safety net.
- **Stages 0–7 are implemented** (intake → content-analysis → module-planning → video-planning → script-generation → scene-json-generation → validation → repair). **Stages 8–12** (TTS, captions, beat-alignment, assembly, render) are **scaffolded stubs**.
- It runs **end-to-end** with a `mock` provider (offline, deterministic) and against **OpenAI** (`--provider openai`).
- **The open problem to prioritise: output video QUALITY.** Configs can pass validation yet render poorly (text not showing, mid-scenes blank). §7 describes the failure modes; **the sequenced plan for fixing them is `Sept_DevPlan.md`** (deterministic timing driven by TTS, guardrails, then render/PDF).

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
# 1) everything is on main — no special branch needed
git checkout main && git pull
cd knomotion-pipeline && npm install

# 2) offline, deterministic (no API key) — proves the machinery:
npm run run -- --source worldcup

# 3) real LLM run (needs OPENAI_API_KEY in env / Cloud Agents secret):
npm run run -- --source worldcup --provider openai

# tests (must stay green; the pass/skip counts grow as rules are added):
npm test                    # 2 skips are expected until the root `npm install` has run (drift guardrail needs renderer deps)

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
    → [3 video-planning]  VideoPlan.json           (LLM)
    → [4 script-gen]      NarrationScript.json     (LLM)
    → [5 scene-json]      KnoMotionVideoConfig.json (LLM, constrained "compiler")  ← renderer coupling
    → [6 validation]      ValidationReport.json    (deterministic; deep ajv + business rules)
    → [7 repair]          RepairPatch.json × scenes (LLM, only on failure; ≤2 attempts → needs_review)
```

- Every stage implements the same `Stage<In,Out>` interface. The orchestrator validates input, runs, then the artifact store validates + writes the output. Stages never call each other — they only consume/produce artifacts. This is what makes runs **replayable, auditable, and repairable**.
- Artifacts land in `pipeline/artifacts/<jobId>/` with per-video nesting under `videos/<videoId>/`, plus a `job.json` run manifest (per-stage status, timing, model, promptVersion).

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
| 5 | Scene JSON (compiler) | LLM | ✅ | `stages/scene-json-generation/…`, `prompts/scene-json-generation.ts` |
| 6 | Validation | deterministic | ✅ deep per-mid-scene (ajv) + business rules | `stages/validation/validate.ts`, `runValidation.ts` |
| 7 | Repair | LLM | ✅ repairs all failing scenes, ≤2 attempts | `stages/repair/runRepair.ts`, `prompts/repair.ts` |
| 8 | TTS | deterministic API | ⛔ stub (`NotImplementedError`) | `stages/tts/generateTTS.ts` |
| 9 | Captions | deterministic | ⛔ stub | `stages/captions/generateCaptions.ts` |
| 10 | Beat Alignment | deterministic | ⛔ stub | `stages/beat-alignment/alignBeats.ts` |
| 11 | Assembly | deterministic | ⛔ stub | `stages/assembly/buildRenderProps.ts` |
| 12 | Render | deterministic | ⛔ stub | `stages/render/triggerRender.ts` |
| — | QualityReport | — | ⛔ scaffold only (contract exists) | `schemas/QualityReport.ts` |

### Supporting infrastructure (all built)

- **Contracts (`schemas/`)** — Zod schema + TS type for every artifact, each wrapped in an `ArtifactMeta` envelope (jobId, stage, producedBy, model, promptVersion, inputs, createdAt). `KnoMotionVideoConfig.ts` is a faithful, standalone **mirror** of the renderer's `VideoConfigSchema` (kept in sync via comments), restricted to the **11 canonical mid-scene keys**.
- **Orchestrator** — module→video fan-out, per-stage timing/manifest, `--stop-after`, and the validate→repair→re-validate loop (repairs every failing scene per attempt; `needs_review` after the cap).
- **LLM client** — provider-agnostic. `MockLLMClient` (deterministic, input-aware, used offline + in tests). `OpenAIClient` (JSON mode, Zod-parse, corrective retries with exact-path feedback, **null-property pruning**, **temperature fallback** for gpt‑5.x). Factory in `core/llm/index.ts`.
- **Capability bridge** — `renderer-capabilities.ts` loads the renderer manifest + 11 mid-scene JSON schemas at runtime and compiles them with `ajv` (Option A: one-directional data dependency, no drift). Overridable via `KNOMOTION_RENDERER_SDK_DIR`.
- **Validation engine (`validate.ts`)** — rules: `midscene_name`, `midscene_config` (deep ajv), `layout_type`, `transition_type`, `slot_names`, `slots_filled`, `sidebyside_layout`, `duration_bounds`, `beat_timing`, `text_length`, `audio_url`, `lottie_key`. Severity policy: **error** = renders broken → blocks + triggers repair; **warning** = quality/uncertain.
- **LLM-drift coercions (in the schemas)** — self-heal common model mistakes at parse time: `null`→absent, difficulty synonyms/case, key aliases (`problem`→`description`, `misconception`→`statement`, `id`→`sceneId`, …), `background:"x"`→`{preset:"x"}`, `layout:"x"`→`{type:"x"}`, background/layout **vocabulary folding** (`focus`→`spotlight`, `twoColumn`→`columnSplit`, `sideBySide`→`full`), flat-scene → `config` lifting, `durationSeconds`→`durationInFrames`, and dropping non-object junk in `scenes[]`.
- **CLI** — `--source <name>` (from `sources/`), `--input <path>`, `--text "…"`, `--title`, `--format`, `--provider`, `--out`, `--stop-after`, `--log-level`.
- **Tests (vitest)** — `validation.test.ts` (one broken fixture per rule + baseline), `artifact-store.test.ts`, `orchestrator.test.ts` (full mock run), `contract-drift.test.ts` (pipeline‑valid ⇒ renderer‑valid guardrail). All must pass; the 2 drift skips clear once root renderer deps are installed.

---

## 4. Reference documents to read

- **`Sept_DevPlan.md`** (repo root) — the current plan: milestones M0–M5, the revised stage order (TTS before scene JSON, deterministic timing, render-check), scope decisions D1–D6. Start here for *what to do next*.
- **`RETAIN_ARTIFACTS.md`** (repo root) — the living keep/remove register. Every PR that touches a directory must add or update rows for what it confirmed live or dead (see §5).
- **`TECH_DEBT.md`** (repo root) — pre-investigated engine issues, several of which directly cause video-quality problems (see §7).
- `July_DevPlan.md` — superseded by `Sept_DevPlan.md`; still the fullest root-cause analysis (§3 there) of why generated videos are weak.
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
- **Retain register:** every PR that touches a directory adds or updates rows in `RETAIN_ARTIFACTS.md` for the files it confirmed live, dead, or shimmed (path · status · one-line evidence · date · PR). Nothing is deleted until its row says `REMOVE` with evidence and any replacement is on `main`. There is no separate cleanup phase — the register is the cleanup.
- **This doc is updated in the same PR** that changes behaviour it describes.

---

## 6. Branch & PR map (historical)

> **Everything below was consolidated into `main` by PR #69** (`cursor/pipeline-consolidated-8c94`). The `cursor/pipeline-integration-8c94` branch was verified on 2026-09-10 to differ from `main` only in `package-lock.json`; the `*-8c94` remotes are safe to delete (tracked in `RETAIN_ARTIFACTS.md` §8). Do not check out any of these branches to run the pipeline — run from `main` (§1).

Stacked pipeline PRs (merged in order): **#61 → #64 → #65 → #67**, plus independent **#62** and **#63**.

| PR | Branch | Contents |
|----|--------|----------|
| #61 | `cursor/knomotion-pipeline-schemas-8c94` | Contracts / all Zod schemas (+ 11-key restriction) |
| #62 | `cursor/midscene-schema-reconciliation-8c94` | Engine: reconciled mid-scene JSON schemas + capability manifest + LLM guide |
| #63 | `cursor/tech-debt-register-8c94` | `TECH_DEBT.md` |
| #64 | `cursor/pipeline-p0-infra-8c94` | P0: orchestrator, stage interface, artifact store, LLM client, CLI (base #61) |
| #65 | `cursor/pipeline-validation-engine-8c94` | P1+P2: ajv capability bridge, Stage-6 rule engine, tests (base #64) |
| #67 | `cursor/pipeline-p3-prompts-8c94` | P3: real prompts, model routing, LLM-drift hardening (base #65) |
| #66 | `cursor/pipeline-integration-8c94` | Was the run-only UAT branch (closed, superseded by #69) |
| #69 | `cursor/pipeline-consolidated-8c94` | **Merged** — all of the above, consolidated onto `main` |
| #71 | `cursor/july-devplan-8e6a` | **Merged** — `July_DevPlan.md` |
| #72 | `cursor/phase0-preview-repair-8e6a` | Repair write-back fix + `preview <jobId>` harness (Sept plan M0 item 1) |
| #73 | `cursor/sept-devplan-retain-list-25fd` | `Sept_DevPlan.md` + `RETAIN_ARTIFACTS.md` |

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

> **Superseded in sequencing by `Sept_DevPlan.md`.** The items below are still the right ingredients, but the order and a few choices changed: TTS now runs *before* scene JSON so real audio duration drives timing (Sept M1); timing rules, slot/layout reconciliation, text budget and a *deterministic* render-check are grouped as guardrails (Sept M2); the optional LLM-vision pass in item 1 and the structured-outputs refactor in item 7 are explicitly deferred. Read this section for the *why*; read the Sept plan for the *what next*.

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

- **P4 — Studio preview harness** (planned, not built): an additive `KnoMotion-Videos/src/remotion/pipeline-preview.tsx` that reuses `GenericVideoPlayer` and loads a generated config, plus a `preview <jobId>` CLI command → one-click watch. (User already approved putting a preview file in the renderer tree.)
- **Stages 8–12** (TTS, captions, beat-alignment, assembly, render) — stubs throwing `NotImplementedError`; contracts exist (`TTSManifest`, `CaptionsManifest`, `RenderManifest`).
- **Full resume** (`--resume <jobId> --from <stage>`) — the artifact store already supports validated reads; only `--stop-after` is wired.
- **QualityReport population** + creator-portal edit capture + fine-tuning dataset + personalised scene variants — scaffolded contracts only.
- **OpenAI structured outputs** — see §7.3 #7.

---

## 9. How to validate your changes (UAT recap)

- `npm test` (offline) — must stay green. Add a fixture/test for every new rule, guardrail or coercion; each guardrail ships with a deliberately broken fixture that proves it fires.
- `npm run run -- --source worldcup` (mock) — full chain, all `passed`.
- `npm run run -- --source worldcup --provider openai` — real content; watch the `WARN … { issues: [...] }` lines (exact failing JSON paths) to spot new LLM drift.
- Render proof — `npx remotion still … KnoMotionVideo --props=<05-…config.json>`; **inspect the image** (this is where quality regressions show up).

---

## 10. Suggested order for the next agent

1. **P4 preview** (so you can *see* outputs quickly) — small, unblocks everything else.
2. **Quality pass** per §7.3: render-in-the-loop QA stage → timing rules → semantics-safe coercions → fix `TECH_DEBT` TD‑001/002/003 → text fitting.
3. **Structured outputs** for planning stages (adherence).
4. Then resume + the out-of-scope stages (TTS → captions → beat-alignment → assembly → render) as the audio/render track.

> This list predates `Sept_DevPlan.md`; where they disagree, the Sept plan wins (it moves TTS ahead of the quality pass and defers structured outputs). Work from `main`; there is no longer a separate run branch.
