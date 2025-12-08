/**
 * Remotion Configuration
 * 
 * This file configures the Remotion bundler (webpack) to properly resolve
 * module imports without explicit file extensions.
 */

import { Config } from '@remotion/cli/config';

Config.overrideWebpackConfig((currentConfiguration) => {
  return {
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
  };
});

// Set the entry point
Config.setEntryPoint('./KnoMotion-Videos/src/remotion/index.ts');

// Output configuration
Config.setOutputLocation('./out');
