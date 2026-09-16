/**
 * Per-slot text budgets (authoring-time guardrail, Sept M2).
 *
 * Text overflows when a string is longer than the slot can show at the
 * mid-scene's base font size. The renderer publishes each mid-scene's font
 * metrics in capability-manifest.json (`textMetrics`); this module turns
 * "slot geometry + metrics" into a concrete budget:
 *
 *   maxChars(field) = floor(slotWidth * widthFraction / (fontSize * charWidthRatio)) * lineCapacity, capped by maxChars
 *   maxCount(array) = min(manifest count limit, floor(slotHeight / (fontSize * lineHeightRatio * rowAllowance)))
 *
 * The same numbers are stated to the Stage 7 model up front (so it writes to
 * the budget) and enforced by the Stage 8 `text_budget` rule (so an overrun is
 * an error repair must fix, not a warning). Pure functions, no I/O.
 */

import type { LayoutArea } from './geometry';

export interface TextFieldMetric {
  /** Dotted path inside the mid-scene config; `[]` marks an array (e.g. `lines[].text`, `left.items[]`). */
  path: string;
  fontSize: number;
  widthFraction: number;
  lineCapacity: number;
  maxChars: number;
  charWidthRatio?: number;
  /** `lines`: the string is split on `\n` and every line is budgeted separately (codeBlock). */
  kind?: 'lines';
  /** Width available is the slot width divided by the column count (grids). */
  perColumn?: boolean;
}

export interface MidSceneTextMetrics {
  array?: string;
  arrayKind?: 'lines';
  countLimit?: string;
  fontSize?: number;
  lineHeightRatio?: number;
  rowAllowance?: number;
  perColumn?: boolean;
  fields: TextFieldMetric[];
}

export interface TextMetricsTable {
  charWidthRatio?: { body?: number; header?: number; mono?: number };
  [midScene: string]: unknown;
}

export interface FieldBudget {
  path: string;
  maxChars: number;
}

export interface SlotTextBudget {
  midScene: string;
  slot: { width: number; height: number };
  /** Array key (`lines`, `items`, …) and its maximum length for this slot, when the mid-scene has one. */
  countPath?: string;
  maxCount?: number;
  fields: FieldBudget[];
}

const DEFAULT_CHAR_WIDTH = 0.55;

export const metricsFor = (table: TextMetricsTable | undefined, midScene: string): MidSceneTextMetrics | undefined => {
  const m = table?.[midScene];
  return m && typeof m === 'object' && Array.isArray((m as any).fields) ? (m as MidSceneTextMetrics) : undefined;
};

/** Column count a grid mid-scene will actually use (mirrors GridCardReveal auto-columns; IconGrid/CardSequence defaults). */
export const effectiveColumns = (midScene: string, config: Record<string, unknown>, slot: LayoutArea, itemCount: number): number => {
  const explicit = typeof config.columns === 'number' && config.columns >= 1 ? Math.floor(config.columns) : undefined;
  if (explicit) return explicit;
  if (midScene === 'gridCards') {
    return Math.max(1, Math.min(Math.ceil(Math.sqrt(Math.max(1, itemCount))), Math.max(2, Math.floor(slot.width / 150))));
  }
  if (midScene === 'iconGrid') return 4;
  if (midScene === 'cardSequence') return config.layout === 'grid' ? 3 : 1;
  return 1;
};

export const computeTextBudget = (
  midScene: string,
  slot: LayoutArea,
  metrics: MidSceneTextMetrics,
  countLimits: Record<string, number>,
  table: TextMetricsTable | undefined,
  columns = 1,
): SlotTextBudget => {
  const ratios = table?.charWidthRatio ?? {};
  const fields: FieldBudget[] = metrics.fields.map((f) => {
    const ratio = f.charWidthRatio ?? (f.kind === 'lines' ? ratios.mono ?? 0.6 : ratios.body ?? DEFAULT_CHAR_WIDTH);
    const width = (f.perColumn ? slot.width / Math.max(1, columns) : slot.width) * f.widthFraction;
    const perLine = Math.floor(width / (f.fontSize * ratio));
    const raw = Math.floor(perLine * f.lineCapacity);
    return { path: f.path, maxChars: Math.max(8, Math.min(f.maxChars, raw)) };
  });

  const out: SlotTextBudget = { midScene, slot: { width: Math.round(slot.width), height: Math.round(slot.height) }, fields };

  if (metrics.array && metrics.fontSize && metrics.lineHeightRatio) {
    const rowPx = metrics.fontSize * metrics.lineHeightRatio * (metrics.rowAllowance ?? 1);
    const rowsThatFit = Math.floor(slot.height / rowPx) * (metrics.perColumn ? Math.max(1, columns) : 1);
    const limit = metrics.countLimit ? countLimits[metrics.countLimit] : undefined;
    out.countPath = metrics.array;
    out.maxCount = Math.max(1, Math.min(limit ?? Infinity, rowsThatFit));
  }
  return out;
};

// ---------------------------------------------------------------------------
// Checking a config against a budget
// ---------------------------------------------------------------------------

export interface TextOverrun {
  /** JSON path relative to the slot config, e.g. `lines[2].text`. */
  path: string;
  kind: 'chars' | 'count';
  actual: number;
  max: number;
}

/** Resolves a metric path like `lines[].text` / `left.items[]` / `code` to every concrete (path, string) pair present in `config`. */
const collectStrings = (node: unknown, segments: string[], pathSoFar: string, acc: { path: string; value: string }[]) => {
  if (segments.length === 0) {
    if (typeof node === 'string') acc.push({ path: pathSoFar, value: node });
    else if (typeof node === 'number') acc.push({ path: pathSoFar, value: String(node) });
    return;
  }
  const [head, ...rest] = segments;
  if (head.endsWith('[]')) {
    const key = head.slice(0, -2);
    const arr = key ? (node as any)?.[key] : node;
    if (!Array.isArray(arr)) return;
    arr.forEach((item, i) => collectStrings(item, rest, `${pathSoFar}${key ? `.${key}` : ''}[${i}]`.replace(/^\./, ''), acc));
    return;
  }
  const next = (node as any)?.[head];
  if (next === undefined || next === null) return;
  collectStrings(next, rest, pathSoFar ? `${pathSoFar}.${head}` : head, acc);
};

export const checkTextBudget = (
  config: Record<string, unknown>,
  budget: SlotTextBudget,
  metrics: MidSceneTextMetrics,
): TextOverrun[] => {
  const overruns: TextOverrun[] = [];

  if (budget.countPath && budget.maxCount !== undefined) {
    const v = config[budget.countPath];
    const n = metrics.arrayKind === 'lines'
      ? (typeof v === 'string' ? v.split('\n').length : 0)
      : Array.isArray(v) ? v.length : 0;
    if (n > budget.maxCount) overruns.push({ path: budget.countPath, kind: 'count', actual: n, max: budget.maxCount });
  }

  for (const f of metrics.fields) {
    const b = budget.fields.find((x) => x.path === f.path);
    if (!b) continue;
    const found: { path: string; value: string }[] = [];
    collectStrings(config, f.path.split('.'), '', found);
    for (const { path, value } of found) {
      if (f.kind === 'lines') {
        value.split('\n').forEach((line, i) => {
          if (line.length > b.maxChars) overruns.push({ path: `${path}[line ${i + 1}]`, kind: 'chars', actual: line.length, max: b.maxChars });
        });
      } else if (value.length > b.maxChars) {
        overruns.push({ path, kind: 'chars', actual: value.length, max: b.maxChars });
      }
    }
  }
  return overruns;
};

/** One-line, prompt-friendly rendering of a budget: "textReveal in full (1800×860px): ≤6 lines; lines[].text ≤ 92 chars". */
export const describeBudget = (slotName: string, b: SlotTextBudget): string => {
  const parts: string[] = [];
  if (b.countPath && b.maxCount !== undefined) parts.push(`≤${b.maxCount} ${b.countPath}`);
  for (const f of b.fields) parts.push(`${f.path} ≤ ${f.maxChars} chars`);
  return `${b.midScene} in ${slotName} (${b.slot.width}×${b.slot.height}px): ${parts.join('; ')}`;
};
