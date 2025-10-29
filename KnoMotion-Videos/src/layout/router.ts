import { inflate, overlaps, simplifyCollinear, polylineIntersectsRect } from './geom.ts';
import type { LayoutConfig, Point, Rect, RoutedConnector } from './types.ts';

const rectAnchors = (r: Rect): Point[] => {
  const cx = r.x + r.w / 2;
  const cy = r.y + r.h / 2;
  return [
    { x: cx, y: r.y }, // N
    { x: r.x + r.w, y: cy }, // E
    { x: cx, y: r.y + r.h }, // S
    { x: r.x, y: cy }, // W
    { x: r.x + r.w, y: r.y }, // NE corner
    { x: r.x + r.w, y: r.y + r.h }, // SE corner
    { x: r.x, y: r.y + r.h }, // SW corner
    { x: r.x, y: r.y }, // NW corner
  ];
};

const segmentsClear = (poly: Point[], obstacles: Rect[]): boolean => {
  for (const o of obstacles) if (polylineIntersectsRect(poly, o)) return false;
  return true;
};

const elbowPath = (a: Point, b: Point, hv: 'H' | 'V'): Point[] => {
  if (hv === 'H') return [a, { x: b.x, y: a.y }, b];
  return [a, { x: a.x, y: b.y }, b];
};

const doglegAround = (a: Point, b: Point, obstacles: Rect[], cfg: LayoutConfig): Point[] | null => {
  // Simple dogleg: offset mid segment by one grid unit above or below nearest obstacle center
  const midX = (a.x + b.x) / 2;
  const midY = (a.y + b.y) / 2;

  // Find nearest obstacle center
  let nearest: Rect | null = null;
  let bestD = Infinity;
  for (const o of obstacles) {
    const cx = o.x + o.w / 2;
    const cy = o.y + o.h / 2;
    const dx = cx - midX;
    const dy = cy - midY;
    const d2 = dx * dx + dy * dy;
    if (d2 < bestD) {
      bestD = d2;
      nearest = o;
    }
  }
  if (!nearest) return null;
  const dirY = midY < nearest.y ? -1 : 1;
  const offset = cfg.grid * dirY;
  const mid1: Point = { x: a.x, y: midY + offset };
  const mid2: Point = { x: b.x, y: midY + offset };
  return [a, mid1, mid2, b];
};

// Coarse grid A* pathfinding
const gridAStar = (
  start: Point,
  goal: Point,
  stage: { w: number; h: number },
  cfg: LayoutConfig,
  obstacles: Rect[]
): Point[] | null => {
  const cell = (p: Point) => ({
    cx: Math.max(0, Math.min(Math.floor(p.x / cfg.grid), Math.floor(stage.w / cfg.grid))),
    cy: Math.max(0, Math.min(Math.floor(p.y / cfg.grid), Math.floor(stage.h / cfg.grid))),
  });
  const startC = cell(start);
  const goalC = cell(goal);
  const cols = Math.ceil(stage.w / cfg.grid) + 1;
  const rows = Math.ceil(stage.h / cfg.grid) + 1;
  const blocked = new Set<string>();
  const inflated = obstacles.map((o) => inflate(o, cfg.minPad + cfg.stroke / 2));
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const r: Rect = { x: x * cfg.grid, y: y * cfg.grid, w: cfg.grid, h: cfg.grid };
      if (inflated.some((o) => overlaps(o, r))) blocked.add(`${x},${y}`);
    }
  }

  const h = (x: number, y: number) => Math.abs(x - goalC.cx) + Math.abs(y - goalC.cy);

  const open = new Set<string>();
  const came = new Map<string, string | null>();
  const gScore = new Map<string, number>();
  const fScore = new Map<string, number>();

  const key = (x: number, y: number) => `${x},${y}`;

  const startKey = key(startC.cx, startC.cy);
  open.add(startKey);
  came.set(startKey, null);
  gScore.set(startKey, 0);
  fScore.set(startKey, h(startC.cx, startC.cy));

  const neighbors = (x: number, y: number): [number, number][] => [
    [x + 1, y],
    [x - 1, y],
    [x, y + 1],
    [x, y - 1],
  ].filter(([nx, ny]) => nx >= 0 && ny >= 0 && nx < cols && ny < rows && !blocked.has(key(nx, ny)));

  while (open.size > 0) {
    // get node with lowest fScore
    let current: string | null = null;
    let best = Infinity;
    for (const k of open) {
      const f = fScore.get(k) ?? Infinity;
      if (f < best) {
        best = f;
        current = k;
      }
    }
    if (!current) break;

    if (current === key(goalC.cx, goalC.cy)) {
      // reconstruct
      const path: Point[] = [];
      let cur: string | null = current;
      while (cur) {
        const [x, y] = cur.split(',').map((n) => parseInt(n, 10));
        path.push({ x: x * cfg.grid + cfg.grid / 2, y: y * cfg.grid + cfg.grid / 2 });
        cur = came.get(cur) ?? null;
      }
      path.reverse();
      // Ensure start and end exact
      if (path.length === 0 || (path[0].x !== start.x || path[0].y !== start.y)) path.unshift(start);
      if (path[path.length - 1].x !== goal.x || path[path.length - 1].y !== goal.y) path.push(goal);
      return simplifyCollinear(path);
    }

    open.delete(current);
    const [cx, cy] = current.split(',').map((n) => parseInt(n, 10));
    for (const [nx, ny] of neighbors(cx, cy)) {
      const neighborKey = key(nx, ny);
      const tentative = (gScore.get(current) ?? Infinity) + 1;
      if (tentative < (gScore.get(neighborKey) ?? Infinity)) {
        came.set(neighborKey, current);
        gScore.set(neighborKey, tentative);
        fScore.set(neighborKey, tentative + h(nx, ny));
        open.add(neighborKey);
      }
    }
  }

  return null;
};

export const routeConnectors = (
  boxes: { id: string; rect: Rect }[],
  connectors: { id: string; fromId?: string; toId?: string }[],
  stage: { w: number; h: number },
  cfg: LayoutConfig
): RoutedConnector[] => {
  const byId = new Map<string, Rect>(boxes.map((b) => [b.id, b.rect]));
  const inflatedAll = boxes.map((b) => ({ id: b.id, r: inflate(b.rect, cfg.minPad + cfg.stroke / 2) }));

  const out: RoutedConnector[] = [];

  for (const c of connectors) {
    const fromRect = c.fromId ? byId.get(c.fromId) : undefined;
    const toRect = c.toId ? byId.get(c.toId) : undefined;
    if (!fromRect || !toRect) {
      out.push({ id: c.id, polyline: [] });
      continue;
    }

    const a1 = rectAnchors(fromRect);
    const a2 = rectAnchors(toRect);
    const inflatedObstacles = inflatedAll
      .filter((o) => o.id !== c.fromId && o.id !== c.toId)
      .map((o) => o.r);

    let best: Point[] | null = null;

    // Try 8x anchor pairs × 2 orientations
    for (let i = 0; i < a1.length; i++) {
      for (let j = 0; j < a2.length; j++) {
        const start = a1[i];
        const end = a2[j];
        for (const hv of ['H', 'V'] as const) {
          const poly = elbowPath(start, end, hv);
          if (segmentsClear(poly, inflatedObstacles)) {
            best = poly;
            break;
          }
        }
        if (best) break;
      }
      if (best) break;
    }

    if (!best) {
      // try dogleg around nearest obstacle
      const start = a1[0];
      const end = a2[0];
      const dog = doglegAround(start, end, inflatedObstacles, cfg);
      if (dog && segmentsClear(dog, inflatedObstacles)) best = dog;
    }

    if (!best) {
      // fallback grid A*
      const start = a1[0];
      const end = a2[0];
      const path = gridAStar(start, end, stage, cfg, boxes.map((b) => b.rect));
      if (path) best = path;
    }

    out.push({ id: c.id, polyline: best ? simplifyCollinear(best) : [] });
  }

  return out;
};
