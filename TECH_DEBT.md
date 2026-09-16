# KnoMotion Tech Debt Register

> Curated, pre-investigated tech-debt items so a fresh agent can go straight to the fix.
> Each item is self-contained: exact files, evidence, impact, recommended fix, and acceptance criteria.
> Line numbers are approximate (code shifts) — search the quoted symbols/strings to locate.
>
> **Status 2026-09-16 (Sept M2):** TD-001, 002, 003, 004(a), 006 and 009 are RESOLVED (marked in place, acceptance criteria kept as regression notes). Open: TD-004b (alias normalisation, optional), TD-005 (manifest generation → M3), TD-007 (codeBlock deep-dive), TD-008 (env setup).

**Source of these findings:** a full audit of the 11 mid-scene components against their JSON Schemas, the capability manifest, and `docs/reference-llm-guide.md`, performed while building the KnoMotion pipeline. The schema/manifest reconciliation itself is already done (see PRs #61/#62). The items below are the things deliberately **left untouched** because they need engine-logic changes or product intent — not just schema edits.

**How to use this file:** pick an item, confirm the evidence still holds, implement the fix, satisfy the acceptance criteria, then delete the item (or mark `RESOLVED` with the PR link). Keep entries tight — problem + analysis only, no speculation.

---

## Conventions

- **Canonical mid-scene keys (11):** `textReveal, heroText, gridCards, checklist, bubbleCallout, sideBySide, iconGrid, cardSequence, bigNumber, animatedCounter, codeBlock`. These are the only keys `SceneRenderer` resolves. See TD-004.
- **Do not** change educational/visual behaviour without a render check (`npx remotion studio KnoMotion-Videos/src/remotion/index.ts`, composition `KnoMotionVideo`).
- Engine code is browser-safe React in `KnoMotion-Videos/`. The pipeline (`knomotion-pipeline/`) is Node-only and must not be imported by the engine.

---

## TD-001 — `heroText` position contract is inconsistent (schema vs renderer vs layout engine)

> **RESOLVED — Sept M2 (2026-09-16), branch `cursor/m2-guardrails-b054`.** `HeroTextEntranceExit.jsx` now treats `config.position` as the top-left `{ left, top, width, height }` slot area SceneRenderer injects (`positionToCSS(..., { useTopLeft: true })`) and centres its content with flexbox; `containerStyle` gains a `maxWidth` so text in a wide slot wraps instead of running edge to edge. `HeroTextEntranceExit.schema.json` `position` documents `left`/`top`. Verified on a rendered still (`heroText` centred, no `NaNpx`). Kept for the acceptance criteria.

**Severity:** Medium · **Area:** engine / layout · **Type:** correctness

**Files**
- `KnoMotion-Videos/src/sdk/mid-scenes/HeroTextEntranceExit.jsx` — reads `config.position` and calls `positionToCSS(position)`
- `KnoMotion-Videos/src/sdk/layout/layoutEngine.js` — `positionToCSS()` (~line 854)
- `KnoMotion-Videos/src/compositions/SceneRenderer.jsx` — injects `position` (lines ~51–62)
- `KnoMotion-Videos/src/sdk/mid-scenes/schemas/HeroTextEntranceExit.schema.json` — `position` documented as `{ x, y, width, height }`

**Problem (three-way mismatch)**
1. The **schema** describes `position` as center coords `{ x, y, width, height }`.
2. **SceneRenderer always overwrites** the slot's `position` with top-left coords:
   `position: { left: 0, top: 0, width: slot.width, height: slot.height }` — so any author-supplied `position` is discarded, and the injected shape is `left/top`, not `x/y`.
3. **`positionToCSS()`** interprets `position.x/position.y` as the element **center** (`left = position.x - width/2`) unless `useTopLeft: true` is passed. HeroText does not pass `useTopLeft`, so when it receives the injected `{ left, top, ... }` (no `x/y`), the center-based branch gets `undefined` coords.

Net effect: hero positioning is governed by accidental fallbacks rather than a defined contract; the schema misdescribes it.

**Recommended fix**
- Decide the canonical contract. Recommendation: standardise on **top-left** `{ left, top, width, height }` (matches what SceneRenderer injects for every other mid-scene). Make `HeroTextEntranceExit` call `positionToCSS(position, { useTopLeft: true })` (or stop calling it and use `left/top/width/height` directly like the other mid-scenes do).
- Update `HeroTextEntranceExit.schema.json` `position` to `{ left, top, width, height }`.

**Acceptance criteria**
- Hero renders correctly centred in its slot in both `desktop` and `mobile` formats in Studio.
- Schema `position` matches the shape SceneRenderer injects.
- No reliance on `undefined` coordinate fallbacks.

---

## TD-002 — `textReveal` `revealType: "mask"` with `direction: up`/`down` produces an empty clip-path

> **RESOLVED — Sept M2 (2026-09-16), branch `cursor/m2-guardrails-b054`.** `TextRevealSequence.jsx` maps slide directions to mask insets before calling `getMaskReveal` (`MASK_DIRECTION = { up: 'top', down: 'bottom' }`; `left`/`right`/`center` pass through). The `mask-up` fixture in `knomotion-pipeline/pipeline/__tests__/render-check.test.ts` renders visibly under Stage 9 render-check (`blank: false` in all three sampled frames). Manifest note for `textReveal.direction` updated.

**Severity:** Medium · **Area:** engine / animation · **Type:** correctness (invisible content)

**Files**
- `KnoMotion-Videos/src/sdk/mid-scenes/TextRevealSequence.jsx` — `getRevealAnimationStyle()` `mask` case (~lines 113–154) passes `direction` straight to the mask helper
- `KnoMotion-Videos/src/sdk/animations/index.js` — `getMaskReveal()` (~lines 642–660) supports `left | right | top | bottom | center`

**Problem**
The shared `direction` prop uses `up`/`down` for `slide`, but the mask helper only understands `top`/`bottom`/`center`/`left`/`right`. With `revealType: "mask"` + `direction: "up"` (or `"down"`), `getMaskReveal` returns an empty `clipPath`, so the **text never becomes visible** — a silently broken scene.

The schema/manifest now *document* this (PR #62), but the engine still mis-handles it.

**Recommended fix**
- In the `mask` path, map `up → top` and `down → bottom` before calling `getMaskReveal` (cheapest, preserves author intent), OR
- Have `getMaskReveal` accept `up`/`down` as aliases.

**Acceptance criteria**
- `revealType: "mask"` renders visible text for every value of `direction` in `up/down/left/right/top/bottom/center`.
- Add/keep a Studio test scene exercising `mask` + `up`.

---

## TD-003 — `bigNumber` and `animatedCounter` ignore theme color keys

> **RESOLVED — Sept M2 (2026-09-16), branch `cursor/m2-guardrails-b054`.** Both components resolve `color` through `KNODE_THEME.colors[color]` and fall back to the literal string, so `"primary"` and `"#ff6b35"` both work. The PR #62 interim `pattern` restriction was removed from `BigNumberReveal.schema.json` / `AnimatedCounter.schema.json`; manifest notes and `docs/reference-llm-guide.md` updated. `BigNumberReveal` also shrinks number and label to fit via `fitFontSize`.

**Severity:** Medium · **Area:** engine / theming · **Type:** consistency

**Files**
- `KnoMotion-Videos/src/sdk/mid-scenes/BigNumberReveal.jsx` — `emphasisColors` (~lines 163–168): uses `color` as a raw CSS value
- `KnoMotion-Videos/src/sdk/mid-scenes/AnimatedCounter.jsx` — `emphasisColors` (~lines 88–92): same; also a dead `normal` branch (see TD-006)
- Compare with the theme-key resolution other components use via `KNODE_THEME.colors[key]` (`KnoMotion-Videos/src/sdk/theme/knodeTheme.ts`)

**Problem**
Every other mid-scene resolves a color via `KNODE_THEME.colors[colorKey] ?? colorKey`, so `color: "primary"` works. These two pass `color` **straight to CSS**, so `color: "primary"` is an invalid CSS color and is ignored. This is inconsistent with the rest of the engine and with the "global theming for all colours" direction.

**Interim mitigation already shipped (PR #62):** the JSON schemas for these two restrict `color` to a literal CSS color (`hex`/`rgb`/`hsl`) and document that theme keys are not resolved.

**Recommended fix**
- Resolve `color` through the same theme lookup the other mid-scenes use (`KNODE_THEME.colors[color] ?? color`).
- After fixing, **relax the schema** `color` back to a free string (remove the `pattern` added in `BigNumberReveal.schema.json` / `AnimatedCounter.schema.json`) and update `capability-manifest.json` (`bigNumber.color` / `animatedCounter.color` notes) + `docs/reference-llm-guide.md` (the two `// CSS color only` comments).

**Acceptance criteria**
- `color: "primary"` (and other theme keys) render with the correct theme color in both components.
- Literal CSS colors still work.
- Schema/manifest/guide restrictions removed once the engine resolves theme keys.

---

## TD-004 — Renderer Zod schema accepts mid-scene alias keys that render nothing

> **RESOLVED — Sept M2 (2026-09-16), branch `cursor/m2-guardrails-b054`.** Option **(a)**: `MidSceneKeys` in `videoConfig.schema.ts` is the 11 canonical keys; `videoConfig.test.ts` asserts every canonical key parses and every registry alias is rejected. Manifest `knownIssues.midscene-aliases-not-resolved` is `status: resolved`. Option (b) (alias normalisation in `SceneRenderer`) was not done — `MID_SCENE_REGISTRY` aliases remain for JS callers only; if a public alias surface is ever wanted, that is the remaining half (TD-004b).

**Severity:** Medium · **Area:** engine / validation · **Type:** correctness (silent blank slots)

**Files**
- `KnoMotion-Videos/src/sdk/schemas/videoConfig.schema.ts` — `MidSceneKeys` enum (~lines 114–139) lists ~12 aliases (`textRevealSequence, heroTextEntranceExit, checklistReveal, bubbleCalloutSequence, callouts, sideBySideCompare, compare, gridCardReveal, cardGrid, bigNumberReveal, codeBlockScene, code`)
- `KnoMotion-Videos/src/compositions/SceneRenderer.jsx` — `MID_SCENE_COMPONENTS` (lines ~23–35) maps **only the 11 canonical keys**; resolution is a direct `MID_SCENE_COMPONENTS[midScene]` lookup (line ~44) with **no alias normalisation**
- `KnoMotion-Videos/src/sdk/mid-scenes/index.js` — `MID_SCENE_REGISTRY` maps alias→component-name, but `SceneRenderer` does not use it

**Problem**
A config using e.g. `midScene: "codeBlockScene"` (or `gridCardReveal`, `bigNumberReveal`, …) **passes Zod validation** but hits the "Unknown midScene" warning and renders `null` — a blank slot with no hard error. Validation advertises capability the renderer doesn't honour.

Documented in `capability-manifest.json` → `knownIssues: "midscene-aliases-not-resolved"`. The pipeline already restricts itself to the 11 canonical keys (PR #61), so this is purely an engine-consistency issue for anyone authoring against the renderer Zod schema directly.

**Recommended fix (pick one)**
- **(a) Tighten:** reduce `MidSceneKeys` in `videoConfig.schema.ts` to the 11 canonical keys. Simplest; rejects aliases at validation. Check no existing committed config/`defaultProps` uses an alias first (`Root.tsx`, `KnoMotion-Videos/`, sample configs).
- **(b) Normalise:** add an alias→canonical map in `SceneRenderer` (reuse `MID_SCENE_REGISTRY`) so aliases actually render.

Recommendation: **(a)** unless aliases are intentionally part of the public authoring surface.

**Acceptance criteria**
- Every key accepted by `VideoConfigSchema` resolves to a rendered component (option b), or invalid aliases are rejected at validation (option a).
- No "Unknown midScene" warning path reachable from a schema-valid config.

---

## TD-005 — Capability manifest is hand-maintained and drifts

**Severity:** Low/Medium · **Area:** tooling · **Type:** maintainability

**Files**
- `KnoMotion-Videos/src/sdk/capability-manifest.json` (hand-curated)
- Source of truth it should derive from: `KnoMotion-Videos/src/sdk/mid-scenes/schemas/*.json` + `KnoMotion-Videos/src/sdk/mid-scenes/index.js` registry + `SceneRenderer.jsx` `MID_SCENE_COMPONENTS`

**Problem**
The manifest had multiple wrong entries (e.g. `bubbleCallout` shapes/patterns, `cardSequence` `flipIn`, `sideBySide` modes) because it's maintained by hand, separate from the schemas. PR #62 corrected the current drift, but the structural problem remains: two sources of truth, no enforcement. `docs/ARCHITECTURE.md` already flags this as "S4a".

**Recommended fix**
- Add a generation script (e.g. `scripts/build-capability-manifest.mjs`) that derives the manifest's mid-scene capabilities (required fields, enum options) from the JSON schemas + registry, and the canonical key list from `SceneRenderer`'s `MID_SCENE_COMPONENTS`.
- Add a CI/check (or `npm run` target) that fails if the generated manifest differs from the committed one.

**Acceptance criteria**
- `capability-manifest.json` is generated, not hand-edited.
- A check detects drift between schemas and manifest.

---

## TD-006 — Minor dead code in mid-scenes (low priority observations)

> **RESOLVED — Sept M2 (2026-09-16), branch `cursor/m2-guardrails-b054`.** All four items done in the M2 engine commit: `AnimatedCounter` dead `normal` branch removed (colour now theme-resolved, TD-003); `ChecklistReveal` `slotLeft`/`slotTop` reads removed; `SideBySideCompare` honours a side's own `alignment` and falls back to the top-level one (the read was made live rather than deleted); `GridCardReveal` `rows` JSDoc removed. No behaviour change except the now-honoured per-side alignment.

**Severity:** Low · **Area:** engine · **Type:** cleanup. Pre-verified; bundle together in one cleanup PR.

- **AnimatedCounter dead `normal` color branch** — `AnimatedCounter.jsx` (~lines 88–92): `emphasisColors.normal` is defined but `numberColor` always uses `.high`. There is no `emphasis` prop on this component. Remove the dead branch (or wire an `emphasis` prop if desired; coordinate with TD-003).
- **`ChecklistReveal` reads `position.left`/`position.top` but never uses them** — `ChecklistReveal.jsx` (~lines 330–331): `slotLeft`/`slotTop` computed, only `width`/`height` used. Remove dead reads.
- **`SideBySideCompare` per-side `alignment` is dead** — `ComparisonSide` reads `alignment` (~line 102) but the parent always overwrites it with the top-level `alignment` (~lines 597–608). Either honour per-side alignment or remove the nested read + drop it from any docs.
- **`GridCardReveal` JSDoc claims `rows` support; code computes rows from `cards.length / columns`** — remove the misleading JSDoc (schema field already removed in PR #62).

**Acceptance criteria:** dead reads/branches removed; no behaviour change; bundle compiles.

---

## TD-007 — CodeBlock deep-dive (recent feature; external dependency)

**Severity:** Low (investigation) · **Area:** engine / dependency · **Type:** clarification

**Files**
- `KnoMotion-Videos/src/sdk/mid-scenes/CodeBlockScene.jsx` — in-repo wrapper (themes, beats, reveal-mode dispatch)
- External: `remotion-bits` v0.2.0 (`CodeBlock`, `TypeWriter`) — declared in `package.json` / `package-lock.json`

**Problem / unknowns**
- The actual syntax highlighting + typewriter is the third-party `remotion-bits` package; we don't own its internals. The set of **highlightable languages** depends on its Prism bundle and is **not verifiable from this repo** (decision: `codeBlock.language` left as a free string in the schema — see PR #62).
- `remotion-bits` is **not installed** in fresh VMs by default (root `npm install` hasn't run). Confirm it installs/resolves and that `codeBlock` renders end-to-end.
- The `typing` reveal path bypasses syntax highlighting, line numbers, and `highlightLines`/`focusLines` (documented in the schema now, but worth a visual confirmation).

**Recommended actions**
- Run a Studio render of a `codeBlock` scene for each `revealType` (`lineByLine`, `typing`, `highlight`, `fade`) and a few languages; record which languages actually highlight.
- If a bounded language list is desired later, derive it from the installed `remotion-bits`/Prism bundle and re-introduce a validated enum.

**Acceptance criteria**
- Confirmed `codeBlock` renders in all 4 reveal modes.
- Documented list of languages that actually highlight (or explicit decision to keep `language` unvalidated).

---

## TD-009 — Items inside sequenced mid-scenes exited ~0.8s after entering (`resolveBeats` ignored the container's exit)

> **RESOLVED — Sept M2 (2026-09-16), found while calibrating render-check.** Kept as a regression note: this was the single biggest cause of "the checklist appears and then the scene goes blank".

**Severity:** High · **Area:** engine / timing · **Type:** correctness (content disappears)

**Files**
- `KnoMotion-Videos/src/sdk/utils/beats.ts` — `resolveBeats(beats, defaults)`
- `ChecklistReveal.jsx`, `BubbleCalloutSequence.jsx`, `CardSequence.jsx`, `GridCardReveal.jsx`, `TextRevealSequence.jsx`, `IconGrid.jsx` — per-item `resolveBeats` calls

**Problem**
Each item (checklist row, callout, card, line, icon) resolved its own beats with `resolveBeats(item.beats, { start: containerStart + i * stagger })`. `BeatDefaults` had no `exit`, so an item without its own `beats.exit` fell to `hold + exitOffset` = start + 1.6 + 0.3 s and faded out ~1.9 s after it appeared — long before the container's `beats.exit` and the narration. A config could be perfectly valid, pass every rule, and show an empty slot for most of the scene.

**Fix (shipped)**
`BeatDefaults.exit?: number`; `resolveBeats` uses `beats.exit ?? defaults.exit ?? hold + exitOffset`. Every container passes `exit: sequenceBeats.exit` in its item defaults, so items stay up until their parent exits unless they carry their own exit. Pipeline-side, `beat_timing` now errors when a slot item lacks `beats.exit`, and Stage 9 render-check reports a slot that is blank at the scene midpoint as `blank_slot`, so this class of failure cannot pass silently again.

**Acceptance criteria (met)**
- The mock `worldcup` run's checklist scene shows all items at the midpoint still (coverage ~1.2% of the `full` slot, previously ~0%).
- `render-check.test.ts` `healthy` fixture: `blank: false` in settled / midpoint / pre-exit.

---

## TD-008 — Cloud/dev environment: root dependencies not installed by default

**Severity:** Low · **Area:** env / DX · **Type:** setup

**Problem**
Fresh agent VMs do not have the renderer's `node_modules` installed (e.g. `remotion-bits` missing), so engine build/render/Studio commands fail until `npm install` runs at the repo root. The pipeline package (`knomotion-pipeline/`) has its own `node_modules`.

**Recommended fix**
- Configure the Cloud Agent environment (Cursor → cursor.com/onboard env setup) to run root `npm install` (and `npm --prefix knomotion-pipeline install`) on VM startup, so engine render/Studio and pipeline tooling are immediately available.

**Acceptance criteria**
- A fresh agent can run `npx remotion studio KnoMotion-Videos/src/remotion/index.ts` and the pipeline's `tsc`/`tsx` without manual installs.

---

*Add new items above this line using the same shape: Files → Problem → Recommended fix → Acceptance criteria. Keep them tight.*
