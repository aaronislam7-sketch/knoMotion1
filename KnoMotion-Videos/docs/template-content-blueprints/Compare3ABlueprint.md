# Compare3A Template Blueprint v1.0
**Template:** Compare3A_FeatureMatrix  
**Pillar:** Compare  
**Version:** 5.0  
**Status:** Design Phase  
**Last Updated:** 2025-10-30

---

## Overview

The Compare3A Feature Matrix template creates side-by-side comparisons with dynamic grid layout, trade-off gauges, and decision guidance. Designed to be **domain-agnostic**, this template adapts to any comparison scenario (products, services, approaches, tools) through JSON configuration alone.

**Use Cases:** Cloud storage classes, compute options, pricing tiers, framework comparison, database types, certification paths

**Duration:** 35-50 seconds (scales with feature count: ~3-4s per feature)

**Key Feature:** Grid-based feature comparison with value type indicators, trade-off visualization, and recommended option spotlight.

---

## Template Identity

### Core Pattern
**Title → Option Headers → Feature Rows (sequential) → Trade-off Gauges → Decision Guidance**

### Visual Signature
- Grid layout with option columns
- Feature rows reveal sequentially
- Value cells pop in (staggered left-to-right)
- Boolean indicators (✓/✗) with color coding
- Trade-off gauge bars (animated fill)
- Recommended option gets green spotlight
- Decision guidance box at bottom

### Emotional Tone
Analytical, clear, empowering, confidence-building

---

## Dynamic Configuration Reference

All aspects of this template are configurable via JSON. No code changes required.

### 1. Comparison Data

**Field:** `comparison`

```json
{
  "comparison": {
    "title": "Cloud Storage Classes",
    "recommendedIndex": 0,
    "options": [
      {
        "name": "Standard",
        "icon": "⚡"
      },
      {
        "name": "Nearline",
        "icon": "📦"
      },
      {
        "name": "Coldline",
        "icon": "❄️"
      }
    ],
    "features": [
      {
        "label": "Access frequency",
        "type": "text",
        "values": ["Frequent", "Monthly", "Quarterly"]
      },
      {
        "label": "Retrieval time",
        "type": "text",
        "values": ["Instant", "Instant", "Instant"]
      },
      {
        "label": "Cost per GB/month",
        "type": "text",
        "values": ["$0.020", "$0.010", "$0.004"]
      },
      {
        "label": "Retrieval fee",
        "type": "boolean",
        "values": [false, true, true]
      }
    ],
    "tradeoffs": {
      "metrics": [
        {
          "label": "Cost",
          "values": [20, 50, 80],
          "lowIsBetter": true
        },
        {
          "label": "Access Speed",
          "values": [100, 100, 80],
          "highIsBetter": true
        }
      ]
    },
    "guidance": "Use Standard for frequently accessed data. Nearline for monthly backups. Coldline for compliance archives."
  }
}
```

**Dynamic Properties:**
- **Option Count:** 2-5 options (auto-adjusts grid columns)
- **Feature Count:** 3-8 features (auto-adjusts grid rows + timing)
- **Value Types:** text, boolean, number
- **Trade-off Metrics:** Up to 5 metrics with directional preference
- **Recommended Option:** Highlighted with green spotlight

---

### 2. Option Structure

**Per-Option Fields:**

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| `name` | string | ✅ | Option name (e.g., "Standard") |
| `icon` | emoji/string | ❌ | Visual identifier |

**Best Practices:**
- Keep names short (≤ 15 chars)
- Use icons to differentiate visually
- Order left-to-right by popularity or recommendation

---

### 3. Feature Structure

**Per-Feature Fields:**

| Field | Type | Required | Values | Purpose |
|-------|------|----------|--------|---------|
| `label` | string | ✅ | ≤ 30 chars | Feature name |
| `type` | enum | ✅ | text, boolean, number | Value display format |
| `values` | array | ✅ | Length = option count | One value per option |

**Feature Types:**

1. **Text (`type: "text"`)**
   - Displays string values
   - Example: "Instant", "$0.020", "High"
   - Best for: Qualitative attributes

2. **Boolean (`type: "boolean"`)**
   - Displays ✓ (green) or ✗ (red)
   - Example: `[true, false, true]` → ✓ ✗ ✓
   - Best for: Yes/no features

3. **Number (`type: "number"`)**
   - Displays numeric values with accent color
   - Example: `[256, 512, 1024]` → 256 512 1024
   - Best for: Quantitative metrics

**Recommended Feature Count:**
- **3-4 features:** Quick, high-level comparison
- **5-6 features:** Balanced detail (recommended)
- **7-8 features:** Comprehensive (use sparingly)

---

### 4. Trade-off System

**Field:** `tradeoffs.metrics`

```json
{
  "tradeoffs": {
    "metrics": [
      {
        "label": "Cost",
        "values": [20, 50, 80, 95],
        "lowIsBetter": true
      },
      {
        "label": "Performance",
        "values": [100, 80, 60, 30],
        "highIsBetter": true
      },
      {
        "label": "Complexity",
        "values": [90, 70, 40, 20],
        "lowIsBetter": true
      }
    ]
  }
}
```

**Metric Structure:**
- `label`: Metric name (e.g., "Cost", "Speed")
- `values`: Array of 0-100 for each option
- `lowIsBetter`: true = lower is better (cost)
- `highIsBetter`: true = higher is better (performance)

**Visual Representation:**
- Horizontal bar gauges (400px wide)
- Each option gets a colored bar
- Length proportional to value (0-100%)
- Labels indicate directionality

**Best Practices:**
- Use 2-4 metrics (more = visual clutter)
- Normalize to 0-100 scale
- Choose metrics that matter for decision
- Indicate direction (low/high better)

---

### 5. Decision Guidance

**Field:** `guidance`

```json
{
  "guidance": "Use Standard for frequently accessed data. Nearline for monthly backups. Coldline for compliance archives."
}
```

**Purpose:**
- Summarizes when to use each option
- Appears after trade-offs
- Highlighted with accent border

**Best Practices:**
- Keep ≤ 200 chars
- Use imperative language ("Use X for Y")
- Address all options briefly
- Avoid jargon

---

### 6. Recommended Option

**Field:** `recommendedIndex`

```json
{
  "recommendedIndex": 1  // 0-indexed, highlights 2nd option
}
```

**Effect:**
- Green spotlight background on that column
- Bolder text in header
- Implied as best choice for most users

**When to Use:**
- One option clearly best for majority
- Tutorial context (teaching a default choice)
- Opinionated guidance needed

**When to Omit:**
- All options equally valid (context-dependent)
- User should decide independently

---

### 7. Style Tokens (Dual Mode Support)

**Field:** `style_tokens`

```json
{
  "style_tokens": {
    "mode": "notebook" | "whiteboard",
    "colors": {
      "bg": "#FAFBFC",
      "accent": "#2E7FE4",      // Blue (highlights)
      "accent2": "#27AE60",     // Green (positive, recommended)
      "accent3": "#E74C3C",     // Red (caution, negatives)
      "ink": "#1A1A1A",         // Text
      "inkLight": "#95A5A6"     // Grid lines, subtle text
    },
    "fonts": {
      "primary": "'Permanent Marker', cursive",
      "secondary": "Inter, sans-serif",
      "size_title": 52,
      "size_optionHeader": 32,
      "size_featureLabel": 24,
      "size_featureValue": 22,
      "size_tradeoffLabel": 20,
      "size_guidance": 28
    }
  }
}
```

**Color Semantics:**
- `accent` (blue) = Highlights, emphasis
- `accent2` (green) = Positive, recommended, checkmarks
- `accent3` (red) = Caution, negatives, X marks
- `ink` = Primary text
- `inkLight` = Grid, secondary text

---

### 8. Beats System (Timeline Control)

**Field:** `beats` (all in seconds)

```json
{
  "beats": {
    "entrance": 0.5,
    "title": 0.5,
    "optionHeaders": 2.5,
    "features": [2.5, 6.0, 9.5, 13.0],  // Auto-calculated
    "tradeoffs": 17.0,   // Auto-calculated
    "decision": 21.0,    // Auto-calculated
    "exit": 26.0
  }
}
```

**Beat Choreography:**

| Beat | Description | Visual Effect |
|------|-------------|---------------|
| `entrance` | Scene fade-in | Background renders |
| `title` | Title appears | Title fade up |
| `optionHeaders` | Column headers | Pop in left-to-right |
| `features[N]` | Feature row N | Label + values stagger |
| `tradeoffs` | Trade-off gauges | Bars animate fill |
| `decision` | Guidance appears | Spotlight + text box |
| `exit` | Scene fade-out | Settle fade |

**Auto-Calculation:**
If feature beats not provided, calculated as:
```
beats.features[N] = beats.optionHeaders + N * 3.5
beats.tradeoffs = last feature beat + 1.0
beats.decision = tradeoffs + 4.0
```

**Timing Guidelines:**
- Feature row: 3-4s each (3.5s default)
- Trade-offs: 4s total (all gauges animate)
- Decision: 2-3s hold
- Total: 35-50s depending on feature count

---

## Domain Examples

### Example 1: Cloud Compute Options (GCP)

```json
{
  "template_id": "Compare3A_FeatureMatrix",
  "fill": {
    "comparison": {
      "title": "Choose Your Compute Service",
      "recommendedIndex": 2,
      "options": [
        { "name": "Compute Engine", "icon": "🖥️" },
        { "name": "App Engine", "icon": "🚀" },
        { "name": "Cloud Run", "icon": "📦" },
        { "name": "Cloud Functions", "icon": "⚡" }
      ],
      "features": [
        {
          "label": "Use case",
          "type": "text",
          "values": ["Full VMs", "Managed apps", "Containers", "Serverless functions"]
        },
        {
          "label": "Infrastructure control",
          "type": "text",
          "values": ["Full", "Minimal", "None", "None"]
        },
        {
          "label": "Auto-scaling",
          "type": "boolean",
          "values": [false, true, true, true]
        },
        {
          "label": "Pay per use",
          "type": "boolean",
          "values": [false, false, true, true]
        },
        {
          "label": "Cold start",
          "type": "boolean",
          "values": [false, false, true, true]
        },
        {
          "label": "Container support",
          "type": "boolean",
          "values": [true, false, true, false]
        }
      ],
      "tradeoffs": {
        "metrics": [
          {
            "label": "Control",
            "values": [100, 40, 20, 10],
            "highIsBetter": true
          },
          {
            "label": "Ease of use",
            "values": [20, 70, 90, 100],
            "highIsBetter": true
          },
          {
            "label": "Cost efficiency",
            "values": [30, 60, 90, 95],
            "highIsBetter": true
          }
        ]
      },
      "guidance": "Use Compute Engine for full control. App Engine for managed web apps. Cloud Run for containers. Cloud Functions for event-driven microservices."
    }
  }
}
```

---

### Example 2: Framework Comparison (React vs Vue vs Angular)

```json
{
  "template_id": "Compare3A_FeatureMatrix",
  "fill": {
    "comparison": {
      "title": "Frontend Framework Comparison",
      "recommendedIndex": 0,
      "options": [
        { "name": "React", "icon": "⚛️" },
        { "name": "Vue", "icon": "💚" },
        { "name": "Angular", "icon": "🔺" }
      ],
      "features": [
        {
          "label": "Learning curve",
          "type": "text",
          "values": ["Moderate", "Easy", "Steep"]
        },
        {
          "label": "Community size",
          "type": "text",
          "values": ["Huge", "Large", "Large"]
        },
        {
          "label": "TypeScript",
          "type": "boolean",
          "values": [true, true, true]
        },
        {
          "label": "Built-in routing",
          "type": "boolean",
          "values": [false, false, true]
        },
        {
          "label": "Job market",
          "type": "text",
          "values": ["Excellent", "Good", "Good"]
        }
      ],
      "tradeoffs": {
        "metrics": [
          {
            "label": "Popularity",
            "values": [95, 75, 70],
            "highIsBetter": true
          },
          {
            "label": "Learning time",
            "values": [50, 30, 80],
            "lowIsBetter": true
          },
          {
            "label": "Performance",
            "values": [90, 90, 85],
            "highIsBetter": true
          }
        ]
      },
      "guidance": "React dominates job market. Vue is easiest to learn. Angular best for enterprise apps."
    }
  }
}
```

---

### Example 3: Database Types

```json
{
  "template_id": "Compare3A_FeatureMatrix",
  "fill": {
    "comparison": {
      "title": "Database Type Comparison",
      "recommendedIndex": 1,
      "options": [
        { "name": "SQL", "icon": "📊" },
        { "name": "NoSQL", "icon": "🗂️" },
        { "name": "Graph", "icon": "🕸️" }
      ],
      "features": [
        {
          "label": "Schema",
          "type": "text",
          "values": ["Fixed", "Flexible", "Graph-based"]
        },
        {
          "label": "Relationships",
          "type": "text",
          "values": ["Foreign keys", "Embedded/Ref", "Native edges"]
        },
        {
          "label": "Horizontal scaling",
          "type": "boolean",
          "values": [false, true, true]
        },
        {
          "label": "ACID compliance",
          "type": "boolean",
          "values": [true, false, true]
        },
        {
          "label": "Query language",
          "type": "text",
          "values": ["SQL", "Various", "Cypher/SPARQL"]
        }
      ],
      "tradeoffs": {
        "metrics": [
          {
            "label": "Consistency",
            "values": [100, 60, 90],
            "highIsBetter": true
          },
          {
            "label": "Scalability",
            "values": [50, 95, 80],
            "highIsBetter": true
          },
          {
            "label": "Flexibility",
            "values": [40, 100, 70],
            "highIsBetter": true
          }
        ]
      },
      "guidance": "SQL for structured data. NoSQL for scale and flexibility. Graph for complex relationships."
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
- `template_id`: "Compare3A_FeatureMatrix"
- `fill.comparison.title`: Comparison title
- `fill.comparison.options[]`: 2-5 options
- `fill.comparison.features[]`: 3-8 features
- `beats.optionHeaders`: When to show headers
- `beats.exit`: Scene end time

### Optional Fields
- `fill.comparison.recommendedIndex`: Highlight specific option
- `fill.comparison.tradeoffs`: Gauge visualization
- `fill.comparison.guidance`: Decision help text
- `beats.features[]`: Override auto-calculated timing

### Viewport
- **Resolution:** 1920×1080 (16:9)
- **Grid Area:** (160, 240) to (1760, 840)
- **Trade-off Area:** (160, 900) - below grid
- **Responsive:** Auto-scales columns based on option count

---

## Animation Presets Used

| Preset | Usage | Configuration |
|--------|-------|---------------|
| `fadeUpIn` | Title, feature labels, trade-offs, guidance | start, dur, dist, ease |
| `popInSpring` | Option headers, feature values | start, mass, stiffness, damping |
| `pulseEmphasis` | Recommended option spotlight | start, dur, scale, ease |

All presets support:
- Automatic frame conversion (seconds → frames)
- Easing curve selection
- Auto-clamping (no overshoot)
- FPS-agnostic (works at any frame rate)

---

## Collision Detection

### Bounding Boxes Defined

1. **Title Box:** (960, 130) - 1400×60px - priority 10
2. **Grid Area:** (960, 540) - 1600×600px - priority 10
3. **Guidance Box:** (960, 980) - 1200×80px - priority 9 (flexible)

### Safe Zones
- Top margin: 100px
- Side margins: 80px
- Bottom margin: 80px

---

## Quality Checklist

Before using this template, verify:

### Content
- [ ] Option count is 2-5 (optimal: 3-4)
- [ ] Feature count is 3-8 (optimal: 5-6)
- [ ] Each feature has values for ALL options
- [ ] Feature labels are concise (≤ 30 chars)
- [ ] Value types are appropriate (text/boolean/number)

### Timing
- [ ] Each feature row visible for 3-4s
- [ ] Trade-offs animate smoothly
- [ ] Decision guidance holds for 2-3s
- [ ] Total duration under 50s

### Style
- [ ] Mode matches content tone
- [ ] Grid lines are visible
- [ ] Text contrast is sufficient
- [ ] Recommended option is clear (if applicable)

### Technical
- [ ] Schema version is "5.0"
- [ ] All required fields present
- [ ] Values array length matches option count
- [ ] Collision detection passes

---

## Constraints & Best Practices

### Grid Guidelines
- **Options:** 2-5 (3-4 optimal for readability)
- **Features:** 3-8 (5-6 optimal for timing)
- **Cell content:** ≤ 30 chars per cell
- **Grid width:** Auto-scales (fixed 1600px total)

### Content Guidelines
- **Focus:** Compare SIMILAR things (apples to apples)
- **Fairness:** Present options objectively
- **Clarity:** Use concrete values, not vague terms
- **Completeness:** Cover features that matter for decision

### Visual Guidelines
- **Boolean values:** Use for yes/no only (not "maybe")
- **Text values:** Keep short (1-3 words)
- **Trade-offs:** 2-4 metrics (more = cluttered)
- **Guidance:** Actionable, not just summary

### Performance
- **Frame rate:** Optimized for 30fps (auto-scales to 60fps)
- **Export:** Guaranteed preview-to-export parity
- **Render time:** ~40-60s for 35-50s scene

---

## Extension Points

### Custom Value Renderers

Support for custom value formatting:
```json
{
  "features": [
    {
      "label": "Price",
      "type": "currency",
      "values": [10, 20, 30],
      "format": "$%d/month"
    }
  ]
}
```

### Custom Grid Styles

Override grid styling:
```json
{
  "gridStyle": {
    "cellPadding": 16,
    "headerHeight": 80,
    "rowHeight": 60,
    "borderColor": "#E0E0E0"
  }
}
```

---

## Troubleshooting

### Too Many Options (Cramped Columns)
**Reduce:** Option count to 3-4 OR split into two videos

### Feature Rows Too Fast
**Increase:** Individual feature durations to 4-5s each

### Text Overflowing Cells
**Solution:** Shorten text OR reduce font sizes via tokens

### Trade-off Gauges Not Clear
**Verify:** Values are 0-100, direction flags set, colors contrast

### Recommended Option Not Obvious
**Check:** `recommendedIndex` is correct, spotlight appears after `beats.decision`

---

## Cross-Domain Validation

This template has been designed for cross-domain use:

| Domain | Example Use Case | Status |
|--------|------------------|--------|
| **Tech/Cloud** | "Compute service comparison" | ✅ Primary use case |
| **Software** | "Framework comparison" | ✅ Validated |
| **Data** | "Database types" | ✅ Validated |
| **Business** | "Pricing tiers" | ✅ Ready |
| **Education** | "Certification paths" | ✅ Ready |
| **Consumer** | "Phone plans" | ✅ Ready |
| **Finance** | "Investment accounts" | ✅ Ready |

**Conclusion:** Template is proven domain-agnostic.

---

## Template Metadata

```javascript
export const TEMPLATE_ID = 'Compare3A_FeatureMatrix';
export const TEMPLATE_VERSION = '5.0.0';
export const DURATION_MIN_FRAMES = 1050;  // 35s @ 30fps
export const DURATION_MAX_FRAMES = 1500;  // 50s @ 30fps
export const SUPPORTED_MODES = ['notebook', 'whiteboard'];

export const CAPABILITIES = {
  usesSVG: true,
  usesLottie: false,
  usesRoughJS: true,
  requiresAudio: false,
  supportsTransitions: true,
  supportsDynamicOptionCount: true,
  supportsDynamicFeatureCount: true,
  hasTradeoffGauges: true,
  hasRecommendation: true,
};

export const AGNOSTIC_FEATURES = {
  optionCount: { min: 2, max: 5, recommended: '3-4' },
  featureCount: { min: 3, max: 8, recommended: '5-6' },
  domainAgnostic: true,
  valueTypes: ['text', 'boolean', 'number', 'range'],
  tradeoffMetrics: true,
  recommendationSupport: true,
  crossDomainTested: ['cloud', 'frameworks', 'databases', 'pricing']
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
- `popInSpring()` - Cell animation

---

## Continuous Improvement

### Known Limitations & Future Enhancements

#### 1. **Voiceover Synchronization (HIGH PRIORITY)**

**Current State:**
- Grid reveals are fixed timing (row-by-row, 3.5s per feature)
- No fine-grained control over stagger timing
- All cells in a row animate together
- Difficult to sync with voiceover pacing

**Needed Improvements:**
```json
// Future: Per-cell timing control
{
  "features": [
    {
      "label": "Cost",
      "values": [...],
      "timing": {
        "labelDelay": 0.3,
        "cellDelays": [0.5, 0.8, 1.1, 1.4],  // Per-option delays
        "cellDuration": 0.4
      }
    }
  ],
  "voiceover": {
    "syncMode": "manual",  // vs "auto"
    "featureTimings": [
      { "start": 2.5, "cellStagger": 0.3 },
      { "start": 6.2, "cellStagger": 0.2 },
      // etc.
    ]
  }
}
```

**Why It Matters:**
- VO: "Let's compare cost... Standard is $20, Nearline $10, Coldline $4..."
- Need cells to pop in sync with VO mentions (not auto-timed)
- Different features need different pacing (simple vs. complex)

**Implementation Complexity:** Medium (2-3 hours)

---

#### 2. **Flexible Cell Reveal Patterns**

**Current:** Sequential row-by-row only

**Needed:**
- Column-by-column (per option)
- Diagonal reveals
- Custom cell order
- "Highlight then fade others" pattern

```json
{
  "revealPattern": "column-by-column",  // Focus one option at a time
  // OR
  "revealPattern": "custom",
  "customOrder": [
    { "row": 0, "col": 0, "delay": 0.5 },
    { "row": 1, "col": 0, "delay": 0.8 },
    // etc.
  ]
}
```

---

#### 3. **Group/Batch Feature Reveals**

**Use Case:** "Now let's look at cost-related features together..."

```json
{
  "featureGroups": [
    {
      "label": "Cost Factors",
      "features": [0, 2, 4],  // Feature indices
      "revealTogether": true,
      "timing": { "start": 5.0, "duration": 2.0 }
    },
    {
      "label": "Performance",
      "features": [1, 3, 5],
      "revealTogether": true,
      "timing": { "start": 8.0, "duration": 2.0 }
    }
  ]
}
```

---

#### 4. **Pause/Hold States**

**Need:** Hold on specific features while VO explains in detail

```json
{
  "features": [
    {
      "label": "Cost",
      "values": [...],
      "holdDuration": 5.0,  // Hold visible for 5s before next
      "highlight": true  // Keep emphasized during hold
    }
  ]
}
```

---

### Workaround (Current)

**Until enhanced timing is implemented:**

1. **Manual Beat Timing:**
   - Calculate exact VO timestamps
   - Override `beats.features[]` array manually
   - Set per-feature durations in JSON

2. **Split Into Multiple Videos:**
   - Video 1: Show first 3 features
   - Video 2: Show remaining features
   - Gives more VO control per segment

3. **Use Transitions:**
   - Add transition scenes between feature reveals
   - Gives natural pause points for VO

---

### Priority Ranking

1. 🔴 **HIGH:** VO sync with per-cell timing control
2. 🟡 **MEDIUM:** Flexible reveal patterns
3. 🟡 **MEDIUM:** Feature grouping/batching
4. 🟢 **LOW:** Advanced animations (optional)

---

**Version:** 1.0  
**Status:** Production Ready (with VO sync limitations noted)  
**Last Updated:** 2025-10-30
