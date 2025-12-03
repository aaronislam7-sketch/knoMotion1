import React from 'react';
import { AnimatedEmoji, getAvailableEmojis } from '@remotion/animated-emoji';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { KNODE_THEME } from '../../theme/knodeTheme';
import { scaleIn, getContinuousRotation } from '../../animations';

/**
 * Icon - Atomic element for icons/emojis
 * 
 * Supports:
 * - Emoji characters (renders as AnimatedEmoji when available)
 * - React elements (renders as-is)
 * - Any other string (renders as text)
 * 
 * @param {object} props
 * @param {string} props.iconRef - Icon content (emoji, SVG, etc.) (STANDARDIZED)
 * @param {string} props.size - 'sm'|'md'|'lg'|'xl'
 * @param {string} props.color - Color from theme (optional)
 * @param {object} props.animation - Optional animation config
 * @param {boolean} props.spin - Whether icon should spin continuously
 * @param {object} props.style - Style overrides
 */

// Regex to detect emoji characters
const EMOJI_REGEX = /\p{Extended_Pictographic}/u;

// Build a lookup map from available animated emojis
const animatedEmojiData = getAvailableEmojis();
const emojiAliasToName = new Map();

animatedEmojiData.forEach((entry) => {
  // Map by codepoint (lowercase)
  emojiAliasToName.set(entry.codepoint.toLowerCase(), entry.name);
  
  // Map by actual emoji character
  const char = entry.codepoint
    .split('_')
    .map((cp) => String.fromCodePoint(parseInt(cp, 16)))
    .join('');
  emojiAliasToName.set(char, entry.name);
  
  // Map by tags
  entry.tags.forEach((tag) => {
    emojiAliasToName.set(tag.toLowerCase(), entry.name);
  });
});

/**
 * Export available animated emojis for discoverability
 */
export const AVAILABLE_ANIMATED_EMOJIS = animatedEmojiData.map((e) => e.name);

/**
 * Convert an emoji character to its codepoint key format
 */
const toCodepointKey = (value) => {
  if (typeof value !== 'string') return null;
  const codepoints = Array.from(value)
    .map((char) => {
      const cp = char.codePointAt(0);
      return cp !== undefined ? cp.toString(16) : null;
    })
    .filter(Boolean);
  if (codepoints.length === 0) return null;
  return codepoints.join('_').toLowerCase();
};

/**
 * Resolve an emoji character or tag to its AnimatedEmoji name
 */
const resolveEmojiName = (value) => {
  if (!value) return null;
  const normalized = typeof value === 'string' ? value.trim() : '';
  
  // Direct lookup (by character or tag)
  if (emojiAliasToName.has(normalized)) {
    return emojiAliasToName.get(normalized);
  }
  
  // Lowercase tag lookup
  if (emojiAliasToName.has(normalized.toLowerCase())) {
    return emojiAliasToName.get(normalized.toLowerCase());
  }
  
  // Try by codepoint key
  const codepointKey = toCodepointKey(normalized);
  if (codepointKey && emojiAliasToName.has(codepointKey)) {
    return emojiAliasToName.get(codepointKey);
  }
  
  return null;
};

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
  
  const renderContent = () => {
    // If it's already a React element, render it as-is
    if (React.isValidElement(iconRef)) {
      return iconRef;
    }

    if (typeof iconRef === 'string') {
      // Check if the string contains an emoji
      const containsEmoji = EMOJI_REGEX.test(iconRef);
      
      if (containsEmoji) {
        // Try to resolve to an AnimatedEmoji name
        const emojiName = resolveEmojiName(iconRef);
        
        if (emojiName) {
          // Use AnimatedEmoji - the package handles asset loading and fallbacks
          return (
            <AnimatedEmoji
              emoji={emojiName}
              style={{ width: sizes[size], height: sizes[size] }}
            />
          );
        }
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
        fontSize: sizes[size],
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
