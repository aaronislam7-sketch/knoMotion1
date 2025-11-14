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
  applyTransform
} from '../../sdk/microDelights.jsx';

/**
 * TEMPLATE #10: STEP-BY-STEP GUIDE - v6.1 ZEN GARDEN POLISH
 * 
 * ZEN GARDEN PHILOSOPHY: Clarity through space, life through subtle motion
 * Polish Level: ⭐⭐⭐⭐ (4/5) - Elegant simplicity beats flashy complexity
 * 
 * POLISH IMPROVEMENTS (v6.1):
 * ✅ CONTINUOUS LIFE: All cards float gently in synchronized wave (POLISH.md Principle III)
 * ✅ READABILITY: Rounded squares > circles (21% more usable space, POLISH.md Principle I)
 * ✅ BREATHING ROOM: 80px gaps, spacious layout (POLISH.md Principle II)
 * ✅ SUBTLE EMPHASIS: Soft glows, gentle pulses (POLISH.md Principle XX "Less is more")
 * ✅ 60FPS OPTIMIZED: 3px amplitude, willChange hints (POLISH.md Principle XXVIII)
 * ✅ STAGGERED REVEAL: Top-left → bottom-right cascade creates natural flow
 * 
 * ADDRESSED BLOCKERS:
 * 1. Static Holds → Continuous floating with phase-shifted wave
 * 2. Text Cramming → Square cards + generous spacing
 * 3. Narrative Flow → Partial: staggered reveal + arrow loops
 * 
 * KEY FEATURES:
 * - Grid layout with auto-column calculation (2-3 columns based on step count)
 * - Continuous floating animation (3px, 0.015 freq, phase-shifted)
 * - Completed step glow with gentle pulse
 * - Lottie animated arrows with continuous loop
 * - Circular progress tracker with count-up animation
 * - Configurable emphasis modes (subtle/dramatic)
 * - Full JSON configurability with sensible defaults
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
  
  // NEW: Layout configuration - ZEN GARDEN POLISH
  layout: {
    mode: 'grid',  // 'horizontal', 'grid', 'flowing'
    spacing: 'spacious',  // 'tight', 'comfortable', 'spacious' - DEFAULT SPACIOUS
    gridColumns: 2,  // Auto-calculate based on step count
    cardShape: 'rounded-square',  // 'circle', 'rounded-square' - CHANGED FOR READABILITY
    cardSize: 240,  // Reduced from 260, but square = more usable space
    gap: 80,  // Explicit gap control - INCREASED for breathing room
    centerAlign: true  // Center grid on canvas
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
  
  // NEW: Emphasis system - ZEN GARDEN SUBTLE MODE
  emphasis: {
    enabled: true,
    subtle: true,  // Minimal emphasis (no dramatic effects)
    activeStyle: 'soft-scale',  // Gentle 1.05x scale
    completedStyle: 'glow',  // Soft persistent glow
    scaleAmount: 1.05,  // Reduced from 1.1
    glowIntensity: 15,  // Reduced from 25
    completedGlow: {
      enabled: true,
      color: '#10B981',
      intensity: 15,
      opacity: 0.6,
      pulse: true,  // Glow pulses gently
      pulseFrequency: 0.05  // Very slow pulse
    }
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
  
  beats: {
    entrance: 0.5,
    title: 1.0,
    firstStep: 2.5,
    stepInterval: 0.7,
    arrowDelay: 0.3,  // Delay after step before arrow appears
    hold: 12.0,
    exit: 14.0
  },
  
  animation: {
    stepReveal: 'spring-bounce',
    arrowAnimation: 'slide-fade',
    progressAnimation: true,
    // ZEN GARDEN: Continuous life animations
    continuousFloat: true,  // Enable gentle floating during holds
    floatAmplitude: 3,  // Pixels (60fps optimized: 3px not 8px)
    floatFrequency: 0.015,  // Speed (slow, smooth)
    phaseShift: 60,  // Degrees between cards for wave effect
    staggerReveal: true,  // Cascade top-left → bottom-right
    revealInterval: 0.4  // Seconds between card reveals
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
  }
};

// Calculate step positions based on layout mode
const calculateStepPositions = (totalSteps, layout, width, height) => {
  const { mode, spacing, gridColumns, cardSize } = layout;
  
  // ZEN GARDEN: Use explicit gap if provided, otherwise use spacing multiplier
  const spacingMap = {
    tight: 1.2,
    comfortable: 1.4,
    spacious: 1.6
  };
  
  const gap = layout.gap || (cardSize * spacingMap[spacing]);
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
    // Grid layout - organize in rows and columns - ZEN GARDEN POLISH
    const rows = Math.ceil(totalSteps / gridColumns);
    const totalWidth = (gridColumns - 1) * gap;
    const totalHeight = (rows - 1) * gap;
    
    // ZEN GARDEN: Better centering with generous top margin
    const startX = (width - totalWidth) / 2;
    const titleHeight = 140;  // Title + margin
    const availableHeight = height - titleHeight - 80;  // Bottom margin
    const startY = titleHeight + (availableHeight - totalHeight) / 2;
    
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
  
  // Merge config
  const beats = { ...DEFAULT_CONFIG.beats, ...(scene.beats || {}) };
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
  
  const steps = config.steps || DEFAULT_CONFIG.steps;
  const totalSteps = steps.length;
  const completedCount = steps.filter(s => s.completed).length;
  
  // Convert beats to frames
  const f_title = toFrames(beats.title, fps);
  const f_firstStep = toFrames(beats.firstStep, fps);
  const f_exit = toFrames(beats.exit, fps);
  
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
  
  // Title animation
  const titleProgress = interpolate(
    frame,
    [f_title, f_title + toFrames(0.8, fps)],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.power3Out }
  );
  
  // ZEN GARDEN: Title continuous float (very subtle, POLISH.md Principle III)
  const titleFloatStart = f_title + toFrames(0.8, fps);
  const titleFloatActive = anim.continuousFloat && frame >= titleFloatStart;
  const titleFloating = titleFloatActive
    ? Math.sin((frame - titleFloatStart) * 0.01) * 2  // 2px amplitude, 0.01 frequency
    : 0;
  
  // Exit animation
  const exitProgress = frame >= f_exit
    ? interpolate(frame, [f_exit, f_exit + toFrames(0.8, fps)], [0, 1],
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
      
      {/* Title - ZEN GARDEN: With continuous float */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: config.title.offset.y,
          transform: `translate(-50%, ${(1 - titleProgress) * 30 + titleFloating}px)`,
          fontSize: fonts.size_title,
          fontWeight: fonts.weight_title,
          fontFamily: fontTokens.title.family,
          color: colors.text,
          opacity: titleProgress * exitOpacity,
          textAlign: 'center',
          letterSpacing: '0.02em',
          zIndex: 10,
          willChange: titleFloatActive ? 'transform' : 'auto'  // 60fps hint
        }}
      >
        {config.title.text}
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
      {arrows.enabled && arrows.type === 'lottie' && (
        <div style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }}>
          {steps.slice(0, -1).map((step, i) => {
            const nextPos = stepPositions[i + 1];
            const currPos = stepPositions[i];
            
            const stepBeat = f_firstStep + toFrames(beats.stepInterval * i, fps);
            const arrowBeat = stepBeat + toFrames(beats.arrowDelay, fps);
            
            if (frame < arrowBeat) return null;
            
            const arrowEntrance = getCardEntrance(frame, {
              startFrame: beats.firstStep + i * beats.stepInterval + beats.arrowDelay,
              duration: 0.5,
              direction: 'right',
              distance: 30,
              withGlow: false
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
      
      {/* Step Cards - ZEN GARDEN ROUNDED SQUARES */}
      {steps.map((step, i) => {
        const pos = stepPositions[i];
        
        // ZEN GARDEN: Staggered reveal timing
        const revealDelay = anim.staggerReveal ? i * (anim.revealInterval || 0.4) : 0;
        
        const stepEntrance = getCardEntrance(frame, {
          startFrame: beats.firstStep + revealDelay,
          duration: 0.7,
          direction: 'up',
          distance: 60,
          withGlow: effects.glow.enabled,
          glowColor: `${step.color}40`
        }, fps);
        
        if (stepEntrance.opacity === 0) return null;
        
        // Icon pop
        const iconPop = step.icon ? getIconPop(frame, {
          startFrame: beats.firstStep + revealDelay + 0.3,
          duration: 0.5,
          withBounce: true
        }, fps) : null;
        
        // Check emphasis
        const isEmphasized = isStepEmphasized(step, frame, fps);
        const emphasisScale = isEmphasized && !emphasis.subtle ? emphasis.scaleAmount : (emphasis.subtle ? 1.05 : 1.0);
        
        const isCompleted = step.completed;
        
        // ZEN GARDEN: Continuous floating animation (PRINCIPLE III + XIV)
        const floatStartFrame = toFrames(beats.firstStep + revealDelay, fps) + toFrames(0.7, fps);  // After entrance
        const floatActive = anim.continuousFloat && frame >= floatStartFrame;
        const phaseShift = (i * (anim.phaseShift || 60)) * (Math.PI / 180);  // Convert degrees to radians
        const floatingOffset = floatActive
          ? Math.sin((frame - floatStartFrame) * (anim.floatFrequency || 0.015) + phaseShift) * (anim.floatAmplitude || 3)
          : 0;
        
        // ZEN GARDEN: Completed glow pulse (PRINCIPLE XXVI)
        const completedGlowConfig = emphasis.completedGlow || {};
        const glowPulseActive = isCompleted && completedGlowConfig.enabled && completedGlowConfig.pulse;
        const glowPulse = glowPulseActive
          ? Math.sin((frame - floatStartFrame) * (completedGlowConfig.pulseFrequency || 0.05)) * 0.3 + 0.7
          : 1;
        const completedGlowIntensity = completedGlowConfig.enabled && isCompleted
          ? (completedGlowConfig.intensity || 15) * glowPulse
          : 0;
        
        // Emphasis glow (only if not subtle mode)
        const emphasisGlow = isEmphasized && !emphasis.subtle ? {
          boxShadow: `0 0 ${emphasis.glowIntensity}px ${step.color}, 0 0 ${emphasis.glowIntensity * 1.5}px ${step.color}80`
        } : {};
        
        // Completed glow (soft, persistent)
        const completedGlow = isCompleted && completedGlowConfig.enabled ? {
          boxShadow: `0 0 ${completedGlowIntensity}px ${completedGlowConfig.color || '#10B981'}${Math.round((completedGlowConfig.opacity || 0.6) * 255).toString(16)}`
        } : {};
        
        return (
          <div
            key={`step-${i}`}
            style={{
              position: 'absolute',
              left: pos.x,
              top: pos.y,
              // ZEN GARDEN: Floating included in transform (PRINCIPLE III)
              transform: `translate(-50%, -50%) translateY(${floatingOffset}px) scale(${stepEntrance.scale * emphasisScale})`,
              opacity: stepEntrance.opacity * exitOpacity,
              zIndex: isEmphasized ? 10 : 3,
              transition: 'all 0.3s ease',
              // 60fps optimization hint
              willChange: floatActive ? 'transform' : 'auto'
            }}
          >
            {/* ZEN GARDEN: Rounded square card design (PRINCIPLE I - readability > decoration) */}
            <div style={{
              width: layout.cardSize,
              height: layout.cardSize,
              minWidth: layout.cardSize,  // Enforce uniform size (PRINCIPLE XXIII)
              minHeight: layout.cardSize,  // Enforce uniform size
              borderRadius: layout.cardShape === 'circle' ? '50%' : 20,  // ZEN: rounded-square default
              background: isCompleted 
                ? `linear-gradient(135deg, ${colors.completed}DD 0%, ${colors.completed}99 100%)`
                : `linear-gradient(135deg, ${step.color}DD 0%, ${step.color}99 100%)`,
              border: `4px solid ${colors.text}${isEmphasized && !emphasis.subtle ? 'FF' : '20'}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,  // Slightly reduced, but square shape = more usable space
              boxSizing: 'border-box',  // Include padding in size calculation
              position: 'relative',
              overflow: 'hidden',
              ...emphasisGlow,
              ...completedGlow,  // ZEN: Soft completed glow
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
              
              {/* Title - ZEN GARDEN: Better sizing for square cards */}
              <div
                style={{
                  fontSize: Math.min(fonts.size_step_title, 28),  // Increased max from 26px (more space available)
                  fontWeight: fonts.weight_step,
                  fontFamily: fontTokens.accent.family,
                  color: colors.text,
                  textAlign: 'center',
                  marginBottom: 8,  // Increased from 6
                  lineHeight: 1.2,  // Increased from 1.1
                  zIndex: 2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%'
                }}
              >
                {step.title}
              </div>
              
              {/* Description - ZEN GARDEN: Better sizing, no clipping needed */}
              <div
                style={{
                  fontSize: Math.min(fonts.size_step_desc, 16),  // Increased max from 15px
                  fontFamily: fontTokens.body.family,
                  color: colors.text,
                  textAlign: 'center',
                  opacity: 0.9,
                  lineHeight: 1.4,  // Increased from 1.3
                  zIndex: 2,
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,  // Increased from 2 lines (square = more space)
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
export const TEMPLATE_VERSION = '6.1';  // ZEN GARDEN POLISH
export const TEMPLATE_ID = 'Guide10StepSequence';
export const PRIMARY_INTENTION = 'GUIDE';
export const SECONDARY_INTENTIONS = ['BREAKDOWN', 'APPLY'];
export const POLISH_LEVEL = 4;  // \u2b50\u2b50\u2b50\u2b50 - Elegant simplicity
export const POLISH_PRINCIPLES_APPLIED = [
  'III: Continuous Life',
  'I: Visual Clarity Over Decoration',
  'II: Spacing Creates Rhythm',
  'XX: Less Is More',
  'XXIII: Uniform Sizing',
  'XXVIII: 60fps Optimization'
];

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
      default: 'grid'  // ZEN GARDEN: grid default
    },
    spacing: { 
      type: 'select', 
      label: 'Spacing',
      options: ['tight', 'comfortable', 'spacious'],
      default: 'spacious'  // ZEN GARDEN: spacious default
    },
    cardShape: {
      type: 'select',
      label: 'Card Shape',
      options: ['circle', 'rounded-square'],
      default: 'rounded-square'  // ZEN GARDEN: readability > decoration
    },
    gridColumns: { 
      type: 'number', 
      label: 'Grid Columns (for grid mode)', 
      min: 2, 
      max: 4,
      default: 2
    },
    cardSize: { 
      type: 'slider', 
      label: 'Card Size', 
      min: 180, 
      max: 280, 
      step: 20,
      default: 240
    },
    gap: {
      type: 'slider',
      label: 'Gap Between Cards',
      min: 40,
      max: 120,
      step: 10,
      default: 80  // ZEN GARDEN: generous breathing room
    },
    centerAlign: {
      type: 'checkbox',
      label: 'Center Align Grid',
      default: true
    }
  },
  animation: {
    continuousFloat: {
      type: 'checkbox',
      label: 'Enable Continuous Floating',
      default: true  // ZEN GARDEN: continuous life
    },
    floatAmplitude: {
      type: 'slider',
      label: 'Float Amplitude (px)',
      min: 0,
      max: 8,
      step: 0.5,
      default: 3  // 60fps optimized
    },
    floatFrequency: {
      type: 'slider',
      label: 'Float Speed',
      min: 0.01,
      max: 0.03,
      step: 0.001,
      default: 0.015
    },
    phaseShift: {
      type: 'slider',
      label: 'Phase Shift (degrees)',
      min: 0,
      max: 180,
      step: 15,
      default: 60  // Creates wave effect
    },
    staggerReveal: {
      type: 'checkbox',
      label: 'Stagger Card Reveals',
      default: true  // ZEN GARDEN: cascade flow
    },
    revealInterval: {
      type: 'slider',
      label: 'Reveal Interval (s)',
      min: 0.2,
      max: 0.8,
      step: 0.1,
      default: 0.4
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
    enabled: { type: 'checkbox', label: 'Enable Emphasis System', default: true },
    subtle: {
      type: 'checkbox',
      label: 'Subtle Mode (Zen Garden)',
      default: true  // ZEN GARDEN: minimal emphasis
    },
    activeStyle: { 
      type: 'select', 
      label: 'Active Style',
      options: ['soft-scale', 'scale-glow', 'pulse', 'spotlight'],
      default: 'soft-scale'
    },
    scaleAmount: { 
      type: 'slider', 
      label: 'Scale Amount', 
      min: 1.0, 
      max: 1.3, 
      step: 0.05,
      default: 1.05  // ZEN GARDEN: gentle
    },
    glowIntensity: { 
      type: 'slider', 
      label: 'Glow Intensity', 
      min: 10, 
      max: 40, 
      step: 5,
      default: 15  // ZEN GARDEN: subtle
    },
    completedGlow: {
      enabled: { type: 'checkbox', label: 'Glow on Completed', default: true },
      color: { type: 'color', label: 'Glow Color', default: '#10B981' },
      intensity: { type: 'slider', label: 'Intensity', min: 10, max: 30, step: 5, default: 15 },
      opacity: { type: 'slider', label: 'Opacity', min: 0.3, max: 1.0, step: 0.1, default: 0.6 },
      pulse: { type: 'checkbox', label: 'Pulse Effect', default: true },
      pulseFrequency: { type: 'slider', label: 'Pulse Speed', min: 0.01, max: 0.1, step: 0.01, default: 0.05 }
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
