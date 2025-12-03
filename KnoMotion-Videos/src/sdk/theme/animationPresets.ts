/**
 * Animation Presets System
 * 
 * Centralized animation configurations that map to SDK animation functions.
 * Mid-scenes should use these presets (with optional overrides) instead of
 * direct SDK animation calls.
 * 
 * @module theme/animationPresets
 */

import type { CSSProperties } from 'react';

// ============================================================================
// TYPES
// ============================================================================

export type AnimationPresetName =
  | 'subtle'
  | 'bouncy'
  | 'dramatic'
  | 'minimal'
  | 'educational';

export type EntranceType =
  | 'fadeIn'
  | 'slideIn'
  | 'scaleIn'
  | 'bounceIn'
  | 'fadeSlide'
  | 'spring';

export type ExitType =
  | 'fadeOut'
  | 'slideOut'
  | 'scaleOut';

export type SpringConfigName =
  | 'gentle'
  | 'smooth'
  | 'bouncy'
  | 'snappy'
  | 'wobbly';

export type Direction = 'up' | 'down' | 'left' | 'right';

export type StaggerDirection = 'forward' | 'reverse' | 'center-out';

export interface EntranceConfig {
  type: EntranceType;
  duration: number; // seconds
  direction?: Direction;
  distance?: number; // pixels
  springConfig?: SpringConfigName;
}

export interface ExitConfig {
  type: ExitType;
  duration: number; // seconds
  direction?: Direction;
  distance?: number; // pixels
}

export interface ContinuousLifeConfig {
  breathing?: {
    frequency: number; // oscillation speed
    amplitude: number; // scale variance (e.g., 0.02 = 2%)
  };
  floating?: {
    frequency: number;
    amplitude: number; // pixels
  };
  rotation?: {
    frequency: number;
    amplitude: number; // degrees
  };
}

export interface StaggerConfig {
  delay: number; // seconds between items
  direction?: StaggerDirection;
}

export interface AnimationPreset {
  entrance: EntranceConfig;
  exit: ExitConfig;
  continuousLife?: ContinuousLifeConfig;
  stagger: StaggerConfig;
}

// ============================================================================
// SPRING CONFIGS (matches SDK animations/index.js)
// ============================================================================

export const SPRING_CONFIGS = {
  gentle: { damping: 15, mass: 1, stiffness: 100 },
  smooth: { damping: 12, mass: 1, stiffness: 120 },
  bouncy: { damping: 8, mass: 1, stiffness: 150 },
  snappy: { damping: 20, mass: 0.8, stiffness: 180 },
  wobbly: { damping: 5, mass: 1, stiffness: 100 },
} as const;

// ============================================================================
// ANIMATION PRESETS
// ============================================================================

export const ANIMATION_PRESETS: Record<AnimationPresetName, AnimationPreset> = {
  /**
   * Subtle - Clean, professional animations
   * Best for: Focus preset, minimal designs
   */
  subtle: {
    entrance: {
      type: 'fadeIn',
      duration: 0.5,
    },
    exit: {
      type: 'fadeOut',
      duration: 0.3,
    },
    stagger: {
      delay: 0.15,
      direction: 'forward',
    },
  },

  /**
   * Bouncy - Playful, energetic animations
   * Best for: Playful preset, fun content
   */
  bouncy: {
    entrance: {
      type: 'bounceIn',
      duration: 0.6,
      springConfig: 'bouncy',
    },
    exit: {
      type: 'scaleOut',
      duration: 0.3,
    },
    continuousLife: {
      breathing: {
        frequency: 0.03,
        amplitude: 0.02,
      },
    },
    stagger: {
      delay: 0.2,
      direction: 'forward',
    },
  },

  /**
   * Dramatic - Bold, impactful animations
   * Best for: Mentor preset, emphasis moments
   */
  dramatic: {
    entrance: {
      type: 'fadeSlide',
      duration: 0.8,
      direction: 'up',
      distance: 60,
    },
    exit: {
      type: 'fadeOut',
      duration: 0.4,
    },
    continuousLife: {
      floating: {
        frequency: 0.02,
        amplitude: 8,
      },
    },
    stagger: {
      delay: 0.3,
      direction: 'forward',
    },
  },

  /**
   * Minimal - Very subtle, barely noticeable
   * Best for: Minimal preset, dense content
   */
  minimal: {
    entrance: {
      type: 'fadeIn',
      duration: 0.4,
    },
    exit: {
      type: 'fadeOut',
      duration: 0.25,
    },
    stagger: {
      delay: 0.1,
      direction: 'forward',
    },
  },

  /**
   * Educational - Clear, methodical animations
   * Best for: Educational preset, instructional content
   */
  educational: {
    entrance: {
      type: 'slideIn',
      duration: 0.5,
      direction: 'left',
      distance: 40,
    },
    exit: {
      type: 'slideOut',
      duration: 0.3,
      direction: 'right',
      distance: 40,
    },
    stagger: {
      delay: 0.25,
      direction: 'forward',
    },
  },
};

// ============================================================================
// RESOLVER
// ============================================================================

/**
 * Resolve an animation preset by name, with optional overrides.
 * 
 * @param presetName - Name of the preset to use
 * @param overrides - Optional partial overrides for any preset property
 * @returns Complete AnimationPreset
 * 
 * @example
 * // Use preset as-is
 * const anim = resolveAnimationPreset('bouncy');
 * 
 * @example
 * // Override entrance duration
 * const anim = resolveAnimationPreset('bouncy', {
 *   entrance: { duration: 0.4 }
 * });
 */
export const resolveAnimationPreset = (
  presetName?: AnimationPresetName | string,
  overrides?: Partial<AnimationPreset>
): AnimationPreset => {
  // Get base preset, default to 'subtle'
  const base = ANIMATION_PRESETS[presetName as AnimationPresetName] 
    || ANIMATION_PRESETS.subtle;

  // If no overrides, return base
  if (!overrides) {
    return base;
  }

  // Deep merge overrides
  return {
    entrance: {
      ...base.entrance,
      ...(overrides.entrance || {}),
    },
    exit: {
      ...base.exit,
      ...(overrides.exit || {}),
    },
    continuousLife: overrides.continuousLife !== undefined
      ? overrides.continuousLife
      : base.continuousLife,
    stagger: {
      ...base.stagger,
      ...(overrides.stagger || {}),
    },
  };
};

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Get spring config object from name
 */
export const getSpringConfig = (name?: SpringConfigName) => {
  return SPRING_CONFIGS[name || 'smooth'];
};

/**
 * Convert preset entrance to animation function parameters
 */
export const getEntranceParams = (entrance: EntranceConfig) => ({
  type: entrance.type,
  duration: entrance.duration,
  direction: entrance.direction || 'up',
  distance: entrance.distance || 40,
  springConfig: entrance.springConfig ? SPRING_CONFIGS[entrance.springConfig] : undefined,
});

/**
 * Convert preset exit to animation function parameters
 */
export const getExitParams = (exit: ExitConfig) => ({
  type: exit.type,
  duration: exit.duration,
  direction: exit.direction || 'down',
  distance: exit.distance || 40,
});

/**
 * Calculate stagger delay for an item at given index
 */
export const getStaggerDelay = (
  stagger: StaggerConfig,
  index: number,
  totalItems: number
): number => {
  switch (stagger.direction) {
    case 'reverse':
      return stagger.delay * (totalItems - 1 - index);
    case 'center-out':
      const center = (totalItems - 1) / 2;
      return stagger.delay * Math.abs(index - center);
    case 'forward':
    default:
      return stagger.delay * index;
  }
};

// ============================================================================
// PRESET NAME MAPPING
// ============================================================================

/**
 * Map from stylePreset animationPreset values to AnimationPresetName
 * This ensures compatibility with existing stylePresets.ts
 */
export const STYLE_TO_ANIMATION_PRESET: Record<string, AnimationPresetName> = {
  subtle: 'subtle',
  bouncy: 'bouncy',
  dramatic: 'dramatic',
  minimal: 'minimal',
  educational: 'educational',
};
