/**
 * StepProgress Component
 * 
 * Visual indicator for step-based progression in slides.
 * Shows current step, completed steps, and remaining steps.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { ProgressionPhase } from '../../types/templates';

interface Step {
  id: string;
  title: string;
  phase: ProgressionPhase;
}

export interface StepProgressProps {
  steps: Step[];
  currentStepIndex: number;
  completedSteps: string[];
  className?: string;
}

const phaseLabels: Record<ProgressionPhase, string> = {
  explain: 'Understand',
  guided: 'Explore',
  construct: 'Build',
  outcome: 'Reflect',
};

const phaseColors: Record<ProgressionPhase, { bg: string; text: string; ring: string }> = {
  explain: { bg: 'bg-blue-100', text: 'text-blue-700', ring: 'ring-blue-300' },
  guided: { bg: 'bg-purple-100', text: 'text-purple-700', ring: 'ring-purple-300' },
  construct: { bg: 'bg-amber-100', text: 'text-amber-700', ring: 'ring-amber-300' },
  outcome: { bg: 'bg-emerald-100', text: 'text-emerald-700', ring: 'ring-emerald-300' },
};

export const StepProgress: React.FC<StepProgressProps> = ({
  steps,
  currentStepIndex,
  completedSteps,
  className = '',
}) => {
  return (
    <div className={`w-full ${className}`}>
      {/* Phase indicator */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {(['explain', 'guided', 'construct', 'outcome'] as ProgressionPhase[]).map((phase, idx) => {
            const isCurrentPhase = steps[currentStepIndex]?.phase === phase;
            const isPastPhase = steps.findIndex(s => s.phase === phase) < currentStepIndex;
            const colors = phaseColors[phase];
            
            return (
              <React.Fragment key={phase}>
                <motion.div
                  className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                    transition-all duration-300
                    ${isCurrentPhase 
                      ? `${colors.bg} ${colors.text} ring-2 ${colors.ring}` 
                      : isPastPhase 
                        ? 'bg-gray-100 text-gray-500' 
                        : 'bg-gray-50 text-gray-400'
                    }
                  `}
                  animate={isCurrentPhase ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {isPastPhase && (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  {phaseLabels[phase]}
                </motion.div>
                {idx < 3 && (
                  <div className={`w-6 h-0.5 ${isPastPhase ? 'bg-gray-300' : 'bg-gray-200'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
        <span className="text-sm text-gray-500">
          Step {currentStepIndex + 1} of {steps.length}
        </span>
      </div>
      
      {/* Step dots */}
      <div className="flex items-center gap-1">
        {steps.map((step, idx) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = idx === currentStepIndex;
          const colors = phaseColors[step.phase];
          
          return (
            <motion.div
              key={step.id}
              className={`
                relative h-1.5 flex-1 rounded-full overflow-hidden
                ${isCurrent ? colors.bg : isCompleted ? 'bg-gray-300' : 'bg-gray-100'}
              `}
              initial={false}
              animate={isCurrent ? { opacity: [0.7, 1, 0.7] } : { opacity: 1 }}
              transition={isCurrent ? { duration: 2, repeat: Infinity } : {}}
            >
              {isCompleted && (
                <motion.div
                  className="absolute inset-0 bg-gray-400"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default StepProgress;
