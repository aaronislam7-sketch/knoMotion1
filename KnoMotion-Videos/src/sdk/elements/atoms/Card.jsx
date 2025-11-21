import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { KNODE_THEME } from '../../theme/knodeTheme';
import { fadeSlide, scaleIn } from '../../animations';

/**
 * Card - Atomic element for container cards
 * Wraps DaisyUI card with KNODE_THEME styling
 * 
 * @param {object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.variant - 'default'|'bordered'|'glass'
 * @param {string} props.size - 'sm'|'md'|'lg'
 * @param {object} props.animation - Optional animation config { type, startFrame, duration }
 * @param {object} props.style - Style overrides
 */
export const Card = ({ 
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
    const { type = 'scaleIn', startFrame = 0, duration = 0.7, direction = 'up' } = animation;
    const durationFrames = Math.round(duration * fps);
    
    if (type === 'scaleIn') {
      animStyle = scaleIn(frame, startFrame, durationFrames, 0.8);
    } else if (type === 'fadeSlide') {
      animStyle = fadeSlide(frame, startFrame, durationFrames, direction, 40);
    }
  }
  
  // Size styles
  const sizeStyles = {
    sm: { padding: theme.spacing.cardPadding * 0.75 },
    md: { padding: theme.spacing.cardPadding },
    lg: { padding: theme.spacing.cardPadding * 1.5 },
  };
  
  // Variant styles
  const variantStyles = {
    default: {
      backgroundColor: theme.colors.cardBg,
      boxShadow: theme.shadows.card,
    },
    bordered: {
      backgroundColor: theme.colors.cardBg,
      border: `2px solid ${theme.colors.textMain}20`,
      boxShadow: 'none',
    },
    glass: {
      background: 'linear-gradient(145deg, rgba(255,255,255,0.98), rgba(255,244,230,0.98))',
      backdropFilter: 'blur(10px)',
      boxShadow: theme.shadows.soft,
    },
  };
  
  return (
    <div 
      className={`card ${className}`}
      style={{
        ...variantStyles[variant],
        ...sizeStyles[size],
        borderRadius: theme.radii.card,
        ...animStyle,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};
