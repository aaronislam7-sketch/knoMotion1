import React from 'react';
import { interpolate } from 'remotion';
import { EZ } from './easing';

/**
 * HANDWRITING & DRAW-ON EFFECTS SDK
 * 
 * Creates the illusion of text being hand-written or drawn on screen
 * - Character-by-character reveal with natural timing
 * - Simulated pen pressure and ink flow
 * - Handwriting cursor/pen indicator
 * - Works with any font (especially hand-drawn fonts)
 */

/**
 * Calculate handwriting reveal progress for text
 * Returns which characters should be visible
 */
export const getHandwritingProgress = (frame, config, fps) => {
  const {
    start = 0,           // Start time (seconds)
    duration = 2.0,      // Total duration (seconds)
    text = '',           // Text to reveal
    ease = 'smooth',     // Easing function name
  } = config;
  
  const startFrame = Math.round(start * fps);
  const endFrame = Math.round((start + duration) * fps);
  
  if (frame < startFrame) return { progress: 0, visibleChars: 0, isComplete: false };
  if (frame >= endFrame) return { progress: 1, visibleChars: text.length, isComplete: true };
  
  const easeFn = EZ[ease] || EZ.smooth;
  
  const progress = interpolate(
    frame,
    [startFrame, endFrame],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeFn }
  );
  
  const visibleChars = Math.floor(text.length * progress);
  
  return {
    progress,
    visibleChars,
    isComplete: false,
  };
};

/**
 * Calculate cursor/pen position for handwriting effect
 * Returns SVG path for animated cursor
 */
export const getHandwritingCursor = (frame, config, fps, textBounds) => {
  const {
    start = 0,
    duration = 2.0,
    text = '',
    cursorType = 'pen', // 'pen' | 'underline' | 'highlight'
  } = config;
  
  const { progress, visibleChars } = getHandwritingProgress(frame, config, fps);
  
  if (progress === 0 || progress === 1) {
    return { visible: false };
  }
  
  // Estimate cursor position based on visible characters
  // This is a simplification - for precise positioning, you'd measure actual text
  const charWidth = textBounds.width / text.length;
  const cursorX = textBounds.x + (charWidth * visibleChars);
  const cursorY = textBounds.y + textBounds.height / 2;
  
  // Cursor pulse/wiggle animation
  const wiggle = Math.sin(frame * 0.3) * 2;
  
  if (cursorType === 'pen') {
    return {
      visible: true,
      type: 'pen',
      x: cursorX + wiggle,
      y: cursorY,
      rotation: 45, // Pen angle
      opacity: 0.7,
    };
  }
  
  if (cursorType === 'underline') {
    return {
      visible: true,
      type: 'underline',
      x: cursorX,
      y: cursorY + 10,
      width: 3,
      opacity: 0.8,
    };
  }
  
  if (cursorType === 'highlight') {
    return {
      visible: true,
      type: 'highlight',
      x: textBounds.x,
      y: cursorY - textBounds.height / 2,
      width: charWidth * visibleChars,
      height: textBounds.height,
      opacity: 0.2,
    };
  }
  
  return { visible: false };
};

/**
 * Text typewriter with character stagger
 * More natural than instant reveals
 */
export const getTypewriterProgress = (frame, config, fps) => {
  const {
    start = 0,
    charDelay = 0.05,    // Delay between characters (seconds)
    text = '',
    initialDelay = 0,    // Delay before first character
  } = config;
  
  const startFrame = Math.round((start + initialDelay) * fps);
  const charDelayFrames = Math.round(charDelay * fps);
  
  if (frame < startFrame) {
    return { visibleChars: 0, isComplete: false };
  }
  
  const elapsed = frame - startFrame;
  const visibleChars = Math.min(
    Math.floor(elapsed / charDelayFrames),
    text.length
  );
  
  return {
    visibleChars,
    isComplete: visibleChars === text.length,
    currentChar: text[visibleChars - 1] || '',
  };
};

/**
 * Highlight swipe effect (like marker highlighting)
 * Animated from left to right
 */
export const getHighlightSwipe = (frame, config, fps) => {
  const {
    start = 0,
    duration = 0.6,
    textBounds,          // { x, y, width, height }
    color = '#FFD70040', // Semi-transparent yellow
    ease = 'smooth',
  } = config;
  
  const startFrame = Math.round(start * fps);
  const endFrame = Math.round((start + duration) * fps);
  
  if (frame < startFrame) {
    return { visible: false };
  }
  
  if (frame >= endFrame) {
    return {
      visible: true,
      x: textBounds.x,
      y: textBounds.y,
      width: textBounds.width,
      height: textBounds.height,
      opacity: 1,
    };
  }
  
  const easeFn = EZ[ease] || EZ.smooth;
  
  const progress = interpolate(
    frame,
    [startFrame, endFrame],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeFn }
  );
  
  return {
    visible: true,
    x: textBounds.x,
    y: textBounds.y,
    width: textBounds.width * progress,
    height: textBounds.height,
    opacity: 1,
    color,
  };
};

/**
 * Circle/underline draw-on effect
 * Like circling important text with a marker
 */
export const getCircleDrawOn = (frame, config, fps) => {
  const {
    start = 0,
    duration = 0.8,
    textBounds,
    padding = 10,        // Extra space around text
    type = 'circle',     // 'circle' | 'underline' | 'box'
    ease = 'smooth',
  } = config;
  
  const startFrame = Math.round(start * fps);
  const endFrame = Math.round((start + duration) * fps);
  
  if (frame < startFrame) {
    return { visible: false };
  }
  
  const easeFn = EZ[ease] || EZ.smooth;
  
  const progress = interpolate(
    frame,
    [startFrame, endFrame],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeFn }
  );
  
  const cx = textBounds.x + textBounds.width / 2;
  const cy = textBounds.y + textBounds.height / 2;
  const rx = (textBounds.width / 2) + padding;
  const ry = (textBounds.height / 2) + padding;
  
  if (type === 'circle' || type === 'ellipse') {
    // Ellipse path that draws from top
    const circumference = 2 * Math.PI * Math.sqrt((rx * rx + ry * ry) / 2);
    const dashOffset = circumference * (1 - progress);
    
    return {
      visible: true,
      type: 'ellipse',
      cx,
      cy,
      rx,
      ry,
      strokeDasharray: circumference,
      strokeDashoffset: dashOffset,
      progress,
    };
  }
  
  if (type === 'underline') {
    const lineLength = textBounds.width + padding * 2;
    const currentLength = lineLength * progress;
    
    return {
      visible: true,
      type: 'line',
      x1: textBounds.x - padding,
      y1: textBounds.y + textBounds.height + padding / 2,
      x2: textBounds.x - padding + currentLength,
      y2: textBounds.y + textBounds.height + padding / 2,
      progress,
    };
  }
  
  if (type === 'box') {
    const perimeter = (textBounds.width + textBounds.height + padding * 2) * 2;
    const dashOffset = perimeter * (1 - progress);
    
    return {
      visible: true,
      type: 'rect',
      x: textBounds.x - padding,
      y: textBounds.y - padding,
      width: textBounds.width + padding * 2,
      height: textBounds.height + padding * 2,
      strokeDasharray: perimeter,
      strokeDashoffset: dashOffset,
      progress,
    };
  }
  
  return { visible: false };
};

/**
 * Text scramble/reveal effect
 * Characters scramble before settling into final text
 */
export const getScrambleReveal = (frame, config, fps) => {
  const {
    start = 0,
    duration = 1.0,
    text = '',
    scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*',
  } = config;
  
  const startFrame = Math.round(start * fps);
  const endFrame = Math.round((start + duration) * fps);
  
  if (frame < startFrame) {
    return { text: '', isComplete: false };
  }
  
  if (frame >= endFrame) {
    return { text, isComplete: true };
  }
  
  const progress = (frame - startFrame) / (endFrame - startFrame);
  const revealedCount = Math.floor(text.length * progress);
  
  let result = '';
  for (let i = 0; i < text.length; i++) {
    if (i < revealedCount) {
      // Revealed character
      result += text[i];
    } else {
      // Scrambled character (deterministic based on frame and position)
      const seed = frame * 13 + i * 7;
      const scrambleIndex = Math.floor(Math.abs(Math.sin(seed) * 10000)) % scrambleChars.length;
      result += text[i] === ' ' ? ' ' : scrambleChars[scrambleIndex];
    }
  }
  
  return {
    text: result,
    isComplete: false,
    progress,
  };
};

/**
 * Text bounce-in letter by letter
 * Each character bounces into position
 */
export const getBouncyLetters = (frame, config, fps) => {
  const {
    start = 0,
    letterDelay = 0.05,  // Delay between letters (seconds)
    bounceDuration = 0.4, // Duration of each bounce (seconds)
    text = '',
  } = config;
  
  const startFrame = Math.round(start * fps);
  const letterDelayFrames = Math.round(letterDelay * fps);
  const bounceDurationFrames = Math.round(bounceDuration * fps);
  
  const letters = text.split('').map((char, index) => {
    const charStartFrame = startFrame + (index * letterDelayFrames);
    const charEndFrame = charStartFrame + bounceDurationFrames;
    
    if (frame < charStartFrame) {
      return {
        char,
        visible: false,
        scale: 0,
        translateY: 20,
        opacity: 0,
      };
    }
    
    if (frame >= charEndFrame) {
      return {
        char,
        visible: true,
        scale: 1,
        translateY: 0,
        opacity: 1,
      };
    }
    
    // Bounce animation using elastic easing
    const progress = (frame - charStartFrame) / bounceDurationFrames;
    
    // Custom bounce curve
    const bounce = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    
    // Overshoot on scale
    const scale = progress < 0.7
      ? interpolate(progress, [0, 0.7], [0, 1.15], { extrapolateRight: 'clamp' })
      : interpolate(progress, [0.7, 1], [1.15, 1], { extrapolateRight: 'clamp' });
    
    const translateY = 20 * (1 - bounce);
    const opacity = Math.min(progress * 3, 1);
    
    return {
      char,
      visible: true,
      scale,
      translateY,
      opacity,
    };
  });
  
  return {
    letters,
    isComplete: frame >= startFrame + (text.length * letterDelayFrames) + bounceDurationFrames,
  };
};

/**
 * Get SVG attributes for handwriting cursor (pen, highlight, etc.)
 * Returns configuration object instead of JSX for use in any rendering context
 */
export const getHandwritingCursorSVG = (cursor, color = '#FF6B35') => {
  if (!cursor.visible) return null;
  
  if (cursor.type === 'pen') {
    // Simple pen icon
    const penPath = `
      M ${cursor.x} ${cursor.y}
      L ${cursor.x - 3} ${cursor.y + 15}
      L ${cursor.x + 3} ${cursor.y + 15}
      Z
    `;
    
    return {
      type: 'path',
      d: penPath,
      fill: color,
      opacity: cursor.opacity,
      transform: `rotate(${cursor.rotation} ${cursor.x} ${cursor.y})`
    };
  }
  
  if (cursor.type === 'underline') {
    return {
      type: 'line',
      x1: cursor.x,
      y1: cursor.y,
      x2: cursor.x + 5,
      y2: cursor.y,
      stroke: color,
      strokeWidth: cursor.width,
      opacity: cursor.opacity
    };
  }
  
  if (cursor.type === 'highlight') {
    return {
      type: 'rect',
      x: cursor.x,
      y: cursor.y,
      width: cursor.width,
      height: cursor.height,
      fill: color,
      opacity: cursor.opacity
    };
  }
  
  return null;
};
