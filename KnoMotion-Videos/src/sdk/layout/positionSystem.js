/**
 * Position System - Token-Based Positioning with 9-Point Grid
 * 
 * Provides a declarative positioning system based on semantic tokens.
 * Supports multiple precision levels: grid tokens → offsets → percentages → absolute pixels.
 * 
 * UPDATED: Now supports dynamic viewport-aware positioning for mobile/desktop formats.
 * 
 * @module positionSystem
 * @category SDK
 * @subcategory Agnostic Template System
 */

import {
  calculatePositionGrid,
  VIEWPORT_PRESETS,
  DEFAULT_FORMAT,
  detectFormat,
  isMobileFormat,
} from './viewportPresets';

/**
 * Viewport configuration
 * Default 16:9 HD resolution (desktop)
 * 
 * For mobile, use { width: 1080, height: 1920 } or import from viewportPresets
 */
export const DEFAULT_VIEWPORT = {
  width: VIEWPORT_PRESETS.desktop.width,
  height: VIEWPORT_PRESETS.desktop.height,
};

/**
 * 9-Point Grid Reference System
 * 
 * LEGACY: Static grid for 16:9 aspect ratio (1920x1080)
 * For dynamic viewport-aware positioning, use getPositionGrid(viewport) instead.
 * 
 * Layout (desktop 1920x1080):
 * ```
 * top-left        top-center        top-right
 * (320, 180)      (960, 180)        (1600, 180)
 * 
 * center-left     center            center-right
 * (320, 540)      (960, 540)        (1600, 540)
 * 
 * bottom-left     bottom-center     bottom-right
 * (320, 900)      (960, 900)        (1600, 900)
 * ```
 * 
 * @deprecated Use getPositionGrid(viewport) for format-aware positioning
 */
export const POSITION_GRID = calculatePositionGrid(DEFAULT_VIEWPORT);

/**
 * Get dynamic position grid for a specific viewport
 * 
 * This is the recommended way to get grid positions as it adapts
 * to both desktop (1920x1080) and mobile (1080x1920) formats.
 * 
 * @param {Object} viewport - Viewport dimensions { width, height }
 * @returns {Object} Map of grid position names to {x, y} coordinates
 * 
 * @example
 * // Desktop
 * const desktopGrid = getPositionGrid({ width: 1920, height: 1080 });
 * desktopGrid.center // → { x: 960, y: 540 }
 * 
 * // Mobile
 * const mobileGrid = getPositionGrid({ width: 1080, height: 1920 });
 * mobileGrid.center // → { x: 540, y: 960 }
 */
export const getPositionGrid = (viewport = DEFAULT_VIEWPORT) => {
  return calculatePositionGrid(viewport);
};

/**
 * Resolve position token to absolute coordinates
 * Supports multiple input formats for progressive configuration
 * 
 * NOW VIEWPORT-AWARE: Uses dynamic grid positions based on viewport dimensions.
 * 
 * @param {string|Object} token - Position specification
 * @param {Object} offset - Optional offset from grid position
 * @param {Object} viewport - Viewport dimensions { width, height }
 * @returns {Object} Absolute position {x, y}
 * 
 * @example
 * // Simple grid token (desktop)
 * resolvePosition('center', {}, { width: 1920, height: 1080 }) 
 * // => { x: 960, y: 540 }
 * 
 * @example
 * // Simple grid token (mobile)
 * resolvePosition('center', {}, { width: 1080, height: 1920 }) 
 * // => { x: 540, y: 960 }
 * 
 * @example
 * // Grid with offset
 * resolvePosition({ grid: 'center', offset: { x: 0, y: 120 } })
 * // => { x: 960, y: 660 }
 * 
 * @example
 * // Percentage
 * resolvePosition({ x: '50%', y: '30%' })
 * // => { x: 960, y: 324 }
 * 
 * @example
 * // Absolute pixels
 * resolvePosition({ x: 800, y: 400 })
 * // => { x: 800, y: 400 }
 */
export const resolvePosition = (token, offset = { x: 0, y: 0 }, viewport = DEFAULT_VIEWPORT) => {
  // Get dynamic position grid for this viewport
  const positionGrid = getPositionGrid(viewport);
  
  // Format 1: Simple grid token string
  if (typeof token === 'string') {
    const gridPos = positionGrid[token];
    
    if (!gridPos) {
      console.warn(`Unknown position token: "${token}". Using center.`);
      return {
        x: positionGrid['center'].x + offset.x,
        y: positionGrid['center'].y + offset.y
      };
    }
    
    return {
      x: gridPos.x + offset.x,
      y: gridPos.y + offset.y
    };
  }
  
  // Format 2: Grid + offset object
  if (token.grid) {
    const gridPos = positionGrid[token.grid];
    
    if (!gridPos) {
      console.warn(`Unknown position grid: "${token.grid}". Using center.`);
      return {
        x: positionGrid['center'].x + (token.offset?.x || 0),
        y: positionGrid['center'].y + (token.offset?.y || 0)
      };
    }
    
    return {
      x: gridPos.x + (token.offset?.x || 0),
      y: gridPos.y + (token.offset?.y || 0)
    };
  }
  
  // Format 3: Percentage
  if (typeof token.x === 'string' && token.x.includes('%')) {
    return {
      x: (parseFloat(token.x) / 100) * viewport.width,
      y: (parseFloat(token.y) / 100) * viewport.height
    };
  }
  
  // Format 4: Absolute pixels
  if (typeof token.x === 'number' && typeof token.y === 'number') {
    return {
      x: token.x,
      y: token.y
    };
  }
  
  // Fallback to center
  console.warn('Invalid position token format. Using center.', token);
  return positionGrid['center'];
};

/**
 * Convert position to CSS transform
 * Useful for absolutely positioned elements
 * 
 * @param {Object} position - Position coordinates
 * @param {string} anchor - Transform anchor ('center', 'top-left', etc.)
 * @returns {Object} CSS properties
 * 
 * @example
 * positionToCSS({ x: 960, y: 540 }, 'center')
 * // => { left: '960px', top: '540px', transform: 'translate(-50%, -50%)' }
 */
export const positionToCSS = (position, anchor = 'center') => {
  const anchorTransforms = {
    'center': 'translate(-50%, -50%)',
    'top-left': 'translate(0, 0)',
    'top-center': 'translate(-50%, 0)',
    'top-right': 'translate(-100%, 0)',
    'center-left': 'translate(0, -50%)',
    'center-right': 'translate(-100%, -50%)',
    'bottom-left': 'translate(0, -100%)',
    'bottom-center': 'translate(-50%, -100%)',
    'bottom-right': 'translate(-100%, -100%)'
  };
  
  return {
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
    transform: anchorTransforms[anchor] || anchorTransforms['center']
  };
};

/**
 * Convert position to SVG attributes
 * Useful for SVG text and shapes
 * 
 * @param {Object} position - Position coordinates
 * @param {string} textAnchor - SVG text anchor ('middle', 'start', 'end')
 * @returns {Object} SVG attributes
 * 
 * @example
 * positionToSVG({ x: 960, y: 540 }, 'middle')
 * // => { x: 960, y: 540, textAnchor: 'middle' }
 */
export const positionToSVG = (position, textAnchor = 'middle') => {
  return {
    x: position.x,
    y: position.y,
    textAnchor: textAnchor
  };
};

/**
 * Calculate position for stacked elements
 * Useful for lists, multiple text lines, etc.
 * 
 * @param {string|Object} basePosition - Base position token
 * @param {number} index - Element index (0-based)
 * @param {number} spacing - Vertical spacing between elements
 * @param {string} direction - Stack direction ('vertical', 'horizontal')
 * @returns {Object} Calculated position
 * 
 * @example
 * // Stack 3 text lines vertically
 * const line1Pos = getStackedPosition('center', 0, 80, 'vertical');
 * const line2Pos = getStackedPosition('center', 1, 80, 'vertical');
 * const line3Pos = getStackedPosition('center', 2, 80, 'vertical');
 */
export const getStackedPosition = (basePosition, index, spacing, direction = 'vertical', viewport = DEFAULT_VIEWPORT) => {
  const base = resolvePosition(basePosition, { x: 0, y: 0 }, viewport);
  
  if (direction === 'vertical') {
    return {
      x: base.x,
      y: base.y + (index * spacing)
    };
  } else if (direction === 'horizontal') {
    return {
      x: base.x + (index * spacing),
      y: base.y
    };
  }
  
  return base;
};

/**
 * Calculate centered position for dynamic content
 * Automatically adjusts base position to center a stack of items
 * 
 * @param {string|Object} basePosition - Base position token
 * @param {number} itemCount - Number of items to stack
 * @param {number} spacing - Spacing between items
 * @param {string} direction - Stack direction
 * @returns {Object} Adjusted base position
 * 
 * @example
 * // Center 3 lines vertically
 * const centeredBase = getCenteredStackBase('center', 3, 80, 'vertical');
 * // Now stack items from this base
 */
export const getCenteredStackBase = (basePosition, itemCount, spacing, direction = 'vertical', viewport = DEFAULT_VIEWPORT) => {
  const base = resolvePosition(basePosition, { x: 0, y: 0 }, viewport);
  const totalSize = (itemCount - 1) * spacing;
  const offset = totalSize / 2;
  
  if (direction === 'vertical') {
    return {
      x: base.x,
      y: base.y - offset
    };
  } else if (direction === 'horizontal') {
    return {
      x: base.x - offset,
      y: base.y
    };
  }
  
  return base;
};

/**
 * Get relative position from two tokens
 * Useful for positioning elements relative to others
 * 
 * @param {string|Object} fromPosition - Starting position
 * @param {string|Object} toPosition - Target position
 * @returns {Object} Delta {dx, dy}
 * 
 * @example
 * const delta = getRelativePosition('center', 'top-right');
 * // => { dx: 640, dy: -360 }
 */
export const getRelativePosition = (fromPosition, toPosition, viewport = DEFAULT_VIEWPORT) => {
  const from = resolvePosition(fromPosition, { x: 0, y: 0 }, viewport);
  const to = resolvePosition(toPosition, { x: 0, y: 0 }, viewport);
  
  return {
    dx: to.x - from.x,
    dy: to.y - from.y
  };
};

/**
 * Check if position is within viewport bounds
 * Useful for validation and boundary checking
 * 
 * @param {Object} position - Position to check
 * @param {Object} viewport - Viewport dimensions
 * @returns {boolean} True if within bounds
 */
export const isWithinBounds = (position, viewport = DEFAULT_VIEWPORT) => {
  return position.x >= 0 && 
         position.x <= viewport.width && 
         position.y >= 0 && 
         position.y <= viewport.height;
};

/**
 * Clamp position to viewport bounds
 * Ensures position stays within visible area
 * 
 * @param {Object} position - Position to clamp
 * @param {Object} viewport - Viewport dimensions
 * @returns {Object} Clamped position
 */
export const clampPosition = (position, viewport = DEFAULT_VIEWPORT) => {
  return {
    x: Math.max(0, Math.min(viewport.width, position.x)),
    y: Math.max(0, Math.min(viewport.height, position.y))
  };
};

/**
 * Get all available grid token names
 * Useful for UI builders and validation
 * 
 * @param {Object} viewport - Optional viewport for format-specific tokens
 * @returns {Array<string>} Array of grid token names
 */
export const getGridTokens = (viewport = DEFAULT_VIEWPORT) => {
  const grid = getPositionGrid(viewport);
  return Object.keys(grid);
};

/**
 * Validate position token
 * Checks if a position token is valid
 * 
 * @param {string|Object} token - Position token to validate
 * @param {Object} viewport - Optional viewport for format-specific validation
 * @returns {boolean} True if valid
 */
export const isValidPositionToken = (token, viewport = DEFAULT_VIEWPORT) => {
  const grid = getPositionGrid(viewport);
  
  if (typeof token === 'string') {
    return token in grid;
  }
  
  if (token && typeof token === 'object') {
    if (token.grid) {
      return token.grid in grid;
    }
    
    if (token.x !== undefined && token.y !== undefined) {
      return true;
    }
  }
  
  return false;
};

/**
 * Create position config builder
 * Fluent API for building position configurations
 * 
 * @param {string} gridToken - Starting grid position
 * @returns {Object} Position builder with chainable methods
 * 
 * @example
 * const pos = position('center')
 *   .offset(0, 120)
 *   .build();
 */
export const position = (gridToken) => {
  let config = { grid: gridToken, offset: { x: 0, y: 0 } };
  
  return {
    offset: (x, y) => {
      config.offset = { x, y };
      return position(gridToken);
    },
    build: () => config
  };
};

/**
 * Default position configurations for common use cases
 */
export const POSITION_PRESETS = {
  // Text positioning
  headerDefault: 'top-center',
  subtitleDefault: 'bottom-center',
  bodyDefault: 'center',
  
  // Hero positioning
  heroCenter: 'center',
  heroRight: 'center-right',
  heroLeft: 'center-left',
  
  // UI positioning
  closeButton: 'top-right',
  backButton: 'top-left',
  continueButton: 'bottom-right',
  
  // Layout anchors
  contentTop: { grid: 'top-center', offset: { x: 0, y: 100 } },
  contentCenter: 'center',
  contentBottom: { grid: 'bottom-center', offset: { x: 0, y: -100 } }
};

// ============================================================================
// RE-EXPORTS FROM VIEWPORT PRESETS
// ============================================================================

// Re-export viewport preset utilities for convenience
export {
  detectFormat,
  isMobileFormat,
  VIEWPORT_PRESETS,
  DEFAULT_FORMAT,
} from './viewportPresets';
