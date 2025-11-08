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
import { GlassmorphicPane, SpotlightEffect, FloatingParticles } from '../sdk/broadcastEffects';
import { AnimatedLottie } from '../sdk/lottieIntegration';
import { getLottieFromConfig } from '../sdk/lottiePresets';
import {
  getCardEntrance,
  getIconPop,
  getPulseGlow,
  getPathDraw,
  getParticleBurst,
  renderParticleBurst,
  applyTransform
} from '../sdk/microDelights';

/**
 * TEMPLATE #3: CONCEPT BREAKDOWN - v6.0 (POLISHED)
 * 
 * PRIMARY INTENTION: BREAKDOWN
 * SECONDARY INTENTIONS: CONNECT, GUIDE
 * 
 * PURPOSE: Deconstruct complex concepts into manageable parts
 * 
 * VISUAL PATTERN:
 * - Hub-and-spoke layout with glassmorphic styling
 * - Central concept with pulsing glow and optional Lottie
 * - Radiating parts (2-8) with color-coded glassmorphic cards
 * - Animated connecting lines with particle flows
 * - Sequential reveals with spring bounces
 * 
 * ENHANCEMENTS (ALL CONFIGURABLE VIA JSON):
 * ✨ Glassmorphic cards for center hub and parts
 * ✨ Lottie animations in center and parts
 * ✨ Pulsing glow effects
 * ✨ Particle burst on reveals
 * ✨ Animated connector lines with flow particles
 * ✨ Spring bounce entrances
 * ✨ Spotlight effect on center
 * 
 * AGNOSTIC PRINCIPALS:
 * ✓ Type-Based Polymorphism (hero registry for visuals)
 * ✓ Data-Driven Structure (dynamic parts array)
 * ✓ Token-Based Positioning (auto-calculated spoke positions)
 * ✓ Separation of Concerns (content/layout/style/animation)
 * ✓ Progressive Configuration (simple defaults)
 * ✓ Registry Pattern (extensible visual types)
 * 
 * NO HARDCODED VALUES!
 */

// DEFAULT CONFIGURATION
const DEFAULT_CONFIG = {
  title: {
    text: 'Understanding the Concept',
    position: 'top-center',
    offset: { x: 0, y: 60 }
  },
  
  center: {
    text: 'Central Concept',
    visual: {
      type: 'emoji',
      value: '💡',
      scale: 2.0,
      enabled: false
    },
    // NEW: Lottie configuration
    lottie: {
      enabled: false,
      preset: 'centralGlow', // or custom config
      position: 'background' // 'background', 'icon', or 'overlay'
    },
    // NEW: Glassmorphic styling
    glass: {
      enabled: true,
      glowOpacity: 0.2,
      borderOpacity: 0.4
    }
  },
  
  parts: [
    { 
      label: 'Part 1', 
      description: 'First component', 
      color: '#FF6B35',
      icon: '🎯', // Optional emoji icon
      lottie: { enabled: false } // Optional Lottie per part
    },
    { 
      label: 'Part 2', 
      description: 'Second component', 
      color: '#2ECC71',
      icon: '✨'
    },
    { 
      label: 'Part 3', 
      description: 'Third component', 
      color: '#9B59B6',
      icon: '🚀'
    },
    { 
      label: 'Part 4', 
      description: 'Fourth component', 
      color: '#3498DB',
      icon: '💎'
    }
  ],
  
  typography: {
    voice: 'utility',
    align: 'center',
    transform: 'none'
  },
  
  style_tokens: {
    colors: {
      bg: '#FFF9F0',
      center: '#FF6B35',
      connection: '#CBD5E0',
      text: '#1A1A1A',
      textSecondary: '#5A5A5A'
    },
    fonts: {
      size_title: 52,
      size_center: 44,
      size_part_label: 28,
      size_part_desc: 18,
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
    partInterval: 0.6,
    connections: 3.0,
    emphasis: 7.0,
    hold: 9.0,
    exit: 11.0
  },
  
  layout: {
    radius: 350,
    centerSize: 180,
    partSize: 140
  },
  
  animation: {
    partReveal: 'spring-bounce', // 'spring-bounce', 'pop-in', 'fade-up'
    connectionDraw: true,
    connectionParticles: true, // NEW: Particles flowing along connections
    pulse: true,
    centerBurst: true // NEW: Particle burst when center appears
  },
  
  effects: {
    particles: {
      enabled: true,
      count: 15
    },
    glow: {
      enabled: true,
      intensity: 20,
      frequency: 0.05
    },
    spotlight: {
      enabled: true, // NEW: Spotlight on center
      opacity: 0.15,
      size: 600
    }
  },
  
  transition: {
    exit: {
      style: 'fade',
      durationInFrames: 18,
      easing: 'smooth'
    }
  }
};

// Calculate spoke positions for parts
const calculateSpokePosition = (index, totalParts, radius, centerX, centerY) => {
  const angleOffset = totalParts === 2 ? 90 : 0;
  const angle = (360 / totalParts) * index + angleOffset;
  const radian = (angle * Math.PI) / 180;
  
  return {
    x: centerX + radius * Math.cos(radian),
    y: centerY + radius * Math.sin(radian)
  };
};

// MAIN COMPONENT
export const Explain2AConceptBreakdown = ({ scene, styles, presets, easingMap }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  
  // Load fonts
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
  const anim = { ...DEFAULT_CONFIG.animation, ...(scene.animation || {}) };
  const effects = { 
    ...DEFAULT_CONFIG.effects, 
    ...(scene.effects || {}),
    particles: { ...DEFAULT_CONFIG.effects.particles, ...(scene.effects?.particles || {}) },
    glow: { ...DEFAULT_CONFIG.effects.glow, ...(scene.effects?.glow || {}) },
    spotlight: { ...DEFAULT_CONFIG.effects.spotlight, ...(scene.effects?.spotlight || {}) }
  };
  
  // Parts data
  const parts = config.parts || DEFAULT_CONFIG.parts;
  const totalParts = parts.length;
  
  // Convert beats to frames
  const f_entrance = toFrames(beats.entrance, fps);
  const f_title = toFrames(beats.title, fps);
  const f_center = toFrames(beats.centerReveal, fps);
  const f_firstPart = toFrames(beats.firstPart, fps);
  const f_connections = toFrames(beats.connections, fps);
  const f_emphasis = toFrames(beats.emphasis, fps);
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
  
  // ==================== ANIMATIONS ====================
  
  // Title animation
  const titleProgress = interpolate(
    frame,
    [f_title, f_title + toFrames(0.8, fps)],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: EZ.power3Out
    }
  );
  
  const titleOpacity = titleProgress;
  const titleY = (1 - titleProgress) * 30;
  
  // Center concept animation with spring bounce
  const centerEntrance = getCardEntrance(frame, {
    startFrame: beats.centerReveal,
    duration: 0.8,
    direction: 'up',
    distance: 60,
    withGlow: effects.glow.enabled
  }, fps);
  
  // Center pulse glow
  const centerGlow = effects.glow.enabled 
    ? getPulseGlow(frame, {
        frequency: effects.glow.frequency,
        intensity: effects.glow.intensity,
        color: `${colors.center}66`,
        startFrame: f_center
      })
    : {};
  
  // Particle burst when center appears
  const centerBurstParticles = anim.centerBurst
    ? getParticleBurst(frame, {
        triggerFrame: beats.centerReveal,
        particleCount: 16,
        duration: 1.2,
        color: colors.center,
        size: 8,
        spread: 120
      }, fps)
    : [];
  
  // Exit animation
  const exitProgress = frame >= f_exit
    ? interpolate(
        frame,
        [f_exit, f_exit + toFrames(0.8, fps)],
        [0, 1],
        {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: EZ.power3In
        }
      )
    : 0;
  
  const exitOpacity = 1 - exitProgress;
  
  // Center position
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Center Lottie configuration
  const centerLottieConfig = config.center.lottie?.enabled 
    ? getLottieFromConfig(config.center.lottie)
    : null;
  
  return (
    <AbsoluteFill
      className="overflow-hidden"
      style={{
        backgroundColor: colors.bg,
        fontFamily: fontTokens.body.family
      }}
    >
      {/* Spotlight Effect on Center */}
      {effects.spotlight?.enabled && centerEntrance.opacity > 0 && (
        <SpotlightEffect
          x={50}
          y={50}
          size={effects.spotlight.size}
          color={colors.center}
          opacity={effects.spotlight.opacity * centerEntrance.opacity}
        />
      )}
      
      {/* Particle Background */}
      <svg
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
      >
        {particleElements.map(p => p.element)}
      </svg>
      
      {/* Title */}
      <div
        className="absolute left-1/2 -translate-x-1/2 text-center max-w-[90%]"
        style={{
          top: config.title.offset.y,
          transform: `translate(-50%, ${titleY}px)`,
          fontSize: fonts.size_title,
          fontWeight: fonts.weight_title,
          fontFamily: fontTokens.title.family,
          color: colors.text,
          opacity: titleOpacity * exitOpacity,
          textAlign: typography.align,
          textTransform: typography.transform !== 'none' ? typography.transform : undefined
        }}
      >
        {config.title.text}
      </div>
      
      {/* Connections with animated particles */}
      {anim.connectionDraw && frame >= f_connections && (
        <svg
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            pointerEvents: 'none'
          }}
        >
          {parts.map((part, i) => {
            const partBeat = f_firstPart + toFrames(beats.partInterval * i, fps);
            if (frame < partBeat) return null;
            
            const pos = calculateSpokePosition(i, totalParts, layout.radius, centerX, centerY);
            
            // Animated line drawing
            const pathLength = Math.sqrt(Math.pow(pos.x - centerX, 2) + Math.pow(pos.y - centerY, 2));
            const drawProgress = getPathDraw(frame, {
              startFrame: beats.connections + i * 0.15,
              duration: 0.8,
              pathLength
            }, fps);
            
            return (
              <g key={`connection-${i}`}>
                <line
                  x1={centerX}
                  y1={centerY}
                  x2={pos.x}
                  y2={pos.y}
                  stroke={part.color || colors.connection}
                  strokeWidth={3}
                  strokeDasharray={drawProgress.strokeDasharray}
                  strokeDashoffset={drawProgress.strokeDashoffset}
                  opacity={0.6 * exitOpacity}
                  style={{
                    filter: effects.glow?.enabled ? `drop-shadow(0 0 6px ${part.color})` : 'none'
                  }}
                />
                
                {/* Flowing particle along connection */}
                {anim.connectionParticles && drawProgress.strokeDashoffset === 0 && (
                  <circle
                    cx={centerX + (pos.x - centerX) * (Math.sin((frame - partBeat) * 0.08) * 0.5 + 0.5)}
                    cy={centerY + (pos.y - centerY) * (Math.sin((frame - partBeat) * 0.08) * 0.5 + 0.5)}
                    r={4}
                    fill={part.color}
                    opacity={0.6}
                  />
                )}
              </g>
            );
          })}
        </svg>
      )}
      
      {/* Center Concept Burst Particles */}
      {renderParticleBurst(centerBurstParticles, centerX, centerY)}
      
      {/* Center Concept with Glassmorphic Styling */}
      {centerEntrance.opacity > 0 && (
        <div
          style={{
            position: 'absolute',
            left: centerX,
            top: centerY,
            transform: `translate(-50%, -50%) ${applyTransform({}, centerEntrance).transform}`,
            opacity: centerEntrance.opacity * exitOpacity,
            ...centerGlow
          }}
        >
          {config.center.glass?.enabled ? (
            <GlassmorphicPane
              innerRadius={layout.centerSize / 2}
              glowOpacity={config.center.glass.glowOpacity}
              borderOpacity={config.center.glass.borderOpacity}
              padding={0}
              backgroundColor={`${colors.center}22`}
              style={{
                width: layout.centerSize,
                height: layout.centerSize,
                borderRadius: '50%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {centerLottieConfig && centerLottieConfig.position === 'background' && (
                <div style={{ position: 'absolute', inset: 0, opacity: 0.3 }}>
                  <AnimatedLottie
                    animation={centerLottieConfig.animation}
                    loop={centerLottieConfig.loop}
                    autoplay={centerLottieConfig.autoplay}
                    speed={centerLottieConfig.speed}
                    style={centerLottieConfig.style}
                    entranceDelay={centerLottieConfig.entranceDelay || 0}
                    entranceDuration={centerLottieConfig.entranceDuration || 20}
                  />
                </div>
              )}
              
              {config.center.visual?.enabled && (
                <div style={{ marginBottom: 8 }}>
                  {renderHero(
                    mergeHeroConfig({
                      type: config.center.visual.type,
                      value: config.center.visual.value,
                      scale: config.center.visual.scale
                    }),
                    frame,
                    beats,
                    colors,
                    easingMap || EZ,
                    fps
                  )}
                </div>
              )}
              <div
                className="text-center"
                style={{
                  fontSize: fonts.size_center,
                  fontWeight: fonts.weight_center,
                  fontFamily: fontTokens.title.family,
                  color: colors.text,
                  lineHeight: 1.2,
                  padding: 16,
                  zIndex: 1
                }}
              >
                {config.center.text}
              </div>
            </GlassmorphicPane>
          ) : (
            <div
              style={{
                width: layout.centerSize,
                height: layout.centerSize,
                borderRadius: '50%',
                backgroundColor: colors.center,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: effects.glow?.enabled 
                  ? `0 0 30px rgba(255, 107, 53, 0.4)`
                  : '0 4px 12px rgba(0,0,0,0.1)',
                padding: 16
              }}
            >
              {config.center.visual?.enabled && (
                <div style={{ marginBottom: 8 }}>
                  {renderHero(
                    mergeHeroConfig({
                      type: config.center.visual.type,
                      value: config.center.visual.value,
                      scale: config.center.visual.scale
                    }),
                    frame,
                    beats,
                    colors,
                    easingMap || EZ,
                    fps
                  )}
                </div>
              )}
              <div
                className="text-center"
                style={{
                  fontSize: fonts.size_center,
                  fontWeight: fonts.weight_center,
                  fontFamily: fontTokens.title.family,
                  color: '#FFFFFF',
                  lineHeight: 1.2
                }}
              >
                {config.center.text}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Parts (spokes) with Glassmorphic Cards */}
      {parts.map((part, i) => {
        const partBeat = f_firstPart + toFrames(beats.partInterval * i, fps);
        
        const partEntrance = getCardEntrance(frame, {
          startFrame: beats.firstPart + i * beats.partInterval,
          duration: 0.6,
          direction: 'up',
          distance: 40,
          withGlow: true,
          glowColor: `${part.color}33`
        }, fps);
        
        if (partEntrance.opacity === 0) return null;
        
        const pos = calculateSpokePosition(i, totalParts, layout.radius, centerX, centerY);
        
        // Icon pop animation
        const iconPop = part.icon ? getIconPop(frame, {
          startFrame: beats.firstPart + i * beats.partInterval + 0.3,
          duration: 0.4,
          withBounce: true
        }, fps) : null;
        
        return (
          <div
            key={`part-${i}`}
            style={{
              position: 'absolute',
              left: pos.x,
              top: pos.y,
              transform: `translate(-50%, -50%) ${applyTransform({}, partEntrance).transform}`,
              width: layout.partSize,
              minHeight: layout.partSize,
              opacity: partEntrance.opacity * exitOpacity
            }}
          >
            <GlassmorphicPane
              innerRadius={12}
              glowOpacity={0.15}
              borderOpacity={0.3}
              padding={16}
              backgroundColor="rgba(255, 255, 255, 0.95)"
              style={{
                border: `3px solid ${part.color || colors.center}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: layout.partSize - 32
              }}
            >
              {/* Icon with pop animation */}
              {part.icon && iconPop && (
                <div 
                  style={{
                    fontSize: 32,
                    marginBottom: 8,
                    opacity: iconPop.opacity,
                    transform: `scale(${iconPop.scale}) rotate(${iconPop.rotation}deg)`
                  }}
                >
                  {part.icon}
                </div>
              )}
              
              <div
                className="text-center mb-2"
                style={{
                  fontSize: fonts.size_part_label,
                  fontWeight: fonts.weight_part,
                  fontFamily: fontTokens.accent.family,
                  color: part.color || colors.center
                }}
              >
                {part.label}
              </div>
              <div
                className="text-center leading-tight"
                style={{
                  fontSize: fonts.size_part_desc,
                  fontFamily: fontTokens.body.family,
                  color: colors.textSecondary
                }}
              >
                {part.description}
              </div>
            </GlassmorphicPane>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// DURATION CALCULATION
export const getDuration = (scene, fps) => {
  const config = { ...DEFAULT_CONFIG, ...scene };
  const beats = { ...DEFAULT_CONFIG.beats, ...(scene.beats || {}) };
  const parts = config.parts || DEFAULT_CONFIG.parts;
  
  // Calculate based on number of parts
  const partsDuration = beats.firstPart + (beats.partInterval * parts.length) + 2.0;
  const totalDuration = Math.max(beats.exit, partsDuration) + 1.0;
  
  return toFrames(totalDuration, fps);
};

// METADATA
export const TEMPLATE_VERSION = '6.0';
export const TEMPLATE_ID = 'Explain2AConceptBreakdown';
export const PRIMARY_INTENTION = 'BREAKDOWN';
export const SECONDARY_INTENTIONS = ['CONNECT', 'GUIDE'];

// CONFIG SCHEMA (EXTENDED)
export const CONFIG_SCHEMA = {
  title: {
    text: { type: 'text', label: 'Title' }
  },
  center: {
    text: { type: 'text', label: 'Central Concept' },
    visual: {
      enabled: { type: 'checkbox', label: 'Show Visual' },
      type: { type: 'select', label: 'Type', options: ['emoji', 'image', 'roughSVG'] },
      value: { type: 'text', label: 'Value' }
    },
    lottie: {
      enabled: { type: 'checkbox', label: 'Enable Lottie Animation' },
      preset: { type: 'select', label: 'Lottie Preset', options: ['centralGlow', 'sparkle', 'insight'] },
      position: { type: 'select', label: 'Position', options: ['background', 'icon', 'overlay'] }
    },
    glass: {
      enabled: { type: 'checkbox', label: 'Glassmorphic Style' },
      glowOpacity: { type: 'slider', label: 'Glow Opacity', min: 0, max: 0.5, step: 0.05 },
      borderOpacity: { type: 'slider', label: 'Border Opacity', min: 0, max: 0.6, step: 0.05 }
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
      lottie: {
        enabled: { type: 'checkbox', label: 'Enable Lottie' }
      }
    }
  },
  animation: {
    partReveal: { type: 'select', label: 'Part Animation', options: ['spring-bounce', 'pop-in', 'fade-up'] },
    connectionDraw: { type: 'checkbox', label: 'Animate Connections' },
    connectionParticles: { type: 'checkbox', label: 'Particle Flow on Connections' },
    pulse: { type: 'checkbox', label: 'Pulse Effect' },
    centerBurst: { type: 'checkbox', label: 'Center Particle Burst' }
  },
  effects: {
    glow: {
      enabled: { type: 'checkbox', label: 'Enable Glow' },
      intensity: { type: 'slider', label: 'Glow Intensity', min: 0, max: 40, step: 5 },
      frequency: { type: 'slider', label: 'Pulse Frequency', min: 0.01, max: 0.2, step: 0.01 }
    },
    spotlight: {
      enabled: { type: 'checkbox', label: 'Enable Spotlight' },
      opacity: { type: 'slider', label: 'Spotlight Opacity', min: 0, max: 0.5, step: 0.05 },
      size: { type: 'slider', label: 'Spotlight Size', min: 300, max: 900, step: 100 }
    }
  },
  typography: {
    voice: { type: 'select', label: 'Font Voice', options: ['notebook', 'story', 'utility'] },
    align: { type: 'select', label: 'Text Align', options: ['left', 'center', 'right'] },
    transform: { type: 'select', label: 'Text Transform', options: ['none', 'uppercase', 'lowercase', 'capitalize'] }
  },
  transition: {
    exit: {
      style: { type: 'select', label: 'Exit Style', options: ['none', 'fade', 'slide', 'wipe'] },
      durationInFrames: { type: 'number', label: 'Exit Duration (frames)', min: 6, max: 60 }
    }
  }
};
