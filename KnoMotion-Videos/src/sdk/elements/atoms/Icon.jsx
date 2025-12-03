import React from 'react';
import { AnimatedEmoji, getAvailableEmojis } from '@remotion/animated-emoji';
import { getStaticFiles, useCurrentFrame, useVideoConfig } from 'remotion';
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
const EMOJI_REGEX = /\p{Extended_Pictographic}/u;
const animatedEmojiData = getAvailableEmojis();
const emojiAliasToName = new Map();
animatedEmojiData.forEach((entry) => {
  emojiAliasToName.set(entry.codepoint.toLowerCase(), entry.name);
  const char = entry.codepoint
    .split('_')
    .map((cp) => String.fromCodePoint(parseInt(cp, 16)))
    .join('');
  emojiAliasToName.set(char, entry.name);
  entry.tags.forEach((tag) => {
    emojiAliasToName.set(tag, entry.name);
  });
});
const animatedEmojiAssetCache = new Map();

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

const resolveEmojiName = (value) => {
  if (!value) return null;
  const normalized = typeof value === 'string' ? value.trim() : '';
  if (emojiAliasToName.has(normalized)) {
    return emojiAliasToName.get(normalized);
  }
  const codepointKey = toCodepointKey(normalized);
  if (codepointKey && emojiAliasToName.has(codepointKey)) {
    return emojiAliasToName.get(codepointKey);
  }
  return null;
};

const hasAnimatedEmojiAsset = (emojiName, scale = '1') => {
  const cacheKey = `${emojiName}-${scale}`;
  if (animatedEmojiAssetCache.has(cacheKey)) {
    return animatedEmojiAssetCache.get(cacheKey);
  }

  if (typeof window === 'undefined') {
    animatedEmojiAssetCache.set(cacheKey, false);
    return false;
  }

  const staticFiles = getStaticFiles?.();
  if (!staticFiles || staticFiles.length === 0) {
    animatedEmojiAssetCache.set(cacheKey, false);
    return false;
  }

  const webmName = `${emojiName}-${scale}x.webm`;
  const mp4Name = `${emojiName}-${scale}x.mp4`;
  const exists = staticFiles.some(
    (file) => file.name.endsWith(webmName) || file.name.endsWith(mp4Name),
  );
  animatedEmojiAssetCache.set(cacheKey, exists);
  return exists;
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
    if (React.isValidElement(iconRef)) {
      return iconRef;
    }

    if (typeof iconRef === 'string') {
      const containsEmoji = EMOJI_REGEX.test(iconRef);
      if (containsEmoji) {
        const emojiName = resolveEmojiName(iconRef);
        if (emojiName && hasAnimatedEmojiAsset(emojiName)) {
          return (
            <AnimatedEmoji
              emoji={emojiName}
              style={{ width: sizes[size], height: sizes[size] }}
              layout="none"
            />
          );
        }
      }
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
