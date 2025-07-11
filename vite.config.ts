import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  // Base path for your GitHub Pages repo
  base: '/FedExpectations/',
  // Ensure Vite uses the project root with index.html
  root: '.',
  plugins: [react()],
  build: {
    rollupOptions: {
      // Explicitly specify the entry HTML file
      input: resolve(__dirname, 'index.html'),
    },
  },
});
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/FedExpectations/',
  plugins: [react()]
});
