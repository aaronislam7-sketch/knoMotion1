/**
 * Broadcast-Grade Visual Effects
 * Inspired by GitHub Unwrapped's polished aesthetic
 * Adapted for TED Talk branding
 */

import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';

// ==================== GLASSMORPHIC PANE EFFECT ====================

/**
 * Glassmorphic card effect with highlights and depth
 * TED talk aesthetic with modern polish
 */
export const GlassmorphicPane: React.FC<{
  children: React.ReactNode;
  innerRadius?: number;
  style?: React.CSSProperties;
  glowOpacity?: number;
  borderOpacity?: number;
  padding?: number;
  backgroundColor?: string;
}> = ({
  children,
  innerRadius = 24,
  style = {},
  glowOpacity = 0.15,
  borderOpacity = 0.3,
  padding = 40,
  backgroundColor = 'rgba(255, 255, 255, 0.08)',
}) => {
  return (
    <div
      style={{
        position: 'relative',
        ...style,
      }}
    >
      {/* Outer glow effect */}
      <AbsoluteFill style={{ pointerEvents: 'none' }}>
        <div
          style={{
            position: 'absolute',
            inset: -20,
            background: `radial-gradient(circle at center, rgba(255, 255, 255, ${glowOpacity}) 0%, transparent 70%)`,
            filter: 'blur(30px)',
            zIndex: -1,
          }}
        />
      </AbsoluteFill>

      {/* Main glassmorphic container */}
      <div
        style={{
          padding,
          backgroundColor,
          backdropFilter: 'blur(20px)',
          border: `1px solid rgba(255, 255, 255, ${borderOpacity})`,
          borderRadius: innerRadius + padding,
          boxShadow: `
            0 4px 30px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.3)
          `,
        }}
      >
        {children}
      </div>
    </div>
  );
};

// ==================== ANIMATED SHINE EFFECT ====================

/**
 * Rotating shine effect for borders (inspired by GitHub Unwrapped)
 * Creates premium, broadcast-quality feel
 */
export const ShineEffect: React.FC<{
  borderRadius?: number;
  opacity?: number;
  speed?: number;
}> = ({ borderRadius = 24, opacity = 0.3, speed = 0.4 }) => {
  const [rotation, setRotation] = React.useState(0);

  React.useEffect(() => {
    let rot = 0;
    const loop = () => {
      rot += speed;
      setRotation(rot);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }, [speed]);

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity }}>
      <svg
        style={{
          width: '100%',
          height: '100%',
          overflow: 'visible',
        }}
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <defs>
          <linearGradient
            id="shine-gradient"
            gradientUnits="userSpaceOnUse"
            gradientTransform={`rotate(${rotation} 50 50)`}
          >
            <stop offset="50%" stopColor="rgba(255, 255, 255, 0)" stopOpacity="1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
          </linearGradient>
        </defs>
        <rect
          x="0"
          y="0"
          width="100"
          height="100"
          fill="none"
          stroke="url(#shine-gradient)"
          strokeWidth="0.5"
          rx={borderRadius / 10}
        />
      </svg>
    </AbsoluteFill>
  );
};

// ==================== GRADIENT BACKGROUNDS ====================

export type GradientType = 
  | 'warm-sunset'
  | 'cool-ocean' 
  | 'vibrant-purple'
  | 'emerald-forest'
  | 'ted-red';

export const gradientConfigs: Record<GradientType, string[]> = {
  'warm-sunset': ['#FF6B6B', '#FFE66D', '#FF8B94'],
  'cool-ocean': ['#00B4DB', '#0083B0', '#00D4FF'],
  'vibrant-purple': ['#667EEA', '#764BA2', '#A770EF'],
  'emerald-forest': ['#00C9FF', '#92FE9D', '#00F260'],
  'ted-red': ['#E62B1E', '#FF6B6B', '#C20114'],
};

export const GradientBackground: React.FC<{
  gradient: GradientType;
  opacity?: number;
  rotate?: number;
}> = ({ gradient, opacity = 1, rotate = 45 }) => {
  const colors = gradientConfigs[gradient];
  
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${rotate}deg, ${colors.join(', ')})`,
        opacity,
      }}
    />
  );
};

// ==================== NOISE TEXTURE ====================

export const NoiseTexture: React.FC<{
  opacity?: number;
  scale?: number;
}> = ({ opacity = 0.04, scale = 1 }) => {
  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        opacity,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: `${100 * scale}px ${100 * scale}px`,
          mixBlendMode: 'overlay',
        }}
      />
    </AbsoluteFill>
  );
};

// ==================== SPOTLIGHT EFFECT ====================

export const SpotlightEffect: React.FC<{
  x?: number;
  y?: number;
  size?: number;
  color?: string;
  opacity?: number;
}> = ({ x = 50, y = 50, size = 800, color = '#ffffff', opacity = 0.1 }) => {
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          left: `${x}%`,
          top: `${y}%`,
          width: size,
          height: size,
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          opacity,
          filter: 'blur(60px)',
        }}
      />
    </AbsoluteFill>
  );
};

// ==================== ANIMATED PARTICLES - OPTIMIZED ====================

export const FloatingParticles: React.FC<{
  count?: number;
  color?: string;
  size?: number;
  speed?: number;
  frame: number;
}> = ({ count = 20, color = '#ffffff', size = 4, speed = 0.5, frame }) => {
  // Cap count to prevent performance issues
  const safeCount = Math.min(count, 50);
  
  const particles = React.useMemo(() => {
    return Array.from({ length: safeCount }, (_, i) => ({
      id: i,
      x: (i * 137.508) % 100, // Golden angle distribution
      y: (i * 47.8) % 100,
      delay: i * 3,
      amplitude: 15 + (i % 3) * 10,
    }));
  }, [safeCount]);

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>
      {particles.map((particle) => {
        const adjustedFrame = Math.max(0, frame - particle.delay);
        const y = particle.y + Math.sin((adjustedFrame * speed) / 40) * particle.amplitude / 100;
        const opacity = Math.sin((adjustedFrame * speed) / 80) * 0.2 + 0.4;

        return (
          <div
            key={particle.id}
            style={{
              position: 'absolute',
              left: `${particle.x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              borderRadius: '50%',
              backgroundColor: color,
              opacity: opacity * 0.5,
              filter: 'blur(1px)',
              willChange: 'transform',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ==================== TED TALK THEMED CARD ====================

export const TEDCard: React.FC<{
  children: React.ReactNode;
  accentColor?: string;
  scale?: number;
}> = ({ children, accentColor = '#E62B1E', scale = 1 }) => {
  return (
    <GlassmorphicPane
      style={{
        transform: `scale(${scale})`,
      }}
      glowOpacity={0.2}
      borderOpacity={0.4}
    >
      {/* Accent border top */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${accentColor}, transparent)`,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        }}
      />
      {children}
    </GlassmorphicPane>
  );
};
