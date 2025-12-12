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
import { ARRANGEMENT_TYPES, calculateItemPositions } from '../layout/layoutEngine';
import { positionToCSS as positionToCSSWithTransform } from '../layout/positionSystem';
import { fadeIn, slideIn, typewriter, getMaskReveal } from '../animations/index';
import { toFrames } from '../core/time';
import { KNODE_THEME } from '../theme/knodeTheme';
import { resolveStylePreset } from '../theme/stylePresets';
import { resolveEmphasisEffect } from '../theme/emphasisEffects';
import { resolveBeats } from '../utils/beats';

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
 * Get decoration style for text emphasis
 * NOTE: Borders removed as they cause visual collisions and don't fit the aesthetic.
 * Using subtle shadows and highlights instead.
 */
const getDecorationStyle = (decoration, color) => {
  const accentColor = color || KNODE_THEME.colors.doodle;
  switch (decoration) {
    case 'underline':
      // Soft glow underline effect instead of hard border
      return {
        textShadow: `0 2px 8px ${accentColor}40`,
        paddingBottom: 4,
      };
    case 'highlight':
      return {
        boxShadow: `inset 0 -14px 0 ${accentColor}25`,
      };
    case 'circle':
      // Soft glow circle effect instead of hard border
      return {
        padding: '6px 16px',
        background: `${accentColor}12`,
        borderRadius: 40,
        boxShadow: `0 0 20px ${accentColor}20`,
      };
    default:
      return {};
  }
};

const getEmphasisStyle = (emphasis = 'normal') => resolveEmphasisEffect(emphasis);

const getEmphasisMotion = (effect, frame, beats, fps) => {
  if (!effect.animation) {
    return {};
  }
  const emphasisStart = beats?.emphasis ?? beats?.start ?? 0;
  const emphasisFrame = toFrames(emphasisStart, fps);
  if (frame < emphasisFrame) {
    return {};
  }
  const elapsed = frame - emphasisFrame;
  const speed = effect.animation.speed || 1;
  
  if (effect.animation.type === 'pulse') {
    // Apply speed to pulse frequency
    const frequency = 6 / speed; // Higher speed = faster pulse
    const cycle = Math.sin(elapsed / frequency);
    const amount = effect.animation.amount || 0.04;
    const scale = 1 + amount * Math.max(0, cycle);
    return { transform: `scale(${scale})` };
  }
  if (effect.animation.type === 'breathe') {
    const frequency = 12 / speed;
    const amount = effect.animation.amount || 0.01;
    const scale = 1 + amount * Math.sin(elapsed / frequency);
    return { transform: `scale(${scale})` };
  }
  return {};
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
const getRevealAnimationStyle = (revealType, frame, startFrame, durationFrames, direction = 'up', text = '', showCursor = true) => {
  switch (revealType) {
    case 'typewriter':
      const visibleText = typewriter(frame, startFrame, durationFrames, text);
      const isTyping = frame >= startFrame && frame < startFrame + durationFrames;
      const showCursorNow = showCursor && (isTyping || frame < startFrame + durationFrames + 15);
      const cursorBlink = Math.floor((frame - startFrame) / 8) % 2 === 0;
      
      return {
        opacity: 1,
        transform: 'none',
        visibleText,
        isTypewriter: true,
        showCursor: showCursorNow && cursorBlink,
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
 * Parse text for emphasis syntax *emphasis* or __emphasis__
 * Returns array of { text, emphasis: boolean }
 */
const parseEmphasizedText = (text) => {
  if (!text) return [{ text: '', emphasis: false }];
  
  // Split by * or __ markers
  // Matches: *word* or __word__
  const regex = /(\*[^*]+\*|__[a-zA-Z0-9 ]+__)/g;
  const parts = text.split(regex);
  
  return parts.map(part => {
    if (part.startsWith('*') && part.endsWith('*')) {
      return { text: part.slice(1, -1), emphasis: true };
    }
    if (part.startsWith('__') && part.endsWith('__')) {
      return { text: part.slice(2, -2), emphasis: true };
    }
    return { text: part, emphasis: false };
  }).filter(p => p.text);
};

/**
 * TextRevealSequence Component
 * 
 * @param {Object} props
 * @param {Object} props.config - JSON configuration
 * @param {Array} props.config.lines - Array of line objects with text and emphasis (required)
 * @param {string} props.config.revealType - Type of reveal: 'typewriter' | 'fade' | 'slide' | 'mask' (default: 'fade')
 * @param {boolean} props.config.showCursor - Show blinking cursor for typewriter effect (default: true)
 * @param {string} props.config.direction - Direction for slide/mask reveals: 'up' | 'down' | 'left' | 'right' (default: 'up')
 * @param {number} props.config.staggerDelay - Delay between lines in seconds (default: 0.2)
 * @param {number} props.config.animationDuration - Animation duration per line in seconds (default: 0.8)
 * @param {string} props.config.lineSpacing - Line spacing: 'tight' | 'normal' | 'relaxed' | 'loose' (default: 'normal')
 * @param {string} [props.stylePreset] - Optional style preset name
 * @param {Object} props.config.beats - Beat timings
 * @param {number} props.config.beats.start - Start beat in seconds (required)
 * @param {Object} props.config.position - Optional position override
 * @param {Object} props.config.style - Optional style overrides
 */
export const TextRevealSequence = ({ config, stylePreset }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  
  const {
    lines = [],
    revealType = 'fade',
    showCursor = true,
    direction = 'up',
    staggerDelay = 0.2,
    animationDuration = 0.8,
    lineSpacing = 'normal',
    beats = {},
    position,
    style = {},
  } = config;

  const preset = resolveStylePreset(stylePreset);
  const presetDecorationStyle = getDecorationStyle(
    preset.decoration,
    KNODE_THEME.colors[preset.textColor],
  );

  // Validate required fields
  if (!lines || lines.length === 0) {
    console.warn('TextRevealSequence: No lines provided');
    return null;
  }

  const sequenceBeats = resolveBeats(beats, {
    start: 1.0,
    holdDuration: animationDuration,
    exitOffset: 0.25,
  });
  const startFrame = toFrames(sequenceBeats.start, fps);
  const durationFrames = toFrames(animationDuration, fps);
  const lineSpacingValue = getLineSpacing(lineSpacing);
  const viewport = { width, height };

  // Calculate base font size - BOOSTED and viewport-aware
  // Mobile (portrait): scale up for impact
  // Desktop (landscape): generous sizing
  const isMobile = height > width;
  const baseDesktopSize = 64; // Up from 48
  const baseFontSize = isMobile 
    ? Math.round(baseDesktopSize * 1.15) // 15% larger on mobile
    : baseDesktopSize;
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

        const itemBeats = resolveBeats(line.beats, {
          start: sequenceBeats.start + index * staggerDelay,
          holdDuration: animationDuration,
        });
        const lineStartFrame = toFrames(itemBeats.start, fps);
        const animStyle = getRevealAnimationStyle(
          revealType,
          frame,
          lineStartFrame,
          durationFrames,
          direction,
          line.text,
          showCursor
        );

        // Calculate exit animation
        const exitFrame = toFrames(itemBeats.exit, fps);
        const exitDuration = toFrames(0.3, fps);
        const exitProgress = frame > exitFrame
          ? Math.min(1, (frame - exitFrame) / exitDuration)
          : 0;

        const emphasisEffect = getEmphasisStyle(line.emphasis);
        const emphasisMotion = getEmphasisMotion(emphasisEffect, frame, itemBeats, fps);
        // Use positionSystem's positionToCSS which uses transforms for center coords
        const linePosition = positionToCSSWithTransform(pos, 'center');

        // Handle typewriter vs. other animations
        const displayText = animStyle.isTypewriter ? animStyle.visibleText : line.text;
        const cursorVisible = animStyle.isTypewriter && animStyle.showCursor;

        // Combine centering transform with animation transform properly
        // The linePosition.transform handles centering (-50%, -50%)
        // The animStyle.transform handles animation (e.g., translateY for slide)
        const transforms = [linePosition.transform];
        if (animStyle.transform && animStyle.transform !== 'none') {
          transforms.push(animStyle.transform);
        }
        if (emphasisMotion.transform) {
          transforms.push(emphasisMotion.transform);
        }
        const combinedTransform = transforms.filter(Boolean).join(' ');

        const weightValue = emphasisEffect.textStyle.fontWeight || 600;
        const textWeight =
          weightValue >= 700 ? 'bold' : weightValue <= 400 ? 'normal' : 'medium';

        // Calculate final opacity including exit
        const entranceOpacity = animStyle.opacity ?? 1;
        const exitOpacity = 1 - exitProgress;
        const finalOpacity = entranceOpacity * exitOpacity;

        // Parse for inline emphasis
        const textParts = parseEmphasizedText(displayText);

        return (
          <div
            key={index}
            style={{
              ...linePosition,
              // Override transform to include animation
              transform: combinedTransform,
              opacity: finalOpacity,
              clipPath: animStyle.clipPath || 'none',
              ...('opacity' in emphasisMotion ? { opacity: emphasisMotion.opacity * exitOpacity } : {}),
              ...style.lineContainer,
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center' }}>
              {textParts.map((part, i) => (
                <Text
                  key={i}
                  text={part.text}
                  variant={preset.textVariant}
                  size="xl"
                  weight={part.emphasis ? 'bold' : textWeight}
                  color={part.emphasis ? 'primary' : preset.textColor}
                  style={{
                    fontSize: baseFontSize,
                    lineHeight: `${lineHeight}px`,
                    textAlign: 'center',
                    whiteSpace: 'pre', // Preserve spaces
                    ...(part.emphasis ? emphasisEffect.textStyle : {}),
                    ...(part.emphasis ? presetDecorationStyle : {}),
                    ...style.text,
                  }}
                />
              ))}
              {cursorVisible && (
                <span
                  style={{
                    display: 'inline-block',
                    width: 3,
                    height: baseFontSize * 0.9,
                    backgroundColor: KNODE_THEME.colors[preset.textColor] || KNODE_THEME.colors.textMain,
                    marginLeft: 2,
                    ...style.cursor,
                  }}
                />
              )}
            </span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export default TextRevealSequence;
