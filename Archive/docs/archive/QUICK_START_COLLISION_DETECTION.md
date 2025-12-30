# Quick Start: Collision Detection

Your collision detection system is now fully implemented! Here's how to use it:

---

## ✅ What's Fixed

### 1. **Explain2A Template** (Connector Overlaps)
- Connectors now start/end at box edges (not centers)
- Arrows positioned at connection endpoints
- Paths curve around boxes with proper clearance

### 2. **Apply3A Template** (Timer Overlaps)
- Timer position calculated dynamically based on question height
- Falls back to alternative positions if collision detected
- Always maintains minimum spacing from question

---

## 🚀 Quick Usage

### Validate All Scenes

```javascript
// In browser console or development script
import { validateAllProjectScenes } from './KnoMotion-Videos/src/utils/validate-scenes';

const results = validateAllProjectScenes(30); // 30fps

// Output:
// 🔍 VALIDATING ALL SCENES FOR COLLISIONS
// ✅ Valid (no collisions): 2
// ⚠️ Warnings: 0
// ❌ Errors (critical): 0
```

### Validate Single Scene

```javascript
import { validateSpecificScene } from './KnoMotion-Videos/src/utils/validate-scenes';

const result = validateSpecificScene('explain2a', 30);

if (!result.valid) {
  console.error('Collisions detected!', result.collisions);
}
```

### Test Fixed Scenes

```javascript
import { testFixedScenes } from './KnoMotion-Videos/src/utils/validate-scenes';

const results = testFixedScenes(30);

// Output:
// 🧪 TESTING COLLISION FIXES
// Explain2A: ✅ PASS
// Apply3A: ✅ PASS
```

---

## 🎯 For New Templates

When creating a new template, add collision detection:

### Step 1: Define Layout Config

```javascript
// In your template file (e.g., MyTemplate_V5.jsx)

export const getLayoutConfig = (scene, fps) => {
  return {
    getBoundingBoxes: (scene) => {
      const { createTextBoundingBox, createShapeBoundingBox } = require('../sdk');
      
      const boxes = [];
      
      // Add bounding boxes for all elements
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
      
      return boxes;
    },
  };
};
```

### Step 2: Register Validator

```javascript
// In src/sdk/scene-validator.js

import { getLayoutConfig } from '../templates/MyTemplate_V5';

const TEMPLATE_VALIDATORS = {
  // ... existing validators
  'MyTemplate': {
    getBoundingBoxes: (scene, fps) => {
      return getLayoutConfig(scene, fps).getBoundingBoxes(scene);
    },
    name: 'My Template',
  },
};
```

### Step 3: Use Layout Helpers

```javascript
// In your template component

import { 
  calculateSafeTimerPosition,
  calculateSafeConnectorPath,
  findSafePosition,
} from '../sdk';

// Calculate safe timer position
const safeTimerPos = calculateSafeTimerPosition(questionBox);

// Calculate safe connector path
const safePath = calculateSafeConnectorPath(centerBox, targetBox);

// Find safe position for any element
const safePos = findSafePosition(element, existingElements);
```

---

## 🔍 Development Workflow

### 1. During Development

```javascript
// In your template component
import { validateScene } from '../sdk';

const MyTemplate = ({ scene }) => {
  // Validate in dev mode
  if (process.env.NODE_ENV === 'development') {
    validateScene(scene, 30, { verbose: true });
  }
  
  // ... render logic
};
```

### 2. Before Committing

```bash
# Run validation on all scenes
npm run dev

# Then in browser console:
> import { validateAllProjectScenes } from './KnoMotion-Videos/src/utils/validate-scenes';
> validateAllProjectScenes();

# Check output for warnings/errors
```

### 3. In CI/CD (Future)

```javascript
// In test file
import { validateAllScenes } from './src/sdk/scene-validator';
import scenes from './src/scenes/*.json';

test('All scenes should have no collisions', () => {
  const results = validateScenes(scenes, 30, { verbose: false });
  expect(results.allValid).toBe(true);
});
```

---

## 📚 Documentation

Full documentation available at:
- **API Reference:** `/workspace/KnoMotion-Videos/docs/COLLISION_DETECTION.md`
- **Implementation Details:** `/workspace/COLLISION_DETECTION_IMPLEMENTATION.md`

---

## 🎨 Key Concepts

### Bounding Boxes

Every element needs a bounding box:

```javascript
{
  id: 'myElement',       // Unique identifier
  type: 'text',          // Element type
  x: 960,                // X position
  y: 540,                // Y position
  width: 400,            // Width in pixels
  height: 100,           // Height in pixels
  anchorMode: 'center',  // 'center' or 'topLeft'
  padding: 10,           // Extra spacing
  priority: 5,           // Higher = stays in place
  flexible: false,       // Can be moved?
}
```

### Priority System

- **Priority 10:** Fixed elements (titles, main content)
- **Priority 5:** Secondary elements (boxes, shapes)
- **Priority 1:** Decorative elements (can move)

### Flexibility

- `flexible: false` - Element stays in place
- `flexible: true` - Element can be moved to resolve collisions

---

## 🐛 Troubleshooting

### "No validator available"

**Solution:** Add `getLayoutConfig` export to your template and register it in `scene-validator.js`.

### "Cannot auto-resolve"

**Solution:** Mark some elements as `flexible: true` or manually adjust positions in JSON.

### "High overlap percentage"

**Solution:** Reduce element sizes, add padding, or adjust positions in scene JSON.

---

## 🎯 Next Steps

1. ✅ **Collision detection is implemented**
2. ✅ **Explain2A and Apply3A are fixed**
3. ✅ **Documentation is complete**

**Now you can:**
- Extend template count with confidence
- Add new templates with collision detection
- Validate scenes before export
- Prevent overlaps programmatically

---

## 🎬 Example Output

When you run `validateAllProjectScenes()`:

```
🔍 VALIDATING ALL SCENES FOR COLLISIONS

============================================================
📊 VALIDATION SUMMARY
============================================================
Total scenes: 8
✅ Valid (no collisions): 2
⚠️ Warnings: 0
❌ Errors (critical): 0
Not validated: 6

📋 INDIVIDUAL RESULTS
============================================================
✅ Explain 2A: Concept Breakdown
✅ Apply 3A: Micro Quiz
⚪ Explain 2B: Analogy (No validator available)
⚪ Apply 3B: Scenario (No validator available)
⚪ Hook 1A: Question Burst (No validator available)
⚪ Hook 1E: Mystery (No validator available)
⚪ Reflect 4A: Takeaways (No validator available)
⚪ Reflect 4D: Forward Link (No validator available)

============================================================
✅ ALL VALIDATED SCENES PASSED!
```

---

**Happy video creating! 🎥✨**
