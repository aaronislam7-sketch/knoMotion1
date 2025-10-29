# Collision Detection & Prevention System

**Blueprint v5.0 - Pre-runtime Layout Validation**

## Overview

This system ensures that visual elements in your video scenes **never overlap** by detecting and preventing collisions **before runtime**. It provides:

- ✅ **Pre-runtime validation** - Catch layout issues during development
- ✅ **Automatic position adjustment** - Smart algorithms to resolve collisions
- ✅ **Developer warnings** - Clear feedback on collision issues
- ✅ **Template-specific layouts** - Each template can define its collision zones

---

## Quick Start

### 1. Validate a Scene

```javascript
import { validateScene } from './sdk/scene-validator';
import myScene from './scenes/my-scene.json';

const result = validateScene(myScene, 30); // 30fps

if (!result.valid) {
  console.error('Collision detected!', result.collisions);
}
```

### 2. Validate All Scenes

```javascript
import { validateAllProjectScenes } from './utils/validate-scenes';

// Run in development to check all scenes
validateAllProjectScenes();
```

### 3. Use in a Template

```javascript
import { 
  calculateSafeConnectorPath,
  calculateSafeTimerPosition,
} from './sdk';

// Calculate safe path for connector that avoids boxes
const safePath = calculateSafeConnectorPath(centerBox, targetBox, {
  padding: 10,
});

// Use safePath.pathData for your SVG path
```

---

## Core Concepts

### Bounding Boxes

Every visual element is represented as a bounding box:

```javascript
{
  id: 'myElement',
  type: 'text',
  x: 960,              // Position (center or top-left)
  y: 540,
  width: 400,
  height: 100,
  anchorMode: 'center', // 'center' or 'topLeft'
  padding: 10,          // Extra space around element
  priority: 5,          // Higher = stays put in conflicts
  flexible: false,      // Can this be moved to resolve collisions?
  startFrame: 0,        // When element appears (optional)
  endFrame: 300,        // When element disappears (optional)
}
```

### Collision Detection

The system checks for overlaps between all elements:

```javascript
import { detectCollisions } from './sdk';

const boxes = [box1, box2, box3];
const collisions = detectCollisions(boxes, {
  checkTiming: true,      // Only check overlapping time ranges
  minSeverity: 'warning', // Filter by severity
});

// Returns array of collision objects
collisions.forEach(collision => {
  console.log(`${collision.elementA} overlaps ${collision.elementB}`);
  console.log(`Overlap: ${collision.overlapPercentage}%`);
  console.log(`Severity: ${collision.severity}`); // 'minor', 'warning', 'critical'
});
```

### Automatic Resolution

The system can automatically suggest or apply position adjustments:

```javascript
import { autoResolveCollisions } from './sdk';

const result = autoResolveCollisions(boxes, {
  maxIterations: 10,
  onProgress: ({ iteration, collisionsRemaining }) => {
    console.log(`Iteration ${iteration}: ${collisionsRemaining} collisions left`);
  },
});

if (result.success) {
  console.log('All collisions resolved!');
  const adjustedBoxes = result.boxes;
} else {
  console.warn('Could not resolve all collisions:', result.unresolvedCollisions);
}
```

---

## Layout Resolvers

### Safe Connector Paths (Explain2A)

Prevents connectors from overlapping with boxes:

```javascript
import { calculateSafeConnectorPath } from './sdk';

const centerBox = { x: 960, y: 460, width: 400, height: 160 };
const targetBox = { x: 500, y: 750, width: 340, height: 160 };

const safePath = calculateSafeConnectorPath(centerBox, targetBox, {
  padding: 10,        // Start/end 10px away from box edges
  curveIntensity: 0.3,
});

// Use in SVG
const pathElement = `
  <path d="${safePath.pathData}" />
`;
```

**Result:**
- Connector starts at **edge of center box** (not center)
- Connector ends at **edge of target box** (not center)
- Path curves around boxes to avoid overlap

### Safe Timer Position (Apply3A)

Prevents timer from overlapping with question text:

```javascript
import { calculateSafeTimerPosition, createTextBoundingBox } from './sdk';

// Define question box
const questionBox = createTextBoundingBox({
  id: 'question',
  text: 'What is your question?',
  x: 960,
  y: 180,
  fontSize: 52,
  maxWidth: 900,
});

// Calculate safe position for timer
const safeTimerPos = calculateSafeTimerPosition(questionBox, {
  defaultPosition: { x: 960, y: 200 },
  minSpacing: 40,
});

// Position timer at safe location
<div style={{
  top: safeTimerPos.y,
  left: safeTimerPos.x,
}}>
  {/* Timer content */}
</div>
```

**Algorithm:**
1. Try default position
2. If collision, try top-right corner
3. If collision, try top-left corner
4. If all fail, force timer to very top

---

## Template Integration

### Step 1: Define Layout Config

Export a `getLayoutConfig` function from your template:

```javascript
// In MyTemplate.jsx

export const getLayoutConfig = (scene, fps) => {
  return {
    getBoundingBoxes: (scene) => {
      const { createTextBoundingBox, createShapeBoundingBox } = require('../sdk');
      
      const boxes = [];
      
      // Add title box
      boxes.push(createTextBoundingBox({
        id: 'title',
        text: scene.fill.title,
        x: 960,
        y: 100,
        fontSize: 56,
        maxWidth: 1200,
        padding: 20,
        priority: 10,
        flexible: false,
      }));
      
      // Add shape boxes
      boxes.push(createShapeBoundingBox({
        id: 'mainBox',
        x: 960,
        y: 540,
        width: 800,
        height: 400,
        padding: 10,
        priority: 5,
        flexible: false,
      }));
      
      return boxes;
    },
  };
};
```

### Step 2: Register Validator

Register your template in the validator:

```javascript
// In scene-validator.js

import { getLayoutConfig } from '../templates/MyTemplate';

const TEMPLATE_VALIDATORS = {
  'MyTemplate': {
    getBoundingBoxes: (scene, fps) => {
      return getLayoutConfig(scene, fps).getBoundingBoxes(scene);
    },
    name: 'My Template',
  },
};
```

### Step 3: Validate During Development

```javascript
// In your template component

import { validateScene } from '../sdk';

const MyTemplate = ({ scene }) => {
  // Validate in development only
  if (process.env.NODE_ENV === 'development') {
    validateScene(scene, 30, { verbose: true });
  }
  
  // ... render template
};
```

---

## API Reference

### Collision Detection

#### `detectCollisions(boxes, options)`

Detect all collisions in a set of bounding boxes.

**Parameters:**
- `boxes`: Array of bounding box objects
- `options.checkTiming`: Check temporal overlap (default: `true`)
- `options.minSeverity`: Filter by severity (default: `'minor'`)

**Returns:** Array of collision objects

---

#### `checkOverlap(boxA, boxB)`

Check if two bounding boxes overlap.

**Returns:** Collision object or `null`

---

### Layout Resolution

#### `findSafePosition(element, existingElements, options)`

Find a collision-free position for an element.

**Parameters:**
- `element`: Element to position
- `existingElements`: Array of existing elements to avoid
- `options.preferredPosition`: Start search from this position
- `options.searchRadius`: Max search distance (default: `200`)
- `options.stepSize`: Search step size (default: `20`)

**Returns:** `{ x, y }` position

---

#### `calculateSafeConnectorPath(centerBox, targetBox, options)`

Calculate a connector path that avoids overlapping with boxes.

**Parameters:**
- `centerBox`: Source box `{ x, y, width, height }`
- `targetBox`: Target box `{ x, y, width, height }`
- `options.padding`: Distance from box edges (default: `20`)
- `options.curveIntensity`: Curve strength (default: `0.5`)

**Returns:**
```javascript
{
  start: { x, y },
  end: { x, y },
  control: { x, y },
  pathData: "M ... Q ... ...", // SVG path
  length: 450,
}
```

---

#### `calculateSafeTimerPosition(questionBox, options)`

Calculate a safe position for timer that avoids question text.

**Parameters:**
- `questionBox`: Question bounding box
- `options.defaultPosition`: Preferred position
- `options.minSpacing`: Minimum spacing (default: `40`)

**Returns:** `{ x, y }` position

---

#### `autoResolveCollisions(boxes, options)`

Automatically resolve collisions by moving flexible elements.

**Parameters:**
- `boxes`: Array of bounding boxes
- `options.maxIterations`: Max attempts (default: `10`)
- `options.onProgress`: Progress callback

**Returns:**
```javascript
{
  success: true,
  boxes: [...], // Adjusted boxes
  iterations: 3,
  message: 'All collisions resolved',
}
```

---

### Validation

#### `validateScene(scene, fps, options)`

Validate a scene for collision issues.

**Parameters:**
- `scene`: Scene JSON object
- `fps`: Frame rate (default: `30`)
- `options.verbose`: Log details (default: `true`)
- `options.minSeverity`: Filter severity (default: `'warning'`)

**Returns:**
```javascript
{
  validated: true,
  valid: true,
  report: { status: 'OK', message: '...' },
  collisions: [],
  boxes: [...],
}
```

---

#### `validateScenes(scenes, fps, options)`

Validate multiple scenes at once.

**Returns:**
```javascript
{
  results: [...],
  summary: {
    total: 8,
    validated: 2,
    valid: 2,
    warnings: 0,
    errors: 0,
  },
  allValid: true,
}
```

---

## Examples

### Example 1: Validate All Scenes

```javascript
import { validateAllProjectScenes } from './utils/validate-scenes';

// Run during development
const results = validateAllProjectScenes(30);

if (!results.allValid) {
  console.error('Some scenes have collision issues!');
}
```

### Example 2: Custom Layout Validation

```javascript
import { detectCollisions, createTextBoundingBox } from './sdk';

const boxes = [
  createTextBoundingBox({
    id: 'title',
    text: 'My Title',
    x: 960,
    y: 100,
    fontSize: 72,
    maxWidth: 1200,
  }),
  createTextBoundingBox({
    id: 'subtitle',
    text: 'My Subtitle',
    x: 960,
    y: 200,
    fontSize: 48,
    maxWidth: 1000,
  }),
];

const collisions = detectCollisions(boxes);

if (collisions.length > 0) {
  console.warn('Title and subtitle overlap!');
}
```

### Example 3: Dynamic Position Adjustment

```javascript
import { findSafePosition } from './sdk';

const existingElements = [
  { id: 'box1', x: 500, y: 500, width: 400, height: 200 },
];

const newElement = {
  id: 'box2',
  x: 600, // Preferred position (overlaps with box1)
  y: 500,
  width: 300,
  height: 150,
  flexible: true,
};

const safePos = findSafePosition(newElement, existingElements);

console.log('Move to:', safePos); // { x: 850, y: 500 } (no collision)
```

---

## Best Practices

### 1. ✅ Define Bounding Boxes for All Elements

Every visual element should have a bounding box:
- Text elements (titles, questions, explanations)
- Shapes (boxes, circles, connectors)
- UI elements (timers, buttons)
- Decorative elements (arrows, callouts)

### 2. ✅ Set Appropriate Priorities

Use priority levels to control which elements move in conflicts:
- `priority: 10` - Fixed elements (titles, main content)
- `priority: 5` - Secondary elements (boxes, shapes)
- `priority: 1` - Decorative elements (can move freely)

### 3. ✅ Mark Flexible Elements

Mark elements that can be repositioned:
```javascript
{
  id: 'decoration',
  flexible: true, // Can be moved to resolve collisions
}
```

### 4. ✅ Include Padding

Add padding around elements for visual breathing room:
```javascript
{
  id: 'title',
  padding: 20, // 20px space around element
}
```

### 5. ✅ Use Temporal Checking

If elements appear at different times, use `startFrame` and `endFrame`:
```javascript
{
  id: 'earlyElement',
  startFrame: 0,
  endFrame: 100,
}
```

### 6. ✅ Validate in Development

Always validate scenes during development:
```javascript
if (process.env.NODE_ENV === 'development') {
  validateScene(scene, fps, { verbose: true });
}
```

---

## Troubleshooting

### Issue: "No validator available"

**Cause:** Template doesn't have a registered validator.

**Solution:** Add `getLayoutConfig` export to your template and register it in `scene-validator.js`.

---

### Issue: "Cannot auto-resolve remaining collisions"

**Cause:** No flexible elements, or all positions are occupied.

**Solution:** 
- Mark some elements as `flexible: true`
- Manually adjust positions in JSON
- Reduce element sizes or padding

---

### Issue: "Overlap percentage very high"

**Cause:** Elements are completely overlapping.

**Solution:**
- Adjust initial positions in JSON
- Reduce element sizes
- Use `findSafePosition()` to calculate positions

---

## Future Enhancements

- [ ] Visual collision debugger in UI
- [ ] Real-time collision preview in editor
- [ ] Auto-adjust on JSON save
- [ ] Collision heatmap visualization
- [ ] Machine learning-based layout optimization

---

## Summary

The collision detection system ensures **zero overlap between elements** by:

1. **Defining bounding boxes** for all visual elements
2. **Detecting collisions** before render time
3. **Suggesting adjustments** or auto-resolving conflicts
4. **Validating scenes** during development

This prevents runtime surprises and ensures professional, clean layouts in all your video scenes.

---

**Built with ❤️ for the KnoMotion Videos project**
