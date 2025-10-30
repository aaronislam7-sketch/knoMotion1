import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import { THEME } from '../utils/theme';
import rough from 'roughjs/bundled/rough.esm.js';

// 🎯 AGNOSTIC TEMPLATE SYSTEM - Blueprint v5.1
import { 
  // Animation presets
  fadeUpIn, 
  pulseEmphasis, 
  breathe, 
  shrinkToCorner,
  EZ,
  useSceneId,
  toFrames,
  
  // Creative effects
  generateAmbientParticles,
  renderAmbientParticles,
  generateSparkles,
  renderSparkles,
  getLiquidBlob,
  getShimmerEffect,
  
  // 🎯 NEW: Agnostic systems
  renderHero,
  calculateHeroAnimation,
  getHeroDrawProgress,
  mergeHeroConfig,
  renderQuestionLines,
  createQuestionFromParts,
  resolvePosition,
  positionToCSS,
  DEFAULT_QUESTION_LAYOUT,
  DEFAULT_QUESTION_ANIMATION
} from '../sdk';

/**
 * HOOK 1A: QUESTION BURST - AGNOSTIC VERSION
 * 
 * ✅ Uses Type-Based Polymorphism (hero registry)
 * ✅ Uses Data-Driven Structure (dynamic question lines)
 * ✅ Uses Token-Based Positioning (position system)
 * ✅ Backward compatible with legacy JSON
 * 
 * DOMAIN-AGNOSTIC:
 * - Geography (Knodovia map)
 * - Football (player image)
 * - Science (atom diagram)
 * - Business (org charts)
 * - Any visual + 1-4 text lines
 * 
 * Duration: 15-18s (derived from beats.exit)
 */

const Hook1AQuestionBurst_Agnostic = ({ scene, styles, presets, easingMap, transitions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const id = useSceneId();
  
  const svgRef = useRef(null);
  const mapSvgRef = useRef(null);
  const roughTextSvgRef = useRef(null);
  const particlesRef = useRef(null);
  const effectsRef = useRef(null);
  
  // ========================================
  // BACKWARD COMPATIBILITY
  // Support both old and new JSON formats
  // ========================================
  
  const isLegacyFormat = !scene.question && scene.fill?.texts;
  
  let questionConfig;
  if (isLegacyFormat) {
    // Convert legacy format to new format
    questionConfig = createQuestionFromParts(
      scene.fill.texts.questionPart1,
      scene.fill.texts.questionPart2
    );
  } else {
    questionConfig = {
      lines: scene.question?.lines || [],
      layout: { ...DEFAULT_QUESTION_LAYOUT, ...(scene.question?.layout || {}) },
      animation: { ...DEFAULT_QUESTION_ANIMATION, ...(scene.question?.animation || {}) }
    };
  }
  
  // Hero configuration with defaults
  const heroConfig = mergeHeroConfig(scene.hero || {
    type: 'roughSVG',
    asset: 'knodovia-map'
  });
  
  // Welcome and subtitle
  const welcomeConfig = scene.welcome || { 
    text: scene.fill?.texts?.welcome || 'Welcome',
    position: 'center'
  };
  
  const subtitleConfig = scene.subtitle || {
    text: scene.fill?.texts?.subtitle || '',
    position: 'bottom-center'
  };
  
  // ✨ Generate deterministic particles
  const ambientParticles = React.useMemo(
    () => generateAmbientParticles(20, 42, 1920, 1080),
    []
  );
  
  const sparklesQ = React.useMemo(() => {
    return questionConfig.lines.map((_, index) => 
      generateSparkles(8 + index * 2, { x: 760, y: 380 + index * 80, width: 400, height: 200 }, 100 + index * 100)
    );
  }, [questionConfig.lines.length]);
  
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

  // Beats from JSON
  const sceneBeats = scene.beats || {};
  const beats = {
    entrance: toFrames(sceneBeats.entrance || 0.6, fps),
    questionStart: toFrames(sceneBeats.questionStart || sceneBeats.questionPart1 || 0.6, fps),
    moveUp: toFrames(sceneBeats.moveUp || 2.0, fps),
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
  // HERO ANIMATION (using new system)
  // ========================================
  
  const heroAnimation = calculateHeroAnimation(
    frame,
    heroConfig,
    {
      mapReveal: sceneBeats.mapReveal || 6.5,
      transformMap: sceneBeats.transformMap || 9.0
    },
    EZ,
    fps
  );

  // ========================================
  // WELCOME & SUBTITLE ANIMATIONS
  // ========================================
  
  const welcomeAnim = fadeUpIn(frame, {
    start: sceneBeats.welcome || 10.0,
    dur: 1.5,
    dist: 40,
    ease: 'power3InOut'
  }, EZ, fps);

  const welcomeBreathe = breathe(frame, {
    start: sceneBeats.breathe || 13.5,
    loop: 3.0,
    amount: 0.02
  }, EZ, fps);

  const welcomeScale = frame < beats.breathe ? 0.88 + welcomeAnim.opacity * 0.12 : welcomeBreathe.scale;

  const subtitleAnim = fadeUpIn(frame, {
    start: sceneBeats.subtitle || 12.0,
    dur: 1.2,
    dist: 20,
    ease: 'smooth'
  }, EZ, fps);

  // ========================================
  // ROUGH.JS - Knodovia Map (only if type is roughSVG)
  // ========================================

  useEffect(() => {
    if (heroConfig.type !== 'roughSVG' || !mapSvgRef.current || frame < beats.mapReveal) return;

    const svg = mapSvgRef.current;
    const rc = rough.svg(svg);

    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    const progress = getHeroDrawProgress(frame, {
      mapReveal: sceneBeats.mapReveal || 6.5
    }, 'mapReveal', 1.3, fps);

    // Stylized landmass (Knodovia)
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
      roughness: 0,
      bowing: 0,
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

    // Details
    if (progress > 0.5) {
      const detailProgress = (progress - 0.5) * 2;
      
      const small1 = rc.circle(150, 200, 40 * detailProgress, {
        stroke: colors.accent2,
        strokeWidth: 4,
        roughness: 0,
        bowing: 0,
        fill: `${colors.accent2}12`,
        fillStyle: 'solid',
      });
      svg.appendChild(small1);

      const small2 = rc.circle(480, 180, 30 * detailProgress, {
        stroke: colors.accent2,
        strokeWidth: 4,
        roughness: 0,
        bowing: 0,
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
              roughness: 0,
              bowing: 0,
            });
            svg.appendChild(marker);

            const pinHead = rc.circle(x, y, 12 * locProgress, {
              stroke: colors.accent,
              strokeWidth: 3,
              roughness: 0,
              bowing: 0,
              fill: colors.accent,
              fillStyle: 'solid',
            });
            svg.appendChild(pinHead);
          }
        });
      }
    }

  }, [frame, beats.mapReveal, colors, heroConfig.type]);

  // ========================================
  // DYNAMIC QUESTION RENDERING
  // Uses new questionRenderer system
  // ========================================

  useEffect(() => {
    if (!roughTextSvgRef.current) return;

    const svg = roughTextSvgRef.current;
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // Render question lines dynamically (1-4 lines)
    const lineElements = renderQuestionLines(
      questionConfig.lines,
      questionConfig.layout,
      questionConfig.animation,
      frame,
      {
        questionStart: sceneBeats.questionStart || sceneBeats.questionPart1 || 0.6,
        moveUp: sceneBeats.moveUp || 2.0,
        emphasis: sceneBeats.emphasis || 4.2,
        wipeQuestions: sceneBeats.wipeQuestions || 5.5
      },
      colors,
      fonts,
      EZ,
      fps,
      id
    );

    lineElements.forEach(el => svg.appendChild(el));

    // "Welcome to Knodovia" - ✨ WITH SHIMMER EFFECT
    if (frame >= beats.welcome) {
      const welcomeText = welcomeConfig.text;
      
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
      
      const welcomePos = resolvePosition(welcomeConfig.position || 'center');
      
      const textGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      textGroup.setAttribute('id', id('welcome-group'));
      textGroup.setAttribute('opacity', String(welcomeAnim.opacity));
      textGroup.setAttribute('transform', `translate(0, ${welcomeAnim.translateY}) scale(${welcomeScale})`);
      
      const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      textElement.setAttribute('x', String(welcomePos.x));
      textElement.setAttribute('y', '560');
      textElement.setAttribute('text-anchor', 'middle');
      textElement.setAttribute('font-family', fonts.header);
      textElement.setAttribute('font-size', fonts.size_welcome);
      textElement.setAttribute('font-weight', '700');
      textElement.setAttribute('fill', `url(#${id('welcome-shimmer')})`);
      textElement.textContent = welcomeText;
      
      textGroup.appendChild(textElement);
      svg.appendChild(textGroup);
    }

  }, [frame, beats, colors, questionConfig, fonts, id, welcomeConfig, welcomeAnim, welcomeScale]);

  // ✨ Render liquid blob behind map
  useEffect(() => {
    if (!effectsRef.current || frame < beats.mapReveal - 10) return;
    
    const svg = effectsRef.current;
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }
    
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

  // Resolve subtitle position
  const subtitlePos = resolvePosition(subtitleConfig.position || 'bottom-center');

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
      {/* ✨ Ambient particles layer */}
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
      
      {/* ✨ Effects layer */}
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
      
      {/* Sparkles layer */}
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
        {/* ✨ Sparkles for question lines */}
        {questionConfig.lines.map((line, index) => {
          const lineStartFrame = toFrames((sceneBeats.questionStart || 0.6) + (index * 0.3), fps);
          return frame >= lineStartFrame && frame < lineStartFrame + 50 && sparklesQ[index] ? 
            renderSparkles(sparklesQ[index], frame, lineStartFrame, index === questionConfig.lines.length - 1 ? colors.accent : colors.accent2) : null;
        })}
        
        {/* ✨ Sparkles for welcome text */}
        {frame >= beats.welcome && frame < beats.welcome + 60 &&
          renderSparkles(sparklesWelcome, frame, beats.welcome, '#FFD700')}
      </svg>

      {/* Rough text layer */}
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
        {/* 🎯 HERO ELEMENT (polymorphic - image/svg/roughSVG) */}
        {frame >= beats.mapReveal && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) ${heroAnimation.transform}`,
              width: 640,
              height: 400,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              opacity: heroAnimation.opacity,
            }}
          >
            {heroConfig.type === 'roughSVG' ? (
              <svg
                ref={mapSvgRef}
                style={{ width: '100%', height: '100%' }}
                viewBox="0 0 640 400"
                preserveAspectRatio="xMidYMid meet"
              />
            ) : (
              renderHero(heroConfig, frame, beats, colors, EZ, fps)
            )}
          </div>
        )}

        {/* Subtitle */}
        {frame >= beats.subtitle && (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              bottom: '20%',
              transform: `translateX(-50%) translateY(${subtitleAnim.translateY}px)`,
              maxWidth: 800,
              textAlign: 'center',
              opacity: subtitleAnim.opacity,
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
              {subtitleConfig.text}
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
// BLUEPRINT V5.1 - REQUIRED EXPORTS
// ========================================

export { Hook1AQuestionBurst_Agnostic };

export const TEMPLATE_ID = 'Hook1AQuestionBurst_Agnostic';
export const TEMPLATE_VERSION = '5.1.0';

export const getDuration = (scene, fps) => {
  const tailPadding = 0.5;
  return toFrames((scene.beats?.exit || 15.0) + tailPadding, fps);
};

export const DURATION_MIN_FRAMES = 450;
export const DURATION_MAX_FRAMES = 540;

export const SUPPORTED_MODES = ['notebook', 'whiteboard'];

export const CAPABILITIES = {
  usesSVG: true,
  usesLottie: false,
  usesRoughJS: true,
  requiresAudio: false,
  supportsTransitions: true,
  // 🎯 New capabilities
  supportsHeroPolymorphism: true,
  supportsDynamicLineCount: true,
  supportsPositionTokens: true,
  backwardCompatible: true
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

// Agnostic Template Metadata
export const AGNOSTIC_FEATURES = {
  heroTypes: ['image', 'svg', 'roughSVG', 'lottie', 'custom'],
  questionLines: { min: 1, max: 4, recommended: 2 },
  positioningSystem: '9-point-grid',
  crossDomainTested: ['geography', 'sports', 'science', 'business']
};
