/**
 * ============================================================================
 * MACRO SCENE LAYOUT MODULE
 * ============================================================================
 * 
 * This module handles MACRO scene layout: transforming a viewport into named slots.
 * 
 * ARCHITECTURE:
 * - MACRO Layout (THIS MODULE): viewport → named slots (header, row1, col1, etc.)
 * - Mid-Scenes (elsewhere): receive ONE slot LayoutArea, render content inside
 * - Micro Layout (layoutEngine.js): item-level geometry, collision detection
 * 
 * THIS MODULE:
 * ✅ Carves viewport into named LayoutArea slots
 * ✅ Reserves header/title strip at top
 * ✅ Supports multiple layout types (full, rowStack, columnSplit, etc.)
 * ✅ Pure, deterministic geometry calculations
 * ✅ Format-aware (desktop/mobile) layout adjustments
 * 
 * THIS MODULE DOES NOT:
 * ❌ Import or reference layoutEngine.js
 * ❌ Handle item positioning or collision detection
 * ❌ Know about animations or mid-scene internals
 * 
 * @module scene-layout/sceneLayout
 */

import {
  detectFormat,
  isMobileFormat,
  adjustLayoutForViewport,
  getViewportPadding,
  getViewportTitleHeight,
  LAYOUT_RECOMMENDATIONS,
} from '../layout/viewportPresets';

// ============================================================================
// TYPE DEFINITIONS (JSDoc)
// ============================================================================

/**
 * Layout type enumeration for scene slot carving strategies.
 * @typedef {'full' | 'rowStack' | 'columnSplit' | 'headerRowColumns' | 'gridSlots'} SceneLayoutType
 */

/**
 * Viewport dimensions representing the full video canvas.
 * @typedef {Object} Viewport
 * @property {number} width - Viewport width in pixels
 * @property {number} height - Viewport height in pixels
 */

/**
 * A rectangular area with position and dimensions.
 * Used to define slots where content can be rendered.
 * @typedef {Object} LayoutArea
 * @property {number} left - X coordinate of top-left corner
 * @property {number} top - Y coordinate of top-left corner
 * @property {number} width - Width of the area in pixels
 * @property {number} height - Height of the area in pixels
 */

/**
 * Configuration options for scene layout calculation.
 * @typedef {Object} SceneLayoutConfig
 * @property {SceneLayoutType} type - The layout strategy to use
 * @property {Object} [options] - Layout-specific options
 * @property {number} [options.titleHeight] - Custom header height (default: 70)
 * @property {number} [options.padding] - Padding around content area (default: 0)
 * @property {number} [options.rows] - Number of rows (for rowStack, gridSlots)
 * @property {number} [options.columns] - Number of columns (for columnSplit, headerRowColumns, gridSlots)
 * @property {number[]} [options.rowRatios] - Relative height ratios for rows
 * @property {number[]} [options.ratios] - Relative width ratios for columns
 * @property {number[]} [options.columnRatios] - Relative width ratios for columns (alias)
 * @property {number} [options.rowHeightRatio] - Row height as fraction of content (for headerRowColumns, default: 0.35)
 */

/**
 * Map of slot names to their corresponding LayoutArea.
 * @typedef {Object<string, LayoutArea>} SlotMap
 */

// ============================================================================
// CONSTANTS
// ============================================================================

/** Default header/title strip height in pixels */
const DEFAULT_TITLE_HEIGHT = 100;

/** Default padding around content area */
const DEFAULT_PADDING = 0;

/** Minimum allowed rows/columns */
const MIN_SLOTS = 1;

/** Maximum allowed rows/columns */
const MAX_SLOTS = 6;

/** Default number of rows for fallback */
const DEFAULT_ROWS = 3;

/** Default number of columns for fallback */
const DEFAULT_COLUMNS = 2;

/** Default row height ratio for headerRowColumns layout */
const DEFAULT_ROW_HEIGHT_RATIO = 0.35;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Create a LayoutArea from coordinates and dimensions.
 * @param {number} left - X coordinate of top-left corner
 * @param {number} top - Y coordinate of top-left corner
 * @param {number} width - Width in pixels
 * @param {number} height - Height in pixels
 * @returns {LayoutArea}
 */
function createArea(left, top, width, height) {
  return { left, top, width, height };
}

/**
 * Clamp a value between min and max bounds.
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum bound
 * @param {number} max - Maximum bound
 * @returns {number}
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Normalize ratios to sum to 1.0.
 * @param {number[]} ratios - Array of ratio values
 * @param {number} count - Expected number of ratios
 * @returns {number[]} Normalized ratios that sum to 1.0
 */
function normalizeRatios(ratios, count) {
  // If no ratios provided or wrong length, return equal ratios
  if (!Array.isArray(ratios) || ratios.length !== count) {
    return Array(count).fill(1 / count);
  }

  // Filter out non-positive values and normalize
  const validRatios = ratios.map(r => (typeof r === 'number' && r > 0 ? r : 1));
  const total = validRatios.reduce((sum, r) => sum + r, 0);

  if (total <= 0) {
    return Array(count).fill(1 / count);
  }

  return validRatios.map(r => r / total);
}

/**
 * Split an area horizontally into rows (top to bottom).
 * @param {LayoutArea} area - The area to split
 * @param {number} rows - Number of rows to create
 * @param {number[]} [ratios] - Optional relative height ratios
 * @returns {LayoutArea[]} Array of row areas
 */
function splitHorizontal(area, rows, ratios) {
  const count = clamp(rows, MIN_SLOTS, MAX_SLOTS);
  const normalizedRatios = normalizeRatios(ratios, count);

  const result = [];
  let currentTop = area.top;

  for (let i = 0; i < count; i++) {
    const rowHeight = area.height * normalizedRatios[i];
    result.push(createArea(area.left, currentTop, area.width, rowHeight));
    currentTop += rowHeight;
  }

  return result;
}

/**
 * Split an area vertically into columns (left to right).
 * @param {LayoutArea} area - The area to split
 * @param {number} columns - Number of columns to create
 * @param {number[]} [ratios] - Optional relative width ratios
 * @returns {LayoutArea[]} Array of column areas
 */
function splitVertical(area, columns, ratios) {
  const count = clamp(columns, MIN_SLOTS, MAX_SLOTS);
  const normalizedRatios = normalizeRatios(ratios, count);

  const result = [];
  let currentLeft = area.left;

  for (let i = 0; i < count; i++) {
    const colWidth = area.width * normalizedRatios[i];
    result.push(createArea(currentLeft, area.top, colWidth, area.height));
    currentLeft += colWidth;
  }

  return result;
}

/**
 * Generate cell name for grid based on index.
 * If totalCells <= 26, uses letters (cellA, cellB, ...).
 * Otherwise uses row/column notation (r1c1, r1c2, ...).
 * @param {number} index - Cell index (0-based, row-major)
 * @param {number} totalCells - Total number of cells
 * @param {number} columns - Number of columns in grid
 * @returns {string} Cell name
 */
function getCellName(index, totalCells, columns) {
  if (totalCells <= 26) {
    return `cell${String.fromCharCode(65 + index)}`; // cellA, cellB, ...
  }

  const row = Math.floor(index / columns) + 1;
  const col = (index % columns) + 1;
  return `r${row}c${col}`;
}

/**
 * Calculate header and content areas from viewport.
 * @param {Viewport} viewport - Full viewport dimensions
 * @param {Object} options - Layout options
 * @param {number} [options.titleHeight] - Custom header height
 * @param {number} [options.padding] - Padding around content
 * @returns {{ headerArea: LayoutArea, contentArea: LayoutArea }}
 */
function calculateBaseAreas(viewport, options = {}) {
  const titleHeight = options.titleHeight ?? DEFAULT_TITLE_HEIGHT;
  const padding = options.padding ?? DEFAULT_PADDING;

  const headerArea = createArea(
    padding,
    padding,
    viewport.width - padding * 2,
    titleHeight
  );

  const contentTop = padding + titleHeight;
  const contentArea = createArea(
    padding,
    contentTop,
    viewport.width - padding * 2,
    viewport.height - contentTop - padding
  );

  return { headerArea, contentArea };
}

// ============================================================================
// LAYOUT IMPLEMENTATIONS
// ============================================================================

/**
 * Full layout: entire content area as a single slot.
 * @param {Viewport} viewport
 * @param {Object} options
 * @returns {SlotMap}
 */
function layoutFull(viewport, options) {
  const { headerArea, contentArea } = calculateBaseAreas(viewport, options);

  return {
    header: headerArea,
    full: contentArea,
  };
}

/**
 * Row stack layout: divide content area into horizontal rows.
 * @param {Viewport} viewport
 * @param {Object} options
 * @returns {SlotMap}
 */
function layoutRowStack(viewport, options) {
  const { headerArea, contentArea } = calculateBaseAreas(viewport, options);

  // Get and validate row count
  let rowCount = options.rows;
  if (typeof rowCount !== 'number' || rowCount < MIN_SLOTS) {
    console.warn(`[sceneLayout] rowStack: invalid rows (${rowCount}), defaulting to ${DEFAULT_ROWS}`);
    rowCount = DEFAULT_ROWS;
  }
  rowCount = clamp(rowCount, MIN_SLOTS, MAX_SLOTS);

  const rowAreas = splitHorizontal(contentArea, rowCount, options.rowRatios);

  /** @type {SlotMap} */
  const slots = { header: headerArea };

  rowAreas.forEach((area, i) => {
    slots[`row${i + 1}`] = area;
  });

  return slots;
}

/**
 * Column split layout: divide content area into vertical columns.
 * @param {Viewport} viewport
 * @param {Object} options
 * @returns {SlotMap}
 */
function layoutColumnSplit(viewport, options) {
  const { headerArea, contentArea } = calculateBaseAreas(viewport, options);

  // Get and validate column count
  let colCount = options.columns;
  if (typeof colCount !== 'number' || colCount < MIN_SLOTS) {
    console.warn(`[sceneLayout] columnSplit: invalid columns (${colCount}), defaulting to ${DEFAULT_COLUMNS}`);
    colCount = DEFAULT_COLUMNS;
  }
  colCount = clamp(colCount, MIN_SLOTS, MAX_SLOTS);

  const colAreas = splitVertical(contentArea, colCount, options.ratios);

  /** @type {SlotMap} */
  const slots = { header: headerArea };

  colAreas.forEach((area, i) => {
    slots[`col${i + 1}`] = area;
  });

  // Add left/right aliases for 2-column layout
  if (colCount === 2) {
    slots.left = slots.col1;
    slots.right = slots.col2;
  }

  return slots;
}

/**
 * Header + row + columns layout: combined layout with header, row strip, and columns below.
 * 
 * Structure:
 * +-----------------------------+
 * |           header            |
 * +-----------------------------+
 * |             row             |
 * +-----------------------------+
 * |   col1   |   col2   | ...   |
 * +-----------------------------+
 * 
 * @param {Viewport} viewport
 * @param {Object} options
 * @returns {SlotMap}
 */
function layoutHeaderRowColumns(viewport, options) {
  const { headerArea, contentArea } = calculateBaseAreas(viewport, options);

  // Get and validate column count
  let colCount = options.columns;
  if (typeof colCount !== 'number' || colCount < MIN_SLOTS) {
    console.warn(`[sceneLayout] headerRowColumns: invalid columns (${colCount}), defaulting to ${DEFAULT_COLUMNS}`);
    colCount = DEFAULT_COLUMNS;
  }
  colCount = clamp(colCount, MIN_SLOTS, MAX_SLOTS);

  // Get row height ratio
  const rowHeightRatio = typeof options.rowHeightRatio === 'number' && options.rowHeightRatio > 0 && options.rowHeightRatio < 1
    ? options.rowHeightRatio
    : DEFAULT_ROW_HEIGHT_RATIO;

  // Split content area into row and columns regions
  const rowHeight = contentArea.height * rowHeightRatio;
  const columnsHeight = contentArea.height - rowHeight;

  const rowArea = createArea(
    contentArea.left,
    contentArea.top,
    contentArea.width,
    rowHeight
  );

  const columnsArea = createArea(
    contentArea.left,
    contentArea.top + rowHeight,
    contentArea.width,
    columnsHeight
  );

  // Split columns area
  const colAreas = splitVertical(columnsArea, colCount, options.columnRatios);

  /** @type {SlotMap} */
  const slots = {
    header: headerArea,
    row: rowArea,
  };

  colAreas.forEach((area, i) => {
    slots[`col${i + 1}`] = area;
  });

  // Add left/right aliases for 2-column layout
  if (colCount === 2) {
    slots.left = slots.col1;
    slots.right = slots.col2;
  }

  return slots;
}

/**
 * Grid slots layout: tile content area into an R×C grid.
 * @param {Viewport} viewport
 * @param {Object} options
 * @returns {SlotMap}
 */
function layoutGridSlots(viewport, options) {
  const { headerArea, contentArea } = calculateBaseAreas(viewport, options);

  // Get and validate row/column counts
  let rowCount = options.rows;
  let colCount = options.columns;

  if (typeof rowCount !== 'number' || rowCount < MIN_SLOTS) {
    console.warn(`[sceneLayout] gridSlots: invalid rows (${rowCount}), defaulting to ${DEFAULT_ROWS}`);
    rowCount = DEFAULT_ROWS;
  }
  if (typeof colCount !== 'number' || colCount < MIN_SLOTS) {
    console.warn(`[sceneLayout] gridSlots: invalid columns (${colCount}), defaulting to ${DEFAULT_COLUMNS}`);
    colCount = DEFAULT_COLUMNS;
  }

  rowCount = clamp(rowCount, MIN_SLOTS, MAX_SLOTS);
  colCount = clamp(colCount, MIN_SLOTS, MAX_SLOTS);

  const totalCells = rowCount * colCount;

  // Split into rows first, then each row into columns
  const rowAreas = splitHorizontal(contentArea, rowCount);

  /** @type {SlotMap} */
  const slots = { header: headerArea };

  let cellIndex = 0;
  rowAreas.forEach((rowArea) => {
    const cellAreas = splitVertical(rowArea, colCount);
    cellAreas.forEach((cellArea) => {
      const cellName = getCellName(cellIndex, totalCells, colCount);
      slots[cellName] = cellArea;
      cellIndex++;
    });
  });

  return slots;
}

// ============================================================================
// MAIN PUBLIC API
// ============================================================================

/**
 * Resolve scene layout configuration into named slots.
 * 
 * This is the main entry point for macro scene layout calculation.
 * Given a layout configuration and viewport, it returns a map of
 * named slots (LayoutArea objects) that mid-scenes can use to
 * position their content.
 * 
 * NOW FORMAT-AWARE: Automatically adjusts layouts for mobile viewports.
 * - columnSplit converts to rowStack on mobile
 * - Grid columns are capped at 2 on mobile
 * - Padding and title height adjust based on format
 * 
 * @param {SceneLayoutConfig} layout - Layout configuration
 * @param {Viewport} viewport - Full viewport dimensions
 * @param {Object} [options] - Additional options
 * @param {boolean} [options.autoAdjust=true] - Auto-adjust layout for mobile
 * @returns {SlotMap} Map of slot names to LayoutArea objects
 * 
 * @example
 * // Full layout
 * const slots = resolveSceneSlots(
 *   { type: 'full' },
 *   { width: 1920, height: 1080 }
 * );
 * // Returns: { header: {...}, full: {...} }
 * 
 * @example
 * // Row stack with custom ratios
 * const slots = resolveSceneSlots(
 *   { type: 'rowStack', options: { rows: 3, rowRatios: [1, 2, 1] } },
 *   { width: 1920, height: 1080 }
 * );
 * // Returns: { header: {...}, row1: {...}, row2: {...}, row3: {...} }
 * 
 * @example
 * // Column split on mobile (auto-converts to rowStack)
 * const slots = resolveSceneSlots(
 *   { type: 'columnSplit', options: { columns: 2 } },
 *   { width: 1080, height: 1920 }
 * );
 * // Returns: { header: {...}, row1: {...}, row2: {...} } (converted!)
 */
export function resolveSceneSlots(layout, viewport, resolveOptions = {}) {
  const { autoAdjust = true } = resolveOptions;
  
  // Validate inputs
  if (!viewport || typeof viewport.width !== 'number' || typeof viewport.height !== 'number') {
    console.warn('[sceneLayout] Invalid viewport, using default 1920x1080');
    viewport = { width: 1920, height: 1080 };
  }

  if (!layout || typeof layout.type !== 'string') {
    console.warn('[sceneLayout] Invalid layout config, defaulting to full layout');
    return layoutFull(viewport, {});
  }

  // Auto-adjust layout for mobile if enabled
  let adjustedLayout = layout;
  if (autoAdjust && isMobileFormat(viewport)) {
    adjustedLayout = adjustLayoutForViewport(layout, viewport);
  }

  // Merge format-aware defaults into options
  const options = {
    ...adjustedLayout.options,
    // Use format-aware padding/title height if not explicitly set
    padding: adjustedLayout.options?.padding ?? getViewportPadding(viewport),
    titleHeight: adjustedLayout.options?.titleHeight ?? getViewportTitleHeight(viewport),
  };

  switch (adjustedLayout.type) {
    case 'full':
      return layoutFull(viewport, options);

    case 'rowStack':
      return layoutRowStack(viewport, options);

    case 'columnSplit':
      return layoutColumnSplit(viewport, options);

    case 'headerRowColumns':
      return layoutHeaderRowColumns(viewport, options);

    case 'gridSlots':
      return layoutGridSlots(viewport, options);

    default:
      console.warn(`[sceneLayout] Unknown layout type: ${adjustedLayout.type}, defaulting to full layout`);
      return layoutFull(viewport, options);
  }
}

// ============================================================================
// ADDITIONAL EXPORTS
// ============================================================================

/**
 * Available scene layout types.
 * @type {readonly SceneLayoutType[]}
 */
export const SCENE_LAYOUT_TYPES = Object.freeze([
  'full',
  'rowStack',
  'columnSplit',
  'headerRowColumns',
  'gridSlots',
]);

/**
 * Default configuration values for reference.
 * @type {Object}
 */
export const SCENE_LAYOUT_DEFAULTS = Object.freeze({
  titleHeight: DEFAULT_TITLE_HEIGHT, // 100px (desktop default)
  padding: DEFAULT_PADDING,
  rows: DEFAULT_ROWS,
  columns: DEFAULT_COLUMNS,
  rowHeightRatio: DEFAULT_ROW_HEIGHT_RATIO,
  minSlots: MIN_SLOTS,
  maxSlots: MAX_SLOTS,
});

// Export helper functions for advanced use cases
export { createArea, splitHorizontal, splitVertical, normalizeRatios, calculateBaseAreas };

// Re-export format detection for convenience
export {
  detectFormat,
  isMobileFormat,
  adjustLayoutForViewport,
  LAYOUT_RECOMMENDATIONS,
} from '../layout/viewportPresets';
