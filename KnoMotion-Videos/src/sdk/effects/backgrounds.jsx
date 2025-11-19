/**
 * SDK EFFECTS - Background Effects
 * 
 * Consolidated background effects:
 * - SpotlightEffect
 * - NoiseTexture
 * - Ambient particles (generateAmbientParticles, renderAmbientParticles)
 */

import React from 'react';
import { AbsoluteFill } from 'remotion';

// ==================== NOISE TEXTURE ====================

/**
 * NoiseTexture - Subtle noise overlay for texture
 * 
 * @param {Object} props
 * @param {number} [props.opacity=0.04] - Opacity of noise
 * @param {number} [props.scale=1] - Scale of noise pattern
 */
export const NoiseTexture = ({ opacity = 0.04, scale = 1 }) => {
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

/**
 * SpotlightEffect - Radial gradient spotlight
 * 
 * @param {Object} props
 * @param {number} [props.x=50] - X position in percentage
 * @param {number} [props.y=50] - Y position in percentage
 * @param {number} [props.size=800] - Size of spotlight
 * @param {string} [props.color='#ffffff'] - Spotlight color
 * @param {number} [props.opacity=0.1] - Spotlight opacity
 */
export const SpotlightEffect = ({ x = 50, y = 50, size = 800, color = '#ffffff', opacity = 0.1 }) => {
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

// ==================== AMBIENT PARTICLES ====================

/**
 * Deterministic pseudo-random generator
 * Uses seed to generate consistent "random" values
 */
const seededRandom = (seed) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

/**
 * Generate deterministic particles for ambient floating effect
 * Perfect for backgrounds - adds life without distraction
 * 
 * @param {number} count - Number of particles
 * @param {number} [seed=42] - Seed for deterministic generation
 * @param {number} [canvasWidth=1920] - Canvas width
 * @param {number} [canvasHeight=1080] - Canvas height
 * @returns {Array} Array of particle objects
 */
export const generateAmbientParticles = (count, seed = 42, canvasWidth = 1920, canvasHeight = 1080) => {
  const particles = [];
  
  for (let i = 0; i < count; i++) {
    const particleSeed = seed + i * 1000;
    
    particles.push({
      id: `ambient-${i}`,
      x: seededRandom(particleSeed) * canvasWidth,
      y: seededRandom(particleSeed + 1) * canvasHeight,
      size: 2 + seededRandom(particleSeed + 2) * 4, // 2-6px
      speed: 0.3 + seededRandom(particleSeed + 3) * 0.5, // 0.3-0.8
      phase: seededRandom(particleSeed + 4) * Math.PI * 2, // Random phase offset
      amplitude: 20 + seededRandom(particleSeed + 5) * 30, // 20-50px horizontal drift
      opacity: 0.1 + seededRandom(particleSeed + 6) * 0.2, // 0.1-0.3
    });
  }
  
  return particles;
};

/**
 * Animate ambient particle (floating motion)
 * 
 * @param {Object} particle - Particle object
 * @param {number} frame - Current frame
 * @param {number} fps - Frames per second
 * @param {Object} [config={}] - Animation config
 * @param {number} [config.verticalSpeed=1.0] - Pixels per frame upward
 * @param {number} [config.loopHeight=1200] - Reset after this distance
 * @returns {Object} Animated particle properties
 */
export const animateAmbientParticle = (particle, frame, fps, config = {}) => {
  const {
    verticalSpeed = 1.0,
    loopHeight = 1200,
  } = config;
  
  // Vertical movement (rises slowly)
  const baseY = particle.y - (frame * verticalSpeed);
  const wrappedY = ((baseY % loopHeight) + loopHeight) % loopHeight;
  
  // Horizontal drift (sine wave)
  const driftX = Math.sin(frame * 0.02 * particle.speed + particle.phase) * particle.amplitude;
  
  // Subtle scale pulse
  const scalePulse = 1 + Math.sin(frame * 0.03 * particle.speed + particle.phase) * 0.1;
  
  return {
    x: particle.x + driftX,
    y: wrappedY,
    size: particle.size * scalePulse,
    opacity: particle.opacity,
  };
};

/**
 * Render ambient particles (SVG)
 * 
 * @param {Array} particles - Array of particle objects
 * @param {number} frame - Current frame
 * @param {number} fps - Frames per second
 * @param {Array|Object} [colors=['#FF6B35', '#9B59B6', '#2E7FE4']] - Color array or config object
 * @returns {Array} Array of React elements
 */
export const renderAmbientParticles = (particles, frame, fps, colors = ['#FF6B35', '#9B59B6', '#2E7FE4']) => {
  // Handle both array of colors and config object
  const colorArray = Array.isArray(colors) ? colors : [colors.accent || '#FF6B35', colors.accent2 || '#9B59B6', colors.bg || '#2E7FE4'];
  const opacityOverride = Array.isArray(colors) ? undefined : colors.opacity;
  
  return particles.map((particle) => {
    const animated = animateAmbientParticle(particle, frame, fps);
    const colorIndex = Math.floor(seededRandom(parseFloat(particle.id.split('-')[1]) * 777) * colorArray.length);
    const finalOpacity = opacityOverride !== undefined ? opacityOverride : animated.opacity;
    
    return {
      key: particle.id,
      element: (
        <circle
          key={particle.id}
          cx={animated.x}
          cy={animated.y}
          r={animated.size}
          fill={colorArray[colorIndex % colorArray.length]}
          opacity={finalOpacity}
        />
      ),
    };
  });
};
