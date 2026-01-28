/**
 * Anatomy Explorer Template
 * 
 * Understand complex systems by exploring their component parts.
 * Notion + Brilliant.org inspired - clean, professional, with alive connections.
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnatomyExplorerProps, AnatomyPart } from '../../types';
import { SPRING_CONFIGS } from '../../animations';

// =============================================================================
// FLOWING LINE ANIMATION STYLES
// =============================================================================

const flowingLineStyle = `
  @keyframes flowDash {
    to {
      stroke-dashoffset: -20;
    }
  }
  .flowing-line {
    stroke-dasharray: 10 5;
    animation: flowDash 1s linear infinite;
  }
  .flowing-line-slow {
    stroke-dasharray: 8 4;
    animation: flowDash 2s linear infinite;
  }
`;

// =============================================================================
// LAYOUT CALCULATIONS
// =============================================================================

interface NodePosition {
  x: number;
  y: number;
  part: AnatomyPart;
}

const calculateHierarchicalPositions = (
  parts: AnatomyPart[],
  width: number,
  height: number
): NodePosition[] => {
  const corePart = parts.find(p => p.isCore);
  const childParts = parts.filter(p => !p.isCore);
  
  const positions: NodePosition[] = [];
  
  // Core at top center
  if (corePart) {
    positions.push({
      x: width / 2,
      y: 100,
      part: corePart,
    });
  }
  
  // Children spread below in a row
  const childY = height - 120;
  const childSpacing = width / (childParts.length + 1);
  
  childParts.forEach((part, i) => {
    positions.push({
      x: childSpacing * (i + 1),
      y: childY,
      part,
    });
  });
  
  return positions;
};

// =============================================================================
// CONNECTION LINES WITH FLOW ANIMATION
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
  const corePos = positions.find(p => p.part.isCore);
  const childPositions = positions.filter(p => !p.part.isCore);
  
  if (!corePos) return null;

  return (
    <>
      <style>{flowingLineStyle}</style>
      <svg 
        className="absolute inset-0 pointer-events-none"
        width={width}
        height={height}
        style={{ overflow: 'visible' }}
      >
        {/* Lines from core to ALL children */}
        {childPositions.map((childPos, i) => {
          const isConnected = selectedId === corePos.part.id || selectedId === childPos.part.id;
          
          return (
            <motion.line
              key={`core-${childPos.part.id}`}
              x1={corePos.x}
              y1={corePos.y + 40}
              x2={childPos.x}
              y2={childPos.y - 40}
              className={isConnected ? 'flowing-line' : 'flowing-line-slow'}
              stroke={isConnected ? '#6366f1' : '#d1d5db'}
              strokeWidth={isConnected ? 2.5 : 1.5}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            />
          );
        })}
        
        {/* Cross-connections between children */}
        {childPositions.map((fromPos, i) => {
          const connectedIds = fromPos.part.detail?.connectedParts || [];
          return connectedIds.map(toId => {
            const toPos = childPositions.find(p => p.part.id === toId);
            if (!toPos) return null;
            
            // Avoid duplicate lines
            const toIndex = childPositions.findIndex(p => p.part.id === toId);
            if (toIndex < i) return null;
            
            const isActive = selectedId === fromPos.part.id || selectedId === toId;
            
            return (
              <motion.line
                key={`${fromPos.part.id}-${toId}`}
                x1={fromPos.x}
                y1={fromPos.y - 40}
                x2={toPos.x}
                y2={toPos.y - 40}
                className={isActive ? 'flowing-line' : ''}
                stroke={isActive ? '#8b5cf6' : '#e5e7eb'}
                strokeWidth={isActive ? 2 : 1}
                strokeDasharray={isActive ? undefined : '4 4'}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: isActive ? 0.8 : 0.4 }}
                transition={{ duration: 0.5, delay: 0.3 }}
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

interface PartNodeProps {
  position: NodePosition;
  isSelected: boolean;
  isVisited: boolean;
  onClick: () => void;
}

const PartNode: React.FC<PartNodeProps> = ({
  position,
  isSelected,
  isVisited,
  onClick,
}) => {
  const { part } = position;
  const isCore = part.isCore;
  const nodeSize = isCore ? 100 : 80;
  
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
          rounded-full flex flex-col items-center justify-center p-4 transition-all duration-200
          ${isCore 
            ? isSelected 
              ? 'bg-indigo-600 text-white shadow-xl ring-4 ring-indigo-200' 
              : 'bg-indigo-100 text-indigo-700 shadow-lg hover:bg-indigo-200'
            : isSelected 
              ? 'bg-gray-900 text-white shadow-xl ring-4 ring-gray-300'
              : isVisited 
                ? 'bg-gray-100 text-gray-700 shadow-md hover:bg-gray-200 ring-2 ring-gray-300'
                : 'bg-white text-gray-700 shadow-md hover:bg-gray-50 border-2 border-gray-200'
          }
        `}
        style={{ width: nodeSize, height: nodeSize }}
      >
        <span className={`font-semibold text-center leading-tight ${isCore ? 'text-sm' : 'text-xs'}`}>
          {part.shortLabel || part.label}
        </span>
      </div>
      
      {/* Unvisited indicator */}
      {!isVisited && !isSelected && !isCore && (
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
};

// =============================================================================
// DETAIL ACCORDION
// =============================================================================

interface DetailAccordionProps {
  part: AnatomyPart;
  allParts: AnatomyPart[];
  onNavigate: (id: string) => void;
  onClose: () => void;
}

const DetailAccordion: React.FC<DetailAccordionProps> = ({ 
  part, 
  allParts, 
  onNavigate,
  onClose,
}) => {
  const detail = part.detail;
  const connectedParts = detail?.connectedParts
    ?.map(id => allParts.find(p => p.id === id))
    .filter(Boolean) as AnatomyPart[] || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className={`px-6 py-4 ${part.isCore ? 'bg-indigo-50' : 'bg-gray-50'} border-b border-gray-200`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{part.label}</h3>
            {part.isCore && (
              <span className="text-xs font-medium text-indigo-600 uppercase tracking-wide">
                Core Element
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
      <div className="p-6 space-y-5">
        {detail?.purpose && (
          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Purpose</h4>
            <p className="text-gray-700 leading-relaxed">{detail.purpose}</p>
          </div>
        )}

        {detail?.howItWorks && (
          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">How It Works</h4>
            <p className="text-gray-700 leading-relaxed">{detail.howItWorks}</p>
          </div>
        )}

        {detail?.keyInsight && (
          <div className="p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
            <h4 className="text-sm font-semibold text-amber-800 mb-1">Key Insight</h4>
            <p className="text-amber-900">{detail.keyInsight}</p>
          </div>
        )}

        {connectedParts.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Connected To</h4>
            <div className="flex flex-wrap gap-2">
              {connectedParts.map(connected => (
                <button
                  key={connected.id}
                  onClick={() => onNavigate(connected.id)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
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
// PROGRESS INDICATOR
// =============================================================================

interface ProgressProps {
  total: number;
  visited: number;
}

const Progress: React.FC<ProgressProps> = ({ total, visited }) => {
  return (
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
      <span className="text-sm text-gray-500">
        {visited} of {total} explored
      </span>
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const AnatomyExplorer: React.FC<AnatomyExplorerProps> = ({ 
  data, 
  className = '',
}) => {
  const { title, subtitle, parts, completionMessage } = data;

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [visitedIds, setVisitedIds] = useState<Set<string>>(new Set());

  // Diagram dimensions - use more space
  const diagramWidth = 900;
  const diagramHeight = 400;

  const positions = useMemo(() => 
    calculateHierarchicalPositions(parts, diagramWidth, diagramHeight),
    [parts, diagramWidth, diagramHeight]
  );

  const handleSelect = (partId: string) => {
    if (selectedId === partId) {
      setSelectedId(null);
    } else {
      setSelectedId(partId);
      setVisitedIds(prev => new Set([...prev, partId]));
    }
  };

  const selectedPart = parts.find(p => p.id === selectedId);
  const allVisited = visitedIds.size === parts.length;

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">{title}</h1>
        {subtitle && (
          <p className="text-xl text-gray-500">{subtitle}</p>
        )}
        <div className="mt-4">
          <Progress total={parts.length} visited={visitedIds.size} />
        </div>
      </header>

      {/* Diagram */}
      <div className="flex justify-center mb-8">
        <div 
          className="relative bg-gradient-to-b from-gray-50 to-white rounded-2xl border border-gray-200"
          style={{ width: diagramWidth, height: diagramHeight }}
        >
          {/* Instruction */}
          {!selectedId && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-sm text-gray-400">
              Click any element to explore
            </div>
          )}

          {/* Connection Lines */}
          <ConnectionLines
            positions={positions}
            selectedId={selectedId}
            width={diagramWidth}
            height={diagramHeight}
          />

          {/* Nodes */}
          {positions.map(pos => (
            <PartNode
              key={pos.part.id}
              position={pos}
              isSelected={selectedId === pos.part.id}
              isVisited={visitedIds.has(pos.part.id)}
              onClick={() => handleSelect(pos.part.id)}
            />
          ))}
        </div>
      </div>

      {/* Detail Panel (below diagram) */}
      <AnimatePresence mode="wait">
        {selectedPart && (
          <div className="max-w-2xl mx-auto">
            <DetailAccordion
              part={selectedPart}
              allParts={parts}
              onNavigate={handleSelect}
              onClose={() => setSelectedId(null)}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Completion */}
      {allVisited && completionMessage && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center max-w-2xl mx-auto"
        >
          <p className="text-emerald-700 font-medium">{completionMessage}</p>
        </motion.div>
      )}
    </div>
  );
};

export default AnatomyExplorer;
