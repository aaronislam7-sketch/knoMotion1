import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import { THEME } from '../utils/theme';
import rough from 'roughjs/bundled/rough.esm.js';

// SDK imports - Agnostic Template System v6
import { 
  fadeUpIn, 
  pulseEmphasis,
  slideInLeft,
  slideInRight,
  EZ,
  useSceneId,
  toFrames,
  renderHero,
  calculateHeroAnimation,
  mergeHeroConfig,
  resolvePosition,
  positionToCSS,
  generateAmbientParticles,
  renderAmbientParticles
} from '../sdk';

/**
 * TEMPLATE #9: PROGRESSIVE REVEAL - v6.0
 * 
 * PRIMARY INTENTION: REVEAL
 * SECONDARY INTENTIONS: QUESTION, BREAKDOWN
 * 
 * VISUAL PATTERN:
 * - Curtain/layer progressive unveiling
 * - 2-5 reveal stages
 * - Each stage can have: text, image, or combination
 * - Smooth transitions between reveals
 * 
 * AGNOSTIC PRINCIPALS:
 * ✅ Type-based polymorphism (hero registry for reveal visuals)
 * ✅ Data-driven structure (dynamic array of reveal stages)
 * ✅ Token-based positioning (position system)
 * ✅ Separation of concerns (content/layout/style/animation)
 * ✅ Progressive configuration (simple → advanced)
 * ✅ Registry pattern (extensible reveal types)
 * 
 * CONFIGURABILITY:
 * - Number of reveal stages (2-5)
 * - Reveal style: curtain, fade, slide-left, slide-right, zoom
 * - Each stage: headline, description, visual (optional)
 * - Colors, fonts, timing all configurable
 * - Position system for layout
 * - Animation speeds and easing
 * 
 * NO HARDCODED VALUES!
 */

// Default configuration
const DEFAULT_CONFIG = {
  title: {
    text: 'The Big Reveal',
    position: 'top-center',
    offset: { x: 0, y: 40 }
  },
  revealStyle: 'curtain', // curtain, fade, slide-left, slide-right, zoom
  stages: [
    {
      headline: 'Stage 1',
      description: 'First reveal',
      visual: null,
      position: 'center'
    }
  ],
  style_tokens: {
    colors: {
      bg: '#FFF9F0',
      accent: '#FF6B35',
      accent2: '#9B59B6',
      ink: '#1A1A1A',
      curtain: '#F5F5DC'
    },
    fonts: {
      size_title: 64,
      size_headline: 48,
      size_description: 28
    }
  },
  beats: {
    entrance: 0.4,
    titleEntry: 0.6,
    stageInterval: 3.0, // Time between each reveal
    stageTransition: 0.8, // Transition duration
    exit: 2.0 // After last stage
  },
  animation: {
    entrance: 'fade-up',
    transitionEasing: 'power3InOut'
  }
};

// Render curtain overlay based on reveal style and progress
const renderRevealOverlay = (style, progress, colors, width, height) => {
  const ease = EZ.power3InOut(progress);
  
  switch (style) {
    case 'curtain': {
      // Horizontal curtain split
      const leftX = interpolate(ease, [0, 1], [0, -width / 2]);
      const rightX = interpolate(ease, [0, 1], [0, width / 2]);
      return (
        <>
          <div style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            width: '50%',
            height: '100%',
            backgroundColor: colors.curtain || DEFAULT_CONFIG.style_tokens.colors.curtain,
            transform: `translateX(${leftX}px)`,
            zIndex: 100
          }} />
          <div style={{
            position: 'absolute',
            right: '50%',
            top: 0,
            width: '50%',
            height: '100%',
            backgroundColor: colors.curtain || DEFAULT_CONFIG.style_tokens.colors.curtain,
            transform: `translateX(${rightX}px)`,
            zIndex: 100
          }} />
        </>
      );
    }
    
    case 'fade': {
      const opacity = 1 - ease;
      return (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: colors.curtain || DEFAULT_CONFIG.style_tokens.colors.curtain,
          opacity,
          zIndex: 100
        }} />
      );
    }
    
    case 'slide-left': {
      const x = interpolate(ease, [0, 1], [0, -width]);
      return (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: colors.curtain || DEFAULT_CONFIG.style_tokens.colors.curtain,
          transform: `translateX(${x}px)`,
          zIndex: 100
        }} />
      );
    }
    
    case 'slide-right': {
      const x = interpolate(ease, [0, 1], [0, width]);
      return (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: colors.curtain || DEFAULT_CONFIG.style_tokens.colors.curtain,
          transform: `translateX(${x}px)`,
          zIndex: 100
        }} />
      );
    }
    
    case 'zoom': {
      const scale = interpolate(ease, [0, 1], [1, 20]);
      const opacity = interpolate(ease, [0, 0.5, 1], [1, 1, 0]);
      return (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100%',
          height: '100%',
          backgroundColor: colors.curtain || DEFAULT_CONFIG.style_tokens.colors.curtain,
          transform: `translate(-50%, -50%) scale(${scale})`,
          opacity,
          zIndex: 100
        }} />
      );
    }
    
    default:
      return null;
  }
};

export const Reveal9ProgressiveUnveil = ({ scene, styles, presets, easingMap }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  
  if (!scene) {
    return <AbsoluteFill style={{ backgroundColor: '#1A1A2E' }} />;
  }
  
  // Merge with defaults
  const config = {
    ...DEFAULT_CONFIG,
    ...scene,
    title: { ...DEFAULT_CONFIG.title, ...(scene.title || {}) },
    style_tokens: {
      colors: { ...DEFAULT_CONFIG.style_tokens.colors, ...(scene.style_tokens?.colors || {}) },
      fonts: { ...DEFAULT_CONFIG.style_tokens.fonts, ...(scene.style_tokens?.fonts || {}) }
    },
    beats: { ...DEFAULT_CONFIG.beats, ...(scene.beats || {}) },
    animation: { ...DEFAULT_CONFIG.animation, ...(scene.animation || {}) }
  };
  
  const colors = config.style_tokens.colors;
  const fonts = config.style_tokens.fonts;
  const beats = config.beats;
  const stages = config.stages || DEFAULT_CONFIG.stages;
  
  // Calculate which stage is currently active
  const titleStartFrame = toFrames(beats.titleEntry, fps);
  let currentStage = -1;
  let stageProgress = 0;
  let revealProgress = 0;
  
  for (let i = 0; i < stages.length; i++) {
    const stageStartTime = beats.titleEntry + 1.0 + (i * beats.stageInterval);
    const stageStartFrame = toFrames(stageStartTime, fps);
    const transitionEndFrame = stageStartFrame + toFrames(beats.stageTransition, fps);
    
    if (frame >= stageStartFrame) {
      currentStage = i;
      
      // Calculate transition progress for reveal effect
      if (frame < transitionEndFrame) {
        revealProgress = (frame - stageStartFrame) / (transitionEndFrame - stageStartFrame);
      } else {
        revealProgress = 1;
      }
      
      // Calculate stage content progress
      stageProgress = Math.min((frame - transitionEndFrame) / (toFrames(beats.stageInterval - beats.stageTransition, fps)), 1);
    }
  }
  
  // Ambient particles
  const particles = generateAmbientParticles(25, 9001, width, height);
  const particleElements = renderAmbientParticles(particles, frame, fps, [colors.accent, colors.accent2, colors.bg]);
  
  // Title animation
  const titleAnim = fadeUpIn(frame, {
    start: beats.titleEntry,
    dur: 0.8,
    dist: 50,
    ease: 'smooth'
  }, EZ, fps);
  
  const titlePos = resolvePosition(
    config.title.position || DEFAULT_CONFIG.title.position,
    config.title.offset || DEFAULT_CONFIG.title.offset,
    { width, height }
  );
  
  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      {/* Ambient particles */}
      <svg
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          zIndex: 0,
          opacity: 0.4
        }}
        viewBox="0 0 1920 1080"
      >
        {particleElements.map(p => p.element)}
      </svg>
      
      {/* Title */}
      {frame >= titleStartFrame && (
        <div style={{
          position: 'absolute',
          left: titlePos.x,
          top: titlePos.y,
          fontSize: fonts.size_title,
          fontWeight: 900,
          fontFamily: '"Permanent Marker", cursive',
          color: colors.accent,
          textAlign: 'center',
          opacity: titleAnim.opacity,
          transform: `translate(-50%, -50%) translateY(${titleAnim.translateY}px) scale(${titleAnim.scale})`,
          zIndex: 10
        }}>
          {config.title.text}
        </div>
      )}
      
      {/* Current stage content */}
      {currentStage >= 0 && revealProgress >= 0.3 && (
        <>
          {/* Stage headline */}
          <div style={{
            position: 'absolute',
            top: '35%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: fonts.size_headline,
            fontWeight: 800,
            fontFamily: '"Permanent Marker", cursive',
            color: colors.ink,
            textAlign: 'center',
            opacity: interpolate(stageProgress, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' }),
            zIndex: 50
          }}>
            {stages[currentStage].headline}
          </div>
          
          {/* Stage description */}
          {stages[currentStage].description && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: fonts.size_description,
              fontWeight: 400,
              fontFamily: 'Inter, sans-serif',
              color: colors.ink,
              textAlign: 'center',
              maxWidth: '70%',
              lineHeight: 1.5,
              opacity: interpolate(stageProgress, [0.2, 0.5], [0, 1], { extrapolateRight: 'clamp' }),
              zIndex: 50
            }}>
              {stages[currentStage].description}
            </div>
          )}
          
          {/* Stage visual (if provided) */}
          {stages[currentStage].visual && (
            <div style={{
              position: 'absolute',
              bottom: '15%',
              left: '50%',
              transform: 'translate(-50%, 0)',
              opacity: interpolate(stageProgress, [0.4, 0.7], [0, 1], { extrapolateRight: 'clamp' }),
              zIndex: 50
            }}>
              {renderHero(
                mergeHeroConfig(stages[currentStage].visual),
                frame,
                beats,
                colors,
                EZ,
                fps
              )}
            </div>
          )}
        </>
      )}
      
      {/* Reveal overlay (curtain/fade/slide effect) */}
      {currentStage >= 0 && revealProgress < 1 && renderRevealOverlay(
        config.revealStyle || DEFAULT_CONFIG.revealStyle,
        revealProgress,
        colors,
        width,
        height
      )}
    </AbsoluteFill>
  );
};

// Required exports
export const TEMPLATE_ID = 'Reveal9ProgressiveUnveil';
export const TEMPLATE_VERSION = '6.0.0';

// Attach version to component for TemplateRouter detection
Reveal9ProgressiveUnveil.TEMPLATE_VERSION = '6.0.0';
Reveal9ProgressiveUnveil.TEMPLATE_ID = 'Reveal9ProgressiveUnveil';
export const LEARNING_INTENTIONS = {
  primary: ['reveal'],
  secondary: ['question', 'breakdown'],
  tags: ['progressive', 'unveiling', 'suspense', 'layers']
};

export const getDuration = (scene, fps) => {
  const config = { ...DEFAULT_CONFIG, ...scene };
  const stages = config.stages || DEFAULT_CONFIG.stages;
  const beats = { ...DEFAULT_CONFIG.beats, ...(scene.beats || {}) };
  
  const totalDuration = beats.titleEntry + 1.0 + (stages.length * beats.stageInterval) + beats.exit;
  return toFrames(totalDuration, fps);
};

export const CAPABILITIES = {
  usesSVG: false,
  usesRoughJS: false,
  usesLottie: false,
  requiresAudio: false,
  dynamicStages: true,
  maxStages: 5,
  minStages: 2
};

// Configuration schema for AdminConfig integration
export const CONFIG_SCHEMA = {
  title: {
    type: 'object',
    fields: {
      text: { type: 'string', required: true },
      position: { type: 'position-token', default: 'top-center' },
      offset: { type: 'offset', default: { x: 0, y: 40 } }
    }
  },
  revealStyle: {
    type: 'enum',
    options: ['curtain', 'fade', 'slide-left', 'slide-right', 'zoom'],
    default: 'curtain'
  },
  stages: {
    type: 'dynamic-array',
    min: 2,
    max: 5,
    itemSchema: {
      headline: { type: 'string', required: true },
      description: { type: 'string', required: false },
      visual: { type: 'polymorphic-hero', required: false },
      position: { type: 'position-token', default: 'center' }
    }
  },
  style_tokens: {
    type: 'style-tokens',
    colors: ['bg', 'accent', 'accent2', 'ink', 'curtain'],
    fonts: ['size_title', 'size_headline', 'size_description']
  },
  beats: {
    type: 'timeline',
    beats: ['entrance', 'titleEntry', 'stageInterval', 'stageTransition', 'exit']
  }
};
