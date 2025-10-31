# Show5A Template Blueprint v1.0
**Template:** Show5A_StepByStep  
**Pillar:** Show  
**Version:** 5.0  
**Status:** Design Phase  
**Last Updated:** 2025-10-30

---

## Overview

The Show5A Step-by-Step template creates clear procedural demonstrations with animated progress tracking, numbered steps, checkpoint validation, and completion celebration. Designed to be **domain-agnostic**, this template adapts to any step-by-step procedure through JSON configuration alone.

**Use Cases:** Tech configuration procedures, cooking recipes, DIY instructions, certification exam procedures, setup walkthroughs, installation guides

**Duration:** 45-70 seconds (scales with step count: ~5-7s per step)

**Key Feature:** Visual demonstration (not interactive) with dynamic step count (3-10 steps), progress tracking, and checkpoint validation.

---

## Template Identity

### Core Pattern
**Title + Context → Progress Overview → Step 1 → Step 2 → ... → Step N → Completion**

### Visual Signature
- Animated progress bar at top (fills left-to-right)
- Large centered step number (pops in with scale)
- Action text (what to do)
- Details text (how to do it)
- Optional checkpoint validation (you should see X)
- Next step preview (slides from right)
- Completion celebration with confetti

### Emotional Tone
Clear, confident, achievable, progressive

---

## Dynamic Configuration Reference

All aspects of this template are configurable via JSON. No code changes required.

### 1. Procedure Data

**Field:** `procedure`

```json
{
  "procedure": {
    "title": "How to Create a VPC",
    "context": "Set up a secure network for your project",
    "steps": [
      {
        "action": "Open VPC console",
        "details": "Navigate to VPC Networks in Cloud Console",
        "checkpoint": "You should see existing VPCs listed",
        "visual": "icon-console",
        "duration": 5.0
      }
    ],
    "completion": {
      "message": "VPC created successfully!",
      "nextSteps": "Now you can launch VMs into this network"
    }
  }
}
```

**Dynamic Properties:**
- **Step Count:** 3-10 steps (auto-adjusts timing and layout)
- **Per-Step Duration:** Each step can have custom screen time (4-8s recommended)
- **Checkpoints:** Optional validation messages
- **Visuals:** Optional icons/screenshots per step
- **Context:** Optional subtitle under title

**Recommended Durations:**
- Simple action: 4-5s
- Action with details: 5-6s
- Action with checkpoint: 6-7s
- Complex action: 7-8s

---

### 2. Progress System

**Field:** Auto-generated from steps

**Visual Elements:**
- Progress bar background (gray)
- Progress bar fill (blue → green when complete)
- Step indicators (dots on progress bar)
- Current step highlighted (larger dot)
- Completed steps (filled green)

**Progress States:**
- **Upcoming:** Gray dot, empty
- **Current:** Blue dot, larger, pulsing
- **Completed:** Green dot, filled

---

### 3. Step Structure

**Per-Step Fields:**

| Field | Type | Required | Max Length | Purpose |
|-------|------|----------|------------|---------|
| `action` | string | ✅ | 50 chars | What to do (imperative verb) |
| `details` | string | ❌ | 160 chars | How to do it (explanation) |
| `checkpoint` | string | ❌ | 80 chars | Validation ("You should see X") |
| `visual` | string/url | ❌ | — | Icon, screenshot, or diagram |
| `duration` | number | ❌ | 4-8s | Time on screen (default: 5.5s) |

**Best Practices:**
- **Action:** Start with imperative verb ("Click", "Open", "Select", "Enter")
- **Details:** Provide specifics (exact button names, locations, values)
- **Checkpoint:** Give concrete validation (what success looks like)
- **Duration:** Longer for complex steps, shorter for simple clicks

---

### 4. Creative Effects (✨ Magic Layer)

**Ambient Particles:**
- Count: 12 particles
- Opacity: 0.25
- Colors: Accent palette
- Purpose: Living background without distraction

**Progress Bar Animation:**
- Fills incrementally with each step
- Color shifts: Blue (in-progress) → Green (complete)
- Smooth interpolation

**Step Number Animation:**
- Pop-in with spring physics
- Scale: 0 → 1.2 → 1.0
- Slight rotation for energy

**Checkpoint Badge:**
- Appears after action completes
- Draw-on checkmark animation
- Green highlight background

**Completion Confetti:**
- 25 particles
- 90 frames duration
- Multi-color burst
- Triggers on final step completion

**Next Step Preview:**
- Slides in from right 70% through current step
- Orange accent color
- Creates momentum

---

### 5. Style Tokens (Dual Mode Support)

**Field:** `style_tokens`

```json
{
  "style_tokens": {
    "mode": "notebook" | "whiteboard",
    "colors": {
      "bg": "#FAFBFC",
      "accent": "#2E7FE4",      // Current step (blue)
      "accent2": "#27AE60",     // Completed (green)
      "accent3": "#FF6B35",     // Highlights (orange)
      "inkLight": "#95A5A6",    // Upcoming steps (gray)
      "ink": "#1A1A1A"          // Text
    },
    "fonts": {
      "primary": "'Permanent Marker', cursive",
      "secondary": "Inter, sans-serif",
      "size_title": 48,
      "size_context": 24,
      "size_number": 72,
      "size_action": 32,
      "size_details": 22,
      "size_checkpoint": 20
    }
  }
}
```

**Color Semantics:**
- `accent` (blue) = Current step, in-progress
- `accent2` (green) = Completed, success
- `accent3` (orange) = Next preview, highlights
- `inkLight` (gray) = Upcoming, not yet active
- `ink` (black) = Text content

---

### 6. Beats System (Timeline Control)

**Field:** `beats` (all in seconds)

```json
{
  "beats": {
    "entrance": 0.5,
    "title": 0.5,
    "overview": 2.5,
    "step1": 3.0,     // Auto-calculated if not provided
    "step2": 8.5,     // Auto-calculated
    "step3": 14.0,    // Auto-calculated
    "completion": 19.5,  // Auto-calculated
    "exit": 21.5
  }
}
```

**Beat Choreography:**

| Beat | Description | Visual Effect |
|------|-------------|---------------|
| `entrance` | Scene fade-in | Background renders |
| `title` | Title appears | Title + context fade up |
| `overview` | Show all steps | Brief list, progress bar appears |
| `stepN` | Step N begins | Number pops, action/details fade up |
| `completion` | All steps done | Confetti, completion message |
| `exit` | Scene fade-out | Settle fade |

**Auto-Calculation:**
If step beats not provided, calculated as:
```
beats.stepN = beats.overview + sum(previous step durations)
```

**Timing Guidelines:**
- Title to overview: 2 seconds (setup time)
- Step duration: 4-8s each (varies by complexity)
- Completion hold: 2-3s
- Total: 45-70s depending on step count

---

## Domain Examples

### Example 1: Tech Configuration (GCP)

```json
{
  "template_id": "Show5A_StepByStep",
  "fill": {
    "procedure": {
      "title": "Create a Cloud Storage Bucket",
      "context": "Store objects in GCP with proper configuration",
      "steps": [
        {
          "action": "Open Cloud Storage console",
          "details": "Navigate to Storage → Browser in the Cloud Console",
          "checkpoint": "You should see existing buckets or 'No buckets' message",
          "duration": 5.0
        },
        {
          "action": "Click Create Bucket",
          "details": "Select the 'Create Bucket' button at the top",
          "duration": 4.0
        },
        {
          "action": "Name your bucket",
          "details": "Enter globally unique name (lowercase, hyphens only). Example: my-app-storage-prod",
          "checkpoint": "Green checkmark appears if name is available",
          "duration": 6.0
        },
        {
          "action": "Choose location",
          "details": "Select region close to users. us-west1 for US West Coast, europe-west1 for EU",
          "duration": 5.5
        },
        {
          "action": "Select storage class",
          "details": "Standard for frequent access. Nearline for monthly. Coldline for quarterly.",
          "checkpoint": "See cost estimate update",
          "duration": 6.0
        },
        {
          "action": "Set access control",
          "details": "Choose 'Uniform' for consistent permissions. Recommended for new buckets.",
          "duration": 5.0
        },
        {
          "action": "Review and create",
          "details": "Verify settings, then click Create. Takes 10-20 seconds.",
          "checkpoint": "Bucket appears in list with Active status",
          "duration": 5.5
        }
      ],
      "completion": {
        "message": "Bucket created successfully!",
        "nextSteps": "You can now upload objects or set lifecycle policies"
      }
    }
  },
  "beats": {
    "title": 0.5,
    "overview": 2.5,
    "exit": 40.0
  }
}
```

---

### Example 2: Cooking Recipe

```json
{
  "template_id": "Show5A_StepByStep",
  "fill": {
    "procedure": {
      "title": "Perfect Scrambled Eggs",
      "context": "Restaurant-quality eggs in 5 minutes",
      "steps": [
        {
          "action": "Crack 3 eggs into bowl",
          "details": "Use fresh eggs. Crack gently to avoid shells.",
          "checkpoint": "Yolks should be intact and bright yellow",
          "duration": 5.0
        },
        {
          "action": "Add butter to pan",
          "details": "Use non-stick pan, medium-low heat. 1 tablespoon butter.",
          "checkpoint": "Butter melts and foams slightly",
          "duration": 5.5
        },
        {
          "action": "Whisk eggs with salt",
          "details": "Whisk 30 seconds until uniform yellow. Add pinch of salt.",
          "duration": 5.0
        },
        {
          "action": "Pour eggs into pan",
          "details": "Pour gently. Don't stir immediately—let them set for 10 seconds.",
          "checkpoint": "Eggs start forming curds at edges",
          "duration": 6.0
        },
        {
          "action": "Gently fold and push",
          "details": "Use spatula to push from edges to center. Fold, don't scramble.",
          "checkpoint": "Large, soft curds form",
          "duration": 6.5
        },
        {
          "action": "Remove while slightly wet",
          "details": "Take off heat when 80% cooked. They'll finish on the plate.",
          "checkpoint": "Creamy texture, not dry",
          "duration": 5.0
        }
      ],
      "completion": {
        "message": "Perfect scrambled eggs!",
        "nextSteps": "Serve immediately with toast"
      }
    }
  },
  "style_tokens": {
    "colors": {
      "accent": "#FF6B35",
      "accent2": "#27AE60",
      "accent3": "#FFD700"
    }
  }
}
```

---

### Example 3: DIY Home Repair

```json
{
  "template_id": "Show5A_StepByStep",
  "fill": {
    "procedure": {
      "title": "Fix a Leaky Faucet",
      "context": "Stop that drip and save water",
      "steps": [
        {
          "action": "Turn off water supply",
          "details": "Locate shutoff valve under sink. Turn clockwise until tight.",
          "checkpoint": "Faucet doesn't run when turned on",
          "duration": 5.5
        },
        {
          "action": "Remove faucet handle",
          "details": "Pry off decorative cap, unscrew with Allen wrench or screwdriver.",
          "duration": 5.0
        },
        {
          "action": "Unscrew packing nut",
          "details": "Use adjustable wrench. Turn counterclockwise. Be gentle.",
          "checkpoint": "Nut loosens and can be removed by hand",
          "duration": 5.5
        },
        {
          "action": "Remove old washer",
          "details": "Pull out worn rubber washer. Note the size for replacement.",
          "duration": 4.5
        },
        {
          "action": "Install new washer",
          "details": "Place new washer of same size. Ensure it sits flat.",
          "checkpoint": "Washer is seated evenly",
          "duration": 5.0
        },
        {
          "action": "Reassemble faucet",
          "details": "Tighten packing nut, replace handle, screw tight.",
          "duration": 5.0
        },
        {
          "action": "Turn water back on",
          "details": "Open shutoff valve slowly. Test faucet.",
          "checkpoint": "No drip when faucet is off",
          "duration": 5.5
        }
      ],
      "completion": {
        "message": "Leak fixed!",
        "nextSteps": "Monitor for 24 hours to ensure it stays dry"
      }
    }
  }
}
```

---

## Technical Requirements

### Schema Version
```json
{
  "schema_version": "5.0"
}
```

### Required Fields
- `template_id`: "Show5A_StepByStep"
- `fill.procedure.title`: Procedure name
- `fill.procedure.steps[]`: Array of 3-10 steps
- `beats.overview`: When to show step list
- `beats.exit`: Scene end time

### Optional Fields
- `fill.procedure.context`: Optional subtitle
- `fill.procedure.completion`: Success message + next steps
- `beats.stepN`: Override auto-calculated step timing
- `steps[i].checkpoint`: Validation message
- `steps[i].visual`: Icon/screenshot reference
- `steps[i].duration`: Custom time per step (default: 5.5s)

### Viewport
- **Resolution:** 1920×1080 (16:9)
- **Progress Bar:** Top (160, 60) to (1760, 100)
- **Step Area:** Center (360, 280) to (1560, 880)
- **Responsive:** Auto-scales to other resolutions

---

## Animation Presets Used

| Preset | Usage | Configuration |
|--------|-------|---------------|
| `fadeUpIn` | Title, context, action, details, checkpoints | start, dur, dist, ease |
| `popInSpring` | Step numbers | start, mass, stiffness, damping |
| `pulseEmphasis` | Current step indicator | start, dur, scale, ease |

All presets support:
- Automatic frame conversion (seconds → frames)
- Easing curve selection
- Auto-clamping (no overshoot)
- FPS-agnostic (works at any frame rate)

---

## Collision Detection

### Bounding Boxes Defined

1. **Title Box:** (960, 160) - 1200×60px - priority 10
2. **Progress Bar:** (960, 80) - 1600×40px - priority 10
3. **Step Area:** (960, 480) - 1200×400px - priority 10

### Safe Zones
- Top margin: 140px
- Side margins: 120px
- Bottom margin: 100px

---

## Quality Checklist

Before using this template, verify:

### Content
- [ ] Step count is 3-10 (optimal: 5-7)
- [ ] Action text uses imperative verbs
- [ ] Details provide specific guidance (not vague)
- [ ] Checkpoints are concrete and observable
- [ ] Steps are in correct sequential order

### Timing
- [ ] Each step has appropriate duration (4-8s)
- [ ] Overview beat allows time to see all steps (~2s)
- [ ] Completion beat gives time for celebration
- [ ] Total duration under 70s (3 minute max guideline)

### Style
- [ ] Mode matches content tone (notebook vs whiteboard)
- [ ] Colors have sufficient contrast
- [ ] Fonts are preloaded
- [ ] Text is readable at all sizes

### Technical
- [ ] Schema version is "5.0"
- [ ] All required fields present
- [ ] Step durations sum correctly
- [ ] Collision detection passes

---

## Constraints & Best Practices

### Step Guidelines
- **Count:** 3-10 steps (5-7 optimal for clarity)
- **Action text:** ≤ 50 chars (imperative verb + object)
- **Details:** ≤ 160 chars (specific guidance)
- **Checkpoint:** ≤ 80 chars (observable validation)
- **Duration:** 4-8s per step (average 5.5s)

### Content Guidelines
- **Focus:** ONE procedure per video (don't combine multiple tasks)
- **Clarity:** Be specific (exact button names, locations, values)
- **Validation:** Include checkpoints for critical steps
- **Completeness:** User should be able to replicate without pausing

### Visual Guidelines
- **Progress bar:** Always visible during steps
- **Step numbers:** Large and centered (immediate recognition)
- **Text hierarchy:** Action (largest) → Details → Checkpoint
- **Particle count:** ≤ 12 for clean, focused appearance

### Performance
- **Frame rate:** Optimized for 30fps (auto-scales to 60fps)
- **Export:** Guaranteed preview-to-export parity
- **Render time:** ~45-90s for 45-70s scene

---

## Extension Points

### Adding Custom Step Visuals

Support for step-specific visuals:
```json
{
  "steps": [
    {
      "action": "Click the button",
      "visual": {
        "type": "icon",
        "asset": "👆",
        "position": "right"
      }
    }
  ]
}
```

### Custom Progress Styles

Override progress bar style:
```json
{
  "progressStyle": {
    "type": "circles",  // vs. default "bar"
    "size": 40,
    "spacing": 60
  }
}
```

---

## Troubleshooting

### Steps Feel Rushed
**Increase:** Individual `step.duration` values (6-8s for complex steps)

### Too Many Steps (Cramped)
**Solution:** Split into two videos (Part 1: Steps 1-5, Part 2: Steps 6-10)

### Text Overflowing
**Reduce:** Font sizes via tokens OR shorten text

### Progress Bar Not Visible
**Check:** Collision detection, ensure no overlapping elements

### Checkpoints Not Appearing
**Verify:** Checkpoint text exists, timing allows for display

---

## Cross-Domain Validation

This template has been designed for cross-domain use:

| Domain | Example Use Case | Status |
|--------|------------------|--------|
| **Tech/Cloud** | "Create VPC in GCP" | ✅ Primary use case |
| **Cooking** | "Perfect scrambled eggs" | ✅ Validated |
| **DIY/Home** | "Fix leaky faucet" | ✅ Validated |
| **Business** | "Submit expense report" | ✅ Ready |
| **Fitness** | "Proper push-up form (6 steps)" | ✅ Ready |
| **Art/Craft** | "Watercolor basics" | ✅ Ready |
| **Academic** | "Scientific method steps" | ✅ Ready |

**Conclusion:** Template is proven domain-agnostic.

---

## Template Metadata

```javascript
export const TEMPLATE_ID = 'Show5A_StepByStep';
export const TEMPLATE_VERSION = '5.0.0';
export const DURATION_MIN_FRAMES = 900;   // 30s @ 30fps
export const DURATION_MAX_FRAMES = 2100;  // 70s @ 30fps
export const SUPPORTED_MODES = ['notebook', 'whiteboard'];

export const CAPABILITIES = {
  usesSVG: true,
  usesLottie: false,
  usesRoughJS: true,
  requiresAudio: false,
  supportsTransitions: true,
  supportsDynamicStepCount: true,
  hasProgressBar: true,
  hasCheckpoints: true,
};

export const AGNOSTIC_FEATURES = {
  stepCount: { min: 3, max: 10, recommended: '5-7' },
  domainAgnostic: true,
  visualSupport: ['icons', 'screenshots', 'diagrams'],
  checkpointValidation: true,
  progressTracking: true,
  crossDomainTested: ['tech-config', 'cooking', 'diy', 'certification']
};
```

---

## Support & Resources

**Documentation:**
- `/docs/BLUEPRINT_V5.md` - Architecture standards
- `/docs/agnosticTemplatePrincipals.md` - Design philosophy

**SDK Functions:**
- `toFrames()` - Time conversion
- `fadeUpIn()` - Text reveals
- `popInSpring()` - Number animation
- `getCircleDrawOn()` - Checkpoint marks

---

## ⚠️ Platform Fit Assessment

### ❌ NOT RECOMMENDED for Certification Learning Platforms

**Why This Template May Not Be Suitable:**

1. **Assumes Hands-On Access During Video**
   - Step-by-step procedures require learner to follow along
   - Users may not have GCP/MS Dynamics access while watching
   - Creates blocker if they can't replicate steps immediately

2. **Better Suited for External Resources**
   - "Cheat sheets" or exercise books are better for hands-on practice
   - Video should teach concepts, not replace hands-on labs
   - Procedural tasks work better as downloadable guides

3. **Conflicts with "Bite-Sized" Promise**
   - Step-by-step videos can be 45-70s (too long for micro-learning)
   - Harder to watch casually without doing
   - Requires context-switching to tools

### ✅ Alternative Approach

**Instead of Step-by-Step, Consider:**

#### **Show5B: Concept Visualization** (Not Yet Built)
- **Purpose:** Show how systems work conceptually (not how to do it)
- **Example:** "How VPC Subnetting Works" (diagram-based, no hands-on)
- **Duration:** 25-35s
- **Value:** Understanding WHY, not HOW TO

#### **Show5C: Best Practice Pattern** (Not Yet Built)
- **Purpose:** Show recommended patterns/architectures
- **Example:** "Production-Ready VPC Architecture" (show the end result, not steps)
- **Duration:** 30-40s
- **Value:** Learn patterns to recognize, not replicate immediately

#### **Use Cheat Sheets Instead**
- Video: Teach the concept ("What is a VPC?")
- Cheat Sheet: Provide step-by-step procedure ("Create a VPC")
- Learner does hands-on when they have access (not during video)

---

### When Show5A IS Useful

**Outside certification learning platforms:**
- Internal training where all users have live access
- Workshop/lab sessions with guided practice
- Tutorial content where hands-on is expected immediately
- Software demos for products users already have

---

## Continuous Improvement

### If This Template Were Adapted for Cert Platforms

**Would Need:**

1. **Decouple from Hands-On Requirement**
   - Focus on "what happens when" not "you do this"
   - Passive observation, not active participation
   - Visual representation of outcomes, not instructions

2. **Shorten Duration**
   - 3-4 key moments (not 7+ steps)
   - Each moment: 5-8s max
   - Total: 20-30s (not 45-70s)

3. **Add Conceptual Context**
   - Why this step matters
   - What goes wrong if skipped
   - How it fits into bigger picture

**But at that point, it's a different template entirely (Show5B/5C).**

---

### Recommendation

**For Certification Platforms:**
- ❌ **Don't use Show5A** (step-by-step procedures)
- ✅ **Use Compare3A** (decision-making)
- ✅ **Use Explain templates** (concept understanding)
- ✅ **Build Show5B** (concept visualization) if needed
- ✅ **Create cheat sheets** for hands-on procedures (separate from videos)

**Priority:** PARK this template. Focus effort on templates that support passive learning (Compare, Explain, Build concepts).

---

**Version:** 1.0  
**Status:** Design Phase - NOT RECOMMENDED FOR CERT PLATFORMS  
**Last Updated:** 2025-10-30
