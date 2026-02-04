/**
 * FeedbackIndicator Component
 * 
 * Shows feedback after learner actions. Never punishes - always teaches.
 * Provides explanation for incorrect attempts and encouragement for correct ones.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Feedback } from '../../types/templates';

export interface FeedbackIndicatorProps {
  feedback: Feedback | null;
  onDismiss?: () => void;
  className?: string;
}

const feedbackStyles: Record<Feedback['type'], {
  bg: string;
  border: string;
  icon: string;
  iconBg: string;
  title: string;
}> = {
  success: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    icon: 'M5 13l4 4L19 7',
    iconBg: 'bg-emerald-100 text-emerald-600',
    title: 'text-emerald-800',
  },
  partial: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    iconBg: 'bg-amber-100 text-amber-600',
    title: 'text-amber-800',
  },
  incorrect: {
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    iconBg: 'bg-rose-100 text-rose-600',
    title: 'text-rose-800',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    iconBg: 'bg-blue-100 text-blue-600',
    title: 'text-blue-800',
  },
};

export const FeedbackIndicator: React.FC<FeedbackIndicatorProps> = ({
  feedback,
  onDismiss,
  className = '',
}) => {
  return (
    <AnimatePresence mode="wait">
      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className={`rounded-xl border ${feedbackStyles[feedback.type].bg} ${feedbackStyles[feedback.type].border} overflow-hidden ${className}`}
        >
          <div className="p-4">
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${feedbackStyles[feedback.type].iconBg} flex items-center justify-center`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feedbackStyles[feedback.type].icon} />
                </svg>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className={`font-semibold ${feedbackStyles[feedback.type].title}`}>
                  {feedback.title}
                </h4>
                <p className="mt-1 text-sm text-gray-600">
                  {feedback.message}
                </p>

                {/* Explanation for incorrect attempts */}
                {feedback.explanation && (
                  <div className="mt-3 p-3 bg-white/60 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Why?</span> {feedback.explanation}
                    </p>
                  </div>
                )}

                {/* Suggestion for next action */}
                {feedback.suggestion && (
                  <p className="mt-2 text-sm text-gray-500 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    {feedback.suggestion}
                  </p>
                )}
              </div>

              {/* Dismiss button */}
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Progress bar animation for auto-dismiss */}
          {feedback.type === 'success' && (
            <motion.div
              className="h-1 bg-emerald-300"
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 3, ease: 'linear' }}
              onAnimationComplete={onDismiss}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeedbackIndicator;
