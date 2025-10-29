/**
 * Animation Presets Library - Blueprint v5.0
 * 
 * 10 core "grab-and-go" animation presets for all templates.
 * All presets accept seconds in config, convert to frames internally.
 * Auto-clamping built-in for all animations.
 * 
 * Pattern A: Config-based (returns style object)
 * Pattern B: Returns raw values (for special cases)
 * Pattern C: Hooks (only when JSX/refs required)
 */

import React from 'react';
import { interpolate, spring, useVideoConfig } from 'remotion';
import { useId } from 'react';
import { toFrames } from './time';
import { getEasing } from './easing';

// ==================== ENTRANCES ====================

/**
 * Fade in with upward movement
 * 
 * @param frame - Current frame
 * @param config - { start, dur, dist, ease }
 * @param easingMap - EZ easing map
 * @param fps - Frames per second
 * @returns Style object with opacity and translateY
 */
export const fadeUpIn = (frame, config, easingMap, fps) => {
  const { start, dur, dist = 50, ease = 'smooth' } = config;
  const startFrame = toFrames(start, fps);
  const endFrame = toFrames(start + dur, fps);
  const easeFn = getEasing(ease);
  
  const opacity = interpolate(
    frame,
    [startFrame, endFrame],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeFn }
  );
  
  const translateY = interpolate(
    frame,
    [startFrame, endFrame],
    [dist, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeFn }
  );
  
  return { opacity, translateY };
};

/**
 * Slide in from left
 * 
 * @param frame - Current frame
 * @param config - { start, dur, dist, ease }
 * @param easingMap - EZ easing map
 * @param fps - Frames per second
 * @returns Style object with opacity and translateX
 */
export const slideInLeft = (frame, config, easingMap, fps) => {
  const { start, dur, dist = 100, ease = 'smooth' } = config;
  const startFrame = toFrames(start, fps);
  const endFrame = toFrames(start + dur, fps);
  const easeFn = getEasing(ease);
  
  const opacity = interpolate(
    frame,
    [startFrame, endFrame],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeFn }
  );
  
  const translateX = interpolate(
    frame,
    [startFrame, endFrame],
    [-dist, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeFn }
  );
  
  return { opacity, translateX };
};

/**
 * Slide in from right
 * 
 * @param frame - Current frame
 * @param config - { start, dur, dist, ease }
 * @param easingMap - EZ easing map
 * @param fps - Frames per second
 * @returns Style object with opacity and translateX
 */
export const slideInRight = (frame, config, easingMap, fps) => {
  const { start, dur, dist = 100, ease = 'smooth' } = config;
  const startFrame = toFrames(start, fps);
  const endFrame = toFrames(start + dur, fps);
  const easeFn = getEasing(ease);
  
  const opacity = interpolate(
    frame,
    [startFrame, endFrame],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeFn }
  );
  
  const translateX = interpolate(
    frame,
    [startFrame, endFrame],
    [dist, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeFn }
  );
  
  return { opacity, translateX };
};

/**
 * Pop in with spring physics
 * 
 * @param frame - Current frame
 * @param config - { start, mass, stiffness, damping }
 * @param easingMap - EZ easing map (not used, spring has own physics)
 * @param fps - Frames per second
 * @returns Style object with opacity and scale
 */
export const popInSpring = (frame, config, easingMap, fps) => {
  const { start, mass = 1, stiffness = 120, damping = 10 } = config;
  const startFrame = toFrames(start, fps);
  
  if (frame < startFrame) {
    return { opacity: 0, scale: 0.3 };
  }
  
  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: { mass, stiffness, damping }
  });
  
  return {
    opacity: Math.min(progress * 1.5, 1), // Fade in faster
    scale: 0.3 + progress * 0.7 // Scale from 0.3 to 1.0
  };
};

// ==================== EMPHASIS ====================

/**
 * Pulse for emphasis (scale up and back)
 * 
 * @param frame - Current frame
 * @param config - { start, dur, scale }
 * @param easingMap - EZ easing map
 * @param fps - Frames per second
 * @returns Style object with scale
 */
export const pulseEmphasis = (frame, config, easingMap, fps) => {
  const { start, dur = 0.5, scale: maxScale = 1.05, ease = 'backOut' } = config;
  const startFrame = toFrames(start, fps);
  const midFrame = toFrames(start + dur / 2, fps);
  const endFrame = toFrames(start + dur, fps);
  const easeFn = getEasing(ease);
  
  if (frame < startFrame || frame > endFrame) {
    return { scale: 1 };
  }
  
  // First half: scale up
  if (frame < midFrame) {
    const scale = interpolate(
      frame,
      [startFrame, midFrame],
      [1, maxScale],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeFn }
    );
    return { scale };
  }
  
  // Second half: scale back
  const scale = interpolate(
    frame,
    [midFrame, endFrame],
    [maxScale, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeFn }
  );
  
  return { scale };
};

/**
 * Looping breathe animation (subtle scale)
 * 
 * @param frame - Current frame
 * @param config - { start, loop (duration per cycle), amount }
 * @param easingMap - EZ easing map (not used, sine wave)
 * @param fps - Frames per second
 * @returns Style object with scale
 */
export const breathe = (frame, config, easingMap, fps) => {
  const { start = 0, loop = 3.0, amount = 0.02 } = config;
  const startFrame = toFrames(start, fps);
  
  if (frame < startFrame) {
    return { scale: 1 };
  }
  
  const loopFrames = toFrames(loop, fps);
  const elapsed = frame - startFrame;
  const progress = (elapsed % loopFrames) / loopFrames;
  
  // Sine wave for smooth breathing
  const scale = 1 + Math.sin(progress * Math.PI * 2) * amount;
  
  return { scale };
};

// ==================== EXITS ====================

/**
 * Fade out with downward movement
 * 
 * @param frame - Current frame
 * @param config - { start, dur, dist, ease }
 * @param easingMap - EZ easing map
 * @param fps - Frames per second
 * @returns Style object with opacity and translateY
 */
export const fadeDownOut = (frame, config, easingMap, fps) => {
  const { start, dur, dist = 50, ease = 'power3In' } = config;
  const startFrame = toFrames(start, fps);
  const endFrame = toFrames(start + dur, fps);
  const easeFn = getEasing(ease);
  
  const opacity = interpolate(
    frame,
    [startFrame, endFrame],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeFn }
  );
  
  const translateY = interpolate(
    frame,
    [startFrame, endFrame],
    [0, dist],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeFn }
  );
  
  return { opacity, translateY };
};

// ==================== COMPLEX ANIMATIONS ====================

/**
 * Draw on path animation (for SVG paths)
 * Returns raw values for strokeDasharray/offset
 * 
 * @param frame - Current frame
 * @param config - { start, dur, length, ease }
 * @param easingMap - EZ easing map
 * @param fps - Frames per second
 * @returns Object with strokeDasharray and strokeDashoffset
 */
export const drawOnPath = (frame, config, easingMap, fps) => {
  const { start, dur, length, ease = 'power3InOut' } = config;
  const startFrame = toFrames(start, fps);
  const endFrame = toFrames(start + dur, fps);
  const easeFn = getEasing(ease);
  
  const progress = interpolate(
    frame,
    [startFrame, endFrame],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeFn }
  );
  
  return {
    strokeDasharray: length,
    strokeDashoffset: length * (1 - progress)
  };
};

/**
 * Shrink and move to corner
 * 
 * @param frame - Current frame
 * @param config - { start, dur, targetScale, targetPos, ease }
 * @param easingMap - EZ easing map
 * @param fps - Frames per second
 * @returns Style object with scale, translateX, translateY
 */
export const shrinkToCorner = (frame, config, easingMap, fps) => {
  const { 
    start, 
    dur, 
    targetScale = 0.4, 
    targetPos = { x: 600, y: -300 },
    ease = 'power2InOut'
  } = config;
  const startFrame = toFrames(start, fps);
  const endFrame = toFrames(start + dur, fps);
  const easeFn = getEasing(ease);
  
  const scale = interpolate(
    frame,
    [startFrame, endFrame],
    [1, targetScale],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeFn }
  );
  
  const translateX = interpolate(
    frame,
    [startFrame, endFrame],
    [0, targetPos.x],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeFn }
  );
  
  const translateY = interpolate(
    frame,
    [startFrame, endFrame],
    [0, targetPos.y],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeFn }
  );
  
  return { scale, translateX, translateY };
};

/**
 * Highlight swipe effect (growing clipPath)
 * Hook that returns JSX with <defs> and style
 * 
 * @param frame - Current frame
 * @param config - { start, dur, rect, ease }
 * @param easingMap - EZ easing map
 * @param fps - Frames per second
 * @returns Object with { clipPathId, defsJSX, style, progress }
 */
export const useHighlightSwipe = (frame, config, easingMap, fps) => {
  const clipId = useId();
  const { 
    start, 
    dur, 
    rect = { x: 0, y: 0, width: 800, height: 80 },
    ease = 'smooth'
  } = config;
  const startFrame = toFrames(start, fps);
  const endFrame = toFrames(start + dur, fps);
  const easeFn = getEasing(ease);
  
  const progress = interpolate(
    frame,
    [startFrame, endFrame],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeFn }
  );
  
  const currentWidth = rect.width * progress;
  
  const defsJSX = (
    <clipPath id={clipId}>
      <rect 
        x={rect.x} 
        y={rect.y} 
        width={currentWidth} 
        height={rect.height} 
      />
    </clipPath>
  );
  
  return {
    clipPathId: clipId,
    defsJSX,
    style: { clipPath: `url(#${clipId})` },
    progress
  };
};

// ==================== PRESET REGISTRY ====================

/**
 * Registry of all available presets
 * Used for build-time validation and template requirements
 */
export const PRESET_REGISTRY = {
  // Entrances
  fadeUpIn,
  slideInLeft,
  slideInRight,
  popInSpring,
  
  // Emphasis
  pulseEmphasis,
  breathe,
  
  // Exits
  fadeDownOut,
  
  // Complex
  drawOnPath,
  shrinkToCorner,
  useHighlightSwipe,
};

/**
 * Get preset function by name
 * 
 * @param name - Preset name
 * @returns Preset function or null
 */
export const getPreset = (name) => {
  return PRESET_REGISTRY[name] || null;
};
