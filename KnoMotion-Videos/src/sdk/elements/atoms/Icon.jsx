import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { KNODE_THEME } from '../../theme/knodeTheme';
import { scaleIn, getContinuousRotation } from '../../animations';
import { AnimatedEmojiLottie } from './AnimatedEmojiLottie';

/**
 * Icon - Atomic element for icons/emojis
 * 
 * Supports:
 * - Emoji characters (renders as AnimatedEmojiLottie when animated=true)
 * - React elements (renders as-is)
 * - Any other string (renders as text)
 * 
 * @param {object} props
 * @param {string} props.iconRef - Icon content (emoji, SVG, etc.) (STANDARDIZED)
 * @param {string} props.size - 'sm'|'md'|'lg'|'xl'
 * @param {string} props.color - Color from theme (optional)
 * @param {object} props.animation - Optional animation config
 * @param {boolean} props.spin - Whether icon should spin continuously
 * @param {boolean} props.animated - Whether to use animated emoji (default: false)
 * @param {object} props.style - Style overrides
 */

// Regex to detect emoji characters
const EMOJI_REGEX = /\p{Extended_Pictographic}/u;

export const Icon = ({ 
  iconRef, 
  size = 'md',
  color = null,
  animation = null,
  spin = false,
  animated = false,
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
  
  const pixelSize = sizes[size] || sizes.md;
  
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
  
  const renderContent = () => {
    // If it's already a React element, render it as-is
    if (React.isValidElement(iconRef)) {
      return iconRef;
    }

    if (typeof iconRef === 'string') {
      // Check if the string contains an emoji and animated is requested
      const containsEmoji = EMOJI_REGEX.test(iconRef);
      
      if (containsEmoji && animated) {
        // Use Lottie-based animated emoji from Google's CDN
        return (
          <AnimatedEmojiLottie
            emoji={iconRef}
            size={pixelSize}
            loop={true}
            playbackRate={1}
          />
        );
      }
      
      // Fallback: render the string as-is (static emoji or text)
      return iconRef;
    }

    return iconRef ?? null;
  };

  return (
    <div 
      className={`icon ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: pixelSize,
        lineHeight: 1,
        color: iconColor,
        ...animStyle,
        transform: `${animStyle.transform || ''} ${spinTransform}`.trim(),
        ...style,
      }}
      {...props}
    >
      {renderContent()}
    </div>
  );
};
