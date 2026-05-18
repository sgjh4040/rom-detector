import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()], // .tsx 컴포넌트 테스트용 — JSX 변환 + Fast Refresh
  test: {
    globals: false,
    // jsdom — 컴포넌트 테스트에서 document 필요. node 함수 테스트는 영향 없음.
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
    reporters: 'default',
  },
});
