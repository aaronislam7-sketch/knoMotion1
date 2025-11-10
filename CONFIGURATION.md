# ⚙️ Configuration Guide

**Complete guide to configuring KnoMotion video templates via JSON**

---

## 📚 Table of Contents

1. [Overview](#overview)
2. [Scene JSON Structure](#scene-json-structure)
3. [Configuration Principles](#configuration-principles)
4. [Common Patterns](#common-patterns)
5. [Per-Template Config](#per-template-config)
6. [Tailwind Usage](#tailwind-usage)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

KnoMotion templates are **100% configurable** via JSON. No code changes are needed to:

- ✅ Change all text, colors, and visuals
- ✅ Adjust timing, layout, and sizing
- ✅ Toggle effects and animations
- ✅ Switch themes and styles
- ✅ Adapt to any domain or subject

**Two ways to configure:**
1. **Visual UI** - Use the Template Gallery & Config tool (recommended)
2. **Direct JSON** - Edit JSON files directly (power users)

---

## 📋 Scene JSON Structure

### Core Schema (All Templates)

```json
{
  "schema_version": "6.0",
  "template_id": "TemplateName_V6",
  
  "metadata": {
    "name": "Scene Name",
    "description": "Brief description",
    "primary_intention": "EXPLAIN",
    "secondary_intentions": ["HOOK", "MICRO"],
    "tags": ["concept", "teaching"],
    "duration_estimate": "30s"
  },
  
  "title": {
    "text": "Your Title Here",
    "position": "top-center",
    "offset": { "x": 0, "y": 80 }
  },
  
  "style_tokens": {
    "colors": { /* ... */ },
    "fonts": { /* ... */ }
  },
  
  "beats": { /* timing */ },
  
  "layout": { /* sizing */ },
  
  "effects": { /* visual effects */ }
}
```

---

### Required Fields

Every scene JSON must include:

**1. Schema Version**
```json
"schema_version": "6.0"
```
Identifies the JSON schema version. Use "6.0" for all V6 templates.

**2. Template ID**
```json
"template_id": "Explain2AConceptBreakdown_V6"
```
Must match exactly with a registered template name.

**3. Title**
```json
"title": {
  "text": "What is Deep Learning?",
  "position": "top-center",     // or "top-left", "top-right"
  "offset": { "x": 0, "y": 80 }  // Distance from edge (pixels)
}
```

---

### Optional But Recommended

**Metadata** (for organization):
```json
"metadata": {
  "name": "Scene Name",
  "description": "What this scene teaches",
  "primary_intention": "EXPLAIN",           // HOOK, EXPLAIN, APPLY, REFLECT
  "secondary_intentions": ["MICRO"],        // Additional tags
  "tags": ["concept", "breakdown"],
  "duration_estimate": "30s"
}
```

---

## 🎨 Configuration Principles

### 1. Cosmetic vs Content Separation

**Content** = What is said (text, data, meaning)  
**Cosmetics** = How it looks (colors, fonts, effects)

**Keep them separate:**

```json
// ✅ GOOD: Content separate from style
{
  "parts": [
    { "label": "Neural Networks", "description": "Layers of nodes" }
  ],
  "style_tokens": {
    "colors": { "primary": "#FF6B35" }
  }
}

// ❌ BAD: Mixed together
{
  "parts": [
    { 
      "label": "Neural Networks",
      "color": "#FF6B35",    // Style in content
      "fontSize": 28         // Style in content
    }
  ]
}
```

### 2. Everything Has a Default

Templates provide sensible defaults for all fields:

```json
// You can omit fields - defaults will be used
{
  "template_id": "Explain2A_V6",
  "title": { "text": "My Title" }
  // colors, fonts, beats, layout all use defaults
}
```

### 3. Progressive Configuration

Start simple, add complexity as needed:

**Level 1: Minimal** (content only)
```json
{
  "template_id": "Explain2A_V6",
  "title": { "text": "Title" },
  "parts": [
    { "label": "Part 1" },
    { "label": "Part 2" }
  ]
}
```

**Level 2: Styled** (add colors)
```json
{
  "template_id": "Explain2A_V6",
  "title": { "text": "Title" },
  "parts": [...],
  "style_tokens": {
    "colors": {
      "bg": "#1A1A1A",
      "primary": "#FF6B35"
    }
  }
}
```

**Level 3: Customized** (full control)
```json
{
  "template_id": "Explain2A_V6",
  "title": { "text": "Title" },
  "parts": [...],
  "style_tokens": { "colors": {...}, "fonts": {...} },
  "beats": { "title": 1.0, "firstPart": 2.5 },
  "layout": { "radius": 420, "partSize": 200 },
  "effects": { "particles": { "enabled": true, "count": 20 } }
}
```

---

## 🔧 Common Patterns

### Colors Configuration

Standard color palette structure:

```json
"style_tokens": {
  "colors": {
    "bg": "#1A1A1A",           // Background
    "primary": "#FF6B35",       // Main accent color
    "secondary": "#4ECDC4",     // Secondary accent
    "text": "#FFFFFF",          // Main text color
    "textSecondary": "#B0B0B0", // Secondary text
    "connection": "#CBD5E0"     // Lines, borders
  }
}
```

**Color presets** (common themes):

```json
// Dark theme
"colors": {
  "bg": "#1A1A1A",
  "primary": "#FF6B35",
  "text": "#FFFFFF"
}

// Light theme
"colors": {
  "bg": "#FFF9F0",
  "primary": "#E74C3C",
  "text": "#1A1A1A"
}

// Professional
"colors": {
  "bg": "#F5F7FA",
  "primary": "#2C3E50",
  "text": "#2C3E50"
}

// Vibrant
"colors": {
  "bg": "#0F0F1E",
  "primary": "#00FF88",
  "secondary": "#FF0099",
  "text": "#FFFFFF"
}
```

---

### Fonts Configuration

```json
"style_tokens": {
  "fonts": {
    // Font sizes (pixels)
    "size_title": 72,
    "size_subtitle": 36,
    "size_body": 24,
    "size_label": 28,
    "size_description": 16,
    
    // Font weights
    "weight_title": 800,      // Black
    "weight_body": 600,       // Semi-bold
    "weight_light": 400,      // Regular
    
    // Font families (optional - uses system fonts by default)
    "family_title": "Inter",
    "family_body": "Inter"
  }
}
```

**Font size guidelines:**
- **Titles:** 48-96px (readable from distance)
- **Body text:** 20-32px (comfortable reading)
- **Descriptions:** 14-20px (supporting details)
- **Labels:** 24-36px (emphasis)

**Always cap font sizes** to prevent overflow:
```javascript
// Template code automatically applies:
fontSize: Math.min(config.fonts.size_title, 72)
```

---

### Beats (Timing) Configuration

Beats control **when animations happen** (in seconds):

```json
"beats": {
  "entrance": 0.5,         // Initial fade-in
  "title": 1.0,            // Title appears
  "firstElement": 2.5,     // First content element
  "elementInterval": 0.6,  // Delay between elements
  "connections": 5.0,      // Lines/connections draw
  "emphasis": 7.0,         // Emphasis animations
  "hold": 9.0,             // Hold final state
  "exit": 11.0             // Exit animations start
}
```

**Timing principles:**
- Keep entrance quick (0.3-0.8s)
- Stagger elements (0.3-0.8s apart)
- Allow time to read (hold for 2-5s)
- Smooth exit (0.5-1.0s)

**Example timings for different durations:**

**Short (15s):**
```json
"beats": {
  "entrance": 0.5,
  "title": 1.0,
  "content": 2.0,
  "hold": 12.0,
  "exit": 14.0
}
```

**Medium (30s):**
```json
"beats": {
  "entrance": 0.5,
  "title": 1.5,
  "firstElement": 3.0,
  "elementInterval": 0.8,
  "hold": 26.0,
  "exit": 28.0
}
```

**Long (60s):**
```json
"beats": {
  "entrance": 0.8,
  "title": 2.0,
  "firstElement": 4.0,
  "elementInterval": 1.2,
  "emphasis": 35.0,
  "hold": 56.0,
  "exit": 58.0
}
```

---

### Layout Configuration

Controls sizing and positioning:

```json
"layout": {
  // Hub-and-spoke templates
  "radius": 420,            // Distance from center to parts
  "centerSize": 220,        // Size of center element
  "partSize": 200,          // Size of outer parts
  "spacing": 1.4,           // Spacing multiplier
  
  // Grid templates
  "columns": 3,             // Items per row
  "itemSize": 240,          // Size of each item
  "gap": 40,                // Space between items
  
  // Sequential templates
  "width": 800,             // Container width
  "itemHeight": 180,        // Height of each item
  "verticalGap": 60         // Space between rows
}
```

**Sizing guidelines:**
- Use **90-95% of screen** (1920x1080)
- Leave margins: top 70-80px, sides 80-100px, bottom 40-60px
- Element sizes: 180-260px (bold, not timid)
- Spacing: 1.2-1.6x element size

---

### Effects Configuration

Toggle visual effects:

```json
"effects": {
  // Ambient particles
  "particles": {
    "enabled": true,
    "count": 20,              // 15-30 recommended
    "style": "ambient",       // "ambient", "burst", "flow"
    "color": "#4ECDC4",
    "opacity": 0.4
  },
  
  // Glow effects
  "glow": {
    "enabled": true,
    "intensity": 25,          // 10-50
    "color": "#FF6B35"
  },
  
  // Spotlight
  "spotlight": {
    "enabled": true,
    "position": { "x": 50, "y": 50 },  // Percentage
    "size": 800,              // Pixels
    "opacity": 0.2
  },
  
  // Film grain
  "noiseTexture": {
    "enabled": true,
    "opacity": 0.03           // Very subtle (0.02-0.05)
  },
  
  // Glassmorphic blur
  "glassmorphic": {
    "enabled": true,
    "blurAmount": 10,         // 8-15px
    "opacity": 0.25
  }
}
```

---

## 🎯 Per-Template Config

### Explain2A: Concept Breakdown

**Unique fields:**

```json
{
  "template_id": "Explain2AConceptBreakdown_V6",
  
  "center": {
    "text": "Central Concept",
    "visual": {
      "type": "emoji",        // "emoji", "icon", "image", "none"
      "value": "🧠",          // Emoji or image URL
      "scale": 2.0,
      "enabled": true
    }
  },
  
  "parts": [
    {
      "label": "Part 1",
      "description": "Description text",
      "color": "#FF6B35",     // Override individual colors
      "icon": "🎯"            // Optional icon
    },
    {
      "label": "Part 2",
      "description": "Description text",
      "color": "#4ECDC4"
    }
    // 2-8 parts supported
  ],
  
  "connections": {
    "enabled": true,
    "style": "line",          // "line", "dashed", "particle-flow"
    "animated": true
  }
}
```

---

### Hook1A: Question Burst

**Unique fields:**

```json
{
  "template_id": "Hook1AQuestionBurst_V6",
  
  "question": {
    "lines": [
      {
        "text": "What if geography",
        "emphasis": "normal"  // "normal" or "high"
      },
      {
        "text": "was measured in mindsets?",
        "emphasis": "high"
      }
    ],
    "position": "center",     // Base position
    "staggerDelay": 0.3       // Delay between lines (s)
  },
  
  "hero": {
    "type": "image",          // "image", "svg", "roughSVG", "lottie"
    "asset": "https://...",   // URL or local path
    "position": "centerRight", // 9-point grid position
    "entrance": "fadeIn",     // "fadeIn", "drawOn", "scale"
    "duration": 1.5
  },
  
  "welcome": {
    "text": "Welcome to Knodovia",
    "subtitle": "A place where mindsets define borders"
  }
}
```

---

### Apply3A: Micro Quiz

**Unique fields:**

```json
{
  "template_id": "Apply3AMicroQuiz_V6",
  
  "question": {
    "text": "Which element has 6 protons?",
    "visual": {
      "type": "emoji",
      "value": "⚛️"
    }
  },
  
  "choices": [
    {
      "id": "A",
      "text": "Carbon",
      "isCorrect": true
    },
    {
      "id": "B",
      "text": "Oxygen",
      "isCorrect": false
    },
    {
      "id": "C",
      "text": "Nitrogen",
      "isCorrect": false
    },
    {
      "id": "D",
      "text": "Hydrogen",
      "isCorrect": false
    }
  ],
  
  "timer": {
    "enabled": true,
    "duration": 10,           // Seconds to answer
    "showCountdown": true
  },
  
  "feedback": {
    "correct": "Great job! 🎉",
    "incorrect": "Not quite. The answer is Carbon."
  }
}
```

---

### Reflect4A: Key Takeaways

**Unique fields:**

```json
{
  "template_id": "Reflect4AKeyTakeaways_V6",
  
  "takeaways": [
    {
      "number": 1,
      "text": "Deep learning uses neural networks",
      "icon": "🧠",
      "emphasis": false
    },
    {
      "number": 2,
      "text": "Training requires large datasets",
      "icon": "📊",
      "emphasis": true        // Emphasize this one
    },
    {
      "number": 3,
      "text": "Backpropagation adjusts weights",
      "icon": "🔄",
      "emphasis": false
    }
    // 1-5 takeaways supported
  ],
  
  "layout": {
    "style": "vertical",      // "vertical", "grid"
    "alignment": "left"       // "left", "center"
  }
}
```

---

## 🎨 Tailwind Usage

Templates use Tailwind CSS for consistent styling. Common patterns:

### Box Styling Standards

**Standard card/badge:**
```javascript
className="rounded-full border-4 backdrop-blur-md"
```

**Container:**
```javascript
className="relative flex flex-col items-center justify-center"
```

**Text:**
```javascript
className="font-bold text-center line-clamp-2"
```

### Common Tailwind Classes

**Layout:**
- `flex flex-col` - Vertical flexbox
- `items-center justify-center` - Center content
- `absolute inset-0` - Fill parent
- `relative` - Position context

**Sizing:**
- `w-full h-full` - Fill container
- `min-w-[200px]` - Minimum width
- `max-w-[800px]` - Maximum width

**Spacing:**
- `p-6` - Padding (24px)
- `gap-4` - Gap between flex items (16px)
- `mb-2` - Margin bottom (8px)

**Effects:**
- `rounded-full` - Perfect circle
- `backdrop-blur-md` - Glassmorphic blur
- `border-4` - Thick border
- `opacity-80` - 80% opacity
- `shadow-xl` - Large shadow

**Text:**
- `font-bold` - Bold weight
- `text-center` - Center align
- `line-clamp-2` - Truncate after 2 lines
- `text-lg` - Large text (18px)

**Consistency guidelines:**
- Use Tailwind classes for **structure and layout**
- Use style prop for **dynamic values** (colors, positions from config)
- Avoid inline styles when Tailwind class exists

---

## 🐛 Troubleshooting

### Common Issues

**1. Template not loading**

**Problem:** Preview shows error or blank screen

**Solutions:**
- Verify `template_id` matches exactly (case-sensitive)
- Check console for error messages
- Ensure JSON is valid (use a JSON validator)
- Verify all required fields are present

**2. Text overflowing containers**

**Problem:** Text is cut off or extends beyond boundaries

**Solutions:**
- Reduce font sizes in `fonts` config
- Shorten text content
- Templates auto-cap sizes, but verify config isn't too large
- Check browser console for warnings

**3. Animations not playing**

**Problem:** Elements appear instantly without animation

**Solutions:**
- Verify `beats` timing is logical (title before content, etc.)
- Check that beat times are within video duration
- Ensure `animation` effects are enabled
- Reload preview (click reload button)

**4. Colors not applying**

**Problem:** Template uses default colors instead of config

**Solutions:**
- Check color format is valid hex (`#FF6B35`, not `FF6B35`)
- Ensure colors are in `style_tokens.colors`
- Verify spelling of color keys matches template expectations
- Clear cache and reload

**5. Wrong template rendering**

**Problem:** Different template appears than expected

**Solutions:**
- Verify `template_id` spelling
- Check template is registered in TemplateRouter
- Ensure scene JSON is imported correctly
- Restart dev server

---

### Validation Errors

**Schema validation** ensures your JSON is correct:

```json
// ✅ Valid
{
  "schema_version": "6.0",
  "template_id": "Explain2A_V6",
  "title": { "text": "Title" }
}

// ❌ Invalid: Missing required field
{
  "template_id": "Explain2A_V6"
  // Missing title
}

// ❌ Invalid: Wrong type
{
  "schema_version": 6.0,     // Should be string "6.0"
  "template_id": "Explain2A_V6",
  "title": { "text": "Title" }
}
```

**Check validation errors in browser console** - they'll tell you exactly what's wrong.

---

## 📝 Best Practices

### 1. Start from Examples

Copy and modify existing scenes rather than starting from scratch:

```bash
cp src/scenes/examples/explain2a_example.json src/scenes/my_scene.json
```

### 2. Use Meaningful IDs

```json
// ✅ Good
"scene_id": "explain_photosynthesis_breakdown"

// ❌ Bad
"scene_id": "scene1"
```

### 3. Document Your Scenes

```json
"metadata": {
  "name": "Photosynthesis Breakdown",
  "description": "Explains the 4 stages of photosynthesis using hub-and-spoke layout",
  "notes": "Uses green theme to match plant biology context"
}
```

### 4. Test with Edge Cases

- Very long text
- Very short text
- Maximum number of elements
- Minimum number of elements
- Extreme colors (very light, very dark)

### 5. Keep Consistent Naming

Use consistent key names across your scenes:

```json
// All your scenes use the same color keys
"colors": {
  "bg": "...",
  "primary": "...",
  "text": "..."
}
```

---

## 🔗 Related Documentation

- **[TEMPLATES.md](./TEMPLATES.md)** - Template catalog and creation guide
- **[SDK.md](./SDK.md)** - SDK utilities and API reference
- **[README.md](./README.md)** - Project overview and quick start

---

## 🎉 Ready to Configure

With this guide, you can configure any template for any use case. Remember:

1. **Start simple** - Content first, styling later
2. **Use examples** - Copy working scenes and modify
3. **Test thoroughly** - Edge cases reveal issues
4. **Document well** - Future you will thank you
5. **Iterate fast** - Use live preview for quick feedback

**Happy configuring!** 🚀
