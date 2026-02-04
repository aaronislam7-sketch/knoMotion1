/**
 * ErrorList Block
 * 
 * Displays a list of errors/bugs for identification and fixing.
 * Used in Repair the Model pattern.
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BlockComponentProps } from '../../core/BlockRegistry';
import type { ErrorListConfig, ErrorItem } from '../../types/unified-schema';
import { useSlideEvents } from '../../core/SlideEventContext';
import { createEvent } from '../../types/events';

// =============================================================================
// ERROR ITEM COMPONENT
// =============================================================================

interface ErrorItemComponentProps {
  error: ErrorItem;
  isSelected: boolean;
  isFixed: boolean;
  showSeverity?: boolean;
  showCategory?: boolean;
  onClick: () => void;
}

const severityColors = {
  critical: 'bg-red-100 border-red-400 text-red-700',
  error: 'bg-red-50 border-red-300 text-red-600',
  warning: 'bg-amber-50 border-amber-300 text-amber-700',
  info: 'bg-blue-50 border-blue-300 text-blue-600',
};

const categoryIcons: Record<ErrorItem['category'], string> = {
  syntax: '🔤',
  logic: '🧠',
  semantic: '📖',
  performance: '⚡',
  security: '🔒',
  'best-practice': '✨',
};

const ErrorItemComponent: React.FC<ErrorItemComponentProps> = ({ 
  error, 
  isSelected, 
  isFixed, 
  showSeverity = true,
  showCategory = true,
  onClick 
}) => {
  return (
    <motion.button
      onClick={onClick}
      className={`
        w-full text-left p-3 rounded-lg border-2 transition-all duration-200
        ${isFixed 
          ? 'bg-emerald-50 border-emerald-300 opacity-60' 
          : isSelected 
            ? 'ring-2 ring-indigo-400 ' + severityColors[error.severity]
            : severityColors[error.severity]
        }
      `}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      disabled={isFixed}
    >
      <div className="flex items-start gap-2">
        {showCategory && (
          <span className="text-lg">{categoryIcons[error.category]}</span>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium">
              Line {error.lineStart}
              {error.lineEnd && error.lineEnd !== error.lineStart ? `-${error.lineEnd}` : ''}
            </span>
            <div className="flex items-center gap-2">
              {showSeverity && (
                <span className={`
                  text-xs px-2 py-0.5 rounded-full
                  ${error.severity === 'critical' ? 'bg-red-200 text-red-800' : ''}
                  ${error.severity === 'error' ? 'bg-red-100 text-red-700' : ''}
                  ${error.severity === 'warning' ? 'bg-amber-100 text-amber-700' : ''}
                  ${error.severity === 'info' ? 'bg-blue-100 text-blue-700' : ''}
                `}>
                  {error.severity}
                </span>
              )}
              {isFixed && (
                <span className="text-xs bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full">
                  Fixed
                </span>
              )}
            </div>
          </div>
          <p className="text-sm mt-1 opacity-80">{error.description}</p>
        </div>
      </div>
    </motion.button>
  );
};

// =============================================================================
// MAIN ERROR LIST BLOCK
// =============================================================================

export const ErrorList: React.FC<BlockComponentProps<ErrorListConfig>> = ({
  id,
  config,
  stylePreset,
  className = '',
}) => {
  const { items, showSeverity = true, showCategory = true, selectable = true } = config;
  const eventBus = useSlideEvents();
  
  const [selectedErrorId, setSelectedErrorId] = useState<string | null>(null);
  const [fixedErrors, setFixedErrors] = useState<Set<string>>(new Set());

  const selectedError = selectedErrorId ? items.find(e => e.id === selectedErrorId) : null;

  const handleErrorClick = useCallback((errorId: string) => {
    if (!selectable) return;
    if (fixedErrors.has(errorId)) return;

    const error = items.find(e => e.id === errorId);
    if (!error) return;

    setSelectedErrorId(errorId);

    eventBus.emit(createEvent('error_select', id, {
      errorId,
      lineStart: error.lineStart,
      lineEnd: error.lineEnd,
    }));
  }, [id, items, selectable, fixedErrors, eventBus]);

  const handleFixError = useCallback((errorId: string) => {
    const error = items.find(e => e.id === errorId);
    if (!error) return;

    setFixedErrors(prev => new Set([...prev, errorId]));
    setSelectedErrorId(null);

    eventBus.emit(createEvent('error_fix', id, {
      errorId,
      fixApplied: error.correctFix,
    }));

    // Check if all errors are fixed
    const newFixedCount = fixedErrors.size + 1;
    if (newFixedCount === items.length) {
      eventBus.emit(createEvent('validation_result', id, {
        isCorrect: true,
        message: 'All errors fixed!',
      }));
    }
  }, [id, items, fixedErrors, eventBus]);

  return (
    <div
      id={id}
      className={`
        bg-white rounded-xl border border-slate-200 overflow-hidden
        ${className}
      `}
    >
      {/* Header */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
        <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Issues to Find
          <span className="ml-auto text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
            {fixedErrors.size}/{items.length}
          </span>
        </h4>
      </div>

      {/* Error list */}
      <div className="p-4 space-y-3">
        <AnimatePresence>
          {items.map(error => (
            <ErrorItemComponent
              key={error.id}
              error={error}
              isSelected={selectedErrorId === error.id}
              isFixed={fixedErrors.has(error.id)}
              showSeverity={showSeverity}
              showCategory={showCategory}
              onClick={() => handleErrorClick(error.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Selected error details */}
      <AnimatePresence mode="wait">
        {selectedError && !fixedErrors.has(selectedError.id) && (
          <motion.div
            key={selectedError.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-slate-200"
          >
            <div className="px-4 py-3 bg-indigo-50 border-b border-indigo-100">
              <h4 className="text-sm font-semibold text-indigo-800">
                Understanding the Issue
              </h4>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-sm text-slate-600">{selectedError.explanation}</p>
              </div>

              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">The Fix:</p>
                <code className="block p-3 bg-emerald-50 rounded-lg text-sm text-emerald-800 font-mono">
                  {selectedError.correctFix}
                </code>
              </div>

              <button
                onClick={() => handleFixError(selectedError.id)}
                className="w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Apply Fix
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* All fixed message */}
      {fixedErrors.size === items.length && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-4 py-3 bg-emerald-50 border-t border-emerald-100"
        >
          <div className="flex items-center gap-2 text-sm text-emerald-700">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>All issues resolved!</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ErrorList;
