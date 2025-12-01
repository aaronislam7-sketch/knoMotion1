/**
 * BubbleCalloutSequence - Mid-Scene Component
 * 
 * Renders floating speech-bubble callouts with sequential appearance.
 * Features customizable bubble shapes, optional connecting lines, and staggered reveals.
 * All configurable via JSON - pre-built for LLM JSON generation.
 * 
 * @module mid-scenes/BubbleCalloutSequence
 * @category SDK
 * @subcategory Mid-Scenes
 */

import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, spring } from 'remotion';
import { Text } from '../elements/atoms/Text';
import { fadeIn, slideIn, scaleIn, bounceIn, drawLine } from '../animations/index';
import { toFrames } from '../core/time';
import { KNODE_THEME } from '../theme/knodeTheme';

/**
 * Bubble shape configurations
 */
const BUBBLE_SHAPES = {
  speech: {
    borderRadius: '20px',
    tailPosition: 'bottom-left',
  },
  thought: {
    borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
    tailType: 'dots',
  },
  rounded: {
    borderRadius: '24px',
    tailPosition: null,
  },
  pill: {
    borderRadius: '999px',
    tailPosition: null,
  },
  square: {
    borderRadius: '8px',
    tailPosition: null,
  },
};

/**
 * Calculate bubble position based on index and layout pattern
 * 
 * @param {number} index - Bubble index
 * @param {number} total - Total number of bubbles
 * @param {string} pattern - Layout pattern
 * @param {Object} slot - Slot dimensions
 * @returns {Object} Position { x, y }
 */
const calculateBubblePosition = (index, total, pattern, slot) => {
  const { width, height } = slot;
  const padding = Math.min(width, height) * 0.1;
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;
  
  switch (pattern) {
    case 'diagonal':
      return {
        x: padding + (usableWidth / (total + 1)) * (index + 1),
        y: padding + (usableHeight / (total + 1)) * (index + 1),
      };
    
    case 'zigzag':
      const isEven = index % 2 === 0;
      return {
        x: isEven ? padding + usableWidth * 0.25 : padding + usableWidth * 0.75,
        y: padding + (usableHeight / (total + 1)) * (index + 1),
      };
    
    case 'scattered':
      // Pseudo-random scatter based on index
      const angle = (index * 137.5) * (Math.PI / 180); // Golden angle
      const radius = Math.min(usableWidth, usableHeight) * 0.3;
      return {
        x: width / 2 + Math.cos(angle) * radius * (0.5 + (index % 3) * 0.25),
        y: height / 2 + Math.sin(angle) * radius * (0.5 + (index % 2) * 0.5),
      };
    
    case 'vertical':
      return {
        x: width / 2,
        y: padding + (usableHeight / (total + 1)) * (index + 1),
      };
    
    case 'horizontal':
      return {
        x: padding + (usableWidth / (total + 1)) * (index + 1),
        y: height / 2,
      };
    
    case 'grid':
      const cols = Math.ceil(Math.sqrt(total));
      const col = index % cols;
      const row = Math.floor(index / cols);
      const rows = Math.ceil(total / cols);
      return {
        x: padding + (usableWidth / (cols + 1)) * (col + 1),
        y: padding + (usableHeight / (rows + 1)) * (row + 1),
      };
    
    default: // 'flow'
      return {
        x: width / 2,
        y: padding + (usableHeight / (total + 1)) * (index + 1),
      };
  }
};

/**
 * Get animation style for bubble entrance
 */
const getBubbleAnimationStyle = (animationType, frame, startFrame, durationFrames, fps, direction = 'up') => {
  switch (animationType) {
    case 'pop':
    case 'bounceIn':
      return bounceIn(frame, startFrame, durationFrames);
    
    case 'float': {
      const progress = spring({
        frame: Math.max(0, frame - startFrame),
        fps,
        config: { damping: 15, mass: 1, stiffness: 100 },
      });
      return {
        opacity: progress,
        transform: `translateY(${(1 - progress) * 40}px) scale(${0.8 + progress * 0.2})`,
      };
    }
    
    case 'slide':
    case 'slideIn':
      return slideIn(frame, startFrame, durationFrames, direction, 60);
    
    case 'scale':
    case 'scaleIn':
      return scaleIn(frame, startFrame, durationFrames, 0);
    
    case 'fade':
    case 'fadeIn':
    default:
      return fadeIn(frame, startFrame, durationFrames);
  }
};

/**
 * SVG Speech Bubble Tail
 */
const BubbleTail = ({ position, color, size = 20 }) => {
  if (!position) return null;
  
  const [vertical, horizontal] = position.split('-');
  
  const tailPath = useMemo(() => {
    const w = size;
    const h = size * 0.8;
    
    switch (position) {
      case 'bottom-left':
        return `M0,0 L${w},0 L${w * 0.3},${h} Z`;
      case 'bottom-right':
        return `M0,0 L${w},0 L${w * 0.7},${h} Z`;
      case 'top-left':
        return `M0,${h} L${w},${h} L${w * 0.3},0 Z`;
      case 'top-right':
        return `M0,${h} L${w},${h} L${w * 0.7},0 Z`;
      case 'left':
        return `M${w},0 L${w},${h} L0,${h * 0.5} Z`;
      case 'right':
        return `M0,0 L0,${h} L${w},${h * 0.5} Z`;
      default:
        return `M0,0 L${w},0 L${w * 0.5},${h} Z`;
    }
  }, [position, size]);
  
  const tailStyle = {
    position: 'absolute',
    width: size,
    height: size,
    ...(vertical === 'bottom' && { bottom: -size + 2, left: horizontal === 'left' ? 20 : 'auto', right: horizontal === 'right' ? 20 : 'auto' }),
    ...(vertical === 'top' && { top: -size + 2, left: horizontal === 'left' ? 20 : 'auto', right: horizontal === 'right' ? 20 : 'auto' }),
    ...(position === 'left' && { left: -size + 2, top: '50%', transform: 'translateY(-50%)' }),
    ...(position === 'right' && { right: -size + 2, top: '50%', transform: 'translateY(-50%)' }),
  };
  
  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      style={tailStyle}
    >
      <path d={tailPath} fill={color} />
    </svg>
  );
};

/**
 * Thought bubble dots
 */
const ThoughtDots = ({ color, size = 8 }) => (
  <div
    style={{
      position: 'absolute',
      bottom: -size * 3,
      left: 20,
      display: 'flex',
      gap: size * 0.5,
    }}
  >
    {[1, 0.7, 0.4].map((scale, i) => (
      <div
        key={i}
        style={{
          width: size * scale,
          height: size * scale,
          borderRadius: '50%',
          backgroundColor: color,
        }}
      />
    ))}
  </div>
);

/**
 * Connecting line between bubbles
 */
const ConnectingLine = ({ from, to, progress, color, style: lineStyle }) => {
  if (!from || !to || progress <= 0) return null;
  
  const x1 = from.x;
  const y1 = from.y;
  const x2 = to.x;
  const y2 = to.y;
  
  const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
  
  return (
    <div
      style={{
        position: 'absolute',
        left: x1,
        top: y1,
        width: length * progress,
        height: 2,
        backgroundColor: color,
        transformOrigin: 'left center',
        transform: `rotate(${angle}deg)`,
        opacity: lineStyle === 'dashed' ? 0.6 : 0.4,
        borderStyle: lineStyle || 'solid',
        borderWidth: lineStyle === 'dashed' ? '0 0 2px 0' : 0,
        borderColor: color,
      }}
    />
  );
};

/**
 * BubbleCalloutSequence Component
 * 
 * @param {Object} props
 * @param {Object} props.config - JSON configuration
 * @param {Array} props.config.callouts - Array of callout items (required)
 * @param {string} props.config.callouts[].text - Callout text content
 * @param {string} props.config.callouts[].icon - Optional emoji/icon
 * @param {string} props.config.callouts[].color - Custom bubble color
 * @param {string} props.config.callouts[].shape - Bubble shape override
 * @param {Object} props.config.callouts[].position - Custom position { x, y } as percentages
 * @param {string} props.config.bubbleShape - Default bubble shape: 'speech' | 'thought' | 'rounded' | 'pill' | 'square' (default: 'speech')
 * @param {string} props.config.pattern - Layout pattern: 'flow' | 'diagonal' | 'zigzag' | 'scattered' | 'vertical' | 'horizontal' | 'grid' (default: 'flow')
 * @param {string} props.config.animation - Animation type: 'pop' | 'float' | 'slide' | 'scale' | 'fade' (default: 'float')
 * @param {number} props.config.staggerDelay - Delay between callouts in seconds (default: 0.3)
 * @param {number} props.config.animationDuration - Animation duration per callout in seconds (default: 0.6)
 * @param {boolean} props.config.showConnectors - Show connecting lines between callouts (default: false)
 * @param {string} props.config.connectorStyle - Line style: 'solid' | 'dashed' | 'dotted' (default: 'dashed')
 * @param {string} props.config.bubbleColor - Default bubble background color (default: 'cardBg')
 * @param {string} props.config.textColor - Default text color (default: 'textMain')
 * @param {Object} props.config.beats - Beat timings
 * @param {number} props.config.beats.start - Start beat in seconds (required)
 * @param {Object} props.config.position - Slot position from layout resolver
 * @param {Object} props.config.style - Optional style overrides
 */
export const BubbleCalloutSequence = ({ config }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  
  const {
    callouts = [],
    bubbleShape = 'speech',
    pattern = 'flow',
    animation = 'float',
    staggerDelay = 0.3,
    animationDuration = 0.6,
    showConnectors = false,
    connectorStyle = 'dashed',
    bubbleColor = 'cardBg',
    textColor = 'textMain',
    beats = {},
    position,
    style = {},
  } = config;

  // Validate required fields
  if (!callouts || callouts.length === 0) {
    console.warn('BubbleCalloutSequence: No callouts provided');
    return null;
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
  const resolveColor = (colorKey, fallback = '#FFFFFF') => {
    if (!colorKey) return fallback;
    if (colorKey.startsWith('#') || colorKey.startsWith('rgb')) return colorKey;
    return KNODE_THEME.colors[colorKey] || fallback;
  };

  const defaultBubbleBg = resolveColor(bubbleColor, KNODE_THEME.colors.cardBg);
  const defaultTextColor = resolveColor(textColor, KNODE_THEME.colors.textMain);

  // Calculate bubble positions
  const bubblePositions = useMemo(() => {
    return callouts.map((callout, index) => {
      if (callout.position) {
        // Custom position as percentages
        return {
          x: slot.left + (callout.position.x / 100) * slot.width,
          y: slot.top + (callout.position.y / 100) * slot.height,
        };
      }
      const pos = calculateBubblePosition(index, callouts.length, pattern, slot);
      return {
        x: slot.left + pos.x,
        y: slot.top + pos.y,
      };
    });
  }, [callouts, pattern, slot]);

  // Calculate dynamic bubble size based on slot and content
  const maxBubbleWidth = Math.min(slot.width * 0.6, 400);
  const baseFontSize = Math.min(24, slot.height / (callouts.length * 4));
  const bubblePadding = Math.max(16, baseFontSize * 0.8);

  return (
    <AbsoluteFill>
      {/* Connecting lines (rendered first, behind bubbles) */}
      {showConnectors && bubblePositions.map((pos, index) => {
        if (index === 0) return null;
        
        const prevPos = bubblePositions[index - 1];
        const lineStartFrame = startFrame + (index - 1) * staggerFrames + durationFrames;
        const lineDuration = staggerFrames * 0.8;
        const lineProgress = drawLine(frame, lineStartFrame, lineDuration);
        
        return (
          <ConnectingLine
            key={`line-${index}`}
            from={prevPos}
            to={pos}
            progress={lineProgress}
            color={resolveColor('textMuted')}
            style={connectorStyle}
          />
        );
      })}

      {/* Bubbles */}
      {callouts.map((callout, index) => {
        const calloutText = typeof callout === 'string' ? callout : callout.text;
        const calloutIcon = callout.icon;
        const calloutColor = resolveColor(callout.color || bubbleColor, defaultBubbleBg);
        const shape = BUBBLE_SHAPES[callout.shape || bubbleShape] || BUBBLE_SHAPES.speech;
        
        // Calculate animation timing for this callout
        const calloutStartFrame = startFrame + index * staggerFrames;
        const animStyle = getBubbleAnimationStyle(
          animation,
          frame,
          calloutStartFrame,
          durationFrames,
          fps,
          pattern === 'horizontal' ? 'left' : 'up'
        );

        const pos = bubblePositions[index];

        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: pos.x,
              top: pos.y,
              transform: 'translate(-50%, -50%)',
              opacity: animStyle.opacity,
              ...style.bubbleWrapper,
            }}
          >
            <div
              style={{
                transform: animStyle.transform,
                position: 'relative',
                maxWidth: maxBubbleWidth,
                padding: bubblePadding,
                backgroundColor: calloutColor,
                borderRadius: shape.borderRadius,
                boxShadow: KNODE_THEME.shadows.card,
                ...style.bubble,
              }}
            >
              {/* Bubble tail for speech bubbles */}
              {shape.tailPosition && (
                <BubbleTail
                  position={shape.tailPosition}
                  color={calloutColor}
                  size={16}
                />
              )}
              
              {/* Thought bubble dots */}
              {shape.tailType === 'dots' && (
                <ThoughtDots color={calloutColor} size={10} />
              )}

              {/* Content */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: calloutIcon ? 12 : 0,
                  ...style.content,
                }}
              >
                {calloutIcon && (
                  <span
                    style={{
                      fontSize: baseFontSize * 1.5,
                      lineHeight: 1,
                      flexShrink: 0,
                      ...style.icon,
                    }}
                  >
                    {calloutIcon}
                  </span>
                )}
                <Text
                  text={calloutText}
                  variant="body"
                  size="md"
                  weight={500}
                  color="textMain"
                  style={{
                    fontSize: baseFontSize,
                    lineHeight: 1.4,
                    color: resolveColor(callout.textColor || textColor, defaultTextColor),
                    textAlign: 'center',
                    ...style.text,
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export default BubbleCalloutSequence;
