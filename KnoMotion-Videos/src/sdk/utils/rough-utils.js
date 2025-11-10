import rough from 'roughjs';

/**
 * Template SDK - Rough.js Utilities
 * Hand-drawn sketch effects for whiteboard-style templates
 */

// Preset sketch styles
export const SKETCH_STYLES = {
  minimal: {
    roughness: 0.5,
    strokeWidth: 2,
    fillWeight: 0.5,
    hachureGap: 4,
    fillStyle: 'hachure'
  },
  casual: {
    roughness: 1.5,
    strokeWidth: 2,
    fillWeight: 1,
    hachureGap: 6,
    fillStyle: 'hachure'
  },
  sketchy: {
    roughness: 2.5,
    strokeWidth: 3,
    fillWeight: 1.5,
    hachureGap: 8,
    fillStyle: 'hachure'
  },
  bold: {
    roughness: 1,
    strokeWidth: 4,
    fillWeight: 2,
    hachureGap: 5,
    fillStyle: 'solid'
  },
  delicate: {
    roughness: 0.8,
    strokeWidth: 1,
    fillWeight: 0.3,
    hachureGap: 3,
    fillStyle: 'cross-hatch'
  }
};

/**
 * Draw a sketchy rectangle
 */
export const drawSketchRect = (rc, x, y, width, height, options = {}) => {
  const style = SKETCH_STYLES[options.style] || SKETCH_STYLES.casual;
  
  return rc.rectangle(x, y, width, height, {
    ...style,
    fill: options.fill,
    stroke: options.stroke || '#2d3436',
    fillStyle: options.fillStyle || style.fillStyle,
    roughness: options.roughness ?? style.roughness,
    strokeWidth: options.strokeWidth ?? style.strokeWidth,
    ...options
  });
};

/**
 * Draw a sketchy circle
 */
export const drawSketchCircle = (rc, x, y, diameter, options = {}) => {
  const style = SKETCH_STYLES[options.style] || SKETCH_STYLES.casual;
  
  return rc.circle(x, y, diameter, {
    ...style,
    fill: options.fill,
    stroke: options.stroke || '#2d3436',
    fillStyle: options.fillStyle || style.fillStyle,
    roughness: options.roughness ?? style.roughness,
    strokeWidth: options.strokeWidth ?? style.strokeWidth,
    ...options
  });
};

/**
 * Draw a sketchy line
 */
export const drawSketchLine = (rc, x1, y1, x2, y2, options = {}) => {
  const style = SKETCH_STYLES[options.style] || SKETCH_STYLES.casual;
  
  return rc.line(x1, y1, x2, y2, {
    roughness: options.roughness ?? style.roughness,
    strokeWidth: options.strokeWidth ?? style.strokeWidth,
    stroke: options.stroke || '#2d3436',
    ...options
  });
};

/**
 * Draw an arrow
 */
export const drawArrow = (rc, x1, y1, x2, y2, options = {}) => {
  const style = SKETCH_STYLES[options.style] || SKETCH_STYLES.casual;
  
  // Draw main line
  rc.line(x1, y1, x2, y2, {
    roughness: options.roughness ?? style.roughness,
    strokeWidth: options.strokeWidth ?? style.strokeWidth,
    stroke: options.stroke || '#2d3436',
    ...options
  });
  
  // Calculate arrowhead
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const arrowLength = options.arrowSize || 20;
  const arrowAngle = Math.PI / 6;
  
  const x3 = x2 - arrowLength * Math.cos(angle - arrowAngle);
  const y3 = y2 - arrowLength * Math.sin(angle - arrowAngle);
  const x4 = x2 - arrowLength * Math.cos(angle + arrowAngle);
  const y4 = y2 - arrowLength * Math.sin(angle + arrowAngle);
  
  // Draw arrowhead
  rc.line(x2, y2, x3, y3, {
    roughness: options.roughness ?? style.roughness,
    strokeWidth: options.strokeWidth ?? style.strokeWidth,
    stroke: options.stroke || '#2d3436'
  });
  
  rc.line(x2, y2, x4, y4, {
    roughness: options.roughness ?? style.roughness,
    strokeWidth: options.strokeWidth ?? style.strokeWidth,
    stroke: options.stroke || '#2d3436'
  });
};

/**
 * Draw a sketchy ellipse
 */
export const drawSketchEllipse = (rc, x, y, width, height, options = {}) => {
  const style = SKETCH_STYLES[options.style] || SKETCH_STYLES.casual;
  
  return rc.ellipse(x, y, width, height, {
    ...style,
    fill: options.fill,
    stroke: options.stroke || '#2d3436',
    fillStyle: options.fillStyle || style.fillStyle,
    roughness: options.roughness ?? style.roughness,
    strokeWidth: options.strokeWidth ?? style.strokeWidth,
    ...options
  });
};

/**
 * Draw a sketchy polygon
 */
export const drawSketchPolygon = (rc, points, options = {}) => {
  const style = SKETCH_STYLES[options.style] || SKETCH_STYLES.casual;
  
  return rc.polygon(points, {
    ...style,
    fill: options.fill,
    stroke: options.stroke || '#2d3436',
    fillStyle: options.fillStyle || style.fillStyle,
    roughness: options.roughness ?? style.roughness,
    strokeWidth: options.strokeWidth ?? style.strokeWidth,
    ...options
  });
};

/**
 * Draw a curved path
 */
export const drawCurvedPath = (rc, points, options = {}) => {
  const style = SKETCH_STYLES[options.style] || SKETCH_STYLES.casual;
  
  return rc.curve(points, {
    roughness: options.roughness ?? style.roughness,
    strokeWidth: options.strokeWidth ?? style.strokeWidth,
    stroke: options.stroke || '#2d3436',
    ...options
  });
};

/**
 * Draw a speech bubble
 */
export const drawSpeechBubble = (rc, x, y, width, height, options = {}) => {
  const style = SKETCH_STYLES[options.style] || SKETCH_STYLES.casual;
  
  // Main bubble
  rc.rectangle(x, y, width, height, {
    ...style,
    fill: options.fill || '#ffffff',
    stroke: options.stroke || '#2d3436',
    fillStyle: 'solid',
    roughness: options.roughness ?? style.roughness,
    strokeWidth: options.strokeWidth ?? style.strokeWidth
  });
  
  // Tail
  const tailPoints = [
    [x + width / 4, y + height],
    [x + width / 6, y + height + 30],
    [x + width / 3, y + height]
  ];
  
  rc.polygon(tailPoints, {
    ...style,
    fill: options.fill || '#ffffff',
    stroke: options.stroke || '#2d3436',
    fillStyle: 'solid',
    roughness: options.roughness ?? style.roughness,
    strokeWidth: options.strokeWidth ?? style.strokeWidth
  });
};

/**
 * Draw a dashed line (sketchy)
 */
export const drawDashedLine = (rc, x1, y1, x2, y2, options = {}) => {
  const style = SKETCH_STYLES[options.style] || SKETCH_STYLES.casual;
  const dashLength = options.dashLength || 10;
  const gapLength = options.gapLength || 5;
  
  const dx = x2 - x1;
  const dy = y2 - y1;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const segments = Math.floor(distance / (dashLength + gapLength));
  
  const unitX = dx / distance;
  const unitY = dy / distance;
  
  for (let i = 0; i < segments; i++) {
    const startX = x1 + unitX * i * (dashLength + gapLength);
    const startY = y1 + unitY * i * (dashLength + gapLength);
    const endX = startX + unitX * dashLength;
    const endY = startY + unitY * dashLength;
    
    rc.line(startX, startY, endX, endY, {
      roughness: options.roughness ?? style.roughness,
      strokeWidth: options.strokeWidth ?? style.strokeWidth,
      stroke: options.stroke || '#2d3436'
    });
  }
};

/**
 * Initialize rough canvas
 */
export const initRoughCanvas = (canvasRef) => {
  if (!canvasRef.current) return null;
  return rough.canvas(canvasRef.current);
};

/**
 * Clear canvas
 */
export const clearCanvas = (canvasRef) => {
  if (!canvasRef.current) return;
  const ctx = canvasRef.current.getContext('2d');
  ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
};
