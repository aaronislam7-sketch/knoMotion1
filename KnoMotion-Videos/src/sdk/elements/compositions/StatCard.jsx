import React from 'react';
import { Card } from '../atoms/Card';
import { Text } from '../atoms/Text';
import { KNODE_THEME } from '../../theme/knodeTheme';

/**
 * StatCard - Composition element for displaying statistics
 * 
 * @param {object} props
 * @param {string|number} props.value - Stat value (number or string)
 * @param {string} props.label - Stat label/description
 * @param {React.ReactNode} props.icon - Optional icon
 * @param {string} props.trend - 'up'|'down'|'neutral' (optional trend indicator)
 * @param {string} props.cardVariant - Card variant
 * @param {object} props.animation - Animation config
 * @param {object} props.style - Style overrides
 */
export const StatCard = ({ 
  value,
  label,
  icon = null,
  trend = null,
  cardVariant = 'glass',
  animation = null,
  style = {},
  ...props 
}) => {
  const theme = KNODE_THEME;
  
  const trendColors = {
    up: theme.colors.accentGreen,
    down: '#E74C3C',
    neutral: theme.colors.textMain,
  };
  
  const trendIcons = {
    up: '↑',
    down: '↓',
    neutral: '→',
  };
  
  return (
    <Card variant={cardVariant} animation={animation} style={style} {...props}>
      <div style={{ textAlign: 'center' }}>
        {/* Icon */}
        {icon && (
          <div style={{ marginBottom: theme.spacing.cardPadding * 0.5, fontSize: 40 }}>
            {icon}
          </div>
        )}
        
        {/* Value */}
        <div
          style={{
            fontFamily: theme.fonts.header,
            fontSize: 48,
            fontWeight: 700,
            color: theme.colors.primary,
            lineHeight: 1,
            marginBottom: theme.spacing.cardPadding * 0.3,
          }}
        >
          {value}
        </div>
        
        {/* Label */}
        <Text variant="body" size="sm" color="textSecondary">
          {label}
        </Text>
        
        {/* Trend Indicator */}
        {trend && (
          <div
            style={{
              marginTop: theme.spacing.cardPadding * 0.5,
              color: trendColors[trend],
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            {trendIcons[trend]} {trend}
          </div>
        )}
      </div>
    </Card>
  );
};
