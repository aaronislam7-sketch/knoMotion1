/**
 * Deterministic timing engine (Stage 6) — pure functions, no I/O.
 *
 * computeSceneTiming: NarrationScript scene + TTS clip (or null) -> SceneTiming.
 *   Scene duration = lead-in + narration audio + tail. Line windows come from
 *   word timings when the provider returned them, else from a proportional
 *   word-count split. Same output shape either way, so swapping the estimator
 *   for ground truth is a no-op downstream.
 *
 * applySceneTiming: SceneTiming + LLM-authored scene -> scene with
 *   `durationInFrames` and every `beats` block overwritten by computed values.
 *   The LLM chooses WHAT is on screen; this module decides WHEN.
 */

import type { SceneNarration } from '../schemas/NarrationScript';
import type { TTSClip, WordTiming } from '../schemas/TTSManifest';
import type { LineWindow, SceneTiming } from '../schemas/SceneTiming';
import { FPS } from './fps';

export interface TimingOptions {
  fps: number;
  /** Silence before the narration starts; content enters during this window. */
  leadInSeconds: number;
  /** Time after the narration ends before the scene ends (covers exit animation + transition overlap). */
  tailSeconds: number;
  /** Content starts exiting this long after the narration ends. Must be < tailSeconds. */
  exitAfterNarrationSeconds: number;
  /** Scenes never get shorter than this, however short the narration. */
  minSceneSeconds: number;
  /** Speaking rate used when no clip duration/timings are available. */
  wordsPerSecond: number;
  /** Lines appear slightly before the narrator reaches them. */
  anticipationSeconds: number;
  /** Consecutive line entrances are at least this far apart. */
  minLineGapSeconds: number;
}

export const DEFAULT_TIMING_OPTIONS: TimingOptions = {
  fps: FPS,
  leadInSeconds: 0.4,
  tailSeconds: 0.9,
  exitAfterNarrationSeconds: 0.4,
  minSceneSeconds: 3,
  wordsPerSecond: 2.5,
  anticipationSeconds: 0.15,
  minLineGapSeconds: 0.35,
};

const round2 = (n: number) => Math.round(n * 100) / 100;

// ---------------------------------------------------------------------------
// Narration duration + word timing estimation (mock provider / fallback)
// ---------------------------------------------------------------------------

const SENTENCE_PAUSE = 0.35;
const CLAUSE_PAUSE = 0.18;

export const tokenizeWords = (text: string): string[] => text.split(/\s+/).filter(Boolean);

/**
 * Synthesises word timings from word count at a fixed speaking rate, with
 * pauses after sentence and clause punctuation. Deterministic.
 */
export const estimateWordTimings = (text: string, wordsPerSecond = DEFAULT_TIMING_OPTIONS.wordsPerSecond): WordTiming[] => {
  const words = tokenizeWords(text);
  const perWord = 1 / wordsPerSecond;
  const out: WordTiming[] = [];
  let t = 0;
  for (const word of words) {
    // Longer words take a little longer to say; keeps the estimate honest on jargon.
    const dur = perWord * Math.max(0.6, Math.min(1.8, word.replace(/[^A-Za-z0-9]/g, '').length / 5));
    const startMs = Math.round(t * 1000);
    t += dur;
    out.push({ word, startMs, endMs: Math.round(t * 1000) });
    if (/[.!?]["')\]]*$/.test(word)) t += SENTENCE_PAUSE;
    else if (/[,;:]["')\]]*$/.test(word)) t += CLAUSE_PAUSE;
  }
  return out;
};

export const estimateNarrationSeconds = (text: string, wordsPerSecond?: number): number => {
  const timings = estimateWordTimings(text, wordsPerSecond);
  return timings.length ? round2(timings[timings.length - 1].endMs / 1000) : 0;
};

// ---------------------------------------------------------------------------
// Line windows
// ---------------------------------------------------------------------------

const normalizeToken = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, '');

/**
 * Finds where `phrase` is spoken in `timings`, searching forward from
 * `fromIndex`. Matches the first up-to-three significant tokens of the phrase
 * in order (allowing the narrator to paraphrase the rest). Returns the index
 * of the matched first word, or -1.
 */
const findPhraseStart = (phrase: string, timings: WordTiming[], fromIndex: number): number => {
  const tokens = tokenizeWords(phrase).map(normalizeToken).filter((t) => t.length > 2).slice(0, 3);
  if (tokens.length === 0) return -1;
  const words = timings.map((t) => normalizeToken(t.word));
  for (let i = fromIndex; i < words.length; i++) {
    if (words[i] !== tokens[0]) continue;
    let ok = true;
    let j = i;
    for (let k = 1; k < tokens.length; k++) {
      // allow up to 2 filler words between matched tokens
      let found = -1;
      for (let step = 1; step <= 3 && j + step < words.length; step++) {
        if (words[j + step] === tokens[k]) { found = j + step; break; }
      }
      if (found === -1) { ok = false; break; }
      j = found;
    }
    if (ok) return i;
  }
  return -1;
};

/**
 * Computes one visibility window per on-screen line.
 * With word timings: each line enters when its phrase is first spoken (minus
 * anticipation). Lines whose phrase isn't found are spread evenly across the
 * gap between their neighbours. Without timings: proportional word-count split.
 */
export const computeLineWindows = (
  onScreenText: string[],
  timings: WordTiming[] | undefined,
  narrationStart: number,
  narrationEnd: number,
  contentExit: number,
  opts: TimingOptions,
): LineWindow[] => {
  const n = onScreenText.length;
  if (n === 0) return [];
  const speakSpan = Math.max(0, narrationEnd - narrationStart);
  const starts: (number | undefined)[] = new Array(n).fill(undefined);

  if (timings && timings.length > 0) {
    let cursor = 0;
    onScreenText.forEach((line, i) => {
      const idx = findPhraseStart(line, timings, cursor);
      if (idx >= 0) {
        starts[i] = narrationStart + timings[idx].startMs / 1000 - opts.anticipationSeconds;
        cursor = idx + 1;
      }
    });
  }

  // Fill gaps: unmatched lines are spread evenly between their nearest matched neighbours.
  const anchored = starts.some((s) => s !== undefined);
  if (!anchored) {
    // Proportional split by cumulative word count of the on-screen lines.
    const counts = onScreenText.map((l) => Math.max(1, tokenizeWords(l).length));
    const total = counts.reduce((a, b) => a + b, 0);
    let acc = 0;
    for (let i = 0; i < n; i++) {
      // The last line should still land inside the spoken span, so scale to ~70% of it.
      starts[i] = narrationStart + (acc / total) * speakSpan * 0.7;
      acc += counts[i];
    }
  } else {
    for (let i = 0; i < n; i++) {
      if (starts[i] !== undefined) continue;
      let prev = i - 1;
      while (prev >= 0 && starts[prev] === undefined) prev--;
      let next = i + 1;
      while (next < n && starts[next] === undefined) next++;
      const lo = prev >= 0 ? (starts[prev] as number) : narrationStart;
      const hi = next < n ? (starts[next] as number) : narrationStart + speakSpan * 0.85;
      const slots = next - prev; // number of gaps between lo and hi
      starts[i] = lo + ((hi - lo) * (i - prev)) / slots;
    }
  }

  // Monotonic, inside the scene, and never so late the line can't be read.
  const latestStart = Math.max(narrationStart, contentExit - 1.2);
  const windows: LineWindow[] = [];
  let prevStart = -Infinity;
  for (let i = 0; i < n; i++) {
    let s = Math.max(narrationStart, starts[i] as number);
    if (i > 0) s = Math.max(s, prevStart + opts.minLineGapSeconds);
    s = Math.min(s, latestStart);
    if (i > 0 && s <= prevStart) s = prevStart + 0.05; // keep strictly increasing even when clamped
    prevStart = s;
    windows.push({ text: onScreenText[i], start: round2(s), exit: round2(contentExit) });
  }
  return windows;
};

// ---------------------------------------------------------------------------
// Scene timing
// ---------------------------------------------------------------------------

export const computeSceneTiming = (
  narration: SceneNarration,
  clip: TTSClip | null | undefined,
  options: Partial<TimingOptions> = {},
): SceneTiming => {
  const opts: TimingOptions = { ...DEFAULT_TIMING_OPTIONS, ...options };
  const usable = clip && clip.status !== 'failed' && clip.status !== 'pending';
  const timings = usable ? clip.wordTimings : undefined;
  const source: SceneTiming['source'] = clip?.status === 'generated' ? 'tts' : 'estimate';

  let narrationSeconds: number;
  if (usable && typeof clip.durationSeconds === 'number' && clip.durationSeconds > 0) {
    narrationSeconds = clip.durationSeconds;
  } else if (timings && timings.length) {
    narrationSeconds = timings[timings.length - 1].endMs / 1000;
  } else {
    narrationSeconds = estimateNarrationSeconds(narration.narration, opts.wordsPerSecond);
  }

  const narrationStart = opts.leadInSeconds;
  const narrationEnd = narrationStart + narrationSeconds;
  const rawDuration = narrationEnd + opts.tailSeconds;
  const durationInFrames = Math.max(1, Math.ceil(Math.max(rawDuration, opts.minSceneSeconds) * opts.fps));
  const durationSeconds = durationInFrames / opts.fps;
  // Content stays up until shortly after the narrator finishes, leaving
  // (tail - exitAfter) seconds for the exit animation + transition overlap.
  // When the scene is padded to minSceneSeconds the content holds until then.
  const contentExit = durationSeconds - (opts.tailSeconds - opts.exitAfterNarrationSeconds);

  const lineWindows = computeLineWindows(
    narration.onScreenText ?? [],
    timings,
    narrationStart,
    narrationEnd,
    contentExit,
    opts,
  );

  return {
    sceneId: narration.sceneId,
    source,
    durationInFrames,
    durationSeconds: round2(durationSeconds),
    narrationStart: round2(narrationStart),
    narrationEnd: round2(narrationEnd),
    contentExit: round2(contentExit),
    lineWindows,
  };
};

// ---------------------------------------------------------------------------
// Applying timing to an LLM-authored scene
// ---------------------------------------------------------------------------

/**
 * Mid-scene config arrays whose items carry their own `beats` in the renderer
 * schemas (sdk/mid-scenes/schemas/*.schema.json). Items in other arrays
 * (checklist.items, bubbleCallout.callouts) stagger from the top-level beats.
 */
const PER_ITEM_BEATS: Record<string, string> = {
  textReveal: 'lines',
  gridCards: 'cards',
  cardSequence: 'cards',
  iconGrid: 'icons',
};

/** Fields the LLM may have written that timing now owns. Everything else in `beats` is preserved. */
const OWNED_BEAT_FIELDS = ['start', 'exit', 'entrance', 'hold'] as const;

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

const setBeats = (target: Record<string, unknown>, values: Record<string, number>) => {
  const existing = isObj(target.beats) ? { ...target.beats } : {};
  for (const f of OWNED_BEAT_FIELDS) delete existing[f];
  target.beats = { ...existing, ...values };
};

/** Evenly spaced starts for `count` items when the script gave a different number of on-screen lines. */
const spreadStarts = (count: number, timing: SceneTiming, opts: TimingOptions): number[] => {
  const from = timing.lineWindows[0]?.start ?? timing.narrationStart;
  const to = Math.max(from, Math.min(timing.contentExit - 1.2, timing.narrationStart + (timing.narrationEnd - timing.narrationStart) * 0.7));
  if (count <= 1) return [round2(from)];
  const step = Math.max(opts.minLineGapSeconds, (to - from) / (count - 1));
  return Array.from({ length: count }, (_, i) => round2(Math.min(from + i * step, to)));
};

const applyToSlotItem = (slotItem: Record<string, unknown>, timing: SceneTiming, opts: TimingOptions) => {
  const midScene = typeof slotItem.midScene === 'string' ? slotItem.midScene : '';
  const cfg = isObj(slotItem.config) ? { ...slotItem.config } : {};
  const start = round2(timing.lineWindows[0]?.start ?? timing.narrationStart);
  const exit = round2(timing.contentExit);

  if (midScene === 'heroText') {
    setBeats(cfg, { entrance: start, start, exit });
  } else {
    setBeats(cfg, { start, exit });
  }

  const arrayKey = PER_ITEM_BEATS[midScene];
  if (arrayKey && Array.isArray(cfg[arrayKey])) {
    const items = cfg[arrayKey] as unknown[];
    const starts = items.length === timing.lineWindows.length
      ? timing.lineWindows.map((w) => w.start)
      : spreadStarts(items.length, timing, opts);
    cfg[arrayKey] = items.map((item, i) => {
      const obj: Record<string, unknown> = isObj(item) ? { ...item } : { text: String(item) };
      setBeats(obj, { start: starts[i], exit });
      return obj;
    });
  }

  // sideBySide's slider has its own beats; keep it inside the scene too.
  if (midScene === 'sideBySide' && isObj(cfg.slider)) {
    const slider = { ...cfg.slider };
    setBeats(slider, { start: round2(Math.min(start + 0.6, exit - 0.5)), exit });
    cfg.slider = slider;
  }

  slotItem.config = cfg;
};

/**
 * Returns a copy of `scene` with `durationInFrames` and all beats set from
 * `timing`. Structure, content, transition, and background are untouched.
 */
export const applySceneTiming = <S extends Record<string, any>>(
  scene: S,
  timing: SceneTiming,
  options: Partial<TimingOptions> = {},
): S => {
  const opts: TimingOptions = { ...DEFAULT_TIMING_OPTIONS, ...options };
  const out: Record<string, any> = { ...scene, durationInFrames: timing.durationInFrames };
  const config = isObj(scene.config) ? { ...scene.config } : {};
  const slots = isObj(config.slots) ? { ...config.slots } : undefined;

  if (slots) {
    for (const [name, value] of Object.entries(slots)) {
      if (Array.isArray(value)) {
        slots[name] = value.map((v) => {
          if (!isObj(v)) return v;
          const copy = { ...v };
          applyToSlotItem(copy, timing, opts);
          return copy;
        });
      } else if (isObj(value)) {
        const copy = { ...value };
        applyToSlotItem(copy, timing, opts);
        slots[name] = copy;
      }
    }
    config.slots = slots;
  }

  out.config = config;
  return out as S;
};

/** Applies timing to every scene of a config, matching by scene id (falling back to index). */
export const applyTimingToConfig = <C extends { scenes: Record<string, any>[] }>(
  config: C,
  timings: SceneTiming[],
  options: Partial<TimingOptions> = {},
): C => {
  const byId = new Map(timings.map((t) => [t.sceneId, t]));
  return {
    ...config,
    scenes: config.scenes.map((scene, i) => {
      const t = byId.get(scene.id) ?? timings[i];
      return t ? applySceneTiming(scene, t, options) : scene;
    }),
  };
};
