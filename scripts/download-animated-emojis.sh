#!/bin/bash
# Download animated emoji video assets from Remotion's example repo
# These are required for @remotion/animated-emoji to work

DEST_DIR="public"
BASE_URL="https://raw.githubusercontent.com/remotion-dev/remotion/main/packages/example/public"

# List of commonly used emojis - add more as needed
EMOJIS=(
  "smile"
  "blush"
  "fire"
  "exploding-head"
  "thinking-face"
  "star-struck"
  "party-popper"
  "thumbs-up"
  "clapping-hands"
  "waving-hand"
  "heart-eyes"
  "joy"
  "loudly-crying"
  "mind-blown"
  "rocket"
  "sparkles"
)

SCALES=("1")  # Can add "0.5" and "2" if needed
FORMATS=("webm" "mp4")

echo "Downloading animated emoji assets to ${DEST_DIR}..."
mkdir -p "${DEST_DIR}"

for emoji in "${EMOJIS[@]}"; do
  for scale in "${SCALES[@]}"; do
    for format in "${FORMATS[@]}"; do
      filename="${emoji}-${scale}x.${format}"
      url="${BASE_URL}/${filename}"
      dest="${DEST_DIR}/${filename}"
      
      if [ -f "$dest" ]; then
        echo "  [skip] ${filename} (already exists)"
      else
        echo "  [download] ${filename}..."
        curl -sL "$url" -o "$dest" 2>/dev/null
        if [ $? -eq 0 ] && [ -s "$dest" ]; then
          echo "  [ok] ${filename}"
        else
          echo "  [fail] ${filename} (may not be available)"
          rm -f "$dest" 2>/dev/null
        fi
      fi
    done
  done
done

echo ""
echo "Done! Assets saved to ${DEST_DIR}/"
echo ""
echo "To use animated emojis in your components:"
echo '  <Icon iconRef="🔥" animated={true} />'
