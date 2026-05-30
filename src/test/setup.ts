// vitest setup — 모든 컴포넌트 테스트 전 1회 실행.
// @testing-library/jest-dom 의 matcher 들을 vitest expect 에 등록.
import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// localStorage 폴리필 — jsdom 환경이지만 Node 22+ 의 실험적 native localStorage 와
// 충돌해 window.localStorage 가 undefined 로 남는 케이스 보강. 인메모리 구현으로 결정적 보장.
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map<string, string>();
  const mock: Storage = {
    get length() {
      return store.size;
    },
    clear: () => store.clear(),
    getItem: (key) => (store.has(key) ? store.get(key)! : null),
    key: (index) => Array.from(store.keys())[index] ?? null,
    removeItem: (key) => {
      store.delete(key);
    },
    setItem: (key, value) => {
      store.set(key, String(value));
    },
  };
  Object.defineProperty(globalThis, 'localStorage', { value: mock, configurable: true });
}

// 테스트 간 DOM 정리 — RTL render 가 남긴 노드를 비워서 격리 보장.
afterEach(() => {
  cleanup();
});
