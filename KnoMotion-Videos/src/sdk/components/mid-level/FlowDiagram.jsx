import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { toFrames, GlassmorphicPane, getCardEntrance } from '../../index';

/**
 * MID-LEVEL COMPONENT: FlowDiagram - V7.0
 * 
 * PURPOSE: Node-based diagram with animated connectors
 * 
 * ACCEPTANCE CRITERIA:
 * ✅ Takes nodes[], edges[], optional flowDirection
 * ✅ Computes node positions (or respects provided hints)
 * ✅ Renders nodes and connectors clearly
 * ✅ Supports animated edge drawing and node highlighting
 * ✅ Uses theme/style tokens
 * ✅ Can be embedded in multiple scene types
 * ✅ Fails gracefully on invalid configs
 * ✅ Handles small-medium graphs (linear, hub-and-spoke, simple branching)
 * 
 * USAGE:
 * <FlowDiagram
 *   nodes={[...]}
 *   edges={[...]}
 *   layout={{ flowDirection: "left-to-right", nodeSize: 180, spacing: 200 }}
 *   style={{ colors: {...}, fonts: {...} }}
 *   animations={{ nodeStagger: { delay: 0.4 }, edgeStagger: { delay: 0.3 } }}
 *   effects={{ glass: true, activeNode: "node2" }}
 *   startFrame={60}
 *   viewport={{ width: 1920, height: 1080 }}
 * />
 */

export const FlowDiagram = ({
  nodes = [],
  edges = [],
  layout = {},
  style = {},
  animations = {},
  effects = {},
  startFrame = 0,
  edgesStartFrame = null,
  viewport = { width: 1920, height: 1080 }
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Default values
  const {
    flowDirection = 'left-to-right',
    nodeSize = 180,
    spacing = 200,
    autoLayout = true
  } = layout;
  
  const {
    colors = {
      bg: '#1A1A1A',
      primary: '#FF6B35',
      text: '#FFFFFF',
      textSecondary: '#B0B0B0',
      connector: '#CBD5E0',
      activeConnector: '#FF6B35'
    },
    fonts = {
      size_label: 24,
      size_description: 14,
      weight_label: 700,
      weight_body: 400,
      family: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    }
  } = style;
  
  const {
    nodeEntrance = 'scaleIn',
    nodeDuration = 0.6,
    nodeStagger = { enabled: true, delay: 0.4 },
    edgeDuration = 0.5,
    edgeStagger = { enabled: true, delay: 0.3 }
  } = animations;
  
  const {
    glass = true,
    glowOpacity = 0.2,
    borderOpacity = 0.5,
    activeNode = null,
    visitedNodes = []
  } = effects;
  
  // Calculate node positions
  const nodePositions = useMemo(() => {
    if (!autoLayout && nodes.every(n => n.x !== undefined && n.y !== undefined)) {
      // Use provided positions
      return nodes.map(n => ({ id: n.id, x: n.x, y: n.y }));
    }
    
    // Auto-layout based on flow direction
    const positions = [];
    
    if (flowDirection === 'left-to-right') {
      const totalWidth = (nodes.length * nodeSize) + ((nodes.length - 1) * spacing);
      const startX = (viewport.width - totalWidth) / 2;
      const centerY = viewport.height / 2;
      
      nodes.forEach((node, index) => {
        positions.push({
          id: node.id,
          x: startX + (index * (nodeSize + spacing)) + (nodeSize / 2),
          y: centerY
        });
      });
    } else if (flowDirection === 'top-to-bottom') {
      const totalHeight = (nodes.length * nodeSize) + ((nodes.length - 1) * spacing);
      const startY = (viewport.height - totalHeight) / 2;
      const centerX = viewport.width / 2;
      
      nodes.forEach((node, index) => {
        positions.push({
          id: node.id,
          x: centerX,
          y: startY + (index * (nodeSize + spacing)) + (nodeSize / 2)
        });
      });
    } else {
      // Hub-and-spoke layout for complex flows
      const centerX = viewport.width / 2;
      const centerY = viewport.height / 2;
      const radius = 300;
      
      nodes.forEach((node, index) => {
        if (index === 0) {
          // Center node
          positions.push({ id: node.id, x: centerX, y: centerY });
        } else {
          // Surrounding nodes
          const angle = ((index - 1) / (nodes.length - 1)) * Math.PI * 2;
          positions.push({
            id: node.id,
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius
          });
        }
      });
    }
    
    return positions;
  }, [nodes, flowDirection, nodeSize, spacing, autoLayout, viewport]);
  
  // Render individual node
  const renderNode = (node, index) => {
    const position = nodePositions.find(p => p.id === node.id);
    if (!position) return null;
    
    // Calculate staggered animation
    const staggerDelay = nodeStagger.enabled ? nodeStagger.delay * fps * index : 0;
    const nodeStartFrame = startFrame + staggerDelay;
    
    // Animation style
    let animStyle = {};
    const animDuration = nodeDuration * fps;
    
    switch (nodeEntrance) {
      case 'cardEntrance':
        animStyle = getCardEntrance(frame, {
          startFrame: nodeStartFrame,
          duration: nodeDuration,
          direction: 'up',
          distance: 40,
          withGlow: true,
          glowColor: `${colors.primary}40`
        }, fps);
        break;
      case 'scaleIn':
        const scaleProgress = interpolate(
          frame,
          [nodeStartFrame, nodeStartFrame + animDuration],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );
        animStyle = {
          opacity: scaleProgress,
          transform: `scale(${0.6 + (0.4 * scaleProgress)})`
        };
        break;
      default:
        const fadeProgress = interpolate(
          frame,
          [nodeStartFrame, nodeStartFrame + animDuration],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );
        animStyle = { opacity: fadeProgress };
    }
    
    // Highlight active or visited nodes
    const isActive = activeNode === node.id;
    const isVisited = visitedNodes.includes(node.id);
    const highlightScale = isActive ? 1.15 : 1;
    const highlightOpacity = isVisited ? 0.7 : 1;

    return (
      <div
        key={node.id}
        style={{
          position: 'absolute',
          left: position.x - nodeSize / 2,
          top: position.y - nodeSize / 2,
          width: nodeSize,
          height: nodeSize,
          ...animStyle,
          transform: `${animStyle.transform || ''} scale(${highlightScale})`.trim(),
          opacity: (animStyle.opacity || 1) * highlightOpacity,
          transition: 'transform 0.3s ease'
        }}
      >
        {glass ? (
          <GlassmorphicPane
            innerRadius={nodeSize / 2}
            glowOpacity={glowOpacity}
            borderOpacity={borderOpacity}
            backgroundColor={`${colors.primary}15`}
            style={{
              width: '100%',
              height: '100%',
              border: `3px solid ${isActive ? colors.activeConnector : colors.primary}`,
              borderRadius: '50%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
              gap: 8,
              boxShadow: isActive ? `0 0 30px ${colors.activeConnector}40` : 'none'
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
              padding: 20,
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
  
  // Render edge connector
  const renderEdge = (edge, index) => {
    const fromPos = nodePositions.find(p => p.id === edge.from);
    const toPos = nodePositions.find(p => p.id === edge.to);
    
    if (!fromPos || !toPos) {
      console.warn(`Edge references unknown nodes: ${edge.from} -> ${edge.to}`);
      return null;
    }
    
    // Calculate animation
    const baseEdgeFrame = edgesStartFrame !== null ? edgesStartFrame : startFrame + (nodes.length * (nodeStagger.delay * fps));
    const staggerDelay = edgeStagger.enabled ? edgeStagger.delay * fps * index : 0;
    const edgeStartFrame = baseEdgeFrame + staggerDelay;
    const edgeAnimDuration = edgeDuration * fps;
    
    const drawProgress = Math.max(0, Math.min(1, 
      (frame - edgeStartFrame) / edgeAnimDuration
    ));
    
    // Calculate line coordinates (offset by node radius)
    const dx = toPos.x - fromPos.x;
    const dy = toPos.y - fromPos.y;
    const angle = Math.atan2(dy, dx);
    const nodeRadius = nodeSize / 2;
    
    const x1 = fromPos.x + Math.cos(angle) * nodeRadius;
    const y1 = fromPos.y + Math.sin(angle) * nodeRadius;
    const x2 = toPos.x - Math.cos(angle) * nodeRadius;
    const y2 = toPos.y - Math.sin(angle) * nodeRadius;
    
    const lineLength = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

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
          strokeDasharray={lineLength}
          strokeDashoffset={lineLength * (1 - drawProgress)}
          markerEnd={drawProgress > 0.9 ? `url(#arrowhead-${edge.from}-${edge.to})` : ''}
          opacity={0.8}
        />
      </g>
    );
  };

  // Validation
  if (nodes.length === 0) {
    console.warn('FlowDiagram: No nodes provided');
    return null;
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Edges */}
      <svg style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
        {edges.map((edge, index) => renderEdge(edge, index))}
      </svg>
      
      {/* Nodes */}
      {nodes.map((node, index) => renderNode(node, index))}
    </div>
  );
};

// Helper function to calculate FlowDiagram layout metrics
export const calculateFlowDiagramLayout = (nodeCount, flowDirection, nodeSize, spacing, viewport) => {
  if (flowDirection === 'left-to-right') {
    const totalWidth = (nodeCount * nodeSize) + ((nodeCount - 1) * spacing);
    return {
      totalWidth,
      totalHeight: nodeSize,
      startX: (viewport.width - totalWidth) / 2,
      startY: (viewport.height - nodeSize) / 2
    };
  } else {
    const totalHeight = (nodeCount * nodeSize) + ((nodeCount - 1) * spacing);
    return {
      totalWidth: nodeSize,
      totalHeight,
      startX: (viewport.width - nodeSize) / 2,
      startY: (viewport.height - totalHeight) / 2
    };
  }
};

// Helper function to validate FlowDiagram config
export const validateFlowDiagramConfig = (config) => {
  const errors = [];
  const warnings = [];
  
  if (!config.nodes || config.nodes.length === 0) {
    errors.push('FlowDiagram requires at least one node');
  }
  
  if (config.edges) {
    config.edges.forEach((edge, index) => {
      const fromExists = config.nodes.some(n => n.id === edge.from);
      const toExists = config.nodes.some(n => n.id === edge.to);
      
      if (!fromExists) {
        errors.push(`Edge ${index}: 'from' node '${edge.from}' not found`);
      }
      if (!toExists) {
        errors.push(`Edge ${index}: 'to' node '${edge.to}' not found`);
      }
    });
  }
  
  if (config.nodes && config.nodes.length > 8) {
    warnings.push('FlowDiagram with more than 8 nodes may appear cluttered');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
};

export default FlowDiagram;
