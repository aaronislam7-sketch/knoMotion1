/**
 * ProgressIndicator Component
 * 
 * Visual progress indicator for template completion states.
 */

import React from 'react';
import { motion } from 'framer-motion';

export type ProgressVariant = 'bar' | 'dots' | 'steps';
export type ProgressSize = 'sm' | 'md' | 'lg';

export interface ProgressIndicatorProps {
  /** Current progress (0-100 for bar, current index for dots/steps) */
  value: number;
  /** Maximum value (100 for bar, total count for dots/steps) */
  max: number;
  /** Visual variant */
  variant?: ProgressVariant;
  /** Size */
  size?: ProgressSize;
  /** Label text */
  label?: string;
  /** Show percentage/count text */
  showText?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const sizeConfig: Record<ProgressSize, { bar: string; dot: string; text: string }> = {
  sm: { bar: 'h-1.5', dot: 'w-2 h-2', text: 'text-xs' },
  md: { bar: 'h-2', dot: 'w-3 h-3', text: 'text-sm' },
  lg: { bar: 'h-3', dot: 'w-4 h-4', text: 'text-base' },
};

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  value,
  max,
  variant = 'bar',
  size = 'md',
  label,
  showText = true,
  className = '',
}) => {
  const config = sizeConfig[size];
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  if (variant === 'bar') {
    return (
      <div className={`w-full ${className}`}>
        {(label || showText) && (
          <div className={`flex justify-between items-center mb-2 ${config.text}`}>
            {label && <span className="text-kno-ink-soft">{label}</span>}
            {showText && (
              <span className="text-kno-ink-muted font-medium">
                {Math.round(percentage)}%
              </span>
            )}
          </div>
        )}
        <div className={`w-full bg-kno-rule rounded-full overflow-hidden ${config.bar}`}>
          <motion.div
            className="h-full bg-kno-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {label && (
          <span className={`text-kno-ink-soft mr-2 ${config.text}`}>{label}</span>
        )}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: max }).map((_, index) => (
            <motion.div
              key={index}
              className={`rounded-full ${config.dot} ${
                index < value ? 'bg-kno-primary' : 'bg-kno-rule'
              }`}
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{
                scale: index < value ? 1 : 0.8,
                opacity: index < value ? 1 : 0.5,
              }}
              transition={{ duration: 0.2 }}
            />
          ))}
        </div>
        {showText && (
          <span className={`text-kno-ink-muted ml-2 ${config.text}`}>
            {value} of {max}
          </span>
        )}
      </div>
    );
  }

  // Steps variant
  return (
    <div className={`flex items-center ${className}`}>
      {label && (
        <span className={`text-kno-ink-soft mr-4 ${config.text}`}>{label}</span>
      )}
      <div className="flex items-center">
        {Array.from({ length: max }).map((_, index) => (
          <React.Fragment key={index}>
            <motion.div
              className={`flex items-center justify-center rounded-full ${config.dot} ${
                index < value
                  ? 'bg-kno-primary text-white'
                  : index === value
                  ? 'bg-kno-primary/20 text-kno-primary border-2 border-kno-primary'
                  : 'bg-kno-rule text-kno-ink-muted'
              }`}
              style={{
                width: size === 'sm' ? 20 : size === 'md' ? 28 : 36,
                height: size === 'sm' ? 20 : size === 'md' ? 28 : 36,
              }}
              initial={{ scale: 0.9 }}
              animate={{ scale: index <= value ? 1 : 0.9 }}
              transition={{ duration: 0.2 }}
            >
              {index < value ? (
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <span className={config.text}>{index + 1}</span>
              )}
            </motion.div>
            {index < max - 1 && (
              <div
                className={`${config.bar} mx-1 ${
                  index < value ? 'bg-kno-primary' : 'bg-kno-rule'
                }`}
                style={{ width: size === 'sm' ? 16 : size === 'md' ? 24 : 32 }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;
