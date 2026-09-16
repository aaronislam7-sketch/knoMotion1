/**
 * Content shapes (authoring-time guardrail, Sept M2).
 *
 * Stage 3 tags every planned scene with the SHAPE of what it teaches; Stage 7
 * may then pick a mid-scene only from that shape's allowed subset (a subset,
 * not a forced choice), and Stage 8 `content_shape` errors when it strays.
 * This stops "everything is a textReveal or a checklist" without letting the
 * model invent a visual that does not fit the content.
 *
 * The shape -> subset table lives in capability-manifest.json (`contentShapes`)
 * so M3 can generate it alongside the rest of the manifest; the copy below is
 * the fallback when a manifest predates it.
 */

import type { RendererCapabilities } from './capabilities/renderer-capabilities';

export const CONTENT_SHAPES = ['statement', 'sequence', 'comparison', 'quantity', 'structure', 'code'] as const;
export type ContentShape = (typeof CONTENT_SHAPES)[number];

export const DEFAULT_CONTENT_SHAPE_SUBSETS: Record<ContentShape, string[]> = {
  statement: ['textReveal', 'heroText', 'bubbleCallout'],
  sequence: ['checklist', 'cardSequence', 'textReveal'],
  comparison: ['sideBySide', 'gridCards', 'textReveal'],
  quantity: ['bigNumber', 'animatedCounter', 'textReveal'],
  structure: ['gridCards', 'iconGrid', 'cardSequence', 'bubbleCallout'],
  code: ['codeBlock', 'textReveal'],
};

/** Common near-misses the planning model writes, folded onto the enum. */
const SHAPE_ALIASES: Record<string, ContentShape> = {
  claim: 'statement', fact: 'statement', definition: 'statement', quote: 'statement', message: 'statement', takeaway: 'statement',
  list: 'sequence', steps: 'sequence', step: 'sequence', process: 'sequence', timeline: 'sequence', checklist: 'sequence', howto: 'sequence',
  compare: 'comparison', contrast: 'comparison', versus: 'comparison', vs: 'comparison', tradeoff: 'comparison', beforeafter: 'comparison',
  number: 'quantity', numbers: 'quantity', stat: 'quantity', statistic: 'quantity', metric: 'quantity', data: 'quantity', figure: 'quantity',
  overview: 'structure', map: 'structure', taxonomy: 'structure', categories: 'structure', components: 'structure', parts: 'structure', grid: 'structure',
  snippet: 'code', program: 'code', syntax: 'code', command: 'code',
};

export const normalizeContentShape = (v: unknown): unknown => {
  if (typeof v !== 'string') return v;
  const k = v.toLowerCase().replace(/[^a-z]/g, '');
  if ((CONTENT_SHAPES as readonly string[]).includes(k)) return k;
  return SHAPE_ALIASES[k] ?? v;
};

/**
 * Deterministic fallback when the planner omitted `contentShape`: read it off
 * the advisory mid-scene first (the planner's own visual intent), else the
 * narrative purpose.
 */
export const inferContentShape = (scene: { purpose?: string; suggestedMidScenes?: string[] }): ContentShape => {
  const mid = scene.suggestedMidScenes?.[0];
  if (mid) {
    for (const [shape, subset] of Object.entries(DEFAULT_CONTENT_SHAPE_SUBSETS) as [ContentShape, string[]][]) {
      if (subset[0] === mid) return shape;
    }
  }
  switch (scene.purpose) {
    case 'comparison': return 'comparison';
    case 'demonstration': return 'sequence';
    case 'concept': return 'structure';
    case 'example': return 'sequence';
    default: return 'statement';
  }
};

export const allowedMidScenesFor = (shape: string | undefined, caps?: Pick<RendererCapabilities, 'contentShapes' | 'canonicalMidSceneKeys'>): string[] | undefined => {
  if (!shape) return undefined;
  const fromManifest = caps?.contentShapes?.[shape];
  const subset = fromManifest && fromManifest.length ? fromManifest : DEFAULT_CONTENT_SHAPE_SUBSETS[shape as ContentShape];
  if (!subset) return undefined;
  // Never advertise something the renderer cannot draw.
  return caps ? subset.filter((k) => caps.canonicalMidSceneKeys.includes(k)) : subset;
};
