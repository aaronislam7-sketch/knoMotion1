import React, { useEffect } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import { EZ, toFrames } from '../sdk';
import { loadFontVoice, DEFAULT_FONT_VOICE } from '../sdk/fontSystem';
import { createTransitionProps } from '../sdk/transitions';

/**
 * TEMPLATE #6: SCENARIO CHOICE - v6.0
 * PRIMARY INTENTION: CHALLENGE | SECONDARY: GUIDE, COMPARE
 * Real-world decision scenarios with multiple paths
 */

const DEFAULT_CONFIG = {
  scenario: { text: 'You discover a bug in production. What do you do?', position: 'top-center', offset: { x: 0, y: 80 } },
  options: [
    { text: 'Hot fix immediately', consequence: 'Quick but risky', impact: 'high' },
    { text: 'Create rollback plan first', consequence: 'Safer approach', impact: 'medium' },
    { text: 'Assess impact thoroughly', consequence: 'Most thorough', impact: 'low' }
  ],
  bestChoice: 1,
  typography: {
    voice: 'utility',
    align: 'left',
    transform: 'none'
  },
  style_tokens: { colors: { bg: '#FFF9F0', scenario: '#1A1A1A', option: '#FFFFFF', border: '#CBD5E0', best: '#2ECC71', risky: '#F39C12', poor: '#E74C3C' }, fonts: { size_scenario: 40, size_option: 26, size_consequence: 18 } },
  beats: { entrance: 0.5, scenario: 1.0, optionsReveal: 2.5, optionInterval: 0.4, reveal: 6.0, exit: 9.0 }
};

export const Apply3BScenarioChoice = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const config = { ...DEFAULT_CONFIG, ...scene };
  const beats = { ...DEFAULT_CONFIG.beats, ...(scene.beats || {}) };
  const colors = { ...DEFAULT_CONFIG.style_tokens.colors, ...(scene.style_tokens?.colors || {}) };
  const fonts = { ...DEFAULT_CONFIG.style_tokens.fonts, ...(scene.style_tokens?.fonts || {}) };
  const typography = { ...DEFAULT_CONFIG.typography, ...(scene.typography || {}) };
  const options = config.options || DEFAULT_CONFIG.options;
  
  // Load font voice
  useEffect(() => {
    void loadFontVoice(typography.voice || DEFAULT_FONT_VOICE);
  }, [typography.voice]);
  
  const f = { scenario: toFrames(beats.scenario, fps), options: toFrames(beats.optionsReveal, fps), reveal: toFrames(beats.reveal, fps), exit: toFrames(beats.exit, fps) };
  
  const scenarioProgress = interpolate(frame, [f.scenario, f.scenario + toFrames(0.8, fps)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.power3Out });
  const revealProgress = frame >= f.reveal ? interpolate(frame, [f.reveal, f.reveal + toFrames(0.6, fps)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.power3Out }) : 0;
  const exitProgress = frame >= f.exit ? interpolate(frame, [f.exit, f.exit + toFrames(0.8, fps)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.power3In }) : 0;
  const opacity = 1 - exitProgress;
  
  return (
    <AbsoluteFill className="bg-surface text-ink overflow-hidden" style={{ backgroundColor: colors.bg }}>
      <div className={`font-display text-ink ${typography.align === 'left' ? 'text-left' : typography.align === 'right' ? 'text-right' : 'text-center'} ${typography.transform === 'uppercase' ? 'uppercase' : typography.transform === 'lowercase' ? 'lowercase' : ''}`}
        style={{ position: 'absolute', left: '50%', top: config.scenario.offset.y, transform: `translate(-50%, ${(1 - scenarioProgress) * 30}px)`, opacity: scenarioProgress * opacity, fontSize: fonts.size_scenario, fontWeight: 700, maxWidth: '85%', lineHeight: 1.3 }}>
        {config.scenario.text}
      </div>
      
      <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '80%', maxWidth: 700, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {options.map((opt, i) => {
          const optBeat = f.options + toFrames(beats.optionInterval * i, fps);
          const optProgress = frame >= optBeat ? interpolate(frame, [optBeat, optBeat + toFrames(0.4, fps)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.backOut }) : 0;
          if (optProgress === 0) return null;
          
          const isBest = i === config.bestChoice;
          const showResult = revealProgress > 0;
          let borderColor = colors.border;
          let bgColor = colors.option;
          
          if (showResult) {
            if (isBest) { borderColor = colors.best; bgColor = colors.best; }
            else if (opt.impact === 'high') { borderColor = colors.risky; bgColor = colors.risky; }
            else { borderColor = colors.poor; bgColor = colors.poor; }
          }
          
          return (
            <div key={i} style={{ backgroundColor: showResult ? bgColor : colors.option, border: `3px solid ${borderColor}`, borderRadius: 12, padding: 20, transform: `scale(${optProgress})`, opacity: optProgress * opacity, transition: showResult ? 'all 0.3s ease' : 'none' }}>
              <div className={`font-display mb-2 ${showResult ? 'text-white' : 'text-ink'}`}
                style={{ fontSize: fonts.size_option, fontWeight: 600 }}>
                {showResult && isBest && '✓ '}{opt.text}
              </div>
              {showResult && (
                <div className="font-body text-white opacity-90 italic"
                  style={{ fontSize: fonts.size_consequence }}>
                  {opt.consequence}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const getDuration = (scene, fps) => {
  const beats = { ...DEFAULT_CONFIG.beats, ...(scene?.beats || {}) };
  return toFrames(beats.exit + 1.0, fps);
};

export const TEMPLATE_VERSION = '6.0';
export const TEMPLATE_ID = 'Apply3BScenarioChoice';
export const PRIMARY_INTENTION = 'CHALLENGE';
export const SECONDARY_INTENTIONS = ['GUIDE', 'COMPARE'];
