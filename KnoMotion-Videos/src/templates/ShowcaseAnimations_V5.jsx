import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import { THEME } from '../utils/theme';

// Blueprint v5.0 imports + ALL Creative Magic
import { 
  fadeUpIn,
  popInSpring,
  pulseEmphasis,
  shrinkToCorner,
  EZ,
  useSceneId,
  toFrames,
  // ✨ ALL Creative Magic Effects
  generateAmbientParticles,
  renderAmbientParticles,
  generateConfettiBurst,
  renderConfettiBurst,
  generateSparkles,
  renderSparkles,
  generateFloatingShapes,
  renderFloatingShapes,
  getGlowEffect,
  getShimmerEffect,
  getKineticText,
  getHighlightSwipe,
  getCircleDrawOn,
  getLiquidBlob,
  getTypewriterProgress,
  getBouncyLetters
} from '../sdk';

/**
 * SHOWCASE: ANIMATION EFFECTS - Blueprint v5.0 + ✨ CREATIVE MAGIC V6
 * 
 * PURPOSE:
 * Demonstrates ALL creative effects available in the system
 * - Reference for developers
 * - Demo for stakeholders
 * - Testing all effects work correctly
 * - Documentation purposes
 * 
 * EFFECTS DEMONSTRATED:
 * Section 1: Particle Systems (0-15s)
 *   • Ambient particles
 *   • Confetti bursts
 *   • Sparkles
 *   • Floating shapes
 * 
 * Section 2: Text Effects (15-30s)
 *   • Glow effect
 *   • Shimmer effect
 *   • Kinetic text (wave, scatter, orbit)
 *   • Typewriter
 *   • Bouncy letters
 * 
 * Section 3: Draw-On Effects (30-45s)
 *   • Highlight swipe
 *   • Circle draw-on
 *   • Underline draw-on
 * 
 * Section 4: Advanced Effects (45-60s)
 *   • Liquid blobs
 *   • Combined effects showcase
 * 
 * Duration: 60s (comprehensive showcase)
 */

const ShowcaseAnimations = ({ scene, styles, presets, easingMap, transitions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const id = useSceneId();
  
  const svgRef = useRef(null);
  const particlesRef = useRef(null);
  const effectsRef = useRef(null);
  const liquidRef = useRef(null);
  
  // Colors for showcase
  const colors = {
    bg: '#FAFBFC',
    primary: '#FF6B35',
    secondary: '#9B59B6',
    tertiary: '#2E7FE4',
    success: '#27AE60',
    ink: '#1A1A1A',
  };
  
  // Beats for sections (in seconds)
  const beats = {
    // Section 1: Particles (0-15s)
    intro: toFrames(0, fps),
    ambientParticles: toFrames(1, fps),
    sparkles: toFrames(4, fps),
    confetti: toFrames(7, fps),
    floatingShapes: toFrames(10, fps),
    
    // Section 2: Text Effects (15-30s)
    textSection: toFrames(15, fps),
    glow: toFrames(16, fps),
    shimmer: toFrames(19, fps),
    kineticWave: toFrames(22, fps),
    kineticScatter: toFrames(25, fps),
    typewriter: toFrames(28, fps),
    
    // Section 3: Draw-On (30-45s)
    drawSection: toFrames(30, fps),
    highlight: toFrames(31, fps),
    circle: toFrames(35, fps),
    underline: toFrames(39, fps),
    
    // Section 4: Advanced (45-60s)
    advancedSection: toFrames(45, fps),
    liquidBlob: toFrames(46, fps),
    combined: toFrames(50, fps),
    finale: toFrames(55, fps),
  };
  
  // Generate all particles
  const ambientParticles = React.useMemo(
    () => generateAmbientParticles(20, 100, 1920, 1080),
    []
  );
  
  const confettiBurst = React.useMemo(
    () => generateConfettiBurst(30, 960, 540, 200),
    []
  );
  
  const sparkles1 = React.useMemo(
    () => generateSparkles(10, { x: 660, y: 200, width: 600, height: 100 }, 300),
    []
  );
  
  const sparkles2 = React.useMemo(
    () => generateSparkles(8, { x: 760, y: 400, width: 400, height: 100 }, 400),
    []
  );
  
  const floatingShapes = React.useMemo(
    () => generateFloatingShapes(6, 500, 1920, 1080),
    []
  );
  
  // Current section indicator
  const getCurrentSection = () => {
    if (frame < beats.textSection) return 1;
    if (frame < beats.drawSection) return 2;
    if (frame < beats.advancedSection) return 3;
    return 4;
  };
  
  // Section title animations
  const section1Title = fadeUpIn(frame, { start: 0.5, dur: 1.0, dist: 40, ease: 'smooth' }, EZ, fps);
  const section2Title = fadeUpIn(frame, { start: 15.5, dur: 1.0, dist: 40, ease: 'smooth' }, EZ, fps);
  const section3Title = fadeUpIn(frame, { start: 30.5, dur: 1.0, dist: 40, ease: 'smooth' }, EZ, fps);
  const section4Title = fadeUpIn(frame, { start: 45.5, dur: 1.0, dist: 40, ease: 'smooth' }, EZ, fps);
  
  // Text effects
  const glowEffect = getGlowEffect(frame, {
    intensity: 10,
    color: colors.primary,
    pulse: frame >= beats.glow,
    pulseSpeed: 0.05,
  });
  
  const shimmerEffect = getShimmerEffect(frame - beats.shimmer, {
    speed: 0.03,
    width: 150,
    angle: 45,
    intensity: 0.4,
  });
  
  const kineticWave = getKineticText(frame, {
    start: 22,
    text: 'Wave Motion',
    splitBy: 'word',
    effect: 'wave',
    amplitude: 12,
    frequency: 0.1,
  }, fps);
  
  const kineticScatter = getKineticText(frame, {
    start: 25,
    text: 'Scatter Effect',
    splitBy: 'word',
    effect: 'scatter',
    amplitude: 20,
    frequency: 0.1,
  }, fps);
  
  const typewriter = getTypewriterProgress(frame, {
    start: 28,
    charDelay: 0.05,
    text: 'Typewriter reveals character by character...',
    initialDelay: 0,
  }, fps);
  
  // Draw-on effects
  const highlightSwipe = getHighlightSwipe(frame, {
    start: 31,
    duration: 1.0,
    textBounds: { x: 460, y: 480, width: 1000, height: 50 },
    color: '#FFD70030',
    ease: 'smooth',
  }, fps);
  
  const circleDrawOn = getCircleDrawOn(frame, {
    start: 35,
    duration: 1.0,
    textBounds: { x: 760, y: 520, width: 400, height: 60 },
    padding: 20,
    type: 'circle',
    ease: 'smooth',
  }, fps);
  
  const underlineDrawOn = getCircleDrawOn(frame, {
    start: 39,
    duration: 0.8,
    textBounds: { x: 660, y: 540, width: 600, height: 40 },
    padding: 0,
    type: 'underline',
    ease: 'smooth',
  }, fps);
  
  // Liquid blob
  const liquidBlob = getLiquidBlob(frame, {
    centerX: 960,
    centerY: 540,
    baseRadius: 150,
    points: 8,
    wobbleAmount: 0.2,
    speed: 0.02,
    seed: 600,
  });
  
  // Render liquid blobs
  useEffect(() => {
    if (!liquidRef.current || frame < beats.liquidBlob) return;
    
    const svg = liquidRef.current;
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }
    
    if (frame >= beats.liquidBlob && frame < beats.combined) {
      const blobPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      blobPath.setAttribute('d', liquidBlob.path);
      blobPath.setAttribute('fill', colors.secondary);
      blobPath.setAttribute('opacity', '0.15');
      
      svg.appendChild(blobPath);
    }
  }, [frame, beats, liquidBlob.path, colors.secondary]);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      {/* ===== SECTION 1: PARTICLES ===== */}
      
      {/* Ambient particles (always visible in section 1) */}
      {frame >= beats.ambientParticles && frame < beats.textSection && (
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
          {renderAmbientParticles(ambientParticles, frame, fps, [colors.primary, colors.secondary, colors.tertiary]).map(p => p.element)}
        </svg>
      )}
      
      {/* Floating shapes */}
      {frame >= beats.floatingShapes && frame < beats.textSection && (
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            opacity: 0.3,
          }}
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid meet"
        >
          {renderFloatingShapes(floatingShapes, frame, [colors.primary, colors.secondary, colors.tertiary])}
        </svg>
      )}
      
      {/* Effects layer (sparkles, confetti, draw-ons) */}
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
        {/* Sparkles */}
        {frame >= beats.sparkles && frame < beats.sparkles + 60 &&
          renderSparkles(sparkles1, frame, beats.sparkles, colors.primary)}
        
        {frame >= beats.sparkles + 30 && frame < beats.sparkles + 90 &&
          renderSparkles(sparkles2, frame, beats.sparkles + 30, colors.tertiary)}
        
        {/* Confetti burst */}
        {frame >= beats.confetti && frame < beats.confetti + 90 &&
          renderConfettiBurst(confettiBurst, frame, beats.confetti, [colors.primary, colors.secondary, colors.tertiary, colors.success, '#F39C12'])}
        
        {/* Highlight swipe */}
        {highlightSwipe.visible && (
          <rect
            x={highlightSwipe.x}
            y={highlightSwipe.y}
            width={highlightSwipe.width}
            height={highlightSwipe.height}
            fill={highlightSwipe.color}
            opacity={highlightSwipe.opacity}
            rx={8}
          />
        )}
        
        {/* Circle draw-on */}
        {circleDrawOn.visible && circleDrawOn.type === 'ellipse' && (
          <ellipse
            cx={circleDrawOn.cx}
            cy={circleDrawOn.cy}
            rx={circleDrawOn.rx}
            ry={circleDrawOn.ry}
            fill="none"
            stroke={colors.primary}
            strokeWidth={4}
            strokeDasharray={circleDrawOn.strokeDasharray}
            strokeDashoffset={circleDrawOn.strokeDashoffset}
          />
        )}
        
        {/* Underline draw-on */}
        {underlineDrawOn.visible && underlineDrawOn.type === 'line' && (
          <line
            x1={underlineDrawOn.x1}
            y1={underlineDrawOn.y1}
            x2={underlineDrawOn.x2}
            y2={underlineDrawOn.y2}
            stroke={colors.tertiary}
            strokeWidth={4}
            strokeLinecap="round"
          />
        )}
      </svg>
      
      {/* Liquid blob layer */}
      <svg
        ref={liquidRef}
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
      <AbsoluteFill style={{ padding: '80px 120px' }}>
        {/* Main title */}
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h1
            style={{
              fontFamily: THEME.fonts.marker.primary,
              fontSize: 72,
              color: colors.ink,
              margin: 0,
            }}
          >
            ✨ Animation Effects Showcase
          </h1>
          <p
            style={{
              fontFamily: THEME.fonts.structure.primary,
              fontSize: 24,
              color: `${colors.ink}80`,
              margin: '12px 0 0 0',
            }}
          >
            All creative magic effects in one place
          </p>
        </div>
        
        {/* SECTION 1: PARTICLES */}
        {frame >= beats.intro && frame < beats.textSection && (
          <div style={{ opacity: section1Title.opacity, transform: `translateY(${section1Title.translateY}px)` }}>
            <h2
              style={{
                fontFamily: THEME.fonts.marker.primary,
                fontSize: 48,
                color: colors.primary,
                textAlign: 'center',
                marginBottom: 40,
              }}
            >
              Section 1: Particle Systems
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 30, maxWidth: 800, margin: '0 auto' }}>
              {frame >= beats.ambientParticles && (
                <div style={{ 
                  padding: 20,
                  background: `${colors.primary}10`,
                  borderRadius: 12,
                  opacity: interpolate(frame, [beats.ambientParticles, beats.ambientParticles + 20], [0, 1], { extrapolateRight: 'clamp' })
                }}>
                  <p style={{ fontFamily: THEME.fonts.structure.primary, fontSize: 20, margin: 0, color: colors.ink }}>
                    <strong>Ambient Particles</strong> - Floating elements that add depth and atmosphere
                  </p>
                </div>
              )}
              
              {frame >= beats.sparkles && (
                <div style={{ 
                  padding: 20,
                  background: `${colors.tertiary}10`,
                  borderRadius: 12,
                  opacity: interpolate(frame, [beats.sparkles, beats.sparkles + 20], [0, 1], { extrapolateRight: 'clamp' })
                }}>
                  <p style={{ fontFamily: THEME.fonts.structure.primary, fontSize: 20, margin: 0, color: colors.ink }}>
                    <strong>Sparkles</strong> - Twinkling stars for emphasis and magic moments
                  </p>
                </div>
              )}
              
              {frame >= beats.confetti && (
                <div style={{ 
                  padding: 20,
                  background: `${colors.success}10`,
                  borderRadius: 12,
                  opacity: interpolate(frame, [beats.confetti, beats.confetti + 20], [0, 1], { extrapolateRight: 'clamp' })
                }}>
                  <p style={{ fontFamily: THEME.fonts.structure.primary, fontSize: 20, margin: 0, color: colors.ink }}>
                    <strong>Confetti Burst</strong> - Physics-based celebration particles
                  </p>
                </div>
              )}
              
              {frame >= beats.floatingShapes && (
                <div style={{ 
                  padding: 20,
                  background: `${colors.secondary}10`,
                  borderRadius: 12,
                  opacity: interpolate(frame, [beats.floatingShapes, beats.floatingShapes + 20], [0, 1], { extrapolateRight: 'clamp' })
                }}>
                  <p style={{ fontFamily: THEME.fonts.structure.primary, fontSize: 20, margin: 0, color: colors.ink }}>
                    <strong>Floating Shapes</strong> - Organic blobs and shapes for background motion
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* SECTION 2: TEXT EFFECTS */}
        {frame >= beats.textSection && frame < beats.drawSection && (
          <div style={{ opacity: section2Title.opacity, transform: `translateY(${section2Title.translateY}px)` }}>
            <h2
              style={{
                fontFamily: THEME.fonts.marker.primary,
                fontSize: 48,
                color: colors.secondary,
                textAlign: 'center',
                marginBottom: 60,
              }}
            >
              Section 2: Text Effects
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 50, alignItems: 'center' }}>
              {frame >= beats.glow && (
                <div style={{ textAlign: 'center' }}>
                  <h3
                    style={{
                      fontFamily: THEME.fonts.marker.primary,
                      fontSize: 42,
                      color: colors.primary,
                      margin: '0 0 8px 0',
                      filter: glowEffect.filter,
                    }}
                  >
                    Glow Effect
                  </h3>
                  <p style={{ fontFamily: THEME.fonts.structure.primary, fontSize: 18, color: `${colors.ink}70`, margin: 0 }}>
                    Pulsing glow for emphasis
                  </p>
                </div>
              )}
              
              {frame >= beats.shimmer && (
                <div style={{ textAlign: 'center' }}>
                  <h3
                    style={{
                      fontFamily: THEME.fonts.marker.primary,
                      fontSize: 42,
                      color: colors.tertiary,
                      margin: '0 0 8px 0',
                    }}
                  >
                    <span style={{
                      background: `linear-gradient(90deg, 
                        ${colors.tertiary} ${shimmerEffect.gradientStart}%, 
                        #FFD700 ${shimmerEffect.position}%, 
                        ${colors.tertiary} ${shimmerEffect.gradientEnd}%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}>
                      Shimmer Effect
                    </span>
                  </h3>
                  <p style={{ fontFamily: THEME.fonts.structure.primary, fontSize: 18, color: `${colors.ink}70`, margin: 0 }}>
                    Sweeping shine across text
                  </p>
                </div>
              )}
              
              {frame >= beats.kineticWave && kineticWave.isActive && (
                <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                  {kineticWave.segments.map((seg, i) => (
                    <h3
                      key={i}
                      style={{
                        fontFamily: THEME.fonts.marker.primary,
                        fontSize: 42,
                        color: colors.success,
                        margin: 0,
                        transform: `translateY(${seg.translateY}px) scale(${seg.scale})`,
                        opacity: seg.opacity,
                      }}
                    >
                      {seg.text}
                    </h3>
                  ))}
                </div>
              )}
              
              {frame >= beats.typewriter && typewriter.visibleChars > 0 && (
                <div style={{ textAlign: 'center' }}>
                  <p
                    style={{
                      fontFamily: THEME.fonts.structure.primary,
                      fontSize: 32,
                      color: colors.ink,
                      margin: 0,
                      maxWidth: 700,
                    }}
                  >
                    {typewriter.text.substring(0, typewriter.visibleChars)}
                    {!typewriter.isComplete && <span style={{ opacity: Math.sin(frame * 0.3) * 0.5 + 0.5 }}>|</span>}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* SECTION 3: DRAW-ON EFFECTS */}
        {frame >= beats.drawSection && frame < beats.advancedSection && (
          <div style={{ opacity: section3Title.opacity, transform: `translateY(${section3Title.translateY}px)` }}>
            <h2
              style={{
                fontFamily: THEME.fonts.marker.primary,
                fontSize: 48,
                color: colors.tertiary,
                textAlign: 'center',
                marginBottom: 80,
              }}
            >
              Section 3: Draw-On Effects
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 80, alignItems: 'center' }}>
              {frame >= beats.highlight && (
                <div style={{ textAlign: 'center', position: 'relative' }}>
                  <h3
                    style={{
                      fontFamily: THEME.fonts.marker.primary,
                      fontSize: 36,
                      color: colors.ink,
                      margin: 0,
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    Highlight Swipe - marker style emphasis
                  </h3>
                </div>
              )}
              
              {frame >= beats.circle && (
                <div style={{ textAlign: 'center' }}>
                  <h3
                    style={{
                      fontFamily: THEME.fonts.marker.primary,
                      fontSize: 36,
                      color: colors.ink,
                      margin: 0,
                    }}
                  >
                    Circle Draw-On
                  </h3>
                </div>
              )}
              
              {frame >= beats.underline && (
                <div style={{ textAlign: 'center' }}>
                  <h3
                    style={{
                      fontFamily: THEME.fonts.marker.primary,
                      fontSize: 36,
                      color: colors.ink,
                      margin: 0,
                    }}
                  >
                    Underline Draw-On
                  </h3>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* SECTION 4: ADVANCED EFFECTS */}
        {frame >= beats.advancedSection && (
          <div style={{ opacity: section4Title.opacity, transform: `translateY(${section4Title.translateY}px)` }}>
            <h2
              style={{
                fontFamily: THEME.fonts.marker.primary,
                fontSize: 48,
                color: colors.secondary,
                textAlign: 'center',
                marginBottom: 60,
              }}
            >
              Section 4: Advanced Effects
            </h2>
            
            <div style={{ textAlign: 'center' }}>
              {frame >= beats.liquidBlob && frame < beats.combined && (
                <div>
                  <h3
                    style={{
                      fontFamily: THEME.fonts.marker.primary,
                      fontSize: 36,
                      color: colors.ink,
                      margin: '0 0 16px 0',
                    }}
                  >
                    Liquid Blobs
                  </h3>
                  <p style={{ fontFamily: THEME.fonts.structure.primary, fontSize: 20, color: `${colors.ink}70`, margin: 0 }}>
                    Organic, flowing background elements
                  </p>
                </div>
              )}
              
              {frame >= beats.combined && (
                <div>
                  <h3
                    style={{
                      fontFamily: THEME.fonts.marker.primary,
                      fontSize: 48,
                      color: colors.primary,
                      margin: '0 0 24px 0',
                      filter: getGlowEffect(frame, { intensity: 12, color: colors.primary, pulse: true, pulseSpeed: 0.06 }).filter,
                    }}
                  >
                    All Effects Combined!
                  </h3>
                  <p style={{ fontFamily: THEME.fonts.structure.primary, fontSize: 24, color: colors.ink, margin: 0, maxWidth: 700, marginLeft: 'auto', marginRight: 'auto' }}>
                    Mix and match effects to create stunning, unique videos that would be impossible in a simple editor
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ========================================
// BLUEPRINT V5.0 - REQUIRED EXPORTS
// ========================================

export { ShowcaseAnimations };

export const TEMPLATE_ID = 'ShowcaseAnimations';
export const TEMPLATE_VERSION = '5.0.0';

export const getDuration = (scene, fps) => {
  return toFrames(60, fps); // 60 seconds
};

export const DURATION_MIN_FRAMES = 1800;  // 60s @ 30fps
export const DURATION_MAX_FRAMES = 1800;  // 60s @ 30fps

export const SUPPORTED_MODES = ['notebook', 'whiteboard'];

export const CAPABILITIES = {
  usesSVG: true,
  usesLottie: false,
  usesRoughJS: false,
  requiresAudio: false,
  supportsTransitions: true,
  isShowcase: true  // Special flag
};

export const PRESETS_REQUIRED = [
  'fadeUpIn',
  'popInSpring',
  'pulseEmphasis',
  'shrinkToCorner'
];

export const getPosterFrame = (scene, fps) => {
  return toFrames(30, fps); // Middle of showcase
};
