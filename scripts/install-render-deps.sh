#!/bin/bash
# =============================================================================
# Install Remotion Rendering Dependencies
# =============================================================================
# Run this script to install system dependencies required for video rendering.
# This is automatically run in Codespaces, but may be needed for local dev.
#
# Usage: ./scripts/install-render-deps.sh
# =============================================================================

set -e

echo "🎬 Installing Remotion rendering dependencies..."
echo ""

# Detect OS
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux (Ubuntu/Debian)
    echo "📦 Detected Linux - installing via apt..."
    
    sudo apt-get update -qq
    
    # FFmpeg for video encoding
    sudo apt-get install -y ffmpeg
    
    # Chrome Headless Shell dependencies
    # Note: Package names may have 't64' suffix on newer Ubuntu versions
    sudo apt-get install -y \
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
        libasound2 \
        libnspr4 \
        libnss3 \
        2>/dev/null || \
    sudo apt-get install -y \
        libatk1.0-0t64 \
        libatk-bridge2.0-0t64 \
        libcups2t64 \
        libxcomposite1 \
        libxdamage1 \
        libxfixes3 \
        libxrandr2 \
        libgbm1 \
        libxkbcommon0 \
        libpango-1.0-0 \
        libcairo2 \
        libasound2t64 \
        libnspr4 \
        libnss3
        
    echo "✅ Linux dependencies installed"
    
elif [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    echo "📦 Detected macOS - installing via Homebrew..."
    
    if ! command -v brew &> /dev/null; then
        echo "❌ Homebrew not found. Please install it first:"
        echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
        exit 1
    fi
    
    brew install ffmpeg
    
    echo "✅ macOS dependencies installed"
    echo "   Note: Chrome dependencies are typically bundled on macOS"
    
else
    echo "❌ Unsupported OS: $OSTYPE"
    echo "   Please install ffmpeg manually and ensure Chrome can run."
    exit 1
fi

# Verify ffmpeg installation
echo ""
echo "🔍 Verifying installation..."
if command -v ffmpeg &> /dev/null; then
    echo "   ✅ ffmpeg: $(ffmpeg -version 2>&1 | head -1)"
else
    echo "   ❌ ffmpeg not found - video rendering will fail"
    exit 1
fi

echo ""
echo "=============================================="
echo "🎉 Rendering dependencies installed!"
echo "=============================================="
echo ""
echo "You can now render videos with:"
echo "  npx remotion render KnoMotion-Videos/src/remotion/index.ts <CompositionId> out/<filename>.mp4"
echo ""
