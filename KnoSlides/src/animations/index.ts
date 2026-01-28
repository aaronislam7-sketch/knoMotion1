/**
 * KnoSlides Animation System
 * 
 * Centralized exports for all animation utilities.
 */

// Variants
export {
  // Entrances
  fadeInUp,
  fadeInScale,
  fadeIn,
  slideIn,
  
  // Containers
  staggerContainer,
  staggerContainerFast,
  staggerContainerDramatic,
  
  // Interactive
  cardInteractive,
  buttonInteractive,
  hoverLift,
  
  // Accordion
  accordionContent,
  expandIcon,
  
  // Effects
  pulseAttention,
  gentleFloat,
  glowPulse,
  drawPath,
  drawLine,
  
  // States
  selectedState,
  celebrationBurst,
} from './variants';

// Springs and transitions
export {
  SPRING_CONFIGS,
  getSpring,
  TRANSITIONS,
  EASING,
  STAGGER,
} from './springs';

export type { SpringConfigName } from './springs';
