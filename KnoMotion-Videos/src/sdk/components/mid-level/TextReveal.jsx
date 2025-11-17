import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

/**
 * MID-LEVEL COMPONENT: TextReveal - V7.0
 * 
 * PURPOSE: Text reveal animations (typewriter, fade-in, slide-in, etc.)
 * 
 * ACCEPTANCE CRITERIA:
 * ✅ Accepts text content and position from scene-shell
 * ✅ Supports multiple reveal types (typewriter, fadeIn, slideIn, scaleIn)
 * ✅ Handles multi-line text with proper line breaks
 * ✅ Uses theme/style tokens
 * ✅ Domain-agnostic (works with any text content)
 * ✅ Reusable across FullFrameScene, SplitLayoutScene, etc.
 * 
 * USAGE:
 * <TextReveal
 *   text="Hello World"
 *   position={{ x: 960, y: 540 }}
 *   style={{ colors: {...}, fonts: {...} }}
 *   animations={{ type: "typewriter", duration: 1.5 }}
 *   startFrame={60}
 *   fps={30}
 * />
 */

export const TextReveal = ({
  text = '',
  position = { x: 960, y: 540 },
  style = {},
  animations = {},
  startFrame = 0,
  alignment = 'center'  // 'center', 'left', 'right'
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const {
    colors = {
      text: '#FFFFFF',
      textSecondary: '#B0B0B0'
    },
    fonts = {
      size_title: 64,
      size_text: 28,
      weight_title: 800,
      weight_text: 700,
      family: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    }
  } = style;
  
  const {
    type = 'fadeIn',
    duration = 0.8,
    fontSize = null,
    fontWeight = null,
    color = null
  } = animations;
  
  const animDuration = duration * fps;
  
  // Animation helpers
  const fadeIn = (frame, startFrame, duration) => {
    const progress = interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    });
    return { opacity: progress };
  };
  
  const slideIn = (frame, startFrame, duration, direction = 'up', distance = 50) => {
    const progress = interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    });
    const translations = {
      left: `translateX(${(1 - progress) * distance}px)`,
      right: `translateX(${(1 - progress) * -distance}px)`,
      up: `translateY(${(1 - progress) * distance}px)`,
      down: `translateY(${(1 - progress) * -distance}px)`
    };
    return { opacity: progress, transform: translations[direction] || translations.up };
  };
  
  const scaleIn = (frame, startFrame, duration, fromScale = 0.7) => {
    const progress = interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    });
    return { opacity: progress, transform: `scale(${fromScale + (1 - fromScale) * progress})` };
  };
  
  // Typewriter effect
  const getTypewriterText = (frame, startFrame, duration, text) => {
    const progress = interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    });
    const charsToShow = Math.floor(progress * text.length);
    return text.substring(0, charsToShow);
  };
  
  // Get animation style
  let animStyle = {};
  let displayText = text;
  
  switch (type) {
    case 'typewriter':
      displayText = getTypewriterText(frame, startFrame, animDuration, text);
      animStyle = { opacity: 1 };
      break;
    case 'slideIn':
      animStyle = slideIn(frame, startFrame, animDuration, 'up', 60);
      break;
    case 'scaleIn':
      animStyle = scaleIn(frame, startFrame, animDuration, 0.8);
      break;
    case 'fadeIn':
    default:
      animStyle = fadeIn(frame, startFrame, animDuration);
      break;
  }
  
  // Calculate text alignment
  const textAlign = alignment === 'left' ? 'left' : alignment === 'right' ? 'right' : 'center';
  const transformX = alignment === 'left' ? '0' : alignment === 'right' ? '0' : '-50%';
  
  const finalFontSize = fontSize || fonts.size_text;
  const finalFontWeight = fontWeight || fonts.weight_text;
  const finalColor = color || colors.text;
  
  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        transform: `translateX(${transformX})`,
        ...animStyle,
        color: finalColor,
        fontSize: finalFontSize,
        fontWeight: finalFontWeight,
        fontFamily: fonts.family,
        textAlign,
        maxWidth: '90%',
        lineHeight: 1.4,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word'
      }}
    >
      {displayText}
      {type === 'typewriter' && frame < startFrame + animDuration && (
        <span style={{ opacity: 0.7 }}>|</span>
      )}
    </div>
  );
};

// Helper function to validate TextReveal config
export const validateTextRevealConfig = (config) => {
  const errors = [];
  const warnings = [];
  
  if (!config.text || config.text.trim().length === 0) {
    errors.push('TextReveal requires text content');
  }
  
  if (!config.position || typeof config.position.x !== 'number' || typeof config.position.y !== 'number') {
    errors.push('TextReveal requires valid position with x and y coordinates');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
};

export default TextReveal;
