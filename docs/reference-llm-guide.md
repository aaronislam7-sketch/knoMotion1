# KnoMotion LLM Reference Guide

> Strict reference for generating valid KnoMotion scene JSON configurations.

---

## Quick Reference

### Video Structure

```javascript
const scenes = [
  {
    id: 'unique-scene-id',
    durationInFrames: 300,  // 30fps = 10 seconds
    transition: { type: 'slide', direction: 'up' },
    config: {
      background: { preset: 'sunriseGradient', layerNoise: true },
      layout: { type: 'rowStack', options: { rows: 2, padding: 50 } },
      slots: {
        header: { midScene: 'textReveal', stylePreset: 'playful', config: {...} },
        row1: { midScene: 'gridCards', config: {...} },
        row2: { midScene: 'checklist', config: {...} },
      }
    }
  }
];
```

### Time Calculation

- **FPS**: 30 frames per second (standard)
- **Beats**: Specified in **seconds** (not frames)
- **Duration**: `durationInFrames / 30 = seconds`

Example: 300 frames = 10 seconds

---

## 1. Layout Types

### `full`

Single content area.

```javascript
layout: { type: 'full', options: { padding: 60, titleHeight: 80 } }
// Slots: header, full
```

### `rowStack`

Horizontal rows (top to bottom).

```javascript
layout: { 
  type: 'rowStack', 
  options: { 
    rows: 3,  // 1-6
    rowRatios: [1, 2, 1],  // relative heights
    padding: 50,
    titleHeight: 80 
  }
}
// Slots: header, row1, row2, row3
```

### `columnSplit`

Vertical columns (left to right).

```javascript
layout: { 
  type: 'columnSplit', 
  options: { 
    columns: 2,  // 1-6
    ratios: [0.65, 0.35],  // relative widths
    padding: 60,
    titleHeight: 100 
  }
}
// Slots: header, col1, col2 (also: left, right for 2-column)
```

### `gridSlots`

Grid layout (rows × columns).

```javascript
layout: { 
  type: 'gridSlots', 
  options: { rows: 2, columns: 3, padding: 40 }
}
// Slots: header, cellA, cellB, cellC, cellD, cellE, cellF
```

---

## 2. Background Presets

| Preset | Description | Best For |
|--------|-------------|----------|
| `notebookSoft` | Lined paper overlay | Educational content |
| `sunriseGradient` | Warm diagonal gradient | Playful, engaging |
| `cleanCard` | Neutral white | Minimal, professional |
| `chalkboardGradient` | Dark blue-green | Mentor, dramatic |
| `spotlight` | Vignette focus | Important moments |

### Full Background Config

```javascript
background: {
  preset: 'sunriseGradient',
  layerNoise: true,  // Subtle film grain
  particles: {
    enabled: true,
    style: 'sparkle',  // 'dots' | 'chalk' | 'snow' | 'sparkle'
    count: 15,
    color: '#FBBF24',  // or theme key like 'primary'
    opacity: 0.25,
    speed: 0.8,
  },
  // For spotlight preset only:
  spotlight: { x: 45, y: 45, intensity: 0.25 }
}
```

---

## 3. Style Presets

Applied via `stylePreset` on slots.

| Preset | Text Style | Animation | Default Background |
|--------|------------|-----------|-------------------|
| `educational` | Title, underline doodle | educational | notebookSoft |
| `playful` | Display, highlight doodle | bouncy | sunriseGradient |
| `minimal` | Body, no decoration | minimal | cleanCard |
| `mentor` | Title, circle doodle | dramatic | chalkboardGradient |
| `focus` | Title, underline | subtle | spotlight |

---

## 4. Transitions

```javascript
transition: { 
  type: 'slide',  // Required
  direction: 'up'  // For directional types
}
```

| Type | Directions | Description |
|------|------------|-------------|
| `fade` | — | Simple opacity |
| `slide` | up, down, left, right | Directional slide |
| `page-turn` | left, right | 3D page flip |
| `doodle-wipe` | left, right | Hand-drawn wipe |
| `eraser` | — | Eraser sweep |

---

## 5. Mid-Scene Components

### 5.1 `textReveal`

Animated text lines with staggered reveals.

```javascript
{
  midScene: 'textReveal',
  stylePreset: 'playful',
  config: {
    lines: [
      { 
        text: 'First line appears', 
        emphasis: 'high',  // 'high' | 'normal' | 'low'
        beats: { start: 0.5, exit: 3.0, emphasis: 1.0 }
      },
      { 
        text: 'Second line follows', 
        emphasis: 'normal',
        beats: { start: 1.5, exit: 4.0 }
      }
    ],
    revealType: 'typewriter',  // 'typewriter' | 'fade' | 'slide' | 'mask'
    direction: 'up',  // for slide/mask: 'up' | 'down' | 'left' | 'right'
    staggerDelay: 0.4,  // seconds between lines
    animationDuration: 1.5,  // seconds per line
    lineSpacing: 'relaxed'  // 'tight' | 'normal' | 'relaxed' | 'loose'
  }
}
```

**Emphasis Effects:**
- `high`: Bold coral, background highlight, pulse animation
- `normal`: Semi-bold, main color, subtle breathe
- `low`: Regular weight, muted color

---

### 5.2 `heroText`

Hero visual (image/lottie) with accompanying text.

```javascript
{
  midScene: 'heroText',
  stylePreset: 'focus',
  config: {
    text: 'Description text here',
    heroType: 'lottie',  // 'image' | 'lottie' | 'svg'
    heroRef: 'lightbulb',  // Lottie key or image URL
    animationEntrance: 'fadeSlide',  // 'fadeIn' | 'slideIn' | 'scaleIn' | 'fadeSlide'
    animationExit: 'fadeOut',  // 'fadeOut' | 'slideOut' | 'scaleOut'
    beats: { 
      entrance: 0.6,  // when hero enters
      exit: 5.0  // when hero exits
    }
  }
}
```

---

### 5.3 `gridCards`

Icon/image cards in a grid layout.

```javascript
{
  midScene: 'gridCards',
  stylePreset: 'playful',
  config: {
    cards: [
      { 
        icon: '💡',  // emoji or icon
        label: 'Idea',
        color: 'primary',  // icon color override
        animated: true,  // pulse effect
        beats: { start: 1.0, exit: 5.0 }
      },
      { 
        image: 'https://example.com/photo.jpg',
        imageRounded: true,
        label: 'Person',
        beats: { start: 1.5, exit: 5.0 }
      }
    ],
    columns: 2,  // 1-8
    animation: 'cascade',  // 'fade' | 'slide' | 'scale' | 'bounce' | 'flip' | 'mask' | 'cascade'
    direction: 'up',  // for slide animation
    staggerDelay: 0.15,  // seconds between cards
    animationDuration: 0.4,
    showLabels: true,
    labelPosition: 'bottom',  // 'bottom' | 'top'
    cardVariant: 'default',  // 'default' | 'bordered' | 'glass' | 'flat' | 'elevated'
    beats: { start: 1.0 }  // grid-level start time
  }
}
```

---

### 5.4 `checklist`

Bullet/tick list with pop animations.

```javascript
{
  midScene: 'checklist',
  stylePreset: 'educational',
  config: {
    items: [
      { text: 'Completed task', checked: true, beats: { start: 1.0 } },
      { text: 'Pending task', checked: false, beats: { start: 1.5 } },
      'Simple text item'  // shorthand
    ],
    revealType: 'pop',  // 'pop' | 'slide' | 'fade' | 'scale' | 'spring' | 'bounceIn'
    staggerDelay: 0.25,
    animationDuration: 0.5,
    icon: 'check',  // 'check' | 'bullet' | 'dot' | 'arrow' | 'star' | 'lottieCheck'
    iconColor: 'accentGreen',
    iconSize: 1.2,  // multiplier
    alignment: 'left',  // 'left' | 'center'
    autoFitText: true,
    beats: { start: 1.0, exit: 7.0 }
  }
}
```

---

### 5.5 `bubbleCallout`

Floating speech-bubble callouts.

```javascript
{
  midScene: 'bubbleCallout',
  config: {
    callouts: [
      { text: 'Start with a clear goal', icon: '🎯' },
      { text: 'Break into small steps', icon: '📝' },
      'Simple callout text'  // shorthand
    ],
    shape: 'speech',  // 'speech' | 'rounded' | 'notebook'
    pattern: 'diagonal',  // 'scattered' | 'zigzag' | 'diagonal'
    animation: 'float',  // 'pop' | 'float' | 'slide' | 'scale' | 'fade'
    staggerDelay: 0.4,
    animationDuration: 0.6,
    beats: { start: 1.0 }
  }
}
```

---

### 5.6 `sideBySide`

Left vs right comparison.

```javascript
{
  midScene: 'sideBySide',
  stylePreset: 'playful',
  config: {
    left: {
      title: 'Before',
      subtitle: 'The old way',
      icon: '😕',
      items: ['Problem 1', 'Problem 2'],
      color: 'secondary'
    },
    right: {
      title: 'After',
      subtitle: 'The new way',
      icon: '🎉',
      items: ['Solution 1', 'Solution 2'],
      color: 'accentGreen'
    },
    animation: 'slide',  // 'slide' | 'fade' | 'scale' | 'bounce' | 'reveal'
    staggerDelay: 0.3,
    dividerType: 'vs',  // 'none' | 'line' | 'dashed' | 'vs'
    dividerLabel: 'VS',
    dividerColor: 'primary',
    alignment: 'center',  // 'center' | 'inner'
    beats: { start: 1.0 }
  }
}
```

**Mode: `beforeAfter` (image comparison slider)**

```javascript
{
  midScene: 'sideBySide',
  config: {
    mode: 'beforeAfter',
    before: {
      title: 'Before',
      media: {
        image: { src: 'https://...', fit: 'cover', borderRadius: 28 }
      }
    },
    after: {
      title: 'After',
      media: {
        image: { src: 'https://...', fit: 'cover', borderRadius: 28 }
      }
    },
    slider: {
      autoAnimate: true,
      from: 0.05,  // start position (0-1)
      to: 1.0,  // end position (0-1)
      beats: { start: 1.5, exit: 7.0 }
    },
    beats: { start: 0.5, hold: 4.8, exit: 10.0 }
  }
}
```

---

## 6. Slot Arrays (Sequenced Content)

Multiple mid-scenes in one slot using beats for timing:

```javascript
slots: {
  row1: [
    { 
      midScene: 'textReveal', 
      config: { 
        lines: [{ text: 'First message' }],
        beats: { start: 0.5, exit: 3.0 }
      }
    },
    { 
      midScene: 'textReveal', 
      config: { 
        lines: [{ text: 'Then this appears!' }],
        beats: { start: 4.0, exit: 6.0 }
      }
    },
    {
      midScene: 'heroText',
      config: {
        text: 'Final hero',
        heroType: 'lottie',
        heroRef: 'success',
        beats: { entrance: 6.5, exit: 10.0 }
      }
    }
  ]
}
```

---

## 7. Lottie Registry

### Available Keys

| Category | Keys |
|----------|------|
| **UI/Feedback** | `success`, `checkmark`, `loading`, `error` |
| **Celebrations** | `confetti`, `celebration`, `fireworks`, `sparkles`, `stars` |
| **Education** | `lightbulb`, `thinking`, `question`, `brain`, `book` |
| **Characters** | `waving`, `walking`, `thumbs-up`, `clapping` |
| **Arrows** | `arrow-right`, `arrow-down`, `swipe` |
| **Viral/TikTok** | `brain-active`, `funnel-filter`, `lightning-bolt`, `target-focus`, `clock-delay`, `signal-buffer` |
| **Science** | `atom`, `dna`, `planet`, `rocket` |
| **Music** | `music-notes`, `equalizer`, `headphones` |
| **Tech** | `laptop`, `phone`, `wifi` |
| **Weather** | `sunny`, `cloudy`, `rainy`, `snowy` |

### Usage

```javascript
// In heroText
heroType: 'lottie',
heroRef: 'lightbulb'  // use registry key

// Direct URL also works
heroRef: 'https://assets.lottiefiles.com/...'
```

---

## 8. Theme Colors

Available color keys for `color`, `iconColor`, etc:

| Key | Usage |
|-----|-------|
| `primary` | Brand coral (#FF6B6B) |
| `secondary` | Brand soft blue (#4B89DC) |
| `accentGreen` | Success/positive (#27AE60) |
| `accentBlue` | Info/highlight (#2980B9) |
| `doodle` | Hand-drawn style (#FF8A65) |
| `textMain` | Primary text (#2C3E50) |
| `textSoft` | Secondary text (#7F8C8D) |
| `pageBg` | Page background (#FAF9F6) |
| `cardBg` | Card background (#FFFFFF) |

---

## 9. Complete Scene Example

```javascript
{
  id: 'learning-tips',
  durationInFrames: 450,  // 15 seconds
  transition: { type: 'page-turn', direction: 'right' },
  config: {
    background: { 
      preset: 'notebookSoft', 
      layerNoise: true,
      particles: { enabled: true, style: 'chalk', count: 10, opacity: 0.15 }
    },
    layout: {
      type: 'rowStack',
      options: { rows: 2, padding: 50, titleHeight: 80 }
    },
    slots: {
      header: {
        midScene: 'textReveal',
        stylePreset: 'educational',
        config: {
          lines: [
            { 
              text: '5 Learning Tips', 
              emphasis: 'high',
              beats: { start: 0.3, emphasis: 0.8, exit: 12.0 }
            }
          ]
        }
      },
      row1: {
        midScene: 'heroText',
        stylePreset: 'focus',
        config: {
          text: 'Active recall beats passive reading',
          heroType: 'lottie',
          heroRef: 'brain',
          beats: { entrance: 0.8, exit: 6.0 }
        }
      },
      row2: {
        midScene: 'checklist',
        stylePreset: 'playful',
        config: {
          items: [
            { text: 'Test yourself often', checked: true, beats: { start: 2.0 } },
            { text: 'Space your practice', checked: true, beats: { start: 3.0 } },
            { text: 'Teach what you learn', checked: true, beats: { start: 4.0 } },
            { text: 'Sleep on it', checked: true, beats: { start: 5.0 } },
            { text: 'Stay curious', checked: true, beats: { start: 6.0 } }
          ],
          icon: 'lottieCheck',
          iconColor: 'accentGreen',
          revealType: 'spring',
          staggerDelay: 0.3,
          beats: { start: 1.5, exit: 12.0 }
        }
      }
    }
  }
}
```

---

## 10. Validation Checklist

Before outputting JSON, verify:

- [ ] `id` is unique string (kebab-case)
- [ ] `durationInFrames` is positive integer
- [ ] All `beats` values are in **seconds** (not frames)
- [ ] `beats.start` < `beats.exit` (when both present)
- [ ] `layout.type` is valid: `full`, `rowStack`, `columnSplit`, `gridSlots`
- [ ] Slot names match layout type (e.g., `row1` for `rowStack`, `col1` for `columnSplit`)
- [ ] `midScene` is valid: `textReveal`, `heroText`, `gridCards`, `checklist`, `bubbleCallout`, `sideBySide`
- [ ] `heroRef` uses valid Lottie registry key or URL
- [ ] `transition.type` is valid: `fade`, `slide`, `page-turn`, `doodle-wipe`, `eraser`
- [ ] `background.preset` is valid: `notebookSoft`, `sunriseGradient`, `cleanCard`, `chalkboardGradient`, `spotlight`
- [ ] Content arrays (`lines`, `cards`, `items`, `callouts`) have at least 1 item
- [ ] Exit beats don't exceed scene duration in seconds

---

## 11. Common Patterns

### Hook Scene (TikTok/Reels)

```javascript
{
  id: 'hook',
  durationInFrames: 150,  // 5 seconds
  transition: { type: 'slide', direction: 'up' },
  config: {
    background: { preset: 'sunriseGradient', layerNoise: true },
    layout: { type: 'full', options: { padding: 80 } },
    slots: {
      full: {
        midScene: 'textReveal',
        stylePreset: 'playful',
        config: {
          lines: [
            { text: 'Your brain is lying to you.', emphasis: 'high', beats: { start: 0.3, exit: 4.5 } }
          ],
          revealType: 'typewriter',
          animationDuration: 1.2
        }
      }
    }
  }
}
```

### Educational Explainer

```javascript
{
  id: 'explain',
  durationInFrames: 300,
  config: {
    background: { preset: 'notebookSoft' },
    layout: { type: 'rowStack', options: { rows: 2 } },
    slots: {
      row1: {
        midScene: 'heroText',
        config: {
          text: 'Key Concept',
          heroType: 'lottie',
          heroRef: 'lightbulb',
          beats: { entrance: 0.5, exit: 8.0 }
        }
      },
      row2: {
        midScene: 'gridCards',
        config: {
          cards: [
            { icon: '1️⃣', label: 'Step One' },
            { icon: '2️⃣', label: 'Step Two' },
            { icon: '3️⃣', label: 'Step Three' }
          ],
          columns: 3,
          animation: 'cascade',
          beats: { start: 1.5 }
        }
      }
    }
  }
}
```

### Comparison Scene

```javascript
{
  id: 'compare',
  durationInFrames: 360,
  config: {
    background: { preset: 'cleanCard' },
    layout: { type: 'columnSplit', options: { columns: 1 } },
    slots: {
      col1: {
        midScene: 'sideBySide',
        config: {
          left: { title: 'Myth', icon: '❌', items: ['Common belief'] },
          right: { title: 'Reality', icon: '✅', items: ['Actual truth'] },
          dividerType: 'vs',
          beats: { start: 0.5 }
        }
      }
    }
  }
}
```

---

## 12. Anti-Patterns (Avoid)

❌ **Beats in frames instead of seconds**
```javascript
// WRONG
beats: { start: 30, exit: 90 }

// CORRECT
beats: { start: 1.0, exit: 3.0 }
```

❌ **Missing required beats**
```javascript
// WRONG - textReveal needs beats
config: { lines: [{ text: 'Hello' }] }

// CORRECT
config: { lines: [{ text: 'Hello', beats: { start: 0.5, exit: 3.0 } }] }
```

❌ **Invalid slot names**
```javascript
// WRONG - rowStack doesn't have 'content' slot
layout: { type: 'rowStack', options: { rows: 2 } },
slots: { content: {...} }

// CORRECT
slots: { row1: {...}, row2: {...} }
```

❌ **Exit before start**
```javascript
// WRONG
beats: { start: 5.0, exit: 2.0 }

// CORRECT
beats: { start: 2.0, exit: 5.0 }
```
