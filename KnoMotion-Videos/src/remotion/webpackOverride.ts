/**
 * Webpack override shared by the Remotion CLI (remotion.config.ts) and the
 * pipeline's programmatic bundler (knomotion-pipeline render-check / render).
 *
 * Both entry points must bundle identically or a scene that passes the
 * pipeline's pixel checks could still fail in Studio, and vice versa. Keep the
 * override here and import it from both places; never fork it.
 */

import type { WebpackOverrideFn } from '@remotion/bundler';

export const webpackOverride: WebpackOverrideFn = (currentConfiguration) => ({
  ...currentConfiguration,
  resolve: {
    ...currentConfiguration.resolve,
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.mjs'],
  },
  module: {
    ...currentConfiguration.module,
    rules: [
      // Disable fullySpecified for all JS/TS files to allow extension-less imports
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
      ...(currentConfiguration.module?.rules ?? []),
    ],
  },
});
