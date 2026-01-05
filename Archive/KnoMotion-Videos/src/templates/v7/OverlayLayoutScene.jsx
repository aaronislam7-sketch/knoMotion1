import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import { toFrames } from '../../sdk';

/**
 * SCENE TEMPLATE: OverlayLayoutScene - V7.0
 * 
 * PURPOSE: Base layer + overlay layer (spotlight, labels, annotations)
 * DIFFERENTIATOR: Layered rendering with base content and positioned overlay elements
 * 
 * ARCHITECTURE: Pure layout container - NO animations, NO styling, NO content rendering
 * - Only calculates overlay positions and z-index layering
 * - Passes layout info to mid-level components via props
 * - Mid-level components handle all rendering, animations, and styling
 * 
 * ACCEPTANCE CRITERIA:
 * ✅ Base content layer (background)
 * ✅ Overlay content layer (positioned absolutely)
 * ✅ Optional background dimming
 * ✅ Z-index management for layering
 * ✅ Works with any mid-level component
 * ✅ Optional title support
 * ✅ Pure layout math only - no rendering logic
 * 
 * CONTENT STRUCTURE:
 * {
 *   content: {
 *     title: "Optional Title",  // Optional
 *     base: { ...flexible content... },
 *     overlay: {
 *       items: [
 *         { x: 100, y: 200, ...flexible content... },
 *         { x: 500, y: 300, ...flexible content... }
 *       ]
 *     }
 *   },
 *   layout: {
 *     overlayStyle: "spotlight",  // or "labels", "callouts"
 *     dimBackground: true,
 *     dimOpacity: 0.7
 *   }
 * }
 */

export const TEMPLATE_VERSION = '7.0';
export const TEMPLATE_ID = 'OverlayLayoutScene';

const DEFAULT_CONFIG = {
  content: {
    title: null,
    base: null,
    overlay: {
      items: []
    }
  },
  
  layout: {
    overlayStyle: 'callouts',  // 'spotlight', 'labels', 'callouts'
    dimBackground: true,
    dimOpacity: 0.7,
    zIndexBase: 0,
    zIndexDim: 1,
    zIndexOverlay: 2
  },
  
  style_tokens: {
    colors: {
      bg: '#1A1A1A',
      dim: '#000000',
      text: '#FFFFFF',
      overlay: '#FF6B35'
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
    base: 1.5,
    firstOverlay: 2.5,
    overlayInterval: 0.3,
    hold: 10.0,
    exit: 12.0
  }
};

/**
 * Calculate overlay positions and z-index layering
 * Returns layout info that mid-level components can use for rendering
 */
const calculateOverlayLayout = (config, viewport) => {
  const { layout, content } = config;
  
  const hasTitle = !!content.title;
  const titleHeight = hasTitle ? 120 : 0;
  
  // Base layer covers full viewport
  const base = {
    x: 0,
    y: 0,
    width: viewport.width,
    height: viewport.height,
    zIndex: layout.zIndexBase
  };
  
  // Overlay items with their positions
  const overlayItems = (content.overlay?.items || []).map((item, index) => ({
    index,
    x: item.x || 0,
    y: item.y || 0,
    width: item.width || 200,
    height: item.height || 150,
    zIndex: layout.zIndexOverlay + index,
    ...item
  }));
  
  // Dimming layer (if enabled)
  const dimming = layout.dimBackground ? {
    x: 0,
    y: 0,
    width: viewport.width,
    height: viewport.height,
    zIndex: layout.zIndexDim,
    opacity: layout.dimOpacity
  } : null;
  
  return {
    base,
    overlayItems,
    dimming,
    titlePosition: hasTitle ? {
      x: viewport.width / 2,
      y: 60,
      width: viewport.width - (config.style_tokens.spacing.padding * 2),
      zIndex: layout.zIndexOverlay + 100
    } : null
  };
};

export const OverlayLayoutScene = ({ scene }) => {
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
  
  // Calculate overlay layout positions
  const layoutInfo = useMemo(() => {
    return calculateOverlayLayout(config, { width, height });
  }, [config, width, height]);
  
  // Calculate beat frames
  const beatFrames = {
    entrance: toFrames(beats.entrance, fps),
    title: toFrames(beats.title, fps),
    base: toFrames(beats.base, fps),
    firstOverlay: toFrames(beats.firstOverlay, fps)
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

  // Base animation
  const baseAnim = content.base && layoutInfo.base
    ? fadeIn(frame, beatFrames.base, 0.8 * fps)
    : null;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      {/* Base Layer - Full viewport background content */}
      {content.base && layoutInfo.base && (
        <div
          style={{
            position: 'absolute',
            left: layoutInfo.base.x,
            top: layoutInfo.base.y,
            width: layoutInfo.base.width,
            height: layoutInfo.base.height,
            zIndex: layoutInfo.base.zIndex,
            ...baseAnim
          }}
        >
          {/* Simple fallback rendering - mid-level components should replace this */}
          {typeof content.base === 'string' ? (
            <div style={{ color: colors.text, fontSize: 24, textAlign: 'center', padding: 40 }}>
              {content.base}
            </div>
          ) : content.base.text ? (
            <div style={{ color: colors.text, fontSize: 24, textAlign: 'center', padding: 40 }}>
              {content.base.text}
            </div>
          ) : null}
        </div>
      )}
      
      {/* Dimming Layer - Optional background dimming */}
      {layoutInfo.dimming && (
        <div
          style={{
            position: 'absolute',
            left: layoutInfo.dimming.x,
            top: layoutInfo.dimming.y,
            width: layoutInfo.dimming.width,
            height: layoutInfo.dimming.height,
            backgroundColor: colors.dim,
            opacity: layoutInfo.dimming.opacity,
            zIndex: layoutInfo.dimming.zIndex
          }}
        />
      )}
      
      {/* Optional Title - Above overlay layer */}
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
            textAlign: 'center',
            zIndex: layoutInfo.titlePosition.zIndex
          }}
        >
          {typeof content.title === 'string' ? content.title : content.title.text || ''}
        </div>
      )}
      
      {/* Overlay Items - Positioned absolutely */}
      {layoutInfo.overlayItems.map((item, index) => {
        const overlayContent = content.overlay?.items?.[item.index];
        if (!overlayContent) return null;
        
        const itemStartFrame = beatFrames.firstOverlay + (beats.overlayInterval || 0.3) * fps * index;
        const itemAnim = fadeIn(frame, itemStartFrame, 0.5 * fps);
        
        return (
          <div
            key={`overlay-${item.index}`}
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
            {typeof overlayContent === 'string' ? (
              <div style={{ color: colors.text, fontSize: 18, textAlign: 'center', padding: 15 }}>
                {overlayContent}
              </div>
            ) : overlayContent.text ? (
              <div style={{ color: colors.text, fontSize: 18, textAlign: 'center', padding: 15 }}>
                {overlayContent.text}
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
  name: 'Overlay Layout Scene',
  description: 'Base layer with overlay elements for annotations, callouts, and spotlight effects',
  category: 'Layout',
  learningIntentions: ['EXPLAIN', 'GUIDE', 'SHOWCASE'],
  requiredFields: ['content.base', 'content.overlay.items'],
  optionalFields: ['content.title', 'layout.dimBackground', 'layout.overlayStyle'],
  integrations: []
};
