/**
 * StepNavigation Component
 * 
 * Navigation controls for step-based slides.
 * Enforces that progression requires action - no passive "Next" allowed.
 */

import React from 'react';
import { motion } from 'framer-motion';

export interface StepNavigationProps {
  currentStepIndex: number;
  totalSteps: number;
  canProceed: boolean;
  requiresAction: boolean;
  isComplete: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onReset?: () => void;
  className?: string;
}

export const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStepIndex,
  totalSteps,
  canProceed,
  requiresAction,
  isComplete,
  onNext,
  onPrevious,
  onReset,
  className = '',
}) => {
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === totalSteps - 1;

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {/* Previous button */}
      <button
        onClick={onPrevious}
        disabled={isFirstStep}
        className={`
          flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
          transition-all duration-200
          ${isFirstStep 
            ? 'text-gray-300 cursor-not-allowed' 
            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
          }
        `}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Previous
      </button>

      {/* Center - action required indicator */}
      {requiresAction && !canProceed && !isComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-lg"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-amber-400"
          />
          <span className="text-sm text-amber-700 font-medium">
            Complete the interaction to continue
          </span>
        </motion.div>
      )}

      {/* Completion state */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-lg"
        >
          <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm text-emerald-700 font-medium">
            Slide complete!
          </span>
          {onReset && (
            <button
              onClick={onReset}
              className="ml-2 text-emerald-600 hover:text-emerald-800 underline text-sm"
            >
              Try again
            </button>
          )}
        </motion.div>
      )}

      {/* Next button */}
      <motion.button
        onClick={onNext}
        disabled={!canProceed || isComplete}
        whileHover={canProceed && !isComplete ? { scale: 1.02 } : {}}
        whileTap={canProceed && !isComplete ? { scale: 0.98 } : {}}
        className={`
          flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium
          transition-all duration-200
          ${canProceed && !isComplete
            ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }
        `}
      >
        {isLastStep ? (
          <>
            Complete
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </>
        ) : (
          <>
            Continue
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </>
        )}
      </motion.button>
    </div>
  );
};

export default StepNavigation;
