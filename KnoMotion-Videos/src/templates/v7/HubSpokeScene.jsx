import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import { toFrames } from '../../sdk';

/**
 * SCENE TEMPLATE: HubSpokeScene - V7.0
 * 
 * PURPOSE: Central hub with radiating spokes (circular arrangement)
 * DIFFERENTIATOR: Radial layout with central element and surrounding items
 * 
 * ARCHITECTURE: Pure layout container - NO animations, NO styling, NO content rendering
 * - Only calculates circular positions for hub and spokes
 * - Passes layout info to mid-level components via props
 * - Mid-level components handle all rendering, animations, and styling
 * 
 * ACCEPTANCE CRITERIA:
 * ✅ Central hub element at screen center
 * ✅ 2-8 surrounding spokes arranged in circle
 * ✅ Configurable radius for spoke positioning
 * ✅ Optional connecting lines from hub to spokes
 * ✅ Dynamic spoke positioning based on count
 * ✅ Works with any mid-level component
 * ✅ Optional title support
 * ✅ Pure layout math only - no rendering logic
 * 
 * CONTENT STRUCTURE:
 * {
 *   content: {
 *     title: "Optional Title",  // Optional
 *     hub: { ...flexible content... },
 *     spokes: [
 *       { ...flexible content... },
 *       { ...flexible content... }
 *       // ... up to 8 spokes
 *     ]
 *   },
 *   layout: {
 *     radius: 400,
 *     hubSize: 200,
 *     spokeSize: 150,
 *     showConnectors: true,
 *     startAngle: 0  // Starting angle in degrees (0 = top)
 *   }
 * }
 */

export const TEMPLATE_VERSION = '7.0';
export const TEMPLATE_ID = 'HubSpokeScene';

const DEFAULT_CONFIG = {
  content: {
    title: null,
    hub: null,
    spokes: []
  },
  
  layout: {
    radius: 400,  // Distance from hub center to spoke centers
    hubSize: 200,  // Diameter of hub element
    spokeSize: 150,  // Diameter of spoke elements
    showConnectors: true,
    startAngle: 0,  // Starting angle in degrees (0 = top, 90 = right)
    maxSpokes: 8  // Maximum number of spokes
  },
  
  style_tokens: {
    colors: {
      bg: '#1A1A1A',
      hub: '#FF6B35',
      spoke: '#4ECDC4',
      connector: '#4ECDC4',
      text: '#FFFFFF'
    },
    fonts: {
      size_title: 64,
      weight_title: 800,
      family: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    },
    spacing: {
      padding: 80
    }
  },
  
  beats: {
    entrance: 0.5,
    title: 1.0,
    hub: 1.5,
    firstSpoke: 2.5,
    spokeInterval: 0.4,
    hold: 10.0,
    exit: 12.0
  }
};

/**
 * Calculate circular positions for hub and spokes
 * Returns layout info that mid-level components can use for rendering
 */
const calculateHubSpokeLayout = (config, viewport) => {
  const { layout, content } = config;
  const { radius, hubSize, spokeSize, startAngle, maxSpokes } = layout;
  
  const hasTitle = !!content.title;
  const titleHeight = hasTitle ? 120 : 0;
  const centerX = viewport.width / 2;
  const centerY = (viewport.height - titleHeight) / 2 + titleHeight;
  
  // Hub position (center)
  const hub = {
    x: centerX,
    y: centerY,
    size: hubSize,
    centerX,
    centerY
  };
  
  // Calculate spoke positions
  const spokes = content.spokes || [];
  const spokeCount = Math.min(spokes.length, maxSpokes);
  const spokePositions = [];
  
  for (let i = 0; i < spokeCount; i++) {
    // Calculate angle: evenly distribute around circle, starting from startAngle
    const angleDeg = startAngle + (360 / spokeCount) * i;
    const angleRad = (angleDeg * Math.PI) / 180;
    
    // Calculate position on circle
    const x = centerX + radius * Math.cos(angleRad);
    const y = centerY + radius * Math.sin(angleRad);
    
    // Calculate connector line endpoints
    const connectorStartX = centerX;
    const connectorStartY = centerY;
    const connectorEndX = x;
    const connectorEndY = y;
    
    spokePositions.push({
      index: i,
      x,
      y,
      size: spokeSize,
      centerX: x,
      centerY: y,
      angle: angleDeg,
      angleRad,
      connector: {
        startX: connectorStartX,
        startY: connectorStartY,
        endX: connectorEndX,
        endY: connectorEndY,
        length: radius
      }
    });
  }
  
  return {
    hub,
    spokes: spokePositions,
    titlePosition: hasTitle ? {
      x: centerX,
      y: 60,
      width: viewport.width - (config.style_tokens.spacing.padding * 2)
    } : null,
    center: { x: centerX, y: centerY },
    radius
  };
};

export const HubSpokeScene = ({ scene }) => {
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
    beats: { ...DEFAULT_CONFIG.beats, ...scene.beats }
  }), [scene]);
  
  const { content, layout, style_tokens, beats } = config;
  const colors = style_tokens.colors;
  const fonts = style_tokens.fonts;
  
  // Calculate hub-spoke layout positions
  const layoutInfo = useMemo(() => {
    return calculateHubSpokeLayout(config, { width, height });
  }, [config, width, height]);
  
  // Calculate beat frames
  const beatFrames = {
    entrance: toFrames(beats.entrance, fps),
    title: toFrames(beats.title, fps),
    hub: toFrames(beats.hub, fps),
    firstSpoke: toFrames(beats.firstSpoke, fps)
  };
  
  // Simple fade-in helper (minimal animation, should be in mid-level)
  const fadeIn = (frame, startFrame, duration) => {
    const progress = interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    });
    return { opacity: progress };
  };

  // Title animation
  const titleAnim = content.title && layoutInfo.titlePosition 
    ? fadeIn(frame, beatFrames.title, 0.8 * fps)
    : null;

  // Hub animation (simple fallback, should be handled by mid-level)
  const hubAnim = content.hub && layoutInfo.hub
    ? fadeIn(frame, beatFrames.hub, 0.6 * fps)
    : null;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      {/* Optional Title - Simple text rendering (fallback, mid-level can override) */}
      {content.title && layoutInfo.titlePosition && (
        <div
          style={{
            position: 'absolute',
            left: layoutInfo.titlePosition.x - (layoutInfo.titlePosition.width / 2),
            top: layoutInfo.titlePosition.y - 30,
            width: layoutInfo.titlePosition.width,
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ...titleAnim,
            color: colors.text,
            fontSize: fonts.size_title,
            fontWeight: fonts.weight_title,
            fontFamily: fonts.family,
            textAlign: 'center'
          }}
        >
          {typeof content.title === 'string' ? content.title : content.title.text || ''}
        </div>
      )}
      
      {/* Optional Connector Lines - Simple SVG lines (rendering handled by mid-level) */}
      {layout.showConnectors && layoutInfo.spokes.length > 0 && (
        <svg
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 0
          }}
        >
          {layoutInfo.spokes.map((spoke, index) => (
            <line
              key={`connector-${index}`}
              x1={spoke.connector.startX}
              y1={spoke.connector.startY}
              x2={spoke.connector.endX}
              y2={spoke.connector.endY}
              stroke={colors.connector || colors.text}
              strokeWidth={2}
              opacity={0.3}
            />
          ))}
        </svg>
      )}
      
      {/* Hub Container - Layout info passed for mid-level use */}
      {content.hub && layoutInfo.hub && (
        <div
          style={{
            position: 'absolute',
            left: layoutInfo.hub.x - (layoutInfo.hub.size / 2),
            top: layoutInfo.hub.y - (layoutInfo.hub.size / 2),
            width: layoutInfo.hub.size,
            height: layoutInfo.hub.size,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ...hubAnim
          }}
        >
          {/* Simple fallback rendering - mid-level components should replace this */}
          {typeof content.hub === 'string' ? (
            <div style={{ color: colors.text, fontSize: 24, textAlign: 'center', padding: 20 }}>
              {content.hub}
            </div>
          ) : content.hub.text ? (
            <div style={{ color: colors.text, fontSize: 24, textAlign: 'center', padding: 20 }}>
              {content.hub.text}
            </div>
          ) : null}
        </div>
      )}
      
      {/* Spoke Containers - Layout info passed for mid-level use */}
      {layoutInfo.spokes.map((spoke, index) => {
        const spokeContent = content.spokes?.[spoke.index];
        if (!spokeContent) return null;
        
        const spokeStartFrame = beatFrames.firstSpoke + (beats.spokeInterval || 0.4) * fps * index;
        const spokeAnim = fadeIn(frame, spokeStartFrame, 0.6 * fps);
        
        return (
          <div
            key={`spoke-${spoke.index}`}
            style={{
              position: 'absolute',
              left: spoke.x - (spoke.size / 2),
              top: spoke.y - (spoke.size / 2),
              width: spoke.size,
              height: spoke.size,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              ...spokeAnim
            }}
          >
            {/* Simple fallback rendering - mid-level components should replace this */}
            {typeof spokeContent === 'string' ? (
              <div style={{ color: colors.text, fontSize: 20, textAlign: 'center', padding: 15 }}>
                {spokeContent}
              </div>
            ) : spokeContent.text ? (
              <div style={{ color: colors.text, fontSize: 20, textAlign: 'center', padding: 15 }}>
                {spokeContent.text}
              </div>
            ) : null}
          </div>
        );
      })}
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
  name: 'Hub Spoke Scene',
  description: 'Central hub with radiating spokes in circular arrangement',
  category: 'Layout',
  learningIntentions: ['BREAKDOWN', 'CONNECT', 'EXPLAIN'],
  requiredFields: ['content.hub', 'content.spokes'],
  optionalFields: ['content.title', 'layout.radius', 'layout.showConnectors', 'layout.startAngle'],
  maxSpokes: 8,
  integrations: []
};
