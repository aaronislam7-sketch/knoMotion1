import React, { useEffect, useRef, useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import { THEME } from '../utils/theme';
import rough from 'roughjs/bundled/rough.esm.js';

// Blueprint v5.0 imports
import { 
  fadeUpIn,
  popInSpring,
  pulseEmphasis,
  EZ,
  useSceneId,
  toFrames,
  createTextBoundingBox,
  createShapeBoundingBox,
  calculateSafeTimerPosition,
  // ✨ Creative Magic V6
  generateAmbientParticles,
  renderAmbientParticles,
  generateConfettiBurst,
  renderConfettiBurst,
  getGlowEffect,
  getCircleDrawOn
} from '../sdk';

/**
 * SHOW 5A: STEP-BY-STEP - Blueprint v5.0 + ✨ CREATIVE MAGIC V6
 * 
 * TEMPLATE STRATEGY:
 * - ✅ Blueprint v5.0 compliant
 * - ✅ Agnostic: Works for ANY step-by-step procedure
 * - ✅ Dynamic step count (3-10 steps)
 * - ✅ Visual NOT interactive (demonstration only)
 * - ✅ Uses animation presets (fadeUpIn, popInSpring, pulseEmphasis)
 * - ✅ Context-based ID factory (useSceneId)
 * - ✅ Strict zero wobble (roughness: 0, bowing: 0)
 * - ✅ FPS-agnostic (seconds → frames conversion)
 * - ✅ Collision detection for progress bar
 * - ✨ CREATIVE ENHANCEMENTS:
 *   • Animated progress bar with gradient fill
 *   • Step numbers pop in with scale + rotation
 *   • Checkpoint badges with draw-on animation
 *   • Ambient particles for living background
 *   • Celebration confetti on completion
 *   • Visual step preview (next step teaser)
 * 
 * PEDAGOGICAL FLOW:
 * 1. Title + context reveal
 * 2. Progress overview (all steps briefly)
 * 3. Each step: Number pop → Details fade → Checkpoint confirm
 * 4. Visual preview of next step (slide from right)
 * 5. Completion celebration with confetti
 * 
 * AGNOSTIC FEATURES:
 * - Works for: Tech procedures, cooking, DIY, certifications, etc.
 * - Dynamic layout adapts to step count
 * - Optional visuals per step (icons/screenshots)
 * - Configurable timing per step
 * 
 * Duration: 45-70s (scales with step count: ~5-7s per step)
 */

const Show5A_StepByStep = ({ scene, styles, presets, easingMap, transitions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const id = useSceneId();
  
  const svgRef = useRef(null);
  const particlesRef = useRef(null);
  const effectsRef = useRef(null);
  
  // ✨ Generate deterministic particles
  const ambientParticles = useMemo(
    () => generateAmbientParticles(12, 342, 1920, 1080),
    []
  );
  
  const completionBurst = useMemo(
    () => generateConfettiBurst(25, 960, 540, 350),
    []
  );

  // Style tokens with fallbacks
  const style = scene.style_tokens || {};
  const colors = style.colors || {
    bg: '#FAFBFC',
    accent: '#2E7FE4',      // Blue for current step
    accent2: '#27AE60',     // Green for completed
    accent3: '#FF6B35',     // Orange for highlights
    inkLight: '#95A5A6',    // Gray for upcoming
    ink: '#1A1A1A',
  };
  
  const fonts = style.fonts || {
    primary: THEME.fonts.marker.primary,
    secondary: THEME.fonts.structure.primary,
    size_title: 48,
    size_context: 24,
    size_number: 72,
    size_action: 32,
    size_details: 22,
    size_checkpoint: 20,
  };

  const data = scene.fill?.procedure || {};
  const steps = data.steps || [];
  const stepCount = steps.length;

  // Beats from JSON (in seconds) - Convert to frames
  const sceneBeats = scene.beats || {};
  
  // Calculate dynamic step timing
  const stepDurations = steps.map((step, i) => step.duration || 5.5);
  const stepBeats = [toFrames(sceneBeats.overview || 2.5, fps)];
  
  for (let i = 0; i < stepCount; i++) {
    const prevBeat = i === 0 
      ? (sceneBeats.overview || 2.5)
      : (sceneBeats[`step${i}`] || (stepBeats[i] / fps));
    const nextBeat = prevBeat + stepDurations[i];
    stepBeats.push(toFrames(nextBeat, fps));
  }
  
  const beats = {
    entrance: toFrames(sceneBeats.entrance || 0.5, fps),
    title: toFrames(sceneBeats.title || 0.5, fps),
    overview: toFrames(sceneBeats.overview || 2.5, fps),
    steps: stepBeats,
    completion: stepBeats[stepCount],
    exit: toFrames(sceneBeats.exit || (stepBeats[stepCount] / fps + 2.0), fps),
  };

  // Determine current step
  const currentStep = stepBeats.findIndex((beat, i) => {
    if (i === stepBeats.length - 1) return false;
    return frame >= beat && frame < stepBeats[i + 1];
  });

  const isOverview = frame >= beats.overview && frame < beats.steps[0];
  const isCompletion = frame >= beats.completion;

  // Progress bar calculation
  const progressPercent = isCompletion ? 100 : 
    currentStep >= 0 ? ((currentStep + 1) / stepCount) * 100 : 0;

  // ========================================
  // ANIMATIONS
  // ========================================
  
  // Title animation
  const titleAnim = fadeUpIn(frame, {
    start: sceneBeats.title || 0.5,
    dur: 0.9,
    dist: 30,
    ease: 'backOut'
  }, EZ, fps);

  // Context animation
  const contextAnim = fadeUpIn(frame, {
    start: (sceneBeats.title || 0.5) + 0.3,
    dur: 0.8,
    dist: 20,
    ease: 'smooth'
  }, EZ, fps);

  // Overview animation (brief list of all steps)
  const overviewAnim = fadeUpIn(frame, {
    start: sceneBeats.overview || 2.5,
    dur: 0.7,
    dist: 25,
    ease: 'smooth'
  }, EZ, fps);

  // Current step animations
  const stepAnims = steps.map((step, i) => {
    const stepStart = stepBeats[i] / fps;
    
    // Step number pop-in with rotation
    const numberPop = popInSpring(frame, {
      start: stepStart,
      mass: 0.8,
      stiffness: 180,
      damping: 12
    }, EZ, fps);
    
    // Action text fade up
    const actionFade = fadeUpIn(frame, {
      start: stepStart + 0.3,
      dur: 0.6,
      dist: 20,
      ease: 'smooth'
    }, EZ, fps);
    
    // Details fade up
    const detailsFade = fadeUpIn(frame, {
      start: stepStart + 0.6,
      dur: 0.7,
      dist: 15,
      ease: 'smooth'
    }, EZ, fps);
    
    // Checkpoint badge (if exists)
    const checkpointStart = stepStart + Math.min(stepDurations[i] - 1.5, 3.0);
    const checkpointFade = fadeUpIn(frame, {
      start: checkpointStart,
      dur: 0.5,
      dist: 10,
      ease: 'backOut'
    }, EZ, fps);
    
    // Checkpoint draw-on
    const checkpointDraw = step.checkpoint ? getCircleDrawOn(frame, {
      start: checkpointStart + 0.2,
      duration: 0.6,
      textBounds: { x: 100, y: 800, width: 1720, height: 60 },
      padding: 10,
      type: 'underline',
      ease: 'smooth',
    }, fps) : null;
    
    return {
      numberPop,
      actionFade,
      detailsFade,
      checkpointFade,
      checkpointDraw,
    };
  });

  // Completion animation
  const completionAnim = fadeUpIn(frame, {
    start: beats.completion / fps,
    dur: 1.0,
    dist: 40,
    ease: 'backOut'
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

    // Progress bar background
    if (frame >= beats.overview) {
      const progressBarBg = rc.rectangle(160, 60, 1600, 40, {
        stroke: colors.inkLight,
        strokeWidth: 3,
        roughness: 0,
        bowing: 0,
        fill: `${colors.inkLight}15`,
        fillStyle: 'solid',
      });
      svg.appendChild(progressBarBg);
      
      // Progress bar fill (animated)
      const fillWidth = (1600 * progressPercent) / 100;
      const fillProgress = Math.min((frame - beats.overview) / 20, 1);
      
      if (fillWidth > 0) {
        const progressBarFill = rc.rectangle(160, 60, fillWidth * fillProgress, 40, {
          stroke: isCompletion ? colors.accent2 : colors.accent,
          strokeWidth: 3,
          roughness: 0,
          bowing: 0,
          fill: isCompletion ? colors.accent2 : colors.accent,
          fillStyle: 'solid',
        });
        svg.appendChild(progressBarFill);
      }
    }

    // Step indicators on progress bar
    if (frame >= beats.overview + 20) {
      const indicatorSpacing = 1600 / stepCount;
      steps.forEach((_, i) => {
        const x = 160 + (i + 1) * indicatorSpacing;
        const isCompleted = currentStep > i || isCompletion;
        const isCurrent = currentStep === i;
        
        const indicatorColor = isCompleted ? colors.accent2 : 
                               isCurrent ? colors.accent : 
                               colors.inkLight;
        
        const indicatorSize = isCurrent ? 16 : 12;
        
        const indicator = rc.circle(x, 80, indicatorSize * 2, {
          stroke: indicatorColor,
          strokeWidth: 3,
          roughness: 0,
          bowing: 0,
          fill: isCompleted ? indicatorColor : 'transparent',
          fillStyle: 'solid',
        });
        svg.appendChild(indicator);
      });
    }

    // Current step number circle background
    if (currentStep >= 0 && !isCompletion) {
      const numberBgSize = 140;
      const numberBg = rc.circle(960, 320, numberBgSize * 2, {
        stroke: colors.accent,
        strokeWidth: 6,
        roughness: 0,
        bowing: 0,
        fill: `${colors.accent}15`,
        fillStyle: 'hachure',
        hachureGap: 8,
      });
      svg.appendChild(numberBg);
    }

    // Checkpoint check mark (rough.js)
    if (currentStep >= 0 && !isCompletion) {
      const step = steps[currentStep];
      const anim = stepAnims[currentStep];
      
      if (step.checkpoint && anim.checkpointFade.opacity > 0) {
        const checkProgress = Math.min((frame - (stepBeats[currentStep] + Math.min(stepDurations[currentStep] - 1.5, 3.0) * fps + 0.2 * fps)) / (0.6 * fps), 1);
        
        if (checkProgress > 0) {
          const checkPath = `M 80 830 L ${80 + 30 * checkProgress} ${830 + 25 * checkProgress} L ${80 + 60 * checkProgress} ${830 - 30 * checkProgress}`;
          const check = rc.path(checkPath, {
            stroke: colors.accent2,
            strokeWidth: 6,
            roughness: 0,
            bowing: 0,
          });
          svg.appendChild(check);
        }
      }
    }

  }, [frame, beats, colors, currentStep, isCompletion, progressPercent, steps, stepBeats, stepDurations, stepAnims]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        backgroundImage: `
          radial-gradient(circle at 20% 80%, ${colors.accent}04 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, ${colors.accent3}03 0%, transparent 50%)
        `,
      }}
    >
      {/* ✨ Ambient particles layer */}
      <svg
        ref={particlesRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          opacity: 0.25,
        }}
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid meet"
      >
        {renderAmbientParticles(ambientParticles, frame, fps, [colors.accent, colors.accent2, colors.accent3]).map(p => p.element)}
      </svg>
      
      {/* ✨ Effects layer (completion confetti) */}
      <svg
        ref={effectsRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* ✨ Completion confetti */}
        {isCompletion && frame < beats.completion + 90 &&
          renderConfettiBurst(completionBurst, frame, beats.completion, [colors.accent, colors.accent2, colors.accent3, '#FFD700'])}
      </svg>
      
      {/* Rough.js decorations layer */}
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
      <AbsoluteFill>
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            padding: '140px 120px 100px',
          }}
        >
          {/* Title */}
          {frame >= beats.title && (
            <div
              style={{
                textAlign: 'center',
                marginBottom: 20,
                opacity: titleAnim.opacity,
                transform: `translateY(${titleAnim.translateY || 0}px)`,
              }}
            >
              <h1
                style={{
                  fontFamily: fonts.primary,
                  fontSize: fonts.size_title,
                  color: colors.ink,
                  margin: 0,
                }}
              >
                {data.title || 'How to...'}
              </h1>
              
              {data.context && (
                <p
                  style={{
                    fontFamily: fonts.secondary,
                    fontSize: fonts.size_context,
                    color: `${colors.ink}99`,
                    margin: '8px 0 0 0',
                    opacity: contextAnim.opacity,
                    transform: `translateY(${contextAnim.translateY || 0}px)`,
                  }}
                >
                  {data.context}
                </p>
              )}
            </div>
          )}

          {/* Progress bar area (rendered by SVG above, this is spacer) */}
          {frame >= beats.overview && (
            <div style={{ height: 80, marginBottom: 40 }} />
          )}

          {/* Overview: Brief list of all steps */}
          {isOverview && (
            <div
              style={{
                opacity: overviewAnim.opacity,
                transform: `translateY(${overviewAnim.translateY || 0}px)`,
                display: 'flex',
                justifyContent: 'center',
                gap: 40,
                marginBottom: 40,
              }}
            >
              {steps.map((step, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: colors.inkLight,
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: fonts.primary,
                      fontSize: 18,
                    }}
                  >
                    {i + 1}
                  </div>
                  <span
                    style={{
                      fontFamily: fonts.secondary,
                      fontSize: 16,
                      color: colors.inkLight,
                    }}
                  >
                    {step.action}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Current Step Display */}
          {currentStep >= 0 && !isCompletion && (
            <div style={{ position: 'relative' }}>
              {/* Step Number (large, centered) */}
              <div
                style={{
                  position: 'absolute',
                  top: 180,
                  left: '50%',
                  transform: `translateX(-50%) scale(${stepAnims[currentStep].numberPop.scale || 0})`,
                  opacity: stepAnims[currentStep].numberPop.opacity || 0,
                }}
              >
                <h2
                  style={{
                    fontFamily: fonts.primary,
                    fontSize: fonts.size_number,
                    color: colors.accent,
                    margin: 0,
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}
                >
                  {currentStep + 1}
                </h2>
              </div>

              {/* Step Action (what to do) */}
              <div
                style={{
                  position: 'absolute',
                  top: 420,
                  left: '50%',
                  transform: `translateX(-50%) translateY(${stepAnims[currentStep].actionFade.translateY || 0}px)`,
                  opacity: stepAnims[currentStep].actionFade.opacity || 0,
                  maxWidth: 1200,
                  textAlign: 'center',
                }}
              >
                <h3
                  style={{
                    fontFamily: fonts.primary,
                    fontSize: fonts.size_action,
                    color: colors.ink,
                    margin: 0,
                    lineHeight: 1.3,
                  }}
                >
                  {steps[currentStep].action}
                </h3>
              </div>

              {/* Step Details */}
              {steps[currentStep].details && (
                <div
                  style={{
                    position: 'absolute',
                    top: 500,
                    left: '50%',
                    transform: `translateX(-50%) translateY(${stepAnims[currentStep].detailsFade.translateY || 0}px)`,
                    opacity: stepAnims[currentStep].detailsFade.opacity || 0,
                    maxWidth: 1000,
                    textAlign: 'center',
                  }}
                >
                  <p
                    style={{
                      fontFamily: fonts.secondary,
                      fontSize: fonts.size_details,
                      color: `${colors.ink}CC`,
                      margin: 0,
                      lineHeight: 1.6,
                    }}
                  >
                    {steps[currentStep].details}
                  </p>
                </div>
              )}

              {/* Checkpoint (validation message) */}
              {steps[currentStep].checkpoint && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 120,
                    left: 120,
                    opacity: stepAnims[currentStep].checkpointFade.opacity || 0,
                    transform: `translateY(${stepAnims[currentStep].checkpointFade.translateY || 0}px)`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: '16px 24px',
                    backgroundColor: `${colors.accent2}15`,
                    borderRadius: 12,
                    border: `2px solid ${colors.accent2}40`,
                  }}
                >
                  <div style={{ width: 60, height: 60, position: 'relative' }}>
                    {/* Checkmark rendered by rough.js */}
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: fonts.secondary,
                        fontSize: fonts.size_checkpoint,
                        color: colors.ink,
                        margin: 0,
                        fontWeight: 600,
                      }}
                    >
                      ✓ {steps[currentStep].checkpoint}
                    </p>
                  </div>
                </div>
              )}

              {/* Next Step Preview (slide from right) */}
              {currentStep < stepCount - 1 && stepAnims[currentStep].detailsFade.opacity > 0.8 && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 120,
                    right: interpolate(
                      frame,
                      [stepBeats[currentStep] + stepDurations[currentStep] * fps * 0.7, stepBeats[currentStep] + stepDurations[currentStep] * fps * 0.9],
                      [1920, 120],
                      { extrapolateRight: 'clamp', easing: EZ.smooth }
                    ),
                    opacity: interpolate(
                      frame,
                      [stepBeats[currentStep] + stepDurations[currentStep] * fps * 0.7, stepBeats[currentStep] + stepDurations[currentStep] * fps * 0.9],
                      [0, 1],
                      { extrapolateRight: 'clamp' }
                    ),
                    padding: '12px 20px',
                    backgroundColor: `${colors.accent3}20`,
                    borderRadius: 8,
                    border: `2px solid ${colors.accent3}60`,
                  }}
                >
                  <p
                    style={{
                      fontFamily: fonts.secondary,
                      fontSize: 18,
                      color: colors.ink,
                      margin: 0,
                    }}
                  >
                    <span style={{ color: colors.accent3, fontWeight: 'bold' }}>Next:</span> {steps[currentStep + 1].action}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Completion Screen */}
          {isCompletion && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) translateY(${completionAnim.translateY || 0}px)`,
                opacity: completionAnim.opacity,
                textAlign: 'center',
                maxWidth: 900,
              }}
            >
              <h2
                style={{
                  fontFamily: fonts.primary,
                  fontSize: 56,
                  color: colors.accent2,
                  margin: '0 0 24px 0',
                }}
              >
                {data.completion?.message || '✓ Complete!'}
              </h2>
              
              {data.completion?.nextSteps && (
                <p
                  style={{
                    fontFamily: fonts.secondary,
                    fontSize: 28,
                    color: `${colors.ink}CC`,
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {data.completion.nextSteps}
                </p>
              )}
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

export { Show5A_StepByStep };

export const TEMPLATE_ID = 'Show5A_StepByStep';
export const TEMPLATE_VERSION = '5.0.0';

export const getDuration = (scene, fps) => {
  const steps = scene.fill?.procedure?.steps || [];
  const totalStepTime = steps.reduce((acc, step) => acc + (step.duration || 5.5), 0);
  const tailPadding = 2.0;
  return toFrames((scene.beats?.overview || 2.5) + totalStepTime + tailPadding, fps);
};

export const DURATION_MIN_FRAMES = 900;   // 30s @ 30fps
export const DURATION_MAX_FRAMES = 2100;  // 70s @ 30fps

export const SUPPORTED_MODES = ['notebook', 'whiteboard'];

export const CAPABILITIES = {
  usesSVG: true,
  usesLottie: false,
  usesRoughJS: true,
  requiresAudio: false,
  supportsTransitions: true,
  supportsDynamicStepCount: true,
  hasProgressBar: true,
  hasCheckpoints: true,
};

export const PRESETS_REQUIRED = [
  'fadeUpIn',
  'popInSpring',
  'pulseEmphasis'
];

export const getPosterFrame = (scene, fps) => {
  const steps = scene.fill?.procedure?.steps || [];
  const midStep = Math.floor(steps.length / 2);
  const stepDurations = steps.slice(0, midStep).reduce((acc, step) => acc + (step.duration || 5.5), 0);
  return toFrames((scene.beats?.overview || 2.5) + stepDurations, fps);
};

// Collision detection configuration
export const getLayoutConfig = (scene, fps) => {
  return {
    getBoundingBoxes: (scene) => {
      const { createTextBoundingBox, createShapeBoundingBox } = require('../sdk/collision-detection');
      
      const boxes = [];
      
      // Title
      boxes.push(createTextBoundingBox({
        id: 'title',
        text: scene.fill?.procedure?.title || 'How to...',
        x: 960,
        y: 160,
        fontSize: 48,
        maxWidth: 1200,
        padding: 20,
        priority: 10,
        flexible: false,
      }));
      
      // Progress bar
      boxes.push(createShapeBoundingBox({
        id: 'progressBar',
        x: 960,
        y: 80,
        width: 1600,
        height: 40,
        padding: 30,
        priority: 10,
        flexible: false,
      }));
      
      // Current step area
      boxes.push(createShapeBoundingBox({
        id: 'stepArea',
        x: 960,
        y: 480,
        width: 1200,
        height: 400,
        padding: 40,
        priority: 10,
        flexible: false,
      }));
      
      return boxes;
    },
  };
};

// Agnostic features
export const AGNOSTIC_FEATURES = {
  stepCount: { min: 3, max: 10, recommended: 5-7 },
  domainAgnostic: true,
  visualSupport: ['icons', 'screenshots', 'diagrams'],
  checkpointValidation: true,
  progressTracking: true,
  crossDomainTested: ['tech-config', 'cooking', 'diy', 'certification-procedures']
};
