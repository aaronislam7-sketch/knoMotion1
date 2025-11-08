/**
 * Micro-Delights SDK
 * 
 * Subtle, engaging animations that enhance without distracting.
 * These create the "hand-crafted" feel that separates world-class videos from PowerPoint.
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { EZ, toFrames } from './index';

// ==================== TEXT MICRO-DELIGHTS ====================

/**
 * Character-level staggered reveal
 * Each character appears with a slight delay
 */
export const useCharacterStagger = (text, startFrame, duration = 30, staggerDelay = 2) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const chars = text.split('');
  const totalDuration = chars.length * staggerDelay;
  const actualDuration = Math.min(duration, totalDuration);
  
  return chars.map((char, i) => {
    const charStart = startFrame + (i * staggerDelay);
    const charProgress = interpolate(
      frame,
      [charStart, charStart + actualDuration / chars.length],
      [0, 1],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.power3Out }
    );
    
    return {
      char,
      opacity: charProgress,
      transform: `translateY(${(1 - charProgress) * 10}px) scale(${0.8 + charProgress * 0.2})`
    };
  });
};

/**
 * Word-level float animation
 * Gentle Y-axis oscillation
 */
export const useWordFloat = (frame, seed = 0, amount = 3, speed = 0.05) => {
  const y = Math.sin(frame * speed + seed) * amount;
  return {
    transform: `translateY(${y}px)`
  };
};

/**
 * Word-level glow pulse
 * Subtle glow effect that pulses on key terms
 */
export const useWordGlow = (frame, triggerFrame, duration = 60, intensity = 0.3) => {
  const progress = interpolate(
    frame,
    [triggerFrame, triggerFrame + duration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  
  const pulse = Math.sin(progress * Math.PI * 2) * intensity;
  
  return {
    textShadow: `0 0 ${10 + pulse * 20}px rgba(255, 107, 53, ${0.3 + pulse * 0.3})`
  };
};

/**
 * Underline draw-on animation
 * Hand-drawn feel underline that draws left-to-right
 */
export const useUnderlineDraw = (frame, startFrame, duration = 30, width = 100) => {
  const progress = interpolate(
    frame,
    [startFrame, startFrame + duration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.power3Out }
  );
  
  return {
    width: `${progress * width}%`,
    opacity: progress
  };
};

/**
 * Line-by-line fade-up with stagger
 */
export const useLineStagger = (lines, startFrame, staggerDelay = 10, duration = 20) => {
  const frame = useCurrentFrame();
  
  return lines.map((line, i) => {
    const lineStart = startFrame + (i * staggerDelay);
    const progress = interpolate(
      frame,
      [lineStart, lineStart + duration],
      [0, 1],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.power3Out }
    );
    
    return {
      line,
      opacity: progress,
      transform: `translateY(${(1 - progress) * 20}px)`
    };
  });
};

// ==================== VISUAL ELEMENT MICRO-DELIGHTS ====================

/**
 * Gentle rotation oscillation
 * Subtle 2-3 degree rotation back and forth
 */
export const useRotationOscillation = (frame, seed = 0, degrees = 2.5, speed = 0.03) => {
  const rotation = Math.sin(frame * speed + seed) * degrees;
  return {
    transform: `rotate(${rotation}deg)`
  };
};

/**
 * Scale pulse on appear
 * Gentle breathing effect
 */
export const useScalePulse = (frame, startFrame, duration = 30, baseScale = 1, pulseAmount = 0.05) => {
  const appearProgress = interpolate(
    frame,
    [startFrame, startFrame + duration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.power3Out }
  );
  
  const pulse = Math.sin((frame - startFrame) * 0.1) * pulseAmount;
  const scale = (baseScale + appearProgress * (1 - baseScale)) * (1 + pulse);
  
  return {
    transform: `scale(${scale})`,
    opacity: appearProgress
  };
};

/**
 * Border glow pulse
 * Animated border glow effect
 */
export const useBorderGlow = (frame, color = '#FF6B35', intensity = 0.5, speed = 0.1) => {
  const pulse = Math.sin(frame * speed) * intensity;
  const glowSize = 5 + pulse * 10;
  const glowOpacity = 0.3 + pulse * 0.3;
  
  return {
    boxShadow: `0 0 ${glowSize}px ${glowSize * 2}px rgba(255, 107, 53, ${glowOpacity})`
  };
};

/**
 * Shadow depth animation
 * Animated shadow that creates depth
 */
export const useShadowDepth = (frame, startFrame, duration = 30, maxDepth = 20) => {
  const progress = interpolate(
    frame,
    [startFrame, startFrame + duration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.power3Out }
  );
  
  const depth = progress * maxDepth;
  const blur = 5 + progress * 15;
  
  return {
    boxShadow: `0 ${depth}px ${blur}px rgba(0, 0, 0, ${0.2 + progress * 0.2})`
  };
};

/**
 * Color shift animation
 * Subtle hue rotation
 */
export const useColorShift = (frame, baseColor, shiftAmount = 10, speed = 0.02) => {
  // Simple implementation - in production, use a proper color library
  const shift = Math.sin(frame * speed) * shiftAmount;
  // Return style object - actual color manipulation would need color library
  return {
    filter: `hue-rotate(${shift}deg)`
  };
};

// ==================== INTERACTION MICRO-DELIGHTS ====================

/**
 * Scale up on focus (timeline-based)
 * For quiz choices, buttons, etc.
 */
export const useFocusScale = (frame, focusFrame, duration = 15, scaleAmount = 0.1) => {
  const progress = interpolate(
    frame,
    [focusFrame, focusFrame + duration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.power3Out }
  );
  
  const scale = 1 + progress * scaleAmount;
  return {
    transform: `scale(${scale})`,
    transition: 'transform 0.2s ease-out'
  };
};

/**
 * Smooth progress bar fill
 * Not linear - uses easing
 */
export const useProgressFill = (frame, startFrame, duration, progressValue, easing = EZ.power3Out) => {
  const fillProgress = interpolate(
    frame,
    [startFrame, startFrame + duration],
    [0, progressValue],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing }
  );
  
  return {
    width: `${fillProgress * 100}%`
  };
};

/**
 * Number counter animation
 * Smooth number transitions (not instant)
 */
export const useNumberCounter = (frame, startFrame, duration, fromValue, toValue) => {
  const progress = interpolate(
    frame,
    [startFrame, startFrame + duration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.power3Out }
  );
  
  const currentValue = Math.round(fromValue + (toValue - fromValue) * progress);
  return currentValue;
};

/**
 * Celebration burst
 * Particle-like effect for correct answers
 */
export const useCelebrationBurst = (frame, triggerFrame, duration = 30) => {
  const progress = interpolate(
    frame,
    [triggerFrame, triggerFrame + duration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  
  if (progress === 0) return null;
  
  // Create burst particles
  const particleCount = 12;
  const particles = Array.from({ length: particleCount }, (_, i) => {
    const angle = (i / particleCount) * Math.PI * 2;
    const distance = progress * 100;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    const opacity = 1 - progress;
    
    return {
      x,
      y,
      opacity,
      size: 8 + Math.random() * 4
    };
  });
  
  return particles;
};

/**
 * Subtle shake for incorrect answers
 */
export const useShake = (frame, triggerFrame, duration = 20, intensity = 5) => {
  if (frame < triggerFrame || frame > triggerFrame + duration) {
    return { transform: 'translateX(0)' };
  }
  
  const progress = (frame - triggerFrame) / duration;
  const intensityCurve = Math.sin(progress * Math.PI); // Peak in middle
  const offset = Math.sin((frame - triggerFrame) * 1.5) * intensity * intensityCurve;
  
  return {
    transform: `translateX(${offset}px)`
  };
};

/**
 * Red flash for incorrect answers
 */
export const useFlash = (frame, triggerFrame, duration = 15, color = '#E74C3C') => {
  if (frame < triggerFrame || frame > triggerFrame + duration) {
    return { opacity: 0 };
  }
  
  const progress = (frame - triggerFrame) / duration;
  const opacity = Math.sin(progress * Math.PI) * 0.3;
  
  return {
    backgroundColor: color,
    opacity
  };
};

/**
 * Checkmark draw-on animation
 */
export const useCheckmarkDraw = (frame, startFrame, duration = 20) => {
  const progress = interpolate(
    frame,
    [startFrame, startFrame + duration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.power3Out }
  );
  
  return {
    strokeDashoffset: `${(1 - progress) * 100}%`,
    opacity: progress
  };
};

// ==================== COMPOSITE MICRO-DELIGHTS ====================

/**
 * Combine multiple micro-delights into one style object
 */
export const combineMicroDelights = (...delightStyles) => {
  return delightStyles.reduce((acc, style) => {
    if (!style) return acc;
    
    // Merge transforms
    if (style.transform && acc.transform) {
      acc.transform = `${acc.transform} ${style.transform}`;
    } else if (style.transform) {
      acc.transform = style.transform;
    }
    
    // Merge other properties
    return { ...acc, ...style };
  }, {});
};

/**
 * Apply micro-delights to a React element
 */
export const withMicroDelights = (Component, microDelightConfig) => {
  return (props) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    
    const styles = {};
    
    // Apply configured micro-delights
    if (microDelightConfig.float) {
      Object.assign(styles, useWordFloat(frame, microDelightConfig.float.seed, microDelightConfig.float.amount));
    }
    
    if (microDelightConfig.pulse) {
      Object.assign(styles, useScalePulse(frame, microDelightConfig.pulse.startFrame, microDelightConfig.pulse.duration));
    }
    
    if (microDelightConfig.glow) {
      Object.assign(styles, useBorderGlow(frame, microDelightConfig.glow.color));
    }
    
    return <Component {...props} style={{ ...props.style, ...styles }} />;
  };
};
