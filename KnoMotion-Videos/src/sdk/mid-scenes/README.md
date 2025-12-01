# Mid-Scenes Library

**Composed components that glue elements, animations, and effects together**

Mid-scenes are pre-built, JSON-configurable components designed for LLM JSON generation. They combine atomic elements, animations, effects, and layout logic into reusable patterns for video creation.

---

## 📚 Table of Contents

1. [What Are Mid-Scenes?](#what-are-mid-scenes)
2. [Current Mid-Scenes](#current-mid-scenes)
3. [Usage Guide](#usage-guide)
4. [Architecture & Best Practices](#architecture--best-practices)
5. [Common Issues & Solutions](#common-issues--solutions)
6. [Future Mid-Scene Ideas](#future-mid-scene-ideas)
7. [Contributing](#contributing)

---

## What Are Mid-Scenes?

### NOT Layouts
Mid-scenes are **NOT** layout systems. They are **composed components** that combine:
- ✅ Atomic elements (Text, Button, Badge, Icon, etc.)
- ✅ Composition elements (HeroWithText, CardWithIcon, etc.)
- ✅ Animations (entrance, exit, continuous)
- ✅ Effects (particles, glow, etc.)
- ✅ Layout positioning (via unified layout engine)

### Goal
Enable LLMs to generate complete video scenes by providing JSON configuration. No code needed—just configure timing, content, and visual properties.

### Example
```json
{
  "type": "TextRevealSequence",
  "config": {
    "lines": [
      { "text": "Welcome to Learning", "emphasis": "high" },
      { "text": "Let's explore together", "emphasis": "normal" }
    ],
    "revealType": "typewriter",
    "beats": { "start": 1.0 }
  }
}
```

---

## Current Mid-Scenes

### 1. HeroTextEntranceExit
**Purpose**: Combines hero visual (image/lottie) with text, entrance and exit animations.

**Use Cases**:
- Video intros with logo + tagline
- Section transitions
- Hero reveals

**Features**:
- Hero types: image, lottie, svg
- Entrance animations: fadeIn, slideIn, scaleIn, fadeSlide
- Exit animations: fadeOut, slideOut, scaleOut
- Beat-based timing

**JSON Example**:
```json
{
  "text": "Learn with KnoMotion",
  "heroType": "lottie",
  "heroRef": "/lotties/rocket.json",
  "animationEntrance": "fadeSlide",
  "animationExit": "fadeOut",
  "beats": {
    "entrance": 1.0,
    "exit": 5.0
  }
}
```

**Schema**: [`schemas/HeroTextEntranceExit.schema.json`](./schemas/HeroTextEntranceExit.schema.json)

---

### 2. CardSequence
**Purpose**: Renders multiple cards in sequence with stagger animations.

**Use Cases**:
- Feature lists
- Step-by-step guides
- Key takeaways
- Multi-part explanations

**Features**:
- Layout types: stacked (vertical) or grid
- Animations: fadeIn, slideIn, scaleIn, fadeSlide
- Customizable columns (grid mode)
- Stagger delay control
- Card variants: default, bordered, glass

**JSON Example**:
```json
{
  "cards": [
    {
      "title": "Step 1",
      "content": "First, understand the concept",
      "variant": "default"
    },
    {
      "title": "Step 2",
      "content": "Then, practice the skill",
      "variant": "bordered"
    }
  ],
  "layout": "stacked",
  "animation": "fadeSlide",
  "staggerDelay": 0.2,
  "beats": { "start": 1.0 }
}
```

**Schema**: [`schemas/CardSequence.schema.json`](./schemas/CardSequence.schema.json)

---

### 3. TextRevealSequence
**Purpose**: Renders multiple text lines with reveal animations and emphasis effects.

**Use Cases**:
- Main video messages
- Quote reveals
- Bullet points
- Narration text
- Key concepts

**Features**:
- Reveal types: typewriter, fade, slide, mask
- Direction support: up, down, left, right
- Emphasis levels: normal, high (bold + highlight), low (muted)
- Line spacing: tight, normal, relaxed, loose (from theme)
- Stagger timing

**JSON Example**:
```json
{
  "lines": [
    { "text": "Learning is a journey", "emphasis": "high" },
    { "text": "Every step matters", "emphasis": "normal" },
    { "text": "Stay curious", "emphasis": "low" }
  ],
  "revealType": "typewriter",
  "direction": "up",
  "staggerDelay": 0.3,
  "lineSpacing": "relaxed",
  "beats": { "start": 1.0 }
}
```

**Schema**: [`schemas/TextRevealSequence.schema.json`](./schemas/TextRevealSequence.schema.json)

---

### 4. IconGrid
**Purpose**: Renders grid of icons with entrance animations.

**Use Cases**:
- Feature highlights
- Tool lists
- Category displays
- Visual taxonomies
- Concept maps

**Features**:
- 5 animation types: fadeIn, slideIn, scaleIn, bounceIn, **cascade** (diagonal wave)
- Direction support for slideIn
- Icon sizes: sm, md, lg, xl
- Optional labels below icons
- Customizable columns and gap
- Per-icon color control

**JSON Example**:
```json
{
  "icons": [
    { "iconRef": "🎯", "label": "Focus", "color": "primary" },
    { "iconRef": "🚀", "label": "Launch", "color": "accentBlue" },
    { "iconRef": "💡", "label": "Ideas", "color": "doodle" }
  ],
  "columns": 3,
  "animation": "cascade",
  "iconSize": "lg",
  "showLabels": true,
  "beats": { "start": 1.0 }
}
```

**Schema**: [`schemas/IconGrid.schema.json`](./schemas/IconGrid.schema.json)

---

### 5. ChecklistReveal
**Purpose**: Renders checklist with bullet/tick items and staggered pop animations.

**Use Cases**:
- To-do lists
- Feature checklists
- Step completion tracking
- Requirements lists
- Progress indicators

**Features**:
- 6 animation types: pop, slide, fade, scale, spring, bounceIn
- **Static icon presets**: check, bullet, dot, arrow, star, diamond, plus, minus
- **Lottie icon presets**: lottieCheck, lottieTick, lottieSuccess, lottieStar
- Auto-fit text to available width
- Per-item checked/unchecked state
- Custom colors per item
- Layout-aware sizing

**JSON Example**:
```json
{
  "items": [
    { "text": "Complete the tutorial", "checked": true },
    { "text": "Practice with examples", "checked": true },
    { "text": "Build your first project", "checked": false }
  ],
  "revealType": "pop",
  "icon": "lottieTick",
  "iconColor": "accentGreen",
  "staggerDelay": 0.25,
  "beats": { "start": 1.0 }
}
```

**Schema**: [`schemas/ChecklistReveal.schema.json`](./schemas/ChecklistReveal.schema.json)

---

### 6. BubbleCalloutSequence
**Purpose**: Freeform floating callouts for annotations, thoughts, and tips.

**Use Cases**:
- Thought bubbles
- Tip/hint callouts
- Annotated explanations
- Scattered annotations

**Features**:
- 3 bubble shapes: speech (with tail), rounded, notebook (dashed Knode style)
- 3 freeform patterns: scattered (golden angle), zigzag, diagonal
- 5 animations: pop, float, slide, scale, fade
- Uses SDK **CalloutBubble** composition
- Per-callout icons and colors

**JSON Example**:
```json
{
  "callouts": [
    { "text": "Start with a clear goal", "icon": "🎯" },
    { "text": "Break into small steps", "icon": "📝" },
    { "text": "Celebrate progress!", "icon": "🎉" }
  ],
  "shape": "notebook",
  "pattern": "scattered",
  "animation": "float",
  "beats": { "start": 1.0 }
}
```

**Schema**: [`schemas/BubbleCalloutSequence.schema.json`](./schemas/BubbleCalloutSequence.schema.json)

---

### 7. TimelineStrip
**Purpose**: Horizontal timeline with staggered up/down cards for progression and milestones.

**Use Cases**:
- Historical timelines
- Process steps / learning paths
- Project milestones
- Learning journeys

**Features**:
- Staggered up/down card layout (alternating positions)
- Uses SDK **TimelineCard** composition for each node
- **Per-node beats support**: Each event can have its own timing
- 4 animations: slide, scale, bounce, fade
- Animated connecting line between cards
- Badges, icons, subtitles, and descriptions per card
- Card variants: default, bordered, glass

**JSON Example**:
```json
{
  "events": [
    { "title": "Start", "subtitle": "Day 1", "icon": "🚀", "badge": "Step 1" },
    { "title": "Learn", "subtitle": "Week 1", "icon": "📚", "badge": "Step 2" },
    { "title": "Practice", "subtitle": "Week 2", "icon": "💪", "badge": "Step 3" },
    { "title": "Master", "subtitle": "Month 1", "icon": "🏆", "badge": "Step 4" }
  ],
  "animation": "slide",
  "showConnectors": true,
  "beats": { "start": 1.0 }
}
```

**Per-node beats example**:
```json
{
  "events": [
    { "title": "Idea", "icon": "💡", "beats": { "start": 1.0 } },
    { "title": "Research", "icon": "🔍", "beats": { "start": 2.0 } },
    { "title": "Build", "icon": "🔧", "beats": { "start": 3.0 } },
    { "title": "Launch", "icon": "🚀", "beats": { "start": 4.5 } }
  ],
  "animation": "scale",
  "beats": { "start": 1.0 }
}
```

**Schema**: [`schemas/TimelineStrip.schema.json`](./schemas/TimelineStrip.schema.json)

---

### 8. SideBySideCompare
**Purpose**: Left vs right comparison blocks for before/after, pros/cons, or A vs B scenarios.

**Use Cases**:
- Before/after comparisons
- Pros and cons
- Option A vs Option B
- Concept contrasts

**Features**:
- Uses SDK **Card**, **Text**, **Icon**, **Badge** elements
- 5 animations: slide, fade, scale, bounce, reveal
- 4 divider styles: none, line, dashed, vs (with circular badge)
- Title, subtitle, icon, and item lists per side
- Custom colors per side
- Content alignment: center or inner (facing divider)

**JSON Example**:
```json
{
  "left": {
    "title": "Before",
    "icon": "😕",
    "items": ["Confusing syntax", "Hard to debug", "Slow"],
    "color": "secondary"
  },
  "right": {
    "title": "After",
    "icon": "🎉",
    "items": ["Clean code", "Easy debugging", "Fast"],
    "color": "accentGreen"
  },
  "animation": "slide",
  "dividerType": "vs",
  "beats": { "start": 1.0 }
}
```

**Schema**: [`schemas/SideBySideCompare.schema.json`](./schemas/SideBySideCompare.schema.json)

---

### 9. GridCardReveal
**Purpose**: Mini-cards in a grid with image/icon and label, mask or slide reveals.

**Use Cases**:
- Feature grids
- Team member displays
- Product showcases
- Category displays
- Icon galleries

**Features**:
- 7 animations: fade, slide, scale, bounce, flip, mask, cascade
- 5 card variants: default, bordered, glass, flat, elevated
- Auto-calculated grid columns
- Image support with rounded option
- Labels with positioning control
- Per-card customization

**JSON Example**:
```json
{
  "cards": [
    { "icon": "🎯", "label": "Focus" },
    { "icon": "📚", "label": "Learn" },
    { "icon": "💪", "label": "Practice" },
    { "icon": "🏆", "label": "Master" }
  ],
  "columns": 2,
  "animation": "cascade",
  "cardVariant": "default",
  "showLabels": true,
  "beats": { "start": 1.0 }
}
```

**Schema**: [`schemas/GridCardReveal.schema.json`](./schemas/GridCardReveal.schema.json)

---

## Usage Guide

### Basic Integration

```javascript
import { TextRevealSequence } from '../sdk/mid-scenes';

export const MyScene = () => {
  const config = {
    lines: [
      { text: "Hello World", emphasis: "high" }
    ],
    revealType: "fade",
    beats: { start: 1.0 }
  };
  
  return <TextRevealSequence config={config} />;
};
```

### With Scene JSON

```javascript
import { sceneData } from './scene.json';

export const MyScene = () => {
  return (
    <>
      {sceneData.midScenes.map((midScene, index) => {
        const Component = MID_SCENE_REGISTRY[midScene.type];
        return <Component key={index} config={midScene.config} />;
      })}
    </>
  );
};
```

### All Mid-Scenes Use Same API

All mid-scenes follow the same signature:
```javascript
<MidSceneComponent config={jsonConfig} />
```

No need for `frame` or `fps` props—mid-scenes handle this internally using Remotion hooks.

---

## Architecture & Best Practices

### Component Structure

All mid-scenes follow this pattern:

```javascript
export const MidSceneComponent = ({ config }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  
  // 1. Extract config
  const { items, animation, beats, position, style } = config;
  
  // 2. Calculate positions using layout engine
  const positions = calculateItemPositions(items, {
    arrangement: ARRANGEMENT_TYPES.STACKED_VERTICAL,
    viewport: { width, height },
    spacing: 80,
  });
  
  // 3. Render with wrapper pattern
  return (
    <AbsoluteFill>
      {positions.map((pos, index) => {
        const animStyle = getAnimationStyle(...);
        const itemPosition = positionToCSS(pos);
        
        return (
          <div style={itemPosition}>  {/* Outer: Position only */}
            <div style={animStyle}>    {/* Inner: Animation only */}
              <Content />
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
```

### Key Principles

1. **100% SDK Integration**: Use only SDK functions—never create custom animations or effects.

2. **Wrapper Pattern**: Always separate positioning and animation into two nested divs to prevent CSS conflicts.

3. **Theme Consistency**: Use `KNODE_THEME` tokens for colors, spacing, fonts.

4. **Layout Engine**: Use `calculateItemPositions()` for all positioning—never hardcode coordinates.

5. **JSON Configurable**: Everything must be configurable via JSON with sensible defaults.

6. **Schema Validation**: Every mid-scene has a corresponding JSON schema file.

---

## Common Issues & Solutions

### Issue: Text/Elements Rendering Off-Center (Too Far Right)

**Symptoms**: Content appears offset to the right, not centered as expected.

**Root Cause**: Using wrong `positionToCSS` function for layout type.

There are **two different** `positionToCSS` functions:

| Function | Location | Use When |
|----------|----------|----------|
| `positionToCSS` | `layout/positionSystem.js` | STACKED layouts (no width/height) |
| `positionToCSS` | `layout/layoutEngine.js` | GRID layouts (with width/height) |

**Problem**: STACKED layouts return `{x, y}` without width/height. Using layoutEngine's version:
```javascript
left = position.x - width / 2;
// If width is undefined: left = 960 - 0 = 960px
// CENTER coordinate (960) used as LEFT position → offset to right!
```

**Solution**: Use correct function based on layout type:

```javascript
// ✅ CORRECT: For STACKED layouts
import { positionToCSS } from '../layout/positionSystem';
const pos = positionToCSS({x: 960, y: 540}, 'center');
// Returns: { left: '960px', top: '540px', transform: 'translate(-50%, -50%)' }

// ✅ CORRECT: For GRID layouts
import { positionToCSS } from '../layout/layoutEngine';
const pos = positionToCSS({x: 960, y: 540, width: 400, height: 200});
// Returns: { left: '760px', top: '440px', width: '400px', height: '400px' }
```

**Best Practice**: Check what positions return:
```javascript
const positions = calculateItemPositions(items, config);
const hasWidthHeight = 'width' in positions[0] && 'height' in positions[0];

// If true → use layoutEngine.positionToCSS
// If false → use positionSystem.positionToCSS
```

### Issue: Animations Not Applying Correctly

**Symptoms**: Elements don't animate, or animations conflict with positioning.

**Root Cause**: Applying both position and animation transforms to same div.

**Solution**: Use wrapper pattern—separate positioning and animation:

```javascript
// ❌ WRONG: Position and animation on same div
<div style={{
  left: '100px',
  transform: 'translateY(20px)'  // Conflicts!
}}>

// ✅ CORRECT: Separate layers
<div style={{ left: '100px' }}>  {/* Position only */}
  <div style={{ transform: 'translateY(20px)' }}>  {/* Animation only */}
    <Content />
  </div>
</div>
```

### Issue: Layout Engine Not Centering Items

**Symptoms**: Items not centered in viewport despite `basePosition: 'center'`.

**Solution**: Use `centerStack: true` or provide proper `area`:

```javascript
const positions = calculateItemPositions(items, {
  arrangement: ARRANGEMENT_TYPES.STACKED_VERTICAL,
  basePosition: 'center',
  centerStack: true,  // ← Add this!
  spacing: 80,
  viewport
});
```

---

## Future Mid-Scene Ideas

### Learning Video Context
These mid-scenes are designed specifically for educational content, making complex concepts accessible and engaging for learners.

### Recommended Mid-Scenes (Priority Order)

#### 1. **ProgressPath**
**What**: Animated progress path showing learning journey with checkpoints.  
**Why**: Visualizes student progress, shows learning milestones, builds motivation by making abstract progress concrete. Perfect for course overviews and progress updates.

#### 2. **ComparisonSlide**
**What**: Side-by-side comparison with before/after or concept A vs concept B.  
**Why**: Critical for learning—helps students understand differences, contrast approaches, see transformations. Essential for "compare and contrast" pedagogical moments.

#### 3. **TimelineSequence**
**What**: Horizontal or vertical timeline with events/steps.  
**Why**: Teaches chronology, process understanding, historical context. Great for showing "how we got here" or multi-step processes.

#### 4. **ConceptMap**
**What**: Central concept with connected related ideas (hub-and-spoke with labels).  
**Why**: Builds schema, shows relationships between ideas, helps students see the "big picture." Essential for conceptual learning.

#### 5. **QuizQuestion**
**What**: Question with multiple choice options that reveal answers.  
**Why**: Active learning—engages students, tests understanding, provides immediate feedback. Increases retention through retrieval practice.

#### 6. **StatCounter**
**What**: Animated number counter with label and context.  
**Why**: Makes data memorable through movement, emphasizes important metrics, creates "wow" moments that stick in memory.

#### 7. **HighlightBox**
**What**: Animated box/circle that highlights specific content or area.  
**Why**: Directs attention, reduces cognitive load by showing "look here," perfect for complex diagrams or dense information.

#### 8. **DefinitionCard**
**What**: Term on one side, definition reveals on flip or fade.  
**Why**: Core learning pattern—builds vocabulary, reinforces terminology, supports spaced repetition. Every educational video needs this.

#### 9. **ProcessFlow**
**What**: Input → steps → output flow diagram with animations.  
**Why**: Teaches procedural knowledge, shows cause-effect, demystifies complex processes. Essential for "how things work" explanations.

#### 10. **KeyTakeaway**
**What**: Large emphasized text with icon, entrance/exit animations.  
**Why**: Reinforces main point, aids recall, creates memorable moments. Every lesson needs clear takeaways.

#### 11. **ScenarioCard**
**What**: Situational description with branching options or outcomes.  
**Why**: Contextualizes learning, shows real-world application, builds decision-making skills. Moves from theory to practice.

#### 12. **AnnotatedDiagram**
**What**: Image/diagram with animated callouts and labels appearing in sequence.  
**Why**: Breaks down complexity, guides visual analysis, supports visual learners. Critical for STEM education.

#### 13. **VersusComparison**
**What**: Two options with pros/cons that reveal in sequence.  
**Why**: Develops critical thinking, helps students evaluate options, teaches decision-making frameworks.

#### 14. **StepByStepGuide**
**What**: Numbered steps with icons, appearing sequentially with emphasis.  
**Why**: Procedural learning—reduces overwhelm by chunking, builds confidence through clear structure. Perfect for tutorials.

#### 15. **SummaryRecap**
**What**: Condensed list of main points with icons and stagger animations.  
**Why**: Reinforces learning, aids memory consolidation, provides review opportunities. Critical for retention at video end.

---

## Contributing

### Creating New Mid-Scenes

1. **Identify Pattern**: Look for repeated component + animation + layout combinations
2. **Create Component**: Follow existing mid-scene structure
3. **Create Schema**: Add JSON schema in `schemas/` directory
4. **Export**: Add to `index.js`
5. **Example JSON**: Create example in `/scenes/examples/`
6. **Test**: Create showcase scene for validation
7. **Document**: Add to this README

### Component Checklist

- [ ] Uses SDK elements/animations only
- [ ] 100% JSON configurable
- [ ] Has JSON schema file
- [ ] Uses wrapper pattern for positioning/animation
- [ ] Uses theme tokens (KNODE_THEME)
- [ ] Uses layout engine for positioning
- [ ] Has example JSON file
- [ ] Has showcase test scene
- [ ] Documented in README
- [ ] Follows `{ config }` API signature

### Testing

All mid-scenes should be testable in showcase mode:
```bash
npm run dev
# Open http://localhost:5173
# Select appropriate "Scene X: Mid-Scene [Name]"
```

---

## Technical Details

### File Structure
```
mid-scenes/
├── README.md                          # This file
├── index.js                           # Exports all mid-scenes
├── HeroTextEntranceExit.jsx          # Hero + text with entrance/exit
├── CardSequence.jsx                   # Cards in sequence/grid
├── TextRevealSequence.jsx            # Text lines with reveals
├── IconGrid.jsx                       # Icon grid with animations
├── ChecklistReveal.jsx               # Checklist with pop animations
├── BubbleCalloutSequence.jsx         # Speech bubble callouts
├── TimelineStrip.jsx                 # Horizontal/vertical timeline
├── SideBySideCompare.jsx             # Left vs right comparison
├── GridCardReveal.jsx                # Mini-cards in grid layout
└── schemas/
    ├── HeroTextEntranceExit.schema.json
    ├── CardSequence.schema.json
    ├── TextRevealSequence.schema.json
    ├── IconGrid.schema.json
    ├── ChecklistReveal.schema.json
    ├── BubbleCalloutSequence.schema.json
    ├── TimelineStrip.schema.json
    ├── SideBySideCompare.schema.json
    └── GridCardReveal.schema.json
```

### Dependencies
- Remotion (useCurrentFrame, useVideoConfig, AbsoluteFill)
- SDK elements (from `../elements`)
- SDK animations (from `../animations`)
- SDK layout engine (from `../layout/layoutEngine`)
- SDK theme (from `../theme/knodeTheme`)

### Performance
- Use `useMemo` for expensive layout calculations
- Generate particles/static content once outside render loop
- Avoid complex filters on large elements
- Keep frame-based animations pure (no side effects)

---

## Related Documentation

- **[SDK.md](../sdk.md)** - Complete SDK reference
- **[Elements](../elements/README.md)** - Atomic elements library
- **[Layout Engine](../layout/layoutEngine.js)** - Layout system documentation
- **[Theme](../theme/knodeTheme.ts)** - Theme tokens

---

**Last Updated**: December 1, 2025  
**Status**: 9 mid-scenes complete (4 original + 5 new)  
**SDK Elements Created**: CalloutBubble, TimelineCard

### Recent Refactoring (v2.2)

Based on feedback, the following simplifications and SDK improvements were made:

**Design Principles Applied:**
- **Use SDK elements** - No inline code; all styling via compositions
- **Simplify variations** - Fewer options = easier for LLMs to configure
- **Focused use-cases** - Each mid-scene has a clear, specific purpose

1. **BubbleCalloutSequence** (Simplified)
   - Reduced to 3 patterns: scattered, zigzag, diagonal (freeform only)
   - Reduced to 3 shapes: speech, rounded, notebook
   - **NEW**: Uses SDK `CalloutBubble` composition
   - Removed structured layouts (use other mid-scenes for structured content)

2. **TimelineStrip** (Major Rewrite)
   - **NEW**: Uses SDK `TimelineCard` composition
   - Staggered up/down card layout (visual improvement over circles)
   - **Per-node beats support**: Each event can have independent timing
   - Simplified to 4 animations: slide, scale, bounce, fade
   - Cards use SDK Card variants: default, bordered, glass

3. **SideBySideCompare** (Simplified)
   - Removed custom hand-drawn dividers (too inline)
   - Simplified to 4 divider types: none, line, dashed, vs
   - Uses SDK Card, Text, Icon, Badge elements
   - Made VS badge larger and more prominent

4. **ChecklistReveal** (Lottie Support)
   - Added Lottie icon presets: lottieCheck, lottieTick, lottieSuccess, lottieStar
   - Uses SDK RemotionLottie for animated icons
