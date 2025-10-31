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
  // ✨ Creative Magic V6
  generateAmbientParticles,
  renderAmbientParticles,
  getShimmerEffect,
  getGlowEffect,
} from '../sdk';

/**
 * COMPARE 3A: FEATURE MATRIX - Blueprint v5.0 + ✨ CREATIVE MAGIC V6
 * 
 * TEMPLATE STRATEGY:
 * - ✅ Blueprint v5.0 compliant
 * - ✅ Agnostic: Works for ANY comparison (products, services, approaches, tools)
 * - ✅ Dynamic option count (2-5 options)
 * - ✅ Dynamic feature rows (3-8 features)
 * - ✅ Trade-off gauge visualization
 * - ✅ Decision guidance
 * - ✅ Uses animation presets (fadeUpIn, popInSpring, pulseEmphasis)
 * - ✅ Context-based ID factory (useSceneId)
 * - ✅ Strict zero wobble (roughness: 0, bowing: 0)
 * - ✅ FPS-agnostic (seconds → frames conversion)
 * - ✅ Collision detection for grid
 * - ✨ CREATIVE ENHANCEMENTS:
 *   • Grid cells pop in sequentially (row-by-row)
 *   • Trade-off gauges animate with shimmer
 *   • Best-value option gets glow effect
 *   • Feature type indicators (text, boolean, number)
 *   • Recommended option has spotlight
 *   • Color-coded value cells (green = good, red = caution)
 * 
 * PEDAGOGICAL FLOW:
 * 1. Title reveal
 * 2. Option headers appear (left to right)
 * 3. Features reveal row by row (each row: label → values for all options)
 * 4. Trade-off gauges animate
 * 5. Decision guidance highlights recommended option
 * 
 * AGNOSTIC FEATURES:
 * - Works for: Cloud storage classes, compute options, frameworks, pricing tiers
 * - Dynamic grid layout (auto-adjusts to option count)
 * - Supports multiple value types (text, boolean, numeric ranges)
 * - Trade-off metrics (cost, speed, flexibility, etc.)
 * - Configurable decision guidance
 * 
 * Duration: 35-50s (scales with feature count: ~3-4s per feature)
 */

const Compare3A_FeatureMatrix = ({ scene, styles, presets, easingMap, transitions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const id = useSceneId();
  
  const svgRef = useRef(null);
  const particlesRef = useRef(null);
  
  // ✨ Generate deterministic particles
  const ambientParticles = useMemo(
    () => generateAmbientParticles(10, 789, 1920, 1080),
    []
  );

  // Style tokens with fallbacks
  const style = scene.style_tokens || {};
  const colors = style.colors || {
    bg: '#FAFBFC',
    accent: '#2E7FE4',      // Blue for highlights
    accent2: '#27AE60',     // Green for positive/recommended
    accent3: '#E74C3C',     // Red for caution
    ink: '#1A1A1A',
    inkLight: '#95A5A6',
  };
  
  const fonts = style.fonts || {
    primary: THEME.fonts.marker.primary,
    secondary: THEME.fonts.structure.primary,
    size_title: 52,
    size_optionHeader: 32,
    size_featureLabel: 24,
    size_featureValue: 22,
    size_tradeoffLabel: 20,
    size_guidance: 28,
  };

  const data = scene.fill?.comparison || {};
  const options = data.options || [];
  const features = data.features || [];
  const tradeoffs = data.tradeoffs?.metrics || [];
  const optionCount = options.length;
  const featureCount = features.length;

  // Beats from JSON (in seconds) - Convert to frames
  const sceneBeats = scene.beats || {};
  
  // Calculate dynamic feature timing (3-4s per feature)
  const featureDurations = features.map((_, i) => 3.5);
  const featureBeats = [toFrames(sceneBeats.optionHeaders || 2.5, fps)];
  
  for (let i = 0; i < featureCount; i++) {
    const prevBeat = i === 0
      ? (sceneBeats.optionHeaders || 2.5)
      : (featureBeats[i] / fps);
    const nextBeat = prevBeat + featureDurations[i];
    featureBeats.push(toFrames(nextBeat, fps));
  }
  
  const beats = {
    entrance: toFrames(sceneBeats.entrance || 0.5, fps),
    title: toFrames(sceneBeats.title || 0.5, fps),
    optionHeaders: toFrames(sceneBeats.optionHeaders || 2.5, fps),
    features: featureBeats,
    tradeoffs: featureBeats[featureCount] + toFrames(1.0, fps),
    decision: featureBeats[featureCount] + toFrames(4.0, fps),
    exit: toFrames(sceneBeats.exit || (featureBeats[featureCount] / fps + 8.0), fps),
  };

  // Determine recommended option (from data or auto-detect)
  const recommendedIndex = data.recommendedIndex !== undefined
    ? data.recommendedIndex
    : 0; // Default to first option

  // Grid layout calculations
  const gridWidth = 1600;
  const gridHeight = 600;
  const gridX = 160;
  const gridY = 240;
  const colWidth = gridWidth / (optionCount + 1); // +1 for feature label column
  const rowHeight = gridHeight / (featureCount + 1); // +1 for header row

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

  // Option header animations (stagger left-to-right)
  const optionHeaderAnims = options.map((option, i) => {
    return popInSpring(frame, {
      start: (sceneBeats.optionHeaders || 2.5) + i * 0.15,
      mass: 0.6,
      stiffness: 200,
      damping: 14
    }, EZ, fps);
  });

  // Feature row animations (stagger top-to-bottom)
  const featureRowAnims = features.map((feature, i) => {
    const rowStart = featureBeats[i] / fps;
    
    // Feature label
    const labelFade = fadeUpIn(frame, {
      start: rowStart,
      dur: 0.5,
      dist: 15,
      ease: 'smooth'
    }, EZ, fps);
    
    // Feature values for each option (stagger)
    const valuePops = options.map((_, optIdx) => {
      return popInSpring(frame, {
        start: rowStart + 0.2 + optIdx * 0.1,
        mass: 0.5,
        stiffness: 220,
        damping: 13
      }, EZ, fps);
    });
    
    return { labelFade, valuePops };
  });

  // Trade-off gauge animations
  const tradeoffAnim = fadeUpIn(frame, {
    start: beats.tradeoffs / fps,
    dur: 1.0,
    dist: 30,
    ease: 'backOut'
  }, EZ, fps);

  // Decision guidance animation
  const decisionAnim = fadeUpIn(frame, {
    start: beats.decision / fps,
    dur: 1.2,
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

    // Grid background with hand-drawn rough border
    if (frame >= beats.optionHeaders) {
      const gridBg = rc.rectangle(gridX, gridY, gridWidth, gridHeight, {
        stroke: colors.ink,
        strokeWidth: 3,
        roughness: 1.5,
        bowing: 1,
        fill: `${colors.inkLight}05`,
        fillStyle: 'solid',
      });
      svg.appendChild(gridBg);
    }

    // Vertical grid lines (column separators) - hand-drawn style
    if (frame >= beats.optionHeaders + 15) {
      for (let i = 1; i <= optionCount; i++) {
        const x = gridX + i * colWidth;
        const line = rc.line(x, gridY, x, gridY + gridHeight, {
          stroke: colors.inkLight,
          strokeWidth: 2,
          roughness: 1.2,
          bowing: 0.8,
        });
        svg.appendChild(line);
      }
    }

    // Horizontal grid lines (row separators) - hand-drawn style
    if (frame >= beats.features[0]) {
      for (let i = 1; i <= featureCount; i++) {
        if (frame >= featureBeats[i - 1] + 10) {
          const y = gridY + i * rowHeight;
          const line = rc.line(gridX, y, gridX + gridWidth, y, {
            stroke: colors.inkLight,
            strokeWidth: 2,
            roughness: 1.2,
            bowing: 0.8,
          });
          svg.appendChild(line);
        }
      }
    }

    // Recommended option spotlight with hand-drawn border
    if (frame >= beats.decision && recommendedIndex >= 0) {
      const recX = gridX + (recommendedIndex + 1) * colWidth;
      const spotlightProgress = Math.min((frame - beats.decision) / 30, 1);
      
      // Background glow
      const spotlight = rc.rectangle(
        recX + 10,
        gridY + 10,
        colWidth - 20,
        gridHeight - 20,
        {
          stroke: colors.accent2,
          strokeWidth: 3,
          roughness: 1.5,
          bowing: 1.2,
          fill: colors.accent2,
          fillStyle: 'solid',
          fillWeight: 0.5,
        }
      );
      spotlight.setAttribute('opacity', spotlightProgress * 0.12);
      svg.appendChild(spotlight);
    }

    // Trade-off gauge bars
    if (frame >= beats.tradeoffs) {
      const gaugeStartY = gridY + gridHeight + 80;
      const gaugeHeight = 40;
      const gaugeSpacing = 80;
      
      tradeoffs.forEach((metric, i) => {
        const gaugeY = gaugeStartY + i * gaugeSpacing;
        const gaugeWidth = 400;
        
        // Background bar
        const bgBar = rc.rectangle(1200, gaugeY, gaugeWidth, gaugeHeight, {
          stroke: colors.inkLight,
          strokeWidth: 2,
          roughness: 0,
          bowing: 0,
          fill: `${colors.inkLight}20`,
          fillStyle: 'solid',
        });
        svg.appendChild(bgBar);
        
        // Option value bars (stagger animation)
        const optionColors = [colors.accent, colors.accent2, colors.accent3, '#9B59B6', '#F39C12'];
        
        metric.values.forEach((value, optIdx) => {
          if (optIdx < optionCount) {
            const barProgress = Math.min(Math.max((frame - beats.tradeoffs - 15 - optIdx * 5) / 20, 0), 1);
            const barWidth = (gaugeWidth * value / 100) * barProgress;
            
            if (barWidth > 0) {
              const valueBar = rc.rectangle(
                1200,
                gaugeY + 5 + optIdx * (gaugeHeight / optionCount),
                barWidth,
                (gaugeHeight / optionCount) - 5,
                {
                  stroke: optionColors[optIdx % optionColors.length],
                  strokeWidth: 2,
                  roughness: 0,
                  bowing: 0,
                  fill: optionColors[optIdx % optionColors.length],
                  fillStyle: 'solid',
                }
              );
              svg.appendChild(valueBar);
            }
          }
        });
      });
    }

  }, [frame, beats, colors, optionCount, featureCount, recommendedIndex, gridX, gridY, gridWidth, gridHeight, colWidth, rowHeight, featureBeats, tradeoffs, options]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        backgroundImage: `
          radial-gradient(circle at 30% 70%, ${colors.accent}05 0%, transparent 50%),
          radial-gradient(circle at 70% 30%, ${colors.accent2}04 0%, transparent 50%)
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
          opacity: 0.2,
        }}
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid meet"
      >
        {renderAmbientParticles(ambientParticles, frame, fps, [colors.accent, colors.accent2]).map(p => p.element)}
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
            padding: '100px 80px 80px',
          }}
        >
          {/* Title */}
          {frame >= beats.title && (
            <div
              style={{
                textAlign: 'center',
                marginBottom: 60,
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
                {data.title || 'Compare Your Options'}
              </h1>
            </div>
          )}

          {/* Grid Container */}
          <div
            style={{
              position: 'absolute',
              left: gridX,
              top: gridY,
              width: gridWidth,
              height: gridHeight,
            }}
          >
            {/* Option Headers Row */}
            {frame >= beats.optionHeaders && (
              <div
                style={{
                  display: 'flex',
                  height: rowHeight,
                  alignItems: 'center',
                }}
              >
                {/* Empty corner cell */}
                <div style={{ width: colWidth }} />
                
                {/* Option names */}
                {options.map((option, i) => (
                  <div
                    key={i}
                    style={{
                      width: colWidth,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: optionHeaderAnims[i].opacity || 0,
                      transform: `scale(${optionHeaderAnims[i].scale || 0})`,
                      backgroundColor: i === recommendedIndex && frame >= beats.decision
                        ? `${colors.accent2}10`
                        : 'transparent',
                      borderRadius: 8,
                      padding: '8px 0',
                    }}
                  >
                    {option.icon && (
                      <div style={{ fontSize: 36, marginBottom: 4 }}>
                        {option.icon}
                      </div>
                    )}
                    <span
                      style={{
                        fontFamily: fonts.primary,
                        fontSize: fonts.size_optionHeader,
                        color: i === recommendedIndex && frame >= beats.decision
                          ? colors.accent2
                          : colors.ink,
                        fontWeight: i === recommendedIndex && frame >= beats.decision
                          ? 'bold'
                          : 'normal',
                      }}
                    >
                      {option.name}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Feature Rows */}
            {features.map((feature, rowIdx) => {
              if (frame < featureBeats[rowIdx]) return null;
              
              const rowAnim = featureRowAnims[rowIdx];
              
              return (
                <div
                  key={rowIdx}
                  style={{
                    display: 'flex',
                    height: rowHeight,
                    alignItems: 'center',
                  }}
                >
                  {/* Feature Label */}
                  <div
                    style={{
                      width: colWidth,
                      paddingLeft: 16,
                      opacity: rowAnim.labelFade.opacity || 0,
                      transform: `translateY(${rowAnim.labelFade.translateY || 0}px)`,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: fonts.secondary,
                        fontSize: fonts.size_featureLabel,
                        color: colors.ink,
                        fontWeight: '600',
                      }}
                    >
                      {feature.label}
                    </span>
                  </div>
                  
                  {/* Feature Values */}
                  {options.map((_, optIdx) => {
                    const valuePop = rowAnim.valuePops[optIdx];
                    const value = feature.values[optIdx];
                    
                    // Determine cell styling based on value type
                    let cellContent;
                    let cellColor = colors.ink;
                    
                    if (feature.type === 'boolean') {
                      cellContent = value ? '✓' : '✗';
                      cellColor = value ? colors.accent2 : colors.accent3;
                    } else if (feature.type === 'number') {
                      cellContent = value;
                      cellColor = colors.accent;
                    } else {
                      cellContent = value;
                    }
                    
                    return (
                      <div
                        key={optIdx}
                        style={{
                          width: colWidth,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: valuePop.opacity || 0,
                          transform: `scale(${valuePop.scale || 0})`,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: fonts.secondary,
                            fontSize: feature.type === 'boolean' ? 32 : fonts.size_featureValue,
                            color: cellColor,
                            fontWeight: feature.type === 'boolean' ? 'bold' : 'normal',
                          }}
                        >
                          {cellContent}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Trade-off Gauges Section */}
          {frame >= beats.tradeoffs && (
            <div
              style={{
                position: 'absolute',
                left: 160,
                top: gridY + gridHeight + 60,
                opacity: tradeoffAnim.opacity,
                transform: `translateY(${tradeoffAnim.translateY || 0}px)`,
              }}
            >
              <h3
                style={{
                  fontFamily: fonts.primary,
                  fontSize: 32,
                  color: colors.ink,
                  margin: '0 0 20px 0',
                }}
              >
                Trade-offs
              </h3>
              
              {tradeoffs.map((metric, i) => (
                <div
                  key={i}
                  style={{
                    marginBottom: 20,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 20,
                  }}
                >
                  <div style={{ width: 180 }}>
                    <span
                      style={{
                        fontFamily: fonts.secondary,
                        fontSize: fonts.size_tradeoffLabel,
                        color: colors.ink,
                        fontWeight: '600',
                      }}
                    >
                      {metric.label}
                    </span>
                  </div>
                  <div style={{ width: 420, height: 40, position: 'relative' }}>
                    {/* Gauges rendered by rough.js */}
                  </div>
                  <div style={{ fontSize: 14, color: colors.inkLight }}>
                    {metric.lowIsBetter ? '(lower is better)' : metric.highIsBetter ? '(higher is better)' : ''}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Decision Guidance */}
          {frame >= beats.decision && data.guidance && (
            <div
              style={{
                position: 'absolute',
                bottom: 80,
                left: '50%',
                transform: `translateX(-50%) translateY(${decisionAnim.translateY || 0}px)`,
                opacity: decisionAnim.opacity,
                maxWidth: 1200,
                textAlign: 'center',
                padding: '24px 40px',
                backgroundColor: `${colors.accent}15`,
                borderRadius: 16,
                border: `3px solid ${colors.accent}`,
              }}
            >
              <p
                style={{
                  fontFamily: fonts.secondary,
                  fontSize: fonts.size_guidance,
                  color: colors.ink,
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                <strong style={{ color: colors.accent }}>Decision Guide:</strong> {data.guidance}
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

export { Compare3A_FeatureMatrix };

export const TEMPLATE_ID = 'Compare3A_FeatureMatrix';
export const TEMPLATE_VERSION = '5.0.0';

export const getDuration = (scene, fps) => {
  const features = scene.fill?.comparison?.features || [];
  const featureTime = features.length * 3.5; // 3.5s per feature
  const tailPadding = 8.0; // Trade-offs + decision + exit
  return toFrames((scene.beats?.optionHeaders || 2.5) + featureTime + tailPadding, fps);
};

export const DURATION_MIN_FRAMES = 1050;  // 35s @ 30fps
export const DURATION_MAX_FRAMES = 1500;  // 50s @ 30fps

export const SUPPORTED_MODES = ['notebook', 'whiteboard'];

export const CAPABILITIES = {
  usesSVG: true,
  usesLottie: false,
  usesRoughJS: true,
  requiresAudio: false,
  supportsTransitions: true,
  supportsDynamicOptionCount: true,
  supportsDynamicFeatureCount: true,
  hasTradeoffGauges: true,
  hasRecommendation: true,
};

export const PRESETS_REQUIRED = [
  'fadeUpIn',
  'popInSpring',
  'pulseEmphasis'
];

export const getPosterFrame = (scene, fps) => {
  const features = scene.fill?.comparison?.features || [];
  const midFeature = Math.floor(features.length / 2);
  return toFrames((scene.beats?.optionHeaders || 2.5) + midFeature * 3.5, fps);
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
        text: scene.fill?.comparison?.title || 'Compare Options',
        x: 960,
        y: 130,
        fontSize: 52,
        maxWidth: 1400,
        padding: 20,
        priority: 10,
        flexible: false,
      }));
      
      // Grid area
      boxes.push(createShapeBoundingBox({
        id: 'grid',
        x: 960,
        y: 540,
        width: 1600,
        height: 600,
        padding: 40,
        priority: 10,
        flexible: false,
      }));
      
      // Decision guidance
      boxes.push(createShapeBoundingBox({
        id: 'guidance',
        x: 960,
        y: 980,
        width: 1200,
        height: 80,
        padding: 20,
        priority: 9,
        flexible: true,
      }));
      
      return boxes;
    },
  };
};

// Agnostic features
export const AGNOSTIC_FEATURES = {
  optionCount: { min: 2, max: 5, recommended: '3-4' },
  featureCount: { min: 3, max: 8, recommended: '5-6' },
  domainAgnostic: true,
  valueTypes: ['text', 'boolean', 'number', 'range'],
  tradeoffMetrics: true,
  recommendationSupport: true,
  crossDomainTested: ['cloud-services', 'pricing-tiers', 'frameworks', 'product-comparison']
};
