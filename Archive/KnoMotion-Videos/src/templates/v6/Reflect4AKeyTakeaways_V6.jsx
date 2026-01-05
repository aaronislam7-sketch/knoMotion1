import React, { useEffect, useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import { RemotionLottie as Player } from '../../sdk/lottie/lottieIntegration'; // Updated: using @remotion/lottie

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
 * TEMPLATE #7: KEY TAKEAWAYS - v6.4 (MODAL SHOWCASE)
 * 
 * PRIMARY INTENTION: REFLECT
 * SECONDARY INTENTIONS: BREAKDOWN, GUIDE, REVEAL
 * 
 * PURPOSE: Modal-style showcase with optional Lottie animations per point
 * 
 * FLOW:
 * 1. Title reveal (1.8s)
 * 2. Modal showcase #1: Background dims (85% black overlay), Lottie plays if provided, card centered (2.5s hold)
 * 3. Transition: Overlay fades out, card moves to list position (0.6s)
 * 4. Modal showcase #2: Repeat pattern (2.5s hold)
 * 5. Transition: Card moves to list position (0.6s)
 * 6. Modal showcase #3: Repeat pattern (2.5s hold)
 * 7. Transition: Card moves to list position (0.6s)
 * 8. Final list: All 3 visible, continuous breathing/floating (3s)
 * 9. Exit (1s)
 * 
 * VISUAL PATTERN:
 * - Modal overlay dims background during showcase (85% opacity black)
 * - Optional Lottie animation plays above card (200px × 200px)
 * - Uniform card sizing (no size variation between showcase and list)
 * - Smooth transitions with easing
 * - Final state: vertical list with subtle life animations
 * 
 * POLISH APPLIED:
 * ✅ Modal-style focus (background dims 85%)
 * ✅ Lottie animation support per takeaway (optional)
 * ✅ Uniform card sizing (no showcase size multipliers)
 * ✅ Mid-scene transitions with fade timing
 * ✅ Continuous life in final state
 * ✅ 60fps optimized (willChange hints)
 * ✅ Fully configurable (overlay opacity, Lottie size, card scale)
 * 
 * NEW CONFIG OPTIONS:
 * - takeaways[].lottieUrl: Optional Lottie JSON URL
 * - layout.cardScale: Uniform scale for all cards (default 1.0)
 * - layout.lottieSize: Size of Lottie placeholder (default 200)
 * - decorations.modalOverlayOpacity: Modal darkness 0-1 (default 0.85)
 * - decorations.showLottieAnimation: Toggle Lottie display (default true)
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
    { text: 'First important point to remember', icon: '💡', importance: 1, lottieUrl: null },
    { text: 'Second key insight or lesson', icon: '🎯', importance: 2, lottieUrl: null },
    { text: 'Third critical concept or skill', icon: '🚀', importance: 1, lottieUrl: null }
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
    // SHOWCASE FLOW TIMING
    entrance: 0.5,              // Initial background fade
    titleReveal: 0.8,           // Title letter reveal
    titleHold: 0.5,             // Hold title
    showcaseReveal: 0.8,        // Per-item showcase reveal (large, centered)
    showcaseHold: 2.5,          // Hold each showcase moment
    showcaseToList: 0.6,        // Transition from showcase to list position
    listInterval: 0.3,          // Gap between list transitions
    finalHold: 3.0,             // Hold final list state
    exit: 0.8                   // Exit animation
  },
  
  layout: {
    verticalSpacing: 120,    // Vertical gap between items in final list
    itemWidth: 900,          // Width of each takeaway card (uniform sizing)
    cardScale: 1.0,          // Uniform scale for all cards (no size variation)
    emphasisScaleMultiplier: 1.0,  // No longer used (uniform sizing)
    lottieSize: 200          // Size of Lottie animation placeholder (width/height)
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
    showEmphasisGlow: true,      // Persistent glow on importance:2 items
    modalOverlayOpacity: 0.85,   // Opacity of modal overlay during showcase (0-1)
    showLottieAnimation: true    // Enable Lottie animations if provided
  },
  
  transition: {
    exit: {
      style: 'fade',
      durationInFrames: 18,
      easing: 'smooth'
    }
  }
};

// Calculate cumulative beats for showcase flow
const calculateCumulativeBeats = (beats, takeawayCount) => {
  let cumulative = 0;
  const result = {
    entrance: cumulative,
    titleStart: (cumulative += beats.entrance),
    titleVisible: (cumulative += beats.titleReveal),
    titleEnd: (cumulative += beats.titleHold),
    takeaways: []
  };
  
  // Each takeaway: showcase (large) → hold → shrink to list
  for (let i = 0; i < takeawayCount; i++) {
    const showcaseStart = cumulative;
    const showcaseVisible = cumulative + beats.showcaseReveal;
    const showcaseEnd = showcaseVisible + beats.showcaseHold;
    const listStart = showcaseEnd;
    const listVisible = listStart + beats.showcaseToList;
    
    result.takeaways.push({
      showcaseStart,
      showcaseVisible,
      showcaseEnd,
      listStart,
      listVisible
    });
    
    cumulative = listVisible + beats.listInterval;
  }
  
  result.finalListStart = cumulative - beats.listInterval;
  result.exitStart = (cumulative += beats.finalHold);
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
  
  // Convert beats to frames (showcase flow structure)
  const f = useMemo(() => ({
    entrance: toFrames(beats.entrance, fps),
    titleStart: toFrames(beats.titleStart, fps),
    titleVisible: toFrames(beats.titleVisible, fps),
    titleEnd: toFrames(beats.titleEnd, fps),
    takeaways: beats.takeaways.map(t => ({
      showcaseStart: toFrames(t.showcaseStart, fps),
      showcaseVisible: toFrames(t.showcaseVisible, fps),
      showcaseEnd: toFrames(t.showcaseEnd, fps),
      listStart: toFrames(t.listStart, fps),
      listVisible: toFrames(t.listVisible, fps)
    })),
    finalListStart: toFrames(beats.finalListStart, fps),
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
  
  // Layout calculations
  const centerX = width / 2;
  const centerY = height / 2;
  const listStartY = centerY - (takeaways.length * layout.verticalSpacing) / 2;
  
  // Determine current phase
  const currentPhase = useMemo(() => {
    if (frame < f.titleEnd) return 'title';
    if (frame < f.finalListStart) return 'showcase';
    if (frame < f.exitStart) return 'finalList';
    return 'exit';
  }, [frame, f.titleEnd, f.finalListStart, f.exitStart]);
  
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
      
      {/* Modal Overlay - dims background during showcase */}
      {takeaways.map((item, i) => {
        const itemBeat = f.takeaways[i];
        if (!itemBeat) return null;
        
        const isShowcase = frame >= itemBeat.showcaseStart && frame < itemBeat.listStart;
        
        if (!isShowcase) return null;
        
        // Fade in/out modal overlay
        const modalFadeIn = Math.min(1, (frame - itemBeat.showcaseStart) / toFrames(0.4, fps));
        const modalFadeOut = frame >= itemBeat.listStart - toFrames(0.3, fps)
          ? Math.max(0, 1 - (frame - (itemBeat.listStart - toFrames(0.3, fps))) / toFrames(0.3, fps))
          : 1;
        const modalOpacity = modalFadeIn * modalFadeOut * decorations.modalOverlayOpacity;
        
        return (
          <div
            key={`modal-${i}`}
            className="absolute inset-0"
            style={{
              backgroundColor: '#000000',
              opacity: modalOpacity,
              zIndex: 15,
              pointerEvents: 'none'
            }}
          />
        );
      })}

      {/* Takeaways - Showcase Flow */}
      {takeaways.map((item, i) => {
        const itemBeat = f.takeaways[i];
        if (!itemBeat || frame < itemBeat.showcaseStart) return null;
        
        const importance = item.importance || 1;
        const baseScale = layout.cardScale;  // Uniform sizing
        
        // Determine item state
        const isShowcase = frame >= itemBeat.showcaseStart && frame < itemBeat.listStart;
        const isTransitioning = frame >= itemBeat.listStart && frame < itemBeat.listVisible;
        const isInList = frame >= itemBeat.listVisible;
        
        // Showcase reveal (large, centered)
        // Note: itemBeat values are already in frames from f object
        const showcaseProgress = Math.min(1, Math.max(0, 
          (frame - itemBeat.showcaseStart) / toFrames(rawBeats.showcaseReveal, fps)
        ));
        
        // Transition to list (shrink + move)
        const transitionProgress = isTransitioning
          ? interpolate(
              frame,
              [itemBeat.listStart, itemBeat.listVisible],
              [0, 1],
              { extrapolateRight: 'clamp', easing: EZ.power3InOut }
            )
          : isInList ? 1 : 0;
        
        // Calculate position
        const showcaseY = centerY;
        const listY = listStartY + (i * layout.verticalSpacing);
        const currentY = isShowcase ? showcaseY : showcaseY + (listY - showcaseY) * transitionProgress;
        
        // Uniform scale (no size changes between showcase and list)
        const currentScale = baseScale;
        
        // Icon pop
        const iconPop = getIconPop(frame, {
          startFrame: itemBeat.showcaseStart,
          duration: 0.6,
          withBounce: true,
          rotation: 0
        }, fps);
        
        // Continuous life (only in final list state)
        const inFinalList = frame >= f.finalListStart && exitProgress < 0.1;
        const continuousLife = getContinuousLife(frame, {
          startFrame: f.finalListStart,
          breathingFrequency: anim.breathingFrequency,
          breathingAmplitude: anim.breathingAmplitude * 0.5,
          floatingFrequency: anim.floatingFrequency,
          floatingAmplitude: anim.floatingAmplitude * 0.7,
          phaseOffset: i * (Math.PI / 3),
          enabled: inFinalList && (anim.continuousBreathing || anim.continuousFloating)
        });
        
        // Emphasis glow
        const emphasisGlow = importance === 2 && decorations.showEmphasisGlow && inFinalList
          ? `0 0 15px ${colors.accent}50, 0 0 30px ${colors.accent}20`
          : 'none';
        
        // Apply easing to showcase reveal (cubic out)
        const easedShowcaseProgress = showcaseProgress * showcaseProgress * (3 - 2 * showcaseProgress); // smoothstep
        const itemOpacity = easedShowcaseProgress * opacity;
        
        // Lottie animation (if provided)
        const hasLottie = item.lottieUrl && decorations.showLottieAnimation;
        const lottieOpacity = isShowcase ? itemOpacity : 0;  // Only show in showcase
        
        return (
          <React.Fragment key={i}>
            {/* Lottie Animation - Modal Style */}
            {hasLottie && isShowcase && (
              <div
                className="absolute left-1/2"
                style={{
                  top: centerY - layout.lottieSize - 80,
                  transform: 'translateX(-50%)',
                  width: layout.lottieSize,
                  height: layout.lottieSize,
                  opacity: lottieOpacity,
                  zIndex: 25,
                  pointerEvents: 'none'
                }}
              >
                <Player
                  autoplay
                  loop
                  src={item.lottieUrl}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            )}
            
            {/* Takeaway Card */}
            <div
              className="absolute left-1/2 flex items-center"
              style={{
                top: currentY,
                transform: `translate(-50%, -50%) translateY(${continuousLife.y}px) scale(${currentScale * continuousLife.scale})`,
                opacity: itemOpacity,
                width: layout.itemWidth,  // Uniform width
                gap: 24,
                willChange: 'transform, opacity',
                zIndex: isShowcase ? 20 : 5
              }}
            >
                {/* Icon badge */}
            {decorations.showIconBadge && (
              <div
                className="flex-shrink-0 flex items-center justify-center"
                style={{
                  width: 70,  // Uniform size
                  height: 70, // Uniform size
                  borderRadius: decorations.badgeStyle === 'circle' ? '50%' : '12px',
                  background: `linear-gradient(135deg, ${colors.accent}E6 0%, ${colors.accent}B3 100%)`,
                  border: `4px solid ${colors.accent}`,
                  fontSize: Math.min(fonts.size_icon, 44),  // Uniform size
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
                    padding={24}  // Uniform padding
                    style={{
                      boxShadow: isShowcase ? `0 8px 24px ${colors.accent}30` : 'none'
                    }}
                  >
                    <div
                      className="leading-snug"
                      style={{
                        fontSize: Math.min(fonts.size_takeaway, 28),  // Uniform size
                        fontWeight: fonts.weight_takeaway,  // Uniform weight
                        fontFamily: fontTokens.body.family,
                        color: colors.text,
                        textAlign: typography.align,
                        lineHeight: 1.5,
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
                      fontSize: Math.min(fonts.size_takeaway, 28),  // Uniform size
                      fontWeight: fonts.weight_takeaway,  // Uniform weight
                      fontFamily: fontTokens.body.family,
                      color: colors.text,
                      textAlign: typography.align,
                      lineHeight: 1.5,
                      padding: 20,  // Uniform padding
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
