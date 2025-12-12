/**
 * AnimatedEmojiLottie - Animated emoji using Google's Lottie files
 * 
 * Uses Google Fonts' Lottie animations directly from their CDN.
 * This is more reliable than @remotion/animated-emoji which requires 
 * pre-downloaded video files.
 * 
 * @module elements/atoms/AnimatedEmojiLottie
 */

import React, { useEffect, useState, useRef } from 'react';
import { Lottie } from '@remotion/lottie';
import { useCurrentFrame, useVideoConfig, delayRender, continueRender } from 'remotion';

// Emoji character to codepoint mapping
const emojiToCodepoint = (emoji) => {
  if (!emoji || typeof emoji !== 'string') return null;
  
  const codepoints = [];
  for (const char of emoji) {
    const cp = char.codePointAt(0);
    if (cp !== undefined) {
      codepoints.push(cp.toString(16).toLowerCase());
    }
  }
  
  // Filter out variation selectors (fe0f)
  const filtered = codepoints.filter(cp => cp !== 'fe0f');
  return filtered.length > 0 ? filtered.join('_') : null;
};

// Cache for loaded Lottie data
const lottieCache = new Map();

/**
 * AnimatedEmojiLottie - Renders animated emoji using Google's Lottie CDN
 * 
 * @param {Object} props
 * @param {string} props.emoji - Emoji character (e.g., '🔥', '✨', '🧠')
 * @param {number} props.size - Size in pixels (default: 48)
 * @param {boolean} props.loop - Whether to loop (default: true)
 * @param {number} props.playbackRate - Playback speed (default: 1)
 * @param {Object} props.style - Additional styles
 */
export const AnimatedEmojiLottie = ({
  emoji,
  size = 48,
  loop = true,
  playbackRate = 1,
  style = {},
}) => {
  const [animationData, setAnimationData] = useState(() => {
    const codepoint = emojiToCodepoint(emoji);
    if (codepoint && lottieCache.has(codepoint)) {
      return lottieCache.get(codepoint);
    }
    return null;
  });
  const [error, setError] = useState(false);
  const delayHandleRef = useRef(null);

  useEffect(() => {
    if (animationData || error) return;

    const codepoint = emojiToCodepoint(emoji);
    if (!codepoint) {
      setError(true);
      if (props.onError) props.onError(new Error('Invalid emoji'));
      return;
    }

    // Check cache
    if (lottieCache.has(codepoint)) {
      setAnimationData(lottieCache.get(codepoint));
      return;
    }

    // Use delayRender for deterministic loading
    delayHandleRef.current = delayRender(`Loading emoji Lottie: ${emoji}`);

    const url = `https://fonts.gstatic.com/s/e/notoemoji/latest/${codepoint}/lottie.json`;
    
    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        lottieCache.set(codepoint, data);
        setAnimationData(data);
        if (delayHandleRef.current !== null) {
          continueRender(delayHandleRef.current);
          delayHandleRef.current = null;
        }
      })
      .catch((err) => {
        console.warn(`[AnimatedEmojiLottie] Failed to load ${emoji}:`, err);
        setError(true);
        if (delayHandleRef.current !== null) {
          continueRender(delayHandleRef.current);
          delayHandleRef.current = null;
        }
      });

    return () => {
      if (delayHandleRef.current !== null) {
        continueRender(delayHandleRef.current);
        delayHandleRef.current = null;
      }
    };
  }, [emoji, animationData, error]);

  // Fallback to static emoji on error or while loading
  if (error || !animationData) {
    return (
      <span
        style={{
          fontSize: size,
          lineHeight: 1,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: size,
          height: size,
          ...style,
        }}
      >
        {emoji}
      </span>
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      <Lottie
        animationData={animationData}
        loop={loop}
        playbackRate={playbackRate}
        style={{ width: size, height: size }}
      />
    </div>
  );
};

export default AnimatedEmojiLottie;
