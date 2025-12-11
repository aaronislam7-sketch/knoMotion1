/**
 * AnimatedCounter - Mid-Scene Component
 * 
 * Animates a number counting up/down with prefix/suffix.
 * Uses Remotion's interpolate for smooth counting animation.
 * 
 * @module mid-scenes/AnimatedCounter
 * @category SDK
 * @subcategory Mid-Scenes
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, Easing } from 'remotion';
import { Text } from '../elements/atoms/Text';
import { toFrames } from '../core/time';
import { KNODE_THEME } from '../theme/knodeTheme';
import { resolveStylePreset } from '../theme/stylePresets';
import { resolveBeats } from '../utils/beats';

/**
 * Format a number with commas
 */
const formatWithCommas = (num) => {
  return Math.round(num).toLocaleString('en-US');
};

/**
 * AnimatedCounter Component
 * 
 * @param {Object} props
 * @param {Object} props.config - JSON configuration
 * @param {number} props.config.startValue - Starting number
 * @param {number} props.config.endValue - Ending number
 * @param {number} [props.config.duration=2] - Count duration in seconds
 * @param {string} [props.config.prefix=''] - Prefix text (e.g. "$")
 * @param {string} [props.config.suffix=''] - Suffix text (e.g. "%")
 * @param {string} [props.config.label] - Label below the number
 * @param {string} [props.config.color] - Custom color
 * @param {Object} props.config.beats - Beat timings
 * @param {number} props.config.beats.start - Start beat in seconds (required)
 * @param {Object} [props.config.position] - Slot position from layout resolver
 * @param {Object} [props.config.style] - Optional style overrides
 */
export const AnimatedCounter = ({ config, stylePreset }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  
  const {
    startValue = 0,
    endValue = 100,
    duration = 2,
    prefix = '',
    suffix = '',
    label,
    color,
    beats = {},
    position,
    style = {},
    _format,
  } = config;

  const preset = resolveStylePreset(stylePreset);
  const isMobile = _format === 'mobile' || height > width;
  
  const sequenceBeats = resolveBeats(beats, {
    start: 0.5,
    holdDuration: duration + 1,
  });
  
  const startFrame = toFrames(sequenceBeats.start, fps);
  const durationFrames = toFrames(duration, fps);
  
  // Interpolate the value
  const currentValue = interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [startValue, endValue],
    {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );
  
  const displayValue = `${prefix}${formatWithCommas(currentValue)}${suffix}`;
  
  // Determine color
  const emphasisColors = {
    high: color || KNODE_THEME.colors.primary,
    normal: color || KNODE_THEME.colors.textMain,
  };
  const numberColor = emphasisColors.high;
  
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
          opacity: frame < startFrame ? 0 : 1,
          ...style.container,
        }}
      >
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
            ...style.number,
          }}
        />
        
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

export default AnimatedCounter;
