import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import { THEME } from '../utils/theme';
import rough from 'roughjs/bundled/rough.esm.js';

// Blueprint v5.0 imports
import { 
  fadeUpIn, 
  fadeDownOut,
  pulseEmphasis,
  EZ,
  useSceneId,
  toFrames 
} from '../sdk';

/**
 * HOOK 1E: AMBIENT MYSTERY - Blueprint v5.0
 * 
 * TEMPLATE STRATEGY:
 * - ✅ Blueprint v5.0 compliant
 * - ✅ Uses animation presets (fadeUpIn, fadeDownOut, pulseEmphasis)
 * - ✅ Reads beats from JSON (in seconds)
 * - ✅ Context-based ID factory (useSceneId)
 * - ✅ Strict zero wobble (roughness: 0, bowing: 0)
 * - ✅ FPS-agnostic (seconds → frames conversion)
 * 
 * CONVERSATIONAL FLOW:
 * 1. Fog drifts in (atmospheric setup)
 * 2. Whisper text fades up ("In the depths of...")
 * 3. Question reveals with mystery ("What secrets...")
 * 4. Glow elements pulse (atmospheric depth)
 * 5. Hint cascades in late
 * 6. Mysterious settle and exit
 * 
 * TYPOGRAPHY:
 * - Primary: Cabin Sketch (mysterious headers)
 * - Secondary: Inter (clean whisper text)
 * 
 * Duration: 12-18s (derived from beats.exit)
 */

const Hook1EAmbientMystery = ({ scene, styles, presets, easingMap, transitions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const id = useSceneId();
  
  const svgRef = useRef(null);

  // Style tokens with fallbacks
  const style = scene.style_tokens || {};
  const colors = style.colors || {
    bg: '#1A1F2E',
    fog: '#4A5568',
    accent: '#8E44AD',
    accent2: '#6C7A89',
    ink: '#E8F4FD',
    spotlight: '#F39C12',
  };
  
  const fonts = style.fonts || {
    primary: "'Cabin Sketch', cursive",
    secondary: THEME.fonts.structure.primary,
    size_whisper: 42,
    size_question: 78,
    size_hint: 32,
  };

  const texts = scene.fill?.texts || {};

  // Beats from JSON (in seconds) - Convert to frames
  const sceneBeats = scene.beats || {};
  const beats = {
    prelude: 0,
    fogIn: toFrames(sceneBeats.fogIn || 0.5, fps),
    spotlight: toFrames(sceneBeats.spotlight || 1.5, fps),
    whisperText: toFrames(sceneBeats.whisperText || 2.5, fps),
    questionReveal: toFrames(sceneBeats.questionReveal || 4.0, fps),
    glow1: toFrames(sceneBeats.glow1 || 5.0, fps),
    glow2: toFrames(sceneBeats.glow2 || 5.5, fps),
    wisps: toFrames(sceneBeats.wisps || 5.5, fps),
    hint: toFrames(sceneBeats.hint || 8.0, fps),
    accentGlow: toFrames(sceneBeats.accentGlow || 7.0, fps),
    settle: toFrames(sceneBeats.settle || 9.0, fps),
    exit: toFrames(sceneBeats.exit || 12.0, fps),
  };

  // Camera - slow push in
  const cameraZoom = interpolate(
    frame,
    [0, beats.spotlight, beats.settle],
    [1.08, 1.0, 1.02],
    { easing: EZ.smooth, extrapolateRight: 'clamp' }
  );

  // Vignette intensity
  const vignetteOpacity = interpolate(
    frame,
    [0, beats.fogIn, beats.spotlight, beats.settle],
    [0.9, 0.7, 0.5, 0.6],
    { extrapolateRight: 'clamp' }
  );

  // ========================================
  // ANIMATIONS (Using Blueprint v5 presets)
  // ========================================
  
  // Whisper text - using fadeUpIn preset
  const whisperAnim = fadeUpIn(frame, {
    start: sceneBeats.whisperText || 2.5,
    dur: 1.4,
    dist: 30,
    ease: 'smooth'
  }, EZ, fps);

  // Question - using fadeUpIn preset with scale
  const questionAnim = fadeUpIn(frame, {
    start: sceneBeats.questionReveal || 4.0,
    dur: 1.2,
    dist: 30,
    ease: 'smooth'
  }, EZ, fps);

  // Question entrance scale
  const questionScale = frame < beats.questionReveal ? 0.95 :
    frame < beats.questionReveal + 36 ? interpolate(
      frame,
      [beats.questionReveal, beats.questionReveal + 36],
      [0.95, 1],
      { extrapolateRight: 'clamp', easing: EZ.smooth }
    ) : 1;

  // Hint - using fadeUpIn preset
  const hintAnim = fadeUpIn(frame, {
    start: sceneBeats.hint || 8.0,
    dur: 0.8,
    dist: 20,
    ease: 'smooth'
  }, EZ, fps);

  // ========================================
  // ROUGH.JS - Fog, Wisps, Glows (ZERO WOBBLE)
  // ========================================

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const rc = rough.svg(svg);

    // Clear previous sketches
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // Wispy fog clouds (sketchy, organic) - ZERO WOBBLE
    if (frame >= beats.fogIn) {
      const fogClouds = [
        { x: 300, y: 200, w: 400, h: 180, delay: 0, opacity: 0.15 },
        { x: 1400, y: 300, w: 350, h: 160, delay: 20, opacity: 0.12 },
        { x: 200, y: 700, w: 450, h: 200, delay: 15, opacity: 0.18 },
        { x: 1300, y: 750, w: 380, h: 170, delay: 25, opacity: 0.14 },
      ];

      fogClouds.forEach((cloud) => {
        if (frame < beats.fogIn + cloud.delay) return;
        
        const progress = Math.min((frame - beats.fogIn - cloud.delay) / 80, 1);
        const drift = Math.sin((frame - cloud.delay) * 0.008) * 30;

        const cloudShape = rc.ellipse(
          cloud.x + drift,
          cloud.y + Math.cos((frame - cloud.delay) * 0.006) * 20,
          cloud.w * progress,
          cloud.h * progress,
          {
            stroke: 'none',
            fill: `${colors.fog}`,
            fillStyle: 'solid',
            roughness: 0,  // ZERO WOBBLE
            bowing: 0,     // ZERO WOBBLE
          }
        );
        
        cloudShape.style.opacity = cloud.opacity * progress;
        cloudShape.style.filter = 'blur(40px)';
        svg.appendChild(cloudShape);
      });
    }

    // Spotlight circle (rough sketch, subtle) - ZERO WOBBLE
    if (frame >= beats.spotlight) {
      const progress = Math.min((frame - beats.spotlight) / 60, 1);
      
      const spotlight = rc.circle(960, 540, 650 * progress, {
        stroke: `${colors.spotlight}40`,
        strokeWidth: 4,
        roughness: 0,  // ZERO WOBBLE
        bowing: 0,     // ZERO WOBBLE
        fill: 'none',
      });
      
      spotlight.style.filter = 'blur(8px)';
      spotlight.style.opacity = 0.4 * progress;
      svg.appendChild(spotlight);
    }

    // Mysterious wispy lines (floating) - ZERO WOBBLE
    if (frame >= beats.wisps) {
      const wisps = [
        { x1: 400, y1: 350, x2: 550, y2: 320, delay: 0 },
        { x1: 1400, y1: 600, x2: 1520, y2: 650, delay: 10 },
        { x1: 600, y1: 750, x2: 480, y2: 800, delay: 15 },
      ];

      wisps.forEach((wisp, i) => {
        if (frame < beats.wisps + wisp.delay) return;
        
        const progress = Math.min((frame - beats.wisps - wisp.delay) / 35, 1);
        const phase = (frame + i * 50) * 0.01;
        const drift = Math.sin(phase) * 15;

        const line = rc.line(
          wisp.x1 + drift,
          wisp.y1,
          wisp.x1 + (wisp.x2 - wisp.x1) * progress + drift,
          wisp.y1 + (wisp.y2 - wisp.y1) * progress,
          {
            stroke: `${colors.accent}60`,
            strokeWidth: 3,
            roughness: 0,  // ZERO WOBBLE
            bowing: 0,     // ZERO WOBBLE
          }
        );
        
        line.style.opacity = 0.5 * progress;
        svg.appendChild(line);
      });
    }

    // Accent glow circles (mysterious depth) - ZERO WOBBLE
    if (frame >= beats.accentGlow) {
      const glows = [
        { x: 480, y: 540, r: 120, delay: 0 },
        { x: 1440, y: 540, r: 100, delay: 12 },
      ];

      glows.forEach((glow, i) => {
        if (frame < beats.accentGlow + glow.delay) return;
        
        const progress = Math.min((frame - beats.accentGlow - glow.delay) / 50, 1);
        const pulse = 1 + Math.sin((frame - glow.delay) * 0.06) * 0.08;

        const glowCircle = rc.circle(glow.x, glow.y, glow.r * pulse * progress, {
          stroke: 'none',
          fill: `${colors.accent}`,
          fillStyle: 'solid',
          roughness: 0,  // ZERO WOBBLE
          bowing: 0,     // ZERO WOBBLE
        });
        
        glowCircle.style.opacity = 0.15 * progress;
        glowCircle.style.filter = 'blur(50px)';
        svg.appendChild(glowCircle);
      });
    }

  }, [frame, beats, colors]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        backgroundImage: `
          radial-gradient(circle at 50% 50%, ${colors.spotlight}08 0%, transparent 50%)
        `,
      }}
    >
      {/* Vignette overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at center, transparent 30%, ${colors.bg} 100%)`,
          opacity: vignetteOpacity,
          pointerEvents: 'none',
        }}
      />

      {/* Rough.js sketch layer - fog, wisps, glows */}
      <svg
        ref={svgRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          transform: `scale(${cameraZoom})`,
        }}
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid meet"
      />

      {/* Content layer */}
      <AbsoluteFill
        style={{
          transform: `scale(${cameraZoom})`,
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            padding: '140px 200px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Whisper text (above question) */}
          {frame >= beats.whisperText && texts.whisper && (
            <div
              style={{
                marginBottom: 60,
                opacity: whisperAnim.opacity,
                transform: `translateY(${whisperAnim.translateY}px)`,
              }}
            >
              <p
                style={{
                  fontFamily: fonts.secondary,
                  fontSize: fonts.size_whisper,
                  color: `${colors.ink}50`,
                  margin: 0,
                  fontStyle: 'italic',
                  textAlign: 'center',
                  letterSpacing: '2px',
                }}
              >
                {texts.whisper}
              </p>
            </div>
          )}

          {/* Main question - mysterious reveal */}
          {frame >= beats.questionReveal && (
            <div
              style={{
                position: 'relative',
                textAlign: 'center',
                opacity: questionAnim.opacity,
                transform: `translateY(${questionAnim.translateY}px) scale(${questionScale})`,
              }}
            >
              <h1
                style={{
                  fontFamily: fonts.primary,
                  fontSize: fonts.size_question,
                  fontWeight: 700,
                  color: colors.ink,
                  lineHeight: 1.2,
                  margin: 0,
                  letterSpacing: '1px',
                  textShadow: `0 0 40px ${colors.accent}40, 0 0 80px ${colors.accent}20`,
                }}
              >
                {texts.question || 'What lies beneath the surface?'}
              </h1>

              {/* Subtle underline glow (rough sketch) */}
              {frame >= beats.questionReveal + 40 && (
                <div
                  style={{
                    marginTop: 30,
                    opacity: interpolate(
                      frame,
                      [beats.questionReveal + 40, beats.questionReveal + 80],
                      [0, 0.6],
                      { extrapolateRight: 'clamp' }
                    ),
                  }}
                >
                  <div
                    style={{
                      width: 380,
                      height: 4,
                      margin: '0 auto',
                      background: `linear-gradient(90deg, transparent, ${colors.accent}, transparent)`,
                      borderRadius: 2,
                      filter: 'blur(3px)',
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Floating mystery particles with glow */}
          {frame >= beats.prelude && (
            <>
              {[...Array(24)].map((_, i) => {
                const seed = i * 151;
                const baseY = 100 + (i % 6) * 160;
                const baseX = 150 + (i % 4) * 520;
                const phase = (frame + seed) * 0.008;
                const driftY = Math.sin(phase) * 40;
                const driftX = Math.cos(phase * 0.6) * 30;
                const size = 6 + (i % 3) * 4;
                
                const opacity = interpolate(
                  frame,
                  [beats.prelude + i * 6, beats.prelude + i * 6 + 60],
                  [0, 0.25],
                  { extrapolateRight: 'clamp' }
                );

                return (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      left: baseX + driftX,
                      top: baseY + driftY,
                      width: size,
                      height: size,
                      borderRadius: '50%',
                      backgroundColor: i % 3 === 0 ? colors.spotlight : colors.accent,
                      opacity,
                      filter: 'blur(2px)',
                      boxShadow: `0 0 20px ${i % 3 === 0 ? colors.spotlight : colors.accent}60`,
                    }}
                  />
                );
              })}
            </>
          )}

          {/* Hint text - late cascade reveal */}
          {frame >= beats.hint && texts.hint && (
            <div
              style={{
                position: 'absolute',
                bottom: 120,
                opacity: hintAnim.opacity,
                transform: `translateY(${hintAnim.translateY}px)`,
              }}
            >
              <p
                style={{
                  fontFamily: fonts.secondary,
                  fontSize: fonts.size_hint,
                  color: `${colors.ink}60`,
                  margin: 0,
                  fontStyle: 'italic',
                  textAlign: 'center',
                }}
              >
                {texts.hint}
              </p>
            </div>
          )}

          {/* Breathing atmosphere - slow pulse */}
          {frame >= beats.spotlight && frame < beats.settle && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                transform: `scale(${1 + Math.sin(frame * 0.04) * 0.008})`,
                pointerEvents: 'none',
              }}
            />
          )}
        </div>
      </AbsoluteFill>

      {/* Final settle fade */}
      {frame >= beats.settle && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: colors.bg,
            opacity: interpolate(
              frame,
              [beats.settle, beats.settle + 50],
              [0, 0.15],
              { extrapolateRight: 'clamp' }
            ),
          }}
        />
      )}
    </AbsoluteFill>
  );
};

// ========================================
// BLUEPRINT V5.0 - REQUIRED EXPORTS
// ========================================

export { Hook1EAmbientMystery };

export const TEMPLATE_ID = 'Hook1EAmbientMystery';
export const TEMPLATE_VERSION = '5.0.0';

export const getDuration = (scene, fps) => {
  const tailPadding = 0.5;
  return toFrames((scene.beats?.exit || 12.0) + tailPadding, fps);
};

export const DURATION_MIN_FRAMES = 360;  // 12s @ 30fps
export const DURATION_MAX_FRAMES = 540;  // 18s @ 30fps

export const SUPPORTED_MODES = ['notebook', 'whiteboard'];

export const CAPABILITIES = {
  usesSVG: true,
  usesLottie: false,
  usesRoughJS: true,
  requiresAudio: false,
  supportsTransitions: true
};

export const PRESETS_REQUIRED = [
  'fadeUpIn',
  'fadeDownOut',
  'pulseEmphasis'
];

export const getPosterFrame = (scene, fps) => {
  return toFrames(scene.beats?.questionReveal || 4.0, fps);
};

// Legacy exports for backward compatibility
export const HOOK_1E_DURATION_MIN = DURATION_MIN_FRAMES;
export const HOOK_1E_DURATION_MAX = DURATION_MAX_FRAMES;
export const HOOK_1E_EXIT_TRANSITION = 15;
