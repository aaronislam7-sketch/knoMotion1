import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  optimizeDeps: {
    // Include remotion packages explicitly to avoid stale cache issues
    include: [
      'remotion',
      '@remotion/fonts',
      '@remotion/player',
      '@remotion/tailwind',
      '@remotion/transitions',
    ],
    // Exclude google-fonts from pre-bundling due to dynamic imports with missing files
    exclude: ['@remotion/google-fonts'],
    // Use esbuild options for better compatibility
    esbuildOptions: {
      target: 'es2020',
    },
  },
  // Clear cache on dependency changes
  clearScreen: false,
});
