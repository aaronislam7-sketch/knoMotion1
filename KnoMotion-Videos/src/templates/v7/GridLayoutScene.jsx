import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import {
  toFrames,
  SpotlightEffect,
  NoiseTexture,
  generateAmbientParticles,
  renderAmbientParticles,
} from '../../sdk';

import { AppMosaic } from '../../sdk/components/mid-level/AppMosaic';
import { NotebookCard } from '../../sdk/elements/NotebookCard';

// NEW: layout engine
import {
  ARRANGEMENT_TYPES,
  calculateItemPositions,
  createLayoutAreas,
} from '../../sdk/layout/layoutEngineV2';

// Simple animation helper for title
const fadeIn = (frame, startFrame, duration) => {
  const progress = interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return { opacity: progress };
};

/**
 * SCENE TEMPLATE: GridLayoutScene - V7.1
 */

export const TEMPLATE_VERSION = '7.1';
export const TEMPLATE_ID = 'GridLayoutScene';

const DEFAULT_CONFIG = {
  content: {
    title: null,
    items: [
      { label: 'Item 1', icon: '🎯', description: 'First item' },
      { label: 'Item 2', icon: '💡', description: 'Second item' },
      { label: 'Item 3', icon: '🚀', description: 'Third item' },
    ],
  },

  layout: {
    columns: 3,
    gap: 40,
    itemSize: 240,
    adaptiveSize: true,
    maxItemsPerRow: 4,
  },

  style_tokens: {
    colors: {
      bg: '#1A1A1A',
      primary: '#FF6B35',
      secondary: '#4ECDC4',
      text: '#FFFFFF',
      textSecondary: '#B0B0B0',
      cardBg: '#2A2A2A',
    },
    fonts: {
      size_title: 64,
      size_label: 28,
      size_description: 16,
      weight_title: 800,
      weight_label: 700,
      weight_body: 400,
      family: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    },
    spacing: {
      padding: 80,
      gap: 40,
      titleHeight: 120,
    },
  },

  beats: {
    entrance: 0.5,
    title: 1.0,
    firstItem: 2.0,
    itemInterval: 0.15,
    hold: 8.0,
    exit: 10.0,
  },

  animations: {
    title: {
      entrance: 'fadeIn',
      duration: 0.8,
    },
    items: {
      entrance: 'cardEntrance',
      duration: 0.6,
      stagger: {
        enabled: true,
        type: 'index',
        delay: 0.15,
      },
    },
  },

  effects: {
    particles: {
      enabled: false,
      count: 15,
      color: '#4ECDC4',
      opacity: 0.3,
    },
    spotlight: {
      enabled: false,
      position: { x: 50, y: 50 },
      size: 800,
      opacity: 0.15,
    },
    noise: {
      enabled: true,
      opacity: 0.03,
    },
  },

  mid_level_components: {
    appMosaic: {
      enabled: false,
      focusZoom: false,
      hoverEffect: false,
      focusIndex: null,
    },
  },
};

// Helper: Calculate item start frame based on stagger type
const calculateItemStartFrame = (index, row, col, staggerConfig, baseFrame, fps) => {
  if (!staggerConfig.enabled) return baseFrame;
  const delayFrames = staggerConfig.delay * fps;

  switch (staggerConfig.type) {
    case 'row':
      return baseFrame + row * delayFrames;
    case 'column':
      return baseFrame + col * delayFrames;
    case 'index':
    default:
      return baseFrame + index * delayFrames;
  }
};

// Fallback rendering for when AppMosaic is disabled
const renderGridItem = (item, index, slot, style_tokens, frame, startFrame, fps, animations) => {
  const { colors } = style_tokens;
  const duration = (animations.items.duration || 0.6) * fps;
  const animStyle = fadeIn(frame, startFrame, duration);

  return (
    <div
      key={index}
      style={{
        position: 'absolute',
        left: slot.x - slot.width / 2,
        top: slot.y - slot.height / 2,
        width: slot.width,
        height: slot.height,
        opacity: animStyle.opacity,
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
};

export const GridLayoutScene = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Merge with defaults
  const config = useMemo(
    () => ({
      ...DEFAULT_CONFIG,
      ...scene,
      content: { ...DEFAULT_CONFIG.content, ...scene.content },
      layout: { ...DEFAULT_CONFIG.layout, ...scene.layout },
      style_tokens: {
        colors: { ...DEFAULT_CONFIG.style_tokens.colors, ...scene.style_tokens?.colors },
        fonts: { ...DEFAULT_CONFIG.style_tokens.fonts, ...scene.style_tokens?.fonts },
        spacing: { ...DEFAULT_CONFIG.style_tokens.spacing, ...scene.style_tokens?.spacing },
      },
      beats: { ...DEFAULT_CONFIG.beats, ...scene.beats },
      animations: {
        title: { ...DEFAULT_CONFIG.animations.title, ...scene.animations?.title },
        items: {
          ...DEFAULT_CONFIG.animations.items,
          ...scene.animations?.items,
          stagger: {
            ...DEFAULT_CONFIG.animations.items.stagger,
            ...scene.animations?.items?.stagger,
          },
        },
      },
      effects: {
        particles: { ...DEFAULT_CONFIG.effects.particles, ...scene.effects?.particles },
        spotlight: { ...DEFAULT_CONFIG.effects.spotlight, ...scene.effects?.spotlight },
        noise: { ...DEFAULT_CONFIG.effects.noise, ...scene.effects?.noise },
      },
      mid_level_components: {
        ...DEFAULT_CONFIG.mid_level_components,
        ...scene.mid_level_components,
        appMosaic: {
          ...DEFAULT_CONFIG.mid_level_components.appMosaic,
          ...scene.mid_level_components?.appMosaic,
        },
      },
    }),
    [scene],
  );

  const { content, layout, style_tokens, beats, animations, effects, mid_level_components } = config;
  const colors = style_tokens.colors;
  const fonts = style_tokens.fonts;
  const items = content.items || [];
  const viewport = { width, height };

  // Layout areas (title-safe + content)
  const areas = useMemo(
    () =>
      createLayoutAreas({
        viewport,
        padding: style_tokens.spacing.padding,
        titleHeight: content.title ? style_tokens.spacing.titleHeight : 0,
        footerHeight: 0,
      }),
    [viewport.width, viewport.height, style_tokens.spacing, content.title],
  );

  // Use layoutEngineV2 to get grid slots
  const gridSlots = useMemo(() => {
    if (!items.length) return [];

    const rawPositions = calculateItemPositions(items, {
      arrangement: ARRANGEMENT_TYPES.GRID,
      area: areas.content,
      columns: Math.min(layout.columns, layout.maxItemsPerRow),
      gap: layout.gap,
      itemWidth: layout.itemSize,
      itemHeight: layout.itemSize,
      centerGrid: true,
      viewport,
    });

    return rawPositions.map((pos, index) => ({
      x: pos.x,
      y: pos.y,
      width: pos.width,
      height: pos.height,
      row: Math.floor(index / Math.min(layout.columns, layout.maxItemsPerRow)),
      column: index % Math.min(layout.columns, layout.maxItemsPerRow),
    }));
  }, [items.length, layout.columns, layout.maxItemsPerRow, layout.gap, layout.itemSize, areas.content, viewport]);

  // Particles
  const particles = useMemo(() => {
    if (!effects.particles.enabled) return [];
    return generateAmbientParticles({
      count: effects.particles.count,
      seed: 143,
      color: effects.particles.color,
      bounds: { w: width, h: height },
    });
  }, [effects.particles.enabled, effects.particles.count, effects.particles.color, width, height]);

  // Beat frames
  const beatFrames = {
    entrance: toFrames(beats.entrance, fps),
    title: toFrames(beats.title, fps),
    firstItem: toFrames(beats.firstItem, fps),
  };

  const titleAnim =
    content.title && areas.title
      ? fadeIn(frame, beatFrames.title, (animations.title.duration || 0.8) * fps)
      : null;

  const useAppMosaic = mid_level_components?.appMosaic?.enabled;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      {/* Background Effects */}
      {effects.spotlight.enabled && (
        <SpotlightEffect
          x={effects.spotlight.position.x}
          y={effects.spotlight.position.y}
          size={effects.spotlight.size}
          color={colors.primary}
          opacity={effects.spotlight.opacity}
        />
      )}

      {effects.noise.enabled && <NoiseTexture opacity={effects.noise.opacity} />}

      {effects.particles.enabled && particles.length > 0 && (
        <svg className="absolute inset-0 pointer-events-none">
          {renderAmbientParticles(particles, frame, fps, { opacity: effects.particles.opacity })}
        </svg>
      )}

      {/* Title */}
      {content.title && areas.title && (
        <div
          className="absolute text-center max-w-[90%] left-1/2 -translate-x-1/2"
          style={{
            top: areas.title.top + areas.title.height / 2 - 30,
            color: colors.text,
            fontFamily: fonts.family,
            fontWeight: fonts.weight_title,
            fontSize: Math.min(fonts.size_title, 72),
            opacity: titleAnim?.opacity ?? 1,
          }}
        >
          {content.title}
        </div>
      )}

      {/* Grid Content */}
      <div className="absolute inset-0">
        {useAppMosaic ? (
          <AppMosaic
            items={items}
            positions={gridSlots}
            layout={{
              columns: Math.min(layout.columns, layout.maxItemsPerRow),
              gap: layout.gap,
            }}
            style={style_tokens}
            animations={animations.items}
            effects={{
              focusZoom: mid_level_components.appMosaic.focusZoom,
              focusIndex: mid_level_components.appMosaic.focusIndex ?? null,
            }}
            startFrame={beatFrames.firstItem}
            viewport={viewport}
          />
        ) : (
          items.map((item, index) => {
            const slot = gridSlots[index];
            if (!slot) return null;

            const itemStartFrame = calculateItemStartFrame(
              index,
              slot.row,
              slot.column,
              animations.items.stagger,
              beatFrames.firstItem,
              fps,
            );

            return renderGridItem(
              item,
              index,
              slot,
              style_tokens,
              frame,
              itemStartFrame,
              fps,
              animations,
            );
          })
        )}
      </div>
    </AbsoluteFill>
  );
};

// Export getDuration for template registry (returns FRAMES)
export const getDuration = (scene, fps = 30) => {
  const config = { ...DEFAULT_CONFIG, ...scene };
  const exitTime = config.beats?.exit || DEFAULT_CONFIG.beats.exit;
  return Math.ceil((exitTime + 1.0) * fps);
};

export const TEMPLATE_METADATA = {
  id: TEMPLATE_ID,
  version: TEMPLATE_VERSION,
  name: 'Grid Layout Scene',
  description: 'N×M grid arrangement with staggered animations',
  category: 'Layout',
  learningIntentions: ['EXPLAIN', 'COMPARE', 'SHOWCASE'],
  requiredFields: ['content.items'],
  optionalFields: ['content.title', 'layout', 'animations'],
  supportedStaggerTypes: ['index', 'row', 'column'],
  integrations: ['AppMosaic'],
};
