import React from 'react';
import { KNODE_THEME } from '../../theme/knodeTheme';
import { applyAnimationStyle } from '../../animations';

/**
 * Avatar - User profile image with status indicators
 * 
 * @param {Object} props
 * @param {string} [props.imageRef] - Image URL or emoji fallback
 * @param {string} [props.text] - Text fallback (initials)
 * @param {'sm'|'md'|'lg'|'xl'} [props.size='md'] - Avatar size
 * @param {'circle'|'square'|'squircle'} [props.shape='circle'] - Avatar shape
 * @param {'online'|'offline'|'away'|null} [props.status] - Status indicator
 * @param {boolean} [props.ring] - Show ring around avatar
 * @param {Object} [props.animation] - Animation config
 * @param {Object} [props.style] - Additional inline styles
 */
export const Avatar = ({
  imageRef,
  text,
  size = 'md',
  shape = 'circle',
  status,
  ring = false,
  animation,
  style = {},
  ...props
}) => {
  const theme = KNODE_THEME;

  // Size mapping
  const sizeMap = {
    sm: 40,
    md: 60,
    lg: 80,
    xl: 100,
  };

  const avatarSize = sizeMap[size];

  // Shape mapping
  const shapeStyles = {
    circle: { borderRadius: '50%' },
    square: { borderRadius: 0 },
    squircle: { borderRadius: theme.radii.card },
  };

  // Status colors
  const statusColors = {
    online: theme.colors.accentGreen,
    offline: '#95A5A6',
    away: theme.colors.doodle,
  };

  const containerStyles = {
    position: 'relative',
    display: 'inline-block',
    width: avatarSize,
    height: avatarSize,
  };

  const avatarStyles = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    backgroundColor: theme.colors.primary,
    color: theme.colors.cardBg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: theme.fonts.header,
    fontWeight: 700,
    fontSize: avatarSize * 0.4,
    ...shapeStyles[shape],
    ...(ring && {
      border: `3px solid ${theme.colors.primary}`,
      boxShadow: `0 0 0 3px ${theme.colors.cardBg}`,
    }),
  };

  const statusIndicatorStyles = status
    ? {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: avatarSize * 0.25,
        height: avatarSize * 0.25,
        borderRadius: '50%',
        backgroundColor: statusColors[status],
        border: `2px solid ${theme.colors.cardBg}`,
      }
    : null;

  const animationStyles = animation ? applyAnimationStyle(animation) : {};

  return (
    <div
      style={{
        ...containerStyles,
        ...animationStyles,
        ...style,
      }}
      {...props}
    >
      {imageRef && typeof imageRef === 'string' && imageRef.startsWith('http') ? (
        <img src={imageRef} alt="Avatar" style={avatarStyles} />
      ) : imageRef ? (
        <div style={avatarStyles}>{imageRef}</div>
      ) : (
        <div style={avatarStyles}>{text || '?'}</div>
      )}
      {status && <div style={statusIndicatorStyles} />}
    </div>
  );
};
