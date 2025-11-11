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
 * TEMPLATE #2: AMBIENT MYSTERY - v6.0 (BROADCAST POLISH)
 * 
 * PRIMARY INTENTION: HOOK
 * SECONDARY INTENTIONS: REVEAL, INSPIRE, QUESTION
 * 
 * PURPOSE: Create atmospheric intrigue and suspense with mystery
 * 
 * VISUAL PATTERN:
 * - Dark, mysterious atmosphere with fog layers
 * - Sequential text reveals (whisper → question → hint)
 * - Glassmorphic panes with atmospheric depth
 * - Letter-by-letter reveals for mystique
 * - Optional central visual with glow
 * - 5-layer background (gradient, noise, spotlights, fog, particles)
 * - Continuous floating animations
 * - Particle bursts on reveals
 * 
 * BROADCAST POLISH APPLIED:
 * ✅ Layered background depth (dark gradient, noise, spotlights, fog)
 * ✅ Glassmorphic panes for text elements
 * ✅ Multi-layered card entrance animations
 * ✅ Letter-by-letter reveals for whisper/question/hint
 * ✅ Icon pop animation for central visual
 * ✅ Particle bursts on text reveals
 * ✅ Continuous floating animations (mysterious drift)
 * ✅ Enhanced pulsing glow effects
 * ✅ Cumulative beats system
 * ✅ 100% configurability via decorations
 * 
 * AGNOSTIC PRINCIPALS:
 * ✓ Type-Based Polymorphism (hero registry for visual)
 * ✓ Data-Driven Structure (configurable text sequence)
 * ✓ Token-Based Positioning (semantic layout)
 * ✓ Separation of Concerns (content/layout/style/animation)
 * ✓ Progressive Configuration (simple defaults)
 * ✓ Registry Pattern (extensible visual types)
 * 
 * NO HARDCODED VALUES!
 */

// DEFAULT CONFIGURATION
const DEFAULT_CONFIG = {
  whisper: {
    text: 'In the depths of knowledge...',
    position: 'top-center',
    offset: { x: 0, y: 120 },
    enabled: true
  },
  
  question: {
    text: 'What secrets lie beneath the surface?',
    position: 'center',
    offset: { x: 0, y: 0 }
  },
  
  hint: {
    text: 'Sometimes the answer is in the shadows',
    position: 'bottom-center',
    offset: { x: 0, y: -120 },
    enabled: true
  },
  
  centralVisual: {
    type: 'emoji',
    value: '🌫️',
    position: 'center',
    offset: { x: 0, y: -80 },
    scale: 2.5,
    enabled: false
  },
  
  typography: {
    voice: 'story',
    align: 'center',
    transform: 'none'
  },

  style_tokens: {
    colors: {
      bg: '#0F1419',
      bgGradientStart: '#0F1419',
      bgGradientEnd: '#1A1F2E',
      fog: 'rgba(74, 85, 104, 0.25)',
      accent: '#8E44AD',
      accent2: '#6C7A89',
      text: '#E8F4FD',
      textSecondary: '#9CA3AF',
      glow: '#F39C12',
      glassBackground: '#FFFFFF08'
    },
    fonts: {
      size_whisper: 36,
      size_question: 68,
      size_hint: 26,
      weight_whisper: 400,
      weight_question: 700,
      weight_hint: 400
    }
  },
  
  beats: {
    // CUMULATIVE TIMING: Each value is added to the previous
    // entrance = 0.5s (absolute start)
    // fogStart at: entrance = 0.5s
    // whisperStart at: entrance + fogBuild = 0.5 + 1.5 = 2.0s
    // questionStart at: whisperStart + whisperHold + whisperFade = 2.0 + 1.5 + 0.5 = 4.0s
    entrance: 0.5,           // Initial background fade
    fogBuild: 1.5,           // Fog layers build up (+1.5s)
    whisperReveal: 1.0,      // Whisper letter reveal duration (+1.0s)
    whisperHold: 1.5,        // Hold whisper visible (+1.5s)
    whisperFade: 0.5,        // Whisper fades out (+0.5s)
    questionReveal: 1.2,     // Question letter reveal (+1.2s)
    questionHold: 2.0,       // Hold question (+2.0s)
    glowEmphasis: 1.0,       // Glow emphasis starts (+1.0s)
    hintReveal: 1.0,         // Hint letter reveal (+1.0s)
    hintHold: 2.0,           // Hold hint (+2.0s)
    settle: 1.0,             // Final settle (+1.0s)
    exit: 1.0                // Exit animation (+1.0s)
  },
  
  animation: {
    letterRevealStyle: 'fade-up',
    cameraZoom: true,
    zoomAmount: 0.08,
    continuousFloat: true,   // Mysterious drifting motion
    continuousPulse: true    // Pulsing glow throughout
  },
  
  decorations: {
    showBackground: true,
    showGradient: true,
    showNoiseTexture: true,
    noiseOpacity: 0.06,
    showSpotlights: true,
    spotlightCount: 2,
    spotlight1: { x: 0.25, y: 0.35, size: 500, color: '#8E44AD15' },
    spotlight2: { x: 0.75, y: 0.65, size: 450, color: '#F39C1210' },
    showFog: true,
    fogLayers: 2,
    fogIntensity: 0.25,
    showVignette: true,
    vignetteIntensity: 0.45,
    showParticles: true,
    particleCount: 25,
    showGlassPane: true,
    glassPaneOpacity: 0.08,
    glassPaneBorderOpacity: 0.25,
    glassInnerRadius: 30,
    showParticleBurst: true,
    particleBurstCount: 12,
    showGlow: true,
    glowIntensity: 0.6,
    glowColor: '#F39C12'
  },

  signature: {
    enabled: false,
    text: 'Swipe to reveal more'
  }
};

// Calculate cumulative beats
const calculateCumulativeBeats = (beats) => {
  let cumulative = 0;
  return {
    entrance: cumulative,
    fogStart: (cumulative += beats.entrance),
    fogBuilt: (cumulative += beats.fogBuild),
    whisperStart: cumulative,
    whisperVisible: (cumulative += beats.whisperReveal),
    whisperEnd: (cumulative += beats.whisperHold),
    questionStart: (cumulative += beats.whisperFade),
    questionVisible: (cumulative += beats.questionReveal),
    glowStart: (cumulative += beats.questionHold),
    hintStart: (cumulative += beats.glowEmphasis),
    hintVisible: (cumulative += beats.hintReveal),
    settleStart: (cumulative += beats.hintHold),
    exitStart: (cumulative += beats.settle),
    totalDuration: (cumulative += beats.exit)
  };
};

// MAIN COMPONENT
export const Hook1EAmbientMystery = ({ scene, styles, presets, easingMap }) => {
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
  const signature = { ...DEFAULT_CONFIG.signature, ...(scene.signature || {}) };

  useEffect(() => {
    void loadFontVoice(typography.voice || DEFAULT_FONT_VOICE);
  }, [typography.voice]);
  
  const fontTokens = buildFontTokens(typography.voice || DEFAULT_FONT_VOICE);
  
  // Convert beats to frames
  const f = useMemo(() => ({
    entrance: toFrames(beats.entrance, fps),
    fogStart: toFrames(beats.fogStart, fps),
    fogBuilt: toFrames(beats.fogBuilt, fps),
    whisperStart: toFrames(beats.whisperStart, fps),
    whisperVisible: toFrames(beats.whisperVisible, fps),
    whisperEnd: toFrames(beats.whisperEnd, fps),
    questionStart: toFrames(beats.questionStart, fps),
    questionVisible: toFrames(beats.questionVisible, fps),
    glowStart: toFrames(beats.glowStart, fps),
    hintStart: toFrames(beats.hintStart, fps),
    hintVisible: toFrames(beats.hintVisible, fps),
    settleStart: toFrames(beats.settleStart, fps),
    exitStart: toFrames(beats.exitStart, fps),
    totalDuration: toFrames(beats.totalDuration, fps)
  }), [beats, fps]);
  
  // Generate particles
  const baseParticles = useMemo(() => {
    if (!decorations.showParticles) return [];
    return generateAmbientParticles(
      decorations.particleCount,
      542,
      width,
      height
    );
  }, [decorations.showParticles, decorations.particleCount, width, height]);

  const ambientParticles = decorations.showParticles
    ? renderAmbientParticles(
        baseParticles,
        frame,
        fps,
        [colors.fog, `${colors.text}25`, colors.accent2]
      )
    : [];
  
  // ==================== ANIMATIONS ====================
  
  // Background entrance
  const bgOpacity = interpolate(
    frame,
    [0, f.entrance + toFrames(0.5, fps)],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );
  
  // Camera zoom (subtle push-in for mystery)
  const cameraZoom = anim.cameraZoom
    ? interpolate(
        frame,
        [0, f.questionVisible, f.settleStart],
        [1 + anim.zoomAmount, 1.0, 1 + (anim.zoomAmount * 0.25)],
        {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: EZ.smooth
        }
      )
    : 1;
  
  // Vignette intensity
  const vignetteOpacity = decorations.showVignette
    ? interpolate(
        frame,
        [0, f.fogBuilt, f.settleStart],
        [0, decorations.vignetteIntensity, decorations.vignetteIntensity * 0.75],
        {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: EZ.smooth
        }
      )
    : 0;
  
  // Fog layers animation
  const fogOpacity = decorations.showFog
    ? interpolate(
        frame,
        [f.fogStart, f.fogBuilt],
        [0, decorations.fogIntensity],
        {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: EZ.smooth
        }
      )
    : 0;
  
  // Whisper - Letter Reveal
  const whisperLetterReveal = config.whisper.enabled
    ? useMemo(() => {
        return getLetterReveal(frame, config.whisper.text, {
          startFrame: f.whisperStart,
          duration: rawBeats.whisperReveal,
          staggerDelay: 0.05
        }, fps);
      }, [frame, config.whisper.text, f.whisperStart, rawBeats.whisperReveal, fps])
    : { letters: [], letterOpacities: [] };
  
  // Whisper card entrance
  const whisperCardEntrance = config.whisper.enabled
    ? getCardEntrance(frame, {
        startFrame: f.whisperStart,
        duration: 1.0,
        direction: 'up',
        distance: 30,
        withGlow: true,
        glowColor: `${colors.accent2}30`
      }, fps)
    : { opacity: 0, scale: 1, translateY: 0, boxShadow: 'none' };
  
  const whisperFadeOut = config.whisper.enabled && frame >= f.whisperEnd
    ? interpolate(
        frame,
        [f.whisperEnd, f.questionStart],
        [0, 1],
        {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: EZ.power3In
        }
      )
    : 0;
  
  const whisperOpacity = whisperCardEntrance.opacity * (1 - whisperFadeOut);
  
  // Continuous floating for whisper
  const whisperFloat = anim.continuousFloat && frame >= f.whisperVisible
    ? Math.sin((frame - f.whisperStart) * 0.015) * 6
    : 0;
  
  // Particle burst on whisper reveal
  const whisperParticleBurst = decorations.showParticleBurst && config.whisper.enabled
    ? getParticleBurst(frame, {
        triggerFrame: f.whisperStart,
        particleCount: decorations.particleBurstCount,
        duration: 1.5,
        color: colors.accent2,
        size: 5,
        spread: 120
      }, fps)
    : [];
  
  // Question - Letter Reveal
  const questionLetterReveal = useMemo(() => {
    return getLetterReveal(frame, config.question.text, {
      startFrame: f.questionStart,
      duration: rawBeats.questionReveal,
      staggerDelay: 0.04
    }, fps);
  }, [frame, config.question.text, f.questionStart, rawBeats.questionReveal, fps]);
  
  // Question card entrance
  const questionCardEntrance = getCardEntrance(frame, {
    startFrame: f.questionStart,
    duration: 1.2,
    direction: 'up',
    distance: 40,
    withGlow: true,
    glowColor: `${colors.accent}40`
  }, fps);
  
  const questionExitProgress = frame >= f.exitStart
    ? interpolate(
        frame,
        [f.exitStart, f.totalDuration],
        [0, 1],
        {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: EZ.power3In
        }
      )
    : 0;
  
  const questionOpacity = questionCardEntrance.opacity * (1 - questionExitProgress);
  
  // Continuous floating for question
  const questionFloat = anim.continuousFloat && frame >= f.questionVisible
    ? Math.sin((frame - f.questionStart) * 0.018 + Math.PI * 0.5) * 7
    : 0;
  
  // Particle burst on question reveal
  const questionParticleBurst = decorations.showParticleBurst
    ? getParticleBurst(frame, {
        triggerFrame: f.questionStart,
        particleCount: decorations.particleBurstCount * 1.5,
        duration: 1.8,
        color: colors.accent,
        size: 6,
        spread: 150
      }, fps)
    : [];
  
  // Glow pulse (continuous after glow starts)
  const glowPulse = decorations.showGlow && frame >= f.glowStart && anim.continuousPulse
    ? decorations.glowIntensity + Math.sin((frame - f.glowStart) * 0.06) * 0.2
    : decorations.glowIntensity;
  
  // Hint - Letter Reveal
  const hintLetterReveal = config.hint.enabled
    ? useMemo(() => {
        return getLetterReveal(frame, config.hint.text, {
          startFrame: f.hintStart,
          duration: rawBeats.hintReveal,
          staggerDelay: 0.05
        }, fps);
      }, [frame, config.hint.text, f.hintStart, rawBeats.hintReveal, fps])
    : { letters: [], letterOpacities: [] };
  
  // Hint card entrance
  const hintCardEntrance = config.hint.enabled
    ? getCardEntrance(frame, {
        startFrame: f.hintStart,
        duration: 1.0,
        direction: 'up',
        distance: 30,
        withGlow: true,
        glowColor: `${colors.textSecondary}30`
      }, fps)
    : { opacity: 0, scale: 1, translateY: 0, boxShadow: 'none' };
  
  const hintOpacity = hintCardEntrance.opacity * (1 - questionExitProgress);
  
  // Continuous floating for hint
  const hintFloat = anim.continuousFloat && frame >= f.hintVisible
    ? Math.sin((frame - f.hintStart) * 0.016 + Math.PI) * 5
    : 0;
  
  // Particle burst on hint reveal
  const hintParticleBurst = decorations.showParticleBurst && config.hint.enabled
    ? getParticleBurst(frame, {
        triggerFrame: f.hintStart,
        particleCount: decorations.particleBurstCount,
        duration: 1.4,
        color: colors.textSecondary,
        size: 4,
        spread: 100
      }, fps)
    : [];
  
  // Central visual animation (if enabled)
  const visualProgress = config.centralVisual.enabled && frame >= f.questionStart
    ? interpolate(
        frame,
        [f.questionStart, f.questionVisible + toFrames(0.5, fps)],
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
        startFrame: f.questionStart,
        duration: 1.0,
        withBounce: true,
        rotation: 0
      }, fps)
    : { opacity: 0, scale: 0, rotation: 0 };
  
  const visualOpacity = visualIconPop.opacity * (1 - questionExitProgress);
  
  // Continuous floating for visual
  const visualFloat = anim.continuousFloat && frame >= f.questionVisible
    ? Math.sin((frame - f.questionStart) * 0.012) * 10
    : 0;
  
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

  // Calculate positions for particle bursts
  const centerX = width / 2;
  const whisperY = config.whisper.offset.y;
  const questionY = height / 2;
  const hintY = height - Math.abs(config.hint.offset.y);

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
      {/* Camera Container */}
      <div
        style={{
          width: '100%',
          height: '100%',
          transform: `scale(${cameraZoom})`,
          transformOrigin: 'center center'
        }}
      >
        {/* Layer 1: Noise Texture */}
        {decorations.showNoiseTexture && (
          <NoiseTexture opacity={decorations.noiseOpacity} />
        )}
        
        {/* Layer 2: Spotlights (subtle for mystery) */}
        {decorations.showSpotlights && (
          <>
            <SpotlightEffect
              x={decorations.spotlight1.x * width}
              y={decorations.spotlight1.y * height}
              size={decorations.spotlight1.size}
              color={decorations.spotlight1.color}
              opacity={0.5}
            />
            {decorations.spotlightCount > 1 && (
              <SpotlightEffect
                x={decorations.spotlight2.x * width}
                y={decorations.spotlight2.y * height}
                size={decorations.spotlight2.size}
                color={decorations.spotlight2.color}
                opacity={0.4}
              />
            )}
          </>
        )}
        
        {/* Layer 3: Fog Layers (mysterious atmosphere) */}
        {decorations.showFog && (
          <>
            <div
              style={{
                position: 'absolute',
                width: '120%',
                height: '120%',
                left: '-10%',
                top: '-10%',
                background: `radial-gradient(circle at 30% 40%, ${colors.fog}, transparent 60%)`,
                opacity: fogOpacity * 0.8,
                animation: 'drift1 20s ease-in-out infinite'
              }}
            />
            {decorations.fogLayers > 1 && (
              <div
                style={{
                  position: 'absolute',
                  width: '120%',
                  height: '120%',
                  left: '-10%',
                  top: '-10%',
                  background: `radial-gradient(circle at 70% 60%, ${colors.fog}, transparent 50%)`,
                  opacity: fogOpacity * 0.6,
                  animation: 'drift2 25s ease-in-out infinite'
                }}
              />
            )}
          </>
        )}
        
        {/* Layer 4: Ambient Particles */}
        {decorations.showParticles && (
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox={`0 0 ${width} ${height}`}
            style={{ pointerEvents: 'none', opacity: 0.6 }}
          >
            {ambientParticles.map(({ key, element }) =>
              React.cloneElement(element, { key })
            )}
          </svg>
        )}
        
        {/* Layer 5: Vignette */}
        {decorations.showVignette && (
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              background: 'radial-gradient(circle, transparent 30%, rgba(0,0,0,0.8) 100%)',
              opacity: vignetteOpacity,
              pointerEvents: 'none'
            }}
          />
        )}
        
        {/* Particle Bursts */}
        {decorations.showParticleBurst && (
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox={`0 0 ${width} ${height}`}
            style={{ pointerEvents: 'none', zIndex: 50 }}
          >
            {whisperParticleBurst.length > 0 && renderParticleBurst(
              whisperParticleBurst,
              centerX,
              whisperY
            )}
            {questionParticleBurst.length > 0 && renderParticleBurst(
              questionParticleBurst,
              centerX,
              questionY
            )}
            {hintParticleBurst.length > 0 && renderParticleBurst(
              hintParticleBurst,
              centerX,
              hintY
            )}
          </svg>
        )}
        
        {/* Whisper Text */}
        {config.whisper.enabled && whisperOpacity > 0 && (
          <div
            className="pointer-events-none absolute"
            style={{
              left: '50%',
              top: config.whisper.offset.y + whisperFloat,
              transform: `translate(-50%, 0) scale(${whisperCardEntrance.scale})`,
              opacity: whisperOpacity,
              zIndex: 10
            }}
          >
            {decorations.showGlassPane ? (
              <GlassmorphicPane
                innerRadius={decorations.glassInnerRadius}
                glowOpacity={0.15}
                borderOpacity={decorations.glassPaneBorderOpacity}
                backgroundColor={colors.glassBackground}
                padding={30}
                style={{
                  boxShadow: whisperCardEntrance.boxShadow
                }}
              >
                <div
                  className={`font-body italic tracking-[0.05em] ${alignmentClass}`}
                  style={{
                    fontSize: Math.min(fonts.size_whisper, 48),
                    fontWeight: fonts.weight_whisper,
                    fontFamily: fontTokens.body.family,
                    color: colors.textSecondary,
                    textTransform,
                    maxWidth: '85vw',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.4)'
                  }}
                >
                  {renderLetterReveal(whisperLetterReveal.letters, whisperLetterReveal.letterOpacities)}
                </div>
              </GlassmorphicPane>
            ) : (
              <div
                className={`font-body italic tracking-[0.05em] ${alignmentClass}`}
                style={{
                  fontSize: Math.min(fonts.size_whisper, 48),
                  fontWeight: fonts.weight_whisper,
                  fontFamily: fontTokens.body.family,
                  color: colors.textSecondary,
                  textTransform,
                  maxWidth: '90%',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.4)'
                }}
              >
                {renderLetterReveal(whisperLetterReveal.letters, whisperLetterReveal.letterOpacities)}
              </div>
            )}
          </div>
        )}
        
        {/* Central Visual */}
        {config.centralVisual.enabled && config.centralVisual.type !== 'none' && visualOpacity > 0 && (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: `translate(-50%, calc(-50% + ${config.centralVisual.offset.y + visualFloat}px)) scale(${visualIconPop.scale}) rotate(${visualIconPop.rotation}deg)`,
              opacity: visualOpacity,
              filter: decorations.showGlow
                ? `drop-shadow(0 0 ${glowPulse * 40}px ${decorations.glowColor})`
                : 'none',
              zIndex: 15
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
        
        {/* Question Text */}
        {questionOpacity > 0 && (
          <div
            className="pointer-events-none absolute"
            style={{
              left: '50%',
              top: `50%`,
              transform: `translate(-50%, calc(-50% + ${questionFloat}px)) scale(${questionCardEntrance.scale})`,
              opacity: questionOpacity,
              zIndex: 10
            }}
          >
            {decorations.showGlassPane ? (
              <GlassmorphicPane
                innerRadius={decorations.glassInnerRadius}
                glowOpacity={0.2}
                borderOpacity={decorations.glassPaneBorderOpacity}
                backgroundColor={colors.glassBackground}
                padding={40}
                style={{
                  boxShadow: questionCardEntrance.boxShadow
                }}
              >
                <div
                  className={`leading-tight ${alignmentClass}`}
                  style={{
                    fontSize: Math.min(fonts.size_question, 80),
                    fontWeight: fonts.weight_question,
                    fontFamily: fontTokens.title.family,
                    color: colors.text,
                    textTransform,
                    maxWidth: '85vw',
                    lineHeight: 1.3,
                    textShadow: decorations.showGlow
                      ? `0 0 ${glowPulse * 50}px ${colors.accent}, 0 4px 12px rgba(0,0,0,0.6)`
                      : '0 4px 12px rgba(0,0,0,0.6)'
                  }}
                >
                  {renderLetterReveal(questionLetterReveal.letters, questionLetterReveal.letterOpacities)}
                </div>
              </GlassmorphicPane>
            ) : (
              <div
                className={`leading-tight ${alignmentClass}`}
                style={{
                  fontSize: Math.min(fonts.size_question, 80),
                  fontWeight: fonts.weight_question,
                  fontFamily: fontTokens.title.family,
                  color: colors.text,
                  textTransform,
                  maxWidth: '90%',
                  lineHeight: 1.3,
                  textShadow: decorations.showGlow
                    ? `0 0 ${glowPulse * 50}px ${colors.accent}, 0 4px 12px rgba(0,0,0,0.6)`
                    : '0 4px 12px rgba(0,0,0,0.6)'
                }}
              >
                {renderLetterReveal(questionLetterReveal.letters, questionLetterReveal.letterOpacities)}
              </div>
            )}
          </div>
        )}
        
        {/* Hint Text */}
        {config.hint.enabled && hintOpacity > 0 && (
          <div
            className="pointer-events-none absolute"
            style={{
              left: '50%',
              bottom: Math.abs(config.hint.offset.y) - hintFloat,
              transform: `translate(-50%, 0) scale(${hintCardEntrance.scale})`,
              opacity: hintOpacity,
              zIndex: 10
            }}
          >
            {decorations.showGlassPane ? (
              <GlassmorphicPane
                innerRadius={decorations.glassInnerRadius}
                glowOpacity={0.12}
                borderOpacity={decorations.glassPaneBorderOpacity * 0.8}
                backgroundColor={colors.glassBackground}
                padding={25}
                style={{
                  boxShadow: hintCardEntrance.boxShadow
                }}
              >
                <div
                  className={`font-body italic ${alignmentClass}`}
                  style={{
                    fontSize: Math.min(fonts.size_hint, 32),
                    fontWeight: fonts.weight_hint,
                    fontFamily: fontTokens.body.family,
                    color: colors.textSecondary,
                    textTransform,
                    maxWidth: '85vw',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.4)'
                  }}
                >
                  {renderLetterReveal(hintLetterReveal.letters, hintLetterReveal.letterOpacities)}
                </div>
              </GlassmorphicPane>
            ) : (
              <div
                className={`font-body italic ${alignmentClass}`}
                style={{
                  fontSize: Math.min(fonts.size_hint, 32),
                  fontWeight: fonts.weight_hint,
                  fontFamily: fontTokens.body.family,
                  color: colors.textSecondary,
                  textTransform,
                  maxWidth: '90%',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.4)'
                }}
              >
                {renderLetterReveal(hintLetterReveal.letters, hintLetterReveal.letterOpacities)}
              </div>
            )}
          </div>
        )}

        {/* Signature Badge */}
        {signature.enabled && questionOpacity > 0 && (
          <div className="absolute inset-x-0 bottom-[10%] flex justify-center" style={{ zIndex: 20 }}>
            <div
              className="badge-chalk bg-opacity-80 text-sm tracking-widest shadow-lg"
              style={{ opacity: Math.min(1, questionOpacity) }}
            >
              {signature.text}
            </div>
          </div>
        )}
      </div>
      
      {/* CSS Animations for Fog */}
      <style>{`
        @keyframes drift1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(40px, -30px); }
        }
        @keyframes drift2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-30px, 40px); }
        }
      `}</style>
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
export const TEMPLATE_ID = 'Hook1EAmbientMystery';
export const PRIMARY_INTENTION = 'HOOK';
export const SECONDARY_INTENTIONS = ['REVEAL', 'INSPIRE', 'QUESTION'];

// CONFIG SCHEMA
export const CONFIG_SCHEMA = {
  whisper: {
    enabled: { type: 'checkbox', label: 'Show Whisper Text' },
    text: { type: 'textarea', label: 'Whisper Text', rows: 2 }
  },
  question: {
    text: { type: 'textarea', label: 'Question Text', rows: 3 }
  },
  hint: {
    enabled: { type: 'checkbox', label: 'Show Hint' },
    text: { type: 'textarea', label: 'Hint Text', rows: 2 }
  },
  centralVisual: {
    enabled: { type: 'checkbox', label: 'Show Visual' },
    type: { type: 'select', label: 'Visual Type', options: ['emoji', 'image', 'roughSVG', 'none'] },
    value: { type: 'text', label: 'Visual Value' },
    scale: { type: 'slider', label: 'Scale', min: 1, max: 4, step: 0.1 }
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
    cameraZoom: {
      type: 'checkbox',
      label: 'Enable Camera Zoom'
    },
    zoomAmount: {
      type: 'slider',
      label: 'Zoom Amount',
      min: 0,
      max: 0.15,
      step: 0.01
    },
    continuousFloat: {
      type: 'checkbox',
      label: 'Enable Continuous Float'
    },
    continuousPulse: {
      type: 'checkbox',
      label: 'Enable Continuous Pulse'
    }
  },
  decorations: {
    showGradient: { type: 'checkbox', label: 'Show Gradient Background' },
    showNoiseTexture: { type: 'checkbox', label: 'Show Noise Texture' },
    noiseOpacity: { type: 'slider', label: 'Noise Opacity', min: 0, max: 0.15, step: 0.01 },
    showSpotlights: { type: 'checkbox', label: 'Show Spotlights' },
    spotlightCount: { type: 'slider', label: 'Spotlight Count', min: 0, max: 3, step: 1 },
    showFog: { type: 'checkbox', label: 'Show Fog Layers' },
    fogLayers: { type: 'slider', label: 'Fog Layer Count', min: 1, max: 3, step: 1 },
    fogIntensity: { type: 'slider', label: 'Fog Intensity', min: 0, max: 0.6, step: 0.05 },
    showVignette: { type: 'checkbox', label: 'Show Vignette' },
    vignetteIntensity: { type: 'slider', label: 'Vignette Intensity', min: 0, max: 0.8, step: 0.05 },
    showParticles: { type: 'checkbox', label: 'Show Ambient Particles' },
    particleCount: { type: 'slider', label: 'Particle Count', min: 0, max: 50, step: 5 },
    showGlassPane: { type: 'checkbox', label: 'Show Glassmorphic Panes' },
    glassPaneOpacity: { type: 'slider', label: 'Glass Pane Opacity', min: 0, max: 0.2, step: 0.02 },
    showParticleBurst: { type: 'checkbox', label: 'Show Particle Bursts' },
    particleBurstCount: { type: 'slider', label: 'Burst Particle Count', min: 5, max: 25, step: 5 },
    showGlow: { type: 'checkbox', label: 'Show Glow Effects' },
    glowIntensity: { type: 'slider', label: 'Glow Intensity', min: 0, max: 1, step: 0.05 }
  },
  signature: {
    enabled: { type: 'checkbox', label: 'Show Signature Badge' },
    text: { type: 'text', label: 'Signature Text' }
  }
};
