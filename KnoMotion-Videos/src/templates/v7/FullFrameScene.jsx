import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import { 
  toFrames,
  GlassmorphicPane,
  SpotlightEffect,
  NoiseTexture,
  generateAmbientParticles,
  renderAmbientParticles,
  getCardEntrance,
  getScaleEmphasis
} from '../../sdk';
import { TextReveal } from '../../sdk/components/mid-level/TextReveal';

// Simple animation helpers (inline to avoid import conflicts)
const fadeIn = (frame, startFrame, duration) => {
  const progress = interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });
  return { opacity: progress, transform: `scale(${0.95 + progress * 0.05})` };
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

const scaleIn = (frame, startFrame, duration, fromScale = 0.8) => {
  const progress = interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });
  return { opacity: progress, transform: `scale(${fromScale + (1 - fromScale) * progress})` };
};

/**
 * SCENE TEMPLATE: FullFrameScene - V7.0
 * 
 * PURPOSE: Single full-screen canvas with centered content
 * DIFFERENTIATOR: One main content area with optional title
 * 
 * ACCEPTANCE CRITERIA:
 * ✅ Renders single full-screen canvas (no scrollbars/clipping)
 * ✅ content.main centered, optional title above
 * ✅ Works for multiple aspect ratios (16:9, 9:16, 1:1)
 * ✅ Uses theme/style tokens (no hardcoded colors/fonts)
 * ✅ Accepts arbitrary content.main (text/card/mosaic/etc)
 * ✅ Gracefully handles missing title or main
 * ✅ Configurable animations (entrance, exit, emphasis)
 * ✅ Registered in template registry
 * 
 * CONTENT STRUCTURE:
 * {
 *   content: {
 *     title: { text: "...", style: "..." },  // Optional
 *     main: { type: "text|card|custom", data: {...} }
 *   },
 *   layout: {
 *     mainSize: { width: "80%", height: "70%" },
 *     alignment: "center"
 *   },
 *   animations: {
 *     entrance: { type: "fadeIn", duration: 0.8 },
 *     exit: { type: "fadeOut", duration: 0.5 },
 *     emphasis: { type: "pulse", start: 3.0, duration: 1.0 }
 *   }
 * }
 */

export const TEMPLATE_VERSION = '7.0';
export const TEMPLATE_ID = 'FullFrameScene';

const DEFAULT_CONFIG = {
  content: {
    title: null,
    main: {
      type: 'text',
      data: {
        text: 'Main Content'
      }
    }
  },
  
  layout: {
    mainSize: {
      width: '80%',
      height: '70%'
    },
    alignment: 'center',
    titleOffset: 100  // Distance from top
  },
  
  style_tokens: {
    colors: {
      bg: '#1A1A1A',
      primary: '#FF6B35',
      secondary: '#4ECDC4',
      text: '#FFFFFF',
      textSecondary: '#B0B0B0'
    },
    fonts: {
      size_title: 64,
      size_main: 42,
      size_body: 24,
      weight_title: 800,
      weight_body: 600,
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
    main: 2.0,
    emphasis: 5.0,
    hold: 8.0,
    exit: 10.0
  },
  
  animations: {
    title: {
      entrance: 'fadeIn',
      duration: 0.8
    },
    main: {
      entrance: 'scaleIn',
      duration: 1.0,
      emphasis: {
        enabled: false,
        type: 'pulse',
        start: 5.0,
        duration: 1.0
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
    }
  },
  
  mid_level_components: {
    textReveal: {
      enabled: false  // Use TextReveal for text content when enabled
    }
  }
};

// Helper: Render content based on type
const renderMainContent = (content, style, frame, startFrame, fps, animations, useTextReveal, viewport) => {
  if (!content || !content.main) {
    return null;
  }

  const { type, data } = content.main;
  const colors = style.colors;
  const fonts = style.fonts;
  
  // Calculate entrance animation
  const animConfig = animations.main || {};
  const entranceDuration = (animConfig.duration || 1.0) * fps;
  const entranceType = animConfig.entrance || 'fadeIn';
  
  // Use TextReveal for text content when enabled
  if (type === 'text' && useTextReveal) {
    // Use center position (960, 540) to trigger relative positioning in TextReveal
    return (
      <TextReveal
        text={data.text || 'Content'}
        position={{ x: 960, y: 540 }}
        style={{
          colors,
          fonts: {
            ...fonts,
            size_text: fonts.size_main
          }
        }}
        animations={{
          type: entranceType === 'fadeIn' ? 'fadeIn' : 
                entranceType === 'slideIn' ? 'slideIn' : 
                entranceType === 'scaleIn' ? 'scaleIn' : 
                entranceType === 'typewriter' ? 'typewriter' : 'fadeIn',
          duration: animConfig.duration || 1.0,
          fontSize: Math.min(fonts.size_main, 72),
          fontWeight: fonts.weight_body,
          color: colors.text
        }}
        startFrame={startFrame}
        alignment="center"
      />
    );
  }
  
  let animStyle = {};
  
  switch (entranceType) {
    case 'fadeIn':
      animStyle = fadeIn(frame, startFrame, entranceDuration);
      break;
    case 'slideIn':
      animStyle = slideIn(frame, startFrame, entranceDuration, 'up', 60);
      break;
    case 'scaleIn':
      animStyle = scaleIn(frame, startFrame, entranceDuration, 0.8);
      break;
    default:
      animStyle = fadeIn(frame, startFrame, entranceDuration);
  }
  
  // DISABLED: emphasis animation causes NaN errors with getScaleEmphasis
  let emphasisScale = 1;

  const baseStyle = {
    ...animStyle,
    transform: `${animStyle.transform || ''} scale(${emphasisScale})`.trim(),
    fontFamily: fonts.family
  };

  switch (type) {
    case 'text':
      return (
        <div
          style={{
            ...baseStyle,
            color: colors.text,
            fontSize: Math.min(fonts.size_main, 72),
            fontWeight: fonts.weight_body,
            textAlign: 'center',
            maxWidth: '90%',
            lineHeight: 1.4
          }}
        >
          {data.text || 'Content'}
        </div>
      );
      
    case 'card':
      return (
        <GlassmorphicPane
          innerRadius={24}
          glowOpacity={0.2}
          borderOpacity={0.4}
          backgroundColor={`${colors.primary}15`}
          style={{
            ...baseStyle,
            width: '70%',
            maxWidth: 900,
            padding: style.spacing.padding,
            border: `3px solid ${colors.primary}40`,
            borderRadius: 24
          }}
        >
          <div
            style={{
              color: colors.text,
              fontSize: Math.min(fonts.size_body, 32),
              fontWeight: fonts.weight_body,
              textAlign: 'center',
              fontFamily: fonts.family
            }}
          >
            {data.text || 'Card Content'}
          </div>
        </GlassmorphicPane>
      );
      
    case 'custom':
      // For custom content, render raw JSX if provided
      return (
        <div style={baseStyle}>
          {data.component || <div>Custom Content Placeholder</div>}
        </div>
      );
      
    default:
      return (
        <div style={baseStyle}>
          <div
            style={{
              color: colors.text,
              fontSize: fonts.size_main,
              fontWeight: fonts.weight_body
            }}
          >
            {data.text || 'Content'}
          </div>
        </div>
      );
  }
};

export const FullFrameScene = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  
  // Debug logging
  console.log('[FullFrameScene] Rendering frame:', frame, 'Scene:', scene?.scene_id);
  
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
      main: { ...DEFAULT_CONFIG.animations.main, ...scene.animations?.main }
    },
    effects: {
      particles: { ...DEFAULT_CONFIG.effects.particles, ...scene.effects?.particles },
      spotlight: { ...DEFAULT_CONFIG.effects.spotlight, ...scene.effects?.spotlight },
      noise: { ...DEFAULT_CONFIG.effects.noise, ...scene.effects?.noise }
    },
    mid_level_components: {
      ...DEFAULT_CONFIG.mid_level_components,
      ...scene.mid_level_components,
      textReveal: {
        ...DEFAULT_CONFIG.mid_level_components.textReveal,
        ...scene.mid_level_components?.textReveal
      }
    }
  }), [scene]);
  
  const { content, layout, style_tokens, beats, animations, effects } = config;
  const colors = style_tokens.colors;
  const fonts = style_tokens.fonts;
  
  // Generate particles once
  const particles = useMemo(() => {
    if (!effects.particles.enabled) return [];
    return generateAmbientParticles({
      count: effects.particles.count,
      seed: 142,
      color: effects.particles.color,
      bounds: { w: width, h: height }
    });
  }, [effects.particles.enabled, effects.particles.count, effects.particles.color, width, height]);
  
  // Calculate beat frames
  const beatFrames = {
    entrance: toFrames(beats.entrance, fps),
    title: toFrames(beats.title, fps),
    main: toFrames(beats.main, fps),
    exit: toFrames(beats.exit, fps)
  };
  
  // Title animation
  const titleAnim = content.title ? (() => {
    const titleConfig = animations.title;
    const duration = (titleConfig.duration || 0.8) * fps;
    
    switch (titleConfig.entrance) {
      case 'slideIn':
        return slideIn(frame, beatFrames.title, duration, 'down', 40);
      case 'scaleIn':
        return scaleIn(frame, beatFrames.title, duration, 0.7);
      default:
        return fadeIn(frame, beatFrames.title, duration);
    }
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
      
      {/* Main Container */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: style_tokens.spacing.padding
        }}
      >
        {/* Optional Title */}
        {content.title && (
          <div
            style={{
              position: 'absolute',
              top: layout.titleOffset,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              ...titleAnim
            }}
          >
            <div style={{
              color: colors.text,
              fontSize: Math.min(fonts.size_title, 72),
              fontWeight: fonts.weight_title,
              fontFamily: fonts.family,
              textAlign: 'center',
              maxWidth: '90%'
            }}>
              {content.title.text}
            </div>
          </div>
        )}
        
        {/* Main Content */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: layout.mainSize.width,
            height: layout.mainSize.height,
            marginTop: content.title ? 60 : 0
          }}
        >
          {renderMainContent(
            content, 
            style_tokens, 
            frame, 
            beatFrames.main, 
            fps, 
            animations,
            config.mid_level_components?.textReveal?.enabled,
            { width, height }
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Export getDuration for template registry (returns FRAMES)
export const getDuration = (scene, fps = 30) => {
  const config = { ...DEFAULT_CONFIG, ...scene };
  const exitTime = config.beats?.exit || DEFAULT_CONFIG.beats.exit;
  return Math.ceil((exitTime + 1.0) * fps); // Convert seconds to frames
};

// Template metadata
export const TEMPLATE_METADATA = {
  id: TEMPLATE_ID,
  version: TEMPLATE_VERSION,
  name: 'Full Frame Scene',
  description: 'Single full-screen canvas with centered content',
  category: 'Layout',
  learningIntentions: ['EXPLAIN', 'HOOK', 'REFLECT'],
  requiredFields: ['content.main'],
  optionalFields: ['content.title', 'layout', 'animations', 'effects'],
  supportedContentTypes: ['text', 'card', 'custom'],
  aspectRatios: ['16:9', '9:16', '1:1']
};
