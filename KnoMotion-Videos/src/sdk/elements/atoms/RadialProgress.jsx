import React from 'react';
import { KNODE_THEME } from '../../theme/knodeTheme';

/**
 * RadialProgress - Circular progress indicator with percentage
 * 
 * @param {Object} props
 * @param {number} [props.value=0] - Progress value (0-100)
 * @param {'sm'|'md'|'lg'|'xl'} [props.size='md'] - Circle size
 * @param {number} [props.thickness=4] - Progress ring thickness
 * @param {string} [props.color] - Progress color (from KNODE_THEME)
 * @param {boolean} [props.showValue=true] - Show percentage text
 * @param {string} [props.label] - Optional label below value
 * @param {Object} [props.animation] - Animation config
 * @param {Object} [props.style] - Additional inline styles
 */
export const RadialProgress = ({
  value = 0,
  size = 'md',
  thickness = 4,
  color = 'primary',
  showValue = true,
  label,
  animation,
  style = {},
  ...props
}) => {
  const theme = KNODE_THEME;

  // Size mapping
  const sizeMap = {
    sm: 60,
    md: 100,
    lg: 140,
    xl: 180,
  };

  const circleSize = sizeMap[size];
  const radius = (circleSize - thickness * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (value / 100) * circumference;

  const progressColor = theme.colors[color] || theme.colors.primary;
  const trackColor = `${theme.colors.textMain}10`;

  const containerStyles = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: circleSize,
    height: circleSize,
  };

  const svgStyles = {
    transform: 'rotate(-90deg)',
    width: '100%',
    height: '100%',
  };

  const textContainerStyles = {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  };

  const valueStyles = {
    fontSize: circleSize * 0.25,
    fontWeight: 700,
    fontFamily: theme.fonts.header,
    color: theme.colors.textMain,
  };

  const labelStyles = {
    fontSize: circleSize * 0.12,
    fontWeight: 400,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
  };

  return (
    <div
      style={{
        ...containerStyles,
        ...style,
      }}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin="0"
      aria-valuemax="100"
      {...props}
    >
      <svg style={svgStyles}>
        {/* Background track */}
        <circle
          cx={circleSize / 2}
          cy={circleSize / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={thickness}
        />
        {/* Progress arc */}
        <circle
          cx={circleSize / 2}
          cy={circleSize / 2}
          r={radius}
          fill="none"
          stroke={progressColor}
          strokeWidth={thickness}
          strokeDasharray={circumference}
          strokeDashoffset={progressOffset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.3s ease',
          }}
        />
      </svg>
      {showValue && (
        <div style={textContainerStyles}>
          <div style={valueStyles}>{Math.round(value)}%</div>
          {label && <div style={labelStyles}>{label}</div>}
        </div>
      )}
    </div>
  );
};
