/**
 * CardSequence - Mid-Scene Component
 * 
 * Renders multiple cards in sequence with stagger animations.
 * Combines Card elements with entrance animations and layout engine positioning.
 * All configurable via JSON - pre-built for LLM JSON generation.
 * 
 * @module mid-scenes/CardSequence
 * @category SDK
 * @subcategory Mid-Scenes
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';
import { Card } from '../elements/atoms/Card';
import { Text } from '../elements/atoms/Text';
import { ARRANGEMENT_TYPES, calculateItemPositions, positionToCSS } from '../layout/layoutEngine';
import { fadeIn, slideIn, scaleIn, fadeSlide } from '../animations/index';
import { toFrames } from '../core/time';
import { KNODE_THEME } from '../theme/knodeTheme';

/**
 * Get animation style based on animation type
 * 
 * @param {string} animationType - Type of animation (fadeIn, slideIn, etc.)
 * @param {number} frame - Current frame
 * @param {number} startFrame - Start frame for animation
 * @param {number} durationFrames - Duration in frames
 * @param {string} direction - Direction for slide animations
 * @returns {Object} Style object with opacity and transform
 */
const getAnimationStyle = (animationType, frame, startFrame, durationFrames, direction = 'up') => {
  switch (animationType) {
    case 'fadeIn':
      return fadeIn(frame, startFrame, durationFrames);
    case 'slideIn':
      return slideIn(frame, startFrame, durationFrames, direction, 50);
    case 'scaleIn':
      return scaleIn(frame, startFrame, durationFrames, 0.3);
    case 'fadeSlide':
      return fadeSlide(frame, startFrame, durationFrames, direction, 40);
    default:
      return { opacity: 1, transform: 'none' };
  }
};

/**
 * CardSequence Component
 * 
 * @param {Object} props
 * @param {Object} props.config - JSON configuration
 * @param {Array} props.config.cards - Array of card configurations (required)
 * @param {string} props.config.layout - Layout type: 'stacked' | 'grid' (default: 'stacked')
 * @param {number} props.config.columns - Number of columns for grid layout (default: 3)
 * @param {string} props.config.animation - Entrance animation type (optional)
 * @param {number} props.config.staggerDelay - Delay between cards in seconds (default: 0.15)
 * @param {number} props.config.animationDuration - Animation duration in seconds (default: 0.6)
 * @param {Object} props.config.beats - Beat timings
 * @param {number} props.config.beats.start - Start beat in seconds (required)
 * @param {Object} props.config.position - Optional position override (uses layout engine)
 * @param {Object} props.config.style - Optional style overrides
 */
export const CardSequence = ({ config }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const {
    cards = [],
    layout = 'stacked',
    columns = 3,
    animation = 'fadeSlide',
    staggerDelay = 0.15,
    animationDuration = 0.6,
    beats = {},
    position,
    style = {},
  } = config;

  // Validate required fields
  if (!cards || cards.length === 0) {
    console.warn('CardSequence: No cards provided');
    return null;
  }

  const { start = 1.0 } = beats;
  const startFrame = toFrames(start, fps);
  const staggerFrames = toFrames(staggerDelay, fps);
  const durationFrames = toFrames(animationDuration, fps);
  const viewport = { width, height };

  // Calculate positions using layout engine
  const arrangement = layout === 'grid' ? ARRANGEMENT_TYPES.GRID : ARRANGEMENT_TYPES.STACKED_VERTICAL;
  
  const layoutConfig = {
    arrangement,
    viewport,
    ...(layout === 'grid' && {
      columns,
      gap: 40,
      itemWidth: 400,
      itemHeight: 300,
      centerGrid: true,
    }),
    ...(layout === 'stacked' && {
      spacing: 40,
      basePosition: 'center',
    }),
    ...(position && { area: position }),
  };

  const positions = calculateItemPositions(cards, layoutConfig);

  return (
    <AbsoluteFill>
      {positions.map((pos, index) => {
        const card = cards[index];
        if (!card) return null;

        const cardStartFrame = startFrame + index * staggerFrames;
        const animStyle = getAnimationStyle(
          animation,
          frame,
          cardStartFrame,
          durationFrames,
          'up'
        );

        // Get card position - use layout engine position or default
        const cardPosition = positionToCSS(pos);

        return (
          <div
            key={index}
            style={{
              ...cardPosition,
              opacity: animStyle.opacity,
              transform: animStyle.transform,
              ...style.card,
            }}
          >
            <Card
              variant={card.variant || 'default'}
              size={card.size || 'md'}
              style={{
                width: layout === 'grid' ? (pos.width || 400) : '100%',
                maxWidth: layout === 'grid' ? (pos.width || 400) : 600,
                ...card.style,
              }}
            >
              {card.title && (
                <Text
                  text={card.title}
                  variant="title"
                  size="lg"
                  weight="bold"
                  color="primary"
                  style={{ marginBottom: 12, ...card.titleStyle }}
                />
              )}
              {card.content && (
                <Text
                  text={card.content}
                  variant="body"
                  size="md"
                  weight="normal"
                  color="textMain"
                  style={card.contentStyle}
                />
              )}
              {card.children && card.children}
            </Card>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export default CardSequence;
