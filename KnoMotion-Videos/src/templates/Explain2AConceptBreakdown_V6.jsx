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
import { GlassmorphicPane, SpotlightEffect, NoiseTexture } from '../sdk/broadcastEffects';
import { AnimatedLottie } from '../sdk/lottieIntegration';
import { getLottieFromConfig } from '../sdk/lottiePresets';
import {
  getCardEntrance,
  getIconPop,
  getPulseGlow,
  getPathDraw,
  getParticleBurst,
  renderParticleBurst,
  getScaleEmphasis,
  applyTransform
} from '../sdk/microDelights.jsx';

/**
 * TEMPLATE #3: CONCEPT BREAKDOWN - v6.0 (REVISED FOR BROADCAST QUALITY)
 * 
 * MAJOR REVISIONS BASED ON FEEDBACK:
 * ✅ Uses FULL 1920x1080 screen real estate
 * ✅ Individual part emphasis system (for VO pacing)
 * ✅ Sophisticated visual treatment (no boxes, organic design)
 * ✅ Clean center hub with proper sizing
 * ✅ Dynamic, flowing layout that doesn't feel PowerPoint-esque
 * ✅ Configurable emphasis timing per part
 * 
 * KEY FEATURES:
 * - Large radius (500px) for proper screen usage
 * - Emphasis system: highlight individual parts for VO narration
 * - Organic spoke connections with animated flow
 * - Center hub: large, clean, no overlap
 * - Parts: circular badges with icons, not boxes
 * - Sophisticated glassmorphic styling
 * - Full JSON configurability
 */

const DEFAULT_CONFIG = {
  title: {
    text: 'Understanding the Concept',
    position: 'top-center',
    offset: { x: 0, y: 80 }  // Increased to avoid top overlap
  },
  
  center: {
    text: 'Central Concept',
    visual: {
      type: 'emoji',
      value: '💡',
      scale: 3.0,  // Larger for prominence
      enabled: true
    },
    lottie: {
      enabled: false,
      preset: 'centralGlow',
      position: 'background'
    },
    glass: {
      enabled: true,
      glowOpacity: 0.25,
      borderOpacity: 0.5
    }
  },
  
  parts: [
    { 
      label: 'Part 1', 
      description: 'First component', 
      color: '#FF6B35',
      icon: '🎯',
      // NEW: Emphasis timing for VO
      emphasize: {
        enabled: false,
        startTime: 5.0,  // When to emphasize this part
        duration: 2.0     // How long to emphasize
      }
    }
  ],
  
  // NEW: Emphasis configuration
  emphasis: {
    enabled: true,
    style: 'scale-glow', // 'scale-glow', 'spotlight', 'pulse', 'isolate'
    scaleAmount: 1.15,
    glowIntensity: 30
  },
  
  layout: {
    radius: 420,        // REDUCED to avoid overlaps at edges
    centerSize: 220,    // Slightly reduced but still prominent
    partSize: 200,      // INCREASED for text to fit comfortably
    style: 'circular'   // 'circular', 'organic', 'radial'
  },
  
  visualStyle: {
    centerStyle: 'minimal',  // 'minimal', 'glass', 'solid'
    partStyle: 'badge',      // 'badge', 'circle', 'organic'
    connectionStyle: 'flow'  // 'flow', 'pulse', 'static'
  },
  
  typography: {
    voice: 'utility',
    align: 'center',
    transform: 'none'
  },
  
  style_tokens: {
    colors: {
      bg: '#0F0F1E',      // Darker for contrast
      bgGradient: true,    // Use gradient background
      center: '#FF6B35',
      connection: '#4A5568',
      text: '#FFFFFF',
      textSecondary: '#A0AEC0'
    },
    fonts: {
      size_title: 56,
      size_center: 48,
      size_part_label: 32,
      size_part_desc: 20,
      weight_title: 800,
      weight_center: 700,
      weight_part: 600
    }
  },
  
  beats: {
    entrance: 0.5,
    title: 1.0,
    centerReveal: 2.0,
    firstPart: 3.5,
    partInterval: 0.8,      // Slightly longer for better pacing
    connections: 3.0,
    hold: 12.0,
    exit: 14.0
  },
  
  animation: {
    partReveal: 'spring-bounce',
    connectionDraw: true,
    connectionParticles: true,
    pulse: false,  // Disabled by default, use emphasis instead
    centerBurst: true
  },
  
  effects: {
    particles: {
      enabled: true,
      count: 20
    },
    glow: {
      enabled: true,
      intensity: 25,
      frequency: 0.04
    },
    spotlight: {
      enabled: true,
      opacity: 0.2,
      size: 800
    },
    noiseTexture: {
      enabled: true,
      opacity: 0.03
    }
  }
};

// Calculate spoke positions with better distribution
const calculateSpokePosition = (index, totalParts, radius, centerX, centerY) => {
  // Start from top and go clockwise
  const angleOffset = -90; // Start at top
  const angle = (360 / totalParts) * index + angleOffset;
  const radian = (angle * Math.PI) / 180;
  
  return {
    x: centerX + radius * Math.cos(radian),
    y: centerY + radius * Math.sin(radian),
    angle: angle
  };
};

// Check if part should be emphasized at current frame
const isPartEmphasized = (part, frame, fps) => {
  if (!part.emphasize?.enabled) return false;
  
  const startFrame = toFrames(part.emphasize.startTime, fps);
  const endFrame = toFrames(part.emphasize.startTime + part.emphasize.duration, fps);
  
  return frame >= startFrame && frame < endFrame;
};

export const Explain2AConceptBreakdown = ({ scene, styles, presets, easingMap }) => {
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
  const visualStyle = { ...DEFAULT_CONFIG.visualStyle, ...(scene.visualStyle || {}) };
  const anim = { ...DEFAULT_CONFIG.animation, ...(scene.animation || {}) };
  const emphasisConfig = { ...DEFAULT_CONFIG.emphasis, ...(scene.emphasis || {}) };
  const effects = { 
    ...DEFAULT_CONFIG.effects, 
    ...(scene.effects || {}),
    particles: { ...DEFAULT_CONFIG.effects.particles, ...(scene.effects?.particles || {}) },
    glow: { ...DEFAULT_CONFIG.effects.glow, ...(scene.effects?.glow || {}) },
    spotlight: { ...DEFAULT_CONFIG.effects.spotlight, ...(scene.effects?.spotlight || {}) },
    noiseTexture: { ...DEFAULT_CONFIG.effects.noiseTexture, ...(scene.effects?.noiseTexture || {}) }
  };
  
  const parts = config.parts || DEFAULT_CONFIG.parts;
  const totalParts = parts.length;
  
  // Convert beats to frames
  const f_title = toFrames(beats.title, fps);
  const f_center = toFrames(beats.centerReveal, fps);
  const f_firstPart = toFrames(beats.firstPart, fps);
  const f_exit = toFrames(beats.exit, fps);
  
  // Generate particles
  const particleElements = effects.particles.enabled
    ? generateAmbientParticles({
        count: effects.particles.count,
        seed: 142,
        style: 'ambient',
        color: colors.connection,
        bounds: { w: width, h: height }
      })
    : [];
  
  renderAmbientParticles(particleElements, frame, fps, { opacity: 0.4 });
  
  // Title animation
  const titleProgress = interpolate(
    frame,
    [f_title, f_title + toFrames(0.8, fps)],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.power3Out }
  );
  
  // Center entrance
  const centerEntrance = getCardEntrance(frame, {
    startFrame: beats.centerReveal,
    duration: 1.0,
    direction: 'up',
    distance: 80,
    withGlow: effects.glow.enabled
  }, fps);
  
  // Center glow
  const centerGlow = effects.glow.enabled 
    ? getPulseGlow(frame, {
        frequency: effects.glow.frequency,
        intensity: effects.glow.intensity,
        color: `${colors.center}80`,
        startFrame: f_center
      })
    : {};
  
  // Particle burst
  const centerBurstParticles = anim.centerBurst
    ? getParticleBurst(frame, {
        triggerFrame: beats.centerReveal,
        particleCount: 20,
        duration: 1.5,
        color: colors.center,
        size: 10,
        spread: 150
      }, fps)
    : [];
  
  // Exit animation
  const exitProgress = frame >= f_exit
    ? interpolate(frame, [f_exit, f_exit + toFrames(0.8, fps)], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.power3In })
    : 0;
  
  const exitOpacity = 1 - exitProgress;
  
  // Center position
  const centerX = width / 2;
  const centerY = height / 2 + 20; // Centered with minimal offset
  
  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, fontFamily: fontTokens.body.family }}>
      {/* Gradient background */}
      {colors.bgGradient && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 50% 50%, ${colors.bg}DD 0%, ${colors.bg} 100%)`,
          zIndex: 0
        }} />
      )}
      
      {/* Noise texture */}
      {effects.noiseTexture?.enabled && (
        <NoiseTexture opacity={effects.noiseTexture.opacity} />
      )}
      
      {/* Spotlight on center */}
      {effects.spotlight?.enabled && centerEntrance.opacity > 0 && (
        <SpotlightEffect
          x={50}
          y={55}
          size={effects.spotlight.size}
          color={colors.center}
          opacity={effects.spotlight.opacity * centerEntrance.opacity}
        />
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
      
      {/* Connections with flow animation */}
      {anim.connectionDraw && frame >= toFrames(beats.connections, fps) && (
        <svg style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }}>
          <defs>
            <linearGradient id="connectionGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colors.connection} stopOpacity="0.3" />
              <stop offset="50%" stopColor={colors.connection} stopOpacity="0.8" />
              <stop offset="100%" stopColor={colors.connection} stopOpacity="0.3" />
            </linearGradient>
          </defs>
          
          {parts.map((part, i) => {
            const partBeat = f_firstPart + toFrames(beats.partInterval * i, fps);
            if (frame < partBeat) return null;
            
            const pos = calculateSpokePosition(i, totalParts, layout.radius, centerX, centerY);
            const pathLength = Math.sqrt(Math.pow(pos.x - centerX, 2) + Math.pow(pos.y - centerY, 2));
            const drawProgress = getPathDraw(frame, {
              startFrame: beats.connections + i * 0.15,
              duration: 0.8,
              pathLength
            }, fps);
            
            // Check if this part is emphasized
            const isEmphasized = isPartEmphasized(part, frame, fps);
            
            return (
              <g key={`connection-${i}`}>
                <line
                  x1={centerX}
                  y1={centerY}
                  x2={pos.x}
                  y2={pos.y}
                  stroke={isEmphasized ? part.color : "url(#connectionGrad)"}
                  strokeWidth={isEmphasized ? 4 : 2}
                  strokeDasharray={drawProgress.strokeDasharray}
                  strokeDashoffset={drawProgress.strokeDashoffset}
                  opacity={isEmphasized ? 0.9 : 0.5}
                  style={{
                    filter: isEmphasized ? `drop-shadow(0 0 12px ${part.color})` : 'none',
                    transition: 'all 0.3s ease'
                  }}
                />
                
                {/* Flowing particle */}
                {anim.connectionParticles && drawProgress.strokeDashoffset === 0 && (
                  <circle
                    cx={centerX + (pos.x - centerX) * (Math.sin((frame - partBeat) * 0.06) * 0.5 + 0.5)}
                    cy={centerY + (pos.y - centerY) * (Math.sin((frame - partBeat) * 0.06) * 0.5 + 0.5)}
                    r={isEmphasized ? 6 : 4}
                    fill={part.color}
                    opacity={isEmphasized ? 0.9 : 0.6}
                    style={{ filter: isEmphasized ? `drop-shadow(0 0 8px ${part.color})` : 'none' }}
                  />
                )}
              </g>
            );
          })}
        </svg>
      )}
      
      {/* Center burst particles */}
      {renderParticleBurst(centerBurstParticles, centerX, centerY)}
      
      {/* Center Concept - Large and Clean */}
      {centerEntrance.opacity > 0 && (
        <div
          style={{
            position: 'absolute',
            left: centerX,
            top: centerY,
            transform: `translate(-50%, -50%) scale(${centerEntrance.scale})`,
            opacity: centerEntrance.opacity * exitOpacity,
            zIndex: 5
          }}
        >
          <GlassmorphicPane
            innerRadius={layout.centerSize / 2}
            glowOpacity={config.center.glass.glowOpacity}
            borderOpacity={config.center.glass.borderOpacity}
            padding={0}
            backgroundColor={`${colors.center}15`}
            style={{
              width: layout.centerSize,
              height: layout.centerSize,
              borderRadius: '50%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: `3px solid ${colors.center}`,
              ...centerGlow
            }}
          >
            {config.center.visual?.enabled && (
              <div style={{ fontSize: layout.centerSize * 0.35, marginBottom: 8 }}>
                {config.center.visual.value}
              </div>
            )}
            <div
              style={{
                fontSize: fonts.size_center,
                fontWeight: fonts.weight_center,
                fontFamily: fontTokens.title.family,
                color: colors.text,
                lineHeight: 1.2,
                textAlign: 'center',
                padding: '0 20px'
              }}
            >
              {config.center.text}
            </div>
          </GlassmorphicPane>
        </div>
      )}
      
      {/* Parts - Circular Badges (Not Boxes!) */}
      {parts.map((part, i) => {
        const partBeat = f_firstPart + toFrames(beats.partInterval * i, fps);
        
        const partEntrance = getCardEntrance(frame, {
          startFrame: beats.firstPart + i * beats.partInterval,
          duration: 0.7,
          direction: 'up',
          distance: 50,
          withGlow: true,
          glowColor: `${part.color}40`
        }, fps);
        
        if (partEntrance.opacity === 0) return null;
        
        const pos = calculateSpokePosition(i, totalParts, layout.radius, centerX, centerY);
        
        // Icon pop
        const iconPop = part.icon ? getIconPop(frame, {
          startFrame: beats.firstPart + i * beats.partInterval + 0.3,
          duration: 0.5,
          withBounce: true
        }, fps) : null;
        
        // Emphasis check
        const isEmphasized = isPartEmphasized(part, frame, fps);
        const emphasisScale = isEmphasized ? getScaleEmphasis(frame, {
          triggerFrame: part.emphasize.startTime,
          duration: 0.4,
          maxScale: emphasisConfig.scaleAmount
        }, fps) : { scale: 1 };
        
        const emphasisGlow = isEmphasized ? {
          boxShadow: `0 0 ${emphasisConfig.glowIntensity}px ${part.color}, 0 0 ${emphasisConfig.glowIntensity * 1.5}px ${part.color}80`
        } : {};
        
        return (
          <div
            key={`part-${i}`}
            style={{
              position: 'absolute',
              left: pos.x,
              top: pos.y,
              transform: `translate(-50%, -50%) scale(${partEntrance.scale * emphasisScale.scale})`,
              opacity: partEntrance.opacity * exitOpacity,
              zIndex: isEmphasized ? 10 : 3,
              transition: 'all 0.3s ease'
            }}
          >
            {/* Circular badge design */}
            <div style={{
              width: layout.partSize,
              height: layout.partSize,
              minWidth: layout.partSize,  // Enforce uniform size
              minHeight: layout.partSize,  // Enforce uniform size
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${part.color}DD 0%, ${part.color}AA 100%)`,
              border: `4px solid ${colors.text}20`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,  // Increased padding for text breathing room
              boxSizing: 'border-box',  // Include padding in size calculation
              ...emphasisGlow,
              backdropFilter: 'blur(10px)'
            }}>
              {/* Icon */}
              {part.icon && iconPop && (
                <div style={{
                  fontSize: 40,  // Slightly smaller icon
                  marginBottom: 6,
                  opacity: iconPop.opacity,
                  transform: `scale(${iconPop.scale}) rotate(${iconPop.rotation}deg)`,
                  flexShrink: 0
                }}>
                  {part.icon}
                </div>
              )}
              
              {/* Label */}
              <div
                style={{
                  fontSize: Math.min(fonts.size_part_label, 28),  // Max 28px
                  fontWeight: fonts.weight_part,
                  fontFamily: fontTokens.accent.family,
                  color: colors.text,
                  textAlign: 'center',
                  marginBottom: 4,
                  letterSpacing: '0.02em',
                  lineHeight: 1.1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%'
                }}
              >
                {part.label}
              </div>
              
              {/* Description */}
              <div
                style={{
                  fontSize: Math.min(fonts.size_part_desc, 16),  // Max 16px
                  fontFamily: fontTokens.body.family,
                  color: colors.text,
                  textAlign: 'center',
                  opacity: 0.9,
                  lineHeight: 1.3,
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,  // Limit to 2 lines
                  WebkitBoxOrient: 'vertical',
                  maxWidth: '100%'
                }}
              >
                {part.description}
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
  const parts = config.parts || DEFAULT_CONFIG.parts;
  
  const partsDuration = beats.firstPart + (beats.partInterval * parts.length) + 2.0;
  const totalDuration = Math.max(beats.exit, partsDuration) + 1.0;
  
  return toFrames(totalDuration, fps);
};

// Metadata
export const TEMPLATE_VERSION = '6.0';
export const TEMPLATE_ID = 'Explain2AConceptBreakdown';
export const PRIMARY_INTENTION = 'BREAKDOWN';
export const SECONDARY_INTENTIONS = ['CONNECT', 'GUIDE'];

// Extended config schema with emphasis system
export const CONFIG_SCHEMA = {
  title: {
    text: { type: 'text', label: 'Title' }
  },
  center: {
    text: { type: 'text', label: 'Central Concept' },
    visual: {
      enabled: { type: 'checkbox', label: 'Show Visual' },
      type: { type: 'select', options: ['emoji', 'image'] },
      value: { type: 'text', label: 'Value' }
    },
    glass: {
      enabled: { type: 'checkbox', label: 'Glassmorphic Style' },
      glowOpacity: { type: 'slider', min: 0, max: 0.5, step: 0.05 },
      borderOpacity: { type: 'slider', min: 0, max: 0.8, step: 0.1 }
    }
  },
  parts: {
    type: 'array',
    label: 'Concept Parts',
    itemSchema: {
      label: { type: 'text', label: 'Part Label' },
      description: { type: 'text', label: 'Description' },
      color: { type: 'color', label: 'Color' },
      icon: { type: 'text', label: 'Icon (emoji)' },
      emphasize: {
        enabled: { type: 'checkbox', label: 'Enable Emphasis' },
        startTime: { type: 'number', label: 'Emphasis Start (s)', min: 0, max: 20, step: 0.5 },
        duration: { type: 'number', label: 'Emphasis Duration (s)', min: 0.5, max: 5, step: 0.5 }
      }
    }
  },
  emphasis: {
    enabled: { type: 'checkbox', label: 'Enable Emphasis System' },
    style: { type: 'select', options: ['scale-glow', 'spotlight', 'pulse'] },
    scaleAmount: { type: 'slider', label: 'Scale Amount', min: 1.0, max: 1.5, step: 0.05 },
    glowIntensity: { type: 'slider', label: 'Glow Intensity', min: 10, max: 50, step: 5 }
  },
  layout: {
    radius: { type: 'slider', label: 'Radius', min: 300, max: 600, step: 50 },
    centerSize: { type: 'slider', label: 'Center Size', min: 180, max: 300, step: 20 },
    partSize: { type: 'slider', label: 'Part Size', min: 120, max: 200, step: 20 }
  },
  animation: {
    connectionDraw: { type: 'checkbox', label: 'Animate Connections' },
    connectionParticles: { type: 'checkbox', label: 'Flow Particles' },
    centerBurst: { type: 'checkbox', label: 'Center Particle Burst' }
  },
  effects: {
    spotlight: {
      enabled: { type: 'checkbox', label: 'Spotlight Effect' },
      opacity: { type: 'slider', min: 0, max: 0.5, step: 0.05 },
      size: { type: 'slider', min: 400, max: 1000, step: 100 }
    },
    noiseTexture: {
      enabled: { type: 'checkbox', label: 'Film Grain Texture' },
      opacity: { type: 'slider', min: 0, max: 0.1, step: 0.01 }
    }
  }
};
