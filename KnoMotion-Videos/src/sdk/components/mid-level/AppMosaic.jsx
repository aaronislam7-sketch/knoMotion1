// AppMosaic.jsx
import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { fadeIn, slideIn, scaleIn, bounceIn, fadeSlide } from '/workspaces/knoMotion1/KnoMotion-Videos/src/sdk/animations/animations.js';
import { NotebookCard } from '/workspaces/knoMotion1/KnoMotion-Videos/src/sdk/elements/NotebookCard.tsx';
import { KNODE_THEME } from '/workspaces/knoMotion1/KnoMotion-Videos/src/sdk/theme/knodeTheme.ts';

export const AppMosaic = ({
  items = [],
  positions = [],
  layout = {},
  style = {},
  animations = {},
  effects = {},
  startFrame = 0,
  viewport = { width: 1920, height: 1080 },
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const {
    columns = 3,
    gap = 40,
    itemSize = 240,
    centerGrid = true,
  } = layout;

  // ⬇️ use Knode theme as base, allow overrides from template JSON
  const colors = { ...KNODE_THEME.colors, ...(style.colors || {}) };
  const fonts = { ...KNODE_THEME.fonts, ...(style.fonts || {}) };

  const {
    entrance = 'fadeSlide',
    duration = 0.6,
    direction = 'up',
    stagger = { enabled: true, delay: 0.15 },
  } = animations;

  const {
    focusZoom = false,
    focusIndex = null,
  } = effects;

  const durationFrames = Math.max(1, Math.round(duration * fps));
  const staggerFrames = stagger.enabled
    ? Math.max(0, Math.round((stagger.delay ?? 0.15) * fps))
    : 0;

  const useTemplatePositions = positions && positions.length === items.length;

  const getFallbackPosition = (index) => {
    const rows = Math.ceil(items.length / columns);
    const gridWidth = columns * itemSize + (columns - 1) * gap;
    const gridHeight = rows * itemSize + (rows - 1) * gap;

    const startX = centerGrid ? (viewport.width - gridWidth) / 2 : 100;
    const startY = centerGrid ? (viewport.height - gridHeight) / 2 : 100;

    const row = Math.floor(index / columns);
    const col = index % columns;

    return {
      x: startX + col * (itemSize + gap),
      y: startY + row * (itemSize + gap),
    };
  };

  const getEntranceStyle = (index) => {
    const itemStartFrame = startFrame + index * staggerFrames;

    switch (entrance) {
      case 'fadeIn':
        return fadeIn(frame, itemStartFrame, durationFrames);
      case 'slideIn':
        return slideIn(frame, itemStartFrame, durationFrames, direction, 50);
      case 'scaleIn':
        return scaleIn(frame, itemStartFrame, durationFrames, 0.7);
      case 'bounceIn':
        return bounceIn(frame, itemStartFrame, durationFrames);
      case 'fadeSlide':
      default:
        return fadeSlide(frame, itemStartFrame, durationFrames, direction, 40);
    }
  };

  const renderItem = (item, index) => {
    const basePos = useTemplatePositions
      ? { x: positions[index].x - itemSize / 2, y: positions[index].y - itemSize / 2 }
      : getFallbackPosition(index);

    const animStyle = getEntranceStyle(index);

    const isFocused = focusZoom && focusIndex === index;
    const focusScale = isFocused ? 1.15 : 1;

    const baseTransform = animStyle.transform || '';
    const focusTransform = ` scale(${focusScale})`;
    const transform =
      baseTransform.trim().length > 0
        ? `${baseTransform}${focusTransform}`
        : `scale(${focusScale})`;

    return (
      <div
        key={index}
        style={{
          position: 'absolute',
          left: basePos.x,
          top: basePos.y,
          width: itemSize,
          height: itemSize,
          opacity: animStyle.opacity ?? 1,
          transform,
          transition: focusZoom ? 'transform 0.3s ease' : 'none',
          zIndex: isFocused ? 10 : 1,
        }}
      >
        <NotebookCard
          label={item.label}
          description={item.description}
          icon={item.icon}
          color={item.color || colors.primary}
          styleTokens={{ colors, fonts }}
          variant={item.variant || 'default'}
        />
      </div>
    );
  };

  if (!items || items.length === 0) return null;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {items.map(renderItem)}
    </div>
  );
};

export default AppMosaic;
