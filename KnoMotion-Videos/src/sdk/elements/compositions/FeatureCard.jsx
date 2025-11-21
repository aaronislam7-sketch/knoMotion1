import React from 'react';
import { Card } from '../atoms/Card';
import { Icon } from '../atoms/Icon';
import { Text } from '../atoms/Text';
import { Button } from '../atoms/Button';
import { KNODE_THEME } from '../../theme/knodeTheme';

/**
 * FeatureCard - Icon + Title + Description + CTA Button
 * Perfect for feature showcases and product pages
 * 
 * @param {Object} props
 * @param {string} props.iconRef - Feature icon/emoji
 * @param {string} props.title - Feature title
 * @param {string} props.text - Feature description
 * @param {string} [props.buttonText] - CTA button text
 * @param {string} [props.buttonVariant='primary'] - Button variant
 * @param {'vertical'|'horizontal'} [props.layout='vertical'] - Card layout
 * @param {string} [props.cardVariant='default'] - Card variant
 * @param {Object} [props.animation] - Animation config
 * @param {Object} [props.style] - Additional inline styles
 */
export const FeatureCard = ({
  iconRef,
  title,
  text,
  buttonText,
  buttonVariant = 'primary',
  layout = 'vertical',
  cardVariant = 'default',
  animation,
  style = {},
  ...props
}) => {
  const theme = KNODE_THEME;

  const contentStyles = {
    display: 'flex',
    flexDirection: layout === 'vertical' ? 'column' : 'row',
    gap: theme.spacing.cardPadding,
    alignItems: layout === 'vertical' ? 'center' : 'flex-start',
    textAlign: layout === 'vertical' ? 'center' : 'left',
  };

  const textContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    flex: layout === 'horizontal' ? 1 : undefined,
  };

  return (
    <Card variant={cardVariant} animation={animation} style={style} {...props}>
      <div style={contentStyles}>
        {iconRef && <Icon iconRef={iconRef} size="xl" color="primary" />}
        <div style={textContainerStyles}>
          <Text text={title} variant="title" size="lg" weight="bold" />
          <Text text={text} variant="body" size="md" color="textSecondary" />
          {buttonText && (
            <div style={{ marginTop: 10 }}>
              <Button text={buttonText} variant={buttonVariant} size="md" />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
