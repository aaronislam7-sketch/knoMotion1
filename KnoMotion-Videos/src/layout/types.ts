export type LayerKind = 'text' | 'box' | 'image' | 'lottie' | 'doodle' | 'annotation' | 'connector';

export type Stage = { width: number; height: number };

export type LayoutConfig = {
  grid: number; // placement grid size
  minPad: number; // minimum clearance padding
  stroke: number; // average stroke width to account for
  maxNudges: number; // greedy nudge attempts per item
  allowFontShrink: boolean; // permit font shrink when necessary
  fontShrinkStep: number; // multiplicative step for font shrink (e.g., 0.92)
};

export type Rect = { x: number; y: number; w: number; h: number };

export type Point = { x: number; y: number };

export type Polyline = Point[];

export type LayerInput = {
  id: string;
  kind: LayerKind;
  role?: string;
  lock?: boolean;
  priority?: number; // 1..5, lower means moves first when resolving
  preferEdge?: boolean;
  minPad?: number;
  box?: { x?: number; y?: number; w?: number; h?: number; maxW?: number; maxH?: number };
  text?: string;
  font?: string;
  fontSize?: number;
  src?: string;
  // connector-specific optional fields
  fromId?: string;
  toId?: string;
  fromRole?: string;
  toRole?: string;
};

export type SceneInputV5 = {
  stage?: { width: number; height: number };
  layers?: LayerInput[];
  layout?: Partial<LayoutConfig>;
  style_tokens?: Record<string, unknown>;
};

export type MeasuredLayer = LayerInput & {
  measured: { w: number; h: number };
};

export type BoxPlacement = {
  id: string;
  kind: LayerKind;
  role?: string;
  rect: Rect;
  lock?: boolean;
  priority: number;
  minPad: number;
};

export type RoutedConnector = {
  id: string;
  polyline: Polyline;
};

export type LayoutPlan = {
  stage: { w: number; h: number };
  boxes: { id: string; x: number; y: number; w: number; h: number; kind: LayerKind; role?: string }[];
  connectors: RoutedConnector[];
  warnings: string[];
};

export const defaultLayoutConfig = (): LayoutConfig => ({
  grid: 32,
  minPad: 12,
  stroke: 6,
  maxNudges: 3,
  allowFontShrink: false,
  fontShrinkStep: 0.92,
});
