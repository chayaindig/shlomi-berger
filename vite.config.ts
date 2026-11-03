import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// base './' so the build works from a GitHub Pages sub-path.
// Two pages: index.html (pomegranate, version A) and melon.html (watermelon, version B).
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  server: { port: 5195 },
  build: { rollupOptions: { input: { main: 'index.html', melon: 'melon.html' } } },
});
