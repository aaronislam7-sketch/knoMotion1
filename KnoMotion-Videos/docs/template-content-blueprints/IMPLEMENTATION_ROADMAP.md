# Implementation Roadmap: Template Agnosticism
**Date:** 2025-10-30  
**Status:** Planning Complete - Ready for Implementation  
**Dependencies:** Blueprint V5, SDK

---

## Executive Summary

We've identified 3 critical rigidity issues in Hook1A and developed comprehensive solutions. The common themes have been extracted into **6 Agnostic Template Principals** that will guide all future template development.

---

## Analysis Complete ✅

### Documents Created

1. **`rigidity_solutions_analysis.md`** - Detailed analysis of 3 concerns with solutions
2. **`agnosticTemplatePrincipals.md`** - 6 core principals for template-agnostic design
3. **`IMPLEMENTATION_ROADMAP.md`** - This file (implementation guidance)

### Concerns Analyzed

| Concern | Rigidity | Impact | Solution Principal |
|---------|----------|--------|-------------------|
| Hardcoded Map SVG | Very Rigid | Critical | Type-Based Polymorphism |
| Two-line question format | Rigid | High | Data-Driven Structure |
| All component positions fixed | Rigid | High | Token-Based Positioning |

---

## The 6 Agnostic Template Principals 🎯

1. **Type-Based Polymorphism** 🔄
   - Replace hardcoded components with type registries
   - Support multiple implementations (image, svg, lottie, custom)

2. **Data-Driven Structure** 📊
   - Replace fixed structures with dynamic arrays
   - Calculate layout/timing based on data length

3. **Token-Based Positioning** 🎯
   - Abstract positions into semantic tokens (9-point grid)
   - Support progressive precision (grid → offset → percentage → absolute)

4. **Separation of Concerns** 🔧
   - Decouple content, layout, style, animation
   - Each independently configurable

5. **Progressive Configuration** ⚙️
   - Sensible defaults for simple cases
   - Detailed control for advanced cases

6. **Registry Pattern** 🔌
   - Extensible systems via registries
   - Custom types can be registered

---

## Implementation Phases

### Phase 1: SDK Foundations (Week 1)

**Create New SDK Modules:**

```
src/sdk/
  ├── heroRegistry.js          ✨ NEW
  ├── questionRenderer.js      ✨ NEW
  ├── positionSystem.js        ✨ NEW
  ├── layoutEngine.js          ✨ NEW
  └── registryHelpers.js       ✨ NEW
```

**Tasks:**
- [ ] Implement `heroRegistry.js` with HERO_TYPES
  - image, svg, roughSVG, lottie, custom renderers
  - Animation support for each type
  
- [ ] Implement `positionSystem.js`
  - 9-point grid constant (POSITION_GRID)
  - resolvePosition() function
  - Support grid tokens, offsets, percentages, absolute
  
- [ ] Implement `questionRenderer.js`
  - renderQuestionLines() function
  - Dynamic positioning calculation
  - Staggered timing support
  - Per-line emphasis

- [ ] Create `layoutEngine.js`
  - Dynamic spacing algorithms
  - Arrangement strategies (stacked, centered, cascade)
  - Responsive calculations

- [ ] Create `registryHelpers.js`
  - Registration functions
  - Fallback handling
  - Type validation

**Deliverables:**
- SDK modules with full JSDoc
- Unit tests for each module
- Example usage in docs

---

### Phase 2: Hook1A Refactor (Week 2)

**Refactor Hook1AQuestionBurst_V5.jsx:**

**Before:**
- ❌ Hardcoded map SVG (lines 422-525)
- ❌ Fixed 2-line question structure (lines 313-356)
- ❌ Hardcoded positions throughout

**After:**
- ✅ Hero registry for central visual
- ✅ Dynamic question line rendering
- ✅ Token-based positioning for all elements

**Tasks:**
- [ ] Replace map SVG with hero registry call
  - Extract current map to `KnodoviaMapRenderer`
  - Register as `roughSVG` type
  - Update JSON to use hero config

- [ ] Replace question rendering with dynamic system
  - Remove questionPart1/questionPart2 logic
  - Implement renderQuestionLines()
  - Update JSON to use lines array

- [ ] Replace hardcoded positions
  - Import resolvePosition
  - Update all elements to use position tokens
  - Update JSON with position configs

- [ ] Update Hook1ABlueprint.md
  - Document new configuration options
  - Add examples for different hero types
  - Show 1-4 line question examples

**Deliverables:**
- Refactored Hook1A component
- Updated JSON schema
- Updated blueprint documentation

---

### Phase 3: Cross-Domain Testing (Week 3)

**Test Hook1A with Different Domains:**

1. **Football Domain**
   ```json
   {
     "hero": {
       "type": "image",
       "asset": "/football-field.jpg"
     },
     "question": {
       "lines": [
         { "text": "Who was the greatest?", "emphasis": "high" }
       ]
     }
   }
   ```

2. **Science Domain**
   ```json
   {
     "hero": {
       "type": "lottie",
       "asset": "/molecule-animation.json"
     },
     "question": {
       "lines": [
         { "text": "What if atoms", "emphasis": "normal" },
         { "text": "could tell stories?", "emphasis": "high" }
       ]
     }
   }
   ```

3. **Business Domain**
   ```json
   {
     "hero": {
       "type": "svg",
       "asset": "/org-chart.svg"
     },
     "question": {
       "lines": [
         { "text": "What if leadership", "emphasis": "normal" },
         { "text": "was measured", "emphasis": "normal" },
         { "text": "in empathy?", "emphasis": "high" }
       ]
     }
   }
   ```

**Tasks:**
- [ ] Create 3+ domain test JSON files
- [ ] Render each and verify no code changes needed
- [ ] Document findings and edge cases
- [ ] Capture screenshots for documentation

**Success Criteria:**
- ✅ Zero code modifications required
- ✅ All domains render correctly
- ✅ Position tokens work consistently
- ✅ Animations smooth and appropriate

---

### Phase 4: Apply to Other Templates (Week 4+)

**Templates to Refactor:**

1. **Explain2A** (Radial concept connections)
   - Hero: central concept (image, text, lottie)
   - Connections: dynamic array of connection points
   - Positions: token-based for satellites

2. **Apply3B** (Quiz/Question)
   - Question: dynamic line count
   - Options: dynamic array (2-6 options)
   - Positions: token-based layout

3. **Reflect4A** (Takeaways)
   - Takeaways: dynamic array (1-5 items)
   - Icons: type-based (emoji, svg, lottie, none)
   - Layout: token-based arrangements

**Tasks:**
- [ ] Analyze each template for rigidity
- [ ] Apply agnostic principals
- [ ] Update blueprints
- [ ] Cross-domain testing

---

## JSON Schema Evolution

### Current (Rigid)
```json
{
  "fill": {
    "texts": {
      "questionPart1": "What if geography",
      "questionPart2": "was measured in mindsets?"
    }
  }
}
```

### Future (Agnostic)
```json
{
  "hero": {
    "type": "roughSVG",
    "asset": "knodovia-map",
    "position": "center"
  },
  "question": {
    "lines": [
      { "text": "What if geography", "emphasis": "normal" },
      { "text": "was measured in mindsets?", "emphasis": "high" }
    ],
    "layout": {
      "arrangement": "stacked",
      "stagger": 0.3,
      "basePosition": "center"
    }
  }
}
```

---

## Migration Strategy

### Backward Compatibility

**Approach:** Support both old and new schemas during transition

```javascript
// Template supports both formats
const parseScene = (scene) => {
  // New format (agnostic)
  if (scene.hero) {
    return scene;
  }
  
  // Old format (legacy) - auto-migrate
  return {
    hero: {
      type: 'roughSVG',
      asset: 'knodovia-map'
    },
    question: {
      lines: [
        { text: scene.fill?.texts?.questionPart1, emphasis: 'normal' },
        { text: scene.fill?.texts?.questionPart2, emphasis: 'high' }
      ]
    }
  };
};
```

**Benefits:**
- ✅ Existing JSON files continue to work
- ✅ Gradual migration path
- ✅ No breaking changes

---

## Success Metrics

### Template-Level
- [ ] Business user can create scene without developer
- [ ] AI/GPT can generate valid JSON from description
- [ ] Same template works for 5+ different domains
- [ ] Zero code changes for content variations

### System-Level
- [ ] 80%+ of templates use agnostic principals
- [ ] Average time to create new scene < 30 minutes
- [ ] Template reuse rate > 60%
- [ ] Code maintenance time reduced by 50%

---

## Risk Mitigation

### Technical Risks

**Risk 1: Performance overhead from dynamic rendering**
- Mitigation: Benchmark and optimize SDK functions
- Target: < 5ms overhead per frame

**Risk 2: Complexity for simple use cases**
- Mitigation: Provide excellent defaults and examples
- Target: Simple cases require < 10 lines of JSON

**Risk 3: Registry management complexity**
- Mitigation: Clear documentation and registration helpers
- Target: Adding new type takes < 1 hour

### Process Risks

**Risk 4: Team adoption**
- Mitigation: Training sessions and pair programming
- Target: 100% team understanding within 2 weeks

**Risk 5: Migration effort underestimated**
- Mitigation: Pilot with 1 template (Hook1A) before rolling out
- Target: Learn and adjust before wider application

---

## Documentation Updates Required

### SDK Documentation
- [ ] heroRegistry.js API reference
- [ ] positionSystem.js usage guide
- [ ] questionRenderer.js examples
- [ ] Migration guide for developers

### Blueprint Documentation
- [ ] Update Blueprint V5 with new sections
- [ ] Add agnostic configuration examples
- [ ] Document all registry types
- [ ] Cross-link to agnosticTemplatePrincipals.md

### Author Documentation
- [ ] JSON authoring guide for business users
- [ ] Position token reference
- [ ] Hero type catalog with examples
- [ ] Best practices and patterns

---

## Next Actions

### Immediate (This Week)
1. Review `rigidity_solutions_analysis.md` with team
2. Get alignment on `agnosticTemplatePrincipals.md`
3. Prioritize SDK foundation work
4. Assign Phase 1 tasks

### Short-Term (Next 2 Weeks)
1. Implement SDK modules (Phase 1)
2. Begin Hook1A refactor (Phase 2)
3. Create test JSON files for cross-domain testing
4. Update documentation

### Medium-Term (Next Month)
1. Complete Hook1A refactor and testing
2. Apply principals to 2-3 more templates
3. Gather feedback and iterate
4. Update all blueprints

---

## Questions to Resolve

1. **Naming conventions** - Finalize registry key naming (camelCase vs kebab-case)
2. **Schema validation** - JSON schema or TypeScript types or both?
3. **Custom component registration** - Where do custom renderers live?
4. **Performance targets** - What's acceptable overhead for flexibility?
5. **Backward compatibility** - How long to support legacy format?

---

## Appendix: Code Snippets

### Example Hero Registry Usage

```javascript
// In template
import { HERO_REGISTRY, renderHero } from '../sdk/heroRegistry';

const heroConfig = scene.hero || { type: 'image', asset: '/default.jpg' };
const heroVisual = renderHero(heroConfig, frame, beats, colors, easingMap, fps);

return (
  <AbsoluteFill>
    {heroVisual}
  </AbsoluteFill>
);
```

### Example Position Resolution

```javascript
// In template
import { resolvePosition } from '../sdk/positionSystem';

const layers = scene.layers || [];

layers.forEach(layer => {
  const pos = resolvePosition(layer.position, layer.offset);
  
  // Apply to rendering
  element.setAttribute('x', pos.x);
  element.setAttribute('y', pos.y);
});
```

### Example Dynamic Question Rendering

```javascript
// In template
import { renderQuestionLines } from '../sdk/questionRenderer';

const questionConfig = scene.question;

const lineElements = renderQuestionLines(
  questionConfig.lines,
  questionConfig.layout,
  questionConfig.animation,
  frame,
  beats,
  colors,
  fonts,
  easingMap,
  fps
);

lineElements.forEach(el => svg.appendChild(el));
```

---

**End of Roadmap**

Ready to proceed with Phase 1 implementation upon approval.
