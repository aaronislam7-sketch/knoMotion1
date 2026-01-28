/**
 * Layered Deep Dive Template
 * 
 * Progressive depth exploration - learners choose how deep to go.
 * Notion + Brilliant.org inspired aesthetic - clean, professional, subtly delightful.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayeredDeepDiveProps, Layer, LayerContent } from '../../types';
import { SPRING_CONFIGS } from '../../animations';

// =============================================================================
// LAYER CARD COMPONENT
// =============================================================================

interface LayerCardProps {
  layer: Layer;
  index: number;
  totalLayers: number;
  isExpanded: boolean;
  onToggle: () => void;
}

const LayerCard: React.FC<LayerCardProps> = ({ 
  layer, 
  index, 
  totalLayers,
  isExpanded, 
  onToggle 
}) => {
  const depthColors = [
    { bg: 'bg-blue-50', border: 'border-blue-200', accent: 'text-blue-600', pill: 'bg-blue-100 text-blue-700' },
    { bg: 'bg-purple-50', border: 'border-purple-200', accent: 'text-purple-600', pill: 'bg-purple-100 text-purple-700' },
    { bg: 'bg-amber-50', border: 'border-amber-200', accent: 'text-amber-600', pill: 'bg-amber-100 text-amber-700' },
    { bg: 'bg-emerald-50', border: 'border-emerald-200', accent: 'text-emerald-600', pill: 'bg-emerald-100 text-emerald-700' },
  ];
  
  const colors = depthColors[index % depthColors.length];

  return (
    <motion.div
      layout
      className={`rounded-xl border-2 overflow-hidden transition-colors ${
        isExpanded ? `${colors.bg} ${colors.border}` : 'bg-white border-gray-100 hover:border-gray-200'
      }`}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full px-8 py-6 flex items-center gap-6 text-left"
      >
        {/* Layer Number */}
        <div className={`
          w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold
          transition-colors ${isExpanded ? `${colors.pill}` : 'bg-gray-100 text-gray-500'}
        `}>
          {index + 1}
        </div>

        {/* Layer Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className={`text-xl font-semibold ${isExpanded ? colors.accent : 'text-gray-900'}`}>
              {layer.label}
            </h3>
            {layer.depthLabel && (
              <span className={`px-3 py-0.5 rounded-full text-xs font-medium ${
                isExpanded ? colors.pill : 'bg-gray-100 text-gray-500'
              }`}>
                {layer.depthLabel}
              </span>
            )}
          </div>
          {!isExpanded && typeof layer.content === 'string' && (
            <p className="text-gray-500 text-base truncate">
              {layer.content.substring(0, 100)}...
            </p>
          )}
        </div>

        {/* Expand Icon */}
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </button>

      {/* Expandable Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-8 pb-8 pt-2">
              <LayerContentDisplay content={layer.content} colors={colors} />
              
              {/* Next Layer Prompt */}
              {index < totalLayers - 1 && (
                <motion.div 
                  className="mt-8 pt-6 border-t border-gray-200/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-sm text-gray-500">
                    Ready to go deeper? Expand the next layer below.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// =============================================================================
// LAYER CONTENT DISPLAY
// =============================================================================

interface LayerContentDisplayProps {
  content: string | LayerContent;
  colors: { accent: string };
}

const LayerContentDisplay: React.FC<LayerContentDisplayProps> = ({ content, colors }) => {
  if (typeof content === 'string') {
    return (
      <p className="text-lg text-gray-700 leading-relaxed">
        {content}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {content.summary && (
        <p className="text-lg text-gray-700 leading-relaxed">
          {content.summary}
        </p>
      )}
      
      {content.points && content.points.length > 0 && (
        <ul className="space-y-4">
          {content.points.map((point, i) => (
            <motion.li 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4"
            >
              <span className={`flex-shrink-0 w-7 h-7 rounded-full bg-gray-100 ${colors.accent} flex items-center justify-center text-sm font-medium mt-0.5`}>
                {i + 1}
              </span>
              <div className="flex-1">
                <p className="text-base text-gray-800 leading-relaxed">
                  {point.text}
                </p>
                {point.tooltip && (
                  <p className="mt-2 text-sm text-gray-500 italic pl-4 border-l-2 border-gray-200">
                    {point.tooltip}
                  </p>
                )}
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
};

// =============================================================================
// DEPTH PROGRESS INDICATOR
// =============================================================================

interface DepthProgressProps {
  layers: Layer[];
  expandedLayers: Set<string>;
}

const DepthProgress: React.FC<DepthProgressProps> = ({ layers, expandedLayers }) => {
  return (
    <div className="flex items-center gap-2">
      {layers.map((layer, index) => {
        const isExpanded = expandedLayers.has(layer.id);
        return (
          <React.Fragment key={layer.id}>
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                isExpanded ? 'w-8 bg-gray-900' : 'w-2 bg-gray-200'
              }`}
            />
          </React.Fragment>
        );
      })}
      <span className="ml-3 text-sm text-gray-500">
        {expandedLayers.size} of {layers.length} explored
      </span>
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const LayeredDeepDive: React.FC<LayeredDeepDiveProps> = ({ 
  data, 
  className = '',
}) => {
  const { title, subtitle, layers, initiallyExpanded = 1 } = data;

  const [expandedLayers, setExpandedLayers] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    layers.slice(0, initiallyExpanded).forEach(layer => initial.add(layer.id));
    return initial;
  });

  const toggleLayer = (layerId: string) => {
    setExpandedLayers(prev => {
      const next = new Set(prev);
      if (next.has(layerId)) {
        next.delete(layerId);
      } else {
        next.add(layerId);
      }
      return next;
    });
  };

  const allExpanded = expandedLayers.size === layers.length;

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl text-gray-500">
            {subtitle}
          </p>
        )}
        
        {/* Progress & Controls */}
        <div className="mt-6 flex items-center justify-between">
          <DepthProgress layers={layers} expandedLayers={expandedLayers} />
          
          <button
            onClick={() => {
              if (allExpanded) {
                const first = layers[0]?.id;
                setExpandedLayers(first ? new Set([first]) : new Set());
              } else {
                setExpandedLayers(new Set(layers.map(l => l.id)));
              }
            }}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            {allExpanded ? 'Collapse all' : 'Expand all'}
          </button>
        </div>
      </header>

      {/* Layer Cards */}
      <div className="space-y-4">
        {layers.map((layer, index) => (
          <LayerCard
            key={layer.id}
            layer={layer}
            index={index}
            totalLayers={layers.length}
            isExpanded={expandedLayers.has(layer.id)}
            onToggle={() => toggleLayer(layer.id)}
          />
        ))}
      </div>

      {/* Completion State */}
      {allExpanded && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center"
        >
          <p className="text-emerald-700 font-medium">
            You've explored all depth levels. Great work going deep on this topic.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default LayeredDeepDive;
