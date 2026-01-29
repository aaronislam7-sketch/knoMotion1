/**
 * useTemplateState Hook
 * 
 * Manages interactive state for templates (expanded items, selections, etc.)
 * Resets on unmount (no persistence).
 */

import { useState, useCallback } from 'react';

export interface TemplateState<T = any> {
  /** Currently expanded item IDs */
  expandedIds: Set<string>;
  /** Currently selected item ID */
  selectedId: string | null;
  /** Custom state data */
  data: T;
  /** Progress tracking */
  progress: {
    visited: Set<string>;
    completed: Set<string>;
  };
}

export interface TemplateStateActions {
  /** Toggle an item's expanded state */
  toggleExpanded: (id: string) => void;
  /** Set a specific item as expanded */
  setExpanded: (id: string, expanded: boolean) => void;
  /** Expand all items */
  expandAll: (ids: string[]) => void;
  /** Collapse all items */
  collapseAll: () => void;
  /** Select an item */
  select: (id: string | null) => void;
  /** Mark an item as visited */
  markVisited: (id: string) => void;
  /** Mark an item as completed */
  markCompleted: (id: string) => void;
  /** Update custom data */
  updateData: (data: Partial<any>) => void;
  /** Reset all state */
  reset: () => void;
}

export interface UseTemplateStateReturn<T = any> extends TemplateState<T>, TemplateStateActions {
  /** Check if an item is expanded */
  isExpanded: (id: string) => boolean;
  /** Check if an item is selected */
  isSelected: (id: string) => boolean;
  /** Check if an item has been visited */
  isVisited: (id: string) => boolean;
  /** Check if an item is completed */
  isCompleted: (id: string) => boolean;
  /** Get progress percentage */
  getProgressPercent: (totalIds: string[]) => number;
}

export const useTemplateState = <T = any>(
  initialData: T = {} as T
): UseTemplateStateReturn<T> => {
  const [state, setState] = useState<TemplateState<T>>({
    expandedIds: new Set(),
    selectedId: null,
    data: initialData,
    progress: {
      visited: new Set(),
      completed: new Set(),
    },
  });

  // Actions
  const toggleExpanded = useCallback((id: string) => {
    setState((prev) => {
      const newExpanded = new Set(prev.expandedIds);
      if (newExpanded.has(id)) {
        newExpanded.delete(id);
      } else {
        newExpanded.add(id);
      }
      return { ...prev, expandedIds: newExpanded };
    });
  }, []);

  const setExpanded = useCallback((id: string, expanded: boolean) => {
    setState((prev) => {
      const newExpanded = new Set(prev.expandedIds);
      if (expanded) {
        newExpanded.add(id);
      } else {
        newExpanded.delete(id);
      }
      return { ...prev, expandedIds: newExpanded };
    });
  }, []);

  const expandAll = useCallback((ids: string[]) => {
    setState((prev) => ({
      ...prev,
      expandedIds: new Set(ids),
    }));
  }, []);

  const collapseAll = useCallback(() => {
    setState((prev) => ({
      ...prev,
      expandedIds: new Set(),
    }));
  }, []);

  const select = useCallback((id: string | null) => {
    setState((prev) => ({ ...prev, selectedId: id }));
  }, []);

  const markVisited = useCallback((id: string) => {
    setState((prev) => {
      const newVisited = new Set(prev.progress.visited);
      newVisited.add(id);
      return {
        ...prev,
        progress: { ...prev.progress, visited: newVisited },
      };
    });
  }, []);

  const markCompleted = useCallback((id: string) => {
    setState((prev) => {
      const newCompleted = new Set(prev.progress.completed);
      newCompleted.add(id);
      return {
        ...prev,
        progress: { ...prev.progress, completed: newCompleted },
      };
    });
  }, []);

  const updateData = useCallback((data: Partial<T>) => {
    setState((prev) => ({
      ...prev,
      data: { ...prev.data, ...data },
    }));
  }, []);

  const reset = useCallback(() => {
    setState({
      expandedIds: new Set(),
      selectedId: null,
      data: initialData,
      progress: {
        visited: new Set(),
        completed: new Set(),
      },
    });
  }, [initialData]);

  // Queries
  const isExpanded = useCallback(
    (id: string) => state.expandedIds.has(id),
    [state.expandedIds]
  );

  const isSelected = useCallback(
    (id: string) => state.selectedId === id,
    [state.selectedId]
  );

  const isVisited = useCallback(
    (id: string) => state.progress.visited.has(id),
    [state.progress.visited]
  );

  const isCompleted = useCallback(
    (id: string) => state.progress.completed.has(id),
    [state.progress.completed]
  );

  const getProgressPercent = useCallback(
    (totalIds: string[]) => {
      if (totalIds.length === 0) return 0;
      return (state.progress.visited.size / totalIds.length) * 100;
    },
    [state.progress.visited]
  );

  return {
    ...state,
    toggleExpanded,
    setExpanded,
    expandAll,
    collapseAll,
    select,
    markVisited,
    markCompleted,
    updateData,
    reset,
    isExpanded,
    isSelected,
    isVisited,
    isCompleted,
    getProgressPercent,
  };
};

export default useTemplateState;
