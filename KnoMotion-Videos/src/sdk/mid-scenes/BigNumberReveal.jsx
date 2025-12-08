/**
 * BigNumberReveal - Mid-Scene Component
 * 
 * Dramatic reveal of large numbers/statistics with optional countup animation.
 * Perfect for viral content showing impressive stats (e.g., "11,000,000 → 40").
 * 
 * @module mid-scenes/BigNumberReveal
 * @category SDK
 * @subcategory Mid-Scenes
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, spring, interpolate } from 'remotion';
import { Text } from '../elements/atoms/Text';
import { toFrames } from '../core/time';
import { KNODE_THEME } from '../theme/knodeTheme';
import { resolveStylePreset } from '../theme/stylePresets';
import { resolveBeats } from '../utils/beats';

/**
 * Parse a number string to get numeric value and format info
 */
const parseNumberString = (str) => {
  const cleaned = str.replace(/[^0-9.-]/g, '');
  const value = parseFloat(cleaned);
  const hasCommas = str.includes(',');
  const prefix = str.match(/^[^0-9]*/)?.[0] || '';
  const suffix = str.match(/[^0-9]*$/)?.[0] || '';
  return { value, hasCommas, prefix, suffix, original: str };
};

/**
 * Format a number with commas
 */
const formatWithCommas = (num) => {
  return Math.round(num).toLocaleString('en-US');
};

/**
 * BigNumberReveal Component
 * 
 * @param {Object} props
 * @param {Object} props.config - JSON configuration
 * @param {string} props.config.number - The number to display (e.g., "11,000,000")
 * @param {string} [props.config.label] - Label below the number (e.g., "bits per second")
 * @param {string} [props.config.emphasis='high'] - Emphasis level: 'high' | 'normal' | 'low'
 * @param {string} [props.config.animation='pop'] - Animation: 'pop' | 'countUp' | 'typewriter' | 'fade'
 * @param {number} [props.config.countFrom=0] - Starting number for countUp animation
 * @param {string} [props.config.color] - Optional color override
 * @param {Object} props.config.beats - Beat timings
 * @param {number} props.config.beats.start - Start time in seconds
 * @param {number} [props.config.beats.exit] - Exit time in seconds
 * @param {Object} [props.config.position] - Slot position from layout resolver
 * @param {Object} [props.config.style] - Optional style overrides
 */
export const BigNumberReveal = ({ config, stylePreset }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  
  const {
    number,
    label,
    emphasis = 'high',
    animation = 'pop',
    countFrom = 0,
    color,
    beats = {},
    position,
    style = {},
    _format,
  } = config;

  // Validate required fields
  if (!number) {
    console.warn('BigNumberReveal: Missing required field (number)');
    return null;
  }

  const preset = resolveStylePreset(stylePreset);
  const isMobile = _format === 'mobile' || height > width;
  
  // Parse the number
  const parsed = parseNumberString(String(number));
  
  // Resolve beats
  const revealBeats = resolveBeats(beats, {
    start: 0.5,
    holdDuration: 3,
  });
  
  const startFrame = toFrames(revealBeats.start, fps);
  const exitFrame = toFrames(revealBeats.exit, fps);
  const animationDuration = 0.6;
  const durationFrames = toFrames(animationDuration, fps);
  
  // Calculate animation progress
  const entranceProgress = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: { damping: 12, mass: 1, stiffness: 100 },
  });
  
  const exitProgress = frame >= exitFrame
    ? spring({
        frame: frame - exitFrame,
        fps,
        config: { damping: 15, mass: 1, stiffness: 120 },
      })
    : 0;
  
  // Don't render before start
  if (frame < startFrame) {
    return null;
  }
  
  // Calculate display value based on animation type
  let displayValue = parsed.original;
  
  if (animation === 'countUp' && entranceProgress < 1) {
    const countDuration = durationFrames * 1.5;
    const countProgress = Math.min(1, (frame - startFrame) / countDuration);
    const easedProgress = 1 - Math.pow(1 - countProgress, 3); // Ease out cubic
    const currentValue = countFrom + (parsed.value - countFrom) * easedProgress;
    displayValue = parsed.hasCommas 
      ? `${parsed.prefix}${formatWithCommas(currentValue)}${parsed.suffix}`
      : `${parsed.prefix}${Math.round(currentValue)}${parsed.suffix}`;
  }
  
  // Animation styles
  let animStyle = { opacity: 1, transform: 'none' };
  
  switch (animation) {
    case 'pop':
      const popScale = interpolate(entranceProgress, [0, 1], [0.3, 1]);
      animStyle = {
        opacity: entranceProgress,
        transform: `scale(${popScale})`,
      };
      break;
    case 'countUp':
    case 'fade':
      animStyle = {
        opacity: entranceProgress,
        transform: `translateY(${(1 - entranceProgress) * 30}px)`,
      };
      break;
    case 'typewriter':
      const charsToShow = Math.floor(entranceProgress * displayValue.length);
      displayValue = displayValue.slice(0, charsToShow);
      animStyle = { opacity: 1 };
      break;
  }
  
  // Apply exit animation
  if (exitProgress > 0) {
    animStyle = {
      opacity: 1 - exitProgress,
      transform: `scale(${1 - exitProgress * 0.2}) translateY(${exitProgress * -20}px)`,
    };
  }
  
  // Color based on emphasis
  const emphasisColors = {
    high: color || KNODE_THEME.colors.primary,
    normal: color || KNODE_THEME.colors.textMain,
    low: color || KNODE_THEME.colors.textSoft,
  };
  const numberColor = emphasisColors[emphasis] || emphasisColors.high;
  
  // Sizing
  const baseFontSize = isMobile ? 120 : 100;
  const labelFontSize = isMobile ? 32 : 28;
  
  // Position
  const slot = {
    width: position?.width || width,
    height: position?.height || height,
    left: position?.left || 0,
    top: position?.top || 0,
  };

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: slot.left,
          top: slot.top,
          width: slot.width,
          height: slot.height,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: isMobile ? 16 : 12,
          ...animStyle,
          ...style.container,
        }}
      >
        {/* The Big Number */}
        <Text
          text={displayValue}
          variant="display"
          weight="bold"
          style={{
            fontSize: baseFontSize,
            color: numberColor,
            letterSpacing: '-0.02em',
            textAlign: 'center',
            lineHeight: 1,
            textShadow: emphasis === 'high' ? `0 4px 30px ${numberColor}40` : 'none',
            ...style.number,
          }}
        />
        
        {/* Label */}
        {label && (
          <Text
            text={label}
            variant="body"
            color="textSoft"
            style={{
              fontSize: labelFontSize,
              textAlign: 'center',
              opacity: 0.8,
              ...style.label,
            }}
          />
        )}
      </div>
    </AbsoluteFill>
  );
};

export default BigNumberReveal;
