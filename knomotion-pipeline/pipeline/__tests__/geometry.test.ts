/**
 * Geometry-drift guardrail (Sept M2).
 *
 * core/geometry.ts re-implements the renderer's slot carving from the numbers
 * in capability-manifest.json. This test loads the REAL resolveSceneSlots()
 * from the renderer and asserts both produce identical slot maps for every
 * layout type and both formats. Skips (not fails) when the renderer's deps are
 * not installed; run in a fully-installed environment / CI to catch drift.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadRendererCapabilities } from '../core/capabilities/renderer-capabilities';
import { resolveSlots, missingLayoutOptions, safeBandFor, type LayoutGeometry } from '../core/geometry';
import { computeTextBudget, checkTextBudget, metricsFor } from '../core/text-budget';

let rendererResolve: ((layout: any, viewport: { width: number; height: number }) => Record<string, any>) | undefined;
try {
  const spec = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../KnoMotion-Videos/src/sdk/scene-layout/sceneLayout');
  const mod = await import(/* @vite-ignore */ spec);
  rendererResolve = (mod as any).resolveSceneSlots;
} catch {
  rendererResolve = undefined;
}

let geometry: LayoutGeometry;
beforeAll(async () => {
  geometry = (await loadRendererCapabilities()).layoutGeometry;
});

const LAYOUTS = [
  { type: 'full' },
  { type: 'rowStack', options: { rows: 2 } },
  { type: 'rowStack', options: { rows: 3, rowRatios: [1, 2, 1] } },
  { type: 'rowStack' }, // renderer default rows
  { type: 'columnSplit', options: { columns: 2 } },
  { type: 'columnSplit', options: { columns: 3, ratios: [1, 2, 1] } },
  { type: 'columnSplit' }, // renderer default columns
  { type: 'headerRowColumns', options: { columns: 2 } },
  { type: 'headerRowColumns', options: { columns: 3, rowHeightRatio: 0.25 } },
  { type: 'gridSlots', options: { rows: 2, columns: 2 } },
  { type: 'gridSlots', options: { rows: 2, columns: 3 } },
  { type: 'full', options: { padding: 20, titleHeight: 80 } },
];

const roundMap = (m: Record<string, any>) =>
  Object.fromEntries(Object.entries(m).map(([k, a]) => [k, { left: Math.round(a.left), top: Math.round(a.top), width: Math.round(a.width), height: Math.round(a.height) }]));

describe('geometry mirror matches the renderer', () => {
  it.skipIf(!rendererResolve)('desktop: identical slot maps for every layout', () => {
    for (const layout of LAYOUTS) {
      const ours = roundMap(resolveSlots(layout as any, 'desktop', geometry));
      const theirs = roundMap(rendererResolve!(layout, { width: 1920, height: 1080 }));
      expect(ours, JSON.stringify(layout)).toEqual(theirs);
    }
  });

  it.skipIf(!rendererResolve)('mobile: identical slot maps (columnSplit folds to rowStack, grids capped)', () => {
    for (const layout of LAYOUTS) {
      const ours = roundMap(resolveSlots(layout as any, 'mobile', geometry));
      const theirs = roundMap(rendererResolve!(layout, { width: 1080, height: 1920 }));
      expect(ours, JSON.stringify(layout)).toEqual(theirs);
    }
  });

  it('safe band equals the format padding the renderer carves slots inside', () => {
    expect(safeBandFor('desktop', geometry)).toBe(geometry.desktop.padding);
    expect(safeBandFor('mobile', geometry)).toBe(geometry.mobile.padding);
    const slots = resolveSlots({ type: 'full' }, 'desktop', geometry);
    expect(slots.header.left).toBe(geometry.desktop.padding);
    expect(slots.full.left + slots.full.width).toBe(geometry.desktop.width - geometry.desktop.padding);
  });

  it('reports which layout options the renderer would silently default', () => {
    expect(missingLayoutOptions({ type: 'rowStack' })).toEqual(['rows']);
    expect(missingLayoutOptions({ type: 'columnSplit', options: {} })).toEqual(['columns']);
    expect(missingLayoutOptions({ type: 'gridSlots', options: { rows: 2 } })).toEqual(['columns']);
    expect(missingLayoutOptions({ type: 'full' })).toEqual([]);
    expect(missingLayoutOptions({ type: 'columnSplit', options: { columns: 2 } })).toEqual([]);
  });
});

describe('text budget', () => {
  it('derives a per-slot budget from the manifest metrics and flags overruns', async () => {
    const caps = await loadRendererCapabilities();
    const metrics = metricsFor(caps.textMetrics, 'textReveal');
    expect(metrics, 'manifest textMetrics.textReveal').toBeDefined();
    const full = resolveSlots({ type: 'full' }, 'desktop', caps.layoutGeometry).full;
    const budget = computeTextBudget('textReveal', full, metrics!, { maxTextLines: caps.constraints.maxTextLines }, caps.textMetrics);

    expect(budget.maxCount).toBeGreaterThanOrEqual(3);
    expect(budget.maxCount).toBeLessThanOrEqual(caps.constraints.maxTextLines);
    const lineBudget = budget.fields.find((f) => f.path === 'lines[].text')!;
    expect(lineBudget.maxChars).toBeGreaterThan(40);

    const ok = checkTextBudget({ lines: [{ text: 'Short line' }] }, budget, metrics!);
    expect(ok).toEqual([]);

    const tooLong = checkTextBudget({ lines: [{ text: 'x'.repeat(lineBudget.maxChars + 1) }] }, budget, metrics!);
    expect(tooLong.map((o) => o.kind)).toContain('chars');

    const tooMany = checkTextBudget({ lines: Array.from({ length: budget.maxCount! + 1 }, () => ({ text: 'a' })) }, budget, metrics!);
    expect(tooMany.map((o) => o.kind)).toContain('count');
  });

  it('a narrower column slot yields a smaller character budget than the full slot', async () => {
    const caps = await loadRendererCapabilities();
    const metrics = metricsFor(caps.textMetrics, 'checklist')!;
    const full = resolveSlots({ type: 'full' }, 'desktop', caps.layoutGeometry).full;
    const col = resolveSlots({ type: 'columnSplit', options: { columns: 2 } }, 'desktop', caps.layoutGeometry).col1;
    const a = computeTextBudget('checklist', full, metrics, { maxChecklistItems: 12 }, caps.textMetrics);
    const b = computeTextBudget('checklist', col, metrics, { maxChecklistItems: 12 }, caps.textMetrics);
    expect(b.fields[0].maxChars).toBeLessThan(a.fields[0].maxChars);
  });

  it('codeBlock budgets each code line separately', async () => {
    const caps = await loadRendererCapabilities();
    const metrics = metricsFor(caps.textMetrics, 'codeBlock')!;
    const full = resolveSlots({ type: 'full' }, 'desktop', caps.layoutGeometry).full;
    const budget = computeTextBudget('codeBlock', full, metrics, {}, caps.textMetrics);
    const max = budget.fields.find((f) => f.path === 'code')!.maxChars;
    const over = checkTextBudget({ code: `ok\n${'y'.repeat(max + 5)}\nok` }, budget, metrics);
    expect(over).toHaveLength(1);
    expect(over[0].path).toContain('line 2');
  });
});
