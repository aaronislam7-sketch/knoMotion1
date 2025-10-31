# Compare3B: Decision Tree - REBUILD BLUEPRINT
## TEACHING TEMPLATE - Where Users LEARN

**Created:** 2025-10-30  
**Status:** Pre-Development Blueprint  
**Quality Philosophy:** Learn from Hook1A's STRUCTURE, SURPASS it in TEACHING effectiveness

---

## 🎯 Critical Context: What This Template IS

**THIS IS A TEACHING TEMPLATE - NOT A HOOK**

- **Hook1A:** Basic, just a question, minimal content, hooks learner
- **Compare3B:** WHERE THE USER LEARNS - meat and bones of education
- **Goal:** SURPASS Hook1A by making learning impossible without this visual experience

**NOT about copying Hook1A's effects (that causes content fatigue)**  
**YES about learning from Hook1A's structure, depth, quality**

---

## 🔴 Current Problems (User Feedback)

1. **Collision Issues:** "So much overlap, so many collisions"
   - Tree layout algorithm not accounting for node sizes properly
   - No proper bounding boxes for dynamic tree structure

2. **Poor Visual Quality:** "Falls very short of 'if it can be done in PPT it's not good enough'"
   - Just a basic flowchart with animated paths
   - Could easily be replicated in PowerPoint
   - No visual richness

3. **Weak Pedagogy:** "Little in terms of microdelights, mid scene transitions"
   - Only 3 animation phases (title, traverse, outcome)
   - Doesn't teach WHY decisions matter
   - No visual consequences shown
   - Rushes to outcome without context

---

## 🎯 Rebuild Goals

### Primary Goal
**Transform Compare3B into the DEFINITIVE way to learn decision-making. Make it impossible to understand the decision logic without watching this.**

### Success Criteria
- ✅ **Pedagogical Depth:** User learns WHY each decision matters, not just the path
- ✅ **Visual Teaching:** Cannot learn this from text/slides - needs the visuals
- ✅ **Purposeful Micro-Delights:** Effects that SUPPORT learning, not decoration
- ✅ **Hook1A Structure:** Depth, organization, collision detection, quality
- ✅ **SURPASSES Hook1A:** More valuable to learner than a hook template
- ✅ Passes "PowerPoint test" - cannot be replicated

---

## 📐 Visual Concept (The TEACHING Experience)

**Core Principle:** Every phase must teach something new. User should learn progressively, not just watch a flowchart animate.

---

### Phase 1: Context Setup (0-2s)
**What User Learns:** "This is a decision I need to make"

**Visual Elements:**
- Clean entrance (ambient particles for quality, not distraction)
- Title reveals with purpose
- **"Stakes" panel:** Shows why this decision matters (cost range, time range, impact)
- Simple, clear, establishes context

**Technical:**
- 15-20 ambient particles (low opacity 0.2-0.3)
- Gradient background (subtle)
- Title fadeUp with spring physics
- Stakes panel slides in from side

---

### Phase 2: The Core Question (2-4s)
**What User Learns:** "Here's the first decision point and what it means"

**Visual Elements:**
- Root question appears with emphasis (this is important!)
- **Definition box:** What does "OS control" actually mean? (glossary-style)
- **Why it matters:** 2-3 bullet points showing implications
- Not decoration - pure teaching

**Technical:**
- Root node popIn with spring
- Subtle glow pulse (draws eye, not distracting)
- Definition box fades in alongside
- Text reveals progressively (not all at once)

---

### Phase 3: Trade-Offs Revealed (4-7s)
**What User Learns:** "If I say YES vs NO, here's what I gain and lose"

**Visual Elements:**
- **YES path** vs **NO path** comparison panels appear
- **Trade-off scales:** Visual weights (control vs simplicity, cost vs ease)
- Branches draw on to show structure
- User now understands the implications BEFORE seeing outcomes

**Technical:**
- Comparison panels slide in from left/right
- Trade-off scales animate (visual weight shifts)
- Branches use SVG draw-on (progressive reveal)
- Small pulse on key trade-off points (purposeful emphasis)

---

### Phase 4: Decision Logic Traversal (7-12s)
**What User Learns:** "Here's the logical flow, step by step"

**Visual Elements:**
- Each decision node reveals with:
  - The question
  - Context: "Why ask this?"
  - Impact preview: "If yes... if no..."
- **Glow trail** shows which path we're following (teaching tool, not decoration)
- Rejected paths fade slightly (focus on learning path)

**Technical:**
- Staggered node reveals (spring physics, depth-based timing)
- Glow trail follows path (animated, teaches flow)
- Small context boxes appear per node (why this question matters)
- Smooth transitions between levels

---

### Phase 5: Outcome + Real Context (12-16s)
**What User Learns:** "This is the recommended solution AND here's why it fits"

**Visual Elements:**
- Outcome badge appears with emphasis
- **Use Case Panel:** "You'd use this when..."
- **Cost/Time/Complexity metrics:** Real numbers, not abstracts
- **Common Pitfalls:** "Avoid this mistake..."
- This is the MEAT of learning - not just "Cloud Run" but WHY Cloud Run

**Technical:**
- Outcome badge popIn with small confetti burst (celebration, earned it)
- Context panels slide in from right (rich content)
- Metrics animate (charts, numbers, visuals)
- Small pulse on pitfall warnings (draw attention)

---

### Phase 6: "So What?" Summary (16-19s)
**What User Learns:** "Here's the key takeaway and next steps"

**Visual Elements:**
- **Decision summary:** Visual recap of path taken
- **Key learning:** "Remember: Choose based on X, not Y"
- **Next action:** "Now you can configure..." (links learning to action)
- Doesn't rush - reinforces learning

**Technical:**
- Summary panel with path highlight
- Key learning text with subtle emphasis (not overdone)
- Clean, professional, focused on retention

---

### Phase 7: Exit (19-20s)
**What User Learns:** [Retention phase, no new info]

**Visual Elements:**
- Clean settle
- Particles fade
- Gentle overlay

**Technical:**
- Smooth fade
- Particles slow and dissipate
- Exit overlay (15% opacity)

---

## 🎨 Purposeful Enhancements (Teaching-Focused, Not Decoration)

### Design Philosophy
**Every enhancement must answer: "Does this help the user LEARN better?"**

Not a checklist. Not copying Hook1A. SURPASSING it by making learning clearer.

---

### TEACHING VISUALIZATIONS (Core Focus)

**1. Decision Impact Visualization**
- **Purpose:** Show real consequences of each choice
- **How:** Side-by-side comparison panels (cost, time, complexity)
- **Why PowerPoint Can't:** Animated reveal tied to decision logic

**2. Trade-Off Scales**
- **Purpose:** Visually show what you gain vs. what you lose
- **How:** Animated balance scales, weight indicators
- **Why PowerPoint Can't:** Dynamic weights based on context

**3. "What Breaks" Warnings**
- **Purpose:** Show failure modes for wrong decisions
- **How:** Conditional warnings that appear on risky paths
- **Why PowerPoint Can't:** Context-aware, path-dependent

**4. Decision Path Highlighting**
- **Purpose:** Make it clear which decisions lead to which outcomes
- **How:** Animated glow trail following logic
- **Why PowerPoint Can't:** Progressive reveal with state tracking

**5. Outcome Context Panels**
- **Purpose:** "So what?" - why this outcome matters
- **How:** Real metrics, use cases, next steps
- **Why PowerPoint Can't:** Rich data visualization, not bullet points

---

### PURPOSEFUL MICRO-DELIGHTS (Support Learning, Don't Distract)

**Animation Strategy: Progressive Disclosure**
- Start simple (title, root question)
- Build complexity (show branches, trade-offs)
- Highlight path (glow on chosen route)
- Contextualize outcome (impact, consequences)
- Settle with key takeaway

**Specific Enhancements:**

1. **Ambient particles (15-20)** - Establishes quality, doesn't distract (low opacity)
2. **Glow on decision path** - TEACHES which route you're following (purposeful)
3. **Spring physics on nodes** - Makes hierarchy clear (root pops first, then children)
4. **Draw-on branches** - TEACHES the connection structure (not instant, progressive)
5. **Pulse on trade-offs** - Draws eye to key learning point (when to use sparkles purposefully)
6. **Outcome badge emphasis** - Celebrates learning completion (small confetti or glow)
7. **Impact metric reveals** - TEACHES consequences (charts, numbers, visuals)

**What We're NOT Doing:**
- ❌ Sparkles on every element (content fatigue)
- ❌ Shimmer on random text (no purpose)
- ❌ Liquid blobs (Hook1A used it, we don't need it here)
- ❌ Breathing on multiple elements (overused, distracting)
- ❌ Effects for checklist's sake

**Total: ~8-10 purposeful enhancements** (quality over quantity)

---

## 🏗️ Technical Architecture

### Code Structure (650-750 lines)

```javascript
// IMPORTS (30 lines)
import {
  // Animation presets (Hook1A uses all of these)
  fadeUpIn,
  popInSpring,
  pulseEmphasis,
  breathe,
  shrinkToCorner,  // For rejected paths
  
  // Creative effects (Hook1A uses all)
  generateAmbientParticles,
  renderAmbientParticles,
  generateSparkles,
  renderSparkles,
  generateConfettiBurst,
  renderConfettiBurst,
  getLiquidBlob,
  getShimmerEffect,
  getGlowEffect,
  
  // Draw-on effects
  getPathDrawProgress,
  
  // Core
  EZ,
  useSceneId,
  toFrames,
  
  // Collision detection
  createTextBoundingBox,
  createShapeBoundingBox,
} from '../sdk';

// STATE & REFS (20 lines)
const svgRef = useRef(null);
const particlesRef = useRef(null);
const sparklesRef = useRef(null);
const effectsRef = useRef(null);
const glowRef = useRef(null);
const roughRef = useRef(null);

// PARTICLE GENERATION (50 lines)
// ✨ Hook1A has 3 useMemo for particles
const ambientParticles = useMemo(() => 
  generateAmbientParticles(20, 42, 1920, 1080), []
);

const sparklesRoot = useMemo(() => 
  generateSparkles(15, { x: 960, y: 280, width: 300, height: 100 }, 100), []
);

const sparklesPerNode = useMemo(() => {
  return treeNodes.map((node, i) => 
    generateSparkles(8 + i, { x: node.x, y: node.y, width: 280, height: 80 }, 200 + i * 50)
  );
}, [treeNodes]);

const sparklesOutcome = useMemo(() => 
  generateSparkles(20, { x: 960, y: 800, width: 400, height: 200 }, 500), []
);

const confettiBurst = useMemo(() => 
  generateConfettiBurst(20, { x: 960, y: 800 }, 600), []
);

// DATA PARSING (100 lines - keep existing)
// Tree parsing, layout calculation, etc.

// BEATS & TIMING (40 lines)
// Hook1A has 9 beats, we need 7+
const beats = {
  entrance: 0.5,
  title: 1.0,
  rootQuestion: 2.0,
  rootEmphasis: 3.0,
  branchVisualization: 4.0,
  traverseStart: 7.0,
  // Dynamic: traverseStart + depth * 1.5 per level
  outcomeReveal: 12.0,
  outcomeContext: 15.0,
  exit: 18.0,
};

// ANIMATIONS (150 lines)
// 15+ animation calculations
const titleAnim = fadeUpIn(...);
const rootQuestionAnim = popInSpring(...);
const rootGlow = getGlowEffect(...);
const rootBreathe = breathe(...);
const branchDrawProgress = getPathDrawProgress(...);
const nodeAnims = treeNodes.map(...); // Per-node sparkles + pop
const outcomeGlow = getGlowEffect(...);
const outcomeShimmer = getShimmerEffect(...);
const outcomeBreathe = breathe(...);
// etc.

// COLLISION DETECTION (80 lines)
// Proper bounding boxes for ALL elements
export const getLayoutConfig = (scene, fps) => {
  return {
    getBoundingBoxes: (scene) => {
      const boxes = [];
      
      // Title
      boxes.push(createTextBoundingBox({
        id: 'title',
        text: scene.fill?.decision?.title,
        x: 960, y: 100,
        fontSize: 48,
        maxWidth: 1200,
        padding: 20,
        priority: 10,
        flexible: false,
      }));
      
      // Parse tree and calculate ALL node positions
      const nodes = parseTreeForCollision(scene);
      nodes.forEach((node, i) => {
        boxes.push(createShapeBoundingBox({
          id: `node-${i}`,
          x: node.x,
          y: node.y,
          width: node.width,
          height: node.height,
          padding: 40, // Space for glow effects
          priority: node.type === 'outcome' ? 9 : 8,
          flexible: node.depth > 2, // Deep nodes can shift
        }));
      });
      
      // Context panels
      boxes.push(createShapeBoundingBox({
        id: 'context',
        x: 1500, y: 540,
        width: 300, height: 200,
        padding: 20,
        priority: 7,
        flexible: true,
      }));
      
      return boxes;
    },
  };
};

// ROUGH.JS RENDERING (150 lines)
// Hook1A has ~200 lines of SVG rendering
useEffect(() => {
  // 1. Draw liquid blob background
  const blob = getLiquidBlob(frame, {...});
  
  // 2. Draw decision zones (green/red glow areas)
  const yesZone = rc.path(...); // Green glow
  const noZone = rc.path(...);  // Red glow
  
  // 3. Draw branches with progress animation
  branches.forEach(branch => {
    const drawProgress = getPathDrawProgress(...);
    const path = rc.path(`M ... Q ... ${drawProgress}`, {
      stroke: branchColor,
      strokeWidth: 4,
      roughness: 0,
      bowing: 0,
    });
    // Apply dasharray for draw-on effect
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length * (1 - drawProgress);
  });
  
  // 4. Draw node boxes with glow
  nodes.forEach(node => {
    const box = rc.rectangle(..., {
      roughness: 0,
      bowing: 0,
      fill: nodeColor,
    });
    
    // Add glow filter
    if (node.isActive) {
      box.setAttribute('filter', `url(#${id('node-glow')})`);
    }
  });
  
  // 5. Draw trade-off indicators (visual weights)
  // 6. Draw impact badges
  // etc.
}, [frame, beats, colors, ...]);

// SPARKLE RENDERING (60 lines)
useEffect(() => {
  // Hook1A renders sparkles in separate layer
  
  // 1. Root question sparkles
  if (frame >= beats.rootQuestion && frame < beats.rootQuestion + 50) {
    renderSparkles(sparklesRoot, frame, beats.rootQuestion, colors.accent);
  }
  
  // 2. Per-node sparkles
  treeNodes.forEach((node, i) => {
    const nodeStart = beats.traverseStart + node.depth * 1.5 * fps;
    if (frame >= nodeStart && frame < nodeStart + 50) {
      renderSparkles(sparklesPerNode[i], frame, nodeStart, colors.accent2);
    }
  });
  
  // 3. Outcome sparkles + confetti
  if (frame >= beats.outcomeReveal && frame < beats.outcomeReveal + 80) {
    renderSparkles(sparklesOutcome, frame, beats.outcomeReveal, '#FFD700');
    renderConfettiBurst(confettiBurst, frame, beats.outcomeReveal, [colors.accent, colors.accent2, colors.highlight]);
  }
}, [frame, beats, ...]);

// GLOW & SHIMMER RENDERING (40 lines)
useEffect(() => {
  // 1. Root question glow
  const rootGlow = getGlowEffect(frame - beats.rootQuestion, {...});
  
  // 2. Path glow trail
  const pathGlow = getGlowEffect(frame - beats.traverseStart, {...});
  
  // 3. Outcome shimmer
  if (frame >= beats.outcomeReveal) {
    const shimmer = getShimmerEffect(frame - beats.outcomeReveal, {
      speed: 0.03,
      width: 150,
      angle: 45,
    });
    // Apply gradient to outcome badge
  }
}, [frame, beats, ...]);

// JSX RENDERING (150 lines)
return (
  <AbsoluteFill>
    {/* 6 SVG layers (like Hook1A) */}
    {/* 1. Liquid blob background */}
    {/* 2. Ambient particles */}
    {/* 3. Glow effects */}
    {/* 4. Rough.js shapes */}
    {/* 5. Sparkles */}
    {/* 6. Content (text, icons) */}
    
    {/* Context panels */}
    {/* "Why this matters" */}
    {/* Trade-off visualizations */}
    {/* Impact indicators */}
  </AbsoluteFill>
);
```

**Total Estimated Lines: 650-750** ✅

---

## 📊 Collision Detection Fix

### Current Problem
```javascript
// ❌ Current: Naive layout doesn't account for collisions
const x = 960 + offset; // Just spreads left/right
const y = startY + depth * verticalSpacing;
```

**Issues:**
- Deep trees cause nodes to overlap horizontally
- No bounds checking
- Doesn't account for node content length
- No bounding boxes defined

### Solution: Hook1A-Style Collision System

```javascript
export const getLayoutConfig = (scene, fps) => {
  return {
    getBoundingBoxes: (scene) => {
      const boxes = [];
      
      // 1. Parse tree to get ALL nodes
      const nodes = parseTreeWithPositions(scene);
      
      // 2. Create bounding box for EACH node
      nodes.forEach((node, i) => {
        const textWidth = calculateTextWidth(node.question || node.label, fonts.size_question);
        
        boxes.push(createShapeBoundingBox({
          id: `node-${node.id}`,
          x: node.x,
          y: node.y,
          width: Math.max(280, textWidth + 40), // Dynamic width
          height: node.type === 'outcome' ? 120 : 80,
          padding: 40, // Account for glow effects
          priority: node.type === 'outcome' ? 9 : (10 - node.depth), // Root is priority 10
          flexible: node.depth >= 3, // Deep nodes can shift
        }));
      });
      
      // 3. Add boxes for context panels, title, etc.
      // ...
      
      return boxes;
    },
    
    // 4. Auto-adjust layout on collision
    resolveCollisions: true,
    shiftStrategy: 'horizontal-spread', // Push nodes apart horizontally
  };
};
```

### Improved Layout Algorithm

```javascript
const layoutNodes = useMemo(() => {
  const nodeWidth = 280;
  const nodeHeight = 80;
  const minHorizontalSpacing = 120; // Increased from 100
  const verticalSpacing = 140;
  const startY = 280;
  
  // 1. Calculate initial positions
  const positions = calculateTreeLayout(treeNodes, {
    nodeWidth,
    nodeHeight,
    horizontalSpacing: minHorizontalSpacing,
    verticalSpacing,
  });
  
  // 2. Detect and resolve collisions
  const adjustedPositions = resolveLayoutCollisions(positions, {
    minDistance: minHorizontalSpacing,
    maxWidth: 1920,
    centerX: 960,
  });
  
  // 3. Apply bounds checking
  adjustedPositions.forEach(pos => {
    pos.x = Math.max(nodeWidth / 2 + 100, Math.min(1920 - nodeWidth / 2 - 100, pos.x));
    pos.y = Math.max(nodeHeight / 2 + 200, pos.y);
  });
  
  return adjustedPositions;
}, [treeNodes]);
```

**Result:** Zero overlaps, proper spacing, dynamic adjustment ✅

---

## 🎓 Pedagogical Enhancements

### Current Problem: "Too Light"
User feedback: "I am unsure on WHAT you are trying to teach me?"

### Solution: Rich Context Visualization

**1. "Why This Decision Matters" Panel**
```javascript
// Appears during root question phase
<ContextPanel>
  <h3>Why This Matters</h3>
  <Impact>
    <Metric icon="💰">Cost: $5-500/mo</Metric>
    <Metric icon="⚡">Setup: 5min - 4hrs</Metric>
    <Metric icon="🔧">Control: Low - Full</Metric>
  </Impact>
</ContextPanel>
```

**2. Trade-Off Indicators**
```javascript
// Visual weights showing pros/cons
<TradeOffScale>
  <LeftSide label="VM">
    <Weight value={0.8}>Full Control</Weight>
    <Weight value={0.3}>Easy Setup</Weight>
  </LeftSide>
  <RightSide label="Cloud Run">
    <Weight value={0.3}>Full Control</Weight>
    <Weight value={0.9}>Easy Setup</Weight>
  </RightSide>
</TradeOffScale>
```

**3. "Common Mistake" Warnings**
```javascript
// Badges appearing on risky paths
<WarningBadge position={badPath}>
  ⚠️ Common mistake: Using VMs for stateless apps
  → Costs 10x more
</WarningBadge>
```

**4. Before/After Visualization**
```javascript
// Split screen during outcome phase
<SplitScreen>
  <Before>
    <Diagram>Manual scaling, downtime</Diagram>
    <Cost>$500/mo</Cost>
  </Before>
  <After>
    <Diagram>Auto-scaling, zero-downtime</Diagram>
    <Cost>$50/mo</Cost>
  </After>
</SplitScreen>
```

**Result:** Clear teaching, not just flowchart ✅

---

## 🎬 Animation Timeline (7 Phases, 20s)

### Phase Breakdown

| Time | Phase | Elements | Micro-Delights |
|------|-------|----------|----------------|
| 0-2s | Entrance | Particles, blob, title | Liquid blob, shimmer, sparkles on title |
| 2-4s | Root Question | Question node, context | Sparkle burst, glow pulse, breathe |
| 4-7s | Branch Viz | Decision zones, trade-offs | Glow zones, sparkle trails, draw-on paths |
| 7-12s | Traversal | Node reveals, path highlight | Sparkle per node, glow trail, pulse emphasis |
| 12-15s | Outcome | Badge, confetti, glow | Confetti burst, shimmer sweep, spring bounce |
| 15-18s | Context | Before/after, impact | Sparkles on metrics, visual charts |
| 18-20s | Exit | Settle, breathe | Gentle fade, particles settle |

**Total: 7 phases** (vs current 3) ✅

---

## 📋 Implementation Checklist

### Pre-Development
- [x] Analyze Hook1A patterns
- [x] Create detailed blueprint
- [ ] Review blueprint with user
- [ ] Get approval to proceed

### Development (Hook1A Quality)
- [ ] Set up 6 SVG ref layers (particles, glow, rough, sparkles, effects, content)
- [ ] Generate 5 particle systems (ambient, sparkles x3, confetti)
- [ ] Implement 18+ micro-delight animations
- [ ] Build proper collision detection (bounding boxes for ALL nodes)
- [ ] Create 7 animation phases with distinct beats
- [ ] Add pedagogical visualizations (context, trade-offs, warnings)
- [ ] Implement liquid blob background
- [ ] Add shimmer effects (outcome, context)
- [ ] Add glow effects (root, path, outcome)
- [ ] Implement SVG draw-on for branches
- [ ] Add breathing animations (root, outcome)
- [ ] Create impact visualizations (charts, before/after)

### Testing
- [ ] PowerPoint test: Cannot replicate? ✅
- [ ] Collision test: Zero overlaps at 5 different frame positions
- [ ] Line count: 650-750 lines? ✅
- [ ] Micro-delight count: 15+ implementations? ✅
- [ ] Animation phases: 7+ distinct beats? ✅
- [ ] Pedagogy test: Clear teaching, not just display? ✅

### Quality Gates (SURPASS Hook1A)
- [ ] **PowerPoint Test:** ❌ Cannot replicate the TEACHING experience
- [ ] **Pedagogical Depth:** ✅ User learns WHY, not just WHAT
- [ ] **Purposeful Enhancements:** ✅ 8-10 effects that support learning
- [ ] **Visual Teaching:** ✅ Cannot learn this from text alone
- [ ] **Hook1A Structure:** ✅ Matches depth, organization, quality
- [ ] **Animation Phases:** ✅ 7 distinct teaching phases
- [ ] **Line Count:** ✅ 650-750 lines (rich implementation)
- [ ] **Collision Detection:** ✅ All elements have bounding boxes
- [ ] **Zero Wobble:** ✅ roughness: 0, bowing: 0
- [ ] **Context Panels:** ✅ Stakes, definitions, use cases, pitfalls
- [ ] **Trade-Off Visualization:** ✅ Visual weights, comparisons
- [ ] **Impact Metrics:** ✅ Cost, time, complexity shown visually

---

## 🚀 Next Steps

1. ✅ **User Approval** on this blueprint
2. **Rebuild Compare3B** following this TEACHING-focused blueprint
3. **Test against quality checklist**
4. **Get user approval** on rebuilt template
5. **Apply same PHILOSOPHY** (not copy-paste) to Show5B and Build6A

---

## 📝 Critical Notes

**This blueprint is the CONTRACT for Compare3B quality**

**PHILOSOPHY (Not Checklist):**
- Learn from Hook1A's STRUCTURE, depth, organization
- SURPASS Hook1A by making this a teaching masterclass
- Purposeful enhancements (support learning, not decoration)
- Avoid content fatigue (don't copy effects blindly)
- Focus on pedagogical value above all else

**TEACHING TEMPLATE:**
- This is WHERE THE USER LEARNS
- Hook templates are basic (just a question)
- Compare/Show/Build templates are MEAT AND BONES
- Every element must serve learning

**Quality > Quantity:**
- 8-10 purposeful effects > 22 checklist items
- Rich context panels > sparkles everywhere
- Clear pedagogy > visual decoration

**Estimated Development Time:** 5-7 hours (rich teaching implementation)  
**Quality Target:** SURPASS Hook1A in teaching effectiveness