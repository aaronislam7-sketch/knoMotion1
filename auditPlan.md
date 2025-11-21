# 🏗️ KnoMotion Architecture Audit Plan

**Goal**: Achieve 100% JSON-driven video creation engine  
**Current State**: 75% complete - Strong foundation, critical gaps remain  
**Timeline**: 12-16 weeks (phased approach)  
**Validation**: Use showcase zone (`/admin/ShowcasePreview.jsx`) for all testing  
**Testing Approach**: Create new showcase scene for each validation/test  
**Documentation**: Audit docs live in root directory  
**Code Review**: Grouped PRs (not per-task)  
**Build Requirement**: Build must always pass - can sunset old templates to `/templates/legacy/` if needed

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
- `/sdk/layout/layoutEngine.js` (canonical - **KEEP THIS**)
- `/sdk/layout/layoutEngineV2.js` (EXACT duplicate of layoutEngine.js - **REMOVE**)
- `/sdk/layout/layout-resolver.js` (collision detection & safe positioning - **INTEGRATE INTO layoutEngine.js**)
- `/sdk/layout/positionSystem.js` (legacy 9-point grid - **LOW PRIORITY**)

**Evidence**: Duplicate systems exist, layout-resolver should be part of layoutEngine  
**Note**: SceneRenderer should make minimal positioning calls - layout engine handles all positioning logic

---

### 🔴 CRITICAL-2: No Mid-Scene Library
**Impact**: Can't reuse composed component patterns, no pre-built glue between elements/animations/effects  
**Files Affected**:
- New mid-scenes need to be created in `/sdk/mid-scenes/`

**What Mid-Scenes Are**:
- **NOT layouts** - they are composed components that glue together:
  - Atomic elements (Text, Button, Badge, etc.)
  - Composition elements (HeroWithText, CardWithIcon, etc.)
  - Animations (entrance, exit, continuous)
  - Effects (particles, glow, etc.)
- Each mid-scene is a pre-built, JSON-configurable component
- Goal: LLM can generate JSON to use these mid-scenes

**Example Mid-Scene**: `HeroTextEntranceExit`
- Combines: Hero (image/lottie) + Text + Entrance animation + Exit animation
- All configurable via JSON with beats for timing
- Schema example:
  ```json
  {
    "text": "Hello World",
    "heroType": "image",
    "heroRef": "/imagePath",
    "animationEntrance": "fadeIn",
    "animationExit": "fadeOut",
    "beats": {
      "entrance": 1.0,
      "exit": 5.0
    }
  }
  ```

**Patterns to Create**:
- HeroTextEntranceExit (hero + text + animations)
- CardSequence (multiple cards with stagger animations)
- IconGrid (grid of icons with entrance animations)
- TextRevealSequence (text lines with reveal animations)
- (More to be identified based on common patterns)

---

### 🔴 CRITICAL-3: Legacy Templates (v6/v7)
**Impact**: Old template approach - focus should be on new architecture, not refactoring old templates  
**Files Affected**:
- `/templates/v6/` (17 templates)
- `/templates/v7/` (9 templates)

**Action**: **SUNSET** these templates safely to `/templates/legacy/` to ensure correct focus on new build  
**Note**: Showcase compositions can remain as-is for visualization purposes (they demonstrate capabilities)

---

### 🔴 CRITICAL-4: Animation System Fragmentation
**Impact**: Multiple animation systems exist, but acceptable if no build issues  
**Files Affected**:
- `/sdk/animations/animations.js` (basic animations)
- `/sdk/animations/microDelights.jsx` (sophisticated)
- `/sdk/animations/broadcastAnimations.ts` (broadcast-quality)
- `/sdk/animations/continuousLife.js` (continuous)

**Action**: Keep fragmentation if no build issues. If issues arise, sunset old templates to legacy for focus.

---

## Phase 1: Foundation (Weeks 1-4)

**Goal**: Fix critical architecture issues - consolidate systems, extract patterns, unify APIs

---

### Week 1: Consolidate Layout Engine

**Objective**: Single canonical layout system for all templates

#### Task 1.1: Audit Layout Systems
**Files to Review**:
- `/sdk/layout/layoutEngine.js` (canonical - **KEEP**)
- `/sdk/layout/layoutEngineV2.js` (EXACT duplicate - **REMOVE**)
- `/sdk/layout/layout-resolver.js` (collision detection - **INTEGRATE INTO layoutEngine.js**)
- `/sdk/layout/positionSystem.js` (legacy - **LOW PRIORITY**)

**Steps**:
1. [ ] Verify `layoutEngineV2.js` is exact duplicate of `layoutEngine.js`
2. [ ] Review `layout-resolver.js` functions:
   - [ ] `findSafePosition()` - collision-aware positioning
   - [ ] `autoResolveCollisions()` - automatic collision resolution
   - [ ] Other utility functions
3. [ ] Document what needs to be integrated from layout-resolver into layoutEngine
4. [ ] Document findings in `/audit/layout-system-audit.md` (root directory)

**Deliverable**: Audit document confirming duplicates and integration plan

**Validation**: 
- Review audit document
- Confirm layoutEngineV2 is duplicate (safe to remove)
- Confirm layout-resolver functions to integrate

---

#### Task 1.2: Create Unified Layout Engine
**Target File**: `/sdk/layout/layoutEngine.js` (enhance existing)

**Steps**:
1. [ ] Review audit findings (Task 1.1)
2. [ ] Integrate `layout-resolver.js` functions into `layoutEngine.js`:
   - [ ] Add `findSafePosition()` function (collision-aware positioning)
   - [ ] Add `autoResolveCollisions()` function (automatic resolution)
   - [ ] Import collision detection utilities from `/sdk/validation/collision-detection.js`
   - [ ] Ensure layout-resolver logic is called from within layoutEngine
3. [ ] Enhance `calculateItemPositions()`:
   - [ ] Add optional collision detection (use `findSafePosition` when enabled)
   - [ ] Add automatic bounds checking
   - [ ] Return `{ positions: [], warnings: [], errors: [] }` structure
4. [ ] Ensure all 7 arrangement types work: STACKED_VERTICAL, STACKED_HORIZONTAL, GRID, CIRCULAR, RADIAL, CASCADE, CENTERED
5. [ ] Create layout validation API:
   - [ ] `validateLayout(layout, canvas)` function
   - [ ] Returns `{ valid: boolean, errors: [], warnings: [] }`
6. [ ] Update exports in `/sdk/layout/layoutEngine.js`
7. [ ] Update SDK main index `/sdk/index.js` to export unified engine
8. [ ] **Important**: Ensure SceneRenderer makes minimal positioning calls - layoutEngine handles all logic

**Deliverable**: Enhanced unified layout engine with integrated collision detection and safe positioning

**Validation**:
- [ ] Test all 7 arrangement types work
- [ ] Test collision detection catches overlaps
- [ ] Test bounds checking catches violations
- [ ] Test safe positioning finds collision-free positions
- [ ] Create new showcase scene: `ShowcaseScene5_LayoutEngineTest.jsx` for validation

---

#### Task 1.3: Update Showcase & New Code to Use Unified Engine
**Files to Update**: Showcase compositions and any new code

**Steps**:
1. [ ] Find showcase compositions using layout:
   - [ ] Check `/compositions/ShowcaseScene3_LayoutShowcase.jsx`
   - [ ] Check other showcase scenes if they use layout
2. [ ] Update showcase compositions:
   - [ ] Change imports to use unified `layoutEngine.js`
   - [ ] Update function calls if API changed
   - [ ] Test scenes still render
3. [ ] Check for any other files importing from layout:
   - [ ] Search codebase for layout imports
   - [ ] Update if found (excluding legacy templates)
4. [ ] Test in showcase zone:
   - [ ] Load updated showcase scenes
   - [ ] Verify layouts render correctly
   - [ ] Check for console errors

**Deliverable**: Showcase and new code using unified layout engine

**Validation**:
- [ ] Showcase scenes render without errors
- [ ] Layouts look correct in showcase zone
- [ ] No console warnings about layout
- [ ] New showcase test scene (Task 1.2) works correctly

---

#### Task 1.4: Remove Duplicate Layout Systems
**Files to Remove**:
- `/sdk/layout/layoutEngineV2.js` (EXACT duplicate - **DELETE**)
- `/sdk/layout/layout-resolver.js` (integrated into layoutEngine - **DELETE** after integration)

**Steps**:
1. [ ] Verify layout-resolver functions integrated (Task 1.2 complete)
2. [ ] Verify showcase updated (Task 1.3 complete)
3. [ ] Check for any files importing from deprecated systems:
   - [ ] Search codebase for `layoutEngineV2` imports
   - [ ] Search codebase for `layout-resolver` imports
   - [ ] Update any remaining imports (excluding legacy templates)
4. [ ] Delete duplicate files:
   - [ ] Delete `/sdk/layout/layoutEngineV2.js`
   - [ ] Delete `/sdk/layout/layout-resolver.js`
   - [ ] Document removal in commit message
5. [ ] Verify build passes:
   - [ ] Run build
   - [ ] Fix any import errors
   - [ ] Ensure no broken references

**Deliverable**: Duplicate layout systems removed, build passes

**Validation**:
- [ ] No files import from deleted systems (except legacy)
- [ ] Build succeeds
- [ ] Showcase scenes still work
- [ ] New test scene (Task 1.2) works

---

### Week 2: Create Mid-Scene Library

**Objective**: Create composed components that glue elements, animations, and effects together - pre-built for LLM JSON generation

#### Task 2.1: Create HeroTextEntranceExit Mid-Scene
**Target**: `/sdk/mid-scenes/HeroTextEntranceExit.jsx`

**What It Does**: Combines hero (image/lottie), text, entrance animation, and exit animation - all JSON-configurable

**Steps**:
1. [ ] Create `/sdk/mid-scenes/HeroTextEntranceExit.jsx`:
   - [ ] Component signature: `HeroTextEntranceExit({ config, frame, fps })`
   - [ ] Accepts JSON config with: text, heroType, heroRef, animationEntrance, animationExit, beats
   - [ ] Renders hero using `renderHero()` from SDK
   - [ ] Renders text using `Text` element from SDK
   - [ ] Applies entrance animation at `beats.entrance`
   - [ ] Applies exit animation at `beats.exit`
   - [ ] All values from config (no hardcoded defaults)
2. [ ] Create JSON schema for this mid-scene:
   - [ ] File: `/sdk/mid-scenes/schemas/HeroTextEntranceExit.schema.json`
   - [ ] Schema structure:
     ```json
     {
       "text": "string (required)",
       "heroType": "image | lottie | svg (required)",
       "heroRef": "string (required)",
       "animationEntrance": "fadeIn | slideIn | scaleIn | ... (optional)",
       "animationExit": "fadeOut | slideOut | scaleOut | ... (optional)",
       "beats": {
         "entrance": "number (seconds, required)",
         "exit": "number (seconds, required)"
       },
       "position": "object (optional - uses layout engine)",
       "style": "object (optional)"
     }
     ```
3. [ ] Export from `/sdk/mid-scenes/index.js`
4. [ ] Update SDK main index `/sdk/index.js`
5. [ ] Create example JSON: `/scenes/examples/hero-text-entrance-exit.json`

**Deliverable**: `HeroTextEntranceExit` mid-scene component with schema

**Validation**:
- [ ] Create new showcase scene: `ShowcaseScene6_MidSceneHeroText.jsx`
- [ ] Test with example JSON in showcase zone
- [ ] Verify entrance animation works at correct beat
- [ ] Verify exit animation works at correct beat
- [ ] Verify hero renders (image and lottie variants)
- [ ] Verify text renders

---

#### Task 2.2: Create CardSequence Mid-Scene
**Target**: `/sdk/mid-scenes/CardSequence.jsx`

**What It Does**: Renders multiple cards in sequence with stagger animations - combines Card elements with entrance animations

**Steps**:
1. [ ] Create `/sdk/mid-scenes/CardSequence.jsx`:
   - [ ] Component signature: `CardSequence({ config, frame, fps })`
   - [ ] Accepts array of cards with content
   - [ ] Uses unified layout engine for positioning (STACKED_VERTICAL or GRID)
   - [ ] Applies stagger entrance animations
   - [ ] All configurable via JSON
2. [ ] Create JSON schema: `/sdk/mid-scenes/schemas/CardSequence.schema.json`
   - [ ] Schema includes: cards array, layout type, stagger delay, animations
3. [ ] Export from mid-scenes index
4. [ ] Create example JSON: `/scenes/examples/card-sequence.json`

**Deliverable**: `CardSequence` mid-scene component

**Validation**:
- [ ] Create new showcase scene: `ShowcaseScene7_MidSceneCardSequence.jsx`
- [ ] Test with example JSON in showcase zone
- [ ] Verify cards render in correct layout
- [ ] Verify stagger animations work
- [ ] Verify all configurable via JSON

---

#### Task 2.3: Create TextRevealSequence Mid-Scene ✅ COMPLETE
**Status**: ✅ Complete  
**Completed**: 2025-11-21  
**Target**: `/sdk/mid-scenes/TextRevealSequence.jsx`

**What It Does**: Renders multiple text lines with reveal animations (typewriter, fade, slide, mask) - combines Text elements with animations

**Steps**:
1. [✅] Create `/sdk/mid-scenes/TextRevealSequence.jsx`:
   - [✅] Component signature: `TextRevealSequence({ config })`
   - [✅] Accepts array of text lines with emphasis support
   - [✅] Applies reveal animations (typewriter, fade, slide, mask) per line
   - [✅] Supports direction for slide/mask reveals (up, down, left, right)
   - [✅] Supports stagger timing
   - [✅] Uses theme line spacing tokens (tight, normal, relaxed, loose)
   - [✅] Emphasis as visual effect (weight, color, highlighting)
   - [✅] All configurable via JSON
2. [✅] Create JSON schema: `/sdk/mid-scenes/schemas/TextRevealSequence.schema.json`
   - [✅] Schema includes: lines array, reveal type, direction, stagger delay, line spacing, beats
3. [✅] Export from mid-scenes index
4. [✅] Create example JSON: `/scenes/examples/text-reveal-sequence.json`
5. [✅] Add line spacing tokens to theme: `/sdk/theme/knodeTheme.ts`
   - [✅] Added lineSpacingTight, lineSpacingNormal, lineSpacingRelaxed, lineSpacingLoose

**Deliverable**: `TextRevealSequence` mid-scene component with full feature set

**Validation**:
- [✅] Updated ShowcaseScene7 to include TextRevealSequence tests (renamed to "Mid-Scene Tests")
- [✅] Test with 3 different reveal types: typewriter, fade, slide
- [✅] Verify text lines reveal correctly
- [✅] Verify stagger timing works
- [✅] Verify direction support works
- [✅] Verify emphasis styles work (high/normal/low)
- [✅] Verify all configurable via JSON
- [✅] Build passes with no errors
- [✅] No linter errors

---

#### Task 2.4: Create IconGrid Mid-Scene
**Target**: `/sdk/mid-scenes/IconGrid.jsx`

**What It Does**: Renders grid of icons with entrance animations - combines Icon elements with grid layout and animations

**Steps**:
1. [ ] Create `/sdk/mid-scenes/IconGrid.jsx`:
   - [ ] Component signature: `IconGrid({ config, frame, fps })`
   - [ ] Accepts array of icons
   - [ ] Uses unified layout engine (GRID arrangement)
   - [ ] Applies entrance animations (stagger or cascade)
   - [ ] All configurable via JSON
2. [ ] Create JSON schema: `/sdk/mid-scenes/schemas/IconGrid.schema.json`
   - [ ] Schema includes: icons array, grid columns, animation type, beats
3. [ ] Export from mid-scenes index
4. [ ] Create example JSON: `/scenes/examples/icon-grid.json`

**Deliverable**: `IconGrid` mid-scene component

**Validation**:
- [ ] Create new showcase scene: `ShowcaseScene9_MidSceneIconGrid.jsx`
- [ ] Test with example JSON in showcase zone
- [ ] Verify icons render in grid
- [ ] Verify entrance animations work
- [ ] Verify all configurable via JSON

---

#### Task 2.5: Create Mid-Scene Index & Documentation
**Target**: `/sdk/mid-scenes/index.js` and `/sdk/mid-scenes/README.md`

**Steps**:
1. [ ] Create `/sdk/mid-scenes/index.js`:
   - [ ] Export `HeroTextEntranceExit`
   - [ ] Export `CardSequence`
   - [ ] Export `TextRevealSequence`
   - [ ] Export `IconGrid`
2. [ ] Update `/sdk/index.js` to export mid-scenes
3. [ ] Create `/sdk/mid-scenes/README.md`:
   - [ ] Document what mid-scenes are (composed components, not layouts)
   - [ ] Document each mid-scene component
   - [ ] Show usage examples with JSON
   - [ ] Link to schema files
   - [ ] Link to example JSON files
   - [ ] Explain goal: pre-built for LLM JSON generation
4. [ ] Create consolidated schema file: `/sdk/mid-scenes/schemas/index.ts` (exports all schemas)
5. [ ] Update main SDK.md documentation

**Deliverable**: Mid-scene library documented and exported

**Validation**:
- [ ] All mid-scenes importable from SDK
- [ ] Documentation is clear
- [ ] Examples work
- [ ] Schemas are accessible

---

### Week 3: Animation System (Keep Fragmentation)

**Objective**: Document animation systems, ensure no build issues. Keep fragmentation if working.

#### Task 3.1: Audit Animation Systems (Documentation Only)
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

**Deliverable**: Complete documentation of all animation functions

**Validation**:
- [ ] All animation functions documented
- [ ] Categories are clear
- [ ] Documentation is in `/audit/animation-system-audit.md`

---

#### Task 3.2: Verify Build Stability (Skip if No Issues)
**Steps**:
1. [ ] Run build to check for animation system conflicts
2. [ ] Test showcase scenes that use animations
3. [ ] If build issues found:
   - [ ] Document issues
   - [ ] Consider sunsetting problematic templates to legacy
4. [ ] If no build issues:
   - [ ] Keep fragmentation as-is
   - [ ] Document that multiple systems are acceptable

**Deliverable**: Build stability verified, fragmentation acceptable if no issues

**Validation**:
- [ ] Build passes
- [ ] Showcase scenes work
- [ ] No animation-related errors

---

### Week 4: Sunset Legacy Templates & Complete Mid-Scene Schemas

**Objective**: Safely move old templates to legacy, complete mid-scene JSON schemas

#### Task 4.1: Sunset v6/v7 Templates to Legacy
**Source**: `/templates/v6/` and `/templates/v7/`  
**Target**: `/templates/legacy/`

**Steps**:
1. [ ] Create `/templates/legacy/` directory structure:
   - [ ] `/templates/legacy/v6/`
   - [ ] `/templates/legacy/v7/`
2. [ ] Move all v6 templates:
   - [ ] Move 17 templates from `/templates/v6/` to `/templates/legacy/v6/`
   - [ ] Update any imports if needed
3. [ ] Move all v7 templates:
   - [ ] Move 9 templates from `/templates/v7/` to `/templates/legacy/v7/`
   - [ ] Update any imports if needed
4. [ ] Update TemplateRouter:
   - [ ] Remove v6/v7 from active registries
   - [ ] Add to legacy registry (optional - for backward compat)
   - [ ] Or remove entirely if not needed
5. [ ] Verify build passes:
   - [ ] Run build
   - [ ] Fix any broken imports
   - [ ] Ensure showcase still works
6. [ ] Create `/templates/legacy/README.md`:
   - [ ] Document why moved to legacy
   - [ ] Note: Focus on new architecture
   - [ ] Link to new approach

**Deliverable**: Legacy templates safely moved, build passes

**Validation**:
- [ ] Build passes
- [ ] No broken imports
- [ ] Showcase still works
- [ ] Legacy templates in correct location

---

#### Task 4.2: Complete Mid-Scene JSON Schemas
**Target**: All mid-scene schema files

**Steps**:
1. [ ] Review all mid-scene schemas created in Week 2:
   - [ ] `HeroTextEntranceExit.schema.json`
   - [ ] `CardSequence.schema.json`
   - [ ] `TextRevealSequence.schema.json`
   - [ ] `IconGrid.schema.json`
2. [ ] Ensure schemas are complete:
   - [ ] All required fields documented
   - [ ] All optional fields documented
   - [ ] Default values specified
   - [ ] Validation rules clear
3. [ ] Create TypeScript/Zod schemas if needed:
   - [ ] For runtime validation
   - [ ] For type safety
4. [ ] Create consolidated schema index:
   - [ ] `/sdk/mid-scenes/schemas/index.ts`
   - [ ] Exports all schemas
   - [ ] Provides validation functions
5. [ ] Update documentation:
   - [ ] Link schemas in mid-scenes README
   - [ ] Show example JSON for each

**Deliverable**: Complete mid-scene schemas with validation

**Validation**:
- [ ] All schemas are complete
- [ ] Validation works
- [ ] Examples validate correctly
- [ ] Documentation is clear

---

#### Task 4.3: Create Scene Schema for Mid-Scenes
**Target**: `/sdk/validation/scene.schema.ts` (extend for mid-scenes)

**Steps**:
1. [ ] Review current scene schema
2. [ ] Add mid-scene support:
   - [ ] Add `midScenes` array field
   - [ ] Each mid-scene has `type` and `config`
   - [ ] Type discriminates which schema to use
3. [ ] Ensure schema covers:
   - [ ] All mid-scene types
   - [ ] All config options
   - [ ] Timing/beats for mid-scenes
4. [ ] Test schema validation:
   - [ ] Valid mid-scene JSON passes
   - [ ] Invalid JSON fails with helpful errors

**Deliverable**: Scene schema supports mid-scenes

**Validation**:
- [ ] Schema validates mid-scene JSON
- [ ] Error messages are helpful
- [ ] Examples work

---

## Phase 2: JSON-Driven System (Weeks 5-8)

**Goal**: Build JSON editor, create SceneRenderer, prove architecture with mid-scenes

---

### Week 5: Create SceneRenderer

**Objective**: Template-agnostic renderer that uses mid-scenes from JSON

#### Task 5.1: Create SceneRenderer Component
**Target**: `/components/SceneRenderer.jsx`

**Steps**:
1. [ ] Create `SceneRenderer` component:
   - [ ] Accepts JSON scene as prop
   - [ ] Reads scene structure from JSON
   - [ ] Renders mid-scenes based on JSON config
   - [ ] Uses unified layout engine (minimal positioning calls)
   - [ ] No template-specific code
2. [ ] Support mid-scene rendering:
   - [ ] Read `midScenes` array from JSON
   - [ ] For each mid-scene, render appropriate component
   - [ ] Pass config from JSON to mid-scene
3. [ ] Handle timing/beats:
   - [ ] Read beats from JSON
   - [ ] Apply timing to mid-scenes
   - [ ] Handle scene transitions
4. [ ] Add error handling:
   - [ ] Invalid mid-scene type
   - [ ] Missing required fields
   - [ ] Validation errors
5. [ ] Export from components

**Deliverable**: Template-agnostic SceneRenderer using mid-scenes

**Validation**:
- [ ] Create new showcase scene: `ShowcaseScene10_SceneRendererTest.jsx`
- [ ] Test with JSON containing multiple mid-scenes
- [ ] Verify all mid-scenes render correctly
- [ ] Verify timing works
- [ ] Verify no template-specific code

---

#### Task 5.2: Create Example JSON Scenes Using Mid-Scenes
**Target**: `/scenes/examples/` (new examples)

**Steps**:
1. [ ] Create example: `hero-text-scene.json`:
   - [ ] Uses `HeroTextEntranceExit` mid-scene
   - [ ] Shows all config options
2. [ ] Create example: `card-sequence-scene.json`:
   - [ ] Uses `CardSequence` mid-scene
   - [ ] Shows stagger animations
3. [ ] Create example: `text-reveal-scene.json`:
   - [ ] Uses `TextRevealSequence` mid-scene
   - [ ] Shows typewriter effect
4. [ ] Create example: `icon-grid-scene.json`:
   - [ ] Uses `IconGrid` mid-scene
   - [ ] Shows grid layout
5. [ ] Create example: `multi-midscene-scene.json`:
   - [ ] Uses multiple mid-scenes in sequence
   - [ ] Shows scene composition

**Deliverable**: Example JSON scenes using mid-scenes

**Validation**:
- [ ] All examples validate against schema
- [ ] All examples render in SceneRenderer
- [ ] Test in showcase zone

---

### Week 6: JSON Editor

**Objective**: Build JSON editor with autocomplete and validation

#### Task 6.1: Create JSON Editor Component
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

#### Task 6.2: Integrate JSON Editor with Admin UI
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

### Week 7: Integrate SceneRenderer & Update Main Composition

**Objective**: Use SceneRenderer in main app, prove end-to-end JSON workflow

#### Task 7.1: Update Main Composition
**Target**: `/MainComposition.jsx` or main entry point

**Steps**:
1. [ ] Update main composition to use `SceneRenderer`
2. [ ] Remove template-specific routing (TemplateRouter)
3. [ ] Load scene from JSON file
4. [ ] Support loading from URL or file
5. [ ] Test end-to-end

**Deliverable**: Main composition uses SceneRenderer

**Validation**:
- [ ] Can load scene from JSON
- [ ] Renders correctly
- [ ] No template-specific code
- [ ] Test in showcase zone

---

#### Task 7.2: Create Full Example Scene
**Target**: Complete example using multiple mid-scenes

**Steps**:
1. [ ] Create comprehensive example JSON:
   - [ ] Uses all 4 mid-scenes
   - [ ] Shows timing/beats
   - [ ] Shows transitions
2. [ ] Test in SceneRenderer
3. [ ] Document as reference example
4. [ ] Add to showcase

**Deliverable**: Complete example scene

**Validation**:
- [ ] Example renders correctly
- [ ] All mid-scenes work together
- [ ] Timing is correct

---

## Phase 3: Polish & Scale (Weeks 8-12)

**Goal**: Standardize effects, enforce guardrails, optimize, complete documentation

---

### Week 8: Effects Standardization (Optional)

**Objective**: Organize effects into unified registry

#### Task 8.1: Create EffectsRegistry
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

### Week 9: Layout Guardrails

**Objective**: Enforce collision detection and bounds checking

#### Task 9.1: Enforce Collision Detection
**Target**: `/sdk/layout/layoutEngine.js`

**Steps**:
1. [ ] Make collision detection mandatory in `calculateItemPositions()`
2. [ ] Return errors for collisions
3. [ ] Add automatic resolution (optional)
4. [ ] Update templates to handle errors

**Deliverable**: Mandatory collision detection

---

### Week 10: Additional Mid-Scenes (Based on Needs)

**Objective**: Convert showcase to JSON-driven scenes

#### Task 10.1: Identify Additional Mid-Scene Needs
**Steps**:
1. [ ] Review common video patterns
2. [ ] Identify missing mid-scene patterns
3. [ ] Prioritize based on usage
4. [ ] Create additional mid-scenes as needed

**Deliverable**: Additional mid-scenes based on needs

---

### Week 11: Performance & Optimization

**Objective**: Optimize performance, add tests, complete documentation

#### Task 11.1: Performance Optimization
**Steps**:
1. [ ] Profile rendering performance
2. [ ] Optimize particle systems
3. [ ] Lazy load heavy effects
4. [ ] Optimize layout calculations
5. [ ] Optimize mid-scene rendering

**Deliverable**: Optimized performance

---

#### Task 11.2: Integration Tests
**Steps**:
1. [ ] Test all mid-scenes render
2. [ ] Test JSON validation
3. [ ] Test layout guardrails
4. [ ] Test SceneRenderer
5. [ ] Test example scenes

**Deliverable**: Integration test suite

---

### Week 12: Documentation & Final Polish

**Objective**: Complete documentation, final review

#### Task 12.1: Complete Documentation
**Steps**:
1. [ ] Update main README with new architecture
2. [ ] Document mid-scene system
3. [ ] Document SceneRenderer
4. [ ] Create JSON reference guide
5. [ ] Create migration guide (if needed)

**Deliverable**: Complete documentation

---

#### Task 12.2: Final Review & Cleanup
**Steps**:
1. [ ] Review all code
2. [ ] Remove unused files
3. [ ] Update all documentation
4. [ ] Final testing in showcase
5. [ ] Prepare for LLM JSON generation

**Deliverable**: Production-ready system

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

## Clarifications Received

✅ **Time Estimates**: No need for time estimates  
✅ **Testing Strategy**: Test outputs in Showcase zone  
✅ **Documentation**: Audit docs live in root directory (`/audit/`)  
✅ **Showcase Zone**: Add new scene each time for validation  
✅ **Code Review**: Grouped PRs (not per-task)  
✅ **Backward Compatibility**: Build must always pass - can sunset old templates to `/templates/legacy/`  
✅ **Priority**: Use suggested approach, no adjustments needed

### Key Clarifications:

1. **Layout Engine**:
   - `layoutEngineV2.js` is EXACT duplicate of `layoutEngine.js` - can drop one
   - `positionSystem.js` is legacy, less important now
   - `layout-resolver.js` should exist inside layoutEngine OR be called from there
   - SceneRenderer should make minimal positioning calls

2. **Mid-Scene Library**:
   - **NOT layouts** - they are glue between elements, animations, effects
   - Example: `HeroTextEntranceExit` - combines hero + text + entrance/exit animations
   - All configurable via JSON with beats
   - Goal: Pre-built for LLM JSON generation

3. **Templates**:
   - Don't refactor v6/v7 templates
   - Sunset them safely to `/templates/legacy/`
   - Focus on new architecture
   - Showcase can stay as-is for visualization

4. **Animation System**:
   - Keep fragmentation if no build issues
   - Sunset old templates if needed for focus

---

**Plan Status**: ✅ Ready to Execute  
**Next Step**: Begin Phase 1, Week 1, Task 1.1

---

**Plan Version**: 2.0  
**Created**: 2025-01-20  
**Updated**: 2025-01-20 (with clarifications)  
**Status**: ✅ Ready to Execute
