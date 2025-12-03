import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { KNODE_THEME } from '../theme/knodeTheme';
import { NoiseTexture, SpotlightEffect } from './backgrounds';

type GradientVariant = 'sunriseGradient' | 'cleanCard' | 'chalkboardGradient';

/**
 * Particle configuration for ambient background effects
 */
export type ParticleConfig = {
  /** Enable particle layer */
  enabled: boolean;
  /** Particle count (default: 20) */
  count?: number;
  /** Particle color (CSS color or theme key) */
  color?: string;
  /** Particle opacity (0-1, default: 0.3) */
  opacity?: number;
  /** Particle size range [min, max] (default: [2, 6]) */
  sizeRange?: [number, number];
  /** Animation speed (default: 1) */
  speed?: number;
  /** Particle style: 'dots' | 'chalk' | 'snow' | 'sparkle' */
  style?: 'dots' | 'chalk' | 'snow' | 'sparkle';
};

type BaseBackground = {
  layerNoise?: boolean;
  particles?: ParticleConfig;
};

export type BackgroundPresetConfig =
  | ({ preset: 'notebookSoft' } & BaseBackground)
  | ({ preset: 'sunriseGradient' } & BaseBackground)
  | ({ preset: 'cleanCard' } & BaseBackground)
  | ({ preset: 'chalkboardGradient' } & BaseBackground)
  | ({
      preset: 'spotlight';
      spotlight?: { x?: number; y?: number; intensity?: number };
    } & BaseBackground)
  | ({
      preset: 'custom';
      style: React.CSSProperties;
    } & BaseBackground);

export type ResolvedBackground = {
  style: React.CSSProperties;
  overlay?: React.ReactNode;
};

const gradientMap: Record<GradientVariant, string> = {
  sunriseGradient: `linear-gradient(135deg, ${KNODE_THEME.colors.pageBg}, ${KNODE_THEME.colors.primary}22)`,
  cleanCard: KNODE_THEME.colors.cardBg,
  chalkboardGradient: `linear-gradient(180deg, #2b2f3a, #1e2027)`,
};

/**
 * Generate deterministic particle positions using seed
 */
const generateParticlePositions = (count: number, seed: number = 42) => {
  const particles = [];
  for (let i = 0; i < count; i++) {
    // Simple pseudo-random based on seed + index
    const hash = Math.sin(seed * (i + 1) * 9999) * 10000;
    const x = (hash - Math.floor(hash)) * 100;
    const hashY = Math.sin(seed * (i + 2) * 7777) * 10000;
    const y = (hashY - Math.floor(hashY)) * 100;
    const hashSize = Math.sin(seed * (i + 3) * 5555) * 10000;
    const sizeFactor = (hashSize - Math.floor(hashSize));
    const hashSpeed = Math.sin(seed * (i + 4) * 3333) * 10000;
    const speedFactor = 0.5 + (hashSpeed - Math.floor(hashSpeed)) * 1.5;
    
    particles.push({
      x,
      y,
      sizeFactor,
      speedFactor,
      phaseOffset: i * 0.5,
    });
  }
  return particles;
};

/**
 * Particle Background Layer Component
 */
const ParticleBackgroundLayer: React.FC<{ config: ParticleConfig }> = ({ config }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  
  const {
    count = 20,
    color = KNODE_THEME.colors.primary,
    opacity = 0.3,
    sizeRange = [2, 6],
    speed = 1,
    style: particleStyle = 'dots',
  } = config;
  
  const resolvedColor = (KNODE_THEME.colors as Record<string, string>)[color] || color;
  const particles = React.useMemo(() => generateParticlePositions(count), [count]);
  
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>
      {particles.map((particle, i) => {
        const size = sizeRange[0] + particle.sizeFactor * (sizeRange[1] - sizeRange[0]);
        
        // Animate position based on style
        let yOffset = 0;
        let xOffset = 0;
        let particleOpacity = opacity;
        let scale = 1;
        
        switch (particleStyle) {
          case 'snow':
            // Gentle floating down
            yOffset = ((frame * 0.3 * speed * particle.speedFactor + particle.phaseOffset * 100) % (height + 50)) - 25;
            xOffset = Math.sin((frame * 0.02 + particle.phaseOffset) * speed) * 20;
            break;
          case 'sparkle':
            // Twinkling effect
            particleOpacity = opacity * (0.3 + 0.7 * Math.abs(Math.sin((frame * 0.1 + particle.phaseOffset) * speed)));
            scale = 0.8 + 0.4 * Math.abs(Math.sin((frame * 0.08 + particle.phaseOffset) * speed));
            break;
          case 'chalk':
            // Subtle floating dust
            yOffset = Math.sin((frame * 0.015 + particle.phaseOffset) * speed) * 15;
            xOffset = Math.cos((frame * 0.012 + particle.phaseOffset * 1.3) * speed) * 10;
            particleOpacity = opacity * (0.5 + 0.5 * Math.abs(Math.sin((frame * 0.03 + particle.phaseOffset) * speed)));
            break;
          case 'dots':
          default:
            // Gentle breathing/floating
            yOffset = Math.sin((frame * 0.02 + particle.phaseOffset) * speed) * 10;
            xOffset = Math.cos((frame * 0.015 + particle.phaseOffset * 1.2) * speed) * 8;
            break;
        }
        
        const x = (particle.x / 100) * width + xOffset;
        const y = particleStyle === 'snow' 
          ? yOffset 
          : (particle.y / 100) * height + yOffset;
        
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: size * scale,
              height: size * scale,
              borderRadius: '50%',
              backgroundColor: resolvedColor,
              opacity: particleOpacity,
              transform: 'translate(-50%, -50%)',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const resolveBackground = (
  config?: BackgroundPresetConfig,
): ResolvedBackground => {
  if (!config) {
    return { style: { backgroundColor: KNODE_THEME.colors.pageBg } };
  }

  let overlay: React.ReactNode = null;
  let style: React.CSSProperties = {
    backgroundColor: KNODE_THEME.colors.pageBg,
  };

  switch (config.preset) {
    case 'notebookSoft':
      overlay = (
        <AbsoluteFill>
          <svg width="100%" height="100%">
            {Array.from({ length: 40 }).map((_, i) => (
              <line
                key={i}
                x1="0"
                y1={i * 32}
                x2="100%"
                y2={i * 32}
                stroke={KNODE_THEME.colors.ruleLine}
                opacity={0.25}
              />
            ))}
          </svg>
        </AbsoluteFill>
      );
      break;
    case 'sunriseGradient':
      style = {
        backgroundImage: gradientMap.sunriseGradient,
      };
      break;
    case 'cleanCard':
      style = {
        backgroundColor: gradientMap.cleanCard,
      };
      break;
    case 'chalkboardGradient':
      style = {
        backgroundImage: gradientMap.chalkboardGradient,
        color: '#fff',
      };
      break;
    case 'spotlight':
      overlay = (
        <SpotlightEffect
          x={config.spotlight?.x ?? 45}
          y={config.spotlight?.y ?? 45}
          opacity={config.spotlight?.intensity ?? 0.25}
        />
      );
      break;
    case 'custom':
      style = config.style;
      break;
    default:
      break;
  }

  const overlays: React.ReactNode[] = [];
  if (overlay) {
    overlays.push(overlay);
  }
  if (config.layerNoise) {
    overlays.push(
      <AbsoluteFill key="noise">
        <NoiseTexture opacity={0.04} />
      </AbsoluteFill>,
    );
  }
  // Add particle layer if configured
  if (config.particles?.enabled) {
    overlays.push(
      <ParticleBackgroundLayer key="particles" config={config.particles} />
    );
  }

  return {
    style,
    overlay: overlays.length > 0 ? (
      <>
        {overlays.map((node, idx) => (
          <React.Fragment key={idx}>{node}</React.Fragment>
        ))}
      </>
    ) : undefined,
  };
};
