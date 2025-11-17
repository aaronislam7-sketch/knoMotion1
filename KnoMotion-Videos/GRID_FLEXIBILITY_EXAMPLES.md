# GridLayoutScene Flexibility Examples

**Purpose:** Demonstrate how GridLayoutScene can work with ANY mid-level component

---

## Architecture Principle

**GridLayoutScene (Template) provides:**
- Grid position calculations (x, y coordinates)
- Layout container
- Background effects

**Mid-Level Component (Child) provides:**
- Content rendering
- Animations
- Styling
- Interactive behaviors

**The template is agnostic about WHAT it's displaying!**

---

## Example 1: GridLayoutScene + AppMosaic

**Use Case:** App showcase, feature grid, tool comparison

```json
{
  "template_id": "GridLayoutScene",
  "content": {
    "title": "ML Frameworks",
    "items": [
      { "label": "TensorFlow", "icon": "🔶", "description": "ML platform" },
      { "label": "PyTorch", "icon": "🔥", "description": "Research framework" }
    ]
  },
  "layout": {
    "columns": 3,
    "gap": 50
  },
  "mid_level_components": {
    "appMosaic": {
      "enabled": true,
      "focusZoom": false
    }
  }
}
```

**Result:** Grid of app/framework cards with glassmorphic styling

---

## Example 2: GridLayoutScene + FlowDiagram

**Use Case:** Process steps in grid layout, decision tree nodes

```json
{
  "template_id": "GridLayoutScene",
  "content": {
    "title": "Data Processing Pipeline",
    "nodes": [
      { "id": "1", "label": "Collect", "description": "Gather data" },
      { "id": "2", "label": "Clean", "description": "Remove noise" },
      { "id": "3", "label": "Transform", "description": "Normalize" }
    ],
    "edges": [
      { "from": "1", "to": "2" },
      { "from": "2", "to": "3" }
    ]
  },
  "layout": {
    "columns": 3,
    "gap": 60
  },
  "mid_level_components": {
    "flowDiagram": {
      "enabled": true,
      "showEdges": true
    }
  }
}
```

**Result:** Grid of flow nodes with connecting edges

---

## Example 3: GridLayoutScene + DataVisualization (Future)

**Use Case:** Metrics dashboard, KPI grid

```json
{
  "template_id": "GridLayoutScene",
  "content": {
    "title": "Model Performance Metrics",
    "metrics": [
      { "label": "Accuracy", "value": 0.95, "trend": "up" },
      { "label": "Precision", "value": 0.92, "trend": "stable" },
      { "label": "Recall", "value": 0.89, "trend": "up" }
    ]
  },
  "layout": {
    "columns": 3,
    "gap": 40
  },
  "mid_level_components": {
    "dataVisualization": {
      "enabled": true,
      "chartType": "gauge"
    }
  }
}
```

**Result:** Grid of data visualizations (charts, gauges, graphs)

---

## Example 4: GridLayoutScene + CodeBlock (Future)

**Use Case:** Code examples grid, syntax comparison

```json
{
  "template_id": "GridLayoutScene",
  "content": {
    "title": "Python vs JavaScript",
    "codeBlocks": [
      { "language": "python", "code": "def hello():\n  print('Hi')" },
      { "language": "javascript", "code": "function hello() {\n  console.log('Hi');\n}" }
    ]
  },
  "layout": {
    "columns": 2,
    "gap": 50
  },
  "mid_level_components": {
    "codeBlock": {
      "enabled": true,
      "highlightSyntax": true
    }
  }
}
```

**Result:** Grid of syntax-highlighted code blocks

---

## Example 5: GridLayoutScene + No Mid-Level (Simple)

**Use Case:** Simple grid without complex rendering needs

```json
{
  "template_id": "GridLayoutScene",
  "content": {
    "title": "Key Concepts",
    "items": [
      { "label": "Supervised", "icon": "📊" },
      { "label": "Unsupervised", "icon": "🔍" },
      { "label": "Reinforcement", "icon": "🎮" }
    ]
  },
  "layout": {
    "columns": 3,
    "gap": 50
  },
  "mid_level_components": {
    // All disabled - use simple rendering
  }
}
```

**Result:** Simple grid with basic styling (fallback rendering)

---

## How It Works

### Template Code (Simplified)

```javascript
export const GridLayoutScene = ({ scene }) => {
  // 1. Calculate positions (template's job)
  const positions = calculateGridPositions(items, { columns, gap, viewport });
  
  // 2. Check which mid-level is enabled
  if (config.mid_level_components?.appMosaic?.enabled) {
    return <AppMosaic items={items} positions={positions} />;
  }
  
  if (config.mid_level_components?.flowDiagram?.enabled) {
    return <FlowDiagram nodes={nodes} positions={positions} />;
  }
  
  if (config.mid_level_components?.dataVisualization?.enabled) {
    return <DataVisualization metrics={metrics} positions={positions} />;
  }
  
  // 3. Fallback: simple rendering
  return <SimpleGridItems items={items} positions={positions} />;
};
```

---

## Benefits

### 1. Maximum Flexibility
- Same grid layout works with ANY content type
- Change mid-level component via JSON (no code changes)
- Mix and match as needed

### 2. Reusability
- Write grid position logic once
- Reuse for apps, flows, charts, code, anything!

### 3. Composability
```json
// Scenario 1: App grid
{ "template_id": "GridLayoutScene", "mid_level_components": { "appMosaic": { "enabled": true } } }

// Scenario 2: Flow nodes in grid
{ "template_id": "GridLayoutScene", "mid_level_components": { "flowDiagram": { "enabled": true } } }

// Scenario 3: Simple grid (no mid-level)
{ "template_id": "GridLayoutScene", "mid_level_components": {} }
```

### 4. Template Agnostic
**GridLayoutScene doesn't care:**
- What you're displaying (apps, flows, charts, code)
- How you're animating it
- What styling you're using

**GridLayoutScene only cares:**
- Where things go (positions)
- How many columns
- How much gap

---

## Future Mid-Levels for GridLayoutScene

Potential mid-level components that could work with GridLayoutScene:

1. **AppMosaic** ✅ - App/feature cards
2. **FlowDiagram** 🔄 - Flow nodes
3. **DataVisualization** 🔄 - Charts, gauges, metrics
4. **CodeBlock** 🔄 - Syntax-highlighted code
5. **ImageGallery** 🔄 - Photo grid
6. **VideoGrid** 🔄 - Video thumbnails
7. **ProfileCards** 🔄 - Team members, testimonials
8. **ProductCards** 🔄 - E-commerce products
9. **DocumentCards** 🔄 - File browser, document grid
10. **Timeline** 🔄 - Events in grid layout

**All using the same GridLayoutScene template!** 🚀

---

## Key Takeaway

**GridLayoutScene is a "position provider"**
- Calculates where things go
- Doesn't care what things are
- Works with any mid-level that accepts positions

**Mid-levels are "content renderers"**
- Render actual content
- Handle animations
- Apply styling
- Work in ANY template that provides positions

**This is true flexibility!** ✅
