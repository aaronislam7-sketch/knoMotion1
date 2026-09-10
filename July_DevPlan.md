# July Development Plan — KnoMotion

> A review of the repository as of 2026-07-20 (`main` @ `d30e9453`, post PR #69) and a practical plan for the next phase of work.
> Written for someone returning to the codebase after a break. Every claim below is marked as **[code]** (verified in source), **[doc]** (stated in documentation, not independently verified), or **[inference]** (reasoned judgement). Where something is unknown, it is flagged with the smallest investigation needed to resolve it.

---

## 1. Executive assessment

### Where the repository is

The product has three live parts and a large legacy tail:

- **Renderer engine** (`KnoMotion-Videos/src/`) — a JSON-driven Remotion engine. 11 mid-scenes, 5 layouts, a beats timing system, transitions via `@remotion/transitions`, an audio/caption layer, a Zod video-config schema, and a machine-readable capability manifest. This is genuinely built and mostly works. **[code]**
- **Content pipeline** (`knomotion-pipeline/`) — a standalone Node "compiler": source text → content analysis → module/video planning → narration script → scene JSON → deterministic validation → bounded LLM repair. Stages 0–7 are real; stages 8–12 (TTS, captions, beat alignment, assembly, render) are stubs that throw `NotImplementedError`. **[code]**
- **Admin/preview app** (root Vite app → `KnoMotion-Videos/src/admin/`, plus the separate `KnoSlides/` slide product) — live and wired. **[code]**
- **Legacy tail** — `Archive/` (201 tracked files of superseded v5–v7 templates), a committed `dist/` build output, three unused schema/validation layers, duplicated animation modules, and roughly a dozen root-level planning documents in varying states of staleness. `deletion-plan.md` correctly identified most of this in May and none of it was executed. **[code]**

### Where the pipeline is

The pipeline machinery (orchestrator, typed stages, artifact store, validation engine, repair loop, mock provider, tests) is solid engineering. But it stops at "schema-valid JSON", and there are three structural reasons the resulting videos are poor:

1. **Nothing owns timing.** Scene duration and beats are invented independently by three different LLM calls (video planning, script generation, scene-JSON generation) with prompt guidance only. There is **no code anywhere** that derives duration or beats from narration length, word count, or audio. The `beat_timing` validation rule is practically inert (it only warns when a beat exceeds both the scene duration *and* 20 seconds). **[code]**
2. **Validation proves shape, not appearance.** Nothing in the pipeline ever renders a frame. Known engine bugs (invisible mask reveals, mis-positioned heroes) and semantics-breaking coercions (layout folding that strands slots) let a "passed" config render as a blank or broken scene. **[code]**
3. **The repair loop's output is discarded.** `validateAndRepair` patches failing scenes in memory, but `runPipeline` does `void finalConfig` and never writes the repaired config back to `05-knomotion-video-config.json`. The `configPath` returned to the caller points at the *pre-repair* file. Repair currently only improves the validation report, not the deliverable. **[code — `knomotion-pipeline/pipeline/orchestrator.ts` lines ~122–134]**

### The SDK quality ceiling

Even with a skilled human authoring scene JSON by hand, the ceiling is **polished slideshow explainers**: timed text choreography, icon/card grids, checklists, speech-bubble callouts, two-panel comparisons, big stats, and syntax-highlighted code. There is **no** JSON-reachable way to show a timeline, a process/flow diagram, a labelled diagram, or any chart. Of the 11 mid-scenes, eight are variations on "text/cards/icons appear with stagger"; only `sideBySide`, `codeBlock`, and arguably `bigNumber` are structurally distinct. **[code]** A `FlowDiagram` component exists in `sdk/components/mid-level/` but is not wired into the mid-scene surface. **[code]** This is the single biggest reason generated videos feel flat and repetitive, independent of any pipeline improvement.

### The biggest obstacles to human-quality videos

In priority order:

1. **No timing authority** — narration, beats, and scene duration are unreconciled guesses (root cause of "text not showing", "flashes for 3 frames", "scene ends mid-thought").
2. **A narrow visual vocabulary** — the pipeline cannot pick a diagram or timeline because none exists; every topic collapses into textReveal + checklist.
3. **A validation/appearance gap** — schema-valid ≠ visible, and four catalogued engine bugs (`TECH_DEBT.md` TD-001…TD-004, all re-verified in code for this plan) actively produce invisible or blank content.
4. **Pipeline plumbing defects** — the repair write-back bug and semantics-breaking coercions silently degrade output that the reports claim is fine.

### Recommended overall direction

Keep the architecture. The staged compiler design, the schema-per-artifact contracts, the capability manifest, and the JSON-first renderer are the right shape and should not be rewritten. The work is to **redistribute responsibility**: take timing away from the LLM and make it deterministic; give the LLM a genuinely richer (but still enumerated) visual vocabulary to choose from; and close the validation/appearance gap with a small deterministic render check rather than agentic review layers. In parallel, fix the four engine bugs and the repair write-back defect, establish a five-video reference baseline so "better" is observable, and run a bounded housekeeping pass so the repository stops misleading the people (and agents) working in it.

---

## 2. Current architecture and pipeline map

### End-to-end flow

```
source .md ──▶ knomotion-pipeline (Node CLI)                        KnoMotion-Videos (Remotion)
              0 intake            → SourceBundle.json
              1 content-analysis  → ContentMap.json        (LLM)
              2 module-planning   → ModulePlan.json        (LLM)
              ── per video ──
              3 video-planning    → VideoPlan.json         (LLM)
              4 script-generation → NarrationScript.json   (LLM)
              5 scene-json        → KnoMotionVideoConfig ──┐ (LLM "compiler")
              6 validation        → ValidationReport       │ (deterministic, ajv + rules)
              7 repair            → RepairPatch × N        │ (LLM, ≤2 attempts)
              8–12 TTS/captions/beat-align/assembly/render ✗ stubs
                                                           │
                                                           ▼
                                        GenericVideoPlayer ("KnoMotionVideo" composition)
                                        SceneRenderer → layouts → 11 mid-scenes → SDK elements
```

The only coupling point is the Stage-5 JSON plus a one-directional data read: the pipeline loads `KnoMotion-Videos/src/sdk/capability-manifest.json` and the 11 mid-scene JSON schemas at runtime via `core/capabilities/renderer-capabilities.ts` (ajv). The pipeline never imports renderer React code. **[code]** This boundary is correct and should be preserved.

### Stage-by-stage assessment

| Stage | Purpose | Files | Contracts (in → out) | Maturity | Weaknesses | Verdict |
|---|---|---|---|---|---|---|
| 0 intake | Normalise source text | `stages/intake/runIntake.ts` | `IntakeInput` → `SourceBundle` | Working (text/markdown only) | No PDF parsing — **the "PDF-to-video" entry point does not exist yet**; `wordCount` computed but unused downstream | **Improve** (add PDF via `pdf-parse`) |
| 1 content-analysis | Extract concepts/facts/misconceptions | `stages/content-analysis/`, `prompts/content-analysis.ts` | `SourceBundle` → `ContentMap` | Working | No few-shot; quality unmeasured | **Retain** |
| 2 module-planning | Split into video briefs | `stages/module-planning/` | `ContentMap` → `ModulePlan` | Working | Duration targets are unvalidated LLM guesses | **Retain** |
| 3 video-planning | Per-video teaching flow, scene list, suggested mid-scenes | `stages/video-planning/` | brief+concepts → `VideoPlan` | Working | `suggestedMidScenes` advisory-only; suggestions limited by the 11-key vocabulary | **Retain**, evolves with SDK vocabulary |
| 4 script-generation | Narration per scene | `stages/script-generation/` | `VideoPlan` → `NarrationScript` | Working | `estimatedDurationSeconds` is an LLM guess; "2–3 words/sec" lives only in prompt text — no code enforces it | **Improve** (deterministic duration from word count) |
| 5 scene-json-generation | Compile plan+script → renderable JSON | `stages/scene-json-generation/`, `prompts/scene-json-generation.ts` | plan+script → `KnoMotionVideoConfig` | Working but weakest link | LLM authors *all* timing (`durationInFrames`, every `beats`); single few-shot example (a lone `textReveal`) biases output flat; must invent beats with no knowledge of speech pace | **Restructure** (strip timing authorship; add worked examples per mid-scene) |
| 6 validation | Deterministic gate | `stages/validation/validate.ts`, `runValidation.ts` | config → `ValidationReport` | Working; 13 rules incl. deep ajv per mid-scene | `beat_timing` inert in practice (`v > durationSec+0.5 && v > 20`); no minimum-visibility rule; no overflow check; `unknown_keys` emitted but missing from `rulesChecked()` | **Strengthen** |
| 7 repair | Surgical per-scene LLM fix | `stages/repair/runRepair.ts` | scene+issues → `RepairPatch` | Working, bounded (≤2) | **Repaired config never written back** (orchestrator `void finalConfig`); repair only sees validator issues, so it can only fix what validation can see | **Fix defect, retain** |
| 8–12 | TTS / captions / beat-align / assembly / render | `stages/_stub.ts` pattern | contracts exist (`TTSManifest`, `CaptionsManifest`, `RenderManifest`) | **Stubs** | The entire audio/render half of the product is unbuilt; without it, timing can never be truly reconciled | **Build** (Stage 10 beat-alignment is the architectural keystone) |
| — QualityReport | Post-hoc quality artifact | `schemas/QualityReport.ts` | scaffold only | Contract only | No producer | **Defer** — populate only when the deterministic render check (§4) exists to feed it |

Renderer-side notes:

- `Root.tsx` registers `KnoMotionVideo` (the generic composition) plus 9 hand-built canon compositions (3 TikTok, 6 Knodovia). `CanonShowerVideo.jsx` is used by the admin preview but is **not** registered in `Root.tsx` even though `COMPOSITION_ID_MAP` references it — a live inconsistency. **[code]**
- Total duration is computed as `sum(durationInFrames) − (n−1) × 20`: the **default** 20-frame transition overlap is always used, even when a scene specifies its own transition duration. A per-scene transition duration would silently desynchronise total length. **[code — `sdk/transitions/index.ts` + `Root.tsx` `calculateGenericMetadata`]**
- `alignTTSToBeats` / `computeSceneTimeline` (`sdk/utils/ttsToBeatAlignment.ts`) exist and are documented as "the pipeline bridge" but are **imported by nothing** — not the renderer, not the pipeline. **[code]**

### Documentation vs code — confirmed divergences

| Document | Claim | Reality |
|---|---|---|
| `pipeline_build.md` §1 | "git checkout `cursor/pipeline-integration-8c94`" as the run branch | The pipeline was merged to `main` via PR #69 (`cursor/pipeline-consolidated-8c94`). The integration branch is diverged (16 unique commits vs main's 3); following the doc on a fresh clone leads to a superseded tree. **Whether any integration-branch commits were lost in consolidation needs a tree diff — see §8.** |
| `SDK.md` | "Current Mid-Scenes (10)" — omits `codeBlock`; "23 elements (14 atoms + 9 compositions)" | 11 mid-scenes with 11 schemas; `elements/index.js` exports 16 atoms + 11 compositions (its own header comment says "25 (14+11)" — also wrong) |
| `README.md` | Mid-scene table lists 6 | 11 exist |
| `docs/ARCHITECTURE.md` | Says "All 11 mid-scenes" in one place and "10 mid-scenes" / "40 lottie keys" in the manifest section | 11 keys; manifest has 41 lottie keys |
| `SHOWCASE.md` / `showCasePlan.md` | Render `src/compositions/ShowcaseMain.jsx` (3.5-min showcase) | `ShowcaseMain` and all `ShowcaseScene*` exist only under `Archive/`; the live preview is a different component |
| `BUILD_STATUS.md` | "Engine alignment score: 10/10. Core architecture complete." | Broadly accurate for what was scoped, but overstates health: TD-001…TD-004 are live correctness bugs and `@remotion/layout-utils` text fitting (its own listed item) is still not installed |
| `pipeline_build.md` §3 | "Repair… repairs all failing scenes" | Patches are produced and validated but never merged into the output config file (write-back bug above) |
| `verify-setup.sh`, `fix-remotion-deps.sh` | Check/pin paths & versions | Reference `src/templates/WhiteboardTED.jsx` (doesn't exist) and Remotion 4.0.373 (repo pins 4.0.382) |

### Newer-model references

There are **no** references to Sol, Fable, Claude, or any Anthropic model anywhere in the pipeline or engine code. Model routing (`knomotion-pipeline/pipeline/config/models.ts`) is: default `gpt-5.4-mini`, escalated to `gpt-5.5` for content-analysis, module-planning, video-planning, and repair; script-generation and scene-json-generation run on the *mini* default. **[code]** The provider layer supports only `openai` and `mock`, using JSON-object mode (not `json_schema` structured outputs). **[code]** Two observations: (a) the stage that most determines video quality — scene-JSON generation — runs on the cheapest model; (b) newer models (e.g. the Sol and Fable families now available in agent tooling) are one-line config changes away thanks to the routing table, but nothing in the repo has evaluated them. **[inference — treat as a cheap experiment, not a workstream.]**

---

## 3. Root-cause analysis

### 3.1 Timing inaccuracies

**Symptom:** text flashes and vanishes, everything exits at ~0.6s, lines start after the scene is mostly over, scenes cut off mid-narration.

**Root causes (all confirmed in code):**

1. **Duration is authored, not derived.** `durationInFrames` is written by the Stage-5 LLM from a prompt hint ("seconds × 30"). The narration word count — the single best available predictor of how long a scene needs — is never consulted by any code. The prompt chain contains three *independent* duration estimates (VideoPlan, NarrationScript, scene JSON) with no reconciliation between them.
2. **Beats are authored blind.** Every `beats.start/exit` is LLM-emitted with no model of reading speed, speech pace, or animation entrance time. The renderer's `resolveBeats` defaults (~0.5s delay, ~1.6s hold) only apply when beats are absent; a wrong explicit beat wins.
3. **The validator cannot catch the failures.** `beat_timing` errors only on `start >= exit`; the out-of-range check requires the value to exceed **both** scene duration + 0.5 **and** 20 seconds — so a beat at 10s in a 5s scene passes silently. There is no minimum-visibility rule, no "content must exist near the end of the scene" rule, no per-line-beats-required rule for `textReveal`.
4. **The reconciliation machinery is unbuilt.** Stage 10 (beat alignment) is a stub; `alignTTSToBeats` is dead code; `TTSManifest.wordTimings` is a contract with no producer. The system was *designed* to fix timing with real audio and stopped before that point.
5. **A smaller renderer-side error:** total duration uses the default 20-frame transition overlap regardless of per-scene transition config (§2), and the seconds→frames coercion hardcodes 30 fps rather than reading `constraints.fpsFixed`.

### 3.2 Weak or repetitive video outputs

1. **The vocabulary is small and skewed.** 8 of 11 mid-scenes are text/card/icon staggers. When the planning stage picks "suggestedMidScenes" it can only choose within this set, so topic diversity cannot express itself visually.
2. **The compiler prompt teaches one pattern.** `prompts/scene-json-generation.ts` contains exactly one worked example — a single `textReveal` scene — and no instruction to vary mid-scene choice across scenes. The mock client's defaults are also textReveal/checklist, so even the test fixtures reinforce the pattern. **[code]**
3. **Correct configs still render broken.** TD-002 (`mask` reveal + `up/down` → empty clip-path → invisible text), TD-001 (heroText positioned via undefined-coordinate fallbacks), TD-003 (`color: "primary"` silently ignored in bigNumber/animatedCounter), TD-004 (Zod accepts 12 alias keys that `SceneRenderer` renders as `null` blank slots). All four re-verified for this plan. **[code]**
4. **No text fitting.** `@remotion/layout-utils` is neither installed nor imported; long lines overflow slots; the `charByChar` reveal has a known wrapping bug (`BUILD_STATUS.md`). **[code]**

### 3.3 Pipeline incompleteness

Stages 8–12 are stubs; there is no resume (`--stop-after` only); there is no preview harness (inspecting output requires a manual `npx remotion still --props=…` incantation); PDF intake is unimplemented. These are known and documented (`pipeline_build.md` §8) — the doc is accurate here. The *undocumented* incompleteness is the repair write-back bug and the fact that repaired output is unreachable by the caller.

### 3.4 Schema limitations

Schemas do their structural job well (typed artifact at every boundary, deep ajv per mid-scene config, a drift test asserting pipeline-valid ⇒ renderer-valid). Where they fail:

- **Coercions repair syntax by breaking semantics.** `layout: "sideBySide"` → `{type: "full"}` (and unknown layout → `full`) with **no slot reconciliation** — the model's `left`/`right` slots then resolve to nothing under a `full` layout and the scene renders blank, *validly*. **[code — coerce maps in `schemas/KnoMotionVideoConfig.ts`]**
- **Schemas cannot see readability.** A schema-valid scene can have every line exit at 0.6s. This is not fixable by more schema; it needs timing rules (deterministic) and a render check.
- **Two mirrored video-config schemas** (renderer `videoConfig.schema.ts`, pipeline `KnoMotionVideoConfig.ts`) are kept in sync by comments plus one drift test. Acceptable for now; a risk as the vocabulary grows.

### 3.5 Scene-selection limitations

Selection happens twice — advisory in Stage 3, binding in Stage 5 — with no deterministic input into either. There is no notion of "this scene's content *shape* is a sequence/comparison/quantity/structure", which is the natural deterministic signal for narrowing mid-scene choice. Because the capability summary lists all 11 keys flatly with required fields, the model has no guidance about *when* each is appropriate beyond its name. **[code + inference]**

### 3.6 SDK capability limitations

Covered in §1/§3.2. One addition: the layers below mid-scenes are healthy — the element library, layout engine, theme, and lottie registry are reusable and already power the 11 mid-scenes — so new mid-scenes are cheap to add correctly. The `FlowDiagram` mid-level component and the remotion-bits catalog (42 bits at v0.2.0, current latest; includes charts and particle systems per its own description) mean at least two of the missing visual categories have partial building blocks available. **[code + verified externally]**

### 3.7 Mid-scene limitations (architecture, not count)

The mid-scene *pattern* is right: flat JSON config, own schema, slot-positioned, beats-driven, LLM-friendly. `BUILD_STATUS.md`'s "favor more mid-scenes over complex schemas" decision is correct and should stand. The limitations are: (a) the roster gap above; (b) an inconsistent internal position contract (TD-001 — `SceneRenderer` injects top-left `{left,top,width,height}` but one component and one schema believe in center `{x,y}`); (c) two same-named `positionToCSS` functions with different semantics that `SDK.md` itself documents as a "critical issue" rather than fixing. New mid-scenes must not inherit these ambiguities — the position contract needs to be settled first.

### 3.8 Repository complexity

The repo carries four generations of the system simultaneously: `Archive/` templates (v5–v7), legacy validators/animation modules inside the live `sdk/` tree, the current mid-scene engine, and the new pipeline. Nine root-level planning/status markdown files partially contradict each other, and the most load-bearing handoff doc (`pipeline_build.md`) points at a superseded branch. The cost is not disk space — it is that every new contributor or agent must spend effort distinguishing live from dead, and some docs actively mislead. `deletion-plan.md` (analysis-only, never executed) already did most of the identification work. **[code]**

---

## 4. Recommended target direction

Incremental, not a redesign. The stage list barely changes; the *responsibilities* do.

### Minimum pipeline stages and responsibilities

| Stage | Responsibility | Deterministic or LLM |
|---|---|---|
| 0 intake | Parse PDF/markdown/text → `SourceBundle` | Deterministic (add `pdf-parse`) |
| 1 content-analysis | Concepts, facts, misconceptions | LLM (judgement) |
| 2 module-planning | Video briefs | LLM (judgement) |
| 3 video-planning | Teaching flow; per scene: purpose, key points, visual intent, **content shape** (new field: `sequence` \| `comparison` \| `quantity` \| `structure` \| `statement` \| `code`) | LLM, constrained by an enum |
| 4 script-generation | Narration text + on-screen text | LLM (judgement) |
| 4b **timing (new, deterministic)** | Compute provisional `durationInFrames` and per-line/item beat windows **from the narration** (word count ÷ words-per-second + entrance/settle buffers per mid-scene) | **Deterministic** |
| 5 scene-json | Choose mid-scenes/layout/content within the vocabulary; **timing fields are injected from 4b, not authored** | LLM ("compiler"), timing removed from its authorship |
| 6 validation | Structural + **strengthened timing rules** + text-measure overflow check | Deterministic |
| 6b **render check (new, deterministic)** | `renderStill()` at 2–3 keyframes per scene; flag near-blank slots and out-of-bounds text | Deterministic |
| 7 repair | Bounded surgical fix, **written back to the output config** | LLM |
| 8 TTS | Narration → audio + word timings (`TTSManifest`) | Deterministic API |
| 9 captions | Word timings → `CaptionsManifest` | Deterministic |
| 10 beat-alignment | Reconcile provisional 4b timings with **real** TTS timings (this is where `alignTTSToBeats` finally earns its keep) | Deterministic |
| 11 assembly | Merge config + audio + captions into final render props | Deterministic |
| 12 render | Remotion render → MP4 | Deterministic |

### How narration timing should be calculated and reconciled

Two-phase, same function shape both times:

1. **Provisional (no audio yet):** a pure function `computeSceneTiming(narration, midSceneKinds, fps) → { durationInFrames, beatWindows }` using a words-per-second constant (~2.5 wps, the prompt's own guidance, now enforced in code), plus per-mid-scene entrance time and a settle buffer before the transition. The Stage-5 LLM receives these as **fixed inputs** ("this scene is 172 frames; line 1 is visible 0.4–3.1s…") and fills content into them.
2. **Reconciled (audio exists):** Stage 10 replaces the word-count estimate with actual TTS word timings via the same alignment interface, stretching `durationInFrames` and beat windows proportionally.

This single change eliminates the entire class of "LLM invented impossible timing" failures — the model can no longer author what it cannot get right — and it makes stage 10 a substitution rather than a new mechanism. It makes the system **simpler** (one timing authority instead of three guesses) **and better**.

### How scene and mid-scene selection should work

- Stage 3 tags each planned scene with a **content shape** (enum above). Deterministic code maps each shape to an allowed subset of mid-scenes (e.g. `sequence` → timeline/processFlow/checklist/cardSequence; `quantity` → bigNumber/statRow/animatedCounter). Stage 5 chooses **within the subset**. The LLM still exercises judgement; it just can't pick a text wall for a process.
- The capability summary given to Stage 5 gains a one-line "use when…" per mid-scene and 2–3 full worked examples covering different mid-scenes (not just `textReveal`).

### How richer visual patterns are exposed safely

New mid-scenes follow the *existing* discipline exactly — component + JSON schema + registry entry + `MID_SCENE_COMPONENTS` entry + capability-manifest entry — so the pipeline inherits them through the capability bridge with zero pipeline code changes. That mechanism already works; it is the reason expanding the vocabulary is safe. Target set (grounded in `mid-scenes/README.md` future ideas, `KnoMotion-Videos/docs/videoGaps.md`, and the existing `FlowDiagram` component): **processFlow**, **timeline**, **annotatedDiagram** (image + sequenced callouts), **statRow** (2–4 animated stats; simple bar option), **quoteReveal/keyTakeaway**. Five, not fifteen — each must earn its place in the reference videos (§7) before the next is added.

### Human-created and pipeline-created videos

Both already converge on the same surface — scene JSON rendered by `GenericVideoPlayer` — and that should be preserved as an invariant: **no pipeline-only rendering features**. The admin builder, Studio props panel (Zod schema), and pipeline all author the same `VideoConfig`. The missing piece is a one-click preview of pipeline output (the "P4 preview harness" from `pipeline_build.md` §8): a `pipeline-preview` composition or CLI `preview <jobId>` that loads a generated config into Studio.

### What should NOT be built

- **Multi-agent review systems, LLM-judges-LLM loops, autonomous repair beyond the existing bounded ≤2-attempt loop.** The deterministic render check gives repair better inputs; that is the evidence-backed version of "review".
- **A vision-LLM QA pass** — defer until the deterministic blank-frame/overflow checks are in and demonstrably insufficient.
- **Generic orchestration frameworks / queues / services.** The CLI orchestrator is adequate for this phase.
- **OpenAI structured-outputs refactor of the slots record** (fixed-shape array + transform) — real benefit, but the coercion layer plus corrective retries currently absorbs most drift; revisit only if drift remains a top failure source *after* timing is deterministic.
- **Personalisation, i18n, creator-portal edit capture, fine-tuning datasets** (scaffolds exist) — out of scope until baseline quality exists.
- **Player (R1) integration** — correctly skipped for an MP4-first product.
- **Fifteen new mid-scenes at once** — five, validated against reference videos.

---

## 5. Consolidated development workstreams

### WS1 — Timing engine and pipeline contracts

- **Objective:** one deterministic timing authority from narration to render.
- **Problem:** timing is authored by three uncoordinated LLM calls; validator can't catch bad beats; repaired configs are discarded; coercions break semantics (§3.1, §3.4).
- **Proposed changes:**
  1. `computeSceneTiming()` in the pipeline (new module, e.g. `pipeline/core/timing.ts`); Stage 5 prompt rewritten to receive timing as fixed input; Stage-5 output post-processed to overwrite any LLM-authored timing fields.
  2. Fix orchestrator write-back: persist repaired config to `05-knomotion-video-config.json` (or a `05b-` final artifact) and point `configPath` at it.
  3. Demote semantics-unsafe coercions to validation errors: layout folding that leaves orphaned slots (`sideBySide`→`full`, unknown→`full`) must either reconcile slots or fail into repair. Keep purely syntactic coercions (string→object, null pruning, key aliases).
  4. Strengthen `beat_timing`: minimum visible duration scaled to text length; beats within scene bounds (drop the `>20s` escape hatch); `textReveal` requires per-line beats; content must persist until near scene end. All **errors**, so repair fixes them.
  5. Use per-scene transition duration in `calculateTransitionSeriesDuration`; read fps from `constraints.fpsFixed` in the coercion.
- **Repository areas:** `knomotion-pipeline/pipeline/{orchestrator.ts, schemas/KnoMotionVideoConfig.ts, stages/validation/validate.ts, prompts/scene-json-generation.ts}`, `KnoMotion-Videos/src/sdk/transitions/index.ts`.
- **Dependencies:** none — can start immediately.
- **Effect on product:** eliminates the #1 quality failure class (invisible/mis-timed text) and makes pipeline reports truthful.
- **Simpler, better, or both:** **both** (removes duplicated timing guesses; directly improves every video).
- **Risks/trade-offs:** a words-per-second constant is approximate until TTS lands (mitigated by generous settle buffers and by WS4 replacing it with real timings); tightened rules will initially fail more configs (that is the point — repair now has real work).
- **Completion criteria:** `npm test` green with new timing-rule fixtures; a mock and an OpenAI run of `--source worldcup` where every scene's beats fall inside the scene, every line meets minimum visibility, and the persisted config equals the validated/repaired config.

### WS2 — Engine correctness and text fitting

- **Objective:** a schema-valid config always renders visible, correctly positioned, correctly coloured content.
- **Problem:** TD-001…TD-004 produce invisible/misplaced/miscoloured content; no text fitting (§3.2).
- **Proposed changes:** fix TD-002 (map `up→top`, `down→bottom` in the mask path), TD-001 (standardise position contract on top-left `{left,top,width,height}`, update `HeroTextEntranceExit` + its schema), TD-003 (theme-key resolution in `BigNumberReveal`/`AnimatedCounter`, then relax the schema patterns), TD-004 (tighten `MidSceneKeys` to the 11 canonical keys — option (a), since the pipeline already restricts itself and no committed config uses aliases [verify `Root.tsx` defaultProps first]); install `@remotion/layout-utils@4.0.382` and apply `fitText`/`fillTextBox` in `TextRevealSequence`, `ChecklistReveal`, `BigNumberReveal`; add a measured-overflow check to Stage-6 validation. Bundle the TD-006 dead-code removals into the same PR.
- **Repository areas:** `KnoMotion-Videos/src/sdk/mid-scenes/*`, `sdk/animations/index.js`, `sdk/schemas/videoConfig.schema.ts`, `capability-manifest.json`, `docs/reference-llm-guide.md`.
- **Dependencies:** none; parallel to WS1.
- **Effect:** removes the "mid-scene renders nothing" class of failures for both human and pipeline authors.
- **Simpler, better, or both:** **both** (deletes fallback ambiguity; raises floor quality of every render).
- **Risks:** position-contract change could shift existing canon compositions — verify Knodovia/TikTok comps in Studio after TD-001.
- **Completion criteria:** each TD's stated acceptance criteria met (they are already written in `TECH_DEBT.md`); items marked RESOLVED; a Studio test scene per fix.

### WS3 — Visual vocabulary expansion (mid-scenes)

- **Objective:** the five missing explanatory patterns, delivered through the existing mid-scene discipline.
- **Problem:** the SDK cannot express processes, chronology, labelled structure, or data (§1, §3.6) — the ceiling on *every* video, human- or pipeline-made.
- **Proposed changes:** build `processFlow` (promote/rewrite the existing `sdk/components/mid-level/FlowDiagram.jsx`), `timeline`, `annotatedDiagram`, `statRow`, `quoteReveal` — each with component + schema + registry + renderer map + manifest entry + a Studio test scene. Evaluate remotion-bits' chart/particle bits as internal rendering primitives per the existing overlap matrix (JSON interface stays KnoMotion's); the library is at its latest published version (0.2.0) so no upgrade is needed or available. Add "use when…" guidance per mid-scene to the capability manifest so WS5 can consume it.
- **Repository areas:** `KnoMotion-Videos/src/sdk/mid-scenes/`, `compositions/SceneRenderer.jsx`, `sdk/capability-manifest.json`, `docs/reference-llm-guide.md`.
- **Dependencies:** WS2's position-contract fix (TD-001) should land first so new components are built on the settled contract.
- **Effect:** directly raises the quality ceiling; gives Stage 3/5 meaningful choices; the main antidote to slideshow-style output.
- **Simpler, better, or both:** **better** (adds capability; complexity bounded by the established pattern).
- **Risks:** scope creep per mid-scene (cap config options; "fewer options = easier for LLMs" per the mid-scene README); manifest drift (mitigate with TD-005's generation script, which becomes worthwhile the moment the roster grows — fold it in here).
- **Completion criteria:** 5 new canonical keys render correctly in Studio desktop+mobile; schemas load through the capability bridge; each is used in at least one reference video (§7) and demonstrably improves it.

### WS4 — Audio pipeline (stages 8–12) and timing reconciliation

- **Objective:** narrated MP4s end-to-end, with beats reconciled to real speech.
- **Problem:** the audio/render half is stubs; provisional timing stays approximate until real word timings exist (§3.3).
- **Proposed changes:** implement TTS (ElevenLabs or equivalent → `TTSManifest` with `wordTimings`), captions (`CaptionsManifest`, feeding the existing `CaptionOverlay`), beat-alignment (Stage 10 consuming WS1's timing interface — wire or replace the dead `alignTTSToBeats`), assembly, and render (`@remotion/renderer` against `KnoMotionVideo`). Build the P4 preview harness first within this workstream (it's needed by all others).
- **Repository areas:** `knomotion-pipeline/pipeline/stages/{tts,captions,beat-alignment,assembly,render}/`, `sdk/utils/ttsToBeatAlignment.ts`, new `pipeline-preview` entry in `KnoMotion-Videos/src/remotion/`.
- **Dependencies:** WS1 (the reconciliation interface must exist to be substituted into); requires a TTS API key (Cloud Agents secret).
- **Effect:** completes the product loop (PDF → narrated MP4); converts timing from estimate to ground truth.
- **Simpler, better, or both:** **better** (and completes scope).
- **Risks:** external API cost/flakiness (SafeAudio already handles broken URLs; keep the mock provider path for offline tests).
- **Completion criteria:** `npm run run -- --source worldcup --provider openai` yields an MP4 with synced narration and captions; beat windows within ±0.3s of TTS word timings for on-screen text.

### WS5 — Pipeline selection quality and prompt/context upgrades

- **Objective:** the pipeline reliably *chooses well* from the expanded vocabulary.
- **Problem:** flat one-example prompt; no content-shape signal; the highest-leverage stage runs on the cheapest model (§3.5).
- **Proposed changes:** add `contentShape` enum to `ScenePlanSchema` + deterministic shape→allowed-mid-scenes mapping enforced in Stage 5 (validation error if a scene uses a disallowed key without justification metadata); add 2–3 full worked examples spanning different mid-scenes to `scene-json-generation.ts`; add a deterministic variety check (warning when >60% of scenes in a video use the same mid-scene); run a small model-routing experiment for stages 4/5 (escalated vs. mini vs. newer families e.g. Sol/Fable) judged against the §7 reference criteria — a config-table change, not new infrastructure.
- **Repository areas:** `knomotion-pipeline/pipeline/{schemas/VideoPlan.ts, prompts/*, stages/validation/validate.ts, config/models.ts}`.
- **Dependencies:** WS3 (needs the richer vocabulary to select from); WS1 (examples must show the new timing-injected format).
- **Effect:** turns SDK capability into actual output variety.
- **Simpler, better, or both:** **better**.
- **Risks:** over-constraining shape→mid-scene mapping (keep it a *subset*, not a single forced choice).
- **Completion criteria:** across the 5 reference videos, no video is >60% one mid-scene; each content shape appears with an appropriate visual at least once; regression suite covers the shape mapping.

### WS6 — Render check (deterministic quality gate)

- **Objective:** close the validation↔appearance gap without agentic review.
- **Problem:** nothing renders a frame before "passed" (§3.2, §3.4).
- **Proposed changes:** a post-validation step that calls `renderStill()` at 2–3 deterministic keyframes per scene (entrance-settled, midpoint, pre-exit) and runs cheap pixel checks: near-uniform region where a slot should have content ⇒ error ("blank slot"); optionally text bounding-box overflow using WS2's measurement. Findings feed the existing repair loop and populate `QualityReport.json` (finally giving the scaffold a producer). No LLM in the loop.
- **Repository areas:** new `knomotion-pipeline/pipeline/stages/render-check/`; depends on root renderer deps being installed (TD-008 — fold the env-setup fix in here).
- **Dependencies:** WS2 (otherwise it flags engine bugs, not config bugs); the P4 preview harness shares the bundling setup.
- **Effect:** "passed" finally correlates with "visible".
- **Simpler, better, or both:** **better** (one bounded deterministic stage; explicitly *instead of* LLM review layers).
- **Risks:** render time per job (stills only, 2–3 frames/scene — acceptable); false positives on intentionally sparse scenes (tune the near-blank threshold per layout).
- **Completion criteria:** a fixture with a known-blank slot (e.g. the sideBySide/full mismatch) is caught by the check and fixed by repair; runs in CI against the mock pipeline.

### WS7 — Repository and documentation housekeeping (supporting)

- **Objective:** the repo stops misleading contributors; dead weight documented in §8 is removed once its replacement is confirmed.
- **Proposed changes (bounded, in this order):**
  1. **Docs truth pass** (cheap, do early): fix `pipeline_build.md` §1 (run from `main`), correct the counts in `SDK.md`/`README.md`/`docs/ARCHITECTURE.md`, mark `SHOWCASE.md`/`showCasePlan.md`/`auditPlan.md` as archived-status headers or move them to `Archive/docs/`.
  2. `git rm --cached dist/` (already gitignored); remove the nonsensical `package.json`/`package-lock.json` lines from `.gitignore`.
  3. Remove confirmed-unused deps: `@monaco-editor/react`, `react-syntax-highlighter` (+types), `rough-notation`, `culori`, `@remotion/animated-emoji`, `@dnd-kit/sortable`; verify then remove `@remotion/fonts`, `@remotion/tailwind`.
  4. Delete legacy validators (`sdk/validation/scene.schema.ts`, `scene-validator.js`, `sceneCompatibility.js`, `layout-resolver.js`) and orphan animation files/shims per `deletion-plan.md`, after the §8 verification steps.
  5. Delete `daisyExamples.txt`, `verify-setup.sh`, `fix-remotion-deps.sh`; either register `CanonShowerVideo` in `Root.tsx` or remove its `COMPOSITION_ID_MAP` entry.
  6. Decide and execute the `Archive/` question (§9 D5).
- **Dependencies:** none, but items 4–6 wait for the §8 verifications.
- **Simpler, better, or both:** **simpler** (necessary housekeeping; no direct video effect — which is why it is a supporting stream, scheduled after quality work starts, not before).
- **Completion criteria:** a fresh reader can go from `README.md` to a correct mental model without hitting a contradicted claim; `npm install` pulls no dead deps; deletion-plan items closed with commit links.

---

## 6. Prioritised delivery sequence

**Phase 0 — Stabilise and see (first).**
P4 preview harness + fix the repair write-back bug + docs truth pass (WS7 item 1). *Why first:* every later judgement depends on being able to look at pipeline output cheaply and on the repaired config actually being the output. All three are small. Parallel-safe: all three are independent.

**Phase 1 — Establish the quality baseline.**
Create the §7 reference set; run the current pipeline against all five sources; render and store the outputs as the "before" corpus. *Why here:* improvements from Phases 2–4 must be observable against something; this also forces the PDF-intake gap into the open (two reference sources should be PDFs). Runs parallel with Phase 2.

**Phase 2 — Correct timing and contracts (WS1 + WS2).**
The timing engine, strengthened validation, semantics-safe coercions, and the four engine bugs + text fitting. *Why before visual expansion:* new mid-scenes built on today's broken position/timing contracts would bake the defects in; and timing is the largest single quality lever. WS1 and WS2 are fully parallel (different packages).

**Phase 3 — Expand the visual language (WS3), start audio (WS4).**
Five new mid-scenes on the settled contracts; TTS/captions/beat-alignment/assembly/render behind them. *Why here:* WS3 needs WS2's contract fix; WS4 needs WS1's timing interface. WS3 and WS4 touch disjoint code and run in parallel.

**Phase 4 — Integrate selection with the improved SDK (WS5 + WS6).**
Content-shape selection, worked examples, variety checks, model-routing experiment; the deterministic render check. *Why last of the product phases:* selection quality is only meaningful once there is a richer vocabulary to select from and engine bugs no longer masquerade as config problems. Re-run the reference set; compare against the Phase-1 baseline using §7 criteria.

**Phase 5 — Consolidate and clean up (WS7 items 2–6).**
The bulk deletion/dependency work, `Archive/` decision, capability-manifest generation script if not already landed with WS3. *Why last:* it makes nothing better for viewers and needs the "what replaced this" answers that Phases 2–4 produce. (The docs truth pass deliberately does **not** wait — wrong docs are actively harmful.)

**Dependency summary:** Phase 0 → everything; WS1 → WS4, WS5; WS2 → WS3, WS6; WS3 → WS5. Parallel tracks at any time: {WS1, WS2}, then {WS3, WS4}, then {WS5, WS6}.

---

## 7. Quality baseline and reference outputs

### Reference set (5 sources, committed to `knomotion-pipeline/pipeline/sources/`)

| # | Explanatory need | Source | Why |
|---|---|---|---|
| R1 | Conceptual explanation | "Why your shower goes cold" (revive from the canon stress-test material behind `CanonShowerVideo` / `videoGaps.md`) | Already has a hand-crafted canon comparator; historically exposed the diagram/lottie gaps |
| R2 | Process / lifecycle | New short doc: the water cycle *or* "how a pull request gets merged" | Exercises `processFlow`/`timeline`; impossible to do well today — the clearest before/after |
| R3 | Comparison | New short doc: e.g. "renting vs buying" or "SQL vs NoSQL" | Exercises `sideBySide` + `statRow`; tests whether comparisons stop being two text lists |
| R4 | Numerical / data-led | `worldcup.md` (already in `sources/`) | Existing baseline runs exist; stats/records exercise `bigNumber`/`animatedCounter`/`statRow` |
| R5 | Technical / code | New short doc: e.g. "what is recursion" with code samples | Exercises `codeBlock` (also settles TD-007's open highlight-language question) |

At least two of these (suggest R2, R5) should be provided **as PDFs** once PDF intake lands, since PDF is the stated product entry point. Store each generated config + rendered MP4/stills per milestone under a versioned folder (e.g. `knomotion-pipeline/reference-outputs/<date>/`) so comparisons are side-by-side. This is a folder of files and a checklist — **not** an automated benchmark platform.

### Judgement criteria (human review, ~10 minutes per video)

Score each 1–5 with a one-line note; "better" = no criterion regresses and the target criteria improve:

1. **Accuracy** — no fabricated facts; on-screen text matches narration claims.
2. **Clarity** — a viewer new to the topic can restate the main point after one watch.
3. **Visual relevance** — each scene's visual *form* matches its content shape (process shown as flow, not bullets; quantity shown as number, not prose).
4. **Pacing** — no scene where text is on screen <1.2s or lingers >2× its reading time; no dead air; scene changes track topic changes.
5. **Narration synchronisation** — on-screen text appears within ~0.3s of being spoken (post-WS4; pre-audio, beats fall within their computed windows).
6. **Variety** — no video >60% one mid-scene; consecutive scenes differ in layout or mid-scene.
7. **Explanatory depth** — the video explains *why/how*, not just *that*; at least one scene goes a level deeper than a headline.
8. **Absence of unnecessary activity** — no animation that doesn't carry meaning; no particle/emphasis noise on neutral content.

---

## 8. Repository audit notes

### High-confidence cleanup candidates (replacement confirmed)

| Item | Evidence / what replaced it |
|---|---|
| Committed `dist/` (7 tracked files) | Vite build output, already in `.gitignore`; `git rm --cached` only **[code]** |
| `.gitignore` lines for `package.json` / `package-lock.json` | Nonsensical for a Node repo (files remain tracked so currently inert, but a trap) **[code]** |
| Unused deps: `@monaco-editor/react`, `react-syntax-highlighter` + types, `rough-notation`, `culori`, `@remotion/animated-emoji`, `@dnd-kit/sortable` | Zero imports in any live tree **[code]** |
| Legacy validators: `sdk/validation/scene.schema.ts`, `scene-validator.js`, `sceneCompatibility.js` (+ `layout-resolver.js`, whose only importer is the dead validator) | Replaced by `sdk/schemas/videoConfig.schema.ts` + pipeline Zod/ajv; only barrel-exported **[code]** |
| Orphan animation files: `broadcastAnimations.ts`, `advancedEffects.jsx`, `continuousLife.js`, `sceneTransformation.jsx`; shims `sdk/microDelights.jsx`, `sdk/broadcastEffects.tsx` | Logic consolidated into `animations/index.js` per `deletion-plan.md`; verify diff first (below) |
| Orphan admin views: `ElementShowcase.jsx`, `UnifiedAdminConfig.jsx` | Not imported by `App.jsx` **[code]** |
| `daisyExamples.txt` (62KB) | daisyUI LLM dump; zero references **[code]** |
| `verify-setup.sh`, `fix-remotion-deps.sh` | Check non-existent paths / pin superseded version 4.0.373 **[code]** |
| Stale root docs: `SHOWCASE.md`, `showCasePlan.md`, `auditPlan.md` | Describe compositions that exist only in `Archive/`; superseded by `BUILD_STATUS.md` + this plan |
| Blueprints `KnoMotion-Videos/docs/template-content-blueprints/` + `BLUEPRINT_V5.md` | Document templates that exist only in `Archive/` |

### Retain until replacement confirmed / needs investigation

| Item | Open question / smallest useful investigation |
|---|---|
| `Archive/` (201 tracked files) | Confirmed zero live imports, but deletion is a product decision (git history preserves it). See §9 D5. |
| Remote `cursor/pipeline-*-8c94` branches, esp. `cursor/pipeline-integration-8c94` (16 commits not on main) | **Diff the integration branch tree against main** to confirm PR #69 captured all prompt-hardening/CLI work before deleting remotes. One `git diff main...cursor/pipeline-integration-8c94 --stat` session. |
| Orphan animation files vs `animations/index.js` | Diff each file's exports against the consolidated module before deleting (deletion-plan's own caveat). |
| `sdk/index.js` legacy exports (`validateScene`, `SceneSchema`, `microDelights`, …) | Grep any *external* consumers (admin, KnoSlides) before pruning the barrel. |
| Root vs `KnoSlides/` duplicated deps (`framer-motion`, `@xyflow/react`, `@tanstack/react-table`, `@dnd-kit/core`) | Needed at root while the root Vite app bundles KnoSlides source; a workspaces setup would deduplicate but is not urgent. |
| `CanonShowerVideo.jsx` | Used by admin preview but unregistered in `Root.tsx` while `COMPOSITION_ID_MAP` references it — register or remove the map entry (bug either way). |
| `alignTTSToBeats` (`sdk/utils/ttsToBeatAlignment.ts`) | Dead today; **do not delete** — it is the designed Stage-10 interface (WS4). |
| Two mirrored video-config schemas | Intentional (comments + drift test). Revisit only if WS3 growth makes manual mirroring error-prone. |
| `KnoSlides/`, `knomotion-pipeline/`, `public/`, canon compositions, `mid-scenes/schemas/*.json`, `daisyui`, `roughjs` | Look dormant or duplicative but are all live — **not** safe to delete. **[code]** |

---

## 9. Decisions required

**D1 — Timing authority: deterministic word-count model now, or wait for TTS?**
Options: (a) keep LLM-authored timing until stages 8–10 exist; (b) deterministic provisional model now, substituted by TTS timings later.
**Recommendation: (b).** Evidence: every catalogued timing failure (`pipeline_build.md` §7.2 #1, verified inert `beat_timing` rule) stems from LLM authorship; the two-phase design makes TTS a drop-in. Delay cost: every video generated in the interim carries the #1 defect class, and WS4/WS5 would build on contracts that then change.

**D2 — Semantics-breaking coercions: keep, or demote to errors?**
Options: (a) keep silent layout folding; (b) coerce + reconcile slots; (c) emit validation errors and let repair fix semantically.
**Recommendation: (c)** (with (b) acceptable for the single well-understood `sideBySide` case). Evidence: the coerce maps in `KnoMotionVideoConfig.ts` change `layout.type` without touching `slots`, producing schema-valid blank scenes. Delay cost: blank scenes that no report will ever flag (until WS6, which would then be catching self-inflicted wounds).

**D3 — Mid-scene aliases: tighten the renderer Zod schema or make the renderer resolve them?**
Options: (a) restrict `MidSceneKeys` to the 11 canonical keys; (b) alias-normalisation in `SceneRenderer`.
**Recommendation: (a).** Evidence: pipeline already restricts to canonical keys (PR #61); aliases currently validate then render `null` (TD-004). Check `Root.tsx` defaultProps and committed configs for alias usage first. Delay cost: low but it keeps a silent-blank-slot trap open for human authors.

**D4 — Build order: audio pipeline (WS4) before or after visual vocabulary (WS3)?**
Options: (a) audio first (completes the product loop sooner); (b) vocabulary first (raises ceiling sooner); (c) parallel.
**Recommendation: (c)** — they touch disjoint code (pipeline stages vs renderer components) and share only WS1/WS2 as prerequisites. Delay cost of choosing serially: several weeks of an idle parallel track.

**D5 — `Archive/` (201 files) and stale remote branches: delete or keep?**
Options: (a) delete `Archive/` (git history preserves everything) and prune superseded remotes after the D-branch diff; (b) keep indefinitely.
**Recommendation: (a)**, executed in Phase 5 after the §8 branch-diff verification. Evidence: zero live imports; its docs actively confuse (SHOWCASE paths). Delay cost: low and constant — confusion tax on every new contributor/agent.

**D6 — Model routing for the quality-critical stages.**
Options: (a) keep `gpt-5.4-mini` for script + scene-JSON; (b) escalate those two to the escalation model; (c) small comparative run including newer families (Sol/Fable) under the §7 criteria.
**Recommendation: (c)** as a half-day experiment inside WS5 — the routing table makes it a config change. Evidence: the stage with the most quality leverage currently runs on the cheapest model; no repo data exists on the trade-off. Delay cost: minor; but doing it *before* WS1 would waste the experiment (timing noise would dominate).

---

## 10. Immediate next actions

**A1 — Build the pipeline preview harness (P4).**
*What changes:* add a `pipeline-preview` composition entry (reusing `GenericVideoPlayer`) under `KnoMotion-Videos/src/remotion/`, and a `preview <jobId>` CLI command in `knomotion-pipeline/pipeline/cli.ts` that resolves the latest video config from `pipeline/artifacts/<jobId>/` and opens Studio with it.
*Why now:* every subsequent quality judgement requires seeing output in seconds, not via a hand-built `--props` incantation; `pipeline_build.md` §10 already ranked it first and the user approved the renderer-tree file.
*Expected output:* one command from job ID to a playing preview.
*Acceptance:* `npm run run -- --source worldcup && npm run run -- preview <jobId>` shows the generated video in Studio.
*Files:* `knomotion-pipeline/pipeline/cli.ts`, new `KnoMotion-Videos/src/remotion/pipeline-preview.tsx` (or a `defaultProps`-loading wrapper in `Root.tsx`).
*Simpler or better:* simpler (removes a manual multi-step workflow) — and a precondition for "better".

**A2 — Fix the repair write-back defect and persist the final config.**
*What changes:* in `knomotion-pipeline/pipeline/orchestrator.ts`, write `finalConfig` (the post-repair `working` config) back to `05-knomotion-video-config.json` (or a new `05b-final-config.json`) and point the result's `configPath` at it; add an orchestrator test asserting the persisted config matches the validated one.
*Why now:* it is a plain correctness bug — repair currently costs LLM calls and improves nothing the caller can reach.
*Expected output:* the artifact on disk is the config the validator passed.
*Acceptance:* new vitest case: a mock run with an injected failing scene ends with the repaired scene present in the persisted config.
*Files:* `pipeline/orchestrator.ts`, `pipeline/__tests__/orchestrator.test.ts`.
*Simpler or better:* better (every repaired video actually ships its repairs).

**A3 — Implement the deterministic timing engine and remove timing authorship from Stage 5.**
*What changes:* new `pipeline/core/timing.ts` exporting `computeSceneTiming(narration: SceneNarration, opts) → { durationInFrames, beatWindows }` (words-per-second ~2.5, per-mid-scene entrance buffer, pre-transition settle); Stage 5 prompt updated to state timing as given; Stage-5 post-processing overwrites LLM-emitted `durationInFrames`/`beats` with computed values; `beat_timing`/`duration_bounds` rules tightened per WS1 item 4 with one fixture per new rule.
*Why now:* the single highest-leverage quality change; unblocks WS4 and WS5.
*Expected output:* generated configs where timing is a function of the narration, byte-reproducible for a given script.
*Acceptance:* mock + OpenAI `worldcup` runs pass the tightened rules with zero timing errors; every visible element meets the minimum-visibility rule; tests green.
*Files:* `pipeline/core/timing.ts` (new), `pipeline/stages/scene-json-generation/`, `pipeline/prompts/scene-json-generation.ts`, `pipeline/stages/validation/validate.ts`, `pipeline/__tests__/validation.test.ts`.
*Simpler or better:* both — three uncoordinated guesses become one function, and the #1 defect class disappears.

**A4 — Land the four engine-bug fixes (TD-001…TD-004) plus TD-006 cleanup in one renderer PR.**
*What changes:* mask-direction mapping in `sdk/animations/index.js`; top-left position contract in `HeroTextEntranceExit.jsx` + its schema; theme-color resolution in `BigNumberReveal.jsx`/`AnimatedCounter.jsx` (then relax the schema colour patterns and manifest notes); tighten `MidSceneKeys` to 11 canonical keys in `videoConfig.schema.ts` (after confirming no committed config uses aliases); remove the TD-006 dead branches.
*Why now:* these bugs convert *correct* configs into invisible or broken scenes — they poison every downstream quality measurement.
*Expected output:* TECH_DEBT items 1–4 and 6 marked RESOLVED with PR links.
*Acceptance:* the acceptance criteria already written per item in `TECH_DEBT.md`; Studio spot-check of the Knodovia/TikTok canon comps after the position change.
*Files:* listed per item in `TECH_DEBT.md`.
*Simpler or better:* both — deletes fallback ambiguity and raises the render floor.

**A5 — Create the reference set and capture the "before" baseline.**
*What changes:* add the four missing source docs (R1, R2, R3, R5 — R4 exists) to `knomotion-pipeline/pipeline/sources/`; run the current pipeline (`--provider openai`) on all five; render stills/MP4-proofs via A1; commit configs + a short scored review (criteria of §7) under `knomotion-pipeline/reference-outputs/2026-07-baseline/`.
*Why now:* Phases 2–4 need an honest "before"; this also smoke-tests A1/A2 and surfaces the current failure modes concretely.
*Expected output:* a committed baseline corpus and scorecard.
*Acceptance:* five configs + rendered evidence + one scorecard file, reproducible from the committed sources.
*Files:* `knomotion-pipeline/pipeline/sources/*`, new `knomotion-pipeline/reference-outputs/`.
*Simpler or better:* better (makes "better" measurable; prevents regression-by-vibes).

**A6 — Docs truth pass.**
*What changes:* rewrite `pipeline_build.md` §1/§6 to run from `main` and describe the merged state; fix mid-scene/element counts in `SDK.md`, `README.md`, `docs/ARCHITECTURE.md`; add an "ARCHIVED — superseded by July_DevPlan.md" header to `SHOWCASE.md`, `showCasePlan.md`, `auditPlan.md`; note the repair write-back fix in `pipeline_build.md` once A2 lands.
*Why now:* the handoff doc currently sends any new agent to a superseded branch — cheap to fix, expensive to leave.
*Expected output:* no load-bearing doc contradicts the code.
*Acceptance:* spot-check by following each doc's instructions verbatim on a clean checkout.
*Files:* the six documents named above.
*Simpler or better:* necessary housekeeping (explicitly labelled as such).

---

*End of July development plan.*
