import React from 'react';
import { Card } from '../atoms/Card';
import { Text } from '../atoms/Text';
import { Divider } from '../atoms/Divider';
import { KNODE_THEME } from '../../theme/knodeTheme';

/**
 * StepCard - Composition element for step-by-step instructions
 * 
 * @param {object} props
 * @param {number} props.step - Step number
 * @param {string} props.title - Step title (STANDARDIZED)
 * @param {string} props.text - Step description (STANDARDIZED, alternative to children)
 * @param {React.ReactNode} props.children - Step description/content (for complex markup)
 * @param {string} props.cardVariant - Card variant
 * @param {object} props.animation - Animation config
 * @param {object} props.style - Style overrides
 */
export const StepCard = ({ 
  step,
  title,
  text = null,
  children, 
  cardVariant = 'bordered',
  animation = null,
  style = {},
  ...props 
}) => {
  const theme = KNODE_THEME;
  
  return (
    <Card variant={cardVariant} animation={animation} style={style} {...props}>
      <div style={{ display: 'flex', gap: theme.spacing.cardPadding }}>
        {/* Step Number */}
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            backgroundColor: theme.colors.primary,
            color: theme.colors.cardBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: theme.fonts.header,
            fontSize: 24,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {step}
        </div>
        
        {/* Content */}
        <div style={{ flex: 1 }}>
          <Text text={title} variant="title" size="lg" weight="bold" />
          {(text || children) && (
            <>
              <Divider 
                orientation="horizontal" 
                thickness={1} 
                style={{ margin: `${theme.spacing.cardPadding * 0.5}px 0` }}
              />
              {text && <Text text={text} variant="body" size="md" />}
              {children && !text && children}
            </>
          )}
        </div>
      </div>
    </Card>
  );
};
