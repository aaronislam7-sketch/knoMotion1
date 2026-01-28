/**
 * Scenario Sandbox Template
 * 
 * Apply concepts to realistic situations and see consequences.
 * Based on situated cognition and experiential learning.
 * 
 * Features:
 * - Situation description with highlighted key phrases
 * - Variable controls (toggle, select, slider)
 * - Dynamic outcome based on variable selections
 * - Consequence breakdown with tone indicators
 * - Key insight callout
 * - Reset/try different choices
 * - Responsive layout
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ScenarioSandboxProps, 
  ScenarioVariable,
  ScenarioOutcome 
} from '../../types';
import { Card, Text, LottiePlayer } from '../../components';
import { 
  fadeInUp, 
  fadeInScale,
  staggerContainer, 
  SPRING_CONFIGS,
} from '../../animations';
import { useResponsive, useScrollReveal } from '../../hooks';

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

interface SituationDisplayProps {
  description: string;
  context?: string;
  highlights?: string[];
}

const SituationDisplay: React.FC<SituationDisplayProps> = ({
  description,
  context,
  highlights = [],
}) => {
  // Highlight key phrases in the description
  const highlightedDescription = useMemo(() => {
    if (highlights.length === 0) return description;
    
    let result = description;
    highlights.forEach(phrase => {
      const regex = new RegExp(`(${phrase})`, 'gi');
      result = result.replace(regex, '|||$1|||');
    });
    
    return result.split('|||').map((part, i) => {
      const isHighlighted = highlights.some(h => 
        h.toLowerCase() === part.toLowerCase()
      );
      return isHighlighted ? (
        <mark 
          key={i} 
          className="bg-kno-highlight/30 text-kno-ink px-1 rounded"
        >
          {part}
        </mark>
      ) : (
        <span key={i}>{part}</span>
      );
    });
  }, [description, highlights]);

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <span className="text-2xl">📋</span>
        <div>
          <Text variant="body" size="sm" weight="semibold" color="primary" className="mb-1">
            The Situation
          </Text>
          <Text variant="body" size="md" color="ink" className="leading-relaxed">
            {highlightedDescription}
          </Text>
        </div>
      </div>
      
      {context && (
        <div className="pl-9">
          <Text variant="body" size="sm" color="ink-soft" className="italic">
            {context}
          </Text>
        </div>
      )}
    </div>
  );
};

interface VariableControlProps {
  variable: ScenarioVariable;
  value: string;
  onChange: (value: string) => void;
}

const VariableControl: React.FC<VariableControlProps> = ({
  variable,
  value,
  onChange,
}) => {
  if (variable.type === 'toggle') {
    return (
      <div className="space-y-2">
        <Text variant="body" size="sm" weight="semibold" color="ink">
          {variable.label}
        </Text>
        {variable.description && (
          <Text variant="body" size="xs" color="ink-muted">
            {variable.description}
          </Text>
        )}
        <div className="flex gap-2">
          {variable.options.map(option => (
            <motion.button
              key={option.value}
              onClick={() => onChange(option.value)}
              className={`
                flex-1 px-4 py-3 rounded-lg font-medium text-sm transition-colors
                ${value === option.value
                  ? 'bg-kno-primary text-white shadow-md'
                  : 'bg-kno-surface text-kno-ink hover:bg-kno-rule'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {option.label}
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  if (variable.type === 'select') {
    return (
      <div className="space-y-2">
        <Text variant="body" size="sm" weight="semibold" color="ink">
          {variable.label}
        </Text>
        {variable.description && (
          <Text variant="body" size="xs" color="ink-muted">
            {variable.description}
          </Text>
        )}
        <div className="space-y-2">
          {variable.options.map(option => (
            <motion.button
              key={option.value}
              onClick={() => onChange(option.value)}
              className={`
                w-full px-4 py-3 rounded-lg text-left transition-colors
                ${value === option.value
                  ? 'bg-kno-primary text-white shadow-md'
                  : 'bg-kno-surface text-kno-ink hover:bg-kno-rule'
                }
              `}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center gap-3">
                <div className={`
                  w-5 h-5 rounded-full border-2 flex items-center justify-center
                  ${value === option.value 
                    ? 'border-white bg-white' 
                    : 'border-kno-ink-muted'
                  }
                `}>
                  {value === option.value && (
                    <div className="w-2.5 h-2.5 rounded-full bg-kno-primary" />
                  )}
                </div>
                <span className="font-medium text-sm">{option.label}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  // Slider type
  if (variable.type === 'slider') {
    const options = variable.options;
    const currentIndex = options.findIndex(o => o.value === value);
    
    return (
      <div className="space-y-2">
        <Text variant="body" size="sm" weight="semibold" color="ink">
          {variable.label}
        </Text>
        {variable.description && (
          <Text variant="body" size="xs" color="ink-muted">
            {variable.description}
          </Text>
        )}
        <div className="pt-2">
          <input
            type="range"
            min={0}
            max={options.length - 1}
            value={currentIndex >= 0 ? currentIndex : 0}
            onChange={(e) => onChange(options[parseInt(e.target.value)].value)}
            className="w-full h-2 bg-kno-rule rounded-lg appearance-none cursor-pointer accent-kno-primary"
          />
          <div className="flex justify-between mt-2">
            {options.map((option, i) => (
              <span 
                key={option.value}
                className={`text-xs ${currentIndex === i ? 'text-kno-primary font-semibold' : 'text-kno-ink-muted'}`}
              >
                {option.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

interface OutcomeDisplayProps {
  outcome: ScenarioOutcome['result'];
  onReset: () => void;
  onExploreWhy?: () => void;
}

const OutcomeDisplay: React.FC<OutcomeDisplayProps> = ({
  outcome,
  onReset,
  onExploreWhy,
}) => {
  const toneConfig = {
    positive: {
      bg: 'bg-kno-accent-green/10',
      border: 'border-kno-accent-green',
      icon: '✅',
      color: 'text-kno-accent-green',
    },
    negative: {
      bg: 'bg-red-50',
      border: 'border-red-400',
      icon: '⚠️',
      color: 'text-red-600',
    },
    warning: {
      bg: 'bg-kno-highlight/10',
      border: 'border-kno-highlight',
      icon: '⚡',
      color: 'text-kno-highlight',
    },
    neutral: {
      bg: 'bg-kno-surface',
      border: 'border-kno-rule',
      icon: '💭',
      color: 'text-kno-ink-soft',
    },
  };

  const config = toneConfig[outcome.tone || 'neutral'];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {/* Outcome Header */}
      <motion.div 
        variants={fadeInUp}
        className={`p-4 rounded-lg border-l-4 ${config.bg} ${config.border}`}
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl">{config.icon}</span>
          <div>
            <Text variant="title" size="lg" weight="bold" color="ink">
              {outcome.title}
            </Text>
            <Text variant="body" size="md" color="ink" className="mt-1">
              {outcome.description}
            </Text>
          </div>
        </div>
      </motion.div>

      {/* Consequences */}
      {outcome.consequences && outcome.consequences.length > 0 && (
        <motion.div variants={fadeInUp} className="space-y-2">
          <Text variant="body" size="sm" weight="semibold" color="ink-soft">
            Consequences
          </Text>
          <ul className="space-y-2">
            {outcome.consequences.map((consequence, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="flex items-start gap-2"
              >
                <span className={`mt-1 ${config.color}`}>•</span>
                <Text variant="body" size="sm" color="ink">
                  {consequence}
                </Text>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Key Insight */}
      {outcome.insight && (
        <motion.div 
          variants={fadeInUp}
          className="p-4 bg-kno-secondary/10 rounded-lg border-l-4 border-kno-secondary"
        >
          <div className="flex items-start gap-2">
            <span className="text-lg">💡</span>
            <div>
              <Text variant="body" size="xs" weight="semibold" color="secondary" className="mb-1">
                Key Insight
              </Text>
              <Text variant="body" size="sm" color="ink">
                {outcome.insight}
              </Text>
            </div>
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <motion.div variants={fadeInUp} className="flex gap-3 pt-2">
        <button
          onClick={onReset}
          className="px-4 py-2 bg-kno-surface hover:bg-kno-rule text-kno-ink font-medium text-sm rounded-lg transition-colors"
        >
          Try Different Choices
        </button>
      </motion.div>
    </motion.div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const ScenarioSandbox: React.FC<ScenarioSandboxProps> = ({ 
  data, 
  className = '',
  id,
}) => {
  const { 
    title, 
    situation, 
    variables, 
    outcomes,
    defaultOutcome 
  } = data;
  
  const responsive = useResponsive();
  const { ref, isInView } = useScrollReveal({ threshold: 0.1 });

  // Initialize variable values with defaults
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    variables.forEach(v => {
      initial[v.id] = v.default || v.options[0]?.value || '';
    });
    return initial;
  });

  const [showOutcome, setShowOutcome] = useState(false);

  // Find matching outcome
  const matchedOutcome = useMemo(() => {
    if (!showOutcome) return null;

    // Find exact match
    const exactMatch = outcomes.find(outcome => {
      return Object.entries(outcome.condition).every(
        ([key, value]) => values[key] === value
      );
    });

    if (exactMatch) return exactMatch.result;

    // Find partial match (most conditions met)
    let bestMatch: ScenarioOutcome | null = null;
    let bestMatchCount = 0;

    outcomes.forEach(outcome => {
      const matchCount = Object.entries(outcome.condition).filter(
        ([key, value]) => values[key] === value
      ).length;
      
      if (matchCount > bestMatchCount) {
        bestMatchCount = matchCount;
        bestMatch = outcome;
      }
    });

    if (bestMatch && bestMatchCount > 0) {
      return bestMatch.result;
    }

    return defaultOutcome || null;
  }, [showOutcome, values, outcomes, defaultOutcome]);

  const handleValueChange = (variableId: string, value: string) => {
    setValues(prev => ({ ...prev, [variableId]: value }));
    setShowOutcome(false); // Reset outcome when values change
  };

  const handleSeeOutcome = () => {
    setShowOutcome(true);
  };

  const handleReset = () => {
    // Reset to defaults
    const initial: Record<string, string> = {};
    variables.forEach(v => {
      initial[v.id] = v.default || v.options[0]?.value || '';
    });
    setValues(initial);
    setShowOutcome(false);
  };

  const allVariablesSet = variables.every(v => values[v.id]);

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
        </motion.div>
      </header>

      {/* Main Content */}
      <div className={`grid gap-6 ${responsive.isMobile ? '' : 'lg:grid-cols-2'}`}>
        {/* Left: Situation + Variables */}
        <div className="space-y-6">
          {/* Situation */}
          <Card variant="default">
            <SituationDisplay
              description={situation.description}
              context={situation.context}
              highlights={situation.highlights}
            />
          </Card>

          {/* Variables */}
          <Card variant="bordered" className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🎛️</span>
              <Text variant="title" size="md" weight="semibold" color="ink">
                Your Choices
              </Text>
            </div>

            {variables.map((variable, i) => (
              <motion.div
                key={variable.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <VariableControl
                  variable={variable}
                  value={values[variable.id]}
                  onChange={(value) => handleValueChange(variable.id, value)}
                />
              </motion.div>
            ))}

            {/* See Outcome Button */}
            {!showOutcome && (
              <motion.button
                onClick={handleSeeOutcome}
                disabled={!allVariablesSet}
                className={`
                  w-full py-3 rounded-lg font-semibold text-white transition-all
                  ${allVariablesSet
                    ? 'bg-kno-primary hover:bg-kno-primary/90 shadow-lg hover:shadow-xl'
                    : 'bg-kno-ink-muted cursor-not-allowed'
                  }
                `}
                whileHover={allVariablesSet ? { scale: 1.02 } : {}}
                whileTap={allVariablesSet ? { scale: 0.98 } : {}}
              >
                <span className="flex items-center justify-center gap-2">
                  See Outcome
                  <motion.svg 
                    className="w-5 h-5"
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </motion.svg>
                </span>
              </motion.button>
            )}
          </Card>
        </div>

        {/* Right: Outcome */}
        <div>
          <AnimatePresence mode="wait">
            {showOutcome && matchedOutcome ? (
              <motion.div
                key="outcome"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={SPRING_CONFIGS.smooth}
              >
                <Card variant="default">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl">📊</span>
                    <Text variant="title" size="md" weight="semibold" color="ink">
                      Outcome
                    </Text>
                  </div>
                  <OutcomeDisplay
                    outcome={matchedOutcome}
                    onReset={handleReset}
                  />
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="prompt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-kno-surface rounded-card p-8 text-center h-full flex flex-col items-center justify-center min-h-[300px]"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <LottiePlayer 
                    lottieRef="thinking" 
                    width={100} 
                    height={100}
                    loop
                  />
                </motion.div>
                <Text variant="body" size="md" color="ink-soft" className="mt-4">
                  Make your choices and click "See Outcome" to discover what happens.
                </Text>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile: Outcome below */}
      {responsive.isMobile && showOutcome && matchedOutcome && (
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card variant="default">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">📊</span>
              <Text variant="title" size="md" weight="semibold" color="ink">
                Outcome
              </Text>
            </div>
            <OutcomeDisplay
              outcome={matchedOutcome}
              onReset={handleReset}
            />
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ScenarioSandbox;
