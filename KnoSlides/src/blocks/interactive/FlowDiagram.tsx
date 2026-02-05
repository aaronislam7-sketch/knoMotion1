/**
 * FlowDiagram Block
 * 
 * Interactive flow diagram for visualizing processes and systems.
 * Used in Flow Simulator pattern.
 */

import React, { useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  Controls,
  MarkerType,
  NodeProps,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { BlockComponentProps } from '../../core/BlockRegistry';
import type { FlowDiagramConfig, FlowNode, FlowEdge } from '../../types/unified-schema';
import { useSlideEvents } from '../../core/SlideEventContext';
import { createEvent } from '../../types/events';

// =============================================================================
// NODE COLORS AND STYLES
// =============================================================================

const nodeColors: Record<FlowNode['type'], { bg: string; border: string; text: string }> = {
  start: { bg: 'bg-emerald-100', border: 'border-emerald-400', text: 'text-emerald-800' },
  process: { bg: 'bg-blue-100', border: 'border-blue-400', text: 'text-blue-800' },
  decision: { bg: 'bg-amber-100', border: 'border-amber-400', text: 'text-amber-800' },
  end: { bg: 'bg-slate-100', border: 'border-slate-400', text: 'text-slate-800' },
  state: { bg: 'bg-purple-100', border: 'border-purple-400', text: 'text-purple-800' },
  error: { bg: 'bg-red-100', border: 'border-red-400', text: 'text-red-800' },
  success: { bg: 'bg-emerald-100', border: 'border-emerald-400', text: 'text-emerald-800' },
};

// =============================================================================
// CUSTOM NODE COMPONENT
// =============================================================================

interface CustomNodeData {
  label: string;
  nodeType: FlowNode['type'];
  description?: string;
  isHighlighted?: boolean;
  isActive?: boolean;
}

const CustomNode: React.FC<NodeProps> = ({ data }) => {
  // Cast through unknown to satisfy TypeScript
  const nodeData = data as unknown as CustomNodeData;
  const colors = nodeColors[nodeData.nodeType] || nodeColors.process;
  const isDecision = nodeData.nodeType === 'decision';

  return (
    <motion.div
      className={`
        px-4 py-3 rounded-lg border-2 shadow-sm
        ${colors.bg} ${colors.border} ${colors.text}
        ${nodeData.isHighlighted ? 'ring-4 ring-indigo-300 scale-105' : ''}
        ${nodeData.isActive ? 'ring-4 ring-amber-300' : ''}
        transition-all duration-300
      `}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <Handle type="target" position={Position.Top} className="!bg-gray-400" />
      
      <div className="text-center min-w-[100px]">
        {isDecision && (
          <div className="text-xs uppercase tracking-wide mb-1 opacity-70">Decision</div>
        )}
        <div className="font-medium text-sm">{nodeData.label}</div>
        {nodeData.description && (
          <div className="text-xs opacity-70 mt-1">{nodeData.description}</div>
        )}
      </div>
      
      <Handle type="source" position={Position.Bottom} className="!bg-gray-400" />
      {isDecision && (
        <>
          <Handle type="source" position={Position.Left} id="false" className="!bg-red-400" />
          <Handle type="source" position={Position.Right} id="true" className="!bg-emerald-400" />
        </>
      )}
    </motion.div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

// =============================================================================
// MAIN FLOW DIAGRAM BLOCK
// =============================================================================

export const FlowDiagram: React.FC<BlockComponentProps<FlowDiagramConfig>> = ({
  id,
  config,
  stylePreset,
  className = '',
}) => {
  const { nodes, edges, viewport, highlights, interactive = false } = config;
  const eventBus = useSlideEvents();

  // Convert to ReactFlow format
  const flowNodes: Node[] = useMemo(() => {
    return nodes.map(node => {
      const isHighlighted = highlights?.nodes?.includes(node.id);
      
      return {
        id: node.id,
        type: 'custom',
        position: node.position,
        data: {
          label: node.label,
          nodeType: node.type,
          description: node.description,
          isHighlighted,
        },
      };
    });
  }, [nodes, highlights]);

  const flowEdges: Edge[] = useMemo(() => {
    return edges.map(edge => {
      const isHighlighted = highlights?.edges?.includes(edge.id);
      
      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.label,
        animated: isHighlighted,
        style: {
          stroke: isHighlighted ? '#6366f1' : '#94a3b8',
          strokeWidth: isHighlighted ? 2 : 1,
          strokeDasharray: edge.style === 'dashed' ? '5,5' : edge.style === 'dotted' ? '2,2' : undefined,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isHighlighted ? '#6366f1' : '#94a3b8',
        },
      };
    });
  }, [edges, highlights]);

  // Handle node click
  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (!interactive) return;
    
    const nodeData = node.data as unknown as CustomNodeData;
    eventBus.emit(createEvent('node_click', id, {
      nodeId: node.id,
      nodeType: nodeData.nodeType,
    }));
  }, [id, interactive, eventBus]);

  // Handle edge click
  const handleEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    if (!interactive) return;
    
    eventBus.emit(createEvent('edge_follow', id, {
      edgeId: edge.id,
      sourceId: edge.source,
      targetId: edge.target,
    }));
  }, [id, interactive, eventBus]);

  return (
    <div
      id={id}
      className={`
        bg-white rounded-xl border border-slate-200 overflow-hidden
        ${className}
      `}
    >
      {/* Header */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
        <h4 className="text-sm font-semibold text-slate-700">System Flow</h4>
      </div>
      
      {/* Flow diagram */}
      <div className={`h-[400px] ${stylePreset === 'compact' ? 'h-[300px]' : ''}`}>
        <ReactFlow
          nodes={flowNodes}
          edges={flowEdges}
          nodeTypes={nodeTypes}
          onNodeClick={handleNodeClick}
          onEdgeClick={handleEdgeClick}
          fitView
          defaultViewport={viewport}
          attributionPosition="bottom-left"
          proOptions={{ hideAttribution: true }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={interactive}
        >
          <Background color="#e2e8f0" gap={16} />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
    </div>
  );
};

export default FlowDiagram;
