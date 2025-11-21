import React from 'react';
import { KNODE_THEME } from '../../theme/knodeTheme';

/**
 * Rating - Star rating display (visual only, non-interactive)
 * 
 * @param {Object} props
 * @param {number} [props.value=5] - Rating value (0-5)
 * @param {number} [props.max=5] - Maximum rating
 * @param {'sm'|'md'|'lg'|'xl'} [props.size='md'] - Star size
 * @param {string} [props.color] - Star color (from KNODE_THEME)
 * @param {boolean} [props.half=false] - Show half stars
 * @param {Object} [props.animation] - Animation config
 * @param {Object} [props.style] - Additional inline styles
 */
export const Rating = ({
  value = 5,
  max = 5,
  size = 'md',
  color = 'primary',
  half = false,
  animation,
  style = {},
  ...props
}) => {
  const theme = KNODE_THEME;

  // Size mapping
  const sizeMap = {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 40,
  };

  const starSize = sizeMap[size];
  const starColor = theme.colors[color] || theme.colors.doodle;
  const emptyColor = `${theme.colors.textMain}20`;

  const containerStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
  };

  const starStyles = (filled, isHalf = false) => ({
    fontSize: starSize,
    color: filled ? starColor : emptyColor,
    position: 'relative',
    display: 'inline-block',
    ...(isHalf && {
      background: `linear-gradient(90deg, ${starColor} 50%, ${emptyColor} 50%)`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    }),
  });

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= max; i++) {
      const isFilled = i <= value;
      const isHalfStar = half && i === Math.ceil(value) && value % 1 !== 0;

      stars.push(
        <span key={i} style={starStyles(isFilled || isHalfStar, isHalfStar)}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div
      style={{
        ...containerStyles,
        ...style,
      }}
      role="img"
      aria-label={`Rating: ${value} out of ${max}`}
      {...props}
    >
      {renderStars()}
    </div>
  );
};
