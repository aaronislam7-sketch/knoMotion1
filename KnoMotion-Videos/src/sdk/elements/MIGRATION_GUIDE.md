# Element Prop Migration Guide

**Version**: 1.0  
**Date**: 2025-11-20

---

## 📋 Quick Reference: Old vs New Props

This guide shows how to migrate from inconsistent prop names to the new **standardized schema**.

---

## 🔄 Text Content Props

### Badge
```tsx
// ❌ OLD (inconsistent)
<Badge>New</Badge>
<Badge variant="primary">Featured</Badge>

// ✅ NEW (standardized)
<Badge text="New" />
<Badge text="Featured" variant="primary" />
```

### Button
```tsx
// ❌ OLD
<Button variant="primary">Click Me</Button>

// ✅ NEW
<Button text="Click Me" variant="primary" />
<Button text="With Icon" iconRef="🚀" variant="primary" />
```

### Text
```tsx
// ❌ OLD
<Text variant="title">Hello World</Text>

// ✅ NEW
<Text text="Hello World" variant="title" />
```

### Progress
```tsx
// ❌ OLD (no label support)
<Progress value={75} variant="primary" />

// ✅ NEW (with optional label)
<Progress value={75} label="Loading..." variant="primary" />
```

---

## 🎨 Visual Asset Props

### Icon
```tsx
// ❌ OLD
<Icon size="xl">🚀</Icon>
<Icon color="primary">⚡</Icon>

// ✅ NEW (standardized with iconRef)
<Icon iconRef="🚀" size="xl" />
<Icon iconRef="⚡" color="primary" />
```

### CardWithIcon
```tsx
// ❌ OLD
<CardWithIcon 
  icon="🚀"
  title="Fast Setup"
  layout="horizontal"
>
  <p>Description here</p>
</CardWithIcon>

// ✅ NEW (iconRef + optional text prop)
<CardWithIcon 
  iconRef="🚀"
  title="Fast Setup"
  text="Description here"
  layout="horizontal"
/>
```

### HeroWithText
```tsx
// ❌ OLD
<HeroWithText 
  hero="🎓"
  title="Learn Anything"
  subtitle="Powered by KnoMotion"
/>

// ✅ NEW (heroRef)
<HeroWithText 
  heroRef="🎓"
  title="Learn Anything"
  subtitle="Powered by KnoMotion"
/>
```

### StatCard
```tsx
// ❌ OLD
<StatCard 
  value="98%"
  label="Success Rate"
  icon="⭐"
  trend="up"
/>

// ✅ NEW (iconRef)
<StatCard 
  value="98%"
  label="Success Rate"
  iconRef="⭐"
  trend="up"
/>
```

---

## 🧩 Composition Props

### CardWithBadge
```tsx
// ❌ OLD
<CardWithBadge 
  badge="New"
  badgeVariant="success"
>
  <p>Content</p>
</CardWithBadge>

// ✅ NEW (badgeText)
<CardWithBadge 
  badgeText="New"
  badgeVariant="success"
>
  <p>Content</p>
</CardWithBadge>
```

### StepCard
```tsx
// ❌ OLD (children only)
<StepCard 
  step={1}
  title="Create Account"
>
  Sign up in 30 seconds
</StepCard>

// ✅ NEW (optional text prop)
<StepCard 
  step={1}
  title="Create Account"
  text="Sign up in 30 seconds"
/>
```

---

## 🎯 Prop Naming Pattern Summary

| Category | Old Props | New Props (Standardized) |
|----------|-----------|--------------------------|
| **Text Content** | `children` (inline text) | `text`, `title`, `subtitle`, `label` |
| **Icons** | `children` (emoji), `icon` | `iconRef` |
| **Images** | `src`, `image` | `imageRef` |
| **Lottie** | `src`, `animation` | `lottieRef` |
| **Badge Text** | `badge` | `badgeText` (in compositions) |
| **Hero Content** | `hero` | `heroRef` |

---

## 📦 JSON Serialization Example

The new standardized props make JSON-driven scenes much cleaner:

### Before (inconsistent)
```json
{
  "element": "CardWithIcon",
  "props": {
    "icon": "🚀",
    "title": "Fast Setup",
    "children": "Description text"
  }
}
```

### After (standardized)
```json
{
  "element": "CardWithIcon",
  "props": {
    "iconRef": "🚀",
    "title": "Fast Setup",
    "text": "Description text"
  }
}
```

**Benefits**:
- ✅ Clear distinction: `text` = string, `iconRef` = asset reference
- ✅ Easy to validate (all `*Ref` props are asset URLs)
- ✅ Predictable structure (no guessing prop names)

---

## 🔍 Finding & Replacing in Your Code

Use these search patterns to find old usage:

### Find Badge with children
```regex
<Badge[^>]*>[^<]+</Badge>
```
**Replace with**: `<Badge text="..." />`

### Find Icon with children
```regex
<Icon[^>]*>[^<]+</Icon>
```
**Replace with**: `<Icon iconRef="..." />`

### Find Text with children
```regex
<Text[^>]*>[^<]+</Text>
```
**Replace with**: `<Text text="..." />`

### Find CardWithIcon with icon prop
```regex
icon="([^"]+)"
```
**Replace with**: `iconRef="$1"`

---

## ✅ Validation Checklist

When migrating, ensure:

- [ ] All `<Badge>` elements use `text` prop (not children)
- [ ] All `<Button>` elements use `text` prop (not children)
- [ ] All `<Icon>` elements use `iconRef` prop (not children)
- [ ] All `<Text>` elements use `text` prop (not children)
- [ ] All `<Progress>` elements use optional `label` prop
- [ ] All `<CardWithBadge>` elements use `badgeText` prop (not `badge`)
- [ ] All `<CardWithIcon>` elements use `iconRef` prop (not `icon`)
- [ ] All `<HeroWithText>` elements use `heroRef` prop (not `hero`)
- [ ] All `<StatCard>` elements use `iconRef` prop (not `icon`)
- [ ] All composition elements use `text` prop when applicable (instead of children for simple strings)

---

## 🚀 Automated Migration Script (Future)

```bash
# Coming soon: Automated migration script
npm run migrate-elements
```

This will:
1. Find all old prop usage
2. Replace with standardized props
3. Generate migration report
4. Create backup before changes

---

## 📞 Support

If you encounter issues during migration:
1. Check `/sdk/elements/PROP_SCHEMA.md` for complete reference
2. Review `/sdk/elements/README.md` for examples
3. See `/sdk/elements/ELEMENT_RULES.md` for guidelines

---

**Last Updated**: 2025-11-20  
**Version**: 1.0  
**Status**: Active
