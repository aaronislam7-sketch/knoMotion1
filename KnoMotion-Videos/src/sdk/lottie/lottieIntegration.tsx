/**
 * Lottie Animation Integration (MIGRATED to @remotion/lottie)
 * For dynamic, fresh animations that adapt to content
 * 
 * MIGRATION NOTES:
 * - Now uses @remotion/lottie (proper Remotion integration)
 * - Uses animationData prop (JSON object) instead of src (URL)
 * - All animations loaded from /public/lotties/ directory
 * - Proper timeline sync with Remotion
 */

import React from 'react';
import { Lottie, LottieAnimationData } from '@remotion/lottie';
import { useCurrentFrame, useVideoConfig, interpolate, staticFile } from 'remotion';

// ==================== LOCAL LOTTIE IMPORTS ====================

// Import local Lottie JSON files
// Note: Using staticFile() for proper bundling
const successCheckmark = staticFile('lotties/success-checkmark.json');
const loadingSpinner = staticFile('lotties/loading-spinner.json');
const particleBurst = staticFile('lotties/particle-burst.json');
const celebrationStars = staticFile('lotties/celebration-stars.json');

/**
 * Lottie animation registry (local files)
 * Maps animation names to file paths
 */
export const lottieAnimations = {
  // Celebration & Success
  success: successCheckmark,
  celebration: celebrationStars,
  checkmark: successCheckmark,
  stars: celebrationStars,
  
  // Loading & Progress
  loading: loadingSpinner,
  spinner: loadingSpinner,
  
  // Effects & Particles
  particles: particleBurst,
  burst: particleBurst,
  
  // Add more animations as needed...
};

export type LottieAnimationType = keyof typeof lottieAnimations;

// ==================== HELPER: FETCH LOTTIE DATA ====================

/**
 * Fetch Lottie animation data from URL
 * Used internally by components
 */
const fetchLottieData = async (url: string): Promise<LottieAnimationData | null> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch Lottie animation: ${url}`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching Lottie animation:`, error);
    return null;
  }
};

// ==================== REMOTION LOTTIE COMPONENT ====================

interface RemotionLottieProps {
  lottieRef: string; // Standardized prop name!
  style?: React.CSSProperties;
  startFrame?: number;
  endFrame?: number;
  playbackRate?: number; // Renamed from 'speed' to match @remotion/lottie
  loop?: boolean;
}

/**
 * Remotion-compatible Lottie player with proper timeline sync
 * Uses @remotion/lottie for deterministic rendering
 * 
 * @param lottieRef - Animation name or file path (STANDARDIZED)
 */
export const RemotionLottie: React.FC<RemotionLottieProps> = ({
  lottieRef,
  style = {},
  startFrame = 0,
  endFrame,
  playbackRate = 1,
  loop = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [animationData, setAnimationData] = React.useState<LottieAnimationData | null>(null);

  // Get animation source
  const animationSrc = lottieRef in lottieAnimations
    ? lottieAnimations[lottieRef as LottieAnimationType]
    : lottieRef;

  // Fetch animation data
  React.useEffect(() => {
    fetchLottieData(animationSrc).then(setAnimationData);
  }, [animationSrc]);

  // Only render if we're in the valid frame range
  if (frame < startFrame || (endFrame && frame > endFrame)) {
    return null;
  }

  // Don't render until animation data is loaded
  if (!animationData) {
    return null;
  }

  // Calculate animation progress (for proper timeline sync)
  const relativeFrame = frame - startFrame;
  const totalFrames = endFrame ? endFrame - startFrame : 9999;

  return (
    <div style={{ width: '100%', height: '100%', ...style }}>
      <Lottie
        animationData={animationData}
        style={{ width: '100%', height: '100%' }}
        playbackRate={playbackRate}
        loop={loop}
      />
    </div>
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
  lottieRef,
  style = {},
  entranceDelay = 0,
  entranceDuration = 30,
  ...lottieProps
}) => {
  const frame = useCurrentFrame();

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
      <RemotionLottie lottieRef={lottieRef} {...lottieProps} />
    </div>
  );
};

// ==================== LOTTIE BACKGROUND ELEMENT ====================

/**
 * Subtle background Lottie animation
 */
export const LottieBackground: React.FC<{
  lottieRef: string; // STANDARDIZED
  opacity?: number;
  scale?: number;
  position?: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}> = ({ lottieRef, opacity = 0.15, scale = 1.5, position = 'center' }) => {
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
      <RemotionLottie lottieRef={lottieRef} loop />
    </div>
  );
};

// ==================== LOTTIE ICON ====================

/**
 * Small inline Lottie icon
 */
export const LottieIcon: React.FC<{
  lottieRef: string; // STANDARDIZED
  size?: number;
  delay?: number;
}> = ({ lottieRef, size = 80, delay = 0 }) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'inline-block',
        verticalAlign: 'middle',
      }}
    >
      <RemotionLottie lottieRef={lottieRef} startFrame={delay} />
    </div>
  );
};

// ==================== LOTTIE OVERLAY ====================

/**
 * Full-screen Lottie overlay for dramatic moments
 */
export const LottieOverlay: React.FC<{
  lottieRef: string; // STANDARDIZED
  startFrame: number;
  duration: number;
  opacity?: number;
}> = ({ lottieRef, startFrame, duration, opacity = 0.8 }) => {
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
        lottieRef={lottieRef}
        startFrame={startFrame}
        endFrame={startFrame + duration}
        loop={false}
      />
    </div>
  );
};

// ==================== EXPORT LEGACY NAMES ====================

// For backward compatibility (will be deprecated)
export { RemotionLottie as LottiePlayer };
