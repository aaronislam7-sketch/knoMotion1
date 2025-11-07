import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import { 
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
 * TEMPLATE #2: AMBIENT MYSTERY - v6.0
 * 
 * PRIMARY INTENTION: REVEAL
 * SECONDARY INTENTIONS: INSPIRE, QUESTION
 * 
 * PURPOSE: Create atmospheric intrigue and suspense
 * 
 * VISUAL PATTERN:
 * - Dark, mysterious atmosphere
 * - Fog/particle effects
 * - Sequential text reveals (whisper → question → hint)
 * - Optional central visual element
 * - Glow and atmospheric effects
 * 
 * AGNOSTIC PRINCIPALS:
 * ✓ Type-Based Polymorphism (hero registry for visual)
 * ✓ Data-Driven Structure (configurable text sequence)
 * ✓ Token-Based Positioning (semantic layout)
 * ✓ Separation of Concerns (content/layout/style/animation)
 * ✓ Progressive Configuration (simple defaults)
 * ✓ Registry Pattern (extensible visual types)
 * 
 * CONFIGURABILITY:
 * - Whisper, question, and hint text (all editable)
 * - Central visual (emoji, image, or none)
 * - Colors (dark theme palette)
 * - Fonts (sizes, weights)
 * - Timing (all beat points)
 * - Fog/particle effects toggle
 * - Glow intensity
 * 
 * NO HARDCODED VALUES!
 */

// DEFAULT CONFIGURATION
const DEFAULT_CONFIG = {
  whisper: {
    text: 'In the depths of knowledge...',
    position: 'top-center',
    offset: { x: 0, y: 100 },
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
    offset: { x: 0, y: -100 },
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
  
  style_tokens: {
    colors: {
      bg: '#1A1F2E',
      fog: 'rgba(74, 85, 104, 0.3)',
      accent: '#8E44AD',
      accent2: '#6C7A89',
      text: '#E8F4FD',
      textSecondary: '#9CA3AF',
      glow: '#F39C12'
    },
    fonts: {
      size_whisper: 38,
      size_question: 72,
      size_hint: 28,
      weight_whisper: 400,
      weight_question: 700,
      weight_hint: 400
    }
  },
  
  beats: {
    entrance: 0.5,
    fog: 1.0,
    whisper: 2.5,
    question: 4.0,
    glow: 5.5,
    hint: 8.0,
    settle: 10.0,
    exit: 12.0
  },
  
  animation: {
    cameraZoom: true,
    zoomAmount: 0.08
  },
  
  effects: {
    particles: {
      enabled: true,
      count: 20,
      style: 'ambient'
    },
    fog: {
      enabled: true,
      intensity: 0.3
    },
    glow: {
      enabled: true,
      intensity: 0.6
    }
  }
};

// MAIN COMPONENT
export const Hook1EAmbientMystery = ({ scene, styles, presets, easingMap }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Merge config
  const config = { ...DEFAULT_CONFIG, ...scene };
  const beats = { ...DEFAULT_CONFIG.beats, ...(scene.beats || {}) };
  const colors = { ...DEFAULT_CONFIG.style_tokens.colors, ...(scene.style_tokens?.colors || {}) };
  const fonts = { ...DEFAULT_CONFIG.style_tokens.fonts, ...(scene.style_tokens?.fonts || {}) };
  const anim = { ...DEFAULT_CONFIG.animation, ...(scene.animation || {}) };
  const effects = { 
    ...DEFAULT_CONFIG.effects, 
    ...(scene.effects || {}),
    particles: { ...DEFAULT_CONFIG.effects.particles, ...(scene.effects?.particles || {}) },
    fog: { ...DEFAULT_CONFIG.effects.fog, ...(scene.effects?.fog || {}) },
    glow: { ...DEFAULT_CONFIG.effects.glow, ...(scene.effects?.glow || {}) }
  };
  
  // Convert beats to frames
  const f_entrance = toFrames(beats.entrance, fps);
  const f_fog = toFrames(beats.fog, fps);
  const f_whisper = toFrames(beats.whisper, fps);
  const f_question = toFrames(beats.question, fps);
  const f_glow = toFrames(beats.glow, fps);
  const f_hint = toFrames(beats.hint, fps);
  const f_settle = toFrames(beats.settle, fps);
  const f_exit = toFrames(beats.exit, fps);
  
  // Generate particles
  const particleElements = effects.particles.enabled
    ? generateAmbientParticles({
        count: effects.particles.count,
        seed: 542,
        style: effects.particles.style,
        color: colors.fog,
        bounds: { w: 1920, h: 1080 }
      })
    : [];
  
  renderAmbientParticles(particleElements, frame, fps, { opacity: 0.6 });
  
  // ==================== ANIMATIONS ====================
  
  // Camera zoom (subtle push-in)
  const cameraZoom = anim.cameraZoom
    ? interpolate(
        frame,
        [0, f_question, f_settle],
        [1 + anim.zoomAmount, 1.0, 1 + (anim.zoomAmount * 0.25)],
        {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: EZ.smooth
        }
      )
    : 1;
  
  // Vignette intensity
  const vignetteOpacity = interpolate(
    frame,
    [0, f_fog, f_settle],
    [0, 0.5, 0.35],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: EZ.smooth
    }
  );
  
  // Fog layers animation
  const fogOpacity = effects.fog.enabled
    ? interpolate(
        frame,
        [0, f_fog, f_fog + toFrames(2.0, fps)],
        [0, effects.fog.intensity, effects.fog.intensity],
        {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: EZ.smooth
        }
      )
    : 0;
  
  // Whisper animation
  const whisperProgress = config.whisper.enabled
    ? interpolate(
        frame,
        [f_whisper, f_whisper + toFrames(1.0, fps)],
        [0, 1],
        {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: EZ.power3Out
        }
      )
    : 0;
  
  const whisperFadeOut = frame >= f_question
    ? interpolate(
        frame,
        [f_question, f_question + toFrames(0.5, fps)],
        [0, 1],
        {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: EZ.power3In
        }
      )
    : 0;
  
  const whisperOpacity = whisperProgress * (1 - whisperFadeOut);
  
  // Question animation
  const questionProgress = interpolate(
    frame,
    [f_question, f_question + toFrames(1.2, fps)],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: EZ.power3Out
    }
  );
  
  const questionFadeOut = frame >= f_exit
    ? interpolate(
        frame,
        [f_exit, f_exit + toFrames(0.8, fps)],
        [0, 1],
        {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: EZ.power3In
        }
      )
    : 0;
  
  const questionOpacity = questionProgress * (1 - questionFadeOut);
  const questionY = (1 - questionProgress) * 40;
  const questionScale = 0.95 + (questionProgress * 0.05);
  
  // Glow pulse
  const glowPulse = effects.glow.enabled && frame >= f_glow
    ? effects.glow.intensity + Math.sin((frame - f_glow) / 20) * 0.15
    : 0;
  
  // Hint animation
  const hintProgress = config.hint.enabled && frame >= f_hint
    ? interpolate(
        frame,
        [f_hint, f_hint + toFrames(1.0, fps)],
        [0, 1],
        {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: EZ.power3Out
        }
      )
    : 0;
  
  const hintFadeOut = frame >= f_exit
    ? interpolate(
        frame,
        [f_exit, f_exit + toFrames(0.8, fps)],
        [0, 1],
        {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: EZ.power3In
        }
      )
    : 0;
  
  const hintOpacity = hintProgress * (1 - hintFadeOut);
  const hintY = (1 - hintProgress) * 30;
  
  // Central visual animation
  const visualProgress = config.centralVisual.enabled && frame >= f_question
    ? interpolate(
        frame,
        [f_question, f_question + toFrames(1.5, fps)],
        [0, 1],
        {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: EZ.power3Out
        }
      )
    : 0;
  
  const visualFadeOut = frame >= f_exit
    ? interpolate(
        frame,
        [f_exit, f_exit + toFrames(0.8, fps)],
        [0, 1],
        {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: EZ.power3In
        }
      )
    : 0;
  
  const visualOpacity = visualProgress * (1 - visualFadeOut);
  const visualScale = 0.8 + (visualProgress * 0.2);
  
  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
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
        {/* Particle Background */}
        <svg
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            opacity: 0.6
          }}
        >
          {particleElements.map(p => p.element)}
        </svg>
        
        {/* Fog Layers */}
        {effects.fog.enabled && (
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
          </>
        )}
        
        {/* Vignette */}
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
        
        {/* Whisper Text */}
        {config.whisper.enabled && whisperOpacity > 0 && (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: config.whisper.offset.y,
              transform: 'translateX(-50%)',
              fontSize: fonts.size_whisper,
              fontWeight: fonts.weight_whisper,
              color: colors.textSecondary,
              opacity: whisperOpacity,
              textAlign: 'center',
              fontStyle: 'italic',
              letterSpacing: '0.05em',
              maxWidth: '90%'
            }}
          >
            {config.whisper.text}
          </div>
        )}
        
        {/* Central Visual */}
        {config.centralVisual.enabled && config.centralVisual.type !== 'none' && visualOpacity > 0 && (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: `translate(-50%, calc(-50% + ${config.centralVisual.offset.y}px)) scale(${visualScale})`,
              opacity: visualOpacity,
              filter: effects.glow.enabled ? `drop-shadow(0 0 ${glowPulse * 30}px ${colors.glow})` : 'none'
            }}
          >
            {renderHero(
              mergeHeroConfig({
                type: config.centralVisual.type,
                value: config.centralVisual.value,
                scale: config.centralVisual.scale
              }),
              frame,
              beats,
              colors,
              easingMap || EZ,
              fps
            )}
          </div>
        )}
        
        {/* Question Text */}
        {questionOpacity > 0 && (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: `translate(-50%, calc(-50% + ${questionY}px)) scale(${questionScale})`,
              fontSize: fonts.size_question,
              fontWeight: fonts.weight_question,
              color: colors.text,
              opacity: questionOpacity,
              textAlign: 'center',
              maxWidth: '90%',
              lineHeight: 1.3,
              textShadow: effects.glow.enabled
                ? `0 0 ${glowPulse * 40}px ${colors.accent}, 0 2px 10px rgba(0,0,0,0.5)`
                : '0 2px 10px rgba(0,0,0,0.5)'
            }}
          >
            {config.question.text}
          </div>
        )}
        
        {/* Hint Text */}
        {config.hint.enabled && hintOpacity > 0 && (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              bottom: config.hint.offset.y * -1,
              transform: `translate(-50%, ${hintY}px)`,
              fontSize: fonts.size_hint,
              fontWeight: fonts.weight_hint,
              color: colors.textSecondary,
              opacity: hintOpacity,
              textAlign: 'center',
              fontStyle: 'italic',
              maxWidth: '90%'
            }}
          >
            {config.hint.text}
          </div>
        )}
      </div>
      
      {/* CSS Animations */}
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
  const config = { ...DEFAULT_CONFIG, ...scene };
  const beats = { ...DEFAULT_CONFIG.beats, ...(scene.beats || {}) };
  
  const totalDuration = beats.exit + 1.0;
  return toFrames(totalDuration, fps);
};

// METADATA
export const TEMPLATE_VERSION = '6.0';
export const TEMPLATE_ID = 'Hook1EAmbientMystery';
export const PRIMARY_INTENTION = 'REVEAL';
export const SECONDARY_INTENTIONS = ['INSPIRE', 'QUESTION'];

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
    value: { type: 'text', label: 'Visual Value' }
  }
};
