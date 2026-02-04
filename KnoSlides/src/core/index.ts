/**
 * KnoSlides Core Module
 * 
 * The core rendering infrastructure for KnoSlides:
 * - SlideRenderer: Main orchestrator component
 * - SlotResolver: Layout and slot management
 * - BlockRegistry: Content block registration
 * - SlideEventContext: Inter-block event communication
 * - SlideStateContext: State management for steps and tasks
 */

// Main renderer
export { SlideRenderer, type SlideRendererProps } from './SlideRenderer';

// Slot system
export { SlotResolver, type SlotResolverProps } from './SlotResolver';

// Block registry
export {
  BlockRegistry,
  BlockRegistryProvider,
  BlockRenderer,
  useBlockRegistry,
  useRenderBlock,
  defaultRegistry,
  type BlockComponentProps,
  type BlockComponent,
  type BlockRegistryMap,
  type ConfigForBlockType,
} from './BlockRegistry';

// Event system
export {
  SlideEventProvider,
  useSlideEvents,
  useEventEmitter,
  useEventSubscription,
  useEventSubscriptions,
  useLastEvent,
} from './SlideEventContext';

// State management
export {
  SlideStateProvider,
  useSlideState,
  useCurrentStep,
  useTaskState,
  useHints,
  type TaskState,
  type StepState,
  type SlideState,
} from './SlideStateContext';
