import { clampRectToStage, inflate, overlaps } from './geom.ts';
import type { LayoutConfig, MeasuredLayer, Rect, Stage } from './types.ts';

const tryPositions = (
  start: Rect,
  stage: { w: number; h: number },
  obstacles: Rect[],
  pad: number,
  grid: number,
  maxNudges: number
): Rect => {
  const dirs: Array<[number, number]> = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  const startClamped = clampRectToStage(start, stage);
  const inflatedObstacles = obstacles.map((r) => inflate(r, pad));
  const collide = (r: Rect) => inflatedObstacles.some((o) => overlaps(r, o));

  if (!collide(startClamped)) return startClamped;

  for (let step = 1; step <= maxNudges; step++) {
    for (const [dx, dy] of dirs) {
      const cand: Rect = {
        x: startClamped.x + dx * grid * step,
        y: startClamped.y + dy * grid * step,
        w: startClamped.w,
        h: startClamped.h,
      };
      const clamped = clampRectToStage(cand, stage);
      if (!collide(clamped)) return clamped;
    }
  }

  return startClamped; // give up
};

export const initialPlacement = (
  measured: MeasuredLayer[],
  stage: Stage,
  cfg: LayoutConfig
): { id: string; rect: Rect }[] => {
  const w = stage.width;
  const h = stage.height;
  const margin = cfg.grid;

  const topBandY = margin;
  const midBandY = Math.round(h * 0.45);
  const bottomBandY = h - margin * 2;

  let topCol = margin;
  let midCol = margin;
  let bottomCol = margin;

  const placements: { id: string; rect: Rect }[] = [];

  for (const layer of measured) {
    if (layer.kind === 'connector') continue;

    // Respect explicit positions
    const hasPos = layer.box?.x !== undefined && layer.box?.y !== undefined;
    const startRect: Rect = hasPos
      ? { x: layer.box!.x!, y: layer.box!.y!, w: layer.measured.w, h: layer.measured.h }
      : (() => {
          // Determine band by role/kind
          const role = (layer.role || '').toLowerCase();
          const isTitle = role.includes('title') || role.includes('header');
          const isCTA = role.includes('cta') || role.includes('footer') || role.includes('button');

          let y = midBandY;
          if (isTitle) y = topBandY;
          else if (isCTA) y = bottomBandY;
          else y = midBandY;

          // decide column
          let x: number;
          if (y === topBandY) {
            x = topCol;
            topCol += layer.measured.w + cfg.grid;
          } else if (y === bottomBandY) {
            x = bottomCol;
            bottomCol += layer.measured.w + cfg.grid;
          } else {
            x = midCol;
            midCol += layer.measured.w + cfg.grid;
          }

          return { x, y, w: layer.measured.w, h: layer.measured.h };
        })();

    // Align to grid
    const xg = Math.max(0, Math.min(w - startRect.w, Math.round(startRect.x / cfg.grid) * cfg.grid));
    const yg = Math.max(0, Math.min(h - startRect.h, Math.round(startRect.y / cfg.grid) * cfg.grid));

    placements.push({ id: layer.id, rect: { x: xg, y: yg, w: startRect.w, h: startRect.h } });
  }

  return placements;
};

export const resolveOverlaps = (
  measured: MeasuredLayer[],
  initial: { id: string; rect: Rect }[],
  stage: Stage,
  cfg: LayoutConfig
): { id: string; rect: Rect }[] => {
  const byId = new Map(initial.map((p) => [p.id, { ...p.rect }]));

  // obstacles include locked items (we still include them in byId)
  const lockedIds = new Set(measured.filter((l) => l.lock && l.kind !== 'connector').map((l) => l.id));

  // Sort by priority then id for determinism (lower priority moves first)
  const movable = measured
    .filter((l) => l.kind !== 'connector')
    .map((l) => ({
      id: l.id,
      priority: l.priority ?? 3,
      lock: !!l.lock,
      minPad: l.minPad ?? 0,
    }))
    .sort((a, b) => (a.priority - b.priority) || a.id.localeCompare(b.id));

  const basePad = cfg.minPad + cfg.stroke / 2;

  // Sweep: place items in order, only colliding against already-placed items (and locked ones)
  const placedOrder: string[] = [];
  for (const item of movable) {
    const rect = byId.get(item.id)!;
    const obstacles: Rect[] = [];
    // Already placed items are obstacles
    for (const pid of placedOrder) {
      const r = byId.get(pid)!;
      obstacles.push(r);
    }
    // Include any locked items not yet placed
    for (const lid of lockedIds) {
      if (lid === item.id) continue;
      const r = byId.get(lid);
      if (r) obstacles.push(r);
    }

    const pad = basePad + item.minPad;
    const placed = tryPositions(rect, { w: stage.width, h: stage.height }, obstacles, pad, cfg.grid, cfg.maxNudges);
    byId.set(item.id, placed);
    placedOrder.push(item.id);
  }

  // Final relaxation pass: if any inflated overlaps remain, push lower-priority items away
  const itemsById = new Map(movable.map((m) => [m.id, m]));
  const basePad2 = basePad;
  const entries = Array.from(byId.entries());
  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const [idA, rA0] = entries[i];
      const [idB, rB0] = entries[j];
      let rA = byId.get(idA)!;
      let rB = byId.get(idB)!;
      const padA = basePad2 + (itemsById.get(idA)?.minPad ?? 0);
      const padB = basePad2 + (itemsById.get(idB)?.minPad ?? 0);
      const infA = { x: rA.x - padA, y: rA.y - padA, w: rA.w + 2 * padA, h: rA.h + 2 * padA };
      const infB = { x: rB.x - padB, y: rB.y - padB, w: rB.w + 2 * padB, h: rB.h + 2 * padB };
      if (overlaps(infA as any, infB as any)) {
        const a = itemsById.get(idA)!;
        const b = itemsById.get(idB)!;
        const moveB = (b.priority ?? 3) >= (a.priority ?? 3); // move lower priority (higher number)
        for (let step = 1; step <= cfg.maxNudges + 2; step++) {
          const dx = (rB.x + rB.w / 2) - (rA.x + rA.w / 2);
          const dy = (rB.y + rB.h / 2) - (rA.y + rA.h / 2);
          const dirX = Math.sign(dx) || 1;
          const dirY = Math.sign(dy) || 1;
          if (moveB) {
            const cand = clampRectToStage({ x: rB.x + dirX * cfg.grid, y: rB.y + dirY * cfg.grid, w: rB.w, h: rB.h }, { w: stage.width, h: stage.height });
            const pad = basePad2 + (itemsById.get(idB)?.minPad ?? 0);
            const inflCand = { x: cand.x - pad, y: cand.y - pad, w: cand.w + 2 * pad, h: cand.h + 2 * pad };
            if (!overlaps(inflCand as any, infA as any)) { rB = cand; byId.set(idB, rB); break; }
          } else {
            const cand = clampRectToStage({ x: rA.x - dirX * cfg.grid, y: rA.y - dirY * cfg.grid, w: rA.w, h: rA.h }, { w: stage.width, h: stage.height });
            const pad = basePad2 + (itemsById.get(idA)?.minPad ?? 0);
            const inflCand = { x: cand.x - pad, y: cand.y - pad, w: cand.w + 2 * pad, h: cand.h + 2 * pad };
            if (!overlaps(inflCand as any, infB as any)) { rA = cand; byId.set(idA, rA); break; }
          }
        }
      }
    }
  }

  return Array.from(byId.entries()).map(([id, rect]) => ({ id, rect }));
};
