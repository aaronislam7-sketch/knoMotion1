/**
 * LottiePlayer - Deterministic Lottie Integration for Remotion
 * 
 * Follows Remotion's official pattern exactly:
 * https://www.remotion.dev/docs/lottie
 * 
 * @module lottie/LottiePlayer
 */

import React, { useEffect, useState } from 'react';
import { Lottie, LottieAnimationData } from '@remotion/lottie';
import {
  useCurrentFrame,
  useVideoConfig,
  delayRender,
  continueRender,
  cancelRender,
  interpolate,
  spring,
  AbsoluteFill,
} from 'remotion';
import {
  resolveLottieSource,
  getLottiePreset,
  type LottiePreset,
} from './registry';

// ============================================================================
// TYPES
// ============================================================================

export interface LottiePlayerProps {
  /** Reference key from registry OR direct URL to Lottie JSON */
  lottieRef: string;
  /** Loop the animation */
  loop?: boolean;
  /** Playback speed multiplier */
  playbackRate?: number;
  /** CSS styles for the container */
  style?: React.CSSProperties;
  /** Class name for the container */
  className?: string;
  /** Custom animation data (bypasses registry/fetch) */
  animationData?: LottieAnimationData;
  /** Frame at which animation should start playing */
  startFrame?: number;
  /** Whether to animate entrance */
  autoEntrance?: boolean;
  /** Direction to animate in from */
  entranceDirection?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade';
  /** Duration of entrance animation in frames */
  entranceDuration?: number;
}

// ============================================================================
// SIMPLE LOTTIE COMPONENT (follows Remotion docs exactly)
// ============================================================================

/**
 * SimpleLottie - Fetches and renders a Lottie from URL
 * Follows Remotion's exact pattern from docs
 */
const SimpleLottieFromUrl: React.FC<{
  src: string;
  loop?: boolean;
  playbackRate?: number;
  style?: React.CSSProperties;
}> = ({ src, loop = true, playbackRate = 1, style }) => {
  // Create delay handle ONCE using useState initializer (per Remotion docs)
  const [handle] = useState(() => delayRender(`Loading Lottie: ${src}`));
  const [animationData, setAnimationData] = useState<LottieAnimationData | null>(null);

  useEffect(() => {
    fetch(src)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        setAnimationData(json);
        continueRender(handle);
      })
      .catch((err) => {
        console.error(`[Lottie] Failed to load ${src}:`, err);
        cancelRender(err);
      });
  }, [handle, src]);

  if (!animationData) {
    return null;
  }

  return (
    <Lottie
      animationData={animationData}
      loop={loop}
      playbackRate={playbackRate}
      style={style}
    />
  );
};

/**
 * SimpleLottie - Renders inline Lottie data directly
 */
const SimpleLottieFromData: React.FC<{
  data: LottieAnimationData;
  loop?: boolean;
  playbackRate?: number;
  style?: React.CSSProperties;
}> = ({ data, loop = true, playbackRate = 1, style }) => {
  return (
    <Lottie
      animationData={data}
      loop={loop}
      playbackRate={playbackRate}
      style={style}
    />
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const LottiePlayer: React.FC<LottiePlayerProps> = ({
  lottieRef,
  loop = true,
  playbackRate = 1,
  style,
  className,
  animationData: providedData,
  startFrame = 0,
  autoEntrance = false,
  entranceDirection = 'fade',
  entranceDuration = 15,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Resolve the lottie source from registry
  const source = resolveLottieSource(lottieRef);
  
  // Debug logging (remove in production)
  if (frame === 0) {
    console.log(`[LottiePlayer] lottieRef="${lottieRef}" source.kind="${source?.kind}" hasProvidedData=${!!providedData}`);
  }

  // Calculate entrance animation if enabled
  const entranceProgress = autoEntrance
    ? spring({
        frame: Math.max(0, frame - startFrame),
        fps,
        config: { damping: 15, mass: 1, stiffness: 120 },
        durationInFrames: entranceDuration,
      })
    : 1;

  const entranceStyle: React.CSSProperties = {};
  if (autoEntrance && entranceProgress < 1) {
    entranceStyle.opacity = interpolate(entranceProgress, [0, 1], [0, 1]);
    
    switch (entranceDirection) {
      case 'up':
        entranceStyle.transform = `translateY(${interpolate(entranceProgress, [0, 1], [30, 0])}px)`;
        break;
      case 'down':
        entranceStyle.transform = `translateY(${interpolate(entranceProgress, [0, 1], [-30, 0])}px)`;
        break;
      case 'left':
        entranceStyle.transform = `translateX(${interpolate(entranceProgress, [0, 1], [30, 0])}px)`;
        break;
      case 'right':
        entranceStyle.transform = `translateX(${interpolate(entranceProgress, [0, 1], [-30, 0])}px)`;
        break;
      case 'scale':
        entranceStyle.transform = `scale(${interpolate(entranceProgress, [0, 1], [0.8, 1])})`;
        break;
    }
  }

  // Don't render before start frame
  if (frame < startFrame) {
    return null;
  }

  // Render based on data source
  const renderLottie = () => {
    // If animation data is provided directly, use it
    if (providedData) {
      return (
        <SimpleLottieFromData
          data={providedData}
          loop={loop}
          playbackRate={playbackRate}
          style={{ width: '100%', height: '100%' }}
        />
      );
    }

    // If source is inline data from registry
    if (source?.kind === 'inline') {
      return (
        <SimpleLottieFromData
          data={source.data}
          loop={loop}
          playbackRate={playbackRate}
          style={{ width: '100%', height: '100%' }}
        />
      );
    }

    // If source is a static file URL
    if (source?.kind === 'static') {
      return (
        <SimpleLottieFromUrl
          src={source.src}
          loop={loop}
          playbackRate={playbackRate}
          style={{ width: '100%', height: '100%' }}
        />
      );
    }

    // If lottieRef looks like a URL, fetch it directly
    if (lottieRef.startsWith('http') || lottieRef.startsWith('/')) {
      return (
        <SimpleLottieFromUrl
          src={lottieRef}
          loop={loop}
          playbackRate={playbackRate}
          style={{ width: '100%', height: '100%' }}
        />
      );
    }

    // Fallback - source not found
    console.warn(`[LottiePlayer] Could not resolve lottieRef: ${lottieRef}`);
    return null;
  };

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
      {renderLottie()}
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
// HOOK FOR CUSTOM USE CASES
// ============================================================================

/**
 * Hook to load Lottie data following Remotion's pattern
 * Use this when you need the raw animation data
 */
export const useLottieData = (
  lottieRef: string
): { data: LottieAnimationData | null; error: Error | null } => {
  const source = resolveLottieSource(lottieRef);
  
  // For inline data, return immediately
  if (source?.kind === 'inline') {
    return { data: source.data, error: null };
  }

  const [handle] = useState(() => 
    source?.kind === 'static' ? delayRender(`Loading Lottie: ${lottieRef}`) : null
  );
  const [data, setData] = useState<LottieAnimationData | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!source || source.kind !== 'static' || handle === null) return;

    fetch(source.src)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        setData(json);
        continueRender(handle);
      })
      .catch((err) => {
        setError(err);
        cancelRender(err);
      });
  }, [handle, source]);

  return { data, error };
};

// ============================================================================
// BACKWARD COMPATIBILITY
// ============================================================================

/** @deprecated Use LottiePlayer instead */
export const RemotionLottie = LottiePlayer;

/** @deprecated Use LottiePlayer instead */
export const AnimatedLottie = LottiePlayer;

export default LottiePlayer;
