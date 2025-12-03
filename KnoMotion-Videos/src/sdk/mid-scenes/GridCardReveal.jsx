/**
 * GridCardReveal - Mid-Scene Component
 * 
 * Renders mini-cards in a grid layout with image/icon and label.
 * Features mask or slide reveal animations with staggered entrance.
 * All configurable via JSON - pre-built for LLM JSON generation.
 * 
 * @module mid-scenes/GridCardReveal
 * @category SDK
 * @subcategory Mid-Scenes
 */

import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, spring } from 'remotion';
import { Text } from '../elements/atoms/Text';
import { Icon } from '../elements/atoms/Icon';
import { ImageAtom } from '../elements/atoms/Image';
import { ARRANGEMENT_TYPES, calculateItemPositions, positionToCSS } from '../layout/layoutEngine';
import { fadeIn, slideIn, scaleIn, bounceIn } from '../animations/index';
import { toFrames } from '../core/time';
import { KNODE_THEME } from '../theme/knodeTheme';
import { resolveStylePreset } from '../theme/stylePresets';
import { resolveBeats } from '../utils/beats';

/**
 * Card reveal animation styles
 */
const getCardAnimationStyle = (animationType, frame, startFrame, durationFrames, fps, direction = 'up', rowCol = { row: 0, col: 0 }) => {
  switch (animationType) {
    case 'slide':
    case 'slideIn':
      return slideIn(frame, startFrame, durationFrames, direction, 60);
    
    case 'scale':
    case 'scaleIn':
      return scaleIn(frame, startFrame, durationFrames, 0);
    
    case 'bounce':
    case 'bounceIn':
      return bounceIn(frame, startFrame, durationFrames);
    
    case 'flip': {
      const progress = spring({
        frame: Math.max(0, frame - startFrame),
        fps,
        config: { damping: 15, mass: 1, stiffness: 100 },
      });
      const rotateY = interpolate(progress, [0, 1], [-90, 0]);
      return {
        opacity: progress > 0.1 ? 1 : 0,
        transform: `perspective(1000px) rotateY(${rotateY}deg)`,
      };
    }
    
    case 'mask': {
      // Circular mask reveal
      const progress = spring({
        frame: Math.max(0, frame - startFrame),
        fps,
        config: { damping: 20, mass: 1, stiffness: 120 },
      });
      const maskSize = progress * 150; // percentage
      return {
        opacity: 1,
        clipPath: `circle(${maskSize}% at 50% 50%)`,
        transform: 'none',
      };
    }
    
    case 'cascade': {
      // Diagonal cascade based on row + column
      const cascadeDelay = (rowCol.row + rowCol.col) * 3;
      const adjustedStart = startFrame + cascadeDelay;
      const progress = spring({
        frame: Math.max(0, frame - adjustedStart),
        fps,
        config: { damping: 12, mass: 1, stiffness: 150 },
      });
      return {
        opacity: progress,
        transform: `translateY(${(1 - progress) * 30}px) scale(${0.8 + progress * 0.2})`,
      };
    }
    
    case 'fade':
    case 'fadeIn':
    default:
      return fadeIn(frame, startFrame, durationFrames);
  }
};

/**
 * Individual Grid Card Component
 */
const GridCard = ({
  card,
  cardPosition,
  cardWidth,
  cardHeight,
  animStyle,
  baseFontSize,
  cardStyle,
  showLabels,
  labelPosition,
  cardVariant,
  resolveColor,
  style = {},
  beats,
  textColor = 'textMain',
}) => {
  const hasIcon = card.icon && !card.image;
  const hasImage = card.image;
  const hasLabel = showLabels && card.label;
  
  const iconSize = Math.min(cardWidth, cardHeight) * 0.5;
  const imageSize = hasLabel 
    ? Math.min(cardWidth, cardHeight) * 0.65 
    : Math.min(cardWidth, cardHeight) * 0.85;

  // Card background color
  const cardBg = resolveColor(card.backgroundColor || 'cardBg', KNODE_THEME.colors.cardBg);
  const cardBorder = resolveColor(card.borderColor, null);
  const iconColor = resolveColor(card.color || 'primary', KNODE_THEME.colors.primary);

  // Card variant styles
  const variantStyles = {
    default: {
      backgroundColor: cardBg,
      boxShadow: KNODE_THEME.shadows.soft,
      border: 'none',
    },
    bordered: {
      backgroundColor: cardBg,
      boxShadow: 'none',
      border: `2px solid ${cardBorder || KNODE_THEME.colors.ruleLine}`,
    },
    glass: {
      backgroundColor: `${cardBg}CC`,
      boxShadow: KNODE_THEME.shadows.card,
      backdropFilter: 'blur(10px)',
      border: `1px solid ${KNODE_THEME.colors.cardBg}40`,
    },
    flat: {
      backgroundColor: cardBg,
      boxShadow: 'none',
      border: 'none',
    },
    elevated: {
      backgroundColor: cardBg,
      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      border: 'none',
    },
  };

  const currentVariant = variantStyles[card.variant || cardVariant] || variantStyles.default;

  return (
    <div
      style={{
        ...cardPosition,
        ...style.cardWrapper,
      }}
    >
      <div
        style={{
          opacity: animStyle.opacity,
          transform: animStyle.transform,
          clipPath: animStyle.clipPath || 'none',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: labelPosition === 'bottom' ? 'column' : 'column-reverse',
          alignItems: 'center',
          justifyContent: 'center',
          gap: baseFontSize * 0.4,
          padding: baseFontSize * 0.5,
          boxSizing: 'border-box',
          borderRadius: KNODE_THEME.radii.card,
          ...currentVariant,
          ...cardStyle,
          ...style.card,
        }}
      >
        {/* Image or Icon */}
        {hasImage ? (
          <div
            style={{
              width: imageSize,
              height: imageSize,
              flexShrink: 0,
              ...style.imageWrapper,
            }}
          >
            <ImageAtom
              src={card.image}
              fit={card.imageFit || 'cover'}
              borderRadius={card.imageRounded ? imageSize : 12}
              beats={card.imageBeats || beats}
              animation={card.imageAnimation || { type: 'fade', duration: 0.5 }}
              style={{
                width: '100%',
                height: '100%',
                ...style.image,
              }}
            />
          </div>
        ) : hasIcon ? (
          <Icon
            iconRef={card.icon}
            size="lg"
            color={card.color || 'primary'}
            animated={card.animated}
            style={{
              fontSize: iconSize,
              color: iconColor,
              ...style.icon,
            }}
          />
        ) : null}

        {/* Label */}
        {hasLabel && (
          <div style={{ textAlign: 'center', maxWidth: '90%' }}>
            <Text
              text={card.label}
              variant="body"
              size="sm"
              weight={600}
              color={textColor}
              style={{
                fontSize: baseFontSize * 0.7,
                textAlign: 'center',
                lineHeight: 1.2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: card.wrapLabel ? 'normal' : 'nowrap',
                ...style.label,
              }}
            />
            {/* Sublabel */}
            {card.sublabel && (
              <Text
                text={card.sublabel}
                variant="body"
                size="sm"
                weight={400}
                color="textSoft"
                style={{
                  fontSize: baseFontSize * 0.55,
                  textAlign: 'center',
                  lineHeight: 1.3,
                  marginTop: 4,
                  opacity: 0.8,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: card.wrapLabel ? 'normal' : 'nowrap',
                  ...style.sublabel,
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * GridCardReveal Component
 * 
 * @param {Object} props
 * @param {Object} props.config - JSON configuration
 * @param {Array} props.config.cards - Array of card items (required)
 * @param {string} props.config.cards[].icon - Icon/emoji for the card
 * @param {string} props.config.cards[].image - Image URL for the card
 * @param {boolean} props.config.cards[].imageRounded - Make image circular (default: false)
 * @param {string} props.config.cards[].label - Label text below icon/image
 * @param {string} props.config.cards[].sublabel - Secondary label text below the label (optional)
 * @param {string} props.config.cards[].color - Custom icon color
 * @param {string} props.config.cards[].backgroundColor - Custom card background
 * @param {string} props.config.cards[].borderColor - Custom border color (for bordered variant)
 * @param {string} props.config.cards[].variant - Card variant override
 * @param {boolean} props.config.cards[].wrapLabel - Allow label text to wrap (default: false)
 * @param {number} props.config.columns - Number of columns (default: auto-calculated)
 * @param {number} props.config.rows - Number of rows (optional, calculated from cards)
 * @param {string} props.config.animation - Animation type: 'fade' | 'slide' | 'scale' | 'bounce' | 'flip' | 'mask' | 'cascade' (default: 'cascade')
 * @param {string} props.config.direction - Direction for slide animation: 'up' | 'down' | 'left' | 'right' (default: 'up')
 * @param {number} props.config.staggerDelay - Delay between cards in seconds (default: 0.1)
 * @param {number} props.config.animationDuration - Animation duration per card in seconds (default: 0.4)
 * @param {boolean} props.config.showLabels - Show labels on cards (default: true)
 * @param {string} props.config.labelPosition - Label position: 'bottom' | 'top' (default: 'bottom')
 * @param {string} props.config.cardVariant - Default card variant: 'default' | 'bordered' | 'glass' | 'flat' | 'elevated' (default: 'default')
 * @param {number} props.config.gap - Gap between cards in pixels (default: auto-calculated)
 * @param {Object} props.config.beats - Beat timings
 * @param {number} props.config.beats.start - Start beat in seconds (required)
 * @param {Object} props.config.position - Slot position from layout resolver
 * @param {Object} props.config.style - Optional style overrides
 */
export const GridCardReveal = ({ config, stylePreset }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  
  const {
    cards = [],
    columns: customColumns,
    animation = 'cascade',
    direction = 'up',
    staggerDelay = 0.1,
    animationDuration = 0.4,
    showLabels = true,
    labelPosition = 'bottom',
    cardVariant = 'default',
    gap: customGap,
    beats = {},
    position,
    style = {},
  } = config;
  const preset = resolveStylePreset(stylePreset);

  // Validate required fields
  if (!cards || cards.length === 0) {
    console.warn('GridCardReveal: No cards provided');
    return null;
  }

  const sequenceBeats = resolveBeats(beats, {
    start: 0.9,
    holdDuration: animationDuration,
  });
  const startFrame = toFrames(sequenceBeats.start, fps);
  const staggerFrames = toFrames(staggerDelay, fps);
  const durationFrames = toFrames(animationDuration, fps);
  
  // Calculate dimensions from position or viewport
  const slot = {
    width: position?.width || width,
    height: position?.height || height,
    left: position?.left || 0,
    top: position?.top || 0,
  };

  // Auto-calculate columns based on card count and slot dimensions
  const columns = customColumns || Math.min(
    Math.ceil(Math.sqrt(cards.length)),
    Math.max(2, Math.floor(slot.width / 150))
  );
  const rows = Math.ceil(cards.length / columns);

  // Calculate gap and card dimensions
  const gap = customGap || Math.min(20, slot.width * 0.02);
  const cardWidth = (slot.width - gap * (columns + 1)) / columns;
  const cardHeight = (slot.height - gap * (rows + 1)) / rows;

  // Calculate base font size
  const baseFontSize = Math.min(24, Math.max(12, Math.min(cardWidth, cardHeight) / 5));

  // Resolve colors from theme
  const resolveColor = (colorKey, fallback = null) => {
    if (!colorKey) return fallback;
    if (colorKey.startsWith('#') || colorKey.startsWith('rgb')) return colorKey;
    return KNODE_THEME.colors[colorKey] || fallback;
  };

  // Calculate positions using layout engine
  const layoutConfig = {
    arrangement: ARRANGEMENT_TYPES.GRID,
    viewport: { width: slot.width, height: slot.height },
    columns,
    gap,
    itemWidth: cardWidth,
    itemHeight: cardHeight,
    centerGrid: true,
  };

  const positions = calculateItemPositions(cards, layoutConfig);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: slot.left,
          top: slot.top,
          width: slot.width,
          height: slot.height,
          ...style.container,
        }}
      >
        {positions.map((pos, index) => {
          const card = cards[index];
          if (!card) return null;

          // Get row/column for cascade effect
          const row = pos.row ?? Math.floor(index / columns);
          const col = pos.column ?? index % columns;

          // Calculate animation timing for this card
          const itemBeats = resolveBeats(card.beats, {
            start: sequenceBeats.start + index * staggerDelay,
            holdDuration: animationDuration,
          });
          const baseStartFrame = toFrames(itemBeats.start, fps);
          const cardStartFrame = animation === 'cascade'
            ? baseStartFrame
            : baseStartFrame;

          const animStyle = getCardAnimationStyle(
            animation,
            frame,
            cardStartFrame,
            durationFrames,
            fps,
            direction,
            { row, col }
          );
          const exitFrame = toFrames(itemBeats.exit, fps);
          const exitProgress =
            frame > exitFrame
              ? Math.min(1, (frame - exitFrame) / toFrames(0.25, fps))
              : 0;
          const mergedAnimStyle = {
            ...animStyle,
            opacity: (animStyle.opacity ?? 1) * (1 - exitProgress),
          };
          // Convert position to CSS (layout engine returns center coordinates)
          const cardPosition = positionToCSS(pos);

          return (
            <GridCard
              key={index}
              card={card}
              cardPosition={cardPosition}
              cardWidth={pos.width || cardWidth}
              cardHeight={pos.height || cardHeight}
              animStyle={mergedAnimStyle}
              baseFontSize={baseFontSize}
              cardStyle={style.cardStyle}
              showLabels={showLabels}
              labelPosition={labelPosition}
              cardVariant={cardVariant}
              resolveColor={resolveColor}
              style={style}
              beats={card.imageBeats || itemBeats}
              textColor={preset.textColor}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export default GridCardReveal;
