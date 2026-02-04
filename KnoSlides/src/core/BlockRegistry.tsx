/**
 * BlockRegistry
 * 
 * Registry that maps block types to their React components.
 * Provides a way to render content blocks by type.
 */

import React, { createContext, useContext, useMemo } from 'react';
import type {
  BlockType,
  ContentBlock,
  ContextCardConfig,
  TaskListConfig,
  HintLadderConfig,
  CalloutConfig,
  TextBlockConfig,
  RichTextConfig,
  TextAndCodeBlockConfig,
  MediaConfig,
  ReferencePanelConfig,
  TableViewConfig,
  OutputPreviewConfig,
  DragAndDropConfig,
  SelectGroupConfig,
  ToggleGroupConfig,
  FlowDiagramConfig,
  CodeCompareConfig,
  ErrorListConfig,
} from '../types/unified-schema';

// =============================================================================
// BLOCK COMPONENT INTERFACE
// =============================================================================

/**
 * Props that every block component receives
 */
export interface BlockComponentProps<C = unknown> {
  /** Block ID */
  id: string;
  /** Block configuration */
  config: C;
  /** Optional style preset */
  stylePreset?: string;
  /** Optional additional className */
  className?: string;
}

/**
 * A registered block component
 */
export type BlockComponent<C = unknown> = React.ComponentType<BlockComponentProps<C>>;

/**
 * Registry map type (simplified for internal storage)
 */
export type BlockRegistryMap = Partial<Record<BlockType, BlockComponent<unknown>>>;

/**
 * Map of block types to their config types
 */
export interface BlockConfigMap {
  contextCard: ContextCardConfig;
  taskList: TaskListConfig;
  hintLadder: HintLadderConfig;
  callout: CalloutConfig;
  textBlock: TextBlockConfig;
  richText: RichTextConfig;
  textAndCodeBlock: TextAndCodeBlockConfig;
  media: MediaConfig;
  referencePanel: ReferencePanelConfig;
  tableView: TableViewConfig;
  outputPreview: OutputPreviewConfig;
  dragAndDrop: DragAndDropConfig;
  selectGroup: SelectGroupConfig;
  toggleGroup: ToggleGroupConfig;
  flowDiagram: FlowDiagramConfig;
  codeCompare: CodeCompareConfig;
  errorList: ErrorListConfig;
}

/**
 * Config type for each block type
 */
export type ConfigForBlockType<T extends BlockType> = T extends keyof BlockConfigMap 
  ? BlockConfigMap[T] 
  : unknown;

// =============================================================================
// DEFAULT PLACEHOLDER COMPONENT
// =============================================================================

/**
 * Placeholder component for unregistered block types
 */
const PlaceholderBlock: React.FC<BlockComponentProps> = ({ id, config }) => (
  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
    <p className="text-sm text-amber-700">
      Block type not registered: <code className="font-mono">{id}</code>
    </p>
    <pre className="mt-2 text-xs text-amber-600 overflow-auto">
      {JSON.stringify(config, null, 2)}
    </pre>
  </div>
);

// =============================================================================
// REGISTRY CLASS
// =============================================================================

/**
 * Block registry class
 */
export class BlockRegistry {
  private blocks: BlockRegistryMap = {};

  /**
   * Register a block component
   */
  register<T extends BlockType>(
    type: T,
    component: BlockComponent<ConfigForBlockType<T>>
  ): void {
    this.blocks[type] = component as BlockComponent;
  }

  /**
   * Register multiple blocks at once
   */
  registerAll(blocks: Partial<BlockRegistryMap>): void {
    Object.entries(blocks).forEach(([type, component]) => {
      if (component) {
        this.blocks[type as BlockType] = component;
      }
    });
  }

  /**
   * Get a block component by type
   */
  get<T extends BlockType>(type: T): BlockComponent<ConfigForBlockType<T>> | undefined {
    return this.blocks[type] as BlockComponent<ConfigForBlockType<T>> | undefined;
  }

  /**
   * Check if a block type is registered
   */
  has(type: BlockType): boolean {
    return type in this.blocks;
  }

  /**
   * Get all registered block types
   */
  getRegisteredTypes(): BlockType[] {
    return Object.keys(this.blocks) as BlockType[];
  }

  /**
   * Render a content block
   */
  render(block: ContentBlock, additionalProps?: Record<string, unknown>): React.ReactNode {
    const Component = this.get(block.type) || PlaceholderBlock;
    
    return (
      <Component
        key={block.id}
        id={block.id}
        config={block.config}
        stylePreset={block.stylePreset}
        {...additionalProps}
      />
    );
  }
}

// =============================================================================
// DEFAULT REGISTRY INSTANCE
// =============================================================================

/**
 * Default global registry instance
 */
export const defaultRegistry = new BlockRegistry();

// =============================================================================
// REACT CONTEXT
// =============================================================================

const BlockRegistryContext = createContext<BlockRegistry>(defaultRegistry);

/**
 * Provider to supply a block registry to the component tree
 */
export interface BlockRegistryProviderProps {
  registry?: BlockRegistry;
  children: React.ReactNode;
}

export const BlockRegistryProvider: React.FC<BlockRegistryProviderProps> = ({
  registry = defaultRegistry,
  children,
}) => {
  return (
    <BlockRegistryContext.Provider value={registry}>
      {children}
    </BlockRegistryContext.Provider>
  );
};

/**
 * Hook to access the block registry
 */
export function useBlockRegistry(): BlockRegistry {
  return useContext(BlockRegistryContext);
}

/**
 * Hook to render a block using the registry
 */
export function useRenderBlock() {
  const registry = useBlockRegistry();
  
  return useMemo(() => ({
    render: (block: ContentBlock, additionalProps?: Record<string, unknown>) => 
      registry.render(block, additionalProps),
    has: (type: BlockType) => registry.has(type),
  }), [registry]);
}

// =============================================================================
// BLOCK RENDERER COMPONENT
// =============================================================================

/**
 * Component that renders a content block using the registry
 */
export interface BlockRendererProps {
  block: ContentBlock;
  className?: string;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ block, className }) => {
  const registry = useBlockRegistry();
  const Component = registry.get(block.type) || PlaceholderBlock;
  
  return (
    <Component
      id={block.id}
      config={block.config}
      stylePreset={block.stylePreset}
      className={className}
    />
  );
};

export default BlockRegistry;
