/**
 * KnoSlides - Interactive Learning Templates
 * 
 * Main entry point for the KnoSlides library.
 * 
 * Architecture:
 * - Core: SlideRenderer orchestrates rendering with SlotResolver and BlockRegistry
 * - Blocks: Content components (guidance, content, interactive) registered in BlockRegistry
 * - Types: Unified schema types define the JSON structure
 * 
 * Usage:
 * 1. Import and call initializeBlocks() at app start
 * 2. Import SlideRenderer and pass your slide JSON
 * 3. SlideRenderer handles step progression, task gating, and block rendering
 */

// =============================================================================
// CORE - Unified Template Architecture
// =============================================================================
export {
  // Main renderer
  SlideRenderer,
  type SlideRendererProps,
} from './core/SlideRenderer';

export {
  // Slot layout system
  SlotResolver,
  type SlotResolverProps,
} from './core/SlotResolver';

export {
  // Block registry for content blocks
  BlockRegistry,
  BlockRegistryProvider,
  BlockRenderer,
  useBlockRegistry,
  useRenderBlock,
  defaultRegistry,
  type BlockComponentProps,
  type BlockComponent,
  type BlockConfigMap,
} from './core/BlockRegistry';

export {
  // State management
  SlideStateProvider,
  useSlideState,
  useCurrentStep,
  useTaskState,
  useHints,
  type SlideState,
  type StepState,
  type TaskState,
} from './core/SlideStateContext';

export {
  // Event system
  SlideEventProvider,
  useSlideEvents,
  useEventSubscription,
} from './core/SlideEventContext';

// =============================================================================
// BLOCKS - Content Block Components
// =============================================================================
export { 
  // Guidance blocks
  ContextCard,
  TaskList,
  HintLadder as HintLadderBlock,
  Callout,
  
  // Content blocks
  TextBlock,
  TextAndCodeBlock,
  TableView,
  OutputPreview,
  ReferencePanel,
  
  // Interactive blocks
  DragAndDrop,
  ErrorList,
  CodeCompare,
  FlowDiagram,
  
  // Registry initialization
  registerCoreBlocks,
  initializeBlocks,
} from './blocks';

// =============================================================================
// SHARED COMPONENTS
// =============================================================================
export {
  Card,
  Text,
  Icon,
  Accordion,
  ProgressIndicator,
  LottiePlayer,
} from './components';

// =============================================================================
// HOOKS
// =============================================================================
export { 
  useResponsive, 
  useScrollReveal,
  type ResponsiveState,
  type ScrollRevealOptions,
  type ScrollRevealState,
} from './hooks';

// =============================================================================
// ANIMATIONS
// =============================================================================
export * from './animations';

// =============================================================================
// THEME
// =============================================================================
export * from './theme';

// =============================================================================
// TYPES - Unified Schema
// =============================================================================
export type {
  // Slot system
  SlotName,
  LayoutType,
  LayoutConfig,
  
  // Block types
  BlockType,
  ContentBlock,
  VisibilityCondition,
  
  // Block configs
  ContextCardConfig,
  TaskListConfig,
  HintLadderConfig,
  CalloutConfig,
  TextBlockConfig,
  RichTextConfig,
  TextAndCodeBlockConfig,
  MediaConfig,
  ReferencePanelConfig,
  TableColumn,
  TableViewConfig,
  OutputPreviewConfig,
  DragItem,
  DropZone,
  DragAndDropConfig,
  SelectOption,
  SelectGroupConfig,
  ToggleItem,
  ToggleGroupConfig,
  FlowNode,
  FlowEdge,
  FlowDiagramConfig,
  CodeCompareConfig,
  ErrorItem,
  ErrorListConfig,
  
  // Task system
  ActionType,
  TaskAction,
  Task,
  TaskStatus,
  
  // Hint system
  Hint,
  
  // Step system
  Phase,
  StepSlots,
  Step,
  
  // Slide definition
  Concept,
  FeatureFlags,
  KnoSlide,
  
  // Typed blocks
  TypedContentBlock,
} from './types/unified-schema';

// Event types
export type {
  SlideEventType,
  SlideEvent,
  DragStartEvent,
  DropEvent,
  SelectEvent,
  ToggleEvent,
  ValidationResultEvent,
  TaskStateChangeEvent,
  StepCompleteEvent,
  HintRequestEvent,
  CustomEvent,
  AnySlideEvent,
  SlideEventBus,
  EventHandler,
} from './types/events';

export {
  createEvent,
  actionToEventMap,
  isEventType,
} from './types/events';
