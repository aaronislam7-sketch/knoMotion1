import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { KNODE_THEME } from '../../theme/knodeTheme';
import { fadeSlide, typewriter } from '../../animations';

/**
 * Text - Atomic element for themed text
 * 
 * @param {object} props
 * @param {string} props.text - Text content (STANDARDIZED)
 * @param {string} props.variant - 'display'|'title'|'body'|'accent'|'utility'
 * @param {string} props.size - 'xs'|'sm'|'md'|'lg'|'xl'
 * @param {string} props.weight - 'normal'|'medium'|'bold'
 * @param {string} props.color - Color from theme (default: textMain)
 * @param {object} props.animation - Optional animation config
 * @param {object} props.style - Style overrides
 */
export const Text = ({ 
  text, 
  variant = 'body',
  size = 'md',
  weight = 'normal',
  color = 'textMain',
  animation = null,
  style = {},
  className = '',
  ...props 
}) => {
  const theme = KNODE_THEME;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Animation support
  let animStyle = {};
  let content = text;
  
  if (animation) {
    const { type = 'fadeSlide', startFrame = 0, duration = 0.6, direction = 'up' } = animation;
    const durationFrames = Math.round(duration * fps);
    
    if (type === 'fadeSlide') {
      animStyle = fadeSlide(frame, startFrame, durationFrames, direction, 20);
    } else if (type === 'typewriter' && typeof text === 'string') {
      content = typewriter(frame, startFrame, durationFrames, text);
      animStyle = { opacity: 1 };
    }
  }
  
  // Font families
  const fontFamilies = {
    display: theme.fonts.marker,
    title: theme.fonts.header,
    body: theme.fonts.body,
    accent: theme.fonts.header,
    utility: 'Inter, sans-serif',
  };
  
  // Sizes - BOOSTED for better visibility
  // Reduced by 10% per request for better margins
  const sizes = {
    xs: 18, // was 20
    sm: 25, // was 28
    md: 32, // was 36
    lg: 43, // was 48
    xl: 57, // was 64
  };
  
  // Weights
  const weights = {
    normal: 400,
    medium: 600,
    bold: 700,
  };
  
  return (
    <div 
      className={className}
      style={{
        fontFamily: fontFamilies[variant],
        fontSize: sizes[size],
        fontWeight: weights[weight],
        color: theme.colors[color] || theme.colors.textMain,
        ...animStyle,
        ...style,
      }}
      {...props}
    >
      {content}
    </div>
  );
};
