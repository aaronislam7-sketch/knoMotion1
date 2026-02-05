/**
 * ReferencePanel Block
 * 
 * Tabbed panel for reference content like source data.
 * Supports multiple tabs with different content types.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BlockComponentProps } from '../../core/BlockRegistry';
import type { ReferencePanelConfig, ContentBlock } from '../../types/unified-schema';
import { BlockRenderer } from '../../core/BlockRegistry';

export const ReferencePanel: React.FC<BlockComponentProps<ReferencePanelConfig>> = ({
  id,
  config,
  stylePreset,
  className = '',
}) => {
  const { title, tabs, content } = config;
  const [activeTab, setActiveTab] = useState(0);

  // If no tabs, render single content
  if (!tabs || tabs.length === 0) {
    return (
      <div
        id={id}
        className={`
          rounded-xl border border-slate-200 bg-white overflow-hidden
          ${className}
        `}
      >
        {title && (
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
            <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {title}
            </h4>
          </div>
        )}
        {content && (
          <div className="p-4">
            <BlockRenderer block={content} />
          </div>
        )}
      </div>
    );
  }

  // Tabbed content
  return (
    <div
      id={id}
      className={`
        rounded-xl border border-slate-200 bg-slate-50 overflow-hidden
        ${className}
      `}
    >
      {/* Header with title */}
      {title && (
        <div className="px-4 py-2 bg-slate-100 border-b border-slate-200">
          <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
            </svg>
            {title}
            <span className="text-xs font-normal text-slate-400 ml-auto">READ ONLY</span>
          </h4>
        </div>
      )}

      {/* Tab headers */}
      <div className="flex border-b border-slate-200 bg-white">
        {tabs.map((tab, idx) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(idx)}
            className={`
              px-4 py-2.5 text-sm font-medium transition-colors relative
              ${idx === activeTab 
                ? 'text-indigo-700 bg-indigo-50' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }
            `}
          >
            {tab.label}
            {idx === activeTab && (
              <motion.div
                layoutId={`tab-indicator-${id}`}
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
          >
            <BlockRenderer block={tabs[activeTab].content} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ReferencePanel;
