import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  const isHmrDisabled = process.env.DISABLE_HMR === 'true';

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        src: path.resolve(__dirname, './src'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      strictPort: true,
      cors: true,
      // Robust HMR configuration
      hmr: isHmrDisabled
        ? false
        : {
            clientPort: 3000,
            overlay: true,
          },
      // Reliable file watching with polling when watching is active
      watch: isHmrDisabled
        ? null
        : {
            usePolling: true,
            interval: 100,
          },
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
      emptyOutDir: false,
    },
  };
});
