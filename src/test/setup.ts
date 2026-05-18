// vitest setup — 모든 컴포넌트 테스트 전 1회 실행.
// @testing-library/jest-dom 의 matcher 들을 vitest expect 에 등록.
import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// 테스트 간 DOM 정리 — RTL render 가 남긴 노드를 비워서 격리 보장.
afterEach(() => {
  cleanup();
});
