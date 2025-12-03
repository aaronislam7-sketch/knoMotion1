import React from 'react';
import { Img, useCurrentFrame, useVideoConfig } from 'remotion';
import { toFrames } from '../../core/time';
import { fadeIn, slideIn, scaleIn } from '../../animations';

const getAnimationStyle = (type, frame, startFrame, durationFrames, direction) => {
  switch (type) {
    case 'slide':
      return slideIn(frame, startFrame, durationFrames, direction, 60);
    case 'zoom':
      return scaleIn(frame, startFrame, durationFrames, 0.2);
    case 'fade':
    default:
      return fadeIn(frame, startFrame, durationFrames);
  }
};

/**
 * Static Image atom with lightweight animation + beat support
 */
export const ImageAtom = ({
  src,
  alt = '',
  fit = 'cover',
  borderRadius = 18,
  beats = { start: 0 },
  animation = { type: 'fade', duration: 0.6, direction: 'up' },
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!src) {
    return null;
  }

  const start = beats.start ?? 0;
  const duration = animation.duration ?? 0.6;
  const startFrame = toFrames(start, fps);
  const durationFrames = toFrames(duration, fps);
  const animStyle = getAnimationStyle(
    animation.type || 'fade',
    frame,
    startFrame,
    durationFrames,
    animation.direction || 'up',
  );

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        borderRadius,
        overflow: 'hidden',
        ...animStyle,
        ...style,
      }}
    >
      <Img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: fit,
        }}
      />
    </div>
  );
};

export default ImageAtom;
