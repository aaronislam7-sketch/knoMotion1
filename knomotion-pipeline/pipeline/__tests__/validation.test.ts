/**
 * Stage 6 rule-engine tests.
 *
 * Uses the REAL renderer capability files (whatever is checked out). Assertions
 * are version-agnostic — they exercise engine behaviour, not specific enum
 * values that may differ across schema revisions.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { loadRendererCapabilities, type RendererCapabilities } from '../core/capabilities/renderer-capabilities';
import { validateConfig } from '../stages/validation/validate';

let caps: RendererCapabilities;
beforeAll(async () => {
  caps = await loadRendererCapabilities();
});

const rulesIn = (issues: ReturnType<typeof validateConfig>, severity?: 'error' | 'warning') =>
  new Set(issues.filter((i) => !severity || i.severity === severity).map((i) => i.rule));

/** A baseline config that should pass every rule. */
const validConfig = () => ({
  scenes: [
    {
      id: 's1',
      durationInFrames: 150,
      config: {
        background: { preset: 'sunriseGradient' },
        layout: { type: 'full' },
        slots: {
          full: {
            midScene: 'textReveal',
            config: { lines: [{ text: 'Hello', emphasis: 'high', beats: { start: 0.3, exit: 4 } }], beats: { start: 0.3, exit: 4 } },
          },
        },
      },
    },
  ],
  format: 'desktop',
});

describe('validateConfig — baseline', () => {
  it('valid config produces zero errors', () => {
    const issues = validateConfig(validConfig() as any, caps);
    const errors = issues.filter((i) => i.severity === 'error');
    expect(errors, JSON.stringify(errors, null, 2)).toHaveLength(0);
  });
});

describe('validateConfig — one broken fixture per rule', () => {
  it('midscene_name: alias key is rejected', () => {
    const c = validConfig();
    (c.scenes[0].config.slots.full as any).midScene = 'gridCardReveal';
    expect(rulesIn(validateConfig(c as any, caps), 'error')).toContain('midscene_name');
  });

  it('layout_type: unknown layout is rejected', () => {
    const c = validConfig();
    (c.scenes[0].config.layout as any).type = 'spiral';
    expect(rulesIn(validateConfig(c as any, caps), 'error')).toContain('layout_type');
  });

  it('slot_names: a slot name invalid for the layout is rejected', () => {
    const c: any = validConfig();
    c.scenes[0].config.slots = { banana: c.scenes[0].config.slots.full };
    expect(rulesIn(validateConfig(c, caps), 'error')).toContain('slot_names');
  });

  it('slots_filled: a declared layout slot left empty is flagged', () => {
    const c: any = validConfig();
    c.scenes[0].config.layout = { type: 'columnSplit', options: { columns: 2 } };
    c.scenes[0].config.slots = {
      col1: { midScene: 'textReveal', config: { lines: [{ text: 'a', beats: { start: 0.1, exit: 2 } }], beats: { start: 0.1, exit: 2 } } },
      // col2 intentionally missing
    };
    expect(rulesIn(validateConfig(c, caps), 'error')).toContain('slots_filled');
  });

  it('sidebyside_layout: sideBySide outside layout:full is rejected', () => {
    const c: any = validConfig();
    c.scenes[0].config.layout = { type: 'columnSplit', options: { columns: 2 } };
    c.scenes[0].config.slots = {
      col1: { midScene: 'sideBySide', config: { left: { title: 'A' }, right: { title: 'B' }, beats: { start: 0.5 } } },
      col2: { midScene: 'textReveal', config: { lines: [{ text: 'a', beats: { start: 0.1, exit: 2 } }], beats: { start: 0.1, exit: 2 } } },
    };
    expect(rulesIn(validateConfig(c, caps), 'error')).toContain('sidebyside_layout');
  });

  it('midscene_config: missing required field is rejected (ajv deep)', () => {
    const c: any = validConfig();
    delete c.scenes[0].config.slots.full.config.lines; // textReveal requires lines
    expect(rulesIn(validateConfig(c, caps), 'error')).toContain('midscene_config');
  });

  it('beat_timing: start >= exit is rejected', () => {
    const c: any = validConfig();
    c.scenes[0].config.slots.full.config.lines[0].beats = { start: 5, exit: 2 };
    expect(rulesIn(validateConfig(c, caps), 'error')).toContain('beat_timing');
  });

  it('duration_bounds: non-positive duration is rejected', () => {
    const c: any = validConfig();
    c.scenes[0].durationInFrames = 0;
    expect(rulesIn(validateConfig(c, caps), 'error')).toContain('duration_bounds');
  });

  it('audio_url: placeholder audio host is rejected', () => {
    const c: any = validConfig();
    c.scenes[0].audio = { narration: { src: 'https://example.com/voice.mp3' } };
    expect(rulesIn(validateConfig(c, caps), 'error')).toContain('audio_url');
  });

  it('text_length: too many lines is a warning', () => {
    const c: any = validConfig();
    c.scenes[0].config.slots.full.config.lines = Array.from({ length: 12 }, (_, i) => ({ text: `line ${i}`, beats: { start: 0.1, exit: 2 } }));
    expect(rulesIn(validateConfig(c, caps), 'warning')).toContain('text_length');
  });

  it('lottie_key: unknown heroRef lottie key is a warning', () => {
    const c: any = validConfig();
    c.scenes[0].config.slots.full = {
      midScene: 'heroText',
      config: { heroType: 'lottie', heroRef: 'definitely-not-a-real-key', beats: { entrance: 0.5, exit: 4 } },
    };
    expect(rulesIn(validateConfig(c, caps), 'warning')).toContain('lottie_key');
  });
});
