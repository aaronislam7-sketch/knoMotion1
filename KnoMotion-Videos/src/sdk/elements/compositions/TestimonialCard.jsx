import React from 'react';
import { Card } from '../atoms/Card';
import { Avatar } from '../atoms/Avatar';
import { Text } from '../atoms/Text';
import { Rating } from '../atoms/Rating';
import { KNODE_THEME } from '../../theme/knodeTheme';

/**
 * TestimonialCard - Avatar + Name + Role + Quote + Rating
 * Perfect for customer testimonials and reviews
 * 
 * @param {Object} props
 * @param {string} [props.imageRef] - User avatar image URL or emoji
 * @param {string} props.name - User name
 * @param {string} [props.role] - User role/title
 * @param {string} props.quote - Testimonial quote
 * @param {number} [props.rating] - Star rating (0-5)
 * @param {string} [props.cardVariant='glass'] - Card variant
 * @param {Object} [props.animation] - Animation config
 * @param {Object} [props.style] - Additional inline styles
 */
export const TestimonialCard = ({
  imageRef,
  name,
  role,
  quote,
  rating,
  cardVariant = 'glass',
  animation,
  style = {},
  ...props
}) => {
  const theme = KNODE_THEME;

  const contentStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.cardPadding,
  };

  const headerStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: 15,
  };

  const userInfoStyles = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  };

  const quoteStyles = {
    fontSize: 16,
    lineHeight: 1.6,
    fontStyle: 'italic',
    color: theme.colors.textMain,
    fontFamily: theme.fonts.body,
    position: 'relative',
    paddingLeft: 20,
    borderLeft: `3px solid ${theme.colors.primary}`,
  };

  return (
    <Card variant={cardVariant} animation={animation} style={style} {...props}>
      <div style={contentStyles}>
        <div style={headerStyles}>
          <Avatar imageRef={imageRef} text={name?.[0]} size="md" ring />
          <div style={userInfoStyles}>
            <Text text={name} variant="title" size="md" weight="bold" />
            {role && <Text text={role} variant="body" size="sm" color="textSecondary" />}
          </div>
        </div>
        
        <div style={quoteStyles}>"{quote}"</div>
        
        {rating && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Rating value={rating} size="sm" color="doodle" />
          </div>
        )}
      </div>
    </Card>
  );
};
