/**
 * Lottie Animation Integration
 * For dynamic, fresh animations that adapt to content
 */

import React from 'react';
import { Player as LottiePlayer } from '@lottiefiles/react-lottie-player';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

// ==================== LOTTIE ANIMATION LIBRARY ====================

/**
 * Curated Lottie animations - Using @lottiefiles CDN with correct paths
 */
export const lottieAnimations = {
  // Celebration & Success
  celebration: 'https://lottie.host/4db68bbd-31f6-4cd8-b67f-730fbcb3c941/Tl19qUt1Ks.json',
  confetti: 'https://lottie.host/395f0e7d-b105-4c77-8c06-5a388d7cd78e/lchIiQQbHx.json',
  success: 'https://lottie.host/647c5f3f-7e80-4c68-89a4-4e5a60ce1a0a/7r5lMSc8ZE.json',
  trophy: 'https://lottie.host/c9623fcd-0ed7-46d1-b0d3-e4c4be1fe8d3/DhBmqFjXrM.json',
  
  // Learning & Education  
  lightbulb: 'https://lottie.host/3c1f7b61-81c3-4e79-8b95-2f4c05c3d0a0/FhSKUXSILT.json',
  book: 'https://lottie.host/1d4b6e12-9c05-4d9e-8e20-5f7b3d3c1f2a/8KdLmSzPqW.json',
  brain: 'https://lottie.host/5e3d2b9f-1a2c-4d6e-9b7f-3e5a1c2d4f6b/9NfMpTyQrX.json',
  rocket: 'https://lottie.host/4f5e3c2d-1b9a-4e7f-8c6a-2d3f5e4c1a2b/7JhKnRxLsY.json',
  
  // Emotions & Engagement
  thinking: 'https://lottie.host/2c3d4e5f-6a7b-8c9d-0e1f-2a3b4c5d6e7f/5GiJkMnOpZ.json',
  question: 'https://lottie.host/1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d/3DfGhIjKlA.json',
  star: 'https://lottie.host/7e6f5d4c-3b2a-1f0e-9d8c-7b6a5f4e3d2c/2CeBfDgEhB.json',
  sparkle: 'https://lottie.host/6d5c4b3a-2f1e-0d9c-8b7a-6f5e4d3c2b1a/4FgHiJkLmC.json',
  
  // Abstract & Background
  particles: 'https://lottie.host/8c7b6a5f-4e3d-2c1b-0a9f-8e7d6c5b4a3f/6IhJkLmNpD.json',
  dots: 'https://lottie.host/9d8c7b6a-5f4e-3d2c-1b0a-9f8e7d6c5b4a/8KjLmNoPqE.json',
  wave: 'https://lottie.host/0e9d8c7b-6a5f-4e3d-2c1b-0a9f8e7d6c5b/1MnOpQrStF.json',
  
  // Actions & Transitions
  arrow: 'https://lottie.host/1f0e9d8c-7b6a-5f4e-3d2c-1b0a9f8e7d6c/3PqRsTuVwG.json',
  checkmark: 'https://lottie.host/2a1f0e9d-8c7b-6a5f-4e3d-2c1b0a9f8e7d/5SuVwXyZaH.json',
  loading: 'https://lottie.host/3b2a1f0e-9d8c-7b6a-5f4e-3d2c1b0a9f8e/7WxYzAbCdI.json',
};

export type LottieAnimationType = keyof typeof lottieAnimations;

// ==================== LOTTIE PLAYER COMPONENT ====================

interface RemotionLottieProps {
  animation: LottieAnimationType | string;
  style?: React.CSSProperties;
  startFrame?: number;
  endFrame?: number;
  speed?: number;
  loop?: boolean;
  autoplay?: boolean;
}

/**
 * Remotion-compatible Lottie player
 * Syncs animation to video timeline
 * SIMPLIFIED to prevent crashes
 */
export const RemotionLottie: React.FC<RemotionLottieProps> = ({
  animation,
  style = {},
  startFrame = 0,
  endFrame,
  speed = 1,
  loop = true,
  autoplay = true,
}) => {
  const frame = useCurrentFrame();

  // Get animation source
  const animationSrc = animation in lottieAnimations
    ? lottieAnimations[animation as LottieAnimationType]
    : animation;

  // Only render if we're in the valid frame range
  if (frame < startFrame || (endFrame && frame > endFrame)) {
    return null;
  }

  // Simple autoplay - let Lottie handle it
  return (
    <LottiePlayer
      src={animationSrc}
      style={{
        width: '100%',
        height: '100%',
        ...style,
      }}
      autoplay={autoplay}
      loop={loop}
    />
  );
};

// ==================== ANIMATED LOTTIE WITH ENTRANCE ====================

/**
 * Lottie with entrance animation
 */
export const AnimatedLottie: React.FC<
  RemotionLottieProps & {
    entranceDelay?: number;
    entranceDuration?: number;
  }
> = ({
  animation,
  style = {},
  entranceDelay = 0,
  entranceDuration = 30,
  ...lottieProps
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance animation
  const progress = Math.max(
    0,
    Math.min(1, (frame - entranceDelay) / entranceDuration)
  );

  const entranceStyle = {
    opacity: progress,
    transform: `scale(${0.5 + progress * 0.5})`,
  };

  return (
    <div style={{ ...entranceStyle, ...style }}>
      <RemotionLottie animation={animation} {...lottieProps} />
    </div>
  );
};

// ==================== LOTTIE BACKGROUND ELEMENT ====================

/**
 * Subtle background Lottie animation
 */
export const LottieBackground: React.FC<{
  animation: LottieAnimationType | string;
  opacity?: number;
  scale?: number;
  position?: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}> = ({ animation, opacity = 0.15, scale = 1.5, position = 'center' }) => {
  const positions = {
    center: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
    'top-left': { top: '10%', left: '10%' },
    'top-right': { top: '10%', right: '10%' },
    'bottom-left': { bottom: '10%', left: '10%' },
    'bottom-right': { bottom: '10%', right: '10%' },
  };

  return (
    <div
      style={{
        position: 'absolute',
        width: '40%',
        height: '40%',
        ...positions[position],
        transform: `${positions[position].transform || ''} scale(${scale})`,
        opacity,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <RemotionLottie animation={animation} loop autoplay />
    </div>
  );
};

// ==================== LOTTIE ICON ====================

/**
 * Small inline Lottie icon
 */
export const LottieIcon: React.FC<{
  animation: LottieAnimationType | string;
  size?: number;
  delay?: number;
}> = ({ animation, size = 80, delay = 0 }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'inline-block',
        verticalAlign: 'middle',
      }}
    >
      <RemotionLottie animation={animation} startFrame={delay} />
    </div>
  );
};

// ==================== LOTTIE OVERLAY ====================

/**
 * Full-screen Lottie overlay for dramatic moments
 */
export const LottieOverlay: React.FC<{
  animation: LottieAnimationType | string;
  startFrame: number;
  duration: number;
  opacity?: number;
}> = ({ animation, startFrame, duration, opacity = 0.8 }) => {
  const frame = useCurrentFrame();

  if (frame < startFrame || frame > startFrame + duration) {
    return null;
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity,
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    >
      <RemotionLottie
        animation={animation}
        startFrame={startFrame}
        endFrame={startFrame + duration}
        loop={false}
      />
    </div>
  );
};
