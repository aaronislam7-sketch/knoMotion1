# KnoSlides Build Status

## Overview

KnoSlides is an interactive React template system that complements KnoMotion (video content). While videos excel at delivering engaging, linear content, KnoSlides provides **depth** through highly interactive templates that allow learners to explore, make decisions, and engage with content at their own pace.

**Key Differentiator**: Videos are passive and linear. KnoSlides templates are interactive and non-linear, allowing personalized depth exploration.

## Architecture

```
/workspace
├── KnoMotion-Videos/     # Existing video engine (Remotion-based)
│   └── src/
│       └── admin/
│           └── SlidesPreview.jsx   # KnoSlides preview integration
└── KnoSlides/            # NEW: Interactive template system
    ├── src/
    │   ├── templates/    # The 4 core templates
    │   ├── components/   # Shared UI components
    │   ├── hooks/        # React hooks
    │   ├── animations/   # Framer Motion utilities
    │   ├── theme/        # Theme & responsive utilities
    │   └── types/        # TypeScript interfaces
    └── preview/          # Example JSON data files
```

### Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Animation Library | Framer Motion | Event-driven (click, hover) vs Remotion's frame-based |
| Styling | Tailwind CSS | Consistent with KnoMotion, rapid development |
| State Management | React useState | No persistence needed - reset on page refresh |
| TypeScript | Relaxed strictness | MVP flexibility, type safety where it matters |
| Build | Vite | Fast dev server, ES modules |

## Templates Delivered

### 1. Layered Deep Dive
**Purpose**: Progressive depth exploration - learners choose how deep to go.

**Features**:
- Expandable accordion layers (numbered 1, 2, 3, 4)
- Color-coded depth levels (blue → purple → amber → emerald)
- Progress tracking ("2 of 4 explored")
- Expand/collapse all toggle
- Rich content with summary + bullet points + tooltips

**Pedagogy**: Information depth - learners self-select complexity level.

### 2. Anatomy Explorer
**Purpose**: Understand systems by exploring component parts and relationships.

**Features**:
- Hierarchical diagram with core node centered at top
- Child nodes arranged in row below
- **Flowing animated connection lines** (CSS dash animation)
- Core connects to ALL children (not just selected)
- Cross-connections between related children
- Click node → detail panel appears below diagram
- Navigate between connected parts

**Pedagogy**: Structural understanding - deconstruct systems to understand how parts relate.

### 3. Relationship Map (Mind Map)
**Purpose**: Explore ideas connected to a central concept.

**Features**:
- Radial layout with central concept in middle
- Connected concepts arranged in circle around center
- Flowing animated lines from center to all nodes
- Curved cross-connections between related outer nodes
- Click any node for detail panel below
- Visual distinction (center = purple, outer = gray/white)

**Pedagogy**: Conceptual associations - understand how ideas relate to a central theme.

### 4. Scenario Sandbox
**Purpose**: Learn through decision-making and seeing consequences.

**Features**:
- Single-column decision-focused layout
- Decision options with letter labels (A, B, C)
- Select option → outcome reveals
- Color-coded outcomes (green/red/gray for positive/negative/neutral)
- Key takeaways listed as bullets
- "Try different approach" reset
- Multi-decision support with progress tracker

**Pedagogy**: Applied learning - understand cause and effect through simulation.

## Design Principles Applied

### Visual Aesthetic
- **Inspiration**: Notion + Brilliant.org
- **Feel**: Professional but fun, clean but not sterile
- **Typography**: Large, readable text (18px+ body)
- **Colors**: Subtle, purposeful - indigo/purple primary accents
- **No emojis in body text** - only icons where appropriate

### Animations
- **Flowing lines**: CSS `stroke-dasharray` + `animation` creates "alive" connections
- **Smooth transitions**: Framer Motion spring configs
- **Micro-interactions**: Hover states, selection feedback, progress indicators
- **Not excessive**: Animations serve purpose, not decoration

### Layout
- **Full width**: Templates render at 95% viewport width
- **No sidebars**: Detail panels appear inline below diagrams
- **Responsive foundation**: Built desktop-first, mobile-ready structure

## How to Run

From workspace root:
```bash
npm run dev
```

Then click **"Slides"** in the header to access KnoSlides preview.

Toggle between templates using the header buttons: Deep Dive | Anatomy | Mind Map | Scenario

## Content Injection

Templates accept data via JSON schema. Each template has:
- TypeScript interface in `/KnoSlides/src/types/templates.ts`
- JSON Schema in `/KnoSlides/src/templates/[TemplateName]/[TemplateName].schema.json`
- Example data in `/KnoSlides/preview/[template-name]-example.json`

Example usage:
```tsx
import { LayeredDeepDive } from '@/templates/LayeredDeepDive';
import data from './my-content.json';

<LayeredDeepDive data={data} />
```

## Shared Assets

KnoSlides reuses from KnoMotion:
- **Theme colors**: `KNODE_THEME` from `/KnoMotion-Videos/src/sdk/theme/knodeTheme.ts`
- **Lottie registry**: `LOTTIE_REGISTRY` from `/KnoMotion-Videos/src/sdk/lottie/registry.ts`
- **Tailwind config**: Extended in root `tailwind.config.js` with `kno-*` colors

## Dependencies Added

Root `package.json` now includes:
- `framer-motion` - Animation library
- `lottie-react` - Lottie player (for future Lottie integration)

## Files Modified in KnoMotion-Videos

| File | Change |
|------|--------|
| `src/admin/SlidesPreview.jsx` | Created - hosts KnoSlides preview |
| `src/App.jsx` | Added "Slides" toggle in header |
| `src/tailwind.css` | Added Google Fonts imports |

Root workspace:
| File | Change |
|------|--------|
| `package.json` | Added framer-motion, lottie-react |
| `tailwind.config.js` | Extended with kno-* colors, KnoSlides content paths |

## What's NOT Implemented

- **Webflow integration** - Out of scope for this phase
- **Mobile-first optimization** - Desktop-first MVP, responsive foundation exists
- **Lottie animations in templates** - Registry connected, not yet used in templates
- **Drag interactions** - Considered but not implemented in MVP
- **Quiz/assessment** - Handled separately per requirements
- **State persistence** - Intentionally resets on page refresh

## Known Considerations

1. **Imports use relative paths**: KnoSlides imports KnoMotion assets via `../../../KnoMotion-Videos/...`
2. **Vite aliases configured**: `@` → KnoSlides/src, `@knomotion` → KnoMotion-Videos/src/sdk
3. **Standalone dev server exists** but integration preview is recommended (via main App.jsx)

## Next Steps (Suggested)

1. **User testing** - Get feedback on template interactions
2. **Content variety** - Test with diverse real content
3. **Mobile optimization** - Refine responsive breakpoints
4. **Lottie integration** - Add animations to enhance delight
5. **Additional templates** - If new pedagogical needs arise
6. **Webflow integration** - When ready for production deployment

---

*Last updated after Phase 4 refinements - templates feature Notion/Brilliant.org aesthetic, flowing line animations, and inline detail panels.*
