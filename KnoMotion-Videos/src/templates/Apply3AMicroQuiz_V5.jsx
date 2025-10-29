import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import { THEME } from '../utils/theme';
import rough from 'roughjs/bundled/rough.esm.js';

// Blueprint v5.0 imports
import { 
  fadeUpIn, 
  pulseEmphasis,
  popInSpring,
  EZ,
  useSceneId,
  toFrames 
} from '../sdk';

/**
 * APPLY 3A: MICRO QUIZ - Blueprint v5.0
 * 
 * TEMPLATE STRATEGY:
 * - ✅ Blueprint v5.0 compliant
 * - ✅ NO GSAP - pure Remotion interpolate + presets
 * - ✅ NO useState - frame-driven countdown logic
 * - ✅ 5-second countdown timer with visual circle
 * - ✅ Uses fadeUpIn for question/explanation
 * - ✅ Uses popInSpring for options
 * - ✅ Uses pulseEmphasis for correct answer reveal
 * - ✅ Context-based ID factory
 * - ✅ Strict zero wobble
 * 
 * FLOW:
 * 1. Question fades up
 * 2. Options pop in (staggered)
 * 3. Countdown timer appears (5s circle animation)
 * 4. Correct answer revealed with pulse + celebration
 * 5. Explanation fades in
 * 
 * Duration: 12-15s
 */

const Apply3AMicroQuiz = ({ scene, styles, presets, easingMap, transitions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const id = useSceneId();
  
  const svgRef = useRef(null);

  // Style tokens with fallbacks
  const style = scene.style_tokens || {};
  const colors = style.colors || {
    bg: '#FAFBFC',
    accent: '#27AE60',
    accent2: '#FF6B35',
    wrong: '#E74C3C',
    ink: '#1A1A1A',
  };
  
  const fonts = style.fonts || {
    primary: THEME.fonts.marker.primary,
    secondary: THEME.fonts.structure.primary,
    size_question: 52,
    size_option: 26,
    size_timer: 64,
    size_explanation: 24,
  };

  const data = scene.fill?.quiz || {};
  const options = (data.options || []).slice(0, 4); // Max 4 options
  const correctIndex = data.correctIndex || 0;
  const countdownDuration = data.countdownDuration || 5.0;

  // Beats from JSON (in seconds) - Convert to frames
  const sceneBeats = scene.beats || {};
  const beats = {
    entrance: toFrames(sceneBeats.entrance || 0.6, fps),
    question: toFrames(sceneBeats.question || 0.6, fps),
    options: toFrames(sceneBeats.options || 1.8, fps),
    countdown: toFrames(sceneBeats.countdown || 3.5, fps),
    reveal: toFrames(sceneBeats.reveal || 8.5, fps),
    celebration: toFrames(sceneBeats.celebration || 9.0, fps),
    explanation: toFrames(sceneBeats.explanation || 9.5, fps),
    exit: toFrames(sceneBeats.exit || 12.0, fps),
  };

  const countdownFrames = toFrames(countdownDuration, fps);

  // ========================================
  // ANIMATIONS (Using Presets)
  // ========================================
  
  // Question animation
  const questionAnim = fadeUpIn(frame, {
    start: sceneBeats.question || 0.6,
    dur: 1.0,
    dist: 40,
    ease: 'power3InOut'
  }, EZ, fps);

  // Options animations (staggered pop-in)
  const optionAnims = options.map((_, index) => {
    const startTime = (sceneBeats.options || 1.8) + index * 0.3;
    
    const popIn = popInSpring(frame, {
      start: startTime,
      mass: 1,
      stiffness: 150,
      damping: 12
    }, EZ, fps);
    
    return popIn;
  });

  // Countdown timer calculation (frame-driven)
  const countdownStart = beats.countdown;
  const countdownEnd = beats.countdown + countdownFrames;
  const isCountingDown = frame >= countdownStart && frame < countdownEnd;
  const countdownComplete = frame >= countdownEnd;
  
  // Calculate current countdown number (5, 4, 3, 2, 1)
  const elapsedFrames = frame - countdownStart;
  const secondsRemaining = Math.max(0, Math.ceil(countdownDuration - (elapsedFrames / fps)));
  
  // Timer circle progress (0 → 1 over countdown duration)
  const timerProgress = isCountingDown 
    ? Math.min((frame - countdownStart) / countdownFrames, 1)
    : countdownComplete ? 1 : 0;

  // Correct answer reveal pulse
  const correctPulse = pulseEmphasis(frame, {
    start: sceneBeats.reveal || 8.5,
    dur: 0.8,
    scale: 1.08,
    ease: 'backOut'
  }, EZ, fps);

  // Explanation animation
  const explanationAnim = fadeUpIn(frame, {
    start: sceneBeats.explanation || 9.5,
    dur: 1.0,
    dist: 30,
    ease: 'smooth'
  }, EZ, fps);

  // ========================================
  // ROUGH.JS DECORATIONS (ZERO WOBBLE)
  // ========================================

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const rc = rough.svg(svg);

    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // Countdown timer circle (during countdown)
    if (isCountingDown || countdownComplete) {
      const centerX = 960;
      const centerY = 200;
      const radius = 70;
      
      // Background circle
      const bgCircle = rc.circle(centerX, centerY, radius * 2, {
        stroke: colors.ink,
        strokeWidth: 2,
        roughness: 0,  // STRICT ZERO WOBBLE
        bowing: 0,     // STRICT ZERO WOBBLE
        fill: 'transparent',
      });
      svg.appendChild(bgCircle);
      
      // Progress arc (animated)
      const arcAngle = timerProgress * 360;
      const arcPath = describeArc(centerX, centerY, radius, 0, arcAngle);
      
      const progressArc = rc.path(arcPath, {
        stroke: countdownComplete ? colors.accent : colors.accent2,
        strokeWidth: 4,
        roughness: 0,
        bowing: 0,
      });
      svg.appendChild(progressArc);
    }

    // Celebration burst (after reveal)
    if (frame >= beats.celebration) {
      const burstProgress = Math.min((frame - beats.celebration) / 20, 1);
      
      // Star burst lines
      for (let i = 0; i < 8; i++) {
        const angle = (i * 45) * Math.PI / 180;
        const length = 40 * burstProgress;
        const startX = 960;
        const startY = 650 + correctIndex * 90;
        const endX = startX + Math.cos(angle) * length;
        const endY = startY + Math.sin(angle) * length;
        
        const burst = rc.line(startX, startY, endX, endY, {
          stroke: colors.accent,
          strokeWidth: 3,
          roughness: 0,
          bowing: 0,
        });
        svg.appendChild(burst);
      }
    }

  }, [frame, beats, isCountingDown, countdownComplete, timerProgress, colors, correctIndex, id]);

  // Helper function for arc path
  const describeArc = (x, y, radius, startAngle, endAngle) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
  };

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        backgroundImage: `
          radial-gradient(circle at 50% 20%, ${colors.accent2}06 0%, transparent 50%)
        `,
      }}
    >
      {/* SVG layer for decorations */}
      <svg
        ref={svgRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid meet"
      />

      {/* Content layer */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          padding: '100px 120px',
        }}
      >
        {/* Question */}
        {frame >= beats.question && (
          <div
            style={{
              opacity: questionAnim.opacity,
              transform: `translateY(${questionAnim.translateY || 0}px)`,
              marginBottom: 80,
              maxWidth: 900,
            }}
          >
            <h1
              style={{
                fontFamily: fonts.primary,
                fontSize: fonts.size_question,
                color: colors.ink,
                margin: 0,
                textAlign: 'center',
                lineHeight: 1.3,
              }}
            >
              {data.question}
            </h1>
          </div>
        )}

        {/* Countdown timer */}
        {(isCountingDown || countdownComplete) && (
          <div
            style={{
              position: 'absolute',
              top: 130,
              left: '50%',
              transform: 'translateX(-50%)',
              opacity: countdownComplete ? 0 : 1,
              transition: 'opacity 0.3s',
            }}
          >
            <span
              style={{
                fontFamily: fonts.primary,
                fontSize: fonts.size_timer,
                color: secondsRemaining <= 2 ? colors.accent2 : colors.ink,
                fontWeight: 'bold',
              }}
            >
              {secondsRemaining}
            </span>
          </div>
        )}

        {/* Options */}
        <div
          style={{
            width: '100%',
            maxWidth: 800,
            display: 'flex',
            flexDirection: 'column',
            gap: 30,
          }}
        >
          {options.map((option, index) => {
            const anim = optionAnims[index];
            const isVisible = frame >= beats.options + index * 0.3 * fps;
            const isCorrect = index === correctIndex;
            const showAnswer = frame >= beats.reveal;
            
            if (!isVisible) return null;
            
            const scale = (showAnswer && isCorrect) ? correctPulse.scale : (anim.scale || 1);
            const bgColor = (showAnswer && isCorrect) ? `${colors.accent}20` : 'transparent';
            const borderColor = (showAnswer && isCorrect) ? colors.accent : colors.ink;
            
            return (
              <div
                key={index}
                style={{
                  opacity: anim.opacity,
                  transform: `scale(${scale})`,
                  padding: '24px 32px',
                  border: `3px solid ${borderColor}`,
                  borderRadius: 12,
                  backgroundColor: bgColor,
                  transition: 'all 0.3s ease',
                }}
              >
                <p
                  style={{
                    fontFamily: fonts.secondary,
                    fontSize: fonts.size_option,
                    color: colors.ink,
                    margin: 0,
                    fontWeight: (showAnswer && isCorrect) ? 'bold' : 'normal',
                  }}
                >
                  {String.fromCharCode(65 + index)}. {option}
                </p>
              </div>
            );
          })}
        </div>

        {/* Explanation */}
        {frame >= beats.explanation && data.explanation && (
          <div
            style={{
              marginTop: 60,
              opacity: explanationAnim.opacity,
              transform: `translateY(${explanationAnim.translateY || 0}px)`,
              maxWidth: 700,
            }}
          >
            <p
              style={{
                fontFamily: fonts.secondary,
                fontSize: fonts.size_explanation,
                color: `${colors.ink}CC`,
                margin: 0,
                textAlign: 'center',
                lineHeight: 1.6,
              }}
            >
              {data.explanation}
            </p>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ========================================
// BLUEPRINT V5.0 - REQUIRED EXPORTS
// ========================================

export { Apply3AMicroQuiz };

export const TEMPLATE_ID = 'Apply3AMicroQuiz';
export const TEMPLATE_VERSION = '5.0.0';

export const getDuration = (scene, fps) => {
  const tailPadding = 1.0;
  return toFrames((scene.beats?.exit || 12.0) + tailPadding, fps);
};

export const DURATION_MIN_FRAMES = 360;  // 12s @ 30fps
export const DURATION_MAX_FRAMES = 450;  // 15s @ 30fps

export const SUPPORTED_MODES = ['notebook', 'whiteboard'];

export const CAPABILITIES = {
  usesSVG: true,
  usesLottie: false,
  usesRoughJS: true,
  requiresAudio: false,
  supportsTransitions: true,
  hasInteractiveElements: true  // Countdown timer + quiz logic
};

export const PRESETS_REQUIRED = [
  'fadeUpIn',
  'popInSpring',
  'pulseEmphasis'
];

export const getPosterFrame = (scene, fps) => {
  // Show frame with all options visible + countdown
  return toFrames(scene.beats?.countdown || 3.5, fps) + 30;
};
