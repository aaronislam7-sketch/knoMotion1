import React, { useEffect } from 'react';
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
import { loadFontVoice, DEFAULT_FONT_VOICE } from '../sdk/fontSystem';
import { createTransitionProps } from '../sdk/transitions';

/**
 * TEMPLATE #16: QUOTE SHOWCASE - v6.0
 * 
 * PRIMARY INTENTION: INSPIRE
 * SECONDARY INTENTIONS: QUESTION, REVEAL
 * 
 * PURPOSE: Display inspirational quotes with beautiful visuals and animations
 * 
 * VISUAL PATTERN:
 * - Large centered quote text with quotation marks
 * - Optional author attribution
 * - Background with ambient effects
 * - Animated entrance and emphasis
 * - Optional visual element (icon, image, or abstract shape)
 * 
 * AGNOSTIC PRINCIPALS:
 * ✓ Type-Based Polymorphism (hero registry for visuals)
 * ✓ Data-Driven Structure (configurable quote content)
 * ✓ Token-Based Positioning (semantic layout)
 * ✓ Separation of Concerns (independent layers)
 * ✓ Progressive Configuration (simple defaults)
 * ✓ Registry Pattern (extensible visual types)
 */

// DEFAULT CONFIGURATION
const DEFAULT_CONFIG = {
  quote: {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    position: 'center',
    offset: { x: 0, y: 0 }
  },
  
  visual: {
    type: 'emoji', // emoji | roughSVG | lottie | none
    value: '💡',
    position: 'top-center',
    offset: { x: 0, y: -200 },
    scale: 2.0
  },
  
  style: 'classic', // classic | modern | minimal | bold
  
  typography: {
    voice: 'story',
    align: 'center',
    transform: 'none'
  },
  
  style_tokens: {
    colors: {
      bg: '#1A1A2E',
      quote: '#FFFFFF',
      author: '#9B9B9B',
      accent: '#FFD700',
      particles: 'rgba(255, 215, 0, 0.3)'
    },
    fonts: {
      size_quote: 48,
      size_author: 28,
      weight_quote: 700,
      weight_author: 400
    }
  },
  
  beats: {
    entrance: 0.5,
    quoteReveal: 1.0,
    quoteFull: 3.5,
    authorReveal: 4.0,
    hold: 6.5,
    exit: 7.5
  },
  
  animation: {
    entrance: 'fade-up',
    emphasis: 'pulse', // pulse | glow | scale | none
    easing: 'power3Out'
  },
  
  particles: {
    enabled: true,
    count: 30,
    style: 'sparkle'
  }
};

// MAIN COMPONENT
export const Quote16Showcase = ({ scene, styles, presets, easingMap }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Merge config
  const config = { ...DEFAULT_CONFIG, ...scene };
  const beats = { ...DEFAULT_CONFIG.beats, ...(scene.beats || {}) };
  const colors = { ...DEFAULT_CONFIG.style_tokens.colors, ...(scene.style_tokens?.colors || {}) };
  const fonts = { ...DEFAULT_CONFIG.style_tokens.fonts, ...(scene.style_tokens?.fonts || {}) };
  const typography = { ...DEFAULT_CONFIG.typography, ...(scene.typography || {}) };
  const anim = { ...DEFAULT_CONFIG.animation, ...(scene.animation || {}) };
  const particles = { ...DEFAULT_CONFIG.particles, ...(scene.particles || {}) };
  
  // Load font voice
  useEffect(() => {
    void loadFontVoice(typography.voice || DEFAULT_FONT_VOICE);
  }, [typography.voice]);
  
  // Convert beats to frames
  const f_entrance = toFrames(beats.entrance, fps);
  const f_quoteReveal = toFrames(beats.quoteReveal, fps);
  const f_quoteFull = toFrames(beats.quoteFull, fps);
  const f_authorReveal = toFrames(beats.authorReveal, fps);
  const f_hold = toFrames(beats.hold, fps);
  const f_exit = toFrames(beats.exit, fps);
  
  // Animation progress
  const quoteProgress = interpolate(
    frame,
    [f_entrance, f_quoteReveal],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: easingMap?.[anim.easing] || EZ.power3Out
    }
  );
  
  const authorProgress = interpolate(
    frame,
    [f_authorReveal, f_authorReveal + toFrames(0.8, fps)],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: easingMap?.[anim.easing] || EZ.power3Out
    }
  );
  
  const exitProgress = interpolate(
    frame,
    [f_hold, f_exit],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: EZ.power3In
    }
  );
  
  // Emphasis animation (pulse effect during hold)
  const pulseProgress = anim.emphasis === 'pulse' && frame >= f_quoteFull && frame < f_hold
    ? Math.sin((frame - f_quoteFull) / 15) * 0.05 + 1
    : 1;
  
  // Generate particles
  const particleElements = particles.enabled
    ? generateAmbientParticles({
        count: particles.count,
        seed: 16,
        style: particles.style,
        color: colors.particles,
        bounds: { w: 1920, h: 1080 }
      })
    : [];
  
  // Render particles
  renderAmbientParticles(particleElements, frame, fps, { opacity: 1 - exitProgress });
  
  // Visual element config
  const visualConfig = config.visual.type !== 'none' ? {
    hero: mergeHeroConfig(
      {
        type: config.visual.type,
        value: config.visual.value,
        scale: config.visual.scale || 1.0,
        opacity: 1.0
      },
      scene.visual || {}
    ),
    position: config.visual.position || 'top-center',
    offset: config.visual.offset || { x: 0, y: -200 }
  } : null;
  
  const visualPosition = visualConfig 
    ? resolvePosition(visualConfig.position, visualConfig.offset, { w: 1920, h: 1080 })
    : null;
  
  // Quote positioning
  const quotePos = resolvePosition(config.quote.position || 'center', config.quote.offset || { x: 0, y: 0 }, { w: 1920, h: 1080 });
  
  // Style variants
  const getStyleVariant = () => {
    switch (config.style) {
      case 'modern':
        return {
          quotePadding: '60px 120px',
          quoteBorder: `4px solid ${colors.accent}`,
          quoteBorderRadius: '20px',
          quoteBackground: 'rgba(255, 255, 255, 0.05)'
        };
      case 'minimal':
        return {
          quotePadding: '40px 100px',
          quoteBorder: 'none',
          quoteBorderRadius: '0',
          quoteBackground: 'transparent'
        };
      case 'bold':
        return {
          quotePadding: '60px 100px',
          quoteBorder: `8px solid ${colors.accent}`,
          quoteBorderRadius: '30px',
          quoteBackground: 'rgba(0, 0, 0, 0.3)'
        };
      default: // classic
        return {
          quotePadding: '50px 120px',
          quoteBorder: `2px solid ${colors.accent}`,
          quoteBorderRadius: '12px',
          quoteBackground: 'rgba(255, 255, 255, 0.03)'
        };
    }
  };
  
  const styleVariant = getStyleVariant();
  
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
          height: '100%',
          opacity: 1 - exitProgress
        }}
      >
        {particleElements.map(p => p.element)}
      </svg>
      
      {/* Visual Element (Icon/Image) */}
      {visualConfig && visualPosition && quoteProgress > 0.3 && (
        <div
          style={{
            position: 'absolute',
            ...positionToCSS(visualPosition),
            opacity: interpolate(quoteProgress, [0.3, 0.6], [0, 1], { extrapolateRight: 'clamp' }) * (1 - exitProgress),
            transform: `scale(${interpolate(quoteProgress, [0.3, 0.6], [0.8, 1], { extrapolateRight: 'clamp' })})`,
            transition: 'transform 0.3s ease-out'
          }}
        >
          {renderHero(
            visualConfig.hero,
            frame,
            beats,
            colors,
            easingMap || EZ,
            fps
          )}
        </div>
      )}
      
      {/* Quote Container */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translate(-50%, calc(-50% + ${(1 - quoteProgress) * 30}px)) scale(${pulseProgress})`,
          width: '80%',
          maxWidth: 1400,
          padding: styleVariant.quotePadding,
          border: styleVariant.quoteBorder,
          borderRadius: styleVariant.quoteBorderRadius,
          background: styleVariant.quoteBackground,
          backdropFilter: 'blur(10px)',
          opacity: quoteProgress * (1 - exitProgress),
          transition: 'transform 0.3s ease-out'
        }}
      >
        {/* Opening Quote Mark */}
        <div
          style={{
            fontSize: fonts.size_quote * 1.5,
            color: colors.accent,
            fontFamily: 'Georgia, serif',
            lineHeight: 0.5,
            marginBottom: 20,
            opacity: quoteProgress
          }}
        >
          "
        </div>
        
        {/* Quote Text */}
        <div
          style={{
            fontSize: fonts.size_quote,
            fontWeight: fonts.weight_quote,
            color: colors.quote,
            lineHeight: 1.4,
            textAlign: 'center',
            marginBottom: 20,
            letterSpacing: '0.5px'
          }}
        >
          {config.quote.text}
        </div>
        
        {/* Closing Quote Mark */}
        <div
          style={{
            fontSize: fonts.size_quote * 1.5,
            color: colors.accent,
            fontFamily: 'Georgia, serif',
            lineHeight: 0.5,
            marginTop: -10,
            marginBottom: 30,
            textAlign: 'right',
            opacity: quoteProgress
          }}
        >
          "
        </div>
        
        {/* Author */}
        {config.quote.author && (
          <div
            style={{
              fontSize: fonts.size_author,
              fontWeight: fonts.weight_author,
              color: colors.author,
              textAlign: 'center',
              opacity: authorProgress,
              transform: `translateY(${(1 - authorProgress) * 10}px)`,
              fontStyle: 'italic'
            }}
          >
            — {config.quote.author}
          </div>
        )}
      </div>
      
      {/* Accent Line */}
      {config.style !== 'minimal' && (
        <div
          style={{
            position: 'absolute',
            bottom: 100,
            left: '50%',
            transform: `translateX(-50%) scaleX(${quoteProgress})`,
            width: 400,
            height: 4,
            backgroundColor: colors.accent,
            borderRadius: 2,
            opacity: (1 - exitProgress) * 0.5
          }}
        />
      )}
    </AbsoluteFill>
  );
};

// DURATION CALCULATION
export const getDuration = (scene, fps) => {
  const config = { ...DEFAULT_CONFIG, ...scene };
  const beats = { ...DEFAULT_CONFIG.beats, ...(scene.beats || {}) };
  return toFrames(beats.exit + 0.5, fps);
};

// METADATA
export const TEMPLATE_VERSION = '6.0';
export const TEMPLATE_ID = 'Quote16Showcase';
export const PRIMARY_INTENTION = 'INSPIRE';
export const SECONDARY_INTENTIONS = ['QUESTION', 'REVEAL'];

// CONFIG SCHEMA (for Admin UI)
export const CONFIG_SCHEMA = {
  quote: {
    text: { type: 'textarea', label: 'Quote Text', rows: 3 },
    author: { type: 'text', label: 'Author' },
    position: { type: 'position', label: 'Quote Position', default: 'center' }
  },
  visual: {
    type: { type: 'select', label: 'Visual Type', options: ['emoji', 'roughSVG', 'lottie', 'none'] },
    value: { type: 'text', label: 'Visual Value (emoji or asset)' },
    scale: { type: 'slider', label: 'Visual Scale', min: 0.5, max: 3, step: 0.1 }
  },
  style: {
    type: 'select',
    label: 'Style',
    options: ['classic', 'modern', 'minimal', 'bold']
  },
  animation: {
    emphasis: { type: 'select', label: 'Emphasis Effect', options: ['pulse', 'glow', 'scale', 'none'] }
  }
};
