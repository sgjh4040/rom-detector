// CesProtocolHeader.tsx — CES 프로토콜 페이지 상단 sticky 헤더 (뒤로가기 + 타이틀 + 환자).
import React from "react";
import { ArrowLeft } from "lucide-react";

interface CesProtocolHeaderProps {
  patientName?: string;
  patientAge?: number;
  onBack: () => void;
}

export const CesProtocolHeader: React.FC<CesProtocolHeaderProps> = ({
  patientName,
  patientAge,
  onBack,
}) => (
  <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur">
    <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
      <button
        type="button"
        onClick={onBack}
        aria-label="홈으로"
        className="flex size-9 shrink-0 items-center justify-center rounded-md text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
      >
        <ArrowLeft className="size-5" />
      </button>
      <div className="min-w-0 flex-1">
        <div className="text-base font-bold text-[var(--color-foreground)]">
          CES 재활 프로토콜
        </div>
        <div className="text-xs text-[var(--color-muted-foreground)]">
          {patientName ?? "환자"}
          {patientAge ? ` · ${patientAge}세` : ""}
        </div>
      </div>
    </div>
  </header>
);
