/**
 * SDK ANIMATIONS - Consolidated Animation Utilities
 * 
 * Centralized animation helpers for all templates.
 * Merged from:
 * - animations.js (core animations)
 * - advancedEffects.jsx (advanced visual effects)
 * - continuousLife.js (continuous animations)
 * - microDelights.jsx (micro-interactions)
 * - sceneTransformation.jsx (scene transitions)
 * - broadcastAnimations.ts (broadcast-grade animations, converted to JS)
 */

import { interpolate, spring, Easing } from 'remotion';
import { EZ } from '../core/easing';
import { toFrames } from '../core/time';

// ==================== EASING & SPRING CONFIGS ====================

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

export const SPRING_CONFIGS = {
  gentle: { damping: 15, mass: 1, stiffness: 100 },
  smooth: { damping: 12, mass: 1, stiffness: 120 },
  bouncy: { damping: 8, mass: 1, stiffness: 150 },
  snappy: { damping: 20, mass: 0.8, stiffness: 180 },
  wobbly: { damping: 5, mass: 1, stiffness: 100 },
  // Broadcast-grade configs (from broadcastAnimations)
  broadcast: { damping: 200, mass: 1, stiffness: 100 }
};

// ==================== CORE ANIMATIONS (from animations.js) ====================

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

// ==================== CONTINUOUS LIFE ANIMATIONS (from continuousLife.js) ====================

/**
 * Get continuous breathing animation (subtle scale pulse)
 */
export const getContinuousBreathing = (frame, config) => {
  const {
    startFrame = 0,
    frequency = 0.03,
    amplitude = 0.03,
    phaseOffset = 0,
    enabled = true
  } = config;
  
  if (!enabled || frame < startFrame) {
    return 1.0;
  }
  
  const progress = frame - startFrame;
  const wave = Math.sin(progress * frequency + phaseOffset);
  const scaleVariation = (wave * amplitude) / 2;
  
  return 1.0 + Math.abs(scaleVariation);
};

/**
 * Get continuous floating animation (subtle Y position drift)
 */
export const getContinuousFloating = (frame, config) => {
  const {
    startFrame = 0,
    frequency = 0.02,
    amplitude = 5,
    phaseOffset = 0,
    enabled = true
  } = config;
  
  if (!enabled || frame < startFrame) {
    return 0;
  }
  
  const progress = frame - startFrame;
  const wave = Math.sin(progress * frequency + phaseOffset);
  
  return wave * amplitude;
};

/**
 * Get continuous subtle rotation (gentle wobble)
 */
export const getContinuousRotation = (frame, config) => {
  const {
    startFrame = 0,
    frequency = 0.025,
    amplitude = 3,
    phaseOffset = 0,
    enabled = true
  } = config;
  
  if (!enabled || frame < startFrame) {
    return 0;
  }
  
  const progress = frame - startFrame;
  const wave = Math.sin(progress * frequency + phaseOffset);
  
  return wave * amplitude;
};

/**
 * Get multi-property continuous life (breathing + floating combined)
 */
export const getContinuousLife = (frame, config) => {
  const {
    startFrame = 0,
    breathingFrequency = 0.03,
    breathingAmplitude = 0.03,
    floatingFrequency = 0.02,
    floatingAmplitude = 4,
    phaseOffset = 0,
    enabled = true
  } = config;
  
  const scale = getContinuousBreathing(frame, {
    startFrame,
    frequency: breathingFrequency,
    amplitude: breathingAmplitude,
    phaseOffset,
    enabled
  });
  
  const y = getContinuousFloating(frame, {
    startFrame,
    frequency: floatingFrequency,
    amplitude: floatingAmplitude,
    phaseOffset: phaseOffset + Math.PI / 4,
    enabled
  });
  
  return { scale, y };
};

// ==================== ADVANCED EFFECTS (from advancedEffects.jsx) ====================

/**
 * Animated glow effect
 */
export const getGlowEffect = (frame, config = {}) => {
  const {
    intensity = 10,
    color = '#FF6B35',
    pulse = false,
    pulseSpeed = 0.05,
  } = config;
  
  const baseIntensity = intensity;
  const currentIntensity = pulse
    ? baseIntensity + Math.sin(frame * pulseSpeed) * (baseIntensity * 0.3)
    : baseIntensity;
  
  return {
    filter: `drop-shadow(0 0 ${currentIntensity}px ${color})`,
    intensity: currentIntensity,
  };
};

/**
 * Morph between two shapes
 */
export const getMorphProgress = (frame, config, fps) => {
  const {
    start = 0,
    duration = 1.0,
    pathA,
    pathB,
    ease = 'smooth',
  } = config;
  
  const startFrame = Math.round(start * fps);
  const endFrame = Math.round((start + duration) * fps);
  
  if (frame < startFrame) return { progress: 0, path: pathA };
  if (frame >= endFrame) return { progress: 1, path: pathB };
  
  const easeFn = EZ[ease] || EZ.smooth;
  
  const progress = interpolate(
    frame,
    [startFrame, endFrame],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeFn }
  );
  
  return {
    progress,
    path: progress < 0.5 ? pathA : pathB,
  };
};

/**
 * Liquid blob animation
 */
export const getLiquidBlob = (frame, config = {}) => {
  const {
    centerX = 0,
    centerY = 0,
    baseRadius = 100,
    points = 8,
    wobbleAmount = 0.2,
    speed = 0.02,
    seed = 0,
  } = config;
  
  const pathPoints = [];
  
  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * Math.PI * 2;
    const wobble1 = Math.sin(frame * speed + angle * 3 + seed);
    const wobble2 = Math.cos(frame * speed * 0.7 + angle * 2 + seed * 1.3);
    const wobble = (wobble1 + wobble2) / 2;
    const radius = baseRadius + (baseRadius * wobbleAmount * wobble);
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    pathPoints.push({ x, y });
  }
  
  let path = `M ${pathPoints[0].x} ${pathPoints[0].y}`;
  for (let i = 1; i < pathPoints.length; i++) {
    const curr = pathPoints[i];
    const prev = pathPoints[i - 1];
    const controlX = (prev.x + curr.x) / 2;
    const controlY = (prev.y + curr.y) / 2;
    path += ` Q ${prev.x} ${prev.y} ${controlX} ${controlY}`;
  }
  path += ' Z';
  
  return { path, points: pathPoints };
};

// ==================== BROADCAST ANIMATIONS (from broadcastAnimations.ts, converted) ====================

/**
 * Smooth fade and scale entrance
 */
export const fadeInScale = (frame, fps, delay = 0, config = SPRING_CONFIGS.broadcast) => {
  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config,
  });

  return {
    opacity: progress,
    transform: `scale(${0.8 + progress * 0.2})`,
  };
};

/**
 * Slide in with overshoot
 */
export const slideInWithOvershoot = (frame, fps, from = 'bottom', delay = 0, distance = 100) => {
  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: SPRING_CONFIGS.bouncy,
  });

  const transforms = {
    left: `translateX(${(1 - progress) * -distance}px)`,
    right: `translateX(${(1 - progress) * distance}px)`,
    top: `translateY(${(1 - progress) * -distance}px)`,
    bottom: `translateY(${(1 - progress) * distance}px)`,
  };

  return {
    opacity: Math.min(progress * 1.5, 1),
    transform: transforms[from] || transforms.bottom,
  };
};

/**
 * Stagger children entrance
 */
export const staggeredEntrance = (frame, fps, index, staggerDelay = 5, baseDelay = 0) => {
  const delay = baseDelay + index * staggerDelay;
  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  return {
    opacity: progress,
    transform: `translateY(${(1 - progress) * 30}px) scale(${0.9 + progress * 0.1})`,
  };
};

/**
 * Gentle floating motion
 */
export const gentleFloat = (frame, amplitude = 10, speed = 0.05) => {
  const y = Math.sin(frame * speed) * amplitude;
  return {
    transform: `translateY(${y}px)`,
  };
};

/**
 * Gentle pulse effect
 */
export const gentlePulse = (frame, amount = 0.03, speed = 0.08) => {
  const scale = 1 + Math.sin(frame * speed) * amount;
  return {
    transform: `scale(${scale})`,
  };
};

// ==================== SCENE TRANSFORMATION (from sceneTransformation.jsx) ====================

/**
 * Get background gradient transition properties
 */
export const getBackgroundTransition = (frame, config, fps) => {
  const {
    triggerTime,
    duration = 1.5,
    fromGradient,
    toGradient,
    easing = 'power3InOut'
  } = config;

  if (!triggerTime || !fromGradient || !toGradient) {
    return { gradient: fromGradient, progress: 0 };
  }

  const startFrame = toFrames(triggerTime, fps);
  const endFrame = startFrame + toFrames(duration, fps);

  const progress = interpolate(
    frame,
    [startFrame, endFrame],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: EZ[easing] || EZ.power3InOut
    }
  );

  const interpolatedGradient = {
    start: interpolateColor(fromGradient.start, toGradient.start, progress),
    end: interpolateColor(fromGradient.end, toGradient.end, progress)
  };

  return {
    gradient: interpolatedGradient,
    progress
  };
};

/**
 * Helper: Interpolate between two hex colors
 */
export const interpolateColor = (color1, color2, progress) => {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);

  if (!c1 || !c2) return color1;

  const r = Math.round(c1.r + (c2.r - c1.r) * progress);
  const g = Math.round(c1.g + (c2.g - c1.g) * progress);
  const b = Math.round(c1.b + (c2.b - c1.b) * progress);

  return rgbToHex(r, g, b);
};

/**
 * Helper: Convert hex to RGB object
 */
export const hexToRgb = (hex) => {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  const bigint = parseInt(hex, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
};

/**
 * Helper: Convert RGB to hex
 */
export const rgbToHex = (r, g, b) => {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

// ==================== MICRO DELIGHTS (key functions from microDelights.jsx) ====================

/**
 * Get particle burst
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
 * Get spring bounce entrance
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

// ==================== ADDITIONAL ADVANCED EFFECTS ====================

/**
 * Create shimmer/shine effect that sweeps across element
 */
export const getShimmerEffect = (frame, config = {}) => {
  const {
    speed = 0.02,
    width = 100,
    angle = 45,
    intensity = 0.3,
  } = config;
  
  const position = (frame * speed) % 200 - 100;
  
  return {
    position,
    angle,
    width,
    intensity,
    gradientStart: position - width / 2,
    gradientEnd: position + width / 2,
  };
};
