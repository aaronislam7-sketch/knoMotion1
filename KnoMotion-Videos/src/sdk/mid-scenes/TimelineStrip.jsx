/**
 * TimelineStrip - Mid-Scene Component
 * 
 * Renders a horizontal timeline with staggered up/down cards.
 * Uses SDK TimelineCard composition for consistent styling.
 * Each node supports its own beats configuration for precise timing control.
 * 
 * @module mid-scenes/TimelineStrip
 * @category SDK
 * @subcategory Mid-Scenes
 */

import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import { TimelineCard } from '../elements/compositions/TimelineCard';
import { Divider } from '../elements/atoms/Divider';
import { fadeIn, slideIn, scaleIn, bounceIn, staggerIn, drawLine } from '../animations/index';
import { toFrames } from '../core/time';
import { KNODE_THEME } from '../theme/knodeTheme';

/**
 * Get animation style for timeline cards
 */
const getCardAnimationStyle = (animationType, frame, startFrame, durationFrames, fps, direction) => {
  switch (animationType) {
    case 'slide':
      return slideIn(frame, startFrame, durationFrames, direction, 50);
    
    case 'scale':
      return scaleIn(frame, startFrame, durationFrames, 0.5);
    
    case 'bounce':
      return bounceIn(frame, startFrame, durationFrames);
    
    case 'fade':
    default:
      return fadeIn(frame, startFrame, durationFrames);
  }
};

/**
 * Calculate connector line progress
 */
const getConnectorProgress = (frame, startFrame, durationFrames) => {
  return drawLine(frame, startFrame, durationFrames);
};

/**
 * TimelineStrip Component
 * 
 * @param {Object} props
 * @param {Object} props.config - JSON configuration
 * @param {Array} props.config.events - Array of timeline events (required)
 * @param {string} props.config.events[].title - Event title
 * @param {string} [props.config.events[].subtitle] - Subtitle or date
 * @param {string} [props.config.events[].description] - Additional description
 * @param {string} [props.config.events[].icon] - Optional emoji/icon
 * @param {string} [props.config.events[].badge] - Badge text (e.g., "Step 1")
 * @param {string} [props.config.events[].color] - Accent color for this node
 * @param {Object} [props.config.events[].beats] - Per-node beat timing { start }
 * @param {string} [props.config.animation='slide'] - Animation type: 'slide' | 'scale' | 'bounce' | 'fade'
 * @param {number} [props.config.staggerDelay=0.4] - Default delay between nodes in seconds
 * @param {number} [props.config.animationDuration=0.5] - Animation duration per node in seconds
 * @param {boolean} [props.config.showConnectors=true] - Show connecting line
 * @param {string} [props.config.connectorColor='textMuted'] - Connector line color
 * @param {string} [props.config.cardVariant='default'] - Card variant for all cards
 * @param {Object} props.config.beats - Global beat timings
 * @param {number} props.config.beats.start - Start time in seconds (required)
 * @param {Object} [props.config.position] - Slot position from layout resolver
 * @param {Object} [props.config.style] - Optional style overrides
 */
export const TimelineStrip = ({ config }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  
  const {
    events = [],
    animation = 'slide',
    staggerDelay = 0.4,
    animationDuration = 0.5,
    showConnectors = true,
    connectorColor = 'textMuted',
    cardVariant = 'default',
    beats = {},
    position,
    style = {},
  } = config;

  // Validate required fields
  if (!events || events.length === 0) {
    console.warn('TimelineStrip: No events provided');
    return null;
  }

  const { start: globalStart = 1.0 } = beats;
  const globalStartFrame = toFrames(globalStart, fps);
  const staggerFrames = toFrames(staggerDelay, fps);
  const durationFrames = toFrames(animationDuration, fps);
  
  // Calculate slot dimensions
  const slot = {
    width: position?.width || width,
    height: position?.height || height,
    left: position?.left || 0,
    top: position?.top || 0,
  };

  // Resolve connector color
  const resolvedConnectorColor = KNODE_THEME.colors[connectorColor] || connectorColor;

  // Calculate card positions along timeline
  const cardPositions = useMemo(() => {
    const count = events.length;
    const padding = slot.width * 0.08;
    const usableWidth = slot.width - padding * 2;
    const spacing = count > 1 ? usableWidth / (count - 1) : 0;
    const centerY = slot.height / 2;
    const cardOffset = slot.height * 0.22; // Distance from center for up/down

    return events.map((event, index) => {
      const isUp = index % 2 === 0;
      return {
        x: padding + spacing * index,
        y: isUp ? centerY - cardOffset : centerY + cardOffset,
        position: isUp ? 'up' : 'down',
        connectorY: centerY,
      };
    });
  }, [events.length, slot.width, slot.height]);

  // Timeline center line Y position
  const timelineY = slot.height / 2;

  return (
    <AbsoluteFill>
      {/* Central timeline connector line */}
      {showConnectors && events.length > 1 && (
        <div
          style={{
            position: 'absolute',
            left: slot.left + slot.width * 0.08,
            top: slot.top + timelineY - 2,
            width: slot.width * 0.84,
            height: 4,
            backgroundColor: `${resolvedConnectorColor}30`,
            borderRadius: 2,
          }}
        />
      )}

      {/* Animated connector segments */}
      {showConnectors && cardPositions.map((pos, index) => {
        if (index === 0) return null;

        const prevPos = cardPositions[index - 1];
        
        // Calculate this segment's start time
        const event = events[index];
        const nodeStartFrame = event.beats?.start 
          ? toFrames(event.beats.start, fps)
          : globalStartFrame + (index - 1) * staggerFrames;
        
        const progress = getConnectorProgress(
          frame,
          nodeStartFrame,
          staggerFrames
        );

        return (
          <div
            key={`connector-${index}`}
            style={{
              position: 'absolute',
              left: slot.left + prevPos.x,
              top: slot.top + timelineY - 2,
              width: (pos.x - prevPos.x) * progress,
              height: 4,
              backgroundColor: resolvedConnectorColor,
              borderRadius: 2,
              opacity: 0.6,
            }}
          />
        );
      })}

      {/* Timeline cards */}
      {events.map((event, index) => {
        // Calculate start frame - use per-node beats if provided
        const nodeStartFrame = event.beats?.start 
          ? toFrames(event.beats.start, fps)
          : globalStartFrame + index * staggerFrames;
        
        const pos = cardPositions[index];
        const slideDirection = pos.position === 'up' ? 'down' : 'up';
        
        const animStyle = getCardAnimationStyle(
          animation,
          frame,
          nodeStartFrame,
          durationFrames,
          fps,
          slideDirection
        );

        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: slot.left + pos.x,
              top: slot.top + pos.y,
              transform: 'translateX(-50%)',
              opacity: animStyle.opacity,
              ...style.cardWrapper,
            }}
          >
            <div style={{ transform: animStyle.transform }}>
              <TimelineCard
                title={event.title}
                subtitle={event.subtitle}
                description={event.description}
                iconRef={event.icon}
                badge={event.badge}
                accentColor={event.color}
                cardVariant={cardVariant}
                position={pos.position}
                style={style}
              />
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export default TimelineStrip;
