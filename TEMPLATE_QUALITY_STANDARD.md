# Template Quality Standard - The Hook1A Benchmark

**Last Updated:** 2025-10-30  
**Gold Standard:** Hook1A_Agnostic (665 lines)  
**Status:** Mandatory for All New Templates

---

## 🎯 The Core Principle

> **"If it can be done in PowerPoint, it's not good enough."**

Every template must have visual richness and micro-delights that are **impossible to replicate** in static presentation software.

---

## ✅ The Hook1A Quality Checklist

Based on analyzing Hook1AQuestionBurst_V5_Agnostic.jsx, every template MUST include:

### 1. **Micro-Delights (Minimum 5 Types)**

**Hook1A has 18+ implementations. Every template needs AT LEAST:**

- [ ] **Ambient Particles** (15-20 count, deterministic via useMemo)
- [ ] **Sparkles** (multiple sets for key elements, 8-12 per set)
- [ ] **Shimmer Effects** (on text reveals, gradient animation)
- [ ] **Liquid Blobs** OR **Glow Effects** (background ambient)
- [ ] **Breathing Animations** (subtle scale on emphasis elements)
- [ ] **Pulse Emphasis** (highlight key moments)
- [ ] **Spring Physics** (popIn, bounce-back on reveals)
- [ ] **Draw-On Effects** (SVG path animation, 1-2s duration)

**Current Templates:**
- ❌ Compare3B: Only basic particles (6/18 = 33% of Hook1A quality)
- ❌ Show5B: Only basic particles
- ❌ Build6A: Only basic particles

---

### 2. **Animation Richness (Multiple Phases)**

**Hook1A has 7+ distinct animation beats:**
1. Entrance (particles fade in)
2. Question reveal (line-by-line with sparkles)
3. Move up (shrink + reposition)
4. Emphasis (pulse + breathe)
5. Wipe questions (fade out)
6. Hero reveal (draw-on effect)
7. Welcome shimmer (text gradient sweep)
8. Shrink to corner (hero transform)
9. Exit (settle fade)

**Every template needs:**
- [ ] **Entrance phase** (0-1s): Background, particles, setup
- [ ] **Primary content reveal** (1-6s): Main teaching moment with staggered reveals
- [ ] **Mid-scene transition** (6-10s): Transform, reposition, or emphasize
- [ ] **Secondary content** (10-14s): Supporting details or outcomes
- [ ] **Exit phase** (14-16s): Settle, summarize, fade out

**Current Templates:**
- ❌ Compare3B: Only 3 phases (title, traverse, outcome) - too linear
- ❌ Show5B: Only 2 phases (stages loop, summary) - boring
- ❌ Build6A: Only 2 phases (layers appear, summary) - flat

---

### 3. **Visual Complexity (Cannot Replicate in PPT)**

**Hook1A features that make it impossible to do in PowerPoint:**

- [ ] **SVG draw-on animation** (path reveals progressively)
- [ ] **Particle systems** (20 particles with physics-based movement)
- [ ] **Sparkle bursts** (timed to content reveals, fade in/out)
- [ ] **Shimmer gradients** (animated linear gradients on text)
- [ ] **Liquid blob backgrounds** (organic shapes, animated)
- [ ] **Spring physics** (realistic bounce, overshoot, settle)
- [ ] **Breathing animations** (subtle scale oscillation)
- [ ] **Multi-layer composition** (5+ SVG layers with different opacities)

**PowerPoint Test:**
- Can you replicate the effect in PowerPoint?
  - If YES → ❌ Not good enough
  - If NO → ✅ Meets standard

**Current Templates:**
- ❌ Compare3B: Tree nodes + paths = basic flowchart (PPT can do this)
- ❌ Show5B: Boxes appearing = basic bullet reveals (PPT can do this)
- ❌ Build6A: Rectangles stacking = basic animation (PPT can do this)

---

### 4. **JSON Configurability Depth**

**Hook1A configurability (from blueprint & code):**

```json
{
  "hero": {
    "type": "image | svg | roughSVG | lottie | custom",  // 5 types
    "asset": "...",
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
    "drawOn": {
      "enabled": true,
      "duration": 1.3,
      "strokeWidth": 6
    }
  },
  "question": {
    "lines": [
      { "text": "...", "emphasis": "normal | high | subtle" },
      { "text": "...", "emphasis": "high" }
    ],
    "layout": {
      "basePosition": "center",
      "spacing": 80,
      "maxWidth": 1400
    },
    "animation": {
      "stagger": 0.3,
      "entranceType": "fadeUp | slideIn | popIn",
      "emphasisType": "pulse | breathe | glow"
    }
  },
  "effects": {
    "particles": {
      "count": 20,
      "colors": ["#FF6B35", "#9B59B6"],
      "opacity": 0.3
    },
    "sparkles": {
      "enabled": true,
      "count": 12,
      "triggerBeats": ["questionPart1", "questionPart2", "welcome"]
    },
    "shimmer": {
      "enabled": true,
      "speed": 2.0,
      "color": "#FFD700"
    }
  }
}
```

**Every template needs:**
- [ ] 3+ levels of configurability (simple → intermediate → advanced)
- [ ] Multiple effect toggles
- [ ] Position system (grid + offset)
- [ ] Animation customization per element
- [ ] Color palette flexibility
- [ ] Typography control

**Current Templates:**
- ❌ Compare3B: Shallow config (only tree structure, no effect controls)
- ❌ Show5B: Shallow config (only stages, no effect controls)
- ❌ Build6A: Shallow config (only layers, no effect controls)

---

### 5. **Collision Detection (Properly Implemented)**

**Hook1A collision system:**
- Defines bounding boxes for ALL elements
- Calculates text width dynamically
- Accounts for animation transforms
- Tests during development
- Auto-adjusts positions if conflicts

**Hook1A bounding boxes defined:**
```javascript
export const getLayoutConfig = (scene, fps) => {
  return {
    getBoundingBoxes: (scene) => {
      const boxes = [];
      
      // Calculate ACTUAL sizes based on content
      const questionLines = scene.question?.lines || [];
      questionLines.forEach((line, i) => {
        boxes.push(createTextBoundingBox({
          id: `question-line-${i}`,
          text: line.text,
          x: 960,
          y: 480 + i * 80,  // Actual positions used in render
          fontSize: 92,
          maxWidth: 1400,
          padding: 20,
          priority: 10,
          flexible: false,
        }));
      });
      
      // Hero box
      const heroPos = resolvePosition(scene.hero?.position || 'center-right');
      boxes.push(createShapeBoundingBox({
        id: 'hero',
        x: heroPos.x,
        y: heroPos.y,
        width: 600,  // Actual hero size
        height: 400,
        padding: 30,
        priority: 9,
        flexible: true,
      }));
      
      return boxes;
    },
  };
};
```

**Every template needs:**
- [ ] Bounding boxes for ALL visible elements
- [ ] Boxes match ACTUAL render positions (not guesses)
- [ ] Priority system (what can move vs. what's fixed)
- [ ] Proper padding/margins
- [ ] Dynamic calculation based on content

**Current Templates:**
- ❌ Compare3B: Minimal boxes, doesn't account for tree layout properly
- ❌ Show5B: Minimal boxes, doesn't calculate option positions
- ❌ Build6A: Minimal boxes, doesn't account for stacked layers

---

### 6. **Creative Effects Budget**

**Hook1A creative effects:**
- ✅ 20 ambient particles (0.3 opacity)
- ✅ 3 sets of sparkles (12, 8+N, 12 counts)
- ✅ Shimmer gradient on welcome text
- ✅ Liquid blobs (optional background)
- ✅ Breathing animation on hero
- ✅ Pulse emphasis on question lines
- ✅ SVG draw-on for map reveal
- ✅ Shrink-to-corner hero transform

**Minimum for every template:**
- [ ] 15-20 ambient particles
- [ ] 2-3 sets of sparkles (8-12 each)
- [ ] 1-2 shimmer/glow effects
- [ ] 1 draw-on or path animation
- [ ] 2+ emphasis animations (pulse, breathe, scale)
- [ ] Background gradients (radial, animated)

**Current Templates:**
- ❌ Compare3B: 8 particles only, no sparkles, no shimmer
- ❌ Show5B: 10 particles only, no sparkles, no shimmer
- ❌ Build6A: 10 particles only, no sparkles, no shimmer

---

### 7. **Code Quality Markers**

**Hook1A code structure:**
- 665 lines (rich, detailed)
- 18+ micro-delight usage count
- 5+ useEffect blocks (complex rendering)
- 10+ useMemo optimizations
- 200+ lines of rough.js drawing
- 100+ lines of animation calculations
- Proper error handling
- Backward compatibility layer

**Quality threshold:**
- [ ] Template should be 550-750 lines (not 300-400)
- [ ] 15+ micro-delight usage count
- [ ] 3+ useEffect blocks (rendering complexity)
- [ ] 5+ useMemo optimizations (particles, sparkles, calculations)
- [ ] 150+ lines of visual rendering (SVG, rough.js, custom)
- [ ] Proper documentation in code

**Current Templates:**
- ❌ Compare3B: 554 lines but hollow (6 micro-delights vs. 18)
- ❌ Show5B: ~400 lines (thin)
- ❌ Build6A: ~350 lines (thin)

---

## 🚨 Mandatory Pre-Commit Checklist

Before any template is considered "done":

### Visual Quality
- [ ] **PowerPoint Test:** Cannot be replicated in PPT
- [ ] **Micro-Delights:** Minimum 5 different types
- [ ] **Particle Count:** 15-20 ambient particles
- [ ] **Sparkles:** 2-3 sets minimum
- [ ] **Shimmer/Glow:** At least 1 implementation
- [ ] **Animation Phases:** Minimum 5 distinct beats

### Technical Quality
- [ ] **Line Count:** 550-750 lines (rich implementation)
- [ ] **Collision Detection:** All elements have bounding boxes
- [ ] **Zero Wobble:** roughness: 0, bowing: 0 (ALWAYS)
- [ ] **useMemo:** 5+ optimizations
- [ ] **useEffect:** 3+ rendering blocks

### JSON Configurability
- [ ] **3 Levels:** Simple → Intermediate → Advanced configs supported
- [ ] **Effect Toggles:** Can enable/disable sparkles, shimmer, particles
- [ ] **Position Control:** Grid + offset system implemented
- [ ] **Animation Control:** Per-element timing overrides
- [ ] **Color Palette:** Full palette configurability

### Pedagogical Quality
- [ ] **Clear Teaching Moment:** Not just information display
- [ ] **Passive Learning:** No hands-on required during video
- [ ] **Visual Impact:** Teaching through visuals, not just text
- [ ] **So What Factor:** Answers "why does this matter?"

### Integration
- [ ] **Build Passing:** npm run build succeeds
- [ ] **TemplateRouter:** Registered correctly
- [ ] **App.jsx:** Added to dropdown
- [ ] **VideoWizard:** Works in wizard mode
- [ ] **Example Scene:** Production-quality JSON included

---

## 📋 Review Process (Proposed)

### Before Submitting Any Template:

**Step 1: Self-Review Against Hook1A**
```bash
# Compare micro-delight count
grep -c "generateSparkles\|getShimmerEffect\|getLiquidBlob\|breathe\|pulseEmphasis" MyNewTemplate.jsx
# Should be: 15+ (Hook1A has 18)

# Compare line count
wc -l MyNewTemplate.jsx
# Should be: 550-750 lines (Hook1A is 665)

# PowerPoint test
# Can this be done in PPT? If yes → REJECT
```

**Step 2: Collision Test**
- Render at 3 different frame positions
- Screenshot and verify ZERO overlaps
- Test with different content lengths

**Step 3: JSON Flexibility Test**
- Create 3 different domain examples
- Ensure minimal JSON changes (no code edits)
- Test simple → advanced config levels

**Step 4: Pedagogy Test**
- Does it teach a concept? (not just display info)
- Is it passive learning? (no hands-on required)
- Does it answer "so what"? (why this matters)

---

## 🔧 How to Fix Current Templates

### Compare3B: Decision Tree (REBUILD REQUIRED)

**Add:**
- ✨ Sparkles on each node reveal (12 sparkles per node)
- ✨ Shimmer effect on decision paths
- ✨ Glow effect on final outcome
- ✨ Particle burst when reaching outcome
- ✨ Liquid blob backgrounds for decision zones
- ✨ Breathing animation on current node
- 🔧 Proper collision detection (calculate tree layout properly)
- 🔧 Multiple animation phases (not just linear traversal)

**Pedagogy improvements:**
- Add "why this decision matters" context
- Show trade-offs visually (not just yes/no)
- Add visual impact indicators
- Include "common mistakes" callouts

---

### Show5B: Configuration Flow (REBUILD REQUIRED)

**Add:**
- ✨ Sparkles on option reveals
- ✨ Shimmer on recommended option
- ✨ Impact visualization (not just text)
- ✨ Glow effects on choices
- ✨ Particle trails between stages
- 🔧 Proper collision detection for stacked options
- 🔧 Visual comparison (show before/after of choice)

**Pedagogy improvements:**
- Add visual representation of impact (charts, graphs)
- Show "what happens if wrong choice" warnings
- Include cost/performance visualizations
- Add contextual "why it matters"

---

### Build6A: Progressive Layers (NEEDS ENHANCEMENT)

**Add:**
- ✨ Sparkles on each layer reveal
- ✨ Shimmer on layer connections
- ✨ Glow effect showing layer relationships
- ✨ Draw-on connectors between layers
- ✨ Particle system showing data flow
- 🔧 Better layer visualization (not just rectangles)
- 🔧 Collision detection for layer descriptions

**Pedagogy improvements:**
- Add "what breaks without this layer" warnings
- Show attack vectors (for security layers)
- Visual before/after for each layer
- Reinforce "so what" at end (not rush)

---

## 📐 Hook1A Feature Breakdown

### What Makes It Great:

**1. Hero Polymorphism (5 Types):**
```javascript
// Can be: image, svg, roughSVG, lottie, custom
renderHero(heroConfig, frame, beats, colors)
```

**2. Dynamic Question Lines (1-4+):**
```javascript
// Auto-adjusts layout, spacing, animation
renderQuestionLines(questionConfig, frame, beats, colors)
```

**3. Position System:**
```javascript
// Grid tokens + offset system
const pos = resolvePosition({ grid: 'center-right', offset: { x: -100, y: 0 } })
```

**4. Creative Effects (8 Types):**
- Ambient particles (20)
- Sparkles Q1 (12)
- Sparkles Q2 (8+N)
- Sparkles Welcome (12)
- Shimmer on welcome text
- Liquid blob (optional)
- Breathe animation on hero
- Pulse on question emphasis

**5. Animation Phases (9 Beats):**
- entrance, questionStart, moveUp, emphasis, wipeQuestions, mapReveal, welcome, shrink, exit

**6. Collision Detection:**
- Bounding boxes for ALL elements
- Dynamic text width calculation
- Hero position accounting
- Priority system

---

## 💡 Proposed Solution

### Option 1: REBUILD All 3 Templates to Hook1A Standard

**Estimated Time:** 3-4 hours per template (9-12 hours total)

**What I'll do:**
- Study Hook1A in detail
- Copy micro-delight patterns
- Implement proper collision detection
- Add multiple animation phases
- Ensure "cannot do in PPT" quality
- Add pedagogical depth

---

### Option 2: Create QUALITY TEMPLATE GENERATOR

**Create a template scaffolding system:**

```javascript
// templateGenerator.js
export const createRichTemplate = (config) => {
  return {
    // Auto-includes:
    - 20 ambient particles
    - 3 sparkle sets
    - Shimmer effects
    - Glow highlights
    - Proper collision detection
    - 5+ animation phases
    - Full JSON configurability
    
    // Plus template-specific logic
    ...config.customLogic
  };
};
```

**Benefit:** Never ship low-quality templates again

---

### Option 3: DETAILED REVIEW BEFORE PROCEEDING

**I should:**
1. Create comprehensive blueprints FIRST (like Hook1A blueprint)
2. Get your approval on pedagogy + visual concept
3. Build with Hook1A quality patterns
4. Test against checklist BEFORE showing you

---

## 📝 Documentation I'll Create

### 1. **Hook1A Deep Dive Document**
- Line-by-line analysis of what makes it great
- Micro-delight pattern library
- Collision detection patterns
- JSON configurability patterns

### 2. **Template Creation Playbook**
- Step-by-step guide to building rich templates
- Copy-paste micro-delight patterns
- Collision detection boilerplate
- Animation phase templates

### 3. **Quality Gate Checklist**
- Automated tests for micro-delight count
- PowerPoint comparison test
- Collision validation
- Line count check

---

## 🎯 My Recommendation

**I suggest:**

1. **PAUSE new template development**
2. **I'll create comprehensive quality documentation** (studying Hook1A)
3. **I'll propose detailed blueprints** for Compare3B, Show5B, Build6A
4. **You approve blueprints BEFORE I code**
5. **I rebuild to Hook1A quality standard**
6. **We establish automated quality gates**

This will save us BOTH time - better to do it right once than iterate 5 times.

---

**What do you want me to do?**

A) Rebuild all 3 templates now to Hook1A quality (9-12 hours)
B) Create quality documentation first, then rebuild (slower but systematic)
C) Focus on just 1 template (Compare3B?) to prove quality, then continue
D) Something else?

I'm committed to matching Hook1A quality. I just need guidance on the best path forward.