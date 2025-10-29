/**
 * Template SDK - Main Export
 * Centralized utilities, animations, and components for all templates
 * 
 * Usage:
 *   import { SDK } from './sdk';
 *   // Use SDK.animations, SDK.rough, SDK.components, etc.
 */

import * as animations from './animations';
import * as rough from './rough-utils';
import * as components from './components.jsx';
import * as lottie from './lottie-helpers';

export const SDK = {
  animations,
  rough,
  components,
  lottie
};

// Named exports for convenience
export { animations, rough, components, lottie };

// Export individual utilities
export * from './animations';
export * from './rough-utils';
export * from './components.jsx';
export * from './lottie-helpers';
// Core animation & motion
export * from './easing';
export * from './motion';
export * from './useWriteOn';

// Broadcast-grade enhancements
export * from './broadcastAnimations';
export * from './broadcastEffects';
export * from './lottieIntegration';

// Utilities
export * from './time';
export * from './typography';
export * from './usePreloadAssets';
export { StyleTokensProvider, useStyleTokens } from './StyleTokensProvider';

// Blueprint v5.0 - Core Systems
export * from './presets';
export { SceneIdContext, useSceneId, generateSceneId } from './SceneIdContext';
export { EZ, getEasing } from './easing';

export default SDK;
