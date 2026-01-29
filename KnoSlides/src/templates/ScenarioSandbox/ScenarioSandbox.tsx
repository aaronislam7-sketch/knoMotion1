/**
 * Scenario Sandbox Template
 * 
 * Learn by making decisions and seeing consequences.
 * Single-column, decision-focused interface.
 * Notion + Brilliant.org inspired aesthetic.
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScenarioSandboxProps, ScenarioOutcome, DecisionOption } from '../../types';
import { SPRING_CONFIGS } from '../../animations';

// =============================================================================
// DECISION CARD
// =============================================================================

interface DecisionCardProps {
  option: DecisionOption;
  index: number;
  isSelected: boolean;
  hasOutcome: boolean;
  onSelect: () => void;
}

const DecisionCard: React.FC<DecisionCardProps> = ({
  option,
  index,
  isSelected,
  hasOutcome,
  onSelect,
}) => {
  const letters = ['A', 'B', 'C', 'D', 'E'];

  return (
    <motion.button
      onClick={onSelect}
      disabled={hasOutcome}
      className={`
        w-full p-6 rounded-xl border-2 text-left transition-all
        ${isSelected 
          ? 'border-indigo-500 bg-indigo-50'
          : hasOutcome
            ? 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed'
            : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50'
        }
      `}
      whileHover={!hasOutcome ? { scale: 1.01 } : undefined}
      whileTap={!hasOutcome ? { scale: 0.99 } : undefined}
    >
      <div className="flex items-start gap-4">
        {/* Option Letter */}
        <div className={`
          w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-semibold
          ${isSelected 
            ? 'bg-indigo-500 text-white' 
            : 'bg-gray-100 text-gray-500'
          }
        `}>
          {letters[index]}
        </div>

        {/* Option Content */}
        <div className="flex-1">
          <h4 className={`text-lg font-semibold mb-1 ${isSelected ? 'text-indigo-700' : 'text-gray-900'}`}>
            {option.label}
          </h4>
          {option.description && (
            <p className="text-gray-600 text-sm leading-relaxed">
              {option.description}
            </p>
          )}
        </div>

        {/* Selection indicator */}
        {isSelected && (
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
        )}
      </div>
    </motion.button>
  );
};

// =============================================================================
// OUTCOME DISPLAY
// =============================================================================

interface OutcomeDisplayProps {
  outcome: ScenarioOutcome;
  onReset: () => void;
}

const OutcomeDisplay: React.FC<OutcomeDisplayProps> = ({ outcome, onReset }) => {
  const impactColors = {
    positive: 'bg-emerald-50 border-emerald-200',
    negative: 'bg-red-50 border-red-200',
    neutral: 'bg-gray-50 border-gray-200',
  };

  const impactTextColors = {
    positive: 'text-emerald-700',
    negative: 'text-red-700',
    neutral: 'text-gray-700',
  };

  const impactLabels = {
    positive: 'Positive Outcome',
    negative: 'Challenging Outcome',
    neutral: 'Neutral Outcome',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`rounded-xl border-2 p-8 ${impactColors[outcome.impact]}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className={`text-sm font-semibold uppercase tracking-wide ${impactTextColors[outcome.impact]}`}>
          {impactLabels[outcome.impact]}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-gray-900 mb-4">
        {outcome.title}
      </h3>

      {/* Description */}
      <p className="text-gray-700 leading-relaxed mb-6">
        {outcome.description}
      </p>

      {/* Learnings */}
      {outcome.learnings && outcome.learnings.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Key Takeaways
          </h4>
          <ul className="space-y-2">
            {outcome.learnings.map((learning, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-3"
              >
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-gray-400 mt-2" />
                <span className="text-gray-700">{learning}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      )}

      {/* Reset Button */}
      <button
        onClick={onReset}
        className="w-full py-3 px-4 bg-white border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
      >
        Try a different approach
      </button>
    </motion.div>
  );
};

// =============================================================================
// PROGRESS TRACKER
// =============================================================================

interface ProgressTrackerProps {
  outcomes: ScenarioOutcome[];
  selectedOptions: string[];
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ outcomes, selectedOptions }) => {
  const totalDecisions = outcomes.length;
  const madeDecisions = selectedOptions.filter(Boolean).length;

  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1">
        {outcomes.map((_, i) => (
          <div
            key={i}
            className={`w-8 h-1.5 rounded-full transition-colors ${
              i < madeDecisions ? 'bg-indigo-500' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <span className="text-sm text-gray-500">
        {madeDecisions} of {totalDecisions} decisions made
      </span>
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const ScenarioSandbox: React.FC<ScenarioSandboxProps> = ({ 
  data, 
  className = '',
}) => {
  const { title, subtitle, context, decisions, outcomes } = data;

  const [selectedOptions, setSelectedOptions] = useState<string[]>(() => 
    decisions.map(() => '')
  );
  const [currentDecisionIndex, setCurrentDecisionIndex] = useState(0);

  // Find outcome for current decision
  const getCurrentOutcome = useMemo(() => {
    const selectedId = selectedOptions[currentDecisionIndex];
    if (!selectedId) return null;
    return outcomes.find(o => o.triggeredBy === selectedId);
  }, [selectedOptions, currentDecisionIndex, outcomes]);

  const handleSelect = (optionId: string) => {
    const newSelections = [...selectedOptions];
    newSelections[currentDecisionIndex] = optionId;
    setSelectedOptions(newSelections);
  };

  const handleReset = () => {
    const newSelections = [...selectedOptions];
    newSelections[currentDecisionIndex] = '';
    setSelectedOptions(newSelections);
  };

  const handleNextDecision = () => {
    if (currentDecisionIndex < decisions.length - 1) {
      setCurrentDecisionIndex(currentDecisionIndex + 1);
    }
  };

  const currentDecision = decisions[currentDecisionIndex];
  const hasOutcome = Boolean(getCurrentOutcome);
  const isLastDecision = currentDecisionIndex === decisions.length - 1;
  const allDecisionsMade = selectedOptions.every(s => s !== '');

  return (
    <div className={`w-full max-w-3xl mx-auto ${className}`}>
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">{title}</h1>
        {subtitle && (
          <p className="text-xl text-gray-500 mb-6">{subtitle}</p>
        )}
        {decisions.length > 1 && (
          <ProgressTracker outcomes={outcomes} selectedOptions={selectedOptions} />
        )}
      </header>

      {/* Context */}
      {context && (
        <div className="mb-10 p-6 bg-slate-50 rounded-xl border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Scenario Context
          </h3>
          <p className="text-gray-700 leading-relaxed">{context}</p>
        </div>
      )}

      {/* Decision Navigation (if multiple) */}
      {decisions.length > 1 && (
        <div className="flex gap-2 mb-6">
          {decisions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentDecisionIndex(i)}
              disabled={i > 0 && !selectedOptions[i - 1]}
              className={`
                w-10 h-10 rounded-lg font-medium transition-all
                ${i === currentDecisionIndex 
                  ? 'bg-indigo-500 text-white' 
                  : selectedOptions[i]
                    ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                    : i > 0 && !selectedOptions[i - 1]
                      ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }
              `}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Current Decision */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentDecisionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentDecision.prompt}
            </h2>
            {currentDecision.context && (
              <p className="text-gray-500">{currentDecision.context}</p>
            )}
          </div>

          {/* Options */}
          {!getCurrentOutcome && (
            <div className="space-y-4 mb-8">
              {currentDecision.options.map((option, i) => (
                <DecisionCard
                  key={option.id}
                  option={option}
                  index={i}
                  isSelected={selectedOptions[currentDecisionIndex] === option.id}
                  hasOutcome={hasOutcome}
                  onSelect={() => handleSelect(option.id)}
                />
              ))}
            </div>
          )}

          {/* Outcome */}
          <AnimatePresence mode="wait">
            {getCurrentOutcome && (
              <OutcomeDisplay 
                outcome={getCurrentOutcome} 
                onReset={handleReset}
              />
            )}
          </AnimatePresence>

          {/* Continue Button */}
          {getCurrentOutcome && !isLastDecision && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={handleNextDecision}
              className="mt-6 w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
            >
              Continue to next decision
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Final Completion */}
      {allDecisionsMade && isLastDecision && getCurrentOutcome && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-10 p-6 bg-indigo-50 border border-indigo-200 rounded-xl text-center"
        >
          <h3 className="text-lg font-semibold text-indigo-900 mb-2">
            Scenario Complete
          </h3>
          <p className="text-indigo-700">
            You've worked through all the decisions. Reflect on how different choices lead to different outcomes.
          </p>
          <button
            onClick={() => {
              setSelectedOptions(decisions.map(() => ''));
              setCurrentDecisionIndex(0);
            }}
            className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
          >
            Start Over
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default ScenarioSandbox;
