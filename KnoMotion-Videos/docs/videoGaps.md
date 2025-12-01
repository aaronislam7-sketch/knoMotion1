# Video Engine Gaps Analysis

> **Document Purpose**: This document captures all features, components, and capabilities that are **currently missing** from the Knode video engine but would significantly improve video creation quality and LLM configurability.
>
> **Generated From**: Canonical Scene stress test - "Why Your Shower Goes Cold Sometimes"
>
> **Last Updated**: December 1, 2025

---

## Executive Summary

The canonical scene stress test revealed the following priority gaps:

| Priority | Category | Impact |
|----------|----------|--------|
| 🔴 Critical | Lottie Assets | Zero animations available |
| 🔴 Critical | Beat System | Audio sync impossible |
| 🟠 High | Image System | No image support |
| 🟠 High | Scene Transitions | Basic fades only |
| 🟡 Medium | Background System | Static colors only |
| 🟡 Medium | Text Enhancements | Limited styling |
| 🟢 Low | New Scene Layouts | Edge cases |

---

## 1. Lottie Animation Packs

### Current State
**Zero Lottie animations are currently available.** The `RemotionLottie` integration exists but there are no actual `.json` Lottie files in `/public/lotties/`.

### Required Theme Packs

#### 1.1 Education Pack (`/public/lotties/education/`)
```
checkmark.json        - Success/completion tick
stars-burst.json      - Achievement celebration
lightbulb.json        - Idea/insight moment
book-flip.json        - Learning/reading
pencil-write.json     - Writing/notes
brain-think.json      - Thinking/processing
question-mark.json    - Question/curiosity
exclamation.json      - Important point
trophy.json           - Achievement/win
progress-circle.json  - Loading/processing
```

#### 1.2 Technology Pack (`/public/lotties/technology/`)
```
gear-spin.json        - Settings/mechanics
wifi-pulse.json       - Connectivity
battery-charge.json   - Power/energy
cloud-sync.json       - Data/sync
code-type.json        - Programming
server-pulse.json     - Infrastructure
lock-unlock.json      - Security
notification.json     - Alerts
loading-dots.json     - Processing
cursor-click.json     - Interaction
```

#### 1.3 Nature Pack (`/public/lotties/nature/`)
```
sun-rise.json         - Morning/start
moon-phase.json       - Night/cycle
rain-drop.json        - Water (NEEDED for shower video!)
fire-flicker.json     - Heat/energy (NEEDED for shower video!)
wind-blow.json        - Air/flow
leaf-fall.json        - Change/seasons
wave-ocean.json       - Flow/movement
snowflake.json        - Cold (NEEDED for shower video!)
thermometer.json      - Temperature (CRITICAL for shower video!)
water-heater.json     - Appliance animation
```

#### 1.4 Emotions Pack (`/public/lotties/emotions/`)
```
happy-face.json       - Positive outcome
sad-face.json         - Negative/problem
surprised-face.json   - Discovery
thinking-face.json    - Consideration
thumbs-up.json        - Approval
thumbs-down.json      - Disapproval
heart-beat.json       - Love/care
laugh.json            - Humor
confused.json         - Uncertainty
mind-blown.json       - Amazement
```

#### 1.5 UI/UX Pack (`/public/lotties/ui/`)
```
arrow-right.json      - Navigation
arrow-down.json       - Scroll/continue
menu-toggle.json      - Navigation
search-zoom.json      - Search/focus
plus-add.json         - Add/create
minus-remove.json     - Remove/subtract
refresh-spin.json     - Reload
share-expand.json     - Share/spread
download.json         - Download
upload.json           - Upload
```

### Implementation Schema
```javascript
// Proposed lottie registry structure
const LOTTIE_REGISTRY = {
  education: {
    checkmark: { path: '/lotties/education/checkmark.json', loop: false, duration: 1.5 },
    // ...
  },
  technology: { /* ... */ },
  nature: { /* ... */ },
  emotions: { /* ... */ },
  ui: { /* ... */ },
};

// Usage in mid-scene config
{
  "icon": { "lottie": "nature/thermometer", "loop": true }
}
```

---

## 2. Beat System Enhancements

### Current State
Only `beats.start` is supported, which defines when an element begins animating. This is insufficient for:
- Audio synchronization
- Complex timing choreography
- Exit animations
- Emphasis moments

### Required Beat Types

#### 2.1 Core Beat Properties
```javascript
beats: {
  // EXISTING
  start: 1.0,           // When element enters (seconds)
  
  // NEEDED
  hold: 3.0,            // Duration to stay visible before exit
  exit: 4.0,            // When element begins exit animation
  emphasis: 2.0,        // When to trigger emphasis effect (pulse, glow)
  
  // ADVANCED
  sync: "voiceover",    // Sync source (voiceover, music, sfx)
  marker: "point-1",    // Named sync marker for audio alignment
}
```

#### 2.2 Scene-Level Beat Orchestration
```javascript
scene: {
  beats: {
    bpm: 120,                    // Beats per minute for music sync
    markers: [
      { id: "intro", frame: 0 },
      { id: "point-1", frame: 90 },
      { id: "emphasis", frame: 180 },
      { id: "outro", frame: 270 },
    ],
  },
  slots: {
    full: {
      midScene: "textReveal",
      config: {
        beats: { marker: "intro" }  // Sync to marker instead of absolute time
      }
    }
  }
}
```

#### 2.3 Animation Duration Control
```javascript
beats: {
  start: 1.0,
  enterDuration: 0.5,    // Override animation duration for entry
  holdDuration: 2.0,     // How long to stay at full opacity
  exitDuration: 0.3,     // Exit animation duration
  exitStyle: "fade",     // Exit animation type (fade, slide, pop)
}
```

### Audio Sync Requirements
For future voiceover/music integration:
```javascript
audio: {
  voiceover: {
    src: "/audio/shower-video-vo.mp3",
    transcript: [
      { text: "Why does your shower go cold?", start: 0, end: 2.5 },
      { text: "Let's find out", start: 2.5, end: 4.0 },
      // ...
    ]
  },
  music: {
    src: "/audio/background-music.mp3",
    bpm: 120,
    beats: [0, 0.5, 1.0, 1.5, /* ... */]
  },
  sfx: {
    whoosh: "/audio/sfx/whoosh.mp3",
    pop: "/audio/sfx/pop.mp3",
    ding: "/audio/sfx/ding.mp3",
  }
}
```

---

## 3. Image System

### Current State
**No image support exists.** Mid-scenes can only display text, icons (emoji), and Lottie animations.

### Required Components

#### 3.1 StaticImage Atom
```jsx
// New atom: sdk/elements/atoms/Image.jsx
<Image
  src="/images/water-heater.png"
  alt="Water heater diagram"
  fit="contain"           // contain, cover, fill
  position="center"       // center, top, bottom, left, right
  borderRadius={18}
  animation="fadeIn"
  style={{ /* overrides */ }}
/>
```

#### 3.2 Image-Enabled Mid-Scenes
```javascript
// GridCardReveal with images
{
  "cards": [
    { 
      "image": "/images/valve.png",
      "label": "Mixing Valve",
      "sublabel": "Controls temperature"
    }
  ]
}

// SideBySideCompare with images
{
  "left": {
    "image": "/images/cold-shower.png",
    "title": "Before"
  },
  "right": {
    "image": "/images/warm-shower.png",
    "title": "After"
  }
}
```

#### 3.3 Image Presets for LLM
```javascript
// Image registry for consistent LLM access
const IMAGE_REGISTRY = {
  placeholders: {
    person: "/images/placeholders/person.png",
    product: "/images/placeholders/product.png",
    diagram: "/images/placeholders/diagram.png",
    screenshot: "/images/placeholders/screenshot.png",
  },
  // Topic-specific images loaded dynamically
};
```

#### 3.4 Image Animation Types
```javascript
animation: "fadeIn"         // Fade in
animation: "slideIn"        // Slide from direction
animation: "zoomIn"         // Scale up from center
animation: "maskReveal"     // Reveal with mask wipe
animation: "kenBurns"       // Slow zoom/pan (for stills)
```

---

## 4. Scene Transitions

### Current State
Only basic opacity fade transitions between scenes (via `TransitionWrapper`).

### Required Transition Types

#### 4.1 Standard Transitions
```javascript
transition: {
  type: "fade",           // Current - opacity crossfade
  duration: 0.5,
}

transition: {
  type: "slide",
  direction: "left",      // left, right, up, down
  duration: 0.5,
}

transition: {
  type: "zoom",
  direction: "in",        // in, out
  duration: 0.5,
}

transition: {
  type: "wipe",
  direction: "right",     // left, right, up, down
  style: "soft",          // hard, soft
  duration: 0.5,
}
```

#### 4.2 Creative Transitions
```javascript
transition: {
  type: "morph",          // Content morphs between scenes
  duration: 0.8,
}

transition: {
  type: "flip",           // 3D flip to next scene
  axis: "horizontal",     // horizontal, vertical
  duration: 0.6,
}

transition: {
  type: "blur",           // Blur out/in
  duration: 0.5,
}

transition: {
  type: "splash",         // Ink splash/paint splatter
  color: "primary",
  duration: 0.6,
}
```

#### 4.3 Knode-Themed Transitions
```javascript
transition: {
  type: "doodle",         // Hand-drawn line wipes across
  style: "scribble",
  duration: 0.7,
}

transition: {
  type: "pageFlip",       // Notebook page turn
  duration: 0.8,
}

transition: {
  type: "eraser",         // Eraser wipes scene away
  duration: 0.6,
}
```

---

## 5. Background System

### Current State
Only solid `KNODE_THEME.colors.pageBg` background. No variation possible.

### Required Background Types

#### 5.1 Gradient Backgrounds
```javascript
background: {
  type: "gradient",
  gradient: "linear",     // linear, radial
  colors: ["pageBg", "pageEdge"],
  angle: 180,
}
```

#### 5.2 Pattern Backgrounds
```javascript
background: {
  type: "pattern",
  pattern: "dots",        // dots, grid, lines, waves, notebook
  color: "ruleLine",
  opacity: 0.3,
  scale: 1.0,
}

// Notebook-style background
background: {
  type: "notebook",
  lineSpacing: 32,
  marginLine: true,
  marginColor: "primary",
}
```

#### 5.3 Animated Backgrounds
```javascript
background: {
  type: "animated",
  effect: "particles",    // particles, waves, clouds, stars
  color: "doodle",
  speed: 0.5,
  density: 0.3,
}

// Subtle movement
background: {
  type: "animated",
  effect: "gradient-shift",
  colors: ["pageBg", "pageEdge", "pageBg"],
  duration: 10,
}
```

#### 5.4 Scene-Specific Backgrounds
```javascript
// Per-scene background override
scene: {
  background: { type: "notebook" },
  slots: { /* ... */ }
}

// Slot-specific background
slots: {
  col1: {
    background: { type: "gradient", colors: ["cardBg", "pageBg"] },
    midScene: "textReveal",
    config: { /* ... */ }
  }
}
```

---

## 6. Text Enhancements

### Current State
Text supports emphasis levels (high, normal, low) but limited styling options.

### Required Text Features

#### 6.1 Text Styles
```javascript
style: "default"          // Current
style: "handwritten"      // Permanent Marker font
style: "sketch"           // Cabin Sketch font
style: "code"             // Monospace
style: "quote"            // Italic with quote marks
```

#### 6.2 Text Effects
```javascript
effect: "none"            // Current
effect: "gradient"        // Gradient fill text
effect: "glow"            // Soft glow around text
effect: "shadow"          // Drop shadow
effect: "outline"         // Outlined text
effect: "strike"          // Strikethrough (animated)
```

#### 6.3 Animated Text Decorations
```javascript
decoration: "none"
decoration: "underline"       // Animated underline draw
decoration: "circle"          // Doodle circle around text
decoration: "highlight"       // Highlighter marker effect
decoration: "arrow"           // Arrow pointing to text
decoration: "bracket"         // Curly braces around text
```

#### 6.4 Text Animation Variations
```javascript
animation: "typewriter"       // Current
animation: "typewriter-cursor" // With blinking cursor
animation: "handwrite"        // Simulate handwriting
animation: "bounce-in"        // Each letter bounces
animation: "wave"             // Wave effect across text
animation: "scramble"         // Scramble then resolve
animation: "counter"          // Number counting animation
```

---

## 7. New Scene Layouts

### Current State
5 layouts available: `full`, `rowStack`, `columnSplit`, `headerRowColumns`, `gridSlots`

### Proposed Additional Layouts

#### 7.1 Spotlight Layout
```javascript
layout: {
  type: "spotlight",
  options: {
    focusPosition: "center",    // center, left, right
    focusWidth: 0.6,            // 60% of viewport
    blurSides: true,            // Blur unfocused areas
  }
}
// Slots: header, focus, leftBlur, rightBlur
```

#### 7.2 Picture-in-Picture Layout
```javascript
layout: {
  type: "pip",
  options: {
    mainPosition: "full",
    pipPosition: "bottomRight",  // topLeft, topRight, bottomLeft, bottomRight
    pipSize: 0.25,               // 25% of viewport
  }
}
// Slots: header, main, pip
```

#### 7.3 Split Horizontal Layout
```javascript
layout: {
  type: "splitHorizontal",
  options: {
    ratios: [0.5, 0.5],
    gap: 20,
  }
}
// Slots: header, top, bottom
```

#### 7.4 Feature Highlight Layout
```javascript
layout: {
  type: "featureHighlight",
  options: {
    imagePosition: "left",      // left, right
    imageWidth: 0.4,
    contentWidth: 0.6,
  }
}
// Slots: header, image, content
```

#### 7.5 Quote Layout
```javascript
layout: {
  type: "quote",
  options: {
    quotePosition: "center",
    authorBelow: true,
  }
}
// Slots: header, quote, author
```

---

## 8. New Mid-Scenes

### Proposed Mid-Scenes

#### 8.1 StatCounter
Animated number counter with optional prefix/suffix.
```javascript
{
  midScene: "statCounter",
  config: {
    stats: [
      { value: 17, suffix: " gallons", label: "Water per shower" },
      { value: 120, prefix: "~", suffix: "°F", label: "Ideal temp" },
    ],
    animation: "countUp",
    duration: 2.0,
  }
}
```

#### 8.2 QuoteReveal
Impactful quote display with attribution.
```javascript
{
  midScene: "quoteReveal",
  config: {
    quote: "Cold showers build character!",
    author: "Someone's Dad, probably",
    style: "handwritten",
    animation: "typewriter",
  }
}
```

#### 8.3 FlowChart
Animated flowchart/process diagram.
```javascript
{
  midScene: "flowChart",
  config: {
    nodes: [
      { id: "start", text: "Turn on shower" },
      { id: "heat", text: "Water heats up" },
      { id: "cold", text: "Someone flushes!" },
      { id: "drop", text: "Pressure drops" },
    ],
    connections: [
      { from: "start", to: "heat" },
      { from: "heat", to: "cold" },
      { from: "cold", to: "drop" },
    ],
    direction: "horizontal",
    animation: "draw",
  }
}
```

#### 8.4 BeforeAfter
Slider-style comparison.
```javascript
{
  midScene: "beforeAfter",
  config: {
    before: { image: "/images/before.png", label: "Before" },
    after: { image: "/images/after.png", label: "After" },
    animation: "slide",
    sliderPosition: 0.5,
  }
}
```

#### 8.5 Scoreboard
Comparison metrics display.
```javascript
{
  midScene: "scoreboard",
  config: {
    title: "Cold vs Hot Shower",
    rows: [
      { label: "Wake-up factor", left: "⭐⭐⭐⭐⭐", right: "⭐⭐" },
      { label: "Comfort", left: "⭐", right: "⭐⭐⭐⭐⭐" },
    ],
    animation: "stagger",
  }
}
```

---

## 9. Doodle Effects Enhancements

### Current State
`doodleEffects.jsx` has underline, circle, arrow, notebook lines/margin.

### Required Additions

#### 9.1 Additional Doodle Shapes
```javascript
getDoodleSquiggle()       // Wavy line
getDoodleStar()           // Hand-drawn star
getDoodleCheckmark()      // Sketch-style check
getDoodleX()              // Sketch-style X
getDoodleHeart()          // Hand-drawn heart
getDoodleExclamation()    // Attention mark
getDoodleBracket()        // Curly brace
```

#### 9.2 Animated Doodle Reveals
```javascript
// Config option for animated drawing
doodle: {
  type: "underline",
  animate: true,
  duration: 0.5,
  delay: 0.2,
}
```

#### 9.3 Doodle Backgrounds
```javascript
// Full-slot doodle overlays
doodleBackground: {
  elements: ["stars", "squiggles", "dots"],
  density: 0.3,
  color: "doodle",
  opacity: 0.2,
}
```

---

## 10. Video Element Requirements

### For the Shower Video Specifically

These are elements that would have made the shower video significantly better:

#### 10.1 Domain-Specific Lotties
- `thermometer.json` - Temperature gauge animation
- `water-drop.json` - Water droplet
- `fire-flame.json` - Heating element
- `snowflake.json` - Cold sensation
- `pipe-flow.json` - Water flowing through pipes
- `valve-turn.json` - Valve turning
- `pressure-gauge.json` - Pressure meter

#### 10.2 Diagram Support
- Simple animated diagrams (water heater schematic)
- Callout arrows pointing to parts
- Highlight/focus effects on diagram sections

#### 10.3 Visual Metaphors
- "Myth" badge/stamp with X
- "Fact" badge/stamp with checkmark
- "Warning" triangle animation
- "Tip" lightbulb animation

---

## 11. SDK Architecture Improvements

### 11.1 Element Variants
Need more built-in variants for atoms:
```javascript
// Card variants
variant: "default" | "bordered" | "glass" | "sketch" | "emphasis" | "warning" | "success"

// Badge variants  
variant: "default" | "outline" | "pill" | "tag" | "status"

// Divider variants
variant: "solid" | "dashed" | "dotted" | "gradient" | "doodle"
```

### 11.2 Animation Presets
Pre-configured animation combinations:
```javascript
preset: "subtle"      // Gentle, professional
preset: "playful"     // Bouncy, fun
preset: "dramatic"    // Bold, impactful
preset: "minimal"     // Nearly static
preset: "educational" // Clear, instructive
```

### 11.3 Responsive Scaling
Better automatic sizing based on slot dimensions:
```javascript
scale: {
  mode: "auto",         // Auto-fit to slot
  minFontSize: 16,
  maxFontSize: 64,
  preserveAspect: true,
}
```

---

## 12. LLM Configurability

### 12.1 Simplified Schema Mode
For simpler LLM output, offer "simple" vs "advanced" config modes:
```javascript
// Simple mode - fewer options, sensible defaults
{
  "type": "textReveal",
  "content": ["Line 1", "Line 2"],
  "style": "playful"
}

// Advanced mode - full control
{
  "type": "textReveal",
  "lines": [
    { "text": "Line 1", "emphasis": "high", "animation": {...} }
  ],
  "revealType": "slide",
  // ... full config
}
```

### 12.2 Template System
Pre-built templates for common use cases:
```javascript
template: "myth-busting"     // Auto-configures SideBySideCompare
template: "checklist"        // Auto-configures ChecklistReveal
template: "statistics"       // Auto-configures StatCounter grid
template: "quote"            // Auto-configures QuoteReveal
template: "timeline"         // Auto-configures card sequence
```

### 12.3 Content Categories
Help LLMs pick appropriate visuals:
```javascript
category: "educational"      // Suggests: icons, diagrams, checklists
category: "entertaining"     // Suggests: emojis, lottie, fun animations
category: "professional"     // Suggests: clean layouts, subtle animations
category: "marketing"        // Suggests: bold text, CTAs, stats
```

---

## 13. Quality of Life Improvements

### 13.1 Debug Mode Enhancements
```javascript
debug: {
  showSlotBounds: true,
  showTimeline: true,
  showBeatMarkers: true,
  showPerformance: true,
}
```

### 13.2 Preview Mode
Quick previews without full render:
```javascript
preview: {
  mode: "thumbnail",    // Static frame at key moments
  frames: [0, 90, 180], // Specific frames to capture
}
```

### 13.3 Export Options
```javascript
export: {
  format: "mp4",
  quality: "high",
  includeAudio: true,
  watermark: false,
  chapters: true,       // Add chapter markers
}
```

---

## Priority Roadmap

### Phase 1: Critical (Next Sprint)
1. ✅ Create basic Lottie pack (education + emotions)
2. ✅ Implement beat system with `hold` and `exit`
3. ✅ Add gradient background support
4. ✅ Add 2-3 scene transitions

### Phase 2: High Priority (Month 1)
1. Image system (StaticImage atom)
2. Complete Lottie registry
3. Text effects (gradient, glow)
4. Animated doodle reveals

### Phase 3: Medium Priority (Month 2)
1. Audio sync infrastructure
2. New scene layouts (spotlight, pip)
3. New mid-scenes (StatCounter, QuoteReveal)
4. Template system

### Phase 4: Nice to Have (Month 3+)
1. FlowChart mid-scene
2. Advanced transitions (morph, splash)
3. Debug/preview tooling
4. Export enhancements

---

## Appendix: Shower Video Specific Gaps

Elements that would have directly improved the shower video:

| Missing Element | Where Needed | Impact |
|----------------|--------------|--------|
| Thermometer Lottie | Science scene | High - visual metaphor for temperature |
| Water drop Lottie | Throughout | High - thematic consistency |
| Snowflake Lottie | Cold moments | Medium - emphasize cold |
| Fire Lottie | Heat explanation | Medium - emphasize heat |
| Pipe diagram | Science scene | High - explain mechanics |
| StatCounter | Fun facts | High - animated statistics |
| Gradient bg | Transitions | Medium - visual variety |
| Beat.hold | All scenes | High - control timing |
| Slide transition | Scene changes | Medium - variety |

---

*This document should be updated as the engine evolves and new gaps are discovered.*
