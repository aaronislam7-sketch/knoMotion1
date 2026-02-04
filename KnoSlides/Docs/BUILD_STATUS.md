# KnoSlides Build Status

## Overview

KnoSlides is a **guided construction** system for bite-sized learning. It sits between video exposure and quiz assessment in the Knode learning flow:

| Primitive | Role | Engagement |
|-----------|------|------------|
| **Videos** | Expose concepts and intuition | Passive, linear |
| **Slides** | Build understanding through guided construction | Active, scaffolded |
| **Quizzes** | Assess retention without support | Active, unscaffolded |

**Key Differentiator**: Slides are NOT presentations, NOT quizzes, and NOT LLM chat wrappers. They are interactive checkpoints where learners **construct understanding** with scaffolding.

## Non-Negotiable Principles

These principles are enforced in every template:

1. **Slides must force meaningful cognitive engagement**
   - Learners must do something to progress
   - Passive "Next" without thought is not allowed

2. **Slides must never assume mastery**
   - All construction is scaffolded
   - Examples, references, and hints remain visible
   - Progression: guided → constrained → lightly generative

3. **Slides must not behave like quizzes**
   - No scoring
   - No hard fail states
   - Incorrect actions trigger explanation, not judgement

4. **Templates are behaviour-driven, not content-driven**
   - Same template works for databases, APIs, Python, etc.
   - Content changes; behaviour does not

## Templates

### 1. Build & Verify

**Use when**: Teaching how something works and how to do it.

**Required Behaviours**:
- ✓ Persistent explanation context
- ✓ Interactive model that updates live as learner acts
- ✓ Constrained construction (drag, select, reorder, fill blanks)
- ✓ Live preview of results (table, output, response)
- ✓ Hint ladder (minimum 2 levels)

**Exemplar**: INNER JOIN query builder
- Drag SQL keywords to build query
- See live result table update
- Source tables visible for reference

### 2. Flow Simulator

**Use when**: Teaching systems, processes, lifecycles, or causality.

**Required Behaviours**:
- ✓ Step-based progression (not scroll-based)
- ✓ Visible system state
- ✓ Branching or counterfactual paths ("what if X fails?")
- ✓ Clear cause → effect explanations
- ✓ Ability to inject or remove conditions

**Exemplar**: API Authentication Flow
- Visualize auth flow with ReactFlow
- Toggle valid/invalid credentials
- See 401 vs 200 response paths

### 3. Repair the Model

**Use when**: Teaching debugging, judgement, or common mistakes.

**Required Behaviours**:
- ✓ Present a flawed but realistic artifact
- ✓ Learner identifies or fixes the issue
- ✓ Before/after comparison
- ✓ Explanation of why the fix matters

**Exemplar**: Python list comprehension bug
- Monaco editor with buggy code
- Click to identify issues
- See output change after fixes

## Progression Model

Every slide follows this 4-phase sequence:

| Phase | Description | Learner Action |
|-------|-------------|----------------|
| **Explain** | Introduce concept visually/textually | Observe, read |
| **Guided** | Manipulate model with heavy support | Interact with scaffolding |
| **Construct** | Complete structure with bounded input | Build with constraints |
| **Outcome** | See consequences of actions | Reflect on results |

**Critical**: Progression is step-based. Scroll may exist within a step but NEVER unlocks progression.

## Architecture

```
/workspace
├── KnoMotion-Videos/     # Video engine (Remotion-based)
│   └── src/admin/
│       └── SlidesPreview.jsx   # KnoSlides preview host
│
└── KnoSlides/            # Guided construction system
    ├── src/
    │   ├── templates/
    │   │   ├── BuildAndVerify/    # Drag-drop, fill-blank, live preview
    │   │   ├── FlowSimulator/     # Node diagrams, branching, state
    │   │   └── RepairTheModel/    # Code editor, error identification
    │   ├── components/
    │   │   ├── slide/             # Shared slide components
    │   │   │   ├── StepProgress.tsx
    │   │   │   ├── HintLadder.tsx
    │   │   │   ├── ExplanationPanel.tsx
    │   │   │   ├── FeedbackIndicator.tsx
    │   │   │   └── StepNavigation.tsx
    │   │   └── [base components]
    │   ├── hooks/
    │   │   └── useSlideState.ts   # Unified state management
    │   └── types/
    │       └── templates.ts       # Type definitions
    └── preview/           # Example JSON data files
```

## Tech Stack

| Tool | Purpose | Why |
|------|---------|-----|
| **Vite + React** | Build & runtime | Fast dev, standard stack |
| **Tailwind CSS** | Styling | Consistent with KnoMotion |
| **@xyflow/react** | Flow diagrams | Flow Simulator template |
| **@dnd-kit** | Drag and drop | Build & Verify template |
| **motion** | Animations | Meaningful transitions |
| **@tanstack/react-table** | Table logic | Live preview tables |
| **@monaco-editor/react** | Code editing | Repair the Model template |

## Quality Gates

Every slide must pass ALL of these:

### 1. Aesthetic
- Clean, modern, calm design
- Clear visual hierarchy
- Animations reinforce meaning (cause → effect)

### 2. Progression
- No conceptual jumps
- Each step builds on the last
- Learner always knows WHY they're doing something

### 3. Depth
- Supports real-world complexity
- Uses layered reveal to stay bite-sized
- Does not oversimplify to distortion

### 4. Interactivity
- Interaction changes the MODEL, not just the screen
- Learner actions have visible consequences

### 5. Cognitive Safety
- No dead ends
- Errors trigger explanation
- Hints are always available

### 6. Purpose Clarity
Each slide declares:
- What understanding it builds (`learningObjective`)
- What capability it enables next (`enablesNext`)

## How to Run

From workspace root:
```bash
npm run dev
```

Click **"Slides"** in the header to access KnoSlides preview.

Toggle between templates: **Build & Verify** | **Flow Simulator** | **Repair the Model**

## Content Injection

Templates accept data via JSON schema. Each template has:
- TypeScript interface in `/KnoSlides/src/types/templates.ts`
- JSON Schema in `/KnoSlides/src/templates/[Template]/[Template].schema.json`
- Example data in `/KnoSlides/preview/[template-name].json`

Example usage:
```tsx
import { BuildAndVerifySlide } from '@/templates/BuildAndVerify';
import data from './my-inner-join-content.json';

<BuildAndVerifySlide 
  data={data} 
  onComplete={() => console.log('Done!')}
/>
```

## Definition of Success

After this refactor:

✓ **Slides cannot be replaced by an LLM chat or static deck** without losing learning value

✓ **Learners leave slides thinking**: "I understand how this works — and I'm ready to try it myself"

✓ **Slides feel clearly distinct** from both videos (passive) and quizzes (judgement)

## Legacy Templates

Previous templates (LayeredDeepDive, AnatomyExplorer, RelationshipMap, ScenarioSandbox) have been moved to `src/templates/_legacy/`. They do not meet the guided construction requirements:
- They are exploratory/passive, not constructive
- They don't require meaningful action to progress
- They could be replaced by static content without losing much

---

*Last updated after full template refactor to behaviour-driven guided construction model.*
