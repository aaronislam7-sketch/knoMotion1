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
 * Fade out animation
 */
export const fadeOut = (frame, startFrame, duration = 30) => {
  const progress = interpolate(
    frame,
    [startFrame, startFrame + duration],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  
  return {
    opacity: progress,
    transform: `scale(${1 - (1 - progress) * 0.05})`
  };
};

/**
 * Slide out to direction
 */
export const slideOut = (frame, startFrame, duration = 30, direction = 'left', distance = 50) => {
  const progress = interpolate(
    frame,
    [startFrame, startFrame + duration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  
  const translations = {
    left: `translateX(${progress * distance}px)`,
    right: `translateX(${progress * -distance}px)`,
    up: `translateY(${progress * distance}px)`,
    down: `translateY(${progress * -distance}px)`
  };
  
  return {
    opacity: 1 - progress,
    transform: translations[direction] || translations.left
  };
};

/**
 * Scale out animation
 */
export const scaleOut = (frame, startFrame, duration = 30, toScale = 0.3) => {
  const progress = interpolate(
    frame,
    [startFrame, startFrame + duration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  
  return {
    opacity: 1 - progress,
    transform: `scale(${1 - (1 - toScale) * progress})`
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

/**
 * Kinetic typography - text that moves with physics
 */
export const getKineticText = (frame, config, fps) => {
  const {
    start = 0,
    text = '',
    splitBy = 'word',
    effect = 'wave',
    amplitude = 20,
    frequency = 0.1,
  } = config;
  
  const startFrame = Math.round(start * fps);
  
  if (frame < startFrame) {
    return { segments: [], isActive: false };
  }
  
  const localFrame = frame - startFrame;
  const segments = splitBy === 'word' ? text.split(' ') : text.split('');
  
  const animatedSegments = segments.map((segment, index) => {
    if (effect === 'wave') {
      const phaseOffset = index * 0.5;
      const y = Math.sin(localFrame * frequency + phaseOffset) * amplitude;
      return {
        text: segment,
        translateX: 0,
        translateY: y,
        rotation: 0,
        scale: 1,
        opacity: 1,
      };
    }
    
    if (effect === 'scatter') {
      const delay = index * 5;
      const effectiveFrame = Math.max(0, localFrame - delay);
      const duration = 40;
      
      if (effectiveFrame === 0) {
        return { text: segment, translateX: 0, translateY: 0, rotation: 0, scale: 0, opacity: 0 };
      }
      
      if (effectiveFrame > duration) {
        return { text: segment, translateX: 0, translateY: 0, rotation: 0, scale: 1, opacity: 1 };
      }
      
      const seed = index * 1000;
      const angle = (Math.sin(seed) * Math.PI * 2);
      const dist = 100;
      const progress = effectiveFrame / duration;
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      
      return {
        text: segment,
        translateX: Math.cos(angle) * dist * (1 - easedProgress),
        translateY: Math.sin(angle) * dist * (1 - easedProgress),
        rotation: 360 * (1 - easedProgress),
        scale: easedProgress,
        opacity: easedProgress,
      };
    }
    
    if (effect === 'orbit') {
      const radius = 50;
      const angularSpeed = 0.02;
      const baseAngle = (index / segments.length) * Math.PI * 2;
      const currentAngle = baseAngle + (localFrame * angularSpeed);
      
      return {
        text: segment,
        translateX: Math.cos(currentAngle) * radius,
        translateY: Math.sin(currentAngle) * radius,
        rotation: 0,
        scale: 1,
        opacity: 1,
      };
    }
    
    return { text: segment, translateX: 0, translateY: 0, rotation: 0, scale: 1, opacity: 1 };
  });
  
  return { segments: animatedSegments, isActive: true };
};

/**
 * Parallax depth layers
 */
export const getParallaxLayer = (frame, config = {}) => {
  const {
    depth = 1,
    intensity = 1,
    centerX = 960,
    centerY = 540,
  } = config;
  
  const cameraX = Math.sin(frame * 0.01) * 20 * intensity;
  const cameraY = Math.cos(frame * 0.008) * 15 * intensity;
  const parallaxX = cameraX * depth;
  const parallaxY = cameraY * depth;
  const scale = 1 + (depth * 0.05);
  
  return { translateX: parallaxX, translateY: parallaxY, scale };
};

/**
 * Text reveal with mask animation
 */
export const getMaskReveal = (frame, config, fps) => {
  const {
    start = 0,
    duration = 1.0,
    direction = 'left',
    textBounds,
    ease = 'smooth',
  } = config;
  
  const startFrame = Math.round(start * fps);
  const endFrame = Math.round((start + duration) * fps);
  
  if (frame < startFrame) {
    return { visible: false, clipPath: null };
  }
  
  if (frame >= endFrame) {
    return { visible: true, clipPath: null };
  }
  
  const easeFn = EZ[ease] || EZ.smooth;
  const progress = interpolate(
    frame,
    [startFrame, endFrame],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeFn }
  );
  
  const { x, y, width, height } = textBounds;
  let clipPath = '';
  
  if (direction === 'left') {
    const revealWidth = width * progress;
    clipPath = `inset(0 ${width - revealWidth}px 0 0)`;
  } else if (direction === 'right') {
    const revealWidth = width * progress;
    clipPath = `inset(0 0 0 ${width - revealWidth}px)`;
  } else if (direction === 'top') {
    const revealHeight = height * progress;
    clipPath = `inset(${height - revealHeight}px 0 0 0)`;
  } else if (direction === 'bottom') {
    const revealHeight = height * progress;
    clipPath = `inset(0 0 ${height - revealHeight}px 0)`;
  } else if (direction === 'center') {
    const revealWidth = width * progress;
    const revealHeight = height * progress;
    const leftInset = (width - revealWidth) / 2;
    const topInset = (height - revealHeight) / 2;
    clipPath = `inset(${topInset}px ${leftInset}px ${topInset}px ${leftInset}px)`;
  }
  
  return { visible: true, clipPath, progress };
};

/**
 * Ink splatter/splash effect
 */
export const getInkSplatter = (frame, config, fps) => {
  const {
    start = 0,
    duration = 0.8,
    centerX = 960,
    centerY = 540,
    maxRadius = 200,
    points = 12,
    seed = 0,
  } = config;
  
  const startFrame = Math.round(start * fps);
  const endFrame = Math.round((start + duration) * fps);
  
  if (frame < startFrame) {
    return { visible: false, paths: [] };
  }
  
  const progress = frame >= endFrame ? 1 : (frame - startFrame) / (endFrame - startFrame);
  const paths = [];
  
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2 + seed;
    const distance = maxRadius * progress;
    const wobble = Math.sin(seed + i * 3) * 0.3 + 0.7;
    const actualDistance = distance * wobble;
    const x = centerX + Math.cos(angle) * actualDistance;
    const y = centerY + Math.sin(angle) * actualDistance;
    const blobSize = 10 + Math.sin(seed + i * 5) * 8;
    
    paths.push({ cx: x, cy: y, r: blobSize * progress });
  }
  
  return {
    visible: true,
    progress,
    centerX,
    centerY,
    centerRadius: maxRadius * progress * 0.6,
    splatterPoints: paths,
  };
};

/**
 * Generate SVG filter for advanced effects
 */
export const createSVGFilter = (filterId, effect = 'glow', config = {}) => {
  if (effect === 'glow') {
    const { color = '#FF6B35', intensity = 5 } = config;
    return `
      <filter id="${filterId}">
        <feGaussianBlur in="SourceAlpha" stdDeviation="${intensity}" />
        <feOffset dx="0" dy="0" result="offsetblur" />
        <feFlood flood-color="${color}" />
        <feComposite in2="offsetblur" operator="in" />
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    `;
  }
  
  if (effect === 'shadow') {
    const { offsetX = 0, offsetY = 4, blur = 8, opacity = 0.3 } = config;
    return `
      <filter id="${filterId}">
        <feGaussianBlur in="SourceAlpha" stdDeviation="${blur}" />
        <feOffset dx="${offsetX}" dy="${offsetY}" result="offsetblur" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="${opacity}" />
        </feComponentTransfer>
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    `;
  }
  
  return '';
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

// ==================== MICRO DELIGHTS ====================
// Note: Micro-delights functions (getParticleBurst, getCardEntrance, etc.) are exported
// from animations/microDelights.jsx via the main SDK index.js
// They are not duplicated here to avoid namespace conflicts

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

// ==================== NEW CONTINUOUS LIFE ANIMATIONS (Phase 2.3) ====================

/**
 * Particle Trail - Animated particle trail effect
 * Creates particles that follow a path with fade and movement
 * 
 * @param {number} frame - Current frame
 * @param {Object} config - Configuration
 * @param {number} config.particleCount - Number of particles (default: 10)
 * @param {number} config.trailLength - Length of trail in frames (default: 30)
 * @param {number} config.speed - Speed multiplier (default: 1)
 * @param {string} config.color - Particle color (default: '#FF6B35')
 * @param {number} config.size - Particle size (default: 4)
 * @returns {Array} Array of particle positions with opacity
 */
export const getParticleTrail = (frame, config = {}) => {
  const {
    particleCount = 10,
    trailLength = 30,
    speed = 1,
    color = '#FF6B35',
    size = 4,
    pathType = 'circular', // 'circular', 'wave', 'linear'
  } = config;

  const particles = [];
  const adjustedFrame = frame * speed;

  for (let i = 0; i < particleCount; i++) {
    const delay = (trailLength / particleCount) * i;
    const particleFrame = adjustedFrame - delay;
    
    if (particleFrame < 0) continue;

    // Calculate position based on path type
    let x, y;
    switch (pathType) {
      case 'wave':
        x = (particleFrame * 2) % 100;
        y = Math.sin(particleFrame * 0.1) * 20;
        break;
      case 'linear':
        x = (particleFrame * 2) % 100;
        y = 0;
        break;
      case 'circular':
      default:
        const angle = (particleFrame * 0.05) % (Math.PI * 2);
        x = Math.cos(angle) * 30;
        y = Math.sin(angle) * 30;
        break;
    }

    // Fade opacity based on position in trail
    const opacity = 1 - (i / particleCount);

    particles.push({
      x,
      y,
      opacity,
      color,
      size: size * opacity,
    });
  }

  return particles;
};

/**
 * Enhanced Shimmer/Shine - Sweeping highlight effect with customization
 * 
 * @param {number} frame - Current frame
 * @param {Object} config - Configuration
 * @param {number} config.speed - Speed of shimmer (default: 0.015)
 * @param {number} config.width - Width of shimmer band (default: 80)
 * @param {number} config.angle - Angle of shimmer in degrees (default: 45)
 * @param {number} config.intensity - Intensity/opacity (default: 0.4)
 * @param {string} config.color - Shimmer color (default: 'rgba(255,255,255,0.6)')
 * @param {boolean} config.loop - Loop continuously (default: true)
 * @returns {Object} Shimmer style object
 */
export const getContinuousShimmer = (frame, config = {}) => {
  const {
    speed = 0.015,
    width = 80,
    angle = 45,
    intensity = 0.4,
    color = 'rgba(255,255,255,0.6)',
    loop = true,
  } = config;
  
  const progress = loop 
    ? (frame * speed) % 1 
    : Math.min(frame * speed, 1);
  
  const position = interpolate(progress, [0, 1], [-150, 150]);
  
  return {
    background: `linear-gradient(${angle}deg, transparent ${position - width}%, ${color} ${position}%, transparent ${position + width}%)`,
    backgroundSize: '200% 100%',
    animation: loop ? 'shimmer 2s infinite' : 'none',
  };
};

/**
 * Wobble/Jiggle - Playful shake animation for attention
 * 
 * @param {number} frame - Current frame
 * @param {Object} config - Configuration
 * @param {number} config.intensity - Shake intensity in pixels (default: 3)
 * @param {number} config.speed - Speed multiplier (default: 1)
 * @param {string} config.direction - 'horizontal', 'vertical', 'both' (default: 'both')
 * @param {boolean} config.continuous - Continuous wobble or triggered (default: true)
 * @returns {Object} Transform style
 */
export const getContinuousWobble = (frame, config = {}) => {
  const {
    intensity = 3,
    speed = 1,
    direction = 'both',
    continuous = true,
  } = config;

  if (!continuous) return { transform: 'translate(0, 0)' };

  const adjustedFrame = frame * speed;
  const wobbleX = direction === 'vertical' ? 0 : Math.sin(adjustedFrame * 0.3) * intensity;
  const wobbleY = direction === 'horizontal' ? 0 : Math.cos(adjustedFrame * 0.25) * intensity;

  return {
    transform: `translate(${wobbleX}px, ${wobbleY}px)`,
  };
};

/**
 * Color Pulse - Smooth color transitions for status indicators
 * 
 * @param {number} frame - Current frame
 * @param {Object} config - Configuration
 * @param {string[]} config.colors - Array of colors to pulse between (default: ['#FF6B35', '#F7931E'])
 * @param {number} config.duration - Duration of one pulse cycle in frames (default: 60)
 * @param {string} config.easing - Easing function (default: 'linear')
 * @returns {Object} Color style
 */
export const getContinuousColorPulse = (frame, config = {}) => {
  const {
    colors = ['#FF6B35', '#F7931E'],
    duration = 60,
    easing = 'linear',
  } = config;

  const cycleProgress = (frame % duration) / duration;
  const colorIndex = Math.floor(cycleProgress * (colors.length - 1));
  const nextColorIndex = (colorIndex + 1) % colors.length;
  const segmentProgress = (cycleProgress * (colors.length - 1)) % 1;

  const currentColor = colors[colorIndex];
  const nextColor = colors[nextColorIndex];

  const easedProgress = easing === 'ease-in-out' 
    ? 0.5 - Math.cos(segmentProgress * Math.PI) / 2
    : segmentProgress;

  const interpolatedColor = interpolateColor(currentColor, nextColor, easedProgress);

  return {
    backgroundColor: interpolatedColor,
    transition: 'background-color 0.1s ease',
  };
};

/**
 * Bounce Loop - Continuous bouncing animation for CTAs
 * 
 * @param {number} frame - Current frame
 * @param {Object} config - Configuration
 * @param {number} config.height - Bounce height in pixels (default: 10)
 * @param {number} config.speed - Speed multiplier (default: 1)
 * @param {string} config.easing - Easing type (default: 'bounce')
 * @param {boolean} config.continuous - Continuous or triggered (default: true)
 * @returns {Object} Transform style
 */
export const getContinuousBounce = (frame, config = {}) => {
  const {
    height = 10,
    speed = 1,
    easing = 'bounce',
    continuous = true,
  } = config;

  if (!continuous) return { transform: 'translateY(0)' };

  const adjustedFrame = frame * speed;
  const bounceProgress = (adjustedFrame % 30) / 30;

  let bounce;
  if (easing === 'bounce') {
    // Realistic bounce with gravity effect
    const t = bounceProgress;
    bounce = Math.abs(Math.sin(t * Math.PI)) * (1 - t * 0.3);
  } else {
    // Simple sine wave bounce
    bounce = Math.abs(Math.sin(bounceProgress * Math.PI));
  }

  const translateY = -bounce * height;

  return {
    transform: `translateY(${translateY}px)`,
  };
};
