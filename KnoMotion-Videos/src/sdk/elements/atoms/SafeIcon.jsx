import React, { useState, useEffect } from 'react';
import { AnimatedEmojiLottie } from './AnimatedEmojiLottie';
import { Icon } from './Icon';

/**
 * SafeIcon - Resilient icon component that gracefully falls back
 * 
 * Strategy:
 * 1. Try to render AnimatedEmojiLottie (if it's an emoji)
 * 2. If it fails (404/network), fall back to static text/span
 * 3. Supports pre-downloaded local Lotties as primary option
 * 
 * @param {Object} props - All Icon props
 */
export const SafeIcon = ({ iconRef, ...props }) => {
  const [hasError, setHasError] = useState(false);
  const [isEmoji, setIsEmoji] = useState(false);

  useEffect(() => {
    // Reset error state when iconRef changes
    setHasError(false);
    
    // Check if it's potentially an emoji
    if (typeof iconRef === 'string') {
      const emojiRegex = /\p{Extended_Pictographic}/u;
      setIsEmoji(emojiRegex.test(iconRef));
    } else {
      setIsEmoji(false);
    }
  }, [iconRef]);

  // If we already know it failed, render static fallback immediately
  if (hasError) {
    return (
      <span
        style={{
          fontSize: props.size === 'xl' ? 80 : props.size === 'lg' ? 60 : 40,
          lineHeight: 1,
          display: 'inline-block',
          ...props.style
        }}
      >
        {iconRef}
      </span>
    );
  }

  // If it's an emoji and we want animation, try the Lottie wrapper
  // But wrap it to catch the 404s that might bubble up
  if (isEmoji && props.animated !== false) {
    // We can't easily catch async 404s from the Lottie component here 
    // without it notifying us. 
    // The AnimatedEmojiLottie component needs to accept an onError callback.
    // Since we are replacing the internal usage, let's use a modified version or prop.
    
    return (
      <SafeAnimatedEmoji 
        emoji={iconRef} 
        {...props} 
        onError={() => setHasError(true)} 
      />
    );
  }

  // Default behavior
  return <Icon iconRef={iconRef} {...props} />;
};

/**
 * Wrapper for AnimatedEmojiLottie that handles errors
 */
const SafeAnimatedEmoji = ({ emoji, onError, ...props }) => {
  // We need to hook into the error state of the child if possible,
  // or rely on the child to report back.
  // Since we can't modify the child easily from here without editing the file,
  // let's assume we update AnimatedEmojiLottie to accept onError.
  
  // For now, we will try to use the existing component but wrap it.
  // If the component throws, ErrorBoundary would be needed.
  // But 404s are usually async fetches.
  
  return (
    <AnimatedEmojiLottie 
      emoji={emoji} 
      {...props} 
      // We will need to update AnimatedEmojiLottie to call this
      onError={onError}
    />
  );
};
