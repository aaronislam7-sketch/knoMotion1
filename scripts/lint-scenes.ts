import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import { computeLayout } from '../KnoMotion-Videos/src/layout/computeLayout.ts';
import { inflate, overlaps, polylineIntersectsRect } from '../KnoMotion-Videos/src/layout/geom.ts';

const SceneSchema = z.object({
  schema_version: z.string(),
  template_id: z.string().optional(),
  stage: z.object({ width: z.number(), height: z.number() }).optional(),
  layers: z.array(z.any()).optional(),
  beats: z.record(z.number()).optional().default({}),
  meta: z
    .object({
      title: z.string().optional(),
      allowRawColors: z.boolean().optional(),
    })
    .optional(),
  style_tokens: z
    .object({
      colors: z.record(z.string()).optional(),
      mode: z.string().optional(),
      texture: z.object({ paper: z.boolean().optional() }).optional(),
    })
    .optional(),
  fill: z.object({ texts: z.record(z.string()).optional() }).optional(),
});

const SCENES_DIR = path.join(process.cwd(), 'KnoMotion-Videos', 'src', 'scenes');

const isHexColor = (s: string) => /^#([A-Fa-f0-9]{3}){1,2}$/.test(s.trim());

const main = async () => {
  const files = fs.readdirSync(SCENES_DIR).filter((f) => f.endsWith('.json'));
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const file of files) {
    const full = path.join(SCENES_DIR, file);
    const raw = fs.readFileSync(full, 'utf-8');
    let scene: any;
    try {
      scene = JSON.parse(raw);
    } catch (e) {
      errors.push(`${file}: invalid JSON`);
      continue;
    }

    // Schema version
    const parse = SceneSchema.safeParse(scene);
    if (!parse.success) {
      errors.push(`${file}: schema invalid - ${parse.error.issues.map((i) => i.message).join('; ')}`);
      continue;
    }
    const s = parse.data;

    if (!String(s.schema_version || '').startsWith('5.')) {
      warnings.push(`${file}: schema_version is not v5.x (skipping strict checks)`);
      continue;
    }

    // Header and subheader word limits
    const header = s.fill?.texts?.title || s.fill?.texts?.welcome || s.meta?.title || '';
    if (header) {
      const count = header.trim().split(/\s+/).length;
      if (count > 12) warnings.push(`${file}: header has ${count} words (>12)`);
    }
    const sub = s.fill?.texts?.subtitle || s.fill?.texts?.sub || '';
    if (sub) {
      const count = sub.trim().split(/\s+/).length;
      if (count > 16) warnings.push(`${file}: subtitle has ${count} words (>16)`);
    }

    // Beats at least 0.8s apart
    const beatVals = Object.values(s.beats || {}).slice().sort((a, b) => a - b);
    for (let i = 1; i < beatVals.length; i++) {
      const gap = beatVals[i] - beatVals[i - 1];
      if (gap < 0.8) warnings.push(`${file}: beats too close (${gap.toFixed(2)}s < 0.8s)`);
    }

    // Color tokens check
    const allowRaw = s.meta?.allowRawColors === true;
    const colors = s.style_tokens?.colors || {};
    if (!allowRaw) {
      for (const [k, v] of Object.entries(colors)) {
        if (typeof v === 'string' && isHexColor(v)) {
          warnings.push(`${file}: color ${k} uses raw hex ${v} (prefer tokens). Add meta.allowRawColors to override.`);
        }
      }
    }

    // Delight budget (≤ 1 among popInSpring, elastic, highlightSwipe)
    const delights: string[] = (s.style_tokens as any)?.delights || [];
    const counted = delights.filter((d) => ['popInSpring', 'elastic', 'highlightSwipe'].includes(d));
    if (counted.length > 1) errors.push(`${file}: delightBudget exceeded (${counted.length} > 1)`);

    // Geometry assertions only if layers present
    if (Array.isArray(s.layers) && s.layers.length > 0) {
      const plan = computeLayout(s);
      const pad = (s.layout?.minPad ?? 12) + (s.layout?.stroke ?? 6) / 2;
      const boxes = plan.boxes.map((b) => ({ id: b.id, r: { x: b.x, y: b.y, w: b.w, h: b.h } }));
      const inflated = boxes.map((b) => ({ id: b.id, r: inflate(b.r, pad) }));
      for (let i = 0; i < inflated.length; i++) {
        for (let j = i + 1; j < inflated.length; j++) {
          if (overlaps(inflated[i].r, inflated[j].r)) errors.push(`${file}: rects overlap (${inflated[i].id} vs ${inflated[j].id})`);
        }
      }
      for (const c of plan.connectors) {
        for (const b of inflated) {
          if (polylineIntersectsRect(c.polyline, b.r)) errors.push(`${file}: connector ${c.id} intersects box ${b.id}`);
        }
      }
    }
  }

  const out = [...warnings, ...errors];
  out.forEach((m) => console.warn(m));
  if (errors.length > 0) {
    console.error(`\nScene linting failed with ${errors.length} error(s).`);
    process.exit(1);
  }
};

main().catch((e) => {
  console.error('lint-scenes: fatal error', e);
  process.exit(1);
});
