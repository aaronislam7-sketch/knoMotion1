/**
 * TextAndCodeBlock Block
 * 
 * Combined text explanation with code example.
 * Useful for showing syntax patterns with explanations.
 */

import React from 'react';
import { motion } from 'framer-motion';
import type { BlockComponentProps } from '../../core/BlockRegistry';
import type { TextAndCodeBlockConfig } from '../../types/unified-schema';

// Simple syntax highlighting (can be replaced with a proper highlighter)
const highlightCode = (code: string, language: string) => {
  // SQL keywords
  if (language === 'sql') {
    return code
      .replace(/\b(SELECT|FROM|WHERE|JOIN|INNER|LEFT|RIGHT|OUTER|ON|AND|OR|NOT|IN|IS|NULL|AS|ORDER|BY|GROUP|HAVING|LIMIT|OFFSET|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|TABLE|INDEX|VIEW|UNION|ALL|DISTINCT|COUNT|SUM|AVG|MIN|MAX)\b/gi, 
        '<span class="text-indigo-600 font-semibold">$1</span>')
      .replace(/('.*?')/g, '<span class="text-emerald-600">$1</span>')
      .replace(/(\d+)/g, '<span class="text-amber-600">$1</span>');
  }
  
  // Python keywords
  if (language === 'python') {
    return code
      .replace(/\b(def|class|return|if|elif|else|for|while|in|import|from|as|try|except|finally|with|yield|lambda|and|or|not|True|False|None)\b/g,
        '<span class="text-indigo-600 font-semibold">$1</span>')
      .replace(/(["'].*?["'])/g, '<span class="text-emerald-600">$1</span>')
      .replace(/(#.*$)/gm, '<span class="text-slate-400">$1</span>');
  }
  
  // JavaScript keywords
  if (language === 'javascript' || language === 'js') {
    return code
      .replace(/\b(const|let|var|function|return|if|else|for|while|switch|case|break|continue|try|catch|finally|throw|new|class|extends|import|export|from|async|await|true|false|null|undefined)\b/g,
        '<span class="text-indigo-600 font-semibold">$1</span>')
      .replace(/(["'`].*?["'`])/g, '<span class="text-emerald-600">$1</span>')
      .replace(/(\/\/.*$)/gm, '<span class="text-slate-400">$1</span>');
  }
  
  return code;
};

export const TextAndCodeBlock: React.FC<BlockComponentProps<TextAndCodeBlockConfig>> = ({
  id,
  config,
  stylePreset,
  className = '',
}) => {
  const { text, code, language, codePosition = 'below' } = config;

  const codeBlock = (
    <div className="bg-slate-800 rounded-lg overflow-hidden">
      <div className="px-4 py-2 bg-slate-900 border-b border-slate-700 flex items-center justify-between">
        <span className="text-xs text-slate-400 uppercase tracking-wide">{language}</span>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
          <div className="w-3 h-3 rounded-full bg-green-500/50" />
        </div>
      </div>
      <pre className="p-4 text-sm font-mono text-slate-200 overflow-x-auto">
        <code 
          dangerouslySetInnerHTML={{ 
            __html: highlightCode(code, language) 
          }} 
        />
      </pre>
    </div>
  );

  const textBlock = (
    <p className="text-slate-600 leading-relaxed">{text}</p>
  );

  if (codePosition === 'right') {
    return (
      <div id={id} className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
        <div className="flex items-center">{textBlock}</div>
        {codeBlock}
      </div>
    );
  }

  if (codePosition === 'above') {
    return (
      <div id={id} className={`space-y-4 ${className}`}>
        {codeBlock}
        {textBlock}
      </div>
    );
  }

  // Default: below
  return (
    <div id={id} className={`space-y-4 ${className}`}>
      {textBlock}
      {codeBlock}
    </div>
  );
};

export default TextAndCodeBlock;
