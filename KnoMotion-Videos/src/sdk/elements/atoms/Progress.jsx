import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { KNODE_THEME } from '../../theme/knodeTheme';

/**
 * Progress - Atomic element for progress bars
 * Wraps DaisyUI progress with KNODE_THEME styling and animation
 * 
 * @param {object} props
 * @param {number} props.value - Progress value (0-100)
 * @param {string} props.variant - 'default'|'primary'|'success'|'warning'
 * @param {string} props.size - 'sm'|'md'|'lg'
 * @param {boolean} props.animated - Whether to animate from 0 to value
 * @param {number} props.animateStartFrame - When to start animation
 * @param {number} props.animateDuration - Animation duration in seconds
 * @param {object} props.style - Style overrides
 */
export const Progress = ({ 
  value = 0,
  variant = 'primary',
  size = 'md',
  animated = false,
  animateStartFrame = 0,
  animateDuration = 1.0,
  style = {},
  className = '',
  ...props 
}) => {
  const theme = KNODE_THEME;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Animated progress
  let currentValue = value;
  if (animated) {
    const endFrame = animateStartFrame + Math.round(animateDuration * fps);
    currentValue = interpolate(
      frame,
      [animateStartFrame, endFrame],
      [0, value],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
  }
  
  // Size classes
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6',
  };
  
  // Variant colors
  const variantColors = {
    default: theme.colors.textMain,
    primary: theme.colors.primary,
    success: theme.colors.accentGreen,
    warning: theme.colors.doodle,
  };
  
  return (
    <div 
      className={`relative w-full ${sizeClasses[size]} rounded-full overflow-hidden ${className}`}
      style={{
        backgroundColor: `${variantColors[variant]}20`,
        ...style,
      }}
      {...props}
    >
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{
          width: `${Math.min(Math.max(currentValue, 0), 100)}%`,
          backgroundColor: variantColors[variant],
        }}
      />
    </div>
  );
};
