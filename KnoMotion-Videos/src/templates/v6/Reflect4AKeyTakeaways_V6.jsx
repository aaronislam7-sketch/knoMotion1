import React, { useEffect, useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';

// SDK imports - Agnostic Template System v6
import {
  EZ,
  toFrames,
  generateAmbientParticles,
  renderAmbientParticles,
  getLetterReveal,
  renderLetterReveal,
  getCardEntrance,
  getIconPop,
  getContinuousLife
} from '../../sdk';
import {
  GlassmorphicPane,
  NoiseTexture,
  SpotlightEffect
} from '../../sdk/effects/broadcastEffects';
import { loadFontVoice, buildFontTokens, DEFAULT_FONT_VOICE } from '../../sdk/fontSystem';
import { createTransitionProps } from '../../sdk/transitions';

/**
 * TEMPLATE #7: KEY TAKEAWAYS - v6.3 (SIMPLE & POLISHED)
 * 
 * PRIMARY INTENTION: REFLECT
 * SECONDARY INTENTIONS: BREAKDOWN, GUIDE
 * 
 * PURPOSE: Clean vertical list of key learning points with subtle polish
 * 
 * VISUAL PATTERN:
 * - Simple centered vertical list
 * - Icon badges + text in glassmorphic panes
 * - Subtle continuous breathing + floating during hold
 * - Visual emphasis via scale for important items (importance: 2)
 * - 60fps optimized (no heavy particle bursts)
 * 
 * POLISH APPLIED:
 * ✅ Layered background (gradient, noise, spotlights, ambient particles)
 * ✅ Glassmorphic panes for clean presentation
 * ✅ Smooth entrance animations (up slide + fade)
 * ✅ Icon pop with bounce
 * ✅ Continuous life during hold (subtle breathing + floating)
 * ✅ Emphasis glow for important items
 * ✅ 60fps performance (willChange hints, reduced particle count)
 * 
 * PERFORMANCE OPTIMIZATIONS:
 * - willChange: 'transform, opacity' on animated elements
 * - Reduced breathing/floating amplitude (50-70% of original)
 * - Particle bursts disabled by default
 * - Simple vertical layout (no complex positioning)
 * 
 * NO HARDCODED VALUES!
 */

const DEFAULT_CONFIG = {
  title: {
    text: 'Key Takeaways',
    position: 'top-center',
    offset: { x: 0, y: 80 }
  },
  
  takeaways: [
    { text: 'First important point to remember', icon: '💡', importance: 1 },
    { text: 'Second key insight or lesson', icon: '🎯', importance: 2 },
    { text: 'Third critical concept or skill', icon: '🚀', importance: 1 }
  ],
  
  typography: {
    voice: 'notebook',
    align: 'left',
    transform: 'none'
  },
  
  style_tokens: {
    colors: {
      bg: '#FFF5E8',
      bgGradientStart: '#FFF5E8',
      bgGradientEnd: '#FFE5CC',
      title: '#1A1A1A',
      accent: '#27AE60',
      text: '#34495E',
      bullet: '#CBD5E0',
      glassBackground: '#FFFFFF25'
    },
    fonts: {
      size_title: 64,
      size_takeaway: 28,
      size_icon: 36,
      weight_title: 800,
      weight_takeaway: 600
    }
  },
  
  beats: {
    // CUMULATIVE TIMING: Each value is added to the previous
    // entrance = 0.5s (absolute start)
    // titleStart at: entrance = 0.5s
    // firstTakeaway at: entrance + titleReveal + titleHold = 0.5 + 0.8 + 0.5 = 1.8s
    entrance: 0.5,           // Initial background fade
    titleReveal: 0.8,        // Title letter reveal duration (+0.8s)
    titleHold: 0.5,          // Hold title (+0.5s)
    takeawayReveal: 0.6,     // Per-takeaway reveal duration (+0.6s per takeaway)
    takeawayInterval: 0.8,   // Interval between takeaways (+0.8s per takeaway)
    hold: 3.0,               // Hold final state (+3.0s)
    exit: 0.8                // Exit animation (+0.8s)
  },
  
  layout: {
    verticalSpacing: 120,    // Vertical gap between items
    itemWidth: 900,          // Width of each takeaway
    emphasisScaleMultiplier: 1.15  // Scale multiplier for importance:2 items
  },
  
  animation: {
    letterRevealStyle: 'fade-up',
    takeawayEntrance: 'slide-fade',
    continuousBreathing: true,    // Subtle scale pulse during hold ⭐ NEW
    breathingFrequency: 0.03,     // Breathing speed (lower = slower)
    breathingAmplitude: 0.03,     // Scale range (0.03 = ±3%)
    continuousFloating: true,     // Subtle Y drift during hold ⭐ NEW
    floatingFrequency: 0.02,      // Float speed
    floatingAmplitude: 4,         // Y distance in pixels
    easing: 'backOut'
  },
  
  decorations: {
    showBackground: true,
    showGradient: true,
    showNoiseTexture: true,
    noiseOpacity: 0.04,
    showSpotlights: true,
    spotlightCount: 2,
    spotlight1: { x: 0.3, y: 0.25, size: 600, color: '#27AE6015' },
    spotlight2: { x: 0.7, y: 0.75, size: 550, color: '#FF6B3512' },
    showParticles: true,
    particleCount: 25,
    showGlassPane: true,
    glassPaneOpacity: 0.25,
    glassPaneBorderOpacity: 0.35,
    glassInnerRadius: 20,
    showParticleBurst: false,    // Disabled for 60fps
    particleBurstCount: 12,
    showIconBadge: true,
    badgeStyle: 'circle',
    showEmphasisGlow: true       // Persistent glow on importance:2 items
  },
  
  transition: {
    exit: {
      style: 'fade',
      durationInFrames: 18,
      easing: 'smooth'
    }
  }
};

// Calculate cumulative beats
const calculateCumulativeBeats = (beats, takeawayCount) => {
  let cumulative = 0;
  const result = {
    entrance: cumulative,
    titleStart: (cumulative += beats.entrance),
    titleVisible: (cumulative += beats.titleReveal),
    firstTakeaway: (cumulative += beats.titleHold),
    takeaways: []
  };
  
  for (let i = 0; i < takeawayCount; i++) {
    result.takeaways.push({
      start: cumulative,
      visible: (cumulative += beats.takeawayReveal)
    });
    if (i < takeawayCount - 1) {
      cumulative += beats.takeawayInterval - beats.takeawayReveal;
    }
  }
  
  result.holdStart = (cumulative += beats.takeawayInterval - beats.takeawayReveal);
  result.exitStart = (cumulative += beats.hold);
  result.totalDuration = (cumulative += beats.exit);
  
  return result;
};

export const Reflect4AKeyTakeaways = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  
  // Merge config
  const config = { ...DEFAULT_CONFIG, ...scene };
  const rawBeats = { ...DEFAULT_CONFIG.beats, ...(scene.beats || {}) };
  const takeaways = config.takeaways || DEFAULT_CONFIG.takeaways;
  const beats = useMemo(() => calculateCumulativeBeats(rawBeats, takeaways.length), [rawBeats, takeaways.length]);
  const colors = { ...DEFAULT_CONFIG.style_tokens.colors, ...(scene.style_tokens?.colors || {}) };
  const fonts = { ...DEFAULT_CONFIG.style_tokens.fonts, ...(scene.style_tokens?.fonts || {}) };
  const layout = { ...DEFAULT_CONFIG.layout, ...(scene.layout || {}) };
  const anim = { ...DEFAULT_CONFIG.animation, ...(scene.animation || {}) };
  const decorations = { ...DEFAULT_CONFIG.decorations, ...(scene.decorations || {}) };
  const typography = { ...DEFAULT_CONFIG.typography, ...(scene.typography || {}) };
  
  useEffect(() => {
    loadFontVoice(typography.voice || DEFAULT_FONT_VOICE);
  }, [typography.voice]);
  
  const fontTokens = buildFontTokens(typography.voice || DEFAULT_FONT_VOICE);
  
  // Convert beats to frames
  const f = useMemo(() => ({
    entrance: toFrames(beats.entrance, fps),
    titleStart: toFrames(beats.titleStart, fps),
    titleVisible: toFrames(beats.titleVisible, fps),
    firstTakeaway: toFrames(beats.firstTakeaway, fps),
    takeaways: beats.takeaways.map(t => ({
      start: toFrames(t.start, fps),
      visible: toFrames(t.visible, fps)
    })),
    holdStart: toFrames(beats.holdStart, fps),
    exitStart: toFrames(beats.exitStart, fps),
    totalDuration: toFrames(beats.totalDuration, fps)
  }), [beats, fps]);
  
  // Ambient particles
  const baseParticles = useMemo(() => {
    if (!decorations.showParticles) return [];
    return generateAmbientParticles(
      decorations.particleCount,
      777,
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
          `${colors.accent}40`,
          `${colors.title}20`,
          `${colors.bullet}60`,
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
  
  // Title - Letter Reveal
  const titleLetterReveal = useMemo(() => {
    return getLetterReveal(frame, config.title.text, {
      startFrame: beats.titleStart,
      duration: rawBeats.titleReveal,
      staggerDelay: 0.04
    }, fps);
  }, [frame, config.title.text, beats.titleStart, rawBeats.titleReveal, fps]);
  
  const titleCardEntrance = getCardEntrance(frame, {
    startFrame: beats.titleStart,
    duration: 0.8,
    direction: 'up',
    distance: 30,
    withGlow: true,
    glowColor: `${colors.title}30`
  }, fps);
  
  // Exit animation
  const exitProgress = frame >= f.exitStart
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
  
  const opacity = 1 - exitProgress;
  
  // Simple vertical list layout
  const centerX = width / 2;
  const contentStartY = height / 2 - (takeaways.length * layout.verticalSpacing) / 2;
  
  return (
    <AbsoluteFill
      className="overflow-hidden"
      style={{
        background: decorations.showGradient
          ? `linear-gradient(135deg, ${colors.bgGradientStart} 0%, ${colors.bgGradientEnd} 100%)`
          : colors.bg,
        fontFamily: fontTokens.body.family,
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
      
      {/* Title with Letter Reveal */}
      {frame >= f.titleStart && (
        <div
          className="absolute left-1/2 text-center"
          style={{
            top: config.title.offset.y,
            transform: `translate(-50%, 0) scale(${titleCardEntrance.scale})`,
            opacity: titleCardEntrance.opacity * opacity,
            zIndex: 10
          }}
        >
          <div
            style={{
              fontSize: Math.min(fonts.size_title, 72),
              fontWeight: fonts.weight_title,
              fontFamily: fontTokens.title.family,
              color: colors.title,
              textTransform: typography.transform !== 'none' ? typography.transform : undefined,
              textShadow: '3px 3px 6px rgba(0,0,0,0.15)',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
            }}
          >
            {renderLetterReveal(titleLetterReveal.letters, titleLetterReveal.letterOpacities)}
          </div>
        </div>
      )}
      
      {/* Takeaways List - Simple Vertical */}
      <div 
        className="absolute left-1/2 flex flex-col items-center"
        style={{ 
          top: contentStartY,
          transform: 'translateX(-50%)',
          gap: layout.verticalSpacing,
          zIndex: 5,
          width: layout.itemWidth
        }}
      >
        {takeaways.map((item, i) => {
          const itemBeat = f.takeaways[i];
          if (!itemBeat || frame < itemBeat.start) return null;
          
          const importance = item.importance || 1;
          const scale = importance === 2 ? layout.emphasisScaleMultiplier : 1.0;
          
          // Card entrance
          const itemCardEntrance = getCardEntrance(frame, {
            startFrame: beats.takeaways[i].start,
            duration: rawBeats.takeawayReveal,
            direction: 'up',
            distance: 40,
            withGlow: false
          }, fps);
          
          if (itemCardEntrance.opacity === 0) return null;
          
          // Icon pop
          const iconPop = getIconPop(frame, {
            startFrame: beats.takeaways[i].start + 0.2,
            duration: 0.5,
            withBounce: true,
            rotation: 0
          }, fps);
          
          // Continuous life (breathing + floating) - optimized for 60fps
          const shouldAnimate = frame >= itemBeat.visible && exitProgress < 0.1;
          const continuousLife = getContinuousLife(frame, {
            startFrame: itemBeat.visible,
            breathingFrequency: anim.breathingFrequency,
            breathingAmplitude: anim.breathingAmplitude * 0.5, // Reduced for subtlety
            floatingFrequency: anim.floatingFrequency,
            floatingAmplitude: anim.floatingAmplitude * 0.7, // Reduced
            phaseOffset: i * (Math.PI / 3),
            enabled: shouldAnimate && (anim.continuousBreathing || anim.continuousFloating)
          });
          
          // Emphasis glow for important items
          const emphasisGlow = importance === 2 && decorations.showEmphasisGlow && shouldAnimate
            ? `0 0 15px ${colors.accent}50, 0 0 30px ${colors.accent}20`
            : 'none';
          
          return (
            <div
              key={i}
              className="flex items-center w-full"
              style={{
                gap: 20,
                transform: `translateY(${continuousLife.y}px) scale(${itemCardEntrance.scale * scale * continuousLife.scale})`,
                opacity: itemCardEntrance.opacity * opacity,
                willChange: 'transform, opacity', // Performance hint for browser
                zIndex: importance === 2 ? 10 : 5
              }}
            >
                {/* Icon badge */}
              {decorations.showIconBadge && (
                <div
                  className="flex-shrink-0 flex items-center justify-center"
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: decorations.badgeStyle === 'circle' ? '50%' : '12px',
                    background: `linear-gradient(135deg, ${colors.accent}E6 0%, ${colors.accent}B3 100%)`,
                    border: `3px solid ${colors.accent}`,
                    fontSize: Math.min(fonts.size_icon, 44),
                    fontFamily: fontTokens.accent.family,
                    opacity: iconPop.opacity,
                    transform: `scale(${iconPop.scale})`,
                    boxShadow: emphasisGlow !== 'none' ? emphasisGlow : `0 4px 10px ${colors.accent}40`,
                    backdropFilter: 'blur(10px)',
                    willChange: 'transform, opacity'
                  }}
                >
                  {item.icon || (i + 1)}
                </div>
              )}
                
              {/* Text content */}
              <div className="flex-1">
                  {decorations.showGlassPane ? (
                    <GlassmorphicPane
                      innerRadius={decorations.glassInnerRadius}
                      glowOpacity={0.15}
                      borderOpacity={decorations.glassPaneBorderOpacity}
                      backgroundColor={colors.glassBackground}
                      padding={24}
                      style={{
                        boxShadow: itemCardEntrance.boxShadow
                      }}
                    >
                      <div
                        className="leading-snug"
                        style={{
                          fontSize: Math.min(fonts.size_takeaway, 32),
                          fontWeight: fonts.weight_takeaway,
                          fontFamily: fontTokens.body.family,
                          color: colors.text,
                          textAlign: typography.align,
                          lineHeight: 1.4,
                          textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                        }}
                      >
                        {item.text}
                      </div>
                    </GlassmorphicPane>
                  ) : (
                    <div
                      className="leading-snug"
                      style={{
                        fontSize: Math.min(fonts.size_takeaway, 32),
                        fontWeight: fonts.weight_takeaway,
                        fontFamily: fontTokens.body.family,
                        color: colors.text,
                        textAlign: typography.align,
                        lineHeight: 1.4,
                        padding: 20,
                        backgroundColor: `${colors.glassBackground}80`,
                        borderRadius: decorations.glassInnerRadius,
                        backdropFilter: 'blur(5px)',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                      }}
                    >
                      {item.text}
                    </div>
                  )}
                </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Duration calculation
export const getDuration = (scene, fps = 30) => {
  const rawBeats = { ...DEFAULT_CONFIG.beats, ...(scene?.beats || {}) };
  const takeaways = scene?.takeaways || DEFAULT_CONFIG.takeaways;
  const beats = calculateCumulativeBeats(rawBeats, takeaways.length);
  
  // Add 3s buffer to ensure all content is visible
  const totalDuration = beats.totalDuration + 3.0;
  
  console.log(`[Reflect4A] Duration Calculation:`, {
    takeawayCount: takeaways.length,
    beatsTotal: beats.totalDuration,
    withBuffer: totalDuration,
    frames: toFrames(totalDuration, fps)
  });
  
  return toFrames(totalDuration, fps);
};

// Metadata
export const TEMPLATE_VERSION = '6.3';
export const TEMPLATE_ID = 'Reflect4AKeyTakeaways';
export const PRIMARY_INTENTION = 'REFLECT';
export const SECONDARY_INTENTIONS = ['BREAKDOWN', 'GUIDE', 'REVEAL'];
export const TEMPLATE_POLISH_DATE = '2025-11-12';
export const POLISH_IMPROVEMENTS = [
  'Continuous life animations (breathing + floating during hold)',
  'Staggered layout for better canvas utilization (75-85% vs 52%)',
  'Visual hierarchy via importance scaling',
  'Flow lines connecting sequential items',
  'Emphasis glow for key takeaways'
];

// Config schema
export const CONFIG_SCHEMA = {
  title: {
    text: { type: 'text', label: 'Title' }
  },
  takeaways: {
    type: 'array',
    label: 'Takeaways',
    itemSchema: {
      text: { type: 'textarea', label: 'Takeaway Text', rows: 2 },
      icon: { type: 'text', label: 'Icon (emoji)' },
      importance: {
        type: 'select',
        label: 'Importance',
        options: [1, 2],
        help: '1 = normal, 2 = emphasized (larger, glowing)'
      }
    }
  },
  layout: {
    style: {
      type: 'select',
      label: 'Layout Style',
      options: ['vertical', 'staggered'],
      help: 'Staggered uses more canvas space with zigzag pattern'
    },
    leftOffset: {
      type: 'slider',
      label: 'Left Position (%)',
      min: 0.2,
      max: 0.5,
      step: 0.05
    },
    rightOffset: {
      type: 'slider',
      label: 'Right Position (%)',
      min: 0.5,
      max: 0.8,
      step: 0.05
    },
    verticalSpacing: {
      type: 'slider',
      label: 'Vertical Spacing (px)',
      min: 100,
      max: 200,
      step: 10
    },
    emphasisScaleMultiplier: {
      type: 'slider',
      label: 'Emphasis Scale',
      min: 1.0,
      max: 1.5,
      step: 0.1,
      help: 'Scale multiplier for importance:2 items'
    }
  },
  typography: {
    voice: {
      type: 'select',
      label: 'Font Voice',
      options: ['notebook', 'story', 'utility']
    },
    align: {
      type: 'select',
      label: 'Text Align',
      options: ['left', 'center', 'right']
    },
    transform: {
      type: 'select',
      label: 'Text Transform',
      options: ['none', 'uppercase', 'lowercase', 'capitalize']
    }
  },
  animation: {
    letterRevealStyle: {
      type: 'select',
      label: 'Letter Reveal Style',
      options: ['fade-up', 'fade', 'scale']
    },
    takeawayEntrance: {
      type: 'select',
      label: 'Takeaway Entrance Style',
      options: ['slide-fade', 'fade', 'scale']
    },
    continuousBreathing: {
      type: 'checkbox',
      label: 'Enable Continuous Breathing',
      help: 'Subtle scale pulse during hold'
    },
    breathingFrequency: {
      type: 'slider',
      label: 'Breathing Speed',
      min: 0.01,
      max: 0.06,
      step: 0.005
    },
    breathingAmplitude: {
      type: 'slider',
      label: 'Breathing Amplitude',
      min: 0.01,
      max: 0.06,
      step: 0.005,
      help: 'Scale range (0.03 = ±3%)'
    },
    continuousFloating: {
      type: 'checkbox',
      label: 'Enable Continuous Floating',
      help: 'Subtle Y drift during hold'
    },
    floatingFrequency: {
      type: 'slider',
      label: 'Floating Speed',
      min: 0.01,
      max: 0.04,
      step: 0.005
    },
    floatingAmplitude: {
      type: 'slider',
      label: 'Floating Distance (px)',
      min: 2,
      max: 8,
      step: 1
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
    glassPaneOpacity: { type: 'slider', label: 'Glass Pane Opacity', min: 0, max: 0.5, step: 0.05 },
    showParticleBurst: { type: 'checkbox', label: 'Show Particle Bursts' },
    particleBurstCount: { type: 'slider', label: 'Burst Particle Count', min: 5, max: 25, step: 5 },
    showIconBadge: { type: 'checkbox', label: 'Show Icon Badges' },
    badgeStyle: { type: 'select', label: 'Badge Style', options: ['circle', 'square', 'organic'] },
    showFlowLines: {
      type: 'checkbox',
      label: 'Show Flow Lines',
      help: 'Connecting lines between items (staggered layout only)'
    },
    flowLineOpacity: {
      type: 'slider',
      label: 'Flow Line Opacity',
      min: 0.1,
      max: 0.6,
      step: 0.05
    },
    flowLineCurvature: {
      type: 'slider',
      label: 'Flow Line Curvature',
      min: 0.3,
      max: 0.7,
      step: 0.1
    },
    showEmphasisGlow: {
      type: 'checkbox',
      label: 'Show Emphasis Glow',
      help: 'Persistent glow on importance:2 items'
    }
  },
  transition: {
    exit: {
      style: {
        type: 'select',
        label: 'Exit Style',
        options: ['none', 'fade', 'slide', 'wipe']
      },
      durationInFrames: {
        type: 'number',
        label: 'Exit Duration (frames)',
        min: 6,
        max: 60
      }
    }
  }
};
