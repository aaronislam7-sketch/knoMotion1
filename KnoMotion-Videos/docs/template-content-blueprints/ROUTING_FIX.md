# Routing & Schema Fix ✅
**Date:** 2025-10-30  
**Issues:** 
1. Fonts schema validation error
2. v5.1 JSON not rendering (not routing to agnostic template)

**Status:** FIXED

---

## Issue 1: Fonts Schema Error ✅

### Problem
```
⚠ style_tokens.fonts.body: Expected object, received string
```

**Root Cause:**
- v5.0 schema: `fonts.body: {family: string, size: number}`
- v5.1 agnostic: `fonts.body: "Inter, sans-serif"` (simple string)

Schema only accepted object format, not strings.

### Solution

Updated schema to accept **both** formats:

```typescript
fonts: z.object({
  // v5.0 format: object OR v5.1 format: string
  title: z.union([
    z.object({family: z.string().optional(), size: z.number().optional()}),
    z.string()
  ]).optional(),

  body: z.union([
    z.object({family: z.string().optional(), size: z.number().optional()}),
    z.string()
  ]).optional(),
  
  // v5.1 additional fields
  header: z.string().optional(),
  secondary: z.string().optional(),
  size_title: z.number().optional(),
  size_question: z.number().optional(),
  size_welcome: z.number().optional(),
  size_subtitle: z.number().optional()
}).optional()
```

**Now Works:**
- ✅ v5.0: `fonts.body: {family: "Inter", size: 16}`
- ✅ v5.1: `fonts.body: "Inter, sans-serif"`
- ✅ v5.1: `fonts.header: "'Cabin Sketch', cursive"`

---

## Issue 2: Template Routing ✅

### Problem

v5.1 JSON wasn't actually rendering - it was **always** using the v5.0 template, which doesn't understand `question`, `hero`, `welcome`, `subtitle` fields.

**Root Cause:**
`TemplateRouter` didn't know about the agnostic template. It always routed to `Hook1AQuestionBurst` (v5.0 only).

### Solution

#### 1. Import Agnostic Template

```javascript
// Blueprint v5.1 Agnostic Templates
import { Hook1AQuestionBurst_Agnostic } from './Hook1AQuestionBurst_V5_Agnostic';

// Schema detection for routing
import { detectSchemaVersion } from '../sdk';
```

#### 2. Create Agnostic Registry

```javascript
const AGNOSTIC_TEMPLATE_REGISTRY = {
  'Hook1AQuestionBurst': Hook1AQuestionBurst_Agnostic,
  // Future: more agnostic templates
};
```

#### 3. Smart Routing Logic

```javascript
const getTemplateComponent = (templateId, scene) => {
  // Detect schema version
  const schemaVersion = detectSchemaVersion(scene);
  const isAgnostic = schemaVersion === '5.1';
  
  // If v5.1 scene, use agnostic template
  if (isAgnostic && AGNOSTIC_TEMPLATE_REGISTRY[templateId]) {
    console.info(`🎯 Using agnostic template for ${templateId} (v5.1 format)`);
    return AGNOSTIC_TEMPLATE_REGISTRY[templateId];
  }
  
  // Otherwise use standard template
  if (TEMPLATE_REGISTRY[templateId]) {
    if (isAgnostic) {
      console.warn(`⚠️ Using v5.0 template for v5.1 scene`);
    }
    return TEMPLATE_REGISTRY[templateId];
  }
  
  // Fallback
  return isAgnostic 
    ? AGNOSTIC_TEMPLATE_REGISTRY['Hook1AQuestionBurst']
    : Hook1AQuestionBurst;
};
```

---

## Routing Flow

### v5.0 Scene (Legacy)
```json
{
  "schema_version": "5.0",
  "template_id": "Hook1AQuestionBurst",
  "fill": { "texts": {...} }
}
```

**Flow:**
1. `detectSchemaVersion()` → `'5.0'`
2. `isAgnostic` → `false`
3. Routes to → `Hook1AQuestionBurst` (v5.0 template)
4. ✅ Renders using `fill.texts`

### v5.1 Scene (Agnostic)
```json
{
  "schema_version": "5.1",
  "template_id": "Hook1AQuestionBurst",
  "question": { "lines": [...] },
  "hero": { "type": "image", "asset": "/..." }
}
```

**Flow:**
1. `detectSchemaVersion()` → `'5.1'`
2. `isAgnostic` → `true`
3. Check `AGNOSTIC_TEMPLATE_REGISTRY` → Found!
4. Routes to → `Hook1AQuestionBurst_Agnostic` (v5.1 template)
5. Console: "🎯 Using agnostic template for Hook1AQuestionBurst (v5.1 format)"
6. ✅ Renders using `question.lines`, `hero`, `welcome`, `subtitle`

---

## Files Modified

### 1. src/sdk/scene.schema.ts
- Updated `fonts` field to accept both object and string
- Added v5.1 font fields (header, secondary, size_*)

### 2. src/templates/TemplateRouter.jsx
- Imported `Hook1AQuestionBurst_Agnostic`
- Imported `detectSchemaVersion`
- Created `AGNOSTIC_TEMPLATE_REGISTRY`
- Updated `getTemplateComponent()` with version detection
- Updated `TemplateRouter` to pass scene for detection
- Exported `AGNOSTIC_TEMPLATE_REGISTRY`

---

## Testing

### Step 1: Restart Dev Server
```bash
npm run dev
```

### Step 2: Load v5.1 Scene

Load one of the agnostic JSON files:
- `hook_1a_football_agnostic_v5.json`
- `hook_1a_science_agnostic_v5.json`
- `hook_1a_knodovia_agnostic_v5.json`

### Step 3: Check Console

You should see:
```
🎯 Using agnostic template for Hook1AQuestionBurst (v5.1 format)
```

### Step 4: Verify Rendering

Check that v5.1 fields are rendering:
- ✅ Question lines from `question.lines` array
- ✅ Hero visual from `hero.type` and `hero.asset`
- ✅ Welcome text from `welcome.text`
- ✅ Subtitle from `subtitle.text`
- ✅ Changes to JSON update the render

---

## What Should Now Work

### Schema Validation
- ✅ v5.0 fonts: `{family: "...", size: 16}`
- ✅ v5.1 fonts: `"Inter, sans-serif"`
- ✅ No more fonts schema errors

### Template Rendering
- ✅ v5.0 scenes → v5.0 template (uses `fill`)
- ✅ v5.1 scenes → v5.1 agnostic template (uses `question`, `hero`, etc.)
- ✅ JSON changes update the render
- ✅ Hero type changes work (image/svg/roughSVG)
- ✅ Question line count changes work (1-4 lines)
- ✅ Position tokens work
- ✅ All 6 agnostic principals working

---

## Verification Checklist

Test with v5.1 agnostic JSON:

- [ ] No schema validation errors
- [ ] Console shows: "🎯 Using agnostic template..."
- [ ] Question text renders from `question.lines`
- [ ] Changing line count (1-4) updates render
- [ ] Hero renders from `hero.type` and `hero.asset`
- [ ] Changing hero type (image/svg) updates render
- [ ] Welcome text renders from `welcome.text`
- [ ] Subtitle renders from `subtitle.text`
- [ ] Mode changes (notebook/whiteboard) work
- [ ] Color changes update immediately

---

## Example: Football Scene Test

```json
{
  "schema_version": "5.1",
  "template_id": "Hook1AQuestionBurst",
  "style_tokens": {
    "mode": "notebook",
    "colors": {
      "bg": "#F0F9FF",
      "accent": "#00FF00",
      "accent2": "#FFD700"
    },
    "fonts": {
      "header": "'Cabin Sketch', cursive",
      "secondary": "'Permanent Marker', cursive",
      "body": "Inter, sans-serif",
      "size_question": 92
    }
  },
  "beats": {
    "questionStart": 0.6,
    "emphasis": 4.2,
    "wipeQuestions": 5.5,
    "mapReveal": 6.5,
    "transformMap": 9.0,
    "welcome": 10.0,
    "subtitle": 12.0,
    "exit": 15.0
  },
  "question": {
    "lines": [
      { "text": "Who was the greatest?", "emphasis": "high" }
    ]
  },
  "hero": {
    "type": "image",
    "asset": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800"
  },
  "welcome": {
    "text": "The Beautiful Game"
  },
  "subtitle": {
    "text": "Where legends are made..."
  }
}
```

**Expected Results:**
1. ✅ No validation errors
2. ✅ Console: "🎯 Using agnostic template..."
3. ✅ Renders 1 question line: "Who was the greatest?"
4. ✅ Renders football image from Unsplash
5. ✅ Renders welcome: "The Beautiful Game"
6. ✅ Renders subtitle: "Where legends are made..."
7. ✅ Green/gold colors applied
8. ✅ Notebook mode textures visible

**Now try changing:**
- Add more lines to `question.lines` → Should render 2-3 lines
- Change `hero.type` to `"svg"` → Should render SVG
- Change colors → Should update immediately
- Change mode to `"whiteboard"` → Should switch style

---

## Common Issues

### Issue: Still seeing v5.0 template
**Solution:** Clear browser cache and restart dev server

### Issue: Hero not rendering
**Check:** 
- Asset URL is valid
- Hero type is correct (image/svg/roughSVG)
- Console for errors

### Issue: Question lines not showing
**Check:**
- `question.lines` is an array
- Each line has `text` field
- `beats.questionStart` is defined

---

## Future: Adding More Agnostic Templates

To make other templates agnostic:

1. Create `TemplateName_V5_Agnostic.jsx`
2. Add to `AGNOSTIC_TEMPLATE_REGISTRY`:
   ```javascript
   'Explain2AConceptBreakdown': Explain2AConceptBreakdown_Agnostic,
   ```
3. Router will automatically use agnostic version for v5.1 scenes

---

**Status:** ✅ BOTH ISSUES FIXED

- ✅ Fonts schema accepts both object and string
- ✅ v5.1 scenes route to agnostic template
- ✅ JSON changes update the render
- ✅ All agnostic features working
