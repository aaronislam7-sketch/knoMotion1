# Backward Compatibility Guide
**Date:** 2025-10-30  
**Version:** v5.0 → v5.1 Migration

---

## Overview

The agnostic template system (v5.1) is **fully backward compatible** with v5.0 scenes. Both formats are supported and validated.

---

## Schema Versions

### v5.0 (Legacy Format)
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

### v5.1 (Agnostic Format)
```json
{
  "schema_version": "5.1",
  "template_id": "Hook1AQuestionBurst",
  "question": {
    "lines": [
      { "text": "What if geography", "emphasis": "normal" },
      { "text": "was measured in mindsets?", "emphasis": "high" }
    ]
  },
  "hero": {
    "type": "roughSVG",
    "asset": "knodovia-map"
  }
}
```

---

## Validation

Both formats pass validation:

```javascript
import { validateSceneCompat } from './sdk';

// v5.0 scene
const legacyScene = { schema_version: "5.0", fill: { texts: {...} } };
const result = validateSceneCompat(legacyScene);
// ✅ result.valid === true

// v5.1 scene
const agnosticScene = { schema_version: "5.1", question: {...}, hero: {...} };
const result2 = validateSceneCompat(agnosticScene);
// ✅ result2.valid === true
```

---

## Template Auto-Detection

Templates automatically detect the format and handle both:

```javascript
// In Hook1AQuestionBurst_V5_Agnostic.jsx
const isLegacyFormat = !scene.question && scene.fill?.texts;

if (isLegacyFormat) {
  // Auto-convert to new format
  questionConfig = createQuestionFromParts(
    scene.fill.texts.questionPart1,
    scene.fill.texts.questionPart2
  );
} else {
  // Use new format directly
  questionConfig = scene.question;
}
```

---

## Migration Helpers

### Auto-Detect Version
```javascript
import { detectSchemaVersion } from './sdk';

const version = detectSchemaVersion(scene);
// Returns: '5.0' | '5.1' | 'unknown'
```

### Check Agnostic Compatibility
```javascript
import { checkAgnosticCompatibility } from './sdk';

const check = checkAgnosticCompatibility(scene);
console.log(check.compatible); // boolean
console.log(check.recommendations); // migration tips
```

### Auto-Migrate
```javascript
import { autoMigrateToV51 } from './sdk';

const legacyScene = { schema_version: "5.0", fill: {...} };
const migratedScene = autoMigrateToV51(legacyScene);
// Returns v5.1 format scene
```

---

## Error Messages

### Missing Fill (v5.0)
**Error:** `Missing required field: fill (v5.0 schema)`

**Solution:** The `fill` field is now optional. Use either:
- v5.0: `"fill": { "texts": {...} }`
- v5.1: `"question": {...}` and/or `"hero": {...}`

### Mixed Formats
Both formats can coexist in the same scene for transition periods.

---

## Field Mapping

| v5.0 Field | v5.1 Field | Notes |
|------------|-----------|-------|
| `fill.texts.questionPart1` | `question.lines[0]` | Array of line objects |
| `fill.texts.questionPart2` | `question.lines[1]` | Per-line emphasis control |
| (hardcoded in JSX) | `hero.type` | Polymorphic hero system |
| (hardcoded in JSX) | `hero.asset` | Asset path |
| (hardcoded pixels) | Position tokens | 9-point grid system |
| `fill.texts.welcome` | `welcome.text` | Separate welcome config |
| `fill.texts.subtitle` | `subtitle.text` | Separate subtitle config |

---

## Validation Helpers

### Get Friendly Validation Message
```javascript
import { getValidationMessage } from './sdk';

const message = getValidationMessage(scene);
console.log(message);
// ✅ Scene validated successfully (5.1)
// or
// ❌ Scene validation failed:
//   • Missing required fields...
```

### Validate with Migration Hints
```javascript
import { validateWithMigrationHints } from './sdk';

const result = validateWithMigrationHints(scene);

if (!result.valid) {
  console.log('Errors:', result.errors);
  console.log('Migration Tips:', result.info);
}
```

---

## Common Scenarios

### Scenario 1: Legacy Scene Still Works
```json
{
  "schema_version": "5.0",
  "fill": { "texts": { "questionPart1": "...", "questionPart2": "..." } }
}
```
✅ **Works!** Template auto-converts to agnostic format internally.

### Scenario 2: New Agnostic Scene
```json
{
  "schema_version": "5.1",
  "question": { "lines": [...] },
  "hero": { "type": "image", "asset": "/football.jpg" }
}
```
✅ **Works!** Uses agnostic system directly.

### Scenario 3: Gradual Migration
```json
{
  "schema_version": "5.1",
  "fill": { "texts": {...} },
  "hero": { "type": "image", "asset": "/..." }
}
```
✅ **Works!** Can mix formats during transition.

---

## Migration Checklist

When migrating from v5.0 to v5.1:

- [ ] Update `schema_version` to `"5.1"`
- [ ] Convert `fill.texts.questionPart1/2` to `question.lines` array
- [ ] Add `hero` configuration (type, asset, position)
- [ ] Use position tokens instead of hardcoded positions
- [ ] Add `welcome` and `subtitle` objects (optional)
- [ ] Test with agnostic template
- [ ] Remove old `fill` object once confirmed working

---

## Testing Both Formats

```javascript
// Test v5.0
const legacyScene = require('./scenes/hook_1a_knodovia_map_v5.json');
const v50Result = validateSceneCompat(legacyScene);
console.assert(v50Result.valid === true, 'v5.0 should validate');

// Test v5.1
const agnosticScene = require('./scenes/hook_1a_knodovia_agnostic_v5.json');
const v51Result = validateSceneCompat(agnosticScene);
console.assert(v51Result.valid === true, 'v5.1 should validate');
```

---

## Support Matrix

| Template | v5.0 Support | v5.1 Support | Auto-Conversion |
|----------|-------------|-------------|-----------------|
| Hook1AQuestionBurst_V5.jsx | ✅ | ❌ | N/A |
| Hook1AQuestionBurst_V5_Agnostic.jsx | ✅ | ✅ | ✅ |
| Other templates (original) | ✅ | ❌ | N/A |
| Other templates (agnostic) | TBD | TBD | TBD |

---

## Breaking Changes

**None!** The v5.1 system is designed to be 100% backward compatible.

### What Changed
- `fill` field is now **optional** (was required)
- New optional fields added: `question`, `hero`, `welcome`, `subtitle`, `layers`, `lottie`
- Schema validation supports both formats

### What Stayed the Same
- `beats` structure unchanged
- `style_tokens` structure unchanged
- `meta` structure unchanged
- All v5.0 scenes continue to work

---

## Troubleshooting

### Issue: "Missing required field: fill"
**Solution:** Updated schema makes `fill` optional. Ensure you have either:
- `fill.texts` (v5.0)
- `question` or `hero` (v5.1)

### Issue: Scene not rendering
**Check:**
1. Schema validation passes: `validateSceneCompat(scene)`
2. Template supports agnostic format (use `_Agnostic` version)
3. Asset paths are correct for hero images/SVGs

### Issue: Position tokens not working
**Check:**
1. Using agnostic template (`Hook1AQuestionBurst_V5_Agnostic.jsx`)
2. Position format is valid: `"center"` or `{ "grid": "center" }`
3. Check available tokens: `getGridTokens()` from SDK

---

## Questions?

See:
- `/docs/agnosticTemplatePrincipals.md` - Design principals
- `/docs/template-content-blueprints/rigidity_solutions_analysis.md` - Technical analysis
- `/docs/template-content-blueprints/IMPLEMENTATION_ROADMAP.md` - Implementation plan

---

**Status:** ✅ Full backward compatibility maintained
