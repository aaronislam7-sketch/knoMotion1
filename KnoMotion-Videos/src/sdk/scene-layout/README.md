# Macro Scene Layout Module

**File:** `sceneLayout.js`

## Overview

This module handles **MACRO scene layout** — carving a full video viewport into named slots that mid-scenes can use to position their content.

### Three-Layer Architecture

| Layer | Responsibility | Module |
|-------|----------------|--------|
| **Macro Layout** | Viewport → Named Slots | `sceneLayout.js` (THIS) |
| **Mid-Scenes** | Fill ONE slot with content | Various mid-scene components |
| **Micro Layout** | Item-level geometry & collision | `layoutEngine.js` |

This module is **independent** of the micro layout engine and does not import or reference it.

## API

### `resolveSceneSlots(layout, viewport)`

Main entry point. Returns a `SlotMap` of named areas.

```javascript
import { resolveSceneSlots } from './sceneLayout';

const slots = resolveSceneSlots(
  { type: 'rowStack', options: { rows: 3 } },
  { width: 1920, height: 1080 }
);
// → { header, row1, row2, row3 }
```

## Layout Types

### 1. `full`

Single content area below header.

**Slots:** `header`, `full`

```javascript
{ type: 'full', options: { titleHeight?: 70, padding?: 0 } }
```

### 2. `rowStack`

Horizontal rows stacked top-to-bottom.

**Slots:** `header`, `row1`, `row2`, ... `rowN`

```javascript
{ 
  type: 'rowStack', 
  options: { 
    rows: 3,              // Required (clamped 1–6)
    rowRatios?: [1,2,1],  // Optional relative heights
    titleHeight?: 70,
    padding?: 0 
  } 
}
```

### 3. `columnSplit`

Vertical columns left-to-right.

**Slots:** `header`, `col1`, `col2`, ... `colN`  
**Aliases (when columns=2):** `left` → `col1`, `right` → `col2`

```javascript
{ 
  type: 'columnSplit', 
  options: { 
    columns: 2,         // Required (clamped 1–6)
    ratios?: [1, 2],    // Optional relative widths
    titleHeight?: 70,
    padding?: 0 
  } 
}
```

### 4. `headerRowColumns`

Combined layout with header, row strip, and columns.

```
+-----------------------------+
|           header            |
+-----------------------------+
|             row             |
+-----------------------------+
|   col1   |   col2   | ...   |
+-----------------------------+
```

**Slots:** `header`, `row`, `col1`, `col2`, ... `colN`  
**Aliases (when columns=2):** `left` → `col1`, `right` → `col2`

```javascript
{ 
  type: 'headerRowColumns', 
  options: { 
    columns: 3,              // Required (clamped 1–6)
    columnRatios?: [1,1,1],  // Optional relative widths
    rowHeightRatio?: 0.35,   // Row height as fraction of content
    titleHeight?: 70,
    padding?: 0 
  } 
}
```

### 5. `gridSlots`

R×C grid of cells.

**Slots:** `header` + cells named:
- `cellA`, `cellB`, ... `cellZ` (if ≤26 cells)
- `r1c1`, `r1c2`, `r2c1`, ... (if >26 cells)

```javascript
{ 
  type: 'gridSlots', 
  options: { 
    rows: 2,          // Required (clamped 1–6)
    columns: 3,       // Required (clamped 1–6)
    titleHeight?: 70,
    padding?: 0 
  } 
}
```

## Global Behavior

All layouts:
- Reserve a **header/title strip** at the top (default 70px)
- Compute **contentArea** below header, respecting padding
- Return at least `slots.header`

## Defaults & Safety

| Option | Default |
|--------|---------|
| `titleHeight` | 70 |
| `padding` | 0 |
| `rows` (fallback) | 3 |
| `columns` (fallback) | 2 |
| `rowHeightRatio` | 0.35 |
| Row/column clamp | 1–6 |

Invalid configs produce console warnings and graceful fallbacks — **never throws**.

## Exported Helpers

```javascript
// Core exports
export { resolveSceneSlots, SCENE_LAYOUT_TYPES, SCENE_LAYOUT_DEFAULTS };

// Advanced helpers
export { createArea, splitHorizontal, splitVertical, normalizeRatios, calculateBaseAreas };
```

## Type Definitions (JSDoc)

```typescript
type SceneLayoutType = 'full' | 'rowStack' | 'columnSplit' | 'headerRowColumns' | 'gridSlots';

interface Viewport { width: number; height: number; }

interface LayoutArea { left: number; top: number; width: number; height: number; }

interface SceneLayoutConfig { type: SceneLayoutType; options?: object; }

type SlotMap = Record<string, LayoutArea>;
```
