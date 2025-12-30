import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';

/**
 * Scene Transition Component
 * 
 * Creates a smooth eraser/wipe effect between scenes
 * to make the video feel cohesive rather than stitched together
 * 
 * @param {object} props
 * @param {number} props.durationInFrames - How long the transition takes
 * @param {string} props.type - Type of transition: 'erase', 'wipe', 'fade'
 */
export const SceneTransition = ({ 
  durationInFrames = 30, 
  type = 'erase',
  color = '#fafafa' 
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  if (type === 'erase') {
    // Eraser wipe from left to right
    const progress = interpolate(
      frame,
      [0, durationInFrames],
      [0, 1],
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.bezier(0.65, 0, 0.35, 1)
      }
    );

    const eraserX = progress * width;
    const eraserWidth = 200;

    return (
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1000
      }}>
        {/* Erased area */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: eraserX,
          height: '100%',
          backgroundColor: color
        }} />

        {/* Eraser tool visual */}
        {frame < durationInFrames && (
          <div style={{
            position: 'absolute',
            left: eraserX - eraserWidth / 2,
            top: '50%',
            transform: 'translateY(-50%) rotate(-15deg)',
            width: eraserWidth,
            height: 80,
            background: 'linear-gradient(135deg, #e8e8e8 0%, #c0c0c0 50%, #a8a8a8 100%)',
            borderRadius: 10,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            border: '2px solid #888',
            opacity: Math.min(frame / 10, 1) * Math.max(1 - (frame - durationInFrames + 10) / 10, 0)
          }}>
            {/* Pink eraser tip */}
            <div style={{
              position: 'absolute',
              right: -5,
              top: -5,
              width: 60,
              height: 90,
              backgroundColor: '#ffb3ba',
              borderRadius: 8,
              border: '2px solid #ff8fa3',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
            }} />
            
            {/* Eraser particles */}
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  right: -20 - i * 15,
                  top: Math.random() * 80,
                  width: 6 + Math.random() * 8,
                  height: 6 + Math.random() * 8,
                  backgroundColor: '#ddd',
                  borderRadius: '50%',
                  opacity: 0.6 - i * 0.1
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (type === 'wipe') {
    // Simple wipe from bottom to top
    const progress = interpolate(
      frame,
      [0, durationInFrames],
      [0, 1],
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.bezier(0.65, 0, 0.35, 1)
      }
    );

    return (
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: `${progress * 100}%`,
        backgroundColor: color,
        zIndex: 1000
      }} />
    );
  }

  if (type === 'fade') {
    // Fade to color
    const opacity = interpolate(
      frame,
      [0, durationInFrames],
      [0, 1],
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp'
      }
    );

    return (
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: color,
        opacity,
        zIndex: 1000
      }} />
    );
  }

  return null;
};

/**
 * Transition container that handles the fade out/in between two scenes
 */
export const TransitionBetweenScenes = ({ 
  fromScene, 
  toScene, 
  transitionDuration = 30,
  type = 'erase'
}) => {
  return (
    <>
      {/* Outgoing scene with transition overlay */}
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {fromScene}
        <SceneTransition 
          durationInFrames={transitionDuration} 
          type={type}
        />
      </div>
    </>
  );
};

export default SceneTransition;
