/**
 * Lottie Animation Presets for Templates (UPDATED for @remotion/lottie)
 * 
 * Template-specific Lottie configuration presets.
 * All configurable via JSON - templates can override any property.
 * 
 * MIGRATION NOTES:
 * - Now uses lottieRef instead of animation (standardized schema)
 * - Uses playbackRate instead of speed
 * - All animations reference local files from /public/lotties/
 * 
 * Uses:
 * - lottieIntegration.tsx (RemotionLottie, AnimatedLottie, LottieIcon, LottieOverlay)
 */

// ==================== PRESET CONFIGURATIONS ====================

/**
 * Quiz & Assessment Lottie Presets
 */
export const QUIZ_PRESETS = {
  // Correct answer celebration
  correctAnswer: {
    lottieRef: 'core/celebration', // STANDARDIZED
    loop: false,
    playbackRate: 1.2, // Updated from speed
    style: {
      position: 'absolute',
      width: 300,
      height: 300,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
      zIndex: 100
    },
    entranceDelay: 0,
    entranceDuration: 15
  },
  
  // Checkmark for correct answer
  checkmark: {
    lottieRef: 'core/checkmark', // STANDARDIZED
    loop: false,
    playbackRate: 1.0, // Updated from speed
    style: {
      width: 60,
      height: 60
    }
  },
  
  // Loading indicator (replaces thinking)
  loading: {
    lottieRef: 'core/loading', // STANDARDIZED
    loop: true,
    playbackRate: 0.8, // Updated from speed
    style: {
      width: 100,
      height: 100,
      opacity: 0.8
    }
  }
};

/**
 * Concept & Explanation Lottie Presets
 */
export const CONCEPT_PRESETS = {
  // Stars for insights
  insight: {
    lottieRef: 'education/stars-burst', // STANDARDIZED
    loop: false,
    playbackRate: 1.0, // Updated from speed
    style: {
      width: 120,
      height: 120
    },
    entranceDelay: 10,
    entranceDuration: 20
  },
  
  // Burst for emphasis
  sparkle: {
    lottieRef: 'education/stars-burst', // STANDARDIZED
    loop: false,
    playbackRate: 1.0, // Updated from speed
    style: {
      width: 80,
      height: 80,
      position: 'absolute',
      pointerEvents: 'none'
    }
  },
  
  // Central hub glow/pulse
  centralGlow: {
    lottieRef: 'core/particles', // STANDARDIZED
    loop: true,
    playbackRate: 0.5, // Updated from speed
    style: {
      width: 200,
      height: 200,
      opacity: 0.3,
      position: 'absolute',
      pointerEvents: 'none',
      zIndex: 0
    }
  }
};

/**
 * Progress & Guide Lottie Presets
 */
export const PROGRESS_PRESETS = {
  // Step completion checkmark
  stepComplete: {
    lottieRef: 'core/checkmark', // STANDARDIZED
    loop: false,
    playbackRate: 1.0, // Updated from speed
    style: {
      width: 50,
      height: 50
    }
  },
  
  // Loading/progress indicator
  loading: {
    lottieRef: 'core/loading', // STANDARDIZED
    loop: true,
    playbackRate: 1.0, // Updated from speed
    style: {
      width: 40,
      height: 40
    }
  },
  
  // Spinner for long processes
  spinner: {
    lottieRef: 'core/loading', // STANDARDIZED
    loop: true,
    playbackRate: 1.2, // Updated from speed
    style: {
      width: 60,
      height: 60
    }
  }
};

/**
 * Spotlight & Reveal Lottie Presets
 */
export const SPOTLIGHT_PRESETS = {
  // Stage transition sparkle
  stageTransition: {
    lottieRef: 'education/stars-burst', // STANDARDIZED
    loop: false,
    playbackRate: 1.5, // Updated from speed
    style: {
      width: 150,
      height: 150,
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
      zIndex: 50
    }
  },
  
  // Reveal burst
  revealBurst: {
    lottieRef: 'celebration/confetti', // STANDARDIZED
    loop: false,
    playbackRate: 1.0, // Updated from speed
    style: {
      width: 200,
      height: 200,
      opacity: 0.7
    },
    entranceDelay: 0,
    entranceDuration: 10
  }
};

/**
 * Background & Ambient Lottie Presets
 */
export const AMBIENT_PRESETS = {
  // Subtle background particles
  backgroundParticles: {
    lottieRef: 'core/particles', // STANDARDIZED
    loop: true,
    playbackRate: 0.3, // Updated from speed
    style: {
      position: 'absolute',
      width: '40%',
      height: '40%',
      opacity: 0.1,
      pointerEvents: 'none',
      zIndex: 0
    }
  },
  
  // Corner accent
  cornerAccent: {
    lottieRef: 'education/stars-burst', // STANDARDIZED
    loop: true,
    playbackRate: 0.5, // Updated from speed
    style: {
      position: 'absolute',
      width: 150,
      height: 150,
      opacity: 0.15,
      pointerEvents: 'none'
    }
  }
};

// ==================== PRESET REGISTRY ====================

export const ALL_LOTTIE_PRESETS = {
  ...QUIZ_PRESETS,
  ...CONCEPT_PRESETS,
  ...PROGRESS_PRESETS,
  ...SPOTLIGHT_PRESETS,
  ...AMBIENT_PRESETS
};

/**
 * Get Lottie preset by name with optional overrides
 * 
 * @param presetName - Name of preset (e.g., 'correctAnswer', 'insight')
 * @param overrides - Optional overrides for any preset property
 * @returns Preset configuration object
 */
export const getLottiePreset = (presetName, overrides = {}) => {
  const preset = ALL_LOTTIE_PRESETS[presetName];
  
  if (!preset) {
    console.warn(`Lottie preset "${presetName}" not found, using default`);
    return {
      lottieRef: 'education/stars-burst', // STANDARDIZED (updated from animation)
      loop: false,
      playbackRate: 1.0, // Updated from speed
      style: { width: 100, height: 100 },
      ...overrides
    };
  }
  
  // Deep merge style object
  const mergedStyle = {
    ...preset.style,
    ...(overrides.style || {})
  };
  
  return {
    ...preset,
    ...overrides,
    style: mergedStyle
  };
};

/**
 * Get Lottie preset from config object
 * Allows templates to specify preset by name in JSON
 * 
 * @param config - Config object with { preset, ...overrides }
 * @returns Preset configuration
 */
export const getLottieFromConfig = (config) => {
  if (!config) {
    return null;
  }
  
  // If config has a preset name, use it
  if (config.preset) {
    const { preset, ...overrides } = config;
    return getLottiePreset(preset, overrides);
  }
  
  // Otherwise, config is the full configuration
  return {
    lottieRef: config.lottieRef || config.animation || 'burst', // STANDARDIZED (backward compatible)
    loop: config.loop !== undefined ? config.loop : false,
    playbackRate: config.playbackRate || config.speed || 1.0, // Updated (backward compatible)
    style: config.style || { width: 100, height: 100 },
    entranceDelay: config.entranceDelay,
    entranceDuration: config.entranceDuration
  };
};

// ==================== TEMPLATE-SPECIFIC HELPERS ====================

/**
 * Get appropriate Lottie for quiz answer reveal
 * 
 * @param isCorrect - Whether answer is correct
 * @param config - Optional overrides
 * @returns Lottie preset
 */
export const getQuizAnswerLottie = (isCorrect, config = {}) => {
  if (isCorrect) {
    return getLottiePreset('correctAnswer', config);
  }
  return null; // No Lottie for incorrect (use shake animation instead)
};

/**
 * Get step completion Lottie
 * 
 * @param stepIndex - Index of step
 * @param config - Optional overrides
 * @returns Lottie preset
 */
export const getStepCompleteLottie = (stepIndex, config = {}) => {
  return getLottiePreset('stepComplete', {
    entranceDelay: stepIndex * 5, // Stagger based on step
    ...config
  });
};

/**
 * Get concept reveal Lottie based on context
 * 
 * @param contextType - Type of reveal ('insight', 'emphasis', 'transition')
 * @param config - Optional overrides
 * @returns Lottie preset
 */
export const getConceptRevealLottie = (contextType, config = {}) => {
  const typeMap = {
    insight: 'insight',
    emphasis: 'sparkle',
    transition: 'stageTransition',
    center: 'centralGlow'
  };
  
  const presetName = typeMap[contextType] || 'sparkle';
  return getLottiePreset(presetName, config);
};

// ==================== EXPORT ====================

export default {
  QUIZ_PRESETS,
  CONCEPT_PRESETS,
  PROGRESS_PRESETS,
  SPOTLIGHT_PRESETS,
  AMBIENT_PRESETS,
  ALL_LOTTIE_PRESETS,
  getLottiePreset,
  getLottieFromConfig,
  getQuizAnswerLottie,
  getStepCompleteLottie,
  getConceptRevealLottie
};
