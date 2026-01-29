/**
 * LottiePlayer Component
 * 
 * Wrapper around lottie-react that integrates with KnoMotion's Lottie registry.
 */

import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import { motion } from 'framer-motion';
import { resolveLottieRef, LottieEntry } from '../theme';
import { fadeInScale } from '../animations';

export interface LottiePlayerProps {
  /** Lottie reference - either a registry key or direct URL */
  lottieRef: string;
  /** Whether to loop the animation */
  loop?: boolean;
  /** Whether to autoplay */
  autoplay?: boolean;
  /** Playback speed (1 = normal) */
  speed?: number;
  /** Width of the player */
  width?: number | string;
  /** Height of the player */
  height?: number | string;
  /** Additional CSS classes */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
  /** Whether to animate entrance */
  animate?: boolean;
  /** Callback when animation completes (for non-looping) */
  onComplete?: () => void;
}

export const LottiePlayer: React.FC<LottiePlayerProps> = ({
  lottieRef,
  loop,
  autoplay = true,
  speed = 1,
  width = 100,
  height = 100,
  className = '',
  style = {},
  animate = false,
  onComplete,
}) => {
  const [animationData, setAnimationData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAnimation = async () => {
      setIsLoading(true);
      setError(null);

      const entry = resolveLottieRef(lottieRef);
      
      if (!entry) {
        setError(`Lottie not found: ${lottieRef}`);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(entry.url);
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        const data = await response.json();
        setAnimationData(data);
      } catch (err) {
        setError(`Failed to load lottie: ${err}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnimation();
  }, [lottieRef]);

  // Determine loop behavior - use prop if provided, otherwise use registry default
  const entry = resolveLottieRef(lottieRef);
  const shouldLoop = loop !== undefined ? loop : (entry?.loop ?? false);

  const containerStyle: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...style,
  };

  if (isLoading) {
    return (
      <div className={className} style={containerStyle}>
        <div className="w-8 h-8 border-2 border-kno-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !animationData) {
    // Silent fail - just render nothing
    return null;
  }

  const content = (
    <Lottie
      animationData={animationData}
      loop={shouldLoop}
      autoplay={autoplay}
      style={{ width: '100%', height: '100%' }}
      onComplete={onComplete}
    />
  );

  if (animate) {
    return (
      <motion.div
        className={className}
        style={containerStyle}
        variants={fadeInScale}
        initial="hidden"
        animate="visible"
      >
        {content}
      </motion.div>
    );
  }

  return (
    <div className={className} style={containerStyle}>
      {content}
    </div>
  );
};

export default LottiePlayer;
