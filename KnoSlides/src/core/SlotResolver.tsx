/**
 * SlotResolver
 * 
 * Resolves named slots into layout regions and renders their content blocks.
 * Handles visibility conditions and slot arrangement based on layout type.
 */

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type {
  SlotName,
  LayoutConfig,
  ContentBlock,
  StepSlots,
  VisibilityCondition,
} from '../types/unified-schema';
import { BlockRenderer } from './BlockRegistry';
import { useSlideState } from './SlideStateContext';

// =============================================================================
// VISIBILITY EVALUATION
// =============================================================================

/**
 * Evaluate a visibility condition against current state
 */
function evaluateCondition(
  condition: VisibilityCondition,
  state: Record<string, unknown>
): boolean {
  const fieldValue = state[condition.field];
  
  let result = true;
  
  switch (condition.operator) {
    case 'equals':
      result = fieldValue === condition.value;
      break;
    case 'notEquals':
      result = fieldValue !== condition.value;
      break;
    case 'gt':
      result = typeof fieldValue === 'number' && fieldValue > (condition.value as number);
      break;
    case 'gte':
      result = typeof fieldValue === 'number' && fieldValue >= (condition.value as number);
      break;
    case 'lt':
      result = typeof fieldValue === 'number' && fieldValue < (condition.value as number);
      break;
    case 'lte':
      result = typeof fieldValue === 'number' && fieldValue <= (condition.value as number);
      break;
    case 'includes':
      if (Array.isArray(fieldValue)) {
        result = fieldValue.includes(condition.value);
      } else if (typeof fieldValue === 'string') {
        result = fieldValue.includes(String(condition.value));
      }
      break;
    case 'notIncludes':
      if (Array.isArray(fieldValue)) {
        result = !fieldValue.includes(condition.value);
      } else if (typeof fieldValue === 'string') {
        result = !fieldValue.includes(String(condition.value));
      }
      break;
    case 'isEmpty':
      result = fieldValue === null || fieldValue === undefined || 
               (Array.isArray(fieldValue) && fieldValue.length === 0) ||
               (typeof fieldValue === 'string' && fieldValue === '');
      break;
    case 'isNotEmpty':
      result = fieldValue !== null && fieldValue !== undefined &&
               !(Array.isArray(fieldValue) && fieldValue.length === 0) &&
               !(typeof fieldValue === 'string' && fieldValue === '');
      break;
  }
  
  // Handle AND conditions
  if (condition.and && result) {
    result = condition.and.every(c => evaluateCondition(c, state));
  }
  
  // Handle OR conditions
  if (condition.or && !result) {
    result = condition.or.some(c => evaluateCondition(c, state));
  }
  
  return result;
}

/**
 * Check if a block should be visible based on its visibleWhen condition
 */
function isBlockVisible(
  block: ContentBlock,
  state: Record<string, unknown>
): boolean {
  if (!block.visibleWhen) return true;
  return evaluateCondition(block.visibleWhen, state);
}

// =============================================================================
// SLOT COMPONENT
// =============================================================================

interface SlotProps {
  name: SlotName;
  blocks: ContentBlock[];
  className?: string;
}

const Slot: React.FC<SlotProps> = ({ name, blocks, className = '' }) => {
  const { state, currentStepState } = useSlideState();
  
  // Build state object for visibility evaluation
  const visibilityState = useMemo(() => ({
    phase: state.currentStepIndex,
    stepIndex: state.currentStepIndex,
    isComplete: state.isComplete,
    hintsRevealed: currentStepState.hintsRevealed,
    ...Object.entries(currentStepState.tasks).reduce((acc, [taskId, taskState]) => {
      acc[`task_${taskId}_complete`] = taskState.status === 'completed';
      acc[`task_${taskId}_status`] = taskState.status;
      return acc;
    }, {} as Record<string, unknown>),
  }), [state, currentStepState]);
  
  // Filter visible blocks
  const visibleBlocks = blocks.filter(block => isBlockVisible(block, visibilityState));
  
  if (visibleBlocks.length === 0) return null;
  
  return (
    <div 
      className={`slot slot-${name.toLowerCase().replace('slot', '')} kno-slot-frame min-w-0 ${className}`}
      data-slot={name}
    >
      <AnimatePresence mode="sync">
        {visibleBlocks.map((block, index) => (
          <motion.div
            key={block.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: index * 0.05 }}
            className="slot-block min-w-0"
          >
            <BlockRenderer block={block} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// =============================================================================
// LAYOUT COMPONENTS
// =============================================================================

interface LayoutProps {
  slots: StepSlots;
  activeSlots: SlotName[];
  className?: string;
}

/**
 * Column split layout (left guidance, right workspace)
 * This is the recommended canonical layout
 */
const ColumnSplitLayout: React.FC<LayoutProps> = ({ slots, activeSlots, className = '' }) => {
  const hasLeftContent = activeSlots.some(s => ['OverviewSlot', 'TaskSlot'].includes(s));
  const hasRightContent = activeSlots.some(s => ['WorkspaceSlot', 'ReferenceSlot', 'OutputSlot'].includes(s));
  
  return (
    <div className={`grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6 xl:gap-7 items-start min-w-0 ${className}`}>
      {/* Left column - Guidance */}
      {hasLeftContent && (
        <div className="xl:col-span-4 space-y-4 lg:space-y-5 min-w-0">
          {slots.OverviewSlot && (
            <Slot name="OverviewSlot" blocks={slots.OverviewSlot} />
          )}
          {slots.TaskSlot && (
            <Slot name="TaskSlot" blocks={slots.TaskSlot} />
          )}
        </div>
      )}
      
      {/* Right column - Workspace */}
      {hasRightContent && (
        <div className={`${hasLeftContent ? 'xl:col-span-8' : 'xl:col-span-12'} space-y-4 lg:space-y-5 min-w-0`}>
          {slots.WorkspaceSlot && (
            <Slot name="WorkspaceSlot" blocks={slots.WorkspaceSlot} />
          )}
          {slots.ReferenceSlot && (
            <Slot name="ReferenceSlot" blocks={slots.ReferenceSlot} />
          )}
          {slots.OutputSlot && (
            <Slot name="OutputSlot" blocks={slots.OutputSlot} />
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Row stack layout (vertical stacking)
 */
const RowStackLayout: React.FC<LayoutProps> = ({ slots, activeSlots, className = '' }) => {
  return (
    <div className={`space-y-4 lg:space-y-5 min-w-0 ${className}`}>
      {slots.OverviewSlot && (
        <Slot name="OverviewSlot" blocks={slots.OverviewSlot} />
      )}
      {slots.TaskSlot && (
        <Slot name="TaskSlot" blocks={slots.TaskSlot} />
      )}
      {slots.WorkspaceSlot && (
        <Slot name="WorkspaceSlot" blocks={slots.WorkspaceSlot} />
      )}
      {slots.ReferenceSlot && (
        <Slot name="ReferenceSlot" blocks={slots.ReferenceSlot} />
      )}
      {slots.OutputSlot && (
        <Slot name="OutputSlot" blocks={slots.OutputSlot} />
      )}
    </div>
  );
};

/**
 * Grid slots layout (flexible grid)
 */
const GridSlotsLayout: React.FC<LayoutProps> = ({ slots, activeSlots, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4 lg:gap-6 min-w-0 ${className}`}>
      {slots.OverviewSlot && (
        <div className="md:col-span-1 xl:col-span-4 min-w-0">
          <Slot name="OverviewSlot" blocks={slots.OverviewSlot} />
        </div>
      )}
      {slots.TaskSlot && (
        <div className="md:col-span-1 xl:col-span-4 min-w-0">
          <Slot name="TaskSlot" blocks={slots.TaskSlot} />
        </div>
      )}
      {slots.WorkspaceSlot && (
        <div className="md:col-span-2 xl:col-span-8 min-w-0">
          <Slot name="WorkspaceSlot" blocks={slots.WorkspaceSlot} />
        </div>
      )}
      {slots.ReferenceSlot && (
        <div className="md:col-span-1 xl:col-span-6 min-w-0">
          <Slot name="ReferenceSlot" blocks={slots.ReferenceSlot} />
        </div>
      )}
      {slots.OutputSlot && (
        <div className="md:col-span-2 xl:col-span-6 min-w-0">
          <Slot name="OutputSlot" blocks={slots.OutputSlot} />
        </div>
      )}
    </div>
  );
};

/**
 * Full width layout (single column, full width)
 */
const FullLayout: React.FC<LayoutProps> = ({ slots, activeSlots, className = '' }) => {
  return (
    <div className={`space-y-4 lg:space-y-5 min-w-0 ${className}`}>
      {slots.OverviewSlot && (
        <Slot name="OverviewSlot" blocks={slots.OverviewSlot} className="max-w-4xl mx-auto" />
      )}
      {slots.TaskSlot && (
        <Slot name="TaskSlot" blocks={slots.TaskSlot} className="max-w-4xl mx-auto" />
      )}
      {slots.WorkspaceSlot && (
        <Slot name="WorkspaceSlot" blocks={slots.WorkspaceSlot} />
      )}
      {slots.ReferenceSlot && (
        <Slot name="ReferenceSlot" blocks={slots.ReferenceSlot} />
      )}
      {slots.OutputSlot && (
        <Slot name="OutputSlot" blocks={slots.OutputSlot} />
      )}
    </div>
  );
};

// =============================================================================
// SLOT RESOLVER COMPONENT
// =============================================================================

export interface SlotResolverProps {
  layout: LayoutConfig;
  slots: StepSlots;
  className?: string;
}

/**
 * Main slot resolver component
 * Takes layout config and step slots, renders appropriate layout
 */
export const SlotResolver: React.FC<SlotResolverProps> = ({
  layout,
  slots,
  className = '',
}) => {
  // Determine which slots have content
  const activeSlots = useMemo(() => {
    return layout.slots.filter(slotName => {
      const slotBlocks = slots[slotName];
      return slotBlocks && slotBlocks.length > 0;
    });
  }, [layout.slots, slots]);
  
  // Select layout component based on type
  const LayoutComponent = useMemo(() => {
    switch (layout.type) {
      case 'columnSplit':
        return ColumnSplitLayout;
      case 'rowStack':
        return RowStackLayout;
      case 'gridSlots':
        return GridSlotsLayout;
      case 'full':
        return FullLayout;
      default:
        return ColumnSplitLayout;
    }
  }, [layout.type]);
  
  return (
    <LayoutComponent
      slots={slots}
      activeSlots={activeSlots}
      className={className}
    />
  );
};

export default SlotResolver;
