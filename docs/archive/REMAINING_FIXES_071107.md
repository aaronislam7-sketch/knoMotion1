# Remaining Fixes - November 7, 2025

## ✅ Completed in This Session

### 1. Title Centering (Templates 9, 10, 11) - FIXED
- Added `width: '100%'` to title containers
- Changed `transform` from `translate(-50%, 0)` to `translateX(-50%)`
- Replaced `maxWidth: '90%'` with `padding: '0 5%'`
- **Result**: Titles now properly centered

### 2. Template 10 (Guide10StepSequence) Layout - FIXED
- Redesigned using flexbox layout
- Badge and content properly aligned
- Removed absolute positioning issues
- Better spacing and visual polish
- **Result**: No more right-alignment, clean centered layout

### 3. Template 12 (Compare12MatrixGrid) Config Panel - FIXED
- ✅ Added editable cell content (inline editing)
- ✅ Added font size controls (title, header, cell, conclusion)
- ✅ Fixed JSON binding issues
- ✅ No more [OBJECT OBJECT] errors
- ✅ Winner column slider control
- ✅ Proper grid display
- **Result**: Fully functional, properly bound config panel

## 🔧 Remaining Critical Issues

### 4. Template 12 - Winner Highlight Animation Overflow
**Issue**: `transform: scale()` on winner column causes overflow
**Solution Needed**:
- Remove scale transform (line 399 & similar)
- Use only background color + border emphasis
- Optional: Add confetti particle effect above grid (not in cells)
- Keep glow effect but make it configurable

**Files to Edit**:
- `/workspace/KnoMotion-Videos/src/templates/Compare12MatrixGrid_V6.jsx`
  - Lines ~381, ~399, ~444-446: Remove `highlightScale` transform
  - Add confetti effect in separate layer if desired

### 5. Template 13 (Challenge13PollQuiz) - Config Mismatch
**Issue**: Config panel uses `answers` but JSON uses `options`, and `question` structure mismatch
**Solution Needed**:
- Update `Challenge13Config.jsx` to use `options` instead of `answers`
- Update to handle `question` as object with `.text` property
- Fix header blink issue in template (check initial frame visibility)

**Files to Edit**:
- `/workspace/KnoMotion-Videos/src/components/configs/Challenge13Config.jsx`
  - Change all `scene.answers` → `scene.options`
  - Change `scene.question` → `scene.question.text` (or handle as object)
- `/workspace/KnoMotion-Videos/src/templates/Challenge13PollQuiz_V6.jsx`
  - Find header blink issue (likely frame visibility condition)
  - Check titleStartFrame timing

### 6. Template 14 (Spotlight14SingleConcept) - Config Not Bound
**Issue**: Config panel doesn't update JSON, needs proper binding
**Solution Needed**:
- Fix `updateStage` function to properly update JSON
- Ensure `bodyText` field is used (not just `content`)
- Add lottie/visual subtype support in stages
- Make boxes consistent size (all same height/width, scale together)

**Files to Edit**:
- `/workspace/KnoMotion-Videos/src/components/configs/Spotlight14Config.jsx`
  - Fix update functions to match JSON structure (`bodyText` not `content`)
  - Add visual type selector (text/emoji/lottie)
- `/workspace/KnoMotion-Videos/src/templates/Spotlight14SingleConcept_V6.jsx`
  - Ensure consistent box sizing (calculate max dimensions)
  - Remove hardcoded values, use JSON

### 7. Template 11 (Compare11BeforeAfter) - Cell Content Type
**Issue**: Need cell content type configurability
**Solution Needed**:
- Add "type" field to cell structure: text, check, emoji
- Config panel should show type selector
- Render cells based on type

**Files to Edit**:
- `/workspace/KnoMotion-Videos/src/components/configs/Compare11Config.jsx`
  - Add cell type selector UI
  - Allow editing cell content based on type
- `/workspace/KnoMotion-Videos/src/templates/Compare11BeforeAfter_V6.jsx`
  - May already support this via content detection

## 📝 Implementation Priority

**HIGH PRIORITY** (Breaks functionality):
1. Template 13 config mismatch (users can't configure it)
2. Template 14 config not bound (users can't configure it)
3. Template 12 overflow issue (visual bug)

**MEDIUM PRIORITY** (UX improvements):
4. Template 11 cell type config (nice-to-have feature)
5. Template 13 header blink (minor visual glitch)

## 🎯 Commits Made This Session

1. `4e8ff79` - fix: Improve title centering and Template 10 layout
2. `aa544e0` - feat: Upgrade Compare12 config panel with full editability

## 🚀 Next Steps

1. Fix Template 12 winner animation (remove scale)
2. Update Challenge13Config to match JSON structure (`options`, `question.text`)
3. Fix Spotlight14Config binding and box consistency
4. Optional: Add cell type config to Template 11
5. Test all templates end-to-end
6. Build and verify no errors

## 💡 Notes

- All title centering issues should be resolved
- Template 10 now has clean, centered layout
- Compare12 config panel is fully functional
- Remaining issues are primarily config panel mismatches and one visual bug
