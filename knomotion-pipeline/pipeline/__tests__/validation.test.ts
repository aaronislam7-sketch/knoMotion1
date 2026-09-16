/**
 * Stage 6 rule-engine tests.
 *
 * Uses the REAL renderer capability files (whatever is checked out). Assertions
 * are version-agnostic — they exercise engine behaviour, not specific enum
 * values that may differ across schema revisions.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { loadRendererCapabilities, type RendererCapabilities } from '../core/capabilities/renderer-capabilities';
import { validateConfig, rulesChecked } from '../stages/validation/validate';
import { KnoMotionVideoConfigSchema } from '../schemas/KnoMotionVideoConfig';

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

// ---------------------------------------------------------------------------
// Sept M2 guardrails — one deliberately broken fixture per rule
// ---------------------------------------------------------------------------

const line = (text: string, start = 0.3, exit = 4) => ({ text, beats: { start, exit } });
const textReveal = (texts: string[], start = 0.3, exit = 4) => ({
  midScene: 'textReveal',
  config: { lines: texts.map((t) => line(t, start, exit)), beats: { start, exit } },
});

describe('validateConfig — M2: slot_layout_reconcile', () => {
  it('layout options the renderer would silently default are an error', () => {
    const c: any = validConfig();
    c.scenes[0].config.layout = { type: 'rowStack' }; // no options.rows
    c.scenes[0].config.slots = { row1: textReveal(['a']) };
    const issues = validateConfig(c, caps);
    expect(rulesIn(issues, 'error')).toContain('slot_layout_reconcile');
    expect(issues.find((i) => i.rule === 'slot_layout_reconcile')!.message).toMatch(/options\.rows/);
  });

  it('a slot name that fits the family but the layout does not produce is an error (col3 on 2 columns)', () => {
    const c: any = validConfig();
    c.scenes[0].config.layout = { type: 'columnSplit', options: { columns: 2 } };
    c.scenes[0].config.slots = { col1: textReveal(['a']), col2: textReveal(['b']), col3: textReveal(['orphan']) };
    const issues = validateConfig(c, caps);
    const hit = issues.find((i) => i.rule === 'slot_layout_reconcile' && i.severity === 'error');
    expect(hit).toBeDefined();
    expect(hit!.path).toContain('col3');
  });

  it('the sideBySide→full vocabulary fold that orphans left/right is an error naming the fold', () => {
    // Parse through the contract so the coercion (and its _coercedFrom trace) runs, exactly as in the pipeline.
    const raw: any = validConfig();
    raw.scenes[0].config.layout = 'sideBySide';
    raw.scenes[0].config.slots = { left: textReveal(['A']), right: textReveal(['B']) };
    const parsed = KnoMotionVideoConfigSchema.parse(raw);
    expect((parsed.scenes[0].config.layout as any)._coercedFrom).toBe('sideBySide');
    const issues = validateConfig(parsed, caps);
    const hit = issues.find((i) => i.rule === 'slot_layout_reconcile' && i.severity === 'error');
    expect(hit).toBeDefined();
    expect(hit!.message).toMatch(/sideBySide/);
    expect(hit!.message).toMatch(/left, right/);
  });

  it('a well-formed 2-column scene using left/right aliases passes', () => {
    const c: any = validConfig();
    c.scenes[0].config.layout = { type: 'columnSplit', options: { columns: 2 } };
    c.scenes[0].config.slots = { left: textReveal(['A']), right: textReveal(['B']) };
    const errors = validateConfig(c, caps).filter((i) => i.severity === 'error');
    expect(errors, JSON.stringify(errors, null, 2)).toHaveLength(0);
  });
});

describe('validateConfig — M2: text_budget', () => {
  it('a line longer than the slot budget is an error', () => {
    const c: any = validConfig();
    c.scenes[0].config.slots.full = textReveal(['x'.repeat(200)]);
    const issues = validateConfig(c, caps);
    const hit = issues.find((i) => i.rule === 'text_budget');
    expect(hit?.severity).toBe('error');
    expect(hit!.path).toContain('lines[0].text');
  });

  it('more items than the slot can show is an error (checklist crammed into a half-height row)', () => {
    const c: any = validConfig();
    c.scenes[0].config.layout = { type: 'rowStack', options: { rows: 2 } };
    c.scenes[0].config.slots = {
      row1: textReveal(['Title']),
      row2: { midScene: 'checklist', config: { items: Array.from({ length: 9 }, (_, i) => ({ text: `Item ${i}` })), beats: { start: 0.3, exit: 4 } } },
    };
    const issues = validateConfig(c, caps);
    expect(issues.some((i) => i.rule === 'text_budget' && i.severity === 'error' && /items/.test(i.path))).toBe(true);
  });

  it('the same text in a narrower column trips the budget where the full slot does not', () => {
    const text = 'w'.repeat(70);
    const full: any = validConfig();
    full.scenes[0].config.slots.full = textReveal([text]);
    expect(validateConfig(full, caps).filter((i) => i.rule === 'text_budget')).toHaveLength(0);

    const cols: any = validConfig();
    cols.scenes[0].config.layout = { type: 'columnSplit', options: { columns: 2 } };
    cols.scenes[0].config.slots = { col1: textReveal([text]), col2: textReveal(['ok']) };
    expect(validateConfig(cols, caps).filter((i) => i.rule === 'text_budget')).toHaveLength(1);
  });
});

describe('validateConfig — M2: content_shape', () => {
  it('a mid-scene outside the planned shape subset is an error carrying the allowed set', () => {
    const c: any = validConfig(); // textReveal
    const issues = validateConfig(c, caps, { contentShapes: { s1: 'structure' } });
    const hit = issues.find((i) => i.rule === 'content_shape');
    expect(hit?.severity).toBe('error');
    expect(hit!.expected).toMatch(/gridCards/);
  });

  it('the header slot is exempt; a mid-scene inside the subset passes', () => {
    const c: any = validConfig();
    c.scenes[0].config.slots = { header: textReveal(['Title']), full: { midScene: 'bigNumber', config: { number: '42', beats: { start: 0.3, exit: 4 } } } };
    const issues = validateConfig(c, caps, { contentShapes: { s1: 'quantity' } });
    expect(issues.filter((i) => i.rule === 'content_shape')).toHaveLength(0);
  });

  it('without a shape map (hand-authored config) the rule is silent', () => {
    const c: any = validConfig();
    expect(validateConfig(c, caps).filter((i) => i.rule === 'content_shape')).toHaveLength(0);
  });
});

describe('validateConfig — M2: beat_timing upgrade', () => {
  it('a beat outside the scene is an error even when under the old 20s escape hatch', () => {
    const c: any = validConfig(); // 5s scene
    c.scenes[0].config.slots.full = textReveal(['a'], 0.3, 9);
    const hit = validateConfig(c, caps).find((i) => i.rule === 'beat_timing' && /outside the scene/.test(i.message));
    expect(hit?.severity).toBe('error');
  });

  it('content visible for less than the minimum readable time is an error', () => {
    const c: any = validConfig();
    c.scenes[0].config.slots.full.config.lines[0].beats = { start: 3.0, exit: 3.5 };
    const hit = validateConfig(c, caps).find((i) => i.rule === 'beat_timing' && /minimum is/.test(i.message));
    expect(hit?.severity).toBe('error');
  });

  it('textReveal lines without per-line beats are an error', () => {
    const c: any = validConfig();
    c.scenes[0].config.slots.full.config.lines = [{ text: 'no beats here' }];
    const hit = validateConfig(c, caps).find((i) => i.rule === 'beat_timing' && /needs beats\.start/.test(i.message));
    expect(hit?.severity).toBe('error');
  });

  it('a slot item without beats.exit is an error (renderer would drop it ~2s in)', () => {
    const c: any = validConfig();
    c.scenes[0].config.slots.full.config.beats = { start: 0.3 };
    const hit = validateConfig(c, caps).find((i) => i.rule === 'beat_timing' && /beats\.exit is required/.test(i.message));
    expect(hit?.severity).toBe('error');
  });

  it('content that exits long before the scene ends is an error (blank tail)', () => {
    const c: any = validConfig();
    c.scenes[0].durationInFrames = 300; // 10s, content exits at 4s
    const hit = validateConfig(c, caps).find((i) => i.rule === 'beat_timing' && /blank screen/.test(i.message));
    expect(hit?.severity).toBe('error');
  });

  it('a long line shown briefly is a reading-time warning, not an error', () => {
    const c: any = validConfig();
    c.scenes[0].config.slots.full = textReveal(['A sentence that takes a moment to read all the way through, honestly'], 2.5, 4);
    const issues = validateConfig(c, caps);
    expect(issues.some((i) => i.rule === 'beat_timing' && i.severity === 'warning' && /comfortable to read/.test(i.message))).toBe(true);
    expect(issues.filter((i) => i.rule === 'beat_timing' && i.severity === 'error')).toHaveLength(0);
  });
});

describe('validateConfig — M2: bookkeeping', () => {
  it('every rule the engine can emit is declared in rulesChecked()', () => {
    const declared = new Set(rulesChecked());
    for (const r of ['unknown_keys', 'slot_layout_reconcile', 'text_budget', 'content_shape', 'beat_timing']) {
      expect(declared, r).toContain(r);
    }
  });
});
