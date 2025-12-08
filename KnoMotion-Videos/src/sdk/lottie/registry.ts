/**
 * Lottie Registry - URL-Based Animation Library
 * 
 * Simple mapping of friendly names to Lottie animation URLs.
 * All animations are fetched from LottieFiles or other CDN sources.
 * 
 * Usage in scene JSON:
 * ```json
 * {
 *   "heroType": "lottie",
 *   "heroRef": "stickman-walking"
 * }
 * ```
 * 
 * @module lottie/registry
 */

// ============================================================================
// TYPES
// ============================================================================

export interface LottieEntry {
  /** URL to the Lottie JSON file */
  url: string;
  /** Human-readable description */
  description?: string;
  /** Suggested loop behavior */
  loop?: boolean;
  /** Suggested playback rate */
  playbackRate?: number;
  /** Tags for categorization/search */
  tags?: string[];
  /** Attribution/source info */
  source?: string;
}

export interface LottiePreset {
  lottieRef: string;
  loop: boolean;
  playbackRate: number;
  style?: React.CSSProperties;
  entranceDelay?: number;
  entranceDuration?: number;
}

// ============================================================================
// LOTTIE REGISTRY - URL-BASED
// ============================================================================

/**
 * Central registry of all available Lottie animations.
 * 
 * To add a new animation:
 * 1. Find an animation on lottiefiles.com
 * 2. Copy the JSON URL (click "..." > "Copy Lottie JSON URL")
 * 3. Add an entry below with a descriptive key
 * 
 * Naming conventions:
 * - Use kebab-case: 'stickman-walking', 'confetti-burst'
 * - Be descriptive: 'checkmark-success' not 'check1'
 * - Use categories as prefixes: 'ui/loading', 'character/waving'
 */
export const LOTTIE_REGISTRY: Record<string, LottieEntry> = {
  // =========================================================================
  // UI & FEEDBACK
  // =========================================================================
  'success': {
    url: 'https://assets2.lottiefiles.com/packages/lf20_jbrw3hcz.json',
    description: 'Green checkmark with circle animation',
    loop: false,
    tags: ['ui', 'feedback', 'success', 'checkmark'],
    source: 'LottieFiles',
  },
  'checkmark': {
    url: 'https://assets2.lottiefiles.com/packages/lf20_jbrw3hcz.json',
    description: 'Green checkmark with circle animation',
    loop: false,
    tags: ['ui', 'feedback', 'success'],
    source: 'LottieFiles',
  },
  'loading': {
    url: 'https://assets10.lottiefiles.com/packages/lf20_a2chheio.json',
    description: 'Smooth loading spinner',
    loop: true,
    tags: ['ui', 'loading', 'spinner'],
    source: 'LottieFiles',
  },
  'error': {
    url: 'https://assets4.lottiefiles.com/packages/lf20_qp1q7mct.json',
    description: 'Error/failure X mark animation',
    loop: false,
    tags: ['ui', 'feedback', 'error'],
    source: 'LottieFiles',
  },

  // =========================================================================
  // CELEBRATIONS & EFFECTS
  // =========================================================================
  'confetti': {
    url: 'https://assets1.lottiefiles.com/packages/lf20_rovf9gzu.json',
    description: 'Colorful confetti celebration',
    loop: false,
    tags: ['celebration', 'confetti', 'party'],
    source: 'LottieFiles',
  },
  'celebration': {
    url: 'https://assets1.lottiefiles.com/packages/lf20_rovf9gzu.json',
    description: 'Colorful confetti celebration',
    loop: false,
    tags: ['celebration', 'party'],
    source: 'LottieFiles',
  },
  'fireworks': {
    url: 'https://assets2.lottiefiles.com/packages/lf20_xlkxtmul.json',
    description: 'Fireworks explosion',
    loop: true,
    tags: ['celebration', 'fireworks', 'party'],
    source: 'LottieFiles',
  },
  'sparkles': {
    url: 'https://assets9.lottiefiles.com/packages/lf20_UJNc2t.json',
    description: 'Twinkling sparkle effect',
    loop: true,
    tags: ['effects', 'sparkle', 'magic'],
    source: 'LottieFiles',
  },
  'stars': {
    url: 'https://assets9.lottiefiles.com/packages/lf20_UJNc2t.json',
    description: 'Twinkling stars effect',
    loop: true,
    tags: ['effects', 'stars'],
    source: 'LottieFiles',
  },

  // =========================================================================
  // EDUCATION & LEARNING
  // =========================================================================
  'lightbulb': {
    url: 'https://assets3.lottiefiles.com/packages/lf20_HpFqiS.json',
    description: 'Idea lightbulb turning on',
    loop: false,
    tags: ['education', 'idea', 'lightbulb', 'aha'],
    source: 'LottieFiles',
  },
  'thinking': {
    url: 'https://assets5.lottiefiles.com/packages/lf20_TBKozE.json',
    description: 'Thinking/pondering animation',
    loop: true,
    tags: ['education', 'thinking', 'question'],
    source: 'LottieFiles',
  },
  'question': {
    url: 'https://assets5.lottiefiles.com/packages/lf20_sy6jjyct.json',
    description: 'Question mark animation',
    loop: true,
    tags: ['education', 'question', 'quiz'],
    source: 'LottieFiles',
  },
  'brain': {
    url: 'https://assets5.lottiefiles.com/packages/lf20_1cazwtnc.json',
    description: 'Brain thinking animation',
    loop: true,
    tags: ['education', 'brain', 'thinking'],
    source: 'LottieFiles',
  },
  'book': {
    url: 'https://assets6.lottiefiles.com/packages/lf20_4XmSkB.json',
    description: 'Open book with pages turning',
    loop: true,
    tags: ['education', 'book', 'reading'],
    source: 'LottieFiles',
  },

  // =========================================================================
  // CHARACTERS & PEOPLE
  // =========================================================================
  'waving': {
    url: 'https://assets2.lottiefiles.com/packages/lf20_puciaact.json',
    description: 'Person waving hello',
    loop: true,
    tags: ['character', 'waving', 'hello', 'greeting'],
    source: 'LottieFiles',
  },
  'walking': {
    url: 'https://assets3.lottiefiles.com/packages/lf20_M9p23l.json',
    description: 'Character walking animation',
    loop: true,
    tags: ['character', 'walking', 'movement'],
    source: 'LottieFiles',
  },
  'thumbs-up': {
    url: 'https://assets4.lottiefiles.com/packages/lf20_j3yeurta.json',
    description: 'Thumbs up gesture',
    loop: false,
    tags: ['gesture', 'thumbs-up', 'approval'],
    source: 'LottieFiles',
  },
  'clapping': {
    url: 'https://assets3.lottiefiles.com/packages/lf20_wBgsZN.json',
    description: 'Hands clapping animation',
    loop: true,
    tags: ['gesture', 'clapping', 'applause'],
    source: 'LottieFiles',
  },

  // =========================================================================
  // ARROWS & POINTERS
  // =========================================================================
  'arrow-right': {
    url: 'https://assets9.lottiefiles.com/packages/lf20_qdba2wlm.json',
    description: 'Animated arrow pointing right',
    loop: true,
    tags: ['ui', 'arrow', 'direction', 'pointer'],
    source: 'LottieFiles',
  },
  'arrow-down': {
    url: 'https://assets7.lottiefiles.com/packages/lf20_rxdmjqxl.json',
    description: 'Animated arrow pointing down',
    loop: true,
    tags: ['ui', 'arrow', 'direction', 'scroll'],
    source: 'LottieFiles',
  },
  'swipe': {
    url: 'https://assets9.lottiefiles.com/packages/lf20_vi1sge8p.json',
    description: 'Swipe gesture indicator',
    loop: true,
    tags: ['ui', 'gesture', 'swipe', 'tutorial'],
    source: 'LottieFiles',
  },

  // =========================================================================
  // TIKTOK / VIRAL CONTENT
  // =========================================================================
  'brain-active': {
    url: 'https://lottie.host/87d3f5af-3fef-46e2-993b-601088d2a909/GG4mRTZpRV.json',
    description: 'Active brain with neurons firing and pulsing regions',
    loop: true,
    tags: ['brain', 'thinking', 'neurons', 'cognitive', 'viral'],
    source: 'LottieFiles',
  },
  'funnel-filter': {
    url: 'https://lottie.host/21e7db3c-1488-43df-82c0-c652cd156822/083T2A6Sco.json',
    description: 'Data filtering through funnel - many in, few out',
    loop: true,
    tags: ['filter', 'funnel', 'data', 'processing', 'viral'],
    source: 'LottieFiles',
  },
  'lightning-bolt': {
    url: 'https://lottie.host/66838e13-ce11-4c24-b43d-813c729fc53f/R3SeA2WpkC.json',
    description: 'Electric bolt with crackling energy',
    loop: true,
    tags: ['energy', 'lightning', 'power', 'electric', 'adhd', 'viral'],
    source: 'LottieFiles',
  },
  'target-focus': {
    url: 'https://lottie.host/ff86a794-6f48-4ddf-ac5c-59cac4d95a38/VOmlzFVK2T.json',
    description: 'Zooming in and locking onto a target',
    loop: false,
    tags: ['focus', 'target', 'zoom', 'lock', 'hyperfocus', 'viral'],
    source: 'LottieFiles',
  },
  'clock-delay': {
    url: 'https://lottie.host/3bb5beb3-f569-4fcd-a539-5c5988a4870c/EwUDyr2Ig8.json',
    description: 'Clock with warped/distorted time effect',
    loop: true,
    tags: ['time', 'clock', 'delay', 'perception', 'warp', 'viral'],
    source: 'LottieFiles',
  },
  'signal-buffer': {
    url: 'https://lottie.host/50ccd194-c5c7-491d-a43e-b54efa2d94f6/cHwmkgxTbZ.json',
    description: 'Streaming signal with buffering/lag indicator',
    loop: true,
    tags: ['buffer', 'loading', 'signal', 'stream', 'lag', 'viral'],
    source: 'LottieFiles',
  },

  // =========================================================================
  // SCIENCE & NATURE
  // =========================================================================
  'atom': {
    url: 'https://assets7.lottiefiles.com/packages/lf20_kyu7xb1v.json',
    description: 'Spinning atom with electrons',
    loop: true,
    tags: ['science', 'atom', 'physics'],
    source: 'LottieFiles',
  },
  'dna': {
    url: 'https://assets5.lottiefiles.com/packages/lf20_ikvz7qhc.json',
    description: 'Rotating DNA helix',
    loop: true,
    tags: ['science', 'dna', 'biology'],
    source: 'LottieFiles',
  },
  'planet': {
    url: 'https://assets10.lottiefiles.com/packages/lf20_cbrbre30.json',
    description: 'Rotating planet Earth',
    loop: true,
    tags: ['science', 'earth', 'planet', 'globe'],
    source: 'LottieFiles',
  },
  'rocket': {
    url: 'https://assets3.lottiefiles.com/packages/lf20_l3qxn9jy.json',
    description: 'Rocket launching',
    loop: false,
    tags: ['science', 'rocket', 'space', 'launch'],
    source: 'LottieFiles',
  },

  // =========================================================================
  // MUSIC & AUDIO
  // =========================================================================
  'music-notes': {
    url: 'https://assets10.lottiefiles.com/packages/lf20_ikk4jhps.json',
    description: 'Floating music notes',
    loop: true,
    tags: ['music', 'notes', 'audio'],
    source: 'LottieFiles',
  },
  'equalizer': {
    url: 'https://assets4.lottiefiles.com/packages/lf20_mDnxBp.json',
    description: 'Audio equalizer bars',
    loop: true,
    tags: ['music', 'audio', 'equalizer', 'visualization'],
    source: 'LottieFiles',
  },
  'headphones': {
    url: 'https://assets1.lottiefiles.com/packages/lf20_khrclx93.json',
    description: 'Headphones with music',
    loop: true,
    tags: ['music', 'headphones', 'audio'],
    source: 'LottieFiles',
  },

  // =========================================================================
  // TECH & DEVICES
  // =========================================================================
  'laptop': {
    url: 'https://assets9.lottiefiles.com/packages/lf20_w51pcehl.json',
    description: 'Laptop with typing animation',
    loop: true,
    tags: ['tech', 'laptop', 'computer', 'typing'],
    source: 'LottieFiles',
  },
  'phone': {
    url: 'https://assets6.lottiefiles.com/packages/lf20_yd8fbnml.json',
    description: 'Smartphone notification',
    loop: true,
    tags: ['tech', 'phone', 'mobile', 'notification'],
    source: 'LottieFiles',
  },
  'wifi': {
    url: 'https://assets1.lottiefiles.com/packages/lf20_bz029dxy.json',
    description: 'WiFi signal animation',
    loop: true,
    tags: ['tech', 'wifi', 'signal', 'network'],
    source: 'LottieFiles',
  },

  // =========================================================================
  // WEATHER
  // =========================================================================
  'sunny': {
    url: 'https://assets5.lottiefiles.com/temp/lf20_Kuot2e.json',
    description: 'Bright sun animation',
    loop: true,
    tags: ['weather', 'sun', 'sunny'],
    source: 'LottieFiles',
  },
  'cloudy': {
    url: 'https://assets5.lottiefiles.com/temp/lf20_dgjK9i.json',
    description: 'Cloudy weather animation',
    loop: true,
    tags: ['weather', 'clouds', 'cloudy'],
    source: 'LottieFiles',
  },
  'rainy': {
    url: 'https://assets5.lottiefiles.com/temp/lf20_rpC1Rd.json',
    description: 'Rain with clouds',
    loop: true,
    tags: ['weather', 'rain', 'rainy'],
    source: 'LottieFiles',
  },
  'snowy': {
    url: 'https://assets5.lottiefiles.com/temp/lf20_WtPCZs.json',
    description: 'Snowfall animation',
    loop: true,
    tags: ['weather', 'snow', 'winter'],
    source: 'LottieFiles',
  },
};

// ============================================================================
// RESOLVER
// ============================================================================

/**
 * Resolve a Lottie reference to its URL.
 * 
 * @param ref - Either a registry key ('success') or a direct URL
 * @returns The Lottie entry or a synthesized entry for direct URLs
 */
export const resolveLottieRef = (ref: string): LottieEntry | null => {
  // Check if it's a direct URL
  if (ref.startsWith('http://') || ref.startsWith('https://')) {
    return {
      url: ref,
      description: 'Direct URL',
    };
  }

  // Look up in registry
  const entry = LOTTIE_REGISTRY[ref];
  if (!entry) {
    console.warn(`[LottieRegistry] Unknown lottieRef "${ref}". Available keys: ${Object.keys(LOTTIE_REGISTRY).join(', ')}`);
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
 * Search for Lottie animations by tag
 */
export const searchLottieByTag = (tag: string): string[] => {
  return Object.entries(LOTTIE_REGISTRY)
    .filter(([_, entry]) => entry.tags?.includes(tag.toLowerCase()))
    .map(([key]) => key);
};

/**
 * Check if a Lottie key exists
 */
export const hasLottie = (key: string): boolean => {
  return key in LOTTIE_REGISTRY || key.startsWith('http://') || key.startsWith('https://');
};

// ============================================================================
// PRESETS (for common use cases)
// ============================================================================

export const LOTTIE_PRESETS: Record<string, LottiePreset> = {
  // Quiz & Assessment
  correctAnswer: {
    lottieRef: 'confetti',
    loop: false,
    playbackRate: 1.2,
    style: { width: 300, height: 300 },
  },
  checkmark: {
    lottieRef: 'success',
    loop: false,
    playbackRate: 1.0,
    style: { width: 60, height: 60 },
  },

  // Concept & Learning
  insight: {
    lottieRef: 'lightbulb',
    loop: false,
    playbackRate: 1.0,
    style: { width: 120, height: 120 },
    entranceDelay: 10,
    entranceDuration: 20,
  },
  thinking: {
    lottieRef: 'thinking',
    loop: true,
    playbackRate: 0.8,
    style: { width: 100, height: 100 },
  },

  // Progress
  loading: {
    lottieRef: 'loading',
    loop: true,
    playbackRate: 1.0,
    style: { width: 60, height: 60 },
  },

  // Ambient
  backgroundSparkles: {
    lottieRef: 'sparkles',
    loop: true,
    playbackRate: 0.5,
    style: { width: '40%', height: '40%', opacity: 0.3 },
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
      lottieRef: 'sparkles',
      loop: true,
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

// ============================================================================
// DEPRECATED - Keep for backward compatibility
// ============================================================================

/** @deprecated Use resolveLottieRef instead */
export const resolveLottieSource = (key: string) => {
  const entry = resolveLottieRef(key);
  if (!entry) return null;
  return { kind: 'url' as const, url: entry.url };
};
