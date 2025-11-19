// sdk/components/mid-level/AppMosaic.jsx
import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { getCardEntrance } from '../../index'; // keep existing import path for now
import { NotebookCard } from '../elements/NotebookCard';

/**
 * MID-LEVEL COMPONENT: AppMosaic - V7.1
 *
 * RESPONSIBILITIES:
 * - Take `items[]` + optional `positions[]` (from layout engine)
 * - Apply entrance / stagger animations
 * - Render NotebookCard in each slot
 *
 * ❗ No layout math beyond "if no positions, fall back to simple grid".
 */

export const AppMosaic = ({
  items = [],
  positions = [], // preferred: provided by template via layoutEngineV2
  layout = {},
  style = {},
  animations = {},
  effects = {},
  startFrame = 0,
  viewport = { width: 1920, height: 1080 },
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Layout defaults (only used for fallback layout)
  const {
    columns = 3,
    gap = 40,
    itemSize = 240,
    centerGrid = true,
  } = layout;

  const {
    colors = {
      primary: '#FF6B35',
      text: '#FFFFFF',
      textSecondary: '#B0B0B0',
    },
    fonts = {},
  } = style;

  const {
    entrance = 'cardEntrance',
    duration = 0.6,
    stagger = { enabled: true, delay: 0.15, type: 'index' },
  } = animations;

  const {
    focusZoom = false,
    focusIndex = null,
  } = effects;

  const useTemplatePositions = positions && positions.length === items.length;

  // Fallback layout if template didn't provide positions
  const fallbackPositions = !useTemplatePositions
    ? (() => {
        const rows = Math.ceil(items.length / columns);
        const gridWidth = columns * itemSize + (columns - 1) * gap;
        const gridHeight = rows * itemSize + (rows - 1) * gap;
        const startX = centerGrid ? (viewport.width - gridWidth) / 2 : 100;
        const startY = centerGrid ? (viewport.height - gridHeight) / 2 : 100;

        return items.map((_, index) => {
          const row = Math.floor(index / columns);
          const col = index % columns;
          const x = startX + col * (itemSize + gap) + itemSize / 2;
          const y = startY + row * (itemSize + gap) + itemSize / 2;
          return { x, y, width: itemSize, height: itemSize, row, column: col };
        });
      })()
    : [];

  const slots = useTemplatePositions
    ? positions.map((p, index) => ({
        x: p.x,
        y: p.y,
        width: p.width ?? itemSize,
        height: p.height ?? itemSize,
        row: p.row ?? Math.floor(index / columns),
        column: p.column ?? index % columns,
      }))
    : fallbackPositions;

  const getItemStartFrame = (index, row, column) => {
    if (!stagger.enabled) return startFrame;
    const delayFrames = stagger.delay * fps;

    switch (stagger.type) {
      case 'row':
        return startFrame + row * delayFrames;
      case 'column':
        return startFrame + column * delayFrames;
      case 'index':
      default:
        return startFrame + index * delayFrames;
    }
  };

  const getAnimStyle = (index, row, column) => {
    const itemStartFrame = getItemStartFrame(index, row, column);
    const animDuration = duration * fps;

    switch (entrance) {
      case 'cardEntrance':
        return getCardEntrance(
          frame,
          {
            startFrame: itemStartFrame,
            duration,
            direction: 'up',
            distance: 40,
            withGlow: true,
            glowColor: `${items[index]?.color || colors.primary}40`,
          },
          fps,
        );

      case 'fadeIn': {
        const opacity = interpolate(
          frame,
          [itemStartFrame, itemStartFrame + animDuration],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
        );
        return { opacity };
      }

      case 'scaleIn': {
        const progress = interpolate(
          frame,
          [itemStartFrame, itemStartFrame + animDuration],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
        );
        return {
          opacity: progress,
          transform: `scale(${0.7 + 0.3 * progress})`,
        };
      }

      default:
        return { opacity: 1 };
    }
  };

  return (
    <div className="relative w-full h-full">
      {items.map((item, index) => {
        const slot = slots[index];
        if (!slot) return null;

        const { x, y, width, height, row, column } = slot;
        const animStyle = getAnimStyle(index, row, column);

        const isFocused = focusZoom && focusIndex === index;
        const focusScale = isFocused ? 1.12 : 1;

        const baseTransform = animStyle.transform || '';
        const finalTransform = `${baseTransform} scale(${focusScale})`.trim();

        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: x - width / 2,
              top: y - height / 2,
              width,
              height,
              opacity: animStyle.opacity ?? 1,
              transform: finalTransform || undefined,
              transition: focusZoom ? 'transform 0.25s ease-out' : 'none',
              zIndex: isFocused ? 10 : 1,
            }}
          >
            <NotebookCard
              title={item.label}
              description={item.description}
              icon={item.icon}
              accentColor={item.color || colors.primary}
            />
          </div>
        );
      })}
    </div>
  );
};

export default AppMosaic;
