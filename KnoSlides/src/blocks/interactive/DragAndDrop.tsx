/**
 * DragAndDrop Block
 * 
 * Interactive drag-and-drop for building queries, ordering, and matching.
 * Emits events for task validation.
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useDraggable,
  useDroppable,
  closestCenter,
} from '@dnd-kit/core';
import type { BlockComponentProps } from '../../core/BlockRegistry';
import type { DragAndDropConfig, DragItem, DropZone } from '../../types/unified-schema';
import { useSlideEvents } from '../../core/SlideEventContext';
import { createEvent } from '../../types/events';

// =============================================================================
// DRAGGABLE ITEM COMPONENT
// =============================================================================

interface DraggableItemProps {
  item: DragItem;
  isDisabled?: boolean;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ item, isDisabled }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: item.id,
    disabled: isDisabled,
  });

  return (
    <motion.div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`
        px-4 py-2.5 rounded-lg border-2 text-sm font-mono font-medium
        transition-all duration-200 select-none
        ${isDragging 
          ? 'opacity-50 border-dashed border-indigo-300 bg-indigo-50' 
          : isDisabled
            ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
            : 'border-indigo-200 bg-white hover:border-indigo-400 hover:shadow-md cursor-grab active:cursor-grabbing'
        }
      `}
      whileHover={!isDisabled && !isDragging ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
    >
      {item.content}
    </motion.div>
  );
};

// =============================================================================
// DROP ZONE COMPONENT
// =============================================================================

interface DropZoneComponentProps {
  zone: DropZone;
  currentItem?: DragItem;
  isHighlighted?: boolean;
}

const DropZoneComponent: React.FC<DropZoneComponentProps> = ({ zone, currentItem, isHighlighted }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: zone.id,
  });

  return (
    <motion.div
      ref={setNodeRef}
      className={`
        relative min-w-[120px] px-4 py-2.5 rounded-lg border-2 border-dashed
        transition-all duration-200 text-sm font-mono
        ${isOver 
          ? 'border-indigo-500 bg-indigo-100 scale-105' 
          : currentItem
            ? 'border-emerald-400 bg-emerald-50 text-emerald-800'
            : isHighlighted
              ? 'border-amber-400 bg-amber-50'
              : 'border-gray-300 bg-gray-50 text-gray-400'
        }
      `}
      animate={isHighlighted && !currentItem ? { scale: [1, 1.02, 1] } : {}}
      transition={{ duration: 1, repeat: Infinity }}
    >
      {currentItem ? (
        <span className="font-medium">{currentItem.content}</span>
      ) : (
        <span className="italic">{zone.placeholder || zone.label}</span>
      )}
      {zone.label && !currentItem && (
        <span className="absolute -top-2 left-2 px-1 bg-white text-xs text-gray-500">
          {zone.label}
        </span>
      )}
    </motion.div>
  );
};

// =============================================================================
// MAIN DRAG AND DROP BLOCK
// =============================================================================

export const DragAndDrop: React.FC<BlockComponentProps<DragAndDropConfig>> = ({
  id,
  config,
  stylePreset,
  className = '',
}) => {
  const { items, zones, layout = 'horizontal', validation = 'immediate', feedback } = config;
  const eventBus = useSlideEvents();

  // Track which items are placed in which zones
  const [placements, setPlacements] = useState<Record<string, string | null>>({});
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [validationResults, setValidationResults] = useState<Record<string, boolean>>({});

  // Handle drag start
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const itemId = event.active.id as string;
    setActiveDragId(itemId);
    
    const item = items.find(i => i.id === itemId);
    if (item) {
      eventBus.emit(createEvent('drag_start', id, {
        itemId,
        itemContent: item.content,
      }));
    }
  }, [id, items, eventBus]);

  // Handle drag end
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragId(null);

    const itemId = active.id as string;
    const item = items.find(i => i.id === itemId);
    
    if (!over || !item) {
      eventBus.emit(createEvent('drag_end', id, {
        itemId,
        dropped: false,
      }));
      return;
    }

    const zoneId = over.id as string;
    const zone = zones.find(z => z.id === zoneId);
    
    if (!zone) {
      eventBus.emit(createEvent('drag_end', id, {
        itemId,
        dropped: false,
      }));
      return;
    }

    // Check if item can be dropped here
    const isValidTarget = !item.validTargets || item.validTargets.includes(zoneId);
    
    if (!isValidTarget) {
      // Invalid drop
      eventBus.emit(createEvent('drop', id, {
        itemId,
        zoneId,
        isValid: false,
      }));
      
      if (validation === 'immediate') {
        setValidationResults(prev => ({ ...prev, [zoneId]: false }));
        setTimeout(() => {
          setValidationResults(prev => {
            const next = { ...prev };
            delete next[zoneId];
            return next;
          });
        }, 1500);
      }
      return;
    }

    // Valid drop - update placements
    setPlacements(prev => {
      // Remove item from any previous zone
      const newPlacements: Record<string, string | null> = {};
      Object.entries(prev).forEach(([z, i]) => {
        if (i !== itemId) {
          newPlacements[z] = i;
        }
      });
      // Place in new zone
      newPlacements[zoneId] = itemId;
      return newPlacements;
    });

    // Check if this is the expected item for this zone
    const isCorrect = zone.expectedItemId === itemId;
    
    eventBus.emit(createEvent('drop', id, {
      itemId,
      zoneId,
      isValid: true,
    }));

    if (validation === 'immediate') {
      setValidationResults(prev => ({ ...prev, [zoneId]: isCorrect }));
      
      // Check if all zones are correctly filled
      const newPlacements = { ...placements, [zoneId]: itemId };
      const allCorrect = zones.every(z => {
        const placedItemId = newPlacements[z.id];
        return placedItemId && z.expectedItemId === placedItemId;
      });
      
      if (allCorrect) {
        eventBus.emit(createEvent('validation_result', id, {
          isCorrect: true,
          message: feedback?.correct || 'All items placed correctly!',
        }));
      }
    }
  }, [id, items, zones, validation, placements, feedback, eventBus]);

  // Get the currently dragged item
  const draggedItem = activeDragId ? items.find(i => i.id === activeDragId) : null;

  // Get placed item IDs
  const placedItemIds = Object.values(placements).filter(Boolean) as string[];

  // Layout styles
  const layoutStyles = {
    horizontal: 'flex flex-wrap gap-2',
    vertical: 'flex flex-col gap-2',
    grid: 'grid grid-cols-2 md:grid-cols-3 gap-2',
    inline: 'flex flex-wrap items-center gap-2',
  };

  return (
    <div
      id={id}
      className={`
        bg-white rounded-xl border border-slate-200 overflow-hidden
        ${className}
      `}
    >
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCenter}
      >
        {/* Available items */}
        <div className="p-4 border-b border-slate-100">
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">
            Available pieces
          </p>
          <div className={layoutStyles[layout]}>
            {items.map(item => (
              <DraggableItem
                key={item.id}
                item={item}
                isDisabled={placedItemIds.includes(item.id)}
              />
            ))}
          </div>
        </div>

        {/* Drop zones */}
        <div className="p-4 bg-slate-50">
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">
            Build here
          </p>
          <div className={`${layout === 'inline' ? 'flex flex-wrap items-center gap-2 font-mono text-sm' : layoutStyles[layout]}`}>
            {zones.map((zone, idx) => {
              const placedItemId = placements[zone.id];
              const placedItem = placedItemId ? items.find(i => i.id === placedItemId) : undefined;
              const validationResult = validationResults[zone.id];
              
              return (
                <React.Fragment key={zone.id}>
                  <div className="relative">
                    <DropZoneComponent
                      zone={zone}
                      currentItem={placedItem}
                    />
                    {validationResult !== undefined && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`
                          absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center
                          ${validationResult ? 'bg-emerald-500' : 'bg-red-500'}
                        `}
                      >
                        {validationResult ? (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </motion.div>
                    )}
                  </div>
                  {layout === 'inline' && idx < zones.length - 1 && (
                    <span className="text-slate-400">{' '}</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Drag overlay */}
        <DragOverlay>
          {draggedItem && (
            <div className="px-4 py-2.5 rounded-lg border-2 border-indigo-400 bg-indigo-100 text-sm font-mono font-medium shadow-lg">
              {draggedItem.content}
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default DragAndDrop;
