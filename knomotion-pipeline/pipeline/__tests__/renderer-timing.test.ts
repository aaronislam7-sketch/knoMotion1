/**
 * Renderer timing guardrail (M1.4).
 *
 * The pipeline sizes every scene from its narration; the composition length
 * the renderer computes must agree with the timeline GenericVideoPlayer
 * actually plays, including per-scene `transition.durationInFrames`
 * overrides. Imports the renderer's transitions module at runtime the same
 * way contract-drift.test.ts does; skipped when renderer deps aren't installed.
 */

import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

let calc: ((scenes: any[], d?: number) => number) | undefined;
try {
  const spec = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../KnoMotion-Videos/src/sdk/transitions/index');
  const mod = await import(/* @vite-ignore */ spec);
  calc = (mod as any).calculateTransitionSeriesDuration;
} catch {
  calc = undefined;
}

describe('calculateTransitionSeriesDuration (renderer)', () => {
  it.skipIf(!calc)('subtracts the default overlap per transition when none is overridden', () => {
    expect(calc!([{ durationInFrames: 100 }, { durationInFrames: 100, transition: { type: 'fade' } }, { durationInFrames: 100, transition: { type: 'slide' } }], 20)).toBe(260);
    expect(calc!([{ durationInFrames: 100 }], 20)).toBe(100);
  });

  it.skipIf(!calc)('honours per-scene transition.durationInFrames (the transition INTO scene i)', () => {
    const scenes = [
      { durationInFrames: 100 },
      { durationInFrames: 100, transition: { type: 'fade', durationInFrames: 5 } },
      { durationInFrames: 100, transition: { type: 'slide' } },
      { durationInFrames: 100, transition: { type: 'iris', durationInFrames: 45 } },
    ];
    expect(calc!(scenes, 20)).toBe(400 - 5 - 20 - 45);
    // the first scene's own transition is never played, so it must not count
    expect(calc!([{ durationInFrames: 100, transition: { type: 'fade', durationInFrames: 99 } }, { durationInFrames: 100, transition: { type: 'fade' } }], 20)).toBe(180);
  });
});
