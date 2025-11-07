import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import { EZ, toFrames, renderHero, mergeHeroConfig } from '../sdk';

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
  style_tokens: {
    colors: { bg: '#FFF9F0', left: '#3498DB', right: '#2ECC71', text: '#1A1A1A', connector: '#9CA3AF' },
    fonts: { size_title: 48, size_label: 36, size_desc: 22, size_connector: 28 }
  },
  beats: { entrance: 0.5, title: 1.0, leftReveal: 2.0, connector: 3.5, rightReveal: 4.5, hold: 7.0, exit: 9.0 }
};

export const Explain2BAnalogy = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const config = { ...DEFAULT_CONFIG, ...scene };
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
    <div style={{
      position: 'absolute',
      left: x,
      top: '50%',
      transform: `translate(-50%, -50%) scale(${progress})`,
      opacity: progress * opacity,
      width: 400,
      backgroundColor: '#FFFFFF',
      border: `4px solid ${color}`,
      borderRadius: 16,
      padding: 32,
      textAlign: 'center',
      boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
    }}>
      {side.visual?.enabled && (
        <div style={{ marginBottom: 20 }}>
          {renderHero(mergeHeroConfig({ type: side.visual.type, value: side.visual.value, scale: side.visual.scale }), frame, beats, colors, EZ, fps)}
        </div>
      )}
      <div style={{ fontSize: fonts.size_label, fontWeight: 700, color, marginBottom: 12 }}>{side.label}</div>
      <div style={{ fontSize: fonts.size_desc, color: colors.text, lineHeight: 1.4 }}>{side.description}</div>
    </div>
  );
  
  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, fontFamily: 'Inter, sans-serif' }}>
      {/* Title */}
      <div style={{ position: 'absolute', left: '50%', top: config.title.offset.y, transform: `translate(-50%, ${(1 - titleProgress) * 30}px)`, opacity: titleProgress * opacity, fontSize: fonts.size_title, fontWeight: 800, color: colors.text, textAlign: 'center', maxWidth: '90%' }}>
        {config.title.text}
      </div>
      
      {/* Left Side */}
      {renderSide(config.leftSide, leftProgress, colors.left, 480)}
      
      {/* Connector */}
      {config.connector.enabled && connectorProgress > 0 && (
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: `translate(-50%, -50%) scale(${connectorProgress})`, opacity: connectorProgress * opacity, fontSize: fonts.size_connector, fontWeight: 600, color: colors.connector, textAlign: 'center', fontStyle: 'italic' }}>
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
