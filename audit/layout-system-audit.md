# Layout System Audit

**Date**: 2025-01-20  
**Task**: Phase 1, Week 1, Task 1.1  
**Status**: ✅ Complete

---

## Executive Summary

**Finding**: `layoutEngineV2.js` is an **EXACT duplicate** of `layoutEngine.js` (both 588 lines, identical content). Safe to remove.

**Finding**: `layout-resolver.js` contains valuable collision detection and safe positioning functions that should be integrated into `layoutEngine.js`.

**Finding**: `positionSystem.js` is legacy 9-point grid system - low priority, can remain for backward compatibility.

**Recommendation**: 
1. ✅ **KEEP** `layoutEngine.js` as canonical system
2. ❌ **REMOVE** `layoutEngineV2.js` (exact duplicate)
3. ✅ **INTEGRATE** collision detection functions from `layout-resolver.js` into `layoutEngine.js`
4. ⚠️ **KEEP** `positionSystem.js` for now (legacy, but used by layoutEngine)

---

## File Analysis

### 1. `/sdk/layout/layoutEngine.js` (588 lines) ✅ **CANONICAL**

**Status**: Keep as canonical layout engine

**Features**:
- ✅ 7 arrangement types: STACKED_VERTICAL, STACKED_HORIZONTAL, GRID, CIRCULAR, RADIAL, CASCADE, CENTERED
- ✅ Layout area helpers: `createLayoutAreas()`
- ✅ Main function: `calculateItemPositions()`
- ✅ Utility functions:
  - `calculateDynamicSpacing()`
  - `calculateBoundingBox()`
  - `scalePositionsToFit()`
  - `getLayoutPattern()` (presets)
  - `calculateResponsiveFontSize()`
  - `checkForOverlaps()` (basic overlap check)
  - `calculateStaggerDelays()`

**Dependencies**:
- Imports from `positionSystem.js`: `resolvePosition`, `getCenteredStackBase`, `getStackedPosition`

**Gaps**:
- ❌ No collision detection integration
- ❌ No safe positioning (finds collision-free positions)
- ❌ No automatic collision resolution
- ❌ Basic `checkForOverlaps()` exists but not integrated into `calculateItemPositions()`

---

### 2. `/sdk/layout/layoutEngineV2.js` (588 lines) ❌ **EXACT DUPLICATE**

**Status**: **REMOVE** - Identical to `layoutEngine.js`

**Verification**:
- Same line count (588 lines)
- Same exports
- Same functions
- Same comments
- **100% identical content**

**Action**: Safe to delete after verifying no imports reference it.

---

### 3. `/sdk/layout/layout-resolver.js` (491 lines) ✅ **INTEGRATE**

**Status**: Integrate collision detection functions into `layoutEngine.js`

**Valuable Functions to Integrate**:

#### Core Functions (MUST INTEGRATE):
1. **`findSafePosition(element, existingElements, options)`**
   - Finds collision-free position using expanding circle search
   - Returns safe position or preferred position with warning
   - **Action**: Add to `layoutEngine.js` as `findSafePosition()`

2. **`calculateSafeLayout(elements, options)`**
   - Uses `autoResolveCollisions()` for multiple elements
   - Iteratively resolves collisions
   - **Action**: Add to `layoutEngine.js` as `calculateSafeLayout()`

3. **`enforceMinimumSpacing(elements, minSpacing)`**
   - Ensures minimum spacing between elements
   - Uses `findSafePosition()` internally
   - **Action**: Add to `layoutEngine.js` as `enforceMinimumSpacing()`

#### Template-Specific Functions (OPTIONAL - May be legacy):
4. **`calculateSafeConnectorPath(centerBox, targetBox, options)`**
   - Calculates safe connector paths (for Explain2A)
   - **Action**: Keep in layout-resolver OR move to template-specific utils

5. **`calculateSafeTimerPosition(questionBox, options)`**
   - Template-specific for Apply3A
   - **Action**: Keep in layout-resolver OR move to template-specific utils

6. **`getExplain2ABoundingBoxes(scene, fps)`**
   - Template-specific for Explain2A
   - **Action**: Legacy - can remove or move to legacy templates

7. **`getApply3ABoundingBoxes(scene, fps)`**
   - Template-specific for Apply3A
   - **Action**: Legacy - can remove or move to legacy templates

8. **`calculateGridLayout(items, options)`**
   - Simple grid layout (less sophisticated than layoutEngine's grid)
   - **Action**: Not needed - layoutEngine has better `calculateGridPositions()`

**Dependencies**:
- Imports from `/sdk/validation/collision-detection.js`:
  - `createTextBoundingBox`
  - `createShapeBoundingBox`
  - `detectCollisions`
  - `autoResolveCollisions`

**Integration Plan**:
1. Add `findSafePosition()` to `layoutEngine.js`
2. Add `calculateSafeLayout()` to `layoutEngine.js`
3. Add `enforceMinimumSpacing()` to `layoutEngine.js`
4. Enhance `calculateItemPositions()` to optionally use collision detection
5. Remove template-specific functions (or move to legacy)

---

### 4. `/sdk/layout/positionSystem.js` (393 lines) ⚠️ **LEGACY**

**Status**: Keep for backward compatibility (low priority)

**Features**:
- 9-point grid system (POSITION_GRID)
- `resolvePosition()` - resolves position tokens
- `getStackedPosition()` - calculates stacked positions
- `getCenteredStackBase()` - centers stacks
- Various utility functions

**Usage**:
- Currently imported by `layoutEngine.js`
- Used by templates for position resolution

**Action**: Keep for now, but note it's legacy. Can be deprecated later if not needed.

---

## Integration Plan

### Step 1: Integrate Core Functions from layout-resolver.js

**Functions to add to `layoutEngine.js`**:

```javascript
// From layout-resolver.js
import {
  detectCollisions,
  autoResolveCollisions,
} from '../validation/collision-detection';

/**
 * Find safe position that avoids collisions
 * @param {Object} element - Element with x, y, width, height
 * @param {Array} existingElements - Array of existing elements
 * @param {Object} options - Configuration
 * @returns {Object} Safe position {x, y}
 */
export const findSafePosition = (element, existingElements, options = {}) => {
  // ... implementation from layout-resolver.js
};

/**
 * Calculate safe layout for multiple elements with collision resolution
 * @param {Array} elements - Array of elements
 * @param {Object} options - Configuration
 * @returns {Object} Result with success, elements, iterations, message
 */
export const calculateSafeLayout = (elements, options = {}) => {
  // ... implementation from layout-resolver.js
};

/**
 * Enforce minimum spacing between elements
 * @param {Array} elements - Array of elements
 * @param {number} minSpacing - Minimum spacing in pixels
 * @returns {Array} Adjusted elements
 */
export const enforceMinimumSpacing = (elements, minSpacing = 20) => {
  // ... implementation from layout-resolver.js
};
```

### Step 2: Enhance calculateItemPositions()

**Add optional collision detection**:

```javascript
export const calculateItemPositions = (items, config = {}) => {
  const {
    arrangement = ARRANGEMENT_TYPES.STACKED_VERTICAL,
    enableCollisionDetection = false, // NEW
    minSpacing = 20, // NEW
    ...rest
  } = config;

  // Calculate positions using existing logic
  let positions = /* ... existing switch statement ... */;

  // NEW: Apply collision detection if enabled
  if (enableCollisionDetection) {
    positions = enforceMinimumSpacing(positions, minSpacing);
    // Or use calculateSafeLayout for more sophisticated resolution
  }

  return positions;
};
```

### Step 3: Add Layout Validation API

**New function**:

```javascript
/**
 * Validate layout and return errors/warnings
 * @param {Array} positions - Calculated positions
 * @param {Object} canvas - Canvas dimensions {width, height}
 * @param {Object} options - Validation options
 * @returns {Object} {valid: boolean, errors: [], warnings: []}
 */
export const validateLayout = (positions, canvas, options = {}) => {
  const errors = [];
  const warnings = [];

  // Check bounds violations
  positions.forEach((pos, index) => {
    if (pos.x < 0 || pos.x > canvas.width) {
      errors.push({
        element: index,
        type: 'bounds-violation',
        message: `Element ${index} exceeds canvas width`,
      });
    }
    if (pos.y < 0 || pos.y > canvas.height) {
      errors.push({
        element: index,
        type: 'bounds-violation',
        message: `Element ${index} exceeds canvas height`,
      });
    }
  });

  // Check collisions (if width/height provided)
  if (positions.every(p => p.width && p.height)) {
    const hasOverlaps = checkForOverlaps(positions);
    if (hasOverlaps) {
      warnings.push({
        type: 'collision',
        message: 'Elements overlap - consider enabling collision detection',
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
};
```

---

## Usage Analysis

### Current Imports

**Search for layout system imports**:
- Need to check which files import from each system
- Update imports after consolidation

**Expected imports**:
- Most templates should import from `layoutEngine.js`
- Some may import from `layout-resolver.js` (need to update)
- None should import from `layoutEngineV2.js` (if found, update to layoutEngine)

---

## Action Items

### Immediate Actions (Task 1.2):
1. ✅ Verify `layoutEngineV2.js` is duplicate (CONFIRMED)
2. ✅ Document functions to integrate from `layout-resolver.js` (DONE)
3. ✅ Integrate `findSafePosition()` into `layoutEngine.js` (DONE)
4. ✅ Integrate `calculateSafeLayout()` into `layoutEngine.js` (DONE)
5. ✅ Integrate `enforceMinimumSpacing()` into `layoutEngine.js` (DONE)
6. ✅ Enhance `calculateItemPositions()` with optional collision detection (DONE)
7. ✅ Add `validateLayout()` function (DONE)

**Task 1.2 Status**: ✅ Complete

### Cleanup Actions (Task 1.4):
1. ✅ Delete `layoutEngineV2.js` (DONE)
2. ⚠️ Keep `layout-resolver.js` temporarily (used by scene-validator.js for legacy template functions)
   - Not exported from SDK index.js (already removed)
   - Will be deleted when templates are sunset in Week 4
3. ✅ Update all imports (DONE - removed from SDK exports)
4. ✅ Verify build passes (DONE)

**Task 1.4 Status**: ✅ Complete (layout-resolver kept temporarily for legacy compatibility)

---

## Summary

| File | Status | Action |
|------|--------|--------|
| `layoutEngine.js` | ✅ Keep | Enhanced with collision detection ✅ |
| `layoutEngineV2.js` | ❌ Removed | Deleted (exact duplicate) ✅ |
| `layout-resolver.js` | ⚠️ Keep Temporarily | Core functions integrated ✅, template-specific functions remain for legacy templates (will be removed in Week 4) |
| `positionSystem.js` | ⚠️ Keep | Legacy, low priority |

**Next Step**: Proceed to Task 1.2 - Create Unified Layout Engine
