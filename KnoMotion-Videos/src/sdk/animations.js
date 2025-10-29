import { interpolate, spring } from 'remotion';

/**
 * Template SDK - Animation Utilities
 * Centralized animation helpers for all templates
 */

// Easing functions
export const EASING = {
  SMOOTH: [0.4, 0.0, 0.2, 1],
  BOUNCE: [0.68, -0.55, 0.265, 1.55],
  SPRING: [0.43, 0.13, 0.23, 0.96],
  ELASTIC: [0.68, -0.55, 0.265, 1.55],
  SHARP: [0.4, 0, 0.6, 1],
  EASE_IN_OUT: [0.42, 0, 0.58, 1],
  EASE_OUT: [0.0, 0.0, 0.2, 1],
  EASE_IN: [0.4, 0.0, 1, 1]
};

// Spring configurations
export const SPRING_CONFIGS = {
  gentle: { damping: 15, mass: 1, stiffness: 100 },
  smooth: { damping: 12, mass: 1, stiffness: 120 },
  bouncy: { damping: 8, mass: 1, stiffness: 150 },
  snappy: { damping: 20, mass: 0.8, stiffness: 180 },
  wobbly: { damping: 5, mass: 1, stiffness: 100 }
};

/**
 * Calculate animation progress based on timeline action
 */
export const getActionProgress = (frame, fps, action) => {
  if (!action) return 0;
  
  const startFrame = action.t * fps;
  const duration = (action.duration || 0.5) * fps;
  
  return interpolate(
    frame,
    [startFrame, startFrame + duration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
};

/**
 * Fade in animation
 */
export const fadeIn = (frame, startFrame, duration = 30, delay = 0) => {
  const progress = interpolate(
    frame,
    [startFrame + delay, startFrame + delay + duration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  
  return {
    opacity: progress,
    transform: `scale(${0.95 + progress * 0.05})`
  };
};

/**
 * Slide in from direction
 */
export const slideIn = (frame, startFrame, duration = 30, direction = 'left', distance = 50) => {
  const progress = interpolate(
    frame,
    [startFrame, startFrame + duration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  
  const translations = {
    left: `translateX(${(1 - progress) * distance}px)`,
    right: `translateX(${(1 - progress) * -distance}px)`,
    up: `translateY(${(1 - progress) * distance}px)`,
    down: `translateY(${(1 - progress) * -distance}px)`
  };
  
  return {
    opacity: progress,
    transform: translations[direction] || translations.left
  };
};

/**
 * Scale in animation
 */
export const scaleIn = (frame, startFrame, duration = 30, fromScale = 0.3) => {
  const progress = interpolate(
    frame,
    [startFrame, startFrame + duration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  
  return {
    opacity: progress,
    transform: `scale(${fromScale + (1 - fromScale) * progress})`
  };
};

/**
 * Spring-based animation
 */
export const springAnimation = (frame, fps, startFrame, config = 'smooth') => {
  const springConfig = SPRING_CONFIGS[config] || SPRING_CONFIGS.smooth;
  
  return spring({
    frame: frame - startFrame,
    fps,
    config: springConfig
  });
};

/**
 * Typewriter effect
 */
export const typewriter = (frame, startFrame, duration = 60, text = '') => {
  const progress = interpolate(
    frame,
    [startFrame, startFrame + duration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  
  const visibleChars = Math.floor(text.length * progress);
  return text.substring(0, visibleChars);
};

/**
 * Pulse animation (continuous)
 */
export const pulse = (frame, intensity = 0.1, speed = 0.1) => {
  return 1 + Math.sin(frame * speed) * intensity;
};

/**
 * Wave animation
 */
export const wave = (frame, amplitude = 10, frequency = 0.05, phase = 0) => {
  return Math.sin(frame * frequency + phase) * amplitude;
};

/**
 * Stagger animation for lists
 */
export const staggerIn = (frame, startFrame, itemIndex, staggerDelay = 5, duration = 30) => {
  const itemStartFrame = startFrame + (itemIndex * staggerDelay);
  return interpolate(
    frame,
    [itemStartFrame, itemStartFrame + duration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
};

/**
 * Draw line animation (for connectors)
 */
export const drawLine = (frame, startFrame, duration = 30) => {
  return interpolate(
    frame,
    [startFrame, startFrame + duration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
};

/**
 * Rotate animation
 */
export const rotate = (frame, startFrame, duration = 30, rotations = 1) => {
  const progress = interpolate(
    frame,
    [startFrame, startFrame + duration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  
  return progress * 360 * rotations;
};

/**
 * Bounce entrance
 */
export const bounceIn = (frame, startFrame, duration = 40) => {
  const progress = interpolate(
    frame,
    [startFrame, startFrame + duration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  
  // Elastic bounce effect
  const bounce = Math.pow(2, -10 * progress) * Math.sin((progress - 0.075) * (2 * Math.PI) / 0.3) + 1;
  
  return {
    opacity: progress,
    transform: `scale(${bounce})`
  };
};

/**
 * Path drawing animation (for SVG paths)
 */
export const drawPath = (frame, startFrame, duration = 60) => {
  const progress = interpolate(
    frame,
    [startFrame, startFrame + duration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  
  return {
    strokeDasharray: 1000,
    strokeDashoffset: 1000 * (1 - progress)
  };
};

/**
 * Fade and slide combination
 */
export const fadeSlide = (frame, startFrame, duration = 30, direction = 'up', distance = 30) => {
  const progress = interpolate(
    frame,
    [startFrame, startFrame + duration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  
  const offset = (1 - progress) * distance;
  const transforms = {
    up: `translateY(${offset}px)`,
    down: `translateY(-${offset}px)`,
    left: `translateX(${offset}px)`,
    right: `translateX(-${offset}px)`
  };
  
  return {
    opacity: progress,
    transform: transforms[direction]
  };
};
