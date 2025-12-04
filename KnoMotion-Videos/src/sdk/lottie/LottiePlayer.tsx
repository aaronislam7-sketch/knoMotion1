/**
 * LottiePlayer - Deterministic Lottie Integration for Remotion
 * 
 * Fetches Lottie animations from URLs (via registry or direct) and renders
 * them in sync with Remotion's deterministic timeline.
 * 
 * Usage:
 * ```tsx
 * // Via registry reference
 * <LottiePlayer lottieRef="success" />
 * 
 * // Via direct URL
 * <LottiePlayer lottieRef="https://assets.lottiefiles.com/..." />
 * ```
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
  resolveLottieRef,
  getLottiePreset,
  type LottiePreset,
  type LottieEntry,
} from './registry';

// ============================================================================
// TYPES
// ============================================================================

export interface LottiePlayerProps {
  /** Reference key from registry ('success') OR direct URL to Lottie JSON */
  lottieRef: string;
  /** Loop the animation (overrides registry default) */
  loop?: boolean;
  /** Playback speed multiplier (overrides registry default) */
  playbackRate?: number;
  /** CSS styles for the container */
  style?: React.CSSProperties;
  /** Class name for the container */
  className?: string;
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
// CORE LOTTIE FETCHER (follows Remotion docs exactly)
// ============================================================================

/**
 * Fetches and renders a Lottie animation from a URL.
 * Uses Remotion's delayRender pattern for deterministic loading.
 */
const LottieFetcher: React.FC<{
  url: string;
  loop: boolean;
  playbackRate: number;
  style?: React.CSSProperties;
}> = ({ url, loop, playbackRate, style }) => {
  // Create delay handle ONCE using useState initializer (per Remotion docs)
  const [handle] = useState(() => delayRender(`Loading Lottie: ${url}`));
  const [animationData, setAnimationData] = useState<LottieAnimationData | null>(null);

  useEffect(() => {
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch ${url}`);
        return res.json();
      })
      .then((json) => {
        setAnimationData(json);
        continueRender(handle);
      })
      .catch((err) => {
        console.error(`[LottiePlayer] Failed to load ${url}:`, err);
        cancelRender(err);
      });
  }, [handle, url]);

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

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const LottiePlayer: React.FC<LottiePlayerProps> = ({
  lottieRef,
  loop,
  playbackRate,
  style,
  className,
  startFrame = 0,
  autoEntrance = false,
  entranceDirection = 'fade',
  entranceDuration = 15,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Resolve the lottie reference to an entry with URL
  const entry = resolveLottieRef(lottieRef);

  // If entry not found, show warning and render nothing
  if (!entry) {
    if (frame === 0) {
      console.error(`[LottiePlayer] Could not resolve lottieRef: "${lottieRef}"`);
    }
    return null;
  }

  // Merge props with registry defaults
  const finalLoop = loop ?? entry.loop ?? true;
  const finalPlaybackRate = playbackRate ?? entry.playbackRate ?? 1;

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

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        ...style,
        ...entranceStyle,
      }}
    >
      <LottieFetcher
        url={entry.url}
        loop={finalLoop}
        playbackRate={finalPlaybackRate}
        style={{ width: '100%', height: '100%' }}
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
  Omit<LottiePlayerProps, 'style'> & { size?: number; delay?: number }
> = ({ size = 48, delay = 0, startFrame = 0, ...props }) => (
  <LottiePlayer
    {...props}
    startFrame={startFrame + delay}
    style={{
      width: size,
      height: size,
      display: 'inline-flex',
    }}
  />
);

/**
 * Full-screen overlay Lottie (e.g., for celebrations)
 */
export const LottieOverlay: React.FC<
  Omit<LottiePlayerProps, 'style'> & { 
    zIndex?: number;
    opacity?: number;
    duration?: number;
  }
> = ({ zIndex = 100, opacity = 1, startFrame = 0, duration, ...props }) => {
  const frame = useCurrentFrame();

  // If duration specified, hide after that many frames
  if (duration && frame > startFrame + duration) {
    return null;
  }

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex,
        opacity,
      }}
    >
      <LottiePlayer {...props} startFrame={startFrame} style={{ width: 300, height: 300 }} />
    </AbsoluteFill>
  );
};

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
// HOOK FOR ADVANCED USE CASES
// ============================================================================

/**
 * Hook to get Lottie entry info without rendering
 * Useful for checking if a lottieRef exists, getting metadata, etc.
 */
export const useLottieEntry = (lottieRef: string): LottieEntry | null => {
  return resolveLottieRef(lottieRef);
};

// ============================================================================
// BACKWARD COMPATIBILITY
// ============================================================================

/** @deprecated Use LottiePlayer instead */
export const RemotionLottie = LottiePlayer;

/** @deprecated Use LottiePlayer instead */
export const AnimatedLottie = LottiePlayer;

export default LottiePlayer;
