/**
 * LottiePlayer - Deterministic Lottie Integration for Remotion
 * 
 * This component properly handles async Lottie loading for video rendering
 * using delayRender/continueRender for deterministic output.
 * 
 * @module lottie/LottiePlayer
 */

import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { Lottie, LottieAnimationData } from '@remotion/lottie';
import {
  useCurrentFrame,
  useVideoConfig,
  delayRender,
  continueRender,
  interpolate,
  spring,
  AbsoluteFill,
} from 'remotion';
import {
  resolveLottieSource,
  getLottiePreset,
  type LottieSource,
  type LottiePreset,
} from './registry';

// ============================================================================
// TYPES
// ============================================================================

export interface LottiePlayerProps {
  /** Reference key from registry or direct path/URL */
  lottieRef: string;
  /** Loop the animation */
  loop?: boolean;
  /** Playback speed multiplier */
  playbackRate?: number;
  /** CSS styles for the container */
  style?: React.CSSProperties;
  /** Class name for the container */
  className?: string;
  /** Custom animation data (bypasses registry) */
  animationData?: LottieAnimationData;
  /** Frame at which animation should start playing (relative to composition) */
  startFrame?: number;
  /** Whether to show on load or wait for entrance */
  autoEntrance?: boolean;
  /** Direction to animate in from */
  entranceDirection?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade';
  /** Duration of entrance animation in frames */
  entranceDuration?: number;
  /** Callback when animation data is loaded */
  onLoad?: () => void;
}

// ============================================================================
// CACHE (singleton for performance)
// ============================================================================

const animationCache = new Map<string, LottieAnimationData>();

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Resolve animation data synchronously for initial state
 * This handles inline animations immediately without waiting for useEffect
 */
const resolveInitialData = (
  lottieRef: string,
  providedData?: LottieAnimationData
): LottieAnimationData | null => {
  // Provided data takes priority
  if (providedData) return providedData;
  
  // Check cache
  if (animationCache.has(lottieRef)) return animationCache.get(lottieRef)!;
  
  // Try to resolve inline data immediately (no fetch needed)
  const source = resolveLottieSource(lottieRef);
  if (source?.kind === 'inline') {
    animationCache.set(lottieRef, source.data);
    return source.data;
  }
  
  return null;
};

/**
 * Hook to load Lottie animation data with proper delayRender handling
 */
export const useLottieData = (
  lottieRef: string,
  providedData?: LottieAnimationData
): LottieAnimationData | null => {
  const [animationData, setAnimationData] = useState<LottieAnimationData | null>(() => {
    // Resolve initial data synchronously (handles inline + cached)
    return resolveInitialData(lottieRef, providedData);
  });

  const delayHandleRef = useRef<number | null>(null);

  useEffect(() => {
    // If we already have data, no need to load
    if (animationData || providedData) return;

    // Resolve source from registry
    const source = resolveLottieSource(lottieRef);
    if (!source) {
      console.error(`[LottiePlayer] Failed to resolve lottieRef: ${lottieRef}`);
      return;
    }

    // Inline data should already be resolved in initial state, but handle just in case
    if (source.kind === 'inline') {
      setAnimationData(source.data);
      animationCache.set(lottieRef, source.data);
      return;
    }

    // Handle static file - use delayRender for deterministic loading
    delayHandleRef.current = delayRender(`Loading Lottie: ${lottieRef}`);

    fetch(source.src)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch Lottie: ${res.status}`);
        }
        return res.json();
      })
      .then((data: LottieAnimationData) => {
        animationCache.set(lottieRef, data);
        setAnimationData(data);
        if (delayHandleRef.current !== null) {
          continueRender(delayHandleRef.current);
          delayHandleRef.current = null;
        }
      })
      .catch((err) => {
        console.error(`[LottiePlayer] Failed to load ${lottieRef}:`, err);
        if (delayHandleRef.current !== null) {
          continueRender(delayHandleRef.current);
          delayHandleRef.current = null;
        }
      });

    return () => {
      // Cleanup delay if component unmounts before load completes
      if (delayHandleRef.current !== null) {
        continueRender(delayHandleRef.current);
        delayHandleRef.current = null;
      }
    };
  }, [lottieRef, animationData, providedData]);

  return providedData || animationData;
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const LottiePlayer: React.FC<LottiePlayerProps> = ({
  lottieRef,
  loop = false,
  playbackRate = 1,
  style,
  className,
  animationData: providedData,
  startFrame = 0,
  autoEntrance = true,
  entranceDirection = 'fade',
  entranceDuration = 15,
  onLoad,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const animationData = useLottieData(lottieRef, providedData);

  // Call onLoad when data becomes available
  useEffect(() => {
    if (animationData && onLoad) {
      onLoad();
    }
  }, [animationData, onLoad]);

  // Calculate entrance animation values
  const entranceProgress = useMemo(() => {
    if (!autoEntrance) return 1;
    return spring({
      frame: frame - startFrame,
      fps,
      config: { damping: 15, mass: 1, stiffness: 120 },
      durationInFrames: entranceDuration,
    });
  }, [frame, startFrame, fps, entranceDuration, autoEntrance]);

  // Compute entrance transform
  const entranceStyle = useMemo((): React.CSSProperties => {
    if (!autoEntrance || entranceProgress >= 1) return {};

    const opacity = interpolate(entranceProgress, [0, 1], [0, 1]);

    switch (entranceDirection) {
      case 'up':
        return {
          opacity,
          transform: `translateY(${interpolate(entranceProgress, [0, 1], [30, 0])}px)`,
        };
      case 'down':
        return {
          opacity,
          transform: `translateY(${interpolate(entranceProgress, [0, 1], [-30, 0])}px)`,
        };
      case 'left':
        return {
          opacity,
          transform: `translateX(${interpolate(entranceProgress, [0, 1], [30, 0])}px)`,
        };
      case 'right':
        return {
          opacity,
          transform: `translateX(${interpolate(entranceProgress, [0, 1], [-30, 0])}px)`,
        };
      case 'scale':
        return {
          opacity,
          transform: `scale(${interpolate(entranceProgress, [0, 1], [0.8, 1])})`,
        };
      case 'fade':
      default:
        return { opacity };
    }
  }, [entranceProgress, entranceDirection, autoEntrance]);

  // Don't render before start frame
  if (frame < startFrame) {
    return null;
  }

  // Don't render if animation data hasn't loaded yet
  if (!animationData) {
    return null;
  }

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
        ...entranceStyle,
      }}
    >
      <Lottie
        animationData={animationData}
        playbackRate={playbackRate}
        loop={loop}
      />
    </div>
  );
};

// ============================================================================
// VARIANT COMPONENTS
// ============================================================================

/**
 * Icon-sized Lottie (40-80px)
 */
export const LottieIcon: React.FC<
  Omit<LottiePlayerProps, 'style'> & { size?: number }
> = ({ size = 48, ...props }) => (
  <LottiePlayer
    {...props}
    style={{
      width: size,
      height: size,
      display: 'inline-flex',
    }}
  />
);

/**
 * Full-screen overlay Lottie
 */
export const LottieOverlay: React.FC<
  Omit<LottiePlayerProps, 'style'> & { zIndex?: number }
> = ({ zIndex = 100, ...props }) => (
  <AbsoluteFill
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none',
      zIndex,
    }}
  >
    <LottiePlayer {...props} style={{ width: 300, height: 300 }} />
  </AbsoluteFill>
);

/**
 * Create a Lottie player from a preset
 */
export const LottieFromPreset: React.FC<{
  preset: string;
  overrides?: Partial<LottiePreset>;
  startFrame?: number;
  className?: string;
}> = ({ preset, overrides, startFrame, className }) => {
  const config = getLottiePreset(preset, overrides);
  
  return (
    <LottiePlayer
      lottieRef={config.lottieRef}
      loop={config.loop}
      playbackRate={config.playbackRate}
      style={config.style}
      startFrame={startFrame ?? config.entranceDelay ?? 0}
      entranceDuration={config.entranceDuration ?? 15}
      className={className}
    />
  );
};

// ============================================================================
// BACKWARD COMPATIBILITY ALIAS
// ============================================================================

/**
 * @deprecated Use LottiePlayer instead
 */
export const RemotionLottie = LottiePlayer;

/**
 * @deprecated Use LottiePlayer instead
 */
export const AnimatedLottie = LottiePlayer;

// ============================================================================
// EXPORTS
// ============================================================================

export default LottiePlayer;
