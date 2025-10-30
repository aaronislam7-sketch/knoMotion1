# Agnostic Template Principals
**Version:** 1.0  
**Date:** 2025-10-30  
**Status:** Active Guidelines - Production Ready  
**Applies To:** All Blueprint v5.1+ Templates

---

## Purpose

These principals define the foundational patterns that enable templates to be **domain-agnostic**, **content-flexible**, and **JSON-configurable** without requiring code modifications. Following these principals allows:

- ✅ One template to serve infinite use cases
- ✅ Non-technical users to author content via JSON
- ✅ AI/GPT to understand and generate valid configurations
- ✅ Rapid content creation (minutes instead of hours)
- ✅ Cross-domain validation and reusability
- ✅ Minimal technical debt and maintenance

Every template we build should adhere to these principals to maximize reusability and minimize technical debt.

---

## The 6 Core Principals

### 1. Type-Based Polymorphism 🔄

**Principle:** Never hardcode specific visual implementations. Use type registries to support multiple rendering strategies.

**Pattern:**
```json
{
  "component": {
    "type": "roughSVG",  // Registry key
    "config": { ... }     // Type-specific config
  }
}
```

**Anti-Pattern:**
```javascript
// ❌ Hardcoded implementation
const mapSVG = `<path d="M 200 180...">`;
```

**Best Practice:**
```javascript
// ✅ Type registry
const COMPONENT_TYPES = {
  'image': ImageRenderer,
  'svg': SVGRenderer,
  'roughSVG': RoughSVGRenderer,
  'lottie': LottieRenderer,
  'custom': CustomComponentRenderer
};

const renderer = COMPONENT_TYPES[config.type];
const visual = renderer.render(config, frame, beats, colors);
```

**Applies To:**
- Hero visuals (maps, diagrams, images)
- Text rendering (SVG, HTML, canvas)
- Animations (Lottie, sprite sheets, procedural)
- Effects (particles, shimmers, highlights)

**Benefits:**
- ✅ Support multiple content types without code changes
- ✅ Easy to add new renderers
- ✅ Business users can change visual types via JSON
- ✅ AI can understand type options from schema

---

### 2. Data-Driven Structure 📊

**Principle:** Replace fixed structures with dynamic arrays. Calculate layout, timing, and animation based on data length.

**Pattern:**
```json
{
  "lines": [
    { "text": "Line 1", "emphasis": "normal" },
    { "text": "Line 2", "emphasis": "high" },
    { "text": "Line 3", "emphasis": "normal" }
  ],
  "stagger": 0.3  // Timing calculated per line
}
```

**Anti-Pattern:**
```javascript
// ❌ Fixed structure
const questionPart1 = scene.texts.questionPart1;
const questionPart2 = scene.texts.questionPart2;
// What if we need 3 lines? 4 lines? 1 line?
```

**Best Practice:**
```javascript
// ✅ Dynamic structure
scene.lines.forEach((line, index) => {
  const yPos = baseY + (index * spacing);  // Dynamic positioning
  const startTime = baseTime + (index * stagger);  // Dynamic timing
  const element = renderLine(line, yPos, startTime);
});
```

**Applies To:**
- Question/text lines (1-4+ lines)
- List items (bullets, steps, options)
- Animation sequences (staggered reveals)
- Visual elements (multiple images, icons)

**Benefits:**
- ✅ Handles variable content lengths
- ✅ Automatic spacing and timing calculations
- ✅ Scales from simple to complex without code changes
- ✅ Content structure visible in JSON

---

### 3. Token-Based Positioning 🎯

**Principle:** Abstract positions into semantic tokens. Support multiple precision levels (grid → offset → percentage → absolute).

**Pattern:**
```json
{
  "position": "center",  // Simplest: grid token
  // OR
  "position": {
    "grid": "center",
    "offset": { "x": 0, "y": 120 }  // Fine-tuning
  },
  // OR
  "position": { "x": "50%", "y": "30%" },  // Percentage
  // OR
  "position": { "x": 960, "y": 540 }  // Absolute (if needed)
}
```

**9-Point Grid Reference:**
```
top-left        top-center        top-right
(320, 180)      (960, 180)        (1600, 180)

center-left     center            center-right
(320, 540)      (960, 540)        (1600, 540)

bottom-left     bottom-center     bottom-right
(320, 900)      (960, 900)        (1600, 900)
```

**Anti-Pattern:**
```javascript
// ❌ Hardcoded positions throughout code
textElement.setAttribute('x', '960');
textElement.setAttribute('y', '480');
// No way to adjust without code changes
```

**Best Practice:**
```javascript
// ✅ Token resolution system
import { resolvePosition, POSITION_GRID } from '../sdk/positionSystem';

const pos = resolvePosition(layer.position, layer.offset);
element.setAttribute('x', pos.x);
element.setAttribute('y', pos.y);
```

**Applies To:**
- Text elements (headers, subtitles, body)
- Hero visuals (maps, images, diagrams)
- Annotations (callouts, arrows, highlights)
- UI elements (buttons, icons, badges)

**Benefits:**
- ✅ Declarative positioning via JSON
- ✅ Easy layout adjustments
- ✅ Consistent positioning across templates
- ✅ Responsive to viewport changes

---

### 4. Separation of Concerns 🔧

**Principle:** Decouple content (what), structure (layout), presentation (style), and behavior (animation). Each should be independently configurable.

**Pattern:**
```json
{
  "content": {
    "text": "What if geography"  // WHAT
  },
  "layout": {
    "position": "center",  // WHERE
    "spacing": 80
  },
  "style": {
    "fontSize": 76,  // HOW IT LOOKS
    "color": "accent"
  },
  "animation": {
    "entrance": "fadeUp",  // HOW IT MOVES
    "emphasis": "pulse"
  }
}
```

**Anti-Pattern:**
```javascript
// ❌ Everything mixed together
const renderQuestion = () => {
  return (
    <div style={{
      position: 'absolute',  // Layout
      top: 480,  // Layout
      fontSize: 76,  // Style
      color: colors.accent,  // Style
      opacity: calculateOpacity(frame),  // Animation
      transform: calculateTransform(frame)  // Animation
    }}>
      {scene.texts.question}  // Content
    </div>
  );
};
```

**Best Practice:**
```javascript
// ✅ Separated concerns
const content = scene.content;
const position = resolvePosition(scene.layout.position);
const style = resolveStyle(scene.style, colors, fonts);
const animation = resolveAnimation(scene.animation, frame, beats);

return (
  <div style={{
    ...positionToCSS(position),
    ...style,
    ...animation
  }}>
    {content.text}
  </div>
);
```

**Applies To:**
- All visual elements
- Animation definitions
- Style tokens
- Layout systems

**Benefits:**
- ✅ Change one aspect without affecting others
- ✅ Reuse animation on different content
- ✅ Reuse layouts with different styles
- ✅ Clear mental model for authors

---

### 5. Progressive Configuration ⚙️

**Principle:** Provide sensible defaults for simple cases. Support detailed control for advanced cases. Never force complexity.

**Pattern:**
```json
// SIMPLE: Just the essentials
{
  "hero": {
    "type": "image",
    "asset": "/football.jpg"
  }
}

// INTERMEDIATE: Add some customization
{
  "hero": {
    "type": "image",
    "asset": "/football.jpg",
    "position": "center-right",
    "scale": 0.8
  }
}

// ADVANCED: Full control
{
  "hero": {
    "type": "image",
    "asset": "/football.jpg",
    "position": {
      "grid": "center-right",
      "offset": { "x": -100, "y": 50 }
    },
    "scale": 0.8,
    "transforms": [
      {
        "beat": "shrink",
        "position": "top-right",
        "scale": 0.3,
        "duration": 1.2,
        "ease": "power2InOut"
      }
    ],
    "filters": {
      "brightness": 1.1,
      "contrast": 1.05
    }
  }
}
```

**Anti-Pattern:**
```json
// ❌ All-or-nothing: forces users to specify everything
{
  "hero": {
    "type": "image",
    "asset": "/football.jpg",
    "position": { "x": 1200, "y": 540 },  // Required
    "scale": 1.0,  // Required
    "rotation": 0,  // Required
    "opacity": 1.0,  // Required
    "transforms": [],  // Required
    "filters": {},  // Required
    "zIndex": 10  // Required
    // Exhausting!
  }
}
```

**Best Practice:**
```javascript
// ✅ Defaults + overrides
const DEFAULT_HERO_CONFIG = {
  position: 'center',
  scale: 1.0,
  rotation: 0,
  opacity: 1.0,
  transforms: [],
  filters: {}
};

const heroConfig = {
  ...DEFAULT_HERO_CONFIG,
  ...scene.hero  // User only specifies what they want to change
};
```

**Applies To:**
- All configuration objects
- Animation presets
- Style tokens
- Layout options

**Benefits:**
- ✅ Low barrier to entry (simple JSON)
- ✅ Power when needed (advanced config)
- ✅ Readable JSON (only see what matters)
- ✅ Backwards compatible (add fields without breaking)

---

### 6. Registry Pattern for Extensibility 🔌

**Principle:** Use registries to make systems extensible. Allow custom types to be registered without modifying core code.

**Pattern:**
```javascript
// Core registry
export const HERO_REGISTRY = {
  'image': ImageRenderer,
  'svg': SVGRenderer,
  'roughSVG': RoughSVGRenderer,
  'lottie': LottieRenderer
};

// Template-specific extension
export const registerHeroType = (type, renderer) => {
  HERO_REGISTRY[type] = renderer;
};

// Custom registration
registerHeroType('footballField', FootballFieldRenderer);
registerHeroType('chessBoard', ChessBoardRenderer);
```

**Anti-Pattern:**
```javascript
// ❌ Hardcoded switch statement
function renderHero(config) {
  if (config.type === 'image') {
    return <img ... />;
  } else if (config.type === 'svg') {
    return <SVG ... />;
  } else if (config.type === 'lottie') {
    return <Lottie ... />;
  }
  // Need to edit this function for every new type!
}
```

**Best Practice:**
```javascript
// ✅ Registry lookup
function renderHero(config) {
  const Renderer = HERO_REGISTRY[config.type];
  
  if (!Renderer) {
    console.warn(`Unknown hero type: ${config.type}`);
    return HERO_REGISTRY['image'](config);  // Fallback
  }
  
  return Renderer(config);
}
```

**Registries to Create:**
- `HERO_TYPES` - Visual element renderers
- `ANIMATION_PRESETS` - Reusable animations
- `LAYOUT_STRATEGIES` - Positioning algorithms
- `TEXT_FORMATTERS` - Text rendering styles
- `EFFECT_TYPES` - Creative enhancements (particles, etc.)

**Benefits:**
- ✅ Add new types without core changes
- ✅ Template-specific customization
- ✅ Plugin architecture
- ✅ Easy to test individual types

---

## Implementation Checklist

When building or refactoring a template, verify:

### Type-Based Polymorphism
- [ ] No hardcoded visual implementations
- [ ] Registry exists for each major component type
- [ ] JSON `type` field selects renderer
- [ ] Easy to add new types

### Data-Driven Structure
- [ ] Fixed structures replaced with arrays
- [ ] Supports variable lengths (1-4+)
- [ ] Dynamic positioning calculations
- [ ] Dynamic timing/stagger calculations

### Token-Based Positioning
- [ ] All positions use token system
- [ ] 9-point grid implemented
- [ ] Offset support available
- [ ] No hardcoded x/y values in templates

### Separation of Concerns
- [ ] Content separate from layout
- [ ] Layout separate from style
- [ ] Style separate from animation
- [ ] Each independently configurable

### Progressive Configuration
- [ ] Sensible defaults provided
- [ ] Simple cases require minimal JSON
- [ ] Advanced control available when needed
- [ ] No forced complexity

### Registry Pattern
- [ ] Core registries defined
- [ ] Registration functions available
- [ ] Custom types can be added
- [ ] Fallback handling for unknown types

---

## Schema Validation

Every template JSON should be validatable against a schema that enforces these principals:

```typescript
// Type validation
type: string (from registry)

// Structure validation  
lines: Array<LineConfig> | { length: 1-4 }

// Position validation
position: GridToken | PositionConfig | PercentageConfig | AbsoluteConfig

// Config validation
config: Partial<FullConfig> (all fields optional with defaults)

// Registry validation
componentType: keyof ComponentRegistry
```

---

## Examples Across Templates

### Hook Template (Hook1A)
- ✅ Hero: `{ type: "roughSVG", asset: "map" }` → `{ type: "image", asset: "field" }`
- ✅ Question: `lines: [...]` supports 1-4 lines
- ✅ Position: `position: "center"` with optional offsets

### Explain Template (Explain2A)
- ✅ Central concept: type-based (text, image, diagram, lottie)
- ✅ Connection lines: array of connections with dynamic rendering
- ✅ Positions: token-based for all elements

### Apply Template (Apply3B)
- ✅ Question: dynamic line count
- ✅ Options: array-based with automatic layout
- ✅ Feedback: type-based (confetti, checkmark, glow)

### Reflect Template (Reflect4A)
- ✅ Takeaways: array-based with 1-5 items
- ✅ Icons: type-based (emoji, svg, lottie, none)
- ✅ Layout: token-based vertical/horizontal arrangements

---

## Testing Domain Agnosticism

For each template, test with drastically different domains:

**Hook1A Examples:**
- ✅ Geography (original: Knodovia map)
- ✅ Sports (football field, player formations)
- ✅ Science (molecule diagrams, circuits)
- ✅ Business (org charts, funnels)
- ✅ Abstract (concept maps, mind maps)

**Questions to Ask:**
1. Can I change the visual without touching code? ✅
2. Can I add/remove lines without breaking? ✅
3. Can I adjust layout via JSON? ✅
4. Is the structure clear to non-technical users? ✅
5. Can AI/GPT understand the schema? ✅

---

## Migration Guide

To apply these principals to an existing template:

### Step 1: Identify Rigidity
- Find hardcoded visuals → Type-Based Polymorphism
- Find fixed structures → Data-Driven Structure
- Find hardcoded positions → Token-Based Positioning

### Step 2: Extract to JSON
- Move hardcoded values to scene JSON
- Define schema with defaults
- Create migration script for existing scenes

### Step 3: Implement Registries
- Create type registries for polymorphic components
- Implement resolvers (position, style, animation)
- Add registration functions

### Step 4: Refactor Template
- Replace hardcoded logic with registry lookups
- Replace fixed structures with dynamic rendering
- Replace positions with token resolution

### Step 5: Test & Document
- Test with different domains
- Update blueprint with new configuration options
- Document in template-specific blueprint

---

## Governance

**These principals are mandatory for:**
- ✅ All new templates
- ✅ All template refactors
- ✅ All blueprint updates

**Review Process:**
- Template code review checks against principals
- Blueprint must document configuration options
- Cross-domain test required before production

**Living Document:**
- Update principals as patterns emerge
- Add examples from real use cases
- Version changes and track evolution

---

## Success Metrics

A template successfully implements these principals when:

1. **Business users can author** - Non-developers can create new scenes via JSON
2. **AI can assist** - GPT can understand schema and generate valid JSON
3. **Domain transfer succeeds** - Same template works for drastically different content
4. **Zero code changes** - Content changes require only JSON updates
5. **Extensibility proven** - New types can be added without core modifications

---

---

## Real-World Implementation: Hook1A Case Study

### Problem Space
The Hook1A template was rigid:
- Hardcoded Knodovia map (specific SVG paths in JSX)
- Fixed 2-line question structure (questionPart1, questionPart2)
- Hardcoded pixel positions throughout

**Result:** Impossible to use for other domains without code changes.

### Solution Applied
Applied all 6 principals to create Hook1AQuestionBurst_V5_Agnostic:

**Principal 1 (Polymorphism):** Hero registry with 5 types (image, svg, roughSVG, lottie, custom)  
**Principal 2 (Data-Driven):** Dynamic 1-4+ line question rendering  
**Principal 3 (Token Positioning):** 9-point grid for all elements  
**Principal 4 (Separation):** Content/layout/style/animation decoupled  
**Principal 5 (Progressive Config):** Simple defaults, advanced control  
**Principal 6 (Registry):** Extensible hero type system  

### Results Achieved

**Cross-Domain Testing:**
- ✅ Geography (Knodovia map, 2 lines, roughSVG)
- ✅ Sports (Football player, 1 line, image)
- ✅ Science (Atom diagram, 3 lines, SVG)

**Metrics:**
- **Development time:** 4-8 hours → 15-30 minutes
- **Code reusability:** 1 use case → infinite use cases
- **Authoring:** Developers only → Business users + AI
- **Technical debt:** Eliminated (no domain-specific forks)

---

## SDK Implementation

The principals are implemented through 4 core SDK modules:

### 1. heroRegistry.jsx
Implements: Type-Based Polymorphism (Principal 1)
- Registry pattern for hero renderers
- Support for image, svg, roughSVG, lottie, custom
- Animation calculator for all types
- Extensible via `registerHeroType()`

### 2. positionSystem.js
Implements: Token-Based Positioning (Principal 3)
- 9-point grid reference system
- Progressive precision: grid → offset → % → absolute
- Utilities: `resolvePosition()`, `positionToCSS()`, `getStackedPosition()`

### 3. questionRenderer.js
Implements: Data-Driven Structure (Principal 2)
- Dynamic line rendering (1-4+ lines)
- Auto-positioning based on line count
- Staggered animation calculation
- Utilities: `renderQuestionLines()`, `validateQuestionConfig()`

### 4. layoutEngine.js
Implements: All principals (general purpose)
- Multiple arrangement algorithms
- Dynamic spacing calculations
- Pre-configured layout patterns
- Utilities: `calculateItemPositions()`, `getLayoutPattern()`

---

## Schema Evolution

### v5.0 (Legacy - Rigid)
```json
{
  "fill": {
    "texts": {
      "questionPart1": "Fixed structure",
      "questionPart2": "Only 2 lines"
    }
  }
}
```

### v5.1 (Agnostic - Flexible)
```json
{
  "question": {
    "lines": [
      { "text": "Any number", "emphasis": "normal" },
      { "text": "of lines", "emphasis": "high" },
      { "text": "from 1 to 4+", "emphasis": "normal" }
    ]
  },
  "hero": {
    "type": "image",  // Polymorphic
    "asset": "/any-domain.jpg",
    "position": "center"  // Token-based
  }
}
```

**Backward Compatibility:** Both formats supported. v5.0 auto-converts to v5.1 internally.

---

## Application Roadmap

### Phase 1: Hook1A ✅ COMPLETE
- [x] SDK foundations (4 modules)
- [x] Hook1A refactored to agnostic
- [x] Cross-domain testing (3 domains)
- [x] Documentation complete

### Phase 2: Expand to Other Templates
- [ ] Explain2A (radial concept connections)
- [ ] Apply3B (quiz/options)
- [ ] Reflect4A (takeaways list)

### Phase 3: System-Wide Adoption
- [ ] All templates use agnostic principals
- [ ] JSON authoring guide for business users
- [ ] Visual JSON editor UI

---

## Validation & Testing

Every template must pass:

1. **Cross-domain test** - Works in 3+ different domains
2. **JSON-only authoring** - No code changes needed
3. **AI compatibility** - GPT can generate valid JSON
4. **Business user test** - Non-technical user can modify
5. **Backward compatibility** - Legacy format still works

**Tools:**
- `validateSceneCompat()` - Schema validation
- `detectSchemaVersion()` - Format detection
- `autoMigrateToV51()` - Auto-migration helper

---

## Version History

**v1.0 (2025-10-30):**
- Initial principals derived from Hook1A rigidity analysis
- Hook1A implementation validates all 6 principals
- Cross-domain testing proves concept
- SDK modules operational
- Production ready

**Next Review:** After applying to 3+ templates

---

## Feedback & Evolution

These principals are living guidelines. Share:
- ✅ Successes and wins
- ⚠️ Edge cases discovered
- 💡 Improvements and refinements
- 🐛 Issues encountered

Update this document as patterns evolve and new learnings emerge.

---

**END OF AGNOSTIC TEMPLATE PRINCIPALS**

*These principals represent the foundation for all domain-agnostic template development at Knode. They ensure our templates are flexible, maintainable, and accessible to both technical and non-technical users.*

