/**
 * Callout Block
 * 
 * Highlighted information box with different tones.
 * Used for "So What?" panels and important notices.
 */

import React from 'react';
import { motion } from 'framer-motion';
import type { BlockComponentProps } from '../../core/BlockRegistry';
import type { CalloutConfig } from '../../types/unified-schema';

const toneConfig = {
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    titleColor: 'text-blue-800',
    bodyColor: 'text-blue-700',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  success: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    titleColor: 'text-emerald-800',
    bodyColor: 'text-emerald-700',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    titleColor: 'text-amber-800',
    bodyColor: 'text-amber-700',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    titleColor: 'text-red-800',
    bodyColor: 'text-red-700',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  insight: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    titleColor: 'text-purple-800',
    bodyColor: 'text-purple-700',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
};

// Default icons for different titles
const getIconForTitle = (title?: string, tone?: CalloutConfig['tone']) => {
  if (!title) return toneConfig[tone || 'info'].icon;
  
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('so what') || titleLower.includes('why')) {
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }
  
  return toneConfig[tone || 'info'].icon;
};

export const Callout: React.FC<BlockComponentProps<CalloutConfig>> = ({
  id,
  config,
  stylePreset,
  className = '',
}) => {
  const { tone, title, body, icon } = config;
  const styles = toneConfig[tone];
  const displayIcon = icon || getIconForTitle(title, tone);

  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        rounded-xl border p-4 min-w-0
        ${styles.bg} ${styles.border}
        ${stylePreset === 'prominent' ? 'shadow-soft' : ''}
        ${className}
      `}
    >
      <div className="flex items-start gap-3">
        <div className={`
          w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
          ${styles.iconBg} ${styles.iconColor}
        `}>
          {typeof displayIcon === 'string' ? (
            <span className="text-lg">{displayIcon}</span>
          ) : (
            displayIcon
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className={`text-sm font-semibold mb-1 ${styles.titleColor}`}>
              {title}
            </h4>
          )}
          <p className={`text-sm leading-6 ${styles.bodyColor}`}>
            {body}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Callout;
