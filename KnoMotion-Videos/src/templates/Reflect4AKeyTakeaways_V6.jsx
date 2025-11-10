import React, { useEffect } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import { 
  EZ, 
  toFrames,
  generateAmbientParticles,
  renderAmbientParticles
} from '../sdk';
import { loadFontVoice, buildFontTokens, DEFAULT_FONT_VOICE } from '../sdk/fontSystem';
import { createTransitionProps } from '../sdk/transitions';
import { GlassmorphicPane, SpotlightEffect, NoiseTexture } from '../sdk/broadcastEffects';
import { AnimatedLottie } from '../sdk/lottieIntegration';
import { getLottiePreset } from '../sdk/lottiePresets';
import {
  getCardEntrance,
  getIconPop,
  getPulseGlow,
  getParticleBurst,
  renderParticleBurst,
  getScaleEmphasis
} from '../sdk/microDelights.jsx';

/**
 * 🎬 TEMPLATE #7: KEY TAKEAWAYS - v6.0 BROADCAST QUALITY EDITION
 * 
 * PRIMARY INTENTION: BREAKDOWN | SECONDARY: GUIDE, REVEAL
 * 
 * 🌟 MAJOR ENHANCEMENTS:
 * ✅ Glassmorphic cards with depth and shine
 * ✅ Multi-layer animations (card entrance + icon pop + particle bursts)
 * ✅ Per-takeaway emphasis system for VO pacing
 * ✅ Ambient particle system for visual richness
 * ✅ Lottie animated checkmarks for completion feel
 * ✅ Spotlight effect and film grain texture
 * ✅ Heavy Tailwind usage for consistency
 * ✅ Circular badge design (no boxes!)
 * ✅ Increased sizing for full screen usage (~90%)
 * ✅ Sophisticated gradient backgrounds
 * 
 * 🎨 VISUAL PATTERN:
 * - Large glassmorphic cards with flowing entrance
 * - Circular icon badges with pop animation
 * - Pulsing glow on emphasis
 * - Particle bursts on reveal
 * - Floating ambient particles
 * - Premium broadcast-quality aesthetic
 * 
 * 🔧 AGNOSTIC PRINCIPALS:
 * ✓ Type-Based Polymorphism (Lottie, emoji, text icons)
 * ✓ Data-Driven Structure (dynamic takeaways array)
 * ✓ Token-Based Positioning (Tailwind utilities)
 * ✓ Separation of Concerns (content/layout/style/animation)
 * ✓ Progressive Configuration (simple defaults, advanced features)
 * ✓ Registry Pattern (extensible effects system)
 */

const DEFAULT_CONFIG = {
  title: { 
    text: 'Key Takeaways',
    position: 'top-center',
    offset: { x: 0, y: 80 } // Increased for proper clearance
  },
  
  subtitle: {
    text: 'What you need to remember',
    enabled: false
  },
  
  takeaways: [
    { 
      text: 'Understanding the fundamentals creates a strong foundation',
      icon: '💡',
      // NEW: Emphasis for VO
      emphasize: {
        enabled: false,
        startTime: 4.0,
        duration: 2.0
      }
    },
    { 
      text: 'Practice consistently to build lasting skills',
      icon: '🎯',
      emphasize: {
        enabled: false,
        startTime: 6.5,
        duration: 2.0
      }
    },
    { 
      text: 'Apply what you learn to real situations',
      icon: '🚀',
      emphasize: {
        enabled: false,
        startTime: 9.0,
        duration: 2.0
      }
    }
  ],
  
  // NEW: Visual enhancements configuration
  visual: {
    cardStyle: 'sketch', // 'sketch' for notebook aesthetic!
    badgeStyle: 'circular', // 'circular', 'rounded-square', 'hexagon'
    showCheckmarks: true,
    checkmarkStyle: 'emoji', // 'emoji' for hand-drawn feel
    lottiePreset: 'successCheck'
  },
  
  // NEW: Effects configuration
  effects: {
    particles: {
      enabled: true,
      count: 15, // Fewer for notebook aesthetic
      seed: 7001,
      opacity: 0.15 // Subtle
    },
    spotlight: {
      enabled: false, // Too dramatic for notebook
      x: 50,
      y: 50,
      size: 900,
      opacity: 0.15
    },
    noiseTexture: {
      enabled: false, // Clean notebook paper
      opacity: 0.03
    },
    cardGlow: {
      enabled: false, // Sketch style instead
      intensity: 25
    }
  },
  
  // NEW: Emphasis system
  emphasis: {
    enabled: true,
    style: 'scale-glow', // 'scale-glow', 'spotlight', 'pulse'
    scaleAmount: 1.08,
    glowIntensity: 30
  },
  
  layout: {
    cardWidth: 1100, // Increased from 900px (max-w-4/5)
    cardGap: 32, // Tailwind: gap-8
    iconSize: 80, // Larger icons
    padding: 32 // Card internal padding
  },
  
  typography: {
    voice: 'utility',
    align: 'left',
    transform: 'none'
  },
  
  style_tokens: {
    colors: {
      bg: '#FFF9F0', // Notebook paper - warm cream (Knode brand!)
      bgGradient: false, // Keep it simple and clean
      title: '#1A1A1A', // Ink color
      subtitle: '#5A5A5A', // Gray ink
      cardBg: '#FFFFFF', // White paper cards
      cardBorder: 'rgba(26, 26, 26, 0.15)', // Subtle ink border
      accent: '#FF6B35', // Knode brand orange!
      accent2: '#9B59B6', // Knode brand purple!
      accent3: '#2ECC71', // Success green
      text: '#1A1A1A', // Ink color
      textSecondary: '#5A5A5A', // Gray ink
      iconBg: '#FF6B35',
      particleColor: 'rgba(255, 107, 53, 0.3)' // Orange particles
    },
    fonts: {
      size_title: 64, // Larger title
      size_subtitle: 28,
      size_takeaway: 36, // Larger takeaway text
      weight_title: 900,
      weight_subtitle: 500,
      weight_takeaway: 600,
      line_height_takeaway: 1.4
    }
  },
  
  beats: {
    entrance: 0.5,
    title: 0.8, // Quicker title
    subtitle: 1.3,
    firstTakeaway: 1.8, // Start cards sooner!
    takeawayInterval: 1.5, // Faster pacing
    hold: 10.0,
    exit: 12.0
  },
  
  animation: {
    cardEntrance: 'spring-bounce', // 'spring-bounce', 'slide-up', 'fade-scale'
    iconPop: 'bounce', // 'bounce', 'spin', 'pulse'
    particleBurst: true,
    easing: 'power3Out'
  },
  
  transition: {
    exit: {
      style: 'fade',
      durationInFrames: 24,
      easing: 'smooth'
    }
  }
};

export const Reflect4AKeyTakeaways = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  
  // Merge configuration with defaults
  const config = { ...DEFAULT_CONFIG, ...scene };
  const typography = { ...DEFAULT_CONFIG.typography, ...(scene.typography || {}) };
  const visual = { ...DEFAULT_CONFIG.visual, ...(scene.visual || {}) };
  const effects = {
    particles: { ...DEFAULT_CONFIG.effects.particles, ...(scene.effects?.particles || {}) },
    spotlight: { ...DEFAULT_CONFIG.effects.spotlight, ...(scene.effects?.spotlight || {}) },
    noiseTexture: { ...DEFAULT_CONFIG.effects.noiseTexture, ...(scene.effects?.noiseTexture || {}) },
    cardGlow: { ...DEFAULT_CONFIG.effects.cardGlow, ...(scene.effects?.cardGlow || {}) }
  };
  const emphasis = { ...DEFAULT_CONFIG.emphasis, ...(scene.emphasis || {}) };
  const layout = { ...DEFAULT_CONFIG.layout, ...(scene.layout || {}) };
  
  // Load font system
  useEffect(() => {
    loadFontVoice(typography.voice || DEFAULT_FONT_VOICE);
  }, [typography.voice]);
  
  const fontTokens = buildFontTokens(typography.voice || DEFAULT_FONT_VOICE) || {
    title: { family: 'Inter, sans-serif' },
    body: { family: 'Inter, sans-serif' },
    accent: { family: 'Caveat, cursive' }
  };
  
  const beats = { ...DEFAULT_CONFIG.beats, ...(scene.beats || {}) };
  const colors = { ...DEFAULT_CONFIG.style_tokens.colors, ...(scene.style_tokens?.colors || {}) };
  const fonts = { ...DEFAULT_CONFIG.style_tokens.fonts, ...(scene.style_tokens?.fonts || {}) };
  const takeaways = config.takeaways || DEFAULT_CONFIG.takeaways;
  
  // Frame calculations
  const f_title = toFrames(beats.title, fps);
  const f_subtitle = toFrames(beats.subtitle, fps);
  const f_first = toFrames(beats.firstTakeaway, fps);
  const f_exit = toFrames(beats.exit, fps);
  
  // Generate ambient particles (using numeric seed)
  const particles = generateAmbientParticles(
    effects.particles.count,
    effects.particles.seed,
    width,
    height
  );
  const particleElements = effects.particles.enabled 
    ? renderAmbientParticles(particles, frame, fps, [
        colors.particleColor,
        colors.accent,
        colors.accent2
      ])
    : [];
  
  // Title animation
  const titleProgress = interpolate(
    frame,
    [f_title, f_title + toFrames(0.8, fps)],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.power3Out }
  );
  
  // Subtitle animation
  const subtitleProgress = config.subtitle.enabled 
    ? interpolate(
        frame,
        [f_subtitle, f_subtitle + toFrames(0.6, fps)],
        [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.power2Out }
      )
    : 0;
  
  // Exit animation
  const exitProgress = frame >= f_exit 
    ? interpolate(
        frame,
        [f_exit, f_exit + toFrames(1.2, fps)],
        [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.power3In }
      )
    : 0;
  const opacity = 1 - exitProgress;
  
  // Helper: Check if takeaway is emphasized
  const isTakeawayEmphasized = (takeaway, frame, fps) => {
    if (!emphasis.enabled || !takeaway.emphasize?.enabled) return false;
    
    const startFrame = toFrames(takeaway.emphasize.startTime, fps);
    const endFrame = toFrames(takeaway.emphasize.startTime + takeaway.emphasize.duration, fps);
    
    return frame >= startFrame && frame < endFrame;
  };
  
  // Get accent color for index (cycle through colors)
  const getAccentColor = (index) => {
    const colorCycle = [colors.accent, colors.accent2, colors.accent3 || colors.accent];
    return colorCycle[index % colorCycle.length];
  };
  
  return (
    <AbsoluteFill 
      className="overflow-hidden font-utility text-white"
      style={{ 
        backgroundColor: colors.bg,
        fontFamily: fontTokens.body.family 
      }}
    >
      {/* Notebook paper texture - subtle */}
      {colors.bgGradient && (
        <div
          className="absolute inset-0 z-0"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${colors.bg} 0%, #FFF5E6 100%)`,
            opacity: 0.5
          }}
        />
      )}
      
      {/* Ambient particles */}
      {effects.particles.enabled && (
        <svg 
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ opacity: effects.particles.opacity }}
          viewBox={`0 0 ${width} ${height}`}
        >
          {particleElements.map(p => p.element)}
        </svg>
      )}
      
      {/* Spotlight effect */}
      {effects.spotlight.enabled && (
        <SpotlightEffect
          x={effects.spotlight.x}
          y={effects.spotlight.y}
          size={effects.spotlight.size}
          color={colors.accent}
          opacity={effects.spotlight.opacity}
        />
      )}
      
      {/* Film grain texture */}
      {effects.noiseTexture.enabled && (
        <NoiseTexture opacity={effects.noiseTexture.opacity} />
      )}
      
      {/* Title - Using Tailwind for positioning */}
      <div 
        className="absolute left-1/2 -translate-x-1/2 text-center z-20"
        style={{ 
          top: config.title.offset.y,
          transform: `translate(-50%, ${(1 - titleProgress) * 40}px)`,
          opacity: titleProgress * opacity,
          fontSize: fonts.size_title,
          fontWeight: fonts.weight_title,
          fontFamily: fontTokens.title.family,
          color: colors.title,
          textTransform: typography.transform !== 'none' ? typography.transform : undefined,
          textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
        }}
      >
        {config.title.text}
      </div>
      
      {/* Subtitle (optional) */}
      {config.subtitle.enabled && (
        <div
          className="absolute left-1/2 -translate-x-1/2 text-center z-20"
          style={{
            top: config.title.offset.y + 80,
            transform: `translate(-50%, ${(1 - subtitleProgress) * 20}px)`,
            opacity: subtitleProgress * opacity,
            fontSize: fonts.size_subtitle,
            fontWeight: fonts.weight_subtitle,
            fontFamily: fontTokens.body.family,
            color: colors.subtitle
          }}
        >
          {config.subtitle.text}
        </div>
      )}
      
      {/* Takeaways Container - Fixed positioning from top */}
      <div 
        className="absolute left-1/2 -translate-x-1/2 flex flex-col z-30"
        style={{ 
          top: config.title.offset.y + 140, // Position below subtitle
          width: layout.cardWidth,
          maxWidth: '90vw',
          gap: layout.cardGap
        }}
      >
        {takeaways.map((takeaway, i) => {
          const itemBeat = f_first + toFrames(beats.takeawayInterval * i, fps);
          
          // Multi-layer animation system
          const cardEntrance = getCardEntrance(frame, {
            startFrame: itemBeat,
            duration: 0.9,
            direction: 'up',
            distance: 80,
            withGlow: effects.cardGlow.enabled,
            glowColor: `${getAccentColor(i)}40`
          }, fps);
          
          const iconPop = getIconPop(frame, {
            startFrame: itemBeat + 0.4,
            duration: 0.6,
            withBounce: true
          }, fps);
          
          // Particle burst on reveal
          const burstParticles = config.animation.particleBurst 
            ? getParticleBurst(frame, {
                triggerFrame: itemBeat,
                particleCount: 15,
                duration: 1.2,
                color: getAccentColor(i),
                size: 6,
                spread: 80
              }, fps)
            : [];
          
          // Emphasis system (for VO pacing)
          const isEmphasized = isTakeawayEmphasized(takeaway, frame, fps);
          const emphasisScale = isEmphasized && emphasis.enabled
            ? getScaleEmphasis(frame, {
                triggerFrame: takeaway.emphasize.startTime,
                duration: 0.4,
                maxScale: emphasis.scaleAmount
              }, fps)
            : { scale: 1 };
          
          const emphasisGlow = isEmphasized && emphasis.enabled ? {
            boxShadow: `0 0 ${emphasis.glowIntensity}px ${getAccentColor(i)}, 
                        0 0 ${emphasis.glowIntensity * 1.5}px ${getAccentColor(i)}80`,
            borderColor: getAccentColor(i)
          } : {};
          
          // DEBUG: Allow cards to show even with low opacity for visibility testing
          // if (cardEntrance.opacity === 0) return null;
          
          const accentColor = getAccentColor(i);
          
          return (
            <div
              key={i}
              style={{
                opacity: Math.max(0.3, cardEntrance.opacity * opacity), // DEBUG: Min opacity for visibility!
                transform: `scale(${cardEntrance.scale * emphasisScale.scale})`,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                zIndex: isEmphasized ? 50 : 30
              }}
            >
              {/* Sketch-style card (notebook aesthetic!) */}
              <div
                className="card-sketch"
                style={{
                  padding: layout.padding,
                  backgroundColor: colors.cardBg,
                  borderRadius: '1.2rem',
                  border: `2px solid ${colors.cardBorder}`,
                  boxShadow: isEmphasized 
                    ? `0 0 ${emphasis.glowIntensity}px ${getAccentColor(i)}80, 6px 6px 0 rgba(0, 0, 0, 0.12)`
                    : '6px 6px 0 rgba(0, 0, 0, 0.12), 1px 1px 0 rgba(0, 0, 0, 0.06)', // Sketch shadow!
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div className="flex items-center gap-6">
                  {/* Icon Badge - Circular design using Tailwind */}
                  <div 
                    className="relative flex-shrink-0 rounded-full flex items-center justify-center"
                    style={{ 
                      width: layout.iconSize,
                      height: layout.iconSize,
                      minWidth: layout.iconSize,
                      minHeight: layout.iconSize,
                      background: `linear-gradient(135deg, ${accentColor}DD 0%, ${accentColor}AA 100%)`,
                      boxShadow: `0 8px 24px ${accentColor}40, inset 0 2px 4px rgba(255, 255, 255, 0.2)`,
                      border: `3px solid ${accentColor}`,
                      opacity: iconPop.opacity,
                      transform: `scale(${iconPop.scale}) rotate(${iconPop.rotation}deg)`
                    }}
                  >
                    <div 
                      className="text-center"
                      style={{ 
                        fontSize: layout.iconSize * 0.45,
                        lineHeight: 1
                      }}
                    >
                      {takeaway.icon || (i + 1)}
                    </div>
                    
                    {/* Checkmark overlay (Lottie or emoji) */}
                    {visual.showCheckmarks && cardEntrance.scale > 0.9 && (
                      <div 
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ opacity: iconPop.opacity }}
                      >
                        {visual.checkmarkStyle === 'lottie' ? (
                          <div style={{ width: layout.iconSize * 0.4, height: layout.iconSize * 0.4 }}>
                            <AnimatedLottie
                              animationData={getLottiePreset(visual.lottiePreset)?.data}
                              loop={false}
                              autoplay
                            />
                          </div>
                        ) : (
                          <div style={{ fontSize: layout.iconSize * 0.25 }}>✓</div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Takeaway text - Using Tailwind for responsiveness */}
                  <div 
                    className="flex-1 leading-snug"
                    style={{ 
                      fontSize: Math.min(fonts.size_takeaway, 28), // Smaller for notebook
                      fontWeight: fonts.weight_takeaway,
                      fontFamily: fontTokens.body.family,
                      color: colors.text,
                      textAlign: typography.align,
                      lineHeight: fonts.line_height_takeaway
                    }}
                  >
                    {takeaway.text}
                  </div>
                </div>
              </div>
              
              {/* Particle burst positioned at card center */}
              {burstParticles.length > 0 && (
                <div style={{ position: 'absolute', left: layout.iconSize / 2, top: '50%' }}>
                  {renderParticleBurst(burstParticles, 0, 0)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Required exports
export const getDuration = (scene, fps) => {
  const beats = { ...DEFAULT_CONFIG.beats, ...(scene?.beats || {}) };
  const takeaways = scene?.takeaways || DEFAULT_CONFIG.takeaways;
  const dynamicDuration = beats.firstTakeaway + (beats.takeawayInterval * takeaways.length) + 3.0;
  return toFrames(Math.max(beats.exit, dynamicDuration) + 1.5, fps);
};

export const TEMPLATE_VERSION = '6.0-BROADCAST';
Reflect4AKeyTakeaways.TEMPLATE_VERSION = '6.0-BROADCAST'; // Attach to component
export const TEMPLATE_ID = 'Reflect4AKeyTakeaways';
Reflect4AKeyTakeaways.TEMPLATE_ID = 'Reflect4AKeyTakeaways';

export const LEARNING_INTENTIONS = {
  primary: ['BREAKDOWN'],
  secondary: ['GUIDE', 'REVEAL'],
  tags: ['summary', 'reflection', 'key-points', 'review', 'takeaways']
};

export const CAPABILITIES = {
  dynamicTakeaways: true,
  maxTakeaways: 8,
  minTakeaways: 2,
  usesGlass: true,
  usesParticles: true,
  usesLottie: true,
  supportsEmphasis: true,
  broadcastQuality: true
};

export const CONFIG_SCHEMA = {
  title: { 
    text: { type: 'text', label: 'Title', default: 'Key Takeaways' },
    offset: { 
      y: { type: 'number', label: 'Title Offset Y', min: 60, max: 120, default: 80 }
    }
  },
  
  subtitle: {
    enabled: { type: 'checkbox', label: 'Show Subtitle', default: false },
    text: { type: 'text', label: 'Subtitle Text', default: 'What you need to remember' }
  },
  
  takeaways: {
    type: 'array',
    label: 'Takeaways',
    min: 2,
    max: 8,
    itemSchema: {
      text: { type: 'textarea', label: 'Takeaway Text', required: true },
      icon: { type: 'text', label: 'Icon (emoji)', default: '💡' },
      emphasize: {
        enabled: { type: 'checkbox', label: 'Enable Emphasis for VO', default: false },
        startTime: { type: 'number', label: 'Emphasis Start (s)', min: 0, max: 30, step: 0.5, default: 5.0 },
        duration: { type: 'number', label: 'Emphasis Duration (s)', min: 0.5, max: 5, step: 0.5, default: 2.0 }
      }
    }
  },
  
  visual: {
    cardStyle: { 
      type: 'select', 
      label: 'Card Style', 
      options: ['glassmorphic', 'solid', 'gradient', 'minimal'],
      default: 'glassmorphic'
    },
    badgeStyle: {
      type: 'select',
      label: 'Badge Style',
      options: ['circular', 'rounded-square', 'hexagon'],
      default: 'circular'
    },
    showCheckmarks: { type: 'checkbox', label: 'Show Checkmarks', default: true },
    checkmarkStyle: {
      type: 'select',
      label: 'Checkmark Style',
      options: ['lottie', 'emoji', 'icon'],
      default: 'lottie'
    },
    lottiePreset: {
      type: 'select',
      label: 'Lottie Animation',
      options: ['successCheck', 'celebrationCheck', 'sparkleCheck'],
      default: 'successCheck'
    }
  },
  
  effects: {
    particles: {
      enabled: { type: 'checkbox', label: 'Ambient Particles', default: true },
      count: { type: 'slider', label: 'Particle Count', min: 10, max: 50, default: 30 },
      opacity: { type: 'slider', label: 'Particle Opacity', min: 0, max: 1, step: 0.1, default: 0.3 }
    },
    spotlight: {
      enabled: { type: 'checkbox', label: 'Spotlight Effect', default: true },
      opacity: { type: 'slider', label: 'Spotlight Opacity', min: 0, max: 0.5, step: 0.05, default: 0.15 },
      size: { type: 'slider', label: 'Spotlight Size', min: 600, max: 1200, step: 100, default: 900 }
    },
    noiseTexture: {
      enabled: { type: 'checkbox', label: 'Film Grain', default: true },
      opacity: { type: 'slider', label: 'Grain Opacity', min: 0, max: 0.1, step: 0.01, default: 0.03 }
    },
    cardGlow: {
      enabled: { type: 'checkbox', label: 'Card Glow on Entrance', default: true },
      intensity: { type: 'slider', label: 'Glow Intensity', min: 10, max: 50, default: 25 }
    }
  },
  
  emphasis: {
    enabled: { type: 'checkbox', label: 'Enable Emphasis System', default: true },
    style: {
      type: 'select',
      label: 'Emphasis Style',
      options: ['scale-glow', 'spotlight', 'pulse'],
      default: 'scale-glow'
    },
    scaleAmount: { type: 'slider', label: 'Scale Amount', min: 1.0, max: 1.3, step: 0.02, default: 1.08 },
    glowIntensity: { type: 'slider', label: 'Glow Intensity', min: 10, max: 60, default: 30 }
  },
  
  layout: {
    cardWidth: { type: 'slider', label: 'Card Width', min: 800, max: 1400, step: 50, default: 1100 },
    cardGap: { type: 'slider', label: 'Gap Between Cards', min: 16, max: 64, step: 8, default: 32 },
    iconSize: { type: 'slider', label: 'Icon Size', min: 60, max: 120, step: 10, default: 80 },
    padding: { type: 'slider', label: 'Card Padding', min: 20, max: 48, step: 4, default: 32 }
  },
  
  typography: {
    voice: { 
      type: 'select', 
      label: 'Font Voice', 
      options: ['notebook', 'story', 'utility'],
      default: 'utility'
    },
    align: { 
      type: 'select', 
      label: 'Text Align', 
      options: ['left', 'center', 'right'],
      default: 'left'
    },
    transform: { 
      type: 'select', 
      label: 'Text Transform', 
      options: ['none', 'uppercase', 'lowercase', 'capitalize'],
      default: 'none'
    }
  },
  
  animation: {
    cardEntrance: {
      type: 'select',
      label: 'Card Entrance Style',
      options: ['spring-bounce', 'slide-up', 'fade-scale'],
      default: 'spring-bounce'
    },
    iconPop: {
      type: 'select',
      label: 'Icon Animation',
      options: ['bounce', 'spin', 'pulse'],
      default: 'bounce'
    },
    particleBurst: { type: 'checkbox', label: 'Particle Burst on Reveal', default: true }
  },
  
  beats: {
    firstTakeaway: { type: 'number', label: 'First Takeaway (s)', min: 1, max: 5, step: 0.5, default: 2.5 },
    takeawayInterval: { type: 'number', label: 'Interval Between Takeaways (s)', min: 0.5, max: 5, step: 0.5, default: 2.5 },
    hold: { type: 'number', label: 'Hold Duration (s)', min: 5, max: 30, default: 14.0 },
    exit: { type: 'number', label: 'Exit Time (s)', min: 8, max: 40, default: 16.0 }
  },
  
  transition: {
    exit: {
      style: { 
        type: 'select', 
        label: 'Exit Style', 
        options: ['none', 'fade', 'slide', 'wipe'],
        default: 'fade'
      },
      durationInFrames: { type: 'number', label: 'Exit Duration (frames)', min: 6, max: 60, default: 24 }
    }
  }
};

export default Reflect4AKeyTakeaways;
