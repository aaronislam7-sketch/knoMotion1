# Quick Start: Show5A & Compare3A Templates

**Status:** ✅ Ready to Use  
**Date:** 2025-10-30

---

## 🚀 Get Started in 3 Steps

### 1. Import the Templates

```javascript
// In your Remotion composition file
import { Show5A_StepByStep } from './templates/Show5A_StepByStep_V5';
import { Compare3A_FeatureMatrix } from './templates/Compare3A_FeatureMatrix_V5';
```

### 2. Load a JSON Scene

```javascript
import show5aScene from './scenes/Show5A_Example_GCP_VPC.json';
import compare3aScene from './scenes/Compare3A_Example_GCP_Compute.json';
```

### 3. Render the Scene

```javascript
<Composition
  id="Step-by-Step-Demo"
  component={Show5A_StepByStep}
  durationInFrames={1260}  // 42 seconds @ 30fps
  fps={30}
  width={1920}
  height={1080}
  defaultProps={{ scene: show5aScene }}
/>
```

---

## 📖 Template Guides

### **Show5A: Step-by-Step**

**When to use:** Demonstrating procedural "how-to" tasks (tech procedures, recipes, DIY, certifications)

**Key JSON Fields:**
```json
{
  "fill": {
    "procedure": {
      "title": "Your Procedure Name",
      "steps": [
        {
          "action": "Step action (imperative verb)",
          "details": "Additional explanation",
          "checkpoint": "What success looks like (optional)",
          "duration": 5.0
        }
      ],
      "completion": {
        "message": "Success message",
        "nextSteps": "What to do next"
      }
    }
  }
}
```

**Recommended Step Count:** 5-7 steps (3-10 supported)  
**Duration:** 45-70 seconds  
**Creative Features:** Progress bar, checkpoints, confetti celebration

**Full Documentation:** `/docs/template-content-blueprints/Show5ABlueprint.md`

---

### **Compare3A: Feature Matrix**

**When to use:** Helping users choose between options (cloud services, frameworks, pricing tiers)

**Key JSON Fields:**
```json
{
  "fill": {
    "comparison": {
      "title": "Compare Your Options",
      "recommendedIndex": 0,  // Highlight option 0 (optional)
      "options": [
        { "name": "Option A", "icon": "🚀" }
      ],
      "features": [
        {
          "label": "Feature name",
          "type": "text",  // or "boolean", "number"
          "values": ["Value for each option"]
        }
      ],
      "tradeoffs": {
        "metrics": [
          {
            "label": "Cost",
            "values": [20, 50, 80],  // 0-100 scale
            "lowIsBetter": true
          }
        ]
      },
      "guidance": "Decision advice for users"
    }
  }
}
```

**Recommended:** 3-4 options × 5-6 features  
**Duration:** 35-50 seconds  
**Creative Features:** Grid animation, trade-off gauges, spotlight effect

**Full Documentation:** `/docs/template-content-blueprints/Compare3ABlueprint.md`

---

## 🎨 Styling & Customization

Both templates support dual-mode styling:

```json
{
  "style_tokens": {
    "mode": "notebook",  // or "whiteboard"
    "colors": {
      "bg": "#FAFBFC",
      "accent": "#2E7FE4",
      "accent2": "#27AE60",
      "ink": "#1A1A1A"
    },
    "fonts": {
      "primary": "'Permanent Marker', cursive",
      "secondary": "Inter, sans-serif"
    }
  }
}
```

**Tip:** Adjust colors per domain (e.g., tech = blue, cooking = orange)

---

## ⏱️ Timing Control

### Automatic Timing (Recommended)
Let the template auto-calculate beats based on content:
```json
{
  "beats": {
    "exit": 40.0  // Just set the end time
  }
}
```

### Manual Timing (Advanced)
Override specific beats for fine control:
```json
{
  "beats": {
    "title": 0.5,
    "overview": 2.5,
    "step1": 3.0,
    "step2": 8.5,
    "exit": 40.0
  }
}
```

---

## ✅ Validation

Before rendering, validate your scene:

```javascript
import { validateScene } from './sdk/scene-validator';

const result = validateScene(myScene, 30, { verbose: true });

if (!result.valid) {
  console.error('Scene has issues:', result.collisions);
}
```

**What it checks:**
- ✅ No element overlaps
- ✅ Text doesn't overflow
- ✅ Required fields present
- ✅ Timing is sensible

---

## 🌍 Domain Flexibility Examples

### Show5A Across Domains:

**Tech:** "Create a Cloud Function"  
**Cooking:** "Perfect Scrambled Eggs"  
**DIY:** "Fix a Leaky Faucet"  
**Fitness:** "Proper Push-up Form"

*Same template, different JSON!*

### Compare3A Across Domains:

**Cloud:** "Compute Service Comparison"  
**Software:** "React vs Vue vs Angular"  
**Data:** "SQL vs NoSQL vs Graph"  
**Business:** "Pricing Tier Comparison"

*Same template, different JSON!*

---

## 🐛 Troubleshooting

### Steps Feel Rushed (Show5A)
**Solution:** Increase `step.duration` to 6-8 seconds for complex steps

### Too Many Steps (Show5A)
**Solution:** Split into Part 1 & Part 2 videos (5 steps each)

### Grid Feels Cramped (Compare3A)
**Solution:** Reduce option count to 3-4, or split features into categories

### Text Overflowing
**Solution:** Shorten text OR reduce font sizes via `style_tokens.fonts.size_*`

---

## 📚 Further Reading

**Architecture:**
- `/docs/BLUEPRINT_V5.md` - Blueprint v5.0 standards
- `/docs/agnosticTemplatePrincipals.md` - Design philosophy

**Collision Detection:**
- `/docs/COLLISION_DETECTION.md` - Layout system guide

**Templates:**
- `/docs/template-content-blueprints/Show5ABlueprint.md` - Complete Show5A reference
- `/docs/template-content-blueprints/Compare3ABlueprint.md` - Complete Compare3A reference

---

## 🚀 Next Steps

1. **Try the examples:** Render the included JSON scenes
2. **Customize:** Edit JSON to match your content
3. **Validate:** Run collision detection before final render
4. **Iterate:** Adjust timing, colors, and content
5. **Build more:** Create scenes for your tech certification content!

---

**Happy creating! 🎬**
