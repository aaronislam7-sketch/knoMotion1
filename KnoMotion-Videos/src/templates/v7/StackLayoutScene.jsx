import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';
import { 
  toFrames,
  fadeIn,
  slideIn,
  scaleIn,
  fadeSlide
} from '../../sdk';
import { GlassmorphicPane, SpotlightEffect, NoiseTexture } from '../../sdk/broadcastEffects';
import { generateAmbientParticles, renderAmbientParticles } from '../../sdk/particleSystem';
import { getCardEntrance } from '../../sdk/microDelights';

/**
 * SCENE TEMPLATE: StackLayoutScene - V7.0
 * 
 * PURPOSE: Linear vertical or horizontal stack arrangement
 * DIFFERENTIATOR: Sequential item reveals with flexible direction
 * 
 * ACCEPTANCE CRITERIA:
 * ✅ Accepts content.items[] and stacks linearly
 * ✅ layout.direction = vertical or horizontal
 * ✅ Respects layout.spacing and layout.alignment
 * ✅ No overlap or clipping
 * ✅ Works with small and large item counts
 * ✅ Sequential/staggered reveal animations
 * ✅ Uses theme/style tokens
 * ✅ Agnostic to semantics (items can be steps, bullets, etc)
 * ✅ Registered and usable from JSON
 * 
 * CONTENT STRUCTURE:
 * {
 *   content: {
 *     title: "Stack Title",  // Optional
 *     items: [
 *       { text: "Step 1", icon: "1️⃣", description: "..." },
 *       { text: "Step 2", icon: "2️⃣", description: "..." }
 *     ]
 *   },
 *   layout: {
 *     direction: "vertical",  // or "horizontal"
 *     spacing: 80,
 *     alignment: "center",    // "center", "start", "end"
 *     itemWidth: 700,
 *     itemHeight: 120
 *   },
 *   animations: {
 *     stagger: { delay: 0.3 }
 *   }
 * }
 */

export const TEMPLATE_VERSION = '7.0';
export const TEMPLATE_ID = 'StackLayoutScene';

const DEFAULT_CONFIG = {
  content: {
    title: null,
    items: [
      { text: 'Step 1', icon: '1️⃣', description: 'First step' },
      { text: 'Step 2', icon: '2️⃣', description: 'Second step' },
      { text: 'Step 3', icon: '3️⃣', description: 'Third step' }
    ]
  },
  
  layout: {
    direction: 'vertical',  // 'vertical' or 'horizontal'
    spacing: 80,
    alignment: 'center',     // 'center', 'start', 'end'
    itemWidth: 700,
    itemHeight: 120,
    maxVisibleItems: 6       // Limit for visual clarity
  },
  
  style_tokens: {
    colors: {
      bg: '#1A1A1A',
      primary: '#FF6B35',
      secondary: '#4ECDC4',
      text: '#FFFFFF',
      textSecondary: '#B0B0B0',
      cardBg: '#2A2A2A',
      accent: '#FFD93D'
    },
    fonts: {
      size_title: 64,
      size_text: 28,
      size_description: 18,
      weight_title: 800,
      weight_text: 700,
      weight_body: 400,
      family: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    },
    spacing: {
      padding: 80,
      itemPadding: 24
    }
  },
  
  beats: {
    entrance: 0.5,
    title: 1.0,
    firstItem: 2.0,
    itemInterval: 0.4,
    hold: 8.0,
    exit: 10.0
  },
  
  animations: {
    title: {
      entrance: 'fadeIn',
      duration: 0.8
    },
    items: {
      entrance: 'slideIn',  // 'fadeIn', 'slideIn', 'scaleIn', 'cardEntrance'
      duration: 0.6,
      stagger: {
        enabled: true,
        delay: 0.3
      }
    }
  },
  
  effects: {
    particles: {
      enabled: false,
      count: 12,
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
    },
    showNumbers: true       // Show step numbers
  }
};

// Helper: Calculate item position
const calculateItemPosition = (index, totalItems, config, viewport) => {
  const { direction, spacing, alignment, itemWidth, itemHeight } = config;
  const { width, height } = viewport;
  
  if (direction === 'vertical') {
    const totalHeight = (totalItems * itemHeight) + ((totalItems - 1) * spacing);
    const startY = alignment === 'start' ? 200 : 
                   alignment === 'end' ? height - totalHeight - 200 :
                   (height - totalHeight) / 2;
    
    return {
      x: (width - itemWidth) / 2,
      y: startY + (index * (itemHeight + spacing))
    };
  } else {
    const totalWidth = (totalItems * itemWidth) + ((totalItems - 1) * spacing);
    const startX = alignment === 'start' ? 100 :
                   alignment === 'end' ? width - totalWidth - 100 :
                   (width - totalWidth) / 2;
    
    return {
      x: startX + (index * (itemWidth + spacing)),
      y: (height - itemHeight) / 2
    };
  }
};

// Helper: Render individual stack item
const renderStackItem = (item, index, position, size, style, frame, startFrame, fps, animations, effects, direction) => {
  const { colors, fonts, spacing } = style;
  const animConfig = animations.items;
  const duration = (animConfig.duration || 0.6) * fps;
  
  let animStyle = {};
  const slideDir = direction === 'vertical' ? 'up' : 'left';
  
  switch (animConfig.entrance) {
    case 'cardEntrance':
      animStyle = getCardEntrance(frame, {
        startFrame,
        duration: animConfig.duration || 0.6,
        direction: slideDir,
        distance: 50,
        withGlow: true,
        glowColor: `${colors.primary}40`
      }, fps);
      break;
    case 'slideIn':
      animStyle = slideIn(frame, startFrame, duration, slideDir, 60);
      break;
    case 'scaleIn':
      animStyle = scaleIn(frame, startFrame, duration, 0.7);
      break;
    default:
      animStyle = fadeIn(frame, startFrame, duration);
  }
  
  const itemNumber = index + 1;

  return (
    <div
      key={index}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        ...animStyle
      }}
    >
      {effects.itemGlass.enabled ? (
        <GlassmorphicPane
          innerRadius={16}
          glowOpacity={effects.itemGlass.glowOpacity}
          borderOpacity={effects.itemGlass.borderOpacity}
          backgroundColor={`${colors.primary}12`}
          style={{
            width: '100%',
            height: '100%',
            border: `2px solid ${colors.primary}30`,
            borderRadius: 16,
            display: 'flex',
            alignItems: 'center',
            padding: spacing.itemPadding,
            gap: 20
          }}
        >
          {/* Number or Icon */}
          {effects.showNumbers && (
            <div
              style={{
                minWidth: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: colors.primary,
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                fontWeight: 800,
                fontFamily: fonts.family,
                flexShrink: 0
              }}
            >
              {item.icon || itemNumber}
            </div>
          )}
          
          {/* Content */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div
              style={{
                color: colors.text,
                fontSize: Math.min(fonts.size_text, 32),
                fontWeight: fonts.weight_text,
                fontFamily: fonts.family,
                lineHeight: 1.3
              }}
            >
              {item.text}
            </div>
            {item.description && (
              <div
                style={{
                  color: colors.textSecondary,
                  fontSize: Math.min(fonts.size_description, 18),
                  fontWeight: fonts.weight_body,
                  fontFamily: fonts.family,
                  lineHeight: 1.4
                }}
              >
                {item.description}
              </div>
            )}
          </div>
        </GlassmorphicPane>
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: colors.cardBg,
            border: `2px solid ${colors.primary}`,
            borderRadius: 16,
            display: 'flex',
            alignItems: 'center',
            padding: spacing.itemPadding,
            gap: 20
          }}
        >
          {effects.showNumbers && (
            <div
              style={{
                minWidth: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: colors.primary,
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                fontWeight: 800,
                fontFamily: fonts.family
              }}
            >
              {item.icon || itemNumber}
            </div>
          )}
          
          <div style={{ flex: 1 }}>
            <div
              style={{
                color: colors.text,
                fontSize: fonts.size_text,
                fontWeight: fonts.weight_text,
                fontFamily: fonts.family
              }}
            >
              {item.text}
            </div>
            {item.description && (
              <div
                style={{
                  color: colors.textSecondary,
                  fontSize: fonts.size_description,
                  fontWeight: fonts.weight_body,
                  fontFamily: fonts.family,
                  marginTop: 6
                }}
              >
                {item.description}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const StackLayoutScene = ({ scene }) => {
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
      itemGlass: { ...DEFAULT_CONFIG.effects.itemGlass, ...scene.effects?.itemGlass },
      showNumbers: scene.effects?.showNumbers ?? DEFAULT_CONFIG.effects.showNumbers
    }
  }), [scene]);
  
  const { content, layout, style_tokens, beats, animations, effects } = config;
  const colors = style_tokens.colors;
  const fonts = style_tokens.fonts;
  
  // Limit items for visual clarity
  const items = (content.items || []).slice(0, layout.maxVisibleItems);
  
  // Generate particles once
  const particles = useMemo(() => {
    if (!effects.particles.enabled) return [];
    return generateAmbientParticles({
      count: effects.particles.count,
      seed: 144,
      color: effects.particles.color,
      bounds: { w: width, h: height }
    });
  }, [effects.particles.enabled, effects.particles.count, effects.particles.color, width, height]);
  
  // Calculate beat frames
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
      
      {/* Ambient Particles */}
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
      
      {/* Stack Items */}
      <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
        {items.map((item, index) => {
          const position = calculateItemPosition(index, items.length, layout, { width, height });
          
          const staggerDelay = animations.items.stagger.enabled 
            ? animations.items.stagger.delay * fps * index 
            : 0;
          const itemStartFrame = beatFrames.firstItem + staggerDelay;
          
          return renderStackItem(
            item,
            index,
            position,
            { width: layout.itemWidth, height: layout.itemHeight },
            style_tokens,
            frame,
            itemStartFrame,
            fps,
            animations,
            effects,
            layout.direction
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Export getDuration for template registry
export const getDuration = (scene) => {
  const config = { ...DEFAULT_CONFIG, ...scene };
  const exitTime = config.beats?.exit || DEFAULT_CONFIG.beats.exit;
  return exitTime + 1.0;
};

// Template metadata
export const TEMPLATE_METADATA = {
  id: TEMPLATE_ID,
  version: TEMPLATE_VERSION,
  name: 'Stack Layout Scene',
  description: 'Linear vertical or horizontal stack with sequential reveals',
  category: 'Layout',
  learningIntentions: ['GUIDE', 'EXPLAIN', 'APPLY'],
  requiredFields: ['content.items'],
  optionalFields: ['content.title', 'layout.direction', 'layout.spacing'],
  supportedDirections: ['vertical', 'horizontal'],
  maxRecommendedItems: 6
};
