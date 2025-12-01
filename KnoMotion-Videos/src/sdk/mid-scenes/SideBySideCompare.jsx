/**
 * SideBySideCompare - Mid-Scene Component
 * 
 * Renders left vs right comparison blocks with text, icons, or mixed content.
 * Features slide/fade animations with support for "vs" divider styling.
 * All configurable via JSON - pre-built for LLM JSON generation.
 * 
 * @module mid-scenes/SideBySideCompare
 * @category SDK
 * @subcategory Mid-Scenes
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, spring } from 'remotion';
import { Text } from '../elements/atoms/Text';
import { fadeIn, slideIn, scaleIn, bounceIn } from '../animations/index';
import { toFrames } from '../core/time';
import { KNODE_THEME } from '../theme/knodeTheme';

/**
 * Get animation style for comparison sides
 */
const getSideAnimationStyle = (animationType, frame, startFrame, durationFrames, fps, side = 'left') => {
  const direction = side === 'left' ? 'left' : 'right';
  
  switch (animationType) {
    case 'slide':
    case 'slideIn':
      return slideIn(frame, startFrame, durationFrames, direction, 80);
    
    case 'scale':
    case 'scaleIn':
      return scaleIn(frame, startFrame, durationFrames, 0.7);
    
    case 'bounce':
    case 'bounceIn':
      return bounceIn(frame, startFrame, durationFrames);
    
    case 'reveal': {
      const progress = spring({
        frame: Math.max(0, frame - startFrame),
        fps,
        config: { damping: 15, mass: 1, stiffness: 120 },
      });
      const offsetX = side === 'left' ? -60 : 60;
      return {
        opacity: progress,
        transform: `translateX(${(1 - progress) * offsetX}px) scale(${0.9 + progress * 0.1})`,
      };
    }
    
    case 'fade':
    case 'fadeIn':
    default:
      return fadeIn(frame, startFrame, durationFrames);
  }
};

/**
 * Divider animation
 */
const getDividerAnimationStyle = (frame, startFrame, durationFrames, fps) => {
  const progress = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: { damping: 12, mass: 1, stiffness: 150 },
  });
  
  return {
    opacity: progress,
    transform: `scaleY(${progress})`,
  };
};

/**
 * Comparison Side Component
 */
const ComparisonSide = ({
  side,
  config,
  slotWidth,
  slotHeight,
  animStyle,
  resolveColor,
  baseFontSize,
  style = {},
}) => {
  const {
    title,
    subtitle,
    icon,
    items = [],
    color,
    backgroundColor,
    alignment = 'center',
  } = config;

  const sideColor = resolveColor(color);
  const sideBgColor = resolveColor(backgroundColor, 'transparent');
  const isLeft = side === 'left';

  return (
    <div
      style={{
        position: 'absolute',
        [isLeft ? 'left' : 'right']: 0,
        top: 0,
        width: '48%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: alignment === 'center' ? 'center' : isLeft ? 'flex-end' : 'flex-start',
        justifyContent: 'center',
        padding: '5%',
        boxSizing: 'border-box',
        opacity: animStyle.opacity,
        ...style.sideWrapper,
      }}
    >
      <div
        style={{
          transform: animStyle.transform,
          display: 'flex',
          flexDirection: 'column',
          alignItems: alignment === 'center' ? 'center' : isLeft ? 'flex-end' : 'flex-start',
          gap: baseFontSize * 0.6,
          padding: baseFontSize,
          backgroundColor: sideBgColor !== 'transparent' ? sideBgColor : undefined,
          borderRadius: sideBgColor !== 'transparent' ? 16 : 0,
          maxWidth: '100%',
          ...style.sideContent,
        }}
      >
        {/* Icon */}
        {icon && (
          <div
            style={{
              fontSize: baseFontSize * 2.5,
              lineHeight: 1,
              marginBottom: baseFontSize * 0.3,
              ...style.icon,
            }}
          >
            {icon}
          </div>
        )}

        {/* Title */}
        {title && (
          <Text
            text={title}
            variant="title"
            size="xl"
            weight={700}
            color="textMain"
            style={{
              fontSize: baseFontSize * 1.4,
              color: sideColor || KNODE_THEME.colors.textMain,
              textAlign: alignment,
              ...style.title,
            }}
          />
        )}

        {/* Subtitle */}
        {subtitle && (
          <Text
            text={subtitle}
            variant="body"
            size="md"
            weight={400}
            color="textSoft"
            style={{
              fontSize: baseFontSize * 0.85,
              textAlign: alignment,
              maxWidth: '90%',
              ...style.subtitle,
            }}
          />
        )}

        {/* Items list */}
        {items.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: baseFontSize * 0.4,
              alignItems: alignment === 'center' ? 'center' : isLeft ? 'flex-end' : 'flex-start',
              marginTop: baseFontSize * 0.5,
              ...style.itemsList,
            }}
          >
            {items.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: baseFontSize * 0.4,
                  flexDirection: isLeft && alignment !== 'center' ? 'row-reverse' : 'row',
                  ...style.item,
                }}
              >
                {item.icon && (
                  <span style={{ fontSize: baseFontSize * 0.9 }}>
                    {item.icon}
                  </span>
                )}
                <Text
                  text={typeof item === 'string' ? item : item.text}
                  variant="body"
                  size="sm"
                  weight={500}
                  color="textMain"
                  style={{
                    fontSize: baseFontSize * 0.75,
                    textAlign: alignment,
                    ...style.itemText,
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * VS Divider Component
 */
const VsDivider = ({
  type,
  label,
  color,
  animStyle,
  slotHeight,
  baseFontSize,
  style = {},
}) => {
  if (type === 'none') return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: 0,
        width: type === 'vs' ? baseFontSize * 3 : 2,
        height: '100%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: animStyle.opacity,
        ...style.dividerWrapper,
      }}
    >
      {type === 'line' && (
        <div
          style={{
            width: 2,
            height: '60%',
            backgroundColor: color,
            opacity: 0.3,
            transform: animStyle.transform,
            transformOrigin: 'center center',
            ...style.dividerLine,
          }}
        />
      )}
      
      {type === 'dashed' && (
        <div
          style={{
            width: 2,
            height: '60%',
            backgroundImage: `repeating-linear-gradient(to bottom, ${color} 0, ${color} 8px, transparent 8px, transparent 16px)`,
            opacity: 0.4,
            transform: animStyle.transform,
            transformOrigin: 'center center',
            ...style.dividerLine,
          }}
        />
      )}
      
      {type === 'vs' && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: baseFontSize * 0.5,
            transform: animStyle.transform,
            ...style.vsContainer,
          }}
        >
          <div
            style={{
              width: 2,
              height: slotHeight * 0.2,
              backgroundColor: color,
              opacity: 0.3,
              ...style.vsLineTop,
            }}
          />
          <div
            style={{
              width: baseFontSize * 2.5,
              height: baseFontSize * 2.5,
              borderRadius: '50%',
              backgroundColor: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 4px 12px ${color}40`,
              ...style.vsBadge,
            }}
          >
            <Text
              text={label || 'VS'}
              variant="body"
              size="sm"
              weight={700}
              style={{
                fontSize: baseFontSize * 0.7,
                color: '#fff',
                letterSpacing: 1,
                ...style.vsText,
              }}
            />
          </div>
          <div
            style={{
              width: 2,
              height: slotHeight * 0.2,
              backgroundColor: color,
              opacity: 0.3,
              ...style.vsLineBottom,
            }}
          />
        </div>
      )}
    </div>
  );
};

/**
 * SideBySideCompare Component
 * 
 * @param {Object} props
 * @param {Object} props.config - JSON configuration
 * @param {Object} props.config.left - Left side configuration (required)
 * @param {string} props.config.left.title - Left side title
 * @param {string} props.config.left.subtitle - Left side subtitle/description
 * @param {string} props.config.left.icon - Left side icon/emoji
 * @param {Array} props.config.left.items - Left side bullet points
 * @param {string} props.config.left.color - Left side accent color
 * @param {string} props.config.left.backgroundColor - Left side background color
 * @param {Object} props.config.right - Right side configuration (required)
 * @param {string} props.config.animation - Animation type: 'slide' | 'fade' | 'scale' | 'bounce' | 'reveal' (default: 'slide')
 * @param {number} props.config.staggerDelay - Delay between sides in seconds (default: 0.3)
 * @param {number} props.config.animationDuration - Animation duration per side in seconds (default: 0.6)
 * @param {string} props.config.dividerType - Divider style: 'none' | 'line' | 'dashed' | 'vs' (default: 'vs')
 * @param {string} props.config.dividerLabel - Custom divider label (default: 'VS')
 * @param {string} props.config.dividerColor - Divider color (default: 'primary')
 * @param {string} props.config.alignment - Content alignment: 'center' | 'inner' (default: 'center')
 * @param {Object} props.config.beats - Beat timings
 * @param {number} props.config.beats.start - Start beat in seconds (required)
 * @param {Object} props.config.position - Slot position from layout resolver
 * @param {Object} props.config.style - Optional style overrides
 */
export const SideBySideCompare = ({ config }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  
  const {
    left = {},
    right = {},
    animation = 'slide',
    staggerDelay = 0.3,
    animationDuration = 0.6,
    dividerType = 'vs',
    dividerLabel = 'VS',
    dividerColor = 'primary',
    alignment = 'center',
    beats = {},
    position,
    style = {},
  } = config;

  // Validate required fields
  if (!left.title && !left.icon && !left.items?.length) {
    console.warn('SideBySideCompare: Left side has no content');
  }
  if (!right.title && !right.icon && !right.items?.length) {
    console.warn('SideBySideCompare: Right side has no content');
  }

  const { start = 1.0 } = beats;
  const startFrame = toFrames(start, fps);
  const staggerFrames = toFrames(staggerDelay, fps);
  const durationFrames = toFrames(animationDuration, fps);
  
  // Calculate dimensions from position or viewport
  const slot = {
    width: position?.width || width,
    height: position?.height || height,
    left: position?.left || 0,
    top: position?.top || 0,
  };

  // Resolve colors from theme
  const resolveColor = (colorKey, fallback = null) => {
    if (!colorKey) return fallback;
    if (colorKey.startsWith('#') || colorKey.startsWith('rgb')) return colorKey;
    return KNODE_THEME.colors[colorKey] || fallback;
  };

  const resolvedDividerColor = resolveColor(dividerColor, KNODE_THEME.colors.primary);

  // Calculate base font size based on slot dimensions
  const baseFontSize = Math.min(32, Math.max(16, slot.height / 12));

  // Calculate animation timings
  const leftStartFrame = startFrame;
  const dividerStartFrame = startFrame + staggerFrames * 0.5;
  const rightStartFrame = startFrame + staggerFrames;

  const leftAnimStyle = getSideAnimationStyle(
    animation, frame, leftStartFrame, durationFrames, fps, 'left'
  );
  const rightAnimStyle = getSideAnimationStyle(
    animation, frame, rightStartFrame, durationFrames, fps, 'right'
  );
  const dividerAnimStyle = getDividerAnimationStyle(
    frame, dividerStartFrame, durationFrames, fps
  );

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: slot.left,
          top: slot.top,
          width: slot.width,
          height: slot.height,
          ...style.container,
        }}
      >
        {/* Left side */}
        <ComparisonSide
          side="left"
          config={{ ...left, alignment }}
          slotWidth={slot.width}
          slotHeight={slot.height}
          animStyle={leftAnimStyle}
          resolveColor={resolveColor}
          baseFontSize={baseFontSize}
          style={style}
        />

        {/* Divider */}
        <VsDivider
          type={dividerType}
          label={dividerLabel}
          color={resolvedDividerColor}
          animStyle={dividerAnimStyle}
          slotHeight={slot.height}
          baseFontSize={baseFontSize}
          style={style}
        />

        {/* Right side */}
        <ComparisonSide
          side="right"
          config={{ ...right, alignment }}
          slotWidth={slot.width}
          slotHeight={slot.height}
          animStyle={rightAnimStyle}
          resolveColor={resolveColor}
          baseFontSize={baseFontSize}
          style={style}
        />
      </div>
    </AbsoluteFill>
  );
};

export default SideBySideCompare;
