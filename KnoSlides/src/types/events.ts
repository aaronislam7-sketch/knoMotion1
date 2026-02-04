/**
 * KnoSlides Event System Types
 * 
 * Defines the event contract between content blocks and the slide renderer.
 * Blocks emit events; the task system listens for them to validate completion.
 */

import type { TaskStatus, ActionType } from './unified-schema';

// =============================================================================
// EVENT TYPES
// =============================================================================

/**
 * Base event structure - all events extend this
 */
export interface SlideEvent<T extends string = string, P = unknown> {
  /** Event type identifier */
  type: T;
  /** Source block ID that emitted this event */
  sourceId: string;
  /** Event payload */
  payload: P;
  /** Timestamp */
  timestamp: number;
}

// --- Drag and Drop Events ---

export interface DragStartPayload {
  itemId: string;
  itemContent: string;
}

export interface DropPayload {
  itemId: string;
  zoneId: string;
  isValid: boolean;
}

export interface DragEndPayload {
  itemId: string;
  dropped: boolean;
  zoneId?: string;
}

export type DragStartEvent = SlideEvent<'drag_start', DragStartPayload>;
export type DropEvent = SlideEvent<'drop', DropPayload>;
export type DragEndEvent = SlideEvent<'drag_end', DragEndPayload>;

// --- Selection Events ---

export interface SelectPayload {
  optionId: string;
  value: string;
  selected: boolean;
}

export interface SelectionChangePayload {
  selectedIds: string[];
  values: string[];
}

export type SelectEvent = SlideEvent<'select', SelectPayload>;
export type SelectionChangeEvent = SlideEvent<'selection_change', SelectionChangePayload>;

// --- Toggle Events ---

export interface TogglePayload {
  toggleId: string;
  value: boolean;
}

export interface ToggleGroupChangePayload {
  values: Record<string, boolean>;
}

export type ToggleEvent = SlideEvent<'toggle', TogglePayload>;
export type ToggleGroupChangeEvent = SlideEvent<'toggle_group_change', ToggleGroupChangePayload>;

// --- Input Events ---

export interface InputChangePayload {
  inputId: string;
  value: string;
  isValid?: boolean;
}

export interface InputSubmitPayload {
  inputId: string;
  value: string;
}

export type InputChangeEvent = SlideEvent<'input_change', InputChangePayload>;
export type InputSubmitEvent = SlideEvent<'input_submit', InputSubmitPayload>;

// --- Click/Inspect Events ---

export interface ClickPayload {
  targetId: string;
  targetType?: string;
}

export interface InspectPayload {
  targetId: string;
  data?: Record<string, unknown>;
}

export type ClickEvent = SlideEvent<'click', ClickPayload>;
export type InspectEvent = SlideEvent<'inspect', InspectPayload>;

// --- Flow Diagram Events ---

export interface NodeClickPayload {
  nodeId: string;
  nodeType: string;
}

export interface EdgeFollowPayload {
  edgeId: string;
  sourceId: string;
  targetId: string;
}

export interface ConditionChangePayload {
  conditionId: string;
  value: boolean | string | number;
}

export type NodeClickEvent = SlideEvent<'node_click', NodeClickPayload>;
export type EdgeFollowEvent = SlideEvent<'edge_follow', EdgeFollowPayload>;
export type ConditionChangeEvent = SlideEvent<'condition_change', ConditionChangePayload>;

// --- Code/Error Events ---

export interface ErrorSelectPayload {
  errorId: string;
  lineStart: number;
  lineEnd?: number;
}

export interface ErrorFixPayload {
  errorId: string;
  fixApplied: string;
}

export interface CodeEditPayload {
  code: string;
  language: string;
}

export type ErrorSelectEvent = SlideEvent<'error_select', ErrorSelectPayload>;
export type ErrorFixEvent = SlideEvent<'error_fix', ErrorFixPayload>;
export type CodeEditEvent = SlideEvent<'code_edit', CodeEditPayload>;

// --- Validation Events ---

export interface ValidationResultPayload {
  isCorrect: boolean;
  isPartial?: boolean;
  itemResults?: Record<string, boolean>;
  message?: string;
}

export type ValidationResultEvent = SlideEvent<'validation_result', ValidationResultPayload>;

// --- Reorder Events ---

export interface ReorderPayload {
  itemIds: string[];
  fromIndex: number;
  toIndex: number;
}

export type ReorderEvent = SlideEvent<'reorder', ReorderPayload>;

// --- Compare Events ---

export interface ComparePayload {
  leftValue: unknown;
  rightValue: unknown;
  areEqual: boolean;
}

export type CompareEvent = SlideEvent<'compare', ComparePayload>;

// --- Generic Custom Event ---

export interface CustomEventPayload {
  eventId: string;
  data: Record<string, unknown>;
}

export type CustomEvent = SlideEvent<'custom', CustomEventPayload>;

// =============================================================================
// EVENT UNION
// =============================================================================

/**
 * Union of all possible slide events
 */
export type AnySlideEvent =
  | DragStartEvent
  | DropEvent
  | DragEndEvent
  | SelectEvent
  | SelectionChangeEvent
  | ToggleEvent
  | ToggleGroupChangeEvent
  | InputChangeEvent
  | InputSubmitEvent
  | ClickEvent
  | InspectEvent
  | NodeClickEvent
  | EdgeFollowEvent
  | ConditionChangeEvent
  | ErrorSelectEvent
  | ErrorFixEvent
  | CodeEditEvent
  | ValidationResultEvent
  | ReorderEvent
  | CompareEvent
  | CustomEvent
  | TaskStateChangeEvent
  | StepCompleteEvent
  | HintRequestEvent;

/**
 * Event type string literals
 */
export type SlideEventType = AnySlideEvent['type'];

// =============================================================================
// EVENT HANDLERS
// =============================================================================

/**
 * Event handler function type
 */
export type EventHandler<E extends AnySlideEvent = AnySlideEvent> = (event: E) => void;

/**
 * Typed event handler map
 */
export type EventHandlerMap = {
  [K in SlideEventType]?: EventHandler<Extract<AnySlideEvent, { type: K }>>;
};

// =============================================================================
// TASK STATE EVENTS
// =============================================================================

/**
 * Task state change event (emitted by task system)
 */
export interface TaskStateChangePayload {
  taskId: string;
  previousStatus: TaskStatus;
  newStatus: TaskStatus;
  completedAt?: number;
}

export type TaskStateChangeEvent = SlideEvent<'task_state_change', TaskStateChangePayload>;

/**
 * Step completion event
 */
export interface StepCompletePayload {
  stepId: string;
  phase: string;
  tasksCompleted: string[];
}

export type StepCompleteEvent = SlideEvent<'step_complete', StepCompletePayload>;

/**
 * Hint request event
 */
export interface HintRequestPayload {
  stepId: string;
  currentLevel: number;
  requestedLevel: number;
}

export type HintRequestEvent = SlideEvent<'hint_request', HintRequestPayload>;

// =============================================================================
// EVENT BUS INTERFACE
// =============================================================================

/**
 * Event bus interface for the React Context
 */
export interface SlideEventBus {
  /**
   * Emit an event to all listeners
   */
  emit: <E extends AnySlideEvent>(event: E) => void;
  
  /**
   * Subscribe to events of a specific type
   * Returns unsubscribe function
   */
  on: <T extends SlideEventType>(
    type: T,
    handler: EventHandler<Extract<AnySlideEvent, { type: T }>>
  ) => () => void;
  
  /**
   * Subscribe to all events
   * Returns unsubscribe function
   */
  onAny: (handler: EventHandler<AnySlideEvent>) => () => void;
  
  /**
   * Get the most recent event of a type (for state recovery)
   */
  getLastEvent: <T extends SlideEventType>(
    type: T
  ) => Extract<AnySlideEvent, { type: T }> | undefined;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Create a typed event
 */
export function createEvent<T extends SlideEventType, P>(
  type: T,
  sourceId: string,
  payload: P
): SlideEvent<T, P> {
  return {
    type,
    sourceId,
    payload,
    timestamp: Date.now(),
  };
}

/**
 * Type guard for specific event types
 */
export function isEventType<T extends SlideEventType>(
  event: AnySlideEvent,
  type: T
): event is Extract<AnySlideEvent, { type: T }> {
  return event.type === type;
}

/**
 * Map action types to event types for task validation
 */
export const actionToEventMap: Record<ActionType, SlideEventType[]> = {
  click: ['click'],
  select: ['select', 'selection_change'],
  toggle: ['toggle', 'toggle_group_change'],
  drag: ['drag_start', 'drag_end'],
  drop: ['drop'],
  input: ['input_change', 'input_submit'],
  reorder: ['reorder'],
  inspect: ['inspect'],
  compare: ['compare'],
  event: ['custom'],
};
