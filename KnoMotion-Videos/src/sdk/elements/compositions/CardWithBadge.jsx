import React from 'react';
import { Badge } from '../atoms/Badge';
import { Card } from '../atoms/Card';

/**
 * CardWithBadge - Composition element combining Card + Badge
 * 
 * @param {object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.badge - Badge text
 * @param {string} props.badgeVariant - Badge variant
 * @param {string} props.badgePosition - 'top-right'|'top-left'|'bottom-right'|'bottom-left'
 * @param {string} props.cardVariant - Card variant
 * @param {object} props.animation - Animation config (applied to both)
 * @param {object} props.style - Style overrides for container
 */
export const CardWithBadge = ({ 
  children, 
  badge,
  badgeVariant = 'primary',
  badgePosition = 'top-right',
  cardVariant = 'default',
  animation = null,
  style = {},
  ...props 
}) => {
  // Position styles for badge
  const positions = {
    'top-right': { top: -10, right: -10 },
    'top-left': { top: -10, left: -10 },
    'bottom-right': { bottom: -10, right: -10 },
    'bottom-left': { bottom: -10, left: -10 },
  };
  
  return (
    <div style={{ position: 'relative', ...style }} {...props}>
      <Card variant={cardVariant} animation={animation}>
        {children}
      </Card>
      {badge && (
        <div style={{ position: 'absolute', ...positions[badgePosition] }}>
          <Badge variant={badgeVariant} size="sm">
            {badge}
          </Badge>
        </div>
      )}
    </div>
  );
};
