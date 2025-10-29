import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import { THEME } from '../utils/theme';
import rough from 'roughjs/bundled/rough.esm.js';

// Blueprint v5.0 imports
import { 
  fadeUpIn, 
  pulseEmphasis,
  shrinkToCorner,
  EZ,
  useSceneId,
  toFrames 
} from '../sdk';

/**
 * REFLECT 4D: FORWARD LINK - Blueprint v5.0
 * 
 * TEMPLATE STRATEGY:
 * - ✅ Blueprint v5.0 compliant
 * - ✅ Uses animation presets (fadeUpIn, pulseEmphasis, shrinkToCorner)
 * - ✅ Reads beats from JSON (in seconds)
 * - ✅ Context-based ID factory (useSceneId)
 * - ✅ Strict zero wobble (roughness: 0, bowing: 0)
 * - ✅ FPS-agnostic (seconds → frames conversion)
 * 
 * CONVERSATIONAL FLOW:
 * 1. Title appears
 * 2. Current learning anchored & celebrated (center focus)
 * 3. Achievement markers appear (check marks)
 * 4. Current learning moves to "complete" position (upper left)
 * 5. Stepping stones/progression path animates
 * 6. Next journey revealed with energy
 * 7. Forward CTA
 * 
 * TYPOGRAPHY:
 * - Primary: Permanent Marker (bold, energetic)
 * - Secondary: Inter (clean readability)
 * 
 * Duration: 18-28s (derived from beats.exit)
 */

const Reflect4DForwardLink = ({ scene, styles, presets, easingMap, transitions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const id = useSceneId();
  
  const svgRef = useRef(null);

  // Style tokens with fallbacks
  const style = scene.style_tokens || {};
  const colors = style.colors || {
    bg: '#FFF9F0',
    accent: '#27AE60',    // Green for achievement
    accent2: '#9B59B6',   // Bold purple for next
    accent3: '#FF6B35',   // Bold orange for energy
    ink: '#1A1A1A',
  };

  const fonts = style.fonts || {
    primary: THEME.fonts.marker.primary,  // Permanent Marker
    secondary: THEME.fonts.structure.primary,
    size_title: 48,
    size_section: 38,
    size_body: 24,
    size_cta: 44,
  };

  const data = scene.fill?.forward || {};

  // Beats from JSON (in seconds) - Convert to frames
  const sceneBeats = scene.beats || {};
  const beats = {
    prelude: 0,
    title: toFrames(sceneBeats.title || 0.5, fps),
    current: toFrames(sceneBeats.current || 1.5, fps),
    celebrate: toFrames(sceneBeats.celebrate || 3.0, fps),
    moveToComplete: toFrames(sceneBeats.moveToComplete || 4.5, fps),
    steppingStones: toFrames(sceneBeats.steppingStones || 5.5, fps),
    nextReveal: toFrames(sceneBeats.nextReveal || 7.0, fps),
    cta: toFrames(sceneBeats.cta || 8.5, fps),
    settle: toFrames(sceneBeats.settle || 10.0, fps),
    exit: toFrames(sceneBeats.exit || 10.5, fps),
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

  // Current learning - using fadeUpIn preset
  const currentAnim = fadeUpIn(frame, {
    start: sceneBeats.current || 1.5,
    dur: 1.2,
    dist: 30,
    ease: 'backOut'
  }, EZ, fps);

  // Celebrate - using pulseEmphasis preset
  const celebrateAnim = pulseEmphasis(frame, {
    start: sceneBeats.celebrate || 3.0,
    dur: 1.2,
    scale: 1.08,
    ease: 'backOut'
  }, EZ, fps);

  // Move to complete - using shrinkToCorner preset
  const moveAnim = shrinkToCorner(frame, {
    start: sceneBeats.moveToComplete || 4.5,
    dur: 1.3,
    targetScale: 0.7,
    targetPos: { x: -250, y: -150 },
    ease: 'power3InOut'
  }, EZ, fps);

  // Next journey - using fadeUpIn preset
  const nextAnim = fadeUpIn(frame, {
    start: sceneBeats.nextReveal || 7.0,
    dur: 1.3,
    dist: 50,
    ease: 'backOut'
  }, EZ, fps);

  // Next pulse after entrance
  const nextPulseAnim = pulseEmphasis(frame, {
    start: (sceneBeats.nextReveal || 7.0) + 0.6,
    dur: 0.5,
    scale: 1.05,
    ease: 'backOut'
  }, EZ, fps);

  // CTA - using fadeUpIn preset
  const ctaAnim = fadeUpIn(frame, {
    start: sceneBeats.cta || 8.5,
    dur: 1.0,
    dist: 20,
    ease: 'smooth'
  }, EZ, fps);

  // ========================================
  // ROUGH.JS - Frames & Progression (ZERO WOBBLE)
  // ========================================

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const rc = rough.svg(svg);

    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // Current learning frame (center) - before moving
    if (frame >= beats.current && frame < beats.moveToComplete) {
      const progress = Math.min((frame - beats.current) / 35, 1);
      
      const currentFrame = rc.rectangle(660, 420, 600, 240, {
        stroke: colors.accent,
        strokeWidth: 5,
        roughness: 0,
        bowing: 0,
        fill: `${colors.accent}10`,
        fillStyle: 'hachure',
        hachureGap: 10,
      });

      const paths = currentFrame.querySelectorAll('path');
      paths.forEach(path => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length * (1 - progress);
      });

      svg.appendChild(currentFrame);
    }

    // Achievement markers (check marks)
    if (frame >= beats.celebrate && frame < beats.moveToComplete) {
      const celebrateProgress = Math.min((frame - beats.celebrate) / 20, 1);
      
      [[700, 460], [1200, 460], [950, 620]].forEach(([x, y], i) => {
        const delay = i * 0.3;
        if (celebrateProgress > delay) {
          const checkProgress = Math.min((celebrateProgress - delay) / 0.4, 1);
          
          const checkPath = `M ${x - 15} ${y} L ${x - 5} ${y + 12 * checkProgress} L ${x + 20 * checkProgress} ${y - 15}`;
          const check = rc.path(checkPath, {
            stroke: colors.accent,
            strokeWidth: 6,
            roughness: 0,
            bowing: 0,
          });
          svg.appendChild(check);
        }
      });
    }

    // Current learning frame (small, upper left) - after moving
    if (frame >= beats.moveToComplete) {
      const smallFrame = rc.rectangle(200, 220, 420, 170, {
        stroke: colors.accent,
        strokeWidth: 4,
        roughness: 0,
        bowing: 0,
        fill: `${colors.accent}08`,
        fillStyle: 'solid',
      });
      svg.appendChild(smallFrame);
      
      // Check mark on completed
      const checkPath = `M 240 270 L 260 290 L 300 250`;
      const check = rc.path(checkPath, {
        stroke: colors.accent,
        strokeWidth: 6,
        roughness: 0,
        bowing: 0,
      });
      svg.appendChild(check);
    }

    // STEPPING STONES / PROGRESSION PATH (animated)
    if (frame >= beats.steppingStones) {
      const stoneProgress = Math.min((frame - beats.steppingStones) / 40, 1);
      
      const stones = [
        { x: 640, y: 300, size: 0.3 },
        { x: 840, y: 380, size: 0.6 },
        { x: 1040, y: 300, size: 1.0 },
      ];
      
      stones.forEach((stone, i) => {
        const delay = i * 0.25;
        if (stoneProgress > delay) {
          const sProgress = Math.min((stoneProgress - delay) / 0.4, 1);
          const size = 40 + stone.size * 30;
          
          const stoneCircle = rc.circle(stone.x, stone.y, size * sProgress * 2, {
            stroke: colors.accent3,
            strokeWidth: 4,
            roughness: 0,
            bowing: 0,
            fill: `${colors.accent3}20`,
            fillStyle: 'solid',
          });
          svg.appendChild(stoneCircle);
          
          // Connecting lines between stones
          if (i > 0 && sProgress > 0.5) {
            const prevStone = stones[i - 1];
            const lineProgress = (sProgress - 0.5) / 0.5;
            const linePath = `M ${prevStone.x} ${prevStone.y} Q ${(prevStone.x + stone.x) / 2} ${Math.min(prevStone.y, stone.y) - 40} ${prevStone.x + (stone.x - prevStone.x) * lineProgress} ${prevStone.y + (stone.y - prevStone.y) * lineProgress}`;
            
            const connLine = rc.path(linePath, {
              stroke: colors.accent3,
              strokeWidth: 3,
              roughness: 0,
              bowing: 0,
            });
            svg.appendChild(connLine);
          }
        }
      });
    }

    // Next journey frame
    if (frame >= beats.nextReveal) {
      const progress = Math.min((frame - beats.nextReveal) / 38, 1);
      
      const nextFrame = rc.rectangle(1200, 420, 520, 240, {
        stroke: colors.accent2,
        strokeWidth: 5,
        roughness: 0,
        bowing: 0,
        fill: `${colors.accent2}10`,
        fillStyle: 'hachure',
        hachureGap: 10,
      });

      const paths = nextFrame.querySelectorAll('path');
      paths.forEach(path => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length * (1 - progress);
      });

      svg.appendChild(nextFrame);
      
      // Energy burst around next
      if (progress > 0.7) {
        const burstProgress = (progress - 0.7) / 0.3;
        
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2;
          const distance = 60 * burstProgress;
          const sparkX = 1460 + Math.cos(angle) * distance;
          const sparkY = 540 + Math.sin(angle) * distance;
          
          const sparkSize = 12;
          const sparkCircle = rc.circle(sparkX, sparkY, sparkSize * burstProgress * 2, {
            stroke: colors.accent2,
            strokeWidth: 2,
            roughness: 0,
            bowing: 0,
            fill: colors.accent2,
            fillStyle: 'solid',
          });
          sparkCircle.style.opacity = 1 - burstProgress * 0.5;
          svg.appendChild(sparkCircle);
        }
      }
    }

    // Forward arrow (CTA decoration)
    if (frame >= beats.cta) {
      const arrowProgress = Math.min((frame - beats.cta) / 30, 1);
      
      const arrowPath = `M 760 ${880 + 10 * Math.sin(arrowProgress * Math.PI)} L ${760 + 180 * arrowProgress} ${880 + 10 * Math.sin(arrowProgress * Math.PI)}`;
      const arrow = rc.path(arrowPath, {
        stroke: colors.accent2,
        strokeWidth: 6,
        roughness: 0,
        bowing: 0,
      });
      svg.appendChild(arrow);
      
      // Arrowhead
      if (arrowProgress > 0.6) {
        const headProgress = (arrowProgress - 0.6) / 0.4;
        const headPath = `M 940 880 L ${940 - 25 * headProgress} ${880 - 20 * headProgress} M 940 880 L ${940 - 25 * headProgress} ${880 + 20 * headProgress}`;
        const head = rc.path(headPath, {
          stroke: colors.accent2,
          strokeWidth: 6,
          roughness: 0,
          bowing: 0,
        });
        svg.appendChild(head);
      }
    }

  }, [frame, beats, colors]);

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
                {data.title || 'Your Learning Journey'}
              </h2>
            </div>
          )}

          {/* Current learning - ANCHORED FIRST */}
          {frame >= beats.current && frame < beats.moveToComplete + 20 && (
            <div
              style={{
                position: 'absolute',
                top: 460,
                left: 680,
                width: 560,
                opacity: currentAnim.opacity,
                transform: `translateY(${currentAnim.translateY}px) scale(${frame >= beats.celebrate ? celebrateAnim.scale : 1})`,
              }}
            >
              <h3
                style={{
                  fontFamily: fonts.primary,
                  fontSize: fonts.size_section,
                  fontWeight: 400,
                  color: colors.accent,
                  margin: '0 0 16px 0',
                }}
              >
                {data.current?.label || 'You learned:'}
              </h3>
              <p
                style={{
                  fontFamily: fonts.secondary,
                  fontSize: fonts.size_body,
                  color: colors.ink,
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {data.current?.summary || 'Key concepts from this lesson'}
              </p>
            </div>
          )}

          {/* Current (small, after moving) */}
          {frame >= beats.moveToComplete + 20 && (
            <div
              style={{
                position: 'absolute',
                top: 250,
                left: 230,
                width: 360,
                opacity: interpolate(
                  frame,
                  [beats.moveToComplete + 20, beats.moveToComplete + 40],
                  [0, 1],
                  { extrapolateRight: 'clamp' }
                ),
              }}
            >
              <p
                style={{
                  fontFamily: fonts.secondary,
                  fontSize: 18,
                  fontWeight: 600,
                  color: colors.accent,
                  margin: 0,
                }}
              >
                ✓ Completed
              </p>
            </div>
          )}

          {/* Next journey */}
          {frame >= beats.nextReveal && (
            <div
              style={{
                position: 'absolute',
                top: 460,
                left: 1220,
                width: 480,
                opacity: nextAnim.opacity,
                transform: `translateY(${nextAnim.translateY}px) scale(${nextPulseAnim.scale})`,
              }}
            >
              <h3
                style={{
                  fontFamily: fonts.primary,
                  fontSize: fonts.size_section,
                  fontWeight: 400,
                  color: colors.accent2,
                  margin: '0 0 16px 0',
                }}
              >
                {data.next?.label || 'Coming up:'}
              </h3>
              <p
                style={{
                  fontFamily: fonts.secondary,
                  fontSize: fonts.size_body,
                  color: colors.ink,
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {data.next?.teaser || 'Exciting new concepts ahead'}
              </p>
            </div>
          )}

          {/* Forward CTA */}
          {frame >= beats.cta && (
            <div
              style={{
                position: 'absolute',
                bottom: 100,
                left: '50%',
                transform: `translateX(-50%) translateY(${ctaAnim.translateY}px)`,
                textAlign: 'center',
                opacity: ctaAnim.opacity,
              }}
            >
              <p
                style={{
                  fontFamily: fonts.primary,
                  fontSize: fonts.size_cta,
                  fontWeight: 400,
                  color: colors.accent2,
                  margin: 0,
                }}
              >
                {data.cta || "Let's keep going!"}
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

export { Reflect4DForwardLink };

export const TEMPLATE_ID = 'Reflect4DForwardLink';
export const TEMPLATE_VERSION = '5.0.0';

export const getDuration = (scene, fps) => {
  const tailPadding = 0.5;
  return toFrames((scene.beats?.exit || 10.5) + tailPadding, fps);
};

export const DURATION_MIN_FRAMES = 540;  // 18s @ 30fps
export const DURATION_MAX_FRAMES = 840;  // 28s @ 30fps

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
  'pulseEmphasis',
  'shrinkToCorner'
];

export const getPosterFrame = (scene, fps) => {
  return toFrames(scene.beats?.nextReveal || 7.0, fps);
};

// Legacy exports for backward compatibility
export const REFLECT_4D_DURATION_MIN = DURATION_MIN_FRAMES;
export const REFLECT_4D_DURATION_MAX = DURATION_MAX_FRAMES;
export const REFLECT_4D_EXIT_TRANSITION = 15;
