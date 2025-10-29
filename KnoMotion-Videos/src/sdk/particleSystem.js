import { interpolate } from 'remotion';
import { EZ } from './easing';

/**
 * PARTICLE SYSTEM SDK
 * 
 * Adds visual magic through particle effects:
 * - Floating ambient particles
 * - Celebration confetti bursts
 * - Sparkle trails
 * - Organic floating elements
 * 
 * All deterministic (frame-based), no randomness that breaks exports
 */

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
 */
export const animateAmbientParticle = (particle, frame, fps, config = {}) => {
  const {
    verticalSpeed = 1.0, // Pixels per frame upward
    loopHeight = 1200, // Reset after this distance
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
 * Generate confetti burst particles (celebration moment)
 */
export const generateConfettiBurst = (count, originX, originY, seed = 100) => {
  const particles = [];
  
  for (let i = 0; i < count; i++) {
    const particleSeed = seed + i * 500;
    const angle = (i / count) * Math.PI * 2 + seededRandom(particleSeed) * 0.5;
    const velocity = 3 + seededRandom(particleSeed + 1) * 4; // 3-7px per frame
    const colorIndex = Math.floor(seededRandom(particleSeed + 2) * 5);
    
    particles.push({
      id: `confetti-${i}`,
      originX,
      originY,
      angle,
      velocity,
      size: 6 + seededRandom(particleSeed + 3) * 8, // 6-14px
      rotation: seededRandom(particleSeed + 4) * 360,
      rotationSpeed: (seededRandom(particleSeed + 5) - 0.5) * 10, // -5 to +5 deg/frame
      colorIndex,
      gravity: 0.08 + seededRandom(particleSeed + 6) * 0.04, // 0.08-0.12
    });
  }
  
  return particles;
};

/**
 * Animate confetti particle (physics-based with gravity)
 */
export const animateConfettiParticle = (particle, frame, startFrame, duration = 90) => {
  const elapsed = frame - startFrame;
  
  if (elapsed < 0 || elapsed > duration) {
    return { visible: false };
  }
  
  // Physics simulation
  const vx = Math.cos(particle.angle) * particle.velocity;
  const vy = Math.sin(particle.angle) * particle.velocity;
  
  const x = particle.originX + vx * elapsed;
  const y = particle.originY + vy * elapsed + (particle.gravity * elapsed * elapsed) / 2;
  
  // Rotation
  const rotation = particle.rotation + particle.rotationSpeed * elapsed;
  
  // Fade out near end
  const fadeStart = duration * 0.7;
  const opacity = elapsed > fadeStart
    ? interpolate(elapsed, [fadeStart, duration], [1, 0], { extrapolateRight: 'clamp' })
    : 1;
  
  return {
    visible: true,
    x,
    y,
    size: particle.size,
    rotation,
    opacity,
    colorIndex: particle.colorIndex,
  };
};

/**
 * Generate sparkle particles (magical moments)
 */
export const generateSparkles = (count, bounds, seed = 200) => {
  const { x, y, width, height } = bounds;
  const particles = [];
  
  for (let i = 0; i < count; i++) {
    const particleSeed = seed + i * 300;
    
    particles.push({
      id: `sparkle-${i}`,
      x: x + seededRandom(particleSeed) * width,
      y: y + seededRandom(particleSeed + 1) * height,
      delay: seededRandom(particleSeed + 2) * 30, // 0-30 frame delay
      size: 8 + seededRandom(particleSeed + 3) * 12, // 8-20px
      duration: 20 + seededRandom(particleSeed + 4) * 20, // 20-40 frames
    });
  }
  
  return particles;
};

/**
 * Animate sparkle particle (twinkle effect)
 */
export const animateSparkle = (particle, frame, startFrame) => {
  const localFrame = frame - startFrame - particle.delay;
  
  if (localFrame < 0 || localFrame > particle.duration) {
    return { visible: false };
  }
  
  // Scale: grows then shrinks (burst effect)
  const midpoint = particle.duration / 2;
  const scale = localFrame < midpoint
    ? interpolate(localFrame, [0, midpoint], [0, 1], { extrapolateRight: 'clamp' })
    : interpolate(localFrame, [midpoint, particle.duration], [1, 0], { extrapolateRight: 'clamp' });
  
  // Opacity: fade in/out
  const opacity = localFrame < midpoint
    ? interpolate(localFrame, [0, midpoint * 0.3], [0, 1], { extrapolateRight: 'clamp' })
    : interpolate(localFrame, [midpoint * 0.7, particle.duration], [1, 0], { extrapolateRight: 'clamp' });
  
  // Rotation (sparkle spin)
  const rotation = localFrame * 8; // 8 degrees per frame
  
  return {
    visible: true,
    x: particle.x,
    y: particle.y,
    scale,
    opacity,
    rotation,
    size: particle.size,
  };
};

/**
 * Render ambient particles (SVG)
 */
export const renderAmbientParticles = (particles, frame, fps, colors = ['#FF6B35', '#9B59B6', '#2E7FE4']) => {
  return particles.map((particle) => {
    const animated = animateAmbientParticle(particle, frame, fps);
    const colorIndex = Math.floor(seededRandom(parseFloat(particle.id.split('-')[1]) * 777) * colors.length);
    
    return {
      key: particle.id,
      element: (
        <circle
          key={particle.id}
          cx={animated.x}
          cy={animated.y}
          r={animated.size}
          fill={colors[colorIndex]}
          opacity={animated.opacity}
        />
      ),
    };
  });
};

/**
 * Render confetti particles (SVG)
 */
export const renderConfettiBurst = (particles, frame, startFrame, colors = ['#FF6B35', '#9B59B6', '#2E7FE4', '#27AE60', '#F39C12']) => {
  const confettiColors = colors;
  
  return particles.map((particle) => {
    const animated = animateConfettiParticle(particle, frame, startFrame);
    
    if (!animated.visible) return null;
    
    const color = confettiColors[particle.colorIndex % confettiColors.length];
    
    return (
      <rect
        key={particle.id}
        x={animated.x - animated.size / 2}
        y={animated.y - animated.size / 2}
        width={animated.size}
        height={animated.size}
        fill={color}
        opacity={animated.opacity}
        transform={`rotate(${animated.rotation} ${animated.x} ${animated.y})`}
      />
    );
  }).filter(Boolean);
};

/**
 * Render sparkles (SVG)
 */
export const renderSparkles = (particles, frame, startFrame, color = '#FFD700') => {
  return particles.map((particle) => {
    const animated = animateSparkle(particle, frame, startFrame);
    
    if (!animated.visible) return null;
    
    // 4-pointed star shape
    const size = animated.size * animated.scale;
    const { x, y } = animated;
    
    // Star path
    const starPath = `
      M ${x} ${y - size}
      L ${x + size * 0.2} ${y - size * 0.2}
      L ${x + size} ${y}
      L ${x + size * 0.2} ${y + size * 0.2}
      L ${x} ${y + size}
      L ${x - size * 0.2} ${y + size * 0.2}
      L ${x - size} ${y}
      L ${x - size * 0.2} ${y - size * 0.2}
      Z
    `;
    
    return (
      <g key={particle.id} opacity={animated.opacity}>
        <path
          d={starPath}
          fill={color}
          transform={`rotate(${animated.rotation} ${x} ${y})`}
        />
        {/* Glow effect */}
        <circle
          cx={x}
          cy={y}
          r={size * 1.5}
          fill={color}
          opacity={0.2 * animated.opacity}
        />
      </g>
    );
  }).filter(Boolean);
};

/**
 * Generate floating shapes (organic, abstract)
 */
export const generateFloatingShapes = (count, seed = 300, canvasWidth = 1920, canvasHeight = 1080) => {
  const shapes = [];
  
  for (let i = 0; i < count; i++) {
    const shapeSeed = seed + i * 400;
    const shapeType = Math.floor(seededRandom(shapeSeed) * 3); // 0: circle, 1: blob, 2: line
    
    shapes.push({
      id: `shape-${i}`,
      type: ['circle', 'blob', 'line'][shapeType],
      x: seededRandom(shapeSeed + 1) * canvasWidth,
      y: seededRandom(shapeSeed + 2) * canvasHeight,
      size: 30 + seededRandom(shapeSeed + 3) * 80, // 30-110px
      speed: 0.2 + seededRandom(shapeSeed + 4) * 0.3, // 0.2-0.5
      phase: seededRandom(shapeSeed + 5) * Math.PI * 2,
      opacity: 0.03 + seededRandom(shapeSeed + 6) * 0.05, // Very subtle: 0.03-0.08
      colorIndex: Math.floor(seededRandom(shapeSeed + 7) * 3),
    });
  }
  
  return shapes;
};

/**
 * Animate floating shape
 */
export const animateFloatingShape = (shape, frame) => {
  // Slow drift
  const driftX = Math.sin(frame * 0.01 * shape.speed + shape.phase) * 50;
  const driftY = Math.cos(frame * 0.008 * shape.speed + shape.phase * 0.7) * 30;
  
  // Gentle scale pulse
  const scale = 1 + Math.sin(frame * 0.015 * shape.speed + shape.phase) * 0.15;
  
  // Slow rotation
  const rotation = frame * 0.1 * shape.speed;
  
  return {
    x: shape.x + driftX,
    y: shape.y + driftY,
    size: shape.size * scale,
    opacity: shape.opacity,
    rotation,
  };
};

/**
 * Render floating shapes (SVG) - adds organic depth to background
 */
export const renderFloatingShapes = (shapes, frame, colors = ['#FF6B35', '#9B59B6', '#2E7FE4']) => {
  return shapes.map((shape) => {
    const animated = animateFloatingShape(shape, frame);
    const color = colors[shape.colorIndex % colors.length];
    
    if (shape.type === 'circle') {
      return (
        <circle
          key={shape.id}
          cx={animated.x}
          cy={animated.y}
          r={animated.size}
          fill={color}
          opacity={animated.opacity}
        />
      );
    }
    
    if (shape.type === 'blob') {
      // Organic blob using path
      const r = animated.size;
      const x = animated.x;
      const y = animated.y;
      const blobPath = `
        M ${x} ${y - r}
        Q ${x + r * 0.8} ${y - r * 0.8} ${x + r} ${y}
        Q ${x + r * 0.8} ${y + r * 0.8} ${x} ${y + r}
        Q ${x - r * 0.8} ${y + r * 0.8} ${x - r} ${y}
        Q ${x - r * 0.8} ${y - r * 0.8} ${x} ${y - r}
        Z
      `;
      
      return (
        <path
          key={shape.id}
          d={blobPath}
          fill={color}
          opacity={animated.opacity}
          transform={`rotate(${animated.rotation} ${x} ${y})`}
        />
      );
    }
    
    if (shape.type === 'line') {
      return (
        <line
          key={shape.id}
          x1={animated.x - animated.size}
          y1={animated.y}
          x2={animated.x + animated.size}
          y2={animated.y}
          stroke={color}
          strokeWidth={2}
          opacity={animated.opacity}
          transform={`rotate(${animated.rotation} ${animated.x} ${animated.y})`}
        />
      );
    }
    
    return null;
  }).filter(Boolean);
};
