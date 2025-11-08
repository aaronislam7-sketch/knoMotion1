import React, { useEffect } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import { EZ, toFrames } from '../sdk';
import { loadFontVoice, buildFontTokens, DEFAULT_FONT_VOICE } from '../sdk/fontSystem';
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
  style_tokens: { colors: { bg: '#FFF9F0', scenario: '#1A1A1A', option: '#FFFFFF', border: '#CBD5E0', best: '#2ECC71', risky: '#F39C12', poor: '#E74C3C' }, fonts: { size_scenario: 40, size_option: 26, size_consequence: 18 } },
  beats: { entrance: 0.5, scenario: 1.0, optionsReveal: 2.5, optionInterval: 0.4, reveal: 6.0, exit: 9.0 },
  typography: { voice: 'utility', align: 'center', transform: 'none' },
  transition: { exit: { style: 'fade', durationInFrames: 18, easing: 'smooth' } }
};

export const Apply3BScenarioChoice = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const config = { ...DEFAULT_CONFIG, ...scene };
  const typography = { ...DEFAULT_CONFIG.typography, ...(scene.typography || {}) };
  
  const fontTokens = buildFontTokens(typography?.voice || DEFAULT_FONT_VOICE) || {
    title: { family: 'Figtree, sans-serif' },
    body: { family: 'Inter, sans-serif' },
    accent: { family: 'Caveat, cursive' },
    utility: { family: 'Inter, sans-serif' }
  };
  
  useEffect(() => {
    loadFontVoice(typography?.voice || DEFAULT_FONT_VOICE);
  }, [typography?.voice]);
  const beats = { ...DEFAULT_CONFIG.beats, ...(scene.beats || {}) };
  const colors = { ...DEFAULT_CONFIG.style_tokens.colors, ...(scene.style_tokens?.colors || {}) };
  const fonts = { ...DEFAULT_CONFIG.style_tokens.fonts, ...(scene.style_tokens?.fonts || {}) };
  const options = config.options || DEFAULT_CONFIG.options;
  
  const f = { scenario: toFrames(beats.scenario, fps), options: toFrames(beats.optionsReveal, fps), reveal: toFrames(beats.reveal, fps), exit: toFrames(beats.exit, fps) };
  
  const scenarioProgress = interpolate(frame, [f.scenario, f.scenario + toFrames(0.8, fps)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.power3Out });
  const revealProgress = frame >= f.reveal ? interpolate(frame, [f.reveal, f.reveal + toFrames(0.6, fps)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.power3Out }) : 0;
  const exitProgress = frame >= f.exit ? interpolate(frame, [f.exit, f.exit + toFrames(0.8, fps)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.power3In }) : 0;
  const opacity = 1 - exitProgress;
  
  return (
    <AbsoluteFill className="overflow-hidden" style={{ backgroundColor: colors.bg, fontFamily: fontTokens.body.family }}>
      <div style={{ position: 'absolute', left: '50%', top: config.scenario.offset.y, transform: `translate(-50%, ${(1 - scenarioProgress) * 30}px)`, opacity: scenarioProgress * opacity, fontSize: fonts.size_scenario, fontWeight: 700, fontFamily: fontTokens.title.family, color: colors.scenario, textAlign: typography.align, maxWidth: '85%', lineHeight: 1.3 }}>
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
              <div style={{ fontSize: fonts.size_option, fontWeight: 600, fontFamily: fontTokens.body.family, color: showResult ? '#FFFFFF' : colors.scenario, marginBottom: 8 }}>
                {showResult && isBest && '✓ '}{opt.text}
              </div>
              {showResult && (
                <div style={{ fontSize: fonts.size_consequence, color: showResult ? 'rgba(255,255,255,0.9)' : colors.scenario, fontStyle: 'italic' }}>
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
