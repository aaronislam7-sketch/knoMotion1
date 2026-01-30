/**
 * HintLadder Component
 * 
 * Progressive hint system that reveals more specific hints as learner requests them.
 * Ensures learners always have support available without giving away answers immediately.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hint } from '../../types/templates';

export interface HintLadderProps {
  hints: Hint[];
  /** Currently revealed hint level (0 = none shown) */
  currentLevel: number;
  /** Callback when learner requests next hint */
  onRequestHint: () => void;
  /** Optional callback to highlight an element */
  onHighlight?: (elementId: string | undefined) => void;
  className?: string;
}

export const HintLadder: React.FC<HintLadderProps> = ({
  hints,
  currentLevel,
  onRequestHint,
  onHighlight,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLevel = hints.length;
  const hasMoreHints = currentLevel < maxLevel;
  const revealedHints = hints.filter(h => h.level <= currentLevel);

  return (
    <div className={`relative ${className}`}>
      {/* Hint toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
          transition-all duration-200
          ${currentLevel > 0 
            ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' 
            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          }
        `}
      >
        <svg 
          className="w-4 h-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" 
          />
        </svg>
        <span>
          {currentLevel === 0 ? 'Need a hint?' : `Hint ${currentLevel}/${maxLevel}`}
        </span>
        <motion.svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      {/* Hint panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 z-20"
          >
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Revealed hints */}
              <div className="p-4 space-y-3">
                {revealedHints.length === 0 ? (
                  <p className="text-gray-500 text-sm italic">
                    Click below to reveal your first hint
                  </p>
                ) : (
                  revealedHints.map((hint, idx) => (
                    <motion.div
                      key={hint.level}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex gap-3"
                      onMouseEnter={() => hint.highlightId && onHighlight?.(hint.highlightId)}
                      onMouseLeave={() => onHighlight?.(undefined)}
                    >
                      <div className={`
                        flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                        ${hint.level === currentLevel 
                          ? 'bg-amber-100 text-amber-700' 
                          : 'bg-gray-100 text-gray-500'
                        }
                      `}>
                        {hint.level}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm ${hint.level === currentLevel ? 'text-gray-800' : 'text-gray-600'}`}>
                          {hint.content}
                        </p>
                        {hint.highlightId && (
                          <span className="text-xs text-amber-600 mt-1 block">
                            ↗ Hover to highlight related element
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Request more hints */}
              {hasMoreHints && (
                <div className="border-t border-gray-100 p-3 bg-gray-50">
                  <button
                    onClick={onRequestHint}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 
                      bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg 
                      text-sm font-medium transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Reveal hint {currentLevel + 1}
                    <span className="text-amber-600 text-xs">
                      ({maxLevel - currentLevel} remaining)
                    </span>
                  </button>
                </div>
              )}

              {/* All hints used */}
              {!hasMoreHints && currentLevel > 0 && (
                <div className="border-t border-gray-100 p-3 bg-emerald-50">
                  <p className="text-sm text-emerald-700 text-center">
                    ✓ All hints revealed - you've got this!
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HintLadder;
