import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: '/PTMAWDIFAPI/', // לתאימות GitHub Pages
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html',
      },
    },
  },
});
