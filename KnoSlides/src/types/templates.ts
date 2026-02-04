/**
 * KnoSlides Template Types
 * 
 * Type definitions for the 3 behaviour-driven templates:
 * - BuildAndVerify: teaches how something works + how to do it
 * - FlowSimulator: teaches systems, processes, causality
 * - RepairTheModel: teaches debugging, judgement, common mistakes
 * 
 * All templates implement the 4-phase progression model:
 * 1. Explain - introduce concept visually/textually
 * 2. Guided Interaction - manipulate with heavy support
 * 3. Constrained Construction - complete structure with bounded input
 * 4. Outcome/Reflection - see consequences of actions
 */

// =============================================================================
// COMMON TYPES
// =============================================================================

export interface BaseTemplateProps {
  /** Unique identifier for the template instance */
  id?: string;
  /** Additional CSS classes */
  className?: string;
}

/** Progression phase for all templates */
export type ProgressionPhase = 'explain' | 'guided' | 'construct' | 'outcome';

/** Hint with multiple levels of specificity */
export interface Hint {
  level: number;
  content: string;
  /** Optional visual element ID to highlight */
  highlightId?: string;
}

/** Feedback shown after learner actions */
export interface Feedback {
  type: 'success' | 'partial' | 'incorrect' | 'info';
  title: string;
  message: string;
  /** Additional explanation for incorrect attempts */
  explanation?: string;
  /** Suggested next action */
  suggestion?: string;
}

/** Step within a template - all templates are step-based */
export interface TemplateStep {
  id: string;
  phase: ProgressionPhase;
  title: string;
  instruction: string;
  /** Hints available at this step (min 2 required) */
  hints: Hint[];
  /** Whether this step requires action to proceed */
  requiresAction: boolean;
  /** Validation function identifier */
  validationId?: string;
}

// =============================================================================
// BUILD & VERIFY TEMPLATE
// =============================================================================

/**
 * BUILD & VERIFY
 * 
 * Use when: teaching how something works and how to do it.
 * 
 * Required behaviours:
 * - Persistent explanation context
 * - Interactive model that updates live as learner acts
 * - Constrained construction (drag, select, reorder, fill blanks)
 * - Live preview of results
 * - Hint ladder (minimum 2 levels)
 */

export type InteractionType = 'drag-drop' | 'select' | 'reorder' | 'fill-blank' | 'toggle';

/** Draggable item for drag-drop interactions */
export interface DraggableItem {
  id: string;
  content: string;
  category?: string;
  /** Whether this is a correct option for its target */
  isCorrect?: boolean;
  /** Which drop zone(s) this can be dropped into */
  validTargets?: string[];
}

/** Drop zone for drag-drop interactions */
export interface DropZone {
  id: string;
  label: string;
  /** Expected item ID for validation */
  expectedItemId?: string;
  /** Currently placed item */
  currentItemId?: string;
  /** Placeholder text when empty */
  placeholder?: string;
}

/** Selection option for select/toggle interactions */
export interface SelectOption {
  id: string;
  label: string;
  value: string;
  isCorrect?: boolean;
  explanation?: string;
}

/** Blank in a fill-blank interaction */
export interface FillBlank {
  id: string;
  /** Position in the template string */
  position: number;
  /** Expected answer(s) - can have multiple valid answers */
  expectedAnswers: string[];
  /** Current user input */
  currentValue?: string;
  /** Hint for this specific blank */
  hint?: string;
  /** Max length constraint */
  maxLength?: number;
}

/** Data row for table preview */
export interface DataRow {
  id: string;
  [key: string]: string | number | boolean | null;
}

/** Table schema for preview */
export interface TableSchema {
  columns: Array<{
    key: string;
    label: string;
    type: 'string' | 'number' | 'boolean';
  }>;
}

/** Live preview configuration */
export interface LivePreview {
  type: 'table' | 'output' | 'code' | 'diagram' | 'json';
  /** Table schema if type is 'table' */
  tableSchema?: TableSchema;
  /** Initial data */
  initialData?: DataRow[] | string;
  /** Title for the preview panel */
  title?: string;
}

/** Build & Verify step extends base step with interaction specifics */
export interface BuildAndVerifyStep extends TemplateStep {
  phase: ProgressionPhase;
  /** Type of interaction for this step */
  interactionType?: InteractionType;
  /** Draggable items available at this step */
  draggables?: DraggableItem[];
  /** Drop zones for this step */
  dropZones?: DropZone[];
  /** Select options for this step */
  selectOptions?: SelectOption[];
  /** Fill-blank template and blanks */
  fillTemplate?: string;
  fillBlanks?: FillBlank[];
  /** Code content for code-based steps */
  codeContent?: string;
  codeLanguage?: 'sql' | 'python' | 'javascript' | 'json';
  /** Expected state after completing this step */
  expectedState?: Record<string, unknown>;
}

/** Main data structure for Build & Verify template */
export interface BuildAndVerifyData {
  /** Title of the slide */
  title: string;
  /** What understanding this slide builds */
  learningObjective: string;
  /** What capability it enables next */
  enablesNext: string;
  /** Persistent explanation context shown throughout */
  explanationContext: {
    title: string;
    content: string;
    /** Visual reference (diagram, code example, etc.) */
    visualReference?: {
      type: 'code' | 'diagram' | 'image';
      content: string;
      language?: string;
    };
    /** Key concepts to highlight */
    keyConcepts?: string[];
  };
  /** Steps in this slide */
  steps: BuildAndVerifyStep[];
  /** Live preview configuration */
  livePreview: LivePreview;
  /** Source data for the exercise (e.g., input tables for SQL) */
  sourceData?: {
    tables?: Array<{
      name: string;
      schema: TableSchema;
      data: DataRow[];
    }>;
  };
  /** Completion message */
  completionMessage?: string;
}

export interface BuildAndVerifyProps extends BaseTemplateProps {
  data: BuildAndVerifyData;
  onComplete?: () => void;
  onStepChange?: (stepIndex: number) => void;
}

// =============================================================================
// FLOW SIMULATOR TEMPLATE
// =============================================================================

/**
 * FLOW SIMULATOR
 * 
 * Use when: teaching systems, processes, lifecycles, or causality.
 * 
 * Required behaviours:
 * - Step-based progression (not scroll-based)
 * - Visible system state
 * - Branching or counterfactual paths
 * - Clear cause → effect explanations
 * - Ability to inject or remove conditions
 */

export type FlowNodeType = 'start' | 'process' | 'decision' | 'end' | 'state' | 'error' | 'success';

/** Node in the flow diagram */
export interface FlowNode {
  id: string;
  type: FlowNodeType;
  label: string;
  description?: string;
  /** Position for rendering */
  position: { x: number; y: number };
  /** Current state during simulation */
  state?: 'inactive' | 'active' | 'completed' | 'error' | 'skipped';
  /** Data/state shown at this node */
  stateData?: Record<string, unknown>;
}

/** Edge connecting nodes */
export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  /** Condition for this edge (for decision nodes) */
  condition?: string;
  /** Whether this edge is highlighted in current state */
  isActive?: boolean;
  /** Edge style */
  style?: 'solid' | 'dashed' | 'dotted';
}

/** Condition that can be injected/removed */
export interface FlowCondition {
  id: string;
  label: string;
  description: string;
  /** Current value */
  value: boolean | string | number;
  /** Type of control to show */
  controlType: 'toggle' | 'select' | 'input';
  /** Options for select type */
  options?: Array<{ value: string; label: string }>;
  /** Which nodes/edges this affects */
  affects: string[];
}

/** System state at a point in the simulation */
export interface SystemState {
  id: string;
  label: string;
  /** Key-value pairs representing state */
  data: Record<string, string | number | boolean | null>;
  /** Which node is currently active */
  activeNodeId?: string;
  /** Explanation of current state */
  explanation?: string;
}

/** Flow Simulator step */
export interface FlowSimulatorStep extends TemplateStep {
  phase: ProgressionPhase;
  /** Which node(s) to highlight at this step */
  highlightNodes?: string[];
  /** Which edge(s) to highlight */
  highlightEdges?: string[];
  /** System state to show */
  systemState?: SystemState;
  /** Conditions learner can manipulate */
  manipulableConditions?: string[];
  /** Expected path for validation */
  expectedPath?: string[];
  /** Counterfactual question */
  counterfactual?: {
    question: string;
    condition: string;
    expectedAnswer: string;
    explanation: string;
  };
}

/** Branch outcome for decision points */
export interface BranchOutcome {
  conditionId: string;
  conditionValue: string | boolean | number;
  resultPath: string[];
  explanation: string;
  tone: 'success' | 'error' | 'warning' | 'info';
}

/** Main data structure for Flow Simulator template */
export interface FlowSimulatorData {
  /** Title of the slide */
  title: string;
  /** What understanding this slide builds */
  learningObjective: string;
  /** What capability it enables next */
  enablesNext: string;
  /** System context explanation */
  systemContext: {
    title: string;
    description: string;
    realWorldExample?: string;
  };
  /** Flow diagram nodes */
  nodes: FlowNode[];
  /** Flow diagram edges */
  edges: FlowEdge[];
  /** Manipulable conditions */
  conditions: FlowCondition[];
  /** Steps in this slide */
  steps: FlowSimulatorStep[];
  /** Possible branch outcomes */
  branchOutcomes: BranchOutcome[];
  /** Initial system state */
  initialState: SystemState;
  /** Completion message */
  completionMessage?: string;
}

export interface FlowSimulatorProps extends BaseTemplateProps {
  data: FlowSimulatorData;
  onComplete?: () => void;
  onStepChange?: (stepIndex: number) => void;
}

// =============================================================================
// REPAIR THE MODEL TEMPLATE
// =============================================================================

/**
 * REPAIR THE MODEL
 * 
 * Use when: teaching debugging, judgement, or common mistakes.
 * 
 * Required behaviours:
 * - Present a flawed but realistic artifact
 * - Learner identifies or fixes the issue
 * - Before/after comparison
 * - Explanation of why the fix matters
 */

export type ArtifactType = 'code' | 'query' | 'request' | 'config' | 'diagram';

/** Error/bug in the artifact */
export interface ArtifactError {
  id: string;
  /** Line number(s) where error occurs */
  lineStart: number;
  lineEnd?: number;
  /** Column range for inline errors */
  columnStart?: number;
  columnEnd?: number;
  /** Error description */
  description: string;
  /** Why this is wrong */
  explanation: string;
  /** Category of error */
  category: 'syntax' | 'logic' | 'semantic' | 'performance' | 'security' | 'best-practice';
  /** Severity */
  severity: 'critical' | 'error' | 'warning' | 'info';
  /** The correct fix */
  correctFix: string;
  /** Common incorrect attempts and feedback */
  commonMistakes?: Array<{
    attempt: string;
    feedback: string;
  }>;
}

/** Repair mode configuration */
export type RepairMode = 'identify' | 'fix' | 'both';

/** Repair the Model step */
export interface RepairTheModelStep extends TemplateStep {
  phase: ProgressionPhase;
  /** Which errors are relevant to this step */
  relevantErrors?: string[];
  /** Mode for this step */
  mode?: RepairMode;
  /** Expected identified error IDs */
  expectedIdentifications?: string[];
  /** Whether to show before/after comparison */
  showComparison?: boolean;
}

/** Main data structure for Repair the Model template */
export interface RepairTheModelData {
  /** Title of the slide */
  title: string;
  /** What understanding this slide builds */
  learningObjective: string;
  /** What capability it enables next */
  enablesNext: string;
  /** Context about what the artifact is supposed to do */
  artifactContext: {
    title: string;
    description: string;
    /** What the code/query should achieve */
    intendedBehavior: string;
    /** What's actually happening */
    actualBehavior: string;
  };
  /** The flawed artifact */
  artifact: {
    type: ArtifactType;
    language?: 'sql' | 'python' | 'javascript' | 'json' | 'yaml' | 'bash';
    /** The buggy code/content */
    buggyContent: string;
    /** The correct version */
    correctContent: string;
    /** Filename for context */
    filename?: string;
  };
  /** Errors in the artifact */
  errors: ArtifactError[];
  /** Steps in this slide */
  steps: RepairTheModelStep[];
  /** Output/result preview */
  outputPreview?: {
    /** Output with bugs */
    buggyOutput: string;
    /** Expected correct output */
    correctOutput: string;
    type: 'text' | 'table' | 'error' | 'json';
  };
  /** Real-world impact explanation */
  realWorldImpact?: string;
  /** Completion message */
  completionMessage?: string;
}

export interface RepairTheModelProps extends BaseTemplateProps {
  data: RepairTheModelData;
  onComplete?: () => void;
  onStepChange?: (stepIndex: number) => void;
}

// =============================================================================
// SHARED STATE TYPES
// =============================================================================

/** Common state for all templates */
export interface TemplateState {
  currentStepIndex: number;
  currentPhase: ProgressionPhase;
  completedSteps: string[];
  hintsUsed: Record<string, number[]>;
  attempts: Record<string, number>;
  feedback: Feedback | null;
  isComplete: boolean;
}

/** Validation result */
export interface ValidationResult {
  isCorrect: boolean;
  isPartial?: boolean;
  feedback: Feedback;
  /** Specific items that are correct/incorrect */
  itemResults?: Record<string, boolean>;
}
