import React from 'react';
import { KNODE_THEME } from '../../theme/knodeTheme';
import { applyAnimationStyle } from '../../animations';

/**
 * Alert - Informational message boxes with icons and colors
 * 
 * @param {Object} props
 * @param {string} props.text - Alert message text
 * @param {string} [props.title] - Optional alert title
 * @param {string} [props.iconRef] - Icon/emoji to display
 * @param {'info'|'success'|'warning'|'error'} [props.variant='info'] - Alert type
 * @param {'outline'|'soft'|'solid'} [props.style='solid'] - Visual style
 * @param {Object} [props.animation] - Animation config
 * @param {Object} [props.style] - Additional inline styles
 */
export const Alert = ({
  text,
  title,
  iconRef,
  variant = 'info',
  styleVariant = 'solid',
  animation,
  style = {},
  ...props
}) => {
  const theme = KNODE_THEME;

  // Color mapping based on variant
  const variantColors = {
    info: {
      bg: theme.colors.primary,
      text: theme.colors.cardBg,
      border: theme.colors.primary,
    },
    success: {
      bg: theme.colors.accentGreen,
      text: theme.colors.cardBg,
      border: theme.colors.accentGreen,
    },
    warning: {
      bg: theme.colors.doodle,
      text: theme.colors.textMain,
      border: theme.colors.doodle,
    },
    error: {
      bg: '#E74C3C',
      text: theme.colors.cardBg,
      border: '#E74C3C',
    },
  };

  const colors = variantColors[variant];

  // Style variants
  const getAlertStyles = () => {
    const baseStyles = {
      display: 'flex',
      alignItems: 'flex-start',
      gap: theme.spacing.cardPadding,
      padding: theme.spacing.cardPadding,
      borderRadius: theme.radii.card,
      fontFamily: theme.fonts.body,
    };

    switch (styleVariant) {
      case 'outline':
        return {
          ...baseStyles,
          backgroundColor: theme.colors.cardBg,
          border: `2px solid ${colors.border}`,
          color: colors.border,
        };
      case 'soft':
        return {
          ...baseStyles,
          backgroundColor: `${colors.bg}20`,
          border: 'none',
          color: theme.colors.textMain,
        };
      case 'solid':
      default:
        return {
          ...baseStyles,
          backgroundColor: colors.bg,
          border: 'none',
          color: colors.text,
        };
    }
  };

  const iconStyles = {
    fontSize: 24,
    flexShrink: 0,
  };

  const contentStyles = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  };

  const titleStyles = {
    fontSize: 16,
    fontWeight: 700,
    fontFamily: theme.fonts.header,
  };

  const textStyles = {
    fontSize: 14,
    fontWeight: 400,
    lineHeight: 1.5,
  };

  const animationStyles = animation ? applyAnimationStyle(animation) : {};

  return (
    <div
      role="alert"
      style={{
        ...getAlertStyles(),
        ...animationStyles,
        ...style,
      }}
      {...props}
    >
      {iconRef && <div style={iconStyles}>{iconRef}</div>}
      <div style={contentStyles}>
        {title && <div style={titleStyles}>{title}</div>}
        <div style={textStyles}>{text}</div>
      </div>
    </div>
  );
};
