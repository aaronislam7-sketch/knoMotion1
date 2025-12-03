/**
 * Lottie Animation Integration
 * 
 * @deprecated This file is maintained for backward compatibility.
 * Please import from './index' instead.
 * 
 * @module lottie/lottieIntegration
 */

// Re-export everything from the consolidated module
export {
  LottiePlayer,
  LottiePlayer as RemotionLottie,
  LottiePlayer as AnimatedLottie,
  LottieIcon,
  LottieOverlay,
  LottieFromPreset,
  useLottieEntry,
} from './LottiePlayer';

export {
  resolveLottieRef,
  resolveLottieSource,
  LOTTIE_REGISTRY,
  getLottiePreset,
} from './registry';

// LottieBackground - preserved for backward compatibility
import React from 'react';
import { LottiePlayer } from './LottiePlayer';

export const LottieBackground: React.FC<{
  lottieRef: string;
  opacity?: number;
  scale?: number;
  position?: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}> = ({ lottieRef, opacity = 0.15, scale = 1.5, position = 'center' }) => {
  const positions: Record<string, React.CSSProperties> = {
    center: { top: '50%', left: '50%', transform: `translate(-50%, -50%) scale(${scale})` },
    'top-left': { top: '10%', left: '10%', transform: `scale(${scale})` },
    'top-right': { top: '10%', right: '10%', transform: `scale(${scale})` },
    'bottom-left': { bottom: '10%', left: '10%', transform: `scale(${scale})` },
    'bottom-right': { bottom: '10%', right: '10%', transform: `scale(${scale})` },
  };

  return (
    <div
      style={{
        position: 'absolute',
        width: '40%',
        height: '40%',
        ...positions[position],
        opacity,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <LottiePlayer lottieRef={lottieRef} loop />
    </div>
  );
};
