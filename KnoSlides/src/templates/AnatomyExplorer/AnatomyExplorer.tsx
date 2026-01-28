/**
 * Anatomy Explorer Template
 * 
 * Understand complex systems by exploring their component parts.
 * Based on part-whole learning and systems thinking.
 * 
 * Features:
 * - Interactive diagram with clickable parts
 * - Multiple layout options (hierarchical, radial, grid, linear)
 * - Connection lines between related parts
 * - Detail panel showing purpose, how it works, and key insights
 * - Progress tracking for parts explored
 * - Completion message when all parts visited
 * - Responsive design with mobile-friendly view
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AnatomyExplorerProps, 
  AnatomyPart, 
  AnatomyConnection 
} from '../../types';
import { Card, Text, Icon, LottiePlayer, ProgressIndicator } from '../../components';
import { 
  fadeInUp, 
  fadeInScale,
  staggerContainer, 
  selectedState,
  drawLine,
  SPRING_CONFIGS,
} from '../../animations';
import { useResponsive, useScrollReveal } from '../../hooks';

// =============================================================================
// LAYOUT CALCULATIONS
// =============================================================================

interface PartPosition {
  x: number;
  y: number;
  part: AnatomyPart;
}

const calculatePositions = (
  parts: AnatomyPart[],
  layout: 'hierarchical' | 'radial' | 'linear' | 'grid',
  containerWidth: number,
  containerHeight: number
): PartPosition[] => {
  const corePart = parts.find(p => p.isCore);
  const nonCoreParts = parts.filter(p => !p.isCore);
  const padding = 60;
  const nodeSize = 80;

  switch (layout) {
    case 'radial': {
      const centerX = containerWidth / 2;
      const centerY = containerHeight / 2;
      const radius = Math.min(containerWidth, containerHeight) / 2 - padding - nodeSize;
      
      const positions: PartPosition[] = [];
      
      // Core in center
      if (corePart) {
        positions.push({ x: centerX, y: centerY, part: corePart });
      }
      
      // Others in circle
      nonCoreParts.forEach((part, i) => {
        const angle = (i / nonCoreParts.length) * 2 * Math.PI - Math.PI / 2;
        positions.push({
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
          part,
        });
      });
      
      return positions;
    }

    case 'hierarchical': {
      const levels: AnatomyPart[][] = [];
      
      // Level 0: core
      if (corePart) levels.push([corePart]);
      
      // Level 1: all non-core parts (simple hierarchy for now)
      if (nonCoreParts.length > 0) levels.push(nonCoreParts);
      
      const positions: PartPosition[] = [];
      const levelHeight = containerHeight / (levels.length + 1);
      
      levels.forEach((levelParts, levelIndex) => {
        const y = (levelIndex + 1) * levelHeight;
        const partWidth = containerWidth / (levelParts.length + 1);
        
        levelParts.forEach((part, partIndex) => {
          positions.push({
            x: (partIndex + 1) * partWidth,
            y,
            part,
          });
        });
      });
      
      return positions;
    }

    case 'linear': {
      const positions: PartPosition[] = [];
      const allParts = corePart ? [corePart, ...nonCoreParts] : nonCoreParts;
      const partWidth = containerWidth / (allParts.length + 1);
      const y = containerHeight / 2;
      
      allParts.forEach((part, i) => {
        positions.push({
          x: (i + 1) * partWidth,
          y,
          part,
        });
      });
      
      return positions;
    }

    case 'grid':
    default: {
      const allParts = corePart ? [corePart, ...nonCoreParts] : nonCoreParts;
      const cols = Math.ceil(Math.sqrt(allParts.length));
      const rows = Math.ceil(allParts.length / cols);
      const cellWidth = containerWidth / (cols + 1);
      const cellHeight = containerHeight / (rows + 1);
      
      return allParts.map((part, i) => ({
        x: ((i % cols) + 1) * cellWidth,
        y: (Math.floor(i / cols) + 1) * cellHeight,
        part,
      }));
    }
  }
};

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

interface PartNodeProps {
  position: PartPosition;
  isSelected: boolean;
  isVisited: boolean;
  isCore: boolean;
  onClick: () => void;
  dimmed: boolean;
}

const PartNode: React.FC<PartNodeProps> = ({
  position,
  isSelected,
  isVisited,
  isCore,
  onClick,
  dimmed,
}) => {
  const { part } = position;
  
  return (
    <motion.button
      className={`
        absolute transform -translate-x-1/2 -translate-y-1/2
        flex flex-col items-center justify-center
        rounded-2xl p-3 min-w-[80px] transition-colors
        ${isCore ? 'min-w-[100px]' : ''}
        ${isSelected 
          ? 'bg-kno-primary text-white shadow-lg z-20' 
          : isVisited 
            ? 'bg-kno-primary/10 text-kno-ink border-2 border-kno-primary/30'
            : 'bg-kno-board text-kno-ink border-2 border-kno-rule hover:border-kno-primary/50'
        }
        ${dimmed ? 'opacity-40' : ''}
      `}
      style={{ 
        left: position.x, 
        top: position.y,
      }}
      onClick={onClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: isSelected ? 1.1 : 1, 
        opacity: dimmed ? 0.4 : 1,
      }}
      whileHover={{ scale: isSelected ? 1.1 : 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={SPRING_CONFIGS.smooth}
    >
      {part.icon && (
        <span className={`text-2xl mb-1 ${isCore ? 'text-3xl' : ''}`}>
          {part.icon}
        </span>
      )}
      <span className={`
        text-xs font-medium text-center leading-tight
        ${isCore ? 'text-sm font-semibold' : ''}
      `}>
        {part.shortLabel || part.label}
      </span>
      
      {/* Unvisited indicator */}
      {!isVisited && !isSelected && (
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 bg-kno-primary rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
};

interface ConnectionLinesProps {
  positions: PartPosition[];
  connections: AnatomyConnection[];
  selectedId: string | null;
  containerWidth: number;
  containerHeight: number;
}

const ConnectionLines: React.FC<ConnectionLinesProps> = ({
  positions,
  connections,
  selectedId,
  containerWidth,
  containerHeight,
}) => {
  const getPosition = (id: string) => positions.find(p => p.part.id === id);

  return (
    <svg 
      className="absolute inset-0 pointer-events-none"
      width={containerWidth}
      height={containerHeight}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="10"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill="currentColor"
            className="text-kno-rule"
          />
        </marker>
        <marker
          id="arrowhead-active"
          markerWidth="10"
          markerHeight="7"
          refX="10"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill="currentColor"
            className="text-kno-primary"
          />
        </marker>
      </defs>
      
      {connections.map((conn, i) => {
        const from = getPosition(conn.from);
        const to = getPosition(conn.to);
        
        if (!from || !to) return null;
        
        const isActive = selectedId === conn.from || selectedId === conn.to;
        const isConnectedToSelected = 
          selectedId && 
          (positions.find(p => p.part.id === selectedId)?.part.detail?.connectedParts?.includes(conn.from) ||
           positions.find(p => p.part.id === selectedId)?.part.detail?.connectedParts?.includes(conn.to));
        
        const strokeColor = isActive || isConnectedToSelected 
          ? 'stroke-kno-primary' 
          : 'stroke-kno-rule';
        const strokeWidth = isActive ? 2.5 : 1.5;
        const strokeDash = conn.style === 'dashed' 
          ? '8 4' 
          : conn.style === 'dotted' 
            ? '2 4' 
            : 'none';

        return (
          <motion.line
            key={`${conn.from}-${conn.to}-${i}`}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            className={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDash}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1, 
              opacity: isActive || isConnectedToSelected ? 1 : 0.5 
            }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          />
        );
      })}
    </svg>
  );
};

interface DetailPanelProps {
  part: AnatomyPart;
  onClose: () => void;
  allParts: AnatomyPart[];
  onNavigate: (id: string) => void;
}

const DetailPanel: React.FC<DetailPanelProps> = ({ 
  part, 
  onClose, 
  allParts,
  onNavigate 
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
      transition={SPRING_CONFIGS.smooth}
      className="bg-kno-board rounded-card shadow-card p-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {part.icon && (
            <span className="text-3xl">{part.icon}</span>
          )}
          <div>
            <Text variant="title" size="xl" weight="bold" color="ink">
              {part.label}
            </Text>
            {part.isCore && (
              <span className="inline-block px-2 py-0.5 bg-kno-primary/10 text-kno-primary text-xs font-medium rounded-full mt-1">
                Core Element
              </span>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-kno-surface rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-kno-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content sections */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {detail?.purpose && (
          <motion.div variants={fadeInUp}>
            <Text variant="body" size="sm" weight="semibold" color="primary" className="mb-1">
              Purpose
            </Text>
            <Text variant="body" size="md" color="ink">
              {detail.purpose}
            </Text>
          </motion.div>
        )}

        {detail?.howItWorks && (
          <motion.div variants={fadeInUp}>
            <Text variant="body" size="sm" weight="semibold" color="secondary" className="mb-1">
              How It Works
            </Text>
            <Text variant="body" size="md" color="ink">
              {detail.howItWorks}
            </Text>
          </motion.div>
        )}

        {detail?.keyInsight && (
          <motion.div 
            variants={fadeInUp}
            className="p-4 bg-kno-highlight/10 rounded-lg border-l-4 border-kno-highlight"
          >
            <Text variant="body" size="sm" weight="semibold" color="ink" className="mb-1">
              💡 Key Insight
            </Text>
            <Text variant="body" size="md" color="ink">
              {detail.keyInsight}
            </Text>
          </motion.div>
        )}

        {connectedParts.length > 0 && (
          <motion.div variants={fadeInUp}>
            <Text variant="body" size="sm" weight="semibold" color="ink-soft" className="mb-2">
              Connected To
            </Text>
            <div className="flex flex-wrap gap-2">
              {connectedParts.map(connected => (
                <button
                  key={connected.id}
                  onClick={() => onNavigate(connected.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-kno-surface hover:bg-kno-primary/10 rounded-full text-sm transition-colors"
                >
                  {connected.icon && <span>{connected.icon}</span>}
                  <span>{connected.shortLabel || connected.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

// =============================================================================
// MOBILE VIEW COMPONENT
// =============================================================================

interface MobileViewProps {
  parts: AnatomyPart[];
  selectedId: string | null;
  visitedIds: Set<string>;
  onSelect: (id: string | null) => void;
}

const MobileView: React.FC<MobileViewProps> = ({
  parts,
  selectedId,
  visitedIds,
  onSelect,
}) => {
  const corePart = parts.find(p => p.isCore);
  const otherParts = parts.filter(p => !p.isCore);

  return (
    <div className="space-y-3">
      {/* Core part first */}
      {corePart && (
        <PartCard 
          part={corePart} 
          isSelected={selectedId === corePart.id}
          isVisited={visitedIds.has(corePart.id)}
          onClick={() => onSelect(selectedId === corePart.id ? null : corePart.id)}
          allParts={parts}
          onNavigate={onSelect}
        />
      )}
      
      {/* Other parts */}
      {otherParts.map(part => (
        <PartCard
          key={part.id}
          part={part}
          isSelected={selectedId === part.id}
          isVisited={visitedIds.has(part.id)}
          onClick={() => onSelect(selectedId === part.id ? null : part.id)}
          allParts={parts}
          onNavigate={onSelect}
        />
      ))}
    </div>
  );
};

interface PartCardProps {
  part: AnatomyPart;
  isSelected: boolean;
  isVisited: boolean;
  onClick: () => void;
  allParts: AnatomyPart[];
  onNavigate: (id: string) => void;
}

const PartCard: React.FC<PartCardProps> = ({
  part,
  isSelected,
  isVisited,
  onClick,
  allParts,
  onNavigate,
}) => {
  return (
    <motion.div
      layout
      className={`
        rounded-card overflow-hidden border-2 transition-colors
        ${isSelected 
          ? 'border-kno-primary bg-kno-board shadow-card' 
          : isVisited
            ? 'border-kno-primary/30 bg-kno-board'
            : 'border-kno-rule bg-kno-board hover:border-kno-primary/50'
        }
      `}
    >
      {/* Header - always visible */}
      <button
        onClick={onClick}
        className="w-full p-4 flex items-center gap-3 text-left"
      >
        <div className={`
          w-12 h-12 rounded-xl flex items-center justify-center text-2xl
          ${isSelected ? 'bg-kno-primary text-white' : 'bg-kno-surface'}
          ${part.isCore ? 'ring-2 ring-kno-primary/30' : ''}
        `}>
          {part.icon || '📦'}
        </div>
        <div className="flex-1 min-w-0">
          <Text variant="title" size="md" weight="semibold" color={isSelected ? 'primary' : 'ink'}>
            {part.label}
          </Text>
          {part.isCore && (
            <span className="text-xs text-kno-primary">Core Element</span>
          )}
        </div>
        <motion.div
          animate={{ rotate: isSelected ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg className="w-5 h-5 text-kno-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
        
        {/* Unvisited dot */}
        {!isVisited && !isSelected && (
          <motion.div
            className="w-2.5 h-2.5 bg-kno-primary rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </button>

      {/* Expandable detail */}
      <AnimatePresence>
        {isSelected && part.detail && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 space-y-3 border-t border-kno-rule">
              {part.detail.purpose && (
                <div className="pt-3">
                  <Text variant="body" size="xs" weight="semibold" color="primary">Purpose</Text>
                  <Text variant="body" size="sm" color="ink">{part.detail.purpose}</Text>
                </div>
              )}
              {part.detail.howItWorks && (
                <div>
                  <Text variant="body" size="xs" weight="semibold" color="secondary">How It Works</Text>
                  <Text variant="body" size="sm" color="ink">{part.detail.howItWorks}</Text>
                </div>
              )}
              {part.detail.keyInsight && (
                <div className="p-3 bg-kno-highlight/10 rounded-lg">
                  <Text variant="body" size="xs" weight="semibold" color="ink">💡 Key Insight</Text>
                  <Text variant="body" size="sm" color="ink">{part.detail.keyInsight}</Text>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const AnatomyExplorer: React.FC<AnatomyExplorerProps> = ({ 
  data, 
  className = '',
  id,
}) => {
  const { 
    title, 
    subtitle, 
    diagramLayout = 'hierarchical', 
    parts, 
    connections = [],
    completionMessage 
  } = data;
  
  const responsive = useResponsive();
  const { ref, isInView } = useScrollReveal({ threshold: 0.1 });

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [visitedIds, setVisitedIds] = useState<Set<string>>(new Set());

  // Mark part as visited when selected
  const handleSelect = (partId: string | null) => {
    setSelectedId(partId);
    if (partId) {
      setVisitedIds(prev => new Set([...prev, partId]));
    }
  };

  // Diagram dimensions
  const diagramWidth = responsive.isMobile ? 350 : responsive.isTablet ? 600 : 800;
  const diagramHeight = responsive.isMobile ? 350 : responsive.isTablet ? 400 : 450;

  // Calculate positions
  const positions = useMemo(() => 
    calculatePositions(parts, diagramLayout, diagramWidth, diagramHeight),
    [parts, diagramLayout, diagramWidth, diagramHeight]
  );

  const selectedPart = parts.find(p => p.id === selectedId);
  const progressPercent = (visitedIds.size / parts.length) * 100;
  const allVisited = visitedIds.size === parts.length;

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
          <Text 
            as="h1" 
            variant="display" 
            size="3xl" 
            weight="bold" 
            color="ink"
            className="mb-2"
          >
            {title}
          </Text>
          {subtitle && (
            <Text variant="body" size="lg" color="ink-soft">
              {subtitle}
            </Text>
          )}
        </motion.div>

        {/* Progress */}
        <motion.div 
          className="mt-4"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
        >
          <ProgressIndicator
            value={visitedIds.size}
            max={parts.length}
            variant="dots"
            label="Parts explored"
            showText
          />
        </motion.div>
      </header>

      {/* Main Content */}
      <div className="grid lg:grid-cols-[1fr,350px] gap-6">
        {/* Diagram Area */}
        <Card variant="default" className="overflow-hidden">
          {responsive.isMobile ? (
            <MobileView
              parts={parts}
              selectedId={selectedId}
              visitedIds={visitedIds}
              onSelect={handleSelect}
            />
          ) : (
            <div 
              className="relative"
              style={{ width: diagramWidth, height: diagramHeight, margin: '0 auto' }}
            >
              {/* Connection Lines */}
              <ConnectionLines
                positions={positions}
                connections={connections}
                selectedId={selectedId}
                containerWidth={diagramWidth}
                containerHeight={diagramHeight}
              />

              {/* Part Nodes */}
              {positions.map(pos => (
                <PartNode
                  key={pos.part.id}
                  position={pos}
                  isSelected={selectedId === pos.part.id}
                  isVisited={visitedIds.has(pos.part.id)}
                  isCore={pos.part.isCore || false}
                  onClick={() => handleSelect(selectedId === pos.part.id ? null : pos.part.id)}
                  dimmed={selectedId !== null && selectedId !== pos.part.id}
                />
              ))}
            </div>
          )}
        </Card>

        {/* Detail Panel (desktop/tablet only) */}
        {!responsive.isMobile && (
          <div className="lg:sticky lg:top-6 self-start">
            <AnimatePresence mode="wait">
              {selectedPart ? (
                <DetailPanel
                  key={selectedPart.id}
                  part={selectedPart}
                  onClose={() => setSelectedId(null)}
                  allParts={parts}
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
                  <div className="text-4xl mb-3">👆</div>
                  <Text variant="body" size="md" color="ink-soft">
                    Click on any part to explore what it does and how it connects to others.
                  </Text>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Completion Message */}
      {allVisited && completionMessage && (
        <motion.div
          className="mt-6 p-4 bg-kno-accent-green/10 rounded-lg text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-center gap-2 text-kno-accent-green">
            <LottiePlayer lottieRef="success" width={40} height={40} loop={false} />
            <Text variant="body" size="md" weight="medium" color="accent-green">
              {completionMessage}
            </Text>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AnatomyExplorer;
