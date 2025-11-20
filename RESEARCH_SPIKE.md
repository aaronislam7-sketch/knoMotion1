# Research Spike: Phase 2 Prerequisites

**Date**: 2025-11-20
**Purpose**: Understand scope and complexity of Lottie migration and Element library integration

---

## 1. @remotion/lottie Migration

### Current State
- ❌ Using: `@lottiefiles/react-lottie-player` v3.6.0
- ✅ Need: `@remotion/lottie` (latest: 4.0.377)
- 🔴 3 files importing from @lottiefiles

### Migration Complexity: **MEDIUM** ⚠️

**Installation**:
```bash
npm install @remotion/lottie@4.0.377 --save-exact
npm uninstall @lottiefiles/react-lottie-player
```

**API Changes Required**:

Current (lottiefiles):
```tsx
import { Player as LottiePlayer } from '@lottiefiles/react-lottie-player';

<LottiePlayer
  src={animationSrc}
  autoplay={true}
  loop={true}
  style={{width: 100, height: 100}}
/>
```

New (@remotion/lottie):
```tsx
import { Lottie } from '@remotion/lottie';

<Lottie
  animationData={animationData}  // Different prop name!
  style={{width: 100, height: 100}}
/>
```

**Key Differences**:
1. **Prop names changed**: `src` → `animationData`
2. **Data format**: Must be JSON object, not URL string
3. **Timeline sync**: Automatically syncs with Remotion frame (good!)
4. **No autoplay/loop props**: Controlled by Remotion timeline

**Files to Migrate** (3):
1. `/sdk/lottie/lottieIntegration.tsx` - Main Lottie wrapper
2. `/templates/v6/Reflect4AKeyTakeaways_V6.jsx` - Template usage
3. `/templates/archive_v5/Apply3BScenarioChoice_V5.jsx` - Archived (skip?)

**Lottie Data Sources** (CRITICAL ISSUE):
- ❌ Current lottie.host URLs return 403 Forbidden
- ✅ Options:
  1. Download Lottie JSON files locally → host in `/public/lotties/`
  2. Use different CDN (LottieFiles CDN, etc.)
  3. Embed JSON directly in code (small files only)

**Recommendation**: Download 5-10 Lottie files locally for showcase

**Estimated Time**: 2-3 hours
- Install package: 5 min
- Migrate lottieIntegration.tsx: 1 hour
- Find/download working Lottie files: 30 min
- Test all Lottie components: 30 min
- Update lottiePresets.js: 30 min
- Fix template imports: 30 min

---

## 2. DaisyUI Integration

### Current State
- ❌ Not installed
- ✅ Tailwind already configured (v3.4.18)
- ✅ @remotion/tailwind installed (v4.0.373)

### Integration Complexity: **LOW** ✅

**Installation**:
```bash
npm install daisyui@5.5.5 --save-dev
```

**Configuration** (tailwind.config.js):
```js
export default {
  content: ['./KnoMotion-Videos/src/**/*.{js,jsx,ts,tsx}'],
  plugins: [require('daisyui')],
  daisyui: {
    themes: false, // Disable default themes, use custom KNODE_THEME
    base: false,   // Disable base styles, keep control
    styled: true,  // Use styled components
    utils: true,   // Include utility classes
  },
}
```

**Available Components** (DaisyUI):
- Badge, Button, Card, Divider, Progress, Indicator
- Alert, Stat, Steps, Timeline
- NO interactive components (good for Remotion!)

**Wrapper Pattern Example**:
```tsx
// /sdk/elements/atoms/Badge.jsx
import { KNODE_THEME } from '../../theme/knodeTheme';

export const Badge = ({ 
  children, 
  variant = 'default',
  size = 'md',
  ...props 
}) => {
  const colors = KNODE_THEME.colors;
  
  // Map our variants to DaisyUI classes
  const variantClasses = {
    default: 'badge-neutral',
    primary: 'badge-primary',
    success: 'badge-success',
  };
  
  return (
    <div 
      className={`badge ${variantClasses[variant]} badge-${size}`}
      style={{
        // Override DaisyUI colors with KNODE_THEME
        backgroundColor: colors.primary,
        color: colors.textMain,
        ...props.style
      }}
    >
      {children}
    </div>
  );
};
```

**Pros**:
- ✅ Fast development (pre-built components)
- ✅ Consistent sizing/spacing
- ✅ No interactivity (perfect for Remotion)
- ✅ Can override all styles with KNODE_THEME

**Cons**:
- ⚠️ Adds ~50KB to bundle
- ⚠️ May need to disable some features we don't use

**Estimated Time**: 1-2 hours
- Install + configure: 30 min
- Build 3-5 wrapper elements: 1 hour
- Test rendering: 30 min

---

## 3. Material UI Integration

### Current State
- ❌ Not installed
- ⚠️ MaterialUI v7 is LARGE (~300KB)

### Integration Complexity: **HIGH** 🔴

**Installation**:
```bash
npm install @mui/material@7.3.5 @emotion/react @emotion/styled
```

**Concerns**:
1. **Bundle size**: ~300KB (vs DaisyUI ~50KB)
2. **Emotion dependency**: Adds CSS-in-JS runtime
3. **React-specific**: May have compatibility issues with Remotion
4. **Interactive focus**: Designed for web apps, not video

**Available Components**:
- Button, Card, Chip, Badge, Divider, Paper, Typography
- Complex: Accordion, Dialog, Menu, Tabs (NOT useful for Remotion)

**Wrapper Pattern**: Similar to DaisyUI but more complex

**Pros**:
- ✅ Very polished design system
- ✅ Comprehensive component library
- ✅ Good TypeScript support

**Cons**:
- 🔴 Large bundle size
- 🔴 Overkill for Remotion (designed for interactive apps)
- 🔴 CSS-in-JS may conflict with Remotion rendering
- 🔴 More setup complexity

**Recommendation**: **SKIP MaterialUI** - Use DaisyUI instead
- DaisyUI is lighter, simpler, Tailwind-native
- MaterialUI is too heavy for video rendering

**Estimated Time**: N/A (skip)

---

## 4. Wrapper Pattern Design

### Pattern: SDK-First Component Wrapping

**Rule**: NEVER import from external libraries directly in templates/mid-scenes

**Pattern Structure**:
```
/sdk/elements/
  /atoms/
    Badge.jsx          ← Wraps DaisyUI badge
    Button.jsx         ← Wraps DaisyUI button
    Card.jsx           ← Wraps DaisyUI card
    Divider.jsx        ← Wraps DaisyUI divider
    Progress.jsx       ← Wraps DaisyUI progress
  /compositions/
    CardWithBadge.jsx  ← Composes Badge + Card
  index.js             ← Exports all wrapped components
```

**Template Usage**:
```tsx
// ✅ CORRECT
import { Badge, Card } from '../../sdk/elements';

// ❌ WRONG - Never do this!
import { Badge } from 'daisyui';
```

**Wrapper Template**:
```tsx
// /sdk/elements/atoms/Badge.jsx
import React from 'react';
import { KNODE_THEME } from '../../theme/knodeTheme';

/**
 * Badge - Atomic element
 * Wraps DaisyUI badge with KNODE_THEME styling
 * 
 * @param {object} props
 * @param {string} props.children - Badge text
 * @param {string} props.variant - 'default'|'primary'|'success'|'warning'
 * @param {string} props.size - 'sm'|'md'|'lg'
 * @param {object} props.animation - Optional entrance animation config
 */
export const Badge = ({ 
  children, 
  variant = 'default',
  size = 'md',
  animation = null,
  style = {},
  ...props 
}) => {
  const theme = KNODE_THEME;
  
  // Animation support (if provided)
  const animStyle = animation ? getAnimationStyle(animation) : {};
  
  // Variant mapping to colors
  const variantColors = {
    default: theme.colors.textMain,
    primary: theme.colors.primary,
    success: theme.colors.accentGreen,
    warning: theme.colors.doodle,
  };
  
  return (
    <div 
      className={`badge badge-${size}`}
      style={{
        backgroundColor: variantColors[variant],
        color: theme.colors.cardBg,
        fontFamily: theme.fonts.body,
        ...animStyle,
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
};
```

**Benefits**:
1. ✅ Centralized control over styling
2. ✅ Easy to swap libraries later
3. ✅ KNODE_THEME enforced everywhere
4. ✅ Animation support built-in
5. ✅ Consistent API across all elements

---

## 5. Element Library Scope

### Recommended 10-15 Elements

**Atoms** (8):
1. **Text** - Themed text wrapper
2. **Badge** - Small label/tag (DaisyUI)
3. **Button** - Button-like element (DaisyUI)
4. **Card** - Container card (DaisyUI)
5. **Divider** - Horizontal/vertical line (DaisyUI)
6. **Progress** - Progress bar (DaisyUI)
7. **Icon** - Icon/emoji wrapper
8. **Indicator** - Small notification dot (DaisyUI)

**Compositions** (5-7):
1. **CardWithBadge** - Card + badge overlay
2. **CardWithIcon** - Card + icon + text (like NotebookCard)
3. **StepCard** - Number badge + title + description
4. **StatCard** - Large number + label + icon
5. **TimelineItem** - Badge + connector + content
6. **HeroWithText** - Large visual + title + subtitle
7. **QuoteBlock** - Quote + attribution + styling

**Total**: 13-15 elements (perfect scope)

---

## Priority Recommendation

### Phase 2 Order:

**1. DaisyUI Integration** (1-2 hours) 🟢 START HERE
- **Why first**: Faster, simpler, enables element building
- **Blockers**: None
- **Output**: 5-8 wrapped atomic elements ready to use

**2. Element Library Build** (3-4 hours) 🟢 THEN THIS
- **Why second**: Depends on DaisyUI being available
- **Blockers**: DaisyUI installation
- **Output**: 13-15 showcase-ready elements

**3. Lottie Migration** (2-3 hours) 🟡 LAST (but important)
- **Why last**: Independent of elements, showcase can work without Lottie initially
- **Blockers**: Need to find/download working Lottie files
- **Output**: Working Lottie integration for Scene 6

**Total Estimated Time**: 6-9 hours

---

## Decision: MaterialUI?

**Recommendation**: ❌ **SKIP MaterialUI**

**Reasoning**:
1. Too heavy (300KB vs DaisyUI 50KB)
2. Overkill for Remotion video rendering
3. DaisyUI covers 90% of needs
4. Tailwind-native (already have @remotion/tailwind)
5. Simpler integration

**Final Stack**:
- ✅ Tailwind (utility classes)
- ✅ @remotion/tailwind (integration)
- ✅ DaisyUI (component library)
- ✅ KNODE_THEME (our design tokens)
- ❌ MaterialUI (skip)

---

## Next Steps

1. **Install DaisyUI** → Configure tailwind.config.js
2. **Build wrapper pattern** → Create 2-3 example elements
3. **Scale to 13-15 elements** → Atoms + compositions
4. **Migrate Lottie** → Install @remotion/lottie, update files
5. **Find Lottie files** → Download 5-10 for showcase

**Ready to proceed?** All research complete! 🚀
