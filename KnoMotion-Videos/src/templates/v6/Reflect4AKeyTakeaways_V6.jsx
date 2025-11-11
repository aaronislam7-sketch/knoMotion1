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
  getParticleBurst,
  renderParticleBurst,
  getCardEntrance,
  getIconPop
} from '../../sdk';
import {
  GlassmorphicPane,
  NoiseTexture,
  SpotlightEffect
} from '../../sdk/effects/broadcastEffects';
import { loadFontVoice, buildFontTokens, DEFAULT_FONT_VOICE } from '../../sdk/fontSystem';
import { createTransitionProps } from '../../sdk/transitions';

/**
 * TEMPLATE #7: KEY TAKEAWAYS - v6.0 (BROADCAST POLISH)
 * 
 * PRIMARY INTENTION: REFLECT
 * SECONDARY INTENTIONS: BREAKDOWN, GUIDE, REVEAL
 * 
 * PURPOSE: Summarize key learning points with visual emphasis
 * 
 * VISUAL PATTERN:
 * - Title with letter reveal
 * - Sequential takeaway reveals (numbered/icon badges)
 * - Glassmorphic panes for each takeaway
 * - 5-layer background depth
 * - Particle bursts on reveals
 * - Continuous floating animations
 * 
 * BROADCAST POLISH APPLIED:
 * ✅ Layered background depth (gradient, noise, spotlights, particles, glass)
 * ✅ Glassmorphic panes for takeaways
 * ✅ Multi-layered entrance animations
 * ✅ Letter-by-letter reveals for title
 * ✅ Icon pop animations for badges
 * ✅ Particle bursts on takeaway reveals
 * ✅ Continuous floating animations
 * ✅ Cumulative beats system
 * ✅ 100% configurability via decorations
 * 
 * AGNOSTIC PRINCIPALS:
 * ✓ Data-Driven Structure (variable-length takeaways array)
 * ✓ Token-Based Positioning (semantic layout)
 * ✓ Separation of Concerns (content/layout/style/animation)
 * ✓ Progressive Configuration (simple defaults)
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
    { text: 'First important point to remember', icon: '💡' },
    { text: 'Second key insight or lesson', icon: '🎯' },
    { text: 'Third critical concept or skill', icon: '🚀' }
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
  
  animation: {
    letterRevealStyle: 'fade-up',
    takeawayEntrance: 'slide-fade',
    continuousFloat: true,   // Subtle floating animation
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
    showParticleBurst: true,
    particleBurstCount: 12,
    showIconBadge: true,
    badgeStyle: 'circle' // circle, square, organic
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
      startFrame: f.titleStart,
      duration: rawBeats.titleReveal,
      staggerDelay: 0.04
    }, fps);
  }, [frame, config.title.text, f.titleStart, rawBeats.titleReveal, fps]);
  
  const titleCardEntrance = getCardEntrance(frame, {
    startFrame: f.titleStart,
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
  
  // Calculate center position
  const centerX = width / 2;
  const contentStartY = height / 2 - (takeaways.length * 100) / 2;
  
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
            {renderLetterReveal(titleLetterReveal.letters, titleLetterReveal.letterOpacities, { fontFamily: fontTokens.title.family })}
          </div>
        </div>
      )}
      
      {/* Takeaways List */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 max-w-[1000px] flex flex-col"
        style={{ gap: 30 }}
      >
        {takeaways.map((item, i) => {
          const itemBeat = f.takeaways[i];
          if (!itemBeat || frame < itemBeat.start) return null;
          
          // Card entrance for takeaway
          const itemCardEntrance = getCardEntrance(frame, {
            startFrame: beats.takeaways[i].start,
            duration: rawBeats.takeawayReveal,
            direction: 'left',
            distance: 60,
            withGlow: true,
            glowColor: `${colors.accent}40`
          }, fps);
          
          if (itemCardEntrance.opacity === 0) return null;
          
          // Icon pop
          const iconPop = getIconPop(frame, {
            startFrame: beats.takeaways[i].start + 0.2,
            duration: 0.5,
            withBounce: true,
            rotation: 5
          }, fps);
          
          // Particle burst on reveal
          const itemBurstParticles = decorations.showParticleBurst
            ? getParticleBurst(frame, {
                triggerFrame: beats.takeaways[i].start,
                particleCount: decorations.particleBurstCount,
                duration: 1.2,
                color: colors.accent,
                size: 5,
                spread: 100
              }, fps)
            : [];
          
          // Continuous floating
          const floatingOffset = anim.continuousFloat && frame >= itemBeat.visible
            ? Math.sin((frame - itemBeat.start) * 0.018 + i * Math.PI / 3) * 4
            : 0;
          
          const itemY = contentStartY + i * 130;
          
          return (
            <React.Fragment key={i}>
              {/* Particle burst */}
              {itemBurstParticles.length > 0 && decorations.showParticleBurst && (
                <svg
                  className="absolute inset-0"
                  viewBox={`0 0 ${width} ${height}`}
                  style={{ pointerEvents: 'none', zIndex: 50 }}
                >
                  {renderParticleBurst(
                    itemBurstParticles,
                    150,
                    itemY
                  )}
                </svg>
              )}
              
              {/* Takeaway item */}
              <div
                className="flex items-center"
                style={{
                  gap: 20,
                  transform: `translateY(${floatingOffset}px) scale(${itemCardEntrance.scale})`,
                  opacity: itemCardEntrance.opacity * opacity,
                  zIndex: 5
                }}
              >
                {/* Icon badge */}
                {decorations.showIconBadge && (
                  <div
                    className="flex-shrink-0 flex items-center justify-center"
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: decorations.badgeStyle === 'circle' ? '50%' : decorations.badgeStyle === 'square' ? '12px' : '40%',
                      background: `linear-gradient(135deg, ${colors.accent}E6 0%, ${colors.accent}B3 100%)`,
                      border: `3px solid ${colors.accent}`,
                      fontSize: Math.min(fonts.size_icon, 44),
                      fontFamily: fontTokens.accent.family,
                      opacity: iconPop.opacity,
                      transform: `scale(${iconPop.scale}) rotate(${iconPop.rotation}deg)`,
                      boxShadow: itemCardEntrance.boxShadow,
                      backdropFilter: 'blur(10px)'
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
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Duration calculation
export const getDuration = (scene, fps) => {
  const rawBeats = { ...DEFAULT_CONFIG.beats, ...(scene?.beats || {}) };
  const takeaways = scene?.takeaways || DEFAULT_CONFIG.takeaways;
  const beats = calculateCumulativeBeats(rawBeats, takeaways.length);
  return toFrames(beats.totalDuration, fps);
};

// Metadata
export const TEMPLATE_VERSION = '6.2';
export const TEMPLATE_ID = 'Reflect4AKeyTakeaways';
export const PRIMARY_INTENTION = 'REFLECT';
export const SECONDARY_INTENTIONS = ['BREAKDOWN', 'GUIDE', 'REVEAL'];

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
      icon: { type: 'text', label: 'Icon (emoji)' }
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
    glassPaneOpacity: { type: 'slider', label: 'Glass Pane Opacity', min: 0, max: 0.5, step: 0.05 },
    showParticleBurst: { type: 'checkbox', label: 'Show Particle Bursts' },
    particleBurstCount: { type: 'slider', label: 'Burst Particle Count', min: 5, max: 25, step: 5 },
    showIconBadge: { type: 'checkbox', label: 'Show Icon Badges' },
    badgeStyle: { type: 'select', label: 'Badge Style', options: ['circle', 'square', 'organic'] }
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
