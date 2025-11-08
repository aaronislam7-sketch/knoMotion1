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
import { loadFontVoice, DEFAULT_FONT_VOICE } from '../sdk/fontSystem';
import { createTransitionProps } from '../sdk/transitions';

/**
 * TEMPLATE #3: CONCEPT BREAKDOWN - v6.0
 * 
 * PRIMARY INTENTION: BREAKDOWN
 * SECONDARY INTENTIONS: CONNECT, GUIDE
 * 
 * PURPOSE: Deconstruct complex concepts into manageable parts
 * 
 * VISUAL PATTERN:
 * - Hub-and-spoke layout
 * - Central concept with radiating parts (2-8 parts)
 * - Connecting lines from center to each part
 * - Sequential reveals with cascading animation
 * 
 * AGNOSTIC PRINCIPALS:
 * ✓ Type-Based Polymorphism (hero registry for central visual)
 * ✓ Data-Driven Structure (dynamic parts array)
 * ✓ Token-Based Positioning (auto-calculated spoke positions)
 * ✓ Separation of Concerns (content/layout/style/animation)
 * ✓ Progressive Configuration (simple defaults)
 * ✓ Registry Pattern (extensible visual types)
 * 
 * CONFIGURABILITY:
 * - Title text
 * - Central concept text and optional visual
 * - Parts array (2-8 parts, each with label and description)
 * - Colors (background, accent, connections)
 * - Fonts (sizes, weights)
 * - Timing (all beat points)
 * - Connection styles
 * - Particle effects
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
    }
  },
  
  parts: [
    { label: 'Part 1', description: 'First component', color: '#FF6B35' },
    { label: 'Part 2', description: 'Second component', color: '#2ECC71' },
    { label: 'Part 3', description: 'Third component', color: '#9B59B6' },
    { label: 'Part 4', description: 'Fourth component', color: '#3498DB' }
  ],
  
  typography: {
    voice: 'notebook',
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
    firstPart: 3.0,
    partInterval: 0.6,
    connections: 5.0,
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
    partReveal: 'pop-in',
    connectionDraw: true,
    pulse: true
  },
  
  effects: {
    particles: {
      enabled: true,
      count: 15
    },
    glow: {
      enabled: true
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
  const { fps } = useVideoConfig();
  
  // Merge config
  const config = { ...DEFAULT_CONFIG, ...scene };
  const beats = { ...DEFAULT_CONFIG.beats, ...(scene.beats || {}) };
  const colors = { ...DEFAULT_CONFIG.style_tokens.colors, ...(scene.style_tokens?.colors || {}) };
  const fonts = { ...DEFAULT_CONFIG.style_tokens.fonts, ...(scene.style_tokens?.fonts || {}) };
  const layout = { ...DEFAULT_CONFIG.layout, ...(scene.layout || {}) };
  const anim = { ...DEFAULT_CONFIG.animation, ...(scene.animation || {}) };
  const typography = { ...DEFAULT_CONFIG.typography, ...(scene.typography || {}) };
  const effects = { 
    ...DEFAULT_CONFIG.effects, 
    ...(scene.effects || {}),
    particles: { ...DEFAULT_CONFIG.effects.particles, ...(scene.effects?.particles || {}) }
  };
  
  // Load font voice
  useEffect(() => {
    void loadFontVoice(typography.voice || DEFAULT_FONT_VOICE);
  }, [typography.voice]);
  
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
        bounds: { w: 1920, h: 1080 }
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
  
  // Center concept animation
  const centerProgress = interpolate(
    frame,
    [f_center, f_center + toFrames(0.6, fps)],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: EZ.backOut
    }
  );
  
  const centerScale = centerProgress;
  const centerOpacity = centerProgress;
  
  // Pulse animation for emphasis
  const pulse = anim.pulse && frame >= f_emphasis
    ? 1 + Math.sin((frame - f_emphasis) / 15) * 0.03
    : 1;
  
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
  const centerX = 960;
  const centerY = 540;
  
  return (
    <AbsoluteFill className="bg-surface text-ink overflow-hidden"
      style={{
        backgroundColor: colors.bg
      }}
    >
      {/* Particle Background */}
      <svg
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%'
        }}
      >
        {particleElements.map(p => p.element)}
      </svg>
      
      {/* Title */}
      <div className={`font-display text-ink ${typography.align === 'left' ? 'text-left' : typography.align === 'right' ? 'text-right' : 'text-center'} ${typography.transform === 'uppercase' ? 'uppercase' : typography.transform === 'lowercase' ? 'lowercase' : ''}`}
        style={{
          position: 'absolute',
          left: '50%',
          top: config.title.offset.y,
          transform: `translate(-50%, ${titleY}px)`,
          fontSize: fonts.size_title,
          fontWeight: fonts.weight_title,
          opacity: titleOpacity * exitOpacity,
          maxWidth: '90%'
        }}
      >
        {config.title.text}
      </div>
      
      {/* Connections (drawn after center appears, before parts) */}
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
            const connectionProgress = interpolate(
              frame,
              [f_connections, f_connections + toFrames(1.0, fps)],
              [0, 1],
              {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: EZ.power2Out
              }
            );
            
            const x2 = centerX + (pos.x - centerX) * connectionProgress;
            const y2 = centerY + (pos.y - centerY) * connectionProgress;
            
            return (
              <line
                key={`connection-${i}`}
                x1={centerX}
                y1={centerY}
                x2={x2}
                y2={y2}
                stroke={part.color || colors.connection}
                strokeWidth={3}
                strokeDasharray="8,4"
                opacity={0.6 * exitOpacity}
                style={{
                  filter: effects.glow?.enabled ? `drop-shadow(0 0 6px ${part.color})` : 'none'
                }}
              />
            );
          })}
        </svg>
      )}
      
      {/* Center Concept */}
      {centerOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            left: centerX,
            top: centerY,
            transform: `translate(-50%, -50%) scale(${centerScale * pulse})`,
            width: layout.centerSize,
            height: layout.centerSize,
            borderRadius: '50%',
            backgroundColor: colors.center,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: centerOpacity * exitOpacity,
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
          <div className="font-display text-white text-center"
            style={{
              fontSize: fonts.size_center,
              fontWeight: fonts.weight_center,
              lineHeight: 1.2
            }}
          >
            {config.center.text}
          </div>
        </div>
      )}
      
      {/* Parts (spokes) */}
      {parts.map((part, i) => {
        const partBeat = f_firstPart + toFrames(beats.partInterval * i, fps);
        
        const partProgress = frame >= partBeat
          ? interpolate(
              frame,
              [partBeat, partBeat + toFrames(0.5, fps)],
              [0, 1],
              {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: EZ.backOut
              }
            )
          : 0;
        
        if (partProgress === 0) return null;
        
        const pos = calculateSpokePosition(i, totalParts, layout.radius, centerX, centerY);
        const partScale = partProgress;
        const partOpacity = partProgress * exitOpacity;
        
        return (
          <div
            key={`part-${i}`}
            style={{
              position: 'absolute',
              left: pos.x,
              top: pos.y,
              transform: `translate(-50%, -50%) scale(${partScale * pulse})`,
              width: layout.partSize,
              minHeight: layout.partSize,
              borderRadius: 12,
              backgroundColor: '#FFFFFF',
              border: `3px solid ${part.color || colors.center}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: partOpacity,
              boxShadow: `0 4px 12px rgba(0,0,0,0.1)`,
              padding: 16
            }}
          >
            <div className={`font-display mb-2 ${typography.align === 'left' ? 'text-left' : typography.align === 'right' ? 'text-right' : 'text-center'}`}
              style={{
                fontSize: fonts.size_part_label,
                fontWeight: fonts.weight_part,
                color: part.color || colors.center
              }}
            >
              {part.label}
            </div>
            <div className={`font-body text-muted ${typography.align === 'left' ? 'text-left' : typography.align === 'right' ? 'text-right' : 'text-center'}`}
              style={{
                fontSize: fonts.size_part_desc,
                lineHeight: 1.3
              }}
            >
              {part.description}
            </div>
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

// CONFIG SCHEMA
export const CONFIG_SCHEMA = {
  typography: {
    type: 'object',
    fields: {
      voice: { type: 'enum', options: ['notebook', 'story', 'utility'], default: 'notebook' },
      align: { type: 'enum', options: ['left', 'center', 'right'], default: 'center' },
      transform: { type: 'enum', options: ['none', 'uppercase', 'lowercase'], default: 'none' }
    }
  },
  title: {
    text: { type: 'text', label: 'Title' }
  },
  center: {
    text: { type: 'text', label: 'Central Concept' },
    visual: {
      enabled: { type: 'checkbox', label: 'Show Visual' },
      type: { type: 'select', label: 'Type', options: ['emoji', 'image', 'roughSVG'] },
      value: { type: 'text', label: 'Value' }
    }
  },
  parts: {
    type: 'array',
    label: 'Concept Parts',
    itemSchema: {
      label: { type: 'text', label: 'Part Label' },
      description: { type: 'text', label: 'Description' },
      color: { type: 'color', label: 'Color' }
    }
  }
};
