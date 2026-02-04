/**
 * KnoSlides Types
 */

// Legacy template types (will be deprecated after migration)
export * from './templates';

// Unified schema types (new architecture)
// Note: Some types are intentionally aliased to avoid conflicts with legacy types
export {
  // Slot system
  type SlotName,
  type LayoutType,
  type LayoutConfig,
  
  // Block types
  type BlockType,
  type VisibilityCondition,
  type ContentBlock,
  
  // Block configs
  type ContextCardConfig,
  type TaskListConfig,
  type HintLadderConfig,
  type CalloutConfig,
  type TextBlockConfig,
  type RichTextConfig,
  type TextAndCodeBlockConfig,
  type MediaConfig,
  type ReferencePanelConfig,
  type TableColumn,
  type TableViewConfig,
  type OutputPreviewConfig,
  type DragItem,
  type DragAndDropConfig,
  type SelectGroupConfig,
  type ToggleItem,
  type ToggleGroupConfig,
  type FlowDiagramConfig,
  type CodeCompareConfig,
  type ErrorItem,
  type ErrorListConfig,
  
  // Task system
  type ActionType,
  type TaskAction,
  type Task,
  type TaskStatus,
  
  // Step system
  type Phase,
  type StepSlots,
  type Step as UnifiedStep,
  
  // Slide
  type Concept,
  type FeatureFlags,
  type KnoSlide,
  
  // Typed blocks
  type ContextCardBlock,
  type TaskListBlock,
  type HintLadderBlock,
  type CalloutBlock,
  type TextBlockBlock,
  type RichTextBlock,
  type TextAndCodeBlockBlock,
  type MediaBlock,
  type ReferencePanelBlock,
  type TableViewBlock,
  type OutputPreviewBlock,
  type DragAndDropBlock,
  type SelectGroupBlock,
  type ToggleGroupBlock,
  type FlowDiagramBlock,
  type CodeCompareBlock,
  type ErrorListBlock,
  type TypedContentBlock,
  
  // Renamed to avoid conflicts
  type Hint as UnifiedHint,
  type DropZone as UnifiedDropZone,
  type SelectOption as UnifiedSelectOption,
  type FlowNode as UnifiedFlowNode,
  type FlowEdge as UnifiedFlowEdge,
} from './unified-schema';

// Event system
export * from './events';
