import React from 'react';
import { Icon } from '../atoms/Icon';
import { Text } from '../atoms/Text';
import { Button } from '../atoms/Button';
import { Divider } from '../atoms/Divider';
import { KNODE_THEME } from '../../theme/knodeTheme';

/**
 * HeroWithCTA - Large hero section with icon, title, subtitle, and CTA button
 * Extended version of HeroWithText with button
 * 
 * @param {Object} props
 * @param {string} props.heroRef - Hero icon/emoji/image
 * @param {string} props.title - Main title
 * @param {string} [props.subtitle] - Subtitle/tagline
 * @param {string} [props.buttonText] - CTA button text
 * @param {string} [props.buttonVariant='primary'] - Button variant
 * @param {'vertical'|'horizontal'} [props.layout='vertical'] - Layout direction
 * @param {Object} [props.animation] - Animation config (staggered)
 * @param {Object} [props.style] - Additional inline styles
 */
export const HeroWithCTA = ({
  heroRef,
  title,
  subtitle,
  buttonText,
  buttonVariant = 'primary',
  layout = 'vertical',
  animation,
  style = {},
  ...props
}) => {
  const theme = KNODE_THEME;

  const isVertical = layout === 'vertical';

  const containerStyles = {
    display: 'flex',
    flexDirection: isVertical ? 'column' : 'row',
    alignItems: isVertical ? 'center' : 'flex-start',
    gap: theme.spacing.cardPadding * 1.5,
    textAlign: isVertical ? 'center' : 'left',
    ...style,
  };

  const textContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: isVertical ? 'center' : 'flex-start',
    gap: 15,
    flex: isVertical ? undefined : 1,
  };

  const titleStyles = {
    fontSize: isVertical ? 56 : 48,
    fontWeight: 700,
    fontFamily: theme.fonts.marker,
    color: theme.colors.primary,
    lineHeight: 1.2,
  };

  const subtitleStyles = {
    fontSize: isVertical ? 24 : 20,
    fontWeight: 400,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    lineHeight: 1.5,
  };

  const dividerLength = isVertical ? 200 : '100%';

  return (
    <div style={containerStyles} {...props}>
      {heroRef && <Icon iconRef={heroRef} size="xl" />}
      
      <div style={textContainerStyles}>
        <div style={titleStyles}>{title}</div>
        
        <Divider
          orientation="horizontal"
          thickness={3}
          color="primary"
          length={dividerLength}
        />
        
        {subtitle && <div style={subtitleStyles}>{subtitle}</div>}
        
        {buttonText && (
          <div style={{ marginTop: 10 }}>
            <Button text={buttonText} variant={buttonVariant} size="lg" />
          </div>
        )}
      </div>
    </div>
  );
};
