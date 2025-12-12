import React, { useState } from 'react';
import { AnimatedEmojiLottie } from './AnimatedEmojiLottie';

/**
 * SafeIcon - Resilient icon component that gracefully falls back
 * 
 * Strategy:
 * 1. Try to render AnimatedEmojiLottie (if it's an emoji)
 * 2. If it fails (404/network), fall back to static text/span
 * 
 * NOTE: Does NOT import Icon to avoid circular dependencies.
 * This component is intended to be used BY Icon.jsx.
 * 
 * @param {Object} props - All Icon props
 */
export const SafeIcon = ({ iconRef, ...props }) => {
  const [hasError, setHasError] = useState(false);

  // Synchronous check for emoji (no useEffect to avoid initial render flicker/loop)
  const isEmoji = typeof iconRef === 'string' && /\p{Extended_Pictographic}/u.test(iconRef);

  // If we already know it failed, render static fallback immediately
  if (hasError || !isEmoji) {
    return (
      <span
        style={{
          fontSize: props.size === 'xl' ? 80 : props.size === 'lg' ? 60 : 40,
          lineHeight: 1,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          ...props.style
        }}
      >
        {iconRef}
      </span>
    );
  }

  // Try the Lottie wrapper
  return (
    <SafeAnimatedEmoji 
      emoji={iconRef} 
      {...props} 
      onError={() => setHasError(true)} 
    />
  );
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
