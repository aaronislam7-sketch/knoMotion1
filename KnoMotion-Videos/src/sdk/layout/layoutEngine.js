/**
 * Layout Engine - General Layout Calculations and Utilities
 *
 * Single source of truth for:
 * - Layout arrangement types (stack, grid, circular, etc.)
 * - Canvas / area helpers (title safe-area, content area)
 * - Position calculations that scenes + mid-level components can reuse
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
 *
 * @param {any[]} items
 * @param {Object} [config]
 */
export const calculateItemPositions = (items, config = {}) => {
  const {
    arrangement = ARRANGEMENT_TYPES.STACKED_VERTICAL,
  } = config;

  switch (arrangement) {
    case ARRANGEMENT_TYPES.STACKED_VERTICAL:
      return calculateStackedPositions(items, {
        ...config,
        direction: 'vertical',
      });

    case ARRANGEMENT_TYPES.STACKED_HORIZONTAL:
      return calculateStackedPositions(items, {
        ...config,
        direction: 'horizontal',
      });

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
      return calculateStackedPositions(items, {
        ...config,
        direction: 'vertical',
      });
  }
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
