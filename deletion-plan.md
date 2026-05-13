# Deletion Plan — Legacy Code & Unused Dependencies

> Analysis of code that can be removed to improve repo cleanliness and bundle performance.
> Generated: 2026-05-09. **This document is an analysis only — no deletions have been made.**

---

## Priority Levels

- **P0 — Safe to delete now.** Zero imports, zero usage. No risk.
- **P1 — Delete after minor migration.** One or two imports to redirect first.
- **P2 — Delete after verification.** Content may be merged into canonical files; needs diff to confirm completeness.
- **P3 — Product decision.** Not a technical issue — depends on whether you want to keep the capability.

---

## 1. Unused npm Dependencies (P0)

These packages have **zero imports** anywhere in the repository source code.

| Package | Type | Action |
|---------|------|--------|
| `@monaco-editor/react` | dependency | Remove from `package.json` |
| `react-syntax-highlighter` | dependency | Remove from `package.json` |
| `@types/react-syntax-highlighter` | devDependency | Remove from `package.json` |
| `rough-notation` | dependency | Remove (only referenced in `Archive/` templates, not active code) |

**Estimated savings:** ~2-4 MB from `node_modules`, faster installs.

**Command:**
```bash
npm uninstall @monaco-editor/react react-syntax-highlighter @types/react-syntax-highlighter rough-notation
```

---

## 2. Redundant Animation Files (P2)

The canonical animation barrel is `sdk/animations/index.js` (~1152 lines), which was created by merging several older standalone files. The following files appear to have their contents fully merged into `index.js` but the originals were never deleted.

| File | Lines | Imported? | Action |
|------|-------|-----------|--------|
| `sdk/animations/advancedEffects.jsx` | ~465 | No | Delete after confirming all exports exist in `index.js` |
| `sdk/animations/continuousLife.js` | ~275 | No | Delete after confirming all exports exist in `index.js` |
| `sdk/animations/sceneTransformation.jsx` | ~278 | No | Delete after confirming all exports exist in `index.js` |
| `sdk/animations/broadcastAnimations.ts` | ~348 | No | Delete after confirming all exports exist in `index.js` |

**Verification approach:** For each file, diff the exported function signatures against `index.js`. If every export exists in `index.js`, delete the standalone file.

**Estimated savings:** ~1,366 lines of duplicated code.

---

## 3. Legacy Animation File with One Import (P1)

| File | Lines | Imported By | Action |
|------|-------|-------------|--------|
| `sdk/animations/animations.js` | ~229 | `sdk/components/components.jsx` imports `fadeSlide`, `pulse` | Migrate `components.jsx` to import from `animations/index.js`, then delete `animations.js` |

**Migration:** Change `import { fadeSlide, pulse } from '../animations/animations'` → `import { fadeSlide, pulse } from '../animations/index'` in `components.jsx`.

---

## 4. Re-export Shims (P1)

These are 2-line files that re-export from the canonical location. They exist for backward compatibility but nothing in active code imports them.

| File | Lines | Re-exports From | Imported? | Action |
|------|-------|-----------------|-----------|--------|
| `sdk/broadcastEffects.tsx` | 2 | `./effects/broadcastEffects` | No | Delete |
| `sdk/microDelights.jsx` | 2 | `./animations/microDelights` | No | Delete |

---

## 5. Legacy Validation Layer (P2)

The engine now has two validation systems:
1. **New (canonical):** `sdk/schemas/videoConfig.schema.ts` — Zod schema for `KnoMotionVideo` composition props. Registered on the composition, powers Studio visual editing.
2. **Old:** `sdk/validation/scene.schema.ts` + `sdk/validation/scene-validator.js` + `sdk/validation/sceneCompatibility.js` — v5.0/v5.1 scene validation with template registry.

| File | Lines | Imported by active code? | Assessment |
|------|-------|--------------------------|------------|
| `sdk/validation/scene.schema.ts` | ~242 | Only via barrel `sdk/index.js` | Legacy — v5 scene shape |
| `sdk/validation/scene-validator.js` | ~190 | Only via barrel `sdk/index.js` | Legacy — not called by any component |
| `sdk/validation/sceneCompatibility.js` | large | Only via barrel `sdk/index.js` | Legacy — v5→v6 migration helpers |
| `sdk/validation/collision-detection.js` | ~532 | Yes — `layoutEngine.js`, `layout-resolver.js` | **Keep** — actively used by layout system |

**Action:** Remove `scene.schema.ts`, `scene-validator.js`, `sceneCompatibility.js` and their barrel exports from `sdk/index.js`. Keep `collision-detection.js`.

**Risk:** If any downstream consumer (outside this repo) uses the legacy `validateScene()` or `SceneSchema` exports, they'll break. Verify no external consumers exist.

---

## 6. Canon Video Compositions (P3 — Product Decision)

The 9 canon videos (3 Knodovia desktop, 3 Knodovia mobile, 3 TikTok) each have their own composition file with hardcoded scene arrays. Now that `GenericVideoPlayer` + `KnoMotionVideo` exists, these compositions are architecturally redundant — their scene arrays could become JSON data files rendered through the generic composition.

| Files | Count | Lines (est.) |
|-------|-------|-------------|
| `KnodoviaVideo1_AccidentalArrival.jsx` | 1 | ~200 |
| `KnodoviaVideo2_Culture.jsx` | 1 | ~250 |
| `KnodoviaVideo3_Economics.jsx` | 1 | ~300 |
| `KnodoviaVideo1_Mobile.jsx` | 1 | ~150 |
| `KnodoviaVideo2_Mobile.jsx` | 1 | ~200 |
| `KnodoviaVideo3_Mobile.jsx` | 1 | ~200 |
| `TikTok_BrainLies.jsx` | 1 | ~200 |
| `TikTok_ADHDOverpowered.jsx` | 1 | ~200 |
| `TikTok_80msDelay.jsx` | 1 | ~200 |

**Option A (Simplify):** Convert each to a `scenes.json` data file + thin wrapper that passes scenes to `GenericVideoPlayer`. Remove the rendering logic.

**Option B (Delete):** If these are no longer needed as demo/showcase content, delete entirely and remove from `Root.tsx`.

**Option C (Keep):** Leave as-is if they serve as reference implementations.

**This is a product decision, not a technical one.**

---

## 7. Archive Directory (P3 — Product Decision)

`/workspace/Archive/` contains ~201 files: old documentation, v5/v6 templates, showcase compositions, example scene JSON, migrated READMEs. None of these are imported by active code.

**Options:**
- **Delete entirely** — saves repo size, removes confusion
- **Move to a separate `archive` branch** — preserves history without polluting main
- **Keep** — if you reference it occasionally for historical context

**Estimated size:** Several hundred KB of code + docs.

---

## 8. Admin Pages (P1)

These admin components exist but are not wired into the current `App.jsx` router and have no imports from active code:

| File | Lines | Assessment |
|------|-------|------------|
| `admin/ElementShowcase.jsx` | ~200 | Only referenced in Archive. Delete or wire into admin. |
| `admin/UnifiedAdminConfig.jsx` | ~150 | README-only references. Delete or wire into admin. |

---

## 9. KnoSlides Dependencies in Root package.json (P3)

Several dependencies in the root `package.json` are **only used by `KnoSlides/`**, not by the video engine:

| Package | Used By |
|---------|---------|
| `framer-motion` | KnoSlides only |
| `lottie-react` | KnoSlides only |
| `@xyflow/react` | KnoSlides only |
| `@tanstack/react-table` | KnoSlides only |
| `@dnd-kit/core` + `@dnd-kit/sortable` | KnoSlides only |

**Option:** Move these into `KnoSlides/package.json` if KnoSlides has its own. Or leave as-is if KnoSlides is tightly coupled to the root project.

---

## 10. Test File Not Integrated (P1)

| File | Lines | Assessment |
|------|-------|------------|
| `sdk/schemas/videoConfig.test.ts` | ~334 | Manual script-style test (run with `npx tsx`). Not hooked into any test runner or CI. Either integrate into a test framework or document as manual. |

---

## 11. Miscellaneous Candidates

| Item | Assessment |
|------|------------|
| `sdk/core/transitions.ts` (~187 lines) | **Keep** — still used via `sdk/transitions.ts` shim. Defines `TransitionSeriesBridge`, `buildStageTransitionPlan`, etc. Not redundant with `sdk/transitions/index.ts`. |
| `sdk/transitions.ts` (shim, ~8 lines) | **Keep** — merges both transition layers for backward compat |
| `sdk/components/` directory | **Keep** — mid-level composed components (AppMosaic, FlowDiagram, heroRegistry, questionRenderer). Different layer than `elements/`. |
| `sdk/animations/microDelights.jsx` (~552 lines) | **Keep** — still separately exported from `sdk/index.js`, not merged into `animations/index.js` |
| `compositions/CanonShowerVideo.jsx` | **Keep** — used by admin preview UI (`ShowcasePreview.jsx`) |
| `build/` directory | Already gitignored, not committed |

---

## Summary: Impact Estimate

| Category | Files | Lines Saved | Priority |
|----------|-------|-------------|----------|
| Unused npm deps | 4 packages | N/A (node_modules) | P0 |
| Redundant animation files | 4 files | ~1,366 | P2 |
| Legacy animation + migration | 1 file | ~229 | P1 |
| Re-export shims | 2 files | ~4 | P1 |
| Legacy validation | 3 files | ~600+ | P2 |
| Admin orphan pages | 2 files | ~350 | P1 |
| Archive directory | ~201 files | Many thousands | P3 |
| Canon compositions (simplify) | 9 files | ~1,900 (rendering logic) | P3 |

**Total recoverable (P0-P2 only):** ~2,550 lines of dead/redundant code + 4 unused npm packages.

---

## Recommended Execution Order

1. **Phase 1 (P0):** Remove unused npm packages — zero risk, instant cleanup
2. **Phase 2 (P1):** Migrate `components.jsx` import, delete shims and orphan admin pages
3. **Phase 3 (P2):** Verify animation file merges, delete redundant animation files, remove legacy validators
4. **Phase 4 (P3):** Product decisions on Archive, canon compositions, KnoSlides dep separation
