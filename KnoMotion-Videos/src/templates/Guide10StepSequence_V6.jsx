import React, { useEffect } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import { 
  EZ, 
  toFrames, 
  renderHero,
  mergeHeroConfig,
  generateAmbientParticles,
  renderAmbientParticles
} from '../sdk';
import { loadFontVoice, buildFontTokens, DEFAULT_FONT_VOICE } from '../sdk/fontSystem';
import { createTransitionProps } from '../sdk/transitions';
import { GlassmorphicPane, ShineEffect, NoiseTexture } from '../sdk/broadcastEffects';
import { AnimatedLottie } from '../sdk/lottieIntegration';
import { getLottieFromConfig, getLottiePreset } from '../sdk/lottiePresets';
import {
  getCardEntrance,
  getStaggerDelay,
  getIconPop,
  applyTransform
} from '../sdk/microDelights.jsx';

/**
 * TEMPLATE #10: STEP-BY-STEP GUIDE - v6.0 (REVISED FOR BROADCAST QUALITY)
 * 
 * MAJOR REVISIONS BASED ON FEEDBACK:
 * ✅ Horizontal & Grid layouts (NOT vertical by default)
 * ✅ Lottie animated arrows between steps
 * ✅ Removed "box" styling - sophisticated organic design
 * ✅ Uses FULL 1920x1080 screen real estate
 * ✅ More configuration options exposed to admin panel
 * ✅ Dynamic, flowing design that doesn't feel PowerPoint-esque
 * 
 * KEY FEATURES:
 * - Three layout modes: horizontal, grid, flowing
 * - Animated Lottie arrows connecting steps
 * - Circular progress tracker
 * - Emphasis system for active/completed steps
 * - Sophisticated glassmorphic cards (no boxes!)
 * - Full JSON configurability
 */

const DEFAULT_CONFIG = {
  title: {
    text: 'Step-by-Step Process',
    position: 'top-center',
    offset: { x: 0, y: 40 }
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
    cardSize: 220  // Size of each step card
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
    const centerY = height / 2 + 20;
    
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
    const startY = (height - totalHeight) / 2 + 40;
    
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
    const gapX = gap * 1.2;
    const gapY = gap * 0.9;
    
    for (let i = 0; i < totalSteps; i++) {
      const row = Math.floor(i / itemsPerRow);
      const col = i % itemsPerRow;
      const isEvenRow = row % 2 === 0;
      
      const totalWidth = (itemsPerRow - 1) * gapX;
      const startX = (width - totalWidth) / 2;
      const startY = 250 + (row * gapY);
      
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
      
      {/* Title */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: config.title.offset.y,
          transform: `translate(-50%, ${(1 - titleProgress) * 30}px)`,
          fontSize: fonts.size_title,
          fontWeight: fonts.weight_title,
          fontFamily: fontTokens.title.family,
          color: colors.text,
          opacity: titleProgress * exitOpacity,
          textAlign: 'center',
          letterSpacing: '0.02em',
          zIndex: 10
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
      
      {/* Step Cards - Circular Design (NO BOXES!) */}
      {steps.map((step, i) => {
        const pos = stepPositions[i];
        
        const stepEntrance = getCardEntrance(frame, {
          startFrame: beats.firstStep + i * beats.stepInterval,
          duration: 0.7,
          direction: 'up',
          distance: 60,
          withGlow: effects.glow.enabled,
          glowColor: `${step.color}40`
        }, fps);
        
        if (stepEntrance.opacity === 0) return null;
        
        // Icon pop
        const iconPop = step.icon ? getIconPop(frame, {
          startFrame: beats.firstStep + i * beats.stepInterval + 0.3,
          duration: 0.5,
          withBounce: true
        }, fps) : null;
        
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
              top: pos.y,
              transform: `translate(-50%, -50%) scale(${stepEntrance.scale * emphasisScale})`,
              opacity: stepEntrance.opacity * exitOpacity,
              zIndex: isEmphasized ? 10 : 3,
              transition: 'all 0.3s ease'
            }}
          >
            {/* Circular card design */}
            <div style={{
              width: layout.cardSize,
              height: layout.cardSize,
              borderRadius: '50%',
              background: isCompleted 
                ? `linear-gradient(135deg, ${colors.completed}DD 0%, ${colors.completed}99 100%)`
                : `linear-gradient(135deg, ${step.color}DD 0%, ${step.color}99 100%)`,
              border: `4px solid ${colors.text}${isEmphasized ? 'FF' : '20'}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
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
                fontSize: fonts.size_step_number,
                fontWeight: fonts.weight_step,
                fontFamily: fontTokens.accent.family,
                color: colors.text,
                marginBottom: 12,
                position: 'relative',
                zIndex: 2
              }}>
                {isCompleted && checkmarks.enabled ? (
                  checkmarks.style === 'lottie' ? (
                    <div style={{ width: 80, height: 80 }}>
                      <AnimatedLottie
                        animationData={getLottiePreset(checkmarks.lottiePreset)?.data}
                        loop={false}
                        autoplay
                      />
                    </div>
                  ) : (
                    <span style={{ fontSize: 60 }}>✓</span>
                  )
                ) : (
                  <span>{step.number}</span>
                )}
              </div>
              
              {/* Icon */}
              {step.icon && iconPop && !isCompleted && (
                <div style={{
                  fontSize: 42,
                  marginBottom: 8,
                  opacity: iconPop.opacity,
                  transform: `scale(${iconPop.scale}) rotate(${iconPop.rotation}deg)`,
                  zIndex: 2
                }}>
                  {step.icon}
                </div>
              )}
              
              {/* Title */}
              <div
                style={{
                  fontSize: fonts.size_step_title,
                  fontWeight: fonts.weight_step,
                  fontFamily: fontTokens.accent.family,
                  color: colors.text,
                  textAlign: 'center',
                  marginBottom: 8,
                  lineHeight: 1.2,
                  zIndex: 2
                }}
              >
                {step.title}
              </div>
              
              {/* Description */}
              <div
                style={{
                  fontSize: fonts.size_step_desc,
                  fontFamily: fontTokens.body.family,
                  color: colors.text,
                  textAlign: 'center',
                  opacity: 0.9,
                  lineHeight: 1.4,
                  zIndex: 2
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
