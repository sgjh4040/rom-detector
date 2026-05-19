// MeasurementFooter.tsx — ROM 측정 페이지 하단 sticky 이전/다음 버튼.
import React from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

interface MeasurementFooterProps {
  nextLabel: string;
  isLast: boolean;
  hasNextStep: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export const MeasurementFooter: React.FC<MeasurementFooterProps> = ({
  nextLabel,
  isLast,
  hasNextStep,
  onPrev,
  onNext,
}) => (
  <footer className="fixed bottom-0 inset-x-0 z-30 border-t border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
    <div className="mx-auto flex max-w-2xl gap-2 px-4 py-3">
      <button
        type="button"
        onClick={onPrev}
        className="flex h-11 shrink-0 items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 text-sm font-bold text-[var(--color-foreground)] hover:bg-[var(--color-muted)] transition-colors"
      >
        <ArrowLeft className="size-4" />
        이전
      </button>
      <button
        type="button"
        onClick={onNext}
        className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[var(--color-accent)] px-4 text-sm font-bold text-[var(--color-accent-foreground)] hover:bg-[var(--color-accent)]/90 transition-colors"
      >
        {isLast && !hasNextStep && <Check className="size-4" />}
        {nextLabel}
        {!isLast || hasNextStep ? <ArrowRight className="size-4" /> : null}
      </button>
    </div>
  </footer>
);
