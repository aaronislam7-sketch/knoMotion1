import type { Point, Rect } from './types.ts';

export const inflate = (r: Rect, pad: number): Rect => ({
  x: r.x - pad,
  y: r.y - pad,
  w: r.w + pad * 2,
  h: r.h + pad * 2,
});

export const union = (a: Rect, b: Rect): Rect => {
  const x1 = Math.min(a.x, b.x);
  const y1 = Math.min(a.y, b.y);
  const x2 = Math.max(a.x + a.w, b.x + b.w);
  const y2 = Math.max(a.y + a.h, b.y + b.h);
  return { x: x1, y: y1, w: x2 - x1, h: y2 - y1 };
};

export const overlaps = (a: Rect, b: Rect): boolean => {
  return !(
    a.x + a.w <= b.x ||
    b.x + b.w <= a.x ||
    a.y + a.h <= b.y ||
    b.y + b.h <= a.y
  );
};

export const containsPoint = (r: Rect, p: Point): boolean => {
  return p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h;
};

export const clampRectToStage = (r: Rect, stage: { w: number; h: number }): Rect => {
  let x = Math.max(0, Math.min(stage.w - r.w, r.x));
  let y = Math.max(0, Math.min(stage.h - r.h, r.y));
  return { x, y, w: r.w, h: r.h };
};

const orientation = (a: Point, b: Point, c: Point): number => {
  const val = (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y);
  if (val === 0) return 0;
  return val > 0 ? 1 : 2; // 1: clockwise, 2: counterclockwise
};

const onSegment = (a: Point, b: Point, c: Point): boolean => {
  return (
    Math.min(a.x, c.x) <= b.x && b.x <= Math.max(a.x, c.x) &&
    Math.min(a.y, c.y) <= b.y && b.y <= Math.max(a.y, c.y)
  );
};

export const segmentsIntersect = (p1: Point, p2: Point, q1: Point, q2: Point): boolean => {
  const o1 = orientation(p1, p2, q1);
  const o2 = orientation(p1, p2, q2);
  const o3 = orientation(q1, q2, p1);
  const o4 = orientation(q1, q2, p2);

  if (o1 !== o2 && o3 !== o4) return true;

  if (o1 === 0 && onSegment(p1, q1, p2)) return true;
  if (o2 === 0 && onSegment(p1, q2, p2)) return true;
  if (o3 === 0 && onSegment(q1, p1, q2)) return true;
  if (o4 === 0 && onSegment(q1, p2, q2)) return true;
  return false;
};

export const segmentIntersectsRect = (p1: Point, p2: Point, r: Rect): boolean => {
  // Trivial accept if either inside
  if (containsPoint(r, p1) || containsPoint(r, p2)) return true;
  // Check against each rectangle edge
  const corners: Point[] = [
    { x: r.x, y: r.y },
    { x: r.x + r.w, y: r.y },
    { x: r.x + r.w, y: r.y + r.h },
    { x: r.x, y: r.y + r.h },
  ];
  const edges: [Point, Point][] = [
    [corners[0], corners[1]],
    [corners[1], corners[2]],
    [corners[2], corners[3]],
    [corners[3], corners[0]],
  ];
  return edges.some(([a, b]) => segmentsIntersect(p1, p2, a, b));
};

export const polylineIntersectsRect = (poly: Point[], r: Rect): boolean => {
  for (let i = 0; i < poly.length - 1; i++) {
    if (segmentIntersectsRect(poly[i], poly[i + 1], r)) return true;
  }
  return false;
};

export const simplifyCollinear = (poly: Point[]): Point[] => {
  if (poly.length <= 2) return poly.slice();
  const res: Point[] = [poly[0]];
  for (let i = 1; i < poly.length - 1; i++) {
    const a = res[res.length - 1];
    const b = poly[i];
    const c = poly[i + 1];
    const abx = b.x - a.x;
    const aby = b.y - a.y;
    const bcx = c.x - b.x;
    const bcy = c.y - b.y;
    // Check if vectors are collinear (axis-aligned or same slope)
    if (abx * bcy - aby * bcx === 0) {
      // b is collinear, check if between a and c axis-aligned or in-line
      // If both segments go same direction, drop b
      const sameDir = Math.sign(abx) === Math.sign(bcx) && Math.sign(aby) === Math.sign(bcy);
      if (sameDir) continue;
    }
    res.push(b);
  }
  res.push(poly[poly.length - 1]);
  return res;
};

export const centerOf = (r: Rect): Point => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });
