// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.cjs',  // Asegúrate de que la configuración de PostCSS esté correcta
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
