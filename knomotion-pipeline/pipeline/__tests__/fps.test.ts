/**
 * The pipeline's FPS constant must equal the renderer's declared fixed frame
 * rate. Every seconds→frames coercion in the pipeline goes through core/fps.ts,
 * so this one assertion keeps them all honest against the manifest.
 */

import { describe, it, expect } from 'vitest';
import { FPS, secondsToFrames } from '../core/fps';
import { loadRendererCapabilities } from '../core/capabilities/renderer-capabilities';

describe('FPS constant', () => {
  it('matches capability-manifest.json constraints.fpsFixed', async () => {
    const caps = await loadRendererCapabilities();
    expect(FPS).toBe(caps.constraints.fpsFixed);
    expect(caps.raw.constraints.fpsFixed).toBe(FPS); // not just the bridge's default
  });

  it('secondsToFrames rounds and never returns less than one frame', () => {
    expect(secondsToFrames(5)).toBe(5 * FPS);
    expect(secondsToFrames(0.01)).toBe(1);
    expect(secondsToFrames(1.234)).toBe(Math.round(1.234 * FPS));
  });
});
