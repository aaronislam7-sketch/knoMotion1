/**
 * Motion Utilities for Human-Made Animations
 * 
 * Shared motion helpers that create intentional, crafted animations
 * with imperfections that feel hand-made rather than programmatic.
 */

import {spring, interpolate} from 'remotion';
import {easeOutSoft, easeOutBounce, easePencil, jitter, wobble} from './easing';

// ==================== ENTRANCE ANIMATIONS ====================

/**
 * Fade in with slight upward movement
 */
export const fadeInUp = (frame: number, fps: number, delay = 0, duration = 30) => {
  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: {damping: 15, stiffness: 100},
  });
  
  return {
    opacity: progress,
    transform: `translateY(${(1 - progress) * 30}px)`,
  };
};

/**
 * Scale in with bounce effect
 */
export const bounceIn = (frame: number, fps: number, delay = 0) => {
  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: {damping: 10, stiffness: 120},
  });
  
  return {
    opacity: Math.min(progress * 2, 1),
    transform: `scale(${progress})`,
  };
};

/**
 * Slide in from direction with overshoot
 */
export const slideIn = (
  frame: number, 
  fps: number, 
  delay = 0, 
  direction: 'left' | 'right' | 'up' | 'down' = 'left',
  distance = 100
) => {
  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: {damping: 12, stiffness: 100},
  });
  
  const transforms = {
    left: `translateX(${(1 - progress) * -distance}px)`,
    right: `translateX(${(1 - progress) * distance}px)`,
    up: `translateY(${(1 - progress) * -distance}px)`,
    down: `translateY(${(1 - progress) * distance}px)`,
  };
  
  return {
    opacity: progress,
    transform: transforms[direction],
  };
};

/**
 * Rotate in with elastic effect
 */
export const spinIn = (frame: number, fps: number, delay = 0) => {
  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: {damping: 8, stiffness: 120},
  });
  
  return {
    opacity: progress,
    transform: `rotate(${(1 - progress) * 360}deg) scale(${progress})`,
  };
};

// ==================== CONTINUOUS ANIMATIONS ====================

/**
 * Gentle pulsing/breathing effect
 */
export const pulse = (frame: number, speed = 0.08, amount = 0.05) => {
  const scale = 1 + Math.sin(frame * speed) * amount;
  return {
    transform: `scale(${scale})`,
  };
};

/**
 * Floating/hovering motion
 */
export const float = (frame: number, seed = 0, amount = 5) => {
  const y = Math.sin(frame * 0.05 + seed) * amount;
  return {
    transform: `translateY(${y}px)`,
  };
};

/**
 * Gentle rotation oscillation
 */
export const sway = (frame: number, seed = 0, degrees = 3) => {
  const rotation = Math.sin(frame * 0.04 + seed) * degrees;
  return {
    transform: `rotate(${rotation}deg)`,
  };
};

/**
 * Gentle pulse effect (replaces jitter/wobble for clean rendering)
 */
export const handDrawnWobble = (frame: number, seed = 0) => {
  // Completely replaced jitter/wobble with clean pulse
  // Very subtle scale for smooth, professional look
  const scale = 1 + Math.sin((frame + seed) * 0.03) * 0.01;
  
  return {
    transform: `scale(${scale})`,
  };
};

// ==================== ATTENTION & EMPHASIS ====================

/**
 * Quick bounce to draw attention
 */
export const bounce = (frame: number, fps: number, triggerFrame: number) => {
  if (frame < triggerFrame) return {transform: 'scale(1)'};
  
  const progress = spring({
    frame: frame - triggerFrame,
    fps,
    config: {damping: 8, stiffness: 200},
  });
  
  const scale = 1 + interpolate(progress, [0, 1], [0.3, 0]);
  return {transform: `scale(${scale})`};
};

/**
 * Shake to indicate error or emphasis
 */
export const shake = (frame: number, fps: number, triggerFrame: number, duration = 20) => {
  if (frame < triggerFrame || frame > triggerFrame + duration) {
    return {transform: 'translateX(0)'};
  }
  
  const progress = (frame - triggerFrame) / duration;
  const intensity = Math.sin(progress * Math.PI); // Peak in middle
  const offset = Math.sin((frame - triggerFrame) * 1.5) * 10 * intensity;
  
  return {transform: `translateX(${offset}px)`};
};

/**
 * Highlight flash effect
 */
export const flash = (frame: number, fps: number, triggerFrame: number, duration = 15) => {
  if (frame < triggerFrame || frame > triggerFrame + duration) {
    return {opacity: 0};
  }
  
  const progress = (frame - triggerFrame) / duration;
  const opacity = Math.sin(progress * Math.PI) * 0.6;
  
  return {opacity};
};

// ==================== DRAWING & WRITING ====================

/**
 * Line drawing progress
 */
export const drawLine = (frame: number, fps: number, delay = 0, duration = 30) => {
  const progress = interpolate(
    frame,
    [delay, delay + duration],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );
  
  return {
    scaleX: progress,
    transformOrigin: 'left center',
  };
};

/**
 * SVG path drawing
 */
export const drawPath = (frame: number, fps: number, delay = 0) => {
  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: {damping: 200, stiffness: 120},
  });
  
  return {
    strokeDashoffset: interpolate(progress, [0, 1], [1, 0]),
    opacity: progress,
  };
};

/**
 * Typewriter character reveal
 */
export const typewriter = (
  frame: number, 
  fps: number, 
  delay = 0, 
  textLength: number,
  charsPerSecond = 10
) => {
  const framesPerChar = fps / charsPerSecond;
  const elapsed = Math.max(0, frame - delay);
  const visibleChars = Math.floor(elapsed / framesPerChar);
  
  return {
    visibleChars: Math.min(visibleChars, textLength),
    progress: Math.min(visibleChars / textLength, 1),
  };
};

// ==================== STAGGER & SEQUENCE ====================

/**
 * Staggered entrance for lists
 */
export const staggerIn = (
  frame: number,
  fps: number,
  index: number,
  baseDelay = 0,
  staggerDelay = 10
) => {
  const itemDelay = baseDelay + index * staggerDelay;
  return fadeInUp(frame, fps, itemDelay);
};

/**
 * Wave effect through items
 */
export const wave = (
  frame: number,
  index: number,
  totalItems: number,
  amplitude = 10,
  frequency = 0.1
) => {
  const offset = Math.sin((frame * frequency) + (index / totalItems) * Math.PI * 2) * amplitude;
  return {
    transform: `translateY(${offset}px)`,
  };
};

// ==================== TRANSITIONS ====================

/**
 * Wipe transition
 */
export const wipe = (
  frame: number,
  fps: number,
  startFrame: number,
  duration = 30,
  direction: 'left' | 'right' | 'up' | 'down' = 'right'
) => {
  if (frame < startFrame) return {clipPath: 'inset(0 0 0 0)'};
  if (frame > startFrame + duration) return {clipPath: 'inset(0 0 0 100%)'};
  
  const progress = (frame - startFrame) / duration;
  
  const clips = {
    left: `inset(0 0 0 ${progress * 100}%)`,
    right: `inset(0 ${progress * 100}% 0 0)`,
    up: `inset(0 0 ${progress * 100}% 0)`,
    down: `inset(${progress * 100}% 0 0 0)`,
  };
  
  return {clipPath: clips[direction]};
};

/**
 * Eraser wipe (like whiteboard eraser)
 */
export const eraserWipe = (
  frame: number,
  fps: number,
  startFrame: number,
  duration = 30
) => {
  if (frame < startFrame) return {opacity: 1, filter: 'blur(0px)'};
  if (frame > startFrame + duration) return {opacity: 0, filter: 'blur(10px)'};
  
  const progress = (frame - startFrame) / duration;
  
  return {
    opacity: 1 - progress,
    filter: `blur(${progress * 10}px)`,
    transform: `scaleY(${1 - progress * 0.3})`,
  };
};

// ==================== IMPERFECTION LAYER ====================

/**
 * Add subtle animation to any style (jitter/wobble removed)
 */
export const addImperfection = (
  baseStyle: Record<string, any>,
  frame: number,
  seed = 0,
  amount = 0.12
) => {
  if (amount === 0) return baseStyle;
  
  // Replaced jitter/wobble with clean pulse effect
  const scale = 1 + Math.sin((frame + seed) * 0.03) * (0.01 * amount);
  
  // Combine base transform with pulse
  const baseTransform = baseStyle.transform || '';
  const enhancedTransform = baseTransform ? `${baseTransform} scale(${scale})` : `scale(${scale})`;
  
  return {
    ...baseStyle,
    transform: enhancedTransform,
  };
};

/**
 * Get paper texture overlay style
 */
export const paperTexture = (opacity = 0.3) => ({
  position: 'absolute' as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'0.05\'/%3E%3C/svg%3E")',
  opacity,
  pointerEvents: 'none' as const,
});

/**
 * Get chalk dust effect style
 */
export const chalkDust = (frame: number, opacity = 0.15) => {
  const offset = Math.sin(frame * 0.05) * 5;
  return {
    position: 'absolute' as const,
    inset: -10,
    background: 'radial-gradient(circle, transparent 30%, rgba(255, 255, 255, 0.1) 70%)',
    opacity,
    transform: `translateY(${offset}px)`,
    pointerEvents: 'none' as const,
  };
};
