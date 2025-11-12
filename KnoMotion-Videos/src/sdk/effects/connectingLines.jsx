import React from 'react';
import { interpolate } from 'remotion';
import { toFrames, EZ } from '../core/time';

/**
 * SDK UTILITY: Connecting Lines
 * 
 * Renders animated connecting lines between elements (e.g., icons, cards)
 * Supports multiple styles: dotted, dashed, solid
 * Animates with stroke-dashoffset for smooth drawing effect
 */

/**
 * Calculate line properties for animation
 */
export const getConnectingLineProps = (frame, config, fromPos, toPos, fps) => {
  const {
    startFrame,
    duration = 0.8,
    style = 'dotted',
    color = '#9B59B6',
    strokeWidth = 3,
    opacity = 0.6
  } = config;

  // Calculate path length
  const pathLength = Math.sqrt(
    Math.pow(toPos.x - fromPos.x, 2) + Math.pow(toPos.y - fromPos.y, 2)
  );

  // Animation progress
  const progress = interpolate(
    frame,
    [startFrame, startFrame + toFrames(duration, fps)],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: EZ.power3Out
    }
  );

  // Stroke dash based on style
  const strokeDasharray = (() => {
    switch (style) {
      case 'dotted':
        return '8 8';
      case 'dashed':
        return '16 8';
      case 'solid':
      default:
        return 'none';
    }
  })();

  // Animated drawing
  const strokeDashoffset = pathLength * (1 - progress);

  return {
    pathLength,
    progress,
    strokeDasharray,
    strokeDashoffset,
    color,
    strokeWidth,
    opacity: opacity * progress
  };
};

/**
 * Render connecting line between two positions
 */
export const renderConnectingLine = (config, fromPos, toPos, frame, startFrame, duration, fps) => {
  const lineProps = getConnectingLineProps(
    frame,
    { ...config, startFrame, duration },
    fromPos,
    toPos,
    fps
  );

  return (
    <line
      x1={fromPos.x}
      y1={fromPos.y}
      x2={toPos.x}
      y2={toPos.y}
      stroke={lineProps.color}
      strokeWidth={lineProps.strokeWidth}
      strokeDasharray={lineProps.style === 'solid' ? 'none' : lineProps.strokeDasharray}
      strokeDashoffset={lineProps.strokeDashoffset}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={lineProps.opacity}
    />
  );
};

/**
 * Render multiple connecting lines
 */
export const renderConnectingLines = (connections, frame, fps) => {
  return connections.map((connection, i) => {
    const { from, to, config, startFrame, duration } = connection;
    return (
      <React.Fragment key={i}>
        {renderConnectingLine(config, from, to, frame, startFrame, duration, fps)}
      </React.Fragment>
    );
  });
};

/**
 * Calculate control points for curved connecting lines (bezier)
 */
export const getCurvedLineProps = (frame, config, fromPos, toPos, fps) => {
  const {
    startFrame,
    duration = 0.8,
    curvature = 0.3, // 0 = straight, 1 = very curved
    color = '#9B59B6',
    strokeWidth = 3,
    opacity = 0.6
  } = config;

  // Animation progress
  const progress = interpolate(
    frame,
    [startFrame, startFrame + toFrames(duration, fps)],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: EZ.power3Out
    }
  );

  // Calculate control point for quadratic bezier
  const midX = (fromPos.x + toPos.x) / 2;
  const midY = (fromPos.y + toPos.y) / 2;

  // Perpendicular offset for curve
  const dx = toPos.x - fromPos.x;
  const dy = toPos.y - fromPos.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  const offsetX = (-dy / length) * length * curvature;
  const offsetY = (dx / length) * length * curvature;

  const controlX = midX + offsetX;
  const controlY = midY + offsetY;

  // Path string for quadratic bezier
  const pathString = `M ${fromPos.x},${fromPos.y} Q ${controlX},${controlY} ${toPos.x},${toPos.y}`;

  // Estimate path length (approximate)
  const pathLength = length * (1 + curvature * 0.5);
  const strokeDashoffset = pathLength * (1 - progress);

  return {
    pathString,
    pathLength,
    progress,
    strokeDashoffset,
    color,
    strokeWidth,
    opacity: opacity * progress
  };
};

/**
 * Render curved connecting line
 */
export const renderCurvedLine = (config, fromPos, toPos, frame, startFrame, duration, fps) => {
  const lineProps = getCurvedLineProps(
    frame,
    { ...config, startFrame, duration },
    fromPos,
    toPos,
    fps
  );

  return (
    <path
      d={lineProps.pathString}
      stroke={lineProps.color}
      strokeWidth={lineProps.strokeWidth}
      fill="none"
      strokeDasharray={lineProps.pathLength}
      strokeDashoffset={lineProps.strokeDashoffset}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={lineProps.opacity}
    />
  );
};

export default {
  getConnectingLineProps,
  renderConnectingLine,
  renderConnectingLines,
  getCurvedLineProps,
  renderCurvedLine
};
