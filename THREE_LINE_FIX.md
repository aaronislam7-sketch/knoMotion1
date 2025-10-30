# 3-Line Rendering Fix ✅
**Date:** 2025-10-30  
**Issue:** Science variant (3 lines) rendering oddly  
**Status:** FIXED

---

## Issues Found & Fixed

### Issue 1: Arrangement Mismatch
**Problem:**
- JSON used: `"arrangement": "stacked"`
- Code checked for: `arrangement === "vertical"`
- Result: Arrangement logic wasn't working, lines not positioned correctly

**Fix:**
Added normalization in `questionRenderer.js`:
```javascript
// Normalize arrangement: 'stacked' means 'vertical'
const normalizedArrangement = arrangement === 'stacked' ? 'vertical' : arrangement;
```

Now `"stacked"` is properly treated as `"vertical"` for positioning calculations.

### Issue 2: Tight Spacing for 3 Lines
**Problem:**
- 3 lines with `verticalSpacing: 70` looked cramped
- Not enough breathing room between lines

**Fix:**
Increased spacing in science JSON:
```json
"verticalSpacing": 90  // Was 70
```

---

## Science Scene Configuration

**Updated JSON:**
```json
{
  "question": {
    "lines": [
      { "text": "What if atoms", "emphasis": "normal" },
      { "text": "could tell", "emphasis": "normal" },
      { "text": "their stories?", "emphasis": "high" }
    ],
    "layout": {
      "arrangement": "stacked",
      "stagger": 0.4,
      "verticalSpacing": 90,  ✅ Increased from 70
      "basePosition": "center",
      "centerStack": true
    }
  }
}
```

---

## How It Works Now

### 3-Line Positioning Logic

1. **Calculate total height:**
   - Lines: 3
   - Spacing: 90px
   - Total: (3-1) × 90 = 180px

2. **Center the stack:**
   - Base position: center (960, 540)
   - Offset: 180 / 2 = 90px upward
   - Adjusted base: (960, 450)

3. **Position each line:**
   - Line 0: 450 + (0 × 90) = 450
   - Line 1: 450 + (1 × 90) = 540 (center)
   - Line 2: 450 + (2 × 90) = 630

**Result:** 3 lines centered vertically with even spacing ✅

---

## Recommended Spacing by Line Count

| Lines | Recommended Spacing | Total Height |
|-------|-------------------|--------------|
| 1 | N/A | 0 |
| 2 | 80-100px | 80-100px |
| 3 | 90-110px | 180-220px |
| 4 | 70-90px | 210-270px |

---

## Files Modified

1. **`src/sdk/questionRenderer.js`**
   - Added arrangement normalization
   - Now handles 'stacked' as 'vertical'

2. **`src/scenes/hook_1a_science_agnostic_v5.json`**
   - Increased verticalSpacing: 70 → 90

---

## Testing

### Test the Science Scene

1. Load `hook_1a_science_agnostic_v5.json`
2. **Expected results:**
   - ✅ 3 lines render vertically centered
   - ✅ Even spacing between lines (90px)
   - ✅ Staggered entrance animation (0.4s delay)
   - ✅ Lines don't overlap
   - ✅ Text is readable

### Test Other Line Counts

**1 Line (Football):**
- ✅ Should render centered
- ✅ No spacing issues

**2 Lines (Knodovia):**
- ✅ Should render with 80px spacing
- ✅ Properly centered

**3 Lines (Science):**
- ✅ Should render with 90px spacing
- ✅ Properly centered
- ✅ Good breathing room

---

## If Lines Still Look Off

You can adjust these values in the JSON:

### Spacing Too Tight?
```json
"verticalSpacing": 100  // Increase
```

### Spacing Too Loose?
```json
"verticalSpacing": 80  // Decrease
```

### Lines Not Centered?
```json
"centerStack": true  // Ensure this is true
```

### Font Too Large?
```json
"fonts": {
  "size_question": 75  // Reduce from 85
}
```

---

## Custom Positioning (Advanced)

If you want manual control instead of auto-centering:

```json
"layout": {
  "arrangement": "stacked",
  "stagger": 0.4,
  "verticalSpacing": 90,
  "basePosition": {
    "grid": "center",
    "offset": { "x": 0, "y": -90 }  // Manual offset
  },
  "centerStack": false  // Disable auto-center
}
```

---

## Summary

**Before Fix:**
- ❌ 3 lines positioned incorrectly
- ❌ 'stacked' arrangement not recognized
- ❌ Lines too close together

**After Fix:**
- ✅ 3 lines centered properly
- ✅ 'stacked' normalized to 'vertical'
- ✅ Better spacing (90px)
- ✅ Looks great! 🎉

---

**Status:** ✅ 3-LINE RENDERING FIXED

The science variant should now render beautifully with proper vertical centering and spacing!
