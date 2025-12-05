/**
 * Scene Layout Module - Public Exports
 * 
 * MACRO scene layout: viewport → named slots
 * Now format-aware: supports desktop (1920x1080) and mobile (1080x1920)
 * 
 * @module scene-layout
 */

export {
  resolveSceneSlots,
  SCENE_LAYOUT_TYPES,
  SCENE_LAYOUT_DEFAULTS,
  createArea,
  splitHorizontal,
  splitVertical,
  normalizeRatios,
  calculateBaseAreas,
  // Format detection (re-exported from viewportPresets)
  detectFormat,
  isMobileFormat,
  adjustLayoutForViewport,
  LAYOUT_RECOMMENDATIONS,
} from './sceneLayout.js';

// Direct exports from viewportPresets for advanced use
export {
  VIEWPORT_PRESETS,
  DEFAULT_FORMAT,
  isDesktopFormat,
  getViewportPreset,
  getViewportForFormat,
  resolveViewport,
  calculatePositionGrid,
  getLayoutRecommendations,
  isLayoutRecommended,
  getResponsiveFontSize,
  getResponsiveSpacing,
  getViewportPadding,
  getViewportTitleHeight,
} from '../layout/viewportPresets';
