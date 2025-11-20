import React from 'react';
import { Card } from '../atoms/Card';
import { Icon } from '../atoms/Icon';
import { Text } from '../atoms/Text';
import { KNODE_THEME } from '../../theme/knodeTheme';

/**
 * CardWithIcon - Composition element combining Card + Icon + Text
 * 
 * @param {object} props
 * @param {React.ReactNode} props.icon - Icon content (emoji, SVG)
 * @param {string} props.title - Title text
 * @param {React.ReactNode} props.children - Additional card content
 * @param {string} props.layout - 'horizontal'|'vertical'
 * @param {string} props.cardVariant - Card variant
 * @param {object} props.animation - Animation config
 * @param {object} props.style - Style overrides
 */
export const CardWithIcon = ({ 
  icon,
  title,
  children, 
  layout = 'horizontal',
  cardVariant = 'default',
  animation = null,
  style = {},
  ...props 
}) => {
  const theme = KNODE_THEME;
  
  const isVertical = layout === 'vertical';
  
  return (
    <Card variant={cardVariant} animation={animation} style={style} {...props}>
      <div 
        style={{
          display: 'flex',
          flexDirection: isVertical ? 'column' : 'row',
          alignItems: isVertical ? 'center' : 'flex-start',
          gap: theme.spacing.cardPadding,
          textAlign: isVertical ? 'center' : 'left',
        }}
      >
        <Icon size={isVertical ? 'xl' : 'lg'}>{icon}</Icon>
        <div style={{ flex: 1 }}>
          <Text variant="title" size="lg" weight="bold">
            {title}
          </Text>
          {children && (
            <div style={{ marginTop: theme.spacing.cardPadding * 0.5 }}>
              {children}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
