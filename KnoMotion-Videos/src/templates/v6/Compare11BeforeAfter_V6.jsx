import React, { useEffect, useRef, useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import { THEME } from '../../utils/theme';
import rough from 'roughjs/bundled/rough.esm.js';

// SDK imports - Agnostic Template System v6
import { 
  fadeUpIn,
  slideInLeft,
  slideInRight,
  pulseEmphasis,
  EZ,
  useSceneId,
  toFrames,
  renderHero,
  mergeHeroConfig,
  resolvePosition,
  positionToCSS,
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
 * TEMPLATE #11: BEFORE/AFTER SPLIT - v6.0
 * 
 * PRIMARY INTENTION: COMPARE
 * SECONDARY INTENTIONS: INSPIRE, REVEAL
 * 
 * VISUAL PATTERN:
 * - Split-screen comparison
 * - Before state (left/top) vs After state (right/bottom)
 * - Slider/wipe transition between states
 * - Labels, visuals, and descriptions for each state
 * - Dramatic reveal of transformation
 * 
 * AGNOSTIC PRINCIPALS:
 * ✅ Type-based polymorphism (visuals via hero registry)
 * ✅ Data-driven structure (before/after state objects)
 * ✅ Token-based positioning (position system)
 * ✅ Separation of concerns (content/layout/style/animation)
 * ✅ Progressive configuration (simple → advanced)
 * ✅ Registry pattern (extensible visual types)
 * 
 * CONFIGURABILITY:
 * - Split orientation: vertical (side-by-side) or horizontal (top-bottom)
 * - Before state: label, headline, description, visual
 * - After state: label, headline, description, visual
 * - Transition style: wipe, slide, fade, slider
 * - Colors, fonts, timing all configurable
 * - Reveal animation style
 * - Emphasis effects
 * 
 * NO HARDCODED VALUES!
 */

// Default configuration
const DEFAULT_CONFIG = {
  title: {
    text: 'Before vs After',
    position: 'top-center',
    offset: { x: 0, y: 30 }
  },
  splitOrientation: 'vertical', // vertical (side-by-side), horizontal (top-bottom)
  transitionStyle: 'slider', // wipe, slide, fade, slider
  before: {
    label: 'BEFORE',
    headline: 'Starting Point',
    description: 'Where we began',
    visual: null,
    backgroundColor: '#FFE5E5',
    emoji: '⚠️',  // Configurable decorative emoji
    showEmoji: true
  },
  after: {
    label: 'AFTER',
    headline: 'End Result',
    description: 'Where we arrived',
    visual: null,
    backgroundColor: '#E5FFE5',
    emoji: '✨',  // Configurable decorative emoji
    showEmoji: true
  },
  style_tokens: {
    colors: {
      bg: '#F5F5F5',
      accent: '#FF6B35',
      accent2: '#00C853',
      ink: '#1A1A1A',
      divider: '#333333'
    },
    fonts: {
      size_title: 64,
      size_label: 24,
      size_headline: 42,
      size_description: 24
    }
  },
  beats: {
    // CUMULATIVE TIMING: Each value is added to the previous
    // entrance = 0.4s
    // title appears at: entrance + titleEntry = 0.4 + 0.2 = 0.6s
    // before appears at: entrance + titleEntry + beforeReveal = 0.4 + 0.2 + 1.0 = 1.6s
    entrance: 0.4,           // Initial fade in (absolute start)
    titleEntry: 0.2,         // After entrance (+0.2s)
    titleHold: 0.8,          // Hold title visible (+0.8s) 
    beforeReveal: 1.0,       // Before section appears (+1.0s)
    beforeHold: 2.0,         // Hold before visible (+2.0s)
    transitionDuration: 2.0, // Slider animation duration (+2.0s)
    afterReveal: 0.3,        // After appears during transition (+0.3s)
    afterHold: 2.0,          // Hold after visible (+2.0s)
    afterEmphasize: 0.8,     // Pulse emphasis (+0.8s)
    exit: 1.5                // Exit animation (+1.5s)
  },
  animation: {
    beforeEntrance: 'slide-right',
    afterEntrance: 'slide-left',
    pulseAfter: true,
    continuousFloat: true  // Subtle floating animation throughout
  },
  decorations: {
    showTitleUnderline: true,
    underlineColor: null,  // null = use accent color
    underlineStyle: 'wavy', // wavy, straight, dashed
    showParticles: true,
    particleCount: 30,
    showSpotlights: true,
    showNoiseTexture: true,
    noiseOpacity: 0.04
  },
  typography: {
    voice: 'utility',
    align: 'center',
    transform: 'none'
  },
  transition: {
    exit: { style: 'fade', durationInFrames: 18, easing: 'smooth' }
  }
};

/**
 * Calculate cumulative beat timings
 * Converts relative durations to absolute timestamps
 */
const calculateCumulativeBeats = (beats) => {
  const {
    entrance = 0.4,
    titleEntry = 0.2,
    titleHold = 0.8,
    beforeReveal = 1.0,
    beforeHold = 2.0,
    transitionDuration = 2.0,
    afterReveal = 0.3,
    afterHold = 2.0,
    afterEmphasize = 0.8,
    exit = 1.5
  } = beats;
  
  let cumulative = 0;
  
  return {
    entrance: cumulative,
    title: (cumulative += entrance),
    titleEnd: (cumulative += titleEntry + titleHold),
    beforeStart: (cumulative = cumulative - titleHold + beforeReveal),
    beforeEnd: (cumulative += beforeHold),
    transitionStart: cumulative,
    transitionEnd: (cumulative += transitionDuration),
    afterStart: cumulative - transitionDuration + afterReveal,
    afterEnd: (cumulative += afterHold),
    emphasizeStart: cumulative,
    emphasizeEnd: (cumulative += afterEmphasize),
    exitStart: cumulative,
    exitEnd: (cumulative += exit),
    totalDuration: cumulative
  };
};

// Render split divider with broadcast-grade polish
const renderDivider = (orientation, progress, colors, width, height, frame, fps) => {
  const ease = EZ.power3InOut(progress);
  
  // Pulsing glow effect on divider
  const glowIntensity = interpolate(progress, [0, 0.5, 1], [10, 30, 10]);
  
  if (orientation === 'vertical') {
    // Vertical divider with animated position
    const leftWidth = interpolate(ease, [0, 1], [50, 100]);
    
    return (
      <>
        {/* Moving divider line with glow */}
        <div style={{
          position: 'absolute',
          left: `${leftWidth}%`,
          top: 0,
          width: 6,
          height: '100%',
          background: `linear-gradient(to right, 
            transparent,
            ${colors.divider}40,
            ${colors.divider},
            ${colors.divider}40,
            transparent
          )`,
          transform: 'translateX(-50%)',
          zIndex: 100,
          boxShadow: `
            0 0 ${glowIntensity}px ${colors.divider}80,
            0 0 40px rgba(0,0,0,0.3)
          `
        }}>
          {/* Drag handle visual with glassmorphic effect */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 70,
            height: 70,
            borderRadius: '50%',
            backgroundColor: `${colors.divider}E6`,
            backdropFilter: 'blur(10px)',
            border: `2px solid ${colors.divider}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `
              0 8px 24px rgba(0,0,0,0.4),
              0 0 ${glowIntensity}px ${colors.divider}60,
              inset 0 2px 0 rgba(255,255,255,0.3)
            `
          }}>
            {/* Animated icon */}
            <div style={{
              color: '#FFFFFF',
              fontSize: 28,
              fontWeight: 900,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              animation: 'pulse 2s ease-in-out infinite'
            }}>
              ⟷
            </div>
          </div>
        </div>
      </>
    );
  } else {
    // Horizontal divider with animated position
    const topHeight = interpolate(ease, [0, 1], [50, 100]);
    
    return (
      <>
        {/* Moving divider line with glow */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: `${topHeight}%`,
          width: '100%',
          height: 6,
          background: `linear-gradient(to bottom, 
            transparent,
            ${colors.divider}40,
            ${colors.divider},
            ${colors.divider}40,
            transparent
          )`,
          transform: 'translateY(-50%)',
          zIndex: 100,
          boxShadow: `
            0 0 ${glowIntensity}px ${colors.divider}80,
            0 0 40px rgba(0,0,0,0.3)
          `
        }}>
          {/* Drag handle visual with glassmorphic effect */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 70,
            height: 70,
            borderRadius: '50%',
            backgroundColor: `${colors.divider}E6`,
            backdropFilter: 'blur(10px)',
            border: `2px solid ${colors.divider}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `
              0 8px 24px rgba(0,0,0,0.4),
              0 0 ${glowIntensity}px ${colors.divider}60,
              inset 0 2px 0 rgba(255,255,255,0.3)
            `
          }}>
            {/* Animated icon */}
            <div style={{
              color: '#FFFFFF',
              fontSize: 28,
              fontWeight: 900,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              transform: 'rotate(90deg)'
            }}>
              ⟷
            </div>
          </div>
        </div>
      </>
    );
  }
};

export const Compare11BeforeAfter = ({ scene, styles, presets, easingMap }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  
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
    before: { ...DEFAULT_CONFIG.before, ...(scene.before || {}) },
    after: { ...DEFAULT_CONFIG.after, ...(scene.after || {}) },
    style_tokens: {
      colors: { ...DEFAULT_CONFIG.style_tokens.colors, ...(scene.style_tokens?.colors || {}) },
      fonts: { ...DEFAULT_CONFIG.style_tokens.fonts, ...(scene.style_tokens?.fonts || {}) }
    },
    beats: { ...DEFAULT_CONFIG.beats, ...(scene.beats || {}) },
    animation: { ...DEFAULT_CONFIG.animation, ...(scene.animation || {}) },
    decorations: { ...DEFAULT_CONFIG.decorations, ...(scene.decorations || {}) }
  };
  
  const colors = config.style_tokens.colors;
  const fonts = config.style_tokens.fonts;
  const rawBeats = config.beats;
  
  // Calculate cumulative beat timings (relative → absolute)
  const beats = calculateCumulativeBeats(rawBeats);
  
  // Ambient particles (memoized for performance)
  const particleCount = config.decorations.showParticles ? config.decorations.particleCount : 0;
  const particles = useMemo(() => 
    generateAmbientParticles(particleCount, 11001, width, height),
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
  
  const titlePos = resolvePosition(
    config.title.position || DEFAULT_CONFIG.title.position,
    config.title.offset || DEFAULT_CONFIG.title.offset,
    { width, height }
  );
  
  // Before state animation with card entrance
  const beforeStartFrame = toFrames(beats.beforeStart, fps);
  const beforeCardAnim = getCardEntrance(frame, {
    startFrame: beats.beforeStart,
    duration: 1.0,
    direction: 'left',
    distance: 120,
    withGlow: true,
    glowColor: `${colors.accent}40`
  }, fps);
  
  // Label icon pop
  const beforeLabelIconAnim = getIconPop(frame, {
    startFrame: beats.beforeStart + 0.3,
    duration: 0.6,
    withBounce: true
  }, fps);
  
  // Continuous floating animation for before section
  const beforeFloat = config.animation.continuousFloat 
    ? Math.sin((frame - beforeStartFrame) * 0.02) * 5 
    : 0;
  
  // Transition animation
  const transitionStartFrame = toFrames(beats.transitionStart, fps);
  const transitionEndFrame = toFrames(beats.transitionEnd, fps);
  const transitionProgress = frame >= transitionStartFrame && frame <= transitionEndFrame
    ? (frame - transitionStartFrame) / (transitionEndFrame - transitionStartFrame)
    : frame > transitionEndFrame ? 1 : 0;
  
  // After state animation with card entrance
  const afterStartFrame = toFrames(beats.afterStart, fps);
  const afterCardAnim = getCardEntrance(frame, {
    startFrame: beats.afterStart,
    duration: 1.0,
    direction: 'right',
    distance: 120,
    withGlow: true,
    glowColor: `${colors.accent2}40`
  }, fps);
  
  // Label icon pop
  const afterLabelIconAnim = getIconPop(frame, {
    startFrame: beats.afterStart + 0.3,
    duration: 0.6,
    withBounce: true
  }, fps);
  
  // Continuous floating animation for after section
  const afterFloat = config.animation.continuousFloat 
    ? Math.sin((frame - afterStartFrame) * 0.02 + Math.PI) * 5 
    : 0;
  
  // After emphasis pulse with glow
  const afterEmphasizeFrame = toFrames(beats.emphasizeStart, fps);
  let afterPulseScale = 1;
  let afterPulseGlow = { boxShadow: 'none' };
  if (config.animation.pulseAfter && frame >= afterEmphasizeFrame) {
    afterPulseScale = pulseEmphasis(frame, {
      start: beats.emphasizeStart,
      dur: 0.6,
      ease: 'smooth'
    }, EZ, fps).scale;
    
    afterPulseGlow = getPulseGlow(frame, {
      frequency: 0.08,
      intensity: 30,
      color: `${colors.accent2}60`,
      startFrame: afterEmphasizeFrame
    });
  }
  
  // Particle burst on transition
  const transitionBurstParticles = getParticleBurst(frame, {
    triggerFrame: beats.transitionStart,
    particleCount: 20,
    duration: 1.2,
    color: colors.accent2,
    size: 8,
    spread: 200
  }, fps);
  
  // Calculate split areas
  const isVertical = config.splitOrientation === 'vertical';
  const beforeArea = {
    width: isVertical ? '50%' : '100%',
    height: isVertical ? '100%' : '50%',
    left: 0,
    top: 0
  };
  const afterArea = {
    width: isVertical ? '50%' : '100%',
    height: isVertical ? '100%' : '50%',
    left: isVertical ? '50%' : 0,
    top: isVertical ? 0 : '50%'
  };
  
  return (
    <AbsoluteFill className="overflow-hidden" style={{ 
      background: `linear-gradient(135deg, ${colors.bg} 0%, ${colors.bg}E6 50%, ${colors.bg} 100%)`,
      fontFamily: fontTokens.body.family 
    }}>
      {/* Noise texture overlay - CONFIGURABLE */}
      {config.decorations.showNoiseTexture && (
        <NoiseTexture opacity={config.decorations.noiseOpacity} scale={1.5} />
      )}
      
      {/* Spotlight effects for before/after sections - CONFIGURABLE */}
      {config.decorations.showSpotlights && (
        <>
          <SpotlightEffect 
            x={25} 
            y={50} 
            size={600} 
            color={colors.accent} 
            opacity={0.15} 
          />
          <SpotlightEffect 
            x={75} 
            y={50} 
            size={600} 
            color={colors.accent2} 
            opacity={0.15} 
          />
        </>
      )}
      
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
      
      {/* Title with letter reveal */}
      {frame >= titleStartFrame && (
        <div className="absolute left-0 right-0 text-center px-safe-x z-[200]" style={{
          top: 50,
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
          {/* Doodle underline - CONFIGURABLE */}
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
      
      {/* BEFORE side - with gradient background and glassmorphic content */}
      {frame >= beforeStartFrame && (
        <div style={{
          position: 'absolute',
          ...beforeArea,
          background: `linear-gradient(135deg, 
            ${config.before.backgroundColor}F0 0%, 
            ${config.before.backgroundColor}CC 50%,
            ${config.before.backgroundColor}F0 100%
          )`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 60,
          zIndex: 1
        }}>
          {/* Glassmorphic content pane */}
          <GlassmorphicPane
            innerRadius={30}
            glowOpacity={0.2}
            borderOpacity={0.4}
            backgroundColor={`${colors.accent}15`}
            padding={40}
            style={{
              maxWidth: '85%',
              opacity: beforeCardAnim.opacity,
              transform: `translate(${beforeCardAnim.translateX}px, ${beforeCardAnim.translateY + beforeFloat}px) scale(${beforeCardAnim.scale})`,
              boxShadow: beforeCardAnim.boxShadow
            }}
          >
            {/* Label with icon animation - CONFIGURABLE EMOJI */}
            <div 
              className="uppercase tracking-wider mb-5 flex items-center justify-center gap-2" 
              style={{
                fontSize: Math.min(fonts.size_label, 28),
                fontWeight: 700,
                fontFamily: fontTokens.accent.family,
                color: colors.accent,
                opacity: beforeLabelIconAnim.opacity,
                transform: `scale(${beforeLabelIconAnim.scale}) rotate(${beforeLabelIconAnim.rotation}deg)`
              }}
            >
              {config.before.showEmoji && (
                <span style={{ 
                  display: 'inline-block',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                }}>
                  {config.before.emoji}
                </span>
              )}
              {config.before.label}
            </div>
            
            {/* Headline */}
            <div className="text-center mb-4" style={{
              fontSize: Math.min(fonts.size_headline, 48),
              fontWeight: 800,
              fontFamily: fontTokens.title.family,
              color: colors.ink,
              textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
              lineHeight: 1.3
            }}>
              {config.before.headline}
            </div>
            
            {/* Description */}
            {config.before.description && (
              <div className="text-center max-w-[90%] mx-auto leading-relaxed mb-6" style={{
                fontSize: Math.min(fonts.size_description, 22),
                fontWeight: 400,
                fontFamily: fontTokens.body.family,
                color: `${colors.ink}CC`,
                lineHeight: 1.6
              }}>
                {config.before.description}
              </div>
            )}
            
            {/* Visual */}
            {config.before.visual && (
              <div style={{
                marginTop: 20,
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))'
              }}>
                {renderHero(
                  mergeHeroConfig(config.before.visual),
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
      
      {/* AFTER side - with gradient background and glassmorphic content + particles */}
      {frame >= afterStartFrame && (
        <div style={{
          position: 'absolute',
          ...afterArea,
          background: `linear-gradient(135deg, 
            ${config.after.backgroundColor}F0 0%, 
            ${config.after.backgroundColor}CC 50%,
            ${config.after.backgroundColor}F0 100%
          )`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 60,
          zIndex: 2
        }}>
          {/* Particle burst at center on reveal */}
          {transitionBurstParticles.length > 0 && renderParticleBurst(
            transitionBurstParticles, 
            isVertical ? width * 0.75 : width * 0.5,
            isVertical ? height * 0.5 : height * 0.75
          )}
          
          {/* Glassmorphic content pane */}
          <GlassmorphicPane
            innerRadius={30}
            glowOpacity={0.25}
            borderOpacity={0.5}
            backgroundColor={`${colors.accent2}20`}
            padding={40}
            style={{
              maxWidth: '85%',
              opacity: afterCardAnim.opacity,
              transform: `translate(${afterCardAnim.translateX}px, ${afterCardAnim.translateY + afterFloat}px) scale(${afterCardAnim.scale * afterPulseScale})`,
              boxShadow: afterCardAnim.boxShadow,
              ...afterPulseGlow
            }}
          >
            {/* Label with icon animation - CONFIGURABLE EMOJI */}
            <div 
              className="uppercase tracking-wider mb-5 flex items-center justify-center gap-2" 
              style={{
                fontSize: Math.min(fonts.size_label, 28),
                fontWeight: 700,
                fontFamily: fontTokens.accent.family,
                color: colors.accent2,
                opacity: afterLabelIconAnim.opacity,
                transform: `scale(${afterLabelIconAnim.scale}) rotate(${afterLabelIconAnim.rotation}deg)`
              }}
            >
              {config.after.showEmoji && (
                <span style={{ 
                  display: 'inline-block',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                }}>
                  {config.after.emoji}
                </span>
              )}
              {config.after.label}
            </div>
            
            {/* Headline */}
            <div className="text-center mb-4" style={{
              fontSize: Math.min(fonts.size_headline, 48),
              fontWeight: 800,
              fontFamily: fontTokens.title.family,
              color: colors.ink,
              textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
              lineHeight: 1.3
            }}>
              {config.after.headline}
            </div>
            
            {/* Description */}
            {config.after.description && (
              <div className="text-center max-w-[90%] mx-auto leading-relaxed mb-6" style={{
                fontSize: Math.min(fonts.size_description, 22),
                fontWeight: 400,
                fontFamily: fontTokens.body.family,
                color: `${colors.ink}CC`,
                lineHeight: 1.6
              }}>
                {config.after.description}
              </div>
            )}
            
            {/* Visual */}
            {config.after.visual && (
              <div style={{
                marginTop: 20,
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))'
              }}>
                {renderHero(
                  mergeHeroConfig(config.after.visual),
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
      
      {/* Animated divider/slider */}
      {frame >= transitionStartFrame && config.transitionStyle === 'slider' && renderDivider(
        config.splitOrientation || DEFAULT_CONFIG.splitOrientation,
        transitionProgress,
        colors,
        width,
        height,
        frame,
        fps
      )}
    </AbsoluteFill>
  );
};

// Required exports
export const TEMPLATE_ID = 'Compare11BeforeAfter';
export const TEMPLATE_VERSION = '6.0.0';

// Attach version to component for TemplateRouter detection
Compare11BeforeAfter.TEMPLATE_VERSION = '6.0.0';
Compare11BeforeAfter.TEMPLATE_ID = 'Compare11BeforeAfter';
export const LEARNING_INTENTIONS = {
  primary: ['compare'],
  secondary: ['inspire', 'reveal'],
  tags: ['transformation', 'contrast', 'before-after', 'change']
};

export const getDuration = (scene, fps) => {
  const config = { ...DEFAULT_CONFIG, ...scene };
  const rawBeats = { ...DEFAULT_CONFIG.beats, ...(scene.beats || {}) };
  
  // Calculate cumulative beats to get total duration
  const beats = calculateCumulativeBeats(rawBeats);
  
  return toFrames(beats.totalDuration, fps);
};

export const CAPABILITIES = {
  usesSVG: false,
  usesRoughJS: false,
  usesLottie: false,
  requiresAudio: false,
  splitScreens: 2,
  orientationOptions: ['vertical', 'horizontal'],
  transitionStyles: ['wipe', 'slide', 'fade', 'slider']
};

// Configuration schema for AdminConfig integration
export const CONFIG_SCHEMA = {
  title: {
    type: 'object',
    fields: {
      text: { type: 'string', required: true },
      position: { type: 'position-token', default: 'top-center' },
      offset: { type: 'offset', default: { x: 0, y: 30 } }
    }
  },
  splitOrientation: {
    type: 'enum',
    options: ['vertical', 'horizontal'],
    default: 'vertical'
  },
  transitionStyle: {
    type: 'enum',
    options: ['wipe', 'slide', 'fade', 'slider'],
    default: 'slider'
  },
  before: {
    type: 'object',
    fields: {
      label: { type: 'string', required: true },
      headline: { type: 'string', required: true },
      description: { type: 'string', required: false },
      visual: { type: 'polymorphic-hero', required: false },
      backgroundColor: { type: 'color', default: '#FFE5E5' },
      emoji: { type: 'string', default: '⚠️', label: 'Decorative Emoji' },
      showEmoji: { type: 'boolean', default: true, label: 'Show Emoji' }
    }
  },
  after: {
    type: 'object',
    fields: {
      label: { type: 'string', required: true },
      headline: { type: 'string', required: true },
      description: { type: 'string', required: false },
      visual: { type: 'polymorphic-hero', required: false },
      backgroundColor: { type: 'color', default: '#E5FFE5' },
      emoji: { type: 'string', default: '✨', label: 'Decorative Emoji' },
      showEmoji: { type: 'boolean', default: true, label: 'Show Emoji' }
    }
  },
  style_tokens: {
    type: 'style-tokens',
    colors: ['bg', 'accent', 'accent2', 'ink', 'divider'],
    fonts: ['size_title', 'size_label', 'size_headline', 'size_description']
  },
  beats: {
    type: 'timeline',
    description: 'CUMULATIVE timing - each value adds to the previous',
    beats: [
      { key: 'entrance', label: 'Entrance (start)', default: 0.4 },
      { key: 'titleEntry', label: '+ Title Entry', default: 0.2 },
      { key: 'titleHold', label: '+ Title Hold', default: 0.8 },
      { key: 'beforeReveal', label: '+ Before Reveal', default: 1.0 },
      { key: 'beforeHold', label: '+ Before Hold', default: 2.0 },
      { key: 'transitionDuration', label: '+ Transition', default: 2.0 },
      { key: 'afterReveal', label: '+ After Reveal', default: 0.3 },
      { key: 'afterHold', label: '+ After Hold', default: 2.0 },
      { key: 'afterEmphasize', label: '+ Emphasis', default: 0.8 },
      { key: 'exit', label: '+ Exit', default: 1.5 }
    ]
  },
  animation: {
    type: 'animation-config',
    options: {
      beforeEntrance: ['slide-right', 'fade-up', 'pop'],
      afterEntrance: ['slide-left', 'fade-up', 'pop'],
      pulseAfter: { type: 'boolean', default: true, label: 'Pulse After Section' },
      continuousFloat: { type: 'boolean', default: true, label: 'Continuous Floating' }
    }
  },
  decorations: {
    type: 'object',
    fields: {
      showTitleUnderline: { type: 'boolean', default: true, label: 'Show Title Underline' },
      underlineColor: { type: 'color', default: null, label: 'Underline Color (null = accent)' },
      underlineStyle: { type: 'select', options: ['wavy', 'straight', 'dashed'], default: 'wavy', label: 'Underline Style' },
      showParticles: { type: 'boolean', default: true, label: 'Show Particles' },
      particleCount: { type: 'number', min: 0, max: 50, default: 30, label: 'Particle Count' },
      showSpotlights: { type: 'boolean', default: true, label: 'Show Spotlights' },
      showNoiseTexture: { type: 'boolean', default: true, label: 'Show Noise Texture' },
      noiseOpacity: { type: 'number', min: 0, max: 0.1, step: 0.01, default: 0.04, label: 'Noise Opacity' }
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
