/**
 * Renderer capability bridge (Option A).
 *
 * Loads the renderer's capability manifest and per-mid-scene JSON Schemas AT
 * RUNTIME and compiles them with ajv. This is a one-directional *data*
 * dependency on the renderer SDK — the pipeline reads these files but never
 * imports renderer code. Keeps a single source of truth (no drift).
 *
 * Default location resolves to <repoRoot>/KnoMotion-Videos/src/sdk, overridable
 * via KNOMOTION_RENDERER_SDK_DIR (e.g. for tests or alternate layouts).
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv, { type ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';

/** canonical midScene key -> component schema file basename */
export const MIDSCENE_COMPONENT: Record<string, string> = {
  textReveal: 'TextRevealSequence',
  heroText: 'HeroTextEntranceExit',
  gridCards: 'GridCardReveal',
  checklist: 'ChecklistReveal',
  bubbleCallout: 'BubbleCalloutSequence',
  sideBySide: 'SideBySideCompare',
  iconGrid: 'IconGrid',
  cardSequence: 'CardSequence',
  bigNumber: 'BigNumberReveal',
  animatedCounter: 'AnimatedCounter',
  codeBlock: 'CodeBlockScene',
};

export interface RendererCapabilities {
  canonicalMidSceneKeys: string[];
  layoutTypes: string[];
  backgroundPresets: string[];
  transitionTypes: string[];
  stylePresets: string[];
  lottieKeys: Set<string>;
  constraints: {
    maxScenesPerVideo: number;
    maxCardsInGrid: number;
    maxColumnsInGrid: number;
    maxChecklistItems: number;
    maxTextLines: number;
    maxCallouts: number;
    fpsFixed: number;
  };
  /** Compiled per-mid-scene validators, keyed by canonical midScene key. */
  midSceneValidators: Record<string, ValidateFunction>;
  /** Raw mid-scene schemas (for shallow unknown-key checks), keyed by canonical key. */
  midSceneSchemas: Record<string, any>;
}

const defaultSdkDir = (): string => {
  if (process.env.KNOMOTION_RENDERER_SDK_DIR) return process.env.KNOMOTION_RENDERER_SDK_DIR;
  const here = path.dirname(fileURLToPath(import.meta.url)); // pipeline/core/capabilities
  return path.resolve(here, '../../../../KnoMotion-Videos/src/sdk');
};

const readJson = async (file: string): Promise<any> => JSON.parse(await fs.readFile(file, 'utf8'));

let cached: RendererCapabilities | undefined;

export const loadRendererCapabilities = async (sdkDir = defaultSdkDir(), useCache = true): Promise<RendererCapabilities> => {
  if (useCache && cached) return cached;

  const manifest = await readJson(path.join(sdkDir, 'capability-manifest.json'));
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);

  const midSceneValidators: Record<string, ValidateFunction> = {};
  const midSceneSchemas: Record<string, any> = {};
  for (const [key, component] of Object.entries(MIDSCENE_COMPONENT)) {
    const schema = await readJson(path.join(sdkDir, 'mid-scenes', 'schemas', `${component}.schema.json`));
    midSceneSchemas[key] = schema;
    midSceneValidators[key] = ajv.compile(schema);
  }

  const c = manifest.constraints ?? {};
  cached = {
    canonicalMidSceneKeys: manifest.canonicalMidSceneKeys ?? Object.keys(MIDSCENE_COMPONENT),
    layoutTypes: (manifest.layouts ?? []).map((l: any) => l.type),
    backgroundPresets: (manifest.backgrounds ?? []).map((b: any) => b.preset),
    transitionTypes: (manifest.transitions ?? []).map((t: any) => t.type),
    stylePresets: manifest.stylePresets ?? [],
    lottieKeys: new Set<string>(manifest.lottieKeys ?? []),
    constraints: {
      maxScenesPerVideo: c.maxScenesPerVideo ?? 20,
      maxCardsInGrid: c.maxCardsInGrid ?? 8,
      maxColumnsInGrid: c.maxColumnsInGrid ?? 8,
      maxChecklistItems: c.maxChecklistItems ?? 12,
      maxTextLines: c.maxTextLines ?? 8,
      maxCallouts: c.maxCallouts ?? 10,
      fpsFixed: c.fpsFixed ?? 30,
    },
    midSceneValidators,
    midSceneSchemas,
  };
  return cached;
};

/** Test helper: clear the module cache so a fresh sdkDir is re-read. */
export const __clearCapabilitiesCache = () => {
  cached = undefined;
};
