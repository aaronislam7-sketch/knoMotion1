#!/bin/bash
# Fix Remotion dependency version mismatches and clear Vite cache
# Run this script when encountering "err-aborted-504 (outdated optimize dep)" errors

echo "🔧 Fixing Remotion dependency versions..."

# 1. Update package.json to align all remotion versions
echo "📦 Aligning Remotion package versions to 4.0.373..."
npm install remotion@^4.0.373 @remotion/player@^4.0.373 --save-exact

# 2. Clear Vite cache
echo "🧹 Clearing Vite cache..."
rm -rf node_modules/.vite
rm -rf .vite

# 3. Clear npm cache for remotion packages
echo "🗑️  Clearing npm cache for remotion packages..."
npm cache clean --force

# 4. Reinstall dependencies
echo "📥 Reinstalling dependencies..."
rm -rf node_modules
npm install

# 5. Verify versions
echo "✅ Verifying Remotion versions..."
npm list remotion @remotion/google-fonts @remotion/player 2>&1 | grep -E "(remotion|google-fonts|player)" | head -5

echo ""
echo "✨ Done! Try running 'npm run dev' again."
echo ""
echo "If issues persist, try:"
echo "  1. Delete node_modules and package-lock.json"
echo "  2. Run: npm install"
echo "  3. Run: npm run dev"
