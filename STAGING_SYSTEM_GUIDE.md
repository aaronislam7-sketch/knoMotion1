# 🧪 Staging System - Complete Guide

**Date:** 2025-11-12  
**Status:** ✅ **ACTIVE - Ready to Use**  
**Purpose:** Review new/updated templates before production release  

---

## 📋 Overview

The staging system provides a separate area for reviewing templates under development before they go live in the production gallery. It looks and functions identically to the production gallery but displays only templates marked for review.

---

## ✨ Features

### 1. **Separate Catalogs**
- **Production Catalog** (`TEMPLATE_CATALOG`): 17+ live, tested templates
- **Staging Catalog** (`STAGING_CATALOG`): Templates under review

### 2. **Easy Toggle**
- Click `🧪 Staging` button in Template Gallery header to switch modes
- Click `🎨 Production` to return to main gallery
- **Visual Distinction:**
  - Production: Green header (🎨 Template Gallery)
  - Staging: Pink header (🧪 Staging Area)

### 3. **Visual Indicators**
- **Staging Badge:** Pink `🧪 STAGING` badge on template cards in staging mode
- **Color Coding:** Staging templates use `#FF0099` pink color scheme
- **Version Tags:** Templates show `v6.2-STAGING` or similar

### 4. **Identical Functionality**
- Same filtering by learning intention
- Same grid/list view options
- Same configuration panels
- Same live preview
- Same JSON export

---

## 🚀 Quick Start

### **For Users - Reviewing Templates**

1. **Open the app:**
   ```bash
   cd KnoMotion-Videos
   npm run dev
   ```

2. **Switch to staging mode:**
   - Look for Template Gallery header (green)
   - Click `🧪 Staging` button
   - Header turns pink, shows "🧪 Staging Area"

3. **Review templates:**
   - Browse staging templates (just like production)
   - Click to select and configure
   - Preview in real-time
   - Test all features

4. **Approve or reject:**
   - If approved → Developer moves to production catalog
   - If rejected → Developer makes revisions

---

### **For Developers - Adding Templates to Staging**

#### **Step 1: Add Template to STAGING_CATALOG**

**File:** `/src/components/TemplateGallery.jsx`

**Add entry:**
```javascript
const STAGING_CATALOG = [
  {
    id: 'STAGING_YourTemplate_V6_Upgraded',  // Always prefix with STAGING_
    name: '🧪 Your Template - Interactive Revelation',
    intentions: { primary: 'QUESTION', secondary: ['CHALLENGE', 'REVEAL'] },
    description: '🎬 UPGRADED: New feature 1, new feature 2, new feature 3',
    duration: '11-13s',
    icon: '❓',
    color: '#FF0099',  // Always use pink for staging
    version: 'v6.2-STAGING',  // Always suffix with -STAGING
    isNew: true,
    isStaging: true,  // CRITICAL: Mark as staging
    hasConfig: true,
    features: [  // Optional: List new features
      'Feature 1 description',
      'Feature 2 description',
      'Feature 3 description'
    ]
  },
  // Add more staging templates here
];
```

**Important:**
- ✅ Always prefix `id` with `STAGING_`
- ✅ Always set `isStaging: true`
- ✅ Always use `#FF0099` pink color
- ✅ Version should end with `-STAGING`
- ✅ Use 🧪 emoji in name

---

#### **Step 2: Create Example Scene JSON**

**File:** `/src/scenes/examples/your_template_upgraded_example.json`

**Example:**
```json
{
  "schema_version": "6.0",
  "scene_id": "your_template_upgraded_example",
  "template_id": "STAGING_YourTemplate_V6_Upgraded",
  
  "meta": {
    "title": "Your Template - Upgraded",
    "description": "Demonstrates new features...",
    "tags": ["staging", "upgraded"]
  },
  
  // ... rest of your config showcasing all new features
}
```

**Important:**
- ✅ `template_id` must match STAGING_CATALOG `id`
- ✅ Include all new features in the config
- ✅ Add comprehensive comments/descriptions

---

#### **Step 3: Import Scene in UnifiedAdminConfig**

**File:** `/src/components/UnifiedAdminConfig.jsx`

**Add import:**
```javascript
// Import STAGING scenes (Templates under review)
import stagingYourTemplate from '../scenes/examples/your_template_upgraded_example.json';
```

**Add to DEFAULT_SCENES:**
```javascript
const DEFAULT_SCENES = {
  // ... existing scenes
  
  // STAGING: Templates Under Review
  'STAGING_YourTemplate_V6_Upgraded': stagingYourTemplate
};
```

---

#### **Step 4: Map Template in TemplateRouter**

**File:** `/src/templates/TemplateRouter.jsx`

**Add to V6_TEMPLATE_REGISTRY:**
```javascript
const V6_TEMPLATE_REGISTRY = {
  // ... existing templates
  
  // STAGING: Templates Under Review (use existing components with upgraded scenes)
  'STAGING_YourTemplate_V6_Upgraded': YourTemplate_V6  // Map to actual component
};
```

**Note:** If using same component with just upgraded config, map to existing component. If new component, import and map accordingly.

---

#### **Step 5: Build & Test**

**Build:**
```bash
cd KnoMotion-Videos
npm run build
```

**Test:**
```bash
npm run dev
# 1. Click 🧪 Staging button
# 2. Verify your template appears
# 3. Select and test all features
# 4. Verify config panel works
# 5. Test live preview
# 6. Export JSON and verify
```

---

## 🎯 Current Staging Templates

### 1. **STAGING_Hook1AQuestionBurst_V6_Upgraded**

**Status:** Ready for Review  
**Scene:** `hook_1a_upgraded_example.json`  
**Component:** `Hook1AQuestionBurst_V6`  

**New Features:**
- ✅ Scene transformation (background shifts mid-scene)
- ✅ Corner icons (contextual emojis with questions)
- ✅ Connecting lines (dotted lines between icons)
- ✅ Doodle underline effects (hand-drawn wavy underlines)
- ✅ Supporting text labels (3 labels around central visual)
- ✅ Selective glassmorphic panes (Q1 bare, Q2 glass for contrast)

**Rubric Score:** 4.6/5
- Polish: 5/5
- Branding: 4/5
- Configurability: 5/5
- Standardisation: 4/5
- Scale: 5/5

**Review Checklist:**
- [ ] Scene transformation animates smoothly
- [ ] Corner icons appear with correct timing
- [ ] Connecting lines draw cleanly
- [ ] Doodle underline looks hand-drawn
- [ ] Supporting text labels are readable
- [ ] Glassmorphic panes toggle correctly
- [ ] All config options work
- [ ] Performance is 60fps
- [ ] No console errors

**Approval Decision:** [ ] Approve for production [ ] Request changes

---

## 📝 Approval Workflow

### **Step 1: Review in Staging**

**Checklist:**
- [ ] Visual quality (broadcast-level polish)
- [ ] All features work as expected
- [ ] Config panel exposes all options
- [ ] Performance (60fps, no jank)
- [ ] No console errors
- [ ] Documentation exists (UPGRADE_ANALYSIS.md, etc.)
- [ ] Example scene demonstrates all features

---

### **Step 2: Decision**

**Option A: Approve for Production**
1. Move entry from `STAGING_CATALOG` to `TEMPLATE_CATALOG`
2. Remove `STAGING_` prefix from `id`
3. Remove `isStaging: true` flag
4. Change `color` from `#FF0099` to appropriate color
5. Update `version` to remove `-STAGING` suffix
6. Update `template_id` in scene JSON
7. Update mappings in UnifiedAdminConfig and TemplateRouter
8. Test in production mode
9. Commit changes

**Option B: Request Changes**
1. Document feedback (create FEEDBACK.md)
2. Assign to developer
3. Keep in staging catalog
4. Developer makes revisions
5. Re-test and re-review

---

## 🔧 File Locations

### **Files Modified for Staging System:**

1. **TemplateGallery.jsx**
   - Added `STAGING_CATALOG` (line 339-364)
   - Added `stagingMode` state (line 393)
   - Added staging toggle button (line 449-470)
   - Added staging badge rendering (line 635-651)
   - Updated catalog selection logic (line 396)
   - Updated header styling (line 425-443)

2. **UnifiedAdminConfig.jsx**
   - Added staging scene import (line 72)
   - Added staging scene to DEFAULT_SCENES (line 114)

3. **TemplateRouter.jsx**
   - Added staging template mapping (line 122-123)

4. **Example Scenes:**
   - `/scenes/examples/hook_1a_upgraded_example.json` (staging scene)

---

## 💡 Best Practices

### **Naming Conventions**

**Template IDs:**
- Production: `Hook1AQuestionBurst_V6`
- Staging: `STAGING_Hook1AQuestionBurst_V6_Upgraded`
- TEST: `TEST_Hook1AQuestionBurst_V6` (for TEST templates)

**Version Tags:**
- Production: `v6.0`, `v6.1`, `v6.2`
- Staging: `v6.2-STAGING`, `v6.3-STAGING`
- TEST: `v6.0-REVISED`, `v6.0-TEST`

**Colors:**
- Production: Template-specific (varies)
- Staging: `#FF0099` (pink)
- TEST: `#FF0099` (pink, same as staging)

---

### **Scene JSON Organization**

**Directory Structure:**
```
/scenes/
  /examples/          ← Example scenes for all templates
    hook_1a_upgraded_example.json   ← STAGING
    compare_11_example.json          ← PRODUCTION
  /v6/                ← Production V6 scenes
    hook_1a_question_burst_v6.json
  /archive_v5/        ← Archived V5 scenes
```

**Naming Pattern:**
- Staging: `{template}_upgraded_example.json`
- Production: `{template}_example.json` or `{template}_v6.json`

---

### **Documentation**

**For Each Staging Template, Create:**

1. **UPGRADE_ANALYSIS.md** - Comprehensive analysis document
   - Diagnosis of blockers
   - Proposed strategies
   - Scene-by-scene storyboard
   - Implementation plan
   - Self-critique rubric

2. **IMPLEMENTATION_SUMMARY.md** - Technical summary
   - Deliverables created
   - SDK utilities added
   - Code changes
   - Testing results

3. **STAGING_REVIEW_CHECKLIST.md** (optional) - Review checklist
   - Visual tests
   - Functional tests
   - Performance tests
   - Approval decision

---

## 🚀 Promotion to Production

### **When Approved:**

**Step 1: Update TemplateGallery.jsx**

Move from staging to production catalog:

```javascript
// FROM:
const STAGING_CATALOG = [
  {
    id: 'STAGING_Hook1AQuestionBurst_V6_Upgraded',
    name: '🧪 Question Burst V6 - Interactive Revelation',
    isStaging: true,
    color: '#FF0099',
    version: 'v6.2-STAGING'
  }
];

// TO:
const TEMPLATE_CATALOG = [
  // ... existing templates
  {
    id: 'Hook1AQuestionBurst_V6_InteractiveRevelation',  // Remove STAGING_ prefix
    name: 'Question Burst V6 - Interactive Revelation',  // Remove 🧪 emoji
    isStaging: false,  // Or remove this line
    color: '#FF6B35',  // Change to appropriate color
    version: 'v6.2'    // Remove -STAGING suffix
  }
];
```

---

**Step 2: Update Scene JSON**

**File:** `/scenes/examples/hook_1a_upgraded_example.json`

Change:
```json
{
  "template_id": "STAGING_Hook1AQuestionBurst_V6_Upgraded"
}
```

To:
```json
{
  "template_id": "Hook1AQuestionBurst_V6_InteractiveRevelation"
}
```

Or move to production scenes folder:
```bash
mv scenes/examples/hook_1a_upgraded_example.json scenes/v6/hook_1a_interactive_revelation_v6.json
```

---

**Step 3: Update UnifiedAdminConfig.jsx**

Update import and mapping:

```javascript
// Update import
import hook1AInteractiveRevelation from '../scenes/v6/hook_1a_interactive_revelation_v6.json';

// Update DEFAULT_SCENES
const DEFAULT_SCENES = {
  'Hook1AQuestionBurst_V6_InteractiveRevelation': hook1AInteractiveRevelation
};
```

---

**Step 4: Update TemplateRouter.jsx**

```javascript
const V6_TEMPLATE_REGISTRY = {
  'Hook1AQuestionBurst_V6_InteractiveRevelation': Hook1AQuestionBurst_V6
};
```

---

**Step 5: Test in Production Mode**

```bash
npm run build
npm run dev
# 1. Stay in production mode (don't click staging)
# 2. Verify template appears in production gallery
# 3. Test all features
# 4. Verify no regressions
```

---

**Step 6: Commit & Deploy**

```bash
git add -A
git commit -m "Promote Hook1A Interactive Revelation to production

- Moved from staging to production catalog
- Updated template IDs and version tags
- Removed staging flags
- Tested all features in production mode

Rubric score: 4.6/5
Ready for production use."

git push origin main
```

---

## 🔒 Staging Access Control (Future Enhancement)

**Current:** Staging button visible to all users  
**Future Options:**

1. **Environment Variable:**
   ```javascript
   const showStaging = process.env.REACT_APP_SHOW_STAGING === 'true';
   ```

2. **User Role Check:**
   ```javascript
   const showStaging = currentUser?.role === 'admin' || currentUser?.role === 'developer';
   ```

3. **URL Parameter:**
   ```javascript
   const showStaging = new URLSearchParams(window.location.search).get('staging') === 'true';
   ```

**Implementation:** Add conditional rendering around staging button.

---

## 📊 Staging Metrics

**Track:**
- Number of templates in staging
- Average time in staging (days)
- Approval rate (%)
- Common rejection reasons

**Dashboard (Future):**
```
Staging Templates: 1
Avg Review Time: 2 days
Approval Rate: 95%
```

---

## ❓ FAQs

### **Q: Can I have the same template in both staging and production?**
A: Yes! Use different `id`s (e.g., `Hook1A_V6` in production, `STAGING_Hook1A_V6_Upgraded` in staging). They can use the same component.

### **Q: Can I test staging templates in production mode?**
A: No, staging templates only appear when clicking the "🧪 Staging" button.

### **Q: How do I delete a staging template?**
A: Remove it from `STAGING_CATALOG`, `DEFAULT_SCENES`, and `V6_TEMPLATE_REGISTRY`. Clean up the scene JSON file.

### **Q: Can I have multiple versions of a template in staging?**
A: Yes! Use different suffixes (e.g., `STAGING_Hook1A_V1`, `STAGING_Hook1A_V2`).

### **Q: What happens if staging template `id` conflicts with production?**
A: Router will use V6_TEMPLATE_REGISTRY order (first match wins). Always use `STAGING_` prefix to avoid conflicts.

---

## ✅ Staging System Checklist

**Initial Setup:** ✅ Complete
- [x] STAGING_CATALOG created
- [x] Staging toggle button added
- [x] Visual distinction (pink header)
- [x] Staging badges on cards
- [x] Hook1A upgraded template added to staging
- [x] Scene JSON created
- [x] UnifiedAdminConfig updated
- [x] TemplateRouter updated
- [x] Documentation created

**For Each New Staging Template:**
- [ ] Add to STAGING_CATALOG
- [ ] Create example scene JSON
- [ ] Import scene in UnifiedAdminConfig
- [ ] Map template in TemplateRouter
- [ ] Build and test
- [ ] Create documentation (UPGRADE_ANALYSIS.md)
- [ ] Request review
- [ ] Complete review checklist
- [ ] Approve or request changes
- [ ] (If approved) Promote to production

---

## 🎉 Summary

The staging system provides a **professional workflow** for reviewing templates before production release:

- ✅ **Separate staging area** (toggle between production/staging)
- ✅ **Visual distinction** (pink header, staging badges)
- ✅ **Identical functionality** (same features as production)
- ✅ **Easy promotion** (move from staging to production catalog)
- ✅ **Documentation** (comprehensive guides and checklists)

**Current Status:** 1 template in staging (Hook1A Interactive Revelation)

**Next Steps:** Review Hook1A, approve or request changes, then add more templates to staging.

---

**Document Version:** 1.0  
**Date:** 2025-11-12  
**Status:** ✅ **ACTIVE**  
**Maintained By:** Development Team
