import { describe, it, expect } from 'vitest';
import { inflate, overlaps, segmentIntersectsRect, simplifyCollinear } from '../../layout/geom';

describe('geom utils', () => {
  it('inflates rect by padding', () => {
    const r = { x: 10, y: 10, w: 100, h: 50 };
    const i = inflate(r, 10);
    expect(i).toEqual({ x: 0, y: 0, w: 120, h: 70 });
  });

  it('detects overlap', () => {
    const a = { x: 0, y: 0, w: 50, h: 50 };
    const b = { x: 25, y: 25, w: 50, h: 50 };
    const c = { x: 60, y: 60, w: 10, h: 10 };
    expect(overlaps(a, b)).toBe(true);
    expect(overlaps(a, c)).toBe(false);
  });

  it('segment-rect intersection', () => {
    const r = { x: 50, y: 50, w: 100, h: 100 };
    expect(segmentIntersectsRect({ x: 0, y: 0 }, { x: 200, y: 200 }, r)).toBe(true);
    expect(segmentIntersectsRect({ x: 0, y: 0 }, { x: 40, y: 40 }, r)).toBe(false);
    expect(segmentIntersectsRect({ x: 60, y: 60 }, { x: 80, y: 80 }, r)).toBe(true);
  });

  it('simplifies collinear', () => {
    const poly = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 20, y: 0 },
      { x: 20, y: 10 },
      { x: 20, y: 20 },
    ];
    const s = simplifyCollinear(poly);
    expect(s).toEqual([
      { x: 0, y: 0 },
      { x: 20, y: 0 },
      { x: 20, y: 20 },
    ]);
  });
});
