// CtaButtons.tsx — CES 프로토콜의 메인 CTA (가이드 운동 시작 / 운동 완료).
// 데스크톱 사이드바와 모바일 메인 양쪽에서 재사용.
import React from "react";
import { ChevronRight, CheckCircle2, Play } from "lucide-react";

interface CtaButtonsProps {
  onStartPlayer: () => void;
  onComplete: () => void;
}

export const CtaButtons: React.FC<CtaButtonsProps> = ({
  onStartPlayer,
  onComplete,
}) => (
  <div className="flex flex-col gap-2">
    <button
      type="button"
      onClick={onStartPlayer}
      className="flex h-11 items-center justify-center gap-1.5 rounded-lg bg-[var(--color-accent)] text-sm font-bold text-[var(--color-accent-foreground)] hover:bg-[var(--color-accent)]/90 transition-colors"
    >
      <Play className="size-4" />
      가이드 운동 시작
      <ChevronRight className="size-4" />
    </button>
    <button
      type="button"
      onClick={onComplete}
      className="flex h-11 items-center justify-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-sm font-bold text-[var(--color-foreground)] hover:bg-[var(--color-muted)] transition-colors"
    >
      <CheckCircle2 className="size-4" />
      운동 완료
      <ChevronRight className="size-4" />
    </button>
  </div>
);
