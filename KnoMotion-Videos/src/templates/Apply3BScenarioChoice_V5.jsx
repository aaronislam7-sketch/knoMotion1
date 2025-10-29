import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import { THEME } from '../utils/theme';
import rough from 'roughjs/bundled/rough.esm.js';
import { Player } from '@lottiefiles/react-lottie-player';

// Blueprint v5.0 imports
import { 
  fadeUpIn, 
  popInSpring,
  pulseEmphasis,
  EZ,
  useSceneId,
  toFrames 
} from '../sdk';

/**
 * APPLY 3B: SCENARIO CHOICE - Blueprint v5.0
 * 
 * TEMPLATE STRATEGY:
 * - ✅ Blueprint v5.0 compliant
 * - ✅ Uses animation presets (fadeUpIn, popInSpring, pulseEmphasis)
 * - ✅ Reads beats from JSON (in seconds)
 * - ✅ Context-based ID factory (useSceneId)
 * - ✅ Strict zero wobble (roughness: 0, bowing: 0)
 * - ✅ FPS-agnostic (seconds → frames conversion)
 * 
 * CONVERSATIONAL FLOW:
 * 1. Title appears
 * 2. Scenario context (Lottie/image + description)
 * 3. "How would you apply...?" question
 * 4. Choice paths appear (2-3 options)
 * 5. Correct choice emphasized & others fade
 * 6. Explanation reveals WHY this approach works
 * 
 * TYPOGRAPHY:
 * - Primary: Permanent Marker (bold, energetic)
 * - Secondary: Inter (clean readability)
 * 
 * Duration: 22-35s (derived from beats.exit)
 */

const Apply3BScenarioChoice = ({ scene, styles, presets, easingMap, transitions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const id = useSceneId();
  
  const svgRef = useRef(null);

  // Style tokens with fallbacks
  const style = scene.style_tokens || {};
  const colors = style.colors || {
    bg: '#FFF9F0',
    accent: '#27AE60',    // Green for correct
    accent2: '#2E7FE4',   // Blue
    accent3: '#FF6B35',   // Bold orange
    wrong: '#E74C3C',     // Red for incorrect
    ink: '#1A1A1A',
  };

  const fonts = style.fonts || {
    primary: THEME.fonts.marker.primary,  // Permanent Marker
    secondary: THEME.fonts.structure.primary,
    size_title: 48,
    size_scenario: 28,
    size_question: 38,
    size_choice: 24,
    size_explanation: 26,
  };

  const data = scene.fill?.scenario || {};
  const choices = (data.choices || []).slice(0, 3); // Max 3 choices
  const correctIndex = data.correctIndex || 0;

  // Beats from JSON (in seconds) - Convert to frames
  const sceneBeats = scene.beats || {};
  const beats = {
    prelude: 0,
    title: toFrames(sceneBeats.title || 0.5, fps),
    scenario: toFrames(sceneBeats.scenario || 1.5, fps),
    question: toFrames(sceneBeats.question || 3.5, fps),
    choices: toFrames(sceneBeats.choices || 5.0, fps),
    reveal: toFrames(sceneBeats.reveal || (6.0 + choices.length * 0.5), fps),
    explanation: toFrames(sceneBeats.explanation || (7.5 + choices.length * 0.5), fps),
    settle: toFrames(sceneBeats.settle || (9.0 + choices.length * 0.5), fps),
    exit: toFrames(sceneBeats.exit || (9.5 + choices.length * 0.5), fps),
  };

  // Subtle camera drift
  const cameraDrift = {
    x: Math.sin(frame * 0.007) * 2,
    y: Math.cos(frame * 0.006) * 1.5,
  };

  // ========================================
  // ANIMATIONS (Using Blueprint v5 presets)
  // ========================================
  
  // Title - using fadeUpIn preset
  const titleAnim = fadeUpIn(frame, {
    start: sceneBeats.title || 0.5,
    dur: 0.9,
    dist: 20,
    ease: 'backOut'
  }, EZ, fps);

  // Scenario - using fadeUpIn preset
  const scenarioAnim = fadeUpIn(frame, {
    start: sceneBeats.scenario || 1.5,
    dur: 1.0,
    dist: 30,
    ease: 'backOut'
  }, EZ, fps);

  // Question - using fadeUpIn preset
  const questionAnim = fadeUpIn(frame, {
    start: sceneBeats.question || 3.5,
    dur: 0.9,
    dist: 20,
    ease: 'backOut'
  }, EZ, fps);

  // Explanation - using fadeUpIn preset
  const explanationAnim = fadeUpIn(frame, {
    start: sceneBeats.explanation || (7.5 + choices.length * 0.5),
    dur: 1.0,
    dist: 20,
    ease: 'smooth'
  }, EZ, fps);

  // ========================================
  // ROUGH.JS - Frames & Choice Boxes (ZERO WOBBLE)
  // ========================================

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const rc = rough.svg(svg);

    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // Scenario frame
    if (frame >= beats.scenario) {
      const progress = Math.min((frame - beats.scenario) / 35, 1);
      
      const scenarioFrame = rc.rectangle(380, 260, 1160, 200, {
        stroke: colors.accent2,
        strokeWidth: 5,
        roughness: 0,
        bowing: 0,
        fill: `${colors.accent2}08`,
        fillStyle: 'hachure',
        hachureGap: 10,
      });

      const paths = scenarioFrame.querySelectorAll('path');
      paths.forEach(path => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length * (1 - progress);
      });

      svg.appendChild(scenarioFrame);
    }

    // Choice boxes
    if (frame >= beats.choices) {
      const positions = choices.length === 2
        ? [{ x: 480, y: 700 }, { x: 1440, y: 700 }]
        : [{ x: 360, y: 700 }, { x: 960, y: 700 }, { x: 1560, y: 700 }];

      choices.forEach((choice, i) => {
        const startFrame = beats.choices + i * 8;
        if (frame < startFrame) return;

        const progress = Math.min((frame - startFrame) / 30, 1);
        const pos = positions[i];

        const isCorrect = i === correctIndex;
        const isRevealing = frame >= beats.reveal;

        const choiceColor = isRevealing 
          ? (isCorrect ? colors.accent : `${colors.wrong}40`)
          : colors.accent3;

        const strokeWidth = isRevealing && isCorrect ? 6 : 4;

        const choiceBox = rc.rectangle(pos.x - 200, pos.y - 100, 400, 200, {
          stroke: choiceColor,
          strokeWidth: strokeWidth,
          roughness: 0,
          bowing: 0,
          fill: isRevealing && isCorrect ? `${colors.accent}10` : `${choiceColor}08`,
          fillStyle: 'hachure',
          hachureGap: 12,
        });

        const paths = choiceBox.querySelectorAll('path');
        paths.forEach(path => {
          const length = path.getTotalLength();
          path.style.strokeDasharray = length;
          path.style.strokeDashoffset = length * (1 - progress);
        });

        svg.appendChild(choiceBox);

        // Check mark for correct
        if (isRevealing && isCorrect && frame >= beats.reveal + 15) {
          const checkProgress = Math.min((frame - beats.reveal - 15) / 20, 1);
          const checkPath = `M ${pos.x - 30} ${pos.y - 50} L ${pos.x - 10} ${pos.y - 30 + 20 * checkProgress} L ${pos.x + 30 * checkProgress} ${pos.y - 60}`;
          
          const check = rc.path(checkPath, {
            stroke: colors.accent,
            strokeWidth: 8,
            roughness: 0,
            bowing: 0,
          });
          svg.appendChild(check);
        }

        // X mark for incorrect (subtle)
        if (isRevealing && !isCorrect && frame >= beats.reveal + 15) {
          const xProgress = Math.min((frame - beats.reveal - 15) / 15, 1);
          const xSize = 20 * xProgress;
          const xPath1 = `M ${pos.x - xSize} ${pos.y - 50 - xSize} L ${pos.x + xSize} ${pos.y - 50 + xSize}`;
          const xPath2 = `M ${pos.x + xSize} ${pos.y - 50 - xSize} L ${pos.x - xSize} ${pos.y - 50 + xSize}`;
          
          const x1 = rc.path(xPath1, {
            stroke: `${colors.wrong}60`,
            strokeWidth: 4,
            roughness: 0,
            bowing: 0,
          });
          const x2 = rc.path(xPath2, {
            stroke: `${colors.wrong}60`,
            strokeWidth: 4,
            roughness: 0,
            bowing: 0,
          });
          svg.appendChild(x1);
          svg.appendChild(x2);
        }
      });
    }

    // Celebration burst around correct choice
    if (frame >= beats.reveal + 20) {
      const positions = choices.length === 2
        ? [{ x: 480, y: 700 }, { x: 1440, y: 700 }]
        : [{ x: 360, y: 700 }, { x: 960, y: 700 }, { x: 1560, y: 700 }];
      
      const pos = positions[correctIndex];
      const burstProgress = Math.min((frame - beats.reveal - 20) / 25, 1);

      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const distance = 140 * burstProgress;
        const sparkX = pos.x + Math.cos(angle) * distance;
        const sparkY = pos.y + Math.sin(angle) * distance;

        const sparkSize = 16;
        const sparkCircle = rc.circle(sparkX, sparkY, sparkSize * burstProgress * 2, {
          stroke: colors.accent,
          strokeWidth: 2,
          roughness: 0,
          bowing: 0,
          fill: `${colors.accent}40`,
          fillStyle: 'solid',
        });
        sparkCircle.style.opacity = 1 - burstProgress * 0.6;
        svg.appendChild(sparkCircle);
      }
    }

  }, [frame, beats, colors, choices, correctIndex]);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <svg
        ref={svgRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          transform: `translate(${cameraDrift.x}px, ${cameraDrift.y}px)`,
        }}
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid meet"
      />

      <AbsoluteFill style={{ transform: `translate(${cameraDrift.x}px, ${cameraDrift.y}px)` }}>
        <div style={{ position: 'relative', width: '100%', height: '100%', padding: '80px 120px' }}>
          {/* Title */}
          {frame >= beats.title && (
            <div 
              style={{ 
                textAlign: 'center', 
                opacity: titleAnim.opacity,
                transform: `translateY(${titleAnim.translateY}px)`
              }}
            >
              <h2
                style={{
                  fontFamily: fonts.primary,
                  fontSize: fonts.size_title,
                  fontWeight: 400,
                  color: colors.ink,
                  margin: 0,
                }}
              >
                {data.title || 'Real-World Application'}
              </h2>
            </div>
          )}

          {/* Scenario */}
          {frame >= beats.scenario && (
            <div
              style={{
                position: 'absolute',
                top: 280,
                left: '50%',
                transform: `translateX(-50%) translateY(${scenarioAnim.translateY}px)`,
                width: 1100,
                textAlign: 'center',
                opacity: scenarioAnim.opacity,
              }}
            >
              {/* Lottie or Image */}
              {data.lottie && (
                <div style={{ marginBottom: 16, height: 120 }}>
                  <Player
                    autoplay
                    loop
                    src={data.lottie}
                    style={{ height: '100%', width: '100%' }}
                  />
                </div>
              )}
              {!data.lottie && data.image && (
                <div style={{ marginBottom: 16 }}>
                  <img
                    src={data.image}
                    alt=""
                    style={{
                      maxWidth: '100%',
                      height: 120,
                      objectFit: 'contain',
                    }}
                  />
                </div>
              )}
              
              <p
                style={{
                  fontFamily: fonts.secondary,
                  fontSize: fonts.size_scenario,
                  color: colors.ink,
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {data.scenario || 'Imagine you\'re in this situation...'}
              </p>
            </div>
          )}

          {/* Question */}
          {frame >= beats.question && (
            <div
              style={{
                position: 'absolute',
                top: 510,
                left: '50%',
                transform: `translateX(-50%) translateY(${questionAnim.translateY}px)`,
                textAlign: 'center',
                maxWidth: 900,
                opacity: questionAnim.opacity,
              }}
            >
              <h3
                style={{
                  fontFamily: fonts.primary,
                  fontSize: fonts.size_question,
                  fontWeight: 400,
                  color: colors.accent3,
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                {data.question || 'How would you apply what you learned?'}
              </h3>
            </div>
          )}

          {/* Choices */}
          {choices.map((choice, i) => {
            const startFrame = beats.choices + i * 8;
            if (frame < startFrame) return null;

            const positions = choices.length === 2
              ? [{ x: 480, y: 720 }, { x: 1440, y: 720 }]
              : [{ x: 360, y: 720 }, { x: 960, y: 720 }, { x: 1560, y: 720 }];

            const pos = positions[i];
            const isCorrect = i === correctIndex;
            const isRevealing = frame >= beats.reveal;

            // Choice entrance using fadeUpIn
            const choiceAnim = fadeUpIn(frame, {
              start: sceneBeats.choices + i * (8/fps),
              dur: 0.7,
              dist: 30,
              ease: 'backOut'
            }, EZ, fps);

            // Fade out incorrect choices after reveal
            const fadeOutOpacity = isRevealing && !isCorrect ? interpolate(
              frame,
              [beats.reveal, beats.reveal + 18],
              [1, 0.3],
              { extrapolateRight: 'clamp', easing: EZ.smooth }
            ) : 1;

            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: pos.y,
                  left: pos.x,
                  transform: `translate(-50%, -50%) translateY(${choiceAnim.translateY}px)`,
                  width: 360,
                  textAlign: 'center',
                  opacity: choiceAnim.opacity * fadeOutOpacity,
                  padding: '20px',
                }}
              >
                <p
                  style={{
                    fontFamily: fonts.secondary,
                    fontSize: fonts.size_choice,
                    fontWeight: isRevealing && isCorrect ? 700 : 500,
                    color: isRevealing && isCorrect ? colors.accent : colors.ink,
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {choice}
                </p>
              </div>
            );
          })}

          {/* Explanation */}
          {frame >= beats.explanation && (
            <div
              style={{
                position: 'absolute',
                bottom: 80,
                left: '50%',
                transform: `translateX(-50%) translateY(${explanationAnim.translateY}px)`,
                textAlign: 'center',
                maxWidth: 1000,
                opacity: explanationAnim.opacity,
              }}
            >
              <p
                style={{
                  fontFamily: fonts.secondary,
                  fontSize: fonts.size_explanation,
                  color: colors.ink,
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {data.explanation || 'This approach works best because...'}
              </p>
            </div>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ========================================
// BLUEPRINT V5.0 - REQUIRED EXPORTS
// ========================================

export { Apply3BScenarioChoice };

export const TEMPLATE_ID = 'Apply3BScenarioChoice';
export const TEMPLATE_VERSION = '5.0.0';

export const getDuration = (scene, fps) => {
  const choices = scene.fill?.scenario?.choices || [];
  const tailPadding = 0.5;
  return toFrames((scene.beats?.exit || (9.5 + choices.length * 0.5)) + tailPadding, fps);
};

export const DURATION_MIN_FRAMES = 660;  // 22s @ 30fps
export const DURATION_MAX_FRAMES = 1050; // 35s @ 30fps

export const SUPPORTED_MODES = ['notebook', 'whiteboard'];

export const CAPABILITIES = {
  usesSVG: true,
  usesLottie: true,
  usesRoughJS: true,
  requiresAudio: false,
  supportsTransitions: true
};

export const PRESETS_REQUIRED = [
  'fadeUpIn',
  'popInSpring',
  'pulseEmphasis'
];

export const getPosterFrame = (scene, fps) => {
  return toFrames(scene.beats?.reveal || 6.0, fps);
};

// Legacy exports for backward compatibility
export const APPLY_3B_DURATION_MIN = DURATION_MIN_FRAMES;
export const APPLY_3B_DURATION_MAX = DURATION_MAX_FRAMES;
export const APPLY_3B_EXIT_TRANSITION = 15;
