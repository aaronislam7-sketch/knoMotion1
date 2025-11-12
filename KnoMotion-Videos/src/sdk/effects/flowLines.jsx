import React from 'react';

/**
 * FLOW LINES - Connecting elements with curved paths
 * 
 * Creates hand-drawn style curved lines that connect sequential elements,
 * showing narrative flow or progression.
 * 
 * Reference: Polish.md - Doodle/Notebook brand elements
 * Reference: Polish.md Principle VI - "Transitions Should Tell Stories"
 */

/**
 * Generate a smooth curved path between two points
 * 
 * Creates a Bezier curve with slight hand-drawn imperfection.
 * 
 * @param {object} start - Start point { x, y }
 * @param {object} end - End point { x, y }
 * @param {number} curvature - How curved the line is (0.3-0.7 typical)
 * @param {number} roughness - Hand-drawn variance in pixels (0-5)
 * @returns {string} - SVG path string
 */
export const generateFlowPath = (start, end, curvature = 0.5, roughness = 2) => {
  // Calculate control point for smooth curve
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const midX = start.x + dx / 2;
  const midY = start.y + dy / 2;
  
  // Offset perpendicular to line for curvature
  const perpX = -dy * curvature;
  const perpY = dx * curvature;
  
  const controlX = midX + perpX;
  const controlY = midY + perpY;
  
  // Add slight hand-drawn roughness
  const roughX = (Math.random() - 0.5) * roughness;
  const roughY = (Math.random() - 0.5) * roughness;
  
  return `M ${start.x},${start.y} Q ${controlX + roughX},${controlY + roughY} ${end.x},${end.y}`;
};

/**
 * Render flow lines between sequential elements
 * 
 * @param {Array} elements - Array of elements with positions { x, y, visible }
 * @param {object} config - Configuration
 * @param {string} config.color - Line color
 * @param {number} config.opacity - Line opacity (0-1)
 * @param {number} config.strokeWidth - Line thickness (1-3px typical)
 * @param {number} config.curvature - Curve amount (0.3-0.7)
 * @param {number} config.roughness - Hand-drawn variance (0-5px)
 * @param {boolean} config.dashed - Whether line is dashed
 * @returns {Array<JSX>} - Array of path elements
 * 
 * @example
 * const elements = [
 *   { x: 100, y: 200, visible: true },
 *   { x: 300, y: 350, visible: true },
 *   { x: 150, y: 500, visible: true }
 * ];
 * 
 * <svg viewBox="0 0 1920 1080">
 *   {renderFlowLines(elements, {
 *     color: '#27AE60',
 *     opacity: 0.3,
 *     strokeWidth: 2,
 *     curvature: 0.5
 *   })}
 * </svg>
 */
export const renderFlowLines = (elements, config = {}) => {
  const {
    color = '#CBD5E0',
    opacity = 0.3,
    strokeWidth = 2,
    curvature = 0.5,
    roughness = 2,
    dashed = false
  } = config;
  
  const lines = [];
  const visibleElements = elements.filter(el => el.visible);
  
  for (let i = 0; i < visibleElements.length - 1; i++) {
    const start = visibleElements[i];
    const end = visibleElements[i + 1];
    
    const path = generateFlowPath(
      { x: start.x, y: start.y },
      { x: end.x, y: end.y },
      curvature,
      roughness
    );
    
    lines.push(
      <path
        key={`flow-line-${i}`}
        d={path}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeOpacity={opacity}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={dashed ? "5,5" : undefined}
        style={{
          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
        }}
      />
    );
  }
  
  return lines;
};

/**
 * Get animated flow line (draw-on effect)
 * 
 * Animates a line being drawn from start to end.
 * 
 * @param {number} frame - Current frame
 * @param {object} config - Configuration
 * @param {number} config.startFrame - When drawing starts
 * @param {number} config.duration - Duration in seconds
 * @param {number} config.pathLength - Total path length in pixels
 * @param {number} fps - Frames per second
 * @returns {object} - { strokeDasharray, strokeDashoffset }
 * 
 * @example
 * const lineAnim = getAnimatedFlowLine(frame, {
 *   startFrame: 60,
 *   duration: 0.8,
 *   pathLength: 250
 * }, 30);
 * 
 * <path
 *   d={pathString}
 *   strokeDasharray={lineAnim.strokeDasharray}
 *   strokeDashoffset={lineAnim.strokeDashoffset}
 * />
 */
export const getAnimatedFlowLine = (frame, config, fps) => {
  const {
    startFrame = 0,
    duration = 0.8,
    pathLength = 200
  } = config;
  
  const durationFrames = duration * fps;
  const endFrame = startFrame + durationFrames;
  
  if (frame < startFrame) {
    return {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength // Not yet visible
    };
  }
  
  if (frame >= endFrame) {
    return {
      strokeDasharray: pathLength,
      strokeDashoffset: 0 // Fully drawn
    };
  }
  
  const progress = (frame - startFrame) / durationFrames;
  const offset = pathLength * (1 - progress);
  
  return {
    strokeDasharray: pathLength,
    strokeDashoffset: offset
  };
};

/**
 * Calculate positions for flow line endpoints
 * 
 * Helper to get icon center positions for connecting lines.
 * 
 * @param {Array} items - Array of item configs
 * @param {object} layoutConfig - Layout configuration
 * @returns {Array} - Array of { x, y, visible } positions
 */
export const calculateFlowLinePositions = (items, layoutConfig) => {
  const {
    style = 'vertical',
    leftOffset = 0.35,
    rightOffset = 0.65,
    verticalSpacing = 150,
    startY = 300,
    width = 1920
  } = layoutConfig;
  
  return items.map((item, i) => {
    const isLeft = style === 'staggered' ? i % 2 === 0 : true;
    const x = isLeft ? width * leftOffset : width * rightOffset;
    const y = startY + (i * verticalSpacing);
    
    return {
      x,
      y,
      visible: item.visible || false
    };
  });
};

/**
 * USAGE EXAMPLE:
 * 
 * ```javascript
 * // In template component:
 * const flowPositions = useMemo(() => {
 *   return takeaways.map((item, i) => {
 *     const isLeft = i % 2 === 0;
 *     return {
 *       x: isLeft ? width * 0.35 : width * 0.65,
 *       y: 300 + (i * 150),
 *       visible: frame >= itemVisibleFrame[i]
 *     };
 *   });
 * }, [takeaways, frame, width]);
 * 
 * // Render:
 * {config.decorations.showConnectingLines && (
 *   <svg className="absolute inset-0" viewBox={`0 0 ${width} ${height}`}>
 *     {renderFlowLines(flowPositions, {
 *       color: colors.accent,
 *       opacity: 0.3,
 *       strokeWidth: 2,
 *       curvature: 0.5
 *     })}
 *   </svg>
 * )}
 * ```
 */
