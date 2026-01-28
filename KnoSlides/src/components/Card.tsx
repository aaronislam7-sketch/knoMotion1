/**
 * Card Component
 * 
 * Base card component with variants matching KnoMotion design system.
 * Includes Framer Motion animation support.
 */

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cardInteractive, fadeInScale } from '../animations';

export type CardVariant = 'default' | 'bordered' | 'glass' | 'elevated';
export type CardSize = 'sm' | 'md' | 'lg';

export interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: React.ReactNode;
  variant?: CardVariant;
  size?: CardSize;
  interactive?: boolean;
  animate?: boolean;
  className?: string;
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-kno-board shadow-card',
  bordered: 'bg-kno-board border-2 border-kno-ink/10',
  glass: 'bg-white/95 backdrop-blur-sm shadow-soft',
  elevated: 'bg-kno-board shadow-lg',
};

const sizeStyles: Record<CardSize, string> = {
  sm: 'p-4 rounded-lg',
  md: 'p-6 rounded-card',
  lg: 'p-8 rounded-soft',
};

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  size = 'md',
  interactive = false,
  animate = true,
  className = '',
  ...motionProps
}) => {
  const baseClasses = `${variantStyles[variant]} ${sizeStyles[size]}`;
  const interactiveClasses = interactive ? 'cursor-pointer' : '';

  return (
    <motion.div
      className={`${baseClasses} ${interactiveClasses} ${className}`}
      variants={interactive ? cardInteractive : (animate ? fadeInScale : undefined)}
      initial={animate ? 'hidden' : undefined}
      animate={animate ? 'visible' : undefined}
      whileHover={interactive ? 'hover' : undefined}
      whileTap={interactive ? 'tap' : undefined}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

export default Card;
