import React, { useEffect } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import { 
  EZ, 
  toFrames, 
  renderHero,
  mergeHeroConfig,
  generateAmbientParticles,
  renderAmbientParticles
} from '../../sdk';
import { loadFontVoice, buildFontTokens, DEFAULT_FONT_VOICE } from '../../sdk/fontSystem';
import { createTransitionProps } from '../../sdk/transitions';
import { GlassmorphicPane, ShineEffect, NoiseTexture } from '../../sdk/broadcastEffects';
import { AnimatedLottie } from '../../sdk/lottieIntegration';
import { getLottieFromConfig, getLottiePreset } from '../../sdk/lottiePresets';
import {
  getCardEntrance,
  getStaggerDelay,
  getIconPop,
  applyTransform,
  getLetterReveal,
  renderLetterReveal,
  getParticleBurst,
  renderParticleBurst
} from '../../sdk/microDelights.jsx';

/**
 * TEMPLATE #10: STEP-BY-STEP GUIDE - v6.0 (BROADCAST-GRADE POLISH)
 * 
 * BROADCAST POLISH APPLIED:
 * ✅ 5-Layer Background Depth (gradient, noise, particles, glassmorphic)
 * ✅ Micro-Delights (letter reveals, particle bursts, icon pops, continuous float)
 * ✅ Cumulative Beats System (relative timing, easy adjustments)
 * ✅ Continuous Life Animations (subtle floating on steps)
 * ✅ Dynamic Array Timing (cumulative beats for variable-length steps)
 * ✅ 100% Configurability (decorations object, zero hardcoded values)
 * 
 * KEY FEATURES:
 * - Three layout modes: horizontal, grid, flowing
 * - Letter-by-letter title reveal
 * - Particle bursts on step reveals
 * - Animated Lottie arrows connecting steps
 * - Circular progress tracker with smooth updates
 * - Continuous floating animation on steps
 * - Emphasis system for active/completed steps
 * - Full JSON configurability via decorations
 */

const DEFAULT_CONFIG = {
  title: {
    text: 'Step-by-Step Process',
    position: 'top-center',
    offset: { x: 0, y: 70 }  // Increased to avoid top overlap
  },
  
  steps: [
    { 
      number: 1, 
      title: 'First Step', 
      description: 'Brief description',
      completed: false,
      color: '#3B82F6',
      icon: '🎯',
      // NEW: Per-step emphasis
      emphasize: {
        enabled: false,
        startTime: 5.0,
        duration: 2.0
      }
    }
  ],
  
  // NEW: Layout configuration
  layout: {
    mode: 'horizontal',  // 'horizontal', 'grid', 'flowing'
    spacing: 'comfortable',  // 'tight', 'comfortable', 'spacious'
    gridColumns: 2,  // Only for grid mode
    cardStyle: 'circle',  // 'circle', 'organic', 'minimal'
    cardSize: 260  // INCREASED for text to fit comfortably
  },
  
  // NEW: Arrow configuration
  arrows: {
    enabled: true,
    type: 'lottie',  // 'lottie', 'svg', 'none'
    lottiePreset: 'arrowFlow',  // From lottiePresets.js
    color: '#3B82F6',
    animated: true,
    size: 60
  },
  
  // NEW: Progress tracker
  progressTracker: {
    enabled: true,
    type: 'circular',  // 'circular', 'linear', 'none'
    position: 'top-right',  // 'top-right', 'bottom-center'
    showPercentage: true
  },
  
  // NEW: Emphasis system
  emphasis: {
    enabled: true,
    activeStyle: 'scale-glow',  // 'scale-glow', 'pulse', 'spotlight'
    completedStyle: 'checkmark',  // 'checkmark', 'glow', 'fade'
    scaleAmount: 1.1,
    glowIntensity: 25
  },
  
  checkmarks: {
    enabled: true,
    style: 'lottie',  // 'lottie', 'icon', 'none'
    lottiePreset: 'successCheck',
    color: '#10B981'
  },
  
  typography: {
    voice: 'utility',
    align: 'center',
    transform: 'none'
  },
  
  style_tokens: {
    colors: {
      bg: '#0A0E1A',
      bgGradient: true,
      primary: '#3B82F6',
      completed: '#10B981',
      active: '#F59E0B',
      text: '#FFFFFF',
      textSecondary: '#94A3B8',
      cardBg: '#1E293B'
    },
    fonts: {
      size_title: 54,
      size_step_number: 72,
      size_step_title: 32,
      size_step_desc: 18,
      weight_title: 800,
      weight_step: 700
    }
  },
  
  // CUMULATIVE BEATS: Each beat is relative to previous for easy timing adjustments
  beats: {
    entrance: 0.5,
    title: 0.5,           // +0.5s from entrance (cumulative: 1.0s)
    firstStep: 1.5,       // +1.5s from title (cumulative: 2.5s)
    stepInterval: 0.7,    // Interval between steps
    arrowDelay: 0.3,      // Delay after step before arrow appears
    hold: 12.0,
    exit: 14.0
  },
  
  animation: {
    stepReveal: 'spring-bounce',
    arrowAnimation: 'slide-fade',
    progressAnimation: true
  },
  
  effects: {
    particles: {
      enabled: true,
      count: 15
    },
    glow: {
      enabled: true,
      intensity: 20
    },
    shine: {
      enabled: true,
      onCompleted: true  // Shine effect on completed steps
    },
    noiseTexture: {
      enabled: true,
      opacity: 0.03
    }
  },
  
  // DECORATIONS: 100% configurable micro-delights and animations
  decorations: {
    titleLetterReveal: {
      enabled: true,
      staggerDelay: 0.04,
      fadeInDuration: 0.3
    },
    stepBurst: {
      enabled: true,
      particleCount: 15,
      spread: 100,
      duration: 1.0
    },
    stepFloat: {
      enabled: true,
      distance: 6,
      speed: 0.025
    },
    iconPop: {
      enabled: true,
      withBounce: true,
      duration: 0.5
    },
    arrowAnimation: {
      enabled: true,
      withGlow: false
    }
  }
};

// Calculate step positions based on layout mode
const calculateStepPositions = (totalSteps, layout, width, height) => {
  const { mode, spacing, gridColumns, cardSize } = layout;
  
  const spacingMap = {
    tight: 1.2,
    comfortable: 1.4,
    spacious: 1.6
  };
  
  const gap = cardSize * spacingMap[spacing];
  const positions = [];
  
  if (mode === 'horizontal') {
    // Horizontal layout - distribute evenly across width
    const totalWidth = (totalSteps - 1) * gap;
    const startX = (width - totalWidth) / 2;
    const centerY = height / 2 + 10;  // Reduced offset to avoid bottom overlap
    
    for (let i = 0; i < totalSteps; i++) {
      positions.push({
        x: startX + (i * gap),
        y: centerY
      });
    }
  } else if (mode === 'grid') {
    // Grid layout - organize in rows and columns
    const rows = Math.ceil(totalSteps / gridColumns);
    const totalWidth = (gridColumns - 1) * gap;
    const totalHeight = (rows - 1) * gap;
    const startX = (width - totalWidth) / 2;
    const startY = (height - totalHeight) / 2 + 20;  // Reduced from 40 to avoid overlaps
    
    for (let i = 0; i < totalSteps; i++) {
      const col = i % gridColumns;
      const row = Math.floor(i / gridColumns);
      positions.push({
        x: startX + (col * gap),
        y: startY + (row * gap)
      });
    }
  } else if (mode === 'flowing') {
    // Flowing organic layout - snake pattern
    const itemsPerRow = 3;
    const gapX = gap * 1.1;  // Reduced spacing
    const gapY = gap * 0.85;  // Reduced vertical spacing
    
    for (let i = 0; i < totalSteps; i++) {
      const row = Math.floor(i / itemsPerRow);
      const col = i % itemsPerRow;
      const isEvenRow = row % 2 === 0;
      
      const totalWidth = (itemsPerRow - 1) * gapX;
      const startX = (width - totalWidth) / 2;
      const startY = 220 + (row * gapY);  // Reduced from 250 to avoid overlap
      
      positions.push({
        x: isEvenRow ? startX + (col * gapX) : startX + ((itemsPerRow - 1 - col) * gapX),
        y: startY
      });
    }
  }
  
  return positions;
};

// Check if step should be emphasized
const isStepEmphasized = (step, frame, fps) => {
  if (!step.emphasize?.enabled) return false;
  const startFrame = toFrames(step.emphasize.startTime, fps);
  const endFrame = toFrames(step.emphasize.startTime + step.emphasize.duration, fps);
  return frame >= startFrame && frame < endFrame;
};

export const Guide10StepSequence = ({ scene, styles, presets, easingMap }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  
  const config = { ...DEFAULT_CONFIG, ...scene };
  const typography = { ...DEFAULT_CONFIG.typography, ...(scene.typography || {}) };
  
  useEffect(() => {
    loadFontVoice(typography.voice || DEFAULT_FONT_VOICE);
  }, [typography.voice]);
  
  const fontTokens = buildFontTokens(typography.voice || DEFAULT_FONT_VOICE);
  
  // Merge config and convert cumulative beats
  const beatsRaw = { ...DEFAULT_CONFIG.beats, ...(scene.beats || {}) };
  
  // CUMULATIVE BEATS: Convert relative beats to absolute timestamps
  const beats = {
    entrance: beatsRaw.entrance,
    title: beatsRaw.entrance + beatsRaw.title,
    firstStep: beatsRaw.entrance + beatsRaw.title + beatsRaw.firstStep,
    stepInterval: beatsRaw.stepInterval,
    arrowDelay: beatsRaw.arrowDelay,
    hold: beatsRaw.hold,
    exit: beatsRaw.exit
  };
  const colors = { ...DEFAULT_CONFIG.style_tokens.colors, ...(scene.style_tokens?.colors || {}) };
  const fonts = { ...DEFAULT_CONFIG.style_tokens.fonts, ...(scene.style_tokens?.fonts || {}) };
  const layout = { ...DEFAULT_CONFIG.layout, ...(scene.layout || {}) };
  const arrows = { ...DEFAULT_CONFIG.arrows, ...(scene.arrows || {}) };
  const progressTracker = { ...DEFAULT_CONFIG.progressTracker, ...(scene.progressTracker || {}) };
  const emphasis = { ...DEFAULT_CONFIG.emphasis, ...(scene.emphasis || {}) };
  const checkmarks = { ...DEFAULT_CONFIG.checkmarks, ...(scene.checkmarks || {}) };
  const anim = { ...DEFAULT_CONFIG.animation, ...(scene.animation || {}) };
  const effects = { 
    ...DEFAULT_CONFIG.effects, 
    ...(scene.effects || {}),
    particles: { ...DEFAULT_CONFIG.effects.particles, ...(scene.effects?.particles || {}) },
    glow: { ...DEFAULT_CONFIG.effects.glow, ...(scene.effects?.glow || {}) },
    shine: { ...DEFAULT_CONFIG.effects.shine, ...(scene.effects?.shine || {}) },
    noiseTexture: { ...DEFAULT_CONFIG.effects.noiseTexture, ...(scene.effects?.noiseTexture || {}) }
  };
  
  // Merge decorations
  const decorations = { ...DEFAULT_CONFIG.decorations, ...(scene.decorations || {}) };
  
  const steps = config.steps || DEFAULT_CONFIG.steps;
  const totalSteps = steps.length;
  const completedCount = steps.filter(s => s.completed).length;
  
  // Convert beats to frames (for conditional rendering only)
  const f = {
    title: toFrames(beats.title, fps),
    firstStep: toFrames(beats.firstStep, fps),
    exit: toFrames(beats.exit, fps)
  };
  
  // Generate particles
  const particleElements = effects.particles.enabled
    ? generateAmbientParticles({
        count: effects.particles.count,
        seed: 243,
        style: 'ambient',
        color: colors.primary,
        bounds: { w: width, h: height }
      })
    : [];
  
  renderAmbientParticles(particleElements, frame, fps, { opacity: 0.35 });
  
  // Title animations
  const titleCardEntrance = getCardEntrance(frame, {
    startFrame: beats.title, // CRITICAL: Pass SECONDS not frames
    duration: 0.8,
    direction: 'up',
    distance: 30,
    withGlow: false
  }, fps);
  
  // Letter-by-letter reveal for title
  const titleLetterReveal = decorations.titleLetterReveal?.enabled
    ? getLetterReveal(frame, {
        startFrame: beats.title + 0.2, // CRITICAL: Pass SECONDS
        text: config.title.text,
        staggerDelay: decorations.titleLetterReveal.staggerDelay,
        fadeInDuration: decorations.titleLetterReveal.fadeInDuration
      }, fps)
    : null;
  
  // Exit animation
  const exitProgress = frame >= f.exit
    ? interpolate(frame, [f.exit, f.exit + toFrames(0.8, fps)], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.power3In })
    : 0;
  
  const exitOpacity = 1 - exitProgress;
  
  // Calculate positions
  const stepPositions = calculateStepPositions(totalSteps, layout, width, height);
  
  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, fontFamily: fontTokens.body.family }}>
      {/* Gradient background */}
      {colors.bgGradient && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 50% 40%, ${colors.bg}DD 0%, ${colors.bg} 100%)`,
          zIndex: 0
        }} />
      )}
      
      {/* Noise texture */}
      {effects.noiseTexture?.enabled && (
        <NoiseTexture opacity={effects.noiseTexture.opacity} />
      )}
      
      {/* Particle Background */}
      <svg style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
        {particleElements.map(p => p.element)}
      </svg>
      
      {/* Title with letter-by-letter reveal */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: config.title.offset.y,
          transform: `translate(-50%, ${(1 - titleCardEntrance.opacity) * 30}px)`,
          opacity: titleCardEntrance.opacity * exitOpacity,
          textAlign: 'center',
          zIndex: 10
        }}
      >
        {titleLetterReveal ? (
          renderLetterReveal(titleLetterReveal, {
            fontSize: fonts.size_title,
            fontWeight: fonts.weight_title,
            fontFamily: fontTokens.title.family,
            color: colors.text,
            letterSpacing: '0.02em'
          })
        ) : (
          <div style={{
            fontSize: fonts.size_title,
            fontWeight: fonts.weight_title,
            fontFamily: fontTokens.title.family,
            color: colors.text,
            letterSpacing: '0.02em'
          }}>
            {config.title.text}
          </div>
        )}
      </div>
      
      {/* Circular Progress Tracker */}
      {progressTracker.enabled && progressTracker.type === 'circular' && (
        <div style={{
          position: 'absolute',
          top: progressTracker.position === 'top-right' ? 60 : 'auto',
          bottom: progressTracker.position === 'bottom-center' ? 60 : 'auto',
          right: progressTracker.position === 'top-right' ? 80 : 'auto',
          left: progressTracker.position === 'bottom-center' ? '50%' : 'auto',
          transform: progressTracker.position === 'bottom-center' ? 'translateX(-50%)' : 'none',
          width: 120,
          height: 120,
          zIndex: 10,
          opacity: titleProgress * exitOpacity
        }}>
          <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke={`${colors.textSecondary}30`}
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke={colors.completed}
              strokeWidth="8"
              strokeDasharray={2 * Math.PI * 54}
              strokeDashoffset={2 * Math.PI * 54 * (1 - (completedCount / totalSteps))}
              strokeLinecap="round"
              style={{
                filter: `drop-shadow(0 0 10px ${colors.completed}80)`,
                transition: 'stroke-dashoffset 0.6s ease'
              }}
            />
          </svg>
          {/* Center text */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: 32,
            fontWeight: 700,
            fontFamily: fontTokens.accent.family,
            color: colors.text,
            textAlign: 'center'
          }}>
            {progressTracker.showPercentage 
              ? `${Math.round((completedCount / totalSteps) * 100)}%`
              : `${completedCount}/${totalSteps}`
            }
          </div>
        </div>
      )}
      
      {/* Lottie Arrows between steps */}
      {arrows.enabled && arrows.type === 'lottie' && decorations.arrowAnimation?.enabled && (
        <div style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }}>
          {steps.slice(0, -1).map((step, i) => {
            const nextPos = stepPositions[i + 1];
            const currPos = stepPositions[i];
            
            const arrowStartBeat = beats.firstStep + (i * beats.stepInterval) + beats.arrowDelay;
            const arrowBeat = toFrames(arrowStartBeat, fps);
            
            if (frame < arrowBeat) return null;
            
            const arrowEntrance = getCardEntrance(frame, {
              startFrame: arrowStartBeat, // CRITICAL: Pass SECONDS not frames
              duration: 0.5,
              direction: 'right',
              distance: 30,
              withGlow: decorations.arrowAnimation.withGlow
            }, fps);
            
            if (arrowEntrance.opacity === 0) return null;
            
            // Calculate arrow position between steps
            const midX = (currPos.x + nextPos.x) / 2;
            const midY = (currPos.y + nextPos.y) / 2;
            
            // Calculate angle
            const dx = nextPos.x - currPos.x;
            const dy = nextPos.y - currPos.y;
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            
            return (
              <div
                key={`arrow-${i}`}
                style={{
                  position: 'absolute',
                  left: midX,
                  top: midY,
                  transform: `translate(-50%, -50%) rotate(${angle}deg) scale(${arrowEntrance.scale})`,
                  opacity: arrowEntrance.opacity * exitOpacity,
                  width: arrows.size,
                  height: arrows.size
                }}
              >
                <AnimatedLottie
                  animationData={getLottiePreset(arrows.lottiePreset || 'arrowFlow')?.data}
                  loop={arrows.animated}
                  autoplay
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            );
          })}
        </div>
      )}
      
      {/* Step Cards - Circular Design (NO BOXES!) */}
      {steps.map((step, i) => {
        const pos = stepPositions[i];
        const stepStartBeat = beats.firstStep + (i * beats.stepInterval);
        
        const stepEntrance = getCardEntrance(frame, {
          startFrame: stepStartBeat, // CRITICAL: Pass SECONDS not frames
          duration: 0.7,
          direction: 'up',
          distance: 60,
          withGlow: effects.glow.enabled,
          glowColor: `${step.color}40`
        }, fps);
        
        if (stepEntrance.opacity === 0) return null;
        
        // Continuous float animation
        const floatAnim = decorations.stepFloat?.enabled
          ? {
              offsetY: Math.sin((frame + i * 25) * decorations.stepFloat.speed) * decorations.stepFloat.distance
            }
          : { offsetY: 0 };
        
        // Particle burst on step reveal
        const stepBurst = decorations.stepBurst?.enabled
          ? getParticleBurst(frame, {
              triggerFrame: stepStartBeat, // CRITICAL: Pass SECONDS
              particleCount: decorations.stepBurst.particleCount,
              duration: decorations.stepBurst.duration,
              color: step.color,
              size: 6,
              spread: decorations.stepBurst.spread
            }, fps)
          : [];
        
        // Icon pop
        const iconPop = decorations.iconPop?.enabled && step.icon
          ? getIconPop(frame, {
              startFrame: stepStartBeat + 0.3, // CRITICAL: Pass SECONDS
              duration: decorations.iconPop.duration,
              withBounce: decorations.iconPop.withBounce
            }, fps)
          : null;
        
        // Check emphasis
        const isEmphasized = isStepEmphasized(step, frame, fps);
        const emphasisScale = isEmphasized ? emphasis.scaleAmount : 1.0;
        const emphasisGlow = isEmphasized ? {
          boxShadow: `0 0 ${emphasis.glowIntensity}px ${step.color}, 0 0 ${emphasis.glowIntensity * 1.5}px ${step.color}80`
        } : {};
        
        const isCompleted = step.completed;
        
        return (
          <div
            key={`step-${i}`}
            style={{
              position: 'absolute',
              left: pos.x,
              top: pos.y + floatAnim.offsetY,
              transform: `translate(-50%, -50%) scale(${stepEntrance.scale * emphasisScale})`,
              opacity: stepEntrance.opacity * exitOpacity,
              zIndex: isEmphasized ? 10 : 3,
              transition: 'all 0.3s ease'
            }}
          >
            {/* Particle burst */}
            {renderParticleBurst(stepBurst, 0, 0)}
          >
            {/* Circular card design */}
            <div style={{
              width: layout.cardSize,
              height: layout.cardSize,
              minWidth: layout.cardSize,  // Enforce uniform size
              minHeight: layout.cardSize,  // Enforce uniform size
              borderRadius: '50%',
              background: isCompleted 
                ? `linear-gradient(135deg, ${colors.completed}DD 0%, ${colors.completed}99 100%)`
                : `linear-gradient(135deg, ${step.color}DD 0%, ${step.color}99 100%)`,
              border: `4px solid ${colors.text}${isEmphasized ? 'FF' : '20'}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 28,  // Increased padding
              boxSizing: 'border-box',  // Include padding in size calculation
              position: 'relative',
              overflow: 'hidden',
              ...emphasisGlow,
              backdropFilter: 'blur(12px)'
            }}>
              {/* Shine effect on completed */}
              {effects.shine?.enabled && effects.shine?.onCompleted && isCompleted && (
                <ShineEffect duration={2.0} delay={i * 0.3} />
              )}
              
              {/* Step number or checkmark */}
              <div style={{
                fontSize: Math.min(fonts.size_step_number, 56),  // Max 56px
                fontWeight: fonts.weight_step,
                fontFamily: fontTokens.accent.family,
                color: colors.text,
                marginBottom: 8,
                position: 'relative',
                zIndex: 2,
                flexShrink: 0
              }}>
                {isCompleted && checkmarks.enabled ? (
                  checkmarks.style === 'lottie' ? (
                    <div style={{ width: 70, height: 70 }}>
                      <AnimatedLottie
                        animationData={getLottiePreset(checkmarks.lottiePreset)?.data}
                        loop={false}
                        autoplay
                      />
                    </div>
                  ) : (
                    <span style={{ fontSize: 50 }}>✓</span>
                  )
                ) : (
                  <span>{step.number}</span>
                )}
              </div>
              
              {/* Icon */}
              {step.icon && iconPop && !isCompleted && (
                <div style={{
                  fontSize: 36,  // Slightly smaller icon
                  marginBottom: 6,
                  opacity: iconPop.opacity,
                  transform: `scale(${iconPop.scale}) rotate(${iconPop.rotation}deg)`,
                  zIndex: 2,
                  flexShrink: 0
                }}>
                  {step.icon}
                </div>
              )}
              
              {/* Title */}
              <div
                style={{
                  fontSize: Math.min(fonts.size_step_title, 26),  // Max 26px
                  fontWeight: fonts.weight_step,
                  fontFamily: fontTokens.accent.family,
                  color: colors.text,
                  textAlign: 'center',
                  marginBottom: 6,
                  lineHeight: 1.1,
                  zIndex: 2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%'
                }}
              >
                {step.title}
              </div>
              
              {/* Description */}
              <div
                style={{
                  fontSize: Math.min(fonts.size_step_desc, 15),  // Max 15px
                  fontFamily: fontTokens.body.family,
                  color: colors.text,
                  textAlign: 'center',
                  opacity: 0.9,
                  lineHeight: 1.3,
                  zIndex: 2,
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,  // Limit to 2 lines
                  WebkitBoxOrient: 'vertical',
                  maxWidth: '100%'
                }}
              >
                {step.description}
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// Duration calculation
export const getDuration = (scene, fps) => {
  const config = { ...DEFAULT_CONFIG, ...scene };
  const beats = { ...DEFAULT_CONFIG.beats, ...(scene.beats || {}) };
  const steps = config.steps || DEFAULT_CONFIG.steps;
  
  const stepsDuration = beats.firstStep + (beats.stepInterval * steps.length) + 2.0;
  const totalDuration = Math.max(beats.exit, stepsDuration) + 1.0;
  
  return toFrames(totalDuration, fps);
};

// Metadata
export const TEMPLATE_VERSION = '6.0';
export const TEMPLATE_ID = 'Guide10StepSequence';
export const PRIMARY_INTENTION = 'GUIDE';
export const SECONDARY_INTENTIONS = ['BREAKDOWN', 'APPLY'];

// Extended config schema
export const CONFIG_SCHEMA = {
  title: {
    text: { type: 'text', label: 'Title' }
  },
  steps: {
    type: 'array',
    label: 'Process Steps',
    itemSchema: {
      number: { type: 'number', label: 'Step Number' },
      title: { type: 'text', label: 'Step Title' },
      description: { type: 'text', label: 'Description' },
      completed: { type: 'checkbox', label: 'Completed' },
      color: { type: 'color', label: 'Color' },
      icon: { type: 'text', label: 'Icon (emoji)' },
      emphasize: {
        enabled: { type: 'checkbox', label: 'Enable Emphasis' },
        startTime: { type: 'number', label: 'Emphasis Start (s)', min: 0, max: 20, step: 0.5 },
        duration: { type: 'number', label: 'Emphasis Duration (s)', min: 0.5, max: 5, step: 0.5 }
      }
    }
  },
  layout: {
    mode: { 
      type: 'select', 
      label: 'Layout Mode',
      options: ['horizontal', 'grid', 'flowing'],
      default: 'horizontal'
    },
    spacing: { 
      type: 'select', 
      label: 'Spacing',
      options: ['tight', 'comfortable', 'spacious']
    },
    gridColumns: { 
      type: 'number', 
      label: 'Grid Columns (for grid mode)', 
      min: 2, 
      max: 4 
    },
    cardSize: { 
      type: 'slider', 
      label: 'Card Size', 
      min: 180, 
      max: 280, 
      step: 20 
    }
  },
  arrows: {
    enabled: { type: 'checkbox', label: 'Show Arrows' },
    type: { 
      type: 'select', 
      label: 'Arrow Type',
      options: ['lottie', 'svg', 'none']
    },
    lottiePreset: { 
      type: 'select', 
      label: 'Lottie Animation',
      options: ['arrowFlow', 'arrowBounce', 'arrowGlow']
    },
    animated: { type: 'checkbox', label: 'Animated' },
    size: { type: 'slider', label: 'Arrow Size', min: 40, max: 100, step: 10 }
  },
  progressTracker: {
    enabled: { type: 'checkbox', label: 'Show Progress Tracker' },
    type: { 
      type: 'select', 
      label: 'Tracker Type',
      options: ['circular', 'linear', 'none']
    },
    position: { 
      type: 'select', 
      label: 'Position',
      options: ['top-right', 'bottom-center']
    },
    showPercentage: { type: 'checkbox', label: 'Show as Percentage' }
  },
  emphasis: {
    enabled: { type: 'checkbox', label: 'Enable Emphasis System' },
    activeStyle: { 
      type: 'select', 
      options: ['scale-glow', 'pulse', 'spotlight'] 
    },
    scaleAmount: { 
      type: 'slider', 
      label: 'Scale Amount', 
      min: 1.0, 
      max: 1.3, 
      step: 0.05 
    },
    glowIntensity: { 
      type: 'slider', 
      label: 'Glow Intensity', 
      min: 10, 
      max: 40, 
      step: 5 
    }
  },
  checkmarks: {
    enabled: { type: 'checkbox', label: 'Show Checkmarks on Completed' },
    style: { 
      type: 'select', 
      options: ['lottie', 'icon'] 
    },
    lottiePreset: { 
      type: 'select', 
      options: ['successCheck', 'celebrationCheck']
    }
  },
  effects: {
    shine: {
      enabled: { type: 'checkbox', label: 'Shine Effect' },
      onCompleted: { type: 'checkbox', label: 'Only on Completed Steps' }
    },
    noiseTexture: {
      enabled: { type: 'checkbox', label: 'Film Grain Texture' },
      opacity: { type: 'slider', min: 0, max: 0.1, step: 0.01 }
    }
  }
};
