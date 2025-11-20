import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { KNODE_THEME } from '../../theme/knodeTheme';
import { fadeSlide } from '../../animations';

/**
 * Badge - Atomic element for labels/tags
 * Wraps DaisyUI badge with KNODE_THEME styling
 * 
 * @param {object} props
 * @param {React.ReactNode} props.children - Badge text/content
 * @param {string} props.variant - 'default'|'primary'|'success'|'warning'|'danger'
 * @param {string} props.size - 'sm'|'md'|'lg'
 * @param {object} props.animation - Optional animation config { type, startFrame, duration }
 * @param {object} props.style - Style overrides
 */
export const Badge = ({ 
  children, 
  variant = 'default',
  size = 'md',
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
  if (animation) {
    const { type = 'fadeSlide', startFrame = 0, duration = 0.6, direction = 'up' } = animation;
    const durationFrames = Math.round(duration * fps);
    
    if (type === 'fadeSlide') {
      animStyle = fadeSlide(frame, startFrame, durationFrames, direction, 30);
    }
  }
  
  // Size classes
  const sizeClasses = {
    sm: 'badge-sm',
    md: 'badge-md',
    lg: 'badge-lg',
  };
  
  // Variant colors (override DaisyUI with KNODE_THEME)
  const variantColors = {
    default: {
      backgroundColor: theme.colors.textMain,
      color: theme.colors.cardBg,
    },
    primary: {
      backgroundColor: theme.colors.primary,
      color: theme.colors.cardBg,
    },
    success: {
      backgroundColor: theme.colors.accentGreen,
      color: theme.colors.cardBg,
    },
    warning: {
      backgroundColor: theme.colors.doodle,
      color: theme.colors.textMain,
    },
    danger: {
      backgroundColor: '#E74C3C',
      color: theme.colors.cardBg,
    },
  };
  
  return (
    <div 
      className={`badge ${sizeClasses[size]} ${className}`}
      style={{
        ...variantColors[variant],
        fontFamily: theme.fonts.body,
        ...animStyle,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};
