/**
 * Hero Registry - Type-Based Polymorphism for Visual Elements
 * 
 * Enables templates to render different hero visual types (images, SVGs, Lottie, etc.)
 * without hardcoding specific implementations. Supports animation and styling per type.
 * 
 * @module heroRegistry
 * @category SDK
 * @subcategory Agnostic Template System
 */

import React from 'react';
import { interpolate } from 'remotion';
import { toFrames } from './time';

/**
 * Hero Type Registry
 * Maps type strings to renderer functions
 * 
 * Each renderer receives:
 * - config: Hero configuration from JSON
 * - frame: Current frame number
 * - beats: Scene beat timings
 * - colors: Color tokens
 * - easingMap: Easing functions
 * - fps: Frames per second
 * - svgRef: Optional SVG ref for rough rendering
 */
export const HERO_TYPES = {};

/**
 * Image Hero Renderer
 * Renders a standard image asset
 * 
 * @param {Object} config - Hero configuration
 * @param {string} config.asset - Image path
 * @param {Object} config.style - Optional style overrides
 * @returns {JSX.Element} Image element
 */
const ImageRenderer = ({ config, frame, beats, colors, easingMap, fps }) => {
  const { asset, style = {} } = config;
  
  return (
    <img
      src={asset}
      alt={config.alt || "Hero visual"}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        ...style
      }}
    />
  );
};

/**
 * SVG Hero Renderer
 * Renders an SVG asset (can be inline or external)
 * 
 * @param {Object} config - Hero configuration
 * @param {string} config.asset - SVG path or inline SVG string
 * @param {Object} config.colors - Color mapping for SVG elements
 * @returns {JSX.Element} SVG element
 */
const SVGRenderer = ({ config, frame, beats, colors, easingMap, fps }) => {
  const { asset, style = {}, colorMap = {} } = config;
  
  // For now, render as img with SVG source
  // Future: Parse and colorize inline SVG
  return (
    <img
      src={asset}
      alt={config.alt || "SVG visual"}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        ...style
      }}
    />
  );
};

/**
 * Rough SVG Renderer
 * Placeholder for rough.js SVG rendering
 * Actual rendering happens in parent component with svgRef
 * 
 * @param {Object} config - Hero configuration
 * @returns {null} Rendering handled by parent
 */
const RoughSVGRenderer = ({ config, frame, beats, colors, easingMap, fps, svgRef }) => {
  // This is a placeholder - actual rough.js rendering
  // happens in the parent component using svgRef
  // This just signals that rough rendering is needed
  return null;
};

/**
 * Emoji Hero Renderer
 * Renders an emoji as a hero visual
 * 
 * @param {Object} config - Hero configuration
 * @param {string} config.value - Emoji character
 * @param {number} config.scale - Scale multiplier
 * @returns {JSX.Element} Emoji element
 */
const EmojiRenderer = ({ config, frame, beats, colors, easingMap, fps }) => {
  const { value, scale = 1.0, style = {} } = config;
  
  return (
    <div style={{
      fontSize: `${80 * scale}px`,
      lineHeight: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...style
    }}>
      {value || '⭐'}
    </div>
  );
};

/**
 * Lottie Hero Renderer
 * Renders a Lottie animation
 * 
 * @param {Object} config - Hero configuration
 * @param {string} config.asset - Lottie JSON path
 * @param {string} config.colorize - Color to apply
 * @returns {JSX.Element} Lottie player element
 */
const LottieRenderer = ({ config, frame, beats, colors, easingMap, fps }) => {
  const { asset, colorize, style = {} } = config;
  
  // Simplified Lottie rendering
  // In production, use proper Lottie integration
  return (
    <div style={{ ...style }}>
      {/* Lottie player would go here */}
      <div>Lottie: {asset}</div>
    </div>
  );
};

/**
 * Custom Component Renderer
 * Allows registration of custom React components
 * 
 * @param {Object} config - Hero configuration
 * @param {string} config.componentId - ID of registered custom component
 * @param {Object} config.props - Props to pass to component
 * @returns {JSX.Element} Custom component
 */
const CustomRenderer = ({ config, frame, beats, colors, easingMap, fps }) => {
  const { componentId, props = {} } = config;
  
  const CustomComponent = CUSTOM_HERO_COMPONENTS[componentId];
  
  if (!CustomComponent) {
    console.warn(`Custom hero component not found: ${componentId}`);
    return <div>Component not found: {componentId}</div>;
  }
  
  return <CustomComponent {...props} frame={frame} beats={beats} colors={colors} />;
};

/**
 * Registry for custom hero components
 * Templates can register their own custom renderers here
 */
export const CUSTOM_HERO_COMPONENTS = {};

/**
 * Register a custom hero component
 * 
 * @param {string} id - Unique identifier for the component
 * @param {React.Component} component - React component to register
 * 
 * @example
 * registerCustomHero('footballField', FootballFieldComponent);
 */
export const registerCustomHero = (id, component) => {
  CUSTOM_HERO_COMPONENTS[id] = component;
};

/**
 * Initialize hero type registry
 */
HERO_TYPES['image'] = ImageRenderer;
HERO_TYPES['svg'] = SVGRenderer;
HERO_TYPES['roughSVG'] = RoughSVGRenderer;
HERO_TYPES['emoji'] = EmojiRenderer;
HERO_TYPES['lottie'] = LottieRenderer;
HERO_TYPES['custom'] = CustomRenderer;

/**
 * Register a new hero type
 * 
 * @param {string} type - Type identifier
 * @param {Function} renderer - Renderer function
 * 
 * @example
 * registerHeroType('chart', ChartRenderer);
 */
export const registerHeroType = (type, renderer) => {
  HERO_TYPES[type] = renderer;
};

/**
 * Calculate hero animations based on beats
 * Supports entrance, exit, and transform animations
 * 
 * @param {number} frame - Current frame
 * @param {Object} config - Hero configuration
 * @param {Object} beats - Scene beats
 * @param {Object} easingMap - Easing functions
 * @param {number} fps - Frames per second
 * @returns {Object} Animation state (opacity, scale, position)
 */
export const calculateHeroAnimation = (frame, config, beats, easingMap, fps) => {
  const animation = config.animation || {};
  const transforms = config.transforms || [];
  
  let opacity = 1;
  let scale = 1;
  let translateX = 0;
  let translateY = 0;
  let rotation = 0;
  
  // Entrance animation
  if (animation.entrance === 'fadeIn') {
    const beatKey = animation.entranceBeat || 'mapReveal';
    const startFrame = toFrames(beats[beatKey] || 0, fps);
    const duration = toFrames(animation.entranceDuration || 1.3, fps);
    
    if (frame < startFrame) {
      opacity = 0;
    } else {
      opacity = interpolate(
        frame,
        [startFrame, startFrame + duration],
        [0, 1],
        { extrapolateRight: 'clamp', easing: easingMap?.smooth }
      );
    }
  }
  
  if (animation.entrance === 'drawOn') {
    // Draw-on handled by parent component for rough.js
    const beatKey = animation.entranceBeat || 'mapReveal';
    const startFrame = toFrames(beats[beatKey] || 0, fps);
    
    if (frame < startFrame) {
      opacity = 0;
    }
  }
  
  // Process transforms (shrink to corner, etc.)
  transforms.forEach(transform => {
    const beatKey = transform.beat;
    const startFrame = toFrames(beats[beatKey] || 0, fps);
    const duration = toFrames(transform.duration || 1.2, fps);
    
    if (frame >= startFrame) {
      const progress = interpolate(
        frame,
        [startFrame, startFrame + duration],
        [0, 1],
        { extrapolateRight: 'clamp', easing: easingMap?.power2InOut }
      );
      
      if (transform.targetScale !== undefined) {
        scale = interpolate(
          progress,
          [0, 1],
          [scale, transform.targetScale],
          { extrapolateRight: 'clamp' }
        );
      }
      
      if (transform.targetPos) {
        translateX = interpolate(
          progress,
          [0, 1],
          [0, transform.targetPos.x || 0],
          { extrapolateRight: 'clamp' }
        );
        translateY = interpolate(
          progress,
          [0, 1],
          [0, transform.targetPos.y || 0],
          { extrapolateRight: 'clamp' }
        );
      }
      
      if (transform.rotation !== undefined) {
        rotation = interpolate(
          progress,
          [0, 1],
          [0, transform.rotation],
          { extrapolateRight: 'clamp' }
        );
      }
    }
  });
  
  return {
    opacity,
    scale,
    translateX,
    translateY,
    rotation,
    transform: `translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(${rotation}deg)`
  };
};

/**
 * Render hero element with appropriate type
 * 
 * @param {Object} config - Hero configuration
 * @param {string} config.type - Hero type (image, svg, roughSVG, lottie, custom)
 * @param {number} frame - Current frame
 * @param {Object} beats - Scene beats
 * @param {Object} colors - Color tokens
 * @param {Object} easingMap - Easing functions
 * @param {number} fps - Frames per second
 * @param {React.Ref} svgRef - Optional SVG ref for rough.js
 * @returns {JSX.Element} Rendered hero element
 * 
 * @example
 * const heroVisual = renderHero(
 *   { type: 'image', asset: '/football.jpg' },
 *   frame, beats, colors, easingMap, fps
 * );
 */
export const renderHero = (config, frame, beats, colors, easingMap, fps, svgRef = null) => {
  const Renderer = HERO_TYPES[config.type];
  
  if (!Renderer) {
    console.warn(`Unknown hero type: ${config.type}. Falling back to image.`);
    return HERO_TYPES['image']({ config, frame, beats, colors, easingMap, fps });
  }
  
  return <Renderer 
    config={config} 
    frame={frame} 
    beats={beats} 
    colors={colors} 
    easingMap={easingMap}
    fps={fps}
    svgRef={svgRef}
  />;
};

/**
 * Get hero animation progress for draw-on effects
 * Used for rough.js path drawing
 * 
 * @param {number} frame - Current frame
 * @param {Object} beats - Scene beats
 * @param {string} beatKey - Beat to start from
 * @param {number} duration - Duration in seconds
 * @param {number} fps - Frames per second
 * @returns {number} Progress (0-1)
 */
export const getHeroDrawProgress = (frame, beats, beatKey = 'mapReveal', duration = 1.3, fps) => {
  const startFrame = toFrames(beats[beatKey] || 0, fps);
  const durationFrames = toFrames(duration, fps);
  
  if (frame < startFrame) return 0;
  if (frame >= startFrame + durationFrames) return 1;
  
  return (frame - startFrame) / durationFrames;
};

/**
 * Default hero configuration
 * Used as fallback when hero config is incomplete
 */
export const DEFAULT_HERO_CONFIG = {
  type: 'image',
  asset: '',
  position: 'center',
  scale: 1.0,
  rotation: 0,
  opacity: 1.0,
  animation: {
    entrance: 'fadeIn',
    entranceBeat: 'mapReveal',
    entranceDuration: 1.3
  },
  transforms: [],
  filters: {},
  style: {}
};

/**
 * Merge hero config with defaults
 * 
 * @param {Object} config - User hero configuration
 * @returns {Object} Complete hero configuration
 */
export const mergeHeroConfig = (config = {}) => {
  return {
    ...DEFAULT_HERO_CONFIG,
    ...config,
    animation: {
      ...DEFAULT_HERO_CONFIG.animation,
      ...(config.animation || {})
    },
    style: {
      ...DEFAULT_HERO_CONFIG.style,
      ...(config.style || {})
    }
  };
};
