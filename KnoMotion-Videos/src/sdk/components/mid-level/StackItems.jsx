import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { getCardEntrance } from '../../index';

/**
 * MID-LEVEL COMPONENT: StackItems - V7.0
 * 
 * PURPOSE: Sequential stack items with animations, styling, and numbering
 * 
 * ACCEPTANCE CRITERIA:
 * ✅ Accepts items[] with positions from scene-shell
 * ✅ Handles all animations (fadeIn, slideIn, scaleIn, cardEntrance)
 * ✅ Renders Permanent Marker numbered badges
 * ✅ Supports vertical/horizontal directions
 * ✅ Uses theme/style tokens
 * ✅ Domain-agnostic (works with any item content)
 * ✅ Reusable across StackLayoutScene, GridLayoutScene, etc.
 * 
 * USAGE:
 * <StackItems
 *   items={[...]}
 *   positions={[{ x, y }, ...]}  // From template
 *   layout={{ direction: "vertical", itemWidth: 700, itemHeight: 120 }}
 *   style={{ colors: {...}, fonts: {...}, spacing: {...} }}
 *   animations={{ entrance: "slideIn", duration: 0.6, stagger: { delay: 0.3 } }}
 *   effects={{ itemGlass: { enabled: false }, showNumbers: true }}
 *   startFrame={60}
 *   fps={30}
 * />
 */

export const StackItems = ({
  items = [],
  positions = [],  // Positions from template
  layout = {},
  style = {},
  animations = {},
  effects = {},
  startFrame = 0
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Default values
  const {
    direction = 'vertical',
    itemWidth = 700,
    itemHeight = 120
  } = layout;
  
  const {
    colors = {
      bg: '#1A1A1A',
      primary: '#FF6B35',
      secondary: '#4ECDC4',
      text: '#FFFFFF',
      textSecondary: '#B0B0B0',
      cardBg: '#2A2A2A',
      accent: '#FFD93D'
    },
    fonts = {
      size_title: 64,
      size_text: 28,
      size_description: 18,
      weight_title: 800,
      weight_text: 700,
      weight_body: 400,
      family: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    },
    spacing = {
      padding: 80,
      itemPadding: 24
    }
  } = style;
  
  const {
    entrance = 'slideIn',
    duration = 0.6,
    stagger = { enabled: true, delay: 0.3 }
  } = animations;
  
  const {
    itemGlass = { enabled: false, glowOpacity: 0.15, borderOpacity: 0.4 },
    showNumbers = true
  } = effects;
  
  // Animation helpers
  const fadeIn = (frame, startFrame, duration) => {
    const progress = interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    });
    return { opacity: progress };
  };
  
  const slideIn = (frame, startFrame, duration, direction = 'up', distance = 50) => {
    const progress = interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    });
    const translations = {
      left: `translateX(${(1 - progress) * distance}px)`,
      right: `translateX(${(1 - progress) * -distance}px)`,
      up: `translateY(${(1 - progress) * distance}px)`,
      down: `translateY(${(1 - progress) * -distance}px)`
    };
    return { opacity: progress, transform: translations[direction] || translations.up };
  };
  
  const scaleIn = (frame, startFrame, duration, fromScale = 0.7) => {
    const progress = interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    });
    return { opacity: progress, transform: `scale(${fromScale + (1 - fromScale) * progress})` };
  };
  
  // Render individual stack item
  const renderItem = (item, index) => {
    // Get position from template or calculate fallback
    const position = positions[index] || { x: 0, y: 0 };
    
    // Calculate staggered animation
    const staggerDelay = stagger.enabled ? stagger.delay * fps * index : 0;
    const itemStartFrame = startFrame + staggerDelay;
    const animDuration = duration * fps;
    
    // Animation style
    let animStyle = {};
    const slideDir = direction === 'vertical' ? 'up' : 'left';
    
    switch (entrance) {
      case 'cardEntrance':
        animStyle = getCardEntrance(frame, {
          startFrame: itemStartFrame,
          duration,
          direction: slideDir,
          distance: 50,
          withGlow: true,
          glowColor: `${colors.primary}40`
        }, fps);
        break;
      case 'slideIn':
        animStyle = slideIn(frame, itemStartFrame, animDuration, slideDir, 60);
        break;
      case 'scaleIn':
        animStyle = scaleIn(frame, itemStartFrame, animDuration, 0.7);
        break;
      default:
        animStyle = fadeIn(frame, itemStartFrame, animDuration);
    }
    
    const itemNumber = index + 1;
    
    return (
      <div
        key={index}
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          width: itemWidth,
          height: itemHeight,
          ...animStyle,
          backgroundColor: itemGlass.enabled ? `${colors.primary}12` : 'transparent',
          border: itemGlass.enabled ? `2px solid ${colors.primary}20` : 'none',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          padding: spacing.itemPadding,
          gap: 16
        }}
      >
        {/* Step number using Permanent Marker font */}
        {showNumbers && (
          <div
            style={{
              minWidth: 70,
              height: 70,
              borderRadius: '50%',
              backgroundColor: colors.primary,
              border: `3px solid ${colors.primary}`,
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 38,
              fontWeight: 400,
              fontFamily: '"Permanent Marker", cursive',
              flexShrink: 0,
              boxShadow: `0 4px 12px ${colors.primary}40`
            }}
          >
            {itemNumber}
          </div>
        )}
        
        {/* Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div
            style={{
              color: colors.text,
              fontSize: Math.min(fonts.size_text, 28),
              fontWeight: fonts.weight_text,
              fontFamily: fonts.family,
              lineHeight: 1.4
            }}
          >
            {item.text || item.label}
          </div>
          {(item.description || item.subtitle) && (
            <div
              style={{
                color: colors.textSecondary || `${colors.text}90`,
                fontSize: Math.min(fonts.size_description, 16),
                fontWeight: fonts.weight_body,
                fontFamily: fonts.family,
                lineHeight: 1.4
              }}
            >
              {item.description || item.subtitle}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {items.map((item, index) => renderItem(item, index))}
    </div>
  );
};

// Helper function to validate StackItems config
export const validateStackItemsConfig = (config) => {
  const errors = [];
  const warnings = [];
  
  if (!config.items || config.items.length === 0) {
    errors.push('StackItems requires at least one item');
  }
  
  if (config.items && config.items.length > 10) {
    warnings.push('StackItems with more than 10 items may appear cluttered');
  }
  
  if (config.positions && config.positions.length !== config.items.length) {
    warnings.push('Positions array length should match items array length');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
};

export default StackItems;
