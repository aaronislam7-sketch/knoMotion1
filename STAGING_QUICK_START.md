# 🚀 Staging System - Quick Start Guide

**For Users Who Want to Get Started Immediately**

---

## 🎯 What Is This?

A **staging area** for reviewing new/updated video templates before they go live.

**Think of it like:**
- YouTube's "Unlisted" videos (visible only when you have the link)
- GitHub's "Draft" pull requests (visible but not merged)
- App Store's "TestFlight" (visible to testers, not public)

---

## ⚡ 30-Second Start

### **Step 1: Start the App**
```bash
cd KnoMotion-Videos
npm run dev
```

### **Step 2: Open in Browser**
Browser opens automatically to `http://localhost:3000`

### **Step 3: Click Staging Button**
Look for the green Template Gallery header.  
Click the **"🧪 Staging"** button on the right.

**That's it!** You're now in staging mode. 🎉

---

## 🖼️ Visual Guide

### **Production Mode (Default)**

```
┌─────────────────────────────────────────────────────────┐
│  🎨 Template Gallery (17)          [🧪 Staging] [📋 List]│
│  ────────────────────────────────────────────────────────│
│  Green Header (#4CAF50)                                   │
│                                                           │
│  Shows 17+ production templates                           │
│  All tested, stable, ready for use                        │
└─────────────────────────────────────────────────────────┘
```

**What You See:**
- Green header with 🎨 icon
- Button says "🧪 Staging"
- 17+ templates in grid
- All production-ready

---

### **Staging Mode (After Clicking Button)**

```
┌─────────────────────────────────────────────────────────┐
│  🧪 Staging Area (1)            [🎨 Production] [📋 List]│
│  ────────────────────────────────────────────────────────│
│  Pink Header (#FF0099)                                    │
│                                                           │
│  Shows 1 staging template                                 │
│  New features, under review                               │
└─────────────────────────────────────────────────────────┘
```

**What You See:**
- Pink header with 🧪 icon
- Button says "🎨 Production"
- 1 template in grid (Hook1A upgraded)
- Pink staging badge on card

---

## 🎮 How to Use

### **Review a Staging Template**

**Step 1: Switch to Staging**
- Click **"🧪 Staging"** button in gallery header

**Step 2: Select Template**
- See: **"🧪 Question Burst V6 - Interactive Revelation"**
- Click on the card

**Step 3: Configure & Preview**
- Config panel opens on right
- Adjust any settings
- Preview updates in real-time

**Step 4: Test Features**
Try all the new features:
- ✅ Scene transformation (background shifts at beat 5.5s)
- ✅ Corner icons (3 emojis appear in corners)
- ✅ Connecting lines (dotted lines between icons)
- ✅ Doodle underline (wavy line under question 1)
- ✅ Supporting text labels (3 labels around visual)
- ✅ Glassmorphic panes (toggle on Q2, off on Q1)

**Step 5: Make Decision**
- **Approve?** → Tell developer to promote to production
- **Changes needed?** → Document feedback, request revisions

---

## 🎨 What's Different in Staging?

### **Visual Differences**

| Element | Production | Staging |
|---------|-----------|---------|
| Header Color | Green (#4CAF50) | Pink (#FF0099) |
| Header Icon | 🎨 | 🧪 |
| Header Text | Template Gallery | Staging Area |
| Button Text | 🧪 Staging | 🎨 Production |
| Template Badge | None | 🧪 STAGING (pink) |
| Template Count | 17+ | 1 |

### **Functional Differences**

**None!** Everything works the same:
- ✅ Template selection
- ✅ Configuration panel
- ✅ Live preview
- ✅ JSON export
- ✅ Filtering by intention
- ✅ Grid/List view toggle

---

## 📱 UI Tour

### **Production Gallery Header**

```
┌──────────────────────────────────────────────────────────────┐
│  🎨 Template Gallery (17)    [🧪 Staging] [📋 List]  [▼]     │
└──────────────────────────────────────────────────────────────┘
    ↑                             ↑            ↑        ↑
    Icon + Title            Staging Toggle  View Toggle  Collapse
    (Green)                 (Click to enter)
```

### **Staging Gallery Header**

```
┌──────────────────────────────────────────────────────────────┐
│  🧪 Staging Area (1)       [🎨 Production] [📋 List]  [▼]    │
└──────────────────────────────────────────────────────────────┘
    ↑                             ↑            ↑        ↑
    Icon + Title            Return to Prod  View Toggle  Collapse
    (Pink)                  (Click to exit)
```

### **Staging Template Card**

```
┌────────────────────────────────────────────────┐
│ 🧪 STAGING              ✓ SELECTED             │  ← Badges
│                                                 │
│  ❓                                             │  ← Icon
│  🧪 Question Burst V6 - Interactive Revelation │  ← Name
│  v6.2-STAGING • 11-13s                         │  ← Version/Duration
│                                                 │
│  🎬 UPGRADED: Scene transformation, corner     │  ← Description
│  icons, connecting lines, doodle effects...    │
│                                                 │
│  🎯 QUESTION  ⚡ CHALLENGE  🎭 REVEAL          │  ← Intentions
│                                                 │
│  ⚙️ Interactive Config Available               │  ← Config Badge
└────────────────────────────────────────────────┘
```

**Pink glow around "🧪 STAGING" badge**

---

## 🧪 Current Staging Template

### **Template:** Hook1A Question Burst - Interactive Revelation

**What's New:**
1. **Scene Transformation** - Background changes color mid-scene
2. **Corner Icons** - 3 emojis appear in screen corners with questions
3. **Connecting Lines** - Animated dotted lines connect icons
4. **Doodle Underline** - Hand-drawn wavy underline on Q1
5. **Supporting Text** - 3 floating labels around central visual
6. **Selective Glass Panes** - Q1 bare, Q2 with glassmorphic background

**Test Checklist:**
- [ ] Scene transformation animates smoothly at 5.5s
- [ ] 3 corner icons appear with correct timing
- [ ] Connecting lines draw cleanly between icons
- [ ] Doodle underline looks hand-drawn and organic
- [ ] Supporting text labels are readable
- [ ] Glassmorphic pane toggles correctly (enabled: Q2, disabled: Q1)
- [ ] All config options work (colors, fonts, timing, effects)
- [ ] Performance is 60fps with no dropped frames
- [ ] No console errors

**Expected Rubric Score:** 4.6/5
- Polish: 5/5
- Branding: 4/5
- Configurability: 5/5
- Standardization: 4/5
- Scale: 5/5

---

## 🔄 Switching Between Modes

### **Production → Staging**

**Action:** Click **"🧪 Staging"** button  

**What Happens:**
1. Header turns pink
2. Title changes to "🧪 Staging Area"
3. Button changes to "🎨 Production"
4. Gallery shows staging templates (1)
5. Filter is cleared
6. Any selected template is deselected

---

### **Staging → Production**

**Action:** Click **"🎨 Production"** button

**What Happens:**
1. Header turns green
2. Title changes to "🎨 Template Gallery"
3. Button changes to "🧪 Staging"
4. Gallery shows production templates (17+)
5. Filter is cleared
6. Any selected template is deselected

---

## ❓ FAQ

### **Q: Can I edit staging templates?**
**A:** Yes! Configure them just like production templates. Changes are in memory only (not saved to file).

### **Q: Can I export staging template JSON?**
**A:** Yes! Use the "Export JSON" button. You'll get the full scene config.

### **Q: Will staging templates appear in my videos?**
**A:** No, staging templates are only visible in the admin UI. They won't appear in rendered videos unless you manually import the scene JSON.

### **Q: How do I approve a staging template?**
**A:** Tell the developer. They'll move it from staging to production catalog and update the version tags.

### **Q: Can I have multiple staging templates?**
**A:** Yes! The STAGING_CATALOG can hold as many templates as needed. Right now there's 1, but more can be added.

### **Q: What if I forget I'm in staging mode?**
**A:** Look at the header:
- Pink = Staging
- Green = Production

### **Q: Can I filter staging templates by intention?**
**A:** Yes! The intention filters work in both modes.

---

## 🎓 Tips & Tricks

### **1. Use Grid View for Overview**
- Default view is grid (cards)
- Best for scanning multiple templates
- Shows all metadata at a glance

### **2. Use List View for Details**
- Click "📋 List" button
- Best for comparing templates
- Shows more description text

### **3. Test All Config Options**
- Don't just preview with defaults
- Change colors, fonts, timing, effects
- Verify all knobs work

### **4. Check Performance**
- Watch for dropped frames
- Use browser DevTools → Performance tab
- Should be solid 60fps

### **5. Test Edge Cases**
- Very long text
- Very short text
- No text (if optional)
- Extreme colors (pure white, pure black)
- Max/min timing values

---

## 🚀 Launch Sequence

**Full workflow from start to finish:**

```bash
# 1. Start dev server
cd KnoMotion-Videos
npm run dev

# Browser opens automatically
```

**In Browser:**
1. Wait for gallery to load (green header, 17+ templates)
2. Click **"🧪 Staging"** button
3. Header turns pink, shows 1 template
4. Click **"🧪 Question Burst V6 - Interactive Revelation"**
5. Config panel opens on right
6. Adjust settings, watch preview update
7. Test all features (scene transformation, icons, lines, etc.)
8. Make notes on what works/doesn't work
9. Click **"🎨 Production"** to return
10. Shut down server when done: `Ctrl+C`

**Time:** ~5 minutes for full review

---

## ✅ Success Indicators

**You're doing it right if:**
- ✅ Staging button appears in gallery header
- ✅ Clicking button changes header color
- ✅ Staging templates have pink badge
- ✅ Config panel works
- ✅ Preview updates in real-time
- ✅ You can switch back to production easily

**Something's wrong if:**
- ❌ No staging button appears
- ❌ Header doesn't change color
- ❌ No templates appear in staging
- ❌ Console shows errors
- ❌ Can't switch back to production

**If something's wrong:**
1. Check browser console for errors
2. Refresh the page
3. Rebuild: `npm run build`
4. Restart server: `npm run dev`
5. Check STAGING_SYSTEM_GUIDE.md for troubleshooting

---

## 📚 Related Documentation

**For More Info:**
- **STAGING_SYSTEM_GUIDE.md** - Complete developer/user guide
- **STAGING_SYSTEM_COMPLETE.md** - Implementation summary
- **HOOK1A_UPGRADE_ANALYSIS.md** - Details on Hook1A upgrade
- **CONFIGURATION.md** - How to configure templates

---

## 🎉 You're Ready!

That's all you need to know to start using the staging system. Go ahead and try it:

```bash
cd KnoMotion-Videos
npm run dev
# Click 🧪 Staging button
# Review Hook1A template
# Have fun! 🚀
```

---

**Questions?** Check STAGING_SYSTEM_GUIDE.md or ask the developer.

**Happy reviewing!** 🎬✨

---

**Document Version:** 1.0  
**Date:** 2025-11-12  
**Status:** ✅ **ACTIVE**
