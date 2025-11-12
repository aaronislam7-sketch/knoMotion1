import { interpolate } from 'remotion';
import { toFrames } from '../core/time';
import { EZ } from '../core/easing';

/**
 * SDK UTILITY: Scene Transformation
 * 
 * Handles mid-scene transformations for dynamic visual storytelling:
 * - Background color/gradient shifts
 * - Spotlight position movement
 * - Particle style changes
 * - Overall scene "mode" transitions
 */

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

  // Interpolate gradient colors
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
 * Get spotlight movement animation
 */
export const getSpotlightMove = (frame, config, fps) => {
  const {
    triggerTime,
    duration = 1.5,
    fromPosition,
    toPosition,
    easing = 'power3InOut'
  } = config;

  if (!triggerTime || !fromPosition || !toPosition) {
    return { position: fromPosition, progress: 0 };
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

  const interpolatedPosition = {
    x: interpolate(progress, [0, 1], [fromPosition.x, toPosition.x]),
    y: interpolate(progress, [0, 1], [fromPosition.y, toPosition.y]),
    size: fromPosition.size && toPosition.size
      ? interpolate(progress, [0, 1], [fromPosition.size, toPosition.size])
      : fromPosition.size || toPosition.size
  };

  return {
    position: interpolatedPosition,
    progress
  };
};

/**
 * Get particle style transition
 */
export const getParticleStyleTransition = (frame, config, fps) => {
  const {
    triggerTime,
    duration = 1.5,
    fromStyle,
    toStyle
  } = config;

  if (!triggerTime) {
    return { style: fromStyle, progress: 0 };
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
      easing: EZ.power3InOut
    }
  );

  // Discrete style change at 50% progress
  const currentStyle = progress < 0.5 ? fromStyle : toStyle;

  return {
    style: currentStyle,
    progress
  };
};

/**
 * Get comprehensive scene transformation state
 */
export const getSceneTransformation = (frame, config, fps) => {
  const {
    enabled = false,
    triggerTime,
    duration = 1.5,
    backgroundTransition,
    spotlightMovement,
    particleTransition,
    customTransformations = []
  } = config;

  if (!enabled || !triggerTime) {
    return {
      active: false,
      progress: 0,
      background: backgroundTransition?.fromGradient,
      spotlights: [],
      particleStyle: particleTransition?.fromStyle
    };
  }

  const startFrame = toFrames(triggerTime, fps);
  const endFrame = startFrame + toFrames(duration, fps);

  const active = frame >= startFrame && frame < endFrame;
  const progress = active
    ? interpolate(
        frame,
        [startFrame, endFrame],
        [0, 1],
        {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: EZ.power3InOut
        }
      )
    : frame >= endFrame
    ? 1
    : 0;

  // Get background transition
  const background = backgroundTransition
    ? getBackgroundTransition(frame, { ...backgroundTransition, triggerTime, duration }, fps)
    : null;

  // Get spotlight movements (array of spotlights)
  const spotlights = spotlightMovement?.spotlights
    ? spotlightMovement.spotlights.map(spotlight =>
        getSpotlightMove(frame, { ...spotlight, triggerTime, duration }, fps)
      )
    : [];

  // Get particle transition
  const particleStyle = particleTransition
    ? getParticleStyleTransition(frame, { ...particleTransition, triggerTime, duration }, fps)
    : null;

  // Custom transformations (user-defined)
  const customResults = customTransformations.map(transform => {
    if (typeof transform === 'function') {
      return transform(frame, progress, fps);
    }
    return null;
  });

  return {
    active,
    progress,
    background: background?.gradient,
    backgroundProgress: background?.progress || 0,
    spotlights: spotlights.map(s => s.position),
    spotlightProgress: spotlights[0]?.progress || 0,
    particleStyle: particleStyle?.style,
    particleProgress: particleStyle?.progress || 0,
    customResults
  };
};

/**
 * Helper: Interpolate between two hex colors
 */
export const interpolateColor = (color1, color2, progress) => {
  // Parse hex colors
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);

  if (!c1 || !c2) return color1;

  // Interpolate RGB channels
  const r = Math.round(c1.r + (c2.r - c1.r) * progress);
  const g = Math.round(c1.g + (c2.g - c1.g) * progress);
  const b = Math.round(c1.b + (c2.b - c1.b) * progress);

  // Convert back to hex
  return rgbToHex(r, g, b);
};

/**
 * Helper: Convert hex to RGB object
 */
export const hexToRgb = (hex) => {
  // Remove # if present
  hex = hex.replace(/^#/, '');

  // Handle 3-digit hex
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map(char => char + char)
      .join('');
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

export default {
  getBackgroundTransition,
  getSpotlightMove,
  getParticleStyleTransition,
  getSceneTransformation,
  interpolateColor,
  hexToRgb,
  rgbToHex
};
