/**
 * Programmatic still rendering for Stage 9 render-check (Sept M2).
 *
 * Wraps @remotion/bundler + @remotion/renderer so the stage can ask for "scene
 * N at frame F as RGBA pixels" without knowing about webpack, browsers or
 * compositions. Both packages are imported lazily: they live in the monorepo
 * root's node_modules (the renderer's devDependencies), and the pipeline must
 * keep working — with render-check reported as skipped — where they are absent.
 *
 * Cost model: bundling is the expensive step (tens of seconds) and is done at
 * most once per process; the headless browser is opened once per handle; each
 * still is then a few hundred ms. Stills are rendered from a SINGLE-scene
 * config so frames are scene-relative and no transition overlaps the pixels.
 */

import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import type { KnoMotionVideoConfig, SceneItem } from '../../schemas/KnoMotionVideoConfig';
import type { Logger } from '../logger';
import { webpackOverride } from '../../../../KnoMotion-Videos/src/remotion/webpackOverride';

const PIPELINE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const REPO_ROOT = path.resolve(PIPELINE_DIR, '..', '..');
/** Same entry point as remotion.config.ts / `npx remotion studio`. */
export const REMOTION_ENTRY = path.join(REPO_ROOT, 'KnoMotion-Videos', 'src', 'remotion', 'index.ts');
/** The generic composition that renders any KnoMotionVideoConfig. */
export const COMPOSITION_ID = 'KnoMotionVideo';

const require = createRequire(import.meta.url);

/** True when @remotion/renderer and @remotion/bundler resolve from here. */
export const isRendererAvailable = (): boolean => {
  try {
    require.resolve('@remotion/renderer');
    require.resolve('@remotion/bundler');
    return true;
  } catch {
    return false;
  }
};

type RendererModule = typeof import('@remotion/renderer');
type BundlerModule = typeof import('@remotion/bundler');

const loadModules = async (): Promise<{ renderer: RendererModule; bundler: BundlerModule }> => {
  const renderer = (await import(/* @vite-ignore */ '@remotion/renderer')) as RendererModule;
  const bundler = (await import(/* @vite-ignore */ '@remotion/bundler')) as BundlerModule;
  return { renderer, bundler };
};

// One bundle per process per entry point; every handle shares it.
const bundleCache = new Map<string, Promise<string>>();

export const bundleOnce = (opts: { entryPoint?: string; publicDir?: string; logger?: Logger } = {}): Promise<string> => {
  const entryPoint = opts.entryPoint ?? REMOTION_ENTRY;
  const publicDir = opts.publicDir ?? path.join(REPO_ROOT, 'public');
  const key = `${entryPoint}::${publicDir}`;
  let pending = bundleCache.get(key);
  if (!pending) {
    pending = (async () => {
      const { bundler } = await loadModules();
      const started = Date.now();
      opts.logger?.info('render-check: bundling Remotion project (once per process)', { entryPoint });
      const serveUrl = await bundler.bundle({ entryPoint, publicDir, webpackOverride, ignoreRegisterRootWarning: true });
      opts.logger?.info('render-check: bundle ready', { ms: Date.now() - started });
      return serveUrl;
    })();
    bundleCache.set(key, pending);
    pending.catch(() => bundleCache.delete(key));
  }
  return pending;
};

export interface StillRequest {
  /** Single-scene config to render (see `singleSceneConfig`). */
  config: KnoMotionVideoConfig;
  /** Scene-relative frame index. */
  frame: number;
  /** Render scale (1 = native 1920×1080). 0.5 quarters the pixel work. */
  scale: number;
}

export interface StillRenderer {
  readonly serveUrl: string;
  /** Renders one PNG still in memory; returns its bytes (the caller decides what to keep). */
  renderStill(req: StillRequest): Promise<Buffer>;
  close(): Promise<void>;
}

/** A config containing just `scene`, so still frames are scene-relative. */
export const singleSceneConfig = (config: KnoMotionVideoConfig, scene: SceneItem): KnoMotionVideoConfig => ({
  ...config,
  scenes: [{ ...scene, transition: undefined }],
});

/** Same scene, no slots: the background-only baseline the pixel checks diff against. */
export const backgroundOnly = (scene: SceneItem): SceneItem => ({
  ...scene,
  config: { ...scene.config, slots: {} },
});

export const openStillRenderer = async (opts: { publicDir?: string; logger?: Logger } = {}): Promise<StillRenderer> => {
  const { renderer } = await loadModules();
  const serveUrl = await bundleOnce(opts);
  // logLevel here governs what the browser's console output is forwarded as;
  // the renderer's font loaders warn on every page load and would flood the run.
  const browser = await renderer.openBrowser('chrome', { chromiumOptions: { gl: 'angle' }, logLevel: 'error' });

  // selectComposition runs calculateMetadata for the given props; cache per
  // scene so a scene's three stills cost one metadata round-trip.
  const compositions = new Map<string, Promise<Awaited<ReturnType<RendererModule['selectComposition']>>>>();
  const compositionFor = (config: KnoMotionVideoConfig) => {
    const key = JSON.stringify(config);
    let pending = compositions.get(key);
    if (!pending) {
      pending = renderer.selectComposition({ serveUrl, id: COMPOSITION_ID, inputProps: config, puppeteerInstance: browser, logLevel: 'error' });
      compositions.set(key, pending);
    }
    return pending;
  };

  return {
    serveUrl,
    async renderStill(req) {
      const composition = await compositionFor(req.config);
      const { buffer } = await renderer.renderStill({
        composition,
        serveUrl,
        inputProps: req.config,
        frame: Math.min(req.frame, composition.durationInFrames - 1),
        imageFormat: 'png',
        scale: req.scale,
        output: null,
        puppeteerInstance: browser,
        logLevel: 'error',
      });
      if (!buffer) throw new Error('render-check: renderStill returned no image buffer');
      return buffer;
    },
    async close() {
      await browser.close({ silent: true });
    },
  };
};
