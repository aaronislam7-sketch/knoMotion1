/**
 * Stage 8 rule engine (deterministic).
 *
 * Runs the deterministic business rules that make "valid == renderable (no
 * broken scenes)" true. Structural Zod validation happens upstream (the config
 * arrives typed); this layer adds the rules the model cannot be trusted to
 * self-police, including DEEP per-mid-scene config validation against the
 * renderer's JSON Schemas (via ajv, loaded by the capability bridge).
 *
 * Severity policy:
 *   - error   = would render broken / blank / fail (blocks render, triggers repair)
 *   - warning = quality/uncertain (does not block)
 */

import type { KnoMotionVideoConfig } from '../../schemas/KnoMotionVideoConfig';
import type { ValidationIssue } from '../../schemas/ValidationReport';
import type { RendererCapabilities } from '../../core/capabilities/renderer-capabilities';

interface SlotItem {
  slotName: string;
  midScene: string;
  config: Record<string, unknown>;
  basePath: string;
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

const slotItemsOf = (scene: any, sceneIndex: number): SlotItem[] => {
  const slots = scene?.config?.slots ?? {};
  const out: SlotItem[] = [];
  for (const [slotName, val] of Object.entries(slots)) {
    const arr = Array.isArray(val) ? val : [val];
    arr.forEach((sc: any, i: number) => {
      out.push({
        slotName,
        midScene: sc?.midScene,
        config: isObj(sc?.config) ? sc.config : {},
        basePath: `scenes[${sceneIndex}].config.slots.${slotName}${Array.isArray(val) ? `[${i}]` : ''}`,
      });
    });
  }
  return out;
};

const slotNameAllowed = (layoutType: string, name: string): boolean => {
  if (name === 'header') return true;
  switch (layoutType) {
    case 'full': return name === 'full';
    case 'rowStack': return /^row\d+$/.test(name);
    case 'columnSplit': return /^col\d+$/.test(name) || name === 'left' || name === 'right';
    case 'gridSlots': return /^cell[A-Za-z]$/.test(name);
    case 'headerRowColumns': return name === 'row' || /^col\d+$/.test(name);
    default: return true; // unknown layout flagged by layout_type rule
  }
};

const requiredContentSlots = (layoutType: string, options: any, present: Set<string>): string[] => {
  switch (layoutType) {
    case 'full':
      return ['full'];
    case 'rowStack':
      return options?.rows ? Array.from({ length: options.rows }, (_, i) => `row${i + 1}`) : [];
    case 'columnSplit': {
      const c = options?.columns;
      if (!c) return [];
      if (c === 2 && present.has('left') && present.has('right')) return [];
      return Array.from({ length: c }, (_, i) => `col${i + 1}`);
    }
    case 'headerRowColumns': {
      const cols = options?.columns ? Array.from({ length: options.columns }, (_, i) => `col${i + 1}`) : [];
      return ['row', ...cols];
    }
    default:
      return [];
  }
};

/** Recursively collect every `beats` object with a JSON-ish path. */
const collectBeats = (node: unknown, path: string, acc: { path: string; beats: Record<string, unknown> }[]) => {
  if (Array.isArray(node)) {
    node.forEach((v, i) => collectBeats(v, `${path}[${i}]`, acc));
  } else if (isObj(node)) {
    for (const [k, v] of Object.entries(node)) {
      if (k === 'beats' && isObj(v)) acc.push({ path: `${path}.beats`, beats: v });
      else collectBeats(v, `${path}.${k}`, acc);
    }
  }
};

const PLACEHOLDER_HOST = /(example\.(com|org)|placeholder|your-cdn|todo|changeme|localhost)/i;

const ALL_RULES = [
  'schema', 'midscene_name', 'layout_type', 'transition_type', 'slot_names', 'slots_filled',
  'sidebyside_layout', 'midscene_config', 'duration_bounds', 'beat_timing', 'text_length',
  'audio_url', 'lottie_key',
] as const;

export const rulesChecked = (): ValidationIssue['rule'][] => [...ALL_RULES];

export const validateConfig = (config: KnoMotionVideoConfig, caps: RendererCapabilities): ValidationIssue[] => {
  const issues: ValidationIssue[] = [];
  const fps = caps.constraints.fpsFixed;

  config.scenes.forEach((scene: any, si: number) => {
    const sceneId: string = scene.id;
    const durationSec = scene.durationInFrames / fps;
    const push = (rule: ValidationIssue['rule'], severity: ValidationIssue['severity'], path: string, message: string, extra: Partial<ValidationIssue> = {}) =>
      issues.push({ rule, severity, path, sceneId, sceneIndex: si, message, ...extra });

    // duration_bounds
    if (!Number.isInteger(scene.durationInFrames) || scene.durationInFrames < 1) {
      push('duration_bounds', 'error', `scenes[${si}].durationInFrames`, 'durationInFrames must be a positive integer', { received: String(scene.durationInFrames) });
    } else if (scene.durationInFrames > 60 * fps * 10) {
      push('duration_bounds', 'warning', `scenes[${si}].durationInFrames`, 'scene is longer than 10 minutes — likely a mistake');
    }

    // transition_type
    if (scene.transition?.type && !caps.transitionTypes.includes(scene.transition.type)) {
      push('transition_type', 'error', `scenes[${si}].transition.type`, `unknown transition "${scene.transition.type}"`, { expected: caps.transitionTypes.join(' | ') });
    }

    // layout_type
    const layoutType: string | undefined = scene.config?.layout?.type;
    if (layoutType && !caps.layoutTypes.includes(layoutType)) {
      push('layout_type', 'error', `scenes[${si}].config.layout.type`, `unknown layout "${layoutType}"`, { expected: caps.layoutTypes.join(' | ') });
    }

    const items = slotItemsOf(scene, si);
    const slotNames = new Set(Object.keys(scene?.config?.slots ?? {}));

    // slot_names + slots_filled (only when layout is known/valid)
    if (layoutType && caps.layoutTypes.includes(layoutType)) {
      for (const name of slotNames) {
        if (!slotNameAllowed(layoutType, name)) {
          push('slot_names', 'error', `scenes[${si}].config.slots.${name}`, `slot "${name}" is not valid for layout "${layoutType}"`);
        }
      }
      const slots = scene?.config?.slots ?? {};
      for (const req of requiredContentSlots(layoutType, scene?.config?.layout?.options, slotNames)) {
        const val = (slots as any)[req];
        const filled = Array.isArray(val) ? val.length > 0 : isObj(val);
        if (!filled) push('slots_filled', 'error', `scenes[${si}].config.slots.${req}`, `declared slot "${req}" for layout "${layoutType}" is empty`);
      }
    }

    // Per-slot rules
    items.forEach((item) => {
      // midscene_name
      if (!caps.canonicalMidSceneKeys.includes(item.midScene)) {
        push('midscene_name', 'error', `${item.basePath}.midScene`, `"${item.midScene}" is not a renderable mid-scene (use a canonical key)`, { expected: caps.canonicalMidSceneKeys.join(' | ') });
        return; // skip deep config validation for unknown components
      }

      // sidebyside_layout
      if (item.midScene === 'sideBySide' && layoutType !== 'full') {
        push('sidebyside_layout', 'error', item.basePath, 'sideBySide must use layout { type: "full" } (it creates its own columns)');
      }

      // midscene_config (deep, ajv)
      const validate = caps.midSceneValidators[item.midScene];
      if (validate && !validate(item.config)) {
        for (const e of validate.errors ?? []) {
          push('midscene_config', 'error', `${item.basePath}.config${e.instancePath}`, `${e.message ?? 'invalid'}${e.params && 'allowedValues' in e.params ? ` (${(e.params as any).allowedValues?.join(', ')})` : ''}`);
        }
      }

      // unknown_keys (shallow, warning)
      const schemaProps = caps.midSceneSchemas[item.midScene]?.properties ?? {};
      for (const key of Object.keys(item.config)) {
        if (!(key in schemaProps) && !key.startsWith('_') && key !== 'position') {
          push('unknown_keys', 'warning', `${item.basePath}.config.${key}`, `unknown config key "${key}" for ${item.midScene} (ignored at render)`);
        }
      }

      // text_length (counts)
      const cfg = item.config as any;
      const limit = (arr: unknown, max: number, label: string, key: string) => {
        if (Array.isArray(arr) && arr.length > max) push('text_length', 'warning', `${item.basePath}.config.${key}`, `${label} count ${arr.length} exceeds recommended max ${max}`);
      };
      if (item.midScene === 'textReveal') limit(cfg.lines, caps.constraints.maxTextLines, 'text lines', 'lines');
      if (item.midScene === 'checklist') limit(cfg.items, caps.constraints.maxChecklistItems, 'checklist items', 'items');
      if (item.midScene === 'gridCards') limit(cfg.cards, caps.constraints.maxCardsInGrid, 'grid cards', 'cards');
      if (item.midScene === 'bubbleCallout') limit(cfg.callouts, caps.constraints.maxCallouts, 'callouts', 'callouts');
      if (typeof cfg.columns === 'number' && cfg.columns > caps.constraints.maxColumnsInGrid) {
        push('text_length', 'warning', `${item.basePath}.config.columns`, `columns ${cfg.columns} exceeds max ${caps.constraints.maxColumnsInGrid}`);
      }

      // lottie_key (heroText)
      if (item.midScene === 'heroText' && cfg.heroType === 'lottie' && typeof cfg.heroRef === 'string') {
        const ref = cfg.heroRef as string;
        if (!/^https?:\/\//.test(ref) && !caps.lottieKeys.has(ref)) {
          push('lottie_key', 'warning', `${item.basePath}.config.heroRef`, `lottie heroRef "${ref}" is not a known registry key or URL`);
        }
      }

      // beat_timing (walk all beats in this slot's config)
      const beatsList: { path: string; beats: Record<string, unknown> }[] = [];
      collectBeats(item.config, `${item.basePath}.config`, beatsList);
      for (const { path, beats } of beatsList) {
        const start = num(beats.start ?? beats.entrance);
        const exit = num(beats.exit);
        if (start !== undefined && exit !== undefined && start >= exit) {
          push('beat_timing', 'error', path, `beats.start (${start}) must be < beats.exit (${exit})`);
        }
        for (const field of ['start', 'exit', 'entrance', 'hold', 'emphasis'] as const) {
          const v = num((beats as any)[field]);
          if (v !== undefined && v > durationSec + 0.5 && v > 20) {
            push('beat_timing', 'warning', `${path}.${field}`, `beats.${field}=${v}s exceeds the scene duration (${durationSec.toFixed(1)}s) — beats are in SECONDS, not frames`);
          }
        }
      }
    });

    // audio_url (schema already enforces URL-or-public-relative-path shape; flag placeholder hosts)
    const srcs: { src?: string; where: string }[] = [];
    if (scene.audio?.narration?.src) srcs.push({ src: scene.audio.narration.src, where: `scenes[${si}].audio.narration.src` });
    if (scene.audio?.music?.src) srcs.push({ src: scene.audio.music.src, where: `scenes[${si}].audio.music.src` });
    (scene.audio?.sfx ?? []).forEach((s: any, i: number) => srcs.push({ src: s?.src, where: `scenes[${si}].audio.sfx[${i}].src` }));
    for (const { src, where } of srcs) {
      if (src && PLACEHOLDER_HOST.test(src)) {
        push('audio_url', 'error', where, `audio src looks like a placeholder ("${src}") — omit the audio block unless the URL is real`);
      }
    }
  });

  return issues;
};

const num = (v: unknown): number | undefined => (typeof v === 'number' && Number.isFinite(v) ? v : undefined);
