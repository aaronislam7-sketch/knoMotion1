/**
 * OutputPreview Block
 * 
 * Shows current output vs expected output comparison.
 * Used in OutputSlot for result preview.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BlockComponentProps } from '../../core/BlockRegistry';
import type { OutputPreviewConfig } from '../../types/unified-schema';

export const OutputPreview: React.FC<BlockComponentProps<OutputPreviewConfig>> = ({
  id,
  config,
  stylePreset,
  className = '',
}) => {
  const { 
    type, 
    current, 
    expected, 
    showExpected = false, 
    title = 'Output' 
  } = config;

  const formatOutput = (value: string | Record<string, unknown>[] | undefined) => {
    if (value === undefined || value === null) return '';
    
    if (typeof value === 'string') return value;
    
    if (Array.isArray(value)) {
      return JSON.stringify(value, null, 2);
    }
    
    return String(value);
  };

  const currentFormatted = formatOutput(current);
  const expectedFormatted = formatOutput(expected);
  const hasExpected = expected !== undefined && showExpected;

  // Check if outputs match
  const isMatch = currentFormatted === expectedFormatted;

  const getTypeStyles = () => {
    switch (type) {
      case 'error':
        return 'text-red-600 bg-red-50';
      case 'json':
        return 'font-mono text-sm';
      case 'diff':
        return '';
      default:
        return 'text-slate-700';
    }
  };

  return (
    <div
      id={id}
      className={`
        kno-panel overflow-hidden bg-white min-w-0
        ${className}
      `}
    >
      {/* Header */}
      <div className="kno-panel-header flex items-center justify-between">
        <h4 className="text-[13px] font-semibold uppercase tracking-wide text-slate-700 flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {title}
        </h4>
        
        {hasExpected && (
          <span className={`
            px-2 py-1 rounded text-xs font-medium
            ${isMatch ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}
          `}>
            {isMatch ? 'Match!' : 'Not matching'}
          </span>
        )}
      </div>

      {/* Content */}
      {hasExpected ? (
        // Side-by-side comparison
        <div className="flex border-b border-slate-200">
          {/* Tab headers */}
          <div className={`flex-1 px-4 py-2 text-xs font-semibold bg-slate-100 border-r border-slate-200`}>
            <span className="text-slate-800">
              {type === 'error' ? '❌ Current' : '📤 Current'}
            </span>
          </div>
          <div className={`flex-1 px-4 py-2 text-xs font-semibold bg-emerald-50`}>
            <span className="text-emerald-800">✓ Expected</span>
          </div>
        </div>
      ) : null}

      <div className={hasExpected ? 'flex' : ''}>
        {/* Current output */}
        <div className={`${hasExpected ? 'flex-1 border-r border-slate-200' : ''}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFormatted}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`p-4 ${getTypeStyles()}`}
            >
              {currentFormatted ? (
                <pre className="whitespace-pre-wrap overflow-auto max-h-[320px] text-[13px] leading-6">
                  {currentFormatted}
                </pre>
              ) : (
                <div className="text-center py-4">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-slate-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-500">Waiting for input...</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Expected output */}
        {hasExpected && (
          <div className="flex-1 bg-emerald-50/50">
            <div className="p-4">
              <pre className={`whitespace-pre-wrap overflow-auto max-h-[320px] text-emerald-800 text-[13px] leading-6 ${type === 'json' ? 'font-mono' : ''}`}>
                {expectedFormatted}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Match indicator */}
      {hasExpected && isMatch && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-3 bg-emerald-50 border-t border-emerald-100"
        >
          <div className="flex items-center gap-2 text-sm text-emerald-700">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Output matches expected result!</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default OutputPreview;
