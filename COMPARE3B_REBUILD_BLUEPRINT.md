# Compare3B: Decision Tree - REBUILD BLUEPRINT
## Hook1A Quality Standard

**Created:** 2025-10-30  
**Status:** Pre-Development Blueprint  
**Target Quality:** Hook1A (665 lines, 18+ micro-delights)

---

## 🔴 Current Problems (User Feedback)

1. **Collision Issues:** "So much overlap, so many collisions"
   - Tree layout algorithm not accounting for node sizes properly
   - No proper bounding boxes for dynamic tree structure

2. **Poor Visual Quality:** "Falls very short of 'if it can be done in PPT it's not good enough'"
   - Only 8 particles (vs Hook1A's 20)
   - NO sparkles (Hook1A has 3 sets)
   - NO shimmer effects
   - NO glow effects
   - Just a basic flowchart with animated paths

3. **Lack of Micro-Delights:** "Little in terms of microdelights, mid scene transitions"
   - Only 3 animation phases (title, traverse, outcome)
   - Hook1A has 9 distinct phases
   - No sparkles on node reveals
   - No shimmer on decision highlights
   - No particle bursts on outcomes

---

## 🎯 Rebuild Goals

### Primary Goal
**Transform Compare3B from a "PowerPoint-level flowchart" into a rich, engaging, impossible-to-replicate-in-PPT experience.**

### Success Criteria
- ✅ 15+ micro-delight implementations (Hook1A has 18)
- ✅ 650-750 lines of code (Hook1A is 665)
- ✅ Zero collision issues (proper bounding boxes)
- ✅ 7+ animation phases (Hook1A has 9)
- ✅ Passes "PowerPoint test" - cannot be replicated
- ✅ Clear pedagogy: "Why this decision matters" visually shown

---

## 📐 Visual Concept (The Experience)

### Phase 1: Entrance (0-2s)
**Hook1A Pattern:** Ambient particles fade in, background gradients establish mood

**Compare3B Will Have:**
- ✨ **20 ambient particles** (not 8) - slow float, 3 colors
- ✨ **Liquid blob background** - organic shape behind decision zone
- ✨ **Shimmer gradient** - sweeps across background
- 🎬 Title fadeUp with **sparkle burst** (12 sparkles)
- 🎬 Subtitle "Why this matters" context

### Phase 2: Root Question Reveal (2-4s)
**Hook1A Pattern:** Question lines appear with sparkles, pulse emphasis

**Compare3B Will Have:**
- ✨ **Sparkle burst** around root question node (15 sparkles)
- ✨ **Glow effect** pulsing around question box
- ✨ **Breathing animation** on root node (subtle scale)
- 🎬 Question text **draws on** character-by-character
- 🎬 "This decision impacts..." context box with **shimmer**

### Phase 3: Branch Visualization (4-7s)
**Hook1A Pattern:** Map draws on with path animation, details reveal progressively

**Compare3B Will Have:**
- ✨ **Decision zones visualized** - "Yes path" (green glow zone) and "No path" (red glow zone)
- ✨ **Trade-off indicators** - visual weights showing pros/cons
- ✨ **Sparkle trails** following branches as they extend
- 🎬 Branches **draw on** with SVG path animation (like Hook1A map)
- 🎬 "Common mistake" warning badges appear with **pulse**

### Phase 4: Tree Traversal (7-12s)
**Current Problem:** Just nodes appearing linearly - boring!

**Hook1A Pattern:** Multiple elements animate with stagger, emphasis changes

**Compare3B Will Have:**
- ✨ **Sparkle burst** on EACH node reveal (8-10 sparkles per node)
- ✨ **Glow trail** following the decision path
- ✨ **Pulse emphasis** on "current" decision point
- ✨ **Impact indicators** - small charts showing consequences
- 🎬 **Mid-scene transition:** Camera drift toward chosen path
- 🎬 Rejected paths **fade with particle dissipation**
- 🎬 Chosen path **glows and thickens**

### Phase 5: Outcome Highlight (12-15s)
**Current Problem:** Outcome just appears - no impact!

**Hook1A Pattern:** Welcome text with shimmer, hero breathes, visual celebration

**Compare3B Will Have:**
- ✨ **Confetti burst** around outcome (20 particles)
- ✨ **Shimmer sweep** across outcome badge
- ✨ **Glow pulse** expanding from outcome
- ✨ **Outcome icon** animates with **spring bounce**
- 🎬 **"Why it matters" panel** slides in from side
- 🎬 **Cost/performance comparison** visualized (not just text)
- 🎬 **Breathing animation** on final outcome

### Phase 6: Context & Impact (15-18s)
**NEW PHASE** (current version rushes to end)

**Hook1A Pattern:** Subtitle, breathe, settle

**Compare3B Will Have:**
- ✨ **Before/After visualization** - split screen showing impact
- ✨ **Sparkles** on key metrics
- 🎬 **"What breaks without this"** warning (if wrong choice)
- 🎬 **Visual summary** - decision path recap with highlights
- 🎬 Context text with **shimmer effect**

### Phase 7: Exit & Settle (18-20s)
**Hook1A Pattern:** Gentle fade, settle overlay

**Compare3B Will Have:**
- 🎬 All elements gently breathe together
- 🎬 Particles slow and settle
- 🎬 Fade to background color (15% opacity overlay)

---

## 🎨 Micro-Delights Inventory (18+ Required)

### Current (6 implementations) ❌
1. 8 ambient particles
2. Gradient background
3. PopIn spring on nodes
4. FadeUp on title
5. Animated paths
6. Basic glow on outcomes

### Hook1A Standard (18+ implementations) ✅

**Particle Systems (3 types):**
1. ✅ 20 ambient particles (slow float, 3 colors)
2. ✅ Sparkle burst on root question (15 sparkles)
3. ✅ Sparkle burst per node reveal (8-10 each, ~40 total)
4. ✅ Sparkle burst on outcome (20 sparkles)
5. ✅ Confetti burst on final outcome (20 particles)
6. ✅ Sparkle trails on branches (continuous)

**Glow & Shimmer (4 types):**
7. ✅ Glow pulse on root question
8. ✅ Glow trail on decision path
9. ✅ Glow expansion on outcome
10. ✅ Shimmer sweep on outcome badge
11. ✅ Shimmer on context text
12. ✅ Liquid blob background (organic animated shape)

**Animation Enhancements (6 types):**
13. ✅ Breathe animation on root node
14. ✅ Breathe on final outcome
15. ✅ Pulse emphasis on current decision
16. ✅ Spring bounce on outcome icon
17. ✅ SVG draw-on for branches (path reveal)
18. ✅ Camera drift during traversal

**Pedagogical Visuals (bonus):**
19. ✅ Trade-off indicators (visual weights)
20. ✅ Impact charts (small visualizations)
21. ✅ Before/After split screen
22. ✅ "Common mistake" warning badges

**Total: 22 micro-delight implementations** ✅

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

### Quality Gates (TEMPLATE_QUALITY_STANDARD.md)
- [ ] **PowerPoint Test:** ❌ Cannot replicate
- [ ] **Micro-Delights:** ✅ 18+ implementations
- [ ] **Particle Count:** ✅ 20 ambient particles
- [ ] **Sparkles:** ✅ 3+ sets
- [ ] **Shimmer/Glow:** ✅ 2+ implementations
- [ ] **Animation Phases:** ✅ 7 distinct beats
- [ ] **Line Count:** ✅ 650-750 lines
- [ ] **Collision Detection:** ✅ All elements have bounding boxes
- [ ] **Zero Wobble:** ✅ roughness: 0, bowing: 0
- [ ] **useMemo:** ✅ 5+ optimizations
- [ ] **useEffect:** ✅ 4+ rendering blocks
- [ ] **Pedagogical Quality:** ✅ Visual teaching, not just display

---

## 🚀 Next Steps

1. **Get User Approval** on this blueprint
2. **Rebuild Compare3B** following this blueprint exactly
3. **Test against quality checklist**
4. **Get user approval** on rebuilt template
5. **Apply same approach** to Show5B and Build6A

---

## 📝 Notes

- This blueprint is the CONTRACT for Compare3B quality
- Every checkbox must be ✅ before considering it "done"
- If any quality gate fails, STOP and fix before proceeding
- This blueprint will be the TEMPLATE for all future template rebuilds

**Estimated Development Time:** 4-6 hours  
**Quality Target:** Match or exceed Hook1A (665 lines, 18+ micro-delights)