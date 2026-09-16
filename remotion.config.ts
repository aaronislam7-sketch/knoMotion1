/**
 * Remotion Configuration
 *
 * Configures the Remotion CLI bundler (webpack). The override itself lives in
 * KnoMotion-Videos/src/remotion/webpackOverride.ts so the pipeline's
 * programmatic bundle() (render-check, render) uses the exact same settings.
 */

import { Config } from '@remotion/cli/config';
import { webpackOverride } from './KnoMotion-Videos/src/remotion/webpackOverride';

Config.overrideWebpackConfig(webpackOverride);

// Set the entry point
Config.setEntryPoint('./KnoMotion-Videos/src/remotion/index.ts');

// Output configuration
Config.setOutputLocation('./out');
