/**
 * Lottie Integration - Single Entry Point
 * 
 * URL-based Lottie animations for Remotion.
 * All animations are fetched from LottieFiles or other CDN sources.
 * 
 * @module lottie
 * 
 * @example
 * // Import the main player
 * import { LottiePlayer, LottieIcon, LottieOverlay } from '../sdk/lottie';
 * 
 * // Use with a registry key
 * <LottiePlayer lottieRef="success" />
 * <LottiePlayer lottieRef="confetti" loop={false} />
 * 
 * // Use with a direct URL
 * <LottiePlayer lottieRef="https://assets.lottiefiles.com/..." />
 * 
 * // Use with a preset
 * <LottieFromPreset preset="insight" />
 * 
 * // Icon size
 * <LottieIcon lottieRef="checkmark" size={32} />
 */

// Main player components
export {
  LottiePlayer,
  LottieIcon,
  LottieOverlay,
  LottieFromPreset,
  useLottieEntry,
  // Backward compatibility
  RemotionLottie,
  AnimatedLottie,
} from './LottiePlayer';

export type { LottiePlayerProps } from './LottiePlayer';

// Registry and resolution
export {
  LOTTIE_REGISTRY,
  LOTTIE_PRESETS,
  resolveLottieRef,
  getLottiePreset,
  getAvailableLottieKeys,
  searchLottieByTag,
  hasLottie,
  // Backward compatibility
  resolveLottieSource,
} from './registry';

export type {
  LottieEntry,
  LottiePreset,
} from './registry';

// Default export is the main player
export { LottiePlayer as default } from './LottiePlayer';
