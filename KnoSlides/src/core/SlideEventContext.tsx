/**
 * SlideEventContext
 * 
 * React Context that provides the event bus for block-to-renderer communication.
 * Blocks emit events; the task system and renderer subscribe to them.
 */

import React, { createContext, useContext, useCallback, useRef, useMemo } from 'react';
import type {
  SlideEventBus,
  AnySlideEvent,
  SlideEventType,
  EventHandler,
} from '../types/events';

// =============================================================================
// CONTEXT
// =============================================================================

const SlideEventContext = createContext<SlideEventBus | null>(null);

// =============================================================================
// PROVIDER
// =============================================================================

interface SlideEventProviderProps {
  children: React.ReactNode;
  /** Optional external event handler for logging/debugging */
  onEvent?: (event: AnySlideEvent) => void;
}

export const SlideEventProvider: React.FC<SlideEventProviderProps> = ({
  children,
  onEvent,
}) => {
  // Subscribers by event type
  const subscribersRef = useRef<Map<SlideEventType, Set<EventHandler>>>(new Map());
  
  // Global subscribers (listen to all events)
  const globalSubscribersRef = useRef<Set<EventHandler<AnySlideEvent>>>(new Set());
  
  // Last event by type (for state recovery)
  const lastEventsRef = useRef<Map<SlideEventType, AnySlideEvent>>(new Map());

  /**
   * Emit an event to all subscribers
   */
  const emit = useCallback(<E extends AnySlideEvent>(event: E) => {
    // Store as last event of this type
    lastEventsRef.current.set(event.type as SlideEventType, event);
    
    // Call external handler if provided
    onEvent?.(event);
    
    // Notify type-specific subscribers
    const typeSubscribers = subscribersRef.current.get(event.type as SlideEventType);
    if (typeSubscribers) {
      typeSubscribers.forEach(handler => {
        try {
          handler(event);
        } catch (error) {
          console.error(`Event handler error for ${event.type}:`, error);
        }
      });
    }
    
    // Notify global subscribers
    globalSubscribersRef.current.forEach(handler => {
      try {
        handler(event);
      } catch (error) {
        console.error('Global event handler error:', error);
      }
    });
  }, [onEvent]);

  /**
   * Subscribe to events of a specific type
   */
  const on = useCallback(<T extends SlideEventType>(
    type: T,
    handler: EventHandler<Extract<AnySlideEvent, { type: T }>>
  ): (() => void) => {
    if (!subscribersRef.current.has(type)) {
      subscribersRef.current.set(type, new Set());
    }
    
    const subscribers = subscribersRef.current.get(type)!;
    subscribers.add(handler as EventHandler);
    
    // Return unsubscribe function
    return () => {
      subscribers.delete(handler as EventHandler);
      if (subscribers.size === 0) {
        subscribersRef.current.delete(type);
      }
    };
  }, []);

  /**
   * Subscribe to all events
   */
  const onAny = useCallback((handler: EventHandler<AnySlideEvent>): (() => void) => {
    globalSubscribersRef.current.add(handler);
    
    return () => {
      globalSubscribersRef.current.delete(handler);
    };
  }, []);

  /**
   * Get the most recent event of a type
   */
  const getLastEvent = useCallback(<T extends SlideEventType>(
    type: T
  ): Extract<AnySlideEvent, { type: T }> | undefined => {
    return lastEventsRef.current.get(type) as Extract<AnySlideEvent, { type: T }> | undefined;
  }, []);

  const eventBus = useMemo<SlideEventBus>(() => ({
    emit,
    on,
    onAny,
    getLastEvent,
  }), [emit, on, onAny, getLastEvent]);

  return (
    <SlideEventContext.Provider value={eventBus}>
      {children}
    </SlideEventContext.Provider>
  );
};

// =============================================================================
// HOOKS
// =============================================================================

/**
 * Hook to access the event bus
 */
export function useSlideEvents(): SlideEventBus {
  const context = useContext(SlideEventContext);
  if (!context) {
    throw new Error('useSlideEvents must be used within a SlideEventProvider');
  }
  return context;
}

/**
 * Hook to emit events (convenience wrapper)
 */
export function useEventEmitter() {
  const { emit } = useSlideEvents();
  return emit;
}

/**
 * Hook to subscribe to a specific event type
 * Automatically cleans up on unmount
 */
export function useEventSubscription<T extends SlideEventType>(
  type: T,
  handler: EventHandler<Extract<AnySlideEvent, { type: T }>>,
  deps: React.DependencyList = []
) {
  const { on } = useSlideEvents();
  
  React.useEffect(() => {
    const unsubscribe = on(type, handler);
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, on, ...deps]);
}

/**
 * Hook to subscribe to multiple event types
 */
export function useEventSubscriptions(
  handlers: Partial<Record<SlideEventType, EventHandler>>,
  deps: React.DependencyList = []
) {
  const { on } = useSlideEvents();
  
  React.useEffect(() => {
    const unsubscribes: (() => void)[] = [];
    
    Object.entries(handlers).forEach(([type, handler]) => {
      if (handler) {
        unsubscribes.push(on(type as SlideEventType, handler as EventHandler));
      }
    });
    
    return () => {
      unsubscribes.forEach(unsub => unsub());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on, ...deps]);
}

/**
 * Hook that returns the last event of a type (reactive)
 */
export function useLastEvent<T extends SlideEventType>(type: T) {
  const { getLastEvent, on } = useSlideEvents();
  const [lastEvent, setLastEvent] = React.useState<Extract<AnySlideEvent, { type: T }> | undefined>(
    () => getLastEvent(type)
  );
  
  React.useEffect(() => {
    const unsubscribe = on(type, (event) => {
      setLastEvent(event);
    });
    return unsubscribe;
  }, [type, on]);
  
  return lastEvent;
}

export default SlideEventContext;
