import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';

// SDK imports - Agnostic Template System v6
import { 
  fadeUpIn,
  slideInLeft,
  slideInRight,
  popInSpring,
  pulseEmphasis,
  EZ,
  toFrames,
  renderHero,
  mergeHeroConfig,
  resolvePosition,
  positionToCSS,
  generateAmbientParticles,
  renderAmbientParticles
} from '../sdk';

/**
 * TEMPLATE #14: SINGLE CONCEPT SPOTLIGHT - v6.0
 * 
 * PRIMARY INTENTION: QUESTION + REVEAL
 * SECONDARY INTENTIONS: BREAKDOWN, INSPIRE
 * 
 * PURPOSE: Deep dive into ONE concept with maximum focus
 * 
 * VISUAL PATTERN:
 * - Stage 1: Intriguing question/prompt
 * - Stage 2: Visual representation (large, centered)
 * - Stage 3: Core explanation (concise)
 * - Stage 4: Key takeaway/implication
 * 
 * ONE CONCEPT RULE:
 * - This template IS the one-concept rule embodied
 * - Each stage = separate screen with transition
 * - No simultaneous competing information
 * - Clear visual hierarchy on each stage
 * 
 * AGNOSTIC PRINCIPALS:
 * ✓ Type-Based Polymorphism (stage visuals via hero registry)
 * ✓ Data-Driven Structure (dynamic stages array)
 * ✓ Token-Based Positioning (semantic layout)
 * ✓ Separation of Concerns (content/layout/style/animation)
 * ✓ Progressive Configuration (simple defaults)
 * ✓ Registry Pattern (extensible stage types)
 */

// Default configuration
const DEFAULT_CONFIG = {
  title: {
    text: 'Concept Spotlight',
    position: 'top-center',
    offset: { x: 0, "y": 40 }
  },
  
  stages: [
    {
      type: 'question',
      headline: 'What if you could...?',
      bodyText: null,
      visual: null,
      position: 'center'
    },
    {
      type: 'visual',
      headline: null,
      bodyText: null,
      visual: {
        type: 'emoji',
        emoji: '💡',
        size: 200
      },
      position: 'center'
    },
    {
      type: 'explanation',
      headline: 'The Core Idea',
      bodyText: 'Here is the explanation of the concept...',
      visual: null,
      position: 'center'
    },
    {
      type: 'takeaway',
      headline: 'Why It Matters',
      bodyText: 'This changes everything because...',
      visual: null,
      position: 'center'
    }
  ],
  
  transitionStyle: 'fade', // fade, slide, curtain, morph
  emphasisStyle: 'pulse', // pulse, glow, scale, shake
  backgroundStyle: 'solid', // solid, gradient, ambient
  
  style_tokens: {
    colors: {
      bg: '#0F0F1E',
      bgGradientStart: '#1A1A2E',
      bgGradientEnd: '#0F0F1E',
      accent: '#FF6B35',
      accent2: '#9B59B6',
      ink: '#EAEAEA',
      highlight: '#FFD700'
    },
    fonts: {
      size_title: 56,
      size_headline: 68,
      size_body: 36,
      size_takeaway: 42
    }
  },
  
  beats: {
    entrance: 0.4,
    titleEntry: 0.6,
    stageInterval: 4.0,
    transitionDuration: 0.8,
    emphasisDuration: 1.0,
    exit: 2.5
  },
  
  animation: {
    titleAnimation: 'fade-up',
    stageEntrance: 'fade-up',
    transitionEasing: 'power3InOut',
    emphasisEasing: 'backOut'
  }
};

// Render stage content based on type
const renderStageContent = (stage, colors, fonts, frame, beats, fps, EZ, width, height, stageProgress) => {
  const contentOpacity = interpolate(stageProgress, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' });
  const contentY = interpolate(stageProgress, [0, 0.3], [30, 0], { extrapolateRight: 'clamp' });
  
  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: `translate(-50%, calc(-50% + ${contentY}px))`,
      opacity: contentOpacity,
      textAlign: 'center',
      maxWidth: '85%',
      zIndex: 10
    }}>
      {/* Headline */}
      {stage.headline && (
        <div style={{
          fontSize: stage.type === 'question' ? fonts.size_headline : 
                    stage.type === 'takeaway' ? fonts.size_takeaway :
                    fonts.size_headline * 0.85,
          fontWeight: 900,
          fontFamily: '"Permanent Marker", cursive',
          color: stage.type === 'question' ? colors.accent :
                 stage.type === 'takeaway' ? colors.highlight :
                 colors.ink,
          marginBottom: stage.bodyText ? 30 : 0,
          lineHeight: 1.2,
          textShadow: stage.type === 'question' ? `0 0 40px ${colors.accent}` : 'none'
        }}>
          {stage.headline}
        </div>
      )}
      
      {/* Visual */}
      {stage.visual && (
        <div style={{
          marginTop: stage.headline ? 40 : 0,
          marginBottom: stage.bodyText ? 40 : 0,
          display: 'flex',
          justifyContent: 'center'
        }}>
          {renderHero(
            mergeHeroConfig(stage.visual),
            frame,
            beats,
            colors,
            EZ,
            fps
          )}
        </div>
      )}
      
      {/* Body Text */}
      {stage.bodyText && (
        <div style={{
          fontSize: fonts.size_body,
          fontWeight: 400,
          fontFamily: 'Inter, sans-serif',
          color: colors.ink,
          lineHeight: 1.6,
          marginTop: stage.headline || stage.visual ? 30 : 0,
          maxWidth: '90%',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          {stage.bodyText}
        </div>
      )}
    </div>
  );
};

// Render transition overlay
const renderTransition = (transitionStyle, progress, colors, width, height) => {
  const ease = EZ.power3InOut(progress);
  
  switch (transitionStyle) {
    case 'fade': {
      const opacity = 1 - ease;
      return opacity > 0 ? (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: colors.bg,
          opacity,
          zIndex: 100
        }} />
      ) : null;
    }
    
    case 'slide': {
      const x = interpolate(ease, [0, 1], [0, -width]);
      return (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: colors.bg,
          transform: `translateX(${x}px)`,
          zIndex: 100
        }} />
      );
    }
    
    case 'curtain': {
      const leftX = interpolate(ease, [0, 1], [0, -width / 2]);
      const rightX = interpolate(ease, [0, 1], [0, width / 2]);
      return ease < 1 ? (
        <>
          <div style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            width: '50%',
            height: '100%',
            backgroundColor: colors.accent,
            transform: `translateX(${leftX}px)`,
            zIndex: 100
          }} />
          <div style={{
            position: 'absolute',
            right: '50%',
            top: 0,
            width: '50%',
            height: '100%',
            backgroundColor: colors.accent2,
            transform: `translateX(${rightX}px)`,
            zIndex: 100
          }} />
        </>
      ) : null;
    }
    
    default:
      return null;
  }
};

export const Spotlight14SingleConcept = ({ scene, styles, presets, easingMap }) => {
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
    stages: scene.stages || DEFAULT_CONFIG.stages,
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
  const stages = config.stages;
  
  // Calculate current stage
  let currentStage = -1;
  let stageProgress = 0;
  let transitionProgress = 0;
  
  for (let i = 0; i < stages.length; i++) {
    const stageStartTime = beats.titleEntry + 1.0 + (i * beats.stageInterval);
    const stageStartFrame = toFrames(stageStartTime, fps);
    const transitionEndFrame = stageStartFrame + toFrames(beats.transitionDuration, fps);
    const stageEndFrame = stageStartFrame + toFrames(beats.stageInterval, fps);
    
    if (frame >= stageStartFrame) {
      currentStage = i;
      
      // Calculate transition progress
      if (frame < transitionEndFrame) {
        transitionProgress = (frame - stageStartFrame) / (transitionEndFrame - stageStartFrame);
      } else {
        transitionProgress = 1;
      }
      
      // Calculate content progress
      if (frame >= transitionEndFrame) {
        stageProgress = Math.min((frame - transitionEndFrame) / toFrames(beats.stageInterval - beats.transitionDuration, fps), 1);
      } else {
        stageProgress = 0;
      }
    }
  }
  
  // Ambient particles
  const particles = generateAmbientParticles(config.backgroundStyle === 'ambient' ? 40 : 25, 14001, width, height);
  const particleElements = renderAmbientParticles(particles, frame, fps, [colors.accent, colors.accent2, colors.bg]);
  
  // Title animation
  const titleStartFrame = toFrames(beats.titleEntry, fps);
  const titleEndFrame = toFrames(beats.titleEntry + 2.5, fps);
  const titleVisible = frame >= titleStartFrame && frame < titleEndFrame;
  
  const titleAnim = fadeUpIn(frame, {
    start: beats.titleEntry,
    dur: 0.8,
    dist: 50,
    ease: 'smooth'
  }, EZ, fps);
  
  // Title fade out
  const titleFadeOut = frame >= toFrames(beats.titleEntry + 1.5, fps) ?
    interpolate(frame, [toFrames(beats.titleEntry + 1.5, fps), titleEndFrame], [1, 0], { extrapolateRight: 'clamp' }) : 1;
  
  const titlePos = resolvePosition(
    config.title.position,
    config.title.offset,
    { width, height }
  );
  
  // Background style
  const bgStyle = config.backgroundStyle === 'gradient' ? {
    background: `linear-gradient(135deg, ${colors.bgGradientStart} 0%, ${colors.bgGradientEnd} 100%)`
  } : {
    backgroundColor: colors.bg
  };
  
  return (
    <AbsoluteFill style={bgStyle}>
      {/* Ambient particles */}
      <svg
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          zIndex: 0,
          opacity: config.backgroundStyle === 'ambient' ? 0.6 : 0.3
        }}
        viewBox="0 0 1920 1080"
      >
        {particleElements.map(p => p.element)}
      </svg>
      
      {/* Title - Fixed at top in safe zone */}
      {titleVisible && (
        <div style={{
          position: 'absolute',
          left: '50%',
          top: 70,
          fontSize: fonts.size_title,
          fontWeight: 700,
          fontFamily: 'Inter, sans-serif',
          color: colors.accent,
          textAlign: 'center',
          opacity: titleAnim.opacity * titleFadeOut,
          transform: `translate(-50%, 0) translateY(${titleAnim.translateY}px)`,
          zIndex: 100,
          maxWidth: '90%'
        }}>
          {config.title.text}
        </div>
      )}
      
      {/* Current stage content */}
      {currentStage >= 0 && transitionProgress > 0.3 && (
        renderStageContent(stages[currentStage], colors, fonts, frame, beats, fps, EZ, width, height, stageProgress)
      )}
      
      {/* Transition overlay */}
      {currentStage >= 0 && transitionProgress < 1 && renderTransition(
        config.transitionStyle,
        transitionProgress,
        colors,
        width,
        height
      )}
    </AbsoluteFill>
  );
};

// Required exports
export const TEMPLATE_ID = 'Spotlight14SingleConcept';
export const TEMPLATE_VERSION = '6.0.0';

// Attach version to component for TemplateRouter detection
Spotlight14SingleConcept.TEMPLATE_VERSION = '6.0.0';
Spotlight14SingleConcept.TEMPLATE_ID = 'Spotlight14SingleConcept';

export const LEARNING_INTENTIONS = {
  primary: ['question', 'reveal'],
  secondary: ['breakdown', 'inspire'],
  tags: ['concept', 'spotlight', 'focus', 'deep-dive', 'single-idea']
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
  minStages: 2,
  transitionStyles: ['fade', 'slide', 'curtain', 'morph']
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
  stages: {
    type: 'dynamic-array',
    min: 2,
    max: 5,
    itemSchema: {
      type: { type: 'enum', options: ['question', 'visual', 'explanation', 'takeaway'], required: true },
      headline: { type: 'string', required: false },
      bodyText: { type: 'string', required: false },
      visual: { type: 'polymorphic-hero', required: false },
      position: { type: 'position-token', default: 'center' }
    }
  },
  transitionStyle: {
    type: 'enum',
    options: ['fade', 'slide', 'curtain', 'morph'],
    default: 'fade'
  },
  emphasisStyle: {
    type: 'enum',
    options: ['pulse', 'glow', 'scale', 'shake'],
    default: 'pulse'
  },
  backgroundStyle: {
    type: 'enum',
    options: ['solid', 'gradient', 'ambient'],
    default: 'solid'
  },
  style_tokens: {
    type: 'style-tokens',
    colors: ['bg', 'bgGradientStart', 'bgGradientEnd', 'accent', 'accent2', 'ink', 'highlight'],
    fonts: ['size_title', 'size_headline', 'size_body', 'size_takeaway']
  },
  beats: {
    type: 'timeline',
    beats: ['entrance', 'titleEntry', 'stageInterval', 'transitionDuration', 'emphasisDuration', 'exit']
  },
  animation: {
    type: 'animation-config',
    options: {
      titleAnimation: ['fade-up', 'slide-left', 'pop'],
      stageEntrance: ['fade-up', 'slide-left', 'pop'],
      transitionEasing: ['power3InOut', 'backOut', 'smooth'],
      emphasisEasing: ['backOut', 'elasticOut', 'smooth']
    }
  }
};
