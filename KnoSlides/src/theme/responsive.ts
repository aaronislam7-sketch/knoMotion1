/**
 * Responsive utilities for KnoSlides templates
 */

import { BREAKPOINTS, Breakpoint, ViewportType } from './index';

/**
 * Media query helpers for CSS-in-JS
 */
export const mediaQuery = {
  sm: `@media (min-width: ${BREAKPOINTS.sm}px)`,
  md: `@media (min-width: ${BREAKPOINTS.md}px)`,
  lg: `@media (min-width: ${BREAKPOINTS.lg}px)`,
  xl: `@media (min-width: ${BREAKPOINTS.xl}px)`,
  '2xl': `@media (min-width: ${BREAKPOINTS['2xl']}px)`,
} as const;

/**
 * Responsive value type - can specify different values per breakpoint
 */
export type ResponsiveValue<T> = T | {
  base?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
};

/**
 * Resolve a responsive value based on current viewport width
 */
export function resolveResponsiveValue<T>(
  value: ResponsiveValue<T>,
  width: number
): T | undefined {
  // If it's not an object, return as-is
  if (typeof value !== 'object' || value === null) {
    return value as T;
  }

  const responsiveValue = value as Record<string, T>;

  // Find the appropriate value based on width
  if (width >= BREAKPOINTS['2xl'] && responsiveValue['2xl'] !== undefined) {
    return responsiveValue['2xl'];
  }
  if (width >= BREAKPOINTS.xl && responsiveValue.xl !== undefined) {
    return responsiveValue.xl;
  }
  if (width >= BREAKPOINTS.lg && responsiveValue.lg !== undefined) {
    return responsiveValue.lg;
  }
  if (width >= BREAKPOINTS.md && responsiveValue.md !== undefined) {
    return responsiveValue.md;
  }
  if (width >= BREAKPOINTS.sm && responsiveValue.sm !== undefined) {
    return responsiveValue.sm;
  }

  return responsiveValue.base;
}

/**
 * Common responsive spacing values
 */
export const RESPONSIVE_SPACING = {
  containerPadding: {
    base: 16,
    sm: 24,
    md: 32,
    lg: 48,
    xl: 64,
  },
  sectionGap: {
    base: 24,
    sm: 32,
    md: 40,
    lg: 56,
    xl: 72,
  },
  cardGap: {
    base: 16,
    sm: 20,
    md: 24,
    lg: 32,
  },
} as const;

/**
 * Common responsive font sizes
 */
export const RESPONSIVE_FONT_SIZES = {
  display: {
    base: '2rem',
    sm: '2.5rem',
    md: '3rem',
    lg: '3.5rem',
    xl: '4rem',
  },
  title: {
    base: '1.5rem',
    sm: '1.75rem',
    md: '2rem',
    lg: '2.25rem',
  },
  body: {
    base: '1rem',
    md: '1.125rem',
    lg: '1.25rem',
  },
  small: {
    base: '0.875rem',
    md: '1rem',
  },
} as const;

/**
 * Layout configurations per viewport type
 */
export const LAYOUT_CONFIG: Record<ViewportType, {
  columns: number;
  gap: number;
  padding: number;
  maxWidth: number | 'none';
}> = {
  mobile: {
    columns: 1,
    gap: 16,
    padding: 16,
    maxWidth: 'none',
  },
  tablet: {
    columns: 2,
    gap: 24,
    padding: 32,
    maxWidth: 'none',
  },
  desktop: {
    columns: 3,
    gap: 32,
    padding: 48,
    maxWidth: 1280,
  },
};
