/**
 * Icon Component
 * 
 * Renders emoji icons or SVG icons with consistent sizing and animation support.
 */

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { fadeInScale, pulseAttention } from '../animations';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface IconProps extends Omit<HTMLMotionProps<'span'>, 'children'> {
  /** Emoji or icon character */
  icon: string;
  /** Icon size */
  size?: IconSize;
  /** Pulse animation for attention */
  pulse?: boolean;
  /** Animate entrance */
  animate?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const sizeStyles: Record<IconSize, string> = {
  xs: 'text-sm',
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-3xl',
  xl: 'text-4xl',
  '2xl': 'text-5xl',
};

export const Icon: React.FC<IconProps> = ({
  icon,
  size = 'md',
  pulse = false,
  animate = false,
  className = '',
  ...motionProps
}) => {
  return (
    <motion.span
      className={`inline-flex items-center justify-center ${sizeStyles[size]} ${className}`}
      role="img"
      aria-label={icon}
      variants={animate ? fadeInScale : pulse ? pulseAttention : undefined}
      initial={animate ? 'hidden' : pulse ? 'idle' : undefined}
      animate={animate ? 'visible' : pulse ? 'pulse' : undefined}
      {...motionProps}
    >
      {icon}
    </motion.span>
  );
};

export default Icon;
