/**
 * SafeZoneOverlay — debug layer drawn over a scene when `debugSafeZones` is on.
 *
 * Shows two things a human needs to judge a frame quickly:
 *   - the outer SAFE BAND (getViewportPadding px on every edge) as a red hatch;
 *     content should never be inside it (render-check `edge_bleed`)
 *   - every slot the scene's layout produces (resolveSceneSlots) as a dashed
 *     box with its name; a configured slot that draws nothing here is a
 *     `blank_slot`.
 *
 * Pure presentation, no side effects. Same geometry source as the renderer
 * itself, so what you see is what SceneRenderer used.
 */

import React from 'react';
import { AbsoluteFill } from 'remotion';
import { resolveSceneSlots } from '../sdk/scene-layout/sceneLayout';
import { getViewportPadding } from '../sdk/layout/viewportPresets';

const BAND_COLOR = 'rgba(220, 38, 38, 0.18)';
const BAND_EDGE = 'rgba(220, 38, 38, 0.8)';
const SLOT_EDGE = 'rgba(37, 99, 235, 0.9)';
const SLOT_FILL = 'rgba(37, 99, 235, 0.06)';
const CONFIGURED_EDGE = 'rgba(22, 163, 74, 0.95)';

export const SafeZoneOverlay = ({ layout, configuredSlots = {}, viewport }) => {
  const { width, height } = viewport;
  const padding = getViewportPadding(viewport);
  const slots = resolveSceneSlots(layout, viewport);
  const configured = new Set(Object.keys(configuredSlots || {}));

  const bands = [
    { left: 0, top: 0, width, height: padding },
    { left: 0, top: height - padding, width, height: padding },
    { left: 0, top: padding, width: padding, height: height - padding * 2 },
    { left: width - padding, top: padding, width: padding, height: height - padding * 2 },
  ];

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {bands.map((b, i) => (
        <div
          key={`band-${i}`}
          style={{
            position: 'absolute',
            ...b,
            background: `repeating-linear-gradient(45deg, ${BAND_COLOR} 0 8px, transparent 8px 16px)`,
            boxSizing: 'border-box',
          }}
        />
      ))}
      <div
        style={{
          position: 'absolute',
          left: padding,
          top: padding,
          width: width - padding * 2,
          height: height - padding * 2,
          border: `2px solid ${BAND_EDGE}`,
          boxSizing: 'border-box',
        }}
      />
      {Object.entries(slots).map(([name, area]) => {
        // left/right alias col1/col2 in 2-column layouts; draw each rectangle once.
        if ((name === 'left' && slots.col1) || (name === 'right' && slots.col2)) return null;
        const isConfigured = configured.has(name) || (name === 'col1' && configured.has('left')) || (name === 'col2' && configured.has('right'));
        return (
          <div
            key={name}
            style={{
              position: 'absolute',
              left: area.left,
              top: area.top,
              width: area.width,
              height: area.height,
              border: `2px dashed ${isConfigured ? CONFIGURED_EDGE : SLOT_EDGE}`,
              background: isConfigured ? 'transparent' : SLOT_FILL,
              boxSizing: 'border-box',
            }}
          >
            <span
              style={{
                position: 'absolute',
                left: 6,
                top: 4,
                padding: '2px 8px',
                borderRadius: 4,
                fontSize: 20,
                fontWeight: 600,
                color: '#fff',
                background: isConfigured ? CONFIGURED_EDGE : SLOT_EDGE,
              }}
            >
              {name} {Math.round(area.width)}×{Math.round(area.height)}{isConfigured ? '' : ' (empty)'}
            </span>
          </div>
        );
      })}
      <span
        style={{
          position: 'absolute',
          right: padding + 8,
          bottom: padding + 6,
          fontSize: 18,
          color: BAND_EDGE,
          background: 'rgba(255,255,255,0.7)',
          padding: '2px 6px',
          borderRadius: 4,
        }}
      >
        safe band {padding}px · layout {layout?.type ?? 'full'}
      </span>
    </AbsoluteFill>
  );
};

export default SafeZoneOverlay;
