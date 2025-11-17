# 🔍 V7 Templates - Troubleshooting Guide

**Current Status:** Build passing, templates integrated, debug logging enabled

---

## ✅ What's Been Fixed

1. ✅ **Import errors** - All resolved (build passing)
2. ✅ **Duration calculation** - Now returns frames (not seconds)
3. ✅ **Template_id added** - All JSONs have correct template_id
4. ✅ **UnifiedAdminConfig** - V7 templates mapped to example JSONs
5. ✅ **Debug logging** - Added to all V7 templates

---

## 🐛 Current Issue: Scenes Not Rendering

### Symptoms
- Videos show 0 seconds or complete quickly
- Some scenes don't render anything
- Preview appears blank or incomplete

### Debugging Steps

#### 1. Start Dev Server & Open Console
```bash
cd /workspace/KnoMotion-Videos
npm run dev
```

**Then:**
- Open browser developer tools (F12)
- Go to Console tab
- Clear console

#### 2. Select a V7 Template
- Click "🎛️ Template Gallery & Config"
- Click "🧪 Staging" button (header turns pink)
- Click any V7 template (e.g., 🖼️ Full Frame Scene)

#### 3. Check Console Output

You should see debug messages like:
```
[FullFrameScene] Rendering frame: 0 Scene: fullframe-welcome
[FullFrameScene] Rendering frame: 1 Scene: fullframe-welcome
...
```

**What to check:**
- ✅ Are frames incrementing? (0, 1, 2, 3...)
- ✅ Is the scene ID correct?
- ❌ Any red error messages?

---

## 🔍 Specific Checks

### Check 1: Frame Count
**Look for:** `Rendering frame: X`

- **If frames stay at 0** → Duration calculation broken
- **If frames increment to 360+** → Duration is working (12 seconds × 30fps)
- **If frames stop early** → Duration too short

### Check 2: Scene Data
**Look for:** `Items: X` or `Nodes: X`

For GridLayoutScene:
```
[GridLayoutScene] Rendering frame: 0 Items: 6
```

For StackLayoutScene:
```
[StackLayoutScene] Rendering frame: 0 Items: 5
```

For FlowLayoutScene:
```
[FlowLayoutScene] Rendering frame: 0 Nodes: 5 Edges: 4
```

- **If Items/Nodes is undefined** → Content not loading from JSON
- **If Items/Nodes is 0** → Content is empty
- **If Items/Nodes matches JSON** → Content is loading correctly

### Check 3: Errors
**Look for:** Red error messages

Common errors:
- `Cannot read property 'X' of undefined` → Data structure mismatch
- `X is not a function` → Missing SDK export
- `Failed to resolve import` → Build issue (shouldn't happen now)

---

## 🧪 Test with Minimal Scene

Try the minimal test scene:

```javascript
// In UnifiedAdminConfig.jsx DEFAULT_SCENES, add:
'FullFrameScene': fullframeMinimal,  // Use minimal instead of example
```

This will load a super simple scene:
- Red background (#FF0000)
- White text
- Just says "TEST - This is a minimal test"
- 6 seconds long

**If this works:**
- The template code is fine
- Issue is with the complex example JSONs

**If this doesn't work:**
- Issue is with the template component itself
- Need to debug the rendering logic

---

## 🔧 Potential Issues & Fixes

### Issue 1: Content Not Rendering

**Symptoms:** Blank screen with correct duration

**Check:**
```javascript
// In FullFrameScene.jsx renderMainContent function
console.log('Rendering content:', content, 'Type:', content.main?.type);
```

**Possible causes:**
- Content.main is null/undefined
- Content type not recognized
- Animation hiding content (opacity: 0)

---

### Issue 2: Duration = 0 Seconds

**Symptoms:** Video completes instantly

**Check:**
```javascript
// In getDuration function
console.log('Scene beats:', scene.beats, 'Exit time:', scene.beats?.exit);
```

**Fix:**
Make sure `beats.exit` exists in JSON and is a number (not string).

---

### Issue 3: Animations Not Playing

**Symptoms:** Content appears but doesn't animate

**Check:**
```javascript
// In scene component
console.log('Beat frames:', beatFrames);
console.log('Animation config:', animations);
```

**Possible causes:**
- Start frames are in the future (content never appears)
- Duration is 0
- Opacity stays at 0

---

## 🎯 Quick Fixes to Try

### Fix 1: Simplify Example JSON

Remove all optional fields and test with minimal config:

```json
{
  "schema_version": "7.0",
  "template_id": "FullFrameScene",
  "content": {
    "main": {
      "type": "text",
      "data": { "text": "Hello World" }
    }
  }
}
```

### Fix 2: Force Visible Content

Add this to FullFrameScene temporarily:

```javascript
// After calculating animStyle, override for testing:
animStyle = { opacity: 1, transform: '' };  // Force visible
```

### Fix 3: Check Beat Timing

Make sure beats are sequential:
```json
"beats": {
  "entrance": 0,
  "title": 0.5,
  "main": 1.0,  // Should be AFTER title
  "exit": 8.0   // Should be at END
}
```

---

## 📊 Expected Console Output

### FullFrameScene (Working)
```
[FullFrameScene] Rendering frame: 0 Scene: fullframe-welcome
[FullFrameScene] Rendering frame: 30 Scene: fullframe-welcome
[FullFrameScene] Rendering frame: 60 Scene: fullframe-welcome
...
[FullFrameScene] Rendering frame: 360 Scene: fullframe-welcome
```

Duration: 12 seconds (360 frames ÷ 30 fps)

### GridLayoutScene (Working)
```
[GridLayoutScene] Rendering frame: 0 Items: 6
[GridLayoutScene] Rendering frame: 30 Items: 6
...
[GridLayoutScene] Rendering frame: 420 Items: 6
```

Duration: 14 seconds (420 frames ÷ 30 fps)

---

## 🚨 Common Problems

### Problem: "Beats is undefined"
```
TypeError: Cannot read property 'exit' of undefined
```

**Fix:** Add fallback in getDuration:
```javascript
const exitTime = scene.beats?.exit || scene?.beats?.exit || 10;
```

### Problem: "Content.main is null"
```
Cannot render null main content
```

**Fix:** Check JSON has content.main:
```json
"content": {
  "main": { "type": "text", "data": { "text": "..." } }
}
```

### Problem: "Background is black, nothing visible"
**Possible causes:**
- Colors.bg is being applied but content isn't rendering
- Opacity is 0 from animation
- Content is off-screen

**Fix:** Add visible fallback content for testing

---

## 🎬 Next Steps

1. **Run dev server** with console open
2. **Select V7 template** and watch console
3. **Report what you see:**
   - Frame numbers?
   - Error messages?
   - Content data?
4. **Share console output** so I can diagnose

---

## 📝 Quick Test Checklist

When testing, verify:

- [ ] Console shows frame numbers incrementing
- [ ] Frame count reaches expected duration (e.g., 360 for 12s)
- [ ] Scene ID appears in console
- [ ] Items/Nodes count matches JSON
- [ ] No red error messages
- [ ] Background color is correct
- [ ] Content appears on screen
- [ ] Animations play smoothly

---

## 🔬 Advanced Debugging

### Enable Extra Logging

Add to each scene template:

```javascript
// After config merge
console.log('[FullFrameScene] Config:', {
  colors: colors,
  hasTitle: !!content.title,
  hasMain: !!content.main,
  mainType: content.main?.type,
  beatFrames: beatFrames
});
```

### Test Minimal Scene First

Replace the example in DEFAULT_SCENES:
```javascript
'FullFrameScene': fullframeMinimal,  // Simplest possible test
```

This eliminates variables and helps isolate the issue.

---

## 💡 What to Share

When reporting issues, please share:

1. **Console output** (copy/paste the debug messages)
2. **Visual description** (what do you see on screen?)
3. **Which template** (FullFrameScene, GridLayoutScene, etc.)
4. **Any error messages** (red text in console)

This will help me diagnose and fix quickly!

---

**Status:** Debug logging enabled, ready for testing! 🔍

Run `npm run dev`, select a V7 template, and check the browser console. Share what you see and I'll help fix it! 🚀
