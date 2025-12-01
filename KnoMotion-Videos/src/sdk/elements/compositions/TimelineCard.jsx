import React from 'react';
import { Card } from '../atoms/Card';
import { Text } from '../atoms/Text';
import { Badge } from '../atoms/Badge';
import { Icon } from '../atoms/Icon';
import { Divider } from '../atoms/Divider';
import { KNODE_THEME } from '../../theme/knodeTheme';

/**
 * TimelineCard - Composition element for timeline nodes/milestones
 * 
 * @param {Object} props
 * @param {string} props.title - Node title (STANDARDIZED)
 * @param {string} [props.subtitle] - Subtitle or date
 * @param {string} [props.description] - Additional description
 * @param {string} [props.iconRef] - Icon/emoji for the node
 * @param {string} [props.badge] - Badge text (e.g., "Step 1", "2024")
 * @param {string} [props.badgeVariant='primary'] - Badge variant
 * @param {string} [props.accentColor] - Accent color for the card
 * @param {string} [props.cardVariant='default'] - Card variant
 * @param {'up'|'down'} [props.position='up'] - Position relative to timeline axis
 * @param {Object} [props.animation] - Animation config
 * @param {Object} [props.style] - Style overrides
 */
export const TimelineCard = ({
  title,
  subtitle,
  description,
  iconRef,
  badge,
  badgeVariant = 'primary',
  accentColor,
  cardVariant = 'default',
  position = 'up',
  animation,
  style = {},
  ...props
}) => {
  const theme = KNODE_THEME;
  const accent = accentColor 
    ? (theme.colors[accentColor] || accentColor)
    : theme.colors.primary;
  
  const isDown = position === 'down';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        ...style.wrapper,
      }}
      {...props}
    >
      {/* Connector dot (top for 'down' position) */}
      {isDown && (
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: '50%',
            backgroundColor: accent,
            marginBottom: 8,
            boxShadow: `0 2px 8px ${accent}40`,
            ...style.connector,
          }}
        />
      )}

      {/* Card */}
      <Card
        variant={cardVariant}
        animation={animation}
        style={{
          borderTop: `3px solid ${accent}`,
          minWidth: 160,
          maxWidth: 280,
          ...style.card,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            textAlign: 'center',
            ...style.content,
          }}
        >
          {/* Badge */}
          {badge && (
            <Badge
              text={badge}
              variant={badgeVariant}
              size="sm"
              style={style.badge}
            />
          )}

          {/* Icon */}
          {iconRef && (
            <Icon
              iconRef={iconRef}
              size="lg"
              color="primary"
              style={style.icon}
            />
          )}

          {/* Title */}
          <Text
            text={title}
            variant="title"
            size="md"
            weight="bold"
            color="textMain"
            style={style.title}
          />

          {/* Subtitle */}
          {subtitle && (
            <Text
              text={subtitle}
              variant="body"
              size="sm"
              color="textSoft"
              style={style.subtitle}
            />
          )}

          {/* Description */}
          {description && (
            <>
              <Divider 
                orientation="horizontal" 
                thickness={1}
                style={{ width: '80%', margin: '4px 0' }}
              />
              <Text
                text={description}
                variant="body"
                size="sm"
                color="textMuted"
                style={style.description}
              />
            </>
          )}
        </div>
      </Card>

      {/* Connector dot (bottom for 'up' position) */}
      {!isDown && (
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: '50%',
            backgroundColor: accent,
            marginTop: 8,
            boxShadow: `0 2px 8px ${accent}40`,
            ...style.connector,
          }}
        />
      )}
    </div>
  );
};
