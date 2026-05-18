import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // 명시 import 강제 — IDE 자동완성/리네임 안전
    globals: false,
    // lib 함수 단위 테스트만 — DOM 안 씀
    environment: 'node',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
    reporters: 'default',
  },
});
