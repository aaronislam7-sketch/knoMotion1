import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';
import { 
  toFrames,
  fadeIn,
  slideIn,
  scaleIn,
  drawPath
} from '../../sdk';
import { GlassmorphicPane, SpotlightEffect, NoiseTexture } from '../../sdk/broadcastEffects';
import { generateAmbientParticles, renderAmbientParticles } from '../../sdk/particleSystem';
import { getCardEntrance } from '../../sdk/microDelights';
import { FlowDiagram } from '../../sdk/components/mid-level/FlowDiagram';

/**
 * SCENE TEMPLATE: FlowLayoutScene - V7.0
 * 
 * PURPOSE: Connected nodes with directional flow (diagram-style)
 * DIFFERENTIATOR: Animated connectors with step-by-step highlighting
 * 
 * ACCEPTANCE CRITERIA:
 * ✅ Accepts content.nodes[] and content.edges[]
 * ✅ Supports layout.flowDirection = left-to-right and top-to-bottom
 * ✅ Automatically spaces nodes (no manual coordinates)
 * ✅ Uses theme/style tokens
 * ✅ Connectors are visually clear and non-overlapping
 * ✅ Supports animated edge drawing and node highlighting
 * ✅ Can delegate to FlowDiagram component when configured
 * ✅ Template is generic (no baked-in concepts)
 * 
 * CONTENT STRUCTURE:
 * {
 *   content: {
 *     title: "Process Flow",  // Optional
 *     nodes: [
 *       { id: "node1", label: "Start", icon: "🎯", description: "..." },
 *       { id: "node2", label: "Process", icon: "⚙️" },
 *       { id: "node3", label: "End", icon: "✅" }
 *     ],
 *     edges: [
 *       { from: "node1", to: "node2" },
 *       { from: "node2", to: "node3" }
 *     ]
 *   },
 *   layout: {
 *     flowDirection: "left-to-right",  // or "top-to-bottom"
 *     nodeSize: 180,
 *     spacing: 200
 *   },
 *   animations: {
 *     nodeStagger: { delay: 0.4 },
 *     edgeStagger: { delay: 0.3 }
 *   }
 * }
 */

export const TEMPLATE_VERSION = '7.0';
export const TEMPLATE_ID = 'FlowLayoutScene';

const DEFAULT_CONFIG = {
  content: {
    title: null,
    nodes: [
      { id: 'node1', label: 'Start', icon: '🎯', description: 'Beginning' },
      { id: 'node2', label: 'Process', icon: '⚙️', description: 'Middle' },
      { id: 'node3', label: 'End', icon: '✅', description: 'Finish' }
    ],
    edges: [
      { from: 'node1', to: 'node2' },
      { from: 'node2', to: 'node3' }
    ]
  },
  
  layout: {
    flowDirection: 'left-to-right',  // 'left-to-right' or 'top-to-bottom'
    nodeSize: 180,
    spacing: 200,
    startOffset: 200  // Offset from edge
  },
  
  style_tokens: {
    colors: {
      bg: '#1A1A1A',
      primary: '#FF6B35',
      secondary: '#4ECDC4',
      text: '#FFFFFF',
      textSecondary: '#B0B0B0',
      connector: '#CBD5E0',
      activeConnector: '#FF6B35'
    },
    fonts: {
      size_title: 64,
      size_label: 24,
      size_description: 16,
      weight_title: 800,
      weight_label: 700,
      weight_body: 400,
      family: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    },
    spacing: {
      padding: 80,
      nodePadding: 20
    }
  },
  
  beats: {
    entrance: 0.5,
    title: 1.0,
    firstNode: 2.0,
    nodeInterval: 0.5,
    edgesStart: 4.0,
    edgeInterval: 0.4,
    hold: 8.0,
    exit: 10.0
  },
  
  animations: {
    title: {
      entrance: 'fadeIn',
      duration: 0.8
    },
    nodes: {
      entrance: 'scaleIn',  // 'fadeIn', 'slideIn', 'scaleIn', 'cardEntrance'
      duration: 0.6,
      stagger: {
        enabled: true,
        delay: 0.5
      }
    },
    edges: {
      drawDuration: 0.5,
      stagger: {
        enabled: true,
        delay: 0.4
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
    nodeGlass: {
      enabled: true,
      glowOpacity: 0.2,
      borderOpacity: 0.5
    }
  },
  
  mid_level_components: {
    flowDiagram: {
      enabled: false,
      autoLayout: true
    }
  }
};

// Helper: Calculate node positions based on flow direction
const calculateNodePositions = (nodes, layout, viewport) => {
  const { flowDirection, nodeSize, spacing, startOffset } = layout;
  const { width, height } = viewport;
  
  const positions = [];
  
  if (flowDirection === 'left-to-right') {
    const totalWidth = (nodes.length * nodeSize) + ((nodes.length - 1) * spacing);
    const startX = (width - totalWidth) / 2;
    const centerY = height / 2;
    
    nodes.forEach((node, index) => {
      positions.push({
        id: node.id,
        x: startX + (index * (nodeSize + spacing)) + (nodeSize / 2),
        y: centerY
      });
    });
  } else {
    // top-to-bottom
    const totalHeight = (nodes.length * nodeSize) + ((nodes.length - 1) * spacing);
    const startY = (height - totalHeight) / 2;
    const centerX = width / 2;
    
    nodes.forEach((node, index) => {
      positions.push({
        id: node.id,
        x: centerX,
        y: startY + (index * (nodeSize + spacing)) + (nodeSize / 2)
      });
    });
  }
  
  return positions;
};

// Helper: Render individual node
const renderNode = (node, position, size, style, frame, startFrame, fps, animations, effects) => {
  const { colors, fonts, spacing } = style;
  const animConfig = animations.nodes;
  const duration = (animConfig.duration || 0.6) * fps;
  
  let animStyle = {};
  
  switch (animConfig.entrance) {
    case 'cardEntrance':
      animStyle = getCardEntrance(frame, {
        startFrame,
        duration: animConfig.duration || 0.6,
        direction: 'up',
        distance: 40,
        withGlow: true,
        glowColor: `${colors.primary}40`
      }, fps);
      break;
    case 'slideIn':
      animStyle = slideIn(frame, startFrame, duration, 'up', 50);
      break;
    case 'scaleIn':
      animStyle = scaleIn(frame, startFrame, duration, 0.6);
      break;
    default:
      animStyle = fadeIn(frame, startFrame, duration);
  }

  return (
    <div
      key={node.id}
      style={{
        position: 'absolute',
        left: position.x - size / 2,
        top: position.y - size / 2,
        width: size,
        height: size,
        ...animStyle
      }}
    >
      {effects.nodeGlass.enabled ? (
        <GlassmorphicPane
          innerRadius={size / 2}
          glowOpacity={effects.nodeGlass.glowOpacity}
          borderOpacity={effects.nodeGlass.borderOpacity}
          backgroundColor={`${colors.primary}15`}
          style={{
            width: '100%',
            height: '100%',
            border: `3px solid ${colors.primary}`,
            borderRadius: '50%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: spacing.nodePadding,
            gap: 8
          }}
        >
          {node.icon && (
            <div style={{ fontSize: 40, lineHeight: 1 }}>
              {node.icon}
            </div>
          )}
          <div
            style={{
              color: colors.text,
              fontSize: Math.min(fonts.size_label, 26),
              fontWeight: fonts.weight_label,
              fontFamily: fonts.family,
              textAlign: 'center',
              lineHeight: 1.2,
              maxWidth: '90%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {node.label}
          </div>
          {node.description && (
            <div
              style={{
                color: colors.textSecondary,
                fontSize: Math.min(fonts.size_description, 14),
                fontWeight: fonts.weight_body,
                fontFamily: fonts.family,
                textAlign: 'center',
                lineHeight: 1.2,
                maxWidth: '90%',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {node.description}
            </div>
          )}
        </GlassmorphicPane>
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: colors.primary,
            borderRadius: '50%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: spacing.nodePadding,
            gap: 8
          }}
        >
          {node.icon && (
            <div style={{ fontSize: 40, lineHeight: 1 }}>
              {node.icon}
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
            {node.label}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper: Render edge connector
const renderEdge = (edge, fromPos, toPos, frame, startFrame, duration, colors) => {
  const drawProgress = Math.max(0, Math.min(1, (frame - startFrame) / duration));
  
  // Calculate line coordinates
  const dx = toPos.x - fromPos.x;
  const dy = toPos.y - fromPos.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx);
  
  // Offset for node radius (90px radius)
  const nodeRadius = 90;
  const x1 = fromPos.x + Math.cos(angle) * nodeRadius;
  const y1 = fromPos.y + Math.sin(angle) * nodeRadius;
  const x2 = toPos.x - Math.cos(angle) * nodeRadius;
  const y2 = toPos.y - Math.sin(angle) * nodeRadius;
  
  const actualLength = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  return (
    <g key={`${edge.from}-${edge.to}`}>
      <defs>
        <marker
          id={`arrowhead-${edge.from}-${edge.to}`}
          markerWidth="10"
          markerHeight="10"
          refX="8"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <polygon
            points="0 0, 10 3, 0 6"
            fill={colors.activeConnector}
            opacity={drawProgress}
          />
        </marker>
      </defs>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={colors.activeConnector}
        strokeWidth={3}
        strokeDasharray={actualLength}
        strokeDashoffset={actualLength * (1 - drawProgress)}
        markerEnd={drawProgress > 0.9 ? `url(#arrowhead-${edge.from}-${edge.to})` : ''}
        opacity={0.8}
      />
    </g>
  );
};

export const FlowLayoutScene = ({ scene }) => {
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
      nodes: {
        ...DEFAULT_CONFIG.animations.nodes,
        ...scene.animations?.nodes,
        stagger: {
          ...DEFAULT_CONFIG.animations.nodes.stagger,
          ...scene.animations?.nodes?.stagger
        }
      },
      edges: {
        ...DEFAULT_CONFIG.animations.edges,
        ...scene.animations?.edges,
        stagger: {
          ...DEFAULT_CONFIG.animations.edges.stagger,
          ...scene.animations?.edges?.stagger
        }
      }
    },
    effects: {
      particles: { ...DEFAULT_CONFIG.effects.particles, ...scene.effects?.particles },
      spotlight: { ...DEFAULT_CONFIG.effects.spotlight, ...scene.effects?.spotlight },
      noise: { ...DEFAULT_CONFIG.effects.noise, ...scene.effects?.noise },
      nodeGlass: { ...DEFAULT_CONFIG.effects.nodeGlass, ...scene.effects?.nodeGlass }
    }
  }), [scene]);
  
  const { content, layout, style_tokens, beats, animations, effects } = config;
  const colors = style_tokens.colors;
  const fonts = style_tokens.fonts;
  
  // Calculate node positions
  const nodePositions = useMemo(() => {
    return calculateNodePositions(content.nodes, layout, { width, height });
  }, [content.nodes, layout, width, height]);
  
  // Generate particles once
  const particles = useMemo(() => {
    if (!effects.particles.enabled) return [];
    return generateAmbientParticles({
      count: effects.particles.count,
      seed: 145,
      color: effects.particles.color,
      bounds: { w: width, h: height }
    });
  }, [effects.particles.enabled, effects.particles.count, effects.particles.color, width, height]);
  
  // Calculate beat frames
  const beatFrames = {
    entrance: toFrames(beats.entrance, fps),
    title: toFrames(beats.title, fps),
    firstNode: toFrames(beats.firstNode, fps),
    edgesStart: toFrames(beats.edgesStart, fps)
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
        <svg style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
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
            maxWidth: '90%',
            zIndex: 10
          }}
        >
          {content.title}
        </div>
      )}
      
      {/* Flow Content - Use FlowDiagram if enabled */}
      {config.mid_level_components?.flowDiagram?.enabled ? (
        <FlowDiagram
          nodes={content.nodes}
          edges={content.edges}
          layout={{
            flowDirection: layout.flowDirection,
            nodeSize: layout.nodeSize,
            spacing: layout.spacing,
            autoLayout: config.mid_level_components.flowDiagram.autoLayout
          }}
          style={{
            colors,
            fonts
          }}
          animations={{
            nodeEntrance: animations.nodes.entrance,
            nodeDuration: animations.nodes.duration,
            nodeStagger: animations.nodes.stagger,
            edgeDuration: animations.edges.drawDuration,
            edgeStagger: animations.edges.stagger
          }}
          effects={{
            glass: effects.nodeGlass.enabled,
            glowOpacity: effects.nodeGlass.glowOpacity,
            borderOpacity: effects.nodeGlass.borderOpacity,
            activeNode: config.mid_level_components.flowDiagram.activeNode || null,
            visitedNodes: config.mid_level_components.flowDiagram.visitedNodes || []
          }}
          startFrame={beatFrames.firstNode}
          edgesStartFrame={beatFrames.edgesStart}
          viewport={{ width, height }}
        />
      ) : (
        <>
          {/* Edges (connectors) */}
          <svg style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }}>
            {content.edges.map((edge, index) => {
              const fromPos = nodePositions.find(p => p.id === edge.from);
              const toPos = nodePositions.find(p => p.id === edge.to);
              
              if (!fromPos || !toPos) return null;
              
              const staggerDelay = animations.edges.stagger.enabled 
                ? animations.edges.stagger.delay * fps * index 
                : 0;
              const edgeStartFrame = beatFrames.edgesStart + staggerDelay;
              const edgeDuration = animations.edges.drawDuration * fps;
              
              return renderEdge(edge, fromPos, toPos, frame, edgeStartFrame, edgeDuration, colors);
            })}
          </svg>
          
          {/* Nodes */}
          <div style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 3 }}>
            {content.nodes.map((node, index) => {
              const position = nodePositions.find(p => p.id === node.id);
              
              if (!position) return null;
              
              const staggerDelay = animations.nodes.stagger.enabled 
                ? animations.nodes.stagger.delay * fps * index 
                : 0;
              const nodeStartFrame = beatFrames.firstNode + staggerDelay;
              
              return renderNode(
                node,
                position,
                layout.nodeSize,
                style_tokens,
                frame,
                nodeStartFrame,
                fps,
                animations,
                effects
              );
            })}
          </div>
        </>
      )}
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
  name: 'Flow Layout Scene',
  description: 'Connected nodes with directional flow and animated connectors',
  category: 'Layout',
  learningIntentions: ['EXPLAIN', 'GUIDE', 'CONNECT'],
  requiredFields: ['content.nodes', 'content.edges'],
  optionalFields: ['content.title', 'layout.flowDirection'],
  supportedFlowDirections: ['left-to-right', 'top-to-bottom'],
  integrations: ['FlowDiagram']
};
