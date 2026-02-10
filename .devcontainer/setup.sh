#!/bin/bash
# =============================================================================
# KnoMotion Codespaces/DevContainer Setup Script
# =============================================================================
# This script runs automatically when the container is created.
# It ensures all dependencies (npm + system) are properly installed.
# =============================================================================

set -e  # Exit on any error

echo "🎬 KnoMotion Setup Starting..."
echo ""

# -----------------------------------------------------------------------------
# 1. Install system dependencies for Remotion rendering
# -----------------------------------------------------------------------------
echo "📦 Installing system dependencies for video rendering..."

sudo apt-get update -qq

# Chrome Headless Shell dependencies (required for Remotion)
# Note: Ubuntu 24.04+ uses t64 suffix for some packages
sudo apt-get install -y --no-install-recommends \
  ffmpeg \
  libatk1.0-0 \
  libatk-bridge2.0-0 \
  libcups2 \
  libxcomposite1 \
  libxdamage1 \
  libxfixes3 \
  libxrandr2 \
  libgbm1 \
  libxkbcommon0 \
  libpango-1.0-0 \
  libcairo2 \
  libnspr4 \
  libnss3 \
  > /dev/null 2>&1

# Handle libasound2 which may have t64 suffix on newer Ubuntu
sudo apt-get install -y --no-install-recommends libasound2 2>/dev/null || \
sudo apt-get install -y --no-install-recommends libasound2t64 2>/dev/null || true

echo "✅ System dependencies installed"

# -----------------------------------------------------------------------------
# 2. Clean install npm dependencies
# -----------------------------------------------------------------------------
echo ""
echo "📦 Installing npm dependencies (clean install)..."

# Remove any stale node_modules to prevent corruption issues
if [ -d "node_modules" ]; then
  echo "   Removing existing node_modules..."
  rm -rf node_modules
fi

if [ -f "package-lock.json" ]; then
  echo "   Removing existing package-lock.json..."
  rm -f package-lock.json
fi

# Fresh install
npm install --silent

echo "✅ npm dependencies installed"

# -----------------------------------------------------------------------------
# 3. Verify installation
# -----------------------------------------------------------------------------
echo ""
echo "🔍 Verifying installation..."

# Check ffmpeg
if command -v ffmpeg &> /dev/null; then
  echo "   ✅ ffmpeg: $(ffmpeg -version 2>&1 | head -1 | cut -d' ' -f3)"
else
  echo "   ❌ ffmpeg not found"
fi

# Check remotion CLI
if [ -f "node_modules/.bin/remotion" ]; then
  echo "   ✅ Remotion CLI installed"
else
  echo "   ❌ Remotion CLI not found"
fi

# Check vite
if [ -f "node_modules/.bin/vite" ]; then
  echo "   ✅ Vite installed"
else
  echo "   ❌ Vite not found"
fi

# -----------------------------------------------------------------------------
# Done!
# -----------------------------------------------------------------------------
echo ""
echo "=============================================="
echo "🎉 KnoMotion setup complete!"
echo "=============================================="
echo ""
echo "Quick start commands:"
echo "  npm run dev:video-builder      - Open Video Builder (/?view=builder)"
echo "  npm run dev:video-preview      - Open Video Preview (/?view=preview)"
echo "  npm run dev:slides-preview     - Open Slides Preview (/?view=slides)"
echo "  npm run dev:slide-builder      - Open Slide Builder (/?view=slide-builder)"
echo "  npm run dev:knoslides-standalone - Run standalone KnoSlides app on :4173"
echo "  npm run studio                 - Open Remotion Studio"
echo "  npm run render                 - Render a video (see README for options)"
echo ""
echo "Example render:"
echo "  npx remotion render KnoMotion-Videos/src/remotion/index.ts TikTokBrainLies out/brain-lies.mp4"
echo ""
