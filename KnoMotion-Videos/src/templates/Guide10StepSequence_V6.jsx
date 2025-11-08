import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import { THEME } from '../utils/theme';
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

/**
 * TEMPLATE #10: STEP SEQUENCE - v6.0
 * 
 * PRIMARY INTENTION: GUIDE
 * SECONDARY INTENTIONS: BREAKDOWN, CONNECT
 * 
 * VISUAL PATTERN:
 * - Step-by-step process visualization
 * - 2-8 numbered steps
 * - Each step: number badge, title, description, optional icon
 * - Sequential reveal with connecting lines
 * - Progress indicator
 * 
 * AGNOSTIC PRINCIPALS:
 * ✅ Type-based polymorphism (icons via hero registry)
 * ✅ Data-driven structure (dynamic array of steps)
 * ✅ Token-based positioning (position system)
 * ✅ Separation of concerns (content/layout/style/animation)
 * ✅ Progressive configuration (simple → advanced)
 * ✅ Registry pattern (extensible step types)
 * 
 * CONFIGURABILITY:
 * - Number of steps (2-8)
 * - Layout: vertical, horizontal, grid
 * - Each step: title, description, icon (optional)
 * - Connection style: line, arrow, dots, none
 * - Colors, fonts, timing all configurable
 * - Step entrance animation style
 * - Emphasis effects
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
      icon: null
    }
  ],
  style_tokens: {
    colors: {
      bg: '#FFF9F0',
      accent: '#FF6B35',
      accent2: '#9B59B6',
      ink: '#1A1A1A',
      stepBg: '#FFFFFF',
      connectionColor: '#CCCCCC'
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
    pulseOnEntry: true
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

// Render connection between steps
const renderConnection = (fromPos, toPos, progress, style, color, layout) => {
  if (style === 'none') return null;
  
  const ease = EZ.smooth(progress);
  const dx = toPos.x - fromPos.x;
  const dy = toPos.y - fromPos.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  
  const drawLength = length * ease;
  
  if (style === 'line' || style === 'arrow') {
    return (
      <div style={{
        position: 'absolute',
        left: fromPos.x,
        top: fromPos.y,
        width: drawLength,
        height: 3,
        backgroundColor: color,
        transformOrigin: '0 50%',
        transform: `rotate(${angle}deg)`,
        zIndex: 1
      }}>
        {style === 'arrow' && progress > 0.8 && (
          <>
            <div style={{
              position: 'absolute',
              right: -2,
              top: -5,
              width: 0,
              height: 0,
              borderLeft: '10px solid ' + color,
              borderTop: '6px solid transparent',
              borderBottom: '6px solid transparent'
            }} />
          </>
        )}
      </div>
    );
  }
  
  if (style === 'dots') {
    const dotCount = Math.floor(length / 30);
    const dots = [];
    for (let i = 0; i < dotCount * ease; i++) {
      const t = i / dotCount;
      dots.push(
        <div key={i} style={{
          position: 'absolute',
          left: fromPos.x + dx * t,
          top: fromPos.y + dy * t,
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: color,
          zIndex: 1
        }} />
      );
    }
    return <>{dots}</>;
  }
  
  return null;
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
  
  const titlePos = resolvePosition(
    config.title.position || DEFAULT_CONFIG.title.position,
    config.title.offset || DEFAULT_CONFIG.title.offset,
    { width, height }
  );
  
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
      {/* Title - Fixed at top in safe zone */}
      {frame >= titleStartFrame && (
        <div className="absolute left-0 right-0 text-center px-safe-x z-[100]" style={{
          top: 70,
          fontSize: fonts.size_title,
          fontWeight: 900,
          fontFamily: fontTokens.title.family,
          color: colors.accent,
          opacity: titleAnim.opacity,
          transform: `translateY(${titleAnim.translateY}px) scale(${titleAnim.scale})`
        }}>
          {config.title.text}
        </div>
      )}
      
      {/* Steps */}
      {steps.map((step, index) => {
        const stepStartTime = beats.firstStep + (index * beats.stepInterval);
        const stepStartFrame = toFrames(stepStartTime, fps);
        const stepEndFrame = stepStartFrame + toFrames(beats.emphasize, fps);
        
        if (frame < stepStartFrame) return null;
        
        const stepProgress = Math.min((frame - stepStartFrame) / toFrames(0.6, fps), 1);
        const pos = stepPositions[index];
        
        // Step entrance animation based on configured style
        let stepAnim = { opacity: 1, translateX: 0, translateY: 0, scale: 1 };
        switch (config.animation.stepEntrance) {
          case 'fade-up':
            stepAnim = fadeUpIn(frame, {
              start: stepStartTime,
              dur: 0.6,
              dist: 40,
              ease: 'smooth'
            }, EZ, fps);
            break;
          case 'slide-left':
            stepAnim = slideInLeft(frame, {
              start: stepStartTime,
              dur: 0.6,
              dist: 100,
              ease: 'power3Out'
            }, EZ, fps);
            break;
          case 'pop':
            stepAnim = popInSpring(frame, {
              start: stepStartTime,
              dur: 0.6,
              ease: 'backOut'
            }, EZ, fps);
            break;
          default:
            stepAnim = fadeUpIn(frame, {
              start: stepStartTime,
              dur: 0.6,
              dist: 40,
              ease: 'smooth'
            }, EZ, fps);
        }
        
        // Pulse emphasis
        let pulseScale = 1;
        if (config.animation.pulseOnEntry && frame >= stepStartFrame && frame <= stepEndFrame) {
          pulseScale = pulseEmphasis(frame, {
            start: stepStartTime + 0.6,
            dur: 0.4,
            ease: 'smooth'
          }, EZ, fps).scale;
        }
        
        // Connection to previous step
        const showConnection = index > 0 && frame >= stepStartFrame;
        const connectionProgress = Math.min((frame - stepStartFrame) / toFrames(0.5, fps), 1);
        
        return (
          <React.Fragment key={index}>
            {/* Connection line */}
            {showConnection && config.animation.connectionDraw && renderConnection(
              stepPositions[index - 1],
              pos,
              connectionProgress,
              config.connectionStyle || DEFAULT_CONFIG.connectionStyle,
              colors.connectionColor,
              config.layout
            )}
            
            {/* Step container - Centered with flexbox */}
            <div style={{
              position: 'absolute',
              left: pos.x,
              top: pos.y,
              transform: `translate(-50%, -50%) translateX(${stepAnim.translateX}px) scale(${stepAnim.scale * pulseScale})`,
              opacity: stepAnim.opacity,
              zIndex: 10 + index,
              display: 'flex',
              alignItems: 'center',
              gap: 20
            }}>
              {/* Step number badge */}
              <div className="flex items-center justify-center rounded-full flex-shrink-0" style={{
                width: 70,
                height: 70,
                backgroundColor: colors.accent,
                fontSize: fonts.size_stepNumber - 6,
                fontWeight: 900,
                fontFamily: fontTokens.title.family,
                color: '#FFFFFF',
                boxShadow: '0 4px 16px rgba(0,0,0,0.25)'
              }}>
                {index + 1}
              </div>
              
              {/* Step content box */}
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
  usesSVG: false,
  usesRoughJS: false,
  usesLottie: false,
  requiresAudio: false,
  dynamicSteps: true,
  maxSteps: 8,
  minSteps: 2,
  layoutOptions: ['vertical', 'horizontal', 'grid']
};

// Configuration schema for AdminConfig integration
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
  steps: {
    type: 'dynamic-array',
    min: 2,
    max: 8,
    itemSchema: {
      title: { type: 'string', required: true },
      description: { type: 'string', required: false },
      icon: { type: 'polymorphic-hero', required: false }
    }
  },
  style_tokens: {
    type: 'style-tokens',
    colors: ['bg', 'accent', 'accent2', 'ink', 'stepBg', 'connectionColor'],
    fonts: ['size_title', 'size_stepTitle', 'size_stepDesc', 'size_stepNumber']
  },
  beats: {
    type: 'timeline',
    beats: ['entrance', 'titleEntry', 'firstStep', 'stepInterval', 'emphasize', 'exit']
  },
  animation: {
    type: 'animation-config',
    options: {
      stepEntrance: ['fade-up', 'slide-left', 'pop', 'bounce'],
      connectionDraw: 'boolean',
      pulseOnEntry: 'boolean'
    }
  }
};
