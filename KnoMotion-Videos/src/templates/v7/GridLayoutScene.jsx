import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import {
  toFrames,
  GlassmorphicPane,
  SpotlightEffect,
  NoiseTexture,
  generateAmbientParticles,
  renderAmbientParticles,
  getCardEntrance
} from '../../sdk';

import { AppMosaic } from '../../sdk/components/mid-level/AppMosaic';

// 🔵 NEW: import layout engine v2
import {
  ARRANGEMENT_TYPES,
  calculateItemPositions,
} from '../../sdk/layout/layoutEngineV2';

// Simple animation helpers (inline to avoid import conflicts)
const fadeIn = (frame, startFrame, duration) => {
  const progress = interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });
  return { opacity: progress };
};

const slideIn = (frame, startFrame, duration, direction = 'up', distance = 50) => {
  const progress = interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });
  const translations = {
    left: `translateX(${(1 - progress) * distance}px)`,
    right: `translateX(${(1 - progress) * -distance}px)`,
    up: `translateY(${(1 - progress) * distance}px)`,
    down: `translateY(${(1 - progress) * -distance}px)`
  };
  return { opacity: progress, transform: translations[direction] || translations.up };
};

const scaleIn = (frame, startFrame, duration, fromScale = 0.7) => {
  const progress = interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });
  return { opacity: progress, transform: `scale(${fromScale + (1 - fromScale) * progress})` };
};

/**
 * SCENE TEMPLATE: GridLayoutScene - V7.0
 */

export const TEMPLATE_VERSION = '7.0';
export const TEMPLATE_ID = 'GridLayoutScene';

const DEFAULT_CONFIG = {
  content: {
    title: null,
    items: [
      { label: 'Item 1', icon: '🎯', description: 'First item' },
      { label: 'Item 2', icon: '💡', description: 'Second item' },
      { label: 'Item 3', icon: '🚀', description: 'Third item' }
    ]
  },
 
  layout: {
    columns: 3,
    gap: 40,
    itemSize: 240,
    adaptiveSize: true,
    maxItemsPerRow: 4,
    alignment: 'center'
  },
 
  style_tokens: {
    colors: {
      bg: '#1A1A1A',
      primary: '#FF6B35',
      secondary: '#4ECDC4',
      text: '#FFFFFF',
      textSecondary: '#B0B0B0',
      cardBg: '#2A2A2A'
    },
    fonts: {
      size_title: 64,
      size_label: 28,
      size_description: 16,
      weight_title: 800,
      weight_label: 700,
      weight_body: 400,
      family: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    },
    spacing: {
      padding: 80,
      gap: 40
    }
  },
 
  beats: {
    entrance: 0.5,
    title: 1.0,
    firstItem: 2.0,
    itemInterval: 0.15,
    hold: 8.0,
    exit: 10.0
  },
 
  animations: {
    title: {
      entrance: 'fadeIn',
      duration: 0.8
    },
    items: {
      entrance: 'cardEntrance',
      duration: 0.6,
      stagger: {
        enabled: true,
        type: 'index',
        delay: 0.15
      }
    }
  },
 
  effects: {
    particles: {
      enabled: false,
      count: 15,
      color: '#4ECDC4',
      opacity: 0.3
    },
    spotlight: {
      enabled: false,
      position: { x: 50, y: 50 },
      size: 800,
      opacity: 0.15
    },
    noise: {
      enabled: true,
      opacity: 0.03
    },
    itemGlass: {
      enabled: true,
      glowOpacity: 0.15,
      borderOpacity: 0.4
    }
  },
 
  mid_level_components: {
    appMosaic: {
      enabled: false,
      focusZoom: false,
      hoverEffect: false
    }
  }
};

// Helper: Calculate item start frame based on stagger type
const calculateItemStartFrame = (index, row, col, staggerConfig, baseFrame, itemsPerRow) => {
  if (!staggerConfig.enabled) {
    return baseFrame;
  }
 
  const delayFrames = staggerConfig.delay * 30; // TODO: use fps instead
 
  switch (staggerConfig.type) {
    case 'row':
      return baseFrame + (row * delayFrames);
    case 'column':
      return baseFrame + (col * delayFrames);
    case 'index':
    default:
      return baseFrame + (index * delayFrames);
  }
};

// Helper: Render individual grid item
const renderGridItem = (item, index, slot, style, frame, startFrame, fps, animations, effects) => {
  const { colors, fonts } = style;
  const animConfig = animations.items;
  const duration = (animConfig.duration || 0.6) * fps;

  const size = Math.min(slot.width, slot.height);
 
  // For now keep simple fade; mid-level / SDK can own fancier stuff
  let animStyle = fadeIn(frame, startFrame, duration);
 
  const itemColor = item.color || colors.primary;

  return (
    <div
      key={index}
      style={{
        position: 'absolute',
        left: slot.x - size / 2,
        top: slot.y - size / 2,
        width: size,
        height: size,
        ...animStyle,
      }}
    >
      {effects.itemGlass.enabled ? (
        <GlassmorphicPane
          innerRadius={20}
          glowOpacity={effects.itemGlass.glowOpacity}
          borderOpacity={effects.itemGlass.borderOpacity}
          backgroundColor={`${itemColor}15`}
          style={{
            width: '100%',
            height: '100%',
            border: `3px solid ${itemColor}40`,
            borderRadius: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            gap: 12
          }}
        >
          {item.icon && (
            <div style={{ fontSize: 48, lineHeight: 1 }}>
              {item.icon}
            </div>
          )}
          <div
            style={{
              color: colors.text,
              fontSize: Math.min(fonts.size_label, 28),
              fontWeight: fonts.weight_label,
              fontFamily: fonts.family,
              textAlign: 'center',
              lineHeight: 1.2,
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {item.label}
          </div>
          {item.description && (
            <div
              style={{
                color: colors.textSecondary,
                fontSize: Math.min(fonts.size_description, 16),
                fontWeight: fonts.weight_body,
                fontFamily: fonts.family,
                textAlign: 'center',
                lineHeight: 1.3,
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical'
              }}
            >
              {item.description}
            </div>
          )}
        </GlassmorphicPane>
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: colors.cardBg,
            border: `3px solid ${itemColor}`,
            borderRadius: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            gap: 12
          }}
        >
          {item.icon && (
            <div style={{ fontSize: 48, lineHeight: 1 }}>
              {item.icon}
            </div>
          )}
          <div
            style={{
              color: colors.text,
              fontSize: fonts.size_label,
              fontWeight: fonts.weight_label,
              fontFamily: fonts.family,
              textAlign: 'center'
            }}
          >
            {item.label}
          </div>
          {item.description && (
            <div
              style={{
                color: colors.textSecondary,
                fontSize: fonts.size_description,
                fontWeight: fonts.weight_body,
                fontFamily: fonts.family,
                textAlign: 'center'
              }}
            >
              {item.description}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const GridLayoutScene = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
 
  // Merge with defaults
  const config = useMemo(() => ({
    ...DEFAULT_CONFIG,
    ...scene,
    content: { ...DEFAULT_CONFIG.content, ...scene.content },
    layout: { ...DEFAULT_CONFIG.layout, ...scene.layout },
    style_tokens: {
      colors: { ...DEFAULT_CONFIG.style_tokens.colors, ...scene.style_tokens?.colors },
      fonts: { ...DEFAULT_CONFIG.style_tokens.fonts, ...scene.style_tokens?.fonts },
      spacing: { ...DEFAULT_CONFIG.style_tokens.spacing, ...scene.style_tokens?.spacing }
    },
    beats: { ...DEFAULT_CONFIG.beats, ...scene.beats },
    animations: {
      title: { ...DEFAULT_CONFIG.animations.title, ...scene.animations?.title },
      items: {
        ...DEFAULT_CONFIG.animations.items,
        ...scene.animations?.items,
        stagger: {
          ...DEFAULT_CONFIG.animations.items.stagger,
          ...scene.animations?.items?.stagger
        }
      }
    },
    effects: {
      particles: { ...DEFAULT_CONFIG.effects.particles, ...scene.effects?.particles },
      spotlight: { ...DEFAULT_CONFIG.effects.spotlight, ...scene.effects?.spotlight },
      noise: { ...DEFAULT_CONFIG.effects.noise, ...scene.effects?.noise },
      itemGlass: { ...DEFAULT_CONFIG.effects.itemGlass, ...scene.effects?.itemGlass }
    }
  }), [scene]);
 
  const { content, layout, style_tokens, beats, animations, effects, mid_level_components } = config;
  const colors = style_tokens.colors;
  const fonts = style_tokens.fonts;
  const items = content.items || [];
 
  const viewport = { width, height };

  // Grid config
  const columns = Math.min(layout.columns, layout.maxItemsPerRow);
  const rows = Math.ceil(items.length / Math.max(columns, 1));

  // Calculate responsive item size (you already had this – keep it)
  const availableWidth = width - (style_tokens.spacing.padding * 2);
  const availableHeight = height - (style_tokens.spacing.padding * 2) - (content.title ? 150 : 0);
 
  const maxItemWidth = (availableWidth - (layout.gap * (columns - 1))) / columns;
  const maxItemHeight = (availableHeight - (layout.gap * (rows - 1))) / rows;
  const itemSize = layout.adaptiveSize
    ? Math.min(layout.itemSize, maxItemWidth, maxItemHeight)
    : layout.itemSize;

  // 🔵 NEW: ask layout engine for positions
  const gridSlots = useMemo(() => {
    if (!items.length) return [];

    return calculateItemPositions(items, {
      arrangement: ARRANGEMENT_TYPES.GRID,
      basePosition: 'center',
      columns,
      columnSpacing: itemSize + layout.gap,
      rowSpacing: itemSize + layout.gap,
      centerGrid: true,
      viewport,
    }).map((pos, index) => ({
      x: pos.x,
      y: pos.y,
      width: itemSize,
      height: itemSize,
      row: Math.floor(index / columns),
      column: index % columns,
    }));
  }, [items.length, columns, itemSize, layout.gap, viewport.width, viewport.height]);

  // Particles
  const particles = useMemo(() => {
    if (!effects.particles.enabled) return [];
    return generateAmbientParticles({
      count: effects.particles.count,
      seed: 143,
      color: effects.particles.color,
      bounds: { w: width, h: height }
    });
  }, [effects.particles.enabled, effects.particles.count, effects.particles.color, width, height]);
 
  // Beat frames
  const beatFrames = {
    entrance: toFrames(beats.entrance, fps),
    title: toFrames(beats.title, fps),
    firstItem: toFrames(beats.firstItem, fps)
  };
 
  // Title animation
  const titleAnim = content.title ? (() => {
    const titleConfig = animations.title;
    const duration = (titleConfig.duration || 0.8) * fps;
    return fadeIn(frame, beatFrames.title, duration);
  })() : null;

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
     
      {effects.noise.enabled && (
        <NoiseTexture opacity={effects.noise.opacity} />
      )}
     
      {effects.particles.enabled && particles.length > 0 && (
        <svg style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
          {renderAmbientParticles(particles, frame, fps, { opacity: effects.particles.opacity })}
        </svg>
      )}
     
      {/* Optional Title */}
      {content.title && (
        <div
          style={{
            position: 'absolute',
            top: 80,
            left: '50%',
            transform: 'translateX(-50%)',
            ...titleAnim,
            color: colors.text,
            fontSize: Math.min(fonts.size_title, 72),
            fontWeight: fonts.weight_title,
            fontFamily: fonts.family,
            textAlign: 'center',
            maxWidth: '90%'
          }}
        >
          {content.title}
        </div>
      )}
     
      {/* Grid Content */}
      <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
        {useAppMosaic ? (
          <AppMosaic
            items={items}
            positions={gridSlots.map((slot) => ({ x: slot.x, y: slot.y }))}
            layout={{
              columns,
              gap: layout.gap,
              itemSize,
              centerGrid: true,
            }}
            style={style_tokens}
            animations={animations.items}
            effects={{
              glass: effects.itemGlass.enabled,
              glowOpacity: effects.itemGlass.glowOpacity,
              borderOpacity: effects.itemGlass.borderOpacity,
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
              columns
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
              effects
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
  integrations: ['AppMosaic']
};
