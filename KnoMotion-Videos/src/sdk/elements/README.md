# KnoMotion Element Library

**Total Elements**: 13 (8 Atomic + 5 Compositions)

---

## 📦 What is the Element Library?

The Element Library provides **themed, reusable, animation-ready UI components** for KnoMotion videos. All elements follow the **strict wrapper pattern** and use **KNODE_THEME** exclusively.

### Key Principles

1. ✅ **Wrapper Pattern**: All external libraries (DaisyUI, etc.) are wrapped here
2. ✅ **Theme Consistency**: All elements use `KNODE_THEME` (no hardcoded colors/fonts)
3. ✅ **Animation Support**: Elements accept animation configs for entrance/continuous effects
4. ✅ **Consistent API**: All elements follow the same prop structure (variant, size, animation, style)

---

## 🏗️ Architecture

```
/sdk/elements/
├── atoms/              ← Single-purpose elements (8)
├── compositions/       ← Multi-element combinations (5)
├── index.js           ← Exports all elements
├── ELEMENT_RULES.md   ← CRITICAL rules for element creation
└── README.md          ← This file
```

---

## ⚛️ Atomic Elements (8)

### `<Badge>`
Labels/tags for categorization

**Props**:
- `variant`: 'default'|'primary'|'success'|'warning'|'danger'
- `size`: 'sm'|'md'|'lg'
- `animation`: Optional animation config

**Example**:
```tsx
import { Badge } from '../../sdk/elements';

<Badge text="New" variant="primary" size="md" />
```

---

### `<Button>`
Visual button elements (non-interactive, for display only)

**Props**:
- `variant`: 'default'|'primary'|'success'|'outline'
- `size`: 'sm'|'md'|'lg'
- `animation`: Optional animation config

**Example**:
```tsx
import { Button } from '../../sdk/elements';

<Button text="Get Started" variant="primary" size="lg" />
<Button text="With Icon" iconRef="🚀" variant="primary" size="md" />
```

---

### `<Card>`
Container cards with multiple variants

**Props**:
- `variant`: 'default'|'bordered'|'glass'
- `size`: 'sm'|'md'|'lg'
- `animation`: Optional animation config

**Example**:
```tsx
import { Card } from '../../sdk/elements';

<Card variant="glass" size="md">
  <p>Card content here</p>
</Card>
```

---

### `<Divider>`
Horizontal/vertical separators

**Props**:
- `orientation`: 'horizontal'|'vertical'
- `variant`: 'solid'|'dashed'|'dotted'
- `thickness`: Line thickness (px)
- `color`: Color from KNODE_THEME
- `length`: Length in pixels or '100%'

**Example**:
```tsx
import { Divider } from '../../sdk/elements';

<Divider orientation="horizontal" thickness={2} color="primary" />
```

---

### `<Icon>`
Icons/emojis with animation and spin support

**Props**:
- `size`: 'sm'|'md'|'lg'|'xl'
- `color`: Color from KNODE_THEME
- `animation`: Optional animation config
- `spin`: Boolean for continuous rotation

**Example**:
```tsx
import { Icon } from '../../sdk/elements';

<Icon iconRef="⚙️" size="xl" spin />
```

---

### `<Indicator>`
Notification dots/badges (absolute positioned)

**Props**:
- `variant`: 'primary'|'success'|'warning'|'danger'
- `size`: 'sm'|'md'|'lg'
- `pulse`: Boolean for pulse animation
- `position`: 'top-right'|'top-left'|'bottom-right'|'bottom-left'

**Example**:
```tsx
import { Indicator, Icon } from '../../sdk/elements';

<div style={{ position: 'relative' }}>
  <Icon iconRef="🔔" size="lg" />
  <Indicator variant="danger" pulse position="top-right" />
</div>
```

---

### `<Progress>`
Animated progress bars

**Props**:
- `value`: Progress value (0-100)
- `variant`: 'default'|'primary'|'success'|'warning'
- `size`: 'sm'|'md'|'lg'
- `animated`: Boolean to animate from 0 to value
- `animateStartFrame`: When to start animation
- `animateDuration`: Animation duration in seconds

**Example**:
```tsx
import { Progress } from '../../sdk/elements';

<Progress 
  value={75} 
  label="Loading..."
  variant="primary" 
  animated 
  animateStartFrame={30}
  animateDuration={1.5}
/>
```

---

### `<Text>`
Themed text with typewriter support

**Props**:
- `variant`: 'display'|'title'|'body'|'accent'|'utility'
- `size`: 'xs'|'sm'|'md'|'lg'|'xl'
- `weight`: 'normal'|'medium'|'bold'
- `color`: Color from KNODE_THEME
- `animation`: Optional animation config (supports typewriter!)

**Example**:
```tsx
import { Text } from '../../sdk/elements';

<Text 
  text="Hello World"
  variant="title" 
  size="xl" 
  weight="bold"
  animation={{ type: 'typewriter', startFrame: 0, duration: 2 }}
/>
```

---

## 🧩 Composition Elements (5)

### `<CardWithBadge>`
Card + Badge combination

**Props**:
- `badge`: Badge text
- `badgeVariant`: Badge variant
- `badgePosition`: 'top-right'|'top-left'|'bottom-right'|'bottom-left'
- `cardVariant`: Card variant
- `animation`: Animation config

**Example**:
```tsx
import { CardWithBadge } from '../../sdk/elements';

<CardWithBadge 
  badgeText="New" 
  badgeVariant="success"
  badgePosition="top-right"
  cardVariant="glass"
>
  <p>Card content</p>
</CardWithBadge>
```

---

### `<CardWithIcon>`
Card + Icon + Text layout

**Props**:
- `icon`: Icon content (emoji, SVG)
- `title`: Title text
- `layout`: 'horizontal'|'vertical'
- `cardVariant`: Card variant
- `animation`: Animation config

**Example**:
```tsx
import { CardWithIcon } from '../../sdk/elements';

<CardWithIcon 
  iconRef="🚀"
  title="Fast Setup"
  text="Description here"
  layout="horizontal"
/>
```

---

### `<HeroWithText>`
Hero section with title/subtitle

**Props**:
- `hero`: Hero content (emoji, icon, image)
- `title`: Main title
- `subtitle`: Subtitle/tagline
- `layout`: 'horizontal'|'vertical'
- `animation`: Animation config (staggered for hero/title/subtitle)

**Example**:
```tsx
import { HeroWithText } from '../../sdk/elements';

<HeroWithText 
  heroRef="🎓"
  title="Learn Anything"
  subtitle="Powered by KnoMotion"
  layout="vertical"
  animation={{ startFrame: 30 }}
/>
```

---

### `<StatCard>`
Statistics display card

**Props**:
- `value`: Stat value (number or string)
- `label`: Stat label/description
- `icon`: Optional icon
- `trend`: 'up'|'down'|'neutral' (trend indicator)
- `cardVariant`: Card variant
- `animation`: Animation config

**Example**:
```tsx
import { StatCard } from '../../sdk/elements';

<StatCard 
  value="98%"
  label="Satisfaction Rate"
  iconRef="⭐"
  trend="up"
/>
```

---

### `<StepCard>`
Step-by-step instruction card

**Props**:
- `step`: Step number
- `title`: Step title
- `cardVariant`: Card variant
- `animation`: Animation config

**Example**:
```tsx
import { StepCard } from '../../sdk/elements';

<StepCard 
  step={1}
  title="Create Account"
  text="Sign up in 30 seconds"
  cardVariant="bordered"
/>
```

---

## 🎬 Animation Support

All elements support optional animation configs:

```tsx
{
  type: 'fadeSlide' | 'scaleIn' | 'typewriter',
  startFrame: 30,
  duration: 0.6,  // seconds
  direction: 'up' | 'down' | 'left' | 'right',
}
```

**Example**:
```tsx
<Card animation={{ type: 'scaleIn', startFrame: 30, duration: 0.7 }}>
  Content
</Card>
```

---

## 📖 Usage Guidelines

### ✅ DO

```tsx
// Import from SDK elements
import { Badge, Card, Text } from '../../sdk/elements';

// Use elements with standardized props
<Card variant="glass">
  <Text text="Hello" variant="title" />
  <Badge text="New" variant="primary" />
</Card>
```

### ❌ DON'T

```tsx
// NEVER import external libraries directly
import { Badge } from 'daisyui';  // ❌ VIOLATION!

// NEVER use inconsistent prop names
<Badge>New</Badge>  // ❌ Use text prop
<Icon>🚀</Icon>     // ❌ Use iconRef prop

// NEVER create inline combo elements
<div style={{ display: 'flex' }}>  // ❌ Create composition element instead
  <Badge text="Label" />
  <Card>Content</Card>
</div>

// NEVER hardcode colors/fonts
<div style={{ color: '#FF6B35' }}>  // ❌ Use KNODE_THEME
```

---

## 🛠️ Adding New Elements

See **`ELEMENT_RULES.md`** for complete guidelines.

**Quick Checklist**:
1. ✅ Create in `/atoms/` or `/compositions/`
2. ✅ Use KNODE_THEME exclusively
3. ✅ Follow API pattern (variant, size, animation, style props)
4. ✅ Add JSDoc comments
5. ✅ Export via `/elements/index.js`
6. ✅ Update this README

---

## 📚 Resources

- **KNODE_THEME**: `/sdk/theme/knodeTheme.ts`
- **Animations**: `/sdk/animations/index.js`
- **Element Rules**: `/sdk/elements/ELEMENT_RULES.md`
- **DaisyUI Docs**: https://daisyui.com/components/

---

**Last Updated**: 2025-11-20  
**Version**: 1.0  
**Total Elements**: 13 (8 atoms, 5 compositions)
