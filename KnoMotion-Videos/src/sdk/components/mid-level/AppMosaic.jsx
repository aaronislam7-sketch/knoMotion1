import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { toFrames, GlassmorphicPane, getCardEntrance, getScaleEmphasis } from '../../index';

/**
 * MID-LEVEL COMPONENT: AppMosaic - V7.0
 * 
 * PURPOSE: Grid-based app/feature showcase with hover/focus states
 * 
 * ACCEPTANCE CRITERIA:
 * ✅ Accepts items[] with label, optional icon, optional description
 * ✅ Lays out items in grid based on columns, gap
 * ✅ Supports staggered reveal animations
 * ✅ Optional focus/zoom-on-item behaviors
 * ✅ Uses theme/style tokens
 * ✅ Domain-agnostic (not assuming "apps")
 * ✅ Can be used in multiple scene types
 * ✅ Handles 3-12 items gracefully
 * 
 * USAGE:
 * <AppMosaic
 *   items={[...]}
 *   layout={{ columns: 3, gap: 40, itemSize: 240 }}
 *   style={{ colors: {...}, fonts: {...} }}
 *   animations={{ entrance: "cardEntrance", stagger: { delay: 0.15 } }}
 *   effects={{ glass: true, focusZoom: false }}
 *   startFrame={60}
 *   fps={30}
 * />
 */

export const AppMosaic = ({
  items = [],
  positions = [],  // Accept positions from template
  layout = {},
  style = {},
  animations = {},
  effects = {},
  startFrame = 0,
  viewport = { width: 1920, height: 1080 }
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Default values
  const {
    columns = 3,
    gap = 40,
    itemSize = 240,
    centerGrid = true
  } = layout;
  
  const {
    colors = {
      bg: '#1A1A1A',
      primary: '#FF6B35',
      text: '#FFFFFF',
      textSecondary: '#B0B0B0'
    },
    fonts = {
      size_label: 24,
      size_description: 14,
      weight_label: 700,
      weight_body: 400,
      family: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    }
  } = style;
  
  const {
    entrance = 'cardEntrance',
    duration = 0.6,
    stagger = { enabled: true, delay: 0.15 }
  } = animations;
  
  const {
    glass = true,
    glowOpacity = 0.15,
    borderOpacity = 0.4,
    focusZoom = false,
    focusIndex = null
  } = effects;
  
  // Use positions from template if provided, otherwise calculate
  const useTemplatePositions = positions && positions.length === items.length;
  
  // Render individual item
  const renderItem = (item, index) => {
    // Use position from template or calculate
    let x, y;
    if (useTemplatePositions) {
      x = positions[index].x - itemSize / 2;
      y = positions[index].y - itemSize / 2;
    } else {
      const rows = Math.ceil(items.length / columns);
      const gridWidth = (columns * itemSize) + ((columns - 1) * gap);
      const gridHeight = (rows * itemSize) + ((rows - 1) * gap);
      const startX = centerGrid ? (viewport.width - gridWidth) / 2 : 100;
      const startY = centerGrid ? (viewport.height - gridHeight) / 2 : 100;
      const row = Math.floor(index / columns);
      const col = index % columns;
      x = startX + (col * (itemSize + gap));
      y = startY + (row * (itemSize + gap));
    }
    
    // Calculate staggered animation
    const staggerDelay = stagger.enabled ? stagger.delay * fps * index : 0;
    const itemStartFrame = startFrame + staggerDelay;
    
    // Animation style
    let animStyle = {};
    const animDuration = duration * fps;
    
    switch (entrance) {
      case 'cardEntrance':
        animStyle = getCardEntrance(frame, {
          startFrame: itemStartFrame,
          duration,
          direction: 'up',
          distance: 40,
          withGlow: true,
          glowColor: `${item.color || colors.primary}40`
        }, fps);
        break;
      case 'fadeIn':
        const fadeProgress = interpolate(
          frame,
          [itemStartFrame, itemStartFrame + animDuration],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );
        animStyle = { opacity: fadeProgress };
        break;
      case 'scaleIn':
        const scaleProgress = interpolate(
          frame,
          [itemStartFrame, itemStartFrame + animDuration],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );
        animStyle = {
          opacity: scaleProgress,
          transform: `scale(${0.7 + (0.3 * scaleProgress)})`
        };
        break;
      default:
        animStyle = { opacity: 1 };
    }
    
    // Focus zoom effect
    const isFocused = focusZoom && focusIndex === index;
    const focusScale = isFocused ? 1.15 : 1;
    
    const itemColor = item.color || colors.primary;

    return (
      <div
        key={index}
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: itemSize,
          height: itemSize,
          ...animStyle,
          transform: `${animStyle.transform || ''} scale(${focusScale})`.trim(),
          transition: focusZoom ? 'transform 0.3s ease' : 'none',
          zIndex: isFocused ? 10 : 1
        }}
      >
        {glass ? (
          <GlassmorphicPane
            innerRadius={20}
            glowOpacity={glowOpacity}
            borderOpacity={borderOpacity}
            backgroundColor={`${itemColor}15`}
            style={{
              width: '100%',
              height: '100%',
              border: `3px solid ${itemColor}40`,
              borderRadius: 20,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
              gap: 12
            }}
          >
            {item.icon && (
              <div style={{ fontSize: 48, lineHeight: 1 }}>
                {item.icon}
              </div>
            )}
            <div
              style={{
                color: colors.text,
                fontSize: Math.min(fonts.size_label, 28),
                fontWeight: fonts.weight_label,
                fontFamily: fonts.family,
                textAlign: 'center',
                lineHeight: 1.2,
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}
            >
              {item.label}
            </div>
            {item.description && (
              <div
                style={{
                  color: colors.textSecondary,
                  fontSize: Math.min(fonts.size_description, 16),
                  fontWeight: fonts.weight_body,
                  fontFamily: fonts.family,
                  textAlign: 'center',
                  lineHeight: 1.3,
                  maxWidth: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical'
                }}
              >
                {item.description}
              </div>
            )}
          </GlassmorphicPane>
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: `${itemColor}20`,
              border: `3px solid ${itemColor}`,
              borderRadius: 20,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
              gap: 12
            }}
          >
            {item.icon && (
              <div style={{ fontSize: 48, lineHeight: 1 }}>
                {item.icon}
              </div>
            )}
            <div
              style={{
                color: colors.text,
                fontSize: fonts.size_label,
                fontWeight: fonts.weight_label,
                fontFamily: fonts.family,
                textAlign: 'center'
              }}
            >
              {item.label}
            </div>
            {item.description && (
              <div
                style={{
                  color: colors.textSecondary,
                  fontSize: fonts.size_description,
                  fontWeight: fonts.weight_body,
                  fontFamily: fonts.family,
                  textAlign: 'center'
                }}
              >
                {item.description}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {items.map((item, index) => renderItem(item, index))}
    </div>
  );
};

// Helper function to calculate AppMosaic layout metrics
export const calculateAppMosaicLayout = (itemCount, columns, itemSize, gap, viewport) => {
  const rows = Math.ceil(itemCount / columns);
  const gridWidth = (columns * itemSize) + ((columns - 1) * gap);
  const gridHeight = (rows * itemSize) + ((rows - 1) * gap);
  
  return {
    rows,
    columns,
    gridWidth,
    gridHeight,
    centerX: (viewport.width - gridWidth) / 2,
    centerY: (viewport.height - gridHeight) / 2
  };
};

// Helper function to validate AppMosaic config
export const validateAppMosaicConfig = (config) => {
  const errors = [];
  const warnings = [];
  
  if (!config.items || config.items.length === 0) {
    errors.push('AppMosaic requires at least one item');
  }
  
  if (config.items && config.items.length > 12) {
    warnings.push('AppMosaic with more than 12 items may appear cluttered');
  }
  
  if (config.layout?.columns && config.layout.columns > 4) {
    warnings.push('More than 4 columns may result in items being too small');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
};

export default AppMosaic;
