# Macro Scene Layout - Test Scenarios

This document provides test scenarios for validating the macro scene layout module (`sceneLayout.js`). Use these scenarios to manually test each layout type in the `ShowcaseScene10_SceneLayout.jsx` composition.

---

## How to Test

1. Open `/src/compositions/ShowcaseScene10_SceneLayout.jsx`
2. Change the `layout.type` value in `sceneConfig`
3. Adjust `layout.options` as needed for the specific layout
4. Run `npm run dev` and select "Scene 10: Macro Scene Layout (15s)" in the preview
5. Verify the slot visualization and mid-scene rendering

---

## Test Scenario 1: Full Layout

**Purpose:** Single content area below header

### Configuration
```javascript
layout: {
  type: "full",
  options: {
    padding: 40,
    titleHeight: 80
  }
}
```

### Expected Slots
- `header` - Title strip at top (80px height)
- `full` - Entire content area below header

### Validation Checklist
- [ ] Header slot renders at top with correct height (80px)
- [ ] Full slot fills remaining viewport below header
- [ ] Padding is applied on all sides (40px)
- [ ] "Hello World!" text renders centered in `full` slot
- [ ] Debug labels show correct slot dimensions

---

## Test Scenario 2: Row Stack Layout

**Purpose:** Horizontal rows stacked top-to-bottom

### Configuration (Equal Rows)
```javascript
layout: {
  type: "rowStack",
  options: {
    rows: 3,
    padding: 40,
    titleHeight: 80
  }
}
```

### Configuration (Custom Ratios)
```javascript
layout: {
  type: "rowStack",
  options: {
    rows: 3,
    rowRatios: [1, 2, 1],  // Middle row twice as tall
    padding: 40,
    titleHeight: 80
  }
}
```

### Expected Slots
- `header` - Title strip at top
- `row1` - First row
- `row2` - Second row
- `row3` - Third row

### Validation Checklist
- [ ] Header slot renders at top
- [ ] All row slots span full width
- [ ] Rows stack vertically with no gaps
- [ ] Total row heights equal content area height
- [ ] With ratios: middle row is visually taller
- [ ] "Hello World!" text renders in each row slot
- [ ] Debug labels show `row1`, `row2`, `row3`

---

## Test Scenario 3: Column Split Layout

**Purpose:** Vertical columns left-to-right

### Configuration (2 Columns - Equal)
```javascript
layout: {
  type: "columnSplit",
  options: {
    columns: 2,
    padding: 40,
    titleHeight: 80
  }
}
```

### Configuration (3 Columns - Custom Ratios)
```javascript
layout: {
  type: "columnSplit",
  options: {
    columns: 3,
    ratios: [1, 2, 1],  // Middle column twice as wide
    padding: 40,
    titleHeight: 80
  }
}
```

### Expected Slots
- `header` - Title strip at top
- `col1` - First column
- `col2` - Second column
- `col3` - Third column (if columns: 3)
- `left` → alias for `col1` (when columns: 2)
- `right` → alias for `col2` (when columns: 2)

### Validation Checklist
- [ ] Header slot renders at top
- [ ] Columns span full height of content area
- [ ] Columns divide horizontally with no gaps
- [ ] Total column widths equal content area width
- [ ] With ratios: middle column is visually wider
- [ ] "Hello World!" text renders in each column slot
- [ ] Debug labels show `col1`, `col2` (and `col3` if 3 columns)

---

## Test Scenario 4: Header Row Columns Layout

**Purpose:** Combined layout with header, row strip, and columns

### Configuration
```javascript
layout: {
  type: "headerRowColumns",
  options: {
    columns: 2,
    rowHeightRatio: 0.35,  // Row takes 35% of content area
    padding: 40,
    titleHeight: 80
  }
}
```

### Configuration (3 Columns with Ratios)
```javascript
layout: {
  type: "headerRowColumns",
  options: {
    columns: 3,
    columnRatios: [1, 2, 1],
    rowHeightRatio: 0.4,
    padding: 40,
    titleHeight: 80
  }
}
```

### Expected Slots
- `header` - Title strip at top
- `row` - Row section (35-40% of content area height)
- `col1`, `col2`, `col3` - Columns below row
- `left`, `right` → aliases (when columns: 2)

### Visual Structure
```
+-----------------------------+
|           header            |
+-----------------------------+
|             row             |
+-----------------------------+
|   col1   |   col2   | col3  |
+-----------------------------+
```

### Validation Checklist
- [ ] Header slot renders at top
- [ ] Row slot spans full width
- [ ] Row height is approximately 35% of remaining space
- [ ] Columns fill remaining space below row
- [ ] Columns divide horizontally
- [ ] Debug labels show `header`, `row`, `col1`, `col2`

---

## Test Scenario 5: Grid Slots Layout

**Purpose:** R×C grid of cells

### Configuration (2×2 Grid)
```javascript
layout: {
  type: "gridSlots",
  options: {
    rows: 2,
    columns: 2,
    padding: 40,
    titleHeight: 80
  }
}
```

### Configuration (2×3 Grid)
```javascript
layout: {
  type: "gridSlots",
  options: {
    rows: 2,
    columns: 3,
    padding: 40,
    titleHeight: 80
  }
}
```

### Expected Slots (2×3 Grid)
- `header` - Title strip at top
- `cellA`, `cellB`, `cellC` - First row cells
- `cellD`, `cellE`, `cellF` - Second row cells

### Cell Naming Rule
- If total cells ≤ 26: `cellA`, `cellB`, ... `cellZ` (row-major order)
- If total cells > 26: `r1c1`, `r1c2`, `r2c1`, etc.

### Validation Checklist
- [ ] Header slot renders at top
- [ ] Grid cells tile content area evenly
- [ ] No gaps between cells
- [ ] Cell naming follows A-Z pattern
- [ ] Debug labels show `cellA`, `cellB`, etc.
- [ ] Total cell area equals content area

---

## Edge Cases to Test

### Minimum Values
```javascript
layout: {
  type: "rowStack",
  options: {
    rows: 1,  // Should clamp to 1
    padding: 0,
    titleHeight: 0
  }
}
```
- [ ] Layout renders without errors
- [ ] Single row fills entire viewport

### Maximum Values
```javascript
layout: {
  type: "gridSlots",
  options: {
    rows: 6,
    columns: 6,  // 36 cells, uses r1c1 naming
    padding: 20,
    titleHeight: 50
  }
}
```
- [ ] Layout renders without errors
- [ ] 36 cells tile correctly
- [ ] Cell names use `r1c1`, `r1c2`, etc. pattern

### Invalid Values (Graceful Degradation)
```javascript
layout: {
  type: "rowStack",
  options: {
    rows: -5,  // Should default to 3
    padding: 40,
    titleHeight: 80
  }
}
```
- [ ] Console shows warning about invalid rows
- [ ] Defaults to 3 rows
- [ ] No runtime errors

### Unknown Layout Type
```javascript
layout: {
  type: "unknownType",
  options: {}
}
```
- [ ] Console shows warning about unknown type
- [ ] Falls back to "full" layout
- [ ] No runtime errors

---

## Debug Visualization

The showcase scene includes debug visualization (set `showDebug = true`):

- **Dashed borders**: Show slot boundaries (orange)
- **Labels**: Show slot name and dimensions (e.g., `col1: 860×900`)
- **Info overlay**: Shows current layout type and available slots

### Verifying Geometry

1. Check that slot dimensions match expected calculations:
   - Header: `(viewport.width - padding*2) × titleHeight`
   - Content area: `(viewport.width - padding*2) × (viewport.height - titleHeight - padding*2)`

2. Verify slots tile without gaps:
   - Sum of row heights = content area height
   - Sum of column widths = content area width

---

## Quick Reference: JSON Config Structure

```javascript
const sceneConfig = {
  id: "scene-id",
  title: "Scene Title",
  
  layout: {
    type: "columnSplit" | "rowStack" | "full" | "headerRowColumns" | "gridSlots",
    options: {
      rows?: number,        // For rowStack, gridSlots
      columns?: number,     // For columnSplit, headerRowColumns, gridSlots
      ratios?: number[],    // For columnSplit
      rowRatios?: number[], // For rowStack
      columnRatios?: number[], // For headerRowColumns
      rowHeightRatio?: number, // For headerRowColumns (0-1)
      titleHeight?: number,    // Header height (default: 70)
      padding?: number,        // Content padding (default: 0)
    }
  },
  
  slots: {
    "slotName": {
      midScene: "textReveal",
      props: {
        config: { /* mid-scene config */ }
      }
    }
  }
};
```
