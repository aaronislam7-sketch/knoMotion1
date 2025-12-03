import type { CSSProperties } from 'react';
import { KNODE_THEME } from './knodeTheme';

export type EmphasisLevel = 'high' | 'normal' | 'low';

export type EmphasisEffect = {
  textStyle: CSSProperties;
  doodle?: {
    type: 'underline' | 'highlight' | 'circle';
    color?: keyof typeof KNODE_THEME.colors;
    animate?: boolean;
    thickness?: number;
  };
  animation?: {
    type: 'pulse' | 'breathe';
    /** Scale amount (e.g., 0.05 = 5% scale change) */
    amount?: number;
    /** Speed multiplier (higher = faster, default 1) */
    speed?: number;
  };
};

const baseEffect: EmphasisEffect = {
  textStyle: {
    fontWeight: 600,
    color: KNODE_THEME.colors.textMain,
  },
};

export const EMPHASIS_EFFECTS: Record<EmphasisLevel, EmphasisEffect> = {
  high: {
    ...baseEffect,
    textStyle: {
      fontWeight: 700,
      color: KNODE_THEME.colors.primary,
      backgroundColor: `${KNODE_THEME.colors.primary}12`,
      padding: '4px 8px',
      borderRadius: 6,
    },
    doodle: { type: 'highlight', color: 'doodle', animate: true, thickness: 4 },
    animation: { type: 'pulse', amount: 0.08, speed: 1.5 }, // Enhanced: more visible pulse
  },
  normal: {
    ...baseEffect,
    textStyle: {
      fontWeight: 600,
      color: KNODE_THEME.colors.textMain,
    },
    animation: { type: 'breathe', amount: 0.015, speed: 1 },
  },
  low: {
    ...baseEffect,
    textStyle: {
      fontWeight: 400,
      color: KNODE_THEME.colors.textSoft,
    },
  },
};

export const resolveEmphasisEffect = (
  emphasis?: EmphasisLevel,
): EmphasisEffect => {
  if (!emphasis) {
    return EMPHASIS_EFFECTS.normal;
  }
  return EMPHASIS_EFFECTS[emphasis] ?? EMPHASIS_EFFECTS.normal;
};
