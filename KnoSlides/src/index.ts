/**
 * KnoSlides - Interactive Learning Templates
 * 
 * Main entry point for the KnoSlides library.
 * 
 * Architecture:
 * - Core: Unified template rendering with named slots and content blocks
 * - Legacy Templates: BuildAndVerify, FlowSimulator, RepairTheModel (to be migrated)
 */

// =============================================================================
// CORE - Unified Template Architecture (New)
// =============================================================================
export * from './core';

// =============================================================================
// LEGACY TEMPLATES (Will be migrated to unified schema)
// =============================================================================
export { BuildAndVerifySlide } from './templates/BuildAndVerify';
export { FlowSimulatorSlide } from './templates/FlowSimulator';
export { RepairTheModelSlide } from './templates/RepairTheModel';

// =============================================================================
// SHARED COMPONENTS
// =============================================================================
export * from './components';

// =============================================================================
// HOOKS
// =============================================================================
export { 
  useResponsive, 
  useScrollReveal, 
  useTemplateState,
  useLegacySlideState,
  type ResponsiveState,
  type ScrollRevealOptions,
  type ScrollRevealState,
  type TemplateStateActions,
  type UseTemplateStateReturn,
} from './hooks';

// =============================================================================
// ANIMATIONS
// =============================================================================
export * from './animations';

// =============================================================================
// THEME
// =============================================================================
export * from './theme';

// =============================================================================
// TYPES
// =============================================================================
export * from './types';
