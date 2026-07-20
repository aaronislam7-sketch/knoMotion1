# KnoMotion Next Sessions

> A consolidated, outcome-led roadmap for reaching “content in, deterministic quality video out”.
>
> Updated: 2026-07-20

## How to use this list

- Each numbered item is one focused session.
- Work in order unless evidence from testing changes the priority.
- Update this file with the outcome and validation evidence after each session.
- Test visual changes directly in Remotion Studio and through representative pipeline output.
- Do not execute old audit or deletion plans without re-verifying their claims against the current implementation.

## Value test

Engine work must achieve at least one of these outcomes:

1. **More useful video functionality** — a visible capability that improves how learning content can be presented.
2. **A simpler authoring model** — fewer concepts, choices, exceptions, or failure modes for users and pipeline-invoked LLMs.

Work should not proceed when its main benefit is theoretical completeness, additional enforcement, or automation without a proportionate improvement to output or usability.

Structural validation remains useful for preventing configurations that cannot render. It should support the authoring experience, not become a second product.

## Current direction

```text
source content
  -> structured planning and script
  -> LLM chooses from a clear visual capability menu
  -> simple scene configuration
  -> deterministic audio and assembly
  -> tester previews and approves
  -> MP4
```

The immediate visual feedback loop is Remotion Studio plus human review. Automated screenshot capture, vision review, pixel-level visual scoring, and similar QA infrastructure are not current priorities.

## Recommended first focus

Start with **Session 01: pipeline-to-Studio preview**. It makes pipeline output easy to inspect without introducing a new QA system. Then simplify the two areas most likely to confuse the LLM and produce broken visuals: layouts/slots and beats.

---

## Track A — Improve output capability and simplify the engine

### [ ] Session 01 — Add a pipeline-to-Studio preview workflow

**Outcome:** A tester can open generated pipeline output in Remotion Studio with one clear command.

**Why it is valuable:**
- Shortens the feedback loop for every engine and pipeline change.
- Keeps visual judgement with the tester.
- Removes manual prop copying and path discovery.

**Scope:**
- Add an additive preview entry or composition that loads a selected generated config.
- Add a CLI command or documented invocation using job and video identifiers.
- Support desktop and mobile.
- Preserve the existing `KnoMotionVideo` composition and normal render path.

**Done when:**
- A mock pipeline run can be opened in Studio without editing source files.
- Missing jobs, videos, or invalid configs produce useful errors.
- The Remotion bundle and composition checks pass.

### [ ] Session 02 — Simplify layouts and content placement

**Outcome:** A user or LLM can choose a scene arrangement and place content without understanding fragile slot-name rules.

**Why it is valuable:**
- Layout/slot mismatch is a direct cause of blank scenes.
- A smaller, clearer choice set improves generation quality more than adding repair rules.
- Compatibility can remain internal while the public authoring model becomes simpler.

**Scope:**
- Review the five current layouts against real desktop/mobile output and pipeline usage.
- Define the smallest useful public layout vocabulary.
- Remove redundant choices or present them as simple aliases/presets.
- Make content placement predictable; where possible derive slot names from the layout rather than asking the LLM to invent them.
- Add a compatibility adapter if the renderer needs to retain its existing internal shape.
- Update schemas, capability data, examples, prompts, and pipeline types together.

**Done when:**
- Representative single-area, stacked, comparison, and grid scenes are straightforward to express.
- The same public model adapts predictably to mobile.
- Old supported configs either continue to work or have a documented migration.
- A tester confirms representative scenes in Studio.

### [ ] Session 03 — Simplify beats and timing ownership

**Outcome:** The LLM describes narrative order and emphasis without having to calculate fragile timestamps for every visible element.

**Why it is valuable:**
- Poor beat values are a primary cause of missing or flashing content.
- Deterministic defaults reduce prompt complexity and token usage.
- Timing remains configurable when a scene genuinely needs precise choreography.

**Scope:**
- Identify which beats should be authored, derived, defaulted, or aligned later from narration.
- Introduce simple timing presets or sequence semantics for common cases.
- Let mid-scenes generate safe entrance, hold, stagger, and exit timings from scene duration.
- Preserve explicit beat overrides for advanced use.
- Reconcile the model with Stage 10 narration alignment.

**Done when:**
- Common scenes require little or no per-item timestamp generation.
- Content remains visible for a sensible reading window by default.
- Explicit timing still supports advanced choreography.
- Existing representative scenes migrate cleanly and render correctly.

### [ ] Session 04 — Fix visible engine defects and text fitting

**Outcome:** Existing capabilities render reliably and handle realistic content lengths.

**Why it is valuable:**
- Directly fixes invisible, misplaced, low-contrast, wrapped, and overflowing content.
- Improves every future pipeline run without adding authoring concepts.

**Scope:**
- Fix TD-002 mask direction handling.
- Fix TD-001 `heroText` positioning consistently across component, renderer, and schema.
- Fix TD-003 theme colors in `bigNumber` and `animatedCounter`.
- Add layout-aware text measurement/fitting to the highest-impact text mid-scenes.
- Set sensible minimum sizes and truncation/failure behaviour when content cannot fit.
- Reconcile schemas and reference examples after implementation.

**Done when:**
- The known defects no longer reproduce in Studio.
- Long and multiline content remains legible in desktop and mobile examples.
- Existing short-content scenes do not regress.
- Resolved items are updated in `TECH_DEBT.md`.

### [ ] Session 05 — Expand the visual capability menu where it adds clear value

**Outcome:** The pipeline gains one or two high-value ways to display learning content that the existing 11 mid-scenes cannot express well.

**Why it is valuable:**
- Increases visual and instructional variety.
- Reduces misuse of generic text/checklist scenes for unsuitable content.
- Gives the LLM clear purpose-built choices instead of more styling permutations.

**Scope:**
- Use representative learning content and current pipeline output to identify the most frequent capability gaps.
- Prefer distinct content structures such as timeline/progression, process/flow, quote/evidence, or before/after—not cosmetic variants.
- Select only the highest-value addition or tightly related pair that fits the session.
- Implement the component, flat schema, registry/renderer entry, capability data, pipeline support, examples, and documentation together.
- Do not expand the library if existing mid-scenes can express the need cleanly after Sessions 02–04.

**Done when:**
- The new capability has a clear “use when / do not use when” description.
- The LLM can select it from a concise capability menu.
- Desktop and mobile examples render correctly in Studio.
- The addition demonstrably replaces an awkward or repetitive existing pattern.

### [ ] Session 06 — Simplify scene generation for the pipeline LLM

**Outcome:** The scene compiler receives a concise, accurate menu of visual choices and produces useful configs with less repair.

**Why it is valuable:**
- Converts engine improvements into better pipeline output.
- Reduces model improvisation, prompt size, and corrective retries.
- Keeps optionality while making valid choices easier than invalid ones.

**Scope:**
- Rework the scene-generation prompt around the simplified layout and timing models.
- Provide a small set of complete examples showing when and how to use each common mid-scene.
- Make capability descriptions task-oriented rather than exposing raw implementation detail.
- Reconcile renderer schemas, pipeline schema, capability manifest, and canonical keys.
- Use structured output where it simplifies generation without forcing a more complex renderer contract.
- Keep deterministic validation focused on render-breaking shapes, unsupported capabilities, and impossible references.

**Done when:**
- Representative sources generate visibly complete and varied scenes with the mock and production LLM paths.
- Fewer schema coercions and repair attempts are needed.
- Every option offered to the LLM is supported by the renderer.
- A tester can understand why each generated scene chose its layout and mid-scene.

---

## Track B — Complete the deterministic pipeline

### [ ] Session 07 — Complete the narration-to-assembly path

**Outcome:** A narration script becomes reusable audio, captions, aligned visuals, and final render props.

**Why it is valuable:**
- Delivers the missing audio half of the product.
- Makes visual timing derive from spoken content.
- Caching limits repeated provider cost.

**Scope:**
- Implement Stage 8 TTS behind a provider interface with one production adapter and deterministic test adapter.
- Persist audio, duration, timestamps, provenance, settings, and cost metadata.
- Cache identical script/voice/model requests.
- Implement Stage 9 caption normalization.
- Implement Stage 10 beat alignment using the simplified timing model from Session 03.
- Implement Stage 11 deterministic assembly and final contract validation.

**Done when:**
- A script produces assembled renderer props with narration and captions.
- Repeated identical TTS input reuses the existing artifact.
- Caption and beat timing is monotonic and visibly aligned in Studio.
- Provider failures are resumable and secrets never enter logs or artifacts.

**Decision required before starting:** production TTS provider, approved voices, and acceptable cost/quality range.

### [ ] Session 08 — Complete render, resume, and end-to-end operation

**Outcome:** Source content can run through the complete pipeline to an MP4 without repeating successful expensive work.

**Why it is valuable:**
- Completes the core business workflow.
- Makes failed or interrupted jobs practical to operate.
- Produces auditable outputs without adding a separate orchestration product.

**Scope:**
- Implement Stage 12 Remotion rendering and `RenderManifest`.
- Add `--resume` and `--from` using validated artifacts.
- Define straightforward invalidation rules for changed source, models, prompts, schemas, or settings.
- Record output checksum, dimensions, duration, render settings, and source artifact IDs.
- Run end-to-end human UAT on representative desktop and mobile content.
- Fix only material blockers or confusing workflow discovered during UAT.

**Done when:**
- One documented command runs mock source to MP4.
- One opt-in production-provider run completes.
- Failed rendering can resume without rerunning successful LLM or TTS stages.
- A tester approves representative output in Studio and as rendered MP4.

---

## Track C — Clarify and simplify the repository

### [ ] Session 09 — Audit the active implementation and remove verified fluff

**Outcome:** The repository clearly separates the live engine/pipeline from examples, historical material, and dead code.

**Why it is valuable:**
- Reduces setup and comprehension cost for every future session.
- Prevents agents from following stale plans or changing inactive systems.
- Removes maintenance burden without speculative architecture work.

**Scope:**
- Trace active app, Remotion/Studio entries, generic renderer, pipeline CLI, schemas, assets, tests, and package boundaries.
- Revalidate prior `auditPlan.md` and `deletion-plan.md` findings.
- Classify top-level directories and significant documents as core, supporting, example/canon, historical, generated, or unresolved.
- Remove only high-confidence dead code, dependencies, duplicate files, and misleading documents.
- Produce a short decision list for ambiguous product-owned items such as `Archive/`, KnoSlides, and canon compositions rather than deleting them.
- Run root, pipeline, Studio, bundle, composition, and representative render checks.

**Done when:**
- Every retained top-level area has a clear purpose.
- High-confidence fluff is removed with evidence.
- Ambiguous items have an explicit owner/decision request.
- All active preview and render paths continue to work.

### [ ] Session 10 — Create the canonical documentation suite

**Outcome:** Agents and developers can understand the business, engine, pipeline, testing workflow, and current status without reading historical plans.

**Why it is valuable:**
- Reduces repeated orientation sessions and incorrect assumptions.
- Makes future implementation cheaper and safer.
- Connects technical choices to the personalisation-led business model.

**Scope:**
- Create a concise documentation index and precedence rule.
- Consolidate the canonical suite:
  - business and product context;
  - current engine architecture and extension guide;
  - scene-authoring capability guide for people and LLMs;
  - pipeline architecture and operation guide;
  - Studio/UAT and testing guide;
  - agent/developer setup and contribution guide.
- Refresh the root README as the business-oriented landing page.
- Replace or clearly mark superseded status, audit, SDK, and architecture documents.
- Verify every command, path, capability count, and example against the implementation.

**Done when:**
- A new contributor can explain the product value and run the system from source to preview.
- Each concept has one canonical home.
- The README routes readers to detail instead of duplicating it.
- Historical documents cannot be mistaken for current instructions.

---

## Deferred — Personalisation and cost

Personalisation is not part of the immediate ten-session sequence, but current changes must preserve it as a first-class capability.

Future work should:

- Define which learner attributes can alter examples, explanation depth, language, pace, modality, assessment, and visual treatment.
- Separate reusable shared artifacts from learner-specific late-bound choices.
- Reuse plans, scene variants, assets, narration, and renders where they remain instructionally appropriate.
- Measure marginal generation cost against learner value.
- Prove one constrained personalisation use case before generalising the architecture.

Avoid near-term decisions that hard-code one static script, scene sequence, format, or visual treatment as the only supported output.

## Decisions to capture when relevant

- Minimum acceptable output quality for desktop and mobile.
- Production LLM and TTS providers and cost ceilings.
- Which new content structures deserve dedicated mid-scenes.
- Whether canon/showcase compositions remain active references.
- Ownership and treatment of `Archive/` and KnoSlides.
- Which personalisation dimensions provide genuine learner value rather than superficial variation.
