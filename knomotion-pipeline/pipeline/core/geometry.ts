/**
 * Slot geometry (pipeline-side mirror of the renderer's macro layout).
 *
 * The renderer carves the viewport into named slots in
 * KnoMotion-Videos/src/sdk/scene-layout/sceneLayout.js. The pipeline must not
 * import renderer code, so this module re-implements the same arithmetic from
 * the numbers the renderer publishes in capability-manifest.json
 * (`layoutGeometry`). `__tests__/geometry.test.ts` imports the real
 * resolveSceneSlots() (when renderer deps are installed) and asserts the two
 * agree for every layout type, so the mirror cannot drift silently.
 *
 * Two consumers:
 *   - Stage 8 `slot_layout_reconcile` / `text_budget` — which slot names a
 *     layout really produces, and how big each slot is.
 *   - Stage 9 render-check — where to look for blank slots and where the outer
 *     safe band is.
 */

export interface LayoutArea { left: number; top: number; width: number; height: number }
export type SlotMap = Record<string, LayoutArea>;
export type Format = 'desktop' | 'mobile';

export interface FormatGeometry { width: number; height: number; padding: number; titleHeight: number }

export interface LayoutGeometry {
  desktop: FormatGeometry;
  mobile: FormatGeometry;
  defaults: { rows: number; columns: number; rowHeightRatio: number; minSlots: number; maxSlots: number };
  mobileAdjustments: { columnSplitFallback: string; maxGridColumns: number; maxStackRows: number };
}

/** Fallback identical to the renderer's constants, used only if the manifest lacks `layoutGeometry`. */
export const DEFAULT_LAYOUT_GEOMETRY: LayoutGeometry = {
  desktop: { width: 1920, height: 1080, padding: 60, titleHeight: 100 },
  mobile: { width: 1080, height: 1920, padding: 40, titleHeight: 120 },
  defaults: { rows: 3, columns: 2, rowHeightRatio: 0.35, minSlots: 1, maxSlots: 6 },
  mobileAdjustments: { columnSplitFallback: 'rowStack', maxGridColumns: 2, maxStackRows: 3 },
};

export interface LayoutSpec {
  type?: string;
  options?: Record<string, unknown> | null;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);
const area = (left: number, top: number, width: number, height: number): LayoutArea => ({ left, top, width, height });

const normalizeRatios = (ratios: unknown, count: number): number[] => {
  if (!Array.isArray(ratios) || ratios.length !== count) return Array(count).fill(1 / count);
  const valid = ratios.map((r) => (typeof r === 'number' && r > 0 ? r : 1));
  const total = valid.reduce((a, b) => a + b, 0);
  if (total <= 0) return Array(count).fill(1 / count);
  return valid.map((r) => r / total);
};

const splitHorizontal = (a: LayoutArea, rows: number, ratios: unknown, g: LayoutGeometry): LayoutArea[] => {
  const count = clamp(rows, g.defaults.minSlots, g.defaults.maxSlots);
  const r = normalizeRatios(ratios, count);
  const out: LayoutArea[] = [];
  let top = a.top;
  for (let i = 0; i < count; i++) {
    const h = a.height * r[i];
    out.push(area(a.left, top, a.width, h));
    top += h;
  }
  return out;
};

const splitVertical = (a: LayoutArea, cols: number, ratios: unknown, g: LayoutGeometry): LayoutArea[] => {
  const count = clamp(cols, g.defaults.minSlots, g.defaults.maxSlots);
  const r = normalizeRatios(ratios, count);
  const out: LayoutArea[] = [];
  let left = a.left;
  for (let i = 0; i < count; i++) {
    const w = a.width * r[i];
    out.push(area(left, a.top, w, a.height));
    left += w;
  }
  return out;
};

const cellName = (index: number, total: number, columns: number) =>
  total <= 26 ? `cell${String.fromCharCode(65 + index)}` : `r${Math.floor(index / columns) + 1}c${(index % columns) + 1}`;

const countOr = (v: unknown, fallback: number, g: LayoutGeometry) =>
  clamp(typeof v === 'number' && v >= g.defaults.minSlots ? v : fallback, g.defaults.minSlots, g.defaults.maxSlots);

export const viewportFor = (format: Format, g: LayoutGeometry = DEFAULT_LAYOUT_GEOMETRY) => ({
  width: g[format].width,
  height: g[format].height,
});

/** Mirrors viewportPresets.adjustLayoutForViewport (mobile only). */
const adjustForFormat = (layout: LayoutSpec, format: Format, g: LayoutGeometry): LayoutSpec => {
  if (format !== 'mobile') return layout;
  const options: Record<string, unknown> = { ...(layout.options ?? {}) };
  let type = layout.type;
  switch (type) {
    case 'columnSplit':
      type = g.mobileAdjustments.columnSplitFallback;
      if (typeof options.columns === 'number') {
        options.rows = options.columns;
        delete options.columns;
      }
      break;
    case 'gridSlots':
      if (typeof options.columns === 'number' && options.columns > g.mobileAdjustments.maxGridColumns) {
        options.columns = g.mobileAdjustments.maxGridColumns;
      }
      break;
    case 'rowStack':
      if (typeof options.rows === 'number' && options.rows > g.mobileAdjustments.maxStackRows) {
        options.rows = g.mobileAdjustments.maxStackRows;
      }
      break;
  }
  return { type, options };
};

/**
 * Returns the slot map the renderer will produce for `layout` in `format`.
 * Unknown/missing layout types fall back to `full`, as the renderer does.
 */
export const resolveSlots = (layout: LayoutSpec | undefined, format: Format = 'desktop', g: LayoutGeometry = DEFAULT_LAYOUT_GEOMETRY): SlotMap => {
  const viewport = viewportFor(format, g);
  const fg = g[format];
  const adjusted = adjustForFormat(layout ?? {}, format, g);
  const o = (adjusted.options ?? {}) as Record<string, any>;
  const padding: number = typeof o.padding === 'number' ? o.padding : fg.padding;
  const titleHeight: number = typeof o.titleHeight === 'number' ? o.titleHeight : fg.titleHeight;

  const header = area(padding, padding, viewport.width - padding * 2, titleHeight);
  const contentTop = padding + titleHeight;
  const content = area(padding, contentTop, viewport.width - padding * 2, viewport.height - contentTop - padding);

  const slots: SlotMap = { header };
  switch (adjusted.type) {
    case 'rowStack': {
      splitHorizontal(content, countOr(o.rows, g.defaults.rows, g), o.rowRatios, g).forEach((a, i) => { slots[`row${i + 1}`] = a; });
      return slots;
    }
    case 'columnSplit': {
      const cols = countOr(o.columns, g.defaults.columns, g);
      splitVertical(content, cols, o.ratios, g).forEach((a, i) => { slots[`col${i + 1}`] = a; });
      if (cols === 2) { slots.left = slots.col1; slots.right = slots.col2; }
      return slots;
    }
    case 'headerRowColumns': {
      const cols = countOr(o.columns, g.defaults.columns, g);
      const ratio = typeof o.rowHeightRatio === 'number' && o.rowHeightRatio > 0 && o.rowHeightRatio < 1 ? o.rowHeightRatio : g.defaults.rowHeightRatio;
      const rowH = content.height * ratio;
      slots.row = area(content.left, content.top, content.width, rowH);
      const colsArea = area(content.left, content.top + rowH, content.width, content.height - rowH);
      splitVertical(colsArea, cols, o.columnRatios, g).forEach((a, i) => { slots[`col${i + 1}`] = a; });
      if (cols === 2) { slots.left = slots.col1; slots.right = slots.col2; }
      return slots;
    }
    case 'gridSlots': {
      const rows = countOr(o.rows, g.defaults.rows, g);
      const cols = countOr(o.columns, g.defaults.columns, g);
      const total = rows * cols;
      let idx = 0;
      for (const rowArea of splitHorizontal(content, rows, undefined, g)) {
        for (const cell of splitVertical(rowArea, cols, undefined, g)) {
          slots[cellName(idx, total, cols)] = cell;
          idx++;
        }
      }
      return slots;
    }
    case 'full':
    default:
      slots.full = content;
      return slots;
  }
};

/** The outer band (in px) that content must never enter, per format. */
export const safeBandFor = (format: Format, g: LayoutGeometry = DEFAULT_LAYOUT_GEOMETRY): number => g[format].padding;

/**
 * Whether a layout can produce the required slot count without relying on the
 * renderer's silent defaults. `rowStack` needs `rows`, `columnSplit` /
 * `headerRowColumns` need `columns`, `gridSlots` needs both. Returns the
 * missing option names (empty when nothing is missing).
 */
export const missingLayoutOptions = (layout: LayoutSpec | undefined): string[] => {
  const o = (layout?.options ?? {}) as Record<string, unknown>;
  const has = (k: string) => typeof o[k] === 'number' && (o[k] as number) >= 1;
  switch (layout?.type) {
    case 'rowStack': return has('rows') ? [] : ['rows'];
    case 'columnSplit':
    case 'headerRowColumns': return has('columns') ? [] : ['columns'];
    case 'gridSlots': return [...(has('rows') ? [] : ['rows']), ...(has('columns') ? [] : ['columns'])];
    default: return [];
  }
};
