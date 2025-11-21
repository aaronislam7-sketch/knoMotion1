# 🏗️ KnoMotion Architecture Audit Plan

**Goal**: Achieve 100% JSON-driven video creation engine  
**Current State**: 75% complete - Strong foundation, critical gaps remain  
**Timeline**: 12-16 weeks (phased approach)  
**Validation**: Use showcase zone (`/admin/ShowcasePreview.jsx`) for all testing

---

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Critical Issues (Priority Order)](#critical-issues-priority-order)
3. [Phase 1: Foundation (Weeks 1-4)](#phase-1-foundation-weeks-1-4)
4. [Phase 2: JSON-Driven Templates (Weeks 5-8)](#phase-2-json-driven-templates-weeks-5-8)
5. [Phase 3: Polish & Scale (Weeks 9-12)](#phase-3-polish--scale-weeks-9-12)
6. [Progress Tracking](#progress-tracking)
7. [Success Criteria](#success-criteria)
8. [Questions & Clarifications](#questions--clarifications)

---

## Executive Summary

### Architecture Vision
> "When complete we will only EVER configure JSON to create effectively a new scene every single time."

### Current Reality
- **Layer 0 (SDK)**: 85% complete ✅
- **Layer 1 (Layout)**: 70% complete 🟡
- **Layer 2 (Mid-Scenes)**: 60% complete 🟡
- **Layer 3 (JSON)**: 65% complete 🟡
- **Overall**: 75% complete

### Critical Blockers
1. 🔴 **Multiple Layout Systems** - 3 systems exist, causing inconsistency
2. 🔴 **No Mid-Scene Library** - Logic embedded in templates (400-800 lines each)
3. 🔴 **Templates Not JSON-Driven** - Hardcoded `DEFAULT_CONFIG` objects
4. 🔴 **Animation System Fragmentation** - 4 different animation systems

### Strategy
- **Phase 1**: Fix critical architecture issues (consolidate systems)
- **Phase 2**: Make templates 100% JSON-configurable
- **Phase 3**: Polish, optimize, and scale

---

## Critical Issues (Priority Order)

### 🔴 CRITICAL-1: Multiple Layout Systems
**Impact**: Inconsistent behavior, maintenance burden, violates single source of truth  
**Files Affected**: 
- `/sdk/layout/layoutEngine.js` (most complete - **KEEP THIS**)
- `/sdk/layout/layoutEngineV2.js` (unclear purpose - **AUDIT**)
- `/sdk/layout/layout-resolver.js` (different approach - **AUDIT**)

**Evidence**: Templates import from different layout systems, causing inconsistent behavior

---

### 🔴 CRITICAL-2: No Mid-Scene Library
**Impact**: Can't reuse scene patterns, templates are 400-800 line monoliths  
**Files Affected**:
- All templates in `/templates/v6/` (17 templates)
- All templates in `/templates/v7/` (9 templates)

**Evidence**: Each template reimplements hub-spoke, grid, stack patterns independently

**Patterns to Extract**:
- Hub-spoke (from `Explain2AConceptBreakdown_V6.jsx`)
- Grid (from `Compare12MatrixGrid_V6.jsx`)
- Stack (from `Guide10StepSequence_V6.jsx`)
- Cascade (from `Reveal9ProgressiveUnveil_V6.jsx`)

---

### 🔴 CRITICAL-3: Templates Not JSON-Driven
**Impact**: Architecture goal not achievable, hardcoded configs prevent full JSON control  
**Files Affected**:
- All templates with `DEFAULT_CONFIG` objects
- Found in: `Explain2BAnalogy_V6.jsx`, `Explain2AConceptBreakdown_V6.jsx`, `Hook1AQuestionBurst_V6.jsx`, etc.

**Evidence**: Templates merge `DEFAULT_CONFIG` with scene JSON, defaults should be in schema

---

### 🔴 CRITICAL-4: Animation System Fragmentation
**Impact**: Confusion about which animation function to use, inconsistent APIs  
**Files Affected**:
- `/sdk/animations/animations.js` (basic animations)
- `/sdk/animations/microDelights.jsx` (sophisticated)
- `/sdk/animations/broadcastAnimations.ts` (broadcast-quality)
- `/sdk/animations/continuousLife.js` (continuous)

**Evidence**: Templates import from different animation systems, no unified API

---

## Phase 1: Foundation (Weeks 1-4)

**Goal**: Fix critical architecture issues - consolidate systems, extract patterns, unify APIs

---

### Week 1: Consolidate Layout Engine

**Objective**: Single canonical layout system for all templates

#### Task 1.1: Audit Layout Systems
**Files to Review**:
- `/sdk/layout/layoutEngine.js` (588 lines)
- `/sdk/layout/layoutEngineV2.js` (unknown size)
- `/sdk/layout/layout-resolver.js` (unknown size)
- `/sdk/layout/positionSystem.js` (keep - 9-point grid)

**Steps**:
1. [ ] Read all three layout files completely
2. [ ] Document features in each:
   - [ ] List all exported functions
   - [ ] List all arrangement types supported
   - [ ] List all configuration options
   - [ ] Note any unique features
3. [ ] Create comparison table:
   - [ ] Feature matrix (what each system can do)
   - [ ] Usage analysis (which templates use which)
   - [ ] Code quality assessment
4. [ ] Identify best features from each system
5. [ ] Document findings in `/docs/audit/layout-system-audit.md`

**Deliverable**: Audit document with recommendation for canonical system

**Validation**: 
- Review audit document
- Confirm `layoutEngine.js` is most complete (expected)

---

#### Task 1.2: Create Unified Layout Engine
**Target File**: `/sdk/layout/layoutEngine.js` (enhance existing)

**Steps**:
1. [ ] Review audit findings
2. [ ] Enhance `layoutEngine.js` with best features from other systems:
   - [ ] Add any missing arrangement types
   - [ ] Add any missing utility functions
   - [ ] Ensure all 7 arrangement types work: STACKED_VERTICAL, STACKED_HORIZONTAL, GRID, CIRCULAR, RADIAL, CASCADE, CENTERED
3. [ ] Add mandatory collision detection:
   - [ ] Import from `/sdk/validation/collision-detection.js`
   - [ ] Add collision check to `calculateItemPositions()`
   - [ ] Return warnings/errors for collisions
4. [ ] Add automatic bounds checking:
   - [ ] Check if items exceed canvas bounds
   - [ ] Return warnings/errors for violations
5. [ ] Create layout validation API:
   - [ ] `validateLayout(layout, canvas)` function
   - [ ] Returns `{ valid: boolean, errors: [], warnings: [] }`
6. [ ] Update exports in `/sdk/layout/layoutEngine.js`
7. [ ] Update SDK main index `/sdk/index.js` to export unified engine

**Deliverable**: Enhanced unified layout engine with collision detection and bounds checking

**Validation**:
- [ ] Test all 7 arrangement types work
- [ ] Test collision detection catches overlaps
- [ ] Test bounds checking catches violations
- [ ] Review in showcase zone (create test scene)

---

#### Task 1.3: Migrate All Templates to Unified Engine
**Files to Update**: All templates using layout systems

**Steps**:
1. [ ] Find all templates importing from layout systems:
   - [ ] Search for `from '../sdk/layout'` imports
   - [ ] Search for `from '../../sdk/layout'` imports
   - [ ] List all affected files
2. [ ] Update each template:
   - [ ] Change imports to use unified `layoutEngine.js`
   - [ ] Update function calls if API changed
   - [ ] Test template still renders
3. [ ] Update showcase compositions if they use layout:
   - [ ] Check `/compositions/ShowcaseScene3_LayoutShowcase.jsx`
   - [ ] Update if needed
4. [ ] Test all templates in showcase zone:
   - [ ] Load each template
   - [ ] Verify layouts render correctly
   - [ ] Check for console errors

**Deliverable**: All templates using unified layout engine

**Validation**:
- [ ] All templates render without errors
- [ ] Layouts look correct in showcase zone
- [ ] No console warnings about layout

---

#### Task 1.4: Remove Duplicate Layout Systems
**Files to Remove/Deprecate**:
- `/sdk/layout/layoutEngineV2.js` (remove or archive)
- `/sdk/layout/layout-resolver.js` (remove or archive)

**Steps**:
1. [ ] Verify all templates migrated (Task 1.3 complete)
2. [ ] Check for any other files importing from deprecated systems:
   - [ ] Search codebase for imports
   - [ ] Update any remaining imports
3. [ ] Archive deprecated files:
   - [ ] Move to `/sdk/layout/archive/` or delete
   - [ ] Document why removed in commit message
4. [ ] Update documentation:
   - [ ] Update SDK.md if it references old systems
   - [ ] Add migration notes if needed

**Deliverable**: Duplicate layout systems removed

**Validation**:
- [ ] No files import from deprecated systems
- [ ] Build succeeds
- [ ] All tests pass (if tests exist)

---

### Week 2: Create Mid-Scene Library

**Objective**: Extract reusable scene patterns from templates into `/sdk/mid-scenes/`

#### Task 2.1: Extract HubSpokeScene
**Source**: `/templates/v6/Explain2AConceptBreakdown_V6.jsx`  
**Target**: `/sdk/mid-scenes/HubSpokeScene.jsx`

**Steps**:
1. [ ] Read `Explain2AConceptBreakdown_V6.jsx` completely
2. [ ] Identify hub-spoke pattern logic:
   - [ ] Center hub rendering
   - [ ] Spoke positioning (circular layout)
   - [ ] Connection lines between hub and spokes
   - [ ] Animation sequences
3. [ ] Extract to new file `/sdk/mid-scenes/HubSpokeScene.jsx`:
   - [ ] Create component: `HubSpokeScene({ config, frame, fps })`
   - [ ] Make all values come from `config` prop (no hardcoded defaults)
   - [ ] Use unified layout engine for positioning
   - [ ] Use unified animation system
4. [ ] Create JSON schema for HubSpokeScene config:
   - [ ] Document required fields
   - [ ] Document optional fields
   - [ ] Add to main scene schema if needed
5. [ ] Update `Explain2AConceptBreakdown_V6.jsx`:
   - [ ] Import `HubSpokeScene` from mid-scenes
   - [ ] Replace hub-spoke logic with `<HubSpokeScene />` component
   - [ ] Pass scene config as props
6. [ ] Export from `/sdk/mid-scenes/index.js`
7. [ ] Update SDK main index `/sdk/index.js`

**Deliverable**: Reusable `HubSpokeScene` component

**Validation**:
- [ ] `Explain2AConceptBreakdown_V6.jsx` renders correctly using `HubSpokeScene`
- [ ] Test in showcase zone with example JSON
- [ ] Verify no visual regressions
- [ ] Check JSON config controls all aspects

---

#### Task 2.2: Extract GridScene
**Source**: `/templates/v6/Compare12MatrixGrid_V6.jsx`  
**Target**: `/sdk/mid-scenes/GridScene.jsx`

**Steps**:
1. [ ] Read `Compare12MatrixGrid_V6.jsx` completely
2. [ ] Identify grid pattern logic:
   - [ ] Grid layout calculation
   - [ ] Item positioning in grid
   - [ ] Animation sequences
3. [ ] Extract to `/sdk/mid-scenes/GridScene.jsx`:
   - [ ] Create component: `GridScene({ config, frame, fps })`
   - [ ] Use unified layout engine (GRID arrangement)
   - [ ] Make all values configurable via JSON
4. [ ] Create JSON schema for GridScene config
5. [ ] Update `Compare12MatrixGrid_V6.jsx` to use `GridScene`
6. [ ] Export from mid-scenes index

**Deliverable**: Reusable `GridScene` component

**Validation**:
- [ ] `Compare12MatrixGrid_V6.jsx` renders correctly
- [ ] Test in showcase zone
- [ ] Verify grid layout is JSON-configurable

---

#### Task 2.3: Extract StackScene
**Source**: `/templates/v6/Guide10StepSequence_V6.jsx`  
**Target**: `/sdk/mid-scenes/StackScene.jsx`

**Steps**:
1. [ ] Read `Guide10StepSequence_V6.jsx` completely
2. [ ] Identify stack pattern logic:
   - [ ] Vertical/horizontal stacking
   - [ ] Item spacing
   - [ ] Animation sequences
3. [ ] Extract to `/sdk/mid-scenes/StackScene.jsx`:
   - [ ] Create component: `StackScene({ config, frame, fps })`
   - [ ] Use unified layout engine (STACKED_VERTICAL/HORIZONTAL)
   - [ ] Make all values configurable via JSON
4. [ ] Create JSON schema for StackScene config
5. [ ] Update `Guide10StepSequence_V6.jsx` to use `StackScene`
6. [ ] Export from mid-scenes index

**Deliverable**: Reusable `StackScene` component

**Validation**:
- [ ] `Guide10StepSequence_V6.jsx` renders correctly
- [ ] Test in showcase zone
- [ ] Verify stack layout is JSON-configurable

---

#### Task 2.4: Extract CascadeScene
**Source**: `/templates/v6/Reveal9ProgressiveUnveil_V6.jsx`  
**Target**: `/sdk/mid-scenes/CascadeScene.jsx`

**Steps**:
1. [ ] Read `Reveal9ProgressiveUnveil_V6.jsx` completely
2. [ ] Identify cascade pattern logic:
   - [ ] Cascading item reveals
   - [ ] Rotation offsets
   - [ ] Animation sequences
3. [ ] Extract to `/sdk/mid-scenes/CascadeScene.jsx`:
   - [ ] Create component: `CascadeScene({ config, frame, fps })`
   - [ ] Use unified layout engine (CASCADE arrangement)
   - [ ] Make all values configurable via JSON
4. [ ] Create JSON schema for CascadeScene config
5. [ ] Update `Reveal9ProgressiveUnveil_V6.jsx` to use `CascadeScene`
6. [ ] Export from mid-scenes index

**Deliverable**: Reusable `CascadeScene` component

**Validation**:
- [ ] `Reveal9ProgressiveUnveil_V6.jsx` renders correctly
- [ ] Test in showcase zone
- [ ] Verify cascade layout is JSON-configurable

---

#### Task 2.5: Create Mid-Scene Index & Documentation
**Target**: `/sdk/mid-scenes/index.js` and `/sdk/mid-scenes/README.md`

**Steps**:
1. [ ] Create `/sdk/mid-scenes/index.js`:
   - [ ] Export `HubSpokeScene`
   - [ ] Export `GridScene`
   - [ ] Export `StackScene`
   - [ ] Export `CascadeScene`
2. [ ] Update `/sdk/index.js` to export mid-scenes
3. [ ] Create `/sdk/mid-scenes/README.md`:
   - [ ] Document each mid-scene component
   - [ ] Show usage examples
   - [ ] Document JSON config structure
   - [ ] Link to example JSON files
4. [ ] Update main SDK.md documentation

**Deliverable**: Mid-scene library documented and exported

**Validation**:
- [ ] All mid-scenes importable from SDK
- [ ] Documentation is clear
- [ ] Examples work

---

### Week 3: Unify Animation System

**Objective**: Single unified animation API for all templates

#### Task 3.1: Audit Animation Systems
**Files to Review**:
- `/sdk/animations/animations.js`
- `/sdk/animations/microDelights.jsx`
- `/sdk/animations/broadcastAnimations.ts`
- `/sdk/animations/continuousLife.js`
- `/sdk/animations/index.js` (exports)

**Steps**:
1. [ ] Read all animation files completely
2. [ ] Document all animation functions:
   - [ ] List function names
   - [ ] Document function signatures
   - [ ] Document return values
   - [ ] Note any dependencies
3. [ ] Categorize animations:
   - [ ] **Entrance**: fadeIn, slideIn, scaleIn, etc.
   - [ ] **Exit**: fadeOut, slideOut, scaleOut, etc.
   - [ ] **Continuous**: breathing, floating, rotation, etc.
   - [ ] **Micro-delights**: cardEntrance, iconPop, particleBurst, etc.
4. [ ] Identify duplicates (same functionality, different names)
5. [ ] Identify gaps (missing common animations)
6. [ ] Document findings in `/docs/audit/animation-system-audit.md`

**Deliverable**: Complete audit of all animation functions

**Validation**:
- [ ] All animation functions documented
- [ ] Categories are clear
- [ ] Duplicates identified

---

#### Task 3.2: Create AnimationEngine
**Target**: `/sdk/animations/AnimationEngine.js`

**Steps**:
1. [ ] Create `AnimationEngine` class:
   - [ ] Structure: `class AnimationEngine { }`
   - [ ] Methods organized by category
2. [ ] Implement unified API:
   - [ ] Standard signature: `getAnimation(frame, config, fps)`
   - [ ] Config structure: `{ type, startFrame, duration, ...options }`
   - [ ] Return structure: `{ opacity, transform, ...styleProps }`
3. [ ] Migrate entrance animations:
   - [ ] `fadeIn(frame, config, fps)`
   - [ ] `slideIn(frame, config, fps)`
   - [ ] `scaleIn(frame, config, fps)`
   - [ ] `springEntrance(frame, config, fps)`
   - [ ] etc.
4. [ ] Migrate exit animations:
   - [ ] `fadeOut(frame, config, fps)`
   - [ ] `slideOut(frame, config, fps)`
   - [ ] etc.
5. [ ] Migrate continuous animations:
   - [ ] `breathing(frame, config)`
   - [ ] `floating(frame, config)`
   - [ ] `rotation(frame, config)`
   - [ ] etc.
6. [ ] Migrate micro-delights:
   - [ ] `cardEntrance(frame, config, fps)`
   - [ ] `iconPop(frame, config, fps)`
   - [ ] `particleBurst(frame, config, fps)`
   - [ ] etc.
7. [ ] Create animation presets:
   - [ ] `getPreset(presetName)` - returns config for common animations
   - [ ] Presets: "hero-entrance", "card-pop", "fade-in", etc.
8. [ ] Export from `/sdk/animations/index.js`

**Deliverable**: Unified `AnimationEngine` with single API

**Validation**:
- [ ] All animation categories work
- [ ] API is consistent
- [ ] Presets work
- [ ] Test in showcase zone

---

#### Task 3.3: Update Templates to Use AnimationEngine
**Files to Update**: All templates using animations

**Steps**:
1. [ ] Find all templates importing animations:
   - [ ] Search for `from '../sdk/animations'` imports
   - [ ] Search for `from '../../sdk/animations'` imports
   - [ ] List all affected files
2. [ ] Update each template:
   - [ ] Change imports to use `AnimationEngine`
   - [ ] Update function calls to new API
   - [ ] Update config structures if needed
3. [ ] Update showcase compositions if they use animations
4. [ ] Test all templates in showcase zone

**Deliverable**: All templates using unified AnimationEngine

**Validation**:
- [ ] All templates render without errors
- [ ] Animations work correctly
- [ ] No console warnings

---

#### Task 3.4: Deprecate Old Animation Systems
**Files to Deprecate**:
- Keep for backward compatibility initially
- Add deprecation warnings
- Document migration path

**Steps**:
1. [ ] Add deprecation warnings to old animation files:
   - [ ] `console.warn('Use AnimationEngine instead')`
   - [ ] Point to new API
2. [ ] Create migration guide:
   - [ ] Document old → new API mapping
   - [ ] Show examples
3. [ ] Update documentation

**Deliverable**: Old systems deprecated with clear migration path

**Validation**:
- [ ] Deprecation warnings show in console
- [ ] Migration guide is clear

---

### Week 4: Complete JSON Schema

**Objective**: All template features configurable via JSON, no DEFAULT_CONFIG in templates

#### Task 4.1: Audit Template Features
**Files to Review**: All templates with DEFAULT_CONFIG

**Steps**:
1. [ ] Find all DEFAULT_CONFIG objects:
   - [ ] Search codebase for `DEFAULT_CONFIG`
   - [ ] List all files with defaults
2. [ ] For each template, document:
   - [ ] All fields in DEFAULT_CONFIG
   - [ ] Current JSON schema coverage
   - [ ] Missing JSON fields
3. [ ] Create feature coverage matrix:
   - [ ] Template name
   - [ ] Feature
   - [ ] In DEFAULT_CONFIG? (Y/N)
   - [ ] In JSON schema? (Y/N)
   - [ ] Action needed
4. [ ] Document findings in `/docs/audit/json-schema-gaps.md`

**Deliverable**: Complete list of hardcoded configs and JSON gaps

**Validation**:
- [ ] All DEFAULT_CONFIG objects found
- [ ] All gaps documented

---

#### Task 4.2: Extend JSON Schema
**Target**: `/sdk/validation/scene.schema.ts`

**Steps**:
1. [ ] Review feature coverage matrix (Task 4.1)
2. [ ] For each missing field, add to Zod schema:
   - [ ] Add field definition
   - [ ] Add default value (in schema, not template)
   - [ ] Add validation rules
   - [ ] Add JSDoc comments
3. [ ] Ensure schema covers:
   - [ ] All layout options
   - [ ] All animation configs
   - [ ] All effect configs
   - [ ] All style tokens
   - [ ] All timing/beats
4. [ ] Test schema validation:
   - [ ] Valid JSON passes
   - [ ] Invalid JSON fails with helpful errors
   - [ ] Missing fields use schema defaults

**Deliverable**: Complete JSON schema covering all template features

**Validation**:
- [ ] Schema validates all example JSON files
- [ ] Defaults work correctly
- [ ] Error messages are helpful

---

#### Task 4.3: Remove DEFAULT_CONFIG from Templates
**Files to Update**: All templates with DEFAULT_CONFIG

**Steps**:
1. [ ] For each template with DEFAULT_CONFIG:
   - [ ] Remove `DEFAULT_CONFIG` object
   - [ ] Update template to read from `scene` prop only
   - [ ] Use schema defaults if field missing
   - [ ] Test template still renders
2. [ ] Update template logic:
   - [ ] Remove `{ ...DEFAULT_CONFIG, ...scene }` merging
   - [ ] Use `scene.field ?? schemaDefault`
   - [ ] Or rely on schema defaults
3. [ ] Test all templates in showcase zone:
   - [ ] Load with minimal JSON (only required fields)
   - [ ] Verify defaults from schema work
   - [ ] Verify full JSON still works

**Deliverable**: No DEFAULT_CONFIG objects in templates

**Validation**:
- [ ] All templates render with minimal JSON
- [ ] Defaults come from schema
- [ ] No hardcoded configs remain

---

#### Task 4.4: Update Example JSON Files
**Files to Update**: All example scenes in `/scenes/`

**Steps**:
1. [ ] Review all example JSON files
2. [ ] Ensure examples are complete:
   - [ ] Include all common fields
   - [ ] Show best practices
   - [ ] Document optional fields
3. [ ] Create minimal examples:
   - [ ] Show minimum required fields
   - [ ] Show defaults in action
4. [ ] Update documentation:
   - [ ] Reference examples in schema docs
   - [ ] Link examples from templates

**Deliverable**: Complete, accurate example JSON files

**Validation**:
- [ ] All examples validate against schema
- [ ] Examples render correctly
- [ ] Examples are well-documented

---

## Phase 2: JSON-Driven Templates (Weeks 5-8)

**Goal**: Make templates 100% JSON-configurable, build JSON editor, prove architecture

---

### Weeks 5-6: Migrate v6 → v7

**Objective**: Convert all v6 templates to v7 scene-shell architecture

#### Task 5.1: Convert Explain2A to v7
**Source**: `/templates/v6/Explain2AConceptBreakdown_V6.jsx`  
**Target**: Update to use v7 scene-shell pattern

**Steps**:
1. [ ] Review v7 template structure (e.g., `FullFrameScene.jsx`)
2. [ ] Refactor `Explain2AConceptBreakdown_V6.jsx`:
   - [ ] Use scene-shell architecture
   - [ ] Use `HubSpokeScene` mid-scene component
   - [ ] Remove all hardcoded logic
   - [ ] Read all config from JSON
3. [ ] Update example JSON:
   - [ ] Ensure all features configurable
   - [ ] Test with showcase zone
4. [ ] Verify rendering:
   - [ ] Test in showcase zone
   - [ ] Compare with original (no visual regressions)

**Deliverable**: Explain2A using v7 architecture, 100% JSON-driven

**Validation**:
- [ ] Template renders correctly
- [ ] All features JSON-configurable
- [ ] No hardcoded values

---

#### Task 5.2: Convert Hook1A to v7
**Source**: `/templates/v6/Hook1AQuestionBurst_V6.jsx`  
**Target**: v7 scene-shell architecture

**Steps**: (Same pattern as Task 5.1)
1. [ ] Refactor to v7 architecture
2. [ ] Use mid-scene components where applicable
3. [ ] Remove hardcoded logic
4. [ ] Update JSON example
5. [ ] Test in showcase zone

**Deliverable**: Hook1A using v7 architecture, 100% JSON-driven

---

#### Task 5.3: Convert Remaining v6 Templates
**Templates to Convert**: All 17 v6 templates

**Steps**:
1. [ ] List all v6 templates
2. [ ] Convert each template:
   - [ ] Use v7 scene-shell architecture
   - [ ] Use mid-scene components
   - [ ] Remove hardcoded logic
   - [ ] Update JSON examples
3. [ ] Test each template in showcase zone
4. [ ] Update template router if needed

**Deliverable**: All v6 templates using v7 architecture

**Validation**:
- [ ] All templates render correctly
- [ ] All are JSON-driven
- [ ] No regressions

---

### Week 7: JSON Editor

**Objective**: Build JSON editor with autocomplete and validation

#### Task 7.1: Create JSON Editor Component
**Target**: `/components/JSONEditor.jsx`

**Steps**:
1. [ ] Create JSON editor component:
   - [ ] Use Monaco Editor or similar
   - [ ] Syntax highlighting
   - [ ] Auto-formatting
2. [ ] Add autocomplete:
   - [ ] Based on JSON schema
   - [ ] Suggest valid fields
   - [ ] Show field descriptions
3. [ ] Add real-time validation:
   - [ ] Validate against Zod schema
   - [ ] Show errors inline
   - [ ] Show warnings
4. [ ] Add helpful error messages:
   - [ ] Point to exact field
   - [ ] Suggest fixes
   - [ ] Link to documentation

**Deliverable**: JSON editor component with autocomplete and validation

**Validation**:
- [ ] Autocomplete works
- [ ] Validation catches errors
- [ ] Error messages are helpful

---

#### Task 7.2: Integrate JSON Editor with Admin UI
**Target**: `/admin/UnifiedAdminConfig.jsx`

**Steps**:
1. [ ] Add JSON editing mode to admin UI
2. [ ] Allow switching between visual and JSON modes
3. [ ] Sync changes between modes
4. [ ] Add preview in real-time
5. [ ] Add export JSON functionality

**Deliverable**: JSON editor integrated into admin UI

**Validation**:
- [ ] Can edit JSON in admin UI
- [ ] Changes reflect in preview
- [ ] Can export JSON

---

### Week 8: Template-Agnostic Renderer

**Objective**: Prove architecture - render any scene from JSON only

#### Task 8.1: Create SceneRenderer Component
**Target**: `/components/SceneRenderer.jsx`

**Steps**:
1. [ ] Create `SceneRenderer` component:
   - [ ] Accepts JSON scene as prop
   - [ ] Reads `template_id` from JSON
   - [ ] Routes to appropriate template
   - [ ] No template-specific code
2. [ ] Ensure all templates work:
   - [ ] Test with all v6 templates
   - [ ] Test with all v7 templates
   - [ ] Test with showcase scenes
3. [ ] Add error handling:
   - [ ] Invalid template_id
   - [ ] Missing required fields
   - [ ] Validation errors

**Deliverable**: Template-agnostic SceneRenderer

**Validation**:
- [ ] Can render any template from JSON
- [ ] No hardcoded template logic
- [ ] Error handling works

---

#### Task 8.2: Update Main Composition
**Target**: `/MainComposition.jsx` or main entry point

**Steps**:
1. [ ] Update to use `SceneRenderer`
2. [ ] Remove template-specific routing
3. [ ] Load scene from JSON file
4. [ ] Test end-to-end

**Deliverable**: Main composition uses SceneRenderer

**Validation**:
- [ ] Can load any scene from JSON
- [ ] Renders correctly
- [ ] No template-specific code

---

## Phase 3: Polish & Scale (Weeks 9-12)

**Goal**: Standardize effects, enforce guardrails, convert showcase to JSON, optimize

---

### Week 9: Effects Standardization

**Objective**: Organize effects into unified registry

#### Task 9.1: Create EffectsRegistry
**Target**: `/sdk/effects/EffectsRegistry.js`

**Steps**:
1. [ ] Audit all effects:
   - [ ] List all effect components
   - [ ] Document props
   - [ ] Categorize: background, particle, glassmorphic, handwriting
2. [ ] Create EffectsRegistry:
   - [ ] Unified API
   - [ ] Standard props structure
   - [ ] Effect presets
3. [ ] Update templates to use registry
4. [ ] Document all effects

**Deliverable**: Unified effects registry

---

### Week 10: Layout Guardrails

**Objective**: Enforce collision detection and bounds checking

#### Task 10.1: Enforce Collision Detection
**Target**: `/sdk/layout/layoutEngine.js`

**Steps**:
1. [ ] Make collision detection mandatory in `calculateItemPositions()`
2. [ ] Return errors for collisions
3. [ ] Add automatic resolution (optional)
4. [ ] Update templates to handle errors

**Deliverable**: Mandatory collision detection

---

### Week 11: JSON Showcase

**Objective**: Convert showcase to JSON-driven scenes

#### Task 11.1: Convert Showcase Scenes to JSON
**Target**: Convert all showcase compositions to JSON

**Steps**:
1. [ ] Create JSON for each showcase scene
2. [ ] Update showcase compositions to use JSON
3. [ ] Test all scenes render correctly
4. [ ] Update showcase documentation

**Deliverable**: Showcase is JSON-driven

---

### Week 12: Performance & Testing

**Objective**: Optimize performance, add tests, complete documentation

#### Task 12.1: Performance Optimization
**Steps**:
1. [ ] Profile rendering performance
2. [ ] Optimize particle systems
3. [ ] Lazy load heavy effects
4. [ ] Optimize layout calculations

**Deliverable**: Optimized performance

---

#### Task 12.2: Integration Tests
**Steps**:
1. [ ] Test all templates render
2. [ ] Test JSON validation
3. [ ] Test layout guardrails
4. [ ] Test mid-scene components

**Deliverable**: Integration test suite

---

## Progress Tracking

### Format
Use this format to track progress for each task:

```markdown
### Task X.X: [Task Name]
**Status**: ⬜ Not Started | 🟡 In Progress | ✅ Complete | ❌ Blocked  
**Started**: [Date]  
**Completed**: [Date]  
**Notes**: [Any notes, blockers, or decisions]
**Validation**: [Validation results]
```

### Weekly Review
- Review completed tasks
- Identify blockers
- Adjust plan if needed
- Update status

---

## Success Criteria

### Phase 1 Complete When:
- ✅ Single layout engine exists (no duplicates)
- ✅ Mid-scene library has 4+ components
- ✅ Single animation system exists (AnimationEngine)
- ✅ No DEFAULT_CONFIG in templates
- ✅ All templates use unified systems

### Phase 2 Complete When:
- ✅ All v6 templates migrated to v7
- ✅ JSON editor works with autocomplete
- ✅ Template-agnostic renderer works
- ✅ 90%+ JSON configurability

### Phase 3 Complete When:
- ✅ Effects standardized
- ✅ Layout guardrails enforced
- ✅ Showcase is JSON-driven
- ✅ Performance acceptable
- ✅ Tests passing
- ✅ Documentation complete

---

## Questions & Clarifications

**Before starting Phase 1, please clarify:**

1. **Time Estimates**: Should I include time estimates for each task? (e.g., "Task 1.1: 4 hours")

2. **Testing Strategy**: 
   - Should we create automated tests for each phase?
   - What's the preferred testing framework?
   - Should tests be part of each task?

3. **Documentation**:
   - Where should audit documents go? (`/docs/audit/`?)
   - Should we create migration guides for each change?
   - Format preference for documentation?

4. **Showcase Zone Usage**:
   - Should we create a dedicated "Architecture Test" scene in showcase?
   - Or use existing showcase scenes for validation?
   - Should we add a "Test Mode" to showcase preview?

5. **Code Review Process**:
   - Should each task be a separate PR?
   - Or group related tasks?
   - Who reviews?

6. **Backward Compatibility**:
   - How important is backward compatibility during migration?
   - Should old systems work alongside new ones temporarily?
   - Migration timeline for breaking changes?

7. **Priority Adjustments**:
   - Are all critical issues equal priority?
   - Should we adjust order based on dependencies?
   - Any constraints (deadlines, resources)?

**Please review this plan and provide clarifications before we begin Phase 1.**

---

**Plan Version**: 1.0  
**Created**: 2025-01-20  
**Status**: ⬜ Awaiting Review
