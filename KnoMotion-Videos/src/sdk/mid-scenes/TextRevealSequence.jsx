/**
 * TextRevealSequence - Mid-Scene Component
 * 
 * Renders multiple text lines with reveal animations (typewriter, fade, slide, mask).
 * Combines Text elements with reveal animations and stagger timing.
 * All configurable via JSON - pre-built for LLM JSON generation.
 * 
 * @module mid-scenes/TextRevealSequence
 * @category SDK
 * @subcategory Mid-Scenes
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';
import { Text } from '../elements/atoms/Text';
import { ARRANGEMENT_TYPES, calculateItemPositions, positionToCSS } from '../layout/layoutEngine';
import { fadeIn, slideIn, typewriter, getMaskReveal } from '../animations/index';
import { toFrames } from '../core/time';
import { KNODE_THEME } from '../theme/knodeTheme';

/**
 * Get line spacing value from theme based on spacing type
 * 
 * @param {string} spacingType - Type of spacing: 'tight' | 'normal' | 'relaxed' | 'loose'
 * @returns {number} Line spacing multiplier
 */
const getLineSpacing = (spacingType = 'normal') => {
  const spacingMap = {
    tight: KNODE_THEME.spacing.lineSpacingTight || 1.2,
    normal: KNODE_THEME.spacing.lineSpacingNormal || 1.5,
    relaxed: KNODE_THEME.spacing.lineSpacingRelaxed || 1.8,
    loose: KNODE_THEME.spacing.lineSpacingLoose || 2.0,
  };
  return spacingMap[spacingType] || spacingMap.normal;
};

/**
 * Get emphasis style based on emphasis level
 * 
 * @param {string} emphasis - Emphasis level: 'normal' | 'high' | 'low'
 * @returns {Object} Style object with weight, color, and optional highlight
 */
const getEmphasisStyle = (emphasis = 'normal') => {
  switch (emphasis) {
    case 'high':
      return {
        fontWeight: 700,
        color: KNODE_THEME.colors.primary,
        backgroundColor: `${KNODE_THEME.colors.primary}15`, // Light highlight
        padding: '4px 8px',
        borderRadius: 4,
      };
    case 'low':
      return {
        fontWeight: 400,
        color: KNODE_THEME.colors.textSoft,
      };
    case 'normal':
    default:
      return {
        fontWeight: 600,
        color: KNODE_THEME.colors.textMain,
      };
  }
};

/**
 * Get animation style based on reveal type
 * 
 * @param {string} revealType - Type of reveal animation
 * @param {number} frame - Current frame
 * @param {number} startFrame - Start frame for animation
 * @param {number} durationFrames - Duration in frames
 * @param {string} direction - Direction for slide/mask animations
 * @param {string} text - Text content (for typewriter)
 * @returns {Object} Style object with opacity, transform, and/or visible text
 */
const getRevealAnimationStyle = (revealType, frame, startFrame, durationFrames, direction = 'up', text = '') => {
  switch (revealType) {
    case 'typewriter':
      const visibleText = typewriter(frame, startFrame, durationFrames, text);
      return {
        opacity: 1,
        transform: 'none',
        visibleText,
        isTypewriter: true,
      };
    
    case 'slide':
      return {
        ...slideIn(frame, startFrame, durationFrames, direction, 50),
        isTypewriter: false,
      };
    
    case 'mask':
      const maskReveal = getMaskReveal(frame, {
        start: startFrame / 30, // Convert to seconds
        duration: durationFrames / 30,
        direction,
        textBounds: { x: 0, y: 0, width: 800, height: 100 },
      }, 30);
      return {
        opacity: maskReveal.visible ? 1 : 0,
        clipPath: maskReveal.clipPath || 'none',
        isTypewriter: false,
      };
    
    case 'fade':
    default:
      return {
        ...fadeIn(frame, startFrame, durationFrames),
        isTypewriter: false,
      };
  }
};

/**
 * TextRevealSequence Component
 * 
 * @param {Object} props
 * @param {Object} props.config - JSON configuration
 * @param {Array} props.config.lines - Array of line objects with text and emphasis (required)
 * @param {string} props.config.revealType - Type of reveal: 'typewriter' | 'fade' | 'slide' | 'mask' (default: 'fade')
 * @param {string} props.config.direction - Direction for slide/mask reveals: 'up' | 'down' | 'left' | 'right' (default: 'up')
 * @param {number} props.config.staggerDelay - Delay between lines in seconds (default: 0.2)
 * @param {number} props.config.animationDuration - Animation duration per line in seconds (default: 0.8)
 * @param {string} props.config.lineSpacing - Line spacing: 'tight' | 'normal' | 'relaxed' | 'loose' (default: 'normal')
 * @param {Object} props.config.beats - Beat timings
 * @param {number} props.config.beats.start - Start beat in seconds (required)
 * @param {Object} props.config.position - Optional position override
 * @param {Object} props.config.style - Optional style overrides
 */
export const TextRevealSequence = ({ config }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  
  const {
    lines = [],
    revealType = 'fade',
    direction = 'up',
    staggerDelay = 0.2,
    animationDuration = 0.8,
    lineSpacing = 'normal',
    beats = {},
    position,
    style = {},
  } = config;

  // Validate required fields
  if (!lines || lines.length === 0) {
    console.warn('TextRevealSequence: No lines provided');
    return null;
  }

  const { start = 1.0 } = beats;
  const startFrame = toFrames(start, fps);
  const staggerFrames = toFrames(staggerDelay, fps);
  const durationFrames = toFrames(animationDuration, fps);
  const lineSpacingValue = getLineSpacing(lineSpacing);
  const viewport = { width, height };

  // Calculate base font size and line height
  const baseFontSize = 48;
  const lineHeight = baseFontSize * lineSpacingValue;

  // Calculate positions using layout engine (STACKED_VERTICAL)
  const layoutConfig = {
    arrangement: ARRANGEMENT_TYPES.STACKED_VERTICAL,
    viewport,
    spacing: lineHeight,
    basePosition: 'center',
    ...(position && { area: position }),
  };

  const positions = calculateItemPositions(lines, layoutConfig);

  return (
    <AbsoluteFill>
      {positions.map((pos, index) => {
        const line = lines[index];
        if (!line || !line.text) return null;

        const lineStartFrame = startFrame + index * staggerFrames;
        const animStyle = getRevealAnimationStyle(
          revealType,
          frame,
          lineStartFrame,
          durationFrames,
          direction,
          line.text
        );

        const emphasisStyle = getEmphasisStyle(line.emphasis);
        const linePosition = positionToCSS(pos);

        // Handle typewriter vs. other animations
        const displayText = animStyle.isTypewriter ? animStyle.visibleText : line.text;

        return (
          <div
            key={index}
            style={{
              ...linePosition,
              opacity: animStyle.opacity,
              transform: animStyle.transform,
              clipPath: animStyle.clipPath || 'none',
              ...style.lineContainer,
            }}
          >
            <Text
              text={displayText}
              variant="body"
              size="xl"
              weight={emphasisStyle.fontWeight}
              color="textMain"
              style={{
                fontSize: baseFontSize,
                lineHeight: `${lineHeight}px`,
                textAlign: 'center',
                ...emphasisStyle,
                ...style.text,
              }}
            />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export default TextRevealSequence;
