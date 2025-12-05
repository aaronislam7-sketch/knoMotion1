/**
 * ============================================================================
 * VIEWPORT PRESETS - Format-Aware Video Dimensions
 * ============================================================================
 * 
 * Central source of truth for video format dimensions and aspect ratios.
 * Enables seamless switching between desktop (landscape) and mobile (portrait)
 * rendering without breaking layouts.
 * 
 * USAGE:
 * - Pass `format: 'mobile'` in scene config to trigger mobile-optimized layouts
 * - Layout helpers auto-detect format from viewport aspect ratio
 * - POSITION_GRID dynamically calculates based on viewport
 * 
 * @module layout/viewportPresets
 */

// ============================================================================
// FORMAT DEFINITIONS
// ============================================================================

/**
 * Supported video format types
 * @typedef {'desktop' | 'mobile'} VideoFormat
 */

/**
 * Viewport dimensions
 * @typedef {Object} Viewport
 * @property {number} width - Viewport width in pixels
 * @property {number} height - Viewport height in pixels
 */

/**
 * Video format presets with standard dimensions
 * 
 * Desktop: 1920x1080 (16:9 landscape) - YouTube, web embeds
 * Mobile: 1080x1920 (9:16 portrait) - TikTok, Reels, Shorts
 */
export const VIEWPORT_PRESETS = Object.freeze({
  desktop: {
    width: 1920,
    height: 1080,
    aspectRatio: 16 / 9,
    format: 'desktop',
    name: 'Desktop / Landscape',
    description: 'Standard 16:9 for YouTube, web embeds, presentations',
  },
  mobile: {
    width: 1080,
    height: 1920,
    aspectRatio: 9 / 16,
    format: 'mobile',
    name: 'Mobile / Portrait',
    description: 'TikTok, Instagram Reels, YouTube Shorts',
  },
});

/**
 * Default format when none specified
 */
export const DEFAULT_FORMAT = 'desktop';

// ============================================================================
// FORMAT DETECTION
// ============================================================================

/**
 * Detect video format from viewport dimensions
 * 
 * Uses aspect ratio to determine if viewport is portrait or landscape.
 * Portrait (height > width) → mobile
 * Landscape (width > height) → desktop
 * 
 * @param {Viewport} viewport - Current viewport dimensions
 * @returns {VideoFormat} Detected format ('desktop' or 'mobile')
 * 
 * @example
 * detectFormat({ width: 1920, height: 1080 }) // → 'desktop'
 * detectFormat({ width: 1080, height: 1920 }) // → 'mobile'
 */
export function detectFormat(viewport) {
  if (!viewport || typeof viewport.width !== 'number' || typeof viewport.height !== 'number') {
    return DEFAULT_FORMAT;
  }
  
  const aspectRatio = viewport.width / viewport.height;
  
  // Portrait orientation = mobile format
  if (aspectRatio < 1) {
    return 'mobile';
  }
  
  return 'desktop';
}

/**
 * Check if viewport represents mobile format
 * 
 * @param {Viewport} viewport - Current viewport dimensions
 * @returns {boolean} True if mobile format
 */
export function isMobileFormat(viewport) {
  return detectFormat(viewport) === 'mobile';
}

/**
 * Check if viewport represents desktop format
 * 
 * @param {Viewport} viewport - Current viewport dimensions
 * @returns {boolean} True if desktop format
 */
export function isDesktopFormat(viewport) {
  return detectFormat(viewport) === 'desktop';
}

// ============================================================================
// VIEWPORT HELPERS
// ============================================================================

/**
 * Get viewport preset by format name
 * 
 * @param {VideoFormat} format - Format name ('desktop' or 'mobile')
 * @returns {Object} Viewport preset configuration
 */
export function getViewportPreset(format) {
  return VIEWPORT_PRESETS[format] || VIEWPORT_PRESETS[DEFAULT_FORMAT];
}

/**
 * Get viewport dimensions for a format
 * 
 * @param {VideoFormat} format - Format name
 * @returns {Viewport} Viewport dimensions { width, height }
 */
export function getViewportForFormat(format) {
  const preset = getViewportPreset(format);
  return { width: preset.width, height: preset.height };
}

/**
 * Resolve viewport from config or use defaults
 * 
 * Accepts either explicit dimensions or format string.
 * Falls back to desktop dimensions if invalid input.
 * 
 * @param {Object|string} config - Viewport config or format string
 * @returns {Viewport} Resolved viewport dimensions
 * 
 * @example
 * resolveViewport('mobile') // → { width: 1080, height: 1920 }
 * resolveViewport({ width: 1920, height: 1080 }) // → { width: 1920, height: 1080 }
 * resolveViewport({ format: 'mobile' }) // → { width: 1080, height: 1920 }
 */
export function resolveViewport(config) {
  // String format name
  if (typeof config === 'string') {
    return getViewportForFormat(config);
  }
  
  // Object with format property
  if (config && config.format) {
    return getViewportForFormat(config.format);
  }
  
  // Object with explicit dimensions
  if (config && typeof config.width === 'number' && typeof config.height === 'number') {
    return { width: config.width, height: config.height };
  }
  
  // Fallback to desktop
  return getViewportForFormat(DEFAULT_FORMAT);
}

// ============================================================================
// DYNAMIC POSITION GRID
// ============================================================================

/**
 * 9-Point Grid Position Calculator
 * 
 * Calculates grid positions dynamically based on viewport dimensions.
 * Replaces the hardcoded POSITION_GRID with viewport-aware calculations.
 * 
 * Grid Layout (proportional):
 * ```
 * top-left (16.7%, 16.7%)    top-center (50%, 16.7%)    top-right (83.3%, 16.7%)
 * center-left (16.7%, 50%)   center (50%, 50%)          center-right (83.3%, 50%)
 * bottom-left (16.7%, 83.3%) bottom-center (50%, 83.3%) bottom-right (83.3%, 83.3%)
 * ```
 * 
 * @param {Viewport} viewport - Current viewport dimensions
 * @returns {Object} Map of grid position names to {x, y} coordinates
 * 
 * @example
 * const grid = calculatePositionGrid({ width: 1080, height: 1920 });
 * grid['center'] // → { x: 540, y: 960 }
 */
export function calculatePositionGrid(viewport) {
  const { width, height } = resolveViewport(viewport);
  
  // Grid positions as proportions of viewport
  // Using 1/6 and 5/6 for outer positions (gives comfortable margins)
  // Using 1/2 for center positions
  const positions = {
    'top-left':      { x: width * (1/6), y: height * (1/6) },
    'top-center':    { x: width * (1/2), y: height * (1/6) },
    'top-right':     { x: width * (5/6), y: height * (1/6) },
    'center-left':   { x: width * (1/6), y: height * (1/2) },
    'center':        { x: width * (1/2), y: height * (1/2) },
    'center-right':  { x: width * (5/6), y: height * (1/2) },
    'bottom-left':   { x: width * (1/6), y: height * (5/6) },
    'bottom-center': { x: width * (1/2), y: height * (5/6) },
    'bottom-right':  { x: width * (5/6), y: height * (5/6) },
  };
  
  // Round to avoid sub-pixel positioning
  Object.keys(positions).forEach(key => {
    positions[key].x = Math.round(positions[key].x);
    positions[key].y = Math.round(positions[key].y);
  });
  
  return positions;
}

// ============================================================================
// MOBILE LAYOUT RECOMMENDATIONS
// ============================================================================

/**
 * Layout recommendations based on format
 * 
 * Provides guidance on which layouts work well for each format.
 * Used by layout resolver to suggest/enforce appropriate layouts.
 */
export const LAYOUT_RECOMMENDATIONS = Object.freeze({
  desktop: {
    // All layouts work on desktop
    recommended: ['full', 'rowStack', 'columnSplit', 'headerRowColumns', 'gridSlots'],
    maxGridColumns: 4,
    maxGridRows: 3,
    maxStackRows: 4,
    sideBySideAllowed: true,
  },
  mobile: {
    // Limited layouts for mobile
    recommended: ['full', 'rowStack'],
    discouraged: ['columnSplit', 'headerRowColumns'],
    maxGridColumns: 2,
    maxGridRows: 4,
    maxStackRows: 3,
    sideBySideAllowed: false,
    // Adjustments to apply automatically
    adjustments: {
      // Convert columnSplit to rowStack on mobile
      columnSplitFallback: 'rowStack',
      // Reduce grid columns
      gridColumnLimit: 2,
    },
  },
});

/**
 * Get layout recommendations for a viewport
 * 
 * @param {Viewport} viewport - Current viewport dimensions
 * @returns {Object} Layout recommendations for the detected format
 */
export function getLayoutRecommendations(viewport) {
  const format = detectFormat(viewport);
  return LAYOUT_RECOMMENDATIONS[format] || LAYOUT_RECOMMENDATIONS.desktop;
}

/**
 * Check if a layout type is recommended for the viewport
 * 
 * @param {string} layoutType - Layout type to check
 * @param {Viewport} viewport - Current viewport dimensions
 * @returns {boolean} True if layout is recommended
 */
export function isLayoutRecommended(layoutType, viewport) {
  const recommendations = getLayoutRecommendations(viewport);
  return recommendations.recommended.includes(layoutType);
}

/**
 * Get adjusted layout configuration for mobile
 * 
 * Automatically adjusts layout options when rendering for mobile.
 * - Reduces grid columns to 2 max
 * - Converts columnSplit to rowStack
 * - Limits row count
 * 
 * @param {Object} layout - Original layout configuration
 * @param {Viewport} viewport - Current viewport dimensions
 * @returns {Object} Adjusted layout configuration
 */
export function adjustLayoutForViewport(layout, viewport) {
  if (!layout || isDesktopFormat(viewport)) {
    return layout;
  }
  
  const recommendations = getLayoutRecommendations(viewport);
  const adjusted = { ...layout, options: { ...layout.options } };
  
  // Adjust based on layout type
  switch (layout.type) {
    case 'columnSplit':
      // Convert to rowStack for mobile
      if (recommendations.adjustments?.columnSplitFallback) {
        console.log('[viewportPresets] Converting columnSplit to rowStack for mobile');
        adjusted.type = recommendations.adjustments.columnSplitFallback;
        // Convert columns to rows
        if (adjusted.options.columns) {
          adjusted.options.rows = adjusted.options.columns;
          delete adjusted.options.columns;
        }
      }
      break;
      
    case 'gridSlots':
      // Limit columns for mobile
      if (adjusted.options.columns && adjusted.options.columns > recommendations.maxGridColumns) {
        console.log(`[viewportPresets] Reducing grid columns from ${adjusted.options.columns} to ${recommendations.maxGridColumns} for mobile`);
        adjusted.options.columns = recommendations.maxGridColumns;
      }
      break;
      
    case 'rowStack':
      // Limit rows for mobile
      if (adjusted.options.rows && adjusted.options.rows > recommendations.maxStackRows) {
        console.log(`[viewportPresets] Reducing stack rows from ${adjusted.options.rows} to ${recommendations.maxStackRows} for mobile`);
        adjusted.options.rows = recommendations.maxStackRows;
      }
      break;
  }
  
  return adjusted;
}

// ============================================================================
// RESPONSIVE SIZING HELPERS
// ============================================================================

/**
 * Calculate responsive font size based on viewport
 * 
 * Mobile typically needs slightly larger relative font sizes
 * because the viewport is narrower.
 * 
 * @param {number} baseSize - Base font size in pixels
 * @param {Viewport} viewport - Current viewport dimensions
 * @returns {number} Adjusted font size
 */
export function getResponsiveFontSize(baseSize, viewport) {
  const format = detectFormat(viewport);
  
  if (format === 'mobile') {
    // Scale up slightly for mobile (narrower viewport)
    return Math.round(baseSize * 1.1);
  }
  
  return baseSize;
}

/**
 * Calculate responsive spacing based on viewport
 * 
 * @param {number} baseSpacing - Base spacing in pixels
 * @param {Viewport} viewport - Current viewport dimensions
 * @returns {number} Adjusted spacing
 */
export function getResponsiveSpacing(baseSpacing, viewport) {
  const format = detectFormat(viewport);
  
  if (format === 'mobile') {
    // Slightly reduce spacing on mobile to maximize content area
    return Math.round(baseSpacing * 0.85);
  }
  
  return baseSpacing;
}

/**
 * Get recommended padding for viewport
 * 
 * @param {Viewport} viewport - Current viewport dimensions
 * @returns {number} Recommended padding in pixels
 */
export function getViewportPadding(viewport) {
  const format = detectFormat(viewport);
  
  // Mobile: smaller padding to maximize content
  // Desktop: comfortable padding for readability
  return format === 'mobile' ? 40 : 60;
}

/**
 * Get recommended title height for viewport
 * 
 * @param {Viewport} viewport - Current viewport dimensions
 * @returns {number} Recommended title height in pixels
 */
export function getViewportTitleHeight(viewport) {
  const format = detectFormat(viewport);
  
  // Mobile: slightly taller header (more vertical space available)
  // Desktop: standard header height
  return format === 'mobile' ? 120 : 100;
}

// ============================================================================
// EXPORTS SUMMARY
// ============================================================================

export default {
  // Format detection
  detectFormat,
  isMobileFormat,
  isDesktopFormat,
  
  // Viewport resolution
  getViewportPreset,
  getViewportForFormat,
  resolveViewport,
  
  // Dynamic position grid
  calculatePositionGrid,
  
  // Layout recommendations
  getLayoutRecommendations,
  isLayoutRecommended,
  adjustLayoutForViewport,
  
  // Responsive helpers
  getResponsiveFontSize,
  getResponsiveSpacing,
  getViewportPadding,
  getViewportTitleHeight,
  
  // Constants
  VIEWPORT_PRESETS,
  LAYOUT_RECOMMENDATIONS,
  DEFAULT_FORMAT,
};
