# V5 to V6 Template Migration Plan
**Date:** November 7, 2025  
**Status:** In Progress 🚧

---

## 🎯 Migration Objectives

Convert all 8 V5 templates to V6 architecture with:
- ✅ 100% configurable (no hardcoded values)
- ✅ Full UI config panels
- ✅ Hero registry integration
- ✅ Position system integration  
- ✅ Separated concerns
- ✅ Example scene JSONs
- ✅ Intention metadata

---

## 📋 Templates to Migrate

| # | Template | Intention | Priority | Status |
|---|----------|-----------|----------|--------|
| 1 | Hook1AQuestionBurst | QUESTION | HIGH | 🔄 In Progress |
| 2 | Hook1EAmbientMystery | REVEAL | HIGH | ⏳ Pending |
| 3 | Explain2AConceptBreakdown | BREAKDOWN | HIGH | ⏳ Pending |
| 4 | Explain2BAnalogy | COMPARE | MEDIUM | ⏳ Pending |
| 5 | Apply3AMicroQuiz | CHALLENGE | HIGH | ⏳ Pending |
| 6 | Apply3BScenarioChoice | CHALLENGE | MEDIUM | ⏳ Pending |
| 7 | Reflect4AKeyTakeaways | BREAKDOWN | MEDIUM | ⏳ Pending |
| 8 | Reflect4DForwardLink | CONNECT | LOW | ⏳ Pending |

**Note:** ShowcaseAnimations_V5 is a demo template and will be kept as-is.

---

## 🏗️ Migration Checklist Per Template

### Phase 1: Template File
- [ ] Create `TemplateName_V6.jsx` 
- [ ] Add DEFAULT_CONFIG with all parameters
- [ ] Replace hardcoded values with config references
- [ ] Use hero registry for all visuals (emoji, image, roughSVG)
- [ ] Use resolvePosition/positionToCSS for all positioning
- [ ] Separate content/layout/style/animation concerns
- [ ] Export TEMPLATE_VERSION = '6.0'
- [ ] Export TEMPLATE_ID
- [ ] Export PRIMARY_INTENTION / SECONDARY_INTENTIONS
- [ ] Export getDuration(scene, fps) function
- [ ] Export CONFIG_SCHEMA
- [ ] Add comprehensive JSDoc comments

### Phase 2: Config Panel
- [ ] Create `configs/TemplateNameConfig.jsx`
- [ ] Expose ALL configurable properties
- [ ] Use proper input types (text, textarea, slider, color, select, checkbox)
- [ ] Add dynamic array management (add/remove items)
- [ ] Group related settings into sections
- [ ] Add helpful labels and hints
- [ ] Test with live preview

### Phase 3: Scene JSON
- [ ] Create `scenes/templatename_v6_example.json`
- [ ] Include schema_version: "6.0"
- [ ] Include template_id
- [ ] Include all configurable properties
- [ ] Add comprehensive metadata
- [ ] Ensure validates against schema

### Phase 4: Integration
- [ ] Import template in TemplateRouter.jsx
- [ ] Add to V6_TEMPLATE_REGISTRY
- [ ] Import config panel in UnifiedAdminConfig.jsx
- [ ] Add to DEFAULT_SCENES
- [ ] Add config case in renderConfigPanel()
- [ ] Add duration case in getDurationInFrames()
- [ ] Update TemplateGallery metadata
- [ ] Set hasConfig: true

### Phase 5: Testing
- [ ] Template renders without errors
- [ ] All config changes work in live preview
- [ ] Duration calculation accurate
- [ ] JSON export/import works
- [ ] Hero types render correctly
- [ ] Positioning works on all screen sizes
- [ ] Animations smooth and timed correctly

---

## 🔑 Key V6 Architecture Patterns

### 1. DEFAULT_CONFIG Structure
```javascript
const DEFAULT_CONFIG = {
  title: {
    text: 'Template Title',
    position: 'top-center',
    offset: { x: 0, y: 40 }
  },
  
  // Dynamic content array
  items: [
    { text: '...', visual: { type: 'emoji', value: '⭐' }, position: 'center' }
  ],
  
  // Visual elements using hero registry
  hero: {
    type: 'emoji', // emoji | image | roughSVG | lottie | custom
    value: '💡',
    position: 'top-center',
    offset: { x: 0, y: -200 },
    scale: 1.5
  },
  
  // Style tokens (all colors/fonts)
  style_tokens: {
    colors: {
      bg: '#FFF9F0',
      accent: '#FF6B35',
      accent2: '#9B59B6',
      ink: '#1A1A1A'
    },
    fonts: {
      size_title: 64,
      size_body: 32,
      weight_title: 800,
      weight_body: 400
    }
  },
  
  // Timing (in seconds)
  beats: {
    entrance: 0.4,
    titleEntry: 1.0,
    itemInterval: 2.0,
    hold: 1.5,
    exit: 1.0
  },
  
  // Animation config
  animation: {
    entrance: 'fade-up',
    itemReveal: 'slide-in',
    emphasis: 'pulse',
    easing: 'power3Out'
  },
  
  // Optional features
  particles: {
    enabled: true,
    count: 25,
    style: 'ambient'
  }
};
```

### 2. Hero Registry Usage
```javascript
// Replace old visual rendering
const oldWay = (
  <div style={{ fontSize: 80 }}>💡</div>
);

// With hero registry
const visualConfig = mergeHeroConfig({
  type: config.visual.type,
  value: config.visual.value,
  scale: config.visual.scale
});

const visual = renderHero(
  visualConfig,
  frame,
  beats,
  colors,
  easingMap || EZ,
  fps
);
```

### 3. Position System Usage
```javascript
// Replace hardcoded positions
const oldWay = { left: 960, top: 540 };

// With position system
const position = resolvePosition(
  config.title.position || 'top-center',
  config.title.offset || { x: 0, y: 40 },
  { w: 1920, h: 1080 }
);

const styles = positionToCSS(position);
// Returns: { left: '50%', top: '40px', transform: 'translateX(-50%)' }
```

### 4. Required Exports
```javascript
// At end of template file
export const getDuration = (scene, fps) => {
  const config = { ...DEFAULT_CONFIG, ...scene };
  const beats = { ...DEFAULT_CONFIG.beats, ...(scene.beats || {}) };
  const totalDuration = beats.entrance + beats.titleEntry + /* ... */ + beats.exit;
  return toFrames(totalDuration, fps);
};

export const TEMPLATE_VERSION = '6.0';
export const TEMPLATE_ID = 'Hook1AQuestionBurst';
export const PRIMARY_INTENTION = 'QUESTION';
export const SECONDARY_INTENTIONS = ['CHALLENGE', 'REVEAL'];

export const CONFIG_SCHEMA = {
  title: {
    text: { type: 'text', label: 'Title Text' },
    position: { type: 'position', label: 'Position' }
  },
  items: {
    type: 'array',
    label: 'Questions',
    itemSchema: {
      text: { type: 'textarea', label: 'Question', rows: 2 },
      visual: { type: 'hero', label: 'Visual Element' }
    }
  }
  // ... more config
};
```

---

## 🎨 Config Panel Pattern

```javascript
import React from 'react';

export const TemplateNameConfig = ({ scene, onUpdate }) => {
  const handleChange = (path, value) => {
    const keys = path.split('.');
    const updated = { ...scene };
    let current = updated;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    onUpdate(updated);
  };
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Section 1: Content */}
      <section>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#2C3E50' }}>
          📝 Content
        </h3>
        {/* Input controls here */}
      </section>
      
      {/* Section 2: Visuals */}
      <section>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#2C3E50' }}>
          🎨 Visuals
        </h3>
        {/* Visual controls here */}
      </section>
      
      {/* Section 3: Colors */}
      <section>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#2C3E50' }}>
          🎨 Colors
        </h3>
        {/* Color pickers here */}
      </section>
      
      {/* Section 4: Typography */}
      <section>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#2C3E50' }}>
          🔤 Typography
        </h3>
        {/* Font size sliders here */}
      </section>
      
      {/* Section 5: Timing */}
      <section>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#2C3E50' }}>
          ⏱️ Timing
        </h3>
        {/* Timing sliders here */}
      </section>
    </div>
  );
};
```

---

## 📊 Migration Progress Tracking

### Templates Completed: 0/8 (0%)
### Config Panels Created: 0/8 (0%)
### Scene JSONs Created: 0/8 (0%)
### Integration Updates: 0/4 (0%)

---

## 🚀 Next Steps

1. **Complete Hook1A migration** (reference implementation)
2. **Create migration template/script** (if patterns emerge)
3. **Migrate remaining 7 templates** (systematic approach)
4. **Test all templates thoroughly**
5. **Update documentation**
6. **Deprecate V5 templates** (mark as legacy, keep for reference)

---

## 📝 Notes

- Keep V5 templates in place until all migrations tested
- Prefix V6 templates with clear version identifier
- Ensure backward compatibility where possible
- Test with existing scene JSONs
- Document any breaking changes

---

**Status:** 🚧 In Progress  
**Started:** November 7, 2025  
**Target Completion:** Today (same session)
