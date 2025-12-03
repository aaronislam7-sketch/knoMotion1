import React from 'react';
import { AnimatedEmoji, getAvailableEmojis } from '@remotion/animated-emoji';
import { useCurrentFrame, useVideoConfig, staticFile } from 'remotion';
import { KNODE_THEME } from '../../theme/knodeTheme';
import { scaleIn, getContinuousRotation } from '../../animations';

/**
 * Icon - Atomic element for icons/emojis
 * 
 * Supports:
 * - Emoji characters (renders as AnimatedEmoji when available, with static fallback)
 * - React elements (renders as-is)
 * - Any other string (renders as text)
 * 
 * @param {object} props
 * @param {string} props.iconRef - Icon content (emoji, SVG, etc.) (STANDARDIZED)
 * @param {string} props.size - 'sm'|'md'|'lg'|'xl'
 * @param {string} props.color - Color from theme (optional)
 * @param {object} props.animation - Optional animation config
 * @param {boolean} props.spin - Whether icon should spin continuously
 * @param {boolean} props.animated - Whether to attempt animated emoji (default: false for reliability)
 * @param {object} props.style - Style overrides
 */

// Regex to detect emoji characters
const EMOJI_REGEX = /\p{Extended_Pictographic}/u;

// Build a lookup map from available animated emojis
const animatedEmojiData = getAvailableEmojis();
const emojiToNameMap = new Map();
const emojiNameSet = new Set();

animatedEmojiData.forEach((entry) => {
  emojiNameSet.add(entry.name);
  
  // Map by codepoint (lowercase)
  emojiToNameMap.set(entry.codepoint.toLowerCase(), entry.name);
  
  // Map by actual emoji character
  try {
    const char = entry.codepoint
      .split('_')
      .map((cp) => String.fromCodePoint(parseInt(cp, 16)))
      .join('');
    emojiToNameMap.set(char, entry.name);
  } catch (e) {
    // Some codepoints might not convert properly
  }
  
  // Map by tags
  entry.tags.forEach((tag) => {
    const cleanTag = tag.replace(/:/g, '').toLowerCase();
    emojiToNameMap.set(cleanTag, entry.name);
  });
});

/**
 * Export available animated emojis for discoverability
 */
export const AVAILABLE_ANIMATED_EMOJIS = Array.from(emojiNameSet);

/**
 * Convert an emoji character to its codepoint key format
 */
const toCodepointKey = (value) => {
  if (typeof value !== 'string') return null;
  const codepoints = [];
  for (const char of value) {
    const cp = char.codePointAt(0);
    if (cp !== undefined) {
      codepoints.push(cp.toString(16).toLowerCase());
    }
  }
  if (codepoints.length === 0) return null;
  return codepoints.join('_');
};

/**
 * Resolve an emoji character or tag to its AnimatedEmoji name
 * Returns null if no match found
 */
const resolveEmojiName = (value) => {
  if (!value || typeof value !== 'string') return null;
  const normalized = value.trim();
  
  // Direct match (emoji character)
  if (emojiToNameMap.has(normalized)) {
    return emojiToNameMap.get(normalized);
  }
  
  // Try by codepoint key
  const codepointKey = toCodepointKey(normalized);
  if (codepointKey && emojiToNameMap.has(codepointKey)) {
    return emojiToNameMap.get(codepointKey);
  }
  
  // Check if it's already an emoji name
  if (emojiNameSet.has(normalized)) {
    return normalized;
  }
  
  // Lowercase match
  const lower = normalized.toLowerCase();
  if (emojiToNameMap.has(lower)) {
    return emojiToNameMap.get(lower);
  }
  
  return null;
};

/**
 * Custom calculateSrc that uses local staticFile
 * Assets should be downloaded to public/ folder using scripts/download-animated-emojis.sh
 */
const localCalculateSrc = ({ emoji, scale, format }) => {
  const extension = format === 'hevc' ? 'mp4' : 'webm';
  return staticFile(`${emoji}-${scale}x.${extension}`);
};

export const Icon = ({ 
  iconRef, 
  size = 'md',
  color = null,
  animation = null,
  spin = false,
  animated = false, // Disabled by default for reliability - enable when assets are available
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
      
      if (containsEmoji && animated) {
        // Try to resolve to an AnimatedEmoji name
        const emojiName = resolveEmojiName(iconRef);
        
        if (emojiName) {
          // Use AnimatedEmoji with local assets
          // Run scripts/download-animated-emojis.sh to download required assets
          return (
            <AnimatedEmoji
              emoji={emojiName}
              calculateSrc={localCalculateSrc}
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
