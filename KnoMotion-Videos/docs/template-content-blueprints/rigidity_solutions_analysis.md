# Template Rigidity Solutions Analysis
**Date:** 2025-10-30  
**Status:** Draft  
**Purpose:** Analyze top 3 rigidity concerns from Hook1A template and develop template-agnostic solutions

---

## Context

The Hook1A template was designed for a specific use case (Knodovia geography question reveal). When attempting to apply it to a different domain (football), several areas of rigidity became apparent. This document analyzes the top 3 critical issues and proposes solutions that can be applied across all templates.

---

## Concern #1: Hardcoded Map SVG (CRITICAL)

### Current State Analysis

**Location in Code:** Lines 422-525 in `Hook1AQuestionBurst_V5.jsx`

**The Problem:**
- The map SVG is hardcoded with specific path coordinates for a stylized landmass
- The drawing logic is embedded directly in the useEffect
- All visual details (islands, markers, shapes) are fixed
- Changing to a football field, stadium diagram, or any other visual requires code modification

**Code Example:**
```javascript
const islandPath = `
  M 200 180 
  Q 180 120 220 100
  ... // Fixed coordinates for Knodovia map
`;
```

**Domain Transfer Test (Football):**
When trying to use this template for football content:
- ❌ Can't show a football field diagram
- ❌ Can't display team formations
- ❌ Can't show stadium layouts
- ❌ Must rewrite entire SVG generation logic

### Proposed Solution: Hero Element Registry Pattern

**Concept:** Abstract the "hero visual" into a type-based system configurable via JSON.

**Architecture:**

```javascript
// JSON Configuration
{
  "hero": {
    "type": "roughSVG",  // or "image", "svg", "lottie", "custom"
    "asset": "/assets/football-field.svg",
    "style": {
      "stroke": "accent",
      "fill": "accent2",
      "strokeWidth": 6
    },
    "animation": {
      "entrance": "drawOn",
      "exit": "shrinkToCorner"
    }
  }
}
```

**Type Registry:**

```javascript
// src/sdk/heroRegistry.js

export const HERO_TYPES = {
  'image': {
    render: (config, frame, beats, colors) => {
      return <img src={config.asset} style={...} />;
    },
    animate: (frame, config, beats, easingMap) => {
      // Generic image animation
    }
  },
  
  'svg': {
    render: (config, frame, beats, colors) => {
      // Load and render SVG from file
      return <SVGAsset src={config.asset} colors={colors} />;
    },
    animate: (frame, config, beats, easingMap) => {
      // SVG-specific animations (optional path drawing)
    }
  },
  
  'roughSVG': {
    render: (config, frame, beats, colors) => {
      // Use rough.js to render SVG with sketch effect
      return <RoughSVGRenderer config={config} colors={colors} />;
    },
    animate: (frame, config, beats, easingMap) => {
      // Draw-on animation with strokeDashoffset
    }
  },
  
  'lottie': {
    render: (config, frame, beats, colors) => {
      return <LottieAnimation src={config.asset} colorize={colors.accent} />;
    },
    animate: (frame, config, beats, easingMap) => {
      // Lottie playback control
    }
  },
  
  'custom': {
    render: (config, frame, beats, colors) => {
      // Allow custom component reference
      const Component = CUSTOM_HERO_COMPONENTS[config.componentId];
      return <Component {...config.props} />;
    },
    animate: (frame, config, beats, easingMap) => {
      // Component-specific animation
    }
  }
};
```

**Implementation in Template:**

```javascript
// Hook1AQuestionBurst_V5.jsx (refactored)

const Hook1AQuestionBurst = ({ scene, styles, presets, easingMap }) => {
  const heroConfig = scene.hero || { type: 'roughSVG', asset: 'knodovia-map' };
  const heroType = HERO_TYPES[heroConfig.type];
  
  // Get hero visual
  const heroVisual = heroType.render(heroConfig, frame, beats, colors);
  
  // Get hero animations
  const heroAnim = heroType.animate(frame, heroConfig, beats, easingMap);
  
  return (
    <AbsoluteFill>
      {/* Hero element with generic transform */}
      <div style={{
        transform: `translate(${heroAnim.x}px, ${heroAnim.y}px) scale(${heroAnim.scale})`,
        opacity: heroAnim.opacity
      }}>
        {heroVisual}
      </div>
    </AbsoluteFill>
  );
};
```

**Football Example:**

```json
{
  "hero": {
    "type": "svg",
    "asset": "/assets/football-field.svg",
    "style": {
      "stroke": "#00FF00",
      "fill": "#006400"
    },
    "animation": {
      "entrance": "drawOn",
      "transform": {
        "targetScale": 0.4,
        "targetPos": { "x": 600, "y": -300 }
      }
    }
  }
}
```

### Benefits
✅ No code changes needed for different visual types  
✅ Supports images, SVGs, Lottie, custom components  
✅ Animation logic abstracted  
✅ Easy to add new hero types  

---

## Concern #2: Two-line Question Format (HIGH)

### Current State Analysis

**Location in Code:** Lines 313-356 in `Hook1AQuestionBurst_V5.jsx`

**The Problem:**
- Questions are hardcoded as exactly 2 parts (questionPart1, questionPart2)
- Each part has its own beat, animation, and positioning
- The template assumes a specific visual hierarchy (part 1 moves up, part 2 stays)
- Different content structures (1 line, 3 lines, 4 lines) require code changes

**Code Example:**
```javascript
// Hardcoded structure
const text1 = texts.questionPart1 || 'What if geography';
const text2 = texts.questionPart2 || 'was measured in mindsets?';

// Hardcoded positioning
textElement.setAttribute('y', '480');  // Part 1
textElement.setAttribute('y', '600');  // Part 2
```

**Domain Transfer Test (Football):**
Football scenarios might need:
- ❌ 1 line: "Who was the greatest?"
- ❌ 3 lines: "If you could build / a perfect team / who would you choose?"
- ❌ 4 lines: Complex multi-part questions

### Proposed Solution: Dynamic Line Rendering System

**Concept:** Replace fixed questionPart1/questionPart2 with a flexible `lines` array that supports 1-4 lines with dynamic positioning, staggered animation, and automatic sizing.

**JSON Configuration:**

```javascript
{
  "question": {
    "lines": [
      { "text": "What if geography", "emphasis": "normal" },
      { "text": "was measured in mindsets?", "emphasis": "high" }
    ],
    "layout": {
      "arrangement": "stacked",  // or "centered", "cascade"
      "stagger": 0.3,  // seconds between line reveals
      "verticalSpacing": 80,  // px between lines
      "baseY": 480  // starting Y position
    },
    "animation": {
      "entrance": "fadeUp",
      "movePattern": "firstMoves",  // or "allMove", "none"
      "emphasis": "pulse"
    }
  }
}
```

**Implementation:**

```javascript
// src/sdk/questionRenderer.js

export const renderQuestionLines = (
  lines,
  layout,
  animation,
  frame,
  beats,
  colors,
  fonts,
  easingMap,
  fps
) => {
  const lineElements = [];
  
  lines.forEach((line, index) => {
    // Calculate dynamic positioning
    const yPos = layout.baseY + (index * layout.verticalSpacing);
    
    // Calculate staggered timing
    const lineStartBeat = beats.questionStart + (index * layout.stagger);
    const lineStartFrame = toFrames(lineStartBeat, fps);
    
    // Dynamic entrance animation
    const lineAnim = fadeUpIn(frame, {
      start: lineStartBeat,
      dur: 0.9,
      dist: 50,
      ease: 'power3InOut'
    }, easingMap, fps);
    
    // Apply emphasis scaling based on line config
    const emphasisScale = line.emphasis === 'high' ? 1.15 : 1.0;
    const fontSize = fonts.size_question * emphasisScale;
    
    // Apply movement pattern
    let translateY = lineAnim.translateY || 0;
    if (animation.movePattern === 'firstMoves' && index === 0) {
      translateY += calculateMoveUp(frame, beats, fps);
    }
    
    // Create SVG element
    const textElement = createSVGText({
      text: line.text,
      x: 960,
      y: yPos,
      fontSize,
      color: line.emphasis === 'high' ? colors.accent : colors.ink,
      opacity: lineAnim.opacity,
      transform: `translateY(${translateY}px)`
    });
    
    lineElements.push(textElement);
  });
  
  return lineElements;
};
```

**Template Integration:**

```javascript
// Hook1AQuestionBurst_V5.jsx (refactored)

const Hook1AQuestionBurst = ({ scene, styles, presets, easingMap }) => {
  const questionConfig = scene.question;
  
  useEffect(() => {
    if (!roughTextSvgRef.current) return;
    
    const svg = roughTextSvgRef.current;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    
    // Render dynamic lines
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
    
  }, [frame, questionConfig, beats, colors, fonts]);
  
  return (
    <AbsoluteFill>
      <svg ref={roughTextSvgRef} ... />
    </AbsoluteFill>
  );
};
```

**Football Example (1 line):**

```json
{
  "question": {
    "lines": [
      { "text": "Who was the greatest?", "emphasis": "high" }
    ],
    "layout": {
      "arrangement": "centered",
      "baseY": 540
    }
  }
}
```

**Football Example (3 lines):**

```json
{
  "question": {
    "lines": [
      { "text": "If you could build", "emphasis": "normal" },
      { "text": "a perfect team", "emphasis": "normal" },
      { "text": "who would you choose?", "emphasis": "high" }
    ],
    "layout": {
      "arrangement": "stacked",
      "stagger": 0.4,
      "verticalSpacing": 70,
      "baseY": 400
    }
  }
}
```

### Benefits
✅ Supports 1-4 lines without code changes  
✅ Dynamic positioning with automatic spacing  
✅ Staggered animations calculated based on line count  
✅ Per-line emphasis control  
✅ Flexible layout arrangements  

---

## Concern #3: All Component Positions Fixed (HIGH)

### Current State Analysis

**Location in Code:** Throughout template (lines 322, 344, 406, 682, etc.)

**The Problem:**
- All positions are hardcoded in pixels (x: 960, y: 480, etc.)
- Layout adjustments require code changes
- Different content lengths don't adapt
- No responsive positioning system

**Code Examples:**
```javascript
textElement.setAttribute('x', '960');  // Center hardcoded
textElement.setAttribute('y', '480');  // Y position hardcoded

// Map position
top: '50%',
left: '50%',

// Subtitle position
bottom: '30%',
left: '50%',
```

**Domain Transfer Test (Football):**
- ❌ Can't adjust layout for longer/shorter content
- ❌ Can't reposition elements for different emphasis
- ❌ Can't create different visual hierarchies

### Proposed Solution: Position Token System with 9-Point Grid

**Concept:** Create a position token system based on a 9-point grid (top-left, top-center, top-right, center-left, center, center-right, bottom-left, bottom-center, bottom-right) with offset support.

**Architecture:**

```javascript
// src/sdk/positionSystem.js

// 9-point grid reference system (16:9 aspect ratio, 1920x1080)
export const POSITION_GRID = {
  'top-left': { x: 320, y: 180 },
  'top-center': { x: 960, y: 180 },
  'top-right': { x: 1600, y: 180 },
  'center-left': { x: 320, y: 540 },
  'center': { x: 960, y: 540 },
  'center-right': { x: 1600, y: 540 },
  'bottom-left': { x: 320, y: 900 },
  'bottom-center': { x: 960, y: 900 },
  'bottom-right': { x: 1600, y: 900 },
};

// Position token resolver
export const resolvePosition = (token, offset = { x: 0, y: 0 }, viewport = { width: 1920, height: 1080 }) => {
  // Support multiple formats:
  // 1. Grid token: "center"
  // 2. Grid + offset: { grid: "center", offset: { x: 100, y: -50 } }
  // 3. Percentage: { x: "50%", y: "30%" }
  // 4. Absolute: { x: 960, y: 540 }
  
  if (typeof token === 'string') {
    // Grid token
    const gridPos = POSITION_GRID[token];
    if (!gridPos) {
      console.warn(`Unknown position token: ${token}`);
      return POSITION_GRID['center'];
    }
    return {
      x: gridPos.x + offset.x,
      y: gridPos.y + offset.y
    };
  }
  
  if (token.grid) {
    // Grid + offset format
    const gridPos = POSITION_GRID[token.grid];
    return {
      x: gridPos.x + (token.offset?.x || 0),
      y: gridPos.y + (token.offset?.y || 0)
    };
  }
  
  if (typeof token.x === 'string' && token.x.includes('%')) {
    // Percentage format
    return {
      x: (parseFloat(token.x) / 100) * viewport.width,
      y: (parseFloat(token.y) / 100) * viewport.height
    };
  }
  
  // Absolute format
  return {
    x: token.x || POSITION_GRID['center'].x,
    y: token.y || POSITION_GRID['center'].y
  };
};
```

**JSON Configuration:**

```javascript
{
  "layers": [
    {
      "id": "questionLine1",
      "type": "text",
      "text": "What if geography",
      "position": "center",  // Simple grid token
      "style": { ... }
    },
    {
      "id": "questionLine2",
      "type": "text",
      "text": "was measured in mindsets?",
      "position": {
        "grid": "center",
        "offset": { "x": 0, "y": 120 }  // 120px below center
      },
      "style": { ... }
    },
    {
      "id": "hero",
      "type": "hero",
      "position": "center",  // Starts at center
      "transforms": [
        {
          "beat": "transformMap",
          "position": {
            "grid": "top-right",
            "offset": { "x": -200, "y": 100 }
          },
          "scale": 0.4
        }
      ]
    },
    {
      "id": "subtitle",
      "type": "text",
      "text": "A place where...",
      "position": "bottom-center",
      "style": { ... }
    }
  ]
}
```

**Template Integration:**

```javascript
// Hook1AQuestionBurst_V5.jsx (refactored)

import { resolvePosition, POSITION_GRID } from '../sdk/positionSystem';

const Hook1AQuestionBurst = ({ scene, styles, presets, easingMap }) => {
  // Resolve positions for all layers
  const layers = scene.layers || [];
  
  const renderLayer = (layer) => {
    const pos = resolvePosition(layer.position, layer.offset);
    
    // Apply position to rendering
    return createLayerElement({
      ...layer,
      x: pos.x,
      y: pos.y
    });
  };
  
  useEffect(() => {
    if (!roughTextSvgRef.current) return;
    
    const svg = roughTextSvgRef.current;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    
    // Render all text layers with resolved positions
    layers
      .filter(l => l.type === 'text')
      .forEach(layer => {
        const element = renderLayer(layer);
        svg.appendChild(element);
      });
    
  }, [frame, layers]);
  
  return (
    <AbsoluteFill>
      {layers.map(layer => {
        if (layer.type === 'hero') {
          const pos = resolvePosition(layer.position);
          return (
            <div style={{
              position: 'absolute',
              left: pos.x,
              top: pos.y,
              transform: 'translate(-50%, -50%)'
            }}>
              {renderHero(layer)}
            </div>
          );
        }
        return null;
      })}
    </AbsoluteFill>
  );
};
```

**Football Example:**

```json
{
  "layers": [
    {
      "id": "question",
      "type": "text",
      "text": "Who was the greatest?",
      "position": {
        "grid": "center",
        "offset": { "x": 0, "y": -80 }
      }
    },
    {
      "id": "hero",
      "type": "hero",
      "hero": {
        "type": "image",
        "asset": "/assets/ronaldo.jpg"
      },
      "position": "center-right",
      "transforms": [
        {
          "beat": "shrink",
          "position": "top-right",
          "scale": 0.3
        }
      ]
    }
  ]
}
```

### Benefits
✅ Declarative positioning via JSON  
✅ 9-point grid for easy layout  
✅ Support for offsets, percentages, absolute values  
✅ All components use same system  
✅ Easy to adjust layouts without code changes  

---

## Summary: Common Themes for Agnostic Template Principals

Based on the analysis of these 3 concerns, the following themes emerge as critical principles for template-agnostic design:

### 1. **Type-Based Polymorphism**
- Replace hardcoded components with type registries
- Use JSON `type` field to select rendering logic
- Support multiple implementations (image, svg, lottie, custom)

### 2. **Data-Driven Structure**
- Replace fixed structures (2 lines) with dynamic arrays (1-4+ lines)
- Calculate positions, timings, and animations based on data length
- Support variable content without code changes

### 3. **Token-Based Positioning**
- Abstract positions into semantic tokens (center, top-left, etc.)
- Provide offset/percentage systems for fine-tuning
- Apply consistently across all visual elements

### 4. **Separation of Concerns**
- Separate content (what) from presentation (how)
- Separate structure (layout) from animation (motion)
- Make all aspects independently configurable via JSON

### 5. **Progressive Enhancement**
- Provide sensible defaults for simple use cases
- Allow detailed control for advanced use cases
- Support both simple tokens ("center") and complex configs

### 6. **Registry Pattern for Extensibility**
- Create registries for heroes, animations, layouts
- Allow registration of custom types
- Enable plugin-style architecture

---

## Next Steps

1. ✅ Document analysis (this file)
2. ⏳ Create `agnosticTemplatePrincipals.md` with distilled principles
3. ⏳ Implement hero registry system in SDK
4. ⏳ Implement dynamic line rendering system
5. ⏳ Implement position token system
6. ⏳ Refactor Hook1A to use new systems
7. ⏳ Test with football example
8. ⏳ Apply to other templates (Explain2A, Apply3B, Reflect4A)

---

**End of Analysis**
