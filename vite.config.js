// filepath: vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        background: 'src/background/index.js',
        content_script: 'src/content_script.js',
      },
      output: {
        entryFileNames: '[name].js',
        assetFileNames: (info) => {
          if (info.names.includes('styles')) return 'styles.css'
          return 'assets/[name][extname]'
        },
      },
    },
  },
});
