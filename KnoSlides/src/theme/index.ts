/**
 * KnoSlides Theme System
 * 
 * Re-exports KNODE_THEME from KnoMotion-Videos for brand consistency.
 * Also provides KnoSlides-specific extensions.
 */

// Re-export the core theme from KnoMotion (sibling directory)
export { KNODE_THEME } from '../../../KnoMotion-Videos/src/sdk/theme/knodeTheme';
export type { KnodeTheme } from '../../../KnoMotion-Videos/src/sdk/theme/knodeTheme';

// Re-export Lottie registry
export { 
  LOTTIE_REGISTRY, 
  resolveLottieRef,
  getAvailableLottieKeys,
  searchLottieByTag,
  hasLottie,
  LOTTIE_PRESETS,
  getLottiePreset,
} from '../../../KnoMotion-Videos/src/sdk/lottie/registry';

export type { 
  LottieEntry,
  LottiePreset,
} from '../../../KnoMotion-Videos/src/sdk/lottie/registry';

/**
 * Responsive breakpoints for KnoSlides
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/**
 * Get current breakpoint based on width
 */
export const getBreakpoint = (width: number): Breakpoint => {
  if (width >= BREAKPOINTS['2xl']) return '2xl';
  if (width >= BREAKPOINTS.xl) return 'xl';
  if (width >= BREAKPOINTS.lg) return 'lg';
  if (width >= BREAKPOINTS.md) return 'md';
  return 'sm';
};

/**
 * Check if width is at least a certain breakpoint
 */
export const isAtLeast = (width: number, breakpoint: Breakpoint): boolean => {
  return width >= BREAKPOINTS[breakpoint];
};

/**
 * Viewport type based on breakpoint
 */
export type ViewportType = 'mobile' | 'tablet' | 'desktop';

export const getViewportType = (width: number): ViewportType => {
  if (width >= BREAKPOINTS.lg) return 'desktop';
  if (width >= BREAKPOINTS.md) return 'tablet';
  return 'mobile';
};

/**
 * Theme color resolver - converts theme keys to actual color values
 */
export const resolveColor = (colorKey: string, theme?: any): string => {
  const KNODE_THEME = theme || {
    colors: {
      primary: '#FF6B35',
      secondary: '#9B59B6',
      accentGreen: '#27AE60',
      accentBlue: '#3498DB',
      textMain: '#2C3E50',
      textSoft: '#5D6D7E',
      textMuted: '#95A5A6',
      pageBg: '#FFF9F0',
      cardBg: '#FFFFFF',
      doodle: '#F39C12',
      ruleLine: '#F0D9B5',
    }
  };

  // If it's already a hex/rgb value, return as-is
  if (colorKey.startsWith('#') || colorKey.startsWith('rgb')) {
    return colorKey;
  }

  // Look up in theme colors
  return KNODE_THEME.colors[colorKey] || KNODE_THEME.colors.textMain;
};
