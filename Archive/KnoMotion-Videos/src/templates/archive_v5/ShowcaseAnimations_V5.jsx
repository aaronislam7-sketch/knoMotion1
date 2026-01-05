import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import { annotate } from 'rough-notation';
import { THEME } from '../../utils/theme';

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
  getLiquidBlob,
  getTypewriterProgress,
  getBouncyLetters
} from '../../sdk';

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
    // Section 1: Particles (0-12s)
    intro: toFrames(0, fps),
    ambientParticles: toFrames(1, fps),
    sparkles: toFrames(4, fps),
    confetti: toFrames(7, fps),
    floatingShapes: toFrames(10, fps),
    
    // Section 2: Text Effects (12-24s)
    textSection: toFrames(12, fps),
    glow: toFrames(13, fps),
    shimmer: toFrames(16, fps),
    kineticWave: toFrames(19, fps),
    typewriter: toFrames(22, fps),
    
    // Section 3: Draw-On (24-36s)
    drawSection: toFrames(24, fps),
    highlight: toFrames(25, fps),
    circle: toFrames(29, fps),
    underline: toFrames(33, fps),
    
    // Section 4: Lottie Animations (36-48s)
    lottieSection: toFrames(36, fps),
    lottieCheckmark: toFrames(37, fps),
    lottieSparkle: toFrames(40, fps),
    lottieLightbulb: toFrames(43, fps),
    lottieCelebration: toFrames(46, fps),
    
    // Section 5: Combined Effects (48-72s)
    combinedsSection: toFrames(48, fps),
    combo1: toFrames(49, fps),
    combo2: toFrames(55, fps),
    combo3: toFrames(61, fps),
    combo4: toFrames(67, fps),
    finale: toFrames(70, fps),
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
  const section2Title = fadeUpIn(frame, { start: 12.5, dur: 1.0, dist: 40, ease: 'smooth' }, EZ, fps);
  const section3Title = fadeUpIn(frame, { start: 24.5, dur: 1.0, dist: 40, ease: 'smooth' }, EZ, fps);
  const section4Title = fadeUpIn(frame, { start: 36.5, dur: 1.0, dist: 40, ease: 'smooth' }, EZ, fps);
  const section5Title = fadeUpIn(frame, { start: 48.5, dur: 1.0, dist: 40, ease: 'smooth' }, EZ, fps);
  
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
  
  // Lottie animation timings
  const showCheckmark = frame >= beats.lottieCheckmark && frame < beats.lottieSparkle;
  const showSparkle = frame >= beats.lottieSparkle && frame < beats.lottieLightbulb;
  const showLightbulb = frame >= beats.lottieLightbulb && frame < beats.lottieCelebration;
  const showCelebration = frame >= beats.lottieCelebration && frame < beats.combinedsSection;
  
  // Refs for rough-notation annotations
  const highlightRef = useRef(null);
  const circleRef = useRef(null);
  const underlineRef = useRef(null);
  const annotationsRef = useRef({ highlight: null, circle: null, underline: null });
  
  const typewriterText = 'Typewriter reveals character by character...';
  const typewriter = getTypewriterProgress(frame, {
    start: 28,
    charDelay: 0.05,
    text: typewriterText,
    initialDelay: 0,
  }, fps);
  
  // Rough-notation annotations - handle draw-on effects
  useEffect(() => {
    const highlightStart = toFrames(25, fps);
    const highlightEnd = toFrames(29, fps);
    const circleStart = toFrames(29, fps);
    const circleEnd = toFrames(33, fps);
    const underlineStart = toFrames(33, fps);
    const underlineEnd = toFrames(37, fps);
    
    // Highlight annotation
    if (frame >= highlightStart && frame < highlightEnd && highlightRef.current && !annotationsRef.current.highlight) {
      const annotation = annotate(highlightRef.current, {
        type: 'highlight',
        color: '#FFD700',
        iterations: 1,
        animationDuration: 600,
      });
      annotation.show();
      annotationsRef.current.highlight = annotation;
    } else if (frame >= highlightEnd && annotationsRef.current.highlight) {
      annotationsRef.current.highlight.hide();
      annotationsRef.current.highlight = null;
    }
    
    // Circle annotation
    if (frame >= circleStart && frame < circleEnd && circleRef.current && !annotationsRef.current.circle) {
      const annotation = annotate(circleRef.current, {
        type: 'circle',
        color: '#E74C3C',
        iterations: 1,
        animationDuration: 600,
        padding: 20,
      });
      annotation.show();
      annotationsRef.current.circle = annotation;
    } else if (frame >= circleEnd && annotationsRef.current.circle) {
      annotationsRef.current.circle.hide();
      annotationsRef.current.circle = null;
    }
    
    // Underline annotation
    if (frame >= underlineStart && frame < underlineEnd && underlineRef.current && !annotationsRef.current.underline) {
      const annotation = annotate(underlineRef.current, {
        type: 'underline',
        color: '#3498DB',
        iterations: 1,
        animationDuration: 500,
        padding: 5,
      });
      annotation.show();
      annotationsRef.current.underline = annotation;
    } else if (frame >= underlineEnd && annotationsRef.current.underline) {
      annotationsRef.current.underline.hide();
      annotationsRef.current.underline = null;
    }
    
    // Cleanup on unmount
    return () => {
      if (annotationsRef.current.highlight) annotationsRef.current.highlight.remove();
      if (annotationsRef.current.circle) annotationsRef.current.circle.remove();
      if (annotationsRef.current.underline) annotationsRef.current.underline.remove();
    };
  }, [frame, fps]);
  
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
        {/* Sparkles - Section 1 */}
        {frame >= beats.sparkles && frame < beats.sparkles + 60 &&
          renderSparkles(sparkles1, frame, beats.sparkles, colors.primary)}
        
        {frame >= beats.sparkles + 30 && frame < beats.sparkles + 90 &&
          renderSparkles(sparkles2, frame, beats.sparkles + 30, colors.tertiary)}
        
        {/* Sparkles - Combo 1 */}
        {frame >= beats.combo1 + 20 && frame < beats.combo1 + 80 &&
          renderSparkles(sparkles1, frame, beats.combo1 + 20, colors.primary)}
        
        {/* Sparkles - Finale */}
        {frame >= beats.combo4 + 40 && frame < beats.combo4 + 100 &&
          renderSparkles(sparkles2, frame, beats.combo4 + 40, '#FFD700')}
        
        {/* Confetti burst - Section 1 */}
        {frame >= beats.confetti && frame < beats.confetti + 90 &&
          renderConfettiBurst(confettiBurst, frame, beats.confetti, [colors.primary, colors.secondary, colors.tertiary, colors.success, '#F39C12'])}
        
        {/* Confetti burst - Combo 3 */}
        {frame >= beats.combo3 && frame < beats.combo3 + 90 &&
          renderConfettiBurst(confettiBurst, frame, beats.combo3, [colors.success, colors.primary, '#FFD700'])}
        
        {/* Confetti burst - Finale */}
        {frame >= beats.combo4 + 30 && frame < beats.combo4 + 120 &&
          renderConfettiBurst(confettiBurst, frame, beats.combo4 + 30, [colors.primary, colors.secondary, colors.tertiary, colors.success, '#F39C12'])}
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
                      backgroundImage: `linear-gradient(90deg, 
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
                    {typewriterText.substring(0, typewriter.visibleChars)}
                    {!typewriter.isComplete && <span style={{ opacity: Math.sin(frame * 0.3) * 0.5 + 0.5 }}>|</span>}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* SECTION 3: DRAW-ON EFFECTS */}
        {frame >= beats.drawSection && frame < beats.lottieSection && (
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
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 100, alignItems: 'center', justifyContent: 'center', minHeight: 500 }}>
              {frame >= beats.highlight && (
                <div style={{ textAlign: 'center', position: 'relative' }}>
                  <h3
                    ref={highlightRef}
                    style={{
                      fontFamily: THEME.fonts.marker.primary,
                      fontSize: 40,
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
                    ref={circleRef}
                    style={{
                      fontFamily: THEME.fonts.marker.primary,
                      fontSize: 40,
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
                    ref={underlineRef}
                    style={{
                      fontFamily: THEME.fonts.marker.primary,
                      fontSize: 40,
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
        
        {/* SECTION 4: LOTTIE ANIMATIONS */}
        {frame >= beats.lottieSection && frame < beats.combinedsSection && (
          <div style={{ opacity: section4Title.opacity, transform: `translateY(${section4Title.translateY}px)` }}>
            <h2
              style={{
                fontFamily: THEME.fonts.marker.primary,
                fontSize: 48,
                color: colors.success,
                textAlign: 'center',
                marginBottom: 60,
              }}
            >
              Section 4: Lottie Microdelights
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, maxWidth: 1000, margin: '0 auto' }}>
              {/* Checkmark */}
              {showCheckmark && (
                <div style={{ 
                  textAlign: 'center',
                  opacity: interpolate(frame, [beats.lottieCheckmark, beats.lottieCheckmark + 20], [0, 1], { extrapolateRight: 'clamp' })
                }}>
                  <div style={{ fontSize: 80, marginBottom: 16 }}>✓</div>
                  <p style={{ fontFamily: THEME.fonts.structure.primary, fontSize: 20, color: colors.ink, margin: 0, fontWeight: 'bold' }}>
                    Checkmark
                  </p>
                  <p style={{ fontFamily: THEME.fonts.structure.primary, fontSize: 16, color: `${colors.ink}70`, margin: '8px 0 0 0' }}>
                    Success indicators
                  </p>
                </div>
              )}
              
              {/* Sparkle */}
              {showSparkle && (
                <div style={{ 
                  textAlign: 'center',
                  opacity: interpolate(frame, [beats.lottieSparkle, beats.lottieSparkle + 20], [0, 1], { extrapolateRight: 'clamp' })
                }}>
                  <div style={{ fontSize: 80, marginBottom: 16 }}>✨</div>
                  <p style={{ fontFamily: THEME.fonts.structure.primary, fontSize: 20, color: colors.ink, margin: 0, fontWeight: 'bold' }}>
                    Sparkle
                  </p>
                  <p style={{ fontFamily: THEME.fonts.structure.primary, fontSize: 16, color: `${colors.ink}70`, margin: '8px 0 0 0' }}>
                    Emphasis bursts
                  </p>
                </div>
              )}
              
              {/* Lightbulb */}
              {showLightbulb && (
                <div style={{ 
                  textAlign: 'center',
                  opacity: interpolate(frame, [beats.lottieLightbulb, beats.lottieLightbulb + 20], [0, 1], { extrapolateRight: 'clamp' })
                }}>
                  <div style={{ fontSize: 80, marginBottom: 16 }}>💡</div>
                  <p style={{ fontFamily: THEME.fonts.structure.primary, fontSize: 20, color: colors.ink, margin: 0, fontWeight: 'bold' }}>
                    Lightbulb
                  </p>
                  <p style={{ fontFamily: THEME.fonts.structure.primary, fontSize: 16, color: `${colors.ink}70`, margin: '8px 0 0 0' }}>
                    Aha moments
                  </p>
                </div>
              )}
              
              {/* Celebration */}
              {showCelebration && (
                <div style={{ 
                  textAlign: 'center',
                  opacity: interpolate(frame, [beats.lottieCelebration, beats.lottieCelebration + 20], [0, 1], { extrapolateRight: 'clamp' })
                }}>
                  <div style={{ fontSize: 80, marginBottom: 16 }}>🎉</div>
                  <p style={{ fontFamily: THEME.fonts.structure.primary, fontSize: 20, color: colors.ink, margin: 0, fontWeight: 'bold' }}>
                    Celebration
                  </p>
                  <p style={{ fontFamily: THEME.fonts.structure.primary, fontSize: 16, color: `${colors.ink}70`, margin: '8px 0 0 0' }}>
                    Success moments
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* SECTION 5: COMBINED EFFECTS */}
        {frame >= beats.combinedsSection && (
          <div style={{ opacity: section5Title.opacity, transform: `translateY(${section5Title.translateY}px)` }}>
            <h2
              style={{
                fontFamily: THEME.fonts.marker.primary,
                fontSize: 48,
                color: colors.secondary,
                textAlign: 'center',
                marginBottom: 60,
              }}
            >
              Section 5: Combined Effects
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 80, alignItems: 'center' }}>
              {/* Combo 1: Glow + Sparkles */}
              {frame >= beats.combo1 && frame < beats.combo2 && (
                <div style={{ 
                  textAlign: 'center',
                  opacity: interpolate(frame, [beats.combo1, beats.combo1 + 30], [0, 1], { extrapolateRight: 'clamp' })
                }}>
                  <h3
                    style={{
                      fontFamily: THEME.fonts.marker.primary,
                      fontSize: 52,
                      color: colors.primary,
                      margin: '0 0 16px 0',
                      filter: getGlowEffect(frame, { intensity: 15, color: colors.primary, pulse: true, pulseSpeed: 0.08 }).filter,
                    }}
                  >
                    Combo 1: Glow + Sparkles
                  </h3>
                  <p style={{ fontFamily: THEME.fonts.structure.primary, fontSize: 20, color: `${colors.ink}80`, margin: 0 }}>
                    Perfect for hero moments and reveals
                  </p>
                </div>
              )}
              
              {/* Combo 2: Kinetic Text + Particles */}
              {frame >= beats.combo2 && frame < beats.combo3 && (
                <div style={{ 
                  textAlign: 'center',
                  opacity: interpolate(frame, [beats.combo2, beats.combo2 + 30], [0, 1], { extrapolateRight: 'clamp' })
                }}>
                  {kineticWave.isActive && (
                    <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 16 }}>
                      {kineticWave.segments.map((seg, i) => (
                        <h3
                          key={i}
                          style={{
                            fontFamily: THEME.fonts.marker.primary,
                            fontSize: 52,
                            color: colors.secondary,
                            margin: 0,
                            transform: `translateY(${seg.translateY}px)`,
                          }}
                        >
                          {seg.text}
                        </h3>
                      ))}
                    </div>
                  )}
                  <p style={{ fontFamily: THEME.fonts.structure.primary, fontSize: 20, color: `${colors.ink}80`, margin: 0 }}>
                    Great for energetic, playful content
                  </p>
                </div>
              )}
              
              {/* Combo 3: Confetti + Glow + Checkmark */}
              {frame >= beats.combo3 && frame < beats.combo4 && (
                <div style={{ 
                  textAlign: 'center',
                  position: 'relative',
                  opacity: interpolate(frame, [beats.combo3, beats.combo3 + 30], [0, 1], { extrapolateRight: 'clamp' })
                }}>
                  <h3
                    style={{
                      fontFamily: THEME.fonts.marker.primary,
                      fontSize: 52,
                      color: colors.success,
                      margin: '0 0 16px 0',
                      filter: getGlowEffect(frame, { intensity: 12, color: colors.success, pulse: true, pulseSpeed: 0.07 }).filter,
                    }}
                  >
                    Combo 3: Success Pack ✓
                  </h3>
                  <p style={{ fontFamily: THEME.fonts.structure.primary, fontSize: 20, color: `${colors.ink}80`, margin: 0 }}>
                    Perfect for quiz reveals and achievements
                  </p>
                </div>
              )}
              
              {/* Combo 4: Everything! */}
              {frame >= beats.combo4 && (
                <div style={{ 
                  textAlign: 'center',
                  opacity: interpolate(frame, [beats.combo4, beats.combo4 + 30], [0, 1], { extrapolateRight: 'clamp' })
                }}>
                  <h3
                    style={{
                      fontFamily: THEME.fonts.marker.primary,
                      fontSize: 56,
                      color: colors.primary,
                      margin: '0 0 20px 0',
                      filter: getGlowEffect(frame, { intensity: 18, color: colors.primary, pulse: true, pulseSpeed: 0.09 }).filter,
                    }}
                  >
                    🎉 The Full Magic! 🎉
                  </h3>
                  <p style={{ fontFamily: THEME.fonts.structure.primary, fontSize: 22, color: colors.ink, margin: 0, maxWidth: 800, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
                    Combine particles, sparkles, glows, and animations to create premium videos that would take hours in traditional editors
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
  return toFrames(72, fps); // 72 seconds
};

export const DURATION_MIN_FRAMES = 2160;  // 72s @ 30fps
export const DURATION_MAX_FRAMES = 2160;  // 72s @ 30fps

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
