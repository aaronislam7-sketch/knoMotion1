/**
 * Mid-Scenes Library
 * 
 * Composed components that glue elements, animations, and effects together.
 * Pre-built for LLM JSON generation - all configurable via JSON.
 * 
 * @module mid-scenes
 * @category SDK
 */

// Original Mid-Scenes
export { HeroTextEntranceExit } from './HeroTextEntranceExit';
export { CardSequence } from './CardSequence';
export { TextRevealSequence } from './TextRevealSequence';
export { IconGrid } from './IconGrid';

// New Mid-Scenes (Phase 2)
export { ChecklistReveal } from './ChecklistReveal';
export { BubbleCalloutSequence } from './BubbleCalloutSequence';
export { SideBySideCompare } from './SideBySideCompare';
export { GridCardReveal } from './GridCardReveal';
export { AnimatedCounter } from './AnimatedCounter';

/**
 * Mid-Scene Registry for dynamic rendering
 * Maps type strings to component references
 */
export const MID_SCENE_REGISTRY = {
  // Original
  heroTextEntranceExit: 'HeroTextEntranceExit',
  cardSequence: 'CardSequence',
  textReveal: 'TextRevealSequence',
  textRevealSequence: 'TextRevealSequence',
  iconGrid: 'IconGrid',
  
  // New Mid-Scenes
  checklistReveal: 'ChecklistReveal',
  checklist: 'ChecklistReveal',
  bubbleCalloutSequence: 'BubbleCalloutSequence',
  bubbleCallout: 'BubbleCalloutSequence',
  callouts: 'BubbleCalloutSequence',
  sideBySideCompare: 'SideBySideCompare',
  sideBySide: 'SideBySideCompare',
  compare: 'SideBySideCompare',
  gridCardReveal: 'GridCardReveal',
  gridCards: 'GridCardReveal',
  cardGrid: 'GridCardReveal',
  animatedCounter: 'AnimatedCounter',
};
