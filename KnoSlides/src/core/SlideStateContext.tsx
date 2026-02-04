/**
 * SlideStateContext
 * 
 * React Context that manages the overall slide state:
 * - Current step and phase
 * - Task completion tracking
 * - Hint usage tracking
 * - Step progression gating
 */

import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import type {
  KnoSlide,
  Step,
  Task,
  TaskStatus,
  Phase,
  Hint,
} from '../types/unified-schema';
import type { Feedback } from '../types/templates';
import { useSlideEvents, useEventSubscription } from './SlideEventContext';
import { actionToEventMap, createEvent, type AnySlideEvent } from '../types/events';

// =============================================================================
// STATE TYPES
// =============================================================================

export interface TaskState {
  status: TaskStatus;
  completedAt?: number;
  attempts: number;
}

export interface StepState {
  tasks: Record<string, TaskState>;
  hintsRevealed: number;
  startedAt: number;
  completedAt?: number;
}

export interface SlideState {
  /** Current step index */
  currentStepIndex: number;
  /** Step states keyed by step ID */
  stepStates: Record<string, StepState>;
  /** Current feedback to display */
  feedback: Feedback | null;
  /** Whether the entire slide is complete */
  isComplete: boolean;
  /** Slide start time */
  startedAt: number;
  /** Slide completion time */
  completedAt?: number;
}

// =============================================================================
// ACTIONS
// =============================================================================

type SlideAction =
  | { type: 'NEXT_STEP' }
  | { type: 'PREVIOUS_STEP' }
  | { type: 'GO_TO_STEP'; stepIndex: number }
  | { type: 'COMPLETE_TASK'; stepId: string; taskId: string }
  | { type: 'FAIL_TASK'; stepId: string; taskId: string }
  | { type: 'REVEAL_HINT'; stepId: string }
  | { type: 'SET_FEEDBACK'; feedback: Feedback | null }
  | { type: 'CLEAR_FEEDBACK' }
  | { type: 'COMPLETE_STEP'; stepId: string }
  | { type: 'COMPLETE_SLIDE' }
  | { type: 'RESET' };

// =============================================================================
// REDUCER
// =============================================================================

function createInitialStepState(): StepState {
  return {
    tasks: {},
    hintsRevealed: 0,
    startedAt: Date.now(),
  };
}

function createInitialState(slide: KnoSlide): SlideState {
  const stepStates: Record<string, StepState> = {};
  
  slide.steps.forEach(step => {
    const stepState = createInitialStepState();
    step.tasks.forEach(task => {
      stepState.tasks[task.id] = {
        status: 'pending',
        attempts: 0,
      };
    });
    stepStates[step.id] = stepState;
  });
  
  return {
    currentStepIndex: 0,
    stepStates,
    feedback: null,
    isComplete: false,
    startedAt: Date.now(),
  };
}

function slideReducer(state: SlideState, action: SlideAction, slide: KnoSlide): SlideState {
  switch (action.type) {
    case 'NEXT_STEP': {
      const nextIndex = Math.min(state.currentStepIndex + 1, slide.steps.length - 1);
      if (nextIndex === state.currentStepIndex) return state;
      
      return {
        ...state,
        currentStepIndex: nextIndex,
        feedback: null,
      };
    }
    
    case 'PREVIOUS_STEP': {
      const prevIndex = Math.max(state.currentStepIndex - 1, 0);
      if (prevIndex === state.currentStepIndex) return state;
      
      return {
        ...state,
        currentStepIndex: prevIndex,
        feedback: null,
      };
    }
    
    case 'GO_TO_STEP': {
      if (action.stepIndex < 0 || action.stepIndex >= slide.steps.length) return state;
      
      return {
        ...state,
        currentStepIndex: action.stepIndex,
        feedback: null,
      };
    }
    
    case 'COMPLETE_TASK': {
      const { stepId, taskId } = action;
      const stepState = state.stepStates[stepId];
      if (!stepState) return state;
      
      return {
        ...state,
        stepStates: {
          ...state.stepStates,
          [stepId]: {
            ...stepState,
            tasks: {
              ...stepState.tasks,
              [taskId]: {
                ...stepState.tasks[taskId],
                status: 'completed',
                completedAt: Date.now(),
              },
            },
          },
        },
      };
    }
    
    case 'FAIL_TASK': {
      const { stepId, taskId } = action;
      const stepState = state.stepStates[stepId];
      if (!stepState) return state;
      
      const currentTask = stepState.tasks[taskId];
      
      return {
        ...state,
        stepStates: {
          ...state.stepStates,
          [stepId]: {
            ...stepState,
            tasks: {
              ...stepState.tasks,
              [taskId]: {
                ...currentTask,
                attempts: (currentTask?.attempts || 0) + 1,
              },
            },
          },
        },
      };
    }
    
    case 'REVEAL_HINT': {
      const { stepId } = action;
      const stepState = state.stepStates[stepId];
      if (!stepState) return state;
      
      const step = slide.steps.find(s => s.id === stepId);
      const maxHints = step?.hints.length || 0;
      
      return {
        ...state,
        stepStates: {
          ...state.stepStates,
          [stepId]: {
            ...stepState,
            hintsRevealed: Math.min(stepState.hintsRevealed + 1, maxHints),
          },
        },
      };
    }
    
    case 'SET_FEEDBACK': {
      return {
        ...state,
        feedback: action.feedback,
      };
    }
    
    case 'CLEAR_FEEDBACK': {
      return {
        ...state,
        feedback: null,
      };
    }
    
    case 'COMPLETE_STEP': {
      const { stepId } = action;
      const stepState = state.stepStates[stepId];
      if (!stepState) return state;
      
      return {
        ...state,
        stepStates: {
          ...state.stepStates,
          [stepId]: {
            ...stepState,
            completedAt: Date.now(),
          },
        },
      };
    }
    
    case 'COMPLETE_SLIDE': {
      return {
        ...state,
        isComplete: true,
        completedAt: Date.now(),
      };
    }
    
    case 'RESET': {
      return createInitialState(slide);
    }
    
    default:
      return state;
  }
}

// =============================================================================
// CONTEXT
// =============================================================================

interface SlideStateContextValue {
  state: SlideState;
  slide: KnoSlide;
  
  // Current step helpers
  currentStep: Step;
  currentPhase: Phase;
  currentStepState: StepState;
  
  // Task helpers
  getTaskStatus: (taskId: string) => TaskStatus;
  isTaskComplete: (taskId: string) => boolean;
  areRequiredTasksComplete: () => boolean;
  canProceed: () => boolean;
  
  // Hint helpers
  getVisibleHints: () => Hint[];
  canRevealMoreHints: () => boolean;
  
  // Actions
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (index: number) => void;
  completeTask: (taskId: string) => void;
  failTask: (taskId: string) => void;
  revealHint: () => void;
  setFeedback: (feedback: Feedback | null) => void;
  clearFeedback: () => void;
  reset: () => void;
}

const SlideStateContext = createContext<SlideStateContextValue | null>(null);

// =============================================================================
// PROVIDER
// =============================================================================

interface SlideStateProviderProps {
  slide: KnoSlide;
  children: React.ReactNode;
  onStepChange?: (stepIndex: number) => void;
  onComplete?: () => void;
}

export const SlideStateProvider: React.FC<SlideStateProviderProps> = ({
  slide,
  children,
  onStepChange,
  onComplete,
}) => {
  const eventBus = useSlideEvents();
  
  const [state, dispatch] = useReducer(
    (state: SlideState, action: SlideAction) => slideReducer(state, action, slide),
    slide,
    createInitialState
  );

  // Current step helpers
  const currentStep = slide.steps[state.currentStepIndex];
  const currentPhase = currentStep.phase;
  const currentStepState = state.stepStates[currentStep.id] || createInitialStepState();

  // Task helpers
  const getTaskStatus = useCallback((taskId: string): TaskStatus => {
    return currentStepState.tasks[taskId]?.status || 'pending';
  }, [currentStepState]);

  const isTaskComplete = useCallback((taskId: string): boolean => {
    return getTaskStatus(taskId) === 'completed';
  }, [getTaskStatus]);

  const areRequiredTasksComplete = useCallback((): boolean => {
    return currentStep.tasks
      .filter(task => task.required)
      .every(task => isTaskComplete(task.id));
  }, [currentStep, isTaskComplete]);

  const canProceed = useCallback((): boolean => {
    // Can always go back, but forward requires task completion
    return areRequiredTasksComplete();
  }, [areRequiredTasksComplete]);

  // Hint helpers
  const getVisibleHints = useCallback((): Hint[] => {
    return currentStep.hints.slice(0, currentStepState.hintsRevealed);
  }, [currentStep, currentStepState]);

  const canRevealMoreHints = useCallback((): boolean => {
    return currentStepState.hintsRevealed < currentStep.hints.length;
  }, [currentStep, currentStepState]);

  // Actions
  const nextStep = useCallback(() => {
    if (!canProceed()) return;
    
    dispatch({ type: 'COMPLETE_STEP', stepId: currentStep.id });
    
    if (state.currentStepIndex === slide.steps.length - 1) {
      dispatch({ type: 'COMPLETE_SLIDE' });
      onComplete?.();
    } else {
      dispatch({ type: 'NEXT_STEP' });
      onStepChange?.(state.currentStepIndex + 1);
    }
  }, [canProceed, currentStep.id, state.currentStepIndex, slide.steps.length, onStepChange, onComplete]);

  const previousStep = useCallback(() => {
    dispatch({ type: 'PREVIOUS_STEP' });
    if (state.currentStepIndex > 0) {
      onStepChange?.(state.currentStepIndex - 1);
    }
  }, [state.currentStepIndex, onStepChange]);

  const goToStep = useCallback((index: number) => {
    dispatch({ type: 'GO_TO_STEP', stepIndex: index });
    onStepChange?.(index);
  }, [onStepChange]);

  const completeTask = useCallback((taskId: string) => {
    dispatch({ type: 'COMPLETE_TASK', stepId: currentStep.id, taskId });
    
    // Emit task state change event
    eventBus.emit(createEvent('task_state_change', 'slide-state', {
      taskId,
      previousStatus: getTaskStatus(taskId),
      newStatus: 'completed' as TaskStatus,
      completedAt: Date.now(),
    }));
    
    // Find task and show success message
    const task = currentStep.tasks.find(t => t.id === taskId);
    if (task?.successMessage) {
      dispatch({
        type: 'SET_FEEDBACK',
        feedback: {
          type: 'success',
          title: 'Task Complete',
          message: task.successMessage,
        },
      });
    }
  }, [currentStep, eventBus, getTaskStatus]);

  const failTask = useCallback((taskId: string) => {
    dispatch({ type: 'FAIL_TASK', stepId: currentStep.id, taskId });
  }, [currentStep.id]);

  const revealHint = useCallback(() => {
    if (!canRevealMoreHints()) return;
    
    dispatch({ type: 'REVEAL_HINT', stepId: currentStep.id });
    
    eventBus.emit(createEvent('hint_request', 'slide-state', {
      stepId: currentStep.id,
      currentLevel: currentStepState.hintsRevealed,
      requestedLevel: currentStepState.hintsRevealed + 1,
    }));
  }, [canRevealMoreHints, currentStep.id, currentStepState.hintsRevealed, eventBus]);

  const setFeedback = useCallback((feedback: Feedback | null) => {
    dispatch({ type: 'SET_FEEDBACK', feedback });
  }, []);

  const clearFeedback = useCallback(() => {
    dispatch({ type: 'CLEAR_FEEDBACK' });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  // Event-based task completion
  // Listen for events and auto-complete tasks that match
  React.useEffect(() => {
    const unsubscribe = eventBus.onAny((event: AnySlideEvent) => {
      // Check if any pending task in current step should be completed by this event
      currentStep.tasks.forEach(task => {
        if (isTaskComplete(task.id)) return;
        
        const { action } = task;
        const expectedEventTypes = actionToEventMap[action.type];
        
        if (!expectedEventTypes?.includes(event.type)) return;
        
        // Check if event matches task requirements
        let shouldComplete = false;
        
        // Match by target ID
        if (action.targetId && 'targetId' in event.payload) {
          if ((event.payload as { targetId?: string }).targetId === action.targetId) {
            shouldComplete = true;
          }
        }
        
        // Match by event ID
        if (action.eventId && event.type === 'custom') {
          if ((event.payload as { eventId?: string }).eventId === action.eventId) {
            shouldComplete = true;
          }
        }
        
        // Match by value if specified
        if (action.value !== undefined && shouldComplete) {
          if (action.validation) {
            switch (action.validation.type) {
              case 'equals':
                shouldComplete = JSON.stringify(event.payload) === JSON.stringify(action.validation.expected);
                break;
              case 'includes':
                shouldComplete = JSON.stringify(event.payload).includes(String(action.validation.expected));
                break;
              // Add more validation types as needed
            }
          }
        }
        
        // For drop events, check zone matching
        if (event.type === 'drop' && action.type === 'drop') {
          const dropPayload = event.payload as { zoneId: string; isValid: boolean };
          if (action.targetId === dropPayload.zoneId && dropPayload.isValid) {
            shouldComplete = true;
          }
        }
        
        if (shouldComplete) {
          completeTask(task.id);
        }
      });
    });
    
    return unsubscribe;
  }, [currentStep.tasks, isTaskComplete, completeTask, eventBus]);

  const contextValue = useMemo<SlideStateContextValue>(() => ({
    state,
    slide,
    currentStep,
    currentPhase,
    currentStepState,
    getTaskStatus,
    isTaskComplete,
    areRequiredTasksComplete,
    canProceed,
    getVisibleHints,
    canRevealMoreHints,
    nextStep,
    previousStep,
    goToStep,
    completeTask,
    failTask,
    revealHint,
    setFeedback,
    clearFeedback,
    reset,
  }), [
    state,
    slide,
    currentStep,
    currentPhase,
    currentStepState,
    getTaskStatus,
    isTaskComplete,
    areRequiredTasksComplete,
    canProceed,
    getVisibleHints,
    canRevealMoreHints,
    nextStep,
    previousStep,
    goToStep,
    completeTask,
    failTask,
    revealHint,
    setFeedback,
    clearFeedback,
    reset,
  ]);

  return (
    <SlideStateContext.Provider value={contextValue}>
      {children}
    </SlideStateContext.Provider>
  );
};

// =============================================================================
// HOOKS
// =============================================================================

/**
 * Hook to access the slide state context
 */
export function useSlideState(): SlideStateContextValue {
  const context = useContext(SlideStateContext);
  if (!context) {
    throw new Error('useSlideState must be used within a SlideStateProvider');
  }
  return context;
}

/**
 * Hook to access just the current step
 */
export function useCurrentStep() {
  const { currentStep, currentPhase, currentStepState } = useSlideState();
  return { currentStep, currentPhase, currentStepState };
}

/**
 * Hook to access task state
 */
export function useTaskState(taskId: string) {
  const { getTaskStatus, isTaskComplete, completeTask, failTask } = useSlideState();
  return {
    status: getTaskStatus(taskId),
    isComplete: isTaskComplete(taskId),
    complete: () => completeTask(taskId),
    fail: () => failTask(taskId),
  };
}

/**
 * Hook to access hint state
 */
export function useHints() {
  const { getVisibleHints, canRevealMoreHints, revealHint, currentStep } = useSlideState();
  return {
    allHints: currentStep.hints,
    visibleHints: getVisibleHints(),
    canRevealMore: canRevealMoreHints(),
    revealNext: revealHint,
  };
}

export default SlideStateContext;
