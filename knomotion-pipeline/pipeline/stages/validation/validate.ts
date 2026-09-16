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
 *
 * Sept M2 additions — every one an ERROR so repair has to act:
 *   - slot_layout_reconcile: layout options declared; every slot name is one the
 *     layout really produces (geometry mirror); vocabulary folds did not orphan slots.
 *   - text_budget: strings/counts fit the slot's geometry-derived budget.
 *   - content_shape: mid-scene lies within the planned contentShape's subset.
 *   - beat_timing: beats inside [0, duration]; minimum visible time; per-line
 *     beats for textReveal; content persists to near the scene end.
 */

import type { KnoMotionVideoConfig } from '../../schemas/KnoMotionVideoConfig';
import type { ValidationIssue } from '../../schemas/ValidationReport';
import type { RendererCapabilities } from '../../core/capabilities/renderer-capabilities';
import { missingLayoutOptions, resolveSlots, type Format, type LayoutArea } from '../../core/geometry';
import { checkTextBudget, computeTextBudget, describeBudget, effectiveColumns, metricsFor } from '../../core/text-budget';
import { allowedMidScenesFor } from '../../core/content-shapes';

export interface ValidateOptions {
  /** sceneId -> planned contentShape. Enables the `content_shape` rule. */
  contentShapes?: Record<string, string>;
}

/** Shortest time any element may be on screen and still be read (seconds). Matches the timing engine's clamp. */
export const MIN_VISIBLE_SECONDS = 1.2;
/** A scene whose content exits earlier than this before the end shows blank background. */
export const MAX_BLANK_TAIL_SECONDS = 1.5;
/** Renderer default when `beats.exit` is omitted (resolveBeats: start 0.5 + hold 1.6 + 0.3). */
const RENDERER_DEFAULT_EXIT = 2.4;

interface SlotItem {
  slotName: string;
  midScene: string;
  config: Record<string, unknown>;
  basePath: string;
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const num = (v: unknown): number | undefined => (typeof v === 'number' && Number.isFinite(v) ? v : undefined);

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
    case 'gridSlots': return /^cell[A-Za-z]$/.test(name) || /^r\d+c\d+$/.test(name);
    case 'headerRowColumns': return name === 'row' || /^col\d+$/.test(name) || name === 'left' || name === 'right';
    default: return true; // unknown layout flagged by layout_type rule
  }
};

/**
 * Content slots the resolved layout expects to be filled. `left`/`right` are
 * aliases of `col1`/`col2` in 2-column layouts: whichever naming the config
 * uses is the one required.
 */
const requiredContentSlots = (resolved: Record<string, LayoutArea>, present: Set<string>): string[] => {
  const names = Object.keys(resolved).filter((n) => n !== 'header');
  const hasAliases = 'left' in resolved && 'col1' in resolved;
  if (!hasAliases) return names;
  const usesAliases = present.has('left') || present.has('right');
  return names.filter((n) => (usesAliases ? n !== 'col1' && n !== 'col2' : n !== 'left' && n !== 'right'));
};

/** Recursively collect every `beats` object with a JSON-ish path and the text of its owner (if any). */
const collectBeats = (
  node: unknown,
  path: string,
  acc: { path: string; beats: Record<string, unknown>; ownerText?: string }[],
) => {
  if (Array.isArray(node)) {
    node.forEach((v, i) => collectBeats(v, `${path}[${i}]`, acc));
  } else if (isObj(node)) {
    for (const [k, v] of Object.entries(node)) {
      if (k === 'beats' && isObj(v)) {
        const ownerText = [node.text, node.label, node.title, node.number].find((t) => typeof t === 'string') as string | undefined;
        acc.push({ path: `${path}.beats`, beats: v, ownerText });
      } else {
        collectBeats(v, `${path}.${k}`, acc);
      }
    }
  }
};

/** Seconds a reader needs for `text`: floor MIN_VISIBLE, ~25 chars/s, capped so long lines don't demand the whole scene. */
export const readingSeconds = (text: string | undefined): number =>
  text ? Math.min(3.5, Math.max(MIN_VISIBLE_SECONDS, 0.8 + text.length * 0.04)) : MIN_VISIBLE_SECONDS;

const PLACEHOLDER_HOST = /(example\.(com|org)|placeholder|your-cdn|todo|changeme|localhost)/i;

const ALL_RULES = [
  'schema', 'unknown_keys', 'midscene_name', 'layout_type', 'transition_type', 'slot_names', 'slots_filled',
  'slot_layout_reconcile', 'sidebyside_layout', 'midscene_config', 'content_shape', 'duration_bounds', 'beat_timing',
  'text_length', 'text_budget', 'audio_url', 'lottie_key',
] as const;

export const rulesChecked = (): ValidationIssue['rule'][] => [...ALL_RULES];

export const validateConfig = (
  config: KnoMotionVideoConfig,
  caps: RendererCapabilities,
  options: ValidateOptions = {},
): ValidationIssue[] => {
  const issues: ValidationIssue[] = [];
  const fps = caps.constraints.fpsFixed;
  const format: Format = (config.format as Format) ?? 'desktop';
  const countLimits: Record<string, number> = { ...caps.constraints };

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
    const layout = scene.config?.layout;
    const layoutType: string | undefined = layout?.type;
    const layoutKnown = !!layoutType && caps.layoutTypes.includes(layoutType);
    if (layoutType && !layoutKnown) {
      push('layout_type', 'error', `scenes[${si}].config.layout.type`, `unknown layout "${layoutType}"`, { expected: caps.layoutTypes.join(' | ') });
    }

    const items = slotItemsOf(scene, si);
    const slotNames = new Set(Object.keys(scene?.config?.slots ?? {}));
    // What the renderer will actually carve for this layout in this format.
    const resolved = resolveSlots(layout, format, caps.layoutGeometry);

    if (layoutKnown) {
      // slot_layout_reconcile (a): options the renderer would otherwise default silently
      const missing = missingLayoutOptions(layout);
      if (missing.length) {
        push('slot_layout_reconcile', 'error', `scenes[${si}].config.layout.options`,
          `layout "${layoutType}" needs options.${missing.join(' and options.')} — without it the renderer silently defaults the slot count and content may land in slots that do not exist`);
      }

      // slot_names: name does not belong to this layout family at all
      for (const name of slotNames) {
        if (!slotNameAllowed(layoutType!, name)) {
          push('slot_names', 'error', `scenes[${si}].config.slots.${name}`, `slot "${name}" is not valid for layout "${layoutType}"`);
        }
      }

      // slot_layout_reconcile (b): the layout does not produce this slot → the renderer drops it (blank).
      // After a vocabulary fold every unproduced slot is reported against the fold (the family check
      // above is about the model's spelling, not its intent); otherwise only family-fitting names are,
      // since slot_names already covers the rest.
      const folded = typeof layout?._coercedFrom === 'string';
      const orphaned = [...slotNames].filter((n) => !(n in resolved) && (folded || slotNameAllowed(layoutType!, n)));
      if (orphaned.length) {
        const produced = Object.keys(resolved).join(', ');
        if (folded) {
          const from = layout._coercedFrom as string;
          const hint = /side.?by.?side/i.test(from)
            ? ` "sideBySide" is a MID-SCENE, not a layout: use layout {"type":"full"} and put {"midScene":"sideBySide", config:{left:…, right:…}} in the "full" slot.`
            : ` Either pick a layout that produces these slots, or rename them to ones "${layoutType}" produces.`;
          push('slot_layout_reconcile', 'error', `scenes[${si}].config.layout`,
            `layout "${from}" is not a layout type; it was folded to "${layoutType}", which produces slots [${produced}] — the slots [${orphaned.join(', ')}] would never render.${hint}`);
        } else {
          push('slot_layout_reconcile', 'error', `scenes[${si}].config.slots.${orphaned[0]}`,
            `layout "${layoutType}"${layout?.options ? ` with options ${JSON.stringify(layout.options)}` : ''} produces slots [${produced}]; slots [${orphaned.join(', ')}] are not among them and would never render`);
        }
      }

      // slots_filled: every content slot the layout produces has content
      if (!missing.length) {
        const slots = scene?.config?.slots ?? {};
        for (const req of requiredContentSlots(resolved, slotNames)) {
          const val = (slots as any)[req];
          const filled = Array.isArray(val) ? val.length > 0 : isObj(val);
          if (!filled) push('slots_filled', 'error', `scenes[${si}].config.slots.${req}`, `declared slot "${req}" for layout "${layoutType}" is empty`);
        }
      }
    }

    // content_shape (only when the plan's shape for this scene is known)
    const shape = options.contentShapes?.[sceneId];
    const allowed = allowedMidScenesFor(shape, caps);

    // Latest exit among the scene's content, for the persistence check.
    let latestExit = -Infinity;
    let anyContent = false;

    // Per-slot rules
    items.forEach((item) => {
      // midscene_name
      if (!caps.canonicalMidSceneKeys.includes(item.midScene)) {
        push('midscene_name', 'error', `${item.basePath}.midScene`, `"${item.midScene}" is not a renderable mid-scene (use a canonical key)`, { expected: caps.canonicalMidSceneKeys.join(' | ') });
        return; // skip deep config validation for unknown components
      }
      anyContent = true;

      // content_shape
      if (allowed && item.slotName !== 'header' && !allowed.includes(item.midScene)) {
        push('content_shape', 'error', `${item.basePath}.midScene`,
          `scene "${sceneId}" is planned as contentShape "${shape}"; "${item.midScene}" is outside its allowed set`, { expected: allowed.join(' | ') });
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

      // text_length (manifest count limits — advisory; text_budget below is the hard one)
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

      // text_budget (geometry-derived, error)
      const metrics = metricsFor(caps.textMetrics, item.midScene);
      const slotArea = resolved[item.slotName];
      if (metrics && slotArea) {
        const arrayKey = metrics.array;
        const itemCount = arrayKey && Array.isArray(cfg[arrayKey]) ? cfg[arrayKey].length : 1;
        const cols = effectiveColumns(item.midScene, cfg, slotArea, itemCount);
        const budget = computeTextBudget(item.midScene, slotArea, metrics, countLimits, caps.textMetrics, cols);
        for (const o of checkTextBudget(cfg, budget, metrics)) {
          const what = o.kind === 'count' ? `${o.actual} ${o.path} (max ${o.max})` : `${o.path} is ${o.actual} chars (max ${o.max})`;
          push('text_budget', 'error', `${item.basePath}.config.${o.path}`,
            `${what} — exceeds the text budget for ${describeBudget(item.slotName, budget)}. Shorten, split across scenes, or use a larger slot.`,
            { expected: String(o.max), received: String(o.actual) });
        }
      }

      // lottie_key (heroText)
      if (item.midScene === 'heroText' && cfg.heroType === 'lottie' && typeof cfg.heroRef === 'string') {
        const ref = cfg.heroRef as string;
        if (!/^https?:\/\//.test(ref) && !caps.lottieKeys.has(ref)) {
          push('lottie_key', 'warning', `${item.basePath}.config.heroRef`, `lottie heroRef "${ref}" is not a known registry key or URL`);
        }
      }

      // beat_timing — the top-level beats of this slot item
      const top = isObj(cfg.beats) ? cfg.beats : undefined;
      const topStart = num(top?.start ?? top?.entrance);
      const topExit = num(top?.exit);
      if (!top || topExit === undefined) {
        push('beat_timing', 'error', `${item.basePath}.config.beats.exit`,
          `beats.exit is required — without it the renderer removes this content ~${RENDERER_DEFAULT_EXIT}s after it enters, leaving the rest of the ${durationSec.toFixed(1)}s scene blank`);
        latestExit = Math.max(latestExit, (topStart ?? 0.5) + (RENDERER_DEFAULT_EXIT - 0.5));
      } else {
        latestExit = Math.max(latestExit, topExit);
      }

      // beat_timing — textReveal needs per-line beats (timing owns them; hand authors must supply them)
      if (item.midScene === 'textReveal' && Array.isArray(cfg.lines)) {
        cfg.lines.forEach((line: any, li: number) => {
          if (!isObj(line) || !isObj(line.beats) || num(line.beats.start) === undefined) {
            push('beat_timing', 'error', `${item.basePath}.config.lines[${li}].beats`, `textReveal line ${li + 1} needs beats.start (and exit); per-line beats drive when each line appears`);
          }
        });
      }

      // beat_timing — every beats block in this slot: range, order, minimum visible time
      const beatsList: { path: string; beats: Record<string, unknown>; ownerText?: string }[] = [];
      collectBeats(item.config, `${item.basePath}.config`, beatsList);
      for (const { path, beats, ownerText } of beatsList) {
        const start = num(beats.start ?? beats.entrance);
        const exit = num(beats.exit);
        if (start !== undefined && exit !== undefined && start >= exit) {
          push('beat_timing', 'error', path, `beats.start (${start}) must be < beats.exit (${exit})`);
        }
        for (const field of ['start', 'exit', 'entrance', 'hold', 'emphasis'] as const) {
          const v = num((beats as any)[field]);
          if (v === undefined) continue;
          if (v < 0 || v > durationSec + 0.01) {
            push('beat_timing', 'error', `${path}.${field}`, `beats.${field}=${v}s is outside the scene (0–${durationSec.toFixed(1)}s) — beats are SECONDS from the scene start`);
          }
        }
        // sideBySide's slider is a motion cue, not readable content; its window may be short.
        if (start !== undefined && exit !== undefined && exit > start && !/\.slider\.beats$/.test(path)) {
          const visible = exit - start;
          if (visible < MIN_VISIBLE_SECONDS - 0.01) {
            push('beat_timing', 'error', path, `visible for only ${visible.toFixed(2)}s (${start}s → ${exit}s); minimum is ${MIN_VISIBLE_SECONDS}s`);
          } else if (ownerText && visible < readingSeconds(ownerText) - 0.01) {
            push('beat_timing', 'warning', path, `"${ownerText.slice(0, 40)}${ownerText.length > 40 ? '…' : ''}" is visible ${visible.toFixed(2)}s; ~${readingSeconds(ownerText).toFixed(1)}s is comfortable to read`);
          }
        }
      }
    });

    // beat_timing — content must persist until near the scene end (no blank tail)
    if (anyContent && Number.isFinite(latestExit) && durationSec - latestExit > MAX_BLANK_TAIL_SECONDS) {
      push('beat_timing', 'error', `scenes[${si}].config.slots`,
        `all content has exited by ${latestExit.toFixed(1)}s but the scene lasts ${durationSec.toFixed(1)}s — ${(durationSec - latestExit).toFixed(1)}s of blank screen. Set beats.exit within ${MAX_BLANK_TAIL_SECONDS}s of the scene end`);
    }

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
