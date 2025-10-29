import { describe, it, expect } from 'vitest';
import { routeConnectors } from '../../layout/router';
import { defaultLayoutConfig } from '../../layout/types';
import { polylineIntersectsRect } from '../../layout/geom';

describe('router', () => {
  const stage = { w: 400, h: 300 };
  const cfg = { ...defaultLayoutConfig(), grid: 20 };

  it('routes with simple elbow avoiding boxes', () => {
    const boxes = [
      { id: 'A', rect: { x: 40, y: 40, w: 60, h: 60 } },
      { id: 'B', rect: { x: 260, y: 200, w: 60, h: 60 } },
    ];
    const cons = [{ id: 'C', fromId: 'A', toId: 'B' }];
    const paths = routeConnectors(boxes, cons, stage, cfg);
    expect(paths[0].polyline.length).toBeGreaterThanOrEqual(2);
    // Should not intersect any inflated box except endpoints
    const pad = (cfg.minPad + cfg.stroke / 2);
    const infl = boxes
      .filter((b) => b.id !== 'A' && b.id !== 'B')
      .map((b) => ({ ...b, rect: { x: b.rect.x - pad, y: b.rect.y - pad, w: b.rect.w + 2 * pad, h: b.rect.h + 2 * pad } }));
    const intersects = infl.some((b) => polylineIntersectsRect(paths[0].polyline, b.rect));
    expect(intersects).toBe(false);
  });

  it('falls back to grid A* when elbow/dogleg blocked', () => {
    // Place obstacles between A and B to force A*
    const boxes = [
      { id: 'A', rect: { x: 40, y: 40, w: 60, h: 60 } },
      // Vertical obstacle not spanning full height so a path exists via top/bottom
      { id: 'O1', rect: { x: 120, y: 60, w: 60, h: 180 } },
      { id: 'B', rect: { x: 260, y: 200, w: 60, h: 60 } },
    ];
    const cons = [{ id: 'C', fromId: 'A', toId: 'B' }];
    const paths = routeConnectors(boxes, cons, stage, cfg);
    expect(paths[0].polyline.length).toBeGreaterThanOrEqual(3);
    const pad = (cfg.minPad + cfg.stroke / 2);
    const infl = boxes
      .filter((b) => b.id !== 'A' && b.id !== 'B')
      .map((b) => ({ ...b, rect: { x: b.rect.x - pad, y: b.rect.y - pad, w: b.rect.w + 2 * pad, h: b.rect.h + 2 * pad } }));
    const intersects = infl.some((b) => polylineIntersectsRect(paths[0].polyline, b.rect));
    expect(intersects).toBe(false);
  });
});
