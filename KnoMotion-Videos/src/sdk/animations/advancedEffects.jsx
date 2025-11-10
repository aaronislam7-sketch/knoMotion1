import React from 'react';
import { interpolate } from 'remotion';
import { EZ } from '../core/easing';

/**
 * ADVANCED VISUAL EFFECTS SDK
 * 
 * Premium effects that add that "wow" factor:
 * - Glow and bloom effects
 * - Morphing shapes
 * - Liquid/blob transitions
 * - Depth and layering
 * - Kinetic typography
 */

/**
 * Animated glow effect
 * Returns filter properties for SVG
 */
export const getGlowEffect = (frame, config = {}) => {
  const {
    intensity = 10,      // Blur amount
    color = '#FF6B35',   // Glow color
    pulse = false,       // Whether to pulse
    pulseSpeed = 0.05,   // Pulse frequency
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
 * Returns interpolated SVG path
 */
export const getMorphProgress = (frame, config, fps) => {
  const {
    start = 0,
    duration = 1.0,
    pathA,              // Starting SVG path
    pathB,              // Ending SVG path
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
  
  // Simple morph: interpolate between two similar paths
  // For complex morphs, use a library like flubber
  return {
    progress,
    path: progress < 0.5 ? pathA : pathB, // Simplified crossfade
  };
};

/**
 * Liquid blob animation
 * Creates organic, flowing shapes
 */
export const getLiquidBlob = (frame, config = {}) => {
  const {
    centerX = 0,
    centerY = 0,
    baseRadius = 100,
    points = 8,          // Number of control points
    wobbleAmount = 0.2,  // How much wobble (0-1)
    speed = 0.02,        // Animation speed
    seed = 0,            // For variation
  } = config;
  
  const pathPoints = [];
  
  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * Math.PI * 2;
    
    // Multiple sine waves for organic motion
    const wobble1 = Math.sin(frame * speed + angle * 3 + seed);
    const wobble2 = Math.cos(frame * speed * 0.7 + angle * 2 + seed * 1.3);
    const wobble = (wobble1 + wobble2) / 2;
    
    const radius = baseRadius + (baseRadius * wobbleAmount * wobble);
    
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    
    pathPoints.push({ x, y });
  }
  
  // Create smooth curve through points
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
    splitBy = 'word',     // 'word' | 'char'
    effect = 'wave',      // 'wave' | 'scatter' | 'orbit'
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
      // Wave motion
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
      // Scatter then gather
      const delay = index * 5;
      const effectiveFrame = Math.max(0, localFrame - delay);
      const duration = 40;
      
      if (effectiveFrame === 0) {
        return {
          text: segment,
          translateX: 0,
          translateY: 0,
          rotation: 0,
          scale: 0,
          opacity: 0,
        };
      }
      
      if (effectiveFrame > duration) {
        return {
          text: segment,
          translateX: 0,
          translateY: 0,
          rotation: 0,
          scale: 1,
          opacity: 1,
        };
      }
      
      // Scatter position (deterministic)
      const seed = index * 1000;
      const angle = (Math.sin(seed) * Math.PI * 2);
      const dist = 100;
      
      const progress = effectiveFrame / duration;
      const easedProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
      
      const translateX = Math.cos(angle) * dist * (1 - easedProgress);
      const translateY = Math.sin(angle) * dist * (1 - easedProgress);
      const rotation = 360 * (1 - easedProgress);
      const scale = easedProgress;
      const opacity = easedProgress;
      
      return {
        text: segment,
        translateX,
        translateY,
        rotation,
        scale,
        opacity,
      };
    }
    
    if (effect === 'orbit') {
      // Orbit around center point
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
    
    return {
      text: segment,
      translateX: 0,
      translateY: 0,
      rotation: 0,
      scale: 1,
      opacity: 1,
    };
  });
  
  return {
    segments: animatedSegments,
    isActive: true,
  };
};

/**
 * Parallax depth layers
 * Creates sense of depth with multi-layer motion
 */
export const getParallaxLayer = (frame, config = {}) => {
  const {
    depth = 1,           // 0 (far) to 1 (near)
    intensity = 1,       // Multiplier for effect
    centerX = 960,
    centerY = 540,
  } = config;
  
  // Gentle camera motion
  const cameraX = Math.sin(frame * 0.01) * 20 * intensity;
  const cameraY = Math.cos(frame * 0.008) * 15 * intensity;
  
  // Parallax based on depth (closer = more movement)
  const parallaxX = cameraX * depth;
  const parallaxY = cameraY * depth;
  
  // Subtle scale variation for depth
  const scale = 1 + (depth * 0.05);
  
  return {
    translateX: parallaxX,
    translateY: parallaxY,
    scale,
  };
};

/**
 * Text reveal with mask animation
 * Text reveals from behind animated mask
 */
export const getMaskReveal = (frame, config, fps) => {
  const {
    start = 0,
    duration = 1.0,
    direction = 'left',   // 'left' | 'right' | 'top' | 'bottom' | 'center'
    textBounds,           // { x, y, width, height }
    ease = 'smooth',
  } = config;
  
  const startFrame = Math.round(start * fps);
  const endFrame = Math.round((start + duration) * fps);
  
  if (frame < startFrame) {
    return { visible: false, clipPath: null };
  }
  
  if (frame >= endFrame) {
    return { visible: true, clipPath: null }; // Fully revealed
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
  
  return {
    visible: true,
    clipPath,
    progress,
  };
};

/**
 * Ink splatter/splash effect
 * Organic reveal like ink spreading
 */
export const getInkSplatter = (frame, config, fps) => {
  const {
    start = 0,
    duration = 0.8,
    centerX = 960,
    centerY = 540,
    maxRadius = 200,
    points = 12,         // Number of splatter points
    seed = 0,
  } = config;
  
  const startFrame = Math.round(start * fps);
  const endFrame = Math.round((start + duration) * fps);
  
  if (frame < startFrame) {
    return { visible: false, paths: [] };
  }
  
  const progress = frame >= endFrame ? 1 : (frame - startFrame) / (endFrame - startFrame);
  
  // Generate splatter points (deterministic)
  const paths = [];
  
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2 + seed;
    const distance = maxRadius * progress;
    
    // Irregular splatter shape
    const wobble = Math.sin(seed + i * 3) * 0.3 + 0.7; // 0.7-1.0
    const actualDistance = distance * wobble;
    
    const x = centerX + Math.cos(angle) * actualDistance;
    const y = centerY + Math.sin(angle) * actualDistance;
    
    // Small splatter blob
    const blobSize = 10 + Math.sin(seed + i * 5) * 8;
    
    paths.push({
      cx: x,
      cy: y,
      r: blobSize * progress,
    });
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

/**
 * Create shimmer/shine effect that sweeps across element
 */
export const getShimmerEffect = (frame, config = {}) => {
  const {
    speed = 0.02,
    width = 100,         // Shimmer beam width
    angle = 45,          // Shimmer angle
    intensity = 0.3,     // Opacity of shimmer
  } = config;
  
  // Shimmer position cycles across element
  const position = (frame * speed) % 200 - 100; // -100 to 100
  
  return {
    position,
    angle,
    width,
    intensity,
    gradientStart: position - width / 2,
    gradientEnd: position + width / 2,
  };
};
