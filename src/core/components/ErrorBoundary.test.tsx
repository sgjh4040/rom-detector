import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from './ErrorBoundary';

const Boom: React.FC = () => {
  throw new Error('test crash');
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // 자식이 던지는 에러로 React 가 콘솔에 찍는 노이즈 억제
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('정상 자식은 그대로 렌더한다', () => {
    render(
      <ErrorBoundary>
        <div>정상 콘텐츠</div>
      </ErrorBoundary>,
    );
    expect(screen.getByText('정상 콘텐츠')).toBeInTheDocument();
  });

  it('자식이 throw 하면 fallback 안내 + 복구 버튼을 보여준다', () => {
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('일시적인 오류가 발생했어요')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '새로고침' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '홈으로' })).toBeInTheDocument();
  });
});
