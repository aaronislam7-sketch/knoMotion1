import React, { useEffect } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';

// SDK imports - Agnostic Template System v6
import { 
  fadeUpIn,
  slideInLeft,
  slideInRight,
  EZ,
  toFrames,
  renderHero,
  mergeHeroConfig,
  generateAmbientParticles,
  renderAmbientParticles
} from '../sdk';
import { loadFontVoice, buildFontTokens, DEFAULT_FONT_VOICE } from '../sdk/fontSystem';
import { createTransitionProps } from '../sdk/transitions';

/**
 * TEMPLATE #15: ANALOGY BRIDGE - v6.0
 * 
 * PRIMARY INTENTION: CONNECT + EXPLAIN
 * SECONDARY INTENTIONS: BREAKDOWN, REVEAL
 * 
 * PURPOSE: Connect unfamiliar concept to familiar one through visual analogy
 * 
 * VISUAL PATTERN:
 * - Left side: Familiar concept (with visual)
 * - Center: Bridge/connection (animated)
 * - Right side: New concept (with visual)
 * - Labels explain the mapping
 * 
 * ONE CONCEPT RULE:
 * - Screen 1: Familiar concept only (establish baseline)
 * - Transition: Bridge starts to form
 * - Screen 2: Bridge connects (show relationship)
 * - Transition: New concept fades in
 * - Screen 3: Both concepts + complete bridge + mapping labels
 * 
 * AGNOSTIC PRINCIPALS:
 * ✓ Type-Based Polymorphism (visuals via hero registry)
 * ✓ Data-Driven Structure (dynamic mappings)
 * ✓ Token-Based Positioning (semantic layout)
 * ✓ Separation of Concerns (content/layout/style/animation)
 * ✓ Progressive Configuration (simple defaults)
 * ✓ Registry Pattern (extensible bridge types)
 */

const DEFAULT_CONFIG = {
  title: {
    text: 'Understanding Through Analogy',
    position: 'top-center',
    offset: { x: 0, y: 40 }
  },
  
  familiar: {
    title: 'Like This',
    description: 'Something you already understand',
    visual: {
      type: 'emoji',
      emoji: '🏠',
      size: 150
    }
  },
  
  newConcept: {
    title: 'Understand This',
    description: 'New concept to learn',
    visual: {
      type: 'emoji',
      emoji: '🧬',
      size: 150
    }
  },
  
  bridge: {
    label: 'is like',
    style: 'arrow', // arrow, equals, path
    mappings: [
      { from: 'Foundation', to: 'Base Pairs' },
      { from: 'Structure', to: 'Double Helix' }
    ]
  },
  
  layout: 'horizontal', // horizontal, vertical
  
  style_tokens: {
    colors: {
      bg: '#F8F9FA',
      accent: '#FF6B35',
      accent2: '#00BCD4',
      ink: '#212121',
      bridgeColor: '#9B59B6',
      familiarBg: '#FFF3E0',
      newBg: '#E3F2FD',
      mappingColor: '#757575'
    },
    fonts: {
      size_title: 52,
      size_concept: 48,
      size_description: 26,
      size_bridge: 40,
      size_mapping: 22
    }
  },
  
  beats: {
    entrance: 0.4,
    titleEntry: 0.6,
    familiarEntry: 1.2,
    bridgeStart: 2.0,
    bridgeDraw: 1.5,
    newConceptEntry: 3.8,
    mappingsStart: 5.0,
    mappingInterval: 0.6,
    exit: 2.5
  },
  
  animation: {
    conceptEntrance: 'slide',
    bridgeAnimation: 'draw',
    easing: 'power3InOut'
  },
  
  typography: {
    voice: 'story',
    align: 'center',
    transform: 'none'
  },
  
  transition: {
    exit: {
      style: 'fade',
      durationInFrames: 18,
      easing: 'smooth'
    }
  }
};

export const Connect15AnalogyBridge = ({ scene, styles, presets, easingMap }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  
  if (!scene) {
    return <AbsoluteFill style={{ backgroundColor: '#F8F9FA' }} />;
  }
  
  // Font loading
  const typography = scene.typography ? { ...DEFAULT_CONFIG.typography, ...scene.typography } : DEFAULT_CONFIG.typography;
  const fontTokens = buildFontTokens(typography?.voice || DEFAULT_FONT_VOICE) || {
    title: { family: 'Caveat, cursive' },
    body: { family: 'Kalam, sans-serif' },
    accent: { family: 'Permanent Marker, cursive' },
    utility: { family: 'Inter, sans-serif' }
  };
  
  useEffect(() => {
    loadFontVoice(typography?.voice || DEFAULT_FONT_VOICE);
  }, [typography?.voice]);
  
  const config = {
    ...DEFAULT_CONFIG,
    ...scene,
    title: { ...DEFAULT_CONFIG.title, ...(scene.title || {}) },
    familiar: { ...DEFAULT_CONFIG.familiar, ...(scene.familiar || {}) },
    newConcept: { ...DEFAULT_CONFIG.newConcept, ...(scene.newConcept || {}) },
    bridge: { ...DEFAULT_CONFIG.bridge, ...(scene.bridge || {}) },
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
  
  // Particles
  const particles = generateAmbientParticles(20, 15001, width, height);
  const particleElements = renderAmbientParticles(particles, frame, fps, [colors.accent, colors.accent2, colors.bg]);
  
  // Title
  const titleStartFrame = toFrames(beats.titleEntry, fps);
  const titleAnim = fadeUpIn(frame, { start: beats.titleEntry, dur: 0.8, dist: 50, ease: 'smooth' }, EZ, fps);
  
  // Familiar concept
  const familiarStartFrame = toFrames(beats.familiarEntry, fps);
  const familiarAnim = slideInLeft(frame, { start: beats.familiarEntry, dur: 1.0, dist: 150, ease: 'power3Out' }, EZ, fps);
  
  // Bridge
  const bridgeStartFrame = toFrames(beats.bridgeStart, fps);
  const bridgeProgress = frame >= bridgeStartFrame ?
    Math.min((frame - bridgeStartFrame) / toFrames(beats.bridgeDraw, fps), 1) : 0;
  
  // New concept
  const newConceptStartFrame = toFrames(beats.newConceptEntry, fps);
  const newConceptAnim = slideInRight(frame, { start: beats.newConceptEntry, dur: 1.0, dist: 150, ease: 'power3Out' }, EZ, fps);
  
  // Mappings
  const mappingsStartFrame = toFrames(beats.mappingsStart, fps);
  
  const leftX = width * 0.2;
  const rightX = width * 0.8;
  const centerY = height * 0.5;
  
  return (
    <AbsoluteFill className="overflow-hidden" style={{ backgroundColor: colors.bg, fontFamily: fontTokens.body.family }}>
      {/* Particles */}
      <svg style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 0, opacity: 0.3 }} viewBox="0 0 1920 1080">
        {particleElements.map(p => p.element)}
      </svg>
      
      {/* Title - Fixed at top in safe zone */}
      {frame >= titleStartFrame && (
        <div style={{
          position: 'absolute',
          top: 60,
          left: '50%',
          transform: `translate(-50%, 0) translateY(${titleAnim.translateY}px)`,
          fontSize: fonts.size_title,
          fontWeight: 800,
          fontFamily: fontTokens.accent.family,
          color: colors.accent,
          textAlign: 'center',
          opacity: titleAnim.opacity,
          zIndex: 100,
          maxWidth: '90%'
        }}>
          {config.title.text}
        </div>
      )}
      
      {/* Familiar Concept (Left) */}
      {frame >= familiarStartFrame && (
        <div style={{
          position: 'absolute',
          left: leftX,
          top: centerY,
          transform: `translate(-50%, -50%) translateX(${familiarAnim.translateX}px)`,
          opacity: familiarAnim.opacity,
          backgroundColor: colors.familiarBg,
          padding: '40px',
          borderRadius: 24,
          border: `4px solid ${colors.accent}`,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          textAlign: 'center',
          minWidth: 350,
          zIndex: 10
        }}>
          <div style={{
            fontSize: fonts.size_concept,
            fontWeight: 900,
            fontFamily: fontTokens.accent.family,
            color: colors.accent,
            marginBottom: 20
          }}>
            {config.familiar.title}
          </div>
          
          <div style={{ marginBottom: 20 }}>
            {renderHero(mergeHeroConfig(config.familiar.visual), frame, beats, colors, EZ, fps)}
          </div>
          
          <div style={{
            fontSize: fonts.size_description,
            fontWeight: 400,
            fontFamily: fontTokens.body.family,
            color: colors.ink,
            lineHeight: 1.5
          }}>
            {config.familiar.description}
          </div>
        </div>
      )}
      
      {/* Bridge */}
      {frame >= bridgeStartFrame && (
        <div style={{
          position: 'absolute',
          left: '50%',
          top: centerY,
          transform: 'translate(-50%, -50%)',
          zIndex: 5
        }}>
          {/* Bridge line */}
          <div style={{
            width: width * 0.35 * EZ.power3InOut(bridgeProgress),
            height: 6,
            backgroundColor: colors.bridgeColor,
            position: 'absolute',
            left: -(width * 0.35 / 2),
            top: -3,
            borderRadius: 3
          }} />
          
          {/* Arrow */}
          {bridgeProgress > 0.7 && (
            <div style={{
              position: 'absolute',
              right: -(width * 0.35 / 2) - 15,
              top: -12,
              width: 0,
              height: 0,
              borderLeft: `20px solid ${colors.bridgeColor}`,
              borderTop: '12px solid transparent',
              borderBottom: '12px solid transparent'
            }} />
          )}
          
          {/* Bridge label */}
          {bridgeProgress > 0.3 && (
            <div style={{
              fontSize: fonts.size_bridge,
              fontWeight: 900,
              fontFamily: fontTokens.accent.family,
              color: colors.bridgeColor,
              position: 'absolute',
              top: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              whiteSpace: 'nowrap',
              opacity: interpolate(bridgeProgress, [0.3, 0.6], [0, 1], { extrapolateRight: 'clamp' })
            }}>
              {config.bridge.label}
            </div>
          )}
        </div>
      )}
      
      {/* New Concept (Right) */}
      {frame >= newConceptStartFrame && (
        <div style={{
          position: 'absolute',
          left: rightX,
          top: centerY,
          transform: `translate(-50%, -50%) translateX(${newConceptAnim.translateX}px)`,
          opacity: newConceptAnim.opacity,
          backgroundColor: colors.newBg,
          padding: '40px',
          borderRadius: 24,
          border: `4px solid ${colors.accent2}`,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          textAlign: 'center',
          minWidth: 350,
          zIndex: 10
        }}>
          <div style={{
            fontSize: fonts.size_concept,
            fontWeight: 900,
            fontFamily: fontTokens.accent.family,
            color: colors.accent2,
            marginBottom: 20
          }}>
            {config.newConcept.title}
          </div>
          
          <div style={{ marginBottom: 20 }}>
            {renderHero(mergeHeroConfig(config.newConcept.visual), frame, beats, colors, EZ, fps)}
          </div>
          
          <div style={{
            fontSize: fonts.size_description,
            fontWeight: 400,
            fontFamily: fontTokens.body.family,
            color: colors.ink,
            lineHeight: 1.5
          }}>
            {config.newConcept.description}
          </div>
        </div>
      )}
      
      {/* Mappings */}
      {config.bridge.mappings && frame >= mappingsStartFrame && (
        <div style={{
          position: 'absolute',
          bottom: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 40,
          zIndex: 15
        }}>
          {config.bridge.mappings.map((mapping, index) => {
            const mappingTime = beats.mappingsStart + (index * beats.mappingInterval);
            const mappingFrame = toFrames(mappingTime, fps);
            
            if (frame < mappingFrame) return null;
            
            const mappingProgress = Math.min((frame - mappingFrame) / toFrames(0.5, fps), 1);
            const opacity = EZ.smooth(mappingProgress);
            const scale = EZ.backOut(mappingProgress);
            
            return (
              <div key={index} style={{
                backgroundColor: colors.familiarBg,
                padding: '16px 24px',
                borderRadius: 12,
                border: `2px solid ${colors.mappingColor}`,
                opacity,
                transform: `scale(${scale})`
              }}>
                <div style={{
                  fontSize: fonts.size_mapping,
                  fontWeight: 600,
                  fontFamily: fontTokens.body.family,
                  color: colors.mappingColor,
                  textAlign: 'center'
                }}>
                  <span style={{ color: colors.accent }}>{mapping.from}</span>
                  {' → '}
                  <span style={{ color: colors.accent2 }}>{mapping.to}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AbsoluteFill>
  );
};

// Required exports
export const TEMPLATE_ID = 'Connect15AnalogyBridge';
export const TEMPLATE_VERSION = '6.0.0';

Connect15AnalogyBridge.TEMPLATE_VERSION = '6.0.0';
Connect15AnalogyBridge.TEMPLATE_ID = 'Connect15AnalogyBridge';

export const LEARNING_INTENTIONS = {
  primary: ['connect', 'explain'],
  secondary: ['breakdown', 'reveal'],
  tags: ['analogy', 'comparison', 'metaphor', 'understanding']
};

export const getDuration = (scene, fps) => {
  const config = { ...DEFAULT_CONFIG, ...scene };
  const beats = { ...DEFAULT_CONFIG.beats, ...(scene.beats || {}) };
  const mappings = config.bridge?.mappings || DEFAULT_CONFIG.bridge.mappings;
  
  const mappingsDuration = mappings.length * beats.mappingInterval;
  const totalDuration = beats.mappingsStart + mappingsDuration + 2.0 + beats.exit;
  
  return toFrames(totalDuration, fps);
};

export const CAPABILITIES = {
  usesSVG: false,
  usesRoughJS: false,
  usesLottie: false,
  requiresAudio: false,
  dynamicMappings: true,
  maxMappings: 4,
  minMappings: 1
};

export const CONFIG_SCHEMA = {
  title: {
    type: 'object',
    fields: {
      text: { type: 'string', required: true },
      position: { type: 'position-token', default: 'top-center' },
      offset: { type: 'offset', default: { x: 0, y: 40 } }
    }
  },
  familiar: {
    type: 'object',
    fields: {
      title: { type: 'string', required: true },
      description: { type: 'string', required: true },
      visual: { type: 'polymorphic-hero', required: true }
    }
  },
  newConcept: {
    type: 'object',
    fields: {
      title: { type: 'string', required: true },
      description: { type: 'string', required: true },
      visual: { type: 'polymorphic-hero', required: true }
    }
  },
  bridge: {
    type: 'object',
    fields: {
      label: { type: 'string', default: 'is like' },
      style: { type: 'enum', options: ['arrow', 'equals', 'path'], default: 'arrow' },
      mappings: {
        type: 'dynamic-array',
        min: 1,
        max: 4,
        itemSchema: {
          from: { type: 'string', required: true },
          to: { type: 'string', required: true }
        }
      }
    }
  },
  layout: {
    type: 'enum',
    options: ['horizontal', 'vertical'],
    default: 'horizontal'
  },
  style_tokens: {
    type: 'style-tokens',
    colors: ['bg', 'accent', 'accent2', 'ink', 'bridgeColor', 'familiarBg', 'newBg', 'mappingColor'],
    fonts: ['size_title', 'size_concept', 'size_description', 'size_bridge', 'size_mapping']
  },
  beats: {
    type: 'timeline',
    beats: ['entrance', 'titleEntry', 'familiarEntry', 'bridgeStart', 'bridgeDraw', 'newConceptEntry', 'mappingsStart', 'mappingInterval', 'exit']
  }
};
