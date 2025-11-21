/**
 * Layout Engine - General Layout Calculations and Utilities
 *
 * Single source of truth for:
 * - Layout arrangement types (stack, grid, circular, etc.)
 * - Canvas / area helpers (title safe-area, content area)
 * - Position calculations that scenes + mid-level components can reuse
 */

import { resolvePosition, getCenteredStackBase, getStackedPosition } from './positionSystem';
import {
  detectCollisions,
  autoResolveCollisions,
} from '../validation/collision-detection';

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
  CENTERED: 'centered',
};

/**
 * @typedef {Object} LayoutArea
 * @property {number} left
 * @property {number} top
 * @property {number} width
 * @property {number} height
 */

/**
 * @typedef {Object} Viewport
 * @property {number} width
 * @property {number} height
 */

/**
 * Create standard canvas areas:
 * - full canvas
 * - title safe area (optional)
 * - content area (always excludes title/footer if provided)
 *
 * @param {Object} params
 * @param {Viewport} params.viewport
 * @param {number} [params.padding]
 * @param {number} [params.titleHeight]
 * @param {number} [params.footerHeight]
 */
export const createLayoutAreas = ({
  viewport,
  padding = 80,
  titleHeight = 0,
  footerHeight = 0,
}) => {
  /** @type {LayoutArea} */
  const canvas = {
    left: 0,
    top: 0,
    width: viewport.width,
    height: viewport.height,
  };

  /** @type {LayoutArea|null} */
  const title =
    titleHeight > 0
      ? {
          left: padding,
          top: padding,
          width: viewport.width - padding * 2,
          height: titleHeight,
        }
      : null;

  const contentTop = padding + (titleHeight || 0);
  const contentBottomPadding = padding + (footerHeight || 0);

  /** @type {LayoutArea} */
  const content = {
    left: padding,
    top: contentTop,
    width: viewport.width - padding * 2,
    height: viewport.height - contentTop - contentBottomPadding,
  };

  /** @type {LayoutArea|null} */
  const footer =
    footerHeight > 0
      ? {
          left: padding,
          top: viewport.height - padding - footerHeight,
          width: viewport.width - padding * 2,
          height: footerHeight,
        }
      : null;

  return { canvas, title, content, footer };
};

/**
 * Calculate positions for a list of items using specified arrangement.
 *
 * Supports:
 * - STACKED_VERTICAL / STACKED_HORIZONTAL
 * - GRID
 * - CIRCULAR
 * - RADIAL
 * - CASCADE
 * - CENTERED
 *
 * NOTE:
 * - Most templates should pass an `area` (e.g. content area) rather than raw basePosition.
 * - Can optionally enable collision detection to ensure elements don't overlap.
 *
 * @param {any[]} items
 * @param {Object} [config]
 * @param {string} [config.arrangement] - Arrangement type
 * @param {boolean} [config.enableCollisionDetection=false] - Enable collision detection
 * @param {number} [config.minSpacing=20] - Minimum spacing when collision detection enabled
 * @param {Object} [config.viewport] - Viewport dimensions for bounds checking
 * @returns {Array|Object} Positions array, or object with positions/warnings/errors if collision detection enabled
 */
export const calculateItemPositions = (items, config = {}) => {
  const {
    arrangement = ARRANGEMENT_TYPES.STACKED_VERTICAL,
    enableCollisionDetection = false,
    minSpacing = 20,
    viewport = { width: 1920, height: 1080 },
    ...restConfig
  } = config;

  let positions;

  // Calculate positions using arrangement type
  switch (arrangement) {
    case ARRANGEMENT_TYPES.STACKED_VERTICAL:
      positions = calculateStackedPositions(items, {
        ...restConfig,
        direction: 'vertical',
        viewport,
      });
      break;

    case ARRANGEMENT_TYPES.STACKED_HORIZONTAL:
      positions = calculateStackedPositions(items, {
        ...restConfig,
        direction: 'horizontal',
        viewport,
      });
      break;

    case ARRANGEMENT_TYPES.GRID:
      positions = calculateGridPositions(items, { ...restConfig, viewport });
      break;

    case ARRANGEMENT_TYPES.CIRCULAR:
      positions = calculateCircularPositions(items, { ...restConfig, viewport });
      break;

    case ARRANGEMENT_TYPES.RADIAL:
      positions = calculateRadialPositions(items, { ...restConfig, viewport });
      break;

    case ARRANGEMENT_TYPES.CASCADE:
      positions = calculateCascadePositions(items, { ...restConfig, viewport });
      break;

    case ARRANGEMENT_TYPES.CENTERED:
      positions = calculateCenteredPositions(items, { ...restConfig, viewport });
      break;

    default:
      console.warn(`Unknown arrangement type: ${arrangement}`);
      positions = calculateStackedPositions(items, {
        ...restConfig,
        direction: 'vertical',
        viewport,
      });
  }

  // Apply collision detection if enabled
  if (enableCollisionDetection) {
    // Ensure positions have width/height for collision detection
    // If not provided, use defaults based on arrangement
    const positionsWithDimensions = positions.map((pos, index) => {
      if (pos.width && pos.height) {
        return { ...pos, id: pos.id || `item-${index}` };
      }
      // Default dimensions if not provided
      return {
        ...pos,
        id: pos.id || `item-${index}`,
        width: pos.width || 200,
        height: pos.height || 100,
      };
    });

    // Enforce minimum spacing
    const adjusted = enforceMinimumSpacing(positionsWithDimensions, minSpacing);

    // Validate layout
    const validation = validateLayout(adjusted, viewport);

    // Return with validation results
    return {
      positions: adjusted,
      warnings: validation.warnings,
      errors: validation.errors,
      valid: validation.valid,
    };
  }

  // Return positions array (backward compatible)
  return positions;
};

/**
 * STACKED POSITIONS
 * - Vertical or horizontal stack
 * - Optionally centred inside an area
 *
 * @param {any[]} items
 * @param {Object} config
 */
const calculateStackedPositions = (items, config) => {
  const {
    viewport = { width: 1920, height: 1080 },
    area,
    basePosition = 'center',
    spacing = 80,
    centerStack = true,
    direction = 'vertical',
  } = config;

  let base;

  if (area) {
    // Centre of the provided area
    base = {
      x: area.left + area.width / 2,
      y: area.top + area.height / 2,
    };
  } else if (centerStack) {
    base = getCenteredStackBase(basePosition, items.length, spacing, direction, viewport);
  } else {
    base = resolvePosition(basePosition, { x: 0, y: 0 }, viewport);
  }

  return items.map((_, index) =>
    getStackedPosition({ x: base.x, y: base.y }, index, spacing, direction, viewport),
  );
};

/**
 * GRID POSITIONS
 *
 * - Accepts a `content area` so grids never trample title safe-areas
 * - Returns x, y, width, height per slot
 * - Handles min/max tile size and centring inside the area
 *
 * @param {any[]} items
 * @param {Object} config
 */
const calculateGridPositions = (items, config) => {
  const {
    viewport = { width: 1920, height: 1080 },
    area,
    basePosition = 'center',
    columns = 3,
    gap,
    columnSpacing,
    rowSpacing,
    itemSize,
    itemWidth,
    itemHeight,
    centerGrid = true,
  } = config;

  const count = items.length;
  if (count === 0) return [];

  const rows = Math.ceil(count / columns);

  /** @type {LayoutArea} */
  const contentArea = area || {
    left: 0,
    top: 0,
    width: viewport.width,
    height: viewport.height,
  };

  const colGap = gap ?? columnSpacing ?? 40;
  const rowGap = gap ?? rowSpacing ?? 40;

  const maxTileWidth = (contentArea.width - colGap * (columns - 1)) / columns;
  const maxTileHeight = (contentArea.height - rowGap * (rows - 1)) / rows;

  let tileW = itemWidth ?? itemSize ?? maxTileWidth;
  let tileH = itemHeight ?? itemSize ?? maxTileHeight;

  tileW = Math.min(tileW, maxTileWidth);
  tileH = Math.min(tileH, maxTileHeight);

  const gridWidth = columns * tileW + colGap * (columns - 1);
  const gridHeight = rows * tileH + rowGap * (rows - 1);

  let startX;
  let startY;

  if (centerGrid) {
    const leftoverX = contentArea.width - gridWidth;
    const leftoverY = contentArea.height - gridHeight;
    startX = contentArea.left + leftoverX / 2;
    startY = contentArea.top + leftoverY / 2;
  } else {
    startX = contentArea.left;
    startY = contentArea.top;
  }

  const positions = [];

  items.forEach((_, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);

    const x = startX + col * (tileW + colGap);
    const y = startY + row * (tileH + rowGap);

    positions.push({
      x: x + tileW / 2, // centre coords (for easier card centering)
      y: y + tileH / 2,
      width: tileW,
      height: tileH,
      row,
      column: col,
    });
  });

  return positions;
};

/**
 * CIRCULAR POSITIONS
 * Arranges items in a circle around a centre point
 *
 * @param {any[]} items
 * @param {Object} config
 */
const calculateCircularPositions = (items, config) => {
  const {
    viewport = { width: 1920, height: 1080 },
    area,
    basePosition = 'center',
    radius = 300,
    startAngle = 0,
  } = config;

  const centre = area
    ? {
        x: area.left + area.width / 2,
        y: area.top + area.height / 2,
      }
    : resolvePosition(basePosition, { x: 0, y: 0 }, viewport);

  const positions = [];
  const angleStep = (Math.PI * 2) / items.length;

  items.forEach((_, index) => {
    const angle = startAngle + index * angleStep;
    positions.push({
      x: centre.x + Math.cos(angle) * radius,
      y: centre.y + Math.sin(angle) * radius,
    });
  });

  return positions;
};

/**
 * RADIAL POSITIONS
 * Items radiate outward from centre with increasing radius
 *
 * @param {any[]} items
 * @param {Object} config
 */
const calculateRadialPositions = (items, config) => {
  const {
    viewport = { width: 1920, height: 1080 },
    area,
    basePosition = 'center',
    angles = [],
    startRadius = 100,
    radiusIncrement = 150,
  } = config;

  const centre = area
    ? {
        x: area.left + area.width / 2,
        y: area.top + area.height / 2,
      }
    : resolvePosition(basePosition, { x: 0, y: 0 }, viewport);

  const positions = [];

  items.forEach((_, index) => {
    const angle = angles[index] || (index * Math.PI * 2) / items.length;
    const radius = startRadius + index * radiusIncrement;

    positions.push({
      x: centre.x + Math.cos(angle) * radius,
      y: centre.y + Math.sin(angle) * radius,
    });
  });

  return positions;
};

/**
 * CASCADE POSITIONS
 * Each item offset diagonally from a base point
 *
 * @param {any[]} items
 * @param {Object} config
 */
const calculateCascadePositions = (items, config) => {
  const {
    viewport = { width: 1920, height: 1080 },
    area,
    basePosition = 'center',
    offsetX = 50,
    offsetY = 50,
  } = config;

  const base = area
    ? {
        x: area.left + area.width / 2,
        y: area.top + area.height / 2,
      }
    : resolvePosition(basePosition, { x: 0, y: 0 }, viewport);

  return items.map((_, index) => ({
    x: base.x + index * offsetX,
    y: base.y + index * offsetY,
  }));
};

/**
 * CENTERED POSITIONS
 * All items share same centre (for overlays / z-layers)
 *
 * @param {any[]} items
 * @param {Object} config
 */
const calculateCenteredPositions = (items, config) => {
  const {
    viewport = { width: 1920, height: 1080 },
    area,
    basePosition = 'center',
  } = config;

  const centre = area
    ? {
        x: area.left + area.width / 2,
        y: area.top + area.height / 2,
      }
    : resolvePosition(basePosition, { x: 0, y: 0 }, viewport);

  return items.map(() => ({ ...centre }));
};

/**
 * Calculate dynamic spacing based on item count
 *
 * @param {number} itemCount
 * @param {number} availableSpace
 * @param {number} [minSpacing]
 * @param {number} [maxSpacing]
 */
export const calculateDynamicSpacing = (
  itemCount,
  availableSpace,
  minSpacing = 40,
  maxSpacing = 120,
) => {
  if (itemCount <= 1) return 0;
  const idealSpacing = availableSpace / (itemCount - 1);
  return Math.max(minSpacing, Math.min(maxSpacing, idealSpacing));
};

/**
 * Calculate bounding box for a set of positions
 *
 * @param {{x:number,y:number}[]} positions
 */
export const calculateBoundingBox = (positions) => {
  if (!positions.length) {
    return { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 };
  }

  const xs = positions.map((p) => p.x);
  const ys = positions.map((p) => p.y);

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
    height: bottom - top,
  };
};

/**
 * Scale positions to fit within bounds
 *
 * @param {{x:number,y:number}[]} positions
 * @param {LayoutArea} bounds
 */
export const scalePositionsToFit = (positions, bounds) => {
  const bbox = calculateBoundingBox(positions);
  if (bbox.width === 0 || bbox.height === 0) return positions;

  const scaleX = bounds.width / bbox.width;
  const scaleY = bounds.height / bbox.height;
  const scale = Math.min(scaleX, scaleY);

  return positions.map((pos) => ({
    x: bounds.left + (pos.x - bbox.left) * scale,
    y: bounds.top + (pos.y - bbox.top) * scale,
  }));
};

/**
 * Generic layout presets.
 * Kept light – scenes can still define their own configs on top.
 *
 * @param {string} pattern
 * @param {Record<string, any>} [overrides]
 */
export const getLayoutPattern = (pattern, overrides = {}) => {
  const patterns = {
    'question-stacked': {
      arrangement: ARRANGEMENT_TYPES.STACKED_VERTICAL,
      spacing: 80,
      centerStack: true,
    },
    'options-grid': {
      arrangement: ARRANGEMENT_TYPES.GRID,
      columns: 2,
      gap: 40,
      centerGrid: true,
    },
    'takeaways-list': {
      arrangement: ARRANGEMENT_TYPES.STACKED_VERTICAL,
      spacing: 100,
      centerStack: true,
    },
    'radial-connections': {
      arrangement: ARRANGEMENT_TYPES.CIRCULAR,
      radius: 350,
      startAngle: -Math.PI / 2,
    },
    'cascade-reveal': {
      arrangement: ARRANGEMENT_TYPES.CASCADE,
      offsetX: 40,
      offsetY: 40,
    },
  };

  const base = patterns[pattern] || patterns['question-stacked'];
  return { ...base, ...overrides };
};

/**
 * Responsive font sizing helper
 *
 * @param {string} text
 * @param {number} [baseSize]
 * @param {number} [threshold]
 */
export const calculateResponsiveFontSize = (
  text,
  baseSize = 92,
  threshold = 30,
) => {
  if (!text || text.length <= threshold) return baseSize;

  const overThreshold = text.length - threshold;
  const reductionFactor = 1 - (overThreshold / 10) * 0.1;
  const minSize = baseSize * 0.6;

  return Math.max(minSize, baseSize * reductionFactor);
};

/**
 * Simple overlap check when width/height are known
 *
 * @param {{x:number,y:number,width:number,height:number}[]} items
 */
export const checkForOverlaps = (items) => {
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const a = items[i];
      const b = items[j];

      const dx = Math.abs(a.x - b.x);
      const dy = Math.abs(a.y - b.y);
      const minDistX = (a.width + b.width) / 2;
      const minDistY = (a.height + b.height) / 2;

      if (dx < minDistX && dy < minDistY) {
        return true;
      }
    }
  }
  return false;
};

/**
 * Stagger delays for list / grid animations
 *
 * @param {number} itemCount
 * @param {number} [totalDuration]
 * @param {number} [minDelay]
 * @param {number} [maxDelay]
 */
export const calculateStaggerDelays = (
  itemCount,
  totalDuration = 2.0,
  minDelay = 0.1,
  maxDelay = 0.5,
) => {
  if (itemCount <= 1) return [0];

  const idealDelay = totalDuration / (itemCount - 1);
  const delay = Math.max(minDelay, Math.min(maxDelay, idealDelay));

  return Array.from({ length: itemCount }, (_, i) => i * delay);
};

/**
 * ========================================
 * COLLISION DETECTION & SAFE POSITIONING
 * ========================================
 * Integrated from layout-resolver.js
 */

/**
 * Find safe position that avoids collisions with existing elements
 * Uses expanding circle search to find collision-free position
 *
 * @param {Object} element - Element with x, y, width, height, id
 * @param {Array} existingElements - Array of existing elements to avoid
 * @param {Object} [options] - Configuration
 * @param {Object} [options.preferredPosition] - Preferred position {x, y}
 * @param {number} [options.searchRadius=200] - Maximum search radius
 * @param {number} [options.stepSize=20] - Step size for search
 * @param {Object} [options.constraints] - Bounds constraints {minX, maxX, minY, maxY}
 * @returns {Object} Safe position {x, y}
 */
export const findSafePosition = (element, existingElements, options = {}) => {
  const {
    preferredPosition = { x: element.x, y: element.y },
    searchRadius = 200,
    stepSize = 20,
    constraints = {},
  } = options;

  // Create bounding box for the element at preferred position
  let testBox = {
    ...element,
    x: preferredPosition.x,
    y: preferredPosition.y,
  };

  // Check if preferred position is collision-free
  const collisions = detectCollisions([testBox, ...existingElements]);
  if (collisions.length === 0) {
    return preferredPosition;
  }

  // Search in expanding circles for a safe position
  const angles = [0, 45, 90, 135, 180, 225, 270, 315];

  for (let radius = stepSize; radius <= searchRadius; radius += stepSize) {
    for (let angle of angles) {
      const radian = (angle * Math.PI) / 180;
      const testX = preferredPosition.x + Math.cos(radian) * radius;
      const testY = preferredPosition.y + Math.sin(radian) * radius;

      // Check constraints
      if (constraints.minX && testX < constraints.minX) continue;
      if (constraints.maxX && testX > constraints.maxX) continue;
      if (constraints.minY && testY < constraints.minY) continue;
      if (constraints.maxY && testY > constraints.maxY) continue;

      testBox = { ...element, x: testX, y: testY };
      const testCollisions = detectCollisions([testBox, ...existingElements]);

      if (testCollisions.length === 0) {
        return { x: testX, y: testY };
      }
    }
  }

  // If no safe position found, return preferred position with warning
  console.warn(`⚠️ Could not find collision-free position for ${element.id || 'element'}`);
  return preferredPosition;
};

/**
 * Calculate safe layout for multiple elements with mutual avoidance
 * Uses iterative collision resolution
 *
 * @param {Array} elements - Array of elements with x, y, width, height, id
 * @param {Object} [options] - Configuration
 * @param {Object} [options.canvas] - Canvas dimensions {width, height}
 * @param {number} [options.minSpacing=20] - Minimum spacing between elements
 * @param {number} [options.maxIterations=5] - Maximum resolution iterations
 * @returns {Object} Result with success, elements, iterations, message
 */
export const calculateSafeLayout = (elements, options = {}) => {
  const {
    canvas = { width: 1920, height: 1080 },
    minSpacing = 20,
    maxIterations = 5,
  } = options;

  // Start with initial positions
  let currentElements = elements.map((el) => ({
    ...el,
    flexible: el.flexible !== false, // Default to flexible
  }));

  // Iteratively resolve collisions
  const result = autoResolveCollisions(currentElements, {
    maxIterations,
    onProgress: ({ iteration, collisionsRemaining, message }) => {
      if (collisionsRemaining > 0) {
        console.log(`Layout iteration ${iteration}: ${message}`);
      }
    },
  });

  return {
    success: result.success,
    elements: result.boxes,
    iterations: result.iterations,
    message: result.message,
  };
};

/**
 * Enforce minimum spacing between elements
 * Adjusts element positions to ensure minimum spacing
 *
 * @param {Array} elements - Array of elements with x, y, width, height, id
 * @param {number} [minSpacing=20] - Minimum spacing in pixels
 * @returns {Array} Adjusted elements with new positions
 */
export const enforceMinimumSpacing = (elements, minSpacing = 20) => {
  const adjusted = [];

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const others = adjusted; // Only check against already placed elements

    const safePos = findSafePosition(
      element,
      others,
      {
        preferredPosition: { x: element.x, y: element.y },
        searchRadius: 300,
        stepSize: minSpacing,
      }
    );

    adjusted.push({
      ...element,
      x: safePos.x,
      y: safePos.y,
    });
  }

  return adjusted;
};

/**
 * Convert position from center coordinates to top-left coordinates
 * Layout engine returns center coordinates (x, y), but CSS positioning needs top-left
 *
 * @param {Object} position - Position with x, y (center) and optional width, height
 * @returns {Object} Position with left, top (top-left) and width, height
 */
export const positionToTopLeft = (position) => {
  const width = position.width || 0;
  const height = position.height || 0;
  return {
    ...position,
    left: position.x - width / 2,
    top: position.y - height / 2,
    // Keep original center coordinates for reference
    centerX: position.x,
    centerY: position.y,
  };
};

/**
 * Convert array of positions from center to top-left coordinates
 *
 * @param {Array} positions - Array of positions with x, y (center)
 * @returns {Array} Array of positions with left, top (top-left)
 */
export const positionsToTopLeft = (positions) => {
  return positions.map(positionToTopLeft);
};

/**
 * Get CSS positioning style from position
 * Returns ready-to-use CSS style object for absolute positioning
 *
 * @param {Object} position - Position (center or top-left format)
 * @param {Object} [options] - Options
 * @param {boolean} [options.useTopLeft=false] - If true, position is already top-left, else convert from center
 * @returns {Object} CSS style object {position: 'absolute', left, top, width, height}
 */
export const positionToCSS = (position, options = {}) => {
  const { useTopLeft = false } = options;
  
  let left, top;
  if (useTopLeft) {
    left = position.left ?? position.x ?? 0;
    top = position.top ?? position.y ?? 0;
  } else {
    // Convert from center coordinates
    const width = position.width || 0;
    const height = position.height || 0;
    left = position.x - width / 2;
    top = position.y - height / 2;
  }
  
  return {
    position: 'absolute',
    left: `${left}px`,
    top: `${top}px`,
    width: position.width ? `${position.width}px` : undefined,
    height: position.height ? `${position.height}px` : undefined,
  };
};

/**
 * Validate layout and return errors/warnings
 * Checks for bounds violations and collisions
 *
 * @param {Array} positions - Calculated positions (with optional width/height)
 * @param {Object} canvas - Canvas dimensions {width, height}
 * @param {Object} [options] - Validation options
 * @param {boolean} [options.checkCollisions=true] - Check for collisions
 * @param {boolean} [options.checkBounds=true] - Check for bounds violations
 * @returns {Object} {valid: boolean, errors: [], warnings: []}
 */
export const validateLayout = (positions, canvas, options = {}) => {
  const {
    checkCollisions = true,
    checkBounds = true,
  } = options;

  const errors = [];
  const warnings = [];

  // Check bounds violations
  if (checkBounds) {
    positions.forEach((pos, index) => {
      const hasWidth = pos.width !== undefined;
      const hasHeight = pos.height !== undefined;

      // Check if position (or element bounds) exceeds canvas
      if (hasWidth) {
        const left = pos.x - pos.width / 2;
        const right = pos.x + pos.width / 2;
        if (left < 0) {
          errors.push({
            element: index,
            type: 'bounds-violation',
            side: 'left',
            amount: Math.abs(left),
            message: `Element ${index} exceeds canvas left edge by ${Math.abs(left).toFixed(0)}px`,
          });
        }
        if (right > canvas.width) {
          errors.push({
            element: index,
            type: 'bounds-violation',
            side: 'right',
            amount: right - canvas.width,
            message: `Element ${index} exceeds canvas right edge by ${(right - canvas.width).toFixed(0)}px`,
          });
        }
      } else if (pos.x < 0 || pos.x > canvas.width) {
        errors.push({
          element: index,
          type: 'bounds-violation',
          message: `Element ${index} position (${pos.x}) is outside canvas width (0-${canvas.width})`,
        });
      }

      if (hasHeight) {
        const top = pos.y - pos.height / 2;
        const bottom = pos.y + pos.height / 2;
        if (top < 0) {
          errors.push({
            element: index,
            type: 'bounds-violation',
            side: 'top',
            amount: Math.abs(top),
            message: `Element ${index} exceeds canvas top edge by ${Math.abs(top).toFixed(0)}px`,
          });
        }
        if (bottom > canvas.height) {
          errors.push({
            element: index,
            type: 'bounds-violation',
            side: 'bottom',
            amount: bottom - canvas.height,
            message: `Element ${index} exceeds canvas bottom edge by ${(bottom - canvas.height).toFixed(0)}px`,
          });
        }
      } else if (pos.y < 0 || pos.y > canvas.height) {
        errors.push({
          element: index,
          type: 'bounds-violation',
          message: `Element ${index} position (${pos.y}) is outside canvas height (0-${canvas.height})`,
        });
      }
    });
  }

  // Check collisions (if width/height provided)
  if (checkCollisions && positions.every((p) => p.width && p.height)) {
    const hasOverlaps = checkForOverlaps(positions);
    if (hasOverlaps) {
      warnings.push({
        type: 'collision',
        message: 'Elements overlap - consider enabling collision detection in calculateItemPositions()',
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
};
