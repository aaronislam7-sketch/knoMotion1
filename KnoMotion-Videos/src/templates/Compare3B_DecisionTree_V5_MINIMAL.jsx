import React, { useEffect, useRef, useMemo, useState } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import { THEME } from '../utils/theme';
import rough from 'roughjs/bundled/rough.esm.js';
import ELK from 'elkjs/lib/elk.bundled.js';

// Blueprint v5.0 - MINIMAL SPEC
import {
  fadeUpIn,
  popInSpring,
  EZ,
  useSceneId,
  toFrames,
} from '../sdk';

/**
 * COMPARE 3B: DECISION TREE - MINIMAL
 * 
 * CONTENT PRINCIPLES COMPLIANT
 * - Max 2 focal items at once (1 primary + 1 secondary ghosted)
 * - ≤12 words per focus item
 * - 5 beats, 4-8s each
 * - NO panels, NO text walls
 * - VO leads, visuals respond
 * 
 * ALLOWED ELEMENTS (ONLY):
 * 1. Tree nodes (2-4 words)
 * 2. Edges (draw-on lines)
 * 3. Current-focus highlight (ring/pulse)
 * 4. Path trail (stroke weight + arrow)
 * 5. Optional outcome chip (2-3 words at leaf)
 * 
 * FORBIDDEN:
 * - Stakes/definitions/trade-offs/context/metrics/summary panels
 * 
 * 5 BEATS (30s):
 * Beat 1 (0-5s): Root alone, centered, draw-on underline
 * Beat 2 (5-10s): Root slides up-left (70%), branches draw on
 * Beat 3 (10-18s): Highlight left, show children, ghost right (40%)
 * Beat 4 (18-26s): Toggle - highlight right, show children, ghost left
 * Beat 5 (26-30s): Land on outcome, rest ghosted (20%)
 * 
 * COLLISION DETECTION: elkjs pre-layout
 * 
 * Duration: 30s
 */

const Compare3B_DecisionTree_MINIMAL = ({ scene, styles, presets, easingMap, transitions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const id = useSceneId();
  
  const svgRef = useRef(null);
  const [elkLayout, setElkLayout] = useState(null);

  // Style tokens
  const style = scene.style_tokens || {};
  const colors = style.colors || {
    bg: '#FAFBFC',
    accent: '#2E7FE4',
    accent2: '#27AE60',
    accent3: '#E74C3C',
    highlight: '#9B59B6',
    ink: '#1A1A1A',
    inkLight: '#95A5A6',
  };
  
  const fonts = style.fonts || {
    title: THEME.fonts.marker.primary,
    body: THEME.fonts.structure.primary,
    size_title: 48,
    size_node: 24,
    size_outcome: 28,
  };

  // Scene data
  const data = scene.fill?.decision || {};
  const beats = scene.beats || [
    {id:'b1', start_s:0, end_s:5, focus_node:'root', show:['root'], ghost:[]},
    {id:'b2', start_s:5, end_s:10, focus_node:'root', show:['root','n1','n2'], ghost:[]},
    {id:'b3', start_s:10, end_s:18, focus_node:'n1', show:['root','n1','n1a','n1b'], ghost:['n2']},
    {id:'b4', start_s:18, end_s:26, focus_node:'n2', show:['root','n2','n2a','n2b'], ghost:['n1','n1a','n1b']},
    {id:'b5', start_s:26, end_s:30, focus_node:'n2b', show:['root','n2','n2b'], ghost:['n1','n1a','n1b','n2a'], outcome_node:'n2b'}
  ];
  
  const graph = data.graph || {
    nodes: [
      {id:'root', label:'OS control needed?'},
      {id:'n1', label:'Yes'},
      {id:'n2', label:'No'},
      {id:'n1a', label:'Bare metal'},
      {id:'n1b', label:'VMs'},
      {id:'n2a', label:'Containers'},
      {id:'n2b', label:'Fully managed'}
    ],
    edges: [
      {from:'root', to:'n1'},
      {from:'root', to:'n2'},
      {from:'n1', to:'n1a'},
      {from:'n1', to:'n1b'},
      {from:'n2', to:'n2a'},
      {from:'n2', to:'n2b'}
    ]
  };
  
  const layoutConfig = data.layout || {
    engine: 'elk',
    node_spacing: 80,
    rank_spacing: 96,
    direction: 'TB'
  };

  // ========================================
  // ELKJS LAYOUT (Collision-Free)
  // ========================================
  
  useEffect(() => {
    const runLayout = async () => {
      const elk = new ELK();
      
      // Measure text width (approximate)
      const measureText = (text, fontSize) => {
        // Approximate: 0.6 * fontSize per character
        return Math.max(120, text.length * fontSize * 0.6 + 32);
      };
      
      // Build elkjs graph
      const elkGraph = {
        id: 'root',
        layoutOptions: {
          'elk.algorithm': 'layered',
          'elk.direction': layoutConfig.direction,
          'elk.spacing.nodeNode': String(layoutConfig.node_spacing),
          'elk.layered.spacing.nodeNodeBetweenLayers': String(layoutConfig.rank_spacing),
        },
        children: graph.nodes.map(node => {
          const isRoot = node.id === 'root';
          const fontSize = isRoot ? fonts.size_title : fonts.size_node;
          const width = measureText(node.label, fontSize);
          const height = fontSize + 40;
          
          return {
            id: node.id,
            width,
            height,
          };
        }),
        edges: graph.edges.map((edge, i) => ({
          id: `e${i}`,
          sources: [edge.from],
          targets: [edge.to],
        })),
      };
      
      try {
        const layout = await elk.layout(elkGraph);
        setElkLayout(layout);
      } catch (err) {
        console.error('ELK layout failed:', err);
        // Fallback: simple manual layout
        setElkLayout(null);
      }
    };
    
    runLayout();
  }, [graph.nodes, graph.edges, layoutConfig, fonts]);

  // ========================================
  // BEATS & TIMING
  // ========================================
  
  const frameBeats = useMemo(() => {
    return beats.map(beat => ({
      ...beat,
      start_frame: toFrames(beat.start_s, fps),
      end_frame: toFrames(beat.end_s, fps),
    }));
  }, [beats, fps]);
  
  const currentBeat = useMemo(() => {
    return frameBeats.find(b => frame >= b.start_frame && frame < b.end_frame) || frameBeats[0];
  }, [frame, frameBeats]);

  // ========================================
  // NODE POSITIONS (from elkjs or fallback)
  // ========================================
  
  const nodePositions = useMemo(() => {
    if (!elkLayout) {
      // Fallback: simple manual layout
      const positions = {};
      graph.nodes.forEach((node, i) => {
        positions[node.id] = {
          x: 960,
          y: 200 + i * 120,
          width: 200,
          height: 80,
        };
      });
      return positions;
    }
    
    // Use elkjs layout, centered in canvas
    const positions = {};
    const canvasWidth = 1920;
    const canvasHeight = 1080;
    
    // Calculate bounds
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    elkLayout.children.forEach(child => {
      minX = Math.min(minX, child.x);
      minY = Math.min(minY, child.y);
      maxX = Math.max(maxX, child.x + child.width);
      maxY = Math.max(maxY, child.y + child.height);
    });
    
    const layoutWidth = maxX - minX;
    const layoutHeight = maxY - minY;
    
    // Center offset (with safe margins)
    const offsetX = (canvasWidth - layoutWidth) / 2 - minX + 120;
    const offsetY = (canvasHeight - layoutHeight) / 2 - minY + 120;
    
    elkLayout.children.forEach(child => {
      positions[child.id] = {
        x: child.x + offsetX + child.width / 2,
        y: child.y + offsetY + child.height / 2,
        width: child.width,
        height: child.height,
      };
    });
    
    return positions;
  }, [elkLayout, graph.nodes]);

  // ========================================
  // ANIMATIONS
  // ========================================
  
  // Beat 1: Root alone
  const rootAnim = useMemo(() => {
    if (!currentBeat || currentBeat.id !== 'b1') return { opacity: 1, scale: 1, x: 0, y: 0 };
    
    const progress = (frame - currentBeat.start_frame) / (currentBeat.end_frame - currentBeat.start_frame);
    
    return {
      opacity: interpolate(progress, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' }),
      scale: 1,
      x: 0,
      y: 0,
    };
  }, [frame, currentBeat]);
  
  // Beat 2: Root slides up-left
  const rootSlideAnim = useMemo(() => {
    if (!currentBeat || currentBeat.id !== 'b2') {
      if (frame < frameBeats[1].start_frame) return { scale: 1, x: 0, y: 0 };
      return { scale: 0.7, x: -300, y: -180 };
    }
    
    const progress = (frame - currentBeat.start_frame) / (currentBeat.end_frame - currentBeat.start_frame);
    
    return {
      scale: interpolate(progress, [0, 1], [1, 0.7], { extrapolateRight: 'clamp', easing: EZ.smooth }),
      x: interpolate(progress, [0, 1], [0, -300], { extrapolateRight: 'clamp', easing: EZ.smooth }),
      y: interpolate(progress, [0, 1], [0, -180], { extrapolateRight: 'clamp', easing: EZ.smooth }),
    };
  }, [frame, currentBeat, frameBeats]);

  // Node visibility & opacity
  const getNodeState = (nodeId) => {
    if (!currentBeat) return { visible: false, opacity: 0, highlight: false };
    
    const isShown = currentBeat.show.includes(nodeId);
    const isGhosted = currentBeat.ghost.includes(nodeId);
    const isFocus = currentBeat.focus_node === nodeId;
    const isOutcome = currentBeat.outcome_node === nodeId;
    
    if (!isShown && !isGhosted) return { visible: false, opacity: 0, highlight: false };
    
    let opacity = 1.0;
    if (isGhosted) {
      if (currentBeat.id === 'b5') opacity = 0.2; // Beat 5: de-emphasize
      else opacity = 0.4; // Beat 3-4: ghost
    }
    
    return {
      visible: true,
      opacity,
      highlight: isFocus || isOutcome,
      isOutcome,
    };
  };

  // Edge visibility & draw-on progress
  const getEdgeState = (edge) => {
    if (!currentBeat) return { visible: false, progress: 0 };
    
    const fromState = getNodeState(edge.from);
    const toState = getNodeState(edge.to);
    
    if (!fromState.visible || !toState.visible) return { visible: false, progress: 0 };
    
    // Draw-on effect (600ms from beat start)
    const beatProgress = (frame - currentBeat.start_frame) / (currentBeat.end_frame - currentBeat.start_frame);
    const drawDuration = 600 / 1000 * (currentBeat.end_frame - currentBeat.start_frame) / fps;
    const progress = Math.min(beatProgress / drawDuration, 1);
    
    return {
      visible: true,
      progress,
      opacity: Math.min(fromState.opacity, toState.opacity),
    };
  };

  // ========================================
  // RENDER: ROUGH.JS (Zero Wobble)
  // ========================================

  useEffect(() => {
    if (!svgRef.current || !nodePositions) return;

    const svg = svgRef.current;
    const rc = rough.svg(svg);

    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // Draw edges
    graph.edges.forEach((edge, i) => {
      const edgeState = getEdgeState(edge);
      if (!edgeState.visible) return;
      
      const fromPos = nodePositions[edge.from];
      const toPos = nodePositions[edge.to];
      if (!fromPos || !toPos) return;
      
      // Apply root slide animation
      let fromX = fromPos.x;
      let fromY = fromPos.y;
      if (edge.from === 'root' && frame >= frameBeats[1].start_frame) {
        const slide = rootSlideAnim;
        fromX = fromPos.x + slide.x;
        fromY = fromPos.y + slide.y;
      }
      
      // Simple straight line (elkjs provides routing if needed)
      const startX = fromX;
      const startY = fromY + fromPos.height / 2;
      const endX = toPos.x;
      const endY = toPos.y - toPos.height / 2;
      
      // Draw-on effect: animate from start to current progress
      const currentEndX = interpolate(edgeState.progress, [0, 1], [startX, endX]);
      const currentEndY = interpolate(edgeState.progress, [0, 1], [startY, endY]);
      
      const line = rc.line(startX, startY, currentEndX, currentEndY, {
        stroke: colors.inkLight,
        strokeWidth: 3,
        roughness: 0,
        bowing: 0,
      });
      line.setAttribute('opacity', String(edgeState.opacity));
      svg.appendChild(line);
      
      // Arrow head (if fully drawn)
      if (edgeState.progress > 0.9) {
        const angle = Math.atan2(endY - startY, endX - startX);
        const arrowSize = 10;
        const arrowPath = rc.path(
          `M ${endX} ${endY} 
           L ${endX - arrowSize * Math.cos(angle - Math.PI / 6)} ${endY - arrowSize * Math.sin(angle - Math.PI / 6)} 
           M ${endX} ${endY} 
           L ${endX - arrowSize * Math.cos(angle + Math.PI / 6)} ${endY - arrowSize * Math.sin(angle + Math.PI / 6)}`,
          {
            stroke: colors.inkLight,
            strokeWidth: 3,
            roughness: 0,
            bowing: 0,
          }
        );
        arrowPath.setAttribute('opacity', String(edgeState.opacity));
        svg.appendChild(arrowPath);
      }
    });

    // Draw nodes
    graph.nodes.forEach(node => {
      const nodeState = getNodeState(node.id);
      if (!nodeState.visible) return;
      
      const pos = nodePositions[node.id];
      if (!pos) return;
      
      let x = pos.x;
      let y = pos.y;
      
      // Apply root slide animation
      if (node.id === 'root' && frame >= frameBeats[1].start_frame) {
        const slide = rootSlideAnim;
        x = pos.x + slide.x;
        y = pos.y + slide.y;
      }
      
      const boxWidth = pos.width;
      const boxHeight = pos.height;
      
      // Highlight ring (if focused)
      if (nodeState.highlight) {
        const highlightSize = 12;
        const highlightBox = rc.rectangle(
          x - boxWidth / 2 - highlightSize,
          y - boxHeight / 2 - highlightSize,
          boxWidth + highlightSize * 2,
          boxHeight + highlightSize * 2,
          {
            stroke: colors.highlight,
            strokeWidth: 4,
            roughness: 0,
            bowing: 0,
          }
        );
        highlightBox.setAttribute('opacity', '0.8');
        svg.appendChild(highlightBox);
      }
      
      // Node box
      const box = rc.rectangle(
        x - boxWidth / 2,
        y - boxHeight / 2,
        boxWidth,
        boxHeight,
        {
          stroke: colors.accent,
          strokeWidth: 3,
          roughness: 0,
          bowing: 0,
          fill: `${colors.accent}10`,
          fillStyle: 'solid',
        }
      );
      box.setAttribute('opacity', String(nodeState.opacity));
      svg.appendChild(box);
    });

  }, [frame, currentBeat, graph, nodePositions, rootSlideAnim, colors, frameBeats]);

  // ========================================
  // JSX: Node Labels & Outcome Chip
  // ========================================

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        backgroundImage: `radial-gradient(circle at 20% 20%, ${colors.accent}03 0%, transparent 50%)`,
      }}
    >
      {/* Rough.js layer (edges & boxes) */}
      <svg
        ref={svgRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid meet"
      />

      {/* Node labels */}
      {graph.nodes.map(node => {
        const nodeState = getNodeState(node.id);
        if (!nodeState.visible) return null;
        
        const pos = nodePositions[node.id];
        if (!pos) return null;
        
        let x = pos.x;
        let y = pos.y;
        
        // Apply root slide animation
        if (node.id === 'root' && frame >= frameBeats[1].start_frame) {
          const slide = rootSlideAnim;
          x = pos.x + slide.x;
          y = pos.y + slide.y;
        }
        
        const isRoot = node.id === 'root';
        const fontSize = isRoot ? fonts.size_title : fonts.size_node;
        const fontFamily = isRoot ? fonts.title : fonts.body;
        
        // Truncate label if > 4 words
        let label = node.label;
        const words = label.split(' ');
        if (words.length > 4) {
          label = words.slice(0, 4).join(' ') + '...';
        }
        
        return (
          <div
            key={node.id}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              transform: 'translate(-50%, -50%)',
              fontFamily,
              fontSize,
              fontWeight: isRoot ? '700' : '600',
              color: colors.ink,
              textAlign: 'center',
              opacity: nodeState.opacity,
              pointerEvents: 'none',
              maxWidth: pos.width - 16,
              lineHeight: 1.2,
            }}
          >
            {label}
          </div>
        );
      })}
      
      {/* Outcome chip (Beat 5 only) */}
      {currentBeat && currentBeat.outcome_node && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: 100,
            transform: 'translateX(-50%)',
            padding: '12px 24px',
            backgroundColor: colors.highlight,
            color: '#FFFFFF',
            fontFamily: fonts.body,
            fontSize: fonts.size_outcome,
            fontWeight: '700',
            borderRadius: 24,
            opacity: interpolate(
              frame,
              [frameBeats[4].start_frame, frameBeats[4].start_frame + 20],
              [0, 1],
              { extrapolateRight: 'clamp' }
            ),
          }}
        >
          {graph.nodes.find(n => n.id === currentBeat.outcome_node)?.label || 'Outcome'}
        </div>
      )}
    </AbsoluteFill>
  );
};

// ========================================
// BLUEPRINT V5.0 - REQUIRED EXPORTS
// ========================================

export { Compare3B_DecisionTree_MINIMAL };

export const TEMPLATE_ID = 'Compare3B_DecisionTree_MINIMAL';
export const TEMPLATE_VERSION = '5.0.1';

export const getDuration = (scene, fps) => {
  const beats = scene.beats || [];
  const lastBeat = beats[beats.length - 1];
  return toFrames(lastBeat?.end_s || 30, fps);
};

export const DURATION_MIN_FRAMES = 900;   // 30s @ 30fps
export const DURATION_MAX_FRAMES = 900;

export const SUPPORTED_MODES = ['notebook', 'whiteboard'];

export const CAPABILITIES = {
  usesSVG: true,
  usesLottie: false,
  usesRoughJS: true,
  requiresAudio: false,
  supportsTransitions: true,
  usesElkjsLayout: true,
  contentPrinciplesCompliant: true,
};

export const PRESETS_REQUIRED = [
  'fadeUpIn',
  'popInSpring'
];

export const getPosterFrame = (scene, fps) => {
  return toFrames(15, fps); // Mid-scene
};

// Content Principles Compliance
export const CONTENT_PRINCIPLES = {
  maxFocalItems: 2,
  maxWordsPerItem: 12,
  beatsPerScene: 5,
  allowedComponents: ['Tree', 'NodeLabel', 'Edge', 'HighlightRing', 'OutcomeChip', 'GhostLayer'],
  forbiddenComponents: ['StakesPanel', 'DefinitionBox', 'TradeOffPanel', 'ContextTooltip', 'MetricsPanel', 'SummaryPanel'],
};
