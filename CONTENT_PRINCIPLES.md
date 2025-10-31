# Content Principles - KnoMotion Platform
## Visual Support for Voiceover, Not Standalone Textbooks

**Created:** 2025-10-30  
**Status:** MANDATORY for all templates  
**Violation:** Template cannot ship

---

## 0. Core Philosophy

**Scenes are visual support for VO, not standalone textbooks.**

- VO leads → visuals respond (highlight, draw path, swap focus)
- Scene shows structure and progress, not arguments
- If you mute VO, you still infer progress (what was chosen), not the whole lesson

---

## 1. Guardrails (ALL templates)

### Focus Budget
- **Max concurrent focus items:** 1 primary + 1 secondary (ghosted/minified)
- **On-screen copy budget:** ≤12 words per focus item
- **Never wrap to 3+ lines**

### Timing
- **Cadence:** 3-5 beats per 30-40s scene
- **Each beat:** 4-8s duration
- **Clear entry action:** draw, fade, slide
- **Clear exit action:** ghost, slide out

### Motion
- **NO wobble** (roughness: 0, bowing: 0)
- **Micro-breathe:** 1-3% scale only
- **Allowed:** fades, slides, draw-on
- **Forbidden:** fly-ins from all directions

### Hierarchy
- **VO states the decision, frames the why, narrates each path**
- **Scene shows structure, not arguments**
- **Visuals respond to VO:** highlight, draw path, swap focus

### Never Use
- ❌ Text walls
- ❌ Multi-panel dashboards
- ❌ Emoji UI
- ❌ More than 2 focal items at once

### Aesthetic
- **Warm "alive notebook" + whiteboard-lite**
- **Hand-drawn accents are accents, not layout**

---

## 2. Template Types

### Hook Templates
- **Goal:** Attention + question/tension
- **Visual:** 1 object of focus (question, stat, contrast)
- **Duration:** 12-20s
- **Beats:** 2-3
- **Copy budget:** ≤10 words per beat

### Teaching Templates (Explain/Compare/Show/Build)
- **Goal:** Understanding via VO + minimal structure
- **Visual:** Diagrams/trees/flows/timelines with progressive disclosure
- **Duration:** 25-45s
- **Beats:** 3-5
- **Complexity:** More structure, NOT more text
- **Transitions:** Swap focus, draw paths, reveal outcomes

---

## 3. Compare3B: Decision Tree - Definitive Spec

### Purpose
Teach a branching choice (e.g., "How much OS control do you need?"), **not all the rationale at once.**

### Visual Elements (ONLY THESE)
1. **Tree nodes** (labels: 2-4 words each)
2. **Edges** (draw-on lines)
3. **Current-focus highlight** (ring/pulse around active node)
4. **Path trail** (subtle stroke weight increase + arrowhead)
5. **Optional outcome chip** (single pill at leaf: 2-3 words)

### FORBIDDEN in Compare3B
- ❌ Stakes panels
- ❌ Definition boxes
- ❌ Trade-off panels
- ❌ Context tooltips
- ❌ Metrics panels
- ❌ Summary panels

**These belong to other templates:**
- Trade-offs → `CompareTradeOff1A` (separate template)
- Definitions → `TermPop1` (separate template)
- Metrics → `MetricGlance1` (separate template)
- Summary → `RecapPath1` (separate template)

### Beat-by-Beat Flow (30s @ 30fps)

**Beat 1 (0-5s):** Root question alone
- Big, centered
- Draw-on underline
- VO: States the decision

**Beat 2 (5-10s):** Root slides up-left, branches appear
- Root slides up-left to 70% scale
- First-level branches draw on (L→R)
- VO: Frames the why

**Beat 3 (10-18s):** Highlight left branch
- Highlight left branch (1.05 scale + glow)
- Path animates
- Reveal child nodes
- Ghost sibling branch to 40% opacity
- VO: Narrates left path

**Beat 4 (18-26s):** Toggle to right branch
- Ghost left (40% opacity)
- Highlight right branch
- Animate its path
- Reveal its child nodes
- VO: Narrates right path

**Beat 5 (26-30s):** Land on outcome
- Land on 1 example leaf
- Show outcome chip only
- De-emphasize rest to 20% opacity
- VO: Concludes with example

### VO Role (What VO Does vs. Visuals)
- **VO:** States decision, frames why, narrates each path succinctly
- **Scene:** Shows structure and progress, not arguments
- **If you must add rationale:** Next scene, not here

### Timing & Animation Primitives
- **Draw lines:** write-on (stroke dashoffset)
- **Highlights:** 1.05 scale + soft glow for 400-600ms on beat entry
- **Easing:** cubic-bezier(0.2, 0.8, 0.2, 1) (no bounce/overshoot)

---

## 4. Collision Detection Strategy

### Why Previous Attempts Failed
Placing nodes without text metrics or ignoring font/scale/stroke widths = collisions.

### Deterministic Fix (NO HALLUCINATIONS)

**Step 1: Use Real Layout Engine**
- **Preferred:** elkjs
- **Fallback:** dagre
- **Inputs:** node ids, label text length, minWidth/height
- **Options:** 
  - layered layout
  - nodeSpacing: 64-96
  - rankSpacing: 72-120

**Step 2: Measure Text Before Render**
- Compute approximate width using canvas `measureText`
- Use title/body fonts at actual scale
- Add padding (+16px)

**Step 3: Reserve Space for Highlights**
- Inflate node rect by +8-12px for glow/scale on focus

**Step 4: Edge Routing**
- Orthogonal or spline from layout engine
- Add 8-12px label gutters

**Step 5: Label Placement**
- If label would overflow:
  - Shrink font by 0.85x once, OR
  - Truncate with ellipsis
- **Never wrap beyond 2 lines**

**Step 6: Last Resort**
- If ANY bbox intersects after layout:
  - Auto-reduce sibling count shown in this beat (stagger reveal)
- **Never let collisions reach the frame**

### Acceptance Tests
- ✅ 0 overlaps at 1920×1080 and 1080×1920
- ✅ Focus highlight never clips outside frame
- ✅ No label < 12px on desktop baseline
- ✅ All edges maintain ≥12px from any label bbox

---

## 5. JSON Schema - Compare3B Minimal

```json
{
  "scene_id": "Compare3B",
  "duration_s": 30,
  "beats": [
    {"id":"b1","start_s":0,"end_s":5,"focus_node":"root","show":["root"],"ghost":[]},
    {"id":"b2","start_s":5,"end_s":10,"focus_node":"root","show":["root","n1","n2"],"ghost":[]},
    {"id":"b3","start_s":10,"end_s":18,"focus_node":"n1","show":["root","n1","n1a","n1b"],"ghost":["n2"]},
    {"id":"b4","start_s":18,"end_s":26,"focus_node":"n2","show":["root","n2","n2a","n2b"],"ghost":["n1","n1a","n1b"]},
    {"id":"b5","start_s":26,"end_s":30,"focus_node":"n2b","show":["root","n2","n2b"],"ghost":["n1","n1a","n1b","n2a"],"outcome_node":"n2b"}
  ],
  "graph": {
    "nodes": [
      {"id":"root","label":"OS control needed?"},
      {"id":"n1","label":"Yes"},
      {"id":"n2","label":"No"},
      {"id":"n1a","label":"Bare metal"},
      {"id":"n1b","label":"VMs"},
      {"id":"n2a","label":"Containers"},
      {"id":"n2b","label":"Fully managed"}
    ],
    "edges": [
      {"from":"root","to":"n1"},
      {"from":"root","to":"n2"},
      {"from":"n1","to":"n1a"},
      {"from":"n1","to":"n1b"},
      {"from":"n2","to":"n2a"},
      {"from":"n2","to":"n2b"}
    ]
  },
  "styles": {
    "node": {"font":"title","max_words":4},
    "edge": {"style":"draw_on","duration_ms":600},
    "highlight": {"scale":1.05,"glow_px":8}
  },
  "layout": {
    "engine":"elk",
    "node_spacing":80,
    "rank_spacing":96,
    "direction":"TB"
  }
}
```

### Schema Rules
- **If node label > 4 words:** Truncate with ellipsis, VO carries full phrase
- **If layout.engine fails:** Fall back to dagre
- **Never introduce properties not in schema** without PRD note

---

## 6. "Good Looks Like" Checklist

**MUST pass ALL before template ships:**

- [ ] ≤2 focal items at once
- [ ] Every beat has clear entry action (draw, fade) and exit (ghost, slide)
- [ ] No cramped labels
- [ ] Nothing touches edges
- [ ] Safe areas respected (120px margins)
- [ ] Viewer can sketch structure from memory after watching
- [ ] If you mute VO, you still infer progress (not the whole lesson)

---

## 7. Allowed Components by Template

### Compare3B (Decision Tree)
**Allowed:**
- Tree
- NodeLabel
- Edge
- HighlightRing
- OutcomeChip
- GhostLayer

**Forbidden:**
- StakesPanel
- DefinitionBox
- TradeOffPanel
- ContextTooltip
- MetricsPanel
- SummaryPanel

---

## 8. Hard-Stop Rules (Prevent Hallucinations)

1. **Only use components from Allowed Components List**
2. **If content not representable with allowed list:**
   - Return "Template mismatch" note
   - Do NOT invent new panels
3. **Max 1 schema extension per PR:**
   - Must include rationale + visual mock
4. **If collision test fails:**
   - Scene cannot render
   - Return remediation message
   - Don't auto-reflow into chaos

---

## 9. Where Crowded Content Goes

**When user provides:**
- **Trade-offs** → `CompareTradeOff1A` (two-column pro/con cards, 2-3 items max)
- **Definitions** → `TermPop1` (single definition card, 6-8s)
- **Metrics** → `MetricGlance1` (max 3 big numbers, staggered, 8-10s)
- **Summary** → `RecapPath1` (re-draw chosen path, final chip)

**Do NOT cram into Compare3B.**

---

## 10. Example VO Scaffold (Knode Tone)

```
"Big question: How much OS control do you actually need?
If it's a yes, you're choosing control over convenience — think bare metal or VMs.
If it's a no, you're optimising for speed — containers or fully managed.
Let's trace the 'no' path… and land on a managed option you can ship with tomorrow."
```

**Brand voice:** Warm, clear, TED-style, no jargon dumps.

---

## Enforcement

**These principles are MANDATORY.**

- Any template violating these principles cannot ship
- Code reviews must check against this document
- If unsure, ask BEFORE building
- When in doubt: LESS IS MORE

**Last Updated:** 2025-10-30  
**Status:** LOCKED (changes require PRD)