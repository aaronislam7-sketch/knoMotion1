/**
 * Mind Map Template (formerly Relationship Map)
 * 
 * Explore ideas and concepts connected to a central theme.
 * Visual mind-mapping for conceptual exploration.
 * Notion + Brilliant.org inspired aesthetic.
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RelationshipMapProps, RelationshipMapNode } from '../../types';
import { SPRING_CONFIGS } from '../../animations';

// =============================================================================
// FLOWING LINE STYLES
// =============================================================================

const flowingLineStyle = `
  @keyframes flowDash {
    to {
      stroke-dashoffset: -20;
    }
  }
  .mind-flow {
    stroke-dasharray: 8 6;
    animation: flowDash 1.5s linear infinite;
  }
  .mind-flow-fast {
    stroke-dasharray: 6 4;
    animation: flowDash 0.8s linear infinite;
  }
`;

// =============================================================================
// LAYOUT CALCULATION
// =============================================================================

interface NodePosition {
  x: number;
  y: number;
  node: RelationshipMapNode;
  isCenter: boolean;
}

const calculateRadialPositions = (
  centralNode: RelationshipMapNode,
  connectedNodes: RelationshipMapNode[],
  width: number,
  height: number
): NodePosition[] => {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.35;
  
  const positions: NodePosition[] = [
    { x: centerX, y: centerY, node: centralNode, isCenter: true }
  ];
  
  connectedNodes.forEach((node, i) => {
    const angle = (i / connectedNodes.length) * 2 * Math.PI - Math.PI / 2;
    positions.push({
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
      node,
      isCenter: false,
    });
  });
  
  return positions;
};

// =============================================================================
// CONNECTION LINES
// =============================================================================

interface ConnectionLinesProps {
  positions: NodePosition[];
  selectedId: string | null;
  width: number;
  height: number;
}

const ConnectionLines: React.FC<ConnectionLinesProps> = ({
  positions,
  selectedId,
  width,
  height,
}) => {
  const centerPos = positions.find(p => p.isCenter);
  const outerPositions = positions.filter(p => !p.isCenter);
  
  if (!centerPos) return null;

  return (
    <>
      <style>{flowingLineStyle}</style>
      <svg 
        className="absolute inset-0 pointer-events-none"
        width={width}
        height={height}
      >
        {/* Lines from center to outer nodes */}
        {outerPositions.map((pos, i) => {
          const isActive = selectedId === centerPos.node.id || selectedId === pos.node.id;
          
          return (
            <motion.line
              key={`center-${pos.node.id}`}
              x1={centerPos.x}
              y1={centerPos.y}
              x2={pos.x}
              y2={pos.y}
              className={isActive ? 'mind-flow-fast' : 'mind-flow'}
              stroke={isActive ? '#6366f1' : '#d1d5db'}
              strokeWidth={isActive ? 3 : 2}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: isActive ? 1 : 0.6 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            />
          );
        })}
        
        {/* Cross-connections between outer nodes */}
        {outerPositions.map((fromPos, i) => {
          const connections = fromPos.node.connectsTo || [];
          return connections
            .filter(toId => toId !== centerPos.node.id)
            .map(toId => {
              const toPos = outerPositions.find(p => p.node.id === toId);
              if (!toPos) return null;
              
              const toIndex = outerPositions.findIndex(p => p.node.id === toId);
              if (toIndex < i) return null;
              
              const isActive = selectedId === fromPos.node.id || selectedId === toId;
              
              return (
                <motion.path
                  key={`${fromPos.node.id}-${toId}`}
                  d={`M ${fromPos.x} ${fromPos.y} Q ${centerPos.x} ${centerPos.y} ${toPos.x} ${toPos.y}`}
                  fill="none"
                  className={isActive ? 'mind-flow-fast' : ''}
                  stroke={isActive ? '#8b5cf6' : '#e5e7eb'}
                  strokeWidth={isActive ? 2 : 1}
                  strokeDasharray={isActive ? undefined : '3 3'}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: isActive ? 0.8 : 0.3 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                />
              );
            });
        })}
      </svg>
    </>
  );
};

// =============================================================================
// NODE COMPONENT
// =============================================================================

interface ConceptNodeProps {
  position: NodePosition;
  isSelected: boolean;
  isVisited: boolean;
  onClick: () => void;
}

const ConceptNode: React.FC<ConceptNodeProps> = ({
  position,
  isSelected,
  isVisited,
  onClick,
}) => {
  const { node, isCenter } = position;
  const nodeSize = isCenter ? 140 : 110;
  
  return (
    <motion.button
      className="absolute transform -translate-x-1/2 -translate-y-1/2 focus:outline-none"
      style={{ left: position.x, top: position.y }}
      onClick={onClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      transition={SPRING_CONFIGS.smooth}
    >
      <div 
        className={`
          rounded-full flex flex-col items-center justify-center p-3 transition-all duration-200
          ${isCenter 
            ? isSelected
              ? 'bg-indigo-600 text-white shadow-2xl ring-4 ring-indigo-200'
              : 'bg-indigo-500 text-white shadow-xl hover:bg-indigo-600'
            : isSelected 
              ? 'bg-gray-900 text-white shadow-xl ring-4 ring-gray-300'
              : isVisited 
                ? 'bg-gray-100 text-gray-800 shadow-md ring-2 ring-gray-200 hover:bg-gray-200'
                : 'bg-white text-gray-700 shadow-lg border-2 border-gray-200 hover:border-gray-300'
          }
        `}
        style={{ width: nodeSize, height: nodeSize }}
      >
        <span className={`font-semibold text-center leading-tight px-2 ${isCenter ? 'text-base' : 'text-sm'}`}>
          {node.label}
        </span>
      </div>
      
      {/* Unvisited indicator */}
      {!isVisited && !isSelected && !isCenter && (
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      
      {/* Center pulse */}
      {isCenter && !isSelected && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-indigo-400"
          style={{ width: nodeSize, height: nodeSize }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
};

// =============================================================================
// DETAIL PANEL
// =============================================================================

interface DetailPanelProps {
  node: RelationshipMapNode;
  isCenter: boolean;
  allNodes: RelationshipMapNode[];
  onNavigate: (id: string) => void;
  onClose: () => void;
}

const DetailPanel: React.FC<DetailPanelProps> = ({ 
  node, 
  isCenter, 
  allNodes, 
  onNavigate,
  onClose,
}) => {
  const connectedNodes = (node.connectsTo || [])
    .map(id => allNodes.find(n => n.id === id))
    .filter(Boolean) as RelationshipMapNode[];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className={`px-6 py-4 ${isCenter ? 'bg-indigo-50' : 'bg-gray-50'} border-b border-gray-200`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{node.label}</h3>
            {isCenter && (
              <span className="text-xs font-medium text-indigo-600 uppercase tracking-wide">
                Central Concept
              </span>
            )}
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {node.description && (
          <p className="text-gray-700 leading-relaxed">{node.description}</p>
        )}

        {node.detail && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-gray-600 text-sm leading-relaxed">{node.detail}</p>
          </div>
        )}

        {connectedNodes.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Related Concepts
            </h4>
            <div className="flex flex-wrap gap-2">
              {connectedNodes.map(connected => (
                <button
                  key={connected.id}
                  onClick={() => onNavigate(connected.id)}
                  className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium transition-colors"
                >
                  {connected.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// =============================================================================
// PROGRESS
// =============================================================================

interface ProgressProps {
  total: number;
  visited: number;
}

const Progress: React.FC<ProgressProps> = ({ total, visited }) => (
  <div className="flex items-center gap-3">
    <div className="flex gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full transition-colors ${
            i < visited ? 'bg-indigo-500' : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
    <span className="text-sm text-gray-500">{visited} of {total} explored</span>
  </div>
);

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const RelationshipMap: React.FC<RelationshipMapProps> = ({ 
  data, 
  className = '',
}) => {
  const { title, centralNode, connectedNodes } = data;

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [visitedIds, setVisitedIds] = useState<Set<string>>(new Set([centralNode.id]));

  // Diagram dimensions
  const diagramWidth = 800;
  const diagramHeight = 600;

  const positions = useMemo(() => 
    calculateRadialPositions(centralNode, connectedNodes, diagramWidth, diagramHeight),
    [centralNode, connectedNodes, diagramWidth, diagramHeight]
  );

  const handleSelect = (nodeId: string) => {
    if (selectedId === nodeId) {
      setSelectedId(null);
    } else {
      setSelectedId(nodeId);
      setVisitedIds(prev => new Set([...prev, nodeId]));
    }
  };

  const selectedNode = selectedId 
    ? [centralNode, ...connectedNodes].find(n => n.id === selectedId)
    : null;
  
  const allNodes = [centralNode, ...connectedNodes];

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <header className="mb-8">
        {title && (
          <h1 className="text-4xl font-bold text-gray-900 mb-3">{title}</h1>
        )}
        <p className="text-lg text-gray-500 mb-4">
          Explore how concepts connect to the central idea. Click any node to learn more.
        </p>
        <Progress total={allNodes.length} visited={visitedIds.size} />
      </header>

      {/* Mind Map Diagram */}
      <div className="flex justify-center mb-8">
        <div 
          className="relative bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl border border-gray-200"
          style={{ width: diagramWidth, height: diagramHeight }}
        >
          {/* Connection Lines */}
          <ConnectionLines
            positions={positions}
            selectedId={selectedId}
            width={diagramWidth}
            height={diagramHeight}
          />

          {/* Nodes */}
          {positions.map(pos => (
            <ConceptNode
              key={pos.node.id}
              position={pos}
              isSelected={selectedId === pos.node.id}
              isVisited={visitedIds.has(pos.node.id)}
              onClick={() => handleSelect(pos.node.id)}
            />
          ))}
        </div>
      </div>

      {/* Detail Panel (below diagram) */}
      <AnimatePresence mode="wait">
        {selectedNode && (
          <div className="max-w-2xl mx-auto">
            <DetailPanel
              node={selectedNode}
              isCenter={selectedNode.id === centralNode.id}
              allNodes={allNodes}
              onNavigate={handleSelect}
              onClose={() => setSelectedId(null)}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Completion */}
      {visitedIds.size === allNodes.length && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-6 bg-indigo-50 border border-indigo-200 rounded-xl text-center max-w-2xl mx-auto"
        >
          <p className="text-indigo-700 font-medium">
            You've explored all the connected concepts. Great job mapping out this topic!
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default RelationshipMap;
