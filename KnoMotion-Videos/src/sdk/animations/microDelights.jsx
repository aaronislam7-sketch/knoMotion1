/**
 * Micro-Delights Utility Library
 * 
 * Combines existing SDK utilities into easy-to-use patterns for templates.
 * All effects are configurable via JSON (no hardcoded values).
 * 
 * Uses existing SDK:
 * - broadcastEffects.tsx (GlassmorphicPane, SpotlightEffect, FloatingParticles)
 * - lottieIntegration.tsx (RemotionLottie, AnimatedLottie, LottieIcon)
 * - lottieLibrary.js (inline Lottie animations)
 * - motion.ts (fadeInUp, bounceIn, pulse, shake)
 * - presets.jsx (fadeUpIn, slideInLeft, popInSpring, pulseEmphasis)
 */

import React from 'react';
import { interpolate } from 'remotion';
import { EZ, toFrames } from '../index';

// ==================== PARTICLE BURSTS ====================

/**
 * Configuration for particle burst effect
 * All configurable via JSON
 * 
 * @param frame - Current frame
 * @param config - { triggerFrame, particleCount, duration, color, size, spread }
 * @param fps - Frames per second
 * @returns Array of particle objects with positions and opacities
 */
export const getParticleBurst = (frame, config, fps) => {
  const {
    triggerFrame = 0,
    particleCount = 12,
    duration = 1.0,
    color = '#FFD700',
    size = 6,
    spread = 100
  } = config;
  
  const startFrame = toFrames(triggerFrame, fps);
  const endFrame = toFrames(triggerFrame + duration, fps);
  
  if (frame < startFrame || frame > endFrame) {
    return [];
  }
  
  const progress = interpolate(
    frame,
    [startFrame, endFrame],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.power2Out }
  );
  
  return Array.from({ length: particleCount }, (_, i) => {
    const angle = (i / particleCount) * Math.PI * 2;
    const distance = progress * spread;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    const opacity = interpolate(progress, [0, 0.3, 1], [0, 1, 0]);
    const scale = interpolate(progress, [0, 0.2, 1], [1, 1.2, 0.5]);
    
    return {
      x,
      y,
      opacity,
      scale,
      size,
      color,
      rotation: angle * (180 / Math.PI)
    };
  });
};

/**
 * Render particle burst (JSX helper)
 */
export const renderParticleBurst = (particles, centerX, centerY) => {
  return particles.map((particle, i) => (
    <div
      key={`particle-${i}`}
      style={{
        position: 'absolute',
        left: centerX + particle.x,
        top: centerY + particle.y,
        width: particle.size,
        height: particle.size,
        backgroundColor: particle.color,
        borderRadius: '50%',
        opacity: particle.opacity,
        transform: `scale(${particle.scale}) rotate(${particle.rotation}deg)`,
        pointerEvents: 'none'
      }}
    />
  ));
};

// ==================== GLOW EFFECTS ====================

/**
 * Pulsing glow effect configuration
 * 
 * @param frame - Current frame
 * @param config - { frequency, intensity, color, startFrame }
 * @returns Style object with box-shadow
 */
export const getPulseGlow = (frame, config) => {
  const {
    frequency = 0.05,
    intensity = 20,
    color = 'rgba(255, 215, 0, 0.6)',
    startFrame = 0
  } = config;
  
  if (frame < startFrame) {
    return { boxShadow: 'none' };
  }
  
  const pulse = Math.sin((frame - startFrame) * frequency) * 0.5 + 0.5;
  const blur = 10 + pulse * intensity;
  const spread = 2 + pulse * 8;
  
  return {
    boxShadow: `0 0 ${blur}px ${spread}px ${color}`
  };
};

/**
 * Spotlight glow that follows element
 * 
 * @param config - { opacity, size, color }
 * @returns Style object for spotlight
 */
export const getSpotlightStyle = (config) => {
  const {
    opacity = 0.3,
    size = 400,
    color = '#ffffff'
  } = config;
  
  return {
    position: 'absolute',
    width: size,
    height: size,
    background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
    opacity,
    filter: 'blur(60px)',
    pointerEvents: 'none',
    zIndex: 0
  };
};

// ==================== TEXT REVEALS ====================

/**
 * Letter-by-letter reveal animation
 * 
 * @param frame - Current frame
 * @param text - Full text string
 * @param config - { startFrame, duration, staggerDelay }
 * @param fps - Frames per second
 * @returns Object with visibleText and per-letter opacities
 */
export const getLetterReveal = (frame, text, config, fps) => {
  const {
    startFrame = 0,
    duration = 1.0,
    staggerDelay = 0.03
  } = config;
  
  const letters = text.split('');
  const letterOpacities = letters.map((_, index) => {
    const letterStart = toFrames(startFrame + index * staggerDelay, fps);
    const letterEnd = toFrames(startFrame + index * staggerDelay + duration, fps);
    
    return interpolate(
      frame,
      [letterStart, letterEnd],
      [0, 1],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.power2Out }
    );
  });
  
  return {
    letters,
    letterOpacities,
    isComplete: letterOpacities.every(o => o === 1)
  };
};

/**
 * Render letter-by-letter reveal (JSX helper)
 */
export const renderLetterReveal = (letters, letterOpacities, style = {}) => {
  return (
    <span style={{ ...style }}>
      {letters.map((letter, i) => (
        <span
          key={i}
          style={{
            opacity: letterOpacities[i],
            display: 'inline-block',
            transform: `translateY(${(1 - letterOpacities[i]) * 10}px)`
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </span>
      ))}
    </span>
  );
};

// ==================== SPRING BOUNCE ====================

/**
 * Spring bounce entrance configuration
 * 
 * @param frame - Current frame
 * @param config - { startFrame, damping, stiffness, mass }
 * @param fps - Frames per second
 * @returns Style object with scale and opacity
 */
export const getSpringBounce = (frame, config, fps) => {
  const {
    startFrame = 0,
    duration = 0.8,
    scaleFrom = 0.3,
    scaleTo = 1.0
  } = config;
  
  const start = toFrames(startFrame, fps);
  const end = toFrames(startFrame + duration, fps);
  
  if (frame < start) {
    return { opacity: 0, scale: scaleFrom };
  }
  
  if (frame >= end) {
    return { opacity: 1, scale: scaleTo };
  }
  
  const progress = interpolate(
    frame,
    [start, end],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.backOut }
  );
  
  return {
    opacity: progress,
    scale: scaleFrom + (scaleTo - scaleFrom) * progress
  };
};

// ==================== PATH DRAWING ====================

/**
 * Animated line/path drawing
 * 
 * @param frame - Current frame
 * @param config - { startFrame, duration, pathLength }
 * @param fps - Frames per second
 * @returns Object with strokeDasharray and strokeDashoffset
 */
export const getPathDraw = (frame, config, fps) => {
  const {
    startFrame = 0,
    duration = 1.0,
    pathLength = 100
  } = config;
  
  const start = toFrames(startFrame, fps);
  const end = toFrames(startFrame + duration, fps);
  
  const progress = interpolate(
    frame,
    [start, end],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.power2Out }
  );
  
  return {
    strokeDasharray: pathLength,
    strokeDashoffset: pathLength * (1 - progress)
  };
};

// ==================== SCALE EMPHASIS ====================

/**
 * Quick scale up and back for emphasis
 * 
 * @param frame - Current frame
 * @param config - { triggerFrame, duration, maxScale }
 * @param fps - Frames per second
 * @returns Style object with scale
 */
export const getScaleEmphasis = (frame, config, fps) => {
  const {
    triggerFrame = 0,
    duration = 0.4,
    maxScale = 1.1
  } = config;
  
  const start = toFrames(triggerFrame, fps);
  const mid = toFrames(triggerFrame + duration / 2, fps);
  const end = toFrames(triggerFrame + duration, fps);
  
  if (frame < start || frame > end) {
    return { scale: 1 };
  }
  
  if (frame < mid) {
    const scale = interpolate(
      frame,
      [start, mid],
      [1, maxScale],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.power2Out }
    );
    return { scale };
  }
  
  const scale = interpolate(
    frame,
    [mid, end],
    [maxScale, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.power2Out }
  );
  return { scale };
};

// ==================== SHAKE EFFECT ====================

/**
 * Shake animation for emphasis or error
 * 
 * @param frame - Current frame
 * @param config - { triggerFrame, duration, intensity }
 * @param fps - Frames per second
 * @returns Style object with translateX
 */
export const getShakeEffect = (frame, config, fps) => {
  const {
    triggerFrame = 0,
    duration = 0.3,
    intensity = 10
  } = config;
  
  const start = toFrames(triggerFrame, fps);
  const end = toFrames(triggerFrame + duration, fps);
  
  if (frame < start || frame > end) {
    return { translateX: 0 };
  }
  
  const progress = (frame - start) / (end - start);
  const decay = 1 - progress;
  const shake = Math.sin((frame - start) * 1.5) * intensity * decay;
  
  return { translateX: shake };
};

// ==================== STAGGER HELPER ====================

/**
 * Calculate stagger delays for list items
 * 
 * @param itemIndex - Index of item in list
 * @param config - { baseDelay, staggerDelay, maxStagger }
 * @returns Start time in seconds for this item
 */
export const getStaggerDelay = (itemIndex, config) => {
  const {
    baseDelay = 0,
    staggerDelay = 0.1,
    maxStagger = null
  } = config;
  
  const calculatedDelay = baseDelay + itemIndex * staggerDelay;
  
  if (maxStagger !== null) {
    return Math.min(calculatedDelay, baseDelay + maxStagger);
  }
  
  return calculatedDelay;
};

// ==================== COMBINED PRESET: CARD ENTRANCE ====================

/**
 * Complete card entrance with multiple effects
 * Combines: fade, slide, spring bounce, optional glow
 * 
 * @param frame - Current frame
 * @param config - { startFrame, direction, distance, glow }
 * @param fps - Frames per second
 * @returns Complete style object
 */
export const getCardEntrance = (frame, config, fps) => {
  const {
    startFrame = 0,
    duration = 0.8,
    direction = 'up',
    distance = 50,
    withGlow = false,
    glowColor = 'rgba(255, 107, 53, 0.3)'
  } = config;
  
  const start = toFrames(startFrame, fps);
  const end = toFrames(startFrame + duration, fps);
  
  if (frame < start) {
    return { opacity: 0, translateY: direction === 'up' ? distance : -distance, translateX: 0, scale: 0.95 };
  }
  
  if (frame >= end) {
    const glowStyle = withGlow ? { boxShadow: `0 4px 20px ${glowColor}` } : {};
    return { opacity: 1, translateY: 0, translateX: 0, scale: 1, ...glowStyle };
  }
  
  const progress = interpolate(
    frame,
    [start, end],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.backOut }
  );
  
  const directionMap = {
    up: { translateY: (1 - progress) * distance, translateX: 0 },
    down: { translateY: (1 - progress) * -distance, translateX: 0 },
    left: { translateY: 0, translateX: (1 - progress) * distance },
    right: { translateY: 0, translateX: (1 - progress) * -distance }
  };
  
  const glowStyle = withGlow ? { 
    boxShadow: `0 4px ${10 + progress * 10}px ${glowColor}` 
  } : {};
  
  return {
    opacity: progress,
    scale: 0.95 + progress * 0.05,
    ...directionMap[direction],
    ...glowStyle
  };
};

// ==================== COMBINED PRESET: ICON POP ====================

/**
 * Icon pop-in with optional Lottie trigger
 * 
 * @param frame - Current frame
 * @param config - { startFrame, rotation, withSpark }
 * @param fps - Frames per second
 * @returns Style object with transform
 */
export const getIconPop = (frame, config, fps) => {
  const {
    startFrame = 0,
    duration = 0.5,
    rotation = 0,
    withBounce = true
  } = config;
  
  const start = toFrames(startFrame, fps);
  const end = toFrames(startFrame + duration, fps);
  
  if (frame < start) {
    return { opacity: 0, scale: 0, rotation: 0 };
  }
  
  if (frame >= end) {
    return { opacity: 1, scale: 1, rotation };
  }
  
  const progress = interpolate(
    frame,
    [start, end],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: withBounce ? EZ.backOut : EZ.power3Out }
  );
  
  return {
    opacity: progress,
    scale: progress,
    rotation: rotation * progress
  };
};

// ==================== UTILITY: APPLY TRANSFORM STYLE ====================

/**
 * Convert transform values to CSS transform string
 * 
 * @param transforms - Object with translateX, translateY, scale, rotation
 * @returns CSS transform string
 */
export const buildTransform = (transforms) => {
  const {
    translateX = 0,
    translateY = 0,
    scale = 1,
    rotation = 0
  } = transforms;
  
  const parts = [];
  if (translateX !== 0 || translateY !== 0) {
    parts.push(`translate(${translateX}px, ${translateY}px)`);
  }
  if (scale !== 1) {
    parts.push(`scale(${scale})`);
  }
  if (rotation !== 0) {
    parts.push(`rotate(${rotation}deg)`);
  }
  
  return parts.length > 0 ? parts.join(' ') : 'none';
};

/**
 * Apply micro-delight transform to base style
 * 
 * @param baseStyle - Base style object
 * @param transforms - Transform values from micro-delight function
 * @returns Combined style object
 */
export const applyTransform = (baseStyle, transforms) => {
  return {
    ...baseStyle,
    transform: buildTransform(transforms),
    opacity: transforms.opacity !== undefined ? transforms.opacity : baseStyle.opacity
  };
};

// ==================== EXPORT ALL HELPERS ====================

export default {
  getParticleBurst,
  renderParticleBurst,
  getPulseGlow,
  getSpotlightStyle,
  getLetterReveal,
  renderLetterReveal,
  getSpringBounce,
  getPathDraw,
  getScaleEmphasis,
  getShakeEffect,
  getStaggerDelay,
  getCardEntrance,
  getIconPop,
  buildTransform,
  applyTransform
};
