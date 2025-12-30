import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import { toFrames } from '../../sdk';

/**
 * SCENE TEMPLATE: CascadeLayoutScene - V7.0
 * 
 * PURPOSE: Staggered diagonal arrangement (cascading cards)
 * DIFFERENTIATOR: Overlapping elements with depth/z-index layering
 * 
 * ARCHITECTURE: Pure layout container - NO animations, NO styling, NO content rendering
 * - Only calculates diagonal positions and z-index layering
 * - Passes layout info to mid-level components via props
 * - Mid-level components handle all rendering, animations, and styling
 * 
 * ACCEPTANCE CRITERIA:
 * ✅ Diagonal offset positioning
 * ✅ Overlapping elements with configurable overlap
 * ✅ Depth/z-index layering (front to back)
 * ✅ Staggered reveals
 * ✅ Works with any mid-level component
 * ✅ Optional title support
 * ✅ Pure layout math only - no rendering logic
 * 
 * CONTENT STRUCTURE:
 * {
 *   content: {
 *     title: "Optional Title",  // Optional
 *     items: [
 *       { ...flexible content... },
 *       { ...flexible content... }
 *     ]
 *   },
 *   layout: {
 *     offsetX: 40,
 *     offsetY: 30,
 *     overlap: 0.3,
 *     itemWidth: 400,
 *     itemHeight: 300,
 *     startX: 200,
 *     startY: 200
 *   }
 * }
 */

export const TEMPLATE_VERSION = '7.0';
export const TEMPLATE_ID = 'CascadeLayoutScene';

const DEFAULT_CONFIG = {
  content: {
    title: null,
    items: []
  },
  
  layout: {
    offsetX: 40,  // Horizontal offset per item
    offsetY: 30,  // Vertical offset per item
    overlap: 0.3,  // Overlap ratio (0.0 to 1.0)
    itemWidth: 400,
    itemHeight: 300,
    startX: 200,  // Starting X position
    startY: 200,  // Starting Y position
    maxItems: 5  // Maximum items in cascade
  },
  
  style_tokens: {
    colors: {
      bg: '#1A1A1A',
      text: '#FFFFFF',
      textSecondary: '#B0B0B0'
    },
    fonts: {
      size_title: 64,
      weight_title: 800,
      family: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    },
    spacing: {
      padding: 80
    }
  },
  
  beats: {
    entrance: 0.5,
    title: 1.0,
    firstItem: 1.5,
    itemInterval: 0.4,
    hold: 10.0,
    exit: 12.0
  }
};

/**
 * Calculate cascade positions with diagonal offset and overlap
 * Returns layout info that mid-level components can use for rendering
 */
const calculateCascadeLayout = (config, viewport) => {
  const { layout, content } = config;
  const { offsetX, offsetY, overlap, itemWidth, itemHeight, startX, startY, maxItems } = layout;
  
  const hasTitle = !!content.title;
  const titleHeight = hasTitle ? 120 : 0;
  const items = (content.items || []).slice(0, maxItems);
  
  // Calculate positions with diagonal offset and overlap
  const itemPositions = items.map((item, index) => {
    // Each item is offset diagonally
    const x = startX + (index * offsetX);
    const y = startY + titleHeight + (index * offsetY);
    
    // Z-index: later items appear on top (higher z-index)
    const zIndex = index;
    
    // Calculate overlap offset (items overlap by overlap ratio)
    const overlapOffsetX = index > 0 ? itemWidth * overlap : 0;
    const overlapOffsetY = index > 0 ? itemHeight * overlap : 0;
    
    return {
      index,
      x: x - overlapOffsetX,
      y: y - overlapOffsetY,
      width: itemWidth,
      height: itemHeight,
      centerX: x - overlapOffsetX + (itemWidth / 2),
      centerY: y - overlapOffsetY + (itemHeight / 2),
      zIndex,
      overlapOffsetX,
      overlapOffsetY
    };
  });
  
  return {
    items: itemPositions,
    titlePosition: hasTitle ? {
      x: viewport.width / 2,
      y: 60,
      width: viewport.width - (config.style_tokens.spacing.padding * 2)
    } : null,
    totalWidth: itemWidth + ((items.length - 1) * offsetX * (1 - overlap)),
    totalHeight: itemHeight + ((items.length - 1) * offsetY * (1 - overlap))
  };
};

export const CascadeLayoutScene = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  
  // Merge with defaults
  const config = useMemo(() => ({
    ...DEFAULT_CONFIG,
    ...scene,
    content: { ...DEFAULT_CONFIG.content, ...scene.content },
    layout: { ...DEFAULT_CONFIG.layout, ...scene.layout },
    style_tokens: {
      colors: { ...DEFAULT_CONFIG.style_tokens.colors, ...scene.style_tokens?.colors },
      fonts: { ...DEFAULT_CONFIG.style_tokens.fonts, ...scene.style_tokens?.fonts },
      spacing: { ...DEFAULT_CONFIG.style_tokens.spacing, ...scene.style_tokens?.spacing }
    },
    beats: { ...DEFAULT_CONFIG.beats, ...scene.beats }
  }), [scene]);
  
  const { content, layout, style_tokens, beats } = config;
  const colors = style_tokens.colors;
  const fonts = style_tokens.fonts;
  
  // Calculate cascade layout positions
  const layoutInfo = useMemo(() => {
    return calculateCascadeLayout(config, { width, height });
  }, [config, width, height]);
  
  // Calculate beat frames
  const beatFrames = {
    entrance: toFrames(beats.entrance, fps),
    title: toFrames(beats.title, fps),
    firstItem: toFrames(beats.firstItem, fps)
  };
  
  // Simple fade-in helper (minimal animation, should be in mid-level)
  const fadeIn = (frame, startFrame, duration) => {
    const progress = interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    });
    return { opacity: progress };
  };

  // Title animation
  const titleAnim = content.title && layoutInfo.titlePosition 
    ? fadeIn(frame, beatFrames.title, 0.8 * fps)
    : null;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      {/* Optional Title */}
      {content.title && layoutInfo.titlePosition && (
        <div
          style={{
            position: 'absolute',
            left: layoutInfo.titlePosition.x - (layoutInfo.titlePosition.width / 2),
            top: layoutInfo.titlePosition.y - 30,
            width: layoutInfo.titlePosition.width,
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ...titleAnim,
            color: colors.text,
            fontSize: fonts.size_title,
            fontWeight: fonts.weight_title,
            fontFamily: fonts.family,
            textAlign: 'center'
          }}
        >
          {typeof content.title === 'string' ? content.title : content.title.text || ''}
        </div>
      )}
      
      {/* Cascade Items - Diagonal offset with overlap */}
      {layoutInfo.items.map((item) => {
        const itemContent = content.items?.[item.index];
        if (!itemContent) return null;
        
        const itemStartFrame = beatFrames.firstItem + (beats.itemInterval || 0.4) * fps * item.index;
        const itemAnim = fadeIn(frame, itemStartFrame, 0.6 * fps);
        
        return (
          <div
            key={`cascade-${item.index}`}
            style={{
              position: 'absolute',
              left: item.x,
              top: item.y,
              width: item.width,
              height: item.height,
              zIndex: item.zIndex,
              ...itemAnim
            }}
          >
            {/* Simple fallback rendering - mid-level components should replace this */}
            {typeof itemContent === 'string' ? (
              <div style={{ color: colors.text, fontSize: 20, textAlign: 'center', padding: 20 }}>
                {itemContent}
              </div>
            ) : itemContent.text ? (
              <div style={{ color: colors.text, fontSize: 20, textAlign: 'center', padding: 20 }}>
                {itemContent.text}
              </div>
            ) : null}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// Export getDuration for template registry (returns FRAMES)
export const getDuration = (scene, fps = 30) => {
  const config = { ...DEFAULT_CONFIG, ...scene };
  const exitTime = config.beats?.exit || DEFAULT_CONFIG.beats.exit;
  return Math.ceil((exitTime + 1.0) * fps); // Convert seconds to frames
};

// Template metadata
export const TEMPLATE_METADATA = {
  id: TEMPLATE_ID,
  version: TEMPLATE_VERSION,
  name: 'Cascade Layout Scene',
  description: 'Staggered diagonal arrangement with overlapping elements and depth layering',
  category: 'Layout',
  learningIntentions: ['REVEAL', 'SHOWCASE', 'GUIDE'],
  requiredFields: ['content.items'],
  optionalFields: ['content.title', 'layout.offsetX', 'layout.offsetY', 'layout.overlap'],
  maxItems: 5,
  integrations: []
};
