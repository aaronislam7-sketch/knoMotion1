/**
 * Template SDK - Main Export
 * Centralized utilities, animations, and components for all templates
 * 
 * Organized structure:
 * - animations/  - All animation helpers
 * - effects/     - Visual effects (particles, glow, glassmorphic)
 * - lottie/      - Lottie integration
 * - layout/      - Layout engines and positioning
 * - validation/  - Schema validation and compatibility
 * - core/        - Core utilities (easing, time, motion, etc.)
 * - components/  - Reusable React components
 * - fonts/       - Font loading and management
 * - utils/       - Miscellaneous utilities
 */

// ==================== ANIMATIONS ====================
export * from './animations/animations';
export * from './animations/broadcastAnimations';
export * from './animations/microDelights';
export * from './animations/advancedEffects';

// ==================== EFFECTS ====================
export * from './effects/broadcastEffects';
export * from './effects/handwritingEffects';
export * from './effects/particleSystem';

// ==================== LOTTIE ====================
export * from './lottie/lottie-helpers';
export * from './lottie/lottieIntegration';
export * from './lottie/lottieLibrary';
export * from './lottie/lottiePresets';

// ==================== LAYOUT ====================
export * from './layout/layout-resolver';
export * from './layout/layoutEngine';
export * from './layout/positionSystem';

// ==================== VALIDATION ====================
export * from './validation/scene-validator';
export { SceneSchema, detectSchemaVersion, isAgnosticScene, isLegacyScene } from './validation/scene.schema';
export * from './validation/sceneCompatibility';
export * from './validation/collision-detection';

// ==================== CORE UTILITIES ====================
export * from './core/easing';
export * from './core/time';
export * from './core/motion';
export * from './core/transitions';
export * from './core/typography';
export { EZ, getEasing } from './core/easing';

// ==================== COMPONENTS ====================
export * from './components/components';
export * from './components/heroRegistry';
export * from './components/questionRenderer';
export { StyleTokensProvider, useStyleTokens } from './components/StyleTokensProvider';
export { SceneIdContext, useSceneId, generateSceneId } from './components/SceneIdContext';

// ==================== FONTS ====================
export * from './fonts/fontSystem';
export * from './fonts/usePreloadAssets';

// ==================== UTILS ====================
export * from './utils/rough-utils';
export * from './utils/useWriteOn';
export * from './utils/presets';

// ==================== LEGACY COMPATIBILITY ====================
// For backward compatibility with old imports
import * as animations from './animations/animations';
import * as rough from './utils/rough-utils';
import * as components from './components/components.jsx';
import * as lottie from './lottie/lottie-helpers';

export const SDK = {
  animations,
  rough,
  components,
  lottie
};

export { animations, rough, components, lottie };

export default SDK;
