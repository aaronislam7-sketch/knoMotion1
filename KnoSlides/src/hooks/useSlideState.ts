/**
 * useSlideState Hook
 * 
 * Manages state for all slide templates:
 * - Step progression
 * - Hint tracking
 * - Feedback display
 * - Validation
 */

import { useState, useCallback, useMemo } from 'react';
import { 
  TemplateState, 
  ProgressionPhase, 
  Feedback, 
  ValidationResult,
  Hint 
} from '../types/templates';

interface Step {
  id: string;
  phase: ProgressionPhase;
  requiresAction: boolean;
  hints: Hint[];
}

interface UseSlideStateOptions {
  steps: Step[];
  onComplete?: () => void;
  onStepChange?: (stepIndex: number) => void;
}

export function useSlideState({ steps, onComplete, onStepChange }: UseSlideStateOptions) {
  const [state, setState] = useState<TemplateState>({
    currentStepIndex: 0,
    currentPhase: steps[0]?.phase || 'explain',
    completedSteps: [],
    hintsUsed: {},
    attempts: {},
    feedback: null,
    isComplete: false,
  });

  const currentStep = useMemo(() => steps[state.currentStepIndex], [steps, state.currentStepIndex]);

  // Get hint level for current step
  const currentHintLevel = useMemo(() => {
    const stepHints = state.hintsUsed[currentStep?.id || ''] || [];
    return stepHints.length;
  }, [state.hintsUsed, currentStep?.id]);

  // Check if current step can proceed
  const canProceed = useMemo(() => {
    if (!currentStep) return false;
    if (!currentStep.requiresAction) return true;
    return state.completedSteps.includes(currentStep.id);
  }, [currentStep, state.completedSteps]);

  // Request next hint
  const requestHint = useCallback(() => {
    if (!currentStep) return;
    
    const currentHints = state.hintsUsed[currentStep.id] || [];
    const nextHintLevel = currentHints.length + 1;
    
    if (nextHintLevel <= currentStep.hints.length) {
      setState(prev => ({
        ...prev,
        hintsUsed: {
          ...prev.hintsUsed,
          [currentStep.id]: [...currentHints, nextHintLevel],
        },
      }));
    }
  }, [currentStep, state.hintsUsed]);

  // Mark step as complete
  const completeStep = useCallback((stepId: string, feedback?: Feedback) => {
    setState(prev => {
      const newCompletedSteps = prev.completedSteps.includes(stepId)
        ? prev.completedSteps
        : [...prev.completedSteps, stepId];
      
      return {
        ...prev,
        completedSteps: newCompletedSteps,
        feedback: feedback || null,
      };
    });
  }, []);

  // Submit action for validation
  const submitAction = useCallback((stepId: string, result: ValidationResult) => {
    setState(prev => {
      const currentAttempts = prev.attempts[stepId] || 0;
      const newState = {
        ...prev,
        attempts: {
          ...prev.attempts,
          [stepId]: currentAttempts + 1,
        },
        feedback: result.feedback,
      };

      // If correct or partially correct, mark as complete
      if (result.isCorrect) {
        newState.completedSteps = prev.completedSteps.includes(stepId)
          ? prev.completedSteps
          : [...prev.completedSteps, stepId];
      }

      return newState;
    });
  }, []);

  // Go to next step
  const nextStep = useCallback(() => {
    if (state.currentStepIndex >= steps.length - 1) {
      setState(prev => ({ ...prev, isComplete: true }));
      onComplete?.();
      return;
    }

    const nextIndex = state.currentStepIndex + 1;
    setState(prev => ({
      ...prev,
      currentStepIndex: nextIndex,
      currentPhase: steps[nextIndex].phase,
      feedback: null,
    }));
    onStepChange?.(nextIndex);
  }, [state.currentStepIndex, steps, onComplete, onStepChange]);

  // Go to previous step
  const previousStep = useCallback(() => {
    if (state.currentStepIndex <= 0) return;

    const prevIndex = state.currentStepIndex - 1;
    setState(prev => ({
      ...prev,
      currentStepIndex: prevIndex,
      currentPhase: steps[prevIndex].phase,
      feedback: null,
    }));
    onStepChange?.(prevIndex);
  }, [state.currentStepIndex, steps, onStepChange]);

  // Go to specific step (for non-linear navigation if allowed)
  const goToStep = useCallback((stepIndex: number) => {
    if (stepIndex < 0 || stepIndex >= steps.length) return;
    
    setState(prev => ({
      ...prev,
      currentStepIndex: stepIndex,
      currentPhase: steps[stepIndex].phase,
      feedback: null,
    }));
    onStepChange?.(stepIndex);
  }, [steps, onStepChange]);

  // Clear feedback
  const clearFeedback = useCallback(() => {
    setState(prev => ({ ...prev, feedback: null }));
  }, []);

  // Reset slide
  const reset = useCallback(() => {
    setState({
      currentStepIndex: 0,
      currentPhase: steps[0]?.phase || 'explain',
      completedSteps: [],
      hintsUsed: {},
      attempts: {},
      feedback: null,
      isComplete: false,
    });
    onStepChange?.(0);
  }, [steps, onStepChange]);

  return {
    // State
    state,
    currentStep,
    currentHintLevel,
    canProceed,
    
    // Actions
    requestHint,
    completeStep,
    submitAction,
    nextStep,
    previousStep,
    goToStep,
    clearFeedback,
    reset,
  };
}

export default useSlideState;
