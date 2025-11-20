import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { KNODE_THEME } from '../../theme/knodeTheme';
import { scaleIn, getContinuousRotation } from '../../animations';

/**
 * Icon - Atomic element for icons/emojis
 * 
 * @param {object} props
 * @param {string} props.iconRef - Icon content (emoji, SVG, etc.) (STANDARDIZED)
 * @param {string} props.size - 'sm'|'md'|'lg'|'xl'
 * @param {string} props.color - Color from theme (optional)
 * @param {object} props.animation - Optional animation config
 * @param {boolean} props.spin - Whether icon should spin continuously
 * @param {object} props.style - Style overrides
 */
export const Icon = ({ 
  iconRef, 
  size = 'md',
  color = null,
  animation = null,
  spin = false,
  style = {},
  className = '',
  ...props 
}) => {
  const theme = KNODE_THEME;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Sizes
  const sizes = {
    sm: 24,
    md: 40,
    lg: 60,
    xl: 80,
  };
  
  // Animation support
  let animStyle = {};
  if (animation) {
    const { type = 'scaleIn', startFrame = 0, duration = 0.5 } = animation;
    const durationFrames = Math.round(duration * fps);
    
    if (type === 'scaleIn') {
      animStyle = scaleIn(frame, startFrame, durationFrames, 0.3);
    }
  }
  
  // Continuous spin
  let spinTransform = '';
  if (spin) {
    const rotation = getContinuousRotation(frame, {
      startFrame: 0,
      frequency: 0.05,
      amplitude: 360,
      enabled: true,
    });
    spinTransform = `rotate(${rotation}deg)`;
  }
  
  const iconColor = color ? (theme.colors[color] || color) : 'inherit';
  
  return (
    <div 
      className={`icon ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: sizes[size],
        lineHeight: 1,
        color: iconColor,
        ...animStyle,
        transform: `${animStyle.transform || ''} ${spinTransform}`.trim(),
        ...style,
      }}
      {...props}
    >
      {iconRef}
    </div>
  );
};
