/**
 * HeroTextEntranceExit - Mid-Scene Component
 * 
 * Combines hero (image/lottie), text, entrance animation, and exit animation.
 * All configurable via JSON - pre-built for LLM JSON generation.
 * 
 * @module mid-scenes/HeroTextEntranceExit
 * @category SDK
 * @subcategory Mid-Scenes
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';
import { renderHero, calculateHeroAnimation } from '../components/heroRegistry';
import { Text } from '../elements/atoms/Text';
import { fadeIn, slideIn, scaleIn, fadeSlide, fadeOut, slideOut, scaleOut } from '../animations/index';
import { toFrames } from '../core/time';
import { KNODE_THEME } from '../theme/knodeTheme';
import { resolveStylePreset } from '../theme/stylePresets';
import { resolveBeats } from '../utils/beats';
import { positionToCSS } from '../layout/layoutEngine';

/**
 * Get animation style based on animation type
 * 
 * @param {string} animationType - Type of animation (fadeIn, slideIn, etc.)
 * @param {number} frame - Current frame
 * @param {number} startFrame - Start frame for animation
 * @param {number} durationFrames - Duration in frames
 * @param {string} direction - Direction for slide animations
 * @returns {Object} Style object with opacity and transform
 */
const getAnimationStyle = (animationType, frame, startFrame, durationFrames, direction = 'up') => {
  switch (animationType) {
    case 'fadeIn':
      return fadeIn(frame, startFrame, durationFrames);
    case 'slideIn':
      return slideIn(frame, startFrame, durationFrames, direction, 50);
    case 'scaleIn':
      return scaleIn(frame, startFrame, durationFrames, 0.3);
    case 'fadeSlide':
      return fadeSlide(frame, startFrame, durationFrames, direction, 40);
    case 'fadeOut':
      return fadeOut(frame, startFrame, durationFrames);
    case 'slideOut':
      return slideOut(frame, startFrame, durationFrames, direction, 50);
    case 'scaleOut':
      return scaleOut(frame, startFrame, durationFrames, 0.3);
    default:
      return { opacity: 1, transform: 'none' };
  }
};

/**
 * HeroTextEntranceExit Component
 * 
 * @param {Object} props
 * @param {Object} props.config - JSON configuration
 * @param {string} props.config.text - Text content (required)
 * @param {string} props.config.heroType - Hero type: 'image' | 'lottie' | 'svg' (required)
 * @param {string} props.config.heroRef - Hero asset path/reference (required)
 * @param {string} props.config.animationEntrance - Entrance animation type (optional)
 * @param {string} props.config.animationExit - Exit animation type (optional)
 * @param {Object} props.config.beats - Beat timings
 * @param {number} props.config.beats.entrance - Entrance beat in seconds (required)
 * @param {number} props.config.beats.exit - Exit beat in seconds (required)
 * @param {Object} props.config.position - Optional position override (uses layout engine)
 * @param {Object} props.config.style - Optional style overrides
 */
export const HeroTextEntranceExit = ({ config, stylePreset }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  
  // Responsive sizing for mobile
  const isMobile = height > width;
  const {
    text,
    heroType = 'image',
    heroRef,
    animationEntrance = 'fadeIn',
    animationExit = 'fadeOut',
    beats = {},
    position,
    style = {},
  } = config;

  // Validate required fields - heroRef required, text optional if lottie provided
  if (!heroRef) {
    console.warn('HeroTextEntranceExit: Missing required field (heroRef)');
    return null;
  }

  const preset = resolveStylePreset(stylePreset);
  const heroBeats = resolveBeats(
    {
      start: beats.entrance ?? beats.start,
      exit: beats.exit,
    },
    {
      start: 1.0,
      holdDuration: (beats.exit ?? 4) - ((beats.entrance ?? beats.start) ?? 1),
    },
  );
  const entranceFrame = toFrames(heroBeats.start, fps);
  const exitFrame = toFrames(heroBeats.exit, fps);
  const animationDuration = 0.8; // Default animation duration in seconds
  const durationFrames = toFrames(animationDuration, fps);

  // Calculate entrance animation
  const entranceStyle = getAnimationStyle(
    animationEntrance,
    frame,
    entranceFrame,
    durationFrames,
    'up'
  );

  // Calculate exit animation
  const exitStyle = getAnimationStyle(
    animationExit,
    frame,
    exitFrame,
    durationFrames,
    'down'
  );

  // Combine entrance and exit animations
  // If before entrance, use entrance animation
  // If after exit, use exit animation
  // Otherwise, fully visible
  let combinedStyle = { opacity: 1, transform: 'none' };
  
  if (frame < entranceFrame + durationFrames) {
    // Still in entrance phase
    combinedStyle = entranceStyle;
  } else if (frame >= exitFrame) {
    // In exit phase
    combinedStyle = exitStyle;
  }

  // Hero configuration
  const heroConfig = {
    type: heroType,
    asset: heroRef,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      ...style.hero,
    },
  };

  // Hero animation (using heroRegistry's animation system)
  const heroTimelineBeats = { mapReveal: heroBeats.start };
  const heroAnimation = calculateHeroAnimation(
    frame,
    { animation: { entrance: animationEntrance, entranceBeat: 'mapReveal', entranceDuration: animationDuration } },
    heroTimelineBeats,
    null,
    fps
  );

  // Position handling - use layout engine if position provided, otherwise center
  // Use wrapper approach for proper centering with animations
  const wrapperStyle = position
    ? {
        ...positionToCSS(position),
      }
    : {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        maxWidth: 800,
      };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
    width: '100%',
    ...style.container,
  };

  return (
    <AbsoluteFill>
      <div style={wrapperStyle}>
        <div
          style={{
            ...containerStyle,
            opacity: combinedStyle.opacity,
            transform: combinedStyle.transform || 'none',
          }}
        >
        {/* Hero - responsive sizing */}
        <div
          style={{
            width: '100%',
            height: 'auto',
            minHeight: isMobile ? 400 : 300,
            maxHeight: isMobile ? 800 : 500,
            aspectRatio: '1 / 1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: heroAnimation.opacity,
            transform: heroAnimation.transform,
            ...style.heroContainer,
          }}
        >
          {renderHero(heroConfig, frame, heroTimelineBeats, KNODE_THEME.colors, null, fps)}
        </div>

        {/* Text - BOOSTED sizing (only render if text provided) */}
        {text && (
          <Text
            text={text}
            variant={preset.textVariant}
            size="xl"
            weight="bold"
            color={preset.textColor}
            style={{
              textAlign: 'center',
              fontSize: isMobile ? 72 : 64, // Explicit larger size
              ...style.text,
            }}
          />
        )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default HeroTextEntranceExit;
