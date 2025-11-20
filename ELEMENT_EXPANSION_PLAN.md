# KnoMotion Element Library Expansion Plan

**Date**: 2025-11-20  
**Goal**: Expand from 13 elements to 35+ AMAZING elements using DaisyUI

---

## 🎯 Current State

**Existing Elements (13)**:
- **Atoms (8)**: Badge, Button, Card, Divider, Icon, Indicator, Progress, Text
- **Compositions (5)**: CardWithBadge, CardWithIcon, HeroWithText, StatCard, StepCard

---

## 🚀 Expansion Plan

### Phase 1: High-Value Atomic Elements (12 new)

These are frequently used, visually impactful, and showcase-ready:

1. ✅ **Alert** - Info/success/warning/error messages (colored boxes with icons)
2. ✅ **Avatar** - User profile images with online/offline indicators
3. ✅ **Checkbox** - Checkboxes with colors and sizes
4. ✅ **Toggle** - Switch toggles for on/off states
5. ✅ **Input** - Text input fields (styled)
6. ✅ **Select** - Dropdown selection fields
7. ✅ **Loading** - Spinner/dots/ring loading animations
8. ✅ **Skeleton** - Loading state placeholders
9. ✅ **Rating** - Star ratings (visual display)
10. ✅ **Kbd** - Keyboard shortcut display (`Ctrl + K`)
11. ✅ **Link** - Styled text links
12. ✅ **RadialProgress** - Circular progress indicators

### Phase 2: Advanced Atomic Elements (8 new)

More specialized but extremely useful for showcase:

13. ✅ **Countdown** - Animated number countdown
14. ✅ **Swap** - Toggle between two visual states
15. ✅ **Timeline** - Timeline component part (for sequences)
16. ✅ **Breadcrumbs** - Navigation breadcrumbs
17. ✅ **Menu** - Navigation menu items
18. ✅ **Collapse** - Expandable/collapsible content
19. ✅ **Toast** - Notification toasts (positioned)
20. ✅ **Modal** - Dialog/modal boxes

### Phase 3: Composition Elements (10 new)

Amazing combinations that showcase the power of composition:

21. ✅ **AlertCard** - Alert inside a card
22. ✅ **FeatureCard** - Icon + Title + Description + CTA button
23. ✅ **TestimonialCard** - Avatar + Name + Quote
24. ✅ **PricingCard** - Price + Features list + CTA
25. ✅ **CalloutBox** - Highlighted content with border accent
26. ✅ **StatsRow** - Horizontal row of stat cards
27. ✅ **HeroWithCTA** - Hero + Title + Subtitle + Button
28. ✅ **ProgressCard** - Card with progress bar + label
29. ✅ **TimelineStep** - Timeline node with icon + content
30. ✅ **NavigationBar** - Menu items in a horizontal bar

---

## 📊 Prioritization

### Tier 1: MUST HAVE (Build First)
Essential for amazing showcase, high visual impact:
- Alert, Avatar, Loading, Skeleton, Rating, RadialProgress
- FeatureCard, TestimonialCard, PricingCard, HeroWithCTA

### Tier 2: SHOULD HAVE (Build Second)
Great additions, expand showcase capabilities:
- Checkbox, Toggle, Input, Select, Kbd, Link
- AlertCard, StatsRow, ProgressCard, CalloutBox

### Tier 3: NICE TO HAVE (Build Third)
Advanced features, can defer if time-constrained:
- Countdown, Swap, Timeline, Breadcrumbs, Menu, Collapse, Toast, Modal
- TimelineStep, NavigationBar

---

## 🎨 Design Principles (All New Elements)

1. ✅ **Wrapper Pattern**: Wrap DaisyUI components, apply KNODE_THEME
2. ✅ **Standardized Props**: Follow `PROP_SCHEMA.md` (text, iconRef, imageRef, lottieRef, etc.)
3. ✅ **Animation Support**: Accept `animation` prop for entrance/continuous effects
4. ✅ **Remotion-Ready**: All elements work in Remotion context (no `useCurrentFrame` violations)
5. ✅ **Pure CSS Version**: Create showcase-friendly versions for `ElementShowcase.jsx`

---

## 📦 New Folder Structure

```
/sdk/elements/
├── atoms/
│   ├── Badge.jsx (existing)
│   ├── Button.jsx (existing)
│   ├── Card.jsx (existing)
│   ├── Divider.jsx (existing)
│   ├── Icon.jsx (existing)
│   ├── Indicator.jsx (existing)
│   ├── Progress.jsx (existing)
│   ├── Text.jsx (existing)
│   ├── Alert.jsx ← NEW
│   ├── Avatar.jsx ← NEW
│   ├── Checkbox.jsx ← NEW
│   ├── Toggle.jsx ← NEW
│   ├── Input.jsx ← NEW
│   ├── Select.jsx ← NEW
│   ├── Loading.jsx ← NEW
│   ├── Skeleton.jsx ← NEW
│   ├── Rating.jsx ← NEW
│   ├── Kbd.jsx ← NEW
│   ├── Link.jsx ← NEW
│   ├── RadialProgress.jsx ← NEW
│   ├── Countdown.jsx ← NEW
│   ├── Swap.jsx ← NEW
│   ├── Timeline.jsx ← NEW
│   ├── Breadcrumbs.jsx ← NEW
│   ├── Menu.jsx ← NEW
│   ├── Collapse.jsx ← NEW
│   ├── Toast.jsx ← NEW
│   └── Modal.jsx ← NEW
├── compositions/
│   ├── CardWithBadge.jsx (existing)
│   ├── CardWithIcon.jsx (existing)
│   ├── HeroWithText.jsx (existing)
│   ├── StatCard.jsx (existing)
│   ├── StepCard.jsx (existing)
│   ├── AlertCard.jsx ← NEW
│   ├── FeatureCard.jsx ← NEW
│   ├── TestimonialCard.jsx ← NEW
│   ├── PricingCard.jsx ← NEW
│   ├── CalloutBox.jsx ← NEW
│   ├── StatsRow.jsx ← NEW
│   ├── HeroWithCTA.jsx ← NEW
│   ├── ProgressCard.jsx ← NEW
│   ├── TimelineStep.jsx ← NEW
│   └── NavigationBar.jsx ← NEW
├── index.js (export all)
├── ELEMENT_RULES.md (existing)
├── PROP_SCHEMA.md (existing)
└── README.md (update with new elements)
```

---

## 🛠️ Build Order

### Batch 1: Visual Impact (Tier 1 Atoms)
1. Alert
2. Avatar
3. Loading
4. Skeleton
5. Rating
6. RadialProgress

### Batch 2: Form Elements (Tier 2 Atoms)
7. Checkbox
8. Toggle
9. Input
10. Select
11. Kbd
12. Link

### Batch 3: Advanced Atoms (Tier 3)
13. Countdown
14. Swap
15. Timeline
16. Breadcrumbs
17. Menu
18. Collapse
19. Toast
20. Modal

### Batch 4: High-Impact Compositions (Tier 1)
21. FeatureCard
22. TestimonialCard
23. PricingCard
24. HeroWithCTA

### Batch 5: Supporting Compositions (Tier 2)
25. AlertCard
26. StatsRow
27. ProgressCard
28. CalloutBox

### Batch 6: Advanced Compositions (Tier 3)
29. TimelineStep
30. NavigationBar

---

## 📝 Acceptance Criteria (Per Element)

For each new element:

- [ ] Created in correct folder (`/atoms/` or `/compositions/`)
- [ ] Uses KNODE_THEME exclusively (no hardcoded colors/fonts)
- [ ] Follows standardized prop schema (PROP_SCHEMA.md)
- [ ] Includes JSDoc comments with prop descriptions
- [ ] Accepts `animation` prop (optional)
- [ ] Works in Remotion context (SDK version)
- [ ] Has pure CSS version for showcase (ElementShowcase.jsx)
- [ ] Exported via `/elements/index.js`
- [ ] Exported via `/sdk/index.js`
- [ ] Documented in `/elements/README.md`

---

## 🎬 Showcase Integration

Once built, update `ElementShowcase.jsx` with:
- Dedicated sections for each new element category
- Multiple variants/sizes displayed
- Real-world usage examples
- Tabbed navigation (Atoms, Compositions, Forms, Advanced, etc.)

---

## 📈 Expected Impact

**Before**: 13 elements (8 atoms, 5 compositions)  
**After**: 35 elements (20 atoms, 15 compositions)

**Benefits**:
- 2.7x more components
- Full coverage of UI patterns
- Professional showcase-ready library
- Demonstrates SDK's power and flexibility
- Ready for client/stakeholder demos

---

## 🚀 Let's Build!

Starting with **Batch 1** (Visual Impact atoms) now! 🎨
