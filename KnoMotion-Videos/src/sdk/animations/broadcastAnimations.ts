/**
 * Broadcast-Grade Animation Utilities
 * Inspired by GitHub Unwrapped's spring-based, smooth animations
 * Designed for professional, fluid motion
 */

import { spring, interpolate, Easing } from 'remotion';

// ==================== SPRING CONFIGURATIONS ====================

export const springConfigs = {
  // Gentle, smooth entrance
  gentle: { damping: 20, stiffness: 100, mass: 1 },
  
  // Bouncy, playful entrance
  bouncy: { damping: 10, stiffness: 120, mass: 1 },
  
  // Quick, responsive
  snappy: { damping: 25, stiffness: 200, mass: 0.8 },
  
  // Smooth, broadcast-quality
  broadcast: { damping: 200, mass: 1, stiffness: 100 },
  
  // Wobbly, attention-grabbing
  wobbly: { damping: 8, stiffness: 150, mass: 1.2 },
};

// ==================== ENTRANCE ANIMATIONS ====================

/**
 * Smooth fade and scale entrance
 */
export const fadeInScale = (
  frame: number,
  fps: number,
  delay = 0,
  config = springConfigs.broadcast
) => {
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
 * Slide in with overshoot (like GitHub Unwrapped)
 */
export const slideInWithOvershoot = (
  frame: number,
  fps: number,
  from: 'left' | 'right' | 'top' | 'bottom' = 'bottom',
  delay = 0,
  distance = 100
) => {
  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: springConfigs.bouncy,
  });

  const transforms: Record<typeof from, string> = {
    left: `translateX(${(1 - progress) * -distance}px)`,
    right: `translateX(${(1 - progress) * distance}px)`,
    top: `translateY(${(1 - progress) * -distance}px)`,
    bottom: `translateY(${(1 - progress) * distance}px)`,
  };

  return {
    opacity: Math.min(progress * 1.5, 1),
    transform: transforms[from],
  };
};

/**
 * Zoom in from distance (like Opening scene transition)
 */
export const zoomInFromDistance = (
  frame: number,
  fps: number,
  delay = 10,
  duration = 60
) => {
  const progress =
    spring({
      frame: Math.max(0, frame),
      fps,
      config: springConfigs.broadcast,
      durationInFrames: duration,
      delay,
    }) * 0.9 +
    interpolate(frame, [0, delay + duration], [-0.1, 0.1], {
      extrapolateRight: 'clamp',
    });

  const scale = interpolate(progress, [0, 1], [2.5, 1]);

  return {
    transform: `scale(${scale})`,
    opacity: Math.min(progress * 2, 1),
  };
};

/**
 * Stagger children entrance
 */
export const staggeredEntrance = (
  frame: number,
  fps: number,
  index: number,
  staggerDelay = 5,
  baseDelay = 0
) => {
  const delay = baseDelay + index * staggerDelay;
  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: springConfigs.gentle,
  });

  return {
    opacity: progress,
    transform: `translateY(${(1 - progress) * 30}px) scale(${0.9 + progress * 0.1})`,
  };
};

// ==================== EXIT ANIMATIONS ====================

/**
 * Zoom out exit (like scene transitions in GitHub Unwrapped)
 */
export const zoomOutExit = (
  frame: number,
  fps: number,
  startFrame: number,
  duration = 20
) => {
  const exitProgress = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: springConfigs.broadcast,
    durationInFrames: duration,
  });

  const distance = interpolate(exitProgress, [0, 1], [1, 0.000005]);
  const scale = 1 / distance;

  return {
    transform: `scale(${scale})`,
    opacity: interpolate(exitProgress, [0, 0.7, 1], [1, 0.5, 0]),
  };
};

/**
 * Slide out with momentum
 */
export const slideOutWithMomentum = (
  frame: number,
  fps: number,
  startFrame: number,
  to: 'left' | 'right' | 'top' | 'bottom' = 'top',
  distance = 500
) => {
  const progress = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: { damping: 30, stiffness: 200, mass: 0.8 },
  });

  const transforms: Record<typeof to, string> = {
    left: `translateX(${-progress * distance}px)`,
    right: `translateX(${progress * distance}px)`,
    top: `translateY(${-progress * distance}px)`,
    bottom: `translateY(${progress * distance}px)`,
  };

  return {
    transform: transforms[to],
    opacity: 1 - progress,
  };
};

// ==================== CONTINUOUS ANIMATIONS ====================

/**
 * Gentle floating motion
 */
export const gentleFloat = (frame: number, amplitude = 10, speed = 0.05) => {
  const y = Math.sin(frame * speed) * amplitude;
  return {
    transform: `translateY(${y}px)`,
  };
};

/**
 * Rotating shine effect
 */
export const rotatingGlow = (frame: number, speed = 0.4) => {
  const rotation = frame * speed;
  return {
    transform: `rotate(${rotation}deg)`,
  };
};

/**
 * Pulsing scale effect
 */
export const gentlePulse = (frame: number, amount = 0.03, speed = 0.08) => {
  const scale = 1 + Math.sin(frame * speed) * amount;
  return {
    transform: `scale(${scale})`,
  };
};

/**
 * Breathing opacity effect
 */
export const breathingOpacity = (frame: number, min = 0.7, max = 1, speed = 0.05) => {
  const opacity = min + (Math.sin(frame * speed) * 0.5 + 0.5) * (max - min);
  return {
    opacity,
  };
};

// ==================== TRANSITION HELPERS ====================

/**
 * Cross-fade between two states
 */
export const crossfade = (
  frame: number,
  fps: number,
  transitionStart: number,
  duration = 30
) => {
  const progress = Math.max(
    0,
    Math.min(1, (frame - transitionStart) / duration)
  );

  return {
    outgoing: 1 - progress,
    incoming: progress,
  };
};

/**
 * Wipe transition
 */
export const wipeTransition = (
  frame: number,
  fps: number,
  startFrame: number,
  direction: 'left' | 'right' | 'up' | 'down' = 'right',
  duration = 30
) => {
  const progress = interpolate(
    frame,
    [startFrame, startFrame + duration],
    [0, 100],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    }
  );

  const clipPaths: Record<typeof direction, string> = {
    left: `inset(0 ${100 - progress}% 0 0)`,
    right: `inset(0 0 0 ${progress}%)`,
    up: `inset(0 0 ${100 - progress}% 0)`,
    down: `inset(${progress}% 0 0 0)`,
  };

  return {
    clipPath: clipPaths[direction],
  };
};

// ==================== NUMBER COUNTING ====================

/**
 * Smooth number counting animation
 */
export const countUp = (
  frame: number,
  fps: number,
  startFrame: number,
  from: number,
  to: number,
  duration = 60
) => {
  const progress = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: { damping: 50, stiffness: 100 },
    durationInFrames: duration,
  });

  return Math.floor(from + (to - from) * progress);
};

// ==================== SCENE TRANSITION HELPERS ====================

/**
 * Calculate transition overlap for Series.Sequence
 * Matches GitHub Unwrapped's pattern
 */
export const getTransitionOverlap = (
  sceneDuration: number,
  overlapFrames = 10
): number => {
  return -overlapFrames;
};

/**
 * Scene entrance progress with spring
 */
export const sceneEntranceProgress = (
  frame: number,
  fps: number,
  config = springConfigs.broadcast
) => {
  return spring({ frame, fps, config });
};

/**
 * Scene exit progress with spring
 */
export const sceneExitProgress = (
  frame: number,
  fps: number,
  durationInFrames: number,
  exitDuration = 20
) => {
  return spring({
    frame,
    fps,
    config: springConfigs.broadcast,
    delay: durationInFrames - exitDuration,
    durationInFrames: exitDuration,
  });
};
