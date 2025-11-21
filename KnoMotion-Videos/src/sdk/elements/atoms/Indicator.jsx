import React from 'react';
import { useCurrentFrame } from 'remotion';
import { KNODE_THEME } from '../../theme/knodeTheme';
import { pulse } from '../../animations';

/**
 * Indicator - Atomic element for notification dots/badges
 * 
 * @param {object} props
 * @param {string} props.variant - 'primary'|'success'|'warning'|'danger'
 * @param {string} props.size - 'sm'|'md'|'lg'
 * @param {boolean} props.pulse - Whether indicator should pulse
 * @param {string} props.position - 'top-right'|'top-left'|'bottom-right'|'bottom-left'
 * @param {object} props.style - Style overrides
 */
export const Indicator = ({ 
  variant = 'primary',
  size = 'md',
  pulse: shouldPulse = false,
  position = 'top-right',
  style = {},
  className = '',
  ...props 
}) => {
  const theme = KNODE_THEME;
  const frame = useCurrentFrame();
  
  // Sizes
  const sizes = {
    sm: 8,
    md: 12,
    lg: 16,
  };
  
  // Variant colors
  const variantColors = {
    primary: theme.colors.primary,
    success: theme.colors.accentGreen,
    warning: theme.colors.doodle,
    danger: '#E74C3C',
  };
  
  // Position styles
  const positions = {
    'top-right': { top: 0, right: 0 },
    'top-left': { top: 0, left: 0 },
    'bottom-right': { bottom: 0, right: 0 },
    'bottom-left': { bottom: 0, left: 0 },
  };
  
  // Pulse animation
  const pulseScale = shouldPulse ? pulse(frame, 0.2, 0.08) : 1;
  
  return (
    <div 
      className={`indicator ${className}`}
      style={{
        position: 'absolute',
        width: sizes[size],
        height: sizes[size],
        borderRadius: '50%',
        backgroundColor: variantColors[variant],
        border: `2px solid ${theme.colors.cardBg}`,
        transform: `scale(${pulseScale})`,
        ...positions[position],
        ...style,
      }}
      {...props}
    />
  );
};
