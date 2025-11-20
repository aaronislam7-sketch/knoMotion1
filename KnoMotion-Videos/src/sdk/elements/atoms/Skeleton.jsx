import React from 'react';
import { KNODE_THEME } from '../../theme/knodeTheme';

/**
 * Skeleton - Loading state placeholder with shimmer effect
 * 
 * @param {Object} props
 * @param {'text'|'circle'|'rectangle'} [props.variant='rectangle'] - Skeleton shape
 * @param {number|string} [props.width] - Width (px or %)
 * @param {number|string} [props.height] - Height (px or %)
 * @param {boolean} [props.animated=true] - Enable shimmer animation
 * @param {Object} [props.style] - Additional inline styles
 */
export const Skeleton = ({
  variant = 'rectangle',
  width,
  height,
  animated = true,
  style = {},
  ...props
}) => {
  const theme = KNODE_THEME;

  // Default dimensions by variant
  const defaultDimensions = {
    text: { width: '100%', height: 16 },
    circle: { width: 60, height: 60 },
    rectangle: { width: 200, height: 100 },
  };

  const dimensions = defaultDimensions[variant];

  const baseStyles = {
    display: 'inline-block',
    width: width || dimensions.width,
    height: height || dimensions.height,
    backgroundColor: `${theme.colors.textMain}10`,
    position: 'relative',
    overflow: 'hidden',
    ...(variant === 'circle' && { borderRadius: '50%' }),
    ...(variant === 'text' && { borderRadius: 4 }),
    ...(variant === 'rectangle' && { borderRadius: theme.radii.card }),
  };

  const shimmerStyles = animated
    ? {
        '::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: `linear-gradient(90deg, transparent, ${theme.colors.textMain}20, transparent)`,
          animation: 'shimmer 1.5s infinite',
        },
      }
    : {};

  return (
    <>
      <div
        style={{
          ...baseStyles,
          ...style,
        }}
        {...props}
      />
      {animated && (
        <style>{`
          @keyframes shimmer {
            0% { transform: translateX(0); }
            100% { transform: translateX(200%); }
          }
          div:has(+ style) {
            position: relative;
            overflow: hidden;
          }
          div:has(+ style)::before {
            content: "";
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%
;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(0,0,0,0.05), transparent);
            animation: shimmer 1.5s infinite;
          }
        `}</style>
      )}
    </>
  );
};
