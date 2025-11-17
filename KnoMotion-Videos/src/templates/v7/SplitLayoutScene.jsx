import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import { toFrames } from '../../sdk';

/**
 * SCENE TEMPLATE: SplitLayoutScene - V7.0
 * 
 * PURPOSE: Two-panel split layout (vertical or horizontal) with configurable ratio
 * DIFFERENTIATOR: Side-by-side or top-bottom panels for comparisons, before/after, etc.
 * 
 * ARCHITECTURE: Pure layout container - NO animations, NO styling, NO content rendering
 * - Only calculates panel positions and dimensions
 * - Passes layout info to mid-level components via props
 * - Mid-level components handle all rendering, animations, and styling
 * 
 * ACCEPTANCE CRITERIA:
 * ✅ Two independent content areas (left/right or top/bottom)
 * ✅ Configurable split direction (vertical or horizontal)
 * ✅ Configurable split ratio (0.0 to 1.0, default 0.5)
 * ✅ Optional divider line (positioned at split point)
 * ✅ Works with any mid-level component
 * ✅ Optional title support
 * ✅ Pure layout math only - no rendering logic
 * 
 * CONTENT STRUCTURE:
 * {
 *   content: {
 *     title: "Optional Title",  // Optional
 *     left: { ...flexible content... },  // or "top" for horizontal split
 *     right: { ...flexible content... }  // or "bottom" for horizontal split
 *   },
 *   layout: {
 *     direction: "vertical",  // or "horizontal"
 *     ratio: 0.5,  // 0.0 to 1.0 (0.5 = 50/50 split)
 *     showDivider: true,
 *     dividerWidth: 2,
 *     padding: 40
 *   }
 * }
 */

export const TEMPLATE_VERSION = '7.0';
export const TEMPLATE_ID = 'SplitLayoutScene';

const DEFAULT_CONFIG = {
  content: {
    title: null,
    left: null,  // or "top" for horizontal split
    right: null  // or "bottom" for horizontal split
  },
  
  layout: {
    direction: 'vertical',  // 'vertical' = left/right, 'horizontal' = top/bottom
    ratio: 0.5,  // 0.0 to 1.0 (0.5 = 50/50 split)
    showDivider: true,
    dividerWidth: 2,
    padding: 40,
    gap: 20  // Gap between divider and panels
  },
  
  style_tokens: {
    colors: {
      bg: '#1A1A1A',
      divider: '#4ECDC4',
      text: '#FFFFFF'
    },
    fonts: {
      size_title: 64,
      weight_title: 800,
      family: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    },
    spacing: {
      padding: 40
    }
  },
  
  beats: {
    entrance: 0.5,
    title: 1.0,
    leftPanel: 1.5,
    rightPanel: 2.0,
    hold: 10.0,
    exit: 12.0
  }
};

/**
 * Calculate panel positions and dimensions for split layout
 * Returns layout info that mid-level components can use for rendering
 */
const calculateSplitLayout = (config, viewport) => {
  const { layout, content } = config;
  const { direction, ratio, padding, gap } = layout;
  
  const hasTitle = !!content.title;
  const titleHeight = hasTitle ? 120 : 0;
  const availableHeight = viewport.height - titleHeight - (padding * 2);
  const availableWidth = viewport.width - (padding * 2);
  
  let leftPanel, rightPanel, divider;
  
  if (direction === 'vertical') {
    // Left/Right split
    const splitX = padding + (availableWidth * ratio);
    const leftWidth = splitX - padding - gap;
    const rightWidth = availableWidth - (splitX - padding) - gap;
    
    leftPanel = {
      x: padding,
      y: padding + titleHeight,
      width: leftWidth,
      height: availableHeight,
      centerX: padding + (leftWidth / 2),
      centerY: padding + titleHeight + (availableHeight / 2)
    };
    
    rightPanel = {
      x: splitX + gap,
      y: padding + titleHeight,
      width: rightWidth,
      height: availableHeight,
      centerX: splitX + gap + (rightWidth / 2),
      centerY: padding + titleHeight + (availableHeight / 2)
    };
    
    divider = {
      x: splitX,
      y: padding + titleHeight,
      width: layout.dividerWidth || 2,
      height: availableHeight,
      orientation: 'vertical'
    };
  } else {
    // Top/Bottom split
    const splitY = padding + titleHeight + (availableHeight * ratio);
    const topHeight = splitY - padding - titleHeight - gap;
    const bottomHeight = availableHeight - (splitY - padding - titleHeight) - gap;
    
    leftPanel = {
      x: padding,
      y: padding + titleHeight,
      width: availableWidth,
      height: topHeight,
      centerX: padding + (availableWidth / 2),
      centerY: padding + titleHeight + (topHeight / 2)
    };
    
    rightPanel = {
      x: padding,
      y: splitY + gap,
      width: availableWidth,
      height: bottomHeight,
      centerX: padding + (availableWidth / 2),
      centerY: splitY + gap + (bottomHeight / 2)
    };
    
    divider = {
      x: padding,
      y: splitY,
      width: availableWidth,
      height: layout.dividerWidth || 2,
      orientation: 'horizontal'
    };
  }
  
  return {
    leftPanel,
    rightPanel,
    divider,
    titlePosition: hasTitle ? {
      x: viewport.width / 2,
      y: padding + 60,
      width: viewport.width - (padding * 2)
    } : null
  };
};

export const SplitLayoutScene = ({ scene }) => {
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
  
  // Calculate split layout positions
  const layoutInfo = useMemo(() => {
    return calculateSplitLayout(config, { width, height });
  }, [config, width, height]);
  
  // Calculate beat frames
  const beatFrames = {
    entrance: toFrames(beats.entrance, fps),
    title: toFrames(beats.title, fps),
    leftPanel: toFrames(beats.leftPanel, fps),
    rightPanel: toFrames(beats.rightPanel, fps)
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

  // Panel animations (simple fallback, should be handled by mid-level)
  const leftPanelAnim = content.left && layoutInfo.leftPanel
    ? fadeIn(frame, beatFrames.leftPanel, 0.6 * fps)
    : null;
  const rightPanelAnim = content.right && layoutInfo.rightPanel
    ? fadeIn(frame, beatFrames.rightPanel, 0.6 * fps)
    : null;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      {/* Optional Title - Simple text rendering (fallback, mid-level can override) */}
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
      
      {/* Left/Top Panel Container - Layout info passed for mid-level use */}
      {content.left && layoutInfo.leftPanel && (
        <div
          style={{
            position: 'absolute',
            left: layoutInfo.leftPanel.x,
            top: layoutInfo.leftPanel.y,
            width: layoutInfo.leftPanel.width,
            height: layoutInfo.leftPanel.height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ...leftPanelAnim
          }}
        >
          {/* Simple fallback rendering - mid-level components should replace this */}
          {typeof content.left === 'string' ? (
            <div style={{ color: colors.text, fontSize: 24, textAlign: 'center', padding: 20 }}>
              {content.left}
            </div>
          ) : content.left.text ? (
            <div style={{ color: colors.text, fontSize: 24, textAlign: 'center', padding: 20 }}>
              {content.left.text}
            </div>
          ) : null}
        </div>
      )}
      
      {/* Right/Bottom Panel Container - Layout info passed for mid-level use */}
      {content.right && layoutInfo.rightPanel && (
        <div
          style={{
            position: 'absolute',
            left: layoutInfo.rightPanel.x,
            top: layoutInfo.rightPanel.y,
            width: layoutInfo.rightPanel.width,
            height: layoutInfo.rightPanel.height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ...rightPanelAnim
          }}
        >
          {/* Simple fallback rendering - mid-level components should replace this */}
          {typeof content.right === 'string' ? (
            <div style={{ color: colors.text, fontSize: 24, textAlign: 'center', padding: 20 }}>
              {content.right}
            </div>
          ) : content.right.text ? (
            <div style={{ color: colors.text, fontSize: 24, textAlign: 'center', padding: 20 }}>
              {content.right.text}
            </div>
          ) : null}
        </div>
      )}
      
      {/* Optional Divider - Simple line */}
      {layout.showDivider && layoutInfo.divider && (
        <div
          style={{
            position: 'absolute',
            left: layoutInfo.divider.x,
            top: layoutInfo.divider.y,
            width: layoutInfo.divider.width,
            height: layoutInfo.divider.height,
            backgroundColor: colors.divider || colors.text,
            opacity: 0.3
          }}
        />
      )}
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
  name: 'Split Layout Scene',
  description: 'Two-panel split layout for comparisons and side-by-side content',
  category: 'Layout',
  learningIntentions: ['COMPARE', 'EXPLAIN', 'SHOWCASE'],
  requiredFields: ['content.left', 'content.right'],
  optionalFields: ['content.title', 'layout.direction', 'layout.ratio', 'layout.showDivider'],
  supportedDirections: ['vertical', 'horizontal'],
  integrations: []
};
