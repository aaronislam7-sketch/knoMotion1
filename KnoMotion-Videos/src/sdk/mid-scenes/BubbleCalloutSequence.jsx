/**
 * BubbleCalloutSequence - Mid-Scene Component
 * 
 * Renders floating speech-bubble callouts with sequential appearance.
 * Features customizable bubble shapes, optional connecting lines, and staggered reveals.
 * Uses SDK elements for consistency with Knode design system.
 * All configurable via JSON - pre-built for LLM JSON generation.
 * 
 * @module mid-scenes/BubbleCalloutSequence
 * @category SDK
 * @subcategory Mid-Scenes
 */

import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, spring } from 'remotion';
import { Text } from '../elements/atoms/Text';
import { Card } from '../elements/atoms/Card';
import { fadeIn, slideIn, scaleIn, bounceIn } from '../animations/index';
import { toFrames } from '../core/time';
import { KNODE_THEME } from '../theme/knodeTheme';

/**
 * Bubble shape configurations with CSS properties
 */
const BUBBLE_SHAPES = {
  speech: {
    borderRadius: 20,
    showTail: true,
    tailPosition: 'bottom-left',
  },
  thought: {
    borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
    showTail: false,
    showDots: true,
  },
  rounded: {
    borderRadius: 24,
    showTail: false,
  },
  pill: {
    borderRadius: 999,
    showTail: false,
  },
  square: {
    borderRadius: 8,
    showTail: false,
  },
  notebook: {
    borderRadius: 16,
    showTail: false,
    dashed: true,
  },
};

/**
 * Calculate bubble positions based on pattern and slot dimensions
 * Fixed patterns for consistent, predictable layouts
 */
const calculateBubblePositions = (callouts, pattern, slot) => {
  const { width, height } = slot;
  const count = callouts.length;
  const padding = Math.min(width, height) * 0.08;
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;
  
  switch (pattern) {
    case 'vertical':
      // Evenly spaced vertical stack, centered horizontally
      return callouts.map((_, index) => ({
        x: width / 2,
        y: padding + (usableHeight / (count + 1)) * (index + 1),
      }));
    
    case 'horizontal':
      // Evenly spaced horizontal row, centered vertically
      return callouts.map((_, index) => ({
        x: padding + (usableWidth / (count + 1)) * (index + 1),
        y: height / 2,
      }));
    
    case 'diagonal':
      // Top-left to bottom-right diagonal
      return callouts.map((_, index) => ({
        x: padding + (usableWidth / (count + 1)) * (index + 1),
        y: padding + (usableHeight / (count + 1)) * (index + 1),
      }));
    
    case 'zigzag':
      // Alternating left-right positions
      return callouts.map((_, index) => {
        const isEven = index % 2 === 0;
        return {
          x: isEven ? padding + usableWidth * 0.25 : padding + usableWidth * 0.75,
          y: padding + (usableHeight / (count + 1)) * (index + 1),
        };
      });
    
    case 'scattered': {
      // Deterministic scatter using golden angle for good distribution
      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = Math.min(usableWidth, usableHeight) * 0.35;
      
      return callouts.map((_, index) => {
        // Golden angle distribution
        const angle = index * 137.5 * (Math.PI / 180);
        // Vary radius based on index for better spread
        const radiusFactor = 0.4 + ((index % 3) * 0.2);
        const radius = maxRadius * radiusFactor;
        
        return {
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
        };
      });
    }
    
    case 'grid': {
      // Auto-calculated grid layout
      const cols = Math.ceil(Math.sqrt(count));
      const rows = Math.ceil(count / cols);
      const cellWidth = usableWidth / cols;
      const cellHeight = usableHeight / rows;
      
      return callouts.map((_, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);
        return {
          x: padding + cellWidth * (col + 0.5),
          y: padding + cellHeight * (row + 0.5),
        };
      });
    }
    
    case 'arc': {
      // Semi-circular arc from left to right
      const centerX = width / 2;
      const centerY = height * 0.7;
      const radius = Math.min(usableWidth, usableHeight) * 0.4;
      
      return callouts.map((_, index) => {
        const angle = Math.PI + (Math.PI / (count + 1)) * (index + 1);
        return {
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
        };
      });
    }
    
    case 'flow':
    default:
      // Default: vertical centered flow with slight horizontal offset
      return callouts.map((_, index) => ({
        x: width / 2 + (index % 2 === 0 ? -20 : 20),
        y: padding + (usableHeight / (count + 1)) * (index + 1),
      }));
  }
};

/**
 * Get animation style for bubble entrance
 */
const getBubbleAnimationStyle = (animationType, frame, startFrame, durationFrames, fps, index = 0) => {
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
    case 'slideIn': {
      // Alternate slide direction for visual interest
      const direction = index % 2 === 0 ? 'left' : 'right';
      return slideIn(frame, startFrame, durationFrames, direction, 60);
    }
    
    case 'scale':
    case 'scaleIn':
      return scaleIn(frame, startFrame, durationFrames, 0.3);
    
    case 'drop': {
      const progress = spring({
        frame: Math.max(0, frame - startFrame),
        fps,
        config: { damping: 12, mass: 0.8, stiffness: 150 },
      });
      return {
        opacity: progress,
        transform: `translateY(${(1 - progress) * -50}px) scale(${0.9 + progress * 0.1})`,
      };
    }
    
    case 'fade':
    case 'fadeIn':
    default:
      return fadeIn(frame, startFrame, durationFrames);
  }
};

/**
 * Bubble Tail Component - Speech bubble pointer
 */
const BubbleTail = ({ position, color, size = 16 }) => {
  if (!position) return null;
  
  const [vertical, horizontal] = position.split('-');
  
  const tailStyle = {
    position: 'absolute',
    width: 0,
    height: 0,
    borderStyle: 'solid',
  };
  
  // Triangle pointing in the appropriate direction
  if (vertical === 'bottom') {
    Object.assign(tailStyle, {
      bottom: -size + 2,
      [horizontal]: 20,
      borderWidth: `${size}px ${size * 0.7}px 0 ${size * 0.7}px`,
      borderColor: `${color} transparent transparent transparent`,
    });
  } else if (vertical === 'top') {
    Object.assign(tailStyle, {
      top: -size + 2,
      [horizontal]: 20,
      borderWidth: `0 ${size * 0.7}px ${size}px ${size * 0.7}px`,
      borderColor: `transparent transparent ${color} transparent`,
    });
  }
  
  return <div style={tailStyle} />;
};

/**
 * Thought Bubble Dots Component
 */
const ThoughtDots = ({ color, size = 10 }) => (
  <div
    style={{
      position: 'absolute',
      bottom: -size * 3.5,
      left: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: size * 0.4,
    }}
  >
    {[1, 0.6, 0.3].map((scale, i) => (
      <div
        key={i}
        style={{
          width: size * scale,
          height: size * scale,
          borderRadius: '50%',
          backgroundColor: color,
          marginLeft: i * 4,
        }}
      />
    ))}
  </div>
);

/**
 * Animated Connecting Line between bubbles
 */
const ConnectorLine = ({ from, to, progress, color, style: lineStyle }) => {
  if (!from || !to || progress <= 0) return null;
  
  const length = Math.sqrt((to.x - from.x) ** 2 + (to.y - from.y) ** 2);
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  
  return (
    <svg
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'visible',
      }}
    >
      <line
        x1={from.x}
        y1={from.y}
        x2={from.x + (to.x - from.x) * progress}
        y2={from.y + (to.y - from.y) * progress}
        stroke={color}
        strokeWidth={2}
        strokeDasharray={lineStyle === 'dashed' ? '8 6' : lineStyle === 'dotted' ? '3 5' : 'none'}
        strokeLinecap="round"
        opacity={0.4}
      />
    </svg>
  );
};

/**
 * Single Bubble Component using SDK elements
 */
const Bubble = ({
  callout,
  position,
  maxWidth,
  bubbleShape,
  bubbleBg,
  textColor,
  animStyle,
  baseFontSize,
  style = {},
}) => {
  const calloutText = typeof callout === 'string' ? callout : callout.text;
  const calloutIcon = typeof callout === 'object' ? callout.icon : null;
  const shape = BUBBLE_SHAPES[callout.shape || bubbleShape] || BUBBLE_SHAPES.speech;
  
  const bubbleColor = callout.color 
    ? (callout.color.startsWith('#') ? callout.color : KNODE_THEME.colors[callout.color] || bubbleBg)
    : bubbleBg;

  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
        opacity: animStyle.opacity,
        ...style.bubbleWrapper,
      }}
    >
      <div
        style={{
          transform: animStyle.transform,
          position: 'relative',
          maxWidth,
        }}
      >
        {/* Main bubble using Card-like styling */}
        <div
          style={{
            padding: baseFontSize * 0.8,
            backgroundColor: bubbleColor,
            borderRadius: typeof shape.borderRadius === 'number' 
              ? shape.borderRadius 
              : shape.borderRadius,
            boxShadow: KNODE_THEME.shadows.card,
            border: shape.dashed 
              ? `2px dashed ${KNODE_THEME.colors.textMuted}40` 
              : 'none',
            ...style.bubble,
          }}
        >
          {/* Speech bubble tail */}
          {shape.showTail && (
            <BubbleTail
              position={shape.tailPosition}
              color={bubbleColor}
              size={14}
            />
          )}
          
          {/* Thought bubble dots */}
          {shape.showDots && (
            <ThoughtDots color={bubbleColor} size={10} />
          )}

          {/* Content */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: calloutIcon ? baseFontSize * 0.5 : 0,
              ...style.content,
            }}
          >
            {calloutIcon && (
              <span
                style={{
                  fontSize: baseFontSize * 1.4,
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
                color: textColor,
                textAlign: calloutIcon ? 'left' : 'center',
                ...style.text,
              }}
            />
          </div>
        </div>
      </div>
    </div>
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
 * @param {Object} props.config.callouts[].position - Custom position { x, y } as percentages (0-100)
 * @param {string} props.config.bubbleShape - Default bubble shape: 'speech' | 'thought' | 'rounded' | 'pill' | 'square' | 'notebook' (default: 'speech')
 * @param {string} props.config.pattern - Layout pattern: 'flow' | 'vertical' | 'horizontal' | 'diagonal' | 'zigzag' | 'scattered' | 'grid' | 'arc' (default: 'flow')
 * @param {string} props.config.animation - Animation type: 'pop' | 'float' | 'slide' | 'scale' | 'fade' | 'drop' (default: 'float')
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
  const connectorColor = resolveColor('textMuted', KNODE_THEME.colors.textMuted);

  // Calculate bubble positions - use custom positions if provided
  const bubblePositions = useMemo(() => {
    return callouts.map((callout, index) => {
      // Check for custom position (as percentages)
      if (typeof callout === 'object' && callout.position) {
        return {
          x: slot.left + (callout.position.x / 100) * slot.width,
          y: slot.top + (callout.position.y / 100) * slot.height,
        };
      }
      
      // Use pattern-based positioning
      const positions = calculateBubblePositions(callouts, pattern, slot);
      return {
        x: slot.left + positions[index].x,
        y: slot.top + positions[index].y,
      };
    });
  }, [callouts, pattern, slot]);

  // Calculate dynamic bubble sizing
  const maxBubbleWidth = Math.min(slot.width * 0.5, 350);
  const baseFontSize = Math.min(22, Math.max(14, slot.height / (callouts.length * 5)));

  return (
    <AbsoluteFill>
      {/* Connecting lines (rendered first, behind bubbles) */}
      {showConnectors && bubblePositions.map((pos, index) => {
        if (index === 0) return null;
        
        const prevPos = bubblePositions[index - 1];
        const lineStartFrame = startFrame + (index - 1) * staggerFrames + durationFrames * 0.5;
        const lineProgress = interpolate(
          frame,
          [lineStartFrame, lineStartFrame + staggerFrames * 0.8],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );
        
        return (
          <ConnectorLine
            key={`line-${index}`}
            from={prevPos}
            to={pos}
            progress={lineProgress}
            color={connectorColor}
            style={connectorStyle}
          />
        );
      })}

      {/* Bubbles */}
      {callouts.map((callout, index) => {
        const calloutStartFrame = startFrame + index * staggerFrames;
        const animStyle = getBubbleAnimationStyle(
          animation,
          frame,
          calloutStartFrame,
          durationFrames,
          fps,
          index
        );

        return (
          <Bubble
            key={index}
            callout={callout}
            position={bubblePositions[index]}
            maxWidth={maxBubbleWidth}
            bubbleShape={bubbleShape}
            bubbleBg={defaultBubbleBg}
            textColor={defaultTextColor}
            animStyle={animStyle}
            baseFontSize={baseFontSize}
            style={style}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export default BubbleCalloutSequence;
