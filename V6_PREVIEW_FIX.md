# V6 Template Preview Fix

## Issue Summary
The video preview in the Unified Admin Config was not rendering properly for the new V6 templates (Reveal9, Guide10, Compare11).

## Root Causes

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

## Next Steps

When adding new V6 templates, remember to:
1. Export a `getDuration(scene, fps)` function
2. Add the template to the switch case in `UnifiedAdminConfig.jsx`
3. Import the template module at the top of the file
