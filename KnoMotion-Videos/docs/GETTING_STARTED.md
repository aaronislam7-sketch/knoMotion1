# Getting Started with KnoMotion Videos

Welcome! This guide will help you create your first video in under 10 minutes.

---

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Install Dependencies

```bash
npm install
```

This installs:
- Remotion (video rendering)
- React
- rough.js (sketch aesthetic)
- Lottie player
- Vite (dev server)

---

## 🚀 Running the Development Server

```bash
npm run dev
```

The app opens at `http://localhost:5173`

You'll see the **Video Wizard** interface by default.

---

## 🎬 Creating Your First Video

### Using the Video Wizard (Recommended)

The wizard guides you through creating a complete 4-scene video:

#### Step 1: Define Hook (10-15s)
1. The wizard starts on the Hook step
2. Left panel shows scene JSON (default loaded)
3. Right panel shows live preview
4. **Edit the JSON** to customize:
   ```json
   "fill": {
     "texts": {
       "questionPart1": "Your opening question",
       "questionPart2": "that sparks curiosity?"
     }
   }
   ```
5. Click **"Apply Changes"** to update preview
6. Click **"Approve & Continue"** when satisfied

#### Step 2: Define Explain (10-15s)
1. Automatically moves to Explain step
2. Edit JSON for your explanation content
3. Preview → Apply → Approve

#### Step 3: Define Apply (10-15s)
1. Create a quiz or scenario
2. Edit choices, correct answers
3. Preview → Apply → Approve

#### Step 4: Define Reflect (8-12s)
1. Add key takeaways or forward link
2. Final adjustments
3. Preview → Approve

#### Step 5: Final Video! 🎉
1. See all 4 scenes stitched together
2. Total duration shown
3. Play to watch complete video
4. Export when ready!

---

## 🎨 Scene Preview Mode

For editing individual scenes:

1. Click **"Switch to Scene Preview"** (bottom right)
2. Select template from dropdown
3. Edit JSON in left panel
4. Click **"Apply Changes"**
5. Preview updates instantly
6. Click **🔄 Reload Player** if needed

---

## 📝 Understanding Scene JSON

Every scene has this structure:

```json
{
  "schema_version": "5.0",
  "scene_id": "unique_id",
  "template_id": "Hook1AQuestionBurst",
  
  "meta": {
    "title": "Scene Title",
    "tags": ["module:name", "pillar:hook"]
  },
  
  "style_tokens": {
    "mode": "notebook",
    "colors": {
      "accent": "#FF6B35"
    }
  },
  
  "beats": {
    "entrance": 0.6,
    "exit": 15.0
  },
  
  "fill": {
    "texts": { ... },
    "images": { ... }
  }
}
```

### Key Fields:

**`schema_version`** - Always `"5.0"`  
**`template_id`** - Which template to use  
**`beats`** - Timing markers in seconds  
**`fill`** - Your content (text, images, data)

---

## 🎯 Available Templates

### Hook (Grab Attention)
- `Hook1AQuestionBurst` - Provocative question
- `Hook1EAmbientMystery` - Atmospheric mystery

### Explain (Teach Concepts)
- `Explain2AConceptBreakdown` - Break into parts
- `Explain2BAnalogy` - Visual comparison

### Apply (Practice)
- `Apply3AMicroQuiz` - Quick quiz
- `Apply3BScenarioChoice` - Real-world scenario

### Reflect (Consolidate)
- `Reflect4AKeyTakeaways` - Key points summary
- `Reflect4DForwardLink` - Next journey preview

---

## ⚙️ Customizing Scenes

### Change Colors

```json
"style_tokens": {
  "colors": {
    "accent": "#E74C3C",
    "accent2": "#9B59B6",
    "ink": "#1A1A1A"
  }
}
```

### Adjust Timing

```json
"beats": {
  "entrance": 0.6,      // When scene starts
  "titleReveal": 1.2,   // Custom beat
  "emphasis": 2.5,      // Another beat
  "exit": 15.0          // When scene ends
}
```

### Update Content

```json
"fill": {
  "texts": {
    "title": "Your Title Here",
    "body": "Your content here..."
  }
}
```

---

## 🐛 Troubleshooting

### Scene Not Updating?
- Click **"Apply Changes"** after editing JSON
- Check for JSON syntax errors (red error message)
- Click **🔄 Reload Player** button

### Template Not Found?
- Check `template_id` matches exactly:
  - `Hook1AQuestionBurst` (correct)
  - `hook_1a` (incorrect)
- Check spelling and capitalization

### Validation Errors?
- Read error messages in left panel
- Common issues:
  - Missing `template_id`
  - Missing `beats` object
  - Missing `fill` data
  - Invalid JSON syntax

---

## 📚 Next Steps

1. **Explore Examples** - Select "Example Scenes" in dropdown
2. **Read Blueprint v5** - Learn the architecture
3. **Try Different Templates** - Each has unique animations
4. **Export Your Video** - Ready for production!

---

## 💡 Tips

✅ **Start with examples** - Modify existing scenes first  
✅ **Use the wizard** - Easiest way to create complete videos  
✅ **Keep beats simple** - 0.8-1.5s between major changes  
✅ **Test early** - Preview often while editing  
✅ **Read error messages** - They're helpful!

---

**Ready to create amazing educational videos!** 🎬✨

[← Back to README](../README.md) | [Next: Blueprint v5 Spec →](./BLUEPRINT_V5.md)
