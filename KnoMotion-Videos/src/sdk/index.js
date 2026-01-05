/**
 * Template SDK - Main Export
 * Centralized utilities, animations, and components for all templates
 * 
 * Organized structure:
 * - layout/      - Layout engines and positioning
 * - animations/  - All animation helpers (consolidated)
 * - elements/    - Low-level visual primitives (NotebookCard)
 * - effects/     - Visual effects (backgrounds, particles, etc.)
 * - components/ - Reusable React components (mid-level, etc.)
 * - lottie/      - Lottie integration
 * - validation/  - Schema validation and compatibility
 * - core/        - Core utilities (easing, time, motion, etc.)
 * - fonts/       - Font loading and management
 * - utils/       - Miscellaneous utilities
 */

// ==================== LAYOUT ====================
export * from './layout/layoutEngine';
export * from './layout/positionSystem';
export * from './layout/viewportPresets';
export * from './layout/mobileRenderingGuide';
// Note: layout-resolver functions have been integrated into layoutEngine.js
// Legacy template-specific functions still available via direct import if needed

// ==================== SCENE LAYOUT (MACRO) ====================
// Macro scene layout: viewport → named slots (independent of layoutEngine)
export * from './scene-layout';

// ==================== ANIMATIONS (Consolidated) ====================
export * from './animations';
// Micro-delights (for backward compatibility)
export * from './animations/microDelights';

// ==================== ELEMENTS ====================
// Export all themed elements (13 total: 8 atoms, 5 compositions)
export * from './elements';
// Legacy element (keep for backward compatibility)
export { NotebookCard } from './elements/NotebookCard';

// ==================== EFFECTS ====================
// Background effects (consolidated)
export * from './effects/backgrounds.jsx';
// Particle system (for backward compatibility - also exports generateAmbientParticles, etc.)
export * from './effects/particleSystem';
// Other effects
export * from './effects/handwritingEffects';
export * from './effects/connectingLines';
export * from './effects/flowLines';
// Legacy broadcastEffects (for backward compatibility)
export * from './effects/broadcastEffects';

// ==================== LOTTIE ====================
export * from './lottie/lottie-helpers';
export * from './lottie/lottieIntegration';
export * from './lottie/lottiePresets';
// Lottie registry (URL-based)
export * from './lottie/registry';

// (Layout exports moved above)


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

// ==================== MID-SCENES ====================
// Composed components that glue elements, animations, and effects together
export * from './mid-scenes';

// ==================== COMPONENTS ====================
// Mid-level components
export { AppMosaic } from './components/mid-level/AppMosaic';
export * from './components/mid-level/FlowDiagram';
// Other components
export * from './components/components';
export * from './components/heroRegistry';
export * from './components/questionRenderer';
export { StyleTokensProvider, useStyleTokens } from './components/StyleTokensProvider';
export { SceneIdContext, useSceneId, generateSceneId } from './components/SceneIdContext';

// ==================== FONTS ====================
export * from './fonts/fontSystem';
export * from './fonts/usePreloadAssets';

// ==================== DECORATIONS ====================
export * from './decorations/doodleEffects';

// ==================== UTILS ====================
export * from './utils/rough-utils';
export * from './utils/useWriteOn';
export * from './utils/presets';

// ==================== LEGACY COMPATIBILITY ====================
// For backward compatibility with old imports
import * as animationsModule from './animations';
import * as rough from './utils/rough-utils';
import * as components from './components/components.jsx';
import * as lottie from './lottie/lottie-helpers';

export const SDK = {
  animations: animationsModule,
  rough,
  components,
  lottie
};

export { animationsModule as animations, rough, components, lottie };

export default SDK;
