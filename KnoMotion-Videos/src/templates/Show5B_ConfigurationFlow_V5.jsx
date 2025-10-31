import React, { useEffect, useRef, useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import { THEME } from '../utils/theme';
import rough from 'roughjs/bundled/rough.esm.js';

import {
  fadeUpIn,
  popInSpring,
  pulseEmphasis,
  EZ,
  useSceneId,
  toFrames,
  createTextBoundingBox,
  createShapeBoundingBox,
  generateAmbientParticles,
  renderAmbientParticles,
} from '../sdk';

/**
 * SHOW 5B: CONFIGURATION FLOW - Blueprint v5.0
 * 
 * Shows how choices affect outcomes in a wizard/config flow.
 * PASSIVE learning - no hands-on required.
 * 
 * Duration: 30-45s
 */

const Show5B_ConfigurationFlow = ({ scene, styles, presets, easingMap, transitions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const id = useSceneId();
  
  const svgRef = useRef(null);
  const particlesRef = useRef(null);
  
  const ambientParticles = useMemo(
    () => generateAmbientParticles(10, 567, 1920, 1080),
    []
  );

  const style = scene.style_tokens || {};
  const colors = style.colors || {
    bg: '#FAFBFC',
    accent: '#2E7FE4',
    accent2: '#27AE60',
    accent3: '#F39C12',
    ink: '#1A1A1A',
    inkLight: '#95A5A6',
  };
  
  const fonts = style.fonts || {
    primary: THEME.fonts.marker.primary,
    secondary: THEME.fonts.structure.primary,
    size_title: 44,
    size_stage: 28,
    size_option: 22,
    size_impact: 18,
  };

  const data = scene.fill?.config || {};
  const stages = data.stages || [];
  
  const sceneBeats = scene.beats || {};
  const stageBeats = stages.map((_, i) => 
    toFrames(sceneBeats[`stage${i}`] || (2.0 + i * 4.5), fps)
  );
  
  const beats = {
    title: toFrames(sceneBeats.title || 0.5, fps),
    stages: stageBeats,
    summary: toFrames(sceneBeats.summary || (2.0 + stages.length * 4.5), fps),
    exit: toFrames(sceneBeats.exit || (2.0 + stages.length * 4.5 + 3.0), fps),
  };

  const currentStageIndex = stageBeats.findIndex((beat, i) => {
    if (i === stageBeats.length - 1) return frame >= beat && frame < beats.summary;
    return frame >= beat && frame < stageBeats[i + 1];
  });

  const titleAnim = fadeUpIn(frame, {
    start: sceneBeats.title || 0.5,
    dur: 0.9,
    dist: 30,
    ease: 'backOut'
  }, EZ, fps);

  const stageAnims = stages.map((stage, i) => ({
    label: fadeUpIn(frame, {
      start: stageBeats[i] / fps,
      dur: 0.6,
      dist: 20,
      ease: 'smooth'
    }, EZ, fps),
    options: stage.options.map((opt, j) => popInSpring(frame, {
      start: stageBeats[i] / fps + 0.3 + j * 0.15,
      mass: 0.6,
      stiffness: 200,
      damping: 14
    }, EZ, fps))
  }));

  const summaryAnim = fadeUpIn(frame, {
    start: beats.summary / fps,
    dur: 1.0,
    dist: 40,
    ease: 'backOut'
  }, EZ, fps);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const rc = rough.svg(svg);

    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // Progress dots
    if (frame >= beats.title + 30) {
      const dotY = 120;
      const dotSpacing = 60;
      const startX = 960 - (stages.length - 1) * dotSpacing / 2;
      
      stages.forEach((_, i) => {
        const x = startX + i * dotSpacing;
        const isActive = i === currentStageIndex;
        const isComplete = i < currentStageIndex;
        
        const dotColor = isComplete ? colors.accent2 : isActive ? colors.accent : colors.inkLight;
        const dotSize = isActive ? 16 : 12;
        
        const dot = rc.circle(x, dotY, dotSize * 2, {
          stroke: dotColor,
          strokeWidth: 3,
          roughness: 0,
          bowing: 0,
          fill: isComplete || isActive ? dotColor : 'transparent',
          fillStyle: 'solid',
        });
        svg.appendChild(dot);
      });
    }

    // Option boxes
    if (currentStageIndex >= 0 && currentStageIndex < stages.length) {
      const stage = stages[currentStageIndex];
      const anim = stageAnims[currentStageIndex];
      
      stage.options.forEach((opt, i) => {
        const optAnim = anim.options[i];
        if (!optAnim || optAnim.opacity === 0) return;
        
        const boxY = 340 + i * 140;
        const boxWidth = 700;
        const boxHeight = 120;
        
        const isRecommended = opt.recommended;
        const boxColor = isRecommended ? colors.accent2 : colors.accent;
        
        const box = rc.rectangle(
          960 - boxWidth / 2,
          boxY,
          boxWidth,
          boxHeight,
          {
            stroke: boxColor,
            strokeWidth: isRecommended ? 4 : 3,
            roughness: 0,
            bowing: 0,
            fill: `${boxColor}10`,
            fillStyle: 'solid',
          }
        );
        box.setAttribute('opacity', optAnim.opacity);
        svg.appendChild(box);
      });
    }

  }, [frame, beats, colors, stages, currentStageIndex, stageAnims]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        backgroundImage: `
          radial-gradient(circle at 30% 70%, ${colors.accent}04 0%, transparent 50%),
          radial-gradient(circle at 70% 30%, ${colors.accent3}03 0%, transparent 50%)
        `,
      }}
    >
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

      <AbsoluteFill>
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          padding: '100px 120px',
        }}>
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
                {data.title || 'Configure Your Service'}
              </h1>
            </div>
          )}

          {/* Progress dots rendered by SVG */}
          {frame >= beats.title + 30 && (
            <div style={{ height: 80, marginBottom: 40 }} />
          )}

          {/* Current stage */}
          {currentStageIndex >= 0 && currentStageIndex < stages.length && (
            <div>
              <div
                style={{
                  textAlign: 'center',
                  marginBottom: 40,
                  opacity: stageAnims[currentStageIndex].label.opacity,
                  transform: `translateY(${stageAnims[currentStageIndex].label.translateY || 0}px)`,
                }}
              >
                <h2
                  style={{
                    fontFamily: fonts.primary,
                    fontSize: fonts.size_stage,
                    color: colors.accent,
                    margin: '0 0 12px 0',
                  }}
                >
                  {stages[currentStageIndex].label}
                </h2>
                <p
                  style={{
                    fontFamily: fonts.secondary,
                    fontSize: 20,
                    color: colors.inkLight,
                    margin: 0,
                  }}
                >
                  {stages[currentStageIndex].question}
                </p>
              </div>

              {/* Options */}
              {stages[currentStageIndex].options.map((opt, i) => {
                const optAnim = stageAnims[currentStageIndex].options[i];
                if (!optAnim || optAnim.opacity === 0) return null;
                
                return (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: 340 + i * 140,
                      transform: `translateX(-50%) scale(${optAnim.scale || 1})`,
                      opacity: optAnim.opacity,
                      width: 700,
                      height: 120,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      justifyContent: 'center',
                      padding: '0 24px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                      <h3
                        style={{
                          fontFamily: fonts.primary,
                          fontSize: fonts.size_option,
                          color: opt.recommended ? colors.accent2 : colors.ink,
                          margin: 0,
                        }}
                      >
                        {opt.label}
                      </h3>
                      {opt.recommended && (
                        <span style={{
                          fontSize: 12,
                          fontWeight: 'bold',
                          color: colors.accent2,
                          backgroundColor: `${colors.accent2}20`,
                          padding: '4px 8px',
                          borderRadius: 4,
                        }}>
                          RECOMMENDED
                        </span>
                      )}
                    </div>
                    <p
                      style={{
                        fontFamily: fonts.secondary,
                        fontSize: 16,
                        color: colors.inkLight,
                        margin: '0 0 8px 0',
                      }}
                    >
                      {opt.description}
                    </p>
                    <p
                      style={{
                        fontFamily: fonts.secondary,
                        fontSize: fonts.size_impact,
                        color: colors.accent3,
                        margin: 0,
                        fontWeight: '600',
                      }}
                    >
                      Impact: {opt.impact}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Summary */}
          {frame >= beats.summary && (
            <div
              style={{
                position: 'absolute',
                bottom: 100,
                left: '50%',
                transform: `translateX(-50%) translateY(${summaryAnim.translateY || 0}px)`,
                opacity: summaryAnim.opacity,
                textAlign: 'center',
                maxWidth: 900,
              }}
            >
              <h2
                style={{
                  fontFamily: fonts.primary,
                  fontSize: 36,
                  color: colors.accent2,
                  margin: '0 0 16px 0',
                }}
              >
                {data.summary?.message || 'Configuration Complete!'}
              </h2>
              {data.summary?.estimate && (
                <p
                  style={{
                    fontFamily: fonts.secondary,
                    fontSize: 20,
                    color: colors.inkLight,
                    margin: 0,
                  }}
                >
                  {data.summary.estimate}
                </p>
              )}
            </div>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export { Show5B_ConfigurationFlow };

export const TEMPLATE_ID = 'Show5B_ConfigurationFlow';
export const TEMPLATE_VERSION = '5.0.0';

export const getDuration = (scene, fps) => {
  const stages = scene.fill?.config?.stages || [];
  const totalTime = 2.0 + stages.length * 4.5 + 3.0;
  return toFrames(scene.beats?.exit || totalTime, fps);
};

export const DURATION_MIN_FRAMES = 900;   // 30s @ 30fps
export const DURATION_MAX_FRAMES = 1350;  // 45s @ 30fps

export const SUPPORTED_MODES = ['notebook', 'whiteboard'];

export const CAPABILITIES = {
  usesSVG: true,
  usesLottie: false,
  usesRoughJS: true,
  requiresAudio: false,
  supportsTransitions: true,
  supportsDynamicStageCount: true,
  hasProgressIndicator: true,
};

export const PRESETS_REQUIRED = ['fadeUpIn', 'popInSpring'];

export const getPosterFrame = (scene, fps) => toFrames(5.0, fps);

export const getLayoutConfig = (scene, fps) => {
  return {
    getBoundingBoxes: (scene) => {
      const { createTextBoundingBox } = require('../sdk/collision-detection');
      return [
        createTextBoundingBox({
          id: 'title',
          text: scene.fill?.config?.title || 'Config',
          x: 960,
          y: 130,
          fontSize: 44,
          maxWidth: 1200,
          padding: 20,
          priority: 10,
          flexible: false,
        }),
      ];
    },
  };
};

export const AGNOSTIC_FEATURES = {
  stageCount: { min: 2, max: 5, recommended: '3-4' },
  optionsPerStage: { min: 2, max: 4 },
  domainAgnostic: true,
  crossDomainTested: ['cloud-config', 'app-setup', 'architecture-choices']
};
