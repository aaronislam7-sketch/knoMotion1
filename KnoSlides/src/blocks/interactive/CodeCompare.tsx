/**
 * CodeCompare Block
 * 
 * Side-by-side code comparison with optional diff highlighting.
 * Used in Repair the Model pattern for before/after.
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { BlockComponentProps } from '../../core/BlockRegistry';
import type { CodeCompareConfig } from '../../types/unified-schema';

// Simple syntax highlighting (same as TextAndCodeBlock)
const highlightCode = (code: string, language: string) => {
  if (language === 'sql') {
    return code
      .replace(/\b(SELECT|FROM|WHERE|JOIN|INNER|LEFT|RIGHT|OUTER|ON|AND|OR|NOT|IN|IS|NULL|AS|ORDER|BY|GROUP|HAVING|LIMIT|OFFSET|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|TABLE|INDEX|VIEW|UNION|ALL|DISTINCT|COUNT|SUM|AVG|MIN|MAX)\b/gi, 
        '<span class="text-indigo-400 font-semibold">$1</span>')
      .replace(/('.*?')/g, '<span class="text-emerald-400">$1</span>')
      .replace(/(\d+)/g, '<span class="text-amber-400">$1</span>');
  }
  
  if (language === 'python') {
    return code
      .replace(/\b(def|class|return|if|elif|else|for|while|in|import|from|as|try|except|finally|with|yield|lambda|and|or|not|True|False|None)\b/g,
        '<span class="text-indigo-400 font-semibold">$1</span>')
      .replace(/(["'].*?["'])/g, '<span class="text-emerald-400">$1</span>')
      .replace(/(#.*$)/gm, '<span class="text-slate-500">$1</span>');
  }
  
  if (language === 'javascript' || language === 'js' || language === 'typescript' || language === 'ts') {
    return code
      .replace(/\b(const|let|var|function|return|if|else|for|while|switch|case|break|continue|try|catch|finally|throw|new|class|extends|import|export|from|async|await|true|false|null|undefined)\b/g,
        '<span class="text-indigo-400 font-semibold">$1</span>')
      .replace(/(["'`].*?["'`])/g, '<span class="text-emerald-400">$1</span>')
      .replace(/(\/\/.*$)/gm, '<span class="text-slate-500">$1</span>');
  }
  
  return code;
};

// Generate line numbers
const getLineNumbers = (code: string) => {
  return code.split('\n').map((_, i) => i + 1);
};

export const CodeCompare: React.FC<BlockComponentProps<CodeCompareConfig>> = ({
  id,
  config,
  stylePreset,
  className = '',
}) => {
  const { 
    leftCode, 
    rightCode, 
    language, 
    leftLabel = 'Before', 
    rightLabel = 'After',
    diffMode = 'side-by-side',
    showDiff = false,
    highlightLines,
  } = config;

  const leftHighlighted = useMemo(() => highlightCode(leftCode, language), [leftCode, language]);
  const rightHighlighted = useMemo(() => highlightCode(rightCode, language), [rightCode, language]);
  const leftLineNumbers = useMemo(() => getLineNumbers(leftCode), [leftCode]);
  const rightLineNumbers = useMemo(() => getLineNumbers(rightCode), [rightCode]);

  const renderCodePane = (
    code: string,
    highlighted: string,
    lineNumbers: number[],
    label: string,
    highlightedLines: number[] = [],
    isRight: boolean = false
  ) => (
    <div className={`flex-1 ${isRight ? 'border-l border-slate-700' : ''}`}>
      {/* Pane header */}
      <div className={`
        px-4 py-2 border-b border-slate-700 flex items-center justify-between
        ${isRight ? 'bg-emerald-900/30' : 'bg-slate-800'}
      `}>
        <span className={`text-sm font-medium ${isRight ? 'text-emerald-300' : 'text-slate-300'}`}>
          {label}
        </span>
        {isRight && (
          <span className="text-xs bg-emerald-600/30 text-emerald-300 px-2 py-0.5 rounded">
            ✓ Fixed
          </span>
        )}
        {!isRight && highlightedLines.length > 0 && (
          <span className="text-xs bg-red-600/30 text-red-300 px-2 py-0.5 rounded">
            {highlightedLines.length} issue{highlightedLines.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>
      
      {/* Code content */}
      <div className="overflow-x-auto">
        <pre className="p-4 text-sm font-mono">
          <code className="flex">
            {/* Line numbers */}
            <div className="pr-4 text-right text-slate-500 select-none border-r border-slate-700 mr-4">
              {lineNumbers.map(num => (
                <div 
                  key={num} 
                  className={`
                    leading-6
                    ${highlightedLines.includes(num) ? 'bg-red-500/20 text-red-400' : ''}
                  `}
                >
                  {num}
                </div>
              ))}
            </div>
            
            {/* Code lines */}
            <div className="flex-1">
              {highlighted.split('\n').map((line, idx) => (
                <div 
                  key={idx}
                  className={`
                    leading-6 whitespace-pre
                    ${highlightedLines.includes(idx + 1) ? 'bg-red-500/20 border-l-2 border-red-500 -ml-2 pl-2' : ''}
                  `}
                  dangerouslySetInnerHTML={{ __html: line || '&nbsp;' }}
                />
              ))}
            </div>
          </code>
        </pre>
      </div>
    </div>
  );

  if (diffMode === 'side-by-side') {
    return (
      <div
        id={id}
        className={`
          rounded-xl border border-slate-700 overflow-hidden bg-slate-900
          ${className}
        `}
      >
        <div className="flex">
          {renderCodePane(
            leftCode,
            leftHighlighted,
            leftLineNumbers,
            leftLabel,
            highlightLines?.left || []
          )}
          {renderCodePane(
            rightCode,
            rightHighlighted,
            rightLineNumbers,
            rightLabel,
            highlightLines?.right || [],
            true
          )}
        </div>
      </div>
    );
  }

  // Inline/unified mode - show only left with ability to toggle
  return (
    <div
      id={id}
      className={`
        rounded-xl border border-slate-700 overflow-hidden bg-slate-900
        ${className}
      `}
    >
      {renderCodePane(
        leftCode,
        leftHighlighted,
        leftLineNumbers,
        leftLabel,
        highlightLines?.left || []
      )}
    </div>
  );
};

export default CodeCompare;
