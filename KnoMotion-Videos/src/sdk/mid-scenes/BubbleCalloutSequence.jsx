/**
 * BubbleCalloutSequence - Mid-Scene Component
 * 
 * Renders floating speech-bubble callouts in a freeform/scattered layout.
 * Uses SDK CalloutBubble composition for consistent styling.
 * Focused use-case: Thought bubbles, annotations, tips in a non-structured layout.
 * 
 * @module mid-scenes/BubbleCalloutSequence
 * @category SDK
 * @subcategory Mid-Scenes
 */

import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, spring } from 'remotion';
import { CalloutBubble } from '../elements/compositions/CalloutBubble';
import { fadeIn, slideIn, scaleIn, bounceIn, staggerIn } from '../animations/index';
import { toFrames } from '../core/time';
import { KNODE_THEME } from '../theme/knodeTheme';
import { resolveStylePreset } from '../theme/stylePresets';
import { resolveBeats } from '../utils/beats';
import { enforceMinimumSpacing } from '../layout/layoutEngine';

/**
 * Estimate bubble dimensions based on text content
 */
const estimateBubbleSize = (text, maxWidth = 280) => {
  const textLength = typeof text === 'string' ? text.length : 40;
  const avgCharWidth = 10;
  const estimatedWidth = Math.min(maxWidth, Math.max(120, textLength * avgCharWidth));
  const lines = Math.ceil((textLength * avgCharWidth) / estimatedWidth);
  const estimatedHeight = Math.max(60, lines * 28 + 40);
  return { width: estimatedWidth, height: estimatedHeight };
};

/**
 * Calculate bubble positions based on pattern (simplified to freeform patterns only)
 */
const calculateBubblePositions = (callouts, pattern, slot, enableCollisionDetection = true) => {
  const { width, height } = slot;
  const count = callouts.length;
  const padding = Math.min(width, height) * 0.1;
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;
  
  let positions;
  
  switch (pattern) {
    case 'diagonal':
      // Top-left to bottom-right diagonal
      positions = callouts.map((callout, index) => {
        const text = typeof callout === 'string' ? callout : callout.text;
        const size = estimateBubbleSize(text);
        return {
          id: `bubble-${index}`,
          x: padding + (usableWidth / (count + 1)) * (index + 1),
          y: padding + (usableHeight / (count + 1)) * (index + 1),
          ...size,
        };
      });
      break;
    
    case 'zigzag':
      // Alternating left-right positions
      positions = callouts.map((callout, index) => {
        const text = typeof callout === 'string' ? callout : callout.text;
        const size = estimateBubbleSize(text);
        const isEven = index % 2 === 0;
        return {
          id: `bubble-${index}`,
          x: isEven ? padding + usableWidth * 0.25 : padding + usableWidth * 0.75,
          y: padding + (usableHeight / (count + 1)) * (index + 1),
          ...size,
        };
      });
      break;
    
    case 'scattered':
    default: {
      // Deterministic scatter using golden angle for good distribution
      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = Math.min(usableWidth, usableHeight) * 0.35;
      
      positions = callouts.map((callout, index) => {
        const text = typeof callout === 'string' ? callout : callout.text;
        const size = estimateBubbleSize(text);
        // Golden angle distribution for natural-looking scatter
        const angle = index * 137.5 * (Math.PI / 180);
        const radiusFactor = 0.5 + ((index % 3) * 0.15);
        const radius = maxRadius * radiusFactor;
        
        return {
          id: `bubble-${index}`,
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
          ...size,
        };
      });
    }
  }
  
  // Apply collision detection to avoid overlaps
  if (enableCollisionDetection && positions.length > 1) {
    return enforceMinimumSpacing(positions, 20);
  }
  
  return positions;
};

/**
 * Get animation style for bubble entrance
 */
const getBubbleAnimationStyle = (animationType, frame, startFrame, durationFrames, fps, index = 0) => {
  switch (animationType) {
    case 'pop':
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
    
    case 'slide': {
      const direction = index % 2 === 0 ? 'left' : 'right';
      return slideIn(frame, startFrame, durationFrames, direction, 60);
    }
    
    case 'scale':
      return scaleIn(frame, startFrame, durationFrames, 0.3);
    
    case 'fade':
    default:
      return fadeIn(frame, startFrame, durationFrames);
  }
};

/**
 * BubbleCalloutSequence Component
 * 
 * Focused use-case: Freeform callouts for annotations, thoughts, tips.
 * NOT for structured layouts - use other mid-scenes for structured content.
 * 
 * @param {Object} props
 * @param {Object} props.config - JSON configuration
 * @param {Array} props.config.callouts - Array of callout items (required)
 * @param {string} props.config.callouts[].text - Callout text content
 * @param {string} [props.config.callouts[].icon] - Optional emoji/icon
 * @param {string} [props.config.callouts[].color] - Custom bubble color
 * @param {string} [props.config.callouts[].shape] - Shape override
 * @param {string} [props.config.shape='speech'] - Default bubble shape: 'speech' | 'rounded' | 'notebook'
 * @param {string} [props.config.pattern='scattered'] - Layout pattern: 'scattered' | 'zigzag' | 'diagonal'
 * @param {string} [props.config.animation='float'] - Animation: 'pop' | 'float' | 'slide' | 'scale' | 'fade'
 * @param {number} [props.config.staggerDelay=0.3] - Delay between callouts in seconds
 * @param {number} [props.config.animationDuration=0.6] - Animation duration in seconds
 * @param {boolean} [props.config.collisionDetection=true] - Enable collision-aware positioning
 * @param {Object} [props.config.jitter] - Optional jitter configuration
 * @param {number} [props.config.jitter.x=0] - X-axis jitter in pixels
 * @param {number} [props.config.jitter.y=0] - Y-axis jitter in pixels
 * @param {Object} props.config.beats - Beat timings
 * @param {number} props.config.beats.start - Start time in seconds (required)
 * @param {Object} [props.config.position] - Slot position from layout resolver
 * @param {Object} [props.config.style] - Optional style overrides
 */
export const BubbleCalloutSequence = ({ config, stylePreset }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  
  const {
    callouts = [],
    shape = 'speech',
    pattern = 'scattered',
    animation = 'float',
    staggerDelay = 0.3,
    animationDuration = 0.6,
    collisionDetection = true,
    jitter = null,
    beats = {},
    position,
    style = {},
  } = config;
  const preset = resolveStylePreset(stylePreset);

  // Validate required fields
  if (!callouts || callouts.length === 0) {
    console.warn('BubbleCalloutSequence: No callouts provided');
    return null;
  }

  const sequenceBeats = resolveBeats(beats, {
    start: 0.8,
    holdDuration: animationDuration,
  });
  const startFrame = toFrames(sequenceBeats.start, fps);
  const staggerFrames = toFrames(staggerDelay, fps);
  const durationFrames = toFrames(animationDuration, fps);
  
  // Calculate slot dimensions
  const slot = {
    width: position?.width || width,
    height: position?.height || height,
    left: position?.left || 0,
    top: position?.top || 0,
  };

  // Calculate bubble positions with collision detection
  const bubblePositions = useMemo(() => {
    return calculateBubblePositions(callouts, pattern, slot, collisionDetection);
  }, [callouts, pattern, slot.width, slot.height, collisionDetection]);

  // Calculate dynamic bubble sizing
  const maxBubbleWidth = Math.min(slot.width * 0.45, 320);

  return (
    <AbsoluteFill>
      {callouts.map((callout, index) => {
        // Normalize callout to object format
        const calloutData = typeof callout === 'string' 
          ? { text: callout } 
          : callout;
        
        const itemBeats = resolveBeats(calloutData.beats, {
          start: sequenceBeats.start + index * staggerDelay,
          holdDuration: animationDuration,
        });
        const calloutStartFrame = toFrames(itemBeats.start, fps);
        const animStyle = getBubbleAnimationStyle(
          animation || preset.animationPreset || 'float',
          frame,
          calloutStartFrame,
          durationFrames,
          fps,
          index
        );
        const exitFrame = toFrames(itemBeats.exit, fps);
        const exitProgress =
          frame > exitFrame
            ? Math.min(1, (frame - exitFrame) / toFrames(0.3, fps))
            : 0;
        const pos = bubblePositions[index];
        
        // Apply configurable jitter for organic feel
        const jitterX = jitter 
          ? ((index % 3) - 1) * (jitter.x || 0)
          : 0;
        const jitterY = jitter 
          ? (((index + 1) % 3) - 1) * (jitter.y || 0)
          : 0;

        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: pos.x + jitterX,
              top: pos.y + jitterY,
              transform: 'translate(-50%, -50%)',
              maxWidth: maxBubbleWidth,
              opacity: (animStyle.opacity ?? 1) * (1 - exitProgress),
              ...style.bubbleWrapper,
            }}
          >
            <div style={{ transform: animStyle.transform }}>
              <CalloutBubble
                text={calloutData.text}
                iconRef={calloutData.icon}
                shape={calloutData.shape || shape}
                color={calloutData.color || preset.doodle?.color || 'cardBg'}
                style={style}
              />
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export default BubbleCalloutSequence;
