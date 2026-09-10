# September Development Plan — KnoMotion

> Supersedes `July_DevPlan.md` as the working plan. Written 2026-09-10 against `main` @ `12db6221`.
> Goal for this phase: **one pipeline run turns a source document into a narrated MP4 of decent quality.** Captions, personalisation, model training and a wider visual vocabulary come after that loop is closed.
> Organised around four principles: **Pipeline**, **Quality**, **Guardrails**, **Documentation**. Every item is tagged with the principle it serves.
> Companion file: `RETAIN_ARTIFACTS.md` — the living keep/remove list that every PR in this plan must add to.
> Scope decisions (TTS provider, KnoSlides, canon comps, desktop-only, LLM guide, Archive) were answered 2026-09-10 and are recorded in §5.

---

## 1. Review of the July plan

**Verdict: the diagnosis was correct; the delivery shape was too wide for the goal.**

Every root cause in July §3 was re-verified in code for this plan and still holds:

| July claim | Status today |
|---|---|
| Repair output discarded (`void finalConfig`, `orchestrator.ts`) | Still on `main`. **Fixed in draft PR #72** (unmerged). |
| `beat_timing` rule inert (`v > durationSec + 0.5 && v > 20`, warning only) | Still true. |
| Stage 5 LLM authors all timing; single `textReveal` few-shot | Still true (`prompts/scene-json-generation.ts`). |
| TD-001…TD-004 engine bugs | All still open. |
| Coercions fold `sideBySide`→`full` without slot reconciliation | Still true. |
| `alignTTSToBeats` is dead code | Still true (imported by nothing). |
| Pipeline never reads `docs/*-llm-guide.md`; it reads `capability-manifest.json` + 11 JSON schemas | Verified — two parallel "LLM guidance" surfaces exist. |
| Integration branch may hold work `main` lacks | **Resolved: no.** Two-dot diff `main..origin/cursor/pipeline-integration-8c94` differs only in `package-lock.json`. The `*-8c94` remotes are safe to delete. |

What the July plan got right and this plan keeps:
- Keep the architecture; redistribute responsibility. Timing must be deterministic, not LLM-authored.
- No multi-agent review loops, no vision-LLM QA before deterministic checks exist, no orchestration frameworks.
- The mid-scene discipline (component + schema + registry + manifest) is the right extension mechanism.
- Phase 0 (preview harness + write-back fix) first. That work now exists in PR #72.

What this plan changes, and why:

| July decision | September change | Reason |
|---|---|---|
| Audio (WS4) in Phase 3, after visual vocabulary | **TTS moves to immediately after script generation, before scene JSON.** | Real audio duration and word timings are the ground truth the timing engine needs. Generating TTS first collapses July's "4b provisional timing" + "Stage 10 reconciliation" into one deterministic step. The word-count estimator stays only as the offline/mock fallback behind the same interface. |
| Five new mid-scenes (WS3) as a core workstream | **Deferred until the first good end-to-end video exists.** At most `keyTakeaway` and `processFlow` (from existing `FlowDiagram.jsx`) afterwards. | July itself says the current ceiling is "polished slideshow explainers". That is decent quality. Eleven mid-scenes that render correctly and are chosen sensibly beat sixteen that don't. |
| Five reference videos | **Two**: `worldcup.md` (numerical/statement) + one short process doc. | Human review time per iteration matters more than coverage right now. Grow to five when the vocabulary grows. |
| Guardrails spread across WS1/WS2/WS6 | **Guardrails are a first-class track** with an authoring / validation / render / engine layering. | The user's stated quality bar is "nothing off-screen, text safely sized and positioned". That deserves its own definition of done. |
| Docs truth pass as housekeeping | **Documentation = "how the pipeline knows what to do"**, a single machine-readable knowledge source that prompts, tests and human docs all derive from. | Two hand-maintained guidance surfaces (manifest vs. `docs/*-llm-guide.md`) will drift again. |
| Model-routing experiment inside WS5 | Kept, moved to the end, one afternoon, config-only. | Unchanged reasoning: noise from timing would dominate any earlier result. |
| Housekeeping in Phase 5 as a bulk pass | **Continuous**, via `RETAIN_ARTIFACTS.md`. Each PR records what it confirmed live or dead. | Bulk deletion passes have been planned twice (`deletion-plan.md` May, July §7) and executed zero times. |

Also noted: draft PR #70 (`NEXT_SESSIONS.md`, ten-session roadmap) overlaps this plan. Recommendation: close it in favour of this file rather than maintain a third roadmap.

---

## 2. Target pipeline

```
source .md/.pdf
  0  intake              → SourceBundle           deterministic (PDF via pdf-parse — Pipeline)
  1  content-analysis    → ContentMap             LLM
  2  module-planning     → ModulePlan             LLM
  ── per video ──
  3  video-planning      → VideoPlan (+ contentShape per scene)      LLM, enum-constrained
  4  script-generation   → NarrationScript                           LLM
  5  tts                 → TTSManifest (audio + duration + wordTimings)   deterministic API  ◄ moved up
  6  timing              → SceneTiming (durationInFrames, beat windows per line/item)   deterministic  ◄ new
  7  scene-json          → KnoMotionVideoConfig — LLM chooses mid-scene/layout/content
                            WITHIN the shape's allowed subset; timing fields are INJECTED, not authored
  8  validation          → ValidationReport (structural + timing + text-budget + slot/layout rules)   deterministic
  9  render-check        → QualityReport (blank-slot + edge-bleed pixel checks on 2–3 stills/scene)  deterministic  ◄ new
 10  repair              → RepairPatch ≤2, written back                LLM
 11  assembly            → render props (config + audio paths)         deterministic
 12  render              → MP4                                         deterministic (@remotion/renderer)
 —   captions            → CaptionsManifest from stored wordTimings    deferred; data is already captured at 5
```

Invariant preserved from July: the renderer is coupled to the pipeline only through the Stage-7 JSON and the capability data files. No pipeline-only rendering features. Human-authored and pipeline-authored configs render through the same `GenericVideoPlayer`.

---

## 3. Delivery sequence

Each milestone ends with a runnable command and a visible result. Do not start the next until the acceptance line is met. Milestones are ordered by leverage on the goal, not by principle.

### M0 — Land what exists, make output visible
*Principles: Pipeline, Documentation*

1. Review and merge **PR #72** (repair write-back + `preview <jobId>` harness). Do not rebuild these. — **done (merged to `main` as `f4cb348a`)**
2. Close **PR #70** or fold any unique point into this file. — *owner, pending*
3. Delete the `origin/cursor/*-8c94` branches (verified fully merged). — **done (9 remotes deleted 2026-09-10)**
4. Docs truth pass on the two load-bearing docs only: `pipeline_build.md` (§1 run from `main`; §6 branch map is history) and `README.md` (mid-scene table shows 6 of 11, no mention of the pipeline). — **done, PR #74**
5. Start `RETAIN_ARTIFACTS.md` (PR #73) and add the "every PR updates it" rule to `pipeline_build.md` (PR #74). — **done**

**Acceptance:** `npm run run -- --source worldcup && npm run run -- preview` shows the generated video in Studio from a clean `main` checkout, following the docs verbatim.

### M1 — Timing becomes deterministic; TTS enters the pipeline
*Principles: Pipeline, Quality*

1. **Stage 5 TTS**: implement `generateTTS.ts` against ElevenLabs (D1), using the with-timestamps endpoint so `wordTimings` are populated. One clip per scene. Store `audioPath`, measured `durationSeconds`, `wordTimings` where the provider returns them. Cache by hash of narration text so prompt iteration doesn't re-bill. Mock provider synthesises timings from word count (~2.5 wps) so offline runs and tests still work.
2. **Stage 6 timing** (`pipeline/core/timing.ts`): pure function `computeSceneTiming(narration, tts | null, midSceneHints, fps)` → `{ durationInFrames, lineWindows[] }`. Duration = audio duration + entrance buffer + settle buffer before transition. Line/item windows come from word timings when present, else proportional word-count split. Same output shape either way, so swapping estimator for ground truth is a no-op downstream.
3. **Stage 7 prompt rewrite**: timing stated as fixed input ("this scene is 172 frames; line 1 visible 0.4–3.1s"). Post-process overwrites any LLM-emitted `durationInFrames`/`beats` with computed values.
4. Fix the two renderer timing leaks: per-scene transition duration in `calculateTransitionSeriesDuration`; read fps from `constraints.fpsFixed` in the seconds→frames coercion.
5. Stage 11 assembly wires `audioPath` into each scene's `audio.narration` block; remove the "do NOT include an audio block" prompt rule once assembly owns it.

**Acceptance:** `--source worldcup --provider openai` produces a config where every scene's duration is derived from its audio, every beat sits inside its scene, and the preview plays with synchronised narration. Mock run passes the same tests offline.

### M2 — Guardrails
*Principle: Guardrails (Quality)*

Layered so each check is cheap and deterministic. Order of implementation is top to bottom.

**Authoring-time (constrain what the LLM can emit)**
- Timing injected (M1) — the LLM can no longer author impossible beats.
- `contentShape` enum on `ScenePlanSchema` (`statement | sequence | comparison | quantity | structure | code`) and a deterministic shape→allowed-mid-scene subset enforced at Stage 7. Subset, not a single forced choice.
- **Text budget per slot**: derive max characters per line and max lines from slot dimensions and the mid-scene's base font size (slot geometry is already computed by `resolveSceneSlots`; font sizes are already clamped per mid-scene). Pass the budget into the prompt and enforce it as a validation error.

**Validation-time (`validate.ts`, all errors so repair must act)**
- `beat_timing`: beats within `[0, durationSec]`; drop the `>20s` escape hatch; minimum visible duration scaled to text length (floor ~1.2s); `textReveal` requires per-line beats; content persists until near scene end.
- `slot_layout_reconcile`: demote `sideBySide`→`full` and unknown-layout→`full` coercions to errors when they would orphan slots (July D2 option c).
- `text_budget`: line length / item count against the per-slot budget above.
- `midscene_name`: already canonical-only in the pipeline; tighten the renderer Zod `MidSceneKeys` to the same 11 keys (TD-004 option a) so human authors get the same guardrail.
- Add `unknown_keys` to `rulesChecked()` (currently emitted but not declared).

**Render-time (new Stage 9 `render-check`)**
- `renderStill()` at three frames per scene: first line settled, midpoint, pre-exit.
- Two pixel checks only: (a) **blank slot** — near-uniform region where a slot should have content; (b) **edge bleed** — non-background pixels in the outer safe band (desktop 60px / mobile 40px, matching `getViewportPadding`). Both feed repair as issues and populate `QualityReport.json`.
- A `debugSafeZones` prop on `GenericVideoPlayer` that draws slot bounds and the safe band, for human review in the preview harness.

**Engine-time (fix the renderer so valid configs render visibly)**
- TD-002 mask direction mapping; TD-001 top-left position contract for `heroText`; TD-003 theme-key colour resolution; TD-006 dead-code removals. One renderer PR, acceptance criteria already written in `TECH_DEBT.md`.
- Install `@remotion/layout-utils@4.0.382`; apply `fitText` in `TextRevealSequence`, `ChecklistReveal` (replace the placeholder `autoFitText`), `BigNumberReveal`. Text that cannot fit shrinks rather than overflows; the text budget stops that from being needed often.

**Acceptance:** a fixture set with one deliberately broken config per guardrail (off-screen text, oversized line, orphaned slot, out-of-range beat, mask+up, alias key) — every one is caught by validation or render-check and either repaired or ends `needs_review`. Zero blank slots or edge bleed on the two reference videos. Desktop only (D4); every check reads its geometry from the layout engine so mobile fixtures can be added without redesign.

### M3 — Documentation: one knowledge source for the pipeline
*Principle: Documentation*

The pipeline's "knowledge" today is spread across the hand-maintained manifest, 11 JSON schemas, prompt strings, and two human-facing LLM guides it never reads. Consolidate into one generated, tested source.

1. Generate `capability-manifest.json` from the JSON schemas + `MID_SCENE_COMPONENTS` (TD-005). A CI check fails on drift.
2. Add per-mid-scene `useWhen` / `avoidWhen` / `contentShapes` fields to the manifest. Stage 3 and Stage 7 prompts read these; nothing is hard-coded in prompt strings.
3. **Worked examples as fixtures**: `knomotion-pipeline/pipeline/examples/<midScene>.json` — one complete, validated, rendered scene per mid-scene. Loaded into the Stage 7 prompt (2–3 per call, chosen by content shape) and run as tests (must pass validation and render-check). Examples that break when the engine changes fail CI instead of silently mis-teaching the model.
4. `docs/reference-llm-guide.md`: give it one stated purpose — the authoring guide for humans and agents working *on* the repo, generated from the manifest + example fixtures — and uplift it to that, or retire it if the generated manifest and examples already serve every reader (D5). `docs/instructions-llm-guide.md` is retired (its content is the Stage 7 system prompt). Outcome recorded in `RETAIN_ARTIFACTS.md`.
5. `pipeline_build.md` stays the single handoff doc: how to run, stage map, where knowledge lives, how to add a mid-scene so the pipeline picks it up.

**Acceptance:** adding a mid-scene by following `pipeline_build.md` results in the pipeline being able to select and correctly author it with no prompt edits.

### M4 — Close the loop: PDF in, MP4 out, two reference videos
*Principle: Pipeline*

1. PDF intake via `pdf-parse`.
2. Stage 12 render via `@remotion/renderer` against `KnoMotionVideo`; `render <jobId>` CLI command next to `preview`.
3. `--resume <jobId> --from <stage>` (artifact store already validates on read).
4. Reference set: `worldcup.md` + one new short process doc (e.g. "how a pull request gets merged"), one of them as PDF. Store config + MP4 + a one-line-per-criterion score under `knomotion-pipeline/reference-outputs/<date>/`. Criteria: accuracy, clarity, visual relevance to shape, pacing, narration sync, variety, nothing off-screen.
5. Model-routing experiment: scene-json on mini vs escalation model, judged on the two references. Config-table change only.

**Acceptance:** `npm run run -- --input lesson.pdf --provider openai --render` yields an MP4 with synchronised narration where both reference videos score no criterion below 3/5.

### M5 — After the loop is closed (not before)
- `keyTakeaway` and `processFlow` mid-scenes, each justified by a reference video that needs it.
- Captions stage from stored `wordTimings` → `CaptionOverlay` (data already exists; small).
- Variety rule (warn when >60% of a video is one mid-scene).
- Convert the canon compositions to JSON fixtures under `GenericVideoPlayer` (D3 — only once M4 output is judged satisfactory).
- Mobile guardrail fixtures (D4).
- `Archive/` is *not* in this milestone; it waits for the dedicated archiving activity (D6).

### Parallel, unscheduled — KnoSlides exit (D2)
Owner snapshots `KnoSlides/` locally. Then one PR removes `KnoSlides/`, the `SlidesPreview` / `SlideBuilder` views and their `npm run dev:slides-*` scripts, and the root dependencies used only by KnoSlides (`framer-motion`, `@xyflow/react`, `@tanstack/react-table`, `@dnd-kit/core`, `lottie-react` — confirm each has no video-side importer first). Can land any time after M0; touches nothing the pipeline depends on.

---

## 4. Explicitly not in this plan

Multi-agent review, LLM-judges-LLM, vision QA, orchestration frameworks/queues, OpenAI structured-outputs refactor of `slots`, personalisation/i18n/creator-portal capture, fine-tuning datasets, Player (R1) integration, more than two new mid-scenes, more than two reference videos. All unchanged from July §4 with the same reasoning.

---

## 5. Decisions (answered 2026-09-10)

| # | Question | Decision |
|---|---|---|
| D1 | TTS provider | **ElevenLabs.** Chosen over OpenAI TTS because narration is a critical path and ElevenLabs returns word timings. Cost control is acknowledged but is not a current priority; the M1 narration-hash cache is the only cost measure in scope. Requires an `ELEVENLABS_API_KEY` Cloud Agent secret. Provider stays swappable behind `TTSManifest`. |
| D2 | `KnoSlides/` | **Backlogged, out of scope.** It lives here because of an earlier assumption that slides and videos would share components; that overlap has not materialised. Plan: the owner snapshots the current state locally, then `KnoSlides/`, the two slides views in `admin/App.jsx`, and the root dependencies that exist only for it are removed from this repo (tracked in `RETAIN_ARTIFACTS.md` §2, §3, §6). Timing: any point after M0; it does not block pipeline work. |
| D3 | Canon compositions (Knodovia/TikTok) | **Keep as-is until a pipeline-created video is judged satisfactory (M4 acceptance), then convert to JSON under `GenericVideoPlayer`.** Not before. |
| D4 | Formats | **Desktop only** for this plan. Mobile is added later as new guardrail fixtures on the same approach; no design decision in M2 may assume desktop-only geometry constants are permanent (read them from `getViewportPadding` / `resolveSceneSlots`). |
| D5 | `docs/reference-llm-guide.md` | It was the first attempt at orienting an LLM in the repo. **It stays only if it has one clear purpose, and it is uplifted to serve that purpose.** M3 defines that purpose as: the human- and agent-readable authoring guide *generated from* the same manifest + example fixtures the pipeline consumes, so it can never disagree with them. If M3 finds no reader that the manifest and examples don't already serve, it is retired. `docs/instructions-llm-guide.md` is retired in M3 regardless (its content is the Stage 7 system prompt). |
| D6 | `Archive/` | **Lives on for now.** Removal happens in a dedicated archiving activity after this plan's milestones, not opportunistically. Status in `RETAIN_ARTIFACTS.md` is `KEEP (until archiving activity)`. |

Backlog items created by these decisions (not scheduled): TTS cost controls (per-job budget, voice/model tiering); KnoSlides as a separate product; mobile guardrail fixtures; interactive formats (quizzes, slides) as future output types.

---

## 6. Working rules for this plan

- One PR per numbered item where practical; each PR links the milestone and item.
- Every PR that touches a directory adds or updates rows in `RETAIN_ARTIFACTS.md` for the files it confirmed live, dead, or shimmed. No separate "cleanup phase" is planned; the list is the cleanup.
- Nothing is removed until its row says `REMOVE` with evidence and the replacement is on `main`.
- `pipeline_build.md` is updated in the same PR that changes behaviour it describes.
- `npm test` in `knomotion-pipeline/` must stay green; every new rule or guardrail ships with a broken fixture that proves it fires.

*End of September development plan.*
