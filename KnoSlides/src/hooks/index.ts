/**
 * KnoSlides Custom Hooks
 */

export { useResponsive } from './useResponsive';
export type { ResponsiveState } from './useResponsive';

export { useScrollReveal } from './useScrollReveal';
export type { ScrollRevealOptions, ScrollRevealState } from './useScrollReveal';

export { useTemplateState } from './useTemplateState';
export type { 
  TemplateStateActions, 
  UseTemplateStateReturn 
} from './useTemplateState';

// Legacy slide state hook (for existing templates)
// The new unified architecture uses core/SlideStateContext instead
export { useSlideState as useLegacySlideState } from './useSlideState';
