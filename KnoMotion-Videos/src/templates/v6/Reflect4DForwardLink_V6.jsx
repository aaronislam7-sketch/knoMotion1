import React, { useEffect } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import { EZ, toFrames, renderHero, mergeHeroConfig } from '../../sdk';
import { loadFontVoice, buildFontTokens, DEFAULT_FONT_VOICE } from '../../sdk/fontSystem';
import { createTransitionProps } from '../../sdk/transitions';

/**
 * TEMPLATE #8: FORWARD LINK - v6.0
 * PRIMARY INTENTION: CONNECT | SECONDARY: INSPIRE, REVEAL
 * Bridge to next topic with context and preview
 */

const DEFAULT_CONFIG = {
  current: { text: 'What we learned:', summary: 'Core concepts and skills covered', position: 'left' },
  next: { text: 'Coming up next:', preview: 'Advanced applications and real-world scenarios', position: 'right' },
  bridge: { text: '→', enabled: true },
  visual: { type: 'emoji', value: '🌉', scale: 3.0, enabled: false },
  style_tokens: { colors: { bg: '#FFF9F0', current: '#3498DB', next: '#E74C3C', bridge: '#9CA3AF', text: '#1A1A1A' }, fonts: { size_heading: 40, size_content: 28, size_bridge: 80, weight_heading: 700, weight_content: 400 } },
  beats: { entrance: 0.5, current: 1.0, bridge: 3.0, visual: 4.0, next: 5.0, hold: 7.0, exit: 9.0 },
  typography: { voice: 'story', align: 'center', transform: 'none' },
  transition: { exit: { style: 'fade', durationInFrames: 18, easing: 'smooth' } }
};

export const Reflect4DForwardLink = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const config = { ...DEFAULT_CONFIG, ...scene };
  const typography = { ...DEFAULT_CONFIG.typography, ...(scene.typography || {}) };
  
  const fontTokens = buildFontTokens(typography?.voice || DEFAULT_FONT_VOICE) || {
    title: { family: 'Caveat, cursive' },
    body: { family: 'Kalam, sans-serif' },
    accent: { family: 'Permanent Marker, cursive' },
    utility: { family: 'Inter, sans-serif' }
  };
  
  useEffect(() => {
    loadFontVoice(typography?.voice || DEFAULT_FONT_VOICE);
  }, [typography?.voice]);
  const beats = { ...DEFAULT_CONFIG.beats, ...(scene.beats || {}) };
  const colors = { ...DEFAULT_CONFIG.style_tokens.colors, ...(scene.style_tokens?.colors || {}) };
  const fonts = { ...DEFAULT_CONFIG.style_tokens.fonts, ...(scene.style_tokens?.fonts || {}) };
  
  const f = { current: toFrames(beats.current, fps), bridge: toFrames(beats.bridge, fps), visual: toFrames(beats.visual, fps), next: toFrames(beats.next, fps), exit: toFrames(beats.exit, fps) };
  
  const currentProgress = interpolate(frame, [f.current, f.current + toFrames(0.8, fps)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.power3Out });
  const bridgeProgress = interpolate(frame, [f.bridge, f.bridge + toFrames(0.6, fps)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.backOut });
  const visualProgress = config.visual.enabled && frame >= f.visual ? interpolate(frame, [f.visual, f.visual + toFrames(0.8, fps)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.power3Out }) : 0;
  const nextProgress = interpolate(frame, [f.next, f.next + toFrames(0.8, fps)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.power3Out });
  const exitProgress = frame >= f.exit ? interpolate(frame, [f.exit, f.exit + toFrames(0.8, fps)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.power3In }) : 0;
  const opacity = 1 - exitProgress;
  
  const renderSection = (section, progress, color, x) => (
    <div style={{ position: 'absolute', left: x, top: '50%', transform: `translate(-50%, calc(-50% + ${(1 - progress) * 30}px))`, opacity: progress * opacity, width: '40%', textAlign: typography.align }}>
      <div style={{ fontSize: fonts.size_heading, fontWeight: fonts.weight_heading, fontFamily: fontTokens.title.family, color, marginBottom: 16 }}>{section.text}</div>
      <div style={{ fontSize: fonts.size_content, fontWeight: fonts.weight_content, fontFamily: fontTokens.body.family, color: colors.text, lineHeight: 1.5 }}>{section.summary || section.preview}</div>
    </div>
  );
  
  return (
    <AbsoluteFill className="overflow-hidden" style={{ backgroundColor: colors.bg, fontFamily: fontTokens.body.family }}>
      {renderSection(config.current, currentProgress, colors.current, '25%')}
      
      {config.bridge.enabled && bridgeProgress > 0 && (
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: `translate(-50%, -50%) scale(${bridgeProgress})`, opacity: bridgeProgress * opacity, fontSize: fonts.size_bridge, color: colors.bridge, fontWeight: 700 }}>
          {config.bridge.text}
        </div>
      )}
      
      {config.visual.enabled && visualProgress > 0 && (
        <div style={{ position: 'absolute', left: '50%', top: '30%', transform: `translate(-50%, -50%) scale(${visualProgress})`, opacity: visualProgress * opacity }}>
          {renderHero(mergeHeroConfig({ type: config.visual.type, value: config.visual.value, scale: config.visual.scale }), frame, beats, colors, EZ, fps)}
        </div>
      )}
      
      {renderSection(config.next, nextProgress, colors.next, '75%')}
    </AbsoluteFill>
  );
};

export const getDuration = (scene, fps) => {
  const beats = { ...DEFAULT_CONFIG.beats, ...(scene?.beats || {}) };
  return toFrames(beats.exit + 1.0, fps);
};

export const TEMPLATE_VERSION = '6.0';
export const TEMPLATE_ID = 'Reflect4DForwardLink';
export const PRIMARY_INTENTION = 'CONNECT';
export const SECONDARY_INTENTIONS = ['INSPIRE', 'REVEAL'];
