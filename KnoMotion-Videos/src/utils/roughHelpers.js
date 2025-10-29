/**
 * Rough.js Helpers
 * 
 * Hand-drawn sketch utilities for Knode scenes
 * 
 * ZERO WOBBLE POLICY:
 * - All roughness set to 0 (no jitter/wobble)
 * - All bowing set to 0 (clean lines)
 * - Use rough.js for SHAPE RENDERING only
 * - Preserve hand-drawn feel through layout, color, easing
 */

import rough from 'roughjs/bundled/rough.esm.js';

/**
 * Create a rough.js SVG generator
 */
export const createRoughSVG = (svg) => {
  return rough.svg(svg);
};

/**
 * Sketch a circle - hand-drawn, not perfect
 */
export const sketchCircle = (rc, x, y, diameter, options = {}) => {
  const defaultOptions = {
    stroke: '#1A1A1A',
    strokeWidth: 3,
    roughness: 0,
    bowing: 0,
    fill: options.fill || 'none',
    fillStyle: options.fillStyle || 'solid',
  };

  return rc.circle(x, y, diameter, { ...defaultOptions, ...options });
};

/**
 * Sketch a rectangle - wobbly edges
 */
export const sketchRect = (rc, x, y, width, height, options = {}) => {
  const defaultOptions = {
    stroke: '#1A1A1A',
    strokeWidth: 3,
    roughness: 0,
    bowing: 0,
    fill: options.fill || 'none',
    fillStyle: options.fillStyle || 'hachure',
    fillWeight: 1.5,
    hachureAngle: 45,
    hachureGap: 8,
  };

  return rc.rectangle(x, y, width, height, { ...defaultOptions, ...options });
};

/**
 * Sketch a line - organic, hand-drawn
 */
export const sketchLine = (rc, x1, y1, x2, y2, options = {}) => {
  const defaultOptions = {
    stroke: '#1A1A1A',
    strokeWidth: 3,
    roughness: 0,
    bowing: 0,
  };

  return rc.line(x1, y1, x2, y2, { ...defaultOptions, ...options });
};

/**
 * Sketch a path - curved, organic
 */
export const sketchPath = (rc, pathData, options = {}) => {
  const defaultOptions = {
    stroke: '#1A1A1A',
    strokeWidth: 3,
    roughness: 0,
    bowing: 0,
    fill: options.fill || 'none',
  };

  return rc.path(pathData, { ...defaultOptions, ...options });
};

/**
 * Sketch an ellipse - organic blob
 */
export const sketchEllipse = (rc, x, y, width, height, options = {}) => {
  const defaultOptions = {
    stroke: '#1A1A1A',
    strokeWidth: 3,
    roughness: 0,
    bowing: 0,
    fill: options.fill || 'none',
    fillStyle: options.fillStyle || 'hachure',
  };

  return rc.ellipse(x, y, width, height, { ...defaultOptions, ...options });
};

/**
 * Sketch arrow - dynamic connector
 */
export const sketchArrow = (rc, x1, y1, x2, y2, options = {}) => {
  const { stroke = '#1A1A1A', strokeWidth = 3, arrowSize = 15 } = options;

  // Calculate arrow angle
  const angle = Math.atan2(y2 - y1, x2 - x1);
  
  // Arrow head points
  const arrowX1 = x2 - arrowSize * Math.cos(angle - Math.PI / 6);
  const arrowY1 = y2 - arrowSize * Math.sin(angle - Math.PI / 6);
  const arrowX2 = x2 - arrowSize * Math.cos(angle + Math.PI / 6);
  const arrowY2 = y2 - arrowSize * Math.sin(angle + Math.PI / 6);

  // Create path
  const pathData = `M ${x1} ${y1} L ${x2} ${y2} M ${arrowX1} ${arrowY1} L ${x2} ${y2} L ${arrowX2} ${arrowY2}`;
  
  return sketchPath(rc, pathData, { stroke, strokeWidth, ...options });
};

/**
 * Sketch a cloud/thought bubble
 */
export const sketchCloud = (rc, x, y, width, height, options = {}) => {
  const circles = [];
  const numCircles = 8;
  
  for (let i = 0; i < numCircles; i++) {
    const angle = (i / numCircles) * Math.PI * 2;
    const radiusX = width / 2;
    const radiusY = height / 2;
    const variance = 0.7 + Math.random() * 0.6; // Random size variation
    const radius = Math.min(radiusX, radiusY) * variance / 2;
    
    const cx = x + radiusX * Math.cos(angle);
    const cy = y + radiusY * Math.sin(angle);
    
    circles.push(sketchCircle(rc, cx, cy, radius * 2, options));
  }
  
  return circles;
};

/**
 * Sketch a star - hand-drawn emphasis
 */
export const sketchStar = (rc, x, y, size, options = {}) => {
  const points = 5;
  const outerRadius = size;
  const innerRadius = size * 0.4;
  
  let pathData = '';
  
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const px = x + radius * Math.cos(angle);
    const py = y + radius * Math.sin(angle);
    
    if (i === 0) {
      pathData += `M ${px} ${py}`;
    } else {
      pathData += ` L ${px} ${py}`;
    }
  }
  
  pathData += ' Z';
  
  return sketchPath(rc, pathData, options);
};

/**
 * Sketch underline - emphasis marker
 */
export const sketchUnderline = (rc, x, y, width, options = {}) => {
  const defaultOptions = {
    stroke: options.color || '#E74C3C',
    strokeWidth: 4,
    roughness: 0,
    bowing: 0,
  };

  // Slightly curved underline
  const controlX = x + width / 2;
  const controlY = y + 5; // Slight curve down
  const pathData = `M ${x} ${y} Q ${controlX} ${controlY} ${x + width} ${y}`;
  
  return sketchPath(rc, pathData, { ...defaultOptions, ...options });
};

/**
 * Sketch bracket/highlight - emphasis box
 */
export const sketchHighlight = (rc, x, y, width, height, options = {}) => {
  const defaultOptions = {
    fill: options.color || '#FFE66D',
    fillStyle: 'hachure',
    fillWeight: 1,
    hachureAngle: -45,
    hachureGap: 10,
    stroke: 'none',
    roughness: 0,
  };

  return rc.rectangle(x, y, width, height, { ...defaultOptions, ...options });
};

/**
 * Preset configurations for common elements
 */
export const ROUGH_PRESETS = {
  title: {
    strokeWidth: 4,
    roughness: 0,
    bowing: 0,
  },
  emphasis: {
    strokeWidth: 5,
    roughness: 0,
    bowing: 0,
    stroke: '#E74C3C',
  },
  subtle: {
    strokeWidth: 2,
    roughness: 0,
    bowing: 0,
    stroke: '#999',
  },
  bold: {
    strokeWidth: 6,
    roughness: 0,
    bowing: 0,
  },
  connector: {
    strokeWidth: 3,
    roughness: 0,
    bowing: 0,
    stroke: '#4A5568',
  },
};

export default {
  createRoughSVG,
  sketchCircle,
  sketchRect,
  sketchLine,
  sketchPath,
  sketchEllipse,
  sketchArrow,
  sketchCloud,
  sketchStar,
  sketchUnderline,
  sketchHighlight,
  ROUGH_PRESETS,
};
