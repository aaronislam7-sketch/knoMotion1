/**
 * TimelineStrip - Mid-Scene Component
 * 
 * Renders a dynamic, configurable timeline with nodes, labels, and hand-drawn reveals.
 * Features Knode sketchbook style with doodle effects and customizable node types.
 * All configurable via JSON - pre-built for LLM JSON generation.
 * 
 * @module mid-scenes/TimelineStrip
 * @category SDK
 * @subcategory Mid-Scenes
 */

import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, spring } from 'remotion';
import { Text } from '../elements/atoms/Text';
import { Badge } from '../elements/atoms/Badge';
import { fadeIn, slideIn, scaleIn, bounceIn } from '../animations/index';
import { getDoodleCircle, getDoodleArrow } from '../decorations/doodleEffects';
import { toFrames } from '../core/time';
import { KNODE_THEME } from '../theme/knodeTheme';

/**
 * Node type configurations for different visual styles
 */
const NODE_TYPES = {
  default: {
    shape: 'circle',
    size: 1,
    showRing: false,
  },
  start: {
    shape: 'circle',
    size: 1.2,
    showRing: true,
    ringColor: 'accentGreen',
    icon: '🚀',
  },
  end: {
    shape: 'circle',
    size: 1.2,
    showRing: true,
    ringColor: 'primary',
    icon: '🎯',
  },
  milestone: {
    shape: 'diamond',
    size: 1.3,
    showRing: true,
    ringColor: 'doodle',
  },
  checkpoint: {
    shape: 'square',
    size: 1.1,
    showRing: false,
  },
  current: {
    shape: 'circle',
    size: 1.4,
    showRing: true,
    ringColor: 'primary',
    pulse: true,
  },
};

/**
 * Get animation style for timeline elements
 */
const getNodeAnimationStyle = (animationType, frame, startFrame, durationFrames, fps) => {
  switch (animationType) {
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
    
    case 'draw': {
      // Simulates hand-drawn appearance
      const progress = spring({
        frame: Math.max(0, frame - startFrame),
        fps,
        config: { damping: 15, mass: 1, stiffness: 100 },
      });
      return {
        opacity: progress,
        transform: `scale(${progress}) rotate(${(1 - progress) * 10}deg)`,
      };
    }
    
    case 'slide':
      return slideIn(frame, startFrame, durationFrames, 'up', 40);
    
    case 'bounce':
      return bounceIn(frame, startFrame, durationFrames);
    
    case 'fade':
    default:
      return fadeIn(frame, startFrame, durationFrames);
  }
};

/**
 * Hand-drawn Node Component with sketchy style
 */
const TimelineNode = ({
  event,
  position,
  nodeSize,
  isFirst,
  isLast,
  animStyle,
  frame,
  startFrame,
  fps,
  orientation,
  style = {},
  resolveColor,
}) => {
  const nodeType = NODE_TYPES[event.type] || NODE_TYPES.default;
  const isVertical = orientation === 'vertical';
  
  // Determine node color
  const nodeColor = resolveColor(
    event.color || 
    (event.type === 'start' ? 'accentGreen' : 
     event.type === 'end' ? 'primary' : 
     event.active === false ? 'textMuted' : 'primary')
  );
  
  const ringColor = resolveColor(nodeType.ringColor || 'primary');
  const actualSize = nodeSize * (nodeType.size || 1);
  
  // Pulse animation for current/active nodes
  const pulseScale = nodeType.pulse 
    ? 1 + Math.sin(frame * 0.15) * 0.05 
    : 1;
  
  // Get shape based on node type
  const renderNodeShape = () => {
    const shapeStyle = {
      width: actualSize,
      height: actualSize,
      backgroundColor: nodeColor,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: `0 4px 12px ${nodeColor}40`,
      transition: 'transform 0.2s ease',
    };
    
    switch (nodeType.shape) {
      case 'diamond':
        return (
          <div
            style={{
              ...shapeStyle,
              borderRadius: 4,
              transform: `rotate(45deg) scale(${pulseScale})`,
            }}
          >
            <span style={{ transform: 'rotate(-45deg)', fontSize: actualSize * 0.45 }}>
              {event.icon || nodeType.icon}
            </span>
          </div>
        );
      
      case 'square':
        return (
          <div
            style={{
              ...shapeStyle,
              borderRadius: actualSize * 0.15,
              transform: `scale(${pulseScale})`,
            }}
          >
            <span style={{ fontSize: actualSize * 0.45 }}>
              {event.icon || nodeType.icon}
            </span>
          </div>
        );
      
      case 'circle':
      default:
        return (
          <div
            style={{
              ...shapeStyle,
              borderRadius: '50%',
              transform: `scale(${pulseScale})`,
            }}
          >
            <span style={{ fontSize: actualSize * 0.45, color: '#fff' }}>
              {event.icon || nodeType.icon}
            </span>
          </div>
        );
    }
  };

  // Label positioning based on orientation and index
  const labelPosition = isVertical
    ? { left: actualSize + 20, top: '50%', transform: 'translateY(-50%)' }
    : { top: actualSize + 12, left: '50%', transform: 'translateX(-50%)' };

  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
        opacity: animStyle.opacity,
        ...style.nodeWrapper,
      }}
    >
      {/* Outer ring for special nodes */}
      {nodeType.showRing && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) scale(${animStyle.transform?.includes('scale') ? 1 : pulseScale})`,
            width: actualSize + 16,
            height: actualSize + 16,
            borderRadius: nodeType.shape === 'diamond' ? 4 : nodeType.shape === 'square' ? actualSize * 0.2 : '50%',
            border: `3px dashed ${ringColor}60`,
            rotate: nodeType.shape === 'diamond' ? '45deg' : '0deg',
            ...style.ring,
          }}
        />
      )}

      {/* Node shape */}
      <div
        style={{
          transform: animStyle.transform,
          ...style.node,
        }}
      >
        {renderNodeShape()}
      </div>

      {/* Label container */}
      <div
        style={{
          position: 'absolute',
          ...labelPosition,
          whiteSpace: 'nowrap',
          transform: `${labelPosition.transform} ${animStyle.transform}`,
          opacity: animStyle.opacity,
          ...style.labelContainer,
        }}
      >
        {/* Badge for type indicator */}
        {event.badge && (
          <Badge
            text={event.badge}
            variant={event.type === 'start' ? 'success' : event.type === 'end' ? 'primary' : 'default'}
            size="sm"
            style={{
              marginBottom: 6,
              fontSize: nodeSize * 0.35,
              ...style.badge,
            }}
          />
        )}
        
        {/* Main label */}
        {event.label && (
          <Text
            text={event.label}
            variant="body"
            size="md"
            weight={event.type === 'current' || isFirst || isLast ? 700 : 600}
            color="textMain"
            style={{
              fontSize: nodeSize * 0.55,
              textAlign: isVertical ? 'left' : 'center',
              ...style.label,
            }}
          />
        )}
        
        {/* Sublabel / description */}
        {event.sublabel && (
          <Text
            text={event.sublabel}
            variant="body"
            size="sm"
            weight={400}
            color="textSoft"
            style={{
              fontSize: nodeSize * 0.4,
              marginTop: 4,
              textAlign: isVertical ? 'left' : 'center',
              ...style.sublabel,
            }}
          />
        )}
      </div>
    </div>
  );
};

/**
 * Animated connector with hand-drawn style
 */
const SketchyConnector = ({
  from,
  to,
  progress,
  color,
  thickness,
  connectorStyle,
  orientation,
  frame,
  fps,
}) => {
  if (progress <= 0) return null;

  const isVertical = orientation === 'vertical';
  const length = isVertical 
    ? Math.abs(to.y - from.y)
    : Math.abs(to.x - from.x);

  // Add slight wobble for hand-drawn feel
  const wobble = Math.sin(frame * 0.1) * 0.5;
  
  // Calculate path for sketchy line
  const getSketchyPath = () => {
    if (connectorStyle === 'curved') {
      const midX = (from.x + to.x) / 2;
      const midY = (from.y + to.y) / 2;
      const curveOffset = isVertical ? 20 : -20;
      
      return `M ${from.x} ${from.y} Q ${midX + (isVertical ? curveOffset : 0)} ${midY + (isVertical ? 0 : curveOffset)} ${to.x} ${to.y}`;
    }
    
    // Straight with slight wobble
    const midX = (from.x + to.x) / 2 + wobble;
    const midY = (from.y + to.y) / 2 + wobble;
    
    return `M ${from.x} ${from.y} L ${midX} ${midY} L ${to.x} ${to.y}`;
  };

  const strokeDasharray = connectorStyle === 'dashed' 
    ? '12 8' 
    : connectorStyle === 'dotted' 
      ? '4 6' 
      : 'none';

  return (
    <svg
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'visible',
      }}
    >
      {/* Background track */}
      <path
        d={getSketchyPath()}
        stroke={`${color}20`}
        strokeWidth={thickness + 2}
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Animated foreground line */}
      <path
        d={getSketchyPath()}
        stroke={color}
        strokeWidth={thickness}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={strokeDasharray !== 'none' ? strokeDasharray : length * 1.5}
        strokeDashoffset={strokeDasharray !== 'none' ? 0 : length * 1.5 * (1 - progress)}
        opacity={0.7}
      />
    </svg>
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
 * @param {string} props.config.events[].badge - Optional badge text (e.g., "Step 1")
 * @param {string} props.config.events[].color - Custom node color
 * @param {string} props.config.events[].type - Node type: 'default' | 'start' | 'end' | 'milestone' | 'checkpoint' | 'current'
 * @param {boolean} props.config.events[].active - Whether node is active (default: true)
 * @param {string} props.config.orientation - Timeline direction: 'horizontal' | 'vertical' (default: 'horizontal')
 * @param {string} props.config.animation - Animation type: 'pop' | 'draw' | 'slide' | 'bounce' | 'fade' (default: 'draw')
 * @param {number} props.config.staggerDelay - Delay between nodes in seconds (default: 0.3)
 * @param {number} props.config.animationDuration - Animation duration per node in seconds (default: 0.5)
 * @param {string} props.config.connectorStyle - Connector style: 'solid' | 'dashed' | 'dotted' | 'curved' (default: 'dashed')
 * @param {number} props.config.nodeSize - Base size of node markers in pixels (default: auto-calculated)
 * @param {boolean} props.config.showConnectors - Show connecting lines (default: true)
 * @param {string} props.config.activeColor - Color for active nodes (default: 'primary')
 * @param {string} props.config.connectorColor - Color for connector lines (default: 'secondary')
 * @param {boolean} props.config.autoStartEnd - Auto-style first as 'start' and last as 'end' (default: true)
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
    animation = 'draw',
    staggerDelay = 0.3,
    animationDuration = 0.5,
    connectorStyle = 'dashed',
    nodeSize: customNodeSize,
    showConnectors = true,
    activeColor = 'primary',
    connectorColor = 'secondary',
    autoStartEnd = true,
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

  const resolvedActiveColor = resolveColor(activeColor);
  const resolvedConnectorColor = resolveColor(connectorColor);

  // Calculate layout
  const isVertical = orientation === 'vertical';
  const padding = isVertical ? slot.height * 0.12 : slot.width * 0.08;
  const labelSpace = isVertical ? slot.width * 0.4 : slot.height * 0.35;
  
  const usableLength = isVertical 
    ? slot.height - padding * 2 
    : slot.width - padding * 2;
  
  const nodeSpacing = events.length > 1 
    ? usableLength / (events.length - 1) 
    : 0;
  
  // Auto-calculate node size based on slot and event count
  const nodeSize = customNodeSize || Math.min(
    isVertical ? (slot.width - labelSpace) * 0.35 : slot.height * 0.25,
    nodeSpacing * 0.35,
    50
  );

  const connectorThickness = Math.max(3, nodeSize * 0.08);

  // Process events with auto start/end
  const processedEvents = useMemo(() => {
    return events.map((event, index) => {
      let type = event.type || 'default';
      
      if (autoStartEnd) {
        if (index === 0 && !event.type) type = 'start';
        if (index === events.length - 1 && !event.type) type = 'end';
      }
      
      return { ...event, type };
    });
  }, [events, autoStartEnd]);

  // Calculate positions for each node
  const nodePositions = useMemo(() => {
    return processedEvents.map((_, index) => {
      if (isVertical) {
        return {
          x: slot.left + nodeSize + 20,
          y: slot.top + padding + nodeSpacing * index,
        };
      }
      return {
        x: slot.left + padding + nodeSpacing * index,
        y: slot.top + slot.height * 0.35,
      };
    });
  }, [processedEvents, slot, isVertical, padding, nodeSpacing, nodeSize]);

  return (
    <AbsoluteFill>
      {/* Connector lines (behind nodes) */}
      {showConnectors && nodePositions.map((pos, index) => {
        if (index === 0) return null;
        
        const prevPos = nodePositions[index - 1];
        const connectorStartFrame = startFrame + (index - 1) * staggerFrames;
        const connectorProgress = interpolate(
          frame,
          [connectorStartFrame, connectorStartFrame + staggerFrames],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );

        return (
          <SketchyConnector
            key={`connector-${index}`}
            from={prevPos}
            to={pos}
            progress={connectorProgress}
            color={resolvedConnectorColor}
            thickness={connectorThickness}
            connectorStyle={connectorStyle}
            orientation={orientation}
            frame={frame}
            fps={fps}
          />
        );
      })}

      {/* Timeline nodes */}
      {processedEvents.map((event, index) => {
        const eventStartFrame = startFrame + index * staggerFrames;
        const animStyle = getNodeAnimationStyle(
          animation,
          frame,
          eventStartFrame,
          durationFrames,
          fps
        );

        return (
          <TimelineNode
            key={index}
            event={event}
            position={nodePositions[index]}
            nodeSize={nodeSize}
            isFirst={index === 0}
            isLast={index === processedEvents.length - 1}
            animStyle={animStyle}
            frame={frame}
            startFrame={eventStartFrame}
            fps={fps}
            orientation={orientation}
            style={style}
            resolveColor={resolveColor}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export default TimelineStrip;
