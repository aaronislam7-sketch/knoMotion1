# 🗺️ KnoMotion Architecture - Quick Reference

**4-Layer Architecture Mapping to Codebase**

---

## 📁 File Structure by Layer

### Layer 0: SDK - Intelligence & Utilities

**Location**: `/workspace/KnoMotion-Videos/src/sdk/`

#### ✅ Well-Organized
- `elements/` - 23 elements (14 atoms, 9 compositions) ✅
- `core/` - Easing, time, motion, typography ✅
- `validation/` - Schema validation, compatibility ✅
- `fonts/` - Font loading system ✅

#### ⚠️ Needs Consolidation
- `animations/` - **4 systems exist**:
  - `animations.js` (basic)
  - `microDelights.jsx` (sophisticated)
  - `broadcastAnimations.ts` (broadcast-quality)
  - `continuousLife.js` (continuous)
  - **Action**: Unify into single `AnimationEngine`

- `layout/` - **3 systems exist**:
  - `layoutEngine.js` (most complete) ✅ **Use this as canonical**
  - `layoutEngineV2.js` (unclear purpose) ⚠️
  - `layout-resolver.js` (different approach) ⚠️
  - **Action**: Consolidate, remove duplicates

- `effects/` - Scattered across:
  - `effects/` directory ✅
  - `broadcastEffects.tsx` (root level) ⚠️
  - `decorations/` directory ⚠️
  - **Action**: Organize into `EffectsRegistry`

---

### Layer 1: Layout Engine - Positioning & Guardrails

**Location**: `/workspace/KnoMotion-Videos/src/sdk/layout/`

#### Current Files
- `layoutEngine.js` ✅ **CANONICAL** - Use this
- `layoutEngineV2.js` ⚠️ **DEPRECATE** - Unclear purpose
- `layout-resolver.js` ⚠️ **DEPRECATE** - Different approach
- `positionSystem.js` ✅ **KEEP** - 9-point grid system

#### Key Functions
```javascript
// From layoutEngine.js (CANONICAL)
calculateItemPositions(items, config)  // Main layout function
createLayoutAreas(viewport, options)   // Safe zones
ARRANGEMENT_TYPES                      // 7 layout types

// From positionSystem.js
resolvePosition(token, viewport)       // 9-point grid
getCenteredStackBase(viewport)         // Stack positioning
```

#### Missing Features
- ❌ Mandatory collision detection
- ❌ Automatic bounds checking
- ❌ Layout validation API
- ❌ Layout presets

---

### Layer 2: Mid-Scenes - Reusable Component Logic

**Location**: `/workspace/KnoMotion-Videos/src/sdk/components/mid-level/`

#### Current Files
- `AppMosaic.jsx` ✅ (exists)
- `FlowDiagram.jsx` ✅ (exists)
- **Missing**: HubSpokeScene, GridScene, StackScene, etc.

#### Template Patterns (Embedded)
**Location**: `/workspace/KnoMotion-Videos/src/templates/v6/`

Each template contains mid-scene logic:
- `Explain2AConceptBreakdown_V6.jsx` - Hub-spoke pattern (lines 179-478)
- `Compare12MatrixGrid_V6.jsx` - Grid pattern
- `Guide10StepSequence_V6.jsx` - Stack pattern

**Action**: Extract these patterns to `/sdk/mid-scenes/`

#### Recommended Structure
```
/sdk/mid-scenes/
├── HubSpokeScene.jsx      (extract from Explain2A)
├── GridScene.jsx          (extract from Compare12)
├── StackScene.jsx         (extract from Guide10)
├── CascadeScene.jsx       (extract from Reveal9)
├── FlowScene.jsx          (extract from Progress18)
└── index.js               (exports)
```

---

### Layer 3: JSON - Configuration Orchestrator

**Location**: `/workspace/KnoMotion-Videos/src/scenes/`

#### Schema Files
- `sdk/validation/scene.schema.ts` ✅ (Zod schema)
- `sdk/validation/sceneCompatibility.js` ✅ (migration)

#### Example Scenes
- `scenes/v6/` - 9 example scenes ✅
- `scenes/v7/` - 10 example scenes ✅
- `scenes/examples/` - 19 additional examples ✅

#### Template Defaults (Problem)
**Location**: Each template file

Templates have hardcoded `DEFAULT_CONFIG`:
- `Explain2AConceptBreakdown_V6.jsx` - Lines 48-176
- `Hook1AQuestionBurst_V6.jsx` - Lines 50-200+
- `FullFrameScene.jsx` (v7) - Lines 82-150

**Action**: Move all defaults to JSON schema, remove from templates

---

## 🔍 Template Analysis

### v6 Templates (17 active)

**Location**: `/workspace/KnoMotion-Videos/src/templates/v6/`

**JSON Configurability**: 40-60%

**Issues**:
- Hardcoded `DEFAULT_CONFIG` objects
- Template-specific layout calculations
- Embedded animation logic
- Inconsistent JSON structures

**Examples**:
- `Explain2AConceptBreakdown_V6.jsx` - 478 lines, ~200 lines of config
- `Hook1AQuestionBurst_V6.jsx` - 600+ lines, complex hardcoded logic

### v7 Templates (9 active)

**Location**: `/workspace/KnoMotion-Videos/src/templates/v7/`

**JSON Configurability**: 70-80% ✅ **Better**

**Improvements**:
- Scene-shell architecture
- More JSON-driven
- Cleaner separation

**Examples**:
- `FullFrameScene.jsx` - Still has defaults but cleaner structure
- `GridLayoutScene.jsx` - Better abstraction

**Action**: Accelerate v6 → v7 migration

---

## 🎬 Showcase Analysis

**Location**: `/workspace/KnoMotion-Videos/src/compositions/`

### Showcase Files
- `ShowcaseMain.jsx` - Master composition
- `ShowcaseScene1_IntroValueProp.jsx` - 45s scene
- `ShowcaseScene2_ArchitectureDeepDive.jsx` - 60s scene (canonical reference)
- `ShowcaseScene3_LayoutShowcase.jsx` - 45s scene
- `ShowcaseScene4_FeatureShowcaseCTA.jsx` - 60s scene

### Finding
**Showcase is hardcoded, not JSON-driven** ⚠️

- Scenes are React components with hardcoded content
- Don't use JSON configuration
- Don't go through `TemplateRouter`

**Action**: Convert showcase to JSON scenes to prove architecture

---

## 🛠️ Template Router

**Location**: `/workspace/KnoMotion-Videos/src/templates/TemplateRouter.jsx`

### Current Behavior
- Routes by `template_id` from JSON
- Supports v5, v6, v7 templates
- Wraps with `SceneIdContext`

### Issue
- Still requires template components to exist
- Not truly template-agnostic

### Goal
- `SceneRenderer` that reads JSON only
- No template-specific code
- Renders any scene from JSON

---

## 📋 Action Items by Priority

### 🔴 Critical (Week 1-4)

1. **Consolidate Layout Engine** (Week 1)
   - [ ] Audit `layoutEngine.js`, `layoutEngineV2.js`, `layout-resolver.js`
   - [ ] Choose canonical system (recommend `layoutEngine.js`)
   - [ ] Migrate all templates to canonical
   - [ ] Remove duplicate implementations

2. **Create Mid-Scene Library** (Week 2)
   - [ ] Extract `HubSpokeScene` from `Explain2A`
   - [ ] Extract `GridScene` from `Compare12`
   - [ ] Extract `StackScene` from `Guide10`
   - [ ] Create `/sdk/mid-scenes/` directory
   - [ ] Update templates to use mid-scenes

3. **Unify Animation System** (Week 3)
   - [ ] Audit all animation functions
   - [ ] Create `AnimationEngine` class
   - [ ] Consolidate into single API
   - [ ] Update all templates

4. **Complete JSON Schema** (Week 4)
   - [ ] Audit all template features
   - [ ] Add missing fields to schema
   - [ ] Remove `DEFAULT_CONFIG` from templates
   - [ ] Move defaults to schema

### 🟡 High Priority (Week 5-8)

5. **Migrate v6 → v7** (Weeks 5-6)
   - [ ] Convert v6 templates to v7 architecture
   - [ ] Move all config to JSON
   - [ ] Remove hardcoded logic

6. **JSON Editor** (Week 7)
   - [ ] Build JSON editor with autocomplete
   - [ ] Real-time validation
   - [ ] Error messages

7. **Template-Agnostic Renderer** (Week 8)
   - [ ] Create `SceneRenderer` component
   - [ ] Render from JSON only
   - [ ] No template-specific code

### 🟢 Medium Priority (Week 9-12)

8. **Effects Standardization** (Week 9)
9. **Layout Guardrails** (Week 10)
10. **JSON Showcase** (Week 11)
11. **Performance & Testing** (Week 12)

---

## 🔗 Key Files Reference

### SDK Entry Point
- `/sdk/index.js` - Main SDK exports

### Template System
- `/templates/TemplateRouter.jsx` - Routes JSON to templates
- `/templates/v6/` - 17 v6 templates
- `/templates/v7/` - 9 v7 templates (better architecture)

### Validation
- `/sdk/validation/scene.schema.ts` - Zod schema
- `/sdk/validation/sceneCompatibility.js` - Migration

### Layout
- `/sdk/layout/layoutEngine.js` - **CANONICAL** layout system
- `/sdk/layout/positionSystem.js` - 9-point grid

### Showcase (Canonical Reference)
- `/compositions/ShowcaseMain.jsx` - Master composition
- `/compositions/ShowcaseScene2_ArchitectureDeepDive.jsx` - Architecture demo

---

## 📊 Metrics Dashboard

### Current State
```
Layer 0 (SDK):        ████████████████░░░░  85%
Layer 1 (Layout):     ██████████████░░░░░░  70%
Layer 2 (Mid-Scenes): ████████████░░░░░░░░  60%
Layer 3 (JSON):       ██████████████░░░░░░  65%
────────────────────────────────────────────
Overall:              ████████████████░░░░  75%
```

### Target State (After Phase 2)
```
Layer 0 (SDK):        ████████████████████  100%
Layer 1 (Layout):     ████████████████████  100%
Layer 2 (Mid-Scenes): ███████████████████░  90%
Layer 3 (JSON):       ████████████████████  100%
────────────────────────────────────────────
Overall:              ███████████████████░  95%
```

---

## 🎯 Quick Wins (This Week)

1. **Document layout system differences**
   - Create comparison table
   - Identify best features from each

2. **Extract first mid-scene**
   - Copy hub-spoke logic from `Explain2A`
   - Create `HubSpokeScene.jsx` in `/sdk/mid-scenes/`
   - Make it JSON-configurable

3. **List all DEFAULT_CONFIG objects**
   - Search codebase for `DEFAULT_CONFIG`
   - Document what should move to JSON schema

---

**See `ARCHITECTURE_AUDIT.md` for full analysis.**  
**See `AUDIT_SUMMARY.md` for executive summary.**
