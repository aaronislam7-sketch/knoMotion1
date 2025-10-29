#!/bin/bash

# Remotion Scene Previewer - Setup Verification Script

echo "🔍 Verifying Remotion Scene Previewer setup..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: package.json not found. Please run from /workspace/remotion-scene-previewer/"
  exit 1
fi

echo "✅ package.json found"

# Check for required files
echo ""
echo "📁 Checking file structure..."

files=(
  "src/App.jsx"
  "src/main.jsx"
  "src/templates/WhiteboardTED.jsx"
  "src/templates/TwoColumnCompare.jsx"
  "src/templates/TimelineSteps.jsx"
  "src/scenes/economy_currency.json"
  "src/scenes/laws_compare.json"
  "src/scenes/culture_ritual.json"
  "index.html"
  "vite.config.js"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file - MISSING"
  fi
done

echo ""
echo "📦 Checking for node_modules..."
if [ -d "node_modules" ]; then
  echo "  ✅ Dependencies installed"
else
  echo "  ⚠️  Dependencies not installed yet"
  echo "     Run: npm install"
fi

echo ""
echo "🎯 Next steps:"
echo "  1. Install dependencies: npm install"
echo "  2. Start dev server:     npm run dev"
echo "  3. Open browser:         http://localhost:3000"
echo ""
echo "📚 Documentation:"
echo "  - README.md       - Full project docs"
echo "  - QUICK_START.md  - Quick setup guide"
echo ""
echo "✨ Setup verification complete!"
