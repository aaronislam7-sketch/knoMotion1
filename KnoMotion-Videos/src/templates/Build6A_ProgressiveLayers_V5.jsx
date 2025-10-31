import React, { useEffect, useRef, useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';
import { THEME } from '../utils/theme';
import rough from 'roughjs/bundled/rough.esm.js';

import {
  fadeUpIn,
  popInSpring,
  EZ,
  useSceneId,
  toFrames,
  createTextBoundingBox,
  createShapeBoundingBox,
  generateAmbientParticles,
  renderAmbientParticles,
} from '../sdk';

/**
 * BUILD 6A: PROGRESSIVE LAYERS - Blueprint v5.0
 * 
 * Shows evolution from simple base → complex system by adding layers.
 * Perfect for teaching architecture, system building, concept evolution.
 * 
 * Duration: 35-50s
 */

const Build6A_ProgressiveLayers = ({ scene, styles, presets, easingMap, transitions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const id = useSceneId();
  
  const svgRef = useRef(null);
  const particlesRef = useRef(null);
  
  const ambientParticles = useMemo(
    () => generateAmbientParticles(10, 678, 1920, 1080),
    []
  );

  const style = scene.style_tokens || {};
  const colors = style.colors || {
    bg: '#FAFBFC',
    accent: '#2E7FE4',
    accent2: '#27AE60',
    accent3: '#F39C12',
    accent4: '#E74C3C',
    accent5: '#9B59B6',
    ink: '#1A1A1A',
    inkLight: '#95A5A6',
  };
  
  const fonts = style.fonts || {
    primary: THEME.fonts.marker.primary,
    secondary: THEME.fonts.structure.primary,
    size_title: 44,
    size_layer: 24,
    size_why: 18,
  };

  const data = scene.fill?.build || {};
  const layers = data.layers || [];
  
  const sceneBeats = scene.beats || {};
  const layerBeats = layers.map((_, i) => 
    toFrames(sceneBeats[`layer${i}`] || (2.0 + i * 5.0), fps)
  );
  
  const beats = {
    title: toFrames(sceneBeats.title || 0.5, fps),
    baseLayer: toFrames(sceneBeats.baseLayer || 2.0, fps),
    layers: layerBeats,
    finalView: toFrames(sceneBeats.finalView || (2.0 + layers.length * 5.0), fps),
    exit: toFrames(sceneBeats.exit || (2.0 + layers.length * 5.0 + 4.0), fps),
  };

  const currentLayerIndex = layerBeats.findIndex((beat, i) => {
    if (i === layerBeats.length - 1) return frame >= beat && frame < beats.finalView;
    return frame >= beat && frame < layerBeats[i + 1];
  });

  const visibleLayers = currentLayerIndex >= 0 ? currentLayerIndex + 1 : 0;

  const titleAnim = fadeUpIn(frame, {
    start: sceneBeats.title || 0.5,
    dur: 0.9,
    dist: 30,
    ease: 'backOut'
  }, EZ, fps);

  const layerAnims = layers.map((_, i) => fadeUpIn(frame, {
    start: layerBeats[i] / fps,
    dur: 0.8,
    dist: 20,
    ease: 'backOut'
  }, EZ, fps));

  const finalAnim = fadeUpIn(frame, {
    start: beats.finalView / fps,
    dur: 1.0,
    dist: 30,
    ease: 'backOut'
  }, EZ, fps);

  const layerColors = [colors.accent, colors.accent2, colors.accent3, colors.accent4, colors.accent5];

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const rc = rough.svg(svg);

    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // Draw layers (stack from bottom up)
    const centerX = 960;
    const baseY = 680;
    const layerHeight = 80;
    const layerWidth = 600;

    for (let i = 0; i <= visibleLayers && i < layers.length; i++) {
      const anim = layerAnims[i];
      if (!anim || anim.opacity === 0) continue;
      
      const y = baseY - i * layerHeight;
      const color = layerColors[i % layerColors.length];
      
      const layer = rc.rectangle(
        centerX - layerWidth / 2,
        y,
        layerWidth,
        layerHeight,
        {
          stroke: color,
          strokeWidth: 3,
          roughness: 0,
          bowing: 0,
          fill: `${color}20`,
          fillStyle: 'solid',
        }
      );
      layer.setAttribute('opacity', anim.opacity);
      svg.appendChild(layer);
    }

  }, [frame, beats, colors, layers, visibleLayers, layerAnims, layerColors]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        backgroundImage: `
          radial-gradient(circle at 20% 80%, ${colors.accent}04 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, ${colors.accent2}03 0%, transparent 50%)
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
          padding: '80px 120px',
        }}>
          {/* Title */}
          {frame >= beats.title && (
            <div
              style={{
                textAlign: 'center',
                marginBottom: 40,
                opacity: titleAnim.opacity,
                transform: `translateY(${titleAnim.translateY || 0}px)`,
              }}
            >
              <h1
                style={{
                  fontFamily: fonts.primary,
                  fontSize: fonts.size_title,
                  color: colors.ink,
                  margin: '0 0 12px 0',
                }}
              >
                {data.title || 'Building a System'}
              </h1>
              <p
                style={{
                  fontFamily: fonts.secondary,
                  fontSize: 20,
                  color: colors.inkLight,
                  margin: 0,
                }}
              >
                {data.concept || 'Layer by layer'}
              </p>
            </div>
          )}

          {/* Current layer details */}
          {currentLayerIndex >= 0 && currentLayerIndex < layers.length && (
            <div
              style={{
                position: 'absolute',
                left: 120,
                top: 200,
                maxWidth: 500,
                opacity: layerAnims[currentLayerIndex].opacity,
                transform: `translateY(${layerAnims[currentLayerIndex].translateY || 0}px)`,
              }}
            >
              <div style={{
                backgroundColor: `${layerColors[currentLayerIndex % layerColors.length]}15`,
                padding: 24,
                borderRadius: 12,
                border: `3px solid ${layerColors[currentLayerIndex % layerColors.length]}`,
              }}>
                <h2
                  style={{
                    fontFamily: fonts.primary,
                    fontSize: fonts.size_layer,
                    color: layerColors[currentLayerIndex % layerColors.length],
                    margin: '0 0 12px 0',
                  }}
                >
                  {layers[currentLayerIndex].label}
                </h2>
                <p
                  style={{
                    fontFamily: fonts.secondary,
                    fontSize: 18,
                    color: colors.ink,
                    margin: '0 0 16px 0',
                    lineHeight: 1.5,
                  }}
                >
                  {layers[currentLayerIndex].description}
                </p>
                <p
                  style={{
                    fontFamily: fonts.secondary,
                    fontSize: fonts.size_why,
                    color: colors.inkLight,
                    margin: 0,
                    fontWeight: '600',
                  }}
                >
                  Why: {layers[currentLayerIndex].why}
                </p>
              </div>
            </div>
          )}

          {/* Final summary */}
          {frame >= beats.finalView && (
            <div
              style={{
                position: 'absolute',
                bottom: 80,
                left: '50%',
                transform: `translateX(-50%) translateY(${finalAnim.translateY || 0}px)`,
                opacity: finalAnim.opacity,
                textAlign: 'center',
                maxWidth: 800,
              }}
            >
              <h2
                style={{
                  fontFamily: fonts.primary,
                  fontSize: 32,
                  color: colors.accent2,
                  margin: '0 0 12px 0',
                }}
              >
                {data.finalSummary || 'System Complete!'}
              </h2>
            </div>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export { Build6A_ProgressiveLayers };

export const TEMPLATE_ID = 'Build6A_ProgressiveLayers';
export const TEMPLATE_VERSION = '5.0.0';

export const getDuration = (scene, fps) => {
  const layers = scene.fill?.build?.layers || [];
  const totalTime = 2.0 + layers.length * 5.0 + 4.0;
  return toFrames(scene.beats?.exit || totalTime, fps);
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
  supportsDynamicLayerCount: true,
};

export const PRESETS_REQUIRED = ['fadeUpIn', 'popInSpring'];

export const getPosterFrame = (scene, fps) => {
  const layers = scene.fill?.build?.layers || [];
  return toFrames(2.0 + Math.floor(layers.length / 2) * 5.0, fps);
};

export const getLayoutConfig = (scene, fps) => {
  return {
    getBoundingBoxes: (scene) => {
      const { createTextBoundingBox } = require('../sdk/collision-detection');
      return [
        createTextBoundingBox({
          id: 'title',
          text: scene.fill?.build?.title || 'Build',
          x: 960,
          y: 110,
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
  layerCount: { min: 3, max: 6, recommended: '4-5' },
  domainAgnostic: true,
  crossDomainTested: ['architecture', 'security', 'system-design']
};
