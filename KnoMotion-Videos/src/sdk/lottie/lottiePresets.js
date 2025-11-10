/**
 * Lottie Animation Presets for Templates
 * 
 * Template-specific Lottie configuration presets.
 * All configurable via JSON - templates can override any property.
 * 
 * Uses:
 * - lottieIntegration.tsx (RemotionLottie, AnimatedLottie, LottieIcon, LottieOverlay)
 * - lottieLibrary.js (inline animation data)
 */

// ==================== PRESET CONFIGURATIONS ====================

/**
 * Quiz & Assessment Lottie Presets
 */
export const QUIZ_PRESETS = {
  // Correct answer celebration
  correctAnswer: {
    animation: 'celebration',
    loop: false,
    autoplay: true,
    speed: 1.2,
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
    animation: 'checkmark',
    loop: false,
    autoplay: true,
    speed: 1.0,
    style: {
      width: 60,
      height: 60
    }
  },
  
  // Thinking indicator
  thinking: {
    animation: 'thinking',
    loop: true,
    autoplay: true,
    speed: 0.8,
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
  // Lightbulb for insights
  insight: {
    animation: 'lightbulb',
    loop: false,
    autoplay: true,
    speed: 1.0,
    style: {
      width: 120,
      height: 120
    },
    entranceDelay: 10,
    entranceDuration: 20
  },
  
  // Sparkle for emphasis
  sparkle: {
    animation: 'sparkle',
    loop: false,
    autoplay: true,
    speed: 1.0,
    style: {
      width: 80,
      height: 80,
      position: 'absolute',
      pointerEvents: 'none'
    }
  },
  
  // Central hub glow/pulse
  centralGlow: {
    animation: 'sparkle',
    loop: true,
    autoplay: true,
    speed: 0.5,
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
    animation: 'checkmark',
    loop: false,
    autoplay: true,
    speed: 1.0,
    style: {
      width: 50,
      height: 50
    }
  },
  
  // Arrow for connections
  arrow: {
    animation: 'arrow',
    loop: true,
    autoplay: true,
    speed: 1.0,
    style: {
      width: 60,
      height: 60
    }
  },
  
  // Loading/progress indicator
  loading: {
    animation: 'loading',
    loop: true,
    autoplay: true,
    speed: 1.0,
    style: {
      width: 40,
      height: 40
    }
  }
};

/**
 * Spotlight & Reveal Lottie Presets
 */
export const SPOTLIGHT_PRESETS = {
  // Stage transition sparkle
  stageTransition: {
    animation: 'sparkle',
    loop: false,
    autoplay: true,
    speed: 1.5,
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
    animation: 'celebration',
    loop: false,
    autoplay: true,
    speed: 1.0,
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
    animation: 'sparkle',
    loop: true,
    autoplay: true,
    speed: 0.3,
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
    animation: 'sparkle',
    loop: true,
    autoplay: true,
    speed: 0.5,
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
      animation: 'sparkle',
      loop: false,
      autoplay: true,
      speed: 1.0,
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
    animation: config.animation || 'sparkle',
    loop: config.loop !== undefined ? config.loop : false,
    autoplay: config.autoplay !== undefined ? config.autoplay : true,
    speed: config.speed || 1.0,
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
