import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Base path for your GitHub Pages repo
  base: '/FedExpectations/',
  plugins: [react()]
});
