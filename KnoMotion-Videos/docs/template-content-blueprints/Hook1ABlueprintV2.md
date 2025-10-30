# Hook1A Template Blueprint v2.0
**Template:** Hook1AQuestionBurst (Agnostic)  
**Version:** 5.1  
**Status:** Production Ready  
**Last Updated:** 2025-10-30

---

## Overview

The Hook1A Question Burst template creates engaging opening sequences with a provocative question reveal, hero visual element, and branded welcome. Designed to be **domain-agnostic**, this template adapts to any subject matter through JSON configuration alone.

**Use Cases:** Cold opens, lesson introductions, attention-grabbing hooks across any domain (geography, sports, science, business, arts, history, etc.)

**Duration:** 15-18 seconds (configurable via beats)

**Key Feature:** Complete flexibility through type-based polymorphism, dynamic structure, and token-based positioning.

---

## Template Identity

### Core Pattern
**Question → Wipe → Hero Visual → Welcome → Subtitle**

### Visual Signature
- Staggered question line reveals with sparkle effects
- Dynamic hero element (image/SVG/animation)
- Shimmer effect on welcome text
- Ambient particles and liquid blob effects
- Smooth transitions with settle fade

### Emotional Tone
Thoughtful, intriguing, polished

---

## Dynamic Configuration Reference

All aspects of this template are configurable via JSON. No code changes required.

### 1. Question System (Dynamic 1-4+ Lines)

**Field:** `question`

```json
{
  "question": {
    "lines": [
      { "text": "Line of text", "emphasis": "normal" | "high" | "low" }
    ],
    "layout": {
      "arrangement": "stacked",
      "stagger": 0.3,
      "verticalSpacing": 80-100,
      "basePosition": "center",
      "centerStack": true
    },
    "animation": {
      "entrance": "fadeUp",
      "entranceDuration": 0.9,
      "entranceDistance": 50,
      "movePattern": "firstMoves" | "none" | "allMove",
      "emphasis": "pulse"
    }
  }
}
```

**Dynamic Properties:**
- **Line Count:** 1-4+ lines (auto-adjusts positioning)
- **Per-Line Emphasis:** Each line can have different emphasis
- **Stagger Timing:** Auto-calculates based on line count
- **Vertical Spacing:** Dynamic based on line count
- **Auto-Centering:** Stack auto-centers on screen

**Recommended Spacing:**
- 1 line: N/A
- 2 lines: 80-100px
- 3 lines: 90-110px
- 4 lines: 70-90px

---

### 2. Hero Visual System (Polymorphic Types)

**Field:** `hero`

```json
{
  "hero": {
    "type": "image" | "svg" | "roughSVG" | "lottie" | "custom",
    "asset": "/path/to/asset",
    "position": "center" | {grid: "center", offset: {x: 0, y: 0}},
    "animation": {
      "entrance": "fadeIn" | "drawOn",
      "entranceBeat": "mapReveal",
      "entranceDuration": 1.3
    },
    "transforms": [
      {
        "beat": "transformMap",
        "targetScale": 0.4,
        "targetPos": { "x": 600, "y": -300 },
        "duration": 1.2,
        "rotation": 0-360
      }
    ],
    "style": {
      "borderRadius": "20px",
      "boxShadow": "0 20px 60px rgba(0,0,0,0.3)"
    }
  }
}
```

**Hero Types:**

| Type | Use Case | Asset Format | Animation |
|------|----------|-------------|-----------|
| `image` | Photos, illustrations | JPG, PNG, WebP | Fade in, scale, transform |
| `svg` | Logos, diagrams, icons | SVG file | Fade in, scale, transform, rotate |
| `roughSVG` | Sketch-style maps/diagrams | Procedural (code) | Draw-on effect, transform |
| `lottie` | Complex animations | JSON animation | Playback control |
| `custom` | Template-specific | Component | Custom logic |

**Position Tokens:** (9-point grid system)
- `top-left`, `top-center`, `top-right`
- `center-left`, `center`, `center-right`
- `bottom-left`, `bottom-center`, `bottom-right`

Or use offset/percentage:
```json
"position": {
  "grid": "center",
  "offset": { "x": 100, "y": -50 }
}
```

---

### 3. Welcome & Subtitle

**Fields:** `welcome`, `subtitle`

```json
{
  "welcome": {
    "text": "Welcome message",
    "position": "center",
    "effects": ["shimmer"]
  },
  "subtitle": {
    "text": "Supporting text or tagline",
    "position": "bottom-center"
  }
}
```

**Dynamic Properties:**
- Position using grid tokens
- Optional shimmer effect on welcome
- Configurable text content
- Auto-sizing based on text length

---

### 4. Style Tokens (Dual Mode Support)

**Field:** `style_tokens`

```json
{
  "style_tokens": {
    "mode": "notebook" | "whiteboard",
    "colors": {
      "bg": "#FFF9F0",
      "accent": "#FF6B35",
      "accent2": "#9B59B6",
      "ink": "#1A1A1A"
    },
    "fonts": {
      "header": "'Cabin Sketch', cursive",
      "secondary": "'Permanent Marker', cursive",
      "body": "Inter, sans-serif",
      "size_question": 85-92,
      "size_welcome": 72,
      "size_subtitle": 32
    }
  }
}
```

**Mode Behavior:**
- **Notebook:** Warm background (#FFF9F0), textured, paper grain
- **Whiteboard:** Clean background (#FAFBFC), minimal texture

**Color Tokens:**
- `bg` - Background color
- `accent` - Primary accent (question emphasis, hero strokes)
- `accent2` - Secondary accent (sparkles, details)
- `ink` - Text color

---

### 5. Beats System (Timeline Control)

**Field:** `beats` (all in seconds)

```json
{
  "beats": {
    "entrance": 0.6,
    "questionStart": 0.6,
    "moveUp": 2.0,
    "emphasis": 4.2,
    "wipeQuestions": 5.5,
    "mapReveal": 6.5,
    "transformMap": 9.0,
    "welcome": 10.0,
    "subtitle": 12.0,
    "breathe": 13.5,
    "exit": 15.0
  }
}
```

**Beat Choreography:**

| Beat | Description | Visual Effect |
|------|-------------|---------------|
| `entrance` | Scene fade-in | Ambient particles start |
| `questionStart` | First line appears | Sparkles burst |
| `moveUp` | First line moves up (if 2+ lines) | Smooth upward motion |
| `emphasis` | All lines pulse | Scale emphasis |
| `wipeQuestions` | Questions exit left | Coordinated wipe |
| `mapReveal` | Hero visual enters | Draw-on or fade in |
| `transformMap` | Hero transforms | Shrink to corner |
| `welcome` | Welcome text appears | Shimmer effect |
| `subtitle` | Subtitle fades in | Smooth entrance |
| `breathe` | Idle breathing animation | Subtle scale |
| `exit` | Scene fade-out | Settle fade |

**Timing Guidelines:**
- Allow 0.8-1.5s between major visual changes
- Stagger related elements by 0.2-0.4s
- Entrance animations: 0.9-1.3s
- Exit animations: 0.9s
- Total duration: 15-18s recommended

---

## Domain Examples

### Example 1: Geography (Knodovia)

```json
{
  "question": {
    "lines": [
      { "text": "What if geography", "emphasis": "normal" },
      { "text": "was measured in mindsets?", "emphasis": "high" }
    ]
  },
  "hero": {
    "type": "roughSVG",
    "asset": "knodovia-map"
  },
  "style_tokens": {
    "colors": {
      "accent": "#E74C3C",
      "accent2": "#E67E22"
    }
  }
}
```

### Example 2: Sports (Football)

```json
{
  "question": {
    "lines": [
      { "text": "Who was the greatest?", "emphasis": "high" }
    ]
  },
  "hero": {
    "type": "image",
    "asset": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800",
    "style": {
      "borderRadius": "20px"
    }
  },
  "style_tokens": {
    "mode": "notebook",
    "colors": {
      "bg": "#F0F9FF",
      "accent": "#00FF00",
      "accent2": "#FFD700"
    }
  }
}
```

### Example 3: Science (Atoms)

```json
{
  "question": {
    "lines": [
      { "text": "What if atoms", "emphasis": "normal" },
      { "text": "could tell", "emphasis": "normal" },
      { "text": "their stories?", "emphasis": "high" }
    ],
    "layout": {
      "verticalSpacing": 90
    }
  },
  "hero": {
    "type": "svg",
    "asset": "https://upload.wikimedia.org/.../atom.svg",
    "transforms": [
      {
        "beat": "transformMap",
        "targetScale": 0.3,
        "targetPos": { "x": 600, "y": -300 },
        "rotation": 360
      }
    ]
  },
  "style_tokens": {
    "mode": "whiteboard",
    "colors": {
      "accent": "#9B59B6",
      "accent2": "#3498DB"
    },
    "fonts": {
      "size_question": 85
    }
  }
}
```

---

## Creative Effects (✨ Magic Layer)

### Ambient Particles
- **Count:** 20 particles
- **Opacity:** 0.6
- **Colors:** Accent, accent2, info blue
- **Behavior:** Floating, subtle movement
- **Duration:** Full scene

### Sparkles
- **Trigger:** On question line entrance
- **Count:** 8-12 per line
- **Duration:** 50-60 frames
- **Window:** Appears with text, fades quickly

### Liquid Blob
- **Location:** Behind hero visual
- **Opacity:** 0.15 (very subtle)
- **Duration:** mapReveal → transformMap + 60f
- **Purpose:** Organic energy behind central element

### Shimmer Effect
- **Target:** Welcome text only
- **Type:** Animated gradient sweep
- **Speed:** 0.03
- **Colors:** Accent2 → Gold → Accent2

### Camera Drift
- **Amount:** ±2px horizontal, ±1.5px vertical
- **Speed:** Very slow (0.008, 0.006)
- **Purpose:** Living, subtle movement

**Effect Guidelines:**
- ✅ Use sparingly for key moments
- ✅ Keep particle counts low (<30 total)
- ✅ Maintain low opacity for subtlety
- ❌ Don't overwhelm content
- ❌ Don't animate everything

---

## Technical Requirements

### Schema Version
```json
{
  "schema_version": "5.1"
}
```

### Required Fields
- `template_id`: "Hook1AQuestionBurst"
- `beats`: Object with timing markers
- **Either:** `question` and/or `hero` (v5.1)
- **Or:** `fill` (v5.0 legacy - still supported)

### Optional Fields
- `style_tokens`: Style overrides
- `welcome`: Welcome text configuration
- `subtitle`: Subtitle configuration
- `meta`: Metadata (title, tags, etc.)

### Viewport
- **Resolution:** 1920×1080 (16:9)
- **Position Grid:** 9-point system
- **Responsive:** Auto-scales to other resolutions

---

## Animation Presets Used

| Preset | Usage | Configuration |
|--------|-------|---------------|
| `fadeUpIn` | Question entrance, welcome, subtitle | start, dur, dist, ease |
| `pulseEmphasis` | Question emphasis | start, dur, scale, ease |
| `breathe` | Welcome idle animation | start, loop, amount |
| `shrinkToCorner` | Hero transform | start, dur, targetScale, targetPos, ease |

All presets support:
- Automatic frame conversion (seconds → frames)
- Easing curve selection
- Auto-clamping (no overshoot)
- FPS-agnostic (works at any frame rate)

---

## Position Token Reference

### 9-Point Grid (1920×1080)

```
top-left          top-center        top-right
(320, 180)        (960, 180)        (1600, 180)

center-left       center            center-right
(320, 540)        (960, 540)        (1600, 540)

bottom-left       bottom-center     bottom-right
(320, 900)        (960, 900)        (1600, 900)
```

### Usage Formats

**Simple Token:**
```json
"position": "center"
```

**Token + Offset:**
```json
"position": {
  "grid": "center",
  "offset": { "x": 0, "y": 120 }
}
```

**Percentage:**
```json
"position": { "x": "50%", "y": "30%" }
```

**Absolute Pixels:**
```json
"position": { "x": 960, "y": 540 }
```

---

## Backward Compatibility

### v5.0 Legacy Format (Still Supported)

```json
{
  "schema_version": "5.0",
  "fill": {
    "texts": {
      "questionPart1": "What if geography",
      "questionPart2": "was measured in mindsets?",
      "welcome": "Welcome to Knodovia",
      "subtitle": "A place where..."
    }
  }
}
```

The template **auto-detects** the format and converts v5.0 to v5.1 internally.

**Migration Path:** Update `schema_version` to "5.1" and convert `fill` to structured fields for full feature access.

---

## Quality Checklist

Before using this template, verify:

### Content
- [ ] Question lines are clear and concise (<50 chars/line)
- [ ] Line count is appropriate (1-3 recommended)
- [ ] Hero asset is accessible and optimized
- [ ] Welcome/subtitle text is on-brand

### Timing
- [ ] Beats allow 0.8-1.5s breathing room
- [ ] Total duration is 15-18s
- [ ] Stagger timing feels natural

### Style
- [ ] Mode matches content tone (notebook vs whiteboard)
- [ ] Colors have sufficient contrast
- [ ] Fonts are preloaded
- [ ] Text is readable

### Technical
- [ ] Schema version is "5.1"
- [ ] All required beats are present
- [ ] Hero asset loads successfully
- [ ] Position tokens resolve correctly

---

## Constraints & Best Practices

### Text Guidelines
- **Question lines:** 1-4 lines max (2-3 recommended)
- **Character limit:** ~50 chars per line
- **Emphasis:** Use sparingly (1-2 emphasized lines max)
- **Welcome text:** Short, punchy (2-5 words ideal)
- **Subtitle:** Single sentence or tagline

### Visual Guidelines
- **Hero dimensions:** 640×400 base size (scales dynamically)
- **Image format:** JPG/PNG for photos, SVG for diagrams
- **Image size:** <500KB optimized
- **Particle count:** <30 total across all effects

### Performance
- **Frame rate:** Optimized for 30fps (auto-scales to 60fps)
- **Export:** Guaranteed preview-to-export parity
- **Render time:** ~30-60s for 15s scene

---

## Extension Points

### Adding Custom Hero Types

Register new hero renderers:
```javascript
import { registerHeroType } from './sdk/heroRegistry';

registerHeroType('customType', CustomRenderer);
```

Then use in JSON:
```json
{
  "hero": {
    "type": "customType",
    "config": {...}
  }
}
```

### Custom Position Patterns

For specialized layouts, disable auto-centering:
```json
{
  "question": {
    "layout": {
      "centerStack": false,
      "basePosition": {
        "grid": "top-center",
        "offset": { "x": 0, "y": 200 }
      }
    }
  }
}
```

---

## Troubleshooting

### Lines Not Centered
**Check:** `centerStack: true` in layout config

### Hero Not Appearing
**Check:** Asset URL, hero type, mapReveal beat timing

### Text Too Large/Small
**Adjust:** `fonts.size_question`, reduce line count, or shorten text

### Colors Not Applying
**Check:** Color tokens are hex format, mode is set correctly

### Animations Choppy
**Check:** Frame rate settings, reduce particle count

### Spacing Issues
**Adjust:** `verticalSpacing` based on line count (see recommendations)

---

## Template Metadata

```javascript
export const TEMPLATE_ID = 'Hook1AQuestionBurst_Agnostic';
export const TEMPLATE_VERSION = '5.1.0';
export const DURATION_MIN_FRAMES = 450;  // 15s @ 30fps
export const DURATION_MAX_FRAMES = 540;  // 18s @ 30fps
export const SUPPORTED_MODES = ['notebook', 'whiteboard'];

export const CAPABILITIES = {
  usesSVG: true,
  usesLottie: false,
  usesRoughJS: true,
  requiresAudio: false,
  supportsTransitions: true,
  supportsHeroPolymorphism: true,
  supportsDynamicLineCount: true,
  supportsPositionTokens: true,
  backwardCompatible: true
};

export const AGNOSTIC_FEATURES = {
  heroTypes: ['image', 'svg', 'roughSVG', 'lottie', 'custom'],
  questionLines: { min: 1, max: 4, recommended: 2 },
  positioningSystem: '9-point-grid',
  crossDomainTested: ['geography', 'sports', 'science', 'business']
};
```

---

## Cross-Domain Testing

This template has been validated across multiple domains:

| Domain | Hero Type | Lines | Status | Notes |
|--------|----------|-------|--------|-------|
| Geography | roughSVG | 2 | ✅ Validated | Original use case |
| Sports | image | 1 | ✅ Validated | Photo with border radius |
| Science | svg | 3 | ✅ Validated | With rotation transform |
| Business | image | 2 | ✅ Ready | Org charts, teams |
| Arts | image | 2 | ✅ Ready | Artwork, movements |
| History | roughSVG | 2 | ✅ Ready | Maps, timelines |
| Tech | lottie | 1 | ✅ Ready | Animated logos |

**Conclusion:** Template is proven domain-agnostic.

---

## Support & Resources

**Documentation:**
- `/docs/agnosticTemplatePrincipals.md` - Design philosophy
- `/docs/BACKWARD_COMPATIBILITY.md` - Migration guide
- Schema validation: `validateSceneCompat()` helper

**Test Scenes:**
- `hook_1a_knodovia_agnostic_v5.json` - Geography (2 lines)
- `hook_1a_football_agnostic_v5.json` - Sports (1 line)
- `hook_1a_science_agnostic_v5.json` - Science (3 lines)

**SDK Functions:**
- `renderHero()` - Hero rendering
- `renderQuestionLines()` - Dynamic line rendering
- `resolvePosition()` - Position token resolution
- `detectSchemaVersion()` - Format detection

---

**Version:** 2.0 (Agnostic)  
**Status:** Production Ready  
**Last Updated:** 2025-10-30

---

*This blueprint represents the foundation for all future Hook1A implementations. All domain-specific variations should start from this configuration model.*
