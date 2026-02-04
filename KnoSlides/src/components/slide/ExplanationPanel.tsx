/**
 * ExplanationPanel Component
 * 
 * Persistent explanation context that remains visible throughout the slide.
 * Ensures learners always have reference material and never feel lost.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface VisualReference {
  type: 'code' | 'diagram' | 'image';
  content: string;
  language?: string;
}

export interface ExplanationPanelProps {
  title: string;
  content: string;
  visualReference?: VisualReference;
  keyConcepts?: string[];
  /** Whether to start collapsed */
  defaultCollapsed?: boolean;
  /** Whether panel can be collapsed */
  collapsible?: boolean;
  className?: string;
}

export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({
  title,
  content,
  visualReference,
  keyConcepts,
  defaultCollapsed = false,
  collapsible = true,
  className = '',
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  return (
    <div className={`bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-xl border border-slate-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div 
        className={`flex items-center justify-between px-5 py-4 ${collapsible ? 'cursor-pointer hover:bg-white/50' : ''}`}
        onClick={() => collapsible && setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-slate-800">{title}</h3>
        </div>
        {collapsible && (
          <motion.svg
            className="w-5 h-5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ rotate: isCollapsed ? 0 : 180 }}
            transition={{ duration: 0.2 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
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
            <div className="px-5 pb-5 space-y-4">
              {/* Main explanation */}
              <p className="text-slate-600 leading-relaxed">{content}</p>

              {/* Visual reference */}
              {visualReference && (
                <div className="rounded-lg overflow-hidden border border-slate-200 bg-white">
                  {visualReference.type === 'code' && (
                    <div className="text-sm">
                      <div className="px-3 py-2 bg-slate-100 border-b border-slate-200 text-xs text-slate-500 font-mono">
                        {visualReference.language || 'example'}
                      </div>
                      <SyntaxHighlighter
                        language={visualReference.language || 'text'}
                        style={oneLight}
                        customStyle={{
                          margin: 0,
                          padding: '1rem',
                          background: 'white',
                          fontSize: '0.875rem',
                        }}
                      >
                        {visualReference.content}
                      </SyntaxHighlighter>
                    </div>
                  )}
                  {visualReference.type === 'image' && (
                    <img 
                      src={visualReference.content} 
                      alt={title}
                      className="w-full h-auto"
                    />
                  )}
                  {visualReference.type === 'diagram' && (
                    <div 
                      className="p-4"
                      dangerouslySetInnerHTML={{ __html: visualReference.content }}
                    />
                  )}
                </div>
              )}

              {/* Key concepts */}
              {keyConcepts && keyConcepts.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {keyConcepts.map((concept, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-100 text-blue-700 text-xs font-medium"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed indicator */}
      {isCollapsed && (
        <div className="px-5 pb-4">
          <p className="text-sm text-slate-400 italic">
            Click to expand reference material
          </p>
        </div>
      )}
    </div>
  );
};

export default ExplanationPanel;
