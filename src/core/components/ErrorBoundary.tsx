// ErrorBoundary.tsx — 앱 전역 렌더 크래시 안전망.
// 의료/재활 현장에서 흰 화면 대신 복구 안내를 보여준다. React 에서 렌더 에러를
// 잡으려면 클래스 컴포넌트가 필요 (함수형 훅으로는 componentDidCatch 불가).
import React from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message?: string;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : undefined,
    };
  }

  componentDidCatch(error: unknown): void {
    // dev 에서만 콘솔 출력 — prod 번들에선 제거. 환자 데이터는 절대 외부 전송 안 함.
    if (import.meta.env.DEV) {
      console.error("[ErrorBoundary]", error);
    }
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  private handleHome = (): void => {
    // 라우터 외부(클래스)라 navigate 불가 → 전체 새로고침으로 홈 복귀.
    window.location.assign(import.meta.env.BASE_URL);
  };

  render(): React.ReactNode {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        data-redesign="true"
        role="alert"
        className="min-h-svh flex flex-col items-center justify-center bg-[var(--color-background)] text-[var(--color-foreground)] font-sans p-6 text-center"
      >
        <div className="flex size-16 items-center justify-center rounded-full bg-[var(--primary-bg-soft)] text-[var(--primary)] mb-4 text-3xl">
          ⚠️
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight">
          일시적인 오류가 발생했어요
        </h1>
        <p className="mt-2 max-w-md text-sm font-medium text-[var(--color-muted-foreground)]">
          화면을 그리는 중 문제가 생겼습니다. 측정 기록은 이 기기에 안전하게
          저장돼 있으니, 새로고침하거나 홈으로 돌아가 주세요.
        </p>
        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={this.handleReload}
            className="flex h-11 items-center rounded-lg bg-[var(--primary)] px-5 text-sm font-bold text-white transition-colors hover:bg-[var(--primary-dark)]"
          >
            새로고침
          </button>
          <button
            type="button"
            onClick={this.handleHome}
            className="flex h-11 items-center rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-5 text-sm font-bold text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-muted)]"
          >
            홈으로
          </button>
        </div>
      </div>
    );
  }
}
