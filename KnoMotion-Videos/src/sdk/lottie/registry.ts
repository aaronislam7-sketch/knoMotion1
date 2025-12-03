/**
 * Lottie Registry - Single Source of Truth
 * 
 * Consolidated registry for all Lottie animations:
 * - Inline animations (no external files needed)
 * - Static file references
 * - Presets with playback configurations
 * 
 * @module lottie/registry
 */

import type { LottieAnimationData } from '@remotion/lottie';
import { staticFile } from 'remotion';

// ============================================================================
// TYPES
// ============================================================================

export type LottieSource =
  | { kind: 'static'; src: string }
  | { kind: 'inline'; data: LottieAnimationData };

export interface LottiePreset {
  lottieRef: string;
  loop: boolean;
  playbackRate: number;
  style?: React.CSSProperties;
  entranceDelay?: number;
  entranceDuration?: number;
}

// ============================================================================
// INLINE ANIMATIONS
// ============================================================================

/**
 * Animated checkmark - Perfect for quiz reveals, completion states
 * 
 * NOTE: All inline Lottie animations MUST include these fields:
 * - Root: v, fr, ip, op, w, h, nm, ddd, assets, layers, markers
 * - Layer: ddd, ind, ty, nm, sr, ks, ao, ip, op, st, bm
 */
export const checkmarkAnimation: LottieAnimationData = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 45,
  w: 200,
  h: 200,
  nm: "Checkmark",
  ddd: 0,
  assets: [],
  layers: [{
    ddd: 0,
    ind: 1,
    ty: 4,
    nm: "check",
    sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      r: { a: 0, k: 0 },
      p: { a: 0, k: [100, 100, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: {
        a: 1,
        k: [
          { t: 0, s: [0, 0, 100] },
          { t: 15, s: [120, 120, 100] },
          { t: 25, s: [100, 100, 100] }
        ]
      }
    },
    ao: 0,
    ip: 0,
    op: 45,
    st: 0,
    bm: 0,
    shapes: [{
      ty: "gr",
      it: [{
        ind: 0,
        ty: "sh",
        ks: {
          a: 0,
          k: {
            i: [[0, 0], [0, 0], [0, 0]],
            o: [[0, 0], [0, 0], [0, 0]],
            v: [[-40, 0], [-15, 25], [40, -30]],
            c: false
          }
        }
      }, {
        ty: "st",
        c: { a: 0, k: [0.16, 0.68, 0.38, 1] },
        o: { a: 0, k: 100 },
        w: { a: 0, k: 16 },
        lc: 2,
        lj: 2
      }, {
        ty: "tr",
        p: { a: 0, k: [0, 0] },
        a: { a: 0, k: [0, 0] },
        s: { a: 0, k: [100, 100] },
        r: { a: 0, k: 0 },
        o: { a: 0, k: 100 }
      }],
      nm: "Check Shape"
    }, {
      ty: "tm",
      s: { a: 0, k: 0 },
      e: {
        a: 1,
        k: [
          { t: 0, s: [0] },
          { t: 30, s: [100] }
        ]
      },
      o: { a: 0, k: 0 },
      m: 1
    }]
  }],
  markers: []
} as LottieAnimationData;

/**
 * Sparkle burst animation
 */
export const sparkleAnimation: LottieAnimationData = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 35,
  w: 200,
  h: 200,
  nm: "Sparkle",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "star",
      sr: 1,
      ks: {
        o: { a: 1, k: [{ t: 0, s: [0] }, { t: 8, s: [100] }, { t: 25, s: [0] }] },
        r: { a: 1, k: [{ t: 0, s: [0] }, { t: 35, s: [180] }] },
        p: { a: 0, k: [100, 100, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 1, k: [{ t: 0, s: [50, 50, 100] }, { t: 12, s: [130, 130, 100] }, { t: 25, s: [80, 80, 100] }] }
      },
      ao: 0,
      ip: 0,
      op: 35,
      st: 0,
      bm: 0,
      shapes: [{
        ty: "gr",
        it: [{
          ty: "sr",
          sy: 1,
          pt: { a: 0, k: 4 },
          p: { a: 0, k: [0, 0] },
          r: { a: 0, k: 0 },
          ir: { a: 0, k: 15 },
          or: { a: 0, k: 35 }
        }, {
          ty: "fl",
          c: { a: 0, k: [1, 0.84, 0, 1] },
          o: { a: 0, k: 100 }
        }, {
          ty: "tr",
          p: { a: 0, k: [0, 0] },
          a: { a: 0, k: [0, 0] },
          s: { a: 0, k: [100, 100] },
          r: { a: 0, k: 0 },
          o: { a: 0, k: 100 }
        }],
        nm: "Star Group"
      }]
    }
  ],
  markers: []
} as LottieAnimationData;

/**
 * Lightbulb "aha moment" animation
 */
export const lightbulbAnimation: LottieAnimationData = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 50,
  w: 200,
  h: 200,
  nm: "Lightbulb",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "bulb",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [100, 100, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 1, k: [{ t: 0, s: [80, 80, 100] }, { t: 10, s: [100, 100, 100] }] }
      },
      ao: 0,
      ip: 0,
      op: 50,
      st: 0,
      bm: 0,
      shapes: [{
        ty: "gr",
        it: [{
          ty: "el",
          p: { a: 0, k: [0, -10] },
          s: { a: 0, k: [50, 60] }
        }, {
          ty: "fl",
          c: { a: 1, k: [{ t: 0, s: [0.8, 0.8, 0.8, 1] }, { t: 15, s: [1, 0.95, 0.4, 1] }, { t: 25, s: [1, 0.95, 0.4, 1] }] },
          o: { a: 0, k: 100 }
        }, {
          ty: "st",
          c: { a: 0, k: [0.3, 0.3, 0.3, 1] },
          o: { a: 0, k: 100 },
          w: { a: 0, k: 3 }
        }, {
          ty: "tr",
          p: { a: 0, k: [0, 0] },
          a: { a: 0, k: [0, 0] },
          s: { a: 0, k: [100, 100] },
          r: { a: 0, k: 0 },
          o: { a: 0, k: 100 }
        }],
        nm: "Bulb Shape"
      }]
    }
  ],
  markers: []
} as LottieAnimationData;

/**
 * Thinking emoji animation
 */
export const thinkingAnimation: LottieAnimationData = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 60,
  w: 200,
  h: 200,
  nm: "Thinking",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "face",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [100, 100, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      ao: 0,
      ip: 0,
      op: 60,
      st: 0,
      bm: 0,
      shapes: [{
        ty: "gr",
        it: [{
          ty: "el",
          p: { a: 0, k: [0, 0] },
          s: { a: 0, k: [80, 80] }
        }, {
          ty: "fl",
          c: { a: 0, k: [1, 0.8, 0.2, 1] },
          o: { a: 0, k: 100 }
        }, {
          ty: "st",
          c: { a: 0, k: [0.2, 0.2, 0.2, 1] },
          o: { a: 0, k: 100 },
          w: { a: 0, k: 3 }
        }, {
          ty: "tr",
          p: { a: 0, k: [0, 0] },
          a: { a: 0, k: [0, 0] },
          s: { a: 0, k: [100, 100] },
          r: { a: 0, k: 0 },
          o: { a: 0, k: 100 }
        }],
        nm: "Face Shape"
      }]
    }
  ],
  markers: []
} as LottieAnimationData;

/**
 * Celebration confetti animation
 */
export const celebrationAnimation: LottieAnimationData = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 60,
  w: 200,
  h: 200,
  nm: "Celebration",
  ddd: 0,
  assets: [],
  layers: Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2;
    const colors = [
      [1, 0.42, 0.21, 1],
      [0.61, 0.35, 0.71, 1],
      [0.18, 0.5, 0.89, 1],
      [0.15, 0.68, 0.38, 1],
      [0.95, 0.61, 0.07, 1]
    ];
    return {
      ddd: 0,
      ind: i + 1,
      ty: 4,
      nm: `confetti-${i}`,
      sr: 1,
      ks: {
        o: { a: 1, k: [{ t: 0, s: [0] }, { t: 5, s: [100] }, { t: 50, s: [0] }] },
        r: { a: 1, k: [{ t: 0, s: [0] }, { t: 60, s: [360 * (i % 2 === 0 ? 1 : -1)] }] },
        p: { a: 1, k: [{ t: 0, s: [100, 100, 0] }, { t: 40, s: [100 + Math.cos(angle) * 80, 100 + Math.sin(angle) * 80 + 30, 0] }] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 1, k: [{ t: 0, s: [100, 100, 100] }, { t: 40, s: [60, 60, 100] }] }
      },
      ao: 0,
      ip: 0,
      op: 60,
      st: 0,
      bm: 0,
      shapes: [{
        ty: "gr",
        it: [{
          ty: "rc",
          p: { a: 0, k: [0, 0] },
          s: { a: 0, k: [12, 8] },
          r: { a: 0, k: 1 }
        }, {
          ty: "fl",
          c: { a: 0, k: colors[i % colors.length] },
          o: { a: 0, k: 100 }
        }, {
          ty: "tr",
          p: { a: 0, k: [0, 0] },
          a: { a: 0, k: [0, 0] },
          s: { a: 0, k: [100, 100] },
          r: { a: 0, k: 0 },
          o: { a: 0, k: 100 }
        }],
        nm: `Confetti ${i}`
      }]
    };
  }),
  markers: []
} as LottieAnimationData;

/**
 * Thermometer animation
 */
export const thermometerAnimation: LottieAnimationData = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 60,
  w: 200,
  h: 200,
  nm: "Thermometer",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "body",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [100, 100, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      ao: 0,
      ip: 0,
      op: 60,
      st: 0,
      bm: 0,
      shapes: [{
        ty: "gr",
        it: [
          { ty: "rc", p: { a: 0, k: [0, -30] }, s: { a: 0, k: [40, 120] }, r: { a: 0, k: 20 } },
          { ty: "el", p: { a: 0, k: [0, 50] }, s: { a: 0, k: [60, 60] } },
          { ty: "st", c: { a: 0, k: [0.84, 0.84, 0.84, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 6 } },
          { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
        ],
        nm: "Body Shape"
      }]
    },
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "mercury",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [100, 100, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 1, k: [{ t: 0, s: [100, 0, 100] }, { t: 45, s: [100, 90, 100] }] }
      },
      ao: 0,
      ip: 0,
      op: 60,
      st: 0,
      bm: 0,
      shapes: [{
        ty: "gr",
        it: [
          { ty: "rc", p: { a: 0, k: [0, -10] }, s: { a: 0, k: [28, 100] }, r: { a: 0, k: 12 } },
          { ty: "el", p: { a: 0, k: [0, 60] }, s: { a: 0, k: [48, 48] } },
          { ty: "fl", c: { a: 0, k: [1, 0.36, 0.21, 1] }, o: { a: 0, k: 100 } },
          { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
        ],
        nm: "Mercury Shape"
      }]
    }
  ],
  markers: []
} as LottieAnimationData;

/**
 * Snowflake animation
 */
export const snowflakeAnimation: LottieAnimationData = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 60,
  w: 200,
  h: 200,
  nm: "Snowflake",
  ddd: 0,
  assets: [],
  layers: [{
    ddd: 0,
    ind: 1,
    ty: 4,
    nm: "flake",
    sr: 1,
    ks: {
      o: { a: 1, k: [{ t: 0, s: [0] }, { t: 10, s: [100] }, { t: 50, s: [0] }] },
      r: { a: 1, k: [{ t: 0, s: [0] }, { t: 60, s: [120] }] },
      p: { a: 0, k: [100, 100, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 1, k: [{ t: 0, s: [80, 80, 100] }, { t: 30, s: [120, 120, 100] }, { t: 60, s: [90, 90, 100] }] }
    },
    ao: 0,
    ip: 0,
    op: 60,
    st: 0,
    bm: 0,
    shapes: [{
      ty: "gr",
      it: [
        { ty: "sr", sy: 2, pt: { a: 0, k: 6 }, p: { a: 0, k: [0, 0] }, r: { a: 0, k: 0 }, or: { a: 0, k: 60 } },
        { ty: "st", c: { a: 0, k: [0.66, 0.86, 1, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 4 } },
        { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
      ],
      nm: "Flake Shape"
    }]
  }],
  markers: []
} as LottieAnimationData;

/**
 * Water drop animation
 */
export const waterDropAnimation: LottieAnimationData = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 60,
  w: 200,
  h: 200,
  nm: "Water Drop",
  ddd: 0,
  assets: [],
  layers: [{
    ddd: 0,
    ind: 1,
    ty: 4,
    nm: "drop",
    sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      r: { a: 0, k: 0 },
      p: { a: 1, k: [{ t: 0, s: [100, 60, 0] }, { t: 30, s: [100, 120, 0] }, { t: 60, s: [100, 60, 0] }] },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 1, k: [{ t: 0, s: [60, 60, 100] }, { t: 30, s: [80, 80, 100] }, { t: 60, s: [60, 60, 100] }] }
    },
    ao: 0,
    ip: 0,
    op: 60,
    st: 0,
    bm: 0,
    shapes: [{
      ty: "gr",
      it: [
        { ty: "el", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [50, 70] } },
        { ty: "fl", c: { a: 0, k: [0.32, 0.66, 1, 1] }, o: { a: 0, k: 100 } },
        { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
      ],
      nm: "Drop Shape"
    }]
  }],
  markers: []
} as LottieAnimationData;

/**
 * Arrow animation
 */
export const arrowAnimation: LottieAnimationData = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 45,
  w: 200,
  h: 200,
  nm: "Arrow",
  ddd: 0,
  assets: [],
  layers: [{
    ddd: 0,
    ind: 1,
    ty: 4,
    nm: "arrow",
    sr: 1,
    ks: {
      o: { a: 1, k: [{ t: 0, s: [0] }, { t: 10, s: [100] }] },
      r: { a: 0, k: 0 },
      p: { a: 1, k: [{ t: 0, s: [60, 100, 0] }, { t: 20, s: [140, 100, 0] }, { t: 35, s: [120, 100, 0] }, { t: 45, s: [140, 100, 0] }] },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 0, k: [100, 100, 100] }
    },
    ao: 0,
    ip: 0,
    op: 45,
    st: 0,
    bm: 0,
    shapes: [{
      ty: "gr",
      it: [
        { ty: "sh", ks: { a: 0, k: { c: false, v: [[-30, 0], [20, 0]], i: [[0, 0], [0, 0]], o: [[0, 0], [0, 0]] } } },
        { ty: "sh", ks: { a: 0, k: { c: false, v: [[15, -10], [30, 0], [15, 10]], i: [[0, 0], [0, 0], [0, 0]], o: [[0, 0], [0, 0], [0, 0]] } } },
        { ty: "st", c: { a: 0, k: [1, 0.42, 0.21, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 8 }, lc: 2, lj: 2 },
        { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
      ],
      nm: "Arrow Shape"
    }]
  }],
  markers: []
} as LottieAnimationData;

/**
 * Loading spinner animation
 */
export const loadingAnimation: LottieAnimationData = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 60,
  w: 200,
  h: 200,
  nm: "Loading",
  ddd: 0,
  assets: [],
  layers: [{
    ddd: 0,
    ind: 1,
    ty: 4,
    nm: "spinner",
    sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      r: { a: 1, k: [{ t: 0, s: [0] }, { t: 60, s: [360] }] },
      p: { a: 0, k: [100, 100, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 0, k: [100, 100, 100] }
    },
    ao: 0,
    ip: 0,
    op: 60,
    st: 0,
    bm: 0,
    shapes: Array.from({ length: 8 }, (_, i) => ({
      ty: "gr",
      it: [
        { ty: "rc", p: { a: 0, k: [0, -35] }, s: { a: 0, k: [8, 25] }, r: { a: 0, k: 4 } },
        { ty: "fl", c: { a: 0, k: [0.18, 0.5, 0.89, 1] }, o: { a: 0, k: 100 - (i * 10) } },
        { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: (i / 8) * 360 }, o: { a: 0, k: 100 } }
      ],
      nm: `Spinner Segment ${i}`
    }))
  }],
  markers: []
} as LottieAnimationData;

// ============================================================================
// STATIC FILE HELPERS
// ============================================================================

/**
 * Create a static file entry
 * NOTE: In Vite projects, staticFile() may not work correctly.
 * We use a direct path (served from /public) as fallback.
 */
const staticEntry = (path: string): LottieSource => {
  // Try staticFile first, fall back to direct path for Vite compatibility
  let src: string;
  try {
    src = staticFile(path);
  } catch {
    // Fallback for Vite: direct path from public folder
    src = `/${path}`;
  }
  
  // In development with Vite, staticFile might return something unexpected
  // Ensure we have a proper URL format
  if (!src.startsWith('/') && !src.startsWith('http')) {
    src = `/${path}`;
  }
  
  return {
    kind: 'static',
    src,
  };
};

const inlineEntry = (data: LottieAnimationData): LottieSource => ({
  kind: 'inline',
  data,
});

// ============================================================================
// MAIN REGISTRY
// ============================================================================

export const LOTTIE_REGISTRY: Record<string, LottieSource> = {
  // Static files (from /public/lotties/)
  'success': staticEntry('lotties/success-checkmark.json'),
  'checkmark': staticEntry('lotties/success-checkmark.json'),
  'success-checkmark': staticEntry('lotties/success-checkmark.json'),
  'celebration': staticEntry('lotties/celebration-stars.json'),
  'celebration-stars': staticEntry('lotties/celebration-stars.json'),
  'burst': staticEntry('lotties/particle-burst.json'),
  'particle-burst': staticEntry('lotties/particle-burst.json'),
  'particles': staticEntry('lotties/particle-burst.json'),
  'loading': staticEntry('lotties/loading-spinner.json'),
  'loading-spinner': staticEntry('lotties/loading-spinner.json'),
  'spinner': staticEntry('lotties/loading-spinner.json'),
  'stars': staticEntry('lotties/celebration-stars.json'),

  // Inline animations
  'arrowFlow': inlineEntry(arrowAnimation),
  'arrow-flow': inlineEntry(arrowAnimation),

  // Namespaced keys (recommended)
  'core/checkmark': staticEntry('lotties/success-checkmark.json'),
  'core/celebration': staticEntry('lotties/celebration-stars.json'),
  'core/particles': staticEntry('lotties/particle-burst.json'),
  'core/loading': staticEntry('lotties/loading-spinner.json'),

  'education/lightbulb': inlineEntry(lightbulbAnimation),
  'education/checkmark': inlineEntry(checkmarkAnimation),
  'education/stars-burst': inlineEntry(sparkleAnimation),
  'education/question': inlineEntry(thinkingAnimation),

  'nature/thermometer': inlineEntry(thermometerAnimation),
  'nature/snowflake': inlineEntry(snowflakeAnimation),
  'nature/water-drop': inlineEntry(waterDropAnimation),
  'nature/waterDrop': inlineEntry(waterDropAnimation),

  'ui/arrow': inlineEntry(arrowAnimation),
  'ui/arrow-flow': inlineEntry(arrowAnimation),
  'ui/loading': inlineEntry(loadingAnimation),

  'celebration/confetti': inlineEntry(celebrationAnimation),
};

export type LottieKey = keyof typeof LOTTIE_REGISTRY;

// ============================================================================
// RESOLVER
// ============================================================================

/**
 * Resolve a Lottie source from a key
 */
export const resolveLottieSource = (key: string): LottieSource | null => {
  const entry = LOTTIE_REGISTRY[key as LottieKey];
  if (!entry) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[LottieRegistry] Unknown lottieRef "${key}"`);
    }
    return null;
  }
  return entry;
};

/**
 * Get all available Lottie keys
 */
export const getAvailableLottieKeys = (): string[] => {
  return Object.keys(LOTTIE_REGISTRY);
};

/**
 * Check if a Lottie key exists
 */
export const hasLottie = (key: string): boolean => {
  return key in LOTTIE_REGISTRY;
};

// ============================================================================
// PRESETS
// ============================================================================

export const LOTTIE_PRESETS: Record<string, LottiePreset> = {
  // Quiz & Assessment
  correctAnswer: {
    lottieRef: 'core/celebration',
    loop: false,
    playbackRate: 1.2,
    style: { width: 300, height: 300 },
  },
  checkmark: {
    lottieRef: 'core/checkmark',
    loop: false,
    playbackRate: 1.0,
    style: { width: 60, height: 60 },
  },

  // Concept & Learning
  insight: {
    lottieRef: 'education/lightbulb',
    loop: false,
    playbackRate: 1.0,
    style: { width: 120, height: 120 },
    entranceDelay: 10,
    entranceDuration: 20,
  },
  sparkle: {
    lottieRef: 'education/stars-burst',
    loop: false,
    playbackRate: 1.0,
    style: { width: 80, height: 80 },
  },

  // Progress
  stepComplete: {
    lottieRef: 'core/checkmark',
    loop: false,
    playbackRate: 1.0,
    style: { width: 50, height: 50 },
  },
  loading: {
    lottieRef: 'core/loading',
    loop: true,
    playbackRate: 1.0,
    style: { width: 60, height: 60 },
  },

  // Ambient
  backgroundParticles: {
    lottieRef: 'core/particles',
    loop: true,
    playbackRate: 0.3,
    style: { width: '40%', height: '40%', opacity: 0.1 },
  },
};

/**
 * Get a Lottie preset with optional overrides
 */
export const getLottiePreset = (
  presetName: string,
  overrides?: Partial<LottiePreset>
): LottiePreset => {
  const preset = LOTTIE_PRESETS[presetName];

  if (!preset) {
    console.warn(`[LottieRegistry] Unknown preset "${presetName}", using default`);
    return {
      lottieRef: 'education/stars-burst',
      loop: false,
      playbackRate: 1.0,
      style: { width: 100, height: 100 },
      ...overrides,
    };
  }

  return {
    ...preset,
    ...overrides,
    style: { ...preset.style, ...(overrides?.style || {}) },
  };
};
