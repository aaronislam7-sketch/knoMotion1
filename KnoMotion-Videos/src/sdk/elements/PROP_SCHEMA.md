# KnoMotion Element Prop Schema

**Version**: 1.0  
**Last Updated**: 2025-11-20

---

## 🎯 Standardized Prop Naming Convention

All KnoMotion elements follow this **strict naming schema** for consistency and ease of use.

---

## 📝 Content Props (STANDARDIZED)

### Text Content
| Prop Name | Type | Usage | Example |
|-----------|------|-------|---------|
| `text` | `string` | Primary text content (single string) | `text="Hello World"` |
| `title` | `string` | Title text (when element has title + body) | `title="Step 1"` |
| `subtitle` | `string` | Secondary/subtitle text | `subtitle="Getting Started"` |
| `label` | `string` | Label text (for form-like elements) | `label="Progress"` |
| `children` | `ReactNode` | Complex/rich content (JSX, multiple elements) | `<Card>...</Card>` |

**Rule**: Use `text` for simple strings, `children` for complex markup.

---

### Visual Content
| Prop Name | Type | Usage | Example |
|-----------|------|-------|---------|
| `iconRef` | `string` | Icon/emoji reference | `iconRef="🚀"` |
| `imageRef` | `string` | Image URL or file path | `imageRef="/images/hero.png"` |
| `lottieRef` | `string` | Lottie animation URL or file path | `lottieRef="/lotties/success.json"` |

**Rule**: All visual asset references use `*Ref` suffix for clarity.

---

## 🎨 Style Props (STANDARDIZED)

| Prop Name | Type | Usage | Example |
|-----------|------|-------|---------|
| `variant` | `string` | Visual variant/style | `variant="primary"` |
| `size` | `string` | Element size | `size="md"` |
| `color` | `string` | Color from KNODE_THEME | `color="primary"` |
| `style` | `object` | Style overrides (use sparingly!) | `style={{ margin: 10 }}` |

---

## 🎬 Behavior Props (STANDARDIZED)

| Prop Name | Type | Usage | Example |
|-----------|------|-------|---------|
| `animation` | `object` | Animation config | `animation={{ type: 'fadeSlide', startFrame: 30 }}` |
| `onFrameChange` | `function` | Frame change callback (advanced) | `onFrameChange={(f) => ...}` |

---

## 📦 Element-Specific Props

### Atomic Elements

#### `<Badge>`
```tsx
<Badge 
  text="New"              // ✅ Standardized
  variant="primary"        // ✅ Standardized
  size="md"               // ✅ Standardized
  animation={{ type: 'fadeSlide', startFrame: 30 }}
/>
```

#### `<Button>`
```tsx
<Button 
  text="Click Me"         // ✅ Standardized
  variant="primary"       // ✅ Standardized
  size="lg"              // ✅ Standardized
  iconRef="🚀"           // ✅ Standardized (optional)
/>
```

#### `<Card>`
```tsx
<Card 
  variant="glass"         // ✅ Standardized
  size="md"              // ✅ Standardized
>
  <Text text="Card content" />  // children for complex content
</Card>
```

#### `<Divider>`
```tsx
<Divider 
  orientation="horizontal"
  variant="solid"
  thickness={2}
  color="primary"         // ✅ Standardized
  length="100%"
/>
```

#### `<Icon>`
```tsx
<Icon 
  iconRef="⚡"            // ✅ Standardized
  size="xl"              // ✅ Standardized
  color="primary"        // ✅ Standardized
  spin={true}
/>
```

#### `<Indicator>`
```tsx
<Indicator 
  variant="danger"        // ✅ Standardized
  size="md"              // ✅ Standardized
  pulse={true}
  position="top-right"
/>
```

#### `<Progress>`
```tsx
<Progress 
  value={75}
  label="Loading..."      // ✅ Standardized
  variant="primary"       // ✅ Standardized
  size="md"              // ✅ Standardized
  animated={true}
/>
```

#### `<Text>`
```tsx
<Text 
  text="Hello World"      // ✅ Standardized
  variant="title"         // ✅ Standardized
  size="xl"              // ✅ Standardized
  weight="bold"
  color="primary"         // ✅ Standardized
  animation={{ type: 'typewriter', startFrame: 0, duration: 2 }}
/>
```

---

### Composition Elements

#### `<CardWithBadge>`
```tsx
<CardWithBadge 
  badgeText="New"         // ✅ Standardized (prefixed for clarity)
  badgeVariant="success"  // ✅ Standardized
  badgePosition="top-right"
  cardVariant="glass"     // ✅ Standardized
>
  <Text text="Card content" />
</CardWithBadge>
```

#### `<CardWithIcon>`
```tsx
<CardWithIcon 
  iconRef="🚀"           // ✅ Standardized
  title="Fast Setup"      // ✅ Standardized
  text="Description here" // ✅ Standardized (alternative to children)
  layout="horizontal"
  cardVariant="bordered"  // ✅ Standardized
/>
```

#### `<HeroWithText>`
```tsx
<HeroWithText 
  heroRef="🎓"           // ✅ Standardized (can be icon, image, or lottie)
  title="Learn Anything"  // ✅ Standardized
  subtitle="Powered by KnoMotion"  // ✅ Standardized
  layout="vertical"
  animation={{ startFrame: 30 }}
/>
```

#### `<StatCard>`
```tsx
<StatCard 
  value="98%"             // Numeric/string value
  label="Success Rate"    // ✅ Standardized
  iconRef="⭐"           // ✅ Standardized
  trend="up"
  cardVariant="glass"     // ✅ Standardized
/>
```

#### `<StepCard>`
```tsx
<StepCard 
  step={1}                // Step number
  title="Create Account"  // ✅ Standardized
  text="Sign up in 30 seconds"  // ✅ Standardized (alternative to children)
  cardVariant="bordered"  // ✅ Standardized
/>
```

---

## 🔄 Migration Guide: Old → New Props

### Text Content
```tsx
// ❌ OLD (inconsistent)
<Badge>New</Badge>
<Text>Hello</Text>
<Button>Click</Button>

// ✅ NEW (standardized)
<Badge text="New" />
<Text text="Hello" />
<Button text="Click" />
```

### Visual Content
```tsx
// ❌ OLD (inconsistent)
<Icon>🚀</Icon>
<HeroWithText hero="🎓" ... />

// ✅ NEW (standardized)
<Icon iconRef="🚀" />
<HeroWithText heroRef="🎓" ... />
```

### Composition Props
```tsx
// ❌ OLD (inconsistent)
<CardWithBadge badge="New" ... />

// ✅ NEW (standardized)
<CardWithBadge badgeText="New" ... />
```

---

## ✅ Validation Rules

1. **Text Props**: `text`, `title`, `subtitle`, `label` must be strings
2. **Visual Props**: `iconRef`, `imageRef`, `lottieRef` must be strings (URL/path/emoji)
3. **Style Props**: `variant`, `size`, `color` must match allowed values (validated via TypeScript/PropTypes in future)
4. **Children**: Use for complex/rich content only; prefer `text` for simple strings

---

## 📚 Benefits of Standardization

1. ✅ **Predictable**: Developers instantly know `text` = string, `*Ref` = asset
2. ✅ **JSON-Friendly**: Easy to serialize/deserialize for JSON-driven scenes
3. ✅ **Type-Safe**: Clear prop types enable better TypeScript definitions
4. ✅ **Discoverable**: Consistent naming reduces cognitive load

---

## 🚀 Future Enhancements

- [ ] Add TypeScript types for all prop schemas
- [ ] Add runtime prop validation (PropTypes or Zod)
- [ ] Generate JSON schema for element configs
- [ ] Build visual prop editor (UI for JSON generation)

---

**Last Updated**: 2025-11-20  
**Version**: 1.0  
**Status**: ✅ Enforced across all 13 elements
