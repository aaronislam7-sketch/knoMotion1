import { defaultLayoutConfig } from './types.ts';
import type { LayoutPlan, LayerInput, SceneInputV5 } from './types.ts';
import { measureLayers, shrinkTextOnce } from './measure.ts';
import { initialPlacement, resolveOverlaps } from './pack.ts';
import { inflate, overlaps, polylineIntersectsRect, simplifyCollinear } from './geom.ts';
import { routeConnectors } from './router.ts';

export function computeLayout(scene: SceneInputV5): LayoutPlan {
  const stageW = scene.stage?.width ?? 1920;
  const stageH = scene.stage?.height ?? 1080;

  const cfg = { ...defaultLayoutConfig(), ...(scene.layout ?? {}) };

  const rawLayers: LayerInput[] = (scene.layers ?? []).slice();

  // Deterministic ordering: priority then id
  rawLayers.sort((a, b) => (a.priority ?? 3) - (b.priority ?? 3) || a.id.localeCompare(b.id));

  const measured = measureLayers(rawLayers);

  // Prepare initial placement for non-connector layers
  const placedInitial = initialPlacement(measured, { width: stageW, height: stageH }, cfg);

  // Resolve overlaps with greedy nudging and relaxation, respecting locks and priority
  let placed = resolveOverlaps(measured, placedInitial, { width: stageW, height: stageH }, cfg);

  // If still overlaps and allowFontShrink, attempt shrinking text up to 2 steps then re-pack
  const warnings: string[] = [];
  if (cfg.allowFontShrink) {
    // detect overlaps
    const boxes = placed.map((p) => ({ id: p.id, rect: p.rect }));
    const inflated = boxes.map((b) => ({ id: b.id, r: inflate(b.rect, cfg.minPad + cfg.stroke / 2) }));
    let anyOverlap = false;
    for (let i = 0; i < inflated.length; i++) {
      for (let j = i + 1; j < inflated.length; j++) {
        if (overlaps(inflated[i].r, inflated[j].r)) { anyOverlap = true; break; }
      }
      if (anyOverlap) break;
    }
    if (anyOverlap) {
      let updated = measured.slice();
      let shrinks = 0;
      for (let step = 0; step < 2 && anyOverlap; step++) {
        updated = updated.map((ml) => (ml.kind === 'text' ? shrinkTextOnce(ml, cfg.fontShrinkStep) : ml));
        const reinit = initialPlacement(updated, { width: stageW, height: stageH }, cfg);
        placed = resolveOverlaps(updated, reinit, { width: stageW, height: stageH }, cfg);
        // re-check
        const boxes2 = placed.map((p) => ({ id: p.id, rect: p.rect }));
        const inf2 = boxes2.map((b) => ({ id: b.id, r: inflate(b.rect, cfg.minPad + cfg.stroke / 2) }));
        anyOverlap = false;
        for (let i = 0; i < inf2.length; i++) {
          for (let j = i + 1; j < inf2.length; j++) {
            if (overlaps(inf2[i].r, inf2[j].r)) { anyOverlap = true; break; }
          }
          if (anyOverlap) break;
        }
        shrinks++;
      }
      if (shrinks > 0) warnings.push(`fontShrinkApplied:${shrinks}`);
    }
  }

  // Build boxes result array
  const boxes = placed
    .map((p) => {
      const layer = measured.find((l) => l.id === p.id)!;
      return { id: p.id, x: p.rect.x, y: p.rect.y, w: p.rect.w, h: p.rect.h, kind: layer.kind, role: layer.role };
    })
    .sort((a, b) => a.id.localeCompare(b.id));

  const connectorLayers = measured.filter((l) => l.kind === 'connector');
  const connectorInputs = connectorLayers.map((l) => ({ id: l.id, fromId: l.fromId, toId: l.toId }));

  const routed = routeConnectors(
    boxes.map((b) => ({ id: b.id, rect: { x: b.x, y: b.y, w: b.w, h: b.h } })),
    connectorInputs,
    { w: stageW, h: stageH },
    cfg
  ).map((c) => ({ id: c.id, polyline: simplifyCollinear(c.polyline) }));

  // Validate
  const inflatedBoxes = boxes.map((b) => ({ id: b.id, r: inflate({ x: b.x, y: b.y, w: b.w, h: b.h }, cfg.minPad + cfg.stroke / 2) }));
  // Rect-rect overlaps
  for (let i = 0; i < inflatedBoxes.length; i++) {
    for (let j = i + 1; j < inflatedBoxes.length; j++) {
      if (overlaps(inflatedBoxes[i].r, inflatedBoxes[j].r)) warnings.push(`overlap:${inflatedBoxes[i].id}:${inflatedBoxes[j].id}`);
    }
  }
  // Segment-rect
  for (const c of routed) {
    for (const ib of inflatedBoxes) {
      if (polylineIntersectsRect(c.polyline, ib.r)) warnings.push(`connectorIntersect:${c.id}:${ib.id}`);
    }
  }

  return {
    stage: { w: stageW, h: stageH },
    boxes,
    connectors: routed,
    warnings,
  };
}

export default computeLayout;
