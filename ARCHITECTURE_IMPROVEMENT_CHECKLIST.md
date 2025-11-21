# ✅ KnoMotion Architecture Improvement Checklist

**Use this checklist to track progress toward 100% JSON-driven architecture**

---

## 🔴 Phase 1: Foundation (Weeks 1-4) - CRITICAL

### Week 1: Consolidate Layout Engine

- [ ] **Audit Layout Systems**
  - [ ] Document differences between `layoutEngine.js`, `layoutEngineV2.js`, `layout-resolver.js`
  - [ ] Identify best features from each system
  - [ ] Create comparison table
  - [ ] Choose canonical system (recommend `layoutEngine.js`)

- [ ] **Create Unified Layout Engine**
  - [ ] Merge best features into single `LayoutEngine` class
  - [ ] Ensure all 7 arrangement types work
  - [ ] Add mandatory collision detection
  - [ ] Add automatic bounds checking
  - [ ] Create layout validation API

- [ ] **Migrate Templates**
  - [ ] Update all v6 templates to use unified engine
  - [ ] Update all v7 templates to use unified engine
  - [ ] Update showcase compositions
  - [ ] Test all templates render correctly

- [ ] **Cleanup**
  - [ ] Remove `layoutEngineV2.js`
  - [ ] Remove `layout-resolver.js` (or merge into main)
  - [ ] Update all imports
  - [ ] Update documentation

---

### Week 2: Create Mid-Scene Library

- [ ] **Extract HubSpokeScene**
  - [ ] Copy hub-spoke logic from `Explain2AConceptBreakdown_V6.jsx`
  - [ ] Create `/sdk/mid-scenes/HubSpokeScene.jsx`
  - [ ] Make it JSON-configurable
  - [ ] Update `Explain2A` to use new component
  - [ ] Test rendering

- [ ] **Extract GridScene**
  - [ ] Copy grid logic from `Compare12MatrixGrid_V6.jsx`
  - [ ] Create `/sdk/mid-scenes/GridScene.jsx`
  - [ ] Make it JSON-configurable
  - [ ] Update `Compare12` to use new component
  - [ ] Test rendering

- [ ] **Extract StackScene**
  - [ ] Copy stack logic from `Guide10StepSequence_V6.jsx`
  - [ ] Create `/sdk/mid-scenes/StackScene.jsx`
  - [ ] Make it JSON-configurable
  - [ ] Update `Guide10` to use new component
  - [ ] Test rendering

- [ ] **Extract CascadeScene**
  - [ ] Copy cascade logic from `Reveal9ProgressiveUnveil_V6.jsx`
  - [ ] Create `/sdk/mid-scenes/CascadeScene.jsx`
  - [ ] Make it JSON-configurable
  - [ ] Update `Reveal9` to use new component
  - [ ] Test rendering

- [ ] **Create Mid-Scene Index**
  - [ ] Create `/sdk/mid-scenes/index.js`
  - [ ] Export all mid-scenes
  - [ ] Update SDK main index
  - [ ] Document mid-scene API

---

### Week 3: Unify Animation System

- [ ] **Audit Animation Systems**
  - [ ] List all functions in `animations.js`
  - [ ] List all functions in `microDelights.jsx`
  - [ ] List all functions in `broadcastAnimations.ts`
  - [ ] List all functions in `continuousLife.js`
  - [ ] Document function signatures
  - [ ] Identify duplicates

- [ ] **Create AnimationEngine**
  - [ ] Create `/sdk/animations/AnimationEngine.js`
  - [ ] Categorize animations: `entrance`, `exit`, `continuous`, `micro-delights`
  - [ ] Standardize function signature: `getAnimation(frame, config, fps)`
  - [ ] Migrate all animation functions
  - [ ] Create unified API

- [ ] **Update Templates**
  - [ ] Update all templates to use `AnimationEngine`
  - [ ] Remove direct imports of old animation systems
  - [ ] Test all animations work
  - [ ] Update documentation

- [ ] **Cleanup**
  - [ ] Deprecate old animation files (keep for backward compat initially)
  - [ ] Update SDK exports
  - [ ] Create migration guide

---

### Week 4: Complete JSON Schema

- [ ] **Audit Template Features**
  - [ ] List all `DEFAULT_CONFIG` objects in templates
  - [ ] Document all hardcoded values
  - [ ] Identify missing JSON schema fields
  - [ ] Create feature coverage matrix

- [ ] **Extend JSON Schema**
  - [ ] Add missing fields to `scene.schema.ts`
  - [ ] Add defaults to schema (not templates)
  - [ ] Ensure all template features are configurable
  - [ ] Test schema validation

- [ ] **Remove DEFAULT_CONFIG**
  - [ ] Remove `DEFAULT_CONFIG` from `Explain2A`
  - [ ] Remove `DEFAULT_CONFIG` from `Hook1A`
  - [ ] Remove `DEFAULT_CONFIG` from all v6 templates
  - [ ] Remove `DEFAULT_CONFIG` from all v7 templates
  - [ ] Ensure templates read from JSON only

- [ ] **Update Examples**
  - [ ] Update all example JSON files
  - [ ] Ensure examples are complete
  - [ ] Test all examples render
  - [ ] Document JSON structure

---

## 🟡 Phase 2: JSON-Driven Templates (Weeks 5-8) - HIGH

### Weeks 5-6: Migrate v6 → v7

- [ ] **Convert Explain2A**
  - [ ] Migrate to v7 scene-shell architecture
  - [ ] Use mid-scene components
  - [ ] Move all config to JSON
  - [ ] Test rendering
  - [ ] Update example JSON

- [ ] **Convert Hook1A**
  - [ ] Migrate to v7 scene-shell architecture
  - [ ] Use mid-scene components
  - [ ] Move all config to JSON
  - [ ] Test rendering
  - [ ] Update example JSON

- [ ] **Convert Remaining v6 Templates**
  - [ ] Convert all 17 v6 templates
  - [ ] Use scene-shell architecture
  - [ ] Use mid-scene components
  - [ ] Move all config to JSON
  - [ ] Test all templates

- [ ] **Update Template Router**
  - [ ] Ensure v6 templates still work (backward compat)
  - [ ] Update routing logic
  - [ ] Test template detection

---

### Week 7: JSON Editor

- [ ] **Build JSON Editor**
  - [ ] Create JSON editor component
  - [ ] Add autocomplete based on schema
  - [ ] Add syntax highlighting
  - [ ] Add real-time validation
  - [ ] Show helpful error messages

- [ ] **Integrate with Admin UI**
  - [ ] Add to `UnifiedAdminConfig.jsx`
  - [ ] Allow JSON editing mode
  - [ ] Preview changes in real-time
  - [ ] Export JSON

- [ ] **Documentation**
  - [ ] Document JSON structure
  - [ ] Create JSON examples
  - [ ] Create JSON template generator (wizard)

---

### Week 8: Template-Agnostic Renderer

- [ ] **Create SceneRenderer**
  - [ ] Create `/components/SceneRenderer.jsx`
  - [ ] Read `template_id` from JSON
  - [ ] Render scene from JSON only
  - [ ] No template-specific code

- [ ] **Test Template-Agnostic Rendering**
  - [ ] Render all v6 templates from JSON
  - [ ] Render all v7 templates from JSON
  - [ ] Render showcase scenes from JSON
  - [ ] Verify no hardcoded logic

- [ ] **Update Main Composition**
  - [ ] Use `SceneRenderer` in `MainComposition.jsx`
  - [ ] Remove template-specific routing
  - [ ] Test end-to-end

---

## 🟢 Phase 3: Polish & Scale (Weeks 9-12) - MEDIUM

### Week 9: Effects Standardization

- [ ] **Organize Effects**
  - [ ] Create `EffectsRegistry` class
  - [ ] Categorize effects: `background`, `particle`, `glassmorphic`, `handwriting`
  - [ ] Standardize effect props
  - [ ] Document all effects

- [ ] **Update Templates**
  - [ ] Update templates to use `EffectsRegistry`
  - [ ] Remove direct effect imports
  - [ ] Test all effects work

---

### Week 10: Layout Guardrails

- [ ] **Enforce Collision Detection**
  - [ ] Make collision detection mandatory
  - [ ] Add automatic bounds checking
  - [ ] Create layout validation API
  - [ ] Show warnings/errors for invalid layouts

- [ ] **Update Layout Engine**
  - [ ] Add guardrails to `calculateItemPositions`
  - [ ] Validate layouts before rendering
  - [ ] Provide helpful error messages
  - [ ] Test with invalid layouts

---

### Week 11: JSON Showcase

- [ ] **Convert Showcase to JSON**
  - [ ] Create JSON for `ShowcaseScene1`
  - [ ] Create JSON for `ShowcaseScene2`
  - [ ] Create JSON for `ShowcaseScene3`
  - [ ] Create JSON for `ShowcaseScene4`
  - [ ] Update `ShowcaseMain` to use JSON

- [ ] **Prove Architecture**
  - [ ] Render showcase from JSON only
  - [ ] No hardcoded content
  - [ ] Update showcase documentation
  - [ ] Use as integration test

---

### Week 12: Performance & Testing

- [ ] **Performance Profiling**
  - [ ] Profile rendering performance
  - [ ] Optimize particle systems
  - [ ] Lazy load heavy effects
  - [ ] Optimize layout calculations

- [ ] **Integration Tests**
  - [ ] Test all templates render
  - [ ] Test JSON validation
  - [ ] Test layout guardrails
  - [ ] Test mid-scene components

- [ ] **Documentation**
  - [ ] Update architecture docs
  - [ ] Create developer guide
  - [ ] Create JSON reference
  - [ ] Create migration guide

---

## 📊 Progress Tracking

### Week 1: Layout Engine
- [ ] Audit complete
- [ ] Unified engine created
- [ ] Templates migrated
- [ ] Cleanup done

### Week 2: Mid-Scenes
- [ ] HubSpokeScene extracted
- [ ] GridScene extracted
- [ ] StackScene extracted
- [ ] CascadeScene extracted
- [ ] Index created

### Week 3: Animation System
- [ ] Audit complete
- [ ] AnimationEngine created
- [ ] Templates updated
- [ ] Cleanup done

### Week 4: JSON Schema
- [ ] Audit complete
- [ ] Schema extended
- [ ] DEFAULT_CONFIG removed
- [ ] Examples updated

### Weeks 5-6: v6 → v7 Migration
- [ ] Explain2A converted
- [ ] Hook1A converted
- [ ] All v6 templates converted
- [ ] Router updated

### Week 7: JSON Editor
- [ ] Editor built
- [ ] Integrated with admin UI
- [ ] Documentation created

### Week 8: Template-Agnostic
- [ ] SceneRenderer created
- [ ] All templates tested
- [ ] Main composition updated

### Week 9: Effects
- [ ] EffectsRegistry created
- [ ] Templates updated

### Week 10: Guardrails
- [ ] Collision detection enforced
- [ ] Layout validation added

### Week 11: JSON Showcase
- [ ] Showcase converted to JSON
- [ ] Architecture proven

### Week 12: Polish
- [ ] Performance optimized
- [ ] Tests added
- [ ] Documentation updated

---

## 🎯 Success Criteria

### Phase 1 Complete When:
- ✅ Single layout engine exists
- ✅ Mid-scene library has 4+ components
- ✅ Single animation system exists
- ✅ No DEFAULT_CONFIG in templates

### Phase 2 Complete When:
- ✅ All v6 templates migrated to v7
- ✅ JSON editor works
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

## 📝 Notes

- Update this checklist as work progresses
- Check off items as completed
- Add blockers/issues to notes section
- Review weekly with team

---

**Last Updated**: 2025-01-20  
**Status**: Not Started  
**Next Review**: [Date]
