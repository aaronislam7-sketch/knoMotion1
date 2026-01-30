/**
 * FlowSimulatorSlide Template
 * 
 * ============================================================================
 * QUALITY GATE CHECKLIST
 * ============================================================================
 * 
 * 1. AESTHETIC
 *    ✓ Clean node-based flow diagram with clear visual hierarchy
 *    ✓ State transitions animated meaningfully
 *    ✓ Color-coded node states (active, completed, error)
 * 
 * 2. PROGRESSION
 *    ✓ Step-based progression through the flow (not scroll-based)
 *    ✓ Each step builds understanding of the system
 *    ✓ Clear cause → effect at each transition
 * 
 * 3. DEPTH
 *    ✓ Supports branching and counterfactual paths
 *    ✓ Real system complexity (401 vs 200, retry logic)
 *    ✓ Layered reveal of system behavior
 * 
 * 4. INTERACTIVITY
 *    ✓ Learner can inject/remove conditions
 *    ✓ Flow responds to condition changes
 *    ✓ State visualization updates in real-time
 * 
 * 5. COGNITIVE SAFETY
 *    ✓ Can explore "what if" scenarios without penalty
 *    ✓ Errors explained, not punished
 *    ✓ Hints always available
 * 
 * 6. PURPOSE CLARITY
 *    ✓ learningObjective declares what understanding it builds
 *    ✓ enablesNext declares what capability it enables
 * 
 * ============================================================================
 * USE WHEN: Teaching systems, processes, lifecycles, or causality.
 * ============================================================================
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactFlow, {
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
import {
  FlowSimulatorProps,
  FlowSimulatorData,
  FlowNode,
  FlowEdge,
  FlowCondition,
  SystemState,
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
// CUSTOM NODE COMPONENTS
// =============================================================================

const nodeColors = {
  start: { bg: 'bg-emerald-100', border: 'border-emerald-400', text: 'text-emerald-800' },
  process: { bg: 'bg-blue-100', border: 'border-blue-400', text: 'text-blue-800' },
  decision: { bg: 'bg-amber-100', border: 'border-amber-400', text: 'text-amber-800' },
  end: { bg: 'bg-slate-100', border: 'border-slate-400', text: 'text-slate-800' },
  state: { bg: 'bg-purple-100', border: 'border-purple-400', text: 'text-purple-800' },
  error: { bg: 'bg-red-100', border: 'border-red-400', text: 'text-red-800' },
  success: { bg: 'bg-emerald-100', border: 'border-emerald-400', text: 'text-emerald-800' },
};

const stateStyles = {
  inactive: 'opacity-50',
  active: 'ring-4 ring-indigo-300 scale-105',
  completed: 'opacity-100',
  error: 'ring-4 ring-red-300',
  skipped: 'opacity-30',
};

interface CustomNodeData {
  label: string;
  type: FlowNode['type'];
  state: FlowNode['state'];
  description?: string;
}

const CustomNode: React.FC<NodeProps> = ({ data }) => {
  const nodeData = data as CustomNodeData;
  const colors = nodeColors[nodeData.type] || nodeColors.process;
  const stateStyle = stateStyles[nodeData.state || 'inactive'];
  
  const isDecision = nodeData.type === 'decision';

  return (
    <motion.div
      className={`
        px-4 py-3 rounded-lg border-2 shadow-sm
        ${colors.bg} ${colors.border} ${colors.text}
        ${stateStyle}
        transition-all duration-300
        ${isDecision ? 'rotate-0' : ''}
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
// SYSTEM STATE DISPLAY
// =============================================================================

interface SystemStateDisplayProps {
  state: SystemState;
  className?: string;
}

const SystemStateDisplay: React.FC<SystemStateDisplayProps> = ({ state, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`bg-slate-800 rounded-xl overflow-hidden ${className}`}
    >
      <div className="px-4 py-3 bg-slate-900 border-b border-slate-700">
        <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
          {state.label}
        </h4>
      </div>
      <div className="p-4 font-mono text-sm">
        {Object.entries(state.data).map(([key, value]) => (
          <div key={key} className="flex justify-between py-1">
            <span className="text-slate-400">{key}:</span>
            <span className={`
              ${value === true ? 'text-emerald-400' : ''}
              ${value === false ? 'text-red-400' : ''}
              ${typeof value === 'string' ? 'text-amber-300' : ''}
              ${typeof value === 'number' ? 'text-blue-300' : ''}
              ${value === null ? 'text-slate-500 italic' : ''}
            `}>
              {value === null ? 'null' : String(value)}
            </span>
          </div>
        ))}
      </div>
      {state.explanation && (
        <div className="px-4 py-3 bg-slate-900/50 border-t border-slate-700">
          <p className="text-sm text-slate-300">{state.explanation}</p>
        </div>
      )}
    </motion.div>
  );
};

// =============================================================================
// CONDITION CONTROLS
// =============================================================================

interface ConditionControlsProps {
  conditions: FlowCondition[];
  values: Record<string, boolean | string | number>;
  manipulableIds: string[];
  onChange: (conditionId: string, value: boolean | string | number) => void;
  className?: string;
}

const ConditionControls: React.FC<ConditionControlsProps> = ({
  conditions,
  values,
  manipulableIds,
  onChange,
  className = '',
}) => {
  const manipulableConditions = conditions.filter(c => manipulableIds.includes(c.id));

  if (manipulableConditions.length === 0) return null;

  return (
    <div className={`bg-white rounded-xl border border-slate-200 overflow-hidden ${className}`}>
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
        <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Try Different Conditions
        </h4>
        <p className="text-xs text-slate-500 mt-1">
          Change these values to see how the system responds
        </p>
      </div>
      <div className="p-4 space-y-4">
        {manipulableConditions.map(condition => (
          <div key={condition.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">
                {condition.label}
              </label>
              {condition.controlType === 'toggle' && (
                <button
                  onClick={() => onChange(condition.id, !values[condition.id])}
                  className={`
                    relative w-12 h-6 rounded-full transition-colors duration-200
                    ${values[condition.id] ? 'bg-emerald-500' : 'bg-slate-300'}
                  `}
                >
                  <motion.div
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                    animate={{ left: values[condition.id] ? '1.5rem' : '0.25rem' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              )}
              {condition.controlType === 'select' && condition.options && (
                <select
                  value={String(values[condition.id])}
                  onChange={e => onChange(condition.id, e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm bg-white"
                >
                  {condition.options.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <p className="text-xs text-slate-500">{condition.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const FlowSimulatorSlide: React.FC<FlowSimulatorProps> = ({
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

  // Condition values
  const [conditionValues, setConditionValues] = useState<Record<string, boolean | string | number>>(() => {
    const initial: Record<string, boolean | string | number> = {};
    data.conditions.forEach(c => {
      initial[c.id] = c.value;
    });
    return initial;
  });

  // Current system state
  const [currentSystemState, setCurrentSystemState] = useState<SystemState>(data.initialState);

  // Convert data nodes/edges to ReactFlow format
  const flowNodes: Node[] = useMemo(() => {
    return data.nodes.map(node => {
      const isHighlighted = currentStep?.highlightNodes?.includes(node.id);
      const nodeState = isHighlighted ? 'active' : (
        state.completedSteps.includes(`visited-${node.id}`) ? 'completed' : 'inactive'
      );

      return {
        id: node.id,
        type: 'custom',
        position: node.position,
        data: {
          label: node.label,
          type: node.type,
          state: nodeState,
          description: node.description,
        },
      };
    });
  }, [data.nodes, currentStep, state.completedSteps]);

  const flowEdges: Edge[] = useMemo(() => {
    return data.edges.map(edge => {
      const isHighlighted = currentStep?.highlightEdges?.includes(edge.id);

      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.label,
        animated: isHighlighted,
        style: {
          stroke: isHighlighted ? '#6366f1' : '#94a3b8',
          strokeWidth: isHighlighted ? 2 : 1,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isHighlighted ? '#6366f1' : '#94a3b8',
        },
      };
    });
  }, [data.edges, currentStep]);

  // Handle condition change
  const handleConditionChange = useCallback((conditionId: string, value: boolean | string | number) => {
    setConditionValues(prev => ({ ...prev, [conditionId]: value }));

    // Find matching branch outcome
    const outcome = data.branchOutcomes.find(o => 
      o.conditionId === conditionId && o.conditionValue === value
    );

    if (outcome) {
      // Update system state based on outcome
      setCurrentSystemState(prev => ({
        ...prev,
        explanation: outcome.explanation,
      }));

      // Provide feedback
      const feedbackType = outcome.tone === 'success' ? 'success' : 
        outcome.tone === 'error' ? 'incorrect' : 'info';

      submitAction(currentStep!.id, {
        isCorrect: true, // Exploration is always valid
        feedback: {
          type: feedbackType,
          title: outcome.tone === 'success' ? 'Success Path' : 
                 outcome.tone === 'error' ? 'Error Path' : 'Alternative Path',
          message: outcome.explanation,
        },
      });
    }
  }, [data.branchOutcomes, currentStep, submitAction]);

  // Update system state when step changes
  useEffect(() => {
    if (currentStep?.systemState) {
      setCurrentSystemState(currentStep.systemState);
    }
  }, [currentStep]);

  // Auto-complete non-action steps
  useEffect(() => {
    if (currentStep && !currentStep.requiresAction && !state.completedSteps.includes(currentStep.id)) {
      const timer = setTimeout(() => {
        completeStep(currentStep.id);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentStep, state.completedSteps, completeStep]);

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
          {/* Left column - Flow diagram */}
          <div className="lg:col-span-2 space-y-6">
            {/* System context */}
            <ExplanationPanel
              title={data.systemContext.title}
              content={data.systemContext.description}
              keyConcepts={data.systemContext.realWorldExample ? [data.systemContext.realWorldExample] : undefined}
              collapsible={true}
              defaultCollapsed={state.currentPhase !== 'explain'}
            />

            {/* Flow diagram */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                <h4 className="text-sm font-semibold text-slate-700">System Flow</h4>
              </div>
              <div className="h-[400px]">
                <ReactFlow
                  nodes={flowNodes}
                  edges={flowEdges}
                  nodeTypes={nodeTypes}
                  fitView
                  attributionPosition="bottom-left"
                  proOptions={{ hideAttribution: true }}
                >
                  <Background color="#e2e8f0" gap={16} />
                  <Controls />
                </ReactFlow>
              </div>
            </div>

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

                    {/* Counterfactual question */}
                    {currentStep.counterfactual && (
                      <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                        <p className="text-sm font-medium text-amber-800">
                          🤔 What if: {currentStep.counterfactual.question}
                        </p>
                      </div>
                    )}
                  </div>
                  <HintLadder
                    hints={currentStep.hints}
                    currentLevel={currentHintLevel}
                    onRequestHint={requestHint}
                  />
                </div>
              </motion.div>
            )}

            {/* Feedback */}
            <FeedbackIndicator
              feedback={state.feedback}
              onDismiss={clearFeedback}
            />
          </div>

          {/* Right column - State & Controls */}
          <div className="space-y-6">
            {/* System state */}
            <SystemStateDisplay state={currentSystemState} />

            {/* Condition controls */}
            {currentStep?.manipulableConditions && (
              <ConditionControls
                conditions={data.conditions}
                values={conditionValues}
                manipulableIds={currentStep.manipulableConditions}
                onChange={handleConditionChange}
              />
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
                  System Understanding Built!
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

export default FlowSimulatorSlide;
