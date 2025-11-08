import React, { useEffect } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import { EZ, toFrames } from '../sdk';
import { loadFontVoice, buildFontTokens, DEFAULT_FONT_VOICE } from '../sdk/fontSystem';
import { createTransitionProps } from '../sdk/transitions';

/**
 * TEMPLATE #7: KEY TAKEAWAYS - v6.0
 * PRIMARY INTENTION: BREAKDOWN | SECONDARY: GUIDE, REVEAL
 * Bullet-point summary of main points
 */

const DEFAULT_CONFIG = {
  title: { text: 'Key Takeaways', position: 'top-center', offset: { x: 0, y: 60 } },
  takeaways: [
    { text: 'First important point to remember', icon: '💡' },
    { text: 'Second key insight or lesson', icon: '🎯' },
    { text: 'Third critical concept or skill', icon: '🚀' }
  ],
  style_tokens: { colors: { bg: '#FFF9F0', title: '#1A1A1A', accent: '#27AE60', text: '#34495E', bullet: '#CBD5E0' }, fonts: { size_title: 56, size_takeaway: 32, weight_title: 800, weight_takeaway: 600 } },
  beats: { entrance: 0.5, title: 1.0, firstTakeaway: 2.0, takeawayInterval: 1.0, hold: 6.0, exit: 8.0 },
  typography: { voice: 'utility', align: 'left', transform: 'none' },
  transition: { exit: { style: 'fade', durationInFrames: 18, easing: 'smooth' } }
};

export const Reflect4AKeyTakeaways = ({ scene }) => {
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
  const takeaways = config.takeaways || DEFAULT_CONFIG.takeaways;
  
  const f = { title: toFrames(beats.title, fps), first: toFrames(beats.firstTakeaway, fps), exit: toFrames(beats.exit, fps) };
  
  const titleProgress = interpolate(frame, [f.title, f.title + toFrames(0.8, fps)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.power3Out });
  const exitProgress = frame >= f.exit ? interpolate(frame, [f.exit, f.exit + toFrames(0.8, fps)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.power3In }) : 0;
  const opacity = 1 - exitProgress;
  
  return (
    <AbsoluteFill className="overflow-hidden" style={{ backgroundColor: colors.bg, fontFamily: fontTokens.body.family }}>
      <div className="absolute left-1/2 text-center" style={{ top: config.title.offset.y, transform: `translate(-50%, ${(1 - titleProgress) * 30}px)`, opacity: titleProgress * opacity, fontSize: fonts.size_title, fontWeight: fonts.weight_title, fontFamily: fontTokens.title.family, color: colors.title, textTransform: typography.transform !== 'none' ? typography.transform : undefined }}>
        {config.title.text}
      </div>
      
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 max-w-[900px] flex flex-col gap-6">
        {takeaways.map((item, i) => {
          const itemBeat = f.first + toFrames(beats.takeawayInterval * i, fps);
          const itemProgress = frame >= itemBeat ? interpolate(frame, [itemBeat, itemBeat + toFrames(0.6, fps)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.backOut }) : 0;
          if (itemProgress === 0) return null;
          
          return (
            <div key={i} className="flex items-center gap-5" style={{ transform: `translateX(${(1 - itemProgress) * -50}px)`, opacity: itemProgress * opacity }}>
              <div className="w-15 h-15 rounded-full flex items-center justify-center flex-shrink-0" style={{ width: 60, height: 60, backgroundColor: colors.accent, fontSize: 32, fontFamily: fontTokens.accent.family }}>
                {item.icon || (i + 1)}
              </div>
              <div className="flex-1 leading-snug" style={{ fontSize: fonts.size_takeaway, fontWeight: fonts.weight_takeaway, fontFamily: fontTokens.body.family, color: colors.text, textAlign: typography.align }}>
                {item.text}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const getDuration = (scene, fps) => {
  const beats = { ...DEFAULT_CONFIG.beats, ...(scene?.beats || {}) };
  const takeaways = scene?.takeaways || DEFAULT_CONFIG.takeaways;
  const dynamicDuration = beats.firstTakeaway + (beats.takeawayInterval * takeaways.length) + 2.0;
  return toFrames(Math.max(beats.exit, dynamicDuration) + 1.0, fps);
};

export const TEMPLATE_VERSION = '6.0';
export const TEMPLATE_ID = 'Reflect4AKeyTakeaways';
export const PRIMARY_INTENTION = 'BREAKDOWN';
export const SECONDARY_INTENTIONS = ['GUIDE', 'REVEAL'];

export const CONFIG_SCHEMA = {
  title: { text: { type: 'text', label: 'Title' } },
  takeaways: {
    type: 'array', label: 'Takeaways',
    itemSchema: {
      text: { type: 'textarea', label: 'Takeaway Text' },
      icon: { type: 'text', label: 'Icon (emoji)' }
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
