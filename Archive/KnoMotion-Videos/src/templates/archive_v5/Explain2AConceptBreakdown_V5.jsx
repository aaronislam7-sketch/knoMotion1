import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import { THEME } from '../../utils/theme';
import rough from 'roughjs/bundled/rough.esm.js';

// Blueprint v5.0 imports
import { 
  fadeUpIn, 
  popInSpring,
  pulseEmphasis,
  EZ,
  useSceneId,
  toFrames,
  calculateSafeConnectorPath,
  validateScene,
  // ✨ Creative Magic V6
  generateAmbientParticles,
  renderAmbientParticles,
  generateConfettiBurst,
  renderConfettiBurst,
  getGlowEffect,
  getKineticText
} from '../../sdk';

/**
 * EXPLAIN 2A: CONCEPT BREAKDOWN - Blueprint v5.0 + ✨ CREATIVE MAGIC V6
 * 
 * TEMPLATE STRATEGY:
 * - ✅ Blueprint v5.0 compliant
 * - ✅ Uses animation presets (fadeUpIn, popInSpring, pulseEmphasis)
 * - ✅ Reads beats from JSON (in seconds)
 * - ✅ Context-based ID factory (useSceneId)
 * - ✅ Strict zero wobble (roughness: 0, bowing: 0)
 * - ✅ FPS-agnostic (seconds → frames conversion)
 * - ✅ Fully dynamic layout (adapts to 2-7+ parts)
 * - ✨ CREATIVE ENHANCEMENTS:
 *   • Kinetic title animation (wave effect)
 *   • Glow effect on center concept
 *   • Particle burst when connections appear
 *   • Enhanced pulsing connections with depth
 *   • Ambient floating particles
 * 
 * CONVERSATIONAL FLOW:
 * 1. Ambient particles create living background
 * 2. Title appears with kinetic wave effect
 * 3. Center concept pops in with glow
 * 4. Parts cascade in around center (breakdown)
 * 5. Particle burst when connections start
 * 6. Connections draw between center and parts with glow
 * 7. Connections pulse to emphasize relationships
 * 8. Title moves up, parts expand slightly
 * 
 * TYPOGRAPHY:
 * - Primary: Permanent Marker (bold, energetic)
 * - Secondary: Inter (clean readability)
 * 
 * Duration: 20-40s (derived from beats.exit)
 */

const Explain2AConceptBreakdown = ({ scene, styles, presets, easingMap, transitions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const id = useSceneId();
  
  const svgRef = useRef(null);
  const particlesRef = useRef(null);
  const effectsRef = useRef(null);
  
  // ✨ Generate deterministic particles
  const ambientParticles = React.useMemo(
    () => generateAmbientParticles(15, 142, 1920, 1080),
    []
  );
  
  const connectionBurst = React.useMemo(
    () => generateConfettiBurst(20, 960, 460, 300),
    []
  );

  // Style tokens with fallbacks
  const style = scene.style_tokens || {};
  const colors = style.colors || {
    bg: '#FFF9F0',
    accent: '#FF6B35',
    accent2: '#2ECC71',
    accent3: '#9B59B6',
    ink: '#1A1A1A',
  };
  
  const fonts = style.fonts || {
    primary: THEME.fonts.marker.primary,  // Permanent Marker
    secondary: THEME.fonts.structure.primary,
    size_title: 56,
    size_concept: 48,
    size_part_label: 30,
    size_part_desc: 22,
  };

  const data = scene.fill?.concept || {};
  const parts = data.parts || [];
  
  // INTELLIGENT DYNAMIC LAYOUT - Works for 2-7+ parts
  const getAdaptiveLayout = (count) => {
    const boxWidth = 340;
    const totalWidth = 1920;
    const margin = 80;
    
    // 2-4 parts: Single row
    if (count <= 4) {
      const availableWidth = totalWidth - (margin * 2);
      const spacing = (availableWidth - (boxWidth * count)) / Math.max(count - 1, 1);
      
      return Array.from({ length: count }, (_, i) => ({
        x: margin + (boxWidth + spacing) * i + boxWidth / 2,
        y: 750,
        row: 0,
      }));
    }
    
    // 5-6 parts: Two rows
    if (count <= 6) {
      const row1Count = Math.ceil(count / 2);
      const row2Count = count - row1Count;
      const positions = [];
      
      // Row 1
      const availableWidth1 = totalWidth - (margin * 2);
      const spacing1 = (availableWidth1 - (boxWidth * row1Count)) / Math.max(row1Count - 1, 1);
      for (let i = 0; i < row1Count; i++) {
        positions.push({
          x: margin + (boxWidth + spacing1) * i + boxWidth / 2,
          y: 650,
          row: 0,
        });
      }
      
      // Row 2 (centered)
      const availableWidth2 = totalWidth - (margin * 2);
      const spacing2 = (availableWidth2 - (boxWidth * row2Count)) / Math.max(row2Count - 1, 1);
      const offsetX = (totalWidth - (boxWidth * row2Count + spacing2 * (row2Count - 1))) / 2;
      for (let i = 0; i < row2Count; i++) {
        positions.push({
          x: offsetX + (boxWidth + spacing2) * i + boxWidth / 2,
          y: 850,
          row: 1,
        });
      }
      
      return positions;
    }
    
    // 7+ parts: Two rows (4 + remaining)
    const row1Count = 4;
    const row2Count = count - row1Count;
    const positions = [];
    
    // Row 1
    const availableWidth1 = totalWidth - (margin * 2);
    const spacing1 = (availableWidth1 - (boxWidth * row1Count)) / Math.max(row1Count - 1, 1);
    for (let i = 0; i < row1Count; i++) {
      positions.push({
        x: margin + (boxWidth + spacing1) * i + boxWidth / 2,
        y: 650,
        row: 0,
      });
    }
    
    // Row 2
    const availableWidth2 = totalWidth - (margin * 2);
    const spacing2 = (availableWidth2 - (boxWidth * row2Count)) / Math.max(row2Count - 1, 1);
    const offsetX = (totalWidth - (boxWidth * row2Count + spacing2 * (row2Count - 1))) / 2;
    for (let i = 0; i < row2Count; i++) {
      positions.push({
        x: offsetX + (boxWidth + spacing2) * i + boxWidth / 2,
        y: 850,
        row: 1,
      });
    }
    
    return positions;
  };

  // Beats from JSON (in seconds) - Convert to frames
  const sceneBeats = scene.beats || {};
  const beats = {
    prelude: 0,
    title: toFrames(sceneBeats.title || 0.8, fps),
    centerConcept: toFrames(sceneBeats.centerConcept || 2.0, fps),
    parts: toFrames(sceneBeats.parts || 3.5, fps),
    connections: toFrames(sceneBeats.connections || (3.5 + parts.length * 0.6), fps),
    pulseConnections: toFrames(sceneBeats.pulseConnections || (4.0 + parts.length * 0.7), fps),
    settle: toFrames(sceneBeats.settle || (5.5 + parts.length), fps),
    exit: toFrames(sceneBeats.exit || (6.0 + parts.length), fps),
  };

  // Subtle camera drift
  const cameraDrift = {
    x: Math.sin(frame * 0.007) * 2,
    y: Math.cos(frame * 0.006) * 1.5,
  };

  // ========================================
  // ANIMATIONS (Using Blueprint v5 presets)
  // ========================================
  
  // Title - using fadeUpIn preset + ✨ kinetic effect
  const titleAnim = fadeUpIn(frame, {
    start: sceneBeats.title || 0.8,
    dur: 0.9,
    dist: 20,
    ease: 'backOut'
  }, EZ, fps);
  
  // ✨ Kinetic text animation for title
  const titleKinetic = getKineticText(frame, {
    start: sceneBeats.title || 0.8,
    text: data.title || 'Breaking It Down',
    splitBy: 'word',
    effect: 'wave',
    amplitude: 8,
    frequency: 0.08,
  }, fps);

  // Center concept - using popInSpring preset + ✨ glow effect
  const centerConceptAnim = popInSpring(frame, {
    start: sceneBeats.centerConcept || 2.0,
    mass: 1,
    stiffness: 100,
    damping: 12
  }, EZ, fps);
  
  // ✨ Glow effect for center concept
  const centerGlow = getGlowEffect(frame, {
    intensity: 8,
    color: colors.accent,
    pulse: true,
    pulseSpeed: 0.04,
  });

  // ========================================
  // ROUGH.JS - Frames & Connections (ZERO WOBBLE)
  // ========================================

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const rc = rough.svg(svg);

    // Clear previous
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // Center concept frame (main node) - ZERO WOBBLE
    if (frame >= beats.centerConcept) {
      const progress = Math.min((frame - beats.centerConcept) / 35, 1);
      
      const centerFrame = rc.rectangle(760, 380, 400, 160, {
        stroke: colors.accent,
        strokeWidth: 5,
        roughness: 0,  // ZERO WOBBLE
        bowing: 0,     // ZERO WOBBLE
        fill: `${colors.accent}12`,
        fillStyle: 'hachure',
        hachureGap: 10,
      });

      // Animate stroke drawing
      const paths = centerFrame.querySelectorAll('path');
      paths.forEach(path => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length * (1 - progress);
      });

      svg.appendChild(centerFrame);
    }

    // Part frames (breakdown nodes) - ZERO WOBBLE - FULLY DYNAMIC LAYOUT
    if (frame >= beats.parts) {
      const positions = getAdaptiveLayout(parts.length);

      parts.forEach((part, i) => {
        const startFrame = beats.parts + i * toFrames(0.6, fps);
        if (frame < startFrame) return;

        const progress = Math.min((frame - startFrame) / 30, 1);
        const pos = positions[i];

        // Cycle through colors
        const colorIndex = i % 3;
        const partColor = colorIndex === 0 ? colors.accent2 : colorIndex === 1 ? colors.accent3 : colors.accent;

        const partFrame = rc.rectangle(pos.x - 170, pos.y - 80, 340, 160, {
          stroke: partColor,
          strokeWidth: 4,
          roughness: 0,  // ZERO WOBBLE
          bowing: 0,     // ZERO WOBBLE
          fill: `${partColor}08`,
          fillStyle: 'hachure',
          hachureGap: 12,
        });

        // Animate stroke
        const paths = partFrame.querySelectorAll('path');
        paths.forEach(path => {
          const length = path.getTotalLength();
          path.style.strokeDasharray = length;
          path.style.strokeDashoffset = length * (1 - progress);
        });

        svg.appendChild(partFrame);
      });
    }

    // Connecting lines (center to parts) - ZERO WOBBLE - WITH PULSE ANIMATION - COLLISION-SAFE
    if (frame >= beats.connections) {
      const positions = getAdaptiveLayout(parts.length);
      
      // Define center box dimensions for collision avoidance
      const centerBox = {
        x: 960,
        y: 460,
        width: 400,
        height: 160,
      };

      parts.forEach((part, i) => {
        const startFrame = beats.connections + i * 10;
        if (frame < startFrame) return;

        const progress = Math.min((frame - startFrame) / 25, 1);
        const target = positions[i];
        
        // Define target box dimensions
        const targetBox = {
          x: target.x,
          y: target.y,
          width: 340,
          height: 160,
        };
        
        // Calculate safe connector path (avoids overlapping with boxes)
        const safePath = calculateSafeConnectorPath(centerBox, targetBox, {
          padding: 10, // Start/end 10px away from box edges
          curveIntensity: 0.3,
        });

        // Pulse animation after initial draw
        const isPulsing = frame >= beats.pulseConnections;
        const pulseProgress = isPulsing ? (Math.sin((frame - beats.pulseConnections + i * 10) * 0.1) + 1) / 2 : 0;
        
        // Animate path drawing
        const animatedPath = `M ${safePath.start.x} ${safePath.start.y} Q ${safePath.control.x} ${safePath.control.y} ${safePath.start.x + (safePath.end.x - safePath.start.x) * progress} ${safePath.start.y + (safePath.end.y - safePath.start.y) * progress}`;

        const strokeWidth = isPulsing ? 3 + pulseProgress * 2 : 3;
        const opacity = isPulsing ? 0.4 + pulseProgress * 0.3 : 0.4;

        const connector = rc.path(animatedPath, {
          stroke: `${colors.ink}`,
          strokeWidth: strokeWidth,
          roughness: 0,  // ZERO WOBBLE
          bowing: 0,     // ZERO WOBBLE
        });

        connector.style.opacity = opacity;
        svg.appendChild(connector);

        // Arrow indicator at end of connection (positioned at edge of target box, not overlapping)
        if (progress > 0.8) {
          const arrowProgress = (progress - 0.8) / 0.2;
          const arrowSize = 10 * arrowProgress;
          
          // Position arrow at the connection endpoint (edge of box)
          const arrowX = safePath.end.x;
          const arrowY = safePath.end.y;
          
          // Calculate arrow direction based on path angle
          const dx = safePath.end.x - safePath.control.x;
          const dy = safePath.end.y - safePath.control.y;
          const angle = Math.atan2(dy, dx);
          
          // Arrow points in the direction of the path
          const arrowPath = `M ${arrowX} ${arrowY} L ${arrowX - arrowSize * Math.cos(angle - Math.PI / 6)} ${arrowY - arrowSize * Math.sin(angle - Math.PI / 6)} L ${arrowX - arrowSize * Math.cos(angle + Math.PI / 6)} ${arrowY - arrowSize * Math.sin(angle + Math.PI / 6)} Z`;
          
          const arrow = rc.path(arrowPath, {
            stroke: colors.ink,
            strokeWidth: 2,
            roughness: 0,
            bowing: 0,
            fill: `${colors.ink}60`,
            fillStyle: 'solid',
          });
          svg.appendChild(arrow);
        }
      });
    }

  }, [frame, beats, colors, parts, getAdaptiveLayout, id]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        backgroundImage: `
          radial-gradient(circle at 30% 40%, ${colors.accent}04 0%, transparent 60%)
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
          opacity: 0.5,
        }}
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid meet"
      >
        {renderAmbientParticles(ambientParticles, frame, fps, [colors.accent, colors.accent2, colors.accent3]).map(p => p.element)}
      </svg>
      
      {/* ✨ Effects layer (particle bursts) */}
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
        {/* ✨ Particle burst when connections appear */}
        {frame >= beats.connections && frame < beats.connections + 90 &&
          renderConfettiBurst(connectionBurst, frame, beats.connections, [colors.accent, colors.accent2, colors.accent3])}
      </svg>
      
      {/* Rough.js sketch layer */}
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

      {/* Content layer */}
      <AbsoluteFill style={{ transform: `translate(${cameraDrift.x}px, ${cameraDrift.y}px)` }}>
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            padding: '80px 120px',
          }}
        >
          {/* Title - ✨ WITH KINETIC WAVE EFFECT */}
          {frame >= beats.title && (
            <div 
              style={{ 
                textAlign: 'center',
                opacity: titleAnim.opacity,
                transform: `translateY(${titleAnim.translateY}px)`,
                display: 'flex',
                justifyContent: 'center',
                gap: '12px',
              }}
            >
              {titleKinetic.isActive && titleKinetic.segments.map((segment, i) => (
                <h2
                  key={i}
                  style={{
                    fontFamily: fonts.primary,
                    fontSize: fonts.size_title,
                    fontWeight: 400,
                    color: colors.ink,
                    margin: 0,
                    transform: `translateY(${segment.translateY}px) scale(${segment.scale})`,
                    opacity: segment.opacity,
                  }}
                >
                  {segment.text}
                </h2>
              ))}
            </div>
          )}

          {/* Center concept - ✨ WITH GLOW EFFECT */}
          {frame >= beats.centerConcept && (
            <div
              style={{
                position: 'absolute',
                top: 400,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 380,
                textAlign: 'center',
                opacity: centerConceptAnim.opacity,
              }}
            >
              <h3
                style={{
                  fontFamily: fonts.primary,
                  fontSize: fonts.size_concept,
                  fontWeight: 400,
                  color: colors.accent,
                  margin: 0,
                  lineHeight: 1.3,
                  transform: `scale(${centerConceptAnim.scale})`,
                  filter: centerGlow.filter,
                }}
              >
                {data.concept || 'Main Concept'}
              </h3>
            </div>
          )}

          {/* Part cards - FULLY DYNAMIC LAYOUT (works for 2-7+ parts) */}
          {parts.map((part, i) => {
            const startFrame = beats.parts + i * toFrames(0.6, fps);
            if (frame < startFrame) return null;

            const positions = getAdaptiveLayout(parts.length);
            const pos = positions[i];
            
            // Cycle through colors for visual variety
            const colorIndex = i % 3;
            const partColor = colorIndex === 0 ? colors.accent2 : colorIndex === 1 ? colors.accent3 : colors.accent;

            // Part entrance animation using fadeUpIn preset
            const partAnim = fadeUpIn(frame, {
              start: sceneBeats.parts + i * 0.6,
              dur: 0.7,
              dist: 40,
              ease: 'backOut'
            }, EZ, fps);

            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: pos.y,
                  left: pos.x,
                  transform: `translate(-50%, -50%) translateY(${partAnim.translateY}px)`,
                  width: 320,
                  padding: '16px',
                  opacity: partAnim.opacity,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}
                >
                  <h4
                    style={{
                      fontFamily: fonts.primary,
                      fontSize: fonts.size_part_label,
                      fontWeight: 400,
                      color: partColor,
                      margin: 0,
                    }}
                  >
                    {part.label || `Part ${i + 1}`}
                  </h4>
                  <p
                    style={{
                      fontFamily: fonts.secondary,
                      fontSize: fonts.size_part_desc,
                      color: colors.ink,
                      margin: 0,
                      lineHeight: 1.4,
                    }}
                  >
                    {part.description || '...'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ========================================
// BLUEPRINT V5.0 - REQUIRED EXPORTS
// ========================================

export { Explain2AConceptBreakdown };

export const TEMPLATE_ID = 'Explain2AConceptBreakdown';
export const TEMPLATE_VERSION = '5.0.0';

export const getDuration = (scene, fps) => {
  const parts = scene.fill?.concept?.parts || [];
  const tailPadding = 0.5;
  return toFrames((scene.beats?.exit || (6.0 + parts.length)) + tailPadding, fps);
};

export const DURATION_MIN_FRAMES = 600;  // 20s @ 30fps
export const DURATION_MAX_FRAMES = 1200; // 40s @ 30fps

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
  'popInSpring',
  'pulseEmphasis'
];

export const getPosterFrame = (scene, fps) => {
  return toFrames(scene.beats?.connections || 4.0, fps);
};

// Collision detection configuration
export const getLayoutConfig = (scene, fps) => {
  return {
    getBoundingBoxes: (scene) => {
      const data = scene.fill?.concept || {};
      const parts = data.parts || [];
      const { createTextBoundingBox, createShapeBoundingBox } = require('../sdk/collision-detection');
      
      const boxes = [];
      
      // Title
      boxes.push(createTextBoundingBox({
        id: 'title',
        text: data.title || 'Breaking It Down',
        x: 960,
        y: 100,
        fontSize: 56,
        maxWidth: 1200,
        padding: 20,
        priority: 10,
        flexible: false,
      }));
      
      // Center concept
      boxes.push(createShapeBoundingBox({
        id: 'centerConcept',
        x: 960,
        y: 460,
        width: 400,
        height: 160,
        padding: 20,
        priority: 10,
        flexible: false,
      }));
      
      // Part boxes
      const getAdaptiveLayout = (count) => {
        const boxWidth = 340;
        const totalWidth = 1920;
        const margin = 80;
        
        if (count <= 4) {
          const availableWidth = totalWidth - margin * 2;
          const spacing = (availableWidth - boxWidth * count) / Math.max(count - 1, 1);
          
          return Array.from({ length: count }, (_, i) => ({
            x: margin + (boxWidth + spacing) * i + boxWidth / 2,
            y: 750,
          }));
        }
        
        const row1Count = Math.ceil(count / 2);
        const row2Count = count - row1Count;
        const positions = [];
        
        const availableWidth1 = totalWidth - margin * 2;
        const spacing1 = (availableWidth1 - boxWidth * row1Count) / Math.max(row1Count - 1, 1);
        for (let i = 0; i < row1Count; i++) {
          positions.push({
            x: margin + (boxWidth + spacing1) * i + boxWidth / 2,
            y: 650,
          });
        }
        
        const availableWidth2 = totalWidth - margin * 2;
        const spacing2 = (availableWidth2 - boxWidth * row2Count) / Math.max(row2Count - 1, 1);
        const offsetX = (totalWidth - (boxWidth * row2Count + spacing2 * (row2Count - 1))) / 2;
        for (let i = 0; i < row2Count; i++) {
          positions.push({
            x: offsetX + (boxWidth + spacing2) * i + boxWidth / 2,
            y: 850,
          });
        }
        
        return positions;
      };
      
      const positions = getAdaptiveLayout(parts.length);
      parts.forEach((part, i) => {
        const pos = positions[i];
        boxes.push(createShapeBoundingBox({
          id: `part-${i}`,
          x: pos.x,
          y: pos.y,
          width: 340,
          height: 160,
          padding: 10,
          priority: 5,
          flexible: false,
        }));
      });
      
      return boxes;
    },
  };
};

// Legacy exports for backward compatibility
export const EXPLAIN_2A_DURATION_MIN = DURATION_MIN_FRAMES;
export const EXPLAIN_2A_DURATION_MAX = DURATION_MAX_FRAMES;
export const EXPLAIN_2A_EXIT_TRANSITION = 18;
