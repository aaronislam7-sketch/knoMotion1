/**
 * SlideRenderer
 * 
 * Main orchestrator component for rendering KnoSlides.
 * Takes a unified JSON slide definition and renders it using:
 * - SlotResolver for layout
 * - BlockRegistry for content blocks
 * - SlideStateContext for state management
 * - SlideEventContext for inter-block communication
 */

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { KnoSlide } from '../types/unified-schema';
import { SlideEventProvider } from './SlideEventContext';
import { SlideStateProvider, useSlideState } from './SlideStateContext';
import { BlockRegistryProvider, BlockRegistry, defaultRegistry } from './BlockRegistry';
import { SlotResolver } from './SlotResolver';

// =============================================================================
// HEADER SLOT COMPONENT
// =============================================================================

interface HeaderSlotProps {
  concept: KnoSlide['concept'];
}

const HeaderSlot: React.FC<HeaderSlotProps> = ({ concept }) => {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">{concept.title}</h1>
      <div className="flex items-center gap-4 text-sm text-slate-500">
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          {concept.learningObjective}
        </span>
      </div>
    </div>
  );
};

// =============================================================================
// STEP PROGRESS INDICATOR
// =============================================================================

interface StepProgressProps {
  steps: KnoSlide['steps'];
  currentIndex: number;
  completedSteps: string[];
}

const StepProgress: React.FC<StepProgressProps> = ({ steps, currentIndex, completedSteps }) => {
  return (
    <div className="flex items-center gap-2 mb-6">
      {steps.map((step, index) => {
        const isComplete = completedSteps.includes(step.id) || index < currentIndex;
        const isCurrent = index === currentIndex;
        
        return (
          <React.Fragment key={step.id}>
            <div className="flex items-center gap-2">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  transition-all duration-300
                  ${isComplete 
                    ? 'bg-emerald-500 text-white' 
                    : isCurrent 
                      ? 'bg-indigo-500 text-white ring-4 ring-indigo-200' 
                      : 'bg-slate-200 text-slate-500'
                  }
                `}
              >
                {isComplete ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span 
                className={`
                  text-sm hidden sm:block
                  ${isCurrent ? 'text-slate-800 font-medium' : 'text-slate-500'}
                `}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div 
                className={`
                  flex-1 h-0.5 max-w-[60px]
                  ${isComplete ? 'bg-emerald-500' : 'bg-slate-200'}
                `}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// =============================================================================
// CURRENT STEP INSTRUCTION
// =============================================================================

const StepInstruction: React.FC = () => {
  const { currentStep } = useSlideState();
  
  return (
    <motion.div
      key={currentStep.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-slate-200 p-5 mb-6"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-slate-800 mb-1">{currentStep.title}</h3>
          <p className="text-slate-600">{currentStep.instruction}</p>
        </div>
      </div>
    </motion.div>
  );
};

// =============================================================================
// FOOTER NAVIGATION
// =============================================================================

const FooterNavigation: React.FC = () => {
  const { 
    state, 
    slide, 
    canProceed, 
    nextStep, 
    previousStep, 
    revealHint, 
    canRevealMoreHints,
    currentStep,
  } = useSlideState();
  
  const isFirstStep = state.currentStepIndex === 0;
  const isLastStep = state.currentStepIndex === slide.steps.length - 1;
  const hasRequiredTasks = currentStep.tasks.some(t => t.required);
  
  return (
    <div className="mt-8 pt-6 border-t border-slate-200">
      <div className="flex items-center justify-between">
        {/* Back button */}
        <button
          onClick={previousStep}
          disabled={isFirstStep}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
            transition-colors duration-200
            ${isFirstStep
              ? 'text-slate-300 cursor-not-allowed'
              : 'text-slate-600 hover:bg-slate-100'
            }
          `}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        
        {/* Ask KNO (Hint) button */}
        <button
          onClick={revealHint}
          disabled={!canRevealMoreHints()}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
            transition-colors duration-200
            ${canRevealMoreHints()
              ? 'text-indigo-600 hover:bg-indigo-50 border border-indigo-200'
              : 'text-slate-300 cursor-not-allowed border border-slate-200'
            }
          `}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Ask KNO
        </button>
        
        {/* Continue button */}
        <button
          onClick={nextStep}
          disabled={hasRequiredTasks && !canProceed()}
          className={`
            flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium
            transition-all duration-200
            ${hasRequiredTasks && !canProceed()
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow'
            }
          `}
        >
          {state.isComplete ? 'Complete' : isLastStep ? 'Finish' : 'Continue'}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// =============================================================================
// FEEDBACK DISPLAY
// =============================================================================

const FeedbackDisplay: React.FC = () => {
  const { state, clearFeedback } = useSlideState();
  
  if (!state.feedback) return null;
  
  const feedbackStyles = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    partial: 'bg-amber-50 border-amber-200 text-amber-800',
    incorrect: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };
  
  const feedbackIcons = {
    success: (
      <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    partial: (
      <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    incorrect: (
      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`
          rounded-xl border p-4 mb-6
          ${feedbackStyles[state.feedback.type]}
        `}
      >
        <div className="flex items-start gap-3">
          {feedbackIcons[state.feedback.type]}
          <div className="flex-1">
            <h4 className="font-medium">{state.feedback.title}</h4>
            <p className="text-sm mt-1 opacity-90">{state.feedback.message}</p>
            {state.feedback.explanation && (
              <p className="text-sm mt-2 opacity-75">{state.feedback.explanation}</p>
            )}
            {state.feedback.suggestion && (
              <p className="text-sm mt-2 italic opacity-75">{state.feedback.suggestion}</p>
            )}
          </div>
          <button
            onClick={clearFeedback}
            className="p-1 hover:bg-black/5 rounded"
          >
            <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// =============================================================================
// COMPLETION MESSAGE
// =============================================================================

interface CompletionMessageProps {
  message?: string;
  enablesNext: string;
}

const CompletionMessage: React.FC<CompletionMessageProps> = ({ message, enablesNext }) => {
  const { state } = useSlideState();
  
  if (!state.isComplete || !message) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-emerald-800 mb-1">
            Understanding Built!
          </h3>
          <p className="text-emerald-700">{message}</p>
          <p className="mt-2 text-sm text-emerald-600">
            <strong>What's next:</strong> {enablesNext}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// =============================================================================
// INNER RENDERER (with state access)
// =============================================================================

interface InnerRendererProps {
  slide: KnoSlide;
}

const InnerRenderer: React.FC<InnerRendererProps> = ({ slide }) => {
  const { state, currentStep } = useSlideState();
  
  // Merge step slots with any global slot content
  const currentSlots = currentStep.slots;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <HeaderSlot concept={slide.concept} />
        
        {/* Progress indicator */}
        <StepProgress
          steps={slide.steps}
          currentIndex={state.currentStepIndex}
          completedSteps={Object.entries(state.stepStates)
            .filter(([_, s]) => s.completedAt)
            .map(([id]) => id)}
        />
        
        {/* Step instruction */}
        <StepInstruction />
        
        {/* Feedback */}
        <FeedbackDisplay />
        
        {/* Main content - slot resolver */}
        <SlotResolver
          layout={slide.layout}
          slots={currentSlots}
        />
        
        {/* Footer navigation */}
        <FooterNavigation />
        
        {/* Completion message */}
        <CompletionMessage
          message={slide.completionMessage}
          enablesNext={slide.concept.enablesNext}
        />
      </div>
    </div>
  );
};

// =============================================================================
// MAIN SLIDE RENDERER
// =============================================================================

export interface SlideRendererProps {
  /** The slide JSON definition */
  slide: KnoSlide;
  /** Optional custom block registry */
  registry?: BlockRegistry;
  /** Callback when step changes */
  onStepChange?: (stepIndex: number) => void;
  /** Callback when slide is completed */
  onComplete?: () => void;
  /** Callback for all events (for debugging/logging) */
  onEvent?: (event: unknown) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Main SlideRenderer component
 * 
 * Renders a KnoSlide from JSON definition using:
 * - SlideEventProvider for event bus
 * - SlideStateProvider for state management
 * - BlockRegistryProvider for block rendering
 * - SlotResolver for layout
 */
export const SlideRenderer: React.FC<SlideRendererProps> = ({
  slide,
  registry = defaultRegistry,
  onStepChange,
  onComplete,
  onEvent,
  className = '',
}) => {
  return (
    <div className={className}>
      <SlideEventProvider onEvent={onEvent}>
        <BlockRegistryProvider registry={registry}>
          <SlideStateProvider
            slide={slide}
            onStepChange={onStepChange}
            onComplete={onComplete}
          >
            <InnerRenderer slide={slide} />
          </SlideStateProvider>
        </BlockRegistryProvider>
      </SlideEventProvider>
    </div>
  );
};

export default SlideRenderer;
