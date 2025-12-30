# THE INTERACTIVE CONFIGURATION PRINCIPAL
**The Definitive System for Scene Control & Template Scalability**

**Version:** 1.0  
**Date:** 2025-11-06  
**Status:** 🔒 **MANDATORY for ALL Templates**  
**Authority:** This document defines HOW we control scenes moving forward.

---

## 🎯 Purpose & Vision

**Every change to the Interactive Configurator adds value to EVERY template, forever.**

This principal establishes that:
1. ✅ **Configuration UI is the primary authoring interface** (JSON is secondary/export)
2. ✅ **Templates align to configurator capabilities** (not the other way around)
3. ✅ **One UI improvement benefits all content** (multiplicative value)
4. ✅ **JSON structure serves configuration needs** (schema follows UI)

**Core Principle:** When we add a new control to the configurator, it instantly makes 100+ templates more flexible.

---

## 🏗️ System Architecture

### The Stack (Top to Bottom)

```
┌────────────────────────────────────────────┐
│  INTERACTIVE CONFIGURATOR (AdminConfig)    │  ← PRIMARY INTERFACE
│  • Visual controls (sliders, pickers, etc) │
│  • Presets & templates                     │
│  • Real-time preview                       │
│  • Validation & constraints                │
└────────────────────────────────────────────┘
                    ↓ Updates
┌────────────────────────────────────────────┐
│  JSON SCENE CONFIGURATION                  │  ← DATA LAYER
│  • Structured scene object                 │
│  • Schema-validated                        │
│  • Human-readable                          │
│  • Version-controlled                      │
└────────────────────────────────────────────┘
                    ↓ Consumed by
┌────────────────────────────────────────────┐
│  TEMPLATE (Remotion Component)             │  ← RENDERING LAYER
│  • Reads JSON                              │
│  • Applies SDK utilities                   │
│  • Renders video output                    │
└────────────────────────────────────────────┘
                    ↓ Uses
┌────────────────────────────────────────────┐
│  SDK MODULES (Agnostic Systems)            │  ← LOGIC LAYER
│  • heroRegistry.jsx                        │
│  • questionRenderer.js                     │
│  • positionSystem.js                       │
│  • layoutEngine.js                         │
└────────────────────────────────────────────┘
```

### Information Flow

**User Interaction → UI State → JSON Update → Template Render → Video Output**

1. User adjusts slider in AdminConfig
2. React state updates (`scene` object)
3. JSON structure reflects change
4. Template receives updated props
5. SDK applies configuration
6. Video renders with new settings

---

## 📐 The Configuration Contract

### Rule 1: Every Template Must Expose Configuration

**Templates MUST NOT:**
- ❌ Hardcode visual elements
- ❌ Have fixed structures (use dynamic arrays)
- ❌ Use literal positions (use token system)
- ❌ Mix concerns (content/layout/style/animation)

**Templates MUST:**
- ✅ Read configuration from JSON
- ✅ Use SDK registries for polymorphism
- ✅ Support the Agnostic Template Principals (6 core)
- ✅ Expose all variables through scene object

### Rule 2: AdminConfig is Template-Agnostic

The configurator adapts to templates, not vice versa:

**Good Architecture:**
```javascript
// Template declares its configuration schema
export const CONFIG_SCHEMA = {
  hero: { type: 'polymorphic', registry: HERO_TYPES },
  question: { type: 'dynamic-array', min: 1, max: 4 },
  colors: { type: 'palette', presets: COLOR_PRESETS }
};

// AdminConfig reads schema and generates UI
const controls = generateControlsFromSchema(template.CONFIG_SCHEMA);
```

**Bad Architecture:**
```javascript
// ❌ AdminConfig has hardcoded controls for specific templates
if (template === 'Hook1A') {
  renderHook1AControls();
} else if (template === 'Explain2A') {
  renderExplain2AControls();
}
// This doesn't scale!
```

### Rule 3: JSON is the Source of Truth

State flow is unidirectional:

```
AdminConfig State → JSON Scene Object → Template Props
```

- **Never:** Template internal state that doesn't come from JSON
- **Always:** Bidirectional sync between UI and JSON
- **Validate:** JSON schema enforces correctness
- **Export:** JSON can be saved, versioned, shared

---

## 🎨 Configuration Domains

Every configurable aspect falls into one of these domains:

### 1. **VISUAL ELEMENTS**
What appears on screen.

**Controls:**
- Type selectors (Image, SVG, Lottie, etc.)
- Asset pickers (file upload, URL, library)
- Visibility toggles
- Z-index / layering

**JSON Structure:**
```json
{
  "hero": {
    "type": "image",
    "asset": "/path/to/image.jpg",
    "visible": true
  }
}
```

**UI Example:**
- Dropdown: "Hero Type" → [Image, SVG, RoughSVG, Lottie, Custom]
- File picker: "Asset"
- Toggle: "Show Hero"

---

### 2. **LAYOUT & POSITIONING**
Where elements appear and how they relate.

**Controls:**
- 9-point grid pickers
- Offset sliders (X/Y)
- Spacing controls
- Alignment presets

**JSON Structure:**
```json
{
  "hero": {
    "position": {
      "grid": "center",
      "offset": { "x": 0, "y": -50 }
    }
  },
  "question": {
    "layout": {
      "basePosition": "center",
      "verticalSpacing": 80,
      "offset": { "x": 0, "y": 0 }
    }
  }
}
```

**UI Example:**
- Grid Picker: Visual 3x3 grid (click to select)
- Sliders: "Offset X" (-500 to +500), "Offset Y" (-300 to +300)
- Slider: "Line Spacing" (40-120px)

---

### 3. **STYLE & APPEARANCE**
How elements look.

**Controls:**
- Color pickers with presets
- Font size sliders
- Opacity controls
- Effect toggles (glow, shimmer, etc.)

**JSON Structure:**
```json
{
  "style_tokens": {
    "colors": {
      "bg": "#FFF9F0",
      "accent": "#FF6B35",
      "accent2": "#9B59B6",
      "ink": "#1A1A1A"
    },
    "fonts": {
      "size_question": 92,
      "size_welcome": 72,
      "size_subtitle": 32
    }
  },
  "question": {
    "effects": {
      "entrance": "sparkles"
    }
  }
}
```

**UI Example:**
- Color Palette: Quick presets + individual pickers
- Sliders: "Question Size" (60-120)
- Dropdown: "Text Effect" → [Sparkles, Glow, Shimmer, None]

---

### 4. **ANIMATION & TIMING**
When and how things move.

**Controls:**
- Beat timeline sliders
- Entrance style dropdowns
- Duration controls
- Easing selectors
- Transition type dropdowns

**JSON Structure:**
```json
{
  "beats": {
    "entrance": 0.6,
    "questionStart": 0.6,
    "moveUp": 2.0,
    "emphasis": 4.2,
    "exit": 15.0
  },
  "animations": {
    "entrance": "fade-up"
  },
  "transition": {
    "type": "wipe-left"
  },
  "hero": {
    "transforms": [{
      "beat": "transformMap",
      "rotation": 45,
      "targetScale": 0.4,
      "duration": 1.2
    }]
  }
}
```

**UI Example:**
- Sliders: "Beat Timeline" (each beat with cumulative display)
- Dropdown: "Question Entrance" → [Fade Up, Slide Right, Bounce, etc.]
- Dropdown: "Scene Exit Transition" → [Wipe Left/Right/Up/Down, Fade, Zoom]
- Slider: "Hero Rotation" (-360° to 360°)

---

### 5. **CONTENT**
The actual text, data, and information.

**Controls:**
- Text inputs
- Textareas
- Dynamic list editors (add/remove items)
- Emphasis toggles

**JSON Structure:**
```json
{
  "welcome": {
    "text": "Welcome to Knodovia"
  },
  "subtitle": {
    "text": "A place where your perspective shapes the landscape..."
  },
  "question": {
    "lines": [
      { "text": "What if geography", "emphasis": "normal" },
      { "text": "was measured in mindsets?", "emphasis": "high" }
    ]
  }
}
```

**UI Example:**
- Input: "Welcome Text"
- Textarea: "Subtitle Text" (multi-line)
- Question Lines Editor:
  - [Add Line] [Remove Line] buttons
  - Text input per line
  - [Normal] [High] toggle per line

---

## 🔧 UI Component Library

### Core Controls (Required for All Templates)

#### **1. Slider**
```javascript
<Slider
  label="Question Size"
  value={fonts.size_question}
  onChange={(val) => updateFonts({ size_question: val })}
  min={60}
  max={120}
  step={2}
  unit="px"
/>
```

**Features:**
- Visual gradient fill showing progress
- Min/max labels
- Current value display with unit
- Step increments for precision

---

#### **2. ColorPicker**
```javascript
<ColorPicker
  label="Accent Color"
  value={colors.accent}
  onChange={(color) => updateColors({ accent: color })}
/>
```

**Features:**
- Native browser color picker
- Hex value display
- Quick preset buttons above picker
- Live preview

---

#### **3. GridPositionPicker**
```javascript
<GridPositionPicker
  value={hero.position}
  onChange={(pos) => updateHero({ position: pos })}
/>
```

**Features:**
- 3x3 interactive grid (9 positions)
- Visual selected state
- Maps to: top-left, top-center, top-right, center-left, center, center-right, bottom-left, bottom-center, bottom-right
- Clear visual feedback

---

#### **4. Dropdown**
```javascript
<Dropdown
  label="Text Effect"
  value={question.effects.entrance}
  onChange={(val) => updateQuestion({ effects: { entrance: val } })}
  options={[
    { value: 'sparkles', label: '✨ Sparkles' },
    { value: 'glow', label: '💫 Glow' },
    { value: 'shimmer', label: '🌟 Shimmer' },
    { value: 'none', label: '⭕ None' }
  ]}
/>
```

**Features:**
- Icons/emojis for visual distinction
- Clear labeling
- Helper text below explaining what it affects

---

#### **5. AccordionSection**
```javascript
<AccordionSection
  title="Animations & Effects"
  icon="✨"
  isOpen={openSections.animations}
  onToggle={() => toggleSection('animations')}
>
  {/* Controls go here */}
</AccordionSection>
```

**Features:**
- Collapsible to reduce visual clutter
- Icon for quick recognition
- Persists open/closed state
- Smooth animation

---

#### **6. DynamicList**
```javascript
<DynamicList
  items={question.lines}
  onUpdate={(newLines) => updateQuestion({ lines: newLines })}
  renderItem={(line, index) => (
    <LineEditor
      line={line}
      onChange={(updated) => updateLine(index, updated)}
    />
  )}
  addButton="Add Line"
  removeButton="Remove"
  min={1}
  max={4}
/>
```

**Features:**
- Add/remove buttons
- Min/max constraints
- Drag-to-reorder (future)
- Clear visual hierarchy

---

### Advanced Controls (Optional/Template-Specific)

- **BeatTimeline:** Visual timeline with multiple sliders
- **AssetPicker:** Upload, URL, or library selection
- **TransformEditor:** Multi-property transform controls
- **PresetGallery:** Visual preset selector with thumbnails

---

## 💡 Helper Text System

**CRITICAL RULE:** Every control MUST have helper text explaining what it affects.

### Format
```
[Control Label]
[Helper text in italics explaining what this affects]
[Control UI element]
```

### Example
```
Question Text Effect
Affects: Question lines when they appear
[Dropdown: ✨ Sparkles, 💫 Glow, ...]
```

### Guidelines
- **Be specific:** "Affects question lines" not "Changes animation"
- **Be visual:** "Shifts hero left/right/up/down" not "Adjusts position"
- **Be brief:** One sentence, ≤12 words
- **Be consistent:** Use same phrasing across similar controls

### Helper Text Library

**Layout:**
- "Shifts ALL question lines left/right/up/down"
- "Shifts hero element (map/image) position"
- "Controls spacing between question lines"

**Animations:**
- "Affects: Question lines when they appear"
- "Affects: How the entire scene exits at the end"
- "Affects: Hero element rotation during transformation"

**Style:**
- "Colors for primary highlights and emphasis"
- "Size of question text (larger = more emphasis)"
- "Background color for the entire scene"

---

## 📦 Preset System

Presets are curated configurations that demonstrate flexibility.

### Preset Structure
```javascript
const SCENE_PRESETS = [
  {
    id: 'geography',
    name: '🗺️ Geography',
    description: 'Knodovia map with 2-line question',
    hero: { type: 'roughSVG', asset: 'knodovia-map' },
    question: {
      lines: [
        { text: "What if geography", emphasis: "normal" },
        { text: "was measured in mindsets?", emphasis: "high" }
      ]
    },
    colors: {
      bg: '#FFF9F0',
      accent: '#FF6B35',
      accent2: '#9B59B6'
    },
    welcome: { text: "Welcome to Knodovia" }
  },
  {
    id: 'sports',
    name: '⚽ Sports',
    description: 'Football player with single line',
    hero: { type: 'image', asset: '/football-player.jpg' },
    question: {
      lines: [
        { text: "What defines a champion?", emphasis: "high" }
      ]
    },
    colors: {
      bg: '#F0F8FF',
      accent: '#4169E1',
      accent2: '#32CD32'
    }
  }
  // ... more presets
];
```

### Preset Requirements
1. **Cross-domain:** Show drastically different use cases
2. **Complete:** Include all necessary config for a working scene
3. **Validated:** Test thoroughly before adding
4. **Documented:** Clear name and description

### Preset UI
- Quick buttons at top: "🗺️ Geography", "⚽ Sports", "🔬 Science"
- Click loads entire config instantly
- Shows what's possible without manual config

---

## 🔄 State Management Pattern

### React State Structure
```javascript
const [scene, setScene] = useState(initialScene);
const [openSections, setOpenSections] = useState({
  hero: true,
  question: true,
  colors: false,
  // ...
});
```

### Update Patterns

**Individual field update:**
```javascript
const updateHero = (updates) => {
  setScene(prev => ({
    ...prev,
    hero: {
      ...(prev.hero || {}),
      ...updates
    }
  }));
};
```

**Nested field update:**
```javascript
const updateQuestion = (updates) => {
  setScene(prev => ({
    ...prev,
    question: {
      ...(prev.question || {}),
      ...updates,
      layout: {
        ...(prev.question?.layout || {}),
        ...(updates.layout || {})
      }
    }
  }));
};
```

**Array item update:**
```javascript
const updateLine = (index, lineUpdate) => {
  setScene(prev => ({
    ...prev,
    question: {
      ...prev.question,
      lines: prev.question.lines.map((line, i) =>
        i === index ? { ...line, ...lineUpdate } : line
      )
    }
  }));
};
```

### Sync with Parent
```javascript
// AdminConfig calls parent callback on updates
useEffect(() => {
  onSceneUpdate?.(scene);
}, [scene]);

// Parent (VideoWizard) maintains master state
const [adminScene, setAdminScene] = useState(initialScene);
const handleAdminSceneUpdate = (updatedScene) => {
  setAdminScene(updatedScene);
};
```

---

## 🎯 Template Integration Checklist

For a template to work with the Interactive Configurator:

### Phase 1: Configuration Exposure
- [ ] Remove ALL hardcoded values
- [ ] Move visuals to type registry (polymorphic)
- [ ] Move text to content arrays (dynamic)
- [ ] Move positions to token system (semantic)
- [ ] Define CONFIG_SCHEMA export

### Phase 2: JSON Structure
- [ ] Flat, readable structure
- [ ] Sensible defaults (progressive configuration)
- [ ] Schema validation (Zod/TypeScript)
- [ ] Backward compatibility with legacy format

### Phase 3: SDK Integration
- [ ] Use `heroRegistry` for visual types
- [ ] Use `questionRenderer` for dynamic lines
- [ ] Use `positionSystem` for layout
- [ ] Use animation presets consistently

### Phase 4: Configurator Integration
- [ ] Add controls for all exposed config
- [ ] Add helper text to every control
- [ ] Create 3+ cross-domain presets
- [ ] Test all controls update correctly

### Phase 5: Validation
- [ ] Load preset → works immediately
- [ ] Adjust every control → video updates
- [ ] Export JSON → reimport → identical result
- [ ] Edge cases handled (empty arrays, null values)

---

## 🚀 Scaling Strategy

### How This Scales to 100+ Templates

**Current State (HOOK1A):**
- 1 template
- 50+ configurable parameters
- AdminConfig has 6 accordion sections
- 4 presets

**Future State (100 templates):**
- 100 templates
- 5000+ total configurable parameters
- **Same 6 accordion sections** (domains are universal)
- **Shared controls** (color picker, slider, grid)
- 400 presets (4 per template, reusable across templates)

**The Magic:**
When we add a new control type (e.g., "Gradient Editor"), it instantly works for ALL templates that expose gradients in their schema.

### Benefits Compound

**Example: Adding "Rotation Control"**
1. Add `<RotationSlider>` component to AdminConfig (1 hour)
2. Update template schema to accept `rotation` (5 minutes per template)
3. Update heroRegistry to apply rotation (30 minutes)
4. **Result:** All 100 templates can now rotate heroes with zero additional UI work

### Anti-Pattern: Template-Specific UI
```javascript
// ❌ DON'T DO THIS
if (templateId === 'Hook1A') {
  return <Hook1ASpecificControls />;
} else if (templateId === 'Explain2A') {
  return <Explain2ASpecificControls />;
}
// This requires N * M work (N templates × M controls)
```

### Correct Pattern: Schema-Driven UI
```javascript
// ✅ DO THIS
const controls = generateControlsFromSchema(template.CONFIG_SCHEMA);
return <DynamicControls schema={controls} />;
// This requires N + M work (N templates + M control types)
```

---

## 📊 Metrics & Success Criteria

### Template Flexibility Score

**Measure how configurable a template is:**

```
Flexibility Score = (Configurable Parameters / Total Parameters) × 100
```

**Target:** ≥ 90% for production templates

**Example (HOOK1A):**
- Total parameters: 55
- Configurable: 52
- Hardcoded: 3 (only frame calculations)
- Score: 94.5% ✅

### Cross-Domain Test

**Every template must pass the "3 Domain Test":**

Load 3 drastically different presets:
1. Original domain (e.g., Geography)
2. Completely different domain (e.g., Sports)
3. Abstract/conceptual domain (e.g., Business metrics)

**Criteria:**
- ✅ All 3 presets work without code changes
- ✅ Visual quality maintained across domains
- ✅ No layout breaks or text overflow
- ✅ Animations feel appropriate in all contexts

### Configuration Completeness

**Can you recreate the original template from scratch using ONLY the configurator?**

Test:
1. Start with blank scene
2. Use ONLY AdminConfig controls (no JSON editing)
3. Recreate original example

**Pass:** You can get 95%+ identical result  
**Fail:** You need to edit JSON manually

---

## 🔒 Governance & Standards

### Code Review Requirements

Before merging template changes:

**Configurator Integration:**
- [ ] All config exposed through UI controls
- [ ] Helper text on every control
- [ ] At least 3 cross-domain presets
- [ ] Preset gallery shows variety

**JSON Schema:**
- [ ] Flat, readable structure
- [ ] Defaults for all optional fields
- [ ] Schema validation implemented
- [ ] Backward compatibility maintained

**Template Code:**
- [ ] No hardcoded values (visuals, positions, text)
- [ ] Uses SDK registries consistently
- [ ] Reads all config from scene prop
- [ ] Handles edge cases gracefully

### Documentation Requirements

Every new configurable parameter needs:
1. **JSON Schema:** Type, constraints, defaults
2. **UI Control:** Which component, placement
3. **Helper Text:** What it affects
4. **Preset Example:** Show it in use

---

## 🎓 Philosophy & Principles

### 1. **Configuration Over Code**

When choosing between:
- (A) Hardcoding a value in the template
- (B) Exposing it as configuration

**ALWAYS choose (B)**, even if it seems like overkill.

**Reason:** Today's "obvious default" is tomorrow's inflexibility.

---

### 2. **UI First, JSON Second**

The configurator is the primary interface. JSON is:
- Export format
- Version control format
- Programmatic interface
- Advanced user escape hatch

**Design flow:** UI → JSON → Template (not JSON → UI)

---

### 3. **Multiplicative Value**

Every configurator improvement has multiplicative value:

```
Value = (Quality of Improvement) × (Number of Templates)
```

Example:
- Add rotation control (quality: 8/10)
- Apply to 100 templates
- Total value: 800 points

This is WHY we invest heavily in the configurator.

---

### 4. **Constraints Enable Creativity**

Configurator provides:
- **Helpful constraints:** Min/max ranges, validated inputs
- **Smart defaults:** Start with good values
- **Guided exploration:** Presets show possibilities

This is BETTER than unlimited freedom because it:
- Prevents errors (e.g., negative beat times)
- Speeds up creation (good defaults)
- Inspires creativity (presets show what's possible)

---

## 🔮 Future Enhancements

### Short Term (Next 3 Months)
- [ ] Schema-driven control generation
- [ ] Preset import/export system
- [ ] Validation with visual feedback
- [ ] Undo/redo history
- [ ] Multi-template comparison view

### Medium Term (6 Months)
- [ ] Visual timeline editor for beats
- [ ] Drag-and-drop asset management
- [ ] Real-time collaboration (multiple users)
- [ ] AI-assisted preset generation
- [ ] Mobile-responsive configurator

### Long Term (12 Months)
- [ ] Visual flow builder (connect scenes)
- [ ] A/B testing variants
- [ ] Analytics on config usage
- [ ] Marketplace for presets
- [ ] Voice-driven configuration

---

## 📝 Implementation Example: HOOK1A

**Complete implementation demonstrating all principles:**

### AdminConfig.jsx Structure
```javascript
export const AdminConfig = ({ initialScene, onSceneUpdate }) => {
  const [scene, setScene] = useState(initialScene);
  const [openSections, setOpenSections] = useState({
    hero: true,
    question: true,
    colors: false,
    typography: false,
    timeline: false,
    content: false,
    animations: false,
    layout: false
  });

  // Update callbacks
  const updateHero = (updates) => { /* ... */ };
  const updateQuestion = (updates) => { /* ... */ };
  const updateColors = (updates) => { /* ... */ };
  
  // Presets
  const applyPreset = (preset) => {
    setScene({
      ...scene,
      ...preset
    });
  };

  return (
    <div className="admin-config">
      <PresetGallery presets={SCENE_PRESETS} onSelect={applyPreset} />
      
      <AccordionSection title="Hero Visual" icon="🎨">
        <Dropdown
          label="Hero Type"
          value={scene.hero?.type}
          onChange={(val) => updateHero({ type: val })}
          options={HERO_TYPES}
        />
        <div style={{ fontSize: 11, color: '#666', fontStyle: 'italic' }}>
          Affects: Main visual element (map, image, diagram)
        </div>
        {/* More controls... */}
      </AccordionSection>

      <AccordionSection title="Animations & Effects" icon="✨">
        <Dropdown
          label="Question Text Effect"
          value={scene.question?.effects?.entrance}
          onChange={(val) => updateQuestion({
            effects: { entrance: val }
          })}
          options={TEXT_EFFECTS}
        />
        <div style={{ fontSize: 11, color: '#666', fontStyle: 'italic' }}>
          Affects: Question lines when they appear
        </div>
        {/* More controls... */}
      </AccordionSection>
      
      {/* More sections... */}
    </div>
  );
};
```

---

## 🎯 Summary: The Contract

**TEMPLATES promise to:**
1. Expose all configuration through JSON
2. Use SDK registries for polymorphism
3. Never hardcode domain-specific logic
4. Handle edge cases gracefully

**CONFIGURATOR promises to:**
1. Provide intuitive UI for all configuration
2. Include helper text on every control
3. Offer presets showing flexibility
4. Maintain state synchronization

**RESULT:**
- Templates become infinitely flexible
- Users can create without coding
- Every UI improvement benefits all content
- System scales to 1000+ templates without complexity explosion

---

**This is THE PRINCIPAL. All templates align to this moving forward.**

---

## 🔗 Related Documents

- [Agnostic Template Principals](./KnoMotion-Videos/docs/agnosticTemplatePrincipals.md) - The 6 core template design principles
- [Blueprint v5.0](./KnoMotion-Videos/docs/BLUEPRINT_V5.md) - Technical scene rendering specification
- [Admin Config Guide](./ADMIN_CONFIG_GUIDE.md) - User guide for the HOOK1A configurator
- [Perfect Blueprint Complete](./PERFECT_BLUEPRINT_COMPLETE.md) - Implementation summary

---

**END OF INTERACTIVE CONFIGURATION PRINCIPAL**

*This document is the definitive standard for how we build configurable video templates at Knode. Any template that doesn't align to these principals is considered legacy and should be refactored or deprecated.*
