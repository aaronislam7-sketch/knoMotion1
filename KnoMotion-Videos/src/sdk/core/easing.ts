/**
 * Easing Functions — Thin wrappers around Remotion's Easing module
 * 
 * The EZ map provides named bezier curves built on Remotion's Easing.bezier().
 * For standard easing curves (easeIn, easeOut, etc.), use Remotion's Easing
 * module directly: import { Easing } from 'remotion';
 * 
 * Utility functions (jitter, wobble, imperfectDelay) provide deterministic
 * pseudo-random values for hand-drawn/organic animation effects.
 */

import { Easing } from 'remotion';

// ==================== NAMED EASING MAP ====================

/**
 * Centralized easing map for all templates.
 * Each value is a Remotion Easing function created via Easing.bezier().
 */
export const EZ = {
  smooth: Easing.bezier(0.4, 0, 0.2, 1),
  power2InOut: Easing.bezier(0.45, 0, 0.55, 1),
  power3InOut: Easing.bezier(0.65, 0, 0.35, 1),
  power3In: Easing.bezier(0.55, 0, 1, 0.45),
  power2Out: Easing.bezier(0, 0, 0.2, 1),
  power3Out: Easing.bezier(0.33, 1, 0.68, 1),
  backOut: Easing.bezier(0.175, 0.885, 0.32, 1.275),
  easeInOutQuad: Easing.bezier(0.45, 0, 0.55, 1),
};

/**
 * Get easing function by name (with fallback to smooth)
 */
export const getEasing = (name: string) => {
  return EZ[name as keyof typeof EZ] || EZ.smooth;
};

// ==================== ORGANIC MOTION UTILITIES ====================

/**
 * Create imperfect timing — adds human variation
 * @param baseDelay - Base delay in frames
 * @param variance - Random variance (0-1, default 0.12)
 */
export const imperfectDelay = (baseDelay: number, variance = 0.12): number => {
  const randomOffset = (Math.random() - 0.5) * 2 * variance;
  return Math.round(baseDelay * (1 + randomOffset));
};

/**
 * Jitter function — adds micro-movement for hand-drawn feel
 * @param seed - Deterministic seed for consistent jitter
 * @param amount - Jitter amount in pixels (default 2)
 */
export const jitter = (seed: number, amount = 2): { x: number; y: number } => {
  const x = Math.sin(seed * 12.9898) * amount;
  const y = Math.cos(seed * 78.233) * amount;
  return { x, y };
};

/**
 * Wobble rotation — subtle rotation for hand-drawn elements
 * @param seed - Deterministic seed
 * @param degrees - Max rotation in degrees (default 0.5)
 */
export const wobble = (seed: number, degrees = 0.5): number => {
  return Math.sin(seed * 43758.5453) * degrees;
};
