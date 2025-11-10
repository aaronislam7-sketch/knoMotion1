/**
 * Question Renderer - Dynamic Line Rendering System
 * 
 * Enables templates to render variable numbers of text lines (1-4+)
 * with automatic positioning, staggered animations, and emphasis control.
 * Replaces hardcoded 2-line question structures.
 * 
 * @module questionRenderer
 * @category SDK
 * @subcategory Agnostic Template System
 */

import { interpolate } from 'remotion';
import { toFrames } from '../core/time';
import { resolvePosition, getCenteredStackBase, getStackedPosition } from '../layout/positionSystem';

/**
 * Default question layout configuration
 */
export const DEFAULT_QUESTION_LAYOUT = {
  arrangement: 'stacked',
  stagger: 0.3,
  verticalSpacing: 80,
  horizontalSpacing: 100,
  basePosition: 'center',
  centerStack: true
};

/**
 * Default question animation configuration
 */
export const DEFAULT_QUESTION_ANIMATION = {
  entrance: 'fadeUp',
  entranceDuration: 0.9,
  entranceDistance: 50,
  movePattern: 'firstMoves',
  emphasis: 'pulse'
};

/**
 * Calculate position for a question line
 * Handles centered stacking and positioning
 * 
 * @param {Array} lines - All question lines
 * @param {number} index - Index of current line
 * @param {Object} layout - Layout configuration
 * @param {Object} viewport - Viewport dimensions
 * @returns {Object} Position {x, y}
 */
const calculateLinePosition = (lines, index, layout, viewport) => {
  const {
    arrangement,
    verticalSpacing,
    horizontalSpacing,
    basePosition,
    centerStack,
    offset
  } = { ...DEFAULT_QUESTION_LAYOUT, ...layout };
  
  // Normalize arrangement: 'stacked' means 'vertical'
  const normalizedArrangement = arrangement === 'stacked' ? 'vertical' : arrangement;
  
  // Calculate centered base if requested
  let base;
  if (centerStack) {
    const spacing = normalizedArrangement === 'vertical' ? verticalSpacing : horizontalSpacing;
    base = getCenteredStackBase(basePosition, lines.length, spacing, normalizedArrangement, viewport);
  } else {
    base = resolvePosition(basePosition, { x: 0, y: 0 }, viewport);
  }
  
  // Apply global offset to base position
  if (offset) {
    base.x += (offset.x || 0);
    base.y += (offset.y || 0);
  }
  
  // Get stacked position
  const spacing = normalizedArrangement === 'vertical' ? verticalSpacing : horizontalSpacing;
  const direction = normalizedArrangement === 'vertical' ? 'vertical' : 'horizontal';
  
  return getStackedPosition(
    { x: base.x, y: base.y },
    index,
    spacing,
    direction,
    viewport
  );
};

/**
 * Calculate entrance animation for a line
 * Supports staggered timing
 * 
 * @param {number} frame - Current frame
 * @param {Object} beats - Scene beats
 * @param {number} index - Line index
 * @param {Object} animation - Animation configuration
 * @param {Object} easingMap - Easing functions
 * @param {number} fps - Frames per second
 * @returns {Object} Animation state {opacity, translateY}
 */
const calculateLineEntrance = (frame, beats, index, animation, easingMap, fps) => {
  const {
    entrance,
    entranceDuration,
    entranceDistance,
    stagger
  } = { ...DEFAULT_QUESTION_ANIMATION, ...animation };
  
  const baseStartTime = beats.questionStart || 0.6;
  const lineStartTime = baseStartTime + (index * (stagger || 0.3));
  const lineStartFrame = toFrames(lineStartTime, fps);
  const durationFrames = toFrames(entranceDuration, fps);
  
  // Determine entrance style
  const entranceStyle = entrance || 'fade-up';
  
  if (frame < lineStartFrame) {
    // Initial state based on entrance style
    switch (entranceStyle) {
      case 'fade-in':
        return { opacity: 0, translateY: 0, translateX: 0, scale: 1 };
      case 'slide-right':
        return { opacity: 0, translateY: 0, translateX: -100, scale: 1 };
      case 'slide-left':
        return { opacity: 0, translateY: 0, translateX: 100, scale: 1 };
      case 'scale-up':
        return { opacity: 0, translateY: 0, translateX: 0, scale: 0.5 };
      case 'bounce':
        return { opacity: 0, translateY: 60, translateX: 0, scale: 0.9 };
      case 'fade-up':
      default:
        return { opacity: 0, translateY: entranceDistance || 50, translateX: 0, scale: 0.88 };
    }
  }
  
  const easeFn = easingMap?.smooth || ((t) => t);
  const bounceEase = easingMap?.bounceOut || easeFn;
  
  const opacity = interpolate(
    frame,
    [lineStartFrame, lineStartFrame + durationFrames],
    [0, 1],
    { extrapolateRight: 'clamp', easing: easeFn }
  );
  
  // Animate based on entrance style
  let translateY = 0;
  let translateX = 0;
  let scale = 1;
  
  switch (entranceStyle) {
    case 'fade-in':
      translateY = 0;
      translateX = 0;
      scale = 1;
      break;
    
    case 'slide-right':
      translateX = interpolate(
        frame,
        [lineStartFrame, lineStartFrame + durationFrames],
        [-100, 0],
        { extrapolateRight: 'clamp', easing: easeFn }
      );
      break;
    
    case 'slide-left':
      translateX = interpolate(
        frame,
        [lineStartFrame, lineStartFrame + durationFrames],
        [100, 0],
        { extrapolateRight: 'clamp', easing: easeFn }
      );
      break;
    
    case 'scale-up':
      scale = interpolate(
        frame,
        [lineStartFrame, lineStartFrame + durationFrames],
        [0.5, 1],
        { extrapolateRight: 'clamp', easing: easeFn }
      );
      break;
    
    case 'bounce':
      translateY = interpolate(
        frame,
        [lineStartFrame, lineStartFrame + durationFrames],
        [60, 0],
        { extrapolateRight: 'clamp', easing: bounceEase }
      );
      scale = interpolate(
        frame,
        [lineStartFrame, lineStartFrame + durationFrames],
        [0.9, 1],
        { extrapolateRight: 'clamp', easing: bounceEase }
      );
      break;
    
    case 'fade-up':
    default:
      translateY = interpolate(
        frame,
        [lineStartFrame, lineStartFrame + durationFrames],
        [entranceDistance || 50, 0],
        { extrapolateRight: 'clamp', easing: easeFn }
      );
      scale = interpolate(
        frame,
        [lineStartFrame, lineStartFrame + durationFrames],
        [0.88, 1],
        { extrapolateRight: 'clamp', easing: easeFn }
      );
      break;
  }
  
  return {
    opacity,
    translateY,
    translateX,
    scale
  };
};

/**
 * Calculate move animation for a line
 * Used for "firstMoves" pattern where first line moves up
 * 
 * @param {number} frame - Current frame
 * @param {Object} beats - Scene beats
 * @param {number} index - Line index
 * @param {Object} animation - Animation configuration
 * @param {Object} easingMap - Easing functions
 * @param {number} fps - Frames per second
 * @returns {Object} Move delta {translateY}
 */
const calculateLineMove = (frame, beats, index, animation, easingMap, fps) => {
  const { movePattern } = animation;
  
  if (!movePattern || movePattern === 'none') {
    return { translateY: 0 };
  }
  
  // Only first line moves in "firstMoves" pattern
  if (movePattern === 'firstMoves' && index !== 0) {
    return { translateY: 0 };
  }
  
  const moveStartFrame = toFrames(beats.moveUp || 2.0, fps);
  const moveDuration = toFrames(0.8, fps);
  const moveDistance = -60;
  
  if (frame < moveStartFrame) {
    return { translateY: 0 };
  }
  
  const easeFn = easingMap?.power2InOut || ((t) => t);
  
  const translateY = interpolate(
    frame,
    [moveStartFrame, moveStartFrame + moveDuration],
    [0, moveDistance],
    { extrapolateRight: 'clamp', easing: easeFn }
  );
  
  return { translateY };
};

/**
 * Calculate emphasis animation (pulse) for a line
 * 
 * @param {number} frame - Current frame
 * @param {Object} beats - Scene beats
 * @param {Object} animation - Animation configuration
 * @param {Object} easingMap - Easing functions
 * @param {number} fps - Frames per second
 * @returns {Object} Emphasis state {scale}
 */
const calculateLineEmphasis = (frame, beats, animation, easingMap, fps) => {
  const { emphasis } = animation;
  
  if (!emphasis || emphasis === 'none') {
    return { scale: 1 };
  }
  
  const emphasisFrame = toFrames(beats.emphasis || 4.2, fps);
  const emphasisDuration = toFrames(0.8, fps);
  
  if (frame < emphasisFrame || frame > emphasisFrame + emphasisDuration) {
    return { scale: 1 };
  }
  
  // Pulse animation: 1 -> 1.05 -> 1
  const progress = (frame - emphasisFrame) / emphasisDuration;
  const pulseProgress = Math.sin(progress * Math.PI);
  const scale = 1 + (pulseProgress * 0.05);
  
  return { scale };
};

/**
 * Calculate exit animation for a line
 * 
 * @param {number} frame - Current frame
 * @param {Object} beats - Scene beats
 * @param {Object} animation - Animation configuration
 * @param {Object} easingMap - Easing functions
 * @param {number} fps - Frames per second
 * @returns {Object} Exit state {opacity, translateX}
 */
const calculateLineExit = (frame, beats, animation, easingMap, fps) => {
  const exitFrame = toFrames(beats.wipeQuestions || 5.5, fps);
  const exitDuration = toFrames(0.9, fps);
  
  if (frame < exitFrame) {
    return { opacity: 1, translateX: 0 };
  }
  
  const easeFn = easingMap?.power3In || ((t) => t);
  
  const opacity = interpolate(
    frame,
    [exitFrame, exitFrame + exitDuration],
    [1, 0],
    { extrapolateRight: 'clamp', easing: easeFn }
  );
  
  const translateX = interpolate(
    frame,
    [exitFrame, exitFrame + exitDuration],
    [0, -1200],
    { extrapolateRight: 'clamp', easing: easeFn }
  );
  
  return { opacity, translateX };
};

/**
 * Create SVG text element for a line
 * 
 * @param {Object} line - Line configuration
 * @param {Object} position - Line position
 * @param {Object} animState - Combined animation state
 * @param {Object} colors - Color tokens
 * @param {Object} fonts - Font tokens
 * @param {string} id - Element ID
 * @returns {SVGElement} SVG text element
 */
const createSVGTextElement = (line, position, animState, colors, fonts, id) => {
  const textGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  textGroup.setAttribute('id', id);
  textGroup.setAttribute('opacity', String(animState.opacity));
  
  const transform = `translate(${animState.translateX}, ${animState.translateY + animState.moveY}) scale(${animState.scale * animState.emphasisScale})`;
  textGroup.setAttribute('transform', transform);
  
  const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  textElement.setAttribute('x', String(position.x));
  textElement.setAttribute('y', String(position.y));
  textElement.setAttribute('text-anchor', 'middle');
  textElement.setAttribute('font-family', fonts.header || "'Cabin Sketch', cursive");
  
  // Apply emphasis scaling to font size
  const baseFontSize = fonts.size_question || 92;
  const emphasisScale = line.emphasis === 'high' ? 1.15 : 1.0;
  const fontSize = baseFontSize * emphasisScale;
  
  textElement.setAttribute('font-size', String(fontSize));
  textElement.setAttribute('font-weight', '700');
  
  // Apply color based on emphasis
  const color = line.emphasis === 'high' ? colors.accent : colors.ink;
  textElement.setAttribute('fill', color);
  
  textElement.textContent = line.text;
  
  textGroup.appendChild(textElement);
  
  return textGroup;
};

/**
 * Render question lines dynamically
 * Main entry point for rendering variable-length questions
 * 
 * @param {Array} lines - Array of line objects {text, emphasis}
 * @param {Object} layout - Layout configuration
 * @param {Object} animation - Animation configuration
 * @param {number} frame - Current frame
 * @param {Object} beats - Scene beats
 * @param {Object} colors - Color tokens
 * @param {Object} fonts - Font tokens
 * @param {Object} easingMap - Easing functions
 * @param {number} fps - Frames per second
 * @param {Function} idFactory - ID generation function
 * @param {Object} viewport - Viewport dimensions
 * @returns {Array<SVGElement>} Array of SVG text elements
 * 
 * @example
 * const elements = renderQuestionLines(
 *   [
 *     { text: "What if geography", emphasis: "normal" },
 *     { text: "was measured in mindsets?", emphasis: "high" }
 *   ],
 *   { arrangement: 'stacked', stagger: 0.3 },
 *   { entrance: 'fadeUp' },
 *   frame, beats, colors, fonts, easingMap, fps, id
 * );
 */
export const renderQuestionLines = (
  lines,
  layout,
  animation,
  frame,
  beats,
  colors,
  fonts,
  easingMap,
  fps,
  idFactory = (key) => key,
  viewport = { width: 1920, height: 1080 }
) => {
  if (!lines || lines.length === 0) {
    return [];
  }
  
  const elements = [];
  
  lines.forEach((line, index) => {
    // Calculate position
    const position = calculateLinePosition(lines, index, layout, viewport);
    
    // Calculate entrance animation
    const entrance = calculateLineEntrance(frame, beats, index, animation, easingMap, fps);
    
    // Calculate move animation
    const move = calculateLineMove(frame, beats, index, animation, easingMap, fps);
    
    // Calculate emphasis
    const emphasis = calculateLineEmphasis(frame, beats, animation, easingMap, fps);
    
    // Calculate exit
    const exit = calculateLineExit(frame, beats, animation, easingMap, fps);
    
    // Combine animation states
    const animState = {
      opacity: entrance.opacity * exit.opacity,
      translateY: entrance.translateY,
      translateX: exit.translateX,
      moveY: move.translateY || 0,
      scale: entrance.scale,
      emphasisScale: emphasis.scale
    };
    
    // Create SVG element
    const element = createSVGTextElement(
      line,
      position,
      animState,
      colors,
      fonts,
      idFactory(`question-line-${index}`)
    );
    
    elements.push(element);
  });
  
  return elements;
};

/**
 * Get question visibility range
 * Returns frame range where questions are visible
 * 
 * @param {Array} lines - Question lines
 * @param {Object} beats - Scene beats
 * @param {Object} animation - Animation configuration
 * @param {number} fps - Frames per second
 * @returns {Object} Range {startFrame, endFrame}
 */
export const getQuestionVisibilityRange = (lines, beats, animation, fps) => {
  const baseStartTime = beats.questionStart || 0.6;
  const stagger = animation.stagger || 0.3;
  const lastLineStart = baseStartTime + ((lines.length - 1) * stagger);
  const entranceDuration = animation.entranceDuration || 0.9;
  
  const startFrame = toFrames(baseStartTime, fps);
  const endFrame = toFrames(beats.wipeQuestions || 5.5, fps) + toFrames(0.9, fps);
  
  return { startFrame, endFrame };
};

/**
 * Validate question configuration
 * Checks if question config is valid
 * 
 * @param {Object} config - Question configuration
 * @returns {Object} Validation result {valid, errors}
 */
export const validateQuestionConfig = (config) => {
  const errors = [];
  
  if (!config.lines || !Array.isArray(config.lines)) {
    errors.push('Question must have a lines array');
  }
  
  if (config.lines && config.lines.length === 0) {
    errors.push('Question lines array cannot be empty');
  }
  
  if (config.lines && config.lines.length > 4) {
    errors.push('Question supports maximum 4 lines (recommended for readability)');
  }
  
  config.lines?.forEach((line, i) => {
    if (!line.text) {
      errors.push(`Line ${i} is missing text`);
    }
    
    if (line.text && line.text.length > 50) {
      errors.push(`Line ${i} text is too long (${line.text.length} chars, max 50 recommended)`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Create default question configuration
 * Helper for backward compatibility
 * 
 * @param {string} part1 - First line text
 * @param {string} part2 - Second line text (optional)
 * @returns {Object} Question configuration
 */
export const createQuestionFromParts = (part1, part2 = null) => {
  const lines = [
    { text: part1, emphasis: 'normal' }
  ];
  
  if (part2) {
    lines.push({ text: part2, emphasis: 'high' });
  }
  
  return {
    lines,
    layout: DEFAULT_QUESTION_LAYOUT,
    animation: DEFAULT_QUESTION_ANIMATION
  };
};
