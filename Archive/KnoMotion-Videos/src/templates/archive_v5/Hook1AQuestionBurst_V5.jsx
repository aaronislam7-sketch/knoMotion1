import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import { THEME } from '../../utils/theme';
import rough from 'roughjs/bundled/rough.esm.js';

// Blueprint v5.0 imports
import { 
  fadeUpIn, 
  pulseEmphasis, 
  breathe, 
  shrinkToCorner,
  EZ,
  useSceneId,
  toFrames,
  // ✨ Creative Magic V6
  generateAmbientParticles,
  renderAmbientParticles,
  generateSparkles,
  renderSparkles,
  getLiquidBlob,
  getShimmerEffect
} from '../../sdk';

/**
 * HOOK 1A: QUESTION BURST - Blueprint v5.0 + ✨ CREATIVE MAGIC V6
 * 
 * TEMPLATE STRATEGY:
 * - ✅ Blueprint v5.0 compliant
 * - ✅ Uses animation presets (fadeUpIn, pulseEmphasis, breathe, shrinkToCorner)
 * - ✅ Reads beats from JSON (in seconds)
 * - ✅ Context-based ID factory (useSceneId)
 * - ✅ Strict zero wobble (roughness: 0, bowing: 0)
 * - ✅ FPS-agnostic (seconds → frames conversion)
 * - ✨ CREATIVE ENHANCEMENTS:
 *   • Ambient particle system (floating depth)
 *   • Sparkle bursts when questions appear
 *   • Liquid blob behind map (organic energy)
 *   • Shimmer effect on welcome text
 *   • Enhanced depth and layering
 * 
 * CONVERSATIONAL FLOW:
 * 1. Ambient particles create living background
 * 2. "What if geography" fades up with sparkle burst
 * 3. Question 1 moves up (custom animation - multi-stage)
 * 4. "was measured in mindsets?" fades up with sparkles
 * 5. Both pulse (preset: pulseEmphasis)
 * 6. Both wipe left (custom animation - coordinated exit)
 * 7. Liquid blob animates behind map position
 * 8. Map draws in center (rough.js with zero wobble)
 * 9. Map shrinks to corner (preset: shrinkToCorner)
 * 10. "Welcome to Knodovia" fades up with shimmer effect
 * 11. Subtitle fades in (preset: fadeUpIn)
 * 12. Welcome breathes (preset: breathe)
 * 
 * TYPOGRAPHY:
 * - Headers: Cabin Sketch (sketchy style, NO wobble)
 * - Secondary: Permanent Marker (energy and personality)
 * - Body: Inter (clean readability)
 * 
 * Duration: 15-18s (derived from beats.exit)
 */

const Hook1AQuestionBurst = ({ scene, styles, presets, easingMap, transitions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const id = useSceneId();
  
  const svgRef = useRef(null);
  const mapSvgRef = useRef(null);
  const roughTextSvgRef = useRef(null);
  const particlesRef = useRef(null);
  const effectsRef = useRef(null);
  
  // ✨ Generate deterministic particles (runs once)
  const ambientParticles = React.useMemo(
    () => generateAmbientParticles(20, 42, 1920, 1080),
    []
  );
  
  const sparklesQ1 = React.useMemo(
    () => generateSparkles(8, { x: 760, y: 380, width: 400, height: 200 }, 100),
    []
  );
  
  const sparklesQ2 = React.useMemo(
    () => generateSparkles(10, { x: 760, y: 500, width: 400, height: 200 }, 200),
    []
  );
  
  const sparklesWelcome = React.useMemo(
    () => generateSparkles(12, { x: 660, y: 480, width: 600, height: 160 }, 300),
    []
  );

  // Style tokens with fallbacks
  const style = scene.style_tokens || {};
  const colors = style.colors || {
    bg: '#FFF9F0',
    accent: '#FF6B35',
    accent2: '#9B59B6',
    ink: '#1A1A1A',
  };
  
  const fonts = style.fonts || {
    header: "'Cabin Sketch', cursive",
    secondary: THEME.fonts.marker.primary,
    body: THEME.fonts.structure.primary,
    size_title: 76,
    size_question: 92,
    size_welcome: 72,
    size_subtitle: 32,
  };

  const texts = scene.fill?.texts || {};

  // Beats from JSON (in seconds) - Convert to frames
  const sceneBeats = scene.beats || {};
  const beats = {
    prelude: 0,
    questionPart1: toFrames(sceneBeats.questionPart1 || 0.6, fps),
    moveUp: toFrames(sceneBeats.moveUp || 2.0, fps),
    questionPart2: toFrames(sceneBeats.questionPart2 || 2.8, fps),
    emphasis: toFrames(sceneBeats.emphasis || 4.2, fps),
    wipeQuestions: toFrames(sceneBeats.wipeQuestions || 5.5, fps),
    mapReveal: toFrames(sceneBeats.mapReveal || 6.5, fps),
    transformMap: toFrames(sceneBeats.transformMap || 9.0, fps),
    welcome: toFrames(sceneBeats.welcome || 10.0, fps),
    subtitle: toFrames(sceneBeats.subtitle || 12.0, fps),
    breathe: toFrames(sceneBeats.breathe || 13.5, fps),
    exit: toFrames(sceneBeats.exit || 15.0, fps),
  };

  // Subtle camera drift
  const cameraDrift = {
    x: Math.sin(frame * 0.008) * 2,
    y: Math.cos(frame * 0.006) * 1.5,
  };

  // ========================================
  // ANIMATIONS (Mix of presets + custom)
  // ========================================
  
  // Question 1: Complex multi-stage (entrance, move, pulse, wipe)
  // Note: This is custom because it has 4 sequential stages
  const q1Opacity = frame < beats.questionPart1 ? 0 :
    frame < beats.wipeQuestions ? interpolate(
      frame,
      [beats.questionPart1, beats.questionPart1 + 27],
      [0, 1],
      { extrapolateRight: 'clamp', easing: EZ.smooth }
    ) :
    interpolate(
      frame,
      [beats.wipeQuestions, beats.wipeQuestions + 30],
      [1, 0],
      { extrapolateRight: 'clamp', easing: EZ.power3In }
    );

  const q1TranslateY = frame < beats.questionPart1 ? 30 :
    frame < beats.moveUp ? interpolate(
      frame,
      [beats.questionPart1, beats.questionPart1 + 27],
      [30, 0],
      { extrapolateRight: 'clamp', easing: EZ.smooth }
    ) :
    interpolate(
      frame,
      [beats.moveUp, beats.moveUp + 24],
      [0, -60],
      { extrapolateRight: 'clamp', easing: EZ.power2InOut }
    );

  const q1TranslateX = frame < beats.wipeQuestions ? 0 :
    interpolate(
      frame,
      [beats.wipeQuestions, beats.wipeQuestions + 30],
      [0, -1200],
      { extrapolateRight: 'clamp', easing: EZ.power3In }
    );

  // Question 1 pulse - using preset
  const q1Pulse = pulseEmphasis(frame, {
    start: sceneBeats.emphasis || 4.2,
    dur: 0.8,
    scale: 1.05,
    ease: 'backOut'
  }, EZ, fps);
  const q1Scale = q1Pulse.scale;

  // Question 2: Similar multi-stage animation
  const q2Opacity = frame < beats.questionPart2 ? 0 :
    frame < beats.wipeQuestions ? interpolate(
      frame,
      [beats.questionPart2, beats.questionPart2 + 30],
      [0, 1],
      { extrapolateRight: 'clamp', easing: EZ.smooth }
    ) :
    interpolate(
      frame,
      [beats.wipeQuestions, beats.wipeQuestions + 30],
      [1, 0],
      { extrapolateRight: 'clamp', easing: EZ.power3In }
    );

  const q2TranslateY = frame < beats.questionPart2 ? 40 :
    interpolate(
      frame,
      [beats.questionPart2, beats.questionPart2 + 30],
      [40, 0],
      { extrapolateRight: 'clamp', easing: EZ.smooth }
    );

  const q2TranslateX = frame < beats.wipeQuestions ? 0 :
    interpolate(
      frame,
      [beats.wipeQuestions, beats.wipeQuestions + 30],
      [0, -1200],
      { extrapolateRight: 'clamp', easing: EZ.power3In }
    );

  // Question 2 entrance scale + pulse
  const q2EntranceScale = frame < beats.questionPart2 ? 0.88 :
    frame < beats.questionPart2 + 30 ? interpolate(
      frame,
      [beats.questionPart2, beats.questionPart2 + 30],
      [0.88, 1],
      { extrapolateRight: 'clamp', easing: EZ.smooth }
    ) : 1;

  const q2Pulse = pulseEmphasis(frame, {
    start: sceneBeats.emphasis || 4.2,
    dur: 0.8,
    scale: 1.05,
    ease: 'backOut'
  }, EZ, fps);
  
  const q2Scale = frame < beats.questionPart2 + 30 ? q2EntranceScale : q2Pulse.scale;

  // Map: Entrance animation (custom for draw-on effect)
  const mapOpacity = frame < beats.mapReveal ? 0 :
    interpolate(
      frame,
      [beats.mapReveal, beats.mapReveal + 39],
      [0, 1],
      { extrapolateRight: 'clamp', easing: EZ.smooth }
    );

  const mapEntranceScale = frame < beats.mapReveal ? 0.85 :
    frame < beats.transformMap ? interpolate(
      frame,
      [beats.mapReveal, beats.mapReveal + 39],
      [0.85, 1],
      { extrapolateRight: 'clamp', easing: EZ.smooth }
    ) : 1;

  // Map: Shrink to corner - using preset
  const mapTransform = shrinkToCorner(frame, {
    start: sceneBeats.transformMap || 9.0,
    dur: 1.2,
    targetScale: 0.4,
    targetPos: { x: 600, y: -300 },
    ease: 'power2InOut'
  }, EZ, fps);

  const mapScale = frame < beats.transformMap ? mapEntranceScale : mapTransform.scale;
  const mapTranslateX = mapTransform.translateX || 0;
  const mapTranslateY = mapTransform.translateY || 0;

  // Welcome: Using fadeUpIn preset
  const welcomeAnim = fadeUpIn(frame, {
    start: sceneBeats.welcome || 10.0,
    dur: 1.5,
    dist: 40,
    ease: 'power3InOut'
  }, EZ, fps);

  // Welcome: Add breathe after entrance
  const welcomeBreathe = breathe(frame, {
    start: sceneBeats.breathe || 13.5,
    loop: 3.0,
    amount: 0.02
  }, EZ, fps);

  const welcomeOpacity = welcomeAnim.opacity;
  const welcomeTranslateY = welcomeAnim.translateY || 0;
  const welcomeScale = frame < beats.breathe ? 0.88 + welcomeAnim.opacity * 0.12 : welcomeBreathe.scale;

  // Subtitle: Using fadeUpIn preset
  const subtitleAnim = fadeUpIn(frame, {
    start: sceneBeats.subtitle || 12.0,
    dur: 1.2,
    dist: 20,
    ease: 'smooth'
  }, EZ, fps);

  const subtitleOpacity = subtitleAnim.opacity;
  const subtitleTranslateY = subtitleAnim.translateY || 0;

  // ========================================
  // ROUGH.JS - Headers & Map (ZERO WOBBLE)
  // ========================================

  // Render headers with CABIN SKETCH SVG text
  useEffect(() => {
    if (!roughTextSvgRef.current) return;

    const svg = roughTextSvgRef.current;
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // Question Part 1
    if (frame >= beats.questionPart1 && frame < beats.wipeQuestions + 35) {
      const text1 = texts.questionPart1 || 'What if geography';
      
      const textGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      textGroup.setAttribute('id', id('question1-group'));
      textGroup.setAttribute('opacity', String(q1Opacity));
      textGroup.setAttribute('transform', `translate(${q1TranslateX}, ${q1TranslateY}) scale(${q1Scale})`);
      
      const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      textElement.setAttribute('x', '960');
      textElement.setAttribute('y', '480');
      textElement.setAttribute('text-anchor', 'middle');
      textElement.setAttribute('font-family', "'Cabin Sketch', cursive");
      textElement.setAttribute('font-size', fonts.size_title);
      textElement.setAttribute('font-weight', '700');
      textElement.setAttribute('fill', colors.ink);
      textElement.textContent = text1;
      
      textGroup.appendChild(textElement);
      svg.appendChild(textGroup);
    }

    // Question Part 2
    if (frame >= beats.questionPart2 && frame < beats.wipeQuestions + 35) {
      const text2 = texts.questionPart2 || 'was measured in mindsets?';
      
      const textGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      textGroup.setAttribute('id', id('question2-group'));
      textGroup.setAttribute('opacity', String(q2Opacity));
      textGroup.setAttribute('transform', `translate(${q2TranslateX}, ${q2TranslateY}) scale(${q2Scale})`);
      
      const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      textElement.setAttribute('x', '960');
      textElement.setAttribute('y', '600');
      textElement.setAttribute('text-anchor', 'middle');
      textElement.setAttribute('font-family', "'Cabin Sketch', cursive");
      textElement.setAttribute('font-size', fonts.size_question);
      textElement.setAttribute('font-weight', '700');
      textElement.setAttribute('fill', colors.accent);
      textElement.textContent = text2;
      
      textGroup.appendChild(textElement);
      svg.appendChild(textGroup);
    }

    // "Welcome to Knodovia" - ✨ WITH SHIMMER EFFECT
    if (frame >= beats.welcome) {
      const welcomeText = texts.welcome || 'Welcome to Knodovia';
      
      // Create gradient for shimmer effect
      const shimmer = getShimmerEffect(frame - beats.welcome, {
        speed: 0.03,
        width: 150,
        angle: 45,
        intensity: 0.4,
      });
      
      // Gradient definition
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
      gradient.setAttribute('id', id('welcome-shimmer'));
      gradient.setAttribute('x1', `${shimmer.gradientStart}%`);
      gradient.setAttribute('x2', `${shimmer.gradientEnd}%`);
      gradient.setAttribute('y1', '0%');
      gradient.setAttribute('y2', '0%');
      
      const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop1.setAttribute('offset', '0%');
      stop1.setAttribute('stop-color', colors.accent2);
      stop1.setAttribute('stop-opacity', '1');
      
      const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop2.setAttribute('offset', '50%');
      stop2.setAttribute('stop-color', '#FFD700');
      stop2.setAttribute('stop-opacity', '1');
      
      const stop3 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop3.setAttribute('offset', '100%');
      stop3.setAttribute('stop-color', colors.accent2);
      stop3.setAttribute('stop-opacity', '1');
      
      gradient.appendChild(stop1);
      gradient.appendChild(stop2);
      gradient.appendChild(stop3);
      defs.appendChild(gradient);
      svg.appendChild(defs);
      
      const textGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      textGroup.setAttribute('id', id('welcome-group'));
      textGroup.setAttribute('opacity', String(welcomeOpacity));
      textGroup.setAttribute('transform', `translate(0, ${welcomeTranslateY}) scale(${welcomeScale})`);
      
      const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      textElement.setAttribute('x', '960');
      textElement.setAttribute('y', '560');
      textElement.setAttribute('text-anchor', 'middle');
      textElement.setAttribute('font-family', "'Cabin Sketch', cursive");
      textElement.setAttribute('font-size', fonts.size_welcome);
      textElement.setAttribute('font-weight', '700');
      textElement.setAttribute('fill', `url(#${id('welcome-shimmer')})`);
      textElement.textContent = welcomeText;
      
      textGroup.appendChild(textElement);
      svg.appendChild(textGroup);
    }

  }, [frame, beats, colors, texts, fonts, id, q1Opacity, q1TranslateX, q1TranslateY, q1Scale, q2Opacity, q2TranslateX, q2TranslateY, q2Scale, welcomeOpacity, welcomeTranslateY, welcomeScale]);

  // Animated Map SVG - STRICT ZERO WOBBLE
  useEffect(() => {
    if (!mapSvgRef.current || frame < beats.mapReveal) return;

    const svg = mapSvgRef.current;
    const rc = rough.svg(svg);

    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    const progress = Math.min((frame - beats.mapReveal) / 50, 1);

    // Stylized landmass
    const islandPath = `
      M 200 180 
      Q 180 120 220 100
      Q 270 80 320 100
      Q 360 90 380 120
      Q 420 110 440 140
      Q 460 170 440 210
      Q 430 250 400 270
      Q 360 290 320 280
      Q 280 290 240 270
      Q 200 250 190 220
      Q 180 200 200 180 Z
    `;

    const island = rc.path(islandPath, {
      stroke: colors.accent,
      strokeWidth: 6,
      roughness: 0,  // STRICT ZERO WOBBLE
      bowing: 0,     // STRICT ZERO WOBBLE
      fill: `${colors.accent}15`,
      fillStyle: 'hachure',
      hachureGap: 8,
      hachureAngle: 45,
    });

    const paths = island.querySelectorAll('path');
    paths.forEach(path => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length * (1 - progress);
    });

    svg.appendChild(island);

    // Small islands/details
    if (progress > 0.5) {
      const detailProgress = (progress - 0.5) * 2;
      
      const small1 = rc.circle(150, 200, 40 * detailProgress, {
        stroke: colors.accent2,
        strokeWidth: 4,
        roughness: 0,  // STRICT ZERO WOBBLE
        bowing: 0,     // STRICT ZERO WOBBLE
        fill: `${colors.accent2}12`,
        fillStyle: 'solid',
      });
      svg.appendChild(small1);

      const small2 = rc.circle(480, 180, 30 * detailProgress, {
        stroke: colors.accent2,
        strokeWidth: 4,
        roughness: 0,  // STRICT ZERO WOBBLE
        bowing: 0,     // STRICT ZERO WOBBLE
        fill: `${colors.accent2}12`,
        fillStyle: 'solid',
      });
      svg.appendChild(small2);

      // Location markers
      if (detailProgress > 0.6) {
        const markerProgress = (detailProgress - 0.6) / 0.4;
        
        [[260, 160], [340, 200], [380, 240]].forEach(([x, y], i) => {
          const delay = i * 0.2;
          if (markerProgress > delay) {
            const locProgress = Math.min((markerProgress - delay) / 0.3, 1);
            
            const markerPath = `M ${x} ${y} L ${x} ${y + 20 * locProgress}`;
            const marker = rc.path(markerPath, {
              stroke: colors.ink,
              strokeWidth: 5,
              roughness: 0,  // STRICT ZERO WOBBLE
              bowing: 0,     // STRICT ZERO WOBBLE
            });
            svg.appendChild(marker);

            const pinHead = rc.circle(x, y, 12 * locProgress, {
              stroke: colors.accent,
              strokeWidth: 3,
              roughness: 0,  // STRICT ZERO WOBBLE
              bowing: 0,     // STRICT ZERO WOBBLE
              fill: colors.accent,
              fillStyle: 'solid',
            });
            svg.appendChild(pinHead);
          }
        });
      }
    }

  }, [frame, beats.mapReveal, colors, id]);

  // ✨ Render liquid blob behind map
  useEffect(() => {
    if (!effectsRef.current || frame < beats.mapReveal - 10) return;
    
    const svg = effectsRef.current;
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }
    
    // Liquid blob animates behind map
    if (frame >= beats.mapReveal - 10 && frame < beats.transformMap + 60) {
      const blobOpacity = frame < beats.mapReveal 
        ? interpolate(frame, [beats.mapReveal - 10, beats.mapReveal], [0, 0.15], { extrapolateRight: 'clamp' })
        : 0.15;
      
      const blob = getLiquidBlob(frame, {
        centerX: 960,
        centerY: 540,
        baseRadius: 200,
        points: 6,
        wobbleAmount: 0.15,
        speed: 0.015,
        seed: 500,
      });
      
      const blobPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      blobPath.setAttribute('d', blob.path);
      blobPath.setAttribute('fill', colors.accent2);
      blobPath.setAttribute('opacity', String(blobOpacity));
      
      svg.appendChild(blobPath);
    }
    
  }, [frame, beats, colors]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        backgroundImage: `
          radial-gradient(circle at 20% 30%, ${colors.accent}03 0%, transparent 60%),
          radial-gradient(circle at 80% 70%, ${colors.accent2}03 0%, transparent 55%)
        `,
      }}
    >
      {/* ✨ Ambient particles layer (background) */}
      <svg
        ref={particlesRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          opacity: 0.6,
        }}
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid meet"
      >
        {renderAmbientParticles(ambientParticles, frame, fps, [colors.accent, colors.accent2, '#2E7FE4']).map(p => p.element)}
      </svg>
      
      {/* ✨ Effects layer (liquid blobs, etc.) */}
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
      />
      
      {/* Decorative layer */}
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
      >
        {/* ✨ Sparkles for question 1 */}
        {frame >= beats.questionPart1 && frame < beats.questionPart1 + 50 &&
          renderSparkles(sparklesQ1, frame, beats.questionPart1, colors.accent)}
        
        {/* ✨ Sparkles for question 2 */}
        {frame >= beats.questionPart2 && frame < beats.questionPart2 + 50 &&
          renderSparkles(sparklesQ2, frame, beats.questionPart2, colors.accent2)}
        
        {/* ✨ Sparkles for welcome text */}
        {frame >= beats.welcome && frame < beats.welcome + 60 &&
          renderSparkles(sparklesWelcome, frame, beats.welcome, '#FFD700')}
      </svg>

      {/* Rough text layer (Cabin Sketch headers) */}
      <svg
        ref={roughTextSvgRef}
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

      {/* Content layer */}
      <AbsoluteFill
        style={{
          transform: `translate(${cameraDrift.x}px, ${cameraDrift.y}px)`,
        }}
      >
        {/* Animated Map Container */}
        {frame >= beats.mapReveal && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) translate(${mapTranslateX}px, ${mapTranslateY}px) scale(${mapScale})`,
              width: 640,
              height: 400,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              opacity: mapOpacity,
            }}
          >
            <svg
              ref={mapSvgRef}
              style={{
                width: '100%',
                height: '100%',
              }}
              viewBox="0 0 640 400"
              preserveAspectRatio="xMidYMid meet"
            />
          </div>
        )}

        {/* Subtitle - Permanent Marker */}
        {frame >= beats.subtitle && (
          <div
            style={{
              position: 'absolute',
              bottom: '30%',
              left: '50%',
              transform: `translateX(-50%) translateY(${subtitleTranslateY}px)`,
              maxWidth: 800,
              textAlign: 'center',
              opacity: subtitleOpacity,
            }}
          >
            <p
              style={{
                fontFamily: fonts.secondary,
                fontSize: fonts.size_subtitle,
                color: `${colors.ink}80`,
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              {texts.subtitle || 'A place where your perspective shapes the landscape...'}
            </p>
          </div>
        )}
      </AbsoluteFill>

      {/* Settle fade */}
      {frame >= beats.exit && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: colors.bg,
            opacity: interpolate(
              frame,
              [beats.exit, beats.exit + 30],
              [0, 0.15],
              { extrapolateRight: 'clamp', easing: EZ.smooth }
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

export { Hook1AQuestionBurst };

export const TEMPLATE_ID = 'Hook1AQuestionBurst';
export const TEMPLATE_VERSION = '5.0.0';

export const getDuration = (scene, fps) => {
  const tailPadding = 0.5;
  return toFrames((scene.beats?.exit || 15.0) + tailPadding, fps);
};

export const DURATION_MIN_FRAMES = 450;  // 15s @ 30fps
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
  'pulseEmphasis',
  'breathe',
  'shrinkToCorner'
];

export const getPosterFrame = (scene, fps) => {
  return toFrames(scene.beats?.emphasis || 4.2, fps);
};

// Legacy exports for backward compatibility
export const HOOK_1A_DURATION_MIN = DURATION_MIN_FRAMES;
export const HOOK_1A_DURATION_MAX = DURATION_MAX_FRAMES;
export const HOOK_1A_EXIT_TRANSITION = 15;
