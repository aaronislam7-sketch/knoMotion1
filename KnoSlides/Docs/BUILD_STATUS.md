# KnoSlides Build Status - Unified Template Architecture

## Overview

KnoSlides is a guided construction system for bite-sized learning. It sits between video exposure and quiz assessment in the Knode learning flow:

| Primitive | Role | Engagement |
|-----------|------|------------|
| Videos | Expose concepts and intuition | Passive, linear |
| Slides | Build understanding through guided construction | Active, scaffolded |
| Quizzes | Assess retention without support | Active, unscaffolded |

Key differentiator: Slides are not presentations, not quizzes, and not LLM chat wrappers. They are interactive checkpoints where learners construct understanding with scaffolding.

This document defines the new direction: a single vanilla slide template driven by JSON, using named slots and reusable content blocks, aligned with KnoMotion's JSON-first architecture.

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

## Architecture (Aligned with KnoMotion)

KnoMotion:
Scene JSON -> SceneFromConfig -> Mid-Scenes -> SDK Elements

KnoSlides:
Slide JSON -> SlideRenderer -> Content Blocks -> SDK Elements

```
Slide JSON
  -> SlideRenderer
     -> SlotResolver (named slots)
        -> ContentBlockRenderer (type registry)
           -> SDK Elements
```

### Key Layers

1. Slide JSON
   - Defines concept, layout, steps, tasks, and content blocks per slot

2. SlideRenderer
   - Orchestrates step progression
   - Gated by task completion (no passive advance)

3. SlotResolver
   - Resolves named slots into layout regions
   - Ensures consistent placement across slides

4. ContentBlockRenderer (SDK)
   - Renders a specific block type using block config
   - Emits events for task validation

## Slot System (Named Slots)

Slots are named to enforce consistent positioning across slides.

Recommended canonical layout (left guidance, right workspace):

| Slot Name | Purpose | Typical Position |
|----------|---------|------------------|
| HeaderSlot | Title, objective summary | Top |
| OverviewSlot | What am I seeing / concept context | Left column (top) |
| TaskSlot | Per-step tasks and progress | Left column (below overview) |
| WorkspaceSlot | Primary interactive element | Right column (top) |
| ReferenceSlot | Supporting references (data, diagrams) | Right column (mid) |
| OutputSlot | Result or preview output | Right column (bottom) |
| FooterSlot | Navigation, Ask KNO (hints) | Bottom |

Slots can be omitted for a step, but names stay consistent across templates.

## Unified Slide Schema (Draft)

This is a draft JSON schema to unify Build and Verify, Flow Simulator, and Repair the Model.

```
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "KnoSlide",
  "type": "object",
  "required": ["concept", "layout", "steps"],
  "properties": {
    "id": { "type": "string" },
    "version": { "type": "string" },
    "concept": {
      "type": "object",
      "required": ["id", "title", "learningObjective", "enablesNext"],
      "properties": {
        "id": { "type": "string" },
        "title": { "type": "string" },
        "summary": { "type": "string" },
        "learningObjective": { "type": "string" },
        "enablesNext": { "type": "string" }
      }
    },
    "layout": {
      "type": "object",
      "required": ["type", "slots"],
      "properties": {
        "type": { "enum": ["columnSplit", "rowStack", "gridSlots", "full"] },
        "stylePreset": { "type": "string" },
        "slots": {
          "type": "array",
          "items": {
            "enum": ["HeaderSlot", "OverviewSlot", "TaskSlot", "WorkspaceSlot", "ReferenceSlot", "OutputSlot", "FooterSlot"]
          }
        }
      }
    },
    "featureFlags": {
      "type": "object",
      "properties": {
        "showHints": { "type": "boolean" },
        "showTaskSlot": { "type": "boolean" },
        "showReferenceSlot": { "type": "boolean" },
        "showOutputSlot": { "type": "boolean" }
      }
    },
    "steps": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "required": ["id", "phase", "title", "instruction", "tasks", "hints", "slots"],
        "properties": {
          "id": { "type": "string" },
          "phase": { "enum": ["explain", "guided", "construct", "outcome"] },
          "title": { "type": "string" },
          "instruction": { "type": "string" },
          "tasks": {
            "type": "array",
            "minItems": 1,
            "items": {
              "type": "object",
              "required": ["id", "label", "action", "required"],
              "properties": {
                "id": { "type": "string" },
                "label": { "type": "string" },
                "required": { "type": "boolean" },
                "successMessage": { "type": "string" },
                "action": {
                  "type": "object",
                  "required": ["type"],
                  "properties": {
                    "type": { "enum": ["click", "select", "toggle", "drag", "drop", "input", "reorder", "inspect", "compare", "event"] },
                    "targetId": { "type": "string" },
                    "eventId": { "type": "string" },
                    "value": {}
                  }
                }
              }
            }
          },
          "hints": {
            "type": "array",
            "minItems": 2,
            "items": {
              "type": "object",
              "required": ["level", "content"],
              "properties": {
                "level": { "type": "number" },
                "content": { "type": "string" },
                "targetId": { "type": "string" }
              }
            }
          },
          "slots": {
            "type": "object",
            "properties": {
              "HeaderSlot": { "$ref": "#/definitions/slotBlocks" },
              "OverviewSlot": { "$ref": "#/definitions/slotBlocks" },
              "TaskSlot": { "$ref": "#/definitions/slotBlocks" },
              "WorkspaceSlot": { "$ref": "#/definitions/slotBlocks" },
              "ReferenceSlot": { "$ref": "#/definitions/slotBlocks" },
              "OutputSlot": { "$ref": "#/definitions/slotBlocks" },
              "FooterSlot": { "$ref": "#/definitions/slotBlocks" }
            }
          }
        }
      }
    },
    "completionMessage": { "type": "string" }
  },
  "definitions": {
    "slotBlocks": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "type", "config"],
        "properties": {
          "id": { "type": "string" },
          "type": { "type": "string" },
          "config": { "type": "object" },
          "stylePreset": { "type": "string" },
          "visibleWhen": { "type": "object" }
        }
      }
    }
  }
}
```

Notes:
- Tasks are per-step and contextual. Completion gates progression.
- Ask KNO maps to the hint ladder (not a separate feature).
- Content blocks emit events; tasks listen for those events.

## Content Blocks (SDK Element Types)

These blocks map to existing templates and enable new subjects.

### Core Guidance
- contextCard: title, body, keyPoints, icon
- taskList: tasks, completionState
- hintLadder: hints, currentLevel, askKnoLabel
- callout: tone, title, body

### Content and Reference
- textBlock: text, emphasis
- richText: markdown, highlights
- textAndCodeBlock: text, code, language
- media: type (image, diagram, svg, lottie), src, alt
- referencePanel: title, type, content
- tableView: columns, rows, emptyState
- outputPreview: type, current, expected, showExpected

### Interactive
- dragAndDrop: items, zones, validation
- selectGroup: options, selectionMode, validation
- toggleGroup: toggles, validation
- flowDiagram: nodes, edges, highlights
- codeCompare: left, right, language, showDiff
- errorList: items, severity, locations

Each block has its own config schema, but all blocks share:
- id, type, config
- optional stylePreset, visibleWhen

## High-Level Block Config Attributes (Examples)

- flowDiagram: nodes, edges, viewport, highlights
- dragAndDrop: items, zones, expectedMap, feedback
- codeCompare: leftCode, rightCode, language, diffMode
- referencePanel: title, contentType, contentData
- taskList: taskIds, statusMap, showProgress

## Refactor Plan (Phased)

Phase 0 - Alignment and naming
- Confirm slot names and layout types
- Finalize content block names and registry
- Lock task schema and event model

Phase 1 - Core framework
- Build SlideRenderer and SlotResolver
- Introduce block registry (content blocks)
- Implement task gating and step progression

Phase 2 - Core blocks
- contextCard, taskList, hintLadder, callout
- textBlock, textAndCodeBlock, media
- referencePanel, tableView, outputPreview

Phase 3 - Interactive blocks
- dragAndDrop (Build and Verify)
- flowDiagram + condition controls (Flow Simulator)
- codeCompare + errorList (Repair the Model)

Phase 4 - Migrate example content
- Convert preview JSON into unified schema
- Ensure slot placement and tasks per step

Phase 5 - QA and polish
- Enforce no passive progression
- Verify hints and Ask KNO flow
- Validate mobile layouts and accessibility

Definition of success:
- One vanilla template with named slots
- JSON-only content injection
- SDK block registry that can pivot across domains
