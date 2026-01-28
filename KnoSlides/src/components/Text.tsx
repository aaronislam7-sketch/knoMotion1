/**
 * Text Component
 * 
 * Themed text component matching KnoMotion typography system.
 */

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { fadeInUp } from '../animations';

export type TextVariant = 'display' | 'title' | 'body' | 'accent' | 'utility';
export type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
export type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';
export type TextColor = 'ink' | 'ink-soft' | 'ink-muted' | 'primary' | 'secondary' | 'accent-green' | 'accent-blue' | 'white';

export interface TextProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: React.ReactNode;
  variant?: TextVariant;
  size?: TextSize;
  weight?: TextWeight;
  color?: TextColor;
  as?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';
  animate?: boolean;
  className?: string;
}

const variantStyles: Record<TextVariant, string> = {
  display: 'font-display',
  title: 'font-header',
  body: 'font-body',
  accent: 'font-accent',
  utility: 'font-body',
};

const sizeStyles: Record<TextSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl md:text-4xl',
};

const weightStyles: Record<TextWeight, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

const colorStyles: Record<TextColor, string> = {
  ink: 'text-kno-ink',
  'ink-soft': 'text-kno-ink-soft',
  'ink-muted': 'text-kno-ink-muted',
  primary: 'text-kno-primary',
  secondary: 'text-kno-secondary',
  'accent-green': 'text-kno-accent-green',
  'accent-blue': 'text-kno-accent-blue',
  white: 'text-white',
};

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'body',
  size = 'md',
  weight = 'normal',
  color = 'ink',
  as = 'div',
  animate = false,
  className = '',
  ...motionProps
}) => {
  const classes = `${variantStyles[variant]} ${sizeStyles[size]} ${weightStyles[weight]} ${colorStyles[color]} ${className}`;
  
  const Component = motion[as] as any;

  return (
    <Component
      className={classes}
      variants={animate ? fadeInUp : undefined}
      initial={animate ? 'hidden' : undefined}
      animate={animate ? 'visible' : undefined}
      {...motionProps}
    >
      {children}
    </Component>
  );
};

export default Text;
