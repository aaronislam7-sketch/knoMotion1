/**
 * ContextCard Block
 * 
 * Displays context/overview information with optional key points.
 * Used in OverviewSlot for "What am I seeing?" panels.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BlockComponentProps } from '../../core/BlockRegistry';
import type { ContextCardConfig } from '../../types/unified-schema';

export const ContextCard: React.FC<BlockComponentProps<ContextCardConfig>> = ({
  id,
  config,
  stylePreset,
  className = '',
}) => {
  const { title, body, keyPoints, icon, collapsible = false, defaultCollapsed = false } = config;
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const toggleCollapse = () => {
    if (collapsible) {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <div
      id={id}
      className={`
        kno-panel overflow-hidden
        ${stylePreset === 'highlighted' ? 'ring-2 ring-indigo-200' : ''}
        ${className}
      `}
    >
      {/* Header */}
      <div
        className={`
          kno-panel-header
          flex items-center justify-between gap-3
          ${collapsible ? 'cursor-pointer hover:bg-slate-100' : ''}
        `}
        onClick={toggleCollapse}
      >
        <div className="flex items-center gap-3">
          {icon && (
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <span className="text-lg">{icon}</span>
            </div>
          )}
          {!icon && (
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          )}
          <h3 className="text-[15px] font-semibold text-slate-800">{title}</h3>
        </div>
        
        {collapsible && (
          <motion.div
            animate={{ rotate: isCollapsed ? 0 : 180 }}
            transition={{ duration: 0.2 }}
          >
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        )}
      </div>

      {/* Content */}
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4">
              <p className="kno-text-body">{body}</p>
              
              {keyPoints && keyPoints.length > 0 && (
                <div className="mt-4">
                  <p className="kno-text-meta uppercase tracking-wide mb-2">Key Points</p>
                  <ul className="space-y-2">
                    {keyPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-slate-700 leading-6">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContextCard;
