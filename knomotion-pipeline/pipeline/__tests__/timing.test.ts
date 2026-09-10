/**
 * Timing engine tests (M1). The invariants every downstream stage relies on:
 *   - scene duration is derived from narration audio (+ lead-in + tail)
 *   - every line window sits inside [narrationStart, contentExit] and is monotonic
 *   - applySceneTiming overwrites durationInFrames and all beats, nothing else
 *   - same output shape from measured timings and from the estimate
 */

import { describe, it, expect } from 'vitest';
import {
  computeSceneTiming,
  computeLineWindows,
  estimateWordTimings,
  estimateNarrationSeconds,
  applySceneTiming,
  applyTimingToConfig,
  DEFAULT_TIMING_OPTIONS,
} from '../core/timing';
import { MockTTS } from '../core/tts/mock';
import type { SceneNarration } from '../schemas/NarrationScript';
import type { TTSClip } from '../schemas/TTSManifest';
import { KnoMotionVideoConfigSchema } from '../schemas/KnoMotionVideoConfig';

const narration: SceneNarration = {
  sceneId: 's1',
  order: 0,
  narration: 'Spaced repetition works. First, review soon after learning. Then, stretch the gaps. Finally, trust the schedule.',
  onScreenText: ['Review soon after learning', 'Stretch the gaps', 'Trust the schedule'],
  emphasisPhrases: [],
  estimatedDurationSeconds: 8,
};

const clipFor = async (text: string, status: TTSClip['status'] = 'generated'): Promise<TTSClip> => {
  const r = await new MockTTS().synthesize(text);
  return { sceneId: 's1', narrationText: text, status, durationSeconds: r.durationSeconds, wordTimings: r.wordTimings };
};

describe('estimateWordTimings', () => {
  it('is deterministic and monotonic with punctuation pauses', () => {
    const a = estimateWordTimings('Hello there, world. Again!');
    const b = estimateWordTimings('Hello there, world. Again!');
    expect(a).toEqual(b);
    for (let i = 1; i < a.length; i++) expect(a[i].startMs).toBeGreaterThanOrEqual(a[i - 1].endMs);
    // pause after "there," and "world." shows up as a gap before the next word
    expect(a[2].startMs - a[1].endMs).toBeGreaterThan(0);
    expect(a[3].startMs - a[2].endMs).toBeGreaterThan(a[2].startMs - a[1].endMs);
  });

  it('estimates roughly 2.5 words per second on plain prose', () => {
    const words = Array.from({ length: 25 }, () => 'apple').join(' ');
    const secs = estimateNarrationSeconds(words);
    expect(secs).toBeGreaterThan(8);
    expect(secs).toBeLessThan(12);
  });
});

describe('computeSceneTiming', () => {
  it('derives the scene duration from the clip: lead-in + audio + tail, rounded up to whole frames', async () => {
    const clip = await clipFor(narration.narration);
    const t = computeSceneTiming(narration, clip);
    const { leadInSeconds, tailSeconds, fps } = DEFAULT_TIMING_OPTIONS;
    expect(t.source).toBe('tts');
    expect(t.narrationStart).toBe(leadInSeconds);
    expect(t.narrationEnd).toBeCloseTo(leadInSeconds + clip.durationSeconds!, 2);
    expect(t.durationInFrames).toBe(Math.ceil((leadInSeconds + clip.durationSeconds! + tailSeconds) * fps));
    expect(t.durationSeconds).toBeCloseTo(t.durationInFrames / fps, 2);
    expect(t.contentExit).toBeLessThan(t.durationSeconds);
    expect(t.contentExit).toBeGreaterThan(t.narrationEnd);
  });

  it('never produces a scene shorter than minSceneSeconds', async () => {
    const short: SceneNarration = { ...narration, narration: 'Yes.', onScreenText: ['Yes'] };
    const t = computeSceneTiming(short, await clipFor('Yes.'));
    expect(t.durationSeconds).toBeGreaterThanOrEqual(DEFAULT_TIMING_OPTIONS.minSceneSeconds);
    expect(t.lineWindows[0].exit).toBeLessThan(t.durationSeconds);
  });

  it('produces one window per on-screen line, monotonic and inside the scene', async () => {
    const t = computeSceneTiming(narration, await clipFor(narration.narration));
    expect(t.lineWindows).toHaveLength(3);
    let prev = -1;
    for (const w of t.lineWindows) {
      expect(w.start).toBeGreaterThanOrEqual(t.narrationStart);
      expect(w.start).toBeGreaterThan(prev);
      expect(w.start).toBeLessThan(w.exit);
      expect(w.exit).toBe(t.contentExit);
      prev = w.start;
    }
  });

  it('anchors lines to when their phrase is spoken', async () => {
    const clip = await clipFor(narration.narration);
    const t = computeSceneTiming(narration, clip);
    const spokenAt = (word: string) => clip.wordTimings!.find((w) => w.word.toLowerCase().startsWith(word))!.startMs / 1000;
    // "Stretch the gaps" is spoken well after "Review soon…"; window 2 must land near "stretch"
    expect(t.lineWindows[1].start).toBeCloseTo(t.narrationStart + spokenAt('stretch') - DEFAULT_TIMING_OPTIONS.anticipationSeconds, 1);
    expect(t.lineWindows[2].start).toBeCloseTo(t.narrationStart + spokenAt('trust') - DEFAULT_TIMING_OPTIONS.anticipationSeconds, 1);
  });

  it('falls back to the word-count estimate (same shape) when the clip failed or is missing', () => {
    const failed: TTSClip = { sceneId: 's1', narrationText: narration.narration, status: 'failed', error: 'boom' };
    const a = computeSceneTiming(narration, failed);
    const b = computeSceneTiming(narration, null);
    expect(a.source).toBe('estimate');
    expect(a).toEqual(b);
    expect(a.lineWindows).toHaveLength(3);
    expect(a.durationInFrames).toBeGreaterThan(DEFAULT_TIMING_OPTIONS.minSceneSeconds * 30);
  });

  it('marks mock (estimated) clips as estimate but still uses their timings', async () => {
    const t = computeSceneTiming(narration, await clipFor(narration.narration, 'estimated'));
    expect(t.source).toBe('estimate');
    expect(t.lineWindows[1].start).toBeGreaterThan(t.lineWindows[0].start + 1);
  });
});

describe('computeLineWindows (proportional fallback)', () => {
  it('spreads lines across the spoken span when no phrase can be matched', () => {
    const w = computeLineWindows(['alpha', 'beta', 'gamma'], undefined, 0.4, 10.4, 10.8, DEFAULT_TIMING_OPTIONS);
    expect(w.map((x) => x.start)).toEqual([0.4, 2.73, 5.07]);
    expect(w.every((x) => x.exit === 10.8)).toBe(true);
  });

  it('keeps starts strictly increasing even when clamped near the end', () => {
    const w = computeLineWindows(['a', 'b', 'c', 'd'], undefined, 0.4, 0.9, 2.5, DEFAULT_TIMING_OPTIONS);
    for (let i = 1; i < w.length; i++) expect(w[i].start).toBeGreaterThan(w[i - 1].start);
    expect(w.at(-1)!.start).toBeLessThan(2.5);
  });
});

describe('applySceneTiming', () => {
  const timing = computeSceneTiming(narration, null);

  const llmScene: Record<string, any> = {
    id: 's1',
    durationInFrames: 999,
    transition: { type: 'slide', direction: 'left' },
    config: {
      background: { preset: 'cleanCard' },
      layout: { type: 'full' },
      slots: {
        full: {
          midScene: 'textReveal',
          stylePreset: 'mentor',
          config: {
            revealType: 'fade',
            lines: [
              { text: 'Review soon after learning', emphasis: 'high', beats: { start: 40, exit: 2, emphasis: 41 } },
              { text: 'Stretch the gaps', beats: { start: 50, exit: 1 } },
              'Trust the schedule',
            ],
            beats: { start: 30, exit: 1, hold: 99 },
          },
        },
      },
    },
  };

  it('overwrites durationInFrames and every beats block; keeps structure, content, and unrelated fields', () => {
    const out = applySceneTiming(llmScene, timing);
    expect(out.durationInFrames).toBe(timing.durationInFrames);
    expect(out.transition).toEqual(llmScene.transition);
    expect(out.config.background).toEqual(llmScene.config.background);
    const slot = out.config.slots.full;
    expect(slot.stylePreset).toBe('mentor');
    expect(slot.config.revealType).toBe('fade');
    expect(slot.config.beats).toEqual({ start: timing.lineWindows[0].start, exit: timing.contentExit });
    expect(slot.config.beats.hold).toBeUndefined();
    const lines = slot.config.lines;
    expect(lines).toHaveLength(3);
    lines.forEach((l: any, i: number) => {
      expect(l.beats.start).toBe(timing.lineWindows[i].start);
      expect(l.beats.exit).toBe(timing.contentExit);
    });
    expect(lines[0].emphasis).toBe('high');
    expect(lines[0].beats.emphasis).toBe(41); // non-owned beat fields are preserved
    expect(lines[2]).toEqual({ text: 'Trust the schedule', beats: { start: timing.lineWindows[2].start, exit: timing.contentExit } });
    // input is not mutated
    expect(llmScene.durationInFrames).toBe(999);
    expect((llmScene.config.slots.full.config.lines[0] as any).beats.start).toBe(40);
  });

  it('spreads item starts when the item count differs from the on-screen line count', () => {
    const scene = {
      ...llmScene,
      config: {
        ...llmScene.config,
        slots: { full: { midScene: 'gridCards', config: { cards: [{ title: 'a' }, { title: 'b' }, { title: 'c' }, { title: 'd' }, { title: 'e' }], columns: 3 } } },
      },
    };
    const out = applySceneTiming(scene, timing);
    const starts = out.config.slots.full.config.cards.map((c: any) => c.beats.start);
    for (let i = 1; i < starts.length; i++) expect(starts[i]).toBeGreaterThan(starts[i - 1]);
    expect(starts.at(-1)).toBeLessThan(timing.contentExit - 1);
    expect(out.config.slots.full.config.columns).toBe(3);
  });

  it('writes entrance + exit for heroText and leaves checklist items untouched (they stagger from top-level beats)', () => {
    const hero = { ...llmScene, config: { ...llmScene.config, slots: { full: { midScene: 'heroText', config: { text: 'Hi', heroType: 'lottie', heroRef: 'lightbulb', beats: { entrance: 9, exit: 1 } } } } } };
    const h = applySceneTiming(hero, timing).config.slots.full.config.beats;
    expect(h.entrance).toBe(timing.lineWindows[0].start);
    expect(h.exit).toBe(timing.contentExit);

    const check = { ...llmScene, config: { ...llmScene.config, slots: { full: { midScene: 'checklist', config: { items: [{ text: 'x', checked: true }, 'y'], beats: { start: 7 } } } } } };
    const c = applySceneTiming(check, timing).config.slots.full.config;
    expect(c.items).toEqual([{ text: 'x', checked: true }, 'y']);
    expect(c.beats).toEqual({ start: timing.lineWindows[0].start, exit: timing.contentExit });
  });

  it('handles array slots and produces a config that passes the renderer contract', () => {
    const cfg = {
      scenes: [{ ...llmScene, config: { ...llmScene.config, slots: { full: [llmScene.config.slots.full, { midScene: 'bigNumber', config: { value: 42, beats: { start: 88 } } }] } } }],
      format: 'desktop' as const,
    };
    const out = applyTimingToConfig(cfg, [timing]);
    expect(out.scenes[0].config.slots.full[1].config.beats.start).toBe(timing.lineWindows[0].start);
    expect(KnoMotionVideoConfigSchema.safeParse(out).success).toBe(true);
  });

  it('matches scenes to timings by id, falling back to index', () => {
    const cfg: { scenes: Record<string, any>[]; format: 'desktop' } = { scenes: [{ ...llmScene, id: 'other' }, { ...llmScene, id: 's1' }], format: 'desktop' };
    const t2 = { ...timing, sceneId: 'zzz', durationInFrames: 77 };
    const out = applyTimingToConfig(cfg, [t2, timing]);
    expect(out.scenes[0].durationInFrames).toBe(77); // index fallback
    expect(out.scenes[1].durationInFrames).toBe(timing.durationInFrames); // id match
  });
});
