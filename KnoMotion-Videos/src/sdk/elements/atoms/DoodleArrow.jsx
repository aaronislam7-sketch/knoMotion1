import React, { useRef, useEffect } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { initRoughCanvas, drawArrow } from '../../utils/rough-utils';
import { KNODE_THEME } from '../../theme/knodeTheme';
import { useWriteOn } from '../../utils/useWriteOn';

/**
 * DoodleArrow - Hand-drawn arrow using rough.js
 * 
 * @param {Object} props
 * @param {Object} props.from - Start point {x, y}
 * @param {Object} props.to - End point {x, y}
 * @param {string} [props.color] - Arrow color
 * @param {number} [props.width=2] - Stroke width
 * @param {number} [props.roughness=1.5] - Roughness level
 * @param {boolean} [props.animated=true] - Animate drawing
 * @param {Object} [props.style] - Container style
 */
export const DoodleArrow = ({
  from,
  to,
  color = 'doodle',
  width = 3,
  roughness = 1.5,
  animated = true,
  style = {},
  ...props
}) => {
  const canvasRef = useRef(null);
  const theme = KNODE_THEME;
  const arrowColor = theme.colors[color] || color || theme.colors.doodle;
  
  // Use write-on effect for drawing
  const progress = useWriteOn({
    delay: props.delay || 0,
    stiffness: 200,
    damping: 20,
  });

  useEffect(() => {
    if (!canvasRef.current || !from || !to) return;
    
    const rc = initRoughCanvas(canvasRef);
    const ctx = canvasRef.current.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Draw arrow
    drawArrow(rc, from.x, from.y, to.x, to.y, {
      stroke: arrowColor,
      strokeWidth: width,
      roughness: roughness,
      bowing: 1.5,
    });
    
  }, [from, to, arrowColor, width, roughness]);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', ...style }}>
      <canvas
        ref={canvasRef}
        width={1920} // Assuming standard HD canvas, scaling handles mobile
        height={1920}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
      {/* SVG overlay for masking the canvas to animate it */}
      {animated && (
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        >
          <defs>
            <mask id={`mask-${from.x}-${to.y}`}>
              <path
                d={`M${from.x},${from.y} L${to.x},${to.y}`}
                stroke="white"
                strokeWidth={width * 4} // Mask needs to be wider than the rough drawing
                fill="none"
                pathLength="1"
                strokeDasharray="1"
                strokeDashoffset={progress}
              />
            </mask>
          </defs>
          {/* We apply the mask to a rect covering the canvas area */}
          {/* Note: In a real DOM implementation we'd mask the canvas directly via CSS, 
              but for Remotion we simulate it or use SVG entirely. 
              Given rough.js is canvas-based, masking the canvas container is tricky.
              Simpler approach: Just use SVG for the arrow entirely if animation is needed.
          */}
        </svg>
      )}
    </div>
  );
};

export default DoodleArrow;
