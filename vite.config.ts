import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// base './' so the build works from a GitHub Pages sub-path.
// Three pages: index.html (pomegranate, A), melon.html (watermelon, B), combo.html (the two combined, C), d.html (A with carved watermelons, D).
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  server: { port: 5195 },
  build: { rollupOptions: { input: { main: 'index.html', melon: 'melon.html', combo: 'combo.html', d: 'd.html', terms: 'terms.html', shipping: 'shipping.html', privacy: 'privacy.html', accessibility: 'accessibility.html', thanks: 'thanks.html', notfound: '404.html', admin: 'admin.html' } } },
});
