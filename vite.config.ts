import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Define aliases for directories
      '@src': path.resolve(__dirname, 'src'),
      // Add more aliases as needed
    },
  },
  server: {
    proxy: {
      '/api/naver': {
        target: 'https://openapi.naver.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/naver/, ''),
      },
    },
  },
});
