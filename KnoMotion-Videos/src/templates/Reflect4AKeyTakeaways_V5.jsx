import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import { THEME } from '../utils/theme';
import rough from 'roughjs/bundled/rough.esm.js';

// Blueprint v5.0 imports
import { 
  fadeUpIn, 
  pulseEmphasis,
  EZ,
  useSceneId,
  toFrames 
} from '../sdk';

/**
 * REFLECT 4A: KEY TAKEAWAYS - Blueprint v5.0
 * 
 * TEMPLATE STRATEGY:
 * - ✅ Blueprint v5.0 compliant
 * - ✅ NO GSAP - pure Remotion interpolate + presets
 * - ✅ NO useState - frame-driven only
 * - ✅ Stagger reveal pattern for takeaways
 * - ✅ Uses fadeUpIn preset for entrances
 * - ✅ Uses pulseEmphasis for attention
 * - ✅ Context-based ID factory
 * - ✅ Strict zero wobble
 * 
 * PATTERN:
 * 1. Title fades up
 * 2. Takeaways stagger in (1.2s intervals)
 * 3. Each takeaway pulses for emphasis
 * 4. Exit message fades in
 * 
 * Structure per takeaway:
 * - Number (bold, accent color)
 * - Main point (1-liner, Permanent Marker)
 * - Subtext (optional detail, Inter)
 * 
 * Duration: 8-12s (dynamic based on takeaway count)
 */

const Reflect4AKeyTakeaways = ({ scene, styles, presets, easingMap, transitions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const id = useSceneId();
  
  const svgRef = useRef(null);

  // Style tokens with fallbacks
  const style = scene.style_tokens || {};
  const colors = style.colors || {
    bg: '#FAFBFC',
    accent: '#27AE60',
    accent2: '#2E7FE4',
    accent3: '#FF6B35',
    ink: '#1A1A1A',
  };
  
  const fonts = style.fonts || {
    primary: THEME.fonts.marker.primary,
    secondary: THEME.fonts.structure.primary,
    size_title: 54,
    size_number: 42,
    size_oneliner: 32,
    size_subtext: 22,
  };

  const data = scene.fill?.reflection || {};
  const takeaways = data.takeaways || [];

  // Beats from JSON (in seconds) - Convert to frames
  const sceneBeats = scene.beats || {};
  const beats = {
    entrance: toFrames(sceneBeats.entrance || 0.8, fps),
    title: toFrames(sceneBeats.title || 0.8, fps),
    exit: toFrames(sceneBeats.exit || 8.0, fps),
  };

  // Dynamic takeaway beats (stagger by 1.2s)
  const takeawayBeats = takeaways.map((_, index) => {
    const beatKey = `takeaway${index + 1}`;
    const fallbackTime = 2.2 + index * 1.2;
    return toFrames(sceneBeats[beatKey] || fallbackTime, fps);
  });

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

  // Takeaway animations (staggered)
  const takeawayAnims = takeaways.map((_, index) => {
    const startTime = sceneBeats[`takeaway${index + 1}`] || (2.2 + index * 1.2);
    
    // Entrance
    const entrance = fadeUpIn(frame, {
      start: startTime,
      dur: 0.8,
      dist: 30,
      ease: 'smooth'
    }, EZ, fps);
    
    // Pulse emphasis after entrance
    const pulse = pulseEmphasis(frame, {
      start: startTime + 1.0,
      dur: 0.6,
      scale: 1.03,
      ease: 'backOut'
    }, EZ, fps);
    
    return {
      opacity: entrance.opacity,
      translateY: entrance.translateY || 0,
      scale: pulse.scale
    };
  });

  // Exit message animation
  const exitMessageAnim = fadeUpIn(frame, {
    start: sceneBeats.exit || 8.0,
    dur: 1.0,
    dist: 20,
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

    // Decorative underline for title (after it's visible)
    if (frame >= beats.title + 20) {
      const underlineProgress = Math.min((frame - (beats.title + 20)) / 30, 1);
      
      const underline = rc.line(660, 200, 660 + 600 * underlineProgress, 200, {
        stroke: colors.accent,
        strokeWidth: 4,
        roughness: 0,  // STRICT ZERO WOBBLE
        bowing: 0,     // STRICT ZERO WOBBLE
      });
      
      svg.appendChild(underline);
    }

    // Number circles for each takeaway (after they're visible)
    takeaways.forEach((_, index) => {
      const takeawayBeat = takeawayBeats[index];
      
      if (frame >= takeawayBeat + 15) {
        const circleProgress = Math.min((frame - (takeawayBeat + 15)) / 20, 1);
        
        const yPos = 320 + index * 180;
        const radius = 35 * circleProgress;
        
        const circle = rc.circle(200, yPos, radius * 2, {
          stroke: index === 0 ? colors.accent : index === 1 ? colors.accent2 : colors.accent3,
          strokeWidth: 3,
          roughness: 0,  // STRICT ZERO WOBBLE
          bowing: 0,     // STRICT ZERO WOBBLE
          fill: 'transparent',
        });
        
        svg.appendChild(circle);
      }
    });

  }, [frame, beats, takeaways, takeawayBeats, colors, id]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        backgroundImage: `
          radial-gradient(circle at 80% 20%, ${colors.accent}05 0%, transparent 50%),
          radial-gradient(circle at 20% 80%, ${colors.accent2}05 0%, transparent 50%)
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
          padding: '80px 120px',
        }}
      >
        {/* Title */}
        {frame >= beats.title && (
          <div
            style={{
              opacity: titleAnim.opacity,
              transform: `translateY(${titleAnim.translateY || 0}px)`,
              marginBottom: 60,
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
              {data.title || 'Key Takeaways'}
            </h1>
          </div>
        )}

        {/* Takeaways list */}
        <div
          style={{
            width: '100%',
            maxWidth: 1200,
            display: 'flex',
            flexDirection: 'column',
            gap: 40,
          }}
        >
          {takeaways.map((takeaway, index) => {
            const anim = takeawayAnims[index];
            const isVisible = frame >= takeawayBeats[index];
            
            if (!isVisible) return null;
            
            const accentColor = index === 0 ? colors.accent : 
                               index === 1 ? colors.accent2 : 
                               colors.accent3;
            
            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 40,
                  opacity: anim.opacity,
                  transform: `translateY(${anim.translateY}px) scale(${anim.scale})`,
                }}
              >
                {/* Number */}
                <div
                  style={{
                    flexShrink: 0,
                    width: 80,
                    height: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    style={{
                      fontFamily: fonts.primary,
                      fontSize: fonts.size_number,
                      color: accentColor,
                      fontWeight: 'bold',
                    }}
                  >
                    {index + 1}
                  </span>
                </div>
                
                {/* Content */}
                <div style={{ flex: 1 }}>
                  {/* Main point */}
                  <p
                    style={{
                      fontFamily: fonts.primary,
                      fontSize: fonts.size_oneliner,
                      color: colors.ink,
                      margin: '0 0 12px 0',
                      lineHeight: 1.4,
                    }}
                  >
                    {takeaway.main}
                  </p>
                  
                  {/* Subtext */}
                  {takeaway.sub && (
                    <p
                      style={{
                        fontFamily: fonts.secondary,
                        fontSize: fonts.size_subtext,
                        color: `${colors.ink}99`,
                        margin: 0,
                        lineHeight: 1.6,
                      }}
                    >
                      {takeaway.sub}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Exit message */}
        {frame >= beats.exit && data.exitMessage && (
          <div
            style={{
              marginTop: 80,
              opacity: exitMessageAnim.opacity,
              transform: `translateY(${exitMessageAnim.translateY || 0}px)`,
            }}
          >
            <p
              style={{
                fontFamily: fonts.secondary,
                fontSize: 28,
                color: `${colors.ink}80`,
                margin: 0,
                textAlign: 'center',
                fontStyle: 'italic',
              }}
            >
              {data.exitMessage}
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

export { Reflect4AKeyTakeaways };

export const TEMPLATE_ID = 'Reflect4AKeyTakeaways';
export const TEMPLATE_VERSION = '5.0.0';

export const getDuration = (scene, fps) => {
  const tailPadding = 1.0;
  return toFrames((scene.beats?.exit || 8.0) + tailPadding, fps);
};

export const DURATION_MIN_FRAMES = 240;  // 8s @ 30fps
export const DURATION_MAX_FRAMES = 360;  // 12s @ 30fps

export const SUPPORTED_MODES = ['notebook', 'whiteboard'];

export const CAPABILITIES = {
  usesSVG: true,
  usesLottie: false,
  usesRoughJS: true,
  requiresAudio: false,
  supportsTransitions: true,
  dynamicDuration: true  // Duration depends on takeaway count
};

export const PRESETS_REQUIRED = [
  'fadeUpIn',
  'pulseEmphasis'
];

export const getPosterFrame = (scene, fps) => {
  // Show frame with all takeaways visible
  const takeawayCount = scene.fill?.reflection?.takeaways?.length || 3;
  const lastTakeawayTime = 2.2 + (takeawayCount - 1) * 1.2 + 0.5;
  return toFrames(lastTakeawayTime, fps);
};
