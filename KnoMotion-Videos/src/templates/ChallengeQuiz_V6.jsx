/**
 * UNIFIED QUIZ TEMPLATE - v6.0
 * 
 * PRIMARY INTENTION: CHALLENGE
 * SECONDARY INTENTIONS: QUESTION, REVEAL
 * 
 * PURPOSE: Flexible quiz template that supports multiple layouts, timer styles, and micro-delights
 * 
 * MERGED FROM:
 * - Apply3AMicroQuiz_V6 (timer, basic quiz structure)
 * - Challenge13PollQuiz_V6 (layout options, explanation, enhanced styling)
 * 
 * FEATURES:
 * - 2-6 answer options (flexible)
 * - Grid/vertical/horizontal layouts
 * - Timer (countdown or progress bar)
 * - Answer reveal with micro-delights
 * - Explanation support
 * - Lottie animations integration
 * - Mid-scene transitions
 * - Micro-delights throughout
 */

import React, { useEffect } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import { 
  EZ, 
  toFrames, 
  renderHero,
  mergeHeroConfig,
  resolvePosition,
  generateAmbientParticles,
  renderAmbientParticles
} from '../sdk';
import { 
  useFocusScale,
  useShake,
  useFlash,
  useCelebrationBurst,
  useNumberCounter,
  useProgressFill,
  useWordFloat,
  useScalePulse,
  useBorderGlow
} from '../sdk/microDelights';
import { 
  RemotionLottie, 
  LottieBackground,
  LottieOverlay,
  useLottieMicroDelight 
} from '../sdk/lottieIntegration';
import { useMidSceneTransition } from '../sdk/transitions';
import { loadFontVoice, buildFontTokens, DEFAULT_FONT_VOICE } from '../sdk/fontSystem';

const DEFAULT_CONFIG = {
  // Title (optional)
  title: {
    text: 'Quiz Challenge',
    position: 'top-center',
    offset: { x: 0, y: 30 },
    enabled: false
  },
  
  // Question
  question: {
    text: 'What is the capital of France?',
    position: 'top-center',
    offset: { x: 0, y: 140 },
    visual: {
      type: 'emoji',
      value: '🗼',
      scale: 2.0,
      enabled: false
    }
  },
  
  // Options (2-6 supported)
  options: [
    { text: 'London', id: 'A', icon: null },
    { text: 'Paris', id: 'B', icon: null },
    { text: 'Berlin', id: 'C', icon: null },
    { text: 'Madrid', id: 'D', icon: null }
  ],
  
  correctAnswer: 1, // 0-indexed
  
  // Layout configuration
  layout: 'grid', // grid | vertical | horizontal
  optionsPerRow: 2,
  
  // Timer configuration
  timer: {
    enabled: true,
    duration: 8,
    style: 'countdown' // countdown | progress
  },
  
  // Explanation
  explanation: {
    show: true,
    text: 'Paris has been the capital of France since 987 AD',
    position: 'bottom-center',
    offset: { x: 0, y: -100 }
  },
  
  // Micro-delights configuration
  microDelights: {
    enabled: true,
    questionFloat: true,
    choicePulse: true,
    celebrationBurst: true,
    lottieAnimations: {
      thinking: true,
      confetti: true,
      checkmark: true
    }
  },
  
  style_tokens: {
    colors: {
      bg: '#FFF9F0',
      accent: '#FF6B35',
      accent2: '#9B59B6',
      question: '#1A1A1A',
      optionBg: '#FFFFFF',
      optionBorder: '#CBD5E0',
      correctBg: '#2ECC71',
      correctBorder: '#27AE60',
      incorrectBg: '#E74C3C',
      incorrectBorder: '#C0392B',
      timer: '#FF6B35',
      explanationBg: '#F8F9FA',
      explanationBorder: '#FF6B35'
    },
    fonts: {
      size_title: 48,
      size_question: 56,
      size_option: 32,
      size_timer: 64,
      size_explanation: 28,
      weight_title: 700,
      weight_question: 800,
      weight_option: 600
    }
  },
  
  beats: {
    entrance: 0.4,
    titleEntry: 0.6,
    questionEntry: 1.0,
    optionsStart: 2.0,
    optionInterval: 0.3,
    thinking: 5.0,
    reveal: 10.0,
    explanationEntry: 11.5,
    hold: 13.0,
    exit: 14.0
  },
  
  typography: {
    voice: 'utility',
    align: 'center',
    transform: 'none'
  },
  
  transition: {
    questionToOptions: { style: 'fade', durationInFrames: 18 },
    optionsToReveal: { style: 'fade', durationInFrames: 12 },
    revealToExplanation: { style: 'slide', direction: 'up', durationInFrames: 20 }
  }
};

// Calculate option positions based on layout
const calculateOptionLayout = (optionCount, layout, optionsPerRow, width, height) => {
  const positions = [];
  const centerY = height * 0.55;
  
  if (layout === 'grid') {
    const cols = optionsPerRow;
    const rows = Math.ceil(optionCount / cols);
    const boxWidth = 400;
    const boxHeight = 100;
    const gapX = 30;
    const gapY = 25;
    const totalWidth = (boxWidth * cols) + (gapX * (cols - 1));
    const totalHeight = (boxHeight * rows) + (gapY * (rows - 1));
    const startX = (width - totalWidth) / 2;
    const startY = centerY - totalHeight / 2;
    
    for (let i = 0; i < optionCount; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      positions.push({
        x: startX + (col * (boxWidth + gapX)),
        y: startY + (row * (boxHeight + gapY)),
        width: boxWidth,
        height: boxHeight
      });
    }
  } else if (layout === 'vertical') {
    const boxWidth = 600;
    const boxHeight = 90;
    const gap = 20;
    const startX = (width - boxWidth) / 2;
    const startY = centerY - ((optionCount * (boxHeight + gap)) / 2);
    
    for (let i = 0; i < optionCount; i++) {
      positions.push({
        x: startX,
        y: startY + (i * (boxHeight + gap)),
        width: boxWidth,
        height: boxHeight
      });
    }
  } else if (layout === 'horizontal') {
    const boxWidth = 300;
    const boxHeight = 120;
    const gap = 25;
    const totalWidth = (boxWidth * optionCount) + (gap * (optionCount - 1));
    const startX = (width - totalWidth) / 2;
    
    for (let i = 0; i < optionCount; i++) {
      positions.push({
        x: startX + (i * (boxWidth + gap)),
        y: centerY - boxHeight / 2,
        width: boxWidth,
        height: boxHeight
      });
    }
  }
  
  return positions;
};

export const ChallengeQuiz = ({ scene, styles, presets, easingMap }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  
  // Merge config
  const config = {
    ...DEFAULT_CONFIG,
    ...scene,
    title: { ...DEFAULT_CONFIG.title, ...(scene.title || {}) },
    question: { ...DEFAULT_CONFIG.question, ...(scene.question || {}) },
    options: scene.options || DEFAULT_CONFIG.options,
    timer: { ...DEFAULT_CONFIG.timer, ...(scene.timer || {}) },
    explanation: { ...DEFAULT_CONFIG.explanation, ...(scene.explanation || {}) },
    microDelights: { ...DEFAULT_CONFIG.microDelights, ...(scene.microDelights || {}) },
    style_tokens: {
      colors: { ...DEFAULT_CONFIG.style_tokens.colors, ...(scene.style_tokens?.colors || {}) },
      fonts: { ...DEFAULT_CONFIG.style_tokens.fonts, ...(scene.style_tokens?.fonts || {}) }
    },
    beats: { ...DEFAULT_CONFIG.beats, ...(scene.beats || {}) },
    transition: { ...DEFAULT_CONFIG.transition, ...(scene.transition || {}) }
  };
  
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
  
  const colors = config.style_tokens.colors;
  const fonts = config.style_tokens.fonts;
  const beats = config.beats;
  const options = config.options;
  const microDelights = config.microDelights;
  
  // Calculate option positions
  const optionPositions = calculateOptionLayout(
    options.length,
    config.layout || DEFAULT_CONFIG.layout,
    config.optionsPerRow || DEFAULT_CONFIG.optionsPerRow,
    width,
    height
  );
  
  // Frame calculations
  const f_title = toFrames(beats.titleEntry, fps);
  const f_question = toFrames(beats.questionEntry, fps);
  const f_options = toFrames(beats.optionsStart, fps);
  const f_thinking = toFrames(beats.thinking, fps);
  const f_reveal = toFrames(beats.reveal, fps);
  const f_explanation = toFrames(beats.explanationEntry, fps);
  const f_exit = toFrames(beats.exit, fps);
  
  // Animations
  const titleProgress = interpolate(
    frame,
    [f_title, f_title + toFrames(0.8, fps)],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.power3Out }
  );
  
  const questionProgress = interpolate(
    frame,
    [f_question, f_question + toFrames(0.8, fps)],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.power3Out }
  );
  
  // Question micro-delights
  const questionFloat = microDelights.enabled && microDelights.questionFloat
    ? useWordFloat(frame, 0, 3, 0.05)
    : {};
  
  // Timer calculation
  const thinkingDuration = beats.reveal - beats.thinking;
  const timerValue = config.timer.enabled && frame >= f_thinking && frame < f_reveal
    ? interpolate(
        frame,
        [f_thinking, f_reveal],
        [thinkingDuration, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      )
    : config.timer.duration;
  
  const timerNumber = microDelights.enabled
    ? useNumberCounter(frame, f_thinking, toFrames(thinkingDuration, fps), thinkingDuration, 0)
    : Math.ceil(timerValue);
  
  // Reveal animation
  const revealProgress = frame >= f_reveal
    ? interpolate(
        frame,
        [f_reveal, f_reveal + toFrames(0.6, fps)],
        [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.power3Out }
      )
    : 0;
  
  // Explanation animation
  const explanationProgress = frame >= f_explanation
    ? interpolate(
        frame,
        [f_explanation, f_explanation + toFrames(0.8, fps)],
        [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.power3Out }
      )
    : 0;
  
  // Exit animation
  const exitProgress = frame >= f_exit
    ? interpolate(
        frame,
        [f_exit, f_exit + toFrames(0.8, fps)],
        [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.power3In }
      )
    : 0;
  
  const globalOpacity = 1 - exitProgress;
  
  // Celebration burst particles
  const celebrationBurst = microDelights.enabled && microDelights.celebrationBurst && revealProgress > 0.5
    ? useCelebrationBurst(frame, f_reveal, 30)
    : null;
  
  // Lottie animations
  const thinkingLottie = microDelights.enabled && microDelights.lottieAnimations?.thinking
    ? useLottieMicroDelight('thinking', {
        triggerFrame: f_thinking,
        duration: toFrames(thinkingDuration, fps),
        type: 'background',
        opacity: 0.1,
        position: 'top-right'
      })
    : null;
  
  const confettiLottie = microDelights.enabled && microDelights.lottieAnimations?.confetti && revealProgress > 0
    ? useLottieMicroDelight('confetti', {
        triggerFrame: f_reveal,
        duration: 60,
        type: 'overlay',
        opacity: 0.6
      })
    : null;
  
  return (
    <AbsoluteFill className="overflow-hidden" style={{ backgroundColor: colors.bg, fontFamily: fontTokens.body.family }}>
      
      {/* Background Lottie - Thinking */}
      {thinkingLottie && thinkingLottie.component && (
        React.createElement(thinkingLottie.component, thinkingLottie.props)
      )}
      
      {/* Confetti overlay on reveal */}
      {confettiLottie && confettiLottie.component && (
        React.createElement(confettiLottie.component, confettiLottie.props)
      )}
      
      {/* Celebration burst particles */}
      {celebrationBurst && celebrationBurst.map((particle, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: particle.size,
            height: particle.size,
            backgroundColor: colors.correctBg,
            borderRadius: '50%',
            transform: `translate(${particle.x}px, ${particle.y}px)`,
            opacity: particle.opacity,
            pointerEvents: 'none'
          }}
        />
      ))}
      
      {/* Title */}
      {config.title.enabled && frame >= f_title && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: config.title.offset.y,
            transform: `translate(-50%, ${(1 - titleProgress) * 30}px)`,
            opacity: titleProgress * globalOpacity,
            fontSize: fonts.size_title,
            fontWeight: fonts.weight_title,
            fontFamily: fontTokens.title.family,
            color: colors.accent,
            textAlign: 'center'
          }}
        >
          {config.title.text}
        </div>
      )}
      
      {/* Question */}
      {frame >= f_question && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: config.question.offset.y,
            transform: `translate(-50%, ${(1 - questionProgress) * 30}px) ${questionFloat.transform || ''}`,
            opacity: questionProgress * globalOpacity,
            textAlign: 'center',
            maxWidth: '90%',
            ...questionFloat
          }}
        >
          {config.question.visual?.enabled && (
            <div style={{ marginBottom: 16 }}>
              {renderHero(
                mergeHeroConfig({
                  type: config.question.visual.type,
                  value: config.question.visual.value,
                  scale: config.question.visual.scale
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
            style={{
              fontSize: fonts.size_question,
              fontWeight: fonts.weight_question,
              fontFamily: fontTokens.title.family,
              color: colors.question,
              lineHeight: 1.3,
              textAlign: typography.align
            }}
          >
            {config.question.text}
          </div>
        </div>
      )}
      
      {/* Options */}
      {options.map((option, i) => {
        const optionStartTime = beats.optionsStart + (i * beats.optionInterval);
        const optionStartFrame = toFrames(optionStartTime, fps);
        
        if (frame < optionStartFrame) return null;
        
        const optionProgress = interpolate(
          frame,
          [optionStartFrame, optionStartFrame + toFrames(0.5, fps)],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.backOut }
        );
        
        const isCorrect = i === config.correctAnswer;
        const showResult = revealProgress > 0;
        const pos = optionPositions[i];
        
        // Micro-delights for choices
        const pulseStyle = microDelights.enabled && microDelights.choicePulse && !showResult
          ? useScalePulse(frame, optionStartFrame, 30, 0.9, 0.03)
          : {};
        
        const glowStyle = showResult && isCorrect && microDelights.enabled
          ? useBorderGlow(frame, colors.correctBg, 0.5, 0.15)
          : {};
        
        const shakeStyle = showResult && !isCorrect && microDelights.enabled
          ? useShake(frame, f_reveal, 20, 5)
          : {};
        
        const flashStyle = showResult && !isCorrect && microDelights.enabled
          ? useFlash(frame, f_reveal, 15, colors.incorrectBg)
          : {};
        
        // Colors
        let bgColor = colors.optionBg;
        let borderColor = colors.optionBorder;
        let textColor = colors.question;
        
        if (showResult) {
          if (isCorrect) {
            bgColor = colors.correctBg;
            borderColor = colors.correctBorder;
            textColor = '#FFFFFF';
          } else {
            bgColor = colors.incorrectBg;
            borderColor = colors.incorrectBorder;
            textColor = '#FFFFFF';
          }
        }
        
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: pos.x,
              top: pos.y,
              width: pos.width,
              height: pos.height,
              backgroundColor: bgColor,
              border: `3px solid ${borderColor}`,
              borderRadius: 16,
              padding: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              transform: `scale(${optionProgress * (pulseStyle.transform ? parseFloat(pulseStyle.transform.match(/scale\(([^)]+)\)/)?.[1] || '1') : 1)})`,
              opacity: optionProgress * globalOpacity,
              boxShadow: glowStyle.boxShadow || '0 4px 16px rgba(0,0,0,0.1)',
              ...shakeStyle,
              ...flashStyle
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: showResult && isCorrect ? '#FFFFFF' : colors.optionBorder,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                color: showResult && isCorrect ? colors.correctBg : colors.question,
                fontSize: 20,
                flexShrink: 0
              }}
            >
              {option.id}
            </div>
            <div
              style={{
                fontSize: fonts.size_option,
                fontWeight: fonts.weight_option,
                fontFamily: fontTokens.body.family,
                color: textColor,
                flex: 1
              }}
            >
              {option.text}
            </div>
            {showResult && isCorrect && (
              <div style={{ fontSize: 32, flexShrink: 0 }}>
                {microDelights.enabled && microDelights.lottieAnimations?.checkmark ? (
                  <RemotionLottie animation="checkmark" style={{ width: 40, height: 40 }} />
                ) : (
                  '✓'
                )}
              </div>
            )}
          </div>
        );
      })}
      
      {/* Timer */}
      {config.timer.enabled && frame >= f_thinking && frame < f_reveal && (
        <div
          style={{
            position: 'absolute',
            right: 60,
            top: 60,
            width: config.timer.style === 'progress' ? 200 : 100,
            height: config.timer.style === 'progress' ? 20 : 100,
            borderRadius: config.timer.style === 'progress' ? 10 : '50%',
            backgroundColor: colors.timer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: fonts.size_timer,
            fontWeight: 800,
            color: '#FFFFFF',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            opacity: globalOpacity
          }}
        >
          {config.timer.style === 'countdown' ? timerNumber : (
            <div
              style={{
                width: '90%',
                height: '60%',
                backgroundColor: 'rgba(255,255,255,0.3)',
                borderRadius: 5,
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: `${(timerValue / thinkingDuration) * 100}%`,
                  height: '100%',
                  backgroundColor: '#FFFFFF',
                  transition: 'width 0.1s linear'
                }}
              />
            </div>
          )}
        </div>
      )}
      
      {/* Explanation */}
      {config.explanation.show && frame >= f_explanation && (
        <div
          style={{
            position: 'absolute',
            bottom: 100,
            left: '50%',
            transform: `translate(-50%, ${(1 - explanationProgress) * 40}px)`,
            maxWidth: '80%',
            backgroundColor: colors.explanationBg,
            padding: '24px 36px',
            borderRadius: 16,
            border: `3px solid ${colors.explanationBorder}`,
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            opacity: explanationProgress * globalOpacity
          }}
        >
          <div
            style={{
              fontSize: fonts.size_explanation * 0.7,
              fontWeight: 700,
              fontFamily: fontTokens.title.family,
              color: colors.accent,
              marginBottom: 8,
              textTransform: 'uppercase',
              letterSpacing: 1
            }}
          >
            Explanation
          </div>
          <div
            style={{
              fontSize: fonts.size_explanation,
              fontWeight: 400,
              fontFamily: fontTokens.body.family,
              color: colors.question,
              lineHeight: 1.5,
              textAlign: 'center'
            }}
          >
            {config.explanation.text}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

export const getDuration = (scene, fps) => {
  const config = { ...DEFAULT_CONFIG, ...scene };
  const beats = { ...DEFAULT_CONFIG.beats, ...(scene.beats || {}) };
  return toFrames(beats.exit + 1.0, fps);
};

export const TEMPLATE_VERSION = '6.0';
export const TEMPLATE_ID = 'ChallengeQuiz';
export const PRIMARY_INTENTION = 'CHALLENGE';
export const SECONDARY_INTENTIONS = ['QUESTION', 'REVEAL'];
