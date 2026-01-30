/**
 * RepairTheModelSlide Template
 * 
 * ============================================================================
 * QUALITY GATE CHECKLIST
 * ============================================================================
 * 
 * 1. AESTHETIC
 *    ✓ Clean code editor with syntax highlighting
 *    ✓ Clear before/after comparison
 *    ✓ Error highlighting is visible but not overwhelming
 * 
 * 2. PROGRESSION
 *    ✓ Explain the context and intended behavior first
 *    ✓ Guide learner to identify issues
 *    ✓ Support fixing with hints and feedback
 *    ✓ Show the impact of the fix
 * 
 * 3. DEPTH
 *    ✓ Real code with realistic bugs
 *    ✓ Explains WHY the bug matters
 *    ✓ Shows real-world consequences
 * 
 * 4. INTERACTIVITY
 *    ✓ Learner identifies and/or fixes bugs
 *    ✓ Live output preview shows consequences
 *    ✓ Before/after comparison reinforces learning
 * 
 * 5. COGNITIVE SAFETY
 *    ✓ No punishment for incorrect identification
 *    ✓ Hints guide toward discovery
 *    ✓ Explanation provided for all errors
 * 
 * 6. PURPOSE CLARITY
 *    ✓ learningObjective declares what understanding it builds
 *    ✓ enablesNext declares what capability it enables
 * 
 * ============================================================================
 * USE WHEN: Teaching debugging, judgement, or common mistakes.
 * ============================================================================
 */

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import {
  RepairTheModelProps,
  RepairTheModelData,
  ArtifactError,
  Feedback,
} from '../../types/templates';
import { useSlideState } from '../../hooks/useSlideState';
import {
  StepProgress,
  HintLadder,
  ExplanationPanel,
  FeedbackIndicator,
  StepNavigation,
} from '../../components/slide';

// =============================================================================
// ERROR MARKER COMPONENT
// =============================================================================

interface ErrorMarkerProps {
  error: ArtifactError;
  isSelected: boolean;
  isFixed: boolean;
  onClick: () => void;
}

const ErrorMarker: React.FC<ErrorMarkerProps> = ({ error, isSelected, isFixed, onClick }) => {
  const severityColors = {
    critical: 'bg-red-100 border-red-400 text-red-700',
    error: 'bg-red-50 border-red-300 text-red-600',
    warning: 'bg-amber-50 border-amber-300 text-amber-700',
    info: 'bg-blue-50 border-blue-300 text-blue-600',
  };

  const categoryIcons = {
    syntax: '🔤',
    logic: '🧠',
    semantic: '📖',
    performance: '⚡',
    security: '🔒',
    'best-practice': '✨',
  };

  return (
    <motion.button
      onClick={onClick}
      className={`
        w-full text-left p-3 rounded-lg border-2 transition-all duration-200
        ${isFixed 
          ? 'bg-emerald-50 border-emerald-300 opacity-60' 
          : isSelected 
            ? 'ring-2 ring-indigo-400 ' + severityColors[error.severity]
            : severityColors[error.severity]
        }
      `}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      disabled={isFixed}
    >
      <div className="flex items-start gap-2">
        <span className="text-lg">{categoryIcons[error.category]}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium">
              Line {error.lineStart}{error.lineEnd && error.lineEnd !== error.lineStart ? `-${error.lineEnd}` : ''}
            </span>
            {isFixed && (
              <span className="text-xs bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full">
                Fixed
              </span>
            )}
          </div>
          <p className="text-sm mt-1 opacity-80">{error.description}</p>
        </div>
      </div>
    </motion.button>
  );
};

// =============================================================================
// OUTPUT PREVIEW COMPONENT
// =============================================================================

interface OutputPreviewProps {
  buggyOutput: string;
  correctOutput: string;
  showCorrect: boolean;
  type: 'text' | 'table' | 'error' | 'json';
  className?: string;
}

const OutputPreview: React.FC<OutputPreviewProps> = ({
  buggyOutput,
  correctOutput,
  showCorrect,
  type,
  className = '',
}) => {
  return (
    <div className={`rounded-xl border border-slate-200 overflow-hidden ${className}`}>
      <div className="flex border-b border-slate-200">
        <div className={`flex-1 px-4 py-2 text-sm font-medium ${!showCorrect ? 'bg-slate-100' : 'bg-white'}`}>
          <span className={!showCorrect ? 'text-slate-800' : 'text-slate-400'}>
            {type === 'error' ? '❌ Current Output' : '📤 Current Output'}
          </span>
        </div>
        <div className={`flex-1 px-4 py-2 text-sm font-medium border-l border-slate-200 ${showCorrect ? 'bg-emerald-50' : 'bg-white'}`}>
          <span className={showCorrect ? 'text-emerald-800' : 'text-slate-400'}>
            ✓ Expected Output
          </span>
        </div>
      </div>
      <div className="flex">
        <div className={`flex-1 p-4 font-mono text-sm ${!showCorrect ? 'bg-slate-50' : 'bg-white opacity-50'}`}>
          <pre className={`whitespace-pre-wrap ${type === 'error' ? 'text-red-600' : 'text-slate-700'}`}>
            {buggyOutput}
          </pre>
        </div>
        <div className={`flex-1 p-4 font-mono text-sm border-l border-slate-200 ${showCorrect ? 'bg-emerald-50' : 'bg-white opacity-50'}`}>
          <pre className="whitespace-pre-wrap text-emerald-700">
            {correctOutput}
          </pre>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// CODE COMPARISON COMPONENT
// =============================================================================

interface CodeComparisonProps {
  buggyCode: string;
  correctCode: string;
  language: string;
  errors: ArtifactError[];
  fixedErrors: string[];
  showComparison: boolean;
}

const CodeComparison: React.FC<CodeComparisonProps> = ({
  buggyCode,
  correctCode,
  language,
  errors,
  fixedErrors,
  showComparison,
}) => {
  // Highlight error lines
  const errorLines = useMemo(() => {
    const lines = new Set<number>();
    errors.forEach(err => {
      if (!fixedErrors.includes(err.id)) {
        for (let i = err.lineStart; i <= (err.lineEnd || err.lineStart); i++) {
          lines.add(i);
        }
      }
    });
    return lines;
  }, [errors, fixedErrors]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Buggy code */}
      <div className="rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">
            {showComparison ? 'Before (with bugs)' : 'Current Code'}
          </span>
          {errorLines.size > 0 && (
            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
              {errorLines.size} issue{errorLines.size !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <Editor
          height="300px"
          language={language}
          value={buggyCode}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            renderLineHighlight: 'none',
            glyphMargin: true,
          }}
          theme="vs-dark"
        />
      </div>

      {/* Correct code */}
      {showComparison && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-xl border border-emerald-200 overflow-hidden"
        >
          <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-200 flex items-center justify-between">
            <span className="text-sm font-medium text-emerald-700">
              After (fixed)
            </span>
            <span className="text-xs bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full">
              ✓ All issues resolved
            </span>
          </div>
          <Editor
            height="300px"
            language={language}
            value={correctCode}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              renderLineHighlight: 'none',
            }}
            theme="vs-dark"
          />
        </motion.div>
      )}
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const RepairTheModelSlide: React.FC<RepairTheModelProps> = ({
  data,
  onComplete,
  onStepChange,
  className = '',
}) => {
  const {
    state,
    currentStep,
    currentHintLevel,
    canProceed,
    requestHint,
    submitAction,
    nextStep,
    previousStep,
    clearFeedback,
    reset,
    completeStep,
  } = useSlideState({
    steps: data.steps,
    onComplete,
    onStepChange,
  });

  // Error identification/fixing state
  const [selectedErrorId, setSelectedErrorId] = useState<string | null>(null);
  const [identifiedErrors, setIdentifiedErrors] = useState<string[]>([]);
  const [fixedErrors, setFixedErrors] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  // Get current step's relevant errors
  const relevantErrors = useMemo(() => {
    if (!currentStep?.relevantErrors) return data.errors;
    return data.errors.filter(e => currentStep.relevantErrors!.includes(e.id));
  }, [currentStep, data.errors]);

  // Handle error selection (for identification mode)
  const handleErrorSelect = useCallback((errorId: string) => {
    const error = data.errors.find(e => e.id === errorId);
    if (!error || fixedErrors.includes(errorId)) return;

    setSelectedErrorId(errorId);

    // Check if this is a correct identification
    const expectedIds = currentStep?.expectedIdentifications || [];
    
    if (expectedIds.length === 0 || expectedIds.includes(errorId)) {
      // Correct identification
      if (!identifiedErrors.includes(errorId)) {
        setIdentifiedErrors(prev => [...prev, errorId]);
      }

      submitAction(currentStep!.id, {
        isCorrect: true,
        feedback: {
          type: 'success',
          title: 'Good eye!',
          message: error.description,
          explanation: error.explanation,
        },
      });

      // Check if all expected errors identified
      const newIdentified = [...identifiedErrors, errorId];
      if (expectedIds.every(id => newIdentified.includes(id))) {
        completeStep(currentStep!.id);
      }
    } else {
      // Not the expected error
      submitAction(currentStep!.id, {
        isCorrect: false,
        feedback: {
          type: 'partial',
          title: 'Not quite',
          message: 'This might be an issue, but there\'s a more important problem to focus on first.',
          suggestion: 'Look at the output - what\'s different from what you\'d expect?',
        },
      });
    }
  }, [data.errors, currentStep, identifiedErrors, fixedErrors, submitAction, completeStep]);

  // Handle error fix
  const handleFixError = useCallback((errorId: string) => {
    const error = data.errors.find(e => e.id === errorId);
    if (!error || fixedErrors.includes(errorId)) return;

    setFixedErrors(prev => [...prev, errorId]);
    setSelectedErrorId(null);

    submitAction(currentStep!.id, {
      isCorrect: true,
      feedback: {
        type: 'success',
        title: 'Fixed!',
        message: `You've corrected the ${error.category} issue.`,
        explanation: `The fix: ${error.correctFix}`,
      },
    });

    // Check if all errors fixed
    const newFixed = [...fixedErrors, errorId];
    if (data.errors.every(e => newFixed.includes(e.id))) {
      setShowComparison(true);
      completeStep(currentStep!.id);
    }
  }, [data.errors, currentStep, fixedErrors, submitAction, completeStep]);

  // Auto-show comparison in outcome phase
  const shouldShowComparison = currentStep?.showComparison || state.currentPhase === 'outcome' || showComparison;

  // Auto-complete explanation steps
  React.useEffect(() => {
    if (currentStep && !currentStep.requiresAction && !state.completedSteps.includes(currentStep.id)) {
      const timer = setTimeout(() => {
        completeStep(currentStep.id);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, state.completedSteps, completeStep]);

  const selectedError = selectedErrorId ? data.errors.find(e => e.id === selectedErrorId) : null;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-white ${className}`}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">{data.title}</h1>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {data.learningObjective}
            </span>
          </div>
        </div>

        {/* Progress */}
        <StepProgress
          steps={data.steps}
          currentStepIndex={state.currentStepIndex}
          completedSteps={state.completedSteps}
          className="mb-6"
        />

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Code & Explanation */}
          <div className="lg:col-span-2 space-y-6">
            {/* Context */}
            <ExplanationPanel
              title={data.artifactContext.title}
              content={data.artifactContext.description}
              keyConcepts={[
                `Intended: ${data.artifactContext.intendedBehavior}`,
                `Actual: ${data.artifactContext.actualBehavior}`,
              ]}
              collapsible={true}
              defaultCollapsed={state.currentPhase !== 'explain'}
            />

            {/* Current step instruction */}
            {currentStep && (
              <motion.div
                key={currentStep.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-slate-200 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">
                      {currentStep.title}
                    </h3>
                    <p className="text-slate-600">{currentStep.instruction}</p>
                  </div>
                  <HintLadder
                    hints={currentStep.hints}
                    currentLevel={currentHintLevel}
                    onRequestHint={requestHint}
                  />
                </div>
              </motion.div>
            )}

            {/* Code editor/comparison */}
            <CodeComparison
              buggyCode={data.artifact.buggyContent}
              correctCode={data.artifact.correctContent}
              language={data.artifact.language || 'python'}
              errors={data.errors}
              fixedErrors={fixedErrors}
              showComparison={shouldShowComparison}
            />

            {/* Output preview */}
            {data.outputPreview && (
              <OutputPreview
                buggyOutput={data.outputPreview.buggyOutput}
                correctOutput={data.outputPreview.correctOutput}
                showCorrect={shouldShowComparison || fixedErrors.length === data.errors.length}
                type={data.outputPreview.type}
              />
            )}

            {/* Feedback */}
            <FeedbackIndicator
              feedback={state.feedback}
              onDismiss={clearFeedback}
            />
          </div>

          {/* Right column - Error list & details */}
          <div className="space-y-6">
            {/* Error list */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Issues to Find
                  <span className="ml-auto text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                    {fixedErrors.length}/{data.errors.length}
                  </span>
                </h4>
              </div>
              <div className="p-4 space-y-3">
                {relevantErrors.map(error => (
                  <ErrorMarker
                    key={error.id}
                    error={error}
                    isSelected={selectedErrorId === error.id}
                    isFixed={fixedErrors.includes(error.id)}
                    onClick={() => handleErrorSelect(error.id)}
                  />
                ))}
              </div>
            </div>

            {/* Selected error details */}
            <AnimatePresence mode="wait">
              {selectedError && !fixedErrors.includes(selectedError.id) && (
                <motion.div
                  key={selectedError.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden"
                >
                  <div className="px-4 py-3 bg-indigo-50 border-b border-indigo-100">
                    <h4 className="text-sm font-semibold text-indigo-800">
                      Understanding the Issue
                    </h4>
                  </div>
                  <div className="p-4 space-y-4">
                    <div>
                      <p className="text-sm text-slate-600">{selectedError.explanation}</p>
                    </div>

                    {currentStep?.mode !== 'identify' && (
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">The Fix:</p>
                        <code className="block p-3 bg-emerald-50 rounded-lg text-sm text-emerald-800 font-mono">
                          {selectedError.correctFix}
                        </code>
                      </div>
                    )}

                    <button
                      onClick={() => handleFixError(selectedError.id)}
                      className="w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Apply Fix
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Real-world impact */}
            {data.realWorldImpact && shouldShowComparison && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-amber-50 rounded-xl border border-amber-200 p-4"
              >
                <h4 className="text-sm font-semibold text-amber-800 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Why This Matters
                </h4>
                <p className="text-sm text-amber-700">{data.realWorldImpact}</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <StepNavigation
            currentStepIndex={state.currentStepIndex}
            totalSteps={data.steps.length}
            canProceed={canProceed}
            requiresAction={currentStep?.requiresAction || false}
            isComplete={state.isComplete}
            onNext={nextStep}
            onPrevious={previousStep}
            onReset={reset}
          />
        </div>

        {/* Completion */}
        {state.isComplete && data.completionMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-emerald-800 mb-1">
                  Debugging Skills Sharpened!
                </h3>
                <p className="text-emerald-700">{data.completionMessage}</p>
                <p className="mt-2 text-sm text-emerald-600">
                  <strong>What's next:</strong> {data.enablesNext}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RepairTheModelSlide;
