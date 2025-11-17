# 🏗️ V7 Architecture Clarification

**Date:** 2025-11-17  
**Critical Design Principle Established**

---

## 🎯 Core Principle: Separation of Concerns

### **Templates = Positioning & Display Style ONLY**
- Pure layout engines
- No animations
- No content behavior
- Just positioning math and container styling

### **Mid-Level Components = Animations & Content Behavior**
- All animations
- All interactivity
- Content transformations
- State management
- Entrance/exit effects

---

## ✅ **Answer to Your Question: FlowDiagram Inheritance**

**Question:** "If I integrate the FlowDiagram mid-level elsewhere, would they inherit these changes?"

**Answer:** **NO - And that's the problem we just identified!**

### Current Issue:
Right now, the FlowLayoutScene **template** has the simplified rendering logic (text outside nodes, clean styling) baked into `renderNode()`. This is **wrong architecture**.

### Correct Architecture:
The simplified rendering should be in the **FlowDiagram mid-level component**, not the template.

**This means:**
1. ✅ If you use FlowDiagram in **any** scene (FlowLayout, StackLayout, FullFrame, etc.), you get the same clean node rendering
2. ✅ The template just provides the layout container and positioning
3. ✅ FlowDiagram handles all the node rendering, text layout, animations

---

## 🔧 What Needs to Change

### Current (Wrong):
```
FlowLayoutScene (Template)
├── Has renderNode() with animations ❌
├── Has text-outside-nodes logic ❌
└── Has node styling ❌

FlowDiagram (Mid-Level)
└── Also has rendering logic ❌
```

**Problem:** Duplication! Changes don't propagate.

### Correct (Right):
```
FlowLayoutScene (Template)
├── Calculates node positions ✅
├── Provides layout container ✅
└── Calls FlowDiagram component ✅

FlowDiagram (Mid-Level)
├── Renders all nodes (with text outside) ✅
├── Handles all animations ✅
├── Manages node styling ✅
└── Reusable in ANY template ✅
```

---

## 📋 Refactoring Checklist

### Templates Should ONLY Have:
- [ ] Container/viewport setup
- [ ] Grid/stack/flow position calculations
- [ ] Layout math (columns, rows, spacing)
- [ ] Title positioning (if any)
- [ ] Background effects setup

### Templates Should NOT Have:
- [ ] ❌ Animation logic
- [ ] ❌ Content rendering
- [ ] ❌ Item styling
- [ ] ❌ Entrance/exit effects
- [ ] ❌ Emphasis animations

### Mid-Level Components Should Have:
- [ ] All animation logic
- [ ] Content rendering
- [ ] Item styling
- [ ] Interactive behaviors
- [ ] Stagger calculations
- [ ] Entrance/exit effects

---

## 🎬 Example: GridLayoutScene

### Current (Hybrid - Wrong):
```javascript
// In GridLayoutScene.jsx
const renderGridItem = (item, ...) => {
  // Has animations ❌
  let animStyle = fadeIn(frame, startFrame, duration);
  
  // Has styling ❌
  return (
    <GlassmorphicPane>
      {item.icon}
      {item.label}
    </GlassmorphicPane>
  );
};
```

### Correct Approach:
```javascript
// GridLayoutScene.jsx (Template)
export const GridLayoutScene = ({ scene }) => {
  // ONLY calculate positions
  const gridPositions = calculateGridPositions(...);
  
  // ONLY provide layout container
  return (
    <AbsoluteFill>
      {title && <Title />}
      
      {/* Delegate to mid-level component */}
      <AppMosaic 
        items={items}
        positions={gridPositions}  // Template provides positions
        frame={frame}              // Template provides frame
        fps={fps}                  // Template provides fps
      />
    </AbsoluteFill>
  );
};

// AppMosaic.jsx (Mid-Level)
export const AppMosaic = ({ items, positions, frame, fps }) => {
  // ALL animations here
  // ALL styling here
  // ALL rendering here
  return items.map((item, index) => {
    const animStyle = getCardEntrance(...);  // ✅ Animations in mid-level
    const position = positions[index];       // ✅ Positions from template
    
    return (
      <div style={{ ...position, ...animStyle }}>
        <GlassmorphicPane>
          {item.icon}
          {item.label}
        </GlassmorphicPane>
      </div>
    );
  });
};
```

---

## 🚀 Benefits of This Architecture

### 1. **Reusability**
```javascript
// Use AppMosaic in ANY template
<FullFrameScene>
  <AppMosaic items={...} />
</FullFrameScene>

<StackLayoutScene>
  <AppMosaic items={...} />
</StackLayoutScene>

<GridLayoutScene>
  <AppMosaic items={...} />
</GridLayoutScene>
```
**All get the same animations and styling!** ✅

### 2. **Maintainability**
- Change animations once in AppMosaic
- All templates automatically get the update
- No duplication

### 3. **Composability**
```javascript
// Mix mid-level components
<GridLayoutScene>
  <AppMosaic items={apps} />
  <FlowDiagram nodes={flow} />
  <DataVisualization data={...} />
</GridLayoutScene>
```

### 4. **Testing**
- Test templates: Just layout math
- Test mid-levels: Just rendering and animations
- Clean separation

---

## 🔍 Current State Assessment

### FullFrameScene
- ❌ Has animation logic in template
- ❌ Has content rendering in template
- **Needs:** Refactor to use mid-level component

### GridLayoutScene
- ⚠️ Hybrid: Some logic in template, some in AppMosaic
- **Needs:** Move ALL rendering to AppMosaic

### StackLayoutScene
- ❌ Has animation logic in template
- ❌ Has item rendering in template
- **Needs:** Create StackItems mid-level component

### FlowLayoutScene
- ⚠️ Has renderNode in template (our simplified version)
- ⚠️ Has FlowDiagram mid-level (old complex version)
- **Needs:** Move simplified rendering INTO FlowDiagram, template just does positioning

---

## 🎯 Action Items

### Immediate (To answer your question):
1. ✅ **Yes, FlowDiagram can be used elsewhere**
2. ⚠️ **But** you need to refactor:
   - Move simplified node rendering INTO FlowDiagram
   - Remove renderNode from FlowLayoutScene template
   - Template just calls FlowDiagram with positions

### Next Steps:
1. **Grid**: Fix rendering issue first (high priority)
2. **Stack**: Finish row-based math (in progress)
3. **Architecture**: Plan mid-level refactor
4. **Flow**: Move simplified rendering into FlowDiagram properly

---

## 💡 Quick Reference

| Component Type | Responsibilities | Examples |
|---------------|------------------|----------|
| **Templates** | Layout, Positioning, Container | GridLayoutScene, StackLayoutScene |
| **Mid-Levels** | Rendering, Animations, Behavior | AppMosaic, FlowDiagram, DataChart |
| **SDK** | Utilities, Effects, Helpers | fadeIn, GlassmorphicPane, toFrames |

---

## 🎬 Your FlowDiagram Question - Final Answer

**"If I integrate FlowDiagram mid-level elsewhere, would they inherit these changes?"**

**Current State:** NO, because the simplified rendering is in the template (FlowLayoutScene), not in FlowDiagram.

**After Refactor:** YES, because all rendering logic will be in FlowDiagram mid-level component.

**What You Need to Do:**
1. Move the simplified `renderNode` function from FlowLayoutScene template into FlowDiagram mid-level
2. Make FlowLayoutScene template just call FlowDiagram with positions
3. Now FlowDiagram can be used in StackLayout, GridLayout, FullFrame, etc. with the same clean rendering

**Example After Refactor:**
```javascript
// ANY template can use FlowDiagram
<StackLayoutScene>
  <StackItems items={[...]} />
  <FlowDiagram nodes={[...]} />  // ✅ Gets clean rendering automatically
</StackLayoutScene>

<GridLayoutScene>
  <AppMosaic items={[...]} />
  <FlowDiagram nodes={[...]} />  // ✅ Same clean rendering
</GridLayoutScene>
```

---

**Bottom Line:** Templates are "dumb containers" that only do math. Mid-levels are "smart components" that do everything else. This is the correct V7 architecture! 🏗️
