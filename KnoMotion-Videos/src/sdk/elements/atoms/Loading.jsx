import React from 'react';
import { KNODE_THEME } from '../../theme/knodeTheme';

/**
 * Loading - Animated loading indicators
 * 
 * @param {Object} props
 * @param {'spinner'|'dots'|'ring'|'bars'|'infinity'} [props.variant='spinner'] - Loading animation type
 * @param {'sm'|'md'|'lg'|'xl'} [props.size='md'] - Loading indicator size
 * @param {string} [props.color] - Color from KNODE_THEME
 * @param {Object} [props.style] - Additional inline styles
 */
export const Loading = ({
  variant = 'spinner',
  size = 'md',
  color = 'primary',
  style = {},
  ...props
}) => {
  const theme = KNODE_THEME;

  // Size mapping
  const sizeMap = {
    sm: 24,
    md: 40,
    lg: 60,
    xl: 80,
  };

  const loadingSize = sizeMap[size];
  const loadingColor = theme.colors[color] || theme.colors.primary;

  // Common base styles
  const baseStyles = {
    display: 'inline-block',
    width: loadingSize,
    height: loadingSize,
  };

  // Spinner variant
  const spinnerStyles = {
    ...baseStyles,
    border: `${loadingSize / 8}px solid ${loadingColor}20`,
    borderTopColor: loadingColor,
    borderRadius: '50%',
    animation: 'spin 0.6s linear infinite',
  };

  // Dots variant
  const dotsStyles = {
    ...baseStyles,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: loadingSize / 6,
  };

  const dotStyles = {
    width: loadingSize / 4,
    height: loadingSize / 4,
    borderRadius: '50%',
    backgroundColor: loadingColor,
  };

  // Ring variant (double ring)
  const ringStyles = {
    ...baseStyles,
    border: `${loadingSize / 10}px solid transparent`,
    borderTopColor: loadingColor,
    borderBottomColor: loadingColor,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  };

  // Bars variant
  const barsStyles = {
    ...baseStyles,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: loadingSize / 8,
  };

  const barStyles = (delay) => ({
    width: loadingSize / 5,
    height: '100%',
    backgroundColor: loadingColor,
    animation: `pulse 1.2s ease-in-out ${delay}s infinite`,
  });

  // Infinity variant
  const infinityStyles = {
    ...baseStyles,
    position: 'relative',
  };

  const infinityPartStyles = (isLeft) => ({
    position: 'absolute',
    width: loadingSize / 2,
    height: loadingSize / 2,
    border: `${loadingSize / 12}px solid ${loadingColor}`,
    borderRadius: '50%',
    left: isLeft ? 0 : loadingSize / 2,
    animation: `spin ${isLeft ? '1.2s' : '-1.2s'} linear infinite`,
  });

  const renderLoading = () => {
    switch (variant) {
      case 'dots':
        return (
          <div style={dotsStyles}>
            <div style={{ ...dotStyles, animation: 'pulse 1.4s ease-in-out 0s infinite' }} />
            <div style={{ ...dotStyles, animation: 'pulse 1.4s ease-in-out 0.2s infinite' }} />
            <div style={{ ...dotStyles, animation: 'pulse 1.4s ease-in-out 0.4s infinite' }} />
          </div>
        );

      case 'ring':
        return <div style={ringStyles} />;

      case 'bars':
        return (
          <div style={barsStyles}>
            <div style={barStyles(0)} />
            <div style={barStyles(0.15)} />
            <div style={barStyles(0.3)} />
          </div>
        );

      case 'infinity':
        return (
          <div style={infinityStyles}>
            <div style={infinityPartStyles(true)} />
            <div style={infinityPartStyles(false)} />
          </div>
        );

      case 'spinner':
      default:
        return <div style={spinnerStyles} />;
    }
  };

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
      {...props}
    >
      {renderLoading()}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scaleY(0.5); }
          50% { opacity: 1; transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
};
