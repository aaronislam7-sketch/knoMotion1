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

import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, spring } from 'remotion';
import { InfoCard } from '../elements/compositions/InfoCard';
import { ARRANGEMENT_TYPES, calculateItemPositions, positionToCSS } from '../layout/layoutEngine';
import { fadeIn, slideIn, scaleIn, bounceIn } from '../animations/index';
import { toFrames } from '../core/time';
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
 * Map card size based on dimensions - BOOSTED for bolder text
 * Never returns 'sm' to ensure readable labels
 */
const getCardSize = (cardWidth, cardHeight) => {
  const minDim = Math.min(cardWidth, cardHeight);
  // Raised thresholds - prefer 'lg' for impact, never go below 'md'
  if (minDim < 180) return 'md'; // Was 'sm' - now minimum is 'md'
  return 'lg'; // Everything else gets 'lg' for max impact
};

/**
 * Map card variant based on style preset
 */
const getVariantForPreset = (stylePreset, cardVariant) => {
  // If explicit variant is provided, use it
  if (cardVariant && cardVariant !== 'default') return cardVariant;
  
  // Otherwise, map based on preset
  switch (stylePreset) {
    case 'playful':
      return 'gradient';
    case 'educational':
      return 'bordered';
    case 'mentor':
      return 'elevated';
    case 'focus':
      return 'glass';
    case 'minimal':
      return 'default';
    default:
      return 'elevated';
  }
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
    cardVariant = 'default',
    gap: customGap,
    beats = {},
    position,
    style = {},
  } = config;

  // Validate required fields
  if (!cards || cards.length === 0) {
    console.warn('GridCardReveal: No cards provided');
    return null;
  }

  const sequenceBeats = resolveBeats(beats, {
    start: 0.9,
    holdDuration: animationDuration,
  });
  const durationFrames = toFrames(animationDuration, fps);
  
  // Calculate dimensions from position or viewport
  const slot = {
    width: position?.width || width,
    height: position?.height || height,
    left: position?.left || 0,
    top: position?.top || 0,
  };

  // Detect mobile format for responsive adjustments
  const isMobile = height > width;

  // Auto-calculate columns based on card count and slot dimensions
  // Mobile: limit to 2 columns max for readability
  const autoColumns = Math.min(
    Math.ceil(Math.sqrt(cards.length)),
    Math.max(2, Math.floor(slot.width / 150))
  );
  const columns = customColumns 
    ? (isMobile ? Math.min(customColumns, 2) : customColumns)
    : (isMobile ? Math.min(autoColumns, 2) : autoColumns);
  const rows = Math.ceil(cards.length / columns);

  // Calculate gap and card dimensions - BOOSTED gaps for mobile
  const baseGap = customGap || Math.min(24, slot.width * 0.025);
  const gap = isMobile ? Math.max(baseGap, 16) : baseGap;
  const cardWidth = (slot.width - gap * (columns + 1)) / columns;
  
  // Calculate content-aware card height instead of filling the slot
  // Cards should wrap their content, not stretch to fill available space
  const maxCardHeightFromSlot = (slot.height - gap * (rows + 1)) / rows;
  
  // Estimate content height based on icon + label
  // Icon: typically 48-80px, Label: ~30-40px with padding
  const estimatedIconHeight = Math.min(80, cardWidth * 0.4);
  const estimatedLabelHeight = showLabels ? 45 : 0;
  const estimatedPadding = 32;
  const estimatedContentHeight = estimatedIconHeight + estimatedLabelHeight + estimatedPadding;
  
  // Use the smaller of content-based height or slot-based height
  // This prevents cards from being oversized while still allowing them to fill smaller slots
  const cardHeight = Math.min(maxCardHeightFromSlot, Math.max(estimatedContentHeight, 120));
  
  // Determine card size preset based on dimensions - bias toward larger
  const getCardSizePreset = () => {
    const minDim = Math.min(cardWidth, cardHeight);
    if (minDim >= 250) return 'lg';
    if (minDim >= 150) return 'md';
    return 'md'; // Never go to 'sm' - keep text readable
  };
  const cardSizePreset = getCardSizePreset();

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

  // Map the cardVariant to the InfoCard-compatible variant
  const resolvedCardVariant = getVariantForPreset(stylePreset, cardVariant);

  // Calculate total grid height for centering
  const totalGridHeight = rows * cardHeight + (rows - 1) * gap;
  const verticalOffset = Math.max(0, (slot.height - totalGridHeight) / 2);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: slot.left,
          top: slot.top + verticalOffset,
          width: slot.width,
          height: totalGridHeight,
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
          
          // Only apply exit animation if explicitly configured with an exit beat
          // Cards should persist by default (stay visible after appearing)
          const hasExplicitExit = card.beats?.exit !== undefined || beats?.exit !== undefined;
          let mergedAnimStyle = animStyle;
          
          if (hasExplicitExit) {
            const exitFrame = toFrames(itemBeats.exit, fps);
            const exitProgress =
              frame > exitFrame
                ? Math.min(1, (frame - exitFrame) / toFrames(0.8, fps)) // Slower exit (0.8s)
                : 0;
            mergedAnimStyle = {
              ...animStyle,
              opacity: (animStyle.opacity ?? 1) * (1 - exitProgress),
            };
          }
          
          // Convert position to CSS (layout engine returns center coordinates)
          const cardPosition = positionToCSS(pos);
          const currentCardWidth = pos.width || cardWidth;
          const currentCardHeight = pos.height || cardHeight;
          const cardSize = getCardSize(currentCardWidth, currentCardHeight);

          return (
            <div
              key={index}
              style={{
                ...cardPosition,
                ...style.cardWrapper,
              }}
            >
              <div
                style={{
                  opacity: mergedAnimStyle.opacity,
                  transform: mergedAnimStyle.transform,
                  clipPath: mergedAnimStyle.clipPath || 'none',
                  width: '100%',
                  height: '100%',
                }}
              >
                <InfoCard
                  icon={card.icon}
                  image={card.image}
                  imageRounded={card.imageRounded}
                  label={showLabels ? card.label : undefined}
                  sublabel={showLabels ? card.sublabel : undefined}
                  animated={card.animated !== false} // Always animate icons unless explicitly disabled
                  accentColor={card.color}
                  // Let InfoCard auto-detect layout: horizontal for icons (side-by-side), vertical for images
                  layout={card.layout}
                  variant={card.variant || resolvedCardVariant}
                  size={cardSize}
                  cardWidth={currentCardWidth}
                  cardHeight={currentCardHeight}
                  stylePreset={stylePreset}
                  style={{
                    width: '100%',
                    height: '100%',
                    ...style.card,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export default GridCardReveal;
