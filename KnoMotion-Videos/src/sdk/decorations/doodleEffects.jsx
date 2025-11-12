import React from 'react';
import { interpolate } from 'remotion';
import { toFrames, EZ } from '../core/time';

/**
 * SDK UTILITY: Doodle Effects
 * 
 * Hand-drawn, organic decoration elements for brand personality:
 * - Wavy underlines
 * - Sketch circles/highlights
 * - Hand-drawn arrows
 * - Notebook-style decorations
 */

/**
 * Get doodle underline animation properties
 */
export const getDoodleUnderline = (frame, config, startFrame, fps) => {
  const {
    style = 'wavy',
    animationDuration = 0.6,
    width = 300,
    height = 20
  } = config;

  const progress = interpolate(
    frame,
    [startFrame, startFrame + toFrames(animationDuration, fps)],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: EZ.easeInOutQuad
    }
  );

  // Path definitions for different styles
  const paths = {
    wavy: `M 10,${height / 2} Q 75,${height / 2 - 10} 150,${height / 2} T 290,${height / 2}`,
    straight: `M 10,${height / 2} L 290,${height / 2}`,
    sketch: `M 10,${height / 2} Q 70,${height / 2 - 3} 140,${height / 2 + 3} T 290,${height / 2 - 1}`,
    double: `M 10,${height / 2 - 3} L 290,${height / 2 - 3} M 10,${height / 2 + 3} L 290,${height / 2 + 3}`
  };

  const pathString = paths[style] || paths.wavy;

  // Calculate total path length (approximate)
  const totalLength = width * 1.1;

  return {
    pathString,
    totalLength,
    progress,
    strokeDasharray: totalLength,
    strokeDashoffset: totalLength * (1 - progress),
    width,
    height
  };
};

/**
 * Render doodle underline
 */
export const renderDoodleUnderline = (config, frame, startFrame, fps) => {
  const underlineProps = getDoodleUnderline(frame, config, startFrame, fps);

  return (
    <path
      d={underlineProps.pathString}
      stroke={config.color || '#FF6B35'}
      strokeWidth={config.strokeWidth || 3}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={underlineProps.strokeDasharray}
      strokeDashoffset={underlineProps.strokeDashoffset}
      opacity={config.opacity || 0.8}
    />
  );
};

/**
 * Get doodle circle/highlight animation properties
 */
export const getDoodleCircle = (frame, config, startFrame, fps) => {
  const {
    radius = 50,
    style = 'rough',
    animationDuration = 0.8
  } = config;

  const progress = interpolate(
    frame,
    [startFrame, startFrame + toFrames(animationDuration, fps)],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: EZ.easeInOutQuad
    }
  );

  // Generate rough circle path
  const generateRoughCircle = (r, roughness = 3) => {
    const segments = 16;
    let path = '';

    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const variation = (Math.random() - 0.5) * roughness;
      const x = Math.cos(angle) * (r + variation);
      const y = Math.sin(angle) * (r + variation);

      if (i === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    }

    return path + ' Z';
  };

  const pathString =
    style === 'rough'
      ? generateRoughCircle(radius)
      : `M ${radius} 0 A ${radius} ${radius} 0 1 1 ${radius} 0.1 Z`;

  // Approximate circumference
  const circumference = 2 * Math.PI * radius;

  return {
    pathString,
    circumference,
    progress,
    strokeDasharray: circumference,
    strokeDashoffset: circumference * (1 - progress)
  };
};

/**
 * Render doodle circle
 */
export const renderDoodleCircle = (config, frame, startFrame, fps, centerX, centerY) => {
  const circleProps = getDoodleCircle(frame, config, startFrame, fps);

  return (
    <g transform={`translate(${centerX}, ${centerY})`}>
      <path
        d={circleProps.pathString}
        stroke={config.color || '#FF6B35'}
        strokeWidth={config.strokeWidth || 3}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={circleProps.strokeDasharray}
        strokeDashoffset={circleProps.strokeDashoffset}
        opacity={config.opacity || 0.7}
      />
    </g>
  );
};

/**
 * Get doodle arrow animation properties
 */
export const getDoodleArrow = (frame, config, startFrame, fps) => {
  const {
    fromX,
    fromY,
    toX,
    toY,
    style = 'curved',
    animationDuration = 0.8,
    arrowheadSize = 15
  } = config;

  const progress = interpolate(
    frame,
    [startFrame, startFrame + toFrames(animationDuration, fps)],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: EZ.easeInOutQuad
    }
  );

  // Calculate arrow path based on style
  let pathString = '';

  if (style === 'curved') {
    const dx = toX - fromX;
    const dy = toY - fromY;
    const controlX = fromX + dx * 0.5;
    const controlY = fromY + dy * 0.5 - 50; // Curve upward

    pathString = `M ${fromX} ${fromY} Q ${controlX} ${controlY} ${toX} ${toY}`;
  } else {
    pathString = `M ${fromX} ${fromY} L ${toX} ${toY}`;
  }

  // Calculate arrowhead
  const angle = Math.atan2(toY - fromY, toX - fromX);
  const arrowhead1X = toX - arrowheadSize * Math.cos(angle - Math.PI / 6);
  const arrowhead1Y = toY - arrowheadSize * Math.sin(angle - Math.PI / 6);
  const arrowhead2X = toX - arrowheadSize * Math.cos(angle + Math.PI / 6);
  const arrowhead2Y = toY - arrowheadSize * Math.sin(angle + Math.PI / 6);

  const arrowheadPath = `M ${toX} ${toY} L ${arrowhead1X} ${arrowhead1Y} M ${toX} ${toY} L ${arrowhead2X} ${arrowhead2Y}`;

  // Approximate path length
  const dx = toX - fromX;
  const dy = toY - fromY;
  const length = Math.sqrt(dx * dx + dy * dy) * (style === 'curved' ? 1.2 : 1);

  return {
    pathString,
    arrowheadPath,
    length,
    progress,
    strokeDasharray: length,
    strokeDashoffset: length * (1 - progress),
    arrowheadOpacity: progress > 0.7 ? (progress - 0.7) / 0.3 : 0
  };
};

/**
 * Render doodle arrow
 */
export const renderDoodleArrow = (config, frame, startFrame, fps) => {
  const arrowProps = getDoodleArrow(frame, config, startFrame, fps);

  return (
    <g>
      {/* Arrow shaft */}
      <path
        d={arrowProps.pathString}
        stroke={config.color || '#FF6B35'}
        strokeWidth={config.strokeWidth || 3}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={arrowProps.strokeDasharray}
        strokeDashoffset={arrowProps.strokeDashoffset}
        opacity={config.opacity || 0.7}
      />

      {/* Arrowhead */}
      <path
        d={arrowProps.arrowheadPath}
        stroke={config.color || '#FF6B35'}
        strokeWidth={config.strokeWidth || 3}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={(config.opacity || 0.7) * arrowProps.arrowheadOpacity}
      />
    </g>
  );
};

/**
 * Render notebook paper lines (horizontal ruled lines)
 */
export const renderNotebookLines = (width, height, lineSpacing = 40, color = '#E5E5E5') => {
  const lines = [];
  const lineCount = Math.floor(height / lineSpacing);

  for (let i = 1; i <= lineCount; i++) {
    const y = i * lineSpacing;
    lines.push(
      <line
        key={i}
        x1={0}
        y1={y}
        x2={width}
        y2={y}
        stroke={color}
        strokeWidth={1}
        opacity={0.3}
      />
    );
  }

  return <g>{lines}</g>;
};

/**
 * Render notebook margin line (vertical red line on left)
 */
export const renderNotebookMargin = (height, marginX = 80, color = '#FF6B6B') => {
  return (
    <line
      x1={marginX}
      y1={0}
      x2={marginX}
      y2={height}
      stroke={color}
      strokeWidth={2}
      opacity={0.4}
    />
  );
};

export default {
  getDoodleUnderline,
  renderDoodleUnderline,
  getDoodleCircle,
  renderDoodleCircle,
  getDoodleArrow,
  renderDoodleArrow,
  renderNotebookLines,
  renderNotebookMargin
};
