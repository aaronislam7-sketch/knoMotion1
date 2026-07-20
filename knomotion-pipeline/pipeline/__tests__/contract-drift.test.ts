/**
 * Schema-drift guardrail (decision #3).
 *
 * Asserts the pipeline's KnoMotionVideoConfig mirror stays compatible with the
 * renderer's VideoConfigSchema. The key invariant is:
 *
 *     pipeline-valid  =>  renderer-valid     (everything the pipeline emits renders)
 *
 * The pipeline is intentionally STRICTER (canonical mid-scene keys only), so the
 * reverse does not hold and is not asserted.
 *
 * If the renderer Zod schema cannot be imported (e.g. renderer deps not installed
 * in this environment), the test is skipped rather than failing — run it in a
 * fully-installed environment / CI to actually catch drift.
 */

import { describe, it, expect } from 'vitest';
import { KnoMotionVideoConfigSchema } from '../schemas/KnoMotionVideoConfig';

let rendererSchema: { safeParse: (v: unknown) => { success: boolean } } | undefined;
try {
  // Variable specifier so the type-checker doesn't follow into the renderer
  // package (whose deps may not be installed here). Resolved at runtime only.
  const spec = '../../../KnoMotion-Videos/src/sdk/schemas/videoConfig.schema';
  const mod = await import(/* @vite-ignore */ spec);
  rendererSchema = (mod as any).VideoConfigSchema;
} catch {
  rendererSchema = undefined;
}

const baseScene = (midScene: string, transitionType = 'fade') => ({
  id: 's1',
  durationInFrames: 150,
  transition: { type: transitionType },
  config: {
    background: { preset: 'sunriseGradient' },
    layout: { type: 'full' },
    slots: { full: { midScene, config: { lines: [{ text: 'Hi', beats: { start: 0.3, exit: 4 } }], beats: { start: 0.3, exit: 4 } } } },
  },
});

const fixtures = {
  validCanonical: { scenes: [baseScene('textReveal')], format: 'desktop' },
  aliasKey: { scenes: [baseScene('gridCardReveal')], format: 'desktop' }, // pipeline rejects, renderer accepts
  invalidTransition: { scenes: [baseScene('textReveal', 'warp')], format: 'desktop' }, // both reject
};

describe('contract drift: pipeline-valid => renderer-valid', () => {
  it.skipIf(!rendererSchema)('every pipeline-accepted config is renderer-accepted', () => {
    for (const [name, fixture] of Object.entries(fixtures)) {
      const pipelineValid = KnoMotionVideoConfigSchema.safeParse(fixture).success;
      const rendererValid = rendererSchema!.safeParse(fixture).success;
      if (pipelineValid) {
        expect(rendererValid, `fixture "${name}": pipeline accepted but renderer rejected — drift!`).toBe(true);
      }
    }
  });

  it.skipIf(!rendererSchema)('canonical config is accepted by both; pipeline is stricter on aliases', () => {
    expect(KnoMotionVideoConfigSchema.safeParse(fixtures.validCanonical).success).toBe(true);
    expect(rendererSchema!.safeParse(fixtures.validCanonical).success).toBe(true);
    // alias rejected by pipeline (canonical-only) even though renderer allows it
    expect(KnoMotionVideoConfigSchema.safeParse(fixtures.aliasKey).success).toBe(false);
  });
});
