/**
 * Relationship Map Template
 * 
 * Visualize and explore connections between concepts.
 * Based on schema theory - understanding relationships strengthens memory encoding.
 * 
 * Features:
 * - Central concept with radiating connected nodes
 * - Click to explore detailed information about each concept
 * - Connection lines highlight relationships
 * - Responsive radial/list layout
 * - Progress tracking for concepts explored
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RelationshipMapProps, 
  RelationshipMapNode 
} from '../../types';
import { Card, Text, Icon, ProgressIndicator } from '../../components';
import { 
  fadeInUp, 
  fadeInScale,
  staggerContainer, 
  SPRING_CONFIGS,
} from '../../animations';
import { useResponsive, useScrollReveal } from '../../hooks';

// =============================================================================
// LAYOUT CALCULATIONS
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
  containerWidth: number,
  containerHeight: number
): NodePosition[] => {
  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;
  const radius = Math.min(containerWidth, containerHeight) / 2 - 100;
  
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
// SUB-COMPONENTS
// =============================================================================

interface ConceptNodeProps {
  position: NodePosition;
  isSelected: boolean;
  isVisited: boolean;
  isConnectedToSelected: boolean;
  onClick: () => void;
  dimmed: boolean;
  showLabel: boolean;
}

const ConceptNode: React.FC<ConceptNodeProps> = ({
  position,
  isSelected,
  isVisited,
  isConnectedToSelected,
  onClick,
  dimmed,
  showLabel,
}) => {
  const { node, isCenter } = position;
  const nodeSize = isCenter ? 120 : 90;
  
  return (
    <motion.button
      className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
      style={{ 
        left: position.x, 
        top: position.y,
      }}
      onClick={onClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: isSelected ? 1.1 : 1, 
        opacity: dimmed ? 0.3 : 1,
      }}
      whileHover={{ scale: isSelected ? 1.1 : 1.08 }}
      whileTap={{ scale: 0.95 }}
      transition={SPRING_CONFIGS.smooth}
    >
      {/* Node circle */}
      <div 
        className={`
          flex flex-col items-center justify-center rounded-full 
          transition-all duration-300 shadow-lg
          ${isCenter 
            ? 'bg-kno-primary text-white' 
            : isSelected 
              ? 'bg-kno-secondary text-white ring-4 ring-kno-secondary/30' 
              : isVisited
                ? 'bg-kno-board text-kno-ink border-3 border-kno-secondary/50'
                : isConnectedToSelected
                  ? 'bg-kno-board text-kno-ink border-2 border-kno-primary/50'
                  : 'bg-kno-board text-kno-ink border-2 border-kno-rule hover:border-kno-primary/50'
          }
        `}
        style={{ width: nodeSize, height: nodeSize }}
      >
        {node.icon && (
          <span className={`${isCenter ? 'text-3xl' : 'text-2xl'} mb-1`}>
            {node.icon}
          </span>
        )}
        {showLabel && (
          <span className={`
            text-center leading-tight px-2
            ${isCenter ? 'text-sm font-semibold' : 'text-xs font-medium'}
          `}>
            {node.label}
          </span>
        )}
      </div>

      {/* Floating label for non-center nodes when labels hidden */}
      {!showLabel && !isCenter && (
        <motion.div
          className={`
            absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-1 
            bg-kno-ink text-white text-xs rounded whitespace-nowrap
            opacity-0 group-hover:opacity-100 transition-opacity
            pointer-events-none z-10
          `}
          style={{ top: nodeSize / 2 + 4 }}
        >
          {node.label}
        </motion.div>
      )}

      {/* Unvisited indicator */}
      {!isVisited && !isSelected && !isCenter && (
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 bg-kno-primary rounded-full"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
      
      {/* Pulse effect for center */}
      {isCenter && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-kno-primary"
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ width: nodeSize, height: nodeSize }}
        />
      )}
    </motion.button>
  );
};

interface ConnectionLinesProps {
  positions: NodePosition[];
  selectedId: string | null;
  centralNodeId: string;
  connectedNodes: RelationshipMapNode[];
}

const ConnectionLines: React.FC<ConnectionLinesProps> = ({
  positions,
  selectedId,
  centralNodeId,
  connectedNodes,
}) => {
  const centerPos = positions.find(p => p.isCenter);
  if (!centerPos) return null;

  return (
    <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
      {positions
        .filter(p => !p.isCenter)
        .map((pos, i) => {
          const isConnectedToSelected = 
            selectedId === centralNodeId || 
            selectedId === pos.node.id ||
            pos.node.connectsTo?.includes(selectedId || '');
          
          const selectedNode = connectedNodes.find(n => n.id === selectedId);
          const isPartOfSelectedNetwork = 
            selectedNode?.connectsTo?.includes(pos.node.id) ||
            pos.node.connectsTo?.includes(selectedId || '');

          const strokeColor = isConnectedToSelected || isPartOfSelectedNetwork
            ? 'stroke-kno-primary' 
            : 'stroke-kno-rule';
          const strokeWidth = isConnectedToSelected ? 2.5 : 1.5;
          const opacity = selectedId && !isConnectedToSelected && !isPartOfSelectedNetwork ? 0.2 : 0.6;

          return (
            <motion.line
              key={pos.node.id}
              x1={centerPos.x}
              y1={centerPos.y}
              x2={pos.x}
              y2={pos.y}
              className={strokeColor}
              strokeWidth={strokeWidth}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            />
          );
        })}
      
      {/* Cross-connections between nodes */}
      {connectedNodes.map((node, i) => {
        if (!node.connectsTo) return null;
        const fromPos = positions.find(p => p.node.id === node.id);
        
        return node.connectsTo
          .filter(targetId => targetId !== centralNodeId)
          .map(targetId => {
            const toPos = positions.find(p => p.node.id === targetId);
            if (!fromPos || !toPos) return null;
            
            // Only draw if this connection hasn't been drawn (avoid duplicates)
            const nodeIndex = connectedNodes.findIndex(n => n.id === node.id);
            const targetIndex = connectedNodes.findIndex(n => n.id === targetId);
            if (targetIndex < nodeIndex) return null;

            const isActive = selectedId === node.id || selectedId === targetId;

            return (
              <motion.line
                key={`${node.id}-${targetId}`}
                x1={fromPos.x}
                y1={fromPos.y}
                x2={toPos.x}
                y2={toPos.y}
                className={isActive ? 'stroke-kno-secondary' : 'stroke-kno-rule'}
                strokeWidth={isActive ? 2 : 1}
                strokeDasharray="4 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: isActive ? 0.8 : 0.3 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              />
            );
          });
      })}
    </svg>
  );
};

interface DetailPanelProps {
  node: RelationshipMapNode;
  isCenter: boolean;
  onClose: () => void;
  allNodes: RelationshipMapNode[];
  onNavigate: (id: string) => void;
}

const DetailPanel: React.FC<DetailPanelProps> = ({ 
  node, 
  isCenter,
  onClose, 
  allNodes,
  onNavigate 
}) => {
  const connectedNodes = node.connectsTo
    ?.map(id => allNodes.find(n => n.id === id))
    .filter(Boolean) as RelationshipMapNode[] || [];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={SPRING_CONFIGS.smooth}
      className={`
        bg-kno-board rounded-card shadow-card p-5 
        ${isCenter ? 'border-2 border-kno-primary' : 'border-2 border-kno-secondary'}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {node.icon && (
            <span className="text-3xl">{node.icon}</span>
          )}
          <div>
            <Text variant="title" size="lg" weight="bold" color={isCenter ? 'primary' : 'ink'}>
              {node.label}
            </Text>
            {isCenter && (
              <span className="inline-block px-2 py-0.5 bg-kno-primary/10 text-kno-primary text-xs font-medium rounded-full mt-1">
                Central Concept
              </span>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-kno-surface rounded-lg transition-colors"
        >
          <svg className="w-4 h-4 text-kno-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Description */}
      {node.description && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-4"
        >
          <Text variant="body" size="md" color="ink" className="leading-relaxed">
            {node.description}
          </Text>
        </motion.div>
      )}

      {/* Detail (full explanation) */}
      {node.detail && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-3 bg-kno-surface rounded-lg mb-4"
        >
          <Text variant="body" size="sm" color="ink-soft" className="leading-relaxed">
            {node.detail}
          </Text>
        </motion.div>
      )}

      {/* Connected concepts */}
      {connectedNodes.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Text variant="body" size="xs" weight="semibold" color="ink-muted" className="mb-2">
            Connects to
          </Text>
          <div className="flex flex-wrap gap-2">
            {connectedNodes.map(connected => (
              <button
                key={connected.id}
                onClick={() => onNavigate(connected.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-kno-secondary/10 hover:bg-kno-secondary/20 text-kno-secondary rounded-full text-sm transition-colors"
              >
                {connected.icon && <span className="text-base">{connected.icon}</span>}
                <span className="font-medium">{connected.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

// =============================================================================
// MOBILE VIEW
// =============================================================================

interface MobileViewProps {
  centralNode: RelationshipMapNode;
  connectedNodes: RelationshipMapNode[];
  selectedId: string | null;
  visitedIds: Set<string>;
  onSelect: (id: string | null) => void;
}

const MobileView: React.FC<MobileViewProps> = ({
  centralNode,
  connectedNodes,
  selectedId,
  visitedIds,
  onSelect,
}) => {
  const allNodes = [centralNode, ...connectedNodes];

  return (
    <div className="space-y-4">
      {/* Central node - prominent */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`
          p-4 rounded-card border-2 bg-kno-board
          ${selectedId === centralNode.id 
            ? 'border-kno-primary shadow-card' 
            : 'border-kno-primary/30'
          }
        `}
      >
        <button
          onClick={() => onSelect(selectedId === centralNode.id ? null : centralNode.id)}
          className="w-full flex items-center gap-3 text-left"
        >
          <div className="w-14 h-14 rounded-full bg-kno-primary text-white flex items-center justify-center text-2xl">
            {centralNode.icon || '🎯'}
          </div>
          <div className="flex-1">
            <Text variant="title" size="md" weight="bold" color="primary">
              {centralNode.label}
            </Text>
            <Text variant="body" size="xs" color="ink-muted">
              Central Concept
            </Text>
          </div>
        </button>
        
        <AnimatePresence>
          {selectedId === centralNode.id && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-kno-rule space-y-2">
                {centralNode.description && (
                  <Text variant="body" size="sm" color="ink">
                    {centralNode.description}
                  </Text>
                )}
                {centralNode.detail && (
                  <Text variant="body" size="sm" color="ink-soft">
                    {centralNode.detail}
                  </Text>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Connected nodes */}
      <div className="grid gap-3">
        {connectedNodes.map((node, i) => {
          const isSelected = selectedId === node.id;
          const isVisited = visitedIds.has(node.id);
          
          return (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`
                p-4 rounded-card border-2 bg-kno-board
                ${isSelected 
                  ? 'border-kno-secondary shadow-card' 
                  : isVisited 
                    ? 'border-kno-secondary/30'
                    : 'border-kno-rule'
                }
              `}
            >
              <button
                onClick={() => onSelect(isSelected ? null : node.id)}
                className="w-full flex items-center gap-3 text-left"
              >
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center text-xl
                  ${isSelected 
                    ? 'bg-kno-secondary text-white' 
                    : 'bg-kno-surface text-kno-ink'
                  }
                `}>
                  {node.icon || '📌'}
                </div>
                <div className="flex-1 min-w-0">
                  <Text variant="title" size="sm" weight="semibold" color={isSelected ? 'secondary' : 'ink'}>
                    {node.label}
                  </Text>
                  {node.description && !isSelected && (
                    <Text variant="body" size="xs" color="ink-muted" className="truncate">
                      {node.description}
                    </Text>
                  )}
                </div>
                {!isVisited && !isSelected && (
                  <div className="w-2 h-2 bg-kno-primary rounded-full" />
                )}
              </button>

              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 mt-3 border-t border-kno-rule space-y-2">
                      {node.description && (
                        <Text variant="body" size="sm" color="ink">
                          {node.description}
                        </Text>
                      )}
                      {node.detail && (
                        <Text variant="body" size="sm" color="ink-soft">
                          {node.detail}
                        </Text>
                      )}
                      {node.connectsTo && node.connectsTo.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {node.connectsTo.map(id => {
                            const connected = allNodes.find(n => n.id === id);
                            if (!connected) return null;
                            return (
                              <button
                                key={id}
                                onClick={(e) => { e.stopPropagation(); onSelect(id); }}
                                className="px-2 py-1 bg-kno-secondary/10 text-kno-secondary text-xs rounded-full"
                              >
                                {connected.icon} {connected.label}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const RelationshipMap: React.FC<RelationshipMapProps> = ({ 
  data, 
  className = '',
  id,
}) => {
  const { 
    title, 
    centralNode, 
    connectedNodes, 
    layout = 'radial',
    showLabelsOnLoad = true 
  } = data;
  
  const responsive = useResponsive();
  const { ref, isInView } = useScrollReveal({ threshold: 0.1 });

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [visitedIds, setVisitedIds] = useState<Set<string>>(new Set([centralNode.id]));
  const [showLabels, setShowLabels] = useState(showLabelsOnLoad);

  // Diagram dimensions
  const diagramSize = responsive.isMobile ? 350 : responsive.isTablet ? 550 : 650;

  // Calculate positions
  const positions = useMemo(() => 
    calculateRadialPositions(centralNode, connectedNodes, diagramSize, diagramSize),
    [centralNode, connectedNodes, diagramSize]
  );

  // Handle selection
  const handleSelect = (nodeId: string | null) => {
    setSelectedId(nodeId);
    if (nodeId) {
      setVisitedIds(prev => new Set([...prev, nodeId]));
    }
  };

  const selectedNode = selectedId 
    ? [centralNode, ...connectedNodes].find(n => n.id === selectedId)
    : null;
  
  const allNodes = [centralNode, ...connectedNodes];
  const progressPercent = (visitedIds.size / allNodes.length) * 100;

  return (
    <motion.div
      ref={ref}
      id={id}
      className={`w-full max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Header */}
      <header className="mb-6 md:mb-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
        >
          {title && (
            <Text 
              as="h1" 
              variant="display" 
              size="3xl" 
              weight="bold" 
              color="ink"
              className="mb-4"
            >
              {title}
            </Text>
          )}
        </motion.div>

        {/* Controls & Progress */}
        <motion.div 
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
        >
          <ProgressIndicator
            value={visitedIds.size}
            max={allNodes.length}
            variant="dots"
            label="Concepts explored"
            showText
          />
          
          {!responsive.isMobile && (
            <button
              onClick={() => setShowLabels(!showLabels)}
              className="px-3 py-1.5 text-sm font-medium text-kno-ink-soft hover:bg-kno-surface rounded-lg transition-colors"
            >
              {showLabels ? 'Hide Labels' : 'Show Labels'}
            </button>
          )}
        </motion.div>
      </header>

      {/* Main Content */}
      <div className="grid lg:grid-cols-[1fr,320px] gap-6">
        {/* Map Area */}
        <Card variant="default" className="overflow-hidden">
          {responsive.isMobile ? (
            <MobileView
              centralNode={centralNode}
              connectedNodes={connectedNodes}
              selectedId={selectedId}
              visitedIds={visitedIds}
              onSelect={handleSelect}
            />
          ) : (
            <div 
              className="relative mx-auto"
              style={{ width: diagramSize, height: diagramSize }}
            >
              {/* Connection Lines */}
              <ConnectionLines
                positions={positions}
                selectedId={selectedId}
                centralNodeId={centralNode.id}
                connectedNodes={connectedNodes}
              />

              {/* Concept Nodes */}
              {positions.map(pos => (
                <ConceptNode
                  key={pos.node.id}
                  position={pos}
                  isSelected={selectedId === pos.node.id}
                  isVisited={visitedIds.has(pos.node.id)}
                  isConnectedToSelected={
                    selectedId !== null && (
                      pos.node.connectsTo?.includes(selectedId) ||
                      allNodes.find(n => n.id === selectedId)?.connectsTo?.includes(pos.node.id) ||
                      false
                    )
                  }
                  onClick={() => handleSelect(selectedId === pos.node.id ? null : pos.node.id)}
                  dimmed={selectedId !== null && selectedId !== pos.node.id && !pos.isCenter}
                  showLabel={showLabels}
                />
              ))}
            </div>
          )}
        </Card>

        {/* Detail Panel (desktop/tablet only) */}
        {!responsive.isMobile && (
          <div className="lg:sticky lg:top-6 self-start">
            <AnimatePresence mode="wait">
              {selectedNode ? (
                <DetailPanel
                  key={selectedNode.id}
                  node={selectedNode}
                  isCenter={selectedNode.id === centralNode.id}
                  onClose={() => setSelectedId(null)}
                  allNodes={allNodes}
                  onNavigate={handleSelect}
                />
              ) : (
                <motion.div
                  key="prompt"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-kno-surface rounded-card p-6 text-center"
                >
                  <div className="text-4xl mb-3">🔍</div>
                  <Text variant="body" size="md" color="ink-soft">
                    Click on any concept to explore how it relates to the central idea.
                  </Text>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Completion */}
      {visitedIds.size === allNodes.length && (
        <motion.div
          className="mt-6 p-4 bg-kno-secondary/10 rounded-lg text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-center gap-2 text-kno-secondary">
            <span className="text-xl">🎉</span>
            <Text variant="body" size="md" weight="medium" color="secondary">
              You've explored all the concepts!
            </Text>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default RelationshipMap;
