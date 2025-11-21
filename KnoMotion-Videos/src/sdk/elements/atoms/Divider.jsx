import React from 'react';
import { KNODE_THEME } from '../../theme/knodeTheme';

/**
 * Divider - Atomic element for horizontal/vertical separators
 * 
 * @param {object} props
 * @param {string} props.orientation - 'horizontal'|'vertical'
 * @param {string} props.variant - 'solid'|'dashed'|'dotted'
 * @param {number} props.thickness - Line thickness in pixels
 * @param {string} props.color - Color from theme (default: textMain with 20% opacity)
 * @param {number} props.length - Length in pixels (or '100%' for full width/height)
 * @param {object} props.style - Style overrides
 */
export const Divider = ({ 
  orientation = 'horizontal',
  variant = 'solid',
  thickness = 2,
  color = null,
  length = '100%',
  style = {},
  className = '',
  ...props 
}) => {
  const theme = KNODE_THEME;
  
  const lineColor = color 
    ? (theme.colors[color] || color)
    : `${theme.colors.textMain}33`;  // 20% opacity
  
  const isHorizontal = orientation === 'horizontal';
  
  return (
    <div 
      className={`divider ${className}`}
      style={{
        width: isHorizontal ? length : thickness,
        height: isHorizontal ? thickness : length,
        backgroundColor: variant === 'solid' ? lineColor : 'transparent',
        borderTop: variant === 'dashed' ? `${thickness}px dashed ${lineColor}` : 'none',
        borderLeft: variant === 'dotted' ? `${thickness}px dotted ${lineColor}` : 'none',
        ...style,
      }}
      {...props}
    />
  );
};
