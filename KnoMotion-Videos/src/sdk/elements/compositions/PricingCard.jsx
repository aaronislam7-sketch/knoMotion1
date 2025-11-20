import React from 'react';
import { Card } from '../atoms/Card';
import { Badge } from '../atoms/Badge';
import { Text } from '../atoms/Text';
import { Button } from '../atoms/Button';
import { Divider } from '../atoms/Divider';
import { KNODE_THEME } from '../../theme/knodeTheme';

/**
 * PricingCard - Price + Features + CTA for pricing tables
 * 
 * @param {Object} props
 * @param {string} props.title - Plan name (e.g., "Pro", "Enterprise")
 * @param {string} props.price - Price display (e.g., "$99/mo")
 * @param {string} [props.badgeText] - Optional badge (e.g., "Popular")
 * @param {string} [props.badgeVariant='primary'] - Badge variant
 * @param {string[]} props.features - Array of feature strings
 * @param {string} [props.buttonText='Get Started'] - CTA button text
 * @param {string} [props.buttonVariant='primary'] - Button variant
 * @param {boolean} [props.highlighted=false] - Highlight this card
 * @param {Object} [props.animation] - Animation config
 * @param {Object} [props.style] - Additional inline styles
 */
export const PricingCard = ({
  title,
  price,
  badgeText,
  badgeVariant = 'primary',
  features = [],
  buttonText = 'Get Started',
  buttonVariant = 'primary',
  highlighted = false,
  animation,
  style = {},
  ...props
}) => {
  const theme = KNODE_THEME;

  const cardVariant = highlighted ? 'glass' : 'bordered';
  
  const contentStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.cardPadding,
    textAlign: 'center',
    ...(highlighted && {
      border: `2px solid ${theme.colors.primary}`,
      borderRadius: theme.radii.card,
      padding: theme.spacing.cardPadding,
    }),
  };

  const headerStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    alignItems: 'center',
  };

  const priceStyles = {
    fontSize: 48,
    fontWeight: 700,
    fontFamily: theme.fonts.marker,
    color: theme.colors.primary,
  };

  const featuresListStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    listStyle: 'none',
    padding: 0,
    margin: '15px 0',
  };

  const featureItemStyles = {
    fontSize: 14,
    color: theme.colors.textMain,
    fontFamily: theme.fonts.body,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  };

  return (
    <Card variant={cardVariant} animation={animation} style={style} {...props}>
      <div style={contentStyles}>
        <div style={headerStyles}>
          {badgeText && <Badge text={badgeText} variant={badgeVariant} size="sm" />}
          <Text text={title} variant="title" size="xl" weight="bold" />
          <div style={priceStyles}>{price}</div>
        </div>

        <Divider thickness={1} color="textSecondary" length="100%" />

        <ul style={featuresListStyles}>
          {features.map((feature, index) => (
            <li key={index} style={featureItemStyles}>
              <span style={{ color: theme.colors.accentGreen }}>✓</span>
              {feature}
            </li>
          ))}
        </ul>

        <div style={{ marginTop: 10 }}>
          <Button text={buttonText} variant={buttonVariant} size="lg" />
        </div>
      </div>
    </Card>
  );
};
