/**
 * HintLadder Block
 * 
 * Progressive hint reveal system ("Ask KNO" functionality).
 * Shows hints at increasing levels of specificity.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BlockComponentProps } from '../../core/BlockRegistry';
import type { HintLadderConfig } from '../../types/unified-schema';
import { useHints } from '../../core/SlideStateContext';
import { useSlideEvents } from '../../core/SlideEventContext';

export const HintLadder: React.FC<BlockComponentProps<HintLadderConfig>> = ({
  id,
  config,
  stylePreset,
  className = '',
}) => {
  const { 
    askKnoLabel = 'Ask KNO', 
    showLevelIndicator = true, 
    maxVisibleHints 
  } = config;
  
  const { allHints, visibleHints, canRevealMore, revealNext } = useHints();
  const eventBus = useSlideEvents();

  const handleAskKno = () => {
    if (canRevealMore) {
      revealNext();
    }
  };

  // Limit visible hints if maxVisibleHints is set
  const displayedHints = maxVisibleHints 
    ? visibleHints.slice(-maxVisibleHints) 
    : visibleHints;

  const getLevelLabel = (level: number) => {
    if (level === 1) return 'Gentle nudge';
    if (level === 2) return 'More specific';
    if (level >= 3) return 'Direct guidance';
    return `Hint ${level}`;
  };

  return (
    <div
      id={id}
      className={`
        ${stylePreset === 'compact' ? '' : 'bg-white rounded-xl border border-slate-200 overflow-hidden'}
        ${className}
      `}
    >
      {/* Revealed hints */}
      <AnimatePresence>
        {displayedHints.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={stylePreset === 'compact' ? 'space-y-2' : 'p-4 space-y-3'}
          >
            {displayedHints.map((hint, index) => (
              <motion.div
                key={hint.level}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  p-3 rounded-lg border
                  ${hint.level === 1 ? 'bg-blue-50 border-blue-200' : ''}
                  ${hint.level === 2 ? 'bg-amber-50 border-amber-200' : ''}
                  ${hint.level >= 3 ? 'bg-emerald-50 border-emerald-200' : ''}
                `}
              >
                <div className="flex items-start gap-3">
                  <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0
                    ${hint.level === 1 ? 'bg-blue-100 text-blue-600' : ''}
                    ${hint.level === 2 ? 'bg-amber-100 text-amber-600' : ''}
                    ${hint.level >= 3 ? 'bg-emerald-100 text-emerald-600' : ''}
                  `}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  
                  <div className="flex-1">
                    {showLevelIndicator && (
                      <p className={`
                        text-xs font-medium mb-1
                        ${hint.level === 1 ? 'text-blue-600' : ''}
                        ${hint.level === 2 ? 'text-amber-600' : ''}
                        ${hint.level >= 3 ? 'text-emerald-600' : ''}
                      `}>
                        {getLevelLabel(hint.level)}
                      </p>
                    )}
                    <p className={`
                      text-sm
                      ${hint.level === 1 ? 'text-blue-800' : ''}
                      ${hint.level === 2 ? 'text-amber-800' : ''}
                      ${hint.level >= 3 ? 'text-emerald-800' : ''}
                    `}>
                      {hint.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ask KNO button */}
      {canRevealMore && (
        <div className={stylePreset === 'compact' ? 'mt-2' : 'p-4 border-t border-slate-100'}>
          <button
            onClick={handleAskKno}
            className={`
              flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg
              text-sm font-medium transition-all duration-200
              ${visibleHints.length === 0
                ? 'w-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200'
                : 'text-indigo-600 hover:bg-indigo-50'
              }
            `}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            {askKnoLabel}
            <span className="text-xs opacity-60">
              ({visibleHints.length}/{allHints.length})
            </span>
          </button>
        </div>
      )}

      {/* All hints revealed */}
      {!canRevealMore && allHints.length > 0 && (
        <div className={stylePreset === 'compact' ? 'mt-2' : 'p-4 border-t border-slate-100'}>
          <p className="text-sm text-slate-500 text-center">
            All hints revealed
          </p>
        </div>
      )}
    </div>
  );
};

export default HintLadder;
