# Element Creation Rules

**CRITICAL**: These rules are STRICTLY ENFORCED to maintain architectural integrity.

---

## 🚨 Golden Rules

### Rule 1: NEVER Import External Libraries Directly

❌ **WRONG** - Direct import in template/mid-scene:
```tsx
import { Badge } from 'daisyui';  // VIOLATION!

export const MyTemplate = () => (
  <Badge>Label</Badge>
);
```

✅ **CORRECT** - Import from SDK elements:
```tsx
import { Badge } from '../../sdk/elements';

export const MyTemplate = () => (
  <Badge>Label</Badge>
);
```

### Rule 2: NEVER Create Combo Elements Inline

❌ **WRONG** - Building combo in mid-scene:
```tsx
export const MyMidScene = () => (
  <div style={{display: 'flex', gap: 10}}>
    <div className="badge">Icon</div>
    <div className="card">Content</div>
  </div>
);
```

✅ **CORRECT** - Create reusable composition in /elements/:
```tsx
// In /elements/compositions/CardWithBadge.jsx
export const CardWithBadge = ({ badge, children }) => (
  <div style={{display: 'flex', gap: 10}}>
    <Badge>{badge}</Badge>
    <Card>{children}</Card>
  </div>
);

// In mid-scene
import { CardWithBadge } from '../../sdk/elements';
export const MyMidScene = () => (
  <CardWithBadge badge="Icon">Content</CardWithBadge>
);
```

### Rule 3: ALL Elements Must Use KNODE_THEME

❌ **WRONG** - Hardcoded colors:
```tsx
export const Badge = ({ children }) => (
  <div style={{ backgroundColor: '#FF6B35' }}>  // VIOLATION!
    {children}
  </div>
);
```

✅ **CORRECT** - Theme tokens:
```tsx
import { KNODE_THEME } from '../theme/knodeTheme';

export const Badge = ({ children }) => (
  <div style={{ backgroundColor: KNODE_THEME.colors.primary }}>
    {children}
  </div>
);
```

---

## 📁 File Organization

```
/sdk/elements/
├── atoms/              ← Single-purpose elements
│   ├── Badge.jsx
│   ├── Card.jsx
│   ├── Text.jsx
│   └── ...
├── compositions/       ← Multi-element combinations
│   ├── CardWithBadge.jsx
│   ├── HeroWithText.jsx
│   └── ...
├── index.js           ← Exports all elements (REQUIRED)
├── ELEMENT_RULES.md   ← This file
└── README.md          ← Element documentation
```

---

## 🎨 Element API Pattern

All elements MUST follow this consistent API pattern:

```tsx
import React from 'react';
import { KNODE_THEME } from '../theme/knodeTheme';

/**
 * ElementName - Brief description
 * 
 * @param {object} props
 * @param {React.ReactNode} props.children - Content
 * @param {string} props.variant - Variant type
 * @param {string} props.size - Size
 * @param {object} props.animation - Optional animation config
 * @param {object} props.style - Style overrides
 */
export const ElementName = ({ 
  children, 
  variant = 'default',
  size = 'md',
  animation = null,
  style = {},
  ...props 
}) => {
  const theme = KNODE_THEME;
  
  // Animation support (if animation prop provided)
  const animStyle = animation 
    ? getAnimationStyle(animation, frame, fps)
    : {};
  
  // Variant-based styling
  const variantStyles = {
    default: { backgroundColor: theme.colors.cardBg },
    primary: { backgroundColor: theme.colors.primary },
    // ... more variants
  };
  
  return (
    <div 
      style={{
        ...variantStyles[variant],
        ...animStyle,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};
```

**Required Props**:
- `children` - Content (if applicable)
- `variant` - Visual variant (default: 'default')
- `size` - Size (default: 'md')

**Optional Props**:
- `animation` - Animation config object
- `style` - Style overrides (use sparingly!)
- `...props` - Additional HTML props

---

## 🔧 Wrapper Pattern for External Libraries

When wrapping DaisyUI or other library components:

```tsx
import React from 'react';
import { KNODE_THEME } from '../theme/knodeTheme';

export const Badge = ({ 
  children, 
  variant = 'default',
  size = 'md',
  style = {},
  ...props 
}) => {
  const theme = KNODE_THEME;
  
  // Map our variants to DaisyUI classes
  const sizeClasses = {
    sm: 'badge-sm',
    md: 'badge-md',
    lg: 'badge-lg',
  };
  
  // Override DaisyUI colors with KNODE_THEME
  const variantColors = {
    default: theme.colors.textMain,
    primary: theme.colors.primary,
    success: theme.colors.accentGreen,
  };
  
  return (
    <div 
      className={`badge ${sizeClasses[size]}`}
      style={{
        backgroundColor: variantColors[variant],
        color: theme.colors.cardBg,
        fontFamily: theme.fonts.body,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};
```

**Key Points**:
1. ✅ Use DaisyUI classes for structure/sizing
2. ✅ Override colors with KNODE_THEME
3. ✅ Override fonts with KNODE_THEME
4. ✅ Allow style overrides (last in cascade)

---

## 🎬 Animation Support

Elements can optionally support entrance/continuous animations:

```tsx
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { fadeSlide } from '../animations';

export const Badge = ({ 
  children, 
  animation = null,
  ...props 
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Apply animation if config provided
  let animStyle = {};
  if (animation) {
    const { type = 'fadeSlide', startFrame = 0, duration = 0.6 } = animation;
    const durationFrames = Math.round(duration * fps);
    
    if (type === 'fadeSlide') {
      animStyle = fadeSlide(frame, startFrame, durationFrames, 'up', 30);
    }
    // ... other animation types
  }
  
  return (
    <div style={{ ...animStyle, ...otherStyles }}>
      {children}
    </div>
  );
};
```

**Animation Config Example**:
```tsx
<Badge animation={{ type: 'fadeSlide', startFrame: 30, duration: 0.6 }}>
  Label
</Badge>
```

---

## 📦 Exporting Elements

ALL elements MUST be exported via `/elements/index.js`:

```js
// /elements/index.js

// Atoms
export { Badge } from './atoms/Badge';
export { Card } from './atoms/Card';
export { Text } from './atoms/Text';
// ... all atoms

// Compositions
export { CardWithBadge } from './compositions/CardWithBadge';
export { HeroWithText } from './compositions/HeroWithText';
// ... all compositions
```

**Usage in templates**:
```tsx
import { Badge, Card, CardWithBadge } from '../../sdk/elements';
```

---

## ✅ Quality Checklist

Before committing a new element, verify:

- [ ] Uses KNODE_THEME (no hardcoded colors/fonts)
- [ ] Follows API pattern (variant, size, animation, style props)
- [ ] Has JSDoc comments
- [ ] Exported via /elements/index.js
- [ ] Tested rendering in isolation
- [ ] Works with animations (if applicable)
- [ ] Responsive to theme overrides
- [ ] No direct library imports in usage

---

## 🚫 Common Violations

### Violation 1: Direct Library Import
```tsx
import { Card } from 'daisyui';  // ❌ NEVER!
```

### Violation 2: Inline Element Creation
```tsx
// In MyTemplate.jsx
const CustomCard = () => <div className="card">...</div>;  // ❌ WRONG!
// Should be in /elements/atoms/Card.jsx
```

### Violation 3: Hardcoded Styling
```tsx
<div style={{ color: '#FF6B35' }}>  // ❌ Use KNODE_THEME.colors.primary
```

### Violation 4: Not Exported
```tsx
// Element exists in /atoms/Badge.jsx but not in /elements/index.js  // ❌ Must export!
```

---

## 📚 Additional Resources

- **KNODE_THEME**: `/sdk/theme/knodeTheme.ts`
- **Animations**: `/sdk/animations/index.js`
- **DaisyUI Docs**: https://daisyui.com/components/
- **Tailwind Docs**: https://tailwindcss.com/docs

---

**Last Updated**: 2025-11-20
**Version**: 1.0
**Enforced By**: Code review + architectural standards
