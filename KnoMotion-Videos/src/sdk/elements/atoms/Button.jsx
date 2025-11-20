import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { KNODE_THEME } from '../../theme/knodeTheme';
import { scaleIn } from '../../animations';

/**
 * Button - Atomic element for button-like visual elements
 * NOTE: Not interactive - for visual display only (Remotion constraint)
 * 
 * @param {object} props
 * @param {React.ReactNode} props.children - Button text/content
 * @param {string} props.variant - 'default'|'primary'|'success'|'outline'
 * @param {string} props.size - 'sm'|'md'|'lg'
 * @param {object} props.animation - Optional animation config
 * @param {object} props.style - Style overrides
 */
export const Button = ({ 
  children, 
  variant = 'primary',
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
    const { type = 'scaleIn', startFrame = 0, duration = 0.5 } = animation;
    const durationFrames = Math.round(duration * fps);
    
    if (type === 'scaleIn') {
      animStyle = scaleIn(frame, startFrame, durationFrames, 0.9);
    }
  }
  
  // Size classes
  const sizeClasses = {
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
  };
  
  // Variant styles
  const variantStyles = {
    default: {
      backgroundColor: theme.colors.cardBg,
      color: theme.colors.textMain,
      border: `2px solid ${theme.colors.textMain}20`,
    },
    primary: {
      backgroundColor: theme.colors.primary,
      color: theme.colors.cardBg,
      border: 'none',
    },
    success: {
      backgroundColor: theme.colors.accentGreen,
      color: theme.colors.cardBg,
      border: 'none',
    },
    outline: {
      backgroundColor: 'transparent',
      color: theme.colors.primary,
      border: `2px solid ${theme.colors.primary}`,
    },
  };
  
  return (
    <div 
      className={`btn ${sizeClasses[size]} ${className}`}
      style={{
        ...variantStyles[variant],
        fontFamily: theme.fonts.body,
        fontWeight: 600,
        borderRadius: theme.radii.card,
        padding: size === 'sm' ? '8px 16px' : size === 'lg' ? '16px 32px' : '12px 24px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'default',  // Not interactive
        ...animStyle,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};
