/**
 * Lottie Integration - Single Entry Point
 * 
 * Consolidated module for all Lottie-related functionality.
 * 
 * @module lottie
 * 
 * @example
 * // Import the main player
 * import { LottiePlayer, LottieIcon, LottieOverlay } from '../sdk/lottie';
 * 
 * // Use with a registry key
 * <LottiePlayer lottieRef="education/lightbulb" loop={false} />
 * 
 * // Use with a preset
 * <LottieFromPreset preset="insight" />
 * 
 * // Icon size
 * <LottieIcon lottieRef="core/checkmark" size={32} />
 */

// Main player components
export {
  LottiePlayer,
  LottieIcon,
  LottieOverlay,
  LottieFromPreset,
  useLottieData,
  // Backward compatibility
  RemotionLottie,
  AnimatedLottie,
} from './LottiePlayer';

export type { LottiePlayerProps } from './LottiePlayer';

// Registry and resolution
export {
  LOTTIE_REGISTRY,
  LOTTIE_PRESETS,
  resolveLottieSource,
  getLottiePreset,
  getAvailableLottieKeys,
  hasLottie,
} from './registry';

export type {
  LottieSource,
  LottiePreset,
  LottieKey,
} from './registry';

// Inline animations for direct use
export {
  checkmarkAnimation,
  sparkleAnimation,
  lightbulbAnimation,
  thinkingAnimation,
  celebrationAnimation,
  thermometerAnimation,
  snowflakeAnimation,
  waterDropAnimation,
  arrowAnimation,
  loadingAnimation,
} from './registry';

// Default export is the main player
export { LottiePlayer as default } from './LottiePlayer';
