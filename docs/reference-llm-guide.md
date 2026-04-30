# KnoMotion LLM Reference Guide

> Strict reference for generating valid KnoMotion scene JSON configurations.

---

## Critical Rules

⚠️ **OUTPUT JSON ONLY** — Never output React/JSX code. Only valid JSON scene configurations.

⚠️ **DO NOT INVENT KEYS** — Only use documented keys. Unknown keys will cause render failure. If unsure, omit the property rather than guess. Refer to the machine-readable capability manifest (`sdk/capability-manifest.json`) for the complete list of supported mid-scenes, layouts, backgrounds, transitions, lottie keys, and constraints.

⚠️ **DO NOT DEFINE `animationPreset`** — Animation presets are implied by `stylePreset`. Do not add `animationPreset` to scene JSON. Use explicit `animation` fields on mid-scenes only if overriding defaults.

⚠️ **`sideBySide` MUST USE `layout: full`** — The `sideBySide` mid-scene creates its own internal left/right columns. NEVER put it inside `columnSplit`. This is a common mistake that wastes half the viewport.

⚠️ **AUDIO URLs MUST BE VALID** — All `src` fields in `audio.narration`, `audio.music`, and `audio.sfx[]` must be valid URLs. Placeholder strings will fail Zod schema validation. If no real audio file is available, omit the `audio` block entirely (it is optional).

```json
// ❌ WRONG - sideBySide squished into half the screen
"layout": { "type": "columnSplit", "options": { "columns": 2 } },
"slots": { "col1": { "midScene": "sideBySide" } }

// ✅ CORRECT - sideBySide fills the viewport
"layout": { "type": "full" },
"slots": { "full": { "midScene": "sideBySide" } }
```

---

## Mental Model

```
Scene = Background + Layout + Slots
  └── Slot = Timeline container + Position (receives a region of the viewport)
        └── MidScene = Content renderer (what appears in that slot)
```

**Think of it as a storyboard**: Before writing JSON, mentally plan the scene timeline:
1. What appears first? (text hook?)
2. What comes next? (visual? lottie?)
3. What's the climax? (big reveal?)
4. How does it end? (CTA? transition?)

Then translate to mid-scenes with appropriate beats.

---

## Quick Reference

### Video Structure

**Output format: Pure JSON array (no `const`, no comments, no markdown)**

```json
[
  {
    "id": "unique-scene-id",
    "durationInFrames": 300,
    "transition": { "type": "slide", "direction": "up" },
    "config": {
      "background": { "preset": "sunriseGradient", "layerNoise": true },
      "layout": { "type": "rowStack", "options": { "rows": 2, "padding": 50 } },
      "slots": {
        "header": { "midScene": "textReveal", "stylePreset": "playful", "config": {} },
        "row1": { "midScene": "gridCards", "config": {} },
        "row2": { "midScene": "checklist", "config": {} }
      }
    }
  }
]
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

Powered by `@remotion/transitions` with `TransitionSeries` and `springTiming()`.

```javascript
transition: { 
  type: 'slide',  // Required
  direction: 'up'  // For directional types
}
```

| Type | Directions | Remotion Presentation | Description |
|------|------------|----------------------|-------------|
| `fade` | — | `fade()` | Opacity crossfade |
| `slide` | up, down, left, right | `slide()` | Push in/out with spring physics |
| `page-turn` | left, right | `flip()` | 3D flip with perspective |
| `clock-wipe` | — | `clockWipe()` | Circular reveal like a clock hand |
| `iris` | — | `iris()` | Circular mask expanding from center |

---

## 5. Audio & Captions (Scene-Level)

Scene JSON supports optional `audio` and `captions` fields for narration, background music, sound effects, and animated subtitles.

### Audio Config

```json
{
  "id": "narrated-scene",
  "durationInFrames": 300,
  "audio": {
    "narration": {
      "src": "https://cdn.example.com/narration.mp3",
      "startFromSeconds": 0,
      "volume": 1.0
    },
    "music": {
      "src": "https://cdn.example.com/ambient.mp3",
      "volume": 0.15,
      "fadeIn": 1.0,
      "fadeOut": 1.5,
      "loop": true
    },
    "sfx": [
      { "src": "https://cdn.example.com/whoosh.mp3", "atSecond": 0.3, "volume": 0.4 },
      { "src": "https://cdn.example.com/chime.mp3", "atSecond": 3.0, "volume": 0.5 }
    ]
  },
  "config": { ... }
}
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `audio.narration.src` | string (URL) | — | TTS audio file URL |
| `audio.narration.startFromSeconds` | number | 0 | Offset to begin playback |
| `audio.narration.volume` | number (0–1) | 1.0 | Narration volume |
| `audio.music.src` | string (URL) | — | Background music file URL |
| `audio.music.volume` | number (0–1) | 0.15 | Base music volume |
| `audio.music.fadeIn` | number | 0 | Fade-in duration (seconds) |
| `audio.music.fadeOut` | number | 0 | Fade-out duration (seconds) |
| `audio.music.loop` | boolean | true | Whether to loop the music |
| `audio.sfx[].src` | string (URL) | — | Sound effect file URL |
| `audio.sfx[].atSecond` | number | — | When to trigger (scene-relative seconds) |
| `audio.sfx[].volume` | number (0–1) | 0.5 | SFX volume |

**Audio failure handling:** All audio channels use `SafeAudio`, a graceful wrapper around `<Html5Audio>`. If an audio URL is unreachable, the composition continues rendering visual content and captions normally — a console warning is logged and the failed audio element is unmounted. However, each failed URL incurs a ~5-second delay while waiting for the timeout. For this reason, only include `audio` blocks when real audio URLs are available.

### Captions Config

```json
{
  "id": "captioned-scene",
  "durationInFrames": 150,
  "captions": {
    "enabled": true,
    "style": "tiktok",
    "combineTokensWithinMilliseconds": 800,
    "data": [
      { "text": "Your", "startMs": 200, "endMs": 420, "timestampMs": 310, "confidence": null },
      { "text": " brain", "startMs": 420, "endMs": 680, "timestampMs": 550, "confidence": null },
      { "text": " forgets", "startMs": 680, "endMs": 1050, "timestampMs": 865, "confidence": null }
    ]
  },
  "config": { ... }
}
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `captions.enabled` | boolean | false | Whether to render captions |
| `captions.style` | `'tiktok'` \| `'subtitle'` \| `'karaoke'` | `'tiktok'` | Caption visual style |
| `captions.combineTokensWithinMilliseconds` | number | 800 | How aggressively to group words into pages |
| `captions.data` | Caption[] | — | Word-level timestamps (from TTS) |

**Caption styles:**
- `tiktok` — Bold centered text, active word highlighted with coral color + slight scale
- `subtitle` — Traditional semi-transparent bar at the bottom
- `karaoke` — Words change from dimmed → white (active) → coral (spoken)

**Caption data format** (per `@remotion/captions`):
- `text` — Word text. Include leading space before each word (e.g., `" brain"`)
- `startMs` / `endMs` — Absolute timestamps in milliseconds
- `timestampMs` — Singular timestamp (nullable)
- `confidence` — Transcription confidence (nullable)

---

## 6. Mid-Scene Components (10 Available)

| Key | Component | Purpose |
|-----|-----------|---------|
| `textReveal` | TextRevealSequence | Animated text lines |
| `heroText` | HeroTextEntranceExit | Hero visual + text |
| `gridCards` | GridCardReveal | Icon/image card grid |
| `checklist` | ChecklistReveal | Bullet points |
| `bubbleCallout` | BubbleCalloutSequence | Floating callouts |
| `sideBySide` | SideBySideCompare | Left vs right compare |
| `iconGrid` | IconGrid | Icon-only grid |
| `cardSequence` | CardSequence | Card stack/grid |
| `bigNumber` | BigNumberReveal | Large stat display |
| `animatedCounter` | AnimatedCounter | Counting animation |

### Beats Rules

**Rule**: If a mid-scene has child elements (`lines`, `cards`, `items`), beats may exist at **child level**, **container level**, or **both**. Container `beats.start` acts as a default offset for children without explicit beats.

### Beats Requirements by Mid-Scene

| Mid-Scene | Beats Required | Notes |
|-----------|----------------|-------|
| `textReveal` | ✅ **Per-line preferred** | Each line should have `beats.start` and `beats.exit`. Container beats only as fallback. |
| `heroText` | ✅ Yes (entrance/exit) | Requires `beats.entrance` and `beats.exit` |
| `checklist` | ✅ Yes | Per-item preferred, container as fallback |
| `gridCards` | ⚠️ Grid OR container | Can use grid-level `beats.start` or per-card beats |
| `bubbleCallout` | ✅ Yes | Container-level `beats.start` |
| `sideBySide` | ✅ Yes | Container-level `beats.start` |
| `iconGrid` | ⚠️ Container level | Uses container `beats.start` for stagger |
| `cardSequence` | ⚠️ Container level | Uses container `beats.start` for stagger |
| `bigNumber` | ✅ Yes | `beats.start` and optionally `beats.exit` |
| `animatedCounter` | ✅ Yes | `beats.start` required |

**`textReveal` Beats Rule**: Always define beats per-line for precise timing control. Container-level beats should only be used as a default offset when all lines share the same timing pattern.

### Recommended vs Avoid

| Mid-Scene | Recommendation |
|-----------|----------------|
| `textReveal` | ✅ Primary choice for text |
| `heroText` | ✅ Primary choice for visuals |
| `gridCards` | ✅ Primary choice for icon grids |
| `checklist` | ✅ Primary choice for lists |
| `sideBySide` | ✅ Primary choice for comparisons |
| `bubbleCallout` | ✅ Good for annotations |
| `bigNumber` | ✅ Good for statistics |
| `animatedCounter` | ✅ Good for counting effects |
| `iconGrid` | ⚠️ Prefer `gridCards` instead |
| `cardSequence` | ⚠️ Prefer `gridCards` instead |

> **Note**: `iconGrid` and `cardSequence` are lower-level components. Prefer `gridCards` which offers more features and better defaults. Use the simpler components only when you specifically need their behavior.

---

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

⚠️ **Always use `layout: { type: "full" }`** — this mid-scene creates its own internal left/right columns. Never put it inside a `columnSplit` layout.

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

### 5.7 `iconGrid`

Pure icon grid without card styling.

```javascript
{
  midScene: 'iconGrid',
  config: {
    icons: [
      { iconRef: '🎯', label: 'Focus', color: 'primary' },
      { iconRef: '🚀', label: 'Launch', color: 'accentBlue' },
      { iconRef: '💡', label: 'Ideas', color: 'doodle' },
      { iconRef: '✨', label: 'Magic', color: 'secondary' }
    ],
    columns: 4,  // 1-8
    animation: 'cascade',  // 'fadeIn' | 'slideIn' | 'scaleIn' | 'bounceIn' | 'cascade'
    direction: 'up',  // for slideIn
    staggerDelay: 0.1,
    animationDuration: 0.5,
    iconSize: 'lg',  // 'sm' | 'md' | 'lg' | 'xl'
    gap: 40,  // pixels between icons
    showLabels: true,  // show labels below icons
    beats: { start: 1.0 }
  }
}
```

**Icon sizes**: sm (80px), md (100px), lg (120px), xl (150px)

---

### 5.8 `cardSequence`

Multiple cards in stacked or grid layout.

```javascript
{
  midScene: 'cardSequence',
  config: {
    cards: [
      { title: 'Step 1', content: 'Understand the problem', variant: 'default' },
      { title: 'Step 2', content: 'Break it into parts', variant: 'bordered' },
      { title: 'Step 3', content: 'Solve each part', variant: 'glass' }
    ],
    layout: 'stacked',  // 'stacked' | 'grid'
    columns: 3,  // for grid layout (1-6)
    animation: 'fadeSlide',  // 'fadeIn' | 'slideIn' | 'scaleIn' | 'fadeSlide'
    staggerDelay: 0.15,
    animationDuration: 0.6,
    beats: { start: 1.0 }
  }
}
```

**Card variants**: `default`, `bordered`, `glass`
**Card sizes**: `sm`, `md`, `lg`

---

### 5.9 `bigNumber`

Dramatic reveal of large statistics.

```javascript
{
  midScene: 'bigNumber',
  config: {
    number: '11,000,000',  // display value (with formatting)
    label: 'bits per second',  // optional label below
    emphasis: 'high',  // 'high' | 'normal' | 'low'
    animation: 'countUp',  // 'pop' | 'countUp' | 'typewriter' | 'fade'
    countFrom: 0,  // starting value for countUp
    color: 'primary',  // optional color override
    beats: { start: 0.5, exit: 5.0 }
  }
}
```

**Animations**:
- `pop`: Scale up from small
- `countUp`: Animate from `countFrom` to `number`
- `typewriter`: Characters appear one by one
- `fade`: Simple fade in

---

### 5.10 `animatedCounter`

Animated number counting up/down.

```javascript
{
  midScene: 'animatedCounter',
  config: {
    startValue: 0,
    endValue: 100,
    duration: 2,  // count duration in seconds
    prefix: '$',  // e.g., "$100"
    suffix: '%',  // e.g., "100%"
    label: 'completion rate',  // label below number
    color: 'primary',  // optional color
    beats: { start: 0.5 }
  }
}
```

---

## 7. Slot Arrays (Sequenced Content)

**KEY PATTERN**: A slot can be an **array of mid-scenes** instead of a single mid-scene. This creates natural-feeling sequences where content flows within the same visual space.

**Why use slot arrays?**
- Avoids needing separate scenes for small content changes
- Creates smooth "in-place" transitions
- Feels more dynamic and engaging

```javascript
slots: {
  row1: [  // ← ARRAY syntax
    { 
      midScene: 'textReveal', 
      config: { 
        lines: [{ text: 'First message' }],
        beats: { start: 0.5, exit: 3.0 }  // exits at 3s
      }
    },
    { 
      midScene: 'textReveal', 
      config: { 
        lines: [{ text: 'Then this appears!' }],
        beats: { start: 4.0, exit: 6.0 }  // enters at 4s (1s gap)
      }
    },
    {
      midScene: 'heroText',
      config: {
        text: 'Final hero',
        heroType: 'lottie',
        heroRef: 'success',
        beats: { entrance: 6.5, exit: 10.0 }  // enters at 6.5s
      }
    }
  ]
}
```

**Timeline visualization:**
```
0s    1s    2s    3s    4s    5s    6s    7s    8s    9s    10s
|─────────────────|     |─────────────|     |─────────────────────|
  "First message"         "Then this!"         Hero + Lottie
```

Each mid-scene in the array renders in the **same physical space**; beats control when each appears/disappears.
```

---

## 8. Lottie Registry

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

## 9. Theme Colors

Available color keys for `color`, `iconColor`, `dividerColor`, etc:

### Brand & Accents
| Key | Hex | Usage |
|-----|-----|-------|
| `primary` | #FF6B35 | Warm coral - main brand color |
| `secondary` | #9B59B6 | Notebook purple |
| `accentGreen` | #27AE60 | Success, positive, checkmarks |
| `accentBlue` | #3498DB | Info, highlights |
| `doodle` | #F39C12 | Hand-drawn elements, scribbles |

### Text
| Key | Hex | Usage |
|-----|-----|-------|
| `textMain` | #2C3E50 | Primary text |
| `textSoft` | #5D6D7E | Secondary text |
| `textMuted` | #95A5A6 | Tertiary/disabled text |

### Backgrounds
| Key | Hex | Usage |
|-----|-----|-------|
| `pageBg` | #FFF9F0 | Warm off-white page background |
| `pageEdge` | #F3E2C8 | Subtle edge/margin color |
| `cardBg` | #FFFFFF | Card surface |
| `ruleLine` | #F0D9B5 | Notebook lines |

### Usage in Config

```javascript
// In mid-scene config
color: 'primary'        // Use theme key
color: '#FF6B35'        // Or direct hex

// In emphasis/icon configs
iconColor: 'accentGreen'
dividerColor: 'secondary'
```

---

## 10. Animation Presets

Style presets include animation defaults. Available animation presets:

| Preset | Entrance | Stagger | Best For |
|--------|----------|---------|----------|
| `subtle` | fadeIn (0.5s) | 0.15s | Professional, minimal |
| `bouncy` | bounceIn (0.6s) | 0.2s | Playful, fun content |
| `dramatic` | fadeSlide (0.8s) | 0.3s | Emphasis moments |
| `minimal` | fadeIn (0.4s) | 0.1s | Dense content |
| `educational` | slideIn (0.5s) | 0.25s | Instructional |

### Spring Configurations

For advanced animation control:

| Config | Feel |
|--------|------|
| `gentle` | Slow, smooth |
| `smooth` | Natural motion |
| `bouncy` | Playful overshoot |
| `snappy` | Quick, responsive |
| `wobbly` | Loose, organic |

---

## 11. Complete Scene Example

```json
[
  {
    "id": "learning-tips",
    "durationInFrames": 450,
    "transition": { "type": "page-turn", "direction": "right" },
    "config": {
      "background": { 
        "preset": "notebookSoft", 
        "layerNoise": true,
        "particles": { "enabled": true, "style": "chalk", "count": 10, "opacity": 0.15 }
      },
      "layout": {
        "type": "rowStack",
        "options": { "rows": 2, "padding": 50, "titleHeight": 80 }
      },
      "slots": {
        "header": {
          "midScene": "textReveal",
          "stylePreset": "educational",
          "config": {
            "lines": [
              { 
                "text": "5 Learning Tips", 
                "emphasis": "high",
                "beats": { "start": 0.3, "emphasis": 0.8, "exit": 12.0 }
              }
            ]
          }
        },
        "row1": {
          "midScene": "heroText",
          "stylePreset": "focus",
          "config": {
            "text": "Active recall beats passive reading",
            "heroType": "lottie",
            "heroRef": "brain",
            "beats": { "entrance": 0.8, "exit": 6.0 }
          }
        },
        "row2": {
          "midScene": "checklist",
          "stylePreset": "playful",
          "config": {
            "items": [
              { "text": "Test yourself often", "checked": true, "beats": { "start": 2.0 } },
              { "text": "Space your practice", "checked": true, "beats": { "start": 3.0 } },
              { "text": "Teach what you learn", "checked": true, "beats": { "start": 4.0 } },
              { "text": "Sleep on it", "checked": true, "beats": { "start": 5.0 } },
              { "text": "Stay curious", "checked": true, "beats": { "start": 6.0 } }
            ],
            "icon": "lottieCheck",
            "iconColor": "accentGreen",
            "revealType": "spring",
            "staggerDelay": 0.3,
            "beats": { "start": 1.5, "exit": 12.0 }
          }
        }
      }
    }
  }
]
```

---

## 12. Generic Parameterized Composition

The `KnoMotionVideo` composition accepts any scene array via input props and renders it dynamically. This is the composition used by the blue-sky pipeline.

**Composition ID:** `KnoMotionVideo`

**Input Props:**
```json
{
  "scenes": [...],
  "format": "desktop"
}
```

- `scenes` — Array of scene objects (same structure as documented throughout this guide)
- `format` — `"desktop"` (1920×1080) or `"mobile"` (1080×1920). Optional, defaults to `"desktop"`.

Duration, width, and height are computed automatically via `calculateMetadata()`:
- Duration = `sum(scene.durationInFrames) - (sceneCount - 1) × 20` (transition overlap)
- Dimensions from `format`

**Rendering:**
```bash
npx remotion render KnoMotion-Videos/src/remotion/index.ts KnoMotionVideo \
  --props='{"scenes":[...],"format":"desktop"}'
```

---

## 13. Validation Checklist

Before outputting JSON, verify:

- [ ] `id` is unique string (kebab-case)
- [ ] `durationInFrames` is positive integer
- [ ] All `beats` values are in **seconds** (not frames)
- [ ] `beats.start` < `beats.exit` (when both present)
- [ ] `layout.type` is valid: `full`, `rowStack`, `columnSplit`, `gridSlots`
- [ ] Slot names match layout type (e.g., `row1` for `rowStack`, `col1` for `columnSplit`)
- [ ] **ALL declared slots are filled** (don't leave `col2` empty when using 2-column layout)
- [ ] **`sideBySide` uses `layout: full`** (it creates its own internal columns)
- [ ] `midScene` is valid: `textReveal`, `heroText`, `gridCards`, `checklist`, `bubbleCallout`, `sideBySide`, `iconGrid`, `cardSequence`, `bigNumber`, `animatedCounter`
- [ ] `heroRef` uses valid Lottie registry key or URL
- [ ] `transition.type` is valid: `fade`, `slide`, `page-turn`, `clock-wipe`, `iris`
- [ ] `background.preset` is valid: `notebookSoft`, `sunriseGradient`, `cleanCard`, `chalkboardGradient`, `spotlight`
- [ ] Content arrays (`lines`, `cards`, `items`, `callouts`) have at least 1 item
- [ ] Exit beats don't exceed scene duration in seconds
- [ ] For scenes >10s, consider exit beats to avoid content persisting too long

---

## 14. Common Patterns

### Hook Scene (TikTok/Reels)

```json
{
  "id": "hook",
  "durationInFrames": 150,
  "transition": { "type": "slide", "direction": "up" },
  "config": {
    "background": { "preset": "sunriseGradient", "layerNoise": true },
    "layout": { "type": "full", "options": { "padding": 80 } },
    "slots": {
      "full": {
        "midScene": "textReveal",
        "stylePreset": "playful",
        "config": {
          "lines": [
            { "text": "Your brain is lying to you.", "emphasis": "high", "beats": { "start": 0.3, "exit": 4.5 } }
          ],
          "revealType": "typewriter",
          "animationDuration": 1.2
        }
      }
    }
  }
}
```

### Educational Explainer

```json
{
  "id": "explain",
  "durationInFrames": 300,
  "config": {
    "background": { "preset": "notebookSoft" },
    "layout": { "type": "rowStack", "options": { "rows": 2 } },
    "slots": {
      "row1": {
        "midScene": "heroText",
        "config": {
          "text": "Key Concept",
          "heroType": "lottie",
          "heroRef": "lightbulb",
          "beats": { "entrance": 0.5, "exit": 8.0 }
        }
      },
      "row2": {
        "midScene": "gridCards",
        "config": {
          "cards": [
            { "icon": "1️⃣", "label": "Step One" },
            { "icon": "2️⃣", "label": "Step Two" },
            { "icon": "3️⃣", "label": "Step Three" }
          ],
          "columns": 3,
          "animation": "cascade",
          "beats": { "start": 1.5 }
        }
      }
    }
  }
}
```

### Comparison Scene

```json
{
  "id": "compare",
  "durationInFrames": 360,
  "config": {
    "background": { "preset": "cleanCard" },
    "layout": { "type": "full", "options": { "padding": 60 } },
    "slots": {
      "full": {
        "midScene": "sideBySide",
        "config": {
          "left": { "title": "Myth", "icon": "❌", "items": ["Common belief"] },
          "right": { "title": "Reality", "icon": "✅", "items": ["Actual truth"] },
          "dividerType": "vs",
          "beats": { "start": 0.5 }
        }
      }
    }
  }
}
```

---

## 15. Anti-Patterns (Avoid)

❌ **Beats in frames instead of seconds**
```json
"beats": { "start": 30, "exit": 90 }
```
✅ **Correct:**
```json
"beats": { "start": 1.0, "exit": 3.0 }
```

❌ **Missing required beats on textReveal lines**
```json
"lines": [{ "text": "Hello" }]
```
✅ **Correct:**
```json
"lines": [{ "text": "Hello", "beats": { "start": 0.5, "exit": 3.0 } }]
```

❌ **Invalid slot names**
```json
"layout": { "type": "rowStack", "options": { "rows": 2 } },
"slots": { "content": {} }
```
✅ **Correct:**
```json
"slots": { "row1": {}, "row2": {} }
```

❌ **Exit before start**
```json
"beats": { "start": 5.0, "exit": 2.0 }
```
✅ **Correct:**
```json
"beats": { "start": 2.0, "exit": 5.0 }
```

❌ **Using `animationPreset` (will be ignored)**
```json
"animationPreset": "bouncy"
```
✅ **Correct:** Use `stylePreset` or explicit `animation` on mid-scene config

❌ **JavaScript syntax in output**
```javascript
const scenes = [{ id: 'test' }];  // WRONG
```
✅ **Correct:** Pure JSON array
```json
[{ "id": "test" }]
```

❌ **Inventing keys**
```json
"customField": "value",
"myAnimation": "bounce"
```
✅ **Correct:** Only use documented keys

❌ **`sideBySide` inside multi-column layout (redundant)**
```json
"layout": { "type": "columnSplit", "options": { "columns": 2 } },
"slots": {
  "col1": { "midScene": "sideBySide", ... }
}
```
✅ **Correct:** `sideBySide` creates its own internal left/right split
```json
"layout": { "type": "full" },
"slots": {
  "full": { "midScene": "sideBySide", ... }
}
```

❌ **Declaring layout slots you don't fill**
```json
"layout": { "type": "columnSplit", "options": { "columns": 2 } },
"slots": {
  "col1": { ... }
}
```
✅ **Correct:** Fill ALL declared slots or reduce layout
```json
"layout": { "type": "full" },
"slots": {
  "full": { ... }
}
```

---

## Capability Manifest

A machine-readable capability manifest is available at `sdk/capability-manifest.json`. It declares all supported mid-scenes (with required fields, config options, and aliases), layouts, backgrounds, transitions, lottie keys, caption styles, constraints, and explicit unsupported capabilities.

Use this manifest for programmatic self-validation before submitting scene JSON. It includes:
- **10 mid-scenes** with required fields and key config options
- **5 layout types** with slot names
- **6 background presets**
- **8 transition types** (5 active + 3 legacy fallback)
- **40 lottie registry keys**
- **Constraints** (fps, max scenes, max grid cards, dimensions)
- **Unsupported capabilities** (no embedded video, no interactivity, no 3D, etc.)

> **Note:** This manifest is a static file. It may not reflect very recent additions. When in doubt, defer to this reference guide and the JSON schemas in `sdk/mid-scenes/schemas/`.
