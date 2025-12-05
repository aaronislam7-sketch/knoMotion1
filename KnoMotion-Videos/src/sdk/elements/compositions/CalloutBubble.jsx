import React from 'react';
import { Text } from '../atoms/Text';
import { Icon } from '../atoms/Icon';
import { KNODE_THEME } from '../../theme/knodeTheme';

/**
 * CalloutBubble - Beautiful, on-brand speech/thought bubble callouts
 * 
 * Styled to match the KnoMotion aesthetic with:
 * - Soft gradients and glows
 * - Prominent, animated icons
 * - Clean, readable typography
 * - Subtle decorative accents
 * 
 * @param {Object} props
 * @param {string} props.text - Callout text content (STANDARDIZED)
 * @param {string} [props.iconRef] - Optional emoji or icon
 * @param {string} [props.shape='rounded'] - Bubble shape: 'speech' | 'rounded' | 'notebook' | 'pill'
 * @param {string} [props.variant='default'] - Visual variant: 'default' | 'glass' | 'accent'
 * @param {string} [props.color] - Accent color override
 * @param {Object} [props.animation] - Animation config
 * @param {Object} [props.style] - Style overrides
 */
export const CalloutBubble = ({
  text,
  iconRef,
  animated = true, // Icons animate by default
  shape = 'rounded',
  variant = 'default',
  color,
  animation,
  style = {},
  ...props
}) => {
  const theme = KNODE_THEME;
  
  // Resolve accent color
  const accentColor = color 
    ? (theme.colors[color] || color)
    : theme.colors.doodle;
  
  // Shape configurations - more modern, softer shapes
  const shapeStyles = {
    speech: {
      borderRadius: 20,
      showTail: true,
    },
    rounded: {
      borderRadius: 24,
      showTail: false,
    },
    notebook: {
      borderRadius: 16,
      showTail: false,
    },
    pill: {
      borderRadius: 999,
      showTail: false,
    },
  };
  
  const currentShape = shapeStyles[shape] || shapeStyles.rounded;
  
  // Variant styles - beautiful, on-brand looks
  const getVariantStyles = () => {
    switch (variant) {
      case 'glass':
        return {
          background: `linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)`,
          backdropFilter: 'blur(10px)',
          boxShadow: `0 8px 32px rgba(0,0,0,0.08), 0 0 0 1px ${accentColor}15, inset 0 1px 0 rgba(255,255,255,0.8)`,
        };
      case 'accent':
        return {
          background: `linear-gradient(135deg, ${accentColor}15 0%, ${accentColor}08 100%)`,
          boxShadow: `0 6px 24px ${accentColor}20, 0 0 0 1px ${accentColor}20`,
        };
      default:
        return {
          background: `linear-gradient(145deg, ${theme.colors.cardBg} 0%, #FAFAFA 100%)`,
          boxShadow: `0 6px 20px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9)`,
        };
    }
  };
  
  const variantStyles = getVariantStyles();
  
  // Calculate if we have an icon for layout
  const hasIcon = !!iconRef;

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        ...style.wrapper,
      }}
      {...props}
    >
      {/* Main bubble container */}
      <div
        style={{
          ...variantStyles,
          borderRadius: currentShape.borderRadius,
          padding: hasIcon ? '16px 20px' : '14px 24px',
          minWidth: 100,
          maxWidth: 320,
          ...style.card,
        }}
      >
        {/* Decorative accent bar at top */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '30%',
            height: 3,
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
            borderRadius: '0 0 3px 3px',
            opacity: 0.6,
          }}
        />
        
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: hasIcon ? 14 : 0,
            ...style.content,
          }}
        >
          {hasIcon && (
            <div
              style={{
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: `${accentColor}12`,
                boxShadow: `0 0 16px ${accentColor}15`,
              }}
            >
              <Icon
                iconRef={iconRef}
                size="lg"
                animated={animated}
                style={{ fontSize: 28, ...style.icon }}
              />
            </div>
          )}
          <Text
            text={text}
            variant="body"
            size="md"
            weight={600}
            color="textMain"
            style={{
              fontSize: 20,
              lineHeight: 1.4,
              textAlign: hasIcon ? 'left' : 'center',
              letterSpacing: '-0.01em',
              ...style.text,
            }}
          />
        </div>
      </div>
      
      {/* Speech bubble tail - more elegant curved style */}
      {currentShape.showTail && (
        <svg
          width="24"
          height="16"
          viewBox="0 0 24 16"
          style={{
            position: 'absolute',
            bottom: -14,
            left: 28,
            ...style.tail,
          }}
        >
          <path
            d="M0 0 C8 0, 12 8, 12 16 C12 8, 16 0, 24 0 Z"
            fill={theme.colors.cardBg}
          />
        </svg>
      )}
    </div>
  );
};
