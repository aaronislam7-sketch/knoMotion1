import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';

// SDK imports - Agnostic Template System v6
import { 
  fadeUpIn,
  slideInLeft,
  popInSpring,
  pulseEmphasis,
  EZ,
  toFrames,
  renderHero,
  mergeHeroConfig,
  resolvePosition,
  positionToCSS,
  generateAmbientParticles,
  renderAmbientParticles
} from '../sdk';

/**
 * TEMPLATE #13: INTERACTIVE POLL/QUIZ - v6.0
 * 
 * PRIMARY INTENTION: CHALLENGE
 * SECONDARY INTENTIONS: QUESTION, REVEAL
 * 
 * PURPOSE: Present question with answer options, reveal correct answer
 * 
 * VISUAL PATTERN:
 * - Large question at top
 * - Answer options in clean grid/list (2-6 options)
 * - Visual indicators for selection
 * - Correct answer reveal with explanation
 * - Optional timer for think time
 * 
 * ONE CONCEPT RULE:
 * - Screen 1: Question only (clear, focused)
 * - Transition: Fade in options
 * - Screen 2: Options appear sequentially
 * - Transition: Pause for "think time"
 * - Screen 3: Correct answer highlights + explanation
 * 
 * AGNOSTIC PRINCIPALS:
 * ✓ Type-Based Polymorphism (option visuals via hero registry)
 * ✓ Data-Driven Structure (dynamic options array)
 * ✓ Token-Based Positioning (semantic layout)
 * ✓ Separation of Concerns (content/layout/style/animation)
 * ✓ Progressive Configuration (simple defaults)
 * ✓ Registry Pattern (extensible option types)
 */

// Default configuration
const DEFAULT_CONFIG = {
  title: {
    text: 'Quick Quiz',
    position: 'top-center',
    offset: { x: 0, y: 30 }
  },
  
  question: {
    text: 'What is the capital of France?',
    position: 'top-center',
    offset: { x: 0, y: 140 },
    multiline: false
  },
  
  options: [
    { text: 'London', icon: null },
    { text: 'Berlin', icon: null },
    { text: 'Paris', icon: null },
    { text: 'Madrid', icon: null }
  ],
  
  correctAnswer: 2, // 0-indexed
  
  // Layout configuration
  layout: 'grid', // grid, vertical, horizontal
  optionsPerRow: 2,
  
  // Timer configuration
  showTimer: true,
  thinkTimeSeconds: 5,
  
  // Explanation
  explanation: {
    show: true,
    text: 'Paris has been the capital of France since 987 AD',
    position: 'bottom-center',
    offset: { x: 0, y: -100 }
  },
  
  style_tokens: {
    colors: {
      bg: '#1A1A2E',
      accent: '#FF6B35',
      accent2: '#9B59B6',
      ink: '#EAEAEA',
      optionBg: '#2C2C54',
      optionBorder: '#4A4A6A',
      correctBg: '#00C853',
      correctBorder: '#00E676',
      incorrectBg: '#D32F2F',
      incorrectBorder: '#FF5252',
      timerBg: '#FF6B35',
      explanationBg: '#2C2C54'
    },
    fonts: {
      size_title: 48,
      size_question: 56,
      size_option: 32,
      size_explanation: 28,
      size_timer: 64
    }
  },
  
  beats: {
    entrance: 0.4,
    titleEntry: 0.6,
    questionEntry: 1.0,
    optionsStart: 1.8,
    optionInterval: 0.3,
    thinkTime: 5.0,
    revealAnswer: 0.8,
    explanationEntry: 1.2,
    exit: 3.0
  },
  
  animation: {
    questionAnimation: 'fade-up',
    optionEntrance: 'pop',
    correctReveal: 'pulse',
    incorrectReveal: 'shake',
    easing: 'power3InOut'
  }
};

// Calculate option positions based on layout
const calculateOptionLayout = (optionCount, layout, optionsPerRow, width, height) => {
  const positions = [];
  const centerY = height * 0.55;
  const startY = centerY - 100;
  
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
    const gridStartY = startY;
    
    for (let i = 0; i < optionCount; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      positions.push({
        x: startX + (col * (boxWidth + gapX)),
        y: gridStartY + (row * (boxHeight + gapY)),
        width: boxWidth,
        height: boxHeight
      });
    }
  } else if (layout === 'vertical') {
    const boxWidth = 600;
    const boxHeight = 90;
    const gap = 20;
    const startX = (width - boxWidth) / 2;
    
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
        y: centerY,
        width: boxWidth,
        height: boxHeight
      });
    }
  }
  
  return positions;
};

// Render countdown timer
const renderTimer = (timeLeft, colors, fonts) => {
  return (
    <div style={{
      position: 'absolute',
      top: 60,
      right: 80,
      width: 120,
      height: 120,
      borderRadius: '50%',
      backgroundColor: colors.timerBg,
      border: `4px solid ${colors.accent2}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: fonts.size_timer,
      fontWeight: 900,
      fontFamily: '"Permanent Marker", cursive',
      color: '#FFFFFF',
      boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
      zIndex: 20
    }}>
      {Math.ceil(timeLeft)}
    </div>
  );
};

export const Challenge13PollQuiz = ({ scene, styles, presets, easingMap }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  
  if (!scene) {
    return <AbsoluteFill style={{ backgroundColor: '#1A1A2E' }} />;
  }
  
  // Merge with defaults
  const config = {
    ...DEFAULT_CONFIG,
    ...scene,
    title: { ...DEFAULT_CONFIG.title, ...(scene.title || {}) },
    question: { ...DEFAULT_CONFIG.question, ...(scene.question || {}) },
    options: scene.options || DEFAULT_CONFIG.options,
    explanation: { ...DEFAULT_CONFIG.explanation, ...(scene.explanation || {}) },
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
  const options = config.options;
  
  // Calculate option positions
  const optionPositions = calculateOptionLayout(
    options.length,
    config.layout || DEFAULT_CONFIG.layout,
    config.optionsPerRow || DEFAULT_CONFIG.optionsPerRow,
    width,
    height
  );
  
  // Ambient particles
  const particles = generateAmbientParticles(30, 13001, width, height);
  const particleElements = renderAmbientParticles(particles, frame, fps, [colors.accent, colors.accent2, colors.bg]);
  
  // Title animation
  const titleStartFrame = toFrames(beats.titleEntry, fps);
  const titleAnim = fadeUpIn(frame, {
    start: beats.titleEntry,
    dur: 0.8,
    dist: 50,
    ease: 'smooth'
  }, EZ, fps);
  
  const titlePos = resolvePosition(
    config.title.position,
    config.title.offset,
    { width, height }
  );
  
  // Question animation
  const questionStartFrame = toFrames(beats.questionEntry, fps);
  const questionAnim = fadeUpIn(frame, {
    start: beats.questionEntry,
    dur: 1.0,
    dist: 60,
    ease: 'smooth'
  }, EZ, fps);
  
  const questionPos = resolvePosition(
    config.question.position,
    config.question.offset,
    { width, height }
  );
  
  // Options animation
  const optionsStartFrame = toFrames(beats.optionsStart, fps);
  const allOptionsVisibleTime = beats.optionsStart + (options.length * beats.optionInterval);
  const thinkTimeEndFrame = toFrames(allOptionsVisibleTime + beats.thinkTime, fps);
  
  // Timer calculation
  const timerStartTime = allOptionsVisibleTime;
  const timerStartFrame = toFrames(timerStartTime, fps);
  const timeElapsed = frame >= timerStartFrame ? (frame - timerStartFrame) / fps : 0;
  const timeLeft = Math.max(0, beats.thinkTime - timeElapsed);
  
  // Answer reveal
  const revealStartFrame = toFrames(allOptionsVisibleTime + beats.thinkTime, fps);
  const revealProgress = frame >= revealStartFrame ? 
    Math.min((frame - revealStartFrame) / toFrames(beats.revealAnswer, fps), 1) : 0;
  
  // Explanation animation
  const explanationStartTime = allOptionsVisibleTime + beats.thinkTime + beats.revealAnswer + 0.3;
  const explanationStartFrame = toFrames(explanationStartTime, fps);
  const explanationAnim = fadeUpIn(frame, {
    start: explanationStartTime,
    dur: 0.8,
    dist: 40,
    ease: 'smooth'
  }, EZ, fps);
  
  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      {/* Ambient particles */}
      <svg
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          zIndex: 0,
          opacity: 0.4
        }}
        viewBox="0 0 1920 1080"
      >
        {particleElements.map(p => p.element)}
      </svg>
      
      {/* Title */}
      {frame >= titleStartFrame && (
        <div style={{
          position: 'absolute',
          left: titlePos.x,
          top: titlePos.y,
          fontSize: fonts.size_title,
          fontWeight: 700,
          fontFamily: 'Inter, sans-serif',
          color: colors.accent,
          textAlign: 'center',
          opacity: titleAnim.opacity,
          transform: `translate(-50%, -50%) translateY(${titleAnim.translateY}px)`,
          zIndex: 10
        }}>
          {config.title.text}
        </div>
      )}
      
      {/* Question */}
      {frame >= questionStartFrame && (
        <div style={{
          position: 'absolute',
          left: questionPos.x,
          top: questionPos.y,
          fontSize: fonts.size_question,
          fontWeight: 900,
          fontFamily: '"Permanent Marker", cursive',
          color: colors.ink,
          textAlign: 'center',
          maxWidth: '85%',
          lineHeight: 1.2,
          opacity: questionAnim.opacity,
          transform: `translate(-50%, -50%) translateY(${questionAnim.translateY}px)`,
          zIndex: 10
        }}>
          {config.question.text}
        </div>
      )}
      
      {/* Timer */}
      {config.showTimer && frame >= timerStartFrame && frame < revealStartFrame && (
        renderTimer(timeLeft, colors, fonts)
      )}
      
      {/* Options */}
      {options.map((option, index) => {
        const optionStartTime = beats.optionsStart + (index * beats.optionInterval);
        const optionStartFrame = toFrames(optionStartTime, fps);
        
        if (frame < optionStartFrame) return null;
        
        const optionProgress = Math.min((frame - optionStartFrame) / toFrames(0.5, fps), 1);
        const pos = optionPositions[index];
        
        // Entrance animation
        let optionAnim = { opacity: 1, scale: 1, translateX: 0, translateY: 0 };
        if (config.animation.optionEntrance === 'pop') {
          optionAnim = popInSpring(frame, {
            start: optionStartTime,
            dur: 0.5,
            ease: 'backOut'
          }, EZ, fps);
        } else {
          optionAnim.opacity = EZ.smooth(optionProgress);
          optionAnim.scale = EZ.backOut(optionProgress);
        }
        
        // Determine if this is correct/incorrect
        const isCorrect = index === config.correctAnswer;
        const shouldReveal = frame >= revealStartFrame;
        
        // Colors based on reveal state
        let bgColor = colors.optionBg;
        let borderColor = colors.optionBorder;
        let borderWidth = 3;
        let boxShadow = '0 4px 16px rgba(0,0,0,0.2)';
        
        if (shouldReveal) {
          if (isCorrect) {
            bgColor = colors.correctBg;
            borderColor = colors.correctBorder;
            borderWidth = 5;
            const pulseScale = 1 + (0.05 * Math.sin(frame * 0.2));
            optionAnim.scale *= pulseScale;
            boxShadow = `0 0 30px ${colors.correctBg}`;
          } else {
            bgColor = colors.incorrectBg;
            borderColor = colors.incorrectBorder;
            borderWidth = 3;
            boxShadow = '0 4px 16px rgba(0,0,0,0.3)';
          }
        }
        
        return (
          <div key={index} style={{
            position: 'absolute',
            left: pos.x,
            top: pos.y,
            width: pos.width,
            height: pos.height,
            backgroundColor: bgColor,
            border: `${borderWidth}px solid ${borderColor}`,
            borderRadius: 16,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            opacity: optionAnim.opacity,
            transform: `scale(${optionAnim.scale})`,
            boxShadow: boxShadow,
            transition: shouldReveal ? 'all 0.5s ease' : 'none',
            zIndex: 15
          }}>
            {/* Option letter */}
            <div style={{
              fontSize: fonts.size_option * 0.6,
              fontWeight: 900,
              fontFamily: '"Permanent Marker", cursive',
              color: shouldReveal ? '#FFFFFF' : colors.accent,
              marginBottom: 8
            }}>
              {String.fromCharCode(65 + index)}
            </div>
            
            {/* Option text */}
            <div style={{
              fontSize: fonts.size_option,
              fontWeight: 700,
              fontFamily: 'Inter, sans-serif',
              color: shouldReveal ? '#FFFFFF' : colors.ink,
              textAlign: 'center',
              lineHeight: 1.3
            }}>
              {option.text}
            </div>
            
            {/* Checkmark for correct answer */}
            {shouldReveal && isCorrect && (
              <div style={{
                fontSize: fonts.size_option * 1.2,
                fontWeight: 900,
                color: '#FFFFFF',
                marginTop: 8,
                animation: 'bounce 0.6s ease'
              }}>
                ✓
              </div>
            )}
          </div>
        );
      })}
      
      {/* Explanation */}
      {config.explanation.show && frame >= explanationStartFrame && (
        <div style={{
          position: 'absolute',
          bottom: 100,
          left: '50%',
          transform: `translate(-50%, 0) translateY(${explanationAnim.translateY}px)`,
          maxWidth: '80%',
          backgroundColor: colors.explanationBg,
          padding: '24px 36px',
          borderRadius: 16,
          border: `3px solid ${colors.accent}`,
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          opacity: explanationAnim.opacity,
          zIndex: 20
        }}>
          <div style={{
            fontSize: fonts.size_explanation * 0.7,
            fontWeight: 700,
            fontFamily: 'Inter, sans-serif',
            color: colors.accent,
            marginBottom: 8,
            textTransform: 'uppercase',
            letterSpacing: 1
          }}>
            Explanation
          </div>
          <div style={{
            fontSize: fonts.size_explanation,
            fontWeight: 400,
            fontFamily: 'Inter, sans-serif',
            color: colors.ink,
            lineHeight: 1.5,
            textAlign: 'center'
          }}>
            {config.explanation.text}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// Required exports
export const TEMPLATE_ID = 'Challenge13PollQuiz';
export const TEMPLATE_VERSION = '6.0.0';

// Attach version to component for TemplateRouter detection
Challenge13PollQuiz.TEMPLATE_VERSION = '6.0.0';
Challenge13PollQuiz.TEMPLATE_ID = 'Challenge13PollQuiz';

export const LEARNING_INTENTIONS = {
  primary: ['challenge'],
  secondary: ['question', 'reveal'],
  tags: ['quiz', 'poll', 'multiple-choice', 'assessment', 'interactive']
};

export const getDuration = (scene, fps) => {
  const config = { ...DEFAULT_CONFIG, ...scene };
  const options = config.options || DEFAULT_CONFIG.options;
  const beats = { ...DEFAULT_CONFIG.beats, ...(scene.beats || {}) };
  
  const optionsRevealDuration = options.length * beats.optionInterval;
  const explanationDuration = config.explanation?.show ? beats.explanationEntry + 2.0 : 0;
  
  const totalDuration = beats.optionsStart + optionsRevealDuration + beats.thinkTime + 
                        beats.revealAnswer + explanationDuration + beats.exit;
  
  return toFrames(totalDuration, fps);
};

export const CAPABILITIES = {
  usesSVG: false,
  usesRoughJS: false,
  usesLottie: false,
  requiresAudio: false,
  dynamicOptions: true,
  maxOptions: 6,
  minOptions: 2,
  layoutOptions: ['grid', 'vertical', 'horizontal']
};

// Configuration schema for AdminConfig integration
export const CONFIG_SCHEMA = {
  title: {
    type: 'object',
    fields: {
      text: { type: 'string', required: true },
      position: { type: 'position-token', default: 'top-center' },
      offset: { type: 'offset', default: { x: 0, y: 30 } }
    }
  },
  question: {
    type: 'object',
    fields: {
      text: { type: 'string', required: true },
      position: { type: 'position-token', default: 'top-center' },
      offset: { type: 'offset', default: { x: 0, y: 140 } },
      multiline: { type: 'boolean', default: false }
    }
  },
  options: {
    type: 'dynamic-array',
    min: 2,
    max: 6,
    itemSchema: {
      text: { type: 'string', required: true },
      icon: { type: 'polymorphic-hero', required: false }
    }
  },
  correctAnswer: {
    type: 'number',
    min: 0,
    required: true
  },
  layout: {
    type: 'enum',
    options: ['grid', 'vertical', 'horizontal'],
    default: 'grid'
  },
  optionsPerRow: {
    type: 'number',
    min: 1,
    max: 4,
    default: 2
  },
  showTimer: {
    type: 'boolean',
    default: true
  },
  thinkTimeSeconds: {
    type: 'number',
    min: 3,
    max: 15,
    default: 5
  },
  explanation: {
    type: 'object',
    fields: {
      show: { type: 'boolean', default: true },
      text: { type: 'string', required: false },
      position: { type: 'position-token', default: 'bottom-center' },
      offset: { type: 'offset', default: { x: 0, y: -100 } }
    }
  },
  style_tokens: {
    type: 'style-tokens',
    colors: ['bg', 'accent', 'accent2', 'ink', 'optionBg', 'optionBorder', 'correctBg', 'correctBorder', 'incorrectBg', 'incorrectBorder', 'timerBg', 'explanationBg'],
    fonts: ['size_title', 'size_question', 'size_option', 'size_explanation', 'size_timer']
  },
  beats: {
    type: 'timeline',
    beats: ['entrance', 'titleEntry', 'questionEntry', 'optionsStart', 'optionInterval', 'thinkTime', 'revealAnswer', 'explanationEntry', 'exit']
  },
  animation: {
    type: 'animation-config',
    options: {
      questionAnimation: ['fade-up', 'slide-left', 'pop'],
      optionEntrance: ['fade', 'pop', 'slide-left'],
      correctReveal: ['pulse', 'glow', 'scale'],
      incorrectReveal: ['shake', 'fade', 'none'],
      easing: ['power3InOut', 'backOut', 'smooth']
    }
  }
};
