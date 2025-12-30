/**
 * Layout Engine - General Layout Calculations and Utilities
 * 
 * Provides layout algorithms for arranging multiple elements,
 * calculating spacing, and managing responsive layouts.
 * 
 * @module layoutEngine
 * @category SDK
 * @subcategory Agnostic Template System
 */

import { resolvePosition, getCenteredStackBase, getStackedPosition } from './positionSystem';

/**
 * Layout arrangement types
 */
export const ARRANGEMENT_TYPES = {
  STACKED_VERTICAL: 'stacked-vertical',
  STACKED_HORIZONTAL: 'stacked-horizontal',
  GRID: 'grid',
  CIRCULAR: 'circular',
  RADIAL: 'radial',
  CASCADE: 'cascade',
  CENTERED: 'centered'
};

/**
 * Calculate positions for a list of items using specified arrangement
 * 
 * @param {Array} items - Array of items to arrange
 * @param {Object} config - Layout configuration
 * @param {string} config.arrangement - Arrangement type
 * @param {string|Object} config.basePosition - Base position token
 * @param {number} config.spacing - Spacing between items
 * @param {boolean} config.centerStack - Whether to center the stack
 * @returns {Array<Object>} Array of positions
 * 
 * @example
 * const positions = calculateItemPositions(
 *   items,
 *   { arrangement: 'stacked-vertical', basePosition: 'center', spacing: 80 }
 * );
 */
export const calculateItemPositions = (items, config) => {
  const {
    arrangement = ARRANGEMENT_TYPES.STACKED_VERTICAL,
    basePosition = 'center',
    spacing = 80,
    centerStack = true,
    viewport = { width: 1920, height: 1080 }
  } = config;
  
  switch (arrangement) {
    case ARRANGEMENT_TYPES.STACKED_VERTICAL:
      return calculateStackedPositions(items, basePosition, spacing, 'vertical', centerStack, viewport);
      
    case ARRANGEMENT_TYPES.STACKED_HORIZONTAL:
      return calculateStackedPositions(items, basePosition, spacing, 'horizontal', centerStack, viewport);
      
    case ARRANGEMENT_TYPES.GRID:
      return calculateGridPositions(items, config);
      
    case ARRANGEMENT_TYPES.CIRCULAR:
      return calculateCircularPositions(items, config);
      
    case ARRANGEMENT_TYPES.RADIAL:
      return calculateRadialPositions(items, config);
      
    case ARRANGEMENT_TYPES.CASCADE:
      return calculateCascadePositions(items, config);
      
    case ARRANGEMENT_TYPES.CENTERED:
      return calculateCenteredPositions(items, config);
      
    default:
      console.warn(`Unknown arrangement type: ${arrangement}`);
      return calculateStackedPositions(items, basePosition, spacing, 'vertical', centerStack, viewport);
  }
};

/**
 * Calculate stacked positions (vertical or horizontal)
 */
const calculateStackedPositions = (items, basePosition, spacing, direction, centerStack, viewport) => {
  let base;
  
  if (centerStack) {
    base = getCenteredStackBase(basePosition, items.length, spacing, direction, viewport);
  } else {
    base = resolvePosition(basePosition, { x: 0, y: 0 }, viewport);
  }
  
  return items.map((item, index) => {
    return getStackedPosition({ x: base.x, y: base.y }, index, spacing, direction, viewport);
  });
};

/**
 * Calculate grid positions
 */
const calculateGridPositions = (items, config) => {
  const {
    basePosition = 'center',
    columns = 3,
    columnSpacing = 100,
    rowSpacing = 100,
    centerGrid = true,
    viewport = { width: 1920, height: 1080 }
  } = config;
  
  const rows = Math.ceil(items.length / columns);
  const positions = [];
  
  // Calculate grid dimensions
  const gridWidth = (columns - 1) * columnSpacing;
  const gridHeight = (rows - 1) * rowSpacing;
  
  // Get base position
  const base = resolvePosition(basePosition, { x: 0, y: 0 }, viewport);
  
  // Calculate top-left corner
  const startX = centerGrid ? base.x - (gridWidth / 2) : base.x;
  const startY = centerGrid ? base.y - (gridHeight / 2) : base.y;
  
  items.forEach((item, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);
    
    positions.push({
      x: startX + (col * columnSpacing),
      y: startY + (row * rowSpacing)
    });
  });
  
  return positions;
};

/**
 * Calculate circular positions
 * Arranges items in a circle around center point
 */
const calculateCircularPositions = (items, config) => {
  const {
    basePosition = 'center',
    radius = 300,
    startAngle = 0,
    viewport = { width: 1920, height: 1080 }
  } = config;
  
  const center = resolvePosition(basePosition, { x: 0, y: 0 }, viewport);
  const positions = [];
  
  const angleStep = (Math.PI * 2) / items.length;
  
  items.forEach((item, index) => {
    const angle = startAngle + (index * angleStep);
    
    positions.push({
      x: center.x + (Math.cos(angle) * radius),
      y: center.y + (Math.sin(angle) * radius)
    });
  });
  
  return positions;
};

/**
 * Calculate radial positions
 * Arranges items radiating out from center
 */
const calculateRadialPositions = (items, config) => {
  const {
    basePosition = 'center',
    angles = [],
    startRadius = 100,
    radiusIncrement = 150,
    viewport = { width: 1920, height: 1080 }
  } = config;
  
  const center = resolvePosition(basePosition, { x: 0, y: 0 }, viewport);
  const positions = [];
  
  items.forEach((item, index) => {
    const angle = angles[index] || ((index * Math.PI * 2) / items.length);
    const radius = startRadius + (index * radiusIncrement);
    
    positions.push({
      x: center.x + (Math.cos(angle) * radius),
      y: center.y + (Math.sin(angle) * radius)
    });
  });
  
  return positions;
};

/**
 * Calculate cascade positions
 * Each item offset diagonally
 */
const calculateCascadePositions = (items, config) => {
  const {
    basePosition = 'center',
    offsetX = 50,
    offsetY = 50,
    viewport = { width: 1920, height: 1080 }
  } = config;
  
  const base = resolvePosition(basePosition, { x: 0, y: 0 }, viewport);
  const positions = [];
  
  items.forEach((item, index) => {
    positions.push({
      x: base.x + (index * offsetX),
      y: base.y + (index * offsetY)
    });
  });
  
  return positions;
};

/**
 * Calculate centered positions
 * All items at same position (for overlays)
 */
const calculateCenteredPositions = (items, config) => {
  const {
    basePosition = 'center',
    viewport = { width: 1920, height: 1080 }
  } = config;
  
  const center = resolvePosition(basePosition, { x: 0, y: 0 }, viewport);
  
  return items.map(() => ({ ...center }));
};

/**
 * Calculate dynamic spacing based on item count
 * Adjusts spacing to fit items within bounds
 * 
 * @param {number} itemCount - Number of items
 * @param {number} availableSpace - Available space
 * @param {number} minSpacing - Minimum spacing
 * @param {number} maxSpacing - Maximum spacing
 * @returns {number} Calculated spacing
 */
export const calculateDynamicSpacing = (itemCount, availableSpace, minSpacing = 40, maxSpacing = 120) => {
  if (itemCount <= 1) return 0;
  
  const idealSpacing = availableSpace / (itemCount - 1);
  return Math.max(minSpacing, Math.min(maxSpacing, idealSpacing));
};

/**
 * Calculate bounding box for a set of positions
 * 
 * @param {Array<Object>} positions - Array of {x, y} positions
 * @returns {Object} Bounding box {left, top, right, bottom, width, height}
 */
export const calculateBoundingBox = (positions) => {
  if (positions.length === 0) {
    return { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 };
  }
  
  const xs = positions.map(p => p.x);
  const ys = positions.map(p => p.y);
  
  const left = Math.min(...xs);
  const right = Math.max(...xs);
  const top = Math.min(...ys);
  const bottom = Math.max(...ys);
  
  return {
    left,
    top,
    right,
    bottom,
    width: right - left,
    height: bottom - top
  };
};

/**
 * Scale positions to fit within bounds
 * 
 * @param {Array<Object>} positions - Original positions
 * @param {Object} bounds - Target bounds
 * @returns {Array<Object>} Scaled positions
 */
export const scalePositionsToFit = (positions, bounds) => {
  const bbox = calculateBoundingBox(positions);
  
  if (bbox.width === 0 || bbox.height === 0) {
    return positions;
  }
  
  const scaleX = bounds.width / bbox.width;
  const scaleY = bounds.height / bbox.height;
  const scale = Math.min(scaleX, scaleY);
  
  return positions.map(pos => ({
    x: bounds.left + ((pos.x - bbox.left) * scale),
    y: bounds.top + ((pos.y - bbox.top) * scale)
  }));
};

/**
 * Get layout for specific template pattern
 * Pre-configured layouts for common template needs
 * 
 * @param {string} pattern - Pattern name
 * @param {Object} overrides - Configuration overrides
 * @returns {Object} Layout configuration
 */
export const getLayoutPattern = (pattern, overrides = {}) => {
  const patterns = {
    'question-stacked': {
      arrangement: ARRANGEMENT_TYPES.STACKED_VERTICAL,
      basePosition: 'center',
      spacing: 80,
      centerStack: true
    },
    
    'options-grid': {
      arrangement: ARRANGEMENT_TYPES.GRID,
      basePosition: 'center',
      columns: 2,
      columnSpacing: 200,
      rowSpacing: 150,
      centerGrid: true
    },
    
    'takeaways-list': {
      arrangement: ARRANGEMENT_TYPES.STACKED_VERTICAL,
      basePosition: { grid: 'center-left', offset: { x: 200, y: 0 } },
      spacing: 100,
      centerStack: true
    },
    
    'radial-connections': {
      arrangement: ARRANGEMENT_TYPES.CIRCULAR,
      basePosition: 'center',
      radius: 350,
      startAngle: -Math.PI / 2
    },
    
    'cascade-reveal': {
      arrangement: ARRANGEMENT_TYPES.CASCADE,
      basePosition: { grid: 'top-left', offset: { x: 300, y: 250 } },
      offsetX: 40,
      offsetY: 40
    }
  };
  
  const base = patterns[pattern] || patterns['question-stacked'];
  
  return {
    ...base,
    ...overrides
  };
};

/**
 * Calculate responsive font size based on text length
 * 
 * @param {string} text - Text content
 * @param {number} baseSize - Base font size
 * @param {number} threshold - Character threshold
 * @returns {number} Adjusted font size
 */
export const calculateResponsiveFontSize = (text, baseSize = 92, threshold = 30) => {
  if (!text || text.length <= threshold) {
    return baseSize;
  }
  
  // Reduce size by 10% for every 10 chars over threshold
  const overThreshold = text.length - threshold;
  const reductionFactor = 1 - ((overThreshold / 10) * 0.1);
  const minSize = baseSize * 0.6; // Don't go below 60% of base
  
  return Math.max(minSize, baseSize * reductionFactor);
};

/**
 * Check if items will overlap
 * 
 * @param {Array<Object>} items - Items with positions and dimensions
 * @returns {boolean} True if any items overlap
 */
export const checkForOverlaps = (items) => {
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const item1 = items[i];
      const item2 = items[j];
      
      const dx = Math.abs(item1.x - item2.x);
      const dy = Math.abs(item1.y - item2.y);
      
      const minDistX = (item1.width + item2.width) / 2;
      const minDistY = (item1.height + item2.height) / 2;
      
      if (dx < minDistX && dy < minDistY) {
        return true;
      }
    }
  }
  
  return false;
};

/**
 * Calculate stagger delays for list animations
 * 
 * @param {number} itemCount - Number of items
 * @param {number} totalDuration - Total duration for all items
 * @param {number} minDelay - Minimum delay between items
 * @param {number} maxDelay - Maximum delay between items
 * @returns {Array<number>} Array of delay times
 */
export const calculateStaggerDelays = (itemCount, totalDuration = 2.0, minDelay = 0.1, maxDelay = 0.5) => {
  if (itemCount <= 1) return [0];
  
  const idealDelay = totalDuration / (itemCount - 1);
  const delay = Math.max(minDelay, Math.min(maxDelay, idealDelay));
  
  return Array.from({ length: itemCount }, (_, i) => i * delay);
};
