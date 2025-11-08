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

// Font System & Transitions
export * from './fontSystem';
export * from './transitions';

// Blueprint v5.0 - Core Systems
export * from './presets';
export { SceneIdContext, useSceneId, generateSceneId } from './SceneIdContext';
export { EZ, getEasing } from './easing';

// Collision Detection & Layout Validation
export * from './collision-detection';
export * from './layout-resolver';
export * from './scene-validator';
export { SceneSchema, detectSchemaVersion, isAgnosticScene, isLegacyScene } from './scene.schema';
export * from './sceneCompatibility';

// ✨ CREATIVE MAGIC - V6 Enhancements
export * from './particleSystem.jsx';
export * from './handwritingEffects.jsx';
export * from './advancedEffects.jsx';
export * from './lottieLibrary';

// 🎯 AGNOSTIC TEMPLATE SYSTEM - Phase 1
export * from './heroRegistry.jsx';
export * from './positionSystem';
export * from './questionRenderer';
export * from './layoutEngine';

export default SDK;
