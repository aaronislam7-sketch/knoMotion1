/**
 * VideoConfig Schema Validation Tests — S1a test artifact
 *
 * Run: npx tsx KnoMotion-Videos/src/sdk/schemas/videoConfig.test.ts
 *
 * Validates:
 * 1. The 3-scene defaultProps payload parses successfully
 * 2. A minimal valid payload parses successfully
 * 3. Invalid payloads are correctly rejected
 * 4. Audio schemas compose correctly into the full schema
 */

import { VideoConfigSchema } from './videoConfig.schema';

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (e: unknown) {
    failed++;
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`  ✗ ${name}`);
    console.error(`    ${msg}`);
  }
}

function assert(condition: boolean, msg: string) {
  if (!condition) throw new Error(`Assertion failed: ${msg}`);
}

console.log('\n=== VideoConfig Schema Validation Tests ===\n');

// ─── Test 1: defaultProps 3-scene payload ───────────────────────────────

test('defaultProps 3-scene payload parses successfully', () => {
  const payload = {
    scenes: [
      {
        id: 'audio-test-tiktok',
        durationInFrames: 150,
        transition: { type: 'fade' as const },
        audio: {
          narration: { src: 'https://example.com/narration.mp3', volume: 1.0 },
          music: { src: 'https://example.com/music.mp3', volume: 0.12, fadeIn: 1.0, fadeOut: 1.5 },
          sfx: [{ src: 'https://example.com/sfx.mp3', atSecond: 0.3, volume: 0.4 }],
        },
        captions: {
          enabled: true,
          style: 'tiktok' as const,
          data: [
            { text: 'Your', startMs: 200, endMs: 420, timestampMs: 310, confidence: null },
            { text: ' brain', startMs: 420, endMs: 680, timestampMs: 550, confidence: null },
          ],
        },
        config: {
          background: { preset: 'sunriseGradient' as const, layerNoise: true },
          layout: { type: 'full' as const, options: { padding: 80 } },
          slots: {
            full: {
              midScene: 'textReveal' as const,
              stylePreset: 'playful' as const,
              config: {
                lines: [{ text: 'Your brain forgets 80% in 24 hours', emphasis: 'high' }],
                revealType: 'typewriter',
              },
            },
          },
        },
      },
      {
        id: 'audio-test-subtitle',
        durationInFrames: 180,
        transition: { type: 'slide' as const, direction: 'left' as const },
        config: {
          background: { preset: 'notebookSoft' as const },
          layout: { type: 'rowStack' as const, options: { rows: 2, padding: 50 } },
          slots: {
            row1: {
              midScene: 'bigNumber' as const,
              config: { number: '10', label: 'mid-scenes', animation: 'countUp' },
            },
            row2: {
              midScene: 'checklist' as const,
              stylePreset: 'educational' as const,
              config: {
                items: [{ text: 'AudioLayer created', checked: true }],
                icon: 'check',
              },
            },
          },
        },
      },
      {
        id: 'audio-test-karaoke',
        durationInFrames: 150,
        transition: { type: 'clock-wipe' as const },
        captions: {
          enabled: true,
          style: 'karaoke' as const,
          data: [
            { text: 'Question', startMs: 500, endMs: 950, timestampMs: 725, confidence: null },
          ],
        },
        config: {
          background: { preset: 'chalkboardGradient' as const },
          layout: { type: 'full' as const },
          slots: {
            full: {
              midScene: 'textReveal' as const,
              stylePreset: 'mentor' as const,
              config: { lines: [{ text: 'Karaoke demo' }], revealType: 'fade' },
            },
          },
        },
      },
    ],
    format: 'desktop' as const,
  };

  const result = VideoConfigSchema.safeParse(payload);
  assert(result.success, `Parse failed: ${!result.success ? JSON.stringify(result.error.issues.slice(0, 3)) : ''}`);
});

// ─── Test 2: Minimal valid payload ──────────────────────────────────────

test('minimal valid payload parses successfully', () => {
  const minimal = {
    scenes: [
      {
        id: 'scene-1',
        durationInFrames: 90,
        config: {
          layout: { type: 'full' as const },
          slots: {
            full: {
              midScene: 'textReveal' as const,
              config: { lines: [{ text: 'Hello' }] },
            },
          },
        },
      },
    ],
  };

  const result = VideoConfigSchema.safeParse(minimal);
  assert(result.success, `Parse failed: ${!result.success ? JSON.stringify(result.error.issues.slice(0, 3)) : ''}`);
});

// ─── Test 3: Invalid — empty scenes array ───────────────────────────────

test('rejects empty scenes array', () => {
  const result = VideoConfigSchema.safeParse({ scenes: [] });
  assert(!result.success, 'Should have rejected empty scenes');
});

// ─── Test 4: Invalid — missing id ───────────────────────────────────────

test('rejects scene without id', () => {
  const result = VideoConfigSchema.safeParse({
    scenes: [{ durationInFrames: 90, config: {} }],
  });
  assert(!result.success, 'Should have rejected missing id');
});

// ─── Test 5: Invalid transition type ────────────────────────────────────

test('rejects invalid transition type', () => {
  const result = VideoConfigSchema.safeParse({
    scenes: [
      {
        id: 's1',
        durationInFrames: 90,
        transition: { type: 'nonexistent' },
        config: {},
      },
    ],
  });
  assert(!result.success, 'Should have rejected invalid transition type');
});

// ─── Test 6: Invalid mid-scene key ──────────────────────────────────────

test('rejects invalid midScene key', () => {
  const result = VideoConfigSchema.safeParse({
    scenes: [
      {
        id: 's1',
        durationInFrames: 90,
        config: {
          slots: {
            full: { midScene: 'doesNotExist', config: {} },
          },
        },
      },
    ],
  });
  assert(!result.success, 'Should have rejected invalid midScene key');
});

// ─── Test 7: All transition types accepted ──────────────────────────────

test('accepts all active and legacy transition types', () => {
  const types = ['fade', 'slide', 'page-turn', 'clock-wipe', 'iris', 'doodle-wipe', 'eraser', 'spring'] as const;

  for (const t of types) {
    const result = VideoConfigSchema.safeParse({
      scenes: [
        {
          id: `t-${t}`,
          durationInFrames: 90,
          transition: { type: t },
          config: {},
        },
      ],
    });
    assert(result.success, `Transition type "${t}" should be accepted`);
  }
});

// ─── Test 8: All mid-scene keys accepted ────────────────────────────────

test('accepts all registered midScene keys', () => {
  const keys = [
    'textReveal', 'heroText', 'gridCards', 'checklist', 'bubbleCallout',
    'sideBySide', 'iconGrid', 'cardSequence', 'bigNumber', 'animatedCounter',
    'textRevealSequence', 'heroTextEntranceExit', 'checklistReveal',
    'bubbleCalloutSequence', 'callouts', 'sideBySideCompare', 'compare',
    'gridCardReveal', 'cardGrid', 'bigNumberReveal',
  ] as const;

  for (const key of keys) {
    const result = VideoConfigSchema.safeParse({
      scenes: [
        {
          id: `ms-${key}`,
          durationInFrames: 90,
          config: {
            slots: { full: { midScene: key, config: {} } },
          },
        },
      ],
    });
    assert(result.success, `midScene key "${key}" should be accepted`);
  }
});

// ─── Test 9: Audio schema composes correctly ────────────────────────────

test('audio schema validates narration + music + sfx', () => {
  const result = VideoConfigSchema.safeParse({
    scenes: [
      {
        id: 'audio-full',
        durationInFrames: 150,
        audio: {
          narration: { src: 'https://cdn.example.com/voice.mp3', volume: 0.9, startFromSeconds: 0.5 },
          music: { src: 'https://cdn.example.com/bg.mp3', volume: 0.15, fadeIn: 1, fadeOut: 2, loop: true },
          sfx: [
            { src: 'https://cdn.example.com/pop.mp3', atSecond: 1.2, volume: 0.6 },
            { src: 'https://cdn.example.com/chime.mp3', atSecond: 3.0 },
          ],
        },
        config: {},
      },
    ],
  });
  assert(result.success, `Audio payload should parse: ${!result.success ? JSON.stringify(result.error.issues.slice(0, 3)) : ''}`);
});

// ─── Test 10: Captions schema validates all styles ──────────────────────

test('captions schema accepts all three styles', () => {
  for (const style of ['tiktok', 'subtitle', 'karaoke'] as const) {
    const result = VideoConfigSchema.safeParse({
      scenes: [
        {
          id: `cap-${style}`,
          durationInFrames: 90,
          captions: {
            enabled: true,
            style,
            data: [{ text: 'Hello', startMs: 0, endMs: 500, timestampMs: 250, confidence: null }],
          },
          config: {},
        },
      ],
    });
    assert(result.success, `Caption style "${style}" should be accepted`);
  }
});

// ─── Test 11: Slot arrays (sequences) accepted ─────────────────────────

test('slot with array of mid-scene configs accepted', () => {
  const result = VideoConfigSchema.safeParse({
    scenes: [
      {
        id: 'seq-test',
        durationInFrames: 180,
        config: {
          slots: {
            row1: [
              { midScene: 'textReveal' as const, config: { lines: [{ text: 'A' }] } },
              { midScene: 'heroText' as const, config: { heroRef: '/test.json' } },
            ],
          },
        },
      },
    ],
  });
  assert(result.success, `Slot array should be accepted: ${!result.success ? JSON.stringify(result.error.issues.slice(0, 3)) : ''}`);
});

// ─── Test 12: Format defaults to desktop ────────────────────────────────

test('format defaults to desktop when omitted', () => {
  const result = VideoConfigSchema.safeParse({
    scenes: [{ id: 's1', durationInFrames: 90, config: {} }],
  });
  assert(result.success, 'Should parse without format');
  if (result.success) {
    assert(result.data.format === 'desktop', `Expected format 'desktop', got '${result.data.format}'`);
  }
});

// ─── Summary ────────────────────────────────────────────────────────────

console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`);
process.exit(failed > 0 ? 1 : 0);
