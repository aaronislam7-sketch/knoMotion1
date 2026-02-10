# KnoSlides Build Status - Unified Template Architecture

## Status: Ready for Merge

**Last Updated:** February 10, 2026  
**Phase:** Core phases complete (0-5), authoring tooling integrated in dev environment

---

## Overview

KnoSlides is a guided construction system for bite-sized learning. It sits between video exposure and quiz assessment in the Knode learning flow:

| Primitive | Role | Engagement |
|-----------|------|------------|
| Videos | Expose concepts and intuition | Passive, linear |
| Slides | Build understanding through guided construction | Active, scaffolded |
| Quizzes | Assess retention without support | Active, unscaffolded |

**Key differentiator:** Slides are interactive checkpoints where learners construct understanding with scaffolding - not presentations, not quizzes, not LLM chat wrappers.

---

## Architecture

```
Slide JSON (preview/*.json)
  └── SlideRenderer (src/core/SlideRenderer.tsx)
       ├── SlideStateProvider (src/core/SlideStateContext.tsx) - State management
       ├── SlideEventProvider (src/core/SlideEventContext.tsx) - Event bus
       ├── BlockRegistryProvider (src/core/BlockRegistry.tsx) - Block lookup
       └── SlotResolver (src/core/SlotResolver.tsx) - Layout system
            └── BlockRenderer → Content Block Components (src/blocks/)
```

### Entry Points

| Context | File | Description |
|---------|------|-------------|
| Main Preview | `KnoMotion-Videos/src/admin/SlidesPreview.jsx` | Full preview environment (imports local `KnoSlides/src/index.css` and local renderer source) |
| Standalone Dev | `KnoSlides/src/App.tsx` | Minimal standalone testing |
| Library Export | `KnoSlides/src/index.ts` | npm package exports |
| Dev Authoring | `KnoMotion-Videos/src/admin/slides-builder/SlideBuilder.jsx` | Dev-only visual Slide JSON builder (structured fields + live preview) |

### How It Works

1. **JSON Content** (`preview/*.json`) defines the slide: concept, layout, steps, tasks, and content blocks
2. **SlideRenderer** orchestrates step progression, task gating, and event handling
3. **SlotResolver** arranges content blocks into named layout regions
4. **BlockRegistry** maps block types to React components
5. **Content Blocks** render UI and emit events for task validation

---

## File Structure

```
KnoSlides/
├── Docs/
│   └── BUILD_STATUS.md           # This file
│
├── preview/                       # Content JSON files
│   ├── build-and-verify-inner-join.json    # SQL INNER JOIN example
│   ├── flow-simulator-api-auth.json        # API Auth Flow example
│   └── repair-model-python-bug.json        # Python debugging example
│
├── src/
│   ├── core/                      # Framework layer
│   │   ├── SlideRenderer.tsx      # Main orchestrator component
│   │   ├── SlotResolver.tsx       # Layout system (columnSplit, rowStack, etc.)
│   │   ├── BlockRegistry.tsx      # Block type → component mapping
│   │   ├── SlideStateContext.tsx  # Step/task/hint state management
│   │   ├── SlideEventContext.tsx  # Inter-block event bus
│   │   └── index.ts               # Core exports
│   │
│   ├── blocks/                    # Content block components
│   │   ├── guidance/              # Guidance blocks
│   │   │   ├── ContextCard.tsx    # Title, body, key points
│   │   │   ├── TaskList.tsx       # Task checklist
│   │   │   ├── HintLadder.tsx     # Progressive hints
│   │   │   ├── Callout.tsx        # Tone-based callouts
│   │   │   └── index.ts
│   │   │
│   │   ├── content/               # Content blocks
│   │   │   ├── TextBlock.tsx      # Simple text
│   │   │   ├── TextAndCodeBlock.tsx # Text + code snippet
│   │   │   ├── TableView.tsx      # Data tables
│   │   │   ├── OutputPreview.tsx  # Current vs expected
│   │   │   ├── ReferencePanel.tsx # Tabbed reference content
│   │   │   └── index.ts
│   │   │
│   │   ├── interactive/           # Interactive blocks
│   │   │   ├── DragAndDrop.tsx    # Drag items to zones
│   │   │   ├── FlowDiagram.tsx    # Node/edge flow visualization
│   │   │   ├── CodeCompare.tsx    # Side-by-side code diff
│   │   │   ├── ErrorList.tsx      # Clickable error list
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts               # Block exports + initializeBlocks()
│   │
│   ├── types/                     # TypeScript types
│   │   ├── unified-schema.ts      # Main schema (KnoSlide, Step, Task, etc.)
│   │   ├── events.ts              # Event system types
│   │   ├── templates.ts           # Shared types (Feedback)
│   │   └── index.ts               # Type exports
│   │
│   ├── components/                # Shared UI components
│   │   ├── Card.tsx
│   │   ├── Text.tsx
│   │   ├── Icon.tsx
│   │   ├── Accordion.tsx
│   │   ├── ProgressIndicator.tsx
│   │   ├── LottiePlayer.tsx
│   │   └── index.ts
│   │
│   ├── hooks/                     # Utility hooks
│   │   ├── useResponsive.ts       # Viewport detection
│   │   ├── useScrollReveal.ts     # Scroll animations
│   │   └── index.ts
│   │
│   ├── animations/                # Animation utilities
│   │   ├── springs.ts             # Spring configs
│   │   ├── variants.ts            # Motion variants
│   │   └── index.ts
│   │
│   ├── theme/                     # Theme utilities
│   │   ├── responsive.ts          # Breakpoints
│   │   └── index.ts
│   │
│   ├── App.tsx                    # Standalone dev preview
│   ├── main.tsx                   # Dev server entry
│   ├── index.ts                   # Library exports
│   └── index.css                  # Tailwind CSS
│
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── postcss.config.js
```

---

## Slot System

Named slots ensure consistent positioning across all slides:

| Slot Name | Purpose | Position |
|-----------|---------|----------|
| `HeaderSlot` | Title, objective | Top |
| `OverviewSlot` | Concept context, "what am I seeing" | Left column |
| `TaskSlot` | Task checklist, progress | Left column (below overview) |
| `WorkspaceSlot` | Primary interactive element | Right column |
| `ReferenceSlot` | Supporting data, diagrams | Right column |
| `OutputSlot` | Result preview | Right column (bottom) |
| `FooterSlot` | Navigation, hints | Bottom |

### Layout Types

| Type | Description |
|------|-------------|
| `columnSplit` | Left guidance (1/3), right workspace (2/3) |
| `rowStack` | Vertical stacking |
| `gridSlots` | Flexible grid |
| `full` | Single column, full width |

---

## Content Blocks

### Guidance Blocks

| Block | Config | Description |
|-------|--------|-------------|
| `contextCard` | `title`, `body`, `keyPoints`, `icon`, `collapsible` | Contextual explanation |
| `taskList` | `taskIds`, `showProgress`, `variant` | Task checklist |
| `hintLadder` | `askKnoLabel`, `showLevelIndicator` | Progressive hints |
| `callout` | `tone`, `title`, `body`, `icon` | Highlighted callout (info, success, warning, error, insight) |

### Content Blocks

| Block | Config | Description |
|-------|--------|-------------|
| `textBlock` | `text`, `emphasis`, `align` | Simple text |
| `textAndCodeBlock` | `text`, `code`, `language`, `codePosition` | Text with code snippet |
| `tableView` | `columns`, `rows`, `highlightRows`, `highlightColumns` | Data table |
| `outputPreview` | `type`, `current`, `expected`, `showExpected` | Current vs expected output |
| `referencePanel` | `title`, `tabs`, `content` | Tabbed reference content |

### Interactive Blocks

| Block | Config | Description |
|-------|--------|-------------|
| `dragAndDrop` | `items`, `zones`, `layout`, `validation`, `feedback` | Drag items to drop zones |
| `flowDiagram` | `nodes`, `edges`, `highlights`, `interactive` | Flow visualization |
| `codeCompare` | `leftCode`, `rightCode`, `language`, `diffMode` | Side-by-side code diff |
| `errorList` | `items`, `showSeverity`, `selectable` | Clickable error items |

---

## Styles

- **Framework:** Tailwind CSS
- **Config:** `tailwind.config.js`
- **Entry:** `src/index.css` (imports Tailwind layers)
- **Fonts:** Teachers (primary UI + headings in current global system)

All components use Tailwind utility classes. The theme is configured in `tailwind.config.js` with custom colors and spacing.

---

## Dev Tooling Updates (Feb 2026)

- `KnoMotion-Videos` now has explicit separated views/modes for:
- `Video Builder`
- `Video Preview`
- `Slides Preview`
- `Slide Builder`
- `Slides Preview` and `Slide Builder` both consume the local `KnoSlides` source (`src/core`, `src/blocks`, and `src/index.css`) to avoid drift between preview and package code during development.
- `Slide Builder` is dev-mode only and currently:
- Uses structured field editors (not raw JSON editing for block/task authoring)
- Supports slot-aware block configuration
- Provides generated “trackable action” suggestions for task creation
- Allows optional advanced/manual task payload editing

---

## Example Templates

### 1. Build & Verify (SQL INNER JOIN)
- **File:** `preview/build-and-verify-inner-join.json`
- **Blocks:** contextCard, textAndCodeBlock, dragAndDrop, referencePanel, tableView, callout
- **Interaction:** Drag SQL keywords to build a query

### 2. Flow Simulator (API Authentication)
- **File:** `preview/flow-simulator-api-auth.json`
- **Blocks:** contextCard, callout, flowDiagram, textAndCodeBlock
- **Interaction:** Click nodes to explore authentication flow paths

### 3. Repair the Model (Python Bug)
- **File:** `preview/repair-model-python-bug.json`
- **Blocks:** contextCard, codeCompare, errorList, outputPreview, callout
- **Interaction:** Click to identify bugs in Python code

---

## Non-Negotiable Principles

1. **Meaningful engagement** - Learners must act to progress (no passive "Next")
2. **Never assume mastery** - Scaffolding remains visible throughout
3. **Not a quiz** - No scoring, no hard fails; incorrect → explanation, not judgement
4. **Behavior-driven** - Same template works for any domain (SQL, Python, APIs, etc.)
5. **4-phase model** - Every concept: explain → guided → construct → outcome

---

## Usage

### Running the Preview

```bash
# Full preview (recommended)
cd KnoMotion-Videos
npm install
npm run dev
# Use view param for direct modes:
# /?view=builder        (Video Builder)
# /?view=preview        (Video Preview)
# /?view=slides         (Slides Preview)
# /?view=slide-builder  (Slide Builder)

# Standalone KnoSlides
cd KnoSlides
npm install
npm run dev
```

### Using in Your App

```tsx
import { SlideRenderer, initializeBlocks } from '@kno/slides';
import slideData from './my-slide.json';

// Initialize blocks once at app start
initializeBlocks();

// Render a slide
<SlideRenderer
  slide={slideData}
  onStepChange={(index) => console.log('Step:', index)}
  onComplete={() => console.log('Complete!')}
/>
```

---

## Phase Completion Summary

| Phase | Description | Status |
|-------|-------------|--------|
| 0 | Alignment and Naming | ✅ Types defined |
| 1 | Core Framework | ✅ SlideRenderer, SlotResolver, BlockRegistry |
| 2 | Core Blocks | ✅ Guidance + Content blocks |
| 3 | Interactive Blocks | ✅ DragAndDrop, FlowDiagram, CodeCompare, ErrorList |
| 4 | Content Migration | ✅ 3 unified JSON examples |
| 5 | Cleanup | ✅ Legacy removed, docs updated |
| 6 | Dev Authoring Tooling | ✅ Initial Slide Builder integrated in `KnoMotion-Videos` |

---

## Future Work (Phase 5+)

- **Missing blocks:** `richText` (markdown), `media` (images, Lottie), `selectGroup`, `toggleGroup`
- **Accessibility:** ARIA labels, keyboard navigation, focus management
- **Mobile:** Touch-friendly drag-and-drop, responsive layouts
- **Validation:** Runtime warnings for steps with no required tasks
