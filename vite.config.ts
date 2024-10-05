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
      '/api/naver/oauth': {
        target: 'https://nid.naver.com/oauth2.0',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/naver\/oauth/, ''),
      },
      '/api/naver/info': {
        target: 'https://openapi.naver.com/v1',
        changeOrigin: true,
        // /api/naver/info를 제거하고 요청을 전달
        rewrite: path => path.replace(/^\/api\/naver\/info/, ''),
      },
      '/api/kakao/oauth': {
        target: 'https://kauth.kakao.com/oauth',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/kakao\/oauth/, ''),
      },
      '/api/kakao/info': {
        target: 'https://kapi.kakao.com/v2',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/kakao\/info/, ''),
      },
    },
  },
});
