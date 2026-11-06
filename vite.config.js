import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    port: 5174,
    proxy: {
      '/api': 'http://localhost:4000'
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        sync: resolve(__dirname, 'sync.html')
      }
    }
  }
});
