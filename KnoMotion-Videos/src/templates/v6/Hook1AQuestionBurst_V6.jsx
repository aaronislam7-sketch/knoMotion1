import React, { useEffect, useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import {
  EZ,
  toFrames,
  renderHero,
  mergeHeroConfig,
  resolvePosition,
  generateAmbientParticles,
  renderAmbientParticles,
} from '../../sdk';
import { loadFontVoice, DEFAULT_FONT_VOICE } from '../../sdk/fontSystem';
import { createTransitionProps } from '../../sdk/transitions';

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
  
  typography: {
    voice: 'notebook',
    align: 'center',
    transform: 'none'
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
    questionTransitionStyle: 'slide',
    questionTransitionDirection: 'left',
    transitionDuration: 0.6,
    emphasis: 'pulse',
    visualEntrance: 'fade-scale',
    easing: 'power3Out'
  },
  
  particles: {
    enabled: true,
    count: 25,
    style: 'ambient',
    seed: 1
  },

  cta: {
    enabled: false,
    label: 'Tap to explore more',
    url: ''
  }
};

// MAIN COMPONENT
export const Hook1AQuestionBurst = ({ scene, styles, presets, easingMap }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  
  // Merge config
  const config = { ...DEFAULT_CONFIG, ...scene };
  const beats = { ...DEFAULT_CONFIG.beats, ...(scene.beats || {}) };
  const colors = { ...DEFAULT_CONFIG.style_tokens.colors, ...(scene.style_tokens?.colors || {}) };
  const fonts = { ...DEFAULT_CONFIG.style_tokens.fonts, ...(scene.style_tokens?.fonts || {}) };
  const anim = { ...DEFAULT_CONFIG.animation, ...(scene.animation || {}) };
  const particles = { ...DEFAULT_CONFIG.particles, ...(scene.particles || {}) };
  const typography = { ...DEFAULT_CONFIG.typography, ...(scene.typography || {}) };
  const cta = { ...DEFAULT_CONFIG.cta, ...(scene.cta || {}) };

  useEffect(() => {
    void loadFontVoice(typography.voice || DEFAULT_FONT_VOICE);
  }, [typography.voice]);
  
  // Convert beats to frames
  const f_entrance = toFrames(beats.entrance, fps);
  const f_q1 = toFrames(beats.questionPart1, fps);
  const f_q2 = toFrames(beats.questionPart2, fps);
  const f_emphasis = toFrames(beats.emphasis, fps);
  const f_exit = toFrames(beats.exit, fps);
  const f_visualReveal = toFrames(beats.visualReveal, fps);
  const f_conclusion = toFrames(beats.conclusion, fps);
  const f_fadeOut = toFrames(beats.fadeOut, fps);
  
  const baseParticles = useMemo(() => {
    if (!particles.enabled) return [];
    return generateAmbientParticles(
      particles.count,
      particles.seed ?? 1,
      width,
      height
    );
  }, [particles.enabled, particles.count, particles.seed, width, height]);

  const ambientParticles = particles.enabled
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
  
  const questionExitTransition = useMemo(
    () =>
      createTransitionProps({
        style: anim.questionTransitionStyle || 'slide',
        durationInFrames: toFrames(anim.transitionDuration ?? 0.6, fps),
        direction: anim.questionTransitionDirection || 'left'
      }),
    [
      anim.questionTransitionStyle,
      anim.transitionDuration,
      anim.questionTransitionDirection,
      fps
    ]
  );

  const questionExitProgress = frame < f_exit
    ? 0
    : Math.min(
        1,
        questionExitTransition.timing
          ? questionExitTransition.timing.getProgress({
              frame: frame - f_exit,
              fps
            })
          : interpolate(
              frame,
              [f_exit, f_exit + toFrames(0.5, fps)],
              [0, 1],
              {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: EZ.power3In
              }
            )
      );

  const exitOffset = (() => {
    if (!anim.questionTransitionStyle?.includes('slide')) {
      return { x: 0, y: 0 };
    }
    const direction = anim.questionTransitionDirection || 'left';
    switch (direction) {
      case 'right':
        return { x: width * questionExitProgress, y: 0 };
      case 'up':
        return { x: 0, y: -height * questionExitProgress };
      case 'down':
        return { x: 0, y: height * questionExitProgress };
      case 'left':
      default:
        return { x: -width * questionExitProgress, y: 0 };
    }
  })();

  const q1Opacity = frame < f_q1 ? 0 : Math.max(0, Math.min(1, q1Progress * (1 - questionExitProgress)));
  const q1TranslateY = frame < f_q1 ? 30 : (1 - q1Progress) * 30;
  
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
  
  const q2Opacity = frame < f_q2 ? 0 : Math.max(0, Math.min(1, q2Progress * (1 - questionExitProgress)));
  const q2TranslateY = frame < f_q2 ? 40 : (1 - q2Progress) * 40;
  const q2Scale = frame < f_q2 ? 0.9 : 0.9 + (q2Progress * 0.1);
  
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
  
    const visualOpacity = visualProgress * (1 - Math.max(visualFadeOut, questionExitProgress));
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
  
  const conclusionPulse = anim.emphasis === 'pulse' && frame >= f_conclusion && frame < f_fadeOut
    ? 1 + Math.sin((frame - f_conclusion) / 18) * 0.05
    : 1;
  
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
  
  return (
    <AbsoluteFill
      className="relative flex h-full w-full overflow-hidden bg-surface text-ink"
      style={{ backgroundColor: colors.bg }}
    >
      {/* Particle Background */}
      {particles.enabled && (
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox={`0 0 ${width} ${height}`}
        >
          {ambientParticles.map(({ key, element }) =>
            React.cloneElement(element, { key })
          )}
        </svg>
      )}
      
      {/* Optional Title */}
      {config.title.enabled && (
        <div
          className="absolute left-1/2 -translate-x-1/2 font-display font-bold tracking-tight text-ink"
          style={{
            top: config.title.offset.y,
            fontSize: fonts.size_title,
            textTransform,
          }}
        >
          {config.title.text}
        </div>
      )}
      
      {/* Question Part 1 */}
      <div
        className={`pointer-events-none absolute max-w-[88%] font-display leading-tight drop-shadow-lg ${alignmentClass}`}
        style={{
          left: `${q1Pos.x}px`,
          top: `${q1Pos.y}px`,
          transform: `translate(-50%, -50%) translate(${exitOffset.x}px, ${exitOffset.y}px) translateY(${q1TranslateY}px) scale(${q1Pulse})`,
          fontSize: fonts.size_question,
          fontWeight: fonts.weight_question,
          color: colors.accent,
          opacity: q1Opacity,
          textTransform,
        }}
      >
        {config.questionPart1.text}
      </div>
      
      {/* Question Part 2 */}
      <div
        className={`pointer-events-none absolute max-w-[88%] font-display leading-tight drop-shadow-lg ${alignmentClass}`}
        style={{
          left: `${q2Pos.x}px`,
          top: `${q2Pos.y}px`,
          transform: `translate(-50%, -50%) translate(${exitOffset.x}px, ${exitOffset.y}px) translateY(${q2TranslateY}px) scale(${q2Scale * q2Pulse})`,
          fontSize: fonts.size_question,
          fontWeight: fonts.weight_question,
          color: colors.accent2,
          opacity: q2Opacity,
          textTransform,
        }}
      >
        {config.questionPart2.text}
      </div>
      
      {/* Central Visual */}
      {config.centralVisual.enabled && config.centralVisual.type !== 'none' && visualOpacity > 0 && (
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_12px_30px_rgba(0,0,0,0.25)]"
          style={{
            transform: `translate(-50%, -50%) translate(${exitOffset.x * 0.6}px, ${exitOffset.y * 0.6}px) scale(${visualScale})`,
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
        <div className={`absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center ${alignmentClass}`} style={{ opacity: conclusionOpacity }}>
          <div
            className="font-display drop-shadow-lg"
            style={{
              fontSize: fonts.size_conclusion,
              fontWeight: fonts.weight_conclusion,
              color: colors.accent,
              marginBottom: 20,
              transform: `scale(${conclusionPulse})`,
              textTransform,
            }}
          >
            {config.conclusion.text}
          </div>
          {config.conclusion.subtitle && (
            <div
              className="font-body"
              style={{
                fontSize: fonts.size_subtitle,
                color: colors.textSecondary,
                fontWeight: 400,
                textTransform,
              }}
            >
              {config.conclusion.subtitle}
            </div>
          )}
        </div>
      )}

      {/* CTA Badge */}
      {cta.enabled && conclusionOpacity > 0 && (
        <div className="absolute inset-x-0 bottom-[14%] flex justify-center" style={{ opacity: Math.min(1, conclusionOpacity) }}>
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
export const TEMPLATE_VERSION = '6.1';
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
    questionTransitionStyle: {
      type: 'select',
      label: 'Question Exit Style',
      options: ['slide', 'fade', 'wipe', 'none']
    },
    questionTransitionDirection: {
      type: 'select',
      label: 'Slide Direction',
      options: ['left', 'right', 'up', 'down']
    },
    transitionDuration: {
      type: 'slider',
      label: 'Transition Duration (s)',
      min: 0.2,
      max: 1.2,
      step: 0.05
    }
  },
  cta: {
    enabled: { type: 'checkbox', label: 'Show CTA Badge' },
    label: { type: 'text', label: 'CTA Label' },
    url: { type: 'text', label: 'CTA Link (optional)' }
  }
};
