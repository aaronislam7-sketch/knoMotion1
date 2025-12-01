import React from 'react';
import { Card } from '../atoms/Card';
import { Text } from '../atoms/Text';
import { Icon } from '../atoms/Icon';
import { KNODE_THEME } from '../../theme/knodeTheme';

/**
 * CalloutBubble - Composition element for speech/thought bubble callouts
 * 
 * @param {Object} props
 * @param {string} props.text - Callout text content (STANDARDIZED)
 * @param {string} [props.iconRef] - Optional emoji or icon
 * @param {string} [props.shape='speech'] - Bubble shape: 'speech' | 'rounded' | 'notebook'
 * @param {string} [props.variant='default'] - Card variant
 * @param {string} [props.color] - Background color override
 * @param {Object} [props.animation] - Animation config
 * @param {Object} [props.style] - Style overrides
 */
export const CalloutBubble = ({
  text,
  iconRef,
  shape = 'speech',
  variant = 'default',
  color,
  animation,
  style = {},
  ...props
}) => {
  const theme = KNODE_THEME;
  
  // Shape configurations
  const shapeStyles = {
    speech: {
      borderRadius: theme.radii.card,
      showTail: true,
    },
    rounded: {
      borderRadius: 24,
      showTail: false,
    },
    notebook: {
      borderRadius: 16,
      showTail: false,
      border: `2px dashed ${theme.colors.textMuted}40`,
    },
  };
  
  const currentShape = shapeStyles[shape] || shapeStyles.speech;
  
  // Background color
  const backgroundColor = color 
    ? (theme.colors[color] || color)
    : theme.colors.cardBg;

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        ...style.wrapper,
      }}
      {...props}
    >
      <Card
        variant={variant}
        animation={animation}
        style={{
          backgroundColor,
          borderRadius: currentShape.borderRadius,
          border: currentShape.border || 'none',
          boxShadow: theme.shadows.card,
          ...style.card,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: iconRef ? theme.spacing.cardPadding * 0.5 : 0,
            ...style.content,
          }}
        >
          {iconRef && (
            <Icon
              iconRef={iconRef}
              size="md"
              style={style.icon}
            />
          )}
          <Text
            text={text}
            variant="body"
            size="md"
            weight={500}
            color="textMain"
            style={{
              textAlign: iconRef ? 'left' : 'center',
              ...style.text,
            }}
          />
        </div>
      </Card>
      
      {/* Speech bubble tail */}
      {currentShape.showTail && (
        <div
          style={{
            position: 'absolute',
            bottom: -12,
            left: 24,
            width: 0,
            height: 0,
            borderStyle: 'solid',
            borderWidth: '14px 10px 0 10px',
            borderColor: `${backgroundColor} transparent transparent transparent`,
            ...style.tail,
          }}
        />
      )}
    </div>
  );
};
