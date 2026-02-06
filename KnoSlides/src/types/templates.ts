/**
 * Shared Template Types
 * 
 * Common types used across the KnoSlides framework.
 */

/** Feedback shown after learner actions */
export interface Feedback {
  type: 'success' | 'partial' | 'incorrect' | 'info';
  title: string;
  message: string;
  /** Additional explanation for incorrect attempts */
  explanation?: string;
  /** Suggested next action */
  suggestion?: string;
}
