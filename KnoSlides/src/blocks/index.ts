/**
 * KnoSlides Content Blocks
 * 
 * This module exports all content blocks and provides a function
 * to register them with the block registry.
 */

// Guidance blocks
export { ContextCard } from './guidance/ContextCard';
export { TaskList } from './guidance/TaskList';
export { HintLadder } from './guidance/HintLadder';
export { Callout } from './guidance/Callout';

// Content blocks
export { TextBlock } from './content/TextBlock';
export { TextAndCodeBlock } from './content/TextAndCodeBlock';
export { TableView } from './content/TableView';
export { OutputPreview } from './content/OutputPreview';
export { ReferencePanel } from './content/ReferencePanel';

// Interactive blocks
export { DragAndDrop } from './interactive/DragAndDrop';
export { ErrorList } from './interactive/ErrorList';
export { CodeCompare } from './interactive/CodeCompare';
export { FlowDiagram } from './interactive/FlowDiagram';

// Re-export from submodules
export * from './guidance';
export * from './content';
export * from './interactive';

// Import block registry
import { BlockRegistry, defaultRegistry } from '../core/BlockRegistry';

// Import all blocks
import { ContextCard } from './guidance/ContextCard';
import { TaskList } from './guidance/TaskList';
import { HintLadder } from './guidance/HintLadder';
import { Callout } from './guidance/Callout';
import { TextBlock } from './content/TextBlock';
import { TextAndCodeBlock } from './content/TextAndCodeBlock';
import { TableView } from './content/TableView';
import { OutputPreview } from './content/OutputPreview';
import { ReferencePanel } from './content/ReferencePanel';
import { DragAndDrop } from './interactive/DragAndDrop';
import { ErrorList } from './interactive/ErrorList';
import { CodeCompare } from './interactive/CodeCompare';
import { FlowDiagram } from './interactive/FlowDiagram';

/**
 * Register all core blocks with a registry
 */
export function registerCoreBlocks(registry: BlockRegistry = defaultRegistry): void {
  // Guidance blocks
  registry.register('contextCard', ContextCard);
  registry.register('taskList', TaskList);
  registry.register('hintLadder', HintLadder);
  registry.register('callout', Callout);
  
  // Content blocks
  registry.register('textBlock', TextBlock);
  registry.register('textAndCodeBlock', TextAndCodeBlock);
  registry.register('tableView', TableView);
  registry.register('outputPreview', OutputPreview);
  registry.register('referencePanel', ReferencePanel);
  
  // Interactive blocks
  registry.register('dragAndDrop', DragAndDrop);
  registry.register('errorList', ErrorList);
  registry.register('codeCompare', CodeCompare);
  registry.register('flowDiagram', FlowDiagram);
}

/**
 * Auto-register blocks with the default registry
 * Call this at app initialization
 */
export function initializeBlocks(): void {
  registerCoreBlocks(defaultRegistry);
}

// Auto-initialize on import (optional - can be disabled if manual init preferred)
// initializeBlocks();
