/**
 * IconGrid - Mid-Scene Component
 * 
 * Renders grid of icons with entrance animations.
 * Combines Icon elements with grid layout and stagger/cascade animations.
 * All configurable via JSON - pre-built for LLM JSON generation.
 * 
 * @module mid-scenes/IconGrid
 * @category SDK
 * @subcategory Mid-Scenes
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';
import { Icon } from '../elements/atoms/Icon';
import { Text } from '../elements/atoms/Text';
import { ARRANGEMENT_TYPES, calculateItemPositions, positionToCSS } from '../layout/layoutEngine';
import { fadeIn, slideIn, scaleIn, bounceIn } from '../animations/index';
import { toFrames } from '../core/time';
import { KNODE_THEME } from '../theme/knodeTheme';

/**
 * Get animation style based on animation type
 * 
 * @param {string} animationType - Type of animation (fadeIn, slideIn, scaleIn, bounceIn, cascade)
 * @param {number} frame - Current frame
 * @param {number} startFrame - Start frame for animation
 * @param {number} durationFrames - Duration in frames
 * @param {string} direction - Direction for slide animations
 * @param {number} itemIndex - Index of item (for cascade effect)
 * @returns {Object} Style object with opacity and transform
 */
const getAnimationStyle = (animationType, frame, startFrame, durationFrames, direction = 'up', itemIndex = 0) => {
  switch (animationType) {
    case 'fadeIn':
      return fadeIn(frame, startFrame, durationFrames);
    
    case 'slideIn':
      return slideIn(frame, startFrame, durationFrames, direction, 50);
    
    case 'scaleIn':
      return scaleIn(frame, startFrame, durationFrames, 0);
    
    case 'bounceIn':
      return bounceIn(frame, startFrame, durationFrames);
    
    case 'cascade':
      // Cascade effect: diagonal stagger based on row + column
      const cascadeDelay = itemIndex * 3; // Small additional delay per item
      return {
        ...fadeIn(frame, startFrame + cascadeDelay, durationFrames),
        ...slideIn(frame, startFrame + cascadeDelay, durationFrames, 'up', 30),
      };
    
    default:
      return { opacity: 1, transform: 'none' };
  }
};

/**
 * IconGrid Component
 * 
 * @param {Object} props
 * @param {Object} props.config - JSON configuration
 * @param {Array} props.config.icons - Array of icon configurations (required)
 * @param {number} props.config.columns - Number of columns (default: 4)
 * @param {number} props.config.rows - Number of rows (optional, calculated from icons)
 * @param {string} props.config.animation - Entrance animation: 'fadeIn' | 'slideIn' | 'scaleIn' | 'bounceIn' | 'cascade' (default: 'scaleIn')
 * @param {string} props.config.direction - Direction for slide animations: 'up' | 'down' | 'left' | 'right' (default: 'up')
 * @param {number} props.config.staggerDelay - Delay between icons in seconds (default: 0.1)
 * @param {number} props.config.animationDuration - Animation duration per icon in seconds (default: 0.5)
 * @param {number} props.config.iconSize - Icon size: 'sm' | 'md' | 'lg' | 'xl' (default: 'lg')
 * @param {number} props.config.gap - Gap between icons in pixels (default: 40)
 * @param {boolean} props.config.showLabels - Show labels below icons (default: false)
 * @param {Object} props.config.beats - Beat timings
 * @param {number} props.config.beats.start - Start beat in seconds (required)
 * @param {Object} props.config.position - Optional position override
 * @param {Object} props.config.style - Optional style overrides
 */
export const IconGrid = ({ config }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  
  const {
    icons = [],
    columns = 4,
    animation = 'scaleIn',
    direction = 'up',
    staggerDelay = 0.1,
    animationDuration = 0.5,
    iconSize = 'lg',
    gap = 40,
    showLabels = false,
    beats = {},
    position,
    style = {},
  } = config;

  // Validate required fields
  if (!icons || icons.length === 0) {
    console.warn('IconGrid: No icons provided');
    return null;
  }

  const { start = 1.0 } = beats;
  const startFrame = toFrames(start, fps);
  const staggerFrames = toFrames(staggerDelay, fps);
  const durationFrames = toFrames(animationDuration, fps);
  const viewport = { width, height };

  // Icon dimensions based on size
  const iconSizes = {
    sm: 80,
    md: 100,
    lg: 120,
    xl: 150,
  };
  const itemSize = iconSizes[iconSize] || iconSizes.lg;
  const labelHeight = showLabels ? 30 : 0;
  const itemHeight = itemSize + labelHeight;

  // Calculate positions using layout engine (GRID arrangement)
  const layoutConfig = {
    arrangement: ARRANGEMENT_TYPES.GRID,
    viewport,
    columns,
    gap,
    itemWidth: itemSize,
    itemHeight,
    centerGrid: true,
    ...(position && { area: position }),
  };

  const positions = calculateItemPositions(icons, layoutConfig);

  return (
    <AbsoluteFill>
      {positions.map((pos, index) => {
        const icon = icons[index];
        if (!icon || !icon.iconRef) return null;

        // Calculate stagger for this icon
        const iconStartFrame = animation === 'cascade' 
          ? startFrame // Cascade handles delay internally
          : startFrame + index * staggerFrames;

        const animStyle = getAnimationStyle(
          animation,
          frame,
          iconStartFrame,
          durationFrames,
          direction,
          index
        );

        const iconPosition = positionToCSS(pos);

        return (
          <div
            key={index}
            style={{
              ...iconPosition,
              opacity: animStyle.opacity,
              transform: animStyle.transform,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              ...style.iconContainer,
            }}
          >
            {/* Icon */}
            <Icon
              iconRef={icon.iconRef}
              size={iconSize}
              color={icon.color || 'primary'}
              style={{
                marginBottom: showLabels ? 8 : 0,
                ...icon.style,
              }}
            />
            
            {/* Optional Label */}
            {showLabels && icon.label && (
              <Text
                text={icon.label}
                variant="body"
                size="sm"
                weight="normal"
                color="textSoft"
                style={{
                  fontSize: 14,
                  textAlign: 'center',
                  maxWidth: itemSize,
                  ...style.label,
                }}
              />
            )}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export default IconGrid;
