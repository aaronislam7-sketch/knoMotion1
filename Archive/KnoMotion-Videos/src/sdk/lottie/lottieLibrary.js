/**
 * LOTTIE MICRO-ANIMATIONS LIBRARY
 * 
 * Collection of inline Lottie animations for microdelights:
 * - Checkmarks / Success indicators
 * - Sparkles / Magic effects
 * - Reaction emojis (thinking, lightbulb, celebration)
 * - Arrows and pointers
 * - Loading and progress indicators
 * 
 * These are lightweight, inline JSON definitions (no external files needed)
 */

/**
 * Animated checkmark - Perfect for quiz reveals, completion states
 */
export const checkmarkAnimation = {
  v: "5.9.0",
  fr: 30,
  ip: 0,
  op: 45,
  w: 200,
  h: 200,
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
    shapes: [{
      ty: "gr",
      it: [{
        ty: "sh",
        ks: {
          a: 1,
          k: [
            { t: 0, s: [{ c: false, v: [[0, 0], [0, 0]], i: [[0, 0]], o: [[0, 0]] }] },
            { t: 15, s: [{ c: false, v: [[-40, 0], [-15, 25]], i: [[0, 0]], o: [[0, 0]] }] },
            { t: 30, s: [{ c: false, v: [[-40, 0], [-15, 25], [40, -30]], i: [[0, 0], [0, 0]], o: [[0, 0], [0, 0]] }] }
          ]
        }
      }, {
        ty: "st",
        c: { a: 0, k: [0.16, 0.68, 0.38, 1] },
        o: { a: 0, k: 100 },
        w: { a: 0, k: 16 },
        lc: 2,
        lj: 2
      }]
    }]
  }]
};

/**
 * Sparkle burst - Great for emphasis moments
 */
export const sparkleAnimation = {
  v: "5.9.0",
  fr: 30,
  ip: 0,
  op: 35,
  w: 200,
  h: 200,
  assets: [],
  layers: [
    // Central star
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "star",
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            { t: 0, s: [0] },
            { t: 8, s: [100] },
            { t: 25, s: [0] }
          ]
        },
        r: {
          a: 1,
          k: [
            { t: 0, s: [0] },
            { t: 35, s: [180] }
          ]
        },
        p: { a: 0, k: [100, 100, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [50, 50, 100] },
            { t: 12, s: [130, 130, 100] },
            { t: 25, s: [80, 80, 100] }
          ]
        }
      },
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
        }]
      }]
    },
    // Particles
    ...Array.from({ length: 6 }, (_, i) => ({
      ddd: 0,
      ind: i + 2,
      ty: 4,
      nm: `particle-${i}`,
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            { t: 10, s: [0] },
            { t: 15, s: [100] },
            { t: 30, s: [0] }
          ]
        },
        p: {
          a: 1,
          k: [
            { t: 10, s: [100, 100] },
            { 
              t: 30, 
              s: [
                100 + Math.cos((i / 6) * Math.PI * 2) * 50,
                100 + Math.sin((i / 6) * Math.PI * 2) * 50
              ] 
            }
          ]
        },
        s: {
          a: 1,
          k: [
            { t: 10, s: [100, 100, 100] },
            { t: 30, s: [30, 30, 100] }
          ]
        }
      },
      shapes: [{
        ty: "gr",
        it: [{
          ty: "el",
          p: { a: 0, k: [0, 0] },
          s: { a: 0, k: [8, 8] }
        }, {
          ty: "fl",
          c: { a: 0, k: [1, 0.84, 0, 1] },
          o: { a: 0, k: 100 }
        }]
      }]
    }))
  ]
};

/**
 * Lightbulb "aha moment" - For reveals and insights
 */
export const lightbulbAnimation = {
  v: "5.9.0",
  fr: 30,
  ip: 0,
  op: 50,
  w: 200,
  h: 200,
  assets: [],
  layers: [
    // Bulb shape
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "bulb",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        p: { a: 0, k: [100, 100, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [80, 80, 100] },
            { t: 10, s: [100, 100, 100] }
          ]
        }
      },
      shapes: [{
        ty: "gr",
        it: [{
          ty: "el",
          p: { a: 0, k: [0, -10] },
          s: { a: 0, k: [50, 60] }
        }, {
          ty: "fl",
          c: {
            a: 1,
            k: [
              { t: 0, s: [0.8, 0.8, 0.8, 1] },
              { t: 15, s: [1, 0.95, 0.4, 1] },
              { t: 25, s: [1, 0.95, 0.4, 1] }
            ]
          },
          o: { a: 0, k: 100 }
        }, {
          ty: "st",
          c: { a: 0, k: [0.3, 0.3, 0.3, 1] },
          o: { a: 0, k: 100 },
          w: { a: 0, k: 3 }
        }]
      }]
    },
    // Glow rays
    ...Array.from({ length: 8 }, (_, i) => ({
      ddd: 0,
      ind: i + 2,
      ty: 4,
      nm: `ray-${i}`,
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            { t: 15, s: [0] },
            { t: 20, s: [80] },
            { t: 40, s: [0] }
          ]
        },
        r: { a: 0, k: (i / 8) * 360 },
        p: { a: 0, k: [100, 90, 0] },
        s: {
          a: 1,
          k: [
            { t: 15, s: [0, 100, 100] },
            { t: 25, s: [100, 100, 100] },
            { t: 40, s: [120, 100, 100] }
          ]
        }
      },
      shapes: [{
        ty: "gr",
        it: [{
          ty: "rc",
          p: { a: 0, k: [35, 0] },
          s: { a: 0, k: [25, 4] },
          r: { a: 0, k: 2 }
        }, {
          ty: "fl",
          c: { a: 0, k: [1, 0.95, 0.4, 1] },
          o: { a: 0, k: 100 }
        }]
      }]
    }))
  ]
};

/**
 * Thinking emoji - For questions and prompts
 */
export const thinkingAnimation = {
  v: "5.9.0",
  fr: 30,
  ip: 0,
  op: 60,
  w: 200,
  h: 200,
  assets: [],
  layers: [
    // Face
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "face",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        p: { a: 0, k: [100, 100, 0] }
      },
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
        }]
      }]
    },
    // Thought bubbles (animated)
    ...Array.from({ length: 3 }, (_, i) => ({
      ddd: 0,
      ind: i + 2,
      ty: 4,
      nm: `bubble-${i}`,
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            { t: 10 + i * 5, s: [0] },
            { t: 15 + i * 5, s: [100] }
          ]
        },
        p: {
          a: 1,
          k: [
            { t: 10 + i * 5, s: [70 + i * 15, 40 - i * 10] },
            { t: 40 + i * 5, s: [70 + i * 15, 20 - i * 15] }
          ]
        },
        s: { a: 0, k: [80 - i * 20, 80 - i * 20, 100] }
      },
      shapes: [{
        ty: "gr",
        it: [{
          ty: "el",
          p: { a: 0, k: [0, 0] },
          s: { a: 0, k: [15 - i * 3, 15 - i * 3] }
        }, {
          ty: "fl",
          c: { a: 0, k: [0.9, 0.9, 0.9, 1] },
          o: { a: 0, k: 100 }
        }, {
          ty: "st",
          c: { a: 0, k: [0.3, 0.3, 0.3, 1] },
          o: { a: 0, k: 100 },
          w: { a: 0, k: 2 }
        }]
      }]
    }))
  ]
};

/**
 * Celebration confetti pop
 */
export const celebrationAnimation = {
  v: "5.9.0",
  fr: 30,
  ip: 0,
  op: 60,
  w: 200,
  h: 200,
  assets: [],
  layers: [
    // Burst particles
    ...Array.from({ length: 16 }, (_, i) => {
      const angle = (i / 16) * Math.PI * 2;
      const colors = [
        [1, 0.42, 0.21, 1],    // Orange
        [0.61, 0.35, 0.71, 1], // Purple
        [0.18, 0.5, 0.89, 1],  // Blue
        [0.15, 0.68, 0.38, 1], // Green
        [0.95, 0.61, 0.07, 1]  // Yellow
      ];
      const color = colors[i % colors.length];
      
      return {
        ddd: 0,
        ind: i + 1,
        ty: 4,
        nm: `confetti-${i}`,
        sr: 1,
        ks: {
          o: {
            a: 1,
            k: [
              { t: 0, s: [0] },
              { t: 5, s: [100] },
              { t: 50, s: [0] }
            ]
          },
          r: {
            a: 1,
            k: [
              { t: 0, s: [0] },
              { t: 60, s: [360 * (i % 2 === 0 ? 1 : -1)] }
            ]
          },
          p: {
            a: 1,
            k: [
              { t: 0, s: [100, 100] },
              { 
                t: 40, 
                s: [
                  100 + Math.cos(angle) * 80,
                  100 + Math.sin(angle) * 80 + 30 // Gravity effect
                ] 
              }
            ]
          },
          s: {
            a: 1,
            k: [
              { t: 0, s: [100, 100, 100] },
              { t: 40, s: [60, 60, 100] }
            ]
          }
        },
        shapes: [{
          ty: "gr",
          it: [{
            ty: "rc",
            p: { a: 0, k: [0, 0] },
            s: { a: 0, k: [12, 8] },
            r: { a: 0, k: 1 }
          }, {
            ty: "fl",
            c: { a: 0, k: color },
            o: { a: 0, k: 100 }
          }]
        }]
      };
    })
  ]
};

/**
 * Simple thermometer animation - temperature bar rises
 */
export const thermometerAnimation = {
  v: "5.9.0",
  fr: 30,
  ip: 0,
  op: 60,
  w: 200,
  h: 200,
  assets: [],
  layers: [
    // Thermometer body
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "body",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        p: { a: 0, k: [100, 100, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "rc",
              p: { a: 0, k: [0, -30] },
              s: { a: 0, k: [40, 120] },
              r: { a: 0, k: 20 },
            },
            {
              ty: "el",
              p: { a: 0, k: [0, 50] },
              s: { a: 0, k: [60, 60] },
            },
            {
              ty: "st",
              c: { a: 0, k: [0.84, 0.84, 0.84, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 6 },
            },
          ],
        },
      ],
    },
    // Rising mercury
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "mercury",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        p: { a: 0, k: [100, 100, 0] },
        s: { a: 1, k: [{ t: 0, s: [100, 0, 100] }, { t: 45, s: [100, 90, 100] }] },
      },
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "rc",
              p: { a: 0, k: [0, -10] },
              s: { a: 0, k: [28, 100] },
              r: { a: 0, k: 12 },
            },
            {
              ty: "el",
              p: { a: 0, k: [0, 60] },
              s: { a: 0, k: [48, 48] },
            },
            {
              ty: "fl",
              c: { a: 0, k: [1, 0.36, 0.21, 1] },
              o: { a: 0, k: 100 },
            },
          ],
        },
      ],
    },
  ],
};

/**
 * Snowflake twinkle animation
 */
export const snowflakeAnimation = {
  v: "5.9.0",
  fr: 30,
  ip: 0,
  op: 60,
  w: 200,
  h: 200,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "flake",
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            { t: 0, s: [0] },
            { t: 10, s: [100] },
            { t: 50, s: [0] },
          ],
        },
        p: { a: 0, k: [100, 100, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [80, 80, 100] },
            { t: 30, s: [120, 120, 100] },
            { t: 60, s: [90, 90, 100] },
          ],
        },
        r: { a: 1, k: [{ t: 0, s: [0] }, { t: 60, s: [120] }] },
      },
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "sr",
              sy: 2,
              pt: { a: 0, k: 6 },
              p: { a: 0, k: [0, 0] },
              r: { a: 0, k: 0 },
              or: { a: 0, k: 60 },
            },
            {
              ty: "st",
              c: { a: 0, k: [0.66, 0.86, 1, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 4 },
            },
          ],
        },
      ],
    },
  ],
};

/**
 * Water drop bounce animation
 */
export const waterDropAnimation = {
  v: "5.9.0",
  fr: 30,
  ip: 0,
  op: 60,
  w: 200,
  h: 200,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "drop",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        p: {
          a: 1,
          k: [
            { t: 0, s: [100, 60, 0] },
            { t: 30, s: [100, 120, 0] },
            { t: 60, s: [100, 60, 0] },
          ],
        },
        s: {
          a: 1,
          k: [
            { t: 0, s: [60, 60, 100] },
            { t: 30, s: [80, 80, 100] },
            { t: 60, s: [60, 60, 100] },
          ],
        },
      },
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "el",
              p: { a: 0, k: [0, 0] },
              s: { a: 0, k: [50, 70] },
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.32, 0.66, 1, 1] },
              o: { a: 0, k: 100 },
            },
          ],
        },
      ],
    },
  ],
};

/**
 * Arrow pointer - For directing attention
 */
export const arrowAnimation = {
  v: "5.9.0",
  fr: 30,
  ip: 0,
  op: 45,
  w: 200,
  h: 200,
  assets: [],
  layers: [{
    ddd: 0,
    ind: 1,
    ty: 4,
    nm: "arrow",
    sr: 1,
    ks: {
      o: {
        a: 1,
        k: [
          { t: 0, s: [0] },
          { t: 10, s: [100] }
        ]
      },
      p: {
        a: 1,
        k: [
          { t: 0, s: [60, 100] },
          { t: 20, s: [140, 100] },
          { t: 35, s: [120, 100] },
          { t: 45, s: [140, 100] }
        ]
      },
      s: { a: 0, k: [100, 100, 100] }
    },
    shapes: [{
      ty: "gr",
      it: [
        // Arrow shaft
        {
          ty: "sh",
          ks: {
            a: 0,
            k: {
              c: false,
              v: [[-30, 0], [20, 0]],
              i: [[0, 0], [0, 0]],
              o: [[0, 0], [0, 0]]
            }
          }
        },
        // Arrow head
        {
          ty: "sh",
          ks: {
            a: 0,
            k: {
              c: false,
              v: [[15, -10], [30, 0], [15, 10]],
              i: [[0, 0], [0, 0], [0, 0]],
              o: [[0, 0], [0, 0], [0, 0]]
            }
          }
        },
        {
          ty: "st",
          c: { a: 0, k: [1, 0.42, 0.21, 1] },
          o: { a: 0, k: 100 },
          w: { a: 0, k: 8 },
          lc: 2,
          lj: 2
        }
      ]
    }]
  }]
};

/**
 * Loading/progress spinner
 */
export const loadingAnimation = {
  v: "5.9.0",
  fr: 30,
  ip: 0,
  op: 60,
  w: 200,
  h: 200,
  assets: [],
  layers: [{
    ddd: 0,
    ind: 1,
    ty: 4,
    nm: "spinner",
    sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      r: {
        a: 1,
        k: [
          { t: 0, s: [0] },
          { t: 60, s: [360] }
        ]
      },
      p: { a: 0, k: [100, 100, 0] }
    },
    shapes: Array.from({ length: 8 }, (_, i) => ({
      ty: "gr",
      it: [{
        ty: "rc",
        p: { a: 0, k: [0, -35] },
        s: { a: 0, k: [8, 25] },
        r: { a: 0, k: 4 }
      }, {
        ty: "fl",
        c: { a: 0, k: [0.18, 0.5, 0.89, 1] },
        o: {
          a: 0,
          k: 100 - (i * 10) // Fading trail effect
        }
      }, {
        ty: "tr",
        r: { a: 0, k: (i / 8) * 360 }
      }]
    }))
  }]
};

/**
 * Get Lottie animation by name
 */
export const getLottieByName = (name) => {
  const library = {
    checkmark: checkmarkAnimation,
    sparkle: sparkleAnimation,
    lightbulb: lightbulbAnimation,
    thinking: thinkingAnimation,
    celebration: celebrationAnimation,
    arrow: arrowAnimation,
    loading: loadingAnimation,
  };
  
  return library[name] || null;
};

/**
 * Lottie animation configurations for common use cases
 */
export const LOTTIE_PRESETS = {
  // Quick celebration (quiz correct answer)
  quizSuccess: {
    animation: 'celebration',
    loop: false,
    autoplay: true,
    speed: 1.2,
  },
  
  // Emphasis sparkle (highlight important point)
  emphasis: {
    animation: 'sparkle',
    loop: false,
    autoplay: true,
    speed: 1.0,
  },
  
  // Aha moment (insights, reveals)
  insight: {
    animation: 'lightbulb',
    loop: false,
    autoplay: true,
    speed: 1.0,
  },
  
  // Question prompt
  question: {
    animation: 'thinking',
    loop: true,
    autoplay: true,
    speed: 0.8,
  },
  
  // Success confirmation
  confirm: {
    animation: 'checkmark',
    loop: false,
    autoplay: true,
    speed: 1.0,
  },
  
  // Directional pointer
  pointer: {
    animation: 'arrow',
    loop: true,
    autoplay: true,
    speed: 1.0,
  },
};
