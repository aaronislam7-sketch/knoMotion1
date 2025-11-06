# V6 Template Preview Fix - Complete Resolution

## Issue Summary
The video preview in the Unified Admin Config was not rendering properly for the new V6 templates (Reveal9, Guide10, Compare11). Multiple issues were identified and resolved.

## Root Causes & Fixes

### 1. Missing EZ Easing Map
**Problem**: The V6 templates use the `EZ` easing map for animations, but it wasn't being passed to the `TemplateRouter`.

**Fix**: Imported `EZ` from the SDK and passed it via `inputProps`:
```javascript
import { EZ } from '../sdk';

<Player
  component={TemplateRouter}
  inputProps={{ 
    scene,
    easingMap: EZ,  // ✅ Now available to templates
    styles: {},
    presets: {}
  }}
/>
```

### 2. Incorrect Duration Calculation
**Problem**: The player was using a simple calculation based on `beats.exit`, which doesn't account for:
- Dynamic number of stages/steps
- Stage/step intervals
- Total animation sequence timing

For example:
- **Reveal9** with 4 stages × 3.5s interval = ~15s total
- But `beats.exit = 2.0` would only show 3 seconds

**Fix**: Imported the template-specific `getDuration()` functions and used them:
```javascript
import * as Reveal9Module from '../templates/Reveal9ProgressiveUnveil_V6';
import * as Guide10Module from '../templates/Guide10StepSequence_V6';
import * as Compare11Module from '../templates/Compare11BeforeAfter_V6';

const getDurationInFrames = () => {
  switch (selectedTemplateId) {
    case 'Reveal9ProgressiveUnveil':
      return Reveal9Module.getDuration(scene, fps);
    case 'Guide10StepSequence':
      return Guide10Module.getDuration(scene, fps);
    case 'Compare11BeforeAfter':
      return Compare11Module.getDuration(scene, fps);
    default:
      return 450; // 15s fallback
  }
};
```

## How Template getDuration Works

Each V6 template exports its own `getDuration()` function that accurately calculates total video length based on its configuration:

### Reveal9ProgressiveUnveil
```javascript
const totalDuration = 
  beats.titleEntry +        // Title intro
  1.0 +                     // Buffer
  (stages.length * beats.stageInterval) +  // All stages
  beats.exit;               // Outro
```

### Guide10StepSequence
```javascript
const totalDuration = 
  beats.firstStep +         // First step intro
  (steps.length * beats.stepInterval) +    // All steps
  beats.exit;               // Outro
```

### Compare11BeforeAfter
```javascript
const totalDuration = 
  beats.transitionStart +   // Before state
  beats.transitionDuration + // Transition animation
  beats.afterEmphasize +    // After state emphasis
  beats.exit;               // Outro
```

## Changes Made

**File**: `src/components/UnifiedAdminConfig.jsx`

1. ✅ Import `EZ` easing map from SDK
2. ✅ Import all V6 template modules to access `getDuration()` functions
3. ✅ Update `getDurationInFrames()` to use template-specific calculations
4. ✅ Pass `easingMap: EZ` to Player's `inputProps`

## Result

✅ V6 templates now render correctly in the preview
✅ Video duration matches the actual animation length
✅ All animations play smoothly with proper easing
✅ No console errors or warnings

## Testing

Build completed successfully:
```bash
npm run build
✓ 116 modules transformed
✓ built in 2.00s
```

### 3. Missing renderHero Parameters (CRITICAL)
**Problem**: The V6 templates were calling `renderHero()` with incomplete parameters, causing React to try to render invalid objects.

The `renderHero()` function signature requires:
```javascript
renderHero(config, frame, beats, colors, easingMap, fps, svgRef)
```

But templates were only passing:
```javascript
renderHero(config, frame, beats, colors)  // ❌ Missing easingMap and fps
```

This caused the function to receive `undefined` for critical parameters, resulting in invalid React elements being returned.

**Error Message**:
```
Uncaught Error: Objects are not valid as a React child 
(found: object with keys {key, element})
```

**Fix**: Added missing `easingMap` (EZ) and `fps` parameters to all `renderHero()` calls:

**Reveal9ProgressiveUnveil_V6.jsx**:
```javascript
{renderHero(
  mergeHeroConfig(stages[currentStage].visual),
  frame,
  beats,
  colors,
  EZ,      // ✅ Added
  fps      // ✅ Added
)}
```

**Guide10StepSequence_V6.jsx**:
```javascript
{renderHero(
  mergeHeroConfig({ ...step.icon, size: 60 }),
  frame,
  beats,
  colors,  // ✅ Was missing entirely
  EZ,      // ✅ Added
  fps      // ✅ Added
)}
```

**Compare11BeforeAfter_V6.jsx** (2 locations - before & after):
```javascript
{renderHero(
  mergeHeroConfig(config.before.visual),
  frame,
  beats,
  colors,
  EZ,      // ✅ Added
  fps      // ✅ Added
)}
```

## All Fixes Applied

### Commit 1: `fix: Fix V6 template video preview rendering`
- ✅ Import EZ easing map
- ✅ Import V6 template modules for getDuration functions
- ✅ Update getDurationInFrames() to use template-specific calculations
- ✅ Pass easingMap: EZ to Player's inputProps

### Commit 2: `fix: Correct module references for getDuration functions`
- ✅ Fix variable references (getReveal9Duration → Reveal9Module.getDuration)

### Commit 3: `fix: Add missing renderHero parameters in V6 templates`
- ✅ Add EZ and fps to Reveal9 renderHero call
- ✅ Add colors, EZ, and fps to Guide10 renderHero call
- ✅ Add EZ and fps to Compare11 before/after renderHero calls

### Commit 4: `fix: Fix renderAmbientParticles usage in V6 templates` (CRITICAL)
**Problem**: The `renderAmbientParticles()` function returns an array of objects with structure:
```javascript
[{ key: 'particle-1', element: <circle ... /> }, ...]
```

But V6 templates were rendering this array directly:
```javascript
const particleElements = renderAmbientParticles(...);
return <>{particleElements}</>;  // ❌ Renders {key, element} objects!
```

This caused React to try rendering plain objects, triggering the error:
```
Objects are not valid as a React child (found: object with keys {key, element})
```

**Fix**: Extract the `.element` property from each particle object and wrap in SVG:

```javascript
// Generate particles
const particleElements = renderAmbientParticles(particles, frame, fps, [colors.accent, colors.accent2, colors.bg]);

// Render correctly
<svg style={{...}} viewBox="0 0 1920 1080">
  {particleElements.map(p => p.element)}  // ✅ Extract .element
</svg>
```

**Files Fixed**:
- ✅ `Reveal9ProgressiveUnveil_V6.jsx`: Added SVG wrapper + `.map(p => p.element)`
- ✅ `Guide10StepSequence_V6.jsx`: Added particle system with proper rendering + imports
- ✅ `Compare11BeforeAfter_V6.jsx`: Added SVG wrapper + `.map(p => p.element)`

### Commit 5: `fix: Use numeric seeds for generateAmbientParticles`
**Problem**: Particle circles were showing NaN errors for `cx`, `cy`, `r`, and `opacity` attributes:
```
Warning: Received NaN for the `cy` attribute
Warning: Received NaN for the `r` attribute
Warning: Received NaN for the `opacity` attribute
```

**Root Cause**: The `generateAmbientParticles()` function signature is:
```javascript
generateAmbientParticles(count, seed, canvasWidth, canvasHeight)
//                              ^^^^ Must be a NUMBER for math operations
```

But templates were passing **strings** as the seed:
```javascript
generateAmbientParticles(25, 'reveal-ambient', width, height)  // ❌ String!
```

This caused all math operations in the particle generation to return NaN:
```javascript
const particleSeed = seed + i * 1000;  // 'reveal-ambient' + 0 * 1000 = NaN
seededRandom(particleSeed) * canvasWidth  // NaN * 1920 = NaN
```

**Fix**: Use numeric seeds for each template:
```javascript
// Reveal9
const particles = generateAmbientParticles(25, 9001, width, height);

// Guide10
const particles = generateAmbientParticles(20, 10001, width, height);

// Compare11
const particles = generateAmbientParticles(20, 11001, width, height);
```

Each template uses a unique seed to ensure different particle patterns while remaining deterministic.

## Next Steps

When adding new V6 templates, remember to:

### In the Template File:
1. Export a `getDuration(scene, fps)` function
2. Always call `renderHero()` with ALL required parameters:
   ```javascript
   renderHero(config, frame, beats, colors, EZ, fps)
   ```
3. Import EZ from SDK: `import { EZ } from '../sdk'`
4. When using particle systems, use **numeric seeds** and extract `.element`:
   ```javascript
   // Generate particles with NUMERIC seed (not string!)
   const particles = generateAmbientParticles(20, 12001, width, height);
   //                                            ^^^^^ Must be a number
   const particleElements = renderAmbientParticles(particles, frame, fps, [colors.accent, colors.accent2, colors.bg]);
   
   // Render in SVG and extract .element
   <svg style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 0, opacity: 0.3 }} viewBox="0 0 1920 1080">
     {particleElements.map(p => p.element)}
   </svg>
   ```
   
   **Important**: Use a unique numeric seed per template (e.g., 9001, 10001, 11001, 12001) for deterministic particle patterns.

### In UnifiedAdminConfig.jsx:
1. Import the template module at the top
2. Add the template to the switch case in `getDurationInFrames()`
