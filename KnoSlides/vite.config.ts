import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@knomotion': resolve(__dirname, '../KnoMotion-Videos/src/sdk'),
    },
  },
  server: {
    port: 3001,
    open: true,
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'KnoSlides',
      fileName: 'knoslides',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'framer-motion'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'framer-motion': 'FramerMotion',
        },
      },
    },
  },
});
