import React, { useEffect, useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';

// SDK imports - Agnostic Template System v6
import { 
  fadeUpIn, 
  pulseEmphasis,
  EZ,
  useSceneId,
  toFrames,
  renderHero,
  mergeHeroConfig,
  resolvePosition,
  generateAmbientParticles,
  renderAmbientParticles,
  getLetterReveal,
  renderLetterReveal,
  getParticleBurst,
  renderParticleBurst,
  getCardEntrance,
  getIconPop,
  getPulseGlow
} from '../../sdk';
import { 
  GlassmorphicPane, 
  NoiseTexture, 
  SpotlightEffect 
} from '../../sdk/effects/broadcastEffects';
import { loadFontVoice, buildFontTokens, DEFAULT_FONT_VOICE } from '../../sdk/fontSystem';
import { createTransitionProps } from '../../sdk/transitions';

/**
 * TEMPLATE #9: PROGRESSIVE REVEAL - v6.0 (REFACTORED)
 * 
 * PRIMARY INTENTION: REVEAL
 * SECONDARY INTENTIONS: QUESTION, BREAKDOWN
 * 
 * VISUAL PATTERN:
 * - Layer-by-layer progressive unveiling
 * - 2-5 reveal stages with broadcast-grade polish
 * - Each stage: headline, description, visual, stage number indicator
 * - Glassmorphic content panes with curtain/overlay reveals
 * - Multi-layered entrance animations per stage
 * 
 * AGNOSTIC PRINCIPALS:
 * ✅ Type-based polymorphism (hero registry for visuals)
 * ✅ Data-driven structure (dynamic array of stages)
 * ✅ Cumulative beats system (relative timing)
 * ✅ 100% configurability (zero hardcoded visuals)
 * ✅ Separation of concerns (content/layout/style/animation)
 * ✅ Broadcast-grade polish (5 layers, micro-delights)
 * 
 * CONFIGURABILITY:
 * - Number of stages (2-5)
 * - Reveal style: curtain, fade, slide-left, slide-right, zoom, circular
 * - Each stage: headline, description, visual, emoji
 * - Stage numbering: show/hide, position, style
 * - Decorations: particles, spotlights, noise, curtain effects
 * - Cumulative beats for easy timing adjustment
 * - Continuous life animations during holds
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
  revealStyle: 'curtain', // curtain, fade, slide-left, slide-right, zoom, circular
  stages: [
    {
      headline: 'Stage 1',
      description: 'First reveal',
      visual: null,
      emoji: '1️⃣',
      showEmoji: true
    }
  ],
  stageIndicator: {
    show: true,
    position: 'top-left', // top-left, top-right, bottom-left, bottom-right
    style: 'number', // number, emoji, both
    size: 48
  },
  style_tokens: {
    colors: {
      bg: '#FFF9F0',
      accent: '#FF6B35',
      accent2: '#9B59B6',
      ink: '#1A1A1A',
      curtain: '#F5F5DC',
      stageIndicator: '#FF6B35'
    },
    fonts: {
      size_title: 64,
      size_headline: 48,
      size_description: 28,
      size_stage_indicator: 36
    }
  },
  beats: {
    // CUMULATIVE TIMING
    entrance: 0.4,
    titleEntry: 0.2,
    titleHold: 1.0,
    firstStageReveal: 0.8, // Curtain opens
    stageContentDelay: 0.3, // Content fades in after curtain
    stageHold: 2.5, // How long each stage holds
    nextStageTransition: 0.8, // Curtain for next stage
    exit: 1.5
  },
  animation: {
    entrance: 'fade-up',
    transitionEasing: 'power3InOut',
    continuousFloat: true,
    staggerContent: true // Stagger headline/description/visual
  },
  decorations: {
    showTitleUnderline: true,
    underlineColor: null,
    underlineStyle: 'wavy',
    showParticles: true,
    particleCount: 25,
    showSpotlights: true,
    showNoiseTexture: true,
    noiseOpacity: 0.03,
    curtainGlow: true
  },
  typography: {
    voice: 'notebook',
    align: 'center',
    transform: 'none'
  },
  transition: {
    exit: { style: 'fade', durationInFrames: 18, easing: 'smooth' }
  }
};

/**
 * Calculate cumulative beat timings for multi-stage reveals
 */
const calculateCumulativeBeats = (beats, stageCount) => {
  const {
    entrance = 0.4,
    titleEntry = 0.2,
    titleHold = 1.0,
    firstStageReveal = 0.8,
    stageContentDelay = 0.3,
    stageHold = 2.5,
    nextStageTransition = 0.8,
    exit = 1.5
  } = beats;
  
  let cumulative = 0;
  const result = {
    entrance: cumulative,
    title: (cumulative += entrance),
    titleEnd: (cumulative += titleEntry + titleHold),
    stages: []
  };
  
  // Calculate timing for each stage
  for (let i = 0; i < stageCount; i++) {
    const isFirstStage = i === 0;
    const revealDuration = isFirstStage ? firstStageReveal : nextStageTransition;
    
    const stageBeats = {
      revealStart: cumulative,
      revealEnd: (cumulative += revealDuration),
      contentStart: cumulative + stageContentDelay,
      contentEnd: (cumulative += stageContentDelay + stageHold)
    };
    
    result.stages.push(stageBeats);
  }
  
  result.exitStart = cumulative;
  result.exitEnd = (cumulative += exit);
  result.totalDuration = cumulative;
  
  return result;
};

// Render reveal overlay with broadcast-grade polish
const renderRevealOverlay = (style, progress, colors, width, height, config) => {
  const ease = EZ.power3InOut(progress);
  const curtainColor = colors.curtain || DEFAULT_CONFIG.style_tokens.colors.curtain;
  const showGlow = config.decorations?.curtainGlow !== false;
  
  const glowIntensity = interpolate(progress, [0, 0.5, 1], [0, 20, 0]);
  const boxShadow = showGlow 
    ? `inset 0 0 ${glowIntensity}px ${colors.accent}60, 0 0 ${glowIntensity * 2}px ${colors.accent}40`
    : 'none';
  
  switch (style) {
    case 'curtain': {
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
            background: `linear-gradient(to left, ${curtainColor}, ${curtainColor}F0)`,
            transform: `translateX(${leftX}px)`,
            zIndex: 100,
            boxShadow
          }} />
          <div style={{
            position: 'absolute',
            right: '50%',
            top: 0,
            width: '50%',
            height: '100%',
            background: `linear-gradient(to right, ${curtainColor}, ${curtainColor}F0)`,
            transform: `translateX(${rightX}px)`,
            zIndex: 100,
            boxShadow
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
          backgroundColor: curtainColor,
          opacity,
          zIndex: 100,
          boxShadow: showGlow ? `0 0 40px ${colors.accent}30` : 'none'
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
          background: `linear-gradient(to right, ${curtainColor}, ${curtainColor}F0)`,
          transform: `translateX(${x}px)`,
          zIndex: 100,
          boxShadow
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
          background: `linear-gradient(to left, ${curtainColor}, ${curtainColor}F0)`,
          transform: `translateX(${x}px)`,
          zIndex: 100,
          boxShadow
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
          background: `radial-gradient(circle, ${curtainColor}, ${curtainColor}E0)`,
          transform: `translate(-50%, -50%) scale(${scale})`,
          opacity,
          zIndex: 100,
          boxShadow: showGlow ? `0 0 60px ${colors.accent}40` : 'none'
        }} />
      );
    }
    
    case 'circular': {
      const scale = interpolate(ease, [0, 1], [0.01, 3]);
      return (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '200%',
          height: '200%',
          borderRadius: '50%',
          background: `radial-gradient(circle, transparent ${scale * 30}%, ${curtainColor} ${scale * 31}%)`,
          transform: 'translate(-50%, -50%)',
          zIndex: 100,
          pointerEvents: 'none'
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
  
  // Font loading
  const typography = { ...DEFAULT_CONFIG.typography, ...(scene.typography || {}) };
  const fontTokens = buildFontTokens(typography?.voice || DEFAULT_FONT_VOICE) || {
    title: { family: 'Figtree, sans-serif' },
    body: { family: 'Inter, sans-serif' },
    accent: { family: 'Caveat, cursive' },
    utility: { family: 'Inter, sans-serif' }
  };
  
  useEffect(() => {
    loadFontVoice(typography?.voice || DEFAULT_FONT_VOICE);
  }, [typography?.voice]);
  
  // Merge with defaults
  const config = {
    ...DEFAULT_CONFIG,
    ...scene,
    title: { ...DEFAULT_CONFIG.title, ...(scene.title || {}) },
    stageIndicator: { ...DEFAULT_CONFIG.stageIndicator, ...(scene.stageIndicator || {}) },
    style_tokens: {
      colors: { ...DEFAULT_CONFIG.style_tokens.colors, ...(scene.style_tokens?.colors || {}) },
      fonts: { ...DEFAULT_CONFIG.style_tokens.fonts, ...(scene.style_tokens?.fonts || {}) }
    },
    beats: { ...DEFAULT_CONFIG.beats, ...(scene.beats || {}) },
    animation: { ...DEFAULT_CONFIG.animation, ...(scene.animation || {}) },
    decorations: { ...DEFAULT_CONFIG.decorations, ...(scene.decorations || {}) },
    typography: { ...DEFAULT_CONFIG.typography, ...(scene.typography || {}) }
  };
  
  const colors = config.style_tokens.colors;
  const fonts = config.style_tokens.fonts;
  const rawBeats = config.beats;
  const stages = config.stages || DEFAULT_CONFIG.stages;
  
  // Calculate cumulative beats
  const beats = useMemo(() => 
    calculateCumulativeBeats(rawBeats, stages.length),
    [rawBeats, stages.length]
  );
  
  // Ambient particles (memoized)
  const particleCount = config.decorations.showParticles ? config.decorations.particleCount : 0;
  const particles = useMemo(() => 
    generateAmbientParticles(particleCount, 9001, width, height),
    [particleCount, width, height]
  );
  const particleElements = renderAmbientParticles(particles, frame, fps, [colors.accent, colors.accent2, colors.bg]);
  
  // Title animation with letter reveal
  const titleStartFrame = toFrames(beats.title, fps);
  const titleLetterReveal = getLetterReveal(frame, config.title.text, {
    startFrame: beats.title,
    duration: 0.05,
    staggerDelay: 0.05
  }, fps);
  
  const titleAnim = fadeUpIn(frame, {
    start: beats.title,
    dur: 0.8,
    dist: 50,
    ease: 'smooth'
  }, EZ, fps);
  
  // Determine current stage
  let currentStageIndex = -1;
  let currentStageBeats = null;
  let revealProgress = 0;
  let contentProgress = 0;
  
  for (let i = 0; i < stages.length; i++) {
    const stageBeats = beats.stages[i];
    const revealStartFrame = toFrames(stageBeats.revealStart, fps);
    const revealEndFrame = toFrames(stageBeats.revealEnd, fps);
    const contentStartFrame = toFrames(stageBeats.contentStart, fps);
    const contentEndFrame = toFrames(stageBeats.contentEnd, fps);
    
    if (frame >= revealStartFrame) {
      currentStageIndex = i;
      currentStageBeats = stageBeats;
      
      // Calculate reveal progress (curtain opening)
      if (frame < revealEndFrame) {
        revealProgress = Math.min(Math.max((frame - revealStartFrame) / (revealEndFrame - revealStartFrame), 0), 1);
      } else {
        revealProgress = 1;
      }
      
      // Calculate content progress (for stagger animations)
      if (frame >= contentStartFrame) {
        const duration = contentEndFrame - contentStartFrame;
        contentProgress = Math.min((frame - contentStartFrame) / duration, 1);
      }
    }
  }
  
  const currentStage = currentStageIndex >= 0 ? stages[currentStageIndex] : null;
  
  // Stage content animations
  const stageCardAnim = currentStage && getCardEntrance(frame, {
    startFrame: currentStageBeats.contentStart,
    duration: 1.0,
    direction: 'up',
    distance: 80,
    withGlow: true,
    glowColor: `${colors.accent}30`
  }, fps);
  
  const headlineDelay = config.animation.staggerContent ? 0.2 : 0;
  const descriptionDelay = config.animation.staggerContent ? 0.4 : 0;
  const visualDelay = config.animation.staggerContent ? 0.6 : 0;
  
  // Stage indicator animation
  const stageIndicatorAnim = currentStage && getIconPop(frame, {
    startFrame: currentStageBeats.revealEnd,
    duration: 0.5,
    withBounce: true
  }, fps);
  
  // Continuous floating
  const floatingOffset = config.animation.continuousFloat && currentStage
    ? Math.sin((frame - toFrames(currentStageBeats.contentStart, fps)) * 0.02) * 5
    : 0;
  
  // Particle burst on each new stage reveal
  const stageBurstParticles = currentStage && getParticleBurst(frame, {
    triggerFrame: currentStageBeats.revealEnd,
    particleCount: 15,
    duration: 1.0,
    color: colors.accent2,
    size: 8,
    spread: 150
  }, fps);
  
  return (
    <AbsoluteFill className="overflow-hidden" style={{ 
      background: `linear-gradient(135deg, ${colors.bg} 0%, ${colors.bg}E6 50%, ${colors.bg} 100%)`,
      fontFamily: fontTokens.body.family 
    }}>
      {/* Noise texture overlay */}
      {config.decorations.showNoiseTexture && (
        <NoiseTexture opacity={config.decorations.noiseOpacity} scale={1.5} />
      )}
      
      {/* Spotlight effects */}
      {config.decorations.showSpotlights && (
        <>
          <SpotlightEffect 
            x={30} 
            y={40} 
            size={700} 
            color={colors.accent} 
            opacity={0.12} 
          />
          <SpotlightEffect 
            x={70} 
            y={60} 
            size={700} 
            color={colors.accent2} 
            opacity={0.12} 
          />
        </>
      )}
      
      {/* Ambient particles */}
      {config.decorations.showParticles && (
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
      )}
      
      {/* Title with letter reveal */}
      {frame >= titleStartFrame && (
        <div className="absolute left-0 right-0 text-center px-safe-x z-[200]" style={{
          top: 60,
          opacity: titleAnim.opacity,
          transform: `translateY(${titleAnim.translateY}px) scale(${titleAnim.scale})`,
        }}>
          <div style={{
            fontSize: Math.min(fonts.size_title, 72),
            fontWeight: 900,
            fontFamily: fontTokens.title.family,
            color: colors.accent,
            textAlign: typography.align,
            textShadow: '3px 3px 6px rgba(0,0,0,0.3)',
            textTransform: typography.transform !== 'none' ? typography.transform : undefined,
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
          }}>
            {renderLetterReveal(titleLetterReveal.letters, titleLetterReveal.letterOpacities)}
          </div>
          
          {/* Title underline */}
          {config.decorations.showTitleUnderline && (
            <svg 
              width="300" 
              height="20" 
              style={{ 
                margin: '10px auto 0',
                display: 'block',
                opacity: titleLetterReveal.isComplete ? 1 : 0,
                transition: 'opacity 0.3s ease'
              }}
            >
              {config.decorations.underlineStyle === 'wavy' && (
                <path 
                  d="M 10,10 Q 75,5 150,10 T 290,10" 
                  stroke={config.decorations.underlineColor || colors.accent} 
                  strokeWidth="3" 
                  fill="none" 
                  strokeLinecap="round"
                  opacity="0.7"
                />
              )}
              {config.decorations.underlineStyle === 'straight' && (
                <line 
                  x1="10" y1="10" x2="290" y2="10"
                  stroke={config.decorations.underlineColor || colors.accent} 
                  strokeWidth="3" 
                  strokeLinecap="round"
                  opacity="0.7"
                />
              )}
              {config.decorations.underlineStyle === 'dashed' && (
                <line 
                  x1="10" y1="10" x2="290" y2="10"
                  stroke={config.decorations.underlineColor || colors.accent} 
                  strokeWidth="3" 
                  strokeDasharray="5,5"
                  strokeLinecap="round"
                  opacity="0.7"
                />
              )}
            </svg>
          )}
        </div>
      )}
      
      {/* Stage indicator (top corner) */}
      {currentStage && config.stageIndicator.show && revealProgress > 0.5 && (
        <div style={{
          position: 'absolute',
          [config.stageIndicator.position.includes('top') ? 'top' : 'bottom']: 30,
          [config.stageIndicator.position.includes('left') ? 'left' : 'right']: 30,
          fontSize: Math.min(config.stageIndicator.size, 48),
          fontWeight: 900,
          fontFamily: fontTokens.accent.family,
          color: colors.stageIndicator,
          opacity: stageIndicatorAnim.opacity,
          transform: `scale(${stageIndicatorAnim.scale}) rotate(${stageIndicatorAnim.rotation}deg)`,
          zIndex: 150,
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
        }}>
          {(config.stageIndicator.style === 'both' || config.stageIndicator.style === 'emoji') && currentStage.showEmoji && currentStage.emoji}
          {(config.stageIndicator.style === 'both' || config.stageIndicator.style === 'number') && ` Stage ${currentStageIndex + 1}`}
        </div>
      )}
      
      {/* Current stage content */}
      {currentStage && revealProgress > 0.3 && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, calc(-50% + ${floatingOffset}px))`,
          width: '90%',
          maxWidth: 1000,
          zIndex: 50
        }}>
          {/* Particle burst */}
          {stageBurstParticles.length > 0 && renderParticleBurst(
            stageBurstParticles,
            width / 2,
            height / 2
          )}
          
          {/* Glassmorphic content pane */}
          <GlassmorphicPane
            innerRadius={30}
            glowOpacity={0.2}
            borderOpacity={0.4}
            backgroundColor={`${colors.accent}15`}
            padding={50}
            style={{
              opacity: stageCardAnim.opacity,
              transform: `translateY(${stageCardAnim.translateY}px) scale(${stageCardAnim.scale})`,
              boxShadow: stageCardAnim.boxShadow
            }}
          >
            {/* Headline */}
            <div style={{
              fontSize: Math.min(fonts.size_headline, 52),
              fontWeight: 800,
              fontFamily: fontTokens.title.family,
              color: colors.ink,
              textAlign: typography.align,
              marginBottom: 20,
              textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
              lineHeight: 1.3,
              opacity: interpolate(
                contentProgress,
                [headlineDelay, headlineDelay + 0.3],
                [0, 1],
                { extrapolateRight: 'clamp' }
              )
            }}>
              {currentStage.headline}
            </div>
            
            {/* Description */}
            {currentStage.description && (
              <div style={{
                fontSize: Math.min(fonts.size_description, 28),
                fontWeight: 400,
                fontFamily: fontTokens.body.family,
                color: `${colors.ink}CC`,
                textAlign: typography.align,
                lineHeight: 1.6,
                marginBottom: currentStage.visual ? 30 : 0,
                opacity: interpolate(
                  contentProgress,
                  [descriptionDelay, descriptionDelay + 0.3],
                  [0, 1],
                  { extrapolateRight: 'clamp' }
                )
              }}>
                {currentStage.description}
              </div>
            )}
            
            {/* Visual */}
            {currentStage.visual && (
              <div style={{
                marginTop: 20,
                display: 'flex',
                justifyContent: 'center',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))',
                opacity: interpolate(
                  contentProgress,
                  [visualDelay, visualDelay + 0.3],
                  [0, 1],
                  { extrapolateRight: 'clamp' }
                )
              }}>
                {renderHero(
                  mergeHeroConfig(currentStage.visual),
                  frame,
                  beats,
                  colors,
                  EZ,
                  fps
                )}
              </div>
            )}
          </GlassmorphicPane>
        </div>
      )}
      
      {/* Reveal overlay (curtain/fade/slide effect) */}
      {currentStage && revealProgress < 1 && renderRevealOverlay(
        config.revealStyle || DEFAULT_CONFIG.revealStyle,
        revealProgress,
        colors,
        width,
        height,
        config
      )}
    </AbsoluteFill>
  );
};

// Required exports
export const TEMPLATE_ID = 'Reveal9ProgressiveUnveil';
export const TEMPLATE_VERSION = '6.2.0';

// Attach version to component for TemplateRouter detection
Reveal9ProgressiveUnveil.TEMPLATE_VERSION = '6.2.0';
Reveal9ProgressiveUnveil.TEMPLATE_ID = 'Reveal9ProgressiveUnveil';
export const LEARNING_INTENTIONS = {
  primary: ['reveal'],
  secondary: ['question', 'breakdown'],
  tags: ['progressive', 'unveiling', 'suspense', 'layers', 'broadcast-grade']
};

export const getDuration = (scene, fps) => {
  const config = { ...DEFAULT_CONFIG, ...scene };
  const stages = config.stages || DEFAULT_CONFIG.stages;
  const rawBeats = { ...DEFAULT_CONFIG.beats, ...(scene.beats || {}) };
  
  // Calculate cumulative beats to get total duration
  const beats = calculateCumulativeBeats(rawBeats, stages.length);
  
  return toFrames(beats.totalDuration, fps);
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
    options: ['curtain', 'fade', 'slide-left', 'slide-right', 'zoom', 'circular'],
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
      emoji: { type: 'string', default: '🎭', label: 'Stage Emoji' },
      showEmoji: { type: 'boolean', default: true, label: 'Show Emoji' }
    }
  },
  stageIndicator: {
    type: 'object',
    fields: {
      show: { type: 'boolean', default: true, label: 'Show Stage Indicator' },
      position: { type: 'select', options: ['top-left', 'top-right', 'bottom-left', 'bottom-right'], default: 'top-left' },
      style: { type: 'select', options: ['number', 'emoji', 'both'], default: 'both' },
      size: { type: 'number', min: 24, max: 72, default: 48 }
    }
  },
  style_tokens: {
    type: 'style-tokens',
    colors: ['bg', 'accent', 'accent2', 'ink', 'curtain', 'stageIndicator'],
    fonts: ['size_title', 'size_headline', 'size_description', 'size_stage_indicator']
  },
  beats: {
    type: 'timeline',
    description: 'CUMULATIVE timing - each value adds to previous',
    beats: [
      { key: 'entrance', label: 'Entrance (start)', default: 0.4 },
      { key: 'titleEntry', label: '+ Title Entry', default: 0.2 },
      { key: 'titleHold', label: '+ Title Hold', default: 1.0 },
      { key: 'firstStageReveal', label: '+ First Curtain Open', default: 0.8 },
      { key: 'stageContentDelay', label: '+ Content Appears', default: 0.3 },
      { key: 'stageHold', label: '+ Stage Hold', default: 2.5 },
      { key: 'nextStageTransition', label: '+ Next Curtain', default: 0.8 },
      { key: 'exit', label: '+ Exit', default: 1.5 }
    ]
  },
  animation: {
    type: 'animation-config',
    options: {
      entrance: ['fade-up', 'fade', 'slide-up'],
      transitionEasing: ['power3InOut', 'power2Out', 'elastic'],
      continuousFloat: { type: 'boolean', default: true, label: 'Continuous Floating' },
      staggerContent: { type: 'boolean', default: true, label: 'Stagger Content Reveal' }
    }
  },
  decorations: {
    type: 'object',
    fields: {
      showTitleUnderline: { type: 'boolean', default: true },
      underlineColor: { type: 'color', default: null },
      underlineStyle: { type: 'select', options: ['wavy', 'straight', 'dashed'], default: 'wavy' },
      showParticles: { type: 'boolean', default: true },
      particleCount: { type: 'number', min: 0, max: 50, default: 25 },
      showSpotlights: { type: 'boolean', default: true },
      showNoiseTexture: { type: 'boolean', default: true },
      noiseOpacity: { type: 'number', min: 0, max: 0.1, step: 0.01, default: 0.03 },
      curtainGlow: { type: 'boolean', default: true, label: 'Curtain Glow Effect' }
    }
  },
  typography: {
    voice: { type: 'select', label: 'Font Voice', options: ['notebook', 'story', 'utility'] },
    align: { type: 'select', label: 'Text Align', options: ['left', 'center', 'right'] },
    transform: { type: 'select', label: 'Text Transform', options: ['none', 'uppercase', 'lowercase', 'capitalize'] }
  },
  transition: {
    exit: {
      style: { type: 'select', label: 'Exit Style', options: ['none', 'fade', 'slide', 'wipe'] },
      durationInFrames: { type: 'number', label: 'Exit Duration (frames)', min: 6, max: 60 }
    }
  }
};
