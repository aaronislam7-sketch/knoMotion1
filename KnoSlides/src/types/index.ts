/**
 * KnoSlides Types
 * 
 * Central export for all type definitions.
 */

// Shared types
export type { Feedback } from './templates';

// Unified schema types (the main architecture)
export type {
  // Slot system
  SlotName,
  LayoutType,
  LayoutConfig,
  
  // Block types
  BlockType,
  VisibilityCondition,
  ContentBlock,
  
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
  ContextCardBlock,
  TaskListBlock,
  HintLadderBlock,
  CalloutBlock,
  TextBlockBlock,
  RichTextBlock,
  TextAndCodeBlockBlock,
  MediaBlock,
  ReferencePanelBlock,
  TableViewBlock,
  OutputPreviewBlock,
  DragAndDropBlock,
  SelectGroupBlock,
  ToggleGroupBlock,
  FlowDiagramBlock,
  CodeCompareBlock,
  ErrorListBlock,
  TypedContentBlock,
} from './unified-schema';

// Event system
export * from './events';
