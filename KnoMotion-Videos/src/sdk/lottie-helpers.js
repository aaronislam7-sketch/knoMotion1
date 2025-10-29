/**
 * Template SDK - Lottie Animation Helpers
 * Utilities for working with Lottie animations
 */

/**
 * Get animation progress for Lottie player
 */
export const getLottieProgress = (frame, startFrame, duration, loop = false) => {
  if (frame < startFrame) return 0;
  
  const elapsed = frame - startFrame;
  
  if (loop) {
    return (elapsed % duration) / duration;
  }
  
  return Math.min(elapsed / duration, 1);
};

/**
 * Common Lottie animation configurations
 */
export const LOTTIE_CONFIGS = {
  checkmark: {
    loop: false,
    autoplay: false,
    renderer: 'svg',
    speed: 1
  },
  loading: {
    loop: true,
    autoplay: true,
    renderer: 'svg',
    speed: 1
  },
  writing: {
    loop: false,
    autoplay: false,
    renderer: 'svg',
    speed: 0.8
  },
  celebration: {
    loop: false,
    autoplay: false,
    renderer: 'svg',
    speed: 1.2
  }
};

/**
 * Inline Lottie animations (simple JSON definitions)
 */
export const INLINE_ANIMATIONS = {
  // Simple checkmark animation
  checkmark: {
    v: "5.7.4",
    fr: 30,
    ip: 0,
    op: 30,
    w: 100,
    h: 100,
    assets: [],
    layers: [{
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "check",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        p: { a: 0, k: [50, 50, 0] }
      },
      shapes: [{
        ty: "gr",
        it: [{
          ty: "sh",
          ks: {
            a: 1,
            k: [{
              t: 0,
              s: [{ c: false, v: [[20, 50], [20, 50]], i: [[0, 0]], o: [[0, 0]] }]
            }, {
              t: 15,
              s: [{ c: false, v: [[20, 50], [40, 70]], i: [[0, 0]], o: [[0, 0]] }]
            }, {
              t: 30,
              s: [{ c: false, v: [[20, 50], [40, 70], [80, 30]], i: [[0, 0], [0, 0]], o: [[0, 0], [0, 0]] }]
            }]
          }
        }, {
          ty: "st",
          c: { a: 0, k: [0.29, 0.61, 0.24, 1] },
          o: { a: 0, k: 100 },
          w: { a: 0, k: 8 },
          lc: 2,
          lj: 2
        }]
      }]
    }]
  },
  
  // Simple arrow animation
  arrow: {
    v: "5.7.4",
    fr: 30,
    ip: 0,
    op: 30,
    w: 100,
    h: 100,
    assets: [],
    layers: [{
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "arrow",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        p: { a: 0, k: [50, 50, 0] }
      },
      shapes: [{
        ty: "gr",
        it: [{
          ty: "sh",
          ks: {
            a: 1,
            k: [{
              t: 0,
              s: [{ c: false, v: [[10, 50], [10, 50]], i: [[0, 0]], o: [[0, 0]] }]
            }, {
              t: 20,
              s: [{ c: false, v: [[10, 50], [70, 50]], i: [[0, 0]], o: [[0, 0]] }]
            }]
          }
        }, {
          ty: "st",
          c: { a: 0, k: [0.29, 0.61, 0.24, 1] },
          o: { a: 0, k: 100 },
          w: { a: 0, k: 6 },
          lc: 2,
          lj: 2
        }]
      }]
    }]
  }
};

/**
 * Create a simple Lottie animation object
 */
export const createSimpleAnimation = (type, color = '#4a9c3b', duration = 30) => {
  return INLINE_ANIMATIONS[type] || INLINE_ANIMATIONS.checkmark;
};
