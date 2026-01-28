/**
 * KnoSlides Template Types
 * 
 * Type definitions for template data schemas.
 */

// =============================================================================
// COMMON TYPES
// =============================================================================

export interface BaseTemplateProps {
  /** Unique identifier for the template instance */
  id?: string;
  /** Additional CSS classes */
  className?: string;
}

// =============================================================================
// RELATIONSHIP MAP
// =============================================================================

export interface RelationshipMapNode {
  id: string;
  label: string;
  description?: string;
  detail?: string;
  icon?: string;
  color?: string;
  connectsTo?: string[];
}

export interface RelationshipMapData {
  title?: string;
  centralNode: RelationshipMapNode;
  connectedNodes: RelationshipMapNode[];
  layout?: 'radial' | 'hierarchical' | 'force';
  showLabelsOnLoad?: boolean;
}

export interface RelationshipMapProps extends BaseTemplateProps {
  data: RelationshipMapData;
}

// =============================================================================
// LAYERED DEEP DIVE
// =============================================================================

export interface LayerContent {
  summary?: string;
  points?: Array<{
    text: string;
    tooltip?: string;
  }>;
}

export interface Layer {
  id: string;
  label: string;
  depthLabel?: string;
  content: string | LayerContent;
  icon?: string;
  lottieOnReveal?: string;
}

export interface LayeredDeepDiveData {
  title: string;
  subtitle?: string;
  layers: Layer[];
  initiallyExpanded?: number;
}

export interface LayeredDeepDiveProps extends BaseTemplateProps {
  data: LayeredDeepDiveData;
}

// =============================================================================
// SCENARIO SANDBOX
// =============================================================================

export interface ScenarioVariable {
  id: string;
  label: string;
  description?: string;
  type: 'toggle' | 'select' | 'slider';
  options: Array<{
    value: string;
    label: string;
  }>;
  default?: string;
}

export interface ScenarioOutcome {
  condition: Record<string, string>;
  result: {
    title: string;
    description: string;
    consequences?: string[];
    insight?: string;
    tone?: 'positive' | 'negative' | 'neutral' | 'warning';
  };
}

export interface ScenarioSandboxData {
  title: string;
  situation: {
    description: string;
    context?: string;
    image?: string;
    highlights?: string[];
  };
  variables: ScenarioVariable[];
  outcomes: ScenarioOutcome[];
  defaultOutcome?: ScenarioOutcome['result'];
}

export interface ScenarioSandboxProps extends BaseTemplateProps {
  data: ScenarioSandboxData;
}

// =============================================================================
// ANATOMY EXPLORER
// =============================================================================

export interface AnatomyPart {
  id: string;
  label: string;
  shortLabel?: string;
  icon?: string;
  color?: string;
  isCore?: boolean;
  detail?: {
    purpose?: string;
    howItWorks?: string;
    keyInsight?: string;
    connectedParts?: string[];
  };
  position?: {
    row?: number;
    column?: number;
  };
}

export interface AnatomyConnection {
  from: string;
  to: string;
  label?: string;
  style?: 'solid' | 'dashed' | 'dotted';
}

export interface AnatomyExplorerData {
  title: string;
  subtitle?: string;
  diagramLayout?: 'radial' | 'hierarchical' | 'linear' | 'grid';
  parts: AnatomyPart[];
  connections?: AnatomyConnection[];
  completionMessage?: string;
}

export interface AnatomyExplorerProps extends BaseTemplateProps {
  data: AnatomyExplorerData;
}
