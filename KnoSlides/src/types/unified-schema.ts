/**
 * KnoSlides Unified Schema Types
 * 
 * This file defines the unified JSON schema for all KnoSlides templates.
 * A single vanilla template driven by JSON, using named slots and reusable content blocks.
 * 
 * Architecture:
 * Slide JSON -> SlideRenderer -> SlotResolver -> ContentBlockRenderer -> SDK Elements
 */

// =============================================================================
// SLOT SYSTEM
// =============================================================================

/**
 * Named slots for consistent positioning across all slides.
 * Slots can be omitted for a step, but names stay consistent.
 */
export type SlotName =
  | 'HeaderSlot'      // Title, objective summary - Top
  | 'OverviewSlot'    // What am I seeing / concept context - Left column (top)
  | 'TaskSlot'        // Per-step tasks and progress - Left column (below overview)
  | 'WorkspaceSlot'   // Primary interactive element - Right column (top)
  | 'ReferenceSlot'   // Supporting references (data, diagrams) - Right column (mid)
  | 'OutputSlot'      // Result or preview output - Right column (bottom)
  | 'FooterSlot';     // Navigation, Ask KNO (hints) - Bottom

/**
 * Layout types for slot arrangement
 */
export type LayoutType = 'columnSplit' | 'rowStack' | 'gridSlots' | 'full';

/**
 * Layout configuration
 */
export interface LayoutConfig {
  type: LayoutType;
  /** Which slots are active in this layout */
  slots: SlotName[];
  /** Optional style preset for the layout */
  stylePreset?: string;
}

// =============================================================================
// CONTENT BLOCK TYPES
// =============================================================================

/**
 * All available content block types in the SDK
 */
export type BlockType =
  // Core Guidance
  | 'contextCard'
  | 'taskList'
  | 'hintLadder'
  | 'callout'
  // Content and Reference
  | 'textBlock'
  | 'richText'
  | 'textAndCodeBlock'
  | 'media'
  | 'referencePanel'
  | 'tableView'
  | 'outputPreview'
  // Interactive
  | 'dragAndDrop'
  | 'selectGroup'
  | 'toggleGroup'
  | 'flowDiagram'
  | 'codeCompare'
  | 'errorList';

/**
 * Condition for controlling block visibility
 * Supports simple equality, comparisons, and basic logical operators
 */
export interface VisibilityCondition {
  /** The variable/state key to check */
  field: string;
  /** Comparison operator */
  operator: 'equals' | 'notEquals' | 'gt' | 'gte' | 'lt' | 'lte' | 'includes' | 'notIncludes' | 'isEmpty' | 'isNotEmpty';
  /** Value to compare against (not needed for isEmpty/isNotEmpty) */
  value?: string | number | boolean | string[];
  /** Combine multiple conditions */
  and?: VisibilityCondition[];
  or?: VisibilityCondition[];
}

/**
 * Base content block structure - all blocks share this
 */
export interface ContentBlock<T extends BlockType = BlockType, C = unknown> {
  /** Unique identifier for this block instance */
  id: string;
  /** Block type from the registry */
  type: T;
  /** Block-specific configuration */
  config: C;
  /** Optional style preset */
  stylePreset?: string;
  /** Conditional visibility */
  visibleWhen?: VisibilityCondition;
}

// =============================================================================
// BLOCK CONFIGURATIONS
// =============================================================================

// --- Core Guidance Blocks ---

export interface ContextCardConfig {
  title: string;
  body: string;
  keyPoints?: string[];
  icon?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export interface TaskListConfig {
  /** Reference to task IDs in the current step */
  taskIds: string[];
  showProgress?: boolean;
  variant?: 'checklist' | 'numbered' | 'minimal';
}

export interface HintLadderConfig {
  /** Hints are pulled from the step, this config is for display options */
  askKnoLabel?: string;
  showLevelIndicator?: boolean;
  maxVisibleHints?: number;
}

export interface CalloutConfig {
  tone: 'info' | 'success' | 'warning' | 'error' | 'insight';
  title?: string;
  body: string;
  icon?: string;
}

// --- Content and Reference Blocks ---

export interface TextBlockConfig {
  text: string;
  emphasis?: 'normal' | 'strong' | 'subtle';
  align?: 'left' | 'center' | 'right';
}

export interface RichTextConfig {
  markdown: string;
  highlights?: Array<{
    pattern: string;
    className: string;
  }>;
}

export interface TextAndCodeBlockConfig {
  text: string;
  code: string;
  language: string;
  codePosition?: 'below' | 'right' | 'above';
}

export interface MediaConfig {
  type: 'image' | 'diagram' | 'svg' | 'lottie';
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  caption?: string;
}

export interface ReferencePanelConfig {
  title: string;
  /** Tabbed content with multiple sources */
  tabs?: Array<{
    id: string;
    label: string;
    content: ContentBlock;
  }>;
  /** Single content if no tabs */
  content?: ContentBlock;
}

export interface TableColumn {
  key: string;
  label: string;
  type?: 'string' | 'number' | 'boolean';
  width?: number | string;
}

export interface TableViewConfig {
  columns: TableColumn[];
  rows: Array<Record<string, unknown>>;
  emptyState?: string;
  title?: string;
  highlightRows?: number[];
  highlightColumns?: string[];
}

export interface OutputPreviewConfig {
  type: 'text' | 'table' | 'json' | 'error' | 'diff';
  current: string | Record<string, unknown>[];
  expected?: string | Record<string, unknown>[];
  showExpected?: boolean;
  title?: string;
}

// --- Interactive Blocks ---

export interface DragItem {
  id: string;
  content: string;
  category?: string;
  /** Valid drop zone IDs */
  validTargets?: string[];
  /** Data payload for validation */
  data?: Record<string, unknown>;
}

export interface DropZone {
  id: string;
  label: string;
  placeholder?: string;
  /** Expected item ID for auto-validation */
  expectedItemId?: string;
  /** Accept multiple items */
  multiple?: boolean;
}

export interface DragAndDropConfig {
  items: DragItem[];
  zones: DropZone[];
  /** Layout of the drag area */
  layout?: 'horizontal' | 'vertical' | 'grid' | 'inline';
  /** Validation mode */
  validation?: 'immediate' | 'onComplete' | 'manual';
  /** Feedback messages */
  feedback?: {
    correct?: string;
    incorrect?: string;
    partial?: string;
  };
}

export interface SelectOption {
  id: string;
  label: string;
  value: string;
  isCorrect?: boolean;
  feedback?: string;
}

export interface SelectGroupConfig {
  options: SelectOption[];
  selectionMode: 'single' | 'multiple';
  layout?: 'horizontal' | 'vertical' | 'grid';
  validation?: 'immediate' | 'onSubmit';
}

export interface ToggleItem {
  id: string;
  label: string;
  description?: string;
  defaultValue?: boolean;
  correctValue?: boolean;
}

export interface ToggleGroupConfig {
  toggles: ToggleItem[];
  layout?: 'horizontal' | 'vertical';
  validation?: 'immediate' | 'onSubmit';
}

export interface FlowNode {
  id: string;
  type: 'start' | 'process' | 'decision' | 'end' | 'state' | 'error' | 'success';
  label: string;
  description?: string;
  position: { x: number; y: number };
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  condition?: string;
  style?: 'solid' | 'dashed' | 'dotted';
}

export interface FlowDiagramConfig {
  nodes: FlowNode[];
  edges: FlowEdge[];
  viewport?: { x: number; y: number; zoom: number };
  highlights?: {
    nodes?: string[];
    edges?: string[];
  };
  interactive?: boolean;
}

export interface CodeCompareConfig {
  leftCode: string;
  rightCode: string;
  language: string;
  leftLabel?: string;
  rightLabel?: string;
  diffMode?: 'side-by-side' | 'inline' | 'unified';
  showDiff?: boolean;
  highlightLines?: {
    left?: number[];
    right?: number[];
  };
}

export interface ErrorItem {
  id: string;
  lineStart: number;
  lineEnd?: number;
  description: string;
  explanation: string;
  severity: 'critical' | 'error' | 'warning' | 'info';
  category: 'syntax' | 'logic' | 'semantic' | 'performance' | 'security' | 'best-practice';
  correctFix: string;
}

export interface ErrorListConfig {
  items: ErrorItem[];
  showSeverity?: boolean;
  showCategory?: boolean;
  selectable?: boolean;
}

// =============================================================================
// TASK AND ACTION SYSTEM
// =============================================================================

/**
 * Action types that tasks can require
 */
export type ActionType =
  | 'click'
  | 'select'
  | 'toggle'
  | 'drag'
  | 'drop'
  | 'input'
  | 'reorder'
  | 'inspect'
  | 'compare'
  | 'event';

/**
 * Action definition for a task
 */
export interface TaskAction {
  type: ActionType;
  /** Target element ID */
  targetId?: string;
  /** Event ID to listen for */
  eventId?: string;
  /** Expected value for validation */
  value?: unknown;
  /** For complex validation */
  validation?: {
    type: 'equals' | 'includes' | 'matches' | 'custom';
    expected: unknown;
    customValidator?: string;
  };
}

/**
 * Task definition - tasks gate step progression
 */
export interface Task {
  id: string;
  label: string;
  /** Whether this task must be completed to proceed */
  required: boolean;
  /** The action that completes this task */
  action: TaskAction;
  /** Message shown on successful completion */
  successMessage?: string;
  /** Additional hint for this specific task */
  hint?: string;
}

/**
 * Task completion state
 */
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'skipped';

// =============================================================================
// HINT SYSTEM
// =============================================================================

/**
 * Hint with progressive levels of specificity
 */
export interface Hint {
  level: number;
  content: string;
  /** Optional element to highlight when this hint is shown */
  targetId?: string;
}

// =============================================================================
// STEP SYSTEM
// =============================================================================

/**
 * Progression phases - every concept follows this 4-step model
 */
export type Phase = 'explain' | 'guided' | 'construct' | 'outcome';

/**
 * Slot content for a step - maps slot names to content blocks
 */
export type StepSlots = Partial<Record<SlotName, ContentBlock[]>>;

/**
 * Step definition
 */
export interface Step {
  id: string;
  phase: Phase;
  title: string;
  instruction: string;
  /** Tasks for this step - completion gates progression */
  tasks: Task[];
  /** Hints available at this step (minimum 2 required) */
  hints: Hint[];
  /** Content blocks per slot for this step */
  slots: StepSlots;
}

// =============================================================================
// CONCEPT AND SLIDE
// =============================================================================

/**
 * Concept metadata
 */
export interface Concept {
  id: string;
  title: string;
  summary?: string;
  /** What understanding this slide builds */
  learningObjective: string;
  /** What capability it enables next */
  enablesNext: string;
}

/**
 * Feature flags for optional slide features
 */
export interface FeatureFlags {
  showHints?: boolean;
  showTaskSlot?: boolean;
  showReferenceSlot?: boolean;
  showOutputSlot?: boolean;
}

/**
 * Complete KnoSlide definition - the unified JSON schema
 */
export interface KnoSlide {
  /** Unique identifier */
  id?: string;
  /** Schema version */
  version?: string;
  /** Concept being taught */
  concept: Concept;
  /** Layout configuration */
  layout: LayoutConfig;
  /** Feature flags */
  featureFlags?: FeatureFlags;
  /** Steps in this slide */
  steps: Step[];
  /** Message shown on completion */
  completionMessage?: string;
}

// =============================================================================
// TYPE HELPERS FOR TYPED BLOCKS
// =============================================================================

/**
 * Typed content block - use these for type-safe block creation
 */
export type ContextCardBlock = ContentBlock<'contextCard', ContextCardConfig>;
export type TaskListBlock = ContentBlock<'taskList', TaskListConfig>;
export type HintLadderBlock = ContentBlock<'hintLadder', HintLadderConfig>;
export type CalloutBlock = ContentBlock<'callout', CalloutConfig>;
export type TextBlockBlock = ContentBlock<'textBlock', TextBlockConfig>;
export type RichTextBlock = ContentBlock<'richText', RichTextConfig>;
export type TextAndCodeBlockBlock = ContentBlock<'textAndCodeBlock', TextAndCodeBlockConfig>;
export type MediaBlock = ContentBlock<'media', MediaConfig>;
export type ReferencePanelBlock = ContentBlock<'referencePanel', ReferencePanelConfig>;
export type TableViewBlock = ContentBlock<'tableView', TableViewConfig>;
export type OutputPreviewBlock = ContentBlock<'outputPreview', OutputPreviewConfig>;
export type DragAndDropBlock = ContentBlock<'dragAndDrop', DragAndDropConfig>;
export type SelectGroupBlock = ContentBlock<'selectGroup', SelectGroupConfig>;
export type ToggleGroupBlock = ContentBlock<'toggleGroup', ToggleGroupConfig>;
export type FlowDiagramBlock = ContentBlock<'flowDiagram', FlowDiagramConfig>;
export type CodeCompareBlock = ContentBlock<'codeCompare', CodeCompareConfig>;
export type ErrorListBlock = ContentBlock<'errorList', ErrorListConfig>;

/**
 * Union of all typed blocks
 */
export type TypedContentBlock =
  | ContextCardBlock
  | TaskListBlock
  | HintLadderBlock
  | CalloutBlock
  | TextBlockBlock
  | RichTextBlock
  | TextAndCodeBlockBlock
  | MediaBlock
  | ReferencePanelBlock
  | TableViewBlock
  | OutputPreviewBlock
  | DragAndDropBlock
  | SelectGroupBlock
  | ToggleGroupBlock
  | FlowDiagramBlock
  | CodeCompareBlock
  | ErrorListBlock;
