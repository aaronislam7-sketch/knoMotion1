# Template Archetypes Plan - Learning Content Pipeline
**Date:** November 7, 2025  
**Status:** 🎯 Ready for Implementation

---

## 🎯 Design Principles

### Core Rules
1. **One Concept Per Screen** - Never show multiple concepts simultaneously
2. **Mid-Scene Transitions** - Use transitions to separate ideas within a template
3. **Maximum Configurability** - Follow HOOK1A pattern for JSON-driven control
4. **No Collisions** - Use all screen real estate effectively
5. **Domain Agnostic** - Work for any subject matter
6. **Polished UX** - Smooth animations, clear hierarchy, intentional design

### Configuration North Star: HOOK1A
- Every visual element type-selectable (image, SVG, roughSVG, lottie, emoji)
- Every position controlled by token system + offsets
- Every color, font size, timing configurable
- Dynamic arrays for variable content (1-8 items)
- Style presets for quick domain switching

---

## 📚 Template Archetypes

### 1. **MATRIX COMPARISON** (Compare Intention)
**Template ID:** `Compare12MatrixGrid`  
**Version:** 6.0  

**Purpose:** Side-by-side comparison of 2-4 items across 2-4 dimensions

**Visual Pattern:**
- Grid layout (2x2, 2x3, 3x3, 2x4 configurable)
- Row headers (dimensions/criteria)
- Column headers (items being compared)
- Cell content: text, icons, checkmarks, ratings
- Highlight winner/best option

**One Concept Rule:**
- Screen 1: Show title + grid structure (empty)
- Transition: Mid-scene wipe
- Screen 2: Fill grid row-by-row or column-by-column
- Transition: Highlight phase
- Screen 3: Winner/conclusion reveal

**Configurability:**
- Grid dimensions (2-4 columns, 2-4 rows)
- Cell content type: text, emoji, checkmark, rating (1-5), image
- Fill animation: by-row, by-column, all-at-once, cascade
- Highlight style: border, glow, scale, color change
- Colors: bg, accent, grid lines, highlight, text
- Fonts: title, header, cell content

**Use Cases:**
- Product comparisons
- Pros/cons analysis
- Feature matrices
- Option evaluation
- Before/after metrics

---

### 2. **INTERACTIVE POLL/QUIZ** (Challenge Intention)
**Template ID:** `Challenge13PollQuiz`  
**Version:** 6.0

**Purpose:** Present question with 2-6 answer options, reveal correct answer

**Visual Pattern:**
- Large question at top
- Answer options in clean grid/list (2-6 options)
- Visual indicators for selection
- Correct answer reveal with explanation
- Progress indicator if part of series

**One Concept Rule:**
- Screen 1: Question only (clear, focused)
- Transition: Fade in options
- Screen 2: Options appear sequentially
- Transition: Pause for "think time"
- Screen 3: Correct answer highlights + explanation

**Configurability:**
- Question text (multiline support)
- Answer count (2-6)
- Answer layout: grid, vertical list, horizontal
- Answer content: text only, text + icon, text + image
- Reveal style: highlight correct, fade wrong, flip card
- Timer option (countdown for think time)
- Explanation text (optional)
- Colors: bg, question, options, correct, incorrect, explanation
- Fonts: question, options, explanation

**Use Cases:**
- Knowledge checks
- Opinion polls
- True/false questions
- Multiple choice
- Assessment quizzes

---

### 3. **SINGLE CONCEPT SPOTLIGHT** (Question + Reveal Intention)
**Template ID:** `Spotlight14SingleConcept`  
**Version:** 6.0

**Purpose:** Deep dive into ONE concept with maximum focus

**Visual Pattern:**
- Stage 1: Intriguing question/prompt
- Stage 2: Visual representation (large, centered)
- Stage 3: Core explanation (concise)
- Stage 4: Key takeaway/implication

**One Concept Rule:**
- This template IS the one-concept rule embodied
- Each stage = separate screen with transition
- No simultaneous competing information
- Clear visual hierarchy on each stage

**Configurability:**
- Stage count (2-4)
- Each stage: headline, body text, visual, position
- Transition style between stages: fade, slide, curtain, morph
- Visual type per stage: image, lottie, roughSVG, emoji, video
- Emphasis style: pulse, glow, scale, shake
- Background: solid, gradient, image with overlay
- Colors: bg, headline, body, accent
- Fonts: headline, body text
- Timing: stage duration, transition speed

**Use Cases:**
- Key definitions
- Important principles
- Critical concepts
- Breakthrough ideas
- "Aha" moments

---

### 4. **BUILDING BLOCKS SEQUENCE** (Guide + Breakdown Intention)
**Template ID:** `Guide14BuildingBlocks`  
**Version:** 6.0

**Purpose:** Show how components build into complete system

**Visual Pattern:**
- Start with foundation/base element
- Add blocks sequentially (2-6 blocks)
- Each block adds to the structure
- Final view shows complete system
- Labels and connectors show relationships

**One Concept Rule:**
- Screen 1: Show base/foundation only
- Transition: Next block slides in
- Screen 2: Base + Block 1 (explain connection)
- Transition: Next block slides in
- Screen 3: Base + Blocks 1-2 (explain addition)
- Continue pattern...
- Final: Complete structure with all labels

**Configurability:**
- Block count (2-8)
- Layout pattern: vertical stack, horizontal, pyramid, circle, tree
- Each block: label, description, visual/icon, color
- Connection style: arrows, lines, dotted, animated flow
- Build animation: slide, fade, pop, drop
- Completion effect: celebration, glow, final label
- Colors: base, blocks (individual), connections, labels
- Fonts: block labels, descriptions
- Timing: block interval, connection draw speed

**Use Cases:**
- Process flows
- System architecture
- Skill development paths
- Recipe steps
- Assembly instructions
- Concept layering

---

### 5. **ANALOGY BRIDGE** (Connect + Explain Intention)
**Template ID:** `Connect15AnalogyBridge`  
**Version:** 6.0

**Purpose:** Connect unfamiliar concept to familiar one through visual analogy

**Visual Pattern:**
- Left side: Familiar concept (with visual)
- Center: Bridge/connection (animated)
- Right side: New concept (with visual)
- Labels explain the mapping

**One Concept Rule:**
- Screen 1: Familiar concept only (establish baseline)
- Transition: Bridge starts to form
- Screen 2: Bridge connects (show relationship)
- Transition: New concept fades in
- Screen 3: Both concepts + complete bridge + mapping labels

**Configurability:**
- Left concept: text, visual, description
- Right concept: text, visual, description
- Bridge style: arrow, equals sign, morphing animation, path
- Mapping count: 1-4 specific connections
- Each mapping: label, arrow/line style
- Layout: horizontal, vertical, diagonal
- Animation: draw bridge, fade concepts, simultaneous
- Colors: left side, right side, bridge, mappings, labels
- Fonts: concept titles, descriptions, mapping labels
- Visuals: polymorphic hero for both concepts

**Use Cases:**
- Explain complex topics
- Teaching metaphors
- "It's like..." comparisons
- Abstract to concrete
- Technical to everyday

---

### 6. **TRANSFORMATION TIMELINE** (Reveal + Connect Intention)
**Template ID:** `Reveal16Timeline`  
**Version:** 6.0

**Purpose:** Show evolution/progression across time or stages

**Visual Pattern:**
- Horizontal or vertical timeline
- 3-6 key moments/stages
- Each point: date/label, event, visual
- Progress indicator
- Connections between points

**One Concept Rule:**
- Screen 1: Timeline axis only (empty)
- Transition: First point appears
- Screen 2: Point 1 with detail
- Transition: Line draws to next point
- Screen 3: Point 2 with detail
- Continue pattern...
- Final: Full timeline visible

**Configurability:**
- Point count (3-8)
- Timeline orientation: horizontal, vertical, curved
- Each point: date/label, title, description, visual
- Connection style: line, dotted, arrow, animated flow
- Point marker: circle, diamond, icon, image
- Emphasis: current point scales/glows
- Era markers: color zones, background overlays
- Colors: timeline, points, connections, text, eras
- Fonts: dates, titles, descriptions
- Timing: point interval, connection draw speed

**Use Cases:**
- Historical events
- Project milestones
- Product evolution
- Career progression
- Story arcs
- Scientific discovery timelines

---

### 7. **DUAL PERSPECTIVE SPLIT** (Compare + Question Intention)
**Template ID:** `Compare17DualView`  
**Version:** 6.0

**Purpose:** Show two viewpoints/approaches/outcomes side-by-side

**Visual Pattern:**
- Split screen (vertical or horizontal divide)
- Left: Perspective A (title, visual, key points)
- Right: Perspective B (title, visual, key points)
- Center line: optional labels/differences
- Optional: third screen for synthesis/conclusion

**One Concept Rule:**
- Screen 1: Show split structure + title
- Transition: Left side populates
- Screen 2: Perspective A content (isolated)
- Transition: Right side populates
- Screen 3: Perspective B content (isolated)
- Transition: Optional comparison highlights
- Screen 4: Synthesis/conclusion

**Configurability:**
- Split orientation: vertical (left/right), horizontal (top/bottom)
- Each side: title, points (1-4), visual, color theme
- Divider style: line, gradient, none, animated
- Content reveal: simultaneous, sequential, alternating
- Comparison markers: arrows between sides, highlight differences
- Synthesis screen: optional, conclusion text + visual
- Colors: bg, side A theme, side B theme, divider, text
- Fonts: titles, points, synthesis
- Visuals: polymorphic hero for each side

**Use Cases:**
- Debate topics
- Method A vs Method B
- Before/after
- Theory vs practice
- Multiple interpretations
- Competing solutions

---

### 8. **LAYERED REVEAL CASCADE** (Reveal + Breakdown Intention)
**Template ID:** `Reveal18LayeredCascade`  
**Version:** 6.0

**Purpose:** Peel back layers to reveal deeper levels of understanding

**Visual Pattern:**
- Start with surface level (simplified view)
- Each layer reveals more depth/detail
- 3-5 layers total
- Visual metaphor: onion, depth layers, zoom levels
- Each layer: headline + explanation + visual change

**One Concept Rule:**
- Screen 1: Surface layer only (simple)
- Transition: Peel/fade/wipe to next layer
- Screen 2: Layer 2 (more detail)
- Transition: Continue peeling
- Screen 3: Layer 3 (deeper insight)
- Continue...
- Final: Core insight revealed

**Configurability:**
- Layer count (3-5)
- Each layer: headline, explanation, visual, depth indicator
- Peel animation: fade, slide, curtain, zoom, actual peel
- Visual strategy: same image with overlays, different images, progressive detail
- Depth indicators: numbers, progress bar, visual metaphor
- Colors: surface (light) → deep (dark gradient), or custom per layer
- Fonts: layer headlines, explanations
- Timing: layer duration, transition speed

**Use Cases:**
- Complex topics
- Root cause analysis
- Depth of understanding
- Detail progression
- "Peeling the onion"
- Zoom into details

---

### 9. **RAPID FIRE FACTS** (Question + Challenge Intention)
**Template ID:** `Challenge19RapidFire`  
**Version:** 6.0

**Purpose:** Quick succession of facts/questions/concepts with high energy

**Visual Pattern:**
- Centered content area
- Each item: number/counter, fact/question, visual
- Fast transitions (0.5-2 seconds per item)
- Progress indicator
- 5-15 items total
- High-contrast, punchy design

**One Concept Rule:**
- Literally one fact per screen
- Rapid transitions between facts
- No overlap between items
- Clear, focused, memorable

**Configurability:**
- Item count (5-15)
- Each item: number, text, visual (optional), emphasis level
- Display duration per item (0.5-3 seconds)
- Transition style: slide, pop, fade, flip
- Counter/progress: numbers, progress bar, dots
- Emphasis: random item can be highlighted (longer duration)
- Energy level: calm, medium, high (affects animation speed)
- Colors: bg, text, accent, counter
- Fonts: number, fact text
- Visuals: optional emoji/icon per fact

**Use Cases:**
- Did you know facts
- Quick tips
- Rapid review
- Trivia
- Key statistics
- Myth busting

---

### 10. **CONCEPT WEB/MIND MAP** (Connect + Breakdown Intention)
**Template ID:** `Connect20ConceptWeb`  
**Version:** 6.0

**Purpose:** Show relationships between central concept and related ideas

**Visual Pattern:**
- Central concept (large, centered)
- 3-7 connected concepts (orbiting)
- Connecting lines/paths
- Labels on connections
- Optional: second-level connections

**One Concept Rule:**
- Screen 1: Central concept only
- Transition: First connection draws
- Screen 2: Central + Node 1 (explain relationship)
- Transition: Second connection draws
- Screen 3: Central + Nodes 1-2
- Continue...
- Final: Complete web visible

**Configurability:**
- Node count (3-8)
- Layout pattern: radial, organic, grid, hierarchical
- Central concept: text, visual, description
- Each node: text, visual, description, color
- Connection style: line, arrow, curved, dotted, thickness
- Connection labels: optional, text showing relationship
- Build animation: radial-out, clockwise, random, importance-based
- Second level: optional sub-nodes
- Colors: center, nodes (individual or themed), connections
- Fonts: center text, node text, connection labels
- Visual: polymorphic hero for center and nodes

**Use Cases:**
- Related concepts
- Brainstorming results
- System relationships
- Cause and effect
- Idea mapping
- Knowledge networks

---

## 🎨 Common Configuration Patterns

### Every Template Includes:
1. **Title/Headline** - Configurable text, position, font size
2. **Style Tokens**
   - Colors: bg, accent, accent2, ink (minimum)
   - Fonts: size_title, size_body (minimum)
3. **Beats/Timing**
   - entrance, titleEntry, [content-specific], exit
4. **Animation Config**
   - entrance style, transition easing
5. **Polymorphic Visuals**
   - type: image, roughSVG, lottie, emoji, custom
   - asset path or config
6. **Position System**
   - Token-based: top-center, center, bottom-left, etc.
   - Offset: { x, y } for fine-tuning

### Standard Animations:
- fadeUpIn, slideInLeft, slideInRight, popInSpring, pulseEmphasis
- curtainWipe, fadeTransition, slideTransition
- drawOn (for connections/lines)
- scaleEmphasis, glowEffect

### Standard Colors Presets:
- Education: warm earth tones
- Tech: cool blues/purples
- Business: neutral grays/blues
- Science: purple/teal
- Creative: vibrant multi-color

---

## 📊 Implementation Priority

### Phase 1: Core Archetypes (This Session)
1. ✅ Matrix Comparison
2. ✅ Interactive Poll/Quiz
3. ✅ Single Concept Spotlight
4. ✅ Building Blocks Sequence
5. ✅ Analogy Bridge

### Phase 2: Advanced Patterns
6. ⏳ Transformation Timeline
7. ⏳ Dual Perspective Split
8. ⏳ Layered Reveal Cascade

### Phase 3: Specialized Templates
9. ⏳ Rapid Fire Facts
10. ⏳ Concept Web/Mind Map

---

## ✅ Quality Checklist (Per Template)

Before considering a template complete:

1. **Polished Feel**
   - [ ] Smooth animations (no janky transitions)
   - [ ] Clear visual hierarchy
   - [ ] Intentional spacing
   - [ ] Professional appearance

2. **Configurability**
   - [ ] No hardcoded values in JSX
   - [ ] All config in JSON/defaults
   - [ ] Follows HOOK1A pattern
   - [ ] Dynamic arrays where appropriate

3. **Preview Ready**
   - [ ] Renders without errors
   - [ ] Example JSON works
   - [ ] Live preview functional
   - [ ] No console warnings

4. **Collision-Free**
   - [ ] No overlapping elements
   - [ ] Uses full screen real estate
   - [ ] Proper spacing enforced
   - [ ] Tested with collision detection

5. **Documentation**
   - [ ] Clear comments in JSX
   - [ ] Example JSON created
   - [ ] Config schema defined
   - [ ] Use cases documented

---

## 🚀 Success Metrics

A successful template:
- Works across 3+ different domains (verified)
- Has 0 hardcoded content
- Renders smoothly at 30fps
- Passes collision detection
- Has full Admin Config panel
- Includes 2+ example JSON scenes
- Follows all 6 Agnostic Principals

---

**Ready to build exceptional, versatile learning templates! 🎬**
