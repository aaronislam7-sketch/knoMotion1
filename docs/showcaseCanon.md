# KnoMotion Canon Showcase Guide

This document details the patterns, conventions, and best practices established through the Knodovia canon video series. It serves as the authoritative reference for creating consistent, high-quality KnoMotion videos.

---

## Table of Contents
1. [Scene Structure Patterns](#scene-structure-patterns)
2. [Slot Array Pattern](#slot-array-pattern)
3. [Mobile Adaptation Guide](#mobile-adaptation-guide)
4. [Mid-Scene Usage Guide](#mid-scene-usage-guide)
5. [Beat Timing Conventions](#beat-timing-conventions)
6. [Visual Styling Rules](#visual-styling-rules)
7. [The 'Error' Mascot Pattern](#the-error-mascot-pattern)
8. [LLM Fine-Tune Training Data](#llm-fine-tune-training-data)

---

## Scene Structure Patterns

### Anatomy of a Canon Scene

Every scene in the Knodovia series follows this structure:

```javascript
{
  id: 'unique-scene-id',           // Descriptive, kebab-case
  durationInFrames: 360,           // At 30fps: 360 = 12 seconds
  transition: {                    // How this scene enters
    type: 'doodle-wipe',
    direction: 'right',
    wobble: true                   // Hand-drawn feel
  },
  config: {
    format: 'mobile',              // Optional: 'desktop' | 'mobile'
    background: {
      preset: 'notebookSoft',
      layerNoise: true,
      particles: { enabled: true, style: 'sparkle', count: 10, color: '#F59E0B', opacity: 0.2, speed: 0.5 }
    },
    layout: {
      type: 'rowStack',
      options: { rows: 2, padding: 50, titleHeight: 100 }
    },
    slots: {
      header: { /* mid-scene config */ },
      row1: { /* mid-scene config */ },
      row2: { /* mid-scene config */ }
    }
  }
}
```

### Scene Intentions

Every scene should have a clear intention documented:

```javascript
/**
 * SCENE 3: Daily Rituals
 * INTENTION: Show how values translate into daily practice
 * LEARNING: Understand the rhythm of Knodovian life
 * DURATION: 16 seconds
 */
```

---

## Slot Array Pattern

The slot array pattern allows sequencing multiple mid-scenes in a single slot area, with beats controlling visibility.

### When to Use
- Transitioning between related content
- Building narrative within a slot
- Mascot commentary followed by main content
- Progressive reveals

### Pattern Structure

```javascript
slots: {
  row1: [
    {
      midScene: 'textReveal',
      stylePreset: 'mentor',
      config: {
        lines: [
          { text: 'First message appears', beats: { start: 1.0, exit: 4.0 } }
        ],
        revealType: 'fade'
      }
    },
    {
      midScene: 'heroText',
      stylePreset: 'focus',
      config: {
        text: 'Mascot chimes in',
        heroType: 'lottie',
        heroRef: 'error',
        beats: { entrance: 4.5, exit: 9.0 }  // Starts AFTER first ends
      }
    },
    {
      midScene: 'textReveal',
      stylePreset: 'playful',
      config: {
        lines: [
          { text: 'Final punchline', beats: { start: 9.5, exit: 12.0 } }
        ],
        revealType: 'slide',
        direction: 'up'
      }
    }
  ]
}
```

### Critical Rules
1. **No beat overlap** – Each mid-scene's exit should complete before the next entrance
2. **Buffer time** – Leave 0.3-0.5 seconds between exit and next entrance
3. **Same visual space** – All array items render in the same slot position
4. **Independent styling** – Each can have its own `stylePreset`

---

## Mobile Adaptation Guide

### Format Declaration
Always declare format explicitly for mobile:
```javascript
config: {
  format: 'mobile',
  // ...
}
```

### Layout Rules

| Desktop Layout | Mobile Equivalent | Notes |
|----------------|-------------------|-------|
| `columnSplit` | `rowStack` | Vertical stacking instead of side-by-side |
| `headerRowColumns` | `rowStack` with 3 rows | Simplified structure |
| `gridSlots` (3+ cols) | `gridSlots` (2 cols max) | Reduced columns |
| `sideBySide` mid-scene | Split into separate scenes | Avoid entirely on mobile |

### DO's for Mobile

```javascript
// ✅ Good: Vertical stack, 2-column grid
{
  layout: { type: 'rowStack', options: { rows: 2, padding: 40, titleHeight: 100 } },
  slots: {
    row1: {
      midScene: 'gridCards',
      config: {
        cards: [
          { icon: '🧠', label: 'Value 1', sublabel: 'Short text' },
          { icon: '🤝', label: 'Value 2', sublabel: 'Short text' }
        ],
        columns: 2  // Max 2 for mobile
      }
    }
  }
}
```

### DON'Ts for Mobile

```javascript
// ❌ Bad: Column split, 3-column grid, side-by-side
{
  layout: { type: 'columnSplit', options: { columns: 2 } },  // Won't fit
  slots: {
    col1: {
      midScene: 'gridCards',
      config: {
        cards: [/* ... */],
        columns: 3  // Too cramped
      }
    },
    col2: {
      midScene: 'sideBySide',  // Avoid on mobile
      config: { /* ... */ }
    }
  }
}
```

### Content Simplification

| Desktop | Mobile |
|---------|--------|
| 4-5 checklist items | 3-4 items max |
| 3-column grid | 2-column grid |
| Long sublabels | Short sublabels |
| Complex animations | Simpler animations |
| Multiple concepts per scene | One concept per scene |

---

## Mid-Scene Usage Guide

### textReveal
Best for: Headlines, key messages, multi-line reveals

```javascript
{
  midScene: 'textReveal',
  stylePreset: 'playful',
  config: {
    lines: [
      { text: 'Primary message', emphasis: 'high', beats: { start: 0.5, exit: 4.0, emphasis: 1.0 } },
      { text: 'Supporting detail', emphasis: 'normal', beats: { start: 1.5, exit: 5.0 } }
    ],
    revealType: 'typewriter',  // 'fade' | 'slide' | 'typewriter' | 'mask'
    staggerDelay: 0.5,
    lineSpacing: 'relaxed'
  }
}
```

### heroText
Best for: Mascot moments, hero statements, character-driven content

```javascript
{
  midScene: 'heroText',
  stylePreset: 'mentor',
  config: {
    text: 'Mascot message here',
    heroType: 'lottie',
    heroRef: 'error',  // Our mascot
    beats: { entrance: 2.0, exit: 6.0 }
  }
}
```

### gridCards
Best for: Displaying items, concepts, options

```javascript
{
  midScene: 'gridCards',
  stylePreset: 'educational',
  config: {
    cards: [
      { icon: '🧠', label: 'Title', sublabel: 'Description', animated: true },
      { image: 'data:image/svg+xml...', label: 'With image' }
    ],
    columns: 2,  // 2 for mobile, 2-3 for desktop
    animation: 'cascade',  // 'cascade' | 'bounce' | 'scale'
    beats: { start: 1.0, exit: 10.0 }
  }
}
```

### checklist
Best for: Steps, to-dos, daily routines

```javascript
{
  midScene: 'checklist',
  stylePreset: 'educational',
  config: {
    items: [
      { text: '🌅 Morning ritual', checked: true },
      { text: '☕ Midday practice', checked: true },
      { text: '🌀 Afternoon break', checked: false }  // Unchecked = different style
    ],
    icon: 'lottieCheck',  // Animated checkmark
    staggerDelay: 0.5,
    beats: { start: 1.0, exit: 12.0 }
  }
}
```

### bubbleCallout
Best for: Quotes, thoughts, social proof

```javascript
{
  midScene: 'bubbleCallout',
  stylePreset: 'playful',
  config: {
    callouts: [
      { text: '"What a great idea!"', icon: '💡' },
      { text: '"Mind = blown"', icon: '🤯' }
    ],
    pattern: 'scattered',  // 'scattered' | 'zigzag' | 'diagonal'
    animation: 'float',
    staggerDelay: 0.4,
    beats: { start: 1.0, exit: 8.0 }
  }
}
```

---

## Beat Timing Conventions

### Standard Scene Durations

| Scene Type | Frames | Seconds | Use Case |
|------------|--------|---------|----------|
| Quick hit | 240-300 | 8-10s | Single message, transition |
| Standard | 360-420 | 12-14s | Main content scenes |
| Extended | 480-600 | 16-20s | Complex content, multiple elements |

### Beat Timing Formula

```javascript
// Scene duration: 12 seconds (360 frames at 30fps)
// Content window: starts at 0.3s, ends at 11.0s (leave buffer for transitions)

beats: {
  start: 0.3,      // When element appears
  exit: 10.5,      // When element fades (0.5s buffer before scene ends)
  emphasis: 1.0    // When emphasis effect triggers (after entrance)
}
```

### Stagger Timing

For multiple items, calculate stagger:
- **Fast pace**: 0.3-0.4s between items
- **Normal pace**: 0.5-0.6s between items
- **Dramatic pace**: 0.8-1.0s between items

---

## Visual Styling Rules

### Background Selection

| Context | Recommended Preset |
|---------|-------------------|
| Opening/hook | `sunriseGradient` |
| Educational content | `notebookSoft` |
| Dramatic reveal | `spotlight` |
| Neutral/professional | `cleanCard` |
| Closing/CTA | `sunriseGradient` or `cleanCard` |

**Note**: Avoid `chalkboardGradient` – too dark for brand aesthetic.

### Transition Selection

| Context | Recommended Type |
|---------|-----------------|
| Scene opener | `slide` (direction: down) |
| Building content | `doodle-wipe` (wobble: true) |
| Topic change | `page-turn` |
| Final scene | `eraser` |
| Standard | `fade` or `slide` |

### Animation Speed
- Transitions: 30 frames (1 second) – smooth, not rushed
- Element exits: 0.8 seconds – gentle fade
- Spring animations: `{ damping: 20, stiffness: 80 }` – gentle, not bouncy

---

## The 'Error' Mascot Pattern

The 'error' Lottie serves as Knodovia's quirky guide throughout the videos.

### Usage Guidelines

1. **Introduce early** – Appear in scene 1 to establish character
2. **Comment, don't dominate** – Brief appearances with punchy lines
3. **Add personality** – Use for humour, warmth, and brand voice
4. **Consistent reference** – Always use `heroRef: 'error'`

### Pattern Example

```javascript
// Mascot comments on previous content
{
  midScene: 'heroText',
  stylePreset: 'focus',
  config: {
    text: 'Yes, confusion is scheduled.',
    heroType: 'lottie',
    heroRef: 'error',
    beats: { entrance: 7.0, exit: 11.0 }
  }
}
```

---

## LLM Fine-Tune Training Data

This section provides structured examples for training LLMs to generate high-quality KnoMotion scene configurations.

### Training Data Format (OpenAI Compatible)

```json
{
  "messages": [
    {"role": "system", "content": "You are a KnoMotion video scene generator..."},
    {"role": "user", "content": "Create a scene that..."},
    {"role": "assistant", "content": "{scene JSON}"}
  ]
}
```

---

### GOOD Examples ✅

#### Example 1: Opening Scene with Mascot

**Prompt**: Create an engaging opening scene that introduces a topic with our mascot.

**Response**:
```json
{
  "id": "topic-intro-open",
  "durationInFrames": 360,
  "transition": { "type": "slide", "direction": "down" },
  "config": {
    "background": {
      "preset": "notebookSoft",
      "layerNoise": true,
      "particles": { "enabled": true, "style": "sparkle", "count": 8, "color": "#F59E0B", "opacity": 0.15, "speed": 0.4 }
    },
    "layout": { "type": "rowStack", "options": { "rows": 2, "padding": 50, "titleHeight": 100 } },
    "slots": {
      "header": {
        "midScene": "heroText",
        "stylePreset": "mentor",
        "config": {
          "text": "Welcome to the Topic",
          "heroType": "lottie",
          "heroRef": "error",
          "beats": { "entrance": 0.3, "exit": 10.0 }
        }
      },
      "row1": {
        "midScene": "textReveal",
        "stylePreset": "playful",
        "config": {
          "lines": [
            { "text": "First key point", "emphasis": "high", "beats": { "start": 1.5, "exit": 5.0, "emphasis": 2.0 } },
            { "text": "Supporting detail", "emphasis": "normal", "beats": { "start": 3.0, "exit": 7.0 } }
          ],
          "revealType": "fade",
          "staggerDelay": 0.5,
          "lineSpacing": "relaxed"
        }
      },
      "row2": {
        "midScene": "textReveal",
        "stylePreset": "focus",
        "config": {
          "lines": [
            { "text": "Let's explore!", "emphasis": "high", "beats": { "start": 7.5, "exit": 11.0, "emphasis": 8.0 } }
          ],
          "revealType": "slide",
          "direction": "up"
        }
      }
    }
  }
}
```

---

#### Example 2: Grid Cards with Icons

**Prompt**: Create a scene showing 3 key concepts with animated icons.

**Response**:
```json
{
  "id": "three-concepts",
  "durationInFrames": 420,
  "transition": { "type": "doodle-wipe", "direction": "right", "wobble": true },
  "config": {
    "background": { "preset": "cleanCard", "layerNoise": true },
    "layout": { "type": "rowStack", "options": { "rows": 2, "padding": 50, "titleHeight": 90 } },
    "slots": {
      "header": {
        "midScene": "textReveal",
        "stylePreset": "educational",
        "config": {
          "lines": [
            { "text": "The 3 Key Concepts", "emphasis": "high", "beats": { "start": 0.3, "exit": 12.0, "emphasis": 0.8 } }
          ]
        }
      },
      "row1": {
        "midScene": "gridCards",
        "stylePreset": "playful",
        "config": {
          "cards": [
            { "icon": "🎯", "label": "Concept One", "sublabel": "Brief explanation", "animated": true },
            { "icon": "💡", "label": "Concept Two", "sublabel": "Brief explanation", "animated": true },
            { "icon": "🚀", "label": "Concept Three", "sublabel": "Brief explanation", "animated": true }
          ],
          "columns": 3,
          "animation": "cascade",
          "beats": { "start": 1.0, "exit": 12.0 }
        }
      },
      "row2": {
        "midScene": "heroText",
        "stylePreset": "mentor",
        "config": {
          "text": "Simple, right?",
          "heroType": "lottie",
          "heroRef": "error",
          "beats": { "entrance": 6.0, "exit": 13.0 }
        }
      }
    }
  }
}
```

---

#### Example 3: Slot Array with Sequential Content

**Prompt**: Create a scene where content transitions within the same slot area.

**Response**:
```json
{
  "id": "sequential-reveal",
  "durationInFrames": 480,
  "transition": { "type": "page-turn", "direction": "right" },
  "config": {
    "background": { "preset": "sunriseGradient", "layerNoise": true },
    "layout": { "type": "rowStack", "options": { "rows": 2, "padding": 50, "titleHeight": 80 } },
    "slots": {
      "header": {
        "midScene": "textReveal",
        "stylePreset": "playful",
        "config": {
          "lines": [
            { "text": "The Transformation", "emphasis": "high", "beats": { "start": 0.3, "exit": 14.0 } }
          ]
        }
      },
      "row1": [
        {
          "midScene": "textReveal",
          "stylePreset": "educational",
          "config": {
            "lines": [
              { "text": "Before: The old way", "emphasis": "normal", "beats": { "start": 1.0, "exit": 5.0 } }
            ],
            "revealType": "fade"
          }
        },
        {
          "midScene": "textReveal",
          "stylePreset": "playful",
          "config": {
            "lines": [
              { "text": "After: The new way!", "emphasis": "high", "beats": { "start": 5.5, "exit": 10.0, "emphasis": 6.0 } }
            ],
            "revealType": "fade"
          }
        }
      ],
      "row2": {
        "midScene": "heroText",
        "stylePreset": "focus",
        "config": {
          "text": "Transformation complete.",
          "heroType": "lottie",
          "heroRef": "error",
          "beats": { "entrance": 10.5, "exit": 15.0 }
        }
      }
    }
  }
}
```

---

#### Example 4: Mobile-Optimized Scene

**Prompt**: Create a mobile-friendly scene with a checklist.

**Response**:
```json
{
  "id": "mobile-checklist",
  "durationInFrames": 420,
  "transition": { "type": "slide", "direction": "left" },
  "config": {
    "format": "mobile",
    "background": { "preset": "notebookSoft", "layerNoise": true },
    "layout": { "type": "rowStack", "options": { "rows": 2, "padding": 40, "titleHeight": 90 } },
    "slots": {
      "header": {
        "midScene": "textReveal",
        "stylePreset": "playful",
        "config": {
          "lines": [
            { "text": "Your Daily Steps", "emphasis": "high", "beats": { "start": 0.3, "exit": 12.0, "emphasis": 0.8 } }
          ]
        }
      },
      "row1": {
        "midScene": "checklist",
        "stylePreset": "educational",
        "config": {
          "items": [
            { "text": "🌅 Step one description", "checked": true },
            { "text": "☕ Step two description", "checked": true },
            { "text": "🌙 Step three description", "checked": true }
          ],
          "icon": "lottieCheck",
          "staggerDelay": 0.6,
          "beats": { "start": 1.0, "exit": 12.0 }
        }
      },
      "row2": {
        "midScene": "heroText",
        "stylePreset": "mentor",
        "config": {
          "text": "You've got this!",
          "heroType": "lottie",
          "heroRef": "error",
          "beats": { "entrance": 7.0, "exit": 13.0 }
        }
      }
    }
  }
}
```

---

### BAD Examples ❌

#### Bad Example 1: Overlapping Beats

**What's wrong**: Beat timing causes content overlap

```json
{
  "slots": {
    "row1": [
      {
        "midScene": "textReveal",
        "config": {
          "lines": [
            { "text": "First", "beats": { "start": 1.0, "exit": 5.0 } }
          ]
        }
      },
      {
        "midScene": "textReveal",
        "config": {
          "lines": [
            { "text": "Second", "beats": { "start": 4.0, "exit": 8.0 } }
          ]
        }
      }
    ]
  }
}
```

**Problem**: Second starts at 4.0 but first exits at 5.0 = 1 second overlap

**Fix**: Change second to `"start": 5.5` for 0.5s buffer

---

#### Bad Example 2: Mobile with Column Layout

**What's wrong**: Using desktop-only layouts on mobile

```json
{
  "config": {
    "format": "mobile",
    "layout": { "type": "columnSplit", "options": { "columns": 2 } },
    "slots": {
      "col1": { "midScene": "textReveal" },
      "col2": { "midScene": "gridCards", "config": { "columns": 3 } }
    }
  }
}
```

**Problems**: 
- `columnSplit` doesn't fit mobile viewport
- 3-column grid is too cramped

**Fix**: Use `rowStack` and limit grid to 2 columns

---

#### Bad Example 3: Missing Beats

**What's wrong**: No timing information for content

```json
{
  "slots": {
    "row1": {
      "midScene": "textReveal",
      "config": {
        "lines": [
          { "text": "No timing specified" },
          { "text": "When do these appear?" }
        ]
      }
    }
  }
}
```

**Problem**: Content timing is undefined, may flash or appear simultaneously

**Fix**: Add `beats` to each line and at scene level

---

#### Bad Example 4: Dark Background

**What's wrong**: Using off-brand dark background

```json
{
  "config": {
    "background": { "preset": "chalkboardGradient" }
  }
}
```

**Problem**: Chalkboard is too dark for the warm, friendly brand aesthetic

**Fix**: Use `notebookSoft`, `sunriseGradient`, or `cleanCard`

---

#### Bad Example 5: Too Much Content

**What's wrong**: Overloaded scene with competing elements

```json
{
  "durationInFrames": 300,
  "config": {
    "slots": {
      "header": {
        "midScene": "textReveal",
        "config": {
          "lines": [
            { "text": "Line 1" },
            { "text": "Line 2" },
            { "text": "Line 3" }
          ]
        }
      },
      "row1": {
        "midScene": "gridCards",
        "config": {
          "cards": [
            { "label": "Card 1" },
            { "label": "Card 2" },
            { "label": "Card 3" },
            { "label": "Card 4" },
            { "label": "Card 5" },
            { "label": "Card 6" }
          ],
          "columns": 3
        }
      },
      "row2": {
        "midScene": "checklist",
        "config": {
          "items": [
            { "text": "Item 1" },
            { "text": "Item 2" },
            { "text": "Item 3" },
            { "text": "Item 4" },
            { "text": "Item 5" }
          ]
        }
      }
    }
  }
}
```

**Problems**:
- 10 seconds for 3 text lines + 6 cards + 5 checklist items
- Visual overload, no breathing room
- Rushed timing

**Fix**: Split into 2-3 scenes, reduce items per scene, extend duration

---

### Training Data Summary

When generating scenes, the LLM should:

1. **Always include beats** – Every content element needs timing
2. **Respect format** – Mobile scenes need appropriate layouts
3. **Use slot arrays correctly** – No beat overlaps, proper buffers
4. **Choose appropriate backgrounds** – Warm, on-brand presets
5. **Keep content focused** – One main concept per scene
6. **Include mascot thoughtfully** – Brief, punchy commentary
7. **Use proper transitions** – Match the narrative flow
8. **Set reasonable durations** – Allow content to breathe

---

*Last updated: December 2024*
*Canon videos: Knodovia Video 1-3 (Desktop + Mobile)*
