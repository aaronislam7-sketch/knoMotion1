# V5 Migration Fixes - Summary

## Issues Fixed ✅

### 1. **Build Error - Missing Legacy Templates**
**Problem**: After v5 migration, code was still importing old v3/v4 templates that no longer exist.

**Files Fixed**:
- `index.html` - Updated path from `/src/main.jsx` to `/KnoMotion-Videos/src/main.jsx`
- `TemplateRouter.jsx` - Removed legacy template imports, updated fallback logic to use v5 templates
- `MultiSceneVideo.jsx` - Replaced legacy template imports with `TemplateRouter` component

### 2. **Scene Renderer Not Displaying**
**Problem**: v5 scenes use different schema - `beats` instead of `duration_s`, `fps`, `layout`

**Files Fixed**:
- `VideoWizard.jsx`:
  - Updated to load v5 scenes by default (hook_1a_knodovia_map_v5.json, etc.)
  - Added schema version detection (checks `schema_version` field)
  - Player configuration now handles both v3 and v5 schemas dynamically
  - Duration calculation works with both `beats.exit` (v5) and `duration_s` (v3)
  
- `MultiSceneVideo.jsx`:
  - Updated scene duration calculation to handle both v3 and v5 schemas
  - Automatically detects schema version and uses appropriate fields

### 3. **JSON Validation Errors**
**Problem**: Validation was expecting v3 schema fields (`duration_s`) but v5 uses `beats`

**Files Fixed**:
- `VideoWizard.jsx`:
  - `handleApplyJSON()` now validates based on schema version
  - v5 validation checks for `beats` and `fill` (not `duration_s`)
  - v3 validation still works for legacy scenes
  
- `scene.schema.ts`:
  - Made v3 fields optional: `duration_s`, `fps`, `layout`, `timeline`
  - Added v5 fields: `beats`, `style_tokens.mode`, `colors.accent2`, `colors.ink`
  - Schema now supports both v3 and v5 scenes

## Schema Differences

### v3 Schema (Legacy)
```json
{
  "schema_version": "3.0",
  "template_id": "hook",
  "duration_s": 12,
  "fps": 30,
  "layout": { "canvas": { "w": 1920, "h": 1080 } },
  "timeline": [...],
  "fill": {...}
}
```

### v5 Schema (Blueprint v5.0)
```json
{
  "schema_version": "5.0",
  "template_id": "Hook1AQuestionBurst",
  "beats": {
    "entrance": 0.6,
    "exit": 15.0
  },
  "fill": {...},
  "style_tokens": {
    "mode": "notebook",
    "colors": {...}
  }
}
```

## Key Changes

1. **Duration Calculation**:
   - v3: `duration_s * fps`
   - v5: `(beats.exit + 0.5) * 30` (30fps standard, 0.5s tail padding)

2. **Canvas Size**:
   - v3: From `layout.canvas.w/h`
   - v5: Fixed 1920×1080 (standard)

3. **FPS**:
   - v3: From `scene.fps`
   - v5: Fixed 30fps (standard)

4. **Template IDs**:
   - v3: `hook`, `explain`, `apply`, `reflect`
   - v5: `Hook1AQuestionBurst`, `Explain2AConceptBreakdown`, etc.

## Default Scenes Now Loaded

The wizard now loads these v5 scenes by default:
- **Hook**: `hook_1a_knodovia_map_v5.json` (Question Burst)
- **Explain**: `explain_2a_breakdown_v5.json` (Concept Breakdown)
- **Apply**: `apply_3a_quiz_v5.json` (Micro Quiz)
- **Reflect**: `reflect_4a_takeaways_v5.json` (Key Takeaways)

## Testing

✅ Build successful: `npm run build`
✅ Dev server starts: `npm run dev`
✅ Scene preview mode works with v5 scenes
✅ Wizard mode works with v5 scenes
✅ Backward compatible with v3 scenes

## Next Steps

You can now:
1. Run `npm run dev` to test the wizard with v5 scenes
2. Edit v5 JSON scenes - validation will check for `beats` instead of `duration_s`
3. Preview individual v5 scenes in Scene Preview mode
4. Create complete videos using all 4 v5 scenes

All v5 templates are available:
- Hook: 1A (Question Burst), 1E (Ambient Mystery)
- Explain: 2A (Concept Breakdown), 2B (Analogy)
- Apply: 3A (Micro Quiz), 3B (Scenario Choice)
- Reflect: 4A (Key Takeaways), 4D (Forward Link)
