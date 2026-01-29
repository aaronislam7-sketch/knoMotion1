/**
 * KnoSlides Spring Configurations
 * 
 * Framer Motion spring presets that match KnoMotion's animation feel.
 */

import { Transition } from 'framer-motion';

/**
 * Spring configurations matching KnoMotion's Remotion springs
 */
export const SPRING_CONFIGS = {
  /** Gentle, smooth movement - good for subtle UI */
  gentle: {
    type: 'spring' as const,
    stiffness: 100,
    damping: 15,
    mass: 1,
  },
  
  /** Smooth, natural movement - the default choice */
  smooth: {
    type: 'spring' as const,
    stiffness: 120,
    damping: 14,
    mass: 1,
  },
  
  /** Bouncy, playful movement - for celebration/emphasis */
  bouncy: {
    type: 'spring' as const,
    stiffness: 150,
    damping: 10,
    mass: 1,
  },
  
  /** Quick, responsive movement - for UI interactions */
  snappy: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 20,
    mass: 0.8,
  },
  
  /** Very soft, slow movement - for ambient animations */
  wobbly: {
    type: 'spring' as const,
    stiffness: 80,
    damping: 8,
    mass: 1,
  },
  
  /** Broadcast-grade smooth - minimal oscillation */
  broadcast: {
    type: 'spring' as const,
    stiffness: 100,
    damping: 200,
    mass: 1,
  },
} as const;

export type SpringConfigName = keyof typeof SPRING_CONFIGS;

/**
 * Get a spring transition with optional customization
 */
export const getSpring = (
  config: SpringConfigName = 'smooth',
  overrides?: Partial<Transition>
): Transition => ({
  ...SPRING_CONFIGS[config],
  ...overrides,
});

/**
 * Common transition presets
 */
export const TRANSITIONS = {
  /** Fast ease-out for quick UI feedback */
  fast: {
    duration: 0.15,
    ease: [0.25, 0.46, 0.45, 0.94],
  },
  
  /** Default smooth ease */
  default: {
    duration: 0.3,
    ease: [0.25, 0.46, 0.45, 0.94],
  },
  
  /** Slow, dramatic ease for emphasis */
  slow: {
    duration: 0.5,
    ease: [0.43, 0.13, 0.23, 0.96],
  },
  
  /** Elastic bounce for playful elements */
  elastic: {
    duration: 0.6,
    ease: [0.68, -0.55, 0.265, 1.55],
  },
} as const;

/**
 * Easing curves as arrays (for Framer Motion)
 */
export const EASING = {
  smooth: [0.4, 0.0, 0.2, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
  spring: [0.43, 0.13, 0.23, 0.96],
  sharp: [0.4, 0, 0.6, 1],
  easeInOut: [0.42, 0, 0.58, 1],
  easeOut: [0.0, 0.0, 0.2, 1],
  easeIn: [0.4, 0.0, 1, 1],
} as const;

/**
 * Stagger timing presets
 */
export const STAGGER = {
  fast: 0.05,
  default: 0.08,
  slow: 0.12,
  dramatic: 0.2,
} as const;
