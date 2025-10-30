# Backward Compatibility Fix ✅
**Date:** 2025-10-30  
**Issue:** Schema validation error - "Missing required field: fill"  
**Status:** FIXED

---

## Problem

The v5.1 agnostic JSON scenes were failing schema validation with:
```
Missing required field: fill (v5.0 schema)
```

This happened because:
1. The schema required the `fill` field
2. New v5.1 scenes use `question`, `hero`, `welcome`, `subtitle` instead of `fill`
3. Schema couldn't validate both formats

---

## Solution Implemented

### 1. Made `fill` Optional
**File:** `src/sdk/scene.schema.ts` (line 84)

```typescript
// Before (required)
fill: z.object({
  texts: z.record(z.string()).optional().default({}),
  images: z.record(z.string()).optional().default({})
}),

// After (optional)
fill: z.object({
  texts: z.record(z.string()).optional().default({}),
  images: z.record(z.string()).optional().default({})
}).optional(),
```

### 2. Added v5.1 Schema Fields
Added optional schema definitions for:
- `question` - Dynamic line array (1-4+ lines)
- `hero` - Type-based hero configuration
- `welcome` - Welcome text configuration
- `subtitle` - Subtitle configuration
- `layers` - Generic layers array
- `lottie` - Lottie animations

### 3. Added Validation Refinement
```typescript
.refine(
  (data) => {
    const hasV5Legacy = data.fill !== undefined;
    const hasV5Agnostic = data.question !== undefined || data.hero !== undefined;
    return hasV5Legacy || hasV5Agnostic;
  },
  {
    message: "Scene must have either v5.0 format (fill) or v5.1 format (question/hero)"
  }
);
```

### 4. Added Version Detection Helpers
```typescript
detectSchemaVersion(scene) // Returns '5.0' | '5.1' | 'unknown'
isAgnosticScene(scene)     // Returns boolean
isLegacyScene(scene)       // Returns boolean
```

### 5. Created Compatibility Module
**File:** `src/sdk/sceneCompatibility.js`

**Functions:**
- `validateSceneCompat()` - Validate with friendly messages
- `validateWithMigrationHints()` - Validation + migration tips
- `checkAgnosticCompatibility()` - Check if scene can use agnostic templates
- `autoMigrateToV51()` - Auto-migrate v5.0 → v5.1
- `getValidationMessage()` - User-friendly error messages

---

## Validation Examples

### v5.0 Scene (Legacy) ✅
```json
{
  "schema_version": "5.0",
  "template_id": "Hook1AQuestionBurst",
  "fill": {
    "texts": {
      "questionPart1": "What if geography",
      "questionPart2": "was measured in mindsets?"
    }
  }
}
```
**Result:** ✅ VALID - `fill` field present

### v5.1 Scene (Agnostic) ✅
```json
{
  "schema_version": "5.1",
  "template_id": "Hook1AQuestionBurst",
  "question": {
    "lines": [
      { "text": "Who was the greatest?", "emphasis": "high" }
    ]
  },
  "hero": {
    "type": "image",
    "asset": "/football.jpg"
  }
}
```
**Result:** ✅ VALID - `question` and `hero` fields present

### Invalid Scene ❌
```json
{
  "schema_version": "5.1",
  "template_id": "Hook1AQuestionBurst"
  // Missing both fill AND question/hero
}
```
**Result:** ❌ INVALID - Must have either format

---

## Usage

### Validate a Scene
```javascript
import { validateSceneCompat } from './sdk';

const result = validateSceneCompat(scene);

if (result.valid) {
  console.log(`✅ Valid ${result.version} scene`);
} else {
  console.error('❌ Errors:', result.errors);
}
```

### Get Friendly Messages
```javascript
import { getValidationMessage } from './sdk';

const message = getValidationMessage(scene);
console.log(message);
// ✅ Scene validated successfully (5.1)
// or
// ❌ Scene validation failed: ...
```

### Auto-Migrate
```javascript
import { autoMigrateToV51 } from './sdk';

const legacyScene = { schema_version: "5.0", fill: {...} };
const migratedScene = autoMigrateToV51(legacyScene);
// Returns v5.1 format
```

---

## Testing Matrix

| Scene Format | Has `fill` | Has `question/hero` | Validates? |
|--------------|-----------|---------------------|------------|
| v5.0 (legacy) | ✅ | ❌ | ✅ PASS |
| v5.1 (agnostic) | ❌ | ✅ | ✅ PASS |
| Mixed (transition) | ✅ | ✅ | ✅ PASS |
| Empty (invalid) | ❌ | ❌ | ❌ FAIL |

---

## Template Compatibility

### Hook1AQuestionBurst_V5.jsx (Original)
- ✅ Supports v5.0 format
- ❌ Does NOT support v5.1 format
- Uses hardcoded map, 2-line structure

### Hook1AQuestionBurst_V5_Agnostic.jsx (New)
- ✅ Supports v5.0 format (auto-converts)
- ✅ Supports v5.1 format
- Uses hero registry, dynamic lines, position tokens

---

## Files Modified

1. **`src/sdk/scene.schema.ts`** - Updated schema
   - Made `fill` optional
   - Added v5.1 fields
   - Added validation refinement
   - Added version detection helpers

2. **`src/sdk/sceneCompatibility.js`** - NEW
   - Validation helpers
   - Migration tools
   - Friendly error messages

3. **`src/sdk/index.js`** - Updated exports
   - Export schema helpers
   - Export compatibility module

4. **`docs/BACKWARD_COMPATIBILITY.md`** - NEW
   - Complete migration guide
   - Examples and troubleshooting

---

## Migration Path

For existing v5.0 scenes:

1. **No Action Required** - They still work!
2. **Optional Migration** - Use `autoMigrateToV51()` to convert
3. **Gradual Transition** - Can mix both formats during migration

For new scenes:

1. **Use v5.1 format** - Better flexibility
2. **Use agnostic template** - `Hook1AQuestionBurst_V5_Agnostic.jsx`
3. **Follow examples** - See football/science JSON files

---

## Success Criteria ✅

- ✅ v5.0 scenes validate successfully
- ✅ v5.1 scenes validate successfully
- ✅ Clear error messages for invalid scenes
- ✅ Auto-migration tool available
- ✅ Version detection works
- ✅ Templates handle both formats
- ✅ No breaking changes

---

## Before/After

### Before (Error)
```
❌ Validation Error: Missing required field: fill (v5.0 schema)
```

### After (Success)
```
✅ Scene validated successfully (5.1)
ℹ️ Using v5.1 agnostic format (question/hero)
```

---

**Status:** ✅ BACKWARD COMPATIBILITY FULLY RESTORED

All scenes (v5.0 and v5.1) now validate and render correctly!
