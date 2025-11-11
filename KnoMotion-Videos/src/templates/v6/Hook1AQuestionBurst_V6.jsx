import React, { useEffect, useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';

// SDK imports - Agnostic Template System v6
import {
  EZ,
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
 * TEMPLATE #1: QUESTION BURST - v6.0 (BROADCAST POLISH)
 * 
 * PRIMARY INTENTION: HOOK
 * SECONDARY INTENTIONS: QUESTION, CHALLENGE, REVEAL
 * 
 * PURPOSE: Pose thought-provoking questions that engage and intrigue viewers
 * 
 * VISUAL PATTERN:
 * - Two-part question structure (setup + punchline)
 * - Glassmorphic panes with broadcast-grade effects
 * - Letter-by-letter text reveals
 * - Optional central visual with icon pop
 * - 5-layer background depth (gradient, noise, spotlights, particles, glass)
 * - Continuous life animations (floating)
 * - Particle bursts on question reveals
 * 
 * BROADCAST POLISH APPLIED:
 * ✅ Layered background depth (gradient + noise + spotlights)
 * ✅ Glassmorphic content panes
 * ✅ Multi-layered entrance animations
 * ✅ Letter-by-letter reveals
 * ✅ Icon pop animations
 * ✅ Particle bursts on key moments
 * ✅ Continuous life animations (subtle floating)
 * ✅ Cumulative beats system
 * ✅ 100% configurability via decorations
 * 
 * AGNOSTIC PRINCIPALS:
 * ✓ Type-Based Polymorphism (hero registry for visual)
 * ✓ Data-Driven Structure (configurable question parts)
 * ✓ Token-Based Positioning (semantic layout)
 * ✓ Separation of Concerns (content/layout/style/animation)
 * ✓ Progressive Configuration (simple defaults)
 * ✓ Registry Pattern (extensible visual types)
 * 
 * NO HARDCODED VALUES!
 */

// DEFAULT CONFIGURATION
const DEFAULT_CONFIG = {
  title: {
    text: 'Think About This',
    position: 'top-center',
    offset: { x: 0, y: 60 },
    enabled: false // Optional title
  },
  
  questionPart1: {
    text: 'What if geography',
    position: 'center',
    offset: { x: 0, y: -120 }
  },
  
  questionPart2: {
    text: 'was measured in mindsets?',
    position: 'center',
    offset: { x: 0, y: 80 }
  },
  
  centralVisual: {
    type: 'emoji', // emoji | image | roughSVG | lottie | none
    value: '🗺️',
    position: 'center',
    offset: { x: 0, y: 0 },
    scale: 3.0,
    enabled: false // Show after questions fade
  },
  
  conclusion: {
    text: 'Welcome to Knodovia',
    subtitle: 'Where your mindset shapes reality',
    position: 'center',
    offset: { x: 0, y: 0 },
    enabled: false // Optional conclusion
  },
  
  typography: {
    voice: 'notebook',
    align: 'center',
    transform: 'none'
  },

  style_tokens: {
    colors: {
      bg: '#FFF9F0',
      bgGradientStart: '#FFF9F0',
      bgGradientEnd: '#FFE5CC',
      accent: '#FF6B35',
      accent2: '#9B59B6',
      text: '#1A1A1A',
      textSecondary: '#5A5A5A',
      particles: 'rgba(255, 107, 53, 0.3)',
      glassBackground: '#FFFFFF15'
    },
    fonts: {
      size_title: 56,
      size_question: 72,
      size_conclusion: 64,
      size_subtitle: 28,
      weight_question: 800,
      weight_conclusion: 700
    }
  },
  
  beats: {
    // CUMULATIVE TIMING: Each value is added to the previous
    // entrance = 0.4s (absolute start)
    // titleAppears at: entrance = 0.4s
    // q1Appears at: entrance + titleHold + q1Reveal = 0.4 + 0.5 + 0.5 = 1.4s
    // q2Appears at: q1Appears + q1Hold + q2Reveal = 1.4 + 1.2 + 0.8 = 3.4s
    entrance: 0.4,           // Initial background fade in
    titleHold: 0.5,          // Hold title (if enabled) (+0.5s)
    q1Reveal: 0.5,           // Question 1 letter reveal duration (+0.5s)
    q1Hold: 1.2,             // Hold Q1 visible (+1.2s)
    q2Reveal: 0.8,           // Question 2 letter reveal duration (+0.8s)
    q2Hold: 2.0,             // Hold both questions (+2.0s)
    emphasis: 0.8,           // Pulse emphasis both questions (+0.8s)
    questionExit: 0.6,       // Questions exit (+0.6s)
    visualReveal: 0.8,       // Central visual appears (+0.8s)
    visualHold: 1.5,         // Hold visual (+1.5s)
    conclusionReveal: 0.8,   // Conclusion appears (if enabled) (+0.8s)
    conclusionHold: 2.0,     // Hold conclusion (+2.0s)
    fadeOut: 0.8             // Final exit (+0.8s)
  },
  
  animation: {
    letterRevealStyle: 'fade-up', // fade-up, fade, scale
    questionExitDirection: 'left', // left, right, up, down
    visualEntrance: 'icon-pop', // icon-pop, fade-scale, zoom
    easing: 'power3Out',
    continuousFloat: true  // Subtle floating animation during holds
  },
  
  decorations: {
    showBackground: true,
    showGradient: true,
    showNoiseTexture: true,
    noiseOpacity: 0.05,
    showSpotlights: true,
    spotlightCount: 2,
    spotlight1: { x: 0.2, y: 0.3, size: 600, color: '#FF6B3520' },
    spotlight2: { x: 0.8, y: 0.7, size: 500, color: '#9B59B620' },
    showParticles: true,
    particleCount: 30,
    showGlassPane: true,
    glassPaneOpacity: 0.15,
    glassPaneBorderOpacity: 0.3,
    glassInnerRadius: 30,
    showParticleBurst: true,
    particleBurstCount: 15,
    showTitleUnderline: false,  // Optional hand-drawn underline
    underlineStyle: 'wavy'
  },
  
  particles: {
    enabled: true,
    count: 30,
    style: 'ambient',
    seed: 1
  },

  cta: {
    enabled: false,
    label: 'Tap to explore more',
    url: ''
  }
};

// Calculate cumulative beats
const calculateCumulativeBeats = (beats) => {
  let cumulative = 0;
  return {
    entrance: cumulative,
    titleAppears: (cumulative += beats.entrance),
    q1Start: (cumulative += beats.titleHold),
    q1Visible: (cumulative += beats.q1Reveal),
    q2Start: (cumulative += beats.q1Hold),
    q2Visible: (cumulative += beats.q2Reveal),
    emphasisStart: (cumulative += beats.q2Hold),
    questionsExit: (cumulative += beats.emphasis),
    questionsGone: (cumulative += beats.questionExit),
    visualStart: cumulative,
    visualVisible: (cumulative += beats.visualReveal),
    conclusionStart: (cumulative += beats.visualHold),
    conclusionVisible: (cumulative += beats.conclusionReveal),
    fadeOutStart: (cumulative += beats.conclusionHold),
    totalDuration: (cumulative += beats.fadeOut)
  };
};

// MAIN COMPONENT
export const Hook1AQuestionBurst = ({ scene, styles, presets, easingMap }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  
  // Merge config
  const config = { ...DEFAULT_CONFIG, ...scene };
  const rawBeats = { ...DEFAULT_CONFIG.beats, ...(scene.beats || {}) };
  const beats = useMemo(() => calculateCumulativeBeats(rawBeats), [rawBeats]);
  const colors = { ...DEFAULT_CONFIG.style_tokens.colors, ...(scene.style_tokens?.colors || {}) };
  const fonts = { ...DEFAULT_CONFIG.style_tokens.fonts, ...(scene.style_tokens?.fonts || {}) };
  const anim = { ...DEFAULT_CONFIG.animation, ...(scene.animation || {}) };
  const decorations = { ...DEFAULT_CONFIG.decorations, ...(scene.decorations || {}) };
  const typography = { ...DEFAULT_CONFIG.typography, ...(scene.typography || {}) };
  const cta = { ...DEFAULT_CONFIG.cta, ...(scene.cta || {}) };

  useEffect(() => {
    void loadFontVoice(typography.voice || DEFAULT_FONT_VOICE);
  }, [typography.voice]);
  
  const fontTokens = buildFontTokens(typography.voice || DEFAULT_FONT_VOICE);
  
  // Convert beats to frames
  const f = useMemo(() => ({
    entrance: toFrames(beats.entrance, fps),
    titleAppears: toFrames(beats.titleAppears, fps),
    q1Start: toFrames(beats.q1Start, fps),
    q1Visible: toFrames(beats.q1Visible, fps),
    q2Start: toFrames(beats.q2Start, fps),
    q2Visible: toFrames(beats.q2Visible, fps),
    emphasisStart: toFrames(beats.emphasisStart, fps),
    questionsExit: toFrames(beats.questionsExit, fps),
    questionsGone: toFrames(beats.questionsGone, fps),
    visualStart: toFrames(beats.visualStart, fps),
    visualVisible: toFrames(beats.visualVisible, fps),
    conclusionStart: toFrames(beats.conclusionStart, fps),
    conclusionVisible: toFrames(beats.conclusionVisible, fps),
    fadeOutStart: toFrames(beats.fadeOutStart, fps),
    totalDuration: toFrames(beats.totalDuration, fps)
  }), [beats, fps]);
  
  // Ambient particles
  const baseParticles = useMemo(() => {
    if (!decorations.showParticles) return [];
    return generateAmbientParticles(
      decorations.particleCount,
      1,
      width,
      height
    );
  }, [decorations.showParticles, decorations.particleCount, width, height]);

  const ambientParticles = decorations.showParticles
    ? renderAmbientParticles(
        baseParticles,
        frame,
        fps,
        [
          colors.particles || colors.accent,
          colors.accent2,
          `${colors.text}33`,
        ]
      )
    : [];
  
  // ==================== ANIMATIONS ====================
  
  // Background entrance
  const bgOpacity = interpolate(
    frame,
    [0, f.entrance + toFrames(0.3, fps)],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );
  
  // Title animation (if enabled)
  const titleOpacity = config.title.enabled
    ? interpolate(
        frame,
        [f.titleAppears, f.titleAppears + toFrames(0.4, fps)],
        [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      )
    : 0;
  
  // Question Part 1 - Letter Reveal
  const q1LetterReveal = useMemo(() => {
    return getLetterReveal(frame, config.questionPart1.text, {
      startFrame: beats.q1Start,
      duration: rawBeats.q1Reveal,
      staggerDelay: 0.04
    }, fps);
  }, [frame, config.questionPart1.text, beats.q1Start, rawBeats.q1Reveal, fps]);
  
  // Question Part 2 - Letter Reveal
  const q2LetterReveal = useMemo(() => {
    return getLetterReveal(frame, config.questionPart2.text, {
      startFrame: beats.q2Start,
      duration: rawBeats.q2Reveal,
      staggerDelay: 0.04
    }, fps);
  }, [frame, config.questionPart2.text, beats.q2Start, rawBeats.q2Reveal, fps]);
  
  // Question exit animation
  const questionExitProgress = frame >= f.questionsExit
    ? interpolate(
        frame,
        [f.questionsExit, f.questionsGone],
        [0, 1],
        {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: EZ.power3In
        }
      )
    : 0;

  const exitOffset = (() => {
    const direction = anim.questionExitDirection || 'left';
    const distance = questionExitProgress;
    switch (direction) {
      case 'right': return { x: width * distance, y: 0 };
      case 'up': return { x: 0, y: -height * distance };
      case 'down': return { x: 0, y: height * distance };
      case 'left':
      default: return { x: -width * distance, y: 0 };
    }
  })();
  
  // Card entrance for Q1
  const q1CardEntrance = getCardEntrance(frame, {
    startFrame: f.q1Start,
    duration: 0.8,
    direction: 'up',
    distance: 40,
    withGlow: true,
    glowColor: `${colors.accent}40`
  }, fps);
  
  // Card entrance for Q2 (delayed)
  const q2CardEntrance = getCardEntrance(frame, {
    startFrame: f.q2Start,
    duration: 0.9,
    direction: 'up',
    distance: 50,
    withGlow: true,
    glowColor: `${colors.accent2}40`
  }, fps);
  
  // Continuous floating animation (subtle life)
  const floatingOffset1 = anim.continuousFloat && frame >= f.q1Visible
    ? Math.sin((frame - f.q1Start) * 0.02) * 5
    : 0;
    
  const floatingOffset2 = anim.continuousFloat && frame >= f.q2Visible
    ? Math.sin((frame - f.q2Start) * 0.02 + Math.PI) * 5
    : 0;
  
  // Emphasis pulse
  const q1Pulse = frame >= f.emphasisStart && frame < f.questionsExit
    ? 1 + Math.sin((frame - f.emphasisStart) * 0.08) * 0.03
    : 1;
    
  const q2Pulse = frame >= f.emphasisStart && frame < f.questionsExit
    ? 1 + Math.sin((frame - f.emphasisStart) * 0.08 + Math.PI / 4) * 0.03
    : 1;
  
  // Particle burst on Q1 reveal
  const q1ParticleBurst = decorations.showParticleBurst
    ? getParticleBurst(frame, {
        triggerFrame: f.q1Start,
        particleCount: decorations.particleBurstCount,
        duration: 1.2,
        color: colors.accent,
        size: 6,
        spread: 150
      }, fps)
    : [];
  
  // Particle burst on Q2 reveal
  const q2ParticleBurst = decorations.showParticleBurst
    ? getParticleBurst(frame, {
        triggerFrame: f.q2Start,
        particleCount: decorations.particleBurstCount,
        duration: 1.2,
        color: colors.accent2,
        size: 6,
        spread: 150
      }, fps)
    : [];
  
  // Central Visual Animation
  const visualProgress = config.centralVisual.enabled && frame >= f.visualStart
    ? interpolate(
        frame,
        [f.visualStart, f.visualVisible],
        [0, 1],
        {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: EZ.power3Out
        }
      )
    : 0;
  
  // Icon pop for visual
  const visualIconPop = config.centralVisual.enabled
    ? getIconPop(frame, {
        startFrame: f.visualStart,
        duration: 0.8,
        withBounce: true,
        rotation: 10
      }, fps)
    : { opacity: 0, scale: 0, rotation: 0 };
  
  const visualFadeOut = frame >= f.fadeOutStart
    ? interpolate(
        frame,
        [f.fadeOutStart, f.totalDuration],
        [0, 1],
        {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: EZ.power3In
        }
      )
    : 0;
  
  const visualOpacity = visualIconPop.opacity * (1 - visualFadeOut);
  
  // Continuous floating for visual
  const visualFloating = anim.continuousFloat && frame >= f.visualVisible
    ? Math.sin((frame - f.visualStart) * 0.015) * 8
    : 0;
  
  // Conclusion Animation
  const conclusionProgress = config.conclusion.enabled && frame >= f.conclusionStart
    ? interpolate(
        frame,
        [f.conclusionStart, f.conclusionVisible],
        [0, 1],
        {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: EZ.power3Out
        }
      )
    : 0;
  
  const conclusionPulse = config.conclusion.enabled && frame >= f.conclusionVisible && frame < f.fadeOutStart
    ? 1 + Math.sin((frame - f.conclusionStart) * 0.06) * 0.04
    : 1;
  
  const conclusionFadeOut = frame >= f.fadeOutStart
    ? interpolate(
        frame,
        [f.fadeOutStart, f.totalDuration],
        [0, 1],
        {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: EZ.power3In
        }
      )
    : 0;
  
  const conclusionOpacity = conclusionProgress * (1 - conclusionFadeOut);
  
  // Position resolution
  const viewport = { width, height };
  const q1Pos = resolvePosition(
    config.questionPart1.position,
    config.questionPart1.offset,
    viewport
  );

  const q2Pos = resolvePosition(
    config.questionPart2.position,
    config.questionPart2.offset,
    viewport
  );

  const alignmentClass =
    typography.align === 'left'
      ? 'text-left'
      : typography.align === 'right'
      ? 'text-right'
      : 'text-center';

  const textTransform =
    typography.transform === 'uppercase'
      ? 'uppercase'
      : typography.transform === 'lowercase'
      ? 'lowercase'
      : 'none';
  
  // Calculate center positions for particle bursts
  const centerX = width / 2;
  const q1Y = q1Pos.y;
  const q2Y = q2Pos.y;
  
  return (
    <AbsoluteFill
      className="relative flex h-full w-full overflow-hidden"
      style={{ 
        background: decorations.showGradient
          ? `linear-gradient(135deg, ${colors.bgGradientStart} 0%, ${colors.bgGradientEnd} 100%)`
          : colors.bg,
        opacity: bgOpacity
      }}
    >
      {/* Layer 1: Noise Texture */}
      {decorations.showNoiseTexture && (
        <NoiseTexture opacity={decorations.noiseOpacity} />
      )}
      
      {/* Layer 2: Spotlights */}
      {decorations.showSpotlights && (
        <>
          <SpotlightEffect
            x={decorations.spotlight1.x * width}
            y={decorations.spotlight1.y * height}
            size={decorations.spotlight1.size}
            color={decorations.spotlight1.color}
            opacity={0.6}
          />
          {decorations.spotlightCount > 1 && (
            <SpotlightEffect
              x={decorations.spotlight2.x * width}
              y={decorations.spotlight2.y * height}
              size={decorations.spotlight2.size}
              color={decorations.spotlight2.color}
              opacity={0.5}
            />
          )}
        </>
      )}
      
      {/* Layer 3: Ambient Particles */}
      {decorations.showParticles && (
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox={`0 0 ${width} ${height}`}
          style={{ pointerEvents: 'none' }}
        >
          {ambientParticles.map(({ key, element }) =>
            React.cloneElement(element, { key })
          )}
        </svg>
      )}
      
      {/* Layer 4: Particle Bursts */}
      {decorations.showParticleBurst && (
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox={`0 0 ${width} ${height}`}
          style={{ pointerEvents: 'none', zIndex: 50 }}
        >
          {q1ParticleBurst.length > 0 && renderParticleBurst(
            q1ParticleBurst,
            centerX,
            q1Y
          )}
          {q2ParticleBurst.length > 0 && renderParticleBurst(
            q2ParticleBurst,
            centerX,
            q2Y
          )}
        </svg>
      )}
      
      {/* DEBUG: Test plain text */}
      <div style={{
        position: 'absolute',
        top: 100,
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: 48,
        fontFamily: fontTokens.title.family,
        color: '#FF0000',
        zIndex: 999,
        backgroundColor: 'yellow',
        padding: '20px'
      }}>
        DEBUG: Can you see this text?
      </div>
      
      {/* DEBUG: Test question text WITHOUT animation */}
      <div style={{
        position: 'absolute',
        top: 300,
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: 64,
        fontFamily: fontTokens.title.family,
        color: colors.accent,
        zIndex: 999,
        backgroundColor: 'rgba(0,255,0,0.3)',
        padding: '20px',
        maxWidth: '80%',
        textAlign: 'center'
      }}>
        {config.questionPart1.text}
      </div>
      
      <div style={{
        position: 'absolute',
        top: 500,
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: 64,
        fontFamily: fontTokens.title.family,
        color: colors.accent2,
        zIndex: 999,
        backgroundColor: 'rgba(0,0,255,0.3)',
        padding: '20px',
        maxWidth: '80%',
        textAlign: 'center'
      }}>
        {config.questionPart2.text}
      </div>
      
      {/* DEBUG: Test letter reveal data */}
      <div style={{
        position: 'absolute',
        top: 700,
        left: 20,
        fontSize: 20,
        fontFamily: 'monospace',
        color: '#FFFFFF',
        zIndex: 999,
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: '10px'
      }}>
        Frame: {frame}<br/>
        Q1 Start (beats): {beats.q1Start}s<br/>
        Q1 Start (frames): {f.q1Start}<br/>
        Q1 Letters: {q1LetterReveal.letters.length}<br/>
        Q1 First Opacity: {q1LetterReveal.letterOpacities[0]?.toFixed(3)}<br/>
        Q1 Last Opacity: {q1LetterReveal.letterOpacities[q1LetterReveal.letterOpacities.length - 1]?.toFixed(3)}
      </div>
      
      {/* Optional Title */}
      {config.title.enabled && (
        <div
          className="absolute left-1/2 -translate-x-1/2 font-bold tracking-tight"
          style={{
            top: config.title.offset.y,
            fontSize: Math.min(fonts.size_title, 72),
            fontFamily: fontTokens.title.family,
            color: colors.text,
            textTransform,
            opacity: titleOpacity,
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          {config.title.text}
        </div>
      )}
      
      {/* Question Part 1 - Glassmorphic Pane */}
      {frame >= f.q1Start && questionExitProgress < 1 && (
        <div
          className="pointer-events-none absolute"
          style={{
            left: `${q1Pos.x}px`,
            top: `${q1Pos.y + floatingOffset1}px`,
            transform: `translate(-50%, -50%) translate(${exitOffset.x}px, ${exitOffset.y}px) scale(${q1CardEntrance.scale * q1Pulse})`,
            opacity: q1CardEntrance.opacity * (1 - questionExitProgress),
            zIndex: 10
          }}
        >
          {decorations.showGlassPane ? (
            <GlassmorphicPane
              innerRadius={decorations.glassInnerRadius}
              glowOpacity={0.2}
              borderOpacity={decorations.glassPaneBorderOpacity}
              backgroundColor={`${colors.glassBackground}`}
              padding={40}
              style={{
                boxShadow: q1CardEntrance.boxShadow
              }}
            >
              <div
                className={`leading-tight ${alignmentClass}`}
                style={{
                  fontSize: Math.min(fonts.size_question, 80),
                  fontWeight: fonts.weight_question,
                  fontFamily: fontTokens.title.family,
                  color: colors.accent,
                  textTransform,
                  textShadow: '3px 3px 6px rgba(0,0,0,0.25)',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))',
                  maxWidth: '85vw',
                  padding: '20px 0'
                }}
              >
                {renderLetterReveal(q1LetterReveal.letters, q1LetterReveal.letterOpacities)}
              </div>
            </GlassmorphicPane>
          ) : (
            <div
              className={`leading-tight ${alignmentClass}`}
              style={{
                fontSize: Math.min(fonts.size_question, 80),
                fontWeight: fonts.weight_question,
                fontFamily: fontTokens.title.family,
                color: colors.accent,
                textTransform,
                textShadow: '3px 3px 6px rgba(0,0,0,0.25)',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))',
                maxWidth: '88vw'
              }}
            >
              {renderLetterReveal(q1LetterReveal.letters, q1LetterReveal.letterOpacities)}
            </div>
          )}
        </div>
      )}
      
      {/* Question Part 2 - Glassmorphic Pane */}
      {frame >= f.q2Start && questionExitProgress < 1 && (
        <div
          className="pointer-events-none absolute"
          style={{
            left: `${q2Pos.x}px`,
            top: `${q2Pos.y + floatingOffset2}px`,
            transform: `translate(-50%, -50%) translate(${exitOffset.x}px, ${exitOffset.y}px) scale(${q2CardEntrance.scale * q2Pulse})`,
            opacity: q2CardEntrance.opacity * (1 - questionExitProgress),
            zIndex: 10
          }}
        >
          {decorations.showGlassPane ? (
            <GlassmorphicPane
              innerRadius={decorations.glassInnerRadius}
              glowOpacity={0.2}
              borderOpacity={decorations.glassPaneBorderOpacity}
              backgroundColor={`${colors.glassBackground}`}
              padding={40}
              style={{
                boxShadow: q2CardEntrance.boxShadow
              }}
            >
              <div
                className={`leading-tight ${alignmentClass}`}
                style={{
                  fontSize: Math.min(fonts.size_question, 80),
                  fontWeight: fonts.weight_question,
                  fontFamily: fontTokens.title.family,
                  color: colors.accent2,
                  textTransform,
                  textShadow: '3px 3px 6px rgba(0,0,0,0.25)',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))',
                  maxWidth: '85vw',
                  padding: '20px 0'
                }}
              >
                {renderLetterReveal(q2LetterReveal.letters, q2LetterReveal.letterOpacities)}
              </div>
            </GlassmorphicPane>
          ) : (
            <div
              className={`leading-tight ${alignmentClass}`}
              style={{
                fontSize: Math.min(fonts.size_question, 80),
                fontWeight: fonts.weight_question,
                fontFamily: fontTokens.title.family,
                color: colors.accent2,
                textTransform,
                textShadow: '3px 3px 6px rgba(0,0,0,0.25)',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))',
                maxWidth: '88vw'
              }}
            >
              {renderLetterReveal(q2LetterReveal.letters, q2LetterReveal.letterOpacities)}
            </div>
          )}
        </div>
      )}
      
      {/* Central Visual */}
      {config.centralVisual.enabled && config.centralVisual.type !== 'none' && visualOpacity > 0 && (
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            transform: `translate(-50%, -50%) translateY(${visualFloating}px) scale(${visualIconPop.scale}) rotate(${visualIconPop.rotation}deg)`,
            opacity: visualOpacity,
            filter: 'drop-shadow(0 12px 30px rgba(0,0,0,0.3))',
            zIndex: 20
          }}
        >
          {renderHero(
            mergeHeroConfig({
              type: config.centralVisual.type,
              value: config.centralVisual.value,
              scale: config.centralVisual.scale
            }),
            frame,
            rawBeats,
            colors,
            easingMap || EZ,
            fps
          )}
        </div>
      )}
      
      {/* Conclusion */}
      {config.conclusion.enabled && conclusionOpacity > 0 && (
        <div 
          className={`absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center ${alignmentClass}`}
          style={{ 
            opacity: conclusionOpacity,
            transform: `translate(-50%, -50%) scale(${conclusionPulse})`,
            zIndex: 15
          }}
        >
          <div
            className="drop-shadow-lg"
            style={{
              fontSize: Math.min(fonts.size_conclusion, 72),
              fontWeight: fonts.weight_conclusion,
              fontFamily: fontTokens.title.family,
              color: colors.accent,
              marginBottom: 20,
              textTransform,
              textShadow: '3px 3px 6px rgba(0,0,0,0.3)'
            }}
          >
            {config.conclusion.text}
          </div>
          {config.conclusion.subtitle && (
            <div
              className="font-body"
              style={{
                fontSize: Math.min(fonts.size_subtitle, 32),
                fontFamily: fontTokens.body.family,
                color: colors.textSecondary,
                fontWeight: 400,
                textTransform,
                textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
              }}
            >
              {config.conclusion.subtitle}
            </div>
          )}
        </div>
      )}

      {/* CTA Badge */}
      {cta.enabled && conclusionOpacity > 0 && (
        <div 
          className="absolute inset-x-0 bottom-[14%] flex justify-center" 
          style={{ 
            opacity: Math.min(1, conclusionOpacity),
            zIndex: 20
          }}
        >
          {cta.url ? (
            <a
              href={cta.url}
              target="_blank"
              rel="noreferrer"
              className="badge-chalk shadow-lg"
            >
              {cta.label}
            </a>
          ) : (
            <div className="badge-chalk shadow-lg">{cta.label}</div>
          )}
        </div>
      )}
    </AbsoluteFill>
  );
};

// DURATION CALCULATION
export const getDuration = (scene, fps) => {
  const rawBeats = { ...DEFAULT_CONFIG.beats, ...(scene?.beats || {}) };
  const beats = calculateCumulativeBeats(rawBeats);
  return toFrames(beats.totalDuration, fps);
};

// METADATA
export const TEMPLATE_VERSION = '6.2';
export const TEMPLATE_ID = 'Hook1AQuestionBurst';
export const PRIMARY_INTENTION = 'HOOK';
export const SECONDARY_INTENTIONS = ['QUESTION', 'CHALLENGE', 'REVEAL'];

// CONFIG SCHEMA
export const CONFIG_SCHEMA = {
  questionPart1: {
    text: { type: 'textarea', label: 'Question Part 1', rows: 2 }
  },
  questionPart2: {
    text: { type: 'textarea', label: 'Question Part 2', rows: 2 }
  },
  centralVisual: {
    enabled: { type: 'checkbox', label: 'Show Visual' },
    type: { type: 'select', label: 'Visual Type', options: ['emoji', 'image', 'roughSVG', 'lottie', 'none'] },
    value: { type: 'text', label: 'Visual Value' },
    scale: { type: 'slider', label: 'Scale', min: 1, max: 5, step: 0.1 }
  },
  conclusion: {
    enabled: { type: 'checkbox', label: 'Show Conclusion' },
    text: { type: 'text', label: 'Conclusion Text' },
    subtitle: { type: 'text', label: 'Subtitle' }
  },
  typography: {
    voice: {
      type: 'select',
      label: 'Font Voice',
      options: ['notebook', 'story', 'utility']
    },
    align: {
      type: 'select',
      label: 'Text Alignment',
      options: ['left', 'center', 'right']
    },
    transform: {
      type: 'select',
      label: 'Letter Case',
      options: ['none', 'uppercase', 'lowercase']
    }
  },
  animation: {
    letterRevealStyle: {
      type: 'select',
      label: 'Letter Reveal Style',
      options: ['fade-up', 'fade', 'scale']
    },
    questionExitDirection: {
      type: 'select',
      label: 'Question Exit Direction',
      options: ['left', 'right', 'up', 'down']
    },
    visualEntrance: {
      type: 'select',
      label: 'Visual Entrance Style',
      options: ['icon-pop', 'fade-scale', 'zoom']
    },
    continuousFloat: {
      type: 'checkbox',
      label: 'Enable Continuous Float'
    }
  },
  decorations: {
    showGradient: { type: 'checkbox', label: 'Show Gradient Background' },
    showNoiseTexture: { type: 'checkbox', label: 'Show Noise Texture' },
    noiseOpacity: { type: 'slider', label: 'Noise Opacity', min: 0, max: 0.1, step: 0.01 },
    showSpotlights: { type: 'checkbox', label: 'Show Spotlights' },
    spotlightCount: { type: 'slider', label: 'Spotlight Count', min: 0, max: 3, step: 1 },
    showParticles: { type: 'checkbox', label: 'Show Ambient Particles' },
    particleCount: { type: 'slider', label: 'Particle Count', min: 0, max: 50, step: 5 },
    showGlassPane: { type: 'checkbox', label: 'Show Glassmorphic Panes' },
    glassPaneOpacity: { type: 'slider', label: 'Glass Pane Opacity', min: 0, max: 0.3, step: 0.05 },
    showParticleBurst: { type: 'checkbox', label: 'Show Particle Bursts' },
    particleBurstCount: { type: 'slider', label: 'Burst Particle Count', min: 5, max: 30, step: 5 }
  },
  cta: {
    enabled: { type: 'checkbox', label: 'Show CTA Badge' },
    label: { type: 'text', label: 'CTA Label' },
    url: { type: 'text', label: 'CTA Link (optional)' }
  }
};
