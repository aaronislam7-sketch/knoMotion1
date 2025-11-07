import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import { EZ, toFrames } from '../sdk';

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
  beats: { entrance: 0.5, title: 1.0, firstTakeaway: 2.0, takeawayInterval: 1.0, hold: 6.0, exit: 8.0 }
};

export const Reflect4AKeyTakeaways = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const config = { ...DEFAULT_CONFIG, ...scene };
  const beats = { ...DEFAULT_CONFIG.beats, ...(scene.beats || {}) };
  const colors = { ...DEFAULT_CONFIG.style_tokens.colors, ...(scene.style_tokens?.colors || {}) };
  const fonts = { ...DEFAULT_CONFIG.style_tokens.fonts, ...(scene.style_tokens?.fonts || {}) };
  const takeaways = config.takeaways || DEFAULT_CONFIG.takeaways;
  
  const f = { title: toFrames(beats.title, fps), first: toFrames(beats.firstTakeaway, fps), exit: toFrames(beats.exit, fps) };
  
  const titleProgress = interpolate(frame, [f.title, f.title + toFrames(0.8, fps)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.power3Out });
  const exitProgress = frame >= f.exit ? interpolate(frame, [f.exit, f.exit + toFrames(0.8, fps)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.power3In }) : 0;
  const opacity = 1 - exitProgress;
  
  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, fontFamily: 'Inter, sans-serif' }}>
      <div style={{ position: 'absolute', left: '50%', top: config.title.offset.y, transform: `translate(-50%, ${(1 - titleProgress) * 30}px)`, opacity: titleProgress * opacity, fontSize: fonts.size_title, fontWeight: fonts.weight_title, color: colors.title, textAlign: 'center' }}>
        {config.title.text}
      </div>
      
      <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '80%', maxWidth: 900, display: 'flex', flexDirection: 'column', gap: 24 }}>
        {takeaways.map((item, i) => {
          const itemBeat = f.first + toFrames(beats.takeawayInterval * i, fps);
          const itemProgress = frame >= itemBeat ? interpolate(frame, [itemBeat, itemBeat + toFrames(0.6, fps)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.backOut }) : 0;
          if (itemProgress === 0) return null;
          
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 20, transform: `translateX(${(1 - itemProgress) * -50}px)`, opacity: itemProgress * opacity }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', backgroundColor: colors.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, flexShrink: 0 }}>
                {item.icon || (i + 1)}
              </div>
              <div style={{ fontSize: fonts.size_takeaway, fontWeight: fonts.weight_takeaway, color: colors.text, lineHeight: 1.4, flex: 1 }}>
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
