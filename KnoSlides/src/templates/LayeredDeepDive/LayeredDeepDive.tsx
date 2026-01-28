/**
 * Layered Deep Dive Template
 * 
 * Progressive depth exploration - learners choose how deep to go.
 * Based on elaboration theory (Reigeluth) - presenting content from simple to complex.
 * 
 * Features:
 * - Expandable layers with smooth accordion animations
 * - Depth indicator showing current exploration level
 * - Staggered content reveal within layers
 * - Optional Lottie animations on reveal
 * - Responsive design (desktop/tablet/mobile)
 * - Scroll-triggered entrance animations
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayeredDeepDiveProps, 
  Layer, 
  LayerContent 
} from '../../types';
import { Card, Text, Icon, LottiePlayer, ProgressIndicator } from '../../components';
import { 
  fadeInUp, 
  staggerContainer, 
  accordionContent,
  SPRING_CONFIGS,
} from '../../animations';
import { useResponsive, useScrollReveal } from '../../hooks';

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

interface LayerHeaderProps {
  layer: Layer;
  index: number;
  isExpanded: boolean;
  isLast: boolean;
  onToggle: () => void;
}

const LayerHeader: React.FC<LayerHeaderProps> = ({ 
  layer, 
  index, 
  isExpanded, 
  isLast,
  onToggle 
}) => {
  return (
    <motion.button
      className={`w-full flex items-center gap-4 p-4 md:p-6 text-left rounded-t-card transition-colors
        ${isExpanded 
          ? 'bg-kno-primary/5 border-b border-kno-primary/20' 
          : 'hover:bg-kno-surface/50'
        }
        ${!isExpanded && !isLast ? 'border-b border-kno-rule' : ''}
      `}
      onClick={onToggle}
      whileHover={{ backgroundColor: isExpanded ? undefined : 'rgba(255, 249, 240, 0.5)' }}
      whileTap={{ scale: 0.995 }}
    >
      {/* Layer Number/Icon */}
      <div className={`
        flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full 
        flex items-center justify-center text-lg md:text-xl
        transition-colors duration-300
        ${isExpanded 
          ? 'bg-kno-primary text-white' 
          : 'bg-kno-rule text-kno-ink-soft'
        }
      `}>
        {layer.icon || (index + 1)}
      </div>

      {/* Layer Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Text 
            variant="title" 
            size="lg" 
            weight="semibold"
            color={isExpanded ? 'primary' : 'ink'}
            className="truncate"
          >
            {layer.label}
          </Text>
          {layer.depthLabel && (
            <span className={`
              px-2 py-0.5 rounded-full text-xs font-medium
              ${isExpanded 
                ? 'bg-kno-primary/20 text-kno-primary' 
                : 'bg-kno-rule text-kno-ink-muted'
              }
            `}>
              {layer.depthLabel}
            </span>
          )}
        </div>
        {!isExpanded && typeof layer.content === 'string' && (
          <Text 
            variant="body" 
            size="sm" 
            color="ink-muted"
            className="truncate mt-1"
          >
            {layer.content.substring(0, 80)}...
          </Text>
        )}
      </div>

      {/* Expand Icon */}
      <motion.div
        animate={{ rotate: isExpanded ? 180 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="flex-shrink-0"
      >
        <svg 
          className={`w-5 h-5 ${isExpanded ? 'text-kno-primary' : 'text-kno-ink-muted'}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.div>
    </motion.button>
  );
};

interface LayerContentDisplayProps {
  content: string | LayerContent;
  lottieOnReveal?: string;
  isVisible: boolean;
}

const LayerContentDisplay: React.FC<LayerContentDisplayProps> = ({ 
  content, 
  lottieOnReveal,
  isVisible 
}) => {
  // Simple string content
  if (typeof content === 'string') {
    return (
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate={isVisible ? 'visible' : 'hidden'}
        className="p-4 md:p-6 pt-0"
      >
        <Text variant="body" size="md" color="ink" className="leading-relaxed">
          {content}
        </Text>
        
        {lottieOnReveal && isVisible && (
          <motion.div 
            className="mt-4 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, ...SPRING_CONFIGS.bouncy }}
          >
            <LottiePlayer 
              lottieRef={lottieOnReveal} 
              width={80} 
              height={80}
              loop={false}
            />
          </motion.div>
        )}
      </motion.div>
    );
  }

  // Structured content with summary and points
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      className="p-4 md:p-6 pt-0"
    >
      {content.summary && (
        <motion.div variants={fadeInUp} className="mb-4">
          <Text variant="body" size="md" color="ink" className="leading-relaxed">
            {content.summary}
          </Text>
        </motion.div>
      )}
      
      {content.points && content.points.length > 0 && (
        <motion.ul className="space-y-3">
          {content.points.map((point, index) => (
            <motion.li 
              key={index}
              variants={fadeInUp}
              className="flex items-start gap-3"
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-kno-primary/10 text-kno-primary flex items-center justify-center text-sm font-medium mt-0.5">
                {index + 1}
              </span>
              <div className="flex-1">
                <Text variant="body" size="md" color="ink">
                  {point.text}
                </Text>
                {point.tooltip && (
                  <Text variant="body" size="sm" color="ink-muted" className="mt-1 italic">
                    💡 {point.tooltip}
                  </Text>
                )}
              </div>
            </motion.li>
          ))}
        </motion.ul>
      )}

      {lottieOnReveal && isVisible && (
        <motion.div 
          className="mt-6 flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, ...SPRING_CONFIGS.bouncy }}
        >
          <LottiePlayer 
            lottieRef={lottieOnReveal} 
            width={100} 
            height={100}
            loop={false}
          />
        </motion.div>
      )}
    </motion.div>
  );
};

interface DepthIndicatorProps {
  layers: Layer[];
  expandedLayers: Set<string>;
}

const DepthIndicator: React.FC<DepthIndicatorProps> = ({ layers, expandedLayers }) => {
  const expandedCount = expandedLayers.size;
  const totalLayers = layers.length;
  
  // Get depth labels or generate defaults
  const depthLabels = layers.map((layer, i) => 
    layer.depthLabel || `Level ${i + 1}`
  );

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {layers.map((layer, index) => {
        const isExpanded = expandedLayers.has(layer.id);
        const isPast = Array.from(expandedLayers).some(id => {
          const expandedIndex = layers.findIndex(l => l.id === id);
          return expandedIndex > index;
        });
        
        return (
          <React.Fragment key={layer.id}>
            <motion.div
              className={`
                px-3 py-1 rounded-full text-xs font-medium transition-colors
                ${isExpanded 
                  ? 'bg-kno-primary text-white' 
                  : isPast 
                    ? 'bg-kno-primary/20 text-kno-primary'
                    : 'bg-kno-rule text-kno-ink-muted'
                }
              `}
              animate={{ 
                scale: isExpanded ? 1.05 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              {depthLabels[index]}
            </motion.div>
            {index < layers.length - 1 && (
              <div className={`
                w-4 h-0.5 rounded-full
                ${isPast || isExpanded ? 'bg-kno-primary/40' : 'bg-kno-rule'}
              `} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const LayeredDeepDive: React.FC<LayeredDeepDiveProps> = ({ 
  data, 
  className = '',
  id,
}) => {
  const { title, subtitle, layers, initiallyExpanded = 1 } = data;
  const responsive = useResponsive();
  const { ref, isInView } = useScrollReveal({ threshold: 0.1 });

  // Track which layers are expanded
  const [expandedLayers, setExpandedLayers] = useState<Set<string>>(() => {
    // Initialize with first N layers expanded
    const initial = new Set<string>();
    layers.slice(0, initiallyExpanded).forEach(layer => {
      initial.add(layer.id);
    });
    return initial;
  });

  // Track which layers have been viewed (for progress)
  const [viewedLayers, setViewedLayers] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    layers.slice(0, initiallyExpanded).forEach(layer => {
      initial.add(layer.id);
    });
    return initial;
  });

  const toggleLayer = (layerId: string) => {
    setExpandedLayers(prev => {
      const next = new Set(prev);
      if (next.has(layerId)) {
        next.delete(layerId);
      } else {
        next.add(layerId);
        // Mark as viewed when expanded
        setViewedLayers(v => new Set([...v, layerId]));
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedLayers(new Set(layers.map(l => l.id)));
    setViewedLayers(new Set(layers.map(l => l.id)));
  };

  const collapseToFirst = () => {
    const first = layers[0]?.id;
    setExpandedLayers(first ? new Set([first]) : new Set());
  };

  const allExpanded = expandedLayers.size === layers.length;
  const progressPercent = (viewedLayers.size / layers.length) * 100;

  return (
    <motion.div
      ref={ref}
      id={id}
      className={`w-full max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12 ${className}`}
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

        {/* Depth Indicator & Controls */}
        <motion.div 
          className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
        >
          <DepthIndicator layers={layers} expandedLayers={expandedLayers} />
          
          <div className="flex items-center gap-2">
            <button
              onClick={allExpanded ? collapseToFirst : expandAll}
              className="px-3 py-1.5 text-sm font-medium text-kno-primary hover:bg-kno-primary/10 rounded-lg transition-colors"
            >
              {allExpanded ? 'Collapse' : 'Expand All'}
            </button>
          </div>
        </motion.div>
      </header>

      {/* Layers */}
      <Card variant="default" size="sm" className="overflow-hidden p-0">
        {layers.map((layer, index) => {
          const isExpanded = expandedLayers.has(layer.id);
          const isLast = index === layers.length - 1;

          return (
            <div key={layer.id}>
              <LayerHeader
                layer={layer}
                index={index}
                isExpanded={isExpanded}
                isLast={isLast}
                onToggle={() => toggleLayer(layer.id)}
              />
              
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    key={`content-${layer.id}`}
                    initial="collapsed"
                    animate="expanded"
                    exit="collapsed"
                    variants={{
                      collapsed: { 
                        height: 0, 
                        opacity: 0,
                        transition: {
                          height: { duration: 0.3, ease: 'easeInOut' },
                          opacity: { duration: 0.2 }
                        }
                      },
                      expanded: { 
                        height: 'auto', 
                        opacity: 1,
                        transition: {
                          height: { duration: 0.3, ease: 'easeInOut' },
                          opacity: { duration: 0.3, delay: 0.1 }
                        }
                      }
                    }}
                    className="overflow-hidden"
                  >
                    <LayerContentDisplay
                      content={layer.content}
                      lottieOnReveal={layer.lottieOnReveal}
                      isVisible={isExpanded}
                    />
                    
                    {/* "Go Deeper" prompt for non-last layers */}
                    {!isLast && !expandedLayers.has(layers[index + 1]?.id) && (
                      <motion.div 
                        className="px-4 md:px-6 pb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        <button
                          onClick={() => toggleLayer(layers[index + 1].id)}
                          className="flex items-center gap-2 px-4 py-2 bg-kno-primary/10 hover:bg-kno-primary/20 text-kno-primary rounded-lg transition-colors group"
                        >
                          <span className="font-medium">Go Deeper</span>
                          <motion.svg 
                            className="w-4 h-4"
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                            animate={{ y: [0, 3, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </motion.svg>
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Divider between collapsed items */}
              {!isExpanded && !isLast && (
                <div className="border-b border-kno-rule" />
              )}
            </div>
          );
        })}
      </Card>

      {/* Progress Footer */}
      {viewedLayers.size === layers.length && (
        <motion.div
          className="mt-6 p-4 bg-kno-accent-green/10 rounded-lg text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-center gap-2 text-kno-accent-green">
            <span className="text-xl">🎉</span>
            <Text variant="body" size="md" weight="medium" color="accent-green">
              You've explored all depth levels!
            </Text>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default LayeredDeepDive;
