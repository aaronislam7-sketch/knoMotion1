# KnoSlides Build Status - Unified Template Architecture

## Current Status: Phase 4 Complete (Content Migration)

**Last Updated:** February 5, 2026

## Overview

KnoSlides is a guided construction system for bite-sized learning. It sits between video exposure and quiz assessment in the Knode learning flow:

| Primitive | Role | Engagement |
|-----------|------|------------|
| Videos | Expose concepts and intuition | Passive, linear |
| Slides | Build understanding through guided construction | Active, scaffolded |
| Quizzes | Assess retention without support | Active, unscaffolded |

Key differentiator: Slides are not presentations, not quizzes, and not LLM chat wrappers. They are interactive checkpoints where learners construct understanding with scaffolding.

This document defines the new direction: a single vanilla slide template driven by JSON, using named slots and reusable content blocks, aligned with KnoMotion's JSON-first architecture.

## Phase Completion Status

| Phase | Status | Description |
|-------|--------|-------------|
| Phase 0 | ✅ Complete | Alignment and Naming - Types defined |
| Phase 1 | ✅ Complete | Core Framework - SlideRenderer, SlotResolver, BlockRegistry |
| Phase 2 | ✅ Complete | Core Blocks - All guidance and content blocks |
| Phase 3 | ✅ Complete | Interactive Blocks - DragAndDrop, FlowDiagram, CodeCompare, ErrorList |
| Phase 4 | ✅ Complete | Content Migration - Unified JSON examples created |
| Phase 5 | 🔲 Pending | QA and Polish |

## What's Been Built

### Phase 0 - Types and Schema (`src/types/unified-schema.ts`)
- ✅ SlotName type (7 canonical slots: HeaderSlot, OverviewSlot, TaskSlot, WorkspaceSlot, ReferenceSlot, OutputSlot, FooterSlot)
- ✅ LayoutType (columnSplit, rowStack, gridSlots, full)
- ✅ BlockType (16 block types across guidance, content, and interactive categories)
- ✅ Task and Action types with validation
- ✅ Step and Hint system types
- ✅ Complete KnoSlide interface

### Phase 1 - Core Framework (`src/core/`)
- ✅ `SlideRenderer.tsx` - Main orchestrator component
  - Step state management
  - Task gating and progression
  - Feedback display
  - Completion tracking
- ✅ `SlotResolver.tsx` - Layout system
  - ColumnSplit layout (left guidance, right workspace)
  - RowStack layout (vertical stacking)
  - GridSlots layout (flexible grid)
  - Full layout (single column)
  - Visibility condition evaluation
- ✅ `BlockRegistry.tsx` - Block component registry
  - Type-safe block registration
  - Runtime block lookup
  - Placeholder for unregistered blocks
- ✅ `SlideStateContext.tsx` - State management
  - Step progression
  - Task completion tracking
  - Hint revelation
- ✅ `SlideEventContext.tsx` - Event bus
  - Inter-block communication
  - Event emission and subscription

### Phase 2 - Core Blocks (`src/blocks/`)

#### Guidance Blocks (`src/blocks/guidance/`)
- ✅ `ContextCard.tsx` - Title, body, key points, collapsible
- ✅ `TaskList.tsx` - Task checklist with status indicators
- ✅ `HintLadder.tsx` - Progressive hint revelation
- ✅ `Callout.tsx` - Tone-based callouts (info, success, warning, error, insight)

#### Content Blocks (`src/blocks/content/`)
- ✅ `TextBlock.tsx` - Simple text with emphasis
- ✅ `TextAndCodeBlock.tsx` - Text with code snippet
- ✅ `TableView.tsx` - Data tables with highlighting
- ✅ `OutputPreview.tsx` - Current vs expected comparison
- ✅ `ReferencePanel.tsx` - Tabbed reference panels

### Phase 3 - Interactive Blocks (`src/blocks/interactive/`)
- ✅ `DragAndDrop.tsx` - Drag items to drop zones
  - Uses @dnd-kit/core
  - Immediate validation
  - Event emission for task completion
- ✅ `FlowDiagram.tsx` - Node/edge flow visualization
  - Clickable nodes
  - Highlight support
  - Interactive mode
- ✅ `CodeCompare.tsx` - Side-by-side code comparison
  - Diff highlighting
  - Language support
- ✅ `ErrorList.tsx` - Selectable error items
  - Severity indicators
  - Category display
  - Click events

### Phase 4 - Content Migration (`preview/`)

Three example JSON files have been migrated to the unified schema:

#### `build-and-verify-inner-join-unified.json`
- **Topic:** SQL INNER JOIN construction
- **Template type:** Build & Verify
- **Steps:** 4 (explain → guided → construct → outcome)
- **Key blocks:** contextCard, textAndCodeBlock, dragAndDrop, referencePanel, tableView, callout
- **Tasks:** Drag-and-drop SQL query construction

#### `flow-simulator-api-auth-unified.json`
- **Topic:** API Authentication Flow
- **Template type:** Flow Simulator
- **Steps:** 4 (explain → guided → construct → outcome)
- **Key blocks:** contextCard, callout, flowDiagram, textAndCodeBlock
- **Tasks:** Explore success/failure paths by clicking flow nodes

#### `repair-model-python-bug-unified.json`
- **Topic:** Python List Comprehension Debugging
- **Template type:** Repair the Model
- **Steps:** 4 (explain → guided → construct → outcome)
- **Key blocks:** contextCard, codeCompare, errorList, outputPreview, callout
- **Tasks:** Identify and click on bugs in code

### App Integration (`src/App.tsx`, `src/main.tsx`)
- ✅ Block registry initialization in main.tsx
- ✅ Unified SlideRenderer integration
- ✅ Toggle between "Unified" and "Legacy" render modes
- ✅ All three unified JSON examples loadable

## Non-Negotiable Principles

1. Slides must force meaningful cognitive engagement
   - Learners must do something to progress
   - Passive "Next" without action is not allowed

2. Slides must never assume mastery
   - Construction is scaffolded
   - Examples, references, and hints remain visible
   - Progression: guided to constrained to lightly generative

3. Slides must not behave like quizzes
   - No scoring
   - No hard fail states
   - Incorrect actions trigger explanation, not judgement

4. Templates are behavior-driven, not content-driven
   - Same template works for donuts, electricity, SQL, etc.
   - Content changes; behavior does not

5. Concept equals the 4-step sequence
   - A concept is delivered through explain, guided, construct, outcome

## Architecture

```
Slide JSON
  -> SlideRenderer
     -> SlotResolver (named slots)
        -> ContentBlockRenderer (type registry)
           -> SDK Elements
```

### Key Layers

1. **Slide JSON** - Defines concept, layout, steps, tasks, and content blocks per slot
2. **SlideRenderer** - Orchestrates step progression, gated by task completion
3. **SlotResolver** - Resolves named slots into layout regions
4. **ContentBlockRenderer** - Renders a specific block type using block config

## Slot System (Named Slots)

| Slot Name | Purpose | Typical Position |
|----------|---------|------------------|
| HeaderSlot | Title, objective summary | Top |
| OverviewSlot | What am I seeing / concept context | Left column (top) |
| TaskSlot | Per-step tasks and progress | Left column (below overview) |
| WorkspaceSlot | Primary interactive element | Right column (top) |
| ReferenceSlot | Supporting references (data, diagrams) | Right column (mid) |
| OutputSlot | Result or preview output | Right column (bottom) |
| FooterSlot | Navigation, Ask KNO (hints) | Bottom |

## Content Blocks (SDK Element Types)

### Core Guidance
- `contextCard`: title, body, keyPoints, icon
- `taskList`: tasks, completionState
- `hintLadder`: hints, currentLevel, askKnoLabel
- `callout`: tone, title, body

### Content and Reference
- `textBlock`: text, emphasis
- `richText`: markdown, highlights (not yet implemented)
- `textAndCodeBlock`: text, code, language
- `media`: type (image, diagram, svg, lottie), src, alt (not yet implemented)
- `referencePanel`: title, type, content
- `tableView`: columns, rows, emptyState
- `outputPreview`: type, current, expected, showExpected

### Interactive
- `dragAndDrop`: items, zones, validation
- `selectGroup`: options, selectionMode, validation (not yet implemented)
- `toggleGroup`: toggles, validation (not yet implemented)
- `flowDiagram`: nodes, edges, highlights
- `codeCompare`: left, right, language, showDiff
- `errorList`: items, severity, locations

## Phase 5 - Remaining Work

### QA and Polish (Pending)
1. **No passive progression enforcement:**
   - Audit all steps to ensure tasks.required is set appropriately
   - Add runtime warning if a step has no required tasks

2. **Hints and Ask KNO flow:**
   - Ensure hintLadder appears in FooterSlot consistently
   - "Ask KNO" button triggers progressive hint reveal
   - Minimum 2 hints per step validation

3. **Mobile layouts:**
   - Test columnSplit → single column stack on mobile
   - Ensure touch targets are adequately sized
   - Test drag-and-drop on touch devices

4. **Accessibility:**
   - ARIA labels on interactive elements
   - Keyboard navigation for drag-and-drop
   - Focus management on step transitions

5. **Visual polish per mockup:**
   - Tasks panel styling with checkboxes
   - "So What?" callout styling (green accent, icon)
   - Consistent card borders, spacing, typography

6. **Missing blocks to implement:**
   - `richText` block with markdown support
   - `media` block for images, diagrams, Lottie
   - `selectGroup` block for multiple choice
   - `toggleGroup` block for toggle switches

## Running the Preview

```bash
cd KnoSlides
npm install
npm run dev
```

The preview app allows:
- Switching between all three example templates
- Toggle between "Unified" (new) and "Legacy" render modes
- Viewport testing (responsive, desktop, tablet, mobile)

## File Structure

```
KnoSlides/
├── src/
│   ├── core/
│   │   ├── SlideRenderer.tsx      # Main orchestrator
│   │   ├── SlotResolver.tsx       # Layout system
│   │   ├── BlockRegistry.tsx      # Block registration
│   │   ├── SlideStateContext.tsx  # State management
│   │   └── SlideEventContext.tsx  # Event bus
│   ├── blocks/
│   │   ├── guidance/              # ContextCard, TaskList, HintLadder, Callout
│   │   ├── content/               # TextBlock, TextAndCodeBlock, TableView, etc.
│   │   └── interactive/           # DragAndDrop, FlowDiagram, CodeCompare, ErrorList
│   ├── types/
│   │   └── unified-schema.ts      # All TypeScript types
│   ├── App.tsx                    # Preview app with mode toggle
│   └── main.tsx                   # Entry point with block initialization
├── preview/
│   ├── build-and-verify-inner-join.json        # Legacy format
│   ├── build-and-verify-inner-join-unified.json # New unified format
│   ├── flow-simulator-api-auth.json            # Legacy format
│   ├── flow-simulator-api-auth-unified.json    # New unified format
│   ├── repair-model-python-bug.json            # Legacy format
│   └── repair-model-python-bug-unified.json    # New unified format
└── Docs/
    └── BUILD_STATUS.md            # This file
```

## Definition of Success

- ✅ One vanilla template with named slots
- ✅ JSON-only content injection
- ✅ SDK block registry that can pivot across domains
- 🔲 Production-ready quality (Phase 5)
