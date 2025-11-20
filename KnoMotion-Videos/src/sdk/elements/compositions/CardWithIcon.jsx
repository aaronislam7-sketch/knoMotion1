import React from 'react';
import { Card } from '../atoms/Card';
import { Icon } from '../atoms/Icon';
import { Text } from '../atoms/Text';
import { KNODE_THEME } from '../../theme/knodeTheme';

/**
 * CardWithIcon - Composition element combining Card + Icon + Text
 * 
 * @param {object} props
 * @param {string} props.iconRef - Icon reference (emoji, SVG) (STANDARDIZED)
 * @param {string} props.title - Title text (STANDARDIZED)
 * @param {string} props.text - Body text (STANDARDIZED, alternative to children)
 * @param {React.ReactNode} props.children - Additional card content (for complex markup)
 * @param {string} props.layout - 'horizontal'|'vertical'
 * @param {string} props.cardVariant - Card variant
 * @param {object} props.animation - Animation config
 * @param {object} props.style - Style overrides
 */
export const CardWithIcon = ({ 
  iconRef,
  title,
  text = null,
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
        <Icon iconRef={iconRef} size={isVertical ? 'xl' : 'lg'} />
        <div style={{ flex: 1 }}>
          <Text text={title} variant="title" size="lg" weight="bold" />
          {text && (
            <div style={{ marginTop: theme.spacing.cardPadding * 0.5 }}>
              <Text text={text} variant="body" size="md" />
            </div>
          )}
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
