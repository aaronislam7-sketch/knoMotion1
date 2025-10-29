/**
 * Easing Functions for Human-Made Motion
 * 
 * Carefully crafted curves that feel designed and intentional,
 * not programmatic. These create smooth, natural-feeling animations
 * with subtle imperfections that mimic hand-drawn motion.
 */

import { Easing } from 'remotion';

// ==================== BLUEPRINT V5 EASING MAP (EZ) ====================

/**
 * Centralized easing map for all templates
 * Use these named easings instead of inline bezier curves
 */
export const EZ = {
  // Default for most things - natural, material-style ease
  smooth: Easing.bezier(0.4, 0, 0.2, 1),
  
  // Calm, balanced in-out - good for camera pans & big moves
  power2InOut: Easing.bezier(0.45, 0, 0.55, 1),
  
  // Punchier S-curve - hero entrances, decisive repositioning
  power3InOut: Easing.bezier(0.65, 0, 0.35, 1),
  
  // Confident exits / compressions - slide/fade outs
  power3In: Easing.bezier(0.55, 0, 1, 0.45),
  
  // Gentle landings - secondary reveals, UI settles
  power2Out: Easing.bezier(0, 0, 0.2, 1),
  
  // Tiny overshoot for charm - tick pops, lightbulb, emphasis
  backOut: Easing.bezier(0.175, 0.885, 0.32, 1.275),
};

/**
 * Get easing function by name (with fallback to smooth)
 * 
 * @param name - Easing name from EZ map
 * @returns Remotion easing function
 */
export const getEasing = (name: string) => {
  return EZ[name as keyof typeof EZ] || EZ.smooth;
};

// ==================== LEGACY EASINGS (Deprecated, use EZ map) ====================

// Smooth & Natural
export const easeOutSoft = [0.2, 0.8, 0.2, 1];
export const easeInOut = [0.4, 0.0, 0.2, 1];
export const easeOut = [0.0, 0.0, 0.2, 1];
export const easeIn = [0.4, 0.0, 1.0, 1.0];

// ==================== BOUNCY & ELASTIC ====================

// Gentle overshoot - subtle but noticeable
export const easeOutBack = [0.175, 0.885, 0.32, 1.275];

// Stronger bounce - playful and energetic
export const easeOutBounce = [0.68, -0.55, 0.265, 1.55];

// Elastic spring - rubber band effect
export const easeOutElastic = [0.1, 0.8, 0.2, 1.4];

// Snap back - strong overshoot then settle
export const easeOutSnap = [0.25, 0.46, 0.45, 1.94];

// ==================== HAND-DRAWN FEEL ====================

// Pencil sketch - slight hesitation then quick
export const easePencil = [0.6, 0.04, 0.2, 1.0];

// Marker stroke - confident and smooth
export const easeMarker = [0.25, 0.1, 0.25, 1.0];

// Chalk dust - soft start, trailing off
export const easeChalk = [0.33, 1.0, 0.68, 1.0];

// Brush paint - pressure-sensitive feel
export const easeBrush = [0.42, 0.0, 0.58, 1.0];

// ==================== ORGANIC & IMPERFECT ====================

// Hand wobble - slight irregularity
export const easeWobble = [0.36, 0.07, 0.19, 0.97];

// Breathing - natural rhythm
export const easeBreathe = [0.37, 0.0, 0.63, 1.0];

// Settle - like dropping something soft
export const easeSettle = [0.32, 0.94, 0.6, 1.0];

// Float - gentle rise and fall
export const easeFloat = [0.25, 0.46, 0.45, 0.94];

// ==================== UTILITY FUNCTIONS ====================

/**
 * Convert cubic-bezier array to CSS string
 */
export const toCss = (bezier: number[]): string => 
  `cubic-bezier(${bezier.join(', ')})`;

/**
 * Get legacy easing by name (with fallback)
 * @deprecated Use getEasing() with EZ map instead
 */
export const getLegacyEasing = (name: string): number[] => {
  const easings: Record<string, number[]> = {
    soft: easeOutSoft,
    smooth: easeInOut,
    bounce: easeOutBounce,
    elastic: easeOutElastic,
    snap: easeOutSnap,
    pencil: easePencil,
    marker: easeMarker,
    chalk: easeChalk,
    brush: easeBrush,
    wobble: easeWobble,
    breathe: easeBreathe,
    settle: easeSettle,
    float: easeFloat,
  };
  return easings[name] || easeOutSoft;
};

/**
 * Create imperfect timing - adds human variation
 * @param baseDelay - Base delay in frames
 * @param variance - Random variance (0-1, default 0.12)
 */
export const imperfectDelay = (baseDelay: number, variance = 0.12): number => {
  const randomOffset = (Math.random() - 0.5) * 2 * variance;
  return Math.round(baseDelay * (1 + randomOffset));
};

/**
 * Jitter function - adds micro-movement for hand-drawn feel
 * @param seed - Deterministic seed for consistent jitter
 * @param amount - Jitter amount in pixels (default 2)
 */
export const jitter = (seed: number, amount = 2): { x: number; y: number } => {
  // Use seed for deterministic but pseudo-random values
  const x = Math.sin(seed * 12.9898) * amount;
  const y = Math.cos(seed * 78.233) * amount;
  return { x, y };
};

/**
 * Wobble rotation - subtle rotation for hand-drawn elements
 * @param seed - Deterministic seed
 * @param degrees - Max rotation in degrees (default 0.5)
 */
export const wobble = (seed: number, degrees = 0.5): number => {
  return Math.sin(seed * 43758.5453) * degrees;
};

