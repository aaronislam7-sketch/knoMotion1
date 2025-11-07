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
 * TEMPLATE #1: QUESTION BURST - v6.0
 * 
 * PRIMARY INTENTION: QUESTION
 * SECONDARY INTENTIONS: CHALLENGE, REVEAL
 * 
 * PURPOSE: Pose thought-provoking questions that engage and intrigue viewers
 * 
 * VISUAL PATTERN:
 * - Two-part question structure (setup + punchline)
 * - Optional central visual element
 * - Animated text reveals with emphasis
 * - Clean, focused design
 * 
 * AGNOSTIC PRINCIPALS:
 * ✓ Type-Based Polymorphism (hero registry for visual)
 * ✓ Data-Driven Structure (configurable question parts)
 * ✓ Token-Based Positioning (semantic layout)
 * ✓ Separation of Concerns (content/layout/style/animation)
 * ✓ Progressive Configuration (simple defaults)
 * ✓ Registry Pattern (extensible visual types)
 * 
 * CONFIGURABILITY:
 * - Question part 1 & 2 (fully editable text)
 * - Central visual (emoji, image, roughSVG, lottie, or none)
 * - Colors (background, accent, text)
 * - Fonts (sizes, weights)
 * - Timing (all beat points)
 * - Animation style
 * - Particle effects toggle
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
    offset: { x: 0, y: -80 }
  },
  
  questionPart2: {
    text: 'was measured in mindsets?',
    position: 'center',
    offset: { x: 0, y: 20 }
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
  
  style_tokens: {
    colors: {
      bg: '#FFF9F0',
      accent: '#FF6B35',
      accent2: '#9B59B6',
      text: '#1A1A1A',
      textSecondary: '#5A5A5A',
      particles: 'rgba(255, 107, 53, 0.3)'
    },
    fonts: {
      size_title: 56,
      size_question: 80,
      size_conclusion: 64,
      size_subtitle: 28,
      weight_question: 800,
      weight_conclusion: 700
    }
  },
  
  beats: {
    entrance: 0.4,
    questionPart1: 0.8,
    questionPart2: 2.5,
    emphasis: 4.0,
    exit: 5.5,
    visualReveal: 6.0,
    conclusion: 7.0,
    hold: 9.0,
    fadeOut: 10.0
  },
  
  animation: {
    questionEntrance: 'fade-up',
    questionExit: 'slide-left',
    emphasis: 'pulse',
    visualEntrance: 'fade-scale',
    easing: 'power3Out'
  },
  
  particles: {
    enabled: true,
    count: 25,
    style: 'ambient'
  }
};

// MAIN COMPONENT
export const Hook1AQuestionBurst = ({ scene, styles, presets, easingMap }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Merge config
  const config = { ...DEFAULT_CONFIG, ...scene };
  const beats = { ...DEFAULT_CONFIG.beats, ...(scene.beats || {}) };
  const colors = { ...DEFAULT_CONFIG.style_tokens.colors, ...(scene.style_tokens?.colors || {}) };
  const fonts = { ...DEFAULT_CONFIG.style_tokens.fonts, ...(scene.style_tokens?.fonts || {}) };
  const anim = { ...DEFAULT_CONFIG.animation, ...(scene.animation || {}) };
  const particles = { ...DEFAULT_CONFIG.particles, ...(scene.particles || {}) };
  
  // Convert beats to frames
  const f_entrance = toFrames(beats.entrance, fps);
  const f_q1 = toFrames(beats.questionPart1, fps);
  const f_q2 = toFrames(beats.questionPart2, fps);
  const f_emphasis = toFrames(beats.emphasis, fps);
  const f_exit = toFrames(beats.exit, fps);
  const f_visualReveal = toFrames(beats.visualReveal, fps);
  const f_conclusion = toFrames(beats.conclusion, fps);
  const f_fadeOut = toFrames(beats.fadeOut, fps);
  
  // Generate particles
  const particleElements = particles.enabled
    ? generateAmbientParticles({
        count: particles.count,
        seed: 1,
        style: particles.style,
        color: colors.particles,
        bounds: { w: 1920, h: 1080 }
      })
    : [];
  
  renderAmbientParticles(particleElements, frame, fps, { opacity: 1 });
  
  // ==================== ANIMATIONS ====================
  
  // Question Part 1 Animation
  const q1Progress = interpolate(
    frame,
    [f_q1, f_q1 + toFrames(0.6, fps)],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: easingMap?.[anim.easing] || EZ.power3Out
    }
  );
  
  const q1ExitProgress = interpolate(
    frame,
    [f_exit, f_exit + toFrames(0.5, fps)],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: EZ.power3In
    }
  );
  
  const q1Opacity = frame < f_q1 ? 0 : frame < f_exit ? q1Progress : 1 - q1ExitProgress;
  const q1TranslateY = frame < f_q1 ? 30 : (1 - q1Progress) * 30;
  const q1TranslateX = frame < f_exit ? 0 : -1200 * q1ExitProgress;
  
  // Emphasis pulse for Q1
  const q1Pulse = anim.emphasis === 'pulse' && frame >= f_emphasis && frame < f_exit
    ? 1 + Math.sin((frame - f_emphasis) / 12) * 0.04
    : 1;
  
  // Question Part 2 Animation
  const q2Progress = interpolate(
    frame,
    [f_q2, f_q2 + toFrames(0.6, fps)],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: easingMap?.[anim.easing] || EZ.power3Out
    }
  );
  
  const q2ExitProgress = interpolate(
    frame,
    [f_exit, f_exit + toFrames(0.5, fps)],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: EZ.power3In
    }
  );
  
  const q2Opacity = frame < f_q2 ? 0 : frame < f_exit ? q2Progress : 1 - q2ExitProgress;
  const q2TranslateY = frame < f_q2 ? 40 : (1 - q2Progress) * 40;
  const q2Scale = frame < f_q2 ? 0.9 : 0.9 + (q2Progress * 0.1);
  const q2TranslateX = frame < f_exit ? 0 : -1200 * q2ExitProgress;
  
  // Emphasis pulse for Q2
  const q2Pulse = anim.emphasis === 'pulse' && frame >= f_emphasis && frame < f_exit
    ? 1 + Math.sin((frame - f_emphasis) / 12 + Math.PI / 4) * 0.04
    : 1;
  
  // Central Visual Animation
  const visualProgress = config.centralVisual.enabled && frame >= f_visualReveal
    ? interpolate(
        frame,
        [f_visualReveal, f_visualReveal + toFrames(1.0, fps)],
        [0, 1],
        {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: EZ.power3Out
        }
      )
    : 0;
  
  const visualFadeOut = frame >= f_fadeOut
    ? interpolate(
        frame,
        [f_fadeOut, f_fadeOut + toFrames(0.8, fps)],
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
  
  // Conclusion Animation
  const conclusionProgress = config.conclusion.enabled && frame >= f_conclusion
    ? interpolate(
        frame,
        [f_conclusion, f_conclusion + toFrames(0.8, fps)],
        [0, 1],
        {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: EZ.power3Out
        }
      )
    : 0;
  
  const conclusionFadeOut = frame >= f_fadeOut
    ? interpolate(
        frame,
        [f_fadeOut, f_fadeOut + toFrames(0.8, fps)],
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
  const q1Pos = resolvePosition(
    config.questionPart1.position,
    config.questionPart1.offset,
    { w: 1920, h: 1080 }
  );
  
  const q2Pos = resolvePosition(
    config.questionPart2.position,
    config.questionPart2.offset,
    { w: 1920, h: 1080 }
  );
  
  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
      }}
    >
      {/* Particle Background */}
      <svg
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%'
        }}
      >
        {particleElements.map(p => p.element)}
      </svg>
      
      {/* Optional Title */}
      {config.title.enabled && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: config.title.offset.y,
            transform: 'translateX(-50%)',
            fontSize: fonts.size_title,
            fontWeight: 700,
            color: colors.text,
            textAlign: 'center'
          }}
        >
          {config.title.text}
        </div>
      )}
      
      {/* Question Part 1 */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translate(-50%, calc(-50% + ${q1Pos.y + q1TranslateY}px + ${q1TranslateX}px)) scale(${q1Pulse})`,
          fontSize: fonts.size_question,
          fontWeight: fonts.weight_question,
          color: colors.accent,
          opacity: q1Opacity,
          textAlign: 'center',
          maxWidth: '90%',
          lineHeight: 1.2,
          textShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}
      >
        {config.questionPart1.text}
      </div>
      
      {/* Question Part 2 */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translate(-50%, calc(-50% + ${q2Pos.y + q2TranslateY}px + ${q2TranslateX}px)) scale(${q2Scale * q2Pulse})`,
          fontSize: fonts.size_question,
          fontWeight: fonts.weight_question,
          color: colors.accent2,
          opacity: q2Opacity,
          textAlign: 'center',
          maxWidth: '90%',
          lineHeight: 1.2,
          textShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}
      >
        {config.questionPart2.text}
      </div>
      
      {/* Central Visual */}
      {config.centralVisual.enabled && config.centralVisual.type !== 'none' && visualOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) scale(${visualScale})`,
            opacity: visualOpacity
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
      
      {/* Conclusion */}
      {config.conclusion.enabled && conclusionOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: conclusionOpacity,
            textAlign: 'center'
          }}
        >
          <div
            style={{
              fontSize: fonts.size_conclusion,
              fontWeight: fonts.weight_conclusion,
              color: colors.accent,
              marginBottom: 20,
              textShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}
          >
            {config.conclusion.text}
          </div>
          {config.conclusion.subtitle && (
            <div
              style={{
                fontSize: fonts.size_subtitle,
                color: colors.textSecondary,
                fontWeight: 400
              }}
            >
              {config.conclusion.subtitle}
            </div>
          )}
        </div>
      )}
    </AbsoluteFill>
  );
};

// DURATION CALCULATION
export const getDuration = (scene, fps) => {
  const config = { ...DEFAULT_CONFIG, ...scene };
  const beats = { ...DEFAULT_CONFIG.beats, ...(scene.beats || {}) };
  
  // Calculate based on enabled features
  let totalDuration = beats.fadeOut + 0.5;
  
  if (config.conclusion.enabled && beats.hold > beats.conclusion) {
    totalDuration = beats.hold + 0.5;
  }
  
  return toFrames(totalDuration, fps);
};

// METADATA
export const TEMPLATE_VERSION = '6.0';
export const TEMPLATE_ID = 'Hook1AQuestionBurst';
export const PRIMARY_INTENTION = 'QUESTION';
export const SECONDARY_INTENTIONS = ['CHALLENGE', 'REVEAL'];

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
  }
};
