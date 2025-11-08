import React, { useEffect } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import { EZ, toFrames, renderHero, mergeHeroConfig } from '../sdk';
import { loadFontVoice, buildFontTokens, DEFAULT_FONT_VOICE } from '../sdk/fontSystem';
import { createTransitionProps } from '../sdk/transitions';

/**
 * TEMPLATE #5: VISUAL ANALOGY - v6.0
 * PRIMARY INTENTION: COMPARE | SECONDARY: BREAKDOWN, INSPIRE
 * Side-by-side comparison with analogies
 */

const DEFAULT_CONFIG = {
  title: { text: 'Understanding Through Analogy', position: 'top-center', offset: { x: 0, y: 60 } },
  leftSide: {
    label: 'Concept A',
    description: 'Original concept to explain',
    visual: { type: 'emoji', value: '📱', scale: 2.5, enabled: true }
  },
  rightSide: {
    label: 'Analogy',
    description: 'Familiar comparison',
    visual: { type: 'emoji', value: '📞', scale: 2.5, enabled: true }
  },
  connector: { text: 'is like', enabled: true },
  typography: {
    voice: 'story',
    align: 'center',
    transform: 'none'
  },
  style_tokens: {
    colors: { bg: '#FFF9F0', left: '#3498DB', right: '#2ECC71', text: '#1A1A1A', connector: '#9CA3AF' },
    fonts: { size_title: 48, size_label: 36, size_desc: 22, size_connector: 28 }
  },
  beats: { entrance: 0.5, title: 1.0, leftReveal: 2.0, connector: 3.5, rightReveal: 4.5, hold: 7.0, exit: 9.0 },
  transition: {
    exit: { style: 'fade', durationInFrames: 18, easing: 'smooth' }
  }
};

export const Explain2BAnalogy = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const config = { ...DEFAULT_CONFIG, ...scene };
  const typography = { ...DEFAULT_CONFIG.typography, ...(scene.typography || {}) };
  
  useEffect(() => {
    loadFontVoice(typography.voice || DEFAULT_FONT_VOICE);
  }, [typography.voice]);
  
  const fontTokens = buildFontTokens(typography.voice || DEFAULT_FONT_VOICE);
  const beats = { ...DEFAULT_CONFIG.beats, ...(scene.beats || {}) };
  const colors = { ...DEFAULT_CONFIG.style_tokens.colors, ...(scene.style_tokens?.colors || {}) };
  const fonts = { ...DEFAULT_CONFIG.style_tokens.fonts, ...(scene.style_tokens?.fonts || {}) };
  
  const f = {
    title: toFrames(beats.title, fps),
    left: toFrames(beats.leftReveal, fps),
    connector: toFrames(beats.connector, fps),
    right: toFrames(beats.rightReveal, fps),
    exit: toFrames(beats.exit, fps)
  };
  
  const titleProgress = interpolate(frame, [f.title, f.title + toFrames(0.8, fps)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.power3Out });
  const leftProgress = interpolate(frame, [f.left, f.left + toFrames(0.6, fps)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.backOut });
  const connectorProgress = interpolate(frame, [f.connector, f.connector + toFrames(0.5, fps)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.power3Out });
  const rightProgress = interpolate(frame, [f.right, f.right + toFrames(0.6, fps)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.backOut });
  const exitProgress = frame >= f.exit ? interpolate(frame, [f.exit, f.exit + toFrames(0.8, fps)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.power3In }) : 0;
  const opacity = 1 - exitProgress;
  
  const renderSide = (side, progress, color, x) => (
    <div className="absolute top-1/2 bg-white rounded-card shadow-soft p-8 text-center" style={{
      left: x,
      transform: `translate(-50%, -50%) scale(${progress})`,
      opacity: progress * opacity,
      width: 400,
      border: `4px solid ${color}`
    }}>
      {side.visual?.enabled && (
        <div className="mb-5">
          {renderHero(mergeHeroConfig({ type: side.visual.type, value: side.visual.value, scale: side.visual.scale }), frame, beats, colors, EZ, fps)}
        </div>
      )}
      <div className="mb-3" style={{ fontSize: fonts.size_label, fontWeight: 700, fontFamily: fontTokens.display.family, color }}>{side.label}</div>
      <div className="leading-snug" style={{ fontSize: fonts.size_desc, fontFamily: fontTokens.body.family, color: colors.text }}>{side.description}</div>
    </div>
  );
  
  return (
    <AbsoluteFill className="overflow-hidden" style={{ backgroundColor: colors.bg, fontFamily: fontTokens.body.family }}>
      {/* Title */}
      <div className="absolute left-1/2 text-center max-w-[90%]" style={{ 
        top: config.title.offset.y, 
        transform: `translate(-50%, ${(1 - titleProgress) * 30}px)`, 
        opacity: titleProgress * opacity, 
        fontSize: fonts.size_title, 
        fontWeight: 800, 
        fontFamily: fontTokens.title.family,
        color: colors.text,
        textAlign: typography.align,
        textTransform: typography.transform !== 'none' ? typography.transform : undefined
      }}>
        {config.title.text}
      </div>
      
      {/* Left Side */}
      {renderSide(config.leftSide, leftProgress, colors.left, 480)}
      
      {/* Connector */}
      {config.connector.enabled && connectorProgress > 0 && (
        <div className="absolute left-1/2 top-1/2 text-center italic" style={{ 
          transform: `translate(-50%, -50%) scale(${connectorProgress})`, 
          opacity: connectorProgress * opacity, 
          fontSize: fonts.size_connector, 
          fontWeight: 600, 
          fontFamily: fontTokens.accent.family,
          color: colors.connector
        }}>
          {config.connector.text}
        </div>
      )}
      
      {/* Right Side */}
      {renderSide(config.rightSide, rightProgress, colors.right, 1440)}
    </AbsoluteFill>
  );
};

export const getDuration = (scene, fps) => {
  const beats = { ...DEFAULT_CONFIG.beats, ...(scene?.beats || {}) };
  return toFrames(beats.exit + 1.0, fps);
};

export const TEMPLATE_VERSION = '6.0';
export const TEMPLATE_ID = 'Explain2BAnalogy';
export const PRIMARY_INTENTION = 'COMPARE';
export const SECONDARY_INTENTIONS = ['BREAKDOWN', 'INSPIRE'];

export const CONFIG_SCHEMA = {
  title: { text: { type: 'text', label: 'Title' } },
  leftSide: {
    label: { type: 'text', label: 'Left Label' },
    description: { type: 'textarea', label: 'Left Description' },
    visual: {
      enabled: { type: 'checkbox', label: 'Show Visual' },
      type: { type: 'select', label: 'Type', options: ['emoji', 'image', 'roughSVG'] },
      value: { type: 'text', label: 'Value' },
      scale: { type: 'number', label: 'Scale', min: 0.5, max: 5 }
    }
  },
  rightSide: {
    label: { type: 'text', label: 'Right Label' },
    description: { type: 'textarea', label: 'Right Description' },
    visual: {
      enabled: { type: 'checkbox', label: 'Show Visual' },
      type: { type: 'select', label: 'Type', options: ['emoji', 'image', 'roughSVG'] },
      value: { type: 'text', label: 'Value' },
      scale: { type: 'number', label: 'Scale', min: 0.5, max: 5 }
    }
  },
  connector: {
    text: { type: 'text', label: 'Connector Text' },
    enabled: { type: 'checkbox', label: 'Show Connector' }
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
