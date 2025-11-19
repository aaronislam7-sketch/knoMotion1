import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  optimizeDeps: {
    // Include remotion packages explicitly to avoid stale cache issues
    // This ensures Vite properly detects and pre-bundles remotion dependencies
    include: [
      'remotion',
      '@remotion/google-fonts',
      '@remotion/fonts',
      '@remotion/player',
      '@remotion/tailwind',
      '@remotion/transitions',
    ],
    // Exclude problematic packages from pre-bundling if needed
    exclude: [],
    // Use esbuild options for better compatibility
    esbuildOptions: {
      target: 'es2020',
    },
  },
  // Clear cache on dependency changes
  clearScreen: false,
});
