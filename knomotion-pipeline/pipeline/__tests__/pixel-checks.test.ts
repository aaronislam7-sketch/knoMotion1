/**
 * Pixel-check unit tests (Sept M2, Stage 9) — pure functions over synthetic
 * RGBA buffers, no browser. The rendered-still path is exercised by
 * render-check.test.ts.
 */

import { describe, it, expect } from 'vitest';
import {
  DEFAULT_THRESHOLDS, checkEdgeBleed, checkSlots, decodePng, edgeBands, encodePng, regionDiff, scaleRect,
  type RgbaImage,
} from '../core/render/pixel-checks';
import { contentWindow, planFrames } from '../core/render/frame-plan';
import { resolveSlots, safeBandFor, viewportFor } from '../core/geometry';

// --- synthetic image helpers ------------------------------------------------

const solid = (width: number, height: number, rgb: [number, number, number]): RgbaImage => {
  const data = new Uint8Array(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    data[i * 4] = rgb[0]; data[i * 4 + 1] = rgb[1]; data[i * 4 + 2] = rgb[2]; data[i * 4 + 3] = 255;
  }
  return { width, height, data };
};

const clone = (img: RgbaImage): RgbaImage => ({ ...img, data: new Uint8Array(img.data) });

/** Paints a filled rectangle (native px rect at `scale`) in `rgb`. */
const paint = (img: RgbaImage, rect: { left: number; top: number; width: number; height: number }, rgb: [number, number, number], scale = 1) => {
  const r = scaleRect(rect, scale);
  for (let y = Math.floor(r.top); y < Math.min(img.height, Math.ceil(r.top + r.height)); y++) {
    for (let x = Math.floor(r.left); x < Math.min(img.width, Math.ceil(r.left + r.width)); x++) {
      const i = (y * img.width + x) * 4;
      img.data[i] = rgb[0]; img.data[i + 1] = rgb[1]; img.data[i + 2] = rgb[2];
    }
  }
};

const SCALE = 0.5;
const VIEWPORT = viewportFor('desktop');
const W = VIEWPORT.width * SCALE;
const H = VIEWPORT.height * SCALE;
const BG: [number, number, number] = [250, 244, 236];
const INK: [number, number, number] = [30, 30, 30];

describe('regionDiff', () => {
  it('reports zero change for identical images and full coverage for a painted region', () => {
    const base = solid(W, H, BG);
    const content = clone(base);
    expect(regionDiff(content, base, { left: 0, top: 0, width: VIEWPORT.width * SCALE, height: H })).toMatchObject({ changed: 0, coverage: 0 });

    paint(content, { left: 100, top: 100, width: 200, height: 50 }, INK, SCALE);
    const stats = regionDiff(content, base, scaleRect({ left: 100, top: 100, width: 200, height: 50 }, SCALE));
    expect(stats.area).toBe(100 * 25);
    expect(stats.changed).toBe(100 * 25);
    expect(stats.coverage).toBe(1);
  });

  it('ignores sub-tolerance colour noise but counts real ink', () => {
    const base = solid(W, H, BG);
    const noisy = clone(base);
    paint(noisy, { left: 0, top: 0, width: VIEWPORT.width, height: VIEWPORT.height }, [BG[0] - 10, BG[1] - 10, BG[2] - 10], SCALE);
    expect(regionDiff(noisy, base, { left: 0, top: 0, width: W, height: H }).changed).toBe(0);
    paint(noisy, { left: 0, top: 0, width: 20, height: 20 }, INK, SCALE);
    expect(regionDiff(noisy, base, { left: 0, top: 0, width: W, height: H }).changed).toBe(100);
  });

  it('clips rects to the image and refuses mismatched sizes', () => {
    const base = solid(W, H, BG);
    expect(regionDiff(base, base, { left: W - 10, top: H - 10, width: 100, height: 100 }).area).toBe(100);
    expect(() => regionDiff(base, solid(10, 10, BG), { left: 0, top: 0, width: 5, height: 5 })).toThrow(/baseline/);
  });
});

describe('checkSlots (blank_slot)', () => {
  const slots = resolveSlots({ type: 'columnSplit', options: { columns: 2 } }, 'desktop');

  it('flags a configured slot that shows nothing and passes one with a line of text', () => {
    const base = solid(W, H, BG);
    const content = clone(base);
    // One body line (~60px tall, 800px wide, ~40% glyph fill ≈ 19,000 native px) in col1 only.
    const col1 = slots.col1;
    for (let x = 0; x < 800; x += 10) paint(content, { left: col1.left + 40 + x, top: col1.top + 300, width: 4, height: 60 }, INK, SCALE);

    const results = checkSlots(content, base, slots, SCALE);
    const byName = Object.fromEntries(results.map((r) => [r.slot, r]));
    expect(byName.col1.blank).toBe(false);
    expect(byName.col2.blank).toBe(true);
    expect(byName.col2.changed).toBe(0);
  });

  it('treats a broken-image alt-text speck as blank but a short title as content', () => {
    const base = solid(W, H, BG);
    const speck = clone(base);
    // ~780 native px: what a broken <img alt> renders as.
    paint(speck, { left: slots.col1.left + 10, top: slots.col1.top + 10, width: 78, height: 10 }, INK, SCALE);
    expect(checkSlots(speck, base, { col1: slots.col1 }, SCALE)[0].blank).toBe(true);

    const title = clone(base);
    // ~2,300 native px: a 4-letter header title.
    paint(title, { left: slots.col1.left + 10, top: slots.col1.top + 10, width: 115, height: 20 }, INK, SCALE);
    expect(checkSlots(title, base, { col1: slots.col1 }, SCALE)[0].blank).toBe(false);
  });

  it('scales the pixel floor with the render scale', () => {
    // Same 1,000 native px of ink at scale 1 and 0.5 must agree.
    const rect = { left: 300, top: 300, width: 100, height: 10 };
    for (const scale of [1, 0.5]) {
      const base = solid(VIEWPORT.width * scale, VIEWPORT.height * scale, BG);
      const content = clone(base);
      paint(content, rect, INK, scale);
      expect(checkSlots(content, base, { full: slots.col1 }, scale)[0].blank).toBe(true);
    }
  });
});

describe('checkEdgeBleed (edge_bleed)', () => {
  const band = safeBandFor('desktop');

  it('edgeBands tile the safe zone without double-counting corners', () => {
    const bands = edgeBands(VIEWPORT.width, VIEWPORT.height, band);
    const area = Object.values(bands).reduce((sum, r) => sum + r.width * r.height, 0);
    const expected = VIEWPORT.width * VIEWPORT.height - (VIEWPORT.width - 2 * band) * (VIEWPORT.height - 2 * band);
    expect(area).toBe(expected);
  });

  it('passes content that stays inside the safe zone and flags the edge it crosses', () => {
    const base = solid(W, H, BG);
    const inside = clone(base);
    paint(inside, { left: band + 5, top: band + 5, width: 600, height: 300 }, INK, SCALE);
    expect(checkEdgeBleed(inside, base, VIEWPORT, band, SCALE).every((e) => !e.bleed)).toBe(true);

    const bottom = clone(base);
    // A checklist item running off the bottom: 400px wide, 30px into the band.
    paint(bottom, { left: 200, top: VIEWPORT.height - 30, width: 400, height: 30 }, INK, SCALE);
    const results = checkEdgeBleed(bottom, base, VIEWPORT, band, SCALE);
    expect(results.find((e) => e.edge === 'bottom')?.bleed).toBe(true);
    expect(results.filter((e) => e.bleed).map((e) => e.edge)).toEqual(['bottom']);
  });

  it('tolerates a faint drop shadow but not a clipped glyph', () => {
    const base = solid(W, H, BG);
    const shadow = clone(base);
    // 100 native px in the 1920×60 top band = 0.09% < 0.2%.
    paint(shadow, { left: 500, top: 50, width: 10, height: 10 }, INK, SCALE);
    expect(checkEdgeBleed(shadow, base, VIEWPORT, band, SCALE).find((e) => e.edge === 'top')?.bleed).toBe(false);
    const glyph = clone(base);
    paint(glyph, { left: 500, top: 30, width: 40, height: 30 }, INK, SCALE); // 1,200 px ≈ 1%
    expect(checkEdgeBleed(glyph, base, VIEWPORT, band, SCALE).find((e) => e.edge === 'top')?.bleed).toBe(true);
  });
});

describe('png round-trip', () => {
  it('decodePng(encodePng(img)) preserves pixels', () => {
    const img = solid(8, 4, [1, 2, 3]);
    paint(img, { left: 2, top: 1, width: 3, height: 2 }, [200, 100, 50]);
    const back = decodePng(encodePng(img));
    expect(back.width).toBe(8);
    expect(back.height).toBe(4);
    expect(Array.from(back.data)).toEqual(Array.from(img.data));
  });
});

describe('planFrames', () => {
  const scene = (durationInFrames: number, beats: Record<string, number>, extra: Record<string, unknown> = {}) => ({
    id: 's', durationInFrames,
    config: { background: { preset: 'cleanCard' }, layout: { type: 'full' }, slots: { full: { midScene: 'textReveal', config: { lines: [], beats, ...extra } } } },
  }) as any;

  it('lands settled / midpoint / pre-exit inside the content window, in order', () => {
    const frames = planFrames(scene(180, { start: 0.8, exit: 5.4 }), 30);
    expect(frames.map((f) => f.label)).toEqual(['settled', 'midpoint', 'pre-exit']);
    expect(frames[0].timeSec).toBeCloseTo(1.8, 1);
    expect(frames[2].timeSec).toBeCloseTo(5.0, 1);
    expect(frames[1].timeSec).toBeCloseTo((1.8 + 5.0) / 2, 1);
    for (const f of frames) expect(f.frame).toBeGreaterThanOrEqual(0), expect(f.frame).toBeLessThan(180);
  });

  it('uses the widest window across slots and the renderer defaults when beats are missing', () => {
    const multi = {
      id: 'm', durationInFrames: 240,
      config: { background: { preset: 'cleanCard' }, layout: { type: 'columnSplit', options: { columns: 2 } }, slots: {
        col1: { midScene: 'textReveal', config: { beats: { start: 0.5, exit: 3 } } },
        col2: { midScene: 'checklist', config: { beats: { start: 2, exit: 7.5 } } },
      } },
    } as any;
    expect(contentWindow(multi)).toEqual({ start: 0.5, exit: 7.5 });
    expect(contentWindow(scene(90, {}))).toEqual({ start: 0.5, exit: 0.5 + 1.9 });
  });

  it('shrinks margins and de-duplicates on a very short window, and honours count', () => {
    const short = planFrames(scene(45, { start: 0.2, exit: 0.6 }), 30);
    expect(short.length).toBeGreaterThanOrEqual(1);
    expect(new Set(short.map((f) => f.frame)).size).toBe(short.length);
    for (let i = 1; i < short.length; i++) expect(short[i].frame).toBeGreaterThan(short[i - 1].frame);
    expect(planFrames(scene(180, { start: 0.8, exit: 5.4 }), 30, 1).map((f) => f.label)).toEqual(['midpoint']);
    expect(planFrames(scene(180, { start: 0.8, exit: 5.4 }), 30, 2).map((f) => f.label)).toEqual(['settled', 'pre-exit']);
  });

  it('never plans past the last frame even when exit is at the scene end', () => {
    const frames = planFrames(scene(60, { start: 0.5, exit: 2.0 }), 30);
    for (const f of frames) expect(f.frame).toBeLessThanOrEqual(59);
  });
});

describe('DEFAULT_THRESHOLDS', () => {
  it('are the calibrated values documented in pipeline_build.md', () => {
    expect(DEFAULT_THRESHOLDS).toEqual({ pixelTolerance: 28, blankMinPixels: 1500, edgeBleedMaxCoverage: 0.002 });
  });
});
