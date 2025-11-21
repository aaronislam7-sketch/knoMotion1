# Mid-Scenes Positioning Fix - November 21, 2025

## 🔧 Issue Identified

User reported that text in `TextRevealSequence` was not rendering as expected. Investigation revealed that positioning and animation transforms were being applied to the same div, causing conflicts.

## ❌ The Problem

When position CSS (from layout engine) and animation transforms are on the same element, they conflict:

```jsx
// INCORRECT - Causes positioning issues
<div style={{
  position: 'absolute',
  left: '100px',
  top: '200px',
  transform: 'translateY(20px)',  // Conflicts with positioning!
  opacity: 0.5
}}>
  <Content />
</div>
```

## ✅ The Solution: Wrapper Pattern

Separate positioning and animation into two nested divs:

```jsx
// CORRECT - Wrapper pattern
<div style={{
  position: 'absolute',
  left: '100px',
  top: '200px'
}}>  {/* Outer: Handles positioning only */}
  <div style={{
    transform: 'translateY(20px)',
    opacity: 0.5
  }}>  {/* Inner: Handles animation only */}
    <Content />
  </div>
</div>
```

## 📦 Components Fixed

### 1. TextRevealSequence.jsx
**Before**:
- Applied `positionToCSS(pos)` and `animStyle` on same div

**After**:
- Outer div: Position from layout engine
- Inner div: Animation transforms

### 2. IconGrid.jsx
**Before**:
- Applied `positionToCSS(pos)` and `animStyle` on same div

**After**:
- Outer div: Position from layout engine
- Inner div: Animation transforms

### 3. CardSequence.jsx
**Before**:
- Applied `positionToCSS(pos)` and `animStyle` on same div

**After**:
- Outer div: Position from layout engine
- Inner div: Animation transforms

### 4. HeroTextEntranceExit.jsx
**Status**: Already using wrapper pattern correctly ✅

## 🏗️ Standard Pattern for All Mid-Scenes

```jsx
export const MidSceneComponent = ({ config }) => {
  // ... setup code ...
  
  const positions = calculateItemPositions(items, layoutConfig);
  
  return (
    <AbsoluteFill>
      {positions.map((pos, index) => {
        const item = items[index];
        const animStyle = getAnimationStyle(...);
        const itemPosition = positionToCSS(pos);
        
        return (
          <div
            key={index}
            style={{
              ...itemPosition,  // Position from layout engine
              ...style.outerContainer,  // Optional outer styling
            }}
          >
            <div
              style={{
                opacity: animStyle.opacity,        // Animation
                transform: animStyle.transform,    // Animation
                clipPath: animStyle.clipPath,      // Animation
              }}
            >
              {/* Content here */}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
```

## ✅ Validation Results

- ✅ Build passes with no errors
- ✅ No linter errors
- ✅ All 4 mid-scenes now use consistent wrapper pattern
- ✅ Positioning and animation are properly separated

## 📝 Best Practices Going Forward

### For All New Mid-Scenes:

1. **Always use wrapper pattern** for layout-positioned elements with animations
2. **Outer div**: Position only (from `positionToCSS()`)
3. **Inner div**: Animation properties only (opacity, transform, clipPath)
4. **Never mix** positioning and animation transforms on the same element

### Why This Matters:

- **CSS Positioning** (left, top) and **CSS Transforms** (translateX, translateY) operate in different coordinate spaces
- Mixing them on the same element causes unpredictable behavior
- Separating them ensures animations work relative to the positioned element

## 🎯 Impact

This fix ensures:
- ✅ Text reveals appear in correct positions
- ✅ Icon grids align properly
- ✅ Card sequences position correctly
- ✅ All animations work as expected
- ✅ Consistent behavior across all mid-scenes

---

**Fix Applied**: 2025-11-21  
**Components Updated**: 3 (TextRevealSequence, IconGrid, CardSequence)  
**Pattern Established**: Wrapper pattern for all mid-scenes
