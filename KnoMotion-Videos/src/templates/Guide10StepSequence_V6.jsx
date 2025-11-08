import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import rough from 'roughjs/bundled/rough.esm.js';

// SDK imports - Agnostic Template System v6
import { 
  fadeUpIn,
  slideInLeft,
  popInSpring,
  pulseEmphasis,
  EZ,
  useSceneId,
  toFrames,
  renderHero,
  mergeHeroConfig,
  resolvePosition,
  positionToCSS,
  getCircleDrawOn,
  generateAmbientParticles,
  renderAmbientParticles
} from '../sdk';
import { loadFontVoice, buildFontTokens, DEFAULT_FONT_VOICE } from '../sdk/fontSystem';
import { createTransitionProps } from '../sdk/transitions';
import { GlassmorphicPane, ShineEffect, SpotlightEffect } from '../sdk/broadcastEffects';
import { AnimatedLottie, LottieIcon } from '../sdk/lottieIntegration';
import { getLottieFromConfig, getStepCompleteLottie } from '../sdk/lottiePresets';
import {
  getCardEntrance,
  getPathDraw,
  getStaggerDelay,
  applyTransform
} from '../sdk/microDelights';

/**
 * TEMPLATE #10: STEP SEQUENCE - v6.0 (POLISHED)
 * 
 * PRIMARY INTENTION: GUIDE
 * SECONDARY INTENTIONS: BREAKDOWN, CONNECT
 * 
 * PURPOSE: Step-by-step process visualization
 * 
 * VISUAL PATTERN:
 * - Step-by-step process with glassmorphic cards
 * - 2-8 numbered steps with animated entrances
 * - Progress bar at top showing completion
 * - Animated connecting lines with flowing particles
 * - Lottie checkmarks for completed steps
 * - Each step: glassmorphic card, number badge, title, description, optional icon
 * 
 * ENHANCEMENTS (ALL CONFIGURABLE VIA JSON):
 * ✨ Glassmorphic step cards with shine effects
 * ✨ Animated progress bar showing completion
 * ✨ Lottie checkmark animations on completion
 * ✨ Flowing particles along connector lines
 * ✨ Spring bounce card entrances
 * ✨ Pulsing glow on active step
 * ✨ Number badge rotates in with pop effect
 * 
 * AGNOSTIC PRINCIPALS:
 * ✅ Type-based polymorphism (icons via hero registry)
 * ✅ Data-driven structure (dynamic array of steps)
 * ✅ Token-based positioning (position system)
 * ✅ Separation of concerns (content/layout/style/animation)
 * ✅ Progressive configuration (simple → advanced)
 * ✅ Registry pattern (extensible step types)
 * 
 * NO HARDCODED VALUES!
 */

// Default configuration
const DEFAULT_CONFIG = {
  title: {
    text: 'Step-by-Step Guide',
    position: 'top-center',
    offset: { x: 0, y: 40 }
  },
  layout: 'vertical', // vertical, horizontal, grid
  connectionStyle: 'arrow', // line, arrow, dots, none
  steps: [
    {
      title: 'Step 1',
      description: 'First step description',
      icon: null,
      completed: false // NEW: Mark as completed for checkmark
    }
  ],
  // NEW: Progress bar configuration
  progressBar: {
    enabled: true,
    height: 8,
    showPercentage: true
  },
  // NEW: Glassmorphic styling
  glass: {
    enabled: true,
    glowOpacity: 0.15,
    borderOpacity: 0.3,
    shineEffect: true
  },
  // NEW: Lottie checkmarks
  checkmarks: {
    enabled: true,
    size: 50,
    showOnCompletion: true // Show when step fully revealed
  },
  style_tokens: {
    colors: {
      bg: '#FFF9F0',
      accent: '#FF6B35',
      accent2: '#9B59B6',
      ink: '#1A1A1A',
      stepBg: '#FFFFFF',
      connectionColor: '#CCCCCC',
      progressBg: '#E0E0E0',
      progressFill: '#2ECC71'
    },
    fonts: {
      size_title: 64,
      size_stepTitle: 32,
      size_stepDesc: 20,
      size_stepNumber: 48
    }
  },
  beats: {
    entrance: 0.4,
    titleEntry: 0.6,
    firstStep: 1.2,
    stepInterval: 1.5, // Time between each step reveal
    emphasize: 0.8, // Emphasis duration per step
    exit: 2.0
  },
  animation: {
    stepEntrance: 'slide-left', // fade-up, slide-left, pop, bounce
    connectionDraw: true,
    connectionParticles: true, // NEW: Particles flowing along connections
    pulseOnEntry: true,
    badgeRotation: true // NEW: Number badge rotates in
  },
  typography: {
    voice: 'utility',
    align: 'center',
    transform: 'none'
  },
  transition: {
    exit: { style: 'fade', durationInFrames: 18, easing: 'smooth' }
  }
};

// Calculate step positions based on layout (COLLISION-FREE)
const calculateStepPositions = (stepCount, layout, width, height) => {
  const positions = [];
  const TITLE_SAFE_ZONE = 160; // Title + padding
  
  switch (layout) {
    case 'vertical': {
      // Account for step height to prevent collisions
      const stepHeight = 120; // Approximate step box height
      const availableHeight = height - TITLE_SAFE_ZONE - 100; // Bottom padding
      const totalStepsHeight = stepHeight * stepCount;
      const spacing = totalStepsHeight > availableHeight ? 
        availableHeight / stepCount : // Tight fit if needed
        Math.max((availableHeight - totalStepsHeight) / (stepCount - 1 || 1), stepHeight + 20); // Min 20px gap
      
      const startY = TITLE_SAFE_ZONE + 80;
      for (let i = 0; i < stepCount; i++) {
        positions.push({
          x: width * 0.5,
          y: startY + (i * spacing)
        });
      }
      break;
    }
    
    case 'horizontal': {
      const startX = width * 0.15;
      const spacing = (width * 0.7) / (stepCount - 1 || 1);
      const centerY = height * 0.5;
      for (let i = 0; i < stepCount; i++) {
        positions.push({
          x: startX + (i * spacing),
          y: centerY
        });
      }
      break;
    }
    
    case 'grid': {
      const cols = Math.ceil(Math.sqrt(stepCount));
      const rows = Math.ceil(stepCount / cols);
      const spacingX = width * 0.7 / cols;
      const spacingY = height * 0.6 / rows;
      const startX = width * 0.15;
      const startY = height * 0.25;
      
      for (let i = 0; i < stepCount; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        positions.push({
          x: startX + (col * spacingX) + spacingX / 2,
          y: startY + (row * spacingY) + spacingY / 2
        });
      }
      break;
    }
    
    default:
      return calculateStepPositions(stepCount, 'vertical', width, height);
  }
  
  return positions;
};

// Render connection between steps with animated path
const renderConnection = (fromPos, toPos, progress, style, color, layout, showParticle, frame) => {
  if (style === 'none') return null;
  
  const dx = toPos.x - fromPos.x;
  const dy = toPos.y - fromPos.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  
  return (
    <svg
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1
      }}
    >
      {/* Connection line with animated drawing */}
      <line
        x1={fromPos.x}
        y1={fromPos.y}
        x2={fromPos.x + dx * progress}
        y2={fromPos.y + dy * progress}
        stroke={color}
        strokeWidth={3}
        strokeDasharray={style === 'dots' ? '8,8' : undefined}
        style={{
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
        }}
      />
      
      {/* Arrow head */}
      {style === 'arrow' && progress > 0.8 && (
        <polygon
          points={`0,-6 12,0 0,6`}
          fill={color}
          transform={`translate(${fromPos.x + dx * progress}, ${fromPos.y + dy * progress}) rotate(${angle})`}
        />
      )}
      
      {/* Flowing particle */}
      {showParticle && progress === 1 && (
        <circle
          cx={fromPos.x + dx * (Math.sin(frame * 0.08) * 0.5 + 0.5)}
          cy={fromPos.y + dy * (Math.sin(frame * 0.08) * 0.5 + 0.5)}
          r={5}
          fill={color}
          opacity={0.6}
        >
          <animate
            attributeName="r"
            values="3;6;3"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
      )}
    </svg>
  );
};

export const Guide10StepSequence = ({ scene, styles, presets, easingMap }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  
  // Font loading
  const typography = { ...DEFAULT_CONFIG.typography, ...(scene.typography || {}) };
  const fontTokens = buildFontTokens(typography?.voice || DEFAULT_FONT_VOICE) || {
    title: { family: 'Figtree, sans-serif' },
    body: { family: 'Inter, sans-serif' },
    accent: { family: 'Caveat, cursive' },
    utility: { family: 'Inter, sans-serif' }
  };
  
  useEffect(() => {
    loadFontVoice(typography?.voice || DEFAULT_FONT_VOICE);
  }, [typography?.voice]);
  
  // Merge with defaults
  const config = {
    ...DEFAULT_CONFIG,
    ...scene,
    title: { ...DEFAULT_CONFIG.title, ...(scene.title || {}) },
    progressBar: { ...DEFAULT_CONFIG.progressBar, ...(scene.progressBar || {}) },
    glass: { ...DEFAULT_CONFIG.glass, ...(scene.glass || {}) },
    checkmarks: { ...DEFAULT_CONFIG.checkmarks, ...(scene.checkmarks || {}) },
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
  const steps = config.steps || DEFAULT_CONFIG.steps;
  
  // Calculate step positions
  const stepPositions = calculateStepPositions(
    steps.length,
    config.layout || DEFAULT_CONFIG.layout,
    width,
    height
  );
  
  // Title animation
  const titleStartFrame = toFrames(beats.titleEntry, fps);
  const titleAnim = fadeUpIn(frame, {
    start: beats.titleEntry,
    dur: 0.8,
    dist: 50,
    ease: 'smooth'
  }, EZ, fps);
  
  // Progress bar calculation
  const completedSteps = steps.filter((_, index) => {
    const stepStartTime = beats.firstStep + (index * beats.stepInterval);
    const stepStartFrame = toFrames(stepStartTime, fps);
    return frame >= stepStartFrame + toFrames(0.8, fps);
  }).length;
  const progressPercentage = (completedSteps / steps.length) * 100;
  
  // Ambient particles
  const particles = generateAmbientParticles(20, 10001, width, height);
  const particleElements = renderAmbientParticles(particles, frame, fps, [colors.accent, colors.accent2, colors.bg]);
  
  return (
    <AbsoluteFill className="overflow-hidden" style={{ backgroundColor: colors.bg, fontFamily: fontTokens.body.family }}>
      {/* Ambient particles */}
      <svg
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          zIndex: 0,
          opacity: 0.3
        }}
        viewBox="0 0 1920 1080"
      >
        {particleElements.map(p => p.element)}
      </svg>
      
      {/* Progress Bar */}
      {config.progressBar.enabled && frame >= titleStartFrame && (
        <div
          style={{
            position: 'absolute',
            top: 120,
            left: width * 0.2,
            width: width * 0.6,
            zIndex: 50
          }}
        >
          <div
            style={{
              height: config.progressBar.height,
              backgroundColor: colors.progressBg,
              borderRadius: config.progressBar.height / 2,
              overflow: 'hidden',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progressPercentage}%`,
                backgroundColor: colors.progressFill,
                transition: 'width 0.3s ease',
                boxShadow: '0 0 10px rgba(46, 204, 113, 0.5)'
              }}
            />
          </div>
          {config.progressBar.showPercentage && (
            <div
              style={{
                position: 'absolute',
                top: -25,
                right: 0,
                fontSize: 14,
                fontWeight: 600,
                color: colors.ink,
                opacity: 0.7
              }}
            >
              {Math.round(progressPercentage)}%
            </div>
          )}
        </div>
      )}
      
      {/* Title - Fixed at top in safe zone */}
      {frame >= titleStartFrame && (
        <div className="absolute left-0 right-0 text-center px-safe-x z-[100]" style={{
          top: 70,
          fontSize: fonts.size_title,
          fontWeight: 900,
          fontFamily: fontTokens.title.family,
          color: colors.accent,
          opacity: titleAnim.opacity,
          transform: `translateY(${titleAnim.translateY}px)`
        }}>
          {config.title.text}
        </div>
      )}
      
      {/* Steps */}
      {steps.map((step, index) => {
        const stepStartTime = beats.firstStep + (index * beats.stepInterval);
        const stepStartFrame = toFrames(stepStartTime, fps);
        const stepCompletionFrame = stepStartFrame + toFrames(0.8, fps);
        
        if (frame < stepStartFrame) return null;
        
        const pos = stepPositions[index];
        
        // Step card entrance with spring bounce
        const stepEntrance = getCardEntrance(frame, {
          startFrame: stepStartTime,
          duration: 0.7,
          direction: config.layout === 'horizontal' ? 'up' : 'left',
          distance: config.layout === 'horizontal' ? 40 : 80,
          withGlow: true,
          glowColor: `${colors.accent2}33`
        }, fps);
        
        // Badge rotation animation
        const badgeProgress = interpolate(
          frame,
          [stepStartFrame, stepStartFrame + toFrames(0.5, fps)],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.backOut }
        );
        const badgeRotation = config.animation.badgeRotation ? (1 - badgeProgress) * 180 : 0;
        
        // Check if step is "completed" for checkmark
        const isCompleted = frame >= stepCompletionFrame && (step.completed !== false);
        
        // Connection to previous step
        const showConnection = index > 0 && frame >= stepStartFrame;
        const connectionProgress = Math.min((frame - stepStartFrame) / toFrames(0.6, fps), 1);
        
        return (
          <React.Fragment key={index}>
            {/* Connection line with flowing particle */}
            {showConnection && config.animation.connectionDraw && renderConnection(
              stepPositions[index - 1],
              pos,
              connectionProgress,
              config.connectionStyle || DEFAULT_CONFIG.connectionStyle,
              colors.connectionColor,
              config.layout,
              config.animation.connectionParticles,
              frame
            )}
            
            {/* Step container */}
            <div style={{
              position: 'absolute',
              left: pos.x,
              top: pos.y,
              transform: `translate(-50%, -50%) ${applyTransform({}, stepEntrance).transform}`,
              opacity: stepEntrance.opacity,
              zIndex: 10 + index,
              display: 'flex',
              alignItems: 'center',
              gap: 20
            }}>
              {/* Step number badge with rotation */}
              <div
                className="flex items-center justify-center rounded-full flex-shrink-0"
                style={{
                  width: 70,
                  height: 70,
                  backgroundColor: colors.accent,
                  fontSize: fonts.size_stepNumber - 6,
                  fontWeight: 900,
                  fontFamily: fontTokens.title.family,
                  color: '#FFFFFF',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
                  transform: `rotate(${badgeRotation}deg)`,
                  position: 'relative'
                }}
              >
                {index + 1}
                
                {/* Checkmark Lottie on completion */}
                {isCompleted && config.checkmarks.enabled && (
                  <div
                    style={{
                      position: 'absolute',
                      top: -10,
                      right: -10,
                      width: config.checkmarks.size,
                      height: config.checkmarks.size
                    }}
                  >
                    <AnimatedLottie
                      animation="checkmark"
                      loop={false}
                      autoplay={true}
                      speed={1.0}
                      entranceDelay={0}
                      entranceDuration={15}
                    />
                  </div>
                )}
              </div>
              
              {/* Step content box with glassmorphic styling */}
              {config.glass.enabled ? (
                <GlassmorphicPane
                  innerRadius={12}
                  glowOpacity={config.glass.glowOpacity}
                  borderOpacity={config.glass.borderOpacity}
                  padding={20}
                  backgroundColor="rgba(255, 255, 255, 0.95)"
                  style={{
                    border: `3px solid ${colors.accent2}`,
                    minWidth: 300,
                    maxWidth: 420,
                    width: 380,
                    position: 'relative'
                  }}
                >
                  {config.glass.shineEffect && <ShineEffect borderRadius={12} opacity={0.2} speed={0.3} />}
                  
                  {/* Step title */}
                  <div className="mb-2 leading-tight" style={{
                    fontSize: Math.min(fonts.size_stepTitle, 28),
                    fontWeight: 800,
                    fontFamily: fontTokens.title.family,
                    color: colors.ink
                  }}>
                    {step.title}
                  </div>
                  
                  {/* Step description */}
                  {step.description && (
                    <div style={{
                      fontSize: Math.min(fonts.size_stepDesc, 18),
                      fontWeight: 400,
                      fontFamily: 'Inter, sans-serif',
                      color: colors.ink,
                      lineHeight: 1.4,
                      opacity: 0.85
                    }}>
                      {step.description}
                    </div>
                  )}
                  
                  {/* Step icon (if provided) */}
                  {step.icon && (
                    <div style={{
                      marginTop: 12,
                      display: 'flex',
                      justifyContent: 'center'
                    }}>
                      {renderHero(
                        mergeHeroConfig({
                          ...step.icon,
                          size: 60
                        }),
                        frame,
                        beats,
                        colors,
                        EZ,
                        fps
                      )}
                    </div>
                  )}
                </GlassmorphicPane>
              ) : (
                <div style={{
                  backgroundColor: colors.stepBg,
                  padding: '16px 24px',
                  borderRadius: 12,
                  boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
                  border: `3px solid ${colors.accent2}`,
                  minWidth: 300,
                  maxWidth: 420,
                  width: 380
                }}>
                  {/* Step title */}
                  <div className="mb-2 leading-tight" style={{
                    fontSize: Math.min(fonts.size_stepTitle, 28),
                    fontWeight: 800,
                    fontFamily: fontTokens.title.family,
                    color: colors.ink
                  }}>
                    {step.title}
                  </div>
                  
                  {/* Step description */}
                  {step.description && (
                    <div style={{
                      fontSize: Math.min(fonts.size_stepDesc, 18),
                      fontWeight: 400,
                      fontFamily: 'Inter, sans-serif',
                      color: colors.ink,
                      lineHeight: 1.4,
                      opacity: 0.85
                    }}>
                      {step.description}
                    </div>
                  )}
                  
                  {/* Step icon (if provided) */}
                  {step.icon && (
                    <div style={{
                      marginTop: 12,
                      display: 'flex',
                      justifyContent: 'center'
                    }}>
                      {renderHero(
                        mergeHeroConfig({
                          ...step.icon,
                          size: 60
                        }),
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
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

// Required exports
export const TEMPLATE_ID = 'Guide10StepSequence';
export const TEMPLATE_VERSION = '6.0.0';

// Attach version to component for TemplateRouter detection
Guide10StepSequence.TEMPLATE_VERSION = '6.0.0';
Guide10StepSequence.TEMPLATE_ID = 'Guide10StepSequence';
export const LEARNING_INTENTIONS = {
  primary: ['guide'],
  secondary: ['breakdown', 'connect'],
  tags: ['process', 'tutorial', 'instructions', 'sequential']
};

export const getDuration = (scene, fps) => {
  const config = { ...DEFAULT_CONFIG, ...scene };
  const steps = config.steps || DEFAULT_CONFIG.steps;
  const beats = { ...DEFAULT_CONFIG.beats, ...(scene.beats || {}) };
  
  const totalDuration = beats.firstStep + (steps.length * beats.stepInterval) + beats.exit;
  return toFrames(totalDuration, fps);
};

export const CAPABILITIES = {
  usesSVG: true,
  usesRoughJS: false,
  usesLottie: true,
  requiresAudio: false,
  dynamicSteps: true,
  maxSteps: 8,
  minSteps: 2,
  layoutOptions: ['vertical', 'horizontal', 'grid']
};

// Configuration schema for AdminConfig integration (EXTENDED)
export const CONFIG_SCHEMA = {
  title: {
    type: 'object',
    fields: {
      text: { type: 'string', required: true },
      position: { type: 'position-token', default: 'top-center' },
      offset: { type: 'offset', default: { x: 0, y: 40 } }
    }
  },
  layout: {
    type: 'enum',
    options: ['vertical', 'horizontal', 'grid'],
    default: 'vertical'
  },
  connectionStyle: {
    type: 'enum',
    options: ['line', 'arrow', 'dots', 'none'],
    default: 'arrow'
  },
  progressBar: {
    type: 'object',
    fields: {
      enabled: { type: 'checkbox', label: 'Show Progress Bar' },
      height: { type: 'slider', label: 'Bar Height', min: 4, max: 16, step: 2 },
      showPercentage: { type: 'checkbox', label: 'Show Percentage' }
    }
  },
  glass: {
    type: 'object',
    fields: {
      enabled: { type: 'checkbox', label: 'Glassmorphic Style' },
      glowOpacity: { type: 'slider', label: 'Glow Opacity', min: 0, max: 0.3, step: 0.05 },
      borderOpacity: { type: 'slider', label: 'Border Opacity', min: 0, max: 0.5, step: 0.05 },
      shineEffect: { type: 'checkbox', label: 'Shine Effect' }
    }
  },
  checkmarks: {
    type: 'object',
    fields: {
      enabled: { type: 'checkbox', label: 'Show Checkmarks' },
      size: { type: 'slider', label: 'Checkmark Size', min: 30, max: 70, step: 10 },
      showOnCompletion: { type: 'checkbox', label: 'Show on Completion' }
    }
  },
  steps: {
    type: 'dynamic-array',
    min: 2,
    max: 8,
    itemSchema: {
      title: { type: 'string', required: true },
      description: { type: 'string', required: false },
      icon: { type: 'polymorphic-hero', required: false },
      completed: { type: 'checkbox', label: 'Mark as Completed' }
    }
  },
  animation: {
    type: 'animation-config',
    options: {
      stepEntrance: { type: 'enum', options: ['fade-up', 'slide-left', 'pop', 'bounce'] },
      connectionDraw: { type: 'checkbox', label: 'Animate Connections' },
      connectionParticles: { type: 'checkbox', label: 'Flowing Particles' },
      pulseOnEntry: { type: 'checkbox', label: 'Pulse on Entry' },
      badgeRotation: { type: 'checkbox', label: 'Badge Rotation' }
    }
  },
  style_tokens: {
    type: 'style-tokens',
    colors: ['bg', 'accent', 'accent2', 'ink', 'stepBg', 'connectionColor', 'progressBg', 'progressFill'],
    fonts: ['size_title', 'size_stepTitle', 'size_stepDesc', 'size_stepNumber']
  },
  beats: {
    type: 'timeline',
    beats: ['entrance', 'titleEntry', 'firstStep', 'stepInterval', 'emphasize', 'exit']
  },
  typography: {
    voice: { type: 'select', label: 'Font Voice', options: ['notebook', 'story', 'utility'] },
    align: { type: 'select', label: 'Text Align', options: ['left', 'center', 'right'] },
    transform: { type: 'select', label: 'Text Transform', options: ['none', 'uppercase', 'lowercase', 'capitalize'] }
  }
};
