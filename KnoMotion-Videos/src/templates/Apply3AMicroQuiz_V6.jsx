import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import { EZ, toFrames, renderHero, mergeHeroConfig } from '../sdk';

/**
 * TEMPLATE #4: MICRO QUIZ - v6.0
 * 
 * PRIMARY INTENTION: CHALLENGE
 * SECONDARY INTENTIONS: QUESTION, REVEAL
 * 
 * PURPOSE: Interactive multiple-choice questions with countdown and answer reveal
 * 
 * VISUAL PATTERN:
 * - Question text with optional visual
 * - Multiple choice options (2-4 choices)
 * - Countdown timer
 * - Correct answer reveal
 * 
 * AGNOSTIC PRINCIPALS:
 * ✓ Type-Based Polymorphism (hero registry for visuals)
 * ✓ Data-Driven Structure (dynamic choices array)
 * ✓ Token-Based Positioning (semantic layout)
 * ✓ Separation of Concerns (content/layout/style/animation)
 * ✓ Progressive Configuration (simple defaults)
 * ✓ Registry Pattern (extensible types)
 * 
 * CONFIGURABILITY:
 * - Question text and visual
 * - Choices array (2-4 options)
 * - Correct answer index
 * - Timer duration
 * - Colors (background, question, choices, correct/incorrect)
 * - Fonts (sizes, weights)
 * - Timing (all beat points)
 * - Timer style
 * 
 * NO HARDCODED VALUES!
 */

const DEFAULT_CONFIG = {
  question: {
    text: 'What is the capital of France?',
    visual: {
      type: 'emoji',
      value: '🗼',
      scale: 2.0,
      enabled: false
    }
  },
  
  choices: [
    { text: 'London', id: 'A' },
    { text: 'Paris', id: 'B' },
    { text: 'Berlin', id: 'C' },
    { text: 'Madrid', id: 'D' }
  ],
  
  correctAnswer: 1, // 0-based index
  
  timer: {
    duration: 8,
    enabled: true,
    style: 'countdown' // countdown | progress
  },
  
  style_tokens: {
    colors: {
      bg: '#FFF9F0',
      question: '#1A1A1A',
      choice: '#FFFFFF',
      choiceBorder: '#CBD5E0',
      correct: '#2ECC71',
      incorrect: '#E74C3C',
      timer: '#FF6B35'
    },
    fonts: {
      size_question: 48,
      size_choice: 28,
      size_timer: 64,
      weight_question: 700,
      weight_choice: 600
    }
  },
  
  beats: {
    entrance: 0.5,
    question: 1.0,
    choicesReveal: 2.0,
    choiceInterval: 0.3,
    thinking: 4.0,
    reveal: 10.0,
    hold: 12.0,
    exit: 14.0
  }
};

export const Apply3AMicroQuiz = ({ scene, styles, presets, easingMap }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const config = { ...DEFAULT_CONFIG, ...scene };
  const beats = { ...DEFAULT_CONFIG.beats, ...(scene.beats || {}) };
  const colors = { ...DEFAULT_CONFIG.style_tokens.colors, ...(scene.style_tokens?.colors || {}) };
  const fonts = { ...DEFAULT_CONFIG.style_tokens.fonts, ...(scene.style_tokens?.fonts || {}) };
  const timer = { ...DEFAULT_CONFIG.timer, ...(scene.timer || {}) };
  const choices = config.choices || DEFAULT_CONFIG.choices;
  
  const f_entrance = toFrames(beats.entrance, fps);
  const f_question = toFrames(beats.question, fps);
  const f_choices = toFrames(beats.choicesReveal, fps);
  const f_thinking = toFrames(beats.thinking, fps);
  const f_reveal = toFrames(beats.reveal, fps);
  const f_exit = toFrames(beats.exit, fps);
  
  // Question animation
  const questionProgress = interpolate(
    frame,
    [f_question, f_question + toFrames(0.8, fps)],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.power3Out }
  );
  
  // Timer countdown
  const thinkingDuration = beats.reveal - beats.thinking;
  const timerValue = timer.enabled && frame >= f_thinking && frame < f_reveal
    ? interpolate(
        frame,
        [f_thinking, f_reveal],
        [thinkingDuration, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      )
    : timer.duration;
  
  // Reveal animation
  const revealProgress = frame >= f_reveal
    ? interpolate(
        frame,
        [f_reveal, f_reveal + toFrames(0.6, fps)],
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
  
  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, fontFamily: 'Inter, sans-serif' }}>
      
      {/* Question */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '20%',
          transform: `translate(-50%, ${(1 - questionProgress) * 30}px)`,
          opacity: questionProgress * globalOpacity,
          textAlign: 'center',
          maxWidth: '90%'
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
            color: colors.question,
            lineHeight: 1.3
          }}
        >
          {config.question.text}
        </div>
      </div>
      
      {/* Choices */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          maxWidth: 800,
          display: 'grid',
          gridTemplateColumns: choices.length <= 2 ? '1fr' : '1fr 1fr',
          gap: 16
        }}
      >
        {choices.map((choice, i) => {
          const choiceBeat = f_choices + toFrames(beats.choiceInterval * i, fps);
          const choiceProgress = frame >= choiceBeat
            ? interpolate(
                frame,
                [choiceBeat, choiceBeat + toFrames(0.4, fps)],
                [0, 1],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EZ.backOut }
              )
            : 0;
          
          if (choiceProgress === 0) return null;
          
          const isCorrect = i === config.correctAnswer;
          const showResult = revealProgress > 0;
          
          let bgColor = colors.choice;
          let borderColor = colors.choiceBorder;
          
          if (showResult) {
            if (isCorrect) {
              bgColor = colors.correct;
              borderColor = colors.correct;
            } else {
              bgColor = colors.incorrect;
              borderColor = colors.incorrect;
            }
          }
          
          return (
            <div
              key={i}
              style={{
                backgroundColor: bgColor,
                border: `3px solid ${borderColor}`,
                borderRadius: 12,
                padding: 20,
                transform: `scale(${choiceProgress})`,
                opacity: choiceProgress * globalOpacity,
                transition: showResult ? 'all 0.3s ease-out' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 12
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: showResult && isCorrect ? '#FFFFFF' : colors.choiceBorder,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  color: showResult && isCorrect ? colors.correct : colors.question,
                  fontSize: 20,
                  flexShrink: 0
                }}
              >
                {choice.id}
              </div>
              <div
                style={{
                  fontSize: fonts.size_choice,
                  fontWeight: fonts.weight_choice,
                  color: showResult ? '#FFFFFF' : colors.question,
                  flex: 1
                }}
              >
                {choice.text}
              </div>
              {showResult && isCorrect && (
                <div style={{ fontSize: 32, flexShrink: 0 }}>✓</div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Timer */}
      {timer.enabled && frame >= f_thinking && frame < f_reveal && (
        <div
          style={{
            position: 'absolute',
            right: 60,
            top: 60,
            width: 100,
            height: 100,
            borderRadius: '50%',
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
          {Math.ceil(timerValue)}
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
export const TEMPLATE_ID = 'Apply3AMicroQuiz';
export const PRIMARY_INTENTION = 'CHALLENGE';
export const SECONDARY_INTENTIONS = ['QUESTION', 'REVEAL'];
