import { describe, it, expect } from 'vitest';
import { initialPlacement, resolveOverlaps } from '../../layout/pack';
import { defaultLayoutConfig } from '../../layout/types';

const stage = { width: 400, height: 300 };

const mkMeasured = (id: string, w: number, h: number, extra: Partial<any> = {}) => ({
  id,
  kind: 'box',
  measured: { w, h },
  ...extra,
});

describe('pack - resolve overlaps', () => {
  it('resolves simple collisions via nudges', () => {
    const layers = [
      mkMeasured('A', 100, 80, { box: { x: 50, y: 50 } }),
      mkMeasured('B', 120, 80, { box: { x: 80, y: 70 } }),
    ];
    const cfg = { ...defaultLayoutConfig(), grid: 20, maxNudges: 5 };
    const placements = initialPlacement(layers as any, stage as any, cfg);
    const resolved = resolveOverlaps(layers as any, placements, stage as any, cfg);

    // No overlaps with padding
    const pad = cfg.minPad + cfg.stroke / 2;
    const i0 = { ...resolved[0].rect, x: resolved[0].rect.x - pad, y: resolved[0].rect.y - pad, w: resolved[0].rect.w + pad * 2, h: resolved[0].rect.h + pad * 2 };
    const i1 = { ...resolved[1].rect, x: resolved[1].rect.x - pad, y: resolved[1].rect.y - pad, w: resolved[1].rect.w + pad * 2, h: resolved[1].rect.h + pad * 2 };
    const overlaps = !(i0.x + i0.w <= i1.x || i1.x + i1.w <= i0.x || i0.y + i0.h <= i1.y || i1.y + i1.h <= i0.y);
    expect(overlaps).toBe(false);
  });

  it('respects lock: locked item stays fixed', () => {
    const layers = [
      mkMeasured('L', 120, 80, { lock: true, box: { x: 60, y: 60 } }),
      mkMeasured('M', 120, 80, { box: { x: 60, y: 60 } }),
    ];
    const cfg = { ...defaultLayoutConfig(), grid: 20, maxNudges: 4 };
    const placements = initialPlacement(layers as any, stage as any, cfg);
    const resolved = resolveOverlaps(layers as any, placements, stage as any, cfg);
    const locked = resolved.find((r) => r.id === 'L')!;
    expect(locked.rect.x).toBe(60);
    expect(locked.rect.y).toBe(60);
  });

  it('uses priority: lower priority moves first', () => {
    const layers = [
      mkMeasured('P1', 100, 80, { box: { x: 50, y: 50 }, priority: 1 }),
      mkMeasured('P5', 120, 80, { box: { x: 50, y: 50 }, priority: 5 }),
    ];
    const cfg = { ...defaultLayoutConfig(), grid: 20, maxNudges: 3 };
    const placements = initialPlacement(layers as any, stage as any, cfg);
    const resolved = resolveOverlaps(layers as any, placements, stage as any, cfg);
    const p1 = resolved.find((r) => r.id === 'P1')!;
    const p5 = resolved.find((r) => r.id === 'P5')!;
    // Expect P1 to remain closer to starting point than P5
    const d1 = Math.abs(p1.rect.x - 50) + Math.abs(p1.rect.y - 50);
    const d5 = Math.abs(p5.rect.x - 50) + Math.abs(p5.rect.y - 50);
    expect(d1).toBeLessThanOrEqual(d5);
  });
});
