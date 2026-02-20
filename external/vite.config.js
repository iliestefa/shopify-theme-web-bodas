import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    minify: true,
    sourcemap: false,
    chunkSizeWarningLimit: 3000,
    outDir: '../../assets',
    emptyOutDir: false,
    rollupOptions: {
      input: ['src/main.js', 'src/main.css'],
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].chunk.js',
        assetFileNames: '[name].[ext]',
      },
    },
  },
  root: 'src',
});
