import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import { THEME } from '../utils/theme';
import rough from 'roughjs/bundled/rough.esm.js';

// Blueprint v5.0 imports
import { 
  fadeUpIn, 
  shrinkToCorner,
  EZ,
  useSceneId,
  toFrames 
} from '../sdk';

/**
 * EXPLAIN 2B: ANALOGY - Blueprint v5.0
 * 
 * TEMPLATE STRATEGY:
 * - ✅ Blueprint v5.0 compliant
 * - ✅ NO GSAP - pure Remotion interpolate + presets
 * - ✅ NO useState - frame-driven only
 * - ✅ Side-by-side comparison pattern
 * - ✅ Graceful move: sides shrink to corners, connection reveals
 * - ✅ Uses fadeUpIn for text reveals
 * - ✅ Uses shrinkToCorner for side transformations
 * - ✅ Context-based ID factory
 * - ✅ Strict zero wobble
 * 
 * PATTERN: "X is like Y because..."
 * 
 * FLOW:
 * 1. Title fades up
 * 2. Familiar side (left) - label + description
 * 3. New concept side (right) - label + description
 * 4. THE MONEY SHOT: Both sides shrink & move to corners
 * 5. Connection text reveals in center
 * 6. Explanation appears below
 * 
 * Visual: Side-by-side frames → Shrink to corners → Center reveal
 * Duration: 12-15s
 */

const Explain2BAnalogy = ({ scene, styles, presets, easingMap, transitions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const id = useSceneId();
  
  const svgRef = useRef(null);

  // Style tokens with fallbacks
  const style = scene.style_tokens || {};
  const colors = style.colors || {
    bg: '#FFF9F0',
    accent: '#FF6B35',
    accent2: '#2E7FE4',
    ink: '#1A1A1A',
  };
  
  const fonts = style.fonts || {
    primary: THEME.fonts.marker.primary,
    secondary: THEME.fonts.structure.primary,
    size_title: 52,
    size_label: 36,
    size_connection: 56,
    size_explanation: 28,
    size_description: 22,
  };

  const data = scene.fill?.analogy || {};

  // Beats from JSON (in seconds) - Convert to frames
  const sceneBeats = scene.beats || {};
  const beats = {
    entrance: toFrames(sceneBeats.entrance || 0.8, fps),
    title: toFrames(sceneBeats.title || 0.8, fps),
    familiar: toFrames(sceneBeats.familiar || 2.0, fps),
    newConcept: toFrames(sceneBeats.newConcept || 3.5, fps),
    moveAway: toFrames(sceneBeats.moveAway || 6.0, fps),
    connection: toFrames(sceneBeats.connection || 7.5, fps),
    explanation: toFrames(sceneBeats.explanation || 9.0, fps),
    exit: toFrames(sceneBeats.exit || 12.0, fps),
  };

  // ========================================
  // ANIMATIONS (Using Presets)
  // ========================================
  
  // Title animation
  const titleAnim = fadeUpIn(frame, {
    start: sceneBeats.title || 0.8,
    dur: 1.0,
    dist: 40,
    ease: 'power3InOut'
  }, EZ, fps);

  // Familiar side entrance
  const familiarEntrance = fadeUpIn(frame, {
    start: sceneBeats.familiar || 2.0,
    dur: 1.0,
    dist: 50,
    ease: 'smooth'
  }, EZ, fps);

  // New concept side entrance
  const newConceptEntrance = fadeUpIn(frame, {
    start: sceneBeats.newConcept || 3.5,
    dur: 1.0,
    dist: 50,
    ease: 'smooth'
  }, EZ, fps);

  // Familiar side shrink to top-left corner
  const familiarShrink = shrinkToCorner(frame, {
    start: sceneBeats.moveAway || 6.0,
    dur: 1.2,
    targetScale: 0.35,
    targetPos: { x: -500, y: -280 },
    ease: 'power2InOut'
  }, EZ, fps);

  // New concept side shrink to top-right corner
  const newConceptShrink = shrinkToCorner(frame, {
    start: sceneBeats.moveAway || 6.0,
    dur: 1.2,
    targetScale: 0.35,
    targetPos: { x: 500, y: -280 },
    ease: 'power2InOut'
  }, EZ, fps);

  // Connection text reveal (center stage)
  const connectionAnim = fadeUpIn(frame, {
    start: sceneBeats.connection || 7.5,
    dur: 1.0,
    dist: 60,
    ease: 'power3InOut'
  }, EZ, fps);

  // Explanation text
  const explanationAnim = fadeUpIn(frame, {
    start: sceneBeats.explanation || 9.0,
    dur: 1.0,
    dist: 30,
    ease: 'smooth'
  }, EZ, fps);

  // Determine if sides are in "shrunk" state
  const sidesAreShrunk = frame >= beats.moveAway;

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

    // Decorative arrows connecting sides (before shrink)
    if (frame >= beats.newConcept + 20 && !sidesAreShrunk) {
      const arrowProgress = Math.min((frame - (beats.newConcept + 20)) / 30, 1);
      
      // Double-sided arrow in center
      const arrowY = 540;
      const leftX = 860;
      const rightX = 1060;
      const centerX = 960;
      
      // Left arrow
      const leftArrow = rc.line(leftX, arrowY, centerX - 20, arrowY, {
        stroke: colors.ink,
        strokeWidth: 3,
        roughness: 0,  // STRICT ZERO WOBBLE
        bowing: 0,     // STRICT ZERO WOBBLE
      });
      svg.appendChild(leftArrow);
      
      // Right arrow
      const rightArrow = rc.line(centerX + 20, arrowY, rightX, arrowY, {
        stroke: colors.ink,
        strokeWidth: 3,
        roughness: 0,
        bowing: 0,
      });
      svg.appendChild(rightArrow);
      
      // Arrow heads
      const arrowHeadSize = 15 * arrowProgress;
      const leftHead = rc.path(`M ${centerX - 20} ${arrowY} L ${centerX - 20 - arrowHeadSize} ${arrowY - arrowHeadSize/2} L ${centerX - 20 - arrowHeadSize} ${arrowY + arrowHeadSize/2} Z`, {
        stroke: colors.ink,
        strokeWidth: 2,
        fill: colors.ink,
        roughness: 0,
        bowing: 0,
      });
      svg.appendChild(leftHead);
      
      const rightHead = rc.path(`M ${centerX + 20} ${arrowY} L ${centerX + 20 + arrowHeadSize} ${arrowY - arrowHeadSize/2} L ${centerX + 20 + arrowHeadSize} ${arrowY + arrowHeadSize/2} Z`, {
        stroke: colors.ink,
        strokeWidth: 2,
        fill: colors.ink,
        roughness: 0,
        bowing: 0,
      });
      svg.appendChild(rightHead);
    }

    // Connection emphasis circles (after reveal)
    if (frame >= beats.connection + 20) {
      const emphasisProgress = Math.min((frame - (beats.connection + 20)) / 25, 1);
      
      const radius1 = 180 * emphasisProgress;
      const radius2 = 220 * emphasisProgress;
      
      const circle1 = rc.circle(960, 540, radius1 * 2, {
        stroke: colors.accent,
        strokeWidth: 3,
        roughness: 0,
        bowing: 0,
        fill: 'transparent',
      });
      svg.appendChild(circle1);
      
      const circle2 = rc.circle(960, 540, radius2 * 2, {
        stroke: colors.accent2,
        strokeWidth: 2,
        roughness: 0,
        bowing: 0,
        fill: 'transparent',
      });
      svg.appendChild(circle2);
    }

  }, [frame, beats, colors, sidesAreShrunk, id]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        backgroundImage: `
          radial-gradient(circle at 25% 50%, ${colors.accent}04 0%, transparent 50%),
          radial-gradient(circle at 75% 50%, ${colors.accent2}04 0%, transparent 50%)
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
      <AbsoluteFill>
        {/* Title */}
        {frame >= beats.title && (
          <div
            style={{
              position: 'absolute',
              top: 80,
              left: '50%',
              transform: `translateX(-50%) translateY(${titleAnim.translateY || 0}px)`,
              opacity: titleAnim.opacity,
            }}
          >
            <h1
              style={{
                fontFamily: fonts.primary,
                fontSize: fonts.size_title,
                color: colors.ink,
                margin: 0,
                textAlign: 'center',
              }}
            >
              {data.title || 'Think of it like this...'}
            </h1>
          </div>
        )}

        {/* Side-by-side frames */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            gap: 60,
            padding: '0 120px',
          }}
        >
          {/* Familiar side (left) */}
          {frame >= beats.familiar && (
            <div
              style={{
                flex: 1,
                maxWidth: 500,
                opacity: sidesAreShrunk ? 1 : familiarEntrance.opacity,
                transform: sidesAreShrunk 
                  ? `translate(${familiarShrink.translateX}px, ${familiarShrink.translateY}px) scale(${familiarShrink.scale})`
                  : `translateY(${familiarEntrance.translateY || 0}px)`,
                transition: 'transform 0.05s linear',
              }}
            >
              <div
                style={{
                  padding: 32,
                  border: `4px solid ${colors.accent}`,
                  borderRadius: 16,
                  backgroundColor: `${colors.bg}EE`,
                }}
              >
                <h2
                  style={{
                    fontFamily: fonts.primary,
                    fontSize: fonts.size_label,
                    color: colors.accent,
                    margin: '0 0 16px 0',
                    textAlign: 'center',
                  }}
                >
                  {data.familiar?.label || 'Familiar'}
                </h2>
                <p
                  style={{
                    fontFamily: fonts.secondary,
                    fontSize: fonts.size_description,
                    color: colors.ink,
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  {data.familiar?.description}
                </p>
              </div>
            </div>
          )}

          {/* New concept side (right) */}
          {frame >= beats.newConcept && (
            <div
              style={{
                flex: 1,
                maxWidth: 500,
                opacity: sidesAreShrunk ? 1 : newConceptEntrance.opacity,
                transform: sidesAreShrunk 
                  ? `translate(${newConceptShrink.translateX}px, ${newConceptShrink.translateY}px) scale(${newConceptShrink.scale})`
                  : `translateY(${newConceptEntrance.translateY || 0}px)`,
                transition: 'transform 0.05s linear',
              }}
            >
              <div
                style={{
                  padding: 32,
                  border: `4px solid ${colors.accent2}`,
                  borderRadius: 16,
                  backgroundColor: `${colors.bg}EE`,
                }}
              >
                <h2
                  style={{
                    fontFamily: fonts.primary,
                    fontSize: fonts.size_label,
                    color: colors.accent2,
                    margin: '0 0 16px 0',
                    textAlign: 'center',
                  }}
                >
                  {data.newConcept?.label || 'New Concept'}
                </h2>
                <p
                  style={{
                    fontFamily: fonts.secondary,
                    fontSize: fonts.size_description,
                    color: colors.ink,
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  {data.newConcept?.description}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Connection reveal (THE MONEY SHOT) */}
        {frame >= beats.connection && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) translateY(${connectionAnim.translateY || 0}px)`,
              opacity: connectionAnim.opacity,
            }}
          >
            <h2
              style={{
                fontFamily: fonts.primary,
                fontSize: fonts.size_connection,
                color: colors.accent,
                margin: 0,
                textAlign: 'center',
                textShadow: `0 2px 8px ${colors.bg}`,
              }}
            >
              {data.connection || 'They work the same way!'}
            </h2>
          </div>
        )}

        {/* Explanation */}
        {frame >= beats.explanation && data.explanation && (
          <div
            style={{
              position: 'absolute',
              bottom: 120,
              left: '50%',
              transform: `translateX(-50%) translateY(${explanationAnim.translateY || 0}px)`,
              opacity: explanationAnim.opacity,
              maxWidth: 900,
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

export { Explain2BAnalogy };

export const TEMPLATE_ID = 'Explain2BAnalogy';
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
  usesLottie: false,  // Can be added later
  usesRoughJS: true,
  requiresAudio: false,
  supportsTransitions: true,
  hasSideBySideLayout: true
};

export const PRESETS_REQUIRED = [
  'fadeUpIn',
  'shrinkToCorner'
];

export const getPosterFrame = (scene, fps) => {
  // Show frame during connection reveal (money shot moment)
  return toFrames(scene.beats?.connection || 7.5, fps) + 20;
};
