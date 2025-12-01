/**
 * TimelineStrip - Mid-Scene Component
 * 
 * Renders a horizontal or vertical timeline with nodes, labels, and animated reveals.
 * Features slide/fade animations, connecting lines, and customizable markers.
 * All configurable via JSON - pre-built for LLM JSON generation.
 * 
 * @module mid-scenes/TimelineStrip
 * @category SDK
 * @subcategory Mid-Scenes
 */

import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, spring } from 'remotion';
import { Text } from '../elements/atoms/Text';
import { fadeIn, slideIn, scaleIn, drawLine } from '../animations/index';
import { toFrames } from '../core/time';
import { KNODE_THEME } from '../theme/knodeTheme';

/**
 * Node marker presets
 */
const MARKER_SHAPES = {
  circle: { borderRadius: '50%' },
  square: { borderRadius: '4px' },
  diamond: { borderRadius: '4px', transform: 'rotate(45deg)' },
  dot: { borderRadius: '50%', scale: 0.6 },
};

/**
 * Get animation style for timeline elements
 */
const getElementAnimationStyle = (animationType, frame, startFrame, durationFrames, fps, direction = 'left') => {
  switch (animationType) {
    case 'slide':
    case 'slideIn':
      return slideIn(frame, startFrame, durationFrames, direction, 50);
    
    case 'scale':
    case 'scaleIn':
      return scaleIn(frame, startFrame, durationFrames, 0);
    
    case 'pop': {
      const progress = spring({
        frame: Math.max(0, frame - startFrame),
        fps,
        config: { damping: 10, mass: 0.8, stiffness: 180 },
      });
      return {
        opacity: progress,
        transform: `scale(${0.3 + progress * 0.7})`,
      };
    }
    
    case 'fade':
    case 'fadeIn':
    default:
      return fadeIn(frame, startFrame, durationFrames);
  }
};

/**
 * Timeline Node Component
 */
const TimelineNode = ({
  event,
  position,
  nodeSize,
  markerShape,
  activeColor,
  inactiveColor,
  animStyle,
  orientation,
  index,
  style = {},
}) => {
  const shape = MARKER_SHAPES[markerShape] || MARKER_SHAPES.circle;
  const isActive = event.active !== false;
  const nodeColor = isActive 
    ? (event.color || activeColor) 
    : inactiveColor;

  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: orientation === 'vertical' ? 'row' : 'column',
        alignItems: 'center',
        gap: 12,
        opacity: animStyle.opacity,
        ...style.nodeWrapper,
      }}
    >
      {/* Node marker */}
      <div
        style={{
          transform: animStyle.transform,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: nodeSize,
          height: nodeSize,
          backgroundColor: nodeColor,
          boxShadow: isActive ? `0 0 0 4px ${nodeColor}30` : 'none',
          ...shape,
          ...style.marker,
        }}
      >
        {event.icon && (
          <span
            style={{
              fontSize: nodeSize * 0.5,
              transform: shape.transform ? `rotate(-45deg)` : 'none',
              color: '#fff',
              ...style.icon,
            }}
          >
            {event.icon}
          </span>
        )}
      </div>

      {/* Label container */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: orientation === 'vertical' ? 'flex-start' : 'center',
          gap: 4,
          transform: animStyle.transform,
          ...style.labelContainer,
        }}
      >
        {event.label && (
          <Text
            text={event.label}
            variant="body"
            size="md"
            weight={600}
            color="textMain"
            style={{
              fontSize: nodeSize * 0.6,
              whiteSpace: 'nowrap',
              ...style.label,
            }}
          />
        )}
        {event.sublabel && (
          <Text
            text={event.sublabel}
            variant="body"
            size="sm"
            weight={400}
            color="textSoft"
            style={{
              fontSize: nodeSize * 0.45,
              whiteSpace: 'nowrap',
              ...style.sublabel,
            }}
          />
        )}
      </div>
    </div>
  );
};

/**
 * Timeline Connector Line Component
 */
const TimelineConnector = ({
  from,
  to,
  progress,
  color,
  thickness,
  orientation,
  style = {},
}) => {
  if (progress <= 0) return null;

  const isVertical = orientation === 'vertical';
  
  const lineLength = isVertical 
    ? Math.abs(to.y - from.y)
    : Math.abs(to.x - from.x);

  return (
    <div
      style={{
        position: 'absolute',
        left: isVertical ? from.x : Math.min(from.x, to.x),
        top: isVertical ? Math.min(from.y, to.y) : from.y,
        width: isVertical ? thickness : lineLength * progress,
        height: isVertical ? lineLength * progress : thickness,
        backgroundColor: color,
        transform: 'translate(-50%, -50%)',
        borderRadius: thickness / 2,
        ...style.connector,
      }}
    />
  );
};

/**
 * TimelineStrip Component
 * 
 * @param {Object} props
 * @param {Object} props.config - JSON configuration
 * @param {Array} props.config.events - Array of timeline events (required)
 * @param {string} props.config.events[].label - Event label/title
 * @param {string} props.config.events[].sublabel - Optional subtitle/date
 * @param {string} props.config.events[].icon - Optional icon/emoji
 * @param {string} props.config.events[].color - Custom node color
 * @param {boolean} props.config.events[].active - Whether node is active (default: true)
 * @param {string} props.config.orientation - Timeline direction: 'horizontal' | 'vertical' (default: 'horizontal')
 * @param {string} props.config.animation - Animation type: 'slide' | 'fade' | 'scale' | 'pop' (default: 'slide')
 * @param {number} props.config.staggerDelay - Delay between nodes in seconds (default: 0.25)
 * @param {number} props.config.animationDuration - Animation duration per node in seconds (default: 0.5)
 * @param {string} props.config.markerShape - Node marker shape: 'circle' | 'square' | 'diamond' | 'dot' (default: 'circle')
 * @param {number} props.config.nodeSize - Size of node markers in pixels (default: auto-calculated)
 * @param {boolean} props.config.showConnectors - Show connecting lines (default: true)
 * @param {number} props.config.connectorDelay - Delay before connector animation starts (default: 0.1)
 * @param {string} props.config.activeColor - Color for active nodes (default: 'primary')
 * @param {string} props.config.inactiveColor - Color for inactive nodes (default: 'textMuted')
 * @param {string} props.config.connectorColor - Color for connector lines (default: 'ruleLine')
 * @param {Object} props.config.beats - Beat timings
 * @param {number} props.config.beats.start - Start beat in seconds (required)
 * @param {Object} props.config.position - Slot position from layout resolver
 * @param {Object} props.config.style - Optional style overrides
 */
export const TimelineStrip = ({ config }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  
  const {
    events = [],
    orientation = 'horizontal',
    animation = 'slide',
    staggerDelay = 0.25,
    animationDuration = 0.5,
    markerShape = 'circle',
    nodeSize: customNodeSize,
    showConnectors = true,
    connectorDelay = 0.1,
    activeColor = 'primary',
    inactiveColor = 'textMuted',
    connectorColor = 'ruleLine',
    beats = {},
    position,
    style = {},
  } = config;

  // Validate required fields
  if (!events || events.length === 0) {
    console.warn('TimelineStrip: No events provided');
    return null;
  }

  const { start = 1.0 } = beats;
  const startFrame = toFrames(start, fps);
  const staggerFrames = toFrames(staggerDelay, fps);
  const durationFrames = toFrames(animationDuration, fps);
  const connectorDelayFrames = toFrames(connectorDelay, fps);
  
  // Calculate dimensions from position or viewport
  const slot = {
    width: position?.width || width,
    height: position?.height || height,
    left: position?.left || 0,
    top: position?.top || 0,
  };

  // Resolve colors from theme
  const resolveColor = (colorKey, fallback = KNODE_THEME.colors.primary) => {
    if (!colorKey) return fallback;
    if (colorKey.startsWith('#') || colorKey.startsWith('rgb')) return colorKey;
    return KNODE_THEME.colors[colorKey] || fallback;
  };

  const resolvedActiveColor = resolveColor(activeColor, KNODE_THEME.colors.primary);
  const resolvedInactiveColor = resolveColor(inactiveColor, KNODE_THEME.colors.textMuted);
  const resolvedConnectorColor = resolveColor(connectorColor, KNODE_THEME.colors.ruleLine);

  // Calculate node positions
  const isVertical = orientation === 'vertical';
  const padding = isVertical ? slot.height * 0.15 : slot.width * 0.1;
  const usableLength = isVertical 
    ? slot.height - padding * 2 
    : slot.width - padding * 2;
  
  const nodeSpacing = usableLength / (events.length - 1 || 1);
  
  // Auto-calculate node size based on slot and event count
  const nodeSize = customNodeSize || Math.min(
    isVertical ? slot.width * 0.15 : slot.height * 0.2,
    nodeSpacing * 0.4,
    40
  );

  const connectorThickness = Math.max(2, nodeSize * 0.12);

  // Calculate positions for each node
  const nodePositions = useMemo(() => {
    return events.map((_, index) => {
      if (isVertical) {
        return {
          x: slot.left + slot.width * 0.25,
          y: slot.top + padding + nodeSpacing * index,
        };
      }
      return {
        x: slot.left + padding + nodeSpacing * index,
        y: slot.top + slot.height * 0.4,
      };
    });
  }, [events, slot, isVertical, padding, nodeSpacing]);

  return (
    <AbsoluteFill>
      {/* Background track line */}
      {showConnectors && events.length > 1 && (
        <div
          style={{
            position: 'absolute',
            left: isVertical 
              ? nodePositions[0].x - connectorThickness / 2 
              : nodePositions[0].x,
            top: isVertical 
              ? nodePositions[0].y 
              : nodePositions[0].y - connectorThickness / 2,
            width: isVertical 
              ? connectorThickness 
              : nodePositions[events.length - 1].x - nodePositions[0].x,
            height: isVertical 
              ? nodePositions[events.length - 1].y - nodePositions[0].y 
              : connectorThickness,
            backgroundColor: `${resolvedConnectorColor}40`,
            borderRadius: connectorThickness / 2,
            ...style.track,
          }}
        />
      )}

      {/* Animated connector segments */}
      {showConnectors && nodePositions.map((pos, index) => {
        if (index === 0) return null;
        
        const prevPos = nodePositions[index - 1];
        const connectorStartFrame = startFrame + (index - 1) * staggerFrames + connectorDelayFrames;
        const connectorDuration = staggerFrames - connectorDelayFrames;
        const progress = drawLine(frame, connectorStartFrame, connectorDuration);

        return (
          <TimelineConnector
            key={`connector-${index}`}
            from={prevPos}
            to={pos}
            progress={progress}
            color={resolvedActiveColor}
            thickness={connectorThickness}
            orientation={orientation}
            style={style}
          />
        );
      })}

      {/* Timeline nodes */}
      {events.map((event, index) => {
        const eventStartFrame = startFrame + index * staggerFrames;
        const animStyle = getElementAnimationStyle(
          animation,
          frame,
          eventStartFrame,
          durationFrames,
          fps,
          isVertical ? 'left' : 'up'
        );

        return (
          <TimelineNode
            key={index}
            event={event}
            position={nodePositions[index]}
            nodeSize={nodeSize}
            markerShape={markerShape}
            activeColor={resolvedActiveColor}
            inactiveColor={resolvedInactiveColor}
            animStyle={animStyle}
            orientation={orientation}
            index={index}
            style={style}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export default TimelineStrip;
