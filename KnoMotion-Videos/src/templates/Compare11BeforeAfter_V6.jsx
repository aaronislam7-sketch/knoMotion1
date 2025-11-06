import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import { THEME } from '../utils/theme';
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
  renderAmbientParticles
} from '../sdk';

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
    backgroundColor: '#FFE5E5'
  },
  after: {
    label: 'AFTER',
    headline: 'End Result',
    description: 'Where we arrived',
    visual: null,
    backgroundColor: '#E5FFE5'
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
    entrance: 0.4,
    titleEntry: 0.6,
    beforeReveal: 1.2,
    transitionStart: 3.0,
    transitionDuration: 1.5,
    afterEmphasize: 1.0,
    exit: 2.0
  },
  animation: {
    beforeEntrance: 'slide-right',
    afterEntrance: 'slide-left',
    pulseAfter: true
  }
};

// Render split divider
const renderDivider = (orientation, progress, colors, width, height) => {
  const ease = EZ.power3InOut(progress);
  
  if (orientation === 'vertical') {
    // Vertical divider with animated position
    const leftWidth = interpolate(ease, [0, 1], [50, 100]);
    
    return (
      <>
        {/* Moving divider line */}
        <div style={{
          position: 'absolute',
          left: `${leftWidth}%`,
          top: 0,
          width: 4,
          height: '100%',
          backgroundColor: colors.divider,
          transform: 'translateX(-50%)',
          zIndex: 100,
          boxShadow: '0 0 20px rgba(0,0,0,0.3)'
        }}>
          {/* Drag handle visual */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 50,
            height: 50,
            borderRadius: '50%',
            backgroundColor: colors.divider,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
          }}>
            <div style={{
              color: '#FFFFFF',
              fontSize: 24,
              fontWeight: 900
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
        {/* Moving divider line */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: `${topHeight}%`,
          width: '100%',
          height: 4,
          backgroundColor: colors.divider,
          transform: 'translateY(-50%)',
          zIndex: 100,
          boxShadow: '0 0 20px rgba(0,0,0,0.3)'
        }}>
          {/* Drag handle visual */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 50,
            height: 50,
            borderRadius: '50%',
            backgroundColor: colors.divider,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
          }}>
            <div style={{
              color: '#FFFFFF',
              fontSize: 24,
              fontWeight: 900,
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
    animation: { ...DEFAULT_CONFIG.animation, ...(scene.animation || {}) }
  };
  
  const colors = config.style_tokens.colors;
  const fonts = config.style_tokens.fonts;
  const beats = config.beats;
  
  // Ambient particles
  const particles = generateAmbientParticles(20, 'compare-ambient', width, height);
  const particleElements = renderAmbientParticles(particles, frame, colors);
  
  // Title animation
  const titleStartFrame = toFrames(beats.titleEntry, fps);
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
  
  // Before state animation
  const beforeStartFrame = toFrames(beats.beforeReveal, fps);
  const beforeAnim = slideInRight(frame, {
    start: beats.beforeReveal,
    dur: 0.8,
    dist: 100,
    ease: 'power3Out'
  }, EZ, fps);
  
  // Transition animation
  const transitionStartFrame = toFrames(beats.transitionStart, fps);
  const transitionEndFrame = toFrames(beats.transitionStart + beats.transitionDuration, fps);
  const transitionProgress = frame >= transitionStartFrame && frame <= transitionEndFrame
    ? (frame - transitionStartFrame) / (transitionEndFrame - transitionStartFrame)
    : frame > transitionEndFrame ? 1 : 0;
  
  // After state animation
  const afterStartFrame = toFrames(beats.transitionStart + 0.3, fps);
  const afterAnim = slideInLeft(frame, {
    start: beats.transitionStart + 0.3,
    dur: 0.8,
    dist: 100,
    ease: 'power3Out'
  }, EZ, fps);
  
  // After emphasis pulse
  const afterEmphasizeStart = beats.transitionStart + beats.transitionDuration;
  const afterEmphasizeFrame = toFrames(afterEmphasizeStart, fps);
  let afterPulseScale = 1;
  if (config.animation.pulseAfter && frame >= afterEmphasizeFrame) {
    afterPulseScale = pulseEmphasis(frame, {
      start: afterEmphasizeStart,
      dur: 0.6,
      ease: 'smooth'
    }, EZ, fps).scale;
  }
  
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
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      {/* Ambient particles */}
      {particleElements}
      
      {/* Title */}
      {frame >= titleStartFrame && (
        <div style={{
          position: 'absolute',
          ...positionToCSS(titlePos),
          fontSize: fonts.size_title,
          fontWeight: 900,
          fontFamily: '"Permanent Marker", cursive',
          color: colors.accent,
          textAlign: 'center',
          opacity: titleAnim.opacity,
          transform: `translateY(${titleAnim.translateY}px) scale(${titleAnim.scale})`,
          zIndex: 200,
          textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
        }}>
          {config.title.text}
        </div>
      )}
      
      {/* BEFORE side */}
      {frame >= beforeStartFrame && (
        <div style={{
          position: 'absolute',
          ...beforeArea,
          backgroundColor: config.before.backgroundColor,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 40,
          opacity: beforeAnim.opacity,
          transform: `translateX(${beforeAnim.translateX}px)`,
          zIndex: 1
        }}>
          {/* Label */}
          <div style={{
            fontSize: fonts.size_label,
            fontWeight: 700,
            fontFamily: 'Inter, sans-serif',
            color: colors.accent,
            letterSpacing: 3,
            marginBottom: 20,
            textTransform: 'uppercase'
          }}>
            {config.before.label}
          </div>
          
          {/* Headline */}
          <div style={{
            fontSize: fonts.size_headline,
            fontWeight: 800,
            fontFamily: '"Permanent Marker", cursive',
            color: colors.ink,
            textAlign: 'center',
            marginBottom: 15
          }}>
            {config.before.headline}
          </div>
          
          {/* Description */}
          {config.before.description && (
            <div style={{
              fontSize: fonts.size_description,
              fontWeight: 400,
              fontFamily: 'Inter, sans-serif',
              color: colors.ink,
              textAlign: 'center',
              maxWidth: '80%',
              lineHeight: 1.5,
              marginBottom: 25,
              opacity: 0.8
            }}>
              {config.before.description}
            </div>
          )}
          
          {/* Visual */}
          {config.before.visual && (
            <div style={{
              marginTop: 20
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
        </div>
      )}
      
      {/* AFTER side */}
      {frame >= afterStartFrame && (
        <div style={{
          position: 'absolute',
          ...afterArea,
          backgroundColor: config.after.backgroundColor,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 40,
          opacity: afterAnim.opacity,
          transform: `translateX(${afterAnim.translateX}px) scale(${afterPulseScale})`,
          zIndex: 2
        }}>
          {/* Label */}
          <div style={{
            fontSize: fonts.size_label,
            fontWeight: 700,
            fontFamily: 'Inter, sans-serif',
            color: colors.accent2,
            letterSpacing: 3,
            marginBottom: 20,
            textTransform: 'uppercase'
          }}>
            {config.after.label}
          </div>
          
          {/* Headline */}
          <div style={{
            fontSize: fonts.size_headline,
            fontWeight: 800,
            fontFamily: '"Permanent Marker", cursive',
            color: colors.ink,
            textAlign: 'center',
            marginBottom: 15
          }}>
            {config.after.headline}
          </div>
          
          {/* Description */}
          {config.after.description && (
            <div style={{
              fontSize: fonts.size_description,
              fontWeight: 400,
              fontFamily: 'Inter, sans-serif',
              color: colors.ink,
              textAlign: 'center',
              maxWidth: '80%',
              lineHeight: 1.5,
              marginBottom: 25,
              opacity: 0.8
            }}>
              {config.after.description}
            </div>
          )}
          
          {/* Visual */}
          {config.after.visual && (
            <div style={{
              marginTop: 20
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
        </div>
      )}
      
      {/* Animated divider/slider */}
      {frame >= transitionStartFrame && config.transitionStyle === 'slider' && renderDivider(
        config.splitOrientation || DEFAULT_CONFIG.splitOrientation,
        transitionProgress,
        colors,
        width,
        height
      )}
    </AbsoluteFill>
  );
};

// Required exports
export const TEMPLATE_ID = 'Compare11BeforeAfter';
export const TEMPLATE_VERSION = '6.0.0';
export const LEARNING_INTENTIONS = {
  primary: ['compare'],
  secondary: ['inspire', 'reveal'],
  tags: ['transformation', 'contrast', 'before-after', 'change']
};

export const getDuration = (scene, fps) => {
  const config = { ...DEFAULT_CONFIG, ...scene };
  const beats = { ...DEFAULT_CONFIG.beats, ...(scene.beats || {}) };
  
  const totalDuration = beats.transitionStart + beats.transitionDuration + beats.afterEmphasize + beats.exit;
  return toFrames(totalDuration, fps);
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
      backgroundColor: { type: 'color', default: '#FFE5E5' }
    }
  },
  after: {
    type: 'object',
    fields: {
      label: { type: 'string', required: true },
      headline: { type: 'string', required: true },
      description: { type: 'string', required: false },
      visual: { type: 'polymorphic-hero', required: false },
      backgroundColor: { type: 'color', default: '#E5FFE5' }
    }
  },
  style_tokens: {
    type: 'style-tokens',
    colors: ['bg', 'accent', 'accent2', 'ink', 'divider'],
    fonts: ['size_title', 'size_label', 'size_headline', 'size_description']
  },
  beats: {
    type: 'timeline',
    beats: ['entrance', 'titleEntry', 'beforeReveal', 'transitionStart', 'transitionDuration', 'afterEmphasize', 'exit']
  },
  animation: {
    type: 'animation-config',
    options: {
      beforeEntrance: ['slide-right', 'fade-up', 'pop'],
      afterEntrance: ['slide-left', 'fade-up', 'pop'],
      pulseAfter: 'boolean'
    }
  }
};
