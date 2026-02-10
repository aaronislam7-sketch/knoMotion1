/**
 * TextBlock Block
 * 
 * Simple text content with optional emphasis styling.
 */

import React from 'react';
import type { BlockComponentProps } from '../../core/BlockRegistry';
import type { TextBlockConfig } from '../../types/unified-schema';

export const TextBlock: React.FC<BlockComponentProps<TextBlockConfig>> = ({
  id,
  config,
  stylePreset,
  className = '',
}) => {
  const { text, emphasis = 'normal', align = 'left' } = config;

  const emphasisStyles = {
    normal: 'text-slate-700',
    strong: 'text-slate-900 font-semibold',
    subtle: 'text-slate-500',
  };

  const alignStyles = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <div
      id={id}
      className={`
        text-sm sm:text-[15px]
        ${emphasisStyles[emphasis]}
        ${alignStyles[align]}
        ${stylePreset === 'prose' ? 'prose prose-slate max-w-none' : ''}
        ${className}
      `}
    >
      <p className="leading-6">{text}</p>
    </div>
  );
};

export default TextBlock;
