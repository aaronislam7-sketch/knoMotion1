# KnoMotion Next Sessions

> A session-sized roadmap for moving from source content to deterministic, high-quality video while keeping the engine understandable and maintainable.
>
> Created: 2026-07-20

## How to use this list

- Treat each numbered checkbox as one focused development session and one reviewable change.
- Complete the items in order unless a dependency or new evidence changes the priority.
- Update this file at the end of each session with the outcome, validation evidence, and links to any replacement documentation.
- Do not execute old plans such as `auditPlan.md` or `deletion-plan.md` without re-verifying their claims against the current branch.
- A task is not complete because JSON validates. Visual work requires render evidence from both desktop and mobile where applicable.

## Direction and guardrails

The target is:

```text
source content
  -> structured, inspectable pipeline artifacts
  -> valid and semantically correct scene JSON
  -> deterministic audio/visual assembly
  -> quality-gated MP4
```

Principles:

1. **Rendered quality is the acceptance gate.** Schema validity is necessary but not sufficient.
2. **Measure before expanding.** Add a mid-scene only when benchmark outputs show a recurring learning or visual pattern that the existing 11 cannot express well.
3. **Keep the boundary clean.** `KnoMotion-Videos/` stays browser-safe; `knomotion-pipeline/` stays Node-only. Renderer capability data may flow to the pipeline, never pipeline runtime code into the renderer.
4. **Prefer deterministic checks.** Use LLM or vision judgement only for quality decisions that cannot be made reliably with code.
5. **Preserve personalisation options.** Avoid decisions that collapse useful content, pacing, format, learner, or brand variation into one static output.
6. **Clean up only from evidence.** Imports, runtime entry points, tests, Studio usage, and external consumers must be checked before deleting code.

## Recommended first focus

Start with **Session 01: pipeline-to-Studio preview**. It shortens the feedback loop for every later quality task and gives developers a consistent way to inspect generated output. Follow it with a fixed quality benchmark before changing validation or engine behaviour.

---

## Track A — Make quality observable and enforceable

### [ ] Session 01 — Add pipeline-to-Remotion Studio preview

**Goal:** Preview any generated `KnoMotionVideoConfig` without copying props manually.

**Deliverable:**
- Add the pipeline preview composition/harness using `GenericVideoPlayer`.
- Add a CLI command or documented command that opens a selected job/video config in Studio.
- Keep normal `KnoMotionVideo` rendering unchanged.

**Done when:**
- A mock pipeline job can be opened in Studio by job/video identifier.
- Desktop and mobile configs load.
- Invalid or missing job/config paths produce useful errors.
- Remotion bundle and composition checks pass.

### [ ] Session 02 — Establish the visual quality benchmark

**Goal:** Create a stable baseline against which pipeline and engine changes can be judged.

**Deliverable:**
- Select representative configs covering all 11 mid-scenes, all layouts, desktop/mobile, short/long text, and key beat patterns.
- Render stills at entrance, settled, emphasis, and exit points.
- Record current failures and define a concise acceptance rubric for visibility, legibility, completeness, timing, contrast, overflow, and visual variety.

**Done when:**
- Benchmark inputs and expected checkpoints are versioned.
- Current failures are reproducible.
- Quality criteria are objective where possible and clearly marked subjective where not.

### [ ] Session 03 — Populate `QualityReport` with render evidence

**Goal:** Introduce render-in-the-loop QA after structural validation.

**Deliverable:**
- Render deterministic stills at selected frames for every scene.
- Save frame paths, render metadata, and check results into `QualityReport.json`.
- Record render failures as blocking quality issues.

**Done when:**
- The mock pipeline produces a quality report and stills.
- Artifacts are linked in `job.json`.
- Failed still rendering cannot be reported as a passed job.

### [ ] Session 04 — Add deterministic visual quality checks

**Goal:** Automatically catch obvious visual failures without paying for a vision model.

**Deliverable:**
- Detect near-empty/blank frames and unexpectedly empty regions.
- Add text overflow or out-of-bounds detection where measurable.
- Define thresholds from the benchmark rather than arbitrary single examples.

**Done when:**
- Known blank-slot and invisible-text fixtures fail.
- Valid sparse scenes do not produce unacceptable false positives.
- Results use exact scene/frame paths and can enter the repair workflow.

### [ ] Session 05 — Make layout and slot handling semantics-safe

**Goal:** Stop syntactic coercion from silently creating blank scenes.

**Deliverable:**
- Audit all scene-config coercions.
- Retain harmless shape/key normalization.
- Reject or fully reconcile layout changes that invalidate slot names, especially `sideBySide`/`columnSplit` to `full`.
- Make missing required slots and unfilled content slots blocking errors.

**Done when:**
- Every accepted slot resolves in the selected layout.
- Regression tests cover current layout/slot mismatch failures.
- Repair receives semantic errors instead of cosmetically valid JSON.

### [ ] Session 06 — Enforce readable beat timing

**Goal:** Ensure visible content appears long enough to be understood.

**Deliverable:**
- Validate scene-level and item-level beats against duration.
- Enforce minimum readable visibility, late-start, early-exit, and near-zero-window rules.
- Require appropriate per-item/per-line timing where a mid-scene needs it.
- Scale warnings or limits by text length where practical.

**Done when:**
- Known flashing, premature-exit, and after-scene fixtures fail.
- Reasonable short and long scenes pass.
- Repair prompts receive exact timing paths and constraints.

### [ ] Session 07 — Fix invisible or inconsistent engine behaviour

**Goal:** Resolve the confirmed renderer defects that directly reduce output quality.

**Deliverable:**
- Fix TD-002 mask direction handling.
- Fix TD-001 `heroText` position contract across renderer, component, and schema.
- Fix TD-003 theme color resolution in `bigNumber` and `animatedCounter`, then reconcile schemas and guides.

**Done when:**
- Each defect has a focused regression test or render fixture.
- Desktop and mobile render checks pass.
- `TECH_DEBT.md` records the resolution.

### [ ] Session 08 — Add text measurement and fitting

**Goal:** Prevent wrapping, clipping, and unreadably oversized content.

**Deliverable:**
- Integrate the exact repository-compatible `@remotion/layout-utils` version.
- Apply fitting to `textReveal`, `checklist`, and `bigNumber`.
- Define minimum font sizes and fail or warn when content cannot fit legibly.

**Done when:**
- Benchmark overflow cases fit or fail clearly.
- `charByChar` multiline behaviour is visually checked.
- Desktop/mobile output remains deterministic.

### [ ] Session 09 — Reconcile and automate renderer contracts

**Goal:** Make accepted JSON match what the renderer can actually display.

**Deliverable:**
- Audit Zod config, 11 mid-scene schemas, `SceneRenderer`, registry, capability manifest, and pipeline mirror.
- Resolve aliases that validate but render nothing.
- Generate or mechanically verify the capability manifest from canonical sources.
- Add a CI/test drift check.

**Done when:**
- Every accepted mid-scene key renders.
- Pipeline-valid configs are renderer-valid.
- Manifest drift fails automatically.

### [ ] Session 10 — Audit mid-scene adequacy using real outputs

**Goal:** Decide whether the existing 11 mid-scenes can produce sufficient instructional and visual variety.

**Deliverable:**
- Map benchmark learning patterns to current mid-scenes.
- Measure overuse, awkward configuration, missing content structures, and mobile limitations.
- Rank gaps by learning value, frequency, quality impact, schema simplicity, and render cost.

**Done when:**
- The audit recommends either no additions or a ranked, evidence-backed shortlist.
- Each proposed addition has a distinct flat content contract and is not merely a style variant.

### [ ] Session 11 — Implement one approved priority mid-scene

**Goal:** Add the highest-value pattern selected in Session 10.

**Deliverable:**
- One component, JSON schema, registry entry, `SceneRenderer` entry, capability entry, pipeline contract support, examples, and tests.
- Repeat this session item separately for later approved mid-scenes; do not batch multiple new contracts.

**Done when:**
- Valid examples render in desktop and mobile.
- Invalid examples fail at exact paths.
- The benchmark demonstrates a material quality or variety gain.

---

## Track B — Complete the deterministic pipeline

### [ ] Session 12 — Adopt structured outputs for planning stages

**Goal:** Reduce model drift before scene compilation.

**Deliverable:**
- Use provider-supported JSON Schema structured output for content analysis, module planning, video planning, and script generation.
- Preserve provider abstraction and actionable fallback errors.
- Leave dynamic scene slot output on the current path until its contract supports strict output safely.

**Done when:**
- Planning artifacts require fewer parse retries/coercions.
- Mock and OpenAI tests pass.
- Provider/model limitations are documented.

### [ ] Session 13 — Implement Stage 8 TTS

**Goal:** Turn narration scripts into deterministic, reusable audio artifacts.

**Deliverable:**
- Define a provider interface, one production adapter, and a deterministic test adapter.
- Persist audio, duration, word timestamps when available, provenance, and cost metadata.
- Add caching keyed by normalized script, voice, model, and settings.

**Done when:**
- Re-running identical input reuses the artifact.
- Provider failures are recoverable and auditable.
- Secrets never enter artifacts or logs.

**Decision needed:** production TTS provider, approved voices, and target cost/quality envelope.

### [ ] Session 14 — Implement Stage 9 caption normalization

**Goal:** Produce renderer-ready word captions independently of provider quirks.

**Deliverable:**
- Normalize TTS timestamps into the caption contract.
- Handle punctuation, token joins, missing timestamps, and scene boundaries.
- Add deterministic fixtures.

**Done when:**
- Captions validate and render in all three supported styles.
- Word order and timing remain monotonic.

### [ ] Session 15 — Implement Stage 10 beat alignment

**Goal:** Derive visual timing from narration rather than asking the LLM to guess final timings.

**Deliverable:**
- Align captions/scripts to scene and per-item beats using the existing engine utility where suitable.
- Respect readable-duration rules from Session 06.
- Persist alignment decisions and warnings.

**Done when:**
- Spoken concepts and visual emphasis align in benchmark scenes.
- Output is deterministic for the same timestamps and config.

### [ ] Session 16 — Implement Stage 11 assembly

**Goal:** Combine validated visuals, audio, captions, and aligned beats into final render props.

**Deliverable:**
- Build renderer-ready props from prior artifacts without LLM calls.
- Verify asset URLs/paths and duration consistency.
- Revalidate the assembled config against renderer contracts.

**Done when:**
- Assembly is deterministic and replayable.
- Missing or inconsistent assets block rendering with precise errors.

### [ ] Session 17 — Implement Stage 12 rendering

**Goal:** Produce the final MP4 and render manifest.

**Deliverable:**
- Bundle/select `KnoMotionVideo`, render with controlled codec/settings, and capture progress/errors.
- Record output checksum, dimensions, duration, settings, and source artifact IDs.
- Make local output storage replaceable by a future remote adapter.

**Done when:**
- A mock-provider source runs from text to MP4.
- A failed render can be retried without rerunning successful upstream stages.

### [ ] Session 18 — Add resume, replay, and idempotency

**Goal:** Make expensive jobs operable and safe to retry.

**Deliverable:**
- Implement `--resume`, `--from`, and artifact compatibility checks.
- Define invalidation rules when prompts, models, schemas, or source inputs change.
- Avoid duplicate external calls after successful artifacts exist.

**Done when:**
- Interrupted jobs resume from the correct boundary.
- Stale artifacts are rejected with an explanation.

### [ ] Session 19 — Add end-to-end production acceptance

**Goal:** Define one trustworthy gate for “content in, quality video out.”

**Deliverable:**
- Exercise mock and one production-provider path.
- Gate on contracts, quality report, audio/caption alignment, render success, and artifact completeness.
- Capture runtime and provider cost telemetry without making nondeterministic assertions.

**Done when:**
- A single documented command proves the complete flow.
- CI runs the deterministic subset.
- Production smoke testing is explicit and opt-in.

---

## Track C — Audit and remove repository fluff safely

### [ ] Session 20 — Map the active runtime architecture

**Goal:** Establish what is fundamental before classifying anything as fluff.

**Deliverable:**
- Trace root app, Remotion entry, Studio compositions, generic renderer, pipeline CLI, schemas, assets, and KnoSlides boundaries.
- Produce an import/entry-point map and identify externally exposed APIs.
- Classify each top-level directory as core, supporting, example/canon, historical, generated, or unknown.

**Done when:**
- Every active entry point and package boundary has an owner and purpose.
- Unknown items remain explicitly unresolved rather than assumed dead.

### [ ] Session 21 — Audit code, dependencies, tests, and tooling

**Goal:** Revalidate old cleanup claims against current code.

**Deliverable:**
- Identify unreachable code, duplicate implementations, re-export shims, unused dependencies, manual tests, and unreferenced admin tools.
- Include dynamic imports, Remotion registration, scripts, and external-consumer risk.
- Mark candidates by confidence and migration requirement.

**Done when:**
- Every deletion candidate has reproducible evidence.
- Essential Studio preview and rendering paths are protected.

### [ ] Session 22 — Audit documentation and historical artifacts

**Goal:** Separate current guidance from stale or historical narrative.

**Deliverable:**
- Inventory Markdown, examples, plans, audit reports, generated outputs, and `Archive/`.
- Classify each as canonical, supporting, historical, superseded, or misleading.
- Identify contradictions and the document that should replace each stale source.

**Done when:**
- Agents can distinguish current truth from historical context.
- No files are deleted during this audit session.

### [ ] Session 23 — Approve the cleanup plan

**Goal:** Turn audit evidence into explicit, reversible decisions.

**Deliverable:**
- Create a deletion/migration plan grouped into safe deletion, migration first, archive/product decision, and keep.
- Record package-boundary and canon/showcase decisions.
- Define build, test, Studio, and render checks for every cleanup batch.

**Done when:**
- Product decisions are confirmed before destructive changes.
- Each cleanup batch has rollback and validation criteria.

**Decisions needed:** treatment of `Archive/`, KnoSlides ownership, and whether canon compositions remain active references.

### [ ] Session 24 — Execute approved code and dependency cleanup

**Goal:** Remove verified dead code and dependencies without changing product behaviour.

**Deliverable:**
- Apply only the approved safe/migrate-first batch.
- Update imports, package manifests, scripts, and tests.
- Record removed compatibility surfaces.

**Done when:**
- Root and pipeline checks pass.
- Remotion Studio, bundle, compositions, benchmark stills, and one MP4 render pass.

### [ ] Session 25 — Execute approved documentation/archive cleanup

**Goal:** Remove misleading navigation and historical clutter while preserving useful history.

**Deliverable:**
- Apply the approved archive/delete/move decisions.
- Replace stale inbound links.
- Keep Git history as the recovery mechanism unless another archive location was approved.

**Done when:**
- No canonical document links to deleted material.
- A repository-wide link check passes.

---

## Track D — Build the canonical knowledge suite

### [ ] Session 26 — Define documentation information architecture

**Goal:** Establish a small, explicit source-of-truth set before rewriting documents.

**Deliverable:**
- Define document names, audiences, ownership, scope, and update triggers.
- Add a documentation index and precedence rules.
- Map existing useful content into the new structure.

**Done when:**
- Every core concept has exactly one canonical home.
- Historical/status documents cannot override current contracts.

### [ ] Session 27 — Write the business and product context guide

**Goal:** Explain why KnoMotion exists and what differentiates it.

**Deliverable:**
- Cover the learning-video problem, content-in/video-out proposition, personalisation USP, quality expectations, cost sensitivity, and non-goals.
- Clearly separate current capabilities from end-state vision.

**Done when:**
- A new developer can explain the customer value and major product trade-offs without reading implementation files.

### [ ] Session 28 — Write the core engine guide

**Goal:** Teach the current renderer architecture from JSON to pixels.

**Deliverable:**
- Cover composition, `SceneRenderer`, layouts/slots, mid-scenes, SDK elements, beats, themes, transitions, audio/captions, schemas, capabilities, and Studio.
- Include extension checklists and common failure modes.

**Done when:**
- Examples validate against current contracts.
- Every referenced path and capability is verified against code.

### [ ] Session 29 — Write the pipeline guide

**Goal:** Teach the compiler workflow and operational model.

**Deliverable:**
- Cover stages, artifacts, metadata, provider boundaries, fan-out, validation/repair, quality reports, resume/replay, CLI usage, and failure handling.
- Include local mock and production-provider walkthroughs.

**Done when:**
- A developer can trace any output back to its inputs and stage decisions.

### [ ] Session 30 — Write the quality and testing playbook

**Goal:** Make visual quality repeatable rather than subjective handoff knowledge.

**Deliverable:**
- Document benchmark fixtures, structural/semantic/visual checks, Studio review, still/clip inspection, desktop/mobile coverage, and acceptance gates.
- Define when deterministic checks, human review, and optional vision review apply.

**Done when:**
- Every visual change has a clear minimum evidence standard.

### [ ] Session 31 — Write agent and contributor onboarding

**Goal:** Let agents and developers work safely without reading historical plans.

**Deliverable:**
- Add setup, package boundaries, canonical commands, dependency-version rules, change checklists, documentation precedence, and task handoff format.
- Explain how to choose between engine, pipeline, schema, and documentation changes.

**Done when:**
- A fresh environment can run the documented checks without hidden steps.

### [ ] Session 32 — Refresh the root README and documentation index

**Goal:** Make the repository landing page accurately represent the business and implementation.

**Deliverable:**
- Update the README with current product framing, architecture, pipeline status, quick starts, and links to the canonical suite.
- Remove stale counts, transitions, composition instructions, and roadmap claims.

**Done when:**
- The README is concise, accurate, and routes readers to detail rather than duplicating it.

### [ ] Session 33 — Add documentation drift checks

**Goal:** Keep the new suite trustworthy.

**Deliverable:**
- Check internal links, referenced paths, mid-scene counts/keys, schema examples, command validity, and generated capability sections where practical.
- Add the checks to the normal validation workflow.

**Done when:**
- Known stale-count and broken-link fixtures fail automatically.

---

## Deferred track — Personalisation and cost

These sessions are intentionally not part of the immediate implementation sequence. Earlier architecture work must preserve their feasibility.

### [ ] Future Session P1 — Define the personalisation product contract

**Goal:** Decide which aspects of content may vary by learner and which must remain instructionally stable.

**Topics:** prior knowledge, goals, role/context, examples, language, accessibility, pace, format, assessment evidence, brand, and consent/privacy.

### [ ] Future Session P2 — Design cost-aware personalisation architecture

**Goal:** Maximize perceived individual relevance without regenerating every artifact for every learner.

**Topics:** reusable content modules, late-binding variables, scene variants, cache keys, cohort-level generation, deterministic assembly, TTS reuse, asset reuse, model routing, quality gates, and cost telemetry.

### [ ] Future Session P3 — Build and evaluate one personalisation slice

**Goal:** Prove measurable learner value and acceptable marginal cost with one constrained use case before generalizing.

---

## Decisions to capture as work progresses

- Target output formats and minimum quality bar for each.
- Whether optional vision QA is permitted, and its privacy/cost budget.
- Production LLM and TTS providers, fallback policy, and cost ceilings.
- Canon/showcase role after the generic pipeline is complete.
- Archive and KnoSlides ownership.
- Personalisation dimensions that create learner value versus superficial variation.
